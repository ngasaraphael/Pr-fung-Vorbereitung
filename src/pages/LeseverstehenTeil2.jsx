import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function LeseverstehenTeil2() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1');
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setData(null);
    setLoadError(false);
    setUserAnswers({});
    setShowResults(false);
    setSubmitAttempted(false);

    import(`../data/${level}/${examSet}/LeseverstehenTeil2.json`)
      .then((mod) => setData(mod.default))
      .catch((err) => {
        console.error('❌ Fehler beim Laden der Datei:', err);
        setLoadError(true);
      });
  }, [level, examSet]);

  const handleChange = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(userAnswers).length < data.questions.length) return;

    let total = 0;
    data.questions.forEach((q) => {
      if (userAnswers[q.id] === q.answer) total++;
    });

    setScore(total);
    setShowResults(true);
  };

  if (loadError) {
    return (
      <div className="quiz-container">
        <h2>📄 Kein Lesetext gefunden</h2>
        <label>
          Prüfungsset:
          <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="Exam1">Exam 1</option>
            <option value="Exam2">Exam 2</option>
            <option value="Exam3">Exam 3</option>
          </select>
        </label>
        <p>Für das Level <strong>{level.toUpperCase()}</strong> wurde kein Lesetext geladen.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="quiz-container">
        <p>⏳ Lade Leseverstehen Teil 2...</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {showResults && score / data.questions.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>Leseverstehen Teil 2</h2>

      <label>
        Prüfungsset:
        <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="Exam1">Exam 1</option>
          <option value="Exam2">Exam 2</option>
          <option value="Exam3">Exam 3</option>
        </select>
      </label>

      <p className="instructions">
        Lesen Sie den Text und die Aufgaben 1–5. Welche Lösung ist jeweils richtig?
        Markieren Sie Ihre Lösungen für die Aufgaben auf dem Antwortbogen.
      </p>

      <div className="reading-text">
        <p className="title">{data.title}</p>
        <span className="subtitle">{data.subtitle}</span>
        <p>{data.text}</p>
      </div>

      {data.questions.map((q, index) => (
        <div key={q.id} className="question-block">
          <p><strong>{index + 1}</strong> {q.question}</p>

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

          {submitAttempted && Object.keys(userAnswers).length < data.questions.length && (
            <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              ⚠️ Bitte beantworte alle Fragen, bevor du abschickst.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className={`result-box ${score / data.questions.length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
            <h3>Ergebnis: {score} von {data.questions.length} richtig</h3>
            <p>{score / data.questions.length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
          </div>
          <div className="submit-container">
            <button className="submit-button" onClick={() => {
              setUserAnswers({});
              setScore(0);
              setShowResults(false);
              setSubmitAttempted(false);
            }}>
              🔄 Neu starten
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default LeseverstehenTeil2;
