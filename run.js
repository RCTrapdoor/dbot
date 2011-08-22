require('./snippets');
var fs = require('fs');
var jsbot = require('./jsbot');
//var quote = require('./modules/quotes');

var modules = ['user', 'admin', 'puns', 'kick', 'reality', 'karma'];

var dbot = Class.create({
    initialize: function(dModules, quotes) {
        this.admin = 'reality';
        this.waitingForKarma = false;
        this.name = 'depressionbot';
        this.db = JSON.parse(fs.readFileSync('db.json', 'utf-8'));
        this.quotes = require(quotes).fetch(this);

        this.instance = jsbot.createJSBot(this.name, 'elara.ivixor.net', 6667, this, function() {
            this.instance.join('#realitest');
            this.instance.join('#42');
            this.instance.join('#itonlygetsworse');
        }.bind(this));

        this.moduleNames = dModules;
        this.rawModules = [];
        this.modules = [];

        this.reloadModules();
        
        this.instance.connect();
    },

    say: function(channel, data) {
        this.instance.say(channel, data);
    },

    save: function() {
        fs.writeFile('db.json', JSON.stringify(this.db, null, '    '));
    },

    reloadModules: function() {
        require.cache = {}; // Stupid bloody prototype.js

        this.rawModules = [];
        this.modules = [];

        this.moduleNames.each(function(name) {
            this.rawModules.push(require('./modules/' + name));
        }.bind(this));

        this.instance.removeListeners();

        this.modules = this.rawModules.collect(function(rawModule) {
            var module = rawModule.fetch(this);
            this.instance.addListener(module.on, module.listener);
            return module;
        }.bind(this));
    }
});

new dbot(modules, './modules/quotes');
