/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
const USER_KEY = '@meteorChat:userKey';
import ChatAndroid from './app/components/chatAndroid.js';
import SignupAndroid from './app/components/signupAndroid.js';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  AsyncStorage,
} from 'react-native';

class ChatTest extends Component {
  constructor(props){
    super(props);
    this.state = {
      userId:1,
      initialRoute: 'SignupAndroid',
      loggedIn: false,
      username: 'a',
    }
  }
  render() {
    console.log('INITIAL ROUTE', this.state.initialRoute);
    return (
      <Navigator style={{flex: 1}}
        initialRoute={{name: this.state.initialRoute}}
        renderScene={(route, navigator) => {
          if (route.name == 'ChatAndroid') {
            return (
              <ChatAndroid
                navigator={navigator}
                userId={this.state.userId}
                username={this.state.username}
                />
            );
          } else if (route.name == 'SignupAndroid') {
            return (
              <SignupAndroid
                loggedIn={(userId) => {this.setState({userId: userId})}}
                navigator={navigator}
                />
            );
          }
        }}
      />
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

AppRegistry.registerComponent('ChatTest', () => ChatTest);
