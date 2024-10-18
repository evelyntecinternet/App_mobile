import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Alert, TextInput, Image, TouchableOpacity, Button } from 'react-native';
import * as Contacts from 'expo-contacts';

export default function ContactsScreen() {
    const [contacts, setContacts] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredContacts, setFilteredContacts] = useState([]);
    const [selectedContact, setSelectedContact] = useState(null);
    const [favorites, setFavorites] = useState([]);
    const [messageHistory, setMessageHistory] = useState([]);

    useEffect(() => {
        const fetchContacts = async () => {
            const { status } = await Contacts.requestPermissionsAsync();

            if (status === 'granted') {
                const { data } = await Contacts.getContactsAsync({
                    fields: [Contacts.Fields.Name, Contacts.Fields.PhoneNumbers],
                });

                if (data.length > 0) {
                    const sortedContacts = data.sort((a, b) => {
                        if (a.name && b.name) {
                            return a.name.localeCompare(b.name);
                        }
                        return 0;
                    });
                    setContacts(sortedContacts);
                    setFilteredContacts(sortedContacts);
                } else {
                    Alert.alert('Nenhum contato encontrado.');
                }
            } else {
                Alert.alert('Permissão para acessar contatos foi negada.');
            }
        };

        fetchContacts();
    }, []);

    useEffect(() => {
        const results = contacts.filter(contact =>
            contact.name.toLowerCase().includes(searchQuery.toLowerCase())
        );
        setFilteredContacts(results);
    }, [searchQuery, contacts]);

    const handleContactPress = (contact) => {
        setSelectedContact(contact);
    };

    const sendMessage = () => {
        if (selectedContact) {
            alert(`Mensagem enviada para ${selectedContact.name}!`);
            setMessageHistory(prev => [...prev, { name: selectedContact.name, number: selectedContact.phoneNumbers ? selectedContact.phoneNumbers[0].number : 'N/A' }]);
            setSelectedContact(null); // Limpa a seleção após o envio da mensagem
        }
    };

    const toggleFavorite = (contactId) => {
        if (favorites.includes(contactId)) {
            setFavorites(favorites.filter(id => id !== contactId)); // Remove do favorito
        } else {
            setFavorites([...favorites, contactId]); // Adiciona aos favoritos
        }
    };

    const clearMessageHistory = () => {
        setMessageHistory([]);
        Alert.alert('Histórico limpo!', 'O histórico de mensagens foi apagado.');
    };

    const deleteMessage = (index) => {
        setMessageHistory(prev => {
            const newHistory = [...prev];
            newHistory.splice(index, 1); // Remove a mensagem no índice
            return newHistory;
        });
    };

    const renderContact = ({ item }) => (
        <TouchableOpacity onPress={() => handleContactPress(item)}>
            <View style={styles.contactItem}>
                <Image 
                    source={{ uri: 'https://via.placeholder.com/50' }} 
                    style={styles.contactImage}
                />
                <View style={styles.contactInfo}>
                    <Text style={styles.contactName}>{item.name}</Text>
                    {item.phoneNumbers && item.phoneNumbers.length > 0 && (
                        <Text style={styles.contactPhone}>{item.phoneNumbers[0].number}</Text>
                    )}
                </View>
                <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
                    <Text style={[styles.favoriteButton, favorites.includes(item.id) ? styles.favorited : null]}>
                        {favorites.includes(item.id) ? '⭐' : '☆'}
                    </Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    const renderHistoryItem = ({ item, index }) => (
        <View style={styles.historyItemContainer}>
            <Text style={styles.historyItem}>{item.name} - {item.number}</Text>
            <Button title="Apagar" onPress={() => deleteMessage(index)} color="red" />
        </View>
    );

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Contatos</Text>
            <TextInput
                placeholder="Buscar contatos..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.input}
            />
            <FlatList
                data={filteredContacts}
                renderItem={renderContact}
                keyExtractor={item => item.id}
                style={styles.list}
            />
            {selectedContact && (
                <View style={styles.messageContainer}>
                    <Text style={styles.messageTitle}>Enviar Mensagem para {selectedContact.name}</Text>
                    <Text style={styles.detail}>Telefone: {selectedContact.phoneNumbers ? selectedContact.phoneNumbers[0].number : 'N/A'}</Text>
                    <Button title="Enviar Mensagem" onPress={sendMessage} />
                </View>
            )}
            {messageHistory.length > 0 && (
                <View style={styles.historyContainer}>
                    <Text style={styles.historyTitle}>Histórico de Mensagens</Text>
                    <FlatList
                        data={messageHistory}
                        renderItem={renderHistoryItem}
                        keyExtractor={(item, index) => index.toString()}
                    />
                    <Button title="Limpar Histórico" onPress={clearMessageHistory} />
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
    },
    list: {
        width: '100%',
    },
    contactItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 15,
        marginVertical: 5,
        borderRadius: 5,
        backgroundColor: '#f0f0f0',
    },
    contactImage: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    contactInfo: {
        flex: 1,
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    contactPhone: {
        fontSize: 16,
        color: '#555',
    },
    favoriteButton: {
        fontSize: 24,
        marginLeft: 10,
    },
    favorited: {
        color: 'gold',
    },
    input: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginVertical: 10,
        width: '100%',
        paddingHorizontal: 10,
    },
    messageContainer: {
        marginTop: 20,
        padding: 20,
        borderRadius: 5,
        backgroundColor: '#e0e0e0',
        width: '100%',
    },
    messageTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    detail: {
        fontSize: 18,
        marginBottom: 10,
        color: '#555',
    },
    historyContainer: {
        marginTop: 20,
        padding: 10,
        borderRadius: 5,
        backgroundColor: '#d0d0d0',
        width: '100%',
    },
    historyTitle: {
        fontSize: 20,
        marginBottom: 10,
    },
    historyItemContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 5,
    },
    historyItem: {
        fontSize: 16,
        color: '#333',
    },
});
