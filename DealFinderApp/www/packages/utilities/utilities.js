isKeyCodeAlphanumeric = function (keyCode) {
	return /[a-zA-Z0-9-_ ]/.test(String.fromCharCode(event.keyCode));
};

MouseEvent = function (evt) {
	if (evt) {
		this.e = evt;
	} else {
		this.e = window.event;
	};

	if (evt.pageX) {
		this.x = evt.pageX
	} else {
		this.x = evt.clientX;
	};

	if (evt.pageY) {
		this.y = evt.pageY
	} else {
		this.y = evt.clientY;
	};

	if (evt.target) {
		this.target = evt.target;
	} else {
		this.target = evt.srcElement
	};
};

parseBindingAttribute = function (bindingAttribute) {
	var bindingProperties = bindingAttribute;
	bindingProperties = bindingProperties.substr((bindingProperties.indexOf("{") + 1), (bindingProperties.lastIndexOf("}") - 1)).toString();
	bindingProperties = bindingProperties.split(",");

	var attributes = Array();
	var attributes = {};
	Array.prototype.forEach.call(bindingProperties, function (propertyPair, index) {
		propertyPair = propertyPair.split("=");
		attributes[propertyPair[0].trim()] = propertyPair[1].trim();
	});
	return attributes;
};

parseNotation = function (notation) {
	return notation.substr(notation.lastIndexOf('.') + 1);
};

parseEnum = function (enumStr) {
	var enumStr = enumStr.substr((enumStr.indexOf("(") + 1), (enumStr.lastIndexOf(")") - 1));
	var enumElements = enumStr.split("|");
	var enumValues = {};
	Array.prototype.forEach.call(enumElements, function (elem, indx) {
		enumValues[indx] = elem;
	});
	return enumValues;
};

parseUrl = function (query) {
	var match,
		pl = /\+/g, // Regex for replacing addition symbol with a space
		search = /([^&=]+)=?([^&]*)/g,
		decode = function (s) {
			return decodeURIComponent(s.replace(pl, " "));
		},

		urlParams = {};
	while (match = search.exec(query)) {
		// urlParams[decode(match[1])] = decode(match[2]);
		urlParams[match[1]] = match[2];
	};
	return urlParams;
};

var ORM = {
	// maps server side data to controls bindingsource
	// ...
	toDataObject: function (dataObject, sourceNotation) {
		sourceNotation = (typeof sourceNotation === "string") ? sourceNotation.split(".") : sourceNotation;
		var arrIndex = sourceNotation.shift();

		try {
			// Perform a recursive test for nested object
			//
			if ((null != dataObject) && (arrIndex in dataObject) && ((typeof dataObject[arrIndex] == "object") && !(dataObject[arrIndex] instanceof Array))) {
				return ORM.toDataObject(dataObject[arrIndex], sourceNotation);
			} else {
				if ((null != dataObject) && (arrIndex in dataObject)) {
					var response = dataObject[arrIndex];

					// var searchWord = "<div></div>";
					// var search = new RegExp(searchWord, "g");
					// var textResponse = dataObject[arrIndex].replace(search, "");
					// console.log(textResponse);
					
					return response;
				} else {
					return ORM.toDataObject(dataObject, sourceNotation);
				}
			}
		} catch (e) {
			// ...
		}

	},

	// Maps controls bindingsource data to server side data
	// ...
	toBindingSource: function (sourceNotation, value) {
		dataObject = {};
		ORM.createBindingSourceObject(dataObject, sourceNotation, value);
		return dataObject;
	},

	//
	// ...
	createBindingSourceObject: function (dataObject, newKey, value) {
		var keys = Object.keys(dataObject);
		if (keys.length > 0) {
			keys.map(function (key, indx) {
				if ((typeof dataObject[keys[indx]] == "object") && !(dataObject[keys[indx]] instanceof Array)) {
					ORM.createBindingSourceObject(dataObject[keys[indx]], newKey, value);
				} else {
					dataObject[keys[indx]] = new Object();
					dataObject[keys[indx]][newKey] = value;
				}
			});
		} else {
			dataObject[newKey] = value;
		}
	},

	//
	// ...
	createArrayBindingSourceObject: function (dataObject, notationItem, newKey, value) {
		var keys = Object.keys(dataObject);
		if (keys.length > 0) {
			keys.map(function (key, indx) {
				if ((typeof dataObject[keys[indx]] == "object") && !(dataObject[keys[indx]] instanceof Array)) {
					ORM.createArrayBindingSourceObject(dataObject[keys[indx]], notationItem, newKey, value);
				} else {
					dataObject[keys[indx]] = new Object();
					var values = value;
					var collection = Array();
					Array.prototype.forEach.call(values, function (value, index) {
						var newObject = {};
						newObject[newKey] = value;
						collection.push(newObject);
					});
					dataObject[keys[indx]][notationItem] = collection;
				}
			});
		} else {
			dataObject[notationItem] = new Object();
			var values = value;
			var collection = Array();
			Array.prototype.forEach.call(values, function (value, index) {
				var newObject = {};
				newObject[newKey] = value;
				collection.push(newObject);
			});
			dataObject[notationItem] = collection;
		}
	}
};


ClipBoard = function () {
	// ...
};

var STRIP_COMMENTS = /((\/\/.*$)|(\/\*[\s\S]*?\*\/))/mg;
var ARGUMENT_NAMES = /([^\s,]+)/g;
getFunctionParameterNames = function (func) {
	var fnStr = func.toString().replace(STRIP_COMMENTS, '');
	var result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(ARGUMENT_NAMES);
	if (result === null)
		result = [];
	return result;
};

microtime = function (getAsFloat) {
	var s, now, multiplier;

	if (typeof performance !== 'undefined' && performance.now) {
		now = (performance.now() + performance.timing.navigationStart) / 1000;
		multiplier = 1e6; // 1,000,000 for microseconds
	} else {
		now = (Date.now ? Date.now() : new Date().getTime()) / 1000;
		multiplier = 1e3; // 1,000
	}

	// Getting microtime as a float is easy
	if (getAsFloat) {
		return now;
	}

	// Dirty trick to only get the integer part
	s = now | 0;

	return (Math.round((now - s) * multiplier) / multiplier) + ' ' + s;
};

toggleFullScreen = function (element, state) {
	if (state) {
		if (element.requestFullscreen) {
			element.requestFullscreen();
		} else if (element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if (element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if (element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	} else {
		if (document.exitFullscreen) {
			document.exitFullscreen();
		} else if (document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if (document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}
};


validateEmail = function (email) {
	var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	return re.test(email);
};