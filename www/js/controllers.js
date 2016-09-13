angular.module('app.controllers', ['ngRoute','ionic', 'app.services', 'ngCordova', 'angularUUID2', 'ngStorage'])

   // used to view JSONs that have already been created.
.controller('viewCtrl', function($scope, DynamicPage, ObjectCounter, $rootScope, $ionicHistory, $sce, SaveNew, Camera, GPS) {
	// get the JSON
	var related;
	$scope.document = false;
	$scope.service = false;
	//http://stackoverflow.com/questions/4878756/javascript-how-to-capitalize-first-letter-of-each-word-like-a-2-word-city
	$scope.title = DynamicPage.getRoute().charAt(0).toUpperCase() + DynamicPage.getRoute().substr(1).toLowerCase() + 's';

	$scope.JSON = DynamicPage.getJSON();
	if ( angular.isDefined ($scope.JSON ['Photo'])){
		$scope.imageData = $scope.JSON ['Photo'];
	}


console.log ($scope.title)
	// loads the data into the page based on the title of the page
	switch ($scope.title){
		case 'Networks':
				$scope.service = true;
				$scope.JSON['Principal Investigator'] = JSON.stringify($scope.JSON['Principal Investigator']);
			break;
				
		case 'Sites':
                related = $scope.JSON['Network'];
				$scope.JSON ['Permit Holder'] = JSON.stringify($scope.JSON['Permit Holder']);
				$scope.JSON ['Land Owner'] = JSON.stringify($scope.JSON['Land Owner']);
			break;

		case 'Systems':
				$scope.JSON['Manager'] = JSON.stringify($scope.JSON['Manager']);
				related = $scope.JSON['Site'];
			break;

		case 'Deployments':
				related = $scope.JSON['System'];
			break;

		case 'Components':
				$scope.service = true;
				related = $scope.JSON['Deployment'];
			break;

		case 'Serviceentriess':
				$scope.service = true;
			break;	

	}
    
     //custom back button functionality
    $scope.back = function(){ $ionicHistory.goBack(); }

    // save JSON button
	$scope.saveJSON = function (){
				SaveNew.save ($scope.title, false, $scope.JSON, $rootScope.unsyncedJSON[$scope.title], null, related);	
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

.controller('LoginController', function($ionicModal, $scope, $rootScope, $q, Login){
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
            $ionicModal.fromTemplateUrl('templates/login.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
                $scope.modal = modal;
                $scope.modal.show();
            })

        }
    };
    
    //close Modal
    $scope.closeModal = function() {
        /*if($scope.modal != null){
            $scope.modal.hide();
        }*/
        $scope.modal.remove().then (function (){
                $scope.modal = null;
        });
        $rootScope.modalHidden = true;
    };
    
    //destroy modal to prevent memory leaks
    $scope.destroyModal = function() {       
        return $q(function (resolve, reject){
        	$rootScope.modalHidden = true;
        	$scope.modal.remove().then (function (){
                $scope.modal = null;
                resolve();
        	});
        })

    };


    $scope.login = function (){
        $scope.destroyModal().then(function (){
        	Login.adminLogin ($scope.loginJSON).then (function Success (response){
        		$rootScope.associatedNetworks = response;
            	$rootScope.loggedIn = true;
            	$scope.loginJSON ['Username'] = null;
        		$scope.loginJSON ['Password'] = null;
        	}, function Failure (error){
            	$rootScope.associatedNetworks = error;
            	$rootScope.loggedIn = false;
        		$scope.loginJSON ['Password'] = null;
        	});


      	})
    }


})
  
 // controller for the main menu  
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, Login, $http, $ionicModal, DynamicPage, ObjectCounter, File, $cordovaFile, $cordovaNetwork, $ionicLoading, $routeParams) {
		function onDeviceReady() {
			$rootScope.platform = device.platform;
		}
		DynamicPage.setTitle ("Networks");
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

	// special lists for service entries for list
	$rootScope.servicelistJSON = {};
	$rootScope.serviceJSONlist = [];
	$rootScope.serviceEntryListJSON = [];

	// special lists for documents for listView
	$rootScope.documentlistJSON = {};
	$rootScope.documentJSONlist = [];
	$rootScope.docListJSON = [];

	//$rootScope.editJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };
	$rootScope.unsyncedJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };
    
    //levels for tiered traversal of
    //lists
    $rootScope.listLevel = 0;
    $rootScope.itemLevel = 0;
    
    //global variable holding the current listTraversalHistory
    $rootScope.traversalHistory = [];

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

  	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		// for when user hits the back bottom arrow to head back to the main menu
		if (fromState.name == "list" && toState.name == "mainMenu"){
         $rootScope.itemLevel =  0;
         $rootScope.listLevel =  0;
		}
	})  
    
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

    //calls for the next tier of
    //items in the site network hierarchy
    $scope.progressiveListSwitch = function(){
        var tieredTitles = ["Networks", "Sites", "Systems", "Deployments", "Components"];
        var tieredRoutes = ["network", "site", "system", "deployment", "component"];
        var tieredJSON = [$rootScope.networkJSON,$rootScope.siteJSON,$rootScope.systemJSON,$rootScope.deploymentJSON,$rootScope.componentJSON];
        var tieredSyncedJSON = [$rootScope.networkSyncedJSON,$rootScope.siteSyncedJSON,$rootScope.systemSyncedJSON,$rootScope.deploymentSyncedJSON,$rootScope.componentSyncedJSON];
		$scope.temp = [];
       
           		// should work to sort list based on log in
        	$scope.temp = {};
        	for (var j = 0; j < $rootScope.associatedNetworks.length; j++){
        		for ( var i = 0; i < $rootScope.networkSyncedJSON.Networks.length; i ++){
        			if ($rootScope.associatedNetworks [j]['Network ID'] == $rootScope.networkSyncedJSON.Networks [i]['Unique Identifier']){
        				        $scope.temp[$scope.temp.length] = $rootScope.networkSyncedJSON.Networks [i];
        			}
        		}
        	}
        	$rootScope.listLevel.Networks = [];
        	$rootScope.listLevel.Networks = $scope.temp;
            $scope.listSwitch(tieredSyncedJSON, tieredTitles, $rootScope.listLevel);       	
               
        DynamicPage.setJSON();
        //store the json of the
        //list item clicked
        $scope.clickedJSON = DynamicPage.getJSON();
        
        //set the route of dynamic page one level back
        //so we can view the info of what we just clicked
        DynamicPage.setTitle(tieredTitles[$rootScope.listLevel]);
        DynamicPage.setRoute(tieredRoutes[$rootScope.itemLevel]);
         
        $scope.route = DynamicPage.getRoute();
        $scope.title = DynamicPage.getTitle();
        
    }
    
    
    $scope.listSwitch = function(syncedJSONs, titles, level){
    	$scope.unsyncedListJSON = {};
        var title = titles[level];
        var syncedJSON = syncedJSONs[level];

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

		  $rootScope.chosenJSONlist = $rootScope.unsyncedJSON[title].concat(syncedJSON[title]);	
		}



		else {
			for (var i = 0; i < $rootScope.unsyncedJSON.ServiceEntries.length; i++){
				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON.ServiceEntries[i]['Name'];
			}

			$rootScope.chosenJSONlist = $rootScope.unsyncedJSON.ServiceEntries.concat (syncedJSON.ServiceEntries);
		}

        $rootScope.listJSON = $rootScope.chosenJSONlist;	       
    }

        //helper function
    function belongsToParent(parent, presentJSON){
        return function(object){
            if (object[parent] == presentJSON[parent]){
                return object;
            }
        }
    }

// only runs the first time the program is called. 
// Reads from the server and inputs into array
    $scope.init = function (){
        $scope.show();
    	//get permissions
    	//unblock before packaging
    	//Camera.checkPermissions();
	$q (function (resolve, reject){
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
			resolve();
		}
	}).then (function () {
 		$q (function (resolve, reject){
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
			resolve ();
    	})
   	}).then (function () {
 		$q (function (resolve, reject){

    	// site network read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/", $rootScope.networkSyncedJSON, 'Network', $rootScope.networkJSON).then (function (result){
    		// redudant, but nessecary.  Doesnt work otherwise for some reason
    		$rootScope.networkSyncedJSON = result;
    		// writes to local storage
    		File.checkandWriteFile('Network', $rootScope.networkSyncedJSON);
    		resolve ();
    	})
    }).then (function () {
 		$q (function (resolve, reject){

    	// site read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/", $rootScope.siteSyncedJSON,'Site', $rootScope.siteJSON).then(function(result){
    		$rootScope.siteSyncedJSON = result;
    		File.checkandWriteFile('Site', $rootScope.siteSyncedJSON);
    		resolve();
    	});

    }).then (function () {
 		$q (function (resolve, reject){

    	// system read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[3]+"/", $rootScope.systemSyncedJSON, 'System', $rootScope.systemJSON).then (function(result){
    		$rootScope.systemSyncedJSON = result;
    		File.checkandWriteFile('System', $rootScope.systemSyncedJSON);
    		resolve();
    	})
    }).then (function () {
 		$q (function (resolve, reject){

    	// deployment read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[4]+"/", $rootScope.deploymentSyncedJSON, 'Deployment', $rootScope.deploymentJSON).then (function(result){
    		$rootScope.deploymentSyncedJSON = result;
    		File.checkandWriteFile('Deployment', $rootScope.deploymentSyncedJSON);
    		resolve();
    	})
    }).then (function () {
 		$q (function (resolve, reject){

    	// component read
    	sync.read($rootScope.baseURL + $rootScope.urlPaths[5]+"/", $rootScope.componentSyncedJSON, 'Component', $rootScope.componentJSON).then (function(result){
    		$rootScope.componentSyncedJSON = result;
    		File.checkandWriteFile('Component', $rootScope.componentSyncedJSON);
    		resolve();
    	});
    }).then (function () {
 		$q (function (resolve, reject){

    	// 	document read
		sync.read($rootScope.baseURL + $rootScope.urlPaths[6]+"/", $rootScope.documentSyncedJSON, 'Document', $rootScope.documentJSON).then (function(result){
			$rootScope.documentSyncedJSON = result;
			File.checkandWriteFile('Document', $rootScope.documentSyncedJSON);
			resolve()
		});
	}).then (function () {
 		$q (function (resolve, reject){

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
				resolve();
			}
    	})
  	 }).then (function (){
   		 //hide loading screen
   		 $ionicLoading.hide();
  	 })})})})})})})})})

	}

    $scope.show = function(){
    	//Indicating Initilaize is loading
    	$ionicLoading.show({
    		template: '<div class="loading-spinner spinner"> <div class="loading-spinner-inner spinner-rev"></div></div>',
    		//template says its not loading
        	//templateUrl: './directive_templates/loadingSpinner.html',
        	noBackdrop: false
    	});
    }

    //initalize
    $scope.init ();
    
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
.controller('listCtrl', function($scope, $rootScope, DynamicPage, $state, ObjectCounter, $ionicHistory, ionicMaterialInk, $ionicLoading, $q) {
	//local variables to the controller
        var tieredTitles = ["Networks", "Sites", "Systems", "Deployments", "Components"];
        var tieredRoutes = ["network", "site", "system", "deployment", "component"];
        var parent = ["Unique Identifier", "Network", "Site", "System", "Deployment"];
        var tieredSyncedJSON =[$rootScope.networkSyncedJSON, $rootScope.siteSyncedJSON, $rootScope.systemSyncedJSON, $rootScope.deploymentSyncedJSON, $rootScope.componentSyncedJSON];
        
        $scope.clickedJSONHist = [];
    
    // gets data from the DynamicPage factory. Only works on first load
    $scope.title = DynamicPage.getTitle();
    $scope.route = DynamicPage.getRoute();
    $scope.modalCheck = true;

    if (angular.isDefined (DynamicPage.getJSON())){
    	$scope.UUID = DynamicPage.getJSON()['Unique Identifier'];

    	for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.UUID == $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier']){
				$scope.modalCheck = false;
			}
		}
	}

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		// works on every load after
		$scope.title = DynamicPage.getTitle();
		$scope.route = DynamicPage.getRoute();
	})

	// wrapper for person select button
	$scope.select = function(JSON){
		DynamicPage.getRoute();
		if (angular.isDefined (JSON)){
			$rootScope.related = JSON [DynamicPage.getTitle().slice (0, -1)];
		}

        DynamicPage.setJSON(JSON);
	}
    
    //enables the viewing of our currently selected
    //JSON
    $scope.viewItem = function(){
        $state.go($scope.route);
    }
    
    
    function storePrevJSON(){
        var previousViewJSON = $scope.clickedJSON;
        if($scope.clickedJSONHist.length < 5){    
            $scope.clickedJSONHist.push(previousViewJSON);
        }
    }
    
    //calls for the next tier of
    //items in the site network hierarchy
    $scope.progressiveListSwitch = function(){
    	$scope.modalCheck = true;
        //store my previous view's JSON for return
        storePrevJSON();

    if (angular.isDefined (DynamicPage.getJSON())){
    	$scope.UUID = DynamicPage.getJSON()['Unique Identifier'];
    	for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.UUID == $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier']){
				$scope.modalCheck = false;
			}
		}

	}
        
        //increment the level of my list and of my
        //item clicked until we hit the bottom list
        //presently components
        if($rootScope.listLevel < (tieredTitles.length - 1)){
            $rootScope.listLevel++;
        }
        
        //determine the level of our selected route
        if($rootScope.itemLevel < 3){
            $rootScope.itemLevel = $rootScope.listLevel - 1;
        } else {
            $rootScope.itemLevel = 4;
        }
        $scope.level = $rootScope.listLevel;

        $scope.listSwitch(tieredSyncedJSON, tieredTitles, $rootScope.listLevel);
		 $rootScope.listLevel = $scope.level;


        //store the json of the
        //list item clicked
        $scope.clickedJSON = DynamicPage.getJSON();


        //set the route of dynamic page one level back
        //so we can view the info of what we just clicked
        DynamicPage.setTitle(tieredTitles[$rootScope.listLevel]);
        DynamicPage.setRoute(tieredRoutes[$rootScope.itemLevel]);
        
        
        $scope.route = DynamicPage.getRoute();
        $scope.title = DynamicPage.getTitle();

		if ($scope.title.localeCompare ("Networks")){
			$scope.viewInfo = true;
		}
		else
			$scope.viewInfo = false;
        
        
        console.log(tieredRoutes[$rootScope.itemLevel], $rootScope.itemLevel, tieredTitles[$rootScope.listLevel], $rootScope.listLevel);
    }
    
    //navigate in the opposite direction
    $scope.regressiveListSwitch = function(){
        //increment the level of my list and of my
        //item clicked until we hit the bottom list
        //presently components
	$scope.modalCheck = true;

    if (angular.isDefined (DynamicPage.getJSON())){
    	$scope.UUID = DynamicPage.getJSON()['Unique Identifier'];
    	for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.UUID == $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier']){
				$scope.modalCheck = false;
			}
		}
	}

        if ($rootScope.listLevel != 0){
        	if($rootScope.listLevel != $rootScope.itemLevel){
            	$rootScope.listLevel--;
        	}
        
       		 //determine the level of our selected route
       		 if($rootScope.itemLevel != 4){
           		 $rootScope.itemLevel = $rootScope.listLevel - 1;
        		} else {
           		 $rootScope.itemLevel--;
       		 }
        
        	$scope.listSwitch(tieredSyncedJSON, tieredTitles, $rootScope.listLevel);
        
        	$scope.select($scope.clickedJSONHist.pop());
        }
        //store the json of the
        //list item clicked
        $scope.clickedJSON = DynamicPage.getJSON();
        
        //set the route of dynamic page one level back
        //so we can view the info of what we just clicked
        // if ($rootScope.listLevel < 0)
        // 	$rootScope.listLevel ++;
        DynamicPage.setTitle(tieredTitles[$rootScope.listLevel]);
        DynamicPage.setRoute(tieredRoutes[$rootScope.itemLevel]);
        
        
        $scope.route = DynamicPage.getRoute();
        $scope.title = DynamicPage.getTitle();

		if ($scope.title.localeCompare ("Networks")){
			$scope.viewInfo = true;
		}
		else
			$scope.viewInfo = false;
         
        console.log(tieredRoutes[$rootScope.itemLevel], $rootScope.itemLevel, tieredTitles[$rootScope.listLevel], $rootScope.listLevel);
    }
    
    
    $scope.listSwitch = function(syncedJSONs, titles, level){
    	      //  console.log ("hello");
    	$scope.unsyncedListJSON = {};
        var title = titles[level];
        var syncedJSON = syncedJSONs[level];
        
        //reset the title with every 
		$scope.title = title;

    	var promise = $q (function (resolve, reject){
    		if (title != "Service Entries"){
    		for (var i = 0; i < $rootScope.unsyncedJSON[title].length; i++){
    			if (title == "People")	{
    				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON[title][i]['First Name'] + " "+ $rootScope.unsyncedJSON[title][i]['Last Name'];
    			}
    			else{
    				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON[title][i]['Name'];
    			}
			}

		  $rootScope.chosenJSONlist = $rootScope.unsyncedJSON[title].concat(syncedJSON[title]);	
		}

		else {
			for (var i = 0; i < $rootScope.unsyncedJSON.ServiceEntries.length; i++){
				$scope.unsyncedListJSON[i] = $rootScope.unsyncedJSON.ServiceEntries[i]['Name'];
			}

			$rootScope.chosenJSONlist = $rootScope.unsyncedJSON.ServiceEntries.concat (syncedJSON.ServiceEntries);
		}
		resolve ($rootScope.chosenJSONlist);
	});
    
    promise.then ( function success (){
        $rootScope.listJSON = $scope.filter($rootScope.chosenJSONlist, level);
    })
   }
    
    
    
    //filter out list according to a specific criteria of a parent at a given level
    $scope.filter = function (unfilteredList, listLevel){
    	       // console.log ("hello");
        var parentName = parent[listLevel];
        var lastClickedJSON = DynamicPage.getJSON();
        var filteredList = [];
        if(parent[listLevel] == "Unique Identifier"){
        	//console.log ($rootScope.chosenJSONlist, unfilteredList);
            return unfilteredList;
        }
        else {
        	filteredList = unfilteredList.filter(belongsToParent(parentName, lastClickedJSON));
        	return filteredList;
        }
    }
    
    //helper function
    function belongsToParent(parent, presentJSON){
        return function(object){
            if (object[parent] == presentJSON[parent]){
                return object;
            }
        }
    }


    //custom back button functinality
    $rootScope.back = function(){
        if($rootScope.itemLevel >= 0){
            $scope.regressiveListSwitch();
        }
        else{
            if($rootScope.modalHidden != false){
                $ionicHistory.goBack();
                //reset list levels
                $rootScope.itemLevel =  0;
                $rootScope.listLevel =  0;
        
            }
        }
    }
    
    //required for ink ripple effect on material button press
    ionicMaterialInk.displayEffect();
})

.controller('documentListCtrl', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $ionicHistory) {
	$scope.documentList = function (selectedTitle, selected){
		// setting up the page
        //store the json of the
        //list item clicked
        $rootScope.docListJSON = [];
        $rootScope.docJSON = selected;
    	$scope.temp = $rootScope.documentSyncedJSON['Documents'].concat ($rootScope.unsyncedJSON['Documents']);
    	for (var i = 0; i < $scope.temp.length; i ++){
    		if (angular.isDefined ($scope.temp[i][selectedTitle]) && ($scope.temp[i][selectedTitle] == selected[selectedTitle])){
    			$rootScope.docListJSON.push ($scope.temp[i]);
    		}
    	}
    }

    //custom back button functinality
    $scope.backList = function(){
    	DynamicPage.setRoute ($rootScope.storedRoute);
    	DynamicPage.setJSON ($rootScope.storedJSON);
		$rootScope.docListJSON = [];
		$ionicHistory.goBack();
    }

    $scope.select = function(item){
    	$rootScope.storedRoute = DynamicPage.getRoute();
    	DynamicPage.setRoute ('Document');
    	$rootScope.storedJSON = DynamicPage.getJSON();
    	DynamicPage.setJSON (item);
    	$state.go ('document');
    }

})


.controller('ServiceListCtrl', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $ionicHistory) {
	$scope.serviceList = function (selectedTitle, selected){
		// setting up the page
        //store the json of the
        //list item clicked
        $rootScope.serviceEntryListJSON = [];
        $rootScope.seJSON = selected;
        console.log ($rootScope.serviceSyncedJSON);
    	$scope.temp = $rootScope.serviceSyncedJSON['ServiceEntries'].concat ($rootScope.unsyncedJSON['ServiceEntries']);
    	for (var i = 0; i < $scope.temp.length; i ++){
    		if (angular.isDefined ($scope.temp[i][selectedTitle]) && ($scope.temp[i][selectedTitle] == selected[selectedTitle])){
    			$rootScope.serviceEntryListJSON.push ($scope.temp[i]);
    		}
    	}
    }

    //custom back button functinality
    $scope.backList = function(){
    	DynamicPage.setRoute ($rootScope.storedRoute);
    	DynamicPage.setJSON ($rootScope.storedJSON);
		$rootScope.serviceEntryListJSON = [];
		$ionicHistory.goBack();
    }

    $scope.select = function(item){
    	$rootScope.storedRoute = DynamicPage.getRoute();
    	DynamicPage.setRoute ('ServiceEntries');
    	$rootScope.storedJSON = DynamicPage.getJSON();
    	DynamicPage.setJSON (item);
    	$state.go ('serviceEntry');
    }

})

// for when a new entry is being created
.controller('modalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter) {

	// set imageData to null in case there is no picture
	$scope.imageData = null;
	// allow saves
	$scope.checked = false;
    $rootScope.modalHidden = true;
    $scope.modal = null;
    
    // var getModalRoute = function(selectedRoute){
    //     var tieredRoutes = ["network", "site", "system", "deployment", "component"];
    //     var newRouteNdx = tieredRoutes.indexOf(DynamicPage.getRoute());
        
    //     if (newRouteNdx == 4){
    //         return tieredRoutes[newRouteNdx];
    //     }
    //     else {
    //    		newRouteNdx++;
    //     	return tieredRoutes[newRouteNdx];
    //     }
    // }
    
    //open a modal for viewing
    //creates a new modal if one has not been instantiated
    //elsewise opens the old modal
    $scope.openModal = function() {
        $rootScope.modalHidden = false;
            $scope.modal = null;
        // If a modal is not
        // already instantiated in this scope;
        if($scope.modal == null){
            $ionicModal.fromTemplateUrl('templates/modal_templates/' + DynamicPage.getTitle() + '_modal.html', {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
            	// create JSON
				$scope.JSON = {};
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
        /*if($scope.modal != null){
            $scope.modal.hide();
        }*/
        $scope.modal.remove().then (function (){
                $scope.JSON = {};
                $scope.modal = null;
        });
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
		SaveNew.save (DynamicPage.getTitle(), true, $scope.JSON, $rootScope.unsyncedJSON[DynamicPage.getTitle()], $scope.imageData, $rootScope.related);
		// I have no idea why it doesnt work with Networks
		if (DynamicPage.getTitle() != "Networks")
			$rootScope.listJSON.push ($scope.JSON);
		$rootScope.chosenJSONlist.push($scope.JSON);
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
            $scope.modal = null;
        }
    }

})

// document modal controller, works the same as the ModalController, but needs to be its on controller so in can show up inside a modal
.controller('DocumentModalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter ) {
	$scope.checked = false;
    $scope.template = 'templates/modal_templates/Documents_modal.html';
    $scope.modal = null;
    
    //set flag in root scope to indicate weither modal
    //hidden or shown
    $scope.openModal = function(JSON) {
        $rootScope.modalHidden = false;
        // If a modal is not
        // already instantiated in this scope
        // create a new modal
        if($scope.modal == null){
            $ionicModal.fromTemplateUrl($scope.template, {
                scope: $scope,
                animation: 'slide-in-up'
            }).then(function(modal) {
            	$scope.JSON = {};
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
            $scope.modal = null;
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
		$scope.JSON [DynamicPage.getRoute().charAt(0).toUpperCase() + DynamicPage.getRoute().slice(1)] = $rootScope.docJSON [DynamicPage.getRoute().charAt(0).toUpperCase() + DynamicPage.getRoute().slice(1)];
		// SaveNew factory
		SaveNew.save ("Documents", true, $scope.JSON, $rootScope.unsyncedJSON['Documents'], $scope.imageData);
		// pushes into list
		$rootScope.docListJSON.push ($scope.JSON);	

	};

    $scope.back = function(){
        //conditional to fix problem of double
        //back when modal closed
        if($rootScope.modalHidden != false){
            $ionicHistory.goBack();
            console.log ($ionicHistory.goBack())
        }
     };
})

//Controls the behavior of the service modals for particular networks, sites, sysyems etc
.controller('ServiceModalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter) {
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
            	$scope.JSON = {};
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
            $scope.modal = null;
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
		$scope.JSON [DynamicPage.getRoute().charAt(0).toUpperCase() + DynamicPage.getRoute().slice(1)] = JSON [DynamicPage.getRoute().charAt(0).toUpperCase() + DynamicPage.getRoute().slice(1)];
		SaveNew.save ('Service Entries', true, $scope.JSON, $rootScope.unsyncedJSON.ServiceEntries, $scope.imageData);
		// pushes into list
		$rootScope.serviceEntryListJSON.push ($scope.JSON);	
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

