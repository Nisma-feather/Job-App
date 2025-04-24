import { useState } from "react";
import { SafeAreaView,View,TextInput, Pressable,Text,Alert } from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import DatePicker from "react-native-date-picker";
import { auth,db } from "../firebaseConfig";
import { collection,addDoc,setDoc,doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function ExperienceScreen({navigation,route}){
    const [openFromDatePicker, setOpenFromDatePicker] = useState(false);
    const [openToDatePicker, setOpenToDatePicker] = useState(false);
    const [currentExpIndex, setCurrentExpIndex] = useState(0);
    const [experiences,setExperiences]=useState([{
        role:"",
        company:"",
        from:new Date(),
        to:new Date(),
        description:''
    }]);
    const {personalData,educationData,skillsData} = route.params;
    const handleChange=(field,index,value)=>{
        const newExperience=[...experiences];
        newExperience[index][field]=value;
        setExperiences(newExperience);
    }
    const handleAddExperience=()=>{
        setExperiences([...experiences,{role:"",
            company:"",
            from:new Date(),
            to:new Date(),
            descriptIon:''}])
    }
    const handleSubmit=async()=>{
       
         
         
         try{
            // await addDoc(collection(db,'users'),userData);
            // Alert.alert('Success', 'Account created and saved successfully');
            // console.log("Successfull")
            // navigation.navigate('Login');
            const email=personalData.email;
            const password=personalData.password;

            const userCred=await createUserWithEmailAndPassword(auth,email,password);
            const uid=userCred.user.uid;

            await setDoc(doc(db,'users',uid),{
                email,
                role:'jobseeker',
                personalInfo: personalData,
                education: educationData,
                skills: skillsData,
                experiences: experiences,
                createdAt: new Date()
                
            });
            Alert.alert('Success', 'Account created and saved successfully');
            console.log("Successfull")
            navigation.navigate('Login');
            
         }
        catch(error){
            console.error('Error saving to Firestore: ', error);
            Alert.alert('Error', 'Something went wrong while saving your data');
        }
        
    }
    return(
        <SafeAreaView>
          {
            experiences.map((exp,index)=>(
                <View key={index}>
                  <TextInput placeholder="Role/Position" onChangeText={(value)=>handleChange("role",index,value)}/>
                  <TextInput placeholder="Company Name" onChangeText={(value)=>handleChange("company",index,value)}/>
                    {/* <Pressable onPress={()=>{
                        setCurrentExpIndex(index);
                        setOpenFromDatePicker(true);

                    }}>
                        <Text>From:{exp.from.toDateString()}</Text>

                    </Pressable>
                    <Pressable onPress={()=>{
                         setCurrentExpIndex(index)
                         setOpenToDatePicker(true);

                    }
                       
                    }>
                        <Text>To:{exp.to.toDateString()}</Text>
                    </Pressable> */}
                    
                  <TextInput placeholder="Description" onChangeText={(value)=>handleChange("description",index,value)}/>
                </View>
            ))
          }
            <Pressable onPress={handleAddExperience}>
            <MaterialIcons name="add-circle" color="#000" size={24} />
            <Text>Add Another Experience</Text>
            </Pressable>
            <Pressable onPress={handleSubmit} >
            <Feather name="check-circle" color="#fff" size={24} />
            <Text>Submit All Information</Text>
            </Pressable>
            {/* <DatePicker modal open={openFromDatePicker}
            date={experiences[currentExpIndex].from}
            mode="date"
            onConfirm={(date)=>{
                setOpenFromDatePicker(false)
                handleChange("from",currentExpIndex,date);

            }}
            onCancel={()=>{
                setOpenFromDatePicker(false);
            }}/>
            <DatePicker modal open={openToDatePicker}
            mode="date" date={experiences[currentExpIndex].to}
            onConfirm={(date)=>{
                setOpenToDatePicker(false);
                handleChange("to",currentExpIndex,date)

            }}
            onCancel={()=>{
                setOpenToDatePicker(false)
            }}/> */}
        </SafeAreaView>
    )
}