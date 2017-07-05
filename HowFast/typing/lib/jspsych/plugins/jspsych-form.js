/**
* jspsych-form -- jsPsych plugin for AppReg experiment
* Adapted from jspsych-survey-text plugin 
*
* Input parameters :
* -----------------
*
* Each form row is defined by an object with parameters :
* 
* --- type : kind of response choice to display : 
*			'text' : input text field
*			'radio' : radio button (a unique choice amongst several)
			'checkbox' : check box choices
			'list' : choice in the drop-down menu
*
* --- idname : identification string to retrieve the associated answer in the jspsych recorded data
*
* --- quest : the question asked to the user
*
* --- visible_if : option to display the element only if other previous elements are selected : array with the id name of the required selected elements

* Choice list for 'radio', 'checkbox' or 'list' type
* --- opt_str : array of option string to display		
* --- opt_id : array of associated identification strings to retrieve the answer in jspsych data
*
* If type is 'checkbox' :
* --- checklim :  maximum allowed answers for checkbox list	
*
* If type is 'text':
* --- input_nchar : width of the input text field in number of characters
*
* Each row element is append to an array to define the whole form page that will be created 
* by this plugin.
*
* Example of form page definition :
*
* 	// Definition of the rows (one object = one form row)
*	var form_elmt = [
*		{
*		type : "radio",	
*		idname : "manual",
*		quest : "Your handedness : ",
*		radio_str : ["left", "right"],
*		radio_id : ["left", "right"]
*		},						
*		{
*		type: "text",	
*		idname: "age",  
*		quest: "Your age :", 
*		input_nchar: 3 
*		},	
*		{
*		type: "radio",
*		idname: "anyprob",
*		quest: "Have you encountered any problem during the experiment ?",
*		radio_str : ["yes", "no"],
*		radio_id : ["prob_yes", "prob_no"]
*		},
*		{
*		type: "text",
*		idname: "anywhich",
*		quest: "Which kind ?",
*		input_nchar: 30,
*		visible_if : ["prob_yes"]
*		},
*		{
*		type: "checkbox",
*		idname: "kb_func",
*		quest: "What is your main activity (max. 2 choices) ?",
*		opt_str: ["note taken", "copy", "composition", "email", "instant messaging"],
*		opt_id: ["kbfunc_note", "kbfunc_copy", "kbfunc_compo", "kbfunc_email", *"kbfunc_chat"],
*		checklim: 2
*		},
*		{
*		type: "radio",
*		idname: "othmed_smartphone",
*		quest: "Do you use a smartphone ?",
*		opt_str: ["yes", "no"],
*		opt_id: ["othmed_smart_yes", "othmed_smart_no"]
*		},
*		{
*		type: "list",
*		idname: "othmed_smart_year",
*		quest: "From how many years ?",
*		opt_str : ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15 yrs and more"],
*		opt_id : ["smyr_1","smyr_2","smyr_3","smyr_4","smyr_5","smyr_6","smyr_7",
*		"smyr_8","smyr_9","smyr_10","smyr_11","smyr_12", "smyr_13","smyr_14","smyr_15"],
*		visible_if : ["othmed_smart_yes"]
*		}
*		];
*				
*		// Block definition (as a jspsych object)
*		var form_block = {
*			type: "form",
*			form_struct: form_elmt,
*			preamble : "Some informations to finish :",
*			submit : "Submit"
*		};
*
*
* TO DO : for conditional answer, remove value if trigger choice is finally uncheck 
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2016-12-13 christelle.zielinski@blri.fr
**/

(function($) {
	
	jsPsych['form'] = (function() {

		var plugin = {};

		plugin.create = function(params) {
			
			// Check for form_struct parameters 		
			var formi = params.form_struct;		
			var formf = [];
			var allidcond = [];
			
			for (var i = 0 ; i < formi.length ; i++){
				
				var fip = formi[i];
				// Type of form element : 'text', 'radio', 'checkbox' or 'list'
				var typ = (typeof fip.type == 'undefined') ? "text" : fip.type;
				// Unique id for each element
				var idn = (typeof fip.idname == 'undefined')  ? "Q"+i : fip.idname;
				// Question
				var qstr = (typeof fip.quest == 'undefined') ? "" : fip.quest;
				
				// Number of character for input text area
				var nch = (typeof fip.input_nchar == 'undefined') ? 20 : fip.input_nchar;
				
				// Choice list for radio, checkbox or list
				var ostr = (typeof fip.opt_str == 'undefined') ? "" : fip.opt_str;
				var oid = (typeof fip.opt_id == 'undefined') ? "" : fip.opt_id;
				
				// Add maximum allowed answer for checkbox list
				var nmax = (typeof fip.checklim == 'undefined') ? 0 : fip.checklim;
				
				// visible option : display the element only if other previous element is checked
				var ishid = (typeof fip.visible_if == 'undefined') ? false : true;
				var condvis = (typeof fip.visible_if == 'undefined') ? [] : fip.visible_if;
				
				if (ishid == true) {
					for (var ic = 0 ; ic < condvis.length ; ic++){
						if ($.inArray(condvis[ic], allidcond) == -1){
							allidcond.push(condvis[ic]);
						}
					}
				}
				// Add special class to the row that are hidden and will be only visible when the previous 
				// option whith optid id 
				var strclass = "";
				for (var k = 0 ; k < condvis.length ; k++) {
					strclass += "cond_" + condvis[k] + " ";
					if (k == condvis.length-1){
						strclass += "hiderow";
					}
				}
					
				if ( (typ == "text" && qstr !="") || (typ == "radio" && ostr !="") 
					|| (typ == "list" && ostr !="")  || (typ == "checkbox" && ostr !="")){
					formf.push({
					type : typ,
					idname : idn,
					quest : qstr,
					inpwidth : Math.floor(nch*0.7), 
					optstr : ostr,
					optid : oid,
					ncblim : nmax,
					ishidden : ishid,
					visible_if : condvis,
					condclass : strclass
					});
				}
				/* The number of character nchar is used to defined the width of
				 of the input text field, which is expressed in em units. One em 
				 corresponds to	height of a Ç",being about 130% higher than its width.*/

			}
			/** Parse formf optid to add onchange function if required
			(to remove class of hidden elements) **/
			// For each form row with otpions, built a vector with the same length as the options number
			// and 1 if "onchange" function to add, 0 otherwise
			
			for (var j = 0 ; j < formf.length ; j++) {
				var fel = formf[j];
				var Nopt = fel.optid.length;
				// Array to know if an onchange function has to be associated with the option				
				var optfunc = [];
				for (var io = 0 ; io < Nopt ; io++) {
					if ($.inArray(fel.optid[io], allidcond) > -1){
						optfunc.push(1);
					}else{
						optfunc.push(0);
					}
				}
				formf[j].optfunc = optfunc;	
			}
			
			var trials =[{
				preamble : (typeof params.preamble == 'undefined') ? "" : params.preamble,
				form_element : formf,
				nrow : formf.length,
				submit : (typeof params.submit == 'undefined') ? "Submit" : params.submit,
				progbar : (typeof params.progbarstr === 'undefined') ? "" : params.progbarstr
			}];

			return trials;
		};

		plugin.trial = function(display_element, trial) {
			
			// Evaluates the function if any
			trial = jsPsych.pluginAPI.evaluateFunctionParameters(trial); //NEW
			//	trial = jsPsych.pluginAPI.normalizeTrialVariables(trial);
			
			/**------ DISPLAY THE FORM **/
			
			// Special function to add onclick event to option that involved new form rows to be
			// hidden or visible depending on the user's option choice (conditionnal rows)
			function addoptfunc(isfunc, $opt) {
				if (isfunc === 1) {	
					// Add onclick event to the body - each time something is selected, check 
					// if the radio button value that implies to show or hide conditional class 
					// is selected or not
					// Get the radio name (same for each radio related to the same question)
					var rnam = $opt.attr('name');
					var idtrig = $opt.attr('id');
					$opt.click( function(){	
						$(".cond_" + idtrig).removeClass("hiderow");
						
						$('[name='+ rnam + ']' ).each( function(){
							var idopt = $(this).attr('id');
							$(this).click(function(){
								if ($('#'+idtrig).is(":checked") == true){
									$(".cond_" + idtrig).removeClass("hiderow");
								}else{
									$(".cond_" + idtrig).addClass("hiderow");
								}
							});
						});					
				

					});
				}
				return $opt;
			}
			
			/** FORM DIV AND PREAMBULE **/
			
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
				.addClass("form_div");	
				
			display_element.append($formdiv);
			
			
			/** FORM QUESTIONS AND OPTIONS **/
			// Add questions, input aeras and radio buttons
			for (var i = 0; i < trial.nrow; i++) {
				var elm = trial.form_element[i];
				
				/** INPUT TEXT TYPE **/
				if (elm.type == 'text') {
					
					// Add question (label)
					var $txt_quest = $('<label/>')
						.attr("for",elm.idname)
						.addClass("form_col")
						.addClass(elm.condclass)
						.html(elm.quest);

					// Add input area
					var $txt_inp = $('<input/>')
						.attr("type", elm.type)
						.attr("id", elm.idname)
						.attr("name", elm.idname)
						.attr("style", "width:" + elm.inpwidth +"em")
						.addClass(elm.condclass)
						.addClass("form_resp");	
						
					$('#theform').append($txt_quest, $txt_inp);	
				} 

				/** RADIO TYPE **/
				if (elm.type == 'radio') {
					
					// Question as span element
					var $quest =  $('<span/>')
						.addClass("form_col")
						.html(elm.quest)
						.addClass(elm.condclass);	
					
					$('#theform').append($quest);
	
					for (var j = 0 ; j < elm.optstr.length ; j++) {
						
						// Labels for each options
						var $opt_lab = $('<label/>')
							.attr("id", "lab" + elm.optid[j])
							.attr("for", elm.optid[j])
							.html(elm.optstr[j])
							.addClass(elm.type +"_lab")
							.addClass(elm.condclass);	
						
						// And associated button or checkbox
						var $opt_inp = $('<input/>')
							.attr("type", elm.type)
							.attr("id", elm.optid[j])
							.attr("name", elm.idname)
							.attr("value", elm.optid[j])
							.addClass(elm.type + "_but")
							.addClass(elm.condclass)
							.addClass("form_resp");	

						$opt_inp = addoptfunc(elm.optfunc[j], $opt_inp);
						
						$('#theform').append($opt_lab);
						$('#lab' + elm.optid[j]).prepend($opt_inp);
						// Prepend to have radio in the left
					}
				}
				
				/** CHECKBOX TYPE **/
				// Checkbox type
				if (elm.type == 'checkbox') {
					// Question as span element
					var $quest =  $('<span/>')
						.addClass("form_col")
						.html(elm.quest)
						.addClass(elm.condclass);
						
					$('#theform').append($quest);
					
					for (var j = 0 ; j < elm.optstr.length ; j++) {
						
						// Label definition
						var $opt_lab = $('<label/>')
							.addClass("checkbox_lab")
							.attr("for", elm.optid[j]) 
							.html(elm.optstr[j])
							.addClass(elm.condclass);	
							
						// Checkbox definition
						var $opt_inp = $('<input/>')
							.attr("type", elm.type)
							.attr("id", elm.optid[j])
							.attr("name", elm.idname)
							.attr("value", elm.optid[j])
							.addClass(elm.condclass)
							.addClass("form_resp");								
							
						$opt_inp = addoptfunc(elm.optfunc[j], $opt_inp);							
							
						// Add the two in a div to ensure no splitting between the two
						// in css : display: inline-block;
						var $spanlab = $('<span/>')
							.addClass("checkbox_cont");
							
						$spanlab.append($opt_inp, $opt_lab);
						
						$('#theform').append($spanlab);						
					}
					// Attach maximum allowed choices
					// jaredhoyt's answer in http://stackoverflow.com/questions/10458924/limit-checked-checkbox-in-a-form
					if (elm.ncblim > 0){					
						var checkboxes = $('input[name=' + elm.idname + ']');
						var max = elm.ncblim;
						checkboxes.change(function(){
								var current = checkboxes.filter(':checked').length;
								checkboxes.filter(':not(:checked)').prop('disabled', current >= max);
							});
					}
				}
				
				// List type
				if (elm.type == 'list') {
					
					// Question as span element
					var $quest =  $('<span/>')
						.addClass("form_col")
						.html(elm.quest)
						.addClass(elm.condclass);	
					
					$('#theform').append($quest);
					
					var $list_sel = $('<select/>')
						.attr("name", elm.idname)
						.attr("id", "list_" + elm.idname)
						.addClass(elm.condclass);
						
					$('#theform').append($list_sel);
					
					// List choices
					// Add a first one "Choix" (if selected after submit, indicating that nothing had been selected)
						
					var $list_opt = $('<option/>')
						.attr("value", "no_selection")
						.html("Sélectionner")
						.addClass(elm.condclass);
					
					$('#list_'+ elm.idname).append($list_opt);						
					
					for (var j = 0 ; j < elm.optstr.length ; j++) {
						
						var $list_opt = $('<option/>')
							.attr("value", elm.optid[j])
							.attr("id", elm.optid[j])
							.html(elm.optstr[j])
							.addClass(elm.condclass);
							
						$list_opt = addoptfunc(elm.optfunc[j], $list_opt);
						
						$('#list_'+ elm.idname).append($list_opt);	

					}

				}
				
				$('#theform').append("<br />");
			}
			
			// Add submit button
			var $subm = $('<div />').attr('id',"subbut").addClass("form_subbutton");
			$('#theform').append($subm);
			
			var $but = $('<button />')
					.attr("type", "button")
					.attr("id","submit")
					.html(trial.submit);
					
			$('#subbut').append($but);
			
		  
			/**------ PARSE THE RESPONSES AFTER SUBMIT BUTTON CLICK **/
			
			$("#submit").click( function() {
				// Measure response time
				var endTime = (new Date()).getTime();
				var response_time = endTime - startTime;
				


				// Add hidden input for elements of type "select" (list) to hold the selected value
				$("#theform select").each( function(index) {	
					var fname = $(this).attr("name"); 
					var val = $(this).val();
					
					var $selinput = $('<input/>')
						.attr("type", "hidden")
						.attr("name", fname)
						.attr("value", val)
						.addClass("form_resp");
						
					$("#theform").append($selinput);
				});
				
				// Create object to hold responses
				var form_data = {};	
				
				// Parse all input fields, store associated NAME (as "name") and VALUES	
				// Restrict to form_resp class only to avoid AdWare / SpyWare data inclusion (hidden input..)				
				$(".form_resp").each( function(index) {
					/* $(this) -> Selects the current HTML element */
					var intyp = $(this).attr("type");
					var fname = $(this).attr("name"); 
					var val = $(this).val();
					if ((typeof form_data[fname] == "undefined") && (intyp != "checkbox")){
						// Initialized
						form_data[fname] = "NA";		
					}						
					// Input text field or selected element or radio button : a unique answer 
					// to add to the field with the name value of the form_data object
					// For radio element, keep value only if checked
					if (( intyp == "text") || (intyp == "hidden") || ((intyp == "radio") && ($(this).is(":checked") == true))) {

						if (val==""){
							val = "NA";
						}
						form_data[fname] = val;
					}
					// Special case for checkbox type because several element (with the same "name" attribute)
					// could by checked
					if (intyp == "checkbox") {
						if ($(this).is(":checked") == true){
							form_data[val] = 1;
						}else{
							form_data[val] = 0;
						}
						/*// Check for previous inputs
						if (form_data[fname] == "NA") {
							// Initialize
							form_data[fname] = [];
							form_data[fname][0] = val;
						}else{
							form_data[fname].push(val);
						}	
							*/
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