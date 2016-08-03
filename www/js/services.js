angular.module('app.services', ['ionic','base64'])

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

.factory ('sync', function($q, $http, $cordovaFile, File, ObjectCounter){

// function:		create
// purpose: post request to http link 
// var: string (url), JSON
// return: empty JSON upon success

// function: read
// purpose:  retreive info from http link 
// var: string (url)
// return: filled JSON upon success
	function read (url, syncedJSON, title, JSON){
		var ret;
		config = {timeout: 10000};
		var promise = $q (function (resolve, reject){  $http.get (url, config)
			.then (function Success (response){
				console.log (url + " " + response.status +": " + response.statusText);
					syncedJSON = response.data;
				ret = response.data;
				resolve (response.data);
			}, function Error (response){
				File.readFile (title).then (function(success){
					syncedJSON = success
				ret = success;
				resolve (success);
				})
			})})
			return (promise.then (function (success){
				for (var i = 0; i < syncedJSON[title+'s'].length; i++){
				JSON [syncedJSON[title+'s'][i][title]] =  syncedJSON[title+'s'][i]['Name']; 
				}
				return ret;
			}));
	}	

	function post (url, JSON){

		return $q (function (resolve, reject){ 
			config = {timeout: 10000};
			$http.post (url, JSON, config).then (function Success (response){
				if (File.checkFile ('Unsynced').$$state.status == 1){
					$cordovaFile.removeFile (cordova.file.cacheDirectory, 'NRDC/Unsynced.txt');
				}
				resolve (response.status);
			//toast for successful post
				}, function Error (response){
				File.checkandWriteFile ('Unsynced', JSON);
				reject (response.status);
			//toast to tell user what happened
			})
		})
		// })
	}
	
	return{read: read,
		   post: post};
})


// factory: Camera
// function(s): 
//		checkPermissions
// 		setOptions
//		openCamera
//		convertToBase64
.factory('Camera', function($base64, $q, $cordovaCamera) {

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
		return $q (function (resolve, reject){ 
		document.addEventListener ("deviceready", function(){

    	var options = setOptions(Camera.PictureSourceType.CAMERA);

			navigator.camera.getPicture(function onSuccess (imageData){
				 var image =  imageData;
				resolve (image);
			}, function onFail(error){
				console.debug("Camera Error: " + error, "app");
				reject (null);
			}, options);
	})

	})
}

// function: openGallery
// purpose:  opens the gallery to select a picture
// var: n/a
// return: n/a (eventually will return the encoded image)
	function openGallery() {
			return $q (function (resolve, reject){
		document.addEventListener ("deviceready", function(){
			var options = setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);

    		navigator.camera.getPicture(function cameraSuccess(imageData) {
				 var image = imageData;
				resolve (image);
    		}, function cameraError(error) {
        	console.debug("Gallery Error: " + error, "app");
        	reject (null);
    	}, options);
	})
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
			getRoute: function(){return route;},
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
  			JSON ['Longitude'] = position.coords.longitude.toString();
  			JSON ['Latitude'] = position.coords.latitude.toString();
  			JSON ['Altitude'] = position.coords.altitude.toString();
		}, function onError(){
        console.debug ('GPS error code: '    + error.code    + '\n' +
              'message: ' + error.message + '\n');
		}, { enableHighAccuracy: true });
	}

	return{checkPermissions: checkPermissions,
		   getLocation: getLocation};
	})


.factory ('File', function($cordovaFile, $q){

	function createDirectory(){
		document.addEventListener ("deviceready", function(){
			$cordovaFile.checkDir (cordova.file.cacheDirectory,'NRDC').then (function (success){
		},function (error){
			if (error.code == 1){
				$cordovaFile.createDir (cordova.file.cacheDirectory,'NRDC', false);	
			}
			})
		})
	}

	function checkFile(title){
	return $q (function (resolve, reject){document.addEventListener ("deviceready",function(){
			 $cordovaFile.checkFile(cordova.file.cacheDirectory, 'NRDC/'+title+'.txt').then (function (success){
			 	resolve (success.isFile);
			 }, (function (error){
			 	reject (false);
			 }))
		})
	})
	}

	function createFile (title){
		document.addEventListener ("deviceready",function(){
			$cordovaFile.checkFile(cordova.file.cacheDirectory, 'NRDC/'+title+'.txt').then(function(success){
			},function(error){
					$cordovaFile.createFile (cordova.file.cacheDirectory, 'NRDC/'+title+'.txt',  true);
				})
		})
	}

	function checkandWriteFile (title, JSON){
		document.addEventListener ("deviceready",function(){
			
		$cordovaFile.checkFile(cordova.file.cacheDirectory, 'NRDC/'+title+'.txt').then(function(success){
			$cordovaFile.writeFile (cordova.file.cacheDirectory, 'NRDC/'+title+'.txt',JSON, true);
		},function(error){
		if (error.code == 1){
				$cordovaFile.writeFile (cordova.file.cacheDirectory, 'NRDC/'+title+'.txt', JSON,  true).then (function (){			});
					return error;
				}
		else{
			console.debug ("File Write Error: " + title + " " + error.code);
			}
		}
		)
	})}


	function readFile (title){
		return $q(function (resolve, reject){
			document.addEventListener ("deviceready", function(){
				$cordovaFile.checkFile(cordova.file.cacheDirectory, 'NRDC/'+ title +'.txt').then (function (result){
					 $cordovaFile.readAsText (cordova.file.cacheDirectory, 'NRDC/'+ title +'.txt').then (function (result){
						resolve (JSON.parse(result));
						}, function (error){
							console.debug("File Read Error:" + title + " " + error.code);
							reject (error);
						})
					}, function (error){
						console.debug ("File Error: " + title + " " + error.code);
						reject (error);
				})
		})
	})
	}
	
	return {createDirectory: createDirectory,
			checkFile: checkFile,
			createFile: createFile,
			checkandWriteFile: checkandWriteFile,
			readFile: readFile};

})

.factory ('SaveNew', function(uuid2){

	function save (type, isitNew, JSON, finalJSON, imageData, editFlag){


		JSON ["Modification Date"] = new Date();

		if (isitNew){
			JSON ["Creation Date"] = new Date();
			JSON ["Started Date"] = new Date();
			JSON ["Unique Identifier"] = uuid2.newuuid();
		}

		switch (type){
			case 'Networks':
				JSON ["Principal Investigator"] = parseInt (JSON ["Principal Investigator"]);
				break;

			case 'People':
				JSON ["Photo"] = imageData;
				break;

			case 'Sites':
				JSON ["Network"] = parseInt (JSON ["Network"]);
				JSON ["Permit Holder"] = parseInt (JSON ["Permit Holder"]);
				JSON ["Land Owner"] = parseInt (JSON ["Land Owner"]);
				JSON ["Landmark Photo"] = imageData;
				break;

			case 'Systems':
				JSON ["Manager"] = parseInt (JSON ["Manager"]);
				JSON ["Site"] = parseInt (JSON ["Site"]);
				JSON ["Photo"] = imageData;
				break;

			case 'Deployments':
				//abandoned date
				JSON ["Abandoned Date"] = null;
				JSON ["System"] = parseInt (JSON ["System"]);

				break;

			case 'Components':
				JSON ["Installation Date"] = new Date();
				JSON ["Last Calibrated Date"] = new Date();
				JSON ["Photo"] = imageData;
				JSON ["Deployment"] = parseInt (JSON ["Deployment"]);
				break;

			case 'Documents':
				break;

			case 'Service Enteries':
				JSON  ["Photo"] = imageData;
				break;
        }

        // print json to console for debugging
		//console.log (JSON);
		if (isitNew){
			finalJSON.push (JSON);
		}

		JSON = {};
	}

	return {save: save}
    
	});