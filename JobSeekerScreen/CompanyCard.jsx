import { doc, getDoc } from "firebase/firestore";
import { ScrollView,View,Image, StyleSheet,TouchableOpacity,Text } from "react-native";
import { SafeAreaView } from "react-native";
import { db } from "../firebaseConfig";
import { useEffect,useState } from "react";
import JobCard from "./JobCard";

const CompanyCard=({route,navigation})=>{
    const {companyUID} = route.params;
    const [activeTab, setActiveTab] = useState('description');
    const dummyimg=require('../assets/logo.png')
    const [company,setCompany]=useState({});
    console.log(companyUID)


    const fetchCompanyDetails=async()=>{
        if(!companyUID){
              return
        }
        try{
            const ref=doc(db,'companies',companyUID)
            const SnapShot=await getDoc(ref);
            setCompany(SnapShot.data())
            
        }
        catch(e){
            console.log(e);
   
        }
    }
    console.log(company)
    useEffect(()=>{
        fetchCompanyDetails()
    },[])
    return(
        <SafeAreaView>
            <ScrollView>
                <View>
                    <Image source={dummyimg}/>
                    
                </View>
                  <View style={styles.tabs}>
                          <TouchableOpacity onPress={() => setActiveTab('about')} style={[styles.tab, activeTab === 'about' && styles.activeTab]}>
                            <Text style={activeTab === 'about' ? styles.activeTabText : styles.tabText}>About</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setActiveTab('jobs')} style={[styles.tab, activeTab === 'jobs' && styles.activeTab]}>
                            <Text style={activeTab === 'jobs' ? styles.activeTabText : styles.tabText}>Open Jobs</Text>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => setActiveTab('review')} style={[styles.tab, activeTab === 'review' && styles.activeTab]}>
                            <Text style={activeTab === 'review' ? styles.activeTabText : styles.tabText}>Review</Text>
                          </TouchableOpacity>
                </View>

                {
                    activeTab==='about'&& <View>{company.basicInfo}</View>
                }

               {
                // activeTab==='jobs' &&  <JobCard item={company} navigation={navigation}/>
               }

            </ScrollView>
        </SafeAreaView>

    );
}

const styles=StyleSheet.create({
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
      }
})

export default CompanyCard;