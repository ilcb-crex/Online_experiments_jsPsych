/** 
* Add new methods to jsPsych object for CREx experiments
*
* jsPsych.getSubjectID
* jsPsych.prepareProgressBar
* jsPsych.typingFeedbackBlock
*
*
*
* jsPsych documentation: docs.jspsych.org
* de Leeuw, J. R. (2014). jsPsych: A JavaScript library for creating behavioral 
* experiments in a Web browser. Behavior research methods, 1-12
*
* CREx-BLRI-AMU
* https://github.com/blri/Online_experiments_jsPsych
* 2016-12-13 christelle.zielinski@blri.fr
**/

/** subject_ID */
jsPsych.getSubjectID = (function() {
	
	/* Define subject ID (based on an accurate start date - millisecond order precision) */
	function datestr(sdat) {
		function formatstr(num, dignum){
			dignum = (typeof dignum =='undefined') ? 2 : dignum;
			var numstr = num.toString();
			if (numstr.length < dignum) {
				for (var j = 0 ; j < dignum - numstr.length ; j++) {				
					numstr = "0" + numstr;
				}
			}
			return numstr;
		}
		var sy = sdat.getFullYear();
		var smo = formatstr(sdat.getMonth()+1);
		var sda = formatstr(sdat.getDate());
		var sho = formatstr(sdat.getHours());
		var smi = formatstr(sdat.getMinutes());
		var sse = formatstr(sdat.getSeconds());
		var sms = formatstr(sdat.getMilliseconds(), 3);
		var strdat = sy + smo + sda + "_" + sho + smi + sse + "_" + sms;
		
		return strdat ;
	}

	return 'ID_' + datestr(new Date());
});

/** progress bar */
// Parse experiment structures array
// Add progress bar HTML code when "progbar" field is found in experiment structure
jsPsych.prepareProgressBar = function(expobj) {
	/* Global number of experiment part - for drawing progress bar */
	//var Npbar = 8;
	/* Function to draw progress bar */
	function putProgressBarStr(istep, Nstep){
		// Parse number of element with progress bar inside			
		var prop = istep / Nstep;
		var strpbar = "<div id='progressbar-wrap'><p id='progressbar-wrap-txt'>Progression globale</p>"+
						"<div id='progressbar-container'><div id='progressbar-inner' style='width:" + (prop*100) + "%'><p>Etape " + istep + "/"+ Nstep + "</p></div></div></div>"; //Math.round(prop*100) + "%
		return strpbar;
	}

	// parseProgressBar
	// [1] Count the total number of required progress bar
	// Total number
	var Nbar = 0;
	// Array of indices of expobj where putProgressBarStr is called
	var ibararr = []; 
	
	for (var j = 0 ; j < expobj.length ; j++) {
		// Search for Xbar occurrence
		// Should only occurs inside text or preambule field
		// Doing as we don't know apriori
		var subobj = expobj[j];
		if (subobj.progbar !== undefined){
			if (subobj.progbar == true){
				Nbar = Nbar + 1;
				ibararr.push(j);
			}
		}
	}

	// [2] Now add progress bar HTML string
	for (var k = 0 ; k < ibararr.length ; k++) {			
		expobj[ibararr[k]]["progbarstr"] = putProgressBarStr(k+1, Nbar);
	}
	return expobj;
};

/** Function for feedback typing times */
jsPsych.typingFeedbackBlock = function(trialtyp_names, Nsubpart) {
	
	// Check for input paramaters
	if (typeof Nsubpart === 'undefined' || Nsubpart === null){
		var Nsubpart = 1;
	}

	
	/* Convert input trialtyp_names in array - inspire by jspsych.pluginAPI.enforcearray()*/
	// To allow mixing typing-times from different kinds of blocks 
	var ckArray = Array.isArray || function(a) {
		return toString.call(a) == '[object Array]';
	};

	if (typeof trialtyp_names !== 'undefined') {
		trialtyp_names = ckArray(trialtyp_names) ? trialtyp_names : [trialtyp_names];
	}

	/** Use a set of functions : */
	/*------ Convert string array to array of numbers */
	function str2arr(strdata){
		/* Remove brackets before spliting*/			
		strdata = strdata.substring(1, strdata.length - 1);
		var spstr = strdata.split(",");			
		var numArray = [];
		var k = 0;		
		for (var i = 0; i < spstr.length ; i++) {
			numArray[k] = parseInt(spstr[i]);
			k++;
		}
		return numArray;
	};
			
	/**--- Compute average typing time and percentage of matching answers */ 
	function getSeqSummary(trials) {
		
		// Initialize
		
		// Typing time value (regardless answer validity)
		var tt_all = {nb: 0, 	// Total number of typing times 
					sum: 0}; 		// Sum of typing times
		
		// Typing time values (only for matching answers)
		var tt_val = {nb: 0,  // Total number
					sum: 0};  // Sum

		// Total number of trial with valid flag == 1
		var valcount = 0;
		
		var Nt = trials.length;
		for (var i = 0; i < Nt; i++) {
			
			if (typeof trials[i].vld === 'undefined'){
				var valflag = 1;
			}else{
				var valflag = trials[i].vld;
			}
			
			/* Typing time are return as a string array by jsPsych.data.getTrialsOfType */
			var vtt = str2arr(trials[i].tt); // Fonction to convert string to number array
			
			for (var j = 0; j < vtt.length; j++) {				
				if (vtt[j] > 0) {
					tt_all.sum = tt_all.sum + vtt[j];
					tt_all.nb = tt_all.nb + 1;
					if( valflag==1 ){
						valcount = valcount + 1;
						tt_val.sum = tt_val.sum + vtt[j];
						tt_val.nb = tt_val.nb + 1;
					}
				}
			}	
		}
		
		// Compute the averages

		// Initialize
		var valid_perc = 0; // Percent of matching answers	
		var avgtt_val = -1; 	// Average typing time including those with matching answers only 
		var avgtt_all = -1; // Average typing time regardless answer validity		
		
		// Percent
		if (Nt > 0) { 	// trials object may be empty
			valid_perc = Math.round(100 * valcount / Nt);
		}		
		
		// Average typing time for matching answers only
		if (tt_val.nb > 0) { // Number of valid response could be 0 
			avgtt_val = Math.floor(tt_val.sum / tt_val.nb);
		}
		
		// Average typing time regardless validity
		if (tt_all.nb > 0){
			avgtt_all = Math.floor(tt_all.sum / tt_all.nb);
		}
		return {valid_perc: valid_perc, avgtt_val: avgtt_val, avgtt_all: avgtt_all, nb_trials: Nt};
	};
	
	/*------ Store all the trials of type trialtyp in the 2D array trialblocks */
	/* The trials of the same block are gathered together in the same line of trialblock array */
	function getBlocksOfTrials(trialtyp){
		
		/* All trials currently store by jsPsych */
		var alltrials = [];
		for (var i = 0 ; i < trialtyp.length ; i++){
			var trialpart = jsPsych.data.getTrialsOfType(trialtyp[i]);
			if (trialpart.length > 0){
				alltrials = alltrials.concat(trialpart);
			}
		}
		
		/* Gather trials of the same block together according to trial_index_global */
		/* A block is assuming containing trials with successive trial_index_global */
		
		var trialblocks = [];
		var tnum = [];
		if (alltrials.length > 0) {
			trialblocks[0] = [alltrials[0]];
			kb = 0;
			
			var prevtig = alltrials[0].iG;
			tnum[0] = prevtig;
			
			for (var i = 1; i < alltrials.length; i++) {
			  var tig = alltrials[i].iG;
			  if (tig == prevtig + 1 ) { 
				// Same block
				trialblocks[kb].push(alltrials[i]);
			  }else{
				// A new block
				kb = kb + 1 ;
				trialblocks[kb] = [alltrials[i]];
				tnum[kb] = tig;
			  }
			  prevtig = tig;
			}	
		}
		// Check for blocks order
		
		if (trialblocks.length > 1){
			var tempblocks = trialblocks.slice(0); // Deep copy ("WTF?")
			var sortnum = tnum.slice(0); // Deep copy ("WTF?")
			sortnum.sort(function(a, b) { return a - b; });
			for (var i = 0; i < sortnum.length ; i++){
				var ib = tnum.indexOf(sortnum[i]);
				trialblocks[i] = tempblocks[ib];	
			}
		}
		return trialblocks;	
	};
	
	/*------ Get all summary values per block */
	function getAllSeqBlockSummary(trialtyp) {

		var trialblocks = getBlocksOfTrials(trialtyp);
		
		// Initialize
		var blocksummary = [];

		// Loop through the blocks			
		for (var k = 0 ; k < trialblocks.length ; k++) {
			blocksummary.push(getSeqSummary(trialblocks[k]));				
			
		}
		return blocksummary;
	};
	
	/*------- Put values associated to the same property in the same array */ 
	/* Assuming objarr an array, each element being an object with the same field names*/
	function concatObjArr(objarr){
		// Get object properties names
		var prop = Object.keys(objarr[0]);
		/* Store values of each object of objarr in the same array*/
		/* Initialize */
		var concobjarr = {}; // New object with properties listed in prop variable
		for (var i = 0 ; i < objarr.length ; i++){
			for (var j = 0 ; j < prop.length ; j++) {
			// Initialize
				if (i==0) {
					concobjarr[prop[j]] = [];	
				}
				concobjarr[prop[j]][i] = objarr[i][prop[j]];
			}
		
		}
		return concobjarr;	
	}
	
	// Number of sub-sections of each sequence 
	// var Nsub = 2; // Global variable
	
	/**--- Name for the current block**/
	/* According to general index of the restitution block*/
	function keyseq_block_info(iblock, Nsub){
		// Index of block begins by 0
		iblock = iblock + 1;
		
		var r = iblock % Nsub;

		// Number of the general part
		var ipart = Math.ceil(iblock / Nsub);


		if (r>0) {
			var isub = iblock - (ipart-1)*Nsub;
		}else{
			var isub = Nsub;
		}
		var genalpha = String.fromCharCode(ipart+64);
		if (Nsub > 1) {
			var partstr = genalpha + "-"+ isub;
		}else{
			var partstr = genalpha;
		}
		var blockinfo = {
			general_part : genalpha,
			current_subpart : isub,
			idstr : partstr,
			total_subpart : Nsub
		};
		return blockinfo;
	}

	/**--- CSS class to define the score div color of the block (red, grey or green)*/
	function score_class(colorflag, Nblocks) {

		// Initialize class names array
		var cnames = {	
				avgtt: [], 
				vperc: []};

		for (var k = 0 ; k < Nblocks ; k++){
			if((Nblocks == 1) && (colorflag)){
				cnames["avgtt"][k] = "best_score";
				cnames["vperc"][k] = "best_score";
			}else{
				cnames["avgtt"][k] = "middle_score";
				cnames["vperc"][k] = "middle_score";
			 }
		}

		// Find the best and worst scores indices
		if ((colorflag) && (Nblocks > 1)){					
			// Find the first best and last worst average typing times
			// Index of the minimum typing time
			var ib_tt = avgtt_val.reduce(function(iMin,x,i,a) {return (x > 0 && x < a[iMin]) ? i : iMin;}, 0); 
			// -1 value if no congruent sequence 
			// Index of the maximum typing time
			var iw_tt = avgtt_val.reduce(function(iMax,x,i,a) {return x >= a[iMax] ? i : iMax;}, 0);
			// Associated css class name
			cnames["avgtt"][ib_tt] = "best_score";
			cnames["avgtt"][iw_tt] = "worst_score";
			
			// Find the first best and last worst percentage of valid responses
			// Index of the maximum percentage
			var ib_vp = vperc.reduce(function(iMax,x,i,a) {return x > a[iMax] ? i : iMax;}, 0);
			// Index of the last minimum percentage
			var iw_vp = vperc.reduce(function(iMin,x,i,a) {return x <= a[iMin] ? i : iMin;}, 0); 	
			// If same percentage for all blocks, change all the class names
			/*if (vperc[ib_vp] == vperc[iw_vp]){
				var cstr = vperc[ib_vp] < 55 ? "worst_score" : "best_score";
				for (var k = 0 ; k < Nk ; k++){
					classnames["vperc"][k] = cstr;
				}
			}else{ 
				classnames["vperc"][ib_vp] = "best_score";
				classnames["vperc"][iw_vp] = "worst_score";						
			}*/
			cnames["vperc"][ib_vp] = "best_score";
			if (vperc[ib_vp] == vperc[iw_vp]){
				cnames["vperc"][iw_vp] = "middle_score";
			}else{ 
				cnames["vperc"][iw_vp] = "worst_score";						
			}					
		}
		return cnames;
	}
	
	/**--- Score div strings */
	function keyseq_score_div(){
		var bsumm = getAllSeqBlockSummary(trialtyp_names);
		/* Total number of proceeded blocks, for the moment*/
		var Nk = bsumm.length;
		
		var concsumm = concatObjArr(bsumm);
		var avgtt_val = concsumm["avgtt_val"];
		var avgtt_all = concsumm["avgtt_all"];
		var vperc =  concsumm["valid_perc"];
		
		// Flag to adjust color as a fonction of score obtained toward the parties
		var adjcol = false;
		// Define class name array (allow to change color of scores per bloc
		var cnames = score_class(adjcol, Nk);
	
		// Construct string with all the blocks summaries
		var stt_val = "<div class='scorerow'>";
		var stt_all = "<div class='scorerow'>";
		var sperc = "<div class='scorerow'>";
		
		/* Transform in word / minute  6.e4 / (5*IKIm) */
		// for typing (howfast) experiment 'hf_exp.html'
		
		for (var i = 0; i < Nk; i++) {
			avgtt_all[i] = Math.round(60000/(5*avgtt_all[i]));
		}
		
		// Change values to 0 if "-1" is found (== no record)
		for (var i = 0; i < Nk; i++) {			
			if (avgtt_val[i] < 0) {
				avgtt_val[i] = 0;
			}
			if (avgtt_all[i] < 0){
				avgtt_all[i] = 0;
			}
		}
		
		// Build the score labels
		//---- Associated with the previous block first
		for (var k = 0 ; k < Nk - 1 ; k++){	
			var strp = keyseq_block_info(k, Nsubpart).idstr; 
			var sparty = "Partie [" + strp + "] : ";
			stt_val = stt_val + 
					"<div class='score " + cnames["avgtt"][k] + "'>" +
					sparty + 
					avgtt_val[k] + 
					"</div>";
					
			stt_all = stt_all + 
					"<div class='score " + cnames["avgtt"][k] + "'>" +
					sparty + 
					avgtt_all[k] + 
					"</div>";		
					
			sperc = sperc + 
					"<div class='score " + cnames["vperc"][k] + "'>" +
					sparty + 
					vperc[k] + "%</div>";
		}	
		
		//---- For the current block "Partie [Nk] :" in bold
		icur = Nk -1;
		var strp = keyseq_block_info(icur, Nsubpart).idstr; 
		var sparty = "Partie [" + strp + "] : ";
		
		stt_val = stt_val + "<div class='score " + cnames["avgtt"][icur] + "'>" +
					"<b>" + sparty + 
					avgtt_val[Nk-1] + 
					"</b></div>";
		
		stt_all = stt_all + "<div class='score " + cnames["avgtt"][icur] + "'>" +
					"<b>" + sparty + 
					avgtt_all[icur] + "</b></div>";
					
		sperc = sperc + "<div class='score " + cnames["vperc"][icur] + "'>" +
					"<b>" + sparty +
					vperc[icur] + "%</b></div>";
		
		stt_val = stt_val + "</div>";
		stt_all = stt_all + "</div>";
		sperc = sperc + "</div>";
		return {stt_val: stt_val, stt_all: stt_all, sperc: sperc};
	}
	
	var seq_debrief_block = {
		type: "text",
		text: function() {

			var scorediv = keyseq_score_div();
			return 	"<div width=65%><div class='large'><p>Résumé des parties :</p></div> "+
					"<p class='small'><b>Vitesse de frappe moyenne en mots par minute : </b></p>" +
					scorediv.stt_all +
					"<br /><p>Appuyez sur une touche pour continuer !</p></div>"+
					"<div class='fb_info'><p>Pour info : </p><p>a) Les vitesses moyennes observées pour la copie de texte sont de 33 mots par minutes (mpm), et de 50 à 70 mpm pour un dactylographe professionnel, voire 120 pour les meilleurs.</p><p>b) L'estimation de votre vitesse se fait ici sans tenir compte des erreurs de frappe.</p></div>";
		},
		timing_post_trial: 1000
	};
	
	return seq_debrief_block;
}; 
	

