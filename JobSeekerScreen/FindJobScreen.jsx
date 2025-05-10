import React, { useEffect, useState } from 'react';
import dummyimg from "../assets/icon.png"
import {
  SafeAreaView,
  Text,
  View,
  TextInput,
  Button,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Pressable,
  ScrollView
} from 'react-native';
import JobCard from './JobCard';
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, query, setDoc, where } from 'firebase/firestore';
import { auth, db } from '../firebaseConfig';
import Entypo from 'react-native-vector-icons/Entypo';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';


const FindJobScreen = ({navigation}) => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [showFilter, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [expFilter, setExpFilter] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [jobModeFilter, setJobModeFilter] = useState([]);
  const [bookmarkJobs,setBookmarkJobs]=useState([]);
  const [options,setOptions] = useState("");
  

  const expYeardata = ['Fresher', '0 - 1 year', '2-5 Years', 'More than 5 Years', 'More than 10 Years'];
  const JobTypedata = ['Full Time', 'Part Time', 'Internship'];
  const JobModedata = ['Hybrid', 'Remote', 'Offline'];
  const uid=auth.currentUser?.uid;

  const fetchBookMarks=async()=>{
    const q=query((collection(db,'bookmarks')),where("userId","==",uid))
    const bookmarkSnap=await getDocs(q);

    const bookmarks=bookmarkSnap.docs.map((bookmark)=>bookmark.data().jobId);
    setBookmarkJobs(bookmarks);

  }

  const fetchJobs = async () => {
    try {
      const q = collection(db, 'jobs');
      const querySnap = await getDocs(q);
      const fetchedJobs = [];
      querySnap.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() });
      });
      // for (const jobDoc of querySnap.docs) {
      //   const jobdata = jobDoc.data();
  
      //   let companyName = 'Unknown Company';
        
  
       
          
      //     const companyRef = doc(db, 'companies', jobdata.companyUID);
      //     console.log(companyRef)
      //     const companySnap = await getDoc(companyRef);
      //     console.log(companySnap.data());
      //     if (companySnap.exists()) {
           
      //       companyName = companySnap.data().companyName || 'Unknown Company';
      //     }
        
  
      //   fetchedJobs.push({ id: jobDoc.id, ...jobdata, companyName });
      // }
      setJobs(fetchedJobs);
      setFilteredJobs(fetchedJobs);
    } catch (e) {
      console.log(e);
    }
  };
 console.log(filteredJobs);
  useEffect(() => {
    fetchJobs();
    fetchBookMarks();
  }, [uid]);

  const handlesearch = (value) => {
    setSearchQuery(value);
    applyFilters();
  };

  const handleLocationSearch = (value) => {
    setLocationQuery(value);
    applyFilters();
  };

  const togglefilters = (filterArray, filterSetter, val) => {
    if (filterArray.includes(val)) {
      filterSetter(filterArray.filter((item) => item !== val));
    } else {
      filterSetter([...filterArray, val]);
    }
  };

  const applyFilters = () => {
    let updatedJobs = [...jobs];

    if (searchQuery) {
      updatedJobs = updatedJobs.filter((job) =>
        job.jobrole?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (locationQuery) {
      updatedJobs = updatedJobs.filter((job) =>
        job.locations?.toLowerCase().includes(locationQuery.toLowerCase())
      );
    }

    if (expFilter.length > 0) {
      updatedJobs = updatedJobs.filter((job) => expFilter.includes(job.expYear));
    }

    if (jobTypeFilter.length > 0) {
      updatedJobs = updatedJobs.filter((job) => jobTypeFilter.includes(job.jobType));
    }

    if (jobModeFilter.length > 0) {
      updatedJobs = updatedJobs.filter((job) => jobModeFilter.includes(job.jobMode));
    }

    setFilteredJobs(updatedJobs);
  };

  const handleApplyFilters = () => {
    applyFilters();
    setShowFilters(false);
  };
  const handletoggleBookmark=async(jobId)=>{
    try
    {
      const q=query(collection(db,'bookmarks'),where('userId','==',uid),where('jobId','==',jobId));
    const bookmarkSnap=await getDocs(q);

    
    if(!bookmarkSnap.empty){
      await deleteDoc(doc(db,'bookmarks',bookmarkSnap.docs[0].id));
      const newBookmark=bookmarkJobs.filter((id)=>id !== jobId);
      setBookmarkJobs(newBookmark)
    }
    else{
      await addDoc(collection(db,'bookmarks'),{userId:uid,jobId});
      setBookmarkJobs([...bookmarkJobs,jobId])
     
    }
  }
  catch(e){
    console.log(e);
  }
  }
  const styles = StyleSheet.create({
    container: {
      padding: 16,
      flex: 1,
      backgroundColor: '#f9f9f9',
    },
    inputContainer: {
      marginBottom: 16,
    },
    inputWrapper: {
      position: 'relative',
      marginBottom: 8,
    },
    inputIcon: {
      position: 'absolute',
      top: 14,
      left: 10,
      zIndex: 2,
    },
    inputField: {
      backgroundColor: "white",
      height: 50,
      width: "100%",
      paddingLeft: 35,
      borderColor: "#dedede",
      borderWidth: 1,
      borderRadius: 6,
    },
    filterButton: {
      backgroundColor: '#0a66c2',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 8,
    },
    filterButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    listJobs: {
      padding: 15,
      marginTop: 16,
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
    filtersContainer: {
      position: "absolute",
      backgroundColor: "white",
      width: "75%",
      height: "100%",
      top: 0,
      right: 0,
      padding: 10,
      zIndex: 10,
    },
    sectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginTop: 12,
    },
    filtersRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    filterOptionButton: {
      padding: 8,
      margin: 4,
      backgroundColor: '#e0e0e0',
      borderRadius: 6,
    },
    filterOptionButtonSelected: {
      backgroundColor: '#4caf50',
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
  });

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{width: "100%"}}>
        <View style={{padding: 10, width: "100%"}}>
          {/* Search Jobs Input */}
          <View style={styles.inputWrapper}>
            <Feather 
              name="search" 
              color="#7196c8" 
              size={20} 
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Search Jobs"
              value={searchQuery}
              onChangeText={handlesearch}
              style={styles.inputField}
            />
            <Pressable 
              onPress={() => setShowFilters(true)} 
              style={{position: 'absolute', right: 10, top: 14}}
            >
              <Ionicons name="options" color="#000" size={24} />
            </Pressable>
          </View>

          {/* Location Input */}
          <View style={styles.inputWrapper}>
            <Ionicons 
              name="location-outline" 
              color="#7196c8" 
              size={20} 
              style={styles.inputIcon}
            />
            <TextInput
              placeholder="Search by Location"
              value={locationQuery}
              onChangeText={handleLocationSearch}
              style={styles.inputField}
            />
          </View>

          {/* Apply Filter Button */}
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>

          {/* Jobs List */}
          <View style={styles.listJobs}>
            <FlatList
              data={filteredJobs}
              renderItem={({ item }) => (
                <JobCard item={item} navigation={navigation}/>
              )}
              keyExtractor={(item) => item.id.toString()}
            />
          </View>

          {/* Filter Panel */}
          {showFilter && (
            <View style={styles.filtersContainer}>
              <Pressable 
                onPress={() => setShowFilters(false)}
                style={styles.closeButton}
              >
                <FontAwesome name="close" color="#000" size={24} />
              </Pressable>

              <Text style={styles.sectionTitle}>Experience</Text>
              <View style={styles.filtersRow}>
                {expYeardata.map((exp) => (
                  <TouchableOpacity
                    key={exp}
                    onPress={() => togglefilters(expFilter, setExpFilter, exp)}
                    style={[
                      styles.filterOptionButton,
                      expFilter.includes(exp) && styles.filterOptionButtonSelected,
                    ]}
                  >
                    <Text>{exp}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Job Type</Text>
              <View style={styles.filtersRow}>
                {JobTypedata.map((type) => (
                  <TouchableOpacity
                    key={type}
                    onPress={() => togglefilters(jobTypeFilter, setJobTypeFilter, type)}
                    style={[
                      styles.filterOptionButton,
                      jobTypeFilter.includes(type) && styles.filterOptionButtonSelected,
                    ]}
                  >
                    <Text>{type}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Text style={styles.sectionTitle}>Job Mode</Text>
              <View style={styles.filtersRow}>
                {JobModedata.map((mode) => (
                  <TouchableOpacity
                    key={mode}
                    onPress={() => togglefilters(jobModeFilter, setJobModeFilter, mode)}
                    style={[
                      styles.filterOptionButton,
                      jobModeFilter.includes(mode) && styles.filterOptionButtonSelected,
                    ]}
                  >
                    <Text>{mode}</Text>
                  </TouchableOpacity>
                ))}
              </View>

              <Button title="Apply Filters" onPress={handleApplyFilters} />
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FindJobScreen;


