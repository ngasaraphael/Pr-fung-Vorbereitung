// src/components/LeseverstehenTeil1.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function LeseverstehenTeil1({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    setData(null);
    setUserMatches({});
    setLoadError(false);

    import(`../data/${level}/${examSet}/LeseverstehenTeil1.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setLoadError(true));
  }, [level, examSet]);

  useEffect(() => {
    if (!data || !data.paragraphs) return;

    const scoreFn = () => {
      let correct = 0;
      data.paragraphs.forEach((para) => {
        if (userMatches[para.id] === para.correctHeading) correct++;
      });
      return { score: correct, total: data.paragraphs.length };
    };

    onReady(scoreFn, data.paragraphs.length);
  }, [data, userMatches, onReady]);

  const handleSelect = (paraId, value) => {
    setUserMatches((prev) => ({ ...prev, [paraId]: value }));
  };

  if (loadError) {
    return (
      <div>
        <h4>Leseverstehen Teil 1</h4>
        <p>📦 Keine Aufgaben für Level <strong>{level.toUpperCase()}</strong> und {examSet}</p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Leseverstehen Teil 1...</p>;
  }

  return (
    <div>
      <h4>Leseverstehen Teil 1</h4>
      <p className='instructions'>
        Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift.
        Sie können jede Überschrift nur einmal benutzen.
      </p>

      <div className="matching-headings-MRQ">
        <ul className="no-bullets">
          {Object.entries(data.headings).map(([key, text]) => (
            <li key={key} className="li-row">
              <span className="key-label">{key}</span>
              <span className="grey-background">{text}</span>
            </li>
          ))}
        </ul>
      </div>

      {data.paragraphs.map((para, idx) => (
        <div key={para.id} className="question-block-MRQ">
          <ul className="no-bullets">
            <li className="li-row">
              <span className="key-label"><strong>{idx + 1}</strong></span>
              <span className="grey-background">{para.text}</span>
            </li>
          </ul>
          <select
            value={userMatches[para.id] || ''}
            onChange={(e) => handleSelect(para.id, e.target.value)}
            className='answer-dropdown'
          >
            <option value="">-- auswählen --</option>
            {Object.keys(data.headings).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
}

export default LeseverstehenTeil1;
