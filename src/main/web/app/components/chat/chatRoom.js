var React = require('react');
var ChatMessage = require('./chatMessage');
var SockJS = require('sockjs-client');
var Stomp = require('stompjs/lib/stomp.js').Stomp;

var stompClient = null;

var ChatRoom = React.createClass({
    propTypes: {
        users: React.PropTypes.array.isRequired,
        messages: React.PropTypes.array.isRequired,
        updateChat: React.PropTypes.func,
        newUser: React.PropTypes.func
    },

    sendMessage: function() {
        const content = document.getElementById('messageInput').value;
        const users = this.props.users;
        for(let i=0; i<users.length; i++){
            stompClient.send('/app/hello/500', {}, JSON.stringify({
                content: content,
                sender: {
                    value: 'abc'
                },
                receiver: {
                    value: users[i].publicKey
                }
            }));
        }
    },

    handleNewUser: function() {
        let user = 'Bubba';
        this.props.newUser(user);
    },

    componentWillMount: function() {

        const updateChat = this.props.updateChat;
        const updateUsers = this.props.updateUsers;

        const socket = new SockJS('http://localhost:9876/foliechatt/folieSocket');
        stompClient = Stomp.over(socket);
        // stompClient.debug = null;

        stompClient.connect({}, function() {
            stompClient.subscribe('/topic/greetings/500/abc', function(message) {

                let messageBody = JSON.parse(message.body);
                let content = messageBody.content;
                let user = messageBody.sender.value;

                updateChat(content, user);
            });
            stompClient.subscribe('/topic/greetings/500/status', function(usersInRoom){
                let users = JSON.parse(usersInRoom.body);
                updateUsers(users);
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
                <button onClick={this.handleNewUser}>New User</button>
            </div>
        );

    }
});

module.exports = ChatRoom;
