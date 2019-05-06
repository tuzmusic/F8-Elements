import React, { Component } from "react";
import { connect } from "react-redux";
import StationsListContainer from "../subviews/StationsListContainer";
import { setCurrentStationID } from "../redux/actions/stationActions";

class MapResultsContainer extends Component {
  static navigationOptions = () => ({
    headerTitle: "Stations"
  });

  onStationClick = station => {
    this.props.setCurrentStationID(station.id);
    this.props.navigation.navigate("StationDetail", { title: station.title });
  };

  render() {
    console.log("MapResultsView this.props.stations =", this.props.stations);
    return (
      <StationsListContainer
        showLoading
        stations={this.props.stations}
        navigation={this.props.navigation}
        onTextPress={this.onStationClick.bind(this)}
        isLoading={this.props.isLoading}
      />
    );
  }
}

const mapStateToProps = state => ({
  stations: state.main.stations,
  isLoading: state.main.isLoading,
  user: state.auth.user
});

export const MapResultsViewBasic = MapResultsContainer;

export default connect(
  mapStateToProps,
  { setCurrentStationID }
)(MapResultsContainer);
