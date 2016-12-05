var React = require('react');
var ChatMessage = require('./chatMessage');
var SockJS = require('sockjs-client');
var Stomp = require('stompjs/lib/stomp.js').Stomp;

var stompClient = null;

var ChatRoom = React.createClass({
    propTypes: {
        sessionToken: React.PropTypes.string,
        baseUrl: React.PropTypes.string.isRequired,
        loggedInUser: React.PropTypes.object.isRequired,
        users: React.PropTypes.array.isRequired,
        messages: React.PropTypes.array.isRequired,
        updateChat: React.PropTypes.func.isRequired,
        cryptoHelper: React.PropTypes.object.isRequired,
        leaveChatRoom: React.PropTypes.func.isRequired,
        roomId: React.PropTypes.string.isRequired
    },

    sendMessage: function() {
        const {roomId, users, cryptoHelper} = this.props;
        const content = document.getElementById('messageInput' + roomId).value;

        users.forEach(({publicKey, userAlias}) => {
            cryptoHelper.encrypt(content, publicKey)
                .then( encryptedMessage => {
                    this.dispatchMessage(userAlias, encryptedMessage);
                });
        });
        document.getElementById('messageInput' + roomId).value = '';
    },

    dispatchMessage: function(userAlias, encryptedMessage) {
        console.log("sending to user alias: ", userAlias);
        let roomId = this.props.roomId;
        let senderPublicKey = this.props.cryptoHelper.publicKey;

        stompClient.send(`/app/hello/${roomId}`, {}, JSON.stringify({
            content: encryptedMessage.data,
            sender: {
                value: senderPublicKey
            },
            receiver: {
                value: userAlias
            }
        }));
    },

    leaveRoom: function() {
        console.log("In leavechatroom");
        console.log(this.props.sessionToken);
        const leaveChatRoom = this.props.leaveChatRoom;

        const request = new XMLHttpRequest();
        request.onreadystatechange = function() {
            //Callback triggers on success
            if (this.readyState == 4 && this.status == 200) {
                leaveChatRoom(this.props.roomId);
                console.log('Left chatroom with id '+roomId);
            } else if(this.readyState == 4 && this.status == 401) {
                console.log('UNATHORIZED');
            }

        };
        console.log("HELLO!");
        request.open('POST', `${this.props.baseUrl}api/v.1/chatroom/${this.props.roomId}/leave`, true);
        request.setRequestHeader('Content-Type', 'text/plain');
        request.setRequestHeader('sessionToken', this.props.sessionToken);
        request.send();

    },

    componentWillMount: function() {
        const {updateChat, updateUsers, roomId, loggedInUser, baseUrl} = this.props;

        const decryptWithSenderKey = this.props.cryptoHelper.decryptWithSenderKey;

        let socket = new SockJS(`${baseUrl}folieSocket`);

        stompClient = Stomp.over(socket);
        // stompClient.debug = null;

        stompClient.connect({}, function() {

            stompClient.subscribe(`/topic/greetings/${roomId}/${loggedInUser.alias}`, function(message) {
                let messageBody = JSON.parse(message.body);
                let content = messageBody.content;
                let user = messageBody.sender.value;

                decryptWithSenderKey(content, messageBody.sender.value)
                    .then( decryptedMessage =>  {
                        updateChat(decryptedMessage.data, user, roomId);
                    });
            });

            stompClient.subscribe(`/topic/greetings/${roomId}/status`, function(usersInRoom) {
                let users = JSON.parse(usersInRoom.body);
                updateUsers(users, roomId);
            });
        });
    },

    componentDidMount: function() {
        const sendMessage = this.sendMessage;
        document.getElementById('messageInput' + this.props.roomId).addEventListener("keyup", function(event) {
            event.preventDefault();
            if (event.keyCode == 13) {
                sendMessage();
            }
        });
    },

    render: function() {
        const {messages, users, roomId} = this.props;
        var renderMessages = [];
        var usersInRoom = [];

        for (let i = 0; i < messages.length; i++) {
            let isLastMessage = i == messages.length -1;
            let uniqueNodeId = 'msgId' + Math.random();
            renderMessages[i] = <ChatMessage userName={messages[i].user} messageText={messages[i].message} key={i} shouldBaffle={isLastMessage} nodeId={uniqueNodeId}/>;
        }

        for (let i = 0; i < users.length; i++) {
            usersInRoom[i] = <li key={i}>{users[i].userAlias}</li>;
        }

        return (
            <div className="chatRoom">
                <div className="row">
                    <div className="col-md-9">
                        <div className="chatBox">
                            <h3>Room ID: {roomId}</h3> <button className='btn btn-default' onClick={this.leaveRoom}>Leave</button>
                            <ul className="list">
                                <ChatMessage userName="foliechat" messageText="Encryption keys generated, chat ready."/> {renderMessages}
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="userList">
                            <h3>Users in room</h3>
                            <ul className="list">
                                {usersInRoom}
                            </ul>
                        </div>
                    </div>
                </div>
                <input type="text" id={"messageInput" + roomId} placeholder="Type message"/>
                <div className="btn btn-default sendButton" onClick={this.sendMessage}>Send</div>
            </div>
        );

    }
});

module.exports = ChatRoom;
