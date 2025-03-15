(function(){
	var app = angular.module('coala', ['ngSanitize','btford.markdown', 'ngRoute']);

  app.config(['$routeProvider',
              function($routeProvider) {
                  $routeProvider.
                      when('/projects', {
                          template: '<projects></projects>',
                          reloadOnSearch: false
                      }).
                      when('/mentors', {
                          template: '<mentors></mentors>'
                      }).
                      when('/faq', {
                          template: '<faq></faq>'
                      }).
                      otherwise({
                          redirectTo: '/projects'
                      });
              }]);

  app.controller('TabController', function ($location) {
      this.tab = $location.path();
      this.setTab = function (stab) {
          this.tab = stab;
          $location.path(stab);
      };
      this.isSet = function (stab) {
          return $location.path() == stab;
      };
  });

	app.directive('projects',  ['$http', '$timeout', '$location', function ($http, $timeout, $location) {
		return {
			restrict: 'E',
			templateUrl: "/gsoc/display/partials/tabs/projects.html",
			controller: function ($scope, $location) {
				self = this;
				$scope.projectList = projects;

				self.showProject = function (project) {
					$scope.currentProject = project;
					$(document).ready(function () {
						$('.modal').modal('open');
					});
            mval = encodeURIComponent(project["name"].split(' ').join('_').toLowerCase());
            $location.url('?project=' + mval);
         };

					$scope.search = function (arg) {
						$scope.searchText = arg;
					};

					$scope.redirect = function (arg) {
						window.open(arg, '_blank');
					};

          $scope.updateLink = function () {
              $scope.currentProject = null;
              $location.url($location.path());
          };

          $scope.projects_url_dict = {};
          angular.forEach($scope.projectList, function(value, key){
              // Create a new key as RESTURL so it can follow the name of the project.
              value["resturl"] = encodeURIComponent(value["name"].split(' ').join('_').toLowerCase());
              $scope.projects_url_dict[value["resturl"]] = key;
          });

          // Find whether there's a project name in the URL and try to load it.
          var project_requested = encodeURIComponent($location.search().project);
          if(project_requested){
              if(Object.keys($scope.projects_url_dict).indexOf(project_requested) > -1){
                  self.showProject($scope.projectList[$scope.projects_url_dict[project_requested]]);
              }
          }

		      var search_requested = $location.search().q;
				  if(search_requested){
					    $scope.searchText = search_requested;
				  }
			},
			controllerAs: 'lc'
    };
	}]);

	app.directive('faq',[ '$http', function ($http) {
		return {
			restrict: 'E',
			templateUrl: "/gsoc/display/partials/tabs/faq.html",
			controller: function () {
				self = this
				self.faqs = faq
		},
		controllerAs: 'toc'
	};
	}]);


 app.filter('format_desc', function () {
  return function (value) {
   if (!value) return '';
   var lastspace = value.indexOf('.');
   if (lastspace != -1) {
    if (value.charAt(lastspace-1) == ',') {
    	lastspace = lastspace - 1;
    }
    value = value.substr(0, lastspace);
   }
   return value;
  };
 });

 app.filter('format_issue', function () {
  return function (value) {
   if (!value) return '';
   res = value.split('/');
   res = res[3] + '/' + res[4] + '#' + res[6];
   return res;
  };
 });

 app.filter('format_project', function () {
  return function (value) {
      if (!value) return '';
      var all =  {"astropy":{"name":"Astropy","logo":"astropy.png","url":"http://www.astropy.org/","repositories":{"github":"astropy/astropy"},"mailinglist":{"users":"http://mail.python.org/mailman/listinfo/astropy","devs":"http://groups.google.com/group/astropy-dev"},"chat":{"slack":"http://joinslack.astropy.org/"},"microblogging":{"twitter":"astropy"},"description":"is a community-driven package intended to contain much of the core functionality and some common tools needed for performing astronomy and astrophysics with Python."},"astronomy-commons":{"name":"Astronomy Data Commons","logo":"astronomy-commons.png","url":"https://dirac.astro.washington.edu/data-engineering/","repositories":{"github":"astronomy-commons/"},"mailinglist":{"devs":"https://groups.google.com/forum/#!forum/astronomy-commons"},"chat":{"matrix":"https://app.element.io/#/room/#astronomy-commons:matrix.org"},"description":"is an initiative for software infrastructure for science platforms and scalable astronomy on cloud resources. Astronomy Data Commons is lead by researchers at the DiRAC Institute at the University of Washington."},"ctlearn":{"name":"CTLearn","logo":"ctlearn.png","url":"https://github.com/ctlearn-project","repositories":{"github":"ctlearn-project/ctlearn"},"chat":{"matrix":"https://app.element.io/#/room/#ctlearn:matrix.org"},"description":"is a package under active development that pursues the application of deep-learning based methods to the analysis of data from imaging atmospheric Cherenkov telescopes (IACTs). <a href=\"https://github.com/ctlearn-project\">CTLearn</a> includes modules for loading and manipulating IACT data and for running machine learning models using pixel-wise camera data as input. Its high-level interface provides a configuration-file-based workflow to drive reproducible training and prediction."},"einsteinpy":{"name":"EinsteinPy","logo":"einsteinpy.png","url":"https://einsteinpy.org","repositories":{"github":"einsteinpy/einsteinpy"},"mailinglist":{"devs":"https://groups.io/g/einsteinpy-dev"},"chat":{"matrix":"https://app.element.io/#/room/#einsteinpy:matrix.org"},"microblogging":{"twitter":"EinsteinPy"},"description":"is a python package for solving problems in general relativity. Computations can be done for Schwarzschild, Kerr and Kerr-Newman geometries. Visualising relativistic orbits, advancement of perihelion can be simulated in seconds. See <a href=\"https://docs.einsteinpy.org/\">documentation</a> for more information."},"glue":{"name":"Glue","logo":"glue.png","url":"http://www.glueviz.org/","repositories":{"github":"glue-viz/glue"},"mailinglist":{"users":"https://groups.google.com/group/glue-viz","devs":"https://groups.google.com/group/glue-viz-dev"},"microblogging":{"twitter":"glueviz"},"description":"is a data visualization application and library to explore relationships within and among related datasets. Its main features include linked statistical graphs, flexible linking across data, and full Python scripting capability."},"juliaastro":{"name":"JuliaAstro","logo":"juliaastro.svg","url":"https://juliaastro.github.io/","repositories":{"github":"juliaastro"},"mailinglist":{"users":"https://discourse.julialang.org/c/domain/astro"},"chat":{"matrix":"https://app.element.io/#/room/#JuliaAstro:openastronomy.org"},"description":"is an organization that shepherds the development of community astronomy and astrophysics packages for Julia. These include packages for widely used functionality such as FITS file I/O, world coordinate systems and cosmological distance calculations."},"poliastro":{"name":"poliastro","logo":"poliastro.png","url":"https://poliastro.readthedocs.io/","repositories":{"github":"poliastro/poliastro"},"mailinglist":{"devs":"https://groups.io/g/poliastro-dev"},"chat":{"matrix":"https://app.element.io/#/room/#poliastro:matrix.org"},"microblogging":{"twitter":"poliastro_py","mastodon":"@poliastro@fosstodon.org"},"description":"is a python package for Astrodynamics and Orbital Mechanics problems, such as orbital elements conversion, orbital propagation, plotting, planetary ephemerides computation, and more."},"sunpy":{"name":"SunPy","logo":"sunpy.png","url":"http://sunpy.org","repositories":{"github":"sunpy/sunpy"},"mailinglist":{"users":"http://groups.google.com/group/sunpy","devs":"http://groups.google.com/group/sunpy-dev"},"chat":{"matrix":"https://app.element.io/#/room/#sunpy:openastronomy.org"},"microblogging":{"twitter":"SunPyProject"},"description":"is a community-developed free and open-source software package for solar physics. SunPy is meant to be a free alternative to the <a href=\"http://www.lmsal.com/solarsoft/\" target=\"_blank\">SolarSoft</a> and its aim is to provide the software tools necessary so that anyone can analyze solar data."},"stingray":{"name":"Stingray","logo":"stingray_logo.png","url":"http://stingray.science","repositories":{"github":"StingraySoftware"},"chat":{"slack":"https://join.slack.com/t/stingraysoftware/shared_invite/zt-49kv4kba-mD1Y~s~rlrOOmvqM7mZugQ"},"description":": we are a team of astrophysicists and software developers working together to build a variability analysis software to study black holes and fundamental physics under extreme conditions."},"casacore":{"name":"Casacore","logo":"casacore.svg","url":"https://www.github.com/casacore/casacore/","repositories":{"github":"casacore"},"description":"is a suite of C++ libraries for radio astronomy data processing. Casacore underlies <a href=\"https://casa.nrao.edu/\">CASA</a>, the Common Astronomy Software Applications developed by an international consortium of scientists at various institutes. Python bindings exist in <a href=\"https://github.com/casacore/python-casacore\">Python-casacore</a>. Casacore also underlies other radio astronomy software such as <a href=\"https://sourceforge.net/projects/wsclean/\">WSClean</a>, and LOFAR tools. Casacore is developed by the radio astro organizations around the world. It is open source and will happily merge any (good) pull requests."},"chiantipy":{"name":"ChiantiPy","logo":"chiantipy.png","url":"http://chiantipy.sourceforge.net/welcome.html","repositories":{"github":"chianti-atomic/ChiantiPy"},"mailinglist":{"users":"https://lists.sourceforge.net/lists/listinfo/chiantipy-users"},"description":"is a Python interface to the <a href=\"http://www.chiantidatabase.org/\" target=\"_blank\"> CHIANTI atomic database </a> for astrophysical spectroscopy. CHIANTI consists of a database of atomic data that can be used to interpret spectral lines and continua emitted from high-temperature, optically-thin astrophysical sources."},"coin":{"name":"COIN","logo":"coin.png","url":"https://cosmostatistics-initiative.org/","repositories":{"github":"COINtoolbox"},"mailinglist":{"admin (Rafael S. de Souza)":"mailto:rafael.2706@gmail.com"},"description":"(COsmostatistics INitiative) is an international working group built under the auspices of the International Astrostatistics Association (<a href=\"https://asaip.psu.edu/organizations/iaa\" target=\"_blank\">IAA</a>). It aims to create an interdisciplinary environment where collaborations between astronomers, statisticians and machine learning experts can flourish. COIN is designed to promote the development of a new family of tools for data exploration in astrophysics and cosmology."},"gnuastro":{"name":"GNU Astronomy Utilities","logo":"gnuastro.svg","url":"https://www.gnu.org/software/gnuastro/","repositories":{"savannah":"https://git.savannah.gnu.org/cgit/gnuastro.git"},"mailinglist":{"users":"https://lists.gnu.org/mailman/listinfo/help-gnuastro","devs":"https://lists.gnu.org/mailman/listinfo/gnuastro-devel"},"description":"(Gnuastro) is an official GNU package consisting of many <a href=\"https://www.gnu.org/software/gnuastro/manual/html_node/Gnuastro-programs-list.html\" target=\"_blank\">command-line programs</a> and <a href=\"https://www.gnu.org/software/gnuastro/manual/html_node/Gnuastro-library.html\" target=\"_blank\">library functions</a> for the manipulation and analysis of astronomical data. All the programs share the same basic and familiar (GNU style) command-line user interface for the comfort of both the users and developers. Gnuastro is written to comply fully with the GNU coding standards so it blends nicely with all Unix-like operating systems. This also enables astronomers to expect a fully familiar experience in the source code, building, installing and command-line user interaction. Gnuastro also has a very complete <a href=\"https://www.gnu.org/software/gnuastro/manual/index.html\" target=\"_blank\">book/manual</a>, the <a href=\"https://www.gnu.org/software/gnuastro/manual/html_node/Tutorials.html\" target=\"_blank\">tutorials</a> is the best place to start using it."},"ims":{"name":"The Italian Mars Society","logo":"ims.png","url":"http://www.marssociety.it/?lang=en","repositories":{"bitbucket":"italianmarssociety/"},"mailinglist":{"admin":"mailto:gsoc@marssociety.it"},"microblogging":{"twitter":"marssociety"},"description":"(IMS) is a non-profit organization, existing from 2004, as Italian branch of the International Mars Society, created in the USA by Robert Zubrin. IMS is a member of the Mars Society European network. The foundation scope of the Italian Mars Society is to promote research projects devoted to Mars Exploration and the involvement of SMEs and large enterprises in the new economy related to space exploration. <br/> IMS is currently spearheading the <a href=\"http://www.mars-city.org/\" _target=\"_blank\">MARS CITY</a> project. The project aims to address the major issues that could jeopardize a crewed mission to Mars and are not adequately being addressed at existing terrestrial Mars analogs."},"plasmapy":{"name":"PlasmaPy","logo":"plasmapy.png","url":"http://www.plasmapy.org","repositories":{"github":"plasmapy/plasmapy"},"mailinglist":{"users":"https://groups.google.com/group/plasmapy"},"chat":{"matrix":"https://app.element.io/#/room/#plasmapy:matrix.org"},"microblogging":{"twitter":"plasmapy"},"description":"aims to be a collection of functionality commonly used and shared between plasma physicists and researchers globally, running within and leveraging the open source scientific Python ecosystem."},"radis":{"name":"radis","logo":"radis_ico.png","url":"https://radis.readthedocs.io/","repositories":{"github":"radis/radis"},"mailinglist":{"users":"https://groups.google.com/forum/#!forum/radis-radiation"},"chat":{"gitter":"https://gitter.im/radis-radiation/community"},"microblogging":{"twitter":"radis_radiation"},"description":"A fast line-by-line code for high-resolution infrared molecular spectra. RADIS can compute spectra of millions of lines within seconds. Also includes a post-processing tools to compare experimental spectra with spectra calculated in RADIS or other spectral codes."},"sherpa":{"name":"Sherpa","logo":"sherpa_logo.gif","url":"http://cxc.cfa.harvard.edu/contrib/sherpa/","repositories":{"github":"sherpa/sherpa/"},"description":"is a modeling and fitting application for Python. It contains a powerful language for combining simple models into complex expressions that can be fit to the data using a variety of statistics and optimization methods. It is easily extensible to include user models, statistics and optimization methods."},"yt":{"name":"yt","logo":"yt.png","url":"https://yt-project.org/","repositories":{"github":"yt-project/yt"},"mailinglist":{"users":"https://mail.python.org/archives/list/yt-users@python.org/","devs":"https://mail.python.org/archives/list/yt-dev@python.org/"},"chat":{"slack":"https://yt-project.slack.com/"},"microblogging":{"twitter":"yt_astro"},"description":"is a python package for analyzing and visualizing volumetric, multi-resolution data from astrophysical simulations, radio telescopes, and a burgeoning interdisciplinary community."}};
      if (value in all) {
          var data = all[value];
          if ('chat' in data){
              if ('matrix' in data.chat) {
                  return data.chat['matrix'];
              } else if ('slack' in data.chat) {
                  return data.chat['slack'];
              } else if ('gitter' in data.chat) {
                  return data.chat['gitter'];
              }
          };
          if ('mailinglist' in data){
              if ('devs' in data.mailinglist) {
                  return data.mailintlist['devs'];
              } else if ('users' in data.mailinglist) {
                  return data.mailinglist['users'];
              };
          };
      };
      return 'https://app.element.io/#/room/#openastronomy:matrix.org';
  };
 });




	app.directive('mentors', ['$http', function ($http) {
		return {
			restrict: 'E',
			templateUrl: "/gsoc/display/partials/tabs/mentors.html",
			controller: function ($scope) {
				self = this;
				self.mentorsList = {};
				self.adminsList = {};
        self.year = year.toString();
				angular.forEach(projects, function(value, key){
					angular.forEach(value.mentors, function(value, key){
						self.mentorsList[value] =  {
									"github_handle" : value,
									"github_avatar_url": "https://avatars.githubusercontent.com/" +value
						};

					});
				});

				angular.forEach(admins[year], function(value, key){
						self.adminsList[value] = {
							"github_handle" : value,
							"github_avatar_url": "https://avatars.githubusercontent.com/" +value

						};
				});
			},
			controllerAs: "gic"
		};
	}]);

})();
