var React = require('react');

var ChatMessage = require('./chatMessage');

var ChatRoom = React.createClass({
    propTypes : {
      users : React.PropTypes.arrayOf(React.PropTypes.string),
      messages : React.PropTypes.arrayOf(
        React.PropTypes.shape({
          user: React.PropTypes.string,
          message: React.PropTypes.string
        }))
    },

    render: function() {
        return (
            <div className="chatRoom">
                <ul>
                    <ChatMessage userName={this.props.messages[0].user} messageText={this.props.messages[0].message}/>
                </ul>
            </div>
        );

    }
});

module.exports = ChatRoom;
