;(function(window, document, undefined) {
	var $, scroller, cb_addEventListener, addClass, removeClass, hasClass, ReturnToScrollTop, ToggleClassOnClick, NaviControle;

	$ = function(selector, root) {
		if (selector instanceof Object) return selector;
		root = root || document;
		return root.querySelector(selector);
	};

	scroller = document.documentElement.scrollTop ? document.documentElement : document.body;

	cb_addEventListener = function(obj, evt, fnc) {
		if (obj.addEventListener) {
			obj.addEventListener(evt, fnc, false);
			return true;
		} else if (obj.attachEvent) {
			return obj.attachEvent('on' + evt, fnc);
		} else {
			evt = 'on'+evt;
			if(typeof obj[evt] === 'function') {
				fnc = (function(f1,f2){
					return function() {
						f1.apply(this,arguments);
						f2.apply(this,arguments);
					};
				})(obj[evt], fnc);
			}
			obj[evt] = fnc;
			return true;
		}
	};

	addClass = function(elem, className) {
		var i, iz, hash, ary, classes;
		classes = elem.className.split(' ');
		classes.push(className);
		hash = {};
		for(i = 0, iz = classes.length; i < iz; i++) {
			if (classes[i]) {
				hash[classes[i]] = true;
			}
		}
		ary = [];
		for(i in hash) {
			ary.push( i );
		}
		elem.className = ary.join(' ');
	};

	removeClass = function(elem, className, index) {
		var classes = elem.className.split(' ');
		if (index === undefined) {
			for(var i = 0, iz = classes.length; i < iz; i++) {
				if ( classes[i] == className ) {
					index = i;
					break;
				}
			}
		}
		classes.splice(index, 1);
		elem.className = classes.join(' ');
	};

	hasClass = function(elem, className) {
		var classes = elem.className.split(' ');
		for(var i = 0, iz = classes.length; i < iz; i++) {
			if ( classes[i] == className ) {
				return i;
			}
		}
		return -1;
	};


	ReturnToScrollTop = (function() {
		var my = function() {
			this.constructor.apply(this, arguments);
		};

		my.fps = 60;

		my.easing = function(t,b,c,d) {
			return -c*((t=t/d-1)*t*t*t-1)+b;
		};

		my.prototype = {
			constructor: function(selector, speed) {
				this._element = $(selector);
				this._speed = speed || 300;
				this._isAnimated = false;
				this._on();
			},

			_on: function() {
				var self = this;
				cb_addEventListener(this._element, 'click', function(event) {
					self._scroll();
					event.preventDefault();
				});
			},

			_scroll: function() {
				var self, start, b, c, d, wait;
				if (this._isAnimated) return;
				self = this;
				this._isAnimated = true;
				start = ((new Date()) * 1);
				b = 0;
				c = scroller.scrollTop;
				d = this._speed / 10;
				wait = 1000 / my.fps;

				(function() {
					var t, diff;
					t = (((new Date()) * 1) - start) / 1000;
					diff = scroller.scrollTop - Math.round( my.easing(t, b, c, d) );
					scroller.scrollTop = diff <= 0 ? 0 : diff;
					if (scroller.scrollTop === 0) {
						self._isAnimated = false;
						return;
					}
					setTimeout(arguments.callee, wait);
				})();
			}
		};

		return my;
	})();

	ToggleClassOnClick = (function() {
		var my = function() {
			this.constructor.apply(this, arguments);
		};

		my.prototype = {
			constructor: function(selector, target, className) {
				this._element = $(selector);
				this._target = $(target);
				this._className = className;
				this._on();
			},

			_on: function() {
				var self = this;
				cb_addEventListener(this._element, 'click', function(event) {
					self._toggleClass();
					event.preventDefault();
				});
			},

			_toggleClass: function() {
				var index = hasClass(this._target, this._className);
				if (index != -1) {
					removeClass(this._target, this._className, index);
				} else {
					addClass(this._target, this._className);
				}
			}
		};

		return my;
	})();

	NaviControle = (function() {
		var my = function() {
			this.constructor.apply(this, arguments);
		};

		my.body = document.body;

		my.getStyleContext = function(className, height) {
			return 'body.' + className + '{margin-top:' + height +'px}';
		};

		my.getMeasure = function(value) {
			value = value || 0;
			return parseInt( String.prototype.replace.call(value, 'px', '') , 10);
		};

		my.getOffsetTop = function(elem) {
			var box, doc, body, docElem, clientTop;
			box = elem.getBoundingClientRect();
			doc = elem.ownerDocument;
			body = doc.body;
			docElem = doc.documentElement;
			clientTop = docElem.clientTop || body.clientTop || 0;
			return box.top  + (window.pageYOffset || docElem.scrollTop  || body.scrollTop ) - clientTop;
		};

		my.getOuterHeight = function(elem) {
			var style, offsetHeight, margin;
			style = elem.style;
			margin = {
				top: my.getMeasure(style.marginTop),
				bottom: my.getMeasure(style.marginBottom)
			};
			offsetHeight = my.getMeasure(elem.offsetHeight);
			return offsetHeight + margin.top + margin.bottom;
		};

		my.prototype = {
			constructor: function(selector, className) {
				this._element = $(selector);
				this._className = className;
				this._isFixed = false;
				this._setClassStyle();
				this._on();
			},

			_on: function() {
				var self = this;
				cb_addEventListener(window, 'scroll', Cowboy.throttle(150, function() {
					self._toggleClass();
				}));
			},

			_toggleClass: function() {
				var check = scroller.scrollTop > this._elementBottom;
				if ( !this._isFiexd && check ) {
					addClass(my.body, this._className);
					this._isFixed = true;
				} else if ( this._isFixed && !check ) {
					removeClass(my.body, this._className);
					this._isFixed = false;
				}
			},

			_setClassStyle: function() {
				var style, textnode, context;
				this._elementOuterHeight = my.getOuterHeight(this._element);
				this._elementBottom = this._elementOuterHeight + my.getOffsetTop(this._element);
				context = my.getStyleContext(this._className, this._elementOuterHeight);
				textnode = document.createTextNode(context);
				style = document.createElement('style');
				style.appendChild(textnode);
				document.body.appendChild(style);
			}
		};

		return my;
	})();

	new ReturnToScrollTop( '.site-return' );
	new ToggleClassOnClick( '.site-toggle-menu', document.body, 'open-site-menu' );
	new NaviControle( '#site-header', 'nav-fixed' );

})(window, document);