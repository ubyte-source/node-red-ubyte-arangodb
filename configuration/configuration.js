module.exports = function (RED) {
  function ConfigurationNode(object) {
    RED.nodes.createNode(this, object);
    this.url = object.url;
    this.name = object.name;
    this.database = object.database;
    this.username = object.username;
    this.password = object.password;
  }
  RED.nodes.registerType("configuration", ConfigurationNode);
}
