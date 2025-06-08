import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function SprachbausteineTeil1() {
  const { level } = useContext(LevelContext);
  const [exam, setExam] = useState('Exam1');
  const [data, setData] = useState(null);
  const [userAnswers, setUserAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/SprachbausteineTeil1.json', { eager: true });
    const matchPath = Object.keys(allFiles).find(
      (path) => path.includes(`/${level}/`) && path.includes(`/${exam}/`)
    );
    const file = matchPath ? allFiles[matchPath] : null;

    if (file) {
      setData(file);
      setUserAnswers({});
      setShowResults(false);
      setSubmitAttempted(false);
      setLoadError(false);
    } else {
      console.warn(`⚠️ Keine Datei gefunden für Level ${level}, ${exam}`);
      setData(null);
      setLoadError(true);
    }
  }, [level, exam]);

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

  return (
    <div className="quiz-container">
      {/* Exam dropdown */}
      <div className="exam-switcher">
        <label>
          Prüfung auswählen:{' '}
          <select value={exam} onChange={(e) => setExam(e.target.value)}>
            <option value="Exam1">Prüfung 1</option>
            <option value="Exam2">Prüfung 2</option>
            <option value="Exam3">Prüfung 3</option>
          </select>
        </label>
      </div>

      {loadError ? (
        <p style={{ color: 'red' }}>
          ⚠️ Keine Sprachbausteine für Level <strong>{level.toUpperCase()}</strong> – {exam} gefunden.
        </p>
      ) : !data ? (
        <p>⏳ Lade Sprachbausteine für {level.toUpperCase()} – {exam}...</p>
      ) : (
        <>
          {showResults && score / Object.keys(data.blanks).length >= 0.6 && (
            <Confetti width={width} height={height} numberOfPieces={200} />
          )}

          <h2>{data.title}</h2>
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
                        disabled={showResults}
                      />
                      {' '}
                      {optionText}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>

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
        </>
      )}
    </div>
  );
}

export default SprachbausteineTeil1;
