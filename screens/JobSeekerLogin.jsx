import { useState } from "react";
import { Alert, View, Button, SafeAreaView, TextInput  } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db,auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function JobSeekerLoginScreen({navigation}){
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleLogin=async()=>{
        
        try{
            const userCred=await signInWithEmailAndPassword(auth,email,password);
            const uid=userCred.user.uid;
             const userSnap=await getDoc(doc(db,'users',uid));
             if(userSnap.exists()){
                const data= userSnap.data();
                if(data.role !== 'jobseeker'){
                    return
                }
                console.log("Login successfull")
                navigation.replace("JobSeeker Dashboard",{uid:uid})
             }
             else{
                Alert.alert("user not Found")
             }
           
            
        }
        catch(err){
            Alert.alert("Login",err.message,[{
                text:"Create Account",
                onPress:()=>{{navigation.navigate("Personal Information")}}
            },
            {
                 text:"Try Again"
            }
        
        ])
        console.log(err)
        };
    }
    return(
      <SafeAreaView>
        <TextInput placeholder="Email" value={email} onChangeText={setEmail}/>
        <TextInput  value={password} onChangeText={setPassword} secureTextEntry/>
        <Button title="Login" onPress={handleLogin}/>
        <Button title="Signup" onPress={()=>navigation.navigate('Personal Information')}/>
      </SafeAreaView>
    );
}