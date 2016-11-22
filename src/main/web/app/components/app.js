var React = require('react');

var NewUser = require('./newUser');
var ChatRoom = require('./chatRoom');
var LogIn = require('./logIn');

var App = React.createClass({
  users: ["Pelle", "Kalle"],
  messages: [{user: "Pelle", message: "YOYO där"}, {user: "Kalle", message: "Görbra där"}],
    render: function() {
        return (
            <div>
                <NewUser />
                <LogIn />
                <ChatRoom messages={this.messages} users={this.users} />
            </div>
        );
    }
});

module.exports = App;
