import React, { Component } from 'react';
import { View,Image,TextInput,StyleSheet,Text,Dimensions,AsyncStorage} from 'react-native';
import { Container, Content, Button, Icon,ListItem,Left,Right } from 'native-base';
import {NimSession} from 'react-native-netease-im';
import md5 from '../utils/md5';

export default class Login extends Component {
    static navigatorStyle = {
        statusBarColor: '#fff'
    };
    constructor(props) {
        super(props);
        this.state = {
            name:"",
            password: ''
        };
    }

    componentWillMount() {
        const { navigator } = this.props;
        var token;
        AsyncStorage.multiGet(['token', 'name'], (err, data) => {
            if (!err) {
                if (data[0][1]) {
                    token = data[0][1];
                    global.imaccount = data[1][1];
                    this.setState({name:data[1][1], password:'********'});
                    NimSession.login(data[1][1], token).then((data) => {
                        global.imaccount = data[1][1];
                        navigator.resetTo({
                            screen: 'ImDemo.ChatList',
                            title: "消息"
                        });
                    })
                }
            } 
            else {
                console.warn(err);
            }
            }
        )
    }
    
    componentWillUnmount() {
        //清除密码
        this.setState({password: ''});
    }

    loginIn() {
        const {navigator} = this.props;
        NimSession.login(this.state.name,md5.createHash(this.state.password)).then((data)=>{
            global.imaccount = this.state.name;
            //本地保存用户登录状态
            AsyncStorage.multiSet([
                ['token', md5.createHash(this.state.password)],
                ['name', this.state.name]
            ]);
            navigator.resetTo({
                screen:'ImDemo.ChatList',
                title:"消息"
            });
        },(err)=>{
            console.warn(err);
        })
    }
    _renderContent(){
        return (
            <View style={styles.content}>
                <Text style={styles.bigText}>IM即时通讯</Text>
                <View style={[styles.inputView,{borderTopWidth:borderWidth,borderTopColor:'#ccc'}]}>
                    <Text style={styles.inputLabel}>账户</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.name}
                        underlineColorAndroid="transparent"
                        placeholder="请输入帐号"
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        onChangeText={name => {
                                    this.setState({name});
                                }}
                    />
                </View>
                <View style={styles.inputView}>
                    <Text style={styles.inputLabel}>密码</Text>
                    <TextInput
                        style={styles.textViewStyle}
                        value={this.state.password}
                        underlineColorAndroid="transparent"
                        secureTextEntry={true}
                        autoCapitalize="none"
                        autoCorrect={false}
                        clearButtonMode="while-editing"
                        placeholder="请输入密码"
                        onChangeText={password => {
                                        this.setState({password});
                                    }}
                    />
                </View>
            </View>
        );

    }
    render() {
        return (
            <Container>
                <Content alwaysBounceVertical={false}>
                    {this._renderContent()}
                    <View style={styles.bottom}>
                        <Button block onPress={() => this.loginIn()}>
                            <Text style={styles.buttonText}>登录</Text>
                        </Button>
                    </View>
                </Content>
            </Container>
        );
    }
}
const borderWidth = StyleSheet.hairlineWidth;
const {height,width} = Dimensions.get('window');
const styles = StyleSheet.create({
    content: {
        backgroundColor: '#fff',
        flex: 1,
        marginTop:height/2-150,
        padding:12
    },
    bottom: {
        padding:12
    },
    bigText:{
        fontSize: 22,
        textAlign: 'center'
    },
    inputView: {
        backgroundColor: '#fff',
        flexDirection: 'row',
        paddingLeft: 9,
        paddingRight: 9,
        alignItems: 'center',
        borderBottomWidth: borderWidth,
        borderBottomColor: '#ccc',
        height: 41,
        borderLeftWidth: borderWidth,
        borderLeftColor: '#ccc',
        borderRightWidth: borderWidth,
        borderRightColor: '#ccc'
    },
    inputLabel: {
        fontSize: 14,
        marginRight: 10
    },
    textViewStyle: {
        flex: 1,
        fontSize: 14,
        justifyContent: 'center'
    },
    buttonText: {
        color: '#fff'
    },
});
