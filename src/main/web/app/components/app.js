var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');
var ChatRoomDialog = require('./chat/chatRoomDialog');

require('../css/main.scss');

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
        console.log("setting logged in user to:",user.alias);
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
        console.log("room index: ", roomIndex);
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
        let chatRooms = [];
        if (this.state.sessionToken) {
            loginOrLoginStatus = <p>You are logged in as {this.state.loggedInUser.alias}</p>;


        } else {
            loginOrLoginStatus = <LogIn setLoggedInUser={ this.setLoggedInUser } setSessionToken={this.setSessionToken}/>;
        }

        if(this.state.roomList.length>0){
            this.state.roomList.forEach( (room, index) => {
                chatRooms[index] = <ChatRoom
                    key={index}
                    loggedInUser={this.state.loggedInUser}
                    messages={this.state.roomList[index].messages}
                    users={this.state.roomList[index].users}
                    roomId={this.state.roomList[index].roomId}
                    cryptoHelper={this.state.roomList[index].cryptoHelper}
                    updateChat={this.updateChat}
                    updateUsers={this.updateUsers}/>
            });
        }



        return (
            <div>
                <NewUser/>
                {loginOrLoginStatus}
                {chatRooms}
                <ChatRoomDialog sessionToken={this.state.sessionToken} createChatRoom={this.createChatRoom}/>
                {/* <CryptoTest/> */}
            </div>
        );
    }
});

module.exports = App;
