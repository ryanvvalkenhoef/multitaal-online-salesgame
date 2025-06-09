import QuestionQueue from './questionQueue.js';
import CRUDUtils from '../utils/CRUDUtils.js';

class ModQuestionQueue extends QuestionQueue {
  constructor() {
    super();
    Object.assign(this, CRUDUtils);
  }

  /** Check if room and color queues exist, and create them if not */
  ensureQueueExists(room, color) {
    if (!this.queues[room]) {
      this.queues[room] = {};
    }
    if (!this.queues[room][color]) {
      this.queues[room][color] = [];
    }
  }

  /** Add question to moderator queue */
  create(socket, question) {
    const room = socket.room;
    const color = question.playerColor;

    this.ensureQueueExists(room, color);
    this.queues[room][color].push(question);

    return true;
  }

  /** Get queue length or next question for color */
  read(socket, wantsLength) {
    const room = socket.room;
    const color = socket.color;

    const colorQueue = this.queues[room]?.[color];
    if (!colorQueue) return wantsLength ? 0 : null;

    if (wantsLength) {
      return colorQueue.length;
    } else {
      return colorQueue.length > 0 ? colorQueue[0] : null;
    }
  }

  /** Delete the first question in the moderator queue */
  delete(socket) {
    const room = socket.room;
    const color = socket.color;

    const colorQueue = this.queues[room]?.[color];
    if (!colorQueue || colorQueue.length === 0) return;

    colorQueue.shift(); // Remove first question
  }

  /** Optional debug tool */
  logQueues() {
    console.log(JSON.stringify(this.queues, null, 2));
  }
}

export default ModQuestionQueue;