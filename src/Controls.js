var logger = require('loglevel');
var _ = require('./lodash');

module.exports = function (geoJson) {
    // Constructor

    // Constants
    var ROUTE_TYPE_ID = 'div#routeType';
    var SINGLE_PATH_ID = 'div#singlePath';
    var PATH_LENGTH_ID = 'div#pathLength';
    var ELEVATION_GAIN_ID = 'div#elevationGain';
    var ELEVATION_LOSS_ID = 'div#elevationLoss';
    var ELEVATION_TOTAL_CHANGE_ID = 'div#elevationTotalChange';
    var NUMBER_OF_STATIONS_ID = 'div#numberOfStations';
    var STATIONS_ORDER_ID = 'div#stationsOrder';
    var STATIONS_ON_PATH_ID = 'div#stationsOnPath';
    var DATA_CONSISTENCY_ID = 'div#dataConsistency';
    var ELEVATION_CHART_ID = 'canvas#elevationChart';
    var VERIFY_BUTTON_ID = 'button#verifyRoute';
    var LOADER_ID = 'div#loader';
    var LOADER_ELEMENT = '<div id="loader" class="overlay"><i class="fa fa-refresh fa-spin"></i></div>';
    var ELEVATION_CHART_ELEMENT = '<canvas id="elevationChart"></canvas>';

    var updateControlColor = function(element, isValid) {
        var VALID_COLOR_CLASS = 'bg-green';
        var INVALID_COLOR_CLASS = 'bg-yellow';
        var INFO_BOX_ICON = 'span.info-box-icon';

        if (_.isNull(isValid)) {
            $(element + ' ' + INFO_BOX_ICON).removeClass([INVALID_COLOR_CLASS, VALID_COLOR_CLASS].join(' '))
        } else {
            isValid
                ? $(element + ' ' + INFO_BOX_ICON).removeClass(INVALID_COLOR_CLASS).addClass(VALID_COLOR_CLASS)
                : $(element + ' ' + INFO_BOX_ICON).removeClass(VALID_COLOR_CLASS).addClass(INVALID_COLOR_CLASS);
        }
    }

    var updateControlValue = function(element, value, unit) {
        var INFO_BOX_NUMBER = 'span.info-box-number';

        logger.debug('Updating control element', element, 'with:', value, unit);
        $(element + ' ' + INFO_BOX_NUMBER).html(value + ' ' + (unit ? '<small>'+unit+'</small>' : ''));
    }

    var removeControlChildren = function(element) {
        $(ELEVATION_CHART_ID).empty();
    }

    // Methods
    this.updateRouteType = function(isNormalRoute) {
        var normalRouteString = $('input#normalRouteString').attr('value');
        var inspiredRouteString = $('input#inspiredRouteString').attr('value');
        updateControlValue(ROUTE_TYPE_ID, isNormalRoute ? normalRouteString : inspiredRouteString);
    }

    this.updatePathLength = function(isLengthValid, length) {
        updateControlValue(PATH_LENGTH_ID, length.toFixed(2), 'km');
        updateControlColor(PATH_LENGTH_ID, isLengthValid);
    }

    this.updateElevationGain = function(isElevationGainValid, elevationGain) {
        updateControlValue(ELEVATION_GAIN_ID, elevationGain.toFixed(2), 'm')
        updateControlColor(ELEVATION_GAIN_ID, isElevationGainValid);
    }

    this.updateElevationLoss = function(isElevationLossValid, elevationLoss) {
        updateControlValue(ELEVATION_LOSS_ID, elevationLoss.toFixed(2), 'm')
        updateControlColor(ELEVATION_LOSS_ID, isElevationLossValid);
    }

    this.updateElevationTotalChange = function(isElevationTotalChangeValid, elevationTotalChange) {
        updateControlValue(ELEVATION_TOTAL_CHANGE_ID, elevationTotalChange.toFixed(2), 'm');
        updateControlColor(ELEVATION_TOTAL_CHANGE_ID, isElevationTotalChangeValid);
    }

    this.updateNumberOfStations = function(areAllStationsPresent) {
        updateControlColor(NUMBER_OF_STATIONS_ID, areAllStationsPresent);
    }

    this.updateStationsOrder = function (isStationOrderCorrect) {
        updateControlColor(STATIONS_ORDER_ID, isStationOrderCorrect);
    }

    this.updateStationsOnPath = function (areAllStationsOnPath) {
        updateControlColor(STATIONS_ON_PATH_ID, areAllStationsOnPath);
    }

    this.updateSinglePath = function(isSinglePath) {
        updateControlColor(SINGLE_PATH_ID, isSinglePath);
    }

    this.updateDataConsistency = function(isDataConsistent) {
        updateControlColor(DATA_CONSISTENCY_ID, isDataConsistent);
    }

    this.drawElevationChart = function(pathElevation) {
        var X_AXIS_NUMBER_OF_LABELS = 10;
        var X_AXIS_LABEL_STRING = '[km]';
        var Y_AXIS_LABEL_STRING = '[m]';
        var CHART_BACKGROUND_COLOR = 'rgb(32, 77, 116)';

        var labelWidth = parseInt(pathElevation.data.length / X_AXIS_NUMBER_OF_LABELS);
        var labels = _.map(pathElevation.data, function(elevation) { return elevation.distance.toFixed(); });
        var data = _.map(pathElevation.data, function(elevation) { return elevation.elevation; }) ;

        logger.debug('Drawing elevation chart. Input:', pathElevation);

        var elevationChart = new Chart($(ELEVATION_CHART_ID), {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: '',
                    data: data,
                    fill: 'start',
                    radius: 0,
                    backgroundColor: CHART_BACKGROUND_COLOR
                }]
            },
            options: {
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: X_AXIS_LABEL_STRING
                        },
                        ticks: {
                            callback: function(dataLabel, index) {
                                return (index % labelWidth === 0) || (index === pathElevation.data.length-1) ? dataLabel : null;
                            }
                        }
                    }],
                    yAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: Y_AXIS_LABEL_STRING
                        },
                    }]
                },
                legend: {
                    display: false,
                },
                tooltips: {
                    enabled: false
                }
            }
        });
    }

    this.resetElevationChart = function() {
        var elevationChartParentElement = $(ELEVATION_CHART_ID).parent();
        $(ELEVATION_CHART_ID).remove();
        elevationChartParentElement.append(ELEVATION_CHART_ELEMENT);
    }

    this.addLoaderToButton = function() {
        $(VERIFY_BUTTON_ID).append(LOADER_ELEMENT);
    }

    this.removeLoaderFromButton = function() {
        $(VERIFY_BUTTON_ID + ' ' + LOADER_ID).remove();
    }

    this.resetAll = function(value) {
        var text = '';
        var isValid = value === undefined ? null : value;

        updateControlValue(ROUTE_TYPE_ID, text);
        updateControlValue(PATH_LENGTH_ID, text);
        updateControlColor(PATH_LENGTH_ID, isValid);
        updateControlValue(ELEVATION_GAIN_ID, text)
        updateControlColor(ELEVATION_GAIN_ID, isValid);
        updateControlValue(ELEVATION_LOSS_ID, text)
        updateControlColor(ELEVATION_LOSS_ID, isValid);
        updateControlValue(ELEVATION_TOTAL_CHANGE_ID, text);
        updateControlColor(ELEVATION_TOTAL_CHANGE_ID, isValid);
        updateControlColor(NUMBER_OF_STATIONS_ID, isValid);
        updateControlColor(STATIONS_ORDER_ID, isValid);
        updateControlColor(STATIONS_ON_PATH_ID, isValid);
        updateControlColor(SINGLE_PATH_ID, isValid);
        updateControlColor(DATA_CONSISTENCY_ID, isValid);
        this.resetElevationChart();
    }
}