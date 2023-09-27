//-----------------COMPONENTE
//cada cuadro del board, va a recibir children con los turnos
// necesita actualizarse por turno
//el index lo necesitamos para identificar los elementos
export const Square = ({ children, isSelected, updateBoard, index }) => {
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