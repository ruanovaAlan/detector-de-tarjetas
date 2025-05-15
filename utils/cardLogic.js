// ----- Clase Estado para simular un autómata -----
class Estado {
  constructor(nombre, esFinal = false, tipoTarjeta = null) {
    this.nombre = nombre;
    this.transiciones = {};
    this.esFinal = esFinal;
    this.tipoTarjeta = tipoTarjeta;
  }

  agregarTransicion(digito, destino) {
    this.transiciones[digito] = destino;
  }

  siguiente(digito) {
    return this.transiciones[digito] || null;
  }
}


// ----- Construcción de AFDs por tipo -----
const construirVisa = () => {
  const estados = Array.from({ length: 17 }, (_, i) =>
    new Estado(`q${i}`, i === 16, "Visa")
  );
  estados[0].agregarTransicion("4", estados[1]);
  for (let i = 1; i < 16; i++) {
    for (let d of "0123456789") {
      estados[i].agregarTransicion(d, estados[i + 1]);
    }
  }
  return estados[0];
};

const construirMastercard = () => {
  const estados = {};
  const q = (n, isFinal = false) => {
    if (!estados[n]) estados[n] = new Estado(n, isFinal, isFinal ? "Mastercard" : null);
    return estados[n];
  };

  // Crear estados q0 a q26
  const nombres = Array.from({ length: 27 }, (_, i) => `q${i}`);
  nombres.forEach((nombre, i) => q(nombre, nombre === "q26"));

  // Transiciones extraídas del archivo
  const transiciones = {
    "q0": { "2": "q4", "5": "q1" },
    "q1": { "1": "q2", "2": "q2", "3": "q2", "4": "q2", "5": "q2" },
    "q2": Object.fromEntries("0123456789".split("").map(d => [d, "q3"])),
    "q3": Object.fromEntries("0123456789".split("").map(d => [d, "q14"])),
    "q4": { "2": "q7", "3": "q6", "4": "q6", "5": "q6", "6": "q6", "7": "q5" },
    "q5": { "0": "q9", "1": "q9", "2": "q8" },
    "q6": Object.fromEntries("0123456789".split("").map(d => [d, "q10"])),
    "q7": { "2": "q12", "3": "q11", "4": "q11", "5": "q11", "6": "q11", "7": "q11", "8": "q11", "9": "q11" },
    "q8": { "0": "q13" },
    "q9": Object.fromEntries("0123456789".split("").map(d => [d, "q14"])),
    "q10": Object.fromEntries("0123456789".split("").map(d => [d, "q14"])),
    "q11": Object.fromEntries("0123456789".split("").map(d => [d, "q14"])),
    "q12": Object.fromEntries("123456789".split("").map(d => [d, "q14"])),
    "q13": Object.fromEntries("0123456789".split("").map(d => [d, "q15"])),
    "q14": Object.fromEntries("0123456789".split("").map(d => [d, "q15"])),
    "q15": Object.fromEntries("0123456789".split("").map(d => [d, "q16"])),
    "q16": Object.fromEntries("0123456789".split("").map(d => [d, "q17"])),
    "q17": Object.fromEntries("0123456789".split("").map(d => [d, "q18"])),
    "q18": Object.fromEntries("0123456789".split("").map(d => [d, "q19"])),
    "q19": Object.fromEntries("0123456789".split("").map(d => [d, "q20"])),
    "q20": Object.fromEntries("0123456789".split("").map(d => [d, "q21"])),
    "q21": Object.fromEntries("0123456789".split("").map(d => [d, "q22"])),
    "q22": Object.fromEntries("0123456789".split("").map(d => [d, "q23"])),
    "q23": Object.fromEntries("0123456789".split("").map(d => [d, "q24"])),
    "q24": Object.fromEntries("0123456789".split("").map(d => [d, "q25"])),
    "q25": Object.fromEntries("0123456789".split("").map(d => [d, "q26"]))
  };

  // Agregar transiciones al autómata
  for (const [origen, mapa] of Object.entries(transiciones)) {
    for (const [simbolo, destino] of Object.entries(mapa)) {
      q(origen).agregarTransicion(simbolo, q(destino));
    }
  }

  return q("q0");
};


const construirAmex = () => {
  const estados = Array.from({ length: 16 }, (_, i) =>
    new Estado(`aq${i}`, i === 15, "Amex")
  );
  estados[0].agregarTransicion("3", estados[1]);
  estados[1].agregarTransicion("4", estados[2]);
  estados[1].agregarTransicion("7", estados[2]);
  for (let i = 2; i < 15; i++) {
    for (let d of "0123456789") {
      estados[i].agregarTransicion(d, estados[i + 1]);
    }
  }
  return estados[0];
};

// ----- Simulación del AFD -----
const simularAFD = (estadoInicial, entrada) => {
  let estado = estadoInicial;
  for (let c of entrada) {
    estado = estado.siguiente(c);
    if (!estado) return null;
  }
  return estado.esFinal ? estado.tipoTarjeta : null;
};

// ----- Función exportable -----
function detectarTipoDeTarjeta(numero) {
  const automatas = [construirVisa(), construirMastercard(), construirAmex()];
  for (let automata of automatas) {
    const tipo = simularAFD(automata, numero);
    if (tipo) return tipo;
  }

  return 'Error';
}

export { detectarTipoDeTarjeta };