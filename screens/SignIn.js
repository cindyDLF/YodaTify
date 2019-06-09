console.disableYellowBox = true;
import React, { Component } from "react";
import { Text, StyleSheet, View, AsyncStorage } from "react-native";
import { TextInput, Title, Button } from "react-native-paper";

import firebase from "firebase";

export default class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "cindy@gmail.com",
      password: "12345678",
      username: "Cindy",
      currentUser: {}
    };
  }

  AuthUserData = () => {
    let { email, password, username } = this.state;
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(response => {
        firebase
          .database()
          .ref("/Users/" + firebase.auth().currentUser.uid)
          .on("value", snapshot => {
            let storage = JSON.stringify(snapshot.val());
            this.setState({ currentUser: storage }, () => {
              AsyncStorage.setItem("@user", this.state.currentUser);

              this.props.navigation.navigate("Profil");
            });
          });
      })
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
        // ...
      });
  };

  render() {
    return (
      <View style={styles.container}>
        <Title>Sign In</Title>

        <TextInput
          style={styles.input}
          label="Email"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          label="Username"
          value={this.state.username}
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          style={styles.input}
          label="Password"
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <Button
          icon="account-circle"
          mode="contained"
          onPress={() => this.AuthUserData()}
        >
          Sign In
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
