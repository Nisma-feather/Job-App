import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import { db, auth } from '../firebaseConfig';
import { collection, query, where, onSnapshot, updateDoc, doc } from 'firebase/firestore';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentPopup, setCurrentPopup] = useState(null);

  useEffect(() => {
    const companyUID = auth.currentUser?.uid;

    if (!companyUID) return;

    const q = query(
      collection(db, 'jobApplications'),
      where('companyUID', '==', companyUID)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newNotifications = [];

      snapshot.docChanges().forEach((change) => {
        if (change.type === 'added') {
          const data = change.doc.data();
          if (!data.notified) {
            newNotifications.push({ id: change.doc.id, ...data });
          }
        }
      });

      if (newNotifications.length > 0) {
        setCurrentPopup(newNotifications[0]);
        setPopupVisible(true);
        setNotifications((prev) => [...newNotifications, ...prev]);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleDismiss = async () => {
    setPopupVisible(false);

    if (currentPopup) {
      const docRef = doc(db, 'jobApplications', currentPopup.id);
      await updateDoc(docRef, { notified: true });
    }

    setCurrentPopup(null);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.notificationCard}>
            <Text style={styles.text}>{item.userName} applied for a job!</Text>
          </View>
        )}
      />

      <Modal visible={popupVisible} transparent animationType="slide">
        <View style={styles.popup}>
          <Text style={styles.popupText}>{currentPopup?.userName} just applied!</Text>
          <TouchableOpacity style={styles.popupButton} onPress={handleDismiss}>
            <Text style={styles.popupButtonText}>Dismiss</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </View>
  );
};

export default Notifications;
const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 15,
    },
    notificationCard: {
      backgroundColor: '#eef',
      padding: 15,
      marginVertical: 8,
      borderRadius: 8,
    },
    text: {
      fontSize: 16,
    },
    popup: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    popupText: {
      backgroundColor: 'white',
      padding: 20,
      borderRadius: 10,
      fontSize: 18,
    },
    popupButton: {
      marginTop: 10,
      backgroundColor: '#2196F3',
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 6,
    },
    popupButtonText: {
      color: 'white',
      fontWeight: 'bold',
    },
  });
  