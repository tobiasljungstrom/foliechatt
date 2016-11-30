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
            roomList: [],
            loggedInUser: null
        };
    },
    setSessionToken: function(sessionToken) {
        console.log("setting sessionToken", sessionToken);
        this.setState({sessionToken: sessionToken});

    },
    setLoggedInUser: function(user) {
        console.log("setting logged in user to:",user);
        this.setState({ loggedInUser: user });
    },

    createChatRoom: function(CH, roomId, users) {
        let roomList = this.state.roomList;
        roomList.push({cryptoHelper: CH, roomId: roomId, users: users, messages:[]});
        this.setState({roomList: roomList});
    },

    updateChat: function(message, key, roomId) {
        let roomList = this.state.roomList;
        let roomIndex = this.findRoomById(roomId);
        console.log("room idex: ", roomIndex);
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
        console.log("room list is", roomList);
        for(let i = 0; i<roomList.length; i++){
            if(roomList[i].roomId == roomId){
                return i;
            }
        }
        console.log("could not find room with id :", roomId);
    },

    render: function() {

        let loginOrLoginStatus = null;
        let chatRoom = null;
        if (this.state.sessionToken) {
            loginOrLoginStatus = <p>You are logged in as {this.state.loggedInUser.alias}</p>;


        } else {
            loginOrLoginStatus = <LogIn setLoggedInUser={ this.setLoggedInUser } setSessionToken={this.setSessionToken}/>;
        }

        if(this.state.roomList.length>0){
            console.log('Start chat');
            chatRoom = <ChatRoom
                            loggedInUser={this.state.loggedInUser}
                            messages={this.state.roomList[0].messages}
                            users={this.state.roomList[0].users}
                            roomId={this.state.roomList[0].roomId}
                            cryptoHelper={this.state.roomList[0].cryptoHelper}
                            updateChat={this.updateChat}
                            updateUsers={this.updateUsers}/>;
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
