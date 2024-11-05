import { Text, View, Button, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Pantry Planner!</Text>
      </View>
      <View>
      <Button
        onPress={() => {}}
        title="Get Started"
        color={styles.buttonColor.color}
      />
      <Button
        onPress={() => {}}
        title="Existing User"
        color={styles.buttonColor.color}
      />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around",
    backgroundColor: "#f5f5f5",
  },
  header: {
    alignItems: "center",
    paddingTop: 60, 
    marginBottom: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  buttonContainer: {
    flex:1,
    justifyContent: "space-between",
    alignItems: "center",
  },
  buttonColor: {
    color: "#007AFF",
  },
});
