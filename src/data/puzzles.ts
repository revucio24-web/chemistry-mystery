import { Puzzle } from '../types/puzzles';
import { MOLECULES_DATA } from './molecules';
import { REACTIONS_DATA } from './reactions';

export const ELEMENTAL_LAB_PUZZLES: Puzzle[] = [
  // 1. Rätsel: Typ 1 - Elemente zuordnen
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

  // 2. Rätsel: Typ 8 - Wahr oder Falsch
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

  // 3. Rätsel: Typ 6 - Periodensystem-Challenge
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

  // 4. Rätsel: Typ 2 - Molekülbaukasten (Wasser)
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

  // 5. Rätsel: Typ 3 - Labor entschlüsseln (Codeschloss)
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

  // 6. Rätsel: Typ 5 - Unbekannte Stoffe analysieren
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

  // 7. Rätsel: Typ 4 - Reaktionsgleichungen ausgleichen
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

  // 8. Rätsel: Typ 7 - Chemie-Detektiv
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

  // 9. Rätsel: Typ 8 - Wahr oder Falsch
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

  // 10. Rätsel: Typ 6 - Periodensystem: Metalle vs. Nichtmetalle
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
  }
];
