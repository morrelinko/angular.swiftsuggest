Angular Swift Suggest
==========================

SwiftSuggest is an angular directive that focuses on rending suggestions from the server as opposed
to some pre-defined data.

It supports the use of keyboard arrow keys for navigating suggestions.

### Setup

To use swiftsuggest, you need to make sure angular JS is loaded first.

```html
<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.2.12/angular.min.js"></script>
```

Then download swiftsuggest, add the stylesheet and javascript file to your web page

```html
<link rel="stylesheet" href="/path/to/scripts/swiftsuggest.css" />
<script src="/path/to/scripts/angular.swiftsuggest.js"></script>
```

Then add `swiftsuggest` as one of your applications module dependencies.

```javascript
var app = angular.module('YourApp', ['swiftsuggest']);
```

### Usage

If you want swiftsuggest on your web-page, you need to call the `<swift-suggest>` html tag or
`swift-suggest` as an attribute. Some attributes are required to make swiftsuggest work which are
described below.

#### Attributes

`items`: [required] a lookup array that will be used for the suggestions.
 This should be available in your controller.

`model`: [required] will hold whatever user types.

`on-suggest`: [required] A callback function that receives changes when all constraint are met and pulls server for suggestions based. This in turn updates lookup array and swiftsuggest takes over from there.

`on-select`: [required] A callback function that will be invoked when user selects suggestion from the list. The selected item is passed as an argument to this function.

`min-chars`: [optional] minimum number of characters before swiftsuggest start sending requests to your server for suggestions.

`attr-input-placeholder`: [optional] Sets desired text as placeholder into the swiftsuggest input element.

#### Example

[HTML]

```html
<div ng-controller="ModeratorsCtrl">
    <swift-suggest
        placeholder="Search For Users"
        items="user"
        min-chars="2"
        model="term"
        on-suggest="getUserSuggestions"
        on-select="selectUser">
    </swift-suggest>
</div>
```

[JavaScript]:

```javascript
var app = angular.module('app', ['swiftsuggest']);

app.controller('ModeratorsCtrl', function($scope){
    $scope.users = []; // will hold an array of matched user (which we'll get from the server)
    $scope.user = {}; // will hold the selected user

    $scope.getUserSuggestions = function(searchTerm){
        User.find(searchTerm).then(function(moderators) {
            $scope.users = users;
        });
    };

    $scope.selectUser = function(user) {
        $scope.user = user;
    };

    $scope.assignModerator = function(user) {
        //
    };
});
```

See the samples/moderators.js for full code

### Custom Suggestions HTML

```html
<div ng-controller="ModeratorsCtrl">
    <swift-suggest
        placeholder="Search For Users"
        items="moderators"
        min-chars="2"
        model="term"
        on-suggest="getUserSuggestions"
        on-select="selectUser">
        <img height="auto" src="http://lorempixel.com/60/60/sports/" />
        <p><b ng-bind-html="item.name | swiftSuggestHighlight : model"></b></p>
        <p>{{ item.description }}</p>
    </swift-suggest>
</div>
```