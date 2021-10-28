/**
 * Created by satishazad on 27/10/21
 * File Name: HomeContainer
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/screens
 */

import React, { Component } from "react";
import {
    View, StyleSheet, Text, Button
} from 'react-native';
import ContainerStyle from "../styles/ContainerStyle";
import ActionButton from "../components/ActionButton";
import BottomSwipeModal from "../components/BottomSwipeModal";
import MenuListView from "../components/MenuListView";


class HomeContainer extends Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false,
            isDisabled: false,
            swipeToClose: true,
            sliderValue: 0.3
        };
    }


    /**
     * Render View
     * */
    render() {

        return (
            <View style={ContainerStyle.container}>
                <ActionButton
                    title={'Open Sheet'}
                    onPress={() => {
                       // this.props.navigation.navigate('Detail');
                        this.refs.modal1.open()
                    }}
                />

                <BottomSwipeModal
                    style={[styles.modal, styles.modal1]}
                    ref={"modal1"}
                    swipeToClose={this.state.swipeToClose}
                    onClosed={this.onClose}
                    onOpened={this.onOpen}
                    onClosingState={this.onClosingState}>
                    <View
                        style={{
                            //flex: 1,
                            width: '100%',
                            backgroundColor: 'transparent'
                        }}>
                        {/*<Text style={styles.text}>Basic modal</Text>*/}
                        {/*<Button title={`Disable swipeToClose(${this.state.swipeToClose ? "true" : "false"})`} onPress={() => this.setState({swipeToClose: !this.state.swipeToClose})} style={styles.btn}/>*/}
                        {this.renderContent()}
                    </View>
                </BottomSwipeModal>

            </View>
        );
    }


    onClose() {
        console.log('Modal just closed');
    }

    onOpen() {
        console.log('Modal just opened');
    }

    onClosingState(state) {
        console.log('the open/close of the swipeToClose just changed');
    }


    renderContent = () => {
        return (
            <MenuListView
                onPressItem={(item) => {
                    this.props.navigation.navigate('Detail');
                }}
            />
        )
    }
}


const styles = StyleSheet.create({
    modal: {
        // justifyContent: 'center',
        // alignItems: 'center'
    },

    modal1: {
        height: '80%',
        // backgroundColor: "white"
    },

    modal2: {
        height: 100,
        backgroundColor: "#3B5998"
    },

})


export default HomeContainer;
