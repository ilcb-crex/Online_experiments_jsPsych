/**
* jspsych-key-sequence
* Adapted from Josh de Leeuw plugin : jspsych-multi-stim-multi-response
* 
* Very specific plugin for the HowFast/keyseq experiment running with jsPsych
*
* A set of visual stimulus is displayed. Depending on the stimulus, a sequence of keys is
* expected to be typed by the user. Typing times of the sequence of keys are recorded
* for each stimulus.
*
* After the sequence was typed, the color of the stimulus is changing to green (success)
* or red (mistake).
*
* Stimulus is a character appearing on the screen (ex. "O" or "X"). 
* A specific sequence of keys is attempted to be typed by the user
* as response to the stimulus (ex. "FSD" sequence as response to "X" and "JLK" key 
* sequence as response to "O")
*
* The trial ends when the number of expected keys is typed after the display 
* of the stimulus, regardless if the sequence was correclty reproduced or not
* (ex. when 3 keys are typing associated with the expected response "FSD").
*
* The plugin manages an entire block of trials (succession of trials).
*
*
* Plugin parameters :
* --------------------
*
* Example of block definition in the experiment HTML file :
*
*		var block = {
*			type: "key-sequence",
*			stim : ['O','X'],   // Stimulus characters
*			nb_stim : [10,10],  // Number of stimulus of each kind
*			key_seq : ['fsd', 'fsj'],   // Corresponding keyboard letter sequence
*			finger_seq : ['iam','iaI'],  // Finger sequence attempted for each kind
*			timing_interstim : 500,     // Inter-stimulus duration (ms)
*			training : false		// Training mode 
*		};
*
*
* --- stim : array of characters that figures each kind of visual stimulus 
*
* --- nb_stim : number of stimuli of each kind to be diplayed successively during the block of trials
*
*	  A RANDOMIZED ARRAY of stimuli is created to define the final display order at the plugin launch. 
*     Example : from stim = ['O', 'X'] and nb_stim = [4, 2] 
*			   => ['O', 'O', 'X', 'O', 'X', 'O'] should have been a possible result of the randomized 
*                computation
*
* --- key_seq : corresponding sequence of keys associated with each kind of stimulus (stim array)
*				and which is expected as correct answer 
*
*		If the sequence is correctly reproduced, the color of the stimulus changed to GREEN
*   	for 650 ms ; it changes to RED if a mistake is done in the sequence. To change the duration 
*		of the colored feedback, see at the end of the "after_response" function inside this script.
*
*
* ----- Optional parameters :
*
*	--- training : if true, the block ends as soon as a sequence is not correctly typed
*		This allows to remind the instructions, during the training block.
*		A word ("REUSSI" (succeed) or "RATE" (failed)) is added below the stimulus in addition to the 
* 		colored feedback.
*		[ default : false ]
*		A "conditional" chunk is defined in the experiment HTML file (see ks_exp.html) to allow the loop
*		mistake / instruction ; and to end block when the required number of successive well-typed sequence 
*		is reached.
*
* 	--- finger_seq : corresponding sequence of fingers implied in the expected response 
*			The finger specification purpose is only instructive (to be joined to the output data that 
*			are saved on the database). Can be useful for data processing.
* 			Example : 	'iam' : sequence done only with the left hand : index - ring - middle
*           			'iaI' : left index - left ring - RIGHT INDEX
*						(with i : index ; a : annulaire (ring) and m : majeur (middle)
* 						Lower case refers to the left hand ; upper case to the RIGHT)
*
* 	--- timing_stim : maximum duration of the stimulus presentation in miliseconds
*			The stimulus disapears after timing_stim ms (if the response sequence was not typed before).
*			[ default : infinite ]
*	
*	--- timing_response : maximum duration to give the key sequence before the ending of the trial 
*			(in miliseconds)
*			[ default : infinite ]
* 
*
* The layout, including the font size of the stimuli and its position on the page, is set in the CSS 
* script (jspsych / css / jspsych.css) - for id "#jspsych-key-sequence" and class "stimseq" :
*
* #jspsych-key-sequence {
*    display: block;
*    margin-left: auto;
*    margin-right: auto;
*	 margin-top: 35%;
*	 text-align: center;
*	 font-size: 72px;
*  }
*
* .stimseq {
*	 font-size: 20px;
*	 margin-left: 20px;
*  } 
*
*
* Output data :
* -------------
*
* for each stimulus, the typing key codes (ascii codes) : key_press ; the associated letters (key_chars) and typing times 
* an indication if the answer was correct and if the training was activated 
*
*
* CREx--BLRI--AMU--2016
* https://github.com/chris-zielinski/Online_experiments_jsPsych
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
**/


(function($) {
	jsPsych["key-sequence"] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			// Create randomized stimuli array according to the number of stimulus required for each kind of stimulus 
			/* The block of visual stimuli with a randomized order of presentation */
			var stim_arr =  jsPsych.randomization.repeat(params.stim, params.nb_stim, 0);			
		
			var trials = new Array(stim_arr.length);
			
			if (typeof params.finger_seq === 'undefined') {
				var fingspec = false;
			}else{
				var fingspec = true;
			}
			
			for (var i = 0; i < stim_arr.length; i++) {			
				trials[i] = {};
				
				// Word to display (as html element)
				trials[i].stim = stim_arr[i];
				idx = params.stim.indexOf(stim_arr[i]);
				trials[i].keys = params.key_seq[idx];
				
				if (fingspec == true){
					trials[i].fingers = params.finger_seq[idx];
					trials[i].is_fing = 1;
				}else {
					trials[i].is_fing = 0;
				}
				

				// Timing parameters
				trials[i].timing_stim = params.timing_stim || -1; 
				trials[i].timing_response = params.timing_response || -1; // if -1, then wait for response forever

				trials[i].timing_interstim = params.timing_interstim || -1;
				trials[i].timing_post_trial = params.timing_interstim || -1;
				
				// Training mode (true) or not (false)
				trials[i].training = params.training || false;
				
			}
			return trials;
		};

		plugin.trial = function(display_element, trial) {

			// If we are inside a training sequence, the trial is shown only if the preceding answer was correct
			// The conditions to show the current trial are therefore :
			// - it is the first one (preceding trial_type wasn't "key-sequence" AND with "training" case)
			// OR :
			// - the preceding trial was a "key-sequence" type AND training case, with VALID answer
			
			
			var goon = true;
			// Current trial belong to a training session : we don't display it if previous typed key sequence was wrong 
			if (trial.training){
				prevtrial = jsPsych.data.getLastTrialData();
				if ((prevtrial.trial_type == "key-sequence-training") && (!prevtrial.valid)) {
					goon = false;
				}
				
			}
			
			if (!goon) {
				trial.timing_post_trial = 0;
				jsPsych.finishTrial();
			} else {
				trial.timing_post_trial = trial.timing_interstim;
				// Function to evaluate trial variables if any of them are functions
				// and replace it with the output of the function
				trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial); //NEW 

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
				
				// div with feedback
				var $succdiv = $('<div/>')
								.attr('id','jspsych-key-seq-training')
								.html("RÉUSSI !")
								.addClass("green");
								
				var $faildiv = $('<div/>')
								.attr('id','jspsych-key-seq-training')
								.html("RATÉ")
								.addClass("red");								
					
				// function to end trial when it is time
				var end_trial = function() {

					// kill any remaining setTimeout handlers
					for (var i = 0; i < setTimeoutHandlers.length; i++) {
						clearTimeout(setTimeoutHandlers[i]);
					}

					// kill keyboard listeners
					jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

					var trialtyp = "key-sequence";
					if (trial.training) {
						trialtyp = trialtyp + "-training";
					}
						
					// gather the data to store for the trial
					if (trial.is_fing == 1){
						var trial_data = {
							"stimulus": trial.stim,
							"key_seq": trial.keys,
							"finger_seq": trial.fingers,
							"key_press": JSON.stringify(responseKeys),
							"key_char": responseChars,
							"rt": JSON.stringify(responseTimes),
							"typt": JSON.stringify(responseTypingTimes),
							"valid": responseValidity,
							"training": trial.training,
							"trial_type": trialtyp
						};
					} else {
						var trial_data = {
							"stimulus": trial.stim,
							"key_seq": trial.keys,
							"key_press": JSON.stringify(responseKeys),
							"key_char": responseChars,
							"rt": JSON.stringify(responseTimes),
							"typt": JSON.stringify(responseTypingTimes),
							"valid": responseValidity,
							"training": trial.training,
							"trial_type": trialtyp
						};						
					}
					
					jsPsych.data.write($.extend({}, trial_data, trial.data));

					// clear the display
					display_element.html('');

					// move on to the next trial
					
					// In the new version of jspsych, if timing_post_trial exists, the related time gap is added inside jspsych finishTrial module
					jsPsych.finishTrial();

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
						
						// All the sequence caracters are typed
						if (responseChars.length == trial.keys.length) {						
							if(responseTimes.length === 0){
								responseTimes = -1;
								responseTypingTimes = -1;
							}else{ // Check for validity
								if (responseChars == trial.keys.toLowerCase()){
									responseValidity = 1;
									if (trial.training == true){
										display_element.append($succdiv);
									}
									$("#jspsych-key-sequence").addClass("green");
									
								}else{
									if (trial.training == true){
										display_element.append($faildiv);
									}
									$("#jspsych-key-sequence").addClass("red");

								};
							};
							
							// Let time to see the feedback color of the symbol (correct : green, error : red)
							setTimeout( function(){
									end_trial();
								}, 650); 
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
				var keyboardListener = jsPsych.pluginAPI.getKeyboardResponse({
					callback_function: after_response,
					valid_responses: valideresp,
					rt_method: 'date',
					persist: true,
					allow_held_key: false
				}); 
				
				
				// end trial if time limit is set
				if (trial.timing_response > 0) {
					var t2 = setTimeout(function() {
						end_trial();
					}, trial.timing_response);
					setTimeoutHandlers.push(t2);
				}
				
			};
		};
		return plugin;
	})();
})(jQuery);
