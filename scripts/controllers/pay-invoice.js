'use strict';

/**
 * @ngdoc function
 * @name yololiumApp.controller:PayInvoiceCtrl
 * @description
 * # PayInvoiceCtrl
 * Controller of the yololiumApp
 */
angular.module('yololiumApp')
  .controller('PayInvoiceCtrl', function ($scope, $modalInstance, StStripe, StAlert) {
    console.log('Pay Invoice');

    var P = this
      ;

    P.title = "Pay Part or All of your Invoice";

    B.purchase = {};

    function initTimepicker() {
      B.purchase.fromTime = new Date();
      B.purchase.fromTime.setHours(19);
      B.purchase.fromTime.setMinutes(0);
      B.purchase.fromTime.setSeconds(0);
      B.purchase.fromTime.setMilliseconds(0);
      console.log(B.purchase.fromTime);
      B.purchase.toTime = new Date();
      B.purchase.toTime.setHours(22);
      B.purchase.toTime.setMinutes(30);
      B.purchase.toTime.setSeconds(0);
      B.purchase.toTime.setMilliseconds(0);
      console.log(B.purchase.toTime);

      B.hstep = 1;
      B.mstep = 30;

      B.ismeridian = true;

      B.updateAmount = function () {
        if (B.purchase.fromTime.valueOf() > B.purchase.toTime.valueOf()) {
          // might not work during daylight savings switch on June 21st... but who hires me until 2am?
          B.purchase.toTime = new Date(B.purchase.toTime.valueOf() + (24 * 60 * 60 * 1000));
        }
        B.purchase.hours = (B.purchase.toTime.valueOf() - B.purchase.fromTime.valueOf()) / (60 * 60 * 1000);

        console.log('UPDATE AMOUNT');
        console.log(B.purchase);
        B.purchase.amount = (5000 * B.purchase.hours);
        if (B.purchase.amount < 15000) {
          B.purchase.amount = 15000;
        }
        B.purchase.displayAmount = (B.purchase.amount / 100);
        console.log(B.purchase);
      };
      B.updateAmount();
    }
    initTimepicker();

    B.updateDisplayAmount = function () {
      console.log('update display');
      console.log(B.purchase.amount);
      console.log(B.purchase.displayAmount);
      B.purchase.amount = Math.round(parseInt((String(B.purchase.displayAmount || "")).replace(/$/, '') * 100));
      console.log(B.purchase.amount);
      console.log('update display');
    };
    B.confirm = function () {
      $modalInstance.close();

      var product
        ;

      product = {
        title: "Event Deposit"
      , id: "deposit"
      , short: P.purchase.hours + " hours service"
      , desc: "Transferable, but non-refundable deposit"
      , amount: P.purchase.amount
      //, imgsrc: getImgUrl("http://www.reenigne.org/photos/2004/4/doodads.jpg")
      };

      // TODO pre-confirmed option
      StStripe.purchase(product).then(
        function (thing) {
          console.log('happy', thing);
          StAlert.alert({
            title: "$" + (product.amount / 100) + " Payment made"
          , message: product.title + " has been paid. You should receive an email confirmation from Stripe within 5 to 10 minutes."
          });
        }
      , function (thing) {
          console.log('sad', thing);

          // escape key press
          // escape button click
          if (/escape/i.test(thing.toString()) || (thing && (thing.ignore || thing.cancelled))) {
            return;
          }

          StAlert.alert({
            title: "Payment failed"
          , message: "Something went wrong while processing the payment. However, if you receive an email confirmation, the card was successfully charged and we'll have to manually update your payment history. Otherwise your card was not yet charged."
            + product.title + " at an unbelievable price)"
          });
        }
      );
    };
    P.cancel = function () {
      $modalInstance.dismiss({ ignore: true });
    };

  });
