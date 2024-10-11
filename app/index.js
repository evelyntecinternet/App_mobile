import { Text, View, Image, Pressable, StyleSheet,ScrollView,TouchableOpacity } from "react-native";
import { Link } from 'expo-router';
export default function Index() {
  return (
    <ScrollView>
    <View
      style={{
        flex: 1,
        alignItems: "center",
        
      }}
      
    >

      
      <Image
        style={{
          width: 200,
          height: 200,
          borderRadius: 200,
          margin: 20,
        }}
        source={require('../assets/images/filme.png')}
      />

         
         <Link href="/firebase" style={styles.button} asChild>
          
          <Pressable>

            <Text style={styles.buttonText}>
              Banco de dados
            </Text>
            </Pressable>
         
        </Link>
        <Link href="/firebaseCrud" style={styles.button} asChild>
          
          <Pressable>

            <Text style={styles.buttonText}>
              Formulário
            </Text>
            </Pressable>
         
        </Link>
    </View>
    </ScrollView>
  );
}
const styles = StyleSheet.create({

  button: {
    // position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    margin: 10,
    backgroundColor: 'black',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 15,
    marginTop: 45,
  },
  buttonText: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
});