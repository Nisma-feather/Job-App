import React, { useEffect, useState } from 'react'
import { View,Text, FlatList, Pressable } from 'react-native'
import { auth, db } from '../firebaseConfig';
import { collection, getDocs, query, where } from 'firebase/firestore';

const ViewJobApplications = ({navigation}) => {
    const [joblist,setJobList]=useState();
    const companyUID = auth.currentUser?.uid || "vm5dkIUfk0WxgnXT34QBttxA3kV2";
     const fetchJobList=async()=>{
        try{
            if (!companyUID){
                return
            }
            const q = query(collection(db,'jobs'),where('companyUID','==',companyUID));
            const snapdata=await getDocs(q);
            
             const fetchedJobs=snapdata.docs.map(job=>job.data())
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
    <View>
     <Text>Jobs Posted</Text>
      <FlatList data={joblist}
                renderItem={({item})=><View>
                    <Text>{item.jobrole}</Text>
                    <Text>{item.locations}</Text>
                    <Text>{item.vacancies}</Text>
                    <Pressable onPress={()=>navigation.navigate("Application List")} >
                      <View>
                        <Text>View Applications</Text>
                      </View>
                    </Pressable>
                    </View>}
                    
                     />
    </View>
  )
}

export default ViewJobApplications

const ApplicationsList=()=>{
    return(
        <View>
        <Text>Applications</Text>
    
        </View>
    )
   
}

export  {ApplicationsList}