function update_all_fields() {
    var factor = document.getElementById('scale-factor').value;
    var url   = document.getElementById('gif-url').value;
    document.getElementById('range-value').textContent=factor;
    var img = document.getElementById('result');
    img.src = url;
    img.height = 36 * factor;
}

function send_new_settings() {
    addon.port.emit("settings_data",
        {
            enabled: document.getElementById('enable').checked,
            scale_factor: document.getElementById('scale-factor').value,
            url: document.getElementById('gif-url').value
        }
    );
}

function get_old_settings() {
    addon.port.emit("need_old_settings_data", null);
    addon.port.on("old_settings_data", function(data) {
            var scale_factor = data['scale_factor'];
            document.getElementById('enable').checked = data['enabled'];
            var factor = document.getElementById('scale-factor').value = scale_factor;
            var url = document.getElementById('gif-url').value = data['url'];
            // if never the user has given "1.6, some text", we only keep the "1.6" thanks to parseFloat()
            document.getElementById('range-value').textContent=String(scale_factor);
            var img = document.getElementById('result');
            img.src = data['url'];
            img.height = 36 * scale_factor;
        }
    );
}
