angular.module('app.routes', [])

.config(function( $stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js

  $stateProvider

  .state('people', {
   url: '/people',
    templateUrl: 'templates/people.html',
    controller: 'viewCtrl'
  })


  .state('network', {
    url: '/network',
    templateUrl: 'templates/network.html',
    controller: 'viewCtrl'
  })


  .state('site', {
    url: '/CreateNewSite',
    templateUrl: 'templates/site.html',
    controller: 'viewCtrl'
  })


  .state('system', {
    url: '/CreateNewSystem',
    templateUrl: 'templates/system.html',
    controller: 'viewCtrl'
  })


  .state('deployment', {
    url: '/CreateNewDeployment',
    templateUrl: 'templates/deployment.html',
    controller: 'viewCtrl'
  })

  .state('component', {
    url: '/CreateNewComponent',
    templateUrl: 'templates/component.html',
    controller: 'viewCtrl'
  })


  .state('document', {
    url: '/CreateNewDocument',
    templateUrl: 'templates/document.html',
    controller: 'viewCtrl'
  })


  .state('serviceEntry', {
    url: '/CreateNewServiceEntry',
    templateUrl: 'templates/serviceEntry.html',
    controller: 'viewCtrl'
  })

  .state('newNetworks', {
    url: '/network',
    templateUrl: 'templates/network.html',
    controller: 'networkCtrl'
  }) 

  .state('createNewNetworks', {
    url: '/createNetwork',
    templateUrl: 'templates/modal_templates/Networks_modal.html',
    controller: 'modalController'
  })


  .state('createNewSites', {
    url: '/createSite',
    templateUrl: 'templates/modal_templates/Sites_modal.html',
    controller: 'modalController'
  })


  .state('createNewSystems', {
    url: '/createSystem',
    templateUrl: 'templates/modal_templates/Systems_modal.html',
    controller: 'modalController'
  })


  .state('createNewDeployments', {
    url: '/createDeploymentd',
    templateUrl: 'templates/modal_templates/Deployments_modal.html',
    controller: 'modalController'
  })


  .state('createNewComponents', {
    url: '/createComponent',
    templateUrl: 'templates/modal_templates/Components_modal.html',
    controller: 'modalController'
  })

  .state('createNewDocuments', {
    url: '/createDocument',
    templateUrl: 'templates/modal_templates/Documents_modal.html',
    controller: 'DocumentModalController'
  })

  .state('createNewServiceEntries', {
    url: '/createServiceEntry',
    templateUrl: 'templates/modal_templates/serviceEntry_modal.html',
    controller: 'ServiceModalController'
  })

  // .state('createNew.mainMenu', {
  //   url: '/mainMenu',
  //   views: {
  //     'side-menu21': {
  //       templateUrl: 'templates/mainMenu.html',
  //       controller: 'mainMenuCtrl'
  //     }
  //   }
  // })

  .state('mainMenu', {
    url: '/mainMenu',
     templateUrl: 'templates/mainMenu.html',
     controller: 'mainMenuCtrl'
  })

  .state('peopleList', {
    url: '/peopleList',
    templateUrl: 'templates/peopleList.html',
    controller: 'listCtrl'
  })

  .state('list', {
    url: '/list',
    templateUrl: 'templates/list.html',
    controller: 'listCtrl'
  })

  .state('docList', {
    url: '/docList',
    templateUrl: 'templates/docList.html',
    controller: 'documentListCtrl'
  })

  .state('seList', {
    url: '/seList',
    templateUrl: 'templates/seList.html',
    controller: 'ServiceListCtrl'
  })

  .state('createNew', {
    url: '/CreateNew',
    templateUrl: 'templates/createNew.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/mainMenu')

});