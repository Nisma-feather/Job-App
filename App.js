import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// Job Seeker
import JobSeekerLoginScreen from './screens/JobSeekerLogin';
import ExperienceScreen from './screens/ExperienceScreen';
import RoleSelectionScreen from './screens/RoleSelectionScreen';
import CompanyLogin from './companyScreens/CompanyLogin';
import CompanySignUp from './companyScreens/CompanySignUp';
import CompanyDashboard from './companyScreens/CompanyDashboard';
import { JobPostSucessScreen } from './companyScreens/PostJob';
import JobSeekerTab from './JobSeekerScreen/JobSeekerTab';
import JobDetail from './JobSeekerScreen/JobDetail';
import ApplyJob, { JobApplicationSuccess } from './JobSeekerScreen/ApplyJob';
import JobTypeScreen from './screens/UserInterest';
import SignupScreen from './screens/SignupScreen';
import BasicDetailsScreen from './screens/BasicDetailsScreen';
import UserInterestForm from './screens/UserInterest';
import CompanyDetails from './companyScreens/CompanyDetails';




// Company 
const Stack=createNativeStackNavigator();

const JobSeekerStack=()=>{
  return(

  
  <Stack.Navigator initialRouteName="Login" options={{headerShown:false}}>
    <Stack.Screen name="Login" component={JobSeekerLoginScreen}/>
      <Stack.Screen name="SignUp" component={SignupScreen}/>
      <Stack.Screen name="JobSeeker Dashboard" component={JobSeekerTab}/>
      <Stack.Screen name="Experience" component={ExperienceScreen}/>
      <Stack.Screen name='Job Details' component={JobDetail}/>
      <Stack.Screen name="Apply Job" component={ApplyJob}/>
      <Stack.Screen name='Job Type' component={JobTypeScreen}/>
      <Stack.Screen name="Basic Info" component={BasicDetailsScreen}/>
      <Stack.Screen name="User Interest" component={UserInterestForm}/>

  
      <Stack.Screen name="Application successfull" component={JobApplicationSuccess}/>
      
  </Stack.Navigator>
  );
}
const CompanyStack=()=>{
  return (
  <Stack.Navigator initialRouteName='CompanyDashboard' screenOptions={{headerShown:false}}>
    <Stack.Screen name='Company Details' component={CompanyDetails}/>
     <Stack.Screen name="CompanyLogin" component={CompanyLogin}/>
     <Stack.Screen name="CompanySignUp" component={CompanySignUp}/>
     <Stack.Screen name='CompanyDashboard' component={CompanyDashboard}/>
     <Stack.Screen name="Job Post Success" component={JobPostSucessScreen}/>
     
     

  </Stack.Navigator>
  );
}

export default function App() {
  return (
   <NavigationContainer>
    <Stack.Navigator initialRouteName='CompanyStack' >
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
