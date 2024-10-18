// expo install expo-notifications
import React, { useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import { Button, View } from 'react-native';

Notifications.setNotificationHandler({ // setNotificationHandler: Define como as notificações serão tratadas no app.
  handleNotification: async () => ({ 
    shouldShowAlert: true, // shouldShowAlert: Define se a notificação deve ser exibida como um alerta visual.
    shouldPlaySound: true, //shouldPlaySound: Define se a notificação deve reproduzir som.
    shouldSetBadge: false, //houldSetBadge: Define se a notificação deve alterar o número de ícones de notificação (badge) no ícone do app (geralmente em iOS).
  }),
});

export default function App() {
    useEffect(() => {
        const checkNotificationPermissions = async () => {
            const { status } = await Notifications.getPermissionsAsync();
            if (status !== 'granted') {
                const { status: newStatus } = await Notifications.requestPermissionsAsync();
                if (newStatus !== 'granted') {
                    alert('Permissão de notificação negada!');
                    return;
                }
            }
        };

        checkNotificationPermissions();
    }, []);

    const sendNotification = async () => {
        await Notifications.scheduleNotificationAsync({
            content: {
                title: "Notificação React",
                body: 'Notificação Recebida com Sucesso!!!',
            },
            trigger: null,
        });
    };

    return (
        <View>
            <Button title="Enviar Notificação" onPress={sendNotification} />
        </View>
    );
}