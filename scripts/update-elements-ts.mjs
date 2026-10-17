import fs from 'fs';
import path from 'path';

// Complete dictionary of all 118 exact electron shell configurations (K, L, M, N, O, P, Q)
const ALL_118_SHELLS = {
  1: [1],
  2: [2],
  3: [2, 1],
  4: [2, 2],
  5: [2, 3],
  6: [2, 4],
  7: [2, 5],
  8: [2, 6],
  9: [2, 7],
  10: [2, 8],
  11: [2, 8, 1],
  12: [2, 8, 2],
  13: [2, 8, 3],
  14: [2, 8, 4],
  15: [2, 8, 5],
  16: [2, 8, 6],
  17: [2, 8, 7],
  18: [2, 8, 8],
  19: [2, 8, 8, 1],
  20: [2, 8, 8, 2],
  21: [2, 8, 9, 2],
  22: [2, 8, 10, 2],
  23: [2, 8, 11, 2],
  24: [2, 8, 13, 1], // Cr
  25: [2, 8, 13, 2],
  26: [2, 8, 14, 2], // Fe
  27: [2, 8, 15, 2],
  28: [2, 8, 16, 2],
  29: [2, 8, 18, 1], // Cu
  30: [2, 8, 18, 2],
  31: [2, 8, 18, 3],
  32: [2, 8, 18, 4],
  33: [2, 8, 18, 5],
  34: [2, 8, 18, 6],
  35: [2, 8, 18, 7],
  36: [2, 8, 18, 8],
  37: [2, 8, 18, 8, 1],
  38: [2, 8, 18, 8, 2],
  39: [2, 8, 18, 9, 2],
  40: [2, 8, 18, 10, 2],
  41: [2, 8, 18, 12, 1], // Nb
  42: [2, 8, 18, 13, 1], // Mo
  43: [2, 8, 18, 13, 2], // Tc
  44: [2, 8, 18, 15, 1], // Ru
  45: [2, 8, 18, 16, 1], // Rh
  46: [2, 8, 18, 18],    // Pd
  47: [2, 8, 18, 18, 1], // Ag
  48: [2, 8, 18, 18, 2],
  49: [2, 8, 18, 18, 3],
  50: [2, 8, 18, 18, 4],
  51: [2, 8, 18, 18, 5],
  52: [2, 8, 18, 18, 6],
  53: [2, 8, 18, 18, 7],
  54: [2, 8, 18, 18, 8],
  55: [2, 8, 18, 18, 8, 1],
  56: [2, 8, 18, 18, 8, 2],
  57: [2, 8, 18, 18, 9, 2], // La
  58: [2, 8, 18, 19, 9, 2], // Ce
  59: [2, 8, 18, 21, 8, 2], // Pr
  60: [2, 8, 18, 22, 8, 2], // Nd
  61: [2, 8, 18, 23, 8, 2], // Pm
  62: [2, 8, 18, 24, 8, 2], // Sm
  63: [2, 8, 18, 25, 8, 2], // Eu
  64: [2, 8, 18, 25, 9, 2], // Gd
  65: [2, 8, 18, 27, 8, 2], // Tb
  66: [2, 8, 18, 28, 8, 2], // Dy
  67: [2, 8, 18, 29, 8, 2], // Ho
  68: [2, 8, 18, 30, 8, 2], // Er
  69: [2, 8, 18, 31, 8, 2], // Tm
  70: [2, 8, 18, 32, 8, 2], // Yb
  71: [2, 8, 18, 32, 9, 2], // Lu
  72: [2, 8, 18, 32, 10, 2], // Hf
  73: [2, 8, 18, 32, 11, 2], // Ta
  74: [2, 8, 18, 32, 12, 2], // W
  75: [2, 8, 18, 32, 13, 2], // Re
  76: [2, 8, 18, 32, 14, 2], // Os
  77: [2, 8, 18, 32, 15, 2], // Ir
  78: [2, 8, 18, 32, 17, 1], // Pt
  79: [2, 8, 18, 32, 18, 1], // Au
  80: [2, 8, 18, 32, 18, 2], // Hg
  81: [2, 8, 18, 32, 18, 3], // Tl
  82: [2, 8, 18, 32, 18, 4], // Pb
  83: [2, 8, 18, 32, 18, 5], // Bi
  84: [2, 8, 18, 32, 18, 6], // Po
  85: [2, 8, 18, 32, 18, 7], // At
  86: [2, 8, 18, 32, 18, 8], // Rn
  87: [2, 8, 18, 32, 18, 8, 1], // Fr
  88: [2, 8, 18, 32, 18, 8, 2], // Ra
  89: [2, 8, 18, 32, 18, 9, 2], // Ac
  90: [2, 8, 18, 32, 18, 10, 2], // Th
  91: [2, 8, 18, 32, 20, 9, 2], // Pa
  92: [2, 8, 18, 32, 21, 9, 2], // U
  93: [2, 8, 18, 32, 22, 9, 2], // Np
  94: [2, 8, 18, 32, 24, 8, 2], // Pu
  95: [2, 8, 18, 32, 25, 8, 2], // Am
  96: [2, 8, 18, 32, 25, 9, 2], // Cm
  97: [2, 8, 18, 32, 27, 8, 2], // Bk
  98: [2, 8, 18, 32, 28, 8, 2], // Cf
  99: [2, 8, 18, 32, 29, 8, 2], // Es
  100: [2, 8, 18, 32, 30, 8, 2], // Fm
  101: [2, 8, 18, 32, 31, 8, 2], // Md
  102: [2, 8, 18, 32, 32, 8, 2], // No
  103: [2, 8, 18, 32, 32, 8, 3], // Lr
  104: [2, 8, 18, 32, 32, 10, 2], // Rf
  105: [2, 8, 18, 32, 32, 11, 2], // Db
  106: [2, 8, 18, 32, 32, 12, 2], // Sg
  107: [2, 8, 18, 32, 32, 13, 2], // Bh
  108: [2, 8, 18, 32, 32, 14, 2], // Hs
  109: [2, 8, 18, 32, 32, 15, 2], // Mt
  110: [2, 8, 18, 32, 32, 17, 1], // Ds
  111: [2, 8, 18, 32, 32, 18, 1], // Rg
  112: [2, 8, 18, 32, 32, 18, 2], // Cn
  113: [2, 8, 18, 32, 32, 18, 3], // Nh
  114: [2, 8, 18, 32, 32, 18, 4], // Fl
  115: [2, 8, 18, 32, 32, 18, 5], // Mc
  116: [2, 8, 18, 32, 32, 18, 6], // Lv
  117: [2, 8, 18, 32, 32, 18, 7], // Ts
  118: [2, 8, 18, 32, 32, 18, 8]  // Og
};

// Real condensed IUPAC/NIST electron configuration for all 118 elements
const ALL_118_CONFIGS = {
  1: "1s¹",
  2: "1s²",
  3: "[He] 2s¹",
  4: "[He] 2s²",
  5: "[He] 2s² 2p¹",
  6: "[He] 2s² 2p²",
  7: "[He] 2s² 2p³",
  8: "[He] 2s² 2p⁴",
  9: "[He] 2s² 2p⁵",
  10: "[He] 2s² 2p⁶",
  11: "[Ne] 3s¹",
  12: "[Ne] 3s²",
  13: "[Ne] 3s² 3p¹",
  14: "[Ne] 3s² 3p²",
  15: "[Ne] 3s² 3p³",
  16: "[Ne] 3s² 3p⁴",
  17: "[Ne] 3s² 3p⁵",
  18: "[Ne] 3s² 3p⁶",
  19: "[Ar] 4s¹",
  20: "[Ar] 4s²",
  21: "[Ar] 3d¹ 4s²",
  22: "[Ar] 3d² 4s²",
  23: "[Ar] 3d³ 4s²",
  24: "[Ar] 3d⁵ 4s¹",
  25: "[Ar] 3d⁵ 4s²",
  26: "[Ar] 3d⁶ 4s²",
  27: "[Ar] 3d⁷ 4s²",
  28: "[Ar] 3d⁸ 4s²",
  29: "[Ar] 3d¹⁰ 4s¹",
  30: "[Ar] 3d¹⁰ 4s²",
  31: "[Ar] 3d¹⁰ 4s² 4p¹",
  32: "[Ar] 3d¹⁰ 4s² 4p²",
  33: "[Ar] 3d¹⁰ 4s² 4p³",
  34: "[Ar] 3d¹⁰ 4s² 4p⁴",
  35: "[Ar] 3d¹⁰ 4s² 4p⁵",
  36: "[Ar] 3d¹⁰ 4s² 4p⁶",
  37: "[Kr] 5s¹",
  38: "[Kr] 5s²",
  39: "[Kr] 4d¹ 5s²",
  40: "[Kr] 4d² 5s²",
  41: "[Kr] 4d⁴ 5s¹",
  42: "[Kr] 4d⁵ 5s¹",
  43: "[Kr] 4d⁵ 5s²",
  44: "[Kr] 4d⁷ 5s¹",
  45: "[Kr] 4d⁸ 5s¹",
  46: "[Kr] 4d¹⁰",
  47: "[Kr] 4d¹⁰ 5s¹",
  48: "[Kr] 4d¹⁰ 5s²",
  49: "[Kr] 4d¹⁰ 5s² 5p¹",
  50: "[Kr] 4d¹⁰ 5s² 5p²",
  51: "[Kr] 4d¹⁰ 5s² 5p³",
  52: "[Kr] 4d¹⁰ 5s² 5p⁴",
  53: "[Kr] 4d¹⁰ 5s² 5p⁵",
  54: "[Kr] 4d¹⁰ 5s² 5p⁶",
  55: "[Xe] 6s¹",
  56: "[Xe] 6s²",
  57: "[Xe] 5d¹ 6s²",
  58: "[Xe] 4f¹ 5d¹ 6s²",
  59: "[Xe] 4f³ 6s²",
  60: "[Xe] 4f⁴ 6s²",
  61: "[Xe] 4f⁵ 6s²",
  62: "[Xe] 4f⁶ 6s²",
  63: "[Xe] 4f⁷ 6s²",
  64: "[Xe] 4f⁷ 5d¹ 6s²",
  65: "[Xe] 4f⁹ 6s²",
  66: "[Xe] 4f¹⁰ 6s²",
  67: "[Xe] 4f¹¹ 6s²",
  68: "[Xe] 4f¹² 6s²",
  69: "[Xe] 4f¹³ 6s²",
  70: "[Xe] 4f¹⁴ 6s²",
  71: "[Xe] 4f¹⁴ 5d¹ 6s²",
  72: "[Xe] 4f¹⁴ 5d² 6s²",
  73: "[Xe] 4f¹⁴ 5d³ 6s²",
  74: "[Xe] 4f¹⁴ 5d⁴ 6s²",
  75: "[Xe] 4f¹⁴ 5d⁵ 6s²",
  76: "[Xe] 4f¹⁴ 5d⁶ 6s²",
  77: "[Xe] 4f¹⁴ 5d⁷ 6s²",
  78: "[Xe] 4f¹⁴ 5d⁹ 6s¹",
  79: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹",
  80: "[Xe] 4f¹⁴ 5d¹⁰ 6s²",
  81: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹",
  82: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²",
  83: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³",
  84: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴",
  85: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵",
  86: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶",
  87: "[Rn] 7s¹",
  88: "[Rn] 7s²",
  89: "[Rn] 6d¹ 7s²",
  90: "[Rn] 6d² 7s²",
  91: "[Rn] 5f² 6d¹ 7s²",
  92: "[Rn] 5f³ 6d¹ 7s²",
  93: "[Rn] 5f⁴ 6d¹ 7s²",
  94: "[Rn] 5f⁶ 7s²",
  95: "[Rn] 5f⁷ 7s²",
  96: "[Rn] 5f⁷ 6d¹ 7s²",
  97: "[Rn] 5f⁹ 7s²",
  98: "[Rn] 5f¹⁰ 7s²",
  99: "[Rn] 5f¹¹ 7s²",
  100: "[Rn] 5f¹² 7s²",
  101: "[Rn] 5f¹³ 7s²",
  102: "[Rn] 5f¹⁴ 7s²",
  103: "[Rn] 5f¹⁴ 7s² 7p¹",
  104: "[Rn] 5f¹⁴ 6d² 7s²",
  105: "[Rn] 5f¹⁴ 6d³ 7s²",
  106: "[Rn] 5f¹⁴ 6d⁴ 7s²",
  107: "[Rn] 5f¹⁴ 6d⁵ 7s²",
  108: "[Rn] 5f¹⁴ 6d⁶ 7s²",
  109: "[Rn] 5f¹⁴ 6d⁷ 7s²",
  110: "[Rn] 5f¹⁴ 6d⁹ 7s¹",
  111: "[Rn] 5f¹⁴ 6d¹⁰ 7s¹",
  112: "[Rn] 5f¹⁴ 6d¹⁰ 7s²",
  113: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹",
  114: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²",
  115: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³",
  116: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴",
  117: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵",
  118: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶"
};

// Real Electronegativity (Pauling), Melting/Boiling point (°C), Density, Discovery
const REAL_DATA = {
  1: { en: 2.20, mp: -259.16, bp: -252.87, dens: "0.0899 g/L", year: "1766 (Cavendish)" },
  2: { mp: -272.2, bp: -268.93, dens: "0.1786 g/L", year: "1868 (Janssen & Lockyer)" },
  3: { en: 0.98, mp: 180.5, bp: 1342, dens: "0.534 g/cm³", year: "1817 (Arfwedson)" },
  4: { en: 1.57, mp: 1287, bp: 2470, dens: "1.85 g/cm³", year: "1798 (Vauquelin)" },
  5: { en: 2.04, mp: 2076, bp: 3927, dens: "2.34 g/cm³", year: "1808 (Gay-Lussac)" },
  6: { en: 2.55, mp: 3550, bp: 4827, dens: "2.26 g/cm³", year: "Antike (Prähistorisch)" },
  7: { en: 3.04, mp: -210.0, bp: -195.79, dens: "1.251 g/L", year: "1772 (Rutherford)" },
  8: { en: 3.44, mp: -218.79, bp: -182.96, dens: "1.429 g/L", year: "1774 (Priestley & Scheele)" },
  9: { en: 3.98, mp: -219.67, bp: -188.11, dens: "1.696 g/L", year: "1886 (Moissan)" },
  10: { mp: -248.59, bp: -246.05, dens: "0.900 g/L", year: "1898 (Ramsay & Travers)" },
  11: { en: 0.93, mp: 97.79, bp: 882.8, dens: "0.968 g/cm³", year: "1807 (Davy)" },
  12: { en: 1.31, mp: 650, bp: 1090, dens: "1.738 g/cm³", year: "1755 (Black)" },
  13: { en: 1.61, mp: 660.32, bp: 2519, dens: "2.70 g/cm³", year: "1825 (Ørsted)" },
  14: { en: 1.90, mp: 1414, bp: 3265, dens: "2.329 g/cm³", year: "1824 (Berzelius)" },
  15: { en: 2.19, mp: 44.15, bp: 280.5, dens: "1.823 g/cm³", year: "1669 (Brand)" },
  16: { en: 2.58, mp: 115.21, bp: 444.6, dens: "2.07 g/cm³", year: "Antike (Prähistorisch)" },
  17: { en: 3.16, mp: -101.5, bp: -34.04, dens: "3.2 g/L", year: "1774 (Scheele)" },
  18: { mp: -189.35, bp: -185.85, dens: "1.784 g/L", year: "1894 (Rayleigh & Ramsay)" },
  19: { en: 0.82, mp: 63.5, bp: 759, dens: "0.862 g/cm³", year: "1807 (Davy)" },
  20: { en: 1.00, mp: 842, bp: 1484, dens: "1.54 g/cm³", year: "1808 (Davy)" },
  21: { en: 1.36, mp: 1541, bp: 2836, dens: "2.985 g/cm³", year: "1879 (Nilson)" },
  22: { en: 1.54, mp: 1668, bp: 3287, dens: "4.506 g/cm³", year: "1791 (Gregor)" },
  23: { en: 1.63, mp: 1910, bp: 3407, dens: "6.11 g/cm³", year: "1801 (del Río)" },
  24: { en: 1.66, mp: 1907, bp: 2671, dens: "7.19 g/cm³", year: "1797 (Vauquelin)" },
  25: { en: 1.55, mp: 1246, bp: 2061, dens: "7.21 g/cm³", year: "1774 (Gahn)" },
  26: { en: 1.83, mp: 1538, bp: 2862, dens: "7.874 g/cm³", year: "Antike (Prähistorisch)" },
  27: { en: 1.88, mp: 1495, bp: 2927, dens: "8.90 g/cm³", year: "1735 (Brandt)" },
  28: { en: 1.91, mp: 1455, bp: 2913, dens: "8.908 g/cm³", year: "1751 (Cronstedt)" },
  29: { en: 1.90, mp: 1084.62, bp: 2562, dens: "8.96 g/cm³", year: "Antike (Prähistorisch)" },
  30: { en: 1.65, mp: 419.53, bp: 907, dens: "7.14 g/cm³", year: "Antike (Prähistorisch)" },
  31: { en: 1.81, mp: 29.76, bp: 2204, dens: "5.91 g/cm³", year: "1875 (Lecoq de Boisbaudran)" },
  32: { en: 2.01, mp: 938.25, bp: 2833, dens: "5.323 g/cm³", year: "1886 (Winkler)" },
  33: { en: 2.18, mp: 817, bp: 614, dens: "5.727 g/cm³", year: "1250 (Albertus Magnus)" },
  34: { en: 2.55, mp: 221, bp: 685, dens: "4.819 g/cm³", year: "1817 (Berzelius)" },
  35: { en: 2.96, mp: -7.2, bp: 58.8, dens: "3.1028 g/cm³", year: "1826 (Balard)" },
  36: { en: 3.00, mp: -157.36, bp: -153.22, dens: "3.749 g/L", year: "1898 (Ramsay & Travers)" },
  37: { en: 0.82, mp: 39.3, bp: 688, dens: "1.532 g/cm³", year: "1861 (Bunsen & Kirchhoff)" },
  38: { en: 0.95, mp: 777, bp: 1382, dens: "2.64 g/cm³", year: "1790 (Crawford)" },
  39: { en: 1.22, mp: 1526, bp: 3345, dens: "4.472 g/cm³", year: "1794 (Gadolin)" },
  40: { en: 1.33, mp: 1855, bp: 4409, dens: "6.52 g/cm³", year: "1789 (Klaproth)" },
  41: { en: 1.6, mp: 2477, bp: 4744, dens: "8.57 g/cm³", year: "1801 (Hatchett)" },
  42: { en: 2.16, mp: 2623, bp: 4639, dens: "10.28 g/cm³", year: "1778 (Scheele)" },
  43: { en: 1.9, mp: 2157, bp: 4265, dens: "11.0 g/cm³", year: "1937 (Perrier & Segrè)" },
  44: { en: 2.2, mp: 2334, bp: 4150, dens: "12.45 g/cm³", year: "1844 (Claus)" },
  45: { en: 2.28, mp: 1964, bp: 3695, dens: "12.41 g/cm³", year: "1803 (Wollaston)" },
  46: { en: 2.20, mp: 1554.9, bp: 2963, dens: "12.023 g/cm³", year: "1803 (Wollaston)" },
  47: { en: 1.93, mp: 961.78, bp: 2162, dens: "10.49 g/cm³", year: "Antike (Prähistorisch)" },
  48: { en: 1.69, mp: 321.07, bp: 767, dens: "8.65 g/cm³", year: "1817 (Stromeyer)" },
  49: { en: 1.78, mp: 156.6, bp: 2072, dens: "7.31 g/cm³", year: "1863 (Reich & Richter)" },
  50: { en: 1.96, mp: 231.93, bp: 2602, dens: "7.31 g/cm³", year: "Antike (Prähistorisch)" },
  51: { en: 2.05, mp: 630.63, bp: 1587, dens: "6.697 g/cm³", year: "Antike (Prähistorisch)" },
  52: { en: 2.1, mp: 449.51, bp: 988, dens: "6.24 g/cm³", year: "1782 (von Reichenstein)" },
  53: { en: 2.66, mp: 113.7, bp: 184.3, dens: "4.933 g/cm³", year: "1811 (Courtois)" },
  54: { en: 2.6, mp: -111.7, bp: -108.12, dens: "5.894 g/L", year: "1898 (Ramsay & Travers)" },
  55: { en: 0.79, mp: 28.5, bp: 671, dens: "1.93 g/cm³", year: "1860 (Bunsen & Kirchhoff)" },
  56: { en: 0.89, mp: 727, bp: 1897, dens: "3.51 g/cm³", year: "1808 (Davy)" },
  57: { en: 1.1, mp: 920, bp: 3464, dens: "6.162 g/cm³", year: "1839 (Mosander)" },
  58: { en: 1.12, mp: 798, bp: 3443, dens: "6.77 g/cm³", year: "1803 (Klaproth & Berzelius)" },
  59: { en: 1.13, mp: 931, bp: 3520, dens: "6.77 g/cm³", year: "1885 (von Welsbach)" },
  60: { en: 1.14, mp: 1021, bp: 3074, dens: "7.01 g/cm³", year: "1885 (von Welsbach)" },
  61: { mp: 1042, bp: 3000, dens: "7.26 g/cm³", year: "1945 (Marinsky et al.)" },
  62: { en: 1.17, mp: 1072, bp: 1794, dens: "7.52 g/cm³", year: "1879 (de Boisbaudran)" },
  63: { mp: 822, bp: 1529, dens: "5.244 g/cm³", year: "1901 (Demarçay)" },
  64: { en: 1.20, mp: 1313, bp: 3273, dens: "7.90 g/cm³", year: "1880 (de Marignac)" },
  65: { mp: 1356, bp: 3230, dens: "8.23 g/cm³", year: "1843 (Mosander)" },
  66: { en: 1.22, mp: 1412, bp: 2567, dens: "8.54 g/cm³", year: "1886 (de Boisbaudran)" },
  67: { en: 1.23, mp: 1474, bp: 2700, dens: "8.79 g/cm³", year: "1878 (Soret & Delafontaine)" },
  68: { en: 1.24, mp: 1529, bp: 2868, dens: "9.066 g/cm³", year: "1843 (Mosander)" },
  69: { en: 1.25, mp: 1545, bp: 1950, dens: "9.32 g/cm³", year: "1879 (Cleve)" },
  70: { mp: 819, bp: 1196, dens: "6.90 g/cm³", year: "1878 (de Marignac)" },
  71: { en: 1.27, mp: 1663, bp: 3402, dens: "9.841 g/cm³", year: "1907 (Urbain & von Welsbach)" },
  72: { en: 1.3, mp: 2233, bp: 4603, dens: "13.31 g/cm³", year: "1923 (Coster & Hevesy)" },
  73: { en: 1.5, mp: 3017, bp: 5458, dens: "16.69 g/cm³", year: "1802 (Ekeberg)" },
  74: { en: 2.36, mp: 3422, bp: 5555, dens: "19.25 g/cm³", year: "1781 (Scheele)" },
  75: { en: 1.9, mp: 3186, bp: 5596, dens: "21.02 g/cm³", year: "1925 (Noddack & Tacke)" },
  76: { en: 2.2, mp: 3033, bp: 5012, dens: "22.59 g/cm³", year: "1803 (Tennant)" },
  77: { en: 2.2, mp: 2446, bp: 4428, dens: "22.56 g/cm³", year: "1803 (Tennant)" },
  78: { en: 2.28, mp: 1768.3, bp: 3825, dens: "21.45 g/cm³", year: "1735 (Ulloa)" },
  79: { en: 2.54, mp: 1064.18, bp: 2970, dens: "19.30 g/cm³", year: "Antike (Prähistorisch)" },
  80: { en: 2.00, mp: -38.83, bp: 356.73, dens: "13.534 g/cm³", year: "Antike (Prähistorisch)" },
  81: { en: 1.62, mp: 304, bp: 1473, dens: "11.85 g/cm³", year: "1861 (Crookes)" },
  82: { en: 2.33, mp: 327.46, bp: 1749, dens: "11.34 g/cm³", year: "Antike (Prähistorisch)" },
  83: { en: 2.02, mp: 271.4, bp: 1564, dens: "9.78 g/cm³", year: "1753 (Geoffroy)" },
  84: { en: 2.0, mp: 254, bp: 962, dens: "9.196 g/cm³", year: "1898 (Marie & Pierre Curie)" },
  85: { en: 2.2, mp: 302, bp: 337, dens: "6.2 g/cm³", year: "1940 (Corson et al.)" },
  86: { mp: -71, bp: -61.7, dens: "9.73 g/L", year: "1900 (Dorn)" },
  87: { en: 0.7, mp: 27, bp: 677, dens: "1.87 g/cm³", year: "1939 (Perey)" },
  88: { en: 0.9, mp: 700, bp: 1737, dens: "5.5 g/cm³", year: "1898 (Marie & Pierre Curie)" },
  89: { en: 1.1, mp: 1050, bp: 3198, dens: "10.07 g/cm³", year: "1899 (Debierne)" },
  90: { en: 1.3, mp: 1750, bp: 4788, dens: "11.72 g/cm³", year: "1829 (Berzelius)" },
  91: { en: 1.5, mp: 1572, bp: 4000, dens: "15.37 g/cm³", year: "1913 (Fajans & Göhring)" },
  92: { en: 1.38, mp: 1132.2, bp: 4131, dens: "19.1 g/cm³", year: "1789 (Klaproth)" },
  93: { en: 1.36, mp: 644, bp: 3902, dens: "20.45 g/cm³", year: "1940 (McMillan & Abelson)" },
  94: { en: 1.28, mp: 639.4, bp: 3228, dens: "19.86 g/cm³", year: "1940 (Seaborg et al.)" },
  95: { en: 1.3, mp: 1176, bp: 2607, dens: "12 g/cm³", year: "1944 (Seaborg et al.)" },
  96: { en: 1.3, mp: 1345, bp: 3110, dens: "13.51 g/cm³", year: "1944 (Seaborg et al.)" },
  97: { en: 1.3, mp: 986, bp: 2627, dens: "14.78 g/cm³", year: "1949 (Thompson et al.)" },
  98: { en: 1.3, mp: 900, bp: 1470, dens: "15.1 g/cm³", year: "1950 (Thompson et al.)" },
  99: { en: 1.3, mp: 860, bp: 996, dens: "8.84 g/cm³", year: "1952 (Ghiorso et al.)" },
  100: { en: 1.3, mp: 1527, dens: "9.7 g/cm³", year: "1952 (Ghiorso et al.)" },
  101: { en: 1.3, mp: 827, dens: "10.3 g/cm³", year: "1955 (Ghiorso et al.)" },
  102: { en: 1.3, mp: 827, dens: "9.9 g/cm³", year: "1958 (Flerov / Ghiorso)" },
  103: { en: 1.3, mp: 1627, dens: "15.6 g/cm³", year: "1961 (Ghiorso et al.)" },
  104: { mp: 2100, bp: 5500, dens: "23.2 g/cm³", year: "1964 (Dubna / Berkeley)" },
  105: { dens: "29.3 g/cm³", year: "1968 (Dubna / Berkeley)" },
  106: { dens: "35.0 g/cm³", year: "1974 (Berkeley / Oganessian)" },
  107: { dens: "37.1 g/cm³", year: "1981 (GSI Darmstadt)" },
  108: { dens: "40.7 g/cm³", year: "1984 (GSI Darmstadt)" },
  109: { dens: "37.4 g/cm³", year: "1982 (GSI Darmstadt)" },
  110: { dens: "34.8 g/cm³", year: "1994 (GSI Darmstadt)" },
  111: { dens: "28.7 g/cm³", year: "1994 (GSI Darmstadt)" },
  112: { mp: 10, bp: 67, dens: "14.0 g/cm³", year: "1996 (GSI Darmstadt)" },
  113: { mp: 430, bp: 1130, dens: "16 g/cm³", year: "2003 (RIKEN Japan)" },
  114: { mp: -73, bp: 107, dens: "9.928 g/cm³", year: "1998 (Dubna)" },
  115: { mp: 400, bp: 1100, dens: "13.5 g/cm³", year: "2003 (Dubna / LLNL)" },
  116: { mp: 435, bp: 812, dens: "12.9 g/cm³", year: "2000 (Dubna / LLNL)" },
  117: { mp: 450, bp: 610, dens: "7.2 g/cm³", year: "2010 (Dubna / LLNL / ORNL)" },
  118: { mp: 52, bp: 177, dens: "5.0 g/cm³", year: "2002 (Dubna / LLNL)" }
};

const elementsFile = path.resolve('src/data/elements.ts');
let content = fs.readFileSync(elementsFile, 'utf-8');

// Replace the end part with EXACT_ELECTRON_SHELLS and EXACT_ELECTRON_CONFIGURATIONS and REAL_DATA
const exportBlock = `
// Vollständige, 100% wissenschaftlich exakte Elektronen-Schalenbelegung nach NIST & IUPAC (K, L, M, N, O, P, Q)
export const EXACT_ELECTRON_SHELLS: Record<number, number[]> = ${JSON.stringify(ALL_118_SHELLS, null, 2)};

// Offizielle IUPAC/NIST Elektronenkonfiguration aller 118 chemischen Elemente
export const EXACT_ELECTRON_CONFIGURATIONS: Record<number, string> = ${JSON.stringify(ALL_118_CONFIGS, null, 2)};

// Echte physikalische Daten (Elektronegativität, Schmelzpunkt, Siedepunkt, Dichte, Entdeckung)
export const REAL_ELEMENT_PHYSICS: Record<number, { en?: number; mp?: number; bp?: number; dens?: string; year?: string }> = ${JSON.stringify(REAL_DATA, null, 2)};

export function getElectronShells(atomicNumber: number): number[] {
  return EXACT_ELECTRON_SHELLS[atomicNumber] || [2, 8, 8];
}

export function getElectronConfiguration(atomicNumber: number): string {
  return EXACT_ELECTRON_CONFIGURATIONS[atomicNumber] || '';
}

export function getElementPhysics(atomicNumber: number) {
  return REAL_ELEMENT_PHYSICS[atomicNumber] || {};
}
`;

// Replace getElectronShells function at the end
const funcRegex = /\/\/ Berechnet die Elektronenkonfiguration[\s\S]*$/;
if (funcRegex.test(content)) {
  content = content.replace(funcRegex, exportBlock.trim());
} else {
  content = content + '\n' + exportBlock.trim();
}

fs.writeFileSync(elementsFile, content, 'utf-8');
console.log('Successfully updated src/data/elements.ts with true scientific tables!');
