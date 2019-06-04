import React, { Component } from "react";
import { Input, Button, ThemeProvider } from "react-native-elements";
import { Text, TouchableOpacity } from "react-native";
import { connect } from "react-redux";
import F8StyleSheet from "../components/F8StyleSheet";

class LoginForm extends Component {
  state = {
    username: "",
    password: ""
  };

  render() {
    return (
      <ThemeProvider theme={theme}>
        {this.props.error && (
          <Text style={styles.errorText}>{this.props.error}</Text>
        )}
        <Input
          placeholder="Username"
          label={this.state.username && "Username"}
          value={this.state.username}
          autoCorrect={false}
          autoCapitalize={"none"}
          onChangeText={username => {
            this.setState({ username });
          }}
        />
        <Input
          placeholder="Password"
          label={this.state.password && "Password"}
          secureTextEntry
          value={this.state.password}
          autoCorrect={false}
          autoCapitalize={"none"}
          onChangeText={password => {
            this.setState({ password });
          }}
        />
        <Button
          title="Login"
          disabled={this.props.isLoading}
          onPress={() => this.props.onLogin(this.state)}
        />
        <TouchableOpacity onPress={this.props.onLinkClick}>
          <Text style={{ fontSize: 16 }}>
            Don't have an account? <Text style={styles.link}>Click here</Text>{" "}
            to register.
          </Text>
        </TouchableOpacity>
      </ThemeProvider>
    );
  }
}

export default connect(state => ({
  isLoading: state.auth.isLoading,
  error: state.auth.error
}))(LoginForm);

const theme = {
  Input: {
    containerStyle: {
      padding: 10
    }
  },
  Button: {
    containerStyle: {
      padding: 30,
      width: "100%"
    }
  },
  Text: {
    style: {
      fontSize: 16
    }
  }
};

const styles = F8StyleSheet.create({
  errorText: {
    color: "red",
    fontSize: 16
  },
  link: {
    color: "blue",
    textDecorationLine: "underline"
  }
});
