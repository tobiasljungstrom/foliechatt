var React = require('react');
var CryptoHelper = require('../cryptoHelper.js');


var ChatRoomDialog = React.createClass({
    propTypes :{
        sessionToken : React.PropTypes.string,
        createChatRoom: React.PropTypes.func
    },

    generateRoom: function() {
        var CH = new CryptoHelper();
        CH.publicKeyPromise().then(this.sendRoomRequest.bind(this, CH));
    },

    sendRoomRequest: function(CH, publicKey) {
        const request = new XMLHttpRequest();
        const createChatRoom = this.props.createChatRoom;
        request.onreadystatechange = function() {
            //Callback triggers on success
            if (this.readyState == 4 && this.status == 200) {
                var createdChatRoom = JSON.parse(request.responseText);
                createChatRoom(CH, createdChatRoom.id, createdChatRoom.users);
                console.log("Created chatroom", createdChatRoom);
            } else if(this.readyState == 4 && this.status == 401) {
                console.log("Access denied");
            }
        }

        request.open('POST', 'http://localhost:9876/foliechatt/api/v.1/chatroom', true);
        request.setRequestHeader('Content-Type', 'application/json');
        request.setRequestHeader('sessionToken', this.props.sessionToken);
        request.send(publicKey);
    },

    render : function() {
        return (
            <div>
                <button onClick={this.generateRoom} value="Make Room"/>
            </div>
        )
    }
});

module.exports = ChatRoomDialog;
