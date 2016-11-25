const util = require('util');
const Events = require('events');

function EventEmitter(){
  Events.call(this);
}
util.inherits(EventEmitter, Events);
const eventEmitter = new EventEmitter();

module.exports = eventEmitter;
