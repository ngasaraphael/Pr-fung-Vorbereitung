import { useContext, useState } from 'react';
import { LevelContext } from '../context/LevelContext';
import EtwasPlanen from '../components/EtwasPlanen';
import '../css/QuizPage.css';

function EtwasPlanenPage() {
  const { level } = useContext(LevelContext);
  const [examSet, setExamSet] = useState('Exam1');

  return (
    <div className="quiz-container">
      <label className="exam-selector">
        Prüfungsset:
        <select
          value={examSet}
          onChange={(e) => setExamSet(e.target.value)}
          style={{ marginLeft: '0.5rem' }}
        >
          <option value="Exam1">Prüfung 1</option>
          <option value="Exam2">Prüfung 2</option>
          <option value="Exam3">Prüfung 3</option>
        </select>
      </label>

      <EtwasPlanen level={level} examSet={examSet} onReady={() => {}} />
    </div>
  );
}

export default EtwasPlanenPage;
