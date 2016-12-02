/**
 * Created by marco on 2016-11-22.
 */
var React = require('react');

var ChatMessage = React.createClass({
    propTypes: {
        userName: React.PropTypes.string,
        messageText: React.PropTypes.string
    },

    render: function() {
        return (
            <li className="chatMessage">
                <span className="userName">{this.props.userName}: </span>
                <span className="messageText">{this.props.messageText}</span>
            </li>
        );
    }
});

module.exports = ChatMessage;
