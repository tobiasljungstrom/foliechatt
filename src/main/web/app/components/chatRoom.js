var React = require('react');

var ChatMessage = require('./chatMessage');

var ChatRoom = React.createClass({
    propTypes: {
        users: React.PropTypes.arrayOf(React.PropTypes.string),
        messages: React.PropTypes.arrayOf(React.PropTypes.shape({user: React.PropTypes.string, message: React.PropTypes.string}))
    },

    sendMessage: function() {
        const chatForm = document.getElementById('chatForm');
        const message = chatForm.elements('messageInput').value;
        //TODO create message for each receiver, enrypt with receivers public key
        var messageToSend = {
            user: {userName: 'KalleTestare'},
            messageText: message
        }
    },

    render: function() {
        var messages = [];
        for(let i=0; i<this.props.messages.length; i++){
            let currentMessage = this.props.messages[i];
            messages[i] = <ChatMessage userName={currentMessage.user} messageText={currentMessage.message} />;
        }
        return (
            <div className="chatRoom">
                <ul>
                    {messages}
                </ul>
                <form id="chatForm">
                    <input type="text" name="messageInput"/>
                <input onClick={} type="button" value="Send"/>
                </form>
            </div>
        );

    }
});

module.exports = ChatRoom;
