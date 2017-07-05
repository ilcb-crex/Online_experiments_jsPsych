/* jspsych-text.js
 * Josh de Leeuw
 *
 * This plugin displays text (including HTML formatted strings) during the experiment.
 * Use it to show instructions, provide performance feedback, etc...
 *
 * documentation: docs.jspsych.org
 *
 *
 */

(function($) {
    jsPsych.resize = (function() {

        var plugin = {};

        plugin.create = function(params) {

            params = jsPsych.pluginAPI.enforceArray(params, ['text']);
			trials = {};
			trials = [{
				"text" : params.text,
				"cont_key" : 'mouse',
				"timing_post_trial" : 10000
			}];
            return trials;
        };

        plugin.trial = function(display_element, trial) {

            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

            // set the HTML of the display target to replaced_text.
            display_element.html(trial.text);
			
			// Attach an event to resize action
			var prewidth = $(window).width(); 
			var done_rs = 0;
			var resize_done = function (){
				var ww = $(window).width();
				if ((ww !=prewidth) && (done_rs==0)) {
					if (ww > screen.width - 40){
						var $resok = $('<p/>').html("Merci ! Cliquez n'importe où sur la page pour commencer...");
						display_element.append($resok);
						done_rs = 1;
					}
				}
			}
			var attev = 1;
			// http://jsfiddle.net/r4156ubo/
			if (typeof window.addEventListener != 'undefined'){
				window.addEventListener("resize", resize_done, false);
			} else if (typeof document.addEventListener != 'undefined'){
				document.addEventListener("resize", resize_done, false);
			} else if (typeof window.attachEvent != 'undefined'){
				window.attachEvent("onresize", resize_done);
			}else{
				var attev = 0;
			}				
			
			function save_data(key, rt) {
				jsPsych.data.write({
					"rt": rt,
					"kp": key
				});
			}
			
            var after_response = function(info) {

                display_element.html(''); // clear the display

                save_data(info.key, info.rt);				
				if (attev == 1) {
					// remove all listener
					// http://stackoverflow.com/questions/13651274/
					// how-can-i-attach-a-window-resize-event-listener-in-javascript
					if(typeof window.removeEventListener != 'undefined') {
						window.removeEventListener("resize", resize_done);
					} else if(typeof document.removeEventListener != 'undefined'){
						document.removeEventListener("resize", resize_done);
					} else if (	typeof window.detachEvent != 'undefined') {
						window.detachEvent('onresize', resize_done);
					}else {
						//The browser does not support Javascript event binding
					}
				}
                jsPsych.finishTrial();

            };

            var mouse_listener = function(e) {

                var rt = (new Date()).getTime() - start_time;

                display_element.unbind('click', mouse_listener);

                after_response({key: 'mouse', rt: rt});

            };

					
			// finishTrial without recording anythink if timing is set 
			if (attev == 0) {
				setTimeout(function() {
					display_element.html('');
					jsPsych.finishTrial();
						}, trial.timing_stim);
			}else{		

				// check if key is 'mouse'
				if (trial.cont_key == 'mouse') {
					display_element.click(mouse_listener);
					var start_time = (new Date()).getTime();
				} 				
			}
        };

        return plugin;
    })();
})(jQuery);
