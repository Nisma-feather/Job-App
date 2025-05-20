import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Pressable, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { getDoc, doc, collection, where, query, getDocs } from 'firebase/firestore';
import JobCard from './JobCard';

const HomeScreen = ({ navigation }) => {
  const [userData, setUserData] = useState({});
  const [recommend, setRecommend] = useState({});
  const [jobs, setJobs] = useState([]);
  const [jobsForYou, setJobsForYou] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const uid = auth.currentUser?.uid;

  const fetchUserData = async () => {
    if (!uid) {
      Alert.alert("User not Found");
      return null;
    }
    try {
      const ref = await getDoc(doc(db, 'users', uid));
      const snapData = ref.data();

      if (!snapData) {
        throw new Error("No user data found");
      }

      return snapData;
    } catch (err) {
      console.error("Error fetching user data:", err);
      setError("Failed to load user data");
      throw err;
    }
  };

  const format = (recommendData = {}) => {
    const newRecommend = { ...recommendData };

    if (newRecommend.experienceLevel) {
      const exp = newRecommend.experienceLevel;
      newRecommend.experienceLevel =
        exp === 'Entry Level' ? '0 - 1 Year' :
          exp === 'Student' ? 'Fresher' :
            exp === 'Mid Level' ? '2-5 Years' :
              'More than 5 Years';
    }

    return newRecommend;
  };

  const fetchRecommendJobs = async (recommendData) => {
    try {
      const jobRef = collection(db, 'jobs');
      const queryConditions = [];

      if (recommendData?.position) {
        queryConditions.push(where('jobrole', '==', recommendData.position));
      }
      if (recommendData?.jobType) {
        queryConditions.push(where('jobType', '==', recommendData.jobType));
      }
      if (recommendData?.experienceLevel) {
        queryConditions.push(where('expYear', '==', recommendData.experienceLevel));
      }

      let jobs = [];

      if (queryConditions.length > 0) {
        const q = query(jobRef, ...queryConditions);
        const querySnapshot = await getDocs(q);
        jobs = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      }

      if (jobs.length === 0 && userData.skills?.length > 0) {
        const skillJobs = await fetchSkillBasedJobs(userData.skills, recommendData);
        jobs = [...jobs, ...skillJobs];
      }

      return jobs;
    } catch (err) {
      console.error('Error fetching recommended jobs:', err);
      throw err;
    }
  };

  const fetchSkillBasedJobs = async (skills, recommendData) => {
    try {
      if (!skills || skills.length === 0) return [];

      const conditions = [
        where('skillsRequired', 'array-contains-any', skills)
      ];

      if (recommendData?.experienceLevel) {
        conditions.push(where('expYear', '==', recommendData.experienceLevel));
      }

      const q = query(collection(db, 'jobs'), ...conditions);
      const querySnapshot = await getDocs(q);

      return querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error('Error fetching skill-based jobs:', err);
      return [];
    }
  };
  console.log(jobsForYou)
  useEffect(() => {
    const fetchData = async () => {
      if (uid) {
        try {
          setLoading(true);
          const userData = await fetchUserData();
          const updatedRecommend = format(userData?.userInterest || {});
          const jobs = await fetchRecommendJobs(updatedRecommend);

          setUserData(userData || {});
          setRecommend(updatedRecommend);
          setJobs(jobs);

          if (userData?.skills?.length > 0) {
            const skillJobs = await fetchSkillBasedJobs(userData.skills, updatedRecommend);
            setJobsForYou(skillJobs);
          }
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [uid]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>{error}</Text>
        <TouchableOpacity onPress={() => window.location.reload()}>
          <Text style={{ color: 'blue' }}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }
  console.log(recommend)
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Top Bar */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, gap: 12 }}>
        <Ionicons name="menu" size={24} />
        <Pressable onPressIn={() => navigation.navigate("Find Job")} style={{ flex: 1, }}>
          <TextInput
            placeholder="Search Jobs..."
            placeholderTextColor="#666"
            
            editable={false}
            style={{

              backgroundColor: 'white',
              borderRadius: 20,
              paddingVertical: 10,
              paddingHorizontal: 12,
              shadowColor:'#000',
              shadowOpacity:0.2,
              shadowOffset:{
                height:1,
                width:0
              },
              shadowRadius:2


            }}
          />
        </Pressable>
        <Ionicons name="notifications-outline" size={24} />
      </View>

      {/* Recommend Job */}
      <View style={{ padding: 16, backgroundColor: '#f2f7fc', paddingRight: 0 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Recommend Job</Text>
          <Text style={{ color: 'blue', paddingRight: 16 }}>See All</Text>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {jobs.map(job => (
            <View style={{ marginRight: 10 }}>
              <JobCard key={job.id} item={job} navigation={navigation} />
            </View>

          ))}
        </ScrollView>
      </View>

      {/* Promo Section */}
      <View style={{
        backgroundColor: '#eaf0ff',
     
        height:120,
        margin: 16,
        borderRadius: 12,
        padding: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <View style={{ flex: 1 }}>
          <Text style={{ fontWeight: 'bold', marginBottom: 8, maxWidth: '70%' }}>
            Boost Your Interview Success with JobBoard Team Tips
          </Text>
          <TouchableOpacity style={{ backgroundColor: '#0a66c2', padding: 8, borderRadius: 8, width: '80%', maxWidth: 120 }}>
            <Text style={{ color: 'white', fontSize: 14, fontWeight: 'bold' }}>Start Preparing</Text>
          </TouchableOpacity>
        </View>
        <Image
          source={require('../assets/working.png')}
          style={{ width: 110, height: 110, resizeMode: 'contain', position: 'absolute', right: 10 }}
        />
      </View>

      {/* Jobs for You */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 13, marginTop: 6 }}>Jobs for you</Text>
        {jobsForYou.map(job => (

          <JobCard key={job.id} item={job} navigation={navigation} />


        ))}
      </View>
    </ScrollView>
  );
};

export default HomeScreen;