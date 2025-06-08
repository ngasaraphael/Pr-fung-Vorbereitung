import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function HoerverstehenTeil1() {
  const { level } = useContext(LevelContext);
  const [exam, setExam] = useState('Exam1');
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/hoerverstehenTeil1.json', { eager: true });
    const matchPath = Object.keys(allFiles).find(
      (path) => path.includes(`/${level}/`) && path.includes(`/${exam}/`)
    );
    const file = matchPath ? allFiles[matchPath] : null;

    if (file) {
      setData(file);
      setAnswers({});
      setShowResults(false);
      setSubmitAttempted(false);
      setLoadError(false);
    } else {
  
      setData(null);
      setLoadError(true);
    }
  }, [level, exam]);

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value === 'true' }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(answers).length < data.questions.length) return;

    let total = 0;
    data.questions.forEach((q) => {
      if (answers[q.id] === q.correctAnswer) total++;
    });

    setScore(total);
    setShowResults(true);
  };

  if (loadError) {
    return (
      <div className="quiz-container">
        <div className="exam-switcher">
          <label>
            Prüfung auswählen:{' '}
            <select value={exam} onChange={(e) => setExam(e.target.value)}>
              <option value="Exam1">Prüfung 1</option>
              <option value="Exam2">Prüfung 2</option>
              <option value="Exam3">Prüfung 3</option>
            </select>
          </label>
        </div>
        <p>❌ Keine Hörverstehen-Datei für <strong>{level.toUpperCase()}</strong> – {exam}</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="quiz-container">
        <p>⏳ Lade Inhalte für <strong>{level.toUpperCase()}</strong> – {exam}...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="exam-switcher">
        <label>
          Prüfung auswählen:{' '}
          <select value={exam} onChange={(e) => setExam(e.target.value)}>
            <option value="Exam1">Prüfung 1</option>
            <option value="Exam2">Prüfung 2</option>
            <option value="Exam3">Prüfung 3</option>
          </select>
        </label>
      </div>

      {showResults && score / data.questions.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>{data.title}</h2>
      <p className="instructions">{data.instructions}</p>

   {Array.isArray(data?.questions) && data.questions.map((q, idx) => (
        <div key={q.id} className="question-block-MRQ">
          <p><strong>{idx + 41}.</strong> {q.text}</p>

          <div className="radio-group">
            <label>
              <input
                type="radio"
                name={q.id}
                value="true"
                checked={answers[q.id] === true}
                onChange={(e) => handleSelect(q.id, e.target.value)}
                disabled={showResults}
              />
              Richtig
            </label>
            <label>
              <input
                type="radio"
                name={q.id}
                value="false"
                checked={answers[q.id] === false}
                onChange={(e) => handleSelect(q.id, e.target.value)}
                disabled={showResults}
              />
              Falsch
            </label>
          </div>

          <audio controls src={q.audio} preload="auto" className="HT1_audio" />

          {showResults && (
            <p>
              {answers[q.id] === q.correctAnswer ? '✅ Richtig' : '❌ Falsch'} — Richtige Antwort:{' '}
              <strong>{q.correctAnswer ? 'Richtig' : 'Falsch'}</strong>
            </p>
                )}
              </div>
            ))}

        {!showResults ? (
          <div className="submit-container">
            <button className="submit-button" onClick={handleSubmit}>Abschicken</button>
            {submitAttempted && Object.keys(answers).length < data.questions.length && (
              <p style={{ color: 'red' }}>⚠️ Bitte beantworten Sie alle Fragen.</p>
            )}
          </div>
        ) : (
          <div className={`result-box ${score / data.questions.length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
            <h3>Ergebnis: {score} von {data.questions.length} richtig</h3>
            <p>{score / data.questions.length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
          </div>
        )}
    </div>
  );
}

export default HoerverstehenTeil1;
