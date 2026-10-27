import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFService } from '../services/pdfService.js';
import { GroundingService } from '../services/groundingService.js';
import { AIService } from '../services/aiService.js';
import { store } from '../data/store.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runRegressionSuite() {
  console.log('=== EDUPILOT AI REGRESSION TEST: PDF EXTRACTION & TUTOR GROUNDING ===\n');
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  async function testAsync(name, fn) {
    total++;
    try {
      await fn();
      console.log(`[PASS] ${name}`);
      passed++;
    } catch (err) {
      console.error(`[FAIL] ${name}:`, err.message);
    }
  }

  // 1. Scanned / Image-Only PDF Detection
  await testAsync('PDFService detects image-only PDF without extractable text', async () => {
    const pdfPath = 'C:/Users/JOSEMON JAMES/Downloads/GCP, GCE, GAE.pdf';
    if (!fs.existsSync(pdfPath)) {
      console.log('    Skipping local file check (file not found on disk)');
      return;
    }
    const result = await PDFService.extractText(pdfPath);
    assert.strictEqual(result.pageCount, 4, 'Should detect 4 pages in PDF');
    assert.strictEqual(result.hasExtractableText, false, 'Should flag hasExtractableText: false');
    assert.strictEqual(result.isScannedImageOnly, true, 'Should flag isScannedImageOnly: true');
    assert.strictEqual(result.passages.length, 0, 'Should not generate passages for image-only content');
    assert.ok(result.extractionWarning.includes('scanned images'), 'Should return clear warning');
  });

  // 2. Query Sanitization & Acronym Tokenization
  test('GroundingService cleans prompt boilerplate and .pdf extensions', () => {
    const rawQuery = 'Explain the core invariants and architectural principles in GCP, GCE, GAE.pdf';
    const cleaned = GroundingService.cleanQuery(rawQuery);
    assert.ok(!cleaned.includes('.pdf'), 'Should strip .pdf extension');
    assert.ok(!cleaned.toLowerCase().includes('explain the core invariants'), 'Should strip conversational boilerplate');
    
    const tokens = GroundingService.tokenize(cleaned);
    assert.ok(tokens.includes('gcp'), 'Should preserve gcp token');
    assert.ok(tokens.includes('gce'), 'Should preserve gce token');
    assert.ok(tokens.includes('gae'), 'Should preserve gae token');
  });

  // 3. Grounding Verification Rejection on Image-Only PDF
  test('GroundingService rejects citation generation on scanned image document', () => {
    const mockImageMaterial = {
      id: 'mat-test-image',
      fileName: 'GCP, GCE, GAE.pdf',
      hasExtractableText: false,
      isScannedImageOnly: true,
      pageCount: 4,
      passages: []
    };

    const verification = GroundingService.verifyGrounding(
      mockImageMaterial,
      'Explain the core invariants and architectural principles in GCP, GCE, GAE.pdf'
    );

    assert.strictEqual(verification.isGrounded, false, 'Should NOT claim grounded citations');
    assert.strictEqual(verification.groundingType, 'insufficient-evidence', 'GroundingType must be insufficient-evidence');
    assert.strictEqual(verification.reason, 'document_is_scanned_image_only', 'Reason must be document_is_scanned_image_only');
    assert.strictEqual(verification.passage, null, 'Must have null passage');
  });

  // 4. AIService Tutor response on Scanned Image Document
  await testAsync('AIService tutorChat honestly explains image-only status without fabricated citations', async () => {
    const mockImageMaterial = {
      id: 'mat-test-image',
      fileName: 'GCP, GCE, GAE.pdf',
      hasExtractableText: false,
      isScannedImageOnly: true,
      pageCount: 4,
      passages: []
    };

    const response = await AIService.tutorChat({
      query: 'Explain the core invariants and architectural principles in GCP, GCE, GAE.pdf',
      material: mockImageMaterial
    });

    assert.strictEqual(response.isGrounded, false, 'isGrounded must be false');
    assert.strictEqual(response.sourceCitation, null, 'sourceCitation must be null');
    assert.strictEqual(response.canFallbackToGeneral, true, 'canFallbackToGeneral must be true');
    assert.ok(response.answer.includes('Scanned / Image-Only Document Detected'), 'Answer must explain scanned image detection');
    assert.ok(response.answer.includes('Zero Fabricated References'), 'Must emphasize academic honesty');
    assert.ok(response.answer.includes('Switch to General Knowledge Mode'), 'Must guide user to General Knowledge');
  });

  // 5. AIService Tutor response in General Knowledge Mode for GCP / GCE / GAE
  await testAsync('AIService tutorChat explains GCP, GCE, and GAE comprehensively in General Knowledge mode', async () => {
    const response = await AIService.tutorChat({
      query: 'Explain the core invariants and architectural principles in GCP, GCE, GAE.pdf',
      material: null
    });

    assert.strictEqual(response.isGrounded, false, 'Must be ungrounded general knowledge');
    assert.strictEqual(response.groundingType, 'general-knowledge', 'Must be general-knowledge');
    assert.strictEqual(response.sourceCitation, null, 'Must have no citation');
    assert.ok(response.answer.includes('Google Cloud Platform (GCP)'), 'Must explain Google Cloud Platform');
    assert.ok(response.answer.includes('Google Compute Engine (GCE)'), 'Must explain Google Compute Engine');
    assert.ok(response.answer.includes('Google App Engine (GAE)'), 'Must explain Google App Engine');
    assert.ok(response.answer.includes('Infrastructure-as-a-Service (IaaS)'), 'Must explain IaaS model');
    assert.ok(response.answer.includes('Platform-as-a-Service (PaaS)'), 'Must explain PaaS model');
    assert.ok(response.answer.includes('Stateless Request Invariant'), 'Must detail App Engine stateless invariant');
    assert.ok(!response.answer.includes('def check():'), 'Must NOT contain generic placeholder python code');
  });

  // 6. Live HTTP Test against Express Backend on Port 5000
  await testAsync('Live HTTP: /api/tutor/chat correctly handles GCP scanned document and general fallback', async () => {
    // A: Test with materialId for GCP document in db.json
    const gcpMatRes = await fetch('http://localhost:5000/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Explain the core invariants and architectural principles in GCP, GCE, GAE.pdf',
        materialId: 'mat-1793080060860'
      })
    });
    assert.strictEqual(gcpMatRes.status, 200, 'HTTP 200 required');
    const gcpData = await gcpMatRes.json();
    assert.strictEqual(gcpData.isGrounded, false, 'Must not claim grounded citations on scanned document');
    assert.strictEqual(gcpData.groundingType, 'insufficient-evidence', 'Must indicate insufficient evidence');
    assert.strictEqual(gcpData.canFallbackToGeneral, true, 'Must allow fallback to general');
    assert.ok(gcpData.answer.includes('Scanned / Image-Only Document Detected'), 'Must explain image-only PDF');

    // B: Test with general mode
    const genRes = await fetch('http://localhost:5000/api/tutor/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: 'Explain the core invariants and architectural principles in GCP, GCE, GAE.pdf',
        materialId: 'general'
      })
    });
    assert.strictEqual(genRes.status, 200, 'HTTP 200 required');
    const genData = await genRes.json();
    assert.strictEqual(genData.groundingType, 'general-knowledge', 'Must be general-knowledge');
    assert.ok(genData.answer.includes('Google Cloud Platform (GCP)'), 'Must explain GCP');
    assert.ok(genData.answer.includes('Compute Engine'), 'Must explain Compute Engine');
    assert.ok(genData.answer.includes('App Engine'), 'Must explain App Engine');
  });

  console.log(`\nRegression Suite Complete: ${passed} / ${total} tests passed.`);
  if (passed !== total) {
    process.exit(1);
  }
}

runRegressionSuite().catch((err) => {
  console.error('Fatal regression runner error:', err);
  process.exit(1);
});
