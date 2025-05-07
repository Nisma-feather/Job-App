import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { FontAwesome, AntDesign, Entypo } from '@expo/vector-icons';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
export default function SignupScreen({navigation}) {
  const [agree, setAgree] = useState(false);
  const [formData, setFormData] = useState({
    name:"",
    email: "",
    password: "",
    
  });
  const [error,setError]=useState({})

  const toggleCheckbox = () => {
    setAgree(!agree);
  };
  const validate = () => {
    let valid = true;
    const errors = {
      nameError: "",
      emailError: "",
      passwordError: "",
      termsError:""
    };

  
    // Last Name validation
    if (!formData.name.trim()) {
      errors.nameError = "Name is required";
      valid = false;
    }
  
    // Email validation
    if (!formData.email.trim()) {
      errors.emailError = "Email is required";
      valid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.emailError = "Invalid email format";
      valid = false;
    }
  
    // Password validation
    if (!formData.password.trim()) {
      errors.passwordError = "Password is required";
      valid = false;
    } else {
      const passRegex =  /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
      if (!passRegex.test(formData.password)) {
        errors.passwordError =
          "Password must be at least 8 characters and include at least one specialcharacter and one number";
        valid = false;
      }
    }
    if(!agree){
      valid=false
      errors.termsError="Agree to the Tems & Conditions"
    }

    setError(errors);
    return valid;
  };


  return (
    <View style={styles.container}>
      {/* Logo */}
       <View style={styles.logoContainer}>
                <View style={styles.logoOuter}>
                  <MaterialIcons name="double-arrow" color="#fff" size={28} />
                </View>
                <View>
                  <Text style={styles.logoText}>Karier</Text>
                  <Text style={styles.logoSubText}>Job Portal App</Text>
                </View>
      </View>

      <Text style={styles.title}>Create your account</Text>
      <Text style={styles.subtitle}>Welcome back! Please enter your details</Text>

      <Text style={styles.label}>Name<Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input} value={formData.name}
            onChangeText={(val) => setFormData({ ...formData, name: val })} />
      {error.nameError ? (
                <Text style={styles.errorText}>{error.nameError}</Text>
              ) : null}

      <Text style={styles.label}>Email Address <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input}  keyboardType="email-address" 
        value={formData.email}
        onChangeText={(val) => setFormData({ ...formData, email: val })}/>
         {error.emailError ? (
                  <Text style={styles.errorText}>{error.emailError}</Text>
                ) : null}

      <Text style={styles.label}>Password <Text style={styles.required}>*</Text></Text>
      <TextInput style={styles.input}  secureTextEntry 
       value={formData.password}
       onChangeText={(val) => setFormData({ ...formData, password: val })}/>
        {error.passwordError ? (
                 <Text style={styles.errorText}>{error.passwordError}</Text>
               ) : null}

      <View style={styles.checkboxContainer}>
        <TouchableOpacity onPress={toggleCheckbox} style={styles.checkbox}>
          {agree && <Entypo name="check" size={14} color="blue" />}
        </TouchableOpacity>
        <Text style={styles.checkboxText}>I agree to all Term, Privacy and Fees</Text>
        
      </View>
      {error.termsError ? (
                  <Text style={styles.errorText}>{error.termsError}</Text>
                ) : null}

      <TouchableOpacity style={styles.signUpButton} onPress={()=>{
                                        if(!validate()){
                                          return
                                        }
                                        navigation.navigate("Basic Info",{loginData:formData})}}>
        <Text style={styles.signUpButtonText}>Sign Up</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>Or Continue With</Text>

      <View style={styles.socialButtonsContainer}>
        <TouchableOpacity style={[styles.socialButton]}>
          <FontAwesome name="google" size={20} />
          <Text style={styles.socialButtonText}>Sign Up with Google</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.socialButton]}>
          <AntDesign name="apple1" size={20} />
          <Text style={styles.socialButtonText}>Sign Up with Apple</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.footerText}>
        Already have an account? <Text style={styles.signInText}>Sign In</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 24,
    
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'center',
    gap: 10,
    marginVertical:20
  },
  logoOuter: {
    backgroundColor: "#1967d2",
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    color: "#1967d2",
    fontSize: 22,
    fontWeight: "bold",
  },
  logoSubText: {
    color: "#666",
    fontSize: 12,
  },
  
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop:7,
    marginBottom: 24,
  },
  required:{
    color:"#ff2121"
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    backgroundColor: '#e6eefa',

    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  checkbox: {
    height: 20,
    width: 20,
    borderWidth: 2,
    borderColor: '#6d7b9c',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  checkboxText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#4B5563',
  },
  signUpButton: {
    backgroundColor: '#2563EB',
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 16,
  },
  signUpButtonText: {
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
  orText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 16,
  },
  socialButtonsContainer: {
    gap:10,
    marginBottom: 16,  
  },
  socialButton: {
    flex: 1,
    gap:10,
    
    flexDirection:'row',
    borderWidth: 1,
    justifyContent:'center',
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  socialButtonText: {
    fontSize: 14,
    color:'#888',
    fontWeight:600,
    marginTop: 4,
  },
  footerText: {
    textAlign: 'center',
    fontSize: 14,
  },
  signInText: {
    color: '#2563EB',
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
  },
});
