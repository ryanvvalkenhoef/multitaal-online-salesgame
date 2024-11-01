const fs = require("fs");

const readData = (room) => {
    try {
        const data = fs.readFileSync(`gameSaves/${room}data.json`, "utf8");
        return JSON.parse(data);
    } catch (err) {
        console.error("Error reading file:", err);
        return null;
    }
}

const writeData = (jsonData,room) =>{
    try {
        fs.writeFileSync(
            `gameSaves/${room}data.json`,
            JSON.stringify(jsonData, null, 2)
        );
    } catch (err) {
        console.error("Error writing to file:", err);
    }
}

module.exports = {
    readData,
    writeData
}
