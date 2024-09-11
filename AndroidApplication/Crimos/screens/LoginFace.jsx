import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import face from '../assests/Images/face.png';
import {useNavigation} from '@react-navigation/native';
import {pixelNormalize} from '../components/Normalize';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const LoginFace = () => {
  const [image, setImage] = useState(null);
  const [authResult, setAuthResult] = useState('');
  const [ip, setIp] = useState('');
  const [loading, setLoading] = useState(false);  // Add loading state
  const [isAuthenticating, setIsAuthenticating] = useState(false);  // For authentication process
  const navigation = useNavigation();

  useEffect(() => {
    const checkInternetConnectivity = async () => {
      try {
        const state = await NetInfo.fetch();
        if (!state.isConnected) {
          Alert.alert(
            'No Internet Connection',
            'Please check your internet connection and try again',
            [{text: 'Ok'}],
          );
        }
      } catch (error) {
        Alert.alert(
          'Error',
          'An error occurred while checking internet connectivity',
          [{text: 'Ok'}],
        );
      }
    };
    checkInternetConnectivity();

    // Fetch IP on mount
    fetchIP();
  }, []);

  const fetchIP = async () => {
    setLoading(true);  // Start loading indicator
    try {
      const response = await fetch('https://json.extendsclass.com/bin/766b9c024d94');
  
      if (response.ok) {
        const data = await response.json();
        const ipAddress = data.ip_address.toString();
        console.log('IP Address', ipAddress);
        setIp(ipAddress);  // update the state
        return ipAddress;
      } else {
        const error = await response.json();
        Alert.alert('Error', 'Unable to connect to backend server!');
        console.log(`Error: ${error.message}`);
        return "error";
      }
    } catch (error) {
      console.log(`Network Error: ${error.message}`);
      Alert.alert('Network Error', 'Check Internet Connection!');
      return "error";
    } finally {
      setLoading(false);  // Stop loading indicator
    }
  };

  const captureImageWithCamera = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      includeBase64: true,
      saveToPhotos: false,
    };

    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0];
        setImage(source);
      }
    });
  };

  const authenticateUser = async () => {
    if (!image) return;
    setIsAuthenticating(true);  // Start the authentication process
    try {
      const fetchedIp = await fetchIP();
      if (fetchedIp === "error") {
        Alert.alert('Backend Error', 'Try again later.');
        return;
      }
      
      // Check if the backend server is up and running
      try {
        const baseUrl = `http://${fetchedIp}:5000/`;
        console.log('Checking backend server at:', baseUrl);  // Log the base URL
        const serverResponse = await fetch(baseUrl);
        
        if (!serverResponse.ok) {
          throw new Error('Server not reachable');
        }
        
        console.log('Backend server is up and running');
      } catch (error) {
        console.log('Backend Server Error:', error);  // Log detailed error
        Alert.alert('Backend Error', 'Backend server is not reachable. Please try again later.');
        setAuthResult('Backend server is not reachable.');
        return;
      }
      
      // Proceed with authentication
      try {
        const API_URI = `http://${fetchedIp}:5000/authenticate`;  // Ensure correct protocol
        console.log('API URI:', API_URI);  // Log the actual API URI
        Alert.alert('Calling the address', API_URI);
        const response = await axios.post(API_URI, {image: image.base64});
        console.log(response.data);
        setAuthResult(response.data.message);
        if (response.data.name.toLowerCase() === 'unknown') {
          navigation.navigate('Register');
        } else {
          navigation.navigate('Palm', {res: response.data.name});
        }
      } catch (error) {
        console.log('Authentication Error:', error);  // Log detailed error
        Alert.alert('Authentication Error', 'Authentication failed. Please try again.');
        setAuthResult('Authentication failed. Please try again.');
      }
    } catch (error) {
      console.log('IP Address Error:', error);  // Log detailed error
      Alert.alert('IP Address Error', 'Failed to fetch IP');
      setAuthResult('Failed to fetch IP');
    } finally {
      setIsAuthenticating(false);  // End the authentication process
    }
  };
  

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <KeyboardAvoidingView>
        <View className="items-center justify-center mt-24">
          <Text className="text-[#003580] text-xl font-bold">Sign In</Text>
          <Text className="text-black mt-3 text-lg font-medium">
            Capture your face to login
          </Text>
        </View>
        <View className="mt-3 items-center justify-center">
          {image ? (
            <Image
              source={{uri: image.uri}}
              style={{
                width: pixelNormalize(200),
                height: pixelNormalize(200),
                borderRadius: pixelNormalize(4),
              }}
              resizeMode="contain"
            />
          ) : (
            <Image
              source={face}
              style={{
                width: pixelNormalize(200),
                height: pixelNormalize(200),
                borderRadius: pixelNormalize(4),
              }}
              resizeMode="contain"
            />
          )}
        </View>
        {authResult && (
          <Text className="text-center mt-5 text-green-500 text-lg">
            {authResult}
          </Text>
        )}
        {image ? (
          <View className="items-center justify-center px-8 flex-row gap-3 mt-5">
            <TouchableOpacity
              className="w-1/2 bg-red-500 py-3 items-center justify-center rounded-lg"
              onPress={() => captureImageWithCamera()}>
              <Text className="text-white text-lg font-semibold">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 bg-[#003580] py-3 items-center justify-center rounded-lg"
              onPress={() => authenticateUser()}>
              {isAuthenticating ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text className="text-white text-lg font-semibold">
                  Authenticate
                </Text>
              )}
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity
            onPress={() => captureImageWithCamera()}
            className="mt-5 mx-5 bg-[#003580] py-3 items-center justify-center rounded-lg">
            <Text className="text-white text-lg font-semibold">
              Capture Image
            </Text>
          </TouchableOpacity>
        )}
        <View className="mt-5 items-center justify-center flex-row">
          <Text className="text-black text-lg font-medium">
            Don't have an account?
          </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text className="text-[#003580] text-lg font-semibold ml-2">
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View>
          {loading ? (
            <ActivityIndicator size="large" color="#003580" />
          ) : ip === "error" ? (
            <Text className="text-center mt-5 text-black text-lg font-medium">
              Unable to connect to backend server
            </Text>
          ) : ip === '' ? (
            <Text className="text-center mt-5 text-black text-lg font-medium">
              Connecting to backend server...
            </Text>
          ) : (
            <Text className="text-center mt-5 text-black text-lg font-medium">
              Connected to backend server - {ip}
            </Text>
          )}
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginFace;
