module.exports = function (RED) {
    function ArangoDBNode(config) {
        RED.nodes.createNode(this, config);
        this.configuration = RED.nodes.getNode(config.configuration);
        let resolve = function (response) {
            if (null === response || false === (Symbol.iterator in Object(response))) this.send({
                payload: response
            });
            return response.forEach(function (item) {
                this.send({
                    payload: item
                });
            });
        };
        let error = function (error) {
            this.send({
                payload: {
                    "status": "ArangoDB Error",
                    "error": error
                }
            });
        };
        let input = function (msg) {
            Database = require('arangojs').Database;
            db = new Database({
                url: this.configuration.url,
                databaseName: this.configuration.database,
                auth: {
                    username: this.configuration.username,
                    password: this.configuration.password
                },
            });
            db.query(msg.query, msg.bindVars || {}).catch(error.bind(this)).then(resolve.bind(this));
        };
        this.on('input', input.bind(this));
    }
    RED.nodes.registerType("ArangoDB", ArangoDBNode);
}
