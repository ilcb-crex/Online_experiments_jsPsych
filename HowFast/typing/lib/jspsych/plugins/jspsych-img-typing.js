/**
* jspsych-img-typing
* Adapted from Josh de Leeuw plugin : jspsych-multi-stim-multi-response
*
* Display a word or an image and record typing times during the copy or naming
*
* A set of words or images is displayed. For each word/image, the typing keys & RTs are 
* collected, until a special key is being pressed by the participant.
* The consistency between the displayed word/image and the subject's response is
* checking.
*
* Plugin parameters :
* --------------------
*
* If image stimuli :
*--- img_names : array of expected image namings (array of strings)
*--- img_paths : array of corresponding image paths (array of strings)
*
* If only word stimuli :
*--- stimuli : array of words to reproduce (array of strings)
*
* Shared parameters :
* validresp : key code to press to submit the response 
*            [default: 13, which corresponds to the Enter key]
*      		See http://www.cambiaresearch.com/articles/15/javascript-key-codes 
*
* timing_stim : maximum duration of word/image presentation if the confirm key is not pressed (s) 
*            [default: infinite]
*
* timing_response : maximum duration to wait for the participant answer 
*            [default: infinite]
* 
*
* Output data :
*---------------
*
* for each stimulus, the typing key codes and key chars, the timing of each key and the 
* response consistency ("validity" = 1 : same word typing by the participant, 0 otherwise) 
*
*
*
* CREx--BLRI--AMU--2016
* https://github.com/chris-zielinski/Online_experiments_jsPsych
*
* jsPsych documentation: docs.jspsych.org
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
**/
(function($) {
	jsPsych["img-typing"] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			params.is_html = (typeof params.img_paths !== 'undefined') ? false : true;
			
			// Each stimulus is stored in trials array data structure	
			if (params.is_html == true){
				var trials = new Array(params.stimuli.length);
			
			}else{
				var trials = new Array(params.img_paths.length);
			}

			for (var i = 0; i < trials.length; i++) {
				trials[i] = {};
				if (params.is_html == false) {
					trials[i].is_img = 1;
					trials[i].stimuli = params.img_names[i];
					trials[i].img_path = params.img_paths[i];
				}else{
					trials[i].stimuli = params.stimuli[i];	
					trials[i].is_img = 0;
				}
				// Key to press to validate the multi-keyboard press response
				trials[i].validresp = params.validresp;
								
				// Timing parameters
				// Inter-stimulus duration [default: 500 ms]
				trials[i].timing_interstim = params.timing_interstim || 500;
				trials[i].timing_post_trial = params.timing_interstim || 500;
				
				// Stimulus display duration [default: -1 <=> infinite]
				trials[i].timing_stim = params.timing_stim || -1;
				// Response waiting time before ending trial [default: -1 <=> infinite]
				trials[i].timing_response = params.timing_response || -1;
				
				// Optional parameters
				trials[i].prompt = (typeof params.prompt === 'undefined') ? "" : params.prompt;
			}
			return trials;
		};

		plugin.trial = function(display_element, trial) {
			
			// If first trial, add instruction if the Enter key is not pressed before 8000 ms
			prevtrial = jsPsych.data.getLastTrialData();
			if ((prevtrial.type === "img-typing") || (prevtrial.type === "wd-typing")) {
				var show_instr = 0;
			}else{
				var show_instr = 1;
			}
				

			// Function to evaluate trial variables if any of them are functions
			// and replace it with the output of the function
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial);

			// this array holds handlers from setTimeout calls
			// that need to be cleared if the trial ends early
			var setTimeoutHandlers = [];

			
			// Clear the display and disable cursor visibility
			display_element.append('');
			display_element.addClass('hidecursor');
			
			// display stimulus
			if (trial.is_img == true) {
				var $stimdiv = $('<img/>')
							.attr('src', trial.img_path)
							.attr('style', 'width: 245px')
							.attr('id', 'jspsych-typing-stimulus');
			} else {				
				var $stimdiv = $('<div/>')
							.html(trial.stimuli)							
							.attr('style','padding-bottom: 10px')
							.attr('style','margin-top: 60px')
							.attr('id', 'jspsych-typing-stimulus');
			}

			display_element.append($stimdiv);
			//show prompt if there is one
			if (trial.prompt !== "") {
				display_element.append(trial.prompt);
			}
			
			// array for response times 
			var responseTimes = [];
			var responseTypingTimes = [];
			// array for response keys 
			var responseKeys = [];

			// array for response keys (char form)
			var responseChars = "";

			var responseValidity = 0;

			
			// Initialize response div
			var $inpdiv = $('<input/>')
				.attr('type', 'text')
				.attr('style', 'size:10')
				.attr('id', 'jspsych-typing-response')
				.attr('autocorrect', 'off')
				.attr('autocapitalize', 'off')
				.attr('spellcheck', 'false')
				.addClass('input_typing');
				
			// Add a message if subject lost focus
			$inpdiv.blur(function() {
						var $onblur = $('<p/>')
							.addClass('recall')
							.html("Appuyer sur TAB (tabulation) pour accéder à nouveau à la zone de frappe.");					
						display_element.append($onblur);
					});
				
				
				
			display_element.append($inpdiv);
			
			$('#jspsych-typing-response').focus();	
			
			
			// function to end trial when it is time
			var end_trial = function() {

				// kill any remaining setTimeout handlers
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}

				// kill keyboard listeners
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);
				
				
				if (trial.is_img) {
					var trialtyp = "img-typing";
				}else{
					var trialtyp = "wd-typing";
				}

				// gather the data to store for the trial
				var trial_data = {
					"stim": trial.stimuli,
					"kp": JSON.stringify(responseKeys),
					"kc": responseChars,
					"t0": responseTimes[0], 
					"tt": JSON.stringify(responseTypingTimes),
					"vld": responseValidity,
					"type": trialtyp
				};
				/* Store only the starting time t0, responseTimes being redondant with typing times (typt) JSON.stringify(responseTimes),*/
				
				jsPsych.data.write(trial_data);

				// clear the display
				display_element.html('');
				display_element.removeClass('hidecursor');

				// move on to the next trial
				// In the new version of jspsych, if timing_post_trial exists, 
				// the related time gap is added inside jspsych finishTrial module
				
				jsPsych.finishTrial();
				
			};

			// function to handle responses by the subject		
			var after_response = function(info) {
					
				//display_element.html(''); // clear the display

				if (info.key !== trial.validresp){
					responseTimes.push(info.rt);
					var nt = responseTimes.length;
					
					if (nt === 1){
						responseTypingTimes.push(0);
					}else{
						responseTypingTimes.push(info.rt - responseTimes[nt-2])
					};
					responseKeys.push(info.key);

				}else{
					if(responseTimes.length === 0){
						responseTimes = -1;
						responseTypingTimes = -1;
						
					}else{ // Check for validity
						responseChars = $('#jspsych-typing-response').val();
						if (responseChars == trial.stimuli){
							responseValidity = 1;
						};
					}
					end_trial();
				}; 
			};

			// Recall instruction if time_limit is reached (8000 ms)
			// To do properly, the key to press to validate the response should be as 
			// input arguments and the limit recall time as well
			if (show_instr==1) {
				var t3 = setTimeout(function() {
					var $instr = $('<p/>')
						.addClass('recall')
						.html("Rappel : appuyer sur Entrée pour valider la réponse");					
					display_element.append($instr);
				}, 8000);
				setTimeoutHandlers.push(t3);
			}
				
			
			// hide image if timing is set
			if (trial.timing_stim > 0) {
				var t1 = setTimeout(function() {
					$('#jspsych-typing-stimulus').css('visibility', 'hidden');
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

		return plugin;
	})();
})(jQuery);