export const mbtiQuestions = [
  {
    id: 1,
    question: "Llegas a una escena del crimen caótica. ¿Cuál es tu primer instinto?",
    options: [
      { text: "Organizar al equipo, asignar tareas y establecer un perímetro claro.", type: 'J' },
      { text: "Caminar solo por la escena, observar el panorama general antes de tocar nada.", type: 'P' }
    ]
  },
  {
    id: 2,
    question: "Al analizar una prueba de ADN contradictoria, ¿en qué confías más?",
    options: [
      { text: "En los datos duros del laboratorio y la cadena de custodia.", type: 'S' },
      { text: "En tu intuición de que algo no encaja en la narrativa oficial.", type: 'N' }
    ]
  },
  {
    id: 3,
    question: "El principal sospechoso confiesa el crimen, pero notas vacíos lógicos en su versión. ¿Qué haces?",
    options: [
      { text: "Aceptas la confesión para cerrar el caso, ya tienes una admisión.", type: 'T' },
      { text: "Desconfías de la confesión y buscas la verdad objetiva, aunque sea incómoda.", type: 'F' }
    ]
  },
  {
    id: 4,
    question: "Después de una entrevista agotadora, ¿cómo prefieres procesar la información?",
    options: [
      { text: "Reunirte con el equipo para debatir teorías y escuchar otras perspectivas.", type: 'E' },
      { text: "Aislarte en tu oficina con los expedientes para pensar en silencio.", type: 'I' }
    ]
  },
  {
    id: 5,
    question: "¿Qué tipo de evidencia te da más satisfacción descubrir?",
    options: [
      { text: "Una huella dactilar o muestra de sangre que conecta físicamente al sospechoso.", type: 'S' },
      { text: "Una conexión psicológica entre el modus operandi de dos casos antiguos.", type: 'N' }
    ]
  },
  {
    id: 6,
    question: "Al escribir el informe final de un caso, ¿cómo lo estructuras?",
    options: [
      { text: "Con un orden cronológico estricto y todas las pruebas documentadas.", type: 'J' },
      { text: "Con un resumen de las hipótesis y las preguntas abiertas que quedan.", type: 'P' }
    ]
  },
  {
    id: 7,
    question: "Un superior te presiona para detener a un sospechoso, pero falta evidencia clave. ¿Qué haces?",
    options: [
      { text: "Le presentas los hechos lógicos de por qué la detención fallaría en juicio.", type: 'T' },
      { text: "Le explicas el impacto ético y humano de detener a un posible inocente.", type: 'F' }
    ]
  },
  {
    id: 8,
    question: "¿Cómo prefieres trabajar en una investigación larga?",
    options: [
      { text: "En una sala de guerra con pizarras, mapas y movimiento constante.", type: 'E' },
      { text: "En un laboratorio o archivo silencioso, con espacio para concentrarte.", type: 'I' }
    ]
  }
];

export function calculateMBTI(answers) {
  const counts = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
  answers.forEach(answer => { counts[answer] += 1; });
  return (counts.E >= counts.I ? 'E' : 'I') +
         (counts.S >= counts.N ? 'S' : 'N') +
         (counts.T >= counts.F ? 'T' : 'F') +
         (counts.J >= counts.P ? 'J' : 'P');
}

export function getMBTIProfile(type) {
  const profiles = {
    'INTJ': { title: "El Estratega Frío", desc: "Planificación a largo plazo, mente analítica y visión de patrones. Ideal para crímenes complejos y de perfilado.", color: "#00B4FF" },
    'INTP': { title: "El Analista de Datos", desc: "Busca la verdad lógica detrás de todo. Prefiere los laboratorios y la resolución de rompecabezas teóricos.", color: "#00B4FF" },
    'ENTJ': { title: "El Jefe de Gabinete", desc: "Líder nato, directo y eficiente. Toma decisiones rápidas y no le teme a la presión de cerrar un caso.", color: "#E61B2E" },
    'ENTP': { title: "El Provocador", desc: "Le encanta debatir y desafiar las teorías establecidas. Es el mejor haciendo entrevistas incisivas.", color: "#E61B2E" },
    'INFJ': { title: "El Perfilador Empático", desc: "Entiende las motivaciones humanas profundas. Su intuición sobre la psicología criminal es su mejor arma.", color: "#00B4FF" },
    'INFP': { title: "El Defensor del Inocente", desc: "Guiado por valores éticos. Busca la verdad por encima de las estadísticas, para evitar errores judiciales.", color: "#00B4FF" },
    'ENFJ': { title: "El Coordinador de Equipo", desc: "Excelente comunicador. Sabe sacar lo mejor de cada experto forense en una investigación.", color: "#E61B2E" },
    'ENFP': { title: "El Vinculador de Casos", desc: "Ve conexiones donde otros no ven nada. Su entusiasmo es contagioso, ideal para casos de personas desaparecidas.", color: "#E61B2E" },
    'ISTJ': { title: "El Custodio de Protocolos", desc: "Metódico, estricto con la cadena de custodia y detallista. Su informe nunca tiene fallas.", color: "#00B4FF" },
    'ISFJ': { title: "El Investigador Metódico", desc: "Cuidadoso y leal. Su lema es 'el diablo está en los detalles', y nunca deja un cabo suelto.", color: "#00B4FF" },
    'ESTJ': { title: "El Ejecutor Policial", desc: "Le gusta el orden jerárquico y la acción. Organiza operativos de campo con precisión militar.", color: "#E61B2E" },
    'ESFJ': { title: "El Enlace Comunitario", desc: "Sabe cómo obtener información de los testigos. Tiene un trato humano que abre puertas.", color: "#E61B2E" },
    'ISTP': { title: "El Artesano Forense", desc: "Hábil con las manos y con la tecnología. Podría ser el mejor criminalístico del equipo.", color: "#00B4FF" },
    'ISFP': { title: "El Observador Silencioso", desc: "Tranquilo pero atento. Ve la belleza o el horror en los detalles visuales de la escena.", color: "#00B4FF" },
    'ESTP': { title: "El Cazarrecompensas", desc: "Impulsivo, valiente y observador. Es el que se lanza a la persecución o toma la declaración inmediata.", color: "#E61B2E" },
    'ESFP': { title: "El Actor Infiltrado", desc: "Carismático y sociable. Perfecto para infiltraciones o para hacer hablar a un sospechoso en un bar.", color: "#E61B2E" }
  };
  return profiles[type] || { title: "Perfil en Desarrollo", desc: "Resultado no concluyente.", color: "#94A3B8" };
}
