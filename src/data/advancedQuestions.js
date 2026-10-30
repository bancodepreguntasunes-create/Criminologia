// Banco ampliado: preguntas situacionales con distractores plausibles y retroalimentación académica.
// La puntuación premia el proceso de razonamiento, no la adivinación de una respuesta obvia.
const questionImagePaths = ["/images/23-vulnerable-person-interview-room.jpg","/images/17-digital-evidence-chain-custody.jpg","/images/12-statement-discrepancy.jpg","/images/02-crime-pattern-comparison.jpg","/images/24-physical-evidence-corroboration.jpg","/images/01-criminogenesis-planning.jpg","/images/05-disabled-alarm-escape-route.jpg","/images/06-disrupted-crime-scene.jpg","/images/18-principle-of-legality.jpg","/images/16-detention-not-guilt.jpg","/images/03-social-risk-factors.jpg","/images/04-multifactorial-analysis.jpg","/images/07-social-norm-vs-criminal-law.jpg","/images/08-community-social-rejection.jpg","/images/13-informal-community-control.jpg","/images/20-fragmented-bone-remains.jpg","/images/21-biological-profile-skull.jpg","/images/22-perimortem-vs-taphonomic-fracture.jpg","/images/19-individual-participation-footprints.jpg","/images/15-copp-procedural-guarantees.jpg"];
let questionImageIndex = 0;
const q = (prompt, options) => ({ prompt, options, image: questionImagePaths[questionImageIndex++] });
const o = (text, score, principle, feedback, trait = null) => ({ text, score, principle, feedback, ...(trait ? { trait } : {}) });

export const advancedQuestions = {
  testimonial: [
    q('Martín afirma que salió a las 21:40. El registro de su tarjeta marca 22:13, pero no identifica a quien la llevaba. La compañera solo recuerda una silueta. ¿Cuál es el siguiente paso más informativo?', [
      o('Pedirle a Martín que reconstruya la última hora en orden inverso y luego contrastar puntos verificables.', 8, 'Reconstrucción temporal', 'La reconstrucción puede revelar anclajes verificables, pero debe combinarse con una narración libre y sin tratar la técnica como detector de engaño.'),
      o('Mostrarle de inmediato el registro y exigir que explique por qué mintió.', 2, 'Confrontación prematura', 'Presupone engaño y puede contaminar el recuerdo. Primero registra su versión espontánea y documenta con precisión la discrepancia.'),
      o('Entrevistar primero a la compañera con preguntas abiertas sobre lo que vio, desde dónde y durante cuánto tiempo.', 10, 'Calidad de percepción', 'Aclara condiciones de observación, distancia, iluminación, duración e incertidumbre antes de convertir una silueta en identificación.'),
      o('Tomar las 22:13 como hora de salida porque el sistema es más preciso que la memoria.', 1, 'Límites del registro', 'El sistema puede registrar con precisión el uso de una tarjeta, no necesariamente la salida o presencia de su titular.')
    ]),
    q('La cámara muestra a una persona entrando a las 22:11, pero el reloj del sistema podría tener un desfase de hasta seis minutos. ¿Qué verificación debe preceder a la comparación con el registro de tarjeta?', [
      o('Comparar la ropa de la figura con la que Martín suele usar.', 3, 'Identificación limitada', 'La ropa puede orientar, pero no corrige el desfase horario ni basta para identificar a una persona.'),
      o('Preservar el archivo original, verificar sincronización horaria y revisar continuidad e integridad de la grabación.', 10, 'Integridad digital', 'Permite establecer si las marcas de tiempo son comparables y si el archivo conserva contexto suficiente.'),
      o('Usar la hora que confirme la mayoría de los empleados.', 1, 'Corroboración independiente', 'La opinión colectiva no calibra el reloj ni autentica el archivo.'),
      o('Ajustar la cámara manualmente hasta que coincida con la tarjeta.', 0, 'Riesgo de sesgo', 'Ajustar para obtener coincidencia introduce circularidad. La corrección debe basarse en una referencia independiente documentada.')
    ]),
    q('En una segunda entrevista, Martín cambia “me fui directamente a casa” por “pasé por el estacionamiento”. ¿Cómo documentas la discrepancia?', [
      o('Registrar las dos expresiones exactas, el contexto de cada una y preguntar qué significa “pasé por el estacionamiento”.', 10, 'Precisión del testimonio', 'Conserva el lenguaje original y aclara el significado sin transformar una diferencia verbal en prueba automática de mentira.'),
      o('Clasificarlo como mentiroso porque cambió un detalle.', 0, 'Inferencia injustificada', 'Los cambios pueden deberse a memoria, interpretación o información nueva; necesitan evaluación contextual.'),
      o('Eliminar la primera declaración para evitar confusión.', 1, 'Trazabilidad', 'La versión previa es parte del expediente y debe conservarse con su fecha y contexto.'),
      o('Pedirle que elija una versión definitiva y no volver al tema.', 3, 'Aclaración insuficiente', 'Una elección forzada no aclara la diferencia ni permite comprobarla independientemente.')
    ]),
    q('El registro muestra que la tarjeta se usó, la cámara muestra una figura parcialmente oculta y no hay identificación facial. ¿Qué hipótesis debe mantenerse activa?', [
      o('Martín volvió al edificio y ocultó su presencia.', 2, 'Hipótesis no confirmada', 'Es posible, pero la evidencia descrita no permite atribuir la tarjeta ni identificar la figura con seguridad.'),
      o('Otra persona pudo usar la tarjeta; también debe comprobarse si el reloj y la cámara son fiables.', 10, 'Hipótesis alternativas', 'Considera explicaciones contrastables y separa la fiabilidad de las fuentes de la atribución de identidad.'),
      o('La cámara es inútil porque no muestra el rostro.', 4, 'Valor parcial de evidencia', 'La imagen puede aportar ruta, ropa o secuencia, aunque no permita identificar por sí sola.'),
      o('La compañera debe estar equivocada porque no recuerda la hora.', 1, 'Incertidumbre testimonial', 'La imprecisión temporal reduce el peso de ese detalle, pero no invalida todo el recuerdo.')
    ]),
    q('Antes de cerrar el caso, ¿qué combinación ofrece la mejor corroboración independiente?', [
      o('Una declaración adicional de alguien que escuchó el rumor en la oficina.', 2, 'Independencia de fuentes', 'Repetir información de segunda mano no equivale a una fuente independiente.'),
      o('Copia autenticada del registro, video preservado con reloj calibrado y comprobación de quién tenía acceso a la tarjeta.', 10, 'Triangulación', 'Combina fuentes con funciones distintas y permite comprobar tiempo, identidad y posibilidad de uso por terceros.'),
      o('Una evaluación de si Martín parecía tranquilo durante la entrevista.', 0, 'Conducta no diagnóstica', 'La calma o el nerviosismo no determinan veracidad ni responsabilidad.'),
      o('Una conclusión del supervisor basada en su experiencia con Martín.', 3, 'Autoridad no probatoria', 'El conocimiento contextual puede orientar preguntas, pero no reemplaza evidencia verificable.')
    ])
  ],
  corporate: [
    q('Dos facturas tienen el mismo importe y concepto, pero números distintos. Una cuenta de compras creó al proveedor y otra cuenta registró la validación bancaria. ¿Qué pregunta permite reconstruir mejor el flujo de control?', [
      o('¿Quién tenía peor relación con la directora financiera?', 1, 'Relevancia probatoria', 'La relación personal no reconstruye las aprobaciones ni el procesamiento de los pagos.'),
      o('¿Qué evento, usuario, sello horario y autorización aparecen en cada etapa desde el alta hasta la transferencia?', 10, 'Trazabilidad transaccional', 'Descompone el proceso en eventos verificables y permite localizar dónde fallaron los controles.'),
      o('¿Quién reconoce que cometió el error?', 3, 'Atribución prematura', 'Buscar una admisión antes de reconstruir el proceso puede sesgar entrevistas y no aclara si hubo error o fraude.'),
      o('¿Podemos cancelar todos los pagos del proveedor y dar el caso por resuelto?', 2, 'Contención vs. investigación', 'La contención puede ser necesaria, pero no determina causa, alcance ni responsabilidades.')
    ]),
    q('Las bitácoras muestran una sesión válida de la cuenta de una analista a las 23:48. Ella afirma que había cerrado sesión a las 18:00. ¿Qué comprobación es más sólida?', [
      o('Verificar MFA, IP/dispositivo, sesiones activas, registros de acceso físico y posibilidad de credenciales compartidas o comprometidas.', 10, 'Atribución de actividad digital', 'Una cuenta identifica una credencial, no siempre a la persona. La correlación técnica ayuda a evaluar alternativas.'),
      o('Concluir que la analista trabajó de noche porque su usuario aparece en el log.', 2, 'Límite de la cuenta', 'El usuario registrado es un indicio importante, pero no descarta sesión abierta, suplantación o automatización.'),
      o('Preguntar si suele cometer errores en el trabajo.', 1, 'Generalización personal', 'El historial general no resuelve quién originó este evento concreto.'),
      o('Descartar el registro porque ella niega haberlo usado.', 0, 'Contraste de fuentes', 'La negación no invalida la bitácora; ambos datos deben comprobarse.')
    ]),
    q('La política exige doble aprobación, pero permite excepciones al cierre mensual. Los pagos duplicados se procesaron ese día. ¿Qué hipótesis es más útil para orientar la siguiente fase?', [
      o('La directora financiera organizó el fraude porque su área ejecutó los pagos.', 0, 'Confundir función con autoría', 'Ejecutar una etapa no demuestra conocimiento, intención ni participación en el alta del proveedor.'),
      o('La excepción pudo debilitar el control; hay que identificar quién la solicitó, autorizó y ejecutó y si existía soporte comercial.', 10, 'Hipótesis verificable', 'Conecta una vulnerabilidad con eventos específicos sin asumir que una falla de proceso prueba fraude deliberado.'),
      o('El proveedor es ficticio porque es nuevo.', 2, 'Inferencia insuficiente', 'La antigüedad del proveedor no demuestra inexistencia; hay que verificar registro, titularidad y prestación real.'),
      o('El problema es exclusivamente informático.', 3, 'Causalidad múltiple', 'Puede haber un componente técnico, pero también decisiones, controles y documentación comercial que revisar.')
    ]),
    q('Compras afirma que finanzas validó el proveedor; finanzas afirma que compras recibió los documentos validados. ¿Cómo evitas que las entrevistas se conviertan en acusaciones cruzadas?', [
      o('Entrevistar por separado, pedir a cada persona que describa su propio paso y contrastar cada afirmación con metadatos y documentos originales.', 10, 'Entrevista basada en procesos', 'Reduce contaminación entre versiones y convierte afirmaciones generales en puntos verificables.'),
      o('Reunir a todos y pedir que voten quién tuvo la culpa.', 0, 'Presión grupal', 'La dinámica puede inhibir respuestas y producir consenso social en lugar de evidencia.'),
      o('Aceptar la versión del área que tenga más empleados.', 1, 'Sesgo de mayoría', 'El número de personas no aumenta la validez de una afirmación.'),
      o('Pedir al gerente general que elija la explicación más convincente.', 3, 'Jerarquía vs. evidencia', 'La dirección puede tomar medidas de gestión, pero la atribución requiere trazabilidad independiente.')
    ]),
    q('Los documentos confirman pagos duplicados, pero todavía no hay prueba de que se entregara dinero a una persona interna. ¿Qué debe decir el informe provisional?', [
      o('“Se confirmó una red criminal interna”.', 0, 'Sobreafirmación', 'La evidencia descrita no acredita coordinación criminal ni beneficio individual.'),
      o('“Se detectaron pagos duplicados y posibles fallas de control; la intención, el beneficio y la atribución individual siguen bajo verificación”.', 10, 'Conclusión proporcional', 'Distingue hechos constatados de inferencias pendientes y delimita qué evidencia falta.'),
      o('“No existe irregularidad hasta que alguien confiese”.', 1, 'Dependencia de confesión', 'Los registros financieros y comerciales pueden probar hechos sin confesión.'),
      o('“La analista es responsable porque su cuenta aparece en una bitácora”.', 2, 'Atribución insuficiente', 'La actividad de una cuenta debe correlacionarse con otras fuentes y con el rol de cada actor.')
    ])
  ],
  social: [
    q('Tras daños en la plaza, un chat acusa a un joven con conflictos previos. La testigo dice haber oído una discusión, pero no vio el golpe. ¿Qué separarías en su entrevista?', [
      o('Lo que oyó directamente, lo que observó visualmente y lo que supo después por terceros.', 10, 'Fuente y percepción', 'Distingue experiencia directa de inferencia y relato de terceros, evitando que el rumor se convierta en observación.'),
      o('Si cree que el joven es capaz de hacer algo así.', 1, 'Estereotipo de carácter', 'La opinión sobre la personalidad no identifica quién produjo el daño.'),
      o('Si puede confirmar lo que dice el chat.', 3, 'Pregunta sugestiva', 'Introduce información que puede influir en el recuerdo; conviene obtener primero el relato libre.'),
      o('Si otras personas también lo consideran culpable.', 0, 'Contagio social', 'El consenso comunitario puede reflejar repetición del mismo rumor, no corroboración independiente.')
    ]),
    q('Tres mensajes repiten la misma acusación, pero todos citan una publicación original cuyo autor no aparece. ¿Cuántas fuentes independientes tienes?', [
      o('Tres, porque hay tres mensajes.', 1, 'Repetición no es independencia', 'Si todos derivan de una sola fuente no verificada, no son tres corroboraciones independientes.'),
      o('Una cadena de información de origen no verificado; hay que localizar el origen y buscar evidencia aparte.', 10, 'Genealogía de la información', 'Rastrear el origen permite detectar copias y evita inflar artificialmente el número de fuentes.'),
      o('Ninguna evidencia útil, por lo que debe borrarse todo.', 3, 'Preservación crítica', 'El contenido puede servir como pista y debe preservarse de forma responsable, aunque no confirme la acusación.'),
      o('Una prueba de culpabilidad si los mensajes se publicaron pronto.', 0, 'Error de temporalidad', 'La rapidez de circulación no demuestra exactitud ni autoría.')
    ]),
    q('El mapa de relaciones muestra disputas previas por el uso de la plaza entre dos grupos. ¿Cómo debe utilizarse ese dato?', [
      o('Como contexto para formular hipótesis y preguntas sobre horarios, accesos y conflictos concretos, no como prueba de autoría.', 10, 'Análisis contextual', 'El contexto guía la investigación, pero debe conectarse con hechos específicos mediante corroboración.'),
      o('Para priorizar al grupo con más conflictos previos como responsable.', 1, 'Sesgo de disponibilidad', 'El conflicto previo puede sesgar la atribución si no hay evidencia del incidente actual.'),
      o('Para descartar el caso como una disputa personal.', 2, 'Reducción causal', 'El conflicto puede ser relevante, pero no explica por sí solo el daño ni quién lo causó.'),
      o('Para publicar nombres y pedir a la comunidad que identifique al agresor.', 0, 'Privacidad y contaminación', 'Puede exponer a personas, generar represalias y alterar testimonios.')
    ]),
    q('Una cámara comunitaria muestra parte del sendero, pero hay una zona ciega y el archivo fue descargado por un vecino antes de entregarlo. ¿Qué debe hacerse?', [
      o('Usar el clip tal cual, porque muestra el lugar del incidente.', 3, 'Integridad del archivo', 'El contenido puede orientar, pero hace falta verificar origen, continuidad, fecha y manejo del archivo.'),
      o('Documentar quién lo obtuvo, preservar el original si existe, verificar metadatos y registrar límites de cobertura.', 10, 'Cadena de custodia digital', 'Permite valorar autenticidad y alcance sin suponer que la zona visible representa toda la escena.'),
      o('Descartarlo automáticamente porque lo descargó un vecino.', 2, 'Evaluación proporcional', 'El manejo previo requiere cautela, pero no obliga a descartar sin examinar autenticidad e integridad.'),
      o('Completar la zona ciega con la versión más repetida en el chat.', 0, 'No rellenar vacíos', 'Los vacíos de evidencia deben declararse; no pueden completarse con rumores.')
    ]),
    q('Debes presentar una conclusión a una mesa vecinal que exige un nombre esa misma noche. Solo está confirmado el daño y hay testimonios indirectos. ¿Qué respuesta es profesional?', [
      o('Nombrar al sospechoso más mencionado para calmar a la comunidad.', 0, 'Presión social', 'La presión no convierte un rumor en evidencia y puede causar daños irreparables.'),
      o('Explicar qué hechos están corroborados, qué atribución sigue sin resolverse y qué medidas de protección y verificación continúan.', 10, 'Comunicación responsable', 'Informa con transparencia sobre límites, próximos pasos y seguridad sin atribuir culpabilidad prematuramente.'),
      o('Afirmar que nadie puede aportar información útil.', 2, 'Cierre prematuro', 'Puede haber información valiosa, pero debe recogerse de forma segura y evaluarse por su fuente.'),
      o('Compartir todas las declaraciones para que la comunidad las compare.', 1, 'Confidencialidad', 'Difundir testimonios puede contaminar versiones y poner en riesgo a testigos.')
    ])
  ],
  ecological: [
    q('Se reporta mortalidad de peces aguas abajo. Dos muestras son anómalas, pero falta confirmar hora, preservación y cadena de custodia. ¿Cuál es la prioridad?', [
      o('Publicar que la planta causó el daño porque está aguas arriba.', 1, 'Causalidad no establecida', 'La ubicación es relevante, pero no establece por sí sola la fuente, el mecanismo ni la responsabilidad.'),
      o('Validar trazabilidad y calidad de las muestras y planificar muestreo comparativo aguas arriba/abajo con protocolo documentado.', 10, 'Validez científica', 'La interpretación depende de muestras representativas, preservadas y comparables, además de controles y contexto temporal.'),
      o('Esperar la declaración final de la empresa antes de recoger más datos.', 0, 'Independencia de investigación', 'La recopilación y preservación de evidencia no debe depender de la versión de una parte interesada.'),
      o('Usar solo fotografías del agua porque registran el color.', 2, 'Límites de evidencia visual', 'Las imágenes documentan apariencia, pero no identifican contaminantes ni concentraciones de forma fiable.')
    ]),
    q('El registro de operaciones tiene una interrupción de 47 minutos durante el turno nocturno. ¿Qué datos ayudarían más a interpretarla?', [
      o('Alarmas, mantenimiento, sensores independientes, registros de respaldo y cambios de configuración en la misma ventana temporal.', 10, 'Corroboración operacional', 'Permite distinguir fallo técnico, mantenimiento, pérdida de datos o actividad que requiera investigación.'),
      o('La reputación ambiental de la empresa durante los últimos años.', 3, 'Contexto no concluyente', 'El historial puede orientar, pero no explica la interrupción concreta.'),
      o('La declaración del supervisor de que todo funcionaba bien.', 2, 'Verificación de versiones', 'La versión es relevante, pero debe compararse con registros técnicos independientes.'),
      o('Asumir que el hueco de datos prueba que se ocultó un vertido.', 0, 'Ausencia de datos', 'Una interrupción puede tener varias causas y no demuestra por sí sola una acción deliberada.')
    ]),
    q('Los residentes describen olor fuerte entre las 20:00 y las 22:00, pero sus horarios varían y algunos se enteraron por redes sociales. ¿Cómo ponderas sus relatos?', [
      o('Como pistas para diseñar una cronología, separando observación directa de información recibida y buscando registros independientes.', 10, 'Valor testimonial contextual', 'Los relatos pueden orientar el muestreo y la revisión de sensores sin sustituir evidencia química ni temporal.'),
      o('Como prueba concluyente porque varios vecinos coinciden en el olor.', 2, 'Corroboración aparente', 'La coincidencia es relevante, pero hay que examinar independencia, exposición y posible influencia mutua.'),
      o('Como información inútil porque no son especialistas.', 1, 'Descarte excesivo', 'Los residentes pueden aportar observaciones de tiempo y lugar; su alcance debe evaluarse correctamente.'),
      o('Ajustar todos los horarios al de la primera publicación viral.', 0, 'Contaminación temporal', 'No debe forzarse concordancia con una fuente que pudo influir en los recuerdos.')
    ]),
    q('El contratista afirma que recibió una instrucción verbal para acelerar el proceso. No hay correo, pero el registro muestra un cambio de configuración poco antes del incidente. ¿Cuál es la siguiente diligencia más sólida?', [
      o('Tratar el relato como una pista y contrastarlo con permisos, historial de configuración, comunicaciones, turnos y posibles testigos directos.', 10, 'Corroboración de instrucciones', 'La hipótesis puede verificarse mediante fuentes diversas sin asumir que el cambio demuestra una orden o intención ilícita.'),
      o('Concluir que el contratista inventó la orden porque no hay correo.', 2, 'Ausencia de registro', 'Una instrucción verbal puede no dejar correo; su existencia debe investigarse, no descartarse automáticamente.'),
      o('Atribuir la orden al supervisor porque estaba de turno.', 1, 'Oportunidad no es autoría', 'Estar de turno no demuestra que impartiera la instrucción.'),
      o('Pedir a la empresa que elija qué registros entregar.', 0, 'Independencia de evidencia', 'La selección unilateral puede dejar fuera datos relevantes; debe documentarse el alcance de la recopilación conforme a los procedimientos aplicables.')
    ]),
    q('Los análisis confirman un contaminante en una muestra aguas abajo, pero aún no hay una muestra válida aguas arriba ni una fuente química vinculada. ¿Qué conclusión es defendible?', [
      o('La planta cometió un delito ambiental.', 0, 'Atribución prematura', 'El resultado no identifica por sí solo la fuente ni establece todos los elementos de responsabilidad.'),
      o('Se detectó una anomalía en una muestra; falta delimitar extensión, origen, ventana temporal y relación con operaciones específicas.', 10, 'Conclusión calibrada', 'Describe el hallazgo sin exceder su alcance y define las verificaciones necesarias para evaluar causalidad.'),
      o('No existe daño porque solo se analizó una muestra.', 1, 'Negación excesiva', 'Una muestra limitada no permite caracterizar toda la zona, pero el resultado anómalo sí merece evaluación.'),
      o('El contratista es responsable porque mencionó una instrucción verbal.', 2, 'Testimonio no corroborado', 'La declaración es una línea de investigación, no una atribución suficiente por sí misma.')
    ])
  ]
};

/* Cuatro preguntas situacionales adicionales por expediente para el nivel Muy difícil. */
export const behavioralProfileQuestions = {
 testimonial: [
 q('Una persona cambia su relato tras conocer detalles publicados. ¿Qué harías?', [
 o('Separar lo recordado antes y después de la exposición, documentar fuentes y contrastar con evidencia independiente.',10,'Control de contaminación','Evalúa la fuente del recuerdo sin presumir engaño.','memoria'),
 o('Afirmar que cambió el relato porque oculta su participación.',1,'Inferencia sin base','Un cambio puede tener múltiples explicaciones.','manipulacion'),
 o('Repetirle los detalles publicados para comprobar si los recuerda.',2,'Contaminación inducida','Introduce información adicional.','memoria'),
 o('Descartar la primera versión por ser menos detallada.',3,'Pérdida de contexto','Deben conservarse todas las versiones.','memoria')]),
 q('Hay indicios de preparación, pero existen explicaciones alternativas. ¿Qué análisis procede?', [
 o('Reconstruir secuencia, recursos, oportunidades y decisiones verificables, contrastando hipótesis alternativas.',10,'Planificación conductual','Se apoya en hechos corroborados, no en etiquetas personales.','planificacion'),
 o('Concluir que es calculador por la complejidad del hecho.',1,'Rasgo inferido','La complejidad no acredita un rasgo estable.','planificacion'),
 o('Preguntar si diseñó todo desde el principio.',2,'Pregunta sugestiva','Presupone preparación.','planificacion'),
 o('Tomar la complejidad como prueba definitiva de premeditación.',3,'Interpretación limitada','Se requiere corroboración contextual.','planificacion')]),
 q('La persona responde precipitadamente ante preguntas inesperadas. ¿Cómo valoras esa conducta?', [
 o('Registrar secuencia y contexto, y revisar el patrón en varias respuestas sin inferir un rasgo por un episodio.',10,'Evaluación contextual','Evita diagnosticar a partir de una reacción aislada.','impulsividad'),
 o('Clasificarla como impulsiva porque elevó la voz.',1,'Inferencia no válida','El tono no permite diagnosticar impulsividad.','impulsividad'),
 o('Provocarla deliberadamente para observar si pierde el control.',2,'Entrevista coercitiva','La provocación contamina la interacción.','impulsividad'),
 o('Asumir que una respuesta rápida demuestra sinceridad.',3,'Inferencia limitada','La rapidez no determina veracidad.','memoria')]),
 q('Describe con detalle el daño sufrido por la víctima, pero no se conoce su información previa. ¿Qué concluyes?', [
 o('Distinguir la comprensión expresada de la empatía como rasgo y verificar qué información conocía previamente.',10,'Comprensión y empatía','No confunde discurso con rasgo psicológico estable.','empatia'),
 o('Concluir que carece de empatía porque no expresa emoción visible.',1,'Lectura emocional','La expresión externa no mide empatía.','empatia'),
 o('Preguntar si realmente le importó la víctima.',2,'Pregunta cargada','Sugiere una respuesta y presupone una valoración moral.','empatia'),
 o('Afirmar que manipula porque utiliza palabras precisas.',3,'Inferencia limitada','La precisión verbal no demuestra manipulación.','manipulacion')])
 ],
 corporate: [
 q('Una empleada cambia su explicación tras revisar documentos internos. ¿Qué permite estudiar influencia externa?', [
 o('Comparar versiones fechadas, accesos a documentos y comunicaciones, preservando la secuencia de exposición.',10,'Influencia y memoria','Diferencia actualización del recuerdo y presión externa.','manipulacion'),
 o('Concluir que fue manipulada porque cambió su explicación.',1,'Inferencia sin base','El cambio no prueba influencia.','manipulacion'),
 o('Preguntar quién le ordenó mentir.',2,'Pregunta sugestiva','Presupone una orden y una mentira.','manipulacion'),
 o('Ignorar la primera versión y conservar solo la última.',3,'Pérdida de trazabilidad','Deben conservarse todas las versiones.','memoria')]),
 q('Una operación compleja requirió varias autorizaciones. ¿Cómo evalúas planificación?', [
 o('Mapear decisiones, competencias, tiempos y registros auditables para identificar acciones corroboradas.',10,'Planificación organizacional','Distingue diseño del proceso y responsabilidad individual.','planificacion'),
 o('Atribuir la planificación a la persona de mayor rango.',1,'Sesgo jerárquico','El cargo no prueba intervención.','planificacion'),
 o('Preguntar quién organizó el fraude.',2,'Presunción de delito','Presupone que el hecho está establecido.','manipulacion'),
 o('Tomar una demora como prueba de reacción impulsiva.',3,'Inferencia limitada','Una demora admite explicaciones distintas.','impulsividad')]),
 q('Un entrevistado responde antes de escuchar la pregunta completa. ¿Qué haces?', [
 o('Formular una pregunta a la vez, registrar el contexto y valorar el patrón en distintas respuestas.',10,'Control de entrevista','Evita convertir una conducta puntual en diagnóstico.','impulsividad'),
 o('Concluir que tiene escaso control de impulsos.',1,'Etiqueta prematura','Se requiere contexto y evaluación válida.','impulsividad'),
 o('Aumentar la presión para provocar una reacción.',2,'Presión indebida','La presión reduce la fiabilidad.','impulsividad'),
 o('Interpretar la rapidez como prueba de conocimiento.',3,'Inferencia limitada','La velocidad no acredita conocimiento.','memoria')]),
 q('La organización afirma que compensó a los afectados. ¿Cómo exploras empatía?', [
 o('Examinar qué información sobre el impacto recibió cada responsable y qué medidas documentadas se adoptaron.',10,'Consideración del daño','Evalúa conocimiento y decisiones observables.','empatia'),
 o('Considerar que pagar una compensación demuestra empatía alta.',1,'Conclusión excesiva','Una acción no establece un rasgo psicológico.','empatia'),
 o('Preguntar quién carecía de sentimientos hacia los afectados.',2,'Pregunta sesgada','Introduce una etiqueta emocional.','empatia'),
 o('Afirmar que toda decisión económica fue manipuladora.',3,'Generalización','Debe analizarse contexto y corroboración.','manipulacion')])
 ],
 social: [
 q('Un grupo cambia su versión después de conversar entre sí. ¿Qué procedimiento priorizas?', [
 o('Entrevistar por separado, documentar contactos y distinguir recuerdos propios de información compartida.',10,'Memoria e influencia grupal','Explora contaminación sin presumir coordinación ilícita.','memoria'),
 o('Concluir que todos acordaron mentir.',1,'Inferencia sin base','La coincidencia no prueba un acuerdo.','manipulacion'),
 o('Preguntar quién convenció al resto para ocultar los hechos.',2,'Pregunta sugestiva','Presupone ocultamiento e influencia.','manipulacion'),
 o('Tomar la versión más repetida como la más fiable.',3,'Falsa corroboración','La repetición puede proceder de una fuente común.','memoria')]),
 q('El daño ocurrió en un lapso breve y hay indicios de preparación. ¿Cómo valoras planificación?', [
 o('Diferenciar preparación comprobada, oportunidad, secuencia y decisiones espontáneas mediante fuentes independientes.',10,'Planificación del evento','Evita equiparar rapidez con impulsividad o premeditación.','planificacion'),
 o('Clasificar el hecho como impulsivo porque duró pocos minutos.',1,'Inferencia temporal','La duración no determina el proceso de decisión.','impulsividad'),
 o('Afirmar que hubo planificación por la presencia de varias personas.',2,'Coordinación no probada','La presencia no demuestra acuerdo previo.','planificacion'),
 o('Preguntar quién diseñó el incidente.',3,'Pregunta sugestiva','Presupone un diseño común.','planificacion')]),
 q('Un participante reacciona con enojo al precisar una hora. ¿Cómo interpretas esa reacción?', [
 o('Registrar la reacción y continuar con preguntas neutrales, verificando horarios con fuentes externas.',10,'Regulación conductual','No confunde emoción observable con impulsividad o falsedad.','impulsividad'),
 o('Concluir que el enojo confirma culpabilidad.',1,'Inferencia no válida','La emoción no demuestra participación.','impulsividad'),
 o('Provocar una discusión para observar su autocontrol.',2,'Entrevista provocativa','Aumenta sesgo y reduce fiabilidad.','impulsividad'),
 o('Interpretar la falta de llanto como ausencia de empatía.',3,'Lectura emocional','La expresión no mide empatía.','empatia')]),
 q('Una persona afirma que ayudó a una víctima, pero no hay testigos directos. ¿Qué evalúas?', [
 o('Separar conducta afirmada, conocimiento del daño y corroboración independiente antes de valorar la hipótesis.',10,'Empatía y corroboración','No atribuye un rasgo a partir de una declaración.','empatia'),
 o('Considerar que el relato prueba empatía elevada.',1,'Conclusión excesiva','La declaración no establece un rasgo estable.','empatia'),
 o('Afirmar que inventó la ayuda para manipular.',2,'Inferencia sin base','La hipótesis requiere evidencia.','manipulacion'),
 o('Preguntar por qué necesita parecer una buena persona.',3,'Pregunta cargada','Atribuye motivación sin base.','manipulacion')])
 ],
 ecological: [
 q('Un operador cambia varias veces su explicación sobre una alarma ambiental. ¿Cómo examinas memoria?', [
 o('Conservar cada versión y contrastarla con bitácoras, sensores y exposición previa a informes.',10,'Memoria contextual','Evalúa fuentes sin presumir engaño.','memoria'),
 o('Concluir que miente porque no recuerda el minuto exacto.',1,'Inferencia sin base','La precisión temporal no mide veracidad.','memoria'),
 o('Mostrarle el informe completo antes de pedirle que recuerde.',2,'Contaminación del recuerdo','La información previa puede modificar el recuerdo.','memoria'),
 o('Descartar la primera versión por ser menos detallada.',3,'Sesgo retrospectivo','El detalle posterior puede proceder de fuentes externas.','memoria')]),
 q('La alteración del sistema sigue una secuencia técnica compleja. ¿Qué sustenta planificación?', [
 o('Correlacionar cambios, permisos, turnos y registros con cronología y explicaciones técnicas alternativas.',10,'Planificación operacional','La secuencia verificable evita inferir personalidad.','planificacion'),
 o('Afirmar que el operador es calculador por conocer el sistema.',1,'Rasgo inferido','El conocimiento técnico no establece perfil psicológico.','planificacion'),
 o('Preguntar quién planeó el daño deliberado.',2,'Presunción de intención','La pregunta presupone intención.','planificacion'),
 o('Concluir impulsividad por una alarma no atendida.',3,'Inferencia limitada','Puede haber fallos de procedimiento o tecnología.','impulsividad')]),
 q('Un responsable toma una decisión urgente durante una alarma. ¿Cómo valoras control de impulsos?', [
 o('Reconstruir información disponible, protocolos, tiempo de reacción y alternativas reales en ese momento.',10,'Decisión bajo presión','Evalúa conducta situada sin convertirla en rasgo estable.','impulsividad'),
 o('Clasificarlo como impulsivo porque decidió rápido.',1,'Inferencia temporal','La rapidez puede ser adecuada en una emergencia.','impulsividad'),
 o('Preguntar por qué actuó sin pensar.',2,'Pregunta cargada','Presupone ausencia de deliberación.','impulsividad'),
 o('Asumir que una decisión correcta demuestra empatía alta.',3,'Inferencia limitada','La calidad técnica no mide empatía.','empatia')]),
 q('La empresa comunica que no hubo impacto antes de recibir resultados. ¿Qué exploras?', [
 o('Identificar qué datos conocían, cuándo los recibieron y cómo justificaron cada comunicación.',10,'Conocimiento del impacto','Estudia conocimiento y comunicación mediante hechos.','empatia'),
 o('Concluir que la empresa carece de empatía.',1,'Etiqueta no sustentada','Una comunicación no basta para atribuir un rasgo.','empatia'),
 o('Afirmar manipulación porque el mensaje fue tranquilizador.',2,'Inferencia sin base','Debe verificarse intención y contexto.','manipulacion'),
 o('Preguntar quién decidió ocultar la contaminación.',3,'Pregunta sugestiva','Presupone ocultamiento.','manipulacion')])
 ]
};
