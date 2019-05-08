import React, { Component } from "react";
import { connect } from "react-redux";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator
} from "react-navigation";

import TabBarIcon from "../components/TabBarIcon";
import MapScreen from "../screens/MapView";
import MapResultsScreen from "../screens/MapResultsView";
import StationDetailScreen from "../screens/StationDetailView";
import UserDetailScreen from "../screens/UserDetailView";
import UserProfileScreen from "../screens/UserProfileView";
import CreateStationScreen from "../screens/CreateStationView";

import { fetchStations } from "../redux/actions/stationActions";

const GET_CACHED = true;
const SHOULD_DOWNLOAD = false;

const ListStack = createStackNavigator({
  ListScreen: MapResultsScreen,
  StationDetail: StationDetailScreen,
  UserDetail: UserDetailScreen
});

ListStack.navigationOptions = {
  tabBarLabel: "List",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-list" : "md-list"}
    />
  )
};

const MapStack = createStackNavigator({
  MapScreen: MapScreen,
  ResultsScreen: MapResultsScreen,
  StationDetail: StationDetailScreen,
  UserDetail: UserDetailScreen
});

MapStack.navigationOptions = {
  tabBarLabel: "Map",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={focused ? "map" : "map-o"}
      library={"FontAwesome"}
    />
  )
};

const CreateStationStack = createStackNavigator({
  CreateScreen: CreateStationScreen
});

CreateStationStack.navigationOptions = {
  tabBarLabel: "Add Station",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === "ios"
          ? focused
            ? "md-add-circle"
            : "md-add-circle-outline"
          : "md-add"
      }
    />
  )
};

const UserStack = createStackNavigator({
  Profile: UserProfileScreen
});

UserStack.navigationOptions = {
  tabBarLabel: "Me",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={focused ? "user-circle" : "user-circle-o"}
      library={"FontAwesome"}
    />
  )
};

const TabNavigator = createBottomTabNavigator(
  {
    MapStack,
    ListStack,
    CreateStationStack,
    UserStack
  },
  {
    initialRouteName: "MapStack",
    initialRouteName: "CreateStationStack",
    initialRouteName: "UserStack",
    initialRouteName: "ListStack"
  }
);

class TabContainer extends Component {
  componentDidMount = async () => {
    await this.props.fetchStations({
      useCache: GET_CACHED,
      shouldDownload: SHOULD_DOWNLOAD
    });
  };

  static router = TabNavigator.router;
  render() {
    return <TabNavigator navigation={this.props.navigation} />;
  }
}
const mapStateToProps = state => {
  return { stations: state.main.stations };
};
const mapDispatchToProps = { fetchStations };

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TabContainer);
