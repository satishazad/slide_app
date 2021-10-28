/**
 * Created by satishazad on 27/10/21
 * File Name: Label
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/components
 */

import React from "react";
import {
    Text,
    View, StyleSheet
} from 'react-native';



const Label = (props) => {

    return (
        <View style={[styles.view, props.viewStyle]}>
            <Text style={[styles.text, props.textStyle]}>
                {props.text}
            </Text>
        </View>
    )
}


const styles = StyleSheet.create({
    text: {

    },
    view: {
        padding: 6
    }
})


export default Label;
