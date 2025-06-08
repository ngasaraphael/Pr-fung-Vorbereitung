import { useContext, useEffect, useState } from 'react';
import '../css/QuizPage.css';
import { LevelContext } from '../context/LevelContext';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';

function LeseverstehenTeil1() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1'); // ✅ dropdown state
  const [data, setData] = useState(null);
  const [userMatches, setUserMatches] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [width, height] = useWindowSize();

  useEffect(() => {
    setData(null);
    setShowResults(false);
    setUserMatches({});
    setSubmitAttempted(false);

    import(`../data/${level}/${examSet}/LeseverstehenTeil1.json`)
      .then((mod) => {
        setData(mod.default);
      })
      .catch((err) => {
  
        setData(null);
      });
  }, [level, examSet]);

  const handleSelect = (paraId, value) => {
    setUserMatches((prev) => ({ ...prev, [paraId]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(userMatches).length < data.paragraphs.length) return;

    let total = 0;
    data.paragraphs.forEach((para) => {
      if (userMatches[para.id] === para.correctHeading) total++;
    });

    setScore(total);
    setShowResults(true);
  };

  if (data === null) {
    return (
      <div className="quiz-container">
       
        <label>
          Prüfung auswählen:{' '}
          <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
            <option value="Exam1">Prüfung 1</option>
            <option value="Exam2">Prüfung 2</option>
            <option value="Exam3">Prüfung 3</option>
          </select>
        </label>
         <h2>Leseverstehen Teil 1</h2>
        <p>📦 Keine Aufgaben für Level <strong>{level.toUpperCase()}</strong> und {examSet} verfügbar.</p>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      {showResults && score / data.paragraphs.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}



      <label>
        Prüfung auswählen
        <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="Exam1">Prüfung 1</option>
          <option value="Exam2">Prüfung 2</option>
          <option value="Exam3">Prüfung 3</option>
        </select>
      </label>
      <h2>Leseverstehen Teil 1</h2>
      <p className='instructions'>
        Lesen Sie die Überschriften a–j und die Texte 1–5. Finden Sie für jeden Text die passende Überschrift.
        Sie können jede Überschrift nur einmal benutzen.
        Markieren Sie Ihre Lösungen für die Aufgaben 1–5 auf dem Antwortbogen.
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
            disabled={showResults}
            className='answer-dropdown'
          >
            <option value="">-- auswählen --</option>
            {Object.keys(data.headings).map((key) => (
              <option key={key} value={key}>{key}</option>
            ))}
          </select>
        </div>
      ))}

      {!showResults ? (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>Abschicken</button>
          {submitAttempted && Object.keys(userMatches).length < data.paragraphs.length && (
            <p style={{ color: 'red' }}>
              ⚠️ Bitte ordnen Sie jeder Aufgabe eine Überschrift zu.
            </p>
          )}
        </div>
      ) : (
        <div className={`result-box ${score / data.paragraphs.length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
          <h3>Ergebnis: {score} von {data.paragraphs.length} richtig</h3>
          <p>{score / data.paragraphs.length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
        </div>
      )}
    </div>
  );
}

export default LeseverstehenTeil1;
