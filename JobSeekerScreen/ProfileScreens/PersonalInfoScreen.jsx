import { useEffect, useState } from 'react';
import { View, TextInput, Button, Text,StatusBar,StyleSheet,SafeAreaView,ScrollView,Alert,TouchableOpacity} from 'react-native';

import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth,db} from '../../firebaseConfig';
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { Picker } from "@react-native-picker/picker";
const PersonalInfoScreen = ({navigation}) => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        address: "",
        email: "",
        id: "",
        password: "",
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
          const data = docSnap.data().personalInfo;
          console.log(data)
          setFormData({
            firstName: data.firstName || "",
            lastName: data.lastName || "",
            address: data.address || "",
            email: data.email || "",
            id: data.id || "",
            password: data.password || "",
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
      await updateDoc(userRef, {personalInfo:formData});
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
            value={formData.firstName}
            onChangeText={(val) => setFormData({ ...formData, firstName: val })}
          />
        </View>

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

        {/* ID */}
        <View style={styles.inputWrapper}>
          <FontAwesome name="id-card" size={18} color="#888" style={styles.icon} />
          <TextInput
            placeholder="ID"
            style={styles.input}
            value={formData.id}
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
            value={formData.password}
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
