# 📝 Quiz Generator App

A full-stack web application that allows users to upload a PDF or DOCX file and generates a quiz based on the document content using OpenAI GPT.

---

## ✨ Features
- 📄 Upload PDF or DOCX files
- 🎚️ Choose quiz difficulty and length
- 🤖 Generates multiple-choice quizzes using OpenAI
- 💻 Modern, responsive UI (React + TailwindCSS)
- 🛡️ Error handling for large files, bad formats, and empty docs
- 🔒 API key is kept secure in a `.env` file

---

## 🛠️ Tech Stack
- **Frontend:** React, TailwindCSS
- **Backend:** FastAPI (Python)
- **AI:** OpenAI GPT (via API)
- **PDF Parsing:** PyMuPDF, pdfplumber
- **DOCX Parsing:** python-docx

---

## 📁 Folder Structure
```
proj5/
  backend/    # FastAPI backend
  frontend/   # React frontend
```

---

## 🚦 Prerequisites
- 🐍 Python 3.9+
- 🟩 Node.js & npm ([Download here](https://nodejs.org/))
- 🔑 OpenAI API key ([Get one here](https://platform.openai.com/account/api-keys))

---

## ⚙️ Backend Setup (FastAPI)
1. **Navigate to backend:**
   ```cmd
   cd backend
   ```
2. **Create and activate virtual environment:**
   ```cmd
   python -m venv .
   Scripts\activate
   ```
   _You should see `(backend)` at the start of your prompt._
3. **Install dependencies:**
   ```cmd
   pip install -r requirements.txt
   ```
   If `requirements.txt` is missing, install manually:
   ```cmd
   pip install fastapi uvicorn python-docx pymupdf pdfplumber python-multipart openai python-dotenv
   ```
4. **Add your OpenAI API key:**
   - Create a file named `.env` in the `backend` folder:
     ```
     OPENAI_API_KEY=your-openai-key-here
     ```
   - _Never share this key publicly!_
5. **Run the backend server:**
   ```cmd
   uvicorn app.__init__:app --reload --port 8000
   ```
   _The backend will be available at [http://localhost:8000](http://localhost:8000)_

---

## 🎨 Frontend Setup (React + Tailwind)
1. **Navigate to frontend:**
   ```cmd
   cd frontend
   ```
2. **Install dependencies:**
   ```cmd
   npm install
   ```
3. **Start the React app:**
   ```cmd
   npm start
   ```
   _The app will open at [http://localhost:3000](http://localhost:3000)_

---

## 🚀 Usage
1. 📤 Upload a PDF or DOCX file
2. 🎚️ Select difficulty and quiz length
3. 🧠 Click "Generate Quiz"
4. ✅ View and use the generated quiz

---

## 🧩 Example Prompt Sent to OpenAI
```yaml
Create a {difficulty} quiz based on this content. Make it {question_count} questions long.
Use a clear format. Use multiple choice if possible.
---
{document_text}
```

---

## 🩺 Troubleshooting
- ❌ **Missing npm:** Install Node.js from [https://nodejs.org/](https://nodejs.org/)
- ❌ **Missing Python packages:** Run `pip install ...` as above
- ❌ **API key errors:** Ensure `.env` is present and correct in `backend/`
- ❌ **500 Internal Server Error:** Check backend terminal for error details
- ❌ **ModuleNotFoundError:** Make sure you activate your virtual environment before running the backend
- ❌ **CORS errors:** Make sure both servers are running on localhost
- ❌ **web-vitals not found:** Run `npm install web-vitals` in `frontend/`

---

## 🤝 Contributing
Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## ❓ FAQ
**Q: Can I use this with other file types?**
> Not currently. Only PDF and DOCX are supported for security and reliability.

**Q: Is my OpenAI key safe?**
> Yes! It is stored in `.env` (which is gitignored) and never sent to the frontend.

**Q: How do I deploy this?**
> You can deploy the backend to any Python server (e.g., Heroku, Render, Azure) and the frontend to Vercel, Netlify, or your own server. Make sure to set the correct API URLs and keep your API key secret.

---

## 🔒 Security
- Your OpenAI API key is stored in `.env` (which is gitignored)
- Never share your API key publicly

---

## 📄 License
MIT 