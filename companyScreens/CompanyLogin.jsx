import { signInWithEmailAndPassword } from 'firebase/auth';
import React, { useState } from 'react'
import { TextInput,SafeAreaView,View, Pressable, Alert,Button,Text} from 'react-native';

import { auth,db } from '../firebaseConfig';
import { doc, getDoc, getFirestore } from 'firebase/firestore';

const CompanyLogin = ({navigation}) => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const handleLogin = async()=>{
       try{
         const userCred=await signInWithEmailAndPassword(auth,email,password);
         const uid=userCred.user.uid;
         const userRef=doc(db,'users',uid);
         const userSnap=await getDoc(userRef);

         if(userSnap.exists()){
        const userData=userSnap.data();
            if(userData.role !== 'company'){
                Alert.alert("Access Denied", "This Account is not Registered as company");
                return 

            }
            console.log("Login Successful")
            navigation.replace("CompanyDashboard",{uid:uid});
         }
         else {
            Alert.alert('Error', 'User role not found.');
          }

       }
       catch(e){
        Alert.alert("Account not created",e.message,[
        {
            text:"create Account",
            onPress:()=>{
                navigation.navigate("CompanySignUp")
            
                    }
         }, 
         {  text:"Try Again"}
        ])
       }
    }
  return (
   <SafeAreaView>
    <View>
        <TextInput onChangeText={setEmail} placeholder='Email' value={email}/>
        <TextInput onChangeText={setPassword} placeholder='Password' value={password} secureTextEntry/>
        <Button onPress={handleLogin} title='Login'/>
        <Text>Don't have an account ?
            <Pressable onPress={()=>navigation.navigate("CompanySignUp")}>
                <Text>Creat one </Text>
            </Pressable>
        </Text>
    </View>
   </SafeAreaView>

  )
}

export default CompanyLogin
