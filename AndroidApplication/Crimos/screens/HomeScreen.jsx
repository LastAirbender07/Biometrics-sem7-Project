import { StyleSheet, Text, View, SafeAreaView, StatusBar, LogBox, Alert, TouchableOpacity, } from 'react-native'
import React from 'react'

const HomeScreen = ({route}) => {
  const user = route.params.user;
  console.log(user + ' from HomeScreen');
  return (
    <SafeAreaView>
      <StatusBar barStyle="light-content" />
      <View className="w-full h-full justify-center items-center">
        <TouchableOpacity>
            <View className="rounded-lg bg-blue-500 px-3 py-2 border">
                <Text className="text-white font-semibold text-lg">Click</Text>
            </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

export default HomeScreen