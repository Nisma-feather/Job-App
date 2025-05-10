import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const ExperienceLevelScreen = ({ selected, onSelect }) => {
  const experienceLevels = [
    'Entry Level',
    'Mid Level',
    'Senior Level',
    'Student'
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>What's your experience level?</Text>
      <View style={styles.optionsContainer}>
        {experienceLevels.map((level) => (
          <TouchableOpacity
            key={level}
            style={[
              styles.option,
              selected === level && styles.selectedOption
            ]}
            onPress={() => onSelect(level)}
          >
            <Text style={styles.optionText}>{level}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

// Use similar styles as JobTypeScreen or customize as needed
export default ExperienceLevelScreen;

const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      padding: 20,
      backgroundColor:'white',
    borderTopRightRadius:20,
    borderTopLeftRadius:20
    },
    title: {
      fontSize: 22,
      fontWeight: 'bold',
      marginBottom: 30,
      textAlign: 'center',
    },
    optionsContainer: {
      marginBottom: 30,
    },
    option: {
      padding: 15,
      borderWidth: 1,
      borderColor: '#ddd',
      borderRadius: 8,
      marginBottom: 10,
      backgroundColor: '#fff',
    },
    selectedOption: {
      backgroundColor: '#e6f0ff',
      borderColor: '#1967d2',
    },
    optionText: {
      fontSize: 16,
      textAlign: 'center',
    },
  });