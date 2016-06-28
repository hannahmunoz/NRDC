angular.module('app.controllers', ['ionic', 'app.services', 'angularUUID2', 'ngFileUpload'])

//the controller for the people view  
.controller('peopleCtrl', function($scope, $rootScope, uuid2, Upload, logger, $ionicPlatform, Camera) {

	// variables stored in people
	$scope.imageData = null;
	$scope.people = {};
	$scope.people  ["Photo"] = null;
	//JSON fucntion for people
	$scope.savePeopleJSON = function (){
			$scope.people ["Creation Date"] = new Date();
			$scope.people ["Modification Date"] = new Date();
			$scope.people ["Unique Identifier"] = uuid2.newuuid();

			$scope.people  ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.people))

			$scope.people = {};
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
   

.controller('viewPeopleCtrl', function($scope, select) {
	$scope.personJSON = select.get();
	//console.log ($scope.personJSON);
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

		$scope.JSON = {};
	}
})
   

.controller('viewCtrl', function($scope, DynamicPage, ObjectCounter, $rootScope) {

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

			$scope.JSON  = {};
	}

	//wrapper for the GPS factory so we can call it from the getGPS button
	// in root scope so it can be called from all buttons
	$rootScope.getGPS = function (){
		GPS.checkPermissions();
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

			$scope.JSON = {};
	}


})
   
   
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, $http, logger, $ionicModal, DynamicPage, ObjectCounter) {

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

	$rootScope.baseURL = "http://sensor.nevada.edu/GS/Services/";
	$rootScope.urlPaths = ["people","projects", "sites", "systems", "deployments", "components", "documents","service_entries"];


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
    	
    }

    $scope.listSwitch = function (JSON, title, route){
    	$rootScope.listJSON = JSON;
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

    	// people read
    	var promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[0]+"/");
    		promise.then (function(result){
    			$rootScope.peopleSyncedJSON = result;	
    			for (var i = 0; i < $rootScope.peopleSyncedJSON.People.length; i++){
					$rootScope.peopleJSON [$rootScope.peopleSyncedJSON.People[i]['Person']] =  $rootScope.peopleSyncedJSON.People[i]['First Name'] + " " + $rootScope.peopleSyncedJSON.People[i]['Last Name']; 
				}
    		}),function (error){

    		}

    	//project read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/");
    		promise.then (function(result){
    			$rootScope.projectSyncedJSON = result;
    			for (var i = 0; i < $rootScope.projectSyncedJSON.Projects.length; i++){
					$rootScope.projectJSON [$rootScope.projectSyncedJSON.Projects[i]['Project']] =  $rootScope.projectSyncedJSON.Projects[i]['Name']; 
				}
    		}),function (error){

    		}

    	//site read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/");
    		promise.then (function(result){
    			$rootScope.siteSyncedJSON = result;
    			for (var i = 0; i < $rootScope.siteSyncedJSON.Sites.length; i++){
					$rootScope.siteJSON [$rootScope.siteSyncedJSON.Sites[i]['Site']] =  $rootScope.siteSyncedJSON.Sites[i]['Name']; 
				}
    		}),function (error){

    		}

    	//project read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[3]+"/");
    		promise.then (function(result){
    			$rootScope.systemSyncedJSON = result;
    			    for (var i = 0; i < $rootScope.systemSyncedJSON.Systems.length; i++){
						$rootScope.systemJSON [$rootScope.systemSyncedJSON.Systems[i]['System']] =  $rootScope.systemSyncedJSON.Systems[i]['Name']; 
					}	
    		}),function (error){

    		}

    	//deployment read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[4]+"/");
    		promise.then (function(result){
    			$rootScope.deploymentSyncedJSON = result;
    		    for (var i = 0; i < $rootScope.deploymentSyncedJSON.Deployments.length; i++){
					$rootScope.deploymentJSON [$rootScope.deploymentSyncedJSON.Deployments[i]['Deployment']] =  $rootScope.deploymentSyncedJSON.Deployments[i]['Name']; 
				}	
			
    		}),function (error){

    		}

    	//component read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[5]+"/");
    		promise.then (function(result){
    			$rootScope.componentSyncedJSON = result;
    		    for (var i = 0; i < $rootScope.componentSyncedJSON.Components.length; i++){
					$rootScope.componentJSON [$rootScope.componentSyncedJSON.Components[i]['Component']] =  $rootScope.componentSyncedJSON.Components[i]['Name']; 
				}		
    		}),function (error){

    		}

    	//document read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[6]+"/");
    		promise.then (function(result){
    			$rootScope.documentSyncedJSON = result;	
    		    for (var i = 0; i < $rootScope.documentSyncedJSON.Documents.length; i++){
					$rootScope.documentJSON [$rootScope.documentSyncedJSON.Documents[i]['Document']] =  $rootScope.documentSyncedJSON.Documents[i]['Name']; 
				}	
    		}),function (error){

    		}

    	//service Entries read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[7]+"/");
    		promise.then (function(result){
    			$rootScope.serviceSyncedJSON = result;	
    		    for (var i = 0; i < $rootScope.serviceSyncedJSON.ServiceEntries.length; i++){
					$rootScope.serviceJSON [$rootScope.serviceSyncedJSON.ServiceEntries[i]['Service Entry']] =  $rootScope.serviceSyncedJSON.ServiceEntries[i]['Name']; 
				}			
    		}),function (error){

    		}
	}

    init ();
    
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

.controller('listCtrl', function($scope, $rootScope, DynamicPage, $state) {
	$scope.title = DynamicPage.getTitle();
	$scope.route = DynamicPage.getRoute();
	console.log ( $scope.route);

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		$scope.title = DynamicPage.getTitle();
		$scope.route = DynamicPage.getRoute();
		console.log ($scope.route);})


	// wrapper for person select button
	$scope.select = function(JSON){
		DynamicPage.setJSON (JSON);
		$state.go ($scope.route);
	}
    
})

.controller('modalController', function($scope, $state, $ionicModal, logger) {
    $scope.myHtml = "<div class='center-text fill-parent'>Some Injected HTML<div>";
    
    $ionicModal.fromTemplateUrl('templates/new-entry-modal.html', {
        }).then(function(modal) {
        $scope.modal = modal;
        });
})

.controller('modalContentController', function($scope, $state, $ionicModal, logger) {
    $scope.myHtml = "<div class='center-text fill-parent'>Some Injected HTML<div>";

})
