'use strict';
const USER_KEY = '@meteorChat:userKey';
import NavigationBar from 'react-native-navbar';
import MessageBox from './messageBox';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import React, {
  AppRegistry,
  StyleSheet,
  Text,
  View,
  Navigator,
  TextInput,
  TouchableHighlight,
  ScrollView,
} from 'react-native';

var BUTTONS = [
  'Logout',
  'Cancel',
];
var CANCEL_INDEX = 1;

class ChatAndroid extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      messagesObserver: null,
      newMessage: '',
    }
  }
  render(){
    console.log('MESSAGES', this.state.messages);
    let self = this;
    let titleConfig = { title: 'Meteor Chat', tintColor: 'white' };
    var rightButtonConfig = {
      title: 'Logout',
      tintColor: '#fff',
      handler: function onNext() {
        self.props.navigator.push({
          name: 'SignupAndroid'
        })
      }
    };
    return (
      <View style={{flex: 1,}}>
        <NavigationBar title={titleConfig} rightButton={rightButtonConfig} tintColor="#1A263F"/>
        <InvertibleScrollView inverted={true} ref='invertible' style={{flex: .8}}>
          <MessageBox messages={this.state.messages} />
        </InvertibleScrollView>
        <View style={{flex: .1, backgroundColor: 'white', flexDirection: 'row'}}>
          <TextInput
            value={this.state.newMessage}
            placeholder='Say something...'
            onChangeText={(text) => {this.setState({newMessage: text})}}
            style={styles.input}
            />
          <TouchableHighlight
            style={styles.button}
            onPress={() => {
              if (this.state.newMessage != '') {
                let options = {
                  author: this.props.username,
                  message: this.state.newMessage,
                  createdAt: new Date(),
                  avatarUrl: '',
                };
                this.setState({newMessage: ''});
              }
            }}
            underlayColor='red'>
            <Text style={styles.buttonText}>Send</Text>
          </TouchableHighlight>
        </View>
      </View>
    )
  }
};

let styles = StyleSheet.create({
  input: {
    height: 50,
    padding: 8,
    flex: 1,
    marginRight: 5,
    fontSize: 16,
    borderWidth: 1,
    margin: 10,
    borderColor: '#b4b4b4',
    borderRadius: 8,
    color: 'black',
    backgroundColor: 'white',
  },
  button: {
    flex: .4,
    backgroundColor: "#E0514B",
    borderRadius: 6,
    justifyContent: 'center',
    margin: 10,
  },
  buttonText: {
    textAlign: 'center',
    color: 'white',
    fontSize: 16,
  },
})

module.exports = ChatAndroid;
