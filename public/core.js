var viewReddit = angular.module('viewReddit', [])

function mainController($scope, $http) {
    $scope.formData = {};
    
    // when landing on the page, get get and show frontpage posts
    $http.get('/api/reddit')
        .success(function(data) {
            $scope.subreddit = data.subreddit;
            $scope.posts = data.posts;
            console.log(data);
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
}