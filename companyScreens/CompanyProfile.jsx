import React, { useEffect, useState } from 'react'
import { View,Text, ActivityIndicator, StyleSheet } from 'react-native'
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-web';

const CompanyProfile = () => {
  const [profile, setProfile]=useState({});
  const [loading,setLoading]=useState(false);
  const fetchCompanay = async()=>{
    setLoading(true);
    const uid= "vm5dkIUfk0WxgnXT34QBttxA3kV2";
    
    if (!uid) {
      console.warn("No user UID found");
      setLoading(false);
      return;
    }
  
    try {
      const snap = await getDoc(doc(db, 'companies', uid));
      console.log(snap);
      if (snap.exists()) {
        
        setProfile(snap.data());
      } else {
        setProfile(null);
      }
    } catch (error) {
      console.log("Error fetching company:", error);
    }
  
    setLoading(false);

  };
   useEffect(()=>{
    fetchCompanay();
  },[])
console.log(profile)

  return (
    <SafeAreaView>
      {
        loading ? (<View><ActivityIndicator/></View>)
                :(<View style={styles.container}>
                  <Text style={styles.title}>Company Profile</Text>
                  <Text>Name: {profile.companyName}</Text>
                  <Text>Email: {profile.email}</Text>
                  <Text>Established: {profile.startYear}</Text>
                  <Text>Employees: {profile.employeeCount}</Text>
                  <Text>Locations: {profile.locations}</Text>
                  <Text>Info: {profile.basicInfo}</Text>
                </View>)
      }
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 }
});


export default CompanyProfile
