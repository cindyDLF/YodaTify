import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import { TextInput, Title, Button } from "react-native-paper";

import firebase from "firebase";

export default class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      username: ""
    };
  }

  writeUserData = (email, username, password) => {
    try {
      firebase
        .auth()
        .createUserWithEmailAndPassword(email, password)
        .then(response => {
          console.log(response.user.uid);
          this.createUserDb(email, username, password, response.user.uid);
        })
        .catch(function(error) {
          // Handle Errors here.
          const errorCode = error.code;
          const errorMessage = error.message;
          console.log(errorMessage);
          // ...
        });
    } catch (err) {
      console.log(err);
    }
  };

  createUserDb(email, username, password, uid) {
    firebase
      .database()
      .ref("Users/" + uid)
      .set({
        email,
        username,
        password
      })
      .then(data => {
        //success callback
        console.log("data ", data);
      })
      .catch(error => {
        //error callback
        console.log("error ", error);
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Title>Sign Up</Title>

        <TextInput
          style={styles.input}
          label="Email"
          value={this.state.text}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          label="Username"
          value={this.state.text}
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          style={styles.input}
          label="Password"
          value={this.state.text}
          onChangeText={password => this.setState({ password })}
        />
        <Button
          icon="account-circle"
          mode="contained"
          onPress={() =>
            this.writeUserData(
              this.state.email,
              this.state.username,
              this.state.password
            )
          }
        >
          Sign Up
        </Button>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    marginTop: 10
  },
  container: {
    marginTop: 20
  }
});
