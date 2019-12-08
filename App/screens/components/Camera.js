import React from "react";
import {RNCamera} from "react-native-camera";
import {Text, TouchableOpacity, View} from "react-native";
import {Consumer} from '../context';

export const Camera = ({navigation}) => {

    return (
        <Consumer>
            {({takePicture}) => (
                <RNCamera
                    type={RNCamera.Constants.Type.back}
                    flashMode={RNCamera.Constants.FlashMode.on}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We need your permission to use your camera',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel',
                    }}
                    style={{width: "100%", height: "100%"}}
                >
                    {({camera, status}) => {
                        if (status === 'READY')
                            return (
                                <View style={{flex: 1, justifyContent: 'flex-end'}}>
                                    <TouchableOpacity
                                        onPress={() => takePicture(camera).then(() => navigation.navigate("TaskList"))}>
                                        <Text style={{
                                            fontSize: 20,
                                            alignContent: 'center',
                                            textAlign: 'center',
                                            marginBottom: 12
                                        }}> Take Picture </Text>
                                    </TouchableOpacity>
                                </View>
                            );
                    }}
                </RNCamera>)}
        </Consumer>
    );
};
