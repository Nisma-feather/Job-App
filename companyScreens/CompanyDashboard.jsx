import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PostJob from "./PostJob";
import CompanyProfile from "./CompanyProfile";
import Notifications from "./NotificationScreen";
import ViewJobApplications, { ApplicationsList } from "./ViewJobApplications";

const Tab=createBottomTabNavigator();
const Stack=createNativeStackNavigator();

const CompanyDashboard = () => {
   
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor:'blue',
      tabBarInactiveTintColor:"gray"
  }} initialRouteName="View Applicatons">
      <Tab.Screen name="company Profile" component={CompanyProfile}/>
      <Tab.Screen name="Post Jobs" component={PostJob}/>
      <Tab.Screen name="notfication" component={Notifications}/>
      <Tab.Screen name="View Applicatons" component={JobApplicationStack}/>
      
  </Tab.Navigator>
  )
}

const JobApplicationStack=()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen name="Posted Jobs" component={ViewJobApplications}/>
      <Stack.Screen name="Application List" component={ApplicationsList}/>
    
    </Stack.Navigator>
     
  )
}
export default CompanyDashboard
