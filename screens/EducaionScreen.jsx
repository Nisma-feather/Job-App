import React, { useState } from 'react'
import { SafeAreaView, Text, View, ScrollView, Pressable, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-web';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import Feather from 'react-native-vector-icons/Feather';
import { TouchableOpacity } from 'react-native';
const EducaionScreen = ({ navigation, route }) => {
   const [educationDetails, setEducationDetails] = useState([{ type: '', name: '', institute: '', percentage: '' }]);
   const [errors,setErrors]=useState([{}]);

   const validate=()=>{
      let valid=true;
      const newerrors=educationDetails.map((edu)=>{
         const errors={
            typeError:"",
            nameError:"",
            instituteError:"",
            percentageError:""
         }
         if(!edu.type.trim()){
            errors.typeError="This Field is Required"
         }
         if(!edu.name.trim()){
            errors.nameError="This Field is Required"
         }
        if(!edu.institute.trim()){
           errors.instituteError="This Field is Required"
         }
         if(edu.percentage.trim()){
            if(!(edu.percentage >=1 && edu.percentage<=100)){
                  errors.percentageError="cgpc/percenteage must be a valid number"
            }
         }
         return errors;
      })
      
     setErrors(newerrors);
     return valid;

   }
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
   React.useLayoutEffect(() => {
      navigation.setOptions({
        headerRight: () => (
          <TouchableOpacity 
            onPress={handleSkip}
            style={styles.skipButton}
          >
            <Text style={styles.skipText}>Skip</Text>
          </TouchableOpacity>
        ),
      });
    }, [navigation]);
  const handleSkip = () => {
   // Pass just the personal data with empty education data
   navigation.navigate("Skills", {
     ...route.params, // Personal data
     educationData: null // Or empty object {} if SkillsScreen expects it
   });
 };

   const handleNextNavigate = () => {
      if(!validate()){
         return
      }
      navigation.navigate("Skills",
         {
            personalData: route.params.personalData,
            educationData: educationDetails
         }
      )
      console.log(educationDetails);
      console.log(route.params.personalData)
   }
   const handleDelete=(index)=>{
     const   filterEducation=educationDetails.filter((edu,idx)=>idx !==index)
     setEducationDetails(filterEducation)
   }

   return (
      <SafeAreaView style={styles.container}>
         <ScrollView contentContainerStyle={styles.scrollWrapper}>
            <Text style={styles.title}>Education Details</Text>

            {
               educationDetails.map((edu, index) => (
                  <View key={index} style={{ position: "relative" }}>
                     <Text style={styles.subheading}>Education {index + 1}</Text>
                     {index===0?null:<Pressable onPress={()=>handleDelete(index)}><Foundation name="trash" color="#1967d2" size={24} /></Pressable>}
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
                     {errors[index]?.typeError?<Text style={styles.errorText}>{errors[index].typeError}</Text>:null}

                     <View style={styles.inputWrapper}>
                        <TextInput placeholder='Enter Education Name' style={styles.input} onChangeText={(val) => handlechange("name", index, val)} />
                        
                     </View>
                     {errors[index]?.nameError ?<Text style={styles.errorText}>{errors[index].nameError}</Text>:null}
                     <View style={styles.inputWrapper}>
                        <TextInput placeholder='Enter Institute Name' style={styles.input} onChangeText={(val) => handlechange("institute", index, val)} />
                       
                     </View>
                     {errors[index]?.instituteError?<Text style={styles.errorText}>{errors[index].instituteError}</Text>:null}
                     <View style={styles.inputWrapper}>
                        <TextInput placeholder='Enter percentage/CGPA' style={styles.input} onChangeText={(val) => handlechange("percentage", index, val)} />

                     </View>
                     {errors[index]?.percentageError?<Text style={styles.errorText}>{errors[index].percentageError}</Text>:null}
                  </View>
               ))
            }
            <View style={styles.addContainer}>
               <Text>Add Education</Text>
               <Pressable onPress={handleAddEduInput}>
                  <MaterialIcons name="add-circle" color="#1967d2" size={24} />


               </Pressable>

            </View>


            <TouchableOpacity style={styles.button} onPress={handleNextNavigate}>
               <Text style={styles.buttonText}>Continue</Text>
            </TouchableOpacity>

         </ScrollView>

      </SafeAreaView>
   )
}

export default EducaionScreen

const styles = StyleSheet.create({
   container: {
      flex: 1,
      backgroundColor: "#fff",
   },
   errorText:{
      color:"red"
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