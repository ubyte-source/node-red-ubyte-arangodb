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
            db.query(
                msg.query,
                msg.bindVars || {}
            ).catch(function (error) {
                send({
                    payload: {
                        "status": "ArangoDB Error",
                        "error": error
                    }
                });
                if (done) done();
            }).then(function (response) {
                if (null === response || false === (Symbol.iterator in Object(response))) {
                    send({
                        payload: response
                    });
                } else {
                    response.forEach(function (item) {
                        send({
                            payload: item
                        });
                    });
                }
                if (done) done();
            });
        });
    }
    RED.nodes.registerType("ArangoDB", ArangoDBNode);
}
