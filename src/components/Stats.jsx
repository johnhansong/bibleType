import React, { useEffect } from 'react'
import Graph from './Graph'
import { db, auth } from '../firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { toast } from 'react-toastify';

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

  const pushDatatoDB = async (user) => {
    if(isNaN(accuracy)) {
      toast.error("Invalid test. Results not saved.", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
      return;
    }

    try {
      await addDoc(collection(db, "Results"), {
        wpm: wpm,
        accuracy: accuracy,
        timeStamp: new Date(),
        userId: user.uid
      })
      toast.success("Results saved", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (e) {
      toast.error("Unable to save results", {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {

    const authListenerLimiter = onAuthStateChanged(auth, (user) => {
      if(user) {
        pushDatatoDB(user);
      } else {
        toast.error("Please log in to save your results", {
            position: "top-right",
            autoClose: 4000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
        });
      }
    });

    return () => authListenerLimiter();
  }, [])


  return (
    <div className="stats-box">
      <div className="left-stats">
        <div className="title">WPM</div>
        <div className="subtitle">{wpm}</div>

        <div className="title">Accuracy</div>
        <div className="subtitle">{isNaN(accuracy) ? 0 : accuracy}%</div>

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
