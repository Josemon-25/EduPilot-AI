import express from 'express';
import multer from 'multer';
import { PDFService } from '../services/pdfService.js';
import { AIService } from '../services/aiService.js';
import { store } from '../data/store.js';

const router = express.Router();

// Configure multer with memory storage & 10MB size limit
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB
  }
});

// POST /api/materials/upload
router.post('/materials/upload', upload.single('file'), async (req, res) => {
  try {
    const file = req.file;

    // 1. Validation
    try {
      PDFService.validatePDF(file);
    } catch (valErr) {
      return res.status(400).json({
        error: 'Validation Error',
        message: valErr.message
      });
    }

    // 2. Extraction
    let extracted;
    try {
      extracted = await PDFService.extractText(file.buffer);
    } catch (parseErr) {
      return res.status(422).json({
        error: 'Extraction Failure',
        message: parseErr.message
      });
    }

    // 3. Concept identification
    const detectedTopics = AIService.extractTopics(extracted.text, file.originalname);

    const isImageOnly = Boolean(extracted.isScannedImageOnly);
    const summaryText = isImageOnly
      ? `Document containing ${extracted.pageCount} page(s). Note: Scanned raster images or slides detected without extractable digital text.`
      : `Document containing ${extracted.pageCount} page(s) and ~${extracted.wordCount} words. Key concepts: ${detectedTopics.slice(0, 3).join(', ')}.`;

    const newMaterial = {
      id: `mat-${Date.now()}`,
      fileName: file.originalname,
      fileSize: file.size,
      mimeType: file.mimetype,
      uploadedAt: new Date().toISOString(),
      status: isImageOnly ? 'warning_image_only' : 'processed',
      hasExtractableText: extracted.hasExtractableText,
      isScannedImageOnly: isImageOnly,
      pageCount: extracted.pageCount,
      wordCount: extracted.wordCount,
      topics: detectedTopics,
      summary: summaryText,
      sections: extracted.sections.slice(0, 5),
      pages: extracted.pages,
      passages: extracted.passages,
      sampleExtractedText: extracted.text.slice(0, 800),
      warning: extracted.extractionWarning || null
    };

    console.log(
      `[Materials] Material registered: ID=${newMaterial.id}, File="${newMaterial.fileName}", ` +
      `Pages=${newMaterial.pageCount}, Words=${newMaterial.wordCount}, HasText=${newMaterial.hasExtractableText}`
    );

    store.addMaterial(newMaterial);

    res.status(201).json({
      success: true,
      message: 'Learning material successfully uploaded and processed.',
      material: newMaterial
    });
  } catch (err) {
    console.error('[Materials] Upload failed:', err);
    res.status(500).json({
      error: 'Server Error',
      message: err.message || 'An unexpected error occurred while processing the file.'
    });
  }
});

// GET /api/materials
router.get('/materials', (req, res) => {
  try {
    const materials = store.getMaterials();
    res.json({
      success: true,
      count: materials.length,
      materials
    });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

// GET /api/materials/:id
router.get('/materials/:id', (req, res) => {
  try {
    const material = store.getMaterialById(req.params.id);
    if (!material) {
      return res.status(404).json({
        error: 'Not Found',
        message: `Material with ID ${req.params.id} does not exist.`
      });
    }
    res.json({ success: true, material });
  } catch (err) {
    res.status(500).json({ error: 'Server Error', message: err.message });
  }
});

export default router;
