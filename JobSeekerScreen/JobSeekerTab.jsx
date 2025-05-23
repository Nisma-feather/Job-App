
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen, { Customheader } from "./HomeScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BookMarkScreen from "./BookmarkScreen";
import FindJobScreen from "./FindJobScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PersonalInfoScreen from "./ProfileScreens/PersonalInfoScreen";
import ProfileScreen from "./ProfileScreen";
import EducationScreen from "./ProfileScreens/EducationScreen";
import ExperienceScreen from "./ProfileScreens/ExperienceScreen";

import ProjectsScreen from "./ProfileScreens/ProjectsScreen";
import JobDetail from "./JobDetail";
import SkillsUpdateScreen from "./ProfileScreens/SkillsScreen";
import ApplyJob from "./ApplyJob";
import JobCard from "./JobCard";
import CompanyCard from "./CompanyCard";
import Messages, { MessageDetail } from "./Messages";
import { View,Image,Text,Pressable,TextInput
} from "react-native";
import TrackApplications from "./ProfileScreens/TrackApplications";


const Tab=createBottomTabNavigator();
const Stack=createNativeStackNavigator();
const JobSeekerTab=()=>{
    return(
        <Tab.Navigator screenOptions={({route})=>({tabBarShowLabel:false, tabBarStyle: { // This styles the entire tab bar container
          height: 60, // Adjust height as needed
          paddingBottom: 10, // Add padding at bottom
          paddingTop: 10, // Add padding at top
        },
        tabBarItemStyle: { // This styles individual tab items
          height: 50, // Height of each tab item
        },
        tabBarIcon:({focused,color,size})=>{
          let IconName;
            if(route.name==='Home'){
               IconName=focused?'home':'home-outline'
            }
            else if (route.name === 'Profile') {
               IconName = focused ? 'person' : 'person-outline';
            }
            else if(route.name==='Messages'){
              IconName=focused ? 'chatbox-ellipses':"chatbox-ellipses-outline"
            }
            else if(route.name === 'BookMark'){
                IconName = focused? 'bookmarks':'bookmarks-outline'

            }
            return <Ionicons name={IconName} color={color} size={24}/>
            
        },
        tabBarActiveTintColor:'#0a66c2',
        tabBarInactiveTintColor: '#666',

      
        
        })} initialRouteName="Home" >
            <Tab.Screen name="Home" component={HomeStack} options={{headerShown:false}}/>
            <Tab.Screen name="BookMark" component={BookMarkScreen}  />
            <Tab.Screen name="Find Jobs" component={JobStack} options={{
                                                      tabBarIcon:()=>(
                                                        <Ionicons name="search" color="#000" size={24} />
                                                      )}}/>
            <Tab.Screen name="Profile" component={ProfileStack}  />
            <Tab.Screen name="Messages" component={MessagesStack} />

        </Tab.Navigator>

    )

}

const ProfileStack=()=>{
    return(
      <Stack.Navigator initialRouteName="ProfileHome">
        <Stack.Screen name="ProfileHome" component={ProfileScreen} options={{ headerShown: false }} />
        <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen}/>
        <Stack.Screen name="Education" component={EducationScreen}/>
        <Stack.Screen name="Experience" component={ExperienceScreen}/>
        <Stack.Screen name="Skills" component={SkillsUpdateScreen}/>
        <Stack.Screen name="Projects" component={ProjectsScreen}/>
        <Stack.Screen name="Track Application" component={TrackApplications}/>
      </Stack.Navigator>
    )
}

const JobStack=()=>{
  return(
  <Stack.Navigator screenOptions={{headerShown:false}}>
    <Stack.Screen name="Find Job" component={FindJobScreen}/>
    <Stack.Screen name="Company Page" component={CompanyCard}/>
    <Stack.Screen name="Job Details" component={JobDetail}/>
    <Stack.Screen name="Apply Job" component={ApplyJob}/>
  </Stack.Navigator>

  )
 
}
const HomeStack=()=>{
  return(
    <Stack.Navigator screenOptions={{headerShown:'false'}}>
      <Stack.Screen name="HomeScreen" component={HomeScreen} options={({navigation})=>({
        header:()=>(
          <Customheader navigation={navigation} />
        ),
        headerStyle:{
          height:60,
          backgroundColor:'#fff',
          shadowOpacity:0,
          elevation:0
        },
        headerShown:false
      }
      )}/>
      <Stack.Screen name="Find Job" component={FindJobScreen}/>
      
      
     
    
    </Stack.Navigator>
  )
}
const MessagesStack=()=>{
  return(
    <Stack.Navigator screenOptions={{headerStyle:{
      backgroundColor:'white',
      elevation:0,
      shadowOpacity:0
    },
    headerShown:false}}>
      <Stack.Screen name="Messages" component={Messages}/>
      <Stack.Screen name="MessageDetail" component={MessageDetail} options={({route})=>({
      headerTitle:()=>(
        <View style={{flexDirection:'row',alignItems:'center',paddingVertical:'10px'}}>
          <View style={{height:50,width:50,borderRadius:'5px',borderWidth:1,borderColor:'#666'}}>
            <Image style={{width:'100%',height:'100%'}} source={route.params.message?.logo 
    ? {uri: route.params.message.logo} 
    : require("../assets/logo.png")}/>
          </View>
          <Text style={{marginLeft:10,fontWeight:'bold'}}>{route.params.message.from}</Text>
        </View>
      )

      })}/>
    </Stack.Navigator>
  )
}
export default JobSeekerTab