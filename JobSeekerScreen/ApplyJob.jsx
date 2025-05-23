import { SafeAreaView, ScrollView, TextInput, TouchableOpacity, Text, View, StyleSheet, Button } from "react-native";
import * as DocumentPicker from 'expo-document-picker';
import { useState } from "react";
import { auth, db } from "../firebaseConfig";
import { addDoc, collection } from "firebase/firestore";
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
const ApplyJob = ({navigation,route}) => {
    const [jobForm, setJobForm] = useState({
        name: "",
        website: "",
        coverLetter: ""
    });
    
    const uid = auth.currentUser?.uid || "fA9DeooDHHOpjgsLXiGi2VFeE4y2";
    const {companyUID }= route.params;
    const {JobId} = route.params;
    console.log(JobId,companyUID)
    const [cvFile, setCvFile] = useState(null);
    const [fileName, setFileName] = useState("No file chosen");

    const chooseFile = async ({navigation}) => {
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: ['application/pdf', 'application/msword', 'image/jpeg'],
                copyToCacheDirectory: true
            });
            
            if (result.type === 'success') {
                setCvFile(result);
                setFileName(result.name);
            }
        } catch (error) {
            console.error('Error picking document:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            const data = {
                userId: uid,
                companyUID: companyUID,
                jobId: JobId,
                ...jobForm,
                cvFile: cvFile ? cvFile.name : null,
                notified: false,
                submittedAt: new Date(),
                status:"applied",
            };
            console.log(data)
            await addDoc(collection(db, 'jobApplications'), data);
            console.log("Job Application Submitted");
            navigation.navigate("Application successfull")
            // Add success feedback to user
        } catch (e) {
            console.log(e);
            // Add error feedback to user
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContainer}>
                <Text style={styles.sectionTitle}>Apply Job</Text>
                
                {/* Full Name Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Full name*</Text>
                    <TextInput
                        style={styles.input}
                        value={jobForm.name}
                        onChangeText={(val) => setJobForm(prev => ({...prev, name: val}))}
                        placeholder="Type your name"
                    />
                </View>
                
                {/* Website Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Website, Blog, or Portfolio*</Text>
                    <TextInput
                        style={styles.input}
                        value={jobForm.website}
                        onChangeText={(val) => setJobForm(prev => ({...prev, website: val}))}
                        placeholder="Type your portfolio address"
                    />
                </View>
                
                {/* CV Upload Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Upload CV*</Text>
                    <Text style={styles.fileInfo}>Format DOC, PDF, JPG</Text>
                    <TouchableOpacity onPress={chooseFile} style={styles.uploadButton}>
                        <View style={styles.uploadContainer}>
                            <Text style={styles.uploadText}>Browse Files</Text>
                        </View>
                    </TouchableOpacity>
                    <Text style={styles.fileName}>{fileName}</Text>
                </View>
                
                {/* Motivational Letter Section */}
                <View style={styles.section}>
                    <Text style={styles.label}>Motivational Letter</Text>
                    <TextInput
                        style={[styles.input, styles.textArea]}
                        value={jobForm.coverLetter}
                        onChangeText={(val) => setJobForm(prev => ({...prev, coverLetter: val}))}
                        placeholder="Write something..."
                        multiline
                        numberOfLines={4}
                    />
                </View>
                
                {/* Submit Button */}
                <TouchableOpacity onPress={handleSubmit} style={styles.submitButton}>
                    <Text style={styles.submitText}>Apply This Job</Text>
                </TouchableOpacity>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    scrollContainer: {
        padding: 20,
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#333',
    },
    section: {
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
        backgroundColor: '#f9f9f9',
    },
    textArea: {
        height: 120,
        textAlignVertical: 'top',
    },
    fileInfo: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    uploadButton: {
        marginTop: 8,
    },
    uploadContainer: {
        borderWidth: 1,
        borderColor: '#007AFF',
        borderRadius: 8,
        padding: 12,
        alignItems: 'center',
        backgroundColor: '#f0f8ff',
    },
    uploadText: {
        color: '#007AFF',
        fontWeight: '500',
    },
    fileName: {
        marginTop: 8,
        fontSize: 14,
        color: '#666',
    },
    submitButton: {
        backgroundColor: '#007AFF',
        borderRadius: 8,
        padding: 16,
        alignItems: 'center',
        marginTop: 20,
    },
    submitText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 16,
    },
    content: {
        alignItems: 'center',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 10,
        color: '#333',
    },
    message: {
        fontSize: 16,
        color: '#666',
        textAlign: 'center',
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 8,
        width: '80%',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: '600',
        textAlign: 'center',
    },
});

export default ApplyJob;

const  JobApplicationSuccess = () => {
    const navigation=useNavigation();
    return (
        <View style={styles.container}>
            <View style={styles.content}>
                <Ionicons name="checkmark-circle" size={80} color="#4CAF50" />
                <Text style={styles.title}>Application Submitted!</Text>
                <Text style={styles.message}>Your job application has been successfully submitted.</Text>
                
                <TouchableOpacity 
                    style={styles.button}
                    onPress={() => navigation.navigate('Find Jobs')}
                >
                    <Text style={styles.buttonText}>Back to Find Jobs</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export {JobApplicationSuccess}