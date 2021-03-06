/**
 * ParaViewWeb JavaScript Library.
 *
 * This module extend jQuery object to add support for graphical components
 * related to ParaViewWeb usage.
 *
 * This module registers itself as: 'paraview-ui-proxy-editor'
 *
 * @class jQuery.paraview.ui.Pipeline
 */
(function (GLOBAL, $) {

    var TEMPLATE_START_GROUP = '<div class="alert pv-gray-light pv-collapsable-content EXPANDED" role="alert"><div class="pv-collapse-title pv-collapsable-action clickable"><span class="vtk-icon-plus-circled">NAME</span></div><div class="pv-no-collapse-title pv-collapsable-action clickable"><span class="vtk-icon-minus-circled pv-absolute-left">NAME</span></div>',
        TEMPLATE_END_GROUP = "</div>",
        TEMPLATE_COLOR_BY_PANEL = "<div class='row pv-color-panel' data-proxy-id='REP_ID'><label class='col-sm-4 control-label'>Color By</label><div class='col-sm-8 text-center'><select class='form-control pv-form-height array' style='margin-bottom: 5px;' data-cancel-value='VALUES'>ARRAY_OPTIONS</select><select class='form-control pv-form-height component' style='margin-bottom: 5px;'></select><select class='form-control pv-form-height palette' style='margin-bottom: 5px;'>PALETTE_OPTIONS</select></div></div>",
        TEMPLATE_DELETE = "<span class='vtk-icon-trash clickable' data-action='delete-proxy' data-proxy-id='_ID_'></span>",
        TEMPLATE_EDITOR = "<div class='pv-editor-bar text-center pv-gray-dark row' style='padding-bottom: 5px;margin-bottom: 15px;'><span class='float-left vtk-icon-tools clickable' data-action='toggle-advance-properties'></span><span class='float-left clickable vtk-icon-bookmarkEMPTY' data-action='toggle-scalarbar' data-proxy-id='_ID_'></span><span class='float-left vtk-icon-resize-horizontal-1 clickable' data-action='rescale-data' data-proxy-id='_ID_'></span>TITLE CAN_DELETE<span class='float-right vtk-icon-cancel clickable' data-action='reset-property-values'></span><span class='float-right vtk-icon-ok clickable' data-action='apply-property-values'></span></div>PROPERTIES",
        TEMPLATE_OPTION = "<option SELECTED value='VALUE'>LABEL</option>",
        TEMPLATE_VALUE = "<div class='col-sm-12'style='margin: 5px 0'><input type='text' class='form-control pv-form-height value' data-type='TYPE' value='VALUE' cancel-value='VALUE' style='width: 90%;display: inline-block;'><span class='vtk-icon-trash clickable float-right' data-action='delete-value'></span></div>",
        // ID, NAME, LABEL, TYPE(str,number), DEPENDENCY, VALUE, VALUE1-6, CHECKED, OPTIONS, MIN, MAX, VALUES
        TEMPLATE_PROPERTIES = {
            checkbox: function(layout) {
                return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='1' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8'><input type='checkbox' class='checkbox value' data-type='TYPE' CHECKED cancel-value='VALUE'></div></div>";
            },

            textfield: function(layout) {
                switch(layout) {
                    case 1:
                        return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='1' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8 text-center'><input class='form-control pv-form-height value' data-type='TYPE' type='text' value='VALUE' cancel-value='VALUE'/></div></div>";
                    case 2:
                        return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='2'  data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8 text-center'><input class='pv-form-height value float-left' data-type='TYPE' style='width: 48%;color: #555;background-color: #fff;' type='text' value='VALUE1' cancel-value='VALUE1'/><input class='pv-form-height value float-right' style='width: 48%;color: #555;background-color: #fff;' data-type='TYPE' type='text' value='VALUE2' cancel-value='VALUE2'/></div></div>";
                    case 3:
                        return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='3'  data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8 text-center'><input class='pv-form-height value float-left' data-type='TYPE' style='width: 30%;color: #555;background-color: #fff;' type='text' value='VALUE1' cancel-value='VALUE1'/><input class='pv-form-height value' style='width: 30%;color: #555;background-color: #fff;' data-type='TYPE' type='text' value='VALUE2' cancel-value='VALUE2'/><input class='pv-form-height value float-right' data-type='TYPE' style='width: 30%;color: #555;background-color: #fff;' type='text' value='VALUE3' cancel-value='VALUE3'/></div></div>";
                    case 6:
                        return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='6'  data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8 text-center'><input class='pv-form-height value float-left' data-type='TYPE' style='width: 48%;color: #555;background-color: #fff;' type='text' value='VALUE1' cancel-value='VALUE1'/><input class='pv-form-height value float-right' style='width: 48%;color: #555;background-color: #fff;' data-type='TYPE' type='text' value='VALUE2' cancel-value='VALUE2'/><input class='pv-form-height value float-left' data-type='TYPE' style='width: 48%;color: #555;background-color: #fff;' type='text' value='VALUE3' cancel-value='VALUE3'/><input class='pv-form-height value float-right' data-type='TYPE' style='width: 48%;color: #555;background-color: #fff;' type='text' value='VALUE4' cancel-value='VALUE4'/><input class='pv-form-height value float-left' data-type='TYPE' style='width: 48%;color: #555;background-color: #fff;' type='text' value='VALUE5' cancel-value='VALUE5'/><input class='pv-form-height value float-right' data-type='TYPE' style='width: 48%;color: #555;background-color: #fff;' type='text' value='VALUE6' cancel-value='VALUE6'/></div></div>";
                    case 16:
                        return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='6'  data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8 text-center'><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE1' cancel-value='VALUE1'/><input class='pv-form-height value' style='width: 22%;color: #555;background-color: #fff;' data-type='TYPE' type='text' value='VALUE2' cancel-value='VALUE2'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE3' cancel-value='VALUE3'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE4' cancel-value='VALUE4'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE5' cancel-value='VALUE5'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE6' cancel-value='VALUE6'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE7' cancel-value='VALUE7'/><input class='pv-form-height value' style='width: 22%;color: #555;background-color: #fff;' data-type='TYPE' type='text' value='VALUE8' cancel-value='VALUE8'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE9' cancel-value='VALUE9'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE10' cancel-value='VALUE10'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE11' cancel-value='VALUE11'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE12' cancel-value='VALUE12'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE13' cancel-value='VALUE13'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE14' cancel-value='VALUE14'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE15' cancel-value='VALUE15'/><input class='pv-form-height value' data-type='TYPE' style='width: 22%;color: #555;background-color: #fff;' type='text' value='VALUE16' cancel-value='VALUE16'/></div></div>";
                    case -1:
                    case 0:
                        return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='-1' data-type='TYPE' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-12 control-label'>LABEL<span class='vtk-icon-plus clickable float-right' data-action='add-value'></span></label>VALUES</div>";
                }
                return "NOT FOUND layout " + layout;
            },
            slider: function(layout) {
                return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='1' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8'><input class='form-control pv-form-height' type='range' value='VALUE' min='MIN' max='MAX' step='1'></div></div>";
            },
            'list-1': function(layout) {
                return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='SIZE' data-type='TYPE' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8'><select class='form-control pv-form-height value' data-type='TYPE' cancel-value='VALUE'>OPTIONS</select></div></div>";
            },
            'list-n': function(layout) {
                return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='SIZE' data-type='TYPE' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8'><select class='form-control pv-form-height value multiple' data-type='TYPE' multiple cancel-value='VALUE'>OPTIONS</select></div></div>";
            },
            textarea:function(layout) {
                return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='1' data-property-name='NAME' data-dependency='DEPENDENCY'><label class='col-sm-4 control-label'>LABEL</label><div class='col-sm-8 text-center'><textarea rows='5' class='form-control pv-form-height value textarea' data-type='TYPE' cancel-value='VALUE'>VALUE</textarea></div></div>";
            },
            'unknown': function(layout) {
                return "<div class='row property' data-advanced='ADVANCED' data-proxy-id='_ID_' data-size='1' data-property-name='NAME' data-dependency='DEPENDENCY'>No widget type defined for prop NAME</div>";
            }
        },
        DATA_CONVERTOR = {
            str: function(value) { return value; },
            number: function(value) { return Number(value); },
            int: function(value) { return Math.floor(Number(value)); },
            float: function(value) { return Number(value); },
            proxy: function(value) { return value; }
        };

    // ------------------------------------------------------------------------

    function extractColorBy() {
        var array = $('.pv-color-panel select.array').val().split(':'),
            component = $('.pv-color-panel select.component').val() ? $('.pv-color-panel select.component').val().split(':') : [],
            palette = $('.pv-color-panel select.palette').val();
        return { representation: $('.pv-color-panel').attr('data-proxy-id'),  mode: array[0], array: array.slice(1), component: component, palette: palette };
    }

    function extractProperty(property_container) {
        var proxy_id = property_container.attr('data-proxy-id'),
            prop_name = property_container.attr('data-property-name'),
            size = property_container.attr('data-size'),
            type = property_container.attr('data-type'),
            values = [],
            changeCount = property_container.hasClass('has-change') ? 1 : 0;

        $('.value', property_container).each(function(){
            var me = $(this),
                convert = DATA_CONVERTOR[me.attr('data-type')]
                strValue = me.hasClass('checkbox') ? (me.is(':checked') ? '1' : '0') : me.val();

            if(type === 'proxy') {
                strValue = $('option[value="'+ strValue + '"]').html();
            }

            if(convert === undefined) {
                console.log("No converter find for " + me.attr('data-type'));
                convert = function(a){ return a; };
            }

            if(strValue !== me.attr('cancel-value')) {
                changeCount++;
            }

            if(me.hasClass('multiple')) {
                if(strValue) {
                    for(var i=0; i < strValue.length; ++i) {
                        values.push(convert(strValue[i]));
                    }
                }
            } else if(size && Number(size) > 1) {
                var valueList = strValue.split(',');
                for(var i=0; i < valueList.length; ++i) {
                        values.push(convert(valueList[i]));
                }
            } else {
                values.push(convert(strValue));
            }
        });

        if(changeCount === 0) {
            return null;
        }

        return { id: proxy_id, value: (size === '1' || type === 'proxy') ? values[0] : values, name: prop_name };
    }

    // ------------------------------------------------------------------------

    function apply(container) {
        var propertyList = [];
        $('.property').each(function(){
            var change = extractProperty($(this));
            if(change) {
                propertyList.push(change);
            }
        });
        container.trigger({
            type: 'apply',
            properties: propertyList,
            colorBy: extractColorBy()
        });
    }

    // ------------------------------------------------------------------------

    function cancel() {
        $('.value').each(function(){
            var me = $(this);
            if(me.hasClass('checkbox')) {
                me.prop('checked', me.attr('cancel-value') === '1');
            } else if(me.hasClass('multiple')) {
                me.val(me.attr('cancel-value').split(','));
            } else if(me.hasClass('textarea')) {
                me.val(me.attr('cancel-value'));
            } else {
                me.attr('value', me.attr('cancel-value'));
            }
        });
    }

    function showAdvanceProperty(mainContainer, show) {
        var advanceProps = $('.property[data-advanced=1]'),
            advanceButton = $('.pv-editor-bar span[data-action="toggle-advance-properties"]');
        if(show) {
            advanceButton.addClass('pv-text-red');
            mainContainer.addClass('advance-on');
            advanceProps.show();
        } else {
            advanceButton.removeClass('pv-text-red');
            mainContainer.removeClass('advance-on');
            advanceProps.hide();
        }
    }

    // ------------------------------------------------------------------------
    /**
     * Graphical component use to create a panel for editing proxy properties.
     *
     * @member jQuery.paraview.ui.Pipeline
     * @method proxyEditor
     * @param {String} title
     *      Proxy name or Label that we want on the top of the editor.
     *
     * @param {Boolean} is_leaf
     *      Is last proxy. In other word, can we delete it?
     *
     * @param {String} proxyId
     *      Main proxy id that should be deleted.
     *
     * @param {Array} properties
     * @param {Array} ui_list
     * @param {Object} arrayList
     * @param {Array} paletteList
     * @param {Object} colorByInfo
     *
     * Usage:
     *
     *      $('.proxy-editor').proxyEditor( ... );
     *
     * Events:
     *
     *      {
     *          type: 'delete-proxy',
     *          id: '456'
     *      }
     *
     *      {
     *          type: 'scalarbar-visibility',
     *          visible: true,
     *          id: '456'
     *      }
     *
     *      {
     *          type: 'rescale-transfer-function',
     *          mode: 'data',
     *          id: '456'
     *      }
     *
     *      {
     *        type: 'apply',
     *        properties: [ { name: "Center", id: "456", value: [45,657,6.768] }, ... ],
     *        colorBy: { representation: 'id of rep',  mode: 'ARRAY', array: ['POINTS', 'V'], component: [ 'Component', 2], palette: 'Palette name' }
     *      }
     *
     */
    $.fn.proxyEditor = function(title, is_leaf, proxyId, properties, ui_list, arrayList, paletteList, colorByInfo) {
        // Handle data with default values
        return this.each(function() {
            var me = $(this).empty().addClass('pv-proxy-editor'),
                bufferProperties = [];
                count = properties.length,
                propertiesWithDependencies = {},
                arrayOptions = [],
                paletteOptions = [],
                componentOptions = [],
                scalarbarVisibility = (colorByInfo.scalarBar === 1) ? true : false,
                activeArrayStr = (colorByInfo.mode === 'array') ? colorByInfo.array.slice(0,2).join(':') : 'solid',
                activeArrayComp = (colorByInfo.mode === 'array') ? colorByInfo.array[2].toString() : '0',
                activePalette = 'FIXME not yet available';

            // Update DOM
            for(var idx = 0; idx < count; ++idx) {
                var ui = ui_list[idx],
                    prop = properties[idx];

                if(ui === prop) {
                    // Group handling
                    if(ui[0] === '_') {
                        // End of group
                        bufferProperties.push(TEMPLATE_END_GROUP);
                    } else if (ui === 'ColorByPanel'){
                        // Add Color By panel
                        var range = [];
                        // => Array
                        var internalCount = arrayList.length;
                        arrayOptions.push(TEMPLATE_OPTION
                            .replace(/SELECTED/g, '')
                            .replace(/VALUE/g, 'SOLID')
                            .replace(/LABEL/g, 'Solid color'));
                        for(var i = 0; i < internalCount; ++i) {
                            var arrayId = arrayList[i].location + ':' + arrayList[i].name;
                            if(arrayList[i].location !== 'FIELDS') {
                                arrayOptions.push(TEMPLATE_OPTION
                                    .replace(/SELECTED/g, (activeArrayStr === arrayId) ? 'SELECTED' : '')
                                    .replace(/VALUE/g, 'ARRAY:' + arrayId)
                                    .replace(/LABEL/g, arrayList[i].name));
                                if(activeArrayStr === arrayId && arrayList[i].hasOwnProperty('range')) {
                                    range = arrayList[i].range;
                                }
                            }
                        }

                        // => Components
                        var internalCount = range.length;
                        for(var i = 0; i < internalCount; ++i) {
                            componentOptions.push(TEMPLATE_OPTION
                                .replace(/SELECTED/g, (i === colorByInfo.array[2]) ? 'SELECTED' : '')
                                .replace(/VALUE/g, (i===0 ? 'Magnitude:' : 'Component:') + (i-1))
                                .replace(/LABEL/g, range.name));
                        }

                        // => Palette
                        internalCount = paletteList.length;
                        paletteOptions.push(TEMPLATE_OPTION
                                .replace(/SELECTED/g, 'SELECTED')
                                .replace(/VALUE/g, '')
                                .replace(/LABEL/g, 'Choose palette'));
                        for(var i = 0; i < internalCount; ++i) {
                            paletteOptions.push(TEMPLATE_OPTION
                                .replace(/SELECTED/g, (paletteList[i] ===  activePalette ) ? 'SELECTED' : '')
                                .replace(/VALUE/g, paletteList[i])
                                .replace(/LABEL/g, paletteList[i]));
                        }

                        // ID, ARRAY_OPTIONS, COMPONENT_OPTIONS, PALETTE_OPTIONS
                        bufferProperties.push(TEMPLATE_COLOR_BY_PANEL
                            .replace(/VALUES/g, colorByInfo.hasOwnProperty('array') ? colorByInfo.array.join(':') : 'SOLID')
                            .replace(/REP_ID/g, colorByInfo.representation)
                            .replace(/ARRAY_OPTIONS/g, arrayOptions.join(''))
                            .replace(/PALETTE_OPTIONS/g, paletteOptions.join('')));
                    } else {
                        // Start group
                        bufferProperties.push(TEMPLATE_START_GROUP.replace(/NAME/g, ui.slice(1)).replace(/EXPANDED/g, (ui[0] === '+') ? '' : 'pv-collapse'));
                    }
                } else {
                    // Property handling
                    var html = TEMPLATE_PROPERTIES[ui.widget](ui.size),
                        value = prop.value,
                        dependency = (ui.hasOwnProperty('depends') ? ui.depends : '');

                    if(html.indexOf('NOT FOUND') !== -1) {
                        console.log("error on prop");
                        console.log(prop);
                        console.log(ui);
                    }

                    if(dependency.length > 0) {
                        propertiesWithDependencies[dependency] = true;
                    }

                    html = html.replace(/_ID_/g, prop.id)
                               .replace(/NAME/g, prop.name)
                               .replace(/LABEL/g, ui.name)
                               .replace(/TYPE/g, ui.type)
                               .replace(/ADVANCED/g, ui.advanced ? '1' : '0')
                               .replace(/DEPENDENCY/g, dependency);

                    // Handle values based on type
                    if(ui.widget.indexOf('list') != -1) {
                        html = html.replace(/VALUE/g, value).replace(/SIZE/g, ui.size).replace(/TYPE/g, ui.type);
                        var optionsBuffer = [],
                            optionTypeSimpleArray = ui.values.hasOwnProperty('length');

                        for(var key in ui.values) {
                            if(!optionTypeSimpleArray) {
                                var selected = (key == value || ui.values[key].toString() == value) ? 'SELECTED' : '';
                                optionsBuffer.push(TEMPLATE_OPTION.replace(/VALUE/g, ui.values[key])
                                                                  .replace(/SELECTED/g, selected)
                                                                  .replace(/LABEL/g, key)
                                                                  .replace(/SIZE/g, ui.size));
                            } else {
                                if(ui.widget === 'list-n') {
                                    optionsBuffer.push(TEMPLATE_OPTION.replace(/VALUE/g, ui.values[key])
                                                                      .replace(/SELECTED/g, (value.indexOf(ui.values[key]) !== -1) ? 'SELECTED' : '')
                                                                      .replace(/LABEL/g, ui.values[key])
                                                                      .replace(/SIZE/g, ui.size));
                                } else {
                                    var selected = (ui.values[key] == value) ? 'SELECTED' : '';
                                    optionsBuffer.push(TEMPLATE_OPTION.replace(/VALUE/g, ui.values[key])
                                                                      .replace(/SELECTED/g, selected)
                                                                      .replace(/LABEL/g, ui.values[key])
                                                                      .replace(/SIZE/g, ui.size));
                                }
                            }
                        }
                        if(optionsBuffer.length) {
                            html = html.replace(/OPTIONS/g, optionsBuffer.join(''));
                        } else {
                            html = null; // Will skip the property
                        }
                    } else if(ui.widget === 'checkbox') {
                        html = html.replace(/CHECKED/g, value ? 'CHECKED' : '').replace(/VALUE/g, value);
                    } else if(ui.size < 1) {
                        var valuesBuffer = [];
                        for(var i = 0; i < value.length; ++i) {
                            valuesBuffer.push(TEMPLATE_VALUE.replace(/VALUE/g, value[i]).replace(/TYPE/g, ui.type));
                        }
                        html = html.replace(/VALUES/g, valuesBuffer.join(''));
                    } else {
                        if(value instanceof Array) {
                            var size = value.length;
                            // Start from the end on purpose to prevent VALUE16 replaced by VALUE1
                            while(size--) {
                                var reg = new RegExp('VALUE' + (size+1), 'g');
                                html = html.replace(reg, value[size]);
                            }
                        } else {
                            html = html.replace(/VALUE/g, value);
                        }
                    }

                    if(html) {
                       bufferProperties.push(html);
                    }
                }
            }

            // Handle color by section
            me[0].innerHTML = TEMPLATE_EDITOR
                .replace(/TITLE/g, title)
                .replace(/CAN_DELETE/g, is_leaf ? TEMPLATE_DELETE.replace(/_ID_/g, proxyId) : '')
                .replace(/PROPERTIES/g, bufferProperties.join(''))
                .replace(/_ID_/g, proxyId)
                .replace(/EMPTY/g, scalarbarVisibility ? '' : '-empty');

            // Annotate properties with dependencies with 'has-dependency' class
            for(var key in propertiesWithDependencies) {
                try {
                    var array = key.split(':'),
                        proxy_id = array[0],
                        property = array[1];
                    $('.property[data-proxy-id="'+proxy_id+'"][data-property-name="'+property+'"]', me).addClass('has-dependency');
                } catch(ex) {
                    console.err(ex);
                }
            }

            // Attach listener
            if(!me.hasClass('has-listener')) {
                me.addClass('has-listener');
                me.on('click', function(event){
                    var target_container = $(event.target),
                        action = target_container.attr('data-action');

                    if(action === undefined) {
                        return;
                    }

                    if(action === 'toggle-advance-properties') {
                        showAdvanceProperty(me, !me.hasClass('advance-on'));
                    } else if (action === 'reset-property-values') {
                        cancel();
                    } else if (action === 'delete-proxy') {
                        me.trigger({
                            type: 'delete-proxy',
                            id: target_container.attr('data-proxy-id')
                        });
                    } else if (action === 'apply-property-values') {
                        apply(me);
                    } else if (action === 'toggle-scalarbar') {
                        me.trigger({
                            type: 'scalarbar-visibility',
                            visible: target_container.hasClass('vtk-icon-bookmark-empty'),
                            id: target_container.attr('data-proxy-id')
                        });
                    } else if (action === 'rescale-data') {
                        me.trigger({
                            type: 'rescale-transfer-function',
                            mode: 'data',
                            id: target_container.attr('data-proxy-id')
                        });
                    } else if (action === 'delete-value') {
                        target_container.parent().parent().addClass('has-change');
                        target_container.parent().remove();
                    } else if (action === 'add-value') {
                        var propertyContainer = target_container.parent().parent();
                        propertyContainer.addClass('has-change');
                        propertyContainer.append(TEMPLATE_VALUE.replace(/VALUE/g, 0).replace(/TYPE/g, propertyContainer.attr('data-type')));
                    }
                });
            }

            // - dependent property visibility
            $('.has-dependency', me).unbind().bind('change', function() {
                var hasDepContainer = $(this),
                    proxy_id = hasDepContainer.attr('data-proxy-id'),
                    prop_name = hasDepContainer.attr('data-property-name'),
                    dep_key = proxy_id + ':' + prop_name,
                    value = $('select',this).val(),
                    txt = $('option[value="RR"]'.replace(/RR/g,value) , this).html();

                $('.property', me).each(function(){
                    var prop = $(this),
                        dependency = prop.attr('data-dependency');

                    if(dependency) {
                        var depList = dependency.split(':');
                        if(proxy_id === depList[0] && prop_name === depList[1]) {
                            if(txt === depList[2]) {
                                if(depList[3] === '1') {
                                    prop.show();
                                } else {
                                    prop.hide();
                                }
                            } else {
                                if(depList[3] === '1') {
                                    prop.hide();
                                } else {
                                    prop.show();
                                }
                            }
                        }
                    }
                });
            }).trigger('change');

            // - Handle color by changes
            $('.pv-color-panel select.array').unbind().bind('change', function(){
                var arraySelec = $(this),
                    arrayValue = arraySelec.val().split(':'),
                    componentContainer = $('.pv-color-panel select.component'),
                    count = arrayList.length,
                    componentsInfo = null,
                    defaultcompIndex = Number(arraySelec.attr('data-cancel-value').split(':')[2]);

                // Update component
                while(count--) {
                    if(arrayValue[1] === arrayList[count].location && arrayValue[2] === arrayList[count].name) {
                        componentsInfo = arrayList[count].hasOwnProperty('range') ? arrayList[count].range : null;
                    }
                }
                if(componentsInfo) {
                    if(componentsInfo.length === 1) {
                        componentContainer.hide();
                    } else {
                        var compBuffer = [];
                        for(var i = 0; i < componentsInfo.length; ++i) {
                            compBuffer.push(TEMPLATE_OPTION
                                .replace(/SELECTED/g, ((i-1) === defaultcompIndex) ? 'SELECTED' : '')
                                .replace(/VALUE/g, (i===0 ? 'Magnitude:' : 'Component:') + (i-1))
                                .replace(/LABEL/g, componentsInfo[i].name));
                        }
                        componentContainer.show()[0].innerHTML = compBuffer.join('');
                    }
                } else {
                    componentContainer.hide();
                }
            }).trigger('change');

            // Hide advanced props
            showAdvanceProperty(me, me.hasClass('advance-on'));


            // Handle collapse panel
            $('.pv-collapsable-action', me).click(function(){
                $(this).parent().toggleClass('pv-collapse');
            });
        });
    };

    // ----------------------------------------------------------------------
    // Local module registration
    // ----------------------------------------------------------------------
    try {
      // Tests for presence of jQuery, then registers this module
      if ($ !== undefined) {
        vtkWeb.registerModule('paraview-ui-proxy-editor');
      } else {
        console.error('Module failed to register, jQuery is missing: ' + err.message);
      }
    } catch(err) {
      console.error('Caught exception while registering module: ' + err.message);
    }

}(window, jQuery));