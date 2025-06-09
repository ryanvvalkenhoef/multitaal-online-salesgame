/**
 * Class representing a moderator's state in the game.
 *
 * The `ModLogger` class is used to manage the moderator's state, including their properties, and interact
 * with the corresponding data stored in the JSON file. It provides methods for creating, updating, and deleting
 * the moderator's information, as well as checking their current status, such as the number of questions they
 * have reviewed or whether they are currently reviewing a question.
 *
 * Key Methods:
 * - `createMod`: Creates a new moderator entry in the JSON file (if one doesn't already exist).
 * - `getMod`: Retrieves the current moderator object stored in the JSON file.
 * - `deleteMod`: Removes a moderator from the game by their ID.
 * - `updateMod`: Updates the moderator's properties with new data.
 * - `resetNumberOfQuestionsReviewed`: Resets the number of questions the moderator has reviewed to zero.
 * - `updateNumberOfQuestionsReviewed`: Increments the number of questions reviewed by the moderator by one.
 * - `setIsReviewingQuestion`: Sets the status of whether the moderator is currently reviewing a question.
 * - `checkIfReviewingQuestion`: Checks if the moderator is currently reviewing a question.
 *
 * @class ModLogger
 */
import CRUDUtils from '../utils/CRUDUtils.js';

class ModLogger extends CRUDUtils {
  #room;
  #jsonFileHandler;

  constructor(room, jsonFileHandler) {
    super();

    this.#room = room;
    this.#jsonFileHandler = jsonFileHandler;
  }

  read(wantsRoom) {
    if (wantsRoom) { /* getRoom */
      return this.#room;
    } else { /* getMod */
      const data = this.getData('getMod');
      return data.mod;
    }
  }

  del(modsId) { /* deleteMod */
    const data = this.getData('del');
    data.mod = data.mod.filter((mods) => mods.id !== modsId);
    this.#jsonFileHandler.writeData(data);
  }

  create(socketid) { /* createMod */
    const data = this.getData('createMod');

    const gameHasMod = Object.keys(data.mod).length > 0; //Checks if mod object in json file is empty;
    if (gameHasMod) {
      console.log("Game already has a moderator assigned");
      return null;
    }

    data.mod = {
      // creates mod object for json file.
      id: socketid,
      language: "NL",
      room: this.#room,
      numberOfQuestionsReviewed: 0,
      isReviewingQuestion: false,
    };
    this.#jsonFileHandler.writeData(data);
  }

  update(modsId, newData) { /* updateMod */
    const data = this.getData('updateMod');

    const mod = data.mod;
    if (mod && mod.id === modsId) {
      data.mod = { ...mod, ...newData };
      this.#jsonFileHandler.writeData(data);
    } else {
      console.error("Mod not found.");
    }
  }

  getData(funcName) {
    let data = this.#jsonFileHandler.readData();
    if (!data) {
      console.warn("Can't read data: " + funcName);
      return null;
    }
    return data;
  }

  reconnect(newSocketId, oldSocketId) {
    const data = this.getData('reconnect');
    const mod = data.mod;
    if (mod && mod.id === oldSocketId) {
      mod.id = newSocketId;
      this.#jsonFileHandler.writeData(data);
      console.log("Mod id has been updated");
    } else {
      console.warn("Can't replace old mod id with new one");
    }
  }

  resetNumberOfQuestionsReviewed() {
    const data = this.#jsonFileHandler.readData();
    if (data && data.mod) {
      data.mod.numberOfQuestionsReviewed = 0;
      this.#jsonFileHandler.writeData(data);
    }
  }

  updateNumberOfQuestionsReviewed() {
    const data = this.#jsonFileHandler.readData();
    if (data && data.mod) {
      data.mod.numberOfQuestionsReviewed += 1;
      this.#jsonFileHandler.writeData(data);
    }
  }

  setIsReviewingQuestion(boolean) {
    const data = this.#jsonFileHandler.readData();
    if (data && data.mod) {
      data.mod.isReviewingQuestion = boolean;
      this.#jsonFileHandler.writeData(data);
    }
  }

  checkIfReviewingQuestion() {
    const data = this.#jsonFileHandler.readData();
    return data && data.mod ? data.mod.isReviewingQuestion : null;
  }
}

export default ModLogger;
