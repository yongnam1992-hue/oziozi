import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ScrollView } from 'react-native';
import i18n, { formatKRW } from '../utils/i18n';

const DUMMY_VENUES = [
    { id: '1', name: '그랜드 호텔', hallFee: 5000000, mealCost: 80000, minGuarantee: 250, score: 4.5 },
    { id: '2', name: '노블레스 웨딩', hallFee: 3000000, mealCost: 65000, minGuarantee: 200, score: 4.2 },
    { id: '3', name: '가든 파티', hallFee: 4000000, mealCost: 75000, minGuarantee: 150, score: 4.8 },
    { id: '4', name: '채플 웨딩', hallFee: 2000000, mealCost: 55000, minGuarantee: 300, score: 3.9 },
];

const VenueScreen = () => {
    const [venues, setVenues] = useState(DUMMY_VENUES);
    const [sortKey, setSortKey] = useState(null);
    const [sortOrder, setSortOrder] = useState('asc');

    const handleSort = (key) => {
        const newOrder = sortKey === key && sortOrder === 'asc' ? 'desc' : 'asc';
        setSortKey(key);
        setSortOrder(newOrder);

        const sorted = [...venues].sort((a, b) => {
            if (a[key] < b[key]) return newOrder === 'asc' ? -1 : 1;
            if (a[key] > b[key]) return newOrder === 'asc' ? 1 : -1;
            return 0;
        });
        setVenues(sorted);
    };

    const renderHeader = () => (
        <View style={styles.headerRow}>
            <TouchableOpacity style={[styles.cell, styles.nameCell]} onPress={() => handleSort('name')}>
                <Text style={styles.headerText}>이름 {sortKey === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cell} onPress={() => handleSort('hallFee')}>
                <Text style={styles.headerText}>대관료 {sortKey === 'hallFee' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cell} onPress={() => handleSort('mealCost')}>
                <Text style={styles.headerText}>식대 {sortKey === 'mealCost' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cell} onPress={() => handleSort('score')}>
                <Text style={styles.headerText}>평점 {sortKey === 'score' && (sortOrder === 'asc' ? '↑' : '↓')}</Text>
            </TouchableOpacity>
        </View>
    );

    const renderItem = ({ item }) => (
        <View style={styles.row}>
            <Text style={[styles.cell, styles.nameCell]}>{item.name}</Text>
            <Text style={styles.cell}>{formatKRW(item.hallFee)}</Text>
            <Text style={styles.cell}>{formatKRW(item.mealCost)}</Text>
            <Text style={styles.cell}>{item.score}</Text>
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>{i18n.t('venue')}</Text>
            <Text style={styles.subtitle}>항목을 눌러 정렬할 수 있습니다.</Text>

            <ScrollView horizontal>
                <View>
                    {renderHeader()}
                    <FlatList
                        data={venues}
                        keyExtractor={(item) => item.id}
                        renderItem={renderItem}
                    />
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    subtitle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 20,
    },
    headerRow: {
        flexDirection: 'row',
        backgroundColor: '#f4f4f4',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ddd',
    },
    row: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    cell: {
        width: 100,
        justifyContent: 'center',
        alignItems: 'center',
        textAlign: 'center',
        fontSize: 14,
    },
    nameCell: {
        width: 120,
        fontWeight: 'bold',
    },
    headerText: {
        fontWeight: 'bold',
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
});

export default VenueScreen;
