var stompClient = null;
var SockJS = require('sockjs-client');
var Stomp = require('stomp');

function connect() {
    var socket = SockJS('/folieSocket');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        //TODO setConnected
        stompClient.subscribe('/topic/greetings', function(greeting) {
            console.log(JSON.parse(greeting.body).content);
        })
    });
    stompClient.send('/hello', {}, JSON.stringify({user:"KalleTestare"}));
}
