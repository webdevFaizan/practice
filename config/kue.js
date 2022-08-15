const kue = require('kue');

const queue = kue.createQueue();

module.exports = queue;
//We require different workers to run on different queue, to micro manage it. But we can have different workers to run on one single queue.