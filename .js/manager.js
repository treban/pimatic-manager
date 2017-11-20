var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = function(env) {
  var ControleCenterDevice, InformantDashBoard, Manager, Promise, assert, child_process, mymanager;
  Promise = env.require('bluebird');
  assert = env.require('cassert');
  child_process = require("child_process");
  Manager = (function(superClass) {
    extend(Manager, superClass);

    function Manager() {
      this.init = bind(this.init, this);
      return Manager.__super__.constructor.apply(this, arguments);
    }

    Manager.fw = null;

    Manager.prototype.init = function(app, framework, config1) {
      var deviceConfigDef;
      this.framework = framework;
      this.config = config1;
      this.fw = this.framework;
      deviceConfigDef = require("./device-config-schema.coffee");
      this.framework.deviceManager.registerDeviceClass("ControleCenterDevice", {
        configDef: deviceConfigDef.ControleCenterDevice,
        createCallback: (function(_this) {
          return function(config, lastState) {
            return new ControleCenterDevice(config, lastState, _this.framework);
          };
        })(this)
      });
      this.framework.on("after init", (function(_this) {
        return function() {
          var mobileFrontend;
          mobileFrontend = _this.framework.pluginManager.getPlugin('mobile-frontend');
          if (mobileFrontend != null) {
            mobileFrontend.registerAssetFile('js', "pimatic-manager/app/manager-page.coffee");
            mobileFrontend.registerAssetFile('html', "pimatic-manager/app/manager-template.jade");
            return mobileFrontend.registerAssetFile('css', "pimatic-manager/app/manager.css");
          }
        };
      })(this));
      return this.framework.on('destroy', (function(_this) {
        return function(context) {
          return env.logger.info("Plugin finish...");
        };
      })(this));
    };

    return Manager;

  })(env.plugins.Plugin);
  InformantDashBoard = (function(superClass) {
    extend(InformantDashBoard, superClass);

    InformantDashBoard.prototype.template = 'informantdashboard';

    function InformantDashBoard(config1, lastState, framework) {
      this.config = config1;
      this.framework = framework;
      InformantDashBoard.__super__.constructor.call(this, this.config, lastState, this.framework);
    }

    InformantDashBoard.prototype.destroy = function() {
      return InformantDashBoard.__super__.destroy.call(this);
    };

    return InformantDashBoard;

  })(env.devices.Device);
  ControleCenterDevice = (function(superClass) {
    extend(ControleCenterDevice, superClass);

    ControleCenterDevice.prototype.template = "controlcenter";

    function ControleCenterDevice(config1) {
      this.config = config1;
      this.id = this.config.id;
      this.name = this.config.name;
      ControleCenterDevice.__super__.constructor.call(this, this.config);
    }

    ControleCenterDevice.prototype.getButton = function() {
      return Promise.resolve(this._lastPressedButton);
    };

    ControleCenterDevice.prototype.buttonPressed = function(buttonId) {
      switch (buttonId) {
        case "restart_pimatic":
          mymanager.fw.restart();
          return Promise.resolve();
        case "restart_server":
          env.logger.debug("restart server");
          return this.runCmd("reboot");
        case "update_server":
          env.logger.debug("restart server");
          return this.runCmd("reboot");
        case "update_pimatic":
          env.logger.debug("restart server");
          return mymanager.fw.pluginManager.installUpdatesAsync(mymanager.fw.pluginManager.getOutdatedPlugins());
      }
      return Promise.resolve();
    };

    ControleCenterDevice.prototype.destroy = function() {
      return ControleCenterDevice.__super__.destroy.call(this);
    };

    ControleCenterDevice.prototype.runCmd = function(command) {
      return new Promise(function(resolve, reject) {
        return child_process.exec(command, function(err, stdout, stderr) {
          if (err) {
            env.logger.debug("exec output: " + stderr);
            return reject(stderr);
          } else {
            env.logger.debug("exec error: " + stdout);
            return resolve(stdout);
          }
        });
      });
    };

    return ControleCenterDevice;

  })(env.devices.ButtonsDevice);
  mymanager = new Manager();
  return mymanager;
};
