import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function FillInTheBlanksQuiz() {
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
        const file = await import(`../data/${level}/basicfillblankspaces.json`);
        const dataArray = file.default;

        if (Array.isArray(dataArray) && dataArray.length > 0) {
          const randomIndex = Math.floor(Math.random() * dataArray.length);
          setData(dataArray[randomIndex]);
        } else {
          console.error('Loaded data is not an array or empty.');
          setData(null);
        }

        setUserAnswers({});
        setShowResults(false);
        setSubmitAttempted(false);
      } catch (err) {
        console.error('❌ Error loading fill-in-the-blanks file:', err);
        setData(null);
      }
    }

    loadData();
  }, [level]);

  const handleSelect = (blankId, value) => {
    setUserAnswers((prev) => ({ ...prev, [blankId]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(userAnswers).length < Object.keys(data.blanks).length) return;

    let total = 0;
    Object.entries(data.blanks).forEach(([id, correctKey]) => {
      if (userAnswers[id] === correctKey) total++;
    });
    setScore(total);
    setShowResults(true);
  };

  if (!data) {
    return <div className="quiz-container">Keine Daten für das Level {level.toUpperCase()} gefunden.</div>;
  }


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
                        disabled={showResults}
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
        <div className='answers-box'>
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


  return (
    <div className="quiz-container">
      {showResults && score / Object.keys(data.blanks).length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={200} />
      )}
      <h2>{data.title}</h2>
      <p className="instructions">Lesen Sie den Text und schließen Sie die Lücken. Benutzen Sie die Buchstaben a–o. Jedes Wort passt nur einmal.</p>

      <div className="question-block" style={{ lineHeight: '2' }}>
        {renderTextWithBlanks()}
      </div>

      {renderAnswerOptionsBox()}

      {!showResults ? (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>Abschicken</button>
          {submitAttempted && Object.keys(userAnswers).length < Object.keys(data.blanks).length && (
            <p style={{ color: 'red' }}>⚠️ Bitte füllen Sie alle Lücken aus.</p>
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

export default FillInTheBlanksQuiz;
