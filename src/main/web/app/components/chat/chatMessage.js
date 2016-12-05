var React = require('react');
let baffle = require('baffle');
const CHARACTER_SET = '0123456789+*<>Zフモムヌマコオヿ'; //Enter the Matrix!
const baffleOptions = {
    characters: CHARACTER_SET,
    speed: 50
};

var ChatMessage = React.createClass({
    propTypes: {
        userName: React.PropTypes.string,
        messageText: React.PropTypes.string,
        nodeId: React.PropTypes.string
    },

    componentDidMount: function() {
        const nodeId = this.props.nodeId;
        let b = baffle(document.getElementById(nodeId), baffleOptions).start();
        setTimeout(function(){
            b.reveal(500);
        }, 500);

    },

    render: function() {
        const {nodeId, userName} = this.props;
        return (
            <li className="chatMessage">
                <span className="userName">{userName}: </span>
                <span className="messageText" id={nodeId}>{this.props.messageText}</span>
            </li>
        );
    }
});

module.exports = ChatMessage;
