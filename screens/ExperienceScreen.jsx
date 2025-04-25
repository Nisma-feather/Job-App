import { useState } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  Text,
  Alert,
  StyleSheet,
  ScrollView,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import DatePicker from "react-native-date-picker";
import { auth, db } from "../firebaseConfig";
import { setDoc, doc } from "firebase/firestore";
import { createUserWithEmailAndPassword } from "firebase/auth";

export default function ExperienceScreen({ navigation, route }) {
  const [openFromDatePicker, setOpenFromDatePicker] = useState(false);
  const [openToDatePicker, setOpenToDatePicker] = useState(false);
  const [currentExpIndex, setCurrentExpIndex] = useState(0);

  const [experiences, setExperiences] = useState([
    {
      role: "",
      company: "",
      from: new Date(),
      to: new Date(),
      description: "",
    },
  ]);

  const { personalData, educationData, skillsData } = route.params;

  const handleChange = (field, index, value) => {
    const newExperience = [...experiences];
    newExperience[index][field] = value;
    setExperiences(newExperience);
  };

  const handleAddExperience = () => {
    setExperiences([
      ...experiences,
      {
        role: "",
        company: "",
        from: new Date(),
        to: new Date(),
        description: "",
      },
    ]);
  };

  const handleSubmit = async () => {
    try {
      const email = personalData.email;
      const password = personalData.password;

      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const uid = userCred.user.uid;

      await setDoc(doc(db, "users", uid), {
        email,
        role: "jobseeker",
        personalInfo: personalData,
        education: educationData,
        skills: skillsData,
        experiences: experiences,
        createdAt: new Date(),
      });

      Alert.alert("Success", "Account created and saved successfully");
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error saving to Firestore: ", error);
      Alert.alert("Error", "Something went wrong while saving your data");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        {experiences.map((exp, index) => (
          <View key={index} style={styles.expSection}>
            <Text style={styles.title}>Experience {index + 1}</Text>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Role/Position"
                style={styles.input}
                value={exp.role}
                onChangeText={(value) => handleChange("role", index, value)}
              />
            </View>

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Company Name"
                style={styles.input}
                value={exp.company}
                onChangeText={(value) => handleChange("company", index, value)}
              />
            </View>

            {/* Uncomment below to use date pickers for from/to */}
            {/* <Pressable
              onPress={() => {
                setCurrentExpIndex(index);
                setOpenFromDatePicker(true);
              }}
            >
              <Text style={styles.dateText}>From: {exp.from.toDateString()}</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setCurrentExpIndex(index);
                setOpenToDatePicker(true);
              }}
            >
              <Text style={styles.dateText}>To: {exp.to.toDateString()}</Text>
            </Pressable> */}

            <View style={styles.inputWrapper}>
              <TextInput
                placeholder="Description"
                style={styles.input}
                value={exp.description}
                onChangeText={(value) =>
                  handleChange("description", index, value)
                }
              />
            </View>
          </View>
        ))}

        <Pressable style={styles.addButtonContainer} onPress={handleAddExperience}>
          <MaterialIcons name="add-circle" color="#1967d2" size={24} />
          <Text>Add Another Experience</Text>
        </Pressable>

        <Pressable style={[styles.button, styles.submitButton]} onPress={handleSubmit}>
         
          <Text style={styles.buttonText}>Create Account</Text>
          <Feather name="check-circle" color="#fff" size={24} />
        </Pressable>

        {/* Date Pickers (uncomment to enable) */}
        {/* <DatePicker
          modal
          open={openFromDatePicker}
          date={experiences[currentExpIndex].from}
          mode="date"
          onConfirm={(date) => {
            setOpenFromDatePicker(false);
            handleChange("from", currentExpIndex, date);
          }}
          onCancel={() => {
            setOpenFromDatePicker(false);
          }}
        />
        <DatePicker
          modal
          open={openToDatePicker}
          mode="date"
          date={experiences[currentExpIndex].to}
          onConfirm={(date) => {
            setOpenToDatePicker(false);
            handleChange("to", currentExpIndex, date);
          }}
          onCancel={() => {
            setOpenToDatePicker(false);
          }}
        /> */}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollWrapper: {
    padding: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  expSection: {
    marginBottom: 20,
    padding: 15,
    borderRadius: 10,
    backgroundColor: "#f9f9f9",
    elevation: 2,
  },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 10,
    paddingHorizontal: 12,
    marginBottom: 15,
    elevation: 1,
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 0,
  },
  dateText: {
    fontSize: 14,
    color: "#555",
    marginBottom: 10,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#007bff",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginTop: 10,
    justifyContent: "center",
  },
  submitButton: {
    backgroundColor: "#1967d2",
  },
  buttonText: {
    color: "#fff",
    marginLeft: 10,
    fontWeight: "600",
    fontSize: 16,
  },
  addButtonContainer:{
    flexDirection:'row',
    justifyContent:"flex-end"

  }
});
