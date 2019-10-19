const express = require('express')();


const http = require('http').Server(express);

const serverSocket = require('socket.io')(http);

const porta = process.env.PORT || 8000

const host = process.env.HOST || "http://localhost"

http.listen(porta, function() {

    const portaStr = porta === 80 ? '' : ':' + porta;

    if (process.env.HEROKU)
        console.log('Servidor iniciado. Abra o navegador em ' + host);
    else console.log('Servidor iniciado. Abra o navegador em ' + host + portaStr);
});

express.get('/', function(requisicao, resposta) {
    resposta.sendFile(__dirname + '/index.html');
});


serverSocket.on('connect', function(socket) {
    console.log('\nCliente conectado: ' + socket.id);


    socket.on('disconnect', function() {
        console.log('Cliente desconectado: ' + socket.id);
    });


    socket.on('chat msg', function(msg) {
        console.log('Mensagem: ' + msg);

        serverSocket.emit('chat msg', msg);
    });


    socket.on('entrou', function(msg) {
        console.log(msg);
        socket.broadcast.emit('entrou', msg);
    })
    socket.on('status', function(msg) {
        socket.broadcast.emit('status', msg);
    })
});