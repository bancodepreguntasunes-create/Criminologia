export const difficulties = [
  { name: 'Difícil', rank: 1, note: 'Caso guiado con pistas limitadas' },
  { name: 'Muy difícil', rank: 2, note: 'Contradicciones y fuentes parciales' },
  { name: 'Avanzado', rank: 3, note: 'Investigación autónoma' },
  { name: 'Experto', rank: 4, note: 'Caso abierto y defensa de hipótesis' }
];

export const scenarios = [
  {
    id: 'testimonial',
    number: '01',
    category: 'Entrevista investigativa',
    title: 'La hora que no encaja',
    subtitle: 'Un testimonio cambia cuando aparece un registro de acceso.',
    location: 'Sala de entrevistas · Distrito Norte',
    icon: 'messages',
    color: 'blue',
    duration: '12–18 min',
    tags: ['Memoria', 'Cronología', 'Contraste'],
    brief: 'Un testigo afirma que salió del edificio a las 21:40. El registro muestra que su tarjeta fue usada a las 22:13. Una compañera cree haberlo visto en el estacionamiento antes de las 22:00, pero no está segura de la hora.',
    objective: 'Reconstruir la cronología sin asumir que una discrepancia equivale a engaño.',
    interviewee: { name: 'Martín Vega', role: 'Analista administrativo', quote: 'Yo ya me había ido. La tarjeta pudo utilizarla otra persona. No recuerdo haber regresado esa noche.' },
    evidence: [
      { id: 'access', title: 'Registro de acceso', kind: 'Digital', detail: 'La tarjeta de Martín fue utilizada a las 22:13. El sistema no confirma quién la llevaba físicamente.', clue: 'Prueba el uso de la tarjeta, no necesariamente la presencia de su titular.' },
      { id: 'witness', title: 'Declaración de compañera', kind: 'Testimonio', detail: 'La compañera recuerda una figura parecida a Martín en el estacionamiento, pero no puede precisar la hora.', clue: 'La identificación y el horario tienen incertidumbre.' },
      { id: 'calendar', title: 'Calendario de reuniones', kind: 'Documento', detail: 'El equipo tenía una reunión que terminó oficialmente a las 21:25.', clue: 'Aporta contexto, pero no demuestra cuándo salió cada persona.' }
    ],
    questions: [
      { prompt: '¿Cómo iniciarías la entrevista?', options: [
        { text: 'Cuéntame, paso a paso, cómo terminó tu jornada y qué hiciste después.', score: 10, feedback: 'Excelente inicio: permite una narración libre antes de introducir información que pueda condicionar el recuerdo.', principle: 'Narración libre' },
        { text: 'El registro demuestra que mientes. ¿Por qué regresaste?', score: 2, feedback: 'La pregunta presupone una mentira y confunde el uso de una tarjeta con la presencia de su titular.', principle: 'Evitar presuposiciones' },
        { text: '¿Estabas nervioso cuando saliste?', score: 1, feedback: 'El nerviosismo no permite inferir engaño. La pregunta tampoco reconstruye la cronología.', principle: 'Evitar inferencias débiles' },
        { text: 'El registro marca 22:13. ¿Cómo explicas esa diferencia con tu recuerdo?', score: 8, feedback: 'Es pertinente contrastar la diferencia, aunque conviene recoger primero el relato espontáneo.', principle: 'Contraste contextualizado' }
      ]},
      { prompt: '¿Qué harías con el registro de acceso?', options: [
        { text: 'Tratarlo como prueba concluyente de que Martín estuvo allí.', score: 1, feedback: 'El registro confirma el uso de la tarjeta, no la identidad de quien la utilizó.', principle: 'Valorar límites de evidencia' },
        { text: 'Verificar cámaras, registros complementarios y posibles accesos compartidos.', score: 10, feedback: 'Correcto: buscas corroboración independiente y consideras explicaciones alternativas.', principle: 'Corroboración' },
        { text: 'Descartarlo porque Martín niega haber regresado.', score: 2, feedback: 'Una declaración no elimina evidencia documental; ambas fuentes deben examinarse.', principle: 'Contraste de fuentes' },
        { text: 'Preguntar a todos si creen que Martín es honesto.', score: 3, feedback: 'La reputación percibida no sustituye la comprobación de hechos específicos.', principle: 'Evitar sesgo de reputación' }
      ]},
      { prompt: '¿Cuál es la conclusión provisional más sólida?', options: [
        { text: 'Martín mintió y es responsable del incidente.', score: 0, feedback: 'La información disponible no prueba mentira ni responsabilidad.', principle: 'No concluir prematuramente' },
        { text: 'Existe una discrepancia temporal que requiere comprobación; hay varias explicaciones posibles.', score: 10, feedback: 'Conclusión prudente, proporcional a la evidencia y abierta a hipótesis alternativas.', principle: 'Calibrar conclusiones' },
        { text: 'La compañera se equivoca necesariamente.', score: 2, feedback: 'El recuerdo puede ser impreciso, pero no hay base para descartarlo por completo.', principle: 'Incertidumbre testimonial' },
        { text: 'No se puede investigar nada hasta tener una confesión.', score: 1, feedback: 'La investigación debe avanzar con fuentes verificables, no depender de una confesión.', principle: 'Investigación basada en evidencia' }
      ]}
    ],
    scene: {
      title: 'Oficina después del cierre',
      description: 'Explora el entorno y decide qué elementos merecen una verificación adicional.',
      hotspots: [
        { id: 'door', label: 'Lector de acceso', x: -2.5, y: 1.2, z: 0.1, color: '#66c4e8', detail: 'El lector registra una credencial. Debes verificar si existe evidencia de que la persona titular la usó.' },
        { id: 'desk', label: 'Escritorio', x: 0, y: 1.1, z: -1.2, color: '#e9b66a', detail: 'Hay una agenda de reuniones. Comprueba si sus horarios coinciden con otros registros.' },
        { id: 'camera', label: 'Cámara de pasillo', x: 2.2, y: 1.8, z: 0.4, color: '#a4d6a5', detail: 'Solicita la grabación original y verifica la hora del sistema antes de interpretar las imágenes.' },
        { id: 'window', label: 'Estacionamiento', x: 0.4, y: 1.4, z: 2.0, color: '#c4a7ed', detail: 'La testigo recuerda una figura, no una identificación inequívoca. Busca corroboración independiente.' }
      ]
    }
  },
  {
    id: 'corporate',
    number: '02',
    category: 'Investigación empresarial',
    title: 'El expediente corporativo',
    subtitle: 'Pagos autorizados, responsabilidades distribuidas y un proveedor fantasma.',
    location: 'Sede de Logística Meridian',
    icon: 'briefcase',
    color: 'amber',
    duration: '15–22 min',
    tags: ['Fraude', 'Acceso', 'Gobernanza'],
    brief: 'Una empresa detecta pagos duplicados a un proveedor recién incorporado. La directora financiera afirma que el alta fue aprobada por compras; compras dice que recibió la documentación validada por finanzas. Los registros muestran accesos desde varias cuentas.',
    objective: 'Distinguir oportunidad, proceso organizacional y evidencia de participación individual.',
    interviewee: { name: 'Elena Ríos', role: 'Directora financiera', quote: 'Mi equipo procesa pagos aprobados. El alta del proveedor no depende solo de finanzas.' },
    evidence: [
      { id: 'invoice', title: 'Facturas duplicadas', kind: 'Financiera', detail: 'Dos facturas comparten importe y concepto, pero tienen números distintos.', clue: 'La duplicidad requiere revisar órdenes, entregas y trazabilidad de aprobación.' },
      { id: 'vendor', title: 'Alta del proveedor', kind: 'Sistema', detail: 'El proveedor fue creado desde una cuenta del área de compras; la validación bancaria figura a nombre de otra cuenta.', clue: 'Las cuentas registradas indican actividad de sistema, no por sí solas quién operó físicamente.' },
      { id: 'policy', title: 'Política de pagos', kind: 'Procedimiento', detail: 'La política exige aprobación dual, pero hay excepciones por cierre de mes.', clue: 'Una debilidad de control puede facilitar el fraude sin demostrar quién lo cometió.' }
    ],
    questions: [
      { prompt: '¿Qué preguntarías primero a la directora financiera?', options: [
        { text: '¿Quién autorizó el pago y qué registros documentan cada etapa?', score: 10, feedback: 'Pregunta concreta, verificable y centrada en el flujo de decisión.', principle: 'Trazabilidad' },
        { text: '¿Por qué permitió que su equipo robara dinero?', score: 0, feedback: 'Presupone delito y responsabilidad antes de revisar los hechos.', principle: 'Presunción y neutralidad' },
        { text: '¿Se considera una persona honesta?', score: 2, feedback: 'La autopercepción moral no permite reconstruir el proceso de aprobación.', principle: 'Preguntas relevantes' },
        { text: '¿Quién le cae mal dentro de la empresa?', score: 1, feedback: 'Puede introducir rumores y conflictos personales sin conexión probatoria.', principle: 'Evitar sesgo de confirmación' }
      ]},
      { prompt: '¿Qué evidencia priorizarías?', options: [
        { text: 'Correos, bitácoras, órdenes de compra, entregas y aprobaciones.', score: 10, feedback: 'La triangulación permite reconstruir el proceso y contrastar versiones.', principle: 'Triangulación documental' },
        { text: 'Solo la opinión del gerente general.', score: 1, feedback: 'La jerarquía no sustituye evidencia verificable.', principle: 'Independencia de fuentes' },
        { text: 'El historial personal de quien parece más nervioso.', score: 0, feedback: 'El nerviosismo y la impresión subjetiva no prueban conducta fraudulenta.', principle: 'Evitar estereotipos' },
        { text: 'La primera factura y cerrar el caso.', score: 2, feedback: 'Una pieza aislada no permite explicar la cadena completa de autorización.', principle: 'Suficiencia probatoria' }
      ]},
      { prompt: '¿Cómo describirías la hipótesis principal?', options: [
        { text: 'Hay indicios de una posible falla de control y pagos duplicados; falta atribuir responsabilidades con evidencia.', score: 10, feedback: 'Distingue el hecho financiero de la atribución individual y mantiene abiertas alternativas.', principle: 'Hipótesis verificable' },
        { text: 'La directora financiera es culpable porque ocupa el cargo.', score: 0, feedback: 'El cargo no demuestra participación ni conocimiento.', principle: 'No atribuir por jerarquía' },
        { text: 'Toda excepción de política es fraude.', score: 1, feedback: 'Una excepción puede ser irregular, autorizada o fraudulenta; necesita contexto.', principle: 'Diferenciar irregularidad y delito' },
        { text: 'No existe caso si no hay confesión.', score: 1, feedback: 'Los registros y evidencias independientes pueden sustentar la investigación.', principle: 'Evidencia independiente' }
      ]}
    ],
    scene: {
      title: 'Oficina financiera',
      description: 'Inspecciona puntos de control del proceso de pagos.',
      hotspots: [
        { id: 'terminal', label: 'Terminal de pagos', x: -2.2, y: 1.2, z: 0.1, color: '#66c4e8', detail: 'Las bitácoras deben contrastarse con permisos, horarios, MFA y evidencia de uso real.' },
        { id: 'cabinet', label: 'Archivo de facturas', x: 0, y: 1.1, z: -1.4, color: '#e9b66a', detail: 'Compara órdenes, entregas, números de factura y fechas; no asumas que duplicidad equivale a intención.' },
        { id: 'board', label: 'Matriz de aprobación', x: 2.2, y: 1.6, z: 0.3, color: '#a4d6a5', detail: 'La segregación de funciones y las excepciones pueden revelar fallas sistémicas.' },
        { id: 'meeting', label: 'Sala de reuniones', x: 0.2, y: 1.3, z: 2.0, color: '#c4a7ed', detail: 'Entrevista por separado a cada responsable y verifica quién tomó cada decisión.' }
      ]
    }
  },
  {
    id: 'social',
    number: '03',
    category: 'Criminología social',
    title: 'Ecos de la comunidad',
    subtitle: 'Una disputa vecinal escala y las versiones no coinciden.',
    location: 'Barrio Las Palmeras',
    icon: 'users',
    color: 'green',
    duration: '12–20 min',
    tags: ['Conflicto', 'Redes', 'Prevención'],
    brief: 'Después de varias amenazas y una agresión, vecinos señalan a un joven conocido por conflictos previos. La víctima menciona una discusión reciente; otros residentes hablan de tensiones por el uso de un espacio comunitario.',
    objective: 'Analizar el contexto, los vínculos y las fuentes sin convertir rumores o antecedentes en prueba del hecho actual.',
    interviewee: { name: 'Lucía Moreno', role: 'Residente y testigo', quote: 'Todo el mundo dice que fue él, pero yo no vi quién lanzó la primera piedra.' },
    evidence: [
      { id: 'chat', title: 'Mensajes vecinales', kind: 'Digital', detail: 'Un grupo contiene rumores y mensajes reenviados sin autor original verificable.', clue: 'La circulación de un rumor no confirma su contenido.' },
      { id: 'incident', title: 'Reporte de incidente', kind: 'Registro', detail: 'El reporte documenta daños y hora aproximada, pero no identifica al responsable.', clue: 'Separa la existencia del daño de la atribución de autoría.' },
      { id: 'map', title: 'Mapa de relaciones', kind: 'Contexto', detail: 'Hay conflictos previos entre varios grupos por horarios y acceso al espacio común.', clue: 'El contexto ayuda a formular preguntas, no a prejuzgar a los participantes.' }
    ],
    questions: [
      { prompt: '¿Cómo abordarías a la testigo?', options: [
        { text: 'Pídele que describa lo que vio y diferencie observación directa de lo que escuchó.', score: 10, feedback: 'Permite distinguir experiencia directa, inferencias y rumores.', principle: 'Calidad testimonial' },
        { text: 'Confirma que el joven conocido por conflictos fue el agresor.', score: 0, feedback: 'La pregunta es sugestiva y se apoya en reputación previa.', principle: 'Evitar sesgo de confirmación' },
        { text: 'Pregunta si los vecinos lo consideran peligroso.', score: 2, feedback: 'La opinión comunitaria no sustituye hechos observados.', principle: 'Evitar etiquetamiento' },
        { text: 'Descarta a todos los vecinos porque hay rumores.', score: 2, feedback: 'La información debe evaluarse por fuente y calidad, no descartarse en bloque.', principle: 'Evaluación crítica' }
      ]},
      { prompt: '¿Qué acción ayuda a comprender el conflicto?', options: [
        { text: 'Mapear relaciones, cronología y disputas concretas, contrastándolo con entrevistas individuales.', score: 10, feedback: 'Integra el contexto social sin convertirlo en prueba de culpabilidad.', principle: 'Análisis contextual' },
        { text: 'Asumir que el grupo con peor reputación inició la agresión.', score: 0, feedback: 'La reputación colectiva puede reforzar prejuicios y errores de atribución.', principle: 'Evitar estigmatización' },
        { text: 'Publicar los nombres de los sospechosos para que la comunidad opine.', score: 0, feedback: 'Puede poner en riesgo a personas y contaminar testimonios.', principle: 'Confidencialidad y protección' },
        { text: 'Elegir la versión más repetida.', score: 1, feedback: 'La repetición no equivale a corroboración independiente.', principle: 'Independencia de fuentes' }
      ]},
      { prompt: '¿Qué conclusión provisional es más responsable?', options: [
        { text: 'Existe un conflicto comunitario y un daño documentado; la autoría requiere evidencia adicional.', score: 10, feedback: 'Separa hechos confirmados de atribución pendiente y abre vías de prevención.', principle: 'Conclusión proporcional' },
        { text: 'La comunidad ya decidió quién fue, así que no hace falta investigar.', score: 0, feedback: 'La presión social no sustituye una investigación imparcial.', principle: 'Imparcialidad' },
        { text: 'Los antecedentes del joven prueban que actuó igual esta vez.', score: 0, feedback: 'El comportamiento pasado no prueba automáticamente un hecho nuevo.', principle: 'Evitar inferencia por antecedentes' },
        { text: 'El conflicto es solo personal y no tiene contexto social.', score: 3, feedback: 'La información sugiere que hay factores relacionales y comunitarios que explorar.', principle: 'Contexto multinivel' }
      ]}
    ],
    scene: {
      title: 'Plaza comunitaria',
      description: 'Explora el lugar del conflicto y separa observaciones directas de rumores.',
      hotspots: [
        { id: 'bench', label: 'Banco de la plaza', x: -2.2, y: 0.8, z: 0.2, color: '#66c4e8', detail: 'Identifica quién estuvo presente y qué pudo observar realmente desde aquí.' },
        { id: 'notice', label: 'Tablón vecinal', x: 0, y: 1.1, z: -1.4, color: '#e9b66a', detail: 'Los avisos muestran disputas por el espacio; revisa fechas y autoría antes de relacionarlos con la agresión.' },
        { id: 'path', label: 'Acceso lateral', x: 2.2, y: 0.9, z: 0.2, color: '#a4d6a5', detail: 'El recorrido puede ayudar a comprobar visibilidad y tiempos, pero no identifica por sí mismo a una persona.' },
        { id: 'camera', label: 'Cámara comunitaria', x: 0.1, y: 1.6, z: 2.0, color: '#c4a7ed', detail: 'Solicita el material original con protección de privacidad y verifica su integridad.' }
      ]
    }
  },
  {
    id: 'ecological',
    number: '04',
    category: 'Criminología ambiental',
    title: 'La huella del río',
    subtitle: 'Un vertido afecta un ecosistema y varias organizaciones se señalan entre sí.',
    location: 'Cuenca del río Esmeralda',
    icon: 'leaf',
    color: 'teal',
    duration: '15–22 min',
    tags: ['Daño ambiental', 'Cadena de custodia', 'Responsabilidad'],
    brief: 'Se detecta mortalidad de peces aguas abajo de una zona industrial. La empresa indica que cumplió sus controles; un contratista afirma que recibió instrucciones de acelerar una operación y los residentes describen cambios en el agua.',
    objective: 'Relacionar evidencia ambiental, oportunidad y procesos organizacionales sin atribuir intención sin sustento.',
    interviewee: { name: 'Tomás Ibarra', role: 'Supervisor de planta', quote: 'Nuestros controles estaban dentro de lo previsto. El muestreo se hizo después de que empezaran los comentarios en el barrio.' },
    evidence: [
      { id: 'sample', title: 'Muestras de agua', kind: 'Científica', detail: 'Dos muestras muestran parámetros anómalos; falta revisar ubicación, hora, laboratorio y cadena de custodia.', clue: 'La calidad del muestreo condiciona la interpretación.' },
      { id: 'log', title: 'Registro de operaciones', kind: 'Operacional', detail: 'Un registro presenta una interrupción de 47 minutos durante el turno nocturno.', clue: 'La interrupción requiere explicación técnica; no demuestra por sí sola un vertido ilícito.' },
      { id: 'community', title: 'Reportes de residentes', kind: 'Testimonial', detail: 'Varias personas describen olor y cambio de color, con horarios aproximados distintos.', clue: 'Puede aportar contexto temporal, pero requiere corroboración técnica.' }
    ],
    questions: [
      { prompt: '¿Qué explorarías con el supervisor?', options: [
        { text: 'Pídele que describa el proceso, los controles y la interrupción del registro minuto a minuto.', score: 10, feedback: 'Pregunta abierta y concreta que permite reconstruir la operación antes de confrontar datos.', principle: 'Reconstrucción del proceso' },
        { text: 'Dile que su empresa envenenó el río deliberadamente.', score: 0, feedback: 'La intención y autoría no se establecen con la información disponible.', principle: 'Evitar conclusiones anticipadas' },
        { text: 'Pregunta si parece una persona preocupada por el ambiente.', score: 1, feedback: 'La autoimagen no demuestra cumplimiento operacional.', principle: 'Evidencia conductual verificable' },
        { text: 'Acepta su explicación porque es supervisor.', score: 0, feedback: 'La posición jerárquica no elimina la necesidad de contrastar datos.', principle: 'Corroboración' }
      ]},
      { prompt: '¿Qué revisarías antes de interpretar las muestras?', options: [
        { text: 'Ubicación, hora, protocolo, conservación, laboratorio y cadena de custodia.', score: 10, feedback: 'La validez de la muestra y su trazabilidad son fundamentales para sostener inferencias.', principle: 'Integridad de evidencia científica' },
        { text: 'Solo el color del agua en una fotografía.', score: 1, feedback: 'Una imagen puede orientar, pero no sustituye un análisis validado.', principle: 'Límites de evidencia visual' },
        { text: 'El rumor más antiguo de la comunidad.', score: 1, feedback: 'La antigüedad de un rumor no valida su contenido.', principle: 'Calidad de fuentes' },
        { text: 'La declaración del contratista sin revisar registros.', score: 3, feedback: 'Su relato es relevante, pero debe contrastarse con datos independientes.', principle: 'Triangulación' }
      ]},
      { prompt: '¿Qué hipótesis provisional formularías?', options: [
        { text: 'Hay un evento ambiental anómalo que debe vincularse temporal y técnicamente con operaciones concretas.', score: 10, feedback: 'Formula una hipótesis comprobable y separa daño, fuente y responsabilidad.', principle: 'Hipótesis científica' },
        { text: 'La empresa es responsable porque está aguas arriba.', score: 2, feedback: 'La ubicación es relevante, pero no basta para atribuir el evento.', principle: 'Causalidad y atribución' },
        { text: 'El contratista es responsable porque lo dijo primero.', score: 0, feedback: 'Una declaración aislada no determina responsabilidad.', principle: 'Verificación independiente' },
        { text: 'No existe problema si la empresa afirma que cumplió.', score: 0, feedback: 'La afirmación debe contrastarse con mediciones y registros.', principle: 'Verificación de cumplimiento' }
      ]}
    ],
    scene: {
      title: 'Zona industrial junto al río',
      description: 'Inspecciona puntos de observación y decide qué debe documentarse.',
      hotspots: [
        { id: 'outfall', label: 'Canal de descarga', x: -2.3, y: 0.8, z: 0.2, color: '#66c4e8', detail: 'Documenta ubicación, hora, caudal y condiciones; toma muestras según protocolo autorizado.' },
        { id: 'lab', label: 'Kit de muestreo', x: 0, y: 1.0, z: -1.4, color: '#e9b66a', detail: 'Registra sellos, etiquetas, preservación y transferencias para mantener cadena de custodia.' },
        { id: 'control', label: 'Panel de operación', x: 2.2, y: 1.4, z: 0.2, color: '#a4d6a5', detail: 'Compara la interrupción del registro con mantenimiento, alarmas y otros sensores.' },
        { id: 'river', label: 'Punto aguas abajo', x: 0.1, y: 0.8, z: 2.0, color: '#c4a7ed', detail: 'Diseña un muestreo comparativo aguas arriba y abajo, documentando condiciones y tiempos.' }
      ]
    }
  }
];
