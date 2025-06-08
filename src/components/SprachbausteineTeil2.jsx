// src/components/SprachbausteineTeil2.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function SprachbausteineTeil2({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/SprachbausteineTeil2.json', { eager: true });
    const matchPath = Object.keys(allFiles).find(
      (path) => path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );
    const file = matchPath ? allFiles[matchPath] : null;

    if (file) {
      setData(file);
      setUserAnswers({});
      setLoadError(false);
    } else {
      setData(null);
      setLoadError(true);
    }
  }, [level, examSet]);

  useEffect(() => {
    if (!data || !data.blanks) return;

    const scoreFn = () => {
      let score = 0;
      Object.entries(data.blanks).forEach(([id, correct]) => {
        if (userAnswers[id] === correct) score++;
      });
      return { score, total: Object.keys(data.blanks).length };
    };

    onReady(scoreFn, Object.keys(data.blanks).length);
  }, [userAnswers, data, onReady]);

  const handleSelect = (blankId, value) => {
    setUserAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const renderTextWithBlanks = () => {
    const lines = data.text.split('\n');
    return (
      <div className="text-ST2">
        {lines.map((line, index) => {
          const parts = line.split(/(___\d+___)/g);
          return (
            <div key={index} style={{ marginBottom: '8px' }}>
              {parts.map((part, i) => {
                const match = part.match(/___(\d+)___/);
                if (match) {
                  const blankId = match[1];
                  return (
                    <select
                      key={i}
                      value={userAnswers[blankId] || ''}
                      onChange={(e) => handleSelect(blankId, e.target.value)}
                      className="blank-dropdown"
                    >
                      <option value="">--</option>
                      {Object.keys(data.options).map((key) => (
                        <option key={key} value={key}>{key}</option>
                      ))}
                    </select>
                  );
                }
                return <span key={i}>{part}</span>;
              })}
            </div>
          );
        })}
      </div>
    );
  };

  const renderAnswerOptionsBox = () => {
    const entries = Object.entries(data.options);
    const columns = 3;
    const rows = Math.ceil(entries.length / columns);
    const grid = Array.from({ length: rows }, (_, rowIndex) =>
      entries.slice(rowIndex * columns, rowIndex * columns + columns)
    );

    return (
      <div className="answers-box">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
            {row.map(([key, word]) => (
              <div key={key} style={{ flex: 1, paddingRight: '10px' }}>
                <strong>{key}</strong>: {word}
              </div>
            ))}
            {row.length < columns &&
              Array.from({ length: columns - row.length }).map((_, idx) => (
                <div key={`empty-${idx}`} style={{ flex: 1 }}></div>
              ))}
          </div>
        ))}
      </div>
    );
  };

  if (loadError) {
    return (
      <div>
        <h4>Sprachbausteine Teil 2</h4>
        <p style={{ color: 'red' }}>⚠️ Keine Daten für {level.toUpperCase()} – {examSet} gefunden.</p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Sprachbausteine Teil 2 für {level.toUpperCase()} – {examSet}...</p>;
  }

  return (
    <div>
      <h4>{data.title || 'Sprachbausteine Teil 2'}</h4>
      <p className="instructions">
        {data.instruction}
      </p>

      <div className="question-block" style={{ lineHeight: '2' }}>
        {renderTextWithBlanks()}
      </div>

      {renderAnswerOptionsBox()}
    </div>
  );
}

export default SprachbausteineTeil2;
