import { useContext, useState, useEffect, useRef } from 'react';
import { LevelContext } from '../context/LevelContext';
import '../css/QuizPage.css';
import { FaClipboardList } from "react-icons/fa";

// Section components
import LeseverstehenTeil1 from '../components/LeseverstehenTeil1';
import LeseverstehenTeil2 from '../components/LeseverstehenTeil2';
import LeseverstehenTeil3 from '../components/LeseverstehenTeil3';
import SprachbausteineTeil1 from '../components/SprachbausteineTeil1';
import SprachbausteineTeil2 from '../components/SprachbausteineTeil2';
import HoerverstehenTeil1 from '../components/HoerverstehenTeil1';
import HoerverstehenTeil2 from '../components/HoerverstehenTeil2';
import HoerverstehenTeil3 from '../components/HoerverstehenTeil3';
import MündlicherAusdruckTeil1 from '../components/MündlicherAusdruckTeil1';
import Email from '../components/Email';
import ThemaSprechen from '../components/ThemaSprechen';
import EtwasPlanen from '../components/EtwasPlanen';


// Sections
const sections = [
  { key: 'LeseverstehenTeil1', label: 'Leseverstehen Teil 1' },
  { key: 'LeseverstehenTeil2', label: 'Leseverstehen Teil 2' },
  { key: 'LeseverstehenTeil3', label: 'Leseverstehen Teil 3' },
  { key: 'SprachbausteineTeil1', label: 'Sprachbausteine Teil 1' },
  { key: 'SprachbausteineTeil2', label: 'Sprachbausteine Teil 2' },
  { key: 'HoerverstehenTeil1', label: 'Hörverstehen Teil 1' },
  { key: 'HoerverstehenTeil2', label: 'Hörverstehen Teil 2' },
  { key: 'HoerverstehenTeil3', label: 'Hörverstehen Teil 3' },
  { key: 'Email', label: 'Schreiben – E-Mail' },
  { key: 'MündlicherAusdruckTeil1', label: 'Mündlicher Ausdruck Teil 1' },

  { key: 'ThemaSprechen', label: 'Mündlicher Ausdruck – Thema sprechen' },
  { key: 'EtwasPlanen', label: 'Mündlich – Gemeinsam planen' },


];

// Component map
const componentMap = {
  LeseverstehenTeil1,
  LeseverstehenTeil2,
  LeseverstehenTeil3,
  SprachbausteineTeil1,
  SprachbausteineTeil2,
  HoerverstehenTeil1,
  HoerverstehenTeil2,
  HoerverstehenTeil3,
  Email,
  MündlicherAusdruckTeil1,
  ThemaSprechen,
   EtwasPlanen,

};

function ExaminationPage() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1');
  const [sectionScorers, setSectionScorers] = useState({});
  const [resultModal, setResultModal] = useState(null);

  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(4 * 60 * 60); // 4 hours in seconds
  const timerRef = useRef(null);

  // Reset when level or exam changes
  useEffect(() => {
    setSectionScorers({});
    setStarted(false);
    setPaused(false);
    setRemainingTime(4 * 60 * 60);
    clearInterval(timerRef.current);
  }, [level, examSet]);

  // Timer logic
  useEffect(() => {
    if (started && !paused) {
      timerRef.current = setInterval(() => {
        setRemainingTime(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleFinalSubmit(true); // auto-submit
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [started, paused]);

  const formatTime = (seconds) => {
    const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const s = String(seconds % 60).padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  const onReadyHandlersRef = useRef({});
  const createStableOnReady = (key) => {
    if (!onReadyHandlersRef.current[key]) {
      onReadyHandlersRef.current[key] = (scoreFn, total) => {
        setSectionScorers((prev) => {
          if (prev[key]?.scoreFn === scoreFn) return prev;
          return { ...prev, [key]: { scoreFn, total } };
        });
      };
    }
    return onReadyHandlersRef.current[key];
  };

  const handleFinalSubmit = (auto = false) => {
    clearInterval(timerRef.current);
    setStarted(false);

    const validSections = Object.values(sectionScorers);
    let totalCorrect = 0;
    let totalQuestions = 0;

    for (const { scoreFn, total } of validSections) {
      const { score } = scoreFn();
      totalCorrect += score;
      totalQuestions += total;
    }

    const passed = totalCorrect / totalQuestions >= 0.6;

    setResultModal({
      totalCorrect,
      totalQuestions,
      passed,
      auto,
    });
  };

  return (
    <div className="exam-page">
      <h2>
        <FaClipboardList style={{ marginRight: '0.5rem' }} />
        Gesamte Prüfung – Niveau {level.toUpperCase()}
      </h2>

      <label className="exam-selector">
        Prüfungsset:
        <select value={examSet} onChange={(e) => setExamSet(e.target.value)} disabled={started} style={{ marginLeft: '0.5rem' }}>
          <option value="Exam1">Prüfung 1</option>
          <option value="Exam2">Prüfung 2</option>
          <option value="Exam3">Prüfung 3</option>
        </select>
      </label>

      <div className="timer-controls">
        {!started ? (
          <button className="start-button" onClick={() => setStarted(true)}>Start Prüfung</button>
        ) : (
          <button className="pause-button" onClick={() => setPaused(prev => !prev)}>
            {paused ? 'Fortsetzen' : 'Pause'}
          </button>
        )}
        {started && (
          <span className="countdown-display">
            ⏳ Verbleibende Zeit: <strong>{formatTime(remainingTime)}</strong>
          </span>
        )}
      </div>

      {started && (
        <>
          <div className="parent">
            {sections.map(({ key, label }) => {
              const Component = componentMap[key];
              const stableOnReady = createStableOnReady(key);

              return Component ? (
                <div key={key} className="child">
                  <Component level={level} examSet={examSet} onReady={stableOnReady} />
                </div>
              ) : (
                <div key={key} className="child">
                  <p>⚠️ Komponente für {label} fehlt.</p>
                </div>
              );
            })}
          </div>

          <div className="submit-container">
            <button className="submit-button" onClick={() => handleFinalSubmit(false)}>
              Abschicken
            </button>
          </div>
        </>
      )}

      {/* Result Modal */}
      {resultModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{resultModal.auto && '⏰ Zeit ist abgelaufen!'}</h3>
            <p>Ergebnis: <strong>{resultModal.totalCorrect} von {resultModal.totalQuestions} richtig</strong></p>
            <p>{resultModal.passed ? '✅ Bestanden!' : '❌ Nicht bestanden'}</p>
            <button onClick={() => setResultModal(null)} className="modal-close-button">
              Schließen
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ExaminationPage;
