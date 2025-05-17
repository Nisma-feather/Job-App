import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostJob from "./PostJob";
import CompanyProfile from "./CompanyProfile";
import Notifications from "./NotificationScreen";
import ViewJobApplications, { ApplicationsList } from "./ViewJobApplications";
import { Component } from "react";
import CompanyProfileEdit from "./CompanyProfileEdit";
import PostJobHome from "./PostJobHome";
import PostJobEdit from "./PostJobEdit";
import UserProfile from "./UserProfile";

const Tab=createBottomTabNavigator();
const Stack=createNativeStackNavigator();

const CompanyDashboard = () => {
   
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor:'blue',
      tabBarInactiveTintColor:"gray"
  }} initialRouteName="View Applications">
      <Tab.Screen name="company Profile" component={CompanyProfileStack}/>
      <Tab.Screen name="Posted Jobs" component={CompanyPostJobStack}/>
      <Tab.Screen name="notfication" component={Notifications}/>
      <Tab.Screen name="View Applications" component={JobApplicationStack}/>
      
  </Tab.Navigator>
  )
}

const JobApplicationStack=()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen name="Posted Jobs" component={ViewJobApplications}/>
      <Stack.Screen name="Application List" component={ApplicationsList}/>
      <Stack.Screen name="User Profile" component={UserProfile}/>
    
    </Stack.Navigator>
     
  )
}


const CompanyProfileStack=()=>{
  return(
    <Stack.Navigator>
       <Stack.Screen name="Profile" component={CompanyProfile}/>
       <Stack.Screen name="Profile edit" component={CompanyProfileEdit}/>
    </Stack.Navigator>
  
  )
}
const CompanyPostJobStack=()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen name="Post Job HomeScreen" component={PostJobHome}/>
      <Stack.Screen name="Post Job" component={PostJob}/>
      <Stack.Screen name="Edit Job" component={PostJobEdit}/>

    </Stack.Navigator>
    
  )
}
export default CompanyDashboard
