import React, { useEffect, useState } from 'react';
import { View, Text, Image, Pressable, StyleSheet } from 'react-native';
import { Ionicons, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig'; // Adjust the path as needed
import {
  collection, query, where, getDocs, addDoc, deleteDoc, doc
} from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';

const dummyimg = require('../assets/logo.png'); // Replace with actual image path

const JobCard = ({ item }) => {
  console.log(item)
  const navigation = useNavigation();
  const [bookmarkJobs, setBookmarkJobs] = useState([]);
  const uid = auth.currentUser?.uid;

  const fetchBookMarks = async () => {
    try {
      const q = query(collection(db, 'bookmarks'), where("userId", "==", uid));
      const bookmarkSnap = await getDocs(q);
      const bookmarks = bookmarkSnap.docs.map((bookmark) => bookmark.data().jobId);
      setBookmarkJobs(bookmarks);
    } catch (e) {
      console.error("Failed to fetch bookmarks:", e);
    }
  };

  const handletoggleBookmark = async (jobId) => {
    try {
      const q = query(
        collection(db, 'bookmarks'),
        where('userId', '==', uid),
        where('jobId', '==', jobId)
      );
      const bookmarkSnap = await getDocs(q);


      if (!bookmarkSnap.empty) {
        await deleteDoc(doc(db, 'bookmarks', bookmarkSnap.docs[0].id));
        const updated = bookmarkJobs.filter((id) => id !== jobId);
        setBookmarkJobs(updated);
      } else {
        await addDoc(collection(db, 'bookmarks'), { userId: uid, jobId });
        setBookmarkJobs([...bookmarkJobs, jobId]);
      }
    } catch (e) {
      console.log("Bookmark toggle error:", e);
    }
  };
  const formatDate = (timeStamp) => {
    if (!timeStamp) return '';
    const postedDate = timeStamp.toDate();
    const now = new Date();
    const differenceDate = Math.floor((now - postedDate) / (1000 * 60 * 60 * 24));


    if (differenceDate === 0) {
      if (diffHours === 0) {
        const diffMinute = Math.flooe((now - postedDate) / (1000 * 60));
        return diffMinute === 1 ? '1 Min ago' : `${diffMinute}s Min ago`
      }
      const diffHours = Math.floor((now - postedDate) / (1000 * 60 * 60))
      return diffHours === 1 ? '1 Hour ago' : `${diffHours}Hour ago`
    }
    return differenceDate === 1 ? '1 Day ago' : `${differenceDate} Days ago`

  }
  useEffect(() => {
    fetchBookMarks();
  }, []);

  return (
    <Pressable onPress={() => navigation.navigate("Job Details", { currentJob: item })}>
      <View style={styles.jobItem}>
      <View style={{flexDirection:'row',justifyContent:'space-between',height:'40%',maxHeight:45}}>
        <View style={{flexDirection:"row",gap:10,}}>
          
            <View style={{width:40,height:40,borderWidth:1,borderColor:'#dedede',justifyContent:'center',alignItems:'center',borderRadius:6,}}>
          <Image source={dummyimg} style={styles.logo} />
          </View>
         
          <View style={{justifyContent:'space-between'}}>
            <Text style={styles.jobTitle}>{item.jobrole}</Text>
            <Text style={styles.companyName}>{item.companyName}</Text>

          </View>

          </View>
          
          <Pressable style={styles.bookmarkIcon} onPress={() => handletoggleBookmark(item.id)}>
            <Ionicons name={bookmarkJobs.includes(item.id) ? "bookmark" : "bookmark-outline"} color="#3a72be"  size={22} />
          </Pressable>

        </View>
        <View style={{flexDirection:'row',gap:8}}>
          <View style={{paddingVertical:5,paddingHorizontal:12,backgroundColor:"#e8f0fb"}}>
           <Text style={{fontWeight:'bold',fontSize:12}}>{item.jobType}</Text>
          </View>
          <View style={{paddingVertical:5,paddingHorizontal:12,backgroundColor:"#e8f0fb"}}>
            <Text style={{fontWeight:'bold',fontSize:12}}>{item.jobMode}</Text>
          </View>
        </View>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center",height:35,borderTopColor:'#dedede',borderTopWidth:1}}>
          <View style={styles.metaRow}>
            <Entypo name="location-pin" color="#9ca4b5" size={18} />
            <Text style={styles.metaText}>{item.locations}</Text>
          </View>
          <Text style={styles.metaText}>
            {formatDate(item.postedAt)}
          </Text>

        </View>
      </View>


    </Pressable>
  );
};

const styles = StyleSheet.create({
  jobItem: {

    padding: 10,
    borderRadius: 6,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 12,
    gap:15
  },
  logo: {
    flexDirection:'row',
    width: 50,
    height: 50,
    borderRadius: 25,
   

    
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  companyName: {
    fontSize: 13,
    color: '#666',
    color:"#5c88ea",
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#7a86a1',
    marginLeft: 4,
  },
  bookmarkIcon: {
   marginRight:8
  },
});

export default JobCard;
