/** Script to launch the WhichBrowser tool 
detect.php file path on the server has to be set in the s.scr variable (last line)
detect.php is inside the WhichBrowser library directory
*/
(function(){var p=[],w=window,d=document,e=f=0;p.push('ua='+encodeURIComponent(navigator.userAgent));e|=w.ActiveXObject?1:0;e|=w.opera?2:0;e|=w.chrome?4:0; e|='getBoxObjectFor' in d || 'mozInnerScreenX' in w?8:0;e|=('WebKitCSSMatrix' in w||'WebKitPoint' in w||'webkitStorageInfo' in w||'webkitURL' in w)?16:0; e|=(e&16&&({}.toString).toString().indexOf("\n")===-1)?32:0;p.push('e='+e);f|='sandbox' in d.createElement('iframe')?1:0;f|='WebSocket' in w?2:0; f|=w.Worker?4:0;f|=w.applicationCache?8:0;f|=w.history && history.pushState?16:0;f|=d.documentElement.webkitRequestFullScreen?32:0;f|='FileReader' in w?64:0; p.push('f='+f);p.push('r='+Math.random().toString(36).substring(7));p.push('w='+screen.width);p.push('h='+screen.height);var s=d.createElement('script'); 
s.src='http://howfast.lpl-aix.fr/lib/whichbrowser/detect.php?' + p.join('&');d.getElementsByTagName('head')[0].appendChild(s);})();

// ===> Set the full server path towards detect.php file of the WichBrowser library - Add the "?" character at the end of the path
// http://chris.zielinski.free.fr/typing/lib/whichbrowser/detect.php?
// 'http://www.cogsci.nl/czielinski/typing/lib/whichbrowser/detect.php?'