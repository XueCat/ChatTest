'use strict';
const USER_KEY = '@meteorChat:userKey';
import NavigationBar from 'react-native-navbar';
import InvertibleScrollView from 'react-native-invertible-scroll-view';
import React, {
  AppRegistry,
  Component,
  StyleSheet,
  Text,
  View,
  Navigator,
  ScrollView,
  AsyncStorage,
  TouchableHighlight,
  TouchableOpacity,
} from 'react-native';

var RNFS = require('react-native-fs');
var TimerMixin = require('react-timer-mixin');

var Thumb = React.createClass({

  render: function() {
    return (
      <TouchableOpacity
        style={styles.itemleft}
        onPress={()=> {
          this.props.node.parent.props.navigator.push({
            name: 'ChatAndroid',
            sceneConfig: Navigator.SceneConfigs.FloatFromBottom,
            extras:{ntype:2,title:this.props.node.name,data:this.props.node.path}
          })
        }} >
        <View style={{flexDirection:'column', backgroundColor:'#dbecf0'}} >
          <View>
            <Text
              style={{fontSize: 30, textAlign: 'left',}}>
              {this.props.node.name}
              </Text>
          </View>
          <View>
            <Text style={{fontSize:14, marginRight:5}}>{this.props.node.path}</Text>
          </View>
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
  componentWillUnmount() {
    this.timer && clearTimeout(this.timer);
  }
  //mixins: [TimerMixin];
  componentWillMount() {
    let self = this;
    this.timer = setTimeout(
      ()=>{
        if (!this.state.isview) {
          this.setState({isview:true});
        }
      },
      100
    );

    RNFS.readDir(RNFS.DocumentDirectoryPath)
    .then((result) => {
      console.log('is find data', result);
      return Promise.all([RNFS.stat(result[0].path), result[0].name, result[0].path]);
    })
    .then((statResult) => {
      if (statResult[0].isFile()) {
        var tn = statResult[1];
        var tp = statResult[2];

        self.state.filelist.push({name:tn, path:tp, parent:self});
        self.setState({isview:true});
      }
      return 'no file';
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
        self.props.navigator.push({
          name: 'ChatAndroid'
        })
      }
    };

    if (this.state.isview) {
      this.timer && clearTimeout(this.timer);
    };

    let havelist = <View></View>;
    let nolist = <View></View>;

    if (this.state.filelist.length > 0) {
        havelist = this.state.filelist.map(createThumbRow);
    }  else {
        nolist = <View style={{flex: 1, alignItems:'center'}}><Text>NOFILE...</Text></View>;
    }

    return (
      <View style={{flex: 1, backgroundColor:'#c2ede9'}}>
        <NavigationBar title={titleConfig} leftButton={leftButtonConfig} tintColor="#1A263F"/>
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
   itemleft: {
    backgroundColor:'#e6f0ec',
    justifyContent: 'flex-start',
    alignItems: 'stretch',
    margin: 10,
    height:60,
   },
 });
