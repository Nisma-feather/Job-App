import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Job Seeker
import JobSeekerLoginScreen from './screens/JobSeekerLogin';
import PersonalInfoScreen from './screens/PersonalInfoScreen';
import HomeScreen from './screens/HomeScreen';
import EducaionScreen from './screens/EducaionScreen';
import SkillsScreen from './screens/SkillsScreen';
import ExperienceScreen from './screens/ExperienceScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import CompanyLogin from './companyScreens/CompanyLogin';
import CompanySignUp from './companyScreens/CompanySignUp';
import CompanyDashboard from './companyScreens/CompanyDashboard';

// Company 
const Stack=createNativeStackNavigator();

const JobSeekerStack=()=>{
  return(

  
  <Stack.Navigator initialRouteName="Login">
    <Stack.Screen name="Login" component={JobSeekerLoginScreen}/>
      <Stack.Screen name="Personal Information" component={PersonalInfoScreen} />
      <Stack.Screen name="Home" component={HomeScreen}/>
      <Stack.Screen name="Education" component={EducaionScreen}/>
      <Stack.Screen name="Skills" component={SkillsScreen}/>
      <Stack.Screen name="Experience" component={ExperienceScreen}/>
  </Stack.Navigator>
  );
}
const CompanyStack=()=>{
  return (
  <Stack.Navigator initialRouteName='CompanyLogin'>
     <Stack.Screen name="CompanyLogin" component={CompanyLogin}/>
     <Stack.Screen name="CompanySignUp" component={CompanySignUp}/>
     <Stack.Screen name='CompanyDashboard' component={CompanyDashboard}/>

  </Stack.Navigator>
  );
}

export default function App() {
  return (
   <NavigationContainer>
    <Stack.Navigator initialRouteName='Role'>
      <Stack.Screen name="Role" component={RoleSelectionScreen}/>
      <Stack.Screen name="JobSeekerStack" component={JobSeekerStack} options={{headerShown:false}}/>
      <Stack.Screen name="CompanyStack" component={CompanyStack} options={{headerShown:false}}/>
      
    </Stack.Navigator>
   </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
