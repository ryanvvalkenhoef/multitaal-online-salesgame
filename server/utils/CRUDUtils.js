class CRUDUtils {
  constructor(jsonFileHandler) {
    this.jsonFileHandler = jsonFileHandler;
  }

  create() {
    throw new Error('Method create() must be implemented in subclass');
  }

  read() {
    throw new Error('Method read() must be implemented in subclass');
  }

  update() {
    throw new Error('Method update() must be implemented in subclass');
  }

  del() {
    throw new Error('Method delete() must be implemented in subclass');
  }
}

export default CRUDUtils;