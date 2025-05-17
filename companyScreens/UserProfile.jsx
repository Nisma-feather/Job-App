import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { db } from '../firebaseConfig';
import { View,Text, SafeAreaView, StyleSheet,ImageBackground,Image } from 'react-native';
import { ScrollView } from 'react-native';

const UserProfile = ({route}) => {
    const {uid}=route.params;
    const [profile,setProfile]=useState({});
    console.log(uid);
    const fetchUserData=async()=>{
        if(!uid){
            return
        }
        try{
            const snapdata=await getDoc(doc(db,'users',uid));
            console.log(snapdata.data())
            setProfile(snapdata.data())

        }
        catch(e){

        }
    }
    useEffect(()=>{
        fetchUserData()
    },[])
  return (
   <SafeAreaView style={styles.container}>
    <ScrollView>
        <View style={{ position: 'relative' }}>
                  <ImageBackground
                    source={{
                      uri: "https://media.istockphoto.com/id/511061090/photo/business-office-building-in-london-england.jpg?s=612x612&w=0&k=20&c=nYAn4JKoCqO1hMTjZiND1PAIWoABuy1BwH1MhaEoG6w=",
                    }}
                    style={{ height: 200, width: '100%' }}
                  >
                    <View style={[StyleSheet.absoluteFillObject, { backgroundColor: 'black', opacity: 0.4 }]} />
                  </ImageBackground>
        
                  <View style={styles.whiteContainer}>
                    <Image source={require("../assets/user.png")} style={styles.logo} />
                  </View>
                </View>
                <View>
                    <Text>{profile?.personalData?.name || 'No Name Found'}</Text>
                </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default UserProfile

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
      },
      logo: {
        height: 100,
        width: 100,
        resizeMode: 'contain',
      },
      whiteContainer: {
        position: 'absolute',
       
        top: 150,
        left:50,
        alignSelf: 'center',
        backgroundColor: 'white',
        borderRadius: 8,
        elevation: 5,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
})
