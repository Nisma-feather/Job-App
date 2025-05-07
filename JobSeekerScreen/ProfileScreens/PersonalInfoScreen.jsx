import { useEffect, useState } from 'react';
import { View, TextInput, Button, Text,StatusBar,StyleSheet,SafeAreaView,ScrollView,Alert,TouchableOpacity} from 'react-native';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth,db} from '../../firebaseConfig';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
const PersonalInfoScreen = ({navigation}) => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        gender: "",
      });
  const [loading, setLoading] = useState(true);

  const userId = auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2" ;
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userRef = doc(db, "users", userId);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data().personalData;
          console.log(data)
          setFormData({
            name: data.name || "",
            address: data.address || "",
            gender: data.gender || "",
          });
        }
      } catch (error) {
        console.error("Error fetching personal info:", error);
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const handleUpdate = async () => {
    try {
      const userRef = doc(db, "users", userId);
      await updateDoc(userRef, {personalData:formData});
      Alert.alert("Success", "Personal Information Updated Successfully!");
      navigation.navigate('ProfileHome')

    } catch (error) {
      console.error("Error updating personal info:", error);
      Alert.alert("Error", "Failed to update information. Try again.");
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={{ textAlign: "center", marginTop: 20 }}>Loading...</Text>
      </SafeAreaView>
    );
  }

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
            value={formData.name}
            onChangeText={(val) => setFormData({ ...formData, name: val })}
          />
        </View>

    

        

        

        {/* Password */}
        <View style={styles.inputWrapper}>
          <Feather name="lock" size={18} color="#888" style={styles.icon} />
          <TextInput
            multiline
            style={styles.input}
            secureTextEntry
            value={formData.address}
            onChangeText={(val) => setFormData({ ...formData, address: val })}
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
            <Picker.Item label="Female" value="Female" />
            <Picker.Item label="Other" value="other" />
          </Picker>
        </View>

        {/* Update Button */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleUpdate}
        >
          <Text style={styles.buttonText}>Update</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

export default PersonalInfoScreen;

// styles same as you sent
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
    borderWidth: 0,
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
    backgroundColor: "#f4f4f4",
  },
  button: {
    backgroundColor: "#1967d2",
    borderRadius: 20,
    paddingVertical: 14,
    alignItems: "center",
    marginTop: 20,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
