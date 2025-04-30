
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import HomeScreen from "./HomeScreen";
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
        <Tab.Navigator screenOptions={{headerShown:false}} initialRouteName="Find Jobs">
            <Tab.Screen name="Home" component={HomeScreen}/>
            <Tab.Screen name="BookMark" component={BookMarkScreen}/>
            <Tab.Screen name="Find Jobs" component={FindJobsStack}/>
            <Tab.Screen name="Profile" component={ProfileStack}/>

        </Tab.Navigator>

    )

}
const FindJobsStack=()=>{
  return(
    <Stack.Navigator>
      <Stack.Screen name="Jobs" component={FindJobScreen}/>
      <Stack.Screen name="Job Details" component={JobDetail}/>
    </Stack.Navigator>
  )
}
const ProfileStack=()=>{
    return(
      <Stack.Navigator initialRouteName="Projects">
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