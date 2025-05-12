import React, { useEffect, useState, useCallback } from 'react';
import dummyimg from "../assets/icon.png";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
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
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const FindJobScreen = ({navigation}) => {
  const dummyimg = require('../assets/logo.png');
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [originalJobs, setOriginalJobs] = useState([]); // Store original jobs
  const [originalCompanies, setOriginalCompanies] = useState([]); // Store original companies
  const [showFilter, setShowFilters] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [expFilter, setExpFilter] = useState([]);
  const [jobTypeFilter, setJobTypeFilter] = useState([]);
  const [jobModeFilter, setJobModeFilter] = useState([]);
  const [bookmarkJobs, setBookmarkJobs] = useState([]);
  const [options, setOptions] = useState("companies");
  const [showOption, setShowOption] = useState(false);
  const [companyList, setCompanyList] = useState([]);
  const [searchTimeout, setSearchTimeout] = useState(null);

  const optionData = ["jobs", 'companies'];
  const expYeardata = ['Fresher', '0 - 1 year', '2-5 Years', 'More than 5 Years', 'More than 10 Years'];
  const JobTypedata = ['Full Time', 'Part Time', 'Internship'];
  const JobModedata = ['Hybrid', 'Remote', 'Offline'];
  const uid = auth.currentUser?.uid;

  // Fetch bookmarks
  const fetchBookMarks = async () => {
    const q = query(collection(db, 'bookmarks'), where("userId", "==", uid));
    const bookmarkSnap = await getDocs(q);
    const bookmarks = bookmarkSnap.docs.map((bookmark) => bookmark.data().jobId);
    setBookmarkJobs(bookmarks);
  };

  // Fetch jobs with original data storage
  const fetchJobs = async () => {
    try {
      const q = collection(db, 'jobs');
      const querySnap = await getDocs(q);
      const fetchedJobs = [];
      querySnap.forEach((doc) => {
        fetchedJobs.push({ id: doc.id, ...doc.data() });
      });
      setJobs(fetchedJobs);
      setOriginalJobs(fetchedJobs); // Store original data
      setFilteredJobs(fetchedJobs);
    } catch (e) {
      console.log(e);
    }
  };

  // Fetch companies with original data storage
  const fetchCompanies = async () => {
    const ref = collection(db, 'companies');
    const snapData = await getDocs(ref);
    const fetchedCompanies = [];
    snapData.forEach((docs) => {
      fetchedCompanies.push({ id: docs.id, ...docs.data() });
    });
    setCompanyList(fetchedCompanies);
    setOriginalCompanies(fetchedCompanies); // Store original data
  };

  useEffect(() => {
    if (options === 'jobs') {
      fetchJobs();
    } else if (options === 'companies') {
      fetchCompanies();
    }
    fetchBookMarks();
  }, [uid, options]);

  // Debounced search handler
  const handlesearch = (value) => {
    setSearchQuery(value);
    
    // Clear previous timeout
    if (searchTimeout) clearTimeout(searchTimeout);
    
    // Set new timeout
    setSearchTimeout(setTimeout(() => {
      if (value === '') {
        // Reset to original data when search is cleared
        if (options === 'jobs') {
          setFilteredJobs(originalJobs);
        } else {
          setCompanyList(originalCompanies);
        }
      } else {
        applyFilters();
      }
    }, 300));
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

  // Improved applyFilters function
  const applyFilters = useCallback(() => {
    if (options === 'jobs') {
      let updatedJobs = [...originalJobs]; // Always filter from original data

      // Apply search filter
      if (searchQuery) {
        updatedJobs = updatedJobs.filter((job) =>
          job.jobrole?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply location filter
      if (locationQuery) {
        updatedJobs = updatedJobs.filter((job) =>
          job.locations?.toLowerCase().includes(locationQuery.toLowerCase())
        );
      }

      // Apply experience filter
      if (expFilter.length > 0) {
        updatedJobs = updatedJobs.filter((job) => expFilter.includes(job.expYear));
      }

      // Apply job type filter
      if (jobTypeFilter.length > 0) {
        updatedJobs = updatedJobs.filter((job) => jobTypeFilter.includes(job.jobType));
      }

      // Apply job mode filter
      if (jobModeFilter.length > 0) {
        updatedJobs = updatedJobs.filter((job) => jobModeFilter.includes(job.jobMode));
      }

      setFilteredJobs(updatedJobs);
    } else if (options === 'companies') {
      let updatedCompanies = [...originalCompanies]; // Always filter from original data

      // Apply search filter
      if (searchQuery) {
        updatedCompanies = updatedCompanies.filter((company) =>
          company.companyName?.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }

      // Apply location filter
      if (locationQuery) {
        updatedCompanies = updatedCompanies.filter((company) =>
          company.locations?.toLowerCase().includes(locationQuery.toLowerCase())
        );
      }

      setCompanyList(updatedCompanies);
    }
  }, [options, originalJobs, originalCompanies, searchQuery, locationQuery, expFilter, jobTypeFilter, jobModeFilter]);

  const handleApplyFilters = () => {
    applyFilters();
    setShowFilters(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setSearchQuery('');
    setLocationQuery('');
    setExpFilter([]);
    setJobTypeFilter([]);
    setJobModeFilter([]);
    
    if (options === 'jobs') {
      setFilteredJobs(originalJobs);
    } else {
      setCompanyList(originalCompanies);
    }
  };

  // ... rest of your component code (styles, render method, etc.)
  
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
    companyCard:{
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
    jobTitle: {
      fontSize: 15,
      fontWeight: '700',
      color: '#555',
    },
    yearStyle:{
   
        fontSize: 13,
        color: '#666',
        color:"#5c88ea",
        marginBottom: 4,
      
    },
    logo: {
      flexDirection:'row',
      width: 50,
      height: 50,
      
    }
  });

console.log(companyList)
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
              placeholder={options==='jobs'?'Search Jobs':'Search Companies'}
              value={searchQuery}
              onChangeText={handlesearch}
              style={styles.inputField}
            />
            {/* <Pressable 
              onPress={() => setShowFilters(true)} 
              style={{position: 'absolute', right: 10, top: 14}}
            >
              <Ionicons name="options" color="#000" size={24} />
            </Pressable> */}
            <Pressable style={{position: 'absolute', right: 10, top: 14}} onPress={()=>setShowOption(true)}>
              
              <MaterialCommunityIcons name="arrow-down-drop-circle" color="#000" size={24} />
              
            </Pressable>
           
          </View>
          {
              showOption &&
              <View style={{gap:5,backgroundColor:"lightblue",positon:'absolute',width:80,height:'auto',right:10}}>
              {
                optionData.map((option,idx)=>{
                  return(
               
                    <TouchableOpacity key={idx} onPress={()=>{setOptions(option);setShowOption(false)}}>
                      <Text style={{color:'white'}}>{option}</Text>
                    </TouchableOpacity>
                  )
                   
                })
              }
              
            </View>}

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
      {options==='jobs' &&
       
      <View style={styles.listJobs}>
     <FlatList
     data={filteredJobs}
     renderItem={({ item }) => (
       <JobCard item={item} navigation={navigation}/>
      )}
      keyExtractor={(item) => item.id.toString()}
      />
     </View>
  }
   {options==='companies' &&
    <View>
       <FlatList data={companyList}
                  renderItem={({item})=>(
                   <Pressable style={styles.companyCard} onPress={()=>navigation.navigate("Company Page",{
         companyUID:item.id   
                   })}>
                     <View style={{flexDirection:'row',gap:10}}>
                     <View style={{width:40,height:40,borderWidth:1,borderColor:'#dedede',justifyContent:'center',alignItems:'center',borderRadius:6}}>
                               <Image source={dummyimg} style={styles.logo} />
                               </View>
                               
                         <View style={{gap:6}}>
                            <Text style={styles.jobTitle}>{item.companyName}</Text>
                            <Text style={styles.yearStyle}>Established in {item.startYear}</Text>

                         </View>

                     </View>
                            

         

                     
                    
                      <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:"center",height:35,borderTopColor:'#dedede',borderTopWidth:1}}>
          <View style={styles.metaRow}>
            <Entypo name="location-pin" color="#9ca4b5" size={18} />
            <Text style={styles.metaText}>{item.locations}</Text>
          </View>
          

        </View>
                   </Pressable>
                     
                     

                  )
                    
                  }/>
      </View>
   
   }
         

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


