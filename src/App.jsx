import { useState } from "react";
import "./App.css";

const TURNS = {
  X: "x",
  O: "o",
};

const WINNER_COMBOS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

//-----------------COMPONENTE
//cada cuadro del board, va a recibir children con los turnos
// necesita actualizarse por turno
//el index lo necesitamos para identificar los elementos
const Square = ({ children, isSelected, updateBoard, index }) => {
  const className = `square ${isSelected ? "is-selected" : ""}`;
  const handleClick = () => {
    //necesito pasarle el index para saber cuál es el casillero que va a cambiar
    updateBoard(index);
  };
  return (
    //cada vez que haga click sobre un cuadrado se llama a handleClick, esta llama a updateBoard y esta cambia el turno.
    <div onClick={handleClick} className={className}>
      {children}
    </div>
  );
};

function App() {
  //-----------------ESTADOS
  //diseño el board compuesto por un array de nueve posiciones.
  //necesitamos un estado para guardar cuando el usuario hace click en cada posicion
  //cuando en el square se haga un click vamos a tener que actualizar el tablero
  const [board, setBoard] = useState(Array(9).fill(null));
  //Necesitamos un estado para saber de quién es el turno
  const [turn, setTurn] = useState(TURNS.X); // Inicilizamos con x
  //Estado para saber cuándo hay un ganador
  const [winner, setWinner] = useState(null); // null no hay ganador, false empate.

  const checkWinner = (boardToCheck) => {
    //revisamos todas las combinaciones ganadoras
    for (const combo of WINNER_COMBOS) {
      //recorremos el array de combinaciones ganadoras
      const [a, b, c] = combo; //destructuring del array de arrays
      if (
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c] //si los valores de las posiciones coinciden, sea x u o
      ) {
        return boardToCheck[a]; //devolver el valor ganador
      }
    } //si no hay ganador
    return null;
  };
  //si no se da ninguno de los dos casos retornará false, empate.


  //-----------------RESETEAR EL JUEGO
  //Resetear todos los valores de los estados.
  const resetGame = () => {
    setBoard((Array(9).fill(null)))
    setTurn(TURNS.X)
    setWinner(null)
  }

   //-----------------TABLERO
  const updateBoard = (index) => {
    //Si ya hay un valor guardado en esta posición, no la actualizamos para no sobreescribir el casillero
    if (board[index] || winner) return; // Si hay un ganador, termina el juego
    //con cada click construimos un nuevo board

   //-----------------ACTUALIZAR EL TABLERO
    const newBoard = [...board]; //spread para hacer una copia de los valores originales del array sin modoficar el del estado,
    //a los estados siempre tenemos que tratarlos como inmutables
    //con spread op indico que quiero que se construya un nuevo array con todos los elementos del array original
    newBoard[index] = turn; // al índice donde el user clickeó le asigno el valor del turno
    setBoard(newBoard); // Seteo el estado del board con los nuevos valores

    //-----------------CAMBIAR EL TURNO
    //Si el turno actual es de X el próximo será de O,
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn); //seteamos el turn con el nuevo valor

    //----------------REVISAR SI HAY GANADOR
    const newWinner = checkWinner(newBoard); //Llamamos a la función. Le pasamos el nuevo tablero que hemos creado
    if (newWinner) {
      setWinner(newWinner); //Seteamos el estado con el dato que nos retorna la función
      //Los estados son asíncronos, la actualización de este estado no detiene la ejecución del código que sigue.
      //por ello puede suceder que se dispare el alert antes de mostrar todas las casillas ganadoras.
     // alert(`El ganador es ${newWinner}`)
      //Estamos seteando el estado winner con setWinner, pasándole el nuevo valor
      //Pero no podemos imprimir "el ganador es ${winner}"(el estado que estamos seteando)
      //porque nos mostraría null, que es el valor del estado desactualizado, ya que es asíncrona la actualización

    }
  };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <button onClick={resetGame}>Reset del juego</button>
      <section className="game">
        {
          //recorremos el array
          board.map((_, index) => {
            return (
              //componente del cuadrado con la key que lo identifica, el index
              <Square key={index} index={index} updateBoard={updateBoard}>
                {board[index]}
              </Square>

              //la funcion updateBoard no debe estar ejecutada porque queremos esperar a que el usuario haga click
              //Si lo hacemos, el componente re renderizará 9 veces y se ejecutaría 9 veces la función
            );
          })
        }
      </section>

      <section className="turn">
        <Square isSelected={turn === TURNS.X}>{TURNS.X}</Square>
        <Square isSelected={turn === TURNS.O}>{TURNS.O}</Square>
      </section>

        {
          winner !== null && (
            <section className="winner">
<div className="text">
  <h2>
    { winner === false ? 'Empate'
    : 'Ganó:'
    }
  </h2>
  <header className="win">
    {winner && <Square>{winner}</Square>}
  </header>

  <footer>
    <button onClick={resetGame}>Empezar de nuevo</button>
  </footer>
</div>
            </section>
          )
        }
      
    </main>
  );
}

export default App;
