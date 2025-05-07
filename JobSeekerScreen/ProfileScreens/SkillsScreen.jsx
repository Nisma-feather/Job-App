import { useState, useEffect } from "react";
import {
  SafeAreaView,
  View,
  TextInput,
  Pressable,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { auth, db } from "../../firebaseConfig";
import { doc, getDoc, updateDoc } from "firebase/firestore";


export default function SkillsUpdateScreen({ navigation }) {
  const [skills, setSkills] = useState([{ skill: "", level: "" }]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const uid = auth.currentUser?.uid;
  console.log(uid)
 
  // Fetch skills data when component mounts
  useEffect(() => {
    const fetchSkills = async () => {
      if (!auth.currentUser) {
        console.log("no user found")
      }
      const uid = auth.currentUser?.uid;
      console.log("from skills",uid)
      if (!uid) return;

      try {
        const userDoc = await getDoc(doc(db, "users", uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          console.log(userData);
          // Initialize with empty array if no skills data exists
          const skillsData = userData.skills || [{ skill: "", level: "" }];
          setSkills(skillsData);
        }
      } catch (error) {
        console.error("Error fetching skills:", error);
        Alert.alert("Error", "Failed to load skills data");
      } finally {
        setLoading(false);
      }
    };

    fetchSkills();
  }, []);

  function handleChange(field, index, value) {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  }

  function handleAddInput() {
    setSkills([...skills, { skill: "", level: "" }]);
  }

  function handleRemoveSkill(index) {
    if (skills.length > 1) {
      const newSkills = [...skills];
      newSkills.splice(index, 1);
      setSkills(newSkills);
    } else {
      Alert.alert("Cannot remove", "You must have at least one skill");
    }
  }

  async function handleUpdateSkills() {
    // Validate all fields
    for (const item of skills) {
      if (!item.skill.trim() || !item.level) {
        Alert.alert("Validation Error", "Please fill all fields for all skills");
        return;
      }
    }

    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      setUpdating(true);
      await updateDoc(doc(db, "users", uid), {
        skills: skills,
        updatedAt: new Date(),
      });
      Alert.alert("Success", "Skills updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating skills: ", error);
      Alert.alert("Error", "Failed to update skills");
    } finally {
      setUpdating(false);
    }
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1967d2" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.title}>Update Your Skills</Text>

        {skills.map((skill, index) => (
          <View key={index} style={styles.skillContainer}>
            <View style={styles.skillInputContainer}>
              <TextInput
                placeholder="Enter skill (e.g., React, Python)"
                value={skill.skill}
                onChangeText={(value) => handleChange("skill", index, value)}
                style={styles.input}
              />
              
              <Pressable 
                onPress={() => handleRemoveSkill(index)}
                style={styles.removeButton}
              >
                <MaterialIcons name="remove-circle" color="#ff4444" size={24} />
              </Pressable>
            </View>

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={skill.level}
                onValueChange={(value) => handleChange("level", index, value)}
                style={styles.picker}
                dropdownIconColor="#1967d2"
              >
                <Picker.Item label="Select proficiency level" value="" />
                <Picker.Item label="Beginner" value="beginner" />
                <Picker.Item label="Intermediate" value="intermediate" />
                <Picker.Item label="Advanced" value="advanced" />
                <Picker.Item label="Expert" value="expert" />
              </Picker>
            </View>
          </View>
        ))}

        <Pressable onPress={handleAddInput} style={styles.addButton}>
          <MaterialIcons name="add-circle" color="#1967d2" size={24} />
          <Text style={styles.addButtonText}>Add Another Skill</Text>
        </Pressable>

        <TouchableOpacity 
          style={styles.button} 
          onPress={handleUpdateSkills}
          disabled={updating}
        >
          {updating ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Text style={styles.buttonText}>Update Skills</Text>
              <Feather name="check-circle" color="#fff" size={20} style={styles.buttonIcon} />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#fff" 
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  wrapper: { 
    padding: 20,
    paddingBottom: 40 
  },
  title: { 
    fontSize: 20, 
    fontWeight: "bold", 
    marginBottom: 20, 
    textAlign: "center",
    color: "#333"
  },
  skillContainer: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    paddingBottom: 15,
  },
  skillInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  input: { 
    flex: 1,
    backgroundColor: "#f8f8f8", 
    borderRadius: 8, 
    padding: 12, 
    fontSize: 14, 
    borderWidth: 1, 
    borderColor: "#ddd",
  },
  pickerWrapper: { 
    borderRadius: 8, 
    borderWidth: 1, 
    borderColor: "#ddd", 
    backgroundColor: "#f8f8f8", 
    overflow: "hidden"
  },
  picker: { 
    height: 50, 
    width: "100%" 
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 10,
    marginVertical: 10,
  },
  addButtonText: {
    color: "#1967d2",
    fontWeight: "500",
  },
  removeButton: {
    marginLeft: 10,
  },
  button: { 
    backgroundColor: "#1967d2", 
    borderRadius: 8, 
    paddingVertical: 14, 
    alignItems: "center", 
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 16 
  },
  buttonIcon: {
    marginLeft: 5,
  },
});