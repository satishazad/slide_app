/**
 * Created by satishazad on 29/10/21
 * File Name: ImageView
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/components
 */

import React from "react";
import {
    Image, StyleSheet, View
} from 'react-native';


const ImageView = (props) => {

    return (
        <Image
            source={props.source}
            style={[props.style]}
        />
    )
}



export default ImageView;
