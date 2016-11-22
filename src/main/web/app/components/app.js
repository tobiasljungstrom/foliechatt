var React = require('react');

var NewUser = require('./newUser');
var LogIn = require('./logIn');

var App = React.createClass({
    render: function() {
        return (
            <div>
                <NewUser />
                <LogIn />
            </div>
        );
    }
});

module.exports = App;
