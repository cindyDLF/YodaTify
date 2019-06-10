import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  Dimensions,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView
} from "react-native";
import { Button } from "react-native-paper";

import firebase from "firebase";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

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
          alert(errorMessage);
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
        this.props.navigation.navigate("SignIn");
        console.log("data ", data);
      })
      .catch(error => {
        //error callback
        console.log("error ", error);
      });
  }

  render() {
    return (
      <KeyboardAvoidingView style={styles.container} behavior="padding" enabled>
        <Text style={styles.title}>Sign Up</Text>

        <TextInput
          style={styles.input}
          placeholder="Email"
          value={this.state.text}
          onChangeText={email => this.setState({ email })}
        />
        <TextInput
          style={styles.input}
          placeholder="Username"
          value={this.state.text}
          onChangeText={username => this.setState({ username })}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          value={this.state.text}
          onChangeText={password => this.setState({ password })}
        />
        <TouchableOpacity
          style={styles.button}
          onPress={() =>
            this.writeUserData(
              this.state.email,
              this.state.username,
              this.state.password
            )
          }
        >
          <Text style={styles.textBtn}>Sign Up</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.props.navigation.navigate("SignIn")}
        >
          <Text style={styles.text}>Already registred ?</Text>
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
