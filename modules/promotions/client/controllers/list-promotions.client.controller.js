(function () {
  'use strict';

  angular
    .module('promotions')
    .controller('PromotionsListController', PromotionsListController);

  PromotionsListController.$inject = ['PromotionsService'];

  function PromotionsListController(PromotionsService) {
    var vm = this;

    vm.promotions = PromotionsService.query();
  }
}());
