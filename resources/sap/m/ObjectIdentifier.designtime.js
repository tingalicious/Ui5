/*
 * ! UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */
sap.ui.define(['sap/m/library','jquery.sap.global'],function(M,q){"use strict";var w;return{registerSettingsHandler:function(W){w=W;},getStableElements:function(o){return w?w.getStableElements(o):null;},actions:{settings:function(){if(!w){return;}if(!w.isSettingsAvailable()){q.sap.log.error("sap.ui.comp.navpopover.ObjectIdentifier.designtime: 'settings' action is not available");return;}return{handler:function(o,g){return w.execute(o,g);}};}}};},false);
