var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');
var CryptoTest = require('./cryptoTest');

var App = React.createClass({

    getInitialState: function() {
        return {
            users: [{userAlias: 'Bob', publicKey: "abc"}],
            messages: [
                {
                    user: 'Bob',
                    message: 'Hello'
                }
            ]
        };
    },

    updateChat: function(message, key) {
        let updatedMessages = this.state.messages;
        let users = this.state.users;

        let userAlias = "default name";
        for(let i = 0; i < users.length; i++) {
            let user = users[i];
            console.log("user in loop", user);
            if(user.publicKey === key) {
                console.log("loop true");
                userAlias = users[i].userAlias;
                break;
            }
        }
        console.log("user alias", userAlias);
        updatedMessages.push({message: message, user: userAlias});

        this.setState({
            messages: updatedMessages
        });
    },

    updateUsers: function(users) {

        this.setState({
            users: users
        });
    },

    render: function() {
        return (
            <div>
                <NewUser/>
                <LogIn/>
                <ChatRoom messages={this.state.messages} users={this.state.users} updateChat={this.updateChat} updateUsers={this.updateUsers}/>
                <CryptoTest/>
            </div>
        );
    }
});

module.exports = App;
