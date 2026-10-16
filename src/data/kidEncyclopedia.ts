export interface KidArticle {
  id: string;
  emoji: string;
  title: string;
  subtitle: string;
  kidExplanation: string;
  analogy: string;
  dailyLifeExample: string;
  funFact: string;
  category: 'basics' | 'reactions' | 'everyday' | 'future';
}

export const KID_ENCYCLOPEDIA_ARTICLES: KidArticle[] = [
  {
    id: 'atoms',
    emoji: '🧱',
    title: 'Was ist ein Atom?',
    subtitle: 'Die winzigsten LEGO-Steine des gesamten Universums!',
    kidExplanation: 'Alles um dich herum – dein Stuhl, dein Haustier, die Luft, die du einatmest, und sogar du selbst – besteht aus unvorstellbar winzigen Teilchen: den Atomen! Ein Atom ist so klein, dass in einem einzigen winzigen Sandkorn viele Milliarden Atome stecken.',
    analogy: 'Stell dir ein riesiges LEGO-Schloss vor. Von weitem sieht es wie eine Burg aus. Aber wenn du ganz nah herangehst, erkennst du: Es besteht aus vielen einzelnen bunten Steinen. Genauso sind Atome die Bausteine der Natur!',
    dailyLifeExample: 'Wenn du einen Apfel in der Mitte durchschneidest, hast du zwei Hälften. Wenn du ihn immer weiter schneiden könntest – Millionen Male –, kämst du irgendwann zu den einzelnen Atomen, die man nicht mehr weiter zerschneiden kann!',
    funFact: 'Wenn ein Atom so groß wäre wie ein Fußballstadion, dann wäre sein Kern in der Mitte so klein wie eine Erbse auf dem Anstoßpunkt!',
    category: 'basics'
  },
  {
    id: 'atom_structure',
    emoji: '⚛️',
    title: 'Wie sieht ein Atom von innen aus?',
    subtitle: 'Protonen, Neutronen und sausende Elektronen!',
    kidExplanation: 'Ein Atom besteht aus zwei Bereichen: dem festen Kern in der Mitte und der Hülle drumherum. Im Kern wohnen die Protonen (die haben eine positive Plus-Ladung ➕) und die Neutronen (die sind neutral ⚪). Um den Kern herum sausen die Elektronen (mit Minus-Ladung ➖) wie kleine Rennwagen!',
    analogy: 'Denke an Magnete: Plus und Minus ziehen sich magisch an! Weil der Kern positiv geladen ist, hält er die negativen Elektronen fest im Kreisverkehr, damit sie nicht wegfliegen.',
    dailyLifeExample: 'Wenn du mit Wollsocken über einen Teppich schlurfst und dann eine Türklinke anfasst, macht es manchmal "Patsch!" – da sind Elektronen von deinen Socken auf die Klinke gehüpft!',
    funFact: 'Elektronen sausen fast mit Lichtgeschwindigkeit um den Atomkern – über 2.000 Kilometer in einer einzigen Sekunde!',
    category: 'basics'
  },
  {
    id: 'molecules',
    emoji: '🤝',
    title: 'Was ist ein Molekül?',
    subtitle: 'Wenn Atome sich an den Händen halten und Teams bilden!',
    kidExplanation: 'Einzelne Atome sind oft einsam. Sie möchten sich mit anderen Atomen verbinden! Wenn sich zwei oder mehr Atome zusammentun und sich fest festhalten (man nennt das eine chemische Bindung), entsteht ein Molekül.',
    analogy: 'Stell dir Atome wie Kinder auf dem Spielplatz vor. Ein Sauerstoff-Atom hat zwei freie Hände. Es schnappt sich links ein Wasserstoff-Kind und rechts ein Wasserstoff-Kind. Zusammen rufen sie: "Hurra, wir sind jetzt ein Wasser-Molekül (H₂O)!"',
    dailyLifeExample: 'Das Wasser, das aus deinem Wasserhahn fließt, besteht aus unzähligen H₂O-Molekülen. Sie sehen ein bisschen aus wie der Kopf von Micky Maus: ein großer Sauerstoffkopf mit zwei Wasserstoff-Ohren!',
    funFact: 'In einem einzigen kleinen Schluck Wasser stecken mehr Moleküle, als es Sterne am gesamten Nachthimmel gibt!',
    category: 'basics'
  },
  {
    id: 'reactions',
    emoji: '💥',
    title: 'Was ist eine chemische Reaktion?',
    subtitle: 'Die große Umbau-Zauberei der Natur!',
    kidExplanation: 'Bei einer chemischen Reaktion verwandeln sich Stoffe in etwas völlig Neues! Die Atome lösen ihre alten Bindungen und verbinden sich neu mit anderen Partnern. Wichtig: Kein einziges Atom geht dabei verloren oder wird neu erfunden – sie tauschen nur die Plätze!',
    analogy: 'Wie beim Kuchenbacken: Vorher hast du Mehl, Eier, Milch und Zucker (das sind die Ausgangsstoffe / Edukte). Im Ofen backt alles zusammen zu einem leckeren, duftenden Kuchen (das Produkt)! Du kannst den fertigen Kuchen nicht mehr einfach in Mehl und Eier zerlegen.',
    dailyLifeExample: 'Ein Streichholz anzünden: Das Holz und der Sauerstoff aus der Luft reagieren miteinander zu Asche, Rauch und viel warmer Energie und Licht!',
    funFact: 'Rost an einem alten Fahrrad ist eine ganz langsame chemische Reaktion: Eisen verbrennt ganz langsam mit dem Sauerstoff der Luft!',
    category: 'reactions'
  },
  {
    id: 'mass_balance',
    emoji: '⚖️',
    title: 'Das Gesetz der Massenerhaltung',
    subtitle: 'Nichts verschwindet einfach so im Nichts!',
    kidExplanation: 'Ein berühmter Forscher namens Antoine Lavoisier hat entdeckt: Egal wie heftig es blitzt, raucht oder knallt – alles, was vor der Reaktion da war, wiegt nach der Reaktion exakt genauso viel! Atome sind unzerstörbar in normalen chemischen Reaktionen.',
    analogy: 'Wenn du eine Schachtel mit 20 roten und 10 blauen LEGO-Steinen hast und daraus ein Raumschiff baust, hast du danach immer noch genau 20 rote und 10 blaue Steine. Kein Stein löst sich in Luft auf!',
    dailyLifeExample: 'Wenn ein Holzscheit im Kamin verbrennt, bleibt scheinbar nur ein kleines Häufchen Asche übrig. Aber wo ist der Rest? Als unsichtbares Gas (Kohlendioxid und Wasserdampf) in die Luft geflogen! Würde man den Rauch mitwiegen, wäre das Gewicht haargenau gleich!',
    funFact: 'Die Atome in deinem Körper sind Milliarden Jahre alt. Manche von ihnen waren früher Teil eines Dinosauriers oder eines fernen Sterns!',
    category: 'reactions'
  },
  {
    id: 'acids_bases',
    emoji: '🍋',
    title: 'Säuren, Basen und der pH-Wert',
    subtitle: 'Von sauer kitzelnder Zitrone bis zu flutschiger Seifenlauge!',
    kidExplanation: 'Stoffe können sauer, neutral oder basisch (alkalisch) sein. Der pH-Wert ist wie ein Thermometer für diesen Geschmack: 7 ist genau in der Mitte und neutral (wie reines Wasser). Alles unter 7 ist sauer, alles über 7 ist basisch!',
    analogy: 'Säuren sind wie kleine freche Flöhe, die gerne Protonen (H⁺) verschenken wollen. Basen sind wie große Fänger, die diese Protonen liebend gern einsammeln. Treffen sich eine Säure und eine Base, vertragen sie sich und werden zu neutralem Wasser und Salz!',
    dailyLifeExample: 'Zitronensaft (pH ca. 2) schmeckt herrlich sauer und kitzelt auf der Zunge. Seifenwasser (pH ca. 9) fühlt sich glitschig an den Fingern an. Magen-Säure hilft deinem Bauch, das Essen zu verdauen!',
    funFact: 'Rotkohlsaft ist ein natürlicher Zaubertrank: Gibst du Zitronensaft hinein, färbt er sich leuchtend rot! Gibst du Seife oder Backpulver hinein, wird er blau oder grün!',
    category: 'everyday'
  },
  {
    id: 'water_wonder',
    emoji: '💧',
    title: 'Das Wunder-Molekül Wasser',
    subtitle: 'Warum schwimmt Eis eigentlich oben auf dem See?',
    kidExplanation: 'Wasser ist der erstaunlichste Stoff auf unserer Erde. Fast alle Dinge schrumpfen und werden schwerer, wenn sie kalt und fest werden. Wasser macht genau das Gegenteil: Wenn es zu Eis gefriert, dehnt es sich aus und wird leichter!',
    analogy: 'Wassermoleküle tanzen im flüssigen Wasser eng aneinander vorbei. Wenn es friert, bauen sie ein wunderschönes, luftiges Kristallgitter wie eine Sechseck-Wabe. Dadurch braucht Eis mehr Platz und schwimmt oben wie ein Boot!',
    dailyLifeExample: 'Im Winter frieren Teiche und Seen nur von oben zu! Unter der dicken Eisschicht bleibt das Wasser 4 °C warm – so können Fische und Frösche am Boden den ganzen Winter gemütlich überleben.',
    funFact: 'Schneeflocken haben immer sechs Ecken oder Zacken, weil die Wassermoleküle sich immer in einem Sechseck-Muster anordnen!',
    category: 'everyday'
  },
  {
    id: 'states_of_matter',
    emoji: '🧊',
    title: 'Die 3 Zustände: Fest, Flüssig, Gas',
    subtitle: 'Wie viel Bewegungsdrang haben die Teilchen heute?',
    kidExplanation: 'Fast jeder Stoff kann fest, flüssig oder gasförmig sein. Es kommt nur darauf an, wie warm es ist! Wärme ist nämlich nichts anderes als die Zappligkeit der Teilchen.',
    analogy: 'Stell dir eine Gruppe Kinder in der Turnhalle vor: Fest = Alle halten sich fest an den Händen und stehen still. Flüssig = Alle schlendern gemütlich durcheinander. Gasförmig = Alle flitzen wie wilde Flummis durch die ganze Halle!',
    dailyLifeExample: 'Wasser als Eiswürfel im Glas (fest) schmilzt in der Sonne zu flüssigem Wasser. Kocht man es im Wasserkocher, steigt heißer Dampf auf (gasförmig).',
    funFact: 'Es gibt noch einen vierten Zustand: Plasma! Wenn man ein Gas extrem heiß macht (wie in der Sonne oder in einem Blitz), trennen sich die Elektronen vom Kern!',
    category: 'everyday'
  },
  {
    id: 'pse_guide',
    emoji: '🗺️',
    title: 'Das Periodensystem der Elemente',
    subtitle: 'Der bunte Weltatlas aller Bausteine!',
    kidExplanation: 'Vor über 150 Jahren hat der Forscher Dmitri Mendelejew alle damals bekannten Elemente auf Kärtchen geschrieben und sortiert. Er bemerkte: Ordnet man sie nach ihrem Gewicht und ihren Eigenschaften, wiederholen sich bestimmte Superkräfte regelmäßig (periodisch)!',
    analogy: 'Wie ein Kalender: Nach 7 Tagen kommt wieder ein Montag. Im Periodensystem stehen in einer Spalte (Gruppe) Elemente, die sich ganz ähnlich benehmen – wie eine Familie! Ganz rechts stehen zum Beispiel die stolzen Edelgase, die mit niemandem streiten.',
    dailyLifeExample: 'Alle Metalle stehen eher links und in der Mitte (wie Eisen, Kupfer und Gold), Nichtmetalle wie Sauerstoff und Stickstoff stehen rechts oben.',
    funFact: 'Als Mendelejew seine Tabelle baute, waren viele Elemente noch gar nicht entdeckt. Er ließ Lücken frei und sagte voraus: "Hier wird man eines Tages ein neues Element finden!" – und er behielt recht!',
    category: 'basics'
  },
  {
    id: 'future_chemistry',
    emoji: '🌱',
    title: 'Grüne Chemie & Die Zukunft',
    subtitle: 'Wie schlaue Chemie unseren Planeten rettet!',
    kidExplanation: 'Chemie ist nicht nur in Laboren, sondern hilft uns, die Erde sauber zu halten! Chemiker erfinden heute Plastik aus Maisstärke, das von Bakterien gefressen wird, saubere Batterien für Elektroautos und Riesenfilter für sauberes Trinkwasser.',
    analogy: 'Die Natur macht keinen Müll: Ein abgefallenes Blatt wird wieder zu frischer Erde. "Grüne Chemie" schaut sich diesen Trick von der Natur ab, damit alles im Kreis fließt (Kreislaufwirtschaft)!',
    dailyLifeExample: 'Wiederaufladbare Akkus in Spielzeug und Tablets: Wenn du sie einsteckst, werden die Lithium-Teilchen chemisch wieder an ihren Startplatz zurückgeschoben, bereit für die nächste Spielrunde!',
    funFact: 'Forscher arbeiten an künstlichen Blättern: Sie nutzen Sonnenlicht und Wasser, um sauberen Wasserstoff als grünen Treibstoff der Zukunft herzustellen!',
    category: 'future'
  }
];
