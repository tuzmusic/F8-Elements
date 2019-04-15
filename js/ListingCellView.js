import React, { Component } from "react";
import { Text, View, TouchableOpacity } from "react-native";
import { Image } from "react-native-elements";
import F8StyleSheet from "../js/F8StyleSheet";
import HTML from "react-native-render-html";

const CellTextRow = props => (
  <Text style={[{ padding: 1 }, props.style]}>{props.children}</Text>
);

export default class ListingCellView extends Component {
  state = { imageURL: "" };

  componentDidMount = () => {
    // getImage()
  };

  render() {
    return (
      <View style={styles.cellContainer}>
        <TouchableOpacity
          style={styles.textContainer}
          onPress={this.props.onTextPress}
        >
          <CellTextRow style={text.name}>
            {this.props.station.title}
          </CellTextRow>
          <CellTextRow>{this.props.station.address}</CellTextRow>
        </TouchableOpacity>
        {/* <Image source={{ uri: this.state.imageURL }} /> */}
      </View>
    );
  }
}

const text = F8StyleSheet.create({
  name: {
    fontWeight: "bold",
    fontSize: 18
  },
  caption: {
    textAlign: "center"
  }
});

const styles = F8StyleSheet.create({
  cellContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 7,
    borderBottomWidth: 0.5,
    borderBottomColor: "lightgrey"
  },
  textContainer: {
    flex: 5,
    marginRight: 10
  },
  imageContainer: {
    flex: 2,
    padding: 7
  },
  image: {
    flex: 1,
    resizeMode: "contain",
    width: null,
    height: 20
  }
});
