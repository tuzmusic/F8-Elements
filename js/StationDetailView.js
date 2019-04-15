import React, { Component } from "react";
import {
  ScrollView,
  Text,
  View,
  Linking,
  TouchableOpacity,
  Platform
} from "react-native";
import { Image } from "react-native-elements";
import F8StyleSheet from "../js/F8StyleSheet";
import { connect } from "react-redux";
import { getImageForStation } from "../actions/mainActions";
import { MaterialIndicator } from "react-native-indicators";
import HTML from "react-native-render-html";

const CellTextRow = props => (
  <Text style={[{ padding: 2, textAlign: "left" }, props.style]}>
    {props.children}
  </Text>
);

const Spinner = <MaterialIndicator color={"blue"} />;

function openMap(address) {
  let baseURL = "https://www.google.com/maps/search/?api=1&query=";
  // if (Platform.OS === 'ios') baseURL = "http://maps.apple.com/?q="
  Linking.openURL(baseURL + address).catch(err =>
    console.error("An error occurred", err)
  );
}

const StationWebsite = ({ station }) => {
  if (station.website) {
    return (
      <TouchableOpacity
        onPress={() => {
          Linking.openURL(station.website).catch(err =>
            console.error("An error occurred", err)
          );
        }}
      >
        <CellTextRow style={[text.address, text.link]}>
          {station.website}
        </CellTextRow>
      </TouchableOpacity>
    );
  }
  return null;
};

const StationImage = ({ station }) => {
  if (station.mediaID > 0 && (url = station.imageURL)) {
    return (
      <Image
        style={[styles.image, { resizeMode: "cover" }]}
        source={{ uri: url }}
        PlaceholderContent={Spinner}
      />
    );
  } else {
    return (
      <View style={[styles.centered, styles.image]}>
        <Text>No Image Provided</Text>
      </View>
    );
  }
};

class StationDetailView extends Component {
  static navigationOptions = ({ navigation }) => {
    return {
      title: navigation.getParam("title")
    };
  };

  async componentDidMount() {
    console.log("station", station.title, "mounted");
    if (!this.props.station.imageURL) {
      try {
        await this.props.getImageForStation(this.props.station);
      } catch (error) {
        console.warn(error);
      }
    }
  }

  render() {
    station = this.props.station;
    console.log("rendering station", station.title);

    return (
      <View style={[styles.container]}>
        <View style={styles.imageContainer}>
          <StationImage station={station} />
        </View>

        <ScrollView contentContainerStyle={styles.textContainer}>
          <CellTextRow style={text.title}>{station.title}</CellTextRow>

          <TouchableOpacity onPress={openMap.bind(null, station.address)}>
            <CellTextRow style={[text.address, text.link]}>
              {station.address}
            </CellTextRow>
          </TouchableOpacity>

          <StationWebsite station={station} />
          
          <HTML style={text.content} html={station.content} />
        </ScrollView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  station: state.main.stations[state.main.currentStationID],
  stations: state.main.stations
});

export default connect(
  mapStateToProps,
  { getImageForStation }
)(StationDetailView);

const baseSize = 16;
const text = F8StyleSheet.create({
  title: {
    fontWeight: "bold",
    fontSize: 24
  },
  address: {
    fontSize: baseSize
  },
  content: {
    fontSize: baseSize
  },
  website: {
    fontSize: baseSize
  },
  link: {
    color: "blue",
    textDecorationLine: "underline"
  }
});

const styles = F8StyleSheet.create({
  container: {
    // flex: 1,
    // padding: 10,
    // justifyContent: "flex-start",
    // alignItems: "flex-start"
  },
  imageContainer: {
    backgroundColor: "lightgrey"
  },
  textContainer: { alignItems: "flex-start", padding: 15 },
  image: {
    height: 350,
    width: null
  },
  bordered: {
    borderColor: "black",
    borderWidth: 1
  },
  centered: {
    justifyContent: "center",
    alignItems: "center"
  }
});
