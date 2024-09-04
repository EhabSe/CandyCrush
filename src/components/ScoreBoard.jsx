

const scoreBoard = ({score, gameStatus}) => {
    return (
        <div className={gameStatus? 'gameFinish': 'score-board'}>
            <h2>{score}</h2>
        </div>
    )
}

export default scoreBoard