import React, { Component } from "react";
import {
  View,
  TextInput,
  StyleSheet,
  Dimensions,
  Image,
  TouchableOpacity,
  AsyncStorage
} from "react-native";
import { Title, Button } from "react-native-paper";
import star from "../assets/star.png";
import starFull from "../assets/star-full.png";

import { Constants, Speech } from "expo";
import axios from "axios";
import firebase from "firebase";

let width = Dimensions.get("window").width;

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

  translator = () => {
    axios({
      method: "post",
      url: `${BASE_URL}?text=${this.state.text}`,
      headers: {
        "X-RapidAPI-Key": `605b5d07d4mshdc3646da210b51bp154162jsn6828e4df176b`,
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
  };

  _displayTranslate = () => {
    let { isFavorite, translation } = this.state;
    if (this.state.translation) {
      return (
        <View>
          <TouchableOpacity
            onPress={() => this._addFav(translation, isFavorite)}
          >
            {isFavorite ? <Image source={starFull} /> : <Image source={star} />}
          </TouchableOpacity>

          <Title>{translation}</Title>
          <Button
            icon="account-circle"
            mode="contained"
            onPress={() => this._speak()}
          >
            Speak
          </Button>
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
      <View style={styles.container}>
        <Title>Translate </Title>
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
        <Button
          icon="account-circle"
          mode="contained"
          onPress={() => this.translator()}
        >
          Translate
        </Button>
        {this._displayTranslate()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  },
  textAreaContainer: {
    borderColor: "#d2D2D2",
    borderWidth: 1,
    padding: 5
  },
  textArea: {
    height: 150,
    width: width - 50,
    justifyContent: "flex-start"
  }
});
