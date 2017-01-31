let backend;

export default {
  setBackend(be) {
    backend = be;
  },

  call() {
    return backend;
  }
}
