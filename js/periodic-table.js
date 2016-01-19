var settings = {
    familyColour: false,
    elementSpacing: 2,
    showDetails: true,
    detailsColumns: 3
    };

var filterRegistry = new FilterRegistry();
var detailsRowIdx = 0;
var elementProperties = [];

function registerDetail (displayName, property) {
    elementProperties.push({
        name: displayName,
        property: property
    });
}

function addDetailsRow( listElement, propertyName, value ) {
    $('#' + listElement).append('<li style="display: block"><label style="font-weight: bold; width: 190px; display: inline-block; margin-right: 5px">' + propertyName + ':</label> ' + value + '</li>');
}

function showDetails(elementNumber, columnCount, fields) {
    var html = '', i, propertiesPerCol, column = -1;

    propertiesPerCol = elementProperties.length / settings.detailsColumns;

    if (elementNumber && elementNumber.trim().length > 0) {
        $('#elementDetails .content').html('');

        html = '';
        for (i=0; i < settings.detailsColumns; i++) {
            html += '<div style="display: inline-block; width: 400px">';
            html += '<ul id="properties-' + i + '">';
            html += '</ul>';
            html += '</div>';
        }
        $('#elementDetails .content').append(html);

        for (i=0; i < elementProperties.length; i++) {
            if (i % propertiesPerCol === 0) {
                column++;
            }

            addDetailsRow(
                'properties-' + column,
                elementProperties[i].name,
                elements[elementNumber][elementProperties[i].property] );
        }
    } else {
        html += '<p style="margin-left: 40px">No Element selected</p>';
        $('#elementDetails .content').html(html);

    }

}


function maxColumns(array) {
    var maxColumns = 0, i;
    for (i=0; i<periodicTableLayout.length; i++) {
        if (periodicTableLayout[i].length > maxColumns) {
            maxColumns = periodicTableLayout[i].length;
        }
    }
    return maxColumns;
}

function drawElement(snap, x, y, width, height, elementInfo) {
    var box, text, rect, elementId, cssClass = 'element ';

    group = snap.group();

    if (elementInfo.number) {
        if (elementInfo.family && elementInfo.family.trim().length > 0) {
            cssClass += elementInfo.family
                .toLowerCase().replace(' ', '').replace('-', '');
            if (settings.familyColour === false) {
                cssClass += ' nofill';
            }
        }

        box = snap.rect(0,0,200,200).attr({
            stroke: 'white',
            fill: 'white',
            'class': cssClass
        });
        group.append(box);


        text = snap.text(100, 40, elementInfo.number);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '200%'
           });

        group.append(text);

        text = snap.text(100, 105, elementInfo.symbol);
        text.attr({
           'text-anchor': 'middle',
           'font-weight': 'bold',
           'font-size': '360%'
           });

        group.append(text);

        text = snap.text(100, 150, elementInfo.name);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '180%'
           });

        group.append(text);

        text = snap.text(100, 185, elementInfo.atomicWeight);
        text.attr({
           'text-anchor': 'middle',
           'font-size': '180%'
           });

        group.append(text);

        elementId = 'element-' + elementInfo.number;

    } else {
        box = snap.rect(0,0,200,200).attr({
            stroke: 'none',
            fill: 'none',
            'stroke-width': 0
        });
        group.append(box);

        text = snap.text(100, 110, elementInfo.symbol);
        text.attr({
           'text-anchor': 'middle',
           'font-weight': 'bold',
           'font-size': '300%'
           });

        group.append(text);
    }

    scale = width / 200;

    group.transform('s' + scale.toFixed(2));

    bbox = group.getBBox();

    group.transform('S' + scale.toFixed(2) + 'T' + ((-bbox.x)+x) + ' ' + ((-bbox.y)+y));

    if (elementInfo.number) {
        group2 = snap.group();
        group2.append(group);

        rect = snap.rect(x, y, width, height).attr({
           stroke: 'black',
           fill: 'none',
           'stroke-width': '1px'
        });
        group2.append(rect);

        group2.attr({
           id: elementId
        });

        $('#' + elementId).on('mouseenter', function (event) {
            Snap.select('#' + elementId).attr('class', 'highlight');
            showDetails(elementId.substring(elementId.indexOf('-') + 1));
        });

        $('#' + elementId).on('mouseleave', function (event) {
            Snap.select('#' + elementId).attr('class', '');
            showDetails();
        });
    } else {
        snap.rect(x, y, width, height).attr({
           stroke: 'black',
           fill: 'none',
           strokeDasharray: '5 5'
        });
    }
}

function showSettings() {
    $('#settings').animate({ left: '0' }, 1000);
}

function hideSettings() {
    $('#settings').animate({ left: '-450' }, 1000);
}

function initDetails() {
    registerDetail( 'Atomic Number', 'atomic_number' );
    registerDetail( 'Symbol', 'symbol');
    registerDetail( 'Name', 'name');
    registerDetail( 'Atomic Weight', 'atomic_weight' );
    registerDetail( 'Atomic Volume', 'atomic_volume' );

    registerDetail( 'Melting Point (°C)', 'melting_point' );
    registerDetail( 'Boiling Point (°C)', 'boiling_point' );
    registerDetail( 'Electron Configuration', 'electron_config' );
    registerDetail( 'Radioactive', 'radioactive');
    registerDetail( 'Half-life', 'half_life');

    registerDetail( 'Group (New IUPAC)', 'group_iupac_new' );
    registerDetail( 'Group (Old IUPAC)', 'group_iupac_old' );
    registerDetail( 'Group (CAS)', 'cas_group' );
    registerDetail( 'Period', 'period');
    registerDetail( 'Block', 'block' );
}

function initFilters() {
    filterRegistry.register(new RangeFilter('Atomic Weight (AMU)', 'atomic_weight'));
    filterRegistry.register(new RangeFilter('Atomic Number', 'atomic_number'));
    filterRegistry.register(new RangeFilter('Atomic Radius (Å)', 'atomic_radius'));
    filterRegistry.register(new RangeFilter('Covalent Radius (Å)', 'covalent_radius'));
    filterRegistry.register(new RangeFilter('Melting Point (°C)', 'melting_point'));
    filterRegistry.register(new RangeFilter('Boiling Point (°C)', 'boiling_point'));
    filterRegistry.register(new BooleanFilter('Radioactive', 'radioactive', { mode: 'combobox' }));

    var i=0, html;
    var allFilters = filterRegistry.getAllFilters();
    for (i=0; i<allFilters.length; i++) {
        html = '<div class="row"><input type="checkbox"/> <label>'
           + allFilters[i].getDisplayName()
           + '</label>'
           + allFilters[i].getHtml()
           + '</div>';
        $('#filters').append(html);
    }
}

function initSettings() {
    $('.settingsOpenIcon').on('click', function () { hideSettings(); } );
    $('.settingsIcon').on('click', function () { showSettings(); } );

    $('select[name=displayMode]').on('change', function () {
        var value = $('select[name=displayMode]').val();
        if (value === 'colour') {
            document.location.hash = '#colour';
            Snap.selectAll('.element').forEach(function (node) {
               node.removeClass('nofill');
            });
        } else {
            document.location.hash = '';
            Snap.selectAll('.element').forEach(function (node) {
               node.addClass('nofill');
            });
        }
    });
}

function initSnap (htmlElementId) {
    var snap, elementRef, element, width, height;

    elementRef = '#' + htmlElementId;
    element = $(elementRef);

    width = element.width();
    height = element.height();

    html = '<svg style="width: ' + element.width() + 'px; height: ' + element.height() + 'px;" shape-rendering="crispEdges" />';

    element.append(html);

    return  Snap(elementRef + ' svg');
}

function drawTable (htmlElementId) {
    var snap, rows, columns, options;

    snap = initSnap(htmlElementId);

    //

    if (document.location.hash) {
        options = document.location.hash.substring(1).split(',');
        if (options.indexOf('colour') > -1) {
            settings.familyColour = true;
        }
        if (options.indexOf('hideDetails') > -1) {
            settings.showDetails = false;
        }
    }

    rows = periodicTableLayout.length;
    columns = maxColumns(periodicTableLayout);

    cellWidth = 55;
    cellHeight =  55;

    offsetY = 2;
    for (i=0; i<periodicTableLayout.length; i++) {
      offsetX = 2;
      for (j=0; j<periodicTableLayout[i].length; j++) {

          if (periodicTableLayout[i][j] && periodicTableLayout[i][j].trim().length > 0) {

             if (parseInt(periodicTableLayout[i][j].trim()) > 0) {
                 var atomicNumber = periodicTableLayout[i][j].trim();
                 var elementInfo = {
                        number: periodicTableLayout[i][j].trim(),
                        symbol: elements[atomicNumber].symbol,
                        name: elements[atomicNumber].name,
                        atomicWeight: elements[atomicNumber].atomic_weight,
                        family: elements[atomicNumber].family
                    };

                 drawElement (snap, offsetX, offsetY, cellWidth, cellHeight, elementInfo);
             } else {
                 var elementInfo = {
                        symbol: periodicTableLayout[i][j].trim(),
                    };

                 drawElement (snap, offsetX, offsetY, cellWidth, cellHeight, elementInfo);
             }
          }

          offsetX = offsetX + cellWidth + settings.elementSpacing ;
      }
      offsetY = offsetY + cellHeight + settings.elementSpacing;
    }

    if (settings.familyColour === false) {
        $('#legend').css('display', 'none');
    }

    if (settings.showDetails === false) {
        $('#elementDetails').css('display', 'none');
    }

    initSettings();
    initFilters();
    initDetails();

}

