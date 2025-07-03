from dotenv import load_dotenv
load_dotenv()

# FastAPI app initialization
from fastapi import FastAPI, File, UploadFile, Form
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
import os
import tempfile
import fitz  # PyMuPDF
import pdfplumber
import docx
import openai
from typing import List
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_500_INTERNAL_SERVER_ERROR

app = FastAPI()

# Allow CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

openai.api_key = os.getenv("OPENAI_API_KEY")

MAX_FILE_SIZE_MB = 10
ALLOWED_EXTENSIONS = {"pdf", "docx"}


def extract_text_from_pdf(file_path: str) -> str:
    try:
        text = ""
        with pdfplumber.open(file_path) as pdf:
            for page in pdf.pages:
                text += page.extract_text() or ""
        if not text:
            # fallback to PyMuPDF
            doc = fitz.open(file_path)
            for page in doc:
                text += page.get_text()
        return text
    except Exception:
        return ""

def extract_text_from_docx(file_path: str) -> str:
    try:
        doc = docx.Document(file_path)
        return "\n".join([p.text for p in doc.paragraphs if p.text.strip()])
    except Exception:
        return ""

@app.post("/generate-quiz")
async def generate_quiz(
    file: UploadFile = File(...),
    difficulty: str = Form(...),
    question_count: int = Form(...)
):
    # File validation
    ext = file.filename.split(".")[-1].lower()
    if ext not in ALLOWED_EXTENSIONS:
        return JSONResponse({"error": "Unsupported file type."}, status_code=HTTP_400_BAD_REQUEST)
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE_MB * 1024 * 1024:
        return JSONResponse({"error": "File too large. Max 10MB."}, status_code=HTTP_400_BAD_REQUEST)
    # Save to temp file
    with tempfile.NamedTemporaryFile(delete=False, suffix=f".{ext}") as tmp:
        tmp.write(contents)
        tmp_path = tmp.name
    # Extract text
    if ext == "pdf":
        text = extract_text_from_pdf(tmp_path)
    else:
        text = extract_text_from_docx(tmp_path)
    os.remove(tmp_path)
    if not text.strip():
        return JSONResponse({"error": "Could not extract text from document."}, status_code=HTTP_400_BAD_REQUEST)
    # Compose OpenAI prompt
    prompt = f"""Create a {difficulty} quiz based on this content. Make it {question_count} questions long.\nUse a clear format. Use multiple choice if possible.\n---\n{text[:6000]}"""
    try:
        response = openai.chat.completions.create(
            model="gpt-3.5-turbo",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=1500,
            temperature=0.7,
        )
        quiz = response.choices[0].message.content.strip()
        return {"quiz": quiz}
    except Exception as e:
        return JSONResponse({"error": str(e)}, status_code=HTTP_500_INTERNAL_SERVER_ERROR)
