import React from "react";
import {
  Text,
  AsyncStorage,
  View,
  Image,
  StyleSheet,
  FlatList,
  ScrollView,
  Dimensions
} from "react-native";

import { Constants, Speech } from "expo";
import { Title } from "react-native-paper";

import profilImage from "../assets/yoda_profil.png";
import { Container } from "../components/Container";
import { ListFav } from "../components/ListFav";
import firebase from "firebase";
let arrFav = [];

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

export default class Profil extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      currentUser: {},
      fav: []
    };
  }
  componentDidMount() {
    AsyncStorage.getItem("@user").then(res => {
      const parseRes = JSON.parse(res);
      this.setState({ currentUser: parseRes });
    });
    try {
      firebase
        .database()
        .ref("/Users/" + firebase.auth().currentUser.uid + "/Favorites")
        .on("value", async snapshot => {
          let arrObj = Object.values(snapshot.val());
          arrObj.map(item => {
            arrFav.push(item.translation);
          });

          await this.setState({ fav: arrFav });
        });
    } catch (err) {
      console.log(err);
    }
  }

  _speak = item => {
    const start = () => {
      this.setState({ inProgress: true });
    };
    const complete = () => {
      this.state.inProgress && this.setState({ inProgress: false });
    };

    Speech.speak(item, {
      language: "en",
      pitch: 1,
      rate: 0.75,
      onStart: start,
      onDone: complete,
      onStopped: complete,
      onError: complete,
      voiceURI: "com.apple.ttsbundle.Sin-Ji-compact"
    });
  };
  render() {
    let { currentUser, fav } = this.state;
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <View style={styles.image}>
          <Image source={profilImage} style={{ width: 150, height: 150 }} />
        </View>

        <Text style={styles.title}>Your Favorites</Text>
        <View style={styles.listFav}>
          <ListFav fav={fav} speak={this._speak} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius: 100,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14,
    borderColor: "#8D8E49",
    borderWidth: 1,
    backgroundColor: "#A79B83"
  },
  container: {
    justifyContent: "center",
    marginTop: 30,
    alignItems: "center"
  },
  title: {
    fontSize: 25,
    color: "#735638",
    fontWeight: "bold",
    marginBottom: 20,
    marginTop: 20,
    shadowColor: "#735638",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.46,
    shadowRadius: 11.14
  },
  listFav: {
    height: height - 350
  }
});
