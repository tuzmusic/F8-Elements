import React from "react";
import { Text, View, Button } from "react-native";
import { ThemeProvider } from "react-native-elements";

const styles = {
  text: {
    fontSize: 18,
    padding: 5,
    paddingTop: 15
  },
  bug: { paddingLeft: 25 }
};

const WelcomeView = props => (
  <View style={{ flex: 1, justifyContent: "center", padding: 10 }}>
    <Text style={{ textAlign: "center", fontSize: 24 }}>
      Welcome to the latest version of ELECTRO
    </Text>
    <Text style={styles.text}>
      This development edition ships with stations located around Apple HQ in
      Cupertino, CA.
    </Text>
    <Text style={styles.text}>
      To see these stations, hit the Cupertino button in the lower right-hand
      corner.
    </Text>
    <Text style={styles.text}>
      We do not yet download stations from the website in this version.
    </Text>
    <Text style={styles.text}>Some bugs to expect:</Text>
    <Text style={[styles.text, styles.bug]}>
      Search region only changes when searching a location from the map, or
      hitting the "Find Me" button. (not when moving or zooming the map
      manually)
    </Text>
    <Text style={[styles.text, styles.bug]}>
      Pressing a station on the map will not move the station's marker into
      view.
    </Text>
    <Button
      style={styles.text}
      title="Let's Go!"
      onPress={() => props.navigation.navigate("Main")}
    />
  </View>
);

export default WelcomeView;
