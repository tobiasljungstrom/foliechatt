var React = require('react');
var ChatMessage = require('./chatMessage');
var SockJS = require('sockjs-client');
var Stomp = require('stompjs/lib/stomp.js').Stomp;

var stompClient = null;

var ChatRoom = React.createClass({
    propTypes: {
        loggedInUser: React.PropTypes.object.isRequired,
        users: React.PropTypes.array.isRequired,
        messages: React.PropTypes.array.isRequired,
        updateChat: React.PropTypes.func.isRequired,
        cryptoHelper: React.PropTypes.object.isRequired,
        roomId: React.PropTypes.string.isRequired
    },

    sendMessage: function() {
        const content = document.getElementById('messageInput' + this.props.roomId).value;
        console.log("trying to send: ", content);
        const users = this.props.users;

        users.forEach( ({publicKey, userAlias}) => {
            this.props.cryptoHelper.encrypt(content, publicKey).then(this.dispatchMessage.bind(this, userAlias))
        } )
    },

    dispatchMessage: function (userAlias, encryptedMessage) {
        console.log("sending to user alias: ", userAlias);
        let roomId = this.props.roomId;
        let senderPublicKey = this.props.cryptoHelper.publicKey;

        stompClient.send(`/app/hello/${roomId}` , {}, JSON.stringify({
            content: encryptedMessage.data,
            sender: {
                value: senderPublicKey
            },
            receiver: {
                value: userAlias
            }
        }));
    },

    componentWillMount: function() {
        const publicKey = this.props.cryptoHelper.publicKey;
        const updateChat = this.props.updateChat;
        const updateUsers = this.props.updateUsers;
        const roomId = this.props.roomId;
        const loggedInUser = this.props.loggedInUser;
        const decryptWithSenderKey = this.props.cryptoHelper.decryptWithSenderKey;

        let socket = null;
        let url = window.location.href;
        if(url.includes("webpack")) {
            socket = new SockJS('http://localhost:9876/foliechatt/folieSocket');
        } else {
            socket = new SockJS('/foliechatt/folieSocket');
        }
        stompClient = Stomp.over(socket);
        // stompClient.debug = null;

        stompClient.connect({}, function() {

            stompClient.subscribe(`/topic/greetings/${roomId}/${loggedInUser.alias}`, function(message) {
                let messageBody = JSON.parse(message.body);
                let content = messageBody.content;
                let user = messageBody.sender.value;

                decryptWithSenderKey(messageBody.sender.value)(content).then( function(decryptedMessage) {
                    updateChat(decryptedMessage.data, user, roomId);
                });
            });

            stompClient.subscribe(`/topic/greetings/${roomId}/status`, function(usersInRoom){
                let users = JSON.parse(usersInRoom.body);
                updateUsers(users, roomId);
            });
        });
    },

    render: function() {
        var renderMessages = [];
        var usersInRoom= [];

        for (let i = 0; i < this.props.messages.length; i++) {
            renderMessages[i] = <ChatMessage userName={this.props.messages[i].user} messageText={this.props.messages[i].message} key={i}/>;
        }

        for (let i = 0; i < this.props.users.length; i++) {
            usersInRoom[i] = <li key={i}>{this.props.users[i].userAlias}</li>;
        }

        return (
            <div className="chatRoom">
                Users in room:
                <ul>
                    {usersInRoom}
                </ul>

                Chat:
                <ul>
                    {renderMessages}
                </ul>
                <input type="text" id={"messageInput" + this.props.roomId}/>
                <button onClick={this.sendMessage}>Send!</button>
            </div>
        );

    }
});

module.exports = ChatRoom;
