"use strict";


var formManager = function() {
    var public_fields = {};
    var _form_field   = document.querySelector("form");
    var _preview_img  = document.getElementById("preview");


    public_fields.getForm = function() {
        return _form_field;
    };

    public_fields.getFormFieldByName = function(field_name) {
        return _form_field[field_name];
    };

    public_fields.getPreviewTag = function() {
        return _preview_img;
    };

    public_fields.getGifURL = function() {
        return public_fields.getFormFieldByName("gif_url");
    };

    public_fields.getIsEnabled = function() {
        return public_fields.getFormFieldByName("is_enabled");
    };

    public_fields.previewChanges = function(value) {
        value = value || public_fields.getGifURL().value;
        console.log("Changed!", value);
        _preview_img.src = value;
    };

    public_fields.saveformManager = function() {
        console.log("Saving settings...");
        chrome.storage.local.set({
            gif_url: public_fields.getGifURL().value,
            is_enabled: public_fields.getIsEnabled().checked
        });
        window.close();  // close the popup
    };

    public_fields.restoreformManager = function() {
        chrome.storage.local.get(["gif_url", "is_enabled"], (resource) => {
            public_fields.getGifURL().value = resource.gif_url || "http://i.imgur.com/sJLruTF.gif";
            public_fields.getIsEnabled().checked = resource.is_enabled || true;
            public_fields.previewChanges(public_fields.getGifURL().value);
        });
    };

    return public_fields;
}();


document.addEventListener                         ("DOMContentLoaded", formManager.restoreformManager);
formManager.getForm().addEventListener            ("reset",            formManager.restoreformManager);
document.getElementById("submit").addEventListener("click",            formManager.saveformManager   );
formManager.getGifURL().addEventListener          ("input",            function() { formManager.previewChanges() });
