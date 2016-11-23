var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');
var ChatRoom = require('./chat/chatRoom');

var App = React.createClass({
    propTypes: {
        users: React.PropTypes.arrayOf(React.PropTypes.string),
        messages: React.PropTypes.arrayOf(React.PropTypes.shape({user: React.PropTypes.string, message: React.PropTypes.string}))
    },

    getDefaultProps: function() {
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

    render: function() {
        return (
            <div>
                <NewUser/>
                <LogIn/>
                <ChatRoom messages={this.props.messages} users={this.props.users}/>
            </div>
        );
    }
});

module.exports = App;
