import { useState } from "react";
import { Alert, View, Button, SafeAreaView, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function JobSeekerLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
 const [emailError,setEmailError]=useState("");
 const [passwordError,setPasswordError]=useState("");
  const validate=()=>{
    let valid=true;
    if(!email.trim()){
        valid=false
        setEmailError("Email is Required")
    }
    else{
       const  emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
          setEmailError("Invalid email format");
          valid = false;
        }
        else{
            setEmailError("")
        }
      
    }
    
    if(!password.trim()){
        valid=false
        setPasswordError("Password is Required")  
    }
    else if (password.length < 8) {
        setPasswordError("Password must be at least 8 characters");
        valid = false;
      }
    else{
        setPasswordError("")
    }

  return valid
  }
  const handleLogin = async () => {
    if(!validate()) return
    try {
      const userCred = await signInWithEmailAndPassword(auth, email, password);
      const uid = userCred.user.uid;

      const userSnap = await getDoc(doc(db, 'users', uid));
      if (userSnap.exists()) {
        const data = userSnap.data();
        if (data.role !== 'jobseeker') {
          Alert.alert("Access Denied", "You're not authorized as a job seeker.");
          return;
        }
        console.log("Login successful");
        navigation.replace("JobSeeker Dashboard", { uid: uid });
      } else {
        Alert.alert("User not found");
      }
    } catch (err) {
      Alert.alert("Login Failed", err.message, [
        {
          text: "Create Account",
          onPress: () => navigation.navigate("Personal Information")
        },
        {
          text: "Try Again"
        }
      ]);
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.heading}>Job Seeker Login</Text>
       <View style={{}}>
       <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={styles.input}
      />
      {emailError?<Text style={styles.errorText}>{emailError}</Text>:null}

       </View>
       <View style={{}}>
       <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
       {passwordError?<Text style={styles.errorText}>{passwordError}</Text>:null}

       </View>
     

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
        <Text style={styles.loginText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Personal Information")}>
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
    backgroundColor: "#f5f5f5"
  },
 labelContainer:{
 
  },
  errorText:{
      color:'red'
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#333"
  },
  input: {
    height: 50,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#ccc"
  },
  loginButton: {
    backgroundColor: "#1967d2",
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 20
  },
  loginText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600"
  },
  signupText: {
    textAlign: "center",
    color: "#0066cc",
    fontSize: 14
  }
});
