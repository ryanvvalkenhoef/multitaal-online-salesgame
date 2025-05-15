const mysql = require("mysql");

// MySQL Connection
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "thebestseller",
});
// VOOR DEPLOYMENT
// {host: "localhost",
// user: "deb148678_thebestseller",
// password: "password",
// database: "deb148678_thebestseller"});
connection.connect();

const questionIDs = {
  yellow: [1, 2, 3, 4, 5],
  green: [6, 7, 8, 9, 10],
  purple: [11, 12, 13, 14, 15],
  orange: [16, 17, 18, 19, 20],
  red: [21, 22, 23, 24, 25],
  blue: [26, 27, 28, 29, 30],
  sales: [31, 32, 33],
  megatrends: [34, 35, 36],
  chance: [37, 38, 39],
  rainbow: [1],
};

async function getTranslatedQuestion(questionId, language) {
  let queryMod;
  switch (language) {
    case "en":
      queryMod = "SELECT ID, QEnglish AS question, AEnglish AS answer FROM questionstable WHERE ID=?";
      break;
    case "dk":
      queryMod = "SELECT ID, QDanish AS question, ADanish AS answer FROM questionstable WHERE ID=?";
      break;
    case "nl":
      queryMod = "SELECT ID, QDutch AS question, ADutch AS answer FROM questionstable WHERE ID=?";
      break;
    default:
      queryMod = "SELECT ID, QEnglish AS question, AEnglish AS answer FROM questionstable WHERE ID=?";
      break;
  }
  return new Promise((resolve, reject) => {
    connection.query(queryMod, [questionId], (error, results) => {
      if (error) {
        console.error("Database error: ", error);
        reject(error);
        return;
      }
      if (!results || results.length === 0) {
        reject(new Error("No results found"));
        return;
      }
      resolve({
        question: results[0].question,
        answer: results[0].answer,
        questionId: results[0].ID
      });
    });
  });
}

async function modulePopUp(color, sort = "en") {
  let number;
  switch (color) {
    case "yellow":
    case "green":
    case "purple":
    case "orange":
    case "red":
    case "blue":
    case "sales":
    case "megatrends":
    case "chance":
    case "rainbow":
      if (questionIDs.hasOwnProperty(color)) {
        const ids = questionIDs[color];
        const randomIndex = Math.floor(Math.random() * ids.length);
        number = ids[randomIndex];
      } else {
        number = 1;
      }
      break;
    default:
      number = 1;
      break;
  }
  try {

    const result = await getTranslatedQuestion(number, sort);
    return {
      ...result,
      questionId: number
    };
  } catch (error) {
    console.error("Error in modulePopUp: ", error);
    return error;
  }
}

module.exports = {
  modulePopUp,
  getTranslatedQuestion
};
