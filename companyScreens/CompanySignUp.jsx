import { createUserWithEmailAndPassword } from 'firebase/auth';
import {  setDoc,doc,getFirestore } from 'firebase/firestore';
import React, { useState } from 'react'
import { Alert, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import { Button, TextInput } from 'react-native-web';
import { auth } from '../firebaseConfig';
const db=getFirestore();

const CompanySignUp = ({navigation}) => {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [companyName, setCompanyName] = useState('');
    const [startYear, setStartYear] = useState('');
    const [employeeCount, setEmployeeCount] = useState('');
    const [locations, setLocations] = useState('');
    const [basicInfo, setBasicInfo] = useState('');

    const handleSignup=async()=>{
        try{
            const userCred=await createUserWithEmailAndPassword(auth,email,password);
            const uid=userCred.user.uid;

            await setDoc(doc(db,'users',uid),{
                email,
                role: 'company',
            });
            await setDoc(doc(db, 'companies', uid), {
                uid,
                email,
                companyName,
                startYear,
                employeeCount,
                locations,
                basicInfo
              });

            Alert.alert("Account Created Successfully");
            console.log("Accont created succesffully")
            navigation.replace('CompanyLogin');
        }
        catch(err){
            Alert.alert("Error",err.message)
            console.log(err);

        }

    }

  return (
    <SafeAreaView>
     <View>
     <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />
      <TextInput placeholder="Company Name" value={companyName} onChangeText={setCompanyName} style={styles.input} />
      <TextInput placeholder="Starting Year" value={startYear} onChangeText={setStartYear} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Number of Employees" value={employeeCount} onChangeText={setEmployeeCount} style={styles.input} keyboardType="numeric" />
      <TextInput placeholder="Locations" value={locations} onChangeText={setLocations} style={styles.input} />
      <TextInput placeholder="Basic Information" value={basicInfo} onChangeText={setBasicInfo} style={[styles.input, { height: 80 }]} multiline />

      <Button title='Create Account' onPress={handleSignup}/>

      </View>
    </SafeAreaView>
    
  )
}
const styles=StyleSheet.create({
    input:{

    }
})

export default CompanySignUp
