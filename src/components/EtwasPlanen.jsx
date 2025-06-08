import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function EtwasPlanen({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setData(null);
    setLoadError(false);

    import(`../data/${level}/${examSet}/etwasplanen.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setLoadError(true));
  }, [level, examSet]);

  useEffect(() => {
    onReady(() => ({ score: 0, total: 0 }), 0); // placeholder
  }, [onReady]);

  if (loadError) {
    return (
      <div>
        <h4>Etwas planen</h4>
        <p>📦 Keine Daten gefunden für Level <strong>{level.toUpperCase()}</strong> und {examSet}</p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Planungsaufgabe...</p>;
  }

  return (
    <div className="thema-container">
      <h4>{data.title}</h4>
      <div className="thema-instructions">{data.instructions}</div>

      <div className="thema-box">
        <p className="thema-theme">{data.topic}</p>
        <ul className="planning-list">
          {data.points.map((item, idx) => (
            <li key={idx}>▪ {item}</li>
          ))}
        </ul>
      </div>
      <div className="etwas-footer">
        <p className="italic-line">Entscheiden Sie zuerst, was Sie machen möchten und warum.</p>
        <p className="italic-line">ragen Sie Ihrem Partner Ihre Ideen vor und begründen Sie sie.</p>
        <p className="italic-line">Reagieren Sie auf die Ideen Ihres Partners bzw. Ihrer Partnerin und die Begründungen.</p>
        <p className="italic-line">Einigen Sie sich auf einen gemeinsamen Programmvorschlag.</p>
      </div>
    </div>
  );
}

export default EtwasPlanen;
