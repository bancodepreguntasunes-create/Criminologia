import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Activity, ArrowLeft, ArrowRight, Award, BookOpen, BriefcaseBusiness, Check,
  ChevronRight, CircleHelp, ClipboardList, Clock3, Compass, FlaskConical,
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
const bankPortraits = [
  'photo-1500648767791-00dcc994a43e','photo-1506794778202-cad84cf45f1d','photo-1507003211169-0a1dd7228f2d',
  'photo-1535713875002-d1d0cf377fde','photo-1504593811423-6dd665756598','photo-1501196354995-cbb51c65aaea',
  'photo-1506277886164-e25aa3f4ef7f','photo-1504257432389-52343af06ae3','photo-1506794778202-cad84cf45f1d',
  'photo-1517841905240-472988babdf9','photo-1534528741775-53994a69daeb','photo-1524504388940-b1c1722653e1',
  'photo-1508214751196-bcfd4ca60f91','photo-1507003211169-0a1dd7228f2d','photo-1500648767791-00dcc994a43e',
  'photo-1506794778202-cad84cf45f1d','photo-1535713875002-d1d0cf377fde','photo-1504593811423-6dd665756598',
  'photo-1501196354995-cbb51c65aaea','photo-1506277886164-e25aa3f4ef7f','photo-1517841905240-472988babdf9',
  'photo-1534528741775-53994a69daeb','photo-1524504388940-b1c1722653e1','photo-1508214751196-bcfd4ca60f91',
  'photo-1500648767791-00dcc994a43e','photo-1507003211169-0a1dd7228f2d','photo-1535713875002-d1d0cf377fde',
  'photo-1504593811423-6dd665756598','photo-1501196354995-cbb51c65aaea','photo-1506277886164-e25aa3f4ef7f'
];
const bankPortraitUrl = (index) => `https://images.unsplash.com/${bankPortraits[index % bankPortraits.length]}?auto=format&fit=crop&w=1100&q=85`;


function getSaved() {
  try { return JSON.parse(localStorage.getItem('mindtrace-progress') || '[]'); } catch { return []; }
}
function saveLocal(record) {
  const old = getSaved();
  localStorage.setItem('mindtrace-progress', JSON.stringify([record, ...old].slice(0, 30)));
}
function getLevel(rank) { return difficulties.find(d => d.rank === rank) || difficulties[0]; }

function BrainCircuitIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 4a3 3 0 0 0-5.7 1.2A3.5 3.5 0 0 0 4 11a3.5 3.5 0 0 0 2.3 6.1A3 3 0 0 0 12 19V4Zm0 0a3 3 0 0 1 5.7 1.2A3.5 3.5 0 0 1 20 11a3.5 3.5 0 0 1-2.3 6.1A3 3 0 0 1 12 19M7 8l2 2m-3 4 3-1m8-5-2 2m3 4-3-1M12 7v10" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function ScaleIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v17M6 6h12M4 6l-3 7h6L4 6Zm16 0-3 7h6l-3-7ZM8 21h8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>}
function ScanIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3c-4 0-7 3-7 7v4m3-8c-1 1-1 2-1 4v4m5-8c2 1 3 3 3 5v4m-6-9v7c0 3-1 5-3 6m6-11v7c0 2 1 3 2 4m-6-5c0 2-1 4-2 5m8-5c0 2 1 3 2 4M12 2c5 0 9 4 9 9v2" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
function DnaIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3c12 4 0 14 12 18M18 3C6 7 18 17 6 21M8 6h8M7 10h10M7 14h10M8 18h8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}
function PsychologyIcon(){return <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 3v18M7 5c0 5 3 6 5 6m5-6c0 5-3 6-5 6M5 8c0 5 3 7 7 7m7-7c0 5-3 7-7 7M8 21h8" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></svg>}

function MindtraceMark({ size = 28 }) {
  return (
    <svg className="mindtrace-mark" width={size} height={size} viewBox="0 0 200 200" role="img" aria-label="MINDTRACE: rostro dividido y cerebro azul y rojo">
      <defs>
        <linearGradient id="mtBlue" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#8cecff"/><stop offset="48%" stopColor="#35d9ff"/><stop offset="100%" stopColor="#126db4"/></linearGradient>
        <linearGradient id="mtRed" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#ffb0bc"/><stop offset="48%" stopColor="#ff4568"/><stop offset="100%" stopColor="#9d1237"/></linearGradient>
        <radialGradient id="mtFaceGlow" cx="35%" cy="25%" r="85%"><stop offset="0%" stopColor="#e9faff"/><stop offset="55%" stopColor="#7acfe9"/><stop offset="100%" stopColor="#164a70"/></radialGradient>
        <radialGradient id="mtFaceShadow" cx="70%" cy="30%" r="85%"><stop offset="0%" stopColor="#3c1425"/><stop offset="65%" stopColor="#160c19"/><stop offset="100%" stopColor="#080b16"/></radialGradient>
        <clipPath id="mtCircleClip"><circle cx="100" cy="100" r="91"/></clipPath>
      </defs>
      <circle cx="100" cy="100" r="94" fill="#050914" stroke="#17354b" strokeWidth="2"/>
      <circle cx="100" cy="100" r="87" fill="none" stroke="url(#mtBlue)" strokeOpacity=".75" strokeWidth="1.5" strokeDasharray="45 9 18 12"/>
      <circle cx="100" cy="100" r="81" fill="none" stroke="url(#mtRed)" strokeOpacity=".6" strokeWidth="1.5" strokeDasharray="28 11 48 9" transform="rotate(180 100 100)"/>
      <g clipPath="url(#mtCircleClip)">
        <path d="M100 26 C77 19 53 34 43 57 C29 83 34 122 49 147 C61 168 80 181 100 185Z" fill="url(#mtFaceGlow)"/>
        <path d="M100 26 C123 19 147 34 157 57 C171 83 166 122 151 147 C139 168 120 181 100 185Z" fill="url(#mtFaceShadow)"/>
        <path d="M100 29 C87 17 73 24 71 35 C56 31 48 42 52 54 C38 61 42 77 51 83 C42 94 49 108 60 111 C54 125 65 139 78 139 C78 153 89 163 100 162" fill="none" stroke="url(#mtBlue)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M100 29 C113 17 127 24 129 35 C144 31 152 42 148 54 C162 61 158 77 149 83 C158 94 151 108 140 111 C146 125 135 139 122 139 C122 153 111 163 100 162" fill="none" stroke="url(#mtRed)" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round"/>
        <path d="M72 36 C84 37 87 48 77 54 M53 59 C67 55 75 66 68 77 M51 86 C65 79 76 90 70 99 M63 115 C75 106 85 117 80 128 M87 27 C96 35 94 44 87 49 M87 68 C97 61 101 72 94 80 M86 100 C96 94 101 104 94 111" fill="none" stroke="#35d9ff" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M128 36 C116 37 113 48 123 54 M147 59 C133 55 125 66 132 77 M149 86 C135 79 124 90 130 99 M137 115 C125 106 115 117 120 128 M113 27 C104 35 106 44 113 49 M113 68 C103 61 99 72 106 80 M114 100 C104 94 99 104 106 111" fill="none" stroke="#ff4568" strokeWidth="4.5" strokeLinecap="round"/>
        <path d="M100 24 V176" stroke="#eaf7ff" strokeOpacity=".75" strokeWidth="2"/>
        <path d="M48 93 C57 81 78 81 91 92 L88 101 C75 94 60 95 51 103Z" fill="#071522" stroke="#35d9ff" strokeWidth="1.5"/>
        <path d="M152 93 C143 81 122 81 109 92 L112 101 C125 94 140 95 149 103Z" fill="#050812" stroke="#ff4568" strokeWidth="1.5"/>
        <path d="M56 93 Q69 86 83 94 Q70 105 56 93Z" fill="#e8faff" stroke="#0b3a59" strokeWidth="2"/>
        <circle cx="70" cy="94" r="5.5" fill="#126b9d"/><circle cx="70" cy="94" r="2.3" fill="#07111f"/>
        <path d="M144 93 Q131 86 117 94 Q130 105 144 93Z" fill="#ffb3c0" stroke="#511427" strokeWidth="2"/>
        <circle cx="130" cy="94" r="5.5" fill="#ff4568"/><circle cx="130" cy="94" r="2.3" fill="#080b16"/>
        <path d="M96 98 C92 111 89 119 96 122 L100 122" fill="none" stroke="#163b53" strokeWidth="3" strokeLinecap="round"/>
        <path d="M104 98 C108 111 111 119 104 122 L100 122" fill="none" stroke="#ff4568" strokeWidth="2" strokeLinecap="round" opacity=".8"/>
        <path d="M54 137 Q72 150 93 137" fill="none" stroke="#092e48" strokeWidth="5" strokeLinecap="round"/>
        <path d="M54 136 Q73 145 93 136" fill="none" stroke="#f0fcff" strokeWidth="2.5" strokeLinecap="round"/>
        <path d="M107 137 Q128 150 146 137" fill="none" stroke="#ff4568" strokeWidth="5" strokeLinecap="round"/>
        <path d="M107 136 Q127 140 146 136" fill="none" stroke="#ff9baa" strokeWidth="2" strokeLinecap="round"/>
      </g>
      <path d="M100 8 V19 M100 181 V192 M8 100 H19 M181 100 H192" stroke="#35d9ff" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  );
}

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
          <div className="brand-mark"><MindtraceMark size={32}/></div>
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
            <div className="welcome-stamp"><MindtraceMark size={42}/><span>CASE FILE<br/><b>MT–2026</b></span></div>
          </div>
          <div className="hero-card">
            <div className="hero-text">
              <div className="hero-kicker"><span className="kicker-line"/> CASO DESTACADO <span className="hero-new">NUEVO</span></div>
              <h2>La hora que<br/>no encaja.</h2>
              <p>Una entrevista. Tres versiones. Un registro que cambia la investigación.</p>
              <div className="hero-meta"><span><Clock3 size={15}/> 12–18 MIN</span><span><Target size={15}/> NIVEL DIFÍCIL</span></div>
              <button className="button-primary" onClick={()=>startCase('testimonial')}>Abrir expediente <ArrowRight size={17}/></button>
            </div>
            <div className="hero-art hero-brand-art">
              <div className="hero-art-code">MINDTRACE / FORENSIC LAB<br/>EVIDENCE UNIT · 001</div>
              <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
              <div className="hero-fingerprint hero-brand-emblem"><MindtraceMark size={210}/></div>
              <div className="hero-brand-wordmark"><span>MIND</span><b>TRACE</b></div>
              <div className="hero-brand-tagline">PIENSA <i/> ANALIZA <i/> DESCUBRE</div>
              <div className="hero-brand-rule"/>
              <div className="hero-disciplines">
                <span><BrainCircuitIcon/>CRIMINOLOGÍA</span><span><ScaleIcon/>DERECHO PENAL</span><span><ScanIcon/>CRIMINALÍSTICA</span><span><DnaIcon/>ANTROPOLOGÍA</span><span><PsychologyIcon/>PSICOLOGÍA FORENSE</span>
              </div>
              <div className="hero-art-label"><span className="pulse-dot"/> LABORATORIO DE ANÁLISIS ACTIVO</div>
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
          {bankQuestion && <div className="panel-card bank-question-card" key={`${bankFilter}-${bankIndex}`}><div className="bank-question-top"><span className="eyebrow">EXPEDIENTE VISUAL · PREGUNTA {String(bankIndex+1).padStart(2,'0')} / {filteredBank.length}</span><span className="bank-topic">{bankQuestion.category}</span></div><div className="progress-track"><span style={{width:`${((bankIndex+1)/filteredBank.length)*100}%`}}/></div><div className="bank-portrait-frame"><img className="bank-portrait" src={bankQuestion.image || '/images/case-interview.png'} alt={`Ilustración contextual de evidencia: ${bankQuestion.category}`} loading="lazy" onError={e=>{e.currentTarget.src='/images/case-interview.png'}}/><div className="bank-portrait-vignette"/><div className="bank-portrait-hud"><span className="bank-hud-dot"/><span>PERFIL FICTICIO · USO ACADÉMICO</span><b>MT-{String(questionBank.indexOf(bankQuestion)+1).padStart(3,'0')}</b></div><div className="bank-portrait-caption"><span>EVIDENCIA / CONCEPTO</span><strong>{bankQuestion.category}</strong><small>Material contextual de apoyo; interpreta junto con los datos del caso.</small></div></div><h2>{bankQuestion.prompt}</h2><div className="bank-options">{bankQuestion.options.map((option,i)=><button key={option} disabled={bankAnswer!==null} className={`bank-option ${bankAnswer!==null&&i===bankQuestion.correct?'correct':''} ${bankAnswer===i&&i!==bankQuestion.correct?'incorrect':''}`} onClick={()=>{setBankAnswer(i);if(i===bankQuestion.correct)setBankScore(v=>v+1)}}><span>{String.fromCharCode(65+i)}</span>{option}{bankAnswer!==null&&i===bankQuestion.correct&&<Check size={17}/>}</button>)}</div>
          {bankAnswer!==null&&<div className={`bank-feedback ${bankAnswer===bankQuestion.correct?'good':'poor'}`}><strong>{bankAnswer===bankQuestion.correct?'Respuesta correcta':'Respuesta no correcta'}</strong><p>{bankQuestion.explanation}</p><small>{bankQuestion.reference}. Material educativo; verifica la normativa venezolana vigente antes de usar referencias jurídicas en un caso real.</small></div>}
          <div className="bank-actions"><button className="button-secondary" onClick={()=>{setBankIndex(0);setBankAnswer(null);setBankScore(0)}}><RotateCcw size={15}/> Reiniciar práctica</button><button className="button-primary" onClick={()=>{if(bankIndex+1<filteredBank.length){setBankIndex(v=>v+1);setBankAnswer(null)}else notify(`Práctica terminada: ${bankScore} respuestas correctas de ${filteredBank.length}.`)}} disabled={bankAnswer===null}>{bankIndex+1<filteredBank.length?'Siguiente pregunta':'Finalizar práctica'} <ArrowRight size={15}/></button></div></div>}
          <div className="bottom-note"><ShieldCheck size={18}/><p><strong>Nota jurídica y clínica:</strong> las preguntas son material académico, no asesoría legal ni herramienta diagnóstica. El COPP regula el procedimiento penal; los delitos y las penas deben contrastarse con el Código Penal y las leyes especiales vigentes.</p></div>
        </section>}

        {page==='case' && <section className="page-content case-page game-case-page">
          <header className="case-header-terminal">
            <div className="terminal-case-mark"><span className="terminal-live-dot"/><div><small>EXPEDIENTE {scenario.number} / MINDTRACE</small><strong>{scenario.title}</strong></div></div>
            <div className="terminal-case-meta"><span><small>DIFICULTAD</small><strong>{difficulty.toUpperCase()}</strong></span><span><small>TIEMPO DE SIMULACIÓN</small><strong><Clock3 size={14}/> 12:00</strong></span><span><small>PISTAS DESCUBIERTAS</small><strong><Search size={14}/> {discovered.length.toString().padStart(2,'0')}</strong></span></div>
            <button className="terminal-exit-button" onClick={()=>go('scenarios')}><ArrowLeft size={15}/> SALIR DEL CASO</button>
          </header>
          <div className="game-split-layout">
            <aside className="game-left-panel">
              <div className="image-viewer">
                <div className="image-viewer-top"><span><i/> CCTV / REFERENCIA VISUAL</span><b>CAM-{scenario.number}-0{questionIndex+1}</b></div>
                <img src={question.image || scenario.image} alt={`Evidencia visual de la pregunta: ${question.prompt}`} onError={e=>{e.currentTarget.onerror=null;e.currentTarget.src=scenario.image || '/images/mindtrace-case-overview.png';}}/>
                <div className="image-scanlines"/>
                <div className="image-viewer-crosshair image-viewer-crosshair-a"/>
                <div className="image-viewer-crosshair image-viewer-crosshair-b"/>
                <div className="image-viewer-corners"><i/><i/><i/><i/></div>
                <div className="image-viewer-status"><span>ANÁLISIS DE IMAGEN</span><strong>SEÑAL ESTABLE · USO ACADÉMICO</strong></div>
                <div className="image-viewer-footer"><span>MT FORENSIC TERMINAL</span><span>EXP. {scenario.number} / Q{String(questionIndex+1).padStart(2,'0')}</span></div>
              </div>
              <div className="game-visual-caption"><span className="eyebrow">CONTEXTO DEL EXPEDIENTE</span><h2>{scenario.title}</h2><p>{scenario.subtitle}</p><div className="game-location"><Compass size={14}/>{scenario.location}</div></div>
              <div className="game-evidence-list"><div className="game-evidence-title"><span className="eyebrow">EVIDENCIAS DISPONIBLES</span><span>{scenario.evidence.length.toString().padStart(2,'0')} ITEMS</span></div>{scenario.evidence.map((e,i)=><button key={e.id} className={`game-evidence-row ${activeEvidence?.id===e.id?'active':''}`} onClick={()=>setActiveEvidence(e)}><span>{String(i+1).padStart(2,'0')}</span><div><strong>{e.title}</strong><small>{e.kind}</small></div><ChevronRight size={15}/></button>)}
                {activeEvidence&&<div className="game-evidence-detail"><strong>{activeEvidence.title}</strong><p>{activeEvidence.detail}</p><small><ShieldCheck size={13}/>{activeEvidence.clue}</small></div>}
              </div>
            </aside>
            <main className="game-right-panel">
              <div className="game-question-overline"><span><Activity size={14}/> INTERROGATORIO / ANÁLISIS ACTIVO</span><span>Q{String(questionIndex+1).padStart(2,'0')} — {scenario.questions.length.toString().padStart(2,'0')}</span></div>
              <div className="game-question-progress"><span style={{width:`${((questionIndex+1)/scenario.questions.length)*100}%`}}/></div>
              <article className="interview-card">
                <div className="interview-card-heading"><div><span className="eyebrow">OBJETIVO DE INVESTIGACIÓN</span><h1>{question.prompt}</h1></div><span className="interview-number">{String(questionIndex+1).padStart(2,'0')}</span></div>
                <p className="interview-instruction">Examina los datos del expediente. Elige la respuesta mejor respaldada por la evidencia, distingue observaciones de inferencias y evita conclusiones prematuras.</p>
                {scenario.interviewee&&<blockquote className="interviewee-quote"><span className="quote-mark">“</span><div><small>DECLARACIÓN REGISTRADA · {scenario.interviewee.role.toUpperCase()}</small><p>{scenario.interviewee.quote}</p><cite>— {scenario.interviewee.name}</cite></div></blockquote>}
                <div className="game-answer-heading"><span className="eyebrow">SELECCIONA UNA RESPUESTA</span><span>4 ALTERNATIVAS</span></div>
                <div className="answer-options">{question.options.map((o,i)=><button key={o.text} disabled={!!feedback} className={`answer-option ${feedback===o?'chosen':''}`} onClick={()=>chooseOption(o)}><span className="answer-option-letter">{String.fromCharCode(65+i)}</span><span className="answer-option-text">{o.text}</span><ChevronRight size={17}/></button>)}</div>
                {feedback&&<div className={`game-feedback-box ${feedback.score>=8?'correct':feedback.score<=2?'incorrect':'consider'}`}><div className="game-feedback-heading"><span>{feedback.score>=8?<Check size={17}/>:<CircleHelp size={17}/>}</span><div><strong>{feedback.score>=8?'ANÁLISIS CONSISTENTE':feedback.score<=2?'REQUIERE REVISIÓN':'ALTERNATIVA A CONSIDERAR'}</strong><small>VALORACIÓN: {feedback.score}/10 · {feedback.principle.toUpperCase()}</small></div></div><p>{feedback.feedback}</p><button className="button-primary compact" onClick={nextQuestion}>{questionIndex+1<scenario.questions.length?'SIGUIENTE PREGUNTA':'VER INFORME'} <ArrowRight size={15}/></button></div>}
                <div className="game-question-actions"><button className="button-secondary" onClick={()=>go('scenarios')}><ArrowLeft size={15}/> VOLVER A CASOS</button><button className="game-scene-button" onClick={()=>go('scene')}><FlaskConical size={15}/> ABRIR ESCENA 3D <ArrowRight size={15}/></button></div>
              </article>
              <div className="game-ethics-footer"><LockKeyhole size={14}/><span>SIMULACIÓN EDUCATIVA · La evidencia orienta hipótesis, pero no determina culpabilidad por sí sola.</span></div>
            </main>
          </div>
        </section>}

        {page==='scene' && <section className="page-content scene-page">
          <button className="back-link" onClick={()=>go('case')}><ArrowLeft size={16}/> Volver al expediente</button>
          <div className="page-heading scene-heading"><div><span className="eyebrow">INSPECCIÓN DIGITAL / EXPEDIENTE {scenario.number}</span><h1>Escena explorable<span>.</span></h1><p>Observa el entorno, abre los marcadores y registra qué evidencia merece corroboración.</p></div><div className="scene-score"><span>INSPECCIÓN</span><strong>{discovered.length}<small>/{scenario.scene.hotspots.length}</small></strong></div></div>
          <div className="scene-case-strip"><div className="scene-case-icon"><FlaskConical size={20}/></div><div><span className="eyebrow">{scenario.category}</span><strong>{scenario.title}</strong></div><span className="scene-strip-level">{difficulty.toUpperCase()}</span></div>
                    <div className="scene-reference-image"><img src={scenario.image} alt={`Referencia visual: ${scenario.title}`} /><div><span className="eyebrow">REFERENCIA FOTOGRÁFICA</span><strong>{scenario.title}</strong><p>Usa esta imagen como contexto visual; verifica los indicios en la escena interactiva y no des por probada una hipótesis solo por la fotografía.</p></div></div>
          <Scene3D scene={scenario.scene} image={scenario.image} caseTitle={scenario.title} discovered={discovered} onDiscover={discover}/>
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
          <div className="panel-card history-card"><div className="panel-title"><div className="panel-icon"><Clock3 size={18}/></div><div><span className="eyebrow">HISTORIAL</span><h3>Últimas investigaciones</h3></div></div>{history.length===0?<div className="empty-state"><div><ClipboardList size={26}/></div><strong>Aún no hay casos completados</strong><p>Inicia un expediente y guarda tu primer informe.</p><button className="button-primary compact" onClick={()=>go('scenarios')}>Explorar casos <ArrowRight size={15}/></button></div>:<div className="history-list">{history.map(item=><div className="history-row" key={item.id}><div className="history-icon"><MindtraceMark size={22}/></div><div className="history-name"><strong>{item.scenarioTitle||scenarios.find(s=>s.id===item.scenarioId)?.title||item.scenarioId}</strong><small>{item.difficulty} · {new Date(item.completedAt).toLocaleDateString('es-ES')}</small></div><div className="history-score"><strong>{item.score}</strong><small>/100</small></div><button className="icon-button" onClick={()=>startCase(item.scenarioId)} title="Repetir caso"><RotateCcw size={16}/></button></div>)}</div>}</div>
          {supabaseConfigured && <div className="panel-card remote-card"><div className="panel-title"><div className="panel-icon"><ShieldCheck size={18}/></div><div><span className="eyebrow">SUPABASE</span><h3>Progreso sincronizado</h3></div><button className="text-button" onClick={()=>loadProgress().then(setRemoteHistory).catch(e=>notify(e.message))}>Actualizar <RotateCcw size={14}/></button></div>{remoteHistory.length?<div className="history-list">{remoteHistory.map(item=><div className="history-row" key={item.id}><div className="history-icon"><Activity size={18}/></div><div className="history-name"><strong>{scenarios.find(s=>s.id===item.scenario_id)?.title||item.scenario_id}</strong><small>{item.difficulty} · {new Date(item.created_at).toLocaleDateString('es-ES')}</small></div><div className="history-score"><strong>{item.score}</strong><small>/100</small></div></div>)}</div>:<p className="muted">Cuando guardes un informe autenticado, aparecerá aquí.</p>}</div>}
        </section>}

        <footer className="app-footer"><div className="footer-brand"><MindtraceMark size={22}/><strong>MINDTRACE</strong></div><span>ENTORNO DE APRENDIZAJE · CASOS FICTICIOS</span><button onClick={()=>setShowGuide(true)}>Acerca del laboratorio <ArrowRight size={13}/></button></footer>
      </main>
      {toast && <div className="toast"><Check size={16}/>{toast}</div>}
      {showGuide && <div className="modal-backdrop" onClick={()=>setShowGuide(false)}><div className="guide-modal" onClick={e=>e.stopPropagation()}><button className="modal-close icon-button" onClick={()=>setShowGuide(false)}><X size={18}/></button><div className="guide-icon"><MindtraceMark size={32}/></div><span className="eyebrow">MINDTRACE / GUÍA RÁPIDA</span><h2>Investigar es contrastar.</h2><p>Este laboratorio es una simulación académica. No representa un instrumento diagnóstico ni sustituye protocolos institucionales o asesoramiento profesional.</p><div className="guide-points"><div><Check size={16}/><span>Comienza con preguntas abiertas y evita preguntas sugestivas.</span></div><div><Check size={16}/><span>Contrasta testimonios con fuentes independientes.</span></div><div><Check size={16}/><span>Registra la incertidumbre y las hipótesis alternativas.</span></div><div><Check size={16}/><span>No interpretes nerviosismo, apariencia o antecedentes como prueba de culpabilidad.</span></div></div><div className="guide-connection"><div className={`connection-dot ${supabaseConfigured?'connected':''}`}/><div><strong>{supabaseConfigured?'Supabase detectado':'Supabase pendiente de configuración'}</strong><p>{supabaseConfigured?'La aplicación intentará sincronizar informes al guardarlos.':'Consulta README.md y supabase/schema.sql en el ZIP para conectar la base de datos.'}</p></div></div><button className="button-primary full-width" onClick={()=>setShowGuide(false)}>Entendido <Check size={16}/></button></div></div>}
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
