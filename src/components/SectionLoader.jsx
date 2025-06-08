import { useEffect, useState } from 'react';

function SectionLoader({ sectionKey, label, level, examSet, onScore }) {
  const [data, setData] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    setData(null);
    setAnswers({});
    setSubmitted(false);
    setScore(0);

    import(`../data/${level}/${examSet}/${sectionKey}.json`)
      .then((mod) => setData(mod.default))
      .catch(() => setData(null));
  }, [level, examSet, sectionKey]);

  const handleAnswer = (id, value) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = () => {
    if (!data) return;

    let correct = 0;
    data.paragraphs.forEach((p) => {
      if (answers[p.id] === p.correctHeading) correct++;
    });

    setScore(correct);
    setSubmitted(true);
    onScore(sectionKey, correct, data.paragraphs.length);
  };

  if (!data) {
    return <div className="child"><strong>{label}</strong><p>📄 Keine Daten verfügbar</p></div>;
  }

  return (
    <div className="child">
      <h4>{label}</h4>

      {data.paragraphs.map((para, idx) => (
        <div key={para.id} style={{ marginBottom: '1rem' }}>
          <p><strong>{idx + 1}.</strong> {para.text}</p>
          <select
            value={answers[para.id] || ''}
            onChange={(e) => handleAnswer(para.id, e.target.value)}
            disabled={submitted}
          >
            <option value="">-- auswählen --</option>
            {Object.entries(data.headings).map(([key, heading]) => (
              <option key={key} value={key}>
                {key}: {heading}
              </option>
            ))}
          </select>
        </div>
      ))}

      {!submitted ? (
        <button onClick={handleSubmit}>Teil abschicken</button>
      ) : (
        <p>✅ Ergebnis: {score} von {data.paragraphs.length} richtig</p>
      )}
    </div>
  );
}

export default SectionLoader;
