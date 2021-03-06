'use strict';

// https://github.com/angular/angular.js/issues/1414
angular.module('filter.duration', ['ng'])

    .factory('$localeDurations', [function () {
        return {
            'one': {
                year: '{} year',
                month: '{} month',
                week: '{} week',
                day: '{} day',
                hour: '{} hour',
                minute: '{} minute',
                second: '{} second',
                millisecond: '{} millisecond'
            },
            'other': {
                year: '{} years',
                month: '{} months',
                week: '{} weeks',
                day: '{} days',
                hour: '{} hours',
                minute: '{} minutes',
                second: '{} seconds',
                millisecond: '{} milliseconds'
            }
        };
    }])

    .filter('duration', ['$locale', '$localeDurations', function ($locale, $localeDurations) {
        
        function pad(n, width, z) {
          z = z || '0';
          n = n + '';
          return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }

        return function duration(value, unit, precision, format) {
            var unitNames = ['year', 'month', 'week', 'day', 'hour', 'minute', 'second', 'millisecond'],
                units = {
                    year: 1000*86400*365.25,
                    month: 1000*86400*31,
                    week: 1000*86400*7,
                    day: 1000*86400,
                    hour: 1000*3600,
                    minute: 1000*60,
                    second: 1000*1,
                    millisecond: 1
                },
                words = [],
                maxUnits = unitNames.length;
            precision = parseInt(precision, 10) || units[precision || 'millisecond'] || 1;
            value = (parseInt(value, 10) || 0) * (units[unit || 'millisecond'] || 1);

            if (value >= precision) {
                value = Math.round(value / precision) * precision;
            } else {
                maxUnits = 1;
            }

            var major = ['year', 'month', 'day'];
            var i, n;
            for (i = 0, n = unitNames.length; i < n && value !== 0; i++) {

                var unitName = unitNames[i],
                    unitValue = Math.floor(value / units[unitName]);

                var formatted=unitValue;
                
                if (major.indexOf(unitName)>-1 && unitValue>0){
                  
                  var pluralize = 'one';
                  if(unitValue>1){ pluralize='other'; }
                  var unitLable = $localeDurations[pluralize][unitName];
                  return unitLable.replace('{}',unitValue);
                }
                
                if(['minute','second'].indexOf(unitName)>-1){
                  formatted = pad(unitValue,2);
                }
                  
                format = format.replace(unitName, formatted);
                if (--maxUnits === 0) {
                    break;
                }

                value = value % units[unitName];
            }
            
            return format;
        };
    }]);
