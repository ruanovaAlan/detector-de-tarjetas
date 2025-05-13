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

const construirMastercard = (numero) => {
  const estados = Array.from({ length: 17 }, (_, i) =>
    new Estado(`mq${i}`, i === 16, "Mastercard")
  );

  const primeros4 = parseInt(numero.slice(0, 4));
  const primeros2 = parseInt(numero.slice(0, 2));

  // Si el número comienza con 2221–2720 o 51–55 → construir transiciones
  if (
    (primeros4 >= 2221 && primeros4 <= 2720) ||
    (primeros2 >= 51 && primeros2 <= 55)
  ) {
    // Transiciones desde q0 hasta q16 para cualquier secuencia válida
    for (let d of "0123456789") estados[0].agregarTransicion(d, estados[1]);
    for (let d of "0123456789") estados[1].agregarTransicion(d, estados[2]);
    for (let i = 2; i < 16; i++) {
      for (let d of "0123456789") {
        estados[i].agregarTransicion(d, estados[i + 1]);
      }
    }
    return estados[0];
  }

  return estados[0];
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
  const automatas = [construirVisa(), construirMastercard(numero), construirAmex()];
  for (let automata of automatas) {
    const tipo = simularAFD(automata, numero);
    if (tipo) return tipo;
  }

  return 'Error';
}

export { detectarTipoDeTarjeta };