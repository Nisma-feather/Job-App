import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
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
    address: "",
    email: "",
    id: "",
    password: "",
    gender: "",
  });

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
            onChangeText={(val) => setFormData({ ...formData, firstName: val })}
          />
        </View>

        {/* Last Name */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="user" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Last Name"
            style={styles.input}
            onChangeText={(val) => setFormData({ ...formData, lastName: val })}
          />
        </View>

        {/* Email */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="envelope" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Email"
            keyboardType="email-address"
            style={styles.input}
            onChangeText={(val) => setFormData({ ...formData, email: val })}
          />
        </View>

        {/* ID */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="id-card" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="ID"
            style={styles.input}
            onChangeText={(val) => setFormData({ ...formData, id: val })}
          />
        </View>

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="Password"
            style={styles.input}
            secureTextEntry
            onChangeText={(val) => setFormData({ ...formData, password: val })}
          />
        </View>

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

        {/* Continue Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate("Education", { personalData: formData })}
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
    marginBottom: 15,
    elevation: 1,
  },
  icon: {
    marginRight: 8,
   
  },

  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth:0,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 20,
    elevation: 1,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor:"#f4f4f4",
    border:"none",
  },
  button: {
    backgroundColor: "#1967d2",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    elevation: 3,
    shadowColor:"blue",
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
});
