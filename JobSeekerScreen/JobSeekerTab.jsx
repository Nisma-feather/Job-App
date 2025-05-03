
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "./HomeScreen";
import Ionicons from 'react-native-vector-icons/Ionicons';
import BookMarkScreen from "./BookmarkScreen";
import FindJobScreen from "./FindJobScreen";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PersonalInfoScreen from "./ProfileScreens/PersonalInfoScreen";
import ProfileScreen from "./ProfileScreen";
import EducationScreen from "./ProfileScreens/EducationScreen";
import ExperienceScreen from "./ProfileScreens/ExperienceScreen";
import SkillsScreen from "./ProfileScreens/SkillsSCreen";
import ProjectsScreen from "./ProfileScreens/ProjectsScreen";
import JobDetail from "./JobDetail";


const Tab=createBottomTabNavigator();
const Stack=createNativeStackNavigator();
const JobSeekerTab=()=>{
    return(
        <Tab.Navigator screenOptions={{headerShown:false}} initialRouteName="BookMark">
            <Tab.Screen name="Home" component={HomeScreen} options={{
                                                      tabBarIcon:()=>(
                                                        <Ionicons name="home"  size={24} />
                                                      )
            }}/>
            <Tab.Screen name="BookMark" component={BookMarkScreen} options={{
                                                      tabBarIcon:()=>(
                                                        <Ionicons name="bookmarks-sharp"  size={24} />
                                                      )}} />
            <Tab.Screen name="Find Jobs" component={FindJobScreen} options={{
                                                      tabBarIcon:()=>(
                                                        <Ionicons name="search" color="#000" size={24} />
                                                      )}}/>
            <Tab.Screen name="Profile" component={ProfileStack} options={{
                                                      tabBarIcon:()=>(
                                                        <Ionicons name="person" color="#000" size={24} />
                                                      )}}/>

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
        <Stack.Screen name="Skills" component={SkillsScreen}/>
        <Stack.Screen name="Projects" component={ProjectsScreen}/>

      </Stack.Navigator>
    )
}
export default JobSeekerTab