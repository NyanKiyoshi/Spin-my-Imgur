"use strict";

var settings;


function getSettings() {
    console.log("Loading settings.");
    chrome.storage.local.get(["gif_url", "is_enabled"], (resource) => { settings = resource; });
}

function redirect(details) {
    getSettings();
    console.log("Matched:" + details.url, "With those settings:", settings);

    // if the user disabled the script from the settings, we do nothing
    if(!settings.is_enabled) {
        return;
    }

    // Redirect the requested url to the new one
    console.log("Redirected to " + settings.gif_url);
    return {
        redirectUrl: settings.gif_url
    };
}


// load the settings
getSettings();

// if local storage is changed, we reload the settings
chrome.storage.onChanged.addListener(function (changes, area) {
    if (area === "local") {
        getSettings();
    }
});

chrome.webRequest.onBeforeRequest.addListener(
    redirect, {
        urls: ["*://*.imgur.com/images/loaders/*"],
        types:["image"]
    }, ['blocking']
);
