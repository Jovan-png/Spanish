import { useState, useEffect, useCallback } from "react";

// ─── DIFFICULTY LABELS ───
const DIFF_LABELS = { 1: "Principiante", 2: "Básico", 3: "Intermedio", 4: "Avanzado", 5: "Maestro" };
const DIFF_COLORS = { 1: "#7ab8e0", 2: "#7cb97c", 3: "#c9a957", 4: "#d4845a", 5: "#c97a9a" };
const getDiffForDay = (d) => d <= 6 ? 1 : d <= 12 ? 2 : d <= 18 ? 3 : d <= 24 ? 4 : 5;

const DEFAULT_DATA = {
  days: [
    {
      day: 1,
      title: "Los Cimientos",
      subtitle: "Building your foundation — core rules and patterns",
      difficulty: 1,
      sections: [
        {
          type: "lesson",
          category: "Por vs Para",
          icon: "⚡",
          description: "These two prepositions are one of the trickiest parts of Spanish. Today we learn the core rules that cover 90% of usage.",
          content: [
            { term: "POR — Duration", definition: "Use 'por' when talking about how long something lasts.", examples: ["Estudié por dos horas — I studied for two hours", "Viajamos por tres días — We traveled for three days"] },
            { term: "POR — Cause / Reason", definition: "Use 'por' to explain why something happened or to express gratitude.", examples: ["Gracias por tu ayuda — Thanks for your help", "Lo hice por ti — I did it because of you"] },
            { term: "POR — Movement through", definition: "Use 'por' when moving through, along, or around a place.", examples: ["Caminé por el parque — I walked through the park", "Viajé por toda Europa — I traveled through all of Europe"] },
            { term: "POR — Exchange", definition: "Use 'por' when trading, paying, or substituting one thing for another.", examples: ["Pagué $10 por el libro — I paid $10 for the book", "Cambié mi carro por uno nuevo — I traded my car for a new one"] },
            { term: "PARA — Purpose / Goal", definition: "Use 'para' to express what something is for, or why you do something.", examples: ["Estudio para aprender — I study in order to learn", "Es una taza para café — It's a cup for coffee"] },
            { term: "PARA — Destination", definition: "Use 'para' when heading toward a specific place.", examples: ["Salgo para Madrid — I'm leaving for Madrid", "El tren sale para Barcelona — The train leaves for Barcelona"] },
            { term: "PARA — Recipient", definition: "Use 'para' to say who something is for.", examples: ["Este regalo es para ti — This gift is for you", "Compré flores para mi madre — I bought flowers for my mother"] },
            { term: "PARA — Deadline", definition: "Use 'para' to express a due date or deadline.", examples: ["Necesito esto para el lunes — I need this by Monday", "El proyecto es para mañana — The project is due tomorrow"] }
          ],
          exercises: [
            { type: "fill", prompt: "Estudié español ___ dos horas anoche.", answer: "por", hint: "How long did you study?", description: "Fill in the correct preposition." },
            { type: "fill", prompt: "Este pastel es ___ tu cumpleaños.", answer: "para", hint: "Who or what is it for?", description: "Fill in the correct preposition." },
            { type: "fill", prompt: "Caminamos ___ la playa al atardecer.", answer: "por", hint: "You walked along/through a place.", description: "Fill in the correct preposition." },
            { type: "fill", prompt: "Necesito terminar el ensayo ___ el viernes.", answer: "para", hint: "There's a deadline.", description: "Fill in the correct preposition." },
            { type: "fill", prompt: "Gracias ___ invitarme a tu casa.", answer: "por", hint: "Expressing gratitude for something.", description: "Fill in the correct preposition." },
            { type: "fill", prompt: "Pagué veinte dólares ___ esta camisa.", answer: "por", hint: "You exchanged money.", description: "Fill in the correct preposition." },
            { type: "categorize", description: "Drag each sentence to the correct category: POR or PARA.", categories: ["POR", "PARA"], items: [
              { text: "Caminé ___ el bosque", correct: "POR" },
              { text: "Esto es ___ mi hermano", correct: "PARA" },
              { text: "Gracias ___ todo", correct: "POR" },
              { text: "Salimos ___ la playa", correct: "PARA" },
              { text: "Trabajé ___ cinco horas", correct: "POR" },
              { text: "Necesito esto ___ mañana", correct: "PARA" }
            ]},
            { type: "translate", prompt: "I walked through the park for two hours.", answer: "Caminé por el parque por dos horas.", accept: ["caminé por el parque por dos horas"], description: "Translate to Spanish — notice this sentence uses 'por' twice!" },
            { type: "translate", prompt: "This gift is for you.", answer: "Este regalo es para ti.", accept: ["este regalo es para ti"], description: "Translate to Spanish." }
          ]
        },
        {
          type: "lesson",
          category: "Pronombres Directos e Indirectos",
          icon: "🔗",
          description: "Object pronouns let you stop repeating nouns. Master these and your Spanish will sound much more natural.",
          content: [
            { term: "Direct Object Pronouns (DOPs)", definition: "These replace the thing or person directly receiving the action. Think: WHAT did you do? or WHO did you see?", examples: ["me (me) · te (you) · lo/la (him/her/it) · nos (us) · los/las (them)", "Yo como la manzana → Yo la como — I eat it", "¿Ves a Juan? → ¿Lo ves? — Do you see him?"] },
            { term: "Indirect Object Pronouns (IOPs)", definition: "These tell you TO WHOM or FOR WHOM the action is done. Think: to/for whom?", examples: ["me (to me) · te (to you) · le (to him/her) · nos (to us) · les (to them)", "Ella me da el libro — She gives the book to me", "Les escribo una carta — I write a letter to them"] },
            { term: "Double Pronoun Rule", definition: "When using both, the INDIRECT always comes first. Critical rule: LE/LES becomes SE when followed by LO/LA/LOS/LAS.", examples: ["Doy el libro a María → Se lo doy — I give it to her", "Mando las cartas a ellos → Se las mando — I send them to them", "Order: SE/ME/TE/NOS + LO/LA/LOS/LAS + verb"] }
          ],
          exercises: [
            { type: "fill", prompt: "Yo como la manzana → Yo ___ como.", answer: "la", hint: "La manzana is feminine singular.", description: "Replace the noun with the correct direct object pronoun." },
            { type: "fill", prompt: "Ella ___ da un regalo. (to me)", answer: "me", hint: "To me = indirect object.", description: "Fill in the indirect object pronoun." },
            { type: "fill", prompt: "¿Ves a los chicos? → ¿___ ves?", answer: "los", hint: "Los chicos = masculine plural.", description: "Replace with the correct DOP." },
            { type: "fill", prompt: "Doy el libro a ella → ___ ___ doy.", answer: "se lo", hint: "Le + lo = se lo.", description: "Use double pronouns. Remember the LE → SE rule!" },
            { type: "rewrite", prompt: "Rewrite replacing the underlined noun: 'Yo compro LAS FLORES para ella.'", answer: "Yo las compro para ella.", accept: ["yo las compro para ella"], description: "Replace the direct object with a pronoun." },
            { type: "rewrite", prompt: "Rewrite with double pronouns: 'Ella da EL REGALO A NOSOTROS.'", answer: "Ella nos lo da.", accept: ["ella nos lo da"], description: "Replace both objects with pronouns." },
            { type: "match", description: "Match each pronoun to what it replaces.", pairs: [["lo", "him / it (masc.)"], ["la", "her / it (fem.)"], ["les → se", "to them (before lo/la)"], ["me", "to me / me"], ["nos", "to us / us"]] },
            { type: "order", description: "Put these words in the correct order to form the sentence.", words: ["lo", "se", "doy", "Yo"], answer: "Yo se lo doy", accept: ["yo se lo doy"] }
          ]
        },
        {
          type: "lesson",
          category: "Pretérito vs Imperfecto",
          icon: "⏳",
          description: "Both tenses describe the past, but they paint very different pictures. The pretérito is a camera snapshot; the imperfecto is a video playing in the background.",
          content: [
            { term: "Pretérito = Snapshot", definition: "Completed actions. Something that started and ended. Specific moments, sequences of events, and interruptions.", examples: ["Ayer comí pizza — Yesterday I ate pizza (done)", "Llegó, se sentó y habló — He arrived, sat down, and spoke (sequence)", "De repente, sonó el teléfono — Suddenly, the phone rang (interruption)"] },
            { term: "Imperfecto = Background Video", definition: "Ongoing states, habitual actions, descriptions, time, age, weather, and feelings in the past.", examples: ["De niño jugaba mucho — As a child I used to play a lot (habitual)", "Eran las tres y llovía — It was three o'clock and it was raining (time + weather)", "Ella tenía quince años — She was fifteen years old (age)"] },
            { term: "Using Both Together", definition: "The imperfecto sets the scene (what was happening), and the pretérito interrupts it (what suddenly happened).", examples: ["Dormía cuando sonó el teléfono — I was sleeping when the phone rang", "Mientras caminaba, vi un gato — While I was walking, I saw a cat", "Era un día bonito y decidí salir — It was a nice day and I decided to go out"] }
          ],
          exercises: [
            { type: "fill", prompt: "Ayer ___ (comer, yo) una pizza entera.", answer: "comí", hint: "Completed action, specific day.", description: "Conjugate in pretérito or imperfecto." },
            { type: "fill", prompt: "Cuando era niño, ___ (jugar, yo) en el parque todos los días.", answer: "jugaba", hint: "Habitual action = background video.", description: "Conjugate in pretérito or imperfecto." },
            { type: "fill", prompt: "Mientras yo ___ (dormir), sonó el teléfono.", answer: "dormía", hint: "Ongoing background action interrupted.", description: "Conjugate in pretérito or imperfecto." },
            { type: "fill", prompt: "___ (ser) las tres de la tarde cuando llegamos.", answer: "eran", hint: "Telling time in the past = always imperfecto.", description: "Conjugate in pretérito or imperfecto." },
            { type: "fill", prompt: "De repente, ella ___ (gritar) muy fuerte.", answer: "gritó", hint: "Sudden action = snapshot.", description: "Conjugate in pretérito or imperfecto." },
            { type: "categorize", description: "Sort each phrase: does it trigger PRETÉRITO or IMPERFECTO?", categories: ["PRETÉRITO", "IMPERFECTO"], items: [
              { text: "Ayer...", correct: "PRETÉRITO" },
              { text: "Todos los días...", correct: "IMPERFECTO" },
              { text: "De repente...", correct: "PRETÉRITO" },
              { text: "Mientras...", correct: "IMPERFECTO" },
              { text: "Una vez...", correct: "PRETÉRITO" },
              { text: "De niño...", correct: "IMPERFECTO" },
              { text: "Siempre...", correct: "IMPERFECTO" }
            ]},
            { type: "translate", prompt: "I was reading when she arrived.", answer: "Yo leía cuando ella llegó.", accept: ["leía cuando ella llegó", "yo leía cuando ella llegó", "estaba leyendo cuando ella llegó"], description: "Use both tenses: background + interruption." }
          ]
        },
        {
          type: "lesson",
          category: "Subjuntivo Presente",
          icon: "🌀",
          description: "The subjunctive mood expresses wishes, doubts, emotions, and the unreal. If the indicative is 'what IS', the subjunctive is 'what MIGHT BE'.",
          content: [
            { term: "WEIRDO Triggers", definition: "Remember WEIRDO to know when to use subjunctive: Wishes, Emotions, Impersonal expressions, Recommendations, Doubt/Denial, Ojalá.", examples: ["Quiero que vengas — I want you to come (Wish)", "Me alegra que estés aquí — I'm glad you're here (Emotion)", "Es importante que estudies — It's important that you study (Impersonal)"] },
            { term: "Doubt & Denial", definition: "When you doubt, deny, or are unsure about something, the subjunctive follows.", examples: ["Dudo que sea verdad — I doubt it's true", "No creo que tenga razón — I don't think he's right", "No es cierto que llueva — It's not certain that it'll rain"] },
            { term: "Unknown Antecedents", definition: "When the thing or person you're describing doesn't exist yet or is unknown, use subjunctive in the relative clause.", examples: ["Busco un libro que tenga fotos — I'm looking for a book that has photos (haven't found it yet)", "No hay nadie que sepa — There's nobody who knows (nonexistent)", "¿Hay alguien que pueda ayudar? — Is there someone who can help? (unknown)"] }
          ],
          exercises: [
            { type: "fill", prompt: "Quiero que tú ___ (venir) a mi fiesta.", answer: "vengas", hint: "Wish → subjunctive of venir (tú).", description: "Conjugate in the present subjunctive." },
            { type: "fill", prompt: "Es importante que nosotros ___ (estudiar) cada día.", answer: "estudiemos", hint: "Impersonal expression → subjunctive.", description: "Conjugate in the present subjunctive." },
            { type: "fill", prompt: "Dudo que él ___ (tener) razón.", answer: "tenga", hint: "Doubt → subjunctive of tener.", description: "Conjugate in the present subjunctive." },
            { type: "fill", prompt: "Busco un apartamento que ___ (ser) barato y grande.", answer: "sea", hint: "Unknown antecedent — you haven't found it yet.", description: "Conjugate in the present subjunctive." },
            { type: "fill", prompt: "No hay nadie que ___ (saber) la respuesta.", answer: "sepa", hint: "Nonexistent person → subjunctive of saber.", description: "Conjugate in the present subjunctive." },
            { type: "fill", prompt: "¿Hay algún empleado que ___ (poder) ayudarme?", answer: "pueda", hint: "Unknown person → subjunctive of poder.", description: "Conjugate in the present subjunctive." },
            { type: "categorize", description: "Does each sentence need SUBJUNTIVO or INDICATIVO?", categories: ["SUBJUNTIVO", "INDICATIVO"], items: [
              { text: "Quiero que tú...", correct: "SUBJUNTIVO" },
              { text: "Sé que ella...", correct: "INDICATIVO" },
              { text: "Dudo que...", correct: "SUBJUNTIVO" },
              { text: "Es verdad que...", correct: "INDICATIVO" },
              { text: "Ojalá que...", correct: "SUBJUNTIVO" },
              { text: "Busco algo que...", correct: "SUBJUNTIVO" }
            ]},
            { type: "translate", prompt: "I doubt it's true.", answer: "Dudo que sea verdad.", accept: ["dudo que sea verdad"], description: "Translate — remember: doubt triggers subjunctive." }
          ]
        },
        {
          type: "lesson",
          category: "Pronombres Relativos",
          icon: "🔀",
          description: "Relative pronouns connect ideas within sentences. Getting these right makes your Spanish flow beautifully instead of sounding choppy.",
          content: [
            { term: "que", definition: "The most common relative pronoun. Means 'that', 'which', or 'who'. Works for both people and things.", examples: ["El libro que leo es bueno — The book that I'm reading is good", "La chica que vino es mi amiga — The girl who came is my friend"] },
            { term: "el/la/los/las que", definition: "Means 'the one(s) that'. Used after prepositions, or to specify which one from a group.", examples: ["La película de la que hablo — The movie I'm talking about", "Los que estudian aprenden — Those who study, learn", "El restaurante en el que comimos — The restaurant in which we ate"] },
            { term: "lo que", definition: "Means 'what' or 'that which'. Refers to abstract ideas, not specific nouns.", examples: ["Lo que dices es verdad — What you say is true", "No entiendo lo que quieres — I don't understand what you want", "Haz lo que puedas — Do what you can"] },
            { term: "en que", definition: "Means 'in which'. A shortcut for 'en el/la cual'.", examples: ["El momento en que llegaste — The moment in which you arrived", "La casa en que vivo — The house in which I live"] }
          ],
          exercises: [
            { type: "fill", prompt: "El libro ___ leo es muy interesante.", answer: "que", hint: "Most basic relative pronoun.", description: "Fill in the relative pronoun." },
            { type: "fill", prompt: "No entiendo ___ ___ dices.", answer: "lo que", hint: "Abstract idea — 'what' or 'that which'.", description: "Fill in the relative pronoun (two words)." },
            { type: "fill", prompt: "La casa en ___ vivo es muy vieja.", answer: "que", hint: "'in which'", description: "Fill in the relative pronoun." },
            { type: "fill", prompt: "La película de ___ ___ hablo es increíble.", answer: "la que", hint: "After preposition 'de', feminine noun.", description: "Fill in the relative pronoun (two words)." },
            { type: "fill", prompt: "___ ___ trabajan mucho ganan más dinero.", answer: "los que", hint: "'Those who' — masculine plural.", description: "Fill in the relative pronoun (two words)." },
            { type: "match", description: "Match each relative pronoun to its meaning.", pairs: [["que", "that / which / who"], ["lo que", "what (abstract)"], ["la que", "the one (fem.) that"], ["en que", "in which"], ["los que", "those (masc.) who"]] },
            { type: "translate", prompt: "What you say is true.", answer: "Lo que dices es verdad.", accept: ["lo que dices es verdad", "lo que tú dices es verdad"], description: "Translate — which relative pronoun refers to an abstract idea?" },
            { type: "translate", prompt: "The house in which I live is old.", answer: "La casa en que vivo es vieja.", accept: ["la casa en que vivo es vieja", "la casa en la que vivo es vieja"], description: "Translate to Spanish." }
          ]
        },
        {
          type: "lesson",
          category: "Indefinidos y Negativos",
          icon: "🎯",
          description: "Words like 'someone', 'nothing', 'any' — these small words are critical for expressing quantities and existence in Spanish.",
          content: [
            { term: "algún / alguno(a)", definition: "Means 'some' or 'any'. Important: before a masculine singular noun, use 'algún' (shortened form).", examples: ["¿Hay algún problema? — Is there any problem?", "¿Tienes alguna idea? — Do you have any idea?"] },
            { term: "algunos / algunas", definition: "Means 'some' (plural). Used for more than one.", examples: ["Algunos estudiantes aprobaron — Some students passed", "Tengo algunas preguntas — I have some questions"] },
            { term: "alguien vs algo", definition: "Alguien = someone (PERSON). Algo = something (THING). Never mix them up!", examples: ["¿Hay alguien aquí? — Is there someone here? (person)", "¿Quieres algo de beber? — Do you want something to drink? (thing)"] },
            { term: "nadie vs nada", definition: "Nadie = nobody (PERSON). Nada = nothing (THING). The negative mirrors of alguien/algo.", examples: ["No hay nadie aquí — There's nobody here", "No quiero nada — I don't want anything"] },
            { term: "ningún / ninguno(a)", definition: "Means 'none' or 'not any'. Like algún, it shortens before masculine singular nouns.", examples: ["No tengo ningún libro — I don't have any book", "Ninguno de ellos vino — None of them came"] }
          ],
          exercises: [
            { type: "fill", prompt: "Los vegetarianos necesitan ___ alimento que tenga mucha proteína.", answer: "algún", hint: "Before masculine singular noun = shortened form.", description: "Choose the correct indefinite word." },
            { type: "fill", prompt: "¿Hay ___ en la oficina? Necesito hablar con una persona.", answer: "alguien", hint: "You're looking for a person.", description: "Choose: alguien, algo, nadie, or nada." },
            { type: "fill", prompt: "No quiero ___ . Estoy satisfecho.", answer: "nada", hint: "No thing.", description: "Choose the correct negative word." },
            { type: "fill", prompt: "No hay ___ aquí que hable japonés.", answer: "nadie", hint: "No person.", description: "Choose the correct negative word." },
            { type: "fill", prompt: "¿Quieres ___ de comer? Tengo fruta.", answer: "algo", hint: "Some thing to eat.", description: "Choose: alguien, algo, nadie, or nada." },
            { type: "categorize", description: "Sort: does each word refer to a PERSON or a THING?", categories: ["PERSONA", "COSA"], items: [
              { text: "alguien", correct: "PERSONA" },
              { text: "algo", correct: "COSA" },
              { text: "nadie", correct: "PERSONA" },
              { text: "nada", correct: "COSA" },
              { text: "ninguno", correct: "PERSONA" },
              { text: "algún", correct: "COSA" }
            ]},
            { type: "match", description: "Match each word with its opposite.", pairs: [["alguien", "nadie"], ["algo", "nada"], ["algún", "ningún"], ["algunos", "ningunos"], ["siempre", "nunca"]] }
          ]
        },
        {
          type: "vocab",
          category: "Vocabulario del Día",
          icon: "📚",
          description: "Today's words focus on travel and airport situations — common contexts where you'll use all the grammar from this lesson.",
          words: [
            { spanish: "el alimento", english: "food / nourishment", sentence: "Los vegetarianos necesitan algún alimento con proteína.", note: "More formal than 'comida'" },
            { spanish: "el empleado / la empleada", english: "employee", sentence: "El empleado del aeropuerto nos ayudó con el equipaje.", note: "Changes gender: empleado/empleada" },
            { spanish: "el equipaje", english: "luggage / baggage", sentence: "¿Dónde puedo recoger el equipaje?", note: "Always singular in Spanish (no 'equipajes')" },
            { spanish: "recoger", english: "to pick up / collect", sentence: "Recogí mi maleta en la terminal.", note: "Irregular yo: recojo" },
            { spanish: "el vuelo", english: "flight", sentence: "Mi vuelo sale a las ocho de la mañana.", note: "From 'volar' (to fly)" },
            { spanish: "la demora", english: "delay", sentence: "Hay una demora de dos horas por la tormenta.", note: "Also: el retraso" },
            { spanish: "aterrizar", english: "to land (plane)", sentence: "El avión aterrizó sin problemas.", note: "Opposite: despegar (to take off)" },
            { spanish: "la puerta de embarque", english: "boarding gate", sentence: "La puerta de embarque es la número doce.", note: "Embarque = boarding" }
          ],
          exercises: [
            { type: "fill", prompt: "¿Dónde puedo ___ mi equipaje? (to pick up)", answer: "recoger", hint: "Infinitive form: to collect.", description: "Fill in the vocabulary word." },
            { type: "fill", prompt: "El avión va a ___ en diez minutos.", answer: "aterrizar", hint: "The plane is going to...land.", description: "Fill in the vocabulary word." },
            { type: "fill", prompt: "Hay una ___ de tres horas en mi vuelo.", answer: "demora", hint: "A delay.", description: "Fill in the vocabulary word." },
            { type: "match", description: "Match the Spanish word with its English meaning.", pairs: [["el vuelo", "flight"], ["recoger", "to pick up"], ["aterrizar", "to land"], ["la demora", "delay"], ["el equipaje", "luggage"]] },
            { type: "translate", prompt: "My flight leaves at eight in the morning.", answer: "Mi vuelo sale a las ocho de la mañana.", accept: ["mi vuelo sale a las ocho de la mañana"], description: "Translate using today's vocabulary." },
            { type: "translate", prompt: "Is there an employee who can help me?", answer: "¿Hay algún empleado que pueda ayudarme?", accept: ["hay algún empleado que pueda ayudarme", "¿hay algún empleado que pueda ayudarme?"], description: "This combines vocabulary + subjunctive + indefinites!" }
          ]
        },
        {
          type: "quiz",
          category: "Prueba Final — Día 1",
          icon: "🏆",
          description: "Time to prove what you've learned! You need 70% to unlock Day 2. Take your time — review the explanations after submitting.",
          questions: [
            { q: "Estudié español ___ dos horas.", options: ["por", "para"], answer: 0, explanation: "Duration of time → por. 'For how long?' = por." },
            { q: "Este regalo es ___ ti.", options: ["por", "para"], answer: 1, explanation: "Recipient → para. 'For whom?' = para." },
            { q: "Caminamos ___ el parque toda la tarde.", options: ["por", "para"], answer: 0, explanation: "Movement through a place → por." },
            { q: "Necesito el informe ___ el viernes.", options: ["por", "para"], answer: 1, explanation: "Deadline → para." },
            { q: "Yo como la manzana → Yo ___ como.", options: ["le", "la", "lo", "se"], answer: 1, explanation: "La manzana (feminine) → DOP 'la'." },
            { q: "Doy el libro a María → ___ ___ doy.", options: ["Le lo", "Se lo", "La lo", "Me lo"], answer: 1, explanation: "Le + lo → Se lo. Remember: LE always becomes SE before LO/LA." },
            { q: "Cuando era niño, ___ (jugar) todos los días.", options: ["jugué", "jugaba", "jugó", "juegue"], answer: 1, explanation: "Habitual past action → imperfecto: jugaba." },
            { q: "Ayer ___ (llegar, yo) tarde a clase.", options: ["llegaba", "llegué", "llego", "llegaré"], answer: 1, explanation: "Completed action at a specific time → pretérito: llegué." },
            { q: "Mientras yo dormía, ___ (sonar) el teléfono.", options: ["sonaba", "sonó", "suena", "suene"], answer: 1, explanation: "Interruption of an ongoing action → pretérito: sonó." },
            { q: "Quiero que tú ___ (venir) a mi casa.", options: ["vienes", "vengas", "viniste", "vas"], answer: 1, explanation: "Wish (quiero que) → subjuntivo: vengas." },
            { q: "Busco un libro que ___ (tener) fotos.", options: ["tiene", "tenga", "tuvo", "tenía"], answer: 1, explanation: "Unknown/desired thing → subjuntivo: tenga." },
            { q: "No entiendo ___ dices.", options: ["que", "el que", "lo que", "la que"], answer: 2, explanation: "Abstract idea ('what you say') → lo que." },
            { q: "La casa en ___ vivo es vieja.", options: ["que", "la que", "lo que", "cual"], answer: 0, explanation: "'in which' → en que." },
            { q: "No hay ___ que sepa la respuesta.", options: ["alguien", "nadie", "nada", "algo"], answer: 1, explanation: "Nobody (negative, person) → nadie." },
            { q: "Los vegetarianos necesitan ___ alimento con proteína.", options: ["algún", "algunos", "nada", "alguien"], answer: 0, explanation: "Before singular masculine noun → algún." },
            { q: "El avión va a ___ en diez minutos.", options: ["despegar", "aterrizar", "recoger", "demorar"], answer: 1, explanation: "To land → aterrizar." }
          ]
        }
      ]
    }
  ]
};

const IMPORT_FORMAT = `{
  "days": [
    {
      "day": 2,
      "title": "Short Evocative Title",
      "subtitle": "One-line description of the day's focus",
      "difficulty": 1,
      "sections": [
        {
          "type": "lesson",
          "category": "Topic Name",
          "icon": "⚡",
          "description": "2-3 sentence overview explaining what this section covers and why it matters.",
          "content": [
            { "term": "Concept", "definition": "Clear explanation with context.", "examples": ["Spanish — English translation"] }
          ],
          "exercises": [
            { "type": "fill", "prompt": "Sentence with ___.", "answer": "word", "hint": "Contextual hint.", "description": "Brief instruction." },
            { "type": "translate", "prompt": "English sentence.", "answer": "Spanish sentence.", "accept": ["lowercase alts"], "description": "Instruction." },
            { "type": "rewrite", "prompt": "Rewrite: 'sentence' replacing X.", "answer": "Result.", "accept": ["alts"], "description": "Instruction." },
            { "type": "match", "description": "Match instruction.", "pairs": [["term", "definition"]] },
            { "type": "categorize", "description": "Sort instruction.", "categories": ["Cat A", "Cat B"], "items": [{ "text": "item", "correct": "Cat A" }] },
            { "type": "order", "description": "Arrange instruction.", "words": ["word1", "word2"], "answer": "word1 word2", "accept": ["alt"] }
          ]
        },
        {
          "type": "vocab",
          "category": "Vocabulario del Día",
          "icon": "📚",
          "description": "Theme description.",
          "words": [
            { "spanish": "la palabra", "english": "the word", "sentence": "Example.", "note": "Extra context." }
          ],
          "exercises": [...]
        },
        {
          "type": "quiz",
          "category": "Prueba Final — Día N",
          "icon": "🏆",
          "description": "Quiz description.",
          "questions": [
            { "q": "Question with ___.", "options": ["A","B","C","D"], "answer": 0, "explanation": "Detailed explanation." }
          ]
        }
      ]
    }
  ]
}`;

const PROMPT_TEMPLATE = `You are generating Day [N] of a 30-day Spanish mastery program. The difficulty is [LEVEL] (1=Principiante, 2=Básico, 3=Intermedio, 4=Avanzado, 5=Maestro).

Generate EXACT JSON for one day with ALL these sections. Each section MUST have a "description" field (2-3 sentences explaining what the student will learn and why it matters):

1. "Por vs Para" (icon: "⚡") — lesson + 8-10 exercises. Mix: fill, categorize, translate
2. "Pronombres Directos e Indirectos" (icon: "🔗") — lesson + 8 exercises. Mix: fill, rewrite, match, order
3. "Pretérito vs Imperfecto" (icon: "⏳") — lesson + 8 exercises. Mix: fill, categorize, translate
4. "Subjuntivo Presente" (icon: "🌀") — lesson + 8 exercises. Mix: fill, categorize, translate
5. "Pronombres Relativos" (icon: "🔀") — lesson + 8 exercises. Mix: fill, match, translate
6. "Indefinidos y Negativos" (icon: "🎯") — lesson + 7 exercises. Mix: fill, categorize, match
7. "Vocabulario del Día" (icon: "📚") — vocab type, 8 words with note field + 6 exercises. Mix: fill, match, translate
8. "Prueba Final — Día [N]" (icon: "🏆") — quiz, 16 questions covering ALL topics

EXERCISE TYPES (vary these — don't just use fill!):
- fill: { "type":"fill", "prompt":"___", "answer":"x", "hint":"h", "description":"instruction" }
- translate: { "type":"translate", "prompt":"English", "answer":"Spanish", "accept":["alts"], "description":"d" }
- rewrite: { "type":"rewrite", "prompt":"instruction", "answer":"result", "accept":["alts"], "description":"d" }
- match: { "type":"match", "description":"instruction", "pairs":[["a","b"]] }
- categorize: { "type":"categorize", "description":"instruction", "categories":["A","B"], "items":[{"text":"x","correct":"A"}] }
- order: { "type":"order", "description":"instruction", "words":["a","b"], "answer":"a b", "accept":["alt"] }

CRITICAL: Increase complexity from prior days. Day 1 was basic rules. By Day [N], use trickier contexts, exceptions, and combinations. Return ONLY valid JSON.`;

// ─── STYLES ───
const gold = "#d4a853";
const bg = "#141210";
const card = "#1c1a16";
const border = "#2a2622";
const textPrimary = "#ede4d4";
const textSecondary = "#9a9080";
const textDim = "#6a6258";
const green = "#6dba6d";
const red = "#cf6b6b";
const greenBg = "#1a2e1a";
const redBg = "#2e1a1a";
const font = `'Source Serif 4', 'Georgia', serif`;
const mono = `'IBM Plex Mono', monospace`;
const display = `'Fraunces', serif`;

export default function App() {
  const [data, setData] = useState(null);
  const [prog, setProg] = useState(null);
  const [secIdx, setSecIdx] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importText, setImportText] = useState("");
  const [importErr, setImportErr] = useState("");
  const [showFmt, setShowFmt] = useState(false);
  const [flipped, setFlipped] = useState({});
  const [viewDay, setViewDay] = useState(null);
  const [loading, setLoading] = useState(true);
  const [exState, setExState] = useState({});
  const [matchSt, setMatchSt] = useState({});
  const [catState, setCatState] = useState({});
  const [orderState, setOrderState] = useState({});
  const [showEx, setShowEx] = useState({});

  useEffect(() => {
    (async () => {
      try {
        const d = await window.storage.get("es_data_v3");
        const p = await window.storage.get("es_prog_v3");
        setData(d?.value ? JSON.parse(d.value) : DEFAULT_DATA);
        setProg(p?.value ? JSON.parse(p.value) : { currentDay: 1, completed: [], quizScores: {} });
        if (!d?.value) await window.storage.set("es_data_v3", JSON.stringify(DEFAULT_DATA));
        if (!p?.value) await window.storage.set("es_prog_v3", JSON.stringify({ currentDay: 1, completed: [], quizScores: {} }));
      } catch { setData(DEFAULT_DATA); setProg({ currentDay: 1, completed: [], quizScores: {} }); }
      setLoading(false);
    })();
  }, []);

  const save = useCallback(async (d) => { setData(d); try { await window.storage.set("es_data_v3", JSON.stringify(d)); } catch {} }, []);
  const saveProg = useCallback(async (p) => { setProg(p); try { await window.storage.set("es_prog_v3", JSON.stringify(p)); } catch {} }, []);

  const doImport = useCallback(async () => {
    setImportErr("");
    try {
      const p = JSON.parse(importText);
      if (!p.days?.length) { setImportErr("Needs a 'days' array."); return; }
      const m = { ...data }; const ex = new Set(m.days.map(d => d.day)); let a = 0, u = 0;
      for (const nd of p.days) { if (ex.has(nd.day)) { m.days = m.days.map(d => d.day === nd.day ? nd : d); u++; } else { m.days.push(nd); a++; } }
      m.days.sort((x, y) => x.day - y.day); await save(m);
      setImportText(""); setShowImport(false); alert(`✅ ${a} added, ${u} updated.`);
    } catch (e) { setImportErr("Invalid JSON: " + e.message); }
  }, [importText, data, save]);

  // ─── Exercise helpers ───
  const gEx = (s, e) => exState[s]?.[e] || { value: "", submitted: false, correct: false };
  const sExVal = (s, e, v) => setExState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...(p[s]?.[e] || {}), value: v, submitted: false } } }));
  const subEx = (s, e, ans, alts) => {
    const v = (exState[s]?.[e]?.value || "").trim().toLowerCase().replace(/[¿¡?.!,]/g, "");
    const a = ans.toLowerCase().trim().replace(/[¿¡?.!,]/g, "");
    const al = (alts || []).map(x => x.toLowerCase().trim().replace(/[¿¡?.!,]/g, ""));
    const ok = v === a || al.includes(v);
    setExState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...p[s]?.[e], submitted: true, correct: ok } } }));
  };

  // Match
  const gMatch = (s, e) => matchSt[s]?.[e] || { sel: null, done: {}, wrong: null, shuf: null };
  const initMatch = (s, e, pairs) => {
    const m = gMatch(s, e);
    if (m.shuf) return m;
    const r = pairs.map((p, i) => ({ t: p[1], i }));
    for (let i = r.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
    const nm = { sel: null, done: {}, wrong: null, shuf: r };
    setMatchSt(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: nm } })); return nm;
  };
  const clickLeft = (s, e, i) => setMatchSt(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...p[s]?.[e], sel: i, wrong: null } } }));
  const clickRight = (s, e, ri) => {
    const m = gMatch(s, e); if (m.sel === null) return;
    if (m.sel === ri) {
      setMatchSt(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...m, done: { ...m.done, [m.sel]: true }, sel: null } } }));
    } else {
      setMatchSt(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...m, wrong: ri, sel: null } } }));
      setTimeout(() => setMatchSt(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...p[s]?.[e], wrong: null } } })), 700);
    }
  };

  // Categorize
  const gCat = (s, e) => catState[s]?.[e] || { answers: {}, wrong: null };
  const catAnswer = (s, e, itemIdx, cat, correctCat) => {
    const ok = cat === correctCat;
    if (ok) {
      setCatState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...gCat(s, e), answers: { ...gCat(s, e).answers, [itemIdx]: cat } } } }));
    } else {
      setCatState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...gCat(s, e), wrong: itemIdx } } }));
      setTimeout(() => setCatState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...p[s]?.[e], wrong: null } } })), 700);
    }
  };

  // Order
  const gOrd = (s, e) => orderState[s]?.[e] || { value: "", submitted: false, correct: false };
  const sOrdVal = (s, e, v) => setOrderState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { value: v, submitted: false } } }));
  const subOrd = (s, e, ans, alts) => {
    const v = (orderState[s]?.[e]?.value || "").trim().toLowerCase();
    const a = ans.toLowerCase().trim();
    const al = (alts || []).map(x => x.toLowerCase().trim());
    const ok = v === a || al.includes(v);
    setOrderState(p => ({ ...p, [s]: { ...(p[s] || {}), [e]: { ...p[s]?.[e], submitted: true, correct: ok } } }));
  };

  // Quiz
  const startQ = (i) => { setQuiz({ ans: {}, sub: false }); setSecIdx(i); };
  const ansQ = (q, o) => { if (quiz?.sub) return; setQuiz(p => ({ ...p, ans: { ...p.ans, [q]: o } })); };
  const subQuiz = useCallback(async (qs) => {
    if (!quiz) return;
    const c = qs.filter((q, i) => quiz.ans[i] === q.answer).length;
    const sc = Math.round((c / qs.length) * 100);
    const dn = viewDay || prog.currentDay;
    setQuiz(p => ({ ...p, sub: true }));
    const np = { ...prog, quizScores: { ...prog.quizScores, [dn]: Math.max(sc, prog.quizScores[dn] || 0) } };
    if (sc >= 70 && !prog.completed.includes(dn)) {
      np.completed = [...prog.completed, dn];
      if (dn === prog.currentDay && data.days.find(d => d.day === dn + 1)) np.currentDay = dn + 1;
    }
    await saveProg(np);
  }, [quiz, prog, viewDay, data, saveProg]);

  const resetDay = useCallback(async () => {
    const dn = viewDay || prog.currentDay;
    const np = { ...prog, completed: prog.completed.filter(d => d !== dn), quizScores: { ...prog.quizScores } };
    delete np.quizScores[dn]; if (dn < prog.currentDay) np.currentDay = dn;
    await saveProg(np); setQuiz(null); setSecIdx(0); setFlipped({}); setExState({}); setMatchSt({}); setCatState({}); setOrderState({}); setShowEx({});
  }, [prog, viewDay, saveProg]);

  const resetAll = useCallback(async () => {
    if (!confirm("⚠️ Erase ALL progress and imported content?")) return;
    await save(DEFAULT_DATA); await saveProg({ currentDay: 1, completed: [], quizScores: {} });
    setSecIdx(0); setQuiz(null); setViewDay(null); setFlipped({}); setExState({}); setMatchSt({}); setCatState({}); setOrderState({}); setShowEx({});
  }, [save, saveProg]);

  if (loading || !data || !prog) return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: bg, color: textPrimary, fontFamily: font }}>
      <div style={{ textAlign: "center", opacity: 0.7 }}><div style={{ fontSize: 40, marginBottom: 12 }}>📖</div><div style={{ fontSize: 16, letterSpacing: 3, fontFamily: mono }}>Cargando...</div></div>
    </div>
  );

  const aDN = viewDay || prog.currentDay;
  const aDay = data.days.find(d => d.day === aDN);
  const done = prog.completed.includes(aDN);
  const canGo = (n) => n <= prog.currentDay || prog.completed.includes(n);
  const diff = aDay ? (aDay.difficulty || getDiffForDay(aDay.day)) : 1;
  const masteryPct = Math.round((prog.completed.length / 30) * 100);

  // Exercise renderer
  const renderEx = (ex, ei, si) => {
    const k = `${aDN}-${si}-${ei}`;

    // ── MATCH ──
    if (ex.type === "match") {
      const ms = initMatch(si, ei, ex.pairs);
      const s = gMatch(si, ei);
      const sh = s.shuf || ms.shuf || [];
      const allDone = Object.keys(s.done).length === ex.pairs.length;
      return (
        <div key={k} style={{ background: card, border: `1px solid ${allDone ? "#3a5a3a" : border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontFamily: mono, color: gold, marginBottom: 4, letterSpacing: 1 }}>EMPAREJAR</div>
          <div style={{ fontSize: 14, color: textSecondary, marginBottom: 14, lineHeight: 1.6 }}>{ex.description}</div>
          {allDone && <div style={{ color: green, fontSize: 14, marginBottom: 10, fontWeight: 600 }}>✓ ¡Perfecto!</div>}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {ex.pairs.map((p, i) => (
                <div key={i} onClick={() => !s.done[i] && clickLeft(si, ei, i)} style={{
                  padding: "10px 14px", borderRadius: 8, fontSize: 15, cursor: s.done[i] ? "default" : "pointer", lineHeight: 1.5,
                  background: s.done[i] ? greenBg : s.sel === i ? "#252218" : "#1a1816",
                  border: `1px solid ${s.done[i] ? "#3a6a3a" : s.sel === i ? gold : border}`,
                  color: s.done[i] ? green : s.sel === i ? gold : textPrimary, opacity: s.done[i] ? 0.6 : 1, transition: "all 0.2s"
                }}>{p[0]}</div>
              ))}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {sh.map((item, i) => (
                <div key={i} onClick={() => !s.done[item.i] && clickRight(si, ei, item.i)} style={{
                  padding: "10px 14px", borderRadius: 8, fontSize: 14, cursor: s.done[item.i] ? "default" : "pointer", lineHeight: 1.5,
                  background: s.done[item.i] ? greenBg : s.wrong === item.i ? redBg : "#1a1816",
                  border: `1px solid ${s.done[item.i] ? "#3a6a3a" : s.wrong === item.i ? "#6a3a3a" : border}`,
                  color: s.done[item.i] ? green : s.wrong === item.i ? red : textSecondary, opacity: s.done[item.i] ? 0.6 : 1, transition: "all 0.2s"
                }}>{item.t}</div>
              ))}
            </div>
          </div>
        </div>
      );
    }

    // ── CATEGORIZE ──
    if (ex.type === "categorize") {
      const cs = gCat(si, ei);
      const allSorted = Object.keys(cs.answers).length === ex.items.length;
      return (
        <div key={k} style={{ background: card, border: `1px solid ${allDone ? "#3a5a3a" : border}`, borderRadius: 12, padding: 20, marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontFamily: mono, color: "#7ab8e0", marginBottom: 4, letterSpacing: 1 }}>CLASIFICAR</div>
          <div style={{ fontSize: 14, color: textSecondary, marginBottom: 14, lineHeight: 1.6 }}>{ex.description}</div>
          {allSorted && <div style={{ color: green, fontSize: 14, marginBottom: 10, fontWeight: 600 }}>✓ ¡Todo clasificado!</div>}
          <div style={{ display: "flex", gap: 10, marginBottom: 14, flexWrap: "wrap" }}>
            {ex.categories.map(cat => (
              <div key={cat} style={{ padding: "8px 18px", background: "#1a1816", border: `1px solid ${border}`, borderRadius: 8, color: gold, fontSize: 14, fontWeight: 600, fontFamily: mono, letterSpacing: 1 }}>{cat}</div>
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {ex.items.map((item, ii) => {
              const answered = cs.answers[ii];
              const isWrong = cs.wrong === ii;
              return (
                <div key={ii} style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
                  <div style={{
                    flex: 1, minWidth: 150, padding: "10px 14px", borderRadius: 8, fontSize: 15, lineHeight: 1.5,
                    background: answered ? greenBg : isWrong ? redBg : "#1a1816",
                    border: `1px solid ${answered ? "#3a6a3a" : isWrong ? "#6a3a3a" : border}`,
                    color: answered ? green : isWrong ? red : textPrimary, transition: "all 0.3s"
                  }}>{item.text} {answered && <span style={{ fontSize: 12, opacity: 0.7 }}>→ {answered}</span>}</div>
                  {!answered && (
                    <div style={{ display: "flex", gap: 6 }}>
                      {ex.categories.map(cat => (
                        <button key={cat} onClick={() => catAnswer(si, ei, ii, cat, item.correct)} style={{
                          padding: "6px 14px", borderRadius: 6, border: `1px solid ${border}`, background: "#1a1816",
                          color: textSecondary, cursor: "pointer", fontSize: 12, fontFamily: mono, transition: "all 0.15s"
                        }}>{cat}</button>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    // ── ORDER ──
    if (ex.type === "order") {
      const os = gOrd(si, ei);
      return (
        <div key={k} style={{ background: card, border: `1px solid ${os.submitted ? (os.correct ? "#3a5a3a" : "#4a2a2a") : border}`, borderRadius: 12, padding: 20, marginBottom: 12, transition: "border-color 0.3s" }}>
          <div style={{ fontSize: 12, fontFamily: mono, color: "#c97ac9", marginBottom: 4, letterSpacing: 1 }}>ORDENAR</div>
          <div style={{ fontSize: 14, color: textSecondary, marginBottom: 12, lineHeight: 1.6 }}>{ex.description}</div>
          <div style={{ display: "flex", gap: 8, marginBottom: 14, flexWrap: "wrap" }}>
            {ex.words.map((w, i) => (
              <span key={i} style={{ padding: "6px 14px", background: "#1a1816", border: `1px solid ${border}`, borderRadius: 8, color: gold, fontSize: 15, fontFamily: font }}>{w}</span>
            ))}
          </div>
          <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
            <input type="text" value={os.value || ""} onChange={e => sOrdVal(si, ei, e.target.value)}
              onKeyDown={e => { if (e.key === "Enter" && os.value?.trim()) subOrd(si, ei, ex.answer, ex.accept); }}
              disabled={os.submitted} placeholder="Escribe la oración en orden..."
              style={{ flex: 1, minWidth: 200, padding: "12px 16px", background: os.submitted ? (os.correct ? greenBg : redBg) : "#1a1816",
                border: `1px solid ${os.submitted ? (os.correct ? "#3a6a3a" : "#5a3a3a") : border}`, borderRadius: 8,
                color: os.submitted ? (os.correct ? green : red) : textPrimary, fontSize: 16, fontFamily: font, outline: "none" }} />
            {!os.submitted && <button onClick={() => subOrd(si, ei, ex.answer, ex.accept)} disabled={!os.value?.trim()}
              style={{ padding: "12px 20px", borderRadius: 8, border: "none", cursor: os.value?.trim() ? "pointer" : "not-allowed",
                background: os.value?.trim() ? gold : "#2a2622", color: os.value?.trim() ? bg : textDim, fontFamily: mono, fontSize: 12, fontWeight: 600 }}>CHECK</button>}
          </div>
          {os.submitted && !os.correct && <div style={{ marginTop: 10, fontSize: 14, color: red }}>✗ Correcto: <span style={{ color: "#e8c967" }}>{ex.answer}</span></div>}
          {os.submitted && os.correct && <div style={{ marginTop: 8, fontSize: 14, color: green }}>✓ ¡Correcto!</div>}
        </div>
      );
    }

    // ── FILL / TRANSLATE / REWRITE ──
    const st = gEx(si, ei);
    const labels = { fill: ["COMPLETAR", "✏️"], translate: ["TRADUCIR", "🔄"], rewrite: ["REESCRIBIR", "📝"] };
    const [label, icon] = labels[ex.type] || ["EJERCICIO", "📌"];
    const colors = { fill: gold, translate: "#7ab8e0", rewrite: "#c97ac9" };

    return (
      <div key={k} style={{ background: card, border: `1px solid ${st.submitted ? (st.correct ? "#3a5a3a" : "#4a2a2a") : border}`, borderRadius: 12, padding: 20, marginBottom: 12, transition: "border-color 0.3s" }}>
        <div style={{ fontSize: 12, fontFamily: mono, color: colors[ex.type] || gold, marginBottom: 4, letterSpacing: 1 }}>{icon} {label}</div>
        {ex.description && <div style={{ fontSize: 14, color: textSecondary, marginBottom: 10, lineHeight: 1.6 }}>{ex.description}</div>}
        <div style={{ fontSize: 16, color: textPrimary, marginBottom: 14, lineHeight: 1.7 }}>{ex.prompt}</div>
        {ex.hint && !st.submitted && <div style={{ fontSize: 13, color: textDim, fontStyle: "italic", marginBottom: 10 }}>💡 {ex.hint}</div>}
        <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
          <input type="text" value={st.value || ""} onChange={e => sExVal(si, ei, e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && st.value?.trim()) subEx(si, ei, ex.answer, ex.accept); }}
            disabled={st.submitted}
            placeholder={ex.type === "fill" ? "tu respuesta..." : "escribe en español..."}
            style={{ flex: 1, minWidth: 200, padding: "12px 16px", background: st.submitted ? (st.correct ? greenBg : redBg) : "#1a1816",
              border: `1px solid ${st.submitted ? (st.correct ? "#3a6a3a" : "#5a3a3a") : border}`, borderRadius: 8,
              color: st.submitted ? (st.correct ? green : red) : textPrimary, fontSize: 16, fontFamily: font, outline: "none" }} />
          {!st.submitted && <button onClick={() => subEx(si, ei, ex.answer, ex.accept)} disabled={!st.value?.trim()}
            style={{ padding: "12px 20px", borderRadius: 8, border: "none", cursor: st.value?.trim() ? "pointer" : "not-allowed",
              background: st.value?.trim() ? gold : "#2a2622", color: st.value?.trim() ? bg : textDim, fontFamily: mono, fontSize: 12, fontWeight: 600 }}>CHECK</button>}
        </div>
        {st.submitted && !st.correct && <div style={{ marginTop: 10, fontSize: 14, color: red }}>✗ Correcto: <span style={{ color: "#e8c967" }}>{ex.answer}</span></div>}
        {st.submitted && st.correct && <div style={{ marginTop: 8, fontSize: 14, color: green }}>✓ ¡Correcto!</div>}
      </div>
    );
  };

  const allDone = false; // just a flag variable shadowed in categorize - ignore

  return (
    <div style={{ minHeight: "100vh", background: bg, color: textPrimary, fontFamily: font, lineHeight: 1.7 }}>
      <link href="https://fonts.googleapis.com/css2?family=Source+Serif+4:ital,wght@0,400;0,600;0,700;1,400&family=IBM+Plex+Mono:wght@400;600&family=Fraunces:opsz,wght@9..144,700;9..144,900&display=swap" rel="stylesheet" />
      <style>{`
        *{box-sizing:border-box;margin:0;padding:0}
        ::selection{background:#d4a85340;color:#fff}
        @keyframes fi{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        .fi{animation:fi .3s ease-out both}
        .crd{transition:all .2s}
        .pill{transition:all .15s;cursor:pointer;border:none;background:none}
        .pill:hover{background:#2a2622!important}
        input:focus{border-color:${gold}!important;outline:none}
        button{font-family:inherit}
        textarea{font-family:${mono}}
        .pf{transition:width .5s ease}
      `}</style>

      {/* ═══ HEADER ═══ */}
      <header style={{ background: "linear-gradient(180deg, #1a1814 0%, #141210 100%)", borderBottom: `1px solid ${border}`, padding: "20px 24px", position: "sticky", top: 0, zIndex: 100 }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
            <div>
              <h1 style={{ fontFamily: display, fontSize: 24, fontWeight: 900, color: gold, letterSpacing: 0.5 }}>Español Diario</h1>
              <div style={{ fontSize: 12, color: textDim, fontFamily: mono, marginTop: 2 }}>
                Día {prog.currentDay} de 30 · {masteryPct}% maestría
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setShowImport(true)} style={{ padding: "6px 14px", background: "transparent", border: `1px solid ${gold}`, color: gold, borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: mono, letterSpacing: 1 }}>+ IMPORTAR</button>
              <button onClick={resetAll} style={{ padding: "6px 14px", background: "transparent", border: `1px solid #3a352a`, color: textDim, borderRadius: 6, cursor: "pointer", fontSize: 11, fontFamily: mono }}>REINICIAR</button>
            </div>
          </div>
          {/* Mastery progress bar */}
          <div style={{ marginTop: 12, height: 4, background: "#1a1816", borderRadius: 2, overflow: "hidden" }}>
            <div className="pf" style={{ height: "100%", borderRadius: 2, background: `linear-gradient(90deg, ${DIFF_COLORS[1]}, ${DIFF_COLORS[2]}, ${DIFF_COLORS[3]}, ${DIFF_COLORS[4]}, ${DIFF_COLORS[5]})`, width: `${masteryPct}%` }} />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginTop: 4 }}>
            {Object.entries(DIFF_LABELS).map(([k, v]) => <span key={k} style={{ fontSize: 9, fontFamily: mono, color: DIFF_COLORS[k], opacity: getDiffForDay(prog.currentDay) >= Number(k) ? 1 : 0.3 }}>{v}</span>)}
          </div>
        </div>
      </header>

      <div style={{ maxWidth: 800, margin: "0 auto", padding: "20px 16px 80px" }}>

        {/* ═══ DAY SELECTOR ═══ */}
        <div className="fi" style={{ marginBottom: 28 }}>
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap", alignItems: "center" }}>
            {data.days.map(d => {
              const ok = canGo(d.day), dn = prog.completed.includes(d.day), cur = d.day === aDN;
              const df = d.difficulty || getDiffForDay(d.day);
              return <button key={d.day} disabled={!ok} onClick={() => { setViewDay(d.day === prog.currentDay ? null : d.day); setSecIdx(0); setQuiz(null); setFlipped({}); setExState({}); setMatchSt({}); setCatState({}); setOrderState({}); setShowEx({}); }}
                style={{ width: 34, height: 34, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontFamily: mono, fontWeight: 600, border: "none", cursor: ok ? "pointer" : "default",
                  background: cur ? DIFF_COLORS[df] : dn ? greenBg : ok ? "#1a1816" : bg,
                  color: cur ? bg : dn ? green : ok ? textDim : "#2a2622",
                  outline: cur ? `2px solid ${DIFF_COLORS[df]}` : dn ? `2px solid #3a6a3a` : "2px solid transparent",
                  outlineOffset: 2, opacity: ok ? 1 : 0.3, transition: "all 0.2s" }}>
                {dn && !cur ? "✓" : d.day}
              </button>;
            })}
          </div>
        </div>

        {!aDay ? (
          <div className="fi" style={{ background: card, border: `1px solid ${border}`, borderRadius: 14, padding: 48, textAlign: "center" }}>
            <div style={{ fontSize: 40, marginBottom: 14 }}>🔒</div>
            <h2 style={{ fontFamily: display, color: gold, fontSize: 20, marginBottom: 10 }}>Día {aDN}</h2>
            <p style={{ color: textSecondary, fontSize: 15 }}>{aDN > prog.currentDay ? "Complete your current day first (≥70% on the quiz)." : "Import content for this day using the Importar button."}</p>
          </div>
        ) : (
          <>
            {/* ═══ DAY HEADER ═══ */}
            <div className="fi" style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6, flexWrap: "wrap" }}>
                <span style={{ fontSize: 11, fontFamily: mono, color: DIFF_COLORS[diff], background: `${DIFF_COLORS[diff]}15`, padding: "3px 10px", borderRadius: 20, border: `1px solid ${DIFF_COLORS[diff]}30`, letterSpacing: 1 }}>{DIFF_LABELS[diff]}</span>
                {done && <span style={{ fontSize: 11, fontFamily: mono, color: green, background: greenBg, padding: "3px 10px", borderRadius: 20, border: "1px solid #3a6a3a" }}>✓ {prog.quizScores[aDN]}%</span>}
                {done && <button onClick={resetDay} style={{ fontSize: 11, color: textDim, background: "none", border: `1px solid ${border}`, borderRadius: 6, padding: "2px 8px", cursor: "pointer", fontFamily: mono }}>Repetir</button>}
              </div>
              <h2 style={{ fontFamily: display, fontSize: 28, color: gold, lineHeight: 1.3, marginBottom: 4 }}>Día {aDay.day}: {aDay.title}</h2>
              {aDay.subtitle && <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.6 }}>{aDay.subtitle}</p>}
              <div style={{ marginTop: 14, height: 3, background: "#1a1816", borderRadius: 2, overflow: "hidden" }}>
                <div className="pf" style={{ height: "100%", borderRadius: 2, background: DIFF_COLORS[diff], width: `${((secIdx + 1) / aDay.sections.length) * 100}%` }} />
              </div>
            </div>

            {/* ═══ SECTION NAV ═══ */}
            <div className="fi" style={{ display: "flex", gap: 5, marginBottom: 24, flexWrap: "wrap" }}>
              {aDay.sections.map((s, i) => (
                <button key={i} className="pill" onClick={() => { setSecIdx(i); setFlipped({}); if (s.type === "quiz" && !quiz) startQ(i); }}
                  style={{ padding: "6px 14px", borderRadius: 20, fontSize: 12, fontFamily: mono,
                    color: i === secIdx ? bg : s.type === "quiz" ? gold : textDim,
                    background: i === secIdx ? DIFF_COLORS[diff] : "transparent",
                    border: `1px solid ${i === secIdx ? DIFF_COLORS[diff] : border}` }}>
                  {s.icon || "📖"} {s.category}
                </button>
              ))}
            </div>

            {/* ═══ SECTION CONTENT ═══ */}
            {(() => {
              const sec = aDay.sections[secIdx]; if (!sec) return null;
              const exVis = showEx[secIdx] !== false;

              // ── LESSON ──
              if (sec.type === "lesson") return (
                <div className="fi" key={`${aDN}-${secIdx}`}>
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: display, fontSize: 22, color: gold, marginBottom: 8 }}>{sec.icon} {sec.category}</h3>
                    {sec.description && <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.8 }}>{sec.description}</p>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                    {sec.content.map((item, idx) => (
                      <div key={idx} className="crd" style={{ background: card, border: `1px solid ${border}`, borderRadius: 12, padding: 22 }}>
                        <div style={{ fontSize: 17, fontWeight: 700, color: textPrimary, marginBottom: 6 }}>{item.term}</div>
                        <div style={{ fontSize: 15, color: textSecondary, lineHeight: 1.8, marginBottom: 12 }}>{item.definition}</div>
                        {item.examples.map((ex, j) => (
                          <div key={j} style={{ fontSize: 15, color: gold, background: "#1a1816", padding: "10px 16px", borderRadius: 8, borderLeft: `3px solid ${gold}30`, marginBottom: 5, lineHeight: 1.6 }}>{ex}</div>
                        ))}
                      </div>
                    ))}
                  </div>
                  {sec.exercises?.length > 0 && (
                    <div style={{ marginTop: 28 }}>
                      <button onClick={() => setShowEx(p => ({ ...p, [secIdx]: !exVis }))}
                        style={{ display: "flex", alignItems: "center", gap: 10, background: card, border: `1px solid ${gold}30`, padding: "14px 20px", borderRadius: 10, cursor: "pointer", color: gold, fontFamily: mono, fontSize: 13, letterSpacing: 0.5, width: "100%" }}>
                        <span style={{ fontSize: 20 }}>✏️</span>
                        <span style={{ flex: 1, textAlign: "left", fontWeight: 600 }}>PRÁCTICA — {sec.category}</span>
                        <span style={{ fontSize: 13, color: textDim }}>{sec.exercises.length} ejercicios</span>
                        <span style={{ transform: exVis ? "rotate(180deg)" : "", transition: "transform 0.2s", marginLeft: 8 }}>▼</span>
                      </button>
                      {exVis && <div style={{ marginTop: 16 }}>{sec.exercises.map((ex, ei) => renderEx(ex, ei, secIdx))}</div>}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                    {secIdx < aDay.sections.length - 1 && (
                      <button onClick={() => { setSecIdx(secIdx + 1); setFlipped({}); const n = aDay.sections[secIdx + 1]; if (n?.type === "quiz" && !quiz) startQ(secIdx + 1); }}
                        style={{ padding: "12px 28px", background: DIFF_COLORS[diff], color: bg, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: mono, fontSize: 13, fontWeight: 600, letterSpacing: 1 }}>SIGUIENTE →</button>
                    )}
                  </div>
                </div>
              );

              // ── VOCAB ──
              if (sec.type === "vocab") return (
                <div className="fi" key={`${aDN}-${secIdx}`}>
                  <div style={{ marginBottom: 24 }}>
                    <h3 style={{ fontFamily: display, fontSize: 22, color: gold, marginBottom: 8 }}>{sec.icon} {sec.category}</h3>
                    {sec.description && <p style={{ fontSize: 15, color: textSecondary, lineHeight: 1.8, marginBottom: 8 }}>{sec.description}</p>}
                    <p style={{ fontSize: 13, color: textDim, fontStyle: "italic" }}>Tap each card to reveal the English translation.</p>
                  </div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                    {sec.words.map((w, i) => {
                      const f = flipped[i];
                      return (
                        <div key={i} onClick={() => setFlipped(p => ({ ...p, [i]: !p[i] }))} style={{
                          background: f ? greenBg : card, border: `1px solid ${f ? "#3a6a3a" : border}`, borderRadius: 12, padding: 20,
                          minHeight: 130, cursor: "pointer", display: "flex", flexDirection: "column", justifyContent: "center", transition: "all 0.25s"
                        }}>
                          {!f ? (
                            <>
                              <div style={{ fontSize: 18, fontWeight: 700, color: gold, marginBottom: 4 }}>{w.spanish}</div>
                              {w.note && <div style={{ fontSize: 12, color: textDim, fontStyle: "italic", marginTop: 4 }}>{w.note}</div>}
                            </>
                          ) : (
                            <>
                              <div style={{ fontSize: 16, fontWeight: 600, color: green, marginBottom: 2 }}>{w.english}</div>
                              <div style={{ fontSize: 14, color: textSecondary, lineHeight: 1.6, marginTop: 6, fontStyle: "italic" }}>"{w.sentence}"</div>
                              {w.note && <div style={{ fontSize: 12, color: textDim, marginTop: 6 }}>📌 {w.note}</div>}
                            </>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {sec.exercises?.length > 0 && (
                    <div style={{ marginTop: 28 }}>
                      <button onClick={() => setShowEx(p => ({ ...p, [secIdx]: !exVis }))}
                        style={{ display: "flex", alignItems: "center", gap: 10, background: card, border: `1px solid ${gold}30`, padding: "14px 20px", borderRadius: 10, cursor: "pointer", color: gold, fontFamily: mono, fontSize: 13, letterSpacing: 0.5, width: "100%" }}>
                        <span style={{ fontSize: 20 }}>✏️</span>
                        <span style={{ flex: 1, textAlign: "left", fontWeight: 600 }}>PRÁCTICA — Vocabulario</span>
                        <span style={{ fontSize: 13, color: textDim }}>{sec.exercises.length} ejercicios</span>
                        <span style={{ transform: exVis ? "rotate(180deg)" : "", transition: "transform 0.2s", marginLeft: 8 }}>▼</span>
                      </button>
                      {exVis && <div style={{ marginTop: 16 }}>{sec.exercises.map((ex, ei) => renderEx(ex, ei, secIdx))}</div>}
                    </div>
                  )}
                  <div style={{ display: "flex", justifyContent: "space-between", marginTop: 24, flexWrap: "wrap", gap: 10 }}>
                    <button onClick={() => setFlipped(sec.words.reduce((a, _, i) => ({ ...a, [i]: true }), {}))}
                      style={{ padding: "8px 16px", background: "transparent", border: `1px solid ${border}`, color: textDim, borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: mono }}>Mostrar todas</button>
                    {secIdx < aDay.sections.length - 1 && (
                      <button onClick={() => { setSecIdx(secIdx + 1); setFlipped({}); const n = aDay.sections[secIdx + 1]; if (n?.type === "quiz" && !quiz) startQ(secIdx + 1); }}
                        style={{ padding: "12px 28px", background: DIFF_COLORS[diff], color: bg, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: mono, fontSize: 13, fontWeight: 600 }}>SIGUIENTE →</button>
                    )}
                  </div>
                </div>
              );

              // ── QUIZ ──
              if (sec.type === "quiz") {
                const qs = sec.questions;
                if (!quiz) return (
                  <div className="fi" style={{ textAlign: "center", padding: 48 }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🏆</div>
                    <h3 style={{ fontFamily: display, fontSize: 24, color: gold, marginBottom: 8 }}>{sec.category}</h3>
                    {sec.description && <p style={{ color: textSecondary, marginBottom: 24, fontSize: 15, lineHeight: 1.7, maxWidth: 500, margin: "0 auto 24px" }}>{sec.description}</p>}
                    <button onClick={() => startQ(secIdx)} style={{ padding: "14px 36px", background: gold, color: bg, border: "none", borderRadius: 8, cursor: "pointer", fontFamily: mono, fontSize: 14, fontWeight: 600 }}>EMPEZAR PRUEBA</button>
                  </div>
                );
                const nAns = Object.keys(quiz.ans).length;
                const allA = nAns === qs.length;
                const corr = quiz.sub ? qs.filter((q, i) => quiz.ans[i] === q.answer).length : 0;
                const sc = quiz.sub ? Math.round((corr / qs.length) * 100) : 0;
                const pass = sc >= 70;

                return (
                  <div className="fi" key={`${aDN}-quiz`}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20, flexWrap: "wrap", gap: 10 }}>
                      <h3 style={{ fontFamily: display, fontSize: 20, color: gold }}>{sec.icon} {sec.category}</h3>
                      <span style={{ fontSize: 12, fontFamily: mono, color: textDim }}>{nAns}/{qs.length}</span>
                    </div>
                    {sec.description && !quiz.sub && <p style={{ fontSize: 14, color: textSecondary, marginBottom: 20, lineHeight: 1.7 }}>{sec.description}</p>}

                    {quiz.sub && (
                      <div className="fi" style={{ background: pass ? greenBg : redBg, border: `1px solid ${pass ? "#3a6a3a" : "#5a3a3a"}`, borderRadius: 12, padding: 24, marginBottom: 24, textAlign: "center" }}>
                        <div style={{ fontSize: 40, fontFamily: display, fontWeight: 900, color: pass ? green : red }}>{sc}%</div>
                        <div style={{ fontSize: 15, color: pass ? green : red, marginTop: 4 }}>{corr}/{qs.length} correctas · {pass ? "¡Día completado! 🎉" : "Necesitas ≥70%. ¡Revisa y reintenta!"}</div>
                        {!pass && <button onClick={() => setQuiz({ ans: {}, sub: false })} style={{ marginTop: 12, padding: "8px 22px", background: gold, color: bg, border: "none", borderRadius: 6, cursor: "pointer", fontFamily: mono, fontSize: 13, fontWeight: 600 }}>REINTENTAR</button>}
                      </div>
                    )}

                    <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                      {qs.map((q, qi) => {
                        const ua = quiz.ans[qi]; const ok = ua === q.answer; const sh = quiz.sub;
                        return (
                          <div key={qi} className="crd" style={{ background: sh ? (ok ? greenBg : redBg) : card, border: `1px solid ${sh ? (ok ? "#3a6a3a" : "#4a2a2a") : border}`, borderRadius: 12, padding: 20 }}>
                            <div style={{ fontSize: 15, color: textPrimary, marginBottom: 14, lineHeight: 1.7 }}>
                              <span style={{ fontFamily: mono, color: textDim, fontSize: 12, marginRight: 8 }}>{qi + 1}.</span>{q.q}
                            </div>
                            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                              {q.options.map((opt, oi) => {
                                const sel = ua === oi, isA = q.answer === oi;
                                let obg = "#1a1816", obc = border, otc = textSecondary;
                                if (sh) { if (isA) { obg = greenBg; obc = "#3a6a3a"; otc = green; } else if (sel) { obg = redBg; obc = "#5a3a3a"; otc = red; } }
                                else if (sel) { obg = "#252218"; obc = gold; otc = gold; }
                                return <div key={oi} onClick={() => ansQ(qi, oi)} style={{
                                  padding: "10px 14px", borderRadius: 8, fontSize: 15, background: obg, border: `1px solid ${obc}`,
                                  color: otc, cursor: sh ? "default" : "pointer", transition: "all 0.15s", lineHeight: 1.5
                                }}><span style={{ fontFamily: mono, fontSize: 11, marginRight: 6, opacity: 0.4 }}>{String.fromCharCode(65 + oi)}</span>{opt}</div>;
                              })}
                            </div>
                            {sh && <div style={{ marginTop: 10, fontSize: 14, color: ok ? "#5a9a5a" : "#b07070", lineHeight: 1.6 }}>{q.explanation}</div>}
                          </div>
                        );
                      })}
                    </div>
                    {!quiz.sub && (
                      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
                        <button disabled={!allA} onClick={() => subQuiz(qs)} style={{
                          padding: "14px 40px", borderRadius: 8, border: "none", cursor: allA ? "pointer" : "not-allowed",
                          background: allA ? gold : "#2a2622", color: allA ? bg : textDim, fontFamily: mono, fontSize: 14, fontWeight: 600, letterSpacing: 1
                        }}>ENVIAR ({nAns}/{qs.length})</button>
                      </div>
                    )}
                  </div>
                );
              }
              return null;
            })()}
          </>
        )}
      </div>

      {/* ═══ IMPORT MODAL ═══ */}
      {showImport && (
        <div style={{ position: "fixed", inset: 0, background: "#000b", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }}
          onClick={e => { if (e.target === e.currentTarget) setShowImport(false); }}>
          <div style={{ background: "#1c1a16", border: `1px solid ${border}`, borderRadius: 14, width: "100%", maxWidth: 680, maxHeight: "90vh", overflow: "auto", padding: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 18 }}>
              <h3 style={{ fontFamily: display, fontSize: 20, color: gold }}>Importar Días</h3>
              <button onClick={() => setShowImport(false)} style={{ background: "none", border: "none", color: textDim, fontSize: 24, cursor: "pointer" }}>×</button>
            </div>
            <p style={{ fontSize: 14, color: textSecondary, lineHeight: 1.7, marginBottom: 14 }}>Paste the JSON generated by your other program. Existing days will be updated; new ones added.</p>
            <button onClick={() => setShowFmt(!showFmt)} style={{ fontSize: 11, color: gold, background: "none", border: `1px solid ${border}`, borderRadius: 6, padding: "5px 12px", cursor: "pointer", fontFamily: mono, marginBottom: 14 }}>
              {showFmt ? "Hide" : "Show"} format + generation prompt
            </button>
            {showFmt && (
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: gold, marginBottom: 6, fontFamily: mono }}>JSON FORMAT:</div>
                <pre style={{ background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: 14, fontSize: 10, fontFamily: mono, color: textDim, overflow: "auto", maxHeight: 220, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{IMPORT_FORMAT}</pre>
                <div style={{ marginTop: 10, padding: 12, background: "#14141a", border: "1px solid #2a2a3a", borderRadius: 8 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: "#7a9ac9", marginBottom: 6, fontFamily: mono }}>💡 COPY THIS PROMPT TO GENERATE DAYS:</div>
                  <pre style={{ fontSize: 10, fontFamily: mono, color: "#8a8a9a", whiteSpace: "pre-wrap", lineHeight: 1.5 }}>{PROMPT_TEMPLATE}</pre>
                </div>
              </div>
            )}
            <textarea value={importText} onChange={e => setImportText(e.target.value)} placeholder='{ "days": [ ... ] }'
              style={{ width: "100%", minHeight: 180, background: bg, border: `1px solid ${border}`, borderRadius: 8, padding: 12, color: textPrimary, fontSize: 12, resize: "vertical", outline: "none" }} />
            {importErr && <div style={{ marginTop: 6, padding: 8, background: redBg, border: "1px solid #4a2a2a", borderRadius: 6, color: red, fontSize: 12 }}>{importErr}</div>}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, marginTop: 14 }}>
              <button onClick={() => setShowImport(false)} style={{ padding: "8px 18px", background: "transparent", border: `1px solid ${border}`, color: textDim, borderRadius: 6, cursor: "pointer", fontFamily: mono, fontSize: 12 }}>Cancel</button>
              <button onClick={doImport} disabled={!importText.trim()} style={{ padding: "8px 20px", background: importText.trim() ? gold : "#2a2622", color: importText.trim() ? bg : textDim, border: "none", borderRadius: 6, cursor: importText.trim() ? "pointer" : "not-allowed", fontFamily: mono, fontSize: 12, fontWeight: 600 }}>IMPORTAR</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
