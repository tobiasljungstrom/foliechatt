var stompClient = null;
var SockJS = require('sockjs');
var Stomp = require('stomp');

function connect() {
    var socket = SockJS('/something');
    stompClient = Stomp.over(socket);
    stompClient.connect({}, function (frame) {
        //TODO setConnected
        stompClient.subscribe('/topic/')
    })

}
