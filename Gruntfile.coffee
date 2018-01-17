module.exports = (grunt) ->

  # Project configuration.
  grunt.initConfig
    pkg: grunt.file.readJSON "package.json"
    
    coffeelint:
      app: [
        "*.coffee"
        "test/**/*.coffee"
      ]    
      options:
        no_trailing_whitespace:
          level: "ignore"
        max_line_length:
          value: 100
        indentation:
          value: 2
          level: "error"
        no_unnecessary_fat_arrows:
          level: 'ignore'

    mochaTest:
      test:
        options:
          reporter: "spec"
          require: ['coffee-errors'] #needed for right line numbers in errors
        src: ["test/*"]

  grunt.loadNpmTasks "grunt-coffeelint"
  grunt.loadNpmTasks "grunt-mocha-test"
  
    # Default task(s).
  grunt.registerTask "default", ["coffeelint", "mochaTest:test"]
  grunt.registerTask "test", ["coffeelint", "mochaTest:test"]
