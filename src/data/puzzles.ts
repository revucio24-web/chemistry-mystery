import { Puzzle } from '../types/puzzles';
import { MOLECULES_DATA } from './molecules';
import { REACTIONS_DATA } from './reactions';

export const ALL_PUZZLES: Puzzle[] = [
  // ==========================================
  // RAUM 1: DAS ELEMENTARLABOR (10 Rätsel)
  // ==========================================
  {
    id: 'el_puzzle_01',
    title: 'Die Glyphen der Alchemie',
    room: 'elemental_lab',
    moduleId: 'module_a',
    rewardElementAtomicNumber: 1, // Wasserstoff
    type: 'element_match',
    difficulty: 'explorer',
    missionNumber: 1,
    question: 'Ordne den Elementsymbolen die korrekten deutschen Elementnamen zu!',
    loreContext: 'Am Eingang des Elementarlabors leuchtet eine holografische Stele mit antiken und modernen Abkürzungen. Um die Sensoren zu kalibrieren, musst du die Symbole synchronisieren.',
    hint: 'Viele Symbole stammen aus dem Lateinischen: "Fe" kommt von "Ferrum" (Eisen), "O" von "Oxygenium" (Sauerstoff).',
    detailedHint: 'H steht für Wasserstoff (Hydrogenium), C für Kohlenstoff (Carbonium), O für Sauerstoff (Oxygenium) und Fe für Eisen (Ferrum).',
    didacticExplanation: 'Elementsymbole bestehen weltweit aus einem Großbuchstaben oder einem Groß- gefolgt von einem Kleinbuchstaben. Sie sind eine universelle Weltsprache aller Wissenschaftler.',
    commonMistakeExplanation: 'Achte darauf, das Symbol Fe nicht mit Fluor (F) zu verwechseln! Fe leitet sich vom lateinischen Wort "Ferrum" für Eisen ab.',
    realWorldExample: 'Egal ob in Tokio, Berlin oder New York: Auf jeder Chemikalienflasche steht weltweit dasselbe Symbol.',
    xpReward: 30,
    pairs: [
      { symbol: 'H', name: 'Wasserstoff', clue: 'Das leichteste Element des Universums' },
      { symbol: 'O', name: 'Sauerstoff', clue: 'Lebensnotwendig für unsere Atmung' },
      { symbol: 'C', name: 'Kohlenstoff', clue: 'Die Basis aller organischen Lebewesen' },
      { symbol: 'Fe', name: 'Eisen', clue: 'Magnetisches Schwermetall (Ferrum)' }
    ]
  },
  {
    id: 'el_puzzle_02',
    title: 'Der Elementar-Wahrheitsfilter',
    room: 'elemental_lab',
    moduleId: 'module_a',
    rewardElementAtomicNumber: 6, // Kohlenstoff
    type: 'true_false',
    difficulty: 'explorer',
    missionNumber: 2,
    question: 'Prüfe die Aussage des Labor-Hauptrechners:',
    statement: 'Ein chemisches Element besteht aus lauter Atomen mit der exakt gleichen Anzahl an Protonen im Atomkern.',
    isTrue: true,
    loreContext: 'Der Diagnose-Computer des Labors prüft dein Grundverständnis über die Bausteine der Materie, bevor er tiefere Systeme freischaltet.',
    hint: 'Überlege, was die Ordnungszahl im Periodensystem bedeutet: Sie gibt genau die Zahl der Protonen an.',
    detailedHint: 'Ein Goldatom hat immer 79 Protonen. Ändert man die Protonenzahl, entsteht ein völlig anderes Element!',
    didacticExplanation: 'Richtig! Die Protonenzahl (Kernladungszahl / Ordnungszahl) definiert unverwechselbar das Element. Alle Wasserstoffatome besitzen 1 Proton, alle Kohlenstoffatome 6 Protonen.',
    commonMistakeExplanation: 'Zwar kann die Neutronenzahl variieren (das nennt man dann Isotope), aber die Protonenzahl ist für jedes chemische Element immer streng identisch.',
    realWorldExample: 'Ein Goldatom bleibt Gold, solange sein Kern 79 Protonen enthält – egal ob im Ehering oder tief im Erdinneren.',
    xpReward: 25
  },
  {
    id: 'el_puzzle_03',
    title: 'Das flüchtige Edelgas',
    room: 'elemental_lab',
    moduleId: 'module_a',
    rewardElementAtomicNumber: 2, // Helium
    type: 'periodic_table_quiz',
    difficulty: 'beginner',
    missionNumber: 3,
    question: 'Finde das gesuchte Element anhand der Labor-Detektordaten!',
    loreContext: 'Ein Druckabfall im Kühlsystem hat ein Gas freigesetzt. Der Spektrograf meldet: Ordnungszahl 2, Gruppe 18, extrem leicht und völlig reaktionsträge.',
    hint: 'Es ist das zweithäufigste Element im Weltall und wird in Ballons verwendet, weil es leichter als Luft ist.',
    detailedHint: 'Suche ganz oben rechts im Periodensystem. Symbol: He.',
    didacticExplanation: 'Hervorragend! Helium (He) besitzt die Ordnungszahl 2. Seine K-Schale ist mit 2 Elektronen voll besetzt (Duplett-Regel), weshalb es als Edelgas praktisch keine Bindungen eingeht.',
    commonMistakeExplanation: 'Wasserstoff (H) ist zwar noch leichter (Ordnungszahl 1), aber hochentzündlich und gehört nicht zur Gruppe 18 (Edelgase).',
    realWorldExample: 'Helium wird zur Kühlung supraleitender Spulen in Magnetresonanztomografen (MRT) auf minus 269 °C verflüssigt.',
    xpReward: 35,
    targetSymbol: 'He',
    criteriaDescription: 'Edelgas der 1. Periode mit 2 Protonen und 2 Elektronen',
    clues: [
      'Ordnungszahl: 2',
      'Gruppe: 18 (Edelgase)',
      'Aggregatzustand bei 20 °C: Gasförmig',
      'Geht unter Normalbedingungen keine chemischen Verbindungen ein'
    ]
  },
  {
    id: 'el_puzzle_04',
    title: 'Molekül-Synthese: Das Lebenselixier',
    room: 'elemental_lab',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 8, // Sauerstoff
    type: 'molecule_builder',
    difficulty: 'explorer',
    missionNumber: 4,
    question: 'Setze die Atome im Reaktionsbehälter zum Wassermolekül (H₂O) zusammen!',
    loreContext: 'Die Notkühlung des Synthesereaktors benötigt reines Wasser. Die automatische Zufuhr ist leer, du musst das Molekül aus den Grundatomen synthetisieren.',
    hint: 'Wasser besteht aus einem zweiwertigen Sauerstoffatom (O) und zwei einwertigen Wasserstoffatomen (H).',
    detailedHint: 'Verwende 1 Sauerstoffatom und 2 Wasserstoffatome. Jedes H geht eine Bindung mit dem zentralen O ein.',
    didacticExplanation: 'Perfekt gebaut! Sauerstoff benötigt 2 Bindungselektronen zur Erreichung der stabilen Edelgaskonfiguration. Jedes Wasserstoffatom steuert 1 Elektron bei.',
    commonMistakeExplanation: 'Wasser ist nicht HO oder H2O2 (Wasserstoffperoxid), sondern H2O: 2 Teile Wasserstoff auf 1 Teil Sauerstoff.',
    realWorldExample: 'Wasser bedeckt über 70 % der Erdoberfläche und ist das universelle Lösungsmittel für alle biochemischen Reaktionen in unseren Zellen.',
    xpReward: 40,
    targetMolecule: MOLECULES_DATA.find(m => m.id === 'h2o')!,
    availableAtomPool: [
      { symbol: 'H', count: 3, valency: 1, color: '#e2e8f0' },
      { symbol: 'O', count: 2, valency: 2, color: '#ef4444' },
      { symbol: 'C', count: 1, valency: 4, color: '#334155' }
    ]
  },
  {
    id: 'el_puzzle_05',
    title: 'Der Code des Chemikers',
    room: 'elemental_lab',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 3, // Lithium
    type: 'lab_door_cipher',
    difficulty: 'beginner',
    missionNumber: 5,
    doorName: 'Vorratslager-Brandschutztür B-04',
    question: 'Entschlüssele den dreistelligen Sicherheitscode der Brandschutztür!',
    loreContext: 'Die Zwischentür zum Vorratslager ist verriegelt. Neben der Tastatur klebt eine Notiz des leitenden Professors mit chemischen Rätselhinweisen.',
    cipherClues: [
      'Erste Ziffer: Die Anzahl der Protonen im Kohlenstoff-Atomkern (C)',
      'Zweite Ziffer: Die Ordnungszahl des leichtesten Elements im Universum (H)',
      'Dritte Ziffer: Die Anzahl der Valenzelektronen von Lithium (Gruppe 1 des Periodensystems)'
    ],
    requiredCode: '611',
    keypadType: 'numbers',
    options: ['611', '812', '621', '121'],
    scientificReason: 'Kohlenstoff (C) = 6 Protonen; Wasserstoff (H) = Ordnungszahl 1; Lithium (Li, 1. Hauptgruppe) = 1 Valenzelektron. Ergibt den Code 611.',
    hint: 'Schau auf das Periodensystem: Welche Ordnungszahl hat C? Welche H? Und wie viele Außenelektronen hat ein Alkalimetall?',
    detailedHint: 'C steht an Stelle 6, H an Stelle 1, und alle Alkalimetalle der 1. Gruppe haben genau 1 Außenelektron. Code: 6 - 1 - 1.',
    didacticExplanation: 'Zugang gewährt! Du hast Protonenzahlen und Valenzelektronen logisch kombiniert. Das Periodensystem ist wie eine Landkarte der Atomstrukturen geordnet.',
    commonMistakeExplanation: 'Verwechsle nicht Atommasse mit Protonenzahl. Kohlenstoff wiegt rund 12 u, hat aber genau 6 Protonen.',
    realWorldExample: 'Die Anzahl der Außenelektronen (Valenzelektronen) bestimmt das chemische Reaktionsverhalten von Elementen.',
    xpReward: 45
  },
  {
    id: 'el_puzzle_06',
    title: 'Analyseprobe X-21: Das weiße Pulver',
    room: 'elemental_lab',
    moduleId: 'module_f',
    rewardElementAtomicNumber: 11, // Natrium
    type: 'substance_analysis',
    difficulty: 'beginner',
    missionNumber: 6,
    question: 'Führe virtuelle Tests an Probe X-21 durch und bestimme die chemische Identität!',
    loreContext: 'Auf dem Labortisch steht eine unbeschriftete Kristallschale mit einem feinen weißen Pulver. Bevor der Arbeitsplatz gereinigt werden kann, muss der Stoff sicher identifiziert werden.',
    hint: 'Achte auf die Flammenfärbung: Natrium färbt eine Bunsenbrennerflamme intensiv leuchtend gelb.',
    detailedHint: 'Sehr gut wasserlöslich, leitet als Lösung den Strom (Elektrolyt) und schmeckt salzig: Es handelt sich um Natriumchlorid (Kochsalz).',
    didacticExplanation: 'Präzise Analytik! Natriumchlorid (NaCl) dissoziiert in Wasser zu frei beweglichen Na⁺- und Cl⁻-Ionen, die Strom leiten. Die Flammenfärbung bestätigt das Natriumkation.',
    commonMistakeExplanation: 'Zucker (Saccharose) löst sich zwar auch im Wasser, bildet aber keine Ionen und leitet daher keinen elektrischen Strom!',
    realWorldExample: 'Klassische chemische Kationennachweise nutzen Flammenfärbungen – z. B. auch bei buntem Feuerwerk am Silvesterhimmel.',
    xpReward: 50,
    sample: {
      id: 'substance_nacl',
      name: 'Probe X-21',
      formula: 'NaCl',
      appearance: 'Weißes, geruchloses kristallines Pulver',
      state: 'solid',
      solubilityInWater: 'very_soluble',
      pHValue: 7.0,
      flameTestColor: 'Intensives, leuchtendes Gelb (charakteristisch für Natrium)',
      conductivity: 'leiter',
      hintClues: [
        'Löst sich vollständig und klar in Wasser auf',
        'Die wässrige Lösung leitet elektrischen Strom sehr gut',
        'pH-Wert der Lösung ist exakt 7 (neutral)',
        'Flammenprobe: Kräftige gelbe Flammenfärbung'
      ],
      safeLabWarning: 'Im Labor niemals Proben mit dem Mund probieren! Nutze ausschließlich spektroskopische und physikalische Tests.',
      correctIdentity: 'Natriumchlorid (Kochsalz, NaCl)'
    },
    testOptions: [
      {
        id: 'flame',
        testName: 'Flammenfärbung (Bunsenbrenner)',
        observation: 'Die Probe färbt die Flamme intensiv hellgelb!',
        safeProcedure: 'Etwas Substanz mit einer Magnesiastäbchenöse in die nicht leuchtende Bunsenbrennerflamme halten.'
      },
      {
        id: 'conductivity',
        testName: 'Leitfähigkeitsprüfung der Lösung',
        observation: 'Die Prüflampe leuchtet hell auf: Ionen leiten den Strom.',
        safeProcedure: 'Substanz in destilliertem Wasser lösen und Elektroden eintauchen.'
      },
      {
        id: 'ph',
        testName: 'pH-Indikatorstreifen',
        observation: 'Der Teststreifen bleibt grün: pH-Wert = 7.0 (neutral).',
        safeProcedure: 'Einen Tropfen der Lösung auf Universalindikatorpapier geben.'
      }
    ],
    candidateChoices: [
      'Natriumchlorid (Kochsalz, NaCl)',
      'Saccharose (Haushaltszucker, C12H22O11)',
      'Calciumcarbonat (Kalk, CaCO3)',
      'Kupfersulfat (CuSO4)'
    ]
  },
  {
    id: 'el_puzzle_07',
    title: 'Die Gleichung der Knallgasreaktion',
    room: 'elemental_lab',
    moduleId: 'module_c',
    rewardElementAtomicNumber: 17, // Chlor
    type: 'equation_balancer',
    difficulty: 'beginner',
    missionNumber: 7,
    question: 'Bringe die chemische Gleichung der Wassersynthese ins Gleichgewicht!',
    loreContext: 'Am Hauptwanddisplay des Reaktionsbereichs blinkt eine unvollständige Gleichung. Vor dem Start der Syntheseanlage müssen die Koeffizienten stimmen.',
    hint: 'Zähle die Atome: Links sind in O₂ zwei Sauerstoffatome. Rechts im H₂O ist nur eines. Du brauchst also 2 H₂O!',
    detailedHint: 'Setze 2 vor H₂ und 2 vor H₂O. Dann hast du links: 4 H und 2 O; rechts: 4 H und 2 O.',
    didacticExplanation: 'Gleichung perfekt ausbalanciert! 2 H₂ + 1 O₂ → 2 H₂O. Atome können bei einer chemischen Reaktion weder entstehen noch vergehen (Gesetz von Lavoisier).',
    commonMistakeExplanation: 'Man darf niemals die kleinen Indexzahlen in den Formeln ändern (z. B. H2O zu H2O2 machen), sondern nur die großen Koeffizienten vor den Molekülen anpassen!',
    realWorldExample: 'Chemieingenieure müssen jede industrielle Synthese exakt berechnen, damit keine teuren Rohstoffe unverbraucht verloren gehen.',
    xpReward: 45,
    reaction: REACTIONS_DATA[0] // Wassersynthese
  },
  {
    id: 'el_puzzle_08',
    title: 'Fallakte 01: Das angelaufene Silberbesteck',
    room: 'elemental_lab',
    moduleId: 'module_e',
    rewardElementAtomicNumber: 79, // Gold
    type: 'mystery_detective',
    difficulty: 'advanced',
    missionNumber: 8,
    question: 'Untersuche die Beweise und bestimme die wissenschaftlich korrekte Ursache!',
    caseTitle: 'Das Geheimnis der schwarzen Gabeln',
    caseReport: 'Im historischen Speisesaal des Instituts ist das ehemals glänzende Silberbesteck dunkelgrau bis tiefschwarz angelaufen. Ein Mitarbeiter vermutet einfachen Dreck oder Staub, doch die Analyse zeigt eine chemische Umwandlung.',
    loreContext: 'Als wissenschaftlicher Chefermittler wirst du gerufen, um den chemischen Vorgang aufzuklären.',
    hint: 'Reines Silber reagiert an der Luft nicht mit Sauerstoff (es ist ein Edelmetall), aber sehr empfindlich mit Spuren von Schwefelverbindungen (z.B. aus Eiern oder Schwefelwasserstoff in der Luft).',
    detailedHint: 'Der schwarze Belag ist Silbersulfid (Ag₂S). Schwefelhaltige Proteine oder Gase sind die Täter.',
    didacticExplanation: 'Exzellente Detektivarbeit! Silber ist zwar edel und oxidiert nicht mit Sauerstoff, reagiert aber spontan mit Schwefelwasserstoff (H₂S) zu schwarzem Silbersulfid (Ag₂S).',
    commonMistakeExplanation: 'Es handelt sich nicht um Rost (Eisenoxid), denn Silber enthält kein Eisen. Auch ist es keine Rußablagerung, sondern eine echte chemische Verbindung.',
    realWorldExample: 'Gekochte Eier enthalten schwefelhaltige Aminosäuren. Isst man ein Ei mit einem Silberlöffel, läuft dieser sofort dunkel an!',
    xpReward: 60,
    evidenceItems: [
      {
        title: 'Beweis A: Chemische Analyse des Belags',
        fact: 'Die Schicht besteht aus Silberatomen (Ag) und Schwefelatomen (S) im Verhältnis 2:1 (Ag₂S).'
      },
      {
        title: 'Beweis B: Umgebungsbericht',
        fact: 'In der Nähe wurden frische Eierspeisen zubereitet und ein alter Gummischlauch gelagert (beides schwefelhaltig).'
      },
      {
        title: 'Beweis C: Beständigkeitstest',
        fact: 'Der schwarze Belag lässt sich mit Wasser und Spülmittel nicht abwaschen, löst sich aber bei einer elektrochemischen Reduktion in Alufolie mit Salzwasser.'
      }
    ],
    hypotheses: [
      {
        id: 'hyp_1',
        text: 'Silber reagiert mit Schwefelverbindungen aus Luft und Nahrung zu schwarzem Silbersulfid (Ag₂S).',
        isCorrect: true,
        scientificCritique: 'Vollkommen zutreffend! Dies ist die exakte chemische Erklärung für das Anlaufen von Silber.'
      },
      {
        id: 'hyp_2',
        text: 'Das Silber ist durch Sauerstoff verrostet, genau wie eine alte Eisenstange im Regen.',
        isCorrect: false,
        scientificCritique: 'Falsch: Silber ist ein Edelmetall und bildet an normaler Luft kein stabiles Oxid. Rost existiert nur bei Eisen.'
      },
      {
        id: 'hyp_3',
        text: 'Es handelt sich lediglich um gewöhnlichen Fett- und Küchenstaub, der mechanisch anhaftet.',
        isCorrect: false,
        scientificCritique: 'Widerlegt: Beweis C zeigt, dass normales Waschen versagt, weil eine echte chemische Bindung vorliegt.'
      }
    ]
  },
  {
    id: 'el_puzzle_09',
    title: 'Physikalisch oder Chemisch?',
    room: 'elemental_lab',
    moduleId: 'module_f',
    rewardElementAtomicNumber: 12, // Magnesium
    type: 'true_false',
    difficulty: 'beginner',
    missionNumber: 9,
    question: 'Bewerte diesen physikalisch-chemischen Vorgang:',
    statement: 'Wenn Eiswürfel im Glas zu flüssigem Wasser schmelzen, handelt es sich um eine chemische Reaktion.',
    isTrue: false,
    loreContext: 'Die Umweltstation des Elementarlabors überwacht Phasenumwandlungen im Kühlkreislauf.',
    hint: 'Ändert sich die Molekülformel beim Schmelzen von Eis, oder bleiben es weiterhin H₂O-Moleküle?',
    detailedHint: 'Beim Schmelzen ändert sich nur der Aggregatzustand (die Anordnung der Moleküle). Es entstehen keine neuen Stoffe.',
    didacticExplanation: 'Richtig erkannt: Falsch! Schmelzen ist eine rein physikalische Zustandsänderung (Phasenübergang). Sowohl Eis als auch flüssiges Wasser und Wasserdampf bestehen aus identischen H₂O-Molekülen.',
    commonMistakeExplanation: 'Bei einer chemischen Reaktion müssen chemische Bindungen gebrochen und neue Stoffe mit veränderten Eigenschaften gebildet werden. Beim Schmelzen ändern sich nur die Abstände zwischen den unveränderten Molekülen.',
    realWorldExample: 'Wenn Schokolade in der Sonne schmilzt, ist das physikalisch. Verbrennt man sie im Ofen zu Asche und Rauch, ist das chemisch.',
    xpReward: 30
  },
  {
    id: 'el_puzzle_10',
    title: 'Die Trennlinie der Elemente',
    room: 'elemental_lab',
    moduleId: 'module_a',
    rewardElementAtomicNumber: 26, // Eisen
    type: 'periodic_table_quiz',
    difficulty: 'beginner',
    missionNumber: 10,
    question: 'Welches dieser Elemente ist ein reaktives Übergangsmetall und lebensnotwendig für den menschlichen Sauerstofftransport im roten Blutfarbstoff?',
    loreContext: 'Zum Abschluss der Elementarlabor-Prüfung testet das System dein Verständnis über Spurenelemente und Metalle.',
    hint: 'Achtung: Im Hämoglobin bindet ein Übergangsmetall den Sauerstoff. Symbol: Fe (Ferrum).',
    detailedHint: 'Suche in Periode 4, Gruppe 8. Ordnungszahl 26.',
    didacticExplanation: 'Glückwunsch! Eisen (Fe) ist ein Übergangsmetall (Ordnungszahl 26). Ein Fe²⁺-Kation sitzt im Zentrum des Häm-Komplexes und bindet reversibel das O₂-Molekül.',
    commonMistakeExplanation: 'Sauerstoff transportiert sich nicht selbst – er benötigt das zweiwertige Eisenkation als molekulare Andockstation in unseren roten Blutkörperchen.',
    realWorldExample: 'Eisenmangel führt zu Müdigkeit, weil die Muskeln und das Gehirn zu wenig Sauerstoff erhalten.',
    xpReward: 40,
    targetSymbol: 'Fe',
    criteriaDescription: 'Übergangsmetall der 4. Periode mit Ordnungszahl 26',
    clues: [
      'Ordnungszahl: 26',
      'Symbol: Fe',
      'Gruppe: 8 (Übergangsmetalle)',
      'Zentrales Atom im roten Blutfarbstoff Hämoglobin'
    ]
  },

  // ==========================================
  // RAUM 2: DIE ATOMKAMMER (4 Rätsel)
  // ==========================================
  {
    id: 'atom_puzzle_01',
    title: 'Der Kern des Leuchtens',
    room: 'atom_chamber',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 10, // Neon
    type: 'periodic_table_quiz',
    difficulty: 'beginner',
    missionNumber: 1,
    question: 'Welches Edelgas besitzt genau 10 Protonen und 10 Elektronen?',
    loreContext: 'In der Atomkammer untersuchst du die Kernladungszahlen stabiler Atome mit vollbesetzten Schalen.',
    hint: 'Es steht in Periode 2, Gruppe 18 und leuchtet intensiv orangerot in Gasentladungsröhren.',
    detailedHint: 'Ordnungszahl 10 entspricht dem Edelgas Neon (Ne).',
    didacticExplanation: 'Korrekt! Neon hat die Ordnungszahl 10, besitzt 10 Protonen im Kern und eine vollständig mit 8 Valenzelektronen gefüllte L-Schale (Edelgaskonfiguration).',
    commonMistakeExplanation: 'Helium hat nur 2 Protonen, Argon dagegen 18 Protonen. Nur Neon hat genau 10 Protonen.',
    realWorldExample: 'Klassische rote Neon-Reklameschilder über Theatern und Kinos.',
    xpReward: 40,
    targetSymbol: 'Ne',
    criteriaDescription: 'Edelgas mit genau 10 Protonen und 10 Elektronen',
    clues: ['Ordnungszahl: 10', 'Gruppe: 18 (Edelgase)', 'Periode: 2']
  },
  {
    id: 'atom_puzzle_02',
    title: 'Das Codeschloss der Ionenfalle',
    room: 'atom_chamber',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 9, // Fluor
    type: 'lab_door_cipher',
    difficulty: 'advanced',
    missionNumber: 2,
    doorName: 'Ionenspeicher-Magnetkammer',
    question: 'Berechne den 3-stelligen Code aus den Ladungen und Elektronenzahlen!',
    loreContext: 'Die Ionenfalle hält geladene Teilchen in einem Magnetfeld gefangen. Der Code berechnet sich aus Atombausteinen.',
    cipherClues: [
      'Ziffer 1: Anzahl der Protonen in einem Fluoratom (F)',
      'Ziffer 2: Elektronen auf der innersten K-Schale eines beliebigen Atoms (außer H)',
      'Ziffer 3: Ladungszahl eines Natriumkations (Na⁺)'
    ],
    requiredCode: '921',
    keypadType: 'numbers',
    options: ['921', '721', '911', '920'],
    scientificReason: 'Fluor = 9 Protonen; K-Schale fasst max. 2 Elektronen; Natriumion Na⁺ hat eine einfache positive Ladung (+1). Code: 921.',
    hint: 'Fluor hat Ordnungszahl 9. Die erste Schale (K-Schale) fasst maximal 2 Elektronen.',
    detailedHint: 'Code: 9 (Protonen F) - 2 (K-Schale voll) - 1 (Ladung Na+).',
    didacticExplanation: 'Hervorragend! Ionen entstehen, wenn Atome Elektronen abgeben (positiv geladene Kationen wie Na⁺) oder aufnehmen (negativ geladene Anionen wie F⁻).',
    commonMistakeExplanation: 'Die Kernladung (Protonen) ändert sich bei der Ionenbildung niemals – nur die Anzahl der Elektronen in der Hülle variiert!',
    realWorldExample: 'Lithium- und Natriumionen wandern beim Laden und Entladen in modernen Akkumulatoren.',
    xpReward: 45
  },
  {
    id: 'atom_puzzle_03',
    title: 'Atomhülle und Ladungsneutralität',
    room: 'atom_chamber',
    moduleId: 'module_b',
    type: 'true_false',
    difficulty: 'explorer',
    missionNumber: 3,
    question: 'Bewerte die Aussage über neutrale Atome:',
    statement: 'In einem elektrisch ungeladenen (neutralen) Atom ist die Anzahl der positiv geladenen Protonen exakt gleich der Anzahl der negativ geladenen Elektronen.',
    isTrue: true,
    loreContext: 'Der Sensor kalibriert das elektrische Feld der Atomkammer.',
    hint: 'Plus und Minus müssen sich gegenseitig aufheben, damit keine Ladung nach außen wirkt.',
    detailedHint: 'Protonen tragen +1, Elektronen -1. Bei gleicher Anzahl ist die Gesamtladung exakt 0.',
    didacticExplanation: 'Richtig! Weil die elektrische Ladung eines Protons (+1e) genau entgegengesetzt gleich der eines Elektrons (-1e) ist, heben sie sich bei gleicher Anzahl nach außen perfekt auf.',
    commonMistakeExplanation: 'Neutronen tragen keine elektrische Ladung, tragen aber zur Masse des Kerns bei.',
    realWorldExample: 'Ein Stück fester Kohlenstoff oder ein Eisenstab fühlt sich elektrisch neutral an, weil Kernladungen und Hüllenelektronen im Gleichgewicht sind.',
    xpReward: 35
  },
  {
    id: 'atom_puzzle_04',
    title: 'Fallakte 02: Die Radiokarbon-Zeitreise',
    room: 'atom_chamber',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 6, // Kohlenstoff
    type: 'mystery_detective',
    difficulty: 'advanced',
    missionNumber: 4,
    question: 'Welches Phänomen ermöglicht es Archäologen, das Alter uralter Holzfunde exakt zu bestimmen?',
    caseTitle: 'Das Geheimnis der Wikinger-Schiffsrümpfe',
    caseReport: 'In einem Labor werden Holzreste eines Wikingerschiffes untersucht. Der Forscher stellt fest, dass ein bestimmtes Kohlenstoff-Isotop langsam zerfällt.',
    loreContext: 'Ein historisches Rätsel über Isotope und Radioaktivität.',
    hint: 'Isotope eines Elements haben gleich viele Protonen, aber unterschiedlich viele Neutronen. Das seltene Kohlenstoff-14 (C-14) ist instabil und zerfällt mit einer Halbwertszeit von ca. 5730 Jahren.',
    detailedHint: 'Das Verhältnis von C-14 zu stabilem C-12 verrät das Alter seit dem Absterben des Baumes.',
    didacticExplanation: 'Präzise detektiert! Alle lebenden Organismen nehmen über die Nahrung oder Fotosynthese Kohlenstoff auf. Nach dem Tod stoppt die Aufnahme, und das instabile C-14-Isotop zerfällt messbar.',
    commonMistakeExplanation: 'C-12 ist absolut stabil und zerfällt nie. Nur das seltene Isotop C-14 (mit 8 Neutronen statt 6) ist radioaktiv.',
    realWorldExample: 'Mit der C-14-Methode wurde das Alter der Gletschermumie „Ötzi“ auf ca. 5300 Jahre datiert.',
    xpReward: 55,
    evidenceItems: [
      { title: 'Beweis A: Isotopenverteilung', fact: 'Normaler Kohlenstoff ist C-12 (6 Protonen, 6 Neutronen). In der Atmosphäre gibt es Spuren von C-14 (6 Protonen, 8 Neutronen).' },
      { title: 'Beweis B: Biologischer Stopp', fact: 'Solange ein Baum lebt, entspricht sein C-14-Anteil dem der Luft. Stirbt das Holz ab, zerfällt C-14 kontinuierlich.' },
      { title: 'Beweis C: Halbwertszeit', fact: 'Nach 5730 Jahren ist genau die Hälfte der C-14-Kerne zerfallen.' }
    ],
    hypotheses: [
      {
        id: 'hyp_c14',
        text: 'Instabile Kohlenstoff-14-Isotope zerfallen nach dem Absterben des Holzes mit bekannter Halbwertszeit.',
        isCorrect: true,
        scientificCritique: 'Exakt! Dies ist die physikalisch-chemische Grundlage der C-14-Radiokarbondatierung.'
      },
      {
        id: 'hyp_wood_rot',
        text: 'Bakterien fressen bevorzugt Eisenatome im Holz, was das Alter anzeigt.',
        isCorrect: false,
        scientificCritique: 'Falsch: Holz besteht aus Cellulose (Kohlenstoff, Wasserstoff, Sauerstoff), nicht aus Eisen.'
      }
    ]
  },

  // ==========================================
  // RAUM 3: DIE MOLEKÜLWERKSTATT (4 Rätsel)
  // ==========================================
  {
    id: 'mol_puzzle_01',
    title: 'Erdgas-Synthese: Das Methanmolekül',
    room: 'molecule_workshop',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 1, // Wasserstoff
    type: 'molecule_builder',
    difficulty: 'beginner',
    missionNumber: 1,
    question: 'Konstruiere das Methan-Molekül (CH₄) mit voller Tetraeder-Valenz!',
    loreContext: 'Die Triebwerke der Labor-Generatoren benötigen Erdgas. Baue das einfachste Kohlenwasserstoff-Molekül zusammen.',
    hint: 'Kohlenstoff (C) benötigt 4 Bindungen, Wasserstoff (H) jeweils 1 Bindung.',
    detailedHint: 'Verwende 1 Kohlenstoffatom und 4 Wasserstoffatome im Baukasten.',
    didacticExplanation: 'Perfekt gebaut! Methan (CH₄) ist ein symmetrisches Molekül. Der vierwertige Kohlenstoff teilt sich mit 4 Wasserstoffen je ein Elektronenpaar (kovalente Einfachbindung).',
    commonMistakeExplanation: 'Kohlenstoff kann in stabilen Molekülen praktisch nie nur 2 oder 3 Bindungen haben – er strebt nach der Oktettregel mit 8 Valenzelektronen.',
    realWorldExample: 'Methan ist der Hauptbestandteil von Erdgas und Biogas zum Heizen und Kochen.',
    xpReward: 40,
    targetMolecule: MOLECULES_DATA.find(m => m.id === 'ch4')!,
    availableAtomPool: [
      { symbol: 'C', count: 1, valency: 4, color: '#334155' },
      { symbol: 'H', count: 5, valency: 1, color: '#e2e8f0' },
      { symbol: 'O', count: 1, valency: 2, color: '#ef4444' }
    ]
  },
  {
    id: 'mol_puzzle_02',
    title: 'Treibhausgas-Synthese: Kohlenstoffdioxid',
    room: 'molecule_workshop',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 6, // Kohlenstoff
    type: 'molecule_builder',
    difficulty: 'beginner',
    missionNumber: 2,
    question: 'Baue ein Kohlenstoffdioxid-Molekül (CO₂) zusammen!',
    loreContext: 'Die Gewächshauskuppel des Umweltlabors benötigt CO₂ für die Pflanzenfotosynthese.',
    hint: 'Im CO₂ bildet das zentrale Kohlenstoffatom zu zwei Sauerstoffatomen jeweils eine Doppelbindung aus.',
    detailedHint: 'Kombiniere 1 Kohlenstoffatom mit 2 Sauerstoffatomen.',
    didacticExplanation: 'Hervorragend! Im CO₂-Molekül (O=C=O) sind alle Valenzen perfekt gesättigt. Kohlenstoff bildet zwei kovalente Doppelbindungen.',
    commonMistakeExplanation: 'CO ist Kohlenstoffmonoxid (giftig!). CO₂ ist Kohlenstoffdioxid mit 2 Sauerstoffatomen.',
    realWorldExample: 'Pflanzen spalten CO₂ im Sonnenlicht und bauen daraus Glucose (Zucker) und Sauerstoff auf.',
    xpReward: 45,
    targetMolecule: MOLECULES_DATA.find(m => m.id === 'co2')!,
    availableAtomPool: [
      { symbol: 'C', count: 2, valency: 4, color: '#334155' },
      { symbol: 'O', count: 3, valency: 2, color: '#ef4444' },
      { symbol: 'H', count: 2, valency: 1, color: '#e2e8f0' }
    ]
  },
  {
    id: 'mol_puzzle_03',
    title: 'Dünger-Baustein: Ammoniak (NH₃)',
    room: 'molecule_workshop',
    moduleId: 'module_b',
    rewardElementAtomicNumber: 7, // Stickstoff
    type: 'molecule_builder',
    difficulty: 'advanced',
    missionNumber: 3,
    question: 'Setze das Ammoniak-Molekül (NH₃) aus Stickstoff und Wasserstoff zusammen!',
    loreContext: 'Die Stickstoff-Syntheseanlage benötigt Ammoniak als Ausgangsstoff.',
    hint: 'Stickstoff (N) ist dreiwertig und bindet drei Wasserstoffatome (H).',
    detailedHint: 'Füge 1 Stickstoffatom und 3 Wasserstoffatome in die Kammer ein.',
    didacticExplanation: 'Struktur vollendet! Das NH₃-Molekül hat die Form einer dreiseitigen Pyramide mit einem freien Elektronenpaar an der Spitze des Stickstoffatoms.',
    commonMistakeExplanation: 'Reiner Stickstoff in der Luft ist N₂. Im Ammoniak ist ein N mit 3 H-Atomen verknüpft.',
    realWorldExample: 'Ammoniak wird industriell zur Herstellung von Düngemitteln verwendet, um Getreidefelder fruchtbar zu machen.',
    xpReward: 50,
    targetMolecule: MOLECULES_DATA.find(m => m.id === 'nh3')!,
    availableAtomPool: [
      { symbol: 'N', count: 1, valency: 3, color: '#38bdf8' },
      { symbol: 'H', count: 4, valency: 1, color: '#e2e8f0' },
      { symbol: 'O', count: 1, valency: 2, color: '#ef4444' }
    ]
  },
  {
    id: 'mol_puzzle_04',
    title: 'Atom vs. Molekül vs. Verbindung',
    room: 'molecule_workshop',
    moduleId: 'module_b',
    type: 'true_false',
    difficulty: 'beginner',
    missionNumber: 4,
    question: 'Prüfe diesen sprachlichen und fachlichen Unterschied:',
    statement: 'Jede chemische Verbindung ist aus Molekülen oder Ionen aufgebaut, aber nicht jedes Molekül ist eine chemische Verbindung (z. B. besteht O₂ aus nur einer Atomsorte).',
    isTrue: true,
    loreContext: 'Der Didaktik-Leitfaden des Instituts schärft den exakten Gebrauch von Fachbegriffen.',
    hint: 'Eine "Verbindung" erfordert mindestens zwei verschiedene chemische Elemente. O₂ besteht nur aus Sauerstoff.',
    detailedHint: 'O₂ ist ein Molekül, aber ein Element. H₂O ist ein Molekül UND eine chemische Verbindung.',
    didacticExplanation: 'Präzise differenziert! O₂ oder N₂ sind Moleküle, aber reine Elemente, da sie nur aus einer Atomsorte bestehen. H₂O oder CO₂ bestehen aus verschiedenen Elementen und sind daher echte Verbindungen.',
    commonMistakeExplanation: 'Im Alltag werden "Stoff", "Molekül" und "Verbindung" oft verwechselt. Wissenschaftlich ist die Unterscheidung glasklar.',
    realWorldExample: 'Sauerstoffgas in der Atemluft liegt fast ausschließlich als zweiatomiges Molekül O₂ vor.',
    xpReward: 35
  },

  // ==========================================
  // RAUM 4: DER REAKTIONSRAUM (4 Rätsel)
  // ==========================================
  {
    id: 'rx_puzzle_01',
    title: 'Verbrennung von Methan',
    room: 'reaction_room',
    moduleId: 'module_c',
    rewardElementAtomicNumber: 6, // Kohlenstoff
    type: 'equation_balancer',
    difficulty: 'advanced',
    missionNumber: 1,
    question: 'Gleiche die Verbrennung von Erdgas (CH₄ + O₂ → CO₂ + H₂O) stöchiometrisch aus!',
    loreContext: 'In der Brennkammer des Reaktionsraums muss das Brennstoff-Sauerstoff-Verhältnis exakt stimmen.',
    hint: '1 CH₄ liefert 4 H-Atome, braucht also rechts 2 H₂O. Zähle danach den gesamten Sauerstoff!',
    detailedHint: 'Links: 1 CH₄ + 2 O₂. Rechts: 1 CO₂ + 2 H₂O. Beide Seiten haben dann: 1 C, 4 H, 4 O.',
    didacticExplanation: 'Gleichung balanciert! 1 CH₄ + 2 O₂ → 1 CO₂ + 2 H₂O. Vollständige Verbrennung erzeugt blaues Licht und saubere Verbrennungsprodukte.',
    commonMistakeExplanation: 'Vergiss nicht, dass sowohl im CO₂ als auch im H₂O Sauerstoffatome stecken, die addiert werden müssen!',
    realWorldExample: 'Bei unzureichender Sauerstoffzufuhr (weniger als 2 O₂) entsteht gefährliches Kohlenmonoxid (CO).',
    xpReward: 50,
    reaction: REACTIONS_DATA[1]
  },
  {
    id: 'rx_puzzle_02',
    title: 'Die Haber-Bosch-Reaktionsschleife',
    room: 'reaction_room',
    moduleId: 'module_c',
    rewardElementAtomicNumber: 7, // Stickstoff
    type: 'equation_balancer',
    difficulty: 'advanced',
    missionNumber: 2,
    question: 'Bringe die Stickstoff-Wasserstoff-Synthese ins stöchiometrische Gleichgewicht!',
    loreContext: 'Am Hochdruckreaktor soll die Ammoniaksynthese gestartet werden.',
    hint: 'N₂ hat 2 N-Atome, rechts entstehen 2 NH₃. Wie viele H-Atome (H₂) brauchst du für 6 H?',
    detailedHint: '1 N₂ + 3 H₂ → 2 NH₃.',
    didacticExplanation: 'Perfekt ausgerechnet! 1 N₂ + 3 H₂ → 2 NH₃. 2 N-Atome und 6 H-Atome auf beiden Seiten.',
    commonMistakeExplanation: 'Man kann nicht einfach "N + 3 H" schreiben, da Stickstoff und Wasserstoff als zweiatomige Gase (N₂, H₂) vorkommen.',
    realWorldExample: 'Rund 1-2 % der gesamten weltweiten Energie wird für diese Reaktion zur Düngemittelherstellung aufgewendet.',
    xpReward: 55,
    reaction: REACTIONS_DATA[2]
  },
  {
    id: 'rx_puzzle_03',
    title: 'Heftige Vereinigung: Kochsalz-Synthese',
    room: 'reaction_room',
    moduleId: 'module_c',
    rewardElementAtomicNumber: 11, // Natrium
    type: 'equation_balancer',
    difficulty: 'beginner',
    missionNumber: 3,
    question: 'Gleiche die Bildung von Natriumchlorid aus Natrium und Chlorgas aus!',
    loreContext: 'In der Schutzgas-Glocke reagiert gelbes Natriummetall mit grünem Chlorgas.',
    hint: 'Chlorgas liegt als Cl₂ vor. Rechts entstehen 2 NaCl. Wie viele Na brauchst du links?',
    detailedHint: '2 Na + 1 Cl₂ → 2 NaCl.',
    didacticExplanation: 'Exakt! 2 Na + 1 Cl₂ → 2 NaCl. Jedes Natrium gibt 1 Elektron an ein Chloratom ab.',
    commonMistakeExplanation: 'Weil Chlor molekular als Cl₂ vorliegt, müssen 2 Natriumatome reagieren.',
    realWorldExample: 'Aus zwei aggressiven Gefahrstoffen entsteht lebensnotwendiges Speisesalz.',
    xpReward: 45,
    reaction: REACTIONS_DATA[3]
  },
  {
    id: 'rx_puzzle_04',
    title: 'Edukt oder Produkt?',
    room: 'reaction_room',
    moduleId: 'module_c',
    type: 'true_false',
    difficulty: 'explorer',
    missionNumber: 4,
    question: 'Bewerte diese Definition der Reaktionskinetik:',
    statement: 'Die Ausgangsstoffe einer chemischen Reaktion nennt man Edukte (Reaktanten), die neu entstandenen Stoffe nennt man Produkte.',
    isTrue: true,
    loreContext: 'Der Einsteiger-Terminal des Reaktionsraums prüft die Reaktionsbegriffe.',
    hint: 'Pfeilrichtung: Edukte (links) → Produkte (rechts).',
    detailedHint: 'Edukte reagieren miteinander und bilden die Produkte.',
    didacticExplanation: 'Richtig! Edukte stehen links vom Reaktionspfeil, Produkte rechts davon.',
    commonMistakeExplanation: 'Manchmal wird im Englischen von "Reactants" gesprochen, im Deutschen heißen die Ausgangsstoffe Edukte.',
    realWorldExample: 'Beim Kuchenbacken sind Mehl, Eier und Zucker die Edukte; der gebackene Kuchen ist das Produkt.',
    xpReward: 30
  },

  // ==========================================
  // RAUM 5: DAS KRISTALLARCHIV (4 Rätsel)
  // ==========================================
  {
    id: 'crys_puzzle_01',
    title: 'Die Ordnung der Salzkristalle',
    room: 'crystal_archive',
    moduleId: 'module_f',
    type: 'true_false',
    difficulty: 'beginner',
    missionNumber: 1,
    question: 'Prüfe die Aussage über Kristallgitter:',
    statement: 'In einem festen Salzkristall (wie Kochsalz) bewegen sich die Ionen frei durch den gesamten Raum, weshalb fester Salzkristall den Strom leitet.',
    isTrue: false,
    loreContext: 'Im Kristallarchiv leuchten gigantische Hologramme kubischer Gitter.',
    hint: 'Können sich Ionen in einem starren Festkörper bewegen, oder sind sie fest auf ihren Gitterplätzen verankert?',
    detailedHint: 'Im festen Kristallgitter sitzen Na⁺ und Cl⁻ fest. Erst beim Schmelzen oder Lösen in Wasser werden sie frei beweglich.',
    didacticExplanation: 'Richtig erkannt: Falsch! Feste Salze leiten den elektrischen Strom NICHT, da die Ionen fest im Kristallgitter arretiert sind. Erst in wässriger Lösung oder als Schmelze sind Ionen mobil.',
    commonMistakeExplanation: 'Metalle leiten festen Strom (durch ein Elektronengas), Salze jedoch nur gelöst oder geschmolzen!',
    realWorldExample: 'Trockenes Kochsalz ist ein Isolator. Löst man es in einer Tasse Wasser, leitet die Lösung sofort Strom.',
    xpReward: 35
  },
  {
    id: 'crys_puzzle_02',
    title: 'Mineralanalyse: Der Säuretest',
    room: 'crystal_archive',
    moduleId: 'module_f',
    rewardElementAtomicNumber: 20, // Calcium
    type: 'substance_analysis',
    difficulty: 'advanced',
    missionNumber: 2,
    question: 'Führe den Säuretest durch und identifiziere das unbekannte Karbonatgestein!',
    loreContext: 'Ein Fundstück aus einer Höhle soll mineralogisch bestimmt werden.',
    hint: 'Karbonate brausen bei Zugabe von verdünnter Säure heftig auf, weil Kohlenstoffdioxid-Gas (CO₂) entweicht.',
    detailedHint: 'Calciumcarbonat (Kalk, CaCO₃) reagiert mit Säure unter starker CO₂-Gasentwicklung.',
    didacticExplanation: 'Kalkstein (CaCO₃) nachgewiesen! Die Säure verdrängt die schwächere Kohlensäure, die sofort zu Wasser und CO₂-Gas zerfällt (Aufbrausen).',
    commonMistakeExplanation: 'Gips (Calciumsulfat) braust mit Säure nicht auf, Quarz (SiO₂) reagiert gar nicht.',
    realWorldExample: 'Geologen träufeln im Gelände einen Tropfen Essig- oder Salzsäure auf Steine, um Kalkstein sofort zu erkennen.',
    xpReward: 50,
    sample: {
      id: 'substance_caco3',
      name: 'Gesteinsprobe K-09',
      formula: 'CaCO₃',
      appearance: 'Weißes bis hellgraues dichtes Gesteinsstück',
      state: 'solid',
      solubilityInWater: 'insoluble',
      pHValue: 8.0,
      conductivity: 'isolator',
      hintClues: ['Nahezu unlöslich in reinem Wasser', 'Braust bei Säurezugabe heftig sprudelnd auf', 'Färbt Bunsenbrennerflamme ziegelrot (Calcium)'],
      safeLabWarning: 'Säuretest nur mit Schutzbrille durchführen.',
      correctIdentity: 'Calciumcarbonat (Kalkstein, CaCO₃)'
    },
    testOptions: [
      {
        id: 'acid',
        testName: 'Säuretest (Salzsäure/Essigsäure)',
        observation: 'Heftiges Sprudeln und Aufschäumen! Gasbläschen (CO₂) steigen empor.',
        safeProcedure: 'Einen Tropfen verdünnte Säure auf die Probe geben.'
      },
      {
        id: 'water_sol',
        testName: 'Löslichkeitstest in Wasser',
        observation: 'Die Probe löst sich selbst nach Rühren nicht auf.',
        safeProcedure: 'Probe mit demineralisiertem Wasser versetzen.'
      },
      {
        id: 'flame',
        testName: 'Flammenfärbung',
        observation: 'Ziegelrote Flammenfärbung (typisch für Calcium-Kationen).',
        safeProcedure: 'Pulverisierte Probe in die Flamme halten.'
      }
    ],
    candidateChoices: [
      'Calciumcarbonat (Kalkstein, CaCO₃)',
      'Natriumchlorid (Kochsalz, NaCl)',
      'Quarz (Siliciumdioxid, SiO₂)',
      'Kupfersulfat (CuSO₄)'
    ]
  },
  {
    id: 'crys_puzzle_03',
    title: 'Phasenübergänge der Materie',
    room: 'crystal_archive',
    moduleId: 'module_f',
    type: 'element_match',
    difficulty: 'beginner',
    missionNumber: 3,
    question: 'Ordne die thermodynamischen Fachbegriffe den Zustandsänderungen zu!',
    loreContext: 'Der Phasenumwandlungs-Simulator des Kristallarchivs muss rekalibriert werden.',
    hint: 'Sublimieren ist der direkte Übergang von fest zu gasförmig ohne Verflüssigung.',
    detailedHint: 'Fest → Flüssig = Schmelzen; Flüssig → Gas = Verdampfen/Sieden; Fest → Gas = Sublimieren.',
    didacticExplanation: 'Hervorragend! Bei allen Phasenübergängen ändert sich nur die thermische Bewegung der Teilchen, die chemische Formel bleibt identisch.',
    commonMistakeExplanation: 'Sublimieren überspringt den flüssigen Zustand vollständig (z. B. Trockeneis CO₂).',
    realWorldExample: 'Wäsche trocknet im Winter selbst bei Minusgraden im Freien durch Sublimation von Eis zu Wasserdampf.',
    xpReward: 40,
    pairs: [
      { symbol: 'Fest→Flüssig', name: 'Schmelzen', clue: 'Eis wird zu flüssigem Wasser' },
      { symbol: 'Flüssig→Gas', name: 'Verdampfen', clue: 'Wasser kocht im Kessel' },
      { symbol: 'Gas→Flüssig', name: 'Kondensieren', clue: 'Wasserdampf beschlägt am kalten Fenster' },
      { symbol: 'Fest→Gas', name: 'Sublimieren', clue: 'Trockeneis wird ohne Schmelzen direkt zu Gas' }
    ]
  },
  {
    id: 'crys_puzzle_04',
    title: 'Fallakte 03: Echtes Gold oder Narrengold?',
    room: 'crystal_archive',
    moduleId: 'module_f',
    rewardElementAtomicNumber: 79, // Gold
    type: 'mystery_detective',
    difficulty: 'advanced',
    missionNumber: 4,
    question: 'Entlarve die Fälschung anhand der Dichte und Stoffeigenschaften!',
    caseTitle: 'Der verdächtige Klumpen im Kristallgewölbe',
    caseReport: 'Ein Besucher behauptet, einen riesigen 1-Kilogramm-Goldnugget gefunden zu haben. Die optische Farbe glänzt golden, doch das Volumen weckt Zweifel.',
    loreContext: 'Archimedes lässt grüßen: Die Dichte entlarvt das Geheimnis.',
    hint: 'Echtes Gold hat eine gigantische Dichte von ca. 19,3 g/cm³. Katzengold (Pyrit, FeS₂) wiegt bei gleichem Volumen nur rund ein Viertel (ca. 5,0 g/cm³).',
    detailedHint: 'Ein Goldklumpen von 100 cm³ müsste fast 2 Kilogramm wiegen.',
    didacticExplanation: 'Bravo! Durch Verdrängung im Wasserglas (Auftriebsmethode nach Archimedes) lässt sich das exakte Volumen und damit die Dichte (Masse geteilt durch Volumen) zweifelsfrei bestimmen.',
    commonMistakeExplanation: 'Farbe und Glanz können täuschen, physikalische Kennzahlen wie die Dichte lügen nie.',
    realWorldExample: 'Juweliere und Prüfstellen wiegen Gold unter Wasser, um Wolframfälschungen aufzudecken.',
    xpReward: 60,
    evidenceItems: [
      { title: 'Beweis A: Massemessung', fact: 'Der Klumpen wiegt genau 500 Gramm.' },
      { title: 'Beweis B: Wasserverdrängung (Volumen)', fact: 'Beim Eintauchen verdrängt der Klumpen exakt 100 Milliliter (100 cm³) Wasser.' },
      { title: 'Beweis C: Dichteberechnung', fact: 'Dichte = 500 g / 100 cm³ = 5,0 g/cm³. (Gold hätte 19,3 g/cm³).' }
    ],
    hypotheses: [
      {
        id: 'hyp_pyrit',
        text: 'Es handelt sich um Pyrit („Katzengold“, Eisendisulfid FeS₂) mit einer Dichte von 5,0 g/cm³, keinesfalls um echtes Gold.',
        isCorrect: true,
        scientificCritique: 'Exakt begründet! Die berechnete Dichte von 5,0 g/cm³ passt perfekt zu Pyrit, Gold wäre fast viermal schwerer.'
      },
      {
        id: 'hyp_real_gold',
        text: 'Es ist echtes Reingold, das durch kosmische Strahlung an Dichte verloren hat.',
        isCorrect: false,
        scientificCritique: 'Falsch: Die Dichte von reinem Gold ist eine feste physikalische Stoffkonstante.'
      }
    ]
  },

  // ==========================================
  // RAUM 6: DIE WASSERSTATION (4 Rätsel)
  // ==========================================
  {
    id: 'water_puzzle_01',
    title: 'Der pH-Code der Neutralisationsschleuse',
    room: 'water_station',
    moduleId: 'module_d',
    type: 'lab_door_cipher',
    difficulty: 'beginner',
    missionNumber: 1,
    doorName: 'Neutralisations-Schleusentor',
    question: 'Ermittle den 3-stelligen Freischaltcode anhand der pH-Werte!',
    loreContext: 'Die Abwasserreinigungsstufe schließt bei extremen pH-Werten ab. Nur der neutrale Code öffnet das Tor.',
    cipherClues: [
      'Erste Ziffer: Der pH-Wert von reinem, neutralem Wasser bei 25 °C',
      'Zweite Ziffer: pH-Wert einer starken Säure (typischer Wert im Magensaft: pH 1 bis 2)',
      'Dritte Ziffer: Ein typischer basischer pH-Wert von milder Seifenlösung (pH 9 bis 10)'
    ],
    requiredCode: '719',
    keypadType: 'numbers',
    options: ['719', '700', '179', '729'],
    scientificReason: 'Neutral = pH 7; Magensäure = pH 1; Seifenlauge = pH 9. Ergibt 719.',
    hint: 'pH 7 ist exakt neutral (weder sauer noch basisch). Werte unter 7 sind sauer, über 7 basisch (alkalisch).',
    detailedHint: 'Code: 7 (Neutral) - 1 (Sauer) - 9 (Basisch).',
    didacticExplanation: 'Zugang autorisiert! Die pH-Skala ist logarithmisch: Eine Änderung um 1 pH-Stufe bedeutet eine zehnfache Änderung der Hydronium-Ionen-Konzentration (H₃O⁺).',
    commonMistakeExplanation: 'pH 0 bedeutet nicht "keine Säure", sondern extrem stark sauer!',
    realWorldExample: 'Blut hat einen lebenswichtigen pH-Pufferbereich von exakt 7,35 bis 7,45.',
    xpReward: 45
  },
  {
    id: 'water_puzzle_02',
    title: 'Wasser als Dipolmolekül',
    room: 'water_station',
    moduleId: 'module_e',
    rewardElementAtomicNumber: 8, // Sauerstoff
    type: 'true_false',
    difficulty: 'beginner',
    missionNumber: 2,
    question: 'Bewerte die Molekülstruktur des Wassers:',
    statement: 'Weil Sauerstoff elektronegativer als Wasserstoff ist und das Wassermolekül gewinkelt ist, besitzt Wasser einen positiven und einen negativen Ladungspol (Dipol).',
    isTrue: true,
    loreContext: 'Das Spektrometer analysiert die Oberflächenspannung des Wassers.',
    hint: 'Sauerstoff zieht die Bindungselektronen stärker an sich (partiell negativ, δ⁻).',
    detailedHint: 'Die gewinkelte Struktur (ca. 104,5°) verhindert, dass sich die Ladungsschwerpunkte aufheben.',
    didacticExplanation: 'Vollkommen richtig! Der Dipolcharakter ermöglicht Wasserstoffbrückenbindungen. Daher siedet Wasser erst bei 100 °C und besitzt eine Dichteanomalie.',
    commonMistakeExplanation: 'Wäre Wasser linear (wie CO₂), würden sich die Dipole aufheben und Wasser wäre bei Raumtemperatur ein Gas!',
    realWorldExample: 'Wasserläufer können über Teiche laufen, weil Wasserstoffbrücken eine starke Oberflächenspannung erzeugen.',
    xpReward: 40
  },
  {
    id: 'water_puzzle_03',
    title: 'Indikator-Farben im Testlabor',
    room: 'water_station',
    moduleId: 'module_d',
    type: 'substance_analysis',
    difficulty: 'beginner',
    missionNumber: 3,
    question: 'Analysiere die Lösung anhand des Universalindikators und bestimme den Stoff!',
    loreContext: 'Eine verschüttete Küchenflüssigkeit soll neutralisiert werden.',
    hint: 'Universalindikator färbt sich bei stark sauren Lösungen (pH 2-3) intensiv rot-orange.',
    detailedHint: 'Zitronensaft enthält Zitronensäure (pH ca. 2,4) und schmeckt sauer.',
    didacticExplanation: 'Zitronensaft sicher identifiziert! Säuren geben Protonen (H⁺) an Wasser ab, wodurch H₃O⁺-Ionen entstehen, die den Indikator rot färben.',
    commonMistakeExplanation: 'Seifenwasser färbt den Indikator blau oder violett (basisch), destilliertes Wasser bleibt grün (pH 7).',
    realWorldExample: 'Rotkohlsaft ist ein natürlicher Indikator: Bei Säurezugabe wird er leuchtend rot, bei Zugabe von Backpulver blau-grün.',
    xpReward: 45,
    sample: {
      id: 'substance_lemon',
      name: 'Flüssigkeitsprobe W-03',
      formula: 'C₆H₈O₇ (wässrig)',
      appearance: 'Gelbliche, schwach trübe Flüssigkeit',
      state: 'liquid',
      solubilityInWater: 'very_soluble',
      pHValue: 2.4,
      conductivity: 'leiter',
      hintClues: ['Färbt Universalindikatorpapier intensiv rot', 'Riecht fruchtig nach Zitrusfrüchten', 'Reagiert mit Backpulver unter Schaumbildung (CO₂)'],
      safeLabWarning: 'Auch Säuren aus Lebensmitteln reizen die Augen.',
      correctIdentity: 'Frischer Zitronensaft (Zitronensäurelösung)'
    },
    testOptions: [
      {
        id: 'ph',
        testName: 'Universalindikator-Papier',
        observation: 'Der Teststreifen verfärbt sich sofort tiefrot: pH ca. 2.4 (stark sauer)!',
        safeProcedure: 'Einen Tropfen der Flüssigkeit auf den Indikatorstreifen geben.'
      },
      {
        id: 'conductivity',
        testName: 'Leitfähigkeitsprüfung',
        observation: 'Leitet Strom durch vorhandene Ionen (H₃O⁺ und Citrat-Anionen).',
        safeProcedure: 'Prüfelektroden in die Flüssigkeit tauchen.'
      }
    ],
    candidateChoices: [
      'Frischer Zitronensaft (Zitronensäurelösung)',
      'Seifenlauge (basisch, pH 10)',
      'Reines destilliertes Wasser (pH 7)',
      'Kochsalzlösung (neutral, pH 7)'
    ]
  },
  {
    id: 'water_puzzle_04',
    title: 'Trennverfahren des Alltags',
    room: 'water_station',
    moduleId: 'module_e',
    type: 'element_match',
    difficulty: 'beginner',
    missionNumber: 4,
    question: 'Welches Trennverfahren nutzt welche physikalische Eigenschaft?',
    loreContext: 'Die Aufbereitungsanlage trennt Schmutz-, Salz- und Schwebstoffe.',
    hint: 'Filtration trennt nach Partikelgröße; Destillation trennt nach unterschiedlichen Siedepunkten.',
    detailedHint: 'Kaffeefilter = Filtration; Schnapsbrennen/Meerwasserentsalzung = Destillation.',
    didacticExplanation: 'Klasse zugeordnet! Trennverfahren sind physikalische Methoden, um Gemische in ihre Reinstoffe zu zerlegen, ohne dass chemische Bindungen verändert werden.',
    commonMistakeExplanation: 'Verdampfen lässt das Lösungsmittel entweichen; bei der Destillation wird der Dampf aufgefangen und wieder kondensiert.',
    realWorldExample: 'In Kläranlagen wird Abwasser zuerst mechanisch gefiltert, bevor biologische und chemische Klärstufen greifen.',
    xpReward: 40,
    pairs: [
      { symbol: 'Filtration', name: 'Partikelgröße', clue: 'Kaffeefilter hält Kaffeesatz zurück' },
      { symbol: 'Destillation', name: 'Siedepunkt', clue: 'Alkohol verdampft früher als Wasser' },
      { symbol: 'Zentrifugation', name: 'Dichte', clue: 'Blutzellen werden vom Plasma getrennt' },
      { symbol: 'Chromatografie', name: 'Haftfähigkeit/Löslichkeit', clue: 'Filzstiftfarben trennen sich auf Filterpapier' }
    ]
  },

  // ==========================================
  // RAUM 7: DAS UMWELTLABOR (4 Rätsel)
  // ==========================================
  {
    id: 'env_puzzle_01',
    title: 'Das Herz der Elektromobilität',
    room: 'environmental_lab',
    moduleId: 'module_g',
    rewardElementAtomicNumber: 3, // Lithium
    type: 'periodic_table_quiz',
    difficulty: 'beginner',
    missionNumber: 1,
    question: 'Welches extrem leichte Alkalimetall der 2. Periode speichert Energie in Akkus?',
    loreContext: 'Im Umweltlabor wird an recycelbaren Batteriesystemen geforscht.',
    hint: 'Es hat die Ordnungszahl 3, das Symbol Li und ist das leichteste aller festen Metalle.',
    detailedHint: 'Suche in Gruppe 1 (Alkalimetalle), Periode 2.',
    didacticExplanation: 'Gefunden: Lithium (Li)! Durch sein sehr niedriges Standardpotenzial und geringes Atomgewicht ermöglicht Lithium extrem hohe Energiedichten in Akkumulatoren.',
    commonMistakeExplanation: 'Bleiakkus sind schwer und veraltet; Lithium ist federleicht.',
    realWorldExample: 'Jedes moderne Smartphone und Elektrofahrzeug nutzt Lithium-Ionen-Zellen.',
    xpReward: 40,
    targetSymbol: 'Li',
    criteriaDescription: 'Alkalimetall der 2. Periode mit 3 Protonen',
    clues: ['Ordnungszahl: 3', 'Symbol: Li', 'Gruppe: 1 (Alkalimetalle)']
  },
  {
    id: 'env_puzzle_02',
    title: 'Grüner Wasserstoff per Elektrolyse',
    room: 'environmental_lab',
    moduleId: 'module_g',
    rewardElementAtomicNumber: 1, // Wasserstoff
    type: 'equation_balancer',
    difficulty: 'advanced',
    missionNumber: 2,
    question: 'Gleiche die Gleichung der Wasser-Elektrolyse (2 H₂O → ? H₂ + ? O₂) aus!',
    loreContext: 'Die Solaranlage auf dem Institutsdach erzeugt Wasserstoff aus Regenwasser.',
    hint: 'Aus 2 Wassermolekülen entstehen 2 Wasserstoffmoleküle und 1 Sauerstoffmolekül.',
    detailedHint: '2 H₂O → 2 H₂ + 1 O₂.',
    didacticExplanation: 'Exakt! 2 H₂O → 2 H₂ + 1 O₂. Wird dafür Ökostrom genutzt, entsteht „grüner Wasserstoff“ ohne jegliche CO₂-Emissionen.',
    commonMistakeExplanation: 'Wasserstoffgas liegt immer als zweiatomiges H₂ vor, nie als einzelne H-Atome.',
    realWorldExample: 'Grüner Wasserstoff soll in Zukunft Kohle bei der Stahlherstellung ersetzen.',
    xpReward: 50,
    reaction: REACTIONS_DATA[4]
  },
  {
    id: 'env_puzzle_03',
    title: 'Kunststoffe und Recycling',
    room: 'environmental_lab',
    moduleId: 'module_g',
    type: 'true_false',
    difficulty: 'beginner',
    missionNumber: 3,
    question: 'Prüfe diese Aussage über moderne Kunststoffe:',
    statement: 'Thermoplaste (wie PET von Getränkeflaschen) lassen sich bei Erwärmung wiederholt verformen und schmelzen, weshalb sie gut recycelbar sind.',
    isTrue: true,
    loreContext: 'Die Recycling-Sortieranlage prüft Kunststoffarten.',
    hint: 'Thermos = Wärme, plastisch = verformbar. Im Gegensatz dazu verbrennen Duroplaste beim Erhitzen.',
    detailedHint: 'Thermoplaste bestehen aus unvernetzten Polymerketten, die beim Erwärmen aneinander vorbeigleiten.',
    didacticExplanation: 'Richtig! Thermoplaste können geschmolzen, regranuliert und zu neuen Produkten geformt werden (z. B. Fleece-Pullover oder neue Flaschen aus altem PET).',
    commonMistakeExplanation: 'Duroplaste (wie Steckdosen) sind engmaschig vernetzt und schmelzen nicht – sie zersetzen sich bei Hitze.',
    realWorldExample: 'Der gelbe Sack führt Millionen Tonnen PET und PE dem werkstofflichen Recycling zu.',
    xpReward: 35
  },
  {
    id: 'env_puzzle_04',
    title: 'Fallakte 04: Die geheimnisvolle Wasserverunreinigung',
    room: 'environmental_lab',
    moduleId: 'module_g',
    type: 'mystery_detective',
    difficulty: 'expert',
    missionNumber: 4,
    question: 'Welches Filterverfahren entfernt organische Mikroschadstoffe aus dem Trinkwasser?',
    caseTitle: 'Rückstände im Brunnenwasser',
    caseReport: 'In einem Testbrunnen wurden Spuren von Arzneimitteln und Pestiziden nachgewiesen. Sandfilter und Siebe lassen diese gelösten Moleküle ungehindert passieren.',
    loreContext: 'Das Umweltlabor muss die beste Reinigungstechnologie auswählen.',
    hint: 'Aktivkohle besitzt eine gigantische innere Oberfläche (bis zu 1500 m² pro Gramm!) und bindet organische Schadstoffe durch Adsorption.',
    detailedHint: 'Adsorption an Aktivkohle oder Umkehrosmose filtriert gelöste Mikroschadstoffe.',
    didacticExplanation: 'Ausgezeichnet gelöst! Durch Adsorption an poröser Aktivkohle lagern sich unpolare organische Moleküle fest an der Kohlenstoffoberfläche an und werden aus dem Wasser entfernt.',
    commonMistakeExplanation: 'Einfaches Abkochen tötet zwar Keime, entfernt aber keine chemischen Pestizide oder Medikamente.',
    realWorldExample: 'Wasserwerke und moderne Trinkwasserfilter nutzen Aktivkohleblöcke zur Endreinigung.',
    xpReward: 60,
    evidenceItems: [
      { title: 'Beweis A: Molekülgröße', fact: 'Pestizidmoleküle sind winzig (unter 1 Nanometer) und passieren mechanische Kiesfilter mühelos.' },
      { title: 'Beweis B: Adsorption', fact: 'Aktivkohle hat winzige Poren und zieht organische Kohlenstoffringe elektrostatisch magisch an.' }
    ],
    hypotheses: [
      {
        id: 'hyp_carbon',
        text: 'Adsorption an hochporöser Aktivkohle bindet organische Mikroschadstoffe an der inneren Oberfläche.',
        isCorrect: true,
        scientificCritique: 'Korrekt! Dies ist das weltweit bewährteste chemisch-physikalische Verfahren zur Trinkwasser-Feinreinigung.'
      },
      {
        id: 'hyp_boil',
        text: 'Einfaches Sonnenlicht im Glasgefäß zersetzt alle Chemikalien innerhalb von 5 Sekunden.',
        isCorrect: false,
        scientificCritique: 'Widerlegt: Viele Umweltgifte sind extrem photostabil und bauen sich über Jahre nicht ab.'
      }
    ]
  },

  // ==========================================
  // RAUM 8: DAS GEHEIME FORSCHUNGSLABOR (2 Rätsel / Finale Meisterschaft)
  // ==========================================
  {
    id: 'sec_puzzle_01',
    title: 'Das finale Meisterschaftsmysterium',
    room: 'secret_research_lab',
    moduleId: 'module_g',
    rewardElementAtomicNumber: 79, // Gold
    type: 'mystery_detective',
    difficulty: 'expert',
    missionNumber: 1,
    question: 'Löse das letzte große Rätsel der modernen Chemie!',
    caseTitle: 'Die universelle Synthese-Katalyse',
    caseReport: 'Im Tresor des geheimen Forschungslabors liegt das Vermächtnis des Institutsgründers: Wie können chemische Reaktionen ohne hohen Energieaufwand ablaufen?',
    loreContext: 'Die Krönung deiner chemischen Ausbildung am Institut.',
    hint: 'Ein Katalysator senkt die Aktivierungsenergie einer chemischen Reaktion, ohne dabei selbst verbraucht zu werden.',
    detailedHint: 'Katalysatoren ermöglichen Reaktionen bei niedrigeren Temperaturen und bleiben am Ende unverändert erhalten.',
    didacticExplanation: 'Meisterprüfung bestanden! Katalysatoren (in unserem Körper Enzyme genannt) senken die Aktivierungsenergie drastisch. Ohne Katalysatoren stünden Chemieindustrie und biologisches Leben still.',
    commonMistakeExplanation: 'Ein Katalysator verschiebt nicht das chemische Gleichgewicht, sondern beschleunigt lediglich dessen Einstellung.',
    realWorldExample: 'Der Auto-Abgaskatalysator (Platin/Rhodium) wandelt giftige Stickoxide und CO bei 400 °C in harmlosen Stickstoff und CO₂ um.',
    xpReward: 100,
    evidenceItems: [
      { title: 'Beweis A: Energiediagramm', fact: 'Die Reaktionskurve mit Katalysator verläuft über einen deutlich flacheren Energieberg.' },
      { title: 'Beweis B: Massenbilanz danach', fact: 'Nach Ablauf der Reaktion wiegt der Katalysator exakt genauso viel wie zu Beginn.' }
    ],
    hypotheses: [
      {
        id: 'hyp_catalyst',
        text: 'Katalysatoren senken die Aktivierungsenergie und ermöglichen Synthesen bei milden Bedingungen, ohne verbraucht zu werden.',
        isCorrect: true,
        scientificCritique: 'Volle Punktzahl! Dies ist der fundamentale Schlüssel der modernen und nachhaltigen „Grünen Chemie“.'
      },
      {
        id: 'hyp_heat',
        text: 'Man muss Reaktionen immer auf 5000 Grad Celsius erhitzen, damit Atome verschmelzen.',
        isCorrect: false,
        scientificCritique: 'Falsch: Das wäre Kernfusion, keine Chemie, und würde alle Moleküle zerstören.'
      }
    ]
  },
  {
    id: 'sec_puzzle_02',
    title: 'Der Meister-Cipher des Instituts',
    room: 'secret_research_lab',
    moduleId: 'module_a',
    rewardElementAtomicNumber: 79, // Gold
    type: 'lab_door_cipher',
    difficulty: 'expert',
    missionNumber: 2,
    doorName: 'Tresor des Alchemisten',
    question: 'Knacke den finalen Meisterschaftscode mit den Fundamenten der Elemente!',
    loreContext: 'Vor dir liegt der goldene Panzertresor. Drei Ziffern trennen dich vom Titel des Chemie-Großmeisters.',
    cipherClues: [
      'Ziffer 1: Ordnungszahl des edlen Übergangsmetalls Gold (Au) geteilt durch 10 abgerundet (79 -> 7)',
      'Ziffer 2: Maximale Elektronenzahl auf der 2. Elektronenschale (L-Schale nach 2n²)',
      'Ziffer 3: Anzahl der Bindungen, die ein Kohlenstoffatom in gesättigten Kohlenwasserstoffen bildet'
    ],
    requiredCode: '784',
    keypadType: 'numbers',
    options: ['784', '782', '684', '884'],
    scientificReason: 'Gold (Au) = 79 -> 7; L-Schale fasst 2×(2)² = 8 Elektronen; Kohlenstoff = 4 Bindungen. Code: 784.',
    hint: 'Gold Ordnungszahl 79 (erste Ziffer: 7). L-Schale n=2: 2×2² = 8 Elektronen. Kohlenstoff Valenz = 4.',
    detailedHint: 'Code: 7 - 8 - 4.',
    didacticExplanation: 'HERZLICHEN GLÜCKWUNSCH! Du hast den Tresor des geheimen Forschungslabors geöffnet und alle 8 Bereiche von Chemistry Mystery meisterhaft entschlüsselt!',
    commonMistakeExplanation: 'Achte auf die Schalenformel: 2 mal n zum Quadrat. Für n=2 ergibt sich 2×4 = 8.',
    realWorldExample: 'Die Beherrschung von Schalenmodellen und Valenzen ist die Basis für das Design neuer Arzneimittel und Halbleiter.',
    xpReward: 120
  }
];

export const ELEMENTAL_LAB_PUZZLES = ALL_PUZZLES.filter(p => p.room === 'elemental_lab');

export function getPuzzlesForRoom(roomId: string): Puzzle[] {
  return ALL_PUZZLES.filter(p => p.room === roomId);
}
