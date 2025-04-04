import React from 'react'
import Graph from './Graph'

const Stats = ({
            wpm,
            accuracy,
            correctChars,
            incorrectChars,
            missedChars,
            extraChars,
            graphData
          }
) => {

  let timeSet = new Set();
  const newGraph = graphData.filter(points => {
    if (!timeSet.has(points[0])) {
      timeSet.add(points[0]);
      return points;
    }
  })


  return (
    <div className="stats-box">
      <div className="left-stats">
        <div className="title">WPM</div>
        <div className="subtitle">{wpm}</div>

        <div className="title">Accuracy</div>
        <div className="subtitle">{accuracy}</div>

        <div className="title">Characters</div>
        <div className="subtitle">
          {correctChars}/
          {incorrectChars}/
          {missedChars}/
          {extraChars}
        </div>
      </div>

      <div className="right-stats">
        <Graph graphData={newGraph} />
      </div>
    </div>
  )
}

export default Stats
