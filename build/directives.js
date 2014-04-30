(function (angular) {
  'use strict';

  var spDir = angular.module('spDirectives', [

  ]);

  spDir.directive('navbar', ['$location', function ($location) {
      return {
        restrict: 'A',
        replace: true,
        template: '<nav ng-if="show" role="navigation" data-sp-class="navigation"><div menu="menu"></div><div data-sp-class="navigation--secondary"><div data-sp-class="ish"><span data-sp-class="navigation--width" ng-if="!ish">Size<input type="text" data-sp-class="ish--size-px" value="320" disabled>px</span><form data-sp-class="ish--form" data-sp-id="ish--form" ng-if="ish">Size<input type="text" data-sp-class="ish--size-px" value="320">px</form><ul ng-if="ish" data-sp-class="ish--options"><li data-sp-class="ish--small"><a href="#" data-sp-class="ish--link" data-sp-id="ish--s">S</a></li><li data-sp-class="ish--small"><a href="#" data-sp-class="ish--link" data-sp-id="ish--m">M</a></li><li data-sp-class="ish--small"><a href="#" data-sp-class="ish--link" data-sp-id="ish--l">L</a></li><li data-sp-class="ish--large"><a href="#" data-sp-class="ish--link" data-sp-id="ish--full">Full</a></li><li data-sp-class="ish--large"><a href="#" data-sp-class="ish--link" data-sp-id="ish--random">Random</a></li><li data-sp-class="ish--large"><a href="#" data-sp-class="ish--link" data-sp-id="ish--disco">Disco</a></li><li data-sp-class="ish--large"><a href="#" data-sp-class="ish--link" data-sp-id="ish--hay">Hay</a></li></ul></div><input type="search" ng-model="StylePrototypeSearch.term" placeholder="Filter" data-sp-class="navigation--search"></div></nav>',
        link: function () {
          document.addEventListener('DOMContentLoaded', function () {
            console.log($location);

            var search = document.querySelector('[data-sp-class="navigation--search"]');

            if ($location.$$path === '/pages' || $location.$$path === '/style-tile') {
              search.setAttribute('disabled', 'disabled');
            }
            else {
              search.removeAttribute('disabled');
            }

            var viewportIndicator = document.querySelector('[data-sp-class="navigation--width"] > input');
            viewportIndicator.value = window.innerWidth;

            window.addEventListener('resize', function () {
              if (window.requestAnimationFrame) {
                window.requestAnimationFrame(function () {
                  viewportIndicator.value = window.innerWidth;
                });
              }
              else {
                viewportIndicator.value = window.innerWidth;
              }
            });
          });
        }
      };
    }]);

  spDir.directive('menu', function () {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        menu: '=menu'
      },
      template: '<ol data-sp-class="menu"><li ng-repeat="item in menu" menu-item="item"></li></ol>'
    };
  });

  spDir.directive('menuItem', ['$compile', function ($compile) {
    return {
      restrict: 'A',
      replace: true,
      scope: {
        item: '=menuItem'
      },
      template: '<li><a data-sp-class="menu--link" ng-click="closeMenu()" href="{{item.href}}">{{item.title}}</a></li>',
      link: function (scope, element) {
        if (scope.item.skip) {
          element[0].outerHTML = '';
        }
        else {
          element.attr('data-sp-class', 'menu--item');
          if (scope.item.submenu) {
            element.attr('data-sp-class', 'menu--dropdown');
            var text = element.children('a').text();
            element.empty();
            var $a = document.createElement('a');
                $a.setAttribute('data-sp-class', 'menu--dropdown-toggle');
                $a.setAttribute('ng-click', 'openMenu()');
                $a.innerHTML = text;
            element.append($a);

            var $submenu = document.createElement('div');
                $submenu.setAttribute('menu', 'item.submenu');
                $submenu.setAttribute = ('data-sp-class', 'menu--inner');
            element.append($submenu);
          }
        }
        $compile(element.contents())(scope);

        scope.closeMenu = function () {
          var activeNav = document.querySelectorAll('[data-sp-class="navigation"] [data-sp-state="active"]');
          for (var i in activeNav) {
            if (typeof(activeNav[i]) === 'object') {
              activeNav[i].removeAttribute('data-sp-state');
            }
          }
        }

        scope.openMenu = function () {
          if (element.attr('data-sp-state')) {
            element.removeAttr('data-sp-state');
            angular.forEach(element.children(), function (v, k) {
                element.children()[k].removeAttribute('data-sp-state');
            });
          }
          else {
            element.attr('data-sp-state', 'active');
            angular.forEach(element.children(), function (v, k) {
                element.children()[k].setAttribute('data-sp-state', 'active');
            });
          }

        };
      }
    };
  }]);

  //////////////////////////////
  // Need Data Service
  //////////////////////////////
  spDir.directive('component',['data', function (data) {
    return {
      scope: {
        name: '@name',
        source: '@source'
      },
      restrict: 'E',
      replace: true,
      template: '<span ng-include="getComponentUrl()"></span>',
      link: function($scope, elem, attrs) {
        data.get(attrs.source).then(function (components) {
          $scope.getComponentUrl = function() {
            for (var i in components) {
              if (components[i].name === attrs.name) {
                return components[i].path;
              }
            }
          };
        });
      }
    };
  }]);

})(window.angular);