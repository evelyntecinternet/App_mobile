import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, ScrollView, Alert, StyleSheet } from 'react-native';
import { collection, getDocs, addDoc, deleteDoc, doc } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Importa o Firestore configurado

export default function App() {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');

    // Função para buscar dados da coleção "users" no Firestore
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

    // Função para adicionar um novo usuário no Firestore
    const addUser = async () => {
        if (!name) {
            Alert.alert('Erro', 'O nome não pode ser nulo');
            return;
        }
        try {
            const newUser = {
                name,
                email,
                phone
            };
            // Adiciona o novo usuário à coleção "users"
            await addDoc(collection(db, 'users'), newUser);
            // Limpa o formulário
            setName('');
            setEmail('');
            setPhone('');
            // Atualiza a lista de usuários
            fetchUsers();
        } catch (error) {
            console.error("Erro ao adicionar usuário: ", error);
        }
    };

    // Função para deletar um usuário do Firestore
    const deleteUser = async (userId) => {
        Alert.alert(
            'Confirmar',
            'Você tem certeza que deseja deletar este usuário?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Deletar',
                    onPress: async () => {
                        try {
                            // Deleta o documento pelo ID
                            await deleteDoc(doc(db, 'users', userId));
                            // Atualiza a lista de usuários
                            fetchUsers();
                        } catch (error) {
                            console.error("Erro ao deletar usuário: ", error);
                        }
                    }
                }
            ]
        );
    };

    // Executa a função ao carregar o componente
    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Usuários do Firestore</Text>
            
            {/* Formulário para adicionar um novo usuário */}
            <View style={styles.form}>
                <TextInput
                    placeholder="Nome"
                    value={name}
                    /* onChangeText={setName} : enquanto vc vai escrevendo no campo, ele vai
                    salvando na varíavel   */
                    onChangeText={setName}
                    style={styles.input}
                />
                <TextInput
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    style={styles.input}
                    keyboardType="email-address"
                />
                <TextInput
                    placeholder="Telefone"
                    value={phone}
                    onChangeText={setPhone}
                    style={styles.input}
                    keyboardType="phone-pad"
                />
                <Button title="Adicionar Usuário" onPress={addUser} />
            </View>

            {/* Renderiza os usuários do Firestore */}
            {users.map(user => (
                <View key={user.id} style={styles.userCard}>
                    {user.name && (
                        <Text style={styles.userName}>Nome: {user.name}</Text>
                    )}
                    {user.email && (
                        <Text>Email: {user.email}</Text>
                    )}
                    {user.phone && (
                        <Text>Telefone: {user.phone}</Text>
                    )}
                    {/* Botão para deletar o usuário */}
                    <Button title="Deletar" onPress={() => deleteUser(user.id)} color="red" />
                </View>
            ))}
        </ScrollView>
    );
}

// Estilos
const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: '#F2F2F2',
        flex: 1
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center'
    },
    form: {
        marginVertical: 20,
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#BFBFBF',
        padding: 10,
        marginBottom: 10,
        borderRadius: 5,
        backgroundColor: '#F9F9F9',
    },
    userCard: {
        marginVertical: 10,
        padding: 15,
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
    userName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
});
