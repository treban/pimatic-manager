
merge = Array.prototype.concat

$(document).on 'templateinit', (event) ->


  class ControleCenterItem extends pimatic.ButtonsItem

    constructor: (templData, @device) ->
      super(templData, @device)

    getItemTemplate: => 'buttons'

    onButtonPress: (button) =>
      doIt = (
        if button.confirm then confirm __("
          Do you really want to press %s?
        ", button.text)
        else yes
      )
      if doIt
        if (button.id == "reload_browser_cache")
          location.reload(true)
        else
          @device.rest.buttonPressed({buttonId: button.id}, global: no)
            .done(ajaxShowToast)
            .fail(ajaxAlertFail)

  pimatic.templateClasses['controlcenter'] = ControleCenterItem
