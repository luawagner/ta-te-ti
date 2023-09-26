import { useState } from "react";
import "./App.css";

const TURNS = {
  X: "x",
  O: "o",
};

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
  //diseño el board compuesto por un array de nueve posiciones.
  //necesitamos un estado para guardar cuando el usuario hace click en cada posicion
  //cuando en el square se haga un click vamos a tener que actualizar el tablero
  const [board, setBoard] = useState(Array(9).fill(null));
  //Necesitamos un estado para saber de quién es el turno
  const [turn, setTurn] = useState(TURNS.X); // Inicilizamos con x

  const updateBoard = (index) => {
    //con cada click construimos un nuevo board 
    const newBoard = [...board] //destructuring para hacer una copia de los valores originales del array sin modoficar este
    newBoard[index] = turn // al índice donde el user clickeó le asigno el valor del turno
    setBoard(newBoard) // Seteo el estado del board con los nuevos valores
  
    //Si el turno actual es de X el próximo será de O,
    const newTurn = turn === TURNS.X ? TURNS.O : TURNS.X;
    setTurn(newTurn); //seteamos el turn con el nuevo valor
    };

  return (
    <main className="board">
      <h1>Tic tac toe</h1>
      <section className="game">
        {
          //recorremos el array
          board.map((_, index) => {
            return (
              //componente del cuadrado con la key que lo identifica, el index
              <Square
                key={index}
                index={index}
                updateBoard={updateBoard}
              >
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
    </main>
  );
}

export default App;
