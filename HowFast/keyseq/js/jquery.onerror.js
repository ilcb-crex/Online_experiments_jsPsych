/** Spy to get JavaScript error that is occuring in the user's browser
https://github.com/posabsolute/jQuery-Error-Handler-Plugin

Set your e-mail address inside jserrorhandler.php script

* CREx--BLRI--AMU--2016
* https://github.com/chris-zielinski/Online_experiments_jsPsych
*/

(function( $ ){
  $.fn.jsErrorHandler = function(options) {
  	
	var settings = {
		from: "support@howfast-typing.com",
		website: document.domain
	}
	if (options) $.extend(settings, options);

 
    window.onerror = function (msg, url, line) {
					/* Add an error message to the page */
				var emsg	= "<span class='large'><p>Merci d'avoir bien voulu participer !</p>"+
							"<p>L'expérience ne se lance malheureusement pas correctement depuis votre navigateur.</p>"+
							"<p>Un rapport d'erreur a été envoyé... </p>"+
							"<p>N'hésitez pas à retenter plus tard ! </p> </span>";
				$("body").html(emsg);
		$.ajax({
			type:"GET",
			cache:false,
			url:"jserrorhandler.php",
			data: $.param({'message':msg, 'url': url, userAgent: navigator.userAgent, 'line': line, 'from':settings.from, 'website': settings.website}),
			success: function(test){

				
				if(window.console) console.log("Report sent about the javascript error")
			}
		})
		

		
	    return true;
		
	}
	

  };
})( jQuery );



