import React, { useEffect, useState } from 'react';
import { View, Text,Pressable, StyleSheet, SafeAreaView,ScrollView, TextInput, Alert, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const ProjectsScreen = () => {
  const [projects,setProjects]=useState([{
    title:"",
    description:"",
    technologies:"",
    url:""
  }])
  const [loading,setLoading]=useState(false);
  const fetchProjects=async()=>{
    setLoading(true);
    const uid=auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
    if(!uid){
      Alert.alert("No Projects found");
    }
    try{
      const snap=await getDoc(doc(db,'users',uid));
      if(snap.data().projects){
        setProjects(snap.data().projects)
        setLoading(false);
      }
      else{
        setProjects(projects);
        setLoading(false);
      }
    }
    catch(err){
      Alert.alert("error",err.message)
    }
    setLoading(false);
   
  }

  useEffect(()=>{
        
       fetchProjects();
  },[])
  

const handlechange=(idx,field,value)=>{
 const newProjects=[...projects];
 newProjects[idx][field]=value;
 setProjects(newProjects);
}
const handleAddProjects=()=>{
  setProjects([...projects,{ title:"",
    description:"",
    technologies:"",
    url:""}]);
}
console.log(projects);
const handlesubmit=async()=>{
  const uid=auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
  if(!uid){
    Alert.alert("No Projects found");
  }
  try{
   await updateDoc(doc(db,'users',uid),{projects:projects});
   console.log("updated successfully");
  }
  catch(err){
    Alert.alert("error",err.message)
  }
}
  return (
    loading ? (<View><ActivityIndicator/></View>):(
      <SafeAreaView>
      <ScrollView>
        {
          projects.map((project,idx)=>{
            return(
              <View key={idx}>
                <Text>Project Title</Text>
                <TextInput value={project.title} onChangeText={(value)=>handlechange(idx,"title",value)}/>
                <Text>Description</Text>
                <TextInput value={project.description} onChangeText={(value)=>handlechange(idx,"description",value)}/>
                <Text>Technologies Used</Text>
                <TextInput value={project.technologies} onChangeText={(value)=>handlechange(idx,"technologies",value)}/>
                <Text>URL</Text>
                <TextInput value={project.url}  onChangeText={(value)=>handlechange(idx,"url",value)}/>
                
              </View>
            )
          })
        }
        <Pressable onPress={handleAddProjects}>
                    <MaterialIcons name="add-circle" color="#1967d2" size={24} />
        </Pressable>
        <Pressable onPress={handlesubmit}><View><Text>submit</Text> </View></Pressable>

      </ScrollView>
    </SafeAreaView>
    )
  
   
   
  );
};

export default ProjectsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});
