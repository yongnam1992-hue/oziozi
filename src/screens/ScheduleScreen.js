import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert } from 'react-native';
import i18n from '../utils/i18n';
import { addMilestone, getMilestones } from '../services/scheduleService';

const ScheduleScreen = () => {
    const [milestones, setMilestones] = useState([]);
    const [newTitle, setNewTitle] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchMilestones = async () => {
        try {
            const data = await getMilestones();
            setMilestones(data);
        } catch (error) {
            console.error(error);
            // Alert.alert("Error", "Failed to fetch milestones. Check console.");
        }
    };

    useEffect(() => {
        // Uncomment the line below when Firebase is correctly configured with valid keys
        // fetchMilestones();
    }, []);

    const handleAddMilestone = async () => {
        if (!newTitle.trim()) return;
        setLoading(true);
        try {
            await addMilestone(newTitle, new Date());
            setNewTitle('');
            await fetchMilestones();
            Alert.alert("Success", "Milestone added!");
        } catch (error) {
            console.error(error);
            Alert.alert("Error", "Failed to add milestone. Make sure Firebase config is valid.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>{i18n.t('schedule')}</Text>

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="새로운 일정 입력 (예: 상견례)"
                    value={newTitle}
                    onChangeText={setNewTitle}
                />
                <Button title="추가" onPress={handleAddMilestone} disabled={loading} />
            </View>

            <FlatList
                data={milestones}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <Text style={styles.itemTitle}>{item.title}</Text>
                        <Text style={styles.itemDate}>{item.date?.toDate().toLocaleDateString()}</Text>
                    </View>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>일정이 없습니다. Firebase 설정을 확인하세요.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    inputContainer: {
        flexDirection: 'row',
        marginBottom: 20,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 10,
        marginRight: 10,
        borderRadius: 5,
    },
    item: {
        padding: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    itemTitle: {
        fontSize: 18,
    },
    itemDate: {
        color: '#888',
        marginTop: 5,
    },
    emptyText: {
        textAlign: 'center',
        marginTop: 20,
        color: '#999',
    },
});

export default ScheduleScreen;
