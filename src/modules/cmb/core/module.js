angular.module("kitware.cmb.core",["kitware.cmb.core.tpls"])
    .filter('toDateNumber', function() {
        return function(str) {
            if(str === undefined) {
                return 0;
            }
            var day = str.split(' ')[0].split('-'),
                time = str.split(' ')[1].split('.')[0].split(':'),
                args = [].concat(day, time);
            return new Date(args[0], args[1], args[2], args[3], args[4], args[5]).getTime();
        };
    })
    .filter('bytes', function() {
        return function(bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) +  ' ' + units[number];
        };
    })
    .directive("fileread", [function () {
        return {
            scope: {
                fileread: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    var reader = new FileReader();
                    reader.onload = function (loadEvent) {
                        scope.$apply(function () {
                            scope.fileread = loadEvent.target.result;
                        });
                    };
                    reader.readAsDataURL(changeEvent.target.files[0]);
                });
            }
        };
    }])
    .directive("filemeta", [function () {
        return {
            scope: {
                filemeta: "="
            },
            link: function (scope, element, attributes) {
                element.bind("change", function (changeEvent) {
                    scope.$apply(function () {
                        scope.filemeta = changeEvent.target.files[0];
                    });
                });
            }
        };
    }])
    .directive('deltaTime', ['$interval', 'dateFilter', function($interval, dateFilter) {

        function link(scope, element, attrs) {
            var format,
                startTime = 0,
                timeoutId;

            function updateTime() {
                var deltaDate = new Date();
                deltaDate.setTime(deltaDate.getTime() - startTime);
                element.text(dateFilter(deltaDate, format));
            }

            scope.$watch(attrs.format, function(value) {
                format = value;
                updateTime();
            });

            scope.$watch(attrs.start, function(value) {
                console.log(value);
                startTime = Number(value);
                updateTime();
            });

            element.on('$destroy', function() {
                $interval.cancel(timeoutId);
            });

            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function() {
              updateTime(); // update DOM
            }, 1000);
        }

        return {
          link: link
        };
    }]);
