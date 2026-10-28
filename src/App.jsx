import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, Award, BookOpen, BriefcaseBusiness, Check,
  ChevronRight, CircleHelp, ClipboardList, Clock3, Compass, Fingerprint, FlaskConical,
  GraduationCap, Leaf, LockKeyhole, Menu, MessageSquareText, Network, RotateCcw,
  Search, ShieldCheck, Sparkles, Target, Users, X, Zap
} from 'lucide-react';
import { scenarios, difficulties } from './data/scenarios.js';
import { advancedQuestions } from './data/advancedQuestions.js';
import { questionBank } from './data/questionBank.js';
import Scene3D from './components/Scene3D.jsx';
import { supabaseConfigured, saveProgress, loadProgress, ensureAnonymousSession } from './lib/supabase.js';

const iconMap = {
  messages: MessageSquareText, briefcase: BriefcaseBusiness, users: Users, leaf: Leaf
};
const LEVELS = ['Difícil', 'Muy difícil', 'Avanzado', 'Experto'];
const initialStats = { cases: 0, score: 0, discoveries: 0 };

function getSaved() {
  try { return JSON.parse(localStorage.getItem('mindtrace-progress') || '[]'); } catch { return []; }
}
function saveLocal(record) {
  const old = getSaved();
  localStorage.setItem('mindtrace-progress', JSON.stringify([record, ...old].slice(0, 30)));
}
function getLevel(rank) { return difficulties.find(d => d.rank === rank) || difficulties[0]; }

export default function App() {
  const [page, setPage] = useState('home');
  const [scenarioId, setScenarioId] = useState(scenarios[0].id);
  const [difficulty, setDifficulty] = useState('Difícil');
  const [questionIndex, setQuestionIndex] = useState(0);
  const [decisions, setDecisions] = useState([]);
  const [discovered, setDiscovered] = useState([]);
  const [activeEvidence, setActiveEvidence] = useState(null);
  const [hypothesis, setHypothesis] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [sessionScore, setSessionScore] = useState(0);
  const [saveState, setSaveState] = useState('idle');
  const [saveMessage, setSaveMessage] = useState('');
  const [history, setHistory] = useState(getSaved);
  const [remoteHistory, setRemoteHistory] = useState([]);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [toast, setToast] = useState('');
  const [showGuide, setShowGuide] = useState(false);
  const [bankIndex, setBankIndex] = useState(0);
  const [bankAnswer, setBankAnswer] = useState(null);
  const [bankScore, setBankScore] = useState(0);
  const [bankFilter, setBankFilter] = useState('Todas');
  const bankCategories = useMemo(() => ['Todas', ...new Set(questionBank.map(q => q.category))], []);
  const filteredBank = useMemo(() => questionBank.filter(q => bankFilter === 'Todas' || q.category === bankFilter), [bankFilter]);
  const bankQuestion = filteredBank[Math.min(bankIndex, filteredBank.length - 1)];

  const scenario = useMemo(() => {
    const base = scenarios.find(s => s.id === scenarioId) || scenarios[0];
    return { ...base, questions: advancedQuestions[base.id] || base.questions };
  }, [scenarioId]);
  const question = scenario.questions[questionIndex];
  const maxScore = scenario.questions.length * 10;
  const progressPct = Math.round((questionIndex / scenario.questions.length) * 100);
  const totalScore = history.reduce((sum, item) => sum + (item.score || 0), 0);
  const avgScore = history.length ? Math.round(totalScore / history.length) : 0;
  const currentRank = LEVELS.indexOf(difficulty) + 1;

  useEffect(() => {
    if (supabaseConfigured) loadProgress().then(setRemoteHistory).catch(() => {});
  }, []);
  const notify = (message) => { setToast(message); window.setTimeout(() => setToast(''), 3200); };
  const go = (next) => { setPage(next); setShowMobileMenu(false); window.scrollTo({top:0,behavior:'smooth'}); };
  const resetSession = (id = scenarioId) => {
    setScenarioId(id); setQuestionIndex(0); setDecisions([]); setDiscovered([]);
    setActiveEvidence(null); setHypothesis(''); setFeedback(null); setSessionScore(0);
    setSaveState('idle'); setSaveMessage('');
  };
  const startCase = (id) => { resetSession(id); go('case'); };
  const chooseOption = (option) => {
    if (feedback) return;
    const record = { question: question.prompt, answer: option.text, score: option.score, feedback: option.feedback, principle: option.principle };
    setDecisions(prev => [...prev, record]);
    setSessionScore(prev => prev + option.score);
    setFeedback(option);
  };
  const nextQuestion = () => {
    setFeedback(null);
    if (questionIndex + 1 < scenario.questions.length) setQuestionIndex(v => v + 1);
    else go('report');
  };
  const discover = useCallback((spot) => {
    setDiscovered(prev => prev.includes(spot.id) ? prev : [...prev, spot.id]);
  }, []);
  const finishReport = async () => {
    const raw = decisions.reduce((sum, d) => sum + d.score, 0);
    const explorationBonus = Math.min(10, discovered.length * 2.5);
    const score = Math.min(100, Math.round((raw / maxScore) * 90 + explorationBonus));
    const record = {
      id: `${Date.now()}`, scenarioId: scenario.id, scenarioTitle: scenario.title,
      difficulty, score, decisions, hypothesis, discoveries: discovered.length,
      completedAt: new Date().toISOString()
    };
    saveLocal(record);
    setHistory(getSaved());
    setSaveState('saving');
    try {
      const result = await saveProgress(record);
      setSaveState(result.mode === 'supabase' ? 'saved' : 'local');
      setSaveMessage(result.mode === 'supabase' ? 'Progreso sincronizado con Supabase.' : 'Guardado en este dispositivo. Configura Supabase para sincronizar entre dispositivos.');
      if (result.mode === 'supabase') loadProgress().then(setRemoteHistory).catch(() => {});
    } catch (error) {
      setSaveState('error');
      setSaveMessage(`Se guardó localmente, pero Supabase devolvió un error: ${error.message}`);
    }
  };
  const startNew = () => { resetSession(scenarioId); go('case'); };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${showMobileMenu?'mobile-open':''}`}>
        <div className="brand-lockup" onClick={() => go('home')} role="button" tabIndex={0}>
          <div className="brand-mark"><Fingerprint size={27}/></div>
          <div className="brand-copy"><strong>MINDTRACE</strong><span>LABORATORIO CRIMINOLÓGICO</span></div>
          <button className="mobile-close icon-button" onClick={(e)=>{e.stopPropagation();setShowMobileMenu(false)}}><X size={18}/></button>
        </div>
        <div className="sidebar-divider"/>
        <div className="nav-label">ESPACIO DE TRABAJO</div>
        <nav className="main-nav">
          <button className={`nav-item ${page==='home'?'active':''}`} onClick={()=>go('home')}><Compass size={18}/><span>Panel principal</span></button>
          <button className={`nav-item ${page==='scenarios'?'active':''}`} onClick={()=>go('scenarios')}><ClipboardList size={18}/><span>Casos de estudio</span><span className="nav-count">04</span></button>
          <button className={`nav-item ${page==='questionBank'?'active':''}`} onClick={()=>{setBankIndex(0);setBankAnswer(null);go('questionBank')}}><BookOpen size={18}/><span>Banco de preguntas</span><span className="nav-count">{questionBank.length}</span></button>
          <button className={`nav-item ${page==='progress'?'active':''}`} onClick={()=>go('progress')}><Activity size={18}/><span>Mi progreso</span></button>
        </nav>
        <div className="sidebar-lab-card">
          <div className="lab-card-icon"><ShieldCheck size={18}/></div>
          <strong>Laboratorio de análisis</strong>
          <p>Observa. Contrasta. Argumenta.</p>
          <div className="lab-card-line"><span/></div>
          <small>EDICIÓN ACADÉMICA · 01</small>
        </div>
        <div className="sidebar-bottom">
          <div className={`connection-dot ${supabaseConfigured?'connected':''}`}/>
          <div><strong>{supabaseConfigured?'Supabase configurado':'Modo local'}</strong><small>{supabaseConfigured?'Sincronización disponible':'Pendiente de configuración'}</small></div>
          <button className="icon-button" title="Guía de conexión" onClick={()=>setShowGuide(true)}><CircleHelp size={17}/></button>
        </div>
      </aside>

      <main className="main-area">
        <header className="topbar">
          <div className="topbar-left">
            <button className="mobile-menu icon-button" onClick={()=>setShowMobileMenu(v=>!v)}><Menu size={20}/></button>
            <div className="breadcrumbs"><span>ACADEMIA</span><ChevronRight size={13}/><strong>{({home:'PANEL PRINCIPAL',scenarios:'CASOS DE ESTUDIO',questionBank:'BANCO DE PREGUNTAS',case:'SIMULACIÓN ACTIVA',scene:'ESCENA 3D',report:'INFORME DE CASO',progress:'MI PROGRESO'})[page] || 'MINDTRACE'}</strong></div>
          </div>
          <div className="topbar-right"><span className="status-pill"><span/> SIMULACIÓN EDUCATIVA</span><div className="avatar">MT</div></div>
        </header>

        {page==='home' && <section className="page-content">
          <div className="welcome-row">
            <div><div className="eyebrow"><Sparkles size={14}/> CENTRO DE ANÁLISIS CONDUCTUAL</div><h1>Piensa como investigador<span>.</span></h1><p className="lead">Cada detalle cuenta. Construye hipótesis, contrasta evidencias y aprende a leer un caso sin precipitar conclusiones.</p></div>
            <div className="welcome-stamp"><Fingerprint size={38}/><span>CASE FILE<br/><b>MT–2026</b></span></div>
          </div>
          <div className="hero-card">
            <div className="hero-text">
              <div className="hero-kicker"><span className="kicker-line"/> CASO DESTACADO <span className="hero-new">NUEVO</span></div>
              <h2>La hora que<br/>no encaja.</h2>
              <p>Una entrevista. Tres versiones. Un registro que cambia la investigación.</p>
              <div className="hero-meta"><span><Clock3 size={15}/> 12–18 MIN</span><span><Target size={15}/> NIVEL DIFÍCIL</span></div>
              <button className="button-primary" onClick={()=>startCase('testimonial')}>Abrir expediente <ArrowRight size={17}/></button>
            </div>
            <div className="hero-art">
              <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
              <div className="hero-fingerprint"><Fingerprint size={176} strokeWidth={0.8}/></div>
              <div className="hero-art-label"><span className="pulse-dot"/> INVESTIGACIÓN EN CURSO</div>
              <div className="hero-art-code">EVIDENCE / 001<br/>BEHAVIORAL UNIT</div>
            </div>
          </div>
          <div className="section-heading"><div><span className="eyebrow">TU ESPACIO DE TRABAJO</span><h2>Panel de rendimiento</h2></div><button className="text-button" onClick={()=>go('progress')}>Ver progreso <ArrowRight size={15}/></button></div>
          <div className="stats-grid">
            <div className="stat-card"><div className="stat-top"><span>CASOS COMPLETADOS</span><ClipboardList size={17}/></div><strong>{history.length.toString().padStart(2,'0')}</strong><small>Expedientes resueltos</small><div className="stat-foot"><span className="stat-mini-bar"><i style={{width:`${Math.min(history.length/8*100,100)}%`}}/></span><span>{Math.min(history.length,8)}/8 meta inicial</span></div></div>
            <div className="stat-card"><div className="stat-top"><span>PUNTUACIÓN MEDIA</span><Award size={17}/></div><strong>{avgScore}<em>/100</em></strong><small>Razonamiento y evidencia</small><div className="stat-foot"><span className="stat-tag">{avgScore>=80?'Buen criterio':history.length?'Sigue investigando':'Aún sin evaluar'}</span></div></div>
            <div className="stat-card"><div className="stat-top"><span>PISTAS EXPLORADAS</span><Search size={17}/></div><strong>{history.reduce((s,h)=>s+(h.discoveries||0),0).toString().padStart(2,'0')}</strong><small>Observaciones registradas</small><div className="stat-foot"><span className="stat-tag neutral">Inspección activa</span></div></div>
          </div>
          <div className="section-heading"><div><span className="eyebrow">RUTA DE APRENDIZAJE</span><h2>Explora los escenarios</h2></div><button className="text-button" onClick={()=>go('scenarios')}>Todos los casos <ArrowRight size={15}/></button></div>
          <div className="scenario-grid">
            {scenarios.map(s => <ScenarioCard key={s.id} scenario={s} onClick={()=>startCase(s.id)}/>)}
          </div>
          <div className="bottom-note"><ShieldCheck size={18}/><p><strong>Principio de investigación:</strong> una conducta aislada no define a una persona. Las hipótesis deben ser verificables, considerar alternativas y respetar la presunción de inocencia.</p></div>
        </section>}

        {page==='scenarios' && <section className="page-content">
          <div className="page-heading"><div><span className="eyebrow">ARCHIVO DE INVESTIGACIÓN</span><h1>Casos de estudio<span>.</span></h1><p>Cuatro contextos. Diferentes fuentes de evidencia. Un mismo método: pensar con rigor.</p></div><div className="heading-counter"><strong>04</strong><span>EXPEDIENTES<br/>DISPONIBLES</span></div></div>
          <div className="scenario-grid full">{scenarios.map(s=><ScenarioCard key={s.id} scenario={s} onClick={()=>startCase(s.id)}/>)}</div>
          <div className="levels-panel"><div><span className="eyebrow">PROGRESIÓN ACADÉMICA</span><h2>De difícil a experto</h2><p>Elige el nivel antes de iniciar cada expediente.</p></div><div className="levels-list">{difficulties.map((d,i)=><div key={d.name} className="level-row"><span className="level-number">0{i+1}</span><div><strong>{d.name}</strong><small>{d.note}</small></div><span className="level-lock">{i===0?<Check size={15}/>:<LockKeyhole size={14}/>}</span></div>)}</div></div>
        </section>}

        {page==='questionBank' && <section className="page-content question-bank-page">
          <div className="page-heading"><div><span className="eyebrow"><BookOpen size={14}/> EVALUACIÓN ACADÉMICA</span><h1>Banco de preguntas<span>.</span></h1><p>Preguntas de aplicación y análisis sobre criminología, psicología y antropología forense, control social y marco jurídico venezolano.</p></div><div className="heading-counter"><strong>{questionBank.length}</strong><span>PREGUNTAS<br/>DISPONIBLES</span></div></div>
          <div className="bank-summary"><div><strong>{questionBank.length}</strong><span>preguntas iniciales</span></div><div><strong>10</strong><span>áreas de estudio</span></div><div><strong>{bankScore}</strong><span>respuestas correctas</span></div></div>
          <div className="bank-filter-row"><label htmlFor="bank-filter">FILTRAR POR TEMA</label><select id="bank-filter" value={bankFilter} onChange={e=>{setBankFilter(e.target.value);setBankIndex(0);setBankAnswer(null)}}>{bankCategories.map(c=><option key={c}>{c}</option>)}</select><span>{filteredBank.length} preguntas en esta selección</span></div>
          {bankQuestion && <div className="panel-card bank-question-card"><div className="bank-question-top"><span className="eyebrow">PREGUNTA {String(bankIndex+1).padStart(2,'0')} / {filteredBank.length}</span><span className="bank-topic">{bankQuestion.category}</span></div><div className="progress-track"><span style={{width:`${((bankIndex+1)/filteredBank.length)*100}%`}}/></div><h2>{bankQuestion.prompt}</h2><div className="bank-options">{bankQuestion.options.map((option,i)=><button key={option} disabled={bankAnswer!==null} className={`bank-option ${bankAnswer!==null&&i===bankQuestion.correct?'correct':''} ${bankAnswer===i&&i!==bankQuestion.correct?'incorrect':''}`} onClick={()=>{setBankAnswer(i);if(i===bankQuestion.correct)setBankScore(v=>v+1)}}><span>{String.fromCharCode(65+i)}</span>{option}{bankAnswer!==null&&i===bankQuestion.correct&&<Check size={17}/>}</button>)}</div>
          {bankAnswer!==null&&<div className={`bank-feedback ${bankAnswer===bankQuestion.correct?'good':'poor'}`}><strong>{bankAnswer===bankQuestion.correct?'Respuesta correcta':'Respuesta no correcta'}</strong><p>{bankQuestion.explanation}</p><small>{bankQuestion.reference}. Material educativo; verifica la normativa venezolana vigente antes de usar referencias jurídicas en un caso real.</small></div>}
          <div className="bank-actions"><button className="button-secondary" onClick={()=>{setBankIndex(0);setBankAnswer(null);setBankScore(0)}}><RotateCcw size={15}/> Reiniciar práctica</button><button className="button-primary" onClick={()=>{if(bankIndex+1<filteredBank.length){setBankIndex(v=>v+1);setBankAnswer(null)}else notify(`Práctica terminada: ${bankScore} respuestas correctas de ${filteredBank.length}.`)}} disabled={bankAnswer===null}>{bankIndex+1<filteredBank.length?'Siguiente pregunta':'Finalizar práctica'} <ArrowRight size={15}/></button></div></div>}
          <div className="bottom-note"><ShieldCheck size={18}/><p><strong>Nota jurídica y clínica:</strong> las preguntas son material académico, no asesoría legal ni herramienta diagnóstica. El COPP regula el procedimiento penal; los delitos y las penas deben contrastarse con el Código Penal y las leyes especiales vigentes.</p></div>
        </section>}

        {page==='case' && <section className="page-content case-page">
          <button className="back-link" onClick={()=>go('scenarios')}><ArrowLeft size={16}/> Volver a los casos</button>
          <div className="case-header"><div><span className="eyebrow">EXPEDIENTE {scenario.number} / {scenario.category.toUpperCase()}</span><h1>{scenario.title}<span>.</span></h1><p>{scenario.subtitle}</p></div><div className="case-header-mark"><Fingerprint size={34}/><span>CONFIDENCIAL<br/>SIMULACIÓN</span></div></div>
          <div className="case-toolbar"><div className="toolbar-location"><span className="location-dot"/> {scenario.location}</div><div className="difficulty-select"><label htmlFor="difficulty">NIVEL DE DIFICULTAD</label><select id="difficulty" value={difficulty} onChange={e=>setDifficulty(e.target.value)}>{difficulties.map(d=><option key={d.name}>{d.name}</option>)}</select></div></div>
          <div className="case-layout">
            <div className="case-main-column">
              <div className="panel-card brief-card"><div className="panel-title"><div className="panel-icon"><BookOpen size={18}/></div><div><span className="eyebrow">RESUMEN DEL CASO</span><h3>Antecedentes conocidos</h3></div></div><p>{scenario.brief}</p><div className="objective-box"><Target size={18}/><div><strong>Objetivo de aprendizaje</strong><p>{scenario.objective}</p></div></div></div>
              <div className="panel-card interview-card"><div className="interview-top"><div className="panel-title"><div className="panel-icon gold"><MessageSquareText size={18}/></div><div><span className="eyebrow">ENTREVISTA {String(questionIndex+1).padStart(2,'0')} / {scenario.questions.length}</span><h3>Decisión del investigador</h3></div></div><span className="progress-label">{Math.round(((questionIndex+1)/scenario.questions.length)*100)}%</span></div><div className="progress-track"><span style={{width:`${((questionIndex+1)/scenario.questions.length)*100}%`}}/></div>
                <div className="interviewee"><div className="interviewee-avatar">{scenario.interviewee.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div><div><strong>{scenario.interviewee.name}</strong><small>{scenario.interviewee.role} · ENTREVISTADO/A</small></div><span className="recording"><i/> EN SESIÓN</span></div>
                <blockquote>“{scenario.interviewee.quote}”</blockquote>
                <div className="question-prompt"><span className="prompt-index">PREGUNTA DE ANÁLISIS</span><h4>{question.prompt}</h4></div>
                <div className="answer-list">{question.options.map((o,i)=><button key={o.text} disabled={!!feedback} className={`answer-option ${feedback===o?'chosen':''}`} onClick={()=>chooseOption(o)}><span className="answer-letter">{String.fromCharCode(65+i)}</span><span>{o.text}</span><ChevronRight size={17}/></button>)}</div>
                {feedback && <div className={`feedback-box ${feedback.score>=8?'good':feedback.score<=2?'poor':'mid'}`}><div className="feedback-icon">{feedback.score>=8?<Check size={18}/>:<InfoIcon/>}</div><div><strong>{feedback.score>=8?'Buen criterio':feedback.score<=2?'Revisa tu enfoque':'Una alternativa a considerar'} · +{feedback.score}/10</strong><p>{feedback.feedback}</p><small>PRINCIPIO: {feedback.principle.toUpperCase()}</small></div><button className="button-primary compact" onClick={nextQuestion}>{questionIndex+1<scenario.questions.length?'Siguiente decisión':'Ver informe'} <ArrowRight size={15}/></button></div>}
              </div>
              <div className="case-bottom-actions"><button className="button-secondary" onClick={()=>go('scene')}><FlaskConical size={16}/> Explorar escena 3D <span className="mini-badge">INTERACTIVA</span></button><button className="text-button" onClick={()=>setShowGuide(true)}>Guía del investigador <CircleHelp size={15}/></button></div>
            </div>
            <aside className="case-side-column">
              <div className="panel-card evidence-card"><div className="panel-title"><div className="panel-icon"><Search size={17}/></div><div><span className="eyebrow">MATERIAL DISPONIBLE</span><h3>Tablero de evidencias</h3></div></div><p className="muted small">Abre cada elemento y revisa sus límites.</p><div className="evidence-list">{scenario.evidence.map((e,i)=><button key={e.id} className={`evidence-item ${activeEvidence?.id===e.id?'active':''}`} onClick={()=>setActiveEvidence(e)}><span className={`evidence-type type-${i}`}>{String(i+1).padStart(2,'0')}</span><span><strong>{e.title}</strong><small>{e.kind}</small></span><ChevronRight size={15}/></button>)}</div>{activeEvidence&&<div className="evidence-detail"><span className="eyebrow">LECTURA CRÍTICA</span><h4>{activeEvidence.title}</h4><p>{activeEvidence.detail}</p><div><InfoIcon/><span>{activeEvidence.clue}</span></div></div>}</div>
              <div className="panel-card case-tags-card"><span className="eyebrow">COMPETENCIAS</span><div className="tag-list">{scenario.tags.map(t=><span key={t}>{t}</span>)}</div><div className="case-mini-stat"><span>TIEMPO ESTIMADO</span><strong>{scenario.duration}</strong></div><div className="case-mini-stat"><span>PISTAS 3D EXPLORADAS</span><strong>{discovered.length} / {scenario.scene.hotspots.length}</strong></div></div>
            </aside>
          </div>
        </section>}

        {page==='scene' && <section className="page-content scene-page">
          <button className="back-link" onClick={()=>go('case')}><ArrowLeft size={16}/> Volver al expediente</button>
          <div className="page-heading scene-heading"><div><span className="eyebrow">INSPECCIÓN DIGITAL / EXPEDIENTE {scenario.number}</span><h1>Escena explorable<span>.</span></h1><p>Observa el entorno, abre los marcadores y registra qué evidencia merece corroboración.</p></div><div className="scene-score"><span>INSPECCIÓN</span><strong>{discovered.length}<small>/{scenario.scene.hotspots.length}</small></strong></div></div>
          <div className="scene-case-strip"><div className="scene-case-icon"><FlaskConical size={20}/></div><div><span className="eyebrow">{scenario.category}</span><strong>{scenario.title}</strong></div><span className="scene-strip-level">{difficulty.toUpperCase()}</span></div>
          <Scene3D scene={scenario.scene} discovered={discovered} onDiscover={discover}/>
          <div className="scene-footer-note"><ShieldCheck size={17}/><p>Las pistas de la escena son indicios para orientar la investigación, no pruebas concluyentes. Documenta qué observaste y qué necesitarías verificar.</p><button className="button-primary compact" onClick={()=>go('case')}>Volver al caso <ArrowRight size={15}/></button></div>
        </section>}

        {page==='report' && <section className="page-content report-page">
          <div className="report-success"><div className="success-mark"><Award size={30}/></div><span className="eyebrow">FASE DE ENTREVISTA COMPLETADA</span><h1>Informe de análisis<span>.</span></h1><p>Tu resultado refleja la calidad de tus decisiones y la exploración del entorno, no la identificación de una persona culpable.</p></div>
          <div className="report-score-card"><div className="score-ring" style={{'--score':`${Math.min(100,Math.round(sessionScore/maxScore*90+Math.min(10,discovered.length*2.5)))}%`}}><div><strong>{Math.min(100,Math.round(sessionScore/maxScore*90+Math.min(10,discovered.length*2.5)))}</strong><span>DE 100</span></div></div><div className="score-summary"><span className="eyebrow">PUNTUACIÓN FINAL</span><h2>{sessionScore/maxScore>=0.8?'Razonamiento consistente':sessionScore/maxScore>=0.55?'Enfoque en desarrollo':'Requiere más contraste'}</h2><p>Has obtenido {sessionScore} de {maxScore} puntos en decisiones y explorado {discovered.length} de {scenario.scene.hotspots.length} puntos de la escena.</p><div className="score-tags"><span><Check size={14}/> Decisiones registradas</span><span><Search size={14}/> Evidencias revisadas</span></div></div></div>
          <div className="report-grid"><div className="panel-card"><div className="panel-title"><div className="panel-icon"><ClipboardList size={18}/></div><div><span className="eyebrow">RESUMEN DE DECISIONES</span><h3>Retroalimentación</h3></div></div><div className="decision-review">{decisions.map((d,i)=><div className="decision-review-row" key={i}><span className={`decision-score ${d.score>=8?'high':d.score<=2?'low':'medium'}`}>{d.score}/10</span><div><strong>{d.principle}</strong><p>{d.feedback}</p></div></div>)}</div></div>
            <div className="panel-card hypothesis-card"><div className="panel-title"><div className="panel-icon gold"><Network size={18}/></div><div><span className="eyebrow">SÍNTESIS CRIMINOLÓGICA</span><h3>Tu hipótesis provisional</h3></div></div><p>Redacta una explicación provisional, qué evidencia la apoya y qué información falta. Evita afirmar culpabilidad si los datos no la establecen.</p><textarea value={hypothesis} onChange={e=>setHypothesis(e.target.value)} placeholder="La evidencia disponible sugiere que… Sin embargo, aún es necesario verificar…" rows={6}/><div className="hypothesis-guidance"><strong>Antes de cerrar el caso, comprueba:</strong><ul><li>¿Separaste hechos de inferencias?</li><li>¿Consideraste al menos una explicación alternativa?</li><li>¿Identificaste qué evidencia falta?</li></ul></div></div></div>
          <div className={`save-status ${saveState}`}><div>{saveState==='saving'?<Activity size={18}/>:saveState==='saved'?<Check size={18}/>:<ShieldCheck size={18}/>}</div><p><strong>{saveState==='saving'?'Guardando progreso…':saveState==='saved'?'Progreso sincronizado':saveState==='error'?'Guardado local con incidencia':'Progreso listo para guardar'}</strong><span>{saveMessage||'Al finalizar, el resultado se guarda en este dispositivo y se sincroniza con Supabase si está configurado.'}</span></p></div>
          <div className="report-actions"><button className="button-secondary" onClick={()=>go('case')}><ArrowLeft size={16}/> Revisar expediente</button><button className="button-primary" onClick={finishReport} disabled={saveState==='saving'||saveState==='saved'}>{saveState==='saved'?'Guardado':saveState==='saving'?'Guardando…':'Guardar informe'} <Check size={16}/></button><button className="text-button" onClick={()=>{resetSession(scenarioId);go('case')}}><RotateCcw size={15}/> Repetir caso</button></div>
        </section>}

        {page==='progress' && <section className="page-content">
          <div className="page-heading"><div><span className="eyebrow">REGISTRO DE APRENDIZAJE</span><h1>Mi progreso<span>.</span></h1><p>Consulta tus partidas, puntuaciones y habilidades desarrolladas.</p></div><div className="heading-counter"><Award size={28}/><span>PERFIL<br/>INVESTIGADOR</span></div></div>
          <div className="stats-grid"><div className="stat-card"><div className="stat-top"><span>PARTIDAS GUARDADAS</span><ClipboardList size={17}/></div><strong>{history.length.toString().padStart(2,'0')}</strong><small>Este dispositivo</small></div><div className="stat-card"><div className="stat-top"><span>PUNTUACIÓN MEDIA</span><Award size={17}/></div><strong>{avgScore}<em>/100</em></strong><small>Promedio de tus casos</small></div><div className="stat-card"><div className="stat-top"><span>REGISTROS REMOTOS</span><Activity size={17}/></div><strong>{remoteHistory.length.toString().padStart(2,'0')}</strong><small>{supabaseConfigured?'Sincronizados con Supabase':'Conecta Supabase para sincronizar'}</small></div></div>
          <div className="panel-card history-card"><div className="panel-title"><div className="panel-icon"><Clock3 size={18}/></div><div><span className="eyebrow">HISTORIAL</span><h3>Últimas investigaciones</h3></div></div>{history.length===0?<div className="empty-state"><div><ClipboardList size={26}/></div><strong>Aún no hay casos completados</strong><p>Inicia un expediente y guarda tu primer informe.</p><button className="button-primary compact" onClick={()=>go('scenarios')}>Explorar casos <ArrowRight size={15}/></button></div>:<div className="history-list">{history.map(item=><div className="history-row" key={item.id}><div className="history-icon"><Fingerprint size={18}/></div><div className="history-name"><strong>{item.scenarioTitle||scenarios.find(s=>s.id===item.scenarioId)?.title||item.scenarioId}</strong><small>{item.difficulty} · {new Date(item.completedAt).toLocaleDateString('es-ES')}</small></div><div className="history-score"><strong>{item.score}</strong><small>/100</small></div><button className="icon-button" onClick={()=>startCase(item.scenarioId)} title="Repetir caso"><RotateCcw size={16}/></button></div>)}</div>}</div>
          {supabaseConfigured && <div className="panel-card remote-card"><div className="panel-title"><div className="panel-icon"><ShieldCheck size={18}/></div><div><span className="eyebrow">SUPABASE</span><h3>Progreso sincronizado</h3></div><button className="text-button" onClick={()=>loadProgress().then(setRemoteHistory).catch(e=>notify(e.message))}>Actualizar <RotateCcw size={14}/></button></div>{remoteHistory.length?<div className="history-list">{remoteHistory.map(item=><div className="history-row" key={item.id}><div className="history-icon"><Activity size={18}/></div><div className="history-name"><strong>{scenarios.find(s=>s.id===item.scenario_id)?.title||item.scenario_id}</strong><small>{item.difficulty} · {new Date(item.created_at).toLocaleDateString('es-ES')}</small></div><div className="history-score"><strong>{item.score}</strong><small>/100</small></div></div>)}</div>:<p className="muted">Cuando guardes un informe autenticado, aparecerá aquí.</p>}</div>}
        </section>}

        <footer className="app-footer"><div className="footer-brand"><Fingerprint size={18}/><strong>MINDTRACE</strong></div><span>ENTORNO DE APRENDIZAJE · CASOS FICTICIOS</span><button onClick={()=>setShowGuide(true)}>Acerca del laboratorio <ArrowRight size={13}/></button></footer>
      </main>
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
      {showGuide && <div className="modal-backdrop" onClick={()=>setShowGuide(false)}><div className="guide-modal" onClick={e=>e.stopPropagation()}><button className="modal-close icon-button" onClick={()=>setShowGuide(false)}><X size={18}/></button><div className="guide-icon"><Fingerprint size={26}/></div><span className="eyebrow">MINDTRACE / GUÍA RÁPIDA</span><h2>Investigar es contrastar.</h2><p>Este laboratorio es una simulación académica. No representa un instrumento diagnóstico ni sustituye protocolos institucionales o asesoramiento profesional.</p><div className="guide-points"><div><Check size={16}/><span>Comienza con preguntas abiertas y evita preguntas sugestivas.</span></div><div><Check size={16}/><span>Contrasta testimonios con fuentes independientes.</span></div><div><Check size={16}/><span>Registra la incertidumbre y las hipótesis alternativas.</span></div><div><Check size={16}/><span>No interpretes nerviosismo, apariencia o antecedentes como prueba de culpabilidad.</span></div></div><div className="guide-connection"><div className={`connection-dot ${supabaseConfigured?'connected':''}`}/><div><strong>{supabaseConfigured?'Supabase detectado':'Supabase pendiente de configuración'}</strong><p>{supabaseConfigured?'La aplicación intentará sincronizar informes al guardarlos.':'Consulta README.md y supabase/schema.sql en el ZIP para conectar la base de datos.'}</p></div></div><button className="button-primary full-width" onClick={()=>setShowGuide(false)}>Entendido <Check size={16}/></button></div></div>}
    </div>
  );
}

function ScenarioCard({scenario,onClick}) {
  const Icon = iconMap[scenario.icon] || ClipboardList;
  return <button className={`scenario-card ${scenario.color}`} onClick={onClick}>
    <div className="scenario-card-top"><span className="scenario-number">MT / {scenario.number}</span><span className="scenario-icon"><Icon size={19}/></span></div>
    <div className="scenario-art" style={{backgroundImage:`linear-gradient(180deg, rgba(7,15,25,.06), rgba(7,15,25,.70)), url(${scenario.image})`}}><div className="art-grid"/><div className="art-orbit"/><div className="art-icon"><Icon size={58} strokeWidth={0.85}/></div><span className="art-stamp">CASE FILE<br/><b>{scenario.number}—A</b></span></div>
    <div className="scenario-card-body"><span className="eyebrow">{scenario.category.toUpperCase()}</span><h3>{scenario.title}</h3><p>{scenario.subtitle}</p><div className="scenario-tags">{scenario.tags.slice(0,3).map(t=><span key={t}>{t}</span>)}</div><div className="scenario-card-bottom"><span><Clock3 size={14}/>{scenario.duration}</span><span className="open-case">Abrir caso <ArrowRight size={15}/></span></div></div>
  </button>;
}
function InfoIcon() { return <CircleHelp size={17}/>; }
