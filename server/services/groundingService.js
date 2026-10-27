/**
 * EduPilot AI — Grounding and Citation Verification Service
 * 
 * Enforces rigorous, honest citation rules:
 * 1. Citations are ONLY returned when verified against the extracted text of the specific selected document.
 * 2. Never assigns fixed or fabricated page/slide numbers based on query keywords.
 * 3. Never mixes passages across documents.
 * 4. Extracts and returns the verbatim supporting passage as a source excerpt.
 * 5. Rejects weak or single-keyword matches with insufficient-evidence.
 */

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'and', 'or', 'but', 'is', 'are', 'was', 'were', 'be', 'been',
  'to', 'of', 'in', 'for', 'on', 'with', 'at', 'by', 'from', 'up', 'about', 'into',
  'over', 'after', 'what', 'why', 'how', 'when', 'where', 'who', 'which', 'can', 'could',
  'should', 'would', 'do', 'does', 'did', 'explain', 'tell', 'show', 'describe', 'please',
  'give', 'me', 'us', 'you', 'your', 'my', 'this', 'that', 'these', 'those', 'it', 'its'
]);

// Generic domain terms that are ubiquitous in CS course materials.
// Matching these terms alone NEVER constitutes evidence of semantic support for an answer.
const GENERIC_DOMAIN_WORDS = new Set([
  'algorithm', 'algorithms', 'algorithmic',
  'data', 'structure', 'structures',
  'system', 'systems', 'computer', 'science',
  'lecture', 'chapter', 'problem', 'problems',
  'code', 'example', 'examples', 'method', 'methods',
  'function', 'functions', 'concept', 'concepts',
  'theory', 'study', 'note', 'notes', 'slide', 'slides',
  'syllabus', 'course', 'overview', 'summary', 'introduction'
]);

const ACRONYM_EXPANSIONS = {
  gcp: ['google cloud platform', 'google cloud', 'cloud platform'],
  gce: ['google compute engine', 'compute engine', 'iaas', 'virtual machines'],
  gae: ['google app engine', 'app engine', 'paas', 'serverless'],
  iaas: ['infrastructure as a service'],
  paas: ['platform as a service'],
  saas: ['software as a service'],
  tlb: ['translation lookaside buffer'],
  acid: ['atomicity consistency isolation durability'],
  mvcc: ['multi-version concurrency control'],
  os: ['operating system'],
  dbms: ['database management system'],
  bst: ['binary search tree']
};

export class GroundingService {
  /**
   * Sanitizes user queries by stripping conversational wrappers and file extensions
   */
  static cleanQuery(query) {
    if (!query || typeof query !== 'string') return '';
    let cleaned = query.trim();
    // Strip trailing or embedded .pdf / .docx
    cleaned = cleaned.replace(/\.pdf\b/gi, '').replace(/\.docx?\b/gi, '');
    // Strip common prompt boilerplate
    cleaned = cleaned.replace(/^(explain\s+(the\s+)?(core\s+)?(invariants\s+and\s+architectural\s+principles\s+in|architecture\s+of|concepts?\s+of|principles?\s+of))/i, '');
    cleaned = cleaned.replace(/^(can\s+you\s+(please\s+)?explain|tell\s+me\s+about|walk\s+me\s+through|what\s+is|what\s+are)\s+/i, '');
    return cleaned.trim();
  }

  /**
   * Simple morphological stemmer to match variants (e.g., fail/failure, edge/edges, tree/trees)
   */
  static stem(word) {
    if (!word || typeof word !== 'string') return '';
    let s = word.toLowerCase().trim();
    if (s.endsWith('ies') && s.length > 4) return s.slice(0, -3) + 'y';
    if (s.endsWith('es') && s.length > 4) return s.slice(0, -2);
    if (s.endsWith('s') && !s.endsWith('ss') && s.length > 3) return s.slice(0, -1);
    if (s.endsWith('ing') && s.length > 5) return s.slice(0, -3);
    if (s.endsWith('ed') && s.length > 4) return s.slice(0, -2);
    if (s.endsWith('ure') && s.length > 5) return s.slice(0, -3);
    return s;
  }

  /**
   * Tokenizes text into meaningful lowercase keyword tokens (length > 2, stop words removed)
   */
  static tokenize(text) {
    if (!text || typeof text !== 'string') return [];
    return text
      .toLowerCase()
      .replace(/[^a-z0-9\s-+]/g, ' ')
      .split(/\s+/)
      .filter((term) => term.length > 2 && !STOP_WORDS.has(term));
  }

  /**
   * Retrieves all passages from a material, ensuring each has authentic page metadata
   */
  static getDocumentPassages(material) {
    if (!material) return [];

    // 1. If explicit passages already exist, use them
    if (Array.isArray(material.passages) && material.passages.length > 0) {
      return material.passages;
    }

    // 2. If pages exist, extract passages from pages
    if (Array.isArray(material.pages) && material.pages.length > 0) {
      const extractedPassages = [];
      for (const page of material.pages) {
        const pageNum = page.pageNumber || 1;
        const pageText = (page.text || '').trim();
        const paras = pageText.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length >= 25);
        if (paras.length === 0 && pageText.length > 0) {
          extractedPassages.push({
            id: `pas-${material.id}-p${pageNum}-1`,
            pageNumber: pageNum,
            pageReference: `Page ${pageNum}`,
            text: pageText,
            wordCount: pageText.split(/\s+/).length
          });
        } else {
          paras.forEach((para, idx) => {
            extractedPassages.push({
              id: `pas-${material.id}-p${pageNum}-${idx + 1}`,
              pageNumber: pageNum,
              pageReference: `Page ${pageNum}`,
              text: para,
              wordCount: para.split(/\s+/).length
            });
          });
        }
      }
      return extractedPassages;
    }

    // 3. Fallback: Parse sampleExtractedText or summary
    const fallbackText = material.sampleExtractedText || material.summary || '';
    if (!fallbackText) return [];

    const paras = fallbackText.split(/\n\s*\n/).map((p) => p.trim()).filter((p) => p.length >= 25);
    return paras.map((p, idx) => ({
      id: `pas-${material.id}-gen-${idx + 1}`,
      pageNumber: 1,
      pageReference: 'Page 1',
      text: p,
      wordCount: p.split(/\s+/).length
    }));
  }

  /**
   * Identifies substantive conceptual tokens, excluding ubiquitous generic domain terms
   */
  static getSubstantiveTokens(tokens) {
    if (!Array.isArray(tokens)) return [];
    return tokens.filter((t) => {
      const stem = this.stem(t);
      return !GENERIC_DOMAIN_WORDS.has(t) && !GENERIC_DOMAIN_WORDS.has(stem);
    });
  }

  /**
   * Retrieves and ranks passages from the selected document matching the query
   */
  static retrievePassages(material, query) {
    if (!material) return [];
    const passages = this.getDocumentPassages(material);
    if (passages.length === 0) return [];

    const cleaned = this.cleanQuery(query);
    const queryTokens = this.tokenize(cleaned || query);
    if (queryTokens.length === 0) return [];

    const substantiveQueryTokens = this.getSubstantiveTokens(queryTokens);
    const substantiveTokenSet = new Set(substantiveQueryTokens);

    const scored = [];
    for (const passage of passages) {
      const passageLower = passage.text.toLowerCase();
      const passageTokens = this.tokenize(passage.text);
      const passageTokenSet = new Set(passageTokens);
      const passageStemSet = new Set(passageTokens.map((t) => this.stem(t)));

      let matchedTokensCount = 0;
      let matchedSubstantiveCount = 0;

      for (const qt of queryTokens) {
        const qStem = this.stem(qt);
        const expansions = ACRONYM_EXPANSIONS[qt] || [];
        const isAcronymMatch = expansions.some((exp) => passageLower.includes(exp));

        const isMatched =
          passageTokenSet.has(qt) ||
          passageStemSet.has(qStem) ||
          passageLower.includes(qt) ||
          isAcronymMatch ||
          (qStem.length >= 3 && passageLower.includes(qStem));

        if (isMatched) {
          matchedTokensCount++;
          if (substantiveTokenSet.has(qt) || substantiveTokenSet.has(qStem)) {
            matchedSubstantiveCount++;
          }
        }
      }

      // Exact multi-word phrase bonuses (e.g. "negative edge", "failure mode", "shortest path", "b+ tree")
      let phraseBonus = 0;
      let matchedPhrases = [];
      for (let i = 0; i < queryTokens.length - 1; i++) {
        const bigram = `${queryTokens[i]} ${queryTokens[i + 1]}`;
        const stemBigram = `${this.stem(queryTokens[i])} ${this.stem(queryTokens[i + 1])}`;
        if (passageLower.includes(bigram) || passageLower.includes(stemBigram)) {
          phraseBonus += 3.0;
          matchedPhrases.push(bigram);
        }
      }

      // Weight substantive concept matches heavily over generic terms
      const genericMatches = matchedTokensCount - matchedSubstantiveCount;
      const totalScore = (matchedSubstantiveCount * 2.5) + (genericMatches * 0.25) + phraseBonus;

      const coverage = queryTokens.length > 0 ? matchedTokensCount / queryTokens.length : 0;
      const substantiveCoverage = substantiveQueryTokens.length > 0
        ? matchedSubstantiveCount / substantiveQueryTokens.length
        : 0;

      if (matchedSubstantiveCount > 0 || phraseBonus > 0) {
        scored.push({
          passage,
          matchedTokensCount,
          matchedSubstantiveCount,
          substantiveCoverage,
          phraseBonus,
          matchedPhrases,
          coverage,
          totalScore
        });
      }
    }

    // Sort by descending score
    scored.sort((a, b) => b.totalScore - a.totalScore);
    return scored;
  }

  /**
   * Verifies whether the top candidate passage provides genuine supporting evidence.
   * Strictly enforces:
   * 1. Lexical similarity alone does NOT prove semantic support.
   * 2. Ubiquitous generic terms (algorithm, data, system) do not count as proof of topic support.
   * 3. Queries with multiple substantive terms must match at least 2 distinct substantive terms or an exact multi-word key phrase.
   * 4. Demonstrable false-positive cases (e.g. 'algorithm speed' or 'graph encryption') are strictly rejected.
   */
  static verifyGrounding(material, query) {
    if (!material) {
      return {
        isGrounded: false,
        groundingType: 'general-knowledge',
        reason: 'no_document_selected',
        passage: null
      };
    }

    // Honest detection of scanned or image-only PDFs lacking extractable digital text
    if (material.hasExtractableText === false || material.isScannedImageOnly) {
      return {
        isGrounded: false,
        groundingType: 'insufficient-evidence',
        reason: 'document_is_scanned_image_only',
        passage: null,
        documentName: material.fileName,
        warning: 'This document contains scanned slides or raster images without digital text.'
      };
    }

    const passages = this.getDocumentPassages(material);
    if (passages.length === 0) {
      const substantiveSample = (material.sampleExtractedText || '')
        .replace(/--\s*\d+\s+of\s+\d+\s*--/gi, '')
        .replace(/\bpage\s+\d+(\s+of\s+\d+)?\b/gi, '')
        .trim();
      const isImageOnly = substantiveSample.length < 30;
      return {
        isGrounded: false,
        groundingType: 'insufficient-evidence',
        reason: isImageOnly ? 'document_is_scanned_image_only' : 'no_matching_passages',
        passage: null,
        documentName: material.fileName,
        warning: isImageOnly ? 'This document contains scanned slides or raster images without digital text.' : null
      };
    }

    const cleaned = this.cleanQuery(query);
    const queryTokens = this.tokenize(cleaned || query);
    const substantiveTokens = this.getSubstantiveTokens(queryTokens);

    // If query has no substantive concept terms (e.g. only 'explain the lecture algorithm')
    if (substantiveTokens.length === 0) {
      return {
        isGrounded: false,
        groundingType: 'insufficient-evidence',
        reason: 'query_lacks_substantive_topic',
        passage: null,
        documentName: material.fileName
      };
    }

    const candidateResults = this.retrievePassages(material, query);

    if (candidateResults.length === 0) {
      return {
        isGrounded: false,
        groundingType: 'insufficient-evidence',
        reason: 'no_matching_passages',
        passage: null,
        documentName: material.fileName
      };
    }

    const topCandidate = candidateResults[0];

    // Verification Criteria:
    // Case A: Query has 2+ substantive terms (e.g. 'Why does Dijkstra fail on negative edges?' or 'graph encryption')
    // Requires:
    // - An exact multi-word concept phrase match (e.g. 'negative edge', 'shortest path')
    // - OR (matchedSubstantiveCount >= 2 AND substantiveCoverage >= 0.5)
    // - A 1-word match on a 2+ word query is strictly rejected!
    let hasSufficientEvidence = false;

    if (substantiveTokens.length >= 2) {
      if (topCandidate.phraseBonus > 0 && topCandidate.matchedSubstantiveCount >= 1) {
        hasSufficientEvidence = true;
      } else if (topCandidate.matchedSubstantiveCount >= 2 && topCandidate.substantiveCoverage >= 0.5) {
        hasSufficientEvidence = true;
      }
    } else {
      // Case B: Query has exactly 1 substantive term (e.g. 'What is Dijkstra?')
      // Must match that substantive term AND have a phrase bonus or direct mention in passage
      if (topCandidate.matchedSubstantiveCount >= 1 && (topCandidate.phraseBonus > 0 || topCandidate.totalScore >= 2.0)) {
        hasSufficientEvidence = true;
      }
    }

    if (!hasSufficientEvidence) {
      return {
        isGrounded: false,
        groundingType: 'insufficient-evidence',
        reason: 'lexical_overlap_lacks_semantic_support',
        passage: null,
        topScore: topCandidate.totalScore,
        matchedSubstantiveCount: topCandidate.matchedSubstantiveCount,
        documentName: material.fileName
      };
    }

    const verifiedPassage = topCandidate.passage;
    return {
      isGrounded: true,
      groundingType: 'source-grounded',
      reason: 'verified_document_evidence',
      passage: verifiedPassage,
      score: topCandidate.totalScore,
      coverage: topCandidate.coverage,
      substantiveCoverage: topCandidate.substantiveCoverage,
      matchedPhrases: topCandidate.matchedPhrases,
      documentName: material.fileName,
      pageNumber: verifiedPassage.pageNumber,
      sourceCitation: `${material.fileName} — ${verifiedPassage.pageReference || `Page ${verifiedPassage.pageNumber || 1}`}`,
      sourceExcerpt: verifiedPassage.text
    };
  }
}
