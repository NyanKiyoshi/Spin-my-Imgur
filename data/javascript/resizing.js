self.port.on("scale_factor", function(scale_factor) {
        /*
        * Based on "https://chrome.google.com/webstore/detail/imgurian-tweaks/hljlokiakakknbbkpcoaceibkjmffnkp/related"
        * Big thank you!! <3
        * */
        // Run each time the body is modified
        $('body').bind('DOMNodeInserted DOMNodeRemoved', function() {
            // If no loading gif is present, do nothing
            var tipsy = $(".tipsy-inner img");
            if(tipsy.length == 0)
                return;

            // Otherwise calculate a new size
            var new_size = tipsy.width();

            if(new_size <= 30)
                new_size *= scale_factor;

            console.log("ty" + new_size);

            // Update the size
            tipsy.css("width", new_size + "px");
        });

            console.log("sc" + scale_factor);
        // Inject CSS for resizing other images
        $('head').append('<style id="d"> #side-gallery .small-loader, #small-loader {background-repeat: no-repeat !important; background-size:' + scale_factor*40 + 'px auto !important; } #side-gallery .small-loader, #small-loader { height: ' + scale_factor*40 + 'px !important; width: ' + scale_factor*40 + 'px  !important; }  #cboxLoadingGraphic, .zoom-loader { height: auto !important;  width: ' + scale_factor*40 + 'px !important;}  .outside-loader { width: ' + scale_factor*40 + 'px !important; height: auto !important; }  #past-wrapper #past-loader { width:' + scale_factor*48 + 'px !important; height:auto !important; }  #shareonimgur #share-loader { width:' + scale_factor*24 + 'px !important; height:auto !important; } </style>');
    }
);
