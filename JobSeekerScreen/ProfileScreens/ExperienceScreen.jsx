import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, ScrollView, Pressable, StyleSheet, Alert, TouchableOpacity, TextInput } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const ExperienceScreen = ({ navigation }) => {
  const [experienceDetails, setExperienceDetails] = useState([{ role: '', company: '', from: '', to: '' }]);
  const [loading, setLoading] = useState(true);

  const handleChange = (field, index, value) => {
    const newExperiences = [...experienceDetails];
    newExperiences[index][field] = value;
    setExperienceDetails(newExperiences);
  };

  const handleAddExperience = () => {
    setExperienceDetails([...experienceDetails, { role: '', company: '', from: '', to: '' }]);
  };

  const fetchExperience = async () => {
    const uid = auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
    try {
      const snap = await getDoc(doc(db, 'users', uid));
      console.log(snap.data())
      const data = snap.data()?.experiences || [{ role: '', company: '', from: '', to: '' }];
      console.log(data)
      setExperienceDetails(data);
    } catch (err) {
      Alert.alert("Error", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleExperienceUpdate = async () => {
    const uid = auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
    try {
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { experience: experienceDetails });
      Alert.alert("Experience Details Updated");
      navigation.navigate("ProfileHome");
    } catch (err) {
      Alert.alert("Error Updating", err.message);
    }
  };

  useEffect(() => {
    fetchExperience();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <Text style={styles.title}>Experience Details</Text>

        {loading ? (
          <Text style={{ textAlign: "center", marginTop: 50 }}>Loading...</Text>
        ) : (
          experienceDetails.map((exp, index) => (
            <View key={index}>
              <Text style={styles.subheading}>Experience {index + 1}</Text>

              <View style={styles.inputWrapper}>
                <TextInput placeholder='Enter Role' value={exp.role} style={styles.input} onChangeText={(val) => handleChange("role", index, val)} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput placeholder='Enter Company Name' value={exp.company} style={styles.input} onChangeText={(val) => handleChange("company", index, val)} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput placeholder='From Date (e.g., Jan 2020)' value={exp.from} style={styles.input} onChangeText={(val) => handleChange("from", index, val)} />
              </View>
              <View style={styles.inputWrapper}>
                <TextInput placeholder='To Date (e.g., Dec 2022)' value={exp.to} style={styles.input} onChangeText={(val) => handleChange("to", index, val)} />
              </View>
            </View>
          ))
        )}

        <View style={styles.addContainer}>
          <Text>Add Experience</Text>
          <Pressable onPress={handleAddExperience}>
            <MaterialIcons name="add-circle" color="#1967d2" size={24} />
          </Pressable>
        </View>

        <TouchableOpacity style={styles.button} onPress={handleExperienceUpdate}>
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default ExperienceScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  scrollWrapper: { padding: 20 },
  title: { fontSize: 20, fontWeight: "600", textAlign: "center", marginVertical: 20 },
  inputWrapper: { flexDirection: "row", alignItems: "center", backgroundColor: "#f4f4f4", borderRadius: 12, paddingHorizontal: 12, marginBottom: 15, elevation: 1 },
  input: { flex: 1, paddingVertical: 12, fontSize: 14 },
  button: { backgroundColor: "#1967d2", borderRadius: 20, paddingVertical: 14, alignItems: "center", marginTop: 20, elevation: 5 },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  addContainer: { flexDirection: 'row', gap: 10, justifyContent: 'flex-end' },
  subheading: { fontWeight: "bold", marginVertical: 10, fontSize: 15, marginLeft: 12 }
});
