var React = require('react');
var ChatMessage = require('./chatMessage');
var SockJS = require('sockjs-client');
var Stomp = require('stompjs/lib/stomp.js').Stomp;

var stompClient = null;

var ChatRoom = React.createClass({
    propTypes: {
        baseUrl: React.PropTypes.string.isRequired,
        loggedInUser: React.PropTypes.object.isRequired,
        users: React.PropTypes.array.isRequired,
        messages: React.PropTypes.array.isRequired,
        updateChat: React.PropTypes.func.isRequired,
        cryptoHelper: React.PropTypes.object.isRequired,
        roomId: React.PropTypes.string.isRequired
    },

    sendMessage: function() {
        const inputId = 'messageInput' + this.props.roomId;
        const inputElement = document.getElementById(inputId);
        const content = inputElement.value;
        inputElement.value = '';
        inputElement.focus();

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
        const {publicKey,decryptWithSenderKey} = this.props.cryptoHelper;
        const {updateChat,updateUsers,roomId,loggedInUser} = this.props;

        let socket = new SockJS(`${this.props.baseUrl}folieSocket`);

        stompClient = Stomp.over(socket);
        stompClient.debug = null;

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

        const {messages, roomId, users} = this.props;

        for (let i = 0; i < messages.length; i++) {
            let isLast = i == messages.length -1;
            let uniqueNodeId = roomId + '' + i;
            renderMessages[i] = <ChatMessage userName={messages[i].user} messageText={messages[i].message} key={i} shouldBaffle={ isLast } nodeId={ uniqueNodeId }/>;
        }

        for (let i = 0; i < users.length; i++) {
            usersInRoom[i] = <li key={i}>{users[i].userAlias}</li>;
        }

        return (
            <div className="chatRoom">
                Users in room:
                <ul>
                    {usersInRoom}
                </ul>

                Chat:
                <ul className="chatRoomMessageSpace">
                    {renderMessages}
                </ul>
                <input type="text" id={"messageInput" + roomId}/>
                <button onClick={this.sendMessage}>Send!</button>
            </div>
        );

    }
});

module.exports = ChatRoom;
