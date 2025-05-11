import { useContext, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function GroupedReadingQuiz() {
  const { level } = useContext(LevelContext);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [width, height] = useWindowSize();

  // ✅ Dynamically load grouped_reading_single.json by level
  const allReadings = import.meta.glob('../data/*/grouped_reading_single.json', { eager: true });
  const matchingPath = Object.keys(allReadings).find((path) => path.includes(`/${level}/`));
  const readingData = matchingPath ? allReadings[matchingPath] : null;

  if (!readingData) {
    return (
      <div className="quiz-container">
        <h2>📄 Kein Lesetext gefunden</h2>
        <p>Für das Level <strong>{level.toUpperCase()}</strong> wurde kein Lesetext geladen.</p>
      </div>
    );
  }

  const questions = readingData.questions;

  const handleChange = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (Object.keys(userAnswers).length < questions.length) return;

    let total = 0;
    questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) total++;
    });

    setScore(total);
    setShowResults(true);
  };

  return (
    <div className="quiz-container">
      {showResults && score / questions.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>{readingData.title}</h2>
      <div className="reading-text">
        <p>{readingData.text}</p>
      </div>

      {questions.map((q, index) => (
        <div key={q.id} className="question-block">
          <p><strong>Frage {index + 1}:</strong> {q.question}</p>

          {q.options.map((opt) => (
            <label key={opt} className="option-label">
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={userAnswers[q.id] === opt}
                onChange={(e) => handleChange(q.id, e.target.value)}
                disabled={showResults}
              />
              {' '}{opt}
            </label>
          ))}
        </div>
      ))}

      {!showResults ? (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>
            Abschicken
          </button>

          {submitAttempted && Object.keys(userAnswers).length < questions.length && (
            <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              ⚠️ Bitte beantworte alle Fragen, bevor du abschickst.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className={`result-box ${score / questions.length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
            <h3>Ergebnis: {score} von {questions.length} richtig</h3>
            <p>{score / questions.length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
          </div>
          <div className="submit-container">
            <button className="submit-button" onClick={() => window.location.reload()}>
              🔄 Neu laden
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default GroupedReadingQuiz;
