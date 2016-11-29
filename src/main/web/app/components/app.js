var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');
var ChatRoomDialog = require('./chat/chatRoomDialog');
// var CryptoTest = require('./cryptoTest');

var App = React.createClass({

    getInitialState: function() {
        return {
            sessionToken: null,
            roomList: []
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
        let roomIndex = this.findRoomById(roomId);
        let users = roomList[roomIndex].users;

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
        let roomIndex = this.findRoomById(roomId);
        roomList[roomIndex].users = users;
        this.setState({roomList: roomList});
    },

    findRoomById: function(roomId) {
        let roomList = this.state.roomList;
        for(let i; i<roomList.length; i++){
            if(roomList[i].roomId == roomId){
                return i;

            }
        }
    },

    render: function() {

        let loginOrLoginStatus = null;
        let chatRoom = null;
        if (this.state.sessionToken) {
            loginOrLoginStatus = <p>You are logged in</p>;


        } else {
            loginOrLoginStatus = <LogIn setSessionToken={this.setSessionToken} sessionToken={this.state.sessionToken}/>;
        }

        if(this.state.roomList.length>0){
            console.log('Start chat');
            chatRoom = <ChatRoom messages={this.state.roomList[0].messages} users={this.state.roomList[0].users}
                roomId={this.state.roomList[0].roomId} cryptoHelper={this.state.roomList[0].cryptoHelper} updateChat={this.updateChat} updateUsers={this.updateUsers}/>;
        }



        return (
            <div>
                <NewUser/> {loginOrLoginStatus}
                {chatRoom}
                <ChatRoomDialog sessionToken={this.state.sessionToken} createChatRoom={this.createChatRoom}/>
                {/* <CryptoTest/> */}
            </div>
        );
    }
});

module.exports = App;
