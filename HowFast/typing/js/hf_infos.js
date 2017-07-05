var legal = { 
	title: "Mentions légales",
	text: [
		"Ce site a été conçu pour le projet de recherche mené par des personnels d'<a target='_blank' href='http://www.univ-amu.fr/'>Aix-Marseille Université</a>.",
		"<span class='important'>Identification</span> AMU (LPC, LNC, BLRI) - Adresse : 3 Place Victor Hugo, 13003 Marseille, France - Téléphone : +33(0)4.13.55.09.68 - Courriel : marieke.longcamp(at)univ-amu.fr ",
		"<span class='important'>Conception et réalisation</span> Aix-Marseille Université - F.-X Alario<sup>1</sup>, M. Longcamp<sup>2</sup>, S. Pinet<sup>1</sup>, C. Zielinski<sup>3</sup> (<sup>1</sup><a target='_blank' href='http://lpc.univ-amu.fr/'>Laboratoire de Psychologie Cognitive</a> ; <sup>2</sup><a target='_blank' href='http://lnc.univ-amu.fr/'>Laboratoire de Neurosciences Cognitives</a> ; <sup>3</sup><a target='_blank' href='http://www.blri.fr/'>Brain and Language Research Institute</a>)",
		"<span class='important'>Responsable de la publication</span> Marieke Longcamp",
		"<span class='important'>Hébergement</span> Serveur BLRI administré par Cyril Deniaud (Laboratoire Parole et Langage, Aix-en-Provence, AMU)"]
};

var ethic = { 
	title: "Éthique",
	text: [
		"Cette expérience a été validée par le <a target='_blank' href='http://recherche.univ-amu.fr/fr/la-recherche/organisation-politique/comite-dethique-daix-marseille-universite'>comité d'éthique d'Aix-Marseille Université</a> en date du 28 Novembre 2016."]
};

var anonym = {
	title: "Anonymat",
	text: [	
		"Les données collectées sont <b>anonymes</b>, c'est-à-dire qu'elles ne contiennent aucune information permettant de vous identifier (vos nom et prénom, adresse physique et IP demeurent inconnus).",
		"La liste des données collectées est :"+ 
		"<ul><li style='list-style-type:square;'> la date de lancement de l'expérience depuis votre navigateur</li>"+
		"<li style='list-style-type:square;'> le type de navigateur (Firefox, Chrome, Opera) et sa version</li>"+
		"<li style='list-style-type:square;'> le système d'exploitation (Windows, Mac, Unix) et sa version</li>"+
		"<li style='list-style-type:square;'> les données de temps de frappe lors des 3 parties de copies de mots</li>"+
		"<li style='list-style-type:square;'> les données du questionnaire final</li></ul>",
		"Les réponses du formulaire final sont utilisées pour analyser les données (corrélations entre les mesures recueillies).", 
		"L'ensemble de ces données est stocké dans une base mySQL sur le serveur à l'aide d'un script PHP, à la toute fin de l'expérience. ",
		"L'accès aux pages de l'expérience n'engendre aucun dépôt de traceur (cookie) sur votre ordinateur.",
		"Ce site n'est pas déclaré à la CNIL car il ne recueille pas d'informations personnelles (« informations qui permettent, sous quelque forme que ce soit, directement ou non, l'identification des personnes physiques auxquelles elles s'appliquent » - article 4 de la loi n° 78-17 du 6 janvier 1978)."] /*,
		"La partie concernant le tirage au sort est totalement indépendante de la présente expérience. Aucun lien ne pourra être effectué entre la participation à l'expérience et votre inscription sur le site XX pour le tirage au sort."]*/
};

var consent = {
	title: "Consentement",
	text: ["En acceptant de lancer l'expérience, vous donnez votre consentement à l'enregistrement des données et à leur utilisation à des fins de recherche scientifique. Du fait qu'elles soient anonymes, il sera impossible de les supprimer a posteriori de la base de données. Vous pouvez à tout moment quitter l'expérience (les données ne sont enregistrées dans la base qu'à la toute fin de l'expérience)."]
};

var lucky = {
	title: "Tirage au sort",
	text: ["A l'issue de votre participation, un tirage au sort a lieu qui vous permettra peut-être de gagner 50€ (un gagnant tous les 50 participants). La méthode de tirage au sort garantit l'anonymat des données : aucun lien ne pourra être établi entre le gagnant et une entrée spécifique de la base de données. Le résultat du tirage s'affiche à la fin de l'expérience. Si vous êtes gagnant, un code unique vous sera alors attribué. Pour recevoir le prix, il vous sera demandé d'envoyer ce code par mail à l'adresse indiquée."]
};


var respon = {
	title: "Limitation de responsabilité",
	text: [
		"L'expérience est jouée par votre navigateur à l'aide du langage JavaScript, et en particulier de la librairie <a target='_blank' href='http://www.jspsych.org/'>jsPsych</a>. Ce langage est interprété par tous les navigateurs récents, il permet de rendre le contenu de la page dynamique – le contenu est modifié par votre navigateur directement, indépendamment du côté serveur. En aucun cas ce site ne pourra être tenu responsable de dommages matériels directs ou indirects liés à l'exécution de l'expérience par votre navigateur."]
};


var scripts = {
	title: "Outils & scripts",
	text: ["L'expérience a été développée à partir de la librairie <a target='_blank' href='http://www.jspsych.org/'>jsPsych</a>. "+  
		"Les dessins des touches de clavier ont été extraits depuis <a target='_blank' href='https://commons.wikimedia.org/wiki/File:Computer_keyboard_US.svg'>le fichier SVG de Wikimedia Commons</a>. "+
		"Le fond d'écran de la page d'accueil provient du site <a target='_blank' href='http://subtlepatterns.com/brick-wall/'>Subtle Patterns</a>. "+
		"Les barres de défilement ont été générées grâce au plugin <a target='_blank' href='http://manos.malihu.gr/jquery-custom-content-scroller/'>jQuery custom content scroller</a>."]
};


	
var allinfos = [ethic, anonym, consent, lucky, respon, legal, scripts];

function put_lines(textarr){
	var Np = textarr.length;
	var spar = "";
	for (var k = 0 ; k < Np ; k++){
		spar += "<p>" + textarr[k] + "</p>";
	}
	return spar;
}

function put_infos(infos){
	
	var Ni = infos.length;
	var infotext = "";
	for (var i=0; i < Ni; i++){
		
		var infopart = infos[i];
		infotext += "<div class='legal_title shabox'>" + infopart.title + "</div>";
		infotext += put_lines(infopart.text);
	}
	return infotext;	
}

var infotxt = put_infos(allinfos);