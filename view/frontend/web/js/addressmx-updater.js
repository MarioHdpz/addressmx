/**
 * @category    frontend Checkout region-updater
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*jshint browser:true expr:true*/
define([
    'jquery',
    'mage/template',
    'jquery/ui',
    'mage/validation'
], function ($, mageTemplate) {
    'use strict';
    var currentNeighborhoodString = "";
    $.widget('pengo.addressmxUpdater', {
        options: {
            optionTemplate:
                '<option value="<%- data.value %>" <% if (data.isSelected) { %>selected="selected"<% } %>>' +
                    '<%- data.title %>' +
                '</option>',
            isRegionRequired: true,
            isZipRequired: true,
            isCountryRequired: true,
            currentRegion: null,
            isMultipleCountriesAllowed: true,
        },

        /**
         *
         * @private
         */
        _create: function () {
            this._hideIds();
            if (this.options.currentNeighborhood == 0) {
                currentNeighborhoodString = $(this.options.neighborhood).val();
            }
            this._clearError();
            this.regionTmpl = mageTemplate(this.options.optionTemplate);
            this._initZip();
            this._initSelect();
        },

        /**
         *
         * @private
         */
        _hideIds: function () {
            var neighborhood = $(this.options.neighborhood),
                regionId = $(this.options.regionId),
                cityId = $(this.options.cityId);
            var elements_to_hide = [neighborhood,regionId,cityId];

            $.each(elements_to_hide, function (key,e) {
                e.parents('div.field').hide();
                e.attr('readonly','readonly');
            });

        },

        /**
         *
         * @private
         */
        _initZip: function () {
            this.element.on('keyup', $.proxy(function (e) {
                var val = $(e.target).val();
                if(val.length == 5){
                    this._getJson(val);
                }
            }, this));
        },

        /**
         *
         * @private
         */
        _initSelect: function () {

            if(this.options.currentNeighborhood){
                this._getJson(this.element.val());
            }

            $(this.options.neighborhoodId).on('change', $.proxy(function (e) {
                if ($(this.options.neighborhoodId + ' option:selected').val() == 0 ) {
                    $(this.options.neighborhood).parents('div.field').show();
                    $(this.options.neighborhood).val(currentNeighborhoodString).removeAttr('readonly').focus();
                } else {
                    $(this.options.neighborhood).parents('div.field').hide();
                    $(this.options.neighborhood).val($(this.options.neighborhoodId + ' option:selected').text()).attr('readonly','readonly');
                }
            }, this));
        },

        /**
         * Remove options from dropdown list
         *
         * @param {Object} selectElement - jQuery object for dropdown list
         * @private
         */
        _removeSelectOptions: function (selectElement) {
            selectElement.find('option').each(function () {
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
        _renderSelectOption: function (selectElement, key, value) {
            selectElement.append($.proxy(function () {
                var tmplData,
                    tmpl;


                tmplData = {
                    value: value.clave_colonia,
                    title: value.colonia,
                    isSelected: false
                };

                if (parseInt(this.options.currentNeighborhood) === parseInt(value.clave_colonia)) {
                    tmplData.isSelected = true;
                }

                tmpl = this.regionTmpl({
                    data: tmplData
                });

                return $(tmpl);
            }, this));
        },

        /**
         * Takes clearError callback function as first option
         * If no form is passed as option, look up the closest form and call clearError method.
         * @private
         */
        _clearError: function () {

                this.element.removeClass('mage-error').parent().find('#zipcode-notfound').hide();

        },

        _getJson: function (postcode){
            var widget = this;
            var url = this.options.baseUrl+"addressmx/ajax/data";
            var filter_array = {field: "postcode", value: postcode};
                $.ajax({
                    method: "POST",
                    url: url,
                    data: {filter: filter_array},
                    showLoader: true
                })
                    .done( $.proxy(function(data) {
                        if(data.length < 1){
                            this.element.addClass('mage-error').parent().find('#zipcode-notfound').show();
                        } else {
                            this._updateFields(data);
                            this._clearError();
                        }
                    },widget));
        },

        /**
         * Update dropdown list based on the postcode json
         nt
         * @param {Json} data
         * @private
         */
        _updateFields: function (data) {

            var neighborhoodId = $(this.options.neighborhoodId),
                neighborhood = $(this.options.neighborhood),
                region = $(this.options.region),
                regionId = $(this.options.regionId),
                city = $(this.options.city),
                cityId = $(this.options.cityId);

            this._removeSelectOptions(neighborhoodId);

            $.each(data, $.proxy(function (key, value) {
                this._renderSelectOption(neighborhoodId, key, value);
                region.val(value.estado);
                regionId.val(value.clave_estado);
                neighborhood.val(value.colonia);
                city.val(value.municipio);
                cityId.val(value.clave_municipio);
            }, this));
            
            var other = {
                colonia: 'Otra',
                clave_colonia: 0
            }
            this._renderSelectOption(neighborhoodId, -1, other);

            neighborhoodId.change().removeAttr('disabled');

        }
    });

    return $.pengo.addressmxUpdater;
});
