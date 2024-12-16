
export const startRender  =  (socket, currentSocketId,isPlayer) => { //Function starts the rendering of player or mod screen
    // If the socket id is not the same as the one being stored in sessionStorage,
    // it means that the client has reconnected, so the server has to send the client the data it needs,
    // before it can start rendering the screen.
    // The socket id is being passed as a parameter because of delay, the socket.id property is still null
    // at the time this function is executed.
    if (currentSocketId !== sessionStorage.getItem('socketId')) {

        //The server doesn't have a sessionStorage object, so the data needs to be put in a new javascript object
        const sessionData = {};
        for (let i = 0; i < sessionStorage.length; i++) {
            const key = sessionStorage.key(i);
            sessionData[key] = sessionStorage.getItem(key);
        }

        if(isPlayer) {
            socket.emit('reconnect_player', sessionData);
        }
        else{
            socket.emit('reconnect_mod', sessionData);
        }
        sessionStorage.setItem('socketId', socket.id); // Dit moet eigenlijk pas gedaan worden wanneer het reconnecten aan de server kant succesvol is afgerond
    }
    else {
            socket.emit('get_tileInfo');
            socket.emit('get_pieces');
            socket.emit('send_player_colors');
            socket.emit('update_piece_positions');

            if(isPlayer) {
                socket.emit('get_player_strategy');
            }
        }

}