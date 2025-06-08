// src/components/HoerverstehenTeil3.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function HoerverstehenTeil3({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadError, setLoadError] = useState(false);

  // Eager-load all JSON files (for Vite)
  const allFiles = import.meta.glob('../data/*/Exam*/hoerverstehenTeil3.json', { eager: true });

  useEffect(() => {
    setData(null);
    setAnswers({});
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

  useEffect(() => {
    if (!data || !data.questions) return;

    const scoreFn = () => {
      let correct = 0;
      data.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) correct++;
      });
      return { score: correct, total: data.questions.length };
    };

    onReady(scoreFn, data.questions.length);
  }, [data, answers, onReady]);

  const handleSelect = (id, value) => {
    setAnswers(prev => ({ ...prev, [id]: value === 'true' }));
  };

  if (loadError) {
    return (
      <div>
        <h4>Hörverstehen Teil 3</h4>
        <p>❌ Keine Daten gefunden für {examSet} / {level.toUpperCase()}</p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Hörverstehen Teil 3...</p>;
  }

  return (
    <div>
      <h4>{data.title}</h4>
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
              />
              Falsch
            </label>
          </div>
        </div>
      ))}
    </div>
  );
}

export default HoerverstehenTeil3;
