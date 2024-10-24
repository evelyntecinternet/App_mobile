import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Alert } from 'react-native';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import { db } from './firebaseConfig'; // Importa o Firestore configurado

export default function App() {
const [users, setUsers] = useState([]);
const fetchUsers = async () => {
    try {
        const usersCollection = collection(db, 'users');
        const usersSnapshot = await getDocs(usersCollection);
        const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
    } catch (error) {
        console.error("Erro ao buscar usuários: ", error);
    }
};

const listenForNewUsers = () => {
    const usersCollection = collection(db, 'users');
    onSnapshot(usersCollection, (snapshot) => {
        const usersList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(usersList);
        // Aqui, você pode usar a lógica de notificação
        Alert.alert("Novo Usuário Adicionado", "Um novo usuário foi adicionado à coleção.");
    });
};

useEffect(() => {
    fetchUsers();
    listenForNewUsers();

    const requestUserPermission = async () => {
        const authStatus = await messaging().requestPermission();
        const enabled =
            authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
            authStatus === messaging.AuthorizationStatus.PROVISIONAL;

        if (enabled) {
            console.log('Permissão para notificações concedida.');
        }
    };

    requestUserPermission();

    // Subscribing to notifications (optional)
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('Uma nova notificação chegou!', JSON.stringify(remoteMessage));
    });

    return unsubscribe;
}, []);

return (
    <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Usuários do Firestore</Text>
        {users.map(user => (
            <View key={user.id} style={{ marginVertical: 10 }}>
                {user.name && (
                    <Text style={{ fontSize: 18 }}>Nome: {user.name}</Text>
                )}
                {user.email && (
                    <Text>Email: {user.email}</Text>
                )}
                {user.phone && (
                    <Text>Telefone: {user.phone}</Text>
                )}
            </View>
        ))}
    </View>
);
}