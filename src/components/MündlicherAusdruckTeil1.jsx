import { useState, useEffect } from 'react';
import '../css/QuizPage.css';

function MündlicherAusdruckTeil1({ level, examSet, onReady }) {
  const [responses, setResponses] = useState({});
  const [startTime] = useState(Date.now());
  const [duration, setDuration] = useState(null);

  const questions = [
    "Name",
    "Woher sie oder er kommt",
    "Wie sie oder er wohnt (Wohnung, Haus, Garten …)",
    "Familie",
    "Wo sie oder er Deutsch gelernt hat",
    "Was sie oder er macht (Schule, Studium, Beruf …)",
    "Sprachen (welche? wie lange? warum?)",
    "Wie sie oder er das Wochenende verbringt (optional)",
    "Welche Hobbys er oder sie hat (optional)"
  ];

  const handleChange = (question, value) => {
    setResponses(prev => ({ ...prev, [question]: value }));
  };

  useEffect(() => {
    const scoreFn = () => {
      const answered = questions.filter(q => responses[q] && responses[q].trim().length > 0);
      return {
        score: answered.length,
        total: questions.length,
        duration: ((Date.now() - startTime) / 1000) // in seconds
      };
    };
    if (onReady) onReady(scoreFn, questions.length);
  }, [responses, onReady, questions.length, startTime]);

  return (
    <div className="quiz-container">
      <h2>Mündlicher Ausdruck </h2>
      <h2>Teilnehmer/in A und B </h2>
      <h3>Teil 1: Einander kennenlernen</h3>
      <p className="instructions">Unterhalten Sie sich mit Ihrer Partnerin bzw. Ihrem Partner über folgende Themen:</p>
        <div className="intro-dialogue-container">
        {questions.map((q, idx) => (
            <div  key={idx}>
            <h3  className="intro-dialogue"> {q}</h3>
            </div>
        ))}
        </div>

        <p>Die Prüfenden können außerdem noch weitere Fragen stellen.</p>
        <div className="intro-dialogue-footer">
          <h3>Mögliche Zusatzthemen für Prüfende sind</h3>
          <p>- wie er oder sie das Wochenende verbringt</p>
          <p>- welche Hobbys er oder sie hat</p>
        </div>
    </div>
  );
}

export default MündlicherAusdruckTeil1;
