import { useContext, useEffect, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function MatchingAdsReadingQuiz() {
  const { level } = useContext(LevelContext);
  const [data, setData] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();

  useEffect(() => {
    async function loadData() {
      try {
        const file = await import(`../data/${level}/matching_ads_reading_${level}.json`);
        setData(file.default);
        setUserMatches({});
        setShowResults(false);
        setSubmitAttempted(false);
      } catch (err) {
        console.error('❌ Error loading matching ads file:', err);
        setData(null);
      }
    }
    loadData();
  }, [level]);

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

  if (!data) {
    return <div className="quiz-container">Für das Level {level.toUpperCase()} wurde keine Anzeige geladen.</div>;
  }

  return (
    <div className="quiz-container">
      {showResults && score / data.situations.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={200} />
      )}
      <h2>{data.title}</h2>

      <div className="matching-headings">
        {Object.entries(data.ads).map(([key, ad]) => (
          <div key={key} className="heading-card">
            <strong>{key}: {ad.title}</strong>
            <span>{ad.description}</span>
          </div>
        ))}
      </div>

      {data.situations.map((s, idx) => (
        <div key={s.id} className="question-block">
          <p><strong>Situation {idx + 1}:</strong> {s.text}</p>
          <label>
            Wählen Sie die passende Anzeige:
            <select
              value={userMatches[s.id] || ''}
              onChange={(e) => handleSelect(s.id, e.target.value)}
              disabled={showResults}
            >
              <option value="">-- auswählen --</option>
              {Object.keys(data.ads).map((key) => (
                <option key={key} value={key}>{key}</option>
              ))}
            </select>
          </label>
        </div>
      ))}

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

export default MatchingAdsReadingQuiz;
