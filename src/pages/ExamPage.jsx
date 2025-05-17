import { useEffect, useState, useContext } from 'react';
import { LevelContext } from '../context/LevelContext';
import Confetti from 'react-confetti';
import { useWindowSize } from '@react-hook/window-size';
import { useLocation } from 'react-router-dom'; // ✅ Added
import '../css/QuizPage.css';

const QUESTIONS_PER_PAGE = 5;
const TOTAL_TIME = 60 * 60; // 60 minutes in seconds

function ExamPage() {
  const { level } = useContext(LevelContext);
  const [questions, setQuestions] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(TOTAL_TIME);
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [width, height] = useWindowSize();
  const location = useLocation(); // ✅ Access pathname

  useEffect(() => {
    let count = 1;

    const addSection = (arr, prefix, section) =>
      arr.map((q) => ({
        ...q,
        id: `${prefix}-${count++}`,
        sectionLabel: section
      }));

    Promise.all([
      import(`../data/${level}/reading.json`),
      import(`../data/${level}/listening.json`),
      import(`../data/${level}/satzbau.json`)
    ])
      .then(([reading, listening, satzbau]) => {
        const combined = [
          ...addSection(reading.default, 'r', 'Lesen'),
          ...addSection(listening.default, 'l', 'Hören'),
          ...addSection(satzbau.default, 's', 'Satzbau')
        ];
        setQuestions(combined);
        setCurrentPage(1);
      })
      .catch(() => setQuestions([]));
  }, [level]);

  useEffect(() => {
    if (showResults) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showResults]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleChange = (questionId, value) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleWordClick = (questionId, word) => {
    setUserAnswers((prev) => {
      const current = prev[questionId] || [];
      if (!current.includes(word)) {
        return { ...prev, [questionId]: [...current, word] };
      }
      return prev;
    });
  };

  const handleResetSentence = (questionId) => {
    setUserAnswers((prev) => ({ ...prev, [questionId]: [] }));
  };

  const handleSubmit = () => {
    setSubmitAttempted(true);
    if (Object.keys(userAnswers).length < questions.length) return;

    let total = 0;
    questions.forEach((q) => {
      if (q.type === 'mcq' && userAnswers[q.id] === q.answer) total++;
      if (
        q.type === 'sentence_order' &&
        Array.isArray(userAnswers[q.id]) &&
        JSON.stringify(userAnswers[q.id]) === JSON.stringify(q.correctOrder)
      ) total++;
    });
    setScore(total);
    setShowResults(true);
  };

  const totalPages = Math.ceil(questions.length / QUESTIONS_PER_PAGE);
  const startIndex = (currentPage - 1) * QUESTIONS_PER_PAGE;
  const paginatedQuestions = questions.slice(startIndex, startIndex + QUESTIONS_PER_PAGE);

  let lastSectionRendered = '';

  return (
    <div className="quiz-container">
      {showResults && score / questions.length >= 0.6 && (
        <Confetti width={width} height={height} numberOfPieces={250} />
      )}

      <h2>Gesamte Prüfung</h2>
      <div className="exam-timer">
        ⏳ Verbleibende Zeit: <strong>{formatTime(timeLeft)}</strong>
      </div>

      {paginatedQuestions.map((q, index) => {
        const showSectionHeader = q.sectionLabel !== lastSectionRendered;
        if (showSectionHeader) lastSectionRendered = q.sectionLabel;

        return (
          <div key={q.id} className="question-block">
            {showSectionHeader && (
              <div className="section-header">📘 Abschnitt: {q.sectionLabel}</div>
            )}

            <p>
              <strong>Frage {startIndex + index + 1}:</strong> {q.question}
            </p>

            {q.audio && (
              <audio controls style={{ margin: '0.5rem 0', width: '100%' }}>
                <source src={q.audio} type="audio/mpeg" />
                Dein Browser unterstützt das Audioelement nicht.
              </audio>
            )}

            {q.type === 'mcq' &&
              q.options.map((opt) => (
                <label key={opt} className="option-label">
                  <input
                    type="radio"
                    name={`q${q.id}`}
                    value={opt}
                    checked={userAnswers[q.id] === opt}
                    onChange={(e) => handleChange(q.id, e.target.value)}
                    disabled={showResults}
                  />{' '}
                  {opt}
                </label>
              ))}

            {q.type === 'sentence_order' && (
              <>
                <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                  {q.fragments.map((word, i) => (
                    <button
                      key={i}
                      className="fragment-button"
                      onClick={() => handleWordClick(q.id, word)}
                      disabled={showResults || userAnswers[q.id]?.includes(word)}
                    >
                      {word}
                    </button>
                  ))}
                </div>
                {Array.isArray(userAnswers[q.id]) && (
                  <div>
                    <strong>Deine Antwort:</strong> {userAnswers[q.id].join(' ')}
                  </div>
                )}
                <button
                  className="reset-button"
                  onClick={() => handleResetSentence(q.id)}
                  disabled={showResults}
                >
                  Zurücksetzen
                </button>
              </>
            )}
          </div>
        );
      })}

      {!showResults && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
          <button
            onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
            disabled={currentPage === 1}
          >
            Zurück
          </button>
          <button
            onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Weiter
          </button>
        </div>
      )}

      {!showResults ? (
        <div className="submit-container">
          <button className="submit-button" onClick={handleSubmit}>
            Abschicken
          </button>

          {submitAttempted && Object.keys(userAnswers).length < questions.length && (
            <p style={{ color: 'red', marginTop: '0.5rem', fontSize: '0.95rem' }}>
              ⚠️ Bitte beantworte alle Fragen, bevor du abschickst.
            </p>
          )}
        </div>
      ) : (
        <>
          <div className={`result-box ${score / questions.length >= 0.6 ? 'result-pass' : 'result-fail'}`}>
            <h3>Gesamtergebnis: {score} von {questions.length} richtig</h3>
            <p>{score / questions.length >= 0.6 ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
          </div>
          <div className="submit-container">
              <button className="submit-button" onClick={() => {
                setUserAnswers({});
                setScore(0);
                setShowResults(false);
                setSubmitAttempted(false);
                setCurrentPage?.(1); // optional if paginated
              }}>
                🔄 Neu starten
              </button>
          </div>
        </>
      )}
    </div>
  );
}

export default ExamPage;
