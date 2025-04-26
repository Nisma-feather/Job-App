import { useState } from "react";
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
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
import { db } from "../firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";

export default function SkillsUpdateScreen({ navigation, route }) {
  const { skillsData, userId } = route.params;

  const [skills, setSkills] = useState(skillsData || [
    { skill: "", level: "" },
  ]);

  function handleChange(field, index, value) {
    const newSkills = [...skills];
    newSkills[index][field] = value;
    setSkills(newSkills);
  }

  function handleAddInput() {
    setSkills([...skills, { skill: "", level: "" }]);
  }

  async function handleUpdateSkills() {
    try {
      await updateDoc(doc(db, "users", userId), {
        skills: skills,
      });
      Alert.alert("Success", "Skills updated successfully");
      navigation.goBack();
    } catch (error) {
      console.error("Error updating skills: ", error);
      Alert.alert("Error", "Failed to update skills");
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.title}>Update Your Skills</Text>

        {skills.map((skill, index) => (
          <View key={index} style={styles.card}>
            <TextInput
              placeholder="Enter skill"
              value={skill.skill}
              onChangeText={(value) => handleChange("skill", index, value)}
              style={styles.input}
            />

            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={skill.level}
                onValueChange={(value) => handleChange("level", index, value)}
                style={styles.picker}
              >
                <Picker.Item label="Select level" value="" color="#888" />
                <Picker.Item label="Beginner" value="beginner" />
                <Picker.Item label="Intermediate" value="intermediate" />
                <Picker.Item label="Expert" value="expert" />
              </Picker>
            </View>
          </View>
        ))}

        <Pressable onPress={handleAddInput} style={styles.iconButton}>
          <Text>Add Another Skill</Text>
          <MaterialIcons name="add-circle" color="#1967d2" size={28} />
        </Pressable>

        <TouchableOpacity style={styles.button} onPress={handleUpdateSkills}>
          <Text style={styles.buttonText}>Update Skills</Text>
          <Feather name="check-circle" color="#fff" size={24} />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // Same styles as you sent (can reuse)
  container: { flex: 1, backgroundColor: "#fff" },
  wrapper: { padding: 20 },
  title: { fontSize: 20, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  card: { marginBottom: 20, flexDirection: "row", gap: 15 },
  input: { backgroundColor: "#fff", borderRadius: 8, padding: 12, fontSize: 14, borderWidth: 1, borderColor: "#ddd", width: "75%" },
  pickerWrapper: { borderRadius: 8, borderWidth: 1, borderColor: "#ddd", backgroundColor: "#fff", width: "25%" },
  picker: { height: 50, width: "100%" },
  iconButton: { marginTop: 10, flexDirection: "row", justifyContent: "flex-end", alignItems: "center", gap: 10 },
  button: { backgroundColor: "#1967d2", borderRadius: 20, paddingVertical: 14, alignItems: "center", marginTop: 20 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
