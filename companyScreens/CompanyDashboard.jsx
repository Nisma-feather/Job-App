import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostJob from "./PostJob";
import CompanyProfile from "./CompanyProfile";

const Tab=createBottomTabNavigator();

const CompanyDashboard = () => {
   
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor:'blue',
      tabBarInactiveTintColor:"gray"
  }} initialRouteName="Post Jobs">
      <Tab.Screen name="company Profile" component={CompanyProfile}/>
      <Tab.Screen name="Post Jobs" component={PostJob}/>
      
  </Tab.Navigator>
  )
}

export default CompanyDashboard
