var React = require('react');

var NewUser = require('./newUser');
var ChatRoom = require('./chatRoom');

var App = React.createClass({
  users: ["Pelle", "Kalle"],
  messages: [{user: "Pelle", message: "YOYO där"}],
    render: function() {
        return (
            <div>
                <NewUser />
                <ChatRoom messages={this.messages} users={this.users} />
            </div>
        );
    }
});

module.exports = App;
