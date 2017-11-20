module.exports = (env) ->

  Promise = env.require 'bluebird'
  assert = env.require 'cassert'

  child_process = require("child_process")

  class Manager extends env.plugins.Plugin

    @fw = null

    init: (app, @framework, @config) =>
      @fw = @framework
      deviceConfigDef = require("./device-config-schema.coffee")
      @framework.deviceManager.registerDeviceClass("ControleCenterDevice",{
        configDef : deviceConfigDef.ControleCenterDevice,
        createCallback : (config, lastState) => new ControleCenterDevice(config,lastState, @framework)
      })
      @framework.on "after init", =>
        mobileFrontend = @framework.pluginManager.getPlugin 'mobile-frontend'
        if mobileFrontend?
          mobileFrontend.registerAssetFile 'js',   "pimatic-manager/app/manager-page.coffee"
          mobileFrontend.registerAssetFile 'html', "pimatic-manager/app/manager-template.jade"
          mobileFrontend.registerAssetFile 'css',  "pimatic-manager/app/manager.css"
      @framework.on('destroy', (context) =>
        env.logger.info("Plugin finish...")
      )

  class InformantDashBoard extends env.devices.Device

    template: 'informantdashboard'

    constructor: (@config, lastState, @framework) ->
      super(@config, lastState, @framework)

    destroy: ->
      super()

  class ControleCenterDevice extends env.devices.ButtonsDevice

    template: "controlcenter"

    constructor: (@config)->
      @id = @config.id
      @name = @config.name
      super(@config)

    getButton: -> Promise.resolve(@_lastPressedButton)

    buttonPressed: (buttonId) ->
      switch buttonId
        when "restart_pimatic"
          mymanager.fw.restart()
          return Promise.resolve()
        when "restart_server"
          env.logger.debug("restart server")
          return @runCmd("reboot")
        when "update_server"
          env.logger.debug("restart server")
          return @runCmd("reboot")
        when "update_pimatic"
          env.logger.debug("restart server")
          return mymanager.fw.pluginManager.installUpdatesAsync(mymanager.fw.pluginManager.getOutdatedPlugins())
      return Promise.resolve()

    destroy: () ->
      super()

    runCmd: (command) ->
      return new Promise( (resolve, reject) ->
        child_process.exec(command, (err, stdout, stderr) ->
          if err
            env.logger.debug "exec output: #{stderr}"
            return reject(stderr)
          else
            env.logger.debug "exec error: #{stdout}"
            return resolve(stdout)
        )
      )
  mymanager = new Manager()
  return mymanager
