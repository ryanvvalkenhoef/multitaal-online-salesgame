import QuestionQueue from './questionQueue.js';
import CRUDUtils from '../utils/CRUDUtils.js';

class PlayerQuestionQueue extends QuestionQueue {
  constructor() {
    super();
    Object.assign(this, CRUDUtils);
  }

  read(socket, wantsLength) {
    const room = socket.room;
    const playerId = socket.id;

    const roomQueue = this.queues[room];
    if (!roomQueue) return wantsLength ? 0 : null;

    const playerQueue = roomQueue[playerId];
    if (!playerQueue) return wantsLength ? 0 : null;

    return wantsLength ? playerQueue.length : playerQueue[0] || null;
  }

  create(socket, receiverId, question) {
    const room = socket.room;
    if (!question) {
      console.error("Can't add undefined/null question to queue.");
      return false;
    }

    if (!this.queues[room]) {
      this.queues[room] = {};
    }

    const playerQueue = this.queues[room][receiverId] || [];
    playerQueue.push(question);
    this.queues[room][receiverId] = playerQueue;

    return true;
  }

  delete(socket) {
    const room = socket.room;
    const playerId = socket.id;

    const roomQueue = this.queues[room];
    if (!roomQueue) return;

    const playerQueue = roomQueue[playerId];
    if (!playerQueue || playerQueue.length === 0) return;

    playerQueue.shift(); // verwijder eerste vraag
  }

  update(socket, sessionData) {
    const room = socket.room;
    const oldSocketId = sessionData.socketId;
    const newSocketId = socket.id;

    const roomQueue = this.queues[room];
    if (!roomQueue) return;

    const oldQueue = roomQueue[oldSocketId];
    if (!oldQueue) return;

    roomQueue[newSocketId] = oldQueue;
    delete roomQueue[oldSocketId];
  }
}

export default PlayerQuestionQueue;
