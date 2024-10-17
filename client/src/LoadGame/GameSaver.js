export const saveGameProgress = async (gameSave) => {
    try {
        const response = await fetch('http://localhost:3000/save-game', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(gameSave)
        });

        const result = await response.json();
        console.log('Game data saved successfully:', result);
    } catch (error) {
        console.error('Error saving game data:', error);
    }
};

export const loadGame = async (roomCode) => {
    try {
        const response = await fetch(`http://localhost:3000/load-game/${roomCode}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        const gameData = await response.json();
        console.log('Game data loaded successfully:', gameData);
        return gameData;
    } catch (error) {
        console.error('Error loading game data:', error);
        return null;
    }
};