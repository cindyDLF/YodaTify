console.disableYellowBox = true;
import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  AsyncStorage,
  TouchableOpacity,
  Dimensions,
  TextInput,
  KeyboardAvoidingView
} from "react-native";

import firebase from "firebase";
let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

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
    let { email, password } = this.state;
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

              this.props.navigation.navigate("Translate");
            });
          });
      })
      .catch(function(error) {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        alert(errorMessage);
        // ...
      });
  };

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text style={styles.title}>YodaTify</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.email}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={this.state.password}
          onChangeText={password => this.setState({ password })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() => this.AuthUserData()}
        >
          <Text style={styles.textBtn}>Sign In</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("SignUp")}
        >
          <Text style={styles.text}>Register ?</Text>
        </TouchableOpacity>
      </KeyboardAvoidingView>
    );
  }
}

const styles = StyleSheet.create({
  input: {
    backgroundColor: "#fff",
    marginTop: 20,
    width: width - 50,
    alignItems: "center",
    borderRadius: 10,
    padding: 15,
    fontSize: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  button: {
    borderColor: "#735638",
    borderWidth: 3,
    width: width - 50,
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    marginTop: 40,
    shadowColor: "#735638",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  textBtn: {
    fontSize: 20,
    color: "#735638",
    fontWeight: "bold"
  },
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  title: {
    fontSize: 40,
    color: "#735638",
    fontWeight: "bold",
    marginBottom: 20,
    shadowColor: "#735638",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84
  },
  text: {
    marginTop: 20,
    color: "#735638"
  }
});
