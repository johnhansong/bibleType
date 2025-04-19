import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/authContext";
import { CircularProgress } from "@mui/material";
import UserTable from "../components/UserTable";

const UserPage = () => {
  const navigate = useNavigate()
  const [userData, setUserData] = useState([])
  const { user, loading } = useAuth()

  const fetchUserData = async () => {
    try {
      const resultsRef = collection(db, 'Results');
      const filteredResults = query(resultsRef, where('userId', '==', user.uid))
      const snapshot = await getDocs(filteredResults);
      const tempData = []

      snapshot.forEach(doc => {tempData.push(doc.data())})
      setUserData(tempData)

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
      <div className="progress_circle">
        <CircularProgress />
      </div>
    );
  }

  // DOM
  return (
    <div>
      <UserTable data={userData}/>
    </div>
  )
}

export default UserPage
