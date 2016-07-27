angular.module('app.controllers', ['ionic', 'app.services', 'ngCordova', 'angularUUID2', 'ngFileUpload', 'ngStorage'])

//the controller for the people view  
.controller('peopleCtrl', function($scope, $rootScope, uuid2, Upload, logger, $ionicPlatform, Camera) {

	// variables stored in people
	$scope.imageData = null;
	$scope.JSON = {};
	$scope.JSON ["Photo"] = null;
	//JSON fucntion for people
	$scope.savePeopleJSON = function (){
			$scope.JSON ["Creation Date"] = new Date();
			$scope.JSON ["Modification Date"] = new Date();
			$scope.JSON ["Unique Identifier"] = uuid2.newuuid();

			$scope.JSON  ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON));

			$rootScope.unsyncedJSON.People.push ($scope.JSON);
			console.log ($rootScope.unsyncedJSON);

			$scope.JSON = {};
	}


	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (imageData){
		Camera.checkPermissions();
		$scope.imageData = Camera.openGallery ();
		
		if (angular.isUndefined (imageData) || imageData == null)
			console.log("null");
		else
			console.log("full");
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	// in root scope so it can be called from all buttons
	$rootScope.takePicture = function (imageData){
    		Camera.checkPermissions();
    		imageData = Camera.openCamera ();
	}

})

   
.controller('projectCtrl', function($scope, $rootScope, uuid2, logger, ObjectCounter) {
	//variables stored in projects
	$scope.JSON = {};

	// JSON function for project
	$scope.saveProjectJSON = function (){

		$scope.JSON ["Creation Date"] = new Date();
		$scope.JSON ["Started Date"] = new Date();
		$scope.JSON ["Modification Date"] = new Date();
		$scope.JSON ["Unique Identifier"] = uuid2.newuuid();
		$scope.JSON ["Principal Investigator"] = parseInt ($scope.JSON ["Principal Investigator"]);


		// print json to console for debugging
		logger.log (JSON.stringify($scope.JSON));
		$rootScope.unsyncedJSON.Projects.push ($scope.JSON);


		$scope.JSON = {};
        
	}
    
})
   
.controller('viewCtrl', function($scope, DynamicPage, ObjectCounter, $rootScope, $ionicHistory) {

	$scope.JSON = DynamicPage.getJSON();
		switch (DynamicPage.getTitle()){
			case 'Projects':
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
})


.controller('siteCtrl', function($scope, $rootScope, uuid2, Upload, logger, $ionicPlatform, Camera, GPS) {

	// variables stored in site
	$scope.JSON = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.saveSiteJSON = function (){
			$scope.JSON  ["Creation Date"] = new Date();
			$scope.JSON  ["Modification Date"] = new Date();
			$scope.JSON  ["Unique Identifier"] = uuid2.newuuid();
			$scope.JSON ["Project"] = parseInt ($scope.JSON ["Project"]);
			$scope.JSON ["Permit Holder"] = parseInt ($scope.JSON ["Permit Holder"]);
			$scope.JSON ["Land Owner"] = parseInt ($scope.JSON ["Land Owner"]);

			//$scope.site ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON ));
			$rootScope.unsyncedJSON.Sites.push ($scope.JSON);

			$scope.JSON  = {};
	}

	//wrapper for the GPS factory so we can call it from the getGPS button
	// in root scope so it can be called from all buttons
	$rootScope.getGPS = function (JSON){
		GPS.checkPermissions();
		GPS.getLocation(JSON);
	}

})


   
.controller('systemCtrl', function($scope, $rootScope, uuid2, Upload, logger) {
	
	// variables stored in system
	$scope.JSON = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.saveSystemJSON = function (){
			$scope.JSON ["Creation Date"] = new Date();
			$scope.JSON ["Modification Date"] = new Date();
			$scope.JSON ["Unique Identifier"] = uuid2.newuuid();
			$scope.JSON ["Manager"] = parseInt ($scope.JSON ["Manager"]);
			$scope.JSON ["Site"] = parseInt ($scope.JSON ["Site"]);

			//$scope.site ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON));
			rootScope.unsyncedJSON.Systems.push ($scope.JSON);


			$scope.JSON = {};
	}

})
   
   
.controller('deploymentCtrl', function($scope, $rootScope, uuid2, Upload, logger, GPS) {

	// variables stored in system
	$scope.JSON = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.saveDeploymentJSON = function (){
			$scope.JSON ["Creation Date"] = new Date();
			$scope.JSON ["Modification Date"] = new Date();
			$scope.JSON ["Unique Identifier"] = uuid2.newuuid();
			$scope.JSON ["System"] = parseInt ($scope.JSON ["System"]);

			//$scope.site ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON));
			$rootScope.unsyncedJSON.Deployments.push ($scope.JSON);

			$scope.JSON = {};
	}

})
   

   
.controller('componentCtrl', function($scope, $rootScope, uuid2, Upload, logger, Camera) {
	$scope.JSON = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.saveComponentJSON = function (){
			$scope.JSON ["Creation Date"] = new Date();
			$scope.JSON ["Modification Date"] = new Date();
			$scope.JSON ["Unique Identifier"] = uuid2.newuuid();
			$scope.JSON ["Deployment"] = parseInt ($scope.JSON ["Deployment"]);

			//$scope.site ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON));
			$rootScope.unsyncedJSON.Components.push ($scope.JSON);

			$scope.JSON = {};
	}
})
   
   
.controller('documentCtrl', function($scope, $rootScope, uuid2, Upload, logger) {
	// variables stored in document
	$scope.JSON = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.saveDocumentJSON = function (){
			$scope.JSON ["Creation Date"] = new Date();
			$scope.JSON ["Modification Date"] = new Date();
			$scope.JSON ["Unique Identifier"] = uuid2.newuuid();

			//$scope.site ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON));
			$rootScope.unsyncedJSON.Documents.push ($scope.JSON);

			$scope.JSON = {};
	}

})
   
   
.controller('serviceEntryCtrl', function($scope, $rootScope, uuid2, Upload, logger) {
		// variables stored in document
	$scope.JSON = {};
	$scope.imageData;

	//JSON fucntion for people
	$scope.saveServiceJSON = function (){
			$scope.JSON ["Creation Date"] = new Date();
			$scope.JSON ["Modification Date"] = new Date();
			$scope.JSON ["Unique Identifier"] = uuid2.newuuid();

			//$scope.site ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.JSON));
			$rootScope.unsyncedJSON.ServiceEntries.push ($scope.JSON);

			$scope.JSON = {};
	}


})
   
   
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, $http, logger, $ionicModal, DynamicPage, ObjectCounter, File, $cordovaFile, $cordovaNetwork, $ionicLoading) {

	// create global variables
	$rootScope.peopleSyncedJSON = {};
	$rootScope.peopleJSON = {};
	$rootScope.projectSyncedJSON = {};
	$rootScope.projectJSON = {};
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

	$rootScope.unsyncedJSON = {People:[], Projects:[], Sites:[], Systems:[], Deployments:[], Components:[], Documents: [], ServiceEntries: [] };


	$rootScope.baseURL = "http://sensor.nevada.edu/GS/Services/";
	$rootScope.urlPaths = ["people","projects", "sites", "systems", "deployments", "components", "documents","service_entries"];

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
    	sync.post ($rootScope.baseURL+'edge/', $rootScope.unsyncedJSON);
    }

    $scope.listSwitch = function (JSON, syncedJSON, title, route){
    	$rootScope.listJSON = JSON;
    	$rootScope.chosenJSONlist = syncedJSON
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
    		File.checkandWriteFile ( $rootScope.urlPaths[0], $rootScope.peopleSyncedJSON);
    		resolve ($rootScope.peopleSyncedJSON);

    	}, function (result){
    		File.readFile($rootScope.urlPaths[0]).then (function(success){
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
    sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/", $rootScope.projectSyncedJSON, 'Project', $rootScope.projectJSON).then (function (result){
    	$rootScope.projectSyncedJSON = result;
    	File.checkandWriteFile('Project', $rootScope.projectSyncedJSON);
    })

    	//site read
    sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/", $rootScope.siteSyncedJSON,'Site', $rootScope.siteJSON).then(function(result){
    	$rootScope.siteSyncedJSON = result;
    	File.checkandWriteFile('Site', $rootScope.siteSyncedJSON);
    });

    // 	system read
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

   // 	service Entries read
     	var promise = $q (function (resolve, reject){$http.get($rootScope.baseURL + $rootScope.urlPaths[7]+"/").then (function(result){
    		console.log ($rootScope.baseURL + $rootScope.urlPaths[7]+"/" + " " + result.status +": " + result.statusText);
    		$rootScope.serviceSyncedJSON = result.data;
    		File.checkandWriteFile ( $rootScope.urlPaths[7], $rootScope.serviceSyncedJSON);
    		resolve ($rootScope.serviceSyncedJSON);

    	}, function (result){
    		File.readFile($rootScope.urlPaths[7]).then (function(success){
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
            templateUrl: 'templates/loadingSpinner.html',
            noBackdrop: true
        });
        
		var x = 0;
		for (var o in $rootScope.listJSON){
			if (JSON == $rootScope.listJSON[o]){
				if (DynamicPage.getTitle() == 'Service Entries'){
					DynamicPage.setJSON ($rootScope.chosenJSONlist['ServiceEntries'][x]);				

				}
				else{
					DynamicPage.setJSON ($rootScope.chosenJSONlist[DynamicPage.getTitle()][x]);
				}
				break;
			 }
			 x ++;
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

.controller('ModalController', function($scope, $rootScope, $state, $ionicModal, logger, DynamicPage) {
    $ionicModal.fromTemplateUrl('templates/' + DynamicPage.getRoute() + '.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $ionicModal.fromTemplateUrl('templates/' + DynamicPage.getRoute() + '.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    });
    //set flag in root scope to indicate weither modal
    //hidden or shown
    $scope.openModal = function() {
        $scope.modal.show();
        $rootScope.modalHidden = false;
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
        $rootScope.modalHidden = true;
    };
     $scope.destroyModal = function() {
        $scope.modal.remove();
        $rootScope.modalHidden = true;
    };
})


.controller('DocumentModalController', function($scope, $rootScope, $state, $ionicModal, logger, DynamicPage) {
    $ionicModal.fromTemplateUrl('templates/document.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $ionicModal.fromTemplateUrl('templates/document.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    });
    //set flag in root scope to indicate weither modal
    //hidden or shown
    $scope.openModal = function() {
        $scope.modal.show();
        $rootScope.modalHidden = false;
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
        $rootScope.modalHidden = true;
    };
     $scope.destroyModal = function() {
        $scope.modal.remove();
        $rootScope.modalHidden = true;
    };
})


.controller('ServiceModalController', function($scope, $rootScope, $state, $ionicModal, logger, DynamicPage) {
    $ionicModal.fromTemplateUrl('templates/serviceEntry.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });
    
    $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams){
        $ionicModal.fromTemplateUrl('templates/serviceEntry.html', {
            scope: $scope,
            animation: 'slide-in-up'
        }).then(function(modal) {
            $scope.modal = modal;
        });
    });
    //set flag in root scope to indicate weither modal
    //hidden or shown
    $scope.openModal = function() {
        $scope.modal.show();
        $rootScope.modalHidden = false;
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
        $rootScope.modalHidden = true;
    };
     $scope.destroyModal = function() {
        $scope.modal.remove();
        $rootScope.modalHidden = true;
    };
})


/* Will be used to refactor current expandable text :/

.controller('TextAreaController', function($scope, $rootScope){
    
})
*/

