import React, { useState, useEffect, useRef } from 'react';
import { Shield, Star, BookOpen, BrainCircuit, CheckCircle, XCircle, ChevronRight, PenTool, Target, Zap, ChevronDown, Filter, Hash, Key, Copy, Download, Book } from 'lucide-react';

// --- HILFSFUNKTIONEN ---
const rand = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

const toRoman = (num) => {
  const lookup = {M:1000,CM:900,D:500,CD:400,C:100,XC:90,L:50,XL:40,X:10,IX:9,V:5,IV:4,I:1};
  let roman = '';
  for (let i in lookup) {
    while (num >= lookup[i]) { roman += i; num -= lookup[i]; }
  }
  return roman;
};

const isPrime = num => {
  for(let i = 2, s = Math.sqrt(num); i <= s; i++) if(num % i === 0) return false;
  return num > 1;
};

const gcd = (a, b) => b === 0 ? a : gcd(b, a % b);
const lcm = (a, b) => (a * b) / gcd(a, b);

// --- DATENBANK DER AUFGABEN-SCHABLONEN (30 MISSIONEN) ---
const TASKS = [
  // --- 1. GEOMETRIE: KOORDINATENSYSTEM ---
  {
    id: 1,
    type: 'analog',
    category: 'Geometrie (5. Klasse)',
    title: 'Geheimakte: Das Koordinaten-Versteck',
    story: 'Agent, wir haben verschlüsselte Koordinaten in diesem Sektor abgefangen. Du musst sie entschlüsseln!',
    briefing: {
      title: 'Was ist ein Koordinatensystem?',
      content: 'Ein Koordinatensystem ist wie eine genaue Schatzkarte! Die x-Achse geht waagerecht nach rechts. Die y-Achse geht senkrecht nach oben. Punkt: (x|y). Merkspruch: Zuerst zur Haustür gehen (rechts), dann die Treppe hochsteigen (oben)!',
      visual: (
        <svg viewBox="0 0 200 200" className="w-full h-auto max-h-48">
          <path d="M20,180 L180,180 M20,180 L20,20" stroke="#475569" strokeWidth="2"/>
          <text x="180" y="195" fill="#94a3b8" fontSize="12">x</text>
          <text x="5" y="20" fill="#94a3b8" fontSize="12">y</text>
          <path d="M60,180 L60,185 M100,180 L100,185 M140,180 L140,185" stroke="#475569" strokeWidth="2"/>
          <path d="M20,140 L15,140 M20,100 L15,100 M20,60 L15,60" stroke="#475569" strokeWidth="2"/>
          <path d="M20,60 L60,60 M60,180 L60,60" stroke="#818cf8" strokeWidth="2" strokeDasharray="4 4" fill="none"/>
          <circle cx="60" cy="60" r="5" fill="#818cf8"/>
          <text x="68" y="55" fill="#818cf8" fontSize="14" fontWeight="bold">P(2|6)</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const x1 = rand(1, 5), width = rand(2, 6), x2 = x1 + width;
       const y1 = rand(1, 5), height = rand(2, 6), y2 = y1 + height;
       const targets = ['eines Alien-Schmugglerrings', 'eines Rebellen-Lagers', 'eines verlorenen Artefakts'];
       const target = targets[rand(0, 2)];
       return {
          dynamicInstructions: [
            'Nimm dein Matheheft und ein Geodreieck.',
            'Zeichne ein Koordinatensystem (x-Achse bis 15, y-Achse bis 15).',
            `Trage die Eckpunkte ${target} ein: A(${x1}|${y1}), B(${x2}|${y1}), C(${x2}|${y2}), D(${x1}|${y2}).`,
            'Verbinde die Punkte in alphabetischer Reihenfolge.',
            'Berechne den Flächeninhalt (1 Kästchen = 1 cm²).'
          ],
          dynamicQuestion: 'Gib den Flächeninhalt in Quadratzentimetern ein:',
          correctAnswer: (width * height).toString(),
          dynamicHint: 'Überlege, wie du aus deiner Zeichnung die Länge und Breite der Figur herausfindest. Was machst du dann mit diesen beiden Längen?'
       };
    }
  },
  // --- 2. ARITHMETIK: PUNKT VOR STRICH ---
  {
    id: 2,
    type: 'digital',
    category: 'Arithmetik (4./5. Klasse)',
    title: 'Blitz-Mission: Code-Knacker',
    briefing: {
      title: 'Die goldene Regel: Punkt vor Strich',
      content: 'In der Mathematik gibt es eine eiserne Regel: "Punktrechnung geht vor Strichrechnung!" Zuerst Mal (×) und Geteilt (÷) ausrechnen, bevor du Plus (+) und Minus (-) rechnest.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="160" y="60" fill="#cbd5e1" fontSize="32" fontWeight="bold" textAnchor="middle">2 + </text>
          <text x="230" y="60" fill="#f472b6" fontSize="32" fontWeight="bold" textAnchor="middle">3 × 4</text>
          <path d="M 190 70 L 190 85 L 270 85 L 270 70" stroke="#f472b6" strokeWidth="2" fill="none"/>
          <text x="230" y="115" fill="#f472b6" fontSize="24" fontWeight="bold" textAnchor="middle">12</text>
          <text x="200" y="145" fill="#818cf8" fontSize="24" fontWeight="bold" textAnchor="middle">2 + 12 = 14</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 50,
    generateInstance: () => {
       // Logik so abgestimmt, dass keine negativen Ergebnisse entstehen können!
       const a = rand(10, 80), b = rand(2, 10), c = rand(5, 20), e = rand(2, 10), d = e * rand(2, 15);
       const stories = [
         'Das Sicherheitssystem des Raumschiffs blockiert. Löse die Gleichung, um die Türen zu öffnen!',
         'Ein fieser Hacker greift den Hauptcomputer an! Gib den korrekten Override-Code ein:',
         'Der Hyperantrieb ist extrem instabil. Berechne sofort den Stabilisierungs-Faktor!'
       ];
       return {
          dynamicStory: stories[rand(0, 2)],
          dynamicQuestion: `Berechne: ${a} + ${b} × ${c} - ${d} ÷ ${e}`,
          correctAnswer: (a + (b * c) - (d / e)).toString(),
          dynamicHint: 'Erinnere dich an die wichtigste Grundregel beim Rechnen mit verschiedenen Zeichen. Wer hat Vorfahrt?'
       };
    }
  },
  // --- 3. LOGIK: ZAHLENFOLGEN ---
  {
    id: 3,
    type: 'knobel',
    category: 'Logik (5. Klasse)',
    title: 'Alien-Zahlenfolge',
    briefing: {
      title: 'Geheimnis der Zahlenfolgen',
      content: 'Zahlenfolgen sind wie Geheimcodes. Finde heraus, was mit der Zahl passiert ist. Wurde Plus gerechnet? Minus? Oder vielleicht sogar malgenommen?',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="80" y="80" fill="#cbd5e1" fontSize="28" fontWeight="bold" textAnchor="middle">2</text>
          <text x="160" y="80" fill="#cbd5e1" fontSize="28" fontWeight="bold" textAnchor="middle">6</text>
          <text x="240" y="80" fill="#cbd5e1" fontSize="28" fontWeight="bold" textAnchor="middle">18</text>
          <path d="M 95 65 Q 120 40 145 65" stroke="#34d399" strokeWidth="2" fill="none" />
          <text x="120" y="45" fill="#34d399" fontSize="16" fontWeight="bold" textAnchor="middle">× 3</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 100,
    generateInstance: () => {
       const start = rand(2, 6), mult = rand(2, 4);
       const senders = ['Ein unbekanntes Alien', 'Eine fremde KI', 'Ein verschollenes Schiff'];
       const actions = ['versucht uns anzufunken', 'sendet einen Notruf', 'überträgt mysteriöse Daten'];
       return {
          dynamicStory: `${senders[rand(0, 2)]} ${actions[rand(0, 2)]}. Das Signal besteht aus einer Zahlenfolge. Welche Zahl kommt als Nächstes?`,
          dynamicQuestion: `${start}, ${start*mult}, ${start*mult*mult}, ${start*mult*mult*mult}, ?`,
          correctAnswer: (start * Math.pow(mult, 4)).toString(),
          dynamicHint: 'Untersuche den Sprung von der ersten zur zweiten Zahl. Welches Rechenzeichen könnte dahinterstecken? Teste diese Regel an der nächsten Zahl.'
       };
    }
  },
  // --- 4. BRÜCHE: EINFÜHRUNG ---
  {
    id: 4,
    type: 'digital',
    category: 'Bruchrechnung (5. Klasse)',
    title: 'Proviant-Verteilung',
    briefing: {
      title: 'Was sind eigentlich Brüche?',
      content: 'Die untere Zahl (Nenner) sagt dir, in wie viele Stücke wir zerschneiden. Die obere Zahl (Zähler) sagt dir, wie viele Stücke du nimmst.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <circle cx="120" cy="75" r="40" fill="#fbbf24" stroke="#d97706" strokeWidth="2"/>
          <text x="120" y="135" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">3/3 = 1 Ganzes</text>
          <text x="195" y="82" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle">+</text>
          <circle cx="270" cy="75" r="40" fill="#1e293b" stroke="#475569" strokeWidth="2" strokeDasharray="4"/>
          <path d="M 270 75 L 270 35 A 40 40 0 0 1 304.6 95 Z" fill="#f59e0b" stroke="#b45309" strokeWidth="1"/>
          <text x="270" y="135" fill="#cbd5e1" fontSize="16" fontWeight="bold" textAnchor="middle">1/3</text>
          <text x="350" y="82" fill="#fbbf24" fontSize="28" fontWeight="bold" textAnchor="middle">= 4/3</text>
        </svg>
      )
    },
    inputType: 'choice',
    points: 80,
    generateInstance: () => {
       const ast = rand(3, 7), pizz = ast + rand(1, 5); 
       const intPart = Math.floor(pizz/ast), rest = pizz % ast;
       const correctText = `${pizz}/${ast} (also ${intPart} und ${rest}/${ast})`;
       let opts = [
           `${pizz-1}/${ast} (also ${Math.floor((pizz-1)/ast)} und ${(pizz-1)%ast}/${ast})`, 
           `${ast}/${pizz}`, correctText, `${intPart} und 1/${ast}`
       ].sort(() => Math.random() - 0.5);
       
       const themes = [
         { food: 'Pizzen', people: 'Astronauten' },
         { food: 'Energiezellen', people: 'Wartungsroboter' },
         { food: 'Wasser-Rationen', people: 'Mars-Kolonisten' }
       ];
       const theme = themes[rand(0, 2)];
       
       return {
          dynamicStory: `Wir haben ${pizz} ${theme.food} an Bord, aber ${ast} ${theme.people} haben großen Bedarf. Alle sollen exakt gleich viel bekommen.`,
          dynamicQuestion: `Wie viel bekommt jeder der ${theme.people}?`,
          dynamicOptions: opts,
          correctAnswer: correctText,
          dynamicHint: 'Stell dir vor, du verteilst zuerst alle vollen Einheiten nacheinander aus. Wie kannst du den Rest, der am Ende noch übrig bleibt, gerecht zerschneiden?'
       };
    }
  },
  // --- 5. ARITHMETIK: SCHRIFTLICH MULTIPLIZIEREN ---
  {
    id: 5,
    type: 'analog',
    category: 'Arithmetik (5. Klasse)',
    title: 'Geheimakte: Frachtkosten',
    briefing: {
      title: 'Schriftlich Multiplizieren',
      content: 'Schreibe die Ergebnisse treppenförmig untereinander. Zum Schluss ziehst du einen Strich und addierst alles!',
      visual: (
        <svg viewBox="0 0 400 200" className="w-full h-auto max-h-48">
          <text x="200" y="40" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle" letterSpacing="4">3456 × 27</text>
          <path d="M 120 55 L 280 55" stroke="#475569" strokeWidth="2"/>
          <text x="280" y="90" fill="#34d399" fontSize="20" fontWeight="bold" textAnchor="end" letterSpacing="4">69120</text>
          <text x="280" y="125" fill="#f472b6" fontSize="20" fontWeight="bold" textAnchor="end" letterSpacing="4">24192</text>
          <path d="M 120 140 L 280 140" stroke="#475569" strokeWidth="2"/>
          <text x="120" y="170" fill="#cbd5e1" fontSize="20" fontWeight="bold">+</text>
          <text x="280" y="175" fill="#818cf8" fontSize="24" fontWeight="bold" textAnchor="end" letterSpacing="4">93312</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 200,
    generateInstance: () => {
       const n1 = rand(2000, 9999), n2 = rand(1000, 5000);
       const items = ['Hitzeschilde', 'Laser-Batterien', 'Navigations-Module'];
       const item = items[rand(0, 2)];
       return {
          dynamicStory: `Wir bestellen ${n1} neue ${item}. Ein einzelnes Modul kostet ${n2} Credits.`,
          dynamicInstructions: [
            `Schreibe die Aufgabe genau auf: ${n1} × ${n2}.`,
            'Rechne sauber Kästchen für Kästchen untereinander.',
            'Addiere am Ende deine Zwischenergebnisse schriftlich zusammen.'
          ],
          dynamicQuestion: 'Wie hoch ist der Gesamtpreis in Credits?',
          correctAnswer: (n1 * n2).toString(),
          dynamicHint: 'Achte beim treppenförmigen Untereinanderschreiben auf die Platzhalter (Nullen), je nachdem, mit welcher Stelle du gerade rechnest!'
       };
    }
  },
  // --- 6. ARITHMETIK: POTENZEN ---
  {
    id: 6,
    type: 'digital',
    category: 'Arithmetik (5. Klasse)',
    title: 'Blitz-Mission: Energie-Vervielfältigung',
    briefing: {
      title: 'Die Macht der Potenzen',
      content: 'Potenzen sind eine Abkürzung für langes Malnehmen. 2³ bedeutet 2 × 2 × 2 = 8.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="120" y="80" fill="#cbd5e1" fontSize="48" fontWeight="bold">2</text>
          <text x="150" y="50" fill="#f472b6" fontSize="24" fontWeight="bold">5</text>
          <text x="180" y="80" fill="#cbd5e1" fontSize="32" fontWeight="bold">=</text>
          <text x="290" y="65" fill="#34d399" fontSize="20" fontWeight="bold" textAnchor="middle">2 × 2 × 2 × 2 × 2</text>
          <text x="290" y="105" fill="#818cf8" fontSize="24" fontWeight="bold" textAnchor="middle">= 32</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 100,
    generateInstance: () => {
       const base = rand(2, 5), exp = rand(3, 6);
       const themes = [
         { threat: 'Computervirus', verb: 'infiziert', unit: 'Bots' },
         { threat: 'Alien-Pilz', verb: 'befallen', unit: 'Sporen' },
         { threat: 'Energie-Parasit', verb: 'lahmgelegt', unit: 'Zellen' }
       ];
       const theme = themes[rand(0, 2)];
       return {
          dynamicStory: `Ein gefährlicher ${theme.threat} hat das System ${theme.verb}! Er startet mit ${base} ${theme.unit} und ver-${base}-facht sich jede Sekunde!`,
          dynamicQuestion: `Wie viele ${theme.unit} sind es nach ${exp} Sekunden? (Berechne ${base} hoch ${exp})`,
          correctAnswer: Math.pow(base, exp).toString(),
          dynamicHint: 'Die hochgestellte Zahl ist nur ein Befehl: Wie oft musst du die vordere Zahl aufschreiben und immer wieder mit sich selbst malnehmen?'
       };
    }
  },
  // --- 7. ALGEBRA: DISTRIBUTIVGESETZ ---
  {
    id: 7,
    type: 'digital',
    category: 'Algebra (5. Klasse)',
    title: 'Code-Knacker: Der clevere Händler',
    briefing: {
      title: 'Das Distributivgesetz',
      content: 'Das Distributivgesetz hilft beim Kopfrechnen! 7 × 999 ist schwer. Aber 999 ist (1000 - 1). Rechne 7 × 1000 minus 7 × 1. Viel einfacher!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="40" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle">7 × 999</text>
          <text x="200" y="80" fill="#34d399" fontSize="24" fontWeight="bold" textAnchor="middle">= 7 × (1000 - 1)</text>
          <text x="200" y="130" fill="#818cf8" fontSize="24" fontWeight="bold" textAnchor="middle">= 7000 - 7 = 6993</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 120,
    generateInstance: () => {
       const m = rand(3, 9);
       const bases = [99, 999, 9999];
       const base = bases[rand(0, 2)];
       const items = ['Plasma-Spulen', 'Schild-Generatoren', 'Hyper-Kerne'];
       const item = items[rand(0, 2)];
       return {
          dynamicStory: `Ein Händler verkauft dir ${m} ${item} für je exakt ${base} Credits. Zeige, dass du ein Meister im Kopfrechnen bist!`,
          dynamicQuestion: `Nutze das Distributivgesetz im Kopf. Was kosten die ${m} ${item} insgesamt?`,
          correctAnswer: (m * base).toString(),
          dynamicHint: 'Nutze einen Rechentrick: Gibt es in der Aufgabe eine Zahl, die extrem nah an einem vollen Zehner, Hunderter oder Tausender liegt?'
       };
    }
  },
  // --- 8. ALGEBRA: KOMMUTATIVGESETZ ---
  {
    id: 8,
    type: 'knobel',
    category: 'Algebra (5. Klasse)',
    title: 'Logik-Protokoll: Chaos im Rechenkern',
    briefing: {
      title: 'Kommutativ- und Assoziativgesetz',
      content: '"Kommutativgesetz" heißt: Du darfst bei Plus und Mal vertauschen. Trick: Suche bei Plusaufgaben immer zuerst nach Zahlen, die zusammen einen glatten Zehner ergeben!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="40" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle">17 + 89 + 83</text>
          <text x="200" y="100" fill="#34d399" fontSize="24" fontWeight="bold" textAnchor="middle">= (17 + 83) + 89</text>
          <text x="200" y="140" fill="#818cf8" fontSize="24" fontWeight="bold" textAnchor="middle">= 100 + 89 = 189</text>
        </svg>
      )
    },
    inputType: 'choice',
    points: 80,
    generateInstance: () => {
       const end1 = rand(1, 4), end3 = 10 - end1, end2 = rand(1, 9);
       const a = rand(1, 5) * 10 + end1, b = rand(1, 9) * 10 + end2, c = rand(1, 9) * 10 + end3; 
       const correctOpt = `Zuerst ${a} + ${c} rechnen, dann + ${b}`;
       let opts = [`Zuerst ${a} + ${b}, dann + ${c}`, correctOpt, `Alles untereinander schreiben`, `Einfach von links nach rechts rechnen`].sort(() => Math.random() - 0.5);
       
       const stories = [
         'Der Zentral-Computer ist überlastet.',
         'Die Schiffs-KI hat einen gefährlichen Aussetzer.',
         'Das Navigationssystem hängt sich in einer Schleife auf.'
       ];
       
       return {
          dynamicStory: `${stories[rand(0, 2)]} Du musst seine Rechenwege optimieren. Er soll "${a} + ${b} + ${c}" ausrechnen.`,
          dynamicQuestion: 'Welcher Rechenweg ist am schlausten und schnellsten?',
          dynamicOptions: opts,
          correctAnswer: correctOpt,
          dynamicHint: 'Du musst nicht streng von links nach rechts rechnen. Suche nach zwei Zahlen, deren Endziffern wunderbar zusammenpassen!'
       };
    }
  },
  // --- 9. SACHAUFGABEN: TREIBSTOFF ---
  {
    id: 9,
    type: 'analog',
    category: 'Sachaufgaben',
    title: 'Geheimakte: Treibstoff-Krise',
    briefing: {
      title: 'Komplexe Sachaufgaben lösen',
      content: '1. GEGEBEN: Schreibe alle Zahlen heraus. 2. GESUCHT: Was soll herausgefunden werden? 3. RECHNUNG: Überlege dir die Schritte. 4. ANTWORT: Schreibe einen Satz.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <path d="M 50 100 L 350 100" stroke="#475569" strokeWidth="4" strokeDasharray="10 5"/>
          <circle cx="50" cy="100" r="8" fill="#34d399"/>
          <circle cx="350" cy="100" r="8" fill="#ef4444"/>
          <text x="50" y="75" fill="#cbd5e1" fontSize="32">🚀</text>
          <text x="200" y="130" fill="#94a3b8" fontSize="16" fontWeight="bold" textAnchor="middle">Strecke / Tempo = Zeit</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 250,
    generateInstance: () => {
       const speedBase = rand(2, 5); 
       const speed = speedBase * 10000; // Garantiert glatte Geschwindigkeiten (z.B. 30.000)
       const hours = rand(50, 200);
       const dist = speed * hours; // Garantiert glatte Division (keine Kommazahlen)
       const cons = rand(3, 8) * 10;
       const liquids = ['Treibstoff', 'Flüssig-Plasma', 'Antimaterie'];
       const liquid = liquids[rand(0, 2)];
       return {
          dynamicStory: `Gesamtstrecke: ${dist.toLocaleString('de-DE')} km. Geschwindigkeit: ${speed.toLocaleString('de-DE')} km/h. Der Antrieb verbraucht pro Stunde ${cons} Liter ${liquid}.`,
          dynamicInstructions: [
            'Berechne im 1. Schritt: Wie viele Stunden dauert die Reise? (Strecke ÷ Geschwindigkeit)',
            `Berechne im 2. Schritt: Wie viel ${liquid} wird insgesamt verbraucht?`
          ],
          dynamicQuestion: `Wie viele Liter ${liquid} verbraucht das Schiff auf der Reise?`,
          correctAnswer: (hours * cons).toString(),
          dynamicHint: 'Das ist eine Aufgabe mit zwei Schritten. Was musst du aus der Entfernung und der Geschwindigkeit zuerst herausfinden, bevor du den Verbrauch berechnen kannst?'
       };
    }
  },
  // --- 10. ARITHMETIK: NULLEN WEGLASSEN ---
  {
    id: 10,
    type: 'digital',
    category: 'Arithmetik (5. Klasse)',
    title: 'Blitz-Mission: Asteroiden-Mining',
    briefing: {
      title: 'Trick: Nullen weglassen',
      content: 'Ein genialer Trick für große Zahlen: Wenn alle Zahlen am Ende gleich viele Nullen haben, streiche sie vorübergehend weg! Hänge sie am Ende einfach wieder ans Ergebnis.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
           <text x="200" y="50" fill="#cbd5e1" fontSize="28" fontWeight="bold" textAnchor="middle">12.<tspan fill="#475569">000.000</tspan> - 3.<tspan fill="#475569">000.000</tspan></text>
           <text x="200" y="125" fill="#818cf8" fontSize="28" fontWeight="bold" textAnchor="middle">= 9.<tspan fill="#cbd5e1">000.000</tspan></text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const a = rand(10, 50) * 1000000, b = rand(2, 8) * 1000000, c = rand(1, 5) * 1000000;
       const themes = [
         { res: 'Eisen', bad: 'Piraten' },
         { res: 'Titan', bad: 'Rost-Käfer' },
         { res: 'Gold', bad: 'intergalaktische Diebe' }
       ];
       const t = themes[rand(0, 2)];
       return {
          dynamicStory: `Unsere Minen haben ${a.toLocaleString('de-DE')} Tonnen ${t.res} abgebaut. Wir haben ${b.toLocaleString('de-DE')} Tonnen legal verkauft. Die ${t.bad} haben dann noch ${c.toLocaleString('de-DE')} Tonnen gestohlen!`,
          dynamicQuestion: `Wie viele Tonnen ${t.res} befinden sich jetzt noch im Lager?`,
          correctAnswer: (a - b - c).toString(),
          dynamicHint: 'Lass dich von den großen Zahlen nicht einschüchtern. Was darf man beim Rechnen im Kopf vorübergehend ignorieren, solange man es danach wieder anhängt?'
       };
    }
  },
  // --- 11. ARITHMETIK: SCHRIFTLICH DIVISION ---
  {
    id: 11,
    type: 'analog',
    category: 'Arithmetik (5. Klasse)',
    title: 'Geheimakte: Evakuierung',
    briefing: {
      title: 'Schriftliche Division',
      content: 'Beim schriftlichen Teilen schaust du dir die Zahl von links nach rechts an. Wie oft passt der Teiler in die ersten Ziffern? Schreibe den Rest auf und ziehe die nächste Ziffer runter.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="40" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle" letterSpacing="2">12456 ÷ 8 = 15...</text>
          <text x="150" y="95" fill="#34d399" fontSize="18" textAnchor="middle">44</text>
          <text x="150" y="115" fill="#f472b6" fontSize="18" textAnchor="middle">-40</text>
          <path d="M 130 120 L 170 120" stroke="#475569" strokeWidth="2"/>
          <text x="160" y="140" fill="#34d399" fontSize="18" textAnchor="middle">45</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 200,
    generateInstance: () => {
       const divisor = rand(3, 9), ansBase = rand(1000, 4000), dividend = divisor * ansBase;
       const themes = [
         { p: 'Wissenschaftler', v: 'Rettungskapsel' },
         { p: 'Passagiere', v: 'Shuttle' },
         { p: 'Kadetten', v: 'Trainingsschiff' }
       ];
       const t = themes[rand(0, 2)];
       return {
          dynamicStory: `Eine Station muss evakuiert werden! Wir haben genau ${dividend} ${t.p}. In jedes ${t.v} passen exakt ${divisor} Personen.`,
          dynamicInstructions: [
            `Schreibe die Aufgabe ${dividend} ÷ ${divisor} in dein Heft.`,
            'Rechne Schritt für Schritt von links nach rechts.'
          ],
          dynamicQuestion: `Wie viele Fahrzeuge (vom Typ ${t.v}) werden benötigt?`,
          correctAnswer: ansBase.toString(),
          dynamicHint: 'Schau dir die große Zahl schrittweise von links nach rechts an. Wie oft passt der Teiler in den ersten kleinen Abschnitt?'
       };
    }
  },
  // --- 12. LOGIK: RÖMISCHE ZAHLEN ---
  {
    id: 12,
    type: 'digital',
    category: 'Logik & Geschichte',
    title: 'Code-Knacker: Antike Sternenkarte',
    briefing: {
      title: 'Das Geheimnis der römischen Zahlen',
      content: 'I=1, V=5, X=10, L=50, C=100, D=500, M=1000. Symbole werden addiert (XX = 20). Steht ein kleineres Symbol VOR einem größeren, wird es abgezogen! IV = 5-1 = 4.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="60" fill="#fbbf24" fontSize="32" fontWeight="bold" textAnchor="middle" letterSpacing="4">M C M X C I V</text>
          <text x="200" y="115" fill="#cbd5e1" fontSize="18" fontStyle="italic" textAnchor="middle">M=1000, CM=900, XC=90, IV=4</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const num = rand(1000, 3999);
       const styles = ['antiken Symbolen', 'vergessenen Runen', 'königlichen Zeichen'];
       const style = styles[rand(0, 2)];
       return {
          dynamicStory: `Wir haben eine Sternenkarte einer uralten Alien-Kultur gefunden. Die Koordinaten sind in ${style} geschrieben.`,
          dynamicQuestion: `Entschlüssele folgende Koordinate: ${toRoman(num).split('').join(' ')}`,
          correctAnswer: num.toString(),
          dynamicHint: 'Gehe Buchstabe für Buchstabe durch. Achte besonders auf Stellen, an denen ein kleiner Wert direkt vor einem großen steht!'
       };
    }
  },
  // --- 13. KOMBINATORIK: BAUMDIAGRAMM ---
  {
    id: 13,
    type: 'knobel',
    category: 'Kombinatorik (5. Klasse)',
    title: 'Logik-Protokoll: Der Tresor-Code',
    briefing: {
      title: 'Kombinatorik und Baumdiagramme',
      content: 'Wenn du alle Möglichkeiten finden willst, musst du systematisch vorgehen! Starte mit der kleinsten Ziffer vorne. Welche können dann folgen? Mache dir im Kopf ein "Baumdiagramm".',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="100" y="75" fill="#cbd5e1" fontSize="20" fontWeight="bold">Start</text>
          <path d="M 150 70 L 200 30 M 150 70 L 200 70 M 150 70 L 200 110" stroke="#818cf8" strokeWidth="2" />
          <text x="220" y="35" fill="#34d399" fontSize="20" fontWeight="bold">1</text>
          <text x="220" y="75" fill="#34d399" fontSize="20" fontWeight="bold">5</text>
          <text x="220" y="115" fill="#34d399" fontSize="20" fontWeight="bold">9</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 100,
    generateInstance: () => {
       // Variiert zwischen 3 oder 4 Ziffern für mehr Wiederspielwert (Lösung: 6 oder 24)
       const isFour = Math.random() > 0.5;
       const d1 = rand(0, 2), d2 = rand(3, 5), d3 = rand(6, 7), d4 = rand(8, 9);
       const digitsText = isFour ? `${d1}, ${d2}, ${d3} und ${d4}` : `${d1}, ${d2} und ${d3}`;
       const ans = isFour ? '24' : '6';
       
       const locks = ['Das Sicherheitsschloss', 'Der Waffenkammer-Code', 'Der Reaktor-Zugang'];
       const lock = locks[rand(0, 2)];
       return {
          dynamicStory: `${lock} klemmt. Wir wissen, dass der Code aus den Ziffern ${digitsText} besteht. Keine Ziffer kommt doppelt vor.`,
          dynamicQuestion: 'Wie viele verschiedene Codes musst du maximal ausprobieren?',
          correctAnswer: ans,
          dynamicHint: 'Gehe mit System vor: Lege eine Ziffer für die erste Stelle fest. Wie viele Möglichkeiten hast du dann noch für die weiteren Stellen?'
       };
    }
  },
  // --- 14. ZAHLENTHEORIE: PRIMZAHLEN ---
  {
    id: 14,
    type: 'analog',
    category: 'Zahlentheorie (5. Klasse)',
    title: 'Geheimakte: Unknackbare Verschlüsselung',
    briefing: {
      title: 'Das Geheimnis der Primzahlen',
      content: 'Eine Primzahl ist ein Einzelgänger. Sie lässt sich nur durch 1 und durch sich selbst ohne Rest teilen. 7 ist eine Primzahl. 9 ist KEINE Primzahl. Die 1 zählt nicht als Primzahl!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="100" y="40" fill="#34d399" fontSize="24" fontWeight="bold">7 = 1 × 7</text>
          <text x="100" y="60" fill="#34d399" fontSize="14" fontStyle="italic">(Primzahl)</text>
          <text x="280" y="40" fill="#ef4444" fontSize="24" fontWeight="bold">9 = 3 × 3</text>
          <text x="280" y="60" fill="#ef4444" fontSize="14" fontStyle="italic">(Keine Primzahl)</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 250,
    generateInstance: () => {
       const ranges = [[10, 30], [20, 40], [30, 50], [40, 60], [50, 70]];
       const r = ranges[rand(0, ranges.length - 1)];
       const villains = ['Spionen', 'feindlichen Hackern', 'Kopfgeldjägern'];
       const villain = villains[rand(0, 2)];
       let sum = 0;
       for (let i = r[0]; i <= r[1]; i++) if (isPrime(i)) sum += i;
       return {
          dynamicStory: `Um Nachrichten vor ${villain} zu verstecken, nutzen wir die stärkste Waffe der Mathematik: Primzahlen!`,
          dynamicInstructions: [
            `Schreibe alle Zahlen von ${r[0]} bis ${r[1]} in dein Heft.`,
            'Streiche alle Zahlen durch, die durch 2, 3, 5 oder 7 teilbar sind (außer diese Zahlen selbst).',
            'Die Zahlen, die übrig bleiben, sind Primzahlen. Addiere sie!'
          ],
          dynamicQuestion: `Wie lautet die Summe aller Primzahlen zwischen ${r[0]} und ${r[1]}?`,
          correctAnswer: sum.toString(),
          dynamicHint: 'Nicht jede ungerade Zahl ist eine Primzahl. Überprüfe die Zahlen im Kopf mit dem kleinen Einmaleins (steckt sie z.B. in der 3er- oder 7er-Reihe?).'
       };
    }
  },
  // --- 15. LOGIK: MAGISCHES QUADRAT ---
  {
    id: 15,
    type: 'knobel',
    category: 'Logik & Arithmetik',
    title: 'Knobel-Tresor: Der Reaktor-Kern',
    briefing: {
      title: 'Was ist ein Magisches Quadrat?',
      content: 'In einem magischen Quadrat (hier 3x3 Felder) müssen die Zahlen so eingetragen werden, dass jede Zeile (waagerecht), jede Spalte (senkrecht) und sogar beide Diagonalen exakt dieselbe Summe ergeben!',
      visual: (
        <svg viewBox="0 0 200 200" className="w-full h-auto max-h-64">
          <rect x="50" y="50" width="100" height="100" fill="none" stroke="#818cf8" strokeWidth="4"/>
          <line x1="83" y1="50" x2="83" y2="150" stroke="#818cf8" strokeWidth="2"/>
          <line x1="116" y1="50" x2="116" y2="150" stroke="#818cf8" strokeWidth="2"/>
          <line x1="50" y1="83" x2="150" y2="83" stroke="#818cf8" strokeWidth="2"/>
          <line x1="50" y1="116" x2="150" y2="116" stroke="#818cf8" strokeWidth="2"/>
          <line x1="55" y1="55" x2="145" y2="145" stroke="#f472b6" strokeWidth="3" opacity="0.5"/>
          <text x="170" y="100" fill="#f472b6" fontSize="16" fontWeight="bold">= Summe</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const offset = rand(0, 5), min = 1 + offset, max = 9 + offset, center = 5 + offset, sum = center * 3;
       const items = ['Energiestäbe', 'Kühl-Akkus', 'Plasma-Zellen'];
       const item = items[rand(0, 2)];
       return {
          dynamicStory: `Um den Reaktor zu kühlen, musst du die ${item} in einem "Magischen Quadrat" anordnen.`,
          dynamicQuestion: `Ein 3x3 Quadrat hat die Ziffern ${min} bis ${max}. Die magische Summe ist überall ${sum}. Welche Zahl MUSS zwingend im mittleren Feld stehen?`,
          correctAnswer: center.toString(),
          dynamicHint: 'Welches der neun Felder ist am wichtigsten, weil es für die meisten Reihen, Spalten und Diagonalen gleichzeitig gebraucht wird?'
       };
    }
  },
  // --- 16. GRÖSSEN: ZEIT ---
  {
    id: 16,
    type: 'analog',
    category: 'Größen & Messen',
    title: 'Geheimakte: Warp-Sprung',
    briefing: {
      title: 'Rechnen mit der Zeit',
      content: 'Zeit verhält sich anders als normale Zahlen! 1 Tag hat 24 Stunden. 1 Stunde hat 60 Minuten. Wenn du über den Tageswechsel (24:00 Uhr) hinaus rechnest, beginnt die Uhr wieder bei 00:00 Uhr.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <circle cx="200" cy="75" r="50" fill="none" stroke="#475569" strokeWidth="4"/>
          <text x="110" y="80" fill="#cbd5e1" fontSize="24" fontWeight="bold">14:00</text>
          <path d="M 130 50 Q 200 10 270 50" stroke="#34d399" strokeWidth="2" fill="none" />
          <text x="200" y="25" fill="#34d399" fontSize="14" fontWeight="bold" textAnchor="middle">+ 100 Stunden</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 200,
    generateInstance: () => {
       const startH = rand(8, 20), flight = rand(50, 250), endH = (startH + flight) % 24;
       const dests = ['in eine andere Galaxie', 'zum Rand des Universums', 'ins Zentrum der Milchstraße'];
       const dest = dests[rand(0, 2)];
       return {
          dynamicStory: `Wir planen einen Hyperraum-Sprung ${dest}. Die Berechnungen der Bordzeit müssen extrem präzise sein!`,
          dynamicInstructions: [
            `Startzeit: Montag, genau ${startH}:00 Uhr.`,
            `Flugdauer: Exakt ${flight} Stunden.`,
            'Rechne aus, wie viele volle Tage (à 24h) in der Flugdauer stecken.',
            'Addiere die restlichen Stunden dann zur Start-Uhrzeit.'
          ],
          dynamicQuestion: 'Um wie viel Uhr (volle Stunde, ohne Wochentag) kommen wir an? Gib nur die Stundenzahl (z.B. 12) ein.',
          correctAnswer: endH === 0 ? ['0', '24', '00'] : [endH.toString(), endH.toString().padStart(2, '0')],
          dynamicHint: 'Die Zeit rechnet nicht im Hundertersystem! Was passiert mit der Uhrzeit, wenn du die 24-Stunden-Grenze überschreitest?'
       };
    }
  },
  // --- 17. GEOMETRIE: UMFANG / FLÄCHE ---
  {
    id: 17,
    type: 'analog',
    category: 'Geometrie (5. Klasse)',
    title: 'Geheimakte: Basis-Bau auf dem Mars',
    briefing: {
      title: 'Umfang vs. Flächeninhalt',
      content: 'ACHTUNG, Verwechslungsgefahr! UMFANG (U): Der Zaun DRUMHERUM (a + b + a + b). FLÄCHENINHALT (A): Der Teppich DRINNEN (a × b).',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <rect x="50" y="40" width="100" height="60" fill="none" stroke="#f472b6" strokeWidth="4" strokeDasharray="5"/>
          <text x="100" y="125" fill="#f472b6" fontSize="16" fontWeight="bold" textAnchor="middle">Umfang = Zaun</text>
          <rect x="250" y="40" width="100" height="60" fill="#34d399" stroke="#10b981" strokeWidth="2"/>
          <text x="300" y="125" fill="#34d399" fontSize="16" fontWeight="bold" textAnchor="middle">Fläche = Drinnen</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 250,
    generateInstance: () => {
       const a = rand(3, 10), b = a + rand(1, 6), U = 2 * (a + b), A = a * b;
       const buildings = ['Treibhaus', 'Biologie-Labor', 'Wohn-Modul'];
       const building = buildings[rand(0, 2)];
       return {
          dynamicStory: `Wir errichten ein rechteckiges ${building}. Die Sensoren melden einen Logik-Fehler in den Bauplänen.`,
          dynamicInstructions: [
            `Finde ein Rechteck, das genau ${U} Meter UMFANG hat.`,
            `Gleichzeitig MUSS dieses Rechteck genau ${A} Quadratmeter FLÄCHE haben.`,
            'Probiere verschiedene Seitenlängen aus.'
          ],
          dynamicQuestion: 'Wie viele Meter lang ist die LÄNGERE Seite dieses Rechtecks?',
          correctAnswer: b.toString(),
          dynamicHint: 'Verwechsle nicht Rand und Innenraum! Bei welchem der beiden rechnet man Plus, und bei welchem Mal?'
       };
    }
  },
  // --- 18. BRÜCHE: ADDIEREN ---
  {
    id: 18,
    type: 'digital',
    category: 'Bruchrechnung (5. Klasse)',
    title: 'Blitz-Mission: Treibstoff-Mix',
    briefing: {
      title: 'Brüche addieren',
      content: 'Solange zwei Brüche denselben Nenner haben, ist das Addieren ganz leicht! Du zählst einfach nur die Zähler (die obere Zahl) zusammen. Der Nenner bleibt gleich!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="120" y="80" fill="#cbd5e1" fontSize="32" fontWeight="bold" textAnchor="middle">3/8</text>
          <text x="170" y="80" fill="#f472b6" fontSize="32" fontWeight="bold" textAnchor="middle">+</text>
          <text x="220" y="80" fill="#cbd5e1" fontSize="32" fontWeight="bold" textAnchor="middle">2/8</text>
          <text x="270" y="80" fill="#34d399" fontSize="32" fontWeight="bold" textAnchor="middle">=</text>
          <text x="320" y="80" fill="#818cf8" fontSize="32" fontWeight="bold" textAnchor="middle">5/8</text>
        </svg>
      )
    },
    inputType: 'choice',
    points: 80,
    generateInstance: () => {
       const denom = rand(5, 15), n1 = rand(1, denom - 2), n2 = rand(1, denom - n1);
       const correctAns = `${n1+n2}/${denom}`;
       let opts = [`${n1+n2}/${denom*2}`, correctAns, `${Math.abs(n1-n2)}/${denom}`, `${n1+n2+1}/${denom}`].filter((v, i, a) => a.indexOf(v) === i);
       while(opts.length < 4) { opts.push(`${rand(1, 10)}/${denom}`); opts = [...new Set(opts)]; }
       opts.sort(() => Math.random() - 0.5);
       
       const tanks = ['Treibstofftanks', 'Sauerstoff-Reserven', 'Kühlflüssigkeits-Behälter'];
       const tank = tanks[rand(0, 2)];
       
       return {
          dynamicStory: `Zwei ${tank} müssen in den Hauptantrieb umgepumpt werden, bevor wir starten können.`,
          dynamicQuestion: `Behälter A ist ${n1}/${denom} voll. Behälter B ist ${n2}/${denom} voll. Wie voll ist der Haupttank?`,
          dynamicOptions: opts,
          correctAnswer: correctAns,
          dynamicHint: 'Wenn die Art der Stücke (der Nenner) gleich ist, musst du sie nicht verändern. Du musst nur zusammenzählen, wie viele Stücke es insgesamt sind.'
       };
    }
  },
  // --- 19. ARITHMETIK: RUNDEN ---
  {
    id: 19,
    type: 'digital',
    category: 'Arithmetik (4./5. Klasse)',
    title: 'Blitz-Mission: Galaxie-Kartograph',
    briefing: {
      title: 'Die Kunst des Rundens',
      content: 'Sollst du auf Millionen runden, schaust du dir die Stelle rechts daneben an (Hunderttausender). Bei 0-4 wird ABGERUNDET. Bei 5-9 wird AUFGERUNDET.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="140" fill="#818cf8" fontSize="24" fontWeight="bold" textAnchor="middle">2.<tspan fill="#34d399">7</tspan>30.000 → 3.000.000</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 100,
    generateInstance: () => {
       const millions = rand(10, 90), rest = rand(100000, 999999), num = millions * 1000000 + rest;
       const rounded = Math.round(num / 1000000) * 1000000;
       const objects = ['Ein fremder Planet', 'Ein riesiger Komet', 'Ein schwarzes Loch'];
       const obj = objects[rand(0, 2)];
       return {
          dynamicStory: 'Wir müssen riesige Entfernungen auf volle Millionen runden!',
          dynamicQuestion: `${obj} ist ${num.toLocaleString('de-DE')} Kilometer entfernt. Runde auf VOLLE Millionen!`,
          correctAnswer: rounded.toString(),
          dynamicHint: 'Die entscheidende Stelle ist nicht die Million selbst, sondern ihr rechter Nachbar! Wann darf die Million gleich bleiben, wann muss sie wachsen?'
       };
    }
  },
  // --- 20. GRÖSSEN: GEWICHTE ---
  {
    id: 20,
    type: 'knobel',
    category: 'Größen & Messen',
    title: 'Knobel-Tresor: Fracht-Kontrolle',
    briefing: {
      title: 'Gewichte ineinander umwandeln',
      content: 'Merke dir diese magischen Zahlen: 1000 Gramm (g) = 1 Kilogramm (kg). 1000 Kilogramm (kg) = 1 Tonne (t). Wandle immer zuerst ALLES in die kleinste vorkommende Einheit um!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <rect x="80" y="60" width="80" height="60" fill="#818cf8" rx="5"/>
          <text x="120" y="95" fill="#1e293b" fontSize="20" fontWeight="bold" textAnchor="middle">1 t</text>
          <text x="200" y="95" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle">=</text>
          <rect x="240" y="60" width="80" height="60" fill="#34d399" rx="5"/>
          <text x="280" y="95" fill="#1e293b" fontSize="18" fontWeight="bold" textAnchor="middle">1000 kg</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const limitT = rand(4, 9), w1T = rand(1, limitT - 2), w1KG = rand(100, 900), w2KG = rand(800, 1500);
       const loaded = (w1T * 1000) + w1KG + w2KG, limitKG = limitT * 1000;
       const loads = ['seltene Mineralien', 'wertvolle Schrott-Teile', 'Energie-Kristalle'];
       const load = loads[rand(0, 2)];
       return {
          dynamicStory: `Wir verladen ${load}. Der Bordcomputer zeigt einen Warnhinweis wegen Überladung. Wir müssen schnell umrechnen!`,
          dynamicQuestion: `LKW-Limit: ${limitT}t. Geladen: ${w1T}t ${w1KG}kg UND eine Kiste mit ${w2KG}kg. Wie viele KILOGRAMM dürfen noch zugeladen werden?`,
          correctAnswer: (limitKG - loaded).toString(),
          dynamicHint: 'Bevor du verschiedene Gewichte zusammenrechnest, musst du alle in dieselbe, kleinere Sprache übersetzen.'
       };
    }
  },
  // --- 21. SACHAUFGABE: KÖPFE UND BEINE ---
  {
    id: 21,
    type: 'analog',
    category: 'Sachaufgaben / Logik',
    title: 'Geheimakte: Chaos im Alien-Zoo',
    briefing: {
      title: 'Das Köpfe-und-Beine Problem',
      content: 'Solche Rätsel löst du am besten durch Probieren mit einer Tabelle! Wenn alle Tiere nur 2 Beine hätten, wie viele Beine gäbe es dann insgesamt? Der Rest der Beine muss zu den Tieren gehören, die 4 Beine haben!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <circle cx="100" cy="60" r="30" fill="#34d399" />
          <path d="M 90 90 L 80 130 M 110 90 L 120 130" stroke="#34d399" strokeWidth="6" strokeLinecap="round"/>
          <text x="100" y="150" fill="#cbd5e1" fontSize="16" textAnchor="middle">Zorg (2 Beine)</text>
          <circle cx="300" cy="60" r="30" fill="#f472b6" />
          <path d="M 280 85 L 260 130 M 290 88 L 285 130 M 310 88 L 315 130 M 320 85 L 340 130" stroke="#f472b6" strokeWidth="6" strokeLinecap="round"/>
          <text x="300" y="150" fill="#cbd5e1" fontSize="16" textAnchor="middle">Blorp (4 Beine)</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 250,
    generateInstance: () => {
       const totalHeads = rand(5, 12), zorgs = rand(1, totalHeads - 1), blorps = totalHeads - zorgs;
       const totalLegs = (zorgs * 2) + (blorps * 4);
       const creatures = [
         { a: 'Zorgs', b: 'Blorps' },
         { a: 'Flieglinge', b: 'Krabbler' },
         { a: 'Mond-Hühner', b: 'Mars-Kühe' }
       ];
       const c = creatures[rand(0, 2)];
       return {
          dynamicStory: `Im galaktischen Zoo ist das Gehege der ${c.a} (2 Beine) und ${c.b} (4 Beine) kaputtgegangen!`,
          dynamicInstructions: [
            `Der Wärter zählt genau ${totalHeads} Köpfe.`,
            `Dann zählt er die Beine: Es sind genau ${totalLegs} Beine insgesamt.`,
            'Tipp: Erstelle in deinem Heft eine Tabelle.'
          ],
          dynamicQuestion: `Wie viele ${c.b} (die mit 4 Beinen) sind im Gehege?`,
          correctAnswer: blorps.toString(),
          dynamicHint: 'Nimm an, alle Tiere im Zoo hätten nur 2 Beine. Wie viele Beine würdest du dann zählen? Woher kommen die restlichen Beine in der Aufgabe?'
       };
    }
  },
  // --- 22. SACHAUFGABE: ZUFLUSS / ABFLUSS ---
  {
    id: 22,
    type: 'analog',
    category: 'Sachaufgaben / Größen',
    title: 'Geheimakte: Leck im Wassertank',
    briefing: {
      title: 'Zufluss und Abfluss berechnen',
      content: 'Wenn gleichzeitig Wasser in einen Tank fließt UND Wasser durch ein Leck verschwindet, musst du den "Netto-Zufluss" berechnen: Zufluss minus Abfluss.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <rect x="150" y="40" width="100" height="100" fill="none" stroke="#475569" strokeWidth="4"/>
          <path d="M 120 20 L 170 20 L 170 40" stroke="#34d399" strokeWidth="8" fill="none"/>
          <text x="120" y="15" fill="#34d399" fontSize="14" fontWeight="bold">+ Zufluss</text>
          <path d="M 250 120 L 290 120 L 290 140" stroke="#ef4444" strokeWidth="6" fill="none"/>
          <text x="295" y="115" fill="#ef4444" fontSize="14" fontWeight="bold">- Abfluss</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 200,
    generateInstance: () => {
       const inFlow = rand(15, 30), outFlow = rand(3, 10), netFlow = inFlow - outFlow;
       const minutes = rand(15, 50), volume = netFlow * minutes;
       const liquids = ['Wasser', 'Kühlmittel', 'flüssiges Helium'];
       const liquid = liquids[rand(0, 2)];
       return {
          dynamicStory: `Der Kühltank fasst ${volume} Liter. Ein Schlauch pumpt jede Minute ${inFlow} Liter ${liquid} hinein. Leider fließen durch ein Leck pro Minute ${outFlow} Liter heraus!`,
          dynamicInstructions: [
            'Berechne den Netto-Zufluss pro Minute.',
            'Teile das Gesamtvolumen durch diesen Netto-Zufluss.'
          ],
          dynamicQuestion: 'Wie viele Minuten dauert es, bis der Tank komplett gefüllt ist?',
          correctAnswer: minutes.toString(),
          dynamicHint: 'Beobachte den Tank für eine einzige Minute. Wie viel Flüssigkeit sammelt sich wirklich an, wenn man das Loch einberechnet?'
       };
    }
  },
  // --- 23. BRÜCHE: RABATT ---
  {
    id: 23,
    type: 'digital',
    category: 'Sachaufgaben / Brüche',
    title: 'Blitz-Mission: Schwarzmarkt-Rabatt',
    briefing: {
      title: 'Anteile von Geldbeträgen berechnen',
      content: 'Wenn du einen Rabatt von 1/4 bekommst: Teile den Gesamtpreis durch 4 (das ist der Rabatt) und ziehe diesen Teil dann vom Originalpreis ab.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="75" fill="#94a3b8" fontSize="24" textAnchor="middle" textDecoration="line-through">120 Credits</text>
          <text x="200" y="105" fill="#34d399" fontSize="20" fontWeight="bold" textAnchor="middle">- 1/4 Rabatt</text>
          <text x="350" y="125" fill="#f472b6" fontSize="20" fontWeight="bold" textAnchor="middle">= 90</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 120,
    generateInstance: () => {
       const divisor = rand(3, 6), basePrice = rand(5, 20) * 10 * divisor;
       const discount = basePrice / divisor, finalPrice = basePrice - discount;
       const items = ['Schildgenerator', 'Warp-Antrieb', 'Tarnkappen-Modul'];
       const item = items[rand(0, 2)];
       return {
          dynamicStory: `Ein Alien-Händler verkauft dir einen ${item} für ${basePrice} Credits. Er erlässt dir 1/${divisor} des Preises als Rabatt.`,
          dynamicQuestion: 'Wie viele Credits musst du jetzt noch bezahlen?',
          correctAnswer: finalPrice.toString(),
          dynamicHint: 'Berechne zuerst den Wert des Rabatts. Was musst du dann mit diesem gesparten Wert und dem Startpreis machen?'
       };
    }
  },
  // --- 24. LOGIK: ALTERSRÄTSEL ---
  {
    id: 24,
    type: 'knobel',
    category: 'Sachaufgaben / Logik',
    title: 'Knobel-Tresor: Das Rätsel der Weisen',
    briefing: {
      title: 'Das Geheimnis der Altersrätsel',
      content: 'Solche Rätsel löst man mit "Teilen". Wenn Meister Yoda dreimal so alt ist wie sein Schüler, besteht ihr gemeinsames Alter aus 4 "Teilen" (1 Teil Schüler + 3 Teile Yoda).',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <rect x="50" y="50" width="60" height="40" fill="#34d399" rx="5"/>
          <text x="80" y="75" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">Schüler</text>
          <text x="130" y="75" fill="#cbd5e1" fontSize="24" fontWeight="bold" textAnchor="middle">+</text>
          <rect x="150" y="50" width="180" height="40" fill="#f472b6" rx="5"/>
          <text x="240" y="75" fill="#1e293b" fontSize="14" fontWeight="bold" textAnchor="middle">Meister (3x Schüler)</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const studentAge = rand(10, 25), factor = rand(3, 5), sumAge = studentAge + (studentAge * factor);
       const pairs = [
         { m: 'Meister', s: 'Kadett' },
         { m: 'König', s: 'Prinz' },
         { m: 'Commander', s: 'Fähnrich' }
       ];
       const p = pairs[rand(0, 2)];
       return {
          dynamicStory: `Der weise Alien-${p.m} ist exakt ${factor} mal so alt wie sein junger ${p.s}. Zusammen sind sie exakt ${sumAge} Jahre alt.`,
          dynamicQuestion: `Wie alt ist der weise Alien-${p.m}?`,
          correctAnswer: (studentAge * factor).toString(),
          dynamicHint: `Stell dir das Alter der beiden als Bausteine vor. Wenn der Jüngere ein Baustein ist, wie viele ist der Ältere? Und wie viele alle zusammen? (Achtung: Gib am Ende das Alter des ${p.m} ein!)`
       };
    }
  },
  // --- 25. SACHAUFGABE: GESCHWINDIGKEIT ---
  {
    id: 25,
    type: 'analog',
    category: 'Sachaufgaben / Geschw.',
    title: 'Geheimakte: Wettrennen zum Saturn',
    briefing: {
      title: 'Geschwindigkeit vergleichen',
      content: 'Weg = Geschwindigkeit mal Zeit. Wenn ein Schiff 3 Stunden lang mit 200 km/h fliegt, rechnest du einfach 3 × 200 = 600 km Gesamtstrecke.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="50" y="50" fill="#cbd5e1" fontSize="24">🛸 A</text>
          <path d="M 90 42 L 250 42" stroke="#34d399" strokeWidth="4" strokeDasharray="10 5"/>
          <text x="50" y="100" fill="#cbd5e1" fontSize="24">🚀 B</text>
          <path d="M 90 92 L 320 92" stroke="#f472b6" strokeWidth="4" strokeDasharray="10 5"/>
        </svg>
      )
    },
    inputType: 'number',
    points: 200,
    generateInstance: () => {
       const h1 = rand(4, 8), v1 = rand(3, 6) * 1000, h2 = rand(2, 5), v2 = rand(7, 12) * 1000;
       const dist1 = h1 * v1, dist2 = h2 * v2, diff = Math.abs(dist1 - dist2);
       const racers = [
         { a: 'Alpha', b: 'Omega' },
         { a: 'Nova', b: 'Pulsar' },
         { a: 'Komet', b: 'Meteor' }
       ];
       const r = racers[rand(0, 2)];
       return {
          dynamicStory: `Schiff ${r.a} fliegt ${h1} Stunden lang mit ${v1.toLocaleString('de-DE')} km/h. Schiff ${r.b} startet später und fliegt nur ${h2} Stunden, aber mit ${v2.toLocaleString('de-DE')} km/h!`,
          dynamicInstructions: [
            `Berechne die Gesamtstrecke von Schiff ${r.a}.`,
            `Berechne die Gesamtstrecke von Schiff ${r.b}.`,
            'Berechne den Unterschied der beiden Strecken.'
          ],
          dynamicQuestion: 'Wie viele Kilometer ist das Sieger-Schiff weiter geflogen?',
          correctAnswer: diff.toString(),
          dynamicHint: 'Finde für jedes Schiff einzeln heraus, wie weit es gereist ist. Erst am Schluss vergleichst du die beiden Ergebnisse.'
       };
    }
  },
  // --- 26. KOMBINATORIK: HÄNDESCHÜTTELN ---
  {
    id: 26,
    type: 'knobel',
    category: 'Kombinatorik (5. Klasse)',
    title: 'Knobel-Tresor: Galaktischer Rat',
    briefing: {
      title: 'Das Händeschüttel-Problem',
      content: 'Wenn sich 4 Aliens treffen und jeder jedem einmal die Hand schüttelt, zeichnest du am besten ein Viereck und verbindest ALLE Ecken miteinander. Zähle dann alle Linien.',
      visual: (
        <svg viewBox="0 0 200 200" className="w-full h-auto max-h-64">
          <circle cx="50" cy="50" r="10" fill="#818cf8"/>
          <circle cx="150" cy="50" r="10" fill="#818cf8"/>
          <circle cx="50" cy="150" r="10" fill="#818cf8"/>
          <circle cx="150" cy="150" r="10" fill="#818cf8"/>
          <path d="M 50 50 L 150 50 M 50 50 L 50 150 M 150 50 L 150 150 M 50 150 L 150 150" stroke="#f472b6" strokeWidth="2"/>
          <path d="M 50 50 L 150 150 M 150 50 L 50 150" stroke="#34d399" strokeWidth="2"/>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const n = rand(5, 8), handshakes = (n * (n - 1)) / 2;
       const groups = ['intergalaktische Botschafter', 'Schmuggler-Bosse', 'Sternenflotten-Kapitäne'];
       const group = groups[rand(0, 2)];
       return {
          dynamicStory: `Genau ${n} ${group} treffen sich. Um Frieden zu zeigen, schüttelt JEDER jedem anderen genau EINMAL die Hand.`,
          dynamicQuestion: 'Wie viele Händedrücke gibt es insgesamt?',
          correctAnswer: handshakes.toString(),
          dynamicHint: 'Wenn Person A allen anderen die Hand gegeben hat, ist sie fertig. Wie vielen Personen muss Person B danach noch die Hand geben?'
       };
    }
  },
  // --- 27. GRÖSSEN: MASSSTAB ---
  {
    id: 27,
    type: 'analog',
    category: 'Größen & Messen',
    title: 'Geheimakte: Die Sternenkarte',
    briefing: {
      title: 'Mit Maßstäben rechnen',
      content: 'Ein Maßstab von 1:50.000 bedeutet, dass 1 Zentimeter (cm) auf der Karte in Wirklichkeit 50.000 cm sind. Um das in Kilometer umzuwandeln, musst du Nullen streichen!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <rect x="50" y="50" width="300" height="50" fill="#1e293b" stroke="#818cf8" strokeWidth="2"/>
          <text x="200" y="80" fill="#cbd5e1" fontSize="20" textAnchor="middle">1 cm Karte = 50.000 cm Echt</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 200,
    generateInstance: () => {
       const scaleKm = rand(1, 5); // Garantiert, dass 1 cm auf der Karte glatten Kilometern entspricht
       const scale = scaleKm * 100000;
       const mapDist = rand(12, 45);
       const realKm = mapDist * scaleKm; // Verhindert schiefe Kommazahlen im Endergebnis
       const maps = ['alte Sternenkarte', 'Piraten-Schatzkarte', 'taktische Holo-Karte'];
       const map = maps[rand(0, 2)];
       return {
          dynamicStory: `Die ${map} hat einen Maßstab von 1:${scale.toLocaleString('de-DE')}. Du misst mit dem Lineal eine Strecke von ${mapDist} cm zwischen zwei Objekten.`,
          dynamicInstructions: [
            `Rechne die Karten-Zentimeter mal ${scale.toLocaleString('de-DE')}, um die echten Zentimeter zu bekommen.`,
            'Wandle die Zentimeter in Meter um (zwei Nullen wegstreichen).',
            'Wandle die Meter in Kilometer um (drei Nullen wegstreichen).'
          ],
          dynamicQuestion: 'Wie viele KILOMETER sind die Objekte in Wirklichkeit entfernt?',
          correctAnswer: realKm.toString(),
          dynamicHint: 'Löse das in Schritten: Berechne erst die echten Zentimeter. Wie macht man dann aus Zentimetern Meter, und aus Metern Kilometer?'
       };
    }
  },
  // --- 28. DATEN: DURCHSCHNITT ---
  {
    id: 28,
    type: 'digital',
    category: 'Daten & Häufigkeit',
    title: 'Blitz-Mission: Asteroiden-Schauer',
    briefing: {
      title: 'Durchschnitt berechnen',
      content: 'Um den Durchschnitt (Mittelwert) zu berechnen, addierst du zuerst alle Werte zusammen. Danach teilst du dieses Ergebnis durch die Anzahl der Werte.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="50" fill="#cbd5e1" fontSize="20" textAnchor="middle">Montag: 4, Dienstag: 8, Mittwoch: 6</text>
          <text x="200" y="90" fill="#34d399" fontSize="20" textAnchor="middle">Summe: 4 + 8 + 6 = 18</text>
          <text x="200" y="130" fill="#f472b6" fontSize="20" fontWeight="bold" textAnchor="middle">Durchschnitt: 18 ÷ 3 Tage = 6</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 100,
    generateInstance: () => {
       const avg = rand(15, 40);
       const d1 = avg - rand(2, 8);
       const d2 = avg + rand(1, 5);
       const d3 = (avg * 3) - d1 - d2; // d3 bleibt durch diese Parameterwahl immer logisch positiv
       const events = ['Meteoriten-Einschläge', 'Alien-Sichtungen', 'Sonnenstürme'];
       const event = events[rand(0, 2)];
       return {
          dynamicStory: `Vorfälle von "${event}" auf der Station: Am Montag waren es ${d1}, am Dienstag ${d2} und am Mittwoch ${d3}.`,
          dynamicQuestion: `Wie hoch war der DURCHSCHNITT der Vorfälle pro Tag?`,
          correctAnswer: avg.toString(),
          dynamicHint: 'Wirf zuerst alle Werte auf einen großen Haufen (addieren). Wie teilst du diesen Haufen dann wieder absolut gerecht auf alle Tage auf?'
       };
    }
  },
  // --- 29. ARITHMETIK: KGV ---
  {
    id: 29,
    type: 'analog',
    category: 'Arithmetik (5. Klasse)',
    title: 'Geheimakte: Planeten-Konstellation',
    briefing: {
      title: 'Das kleinste gemeinsame Vielfache',
      content: 'Wann treffen sich zwei Dinge wieder, die in unterschiedlichen Rhythmen passieren? Schreibe die 1er-Reihen (Vielfache) beider Zahlen auf, bis du die ERSTE Zahl findest, die in beiden Reihen vorkommt!',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="50" fill="#cbd5e1" fontSize="18" textAnchor="middle">3er Reihe: 3, 6, 9, 12, 15...</text>
          <text x="200" y="90" fill="#cbd5e1" fontSize="18" textAnchor="middle">4er Reihe: 4, 8, 12, 16...</text>
          <text x="200" y="130" fill="#34d399" fontSize="20" fontWeight="bold" textAnchor="middle">Erster Treffer = 12</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 250,
    generateInstance: () => {
       const p1 = rand(4, 8);
       const p2 = rand(9, 15);
       const meet = lcm(p1, p2);
       const orbits = ['Planeten', 'Kometen', 'Forschungssatelliten'];
       const orbit = orbits[rand(0, 2)];
       return {
          dynamicStory: `Zwei ${orbit} umkreisen die Sonne. Typ Alpha braucht ${p1} Jahre. Typ Beta braucht ${p2} Jahre. Heute stehen beide in einer perfekten Linie.`,
          dynamicInstructions: [
            `Schreibe die ${p1}er Reihe in dein Heft auf.`,
            `Schreibe die ${p2}er Reihe direkt darunter auf.`,
            'Suche die kleinste Zahl, die in BEIDEN Reihen auftaucht.'
          ],
          dynamicQuestion: 'In wie vielen Jahren stehen beide Objekte wieder in einer Linie?',
          correctAnswer: meet.toString(),
          dynamicHint: 'Stell dir zwei verschiedene Zahlenreihen vor. Wann triffst du zum allerersten Mal auf eine Zahl, die in beiden Reihen vorkommt?'
       };
    }
  },
  // --- 30. LOGIK: KRYPTOGRAMM ---
  {
    id: 30,
    type: 'knobel',
    category: 'Logik (5. Klasse)',
    title: 'Knobel-Tresor: Alien-Kryptogramm',
    briefing: {
      title: 'Kryptogramme knacken',
      content: 'In einem Kryptogramm steht jeder Buchstabe für genau eine Ziffer (0-9). Gleiche Buchstaben bedeuten immer dieselbe Ziffer! Oft sind einige Ziffern schon entschlüsselt, um dir zu helfen.',
      visual: (
        <svg viewBox="0 0 400 150" className="w-full h-auto max-h-48">
          <text x="200" y="60" fill="#cbd5e1" fontSize="32" fontWeight="bold" textAnchor="middle" letterSpacing="5">A × A = 1 C</text>
          <text x="200" y="110" fill="#94a3b8" fontSize="16" textAnchor="middle">4 × 4 = 16. Also MUSS A = 4 sein und C = 6.</text>
        </svg>
      )
    },
    inputType: 'number',
    points: 150,
    generateInstance: () => {
       const puzzleTypes = [
         {
            logic: () => {
               const choices = [
                 {a: 4, res: 16}, {a: 5, res: 25}, {a: 6, res: 36},
                 {a: 7, res: 49}, {a: 8, res: 64}, {a: 9, res: 81}
               ];
               const pick = choices[rand(0, choices.length - 1)];
               const b = Math.floor(pick.res / 10);
               return {
                  eq: `A × A = ${b} C`,
                  ans: pick.a,
                  hint: `Welche Zahl aus dem Einmaleins ergibt mit sich selbst malgenommen eine zweistellige Zahl, die mit einer ${b} beginnt?`
               };
            }
         },
         {
            logic: () => {
               const choices = [
                 {a: 4, res: 12}, {a: 5, res: 15}, {a: 6, res: 18},
                 {a: 7, res: 21}, {a: 8, res: 24}, {a: 9, res: 27}
               ];
               const pick = choices[rand(0, choices.length - 1)];
               const c = pick.res % 10;
               return {
                  eq: `A + A + A = B ${c}`,
                  ans: pick.a,
                  hint: `Wenn du eine Ziffer dreimal addierst (also mal 3 rechnest), soll als letzte Ziffer eine ${c} herauskommen. Gehe die 3er-Reihe durch!`
               };
            }
         }
       ];
       
       const puzzle = puzzleTypes[rand(0, puzzleTypes.length - 1)].logic();
       const situations = [
         'Ein uraltes Artefakt leuchtet auf. Es verlangt einen Logik-Beweis:',
         'Die Laser-Gitter der Schatzkammer flackern. Das Terminal zeigt:',
         'Der Hyperantrieb verlangt eine manuelle Override-Sequenz:',
         'Das Alien-Schiff funkt eine verschlüsselte Identifikationsabfrage:',
         'Die Tresortür der Sternenbank erfordert einen Sicherheitscode:'
       ];
       const sit = situations[rand(0, situations.length - 1)];
       
       return {
          dynamicStory: `${sit} ${puzzle.eq}`,
          dynamicQuestion: `Welche Ziffer verbirgt sich hinter dem Buchstaben "A"?`,
          correctAnswer: puzzle.ans.toString(),
          dynamicHint: puzzle.hint
       };
    }
  }
];

// ==========================================
// IMPRESSUM & DATENSCHUTZ
// ==========================================
// Der gesamte Rechtstext steht in dieser einen Komponente (gleicher Text wie in den Schwester-Apps).
// Erreichbar ohne Passwort über die Fußzeile im Menü.
// section = 'datenschutz' springt beim Öffnen direkt zum Abschnitt „Datenschutz“.
const IMPRESSUM_EMAIL = 'p.brandsch@ggs-roesrath.de';
const GITHUB_PRIVACY_URL = 'https://docs.github.com/de/site-policy/privacy-policies/github-general-privacy-statement';

function ImpressumModal({ onClose, section }) {
  const datenschutzRef = useRef(null);
  useEffect(() => {
    if (section === 'datenschutz' && datenschutzRef.current) datenschutzRef.current.scrollIntoView({ block: 'start' });
  }, [section]);

  const Mail = () => <a href={`mailto:${IMPRESSUM_EMAIL}`} className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200 break-all">{IMPRESSUM_EMAIL}</a>;
  const H2 = ({ children, innerRef }) => <h4 ref={innerRef} className="text-xl font-bold text-yellow-200 mt-6 mb-2 scroll-mt-2">{children}</h4>;
  const H3 = ({ children }) => <h5 className="font-bold text-slate-100 mt-4 mb-1">{children}</h5>;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-[250] flex items-center justify-center p-4">
      <div className="bg-slate-900 border-4 border-slate-500 rounded-3xl max-w-2xl w-full shadow-[0_0_40px_rgba(148,163,184,0.25)] relative flex flex-col max-h-[85vh]">
        <div className="flex justify-between items-start gap-4 p-5 md:p-6 pb-3 border-b-2 border-slate-800">
          <div className="text-left">
            <h3 className="text-2xl md:text-3xl font-bold text-white">Impressum &amp; Datenschutz</h3>
            <p className="text-slate-400 italic">Infos für Erwachsene</p>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-full p-2 transition-colors flex-shrink-0">✕</button>
        </div>

        <div className="overflow-y-auto px-5 md:px-6 pb-6 text-left text-slate-300 leading-relaxed">
          <H2>Impressum</H2>
          <p>Angaben gemäß § 18 Abs. 1 Medienstaatsvertrag (MStV)</p>
          <p className="mt-3">Peter Brandsch<br />Sandweg 13<br />51503 Rösrath</p>
          <p className="mt-3">E-Mail: <Mail /></p>
          <p className="mt-3">Agent M – Math Mission ist ein kostenloses Lernangebot ohne Werbung.</p>

          <H3>Haftung für Inhalte</H3>
          <p>Die Inhalte dieser App wurden mit großer Sorgfalt erstellt. Für die Richtigkeit, Vollständigkeit und Aktualität der Inhalte kann ich jedoch keine Gewähr übernehmen. Hinweise auf Fehler nehme ich gern per E-Mail entgegen.</p>

          <H3>Urheberrecht und Lizenzen</H3>
          <p>
            Texte, Aufgaben, Figuren und Gestaltung der App: © 2026 Peter Brandsch.<br />
            Verwendete Bausteine anderer Urheber:<br />
            – Symbole: Lucide (ISC-Lizenz)<br />
            – React (MIT-Lizenz), Tailwind CSS (MIT-Lizenz)
          </p>

          <H2 innerRef={datenschutzRef}>Datenschutz</H2>

          <H3>1. Verantwortlich</H3>
          <p>Peter Brandsch, Sandweg 13, 51503 Rösrath, E-Mail: <Mail /></p>

          <H3>2. Das Wichtigste in Kürze</H3>
          <p>Die App funktioniert ohne Anmeldung und ohne Namen. Sie setzt keine Cookies, speichert nichts im Browser und verwendet keine Analyse-, Werbe- oder Trackingdienste. Der Spielstand besteht nur, solange die Seite geöffnet ist. Der Spielstand-Code wird ausschließlich auf dem Gerät angezeigt und eingegeben. Er wird nicht an mich oder an Dritte übertragen. Schriften und Gestaltungsdateien werden direkt mit der App ausgeliefert, es werden keine Verbindungen zu Google oder anderen Drittanbietern aufgebaut.</p>

          <H3>3. Bereitstellung über GitHub Pages</H3>
          <p>Die App wird über GitHub Pages bereitgestellt, einen Dienst der GitHub Inc., 88 Colin P. Kelly Jr. Street, San Francisco, CA 94107, USA. Beim Aufruf der App verarbeitet GitHub technisch notwendige Daten, insbesondere die IP-Adresse, Datum und Uhrzeit des Abrufs sowie Angaben zum verwendeten Browser. Dies ist erforderlich, um die Seite auszuliefern und ihre Sicherheit zu gewährleisten. Dabei können Daten in die USA übermittelt werden. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f DSGVO. Mein berechtigtes Interesse liegt in einer sicheren und zuverlässigen Bereitstellung der App. Ich selbst erhalte keine Zugriffsdaten und werte keine aus. Weitere Informationen: Datenschutzerklärung von GitHub (<a href={GITHUB_PRIVACY_URL} target="_blank" rel="noopener noreferrer" className="text-cyan-300 underline underline-offset-2 hover:text-cyan-200 break-all">{GITHUB_PRIVACY_URL}</a>).</p>

          <H3>4. Deine Rechte</H3>
          <p>Du hast das Recht auf Auskunft (Art. 15 DSGVO), Berichtigung (Art. 16), Löschung (Art. 17), Einschränkung der Verarbeitung (Art. 18) und Widerspruch (Art. 21). Wende dich dazu an die oben genannte E-Mail-Adresse. Außerdem kannst du dich bei einer Datenschutz-Aufsichtsbehörde beschweren, in Nordrhein-Westfalen bei der Landesbeauftragten für Datenschutz und Informationsfreiheit NRW (LDI NRW).</p>

          <p className="mt-6 text-slate-400">Stand: September 2026</p>
        </div>
      </div>
    </div>
  );
}

export default function MathMissionApp() {
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [activeTask, setActiveTask] = useState(null);
  const [taskInstance, setTaskInstance] = useState(null);
  const [taskLevel, setTaskLevel] = useState(1);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState(null);
  const [showHint, setShowHint] = useState(false);
  const [isBriefingOpen, setIsBriefingOpen] = useState(true);
  const [filterType, setFilterType] = useState('all');
  
  // Save System State
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showHelpModal, setShowHelpModal] = useState(false);
  const [impressum, setImpressum] = useState(null); // null | 'impressum' | 'datenschutz'
  const [inputCode, setInputCode] = useState('');
  const [saveMessage, setSaveMessage] = useState({ text: '', type: '' });

  const generateSaveCode = () => {
    const checksum = ((score + streak) * 7) % 99;
    return `A${score}B${streak}C${checksum}`;
  };

  const loadSaveCode = () => {
    const regex = /^A(\d+)B(\d+)C(\d+)$/i;
    const match = inputCode.toUpperCase().trim().match(regex);
    if (match) {
      const parsedScore = parseInt(match[1]), parsedStreak = parseInt(match[2]), parsedChecksum = parseInt(match[3]);
      if (((parsedScore + parsedStreak) * 7) % 99 === parsedChecksum) {
        setScore(parsedScore); setStreak(parsedStreak);
        setSaveMessage({ text: 'Code akzeptiert! Profil geladen.', type: 'success' });
        setTimeout(() => { setShowSaveModal(false); setSaveMessage({ text: '', type: '' }); setInputCode(''); }, 2000);
      } else setSaveMessage({ text: 'Code fehlerhaft oder manipuliert.', type: 'error' });
    } else setSaveMessage({ text: 'Ungültiges Code-Format.', type: 'error' });
  };

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = generateSaveCode();
    textArea.style.top = "0"; textArea.style.left = "0"; textArea.style.position = "fixed";
    document.body.appendChild(textArea);
    textArea.focus(); textArea.select();
    try {
      document.execCommand('copy');
      setSaveMessage({ text: 'Code kopiert!', type: 'success' });
    } catch (err) {
      setSaveMessage({ text: 'Fehler: Bitte Code manuell markieren und kopieren', type: 'error' });
    }
    document.body.removeChild(textArea);
    setTimeout(() => setSaveMessage({ text: '', type: '' }), 3000);
  };

  const handleStartTask = (task) => {
    setActiveTask(task);
    setTaskInstance(task.generateInstance());
    setTaskLevel(1); setUserAnswer(''); setFeedback(null); setShowHint(false); setIsBriefingOpen(true);
    setCurrentScreen('task');
  };

  const handleNextInstance = () => {
    setTaskInstance(activeTask.generateInstance());
    setTaskLevel(prev => prev + 1);
    setUserAnswer(''); setFeedback(null); setShowHint(false); setIsBriefingOpen(false); 
  };

  const handleCheckAnswer = () => {
    if (!userAnswer) return;
    const correctAns = taskInstance?.correctAnswer || activeTask.correctAnswer;
    const inputType = taskInstance?.dynamicInputType || activeTask?.inputType;

    let isCorrect = false;

    // Flexibler Scanner: Ignoriert Leerzeichen und Tausender-Punkte, toleriert Kommas und Alternativen (z.B. "24" vs "0")
    const checkNumeric = (userStr, correctStr) => {
      const u = userStr.toString().replace(/[\s\.]/g, '').replace(',', '.');
      const c = correctStr.toString().replace(/[\s\.]/g, '').replace(',', '.');
      
      if (!isNaN(parseFloat(u)) && !isNaN(parseFloat(c))) {
        return parseFloat(u) === parseFloat(c);
      }
      return u.toLowerCase() === c.toLowerCase();
    };

    if (inputType === 'choice') {
      isCorrect = userAnswer === correctAns; 
    } else {
      if (Array.isArray(correctAns)) {
        isCorrect = correctAns.some(ans => checkNumeric(userAnswer, ans));
      } else {
        isCorrect = checkNumeric(userAnswer, correctAns);
      }
    }

    if (isCorrect) {
      setFeedback('correct'); setScore(score + activeTask.points); setStreak(streak + 1);
    } else setFeedback('wrong');
  };

  const handleBackToDash = () => { setCurrentScreen('dashboard'); setActiveTask(null); setTaskInstance(null); };

  const filteredTasks = TASKS.filter(task => filterType === 'all' || task.type === filterType);

  const taskTitle = taskInstance?.dynamicTitle || activeTask?.title;
  const taskStory = taskInstance?.dynamicStory || activeTask?.story;
  const taskInstructions = taskInstance?.dynamicInstructions || activeTask?.instructions;
  const taskQuestion = taskInstance?.dynamicQuestion || activeTask?.question;
  const taskHint = taskInstance?.dynamicHint || activeTask?.hint;
  const taskOptions = taskInstance?.dynamicOptions || activeTask?.options;
  const taskInputType = taskInstance?.dynamicInputType || activeTask?.inputType;

  const Header = () => (
    <div className="bg-slate-800 p-3 md:p-6 flex justify-between items-center border-b border-slate-700 shadow-lg relative z-20">
      <div className="flex items-center space-x-2 md:space-x-3 cursor-pointer group" onClick={handleBackToDash}>
        <div className="bg-indigo-600 p-2 md:p-3 rounded-xl shadow-lg shadow-indigo-500/30 group-hover:scale-105 transition-transform">
          <Shield className="text-white w-6 h-6 md:w-8 md:h-8" />
        </div>
        <div>
          <h1 className="text-white font-bold text-lg md:text-2xl tracking-wide group-hover:text-indigo-300 transition-colors">AGENT M.</h1>
          <p className="text-indigo-300 text-[10px] md:text-sm font-medium hidden sm:block">Logik-Division NRW</p>
        </div>
      </div>
      <div className="flex items-center space-x-1.5 md:space-x-3">
        {/* Handbuch Button */}
        <button onClick={() => setShowHelpModal(true)} className="bg-slate-700 hover:bg-slate-600 px-2 py-1.5 md:px-3 md:py-2 rounded-xl border border-slate-600 transition-colors active:scale-95 flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]" title="Handbuch & Anleitung">
          <Book className="text-slate-300 w-4 h-4 md:w-6 md:h-6 mb-1" />
          <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Handbuch</span>
        </button>

        {/* Tresor Button */}
        <button onClick={() => setShowSaveModal(true)} className="bg-slate-700 hover:bg-slate-600 px-2 py-1.5 md:px-3 md:py-2 rounded-xl border border-slate-600 transition-colors active:scale-95 flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]" title="Spielstand speichern / laden">
          <Key className="text-slate-300 w-4 h-4 md:w-6 md:h-6 mb-1" />
          <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Tresor</span>
        </button>

        {/* Serie (Streak) Anzeige */}
        <div className="bg-slate-700 px-2 py-1.5 md:px-3 md:py-2 rounded-xl border border-slate-600 flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]" title="Gelöste Aufgaben in Folge">
          <div className="flex items-center space-x-1 mb-1">
            <Zap className="text-amber-400 w-4 h-4 md:w-5 md:h-5" />
            <span className="text-white font-bold text-sm md:text-lg leading-none">{streak}</span>
          </div>
          <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">Serie</span>
        </div>

        {/* IQ Punkte Anzeige */}
        <div className="bg-slate-700 px-2 py-1.5 md:px-3 md:py-2 rounded-xl border border-slate-600 flex flex-col items-center justify-center min-w-[60px] md:min-w-[80px]" title="Gesammelte IQ Punkte">
          <div className="flex items-center space-x-1 mb-1">
            <Star className="text-cyan-400 w-4 h-4 md:w-5 md:h-5" />
            <span className="text-white font-bold text-sm md:text-lg leading-none">{score}</span>
          </div>
          <span className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-wider">IQ-Punkte</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-900 font-sans text-slate-100 flex flex-col selection:bg-indigo-500 selection:text-white">
      <Header />

      <main className="flex-1 p-4 md:p-8 flex justify-center relative">
        <div className="max-w-4xl w-full">

          {/* --- HELP MODAL --- */}
          {showHelpModal && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-800 border border-slate-600 shadow-2xl rounded-3xl p-6 md:p-8 max-w-2xl w-full relative max-h-[90vh] overflow-y-auto">
                <button onClick={() => setShowHelpModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle className="w-8 h-8" /></button>
                <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 flex items-center"><Book className="text-indigo-400 mr-3 w-8 h-8" /> Handbuch für Agenten</h2>
                <div className="space-y-6 text-slate-300">
                  <section>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center"><Target className="w-5 h-5 mr-2 text-indigo-400"/>Das Startmenü</h3>
                    <p className="text-sm md:text-base leading-relaxed">Hier wählst du deine Missionen aus. Jede Mission wird bei jedem Start <strong className="text-indigo-300">komplett neu generiert</strong>. Du kannst also dieselbe Mission endlos oft spielen und bekommst immer neue Zahlen und Rätsel zum Trainieren!</p>
                  </section>
                  <section>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center"><Filter className="w-5 h-5 mr-2 text-indigo-400"/>Die Aufgabentypen</h3>
                    <ul className="space-y-3 text-sm md:text-base">
                      <li className="flex items-start"><span className="bg-amber-500/20 text-amber-400 px-2 py-0.5 rounded text-xs font-bold mr-2 mt-0.5 whitespace-nowrap">Geheimakte</span> <span>Diese Aufgaben erfordern dein Matheheft! Du musst Zwischenschritte notieren, zeichnen oder schriftlich rechnen. Trage am Ende nur den finalen Sicherheitscode ein.</span></li>
                      <li className="flex items-start"><span className="bg-cyan-500/20 text-cyan-400 px-2 py-0.5 rounded text-xs font-bold mr-2 mt-0.5 whitespace-nowrap">Blitz-Mission</span> <span>Trainiere dein Kopfrechnen und Grundwissen direkt in der App. Kurz, knackig und schnell.</span></li>
                      <li className="flex items-start"><span className="bg-purple-500/20 text-purple-400 px-2 py-0.5 rounded text-xs font-bold mr-2 mt-0.5 whitespace-nowrap">Knobel-Tresor</span> <span>Schwere Logik-Rätsel, die um-die-Ecke-Denken erfordern. Nimm dir hierfür besonders viel Zeit!</span></li>
                    </ul>
                  </section>
                  <section>
                    <h3 className="text-xl font-bold text-white mb-2 flex items-center"><Key className="w-5 h-5 mr-2 text-indigo-400"/>Die Speicherfunktion</h3>
                    <p className="text-sm md:text-base leading-relaxed">Klicke oben rechts auf das Schlüssel-Symbol, um den <strong className="text-indigo-300">Agenten-Tresor</strong> zu öffnen. Dort wird ein geheimer Code (z.B. A150B5C12) generiert. Schreibe ihn in dein Heft. Wenn du das nächste Mal spielst, gib diesen Code dort wieder ein, um deine Punkte zurückzuholen!</p>
                  </section>
                </div>
                <button onClick={() => setShowHelpModal(false)} className="mt-8 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl active:scale-95 transition-all">Verstanden, zurück zur Mission!</button>
              </div>
            </div>
          )}

          {/* --- SAVE/LOAD MODAL --- */}
          {showSaveModal && (
            <div className="fixed inset-0 bg-slate-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
              <div className="bg-slate-800 border border-slate-600 shadow-2xl rounded-3xl p-6 md:p-8 max-w-md w-full relative">
                <button onClick={() => setShowSaveModal(false)} className="absolute top-4 right-4 text-slate-400 hover:text-white"><XCircle className="w-8 h-8" /></button>
                <h2 className="text-2xl font-bold text-white mb-6 flex items-center"><Key className="text-indigo-400 mr-3" /> Agenten-Tresor</h2>
                <div className="mb-8">
                  <p className="text-slate-300 text-sm mb-2">Dein aktueller Spielstand-Code:</p>
                  <div className="flex items-center space-x-2">
                    <div className="bg-slate-900 border border-slate-700 text-indigo-300 font-mono text-lg p-3 rounded-xl flex-1 text-center font-bold tracking-widest">{generateSaveCode()}</div>
                    <button onClick={copyToClipboard} className="bg-indigo-600 hover:bg-indigo-500 p-3 rounded-xl active:scale-95 transition-all text-white"><Copy className="w-6 h-6" /></button>
                  </div>
                  <p className="text-xs text-slate-400 mt-2">Schreibe diesen Code am Ende in dein Heft. Gib ihn beim nächsten Mal hier ein, um weiterzuspielen!</p>
                </div>
                <div className="border-t border-slate-700 pt-6">
                  <p className="text-slate-300 text-sm mb-2">Spielstand wiederherstellen:</p>
                  <div className="flex items-center space-x-2">
                    <input type="text" value={inputCode} onChange={(e) => setInputCode(e.target.value)} placeholder="z.B. A150B12C45" className="bg-slate-900 border border-slate-700 focus:border-indigo-500 text-white font-mono p-3 rounded-xl flex-1 outline-none uppercase"/>
                    <button onClick={loadSaveCode} disabled={!inputCode} className="bg-green-600 hover:bg-green-500 disabled:bg-slate-700 disabled:text-slate-500 p-3 rounded-xl active:scale-95 transition-all text-white"><Download className="w-6 h-6" /></button>
                  </div>
                  {saveMessage.text && <div className={`mt-4 p-3 rounded-xl text-sm font-bold ${saveMessage.type === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'}`}>{saveMessage.text}</div>}
                </div>
              </div>
            </div>
          )}

          {/* --- DASHBOARD --- */}
          {currentScreen === 'dashboard' && (
            <div className="space-y-6 md:space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <div className="bg-gradient-to-br from-indigo-900 to-purple-900 rounded-3xl p-6 md:p-8 shadow-2xl shadow-indigo-900/50 border border-indigo-500/30 relative overflow-hidden">
                <div className="absolute top-0 right-0 opacity-10 transform translate-x-1/4 -translate-y-1/4"><Target className="w-64 h-64" /></div>
                <h2 className="text-2xl md:text-4xl font-extrabold text-white mb-2 relative z-10">Bereit für den Einsatz?</h2>
                <p className="text-indigo-200 md:text-lg mb-6 max-w-xl relative z-10">Das Raum-Zeit-Kontinuum ist instabil. Wir brauchen deine Fähigkeiten. Wähle eine Mission. Jede Mission generiert bei Wiederholung völlig neue Zahlen – du kannst endlos trainieren!</p>
              </div>

              <div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-300 mb-4 flex items-center"><BrainCircuit className="mr-2 text-indigo-400" />Verfügbare Missionen ({filteredTasks.length})</h3>
                <div className="flex flex-wrap gap-2 md:gap-3 mb-6">
                  <button onClick={() => setFilterType('all')} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm md:text-base flex items-center transition-all active:scale-95 ${filterType === 'all' ? 'bg-indigo-600 text-white shadow-lg border-indigo-500' : 'bg-slate-800 border-slate-700 text-slate-400'}`}><Filter className="w-4 h-4 mr-2" /> Alle</button>
                  <button onClick={() => setFilterType('analog')} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-all active:scale-95 ${filterType === 'analog' ? 'bg-amber-500 text-slate-900 shadow-lg border-amber-400' : 'bg-slate-800 border-slate-700 text-amber-500/70'}`}>Geheimakten (Heft)</button>
                  <button onClick={() => setFilterType('digital')} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-all active:scale-95 ${filterType === 'digital' ? 'bg-cyan-500 text-slate-900 shadow-lg border-cyan-400' : 'bg-slate-800 border-slate-700 text-cyan-500/70'}`}>Blitz-Mission (App)</button>
                  <button onClick={() => setFilterType('knobel')} className={`px-4 py-2 md:px-5 md:py-2.5 rounded-full font-bold text-sm md:text-base transition-all active:scale-95 ${filterType === 'knobel' ? 'bg-purple-500 text-white shadow-lg border-purple-400' : 'bg-slate-800 border-slate-700 text-purple-400/70'}`}>Knobel-Tresore</button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                  {filteredTasks.map((task) => (
                    <button key={task.id} onClick={() => handleStartTask(task)} className="group bg-slate-800 hover:bg-slate-750 p-5 md:p-6 rounded-2xl border border-slate-700 hover:border-indigo-500 transition-all text-left flex flex-col h-full shadow-lg hover:shadow-indigo-500/20 active:scale-95">
                      <div className="flex justify-between items-start mb-3">
                        <span className={`text-xs md:text-sm font-bold px-3 py-1 rounded-full uppercase tracking-wider ${task.type === 'analog' ? 'bg-amber-500/20 text-amber-400' : task.type === 'knobel' ? 'bg-purple-500/20 text-purple-400' : 'bg-cyan-500/20 text-cyan-400'}`}>
                          {task.type === 'analog' ? 'Geheimakte' : task.type === 'knobel' ? 'Knobel-Tresor' : 'Blitz-Mission'}
                        </span>
                        <span className="text-indigo-400 font-bold flex items-center text-sm md:text-base">+{task.points} IQ <Star className="w-4 h-4 ml-1" /></span>
                      </div>
                      <h4 className="text-lg md:text-xl font-bold text-white mb-2 group-hover:text-indigo-300 transition-colors">{task.title}</h4>
                      <p className="text-slate-400 text-sm md:text-base line-clamp-2 mb-4 flex-1">{task.story}</p>
                      <div className="flex items-center text-indigo-400 font-semibold text-sm md:text-base mt-auto">Mission starten <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* --- TASK SCREEN --- */}
          {currentScreen === 'task' && activeTask && taskInstance && (
            <div className="max-w-2xl mx-auto space-y-6 animate-in fade-in slide-in-from-right-8 duration-300">
              <button onClick={handleBackToDash} className="text-slate-400 hover:text-white flex items-center space-x-2 px-2 py-1 active:scale-95 transition-transform">
                <ChevronRight className="w-5 h-5 rotate-180" /><span className="font-semibold text-lg">Rückzug</span>
              </button>

              <div className="bg-slate-800 rounded-3xl p-6 md:p-10 shadow-2xl border border-slate-700 relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-indigo-600 rounded-bl-3xl px-6 py-3 font-bold text-white shadow-lg flex items-center space-x-2">
                  <Hash className="w-5 h-5" /><span>Stufe {taskLevel}</span>
                </div>

                <div className="mb-8 pr-20">
                  <span className="text-indigo-400 font-semibold tracking-wide uppercase text-sm">{activeTask.category}</span>
                  <h2 className="text-2xl md:text-4xl font-extrabold text-white mt-1">{taskTitle}</h2>
                </div>

                {activeTask.briefing && (
                  <div className="mb-8 bg-slate-700/50 border border-slate-600 rounded-2xl overflow-hidden">
                    <button onClick={() => setIsBriefingOpen(!isBriefingOpen)} className="w-full p-4 md:p-5 flex items-center justify-between bg-slate-700 hover:bg-slate-600 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="bg-cyan-500/20 p-2 rounded-lg"><BookOpen className="text-cyan-400 w-5 h-5 md:w-6 md:h-6" /></div>
                        <h3 className="font-bold text-white text-lg md:text-xl text-left">Einsatz-Briefing: {activeTask.briefing.title}</h3>
                      </div>
                      <ChevronDown className={`text-slate-400 w-6 h-6 transition-transform duration-300 ${isBriefingOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isBriefingOpen && (
                      <div className="p-5 md:p-6 bg-slate-800/50 text-slate-200 md:text-lg leading-relaxed animate-in slide-in-from-top-2 duration-300">
                        <p className="mb-4">{activeTask.briefing.content}</p>
                        {activeTask.briefing.visual && (
                          <div className="mt-6 rounded-xl overflow-hidden border-2 border-slate-600 shadow-inner bg-slate-900 p-2 md:p-6">
                            {activeTask.briefing.visual}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}

                <div className="bg-indigo-900/30 border-l-4 border-indigo-500 p-4 md:p-6 rounded-r-2xl mb-8">
                  <p className="text-indigo-100 md:text-lg italic leading-relaxed">"{taskStory}"</p>
                </div>

                {activeTask.type === 'analog' && taskInstructions && (
                  <div className="bg-amber-900/20 border border-amber-500/30 rounded-2xl p-5 md:p-6 mb-8">
                    <h3 className="text-amber-400 font-bold text-lg md:text-xl flex items-center mb-4"><PenTool className="mr-2" /> Analoge Mission: Heft & Stift erforderlich!</h3>
                    <ul className="space-y-3">
                      {taskInstructions.map((inst, idx) => (
                        <li key={idx} className="flex items-start">
                          <div className="bg-amber-500/20 text-amber-400 rounded-full w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5 mr-3 text-sm font-bold">{idx + 1}</div>
                          <span className="text-slate-200 md:text-lg leading-relaxed">{inst}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                <div className="mb-8">
                  <h3 className="text-xl md:text-2xl font-bold text-white mb-6">{taskQuestion}</h3>

                  {feedback === 'correct' ? (
                    <div className="bg-green-500/20 border border-green-500/50 rounded-2xl p-6 text-center animate-in zoom-in duration-300">
                      <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                      <h3 className="text-2xl font-bold text-green-400 mb-2">Code Akzeptiert!</h3>
                      <p className="text-green-200 text-lg">Du hast {activeTask.points} IQ-Punkte verdient.</p>
                      <div className="flex flex-col md:flex-row gap-4 mt-8">
                        <button onClick={handleNextInstance} className="flex-1 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-lg py-4 px-6 rounded-xl active:scale-95 transition-all shadow-lg shadow-indigo-600/30">Nächste Stufe starten</button>
                        <button onClick={handleBackToDash} className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-bold text-lg py-4 px-6 rounded-xl active:scale-95 transition-all">Übersicht</button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {taskInputType === 'choice' && taskOptions ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {taskOptions.map((opt, idx) => (
                            <button key={idx} onClick={() => setUserAnswer(opt)} className={`p-4 md:p-6 rounded-2xl text-lg md:text-xl font-bold text-center transition-all border-2 active:scale-95 ${userAnswer === opt ? 'bg-indigo-600 border-indigo-400 text-white shadow-lg shadow-indigo-500/30' : 'bg-slate-700 border-slate-600 text-slate-200 hover:border-indigo-500'}`}>{opt}</button>
                          ))}
                        </div>
                      ) : (
                        <input 
                          type="text" 
                          inputMode={taskInputType === 'number' ? 'numeric' : 'text'} 
                          pattern={taskInputType === 'number' ? '[0-9]*' : undefined} 
                          value={userAnswer} 
                          onChange={(e) => setUserAnswer(e.target.value)} 
                          onKeyDown={(e) => { if (e.key === 'Enter' && userAnswer) handleCheckAnswer(); }}
                          placeholder="Antwort hier eingeben... (Enter)" 
                          className="w-full bg-slate-900 border-2 border-slate-600 focus:border-indigo-500 rounded-2xl p-4 md:p-6 text-2xl md:text-3xl text-center text-white font-bold outline-none placeholder:text-slate-600 placeholder:font-normal placeholder:text-lg transition-colors"
                        />
                      )}

                      {feedback === 'wrong' && (
                        <div className="flex items-center space-x-3 text-red-400 bg-red-500/10 p-4 rounded-xl animate-in shake duration-300">
                          <XCircle className="w-6 h-6 flex-shrink-0" /><span className="font-semibold text-lg">Zugriff verweigert. Code inkorrekt. Versuch es nochmal!</span>
                        </div>
                      )}

                      <div className="flex flex-col md:flex-row gap-4 mt-8 pt-6 border-t border-slate-700">
                        <button onClick={handleCheckAnswer} disabled={!userAnswer} className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-700 disabled:text-slate-500 text-white font-bold text-xl py-4 md:py-5 px-6 rounded-2xl active:scale-95 transition-all shadow-lg shadow-indigo-600/20 disabled:shadow-none">Code überprüfen</button>
                        <button onClick={() => setShowHint(true)} className="md:w-auto bg-slate-700 hover:bg-slate-600 text-amber-400 font-bold text-lg py-4 md:py-5 px-6 rounded-2xl flex justify-center items-center active:scale-95 transition-all"><Zap className="w-5 h-5 mr-2" /> Tipp anfordern</button>
                      </div>

                      {showHint && (
                        <div className="mt-6 bg-amber-900/20 border border-amber-500/30 p-5 rounded-xl animate-in slide-in-from-top-2">
                          <h4 className="text-amber-400 font-bold mb-1 flex items-center"><BrainCircuit className="w-4 h-4 mr-2" /> System-Hinweis:</h4>
                          <p className="text-amber-100 text-lg leading-relaxed">{taskHint}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Fußzeile: Impressum & Datenschutz (ohne Passwort erreichbar) */}
      {currentScreen === 'dashboard' && (
        <footer className="pb-6 text-center text-xs sm:text-sm text-slate-500">
          <button onClick={() => setImpressum('impressum')} className="hover:text-slate-300 hover:underline underline-offset-2 transition-colors">Impressum</button>
          <span className="mx-2" aria-hidden="true">·</span>
          <button onClick={() => setImpressum('datenschutz')} className="hover:text-slate-300 hover:underline underline-offset-2 transition-colors">Datenschutz</button>
        </footer>
      )}
      {impressum && <ImpressumModal section={impressum} onClose={() => setImpressum(null)} />}
    </div>
  );
}