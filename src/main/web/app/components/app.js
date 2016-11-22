var React = require('react');

var NewUser = require('./newuser');

var App = React.createClass({
    render: function() {
        return (
            <div>
                <NewUser />
            </div>
        );
    }
});

module.exports = App;
