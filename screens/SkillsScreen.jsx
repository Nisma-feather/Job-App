import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { useLayoutEffect } from "react";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";

export default function SkillsScreen({ navigation, route }) {
  const [skills, setSkills] = useState([
    {
      skill: "",
      level: "",
    },
  ]);
  const [skillError,setSKillError]=useState([{
    select:"",
    

  }]);

  function handleChange(field, index, value) {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills); // Fix: set newSkills not old skills
  }

  function handleAddInput() {
    const newSkills = [...skills];
    const currentSkill = newSkills[newSkills.length - 1];
  
    // Check if the current skill is filled out before adding another skill
    if (currentSkill.skill.trim() && currentSkill.level) {
      newSkills.push({
        skill: "",
        level: "",
      });
      setSkills(newSkills);
      setSKillError([
        ...skillError,
        {
          select: "",
          
        },
      ]);
    } 
    else {
      
      alert("Please fill out the current skill and select a level before adding another.");
    }
   
    
  }
  useLayoutEffect(() => {
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
     navigation.navigate("Experience", {
      personalData: route.params.personalData,
      educationData: route.params.educationData,
      skillsData: null,
     });
   };
  const validate=()=>{
    let valid=true;
    const newSkillError = [...skillError];
    skills.map((skill,index)=>{
      if(!skill.skill.trim())
        {
          newSkillError[index].select="This field is required"
         valid=false;
        } 
      else{
        newSkillError[index].select=""
       }
       
         });
         setSKillError(newSkillError);
      return valid;
  }
  function handleNextNavigate() {
    if(!validate()){
      console.log(validate());
      return
    }
    navigation.navigate("Experience", {
      personalData: route.params.personalData,
      educationData: route.params.educationData,
      skillsData: skills,
    });
  }
  console.log(skillError);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.title}>Add Your Skills</Text>

        {skills.map((skill, index) => (
          <View key={index} >
          <View  style={styles.card}>
            <TextInput
              placeholder="Enter skill"
              value={skill.skill}
              onChangeText={(value) => handleChange("skill", index, value)}
              style={styles.input}
            />

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={skill.level}
                onValueChange={(value) => {if (!skill.skill.trim()) {
                  const errors=[...skillError];
                  errors[index].select="Enter the Skill first"
                  setSKillError(errors);
                  alert("Please enter the skill name first!");
                  return;
                }else{
                  const errors=[...skillError];
                  errors[index].select=""
                  setSKillError(errors);
                  handleChange("level", index, value)}}}

                style={[
                  styles.picker,
                  skill.level === "beginner"
                  ? styles.blueLabel
                  : skill.level === "intermediate"
                  ? styles.yellowLabel
                  : skill.level === "expert"
                  ? styles.greenLabel
                  : null,
                ]}
              >
                <Picker.Item label="Select level" value="" color="#888" />
                <Picker.Item label="Beginner" value="beginner" />
                <Picker.Item label="Intermediate" value="intermediate" />
                <Picker.Item label="Expert" value="expert" />
              </Picker>
              
              
            </View>
           
          </View>
          <Text style={styles.errorText}>{skillError[index]?.select}</Text>
          
          </View>
        ))}

        <Pressable onPress={handleAddInput} style={styles.iconButton}>
          <Text>Add Another Skill</Text>
          <MaterialIcons name="add-circle" color="#1967d2" size={28} />
        </Pressable>

        <TouchableOpacity style={styles.button} onPress={handleNextNavigate}>
                       <Text style={styles.buttonText}>Continue</Text>
         </TouchableOpacity>
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  wrapper: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  card: {
    marginBottom: 20,
    
    borderRadius: 12,
    padding: 15,
    flexDirection:"row",
    gap:15
  },
  input: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
    width:"75%"
  },
  pickerWrapper: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
    backgroundColor: "#fff",
    overflow: "hidden",
    width:"25%",
    minWidth:"100px",
   
  },
  picker: {
    height: 50,
    width:"100%",
    border:"none",
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  iconButton: {
    marginTop: 10,
    flexDirection:"row",
    justifyContent:"flex-end",
    alignItems:"center",
    gap:10

  },
  blueLabel: {
  backgroundColor: "#e0f2ff",
  color: "#0077cc",
   },
  greenLabel: {
    backgroundColor: "#dcfce7",
    color: "#008000",
},
 yellowLabel: {
  backgroundColor: "#fff9db",
  color: "#cc8500",
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
 errorText:{
   color:"red",
 }



});
