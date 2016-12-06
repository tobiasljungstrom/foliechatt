var React = require('react');
var Cookies = require('js-cookie');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');
var ChatRoomDialog = require('./chat/chatRoomDialog');
var Greeting = require('./greeting');
const COOKIE_SESSION_TOKEN ='sessionToken';
const COOKIE_LOGGED_IN_USER = 'loggedInUser';
const EXPIRES_OPT = { expires: 1 / 288 };

require('../css/main.scss');

var App = React.createClass({
    getInitialState: function() {
        let maybeLoggedInUser = Cookies.get(COOKIE_LOGGED_IN_USER);
        console.log("maybeLoggedINuser is:", maybeLoggedInUser);
        return {
            sessionToken: Cookies.get(COOKIE_SESSION_TOKEN),
            roomList: [],
            loggedInUser: maybeLoggedInUser ? JSON.parse(maybeLoggedInUser) : null
        };
    },
    logOut: function() {
        const setState = this.setState.bind(this);
        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //Callback triggers on success
            if (this.readyState == 4 && this.status == 200) {
                Cookies.remove(COOKIE_LOGGED_IN_USER);
                Cookies.remove(COOKIE_SESSION_TOKEN);
                setState( {sessionToken : null, roomList : []} );

                //console.log('LOG IN IS GOOD');
            } else if(this.readyState == 4) {
                console.log('UNATHORIZED');
            }

        };
        request.open('POST', `${this.state.baseUrl}api/v.1/logout`, true);
        request.setRequestHeader('sessionToken', this.state.sessionToken);
        request.send();


    },
    setSessionToken: function(sessionToken) {
        console.log("setting sessionToken", sessionToken);
        Cookies.set(COOKIE_SESSION_TOKEN, sessionToken, EXPIRES_OPT);
        this.setState({sessionToken: sessionToken});

    },
    setLoggedInUser: function(user) {
        console.log("setting logged in user to:",user.alias);
        Cookies.set(COOKIE_LOGGED_IN_USER, JSON.stringify(user));
        this.setState({ loggedInUser: user });
    },

    createChatRoom: function(CH, roomId, users) {
        let roomList = this.state.roomList;
        roomList.push({cryptoHelper: CH, roomId: roomId, users: users, messages:[]});
        this.setState({roomList: roomList})
    },

    leaveChatRoom: function(roomId) {
        let roomList = this.state.roomList;
        let roomIndex = this.findRoomById(roomId);
        console.log("Room index to be removed: ", roomIndex);
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
        if (roomIndex != null) {
            roomList[roomIndex].users = users;
            this.setState({roomList: roomList});

        }
    },

    findRoomById: function(roomId) {
        let roomList = this.state.roomList;
        console.log("room list is", roomList);
        for (let i = 0; i < roomList.length; i++) {
            if (roomList[i].roomId == roomId) {
                return i;
            }
        }
        console.log("could not find room with id :", roomId);
        return null;
    },

    componentDidMount: function() {
        window.Cookies = Cookies;
        let location = window.location.href;
        let baseUrl;
        if (location.includes('localhost:8080')) {
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
            login = <LogIn baseUrl={this.state.baseUrl} setLoggedInUser={this.setLoggedInUser} setSessionToken={this.setSessionToken}/>;
            newUser = <NewUser baseUrl={this.state.baseUrl}/>;
        } else {
            chatRoomDialog = <ChatRoomDialog sessionToken={this.state.sessionToken} createChatRoom={this.createChatRoom} baseUrl={this.state.baseUrl}/>;
            greeting = <Greeting userName={this.state.loggedInUser.alias}/>;
        }

        if(this.state.roomList.length>0 && this.state.sessionToken){
            this.state.roomList.forEach( (room, index) => {
                chatRooms[index] = <ChatRoom
                    key={index}
                    baseUrl={this.state.baseUrl}
                    loggedInUser={this.state.loggedInUser}
                    messages={this.state.roomList[index].messages}
                    users={this.state.roomList[index].users}
                    roomId={this.state.roomList[index].roomId}
                    cryptoHelper={this.state.roomList[index].cryptoHelper}
                    updateChat={this.updateChat}
                    updateUsers={this.updateUsers}/>;
            });
        }

        return (
            <div className='container'>
                <div className="nav">
                    <h1>Foliechatt_</h1><button className="btn btn-default" onClick={this.logOut}>Log Out</button>
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
