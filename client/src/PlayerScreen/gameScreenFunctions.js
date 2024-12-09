
export const startRender  =  (socket, isPlayer) => {

    if (socket.id !== sessionStorage.getItem('socketId')) {

        const sessionData = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            sessionData[key] = sessionStorage.getItem(key);
        }
        socket.emit('reconnect_player', sessionData);
        sessionStorage.setItem('socketId', socket.id);
    }

    socket.emit('get_tileInfo');
    socket.emit('get_pieces');
    socket.emit('send_player_colors');
    socket.emit('update_piece_position');
    if(isPlayer) {
        socket.emit('get_player_strategy');
    }
}