module.exports = {
  title: "manager",
  ControleCenterDevice: {
    title: "Controle Center Device properties",
    type: "object",
    extensions: ["xLink"],
    properties: {
      buttons: {
        description: "Buttons to display",
        type: "array",
        "default": [],
        format: "table",
        items: {
          type: "object",
          properties: {
            id: {
              type: "string",
              "enum": ["reload_browser_cache", "restart_pimatic", "restart_server", "update_pimatic"]
            },
            text: {
              type: "string"
            },
            confirm: {
              description: "Ask the user to confirm the button press",
              type: "boolean",
              "default": false
            },
            action: {
              description: "The action to perform",
              type: "string"
            }
          }
        }
      }
    }
  }
};
