sap.ui.define([
   "sap/ui/core/mvc/Controller",
   "sap/m/MessageToast",
   "sap/ui/model/json/JSONModel"
], function (Controller, MessageToast, JSONModel) {
   "use strict";
   return Controller.extend("Ui5.controller.App", {
      onInit : function() {
        var oData = {
          recipient : {
            name: "World"
          }
        };
      },
      onShowHello : function () {
         MessageToast.show("Hello World");
      }
   });
});
