import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import { SafeAreaView, View,TextInput,Pressable } from "react-native";

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
export default function SkillsScreen({navigation,route}){
    const [skills,setSkills]=useState([{
        skill:"",
        level:""
    }])

    function handleChange(field,index,value){
        const newSkills=[...skills];
        newSkills[index][field]=value;
        setSkills(skills);

    }
    function handleAddInput(){
        setSkills([...skills,{ skill:"",
            level:""}])
        }
    function handleNextNavigate(){
        navigation.navigate("Experience",{
            personalData:route.params.personalData,
            educationData:route.params.educationData,
            skillsData:skills

        })
    }
    return(
        <SafeAreaView>
         {
            skills.map((skill,index)=>(
                <View key={index}>
                    <TextInput placeholder="enter skill"
                    onChangeText={(value)=>handleChange("skill",index,value)}/>
                    <Picker selectedValue={skills.level} onValueChange={(value)=>handleChange("level",index,value)}>
                        <Picker.Item label="Beginner" value="beginner"/>
                        <Picker.Item label="Intermediate" value="intermediate"/>
                        <Picker.Item label="Expert" value="expert"/>


                    </Picker>



                </View>
            ))
         }
         <Pressable onPress={handleAddInput}>
             <MaterialIcons name="add-circle" color="#000" size={24} />
         
             
             </Pressable>
         
             <Pressable onPress={handleNextNavigate}>
             <Feather name="arrow-right-circle" color="#000" size={24} />
             </Pressable>
        </SafeAreaView>
    )
}