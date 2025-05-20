import { useState } from "react";
import { Alert, View, Button, SafeAreaView, TextInput, Text, TouchableOpacity, StyleSheet } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { db, auth } from "../firebaseConfig";
import { doc, getDoc } from "firebase/firestore";

export default function JobSeekerLoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const validate = () => {
    let valid = true;
    if (!email.trim()) {
      valid = false
      setEmailError("Email is Required")
    }
    else {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setEmailError("Invalid email format");
        valid = false;
      }
      else {
        setEmailError("")
      }

    }

    if (!password.trim()) {
      valid = false
      setPasswordError("Password is Required")
    }
    else if (password.length < 8) {
      setPasswordError("Password must be at least 8 characters");
      valid = false;
    }
    else {
      setPasswordError("")
    }

    return valid
  }
  const handleLogin = async () => {
    if (!validate()) return
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
          onPress: () => navigation.replace("SignUp")
        },
        {
          text: "Try Again"
        }
      ]);
      console.log(err);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.logoContainer}>
          <View style={styles.logoOuter}>
            <MaterialIcons name="double-arrow" color="#fff" size={28} />
          </View>
          <View>
            <Text style={styles.logoText}>Karier</Text>
            <Text style={styles.logoSubText}>Job Portal App</Text>
          </View>
        </View>

        <Text style={styles.label}>Email<Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          style={styles.input}
        />
        {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}

          <Text  style={styles.label}>Password<Text style={styles.required}>*</Text></Text>
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
        />
        {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}




      <TouchableOpacity style={styles.LoginButton} onPress={handleLogin}>
        <Text style={styles.LoginButtonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.replace("SignUp")}>
        <Text style={styles.signupText}>Don't have an account? <Text style={{color:'blue'}}> Creat one </Text></Text>
      </TouchableOpacity>

    </View>
      
    </SafeAreaView >
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    justifyContent: 'center'
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    marginVertical: 20,
  },
  logoOuter: {
    backgroundColor: '#1967d2',
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    color: '#1967d2',
    fontSize: 22,
    fontWeight: 'bold',
  },
  logoSubText: {
    color: '#666',
    fontSize: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  required:{
    color:"#ff2121"
  },
  input: {
    backgroundColor: '#e6eefa',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  errorText: {
    color: 'red'
  },
  heading: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 32,
    textAlign: "center",
    color: "#333"
  },
 
  LoginButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    marginVertical:10
  },
  LoginButtonText: {
    color: '#fff',
    fontSize:17,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  signupText: {
    textAlign: "center",
    color: "#444",
    fontSize: 14
  }
});
