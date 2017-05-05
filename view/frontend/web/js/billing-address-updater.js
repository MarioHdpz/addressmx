/**
 * Created by mario on 2/03/17.
 */
/**
 * @category    frontend Checkout region-updater
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*jshint browser:true expr:true*/
define([
    'jquery',
    'mage/template',
    'mage/url',
    'Magento_Checkout/js/model/full-screen-loader',
    'jquery/ui',
    'mage/validation',
], function ($, mageTemplate, mageUrl, Loader) {
    'use strict';
    var currentNeighborhoodString = "";
        return{
            options: {
                optionTemplate:
                '<option value="<%- data.value %>" <% if (data.isSelected) { %>selected="selected"<% } %>>' +
                '<%- data.title %>' +
                '</option>',
                defaultNeighborhood: ''
            },


            getFields: function (postcode,dataScope){
                Loader().all(true);
                this.regionTmpl = mageTemplate(this.options.optionTemplate);
                var url = mageUrl.build('addressmx/ajax/data');
                var filter_array = {field: "postcode", value: postcode};
                var hasData = true;                
                $.ajax({
                    method: "POST",
                    url: url,
                    data: {filter: filter_array},
                    showLoader: true
                }).done($.proxy(function(data) {
                    if(data.length < 1){
                        hasData = false;
                        Loader().all(false);
                    } else {
                        this._updateFields(data,dataScope);
                    }
                },this));
                return hasData;
            },

            /**
             * Remove options from dropdown list
             *
             * @param {Object} selectElement - jQuery object for dropdown list
             * @private
             */
            _removeSelectOptions: function (selectElement) {
                selectElement.find('option').each(function (index) {
                    $(this).remove();
                });
            },

            /**
             * Render dropdown list
             * @param {Object} selectElement - jQuery object for dropdown list
             * @param {String} key - region code
             * @param {Object} value - region object
             * @private
             */
            _renderSelectOption: function (selectElement, key, value, currentNeighborhood) {
                selectElement.append($.proxy(function () {
                    var tmplData,
                        tmpl;

                    tmplData = {
                        value: value.clave_colonia,
                        title: value.colonia,
                        isSelected: false
                    };

                    if (parseInt(currentNeighborhood) === parseInt(value.clave_colonia)) {
                        tmplData.isSelected = true;
                    }else if (key == 0 && !currentNeighborhood) {
                        tmplData.isSelected = true;
                    }

                    tmpl = this.regionTmpl({
                        data: tmplData
                    });

                    return $(tmpl);
                }, this));
            },

            /**
             * Update dropdown list based on the postcode json
             *
             * @param {Json} data
             * @private
             */
            _updateFields: function (data,dataScope) {

                var neighborhoodId = $("div[name='"+dataScope+".custom_attributes.neighborhood_id']").find("select"),
                    neighborhood = $("div[name='"+dataScope+".custom_attributes.neighborhood']").find("input"),
                    region = $("div[name='"+dataScope+".region']").find("input"),
                    regionId = $("div[name='"+dataScope+".region_id']").find("input"),
                    city = $("div[name='"+dataScope+".city']").find("input"),
                    cityId = $("div[name='"+dataScope+".custom_attributes.city_id']").find("input"),
                    currentNeighborhood = "";
                    
                if(neighborhoodId.find(":first-child")[0].value != ""){
                    currentNeighborhood = neighborhoodId.find(":first-child")[0].value;
                    currentNeighborhoodString = neighborhood.val();
                }
                
                this._removeSelectOptions(neighborhoodId);

                $.each(data, $.proxy(function (key, value) {
                    this._renderSelectOption(neighborhoodId, key, value, currentNeighborhood);
                }, this));
                
                var other = {
                    colonia: 'Otra',
                    clave_colonia: 0
                }
                this._renderSelectOption(neighborhoodId, -1, other, currentNeighborhood);

                var first = data[0];
                region.val(first.estado);
                regionId.val(first.clave_estado);
                if (currentNeighborhoodString == ""){
                    neighborhood.val(neighborhoodId.find("option:selected").text());
                }
                city.val(first.municipio);
                cityId.val(first.clave_municipio);

                city.keyup();
                region.keyup();
                regionId.keyup();
                cityId.keyup();
                neighborhood.keyup();
                neighborhoodId.change();
                neighborhoodId.removeAttr('disabled');

                Loader().all(false);
            }

        }

});
