/**
* jspsych-txt-typing
* Adapted from Josh de Leeuw plugin : jspsych-multi-stim-multi-response
*
* Displays a text and records typing keys and times during the copy.
*
* Plugin parameters :
*
* stimuli : the set of texts (array of texts)
*
* valid : indicates the way to submit the typed text - contains two fields :
*
*	--- valid.type : 'button' or 'key' 
*					- if 'button', a button is display at the bottom of the text input fields
*					to validate the text the subject has to click on the button
*					- if 'key', the text is submitted by pushing a special keyboard key
*					[ default : 'button' ]
*
*	--- valide.val : for type 'button', string to display on the submitted button [default : "Valider"]
*					 for type 'key', char code value of the key to press to valid answer [default. : 13 (=Enter)]
*
* timing_interstim : inter-stimulus duration (in milliseconds) [default : 500]
*
* timing_stim : maximum duration of stimuli presentation if the confirm key is not pressed (in milliseconds) 
*            [default: infinite]
*
* timing_response : maximum duration to wait for the participant answer before ending trial (in milliseconds) 
*            [default: infinite]
* 
*
*
* Output data :
*
* for each displayed text, the typed key codes and the associated typing times, 
* as well as the typing text that was appearing on the screen at the submitting moment
*
* CREx--BLRI--AMU--2016
* https://github.com/chris-zielinski/Online_experiments_jsPsych
*
* jsPsych documentation: docs.jspsych.org
*
**/

(function($) {
	jsPsych["txt-typing"] = (function() {

		var plugin = {};

		plugin.create = function(params) {
		
			var Nstim = params.stimuli.length;
			
			// Check for response submission properties
			
			// Default : "Valider" button	
			var valid_obj =  {	type: 'button',
								val: 'Valider'};
								
			if (typeof params.valid != 'undefined'){
				
				if (typeof params.valid.type !== 'undefined'){
					
					if ((params.valid.type == 'button') && (typeof params.valid.val !== 'undefined')){
						valid_obj.val = params.valid.val;
					}
					// Default for validation response of type 'key' : Enter (Code 13)
					if (params.valid.type == 'key') {
						valid_obj.type = 'key';
						valid_obj.val = typeof params.valid.val == 'undefined'   ? 13 : params.valid.val;
						if (typeof valid_obj.val == 'string'){
							valid_obj.val = valid_obj.val.charCodeAt();
						}
					}
				}
			}			
			var trials = new Array(Nstim);
			for (var i = 0; i < Nstim; i++) {			
				trials[i] = {};
				
				// Text to display (as html element)
				trials[i].stimuli = params.stimuli[i];
				
				trials[i].valid = valid_obj;

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
			if (prevtrial.type != "txt-typing") {
				var show_instr = 1;
			}else{
				var show_instr = 0;
			}
			
			
			// Function to evaluate trial variables if any of them are functions
			// and replace it with the output of the function
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial); //NEW 
				

			// this array holds handlers from setTimeout calls
			// that need to be cleared if the trial ends early
			var setTimeoutHandlers = [];
			
		
			// Define the div to display
			
			// Text to copy
			var $txtdiv = $('<div/>')
							.attr('id','jspsych-txt-disp');
			var $ptxt = $('<span/>')
							.attr('id', 'ptxt')
							.html(trial.stimuli);
							
			$txtdiv.append($ptxt); 					

			// Input div
			// + remove autocorrect functions of browser
			var $inpdiv = $('<textarea/>')
							.attr('type', 'text')
							.attr('id', 'jspsych-txt-input')
							.attr('autocorrect', 'off')
							.attr('autocapitalize', 'off')
							.attr('spellcheck', 'false')
							.attr('id', 'jspsych-txt-input')
							.addClass('input_typing');
			// Borders will be removed in CSS sheet .attr('style', 'border: none');
	
						// Add a message if subject lost focus
			$inpdiv.blur(function() {
						var $onblur = $('<p/>')
							.addClass('recall')
							.html("Appuyer sur TAB (tabulation) pour accéder à nouveau à la zone de frappe.");					
						display_element.append($onblur);
					});
			
			// Button to validate input			
			if (trial.valid.type == 'button'){
				var $valbut = $('<button/>')
								.attr('id','validbutton')
								//.attr('onclick', 'end_trial')
								.html(trial.valid.val);
			}
			
			// function to end trial when it is time
			var end_trial = function() {
				if (responseTimes.length === 0){
					responseTimes = -1;
					responseTypingTimes = -1;
					responseKeys = -1;
				}

				// kill any remaining setTimeout handlers
				for (var i = 0; i < setTimeoutHandlers.length; i++) {
					clearTimeout(setTimeoutHandlers[i]);
				}

				// kill keyboard listeners
				jsPsych.pluginAPI.cancelKeyboardResponse(keyboardListener);

				// gather the data to store for the trial
				// Eventually, crop the stimulus text if too long to lighten the database
				/*if (trial.stimuli.length > 42){
					var stim = trial.stimuli.slice(0, 42) + "...";
				}else{
					var stim = trial.stimuli;
				}*/
				
				// Add typing text as display by the participant and start time
				var typtxt = $('#jspsych-txt-input').val();
				if (trial.stimuli == typtxt){
					var responseValidity = 1;
				}else{
					var responseValidity = 0;
				}
				var trial_data = {
					"kp": JSON.stringify(responseKeys),
					"t0": responseTimes[0],
					"tstr": typtxt,
					"tt": JSON.stringify(responseTypingTimes),
					"vld": responseValidity,
					};
	
				// "stim": trial.stimuli, 
				// As txt stim are always in the same order, we remove the stim sentence (should be retrieve
				// with the icur index = index of the trial in current block
				
				jsPsych.data.write(trial_data);

				// clear the display
				display_element.html('');
				display_element.removeClass("txt-typing hidecursor");

				// move on to the next trial
				
				// In the new version of jspsych, if timing_post_trial exists, 
				// the related time gap is added inside jspsych finishTrial module
				jsPsych.finishTrial();
			};
			
			
			// end_trial when button is clicking
			if (trial.valid.type == 'button'){
				$valbut.click(end_trial);
			}
			
			// Display all the elements
			// Clear the display before all
			display_element.html('');
			display_element.addClass("hidecursor txt-typing");
			display_element.append($txtdiv);
			
			/**            ---------
			  Input area dimension function of txt-disp display 
			               ----------                       **/
			
			// Height of the text div (paragraph) in px
			var hdiv = $('#ptxt').height(); 

			// Width of the text div in px
			var wdiv = $('#ptxt').width(); 
	
			// Set the input dimension
			// Add 1 row for the height to account for user's typing mistakes
			// Should be less than 30 px
			$inpdiv.height(hdiv + 30).width(wdiv + 3);
			
			// Set the position
			$inpdiv.css('left', function(){
					return $('#ptxt').position().left;
				});
				
			//$inpdiv.attr({style: 'height:'+ hdiv + '; width:' + wdiv});
			
			// Try to remove caret pointer (blinking cursor) for IE
		//	$inpdiv.attr('unselectable','on');
		//	$inpdiv.focus(function(){ $(this).blur(); });
		
		
			
			// Finally display the input area with the good dimension and position (OR NOT...)
			
			$txtdiv.append($inpdiv);
			 
			
			// Add button
			if (trial.valid.type == 'button'){
				display_element.append($valbut); 
			}
				
			// Show prompt if there is one
			if (trial.prompt !== "") {
				display_element.append(trial.prompt);
			}
			
			// Array for response times 
			var responseTimes = []; 		// Timing from the stimulus presentation
			var responseTypingTimes = []; 	// Timing from the first typing letter
			
			// Array for response keys 
			var responseKeys = []; 		// JS numeric code
			// var responseChars = ""; 	// Equivalent char form

			// Array for response validity
			//var responseValidity = 0;
			
			// Initialize response input element
			
			// Give the focus to this input area			
			$('#jspsych-txt-input').focus();	
			

			// function to handle responses by the subject		
			var after_response = function(info) {
				if ((trial.valid.type == 'button') 
					|| ((trial.valid.type == 'key') && (info.key !== trial.valid.val)) ) {
					// Store responses keys and RTs until confirm key is not pressed    
					responseTimes.push(info.rt);
					var nt = responseTimes.length;
					
					if (nt === 1){
						responseTypingTimes.push(0);
					}else{
						responseTypingTimes.push(info.rt - responseTimes[nt-2])
					};
					responseKeys.push(info.key);
					//responseChars = responseChars + String.fromCharCode(info.key).toLowerCase();
				}
				if ((trial.valid.type == 'key') && (info.key == trial.valid.val)) {
					end_trial();
				}
            };
			
			// Recall instruction if time_limit is reached (6000 ms)
			// To do properly, the key to press to validate the response should be as 
			// input arguments and the limit recall time as well
			if (show_instr==1) {
				var t3 = setTimeout(function() {
					// Set position (relative to input div location and height)
					//var marg = $inpdiv.position().top + $inpdiv.height() + 20;
					var $instr = $('<p/>')
						.addClass('recall')
						//.css('position', 'relative')
						//.css('top', marg)
						//.css('left', $inpdiv.position().left + 20)
						.html("Rappel : appuyer sur Entrée pour valider la réponse");					
					display_element.append($instr);
				}, 50000);
				setTimeoutHandlers.push(t3);
			}
			

			// hide text if timing is set
			if (trial.timing_stim > 0) {
				var t1 = setTimeout(function() {
					$('#jspsych-txt-disp').css('visibility', 'hidden');
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
