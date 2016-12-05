var React = require('react');

var Greeting = React.createClass({
    propTypes: {
        userName: React.PropTypes.string,
    },

    render: function() {
        return (
            <div className="greeting">
                <h2>Logged in as: {this.props.userName}</h2>
            </div>
        );
    }
});

module.exports = Greeting;
