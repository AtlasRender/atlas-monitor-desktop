const Store = require('electron-store');

const schema = {
  counter: {
    type: 'number',
    maximum: 100,
    minimum: 0,
    default: 10,
  },
};

const store = new Store({ schema });

export default store;
