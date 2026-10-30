export const personalityQuestions = [
  {
    "id": 1,
    "text": "Me resulta natural iniciar conversaciones con personas que acabo de conocer.",
    "trait": "E",
    "reverse": false
  },
  {
    "id": 2,
    "text": "Después de una actividad social intensa, suelo necesitar tiempo a solas para recuperar energía.",
    "trait": "E",
    "reverse": true
  },
  {
    "id": 3,
    "text": "Disfruto participar activamente cuando un grupo debe tomar decisiones.",
    "trait": "E",
    "reverse": false
  },
  {
    "id": 4,
    "text": "Procuro comprender cómo se sienten los demás antes de responder en un desacuerdo.",
    "trait": "A",
    "reverse": false
  },
  {
    "id": 5,
    "text": "Aunque tenga razón, me importa expresar mis críticas con tacto.",
    "trait": "A",
    "reverse": false
  },
  {
    "id": 6,
    "text": "Suelo ofrecer ayuda incluso cuando nadie me la ha pedido.",
    "trait": "A",
    "reverse": false
  },
  {
    "id": 7,
    "text": "Mantengo mis compromisos aunque la tarea haya perdido atractivo.",
    "trait": "C",
    "reverse": false
  },
  {
    "id": 8,
    "text": "Antes de empezar algo importante, organizo los pasos que voy a seguir.",
    "trait": "C",
    "reverse": false
  },
  {
    "id": 9,
    "text": "Me cuesta terminar tareas cuando no hay una fecha límite cercana.",
    "trait": "C",
    "reverse": true
  },
  {
    "id": 10,
    "text": "Me interesan las ideas abstractas y explorar distintas maneras de interpretar una situación.",
    "trait": "O",
    "reverse": false
  },
  {
    "id": 11,
    "text": "Disfruto probar métodos nuevos aunque los habituales ya funcionen razonablemente bien.",
    "trait": "O",
    "reverse": false
  },
  {
    "id": 12,
    "text": "Prefiero actividades conocidas antes que experiencias que cambien mucho mi rutina.",
    "trait": "O",
    "reverse": true
  },
  {
    "id": 13,
    "text": "Cuando surge un problema inesperado, puedo mantener la calma y pensar con claridad.",
    "trait": "N",
    "reverse": true
  },
  {
    "id": 14,
    "text": "Las preocupaciones suelen seguir dando vueltas en mi mente incluso después de resolver un problema.",
    "trait": "N",
    "reverse": false
  },
  {
    "id": 15,
    "text": "Ante la presión, mis emociones pueden influir bastante en mis decisiones.",
    "trait": "N",
    "reverse": false
  }
];

export const personalityTraits = {
  E: { name: 'Extraversión', low: 'Tiendes a ser reservado y a preferir interacciones selectivas o entornos tranquilos.', mid: 'Combinas la participación social con momentos de reserva según el contexto.', high: 'Tiendes a buscar interacción, actividad compartida y estímulo social.' },
  A: { name: 'Amabilidad y cooperación', low: 'Puedes priorizar la franqueza y la autonomía; conviene cuidar cómo impacta tu estilo en los demás.', mid: 'Sueles equilibrar cooperación y criterio propio.', high: 'Tiendes a mostrar consideración, confianza y disposición para cooperar.' },
  C: { name: 'Responsabilidad y organización', low: 'Puedes preferir la flexibilidad; los recordatorios y metas pequeñas pueden ayudarte a sostener tareas.', mid: 'Alternas planificación y adaptación según la importancia de la tarea.', high: 'Tiendes a ser constante, organizado y cuidadoso con tus compromisos.' },
  O: { name: 'Apertura a experiencias', low: 'Sueles valorar lo conocido, práctico y probado antes que la experimentación.', mid: 'Combinas métodos familiares con curiosidad por nuevas perspectivas.', high: 'Tiendes a explorar ideas, perspectivas y experiencias nuevas.' },
  N: { name: 'Sensibilidad al estrés', low: 'Tus respuestas sugieren mayor estabilidad emocional ante la presión cotidiana.', mid: 'Tu reacción al estrés puede variar según la situación y los recursos disponibles.', high: 'Puedes experimentar preocupación o reactividad emocional con mayor intensidad; desarrollar estrategias de regulación puede ser útil.' }
};

export function scorePersonality(answers) {
  const totals = { E: 0, A: 0, C: 0, O: 0, N: 0 };
  const counts = { E: 0, A: 0, C: 0, O: 0, N: 0 };
  personalityQuestions.forEach((q, index) => {
    const raw = Number(answers[index]);
    if (!Number.isFinite(raw)) return;
    totals[q.trait] += q.reverse ? 6 - raw : raw;
    counts[q.trait] += 1;
  });
  return Object.fromEntries(Object.keys(totals).map(key => {
    const average = counts[key] ? totals[key] / counts[key] : 3;
    const score = Math.round(((average - 1) / 4) * 100);
    const level = average < 2.5 ? 'low' : average < 3.6 ? 'mid' : 'high';
    return [key, { score, level, ...personalityTraits[key], description: personalityTraits[key][level] }];
  }));
}
