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
    'Magestore_OneStepCheckout/js/action/showLoader',
    'jquery/ui',
    'mage/validation',
], function ($, mageTemplate, mageUrl, showLoader) {
    'use strict';
        return{
            options: {
                optionTemplate:
                '<option value="<%- data.value %>" <% if (data.isSelected) { %>selected="selected"<% } %>>' +
                '<%- data.title %>' +
                '</option>',
                defaultNeighborhood: ''
            },


            getFields: function (postcode){
                this.regionTmpl = mageTemplate(this.options.optionTemplate);
                var url = mageUrl.build('addressmx/ajax/data');
                var filter_array = {field: "postcode", value: postcode};
                var hasData = true;                
                $.ajax({
                    method: "POST",
                    url: url,
                    data: {filter: filter_array},
                    async: false
                }).done($.proxy(function(data) {
                    if(data.length < 1){
                        hasData = false;
                        showLoader().address(false);
                    } else {
                        this._updateFields(data);
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
                    if (index) {
                        $(this).remove();
                    }
                });
            },

            /**
             * Render dropdown list
             * @param {Object} selectElement - jQuery object for dropdown list
             * @param {String} key - region code
             * @param {Object} value - region object
             * @private
             */
            _renderSelectOption: function (selectElement, key, value) {
                selectElement.append($.proxy(function () {
                    var tmplData,
                        tmpl;

                    tmplData = {
                        value: value.clave_colonia,
                        title: value.colonia,
                        isSelected: false
                    };

                    if (key == 0) {
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
            _updateFields: function (data) {

                var neighborhoodId = $("div[name='shippingAddress.custom_attributes.neighborhood_id']").find("select"),
                    neighborhood = $("div[name='shippingAddress.custom_attributes.neighborhood']").find("input"),
                    region = $("div[name='shippingAddress.region']").find("input"),
                    regionId = $("div[name='shippingAddress.region_id']").find("input"),
                    city = $("div[name='shippingAddress.city']").find("input"),
                    cityId = $("div[name='shippingAddress.custom_attributes.city_id']").find("input");

                this._removeSelectOptions(neighborhoodId);

                $.each(data, $.proxy(function (key, value) {
                    this._renderSelectOption(neighborhoodId, key, value);

                }, this));
                
                var other = {
                    colonia: 'Otra',
                    clave_colonia: 0
                }
                this._renderSelectOption(neighborhoodId, -1, other);

                var first = data[0];
                region.val(first.estado).keyup();
                regionId.val(first.clave_estado).keyup();
                neighborhood.val(first.colonia).keyup();
                city.val(first.municipio).keyup();
                cityId.val(first.clave_municipio).keyup();
                neighborhoodId.change();

                neighborhoodId.removeAttr('disabled');
                showLoader().address(false);

            }

        }

});
