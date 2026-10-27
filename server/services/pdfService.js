import fs from 'fs';
import pdf from 'pdf-parse';

export class PDFService {
  /**
   * Validates the uploaded file buffer / metadata
   */
  static validatePDF(file) {
    if (!file) {
      throw new Error('No file provided for upload.');
    }

    const validMimes = ['application/pdf'];
    const hasPdfExtension = file.originalname && file.originalname.toLowerCase().endsWith('.pdf');

    if (!validMimes.includes(file.mimetype) && !hasPdfExtension) {
      throw new Error('Invalid file format. Only valid PDF documents (.pdf) are supported.');
    }

    const maxBytes = 10 * 1024 * 1024; // 10MB limit
    if (file.size > maxBytes) {
      throw new Error(`File is too large (${(file.size / (1024 * 1024)).toFixed(1)}MB). Maximum allowed size is 10MB.`);
    }

    return true;
  }

  /**
   * Extracts text, page count, and metadata from a PDF buffer or path
   */
  static async extractText(filePathOrBuffer) {
    try {
      let dataBuffer;
      if (typeof filePathOrBuffer === 'string') {
        dataBuffer = fs.readFileSync(filePathOrBuffer);
      } else {
        dataBuffer = filePathOrBuffer;
      }

      if (!dataBuffer || dataBuffer.length === 0) {
        throw new Error('Uploaded PDF file is empty (0 bytes).');
      }

      // Check PDF header signature '%PDF-'
      const header = dataBuffer.slice(0, 5).toString('ascii');
      if (!header.startsWith('%PDF')) {
        throw new Error('Corrupted or invalid PDF header. Please provide a standard readable PDF.');
      }

      // Ensure standalone buffer with byteOffset == 0 to prevent Node.js slab sharing issues in pdf.js
      let cleanBuffer = dataBuffer;
      if (dataBuffer.byteOffset !== 0 || dataBuffer.byteLength !== dataBuffer.buffer.byteLength) {
        cleanBuffer = new Uint8Array(dataBuffer);
      }

      // Collect authentic per-page text via pagerender callback
      const rawPages = [];
      const options = {
        pagerender: async function (pageData) {
          return pageData.getTextContent({
            normalizeWhitespace: false,
            disableCombineTextItems: false
          }).then(function (textContent) {
            let lastY, text = '';
            for (const item of textContent.items) {
              if (lastY === item.transform[5] || !lastY) {
                text += item.str;
              } else {
                text += '\n' + item.str;
              }
              lastY = item.transform[5];
            }
            const clean = text.trim();
            rawPages.push({
              num: pageData.pageIndex + 1,
              text: clean
            });
            return text;
          });
        }
      };

      const textResult = await pdf(cleanBuffer, options);

      const rawText = textResult.text ? textResult.text.trim() : '';
      const numPages = textResult.numpages || 1;
      rawPages.sort((a, b) => a.num - b.num);

      // Detect scanned or image-only documents by stripping page number/footer artifacts
      const substantiveText = rawText
        .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
        .replace(/\bpage\s+\d+(\s+of\s+\d+)?\b/gi, '')
        .replace(/\bp\.\s*\d+\b/gi, '')
        .replace(/[\r\n\t\s]+/g, ' ')
        .trim();

      const hasExtractableText = substantiveText.length >= 40;
      const isScannedImageOnly = !hasExtractableText;

      // Safe diagnostic log without exposing document contents or secrets
      console.log(
        `[PDFService] Processed document: ${numPages} page(s), ${rawText.length} raw characters, ` +
        `${substantiveText.length} substantive characters. ` +
        `Status: ${hasExtractableText ? 'Extractable digital text' : 'Scanned/Image-only document'}`
      );

      // Preserve actual page metadata and extract verified passages per page
      const pages = [];
      const passages = [];

      if (hasExtractableText && rawPages.length > 0) {
        for (const p of rawPages) {
          const pageNum = p.num || (pages.length + 1);
          const pageCleanText = (p.text || '').trim();
          if (pageCleanText.length > 0) {
            pages.push({
              pageNumber: pageNum,
              pageReference: `Page ${pageNum}`,
              text: pageCleanText,
              wordCount: pageCleanText.split(/\s+/).length
            });

            // Split page text into distinct semantic paragraphs/passages
            const paras = pageCleanText
              .split(/\n\s*\n/)
              .map((str) => str.replace(/\s+/g, ' ').trim())
              .filter((str) => str.length >= 15);

            if (paras.length === 0 && pageCleanText.length > 0) {
              passages.push({
                id: `pas-p${pageNum}-1`,
                pageNumber: pageNum,
                pageReference: `Page ${pageNum}`,
                text: pageCleanText,
                wordCount: pageCleanText.split(/\s+/).length
              });
            } else {
              paras.forEach((para, idx) => {
                passages.push({
                  id: `pas-p${pageNum}-${idx + 1}`,
                  pageNumber: pageNum,
                  pageReference: `Page ${pageNum}`,
                  text: para,
                  wordCount: para.split(/\s+/).length
                });
              });
            }
          }
        }
      }

      // Fallback if parser did not return distinct pages but text is extractable
      if (hasExtractableText && pages.length === 0 && rawText.length > 0) {
        pages.push({
          pageNumber: 1,
          pageReference: 'Page 1',
          text: rawText,
          wordCount: rawText.split(/\s+/).length
        });
        const paras = rawText
          .split(/\n\s*\n/)
          .map((str) => str.replace(/\s+/g, ' ').trim())
          .filter((str) => str.length >= 15);
        paras.forEach((para, idx) => {
          passages.push({
            id: `pas-p1-${idx + 1}`,
            pageNumber: 1,
            pageReference: 'Page 1',
            text: para,
            wordCount: para.split(/\s+/).length
          });
        });
      }

      // If document is image-only/scanned, generate informative page placeholders without fabricated text
      if (!hasExtractableText) {
        for (let i = 1; i <= numPages; i++) {
          pages.push({
            pageNumber: i,
            pageReference: `Page ${i}`,
            text: `[Page ${i}: Raster image or scanned slide without extractable digital text]`,
            wordCount: 0,
            isImageOnly: true
          });
        }
      }

      // Chunk long documents into manageable conceptual sections
      const sections = hasExtractableText ? this.chunkText(rawText, numPages) : [];

      return {
        text: rawText,
        hasExtractableText,
        isScannedImageOnly,
        pageCount: numPages,
        wordCount: hasExtractableText ? rawText.split(/\s+/).length : 0,
        substantiveCharCount: substantiveText.length,
        pages,
        passages,
        sections,
        extractionWarning: isScannedImageOnly
          ? 'This document contains scanned images or slide graphics without extractable digital text fonts. EduPilot source-grounding requires digital text; citations cannot be verified against image-only documents.'
          : null
      };
    } catch (err) {
      throw new Error(`PDF Extraction Error: ${err.message}`);
    } finally {
      // pdf-parse v1.x manages internal resource cleanup automatically
    }
  }

  /**
   * Chunks extracted text into semantic sections with page estimation
   */
  static chunkText(text, pageCount) {
    const paragraphs = text.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const sections = [];
    let currentChunk = [];
    let currentWordCount = 0;
    const wordsPerPage = Math.max(150, Math.round(text.split(/\s+/).length / (pageCount || 1)));

    for (let i = 0; i < paragraphs.length; i++) {
      const p = paragraphs[i].trim();
      const pWords = p.split(/\s+/).length;
      currentChunk.push(p);
      currentWordCount += pWords;

      if (currentWordCount >= 600 || i === paragraphs.length - 1) {
        const chunkIndex = sections.length + 1;
        const estimatedPage = Math.min(pageCount, Math.max(1, Math.ceil((sections.length * 600) / wordsPerPage) + 1));

        sections.push({
          sectionNumber: chunkIndex,
          pageReference: `Page ${estimatedPage}`,
          text: currentChunk.join('\n\n'),
          wordCount: currentWordCount
        });

        currentChunk = [];
        currentWordCount = 0;
      }
    }

    return sections;
  }
}
