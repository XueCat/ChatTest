'use strict';
const USER_KEY = '@meteorChat:userKey'
import moment from 'moment';

import React, {
  AppRegistry,
  StyleSheet,
  Text,
  Alert,
  ToastAndroid,
  Animated,
  Easing,
  Image,
  TextInput,
  TouchableHighlight,
  View,
  Navigator,
} from 'react-native';

var RNFS = require('react-native-fs');

class Message extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      translateAnim: new Animated.Value(0),
    }
  }
  componentDidMount() {
     Animated.timing(          // Uses easing functions
       this.state.translateAnim,    // The value to drive
       {toValue: 1},           // Configuration
     ).start();                // Don't forget start!
  }
  render(){

    let messageview = <View></View>;

    let isJson = function(obj){
            var isjson = typeof(obj) == "object" && Object.prototype.toString.call(obj).toLowerCase() == "[object object]" && !obj.length
            return isjson;
        }

    let IsJsonString = function (str) {
        try {
            JSON.parse(str);
        } catch (e) {
            return false;
        }
        return true;
    }

    if (IsJsonString(this.props.msg.message)) {
      let jmessage = JSON.parse(this.props.msg.message);
      messageview = (<View>
                        <TouchableHighlight
                          underlayColor="#e0eef1"
                          onPress={()=>Alert.alert(
                            '是否下载文件?',
                            'Tips',
                            [
                            {text:'取消',onPress:()=>{}},
                            {text:'确定',onPress:()=>{
                              var path = RNFS.CachesDirectoryPath + '/' +jmessage.filename;

                              RNFS.writeFile(path, jmessage.filedata, 'utf8')
                                .then((success) => {
                                  ToastAndroid.show('成功下载',ToastAndroid.SHORT);
                                })
                                .catch((err) => {
                                  ToastAndroid.show('文件保存失败',ToastAndroid.SHORT);
                                });

                            }}
                          ])}>
                          <Image
                            source={require('./file.png')} />
                        </TouchableHighlight>
                        <Text style={styles.messageText}>{jmessage.filename}</Text>
                      </View>);
    } else {
      messageview = <Text style={styles.messageText}>{this.props.msg.message}</Text>;
    }

    return (
      <Animated.View
        style={{
           opacity: 1,
           transform: [{
             translateY: this.state.translateAnim.interpolate({
               inputRange: [0, 1],
               outputRange: [150, 0]
             }),
           }],
         }}
      >
        <View style={styles.container}>
          <Image
            style={styles.icon}
            source={require('./meteor-icon.png')}
          />
          <View style={styles.messageBox}>
            <View style={styles.row}>
              <Text style={styles.author}>{this.props.msg.author}</Text>
              <Text style={styles.sent}>{moment(this.props.createdAt).fromNow()}</Text>
            </View>
            <View style={styles.messageView}>
              {messageview}
            </View>
          </View>
        </View>
      </Animated.View>
    );
  }
};

let styles = StyleSheet.create({
  container:{
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
    paddingVertical: 10,
  },
  icon: {
    marginTop: 10,
    marginLeft: 13
  },
  messageBox: {
    flex: 1,
    alignItems: 'stretch',
    padding: 10,
  },
  row: {
    flexDirection: 'row',
    marginBottom: 2,
    marginTop: 10
  },
  messageView: {
    backgroundColor: 'white',
    flex: 1,
    paddingRight: 15
  },
  messageText: {
    fontSize: 16,
    fontWeight: '300',
  },
  author:{
    fontSize: 12,
    fontWeight: '700'
  },
  sent:{
    fontSize: 12,
    fontWeight: '300',
    color: '#9B9B9B',
    marginLeft: 10,
  }
})
module.exports = Message;
