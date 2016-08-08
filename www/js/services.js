angular.module('app.services', [])

// factory: sync
// fucntion(s): 
//		create
//		read

.factory ('sync', function($q, $http, $cordovaFile, File, ObjectCounter, $cordovaToast){

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
		var promise = $q (function (resolve, reject){  $http.get (url, {timeout: 10000})
			.then (function Success (response){
				console.log (url + " " + response.status +": " + response.statusText);
					syncedJSON = response.data;
				ret = response.data;
				resolve (response.data);
			}, function Error (response){
				console.warn (url + " " + response.status +": " + response.statusText);
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
				console.log (File.checkFile ('Unsynced') );
				if (File.checkFile ('Unsynced')){
					$cordovaFile.removeFile (cordova.file.cacheDirectory, 'NRDC/Unsynced.txt');
				}
				$cordovaToast.showLongBottom ("Post Successful");
				resolve (response.status);
			//toast for successful post
				}, function Error (response){
				console.warn ("Post Error :" + response.statusText)
				File.checkandWriteFile ('Unsynced', JSON);
				$cordovaToast.showLongBottom ("Post Error: " + response.statusText);
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
.factory('Camera', function( $q, $cordovaCamera, $cordovaToast) {

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
    		// if not, request access
    	if (!authorized){
			cordova.plugins.diagnostic.requestCameraAuthorization(function(status){
        	}, function(error){
        		    $cordovaToast.showLongBottom ("Camera Permissions Requested Error: "+ error);
        		console.error ("Camera Permissions Request Error:" + error);
        		});
		}
		}, function(error){
			console.error ("Camera Autherization Request Check Error:" + error)
    		$cordovaToast.showLongBottom ("Camera Autherization Request Error: "+ error);
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
   			var image =  atob (imageData)
				var result = "";
    			for (var i = 0; i < image.length; i++) {
        			result += image.charCodeAt(i).toString(16);
    			}
				resolve (result);
			}, function onFail(error){
				if (error != "Camera Cancelled"){
					$cordovaToast.showLongBottom ("Camera Error");
					console.error ("Camera Error: " + error);
				}
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
    			var image =  atob (imageData)
				var result = "";
    			for (var i = 0; i < image.length; i++) {
        			result += image.charCodeAt(i).toString(16);
    			}
				resolve (result);
    		}, function cameraError(error) {
    			if (error != "Selection cancelled."){
    				$cordovaToast.showLongBottom ("Gallery Error");
        			console.error ("Gallery Error: " + error);
        		}
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
.factory('GPS', function($cordovaToast) {

// function: checkPermission
// 	purpose: checks and asks for permission to access gps
// 	var: n/a
//	return: n/a
	function checkPermissions(){
		//check if location is enabled
		cordova.plugins.diagnostic.isLocationAuthorized(function(enabled){
    		   if (!enabled){
			cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
		}, function(error){
    		console.error("GPS Permissions Request Error:" + error);
    		$cordovaToast.showLongBottom ("GPS Permissions Request Error:" + error);
		});
	}}, function(error){
    		console.error("GPS Permissions Request Check Error:" + error);
    		$cordovaToast.showLongBottom ("GPS Permissions Request Check Error:" + error);
	});
	}

	function getLocation(JSON){
		navigator.geolocation.getCurrentPosition(function onSuccess (position){
  			JSON ['Longitude'] = position.coords.longitude;
  			JSON ['Latitude'] = position.coords.latitude;
  			JSON ['Elevation'] = position.coords.altitude;
		}, function onError(){
        console.error ('Location Error:' + error.code + ' ' + error.message);
    	$cordovaToast.showLongBottom ("Unable to retreive location");
		}, { enableHighAccuracy: true });
	}

	return{checkPermissions: checkPermissions,
		   getLocation: getLocation};
	})


.factory ('File', function($cordovaFile, $q, $cordovaToast){

	function createDirectory(){
		document.addEventListener ("deviceready", function(){
			$cordovaFile.checkDir (cordova.file.cacheDirectory,'NRDC').then (function (success){
		},function (error){
			if (error.code == 1){
				$cordovaFile.createDir (cordova.file.cacheDirectory,'NRDC', false);	
			}
			else{
			    console.error ('Create Directory Error:' + error);
    			$cordovaToast.showLongBottom ("Unable to use local storage");	
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
			console.error ("File Write Error: " + title + " " + error.code);
			$cordovaToast.showLongBottom ("Unable to use local storage");
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
							console.error("File Read Error:" + title + " " + error.code);
							reject (error);
						})
					}, function (error){
						console.error ("Directory Error: " + title + " " + error.code);
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

.factory ('SaveNew', function(uuid2, ObjectCounter){

	function save (type, isitNew, JSON, finalJSON, imageData){

		JSON ["Modification Date"] = new Date();

		if (isitNew){
			JSON ["Creation Date"] = new Date();		
			JSON ["Unique Identifier"] = uuid2.newuuid();
		}

		switch (type){
			case 'Networks':
				JSON ["Started Date"] = new Date();
				JSON ["Principal Investigator"] = parseInt (JSON ["Principal Investigator"]);
				break;

			case 'People':
				if (angular.isUndefined (JSON ['Phone']))
					 JSON ['Phone'] = null;
				if (angular.isUndefined (JSON ['Email']))
					 JSON ['Email'] = null;
				if (angular.isUndefined (JSON ['Organization']))
					 JSON ['Organization'] = null;
				JSON ["Started Date"] = new Date();
				JSON ["Photo"] = imageData;
				break;

			case 'Sites':
				var TZAJSON = {10:'HST', 9: 'AKST', 8: 'PST', 7: 'MST', 6: 'CST', 5: 'EST', 4: 'AST'};
				var TZJSON = {10:'Hawaii-Aleutian Standard Time', 9: 'Alaska Standard Time', 8: 'Pacific Standard Time', 7: 'Mountain Standard Time', 6: 'Central Standard Time', 5: ' Eastern Standard Time', 4: 'Atlantic Standard Time'};
				JSON ["Network"] = parseInt (JSON ["Network"]);
				if (angular.isUndefined (JSON ['Permit Holder']))
				 JSON ['Permit Holder'] = null;
				else
					JSON ['Permit Holder'] = parseInt (JSON ['Permit Holder']);
				if (angular.isUndefined (JSON ['Land Owner']))
					JSON ['Land Owner'] = null;
				else
					JSON ['Land Owner'] = parseInt (JSON ['Land Owner']);
				JSON ['Longitude'] = parseFloat (parseFloat(JSON ['Longitude']).toFixed (7));

  				JSON ['Latitude'] = parseFloat (parseFloat (JSON ['Latitude']).toFixed (7));
  				console.log (JSON ['Latitude']);
  				JSON ['Elevation'] = parseFloat (parseFloat (JSON ['Elevation']).toFixed (7));
				JSON ['Landmark Photo'] = imageData;
				JSON ['Time Zone Name'] = TZJSON[new Date().getTimezoneOffset()/60 + 1];
				JSON ['Time Zone Offset'] = (new Date().getTimezoneOffset());
				JSON ['Time Zone Abbreviation'] = TZAJSON[new Date().getTimezoneOffset()/60 + 1];
				break;

			case 'Systems':
				if (angular.isUndefined (JSON ['Details']))
				 JSON ['Details'] = null;
				if (angular.isUndefined (JSON ['Power']))
				 JSON ['Power'] = null;
				if (angular.isUndefined (JSON ['Installation Location']))
				 JSON ['Installation Location'] = null;				 				 			

				JSON ["Manager"] = parseInt (JSON ["Manager"]);
				JSON ["Site"] = parseInt (JSON ["Site"]);
				JSON ["Photo"] = imageData;
				break;

			case 'Deployments':
				if (angular.isUndefined (JSON ['Purpose']))
				 JSON ['Purpose'] = null;
				if (angular.isUndefined (JSON ['Center Offset']))
				 JSON ['Center Offset'] = null;
				if (angular.isUndefined (JSON ['Longitude']))
				 JSON ['Longitude'] = null;
				else
					JSON ['Longitude'] = parseFloat (parseFloat (JSON ['Longitude']).toFixed (7));
				if (angular.isUndefined (JSON ['Latitude']))
				 JSON ['Latitude'] = null;
				else
					JSON ['Latitude'] = parseFloat (parseFloat (JSON ['Latitude']).toFixed (7));
				if (angular.isUndefined (JSON ['Elevation']))
				 JSON ['Elevation'] = null;
				else
					JSON ['Elevation'] = parseFloat (parseFloat (JSON ['Elevation']).toFixed (7));;
				if (angular.isUndefined (JSON ['Height From Ground']))
				 JSON ['Height From Ground'] = null;
				 if (angular.isUndefined (JSON ['Parent Logger']))
				 JSON ['Parent Logger'] = null;
				else
				  JSON ['Height From Ground'] = parseFloat (parseFloat (JSON ['Height From Ground']).toFixed (7));
				 if (angular.isUndefined (JSON ['Notes']))
				 JSON ['Notes'] = null; 	
				if (angular.isUndefined (JSON ['Established Date']))
				 JSON ['Established Date'] = null;
			 	if (angular.isUndefined (JSON ['Abandoned Date']))
				 JSON ['Abandoned Date'] = null;			 				 				 			
				JSON ["System"] = parseInt (JSON ["System"]);
				break;

			case 'Components':
				if (angular.isUndefined (JSON ['Last Calibrated Date']))
				 JSON ['Last Calibrated Date'] = null;
				if (angular.isUndefined (JSON ['Manufacturer']))
				 JSON ['Manufacturer'] = null;
				if (angular.isUndefined (JSON ['Model']))
				 JSON ['Model'] = null;
				if (angular.isUndefined (JSON ['Serial Number']))
				 JSON ['Serial Number'] = null;
				if (angular.isUndefined (JSON ['Vendor']))
				 JSON ['Vendor'] = null;
				if (angular.isUndefined (JSON ['Supplier']))
				 JSON ['Supplier'] = null;
				if (angular.isUndefined (JSON ['Installation Date']))
				 JSON ['Installation Date'] = null;
				if (angular.isUndefined (JSON ['Installation Details']))
				 JSON ['Installation Details'] = null;
				if (angular.isUndefined (JSON ['Wiring Notes']))
				 JSON ['Wiring Notes'] = null;
				JSON ["Started Date"] = new Date();
				JSON ["Photo"] = imageData;
				JSON ["Deployment"] = parseInt (JSON ["Deployment"]);
				break;

			case 'Documents':
				JSON ["Started Date"] = new Date();
				break;

			case 'Service Entries':
			if (angular.isUndefined (JSON ['Date']))
				 JSON ['Date'] = null;
				JSON ["Photo"] = imageData;
				JSON ["Creator"] = parseInt (JSON ["Creator"]);
				break;
        }

        // print json to console for debugging
		//console.log (JSON);
		if (isitNew){
			finalJSON.push (JSON);
		}
		JSON = {};
	}

	function deleteJSON (name, unsyncedJSON, JSONlist, listJSON){

		for (var i = 0; i < unsyncedJSON.length; i ++){
			if (name == unsyncedJSON[i]['Name']){
				unsyncedJSON.splice (i, 1);	
			}
		}

		delete listJSON[JSONlist.length - 1];

		for (var i = 0; i < JSONlist.length; i ++){
			if (name == JSONlist[i]['Name']){
				JSONlist.splice (i, 1);	
			}
		}
	}

	function deletePeople (name, unsyncedJSON, JSONlist, listJSON){
		for (var i = 0; i < unsyncedJSON.length; i ++){
			if (name == (unsyncedJSON[i]['First Name'] + unsyncedJSON[i]['Last Name'])){
				unsyncedJSON.splice (i, 1);	
			}
		}

		delete listJSON[JSONlist.length - 1];

		for (var i = 0; i < JSONlist.length; i ++){
			if (name == (unsyncedJSON[i]['First Name'] + unsyncedJSON[i]['Last Name'])){
				JSONlist.splice (i, 1);	
			}
		}
	}

	return {save: save,
			deleteJSON: deleteJSON}
    
	});