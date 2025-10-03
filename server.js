const io = require('socket.io')(server);
io.on('connection', (socket) => {
  // Emit on feed update
  socket.emit('feedUpdated', { channel: 'ONE', status: 'ok' });
});
