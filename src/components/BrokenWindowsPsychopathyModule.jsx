import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Brain, ClipboardList, ShieldCheck, RotateCcw, FileText } from 'lucide-react';

const sections = [
 {id:'environment',title:'Entorno · Ventanas rotas',questions:[
 '¿Qué señales observables de deterioro, abandono o falta de mantenimiento aparecen en el sector?',
 '¿Qué normas parecen estar ausentes o aplicarse de forma inconsistente? Distingue hechos de suposiciones.',
 '¿Qué pequeñas infracciones parecen normalizadas y qué datos demostrarían que son recurrentes?',
 '¿Qué explicaciones alternativas podrían producir el deterioro (falta de recursos, daños accidentales o fallas de servicios)?',
 '¿Qué intervención comunitaria o institucional mejoraría el entorno sin criminalizar a sus residentes?'
 ]},
 {id:'interview',title:'Entrevista · Rasgos conductuales',questions:[
 'La persona entrevistada afirma: «Si alguien sale perjudicado, no es asunto mío». ¿Qué preguntas neutrales harías para aclarar el contexto?',
 '¿Cómo explorarías la capacidad de reconocer el impacto de sus actos sin asumir que una respuesta fría demuestra falta de empatía?',
 '¿Qué ejemplos pedirías para examinar responsabilidad, cumplimiento de compromisos y atribución de culpa?',
 '¿Cómo preguntarías por impulsividad y toma de riesgos, considerando frecuencia, contexto y consecuencias?',
 '¿Qué preguntas abiertas permitirían explorar engaño o relaciones instrumentales sin sugerir una respuesta?',
 '¿Qué información colateral y fuentes independientes necesitarías antes de formular una hipótesis sobre patrones persistentes?'
 ]},
 {id:'integration',title:'Integración criminológica',questions:[
 '¿Qué relación plausible podría existir entre las condiciones del entorno y las oportunidades para que se repitan conductas antisociales? ¿Por qué no prueba causalidad?',
 '¿Qué datos apoyarían tu hipótesis, cuáles la debilitarían y qué evidencia falta para contrastarla?'
 ]}
];
export default function BrokenWindowsPsychopathyModule({onBack}) {
 const [section,setSection]=useState(0),[index,setIndex]=useState(0),[answers,setAnswers]=useState({}),[facts,setFacts]=useState(''),[hypothesis,setHypothesis]=useState(''),[missing,setMissing]=useState(''),[report,setReport]=useState(false);
 const s=sections[section],key=s.id+'-'+index,total=sections.reduce((n,x)=>n+x.questions.length,0),done=Object.values(answers).filter(x=>x.trim()).length;
 const all=sections.flatMap(x=>x.questions.map((q,i)=>({section:x.title,key:x.id+'-'+i,q})));
 const back=()=>{if(index){setIndex(index-1)}else if(section){setSection(section-1);setIndex(sections[section-1].questions.length-1)}else onBack?.()};
 const next=()=>{if(index<s.questions.length-1)setIndex(index+1);else if(section<sections.length-1){setSection(section+1);setIndex(0)}else setReport(true)};
 if(report)return <section className="page-content bw-module">
 <button className="back-link" onClick={()=>setReport(false)}><ArrowLeft size={16}/> Volver a preguntas</button>
 <div className="page-heading"><div><span className="eyebrow">MINDTRACE / INFORME EDUCATIVO</span><h1>Informe integrado<span>.</span></h1><p>Síntesis argumentada del entorno y de la entrevista simulada.</p></div><div className="heading-counter"><strong>{done}/{total}</strong><span>RESPUESTAS<br/>REGISTRADAS</span></div></div>
 <div className="bw-report-grid">{[['Hechos observables',facts,setFacts],['Interpretación provisional',hypothesis,setHypothesis],['Información pendiente',missing,setMissing]].map(([label,value,set])=><article className="panel-card bw-note-card" key={label}><span className="eyebrow">{label}</span><textarea rows={6} value={value} onChange={e=>set(e.target.value)} placeholder="Escribe tu análisis…"/></article>)}</div>
 <div className="panel-card bw-answer-review"><h3>Registro de respuestas</h3>{all.map((x,i)=><div className="bw-review-row" key={x.key}><span>{String(i+1).padStart(2,'0')}</span><div><small>{x.section}</small><strong>{x.q}</strong><p>{answers[x.key]||'Sin respuesta registrada.'}</p></div></div>)}</div>
 <div className="bw-ethics"><ShieldCheck/><p><strong>Alcance:</strong> este ejercicio no diagnostica psicopatía, no calcula peligrosidad ni determina culpabilidad. Se requiere evaluación profesional integral, métodos validados y corroboración independiente.</p></div>
 <div className="bw-actions"><button className="button-secondary" onClick={()=>{setSection(0);setIndex(0);setAnswers({});setFacts('');setHypothesis('');setMissing('');setReport(false)}}><RotateCcw size={15}/> Reiniciar</button><button className="button-primary" onClick={()=>window.print()}><FileText size={15}/> Imprimir informe</button></div>
 </section>;
 return <section className="page-content bw-module">
 <button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Volver al panel principal</button>
 <div className="page-heading"><div><span className="eyebrow">MINDTRACE / MÓDULO INTEGRADO</span><h1>Ventanas rotas <span>&</span> psicopatía<span>.</span></h1><p>Un expediente para analizar el entorno, realizar una entrevista simulada y construir hipótesis con pensamiento crítico.</p></div><div className="heading-counter"><strong>{done}/{total}</strong><span>RESPUESTAS<br/>COMPLETADAS</span></div></div>
 <div className="bw-theory-grid"><article className="bw-theory-card"><Building2/><span className="eyebrow">TEORÍA SOCIOCRIMINOLÓGICA</span><h2>Ventanas rotas</h2><p>Examina desorden visible, mantenimiento, control informal y respuesta institucional. La teoría propone una relación posible; no demuestra que el entorno cause delitos.</p></article><article className="bw-theory-card"><Brain/><span className="eyebrow">PSICOLOGÍA FORENSE</span><h2>Rasgos psicopáticos</h2><p>Explora empatía, responsabilidad, impulsividad, engaño y relaciones interpersonales. Ninguna respuesta aislada permite diagnosticar psicopatía ni predecir violencia.</p></article></div>
 <div className="bw-case-brief"><span className="eyebrow">EXPEDIENTE FICTICIO MT–BW–01</span><h2>El sector Las Acacias</h2><p>En un sector urbano se reportan luminarias dañadas, basura acumulada, grafitis, conflictos vecinales y hurtos denunciados. Una persona entrevistada ofrece respuestas ambiguas sobre responsabilidad y daño a terceros. No se ha establecido que los hechos estén relacionados ni que esa persona sea responsable.</p><div><span>ENTORNO: OBSERVACIÓN</span><span>ENTREVISTA: SIMULADA</span><span>OBJETIVO: CONTRASTAR</span></div></div>
 <div className="bw-progress"><div><span style={{width:(done/total*100)+'%'}}/></div><small>{Math.round(done/total*100)}% respondido</small></div>
 <div className="bw-workspace"><aside className="bw-stage-list">{sections.map((x,i)=><button key={x.id} className={i===section?'active':''} onClick={()=>{setSection(i);setIndex(0)}}><strong>0{i+1} · {x.title}</strong><small>{x.questions.length} preguntas</small></button>)}</aside><article className="panel-card bw-question-card"><div className="bw-question-meta"><span className="eyebrow">{s.title}</span><span>PREGUNTA {index+1} / {s.questions.length}</span></div><div className="bw-question-count">0{section+1}<i>/</i>{String(index+1).padStart(2,'0')}</div><h2>{s.questions[index]}</h2><p>Responde con argumentos y evidencia. Si falta información, explica qué dato necesitas en lugar de completar los vacíos con suposiciones.</p><textarea rows={7} value={answers[key]||''} onChange={e=>setAnswers(p=>({...p,[key]:e.target.value}))} placeholder="Registra tu razonamiento, los indicios que lo sustentan y las dudas que permanecen…"/><div className="bw-question-footer"><button className="button-secondary" onClick={back}><ArrowLeft size={15}/> Anterior</button><button className="button-primary" onClick={next}>{section===2&&index===s.questions.length-1?'Construir informe':'Siguiente pregunta'} <ArrowRight size={15}/></button></div></article></div>
 <div className="bw-ethics"><ShieldCheck/><p><strong>Nota metodológica:</strong> la teoría de las ventanas rotas es debatida y no una ley causal universal. Los rasgos psicopáticos no equivalen automáticamente a conducta delictiva. Caso ficticio, exclusivamente educativo.</p></div>
 </section>;
}