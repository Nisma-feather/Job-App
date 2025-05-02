import React, { useEffect, useState } from 'react'
import { View,Text, ScrollView, StyleSheet,Image,FlatList,Pressable} from 'react-native'
import { auth, db } from '../firebaseConfig'
import { collection, deleteDoc, doc, getDoc, getDocs, query,where } from 'firebase/firestore';
import { SafeAreaView } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import dummyimg from "../assets/icon.png"
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useCallback } from 'react';

const BookMarkScreen = () => {
  const navigation=useNavigation();
  const uid=auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
  console.log(uid);
  const [bookmarks,setBookmarks]=useState([]);
  const fetchBookmarks=async()=>{
try{
  const q=query(collection(db,'bookmarks'),where('userId','==',uid));
const bookmarkSnap=await getDocs(q);

 const bookmarkdatas=[];
const jobIds=bookmarkSnap.docs.map((bookmark)=>bookmark.data().jobId);
for(const jobId of jobIds){
  const ref=doc(db,'jobs',jobId);
  const jobSnap=await getDoc(ref);

  if( jobSnap.exists()){
     const jobData=jobSnap.data();
     let companyName='Unknown Company'
    console.log(jobData.companyUID);
     if(jobData.companyUID){
      const companyRef=doc(db,'companies',jobData.companyUID);
      const companysnap=await getDoc(companyRef);
      const companyName=companysnap.data().companyName || companyName;
     }
     bookmarkdatas.push({id:jobId,...jobData,companyName})
  }
  
}
setBookmarks(bookmarkdatas)
}
catch(e){
  console.log(e);
}
   
  }
const removeBookmark=async(jobId)=>{
    const q=query(collection(db,'bookmarks'),where('userId','==',uid),where('jobId','==',jobId));
    const snapdata=await getDocs(q);
    await deleteDoc(doc(db,'bookmarks',snapdata.docs[0].id));
    const newBookmark=bookmarks.filter((bookmark)=>jobId !==bookmark.id)
    setBookmarks(newBookmark);
}
  console.log(bookmarks)
  useFocusEffect(
  useCallback(() => {
    fetchBookmarks();
  }, [])
);
  return (
    <SafeAreaView>
      <ScrollView>
        
              <View style={styles.listJobs}>
                <FlatList
                  data={bookmarks}
                  renderItem={({ item }) => (
                    <Pressable onPress={()=>navigation.navigate("Job Details",{currentJob:item})}>
                    <View style={styles.jobItem}>
                    <Image source={dummyimg} style={styles.logo} />
                  
                    <View style={{ flex: 1 }}>
                      <Text style={styles.jobTitle}>{item.jobrole}</Text>
                      <Text style={styles.companyName}>{item.companyName}</Text> {/* Replace with dynamic name if added later */}
                  
                      <View style={styles.metaRow}>
                        <Entypo name="location-pin" color="#666" size={18} />
                        <Text style={styles.metaText}>{item.locations}</Text>
                      </View>
                  
                      <View style={styles.metaRow}>
                        <MaterialCommunityIcons name="office-building-outline" color="#666" size={18} />
                        <Text style={styles.metaText}>{item.jobType}</Text>
                      </View>
                    </View>
                  
                    <Pressable style={styles.bookmarkIcon} onPress={()=>removeBookmark(item.id)}>
                      <Ionicons name={bookmarks.some(b => b.id === item.id)?"bookmark":'bookmark-outline'} color="#333" size={22} />
                    </Pressable>
                  </View>
                  </Pressable>
                  )}
                  keyExtractor={(item) => item.id.toString()}
                />
              </View>
      </ScrollView>
    </SafeAreaView>
  )
}

export default BookMarkScreen;
const styles= StyleSheet.create({
  listJobs: {
    padding: 15,
    marginTop:60
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
    alignSelf: 'center',
  },
  
  jobItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
  },
  
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  
  companyName: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  
  metaText: {
    fontSize: 13,
    color: '#555',
    marginLeft: 4,
  },
  
  bookmarkIcon: {
    marginLeft: 10,
    alignSelf: 'flex-start',
  },
})