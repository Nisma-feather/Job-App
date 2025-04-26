import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, View, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-web';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EducationScreen = ({navigation}) => {
  const [educationDetails, setEducationDetails] = useState([{ type: '', name: '', institute: '', percentage: '' }]);
     function handlechange(field, index, value) {
        const newEducationalDEtails = [...educationDetails];
        newEducationalDEtails[index][field] = value;
        setEducationDetails(newEducationalDEtails);
  
     }
     function handleAddEduInput() {
        setEducationDetails([...educationDetails,
        { type: '', name: '', institute: '', percentage: '' }
        ])
     }
     const fetchEducation=async()=>{
        const uid=auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
        
        try{
            const snap=await getDoc(doc(db,'users',uid));
            const data=snap.data().education;
            console.log(data);
            setEducationDetails(data)
        }
        catch(err){
            Alert.alert("error",err.mesage)
        }

     }
     const handleEducationUpdate=async()=>{
        const uid=auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
        try{
            const userRef = doc(db, "users", uid);
            await updateDoc(userRef, {education:educationDetails});
            Alert.alert("Education Details Updated");
            navigation.navigate("ProfileHome")
            
        }
        catch(err){
          Alert.alert("error updating",'err.message');
        }
     }

     useEffect(()=>{
        fetchEducation();
     },[])
    
  
     return (
        <SafeAreaView style={styles.container}>
           <ScrollView contentContainerStyle={styles.scrollWrapper}>
              <Text style={styles.title}>Education Details</Text>
  
              {
                 educationDetails.map((edu, index) => (
                    <View key={index} style={{ position: "relative" }}>
                       <Text style={styles.subheading}>Education {index + 1}</Text>
                       <View style={styles.pickerWrapper}>
                          <Picker selectedValue={edu.type} style={styles.picker}
                             onValueChange={(val => handlechange("type", index, val))}>
                             <Picker.Item label='Select Education Type' value="" />
                             <Picker.Item label="Diplomo" value="diplomo" />
                             <Picker.Item label="Higher Secondary" value="hsc" />
                             <Picker.Item label="Secondary School (SSLC)" value="sslc" />
                             <Picker.Item label="UG Degree" value="ug_degree" />
                             <Picker.Item label="PG Degree" value="pg_degree" />
  
                          </Picker>
                       </View>
  
                       <View style={styles.inputWrapper}>
                          <TextInput placeholder='Enter Education Name' value={edu.name} style={styles.input} onChangeText={(val) => handlechange("name", index, val)} />
                       </View>
                       <View style={styles.inputWrapper}>
                          <TextInput placeholder='Enter Institute Name' value={edu.institute}  style={styles.input} onChangeText={(val) => handlechange("institute", index, val)} />
                       </View>
                       <View style={styles.inputWrapper}>
                          <TextInput placeholder='Enter percentage/CGPA' value={edu.percentage} style={styles.input} onChangeText={(val) => handlechange("percentage", index, val)} />
                       </View>
                    </View>
                 ))
              }
              <View style={styles.addContainer}>
                 <Text>Add Education</Text>
                 <Pressable onPress={handleAddEduInput}>
                    <MaterialIcons name="add-circle" color="#1967d2" size={24} />
  
  
                 </Pressable>
  
              </View>
  
  
              <TouchableOpacity style={styles.button} onPress={handleEducationUpdate}>
                 <Text style={styles.buttonText}>Update</Text>
              </TouchableOpacity>
  
           </ScrollView>
  
        </SafeAreaView>
     )
  }
  
  export default EducationScreen;
  
  const styles = StyleSheet.create({
     container: {
        flex: 1,
        backgroundColor: "#fff",
     },
     scrollWrapper: {
        padding: 20,
     },
     title: {
        fontSize: 20,
        fontWeight: "600",
        textAlign: "center",
        marginVertical: 20,
     },
     inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 15,
        elevation: 1,
     },
     icon: {
        marginRight: 8,
  
     },
  
     input: {
        flex: 1,
        paddingVertical: 12,
        fontSize: 14,
        borderWidth: 0,
     },
     pickerWrapper: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
        borderRadius: 12,
        paddingHorizontal: 12,
        marginBottom: 20,
        elevation: 1,
  
     },
     picker: {
        flex: 1,
        height: 50,
        backgroundColor: "#f4f4f4",
        border: "none",
     },
     button: {
        backgroundColor: "#1967d2",
        borderRadius: 20,
        paddingVertical: 14,
        alignItems: "center",
        marginTop: 20,
        elevation: 3,
        shadowColor: "blue",
        shadowOffset: {
           width: 0,
           height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
  
        elevation: 5,
     },
     buttonText: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 16,
     },
     addContainer: {
        flexDirection: 'row',
        gap: 10,
        justifyContent:'flex-end'
  
     },
     subheading:{
        fontWeight:"bold",
        marginVertical:10,
        fontSize:15,
        marginLeft:12
     }
  
  })
