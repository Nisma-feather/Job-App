
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import PostJob from "./PostJob";
import CompanyProfile from "./CompanyProfile";

const Tab=createBottomTabNavigator();


const CompanyTabs=({route})=>{
    const {uid}=route.params;
 return(
    <Tab.Navigator screenOptions={{
        tabBarActiveTintColor:'blue',
        tabBarInactiveTintColor:"gray"
    }}>
        <Tab.Screen name="company Profile" component={CompanyProfile}/>
        <Tab.Screen name="Post Jobs" compoenent={PostJob}/>
        
    </Tab.Navigator>
 )

}
export default CompanyTabs