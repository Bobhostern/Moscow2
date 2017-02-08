module.exports = function (app) {
    if (!app) {
        console.log('No app to create routes for.');
        return;
    }

    console.log('Creating routes');

    const REST = '/rest/';

    var contest = require('./contest');
    var messages = require('./messages');
    var navigation = require('./navigation');
    var problems = require('./problems');
    var submission = require('./submission');
    var user = require('./user');
    var competitors = require('./competitor');

    var worker = require('./worker');

    app.use(REST + 'contest', contest);
    app.use(REST + 'messages', messages);
    app.use(REST + 'navigation', navigation);
    app.use(REST + 'problems', problems);
    app.use(REST + 'submission', submission);
    app.use(REST + 'user', user);
    app.use(REST + 'worker',worker);
    app.use(REST + 'competitors', competitors);

}