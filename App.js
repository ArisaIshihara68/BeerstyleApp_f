import React from 'react'
import { Provider } from 'react-redux'
import { createAppContainer } from 'react-navigation'
import AppNavigator from './AppNavigator'
import configureStore from './configureStore'

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
}
console.ignoredYellowBox = [
  'Remote debugger is in a background tab which may cause apps to perform slowly. Fix this by foregrounding the tab (or opening it in a separate window).',
];