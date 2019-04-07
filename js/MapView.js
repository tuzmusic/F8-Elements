import React, { Component } from "react";
import { MapView } from "expo";
import { View } from "react-native";
import F8StyleSheet from "../js/F8StyleSheet";
import { connect } from "react-redux";

import StationCellView from "./StationCellView";

class MapScreen extends Component {
  static navigationOptions = {
    title: "Nearby Stations"
  };

  state = {
    region: { // Center on 88 N Spring St Concord NH
      latitude: 43.208552,
      longitude: -71.542526,
      latitudeDelta: 0.00922,
      longitudeDelta: 0.00421
    }
  };

  calculateRegion(latitude, longitude, accuracy) {
    const oneDegreeOfLongitudeInMeters = 111.32;
    const circumference = 40075 / 360;
    const latitudeDelta = accuracy / oneDegreeOfLongitudeInMeters;
    const longitudeDelta = accuracy * (1 / Math.cos(latitude * circumference));
    const region = { latitude, longitude, latitudeDelta, longitudeDelta };
    this.setState({ region });
  }

  getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(position => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      const accuracy = position.coords.accuracy;
      this.calculateRegion(latitude, longitude, accuracy);
    });
  };

  renderMarkers() {
    return this.props.stations.map(station => {
      const logo = require("../assets/logos/BOLTIcon.jpg");
      return (
        <MapView.Marker
          coordinate={{
            latitude: station.location.lat,
            longitude: station.location.lng
          }}
          key={
            station.location.lat.toString() + station.location.lng.toString()
          }
        >
          <MapView.Callout>
            <StationCellView
              station={station}
              // onPress={() =>
              //   this.props.navigation.navigate("StationDetail", { station })
              // }
            />
          </MapView.Callout>
        </MapView.Marker>
      );
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <MapView
          provider={MapView.PROVIDER_GOOGLE}
          style={{ flex: 1 }}
          region={this.state.region}
          showsUserLocation={true}
        >
          {this.renderMarkers()}
        </MapView>
      </View>
    );
  }
}

const mapStateToProps = state => ({
  stations: state.main.stations
});

export default connect(
  mapStateToProps,
)(MapScreen);

const styles = F8StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center"
  },
});
