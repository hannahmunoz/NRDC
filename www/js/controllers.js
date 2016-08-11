angular.module('app.controllers', ['ngRoute','ionic', 'app.services', 'ngCordova', 'angularUUID2', 'ngStorage'])

   // used to view JSONs that have already been created.
.controller('viewCtrl', function($scope, DynamicPage, ObjectCounter, $rootScope, $ionicHistory, $sce, SaveNew, Camera) {
	// get the JSON
	$scope.JSON = DynamicPage.getJSON();
	$scope.imageData = $scope.JSON ['Photo'];

	// controls the save button. When true, save button is unclickable
	$scope.checked = true;
    
    console.log($scope.JSON);

	// if in the unsynced json, is false and the savee button is clickable
	if (DynamicPage.getTitle() != "Service Entries"){
		for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.JSON ['Unique Identifier'].toUpperCase() === $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier'].toUpperCase()){
				$scope.checked = false;
			}
		}
	}

	// checker for service entries
	else{
		for (var i = 0; i < $rootScope.unsyncedJSON.ServiceEntries.length; i ++){
			if ($scope.JSON ['Unique Identifier'].toUpperCase() === $rootScope.unsyncedJSON.ServiceEntries[i]['Unique Identifier'].toUpperCase()){
				$scope.checked = false;
			}
		}	
	}


	// loads the data into the page based on the title of the page
	switch (DynamicPage.getTitle()){
		case 'Networks':
				$scope.JSON['Principal Investigator'] = JSON.stringify($scope.JSON['Principal Investigator']);
			break;
				
		case 'Sites':
                console.log ($scope.JSON)
                $scope.JSON['Network'] = JSON.stringify ($scope.JSON['Network']);
				$scope.JSON['Project'] = JSON.stringify($scope.JSON['Project']);
				$scope.JSON ['Permit Holder'] = JSON.stringify($scope.JSON['Permit Holder']);
				$scope.JSON ['Land Owner'] = JSON.stringify($scope.JSON['Land Owner']);
			break;

		case 'Systems':
				$scope.JSON['Manager'] = JSON.stringify($scope.JSON['Manager']);
				$scope.JSON['Site'] = JSON.stringify($scope.JSON['Site']);
			break;

		case 'Deployments':
				$scope.JSON ['Established Date'] = new Date($scope.JSON ['Established Date'] );
				$scope.JSON ['Abandoned Date'] = new Date($scope.JSON ['Abandoned Date'] );
				$scope.JSON ['System'] = JSON.stringify($scope.JSON['System']);
			break;

		case 'Components':
				$scope.JSON ['Installation Date'] = new Date($scope.JSON ['Installation Date'] );
				$scope.JSON ['Last Calibrated Date'] = new Date($scope.JSON ['Last Calibrated Date'] );
				$scope.JSON['Deployment'] = JSON.stringify($scope.JSON['Deployment']);
				break;

		case 'Service Entries':
			$scope.JSON ['Date'] = new Date($scope.JSON ['Date'] );
			break;
	}
    
     //custom back button functionality
    $scope.back = function(){ $ionicHistory.goBack(); }

    // save JSON button
	$scope.saveJSON = function (){
		// double checks that it's in the unsynced json
		for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.JSON ['Unique Identifier'] == $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier']){
				// SaveNew factory
				SaveNew.save (DynamicPage.getTitle(), false, $scope.JSON, $rootScope.unsyncedJSON[DynamicPage.getTitle()], null);	
			}
		}
	};

	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (imageData){
		Camera.checkPermissions();
		$scope.imageData = Camera.openGallery ().then ( function (image){ $scope.imageData = image; });
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	// in root scope so it can be called from all buttons
	$rootScope.takePicture = function (imageData){
    		Camera.checkPermissions();
    		$scope.imageData = Camera.openCamera ().then (function (image){ $scope.imageData = image;});
	}

	//wrapper for the GPS factory so we can call it from the getGPS button
	// in root scope so it can be called from all buttons
	$rootScope.getGPS = function (JSON){
		GPS.checkPermissions();
		GPS.getLocation(JSON);
	}
})
  
 // controller for the main menu  
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, Login, $http, $ionicModal, DynamicPage, ObjectCounter, File, $cordovaFile, $cordovaNetwork, $ionicLoading, $routeParams) {

	// create global variables,could probably be cut down but that would mean changing everything
	$rootScope.peopleSyncedJSON = {};
	$rootScope.peopleJSON = {};
	$rootScope.networkSyncedJSON = {};
	$rootScope.networkJSON = {};
	$rootScope.siteSyncedJSON = {};
	$rootScope.siteJSON = {};
	$rootScope.systemSyncedJSON = {};
	$rootScope.systemJSON = {};
	$rootScope.deploymentSyncedJSON = {};
	$rootScope.deploymentJSON = {};
	$rootScope.componentSyncedJSON = {};
	$rootScope.componentJSON = {};
	$rootScope.documentSyncedJSON = {};
	$rootScope.documentJSON = {};
	$rootScope.serviceSyncedJSON = {};
	$rootScope.serviceJSON = {};

	// special lists for service entries for listView
	$rootScope.servicelistJSON = {};
	$rootScope.serviceJSONlist = [];

	// special lists for documents for listView
	$rootScope.documentlistJSON = {};
	$rootScope.documentJSONlist = [];

	//$rootScope.editJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };
	$rootScope.unsyncedJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };
    
    $rootScope.level = 0;

    $scope.loginJSON = {};
    $rootScope.associatedNetworks = {};
    $rootScope.loggedIn = false;

	// URL list
	$rootScope.baseURL = "http://sensor.nevada.edu/GS/Services/";
	$rootScope.urlPaths = ["people", "networks", "sites", "systems", "deployments", "components", "documents","service_entries"];

	// check for main directory
	File.createDirectory();

    $scope.randomTimingOffset = [];
    
    //randomizes the appearance of tile buttons on main page
    $scope.setRndTimingOffsets = function(){
        numTiles = $window.document.getElementsByClassName("tile-btn").length;
        
        for( tile = 0; tile < numTiles; tile++ ){
            $scope.randomTimingOffset[tile] = {};
            $scope.randomTimingOffset[tile]["-webkit-animation-delay"] = (Math.random()/2) + 's';
            $scope.randomTimingOffset[tile]["animation-delay"] = $scope.randomTimingOffset[tile]["-webkit-animation-delay"];
        }
    }

    // upload button
    $scope.uploadJSONS = function(){
    	   // posts the unsynced json to edge
    	   var promise = sync.post ($rootScope.baseURL+'edge/', $rootScope.unsyncedJSON, $rootScope.loggedIn);
    	   promise.then ( function (){
    		  // once finished, the unsynced json is cleared
    		  $rootScope.unsyncedJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents:[], ServiceEntries:[] };
    		  // the menu is reinitiated
    		  $scope.init ();
    	   });
        
    }

    $scope.login = function (){
        $scope.loginJSON ['Username'] = "Admin";
        $scope.loginJSON ['Password'] = "password";
        Login.adminLogin ($scope.loginJSON).then (function Success (response){
            $rootScope.associatedNetworks = response;
            $rootScope.loggedIn = true;
        }, function Failure (error){
            $rootScope.associatedNetworks = error;
            $rootScope.loggedIn = false;
        });

    }
    
    
    //Initial progressive list switch
    //Called from main menu
    $scope.progressiveListSwitch = function(){
        var tieredTitles = ["Networks", "Sites", "Systems", "Deployments", "Components"];
        var tieredRoutes = ["network", "site", "system", "deployment", "component"];
        var tieredJSON = [$rootScope.networkJSON,$rootScope.siteJSON,$rootScope.systemJSON,$rootScope.deploymentJSON,$rootScope.componentJSON];
        var tieredSyncedJSON = [$rootScope.networkSyncedJSON,$rootScope.siteSynchedJSON,$rootScope.systemSyncedJSON,$rootScope.deploymentSyncedJSON,$rootScope.componentSyncedJSON];
        
        //set the title and route of dynamic page one level back
        //so we can view the info of what we just clicked
        DynamicPage.setTitle(tieredTitles[$rootScope.level]);
        DynamicPage.setRoute(tieredRoutes[$rootScope.level]);
        
        $scope.listSwitch(tieredJSON[$rootScope.level], tieredSyncedJSON[$rootScope.level], tieredTitles[$rootScope.level], tieredRoutes[$rootScope.level]);
    }
    

    // used to gather data for listView depending on the type selected
    $scope.listSwitch = function (JSON, syncedJSON, title, route){
    	$scope.unsyncedListJSON = {};
        
        console.log($rootScope.level);

    	// adds elements to unsyncedListJSON object 
    	if (title != "Service Entries"){
    		for (var i = 0; i < $rootScope.unsyncedJSON[title].length; i++){
    			if (title == "People")	{
    				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON[title][i]['First Name'] + " "+ $rootScope.unsyncedJSON[title][i]['Last Name'];
    			}
    			else{
    				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON[title][i]['Name'];
    			}
			}

			// puts the unsynced and synced jsons in one array
			$rootScope.chosenJSONlist = $rootScope.unsyncedJSON[title].concat (syncedJSON[title]);	
		}

		// same thing but for service entries
		else {
			for (var i = 0; i < $rootScope.unsyncedJSON.ServiceEntries.length; i++){
				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON.ServiceEntries[i]['Name'];
			}

			$rootScope.chosenJSONlist = $rootScope.unsyncedJSON.ServiceEntries.concat (syncedJSON.ServiceEntries);
		}


    // only runs the first time the program is called. 
    // Reads from the server and inputs into array
    // TODO: add to local phone storage and read from there if server is unavaible
		// adds elements to the listJSON
    	$rootScope.listJSON = angular.extend ({},JSON,$scope.unsyncedListJSON);

    }

// only runs the first time the program is called. 
// Reads from the server and inputs into array
    $scope. init = function (){
        
    	//get permissions
    	//unblock before packaging
    	//Camera.checkPermissions();

    	// gets unsynced data back from local storage and puts in unsyncedJSON 
		var list = ["People","Networks", "Sites", "Systems", "Deployments", "Components", "Documents","ServiceEntries"];
    	if (File.checkFile ('Unsynced')){
			File.readFile ('Unsynced').then (function Success (response){
				if (response != null){
					for (var i = 0; i < list.length; i++){
						$rootScope.unsyncedJSON[list[i]] = $rootScope.unsyncedJSON[list[i]].concat (response[list[i]]);
					}
				}
			})
		}
 
    	// people read. Same as sync.read factory, but has to be seperated because we need first and last name
    	var promise = $q (function (resolve, reject){$http.get($rootScope.baseURL + $rootScope.urlPaths[0]+"/", {timeout: 10000}).then (function(result){
    		//console.log ($rootScope.baseURL + $rootScope.urlPaths[0]+"/" + " " + result.status +": " + result.statusText);
    		$rootScope.peopleSyncedJSON = result.data;
    		File.checkandWriteFile ( 'People', $rootScope.peopleSyncedJSON);
    		resolve ($rootScope.peopleSyncedJSON);
    	}, function (result){
    		File.readFile('People').then (function(success){
    			$rootScope.peopleSyncedJSON = success;
    			resolve ($rootScope.peopleSyncedJSON);
    		});

     	})})
   		promise.then (function(result){
    		for (var i = 0; i < $rootScope.peopleSyncedJSON.People.length; i++){
				$rootScope.peopleJSON [$rootScope.peopleSyncedJSON.People[i]['Person']] =  $rootScope.peopleSyncedJSON.People[i]['First Name'] + " " + $rootScope.peopleSyncedJSON.People[i]['Last Name']; 
			}
    	})


    	// site network read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/", $rootScope.networkSyncedJSON, 'Network', $rootScope.networkJSON).then (function (result){
    		// redudant, but nessecary.  Doesnt work otherwise for some reason
    		$rootScope.networkSyncedJSON = result;
            console.log ($rootScope.networkJSON);
    		// writes to local storage
    		File.checkandWriteFile('Network', $rootScope.networkSyncedJSON);
    	})

    	// site read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/", $rootScope.siteSyncedJSON,'Site', $rootScope.siteJSON).then(function(result){
    		$rootScope.siteSyncedJSON = result;
    		File.checkandWriteFile('Site', $rootScope.siteSyncedJSON);
    	});

    	// system read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[3]+"/", $rootScope.systemSyncedJSON, 'System', $rootScope.systemJSON).then (function(result){
    		$rootScope.systemSyncedJSON = result;
    		File.checkandWriteFile('System', $rootScope.systemSyncedJSON);
    	})

    	// deployment read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[4]+"/", $rootScope.deploymentSyncedJSON, 'Deployment', $rootScope.deploymentJSON).then (function(result){
    		$rootScope.deploymentSyncedJSON = result;
    		File.checkandWriteFile('Deployment', $rootScope.deploymentSyncedJSON);
    	});

    	// component read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[5]+"/", $rootScope.componentSyncedJSON, 'Component', $rootScope.componentJSON).then (function(result){
    		$rootScope.componentSyncedJSON = result;
    		File.checkandWriteFile('Component', $rootScope.componentSyncedJSON);
    	});

    	// 	document read
		sync.read($rootScope.baseURL + $rootScope.urlPaths[6]+"/", $rootScope.documentSyncedJSON, 'Document', $rootScope.documentJSON).then (function(result){
			$rootScope.documentSyncedJSON = result;
			File.checkandWriteFile('Document', $rootScope.documentSyncedJSON);
		});

   		// service Entries read. Seperate due to service enteries having a space
    	var promise = $q (function (resolve, reject){$http.get($rootScope.baseURL + $rootScope.urlPaths[7]+"/", {timeout: 10000}).then (function(result){
    		//console.log ($rootScope.baseURL + $rootScope.urlPaths[7]+"/" + " " + result.status +": " + result.statusText);
    		$rootScope.serviceSyncedJSON = result.data;
    		File.checkandWriteFile ( 'ServiceEntries', $rootScope.serviceSyncedJSON);
    		resolve ($rootScope.serviceSyncedJSON);
    		}, function (result){
    			File.readFile('ServiceEntries').then (function(success){
    			$rootScope.serviceSyncedJSON = success;
    			resolve ($rootScope.serviceSyncedJSON);
    		});
     		})})
  	 	promise.then (function(result){
    		for (var i = 0; i < $rootScope.serviceSyncedJSON.ServiceEntries.length; i++){
				$rootScope.serviceJSON [$rootScope.serviceSyncedJSON.ServiceEntries[i]['Service Entry']] =  $rootScope.serviceSyncedJSON.ServiceEntries[i]['Name']; 
			}
    	})
	}
    
    //Indicating Initilaize is loading
    $ionicLoading.show({
        templateUrl: 'templates/loadingSpinner.html',
        noBackdrop: false
    });
    
    //initalize
    $scope.init ();
    
    //hide loading screen
    $ionicLoading.hide();
})

/**
    Controller handles scroll functionality,
    binds to arrow objects,
    hides arrow objects
*/
.controller('scrollController', function($scope, $state, $ionicScrollDelegate) {
    $scope.isBottom = false;
    smoothnessOffset = 15;  //ensures smooth dissapearnce of arrow 
    
    //scrolls the content window to the bottom
    $scope.scrlBot = function(){
        $ionicScrollDelegate.$getByHandle('scrollable').scrollBottom(true);
    }
    
    //hide arrow when user scrolls nearly to bottom
    //hides using angular logic
    //updates bool evaluated by ng-hide
    $scope.cndHideArrow = function(){
        $scope.isBottom = ($ionicScrollDelegate.getScrollPosition().top >= 
                            $ionicScrollDelegate.getScrollView().__maxScrollTop - smoothnessOffset)
        $scope.$apply();
    }
})

// listView controller
.controller('listCtrl', function($scope, $rootScope, DynamicPage, $state, ObjectCounter, $ionicHistory, ionicMaterialInk, $ionicLoading) {
	//local variables to the controller
        var tieredTitles = ["Networks", "Sites", "Systems", "Deployments", "Components"];
        var tieredRoutes = ["network", "site", "system", "deployment", "component"];
        var parent = ["Unique Identifier", "Network", "Site", "System", "Deployment"];
        var tieredJSON = [$rootScope.networkJSON,$rootScope.siteJSON,$rootScope.systemJSON,$rootScope.deploymentJSON,$rootScope.componentJSON];
        var tieredSyncedJSON = [$rootScope.networkSyncedJSON,$rootScope.siteSyncedJSON,$rootScope.systemSyncedJSON,$rootScope.deploymentSyncedJSON,$rootScope.componentSyncedJSON];
    
    
    
    // gets data from the DynamicPage factory. Only works on first load
    $scope.title = DynamicPage.getTitle();
    $scope.route = DynamicPage.getRoute();
    
    $scope.itemSelecHist = [];

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		// works on every load after
		$scope.title = DynamicPage.getTitle();
		$scope.route = DynamicPage.getRoute();
	})

	// wrapper for person select button
	$scope.select = function(JSON){
        
        // sets the JSON selected from the list so it can be grabbed in the viewCtrl
        for (var i = 0; i < $rootScope.chosenJSONlist.length; i++){
        	if (DynamicPage.getTitle() != "People"){
        		if (JSON == $rootScope.chosenJSONlist[i]['Name']){
        			DynamicPage.setJSON ($rootScope.chosenJSONlist[i]);
        		}
        	}
        	else {
        		if (JSON == $rootScope.chosenJSONlist[i]['First Name'] + " " + $rootScope.chosenJSONlist[i]['Last Name']){
        			DynamicPage.setJSON ($rootScope.chosenJSONlist[i]);
        		}
        	}
        }
		console.log(DynamicPage.getJSON());
	}
    
    $scope.viewItem = function(){
        $state.go($scope.route);
    }
    
    
    //calls for the next tier of
    //items in the site network hierarchy
    $scope.progressiveListSwitch = function(){
        
        //store the json of the
        //list item clicked
        $scope.clickedJSON = DynamicPage.getJSON();
        
        //store clicks except
        //when we are at the component level
        if($scope.level != 4){
            $scope.itemSelecHist.push($scope.clickedJSON);
        }
        
        //set the title and route of dynamic page one level back
        //so we can view the info of what we just clicked
        DynamicPage.setRoute(tieredRoutes[$rootScope.level]);
        $scope.route = DynamicPage.getRoute();
        
        if($rootScope.level == tieredTitles.length){
            return;
        }
        else if($rootScope.level < tieredTitles.length-1){
            
            
            //increment our current level in tired hierarchy
            //if we are not at the end
            $rootScope.level += 1;
            
            //switch to a new list
            $scope.listSwitch(tieredJSON[$rootScope.level], tieredSyncedJSON[$rootScope.level], tieredTitles[$rootScope.level], tieredRoutes[$rootScope.level]);
            
           
        }
        
        //reset our current title
        DynamicPage.setTitle(tieredTitles[$rootScope.level]);
        $scope.title = DynamicPage.getTitle();

        
        
    }
    
/*-----------------------------------------------
Under Construction
------------------------------------------------*/
    
    $scope.regressiveListSwitch = function(){

            
        $scope.clickedJSON = $scope.itemSelecHist.pop()
        
        //double pop when going back
        //after going forward
        
        
        
        DynamicPage.setJSON($scope.clickedJSON);
        
        //increment our current level in tired hierarchy
        //if we are not at the end
        $rootScope.level -= 1;
        

        //switch to a new list
        $scope.listSwitch(tieredJSON[$rootScope.level], tieredSyncedJSON[$rootScope.level], tieredTitles[$rootScope.level], tieredRoutes[$rootScope.level]);
        
        if($rootScope.level-1 > 0){
            DynamicPage.setRoute(tieredRoutes[$rootScope.level - 1]);
            DynamicPage.setTitle(tieredTitles[$rootScope.level - 1]);
        }
        
        
    }
    
    
    
    $scope.listSwitch = function (JSON, syncedJSON, title, route){
    	$scope.unsyncedListJSON = {};
        
        //reset the title with every 
		$scope.title = title;

    	if (title != "Service Entries"){
    		for (var i = 0; i < $rootScope.unsyncedJSON[title].length; i++){
    			if (title == "People")	{
    				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON[title][i]['First Name'] + " "+ $rootScope.unsyncedJSON[title][i]['Last Name'];
    			}
    			else{
    				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON[title][i]['Name'];
    			}
			}

		$rootScope.chosenJSONlist = $rootScope.unsyncedJSON[title].concat (syncedJSON[title]);	
		}

		else {
			for (var i = 0; i < $rootScope.unsyncedJSON.ServiceEntries.length; i++){
				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON.ServiceEntries[i]['Name'];
			}

			$rootScope.chosenJSONlist = $rootScope.unsyncedJSON.ServiceEntries.concat (syncedJSON.ServiceEntries);
		}

    	$rootScope.listJSON = angular.extend ({},JSON,$scope.unsyncedListJSON);
        
        console.log($rootScope.chosenJSONlist);
        console.log($rootScope.listJSON);
        
        //filter our chosen JSONlist
        var filtered = $scope.filter($rootScope.chosenJSONlist, parent[$rootScope.level]);
        
        console.log(filtered);
        //then filter our listJSON
        $rootScope.listJSON = matchList($rootScope.listJSON, filtered);
        
    }
    
    
    
    //filter out list according to a specific criteria of a parent at a given level
    $scope.filter = function (unfilteredList, parent){
        var filteredList = [];
        
        if(parent == "Unique Identifier"){
            return;
        }
        filteredList = unfilteredList.filter(belongsToParent(parent));
        
        return filteredList;
    }
    
    //helper function
    function belongsToParent(parent){
        return function(object){
            if (object[parent] == $scope.clickedJSON[parent]){
                return object;
            }
        }
    }
    
    function matchList(listOptions, filteredOptionsData){
        var pairedList = {};
        
        for(listItem in listOptions){
            console.log(listOptions[listItem]);
            for(var opDatNdx = 0; opDatNdx < filteredOptionsData.length; opDatNdx++){
                if(listOptions[listItem] == filteredOptionsData[opDatNdx].Name){
                    pairedList[listItem] = listOptions[listItem];
                }
            }
        }
        
        return pairedList;
    }
    
    
    //custom back button functinality
    $scope.back = function(){
        
        if($rootScope.level > 0){
            $scope.regressiveListSwitch();
        }
        
        //conditional to fix problem of double
        //back when modal closed
        else if($rootScope.modalHidden != false){
            $ionicHistory.goBack();
        }

    }
    
    //required for ink ripple effect on material button press
    ionicMaterialInk.displayEffect();
})

// for when a new entry is being created
.controller('modalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter) {
	// create JSON
	$scope.JSON = {};
	// set imageData to null in case there is no picture
	$scope.imageData = null;
	// allow saves
	$scope.checked = false;
    $rootScope.modalHidden = true;
    $scope.modal = null;
    
    
    //open a modal for viewing
    //creates a new modal if one has not been instantiated
    //elsewise opens the old modal
    $scope.openModal = function() {
        $rootScope.modalHidden = false;
        
        // If a modal is not
        // already instantiated in this scope
        if($scope.modal == null){
            $ionicModal.fromTemplateUrl('templates/modal_templates/' + DynamicPage.getRoute() + '_modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
        
        //prevent show before modal create error
        if($scope.modal != null){
            $scope.modal.show();
        }
    };
    
    //close Modal
    $scope.closeModal = function() {
        if($scope.modal != null){
            $scope.modal.hide();
        }
        $rootScope.modalHidden = true;
    };
    
    //destroy modal to prevent memory leaks
    $scope.destroyModal = function() {       
        $rootScope.modalHidden = true;
        $scope.modal.remove().then (function (){
                $scope.JSON = {};
                $scope.modal = null;
        });

    };

  	// save JSON
	$scope.saveJSON = function (){
		// go to SaveNew factory
		SaveNew.save (DynamicPage.getTitle(), true, $scope.JSON, $rootScope.unsyncedJSON[DynamicPage.getTitle()], $scope.imageData);

		// add to list, related number is not useful, placeholder based on list length.
    	if (DynamicPage.getTitle() == "People")	{
    			$rootScope.listJSON [ObjectCounter.count ($rootScope.listJSON)] = $scope.JSON['First Name'] + " "+ $scope.JSON['Last Name'];
    		}
    	else{
    		$rootScope.listJSON [ObjectCounter.count ($rootScope.listJSON)] = $scope.JSON['Name'];
    	}
			$rootScope.chosenJSONlist.push ($scope.JSON);
	};


	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (imageData){
		Camera.checkPermissions();
		Camera.openGallery ().then (function (image){
    		$scope.imageData = image;
		});
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	// in root scope so it can be called from all buttons
	$rootScope.takePicture = function (imageData){
    	Camera.checkPermissions();
    	Camera.openCamera ().then (function (image){
    		$scope.imageData = image;
    	});
	}


	//wrapper for the GPS factory so we can call it from the getGPS button
	// in root scope so it can be called from all buttons
	$rootScope.getGPS = function (JSON){
		GPS.checkPermissions();
		GPS.getLocation(JSON);
	}
    
    $scope.back = function(){
        //conditional to fix problem of double
        //back when modal closed
        if($rootScope.modalHidden != false){
            $ionicHistory.goBack();
        }
    }

})

// document modal controller, works the same as the ModalController, but needs to be its on controller so in can show up inside a modal
.controller('DocumentModalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter ) {
    $scope.JSON = {};
	$scope.checked = false;
    $scope.template = 'templates/modal_templates/document_modal.html';
    $scope.modal = null;
    
    //set flag in root scope to indicate weither modal
    //hidden or shown
    $scope.openModal = function() {
        $rootScope.modalHidden = false;
        
        // If a modal is not
        // already instantiated in this scope
        // create a new modal
        if($scope.modal == null){
            $ionicModal.fromTemplateUrl($scope.template, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
        
        //prevent show before modal create error
        if($scope.modal != null){
            $scope.modal.show();
        }
    };
    
    
    $scope.closeModal = function() {
        if($scope.modal != null){
            $scope.modal.hide();
        }
        $rootScope.modalHidden = true;
    };

    
     $scope.destroyModal = function() {
        $scope.modal.remove().then (function (){
            $scope.JSON = {};  
        });
        $rootScope.modalHidden = true;
    };
    
    
	$scope.saveJSON = function (){
		// nulls entries that may not have any data
		$scope.JSON ['Network'] = null;
		$scope.JSON ['Site'] = null;
		$scope.JSON ['System'] = null;
		$scope.JSON ['Deployment'] = null;
		$scope.JSON ['Component'] = null;
		$scope.JSON ['Service Entry'] = null;

		// adds data for the entry the document is related to 
		var JSONbefore = DynamicPage.getJSON();
		$scope.JSON [DynamicPage.getTitle().slice (0,-1)] = JSONbefore [DynamicPage.getTitle().slice (0,-1)];

		// SaveNew factory
		SaveNew.save ("Documents", true, $scope.JSON, $rootScope.unsyncedJSON['Documents'], $scope.imageData);
    	$rootScope.documentlistJSON [ObjectCounter.count ($rootScope.documentlistJSON)] = $scope.JSON['Name'];

    	// pushes into list
		$rootScope.documentJSONlist.push ($scope.JSON);	

	};

    $scope.back = function(){
        //conditional to fix problem of double
        //back when modal closed
        if($rootScope.modalHidden != false){
            $ionicHistory.goBack();
        }
     };
})

//Controls the behavior of the service modals for particular networks, sites, sysyems etc
.controller('ServiceModalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter) {
    $scope.JSON = {};
	$scope.imageData = null;
	$scope.checked = false;
    $scope.modal = null;
    
    $scope.template = 'templates/modal_templates/serviceEntry_modal.html';
    

    //set flag in root scope to indicate weither modal
    //hidden or shown
    $scope.openModal = function() {
        $rootScope.modalHidden = false;
        
        // If a modal is not
        // already instantiated in this scope
        // create a new modal
        if($scope.modal == null){
            $ionicModal.fromTemplateUrl($scope.template, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            });
        }
        
        //prevent show before modal create error
        if($scope.modal != null){
            $scope.modal.show();
        }
    };
    
    $scope.closeModal = function() {
        if($scope.modal != null){
            $scope.modal.hide();
        }
        $rootScope.modalHidden = true;
    };
     $scope.destroyModal = function() {
        $scope.modal.remove().then ( function () {
            $scope.JSON = {};
        });
        $rootScope.modalHidden = true;
    };
    
    
	$scope.saveJSON = function (){
		// nulls entries that may not have any data
		$scope.JSON ['Site'] = null;
		$scope.JSON ['System'] = null;
		$scope.JSON ['Deployment'] = null;

		// adds data for the entry the service entry is related to 
		var JSON = DynamicPage.getJSON();
		$scope.JSON [DynamicPage.getTitle().slice (0,-1)] = JSON [DynamicPage.getTitle().slice (0,-1)];
		SaveNew.save ('Service Entries', true, $scope.JSON, $rootScope.unsyncedJSON.ServiceEntries, $scope.imageData);
		$rootScope.servicelistJSON [ObjectCounter.count ($rootScope.servicelistJSON)] = $scope.JSON['Name'];
		$rootScope.serviceJSONlist.push ($scope.JSON);	
	};

	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (imageData){
		Camera.checkPermissions();
		Camera.openGallery ().then (function (image){
    		$scope.imageData = image;
		});
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	// in root scope so it can be called from all buttons
	$rootScope.takePicture = function (imageData){
    	Camera.checkPermissions();
    	Camera.openCamera ().then (function (image){
    		$scope.imageData = image;
    	});
	}

    $scope.back = function(){
        //conditional to fix problem of double
        //back when modal closed
        if($rootScope.modalHidden != false){
            $ionicHistory.goBack();
        }
     };
})


/* Will be used to refactor current expandable text :/

.controller('TextAreaController', function($scope, $rootScope){
    
})
*/

