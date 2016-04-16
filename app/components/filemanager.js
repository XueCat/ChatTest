'use strict';
const USER_KEY = '@meteorChat:userKey';
import NavigationBar from 'react-native-navbar';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  Alert,
  View,
  ToastAndroid,
  Platform,
  Navigator,
  ScrollView,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

var RNFS = require('react-native-fs');
var Thumb = React.createClass({

  render: function() {
    return (
      <TouchableOpacity
        style={styles.itemleft}
        onPress={() => {
          RNFS.readFile(this.props.node.path).then((data)=>{
            Alert.alert(
                this.props.node.name,
                data,
                [
                  {text: 'Cancel', onPress: () => console.log('Cancel Pressed!')},
                  {text: 'OK', onPress: () => console.log('OK Pressed!')},
                ]
              )
          })
        }} >
        <View style={{flex:1, flexDirection:'row', backgroundColor:'#dbecf0'}} >
          <View style={{flex:9, justifyContent:'flex-start', flexDirection:'column', backgroundColor:'#dbecf0'}} >
            <View>
              <Text
                style={{fontSize: 30, textAlign: 'left',}}>
                {this.props.node.name}
              </Text>
            </View>
            <View>
              <Text style={{fontSize:10, marginRight:5}}>{this.props.node.path}</Text>
            </View>
          </View>

          <TouchableHighlight
            style={styles.button}
            underlayColor='#a5a5a5'
            onPress={()=> {
              this.props.node.parent.props.navigator.pop();
              this.props.node.parent.props.extrafun(
                this.props.node.name,
                this.props.node.path);
            }} >
            <Text style={styles.buttonText}>Add File</Text>
          </TouchableHighlight>
        </View>
      </TouchableOpacity>
    );
  }
});

var createThumbRow = (node, i) => <Thumb key={i} node={node} />;

export default class FileManager extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      isview:false,
      filelist: [],
    };
  };

  //mixins: [TimerMixin];
  componentDidMount() {
    let self = this;
    let fileList = this.state.filelist

    RNFS.readDir(RNFS.CachesDirectoryPath)
    .then((result) => {
      result.map(file => {
        if (file.isFile()) {
          fileList.push({name:file.name, path:file.path, parent:self});
          self.setState({filelist:fileList});
        }
      });
    });
  }

  render() {
    var index = 0;
    let self = this;
    let titleConfig = { title: 'Choose File', tintColor: 'white' };
    var leftButtonConfig = {
      title: 'Back',
      tintColor: '#fff',
      handler: function onNext() {
        self.props.navigator.pop();
      }
    };
    var rightButtonConfig = {
      title: 'Create Test',
      tintColor: '#fff',
      handler: function onNext() {
        var path = RNFS.CachesDirectoryPath + '/test.txt';
        RNFS.writeFile(path, 'it is a test', 'utf8')
          .then((success) => {
            if (Platform.OS === 'android') {
                ToastAndroid.show('Create Test File',ToastAndroid.SHORT);
            } else {
              Alert.alert(
                'Create Test File',
                'Create success!',
                [
                  {text: 'OK', onPress: () => console.log('OK Pressed!')},
                ]
              );
            }

            self.setState({isview:false});
            console.log('FILE WRITTEN!');
          })
          .catch((err) => {
            console.log(err.message);
          });
      }
    };

    let havelist = <View></View>;
    let nolist = <View></View>;

    if (this.state.filelist.length > 0) {
        havelist = this.state.filelist.map(createThumbRow);
    }  else {
        nolist = <View style={{flex: 1, alignItems:'center', justifyContent:'center'}}><Text style={{marginTop:20, fontSize:35}}>NO  FILE...</Text></View>;
    }

    return (
      <View style={{flex: 1, backgroundColor:'#c2ede9'}}>
        <NavigationBar title={titleConfig} leftButton={leftButtonConfig} rightButton={rightButtonConfig} tintColor="#1A263F"/>
        <ScrollView style={{flex: 8}}>
          {havelist}
          {nolist}
        </ScrollView>
      </View>
    );
  }

};

const styles = StyleSheet.create({
   container: {
    flex: 1,
   },
   button: {
    flex:1,
    height:55,
    backgroundColor: '#66e4b3',
    alignItems: 'center',
    justifyContent:'center',
  },
   itemleft: {
    backgroundColor:'#e6f0ec',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    margin: 10,
    height:60,
   },
   buttonText: {
     textAlign: 'center',
     color: 'white',
   },
 });
