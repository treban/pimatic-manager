var bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; },
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

module.exports = function(env) {
  var ChartDevice, ChartPlugin, GaugeDevice, Promise, assert, mychartplugin;
  Promise = env.require('bluebird');
  assert = env.require('cassert');
  ChartPlugin = (function(superClass) {
    extend(ChartPlugin, superClass);

    function ChartPlugin() {
      this.init = bind(this.init, this);
      return ChartPlugin.__super__.constructor.apply(this, arguments);
    }

    ChartPlugin.prototype.init = function(app, framework, config1) {
      var deviceConfigDef;
      this.framework = framework;
      this.config = config1;
      deviceConfigDef = require("./device-config-schema.coffee");
      this.framework.deviceManager.registerDeviceClass("ChartDevice", {
        configDef: deviceConfigDef.ChartDevice,
        createCallback: (function(_this) {
          return function(config, lastState) {
            return new ChartDevice(config, lastState, _this.framework);
          };
        })(this)
      });
      this.framework.deviceManager.registerDeviceClass("GaugeDevice", {
        configDef: deviceConfigDef.GaugeDevice,
        createCallback: (function(_this) {
          return function(config, lastState) {
            return new GaugeDevice(config, lastState, _this.framework);
          };
        })(this)
      });
      this.framework.on("after init", (function(_this) {
        return function() {
          var mobileFrontend;
          mobileFrontend = _this.framework.pluginManager.getPlugin('mobile-frontend');
          if (mobileFrontend != null) {
            mobileFrontend.registerAssetFile('js', "pimatic-charts/app/chart-page.coffee");
            mobileFrontend.registerAssetFile('js', "pimatic-charts/app/highstock.js");
            mobileFrontend.registerAssetFile('html', "pimatic-charts/app/chart-template.jade");
            mobileFrontend.registerAssetFile('css', "pimatic-charts/app/chart.css");
            return mobileFrontend.registerAssetFile('js', "pimatic-charts/app/solid-gauge.js");
          }
        };
      })(this));
      return this.framework.on('destroy', (function(_this) {
        return function(context) {
          return env.logger.info("Plugin finish...");
        };
      })(this));
    };

    return ChartPlugin;

  })(env.plugins.Plugin);
  ChartDevice = (function(superClass) {
    extend(ChartDevice, superClass);

    ChartDevice.prototype.template = 'chart';

    function ChartDevice(config1, lastState, framework) {
      this.config = config1;
      this.framework = framework;
      ChartDevice.__super__.constructor.call(this, this.config, lastState, this.framework);
    }

    ChartDevice.prototype.destroy = function() {
      return ChartDevice.__super__.destroy.call(this);
    };

    return ChartDevice;

  })(env.devices.VariablesDevice);
  GaugeDevice = (function(superClass) {
    extend(GaugeDevice, superClass);

    GaugeDevice.prototype.template = 'gauge';

    function GaugeDevice(config1, lastState, framework) {
      this.config = config1;
      this.framework = framework;
      GaugeDevice.__super__.constructor.call(this, this.config, lastState, this.framework);
    }

    GaugeDevice.prototype.destroy = function() {
      return GaugeDevice.__super__.destroy.call(this);
    };

    return GaugeDevice;

  })(env.devices.VariablesDevice);
  mychartplugin = new ChartPlugin();
  return mychartplugin;
};
