angular.module('app.controllers', ['ngRoute','ionic', 'app.services', 'ngCordova', 'angularUUID2', 'ngFileUpload', 'ngStorage', 'ngSanitize', 'initialValue'])

   
.controller('viewCtrl', function($scope, DynamicPage, ObjectCounter, $rootScope, $ionicHistory, $sce, SaveNew) {
	$scope.JSON = DynamicPage.getJSON();
	console.log ($scope.JSON);
	$scope.checked = true;
	if (DynamicPage.getTitle() != "Service Entries"){
		for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.JSON ['Unique Identifier'].toUpperCase() === $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier'].toUpperCase()){
				$scope.checked = false;
			}
		}
	}
	else{
		for (var i = 0; i < $rootScope.unsyncedJSON.ServiceEntries.length; i ++){
			if ($scope.JSON ['Unique Identifier'].toUpperCase() === $rootScope.unsyncedJSON.ServiceEntries[i]['Unique Identifier'].toUpperCase()){
				$scope.checked = false;
			}
		}	
	}

		switch (DynamicPage.getTitle()){
			case 'Networks':
					$scope.JSON['Principal Investigator'] = JSON.stringify($scope.JSON['Principal Investigator']);
				break;
				
			case 'Sites':
					$scope.JSON['Project'] = JSON.stringify($scope.JSON['Project']);
					$scope.JSON ['Permit Holder'] = JSON.stringify($scope.JSON['Permit Holder']);
					$scope.JSON ['Land Owner'] = JSON.stringify($scope.JSON['Land Owner']);
				break;
			case 'Systems':
					$scope.JSON['Manager'] = JSON.stringify($scope.JSON['Manager']);
					$scope.JSON['Site'] = JSON.stringify($scope.JSON['Site']);
				break;
			case 'Deployments':
					$scope.JSON ['System'] = JSON.stringify($scope.JSON['System']);
				break;
			case 'Components':
					$scope.JSON['Deployment'] = JSON.stringify($scope.JSON['Deployment']);
		}
    
     //custom back button functionality
     $scope.back = function(){
         $ionicHistory.goBack();
     }

	$scope.saveJSON = function (){
		for (var i = 0; i < $rootScope.unsyncedJSON[DynamicPage.getTitle()].length; i ++){
			if ($scope.JSON ['Unique Identifier'] == $rootScope.unsyncedJSON[DynamicPage.getTitle()][i]['Unique Identifier']){
				SaveNew.save (DynamicPage.getTitle(), false, $scope.JSON, $rootScope.unsyncedJSON[DynamicPage.getTitle()], null);	
			}
		}
	};

	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (imageData){
		Camera.checkPermissions();
		$scope.imageData = Camera.openGallery ();
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	// in root scope so it can be called from all buttons
	$rootScope.takePicture = function (imageData){
    		Camera.checkPermissions();
    		imageData = Camera.openCamera ();
	}


	//wrapper for the GPS factory so we can call it from the getGPS button
	// in root scope so it can be called from all buttons
	$rootScope.getGPS = function (JSON){
		GPS.checkPermissions();
		GPS.getLocation(JSON);
	}
})
   
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, $http, logger, $ionicModal, DynamicPage, ObjectCounter, File, $cordovaFile, $cordovaNetwork, $ionicLoading, $routeParams) {

	// create global variables
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

	$rootScope.servicelistJSON = {};
	$rootScope.serviceJSONlist = [];

	$rootScope.editJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };
	$rootScope.unsyncedJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };


	$rootScope.baseURL = "http://sensor.nevada.edu/GS/Services/";
	$rootScope.urlPaths = ["people", "networks", "sites", "systems", "deployments", "components", "documents","service_entries"];

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

    $scope.uploadJSONS = function(){
    	console.log ($rootScope.unsyncedJSON);
    	var promise = sync.post ($rootScope.baseURL+'edge/', $rootScope.unsyncedJSON);
    	console.log (promise);
    	$rootScope.unsyncedJSON = {People:[], Networks:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents:[], ServiceEntries:[] };
    }

    $scope.listSwitch = function (JSON, syncedJSON, title, route){
    	$scope.unsyncedListJSON = {};

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

    	$rootScope.listJSON = angular.extend ({},JSON,$scope.unsyncedListJSON)
    	DynamicPage.setTitle (title);
    	DynamicPage.setRoute (route);
    }

// only runs the first time the program is called. 
// Reads from the server and inputs into array
// TODO: add to local phone storage and read from there if server is unavaible
    var init = function (){
        
    	//get permissions
    	//unblock before packaging
    	//Camera.checkPermissions();
    	File.createDirectory();
 
    	// people read
    	var promise = $q (function (resolve, reject){$http.get($rootScope.baseURL + $rootScope.urlPaths[0]+"/").then (function(result){
    		console.log ($rootScope.baseURL + $rootScope.urlPaths[0]+"/" + " " + result.status +": " + result.statusText);
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


    //project read
    sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/", $rootScope.networkSyncedJSON, 'Network', $rootScope.networkJSON).then (function (result){
    	$rootScope.networkSyncedJSON = result;
    	File.checkandWriteFile('Network', $rootScope.networkSyncedJSON);
    })

    	//site read
    sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/", $rootScope.siteSyncedJSON,'Site', $rootScope.siteJSON).then(function(result){
    	$rootScope.siteSyncedJSON = result;
    	console.log (result);
    	File.checkandWriteFile('Site', $rootScope.siteSyncedJSON);
    });

    // 	system read
    sync.read($rootScope.baseURL + $rootScope.urlPaths[3]+"/", $rootScope.systemSyncedJSON, 'System', $rootScope.systemJSON).then (function(result){
    	$rootScope.systemSyncedJSON = result;
    	console.log (result);
    	File.checkandWriteFile('System', $rootScope.systemSyncedJSON);
    })

    // deployment read
    sync.read($rootScope.baseURL + $rootScope.urlPaths[4]+"/", $rootScope.deploymentSyncedJSON, 'Deployment', $rootScope.deploymentJSON).then (function(result){
    	$rootScope.deploymentSyncedJSON = result;
    	console.log (result);
    	File.checkandWriteFile('Deployment', $rootScope.deploymentSyncedJSON);
    });

    // component read
    sync.read($rootScope.baseURL + $rootScope.urlPaths[5]+"/", $rootScope.componentSyncedJSON, 'Component', $rootScope.componentJSON).then (function(result){
    	$rootScope.componentSyncedJSON = result;
    	File.checkandWriteFile('Component', $rootScope.componentSyncedJSON);
    });

    // 	document read
	sync.read($rootScope.baseURL + $rootScope.urlPaths[6]+"/", $rootScope.documentSyncedJSON, 'Document', $rootScope.documentJSON).then (function(result){
		console.log (result);
		$rootScope.documentSyncedJSON = result;
		File.checkandWriteFile('Document', $rootScope.documentSyncedJSON);
	});

   // 	service Entries read
     	var promise = $q (function (resolve, reject){$http.get($rootScope.baseURL + $rootScope.urlPaths[7]+"/").then (function(result){
    		console.log ($rootScope.baseURL + $rootScope.urlPaths[7]+"/" + " " + result.status +": " + result.statusText);
    		$rootScope.serviceSyncedJSON = result.data;
    		console.log (result.data);
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

var list = ["People","Networks", "Sites", "Systems", "Deployments", "Components", "Documents","ServiceEntries"];
    if (File.checkFile ('Unsynced')){
			  File.readFile ('Unsynced').then (function Success (response){
				if (response != null){
						for (var i = 0; i < list.length; i++){
							$rootScope.unsyncedJSON[list[i]] = $rootScope.unsyncedJSON[list[i]].concat (response[list[i]]);
						}
				console.log ($rootScope.unsyncedJSON);
				}
			})

	}
}
    
    //Indicating Initilaize is loading
    $ionicLoading.show({
            templateUrl: 'templates/loadingSpinner.html',
            noBackdrop: false
    });
    
    //initalize
    init ();
    
    //hide loading screen
    $ionicLoading.hide();
//}

})

/**
    Controller handles scroll functionality,
    binds to arrow objects,
    hides arrow objects
*/
.controller('scrollController', function($scope, $state, $ionicScrollDelegate, logger) {
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

.controller('listCtrl', function($scope, $rootScope, DynamicPage, $state, ObjectCounter, $ionicHistory, ionicMaterialInk, $ionicLoading) {
	$scope.title = DynamicPage.getTitle();
	$scope.route = DynamicPage.getRoute();

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		$scope.title = DynamicPage.getTitle();
		$scope.route = DynamicPage.getRoute();
	})

	// wrapper for person select button
	$scope.select = function(JSON){
        /*Ionic Loading*/
        $ionicLoading.show({
            templateUrl: 'templates/directive_templates/loading-spinner.html',
            noBackdrop: true
        });
        
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
		
        $ionicLoading.hide();
        
		$state.go ($scope.route);
	}
    
    //custom back button functinality
    $scope.back = function(){
        //conditional to fix problem of double
        //back when modal closed
        if($rootScope.modalHidden != false){
            $ionicHistory.goBack();
        }
    }
    
    //required for ink ripple effect on material button press
    ionicMaterialInk.displayEffect();
})

.controller('modalController', function($scope, $rootScope, $state, $ionicModal, DynamicPage, SaveNew, $cordovaCamera, Camera, GPS, $sce, $ionicHistory, ObjectCounter) {

	$scope.JSON = {};
	$scope.imageData = null;
	$scope.checked = false;
    $scope.template = 'templates/modal_templates/' + DynamicPage.getRoute() + '_modal.html';
    
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
    
    //close Modal
    $scope.closeModal = function() {
        $scope.modal.hide();
        $rootScope.modalHidden = true;
    };
    
    //destroy modal to prevent memory leaks
    $scope.destroyModal = function() {
        $rootScope.modalHidden = true;
        $scope.modal.remove();
        $scope.modal = null;
    };

    
    
	$scope.saveJSON = function (){
		SaveNew.save (DynamicPage.getTitle(), true, $scope.JSON, $rootScope.unsyncedJSON[DynamicPage.getTitle()], $scope.imageData);

    	if (DynamicPage.getTitle() == "People")	{
    			$rootScope.listJSON [ObjectCounter.count ($rootScope.listJSON)] = $scope.JSON['First Name'] + " "+ $scope.JSON['Last Name'];
    		}
    		else{
    			$rootScope.listJSON [ObjectCounter.count ($rootScope.listJSON)] = $scope.JSON['Name'];
    		}
			$rootScope.chosenJSONlist.push ($scope.JSON);
        
			console.log ($scope.unsyncedJSON);	
			console.log ($rootScope.chosenJSONlist);
	};


	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (imageData){
		Camera.checkPermissions();
		$scope.imageData = Camera.openGallery ().then (function (image){
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
        $scope.modal.hide();
        $rootScope.modalHidden = true;
    };

    
     $scope.destroyModal = function() {
        $scope.modal.remove();
        $rootScope.modalHidden = true;
    };
    
    
	$scope.saveJSON = function (){
		$scope.JSON ['Network'] = null;
		$scope.JSON ['Site'] = null;
		$scope.JSON ['System'] = null;
		$scope.JSON ['Deployment'] = null;
		$scope.JSON ['Component'] = null;
		$scope.JSON ['Service Entry'] = null;

		var JSON = DynamicPage.getJSON();
		$scope.JSON [DynamicPage.getTitle().slice (0,-1)] = JSON [DynamicPage.getTitle().slice (0,-1)];

		SaveNew.save ("Documents", true, $scope.JSON, $rootScope.unsyncedJSON['Documents'], $scope.imageData);
    	$rootScope.listJSON [ObjectCounter.count ($rootScope.listJSON)] = $scope.JSON['Name'];
		$rootScope.chosenJSONlist.push ($scope.JSON);	
		console.log ($scope.JSON);
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
        $scope.modal.hide();
        $rootScope.modalHidden = true;
    };
     $scope.destroyModal = function() {
        $scope.modal.remove();
        $rootScope.modalHidden = true;
    };
    
    
	$scope.saveJSON = function (){
		$scope.JSON ['Site'] = null;
		$scope.JSON ['System'] = null;
		$scope.JSON ['Deployment'] = null;

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
		$scope.imageData = Camera.openGallery ().then (function (image){
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

