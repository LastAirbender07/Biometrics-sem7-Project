// import React, {useState} from 'react';
// import {
//   View,
//   Text,
//   Button,
//   Image,
//   StyleSheet,
//   TouchableOpacity,
//   SafeAreaView,
//   KeyboardAvoidingView,
//   Alert,
//   LogBox,
// } from 'react-native';
// import {launchCamera} from 'react-native-image-picker';
// import palm from '../assests/Images/palm.png';
// import {useNavigation} from '@react-navigation/native';
// import {pixelNormalize} from '../components/Normalize';
// import axios from 'axios';

// const LoginPalm = ({route}) => {
//   const res = route.params.res;
//   const [image, setImage] = useState(null);
//   const [authResult, setAuthResult] = useState('');
//   const navigation = useNavigation();
//   console.log(res + ' from LoginPalm');

//   const fetchIP = async () => {
//     try {
//       const response = await fetch('https://json.extendsclass.com/bin/766b9c024d94', {
//         method: 'GET',
//       });
  
//       if (response.ok) {
//         const data = await response.json();
//         const ipAddress = data.ip_address.toString();
//         console.log('IP Address', ipAddress);
//         return ipAddress.toString();
//       } else {
//         const error = await response.json();
//         Alert.alert('Error', 'Unable to connect to backend server!');
//         console.log(`Error: Error: ${error.message}`);
//         return "error"
//       }
//     } catch (error) {
//       console.log(`Network Error: ${error.message}`);
//       Alert.alert('Network Error', `Check Internet Connection!`);
//       return "error"
//     }
//   };

//   const captureImageWithCamera = () => {
//     const options = {
//       mediaType: 'photo',
//       cameraType: 'front',
//       includeBase64: true,
//       saveToPhotos: false,
//     };

//     launchCamera(options, response => {
//       if (response.didCancel) {
//         console.log('User cancelled image picker');
//       } else if (response.errorCode) {
//         console.log('ImagePicker Error: ', response.errorMessage);
//       } else if (response.assets && response.assets.length > 0) {
//         const source = response.assets[0];
//         setImage(source);
//       }
//     });
//   };

//   const authenticateUser = async () => {
//     if (!image) return;
//     try {
//       const ip = await fetchIP();
//       if(ip === "error"){
//         Alert.alert('Backend Error', 'Try after some time');
//         return;
//       }
//       const response = await axios.post(
//         `http://${ip}:5000/authenticate`,
//         {
//           image: image.base64,
//         },
//       );
//       console.log(response.data);
//       setAuthResult(response.data.message);
//     } catch (error) {
//       console.log(error);
//       setAuthResult('Authentication failed. Please try again.');
//     }
//   };

//   return (
//     <SafeAreaView className="flex-1 bg-white p-2">
//       <KeyboardAvoidingView>
//         <View className="items-center justify-center mt-24">
//           <Text className="text-[#003580] text-xl font-bold">Verification for {res}</Text>
//           <Text className="text-black mt-3 text-lg font-medium">
//             Upload Palm images for Authentication
//           </Text>
//         </View>
//         <TouchableOpacity className="mt-3 items-center justify-center" onPress={() => navigation.navigate('Main', {user: res})}>
//           {image ? (
//             <Image
//               source={{uri: image.uri}}
//               style={{
//                 width: pixelNormalize(200),
//                 height: pixelNormalize(200),
//                 borderRadius: pixelNormalize(4),
//               }}
//               resizeMode="contain"
//             />
//           ) : (
//             <Image
//               source={palm}
//               style={{
//                 width: pixelNormalize(200),
//                 height: pixelNormalize(200),
//                 borderRadius: pixelNormalize(4),
//               }}
//               resizeMode="contain"
//             />
//           )}
//         </TouchableOpacity>
//         {authResult && (
//           <Text className="text-center mt-5 text-green-500 text-lg">
//             {authResult}
//           </Text>
//         )}
//         {image ? (
//           <View className="items-center justify-center px-8 flex-row gap-3 mt-5">
//             <TouchableOpacity
//               className="w-1/2 bg-red-500 py-3 items-center justify-center rounded-lg"
//               onPress={() => captureImageWithCamera()}>
//               <Text className="text-white text-lg font-semibold">Retake</Text>
//             </TouchableOpacity>
//             <TouchableOpacity
//               className="w-1/2 bg-[#003580] py-3 items-center justify-center rounded-lg"
//               onPress={() => authenticateUser()}>
//               <Text className="text-white text-lg font-semibold">
//                 Authenticate
//               </Text>
//             </TouchableOpacity>
//           </View>
//         ) : (
//           <TouchableOpacity
//             onPress={() => captureImageWithCamera()}
//             className="mt-5 mx-5 bg-[#003580] py-3 items-center justify-center rounded-lg">
//             <Text className="text-white text-lg font-semibold">
//               Capture Image
//             </Text>
//           </TouchableOpacity>
//         )}
//         <View className="mt-5 items-center justify-center flex-row">
//           <Text className="text-black text-lg font-medium">
//             Don't have an account?
//           </Text>
//           <TouchableOpacity onPress={() => navigation.navigate('Register')}>
//             <Text className="text-[#003580] text-lg font-semibold ml-2">
//               Sign Up
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>
//     </SafeAreaView>
//   );
// };

// export default LoginPalm;


import React, {useState} from 'react';
import {
  View,
  Text,
  Button,
  Image,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  KeyboardAvoidingView,
  Alert,
  LogBox,
  ActivityIndicator,
} from 'react-native';
import {launchCamera} from 'react-native-image-picker';
import palm from '../assests/Images/palm.png';
import {useNavigation} from '@react-navigation/native';
import {pixelNormalize} from '../components/Normalize';
import axios from 'axios';

const LoginPalm = ({route}) => {
  const res = route.params.res;
  const [image, setImage] = useState(null);
  const [authResult, setAuthResult] = useState('');
  const [loading, setLoading] = useState(false); // State for ActivityIndicator
  const navigation = useNavigation();
  console.log(res + ' from LoginPalm');

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
        console.log(`Error: Error: ${error.message}`);
        return "error"
      }
    } catch (error) {
      console.log(`Network Error: ${error.message}`);
      Alert.alert('Network Error', `Check Internet Connection!`);
      return "error"
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
    setLoading(true); // Start loading
    try {
      const ip = await fetchIP();
      if (ip === "error") {
        setLoading(false); // Stop loading if there's an error
        Alert.alert('Backend Error', 'Try after some time');
        return;
      }
      const response = await axios.post(
        `http://${ip}:5000/authenticate`,
        {
          image: image.base64,
        },
      );
      console.log(response.data);
      setAuthResult(response.data.message);
    } catch (error) {
      console.log(error);
      setAuthResult('Authentication failed. Please try again.');
    } finally {
      setLoading(false); // Stop loading after request completes
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white p-2">
      <KeyboardAvoidingView>
        <View className="items-center justify-center mt-24">
          <Text className="text-[#003580] text-xl font-bold">Verification for {res}</Text>
          <Text className="text-black mt-3 text-lg font-medium">
            Upload Palm images for Authentication
          </Text>
        </View>
        <TouchableOpacity className="mt-3 items-center justify-center" onPress={() => navigation.navigate('Main', {user: res})}>
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
              source={palm}
              style={{
                width: pixelNormalize(200),
                height: pixelNormalize(200),
                borderRadius: pixelNormalize(4),
              }}
              resizeMode="contain"
            />
          )}
        </TouchableOpacity>
        {authResult && (
          <Text className="text-center mt-5 text-green-500 text-lg">
            {authResult}
          </Text>
        )}
        {loading ? (
          <ActivityIndicator size="large" color="#003580" className="mt-5" />
        ) : image ? (
          <View className="items-center justify-center px-8 flex-row gap-3 mt-5">
            <TouchableOpacity
              className="w-1/2 bg-red-500 py-3 items-center justify-center rounded-lg"
              onPress={() => captureImageWithCamera()}>
              <Text className="text-white text-lg font-semibold">Retake</Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 bg-[#003580] py-3 items-center justify-center rounded-lg"
              onPress={() => authenticateUser()}>
              <Text className="text-white text-lg font-semibold">
                Authenticate
              </Text>
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
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginPalm;
