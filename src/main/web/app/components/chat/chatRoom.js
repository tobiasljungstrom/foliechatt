var React = require('react');
var ChatMessage = require('./chatMessage');
var SockJS = require('sockjs-client');
var Stomp = require('stompjs/lib/stomp.js').Stomp;

var stompClient = null;

var ChatRoom = React.createClass({
    propTypes: {
        users: React.PropTypes.array.isRequired,
        messages: React.PropTypes.array.isRequired,
        updateChat: React.PropTypes.func
    },

    sendMessage: function() {
        const content = document.getElementById('messageInput').value;
        stompClient.send('/app/hello', {}, JSON.stringify({
            content: content,
            sender: {
                value: 'Mr J'
            },
            receiver: {
                value: 'default receiver'
            }

        }));
    },

    componentWillMount: function() {

        const updateChat = this.props.updateChat;

        const socket = new SockJS('http://localhost:9876/foliechatt/folieSocket');
        stompClient = Stomp.over(socket);
        stompClient.debug = null;

        stompClient.connect({}, function() {
            stompClient.subscribe('/topic/greetings', function(message) {

                let messageBody = JSON.parse(message.body);
                let content = messageBody.content;
                let user = messageBody.sender.value;

                updateChat(content, user);
            });
        });
    },

    render: function() {
        var renderMessages = [];

        for (var i = 0; i < this.props.messages.length; i++) {
            renderMessages[i] = <ChatMessage userName={this.props.messages[i].user} messageText={this.props.messages[i].message} key={i}/>;
        }

        return (
            <div className="chatRoom">
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
