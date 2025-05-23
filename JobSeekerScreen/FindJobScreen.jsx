import React, { useEffect, useState, useCallback } from 'react';

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
      backgroundColor: '#fff',
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
      backgroundColor: "#fff",
      height: 50,
      width: "100%",
      paddingLeft: 35,
      borderColor: "#dedede",
      borderWidth: 1,
      borderRadius: 6,
      shadowColor:'#000',
      shadowOffset:{
        width:0,
        height:1
      },
      shadowRadius:2,
      shadowOpacity:0.2,
     
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
    filterOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0,0,0,0.5)',
      zIndex: 10,
    },
    filtersContainer: {
      position: 'absolute',
      right: 0,
      top: 0,
      width: '75%',
      height: '100%',
      backgroundColor: 'white',
      padding: 20,
      zIndex: 20,
      elevation: 20, // for Android
    },
    applyButton: {
      backgroundColor: '#0a66c2',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 20,
    },
    resetButton: {
      backgroundColor: '#f0f0f0',
      padding: 12,
      borderRadius: 6,
      alignItems: 'center',
      marginTop: 10,
    },
    buttonText: {
      color: 'white',
      fontWeight: 'bold',
    },
    resetButtonText: {
      color: '#333',
      fontWeight: 'bold',
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
      backgroundColor: 'rgb(232, 240, 251)',
      borderRadius: 6,
    },
    filterOptionButtonSelected: {
      backgroundColor: 'rgb(37, 99, 235)',
    },
    closeButton: {
      alignSelf: 'flex-end',
      marginBottom: 10,
    },
    companyCard:{
        padding: 10,
        borderRadius: 6,
        backgroundColor: '#fff',
        shadowColor:'#000',
        shadowOffset:{
          width:0,
          height:1
        },
        shadowRadius:5,
        shadowOpacity:0.2,
        elevation:2,
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
      
    },
    filterButtonTextSelected:{
      color:"white"
    },
    filteredButtonText:{
      color:'black'
    }
  });

console.log(companyList)
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={{width: "100%"}}>
        <View style={{padding: 10, width: "100%"}}>
          {/* Search Jobs Input */}
          <View style={styles.inputContainer}>
  <View style={styles.inputWrapper}>
    <Ionicons name="search" size={20} color="#555" style={styles.inputIcon} />
    <TextInput
      placeholder={options==='jobs'?'search jobs':'search companies'}
      style={styles.inputField}
      value={searchQuery}
      onChangeText={handlesearch}
    />
    <TouchableOpacity style={{right:15,top:10,position:'absolute'}}   onPress={() => setShowOption(!showOption)}> <Entypo name={showOption ? "chevron-up" : "chevron-down"} size={20} /></TouchableOpacity>
  </View>

  <View style={styles.inputWrapper}>
    <Feather name="map-pin" size={20} color="#555" style={styles.inputIcon} />
    <TextInput
      placeholder="Location"
      style={styles.inputField}
      value={locationQuery}
      onChangeText={handleLocationSearch}
    />
  </View>

 
 

  {/* Dropdown options */}
  {showOption && (
    <View style={{position:'absolute', top:30,right:10,width:200,height:120,
      padding:5,backgroundColor:'#f7f7f7'
    }}>
      {optionData.map((item, index) => (
        <Pressable
          key={index}
          onPress={() => {
            setOptions(item);
            setShowOption(false);
          }}
          style={styles.dropdownItem}
        >
          <Text style={{textAlign:'center'}}>{item}</Text>
        </Pressable>
      ))}
    </View>
  )}
</View>

          {/* Apply Filter Button */}
        {options==='jobs' &&  <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setShowFilters(true)}
          >
            <Text style={styles.filterButtonText}>Apply Filters</Text>
          </TouchableOpacity>}
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
            <>
            <Pressable 
              style={styles.filterOverlay}
              onPress={() => setShowFilters(false)}
            />
            
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
                    <Text style={[styles.filteredButtonText, expFilter.includes(exp) && styles.filterButtonTextSelected]}>
                      {exp}
                    </Text>
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
                    <Text style={[styles.filteredButtonText, jobTypeFilter.includes(type) && styles.filterButtonTextSelected]}>
                      {type}
                    </Text>
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
                    <Text style={[styles.filteredButtonText, jobModeFilter.includes(mode) && styles.filterButtonTextSelected]}>
                      {mode}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
    
              <TouchableOpacity 
                style={styles.applyButton} 
                onPress={handleApplyFilters}
              >
                <Text style={styles.buttonText}>Apply Filters</Text>
              </TouchableOpacity>
              
              <TouchableOpacity 
                style={styles.resetButton} 
                onPress={resetAllFilters}
              >
                <Text style={styles.resetButtonText}>Reset Filters</Text>
              </TouchableOpacity>
            </View>
            </>
            
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default FindJobScreen;


