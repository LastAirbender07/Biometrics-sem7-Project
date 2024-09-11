import {
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  TouchableOpacity,
  TextInput,
  Image,
  Alert,
  ActivityIndicator,
} from 'react-native';
import React, {useState, useEffect} from 'react';
import {launchCamera} from 'react-native-image-picker';
import {useNavigation} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import axios from 'axios';
import NetInfo from '@react-native-community/netinfo';

const RegisterFace = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [photo, setPhoto] = useState('https://cdn-icons-png.freepik.com/512/7718/7718888.png');
  const [image, setImage] = useState(null);
  const [authResult, setAuthResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [isConnected, setIsConnected] = useState(true);
  const navigation = useNavigation();

  const defaultPhoto = 'https://cdn-icons-png.freepik.com/512/7718/7718888.png';

  useEffect(() => {      
    const checkInternetConnectivity = async () => {
      try {
        const state = await NetInfo.fetch();
        setIsConnected(state.isConnected);
        if (!state.isConnected) {
          Alert.alert('No Internet Connection', 'Please check your internet connection and try again');
        }
      } catch (error) {
        Alert.alert('Error', 'An error occurred while checking internet connectivity');
      }
    };

    const unsubscribe = NetInfo.addEventListener(state => {
      setIsConnected(state.isConnected);
    });

    checkInternetConnectivity();
    return () => unsubscribe();
  }, []);

  const fetchIP = async () => {
    try {
      const response = await fetch('https://json.extendsclass.com/bin/766b9c024d94', {
        method: 'GET',
      });
  
      if (response.ok) {
        const data = await response.json();
        const ipAddress = data.ip_address.toString();
        console.log('IP Address', ipAddress);
        return ipAddress.toString();
      } else {
        const error = await response.json();
        Alert.alert('Error', 'Unable to connect to backend server!');
        return "error";
      }
    } catch (error) {
      Alert.alert('Network Error', `Check Internet Connection!`);
      return "error";
    }
  };

  const handleImageSelection = () => {
    const options = {
      mediaType: 'photo',
      cameraType: 'front',
      includeBase64: true,
    };
    launchCamera(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const source = response.assets[0];
        setPhoto(source.uri?.toString());
        setImage(source);
      }
    });
  };

  const validateEmail = email => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const handleClick = async () => {
    if (!email || !name.trim() || photo === defaultPhoto) {
      Alert.alert('Please fill in all fields and take a photo.');
      return;
    }

    if (!validateEmail(email)) {
      Alert.alert('Invalid email address');
      return;
    }

    setLoading(true);
    
    try {
      const ip = await fetchIP();
      if (ip === "error") {
        Alert.alert('Backend Error', 'Try again later');
        setLoading(false);
        return;
      }

      const response = await axios.post(`http://${ip}:5000/register`, {
        name: name,
        email: email.toLowerCase(),
        image: image.base64,
      });

      console.log(response.data);
      setAuthResult(response.data.message);
      Alert.alert('Registration Successful!', 'You can now sign in.');
      navigation.navigate('Login');
    } catch (error) {
      console.log(error);
      setAuthResult('Registration failed. Please try again.');
      Alert.alert('Registration failed', 'Please try again later.');
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <KeyboardAvoidingView>
        <View className="items-center justify-center mt-10">
          <Text className="text-[#003580] text-xl font-bold">Register</Text>
          <Text className="text-black mt-3 text-lg font-medium">Create an Account</Text>
        </View>
        <View className="mt-5 mx-5">
          <View className="items-center my-[22]">
            <TouchableOpacity
              style={{
                height: 200,
                width: 200,
                backgroundColor: 'white',
                borderRadius: 999,
                elevation: 5,
                alignItems: 'center',
                justifyContent: 'center',
                borderColor: '#242760',
              }}>
              <Image
                source={{uri: photo}}
                resizeMode="contain"
                style={{
                  height: 195,
                  width: 195,
                  borderRadius: 999,
                }}
              />

              <View className="absolute bottom-[0] right-[0] z-[9999] bg-gray-600 rounded-full p-2 shadow-lg">
                <MaterialIcons
                  name="photo-camera"
                  size={32}
                  color="white"
                  onPress={handleImageSelection}
                  disabled={!isConnected || loading}
                />
              </View>
            </TouchableOpacity>
          </View>
          <View>
            <Text className="text-[#003580] text-lg font-semibold">Name</Text>
            <TextInput
              className="w-full py-0 text-black border-gray-400 border-b text-base font-semibold"
              value={name}
              onChangeText={text => setName(text)}
            />
          </View>
          <View className="mt-5">
            <Text className="text-[#003580] text-lg font-semibold">Email</Text>
            <TextInput
              className="w-full py-0 text-black border-gray-400 border-b text-base font-semibold"
              value={email}
              onChangeText={text => setEmail(text)}
            />
          </View>
        </View>

        <TouchableOpacity
          className="mt-5 mx-5 bg-[#003580] py-3 items-center justify-center rounded-lg"
          disabled={!isConnected}
          onPress={handleClick}
          style={[
            { backgroundColor: isConnected ? '#003580' : 'gray' }
          ]}
        >
          {loading ? <ActivityIndicator size="small" color="#fff" /> : 
          <Text className="text-white text-lg font-semibold">Register</Text>}
        </TouchableOpacity>

        <View className="mt-5 items-center justify-center flex-row">
          <Text className="text-black text-lg font-medium">Already have an account?</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Login')}>
            <Text className="text-[#003580] text-lg font-semibold ml-2">Sign In</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegisterFace;
