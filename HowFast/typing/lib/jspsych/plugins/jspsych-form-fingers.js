/**
* jspsych-form-fingers -- jsPsych plugin for AppReg experiment
* Adapted from jspsych-survey-text plugin 
*
* Very special form page to select the keyboard layout.
*
 *	preamble : potential preambule to display [default : ""]
	idname : global name of the form element [default : "Qspec_form"]
	quest : question associated to checkbox elements [default : ""]
 	img_background : path of background image (ex. 'img/form/hf_fing_bg.png')
	img_maskpart : partial path of mask image (ex. 'img/form/hf_fing_')
		Full paths are built from checkbox id strings and are supposed to be in png 
		So, image file name have to have the suffix matching with check_id strings
	check_str : checkbox labels (array of string) (ex. ["majeur gauche", "index gauche", "pouce droit"])
	check_id : id names associated with checkboxs (ex. ["maj", "ing", "pod"])
		When writing jspsych data, data object will show field with idname value and array of the check_id of the checked checkbox
	submit : text to display on the submit button [default : "Valider"]
	
 * Adapted from jspsych-survey-text plugin 
 * (Josh de Leeuw documentation: docs.jspsych.org)
 * by the CREx - 20150624
**/

(function($) {
	
	jsPsych['form-fingers'] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			//	params = jsPsych.pluginAPI.enforceArray(params, ['data']);
			
			// Check for input parameters 
			var preamb = (typeof params.preamble == 'undefined') ? "" : params.preamble;
			
			var idn = (typeof params.idname == 'undefined')  ? "Qspec_form" : params.idname;
			var qstr = (typeof params.quest == 'undefined')  ? "" : params.quest;
			
			var cstr = (typeof params.opt_str == 'undefined')  ? "" : params.opt_str;
			var cid = (typeof params.opt_id == 'undefined')  ? "" : params.opt_id;
			
			var subm = (typeof params.submit == 'undefined') ? "Valider" : params.submit;
			
			// Progress bar
			var pbar = (typeof params.progbarstr == 'undefined') ? "" : params.progbarstr;
			// Background image
			var imgbg = (typeof params.img_background == 'undefined') ?  "" : params.img_background;

			// Mask images paths
			// Partial path
			var imp = (typeof params.img_maskpart == 'undefined') ?  "" : params.img_maskpart; //'img/form/hf_fing_';	
			
			var trials = [];
			if ((imp != "") && (cstr !="") && (cid !="")){
				// Define mask img full paths
				// id of checkbox <=> suffix of mask images
				//['aug','ang','mag','ing','pog','aud','and','mad','ind','pod'];
				var imgmask = [];			
				// Full mask image paths
				for (var j = 0 ; j < cid.length ; j++){				
					imgmask[j] = imp + cid[j] + ".png";
				};	
				
				trials[0] = {
					preamble : preamb,
					progbar : pbar,
					idname : idn,
					quest : qstr,
					checkstr : cstr,
					checkid : cid,
					img_bg : imgbg,
					img_msk : imgmask,
					submit : subm
				};
			}
			return trials;
		};

		plugin.trial = function(display_element, trial) {
			
			// Evaluates the function if any
			 trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial); //NEW
			//	trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);
			
			/**------ DISPLAY THE FORM **/
			
			// Clear the display
			display_element.html(' ');
			
			// Add progress bar
			display_element.append(trial.progbar);
			
			// Show preamble text
			var $preamb = $('<div/>')
				.attr("id","preamb")
				.html(trial.preamble)
				.addClass("form_preamble");	
				
			display_element.append($preamb);

			var $formdiv = $('<div/>')
				.attr("id","theform")
				.css("text-align","center")
				.addClass("form_div center-content");	
				
			display_element.append($formdiv);
			
			// Add background image
			// "<div><img src=" + stimseq[0] +" width=55%></div>"			
			var $bg_img = $('<img/>')
				.addClass("fingerform_img")
				.attr("src", trial.img_bg);
			
			// $img_div.append($bg_img);
			display_element.append($bg_img);
			// Add all masks with 'hidden' property (they are supposed to be light)
			for (var i = 0 ; i < trial.img_msk.length ; i++){
				
				var $mask = $('<img/>')
					.addClass("fingerform_img")
					.attr("id", "msk_" + trial.checkid[i])
					.attr("src", trial.img_msk[i])
					.hide();
					
				// $img_div.append($mask);
				display_element.append($mask);
			}
			
			// Add questions and checkboxs
			
			// Checkbox type
			
				
			// Add question (span)
			var $cb_quest = $('<span/>')
				.addClass("large")
				.html(trial.quest);	
				
			$('#theform').append($cb_quest);
			$('#theform').append("<br /><br />");
			var hands = ['Main gauche : ', 'Main droite : '];
			for (var j = 0 ; j < trial.checkstr.length ; j++) {
				if (j==0) {
					var $handlab = $('<span/>')
						.addClass('large')
						.css({style: 'margin-right: 10px'})
						.html(hands[0]);
					$('#theform').append($handlab);
				}
				if (j==5) {
					var $handlab = $('<span/>')
						.addClass('large')
						.css({style: 'margin-right: 10px'})
						.html(hands[1]);
					$('#theform').append($handlab);
				}
				// Add checkbox
				var $cb_input = $('<input/>')
					.attr("type", "checkbox")
					.attr("id", trial.checkid[j])
					.attr("name", trial.idname)
					.attr("value", trial.checkid[j]);
					// .click(onclk(this));	
				
				$('#theform').append($cb_input);	
				
				// Add label

				var $cb_lab = $('<label/>')
					.addClass("checkbox_lab")
					.attr("for", trial.checkid[j]) 
					.html(trial.checkstr[j]);
					//.hover(hov_in, hov_out(this));
				
				$('#theform').append($cb_lab);	
				if (j==4){
					$('#theform').append("<br /><br />");
				}
			}
			
			// Add functions to input and label to display mask
			
			$(":checkbox").each( function() {
				
				// When click on checkbox input
				$(this).click(function (){
					if ($(this).is(":checked") == true){
						
						$("#msk_"+ $(this).attr('id')).show();
						
					}else{
						$("#msk_"+ $(this).attr('id')).hide();
					}

				});
				// When hover checkbox input
				$(this).hover(function (){
					$("#msk_"+ $(this).attr('id')).show();
					},
					function (){
						if ( $("#" + $(this).attr('id')).is(":checked") !== true ){
							$("#msk_"+ $(this).attr('id')).hide();
						}
				});
			});	

			// When hover checkbox label 
			$(".checkbox_lab").each( function() {
				$(this).hover(
					function (){
					$("#msk_"+ $(this).attr('for')).show();
					},
					
					function (){
						if ( $("#" + $(this).attr('for')).is(":checked") !== true ){
							$("#msk_"+ $(this).attr('for')).hide();
						}
					}
				);

			});
		
			// Increase width of labels (according to max width found)
			/*var maxwidth = 0;
			$(".checkbox_lab").each( function() {
			  //alert($(this).attr('id') + " " + $(this).width());
			  var w = $(this).width();
			  if (w > maxwidth) {
				maxwidth = w;
			  };
			  
			});
			$(".checkbox_lab").each(function(){$(this).width(maxwidth)}); 
			------------- seems not working label elements */
			
			$('#theform').append("<br /><br />");
			
			
			// Add submit button
			var $subm = $('<div />').attr('id',"subbut").addClass("form_subbutton form_fingers");
			$('#theform').append($subm);
			
			var $but = $('<button />')
					.attr("type", "button")
					.attr("id","submit")
					.html(trial.submit);
					
			$('#subbut').append($but);
			
			// Get the final position of the form_div
			var wform = $('#theform').height();
			var tform = $('#theform').position().top;
			var topos = wform + tform + 10;
			$(".fingerform_img").each( function(){
				$(this).css('top', topos);
			});
		
			
			/**------ PARSE THE RESPONSES AFTER SUBMIT BUTTON CLICK **/
			
			$("#submit").click( function() {
				// Measure response time
				var endTime = (new Date()).getTime();
				var response_time = endTime - startTime;
				
				// Create object to hold responses
				var form_data = {};	
				
				// Parse all input fields, store associated NAME (as "name") and VALUES				
				$("input").each( function() { // index as input ?
					/* $(this) -> Selects the current HTML element */
					var intyp = $(this).attr("type");
					var fname = $(this).attr("name"); 
					var val = $(this).val();
				/*	if (typeof form_data[fname] == "undefined"){
						// Initialized
						form_data[fname] = "NA";		
					}						
				*/
					// Special case for checkbox type because several element (with the same "name" attribute)
					// could by checked
					if (intyp == "checkbox") {
						if ($(this).is(":checked") == true){
							form_data[val] = 1;
						}else{
							form_data[val] = 0;
						}
					}
				});
							
				// save data				
				jsPsych.data.write({
					"rt": response_time,
					"responses": JSON.stringify(form_data),
					"type": "form"
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