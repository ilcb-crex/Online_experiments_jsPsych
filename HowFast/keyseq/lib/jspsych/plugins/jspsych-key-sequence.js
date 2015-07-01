/**
* jspsych-key-sequence
* TESTS
**/

(function($) {
	jsPsych["key-sequence"] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			// Create randomized stimuli array 
			/* The block of visual stimuli with a randomized order of presentation */
			var stim_arr =  jsPsych.randomization.repeat(params.stim, params.nb_stim, 0);			
		
			var trials = new Array(stim_arr.length);
			for (var i = 0; i < stim_arr.length; i++) {			
				trials[i] = {};
				
				// Word to display (as html element)
				trials[i].stim = stim_arr[i];
				idx = params.stim.indexOf(stim_arr[i]);
				trials[i].keys = params.key_seq[idx];
				trials[i].fingers = params.finger_seq[idx];

				// Timing parameters
				trials[i].timing_stim = params.timing_stim || -1; 
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever
				
				// Training mode (true) or not (false)
				trials[i].training = params.training || false;
				
			}
			return trials;
		};

		plugin.trial = function(display_element, trial) {

			// Function to evaluate trial variables if any of them are functions
			// and replace it with the output of the function
			trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);

			// this array holds handlers from setTimeout calls
			// that need to be cleared if the trial ends early
			var setTimeoutHandlers = [];
			
			// Display stimulus - Limited to an html div element
			display_element.append($('<div>', {
				html: trial.stim,
				id: 'jspsych-key-sequence'
			}));

			// Array for response times 
			var responseTimes = []; 		// Timing from the stimulus presentation
			var responseTypingTimes = []; 	// Timing from the first typing letter
			
			// Array for response keys 
			var responseKeys = []; 		// JS numeric code
			var responseChars = ""; 	// Equivalent char form

			// Array for response validity
			var responseValidity = 0;
						
			// function to end trial when it is time
			var end_trial = function() {

				// kill any remaining setTimeout handlers
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}

				// kill keyboard listeners
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

				// gather the data to store for the trial
				var trial_data = {
					"stimulus": trial.stim,
					"key_seq": trial.keys,
					"finger_seq": trial.fingers,
					"key_press": JSON.stringify(responseKeys),
					"key_char": responseChars,
					"rt": JSON.stringify(responseTimes),
					"typt": JSON.stringify(responseTypingTimes),
					"valid": responseValidity,
					"training": trial.training
				};
				jsPsych.data.write($.extend({}, trial_data, trial.data));


				// clear the display
				display_element.html('');

				// move on to the next trial
				if (trial.timing_post_trial > 0) {
					setTimeout(function() {
						jsPsych.finishTrial();
					}, trial.timing_post_trial);
				} else {
					jsPsych.finishTrial();
				}
			};

			// function to handle responses by the subject		
			var after_response = function(info) {
                // Store responses keys and RTs until confirm key is not pressed    
                if (responseChars.length <= trial.keys.length){
					responseTimes.push(info.rt);
					var nt = responseTimes.length;
					
					if (nt === 1){
						responseTypingTimes.push(0);
					}else{
						responseTypingTimes.push(info.rt - responseTimes[nt-2])
					};
					
					responseKeys.push(info.key);
					responseChars = responseChars + String.fromCharCode(info.key).toLowerCase();
					
					if (responseChars.length == trial.keys.length) {						
						if(responseTimes.length === 0){
							responseTimes = -1;
							responseTypingTimes = -1;
						}else{ // Check for validity
							if (responseChars == trial.keys.toLowerCase()){
								responseValidity = 1;
								if (trial.training == true){
									display_element.append($('<div>', {
									html: 'RÉUSSI !',
									id: 'jspsych-key-seq-training'
									}));
								}
								good_sound.play();
							/*	setTimeout( function(){
								good_sound.play()}, 2000);*/
								
							}else{
								if (trial.training == true){
									display_element.append($('<div>', {
									html: 'RATÉ',
									id: 'jspsych-key-seq-training'
									}));
								}
								bad_sound.play();
							};
						}
						if (trial.training == true){
							setTimeout( function(){
								end_trial();
							}, 1500);
						}else{
							end_trial();
						};
					};
                
				};
			};

			// hide word if timing is set
			if (trial.timing_stim > 0) {
				var t1 = setTimeout(function() {
					$('#jspsych-key-sequence').css('visibility', 'hidden');
				}, trial.timing_stim);
				setTimeoutHandlers.push(t1);
			}
			
			// start the response listener
			var valideresp = [];
			var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse(after_response, valideresp, "date", true);

			// end trial if time limit is set
			if (trial.timing_response > 0) {
				var t2 = setTimeout(function() {
					end_trial();
				}, trial.timing_response);
				setTimeoutHandlers.push(t2);
			}
		};
		
		return plugin;
	})();
})(jQuery);
