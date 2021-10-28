/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import React, { Component } from 'react';
import RootApp from "./src/navigation/Navigator";


class App extends Component {

  constructor(props) {
    super(props);

  }


  render() {
    return RootApp();
  }

}


export default App;
