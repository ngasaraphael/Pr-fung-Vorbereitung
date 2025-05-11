import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function MCQFillBlanksQuiz() {
  const { level } = useContext(LevelContext);
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();

  useEffect(() => {
    async function loadData() {
      try {
        const file = await import(`../data/${level}/mcqfillblankspaces.json`);
        setData(file.default);
        setUserAnswers({});
        setShowResults(false);
        setSubmitAttempted(false);
      } catch (err) {
        console.warn(`⚠️ Keine Datei gefunden für Level ${level}:`, err);
        setData(null);
      }
    }
    loadData();
  }, [level]);

  const handleChange = (blankNumber, value) => {
    setUserAnswers((prev) => ({ ...prev, [blankNumber]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(userAnswers).length < Object.keys(data.blanks).length) return;

    let total = 0;
    Object.entries(data.blanks).forEach(([blank, correctKey]) => {
      if (userAnswers[blank] === correctKey) total++;
    });

    setScore(total);
    setShowResults(true);
  };

  if (!data) {
    return <div className="quiz-container">⚠️ Für das Level {level.toUpperCase()} wurden keine Sprachbausteine geladen.</div>;
  }

  return (
    <div className="quiz-container">
      {showResults && score / Object.keys(data.blanks).length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={200} />
      )}

      <h2>{data.title}</h2>
      <div className="reading-text" style={{ whiteSpace: 'pre-line', marginBottom: '1.5rem' }}>
        {data.text}
      </div>

      {Object.entries(data.blanks).map(([blankNumber, correctKey]) => (
        <div key={blankNumber} className="question-block">
          <p><strong>Lücke {blankNumber}:</strong></p>
          <div>
            {Object.entries(data.options[blankNumber]).map(([optionKey, optionText]) => (
              <label key={optionKey} className="option-label">
                <input
                  type="radio"
                  name={`blank-${blankNumber}`}
                  value={optionKey}
                  checked={userAnswers[blankNumber] === optionKey}
                  onChange={(e) => handleChange(blankNumber, e.target.value)}
                  disabled={showResults}
                />
                {' '}
                {optionText}
              </label>
            ))}
          </div>
        </div>
      ))}

      {!showResults ? (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>
            Abschicken
          </button>
          {submitAttempted && Object.keys(userAnswers).length < Object.keys(data.blanks).length && (
            <p style={{ color: 'red', marginTop: '0.5rem' }}>
              ⚠️ Bitte alle Lücken ausfüllen, bevor du abschickst.
            </p>
          )}
        </div>
      ) : (
        <div className={`result-box ${score / Object.keys(data.blanks).length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
          <h3>Ergebnis: {score} von {Object.keys(data.blanks).length} richtig</h3>
          <p>{score / Object.keys(data.blanks).length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
        </div>
      )}
    </div>
  );
}

export default MCQFillBlanksQuiz;
