import { useContext, useEffect, useState } from 'react';
import '../css/QuizPage.css';
import { LevelContext } from '../context/LevelContext';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function HoerverstehenTeil2() {
  const { level } = useContext(LevelContext);
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();

  useEffect(() => {
    setAnswers({});
    setShowResults(false);
    setSubmitAttempted(false);

    import(`../data/${level}/listeningt2_${level}.json`)
      .then((mod) => {
        setData(mod.default);
      })
      .catch((err) => {
        console.error("❌ Failed to load listening data:", err);
        setData(null);
      });
  }, [level]);

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

  if (data === null) {
    return (
      <div className="quiz-container">
        <p>📦 Keine Hörverstehen-Aufgaben für Level <strong>{level.toUpperCase()}</strong> verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {showResults && score / data.questions.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>{data.title}</h2>
      <p className="instructions">{data.instructions}</p>

      {/* Shared audio player for all questions */}
      <div className="audio-player-global">
        <audio controls src={data.audio} preload="auto" className='HT1_audio' />
      </div>

      {data.questions.map((q, idx) => (
        <div key={q.id} className="question-block-MRQ">
          <p><strong>{idx + 46}.</strong> {q.text}</p>

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

          {showResults && (
            <p>
              {answers[q.id] === q.correctAnswer ? '✅ Richtig' : '❌ Falsch'} — Richtige Antwort:{" "}
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

export default HoerverstehenTeil2;
