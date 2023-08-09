module.exports = function (RED) {
  function ArangoDBNode(config) {
    RED.nodes.createNode(this, config);
    this.configuration = RED.nodes.getNode(config.configuration);
    let node = this;
    this.on('input', function (msg, send, done) {
      const { Database } = require('arangojs');
      const db = new Database({
        url: node.configuration.url,
        databaseName: node.configuration.database,
        auth: {
          username: node.configuration.username,
          password: node.configuration.password
        },
      });
      db.query({
        query: msg.query,
        bindVars: msg.bindVars || {},
      }).then(function (cursor) {
        msg.payload = cursor;
        send(msg);
        if (done) done();
      }).catch(function (error) {
        msg.payload = {
          "status": "ArangoDB Error",
          "error": error
        };
        send(msg);
        if (done) done();
      });
    });
  }
  RED.nodes.registerType("ArangoDB", ArangoDBNode);
}
