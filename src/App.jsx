import { useState } from "react";
import { Square } from "./components/Square";
import "./App.css";
import confetti from "canvas-confetti";
import { TURNS } from "./constants";
import { Winner } from "./components/Winner";
import { checkWinner, checkedEndGame } from "./logic/board";

function App() {
  //-----------------ESTADOS

  //necesitamos un estado para guardar cuando el usuario hace click en cada posicion
  //cuando en el square se haga un click vamos a tener que actualizar el tablero
  const [board, setBoard] = useState(() => {
    //Para leer lo que guardamos en localStorage, en el estado del tablero pasamos una función al useState
    const boardFromStorage = window.localStorage.getItem("board");
    //capturamos el item en una constante y le decimos que si existe una partida guardada la parsee
    // y ese será el estado inicial del tablero, sino el estado inicial es el tablero vacío.
    return boardFromStorage
      ? JSON.parse(boardFromStorage)
      : Array(9).fill(null); //diseño el board compuesto por un array de nueve posiciones.
  });
  //Leemos el localStorage dentro de la inicializacion del estado para que se ejecute una sola vez
  //y no cada vez que se renderiza el componente.

  //Necesitamos un estado para saber de quién es el turno
  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem("turn")
    return turnFromStorage ?? TURNS.X 
  }); // Pedimos el turno guardado al localStorage, si existe. Sino inicilizamos con x
  //Estado para saber cuándo hay un ganador
  const [winner, setWinner] = useState(null); // null no hay ganador, false empate.

  //-----------------RESETEAR EL JUEGO
  //Resetear todos los valores de los estados.
  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setTurn(TURNS.X);
    setWinner(null);
    //También reinicio el localStorage
    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')

  };

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

    //-----------------GUARDAR PARTIDA EN ESTE PUNTO
    window.localStorage.setItem("board", JSON.stringify(newBoard)); //Guardamos el estado del tablero
    //Lo hacemos con JSONStringify para que nos convierta el array en string y luego podamos convertirlo nuevamente
    window.localStorage.setItem("turn", turn);

    //----------------REVISAR SI HAY GANADOR
    const newWinner = checkWinner(newBoard); //Llamamos a la función. Le pasamos el nuevo tablero que hemos creado
    if (newWinner) {
      confetti();
      setWinner(newWinner); //Seteamos el estado con el dato que nos retorna la función
      //Los estados son asíncronos, la actualización de este estado no detiene la ejecución del código que sigue.
      //por ello puede suceder que se dispare el alert antes de mostrar todas las casillas ganadoras.
      // alert(`El ganador es ${newWinner}`)
      //Estamos seteando el estado winner con setWinner, pasándole el nuevo valor
      //Pero no podemos imprimir "el ganador es ${winner}"(el estado que estamos seteando)
      //porque nos mostraría null, que es el valor del estado desactualizado, ya que es asíncrona la actualización
    } else if (checkedEndGame(newBoard)) {
      setWinner(false); // Si el checkeo del empate da true setear el winner con false (empate)
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

      <Winner resetGame={resetGame} winner={winner} />
    </main>
  );
}

export default App;
