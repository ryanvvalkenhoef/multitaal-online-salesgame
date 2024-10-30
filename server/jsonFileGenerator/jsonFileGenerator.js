const createJsonFile = (room) => {
    fs.writeFileSync(
        `gameSaves/${room}data.json`,
        '{\n  "users": [],\n  "mod": {},\n "questionQueue": []\n }'
    );
}

export default createJsonFile;