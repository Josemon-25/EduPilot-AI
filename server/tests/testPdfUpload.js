import { PDFService } from '../services/pdfService.js';
import { GroundingService } from '../services/groundingService.js';
import { AIService } from '../services/aiService.js';
import { store } from '../data/store.js';

// Construct valid 2-page PDF
const pdfBody = [
  '%PDF-1.4\n',
  '1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj\n',
  '2 0 obj << /Type /Pages /Kids [3 0 R 4 0 R] /Count 2 >> endobj\n',
  '3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 5 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj\n',
  '4 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 6 0 R /Resources << /Font << /F1 7 0 R >> >> >> endobj\n',
  '5 0 obj << /Length 77 >> stream\n',
  'BT /F1 12 Tf 50 700 Td (Lecture 1 on Distributed Consensus and Raft leader election invariants.) Tj ET\n',
  'endstream endobj\n',
  '6 0 obj << /Length 87 >> stream\n',
  'BT /F1 12 Tf 50 700 Td (Page 2: Practical Byzantine Fault Tolerance requires 3f plus 1 total replica nodes.) Tj ET\n',
  'endstream endobj\n',
  '7 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj\n'
].join('');

const offsets = [
  '0000000000 65535 f \n',
  String(pdfBody.indexOf('1 0 obj')).padStart(10, '0') + ' 00000 n \n',
  String(pdfBody.indexOf('2 0 obj')).padStart(10, '0') + ' 00000 n \n',
  String(pdfBody.indexOf('3 0 obj')).padStart(10, '0') + ' 00000 n \n',
  String(pdfBody.indexOf('4 0 obj')).padStart(10, '0') + ' 00000 n \n',
  String(pdfBody.indexOf('5 0 obj')).padStart(10, '0') + ' 00000 n \n',
  String(pdfBody.indexOf('6 0 obj')).padStart(10, '0') + ' 00000 n \n',
  String(pdfBody.indexOf('7 0 obj')).padStart(10, '0') + ' 00000 n \n'
];
const startxref = pdfBody.length;
const fullPdf = pdfBody + 'xref\n0 8\n' + offsets.join('') + 'trailer << /Size 8 /Root 1 0 R >>\nstartxref\n' + startxref + '\n%%EOF\n';

const pdfBuffer = Buffer.from(fullPdf, 'binary');

async function runVerification() {
  console.log('=== REAL PDF UPLOAD & SOURCE GROUNDING AUDIT ===');

  // 1. PDF Extraction & Page Number Origin
  console.log('\n--- 1. Testing PDF Page Number Origin ---');
  const extraction = await PDFService.extractText(pdfBuffer);
  console.log('Extraction numPages:', extraction.pageCount);
  console.log('Extracted pages array length:', extraction.pages.length);
  extraction.pages.forEach((p) => {
    console.log(`  Page ${p.pageNumber}: "${p.text}"`);
  });

  if (extraction.pages.length !== 2) throw new Error('Expected 2 pages extracted');
  if (extraction.pages[0].pageNumber !== 1) throw new Error('Page 1 num mismatch');
  if (extraction.pages[1].pageNumber !== 2) throw new Error('Page 2 num mismatch');
  console.log('[VERIFIED] PDF page numbers originate strictly from PDF extraction result, not estimated!');

  // Register real uploaded material
  const uploadedMaterial = {
    id: `mat-test-${Date.now()}`,
    fileName: 'Distributed_Systems_Consensus.pdf',
    fileSize: pdfBuffer.length,
    mimeType: 'application/pdf',
    uploadedAt: new Date().toISOString(),
    status: 'processed',
    pageCount: extraction.pageCount,
    wordCount: extraction.wordCount,
    topics: ['Distributed Consensus', 'Byzantine Fault Tolerance'],
    summary: 'Distributed systems notes covering Raft and PBFT.',
    pages: extraction.pages,
    passages: extraction.passages
  };
  store.addMaterial(uploadedMaterial);

  // 2. Query matching concept on Page 2
  console.log('\n--- 2. Testing Grounding on Real Uploaded PDF (Page 2 Concept) ---');
  const qPage2 = await AIService.tutorChat({
    query: 'How many replicas are required for Byzantine fault tolerance?',
    material: uploadedMaterial
  });
  console.log('Result Page 2:', {
    isGrounded: qPage2.isGrounded,
    groundingType: qPage2.groundingType,
    pageNumber: qPage2.pageNumber,
    citation: qPage2.sourceCitation,
    excerpt: qPage2.sourceExcerpt
  });
  if (!qPage2.isGrounded || qPage2.pageNumber !== 2) {
    throw new Error('Failed to ground concept on Page 2');
  }
  console.log('[VERIFIED] Grounding accurately identified Page 2 from the uploaded PDF text!');

  // 3. Unrelated Question
  console.log('\n--- 3. Testing Unrelated Question ---');
  const qUnrelated = await AIService.tutorChat({
    query: 'What is photosynthesis in green plant chloroplasts?',
    material: uploadedMaterial
  });
  console.log('Unrelated question result:', {
    isGrounded: qUnrelated.isGrounded,
    groundingType: qUnrelated.groundingType,
    citation: qUnrelated.sourceCitation
  });
  if (qUnrelated.isGrounded || qUnrelated.groundingType !== 'insufficient-evidence' || qUnrelated.sourceCitation !== null) {
    throw new Error('Unrelated question must not be grounded');
  }
  console.log('[VERIFIED] Unrelated question cleanly rejected with insufficient-evidence and null citation!');

  // 4. Incorrect Document Selection (Asking Dijkstra on Distributed Systems notes)
  console.log('\n--- 4. Testing Incorrect Document Selection ---');
  const qWrongDoc = await AIService.tutorChat({
    query: 'Why does Dijkstra fail on negative edge weights?',
    material: uploadedMaterial
  });
  console.log('Wrong document selection result:', {
    isGrounded: qWrongDoc.isGrounded,
    groundingType: qWrongDoc.groundingType,
    citation: qWrongDoc.sourceCitation
  });
  if (qWrongDoc.isGrounded || qWrongDoc.groundingType !== 'insufficient-evidence' || qWrongDoc.sourceCitation !== null) {
    throw new Error('Wrong document selection must not produce false citation');
  }
  console.log('[VERIFIED] Incorrect document selection cleanly returned insufficient-evidence without citation fabrication!');

  // 5. Question with insufficient evidence in document (e.g. Raft hardware ASIC performance)
  console.log('\n--- 5. Testing Question with Insufficient Evidence ---');
  const qInsufficient = await AIService.tutorChat({
    query: 'What is the Raft hardware ASIC clock frequency in gigahertz?',
    material: uploadedMaterial
  });
  console.log('Insufficient evidence result:', {
    isGrounded: qInsufficient.isGrounded,
    groundingType: qInsufficient.groundingType,
    citation: qInsufficient.sourceCitation
  });
  if (qInsufficient.isGrounded || qInsufficient.groundingType !== 'insufficient-evidence') {
    throw new Error('Insufficient evidence must be rejected');
  }
  console.log('[VERIFIED] Insufficient evidence recognized and reported honestly!');

  console.log('\nALL REAL PDF & GROUNDING AUDIT SCENARIOS PASSED!');
}

runVerification().catch(err => {
  console.error('[FAIL]', err);
  process.exit(1);
});
