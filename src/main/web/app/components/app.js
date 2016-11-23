var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');

var App = React.createClass({

    getInitialState: function() {
        return {
            users: ['John'],
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
            massages: updatedMessages
        });
    },

    render: function() {
        return (
            <div>
                <NewUser/>
                <LogIn/>
                <ChatRoom messages={this.state.messages} users={this.state.users} updateChat={this.updateChat}/>
            </div>
        );
    }
});

module.exports = App;
