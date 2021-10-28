/**
 * Created by satishazad on 27/10/21
 * File Name: ActionButton
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/components
 */

import React from "react";
import {
    View, StyleSheet, TouchableOpacity, Text
} from "react-native";



const ActionButton = (props) => {

    return (
        <TouchableOpacity onPress={() => props.onPress()}>
            <View style={styles.containerView}>
                <Text style={styles.title}>
                    {props.title}
                </Text>
            </View>
        </TouchableOpacity>
    )
}


const styles = StyleSheet.create({
   containerView: {
       backgroundColor: '#147EFB',
       padding: 10,
       width: '80%',
       alignItems: 'center',
       borderRadius: 6
   },
    title: {
        textAlign: 'center',
        color: 'white'
    }
});


export default ActionButton;
