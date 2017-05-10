var app = angular.module("gradeCalculator", []);

app.config(['$locationProvider',
    function($locationProvider) {
        if (window.history && window.history.pushState) {
            $locationProvider.html5Mode({
                enabled: true,
                requireBase: false
            });
        }
    }
]);

app.controller('MainController', ['$scope', '$filter', function($scope, $filter) {
    $scope.negativeGradesUnder = 4;
    $scope.negativeMultiplier = 2;

    $scope.classes = [];

    $scope.addNewGrade = function(value) {
        value.CurrentGrades.push({ value: null });
    };

    $scope.removeClass = function(value) {
        $scope.classes.splice($scope.classes.indexOf(value), 1);
    };

    $scope.addNewClass = function(className) {
        $scope.classes.push({
            Id: $scope.classes.length,
            Name: className,
            RoundedGrade: null,
            CurrentGrades: []
        });
    }

    $scope.initClases = function() {
        $scope.addNewClass('Math');
        $scope.addNewClass('German');
        $scope.addNewClass('English');
        $scope.addNewClass('French');
        $scope.addNewClass('Biology');
        $scope.addNewClass('Geography');
        $scope.addNewClass('History');
        $scope.addNewClass('Chemistry');
    }

    $scope.initClases();

    $scope.getClassAverageScore = function(currentClass) {
        var Grades = [];

        for (n in currentClass.CurrentGrades) {
            var Grade = currentClass.CurrentGrades[n].value;

            if (Grade && Grade >= 1)
                Grades.push(Grade);
        }

        return Math.round((Grades.reduce((a, b) => a + b, 0) / Grades.length) * 100) / 100;
    };

    $scope.getAverageScore = function() {
        var allGrades = [];
        angular.forEach($scope.classes, function(value, key) {
            var currentClassGrade = $scope.getClassAverageScore(value);

            if (isNumeric(currentClassGrade) && currentClassGrade >= 1) {
                value.RoundedGrade = Math.round(currentClassGrade * 2) / 2;
                allGrades.push(currentClassGrade);
            }
        });

        return allGrades.reduce((a, b) => a + b, 0) / allGrades.length;
    };

    $scope.getTotalScore = function(plusScore) {
        var score = 0
        angular.forEach($scope.classes, function(value, key) {
            var currentClassGrade = $scope.getClassAverageScore(value);

            if (isNumeric(currentClassGrade) && currentClassGrade >= 1) {
                var rounded = Math.round(currentClassGrade * 2) / 2;
                if (plusScore) {
                    if (rounded > $scope.negativeGradesUnder)
                        score += rounded - $scope.negativeGradesUnder;
                } else {
                    if (rounded < $scope.negativeGradesUnder)
                        score += ($scope.negativeGradesUnder - rounded) * $scope.negativeMultiplier;
                }
            }
        });

        return score;
    };

    /* STYLE ANGULAR */
    $scope.getClassByGrade = function(value) {
        if (value.RoundedGrade < 1)
            return { 'background-color': 'rgba(0, 0, 0, 0.5)' };
        if (value.RoundedGrade < 2)
            return { 'background-color': 'rgba(244, 67, 54, 0.5)' };
        if (value.RoundedGrade < 3)
            return { 'background-color': 'rgba(230, 81, 0, 0.5)' };
        if (value.RoundedGrade < 4)
            return { 'background-color': 'rgba(255, 152, 0, 0.5)' };
        if (value.RoundedGrade < 5)
            return { 'background-color': 'rgba(0, 150, 136, 0.5)' };
        if (value.RoundedGrade <= 6)
            return { 'background-color': 'rgba(76, 175, 80, 0.5)' };
    };

    $scope.getIconByGrade = function(value) {
        if (value.RoundedGrade < 1)
            return "school";
        if (value.RoundedGrade < 2)
            return "sentiment_very_dissatisfied";
        if (value.RoundedGrade < 3)
            return "sentiment_very_dissatisfied";
        if (value.RoundedGrade < 4)
            return "sentiment_dissatisfied";
        if (value.RoundedGrade < 4)
            return "sentiment_neutral";
        if (value.RoundedGrade < 5)
            return "sentiment_satisfied";
        if (value.RoundedGrade <= 6)
            return "sentiment_very_satisfied";
    };

    function isNumeric(n) {
        return !isNaN(parseFloat(n)) && isFinite(n);
    };
}]);