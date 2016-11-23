var React = require('react');

var ChatMessage = require('./chatMessage');

var SockJS = require("sockjs-client")
var Stomp = require("stompjs/lib/stomp.js").Stomp

console.log("stomp is: " + JSON.stringify(Stomp))
var stompClient =  null;
var socket = null;
window.stompClient = stompClient;
var ChatRoom = React.createClass({
    propTypes : {
      users : React.PropTypes.arrayOf(React.PropTypes.string),
      messages : React.PropTypes.arrayOf(
        React.PropTypes.shape({
          user: React.PropTypes.string,
          message: React.PropTypes.string
        }))
    },

    getValueFromInputWithId: function(id) {
        return document.getElementById(id).value;
    },

    sendToRoom: function() {
        var roomID = this.getValueFromInputWithId("room");
        var sender = this.getValueFromInputWithId("sender");
        var receiver = this.getValueFromInputWithId("receiver");
        var message = this.getValueFromInputWithId("message");
        this.subscribeTo(roomID + "/" + sender);
        this.subscribeTo(roomID + "/status");

        setTimeout(
            function() {
                stompClient.send("/app/hello/" +roomID, {}, JSON.stringify(
                    { // Message
                        content: message,
                        sender: { value: sender},
                        receiver: { value: receiver}

                    }));
            }, 1600
        );
    },

    subscribeTo: function(roomOrRoomSlashStatus) {
        stompClient.connect({}, function (frame) {
            // setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/greetings/' + roomOrRoomSlashStatus , function (greeting) {
                // showGreeting(JSON.parse(greeting.body).content);
                console.log("Received greeting " + greeting)
            });
        });
    },

    render: function() {

        //var socket = new SockJS('http://localhost:9876/folieSocket');
        socket = new SockJS('http://localhost:9876/foliechatt/folieSocket');
        stompClient = Stomp.over(socket);
/*        console.log("stomp.over..  stompClient is: ", stompClient)
        stompClient.connect({}, function (frame) {
            // setConnected(true);
            console.log('Connected: ' + frame);
            stompClient.subscribe('/topic/greetings/500', function (greeting) {
                // showGreeting(JSON.parse(greeting.body).content);
                console.log("Received greeting " + greeting)
            });
        });*/


        return (
            <div className="chatRoom">
                <ul>
                    <ChatMessage userName={this.props.messages[0].user} messageText={this.props.messages[0].message}/>
                </ul>

                <p>Sender</p>
                <input name="sender" id="sender" type="text"/>
                <p>Receiver</p>
                <input name="receiver" id="receiver" type="text"/>
                <p>Message</p>
                <input name="message" id="message" type="text"/>
                <p>Room</p>
                <input id="room" type="text"/>
                <button onClick={this.sendToRoom}>Send</button>


            </div>
        );

    }
});

module.exports = ChatRoom;
