var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');

var App = React.createClass({

    getInitialState: function() {
        return {
            users: [{userAlias: 'John', publicKey: "abc"}],
            messages: [
                {
                    user: 'John',
                    message: 'Hello'
                }
            ]
        };
    },

    updateChat: function(message, user) {
        console.log('Updating chat...');
        let updatedMessages = this.state.messages;
        updatedMessages.push({message: message, user: user});

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
            </div>
        );
    }
});

module.exports = App;
