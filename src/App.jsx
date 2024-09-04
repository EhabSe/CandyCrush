import { useEffect, useState } from "react"

import ScoreBoard from "./components/ScoreBoard"

import blueCandy from './images/blue-candy.png'
import redCandy from './images/red-candy.png'
import greenCandy from './images/green-candy.png'
import purpleCandy from './images/purple-candy.png'
import orangeCandy from './images/orange-candy.png'
import yellowCandy from './images/yellow-candy.png'
import blank from './images/blank.png'
import pop from './images/pop.mp3'
import shoot from './images/shoot.mp3'
import win from './images/win.mp3'

const width = 8
const candyColors = [
  blueCandy,
  redCandy,
  greenCandy,
  purpleCandy,
  orangeCandy,
  yellowCandy
]


const App = () => {

  const [currentColorArrangement, setCurrentColorArrangement] = useState([])

  const [squareBeingDragged, setSquareBeingDragged] = useState(null)

  const [squareBeingReplaced, setSquareBeingReplaced] = useState(null)

  const [scoreDisplay, setScoreDisplay] = useState(0)

  const [gameStatus, setGameStatus] = useState(false)

  const [numberOfMoves, setNumberOfMoves] = useState(0)



  const checkforColumnOfFour = () => {
    for(let i=0 ; i<=39; i++) {
        const columnOfFour = [i, i+width, i+width*2, i+width*3]
        const decidedColor = currentColorArrangement[i]
        const isBlank = currentColorArrangement[i] === blank

        if( columnOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
            setScoreDisplay((score) => score + 4)
            columnOfFour.forEach(square => currentColorArrangement[square] = blank)
            playPop()
            return true
        }

    }
  }


  const checkforColumnOfThree = () => {
    for(let i=0 ; i<=47; i++) {
        const columnOfThree = [i, i+width, i+width*2]
        const decidedColor = currentColorArrangement[i]
        const isBlank = currentColorArrangement[i] === blank

        if( columnOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
            setScoreDisplay((score) => score + 3)
            columnOfThree.forEach(square => currentColorArrangement[square] = blank)
            playPop()
            return true
        }

    }
  }


  const checkforRowOfFour = () => {
    for(let i=0 ; i<64; i++) {
        const rowOfFour = [i, i+1, i+2, i+3]
        const decidedColor = currentColorArrangement[i]
        const notValid = [5,6,7,13,14,15,21,22,23,29,30,31,37,38,39,45,46,47,53,54,55,62,63,64]
        const isBlank = currentColorArrangement[i] === blank

        if(notValid.includes(i)) continue

        if( rowOfFour.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
            setScoreDisplay((score) => score + 4)
            rowOfFour.forEach(square => currentColorArrangement[square] = blank)
            playPop()
            return true
        }

    }
  }


  const checkforRowOfThree = () => {
    for(let i=0 ; i<=64; i++) {
        const rowOfThree = [i, i+1, i+2]
        const decidedColor = currentColorArrangement[i]
        const notValid = [6,7,14,15,22,23,30,31,38,39,46,47,54,55,63,64]
        const isBlank = currentColorArrangement[i] === blank

        if(notValid.includes(i)) continue

        if( rowOfThree.every(square => currentColorArrangement[square] === decidedColor && !isBlank)) {
            setScoreDisplay((score) => score + 3)
            rowOfThree.forEach(square => currentColorArrangement[square] = blank)
            playPop()
            return true;
        }

    }
  }


  const moveIntoSquareBelow = () => {
    for (let i=0; i< 55 ; i++ ) {

      const firstRow = [0,1,2,3,4,5,6,7]

      const isFirstRow = firstRow.includes(i)

      if(firstRow && currentColorArrangement[i] === blank) {
        let randomNumber = Math.floor(Math.random() * candyColors.length)
        currentColorArrangement[i] = candyColors[randomNumber]
      }

      if(currentColorArrangement[i + width] === blank) {
        currentColorArrangement[i + width] = currentColorArrangement[i]
        currentColorArrangement[i] = blank
      }
    }
  }


  const dragStart = (e) => {
    // console.log(e.target)
    setSquareBeingDragged(e.target)
  }

  const dragDrop = (e) => {
    // console.log("drag drop")
    setSquareBeingReplaced(e.target)
  }

  const dragEnd = () => {
    
    const squareBeingDraggedId = parseInt(squareBeingDragged.getAttribute('data-id'))
    const squareBeingReplacedId = parseInt(squareBeingReplaced.getAttribute('data-id'))

    currentColorArrangement[squareBeingReplacedId] = squareBeingDragged.getAttribute('src')
    currentColorArrangement[squareBeingDraggedId] = squareBeingReplaced.getAttribute('src')

    const validMoves = [
      squareBeingDraggedId - 1,
      squareBeingDraggedId - width,
      squareBeingDraggedId + 1,
      squareBeingDraggedId + width
  ]

    const validMove = validMoves.includes(squareBeingReplacedId)

    const isARowOfFour = checkforColumnOfFour()
    const isARowOfThree = checkforColumnOfThree()
    const isAColumnOfFour = checkforRowOfFour()
    const isAColumnOfThree = checkforRowOfThree()

    if(squareBeingReplacedId &&
       validMove &&
        (isAColumnOfFour || isARowOfFour || isAColumnOfThree || isARowOfThree)) {
        setSquareBeingDragged(null)
        setSquareBeingReplaced(null)
        setNumberOfMoves(numberOfMoves + 1)
    }
    else {
      currentColorArrangement[squareBeingReplacedId] = squareBeingReplaced.getAttribute('src')
      currentColorArrangement[squareBeingDraggedId] = squareBeingDragged.getAttribute('src')
      setCurrentColorArrangement([...currentColorArrangement])
    }

  }

  const gameWon = () => {
    if(scoreDisplay >= 100) {
      setGameStatus(true)
    }
  }


  const playPop = () => {
    new Audio(pop).play()
  }

  const playWin = () => {
    new Audio(win).play()
  }


  const reRoll = () => {
    setScoreDisplay(scoreDisplay - 20)
    createBoard()
  }

  const createBoard = () => {
      const randomColorArrangement = []

      for (let i=0 ; i< width*width; i++) {
        const randomNumberFrom0to5 = Math.floor(Math.random() * candyColors.length)
        const randomColor = candyColors[randomNumberFrom0to5]
        randomColorArrangement.push(randomColor)
      }
      setCurrentColorArrangement(randomColorArrangement)
    }

  useEffect(() => {
      createBoard()
  }, [])



  useEffect(() => {
      const timer = setInterval(() => {
        gameWon()
        checkforColumnOfFour()
        checkforRowOfFour()
        checkforColumnOfThree()
        checkforRowOfThree()
        moveIntoSquareBelow()
        setCurrentColorArrangement([...currentColorArrangement])
      },100)

      
      return () => clearInterval(timer)
  }, [checkforRowOfFour, checkforColumnOfFour, checkforColumnOfThree,currentColorArrangement, checkforRowOfThree, moveIntoSquareBelow])


  useEffect(() => {
    playWin()
  },[gameStatus])

  console.log(currentColorArrangement)

  return (
    <div className="app">
      <p className={gameStatus? 'gameFinish': 'text'}>Reach 100 points to win !</p>
      {gameStatus ? <div className="gameWon">
        <p>You won !</p>

        <p>it took you {numberOfMoves} moves!</p>

        <button className="restart-btn" onClick={() => window.location.reload()}>Restart</button>
        </div> : ''}
      <ScoreBoard score={scoreDisplay} gameStatus={gameStatus}/>
        <div className={gameStatus? 'gameFinish': 'game'}>
        {
          currentColorArrangement.map((candyColor, index) => (
            <img
             key={index} 
             src={candyColor}
             alt={candyColor} 
             data-id={index}
             draggable={true}
             onDragStart={dragStart}
             onDragOver={(e) => e.preventDefault()}
             onDragEnter={(e) => e.preventDefault()}
             onDragLeave={(e) => e.preventDefault()}
             onDrop={dragDrop}
             onDragEnd={dragEnd}
             />
            ))
          }
          </div>
          <button className={gameStatus? 'gameFinish': 'reRoll-btn'} onClick={reRoll}>Re Roll (-20 PTS)</button>
        </div>
  )
}

export default App
