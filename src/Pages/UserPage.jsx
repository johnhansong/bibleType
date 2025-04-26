import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, orderBy, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/authContext";
import { CircularProgress } from "@mui/material";
import UserTable from "../components/UserTable";
import Graph from '../components/Graph'
import UserInfo from "../components/UserInfo";

const UserPage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const [graphData, setGraphData] = useState([])
  const { user, loading } = useAuth()

  const fetchUserData = async () => {
    try {
      const resultsRef = collection(db, 'Results');
      const filteredResults = query(resultsRef, where('userId', '==', user.uid), orderBy('timeStamp', 'desc'))
      const snapshot = await getDocs(filteredResults);
      let tempData = []
      let tempGraphData = []

      snapshot.forEach(doc => {
        tempData.push(doc.data())
        tempGraphData.push([doc.data().timeStamp.toDate().toLocaleString().split(",")[0],
                            doc.data().wpm])
      })
      setUserData(tempData)
      setGraphData(tempGraphData)

    } catch (error) {
      console.error("Error fetching user data: ", error)
    }
  }

  useEffect(() => {
    if (!loading && user) {
      fetchUserData()
    } else if (!user && !loading) {
      navigate('/')
    }
  }, [user, navigate, loading])



  // Progress Circle if data still loading
  if (loading) {
    return (
      <div className="progress-circle">
        <CircularProgress size={100}/>
      </div>
    );
  }

  // DOM
  return (
    <div>
      <UserInfo totalTests={userData.length}/>
      <div className="graph-user-page">
        <Graph graphData={graphData}/>
      </div>
      <UserTable data={userData}/>
    </div>
  )
}

export default UserPage
