import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import Feather from "react-native-vector-icons/Feather";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import { Picker } from "@react-native-picker/picker";

const PersonalInfoScreen = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    gender: "",
  });

  const [error, setError] = useState({
    firstNameError: "",
    lastNameError: "",
    emailError: "",
    passwordError: "",
    genderError: "",
  });

  const validate = () => {
    let valid = true;
    const errors = {
      firstNameError: "",
      lastNameError: "",
      emailError: "",
      passwordError: "",
      genderError: "",
    };
  
    // First Name validation
    if (!formData.firstName.trim()) {
      errors.firstNameError = "First name is required";
      valid = false;
    }
  
    // Last Name validation
    if (!formData.lastName.trim()) {
      errors.lastNameError = "Last name is required";
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
  
    // Gender validation
    if (!formData.gender) {
      errors.genderError = "Please select a gender";
      valid = false;
    }
  
    setError(errors);
    return valid;
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <Text style={styles.title}>Personal Information</Text>

        {/* First Name */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="First Name"
            style={styles.input}
            value={formData.firstName}
            onChangeText={(val) => setFormData({ ...formData, firstName: val })}
          />
        </View>
        {error.firstNameError ? (
          <Text style={styles.errorText}>{error.firstNameError}</Text>
        ) : null}

        {/* Last Name */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            value={formData.lastName}
            onChangeText={(val) => setFormData({ ...formData, lastName: val })}
          />
        </View>
        {error.lastNameError ? (
          <Text style={styles.errorText}>{error.lastNameError}</Text>
        ) : null}

        {/* Email */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            value={formData.email}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
          />
        </View>
        {error.emailError ? (
          <Text style={styles.errorText}>{error.emailError}</Text>
        ) : null}

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            value={formData.password}
            onChangeText={(val) => setFormData({ ...formData, password: val })}
          />
        </View>
        {error.passwordError ? (
          <Text style={styles.errorText}>{error.passwordError}</Text>
        ) : null}

        {/* Gender */}
        <View style={styles.pickerWrapper}>
          <FontAwesome name="venus-mars" size={18} color="#888" style={styles.icon} />
          <Picker
            selectedValue={formData.gender}
            onValueChange={(itemValue) =>
              setFormData({ ...formData, gender: itemValue })
            }
            style={styles.picker}
          >
            <Picker.Item label="Select Gender" value="" />
            <Picker.Item label="Male" value="male" />
            <Picker.Item label="Female" value="female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>
        {error.genderError ? (
          <Text style={styles.errorText}>{error.genderError}</Text>
        ) : null}

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => {
            if (validate()) {
              navigation.navigate("Education", { personalData: formData });
            }
          }}
        >
          <Text style={styles.buttonText}>Continue</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalInfoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollWrapper: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 10,
    elevation: 1,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4f4f4",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
    marginLeft: 10,
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
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
