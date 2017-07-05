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
    jsPsych.text = (function() {

        var plugin = {};

        plugin.create = function(params) {

            params = jsPsych.pluginAPI.enforceArray(params, ['text','cont_key']);

			// As much trials as stimuli (each stimuli = text to copy)
            var trials = new Array(params.text.length);
            for (var i = 0; i < trials.length; i++) {
                trials[i] = {};
                trials[i].text = params.text[i]; // text of all trials
                trials[i].cont_key = params.cont_key || []; // keycode to press to advance screen, default is all keys.
				
				// CREx add 150903 
				// Display text during the duration timing_stim, then go to the next trial
				// (without waiting for keyboard or mouse response)
				trials[i].timing_stim = params.timing_stim || -1; 
				// + Add timing_post_trial parameter (otherwise, the default value is 1000 in jspsych.js)
				trials[i].timing_post_trial = params.timing_post_trial || -1;
				
				// Progress bar
				trials[i].progbar = (typeof params.progbarstr === 'undefined') ? "" : params.progbarstr;
            }
            return trials;
        };

        plugin.trial = function(display_element, trial) {

            // if any trial variables are functions
            // this evaluates the function and replaces
            // it with the output of the function
            trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

            // set the HTML of the display target to replaced_text.
            display_element.html(trial.text);
			
			// Add progress bar
			display_element.prepend(trial.progbar);
			
			function save_data(key, rt) {
				jsPsych.data.write({
					"rt": rt,
					"kp": key
				});
			}
			
            var after_response = function(info) {

                display_element.html(''); // clear the display

                save_data(info.key, info.rt);

                jsPsych.finishTrial();

            };

            var mouse_listener = function(e) {

                var rt = (new Date()).getTime() - start_time;

                display_element.unbind('click', mouse_listener);

                after_response({key: 'mouse', rt: rt});

            };

				
			// finishTrial without recording anythink if timing is set 
			if (trial.timing_stim > 0) {
				setTimeout(function() {
					display_element.html('');
					jsPsych.finishTrial();
						}, trial.timing_stim);
			}else{		
				// check if key is 'mouse'
				if (trial.cont_key == 'mouse') {
					display_element.click(mouse_listener);
					var start_time = (new Date()).getTime();
				} else {
					// Start keyboard listener
					//prev :	jsPsych.pluginAPI.getKeyboardResponse(after_response, trial.cont_key);
					jsPsych.pluginAPI.getKeyboardResponse({
						callback_function: after_response,
						valid_responses: trial.cont_key,
						rt_method: 'date',
						persist: false,
						allow_held_key: false
					}); 

				}
			}


        };

        return plugin;
    })();
})(jQuery);
