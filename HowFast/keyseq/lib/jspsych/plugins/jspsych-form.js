/**
 * jspsych-form
* A jspsych plugin for displaying one form page with 
* free input texts and/or radio-button choices
*
*
* Adapted from jspsych-survey-text plugin 
*
* Input parameters :
* -----------------
* --- type : kind of response to display : 'text' or 'radio'
*			'text' : the user can give free answer in the input text field
*			'radio' : the user selects a unique answer amongst options ((by clicking on the radio button)
*
* --- idname : identification string to retrieve the associated answer in the jspsych recorded data
*
* --- quest : the question asked to the user
*
* If type is 'text':
* --- input_nchar : width of the input text field in number of characters
*
* If type is 'radio' :
* --- radiostr : option strings to display close to each radio button
* --- radioid : identification string to retrieve the answer in jspsych data
*
* One row is diplayed on the survey page per sub-element of the block structure :
* Example of block definition in the experiment HTML file :
*
* 		// Definition of the rows
*		var form_elmt = new Array(
*			{
*			type : "radio",	
*			idname : "manual",
*			quest : "Your handedness : ",
*			radio_str : ["left", "right"],
*			radio_id : ["left", "right"]
*			},						
*			{
*			type: "text",	
*			idname: "age",  
*			quest: "Your age :", 
*			input_nchar: 3  
*			},	
*			{
*			type: "radio",
*			idname: "anyprob",
*			quest: "Have you encountered any problem during the experiment ?",
*			radio_str : ["yes", "no"],
*			radio_id : ["prob_yes", "prob_no"]
*			},
*			{
*			type: "text",
*			idname: "anywhich",
*			quest: "If yes, which kind ?",
*			input_nchar: 30
*			}
*		);
*		
*		// Block definition (as a jspsych object)
*		var form_block = {
*			type: "form",
*			form_struct: form_elmt,
*			preamble : function(){
*				return putProgressBarStr(Npbar,Npbar) + "Some informations pour finir :"
*				},
*			submit : "Valider"
*		};
*
*		
* CREx--BLRI--AMU--2015
* https://github.com/chris-zielinski/Online_experiments_jsPsych
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
*/

(function($) {
	
	jsPsych['form'] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			//	params = jsPsych.pluginAPI.enforceArray(params, ['data']);
			
			// Check for form_struct parameters 
		
			var formi = params.form_struct;
			
			var formf = new Array ();

			for (var i = 0 ; i < formi.length ; i++){
				
				var fip = formi[i];
				
				var typ = typeof fip.type == 'undefined'  ? "text" : fip.type;
				var idn = typeof fip.idname == 'undefined'  ? "Q"+i : fip.idname;
				var qstr = typeof fip.quest == 'undefined'  ? "" : fip.quest;
				var nch = typeof fip.input_nchar == 'undefined' ? 20 : fip.input_nchar;
				var rstr = typeof fip.radio_str == 'undefined'  ? "" : fip.radio_str;
				var rid = typeof fip.radio_id == 'undefined'  ? "" : fip.radio_id;
				
				if ( (typ == "text" && qstr !="") || (typ == "radio" && rstr !="") ){
					formf.push({
					type : typ,
					idname : idn,
					quest : qstr,
					inpwidth : Math.floor(nch*0.7), 
					radiostr : rstr,
					radioid : rid
					});
				}
				/* The number of character nchar is used to defined the width of
				 of the input text field, which is expressed in em units. One em 
				 corresponds to	height of a Ç",being about 130% higher than its width.*/

			}
		
			var trials = new Array (1);
			
			trials[0] = {
				preamble : typeof params.preamble == 'undefined' ? "" : params.preamble,
				form_element : formf,
				nrow : formf.length,
				submit : typeof params.submit == 'undefined' ? "Submit" : params.submit
			};

			return trials;
		};

		plugin.trial = function(display_element, trial) {
			
			// Evaluates the function if any
			 trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial); //NEW
			//	trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);
			
			// Clear the display
			display_element.html(' ');
			
			// Show preamble text
			var $prbdiv = $('<div/>')
				.attr('id',"preamb")
				.html(trial.preamble)
				.addClass("form_preamble");	
				
			display_element.append($prbdiv);

			var $formdiv = $('<div/>')
				.attr('id',"theform")
				.addClass("form_div");	
				
			display_element.append($formdiv);
			
			// Add questions, input aeras and radio buttons
			for (var i = 0; i < trial.nrow; i++) {
				elm = trial.form_element[i];

				// Input text
				if (elm.type == 'text') {
					
					// Add question (label)
					var $qdiv = $('<label/>')
						.attr("for",elm.idname)
						.addClass("form_col")
						.html(elm.quest);	
											
					$('#theform').append($qdiv);
					
					// $('#theform').append("<br />");
					
					// Add input area
					var $inpdiv = $('<input/>')
						.attr({
							type: elm.type,
							id: elm.idname,
							name: elm.idname,
							style: "width:" + elm.inpwidth +"em"
						});	
						
					$('#theform').append($inpdiv);	
				}

				// Radio type
				if (elm.type == 'radio') {
					
					// Add question (span)
					var $qrdiv = $('<span/>')
						.addClass("form_col")
						.html(elm.quest);	
						
					$('#theform').append($qrdiv);
					// $('#theform').append("<br />");
					
					for (var j = 0 ; j < elm.radiostr.length ; j++) {
						
						// Add radio labels
						var $rlabdiv = $('<label/>')
							.attr('id', "lab" + elm.radioid[j])
							.attr("for", elm.radioid[j])
							.html(elm.radiostr[j]);	
						
						$('#theform').append($rlabdiv);
						
						// And associated radio button
						var $rinpdiv = $('<input/>')
							.attr("type", elm.type)
							.attr('id', elm.radioid[j])
							.attr("name", elm.idname)
							.addClass("radio_but")
							.attr("value", elm.radioid[j]);	
						
						$('#lab' + elm.radioid[j]).append($rinpdiv);	
						/* // If you want first radio to be checked by default 
						if (j==0) {
							$('#'+elm.radioid[j]).attr("checked", true);
						}	*/
					}
				}
				
				$('#theform').append("<br /><br />");
			}
			
			// Add submit button
			var $subm = $('<div />').attr('id',"subbut").addClass("form_subbutton");
			$('#theform').append($subm);
			
			var $but = $('<button />')
					.attr("type", "button")
					.attr("id","submit")
					.html(trial.submit);
					
			$('#subbut').append($but);
			
		  
			$("#submit").click( function() {
				// Measure response time
				var endTime = (new Date()).getTime();
				var response_time = endTime - startTime;
				
	// $("#jspsych-survey-text-" + i).append('<input type="text" name="#jspsych-survey-text-response-' + i + '"></input>');

				// Create object to hold responses
				var form_data = {};

				
				$("input").each( function(index) {
					/* $(this) -> Selects the current HTML element */
					inpok = false;
					if ($(this).attr("type") == "text") {
						inpok = true;
					}
					if ($(this).attr("type") == "radio") {
						if ($(this).is(":checked") == true) {
							inpok = true;
						}	
					}
					if (inpok) {
						var id = $(this).attr("name"); 
						var val = $(this).val();
						var obje = {};
						obje[id] = val;
						$.extend(form_data, obje);
					}
				});

				// save data
				jsPsych.data.write({
					"rt": response_time,
					"responses": JSON.stringify(form_data)
				});

				display_element.html('');

				// next trial
				jsPsych.finishTrial();
			});

			var startTime = (new Date()).getTime();
		};

		return plugin;
	})();
})(jQuery);