pimatic-manager
=======================

[![build status](https://img.shields.io/travis/treban/pimatic-manager.svg?branch=master?style=flat-square)](https://travis-ci.org/treban/pimatic-manager)
[![version](https://img.shields.io/npm/v/pimatic-manager.svg?branch=master?style=flat-square)](https://www.npmjs.com/package/pimatic-manager)
[![downloads](https://img.shields.io/npm/v/pimatic-manager.svg?branch=master?style=flat-square)](https://www.npmjs.com/package/pimatic-manager)
[![license](https://img.shields.io/github/license/treban/pimatic-manager.svg)](https://github.com/treban/pimatic-manager)

This plugin provides some management devices for [pimatic](https://pimatic.org/).

Please make feature requests!

#### Features
* Controle Buttons
* Informant logging device
* Event dashboard
* Messages dashboard
* Dynamic Pages

### Installation

Just activate the plugin in your pimatic config. The plugin manager automatically installs the package with his dependencys.

### Configuration

You can load the plugin by adding following in the config.json from your pimatic server:

    {
      "plugin": "manager",
      "debug": true
    }

### ChangeLog
* 0.0.1 : First public version
