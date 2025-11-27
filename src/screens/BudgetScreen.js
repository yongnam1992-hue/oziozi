import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Button, FlatList, Alert, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import i18n, { formatKRW } from '../utils/i18n';
import { addExpense, getExpenses, deleteExpense } from '../services/budgetService';
import * as Notifications from 'expo-notifications';

const screenWidth = Dimensions.get('window').width;

const BudgetScreen = () => {
    const [expenses, setExpenses] = useState([]);
    const [item, setItem] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('General');
    const [loading, setLoading] = useState(false);
    const [totalBudget, setTotalBudget] = useState(30000000); // Example Target: 30 Million KRW

    const fetchExpenses = async () => {
        try {
            const data = await getExpenses();
            setExpenses(data);
            checkBudgetOverrun(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        // Uncomment when Firebase is ready
        // fetchExpenses();

        // Dummy Data for UI visualization if no firebase
        if (expenses.length === 0) {
            setExpenses([
                { id: '1', category: 'Venue', amount: 5000000, color: '#FF6384', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                { id: '2', category: 'Dress', amount: 2000000, color: '#36A2EB', legendFontColor: '#7F7F7F', legendFontSize: 15 },
                { id: '3', category: 'Food', amount: 8000000, color: '#FFCE56', legendFontColor: '#7F7F7F', legendFontSize: 15 },
            ]);
        }
    }, []);

    const checkBudgetOverrun = async (currentExpenses) => {
        const totalSpent = currentExpenses.reduce((sum, ex) => sum + Number(ex.amount), 0);
        if (totalSpent > totalBudget) {
            await Notifications.scheduleNotificationAsync({
                content: {
                    title: "예산 초과 경고! 🚨",
                    body: `현재 지출(${formatKRW(totalSpent)})이 목표 예산(${formatKRW(totalBudget)})을 초과했습니다.`,
                },
                trigger: null, // Immediate
            });
        }
    };

    const handleAdd = async () => {
        if (!item || !amount) return;
        setLoading(true);
        try {
            await addExpense(category, item, amount);
            setItem('');
            setAmount('');
            await fetchExpenses();
        } catch (error) {
            Alert.alert("Error", "Failed to add expense");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            await deleteExpense(id);
            await fetchExpenses();
        } catch (error) {
            Alert.alert("Error", "Failed to delete");
        }
    };

    // Prepare Chart Data
    const chartData = expenses.map((ex, index) => ({
        name: ex.category || ex.item || 'Etc',
        population: Number(ex.amount),
        color: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'][index % 5],
        legendFontColor: '#7F7F7F',
        legendFontSize: 12,
    }));

    const totalSpent = expenses.reduce((sum, ex) => sum + Number(ex.amount), 0);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.header}>{i18n.t('budget')}</Text>

            <View style={styles.chartContainer}>
                <PieChart
                    data={chartData}
                    width={screenWidth - 40}
                    height={220}
                    chartConfig={{
                        backgroundColor: '#1cc910',
                        backgroundGradientFrom: '#eff3ff',
                        backgroundGradientTo: '#efefef',
                        color: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                    }}
                    accessor="population"
                    backgroundColor="transparent"
                    paddingLeft="15"
                    absolute
                />
                <Text style={styles.summaryText}>
                    총 지출: {formatKRW(totalSpent)} / {formatKRW(totalBudget)}
                </Text>
            </View>

            <View style={styles.inputContainer}>
                <TextInput style={styles.input} placeholder="항목 (예: 드레스)" value={item} onChangeText={setItem} />
                <TextInput style={styles.input} placeholder="금액" value={amount} onChangeText={setAmount} keyboardType="numeric" />
                <Button title="추가" onPress={handleAdd} disabled={loading} />
            </View>

            <FlatList
                data={expenses}
                keyExtractor={(item) => item.id}
                scrollEnabled={false}
                renderItem={({ item }) => (
                    <View style={styles.item}>
                        <View>
                            <Text style={styles.itemText}>{item.item || item.category}</Text>
                            <Text style={styles.itemSub}>{item.category}</Text>
                        </View>
                        <View style={styles.rightAction}>
                            <Text style={styles.amountText}>{formatKRW(item.amount)}</Text>
                            <TouchableOpacity onPress={() => handleDelete(item.id)}>
                                <Text style={styles.deleteText}>삭제</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#fff' },
    header: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
    chartContainer: { alignItems: 'center', marginBottom: 20 },
    summaryText: { fontSize: 18, fontWeight: '600', marginTop: 10, color: '#333' },
    inputContainer: { flexDirection: 'row', marginBottom: 20, gap: 10 },
    input: { flex: 1, borderWidth: 1, borderColor: '#ccc', padding: 10, borderRadius: 5 },
    item: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, borderBottomWidth: 1, borderColor: '#eee', alignItems: 'center' },
    itemText: { fontSize: 16 },
    itemSub: { fontSize: 12, color: '#888' },
    rightAction: { flexDirection: 'row', alignItems: 'center', gap: 10 },
    amountText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
    deleteText: { color: 'red', fontSize: 14 },
});

export default BudgetScreen;
