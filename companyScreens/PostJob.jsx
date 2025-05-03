import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react'
import { Alert, TouchableOpacity } from 'react-native';
import { ScrollView, Text, View, StyleSheet } from 'react-native'
import { SafeAreaView, TextInput } from 'react-native-web'
import { auth, db } from '../firebaseConfig';
import { addDoc, collection } from 'firebase/firestore';
import { Ionicons } from '@expo/vector-icons'; import { useNavigation } from '@react-navigation/native';

const PostJob = ({ navigation }) => {

  const [jobrole, setJobRole] = useState("");
  const [vacancies, setVacancies] = useState("");
  const [locations, setlocations] = useState("");
  const [requiremnts, setRequiremnts] = useState("");
  const [roleRes, setRoleRes] = useState("");
  const [expYear, setExpYear] = useState("");
  const [jobType, setJobType] = useState("");
  const [jobMode, setJobMode] = useState("");
  const [skillsInput, setSkillsInput] = useState('');

  const [salaryPack, setSalaryPack] = useState("");

  const expYeardata = ['', 'Fresher', "0 - 1 year", "2-5 Years", "More than 5 Years", "More than 10 Years"];
  const JobTypedata = ['', 'Full Time', "Part Time", "Internship"];
  const JobModedata = ['', 'Hybrid', "Remote", "OnSite"];
  


  const handlePostJob = async () => {
    const companyUID = auth.currentUser?.uid || "vm5dkIUfk0WxgnXT34QBttxA3kV2";
    if (!companyUID) {
      return
    }
  

    try {
      const jobData = {
        companyUID,
        jobrole,
        vacancies,
        locations,
        expYear,
        requiremnts: requiremnts.split('\n'),
        skillsRequired : skillsInput
        .split(',')
        .map(skill => skill.trim())
        .filter(skill => skill),
        resposibilities: roleRes.split('\n'),
        jobType,
        jobMode,
        salaryPack,
        postedAt: new Date(),
      };
      console.log(jobData)
      await addDoc(collection(db, 'jobs'), jobData);
      Alert.alert("Job Posted Successfully");
      console.log("job posted")
      navigation.navigate("Job Post Success")
    }
    catch (err) {
      Alert.alert('Error', err.message)
    }
   
  }
console.log(skillsInput)


  return (
    <SafeAreaView style={styles.formContainer}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.label}>Job Role</Text>
        <TextInput
          style={styles.input}
          placeholder="Type Job Role"
          placeholderTextColor="#999"
          value={jobrole}
          onChangeText={setJobRole}
        />

        <Text style={styles.label}>No of Vacancies</Text>
        <TextInput
          style={styles.input}
          placeholder="Type vacancies"
          placeholderTextColor="#999"
          value={vacancies}
          onChangeText={setVacancies}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Locations</Text>
        <TextInput
          style={styles.input}
          placeholder="Type Job Location"
          placeholderTextColor="#999"
          value={locations}
          onChangeText={setlocations}
        />

        <Text style={styles.label}>Requirements</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter requirements (one per line)"
          placeholderTextColor="#999"
          value={requiremnts}
          onChangeText={setRequiremnts}
          multiline
          numberOfLines={4}
        />
        <Text style={styles.label}>Skills Required</Text>
        <TextInput
          style={styles.input}
          placeholder="Skills Required (e.g., React, JavaScript, Node)"
          value={skillsInput}
          onChangeText={setSkillsInput}
        />


        <Text style={styles.label}>Roles & Responsibilities</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Enter roles & responsibilities (one per line)"
          placeholderTextColor="#999"
          value={roleRes}
          onChangeText={setRoleRes}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.label}>Experience Level</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={expYear} onValueChange={setExpYear} style={styles.picker}>
            {expYeardata.map((exp, idx) => (
              <Picker.Item key={idx} label={exp === '' ? 'Select Years of Exp' : exp} value={exp} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Job Type</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={jobType} onValueChange={setJobType} style={styles.picker}>
            {JobTypedata.map((type, idx) => (
              <Picker.Item key={idx} label={type === '' ? 'Select Type of Job' : type} value={type} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Job Mode</Text>
        <View style={styles.pickerWrapper}>
          <Picker selectedValue={jobMode} onValueChange={setJobMode} style={styles.picker}>
            {JobModedata.map((mode, idx) => (
              <Picker.Item key={idx} label={mode === '' ? 'Select Job Mode' : mode} value={mode} />
            ))}
          </Picker>
        </View>

        <Text style={styles.label}>Salary Package</Text>
        <TextInput
          style={styles.input}
          placeholder="Type package"
          placeholderTextColor="#999"
          value={salaryPack}
          onChangeText={setSalaryPack}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handlePostJob}>
          <Text style={styles.submitButtonText}>Post Job</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>

  )
}
export const JobPostSucessScreen = () => {
  const Navigation = useNavigation();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name="checkmark-circle" size={100} color="#7cfc00" />
      </View>
      <Text style={styles.successText}>Job Posted Successfully!</Text>
      <TouchableOpacity style={styles.button} onPress={() => Navigation.replace('CompanyDashboard')}>
        <Text style={styles.buttonText}>Go to Dashboard</Text>
      </TouchableOpacity>
    </SafeAreaView>
  )


}

export default PostJob

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',

    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  formContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  scrollContainer: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 5,
    marginTop: 15,
    color: '#333',
  },
  input: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
  },
  textArea: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  pickerWrapper: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    overflow: 'hidden',
  },
  picker: {
    height: 50,
    width: '100%',
  },
  submitButton: {
    marginTop: 30,
    backgroundColor: '#007bff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },

  // Success screen styles already included
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  iconContainer: {
    marginBottom: 20,
  },
  successText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: 'blue',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

