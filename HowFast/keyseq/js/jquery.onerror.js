(function( $ ){
  $.fn.jsErrorHandler = function(options) {
  	
	var settings = {
		from: "support@howfast-keyseq.com",
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



