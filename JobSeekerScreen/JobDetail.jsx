import { doc, getDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { db } from '../firebaseConfig';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Foundation from 'react-native-vector-icons/Foundation';
import FontAwesome from 'react-native-vector-icons/FontAwesome';

const JobDetail = ({ route,navigation }) => {
  const { currentJob } = route.params;
  const [company, setCompany] = useState({})
  const [activeTab, setActiveTab] = useState('description');

  const fetchCompany = async () => {
    const ref = doc(db, 'companies', currentJob.companyUID);
    const companySnap = await getDoc(ref);
    if (companySnap.exists()) {
      const companyData = companySnap.data();
      setCompany(companyData);

    }

  }
  useEffect(() => {
    fetchCompany();
  }, [])
  console.log(company)
  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Top Job Card */}
        <View style={styles.jobCard}>
          <View style={styles.jobInfo}>
            <Text style={styles.role}>{currentJob.jobrole}</Text>
            <Text style={styles.location}>{currentJob.locations}</Text>
            <View style={styles.tags}>
              <Text style={styles.tag}>{currentJob.jobType}</Text>
              <Text style={styles.tag}>{currentJob.jobMode}</Text>
              <Text style={styles.tag}>{currentJob.role}</Text>
            </View>
          </View>
        </View>

        {/* Tabs */}

        <View style={styles.tabs}>
          <TouchableOpacity onPress={() => setActiveTab('description')} style={[styles.tab, activeTab === 'description' && styles.activeTab]}>
            <Text style={activeTab === 'description' ? styles.activeTabText : styles.tabText}>Job Description</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('company')} style={[styles.tab, activeTab === 'company' && styles.activeTab]}>
            <Text style={activeTab === 'company' ? styles.activeTabText : styles.tabText}>Company</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setActiveTab('review')} style={[styles.tab, activeTab === 'review' && styles.activeTab]}>
            <Text style={activeTab === 'review' ? styles.activeTabText : styles.tabText}>Review</Text>
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        <View style={styles.content}>
          {activeTab === 'description' && (
            <>
              <Text style={styles.heading}>About The Role</Text>
              {currentJob.resposibilities.map((line, idx) => (

                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{line.trim()}</Text>
                </View>

              ))}


              <Text style={styles.heading}>Required Skills</Text>
              {currentJob.requiremnts.map((line, idx) => (

                <View key={idx} style={styles.bulletRow}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.bulletText}>{line.trim()}</Text>
                </View>

              ))}
            </>
          )}

          {activeTab === 'company' && (
            <>
              <Text style={styles.heading}>About Company</Text>
              <Text>{company.basicInfo}</Text>
              <View style={styles.companyIconlist}>
                <View style={styles.companyIconpart}>
                  <MaterialCommunityIcons name="web" color="#2969ff" size={24} />
                  <Text style={styles.iconText}>Website</Text>
                </View>

                <Text>Website link</Text>
              </View>
              <View style={styles.companyIconlist}>
                <View style={styles.companyIconpart}>
                  <Ionicons name="location-outline" color="#ffd175" size={24} />
                  <Text style={styles.iconText} >Headquarters</Text>
                </View>
                <Text>{company.locations}</Text>


              </View>
              <View style={styles.companyIconlist}>
                <View style={styles.companyIconpart}>
                  <FontAwesome name="calendar" color="#00cc9c" size={24} />
                  <Text style={styles.iconText}>Founded</Text>
                </View>

                <Text>{company.startYear}</Text>
              </View>
              <View style={styles.companyIconlist}>
                <View style={styles.companyIconpart}>
                  <Foundation name="torsos" color="#ff73c9" size={24} />
                  <Text style={styles.iconText}>size</Text>
                </View>

                <Text>{company.employeeCount}</Text>

              </View>



            </>
          )}

          {activeTab === 'review' && (
            <Text style={styles.heading}>Reviews not available</Text>
          )}
        </View>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomButton} >
        <TouchableOpacity style={styles.applyBtn} onPress={()=>navigation.navigate("Apply Job")}>
          <Text style={styles.applyText}>Apply This Job</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default JobDetail;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scroll: {
    paddingBottom: 100,
  },
  jobCard: {
    backgroundColor: '#6C63FF',
    borderRadius: 12,
    margin: 16,
    padding: 16,
  },
  jobInfo: {
    alignItems: 'flex-start',
  },
  role: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  location: {
    fontSize: 14,
    color: '#ddd',
    marginVertical: 4,
  },
  tags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tag: {
    backgroundColor: '#fff',
    color: '#333',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    fontSize: 12,
    marginRight: 8,
    marginTop: 4,
  },
  tabs: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginTop: 12,
    backgroundColor: '#f0f4ff',
    borderRadius: 15,
    padding:10


  },
  tab: {
    flex: 1,
    justifyContent:'center',
    alignItems: 'center',
    borderRadius:15,
    paddingVertical:4,
    paddingHorizontal:4,
    backgroundColor:"fff"
  },
  tabText: {
    color: '#3d77ff',
    fontWeight: '600',
    textAlign:'center'
  },
  activeTab: {
    backgroundColor: '#3d77ff',
  },
  activeTabText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign:'center'
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 6,
  },
  paragraph: {
    color: '#444',
    marginBottom: 16,
    lineHeight: 22,
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    marginRight: 6,
    fontSize: 18,
    color: '#6C63FF',
  },
  bulletText: {
    flex: 1,
    color: '#333',
    fontSize: 14,
  },
  bottomButton: {
    position: 'absolute',
    bottom: 20,
    width: '100%',
    paddingHorizontal: 20,
  },
  applyBtn: {
    backgroundColor: '#4169e1',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
  },
  applyText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  companyIconlist: {
    flexDirection: 'row',
    justifyContent: 'space-between',
   
    alignItems:'center'
  },
  companyIconpart: {
    flexDirection: 'row',
    gap:12,
    marginTop:10
  },
  iconText:{
  fontWeight:'bold',
  }
});
