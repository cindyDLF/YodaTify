import React from "react";
import {
  FlatList,
  Text,
  StyleSheet,
  View,
  Dimensions,
  TouchableOpacity
} from "react-native";
import { Button } from "react-native-paper";
import { Icon } from "react-native-elements";

let width = Dimensions.get("window").width;
let height = Dimensions.get("window").height;

export const ListFav = ({ fav, speak }) => (
  <FlatList
    style={styles.container}
    data={fav}
    keyExtractor={(item, index) => index.toString()}
    renderItem={({ item, idx }) => (
      <View style={styles.item} key={item[idx]}>
        <Text style={styles.sentence}>{item}</Text>
        <TouchableOpacity onPress={() => speak(item)}>
          <Icon name="keyboard-voice" />
        </TouchableOpacity>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  item: {
    width: width,
    padding: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#d2D2D2"
  },
  sentence: {
    fontSize: 20
  },
  container: {
    marginTop: 20,
    height: 450
  }
});
