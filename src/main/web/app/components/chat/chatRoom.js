var React = require('react');
var ChatMessage = require('./chatMessage');
var SockJS = require('sockjs-client');
var Stomp = require('stompjs/lib/stomp.js').Stomp;

var stompClient = null;

var ChatRoom = React.createClass({
    propTypes: {
        users: React.PropTypes.array.isRequired,
        messages: React.PropTypes.array.isRequired,
        updateChat: React.PropTypes.func.isRequired,
        cryptoHelper: React.PropTypes.object.isRequired,
        roomId: React.PropTypes.string.isRequired
    },

    sendMessage: function() {
        const content = document.getElementById('messageInput').value;
        const users = this.props.users;

        users.forEach( ({publicKey}) => {
            this.cryptoHelper.encrypt(content, publicKey).then(this.dispatchMessage.bind(this, publicKey))
        } )
    },

    dispatchMessage: function (publicKey, encryptedMessage) {
        stompClient.send(`/app/hello/${this.props.roomId}` , {}, JSON.stringify({
            content: encryptedMessage,
            sender: {
                value: this.cryptoHelper.publicKey
            },
            receiver: {
                value: publicKey
            }
        }));
    },

    componentWillMount: function() {
        const publicKey = this.props.cryptoHelper.publicKey;
        const updateChat = this.props.updateChat;
        const updateUsers = this.props.updateUsers;

        const socket = new SockJS('http://localhost:9876/foliechatt/folieSocket');
        stompClient = Stomp.over(socket);
        // stompClient.debug = null;

        stompClient.connect({}, function() {
            stompClient.subscribe(`/topic/greetings/${this.props.roomId}/${publicKey}`, function(message) {

                let messageBody = JSON.parse(message.body);
                let content = messageBody.content;
                let user = messageBody.sender.value;

                updateChat(content, user);
            });
            stompClient.subscribe(`/topic/greetings/${this.props.roomId}/status`, function(usersInRoom){
                let users = JSON.parse(usersInRoom.body);
                updateUsers(users, this.props.roomId);
            })
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
                <input type="text" id="messageInput"/>
                <button onClick={this.sendMessage}>Send!</button>
            </div>
        );

    }
});

module.exports = ChatRoom;
