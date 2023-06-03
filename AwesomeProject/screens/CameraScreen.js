import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Camera } from 'expo-camera';
import * as FileSystem from 'expo-file-system';
import * as MediaLibrary from 'expo-media-library';

const { width, height } = Dimensions.get('window');

const CameraScreen = () => {
  const [hasPermission, setHasPermission] = useState(null);
  const [camera, setCamera] = useState(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      createFolder();
    })();
  }, []);

  const createFolder = async () => {
    const folderPath = `${FileSystem.documentDirectory}photo-app/`;

    try {
      const { exists } = await FileSystem.getInfoAsync(folderPath);
      if (!exists) {
        await FileSystem.makeDirectoryAsync(folderPath, { intermediates: true });
        console.log('Folder created successfully!');
      } else {
        console.log('Folder already exists!');
      }
    } catch (error) {
      console.log('Error creating folder:', error);
    }
  };

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      const date = new Date();
      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      const directory = `${FileSystem.documentDirectory}photo-app/${year}/${month}/${day}/`;

      try {
        await FileSystem.makeDirectoryAsync(directory, { intermediates: true });
        const fileName = `${directory}photo.jpg`;

        await FileSystem.moveAsync({
          from: photo.uri,
          to: fileName,
        });

        await MediaLibrary.saveToLibraryAsync(fileName); // Guardar en la biblioteca de medios
        console.log('Photo saved successfully!');
      } catch (error) {
        console.log('Error creating folder or saving photo:', error);
      }
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View style={styles.container}>
      <Camera
        style={styles.camera}
        type={Camera.Constants.Type.back}
        ref={(ref) => setCamera(ref)}
      />
      <TouchableOpacity style={styles.button} onPress={takePicture}>
        <Text style={styles.buttonText}>Take Picture</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  camera: {
    flex: 1,
    width: width,
    height: height,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    left: width / 2 - 75,
    width: 150,
    height: 60,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default CameraScreen;
