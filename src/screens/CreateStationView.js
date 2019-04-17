import React, { Component } from "react";
import { Text, View } from "react-native";
import { BLText } from '../components/BoltStyles'
import { Input, Button, Divider } from "react-native-elements";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scrollview";
import { connect } from "react-redux";
import { createStation } from "../redux/actions/writeActions";
import { setCurrentStationID } from "../redux/actions/readActions";
import Sugar from "sugar";
Sugar.extend();

function ControlledInput(props) {
  return (
    <View style={[styles.inputContainer, props.containerStyle]}>
      <Input
        style={props.inputStyle}
        placeholder={props.placeholder || props.propName.titleize()}
        value={this.state[props.propName]}
        onChangeText={
          props.onChangeText ||
          (value => {
            this.setState({ [props.propName]: value });
          })
        }
        keyboardType={props.keyboardType}
        textAlign={props.textAlign}
        multiline={props.multiline}
        numberOfLines={5} // android only, eh?
      />
    </View>
  );
}

class CreateStationView extends Component {
  initialState = {
    title: "*** App Submitted Station ***",
    address: "88 N Spring St 03301",
    content: "This station is awesome",
    website: "www.station.com",
    tagline: "The best!",
    priceFrom: "100",
    priceTo: "200",
    openingTime: "9am",
    closingTime: "10pm",
    contactEmail: "me@place.com",
    contactPhone: "444-333-1111",
    amenities: "60"
  };

  state = this.initialState;

  static navigationOptions = ({ navigation }) => ({
    headerTitle: "New Station"
  });

  componentDidMount() {
    // this.handleSubmit.call(this);
  }

  handleSubmit = clear => {
    const station = this.props.createStation(this.state);
    this.props.setCurrentStationID(station.id);
    this.props.navigation.navigate("ListScreen");
    this.props.navigation.navigate("StationDetail", { title: station.title });
  };

  render() {
    // TO-DO: Fix issue where multiline inputs don't avoid the keyboard. See https://github.com/APSL/react-native-keyboard-aware-scroll-view/issues/227 (and others on Google, probably)
    return (
      <KeyboardAwareScrollView>
        <View style={styles.textContainer}>
          <BLText style={text.title}>API-Friendly:</BLText>
          <BLText style={text.body}>
            {"NOTE: These fields are "}
            <BLText style={{ fontStyle: "italic" }}>returned</BLText> by the API but
            it's unconfirmed whether we can post to these fields. (We can't post
            anything yet anyway, period!)
          </BLText>
          {ControlledInput.call(this, { propName: "title" })}
          {ControlledInput.call(this, { propName: "address" })}
          {ControlledInput.call(this, { propName: "website" })}
          {ControlledInput.call(this, { propName: "tagline" })}
          {ControlledInput.call(this, {
            propName: "content",
            multiline: false
            // containerStyle: {
            //   height: 100,
            //   justifyContent: "flex-end"
            // }
          })}
        </View>
        <Divider style={styles.divider} />
        <View style={styles.textContainer}>
          <BLText style={text.title}>
            API-Friendly, but Complicated, and not implemented yet:
          </BLText>
          {ControlledInput.call(this, {
            propName: "amenities",
            multiline: false,
            keyboardType: "number-pad"
          })}
          <BLText style={text.note}>
            (this will have to be checkboxes or something)
          </BLText>

          <Button
            style={styles.button}
            title="Upload Photo"
            onPress={() => {}}
          />
        </View>
        <Divider style={styles.divider} />
        <View style={styles.textContainer}>
          <BLText style={text.title}>API-Absent:</BLText>
          <View style={styles.rowContainer}>
            {ControlledInput.call(this, {
              propName: "priceFrom",
              containerStyle: styles.rowElement,
              keyboardType: "numeric",
              textAlign: "center"
            })}
            {ControlledInput.call(this, {
              propName: "priceTo",
              containerStyle: styles.rowElement,
              keyboardType: "numeric",
              textAlign: "center"
            })}
          </View>
          {ControlledInput.call(this, {
            propName: "contactEmail",
            keyboardType: "email-address"
          })}
          {ControlledInput.call(this, {
            propName: "contactPhone",
            keyboardType: "phone-pad"
          })}
          <View style={styles.rowContainer}>
            {ControlledInput.call(this, {
              propName: "openingTime",
              containerStyle: styles.rowElement,
              textAlign: "center"
            })}
            {ControlledInput.call(this, {
              propName: "closingTime",
              containerStyle: styles.rowElement,
              textAlign: "center"
            })}
          </View>
          <BLText style={text.note}>
            if we want opening hours, it'll probably be its own screen since we
            need a line for every day
          </BLText>
        </View>
        <Divider style={styles.divider} />

        <View style={[styles.textContainer, { paddingTop: 0 }]}>
          <Button
            title="Submit"
            style={styles.button}
            onPress={this.handleSubmit.bind(this)}
          />
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

export default connect(
  state => ({
    stations: state.main.stations
  }),
  { createStation, setCurrentStationID }
)(CreateStationView);

const text = {
  title: {
    fontWeight: "bold",
    fontSize: 18,
    textAlign: "center"
  },
  body: {
    fontSize: 15,
    textAlign: "center"
  },
  note: { textAlign: "center", fontStyle: "italic" }
};

const styles = {
  rowElement: {
    width: 150
  },
  rowContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row"
  },
  button: {
    padding: 15,
    paddingBottom: 0
  },
  inputContainer: {
    padding: 5
  },
  textContainer: {
    padding: 20
  },
  divider: {
    margin: 15,
    height: 4,
    borderRadius: 15,
    backgroundColor: "lightblue"
  }
};
