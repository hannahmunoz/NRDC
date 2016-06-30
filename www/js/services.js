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


// factory: sync
// fucntion(s): 
//		create
//		read

.factory ('sync', function($q, $http){

// function:		create
// purpose: post request to http link 
// var: string (url), JSON
// return: empty JSON upon success
	function create (JSON){
	}	

// function: read
// purpose:  retreive info from http link 
// var: string (url)
// return: filled JSON upon success
	var read = function (url, syncedJSON, title, JSON){
		return $http.get (url)
			.then (function Success (response){
				console.log (url + " " + response.status +": " + response.statusText);
					syncedJSON = response.data;
				for (var i = 0; i < syncedJSON[title+'s'].length; i++){
					JSON [syncedJSON[title+'s'][i][title]] =  syncedJSON[title+'s'][i]['Name']; 
				}
				return response.data;
			}, function Error (response){
				console.debug (url + " " + response.status +": "+ response.statusText);
				return response.statusText;
			});


	}	
	
	return{read: read};
})


// factory: Camera
// function(s): 
//		checkPermissions
// 		setOptions
//		openCamera
//		convertToBase64
.factory('Camera', function($base64) {

// function: checkPermissions
// purpose:  checks and asks for camera permissions
// var: n/a
// return: n/a
	function checkPermissions (){
		// add event listener
      document.addEventListener("deviceready", onDeviceReady, false);

      // wait for device to be ready
      function onDeviceReady() {
      	// check if camera permissions have been requested
    	cordova.plugins.diagnostic.isCameraAuthorized(function(authorized){
    	console.log("App is " + (authorized ? "authorized" : "denied") + " access to camera");
    		// if not, request access
    	if (!authorized){
			cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
            console.log("Successfully requested camera authorization: authorization was " + status);
        }, function(error){
            console.error(error);
        	});
		}
		}, function(error){
    		console.error("The following error occurred: "+ error);
		});
	}
	}

// function: setOptions
// purpose:  set the parameters for the camera options 
// var: source type (camera or image gallery)
// return: camera options
	function setOptions (source){
		var cameraOption = {
			quality: 100,
			allowEdit: false,
			sourceType: source,
			destinationType: Camera.DestinationType.DATA_URL,
			encodingType: Camera.EncodingType.JPEG,
			mediaType: Camera.MediaType.PICTURE,
			correctOrientation: true
		};
		return cameraOption;
	}

// function: openCamera
// purpose:  opens the camera and take the picture
// var: n/a
// return: n/a (eventually will return the encoded image)
	function openCamera() {
		document.addEventListener ("deviceready", function(){

    	var options = setOptions(Camera.PictureSourceType.CAMERA);

		navigator.camera.getPicture(function onSuccess (imageData){
				 var image = "data:image/jpeg;base64," + imageData;
				return image;
			}, function onFail(error){
				console.debug("Camera Error: " + error, "app");
			}, options);
	})
}

// function: openGallery
// purpose:  opens the gallery to select a picture
// var: n/a
// return: n/a (eventually will return the encoded image)
	function openGallery() {
		document.addEventListener ("deviceready", function(){
			var options = setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);

    		navigator.camera.getPicture(function cameraSuccess(imageData) {
				 var image = "data:image/jpeg;base64," + imageData;
				return image;
    		}, function cameraError(error) {
        	console.debug("Gallery Error: " + error, "app");
    	}, options);
	})

}

// return values
	return {checkPermissions: checkPermissions,
			setOptions: setOptions,
			openCamera: openCamera,
			openGallery: openGallery,
		};

})

.factory ('DynamicPage', function(){
	var title = null;
	var route = null;
	var JSON = null;

	return {getTitle: function(){return title;},
			setTitle: function(newTitle){ title = newTitle;},
			getRoute: function(){return route;} ,
			setRoute: function(newRoute){ route = newRoute;},
			setJSON: function(newJSON){JSON = newJSON;},
			getJSON: function(){return JSON;}};
})

.factory ('ObjectCounter', function(){
	function count (object){
		var i = 0;
		for (var x in object){
			if (object.hasOwnProperty (x)){
				i++;
			}
		}
		return i;
	}

	return{count: count};
})

// factory: GPS
// function(s): 
//		checkPermissions
// 		setOptions
//		openCamera
//		convertToBase64
.factory('GPS', function() {

// function: checkPermission
// 	purpose: checks and asks for permission to access gps
// 	var: n/a
//	return: n/a
	function checkPermissions(){
		//check if location is enabled
		cordova.plugins.diagnostic.isLocationAuthorized(function(enabled){
    		console.log("Location authorization is " + (enabled ? "enabled" : "disabled"));
    		   if (!enabled){
			cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
            console.log("Successfully requested location authorization: authorization was " + status);
		}, function(error){
    		console.error("The following error occurred: "+ error);
		});
	}}, function(error){
    	console.error("The following error occurred: "+error);
	});
	}

	function getLocation(JSON){

		navigator.geolocation.getCurrentPosition(function onSuccess (position){
  			JSON ['Longitude'] = position.coords.longitude;
  			JSON ['Latitude'] = position.coords.latitude;
  			JSON ['Altitude'] = position.coords.altitude;
		}, function onError(){
        console.debug ('GPS error code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
		}, { enableHighAccuracy: true });
	}

	return{checkPermissions: checkPermissions,
		   getLocation: getLocation};
	})


.factory ('File',function($cordovaFile){
	function createDirectory(){
		document.addEventListener ("deviceready", function(){
			$cordovaFile.checkDir (cordova.file.dataDirectory,'/NRDC').then (function (success){
				console.log (success);
		},function (error){
			if (error.code == 1){
				$cordovaFile.createDir (cordova.file.dataDirectory,'/NRDC', false);	
			}
			})
		})
	}
	return {createDirectory: createDirectory}

});