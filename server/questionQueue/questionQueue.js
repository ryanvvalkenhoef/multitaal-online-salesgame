class QuestionQueue {
  constructor() {
    this.queues = {};
    if (new.target === QuestionQueue) {
      throw new TypeError("Cannot construct Abstract instances directly");
    }
  }

  #throwError(functionName) {
    throw new Error(
      `Abstract method ${functionName} must be implemented by subclasses`,
    );
  }

  getQuestionQueueLength(socket) {
    this.#throwError("getQuestionQueueLength");
  }

  addQuestionToQueue(socket, question) {
    this.#throwError("addQuestionToQueue");
  }

  getQuestionFromQueue(socket) {
    this.#throwError("getQuestionFromQueue");
  }
  removeQuestionFromQueue(socket) {
    this.#throwError("getQuestionFromQueue");
  }
}

module.exports = QuestionQueue;
