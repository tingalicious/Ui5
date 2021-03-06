// This file has been generated by the SAPUI5 'AllInOne' Builder
jQuery.sap.declare('sap.ui.suite.library-all');
if ( !jQuery.sap.isDeclared('sap.ui.suite.QuickViewUtils') ) {
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

 // Provides
jQuery.sap.declare('sap.ui.suite.QuickViewUtils'); // unresolved dependency added by SAPUI5 'AllInOne' Builder
jQuery.sap.require('jquery.sap.global'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.Control'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.Element'); // unlisted dependency retained
sap.ui.define("sap/ui/suite/QuickViewUtils",['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/Element'],
	function(jQuery, Control, Element) {
	"use strict";

	/**
	 * Create a Quickview Instance. This Method is only working with the UI2 QuickView service.
	 *
	 * @param {string} sServiceUrl
	 * @param {string} sConfigName
	 * @param {string} sThingKey
	 * @returns {sap.ui.ux3.QuickView}
	 */

	var QuickViewUtils = {
		/* create a QV instance with content */
		createQuickView: function(sServiceUrl,sConfigName,sThingKey,mFormatter) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);

			var oQV = new sap.ui.ux3.QuickView({firstTitle: "{title}", firstTitleHref: "{titleLinkURL}", type:"{Thing/text}", icon:"{imageURL}"});
			oQV.setModel(oModel);
			oQV.bindObject("/QuickviewConfigs(name='" + sConfigName + "',thingKey='" + sThingKey + "')",{expand:"Thing,QVAttributes/Attribute,QVActions/Action"});

			var oMQVC = new QvContent();
			oMQVC.bindAggregation("items",{path:"QVAttributes",factory: function(sId, oContext) {
				var oQVItem = new QvItem(sId, {label:"{Attribute/label}",link: "{valueLinkURL}",order:"{order}"});
				oQVItem.bindProperty("value","value",mFormatter && mFormatter[oContext.getProperty("Attribute/name")]);
				return oQVItem;
			}});
			oQV.addContent(oMQVC);
			return oQV;
		},
		/* add content to an existing QV */
		createQuickViewData: function(oQV,sServiceUrl,sConfigName,sThingKey,mFormatter) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			oQV.removeAllContent();
			oQV.setModel(oModel);
			oQV.bindProperty("firstTitle", "title");
			oQV.bindProperty("firstTitleHref", "titleLinkURL");
			oQV.bindProperty("type", "Thing/text");
			oQV.bindProperty("icon", "imageURL");
			oQV.bindObject("/QuickviewConfigs(name='" + sConfigName + "',thingKey='" + sThingKey + "')",{expand:"Thing,QVAttributes/Attribute,QVActions/Action"});

			var oMQVC = new QvContent();
			oMQVC.bindAggregation("items",{path:"QVAttributes",factory: function(sId, oContext) {
				var oQVItem = new QvItem(sId, {label:"{Attribute/label}",link: "{valueLinkURL}",order:"{order}"});
				oQVItem.bindProperty("value","value",mFormatter && mFormatter[oContext.getProperty("Attribute/name")]);
				return oQVItem;
			}});
			oQV.addContent(oMQVC);
		},
		/* create a QV instance with dataset content */
		createDataSetQuickView: function(sServiceUrl, sCollection, sType, mProperties, iSizeLimit) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			if (iSizeLimit) {
				oModel.setSizeLimit(iSizeLimit);
			}
			var oQV = new sap.ui.ux3.QuickView({type:sType, showActionBar:false});
			oQV.setModel(oModel);
			oQV.addContent(this._createDSContent(oQV,sCollection,mProperties));
			return oQV;
		},
		/* add dataset content to an existing QV */
		createDataSetQuickViewData: function(oQV,sServiceUrl, sCollection, sType, mProperties, iSizeLimit) {
			var oModel = new sap.ui.model.odata.ODataModel(sServiceUrl,false);
			if (iSizeLimit) {
				oModel.setSizeLimit(iSizeLimit);
			}
			oQV.removeAllContent();
			oQV.setType(sType);
			oQV.setShowActionBar(false);
			oQV.setModel(oModel);
			oQV.addContent(this._createDSContent(oQV,sCollection,mProperties));
		},

		_createDSContent: function(oQV,sCollection,mProperties) {
			var oContent = new sap.ui.commons.layout.MatrixLayout();
			var oRow = new sap.ui.commons.layout.MatrixLayoutRow();
			jQuery.each(mProperties, function(i,oProperty){
				var oControl;
				if (oProperty.href) {
					oControl = new sap.ui.commons.Link({text : oProperty.value, href: oProperty.href});
				} else {
					oControl = new sap.ui.commons.TextView({text : oProperty.value});
				}
				var oCell = new sap.ui.commons.layout.MatrixLayoutCell({content:[oControl]});
				oCell.addStyleClass("quickViewDS");
				oRow.addCell(oCell);
			});
			oContent.bindAggregation("rows",sCollection,oRow);
			return oContent;
		}
	};

	var QvItem = Element.extend("sap.ui.suite.hcm.QvItem", {
		metadata : {
			properties: {
				label: "string",
				value: "string",
				link: "string",
				order: "string",
				type : "string"
			}
		}
	});

	var QvContent = Control.extend("sap.ui.suite.hcm.QvContent", {
		metadata : {
			aggregations: {
				   "items" : {type : "sap.ui.suite.hcm.QvItem", multiple : true}
			}
		},
		init: function() {
			this._sorted = false;
		},
		exit: function() {
			if (this._oML) {
				this._oML.destroy();
			}
		},
		renderer : function(oRm, oControl) {      // the part creating the HTML
			oRm.write("<div");
			oRm.writeControlData(oControl);
			oRm.write(">");
			oRm.renderControl(oControl._createQVContent(oControl));
			oRm.write("</div>");
		},
		_createQVContent: function(oControl) {
			var oML = new sap.ui.commons.layout.MatrixLayout({widths:["75px"]}),
				aItems = oControl.getItems(),
				oMLRow, oMLCell, oLabel, oTxtView, oLink;

			if (this._oML) {
				this._oML.destroy();
			}
			oControl._sortItems(oControl);
			for ( var i = 0; i < aItems.length; i++) {
				oMLRow = new sap.ui.commons.layout.MatrixLayoutRow();
				oMLCell = new sap.ui.commons.layout.MatrixLayoutCell({vAlign:'Top'});
				oLabel  = new sap.ui.commons.Label({text:aItems[i].getLabel() + ':'});
				oMLCell.addContent(oLabel);
				oMLRow.addCell(oMLCell);
				oMLCell = new sap.ui.commons.layout.MatrixLayoutCell();
				if (aItems[i].getLink()) {
					oLink = new sap.ui.commons.Link({text:aItems[i].getValue(), href:aItems[i].getLink()});
					oMLCell.addContent(oLink);
				} else {
					oTxtView = new sap.ui.commons.TextView({text:aItems[i].getValue()});
					oMLCell.addContent(oTxtView);
				}
				oMLRow.addCell(oMLCell);
				oML.addRow(oMLRow);
			}
			this._oML = oML;
			return oML;
		},
		_sortItems: function(oControl) {
				if (!oControl._sorted) {
					var aItems = oControl.removeAllAggregation("items", true);
					aItems.sort(function(a, b) {
						return (parseInt(a.getOrder(), 10) - parseInt(b.getOrder(), 10));
					});
					jQuery.each(aItems, function(i,oItem) {oControl.addAggregation("items",oItem,false);});
					oControl._sorted = true;
				}
		}
	});

	return QuickViewUtils;

}, /* bExport= */ true);

}; // end of sap/ui/suite/QuickViewUtils.js
if ( !jQuery.sap.isDeclared('sap.ui.suite.VerticalProgressIndicatorRenderer') ) {
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// provides default renderer for sap.ui.suite.VerticalProgressIndicator
jQuery.sap.declare('sap.ui.suite.VerticalProgressIndicatorRenderer'); // unresolved dependency added by SAPUI5 'AllInOne' Builder
sap.ui.define("sap/ui/suite/VerticalProgressIndicatorRenderer",function() {
	"use strict";


	/**
	 * VerticalProgressIndicator renderer.
	 * @namespace
	 */
	var VerticalProgressIndicatorRenderer = {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	VerticalProgressIndicatorRenderer.render = function(oRenderManager, oControl){
	    // convenience variable
		var rm = oRenderManager;

		//calculate percentage
	    var VerticalPercent = oControl.getPercentage();
	    if (VerticalPercent < 0 || VerticalPercent == Number.NaN) {
				VerticalPercent = 0;
	    }
	    if (VerticalPercent > 100) {
				VerticalPercent = 100;
	    }
	    var PixelDown = Math.round(VerticalPercent * 58 / 100);
	    var PixelUp   = 58 - PixelDown;
	    var PercentageString = VerticalPercent.toString();

		// write the HTML into the render manager
	    rm.write("<DIV");
	    rm.writeControlData(oControl);
	    rm.writeAttribute('tabIndex', '0');

		if (oControl.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
		} else {
			rm.writeAttributeEscaped("title", PercentageString);
		}

	    //ARIA
	    if ( sap.ui.getCore().getConfiguration().getAccessibility()) {
		  rm.writeAttribute('role', 'progressbar');
	      rm.writeAccessibilityState(oControl, {valuemin: '0%'});
		  rm.writeAccessibilityState(oControl, {valuemax: '100%'});
		  rm.writeAccessibilityState(oControl, {valuenow: VerticalPercent + '%'});
		}

	    rm.writeAttribute("class","sapUiVerticalProgressOuterContainer");
	    rm.write(">"); // Outer DIV element
	    rm.write("<DIV");
	    rm.writeAttribute('id', oControl.getId() + '-bar');
	    rm.writeAttribute("class","sapUiVerticalProgressInnerContainer");
	    rm.addStyle("top", PixelUp + "px");
	    rm.addStyle("height", PixelDown + "px");
	    rm.writeClasses();
	    rm.writeStyles();
	    rm.write(">"); // Inner DIV element
	    rm.write("</DIV>");
	    rm.write("</DIV>");

	};


	return VerticalProgressIndicatorRenderer;

}, /* bExport= */ true);

}; // end of sap/ui/suite/VerticalProgressIndicatorRenderer.js
if ( !jQuery.sap.isDeclared('sap.ui.suite.library') ) {
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

/**
 * Initialization Code and shared classes of library sap.ui.suite.
 */
jQuery.sap.declare('sap.ui.suite.library'); // unresolved dependency added by SAPUI5 'AllInOne' Builder
jQuery.sap.require('jquery.sap.global'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.Core'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.library'); // unlisted dependency retained
sap.ui.define("sap/ui/suite/library",['jquery.sap.global', 'sap/ui/core/Core',
	'sap/ui/core/library'], // library dependency
	function(jQuery, Core) {

	"use strict";


	// delegate further initialization of this library to the Core
	sap.ui.getCore().initLibrary({
		name : "sap.ui.suite",
		version: "1.52.5",
		dependencies : ["sap.ui.core"],
		types: [
			"sap.ui.suite.TaskCircleColor"
		],
		interfaces: [],
		controls: [
			"sap.ui.suite.TaskCircle",
			"sap.ui.suite.VerticalProgressIndicator"
		],
		elements: []
	});

	/* eslint-disable no-undef */
	/**
	 * Suite controls library.
	 *
	 * @namespace
	 * @alias sap.ui.suite
	 * @author SAP SE
	 * @version 1.52.5
	 * @public
	 */
	var thisLibrary = sap.ui.suite;
	/* eslint-enable no-undef */

	/**
	 * Defined color values for the Task Circle Control
	 *
	 * @version 1.52.5
	 * @enum {string}
	 * @public
	 * @ui5-metamodel This enumeration also will be described in the UI5 (legacy) designtime metamodel
	 */
	thisLibrary.TaskCircleColor = {

		/**
		 * Red
		 * @public
		 */
		Red : "Red",

		/**
		 * Yellow
		 * @public
		 */
		Yellow : "Yellow",

		/**
		 * Green
		 * @public
		 */
		Green : "Green",

		/**
		 * Default value
		 * @public
		 */
		Gray : "Gray"

	};

	return thisLibrary;

});

}; // end of sap/ui/suite/library.js
if ( !jQuery.sap.isDeclared('sap.ui.suite.TaskCircle') ) {
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.suite.TaskCircle.
jQuery.sap.declare('sap.ui.suite.TaskCircle'); // unresolved dependency added by SAPUI5 'AllInOne' Builder
jQuery.sap.require('jquery.sap.global'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.Control'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.EnabledPropagator'); // unlisted dependency retained
sap.ui.define("sap/ui/suite/TaskCircle",['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', './library'],
	function(jQuery, Control, EnabledPropagator, library) {
	"use strict";

	// shortcut
	var TaskCircleColor = library.TaskCircleColor;

	/**
	 * Constructor for a new TaskCircle.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control shows a circle which radius and color depends on the given parameters
	 * @extends sap.ui.core.Control
	 *
	 * @author Svetozar Buzdumovic
	 * @version 1.52.5
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.2.
	 * The API may change. User with care.
	 * @alias sap.ui.suite.TaskCircle
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var TaskCircle = Control.extend("sap.ui.suite.TaskCircle", /** @lends sap.ui.suite.TaskCircle.prototype */ { metadata : {

		library : "sap.ui.suite",
		properties : {

			/**
			 * Current value of the task circle to be displayed. In dependency of the parameters maxValue and minValue it controls the size of the circle.
			 */
			value : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * Upper limit of the displayed values. Default is 100.
			 */
			maxValue : {type : "int", group : "Misc", defaultValue : 100},

			/**
			 * Lower limit of the displayed values. Default is 0.
			 */
			minValue : {type : "int", group : "Misc", defaultValue : 0},

			/**
			 * Color of the circle. The default color is red.
			 */
			color : {type : "sap.ui.suite.TaskCircleColor", group : "Misc", defaultValue : TaskCircleColor.Gray}
		},
		associations : {

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"},

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}
		},
		events : {

			/**
			 * Event is fired when the user clicks the control.
			 */
			press : {}
		}
	}});




	EnabledPropagator.call(TaskCircle.prototype);


	/**
	 * init is called when the control is initialized
	 */
	TaskCircle.prototype.init = function(){
	};



	/**
	 * Function is called when control is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	TaskCircle.prototype.onclick = function(oEvent){
	  this.firePress({});
	  oEvent.preventDefault();
	  oEvent.stopPropagation();
	};


	// Implementation of API method focus(). Documentation available in generated code.

	/**
	 * Puts the focus to the control.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	TaskCircle.prototype.focus = function() {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.focus();
		}
	};

	return TaskCircle;

});

}; // end of sap/ui/suite/TaskCircle.js
if ( !jQuery.sap.isDeclared('sap.ui.suite.TaskCircleRenderer') ) {
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// provides default renderer for sap.ui.suite.TaskCircle
jQuery.sap.declare('sap.ui.suite.TaskCircleRenderer'); // unresolved dependency added by SAPUI5 'AllInOne' Builder
jQuery.sap.require('jquery.sap.global'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.Core'); // unlisted dependency retained
sap.ui.define("sap/ui/suite/TaskCircleRenderer",['jquery.sap.global', 'sap/ui/core/Core', './library'],
	function(jQuery, Core, library) {
	"use strict";


	// shortcut
	var TaskCircleColor = library.TaskCircleColor;

	/**
	 * TaskCircle renderer.
	 * @namespace
	 */
	var TaskCircleRenderer = function() {
	};


	/**
	 * Renders the HTML for the given control, using the provided {@link sap.ui.core.RenderManager}.
	 *
	 * @param {sap.ui.core.RenderManager} oRenderManager the RenderManager that can be used for writing to the Render-Output-Buffer
	 * @param {sap.ui.core.Control} oControl an object representation of the control that should be rendered
	 */
	TaskCircleRenderer.render = function(oRenderManager, oControl){
	    // convenience variable
		var rm = oRenderManager;

	    //calculate pixel size
		var minvalue = oControl.getMinValue();
		var maxvalue = oControl.getMaxValue();
		var value = oControl.getValue();
		if (minvalue < 0 || minvalue == Number.NaN) {
			minvalue = 0;
		}
		if (maxvalue < 0 || maxvalue == Number.NaN) {
			maxvalue = 1;
		}
		if (value < 0 || value == Number.NaN) {
			value = 0;
		}
		var valuestring = value.toString();
	    var color = oControl.getColor();
	    var style = 'sapUiTaskCircleColorGray';

	    switch (color) {
	       case TaskCircleColor.Red:
	          style = 'sapUiTaskCircleColorRed';
	          break;
	       case TaskCircleColor.Yellow:
	          style = 'sapUiTaskCircleColorYellow';
	          break;
	       case TaskCircleColor.Green:
	          style = 'sapUiTaskCircleColorGreen';
	          break;
	       case TaskCircleColor.Gray:
	          style = 'sapUiTaskCircleColorGray';
	          break;
	    }
	    if (value < minvalue) {
				minvalue = value;
	    }
	    if (value > maxvalue) {
				maxvalue = value;
	    }

	    var psmall = 24;
	    if (minvalue > 10) {
				psmall = 32;
	    }
	    if (minvalue > 100) {
				psmall = 46;
	    }
	    var plarge = 62;

	    var circlesize = parseInt(Math.sqrt((value - minvalue) / (maxvalue - minvalue) * (plarge * plarge - psmall * psmall) + psmall * psmall), 10);

	    var digits = (value + '').length;
	    var fontsize = circlesize * 0.55;
	    if (digits > 1) {
	       fontsize = circlesize / digits;
	    }

		// write the HTML into the render manager
	    rm.write("<div");
	    rm.writeControlData(oControl);
	    rm.writeAttribute('tabIndex', '0');

		if (oControl.getTooltip_AsString()) {
			rm.writeAttributeEscaped("title", oControl.getTooltip_AsString());
		} else {
			rm.writeAttributeEscaped("title", valuestring);
		}

	    //ARIA
	    if ( sap.ui.getCore().getConfiguration().getAccessibility()) {
		  rm.writeAttribute('role', 'progressbar');
	      rm.writeAccessibilityState(oControl, {valuemin: minvalue});
		  rm.writeAccessibilityState(oControl, {valuemax: maxvalue});
		  rm.writeAccessibilityState(oControl, {valuenow: value});
		}

	    rm.writeAttribute("class","sapUiTaskCircle " + style);

		rm.addStyle("width", circlesize + "px");
		rm.addStyle("height", circlesize + "px");
		rm.addStyle("line-height", circlesize + "px");
		rm.addStyle("font-size", parseInt(fontsize, 10) + "px");
		rm.addStyle("border-radius", circlesize + "px");
		rm.addStyle("-moz-border-radius", circlesize + "px");
	    rm.writeClasses();
		rm.writeStyles();
	    rm.write(">");
	    rm.write(value);
	    rm.write("</div>");
	};


	return TaskCircleRenderer;

}, /* bExport= */ true);

}; // end of sap/ui/suite/TaskCircleRenderer.js
if ( !jQuery.sap.isDeclared('sap.ui.suite.VerticalProgressIndicator') ) {
/*!
 * UI development toolkit for HTML5 (OpenUI5)
 * (c) Copyright 2009-2017 SAP SE or an SAP affiliate company.
 * Licensed under the Apache License, Version 2.0 - see LICENSE.txt.
 */

// Provides control sap.ui.suite.VerticalProgressIndicator.
jQuery.sap.declare('sap.ui.suite.VerticalProgressIndicator'); // unresolved dependency added by SAPUI5 'AllInOne' Builder
jQuery.sap.require('jquery.sap.global'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.Control'); // unlisted dependency retained
jQuery.sap.require('sap.ui.core.EnabledPropagator'); // unlisted dependency retained
sap.ui.define("sap/ui/suite/VerticalProgressIndicator",['jquery.sap.global', 'sap/ui/core/Control', 'sap/ui/core/EnabledPropagator', './library'],
	function(jQuery, Control, EnabledPropagator, library) {
	"use strict";



	/**
	 * Constructor for a new VerticalProgressIndicator.
	 *
	 * @param {string} [sId] id for the new control, generated automatically if no id is given
	 * @param {object} [mSettings] initial settings for the new control
	 *
	 * @class
	 * This control shows a vertical progress bar in dependency of the given percentage. Only values between 0 and 100 are valid.
	 * @extends sap.ui.core.Control
	 *
	 * @author Svetozar Buzdumovic
	 * @version 1.52.5
	 *
	 * @constructor
	 * @public
	 * @experimental Since version 1.2.
	 * The API may change. User with care.
	 * @alias sap.ui.suite.VerticalProgressIndicator
	 * @ui5-metamodel This control/element also will be described in the UI5 (legacy) designtime metamodel
	 */
	var VerticalProgressIndicator = Control.extend("sap.ui.suite.VerticalProgressIndicator", /** @lends sap.ui.suite.VerticalProgressIndicator.prototype */ { metadata : {

		library : "sap.ui.suite",
		properties : {

			/**
			 * The numerical value between 0 and 100 which determines the height of the vertical bar. Values higher than 100 will be displayed as 100%, values lower than zero will be displayed as 0%.
			 */
			percentage : {type : "int", group : "Misc", defaultValue : null}
		},
		associations : {

			/**
			 * Association to controls / ids which label this control (see WAI-ARIA attribute aria-labelledby).
			 */
			ariaLabelledBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaLabelledBy"},

			/**
			 * Association to controls / ids which describe this control (see WAI-ARIA attribute aria-describedby).
			 */
			ariaDescribedBy : {type : "sap.ui.core.Control", multiple : true, singularName : "ariaDescribedBy"}
		},
		events : {

			/**
			 * Event is fired when the user clicks the control.
			 */
			press : {}
		}
	}});




	EnabledPropagator.call(VerticalProgressIndicator.prototype);

	/**
	 * Property setter for the Percentage, which determines the height of the vertical bar.
	 * Values higher than 100 will be displayed as 100%, values lower than zero will be displayed as 0%.
	 * A new rendering is not necessary, only the bar will be moved
	 *
	 * @param {int} iPercentage
	 * @return {sap.ui.suite.VerticalProgressIndicator} <code>this</code> to allow method chaining
	 * @public
	 */
	VerticalProgressIndicator.prototype.setPercentage = function(iPercentage) {

	  // exit if nothing changed
	  var VerticalPercent = this.getPercentage();
	  if (VerticalPercent == iPercentage) {
			return this;
	  }

	  // get the ProgressBar
	  this.oBar  = jQuery.sap.domById(this.getId() + '-bar');

	  // get the new Value and calculate Pixels
	  VerticalPercent = iPercentage;
	  if (VerticalPercent < 0 || VerticalPercent == Number.NaN) {
			VerticalPercent = 0;
	  }
	  if (VerticalPercent > 100) {
			VerticalPercent = 100;
	  }
	  var PixelDown = Math.round(VerticalPercent * 58 / 100);
	  var PixelUp   = 58 - PixelDown;

	  //set the new values
	  this.setProperty('percentage', iPercentage, true); // No re-rendering!
	  jQuery(this.oBar).css("top",PixelUp);
	  jQuery(this.oBar).css("height",PixelDown);

	  //set the ARIA property
	  if (!this.oThis) {
		this.oThis = jQuery.sap.byId(this.getId());
		}
	  this.oThis.attr('aria-valuenow', iPercentage + '%');
	  return this;

	};


	/**
	 * Function is called when control is clicked.
	 *
	 * @param {jQuery.Event} oEvent
	 * @private
	 */
	VerticalProgressIndicator.prototype.onclick = function(oEvent) {
		this.firePress({/* no parameters */});
		oEvent.preventDefault();
		oEvent.stopPropagation();
	};


	// Implementation of API method focus(). Documentation available in generated code.

	/**
	 * Puts the focus to the control.
	 *
	 * @type void
	 * @public
	 * @ui5-metamodel This method also will be described in the UI5 (legacy) designtime metamodel
	 */
	VerticalProgressIndicator.prototype.focus = function() {
		var oDomRef = this.getDomRef();
		if (oDomRef) {
			oDomRef.focus();
		}
	};

	return VerticalProgressIndicator;

});

}; // end of sap/ui/suite/VerticalProgressIndicator.js
