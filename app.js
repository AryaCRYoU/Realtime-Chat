const app = require('express')();
const server = require('http').createServer(app);
const io = require('socket.io')(server, {});

const messages = []; // Array untuk menyimpan pesan

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

let countUserOnline = 0; // Ubah menjadi 0
io.on('connection', (socket) => {
    socket.on('join', param => {
        console.log('user join');
        countUserOnline++;
        io.emit('countUserOnline', countUserOnline);
        socket.emit('previousMessages', messages); // Kirim pesan sebelumnya ke klien yang bergabung
    });
    
    socket.on('message', param => {
        console.log('user mengirim pesan');
        messages.push(param); // Simpan pesan ke dalam array
        io.emit('message', param);
    });
    
    socket.on('disconnect', param => {
        console.log('user keluar');
        countUserOnline--;
        io.emit('countUserOnline', countUserOnline);
    });
});

server.listen(3000);
