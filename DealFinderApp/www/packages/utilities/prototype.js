(function (DOMParser) {

	"use strict";
	var DOMParser_proto = DOMParser.prototype,
		real_parseFromString = DOMParser_proto.parseFromString;

	DOMParser_proto.parseFromString = function (markup, type) {
		if (/^\s*text\/html\s*(?:;|$)/i.test(type)) {
			var doc = document.implementation.createHTMLDocument(""),
				doc_elt = doc.documentElement,
				first_elt;

			doc_elt.innerHTML = markup;
			first_elt = doc_elt.firstElementChild;

			if (doc_elt.childElementCount === 1
				&& first_elt.localName.toLowerCase() === "html") {
				doc.replaceChild(first_elt, doc_elt);
			}

			return doc;
		}
		else {
			return real_parseFromString.apply(this, arguments);
		}
	};

	DOMParser_proto.parseFromDOM = function (dom) {
		var context = document.createElement("div");
		context.appendChild(dom);
		return context.innerHTML;
	};

}(DOMParser));
(elementObject = function (e) {
	var e = e.prototype;

	e.getElementsByTagType = function (attr) {
		var nodeList = this.getElementsByTagName("*");
		var nodeArray = [];
		for (var i = 0, elem; elem = nodeList[i]; i++) {
			if (elem.nodeName == "A") {
				nodeArray.push(elem);
			}
		}
		return nodeArray;
	};
	e.getElementsByAttribute = function (attr, value) {
		var nodeList = this.getElementsByTagName("*"),
			nodeArray = [];
		for (var i = 0, elem; elem = nodeList[i]; i++) {
			if (value) {
				if (elem.getAttribute(attr) == value) {
					nodeArray.push(elem);
				}
			}
			else {
				if (elem.hasAttribute(attr)) {
					nodeArray.push(elem);
				}
			}
		}
		return (nodeArray.length > 0) ? nodeArray
			: null;
	};
	e.getElementByAttribute = function (attr, value) {
		var nodeList = this.getElementsByTagName("*"),
			node = null;

		// for (var i = 0, elem; elem = nodeList[i]; i++)
		for (var i = nodeList.length - 1, elem; elem = nodeList[i]; i--) {
			if (value) {
				if (elem.getAttribute(attr) == value) {
					node = elem;
				}
			}
			else {
				if (elem.hasAttribute(attr)) {
					node = elem;
				}
			}
		}
		return node;
	};

	e.getOffsetLeft = function (evt) {
		var parent = this.offsetParent;
		var e = new MouseEvent(evt || event);
		var offsetX = 0;
		do {
			offsetX += parent.offsetLeft;
		} while (parent = parent.offsetParent);
		return offsetX;
	};
	e.getOffsetTop = function (evt) {
		var parent = this.offsetParent;
		var e = new MouseEvent(evt || event);
		var offsetY = 0;
		do {
			offsetY += parent.offsetTop;
		} while (parent = parent.offsetParent);
		return offsetY;
	};
	e.getOffsetIndexByAttribute = function (attr) {
		// console.log(this);
		//
		return this.parentNode;
	};
	e.getText = function () {
		return this.value;
	};
	e.getCssProperty = function (propty) {
		var style = window.getComputedStyle(this);
		return style.getPropertyValue(propty);
	};
	e.getDisabled = function () {
		return this.getAttribute("aria-disabled");
	};
	e.getSelected = function () {
		return this.getAttribute("aria-selected");
	};
	e.getAttributes = function () {
		var attributes = {};
		Array.prototype.forEach.call(this.attributes, function (attributePair, index) {
			attributes[attributePair.name] = attributePair.value;
		});
		return attributes;
	};

	e.removeAttributes = function (attributes) {
		var elem = this;
		Object.keys(attributes).map(function (key) {
			elem.removeAttribute(key);
		});
	};

	e.setAttributes = function (attributes) {
		var elem = this;
		Object.keys(attributes).map(function (key) {
			if ((null != attributes[key]) && (typeof attributes[key] != 'object') && (typeof attributes[key] != 'function'))
				elem.setAttribute(key, attributes[key]);
		});
	};
	e.setText = function (value) {
		this.value = value;
	};
	e.setCssProperty = function (propty, value) {
		this.style[propty] = value;
	};
	e.setCssProperties = function (attributes) {
		var elem = this;
		Object.keys(attributes).map(function (key) {
			if ((null != attributes[key]) && (typeof attributes[key] != 'object'))
				elem.setCssProperty(key, attributes[key]);
		});
	};
	e.setDisabled = function (state) {
		if (state) {
			this.setAttribute("aria-disabled", "true");
		}
		else {
			this.removeAttribute("aria-disabled");
		}
	};
	e.setVisible = function (state) {
		if (state) {
			this.setAttribute("aria-visible", "true");
		}
		else {
			this.setAttribute("aria-visible", "false");
		}
		// console.log(this);
	};
	e.setFocus = function (state) {
		var el = this;
		if (state) {
			setTimeout(function () {
				el.focus();
			}, 100);
		}
		else {
			this.blur();
		}
	};
	e.setSelected = function (state) {
		if (state) {
			this.setAttribute("aria-selected", "true");
		}
		else {
			this.removeAttribute("aria-selected");
		}
	};
	e.setBusy = function (state) {
		if (state) {
			this.setAttribute("busy", "true");
		}
		else {
			this.removeAttribute("busy");
		}
	};
	e.setProgress = function (value) {
		var progress = this.getElementsByClassName("progress").item(0);
		progress.setAttribute("style", "width:" + value + "%;");
	};
	e.setImage = function (url) {
		var elem = this;
		var imgElem = elem.getElementsByTagName("img").item(0);

		var image = new Image();
		image.setAttribute("src", url);
		image.addEventListener("load", function (evt) {
			var imagePnl = elem.getElementsByClassName("image-placeholder").item(0);
			// console.log(imagePnl);
			if(imagePnl) {
				imagePnl.setAttributes({
					"style": "background-image: url('" + this.src + "');",
					"data-url": url,
					"show": "true"
				});
			}
			else {
				elem.setAttributes({
					"style": "background-image: url('" + this.src + "');",
					"data-url": url,
					"show": "true"
				});
			}

			elem.removeAttribute("uploading");
			elem.removeAttribute("loading");
		});
	};


	e.hasClass = function (className) {
		return this.classList.contains(className);
	};
	e.hasParent = function (parent) {
		var state = false;
		if (this.parentNode == parent)
			state = true;
		return state;
	};
	e.clear = function () {
		switch (this.nodeName) {
			case "SELECT":
				while (this.options.length > 0) {
					this.remove(0);
				};
				break;
			case "INPUT":
				this.value = "";
				break;
			default:
				this.innerHTML = "";
				break;
		};
	};
	e.isEmpty = function () {
		switch (this.nodeName) {
			case "SELECT":
				return this.options.length;
			case "INPUT":
				return this.value.trim() == "";
			case "TEXTAREA":
				return this.value === "";
			default:
				return this.innerHTML == "";
		};
	};


	e.isSelected = function () {
		return this.hasAttribute("aria-selected");
	};
	e.isDisabled = function () {
		return this.hasAttribute("aria-disabled");
	};
	e.isChecked = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			return this.hasAttribute("aria-checked");
		}
	};


	// Checkbox
	//
	e.check = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			if (!this.hasAttribute("aria-checked")) {
				this.setAttribute("aria-checked", "true");
			}
		}
	};
	e.unCheck = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			if (this.hasAttribute("aria-checked")) {
				this.removeAttribute("aria-checked");
			}
		}
	};
	e.toggleCheckState = function (evt) {
		if (this.hasAttribute("class") && this.getAttribute("class") == "controls-checkbox") {
			if (this.hasAttribute("aria-checked")) {
				this.removeAttribute("aria-checked");
				return null;
			}
			else {
				this.setAttribute("aria-checked", "true");
				return this.hasAttribute("id") ? this.getAttribute("id") : null;
			}
		}
	};


	// **MARK FOR UPDATE** 
	// Hide Drop Down Callout
	e.hideCallout = function (evt) {
		var doc = document;
		var dom = doc.body;

		var dropdowns = dom.getElementsByAttribute("show-dropdown");
		if (null != dropdowns) {
			Array.prototype.forEach.call(dropdowns, function (dropdown) {
				dropdown.removeAttribute("aria-selected");
				
				if(dropdown.hasAttribute("show-dropdown"))
					dropdown.removeAttribute("show-dropdown");
			});
		}

		var sidecallouts = dom.getElementsByAttribute("role", "sidecallout");
		if (null != sidecallouts) {
			Array.prototype.forEach.call(sidecallouts, function (sidecallout) {
				sidecallout.removeAttribute("show");
			});
		}
	};

	e.trim = function(evt) {
		switch (this.nodeName) {
			case "INPUT":
				return this.value.trim();
			case "TEXTAREA":
				return this.value.trim();
			default:
				return this.innerHTML.trim();
		};
	};
	
	e.text = function () {
		switch (this.nodeName) {
			case "SELECT":
				return this.options[this.selectedIndex].value;
			//break;
			case "INPUT":
				return this.value;
			//break;
			default:
				return this.innerHTML;
			//break;
		};
	};

}(Element));
(function (_String) {
	var String_proto = _String.prototype;
	String_proto.trim = function () {
		return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
	};
	String_proto.empty = function () {
		var str = this.toString().replace(/^\s+|\s+$/g, '');
		if (str == "")
			return true;
	};
	String_proto.explode = function (delmtr) {
		return this.split(delmtr);
	};
	String_proto.concatWord = function (delmtr) {
		var res = "";
		this.split(delmtr).map(function (itm) {
			res += itm;
		}); return res;
	};
	String_proto.toCurrency = function (currency) {
		var result = parseFloat(this).toLocaleString("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 2 });
		return currency + result.substr(1);
	};
	String_proto.format = function (style) {
		var result = parseFloat(this).toLocaleString("en-US");
		return result;
	};
}(String));
(function (_Array) {
	var arr = _Array.prototype;
	arr.clear = function () {
		while (this.length > 0) {
			this.pop();
		}
	};

	arr.getOffsetPositionOf = function () {
		// ...
	};
}(Array));
(function (_Object) {
	var obj = _Object.prototype;

	obj.getElementOffsetIndexByAttribute = function (attr) {
		var selectedItem = null;
		var selectedIndex = 0;

		for (var i = 0, itm; itm = this[i]; i++) {
			if (itm.hasAttribute(attr)) {
				selectedItm = itm;
				selectedIndex = i;
				break;
			};
		}

		return selectedIndex;
	};

	obj.indexer = function (notation) {
		// ...
	};

	obj.merge = function(data) {

		// if (data) {
		// 	var _$this = this;
		// 	Object.keys(this).map(function (key, index) {
		// 		data[key] = _$this[key];
		// 	});
		// }
		// return data;

		if(data) {
			Object.keys(data).map(function(key, index) {
				this[key] = data[key];
			});
		}
		return this;
	};

	obj.clear = function() {
		return {};
	}

}(Object));
(function (_Date) {
	var Date_proto = _Date.prototype;

	Date_proto.getMonthName = function (month) {
		return this.monthNames[month];
	};
	Date_proto.getShortMonthName = function (month) {
		return this.monthNames[month].substr(0, 3);
	};
	Date_proto.monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
}(Date));
