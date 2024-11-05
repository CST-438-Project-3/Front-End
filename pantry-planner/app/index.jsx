import { Text, View, Button, StyleSheet, ImageBackground, Pressable } from "react-native";
import { useNavigation } from '@react-navigation/native';



const Index = () => {
  const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
      <ImageBackground
        source={require('@/assets/images/index.png')}
        resizeMode="cover"
        style={styles.image}
      >
     
      <View style={styles.header}>
        <Text style={styles.title}>PantryPal</Text>
      </View>
      <View style={styles.buttonContainer}>
        <Button
          onPress={() => 
            navigation.navigate('SignUp')
          }
          title="Get Started"
          style={styles.button}
          color={styles.button.color}
        />
        <Button
          onPress={() => {}}
          title="Existing User"
          color={styles.button.color}
        />
      </View>
      </ImageBackground>
    </View>
  );
};

export default Index;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f5f5f5",
  },
  image: {
    width: "100%",
    flex: 1,
    justifyContent: 'center',
  },
  header: {
    alignItems: "center",
    paddingTop: 60, 
    marginBottom: 40,
  },
  title: {
    fontSize: 50,
    color:"#FFFFFF",
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flex:1,
    justifyContent: "space-around",
    alignItems: "center",
  },
  button: {
    borderRadius: 40,
    color: "#007AFF",
  },
});
