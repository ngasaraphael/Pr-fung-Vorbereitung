// src/components/SprachbausteineTeil1.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function SprachbausteineTeil1({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/SprachbausteineTeil1.json', { eager: true });
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
      let total = 0;
      Object.entries(data.blanks).forEach(([blank, correctKey]) => {
        if (userAnswers[blank] === correctKey) total++;
      });
      return { score: total, total: Object.keys(data.blanks).length };
    };

    onReady(scoreFn, Object.keys(data.blanks).length);
  }, [data, userAnswers, onReady]);

  const handleChange = (blankNumber, value) => {
    setUserAnswers((prev) => ({ ...prev, [blankNumber]: value }));
  };

  if (loadError) {
    return (
      <div>
        <h4>Sprachbausteine Teil 1</h4>
        <p style={{ color: 'red' }}>
          ⚠️ Keine Sprachbausteine für <strong>{level.toUpperCase()}</strong> – {examSet} gefunden.
        </p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Sprachbausteine für {level.toUpperCase()} – {examSet}...</p>;
  }

  return (
    <div>
      <h4>{data.title || 'Sprachbausteine Teil 1'}</h4>
      <p className="instructions">
         {data.instruction}
      </p>

      <div className="reading-text" style={{ whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
        {data.text}
      </div>

      <div className="AnswerST1">
        {Object.entries(data.blanks).map(([blankNumber, correctKey]) => (
          <div key={blankNumber} className="question-block-ST1">
            <p><strong>{blankNumber}</strong></p>
            <div>
              {Object.entries(data.options[blankNumber]).map(([optionKey, optionText]) => (
                <label key={optionKey} className="option-label">
                  <input
                    type="radio"
                    name={`blank-${blankNumber}`}
                    value={optionKey}
                    checked={userAnswers[blankNumber] === optionKey}
                    onChange={(e) => handleChange(blankNumber, e.target.value)}
                  />
                  {' '}
                  {optionText}
                </label>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default SprachbausteineTeil1;
