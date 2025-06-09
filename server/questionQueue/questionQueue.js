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

  read(socket) {
    this.#throwError("read");
  }

  create(socket, question) {
    this.#throwError("create");
  }

  delete(socket) {
    this.#throwError("delete");
  }
}

export default QuestionQueue;
