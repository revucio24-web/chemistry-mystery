import { MoleculeDefinition } from '../types/chemistry';

export const MOLECULES_DATA: MoleculeDefinition[] = [
  {
    id: 'h2o',
    formula: 'H₂O',
    name: 'Wasser',
    commonName: 'Wasser',
    description: 'Besteht aus einem zentralen Sauerstoffatom, an das zwei Wasserstoffatome gewinkelt gebunden sind. Ein Dipolmolekül mit Wasserstoffbrückenbindungen.',
    realWorldUsage: 'Lebenselixier der Erde, Lösungsmittel in Zellen, Meere und Trinkwasser.',
    requiredAtoms: { H: 2, O: 1 },
    bondsCount: 2,
    difficulty: 'explorer'
  },
  {
    id: 'o2',
    formula: 'O₂',
    name: 'Molekularer Sauerstoff',
    commonName: 'Sauerstoffgas',
    description: 'Zwei Sauerstoffatome teilen sich vier Elektronen in einer stabilen kovalenten Doppelbindung.',
    realWorldUsage: 'In der Atemluft für die Energieerzeugung in Mitochondrien unerlässlich.',
    requiredAtoms: { O: 2 },
    bondsCount: 1, // 1 Doppelbindung
    difficulty: 'explorer'
  },
  {
    id: 'co2',
    formula: 'CO₂',
    name: 'Kohlenstoffdioxid',
    commonName: 'Kohlendioxid',
    description: 'Ein lineares Molekül, in dem Kohlenstoff im Zentrum steht und mit jeweils einer Doppelbindung an zwei Sauerstoffatome gekoppelt ist.',
    realWorldUsage: 'Treibhausgas, Kohlensäure in Mineralwasser und Ausgangsstoff der pflanzlichen Fotosynthese.',
    requiredAtoms: { C: 1, O: 2 },
    bondsCount: 2,
    difficulty: 'beginner'
  },
  {
    id: 'ch4',
    formula: 'CH₄',
    name: 'Methan',
    commonName: 'Erdgas',
    description: 'Das einfachste Alkan. Ein Kohlenstoffatom bildet vier Einfachbindungen zu vier Wasserstoffatomen in einer perfekten Tetraeder-Form.',
    realWorldUsage: 'Hauptbestandteil von Erdgas zum Heizen und Kochen; starkes Treibhausgas.',
    requiredAtoms: { C: 1, H: 4 },
    bondsCount: 4,
    difficulty: 'beginner'
  },
  {
    id: 'nh3',
    formula: 'NH₃',
    name: 'Ammoniak',
    commonName: 'Ammoniak',
    description: 'Ein Stickstoffatom bindet drei Wasserstoffe in einer trigonal-pyramidalen Anordnung mit einem freien Elektronenpaar an der Spitze.',
    realWorldUsage: 'Herstellung von Stickstoffdüngern über das Haber-Bosch-Verfahren und Kältemittel.',
    requiredAtoms: { N: 1, H: 3 },
    bondsCount: 3,
    difficulty: 'advanced'
  },
  {
    id: 'nacl',
    formula: 'NaCl',
    name: 'Natriumchlorid',
    commonName: 'Kochsalz',
    description: 'Eine Ionenverbindung! Natrium gibt ein Elektron ab (Na⁺), Chlor nimmt es auf (Cl⁻). Sie bilden ein kubisches Kristallgitter.',
    realWorldUsage: 'Speisesalz zur Geschmacksgebung, Konservierung und lebenswichtiger Elektrolyt im Blut.',
    requiredAtoms: { Na: 1, Cl: 1 },
    bondsCount: 1,
    difficulty: 'explorer'
  }
];
