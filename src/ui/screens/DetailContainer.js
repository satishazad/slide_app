/**
 * Created by satishazad on 27/10/21
 * File Name: DetailContainer
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/screens
 */


import React, { Component } from "react";
import {
    View, StyleSheet
} from 'react-native';
import Label from "../components/Label";
import ContainerStyle from "../styles/ContainerStyle";
import ActionButton from "../components/ActionButton";

class DetailContainer extends Component {

    constructor(props) {
        super(props);

    }


    /**
     * Render View
     * */
    render() {
        return (
            <View style={ContainerStyle.container}>
                <ActionButton
                    title={'Take Me Back'}
                    onPress={() => {
                        this.props.navigation.goBack();
                    }}
                />
            </View>
        );
    }
}



export default DetailContainer;
