import React from 'react'
import { View } from 'react-native'

const HomeScreen = ({navigation,route}) => {
  console.log(route.params.uid);
  return (
    <View>
        Home Screen
    </View>
  )
}

export default HomeScreen
