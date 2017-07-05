/** Big object to define the form pages **/

/* Define all sub-objects first*/


/* ------------------------- General overview */
//var form_blocks = function(npbar_ini, npbar_tot){
function define_form_blocks(){			// npbar_ini, npbar_tot

	var kbcur = {
				type: "radio",
				idname: "kbcur",
				quest: "Le clavier que vous venez d'utiliser : ",
				opt_str : ["azerty", "qwerty", "azerty modifié en qwerty", "qwerty modifié en azerty"],
				opt_id : ["kbcur_az", "kbcur_qw", "kbcur_az2qw", "kbcur_qw2az"]
				};
				
	var age = {
				type: "text",
				idname: "age",
				quest: "Votre âge :",
				input_nchar: 3
				};
				
	var gender = {
				type : "radio",
				idname : "gender",
				quest : "Vous êtes :",
				opt_str : ["une femme", "un homme"],
				opt_id : ["female", "male"]
				};
				
	var handed = [
				{
				type : "radio",
				idname : "handedness",
				quest : "Latéralité présumée : ",
				opt_str : ["gaucher", "droitier", "ambidextre"],
				opt_id : ["manu_left", "manu_right", "manu_ambi"]
				},
				{
				type : "radio",
				idname : "hand_wrt",
				quest : "Main utilisée pour écrire au stylo : ",
				opt_str : ["gauche", "droite"],
				opt_id : ["ambi_left", "ambi_right"]
				}];
				
	var educ = [
				{
				type : "list",
				idname : "educlevel",
				quest : "Votre niveau d'étude (ou équivalent) :",
				opt_str : ["Pré-Bac", "Bac", "Licence (Bac+3)", "Master (Bac+5)", "Doctorat (Bac+8)"],
				opt_id : ["studlev_prebac_1", "studlev_bac_2", "studlev_licence_3", "studlev_master_4", "studlev_doctorat_5"]
				},			

				{
				type : "radio",
				idname : "student",
				quest : "Etes-vous étudiant ?",
				opt_str : ["oui", "non"],
				opt_id : ["student_yes", "student_no"]
				},	
				
				{
				type : "list",
				idname : "study_domain",
				quest : "Dans quelle section ?",
				opt_str : ["Droit, Economie, Gestion", "Lettres & Sciences Humaines", "Sciences, Médecine, Pharmacie"],
				opt_id : ["studom_DEG_1", "studom_LSH_2", "studom_SMP_3"],
				visible_if : ["student_yes"]
				},	

				{
				type : "list",
				idname : "study_year",
				quest : "En quelle année d'étude :",
				opt_str : ["L1", "L2", "L3", "M1", "M2", "Doctorat"],
				opt_id : ["studyr_L1_1", "studyr_L2_2", "studyr_L3_3", "studyr_M1_4", "studyr_M2_15", "studyr_D_6"],
				visible_if : ["student_yes"]
				},
				
				{
				type : "radio",
				idname : "study_notetaking",
				quest : "Prise de notes habituelle :",
				opt_str : ["sur clavier", "à la main"],
				opt_id : ["studnote_kb", "studnote_hand"],
				visible_if : ["student_yes"]
				}
				
				];	

	var language = [

				{
				type : "radio",
				idname : "lang_native",
				quest : "Votre langue maternelle : ",
				opt_str : ["français", "autre"],
				opt_id : ["langnat_fr", "langnat_oth"]
				},
				
				{
				type : "text",
				idname : "lang_natother",
				quest : "Si autre, précisez :",
				input_nchar: 20,
				visible_if : ["langnat_oth"]
				},
				
				{
				type : "radio",
				idname : "lang_other",
				quest : "Parlez-vous couramment (au moins) une autre langue ?",
				opt_str : ["oui", "non"],
				opt_id : ["langoth_yes", "langoth_no"]
				},
				
				{
				type : "radio",
				idname : "ortho",
				quest : "Avez-vous déjà été suivi(e) par un orthophoniste pour des problèmes d'apprentissage du langage ?",
				opt_str : ["oui", "non"],
				opt_id : ["ortho_yes", "ortho_no"]
				},
				
				{
				type : "list",
				idname : "ortho_why",
				quest : "Pour quelle(s) raison(s) ?",
				opt_str : ["langage écrit", "langage oral", "les deux", "autre"],
				opt_id : ["ortho_writ", "ortho_spok", "ortho_both", "ortho_oth"],
				visible_if : ["ortho_yes"]
				}
				];
	var music = [			
				{
				type : "radio",
				idname : "musician",
				quest : "Etes-vous musicien ?",
				opt_str : ["oui", "non"],
				opt_id : ["music_yes", "music_no"]
				},

				{
				type : "text",
				idname : "musician_instru",
				quest : "Quel(s) instrument(s) ?",
				input_nchar: 50,
				visible_if : ["music_yes"]
				}	
				];
				
			
	/* --------------------------About keyboard typing */
	var kb_typing = [
				{
				type: "radio",
				idname: "kb_user",
				quest: "Ecrivez-vous régulièrement sur un clavier ?",
				opt_str : ["oui", "non"],
				opt_id : ["kb_yes", "kb_no"]
				},
				{
				type: "checkbox",
				idname: "kb_material",
				quest: "Sur quel(s) support(s) ?",
				opt_str: ["ordinateur fixe", "ordinateur portable", "tablette"],
				opt_id: ["kb_fixpc", "kb_labtop", "kb_tablet"]
				},

				{
				type : "list",
				idname : "kb_pctime",
				quest : "Au total, combien de temps par jour passez-vous sur un ordinateur ou une tablette ?",
				opt_str : ["0 heure", "1 heure", "2 heures", "3 heures", "4 heures", "5 heures", "6 heures", "7 heures", "8 heures", "9 heures", "10 heures", "11 heures", "12 heures", "13 heures", "14 heures", "15 heures", "16 heures", "17 heures", "18 heures", "19 heures", "20 heures", "21 heures", "22 heures", "23 heures", "24 heures"],
				opt_id : ["kbpc_0", "kbpc_1", "kbpc_2", "kbpc_3", "kbpc_4",	"kbpc_5", "kbpc_6", "kbpc_7", "kbpc_8", "kbpc_9", "kbpc_10", "kbpc_11", "kbpc_12", "kbpc_13", "kbpc_14", "kbpc_15", "kbpc_16", "kbpc_17", "kbpc_18", "kbpc_19", "kbpc_20", "kbpc_21", "kbpc_22", "kbpc_23", "kbpc_24"]
				},	
				
				{
				type : "list",
				idname : "kb_time",
				quest : "Quel pourcentage de ce temps passez-vous à <b>tapez du texte</b> ?",
				opt_str : ["0%", "10%", "20%", "30%", "40%", "50%", "60%", "70%", "80%", "90%", "100%"],
				opt_id : ["kbdur_0", "kbdur_10", "kbdur_20", "kbdur_30", "kbdur_40", "kbdur_50",
						"kbdur_60", "kbdur_70", "kbdur_80", "kbdur_90", "kbdur_100"]
				},	

				{
				type: "checkbox",
				idname: "kb_func",
				quest: "Quelle est votre type d'activité principale (2 choix au maximum) ?",
				opt_str: ["prise de notes", "copie", "composition", "email", "discussion instantanée"],
				opt_id: ["kbfunc_note", "kbfunc_copy", "kbfunc_compo", "kbfunc_email", "kbfunc_chat"],
				checklim: 2
				},
				
				{
				type: "radio",
				idname: "kb_learn",
				quest: "Comment avez-vous appris à taper au clavier ?",
				opt_str : ["seul(e)", "avec une formation"],
				opt_id : ["kblearn_auto", "kblearn_train"]
				},

				{
				type : "list",
				idname : "kb_years",
				quest : "Depuis combien d’années environ tapez-vous au clavier ?",
				opt_str : ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20",
						"21","22","23","24","25","26","27","28","29","30","31","32","33","34","35","36","37","38","39","40 ans et +"],
				opt_id : ["kbyr_1","kbyr_2","kbyr_3","kbyr_4","kbyr_5","kbyr_6","kbyr_7","kbyr_8","kbyr_9","kbyr_10",
				"kbyr_11","kbyr_12", "kbyr_13","kbyr_14","kbyr_15","kbyr_16","kbyr_17","kbyr_18","kbyr_19","kbyr_20",
				"kbyr_21","kbyr_22","kbyr_23", "kbyr_24","kbyr_25","kbyr_26","kbyr_27","kbyr_28","kbyr_29","kbyr_30",
				"kbyr_31","kbyr_32","kbyr_33","kbyr_34", "kbyr_35","kbyr_36","kbyr_37","kbyr_38","kbyr_39","kbyr_40"]
				},	

				{
				type: "radio",
				idname: "kb_handwatch",
				quest: "Regardez-vous vos mains en tapant au clavier ?",
				opt_str : ["jamais", "rarement", "souvent", "toujours"],
				opt_id : ["kbhand_never_0", "kbhand_rarely_1", "kbhand_often_2", "kbhand_always_5"]
				},	
				
				{
				type: "radio",
				idname: "kb_improve",
				quest: "Avez-vous déjà essayé d'améliorer significativement vos performances de frappe (par exemple en essayant d'aller plus vite, d'utiliser plus de doigts, etc.) ?",
				opt_str : ["oui", "non"],
				opt_id : ["kbimp_yes", "kbimp_no"]
				},

				{
				type: "radio",
				idname: "kb_other",
				quest: "Avez-vous d’autres expériences substantielles que le clavier AZERTY (séjours à l’étranger, utilisation d’un autre type de clavier) ?",
				opt_str : ["oui", "non"],
				opt_id : ["kbother_yes", "kbother_no"]
				}			
			];
	/*----------------------------------------- Writing on other medium */		
	var other_medium = [
				{
				type : "list",
				idname : "othmed_dur",
				quest : "Au total, combien de temps par jour passez-vous à écrire sur un autre support "+
					"(<b>temps d'écriture seulement</b>) : ",
				opt_str : ["0 minute", "10 minutes", "20 minutes", "30 minutes", "40 minutes", "50 minutes", "1 heure", "2 heures", "3 heures", "4 heures", "5 heures", "6 heures", "7 heures", "8 heures", "9 heures", "10 heures", "11 heures", "12 heures", "13 heures", "14 heures", "15 heures", "16 heures", "17 heures", "18 heures", "19 heures", "20 heures", "21 heures", "22 heures", "23 heures", "24 heures"],
				opt_id : ["othdur_0", "othdur_10m", "othdur_20m", "othdur_30m", "othdur_40m", "othdur_50m", "othdur_1", "othdur_2", "othdur_3", "othdur_4",	"othdur_5", "othdur_6", "othdur_7", "othdur_8", "othdur_9", "othdur_10", "othdur_11", "othdur_12", "othdur_13", "othdur_14", "othdur_15", "othdur_16", "othdur_17", "othdur_18", "othdur_19", "othdur_20", "othdur_21", "othdur_22", "othdur_23", "othdur_24"]
				},	
				
				{
				type: "radio",
				idname: "othmed_smartphone",
				quest: "Utilisez-vous un téléphone de type smartphone ?",
				opt_str: ["oui", "non"],
				opt_id: ["othmed_smart_yes", "othmed_smart_no"]
				},
				
				{
				type: "list",
				idname: "othmed_smart_year",
				quest: "Depuis combien d'années ?",
				opt_str : ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15 ans et +"],
				opt_id : ["smyr_1","smyr_2","smyr_3","smyr_4","smyr_5","smyr_6","smyr_7","smyr_8","smyr_9","smyr_10","smyr_11","smyr_12", "smyr_13","smyr_14","smyr_15"],
				visible_if : ["othmed_smart_yes"]
				},
				
				{
				type: "radio",
				idname: "othmed_kb",
				quest: "Sur votre téléphone, utilisez-vous un clavier :",
				opt_str : ["AZERTY", "autre (ex. pavé numérique)"],
				opt_id : ["othmed_kb_azerty", "othmed_kb_other"]
				},
				
				{
				type: "radio",
				idname: "othmed_phon",
				quest: 'Ecriture phonétique (ex. "a 2m1") ?',
				opt_str : ["oui", "non"],
				opt_id : ["othmed_phon_yes", "othmed_phon_no"]
				}
				
		/*		{
				type: "radio",
				idname: "othmed_swype",
				quest: 'Utilisation du SWYPE ?',
				opt_str : ["Oui", "Non"],
				opt_id : ["othmed_swype_yes", "othmed_swype_no"]
				},			
				{
				type : "text",
				idname : "othmed_sms",
				quest : "Estimation du nombre de SMS écrit par jour : ",
				input_nchar: 4
				}*/
				
				];

	var handwritten = {
				type: "list",
				idname: "handwrt_dur",
				quest: "Estimation du temps total d'<b>écriture manuscrite</b> par jour : ",
				opt_str :  ["0 minute", "10 minutes", "20 minutes", "30 minutes", "40 minutes", "50 minutes", "1 heure", "2 heures", "3 heures", "4 heures", "5 heures", "6 heures", "7 heures", "8 heures", "9 heures", "10 heures", "11 heures", "12 heures", "13 heures", "14 heures", "15 heures", "16 heures", "17 heures", "18 heures", "19 heures", "20 heures", "21 heures", "22 heures", "23 heures", "24 heures"],
				opt_id : ["hdwdur_0", "hdwdur_10m", "hdwdur_20m", "hdwdur_30m", "hdwdur_40m", "hdwdur_50m","hdwdur_1", "hdwdur_2", "hdwdur_3", "hdwdur_4",	"hdwdur_5", "hdwdur_6", "hdwdur_7", "hdwdur_8", "hdwdur_9", "hdwdur_10", "hdwdur_11", "hdwdur_12", "hdwdur_13", "hdwdur_14", "hdwdur_15", "hdwdur_16", "hdwdur_17", "hdwdur_18", "hdwdur_19", "hdwdur_20", "hdwdur_21", "hdwdur_22", "hdwdur_23", "hdwdur_24"]
				};

	var wrt_comments = [ 
				{
				type: "radio",
				idname: "is_writcom",
				quest: "Avez-vous des remarques concernant votre pratique de l'écriture (numérique ou manuscrite) ? ",
				opt_str : ["oui", "non"],
				opt_id : ["wcom_yes", "wcom_no"]
				},
				{
				type: "text",
				idname: "writing_comments",
				quest: "Lesquelles ? ",
				input_nchar: 50,
				visible_if : ["wcom_yes"]
				}
				];
				
	var exp_problem = [
				{
				type: "radio",
				idname: "exp_prob",
				quest: "Avez-vous rencontré un problème pendant l'expérience en ligne ?",
				opt_str : ["oui", "non"],
				opt_id : ["prob_yes", "prob_no"]
				},
				{
				type: "text",
				idname: "exp_prob_which",
				quest: "Lequel ?",
				input_nchar: 50,
				visible_if : ["prob_yes"]
				}
				];
				
	// Special form page with selection of the fingers
	// Use splice method to insert it in form_block
	
	// Need a specific plugin to display the special form (checkbox + image conditionnelle)
	var fingstr = ['pouce', 'index', 'majeur', 'annulaire', 'auriculaire',
					'pouce', 'index', 'majeur', 'annulaire', 'auriculaire'];
	var fingid = ['pog','ing','mag','ang','aug','pod','ind','mad','and','aud'];
	var form_fingers = {
		type: 'form-fingers',
		progbar: false, 
		idname: "finger_choices",
		quest: "Sélectionner les doigts utilisés pour écrire sur le clavier :",
		img_background: "img/form/hf_fing_bg.png",
		img_maskpart : "img/form/hf_fing_",
		opt_str: fingstr,
		opt_id: fingid
	};	

	/* ================= Big form object */	
	var iniarr = [];
	var hf_form = [
		{
			preamble: "Quelques informations pour finir :",
			elements: iniarr.concat(kbcur, age, gender, handed, educ)	
		},	
		{
			preamble: " ",
			elements: iniarr.concat(language, music)
		},	
		
		{
			preamble: "<p> Au sujet de votre frappe sur clavier (Ordinateur, Tablette) :</p>" +
						"<p style='font-size:16px'><i>Cette partie concerne uniquement votre utilisation "+
						"d'<b>ordinateur ou tablette (avec clavier virtuel)</b>, l'écriture sur smartphone sera abordée dans la partie suivante.</i></p>",
			elements: iniarr.concat(kb_typing)
		},	
		
		{
			preamble: "Pratique de l'écriture sur un autre support (téléphone portable, smartphone) :",
			elements: iniarr.concat(other_medium)
		},	
		{
			preamble: "Pratique de l'écriture manuscrite :",
			elements: iniarr.concat(handwritten)
		},
		{
			preamble: "Et enfin :",
			elements: iniarr.concat(wrt_comments, exp_problem)		
		}
		];
		
	/*** Define ALL FORM BLOCKS*/

	var Npages = hf_form.length;
	var form_blocks = new Array(Npages);
	var g = 0;
	for (var i = 0; i < Npages ; i++) {
		if (i==3){
			g = g +1;
		};
		
		if (i==0){
			var pbar = true;
		}else{
			var pbar = false;
		}
		form_blocks[i] = {
			type: "form",
			preamble: hf_form[i].preamble,
			progbar: pbar,
			form_struct: hf_form[i].elements,
			submit: "Valider"
		};
		g = g + 1;
	}
	// Add form_finger at the 3th position (& remove 0 items of the ionitial array)
	// With JavaScript array splice method :
	form_blocks.splice(3, 0, form_fingers);
	
	return form_blocks;
};