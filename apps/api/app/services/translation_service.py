"""
Built-in translation service for ISL (Indian Sign Language).

Translates English/Hindi text to ISL glosses by:
1. Tokenizing and normalizing input text
2. Matching multi-word and single-word phrases against the signs database
3. Falling back to fingerspelling for unknown words
4. Returning gloss sequence, SiGML URLs, and word mappings
"""

import re
import uuid as _uuid
from app.extensions import db
from app.models.sign import Sign

# ISL drops articles/prepositions/copulas — these get silently removed
STOP_WORDS = {
    "a", "an", "the", "is", "am", "are", "was", "were", "be", "been", "being",
    "do", "does", "did", "to", "of", "in", "for", "on", "with", "at", "by",
    "it", "its", "this", "that", "these", "those",
}

# Pronouns and common words that should be kept as glosses even if not in DB
PRONOUN_GLOSSES = {
    "i": "I", "me": "I", "my": "MY", "mine": "MY",
    "you": "YOU", "your": "YOUR", "yours": "YOUR",
    "he": "HE", "him": "HE", "his": "HIS",
    "she": "SHE", "her": "SHE", "hers": "HER",
    "we": "WE", "us": "WE", "our": "OUR",
    "they": "THEY", "them": "THEY", "their": "THEIR",
    "what": "WHAT", "who": "WHO", "where": "WHERE",
    "when": "WHEN", "why": "WHY", "how": "HOW",
    "not": "NOT", "no": "NO", "yes": "YES",
    "can": "CAN", "will": "WILL", "want": "WANT",
    "need": "NEED", "have": "HAVE", "go": "GO",
    "come": "COME", "see": "SEE", "know": "KNOW",
    "like": "LIKE", "give": "GIVE", "make": "MAKE",
    "say": "SAY", "tell": "TELL", "think": "THINK",
    "here": "HERE", "there": "THERE", "now": "NOW",
    "but": "BUT", "and": "AND", "or": "OR",
    "because": "BECAUSE", "if": "IF", "so": "SO",
}

CONTRACTIONS = {
    "i'm": "i am", "i've": "i have", "i'll": "i will", "i'd": "i would",
    "you're": "you are", "you've": "you have", "you'll": "you will",
    "he's": "he is", "she's": "she is", "it's": "it is",
    "we're": "we are", "we've": "we have", "we'll": "we will",
    "they're": "they are", "they've": "they have", "they'll": "they will",
    "can't": "can not", "won't": "will not", "don't": "do not",
    "doesn't": "does not", "didn't": "did not", "isn't": "is not",
    "aren't": "are not", "wasn't": "was not", "weren't": "were not",
    "let's": "let us",
}


def _build_sign_lookup():
    """Build word->sign lookup dicts (single-word and multi-word) from the database."""
    signs = Sign.query.filter_by(is_active=True).all()
    single = {}
    multi = {}  # key = tuple of words, value = sign
    max_phrase_len = 1

    for sign in signs:
        word = sign.english_word.lower().strip()
        words = word.split()
        if len(words) == 1:
            single[word] = sign
        else:
            multi[tuple(words)] = sign
            max_phrase_len = max(max_phrase_len, len(words))

        # Also index by gloss (lowercase, split on hyphens)
        gloss_lower = sign.gloss.lower().strip()
        gloss_words = gloss_lower.replace("-", " ").split()
        if len(gloss_words) == 1 and gloss_lower not in single:
            single[gloss_lower] = sign

    return single, multi, max_phrase_len


def _tokenize(text: str) -> list[str]:
    """Tokenize and normalize input text."""
    text = text.lower().strip()
    for contraction, expansion in CONTRACTIONS.items():
        text = text.replace(contraction, expansion)
    text = re.sub(r"[^\w\s']", " ", text)
    text = re.sub(r"\s+", " ", text).strip()
    return text.split()


def _fingerspell(word: str) -> list[str]:
    """Break a word into individual letter glosses for fingerspelling."""
    return [f"FS-{ch.upper()}" for ch in word if ch.isalpha()]


def translate_text(text: str, source_lang: str = "en") -> dict:
    """
    Translate text to ISL glosses.

    Uses greedy multi-word matching: tries longest phrase first,
    falls back to single-word lookup, then pronoun glosses,
    then fingerspelling for truly unknown words.
    """
    single_lookup, multi_lookup, max_phrase_len = _build_sign_lookup()
    words = _tokenize(text)

    glosses = []
    sigml_urls = []
    word_mapping = []
    fallback_used = False
    matched = 0
    total_content = 0

    i = 0
    while i < len(words):
        # Try multi-word phrases (longest first)
        found_multi = False
        for length in range(min(max_phrase_len, len(words) - i), 1, -1):
            phrase = tuple(words[i:i + length])
            sign = multi_lookup.get(phrase)
            if sign:
                gloss = sign.gloss.upper()
                phrase_text = " ".join(phrase)
                glosses.append(gloss)
                sigml_urls.append(f"/sigml/{sign.gloss.lower()}.sigml")
                word_mapping.append({
                    "word": phrase_text,
                    "gloss": gloss,
                    "confidence": 0.95,
                })
                sign.usage_count = (sign.usage_count or 0) + 1
                matched += 1
                total_content += 1
                i += length
                found_multi = True
                break

        if found_multi:
            continue

        word = words[i]
        i += 1

        # Skip stop words
        if word in STOP_WORDS:
            word_mapping.append({
                "word": word,
                "gloss": "(dropped)",
                "confidence": 1.0,
            })
            continue

        total_content += 1

        # Try single-word DB lookup
        sign = single_lookup.get(word)
        if sign:
            gloss = sign.gloss.upper()
            glosses.append(gloss)
            sigml_urls.append(f"/sigml/{sign.gloss.lower()}.sigml")
            word_mapping.append({
                "word": word,
                "gloss": gloss,
                "confidence": 0.95,
            })
            sign.usage_count = (sign.usage_count or 0) + 1
            matched += 1
            continue

        # Try pronoun/common word glosses
        pronoun_gloss = PRONOUN_GLOSSES.get(word)
        if pronoun_gloss:
            glosses.append(pronoun_gloss)
            sigml_urls.append(f"/sigml/{pronoun_gloss.lower()}.sigml")
            word_mapping.append({
                "word": word,
                "gloss": pronoun_gloss,
                "confidence": 0.85,
            })
            matched += 1
            continue

        # Fingerspell unknown words (e.g., proper nouns like names)
        fs_glosses = _fingerspell(word)
        glosses.extend(fs_glosses)
        sigml_urls.extend([f"/sigml/fs-{ch.lower()}.sigml" for ch in word if ch.isalpha()])
        word_mapping.append({
            "word": word,
            "gloss": "-".join(fs_glosses),
            "confidence": 0.4,
        })
        fallback_used = True

    # Commit usage count updates
    try:
        db.session.commit()
    except Exception:
        db.session.rollback()

    confidence = (matched / total_content * 0.95) if total_content > 0 else 0.85
    signing_duration = len(glosses) * 0.8

    return {
        "translation_id": str(_uuid.uuid4()),
        "glosses": glosses,
        "sigml_urls": sigml_urls,
        "word_mapping": word_mapping,
        "confidence": round(confidence, 2),
        "detected_lang": source_lang if source_lang != "auto" else "en",
        "fallback_used": fallback_used,
        "signing_duration_sec": round(signing_duration, 1),
        "cached": False,
    }


def translate_batch(sentences: list[str], source_lang: str = "en") -> list[dict]:
    """Translate multiple sentences."""
    return [translate_text(sentence, source_lang) for sentence in sentences]
