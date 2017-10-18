angular.module('app.services', [])

/** Factory: Utility
  * Description: Provides utility functions for other parts of the app.
  *  Try to avoid feature bloat on this one.
  *
  *
  */
.factory('Utility', function($q){

	/** function: Pluralize
	  * Description: Given a string detialing the context of our current
	  * 	working entity (i.e. Site, Site Netrwork, Component, etc.) it will
	  *		pluralize that string for compatibility with how the data is
	  *		downloaded from the service
	  *
	  *	arg: context (String) - string to pluralize
	  * return: string - pluralized form of passed context
	  *
	  */
	function Pluralize(context){

		//service entries requires unique customization
		if(context == 'Service Entry'){
			return 'Service Entries'
		}

		//people is going to be same
		else if (context == 'People'){
			return context;
		}

		//append an s under all other circumstances
		else {
			return context + 's';
		}

	}

    /**
     * Returns the size of a sring in bytes (used for measring the size of an image)
     * @param       {[type]} str [description]
     * @return      {number}
     * @constructor
     */
	function LengthInUtf8Bytes(str) {
		// Matches only the 10.. bytes that are non-initial characters in a multi-byte sequence.
		var m = encodeURIComponent(str).match(/%[89ABab]/g);
		return str.length + (m ? m.length : 0);
	}


	/**
	 * Check to see if a string is a hex or not
	 * @param  {string}  string String to check if is hex or not
	 * @return {Boolean}        True if hex, false if not
	 */
	function IsHex(string){
            if(string === null){
                return false;
            }

			return  string.match("^[0-9a-fA-F]+$");
	}


    /**
     * Swaps the base of a retrieved encoded image from base 16 to base 64
     *  for display as a jpg
     * @param  {string} hexImage A hex encoded string representing an image retireved from remote server
     * @return {string}          A base 64 encoded string representing an image for display
     */
      function baseSwap_16_to_64 (hexImage){

        if(hexImage === null){
            return hexImage;
        }

        if(IsHex(hexImage)){
            //take hexidemal and conveter to base string
            var result = "";
            for (var i = 0; i < hexImage.length; i += 2){
                result += String.fromCharCode(parseInt(hexImage.substr(i, 2), 16));
            }

            //rencode string as base 64
            //and return
            var image = btoa(result);
        }
        return image || hexImage;
    }

    function baseSwap_64_to_16 (rawImage){
        if(rawImage === null){
            return rawImage;
        }

        // convert image
        var image = atob(rawImage);

        // to hexidecimal
        var result = "";
        for (var i = 0; i < image.length; i++) {
            var hex = image.charCodeAt(i).toString(16);
            result += (hex.length==2? hex:'0'+hex ); //data is lost without this
        }
        return result;
    }



    /**
     *
     * @param  {string} bitestring  A bytestring representing an uncompressed image
     * @param  {Image}  image         An image object
     * @return {string}            The reized string represeting an image
     */
    function compressImage(bitestring){
        return $q( function(resolve, reject){

            //declare up front vars
            var compCanvas = document.createElement('canvas');
            var compCtx = compCanvas.getContext('2d');
            var image = new Image();
            var imageHeight, imageWidth;


            //set the image src
            image.src = 'data:image/png;base64,' + bitestring;

            image.onload = function(){
                imageHeight = image.naturalHeight;
                imageWidth = image.naturalWidth;

                //use computation canvas to "draw image" for
                // and extract the compressed bytestring
                compCanvas.width = imageWidth;
                compCanvas.height = imageHeight;
                compCtx.drawImage(image, 0, 0, imageWidth, imageHeight);
                uri = compCanvas.toDataURL('image/jpeg', 0.70);

                uri = stripLeadingURIData(uri);

                resolve(uri);
            }
        });
    }

    function stripLeadingURIData(uri){
    	//ensure that there is a leading info encoded
        //and then strip it away
        if(uri.substring(0, 4) == 'data'){
		 	for(var i = 0; i < uri.length; i++){
    			if(uri[i] == ','){
        			uri = uri.substring(i+1, uri.length);
            		break;
        		}
    		}
        }
        return uri;
    }


	return {
			Pluralize: Pluralize,
			LengthInUtf8Bytes: LengthInUtf8Bytes,
			IsHex: IsHex,
            baseSwap_16_to_64: baseSwap_16_to_64,
            baseSwap_64_to_16: baseSwap_64_to_16,
            compressImage: compressImage
	};
})


// factory: sync
// fucntion(s):
//		read
//		post
.factory ('sync', function($q, $http, $cordovaFile, File, ObjectCounter, $cordovaToast){

// function: read
// purpose:  retreive info from http link
// var: string (url)
// return: filled syncedJSON
	function read (url, syncedJSON, title, JSON){
		var ret;
		// returns a promise
		var promise = $q (function (resolve, reject){
			// get from the given url, timeout given in ms
			$http.get (url, {timeout: 10000}).then (function Success (response){
				// fills synced json
				syncedJSON = response.data;

				// gives return data
				ret = response.data;
				// resolves promise
				resolve (response.data);
			}, function Error (response){
				console.warn (url + " " + response.status +": " + response.statusText);
				//	reads last known synced JSON from local data
				File.readFile (title).then (function Success (success){
					// fills synced json
					syncedJSON = success;
					// gives return data
					ret = success;
					// resolves promise
					resolve (success);
				})
		})})

		// once promise is returned
		return (promise.then (function (success){
			// fill JSONlist
			for (var i = 0; i < syncedJSON[title+'s'].length; i++){
				JSON [syncedJSON[title+'s'][i][title]] =  syncedJSON[title+'s'][i]['Name'];
			}
			// return
			return ret;
		}));
	}

// function: post
// purpose: post request to http link
// var: string (url), JSON
// return: promise
	function post (url, JSON, loggedIn){
		// return promise
		return $q (function (resolve, reject){
			if (loggedIn){
				// post to url, timeout in ms
				$http.post (url, JSON, {timeout: 10000}).then (function Success (response){
					// check if there is unsynced data saved
					if (File.checkFile ('Unsynced')){
						// remove it
						$cordovaFile.removeFile (cordova.file.externalDataDirectory, 'NRDC/Unsynced');
					}
					// show success
					$cordovaToast.showLongBottom ("New Items Successfully Uploaded");
					// resolve promise
					resolve (response.status);
				}, function Error (response){
					// log error
					console.warn ("Post Error :" + response.statusText);
					// write to unsynced file
					File.checkandWriteFile ('Unsynced', JSON);
					// toast failure
					$cordovaToast.showLongBottom ("Post Error: " + response.statusText);
					// reject promise
					reject (response.status);
				})
			}
			else{
				// write to unsynced file
				File.checkandWriteFile ('Unsynced', JSON);
				// toast failure
				$cordovaToast.showLongBottom ("Not Logged In");
				// reject promise
				reject ();
			}
		})
	}

// function: edit
// purpose: edit request to http link
// var: string (url), JSON
// return: promise
	function edit (url, JSON, loggedIn){
		// return promise
		return $q (function (resolve, reject){
			if (loggedIn){
				$http.post (url , JSON, {timeout: 10000}).then (function Success (response){

					// check if there is edit data saved
					if (File.checkFile ('Edit')){
						// remove it
						$cordovaFile.removeFile (cordova.file.externalDataDirectory, 'NRDC/Edit');
					}
					// show success
					$cordovaToast.showLongBottom ("Edited Entries Successfully Uploaded");
					// resolve promise
					resolve (response.status);
				}, function Error (response) {
					// log error
					console.warn ("Post Error :", response);
					// write to unsynced file
					File.checkandWriteFile ('Edit', JSON);
					// toast failure
					$cordovaToast.showLongBottom ("Post Error: " + response.statusText);
					// reject promise
					reject (response.status);
				})
		    }
		    else {
    			// write to edit file
    			File.checkandWriteFile ('Edit', JSON);
    			// toast failure
    			$cordovaToast.showLongBottom ("Not Logged In");
    			// reject promise
    			reject ();
			}
		})
	}

    /**
     * Performs conflict check on uploaded JSONs recieves
     * a list of conflicted
     * @param  {string}  url         The url to the conflict check service!
     * @param  {object}  checkValues An object containing all the values reuqired for checking for conflicts
     * @param  {boolean} loggedIn    A boolean transferred from rootScope indicating that a user is logged in
     * @return {none}
     */
    function conflictCheck(url, categoryMap, loggedIn){
        //variables
        var checkMap;

        //strip away all info in unsynced data except
        //for uuids and mod-dates
        checkMap = stripEntities(categoryMap);

        return $q(function(resolve, reject){
            if(loggedIn){
                $http.post(url, checkMap, {timeout:10000})
                .then(
                    function success(response){
                        //if there are conflicts
                        //resolve flat list of conflicts back to calling controller
                        resolve(response.data);

                    }, function error(response){
                        // log error
                        console.warn ("Conflict Check Error: ", response);
                        // toast failure
                        $cordovaToast.showLongBottom ("Post Error: " + response.statusText);
                        //reject promise
                        reject(response.status);
                    }
                );
            }
            else {
                // toast failure
                // $cordovaToast.showLongBottom ("Not Logged In");
                // reject promise
                reject( {"message":"Not Logged In"} );
            }
        })
    }


    /**
     * helper function to strip full jsons down only id/md pairs
     * @param  {object} categoryMap A object containing all the edited items staged for sync
     *                              organized by thier respective categories
     * @return {object}             An object containing only the uuid and modified date only
     *                              of the passed edited items
     */
    function stripEntities(categoryMap){
        var checkMap = {};

        for(var object in categoryMap){
            if(Array.isArray(categoryMap[object])){
                if(categoryMap.hasOwnProperty(object)){
                    //create space for an array if undefined
                    checkMap[object] = [];

                    //for each item in a specific category of edit data
                    //push only the unique identifier and mod date into
                    //array to be returned and posted to microservice
                    categoryMap[object].forEach(
                        function(categoryItem){
                            checkMap[object].push({
                                "Unique Identifier": categoryItem["Unique Identifier"],
                                "Modification Date": categoryItem["Modification Date"]
                            })
                        }
                    );
                }
            }
            else {
                checkMap[object] = "";
                checkMap[object] = categoryMap[object];
            }
        }

        return checkMap;
    }

	// return factories
	return{read: read,
		   post: post,
		   edit: edit,
           conflictCheck: conflictCheck};
})


// factory: Login
// function(s):
//		adminLogin
.factory ('Login', function($q, $http, $cordovaToast, File, $cordovaFile){
// function: adminLogin
// 	purpose: logs into the server as an admin
// 	var: string, string
//	return: n/a
	function adminLogin(JSON){
		return $q (function (resolve, reject){
			$http.post ("http://sensor.nevada.edu/services/QAEdge/Edge.svc/ProtoNRDC/Login/", JSON, {timeout: 10000}).then (function Success (response){
				if (response.data.length != 0){
					var promise = $q (function (resolve, reject){
						File.checkFile ('Logins').then (function Success (){
							File.readFile ('Logins').then (function Success (json){
								if (response != null){
									json[JSON ['Username']] = response.data;
									File.checkandWriteFile ('Logins', json);
								}
							})
							resolve (true);
						}, function Failure (){
							var array = {};
							array [JSON ['Username']] = response.data;
							File.createFile ('Logins').then (function Success (){
								File.checkandWriteFile ('Logins', array);
							});
							resolve (true);
						})
					})

					promise.then (function Success (){
						$cordovaToast.showLongBottom ("Login Successful");
			 			resolve (response.data);
					})
				}

				else {
					$cordovaToast.showLongBottom ("Login Failed");
	 				reject ('{}');
				}
			}, function Failure (error){
		 		File.checkFile ('Logins').then (function Success (){
					File.readFile ('Logins').then (function Success (json){
						reject (json [JSON['Username']]);
					})
				})
				$cordovaToast.showLongBottom ("Server cannot be reached");
		 	})
		})
	}

	return {
		adminLogin:adminLogin
	}
})




// factory: Camera
// function(s):
//		checkPermissions
// 		setOptions
//		openCamera
//		openGallery
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
    		cordova.plugins.diagnostic.isCameraAuthorized( function Success (authorized){
    			// if not, request access
    			if (!authorized){
					cordova.plugins.diagnostic.requestCameraAuthorization( function Success (status){
        		}, function Failure (error){
        			// display error
        		    $cordovaToast.showLongBottom ("Camera Permissions Requested Error: "+ error);
        		    // log error
        			console.error ("Camera Permissions Request Error:" + error);
        		});
				}
			}, function Failure (error){
				// log error
				console.error ("Camera Autherization Request Check Error:" + error);
				// display error
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
// return: hexidemical image string or null
	function openCamera() {

		// return promise
		return $q (function (resolve, reject){
			// wait for device to be ready
			document.addEventListener ("deviceready", function(){
				// get camera options
    			var options = setOptions(Camera.PictureSourceType.CAMERA);
    			// get the picture
				navigator.camera.getPicture( function Success (imageData){
   					// convert to hexidecimal string
                    result = encode(imageData);

    				// resolve promise
					resolve(
                        {result: result,
                             raw: imageData});
				}, function Failure (error){
					if (error != "Camera cancelled."){
						// show/log error
						$cordovaToast.showLongBottom ("Camera Error");
						console.error ("Camera Error: " + error);
					}

					// reject promise
					reject (null);
			}, options);
		})
	})
}

// function: openGallery
// purpose:  opens the gallery to select a picture
// var: n/a
// return: hexidemical image string or null
	function openGallery() {
		// return promise
		return $q (function (resolve, reject){
			// wait for device to be ready
			document.addEventListener ("deviceready", function(){
				//	get options
				var options = setOptions(Camera.PictureSourceType.SAVEDPHOTOALBUM);
				// get the picture
    			navigator.camera.getPicture( function Success(imageData) {

                //encode image data into hex string
                result = encode(imageData);

                // resolve promise
                // pass raw value back for rendering
				resolve ({result: result,
                             raw: imageData});

    		}, function Failure (error) {
    			if (error != "Selection cancelled."){
    				// show/log error
    				$cordovaToast.showLongBottom ("Gallery Error");
        			console.error ("Gallery Error: " + error);
        		}
        		// reject promise
        		reject (error);
    		}, options);
			})
		})
	}

    var encode = function(rawImage){
        // convert image
        var image = atob(rawImage);

        // to hexidecimal
        var result = "";
        for (var i = 0; i < image.length; i++) {
            var hex = image.charCodeAt(i).toString(16);
            result += (hex.length==2? hex:'0'+hex ); //data is lost without this
        }
        return result;
    }


// return values
	return {checkPermissions: checkPermissions,
			setOptions: setOptions,
			openCamera: openCamera,
			openGallery: openGallery,
            encode: encode
           };
})

// factory: DynamicPage
// function(s):
//		getTitle
// 		setTitle
//		getRoute
//		setRoute
//		setJSON
//		getJSON
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

// factory: ObjectCounter
// function(s):
//		count
.factory ('ObjectCounter', function(){
	// returns the number of items in an object
	function count (object){
		var i = 0;
		for (var x in object){
			if (object.hasOwnProperty (x)){ i++;}
		}
		return i;
	}

	// return
	return{count: count};
})

// factory: GPS
// function(s):
//		checkPermissions
//		getLocation
.factory('GPS', function($cordovaToast) {
// function: checkPermission
// purpose: checks and asks for permission to access gps
// var: n/a
// return: n/a
	function checkPermissions(){
		// check if location is enabled
		cordova.plugins.diagnostic.isLocationAuthorized( function Success (enabled){
    		if (!enabled){
    		   	// if not enabled, request Autherization
				cordova.plugins.diagnostic.requestLocationAuthorization(function(status){
			}, function Failure (error){
				// show/log error
    			console.error("GPS Permissions Request Error:" + error);
    			$cordovaToast.showLongBottom ("GPS Permissions Request Error:" + error);
			});
			}}, function Failure (error){
				// show/log error
    			console.error("GPS Permissions Request Check Error:" + error);
    			$cordovaToast.showLongBottom ("GPS Permissions Request Check Error:" + error);
		});
	}

// function: getLocation
// purpose: returns the location in the JSON variables Longitude, Latitude and Elevation
// var: JSON
// return: n/a
	function getLocation(JSON){
		// get location
		navigator.geolocation.getCurrentPosition( function Success (position){
  			JSON ['Longitude'] = position.coords.longitude;
  			JSON ['Latitude'] = position.coords.latitude;
  			JSON ['Elevation'] = position.coords.altitude;
		}, function Error(error){
			// log/show error
       		console.error ('Location Error:' + error.code + ' ' + error.message);
    		$cordovaToast.showLongBottom ("Unable to retreive location");
		}, { enableHighAccuracy: true });
	}

	// return
	return{checkPermissions: checkPermissions,
		   getLocation: getLocation};
})

// factory: File
// function(s):
//		createDiretory
//		checkFile
// 		createFile
//		checkandWriteFile
// 		readFile
.factory ('File', function($cordovaFile, $q, $cordovaToast, Utility){

// function: createDirectory
// 	purpose: checks to see if the NRDC directory exists. If not, creates it
// 	var: n/a
//	return: n/a
	function createDirectory(){
		// waits for device to be ready
		document.addEventListener ("deviceready", function Success (){
			// check for directory
			$cordovaFile.checkDir (cordova.file.externalDataDirectory,'NRDC').then (function Success (success){},function Failure (error){
				// if the error is file does not exist
				if (error.code == 1){
					// create file
					$cordovaFile.createDir (cordova.file.externalDataDirectory,'NRDC', false);
				}
				else{
					// show/ log error
			   		console.error ('Create Directory Error:' + error);
    				$cordovaToast.showLongBottom ("Unable to use local storage");
				}
			})
		})
	}

// function: checkFile
// 	purpose: checks to see if the file exists
// 	var: title
//	return: promise
	function checkFile(title){
		//return promise
		return $q (function (resolve, reject){
			// wait for device to be ready
			document.addEventListener ("deviceready", function (){
				// check file
			 	$cordovaFile.checkFile(cordova.file.externalDataDirectory, 'NRDC/'+title).then ( function Success(success){
			 		// resolve promise
			 		resolve (success.isFile);
				}, (function Failure (error){
					// reject promise
			 		reject (error.code);
				}))
			})
		})
	}

// function: createFile
// 	purpose: creates a file in the NRDC directory
// 	var: title
//	return: promise
	function createFile (title){
		return $q (function (resolve, reject){
		// wait for device to be ready
		document.addEventListener ("deviceready", function(){
			// make sure the file exists
			$cordovaFile.checkFile(cordova.file.externalDataDirectory, 'NRDC/'+title).then( function Success (success){
				reject (false);
			},function Failure (error){
				// creates the file
				$cordovaFile.createFile (cordova.file.externalDataDirectory, 'NRDC/'+title, true).then (function Success (){
					resolve (true);
				})

			})
		})
	})
	}

// function: checkandWriteFile
// 	purpose: checks that file exists and writes to it
// 	var: title, JSON
//	return: n/a
	function checkandWriteFile (title, JSON){
		//wait for device to be ready
		document.addEventListener ("deviceready", function (){
			// check that file exists
			$cordovaFile.checkFile(cordova.file.externalDataDirectory, 'NRDC/'+title).then(function Success (success){
				// write to file
				$cordovaFile.writeFile (cordova.file.externalDataDirectory, 'NRDC/'+title, JSON, true);

			}, function Failure (error){
				if (error.code == 1){
					$cordovaFile.createFile (cordova.file.externalDataDirectory, 'NRDC/'+title, JSON,  true).then (function (){
						$cordovaFile.writeFile (cordova.file.externalDataDirectory, 'NRDC/'+title, JSON, true).then (function () {
							return error;
						});
					});
				}
				else{
					// show/log error
					console.error ("File Write Error: " + title + " " + error.code);
					$cordovaToast.showLongBottom ("Unable to use local storage");
				}
			})
		})
	}


// function: PhotoSafeWriteFile
// 	purpose: checks that file exists, read and preserve photos before new write
// 	var: title, JSON
//	return: n/a
	function PhotoSafeWriteFile (title, JSON){
		//variables
		SavedJSON = [];

        document.addEventListener("deviceready", function (){
    		$cordovaFile.checkFile(cordova.file.externalDataDirectory, 'NRDC/'+title)
    		.then(
    			function(response){
    				//read file
    				// (I hate how nested this bs gets)
    				readFile(title)
    				.then(
    					function(response){
    						//if file exists but there is no data
    						if(response == null){
    							checkandWriteFile(title, JSON);
    							return;
    						}

    						//scan through each element from returned file
    						SavedJSON = response[ Utility.Pluralize(title) ];

    						//check for an existing object in the data
    						// returned from the file
    						// Uses uuids as princiapl comparator and breaks
    						JSON[ Utility.Pluralize(title) ]
    						.forEach(
    							function(object){
    								//for each object in new JSON
    								//scan through saved file for
    								//match
    								for(savedObject in SavedJSON){
    									if(object['Unique Identifier'] == SavedJSON[savedObject]['Unique Identifier']){
    										object['Photo'] = SavedJSON[savedObject]['Photo'];
    										break;
    									}
    								}
    							}
    						);
    						//write file
    						checkandWriteFile(title, JSON);
    					},
    					function(error){
    						console.error("File read error: " + title, error.message);
    					}
    				)
    			},
    			function(error){
                    if(error.message === "NOT_FOUND_ERR"){
                        createFile(title);
                        checkandWriteFile(title, JSON);
                    }
                    else{
                        console.error("Photo Safe File Write Error: " + title, error.message);
                    }
    			}
            )
        })
	}

// function: readFile
// 	purpose: reads the data from the file
// 	var: string
//	return: JSON, promise
	function readFile (title){
		// return promise
		return $q(function (resolve, reject){
			// wait for device to be ready
			document.addEventListener ("deviceready", function(){
				// check that file exists
				$cordovaFile.checkFile(cordova.file.externalDataDirectory, 'NRDC/'+ title).then ( function Success (result){
					// read the file to a string
					$cordovaFile.readAsText (cordova.file.externalDataDirectory, 'NRDC/'+ title).then (function (result){
						// resolve promise
						if (result != ""){
							resolve (JSON.parse(result));
						}
						else {
							resolve (null);
						}
					}, function Failure (error){
						// log error
						console.error("File Read Error:" + title + " ", error.message);
						// reject promise
						reject (error);
					})
				}, function Failure (error){
					// log error
					console.error ("File Not Found: " + title + " ", error.message);
					// reject promise
					reject (error);
				})
			})
		})
	}

	/**
	  * Function: SaveImageToFile
	  * purpose: save's an image to a specified file for later retrieval
	  * args: context (String): view context of element (system, component, etc.)
	  * args: uuid (string): uuid of spcific element for searcing and comparing
	  * args: image (16bit string): encoded string contatining image data
	  * return: promise
	  */

	function SaveImageToFile(context, uuid, image){
		//return promise for later
		// resolution
		return $q( function(resolve, reject){
			//variables
			var FileJSON = [];
			var writeObj = {};

			//read file from context
			//and store resoponse in FileJSON holder
			// all processing must be in processing block
			readFile(context)
			.then(
				function(response){
					//extract array of objects from returned json object
					FileJSON = response[ Utility.Pluralize(context) ];

					//scan in returned info for uuid
					// use loop to seek and load image
					for(item in FileJSON){
						if(FileJSON[item]['Unique Identifier'] == uuid){
							FileJSON[item]['Photo'] = image;
						}
					}

					//write json to file
					writeObj[Utility.Pluralize(context)] = FileJSON;
					checkandWriteFile(context, writeObj);

					resolve();
				},
				function(error){

				}
			);

		});
	}


	/**
	  * Function: DeleteImageFromFile
	  * purpose: deletes a previously saved image from the file system
	  * args: context (String): view context of element (system, component, etc.)
	  * args: uuid (string): uuid of spcific element for searcing and comparing
	  * return: promise
	  */
	function DeleteImageFromFile(context, uuid){
		//return promise for later
		// resolution
		return $q( function(resolve, reject){
			//variables
			var FileJSON = [];
			var writeObj = {};

			//read file from context
			//and store resoponse in FileJSON holder
			// all processing must be in processing block
			readFile(context)
			.then(
				function(response){
					FileJSON = response[ Utility.Pluralize(context) ];


					//scan in returned info for uuid
					// if they match just delete the one image
					// by setting photo to null
					for(item in FileJSON){
						if(FileJSON[item]['Unique Identifier'] == uuid){
							FileJSON[item]['Photo'] = null;
						}
					}

					//write json to file
					writeObj[ Utility.Pluralize(context) ] = FileJSON;
					checkandWriteFile(context, writeObj);

					resolve();
				},
				function(error){
                    console.warn("File error", error.message);
                    reject(error);
				}
			);

		});
	}

	/**
	  * Function: ReadImageFromFile
	  * purpose: read an image from the file system (used on load of data)
	  * args:
	  * return: promise
	  */
	function ReadImageFromFile(context, uuid){
		//return promise for async return
		return $q( function(resolve, reject){
			//variables
			var FileJSON = [];
			var image;

			//read file using context
			// store response in FileJSON holder
			// all processing must be contained in
			// .then() processing block
			readFile(context)
			.then(
				function(response){
					FileJSON = response[ Utility.Pluralize(context) ];

					//scan in returned info for uuid
					// resolve image for async return
					for(item in FileJSON){
						if(FileJSON[item]['Unique Identifier'] == uuid){
							image = FileJSON[item]['Photo'];

							resolve(image);

						}
					}

					//in case of not found
					//reutrn null
					resolve(null);

				},
				function(error){
					reject(error);
				}
			);
		});

	}

	//return
	return {createDirectory: createDirectory,
			checkFile: checkFile,
			createFile: createFile,
			checkandWriteFile: checkandWriteFile,
			PhotoSafeWriteFile:PhotoSafeWriteFile,
			readFile: readFile,
			SaveImageToFile: SaveImageToFile,
			DeleteImageFromFile: DeleteImageFromFile,
			ReadImageFromFile: ReadImageFromFile};
})


// factory: LazyLoad
// function(s):
//		fetchImage
//
.factory('LazyLoad', function($q, $http, File, Utility){

	return{
		fetchImage: fetchImage,
		saveSessionImage: saveSessionImage,
		getSessionImage: getSessionImage,
        clearSessionImage: clearSessionImage,
        forceDownloadImage: forceDownloadImage,
        setLocalSaveState: setLocalSaveState,
        getBooleanLocalSaveState: getBooleanLocalSaveState,
        setLocalDeletedState: setLocalDeletedState,
        getBooleanLocalDeletedState: getBooleanLocalDeletedState
	};

	//Public Function Defintions

	/**
	 * Retrives image saved on remote database or local harddrive storage.
	 * Locally saved image has priority. This may be problematic.
	 * @param  {object} uuidObj An object which maps a uuid to a specified context.
	 *                          The context is used to find the specific file containing the object.
	 * @return {promise}        Returned promise resolves with object containing image and boolean indicating the origin of the image
	 *                          Rejects in case of error.
	 */
	function fetchImage(uuidObj){
		return $q (function (resolve, reject) {
			/** This loop is just a way to access
			  * the context and the uuid from object passed into this function.
			  * The uuidObj should have one member of form { context : uuid }
			  * It will only loop one time.
			  */
			for(context in uuidObj){
				if( uuidObj.hasOwnProperty(context) ){
					File.ReadImageFromFile(context, uuidObj[context])
					.then(
						function success(response){
							//does not resolve if response
							// is null
							if(response != null){
                                var image;
                                image = Utility.baseSwap_16_to_64(response);

								resolve({"image": image, "fromFile": true});
							} else {
                                dbCall();
                            }

						},
						function failure(error){
							//this may cause problems of returning too
							dbCall();
						}
					);
				}
			}

			//query for photo service
			// if no image is saved
			// on the device
			function dbCall(){
    			$http.post("http://sensor.nevada.edu/services/QAEdge/Edge.svc/ProtoNRDC/Photo", uuidObj, {timeout: 20000})
    			.then(
    				function success(response){
                        var image;
                        image = Utility.baseSwap_16_to_64(response.data);

    					resolve ({"image": image, "fromFile": false});
    				},

    				function failure(error){
    					reject(error);
    				}
    			)
            }
        })
	}

    function forceDownloadImage(uuidObj){
        return $q (function (resolve, reject) {
            //query for photo service for image
            $http.post("http://sensor.nevada.edu/services/QAEdge/Edge.svc/ProtoNRDC/Photo", uuidObj, {timeout: 20000})
            .then(
                function success(response){
                    var image;
                    image = Utility.baseSwap_16_to_64(response.data);

                    resolve ( {"image": image, "fromFile": false} );
                },
                function failure(error){
                    reject(error);
                }
            )
        })
    }

	/**
	 * Saves a copy of a retirieved to a localStorage dict. (mapped by its uuid)
	 * used to prevent unnecessary server queries and promote faster loading
	 * @param  {string} uuid  The uuid of the object associated with the image
	 * @param  {string} image Base64 representation of the image to be stored
	 * @return {null}
	 */
	function saveSessionImage(uuid, image){
			sessionStorage[uuid] = image;
	}

	/**
	 * Retrieves an image from our localStorage dict. for use. Looks up image by uuid.
	 * @param  {string} uuid The uuid of the object associated with a given image
	 * @return {string}      Base64 represenation of a shared image or null if empty
	 */
	function getSessionImage(uuid){
            if (sessionStorage[uuid] === ""){
                return null;
            }
			return sessionStorage[uuid];
	}

	/**
	 * Removes a session image from local session-storage.
	 * @param  {string} uuid uuid of image to be removed
	 * @return {null}
	 */
	function clearSessionImage(uuid){
			sessionStorage[uuid] = null;
	}

    function setLocalSaveState(uuid, state){
        sessionStorage[uuid + " saved"] = state;
    }

    function getBooleanLocalSaveState(uuid){
        if(sessionStorage[uuid + " saved"] === "true"){
            return true;
        }
        return false;
    }

    function setLocalDeletedState(uuid, state){
        sessionStorage[uuid + " deleted"] = state;
    }

    function getBooleanLocalDeletedState(uuid){
        if(sessionStorage[uuid + " deleted"] === "true"){
            return true;
        }
        return false;
    }





})



// factory: SaveNew
// function(s):
//		save
//		deleteJSON
//		deletePeople
.factory ('SaveNew', function(uuid2, ObjectCounter, File, $q){

// function: save
// 	purpose: save the JSON to the unsynced JSON
// 	var: string
//	return: n/a
	function save (type, isitNew, JSON, finalJSON, imageData, related){
		// all entries need a modification date
		JSON ["Modification Date"] = new Date();


		// if new (for possible future synced edits)
		if (isitNew){
			JSON ['Delete'] = false;
			JSON ["Creation Date"] = new Date();
			JSON ["Unique Identifier"] = uuid2.newuuid();
		}

		// switch based on type, fills the JSON with the needed data
		switch (type){
			case 'Networks':
                if(angular.isUndefined(JSON['Alias'])){
                    JSON['Alias'] = null;
                }
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
				// timezones for site
				var TZAJSON = {10:'HST', 9: 'AKST', 8: 'PST', 7: 'MST', 6: 'CST', 5: 'EST', 4: 'AST'};
				var TZJSON = {10:'Hawaii-Aleutian Standard Time', 9: 'Alaska Standard Time', 8: 'Pacific Standard Time', 7: 'Mountain Standard Time', 6: 'Central Standard Time', 5: ' Eastern Standard Time', 4: 'Atlantic Standard Time'};

				JSON ['Network'] = related;
				if (angular.isUndefined (JSON ['Permit Holder']))
					JSON ['Permit Holder'] = null;
				else
					JSON ['Permit Holder'] = parseInt (JSON ['Permit Holder']);
				if (angular.isUndefined (JSON ['Land Owner']))
					JSON ['Land Owner'] = null;
				else
					JSON ['Land Owner'] = parseInt (JSON ['Land Owner']);
				JSON ["Landmark Photo"] = imageData;
				JSON ['Longitude'] = parseFloat (parseFloat(JSON ['Longitude']).toFixed (7));
  				JSON ['Latitude'] = parseFloat (parseFloat (JSON ['Latitude']).toFixed (7));
  				JSON ['Elevation'] = parseFloat (parseFloat (JSON ['Elevation']).toFixed (7));
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
				JSON ['Manager'] = parseInt (JSON ['Manager']);
				JSON ["Site"] = related;
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
				else
				 	JSON ['Height From Ground'] = parseFloat (parseFloat (JSON ['Height From Ground']).toFixed (7));
				if (angular.isUndefined (JSON ['Parent Logger']))
					JSON ['Parent Logger'] = null;
				if (angular.isUndefined (JSON ['Notes']))
					JSON ['Notes'] = null;
				if (angular.isUndefined (JSON ['Established Date']))
					JSON ['Established Date'] = null;
			 	if (angular.isUndefined (JSON ['Abandoned Date']))
					JSON ['Abandoned Date'] = null;
				JSON ["System"] = related;
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
				JSON ["Deployment"] = related;
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

		if (!isitNew){
			for (var i = 0; i < finalJSON.length; i ++){
				if (finalJSON[i]["Unique Identifier"] == JSON["Unique Identifier"]){
					finalJSON.splice (i, 1);
				}
			}
		}

		// pushes into unsyncedJSON
		finalJSON.push(JSON);
		JSON = {};
	}

// function: deleteJSON
// 	purpose: deletes in UnsyncedJSON
// 	var: string
//	return: n/a
	function deleteJSON (name, unsyncedJSON, JSONlist, listJSON, title){
			// find in unsyncedJSON
			for (var i = 0; i < unsyncedJSON.length; i ++){
				if (name == unsyncedJSON[i]['Name']){
					// remove
					unsyncedJSON.splice (i, 1);
				}
			}

			// remove from listJSON
			//delete listJSON[JSONlist.length - 1];
			// find in JSONlist
			for (var i = 0; i < JSONlist.length; i ++){
				if (angular.isDefined (JSONlist[i]) && name == JSONlist[i]['Name']){
					// remove
					JSONlist.splice (i, 1);
				}
			}

		// find in local storage
		return $q(function (resolve, reject){
			File.checkFile ('Unsynced').then (function Success (){
				File.readFile ('Unsynced').then (function Success (json){
					for (var i = 0; i < json[title].length; i ++){
						if (json[title][i]['Name']){
							// remove
							json[title].splice (i, 1);
						}
					}
				resolve (json);
			}, function failure (){
				resolve ();
			})
		})
		}).then ( function Success (json){
			// write jon back to file
			File.checkandWriteFile ('Unsynced', json);
		})


	}

// function: deletePeople
// 	purpose: deletes People in UnsyncedJSON. Same as aboec, but with first name/last name
// 	var: string
//	return: n/a
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

	//return
	return {save: save,
			deleteJSON: deleteJSON,
			deletePeople: deletePeople}

	})

.factory('ListNavService', function(){
        var tieredTitles = ["Networks", "Sites", "Systems", "Deployments", "Components"];
        var tieredRoutes = ["network", "site", "system", "deployment", "component"];
        var tieredParents = ["Unique Identifier", "Network", "Site", "System", "Deployment"];

        var getParentTitle = getParentTitle;
        var getChildTitle = getChildTitle;



        function getParentTitle(title){
            var titleNdx = tieredTitles.indexOf(title);
            var parentNdx = titleNdx - 1;

            return tieredTitles[parentNdx];
        };

        function getChildTitle(title){
            var titleNdx = tieredTitles.indexOf(title);
            var parentNdx = titleNdx++;

            return tieredTitles[parentNdx];
        }





        return{
            titles: tieredTitles,
            routes: tieredRoutes,
            parents: tieredParents,
            getParentTitle: getParentTitle,
            getChildTitle: getChildTitle
        };

})
