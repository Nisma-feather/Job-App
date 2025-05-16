import React, { useEffect, useState } from 'react'
import {SafeAreaView,View,Text, ActivityIndicator, StyleSheet, ScrollView,Image,Pressable,TextInput,TouchableOpacity} from 'react-native'
import { auth, db } from '../firebaseConfig';
import { doc, getDoc } from 'firebase/firestore';

import { ImageBackground } from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

const CompanyProfile = ({navigation}) => {
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
    <SafeAreaView style={{flex:1,backgroundColor:'white'}}>
      <ScrollView>
         <View style={{flex:1}}>
          <View style={{ position: 'relative' }}>
                    <ImageBackground
                      source={{
                        uri: "https://media.istockphoto.com/id/511061090/photo/business-office-building-in-london-england.jpg?s=612x612&w=0&k=20&c=nYAn4JKoCqO1hMTjZiND1PAIWoABuy1BwH1MhaEoG6w=",
                      }}
                      style={{ height: 200, width: '100%' }}
                    >
                    </ImageBackground>
          
                    <View style={styles.whiteContainer}>
                      <Image source={{uri:require("../assets/logo.png")}} style={styles.logo} />
                    </View>
                    
                    
                  
                  </View>
                  <View style={{padding:20,gap:4}}>
                  <Text style={{marginTop:40,fontSize:16,fontWeight:'bold'}}>{profile.companyName}</Text>
                  <Text>short description</Text>

                  <View style={styles.editContainer}>
      
                    <View>
                    <Text style={styles.subheading}>About</Text>
                    <Text>{profile.basicInfo}</Text>
                    <Text style={styles.subheading}>Website</Text>
                    <Text>{profile.website}</Text>
                    <Text style={styles.subheading} >Location</Text>
                    <Text>{profile.locations}</Text>
                    <Text style={styles.subheading}>Established Year</Text>
                    <Text>{profile.startYear}</Text>
                    <Text style={styles.subheading}>Employee Count</Text>
                    <Text>{profile.employeeCount}</Text>

                    </View>
                     <Pressable onPress={()=>navigation.navigate("Profile edit")}>

                     <Feather name="edit" color="black" size={20} />
                     </Pressable>
                    
                    
                  </View>
                  </View>

                  
                 
             <View>
             
             </View>
        </View>






      </ScrollView>
     
    </SafeAreaView>
  )
}
const styles =  StyleSheet.create({
  container: { padding: 20 },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  whiteContainer: {
    position: 'absolute',
    top: 150,
    left: 30,
    
    backgroundColor: 'white',
    borderRadius: 5,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  logo: {
    height: 90,
    width: 90,
    resizeMode: 'contain',
  },
  subheading:{
    fontWeight:'bold',
    marginTop:10
  },
  editContainer:{
    flexDirection:'row',
    justifyContent:'space-between'
  },
 
})
export default CompanyProfile