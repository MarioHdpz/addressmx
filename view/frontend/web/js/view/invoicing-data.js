/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*jshint browser:true*/
/*global define*/
define(
    [
        'ko',
        'jquery',
        'Magento_Ui/js/form/form',
        'Magento_Customer/js/model/customer',
        'Magento_Customer/js/model/address-list',
        'Magento_Checkout/js/model/quote',
        'Magento_Checkout/js/action/create-billing-address',
        'Magento_Checkout/js/action/select-billing-address',
        'Magento_Checkout/js/checkout-data',
        'Magento_Checkout/js/model/checkout-data-resolver',
        'Magento_Customer/js/customer-data',
        'Magento_Checkout/js/action/set-billing-address',
        'Magento_Ui/js/model/messageList',
        'mage/translate',
        'Pengo_Addressmx/js/billing-address-updater'
    ],
    function (
        ko,
        $,
        Component,
        customer,
        addressList,
        quote,
        createBillingAddress,
        selectBillingAddress,
        checkoutData,
        checkoutDataResolver,
        customerData,
        setBillingAddressAction,
        globalMessageList,
        $t,
        billingAddressUpdater,
    ) {
        'use strict';

        var lastSelectedBillingAddress = null,
            countryData = customerData.get('directory-data'),
            currentNeighborhoodString = "",
            addressOptions = addressList().filter(function (address) {
                return address.getType() == 'customer-address';
            });

        return Component.extend({
            currentBillingAddress: quote.billingAddress,
            addressOptions: addressOptions,
            customerHasAddresses: addressOptions.length > 1,
            requireInvoice: ko.observable(false),
            isAddressDetailsVisible: ko.observable(false),
            dataScopePrefix: 'billingAddressfree',

            /**
             * Init component
             */
            initialize: function () {
                var self = this;
                this._super();
                this.isAddressDetailsVisible(false);
                /*this.requireInvoice.subscribe(function (isVisible) {
                    if(isVisible){
                        this.prepareFields();
                        State.sameAsShipping(false);
                    } else {
                        State.sameAsShipping(true);
                    }
                }, this);*/

                return this;
            },

            /**
             * @return {exports.initObservable}
             */
            initObservable: function () {
                this._super()
                    .observe({
                        selectedAddress: null,
                        isAddressDetailsVisible: quote.billingAddress() != null,
                        isAddressFormVisible: !customer.isLoggedIn() || addressOptions.length == 1,
                        isAddressSameAsShipping: false,
                        saveInAddressBook: 0
                    });

                return this;
            },

            prepareFields: function(){
                var self = this;
                checkForm();
                function checkForm () {
                    if ($('#invoicing-address-form').length) {
                        self.initFields();
                    } else {
                        setTimeout(checkForm, 100)
                    }
                }
            },
            /**
             * Init billing address fields
             */
            initFields: function (){
                var self = this;
                /**
                 * Hide prefilled fields for a better UX experience
                 */
                var fieldsToHide = ['firstname', 'lastname','country_id','company','street.1','custom_attributes.city_id','region_id','custom_attributes.require_invoice', 'custom_attributes.neighborhood'];
                fieldsToHide.forEach(function (field) {
                    $("div[name='"+self.dataScopePrefix+'.'+field+"']").hide();
                });
                var readOnlyFields = ['city','region'];
                readOnlyFields.forEach(function (field) {
                    $("div[name='"+self.dataScopePrefix+'.'+field+"']").find("input").attr('readonly','readonly');
                });
                $("div[name='"+self.dataScopePrefix+".postcode']").find('input').on('keyup', function (e) {
                    var val = $(e.target).val();
                    if(val.length == 5){
                        billingAddressUpdater.getFields(val,self.dataScopePrefix);
                    }
                });
                $("div[name='"+self.dataScopePrefix+".custom_attributes.neighborhood_id']").find("select").on('change', function () {
                    if ($("div[name='"+self.dataScopePrefix+".custom_attributes.neighborhood_id']").find("select").val() == 0) {
                        $("div[name='"+self.dataScopePrefix+'.'+'custom_attributes.neighborhood'+"']").show();
                        $("div[name='"+self.dataScopePrefix+".custom_attributes.neighborhood']").find('input').val(currentNeighborhoodString).focus();
                    } else {
                        $("div[name='"+self.dataScopePrefix+'.'+'custom_attributes.neighborhood'+"']").hide();
                        $("div[name='"+self.dataScopePrefix+".custom_attributes.neighborhood']").find('input').val($("div[name='"+self.dataScopePrefix+".custom_attributes.neighborhood_id']").find("select[name*='neighborhood_id'] option:selected").text()).keyup();
                    }
                });
                $("div[name='"+self.dataScopePrefix+".custom_attributes.neighborhood_id']").children("div").addClass("divSelect");

                self.populateFields();

            },

            /**
             * Update address action
             */
            updateAddress: function () {

                this.source.set('params.invalid', false);
                this.source.trigger(this.dataScopePrefix + '.data.validate');
                if (this.source.get(this.dataScopePrefix + '.custom_attributes')) {
                    this.source.trigger(this.dataScopePrefix + '.custom_attributes.data.validate');
                };

                if (!this.source.get('params.invalid')) {
                    var addressData = this.source.get(this.dataScopePrefix),
                        newBillingAddress;

                    if (customer.isLoggedIn() && !this.customerHasAddresses) {
                        this.saveInAddressBook(1);
                    }
                    addressData.save_in_address_book = this.saveInAddressBook() ? 1 : 0;
                    newBillingAddress = createBillingAddress(addressData);

                    // New address must be selected as a billing address
                    selectBillingAddress(newBillingAddress);
                    //checkoutData.setSelectedBillingAddress(newBillingAddress.getKey());
                    //checkoutData.setNewCustomerBillingAddress(addressData);

                    if (window.checkoutConfig.reloadOnBillingAddress) {
                        setBillingAddressAction(globalMessageList);
                    }
                    this.isAddressDetailsVisible(true);
                }

            },

            /**
             * Edit address action
             */
            editAddress: function () {
                lastSelectedBillingAddress = quote.billingAddress();
                quote.billingAddress(null);
                this.isAddressDetailsVisible(false);
            },

            /**
             * Cancel address edit action
             */
            cancelAddressEdit: function () {
                this.restoreBillingAddress();
                if (lastSelectedBillingAddress != null) {
                    this.isAddressDetailsVisible(true);
                } else {
                    this.requireInvoice(false);
                }
            },

            /**
             * Restore billing address
             */
            restoreBillingAddress: function () {
                if (lastSelectedBillingAddress != null) {
                    selectBillingAddress(lastSelectedBillingAddress);
                }
            },

            /**
             * @param {int} countryId
             * @return {*}
             */
            getCountryName: function (countryId) {
                return countryData()[countryId] != undefined ? countryData()[countryId].name : '';
            },

            populateFields: function () {
                var shippingAddress = quote.shippingAddress();
                var currentShippingAddress = this.source.get('shippingAddress');
                var addressData = this.source.get(this.dataScopePrefix);
                if(addressList().length == 0){
                    shippingAddress = currentShippingAddress;
                }
                for (var key in shippingAddress) {
                    if (shippingAddress.hasOwnProperty(key)){
                        var address_key = key.replace(/([a-z][A-Z])/g, function (g) { return g[0] + '_' + g[1].toLowerCase() });
                        if(addressData.hasOwnProperty(address_key)){
                            if(typeof shippingAddress[key] == "string"){
                                var fieldName = this.dataScopePrefix + '.' + address_key;
                                if (address_key == 'postcode') {
                                    $("div[name='"+fieldName+"']").find("input").val(shippingAddress[key]);
                                } else {
                                    $("div[name='"+fieldName+"']").find("input").val(shippingAddress[key]).keyup();
                                }
                            } else if(typeof shippingAddress[key] == "object"){
                                for(var secondarykey in shippingAddress[key]){
                                    if(shippingAddress[key].hasOwnProperty(secondarykey)){
                                        var address_secondarykey = secondarykey.replace(/([a-z][A-Z])/g, function (g) { return g[0] + '_' + g[1].toLowerCase() });
                                        fieldName = this.dataScopePrefix + '.' + address_key + '.' + address_secondarykey;
                                        if(typeof shippingAddress[key][secondarykey] == "string"){
                                            $("div[name='"+fieldName+"'] div").find(":first-child").val(shippingAddress[key][secondarykey]).keyup();
                                        }
                                        else if(shippingAddress[key][secondarykey].hasOwnProperty('value')){
                                            $("div[name='"+fieldName+"'] div").find(":first-child").val(shippingAddress[key][secondarykey]['value']).keyup();
                                        }
                                    }
                                }
                            }

                        }
                    }
                }
                $("div[name='"+this.dataScopePrefix + '.' + 'postcode'+ "']").find("input").keyup();
                currentNeighborhoodString = $("div[name='"+this.dataScopePrefix + '.' + 'custom_attributes.neighborhood'+ "']").find("input").val();
                return true;  
            }
        });
    }
);
