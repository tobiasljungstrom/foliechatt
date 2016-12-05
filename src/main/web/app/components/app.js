var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');
var ChatRoomDialog = require('./chat/chatRoomDialog');
var Greeting = require('./greeting');

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

    leaveChatRoom: function(roomId) {
        let roomList = this.state.roomList;
        let roomIndex = findRoomById(roomId);
        roomList.splice(roomIndex, 1);
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

    componentDidMount: function() {
        let location = window.location.href;
        let baseUrl;
        if(location.includes('localhost:8080')){
            baseUrl = 'http://localhost:9876/foliechatt/';
            console.log('has webpack');
        } else {
            baseUrl = '/foliechatt/';
            console.log('has not webpack', location);
        }
        this.setState({baseUrl: baseUrl});
    },

    render: function() {

        let login = null;
        let newUser = null;
        let chatRooms = [];
        let chatRoomDialog = null;
        let greeting = null;

        if (!this.state.sessionToken) {
            login = <LogIn baseUrl={this.state.baseUrl} setLoggedInUser={ this.setLoggedInUser } setSessionToken={this.setSessionToken}/>;
            newUser = <NewUser baseUrl={this.state.baseUrl}/>;
        } else {
            chatRoomDialog = <ChatRoomDialog sessionToken={this.state.sessionToken} createChatRoom={this.createChatRoom} baseUrl={this.state.baseUrl}/>;
            greeting = <Greeting userName={this.state.loggedInUser.alias}/>;
        }

        if(this.state.roomList.length>0){
            this.state.roomList.forEach( (room, index) => {
                chatRooms[index] = <ChatRoom
                    key={index}
                    sessionToken={this.state.sessionToken}
                    baseUrl={this.state.baseUrl}
                    loggedInUser={this.state.loggedInUser}
                    messages={this.state.roomList[index].messages}
                    users={this.state.roomList[index].users}
                    roomId={this.state.roomList[index].roomId}
                    cryptoHelper={this.state.roomList[index].cryptoHelper}
                    leaveChatRoom={this.leaveChatRoom}
                    updateChat={this.updateChat}
                    updateUsers={this.updateUsers}/>;
            });
        }



        return (
            <div className='container'>
                <div className="nav">
                    <h1>Foliechatt_</h1>
                </div>
                <div className="row">
                    <div className="col-md-6">
                        {login}
                    </div>
                    <div className="col-md-6">
                        {newUser}
                    </div>
                </div>
                <div className="row">
                    <div className="col-md-2"></div>
                    <div className="col-md-8">
                        {greeting}
                        {chatRoomDialog}
                    </div>
                    <div className="col-md-2"></div>

                </div>
                {chatRooms}

                {/* <CryptoTest/> */}
            </div>
        );
    }
});

module.exports = App;
