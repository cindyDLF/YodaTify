import React, { Component } from "react";
import { View, StyleSheet } from "react-native";

export const Container = () => <View style={styles.container} />;
const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
    flex: 1
  }
});
