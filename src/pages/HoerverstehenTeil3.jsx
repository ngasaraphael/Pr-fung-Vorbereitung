import { useContext, useEffect, useState } from 'react';
import '../css/QuizPage.css';
import { LevelContext } from '../context/LevelContext';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function HoerverstehenTeil3() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1');
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();
  const [loadError, setLoadError] = useState(false);

  const allFiles = import.meta.glob('../data/*/Exam*/hoerverstehenTeil3.json', { eager: true });

  useEffect(() => {
    setData(null);
    setAnswers({});
    setShowResults(false);
    setSubmitAttempted(false);
    setLoadError(false);

    const match = Object.keys(allFiles).find(
      path => path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );

    if (match && allFiles[match]) {
      setData(allFiles[match]);
    } else {
 
      setLoadError(true);
    }
  }, [level, examSet]);

  const handleSelect = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value === 'true' }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(answers).length < data.questions.length) return;

    let total = 0;
    data.questions.forEach(q => {
      if (answers[q.id] === q.correctAnswer) total++;
    });

    setScore(total);
    setShowResults(true);
  };

  const renderExamSelector = () => (
    <div className="exam-switcher">
      <label>
        Prüfung auswählen:{' '}
        <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="Exam1">Prüfung 1</option>
          <option value="Exam2">Prüfung 2</option>
          <option value="Exam3">Prüfung 3</option>
        </select>
      </label>
    </div>
  );

  if (loadError) {
    return (
      <div className="quiz-container">
        {renderExamSelector()}
        <h2>❌ Fehler beim Laden</h2>
        <p>Daten für {examSet} – {level.toUpperCase()} nicht gefunden.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="quiz-container">
        {renderExamSelector()}
        ⏳ Lade Hörverstehen Teil 3 ({examSet})...
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {renderExamSelector()}

      {showResults && score / data.questions.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>{data.title}</h2>
      <p className="instructions">{data.instructions}</p>

      {data.questions.map((q, idx) => (
        <div key={q.id} className="question-block-MRQ">
          <p><strong>{56 + idx}.</strong> {q.text}</p>
          <audio controls src={q.audio} preload="auto" className="HT1_audio" />
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

export default HoerverstehenTeil3;
