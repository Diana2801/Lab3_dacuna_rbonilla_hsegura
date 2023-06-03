import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Modal, Image } from 'react-native';
import { Camera } from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import { Ionicons } from '@expo/vector-icons'

export default function App() {
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const camRef = useRef(null);
  const [photo, setPhoto] = useState(null);
  const [open, setOpen] = useState(null);


  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);
  if (hasPermission === null) {
    return <View />;
  }
  else if (hasPermission === false) {
    return <text>Acceso denegado</text>
  }

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      console.log(data);
      setPhoto(data.uri);
      setOpen(true);

    }
  }


  return (
    <SafeAreaView style={styles.container}>
      <Camera
        style={{ flex: 3 }}
        type={type}
        ref={camRef}
      >
        <TouchableOpacity style={styles.buttonCambiar} onPress={() => {
          setType(
            type === Camera.Constants.Type.front ?
              Camera.Constants.Type.back :
              Camera.Constants.Type.front
          );
        }}>
          <Ionicons name='ios-camera-reverse' size={30} color={'black'} />
          {/* <Text style={styles.buttonText} >Cambiar</Text> */}
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonPhoto} onPress={() => { takePicture() }}>
          <Ionicons name='camera' size={30} color={'black'} />
        </TouchableOpacity>
        {photo &&

          <Modal
            animationType='slide'
            transparent={false}
            visible={open}
          >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', margin: 10 }}>
              <TouchableOpacity style={styles.buttonCambiar} onPress={() => {
                setOpen(false);
              }}>
                <Ionicons name='close-sharp' size={40} color={'red'} />
              </TouchableOpacity>
              <Image
                style={styles.photo}
                source={{ uri: photo }}
              />
            </View>
          </Modal>

        }
      </Camera>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'black',
    width: '100%',
    height: 350
  },
  camera: {
    flex: 1,
    width: '100%',
    height: 350
  },
  buttonCambiar: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonPhoto: {
    position: 'absolute',
    bottom: 20,
    right: 20,
    paddingVertical: 12,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 15,
  },
  buttonText: {
    fontSize: 16,
    color: '#ff0',
    marginBottom: 10,
  },
  photo: {
    width: '100%',
    height: 350
  }
});
