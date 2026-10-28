// Banco ampliado: preguntas situacionales con distractores plausibles y retroalimentación académica.
// La puntuación premia el proceso de razonamiento, no la adivinación de una respuesta obvia.
const questionImagePaths = ["/images/bank/vulnerable-interview.svg","/images/bank/digital-logs.svg","/images/bank/memory-variation.svg","/images/bank/hypothesis-timeline.svg","/images/bank/evidence-corroboration.svg","/images/bank/planning-evidence.svg","/images/bank/chain-of-custody.svg","/images/bank/multifactor-analysis.svg","/images/bank/individual-participation.svg","/images/bank/forensic-reasoning.svg","/images/bank/community-context.svg","/images/bank/social-norms.svg","/images/bank/community-control.svg","/images/bank/risk-context-network.svg","/images/bank/case-linkage-map.svg","/images/bank/fragmented-bones.svg","/images/bank/biological-profile.svg","/images/bank/bone-fracture-analysis.svg","/images/bank/clinical-assessment.svg","/images/bank/forensic-psychology-report.svg"];
let questionImageIndex = 0;
const q = (prompt, options) => ({ prompt, options, image: questionImagePaths[questionImageIndex++] });
const o = (text, score, principle, feedback) => ({ text, score, principle, feedback });

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
