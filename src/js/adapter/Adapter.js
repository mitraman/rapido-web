let backend;
export default {
  setBackend(backend) {
    this.backend = backend
    console.log(this.backend);
  },

  call() {
    console.log('call');
    console.log(backend);
    return backend;
  }
}
