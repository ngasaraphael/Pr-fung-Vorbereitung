// src/components/Email.jsx
import { useEffect, useState } from 'react';
import '../css/QuizPage.css';

function Email({ level, examSet, onReady }) {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loadError, setLoadError] = useState(false);

  const allFiles = import.meta.glob('../data/*/Exam*/email.json', { eager: true });

  useEffect(() => {
    const match = Object.keys(allFiles).find(
      path => path.includes(`/${level}/`) && path.includes(`/${examSet}/`)
    );

    if (match && allFiles[match]) {
      setData(allFiles[match]);
      setAnswers({});
      setLoadError(false);
    } else {
      setData(null);
      setLoadError(true);
    }
  }, [level, examSet]);

  const handleSelect = (label, value) => {
    setAnswers((prev) => ({ ...prev, [label]: value }));
  };

  useEffect(() => {
    if (!data || !data.gaps) return;

    const scoreFn = () => {
      let correct = 0;
      data.gaps.forEach((g) => {
        if (answers[g.label] === g.correctAnswer) correct++;
      });
      return { score: correct, total: data.gaps.length };
    };

    onReady(scoreFn, data.gaps.length);
  }, [answers, data, onReady]);

  if (loadError) {
    return (
      <div>
        <h4>Email – Schreibaufgabe</h4>
        <p style={{ color: 'red' }}>
          ❌ Keine Daten gefunden für {level.toUpperCase()} – {examSet}
        </p>
      </div>
    );
  }

  if (!data) {
    return <p>⏳ Lade Schreibaufgabe ({examSet})...</p>;
  }

  const renderGap = (label) => {
    const gapData = data.gaps.find((g) => g.label === label);
    if (!gapData) return null;

    return (
      <span className="gap-container" key={label}>
        <select
          value={answers[label] || ''}
          onChange={(e) => handleSelect(label, e.target.value)}
        >
          <option value="">-- {label} --</option>
          {gapData.options.map((opt) => (
            <option key={opt} value={opt}>{opt}</option>
          ))}
        </select>
      </span>
    );
  };

  const parsedResponse = data.responseEmailWithGaps
    .split(/(\[.*?: ⬇️\])/g)
    .map((part, i) => {
      const match = part.match(/\[(.*?): ⬇️\]/);
      if (match) {
        const label = match[1].trim();
        return renderGap(label);
      }
      return <span key={i}>{part}</span>;
    });

  return (
    <div>
      <h4>{data.title || 'Schreibaufgabe – E-Mail'}</h4>

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
    </div>
  );
}

export default Email;
