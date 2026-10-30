import React, { useState } from 'react';
import { Brain, RotateCcw, ArrowRight, ShieldAlert } from 'lucide-react';
import { mbtiQuestions, calculateMBTI, getMBTIProfile } from '../data/mbtiTest.js';

export default function MbtiTest() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);

  const currentQuestion = mbtiQuestions[currentIndex];
  const progress = result ? 100 : Math.round((currentIndex / mbtiQuestions.length) * 100);

  const handleAnswer = (type) => {
    if (result) return;
    const nextAnswers = [...answers, type];
    setAnswers(nextAnswers);

    if (currentIndex === mbtiQuestions.length - 1) {
      const profileType = calculateMBTI(nextAnswers);
      setResult({ type: profileType, ...getMBTIProfile(profileType) });
      return;
    }

    setCurrentIndex(index => index + 1);
  };

  const restartTest = () => {
    setCurrentIndex(0);
    setAnswers([]);
    setResult(null);
  };

  return (
    <section className="mbti-container">
      <header className="mbti-heading">
        <span className="eyebrow">MINDTRACE / EVALUACIÓN DE ESTILO</span>
        <h1><Brain aria-hidden="true" /> Test de Perfil Psicológico MBTI Forense</h1>
        <p>Explora tus preferencias de trabajo y análisis dentro de una simulación de investigación.</p>
      </header>

      <div className="mbti-card">
        {!result ? (
          <>
            <div className="mbti-progress-row">
              <span>PREGUNTA {currentIndex + 1} DE {mbtiQuestions.length}</span>
              <span>{progress}% COMPLETADO</span>
            </div>
            <div className="mbti-progress-track"><span style={{ width: `${progress}%` }} /></div>
            <span className="mbti-kicker">EXPEDIENTE DE AUTOCONOCIMIENTO</span>
            <h2>{currentQuestion.question}</h2>
            <div className="mbti-options">
              {currentQuestion.options.map((option, index) => (
                <button
                  className="mbti-option-btn"
                  type="button"
                  key={`${currentQuestion.id}-${option.type}`}
                  onClick={() => handleAnswer(option.type)}
                >
                  <span className="mbti-option-index">{String.fromCharCode(65 + index)}</span>
                  <span>{option.text}</span>
                  <ArrowRight className="mbti-option-arrow" size={18} aria-hidden="true" />
                </button>
              ))}
            </div>
            <p className="mbti-footnote">Selecciona la alternativa que mejor describa tu preferencia habitual. No hay respuestas correctas o incorrectas.</p>
          </>
        ) : (
          <div className="mbti-result" style={{ '--mbti-accent': result.color, borderColor: result.color }}>
            <span className="mbti-kicker">RESULTADO DE LA SIMULACIÓN</span>
            <div className="mbti-result-icon" style={{ color: result.color, borderColor: result.color }}>
              <Brain size={30} />
            </div>
            <span className="mbti-result-code" style={{ color: result.color }}>{result.type}</span>
            <h2>{result.title}</h2>
            <p>{result.desc}</p>
            <div className="mbti-result-note"><ShieldAlert size={17} /><span>Este resultado es orientativo y educativo. El MBTI no es una evaluación clínica, no diagnostica trastornos y no determina capacidad, peligrosidad ni culpabilidad.</span></div>
            <button className="mbti-restart-btn" type="button" onClick={restartTest}>
              <RotateCcw size={16} /> Repetir test
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
