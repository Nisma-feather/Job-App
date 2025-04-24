import React, { useState } from 'react'
import { SafeAreaView, Text,View,ScrollView, Pressable } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-web';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
const EducaionScreen = ({navigation,route}) => {
    const [educationDetails, setEducationDetails] = useState([{ type: '', name: '', institute: '', percentage: '' }]);
 function handlechange(field,index,value){
    const newEducationalDEtails=[...educationDetails];
    newEducationalDEtails[index][field]=value;
    setEducationDetails(newEducationalDEtails);

 }
 function handleAddEduInput(){
    setEducationDetails([...educationDetails,
        {type: '', name: '', institute: '', percentage: ''}
    ])
 }
 const handleNextNavigate=()=>{
    navigation.navigate("Skills",
       { personalData: route.params.personalData,
        educationData:educationDetails
       }
    )
     console.log(educationDetails);
     console.log(route.params.personalData)
 }

  return (
  <SafeAreaView>
   <ScrollView>
    {
      educationDetails.map((edu,index)=>(
        <View key={index}>
          <Picker selectedValue={edu.type} 
                onValueChange={(val=>handlechange("type",index,val))}>
            <Picker.Item label='Select Education Type' value=""/>
            <Picker.Item label="Diplomo" value="diplomo"/>
            <Picker.Item label="Higher Secondary" value="hsc"/>
            <Picker.Item label="Secondary School (SSLC)" value="sslc"/>
            <Picker.Item label="UG Degree" value="ug_degree"/>
            <Picker.Item label="PG Degree" value="pg_degree"/>

         </Picker>
         <TextInput placeholder='Enter Education Name' onChangeText={(val)=>handlechange("name",index,val)}/>
         <TextInput placeholder='Enter Institute Name' onChangeText={(val)=>handlechange("institute",index,val)}/>
         <TextInput placeholder='Enter percentage/CGPA' onChangeText={(val)=>handlechange("percentage",index,val)}/>
        </View>
      ))
    }
    <Pressable onPress={handleAddEduInput}>
    <MaterialIcons name="add-circle" color="#000" size={24} />

    
    </Pressable>

    <Pressable onPress={handleNextNavigate}>
    <Feather name="arrow-right-circle" color="#000" size={24} />
    </Pressable>
     
   </ScrollView>

  </SafeAreaView>
  )
}

export default EducaionScreen
