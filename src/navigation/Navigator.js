/**
 * Created by satishazad on 27/10/21
 * File Name: Navigator
 * Product Name: WebStorm
 * Project Name: slide_app
 * Path: src/navigation
 */

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeContainer from "../ui/screens/HomeContainer";
import DetailContainer from "../ui/screens/DetailContainer";



const Stack = createNativeStackNavigator();


function RootApp() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name={'Home'} component={HomeContainer} />
                <Stack.Screen name={'Detail'} component={DetailContainer} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}



export default RootApp;
