import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import placeholder1 from '../images/placeholder1.png';
import placeholder2 from '../images/placeholder2.png';

function ThemaSprechen({ level: propLevel, examSet: propExamSet, onReady }) {
  const { level: contextLevel } = useContext(LevelContext);
  const level = propLevel || contextLevel;
  const isStandalone = !propExamSet;
  const [examSet, setExamSet] = useState(propExamSet || 'Exam1');

  const [data, setData] = useState(null);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setData(null);
    setLoadError(false);

    import(`../data/${level}/${examSet}/themasprechen.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setLoadError(true));
  }, [level, examSet]);

  useEffect(() => {
    if (!data || !data.participants) return;
    if (onReady) onReady(() => ({ score: 0, total: 0 }), 0);
  }, [data, onReady]);

  if (loadError) {
    return (
      <div className="quiz-container">
        {isStandalone && (
          <div className="exam-switcher">
            <label>
              Prüfung auswählen:{' '}
              <select value={examSet} onChange={(e) => setExamSet(e.target.value)}>
                <option value="Exam1">Prüfung 1</option>
                <option value="Exam2">Prüfung 2</option>
                <option value="Exam3">Prüfung 3</option>
              </select>
            </label>
          </div>
        )}
        <p>📦 Keine Daten gefunden für Level <strong>{level?.toUpperCase()}</strong>{examSet ? ` und ${examSet}` : ''}</p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Thema sprechen...</p>;
  }

  return (
    <div className="quiz-container">
      {isStandalone && (
        <div className="exam-switcher">
          <label>
            Prüfung auswählen:{' '}
            <select value={examSet} onChange={(e) => setExamSet(e.target.value)}>
              <option value="Exam1">Prüfung 1</option>
              <option value="Exam2">Prüfung 2</option>
              <option value="Exam3">Prüfung 3</option>
            </select>
          </label>
        </div>
      )}

      <h4>{data.title}</h4>

      <div className="thema-instructions">
        {data.instructions}
      </div>

      <div className="thema-box">
        <p className="thema-theme">{data.theme}</p>

        {data.participants.map((p, index) => {
          const fallbackImage = index % 2 === 0 ? placeholder1 : placeholder2;
          return (
            <div key={p.id} className="participant-entry">
              <div className="participant-info">
                <img
                  src={p.image || fallbackImage}
                  alt={p.name || `Teilnehmer ${index + 1}`}
                  className="participant-image"
                />
                <p className="participant-meta">
                  {p.name}, {p.age} Jahre, {p.profession}
                </p>
              </div>
              <div>
                <p className="participant-quote">„{p.quote}“</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default ThemaSprechen;
