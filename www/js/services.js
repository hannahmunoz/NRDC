angular.module('app.services', ['base64'])

// factory: logger
// fucntion(s): log
// 		purpose: checks if log console is defined. If undefined, defines. prints to console.
// 		var: string 
//		return: log
.factory ('logger', function (){
	 function log (text){
		if (typeof console == "undefined") {
    		window.console = {
       		log: function () {}
   			};
		}
	console.log(text);
	}

	return {log: log};
})

.factory ('convertImage', function($base64){
	var imageData;
	function convert (file){
		imageData = $base64.encode (file);	
    	return imageData;
	}	
	
	return{convert: convert};
});