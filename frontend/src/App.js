import React, { useState } from 'react';
import './App.css';

const difficulties = ["Easy", "Medium", "Hard"];
const testLengths = [
  { label: "Short (15)", value: 15 },
  { label: "Standard (30)", value: 30 },
  { label: "Long (50)", value: 50 },
];

function parseQuizText(quizText) {
  // Try to split quiz into questions (simple split by line or number)
  const lines = quizText.split(/\n|\r/).filter(Boolean);
  const questions = [];
  let current = '';
  for (let line of lines) {
    if (/^\d+\./.test(line) && current) {
      questions.push(current.trim());
      current = line;
    } else {
      current += '\n' + line;
    }
  }
  if (current) questions.push(current.trim());
  return questions.length > 1 ? questions : [quizText];
}

function App() {
  const [file, setFile] = useState(null);
  const [difficulty, setDifficulty] = useState(difficulties[0]);
  const [testLength, setTestLength] = useState(testLengths[0].value);
  const [quiz, setQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError("Please upload a PDF or DOCX file.");
      return;
    }
    setLoading(true);
    setQuiz(null);
    setError("");
    const formData = new FormData();
    formData.append('file', file);
    formData.append('difficulty', difficulty);
    formData.append('question_count', testLength);
    try {
      const res = await fetch('http://localhost:8000/generate-quiz', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate quiz');
      setQuiz(parseQuizText(data.quiz));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-xl shadow-lg p-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Quiz Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium mb-1">Upload File (.pdf, .docx)</label>
            <input
              type="file"
              accept=".pdf,.docx"
              onChange={handleFileChange}
              className="block w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block font-medium mb-1">Difficulty</label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {difficulties.map(d => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1">Test Length</label>
              <select
                value={testLength}
                onChange={e => setTestLength(Number(e.target.value))}
                className="w-full border border-gray-300 rounded px-3 py-2"
              >
                {testLengths.map(t => (
                  <option key={t.value} value={t.value}>{t.label}</option>
                ))}
              </select>
            </div>
          </div>
          {error && <div className="text-red-500 text-sm">{error}</div>}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            disabled={loading}
          >
            {loading ? "Generating..." : "Generate Quiz"}
          </button>
        </form>
        {quiz && (
          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-4">Generated Quiz</h2>
            <ul className="space-y-2">
              {quiz.map((q, i) => (
                <li key={i} className="bg-gray-100 rounded p-3 whitespace-pre-line">{q}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <footer className="mt-8 text-gray-400 text-xs">&copy; {new Date().getFullYear()} Quiz Generator</footer>
    </div>
  );
}

export default App;
