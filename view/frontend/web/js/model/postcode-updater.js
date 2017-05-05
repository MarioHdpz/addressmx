/**
 * Copyright © 2016 Magento. All rights reserved.
 * See COPYING.txt for license details.
 */
/*jshint browser:true jquery:true*/
/*global alert*/
define(['mageUtils','Pengo_Addressmx/js/checkout-address-updater','Magestore_OneStepCheckout/js/action/showLoader'], function (utils, checkoutUpdater,showLoader) {
    'use strict';
    return {

        validatedPostCodeExample: [],
        validate: function(postCode, countryId) {
            var patterns = window.checkoutConfig.postCodes[countryId];
            this.validatedPostCodeExample = [];

            if (!utils.isEmpty(postCode) && !utils.isEmpty(patterns)) {
                for (var pattern in patterns) {
                    if (patterns.hasOwnProperty(pattern)) {
                        this.validatedPostCodeExample.push(patterns[pattern]['example']);
                        var regex = new RegExp(patterns[pattern]['pattern']);
                        if (regex.test(postCode)) {
                            return checkoutUpdater.getFields(postCode);
                        }
                    }
                }
                showLoader().address(false);
                return false;
            }
            return true;
        }
    }
});