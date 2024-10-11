import React, { useState, useEffect } from 'react';
import { View, Text, FlatList } from 'react-native';
import { collection, getDocs, onSnapshot  } from 'firebase/firestore';
import { db } from './firebaseConfig'; // Importa o Firestore configurado
 
export default function App() {
    const [users, setUsers] = useState([]);

const fetchUsers = async () => { // Função assíncrona (async) - não bloqueia a execução do restante do código enquanto espera pela resposta
        try {
            const usersCollection = collection(db, 'users'); // A função collection é usada para fazer referência à coleção "users" dentro do banco de dados Firestore.
            const usersSnapshot = await getDocs(usersCollection);
            const usersList = usersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
            setUsers(usersList);
        } catch (error) {
            console.error("Erro ao buscar usuários: ", error);
        }
    };
    useEffect(() => {
        fetchUsers();
    }, []);

return (
        <View style={{ padding: 20 }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Usuários do Firestore</Text>
            {users.map(user => (
                <View key={user.id} style={{ marginVertical: 10 }}>
                    {/* Verifica se o campo "name" existe */}
                    {user.name && (
                        <Text style={{ fontSize: 18 }}>Nome: {user.name}</Text>
                    )}
                    {/* Verifica se o campo "email" existe */}
                    {user.email && (
                        <Text>Email: {user.email}</Text>
                    )}
                    {/* Verifica se o campo "phone" existe */}
                    {user.phone && (
                        <Text>Telefone: {user.phone}</Text>
                    )}
                </View>
            ))}

        </View>
    );
}