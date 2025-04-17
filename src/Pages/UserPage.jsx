import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebaseConfig";
import { useAuth } from "../context/authContext";

const UserPage = () => {
  const [userData, setUserData] = useState([])
  const { user } = useAuth()

  const fetchUserData = async () => {
    try {
      const resultsRef = collection(db, 'Results');
      const snapshot = await getDocs(resultsRef);

      snapshot.forEach(doc => {
        console.log(doc.data())
      })
    } catch (error) {
      console.error("Error fetching user data: ", error)
    }
  }

  useEffect(() => {
    fetchUserData();
  }, [])

  return (
    <div>
      User Page Init
    </div>
  )
}

export default UserPage
