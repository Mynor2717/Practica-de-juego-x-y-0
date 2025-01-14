import { useState } from 'react'
import confetti from 'canvas-confetti'
import './App.css'
import { Square } from './components/Square'
import { Turns, WINNER_COMBOS } from './constants'


//Componente Padre 

function App() {
  const [board, setBoard] = useState(() => {
    const boardFromStorage = window.localStorage.getItem('board')
    if(boardFromStorage) return JSON.parse(boardFromStorage)
      return Array(9).fill(null)
  })

  const [turn, setTurn] = useState(() => {
    const turnFromStorage = window.localStorage.getItem('turn')
    return turnFromStorage ?? Turns.O  
  })

  const [winner, setWinner] = useState(null)

  const checkWinner = (boardToCheck) => {
    for(const combo of WINNER_COMBOS) {
       const [a,b,c] = combo
      if(
        boardToCheck[a] &&
        boardToCheck[a] === boardToCheck[b] &&
        boardToCheck[a] === boardToCheck[c]
      ) {
        return boardToCheck[a]
      }
    }
    return null
  }

  // Para reiniciar el juego solo hay que llevarlo a su estado inicial
  const resetGame = () => {
    setBoard(Array(9).fill(null))
    setTurn(Turns.X)
    setWinner(null)

    window.localStorage.removeItem('board')
    window.localStorage.removeItem('turn')
  }

  const checkEndGame = (newBoard) => {
    return newBoard.every((square) => square !== null)
  }

  const updateBoard = (index) => {
    // no actualizamos esta posicion si ya tiene algo
    if(board[index] || winner) return
    // actualizamos el tablero
    const newBoard = [...board]
    newBoard[index] = turn
    setBoard(newBoard)
    // guardar la partida
    window.localStorage.setItem('board', JSON.stringify(newBoard))
    window.localStorage.setItem('turn', newTurn)
    // Cambiamos el turno
    const newTurn = turn === Turns.X ? Turns.O : Turns.X
    setTurn(newTurn)

    const newWinner =checkWinner(newBoard)
    if(newWinner) {
      confetti()
      setWinner(newWinner)
    }else if(checkEndGame(newBoard)) {
      setWinner(false)
    }
  }

  return (
    <>
      <div className="board">
        <h1>Tic tac toe</h1>
        <button onClick={resetGame}>Reset Game</button>
        <section className='game'>
          {
            board.map((square, index) => {
              return (
                <Square key={index}
                  index={index}
                  updateBoard={updateBoard}
                >
                  {square}
                </Square>
              )
            })
          }
        </section>

        <section className='turn'>
          <Square isSelected={turn === Turns.X}>{Turns.X}</Square>
          <Square isSelected={turn === Turns.O}>{Turns.O}</Square>
        </section>
        {
          winner !== null && (
            <section className='winner'>
              <div className="text">
                <h2>
                  {
                    winner === false ? 'Empate' : 'Gano'
                  }
                </h2>
                <header className='win'>
                  {winner && <Square>{winner}</Square>}
                </header>

                <footer>
                  <button onClick={resetGame}>Empezar de nuevo</button>
                </footer>
              </div>
            </section>
          )
        }
      </div>
    </>
  )
}

export default App
