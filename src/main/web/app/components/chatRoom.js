var React = require('react');

var ChatMessage = require('./chatMessage');

var SockJS = require("sockjs-client")
var Stomp = require("stompjs/lib/stomp.js").Stomp

console.log("stomp is: " + JSON.stringify(Stomp))
var stompClient =  null;
window.stompClient = stompClient;

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

        //var socket = new SockJS('http://localhost:9876/folieSocket');
        var socket = new SockJS('http://localhost:9876/foliechatt/folieSocket');
        stompClient = Stomp.over(socket);
        console.log("stomp.over..  stompClient is: ", stompClient)
        stompClient.connect({}, function (frame) {
            // setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/greetings', function (greeting) {
                // showGreeting(JSON.parse(greeting.body).content);
                console.log("Received greeting " + greeting)
            });
        });

        setTimeout( function() {
            stompClient.send("/app/hello", {}, JSON.stringify(
                {
                    content:"Hello from client!",
                    sender: { value: "1"},
                    receiver: { value: "2"}

                }))
        }, 5000
        );





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
