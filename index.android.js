/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 */
'use strict';
const USER_KEY = '@meteorChat:userKey';
import ddp from './app/config/ddp';
import FileManager from './app/components/filemanager.js';
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

global.process.nextTick = setImmediate;

class ChatTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId:1,
      initialRoute: 'ChatAndroid',
      loggedIn: false,
      username: '',
    }
  }

  componentWillMount() {
    console.log('MOUNTING')
    let self = this;
    ddp.initialize()
      .then(() => {
        console.log('GOT IT');
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
          state.initialRoute = 'ChatAndroid';
        } else {
          state.initialRoute = 'SignupAndroid';
        }
        this.setState(state);
      });
  }

  render() {
    console.log('INITIAL ROUTE', this.state.initialRoute);
    if (this.state.initialRoute == '') {
      return (
        <View style={{flex: 1}}>
          <Text>LOADING...</Text>
        </View>
      )
    }
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
          } else if (route.name == 'FileManager') {
            return (
              <FileManager
              userId={this.state.userId}
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
