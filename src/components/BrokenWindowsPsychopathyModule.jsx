import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, Building2, Brain, ShieldCheck, RotateCcw, FileText, Search, MessageCircle, Scale } from 'lucide-react';

const dialogue = [
 {topic:'Relación con el lugar',question:'¿Qué relación tiene con el edificio abandonado de Las Acacias?',options:[
  {label:'«Trabajo en el local de al lado; paso por allí para llegar a casa».',reply:'«Sí, paso casi todos los días. La puerta lateral suele quedar abierta».',clue:'Conoce el acceso lateral, pero eso por sí solo no demuestra participación.',evidence:0},
  {label:'«Nunca he estado allí».',reply:'«No conozco ese edificio».',clue:'La afirmación podrá contrastarse con los registros de acceso y las cámaras.',evidence:0},
  {label:'«Entré una vez para refugiarme de la lluvia».',reply:'«Fue hace semanas, no recuerdo la fecha».',clue:'Admite una visita previa; se necesita determinar cuándo ocurrió.',evidence:0}
 ]},
 {topic:'Cronología',question:'¿Dónde estuvo el martes entre las 20:00 y las 22:00?',options:[
  {label:'«En casa; mi hermana puede confirmarlo».',reply:'«Llegué antes de las ocho. Ella estaba allí».',clue:'Se identifica una fuente verificable para comprobar la coartada.',evidence:0},
  {label:'«Estuve trabajando hasta tarde».',reply:'«Mi turno terminó a las diez, pueden revisar el registro».',clue:'Existe un registro laboral potencialmente verificable.',evidence:0},
  {label:'«No recuerdo exactamente».',reply:'«Fue una noche normal. No miré la hora».',clue:'La memoria imprecisa no es prueba de culpabilidad.',evidence:0}
 ]},
 {topic:'Acceso y oportunidad',question:'¿Cómo explica que su tarjeta aparezca registrada en la entrada lateral a las 21:14?',options:[
  {label:'«La tarjeta la tenía otra persona; la presté».',reply:'«Se la dejé a un compañero, puedo dar su nombre».',clue:'Debe verificarse quién tenía la tarjeta y si el registro identifica a la persona o solo al dispositivo.',evidence:0},
  {label:'«Ese registro debe estar equivocado».',reply:'«A veces el lector falla; revisen el sistema».',clue:'Hay que auditar el lector y el registro original antes de atribuir el acceso.',evidence:0},
  {label:'«Entré, pero no toqué nada».',reply:'«Entré unos minutos porque necesitaba recoger una mochila».',clue:'Admite presencia en el lugar; todavía falta vincularla con el hecho investigado.',evidence:1}
 ]},
 {topic:'Objeto sustraído',question:'¿Reconoce este dispositivo recuperado en una compraventa, con número de serie coincidente con el objeto denunciado?',options:[
  {label:'«Lo compré usado; tengo el recibo y el contacto del vendedor».',reply:'«Lo compré el miércoles. Aquí está el comprobante».',clue:'La procedencia puede verificarse con recibo, vendedor y fecha.',evidence:0},
  {label:'«Me lo dieron para guardarlo».',reply:'«Un conocido me pidió que lo conservara. No pregunté más».',clue:'Se requiere identificar al conocido y comprobar la cadena de posesión.',evidence:0},
  {label:'«Lo encontré y pensaba devolverlo».',reply:'«Lo vi fuera del edificio y me lo llevé».',clue:'La explicación debe contrastarse con ubicación, hora y conducta posterior.',evidence:0}
 ]},
 {topic:'Contradicción verificable',question:'Un video muestra a una persona con su chaqueta entrando a las 21:18. ¿Puede explicar esa coincidencia?',options:[
  {label:'«La chaqueta es común; revisen rostro, altura y continuidad del video».',reply:'«No basta con una chaqueta. Comprueben la grabación completa».',clue:'La identificación visual necesita validación y contexto.',evidence:0},
  {label:'«Sí, soy yo; entré por la mochila y me fui».',reply:'«Soy yo en el video. No sabía que había ocurrido un robo».',clue:'Reconoce presencia; debe comprobarse qué ocurrió durante su estancia.',evidence:1},
  {label:'«No puedo identificar a la persona por ese fragmento».',reply:'«Necesito ver la secuencia completa».',clue:'Pedir contexto es razonable; no constituye una señal de engaño.',evidence:0}
 ]},
 {topic:'Conocimiento del hecho',question:'¿Qué sabe sobre la rotura de la ventana y la desaparición del dispositivo?',options:[
  {label:'«Vi la ventana rota al día siguiente y avisé al encargado».',reply:'«Le envié un mensaje al encargado esa mañana».',clue:'El mensaje y su hora pueden corroborar o refutar esta versión.',evidence:0},
  {label:'«Escuché un golpe, pero no entré».',reply:'«Fue cerca de las nueve. Seguí caminando».',clue:'Se puede contrastar con testigos y registros horarios.',evidence:0},
  {label:'«Yo rompí la ventana para entrar y tomé el dispositivo».',reply:'«Sí. Entré por la ventana y me lo llevé».',clue:'Es una admisión relevante, pero debe comprobarse voluntariedad, detalles y corroboración independiente.',evidence:2}
 ]}
];
const corroborations = [
 {id:'access',label:'Registro original de acceso',desc:'El sistema auditado confirma que la tarjeta fue utilizada a las 21:14 y no registra fallos.',weight:1},
 {id:'video',label:'Video continuo y validado',desc:'La secuencia completa permite identificar a la persona, no solo una prenda similar.',weight:1},
 {id:'property',label:'Número de serie y cadena de custodia',desc:'El dispositivo recuperado coincide con el denunciado y se documentó sin interrupciones.',weight:1},
 {id:'alibi',label:'Coartada corroborada',desc:'Un registro independiente sitúa al entrevistado en otro lugar durante el intervalo crítico.',weight:-2}
];
export default function BrokenWindowsPsychopathyModule({onBack}) {
 const [step,setStep]=useState(0),[selected,setSelected]=useState({}),[revealed,setRevealed]=useState(false),[checks,setChecks]=useState([]),[notes,setNotes]=useState(''),[report,setReport]=useState(false);
 const q=dialogue[step],choice=selected[step],score=dialogue.reduce((n,x,i)=>n+(x.options[selected[i]]?.evidence||0),0),verified=corroborations.filter(x=>checks.includes(x.id)).reduce((n,x)=>n+x.weight,0),admission=dialogue.some((x,i)=>x.options[selected[i]]?.evidence===2);
 const goNext=()=>{setRevealed(false);if(step<dialogue.length-1)setStep(step+1);else setReport(true)};
 const reset=()=>{setStep(0);setSelected({});setRevealed(false);setChecks([]);setNotes('');setReport(false)};
 const resultScore=score+verified;
 const verdict=admission&&resultScore>=3?'RESPONSABILIDAD SUSTENTADA EN EL CASO FICTICIO':resultScore>=2?'INDICIOS RELEVANTES, PERO NO CONCLUYENTES':'NO SE PUEDE DETERMINAR RESPONSABILIDAD';
 if(report)return <section className="page-content bw-module">
 <button className="back-link" onClick={()=>setReport(false)}><ArrowLeft size={16}/> Volver al expediente</button>
 <div className="page-heading"><div><span className="eyebrow">MINDTRACE / RESOLUCIÓN DEL CASO</span><h1>Dictamen del expediente<span>.</span></h1><p>Resultado de la simulación a partir de respuestas y elementos corroborables.</p></div><div className="heading-counter"><Scale size={27}/><span>ANÁLISIS<br/>PROBATORIO</span></div></div>
 <article className="bw-verdict"><span className="eyebrow">RESULTADO DEL CASO FICTICIO</span><h2>{verdict}</h2><p>{verdict.startsWith('RESPONSABILIDAD')?'En esta ruta de la simulación existe una admisión relevante y varios elementos independientes que la corroboran.':verdict.startsWith('INDICIOS')?'Hay elementos que justifican continuar investigando, pero las pruebas disponibles no alcanzan para afirmar culpabilidad.':'La información reunida no permite establecer quién cometió el hecho. La duda no se convierte en culpabilidad.'}</p><strong>Índice pedagógico de evidencia: {resultScore}</strong></article>
 <div className="bw-theory-grid"><article className="bw-theory-card"><Building2/><span className="eyebrow">VENTANAS ROTAS</span><h2>Contexto del entorno</h2><p>El deterioro y la falta de mantenimiento pueden afectar la percepción de control y las oportunidades. No identifican al autor ni prueban participación individual.</p></article><article className="bw-theory-card"><Brain/><span className="eyebrow">ENTREVISTA</span><h2>Conducta y respuestas</h2><p>Las respuestas se contrastan con datos verificables. Frialdad, nerviosismo, contradicciones o rasgos de personalidad no bastan para diagnosticar psicopatía ni declarar culpabilidad.</p></article></div>
 <div className="panel-card bw-answer-review"><h3>Fundamento de la resolución</h3>{dialogue.map((x,i)=><div className="bw-review-row" key={x.topic}><span>0{i+1}</span><div><small>{x.topic}</small><strong>{x.question}</strong><p><b>Pregunta elegida:</b> {x.options[selected[i]]?.label||'Sin respuesta'}<br/><b>Respuesta simulada:</b> {x.options[selected[i]]?.reply||'—'}<br/><b>Lectura:</b> {x.options[selected[i]]?.clue||'No se registró selección.'}</p></div></div>)}</div>
 <div className="panel-card bw-answer-review"><h3>Elementos contrastados</h3>{corroborations.filter(x=>checks.includes(x.id)).map(x=><p key={x.id}>• {x.label}: {x.desc}</p>)}{!checks.length&&<p>No se seleccionaron corroboraciones independientes.</p>}<label className="eyebrow">NOTAS DEL INVESTIGADOR</label><p>{notes||'Sin notas adicionales.'}</p></div>
 <div className="bw-ethics"><ShieldCheck/><p><strong>Advertencia jurídica y metodológica:</strong> es un resultado narrativo de un caso inventado, no una declaración real de culpabilidad. En la vida real, solo una autoridad judicial competente determina culpabilidad con debido proceso. No se infiere culpabilidad a partir de psicopatía, deterioro urbano ni perfil psicológico.</p></div>
 <div className="bw-actions"><button className="button-secondary" onClick={reset}><RotateCcw size={15}/> Repetir caso</button><button className="button-primary" onClick={()=>window.print()}><FileText size={15}/> Imprimir dictamen</button></div>
 </section>;
 return <section className="page-content bw-module">
 <button className="back-link" onClick={onBack}><ArrowLeft size={16}/> Volver al panel principal</button>
 <div className="page-heading"><div><span className="eyebrow">MINDTRACE / ENTREVISTA INTERACTIVA</span><h1>El caso Las Acacias<span>.</span></h1><p>Selecciona qué preguntar, escucha la respuesta del entrevistado y contrasta la información antes de emitir un resultado.</p></div><div className="heading-counter"><strong>{step+1}/06</strong><span>ETAPAS DE<br/>ENTREVISTA</span></div></div>
 <div className="bw-theory-grid"><article className="bw-theory-card"><Building2/><span className="eyebrow">VENTANAS ROTAS</span><h2>Escena y contexto</h2><p>Edificio con luminarias dañadas, grafitis, basura acumulada y una ventana rota. Estos signos describen el entorno, no identifican a un responsable.</p></article><article className="bw-theory-card"><Brain/><span className="eyebrow">RASGOS CONDUCTUALES</span><h2>Entrevista simulada</h2><p>Se exploran versiones, responsabilidad y coherencia. No es una prueba clínica ni una escala diagnóstica de psicopatía.</p></article></div>
 <div className="bw-case-brief"><span className="eyebrow">EXPEDIENTE FICTICIO MT–BW–01</span><h2>Denuncia: dispositivo sustraído</h2><p>El encargado denunció la rotura de una ventana y la desaparición de un dispositivo electrónico el martes por la noche. Hay una tarjeta de acceso registrada y una grabación parcial. Debes determinar qué preguntas realizar y qué pruebas adicionales solicitar.</p></div>
 <div className="bw-progress"><div><span style={{width:((step+(revealed?1:0))/dialogue.length*100)+'%'}}/></div><small>Etapa {step+1} de {dialogue.length}</small></div>
 <article className="panel-card bw-question-card"><div className="bw-question-meta"><span className="eyebrow"><MessageCircle size={14}/> ENTREVISTA · {q.topic}</span><span>DECISIÓN {step+1}/06</span></div><h2>{q.question}</h2><p>Elige una pregunta o línea de indagación. El entrevistado responderá de forma simulada; luego analiza qué se puede comprobar.</p>
 <div className="bw-options">{q.options.map((o,i)=><button key={i} className={choice===i?'selected':''} onClick={()=>{setSelected(p=>({...p,[step]:i}));setRevealed(false)}}><span className="bw-option-letter">{String.fromCharCode(65+i)}</span><span>{o.label}</span></button>)}</div>
 {choice!==undefined&&<div className="bw-reply"><span className="eyebrow">RESPUESTA DEL ENTREVISTADO</span><p>«{q.options[choice].reply}»</p><strong>Lectura investigativa</strong><p>{revealed?q.options[choice].clue:'Pulsa “Registrar respuesta” para revelar el análisis y continuar.'}</p>{!revealed&&<button className="button-primary" onClick={()=>setRevealed(true)}>Registrar respuesta <ArrowRight size={15}/></button>}</div>}
 {revealed&&<div className="bw-question-footer"><button className="button-secondary" onClick={()=>{setRevealed(false);setSelected(p=>{const n={...p};delete n[step];return n})}}>Cambiar pregunta</button><button className="button-primary" onClick={goNext}>{step===dialogue.length-1?'Pasar a corroboración':'Siguiente etapa'} <ArrowRight size={15}/></button></div>}</article>
 {step===dialogue.length-1&&revealed&&<article className="panel-card bw-corroborate"><span className="eyebrow">VERIFICACIÓN INDEPENDIENTE</span><h3>¿Qué pruebas lograste verificar?</h3><p>Marca solo los elementos que el expediente confirma. La declaración del entrevistado no sustituye la corroboración.</p>{corroborations.map(x=><label key={x.id}><input type="checkbox" checked={checks.includes(x.id)} onChange={e=>setChecks(p=>e.target.checked?[...p,x.id]:p.filter(id=>id!==x.id))}/><span><strong>{x.label}</strong><small>{x.desc}</small></span></label>)}<label className="eyebrow">OBSERVACIONES DEL INVESTIGADOR</label><textarea rows={3} value={notes} onChange={e=>setNotes(e.target.value)} placeholder="¿Qué contradicciones, explicaciones alternativas o datos pendientes encontraste?"/><button className="button-primary" onClick={()=>setReport(true)}>Emitir resultado del caso <Scale size={16}/></button></article>}
 <div className="bw-ethics"><ShieldCheck/><p><strong>Importante:</strong> las respuestas no miden psicopatía. Una persona no es culpable por parecer fría, mentir, ponerse nerviosa o vivir en un entorno deteriorado. El resultado depende de evidencia verificable dentro de esta ficción.</p></div>
 </section>;
}