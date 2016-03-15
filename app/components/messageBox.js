'use strict';
const USER_KEY = '@meteorChat:userKey'
import NavigationBar from 'react-native-navbar';
import Message from './message';
import React, {
  AppRegistry,
  StyleSheet,
  Text,
  TextInput,
  TouchableHighlight,
  View,
  Navigator,
} from 'react-native';

class MessageBox extends React.Component{
  render(){
    return(
      <View style={{flex: 1,}}>
        {this.props.messages.map((msg, idx)=> {
          return <Message msg={msg} key={idx} />;
        })}
      </View>
    )
  }
}

module.exports = MessageBox;
