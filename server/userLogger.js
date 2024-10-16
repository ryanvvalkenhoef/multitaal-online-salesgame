const { log } = require('console');
const { json } = require('express');
const fs = require('fs');

const readData = (room) => {
    try {
      const data = fs.readFileSync(`${room}data.json`, "utf8");
      return JSON.parse(data);
    } catch (err) {
      console.error("Error reading file:", err);
      return null;
    }
  };

const writeData = (jsonData,room) => {
    try {
      fs.writeFileSync(`${room}data.json`, JSON.stringify(jsonData, null, 2));
    } catch (err) {
      console.error("Error writing to file:", err);
    }
  };

// Delete user by ID
const deleteUser = (userId,room) => {
    let data = readData(room);
    if (!data) return;

    data.users = data.users.filter(user => user.id !== userId);

    writeData(data,room);
};

// Add a new user
const addUser = (user,room) => {
    let data = readData(room);
    if (!data) return;

    data.users.push(user);

    writeData(data,room);
};

// Update user by ID
const updateUser = (userId, newData,room) => {
    let data = readData(room);
    if (!data) return;

    const index = data.users.findIndex(user => user.id === userId);
    if (index !== -1) {
        data.users[index] = { ...data.users[index], ...newData };
        writeData(data,room);
    } else {
        console.error('User not found1.');
    }
};

function getRoom(socketid,room) {
    let data = readData(room);
    if (!data) return null;
    
    
    const user = data.users.find(user => user.id === socketid);
    if (user) {
        return user.room;
    } else {
        console.error('User not found2.');
        return null;
    }
};

// Get user by name
function getUserIDByName(name,room) {
    let data = readData(room);
    if (!data) return null;

    const user = data.users.find(user => user.name === name);
    if (user) {
        return user.id;
    } else {
        console.error('User not found!2');
        return null;
    }
}


function getPoints(id,room) {
    let data = readData(room);
    if (!data) return null;

    const user = data.users.find(user => user.id === id)
    if (user) {
        return user.points;
    } else {
        console.error('User not found3.');
        return null;
    }
}

function availability(socketid, userName, userRoom, userStrat,room) {
    let data = readData(room);
    if (!data) return 'available';

    for (let user of data.users) {
        if (user.name === userName && user.room === userRoom) {
            return 'Name already in use';
        }
        if (user.strategy === userStrat && user.room === userRoom) {
            return 'Strategy already in use';
        }
    }
    return 'available';
}

function getData(socketid,room) {
    
    let data = readData(room);
    if (!data) return null;
    const users = data.users

    if (users) {
        return users
    } else {
        console.error('User not found4.');
        return null;
    }
}

function getStrategy(socketid,room) {
    let data = readData(room);
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);

    if (user) {
        var strategy = user.strategy.toLowerCase()
        switch (strategy) {
            case 'top of the world':
                strategy = 'world'
                break
            case 'jysk telepartner':
                strategy = 'jysk'
                
                break
            case 'domino house':
                strategy = 'domino'
                break
            default:
                strategy = strategy
                break
        }
        return strategy
    } else {
        console.error('User not found5.');
        return null;
    }
}

function getColor(socketid,room) {
    let data = readData(room);
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);

    if (user) {
        const strategy = user.strategy.toLowerCase()
        var color = ''
        switch (strategy) {
            case 'top of the world':
                color = 'green'
                break
            case 'jysk telepartner':
                color = 'orange'
                break
            case 'domino house':
                color = 'blue'
                break
            case 'lunar':
                color = 'yellow'
                break
            case 'klaphatten':
                color = 'purple'
                break
            case 'safeline':
                color = 'red'
                break
        }
        return color
    } else {
        console.error('User not found5.');
        return null;
    }
}




function getReceiver(room, questionColor,room) {
    let data = readData(room);
    if (!data) return null;
    const users = data.users.filter(user => user.room === room);

    for (let user of users) {
        var strategy = user.strategy.toLowerCase()
        var color = ''
        switch (strategy) {
            case 'top of the world':
                color = 'green'
                break
            case 'jysk telepartner':
                color = 'orange'
                break
            case 'domino house':
                color = 'blue'
                break
            case 'lunar':
                color = 'yellow'
                break
            case 'klaphatten':
                color = 'purple'
                break
            case 'safeline':
                color = 'red'
                break
        }
            
            
        if (questionColor === color) {
           
            
            return user.id
        }
    }
}
function getPlayerName(socketid,room) {
    let data = readData(room);
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);
    
    if (user) {
        
        return user.name
    } else {
        console.error('User not found6.');
        return null;
    }
}
function getLanguage(socketid,room) {
    let data = readData(room);
    if (!data) return null;
    const user = data.users.find(user => user.id === socketid);
    if (user) {
        return user.language
    } else {
        console.error('User not found7.');
        return null;
    }
}

function resetHasFinishedTurn(room){
    let data = readData(room);
    if (!data) return null;
    const players = data.users;
    if(players){
        players.forEach(player => {
            player.hasFinishedTurn = false;
        });
    }
    else {
        console.error('User not found7.');
        return null;
    }
    writeData(data,room);
}

function getAllPlayers(room){
    let data = readData(room);
    if (!data){
        console.log("Can't read data: getAllPlayers()");
        return null;
    }

    return data.users
}

function userLogger(method, socketid, info="",room){
    switch(method){
        case 'log':
            addUser({id: socketid, language: 'en', room: '', name: '', points: 0, strategy:'', hasFinishedTurn: false, playerPosition: '' },room)
            break
        case 'delete':
            deleteUser(socketid,room)
            break
        case 'updateName':
            updateUser(socketid, {name: info},room)
            break
        case 'updatePoints':
            updateUser(socketid, {points: info},room)
            break
        case 'updateRoom':
            updateUser(socketid, {room: info},room)
            break
        case 'updateStrategy':
            updateUser(socketid, {strategy: info},room)
            break
        case 'updateLanguage':
            updateUser(socketid, {language: info},room)
        case 'addColorToPlayer':
            updateUser(socketid, {color: info},room)    
        case 'getRoom':
            return getRoom(socketid,room)
        case 'getPoints':
            return getPoints(info,room)
        case 'getStrategy':
            return getStrategy(socketid,room)
        case 'getUserIDByName':
            return getUserIDByName(info,room);
        case 'checkAvailability':
            return availability(socketid, info.name, info.room, info.strategy,room)
        case 'getData':
            return getData(socketid,room)
        case 'getColor':
            return getColor(socketid,room)
        case 'getReceiver':
            return getReceiver(info.room, info.color,room)
        case 'getPlayerName':
            return getPlayerName(socketid,room)
        case 'getLanguage':
            return getLanguage(socketid,room)
        case 'updateHasFinishedTurn':
            updateUser(socketid, {hasFinishedTurn: info},room);
            break;
        case 'resetHasFinishedTurn':
            resetHasFinishedTurn(room);
            break;     
        case 'updatePlayerPosition':
            updateUser(socketid, {playerPosition: info},room);
            break;    
        case 'getAllPlayers':{
            return getAllPlayers(room)
        }    
    }   
}

module.exports=userLogger;