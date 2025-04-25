import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostJob from "./PostJob";
import CompanyProfile from "./CompanyProfile";

const Tab=createBottomTabNavigator();

const CompanyDashboard = ({route}) => {
    console.log(route.params.uid);
  return (
    <Tab.Navigator screenOptions={{
      tabBarActiveTintColor:'blue',
      tabBarInactiveTintColor:"gray"
  }}>
      <Tab.Screen name="company Profile" component={CompanyProfile}/>
      <Tab.Screen name="Post Jobs" component={PostJob}/>
      
  </Tab.Navigator>
  )
}

export default CompanyDashboard
