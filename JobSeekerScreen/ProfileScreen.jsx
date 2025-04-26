import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker'
const ProfileScreen = () => {
  const navigation = useNavigation();
  const profileImage = null; // Fetch from Firestore if available

  return (
    <View style={styles.container}>
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
          <Text style={styles.sectionText}>Personal Information</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Education')}>
          <Text style={styles.sectionText}>Education Details</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Skills')}>
          <Text style={styles.sectionText}>Skills</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Experience')}>
          <Text style={styles.sectionText}>Experience</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.sectionItem} onPress={() => navigation.navigate('Projects')}>
          <Text style={styles.sectionText}>Projects</Text>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>
    </View>
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
  sections: { marginTop: 30 },
  sectionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 20,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderColor: '#eee',
  },
  sectionText: { fontSize: 18 },
});
