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
        <Text numberOfLines={1} style={styles.sentence}>
          {item}
        </Text>
        <TouchableOpacity onPress={() => speak(item)}>
          <Icon name="keyboard-voice" color="#fff" />
        </TouchableOpacity>
      </View>
    )}
  />
);

const styles = StyleSheet.create({
  item: {
    width: width,
    padding: 15,
    flexDirection: "row",
    justifyContent: "space-between",
    borderBottomWidth: 1,
    borderTopWidth: 1,
    borderColor: "#d2D2D2",
    backgroundColor: "#A79B83"
  },
  sentence: {
    fontSize: 20,
    flex: 1,
    color: "#fff"
  },
  container: {
    height: 400,
    flex: 1
  }
});
