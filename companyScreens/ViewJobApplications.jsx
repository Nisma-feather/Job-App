import React, { useEffect, useState } from 'react'
import { View,Text, FlatList, Pressable,TouchableOpacity,SafeAreaView,ScrollView,Image, } from 'react-native'
import { useNavigation } from '@react-navigation/native';
import { Ionicons, Feather, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { StyleSheet } from 'react-native';

const formatDate = (date) => {
  const posted = date.toDate();
  const now = new Date();
  const diffDate = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
  if (diffDate === 0) {
      const diffHour = Math.floor((now - posted) / (100 * 60 * 60));
      if (diffHour === 0) {
          const diffMinute = Math.floor((now - posted) / (1000 * 60))
          return diffMinute === 1 ? '1 min ago' : `${diffMinute}mins ago`
      }
      return diffHour === 1 ? '1 hr ago' : `${diffHour}hrs ago`

  }
  return diffDate === 1 ? '1 day ago' : `${diffDate}days ago`
}
const ViewJobApplications = ({navigation}) => {
    const [joblist,setJobList]=useState();
    const companyUID = "vm5dkIUfk0WxgnXT34QBttxA3kV2";
    console.log(companyUID)
     const fetchJobList=async()=>{
        try{
            if (!companyUID){
                return
            }
            const q = query(collection(db,'jobs'),where('companyUID','==',companyUID));
            const snapdata=await getDocs(q);
            
             const fetchedJobs=snapdata.docs.map(job=>({id:job.id,...job.data()}))
             setJobList(fetchedJobs)
        }
        catch(e){
            console.log(e);
        }
     }
    
     useEffect(()=>{
        fetchJobList()
     },[])
     console.log(joblist)
  return (
    <SafeAreaView style={styles.container}>
                <ScrollView style={{ padding: 15 }}>
                    <View>
                        <Text style={styles.heading}>
                            Recently Posted Job
                        </Text>
                        <View>
                            <FlatList data={joblist}
                                renderItem={({ item }) => (
                                    <View style={styles.jobCard}>
                                        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
                                            <Text style={styles.jobTitle}>{item.jobrole}</Text>
                                            <View style={styles.metaRow}>
                                                
                                               <Pressable style={styles.buttonContainer} onPress={()=>{
                                                console.log(item.id)
                                                navigation.navigate("Application List",{JobId:item.id})

                                               }}>
                                                 <Text style={styles.buttonText}>View Application</Text>
                                               </Pressable>
                                                
                                                
                                            </View>
    
                                        </View>
    
    
    
                                        <View style={styles.bottomcard}>
                                            <View style={styles.metaRow}>
                                                <Entypo name="location-pin" color="#9ca4b5" size={18} />
                                                <Text style={styles.metaText}>{item.locations}</Text>
                                            </View>
                                            <Text style={styles.metaText}>{formatDate(item.postedAt)}</Text>
    
                                        </View>
    
                                    </View>
                                )}
                                ItemSeparatorComponent={() => <View style={styles.jobContainer}></View>} />
    
                        </View>
                    </View>
    
                </ScrollView>
            </SafeAreaView>
    
                    
                  
  )
}

export default ViewJobApplications

const ApplicationsList = ({ route }) => {
  const { JobId } = route.params;
  const [applications, setApplications] = useState([]);
  const navigation = useNavigation();

  const fetchApplications = async () => {
    if (!JobId) return;

    try {
      const q = query(collection(db, 'jobApplications'), where('jobId', '==', JobId));
      const snapData = await getDocs(q);
      const appList = snapData.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setApplications(appList);
    } catch (e) {
      console.log('Error fetching applications:', e);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);
console.log(applications)
  const renderItem = ({ item }) => (
    <View style={styles.card}>
    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
      <View>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.label}>Website:</Text>
      <Text style={styles.website}>{item.website}</Text>
      <Text style={styles.label}>Cover Letter:</Text>
      <Text style={styles.coverLetter}>{item.coverLetter}</Text>

      </View>
      <Text>Applied {formatDate(item.submittedAt)}</Text>
      
    </View>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('User Profile', { uid: item.userId })}
      >
        <Text style={styles.buttonText}>View Full Profile</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Applications</Text>
      <FlatList
        data={applications}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

export  {ApplicationsList}

const styles=StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'
},
button: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical: 10
},
buttonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
},
heading: {
    fontWeight: 'bold',
    fontSize: 14,
    marginVertical: 10,
},
jobCard: {
    // backgroundColor: '#e6eefa',
    padding: 16,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: '#2563EB',
    shadowColor: '#2563EB',
    shadowOffset: {
        width: 0,
        height: 4,
    },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6, // For Android
},
jobTitle: {
    fontWeight: 'bolder',
    color: "#555"
},
jobContainer: {
    height: 15
},
metaRow: {
    flexDirection: 'row',
    gap: 3
},
metaText: {
    fontSize: 11,
    color: '#333',

},
bottomcard: {
    borderTopColor: '#2563EB',
    marginTop: 15,
    paddingTop: 5,
    flexDirection: 'row',
    justifyContent: 'space-between'
},
buttonContainer:{
backgroundColor:"#2563EB",
paddingVertical:12,
paddingHorizontal:8,
borderRadius:10
},
buttonText:{
   color:'white',
   fontWeight:"bold"
},
heading: {
  fontSize: 28,
  fontWeight: '700',
  marginBottom: 20,
  color: '#1F2937',
  textAlign: 'center',
},
list: {
  paddingBottom: 20,
},
card: {
  backgroundColor: '#ffffff',
  borderRadius: 16,
  padding: 20,
  marginBottom: 16,
  shadowColor: '#000',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
},
name: {
  fontSize: 22,
  fontWeight: 'bold',
  color: '#111827',
  marginBottom: 12,
},
label: {
  fontSize: 16,
  fontWeight: '600',
  marginTop: 10,
  color: '#374151',
},
website: {
  color: '#3B82F6',
  fontSize: 16,
  marginTop: 4,
  textDecorationLine: 'underline',
},
coverLetter: {
  fontSize: 16,
  color: '#4B5563',
  marginTop: 4,
  lineHeight: 22,
},
button: {
  marginTop: 20,
  backgroundColor: '#2563EB',
  paddingVertical: 12,
  borderRadius: 12,
  alignItems: 'center',
},
buttonText: {
  color: '#fff',
  fontWeight: '600',
  fontSize: 16,
},
})