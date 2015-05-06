const {Cc, Ci, components} = require("chrome");
const is_loader = /https?:\/\/s\.imgur\.com\/images\/loaders\/.*\/.*\.gif/i;
var ioService = components.classes["@mozilla.org/network/io-service;1"].getService(Ci.nsIIOService);

var { ToggleButton } = require('sdk/ui/button/toggle');
var panels = require("sdk/panel");
var self = require("sdk/self");
var settings = require("sdk/simple-prefs");
var pageMod = require("sdk/page-mod");

var is_panel_initialized = false;

var button = ToggleButton({
    id: "imgur-spin-button",
    label: "Spin my Imgur",
    icon: {
        "16": "./images/logo-16.png",
        "32": "./images/logo-32.png",
        "64": "./images/logo-64.png"
    },
    onChange: handleChange
});

var panel = panels.Panel({
    contentURL: self.data.url("templates/settings.html"),
    onHide: handleHide,
    height: 270,
    ContentScript: [
"    self.port.on(\"old_settings_data\", function(data) {",
"        var factor = document.getElementById('scale-factor').value = data['factor'];",
"        var url   = document.getElementById('gif-url').value = data['url'];",
"        document.getElementById('range-value').textContent=data['factor'];",
"        var img = document.getElementById('result');",
"        img.src = data['url'];",
"        img.height = 36 * data['factor'];",
"    }",
");"]
});

function handleChange(state) {
    if (state.checked) {
        panel.show({
            position: button
        });

        /**
         * if panel is not already initialized with the current data and not submitted,
         * if never the user need like to copy/ paste a like or something else the changes are not erased.
        **/
        if (!is_panel_initialized) {
            is_panel_initialized = true;
            emit_old_settings();  // we emit the data and after we only emit if asked
            panel.port.on("need_old_settings_data", emit_old_settings);
            panel.port.on("settings_data", function (data) {
                settings.prefs['enabled']       = data['enabled'];
                settings.prefs['scale_factor']  = data['scale_factor'];
                settings.prefs['url']           = data['url'];
                is_panel_initialized = false;  // user has been submitted the form so we can reinitialize next time
                panel.hide();
            });
        }
    }
}

function emit_old_settings() {
    panel.port.emit("old_settings_data", {
            enabled: settings.prefs['enabled'],
            scale_factor: settings.prefs['scale_factor'],
            url: settings.prefs['url']
        }
    );
}

function handleHide() {
    button.state('window', {checked: false});
}

scale_factor = parseFloat(settings.prefs['scale_factor']);
pageMod.PageMod({
    include: /https?:\/\/(.*\/)?imgur\.com\/.*/i,
    contentScriptFile: [self.data.url("javascript/jquery-2.1.1.min.js"), self.data.url("javascript/resizing.js")],
    onAttach: function(worker) {
        worker.port.emit("scale_factor", parseFloat(settings.prefs['scale_factor']));
    }
});

var httpRequestObserver = {
    observe: function(subject, topic, data)
    {
        if (topic == "http-on-modify-request") {
            httpChannel = subject.QueryInterface(Ci.nsIHttpChannel);
            if (httpChannel.name.match(is_loader) && settings.prefs['enabled']) {
                // subject.cancel(components.results.NS_BINDING_ABORTED);
                httpChannel.redirectTo (
                    ioService.newURI(settings.prefs['url'], null, null)
                );
            }
        }
    }
};

var observerService = Cc["@mozilla.org/observer-service;1"].getService(Ci.nsIObserverService);
observerService.addObserver(httpRequestObserver, "http-on-modify-request", false);
