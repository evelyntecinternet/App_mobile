import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Importa o Firestore configurado
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: false,
    }),
});
export default function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    const Notification = async () => {
        const {status} = await  Notifications.requestPermissionsAsync();
        if (status !== 'granted'){
            const { status: newStatus} = await Notifications.getPermissionsAsync();
            if (newStatus !== 'granted'){
                Alert.alert('Permissão de notificação Negada!');
                return;    
            }
        }
    };

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: name,
                body: 'Notificação Recebida com Sucesso!!!',
            },
            //trigger: { seconds: 1},
            trigger: null
        });
    };

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

    const addUser = async () => {
        if (!name) {
            Alert.alert('Erro', 'O nome não pode ser nulo');
            return;
        }
        try {
            const newUser = { name, email, phone };
            await addDoc(collection(db, 'users'), newUser);
            fetchUsers();
            sendNotification();
            setName('');
            setEmail('');
            setPhone('');
            
        } catch (error) {
            console.error("Erro ao adicionar usuário: ", error);
        }
    };

    const deleteUser = async (userId) => {
        Alert.alert(
            'Confirmar',
            'Você tem certeza que deseja deletar este usuário?',
            [
                { text: 'Cancelar', style: 'cancel' },
                {
                    text: 'Deletar',
                    onPress: async () => {
                        try {
                            await deleteDoc(doc(db, 'users', userId));
                            fetchUsers();
                        } catch (error) {
                            console.error("Erro ao deletar usuário: ", error);
                        }
                    }
                }
            ]
        );
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Usuários do Firestore</Text>
            <View style={styles.form}>
                <TextInput placeholder="Nome" value={name} onChangeText={setName} style={styles.input} />
                <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
                <TextInput placeholder="Telefone" value={phone} onChangeText={setPhone} style={styles.input} keyboardType="phone-pad" />
                <TouchableOpacity style={styles.button} onPress={addUser}>
                    <Text style={styles.buttonText}>Adicionar Usuário</Text>
                </TouchableOpacity>
            </View>
            {users.map(user => (
                <View key={user.id} style={styles.userCard}>
                    {user.name && <Text style={styles.userName}>Nome: {user.name}</Text>}
                    {user.email && <Text>Email: {user.email}</Text>}
                    {user.phone && <Text>Telefone: {user.phone}</Text>}
                    <TouchableOpacity style={styles.deleteButton} onPress={() => deleteUser(user.id)}>
                        <Text style={styles.buttonText}>Deletar</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#EAEAEA',
        flex: 1,
    },
    title: {
        fontSize: 26,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#333',
    },
    form: {
        marginVertical: 20,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#C0C0C0',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#FAFAFA',
    },
    userCard: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    button: {
        backgroundColor: '#28A745',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#DC3545',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
});
