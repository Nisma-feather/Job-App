import React, { useEffect, useState } from 'react'
import { TouchableOpacity, ScrollView, SafeAreaView,Image, View, Text, StyleSheet, FlatList, Pressable } from 'react-native'
import { Ionicons, Feather, Entypo, MaterialCommunityIcons } from '@expo/vector-icons';
import { auth, db } from '../firebaseConfig';
import { CommonActions } from '@react-navigation/native';
import { collection, getDocs, query, where } from 'firebase/firestore';





const PostJobHome = ({navigation}) => {
    const [postedjobs, setPostedJobs] = useState([]);

    const fetchPostedJobs = async () => {
        const companyUID = auth.currentUser?.uid || "vm5dkIUfk0WxgnXT34QBttxA3kV2";
        if (!companyUID) {
            return
        }
        try {
            const q = query(collection(db, 'jobs'), where('companyUID', '==', companyUID));
            const snapData = await getDocs(q);
            const fetchedjobs = [];
            snapData.forEach((doc) => {
                fetchedjobs.push({ id: doc.id, ...doc.data() })
            })
            console.log(fetchedjobs)
            setPostedJobs(fetchedjobs);
        }
        catch (e) {
            console.log(e)
        }
    }
    const formatDate = (date) => {
        const posted = date.toDate();
        const now = new Date();
        const diffDate = Math.floor((now - posted) / (1000 * 60 * 60 * 24));
        if (diffDate === 0) {
            const diffHour = Math.floor((now - posted) / (100 * 60 * 60));
            if (diffHour === 0) {
                const diffMinute = Math.floor((now - posted) / (1000 * 60))
                return diffMinute === 1 ? '1 min ago' : `${diffMinute}s ago`
            }
            return diffHour === 1 ? '1 hr ago' : `${diffHour}s ago`

        }
        return diffDate === 1 ? '1 day ago' : `${diffDate}days ago`
    }
    useEffect(() => {
        fetchPostedJobs()
    }, [])
    console.log(postedjobs)
    return (
        <SafeAreaView style={styles.container}>
            <ScrollView style={{ padding: 15 }}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>
                        Post New Job
                    </Text>
                </TouchableOpacity>
                <View>
                    <Text style={styles.heading}>
                        Recently Posted Job
                    </Text>
                    <View>
                        <FlatList data={postedjobs}
                            renderItem={({ item }) => (
                                <View style={styles.jobCard}>
                                    <View style={{flexDirection:'row',justifyContent:'space-between'}}>
                                        <Text style={styles.jobTitle}>{item.jobrole}</Text>
                                        <View style={styles.metaRow}>
                                            <Pressable onPress={()=>navigation.navigate("Edit Job",{JobId:item.id})}>
                                            <Image source={require('../assets/edit.png')} style={{height:22,width:22}}/>

                                            </Pressable>
                                            <Pressable>
                                            <Image source={require('../assets/delete.png')} style={{height:22,width:22}}/>

                                            </Pressable>
                                            
                                            
                                        </View>

                                    </View>



                                    <View style={styles.bottomcard}>
                                        <View style={styles.metaRow}>
                                            <Entypo name="location-pin" color="#9ca4b5" size={18} />
                                            <Text style={styles.metaText}>{item.locations}</Text>
                                        </View>
                                        <Text style={styles.metaText}>{formatDate(item.postedAt)}</Text>

                                    </View>

                                </View>
                            )}
                            ItemSeparatorComponent={() => <View style={styles.jobContainer}></View>} />

                    </View>
                </View>

            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    button: {
        backgroundColor: '#2563EB',
        paddingVertical: 14,
        borderRadius: 8,
        marginVertical: 10
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        textAlign: 'center',
    },
    heading: {
        fontWeight: 'bold',
        fontSize: 14,
        marginVertical: 10,
    },
    jobCard: {
        // backgroundColor: '#e6eefa',
        padding: 16,
        borderRadius: 5,
        borderWidth: 1,
        borderColor: '#2563EB',
        shadowColor: '#2563EB',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.25,
        shadowRadius: 10,
        elevation: 6, // For Android
    },
    jobTitle: {
        fontWeight: 'bolder',
        color: "#555"
    },
    jobContainer: {
        height: 15
    },
    metaRow: {
        flexDirection: 'row',
        gap: 3
    },
    metaText: {
        fontSize: 11,
        color: '#333',

    },
    bottomcard: {
        borderTopWidth: 1,
        borderTopColor: '#2563EB',
        marginTop: 15,
        paddingTop: 5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
})

export default PostJobHome
