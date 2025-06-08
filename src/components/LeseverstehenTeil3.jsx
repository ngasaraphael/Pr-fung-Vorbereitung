// src/components/LeseverstehenTeil3.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function LeseverstehenTeil3({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/LeseverstehenTeil3.json', { eager: true });
    const matchingPath = Object.keys(allFiles).find(
      (path) => path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );
    const file = matchingPath ? allFiles[matchingPath] : null;

    if (file) {
      setData(file);
      setUserMatches({});
      setLoadError(false);
    } else {
      setLoadError(true);
      setData(null);
    }
  }, [level, examSet]);

  useEffect(() => {
    if (!data || !data.situations) return;

    const scoreFn = () => {
      let total = 0;
      data.situations.forEach((s) => {
        if (userMatches[s.id] === s.correctAd) total++;
      });
      return { score: total, total: data.situations.length };
    };

    onReady(scoreFn, data.situations.length);
  }, [data, userMatches, onReady]);

  const handleSelect = (situationId, value) => {
    setUserMatches((prev) => ({ ...prev, [situationId]: value }));
  };

  if (loadError) {
    return (
      <div>
        <h4>Leseverstehen Teil 3</h4>
        <p style={{ color: 'red' }}>
          ❌ Fehler beim Laden der Daten für {level.toUpperCase()} – {examSet}
        </p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Inhalte für {level.toUpperCase()} – {examSet}...</p>;
  }

  return (
    <div>
      <h4>Leseverstehen Teil 3</h4>
      <p className="instructions">
        {data.instruction}
      </p>

      {data.situations.map((s, idx) => (
        <div key={s.id} className="question-block-LT3">
          <p className="situation-LT3">
            <strong>{idx + 10}</strong> {s.text}
          </p>
          <label>
            <select
              value={userMatches[s.id] || ''}
              onChange={(e) => handleSelect(s.id, e.target.value)}
              className="answer-dropdown"
            >
              <option value="">-- auswählen --</option>
              {Object.keys(data.ads || {}).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
              <option value="X">X</option>
            </select>
          </label>
        </div>
      ))}

      <div className="matching-headings">
        {Object.entries(data.ads).map(([key, ad]) => (
          <div key={key} className="heading-card">
            <strong>{key} {ad.title}</strong>
            <span>{ad.description}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default LeseverstehenTeil3;
