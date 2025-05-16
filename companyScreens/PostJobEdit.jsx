import { doc, getDoc, getDocs } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { Alert, ScrollView } from 'react-native'
import { SafeAreaView, View } from 'react-native'
import { db } from '../firebaseConfig';

const PostJobEdit = ({route,navigation}) => {
    const {JobId}= route.params;
    console.log(JobId);
    const [jobEdit,setJobEdit]=useState({

    })
    const fetchJobDetails=async()=>{
        if(!JobId){
            return
        }
        try{
            const ref=doc(db,'jobs',JobId);
            const Snapdata=await getDoc(ref);
            console.log(Snapdata.data())
            jobEdit(Snapdata.data());
        }
        catch(e){
            Alert.alert("Can't able to fetch the job details")
        }
    }
    useEffect(()=>{
        fetchJobDetails()
    },[])
    console.log(jobEdit)
  return (
   <SafeAreaView>
    <ScrollView>
        <View>

        </View>
    </ScrollView>
   </SafeAreaView>
  )
}

export default PostJobEdit
