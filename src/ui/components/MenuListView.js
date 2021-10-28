/**
 * Created by satishazad on 29/10/21
 * File Name: MenuListView
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/ui/components
 */

import React from "react";
import {
    View, StyleSheet, FlatList, Pressable
} from "react-native";
import Label from "./Label";
import IconConstants from "../icons/IconConstants";
import ImageView from "./ImageView";

const MenuItems = [
    {
        index: 0,
        title: 'Transfer Cash',
        description: 'Add and withdraw cash',
        icon: IconConstants.ICON_1
    },
    {
        index: 1,
        title: 'Save for something new',
        description: 'Save & invest towards something in the future',
        icon: IconConstants.ICON_2
    },
    {
        index: 2,
        title: 'Invite Cameron',
        description: 'Give Cameron access to login to their account',
        icon: IconConstants.ICON_3
    },
    {
        index: 3,
        title: 'Share profile link',
        description: 'Other can signup and contribute to this account.',
        icon: IconConstants.ICON_4
    },
    {
        index: 4,
        title: 'Settings and Account Documents',
        description: 'View and change settings. Access monthly statements, trade confirms and tax docs.',
        icon: IconConstants.ICON_4
    },
    {
        index: 5,
        title: 'Delete Account',
        description: 'Remove an account that is not in use.',
        icon: IconConstants.ICON_5
    }
]

const MenuListView = (props) => {

    const renderItem = (item) => {
      return (
          <Pressable onPress={() => props.onPressItem(item) }>
              <View style={styles.rowContainer}>
                  <View style={styles.rowContentView}>
                      <View style={styles.viewLeft}>
                          <ImageView
                              source={item.icon}
                              style={{
                                  height: 70,
                                  width: 70
                              }}
                          />
                      </View>
                      <View style={styles.viewRight}>
                          <Label
                              textStyle={styles.titleText}
                              viewStyle={{paddingTop: 0, paddingBottom: 0}}
                              text={item.title}
                          />
                          <Label
                              textStyle={styles.descriptionText}
                              viewStyle={{paddingTop: 2, paddingBottom: 2}}
                              text={item.description}
                          />
                      </View>
                  </View>
              </View>
          </Pressable>
      )
    }

    return (
        <View style={styles.container}>
            <View
                style={styles.topBar}
            />
            <View
                style={{height: 20}}
            />
            <FlatList
                data={MenuItems}
                scrollEnabled={false}
                renderItem={({ item }) => renderItem(item)} />
        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        //paddingTop: 56,
        backgroundColor: 'rgba(245, 245, 245, 1)',
        borderTopStartRadius: 20,
        borderTopEndRadius: 20
    },
    rowContainer: {
        padding: 2,
        backgroundColor: 'white'
    },
    rowContentView: {
        backgroundColor: 'rgba(245, 245, 245, 1)',
        flexDirection: 'row',
        padding: 4,
        paddingLeft: 8
    },
    viewLeft: {
        flex: 1
    },
    viewRight: {
        flex: 4,
        justifyContent: 'center'
    },
    titleText: {
        fontSize: 18,
        fontWeight: '600'
    },
    descriptionText: {
        color: 'rgba(129, 132, 137, 1)',
    },
    topBar: {
        height: 10,
        backgroundColor: 'white',
        width: '40%',
        alignSelf: 'center',
        position: 'absolute',
        borderRadius: 16,
        top: -14
    }
});



export default MenuListView;
