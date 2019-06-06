import React from 'react'
import { Provider } from 'react-redux'
import { createAppContainer } from 'react-navigation'
import AppNavigator from './AppNavigator'
import configureStore from './configureStore'
import { YellowBox } from 'react-native';
import _ from 'lodash';
import { Container } from 'native-base';


const store = configureStore()

const AppContainer = createAppContainer(AppNavigator)

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppContainer />
      </Provider>
    )
  }

  componentWillMount() {
    this.loadFonts();
  }

  //fonterror?
  async loadFonts() {
    await Expo.Font.loadAsync({
      Roboto: require("./node_modules/native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("./node_modules/native-base/Fonts/Roboto_medium.ttf"),
    });
    this.setState({ isReady: true });
  };
}

//警告を強制排除
console.ignoredYellowBox = [
  'Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).',
];
YellowBox.ignoreWarnings(['Setting a timer']);
const _console = _.clone(console);
console.warn = message => {
  if (message.indexOf('Setting a timer') <= -1) {
    _console.warn(message);
  }
};


