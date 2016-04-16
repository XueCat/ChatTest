/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
const USER_KEY = '@meteorChat:userKey'
import React from 'react-native';
import Chat from './app/components/chat';
import FileManager from './app/components/filemanager.js';
import Signup from './app/components/signup';
import ddp from './app/config/ddp';
var {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  AsyncStorage,
  ActivityIndicatorIOS,
} = React;

global.process = require("./app/config/process.polyfill");

class ChatTest extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      initialRoute: '',
      loggedIn: false,
      username: '',
    }
  }
  componentDidMount() {
    let self = this;
    ddp.initialize()
      .then(() => {
        return ddp.loginWithToken();
      })
      .then((res) => {
        let state = {
          connected: true,
          loggedIn: false
        };
        if (res.loggedIn === true) {
          state.loggedIn = true;
          state.userId = res.userId;
          state.username = res.username;
          state.initialRoute = 'Chat';
        } else {
          state.initialRoute = 'Signup';
        }
        this.setState(state);
      });
  }

  extraFun(title, data) {

  }

  render() {
    if (this.state.initialRoute == '') {
      return (
        <View style={{flex: 1}}>
          <ActivityIndicatorIOS />
        </View>
      )

    }
    return (
      <Navigator style={{flex: 1}}
        initialRoute={{name: this.state.initialRoute}}
        renderScene={(route, navigator) => {
          if (route.name == 'Chat') {
            return (
              <Chat
                navigator={navigator}
                loggedIn={(userId, username) => {
                  this.setState({userId: userId, username: username})
                }}
                userId={this.state.userId}
                username={this.state.username}
                />
            );
          } else if (route.name == 'Signup') {
            return (
              <Signup
                loggedIn={(userId, username) => {
                  this.setState({userId: userId, username: username})
                }}
                navigator={navigator}
                />
            );
          } else if (route.name == 'FileManager') {
            return (
              <FileManager
              userId={this.state.userId}
              extrafun={route.extrafun}
              navigator={navigator}
              />
            );
          }
        }}
      />
    );
  }
};

var styles = StyleSheet.create({
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
