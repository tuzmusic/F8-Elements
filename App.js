import React from "react";
import { Platform, StatusBar, StyleSheet, View } from "react-native";
import { AppLoading, Asset, Font, Icon } from "expo";
import AppContainer from "./src/navigators/AppNavigator";
import { combineReducers, createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import mainReducer from "./src/redux/reducers/mainReducer";
import authReducer from "./src/redux/reducers/authReducer";
import thunk from "redux-thunk";
import GlobalFont from "react-native-global-font";

const combinedReducer = combineReducers({
  main: mainReducer,
  auth: authReducer
});
const store = createStore(combinedReducer, {}, applyMiddleware(thunk));

export default class App extends React.Component {
  state = {
    isLoadingComplete: false
  };

  componentDidMount = () => {
    GlobalFont.applyGlobal('Avenir')
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <Provider store={store}>
          <View style={styles.container}>
            {Platform.OS === "ios" && <StatusBar barStyle="default" />}
            <AppContainer />
          </View>
        </Provider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        // require("./assets/images/robot-dev.png"),
        // require("./assets/images/robot-prod.png")
      ]),
      Font.loadAsync({
        ...Icon.Ionicons.font
      })
    ]);
  };

  _handleLoadingError = error => {
    console.warn(error);
  };

  _handleFinishLoading = () => {
    this.setState({ isLoadingComplete: true });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
