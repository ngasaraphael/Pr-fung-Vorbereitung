// src/components/LeseverstehenTeil2.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function LeseverstehenTeil2({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setData(null);
    setUserAnswers({});
    setLoadError(false);

    import(`../data/${level}/${examSet}/LeseverstehenTeil2.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setLoadError(true));
  }, [level, examSet]);

  // Register score function once data is loaded
  useEffect(() => {
    if (!data || !data.questions) return;

    const scoreFn = () => {
      let score = 0;
      data.questions.forEach((q) => {
        if (userAnswers[q.id] === q.answer) score++;
      });
      return { score, total: data.questions.length };
    };

    onReady(scoreFn, data.questions.length);
  }, [data, userAnswers, onReady]);

  const handleChange = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  if (loadError) {
    return (
      <div>
        <h4>📄 Kein Lesetext geladen</h4>
        <p>Keine Daten für {level.toUpperCase()} / {examSet}</p>
      </div>
    );
  }

  if (!data) return <p>⏳ Lade Leseverstehen Teil 2...</p>;

  return (
    <div>
      <h4>Leseverstehen Teil 2</h4>

      <p className="instructions" style={{ marginBottom: '1rem' }}>
        {data.instruction}
      </p>

      <div className="reading-text">
        <p className="title">{data.title}</p>
        <span className="subtitle">{data.subtitle}</span>
        <p>{data.text}</p>
      </div>

      {data.questions.map((q, index) => (
        <div key={q.id} className="question-block">
          <p><strong>{index + 6}</strong> {q.question}</p>
          {q.options.map((opt) => (
            <label key={opt} className="option-label">
              <input
                type="radio"
                name={q.id}
                value={opt}
                checked={userAnswers[q.id] === opt}
                onChange={(e) => handleChange(q.id, e.target.value)}
              />{' '}
              {opt}
            </label>
          ))}
        </div>
      ))}
    </div>
  );
}

export default LeseverstehenTeil2;
