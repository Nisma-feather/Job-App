import React from 'react'
import {View,Text} from 'react-native'

const CompanyDashboard = ({route}) => {
    console.log(route.params.uid);
  return (
  <View>
    Company Dashboard
  </View>
  )
}

export default CompanyDashboard
