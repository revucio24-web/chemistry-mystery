export const ELEMENT_SUPERPOWERS: Record<string, string> = {
  H: '🚀 Raketen-Treibstoff & leichtestes Element im ganzen Weltall!',
  He: '🎈 Macht Luftballons federleicht und Stimmen lustig piepsig!',
  Li: '🔋 Die Batterie-Power in deinem Tablet, Smartphone und Elektroauto!',
  Be: '💎 Macht Smaragde grün und ist federleicht, aber steinhart!',
  B: '🛡️ Macht feuerfestes Laborglas und schützt vor riesiger Hitze!',
  C: '💎 Der Alleskönner: Steckt in Bleistiftminen, Diamanten und in dir!',
  N: '🌱 Der Wachstums-Dünger für alle Pflanzen und 78 % unserer Atemluft!',
  O: '🫁 Lebenselixier: Ohne Sauerstoff kann kein Mensch und kein Tier atmen!',
  F: '🦷 Der Zahnschmelz-Bodyguard in deiner Zahnpasta gegen Karies!',
  Ne: '🏮 Lässt bunte Leuchtreklamen in der Nacht knallrot erstrahlen!',
  Na: '🧂 Zusammen mit Chlor wird das wilde Metall zu leckerem Speisesalz!',
  Mg: '✨ Brennt mit blendend weißem Licht bei Wunderkerzen zu Silvester!',
  Al: '✈️ Superleichtes Metall für Flugzeuge, Alufolie und Fahrradrahmen!',
  Si: '💻 Der Super-Chip: Ohne Silicium gäbe es keine Computer oder Handys!',
  P: '🔥 Macht den Zündkopf an Streichhölzern und steckt in deiner DNA!',
  S: '🌋 Riecht nach Vulkanen und gelbem Pulver, steckt in Knoblauch & Zwiebeln!',
  Cl: '🏊 Hält das Wasser im Schwimmbad blitzsauber und keimfrei!',
  Ar: '💡 Schützt den glühenden Draht in Glühbirnen vor dem Durchbrennen!',
  K: '🍌 Steckt reichlich in leckeren Bananen und hält dein Herz im Takt!',
  Ca: '🦴 Macht deine Knochen und Zähne bärenstark wie Beton!',
  Fe: '🧲 Haftet magisch an Magneten und transportiert Sauerstoff in deinem Blut!',
  Cu: '⚡ Leitet Strom blitzschnell durch alle Kabel in deinem Zuhause!',
  Zn: '🩹 Heilt kleine Schürfwunden in Wundsalben und schützt Eisen vor Rost!',
  Ag: '🥈 Glänzt wunderschön als Schmuck und leitet Strom am allerbesten!',
  Au: '👑 König der Metalle: Rostet niemals, glänzt ewig und ist super wertvoll!'
};

export const getElementSuperpower = (symbol: string): string => {
  return ELEMENT_SUPERPOWERS[symbol] || '✨ Ein unverzichtbarer Baustein im großen Mosaik unseres Universums!';
};
