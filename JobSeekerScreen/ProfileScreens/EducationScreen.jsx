import React, { useEffect, useState } from 'react';
import { SafeAreaView, Text, View, ScrollView, Pressable, StyleSheet, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { TextInput } from 'react-native-web';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { TouchableOpacity } from 'react-native';
import { auth, db } from '../../firebaseConfig';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const EducationScreen = ({navigation}) => {
  const [educationDetails, setEducationDetails] = useState([]);
  const [loading, setLoading] = useState(false);

  // Handle field changes
  const handleChange = (field, index, value) => {
    const newEducationDetails = [...educationDetails];
    newEducationDetails[index][field] = value;
    setEducationDetails(newEducationDetails);
  };

  // Add new empty education field
  const handleAddEduInput = () => {
    setEducationDetails([...educationDetails,
      { type: '', name: '', institute: '', percentage: '' }
    ]);
  };

  // Remove education field
  const handleRemoveEduInput = (index) => {
    if (educationDetails.length > 1) {
      const newEducationDetails = [...educationDetails];
      newEducationDetails.splice(index, 1);
      setEducationDetails(newEducationDetails);
    } else {
      Alert.alert("Cannot remove", "You must have at least one education entry");
    }
  };

  // Fetch education data from Firestore
  const fetchEducation = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    try {
      setLoading(true);
      const snap = await getDoc(doc(db, 'users', uid));
      
      if (snap.exists()) {
        const userData = snap.data();
        // Initialize with empty array if no education data exists
        const eduData = userData.education || [{ type: '', name: '', institute: '', percentage: '' }];
        setEducationDetails(eduData);
      }
    } catch (err) {
      console.error("Error fetching education:", err);
      // Initialize with empty fields if error occurs
      setEducationDetails([{ type: '', name: '', institute: '', percentage: '' }]);
    } finally {
      setLoading(false);
    }
  };

  // Update education in Firestore
  const handleEducationUpdate = async () => {
    const uid = auth.currentUser?.uid;
    if (!uid) return;

    // Validate fields
    for (const edu of educationDetails) {
      if (!edu.type || !edu.name || !edu.institute || !edu.percentage) {
        Alert.alert("Validation Error", "Please fill all fields for all education entries");
        return;
      }
    }

    try {
      setLoading(true);
      const userRef = doc(db, "users", uid);
      await updateDoc(userRef, { 
        education: educationDetails,
        updatedAt: new Date() 
      });
      Alert.alert("Success", "Education details updated successfully");
      navigation.navigate("ProfileHome");
    } catch (err) {
      console.error("Error updating education:", err);
      Alert.alert("Error", "Failed to update education details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEducation();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollWrapper}>
        <Text style={styles.title}>Education Details</Text>

        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            {educationDetails.map((edu, index) => (
              <View key={index} style={styles.eduContainer}>
                <View style={styles.eduHeader}>
                  <Text style={styles.subheading}>Education {index + 1}</Text>
                  {educationDetails.length > 1 && (
                    <Pressable 
                      onPress={() => handleRemoveEduInput(index)}
                      style={styles.removeButton}
                    >
                      <MaterialIcons name="remove-circle" color="#ff4444" size={24} />
                    </Pressable>
                  )}
                </View>

                <View style={styles.pickerWrapper}>
                  <Picker 
                    selectedValue={edu.type} 
                    style={styles.picker}
                    onValueChange={(val) => handleChange("type", index, val)}
                  >
                    <Picker.Item label='Select Education Type' value="" />
                    <Picker.Item label="Diploma" value="diploma" />
                    <Picker.Item label="Higher Secondary" value="hsc" />
                    <Picker.Item label="Secondary School (SSLC)" value="sslc" />
                    <Picker.Item label="UG Degree" value="ug_degree" />
                    <Picker.Item label="PG Degree" value="pg_degree" />
                  </Picker>
                </View>

                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder='Degree/Exam Name' 
                    value={edu.name} 
                    style={styles.input} 
                    onChangeText={(val) => handleChange("name", index, val)} 
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder='Institute/University Name' 
                    value={edu.institute}  
                    style={styles.input} 
                    onChangeText={(val) => handleChange("institute", index, val)} 
                  />
                </View>
                <View style={styles.inputWrapper}>
                  <TextInput 
                    placeholder='Percentage/CGPA' 
                    value={edu.percentage} 
                    style={styles.input} 
                    onChangeText={(val) => handleChange("percentage", index, val)}
                    keyboardType="numeric"
                  />
                </View>
              </View>
            ))}

            <View style={styles.addContainer}>
              <Pressable onPress={handleAddEduInput} style={styles.addButton}>
                <MaterialIcons name="add-circle" color="#1967d2" size={24} />
                <Text style={styles.addButtonText}>Add Education</Text>
              </Pressable>
            </View>

            <TouchableOpacity 
              style={styles.button} 
              onPress={handleEducationUpdate}
              disabled={loading}
            >
              <Text style={styles.buttonText}>
                {loading ? 'Updating...' : 'Update Education'}
              </Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollWrapper: {
    padding: 20,
    paddingBottom: 40,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    marginVertical: 20,
  },
  eduContainer: {
    marginBottom: 25,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
  },
  eduHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  input: {
    flex: 1,
    paddingVertical: 12,
    fontSize: 14,
    borderWidth: 0,
  },
  pickerWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f4f4f4",
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 15,
    elevation: 1,
  },
  picker: {
    flex: 1,
    height: 50,
    backgroundColor: "#f4f4f4",
    border: "none",
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
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  addContainer: {
    marginTop: 10,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: 10,
  },
  addButtonText: {
    color: '#1967d2',
    fontWeight: 'bold',
  },
  removeButton: {
    padding: 5,
  },
  subheading: {
    fontWeight: "bold",
    marginVertical: 10,
    fontSize: 15,
  }
});

export default EducationScreen;