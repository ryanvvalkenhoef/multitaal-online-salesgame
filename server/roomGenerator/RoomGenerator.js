class RoomGenerator {

   static #rooms = [];

    static createRoom  ()  {
        const characters = "01234A5S678T9M";
        const length = 5;
        let room = "";
        for (let i = 0; i < length; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            room += characters[randomIndex];
        }
        this.#rooms.push(room);
        return room;
    }

    static getRoomList () {
        return this.#rooms;
    }


}

module.exports =  RoomGenerator;
