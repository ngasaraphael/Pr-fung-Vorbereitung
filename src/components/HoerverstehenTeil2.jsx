// src/components/HoerverstehenTeil2.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function HoerverstehenTeil2({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/hoerverstehenTeil2.json', { eager: true });
    const matchPath = Object.keys(allFiles).find(
      (path) => path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );
    const file = matchPath ? allFiles[matchPath] : null;

    if (file) {
      setData(file);
      setAnswers({});
      setLoadError(false);
    } else {
      setData(null);
      setLoadError(true);
    }
  }, [level, examSet]);

  useEffect(() => {
    if (!data || !data.questions) return;

    const scoreFn = () => {
      let score = 0;
      data.questions.forEach((q) => {
        if (answers[q.id] === q.correctAnswer) score++;
      });
      return { score, total: data.questions.length };
    };

    onReady(scoreFn, data.questions.length);
  }, [answers, data, onReady]);

  const handleSelect = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value === 'true' }));
  };

  if (loadError) {
    return (
      <div>
        <h4>Hörverstehen Teil 2</h4>
        <p style={{ color: 'red' }}>
          ❌ Keine Datei gefunden für {level.toUpperCase()} – {examSet}
        </p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Hörverstehen Teil 2 für {level.toUpperCase()} – {examSet}...</p>;
  }

  return (
    <div>
      <h4>{data.title || 'Hörverstehen Teil 2'}</h4>
      <p className="instructions">{data.instructions}</p>

      <div className="audio-player-global">
        <audio controls src={data.audio} preload="auto" className="HT1_audio" />
      </div>

      {data.questions.map((q, idx) => (
        <div key={q.id} className="question-block-MRQ">
          <p><strong>{46 + idx}.</strong> {q.text}</p>
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

export default HoerverstehenTeil2;
