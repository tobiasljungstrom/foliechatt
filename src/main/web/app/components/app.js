var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');
var ChatRoomDialog = require('./chat/chatRoomDialog');
var CryptoTest = require('./cryptoTest');

var App = React.createClass({

    getInitialState: function() {
        return {
            sessionToken: null,
            roomList: [
                {
                    roomId: 'generatedRoomId',
                    users: [
                        {
                            userAlias: 'Bob',
                            publicKey: 'abc'
                        }
                    ],
                    messages: [
                        {
                            user: 'Bob',
                            message: 'Hello'
                        }
                    ]
                }
            ]
        };
    },
    setSessionToken: function(sessionToken) {
        this.setState({sessionToken: sessionToken});

    },

    createChatRoom: function(CH, roomId, users) {
        let roomList = this.state.roomList;
        roomList.push({cryptoHelper: CH, roomId: roomId, users: users, messages:[]});
        this.setState({roomList: roomList});
    },

    updateChat: function(message, key, roomId) {
        let roomList = this.state.roomList;
        let users;
        let roomIndex;

        for(let i; i<roomList.length; i++){
            if(roomList[i].roomId == roomId){
                users = roomList[i].users;
                roomIndex = i;
                break;
            }
        }

        let userAlias = 'default name';
        for (let i = 0; i < users.length; i++) {
            let user = users[i];
            if (user.publicKey === key) {
                userAlias = users[i].userAlias;
                break;
            }
        }
        roomList[roomIndex].messages.push({message: message, user: userAlias});

        this.setState({roomList:roomList});
    },

    updateUsers: function(users, roomId) {
        let roomList = this.state.roomList;
        roomList[roomId].users = users;
        this.setState({roomList: roomList});
    },

    render: function() {

        let loginOrLoginStatus = null;
        if (this.state.sessionToken) {
            loginOrLoginStatus = <p>You are logged in</p>;
        } else {
            loginOrLoginStatus = <LogIn setsessionToken={this.setSessionToken} sessionToken={this.state.sessionToken}/>;
        }

        return (
            <div>
                <NewUser/> {loginOrLoginStatus}
                {/* <ChatRoom messages={this.state.messages} users={this.state.users} updateChat={this.updateChat} updateUsers={this.updateUsers}/> */}
                <ChatRoomDialog sessionToken={this.state.sessionToken} createChatRoom={this.createChatRoom}/>
                <CryptoTest/>
            </div>
        );
    }
});

module.exports = App;
