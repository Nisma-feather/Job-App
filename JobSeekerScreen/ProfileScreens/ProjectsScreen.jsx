import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProjectsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Projects Screen</Text>
    </View>
  );
};

export default ProjectsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 24 },
});
