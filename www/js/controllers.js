angular.module('app.controllers', ['ionic', 'app.services', 'angularUUID2', 'ngFileUpload'])

//the controller for the people view  
.controller('peopleCtrl', function($scope, $rootScope, uuid2, Upload, logger, $ionicPlatform, Camera) {

	// variables stored in people
	$scope.imageData;
	$scope.people = {};
	//JSON fucntion for people
	$scope.savePeopleJSON = function (){
			$scope.people ["Creation Date"] = new Date();
			$scope.people ["Modification Date"] = new Date();
			$scope.people ["Unique Identifier"] = uuid2.newuuid();

			// peopleJSON ["Photo"] = $scope.imageData;

			// print json to console for debugging
			logger.log (JSON.stringify($scope.people))

			$scope.people = {};
	}


	//wrapper for the openGallery factory so we can call it from the choosePicture button.
	// in root scope so it can be called from all buttons
	$rootScope.choosePicture = function (){
		Camera.checkPermissions();
		Camera.openGallery ();
	}

	//wrapper for the take image factory so we can call it from the takePhoto button
	// in root scope so it can be called from all buttons
	$rootScope.takePicture = function (){
    		Camera.checkPermissions();
    		Camera.openCamera ();
	}

})
   

.controller('viewPeopleCtrl', function($scope, select) {
	$scope.personJSON = select.get();
	//console.log ($scope.personJSON);
})


   
.controller('projectCtrl', function($scope, $rootScope, uuid2, logger, ObjectCounter) {
	//variables stored in projects
	$scope.JSON = {};
	$scope.peopleJSON = {};
	$scope.investigator;
	for (var i = 0; i < ObjectCounter.count($rootScope.peopleSyncedJSON); i++){
		var obj = {};
		$scope.peopleJSON [$rootScope.peopleSyncedJSON.People[i]['Person']] =  $rootScope.peopleSyncedJSON.People[i]['First Name'] + " " + $rootScope.peopleSyncedJSON.People[i]['Last Name']; 
		//$scope.peopleJSON.push (obj);
		console.log (JSON.stringify($scope.peopleJSON));
	}


	// JSON function for project
	$scope.saveProjectJSON = function (){

		$scope.JSON ["Creation Date"] = new Date();
		$scope.JSON ["Started Date"] = new Date();
		$scope.JSON ["Modification Date"] = new Date();
		$scope.JSON ["Unique Identifier"] = uuid2.newuuid();



		// print json to console for debugging
		logger.log (JSON.stringify($scope.JSON));

		$scope.JSON = {};
	}
    
})
   

.controller('viewCtrl', function($scope, $ionicHistory, select) {
	$scope.JSON = select.get();
	console.log ($scope.JSON);
    
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
   
   
.controller('mainMenuCtrl', function($scope, $rootScope, $q, $window, sync, $http, logger, $ionicModal, DynamicPage) {

	// create global variables
	$rootScope.peopleSyncedJSON = {};
	$rootScope.projectSyncedJSON = {};
	$rootScope.siteSyncedJSON = {};
	$rootScope.systemSyncedJSON = {};
	$rootScope.deploymentSyncedJSON = {};
	$rootScope.componentSyncedJSON = {};
	$rootScope.documentSyncedJSON = {};
	$rootScope.serviceSyncedJSON = {};

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
    		}),function (error){

    		}

    	//project read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[1]+"/");
    		promise.then (function(result){
    			$rootScope.projectSyncedJSON = result;	
    		}),function (error){

    		}

    	//site read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[2]+"/");
    		promise.then (function(result){
    			$rootScope.siteSyncedJSON = result;	
    		}),function (error){

    		}

    	//project read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[3]+"/");
    		promise.then (function(result){
    			$rootScope.systemSyncedJSON = result;	
    		}),function (error){

    		}

    	//deployment read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[4]+"/");
    		promise.then (function(result){
    			$rootScope.deploymentSyncedJSON = result;	
    		}),function (error){

    		}

    	//component read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[5]+"/");
    		promise.then (function(result){
    			$rootScope.componentSyncedJSON = result;	
    		}),function (error){

    		}

    	//document read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[6]+"/");
    		promise.then (function(result){
    			$rootScope.documentSyncedJSON = result;	
    		}),function (error){

    		}

    	//service Entries read
    	promise = sync.read($rootScope.baseURL + $rootScope.urlPaths[7]+"/");
    		promise.then (function(result){
    			$rootScope.serviceSyncedJSON = result;	
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

.controller('listCtrl', function($scope, $rootScope, select, DynamicPage, $state) {
	$scope.title = DynamicPage.getTitle();
	$scope.route = DynamicPage.getRoute();
	console.log ( $scope.route);

	$rootScope.$on('$stateChangeSuccess', function(event, toState, toParams, fromState, fromParams){ 
		$scope.title = DynamicPage.getTitle();
		$scope.route = DynamicPage.getRoute();
		console.log ($scope.route);})


	// wrapper for person select button
	$scope.select = function(JSON){
		select.set (JSON);
		$state.go ($scope.route);
	}
   
})

.controller('modalController', function($scope, $rootScope, $state, $ionicModal, logger, DynamicPage) {
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
    
    $scope.openModal = function() {
        $scope.modal.show();
    };
    $scope.closeModal = function() {
        $scope.modal.hide();
    };
     $scope.destroyModal = function() {
        $scope.modal.remove();
    };
})

.controller('modalContentController', function($scope, $state, logger) {
    $scope.isModal = true;
})
