let ioInstance = null;

export function setSocketServer(io) {
  ioInstance = io;
}

export function emitRealtime(eventName, payload) {
  if (ioInstance) {
    ioInstance.emit(eventName, payload);
  }
}
