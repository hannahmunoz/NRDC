angular.module('app.routes', [])

.config(function($stateProvider, $urlRouterProvider) {

  // Ionic uses AngularUI Router which uses the concept of states
  // Learn more here: https://github.com/angular-ui/ui-router
  // Set up the various states which the app can be in.
  // Each state's controller can be found in controllers.js
  $stateProvider
    
    .state('createNew.people', {
    url: '/CreateNewPeople',
    views: {
      'side-menu21': {
        templateUrl: 'templates/people.html',
        controller: 'peopleCtrl'
      }
    }
  })

  .state('viewPeople', {
    url: '/ViewPeople',
    templateUrl: 'templates/viewPeople.html',
    controller: 'viewPeopleCtrl'
  })

  .state('createNew.project', {
    url: '/CreateNewProject',
    views: {
      'side-menu21': {
        templateUrl: 'templates/project.html',
        controller: 'projectCtrl'
      }
    }
  })

  .state('project', {
    url: '/project',
    templateUrl: 'templates/project.html',
    controller: 'viewCtrl'
  })


  .state('createNew.site', {
    url: '/CreateNewSite',
    views: {
      'side-menu21': {
        templateUrl: 'templates/site.html',
        controller: 'siteCtrl'
      }
    }
  })

  .state('site', {
    url: '/CreateNewSite',
    templateUrl: 'templates/site.html',
    controller: 'viewCtrl'
  })

  .state('createNew.system', {
    url: '/CreateNewSystem',
    views: {
      'side-menu21': {
        templateUrl: 'templates/system.html',
        controller: 'systemCtrl'
      }
    }
  })

  .state('system', {
    url: '/CreateNewSystem',
    templateUrl: 'templates/system.html',
    controller: 'viewCtrl'
  })

  .state('createNew.deployment', {
    url: '/CreateNewDeployment',
    views: {
      'side-menu21': {
        templateUrl: 'templates/deployment.html',
        controller: 'deploymentCtrl'
      }
    }
  })

  .state('deployment', {
    url: '/CreateNewDeployment',
    templateUrl: 'templates/deployment.html',
    controller: 'viewCtrl'
  })

  .state('createNew.component', {
    url: '/CreateNewComponent',
    views: {
      'side-menu21': {
        templateUrl: 'templates/component.html',
        controller: 'componentCtrl'
      }
    }
  })

  .state('component', {
    url: '/CreateNewComponent',
    templateUrl: 'templates/component.html',
    controller: 'viewCtrl'
  })

  .state('createNew.document', {
    url: '/CreateNewDocument',
    views: {
      'side-menu21': {
        templateUrl: 'templates/document.html',
        controller: 'documentCtrl'
      }
    }
  })

  .state('document', {
    url: '/CreateNewDocument',
    templateUrl: 'templates/document.html',
    controller: 'viewCtrl'
  })

  .state('createNew.serviceEntry', {
    url: '/CreateNewServiceEntry',
    views: {
      'side-menu21': {
        templateUrl: 'templates/serviceEntry.html',
        controller: 'serviceEntryCtrl'
      }
    }
  })

  .state('serviceEntry', {
    url: '/CreateNewServiceEntry',
    templateUrl: 'templates/serviceEntry.html',
    controller: 'viewCtrl'
  })

  .state('createNew.mainMenu', {
    url: '/mainMenu',
    views: {
      'side-menu21': {
        templateUrl: 'templates/mainMenu.html',
        controller: 'mainMenuCtrl'
      }
    }
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

  .state('createNew', {
    url: '/CreateNew',
    templateUrl: 'templates/createNew.html',
    abstract:true
  })

$urlRouterProvider.otherwise('/CreateNew/mainMenu')


});