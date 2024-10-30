const createRoom = () => {
    const characters = "01234A5S678T9M";
    const length = 5;
    let pin = "";
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        pin += characters[randomIndex];
    }
    return pin;
}

export default createRoom
