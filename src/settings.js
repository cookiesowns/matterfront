var fs = require('fs');
var mkdirp = require('mkdirp').sync;
var nconf = require('nconf')
var path = require('path-extra');

var settings = {};

var getStatePath = function(userDataPath){
  return path.join(userDataPath, 'state.json');
};

var getConfigPath = function(appPath){
  return path.join(appPath, 'config.json');
};

var defaults = {
  window: {
    width: 1024,
    height: 600
  }
};

settings.load = function(appPath, userDataPath){
  var statePath = getStatePath(userDataPath);
  var configPath = getConfigPath(appPath);

  nconf.argv();
  nconf.file('state', statePath);
  nconf.file('config', configPath);
  nconf.defaults(defaults);
};

settings.get = function(key){
  return nconf.get(key);
};

settings.set = function(key, value){
  nconf.set(key, value);
};

settings.append = function(key, value){
  var array = nconf.get(key) || [];
  array.push(value);
  nconf.set(key, array);
  return settings._current;
};

settings.saveState = function(userDataPath){
  mkdirp(userDataPath);

  var statePath = getStatePath(userDataPath);
  var state = {
    teams: nconf.get("teams"),
    window: nconf.get("window")
  };
  var content = JSON.stringify(state);
  fs.writeFileSync(statePath, content);
};

module.exports = settings;
