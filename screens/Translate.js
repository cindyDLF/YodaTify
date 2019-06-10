import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  AsyncStorage,
  Text,
  TouchableWithoutFeedback,
  Keyboard,
  ScrollView
} from "react-native";
import { Title, Button } from "react-native-paper";
import star from "../assets/star.png";
import starFull from "../assets/star-full.png";
import volume from "../assets/volume.png";
import { Constants, Speech } from "expo";
import axios from "axios";
import firebase from "firebase";
import { configApi } from "../config";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

const DismissKeyboard = ({ children }) => (
  <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
    {children}
  </TouchableWithoutFeedback>
);
BASE_URL = "https://yodish.p.rapidapi.com/yoda.json";

export default class Translate extends Component {
  state = {
    text: "",
    translation: "",
    pitch: 1,
    rate: 0.75,
    inProgress: false,
    isFavorite: false,
    fav: [],
    currentUser: {},
    oldFav: []
  };

  componentDidMount() {
    this._getFav();
  }

  _getFav = () => {
    let arrFav = [];
    try {
      AsyncStorage.getItem("@user").then(async res => {
        const parseRes = JSON.parse(res);
        this.setState({ currentUser: parseRes });
        let arrObj = Object.values(parseRes.Favorites);
        arrObj.map(item => {
          arrFav.push(item.translation);
        });
        await this.setState({ oldFav: arrFav });
      });
    } catch (err) {
      console.log(err);
    }
  };

  handleChange = search => {
    const text = search.replace(" ", "+");
    this.setState({ text });
  };

  translator = async () => {
    try {
      await axios({
        method: "post",
        url: `${BASE_URL}?text=${this.state.text}`,
        headers: {
          "X-RapidAPI-Key": `${configApi.apiKey}`,
          "X-RapidAPI-Host": "yodish.p.rapidapi.com",
          "Content-Type": "application/x-www-form-urlencoded"
        }
      })
        .then(response => {
          // handle success
          this.setState({ translation: response.data.contents.translated });
          if (this.state.oldFav.includes(this.state.translation)) {
            this.setState({ isFavorite: true });
          } else {
            this.setState({ isFavorite: false });
          }
        })
        .catch(function(error) {
          // handle error
          console.log(error);
        });
    } catch (err) {
      console.log(err);
    }
  };

  _displayTranslate = () => {
    let { isFavorite, translation } = this.state;
    if (this.state.translation) {
      return (
        <View style={styles.displayTranslate}>
          <View style={styles.optionTranslate}>
            <TouchableOpacity
              onPress={() => this._addFav(translation, isFavorite)}
            >
              {isFavorite ? (
                <Image source={starFull} style={styles.iconOption} />
              ) : (
                <Image source={star} style={styles.iconOption} />
              )}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this._speak()}>
              <Image source={volume} style={styles.iconOption} />
            </TouchableOpacity>
          </View>
          <Text style={styles.translate}>{translation}</Text>
        </View>
      );
    }
  };

  _addFav = async (sentence, isFavorite) => {
    let { translation, currentUser, oldFav } = this.state;
    if (!oldFav.includes(sentence)) {
      let fav = this.state.oldFav;
      fav.push(sentence);
      this.setState({ fav });

      await firebase
        .database()
        .ref("Users/" + firebase.auth().currentUser.uid + "/Favorites")
        .push({
          translation
        })
        .then(data => {
          //success callback
          console.log("data ", data);
        })
        .catch(error => {
          //error callback
          console.log("error ", error);
        });
      this.setState({ isFavorite: !isFavorite });
    } else {
      alert("already in your favorite");
    }
  };

  _speak = () => {
    const start = () => {
      this.setState({ inProgress: true });
    };
    const complete = () => {
      this.state.inProgress && this.setState({ inProgress: false });
    };

    Speech.speak(this.state.translation, {
      language: "en",
      pitch: this.state.pitch,
      rate: this.state.rate,
      onStart: start,
      onDone: complete,
      onStopped: complete,
      onError: complete,
      voiceURI: "com.apple.ttsbundle.Sin-Ji-compact"
    });
  };

  _stop = () => {
    Speech.stop();
  };

  render() {
    let { currentUser, oldFav, fav } = this.state;
    console.log(fav);
    console.log(oldFav);
    return (
      <DismissKeyboard>
        <ScrollView>
          <View style={styles.container}>
            <Text style={styles.title}>Translate </Text>
            <View style={styles.textAreaContainer}>
              <TextInput
                style={styles.textArea}
                underlineColorAndroid="transparent"
                placeholder="Type something"
                placeholderTextColor="grey"
                numberOfLines={10}
                multiline={true}
                onChangeText={search => this.handleChange(search)}
              />
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => this.translator()}
            >
              <Text style={styles.textBtn}>Translate</Text>
            </TouchableOpacity>
            {this._displayTranslate()}
          </View>
        </ScrollView>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
    marginTop: 50
  },
  textAreaContainer: {
    borderColor: "#d2D2D2",
    borderWidth: 1,
    padding: 5,
    backgroundColor: "#fff",
    marginTop: 20,
    width: width - 50,
    height: 80,
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
    shadowOpacity: 0.46,
    shadowRadius: 11.14
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
  translate: {
    fontSize: 20,
    justifyContent: "center",
    color: "#fff"
  },
  optionTranslate: {
    flexDirection: "row",
    width: width - 50,
    justifyContent: "space-between",
    marginBottom: 30,
    paddingLeft: 20,
    paddingRight: 20
  },
  displayTranslate: {
    width: width - 50,
    marginTop: 40,
    backgroundColor: "#A79B83",
    alignItems: "center",
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    paddingLeft: 20,
    paddingRight: 20,
    paddingBottom: 30,
    paddingTop: 10,
    alignItems: "center"
  },
  iconOption: {
    width: 30,
    height: 30
  }
});
