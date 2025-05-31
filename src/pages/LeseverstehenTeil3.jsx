import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function LeseverstehenTeil3() {
  const { level } = useContext(LevelContext);
  const [exam, setExam] = useState('Exam1');
  const [data, setData] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const allFiles = import.meta.glob('../data/*/Exam*/LeseverstehenTeil3.json', { eager: true });
    const matchingPath = Object.keys(allFiles).find(
      (path) => path.includes(`/${level}/`) && path.includes(`/${exam}/`)
    );
    const file = matchingPath ? allFiles[matchingPath] : null;

    if (file) {
      setData(file);
      setUserMatches({});
      setShowResults(false);
      setSubmitAttempted(false);
      setLoadError(false);
    } else {
      console.error('❌ Datei nicht gefunden für:', level, exam);
      setLoadError(true);
      setData(null);
    }
  }, [level, exam]);

  const handleSelect = (situationId, value) => {
    setUserMatches((prev) => ({ ...prev, [situationId]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(userMatches).length < data.situations.length) return;

    let total = 0;
    data.situations.forEach((s) => {
      if (userMatches[s.id] === s.correctAd) total++;
    });
    setScore(total);
    setShowResults(true);
  };

  return (
    <div className="quiz-container">
      {/* Always show exam selector */}
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

      {/* Loading/Error States */}
      {loadError ? (
        <p style={{ color: 'red' }}>
          ❌ Fehler beim Laden der Daten für {level.toUpperCase()} – {exam}
        </p>
      ) : !data ? (
        <p>⏳ Lade Inhalte für {level.toUpperCase()} – {exam}...</p>
      ) : (
        <>
          {showResults && score / data.situations.length >= 0.6 && (
            <Confetti width={width} height={height} numberOfPieces={200} />
          )}

          <h2>Leseverstehen Teil 3</h2>
          <p className="instructions">
            Lesen Sie die Situationen 1–10 und die Anzeigen a–l. Finden Sie für jede Situation die passende Anzeige.
            Sie können jede Anzeige nur einmal benutzen. Wenn Sie zu einer Situation keine Anzeige finden, markieren Sie ein X.
          </p>

          {data.situations.map((s, idx) => (
            <div key={s.id} className="question-block-LT3">
              <p className="situation-LT3">
                <strong>{idx + 1}</strong> {s.text}
              </p>
              <label>
                <select
                  value={userMatches[s.id] || ''}
                  onChange={(e) => handleSelect(s.id, e.target.value)}
                  disabled={showResults}
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

          {!showResults ? (
            <div className="submit-container">
              <button className="submit-button" onClick={handleSubmit}>Abschicken</button>
              {submitAttempted && Object.keys(userMatches).length < data.situations.length && (
                <p style={{ color: 'red' }}>⚠️ Bitte ordnen Sie jeder Situation eine Anzeige zu.</p>
              )}
            </div>
          ) : (
            <div className={`result-box ${score / data.situations.length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
              <h3>Ergebnis: {score} von {data.situations.length} richtig</h3>
              <p>{score / data.situations.length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default LeseverstehenTeil3;
