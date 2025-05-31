import { useContext, useEffect, useState } from 'react';
import '../css/QuizPage.css';
import { LevelContext } from '../context/LevelContext';

function Email() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1');
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [loadError, setLoadError] = useState(false);

  const allFiles = import.meta.glob('../data/*/Exam*/email.json', { eager: true });

  useEffect(() => {
    setAnswers({});
    setShowResults(false);
    setSubmitAttempted(false);
    setLoadError(false);

    const match = Object.keys(allFiles).find(
      path => path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );

    if (match && allFiles[match]) {
      setData(allFiles[match]);
    } else {
  
      setLoadError(true);
      setData(null);
    }
  }, [level, examSet]);

  const handleSelect = (label, value) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (!data || Object.keys(answers).length < data.gaps.length) return;
    setShowResults(true);
  };

  const renderGap = (label) => {
    const gapData = data.gaps.find((g) => g.label === label);
    if (!gapData) return null;

    const isCorrect = answers[label] === gapData.correctAnswer;

    return (
      <span className="gap-container" key={label}>
        <select
          value={answers[label] || ''}
          onChange={(e) => handleSelect(label, e.target.value)}
          disabled={showResults}
        >
          <option value="">-- {label} --</option>
          {gapData.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
        {showResults && (
          <span className={`gap-feedback ${isCorrect ? 'correct' : 'incorrect'}`}>
            {isCorrect ? '✅' : `❌ (${gapData.correctAnswer})`}
          </span>
        )}
      </span>
    );
  };

  const renderExamSelector = () => (
    <div className="exam-switcher">
      <label>
         Prüfung auswählen:{' '}
        <select value={examSet} onChange={(e) => setExamSet(e.target.value)} style={{ marginLeft: '0.5rem' }}>
          <option value="Exam1">Exam 1</option>
          <option value="Exam2">Exam 2</option>
          <option value="Exam3">Exam 3</option>
        </select>
      </label>
    </div>
  );

  if (loadError) {
    return (
      <div className="quiz-container">
        {renderExamSelector()}
        <h2>❌ Fehler beim Laden</h2>
        <p>Keine Schreibaufgabe für {level.toUpperCase()} – {examSet} gefunden.</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="quiz-container">
        {renderExamSelector()}
        ⏳ Lade Schreibaufgabe ({examSet})...
      </div>
    );
  }

  const parsedResponse = data.responseEmailWithGaps.split(/(\[.*?: ⬇️\])/g).map((part, i) => {
    const match = part.match(/\[(.*?): ⬇️\]/);
    if (match) {
      const label = match[1].trim();
      return renderGap(label);
    }
    return <span key={i}>{part}</span>;
  });

  return (
    <div className="quiz-container">
      {renderExamSelector()}

      <h2>{data.title}</h2>

      <div className="email-section">
        <p className="italic-line">Sie haben von einer Freundin folgende E-Mail erhalten:</p>
        <pre className="email-block">{data.emailPrompt}</pre>
      </div>

      <div className="instructions">
        {data.instructions.split('\n').map((line, idx) => (
          <div key={idx} className={idx === 0 ? 'italic-line' : 'normal-line'}>
            {line}
          </div>
        ))}
        {data.instruction2 && (
          <div className="italic-line" style={{ marginTop: '0.5rem' }}>
            {data.instruction2}
          </div>
        )}
      </div>

      <div className="response-section">
        <h3>Antwort mit Lücken:</h3>
        <p className="response-text">{parsedResponse}</p>
      </div>

      {!showResults ? (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>Abschicken</button>
          {submitAttempted && Object.keys(answers).length < data.gaps.length && (
            <p style={{ color: 'red' }}>⚠️ Bitte alle Lücken ausfüllen.</p>
          )}
        </div>
      ) : (
        <div className="result-box">
          <h3>
            Ergebnis: {
              data.gaps.filter(g => answers[g.label] === g.correctAnswer).length
            } von {data.gaps.length} richtig
          </h3>
        </div>
      )}
    </div>
  );
}

export default Email;
