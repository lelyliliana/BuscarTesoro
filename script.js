const gameBoard = document.getElementById('gameBoard');
const gridSize = 10; // Tamaño de la matriz
const totalCells = gridSize * gridSize; // Total de celdas
const equipos = ['rojo', 'azul', 'verde', 'amarillo', 'rosa']; // Definición de equipos
const puntuaciones = {
  rojo: 0,
  azul: 0,
  verde: 0,
  amarillo: 0,
  rosa: 0,
};

let equipoActual = null; // Almacena el equipo dueño de la última pregunta mostrada
let indicesPreguntasMostradas = [];
let casillaActual = null; // Almacena la casilla actual clickeada



// Coordenadas para cada color
const cellCoordinates = {

 red: [
  { row: 1, col: 6 },
  { row: 2, col: 5 },
  { row: 3, col: 6 },
  { row: 4, col: 5 },
  { row: 4, col: 6 }
],
  blue: [
    { row: 2, col: 1 },
    { row: 3, col: 2 },
    { row: 4, col: 2 },
    { row: 4, col: 3 },
    { row: 5, col: 4 }
  ],
  green: [
    { row: 7, col: 4 },
    { row: 8, col: 3 },
    { row: 9, col: 2 },
    { row: 10, col: 1 },
    { row: 10, col: 2 }
  ],
  yellow: [
    { row: 7, col: 7 },
    { row: 8, col: 8 },
    { row: 9, col: 9 },
    { row: 10, col: 9 },
    { row: 10, col: 10 }
  ],
  pink: [
    { row: 5, col: 7 },
    { row: 5, col: 8 },
    { row: 4, col: 8 },
    { row: 4, col: 9 },
    { row: 4, col: 10 }
  ]
};

// Convertir coordenadas de fila y columna a índices lineales para cada color
const cellsByColor = Object.fromEntries(
  Object.entries(cellCoordinates).map(([color, coordsList]) => [
    color,
    coordsList.map(coords => (coords.row - 1) * gridSize + (coords.col - 1))
  ])
);

// Ajustar paths para un tablero de 10x10 con colores distribuidos
const paths = {
  red: [],
  blue: [],
  green: [],
  yellow: [],
  pink: []
};

// Función para crear una celda

function createCell(color, hasActivity) {
  const cell = document.createElement('div');
  cell.classList.add('cell', color);
  if (hasActivity) {
    cell.setAttribute('data-equipo', color);
    cell.innerHTML = '<span class="question-mark">?</span>';
    cell.addEventListener('click', function() {
      casillaActual = this;
      equipoActual = this.getAttribute('data-equipo'); 
      mostrarPregunta();
    });
  }
  return cell;
}

function assignColors() {
  const colors = ['red', 'green', 'yellow', 'blue', 'pink'];
  const cellsPerColor = 5;
  let colorIndex = 0;

  for (let i = 0; i < cellsPerColor * colors.length; i++) {
    const color = colors[colorIndex];
    paths[color].push(i);
    colorIndex = (colorIndex + 1) % colors.length;
  }
}

assignColors(); // Llama a la función para asignar los colores antes de crear el tablero

function createBoard() {
  gameBoard.style.display = 'grid';
  gameBoard.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;
  gameBoard.style.gap = '2px';

  for (let i = 0; i < gridSize * gridSize; i++) {
    let hasActivity = false;
    let cellColor = 'grey'; // Color por defecto para las celdas sin actividad

    for (const [color, indices] of Object.entries(cellsByColor)) {
      if (indices.includes(i)) {
        cellColor = color;
        hasActivity = true;
        break;
      }
    }
    
    const cell = createCell(cellColor, hasActivity);
    gameBoard.appendChild(cell);
  }
}

function actualizarPuntuacion(equipo, cambio) {
  // Asegúrate de que el cambio no haga que el puntaje sea negativo
  const nuevoPuntaje = Math.max(0, puntuaciones[equipo] + cambio);
  puntuaciones[equipo] = nuevoPuntaje;
  document.getElementById(`puntaje-${equipo}`).textContent = `${equipo.charAt(0).toUpperCase() + equipo.slice(1)}: ${nuevoPuntaje}`;
}

function mostrarPregunta() {
  if (indicesPreguntasMostradas.length >= preguntas.length) {
    console.log("Todas las preguntas han sido mostradas.");
    // Manejar el caso de que todas las preguntas se hayan mostrado, por ejemplo, reiniciar el juego o mostrar un mensaje.
    return;
  }

  let indicePregunta;
  do {
    indicePregunta = Math.floor(Math.random() * preguntas.length);
  } while (indicesPreguntasMostradas.includes(indicePregunta));

  indicesPreguntasMostradas.push(indicePregunta);

  const preguntaSeleccionada = preguntas[indicePregunta];
  document.getElementById('texto-pregunta').innerHTML = preguntaSeleccionada.pregunta;
  document.getElementById('imagen-pregunta').src = preguntaSeleccionada.imagenPregunta;
  document.getElementById('contenedor-pregunta').style.display = 'flex';

  window.respuestaActual = preguntaSeleccionada;

if (casillaActual) {
    casillaActual.classList.add('respondida'); // Marca la casilla como respondida
    casillaActual = null; // Opcional: limpia la referencia a la casilla actual
  }
}


function cerrarRespuesta() {
  document.getElementById('contenedor-respuesta').style.display = 'none';
}


function mostrarRespuesta() {
  const respuesta = window.respuestaActual.respuesta;
  const imagenRespuesta = window.respuestaActual.imagenRespuesta;
  document.getElementById('texto-respuesta').textContent = respuesta;
  const imagenElement = document.getElementById('imagen-respuesta');
  if (imagenRespuesta) {
    imagenElement.src = imagenRespuesta;
    imagenElement.style.display = 'block';
  } else {
    imagenElement.style.display = 'none'; // Oculta el elemento si no hay imagen para mostrar
  }

  document.getElementById('contenedor-pregunta').style.display = 'none';
  document.getElementById('contenedor-respuesta').style.display = 'flex';
}


function asignarPreguntaACelda(cell, indicePregunta) {
  const preguntaObj = preguntas[indicePregunta];
  cell.addEventListener('click', function() {
    mostrarPregunta(preguntaObj.pregunta, preguntaObj.imagenPregunta);
    window.respuestaActual = preguntaObj; // O manejarlo de una manera más estructurada
  });
}


createBoard();
