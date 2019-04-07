import React, { Component } from "react";
import { Platform } from "react-native";
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from "react-navigation";

import { connect } from "react-redux";

import TabBarIcon from "../components/TabBarIcon";
import MapScreen from "../js/MapView";
import MapResultsScreen from "../js/MapResultsView";
import StationDetailScreen from "../js/StationDetailView";
import UserDetailScreen from "../js/UserDetailView";

const ListStack = createStackNavigator({
  List: MapResultsScreen,
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
  Maps: MapScreen,
  Results: MapResultsScreen,
  StationDetail: StationDetailScreen,
  UserDetail: UserDetailScreen
});

MapStack.navigationOptions = {
  tabBarLabel: "Map",
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === "ios" ? "ios-map" : "md-map"}
    />
  )
};

const TabNavigator = createBottomTabNavigator(
  {
    MapStack,
    ListStack
  },
  {
    initialRouteName: "MapStack",
    initialRouteName: 'ListStack',
  }
);

const Container = createAppContainer(TabNavigator);

class TabContainer extends Component {
  componentDidMount = () => {
    this.props.fetchStations();
  };

  render() {
    return <Container />;
  }
}

import { fetchStations } from "../actions/mainActions";

export default connect(
  null,
  { fetchStations }
)(TabContainer);
