from fastapi import FastAPI, HTTPException
from pydantic import BaseModel, Field

app = FastAPI(title="SignForge Translation Service", version="0.1.0")


class TranslateRequest(BaseModel):
    text: str = Field(..., max_length=5000)
    source_lang: str = Field(default="en")


class TranslateResponse(BaseModel):
    glosses: list[str]
    sigml_urls: list[str]
    word_mapping: list[dict]
    confidence: float


class BatchRequest(BaseModel):
    sentences: list[str] = Field(..., max_length=20)


@app.get("/health")
def health():
    return {"status": "healthy", "service": "translation"}


@app.post("/translate", response_model=TranslateResponse)
async def translate(req: TranslateRequest):
    # Placeholder: in production, this calls the NLP-to-gloss pipeline
    words = req.text.strip().split()
    glosses = [w.upper() for w in words]
    return TranslateResponse(
        glosses=glosses,
        sigml_urls=[f"/sigml/{g.lower()}.sigml" for g in glosses],
        word_mapping=[
            {"word": w, "gloss": g, "confidence": 0.85}
            for w, g in zip(words, glosses)
        ],
        confidence=0.85,
    )


@app.post("/translate/batch")
async def translate_batch(req: BatchRequest):
    results = []
    for sentence in req.sentences:
        words = sentence.strip().split()
        glosses = [w.upper() for w in words]
        results.append({
            "text": sentence,
            "glosses": glosses,
            "sigml_urls": [f"/sigml/{g.lower()}.sigml" for g in glosses],
            "confidence": 0.85,
        })
    return {"results": results}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8001, reload=True)
