var swiftsuggest = angular.module('swiftsuggest', []);

swiftsuggest.directive('swiftSuggest', function() {
  return {
    restrict: 'EA',
    replace: true,
    transclude: true,
    scope: {
      items: '=items',
      placeholder: '@placeholder',
      min: '@min',
      model: '=model',
      update: '=update',
      select: '=select'
    },
    controller: [
      '$scope', '$transclude', function($scope, $transclude) {
        this.renderSuggestion = $transclude;
      }
    ],
    link: function(scope, elem, attr) {
      var minLength = parseInt(scope.min || 3),
        index = -1,
        keys = {TAB: 9, ESC: 27, RETURN: 13, LEFT: 37, UP: 38, RIGHT: 39, DOWN: 40};

      scope.selectedIndex = -1; // The selected index
      scope.activated = false; // If swift suggest is activated
      scope.searchTerm = null; // Search filter
      scope.showSuggestions = false; // Display dropdown for suggestions?

      /**
       * Gets the current selected item index
       * @returns int
       */
      scope.currentIndex = function() {
        return scope.selectedIndex;
      };

      /**
       * Checks if the index is the currently highlighted index
       * @returns {boolean}
       */
      scope.isCurrentIndex = function(index) {
        return scope.selectedIndex == index;
      };

      /**
       * Sets the selected index
       * @param index
       */
      scope.setIndex = function(index) {
        scope.selectedIndex = index;
      };

      /**
       * Callback when a suggested item is clicked
       * @param item
       */
      scope.selectItem = function(item) {
        // Callback when an item is
        scope.finish();

        scope.model = item;
        scope.select && scope.select(item, scope);
      };

      /**
       * Utility function that clears the input field
       */
      scope.clearInput = function() {
        scope.model = '';
      };

      /**
       * Utility function that sets a value on the input field
       * @param value
       */
      scope.setValue = function(value) {
        scope.model = value;
      };

      scope.finish = function() {
        scope.activated = false;
        scope.showSuggestions = false;
        scope.setIndex(-1);
      };

      scope.$watch('model', function(currentValue, oldValue) {
        // Watch the model for changes
        if ((currentValue == oldValue)) {
          return true;
        }

        if (currentValue.length < minLength) {
          scope.showSuggestions = false;
          return true;
        }

        scope.activated = true;
        if (scope.model) {
          // If we are watching and the user has typed something
          scope.searchTerm = scope.model;
        }

        // If the constraints are passed, fetch the data based on the term
        scope.update && scope.update(scope.model);
      });

      scope.$watch('items', function() {
        // Watches items, if it changes and swift-suggest is activated, show suggestions
        if (scope.activated && scope.items.length) {
          // Only show suggestions if the items is not empty
          scope.showSuggestions = true;
        }
      });

      angular.element(document)
        .on('keydown', function(e) {
          var keyCode = e.which,
            list = elem.find('li'),
            count = list.length;

          switch (keyCode) {
            case keys.UP:
              // If the up key is pressed
              index = scope.currentIndex() - 1;
              if (index < -1) {
                index = count - 1;
              }

              scope.$apply(function() {
                scope.setIndex(index);
              });
              break;
            case keys.DOWN:
              index = scope.currentIndex() + 1;
              if (index >= count) {
                index = -1;
              }

              scope.$apply(function() {
                scope.setIndex(index);
              });
              break;
            case keys.RETURN:
              // If the enter key is pressed
              index = scope.currentIndex();
              if (index !== -1) {
                var item = JSON.parse(angular.element(list[index]).attr('data-item'));
                scope.selectItem(item);
                scope.finish();
                scope.$apply();
              }
              break;
            case keys.ESC:
              // If the ESC key is pressed,
              // * remove suggestions
              scope.showSuggestions = false;
              scope.setIndex(-1);
              scope.$apply();
              break;
          }
        });

      elem.on('mouseleave', function() {
        scope.setIndex(-1);
        scope.$apply();
      });

      document.addEventListener('blur', function() {
        // disable suggestions on blur
        // we do a timeout to prevent hiding it
        // before a click event is registered
        setTimeout(function() {
          scope.finish();
          scope.$apply();
        }, 200);
      }, true);

    },
    template: ''.concat(
      '<div class="swift-suggest">',
      '<input class="swift-suggest-input" type="text" ng-model="model" placeholder="{{ placeholder }}" ng-keydown="selected=false" ng-focus="activated=true" />',
      '<ul class="swift-suggestions" ng-show="showSuggestions">',
      '<li class="swift-suggestions-item" data-item="{{ item }}" ng-repeat="item in items" ng-click="selectItem(item)" ng-class="{active: isCurrentIndex($index)}" ng-mouseenter="setIndex($index)" swift-suggestion>',
      '</li>',
      '</ul>',
      '</div>')
  }
});

swiftsuggest.directive('swiftSuggestion', function() {
  return {
    restrict: 'EA',
    require: '^swiftSuggest',
    link: function(scope, element, attr, suggestCtrl) {
      suggestCtrl.renderSuggestion(scope, function(dom) {
        if (dom[1]) {
          element.append(dom);
        } else {
          element.append('<span ng-bind-html="item | swiftHighlight: model"></span>');
        }
      });
    }
  };
});

swiftsuggest.filter('swiftHighlight', [
  '$sce', function($sce) {
    return function(input, searchTerm) {
      if (searchTerm) {
        var words = searchTerm.split(/\ /).join('|'),
          exp = new RegExp("(" + words + ")", "gi");

        if (words.length && input.replace) {
          input = $sce.trustAsHtml(input.replace(exp, "<span class=\"highlight\">$1</span>"));
        }
      }

      return input;
    }
  }
]);