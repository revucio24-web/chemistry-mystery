import { Puzzle } from '../types/puzzles';

export interface SparkyTip {
  title: string;
  simpleExplanation: string;
  kidAnalogy: string;
}

export const SPARKY_PUZZLE_TIPS: Record<string, SparkyTip> = {
  el_puzzle_01: {
    title: 'Sparkys Symbol-Detektiv',
    simpleExplanation: 'Jedes Element hat ein geheimes Kürzel aus 1 oder 2 Buchstaben. H ist Wasserstoff, O ist Sauerstoff und Fe ist Eisen!',
    kidAnalogy: 'Wie Spitznamen bei deinen Freunden: "Alex" für Alexander – oder wie Auto-Kennzeichen auf der Straße!'
  },
  el_puzzle_02: {
    title: 'Sparkys Kern-Geheimnis',
    simpleExplanation: 'Die Protonen im Kern sind der Ausweis des Elements. Ein Goldatom hat immer 79 Protonen – hat es 80, ist es Quecksilber!',
    kidAnalogy: 'Wie deine Hausnummer: Sie bestimmt ganz genau, welches Haus deins ist!'
  },
  el_puzzle_03: {
    title: 'Sparkys Ballon-Kumpel',
    simpleExplanation: 'Helium ist ein Edelgas ganz oben rechts mit der Nummer 2. Es ist so leicht, dass es Luftballons in den Himmel hebt!',
    kidAnalogy: 'Edelgase sind wie zufriedene Katzen: Sie haben schon alles, was sie brauchen, und wollen mit niemandem streiten.'
  },
  el_puzzle_04: {
    title: 'Sparkys Wasserküche',
    simpleExplanation: 'Für Wasser brauchst du 2 Wasserstoff-Atome (H) und 1 Sauerstoff-Atom (O). Zusammen bilden sie H₂O!',
    kidAnalogy: 'Stell dir Micky Maus vor: 1 Kopf (Sauerstoff) und 2 Ohren (Wasserstoff).'
  },
  el_puzzle_05: {
    title: 'Sparkys Tresor-Knacker',
    simpleExplanation: 'Schau auf die Ordnungszahlen im Periodensystem. Jedes Symbol steht für eine feste Zahl!',
    kidAnalogy: 'Ein chemisches Zahlenschloss – wie eine geheime Detektiv-Botschaft!'
  },
  el_puzzle_06: {
    title: 'Sparkys Pulver-Check',
    simpleExplanation: 'Salz löst sich super in Wasser und leitet Strom, Mehl trübt das Wasser und brennt, wenn man es erhitzt.',
    kidAnalogy: 'Wie Backzutaten in der Küche unterscheiden: Zucker, Mehl und Salz sehen alle weiß aus, benehmen sich aber ganz anders!'
  },
  el_puzzle_07: {
    title: 'Sparkys Knallgas-Waage',
    simpleExplanation: '2 H₂ + 1 O₂ werden zu 2 H₂O. Vorher 4 H und 2 O, nachher 4 H und 2 O – kein Teilchen geht verloren!',
    kidAnalogy: 'Wenn du 4 Brotscheiben und 2 Käsescheiben hast, machst du genau 2 komplette Käsebrote daraus!'
  },
  el_puzzle_08: {
    title: 'Sparkys Silber-Rätsel',
    simpleExplanation: 'Silber läuft dunkel an, weil winzige Spuren von Schwefel in der Luft oder im Frühstücksei mit dem Silber reagieren.',
    kidAnalogy: 'Wie ein Apfel, der an der Luft braun wird – die Oberfläche reagiert mit der Umgebung!'
  },
  el_puzzle_09: {
    title: 'Sparkys Schmelz-Check',
    simpleExplanation: 'Schmilzt Eis zu Wasser, ist es immer noch derselbe Stoff H₂O. Verbrennt Holz zu Asche, entsteht etwas völlig Neues!',
    kidAnalogy: 'Schokolade schmelzen = physikalisch (schmeckt immer noch nach Schokolade). Kuchen backen = chemisch (Mehl und Eier wurden zu Teig)!'
  },
  el_puzzle_10: {
    title: 'Sparkys Eisen-Power',
    simpleExplanation: 'Eisen (Fe) macht unser Blut rot und hilft den roten Blutkörperchen, Sauerstoff durch deinen Körper zu tragen!',
    kidAnalogy: 'Eisen ist wie ein kleiner Lieferwagen im Blut, der Sauerstoffpakete zu deinen Muskeln fährt!'
  }
};

export const getSparkyTip = (puzzle: Puzzle): SparkyTip => {
  if (SPARKY_PUZZLE_TIPS[puzzle.id]) {
    return SPARKY_PUZZLE_TIPS[puzzle.id];
  }

  // Fallback-Generierung basierend auf Rätseltyp
  switch (puzzle.type) {
    case 'molecule_builder':
      return {
        title: 'Sparkys Bauanleitung',
        simpleExplanation: 'Achte auf die kleinen Bindungs-Arme! Jedes Atom möchte seine Hände voll haben.',
        kidAnalogy: 'Wie LEGO-Steine mit Noppen: 1 Noppe passt auf 1 Loch!'
      };
    case 'equation_balancer':
      return {
        title: 'Sparkys Waage-Regel',
        simpleExplanation: 'Zähle links und rechts die Atomsorten. Beide Seiten müssen wie eine Küchenwaage im Gleichgewicht sein!',
        kidAnalogy: 'Alle LEGO-Steine, die du vorher hattest, müssen auch im fertigen Bauwerk stecken.'
      };
    case 'element_match':
      return {
        title: 'Sparkys Namens-Trick',
        simpleExplanation: 'Viele Symbole sind die ersten Buchstaben des lateinischen oder deutschen Namens!',
        kidAnalogy: 'Wie geheime Geheimagenten-Kürzel auf dem Labortisch!'
      };
    case 'substance_analysis':
      return {
        title: 'Sparkys Labor-Spürnase',
        simpleExplanation: 'Kombiniere Farbe, Geruch, Löslichkeit und pH-Wert wie ein echter Detektiv!',
        kidAnalogy: 'Wie bei einer Fährtensuche im Wald – Hinweis für Hinweis führt zur Lösung.'
      };
    case 'mystery_detective':
      return {
        title: 'Sparkys Detektiv-Lupe',
        simpleExplanation: 'Suche die naturwissenschaftliche Erklärung, die wirklich zu den Beweisen passt.',
        kidAnalogy: 'Ein guter Forscher glaubt nicht an Zauberei, sondern findet heraus, wie die Natur es macht!'
      };
    case 'periodic_table_quiz':
      return {
        title: 'Sparkys Landkarten-Kompass',
        simpleExplanation: 'Die Ordnungszahl zählt die Protonen im Kern von links nach rechts durch!',
        kidAnalogy: 'Wie Hausnummern in einer langen, bunten Straße voller Elemente.'
      };
    default:
      return {
        title: 'Sparkys Forscher-Tipp',
        simpleExplanation: puzzle.hint || 'Lies die Aufgabe genau und probiere es in Ruhe aus!',
        kidAnalogy: 'In der Wissenschaft gibt es keine falschen Versuche, nur neue Erkenntnisse!'
      };
  }
};

export const getSparkyCheer = (isCorrect: boolean): { message: string; subtext: string } => {
  if (isCorrect) {
    const cheers = [
      { message: 'Miau-tastisch gelöst, Nachwuchsforscher!', subtext: 'Du hast die Naturgesetze meisterhaft verstanden!' },
      { message: 'Volltreffer im Reagenzglas!', subtext: 'Die Atome jubeln und formieren sich perfekt!' },
      { message: 'Chemie-Genie am Werk!', subtext: 'Genau so funktioniert echte Wissenschaft im Labor!' },
      { message: 'Wunderbar kombiniert!', subtext: 'Wieder ein Geheimnis der Elemente gelüftet!' }
    ];
    return cheers[Math.floor(Math.random() * cheers.length)];
  } else {
    const encouragements = [
      { message: 'Keine Sorge, Pfote drauf!', subtext: 'Selbst Albert Einstein und Marie Curie haben hunderte Male probiert!' },
      { message: 'Fast geschafft – schau dir den Tipp an!', subtext: 'In der Wissenschaft bringt uns jeder Versuch der Wahrheit näher.' },
      { message: 'Guter Forschungsansatz!', subtext: 'Überlege noch einmal kurz, welche Bausteine zusammenpassen.' }
    ];
    return encouragements[Math.floor(Math.random() * encouragements.length)];
  }
};
