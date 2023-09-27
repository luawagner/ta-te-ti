import { WINNER_COMBOS } from "../constants";

export const checkWinner = (boardToCheck) => {
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

  //----------------EMPATE
  export const checkedEndGame = (newBoard) => {
    //Si la matriz está llena y todavía no ha habido una derrota...
   return newBoard.every((square) => square !== null) //Si el valor de cada una de las posiciones 
   //es distinto a null da true
  }