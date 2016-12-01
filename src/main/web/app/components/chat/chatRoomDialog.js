var React = require('react');
var CryptoHelper = require('../cryptoHelper.js');


var ChatRoomDialog = React.createClass({
    propTypes :{
        sessionToken : React.PropTypes.string,
        createChatRoom: React.PropTypes.func
    },

    createChatRoom: function() {
        var CH = new CryptoHelper();
        CH.publicKeyPromise().then(this.createRoomRequest.bind(this, CH));
    },

    joinChatRoom: function() {
        var CH = new CryptoHelper();
        CH.publicKeyPromise().then(this.joinChatRoomRequest.bind(this, CH));
    },

    createRoomRequest: function(CH, publicKey) {
        const request = new XMLHttpRequest();
        const createChatRoom = this.props.createChatRoom;
        request.onreadystatechange = function() {
            //Callback triggers on success
            if (this.readyState == 4 && this.status == 200) {
                var chatRoom = JSON.parse(request.responseText);
                createChatRoom(CH, chatRoom.id, chatRoom.users);
                console.log('Created chatroom', chatRoom);
            } else if(this.readyState == 4 && this.status == 401) {
                console.log('Access denied');
            }
        };

        request.open('POST', 'http://localhost:9876/foliechatt/api/v.1/chatroom', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('sessionToken', this.props.sessionToken);
        request.send(publicKey);
    },

    joinChatRoomRequest: function(CH, publicKey) {
        const request = new XMLHttpRequest();
        const createChatRoom = this.props.createChatRoom;
        const roomId = document.getElementById('roomIdInput').value;
        request.onreadystatechange = function () {
            if(this.readyState == 4 && this.status == 200) {
                var chatRoom = JSON.parse(request.responseText);
                console.log('Created chatroom', chatRoom);
                createChatRoom(CH, chatRoom.id, chatRoom.users);

            } else if(this.readyState == 4 && this.status != 200){
                console.log("Couldn't join room");
            }
        };

        request.open('POST', `http://localhost:9876/foliechatt/api/v.1/chatroom/${roomId}`);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('sessionToken', this.props.sessionToken);
        request.send(publicKey);
    },

    render : function() {
        return (
            <div className='chatRoomDialog'>
                <div>
                    <button onClick={this.createChatRoom}>Create new chatroom</button>
                </div>
                <div>
                    <input type="text" name="chatRoomId" id="roomIdInput"/>
                    <button onClick={this.joinChatRoom}>Join Room</button>
                </div>
            </div>

        );
    }
});

module.exports = ChatRoomDialog;
