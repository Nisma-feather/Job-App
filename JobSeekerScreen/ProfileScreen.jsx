import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
import { SafeAreaView, ScrollView } from 'react-native-web';
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
const ProfileScreen = () => {
  const navigation = useNavigation();
  const profileImage = null; // Fetch from Firestore if available

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
      <View style={{padding:15}}>
      <View style={styles.profileSection}>
        <Image
          source={profileImage ? { uri: profileImage } : require('../assets/icon.png')}
          style={styles.profileImage}
        />
        <TouchableOpacity style={styles.editIcon}>
          <Ionicons name="pencil" size={20} color="white" />
        </TouchableOpacity>
      </View>

      <View style={styles.sections}>
        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('PersonalInfo')}>
        <Octicons name="person-add" color="#6297e0" size={24} />
          <Text style={styles.sectionText}>Personal Information</Text>
          <Text style={{color:"#3a7bd6"}}>Add + </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Education')}>
        <Octicons name="book" color="#6297e0" size={24} />
          <Text style={styles.sectionText}>Education Details</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Skills')}>
        <Octicons name="file-badge" color="#6297e0" size={24} />
          <Text style={styles.sectionText}>Skills</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Experience')}>
        <MaterialCommunityIcons name="hexagon-slice-3" color="#6297e0" size={24} />
          <Text style={styles.sectionText}>Experience</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Projects')}>
        <Feather name="pie-chart" color="#6297e0" size={24} />
          <Text style={styles.sectionText}>Projects</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>
      </View>

      </ScrollView>
    </SafeAreaView>
    
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  profileSection: { alignItems: 'center', marginVertical: 20 },
  profileImage: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#ddd' },
  editIcon: {
    position: 'absolute',
    bottom: 0,
    right: 135,
    backgroundColor: '#000',
    borderRadius: 15,
    padding: 5,
  },
  sections: { marginTop: 30,
    gap:15
   },
  sectionItem: {
    flexDirection: 'row',
    gap:20,
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderWidth: '1px',
    borderColor: '#f0f5fc',
    borderRadius:5
  },
  sectionText: { fontSize: 18,
    color:'#3b4b5e',
    
   },
});
