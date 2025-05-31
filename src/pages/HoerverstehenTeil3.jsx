import { useContext, useEffect, useState } from 'react';
import '../css/QuizPage.css';
import { LevelContext } from '../context/LevelContext';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function LeseverstehenTeil3() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1');
  const [data, setData] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();
  const [loadError, setLoadError] = useState(false);

  const allFiles = import.meta.glob('../data/*/*/LeseverstehenTeil3.json', { eager: true });

  useEffect(() => {
    setData(null);
    setUserMatches({});
    setShowResults(false);
    setSubmitAttempted(false);
    setLoadError(false);

    const key = Object.keys(allFiles).find(path =>
      path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );

    if (key && allFiles[key]) {
      setData(allFiles[key]);
    } else {
      setLoadError(true);
      console.error('❌ File not found for:', level, examSet);
    }
  }, [level, examSet]);

  const handleSelect = (id, value) => {
    setUserMatches(prev => ({ ...prev, [id]: value }));
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

  if (loadError) {
    return (
      <div className="quiz-container">
        <h2>❌ Fehler beim Laden</h2>
        <p>Prüfungsdaten für {examSet} – {level.toUpperCase()} nicht gefunden.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="quiz-container">
        ⏳ Lade Leseverstehen Teil 3 ({examSet})...
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {showResults && score / data.situations.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>Leseverstehen Teil 3</h2>
      <label>
        Prüfungsset:
        <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="Exam1">Exam 1</option>
          <option value="Exam2">Exam 2</option>
          <option value="Exam3">Exam 3</option>
        </select>
      </label>

      <p className="instructions">
        Lesen Sie die Situationen 1–10 und die Anzeigen a–l. Finden Sie für jede Situation die passende Anzeige.
        Sie können jede Anzeige nur einmal benutzen. Wenn Sie zu einer Situation keine Anzeige finden, markieren Sie ein X.
      </p>

      {data.situations.map((s, idx) => (
        <div key={s.id} className="question-block-LT3">
          <p className="situation-LT3"><strong>{idx + 1}</strong> {s.text}</p>
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
    </div>
  );
}

export default LeseverstehenTeil3;
