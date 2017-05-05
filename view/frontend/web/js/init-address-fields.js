/*jshint browser:true expr:true*/
define(['uiComponent','jquery','Magento_Checkout/js/model/full-screen-loader',], function(Component,$,Loader) {

    return Component.extend({

        defaults: {
            skipValidation: false,
            imports: {
                update: '${ $.parentName }.shipping-address-fieldset:visible'
            }
        },
        /**
         * @todo trigger action using knockout components
         */
        initialize: function () {
            this._super();
            checkContainer();

            function checkContainer () {
                if($("div[name='shippingAddress.custom_attributes.neighborhood_id']").find("select").length){
                    /**
                     *Hide variables required to process the shipment and add the read-only attribute as they will be filled automatically.
                     */
                   initAddressFields();
                    $(".action-add-new-address").on("click",function(){
                        initAddressFields();
                        $(".action.action-hide-popup.osc-edit-button").on("click",function(){
                            if($('.shipping-address-items .shipping-address-item').length > 0 && $('.shipping-address-items .shipping-address-item.selected-item').length == 0){
                                $('.shipping-address-items .shipping-address-item .address-detail')[0].click();
                            }
                        });
                    });

                } else {
                    setTimeout(checkContainer, 500);
                }

                function initAddressFields(){
                    var neighborhoodId = $("div[name='shippingAddress.custom_attributes.neighborhood_id']").find("select"),
                        neighborhood = $("div[name='shippingAddress.custom_attributes.neighborhood']").find("input"),
                        region = $("div[name='shippingAddress.region']").find("input"),
                        regionId = $("div[name='shippingAddress.region_id']").find("input"),
                        city = $("div[name='shippingAddress.city']").find("input"),
                        cityId = $("div[name='shippingAddress.custom_attributes.city_id']").find("input"),
                        countryId = $("div[name='shippingAddress.country_id']").find("select"),
                        postcode = $("div[name='shippingAddress.postcode']").find("input"),
                        streetExtraLine = $("div[name='shippingAddress.street.1");

                    neighborhoodId.attr('disabled','disabled');

                    region.attr('readonly','readonly');
                    city.attr('readonly','readonly');

                    regionId.closest('div.field').hide();
                    cityId.closest('div.field').hide();
                    neighborhood.closest('div.field').hide();
                    streetExtraLine.hide();

                    neighborhoodId.closest('div.control').addClass('divSelect');
                    countryId.closest('div.control').addClass('divSelect');

                    $(neighborhoodId).on('change', function () {
                        if (neighborhoodId.val() == 0) {
                            neighborhood.closest('div.field').show();
                            neighborhood.val("").focus();
                        } else {
                            neighborhood.closest('div.field').hide();
                            neighborhood.val($("div[name='shippingAddress.custom_attributes.neighborhood_id']").find("select[name*='neighborhood_id'] option:selected").text()).keyup();
                        }
                    });
                    
                    postcode.on('keyup', function (e) {
                      var val = $(e.target).val();
                      if(val.length == 5){
                          Loader().all(true);
                      }
                    });
                }
            }
        }
    });
});