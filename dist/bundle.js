(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
/**
 * dat-gui JavaScript Controller Library
 * http://code.google.com/p/dat-gui
 *
 * Copyright 2011 Data Arts Team, Google Creative Lab
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 */

(function (global, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
	typeof define === 'function' && define.amd ? define(['exports'], factory) :
	(factory((global.dat = {})));
}(this, (function (exports) { 'use strict';

function ___$insertStyle(css) {
  if (!css) {
    return;
  }
  if (typeof window === 'undefined') {
    return;
  }

  var style = document.createElement('style');

  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  document.head.appendChild(style);

  return css;
}

function colorToString (color, forceCSSHex) {
  var colorFormat = color.__state.conversionName.toString();
  var r = Math.round(color.r);
  var g = Math.round(color.g);
  var b = Math.round(color.b);
  var a = color.a;
  var h = Math.round(color.h);
  var s = color.s.toFixed(1);
  var v = color.v.toFixed(1);
  if (forceCSSHex || colorFormat === 'THREE_CHAR_HEX' || colorFormat === 'SIX_CHAR_HEX') {
    var str = color.hex.toString(16);
    while (str.length < 6) {
      str = '0' + str;
    }
    return '#' + str;
  } else if (colorFormat === 'CSS_RGB') {
    return 'rgb(' + r + ',' + g + ',' + b + ')';
  } else if (colorFormat === 'CSS_RGBA') {
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  } else if (colorFormat === 'HEX') {
    return '0x' + color.hex.toString(16);
  } else if (colorFormat === 'RGB_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ']';
  } else if (colorFormat === 'RGBA_ARRAY') {
    return '[' + r + ',' + g + ',' + b + ',' + a + ']';
  } else if (colorFormat === 'RGB_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + '}';
  } else if (colorFormat === 'RGBA_OBJ') {
    return '{r:' + r + ',g:' + g + ',b:' + b + ',a:' + a + '}';
  } else if (colorFormat === 'HSV_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + '}';
  } else if (colorFormat === 'HSVA_OBJ') {
    return '{h:' + h + ',s:' + s + ',v:' + v + ',a:' + a + '}';
  }
  return 'unknown format';
}

var ARR_EACH = Array.prototype.forEach;
var ARR_SLICE = Array.prototype.slice;
var Common = {
  BREAK: {},
  extend: function extend(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (!this.isUndefined(obj[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  defaults: function defaults(target) {
    this.each(ARR_SLICE.call(arguments, 1), function (obj) {
      var keys = this.isObject(obj) ? Object.keys(obj) : [];
      keys.forEach(function (key) {
        if (this.isUndefined(target[key])) {
          target[key] = obj[key];
        }
      }.bind(this));
    }, this);
    return target;
  },
  compose: function compose() {
    var toCall = ARR_SLICE.call(arguments);
    return function () {
      var args = ARR_SLICE.call(arguments);
      for (var i = toCall.length - 1; i >= 0; i--) {
        args = [toCall[i].apply(this, args)];
      }
      return args[0];
    };
  },
  each: function each(obj, itr, scope) {
    if (!obj) {
      return;
    }
    if (ARR_EACH && obj.forEach && obj.forEach === ARR_EACH) {
      obj.forEach(itr, scope);
    } else if (obj.length === obj.length + 0) {
      var key = void 0;
      var l = void 0;
      for (key = 0, l = obj.length; key < l; key++) {
        if (key in obj && itr.call(scope, obj[key], key) === this.BREAK) {
          return;
        }
      }
    } else {
      for (var _key in obj) {
        if (itr.call(scope, obj[_key], _key) === this.BREAK) {
          return;
        }
      }
    }
  },
  defer: function defer(fnc) {
    setTimeout(fnc, 0);
  },
  debounce: function debounce(func, threshold, callImmediately) {
    var timeout = void 0;
    return function () {
      var obj = this;
      var args = arguments;
      function delayed() {
        timeout = null;
        if (!callImmediately) func.apply(obj, args);
      }
      var callNow = callImmediately || !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(delayed, threshold);
      if (callNow) {
        func.apply(obj, args);
      }
    };
  },
  toArray: function toArray(obj) {
    if (obj.toArray) return obj.toArray();
    return ARR_SLICE.call(obj);
  },
  isUndefined: function isUndefined(obj) {
    return obj === undefined;
  },
  isNull: function isNull(obj) {
    return obj === null;
  },
  isNaN: function (_isNaN) {
    function isNaN(_x) {
      return _isNaN.apply(this, arguments);
    }
    isNaN.toString = function () {
      return _isNaN.toString();
    };
    return isNaN;
  }(function (obj) {
    return isNaN(obj);
  }),
  isArray: Array.isArray || function (obj) {
    return obj.constructor === Array;
  },
  isObject: function isObject(obj) {
    return obj === Object(obj);
  },
  isNumber: function isNumber(obj) {
    return obj === obj + 0;
  },
  isString: function isString(obj) {
    return obj === obj + '';
  },
  isBoolean: function isBoolean(obj) {
    return obj === false || obj === true;
  },
  isFunction: function isFunction(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
  }
};

var INTERPRETATIONS = [
{
  litmus: Common.isString,
  conversions: {
    THREE_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9])([A-F0-9])([A-F0-9])$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString() + test[1].toString() + test[2].toString() + test[2].toString() + test[3].toString() + test[3].toString(), 0)
        };
      },
      write: colorToString
    },
    SIX_CHAR_HEX: {
      read: function read(original) {
        var test = original.match(/^#([A-F0-9]{6})$/i);
        if (test === null) {
          return false;
        }
        return {
          space: 'HEX',
          hex: parseInt('0x' + test[1].toString(), 0)
        };
      },
      write: colorToString
    },
    CSS_RGB: {
      read: function read(original) {
        var test = original.match(/^rgb\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3])
        };
      },
      write: colorToString
    },
    CSS_RGBA: {
      read: function read(original) {
        var test = original.match(/^rgba\(\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*,\s*(.+)\s*\)/);
        if (test === null) {
          return false;
        }
        return {
          space: 'RGB',
          r: parseFloat(test[1]),
          g: parseFloat(test[2]),
          b: parseFloat(test[3]),
          a: parseFloat(test[4])
        };
      },
      write: colorToString
    }
  }
},
{
  litmus: Common.isNumber,
  conversions: {
    HEX: {
      read: function read(original) {
        return {
          space: 'HEX',
          hex: original,
          conversionName: 'HEX'
        };
      },
      write: function write(color) {
        return color.hex;
      }
    }
  }
},
{
  litmus: Common.isArray,
  conversions: {
    RGB_ARRAY: {
      read: function read(original) {
        if (original.length !== 3) {
          return false;
        }
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b];
      }
    },
    RGBA_ARRAY: {
      read: function read(original) {
        if (original.length !== 4) return false;
        return {
          space: 'RGB',
          r: original[0],
          g: original[1],
          b: original[2],
          a: original[3]
        };
      },
      write: function write(color) {
        return [color.r, color.g, color.b, color.a];
      }
    }
  }
},
{
  litmus: Common.isObject,
  conversions: {
    RGBA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b) && Common.isNumber(original.a)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b,
          a: color.a
        };
      }
    },
    RGB_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.r) && Common.isNumber(original.g) && Common.isNumber(original.b)) {
          return {
            space: 'RGB',
            r: original.r,
            g: original.g,
            b: original.b
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          r: color.r,
          g: color.g,
          b: color.b
        };
      }
    },
    HSVA_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v) && Common.isNumber(original.a)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v,
            a: original.a
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v,
          a: color.a
        };
      }
    },
    HSV_OBJ: {
      read: function read(original) {
        if (Common.isNumber(original.h) && Common.isNumber(original.s) && Common.isNumber(original.v)) {
          return {
            space: 'HSV',
            h: original.h,
            s: original.s,
            v: original.v
          };
        }
        return false;
      },
      write: function write(color) {
        return {
          h: color.h,
          s: color.s,
          v: color.v
        };
      }
    }
  }
}];
var result = void 0;
var toReturn = void 0;
var interpret = function interpret() {
  toReturn = false;
  var original = arguments.length > 1 ? Common.toArray(arguments) : arguments[0];
  Common.each(INTERPRETATIONS, function (family) {
    if (family.litmus(original)) {
      Common.each(family.conversions, function (conversion, conversionName) {
        result = conversion.read(original);
        if (toReturn === false && result !== false) {
          toReturn = result;
          result.conversionName = conversionName;
          result.conversion = conversion;
          return Common.BREAK;
        }
      });
      return Common.BREAK;
    }
  });
  return toReturn;
};

var tmpComponent = void 0;
var ColorMath = {
  hsv_to_rgb: function hsv_to_rgb(h, s, v) {
    var hi = Math.floor(h / 60) % 6;
    var f = h / 60 - Math.floor(h / 60);
    var p = v * (1.0 - s);
    var q = v * (1.0 - f * s);
    var t = v * (1.0 - (1.0 - f) * s);
    var c = [[v, t, p], [q, v, p], [p, v, t], [p, q, v], [t, p, v], [v, p, q]][hi];
    return {
      r: c[0] * 255,
      g: c[1] * 255,
      b: c[2] * 255
    };
  },
  rgb_to_hsv: function rgb_to_hsv(r, g, b) {
    var min = Math.min(r, g, b);
    var max = Math.max(r, g, b);
    var delta = max - min;
    var h = void 0;
    var s = void 0;
    if (max !== 0) {
      s = delta / max;
    } else {
      return {
        h: NaN,
        s: 0,
        v: 0
      };
    }
    if (r === max) {
      h = (g - b) / delta;
    } else if (g === max) {
      h = 2 + (b - r) / delta;
    } else {
      h = 4 + (r - g) / delta;
    }
    h /= 6;
    if (h < 0) {
      h += 1;
    }
    return {
      h: h * 360,
      s: s,
      v: max / 255
    };
  },
  rgb_to_hex: function rgb_to_hex(r, g, b) {
    var hex = this.hex_with_component(0, 2, r);
    hex = this.hex_with_component(hex, 1, g);
    hex = this.hex_with_component(hex, 0, b);
    return hex;
  },
  component_from_hex: function component_from_hex(hex, componentIndex) {
    return hex >> componentIndex * 8 & 0xFF;
  },
  hex_with_component: function hex_with_component(hex, componentIndex, value) {
    return value << (tmpComponent = componentIndex * 8) | hex & ~(0xFF << tmpComponent);
  }
};

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) {
  return typeof obj;
} : function (obj) {
  return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
};











var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();







var get = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = Object.getOwnPropertyDescriptor(object, property);

  if (desc === undefined) {
    var parent = Object.getPrototypeOf(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};

var inherits = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
};











var possibleConstructorReturn = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
};

var Color = function () {
  function Color() {
    classCallCheck(this, Color);
    this.__state = interpret.apply(this, arguments);
    if (this.__state === false) {
      throw new Error('Failed to interpret color arguments');
    }
    this.__state.a = this.__state.a || 1;
  }
  createClass(Color, [{
    key: 'toString',
    value: function toString() {
      return colorToString(this);
    }
  }, {
    key: 'toHexString',
    value: function toHexString() {
      return colorToString(this, true);
    }
  }, {
    key: 'toOriginal',
    value: function toOriginal() {
      return this.__state.conversion.write(this);
    }
  }]);
  return Color;
}();
function defineRGBComponent(target, component, componentHexIndex) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'RGB') {
        return this.__state[component];
      }
      Color.recalculateRGB(this, component, componentHexIndex);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'RGB') {
        Color.recalculateRGB(this, component, componentHexIndex);
        this.__state.space = 'RGB';
      }
      this.__state[component] = v;
    }
  });
}
function defineHSVComponent(target, component) {
  Object.defineProperty(target, component, {
    get: function get$$1() {
      if (this.__state.space === 'HSV') {
        return this.__state[component];
      }
      Color.recalculateHSV(this);
      return this.__state[component];
    },
    set: function set$$1(v) {
      if (this.__state.space !== 'HSV') {
        Color.recalculateHSV(this);
        this.__state.space = 'HSV';
      }
      this.__state[component] = v;
    }
  });
}
Color.recalculateRGB = function (color, component, componentHexIndex) {
  if (color.__state.space === 'HEX') {
    color.__state[component] = ColorMath.component_from_hex(color.__state.hex, componentHexIndex);
  } else if (color.__state.space === 'HSV') {
    Common.extend(color.__state, ColorMath.hsv_to_rgb(color.__state.h, color.__state.s, color.__state.v));
  } else {
    throw new Error('Corrupted color state');
  }
};
Color.recalculateHSV = function (color) {
  var result = ColorMath.rgb_to_hsv(color.r, color.g, color.b);
  Common.extend(color.__state, {
    s: result.s,
    v: result.v
  });
  if (!Common.isNaN(result.h)) {
    color.__state.h = result.h;
  } else if (Common.isUndefined(color.__state.h)) {
    color.__state.h = 0;
  }
};
Color.COMPONENTS = ['r', 'g', 'b', 'h', 's', 'v', 'hex', 'a'];
defineRGBComponent(Color.prototype, 'r', 2);
defineRGBComponent(Color.prototype, 'g', 1);
defineRGBComponent(Color.prototype, 'b', 0);
defineHSVComponent(Color.prototype, 'h');
defineHSVComponent(Color.prototype, 's');
defineHSVComponent(Color.prototype, 'v');
Object.defineProperty(Color.prototype, 'a', {
  get: function get$$1() {
    return this.__state.a;
  },
  set: function set$$1(v) {
    this.__state.a = v;
  }
});
Object.defineProperty(Color.prototype, 'hex', {
  get: function get$$1() {
    if (!this.__state.space !== 'HEX') {
      this.__state.hex = ColorMath.rgb_to_hex(this.r, this.g, this.b);
    }
    return this.__state.hex;
  },
  set: function set$$1(v) {
    this.__state.space = 'HEX';
    this.__state.hex = v;
  }
});

var Controller = function () {
  function Controller(object, property) {
    classCallCheck(this, Controller);
    this.initialValue = object[property];
    this.domElement = document.createElement('div');
    this.object = object;
    this.property = property;
    this.__onChange = undefined;
    this.__onFinishChange = undefined;
  }
  createClass(Controller, [{
    key: 'onChange',
    value: function onChange(fnc) {
      this.__onChange = fnc;
      return this;
    }
  }, {
    key: 'onFinishChange',
    value: function onFinishChange(fnc) {
      this.__onFinishChange = fnc;
      return this;
    }
  }, {
    key: 'setValue',
    value: function setValue(newValue) {
      this.object[this.property] = newValue;
      if (this.__onChange) {
        this.__onChange.call(this, newValue);
      }
      this.updateDisplay();
      return this;
    }
  }, {
    key: 'getValue',
    value: function getValue() {
      return this.object[this.property];
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      return this;
    }
  }, {
    key: 'isModified',
    value: function isModified() {
      return this.initialValue !== this.getValue();
    }
  }]);
  return Controller;
}();

var EVENT_MAP = {
  HTMLEvents: ['change'],
  MouseEvents: ['click', 'mousemove', 'mousedown', 'mouseup', 'mouseover'],
  KeyboardEvents: ['keydown']
};
var EVENT_MAP_INV = {};
Common.each(EVENT_MAP, function (v, k) {
  Common.each(v, function (e) {
    EVENT_MAP_INV[e] = k;
  });
});
var CSS_VALUE_PIXELS = /(\d+(\.\d+)?)px/;
function cssValueToPixels(val) {
  if (val === '0' || Common.isUndefined(val)) {
    return 0;
  }
  var match = val.match(CSS_VALUE_PIXELS);
  if (!Common.isNull(match)) {
    return parseFloat(match[1]);
  }
  return 0;
}
var dom = {
  makeSelectable: function makeSelectable(elem, selectable) {
    if (elem === undefined || elem.style === undefined) return;
    elem.onselectstart = selectable ? function () {
      return false;
    } : function () {};
    elem.style.MozUserSelect = selectable ? 'auto' : 'none';
    elem.style.KhtmlUserSelect = selectable ? 'auto' : 'none';
    elem.unselectable = selectable ? 'on' : 'off';
  },
  makeFullscreen: function makeFullscreen(elem, hor, vert) {
    var vertical = vert;
    var horizontal = hor;
    if (Common.isUndefined(horizontal)) {
      horizontal = true;
    }
    if (Common.isUndefined(vertical)) {
      vertical = true;
    }
    elem.style.position = 'absolute';
    if (horizontal) {
      elem.style.left = 0;
      elem.style.right = 0;
    }
    if (vertical) {
      elem.style.top = 0;
      elem.style.bottom = 0;
    }
  },
  fakeEvent: function fakeEvent(elem, eventType, pars, aux) {
    var params = pars || {};
    var className = EVENT_MAP_INV[eventType];
    if (!className) {
      throw new Error('Event type ' + eventType + ' not supported.');
    }
    var evt = document.createEvent(className);
    switch (className) {
      case 'MouseEvents':
        {
          var clientX = params.x || params.clientX || 0;
          var clientY = params.y || params.clientY || 0;
          evt.initMouseEvent(eventType, params.bubbles || false, params.cancelable || true, window, params.clickCount || 1, 0,
          0,
          clientX,
          clientY,
          false, false, false, false, 0, null);
          break;
        }
      case 'KeyboardEvents':
        {
          var init = evt.initKeyboardEvent || evt.initKeyEvent;
          Common.defaults(params, {
            cancelable: true,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            keyCode: undefined,
            charCode: undefined
          });
          init(eventType, params.bubbles || false, params.cancelable, window, params.ctrlKey, params.altKey, params.shiftKey, params.metaKey, params.keyCode, params.charCode);
          break;
        }
      default:
        {
          evt.initEvent(eventType, params.bubbles || false, params.cancelable || true);
          break;
        }
    }
    Common.defaults(evt, aux);
    elem.dispatchEvent(evt);
  },
  bind: function bind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.addEventListener) {
      elem.addEventListener(event, func, bool);
    } else if (elem.attachEvent) {
      elem.attachEvent('on' + event, func);
    }
    return dom;
  },
  unbind: function unbind(elem, event, func, newBool) {
    var bool = newBool || false;
    if (elem.removeEventListener) {
      elem.removeEventListener(event, func, bool);
    } else if (elem.detachEvent) {
      elem.detachEvent('on' + event, func);
    }
    return dom;
  },
  addClass: function addClass(elem, className) {
    if (elem.className === undefined) {
      elem.className = className;
    } else if (elem.className !== className) {
      var classes = elem.className.split(/ +/);
      if (classes.indexOf(className) === -1) {
        classes.push(className);
        elem.className = classes.join(' ').replace(/^\s+/, '').replace(/\s+$/, '');
      }
    }
    return dom;
  },
  removeClass: function removeClass(elem, className) {
    if (className) {
      if (elem.className === className) {
        elem.removeAttribute('class');
      } else {
        var classes = elem.className.split(/ +/);
        var index = classes.indexOf(className);
        if (index !== -1) {
          classes.splice(index, 1);
          elem.className = classes.join(' ');
        }
      }
    } else {
      elem.className = undefined;
    }
    return dom;
  },
  hasClass: function hasClass(elem, className) {
    return new RegExp('(?:^|\\s+)' + className + '(?:\\s+|$)').test(elem.className) || false;
  },
  getWidth: function getWidth(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-left-width']) + cssValueToPixels(style['border-right-width']) + cssValueToPixels(style['padding-left']) + cssValueToPixels(style['padding-right']) + cssValueToPixels(style.width);
  },
  getHeight: function getHeight(elem) {
    var style = getComputedStyle(elem);
    return cssValueToPixels(style['border-top-width']) + cssValueToPixels(style['border-bottom-width']) + cssValueToPixels(style['padding-top']) + cssValueToPixels(style['padding-bottom']) + cssValueToPixels(style.height);
  },
  getOffset: function getOffset(el) {
    var elem = el;
    var offset = { left: 0, top: 0 };
    if (elem.offsetParent) {
      do {
        offset.left += elem.offsetLeft;
        offset.top += elem.offsetTop;
        elem = elem.offsetParent;
      } while (elem);
    }
    return offset;
  },
  isActive: function isActive(elem) {
    return elem === document.activeElement && (elem.type || elem.href);
  }
};

var BooleanController = function (_Controller) {
  inherits(BooleanController, _Controller);
  function BooleanController(object, property) {
    classCallCheck(this, BooleanController);
    var _this2 = possibleConstructorReturn(this, (BooleanController.__proto__ || Object.getPrototypeOf(BooleanController)).call(this, object, property));
    var _this = _this2;
    _this2.__prev = _this2.getValue();
    _this2.__checkbox = document.createElement('input');
    _this2.__checkbox.setAttribute('type', 'checkbox');
    function onChange() {
      _this.setValue(!_this.__prev);
    }
    dom.bind(_this2.__checkbox, 'change', onChange, false);
    _this2.domElement.appendChild(_this2.__checkbox);
    _this2.updateDisplay();
    return _this2;
  }
  createClass(BooleanController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      this.__prev = this.getValue();
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (this.getValue() === true) {
        this.__checkbox.setAttribute('checked', 'checked');
        this.__checkbox.checked = true;
        this.__prev = true;
      } else {
        this.__checkbox.checked = false;
        this.__prev = false;
      }
      return get(BooleanController.prototype.__proto__ || Object.getPrototypeOf(BooleanController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return BooleanController;
}(Controller);

var OptionController = function (_Controller) {
  inherits(OptionController, _Controller);
  function OptionController(object, property, opts) {
    classCallCheck(this, OptionController);
    var _this2 = possibleConstructorReturn(this, (OptionController.__proto__ || Object.getPrototypeOf(OptionController)).call(this, object, property));
    var options = opts;
    var _this = _this2;
    _this2.__select = document.createElement('select');
    if (Common.isArray(options)) {
      var map = {};
      Common.each(options, function (element) {
        map[element] = element;
      });
      options = map;
    }
    Common.each(options, function (value, key) {
      var opt = document.createElement('option');
      opt.innerHTML = key;
      opt.setAttribute('value', value);
      _this.__select.appendChild(opt);
    });
    _this2.updateDisplay();
    dom.bind(_this2.__select, 'change', function () {
      var desiredValue = this.options[this.selectedIndex].value;
      _this.setValue(desiredValue);
    });
    _this2.domElement.appendChild(_this2.__select);
    return _this2;
  }
  createClass(OptionController, [{
    key: 'setValue',
    value: function setValue(v) {
      var toReturn = get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'setValue', this).call(this, v);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
      return toReturn;
    }
  }, {
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (dom.isActive(this.__select)) return this;
      this.__select.value = this.getValue();
      return get(OptionController.prototype.__proto__ || Object.getPrototypeOf(OptionController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return OptionController;
}(Controller);

var StringController = function (_Controller) {
  inherits(StringController, _Controller);
  function StringController(object, property) {
    classCallCheck(this, StringController);
    var _this2 = possibleConstructorReturn(this, (StringController.__proto__ || Object.getPrototypeOf(StringController)).call(this, object, property));
    var _this = _this2;
    function onChange() {
      _this.setValue(_this.__input.value);
    }
    function onBlur() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'keyup', onChange);
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        this.blur();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(StringController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      if (!dom.isActive(this.__input)) {
        this.__input.value = this.getValue();
      }
      return get(StringController.prototype.__proto__ || Object.getPrototypeOf(StringController.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return StringController;
}(Controller);

function numDecimals(x) {
  var _x = x.toString();
  if (_x.indexOf('.') > -1) {
    return _x.length - _x.indexOf('.') - 1;
  }
  return 0;
}
var NumberController = function (_Controller) {
  inherits(NumberController, _Controller);
  function NumberController(object, property, params) {
    classCallCheck(this, NumberController);
    var _this = possibleConstructorReturn(this, (NumberController.__proto__ || Object.getPrototypeOf(NumberController)).call(this, object, property));
    var _params = params || {};
    _this.__min = _params.min;
    _this.__max = _params.max;
    _this.__step = _params.step;
    if (Common.isUndefined(_this.__step)) {
      if (_this.initialValue === 0) {
        _this.__impliedStep = 1;
      } else {
        _this.__impliedStep = Math.pow(10, Math.floor(Math.log(Math.abs(_this.initialValue)) / Math.LN10)) / 10;
      }
    } else {
      _this.__impliedStep = _this.__step;
    }
    _this.__precision = numDecimals(_this.__impliedStep);
    return _this;
  }
  createClass(NumberController, [{
    key: 'setValue',
    value: function setValue(v) {
      var _v = v;
      if (this.__min !== undefined && _v < this.__min) {
        _v = this.__min;
      } else if (this.__max !== undefined && _v > this.__max) {
        _v = this.__max;
      }
      if (this.__step !== undefined && _v % this.__step !== 0) {
        _v = Math.round(_v / this.__step) * this.__step;
      }
      return get(NumberController.prototype.__proto__ || Object.getPrototypeOf(NumberController.prototype), 'setValue', this).call(this, _v);
    }
  }, {
    key: 'min',
    value: function min(minValue) {
      this.__min = minValue;
      return this;
    }
  }, {
    key: 'max',
    value: function max(maxValue) {
      this.__max = maxValue;
      return this;
    }
  }, {
    key: 'step',
    value: function step(stepValue) {
      this.__step = stepValue;
      this.__impliedStep = stepValue;
      this.__precision = numDecimals(stepValue);
      return this;
    }
  }]);
  return NumberController;
}(Controller);

function roundToDecimal(value, decimals) {
  var tenTo = Math.pow(10, decimals);
  return Math.round(value * tenTo) / tenTo;
}
var NumberControllerBox = function (_NumberController) {
  inherits(NumberControllerBox, _NumberController);
  function NumberControllerBox(object, property, params) {
    classCallCheck(this, NumberControllerBox);
    var _this2 = possibleConstructorReturn(this, (NumberControllerBox.__proto__ || Object.getPrototypeOf(NumberControllerBox)).call(this, object, property, params));
    _this2.__truncationSuspended = false;
    var _this = _this2;
    var prevY = void 0;
    function onChange() {
      var attempted = parseFloat(_this.__input.value);
      if (!Common.isNaN(attempted)) {
        _this.setValue(attempted);
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onBlur() {
      onFinish();
    }
    function onMouseDrag(e) {
      var diff = prevY - e.clientY;
      _this.setValue(_this.getValue() + diff * _this.__impliedStep);
      prevY = e.clientY;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      onFinish();
    }
    function onMouseDown(e) {
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      prevY = e.clientY;
    }
    _this2.__input = document.createElement('input');
    _this2.__input.setAttribute('type', 'text');
    dom.bind(_this2.__input, 'change', onChange);
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__input, 'mousedown', onMouseDown);
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        _this.__truncationSuspended = true;
        this.blur();
        _this.__truncationSuspended = false;
        onFinish();
      }
    });
    _this2.updateDisplay();
    _this2.domElement.appendChild(_this2.__input);
    return _this2;
  }
  createClass(NumberControllerBox, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      this.__input.value = this.__truncationSuspended ? this.getValue() : roundToDecimal(this.getValue(), this.__precision);
      return get(NumberControllerBox.prototype.__proto__ || Object.getPrototypeOf(NumberControllerBox.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerBox;
}(NumberController);

function map(v, i1, i2, o1, o2) {
  return o1 + (o2 - o1) * ((v - i1) / (i2 - i1));
}
var NumberControllerSlider = function (_NumberController) {
  inherits(NumberControllerSlider, _NumberController);
  function NumberControllerSlider(object, property, min, max, step) {
    classCallCheck(this, NumberControllerSlider);
    var _this2 = possibleConstructorReturn(this, (NumberControllerSlider.__proto__ || Object.getPrototypeOf(NumberControllerSlider)).call(this, object, property, { min: min, max: max, step: step }));
    var _this = _this2;
    _this2.__background = document.createElement('div');
    _this2.__foreground = document.createElement('div');
    dom.bind(_this2.__background, 'mousedown', onMouseDown);
    dom.bind(_this2.__background, 'touchstart', onTouchStart);
    dom.addClass(_this2.__background, 'slider');
    dom.addClass(_this2.__foreground, 'slider-fg');
    function onMouseDown(e) {
      document.activeElement.blur();
      dom.bind(window, 'mousemove', onMouseDrag);
      dom.bind(window, 'mouseup', onMouseUp);
      onMouseDrag(e);
    }
    function onMouseDrag(e) {
      e.preventDefault();
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(e.clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
      return false;
    }
    function onMouseUp() {
      dom.unbind(window, 'mousemove', onMouseDrag);
      dom.unbind(window, 'mouseup', onMouseUp);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    function onTouchStart(e) {
      if (e.touches.length !== 1) {
        return;
      }
      dom.bind(window, 'touchmove', onTouchMove);
      dom.bind(window, 'touchend', onTouchEnd);
      onTouchMove(e);
    }
    function onTouchMove(e) {
      var clientX = e.touches[0].clientX;
      var bgRect = _this.__background.getBoundingClientRect();
      _this.setValue(map(clientX, bgRect.left, bgRect.right, _this.__min, _this.__max));
    }
    function onTouchEnd() {
      dom.unbind(window, 'touchmove', onTouchMove);
      dom.unbind(window, 'touchend', onTouchEnd);
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.getValue());
      }
    }
    _this2.updateDisplay();
    _this2.__background.appendChild(_this2.__foreground);
    _this2.domElement.appendChild(_this2.__background);
    return _this2;
  }
  createClass(NumberControllerSlider, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var pct = (this.getValue() - this.__min) / (this.__max - this.__min);
      this.__foreground.style.width = pct * 100 + '%';
      return get(NumberControllerSlider.prototype.__proto__ || Object.getPrototypeOf(NumberControllerSlider.prototype), 'updateDisplay', this).call(this);
    }
  }]);
  return NumberControllerSlider;
}(NumberController);

var FunctionController = function (_Controller) {
  inherits(FunctionController, _Controller);
  function FunctionController(object, property, text) {
    classCallCheck(this, FunctionController);
    var _this2 = possibleConstructorReturn(this, (FunctionController.__proto__ || Object.getPrototypeOf(FunctionController)).call(this, object, property));
    var _this = _this2;
    _this2.__button = document.createElement('div');
    _this2.__button.innerHTML = text === undefined ? 'Fire' : text;
    dom.bind(_this2.__button, 'click', function (e) {
      e.preventDefault();
      _this.fire();
      return false;
    });
    dom.addClass(_this2.__button, 'button');
    _this2.domElement.appendChild(_this2.__button);
    return _this2;
  }
  createClass(FunctionController, [{
    key: 'fire',
    value: function fire() {
      if (this.__onChange) {
        this.__onChange.call(this);
      }
      this.getValue().call(this.object);
      if (this.__onFinishChange) {
        this.__onFinishChange.call(this, this.getValue());
      }
    }
  }]);
  return FunctionController;
}(Controller);

var ColorController = function (_Controller) {
  inherits(ColorController, _Controller);
  function ColorController(object, property) {
    classCallCheck(this, ColorController);
    var _this2 = possibleConstructorReturn(this, (ColorController.__proto__ || Object.getPrototypeOf(ColorController)).call(this, object, property));
    _this2.__color = new Color(_this2.getValue());
    _this2.__temp = new Color(0);
    var _this = _this2;
    _this2.domElement = document.createElement('div');
    dom.makeSelectable(_this2.domElement, false);
    _this2.__selector = document.createElement('div');
    _this2.__selector.className = 'selector';
    _this2.__saturation_field = document.createElement('div');
    _this2.__saturation_field.className = 'saturation-field';
    _this2.__field_knob = document.createElement('div');
    _this2.__field_knob.className = 'field-knob';
    _this2.__field_knob_border = '2px solid ';
    _this2.__hue_knob = document.createElement('div');
    _this2.__hue_knob.className = 'hue-knob';
    _this2.__hue_field = document.createElement('div');
    _this2.__hue_field.className = 'hue-field';
    _this2.__input = document.createElement('input');
    _this2.__input.type = 'text';
    _this2.__input_textShadow = '0 1px 1px ';
    dom.bind(_this2.__input, 'keydown', function (e) {
      if (e.keyCode === 13) {
        onBlur.call(this);
      }
    });
    dom.bind(_this2.__input, 'blur', onBlur);
    dom.bind(_this2.__selector, 'mousedown', function ()        {
      dom.addClass(this, 'drag').bind(window, 'mouseup', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    dom.bind(_this2.__selector, 'touchstart', function ()        {
      dom.addClass(this, 'drag').bind(window, 'touchend', function ()        {
        dom.removeClass(_this.__selector, 'drag');
      });
    });
    var valueField = document.createElement('div');
    Common.extend(_this2.__selector.style, {
      width: '122px',
      height: '102px',
      padding: '3px',
      backgroundColor: '#222',
      boxShadow: '0px 1px 3px rgba(0,0,0,0.3)'
    });
    Common.extend(_this2.__field_knob.style, {
      position: 'absolute',
      width: '12px',
      height: '12px',
      border: _this2.__field_knob_border + (_this2.__color.v < 0.5 ? '#fff' : '#000'),
      boxShadow: '0px 1px 3px rgba(0,0,0,0.5)',
      borderRadius: '12px',
      zIndex: 1
    });
    Common.extend(_this2.__hue_knob.style, {
      position: 'absolute',
      width: '15px',
      height: '2px',
      borderRight: '4px solid #fff',
      zIndex: 1
    });
    Common.extend(_this2.__saturation_field.style, {
      width: '100px',
      height: '100px',
      border: '1px solid #555',
      marginRight: '3px',
      display: 'inline-block',
      cursor: 'pointer'
    });
    Common.extend(valueField.style, {
      width: '100%',
      height: '100%',
      background: 'none'
    });
    linearGradient(valueField, 'top', 'rgba(0,0,0,0)', '#000');
    Common.extend(_this2.__hue_field.style, {
      width: '15px',
      height: '100px',
      border: '1px solid #555',
      cursor: 'ns-resize',
      position: 'absolute',
      top: '3px',
      right: '3px'
    });
    hueGradient(_this2.__hue_field);
    Common.extend(_this2.__input.style, {
      outline: 'none',
      textAlign: 'center',
      color: '#fff',
      border: 0,
      fontWeight: 'bold',
      textShadow: _this2.__input_textShadow + 'rgba(0,0,0,0.7)'
    });
    dom.bind(_this2.__saturation_field, 'mousedown', fieldDown);
    dom.bind(_this2.__saturation_field, 'touchstart', fieldDown);
    dom.bind(_this2.__field_knob, 'mousedown', fieldDown);
    dom.bind(_this2.__field_knob, 'touchstart', fieldDown);
    dom.bind(_this2.__hue_field, 'mousedown', fieldDownH);
    dom.bind(_this2.__hue_field, 'touchstart', fieldDownH);
    function fieldDown(e) {
      setSV(e);
      dom.bind(window, 'mousemove', setSV);
      dom.bind(window, 'touchmove', setSV);
      dom.bind(window, 'mouseup', fieldUpSV);
      dom.bind(window, 'touchend', fieldUpSV);
    }
    function fieldDownH(e) {
      setH(e);
      dom.bind(window, 'mousemove', setH);
      dom.bind(window, 'touchmove', setH);
      dom.bind(window, 'mouseup', fieldUpH);
      dom.bind(window, 'touchend', fieldUpH);
    }
    function fieldUpSV() {
      dom.unbind(window, 'mousemove', setSV);
      dom.unbind(window, 'touchmove', setSV);
      dom.unbind(window, 'mouseup', fieldUpSV);
      dom.unbind(window, 'touchend', fieldUpSV);
      onFinish();
    }
    function fieldUpH() {
      dom.unbind(window, 'mousemove', setH);
      dom.unbind(window, 'touchmove', setH);
      dom.unbind(window, 'mouseup', fieldUpH);
      dom.unbind(window, 'touchend', fieldUpH);
      onFinish();
    }
    function onBlur() {
      var i = interpret(this.value);
      if (i !== false) {
        _this.__color.__state = i;
        _this.setValue(_this.__color.toOriginal());
      } else {
        this.value = _this.__color.toString();
      }
    }
    function onFinish() {
      if (_this.__onFinishChange) {
        _this.__onFinishChange.call(_this, _this.__color.toOriginal());
      }
    }
    _this2.__saturation_field.appendChild(valueField);
    _this2.__selector.appendChild(_this2.__field_knob);
    _this2.__selector.appendChild(_this2.__saturation_field);
    _this2.__selector.appendChild(_this2.__hue_field);
    _this2.__hue_field.appendChild(_this2.__hue_knob);
    _this2.domElement.appendChild(_this2.__input);
    _this2.domElement.appendChild(_this2.__selector);
    _this2.updateDisplay();
    function setSV(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__saturation_field.getBoundingClientRect();
      var _ref = e.touches && e.touches[0] || e,
          clientX = _ref.clientX,
          clientY = _ref.clientY;
      var s = (clientX - fieldRect.left) / (fieldRect.right - fieldRect.left);
      var v = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (v > 1) {
        v = 1;
      } else if (v < 0) {
        v = 0;
      }
      if (s > 1) {
        s = 1;
      } else if (s < 0) {
        s = 0;
      }
      _this.__color.v = v;
      _this.__color.s = s;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    function setH(e) {
      if (e.type.indexOf('touch') === -1) {
        e.preventDefault();
      }
      var fieldRect = _this.__hue_field.getBoundingClientRect();
      var _ref2 = e.touches && e.touches[0] || e,
          clientY = _ref2.clientY;
      var h = 1 - (clientY - fieldRect.top) / (fieldRect.bottom - fieldRect.top);
      if (h > 1) {
        h = 1;
      } else if (h < 0) {
        h = 0;
      }
      _this.__color.h = h * 360;
      _this.setValue(_this.__color.toOriginal());
      return false;
    }
    return _this2;
  }
  createClass(ColorController, [{
    key: 'updateDisplay',
    value: function updateDisplay() {
      var i = interpret(this.getValue());
      if (i !== false) {
        var mismatch = false;
        Common.each(Color.COMPONENTS, function (component) {
          if (!Common.isUndefined(i[component]) && !Common.isUndefined(this.__color.__state[component]) && i[component] !== this.__color.__state[component]) {
            mismatch = true;
            return {};
          }
        }, this);
        if (mismatch) {
          Common.extend(this.__color.__state, i);
        }
      }
      Common.extend(this.__temp.__state, this.__color.__state);
      this.__temp.a = 1;
      var flip = this.__color.v < 0.5 || this.__color.s > 0.5 ? 255 : 0;
      var _flip = 255 - flip;
      Common.extend(this.__field_knob.style, {
        marginLeft: 100 * this.__color.s - 7 + 'px',
        marginTop: 100 * (1 - this.__color.v) - 7 + 'px',
        backgroundColor: this.__temp.toHexString(),
        border: this.__field_knob_border + 'rgb(' + flip + ',' + flip + ',' + flip + ')'
      });
      this.__hue_knob.style.marginTop = (1 - this.__color.h / 360) * 100 + 'px';
      this.__temp.s = 1;
      this.__temp.v = 1;
      linearGradient(this.__saturation_field, 'left', '#fff', this.__temp.toHexString());
      this.__input.value = this.__color.toString();
      Common.extend(this.__input.style, {
        backgroundColor: this.__color.toHexString(),
        color: 'rgb(' + flip + ',' + flip + ',' + flip + ')',
        textShadow: this.__input_textShadow + 'rgba(' + _flip + ',' + _flip + ',' + _flip + ',.7)'
      });
    }
  }]);
  return ColorController;
}(Controller);
var vendors = ['-moz-', '-o-', '-webkit-', '-ms-', ''];
function linearGradient(elem, x, a, b) {
  elem.style.background = '';
  Common.each(vendors, function (vendor) {
    elem.style.cssText += 'background: ' + vendor + 'linear-gradient(' + x + ', ' + a + ' 0%, ' + b + ' 100%); ';
  });
}
function hueGradient(elem) {
  elem.style.background = '';
  elem.style.cssText += 'background: -moz-linear-gradient(top,  #ff0000 0%, #ff00ff 17%, #0000ff 34%, #00ffff 50%, #00ff00 67%, #ffff00 84%, #ff0000 100%);';
  elem.style.cssText += 'background: -webkit-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -o-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: -ms-linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
  elem.style.cssText += 'background: linear-gradient(top,  #ff0000 0%,#ff00ff 17%,#0000ff 34%,#00ffff 50%,#00ff00 67%,#ffff00 84%,#ff0000 100%);';
}

var css = {
  load: function load(url, indoc) {
    var doc = indoc || document;
    var link = doc.createElement('link');
    link.type = 'text/css';
    link.rel = 'stylesheet';
    link.href = url;
    doc.getElementsByTagName('head')[0].appendChild(link);
  },
  inject: function inject(cssContent, indoc) {
    var doc = indoc || document;
    var injected = document.createElement('style');
    injected.type = 'text/css';
    injected.innerHTML = cssContent;
    var head = doc.getElementsByTagName('head')[0];
    try {
      head.appendChild(injected);
    } catch (e) {
    }
  }
};

var saveDialogContents = "<div id=\"dg-save\" class=\"dg dialogue\">\n\n  Here's the new load parameter for your <code>GUI</code>'s constructor:\n\n  <textarea id=\"dg-new-constructor\"></textarea>\n\n  <div id=\"dg-save-locally\">\n\n    <input id=\"dg-local-storage\" type=\"checkbox\"/> Automatically save\n    values to <code>localStorage</code> on exit.\n\n    <div id=\"dg-local-explain\">The values saved to <code>localStorage</code> will\n      override those passed to <code>dat.GUI</code>'s constructor. This makes it\n      easier to work incrementally, but <code>localStorage</code> is fragile,\n      and your friends may not see the same values you do.\n\n    </div>\n\n  </div>\n\n</div>";

var ControllerFactory = function ControllerFactory(object, property) {
  var initialValue = object[property];
  if (Common.isArray(arguments[2]) || Common.isObject(arguments[2])) {
    return new OptionController(object, property, arguments[2]);
  }
  if (Common.isNumber(initialValue)) {
    if (Common.isNumber(arguments[2]) && Common.isNumber(arguments[3])) {
      if (Common.isNumber(arguments[4])) {
        return new NumberControllerSlider(object, property, arguments[2], arguments[3], arguments[4]);
      }
      return new NumberControllerSlider(object, property, arguments[2], arguments[3]);
    }
    if (Common.isNumber(arguments[4])) {
      return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3], step: arguments[4] });
    }
    return new NumberControllerBox(object, property, { min: arguments[2], max: arguments[3] });
  }
  if (Common.isString(initialValue)) {
    return new StringController(object, property);
  }
  if (Common.isFunction(initialValue)) {
    return new FunctionController(object, property, '');
  }
  if (Common.isBoolean(initialValue)) {
    return new BooleanController(object, property);
  }
  return null;
};

function requestAnimationFrame(callback) {
  setTimeout(callback, 1000 / 60);
}
var requestAnimationFrame$1 = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || requestAnimationFrame;

var CenteredDiv = function () {
  function CenteredDiv() {
    classCallCheck(this, CenteredDiv);
    this.backgroundElement = document.createElement('div');
    Common.extend(this.backgroundElement.style, {
      backgroundColor: 'rgba(0,0,0,0.8)',
      top: 0,
      left: 0,
      display: 'none',
      zIndex: '1000',
      opacity: 0,
      WebkitTransition: 'opacity 0.2s linear',
      transition: 'opacity 0.2s linear'
    });
    dom.makeFullscreen(this.backgroundElement);
    this.backgroundElement.style.position = 'fixed';
    this.domElement = document.createElement('div');
    Common.extend(this.domElement.style, {
      position: 'fixed',
      display: 'none',
      zIndex: '1001',
      opacity: 0,
      WebkitTransition: '-webkit-transform 0.2s ease-out, opacity 0.2s linear',
      transition: 'transform 0.2s ease-out, opacity 0.2s linear'
    });
    document.body.appendChild(this.backgroundElement);
    document.body.appendChild(this.domElement);
    var _this = this;
    dom.bind(this.backgroundElement, 'click', function () {
      _this.hide();
    });
  }
  createClass(CenteredDiv, [{
    key: 'show',
    value: function show() {
      var _this = this;
      this.backgroundElement.style.display = 'block';
      this.domElement.style.display = 'block';
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
      this.layout();
      Common.defer(function () {
        _this.backgroundElement.style.opacity = 1;
        _this.domElement.style.opacity = 1;
        _this.domElement.style.webkitTransform = 'scale(1)';
      });
    }
  }, {
    key: 'hide',
    value: function hide() {
      var _this = this;
      var hide = function hide() {
        _this.domElement.style.display = 'none';
        _this.backgroundElement.style.display = 'none';
        dom.unbind(_this.domElement, 'webkitTransitionEnd', hide);
        dom.unbind(_this.domElement, 'transitionend', hide);
        dom.unbind(_this.domElement, 'oTransitionEnd', hide);
      };
      dom.bind(this.domElement, 'webkitTransitionEnd', hide);
      dom.bind(this.domElement, 'transitionend', hide);
      dom.bind(this.domElement, 'oTransitionEnd', hide);
      this.backgroundElement.style.opacity = 0;
      this.domElement.style.opacity = 0;
      this.domElement.style.webkitTransform = 'scale(1.1)';
    }
  }, {
    key: 'layout',
    value: function layout() {
      this.domElement.style.left = window.innerWidth / 2 - dom.getWidth(this.domElement) / 2 + 'px';
      this.domElement.style.top = window.innerHeight / 2 - dom.getHeight(this.domElement) / 2 + 'px';
    }
  }]);
  return CenteredDiv;
}();

var styleSheet = ___$insertStyle(".dg ul{list-style:none;margin:0;padding:0;width:100%;clear:both}.dg.ac{position:fixed;top:0;left:0;right:0;height:0;z-index:0}.dg:not(.ac) .main{overflow:hidden}.dg.main{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear}.dg.main.taller-than-window{overflow-y:auto}.dg.main.taller-than-window .close-button{opacity:1;margin-top:-1px;border-top:1px solid #2c2c2c}.dg.main ul.closed .close-button{opacity:1 !important}.dg.main:hover .close-button,.dg.main .close-button.drag{opacity:1}.dg.main .close-button{-webkit-transition:opacity .1s linear;-o-transition:opacity .1s linear;-moz-transition:opacity .1s linear;transition:opacity .1s linear;border:0;line-height:19px;height:20px;cursor:pointer;text-align:center;background-color:#000}.dg.main .close-button.close-top{position:relative}.dg.main .close-button.close-bottom{position:absolute}.dg.main .close-button:hover{background-color:#111}.dg.a{float:right;margin-right:15px;overflow-y:visible}.dg.a.has-save>ul.close-top{margin-top:0}.dg.a.has-save>ul.close-bottom{margin-top:27px}.dg.a.has-save>ul.closed{margin-top:0}.dg.a .save-row{top:0;z-index:1002}.dg.a .save-row.close-top{position:relative}.dg.a .save-row.close-bottom{position:fixed}.dg li{-webkit-transition:height .1s ease-out;-o-transition:height .1s ease-out;-moz-transition:height .1s ease-out;transition:height .1s ease-out;-webkit-transition:overflow .1s linear;-o-transition:overflow .1s linear;-moz-transition:overflow .1s linear;transition:overflow .1s linear}.dg li:not(.folder){cursor:auto;height:27px;line-height:27px;padding:0 4px 0 5px}.dg li.folder{padding:0;border-left:4px solid rgba(0,0,0,0)}.dg li.title{cursor:pointer;margin-left:-4px}.dg .closed li:not(.title),.dg .closed ul li,.dg .closed ul li>*{height:0;overflow:hidden;border:0}.dg .cr{clear:both;padding-left:3px;height:27px;overflow:hidden}.dg .property-name{cursor:default;float:left;clear:left;width:40%;overflow:hidden;text-overflow:ellipsis}.dg .c{float:left;width:60%;position:relative}.dg .c input[type=text]{border:0;margin-top:4px;padding:3px;width:100%;float:right}.dg .has-slider input[type=text]{width:30%;margin-left:0}.dg .slider{float:left;width:66%;margin-left:-5px;margin-right:0;height:19px;margin-top:4px}.dg .slider-fg{height:100%}.dg .c input[type=checkbox]{margin-top:7px}.dg .c select{margin-top:5px}.dg .cr.function,.dg .cr.function .property-name,.dg .cr.function *,.dg .cr.boolean,.dg .cr.boolean *{cursor:pointer}.dg .cr.color{overflow:visible}.dg .selector{display:none;position:absolute;margin-left:-9px;margin-top:23px;z-index:10}.dg .c:hover .selector,.dg .selector.drag{display:block}.dg li.save-row{padding:0}.dg li.save-row .button{display:inline-block;padding:0px 6px}.dg.dialogue{background-color:#222;width:460px;padding:15px;font-size:13px;line-height:15px}#dg-new-constructor{padding:10px;color:#222;font-family:Monaco, monospace;font-size:10px;border:0;resize:none;box-shadow:inset 1px 1px 1px #888;word-wrap:break-word;margin:12px 0;display:block;width:440px;overflow-y:scroll;height:100px;position:relative}#dg-local-explain{display:none;font-size:11px;line-height:17px;border-radius:3px;background-color:#333;padding:8px;margin-top:10px}#dg-local-explain code{font-size:10px}#dat-gui-save-locally{display:none}.dg{color:#eee;font:11px 'Lucida Grande', sans-serif;text-shadow:0 -1px 0 #111}.dg.main::-webkit-scrollbar{width:5px;background:#1a1a1a}.dg.main::-webkit-scrollbar-corner{height:0;display:none}.dg.main::-webkit-scrollbar-thumb{border-radius:5px;background:#676767}.dg li:not(.folder){background:#1a1a1a;border-bottom:1px solid #2c2c2c}.dg li.save-row{line-height:25px;background:#dad5cb;border:0}.dg li.save-row select{margin-left:5px;width:108px}.dg li.save-row .button{margin-left:5px;margin-top:1px;border-radius:2px;font-size:9px;line-height:7px;padding:4px 4px 5px 4px;background:#c5bdad;color:#fff;text-shadow:0 1px 0 #b0a58f;box-shadow:0 -1px 0 #b0a58f;cursor:pointer}.dg li.save-row .button.gears{background:#c5bdad url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAANCAYAAAB/9ZQ7AAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAQJJREFUeNpiYKAU/P//PwGIC/ApCABiBSAW+I8AClAcgKxQ4T9hoMAEUrxx2QSGN6+egDX+/vWT4e7N82AMYoPAx/evwWoYoSYbACX2s7KxCxzcsezDh3evFoDEBYTEEqycggWAzA9AuUSQQgeYPa9fPv6/YWm/Acx5IPb7ty/fw+QZblw67vDs8R0YHyQhgObx+yAJkBqmG5dPPDh1aPOGR/eugW0G4vlIoTIfyFcA+QekhhHJhPdQxbiAIguMBTQZrPD7108M6roWYDFQiIAAv6Aow/1bFwXgis+f2LUAynwoIaNcz8XNx3Dl7MEJUDGQpx9gtQ8YCueB+D26OECAAQDadt7e46D42QAAAABJRU5ErkJggg==) 2px 1px no-repeat;height:7px;width:8px}.dg li.save-row .button:hover{background-color:#bab19e;box-shadow:0 -1px 0 #b0a58f}.dg li.folder{border-bottom:0}.dg li.title{padding-left:16px;background:#000 url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlI+hKgFxoCgAOw==) 6px 10px no-repeat;cursor:pointer;border-bottom:1px solid rgba(255,255,255,0.2)}.dg .closed li.title{background-image:url(data:image/gif;base64,R0lGODlhBQAFAJEAAP////Pz8////////yH5BAEAAAIALAAAAAAFAAUAAAIIlGIWqMCbWAEAOw==)}.dg .cr.boolean{border-left:3px solid #806787}.dg .cr.color{border-left:3px solid}.dg .cr.function{border-left:3px solid #e61d5f}.dg .cr.number{border-left:3px solid #2FA1D6}.dg .cr.number input[type=text]{color:#2FA1D6}.dg .cr.string{border-left:3px solid #1ed36f}.dg .cr.string input[type=text]{color:#1ed36f}.dg .cr.function:hover,.dg .cr.boolean:hover{background:#111}.dg .c input[type=text]{background:#303030;outline:none}.dg .c input[type=text]:hover{background:#3c3c3c}.dg .c input[type=text]:focus{background:#494949;color:#fff}.dg .c .slider{background:#303030;cursor:ew-resize}.dg .c .slider-fg{background:#2FA1D6;max-width:100%}.dg .c .slider:hover{background:#3c3c3c}.dg .c .slider:hover .slider-fg{background:#44abda}\n");

css.inject(styleSheet);
var CSS_NAMESPACE = 'dg';
var HIDE_KEY_CODE = 72;
var CLOSE_BUTTON_HEIGHT = 20;
var DEFAULT_DEFAULT_PRESET_NAME = 'Default';
var SUPPORTS_LOCAL_STORAGE = function () {
  try {
    return !!window.localStorage;
  } catch (e) {
    return false;
  }
}();
var SAVE_DIALOGUE = void 0;
var autoPlaceVirgin = true;
var autoPlaceContainer = void 0;
var hide = false;
var hideableGuis = [];
var GUI = function GUI(pars) {
  var _this = this;
  var params = pars || {};
  this.domElement = document.createElement('div');
  this.__ul = document.createElement('ul');
  this.domElement.appendChild(this.__ul);
  dom.addClass(this.domElement, CSS_NAMESPACE);
  this.__folders = {};
  this.__controllers = [];
  this.__rememberedObjects = [];
  this.__rememberedObjectIndecesToControllers = [];
  this.__listening = [];
  params = Common.defaults(params, {
    closeOnTop: false,
    autoPlace: true,
    width: GUI.DEFAULT_WIDTH
  });
  params = Common.defaults(params, {
    resizable: params.autoPlace,
    hideable: params.autoPlace
  });
  if (!Common.isUndefined(params.load)) {
    if (params.preset) {
      params.load.preset = params.preset;
    }
  } else {
    params.load = { preset: DEFAULT_DEFAULT_PRESET_NAME };
  }
  if (Common.isUndefined(params.parent) && params.hideable) {
    hideableGuis.push(this);
  }
  params.resizable = Common.isUndefined(params.parent) && params.resizable;
  if (params.autoPlace && Common.isUndefined(params.scrollable)) {
    params.scrollable = true;
  }
  var useLocalStorage = SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(this, 'isLocal')) === 'true';
  var saveToLocalStorage = void 0;
  var titleRow = void 0;
  Object.defineProperties(this,
  {
    parent: {
      get: function get$$1() {
        return params.parent;
      }
    },
    scrollable: {
      get: function get$$1() {
        return params.scrollable;
      }
    },
    autoPlace: {
      get: function get$$1() {
        return params.autoPlace;
      }
    },
    closeOnTop: {
      get: function get$$1() {
        return params.closeOnTop;
      }
    },
    preset: {
      get: function get$$1() {
        if (_this.parent) {
          return _this.getRoot().preset;
        }
        return params.load.preset;
      },
      set: function set$$1(v) {
        if (_this.parent) {
          _this.getRoot().preset = v;
        } else {
          params.load.preset = v;
        }
        setPresetSelectIndex(this);
        _this.revert();
      }
    },
    width: {
      get: function get$$1() {
        return params.width;
      },
      set: function set$$1(v) {
        params.width = v;
        setWidth(_this, v);
      }
    },
    name: {
      get: function get$$1() {
        return params.name;
      },
      set: function set$$1(v) {
        params.name = v;
        if (titleRow) {
          titleRow.innerHTML = params.name;
        }
      }
    },
    closed: {
      get: function get$$1() {
        return params.closed;
      },
      set: function set$$1(v) {
        params.closed = v;
        if (params.closed) {
          dom.addClass(_this.__ul, GUI.CLASS_CLOSED);
        } else {
          dom.removeClass(_this.__ul, GUI.CLASS_CLOSED);
        }
        this.onResize();
        if (_this.__closeButton) {
          _this.__closeButton.innerHTML = v ? GUI.TEXT_OPEN : GUI.TEXT_CLOSED;
        }
      }
    },
    load: {
      get: function get$$1() {
        return params.load;
      }
    },
    useLocalStorage: {
      get: function get$$1() {
        return useLocalStorage;
      },
      set: function set$$1(bool) {
        if (SUPPORTS_LOCAL_STORAGE) {
          useLocalStorage = bool;
          if (bool) {
            dom.bind(window, 'unload', saveToLocalStorage);
          } else {
            dom.unbind(window, 'unload', saveToLocalStorage);
          }
          localStorage.setItem(getLocalStorageHash(_this, 'isLocal'), bool);
        }
      }
    }
  });
  if (Common.isUndefined(params.parent)) {
    this.closed = params.closed || false;
    dom.addClass(this.domElement, GUI.CLASS_MAIN);
    dom.makeSelectable(this.domElement, false);
    if (SUPPORTS_LOCAL_STORAGE) {
      if (useLocalStorage) {
        _this.useLocalStorage = true;
        var savedGui = localStorage.getItem(getLocalStorageHash(this, 'gui'));
        if (savedGui) {
          params.load = JSON.parse(savedGui);
        }
      }
    }
    this.__closeButton = document.createElement('div');
    this.__closeButton.innerHTML = GUI.TEXT_CLOSED;
    dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BUTTON);
    if (params.closeOnTop) {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_TOP);
      this.domElement.insertBefore(this.__closeButton, this.domElement.childNodes[0]);
    } else {
      dom.addClass(this.__closeButton, GUI.CLASS_CLOSE_BOTTOM);
      this.domElement.appendChild(this.__closeButton);
    }
    dom.bind(this.__closeButton, 'click', function () {
      _this.closed = !_this.closed;
    });
  } else {
    if (params.closed === undefined) {
      params.closed = true;
    }
    var titleRowName = document.createTextNode(params.name);
    dom.addClass(titleRowName, 'controller-name');
    titleRow = addRow(_this, titleRowName);
    var onClickTitle = function onClickTitle(e) {
      e.preventDefault();
      _this.closed = !_this.closed;
      return false;
    };
    dom.addClass(this.__ul, GUI.CLASS_CLOSED);
    dom.addClass(titleRow, 'title');
    dom.bind(titleRow, 'click', onClickTitle);
    if (!params.closed) {
      this.closed = false;
    }
  }
  if (params.autoPlace) {
    if (Common.isUndefined(params.parent)) {
      if (autoPlaceVirgin) {
        autoPlaceContainer = document.createElement('div');
        dom.addClass(autoPlaceContainer, CSS_NAMESPACE);
        dom.addClass(autoPlaceContainer, GUI.CLASS_AUTO_PLACE_CONTAINER);
        document.body.appendChild(autoPlaceContainer);
        autoPlaceVirgin = false;
      }
      autoPlaceContainer.appendChild(this.domElement);
      dom.addClass(this.domElement, GUI.CLASS_AUTO_PLACE);
    }
    if (!this.parent) {
      setWidth(_this, params.width);
    }
  }
  this.__resizeHandler = function () {
    _this.onResizeDebounced();
  };
  dom.bind(window, 'resize', this.__resizeHandler);
  dom.bind(this.__ul, 'webkitTransitionEnd', this.__resizeHandler);
  dom.bind(this.__ul, 'transitionend', this.__resizeHandler);
  dom.bind(this.__ul, 'oTransitionEnd', this.__resizeHandler);
  this.onResize();
  if (params.resizable) {
    addResizeHandle(this);
  }
  saveToLocalStorage = function saveToLocalStorage() {
    if (SUPPORTS_LOCAL_STORAGE && localStorage.getItem(getLocalStorageHash(_this, 'isLocal')) === 'true') {
      localStorage.setItem(getLocalStorageHash(_this, 'gui'), JSON.stringify(_this.getSaveObject()));
    }
  };
  this.saveToLocalStorageIfPossible = saveToLocalStorage;
  function resetWidth() {
    var root = _this.getRoot();
    root.width += 1;
    Common.defer(function () {
      root.width -= 1;
    });
  }
  if (!params.parent) {
    resetWidth();
  }
};
GUI.toggleHide = function () {
  hide = !hide;
  Common.each(hideableGuis, function (gui) {
    gui.domElement.style.display = hide ? 'none' : '';
  });
};
GUI.CLASS_AUTO_PLACE = 'a';
GUI.CLASS_AUTO_PLACE_CONTAINER = 'ac';
GUI.CLASS_MAIN = 'main';
GUI.CLASS_CONTROLLER_ROW = 'cr';
GUI.CLASS_TOO_TALL = 'taller-than-window';
GUI.CLASS_CLOSED = 'closed';
GUI.CLASS_CLOSE_BUTTON = 'close-button';
GUI.CLASS_CLOSE_TOP = 'close-top';
GUI.CLASS_CLOSE_BOTTOM = 'close-bottom';
GUI.CLASS_DRAG = 'drag';
GUI.DEFAULT_WIDTH = 245;
GUI.TEXT_CLOSED = 'Close Controls';
GUI.TEXT_OPEN = 'Open Controls';
GUI._keydownHandler = function (e) {
  if (document.activeElement.type !== 'text' && (e.which === HIDE_KEY_CODE || e.keyCode === HIDE_KEY_CODE)) {
    GUI.toggleHide();
  }
};
dom.bind(window, 'keydown', GUI._keydownHandler, false);
Common.extend(GUI.prototype,
{
  add: function add(object, property) {
    return _add(this, object, property, {
      factoryArgs: Array.prototype.slice.call(arguments, 2)
    });
  },
  addColor: function addColor(object, property) {
    return _add(this, object, property, {
      color: true
    });
  },
  remove: function remove(controller) {
    this.__ul.removeChild(controller.__li);
    this.__controllers.splice(this.__controllers.indexOf(controller), 1);
    var _this = this;
    Common.defer(function () {
      _this.onResize();
    });
  },
  destroy: function destroy() {
    if (this.parent) {
      throw new Error('Only the root GUI should be removed with .destroy(). ' + 'For subfolders, use gui.removeFolder(folder) instead.');
    }
    if (this.autoPlace) {
      autoPlaceContainer.removeChild(this.domElement);
    }
    var _this = this;
    Common.each(this.__folders, function (subfolder) {
      _this.removeFolder(subfolder);
    });
    dom.unbind(window, 'keydown', GUI._keydownHandler, false);
    removeListeners(this);
  },
  addFolder: function addFolder(name) {
    if (this.__folders[name] !== undefined) {
      throw new Error('You already have a folder in this GUI by the' + ' name "' + name + '"');
    }
    var newGuiParams = { name: name, parent: this };
    newGuiParams.autoPlace = this.autoPlace;
    if (this.load &&
    this.load.folders &&
    this.load.folders[name]) {
      newGuiParams.closed = this.load.folders[name].closed;
      newGuiParams.load = this.load.folders[name];
    }
    var gui = new GUI(newGuiParams);
    this.__folders[name] = gui;
    var li = addRow(this, gui.domElement);
    dom.addClass(li, 'folder');
    return gui;
  },
  removeFolder: function removeFolder(folder) {
    this.__ul.removeChild(folder.domElement.parentElement);
    delete this.__folders[folder.name];
    if (this.load &&
    this.load.folders &&
    this.load.folders[folder.name]) {
      delete this.load.folders[folder.name];
    }
    removeListeners(folder);
    var _this = this;
    Common.each(folder.__folders, function (subfolder) {
      folder.removeFolder(subfolder);
    });
    Common.defer(function () {
      _this.onResize();
    });
  },
  open: function open() {
    this.closed = false;
  },
  close: function close() {
    this.closed = true;
  },
  hide: function hide() {
    this.domElement.style.display = 'none';
  },
  show: function show() {
    this.domElement.style.display = '';
  },
  onResize: function onResize() {
    var root = this.getRoot();
    if (root.scrollable) {
      var top = dom.getOffset(root.__ul).top;
      var h = 0;
      Common.each(root.__ul.childNodes, function (node) {
        if (!(root.autoPlace && node === root.__save_row)) {
          h += dom.getHeight(node);
        }
      });
      if (window.innerHeight - top - CLOSE_BUTTON_HEIGHT < h) {
        dom.addClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = window.innerHeight - top - CLOSE_BUTTON_HEIGHT + 'px';
      } else {
        dom.removeClass(root.domElement, GUI.CLASS_TOO_TALL);
        root.__ul.style.height = 'auto';
      }
    }
    if (root.__resize_handle) {
      Common.defer(function () {
        root.__resize_handle.style.height = root.__ul.offsetHeight + 'px';
      });
    }
    if (root.__closeButton) {
      root.__closeButton.style.width = root.width + 'px';
    }
  },
  onResizeDebounced: Common.debounce(function () {
    this.onResize();
  }, 50),
  remember: function remember() {
    if (Common.isUndefined(SAVE_DIALOGUE)) {
      SAVE_DIALOGUE = new CenteredDiv();
      SAVE_DIALOGUE.domElement.innerHTML = saveDialogContents;
    }
    if (this.parent) {
      throw new Error('You can only call remember on a top level GUI.');
    }
    var _this = this;
    Common.each(Array.prototype.slice.call(arguments), function (object) {
      if (_this.__rememberedObjects.length === 0) {
        addSaveMenu(_this);
      }
      if (_this.__rememberedObjects.indexOf(object) === -1) {
        _this.__rememberedObjects.push(object);
      }
    });
    if (this.autoPlace) {
      setWidth(this, this.width);
    }
  },
  getRoot: function getRoot() {
    var gui = this;
    while (gui.parent) {
      gui = gui.parent;
    }
    return gui;
  },
  getSaveObject: function getSaveObject() {
    var toReturn = this.load;
    toReturn.closed = this.closed;
    if (this.__rememberedObjects.length > 0) {
      toReturn.preset = this.preset;
      if (!toReturn.remembered) {
        toReturn.remembered = {};
      }
      toReturn.remembered[this.preset] = getCurrentPreset(this);
    }
    toReturn.folders = {};
    Common.each(this.__folders, function (element, key) {
      toReturn.folders[key] = element.getSaveObject();
    });
    return toReturn;
  },
  save: function save() {
    if (!this.load.remembered) {
      this.load.remembered = {};
    }
    this.load.remembered[this.preset] = getCurrentPreset(this);
    markPresetModified(this, false);
    this.saveToLocalStorageIfPossible();
  },
  saveAs: function saveAs(presetName) {
    if (!this.load.remembered) {
      this.load.remembered = {};
      this.load.remembered[DEFAULT_DEFAULT_PRESET_NAME] = getCurrentPreset(this, true);
    }
    this.load.remembered[presetName] = getCurrentPreset(this);
    this.preset = presetName;
    addPresetOption(this, presetName, true);
    this.saveToLocalStorageIfPossible();
  },
  revert: function revert(gui) {
    Common.each(this.__controllers, function (controller) {
      if (!this.getRoot().load.remembered) {
        controller.setValue(controller.initialValue);
      } else {
        recallSavedValue(gui || this.getRoot(), controller);
      }
      if (controller.__onFinishChange) {
        controller.__onFinishChange.call(controller, controller.getValue());
      }
    }, this);
    Common.each(this.__folders, function (folder) {
      folder.revert(folder);
    });
    if (!gui) {
      markPresetModified(this.getRoot(), false);
    }
  },
  listen: function listen(controller) {
    var init = this.__listening.length === 0;
    this.__listening.push(controller);
    if (init) {
      updateDisplays(this.__listening);
    }
  },
  updateDisplay: function updateDisplay() {
    Common.each(this.__controllers, function (controller) {
      controller.updateDisplay();
    });
    Common.each(this.__folders, function (folder) {
      folder.updateDisplay();
    });
  }
});
function addRow(gui, newDom, liBefore) {
  var li = document.createElement('li');
  if (newDom) {
    li.appendChild(newDom);
  }
  if (liBefore) {
    gui.__ul.insertBefore(li, liBefore);
  } else {
    gui.__ul.appendChild(li);
  }
  gui.onResize();
  return li;
}
function removeListeners(gui) {
  dom.unbind(window, 'resize', gui.__resizeHandler);
  if (gui.saveToLocalStorageIfPossible) {
    dom.unbind(window, 'unload', gui.saveToLocalStorageIfPossible);
  }
}
function markPresetModified(gui, modified) {
  var opt = gui.__preset_select[gui.__preset_select.selectedIndex];
  if (modified) {
    opt.innerHTML = opt.value + '*';
  } else {
    opt.innerHTML = opt.value;
  }
}
function augmentController(gui, li, controller) {
  controller.__li = li;
  controller.__gui = gui;
  Common.extend(controller,                                   {
    options: function options(_options) {
      if (arguments.length > 1) {
        var nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: nextSibling,
          factoryArgs: [Common.toArray(arguments)]
        });
      }
      if (Common.isArray(_options) || Common.isObject(_options)) {
        var _nextSibling = controller.__li.nextElementSibling;
        controller.remove();
        return _add(gui, controller.object, controller.property, {
          before: _nextSibling,
          factoryArgs: [_options]
        });
      }
    },
    name: function name(_name) {
      controller.__li.firstElementChild.firstElementChild.innerHTML = _name;
      return controller;
    },
    listen: function listen() {
      controller.__gui.listen(controller);
      return controller;
    },
    remove: function remove() {
      controller.__gui.remove(controller);
      return controller;
    }
  });
  if (controller instanceof NumberControllerSlider) {
    var box = new NumberControllerBox(controller.object, controller.property, { min: controller.__min, max: controller.__max, step: controller.__step });
    Common.each(['updateDisplay', 'onChange', 'onFinishChange', 'step', 'min', 'max'], function (method) {
      var pc = controller[method];
      var pb = box[method];
      controller[method] = box[method] = function () {
        var args = Array.prototype.slice.call(arguments);
        pb.apply(box, args);
        return pc.apply(controller, args);
      };
    });
    dom.addClass(li, 'has-slider');
    controller.domElement.insertBefore(box.domElement, controller.domElement.firstElementChild);
  } else if (controller instanceof NumberControllerBox) {
    var r = function r(returned) {
      if (Common.isNumber(controller.__min) && Common.isNumber(controller.__max)) {
        var oldName = controller.__li.firstElementChild.firstElementChild.innerHTML;
        var wasListening = controller.__gui.__listening.indexOf(controller) > -1;
        controller.remove();
        var newController = _add(gui, controller.object, controller.property, {
          before: controller.__li.nextElementSibling,
          factoryArgs: [controller.__min, controller.__max, controller.__step]
        });
        newController.name(oldName);
        if (wasListening) newController.listen();
        return newController;
      }
      return returned;
    };
    controller.min = Common.compose(r, controller.min);
    controller.max = Common.compose(r, controller.max);
  } else if (controller instanceof BooleanController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__checkbox, 'click');
    });
    dom.bind(controller.__checkbox, 'click', function (e) {
      e.stopPropagation();
    });
  } else if (controller instanceof FunctionController) {
    dom.bind(li, 'click', function () {
      dom.fakeEvent(controller.__button, 'click');
    });
    dom.bind(li, 'mouseover', function () {
      dom.addClass(controller.__button, 'hover');
    });
    dom.bind(li, 'mouseout', function () {
      dom.removeClass(controller.__button, 'hover');
    });
  } else if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
    controller.updateDisplay = Common.compose(function (val) {
      li.style.borderLeftColor = controller.__color.toString();
      return val;
    }, controller.updateDisplay);
    controller.updateDisplay();
  }
  controller.setValue = Common.compose(function (val) {
    if (gui.getRoot().__preset_select && controller.isModified()) {
      markPresetModified(gui.getRoot(), true);
    }
    return val;
  }, controller.setValue);
}
function recallSavedValue(gui, controller) {
  var root = gui.getRoot();
  var matchedIndex = root.__rememberedObjects.indexOf(controller.object);
  if (matchedIndex !== -1) {
    var controllerMap = root.__rememberedObjectIndecesToControllers[matchedIndex];
    if (controllerMap === undefined) {
      controllerMap = {};
      root.__rememberedObjectIndecesToControllers[matchedIndex] = controllerMap;
    }
    controllerMap[controller.property] = controller;
    if (root.load && root.load.remembered) {
      var presetMap = root.load.remembered;
      var preset = void 0;
      if (presetMap[gui.preset]) {
        preset = presetMap[gui.preset];
      } else if (presetMap[DEFAULT_DEFAULT_PRESET_NAME]) {
        preset = presetMap[DEFAULT_DEFAULT_PRESET_NAME];
      } else {
        return;
      }
      if (preset[matchedIndex] && preset[matchedIndex][controller.property] !== undefined) {
        var value = preset[matchedIndex][controller.property];
        controller.initialValue = value;
        controller.setValue(value);
      }
    }
  }
}
function _add(gui, object, property, params) {
  if (object[property] === undefined) {
    throw new Error('Object "' + object + '" has no property "' + property + '"');
  }
  var controller = void 0;
  if (params.color) {
    controller = new ColorController(object, property);
  } else {
    var factoryArgs = [object, property].concat(params.factoryArgs);
    controller = ControllerFactory.apply(gui, factoryArgs);
  }
  if (params.before instanceof Controller) {
    params.before = params.before.__li;
  }
  recallSavedValue(gui, controller);
  dom.addClass(controller.domElement, 'c');
  var name = document.createElement('span');
  dom.addClass(name, 'property-name');
  name.innerHTML = controller.property;
  var container = document.createElement('div');
  container.appendChild(name);
  container.appendChild(controller.domElement);
  var li = addRow(gui, container, params.before);
  dom.addClass(li, GUI.CLASS_CONTROLLER_ROW);
  if (controller instanceof ColorController) {
    dom.addClass(li, 'color');
  } else {
    dom.addClass(li, _typeof(controller.getValue()));
  }
  augmentController(gui, li, controller);
  gui.__controllers.push(controller);
  return controller;
}
function getLocalStorageHash(gui, key) {
  return document.location.href + '.' + key;
}
function addPresetOption(gui, name, setSelected) {
  var opt = document.createElement('option');
  opt.innerHTML = name;
  opt.value = name;
  gui.__preset_select.appendChild(opt);
  if (setSelected) {
    gui.__preset_select.selectedIndex = gui.__preset_select.length - 1;
  }
}
function showHideExplain(gui, explain) {
  explain.style.display = gui.useLocalStorage ? 'block' : 'none';
}
function addSaveMenu(gui) {
  var div = gui.__save_row = document.createElement('li');
  dom.addClass(gui.domElement, 'has-save');
  gui.__ul.insertBefore(div, gui.__ul.firstChild);
  dom.addClass(div, 'save-row');
  var gears = document.createElement('span');
  gears.innerHTML = '&nbsp;';
  dom.addClass(gears, 'button gears');
  var button = document.createElement('span');
  button.innerHTML = 'Save';
  dom.addClass(button, 'button');
  dom.addClass(button, 'save');
  var button2 = document.createElement('span');
  button2.innerHTML = 'New';
  dom.addClass(button2, 'button');
  dom.addClass(button2, 'save-as');
  var button3 = document.createElement('span');
  button3.innerHTML = 'Revert';
  dom.addClass(button3, 'button');
  dom.addClass(button3, 'revert');
  var select = gui.__preset_select = document.createElement('select');
  if (gui.load && gui.load.remembered) {
    Common.each(gui.load.remembered, function (value, key) {
      addPresetOption(gui, key, key === gui.preset);
    });
  } else {
    addPresetOption(gui, DEFAULT_DEFAULT_PRESET_NAME, false);
  }
  dom.bind(select, 'change', function () {
    for (var index = 0; index < gui.__preset_select.length; index++) {
      gui.__preset_select[index].innerHTML = gui.__preset_select[index].value;
    }
    gui.preset = this.value;
  });
  div.appendChild(select);
  div.appendChild(gears);
  div.appendChild(button);
  div.appendChild(button2);
  div.appendChild(button3);
  if (SUPPORTS_LOCAL_STORAGE) {
    var explain = document.getElementById('dg-local-explain');
    var localStorageCheckBox = document.getElementById('dg-local-storage');
    var saveLocally = document.getElementById('dg-save-locally');
    saveLocally.style.display = 'block';
    if (localStorage.getItem(getLocalStorageHash(gui, 'isLocal')) === 'true') {
      localStorageCheckBox.setAttribute('checked', 'checked');
    }
    showHideExplain(gui, explain);
    dom.bind(localStorageCheckBox, 'change', function () {
      gui.useLocalStorage = !gui.useLocalStorage;
      showHideExplain(gui, explain);
    });
  }
  var newConstructorTextArea = document.getElementById('dg-new-constructor');
  dom.bind(newConstructorTextArea, 'keydown', function (e) {
    if (e.metaKey && (e.which === 67 || e.keyCode === 67)) {
      SAVE_DIALOGUE.hide();
    }
  });
  dom.bind(gears, 'click', function () {
    newConstructorTextArea.innerHTML = JSON.stringify(gui.getSaveObject(), undefined, 2);
    SAVE_DIALOGUE.show();
    newConstructorTextArea.focus();
    newConstructorTextArea.select();
  });
  dom.bind(button, 'click', function () {
    gui.save();
  });
  dom.bind(button2, 'click', function () {
    var presetName = prompt('Enter a new preset name.');
    if (presetName) {
      gui.saveAs(presetName);
    }
  });
  dom.bind(button3, 'click', function () {
    gui.revert();
  });
}
function addResizeHandle(gui) {
  var pmouseX = void 0;
  gui.__resize_handle = document.createElement('div');
  Common.extend(gui.__resize_handle.style, {
    width: '6px',
    marginLeft: '-3px',
    height: '200px',
    cursor: 'ew-resize',
    position: 'absolute'
  });
  function drag(e) {
    e.preventDefault();
    gui.width += pmouseX - e.clientX;
    gui.onResize();
    pmouseX = e.clientX;
    return false;
  }
  function dragStop() {
    dom.removeClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.unbind(window, 'mousemove', drag);
    dom.unbind(window, 'mouseup', dragStop);
  }
  function dragStart(e) {
    e.preventDefault();
    pmouseX = e.clientX;
    dom.addClass(gui.__closeButton, GUI.CLASS_DRAG);
    dom.bind(window, 'mousemove', drag);
    dom.bind(window, 'mouseup', dragStop);
    return false;
  }
  dom.bind(gui.__resize_handle, 'mousedown', dragStart);
  dom.bind(gui.__closeButton, 'mousedown', dragStart);
  gui.domElement.insertBefore(gui.__resize_handle, gui.domElement.firstElementChild);
}
function setWidth(gui, w) {
  gui.domElement.style.width = w + 'px';
  if (gui.__save_row && gui.autoPlace) {
    gui.__save_row.style.width = w + 'px';
  }
  if (gui.__closeButton) {
    gui.__closeButton.style.width = w + 'px';
  }
}
function getCurrentPreset(gui, useInitialValues) {
  var toReturn = {};
  Common.each(gui.__rememberedObjects, function (val, index) {
    var savedValues = {};
    var controllerMap = gui.__rememberedObjectIndecesToControllers[index];
    Common.each(controllerMap, function (controller, property) {
      savedValues[property] = useInitialValues ? controller.initialValue : controller.getValue();
    });
    toReturn[index] = savedValues;
  });
  return toReturn;
}
function setPresetSelectIndex(gui) {
  for (var index = 0; index < gui.__preset_select.length; index++) {
    if (gui.__preset_select[index].value === gui.preset) {
      gui.__preset_select.selectedIndex = index;
    }
  }
}
function updateDisplays(controllerArray) {
  if (controllerArray.length !== 0) {
    requestAnimationFrame$1.call(window, function () {
      updateDisplays(controllerArray);
    });
  }
  Common.each(controllerArray, function (c) {
    c.updateDisplay();
  });
}

var color = {
  Color: Color,
  math: ColorMath,
  interpret: interpret
};
var controllers = {
  Controller: Controller,
  BooleanController: BooleanController,
  OptionController: OptionController,
  StringController: StringController,
  NumberController: NumberController,
  NumberControllerBox: NumberControllerBox,
  NumberControllerSlider: NumberControllerSlider,
  FunctionController: FunctionController,
  ColorController: ColorController
};
var dom$1 = { dom: dom };
var gui = { GUI: GUI };
var GUI$1 = GUI;
var index = {
  color: color,
  controllers: controllers,
  dom: dom$1,
  gui: gui,
  GUI: GUI$1
};

exports.color = color;
exports.controllers = controllers;
exports.dom = dom$1;
exports.gui = gui;
exports.GUI = GUI$1;
exports['default'] = index;

Object.defineProperty(exports, '__esModule', { value: true });

})));


},{}],2:[function(require,module,exports){
(function (global){
/* interact.js 1.9.8 | https://raw.github.com/taye/interact.js/master/LICENSE */
!function(t){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{("undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:this).interact=t()}}(function(){function t(e){var n;return function(t){return n||e(n={exports:{},parent:t},n.exports),n.exports}}var k=t(function(t,e){"use strict";function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.Interactable=void 0;var u=r(S),l=n(C),s=n(V),c=n(ct),f=r(w),p=n(ft),i=n(bt),d=m({});function n(t){return t&&t.__esModule?t:{default:t}}function v(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return v=function(){return t},t}function r(t){if(t&&t.__esModule)return t;if(null===t||"object"!==a(t)&&"function"!=typeof t)return{default:t};var e=v();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function y(t,e,n){return e&&o(t.prototype,e),n&&o(t,n),t}function h(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var g=function(){function o(t,e,n,r){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),this._scopeEvents=r,h(this,"options",void 0),h(this,"_actions",void 0),h(this,"target",void 0),h(this,"events",new i.default),h(this,"_context",void 0),h(this,"_win",void 0),h(this,"_doc",void 0),this._actions=e.actions,this.target=t,this._context=e.context||n,this._win=(0,O.getWindow)((0,$.trySelector)(t)?this._context:t),this._doc=this._win.document,this.set(e)}return y(o,[{key:"_defaults",get:function(){return{base:{},perAction:{},actions:{}}}}]),y(o,[{key:"setOnEvents",value:function(t,e){return f.func(e.onstart)&&this.on("".concat(t,"start"),e.onstart),f.func(e.onmove)&&this.on("".concat(t,"move"),e.onmove),f.func(e.onend)&&this.on("".concat(t,"end"),e.onend),f.func(e.oninertiastart)&&this.on("".concat(t,"inertiastart"),e.oninertiastart),this}},{key:"updatePerActionListeners",value:function(t,e,n){(f.array(e)||f.object(e))&&this.off(t,e),(f.array(n)||f.object(n))&&this.on(t,n)}},{key:"setPerAction",value:function(t,e){var n=this._defaults;for(var r in e){var o=r,i=this.options[t],a=e[o];"listeners"===o&&this.updatePerActionListeners(t,i.listeners,a),f.array(a)?i[o]=u.from(a):f.plainObject(a)?(i[o]=(0,c.default)(i[o]||{},(0,s.default)(a)),f.object(n.perAction[o])&&"enabled"in n.perAction[o]&&(i[o].enabled=!1!==a.enabled)):f.bool(a)&&f.object(n.perAction[o])?i[o].enabled=a:i[o]=a}}},{key:"getRect",value:function(t){return t=t||(f.element(this.target)?this.target:null),f.string(this.target)&&(t=t||this._context.querySelector(this.target)),(0,$.getElementRect)(t)}},{key:"rectChecker",value:function(t){return f.func(t)?(this.getRect=t,this):null===t?(delete this.getRect,this):this.getRect}},{key:"_backCompatOption",value:function(t,e){if((0,$.trySelector)(e)||f.object(e)){for(var n in this.options[t]=e,this._actions.map)this.options[n][t]=e;return this}return this.options[t]}},{key:"origin",value:function(t){return this._backCompatOption("origin",t)}},{key:"deltaSource",value:function(t){return"page"===t||"client"===t?(this.options.deltaSource=t,this):this.options.deltaSource}},{key:"context",value:function(){return this._context}},{key:"inContext",value:function(t){return this._context===t.ownerDocument||(0,$.nodeContains)(this._context,t)}},{key:"testIgnoreAllow",value:function(t,e,n){return!this.testIgnore(t.ignoreFrom,e,n)&&this.testAllow(t.allowFrom,e,n)}},{key:"testAllow",value:function(t,e,n){return!t||!!f.element(n)&&(f.string(t)?(0,$.matchesUpTo)(n,t,e):!!f.element(t)&&(0,$.nodeContains)(t,n))}},{key:"testIgnore",value:function(t,e,n){return!(!t||!f.element(n))&&(f.string(t)?(0,$.matchesUpTo)(n,t,e):!!f.element(t)&&(0,$.nodeContains)(t,n))}},{key:"fire",value:function(t){return this.events.fire(t),this}},{key:"_onOff",value:function(t,e,n,r){f.object(e)&&!f.array(e)&&(r=n,n=null);var o="on"===t?"add":"remove",i=(0,p.default)(e,n);for(var a in i){"wheel"===a&&(a=l.default.wheelEvent);for(var u=0;u<i[a].length;u++){var s=i[a][u];(0,d.isNonNativeEvent)(a,this._actions)?this.events[t](a,s):f.string(this.target)?this._scopeEvents["".concat(o,"Delegate")](this.target,this._context,a,s,r):this._scopeEvents[o](this.target,a,s,r)}}return this}},{key:"on",value:function(t,e,n){return this._onOff("on",t,e,n)}},{key:"off",value:function(t,e,n){return this._onOff("off",t,e,n)}},{key:"set",value:function(t){var e=this._defaults;for(var n in f.object(t)||(t={}),this.options=(0,s.default)(e.base),this._actions.methodDict){var r=n,o=this._actions.methodDict[r];this.options[r]={},this.setPerAction(r,(0,c.default)((0,c.default)({},e.perAction),e.actions[r])),this[o](t[r])}for(var i in t)f.func(this[i])&&this[i](t[i]);return this}},{key:"unset",value:function(){if(f.string(this.target))for(var t in this._scopeEvents.delegatedEvents)for(var e=this._scopeEvents.delegatedEvents[t],n=e.length-1;0<=n;n--){var r=e[n],o=r.selector,i=r.context,a=r.listeners;o===this.target&&i===this._context&&e.splice(n,1);for(var u=a.length-1;0<=u;u--)this._scopeEvents.removeDelegate(this.target,this._context,t,a[u][0],a[u][1])}else this._scopeEvents.remove(this.target,"all")}}]),o}(),b=e.Interactable=g;e.default=b}),m=t(function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.isNonNativeEvent=function(t,e){if(e.phaselessTypes[t])return!0;for(var n in e.map)if(0===t.indexOf(n)&&t.substr(n.length)in e.phases)return!0;return!1},e.initScope=M,e.Scope=e.default=void 0;var n=d(D),r=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==v(t)&&"function"!=typeof t)return{default:t};var e=p();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),o=d(bt),i=d(We),a=d(T({})),u=d(k({})),s=d(Ze),l=d(ze),c=d(cn),f=d(E({}));function p(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return p=function(){return t},t}function d(t){return t&&t.__esModule?t:{default:t}}function v(t){return(v="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function y(t,e){return!e||"object"!==v(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function h(t,e,n){return(h="undefined"!=typeof Reflect&&Reflect.get?Reflect.get:function(t,e,n){var r=function(t,e){for(;!Object.prototype.hasOwnProperty.call(t,e)&&null!==(t=g(t)););return t}(t,e);if(r){var o=Object.getOwnPropertyDescriptor(r,e);return o.get?o.get.call(n):o.value}})(t,e,n||t)}function g(t){return(g=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function b(t,e){return(b=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function m(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}function O(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function w(t,e,n){return e&&O(t.prototype,e),n&&O(t,n),t}function _(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var P=r.win,x=r.browser,S=r.raf,j=function(){function t(){var e=this;m(this,t),_(this,"id","__interact_scope_".concat(Math.floor(100*Math.random()))),_(this,"isInitialized",!1),_(this,"listenerMaps",[]),_(this,"browser",x),_(this,"utils",r),_(this,"defaults",r.clone(l.default)),_(this,"Eventable",o.default),_(this,"actions",{map:{},phases:{start:!0,move:!0,end:!0},methodDict:{},phaselessTypes:{}}),_(this,"interactStatic",new a.default(this)),_(this,"InteractEvent",i.default),_(this,"Interactable",void 0),_(this,"interactables",new s.default(this)),_(this,"_win",void 0),_(this,"document",void 0),_(this,"window",void 0),_(this,"documents",[]),_(this,"_plugins",{list:[],map:{}}),_(this,"onWindowUnload",function(t){return e.removeDocument(t.target)});var n=this;this.Interactable=function(){function e(){return m(this,e),y(this,g(e).apply(this,arguments))}return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&b(t,e)}(e,u["default"]),w(e,[{key:"set",value:function(t){return h(g(e.prototype),"set",this).call(this,t),n.fire("interactable:set",{options:t,interactable:this}),this}},{key:"unset",value:function(){h(g(e.prototype),"unset",this).call(this),n.interactables.list.splice(n.interactables.list.indexOf(this),1),n.fire("interactable:unset",{interactable:this})}},{key:"_defaults",get:function(){return n.defaults}}]),e}()}return w(t,[{key:"addListeners",value:function(t,e){this.listenerMaps.push({id:e,map:t})}},{key:"fire",value:function(t,e){for(var n=0;n<this.listenerMaps.length;n++){var r=this.listenerMaps[n].map[t];if(r&&!1===r(e,this,t))return!1}}},{key:"init",value:function(t){return this.isInitialized?this:M(this,t)}},{key:"pluginIsInstalled",value:function(t){return this._plugins.map[t.id]||-1!==this._plugins.list.indexOf(t)}},{key:"usePlugin",value:function(t,e){if(this.pluginIsInstalled(t))return this;if(t.id&&(this._plugins.map[t.id]=t),this._plugins.list.push(t),t.install&&t.install(this,e),t.listeners&&t.before){for(var n=0,r=this.listenerMaps.length,o=t.before.reduce(function(t,e){return t[e]=!0,t},{});n<r;n++){if(o[this.listenerMaps[n].id])break}this.listenerMaps.splice(n,0,{id:t.id,map:t.listeners})}else t.listeners&&this.listenerMaps.push({id:t.id,map:t.listeners});return this}},{key:"addDocument",value:function(t,e){if(-1!==this.getDocIndex(t))return!1;var n=P.getWindow(t);e=e?r.extend({},e):{},this.documents.push({doc:t,options:e}),this.events.documents.push(t),t!==this.document&&this.events.add(n,"unload",this.onWindowUnload),this.fire("scope:add-document",{doc:t,window:n,scope:this,options:e})}},{key:"removeDocument",value:function(t){var e=this.getDocIndex(t),n=P.getWindow(t),r=this.documents[e].options;this.events.remove(n,"unload",this.onWindowUnload),this.documents.splice(e,1),this.events.documents.splice(e,1),this.fire("scope:remove-document",{doc:t,window:n,scope:this,options:r})}},{key:"getDocIndex",value:function(t){for(var e=0;e<this.documents.length;e++)if(this.documents[e].doc===t)return e;return-1}},{key:"getDocOptions",value:function(t){var e=this.getDocIndex(t);return-1===e?null:this.documents[e].options}},{key:"now",value:function(){return(this.window.Date||Date).now()}}]),t}();function M(t,e){return t.isInitialized=!0,P.init(e),n.default.init(e),x.init(e),S.init(e),t.window=e,t.document=e.document,t.usePlugin(f.default),t.usePlugin(c.default),t}e.Scope=e.default=j}),E=t(function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;var _=n(C),u=n(D),P=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==c(t)&&"function"!=typeof t)return{default:t};var e=a();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(zt),s=n(En),l=n(Un),o=n(tr);n(m({}));function a(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return a=function(){return t},t}function n(t){return t&&t.__esModule?t:{default:t}}function c(t){return(c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function x(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function f(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function p(t,e){return!e||"object"!==c(e)&&"function"!=typeof e?function(t){if(void 0!==t)return t;throw new ReferenceError("this hasn't been initialised - super() hasn't been called")}(t):e}function d(t){return(d=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function v(t,e){return(v=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}var y=["pointerDown","pointerMove","pointerUp","updatePointer","removePointer","windowBlur"];function h(O,w){return function(t){var e=w.interactions.list,n=P.getPointerType(t),r=x(P.getEventTargets(t),2),o=r[0],i=r[1],a=[];if(/^touch/.test(t.type)){w.prevTouchTime=w.now();for(var u=0;u<t.changedTouches.length;u++){s=t.changedTouches[u];var s,l={pointer:s,pointerId:P.getPointerId(s),pointerType:n,eventType:t.type,eventTarget:o,curEventTarget:i,scope:w},c=S(l);a.push([l.pointer,l.eventTarget,l.curEventTarget,c])}}else{var f=!1;if(!_.default.supportsPointerEvent&&/mouse/.test(t.type)){for(var p=0;p<e.length&&!f;p++)f="mouse"!==e[p].pointerType&&e[p].pointerIsDown;f=f||w.now()-w.prevTouchTime<500||0===t.timeStamp}if(!f){var d={pointer:t,pointerId:P.getPointerId(t),pointerType:n,eventType:t.type,curEventTarget:i,eventTarget:o,scope:w},v=S(d);a.push([d.pointer,d.eventTarget,d.curEventTarget,v])}}for(var y=0;y<a.length;y++){var h=x(a[y],4),g=h[0],b=h[1],m=h[2];h[3][O](g,t,b,m)}}}function S(t){var e=t.pointerType,n=t.scope,r={interaction:o.default.search(t),searchDetails:t};return n.fire("interactions:find",r),r.interaction||n.interactions.new({pointerType:e})}function r(t,e){var n=t.doc,r=t.scope,o=t.options,i=r.interactions.docEvents,a=r.events,u=a[e];for(var s in r.browser.isIOS&&!o.events&&(o.events={passive:!1}),a.delegatedEvents)u(n,s,a.delegateListener),u(n,s,a.delegateUseCapture,!0);for(var l=o&&o.events,c=0;c<i.length;c++){var f;f=i[c];u(n,f.type,f.listener,l)}}var i={id:"core/interactions",install:function(o){for(var t={},e=0;e<y.length;e++){var n;n=y[e];t[n]=h(n,o)}var r,i=_.default.pEventTypes;function a(){for(var t=0;t<o.interactions.list.length;t++){var e=o.interactions.list[t];if(e.pointerIsDown&&"touch"===e.pointerType&&!e._interacting)for(var n=function(){var n=e.pointers[r];o.documents.some(function(t){var e=t.doc;return(0,$.nodeContains)(e,n.downTarget)})||e.removePointer(n.pointer,n.event)},r=0;r<e.pointers.length;r++){n()}}}(r=u.default.PointerEvent?[{type:i.down,listener:a},{type:i.down,listener:t.pointerDown},{type:i.move,listener:t.pointerMove},{type:i.up,listener:t.pointerUp},{type:i.cancel,listener:t.pointerUp}]:[{type:"mousedown",listener:t.pointerDown},{type:"mousemove",listener:t.pointerMove},{type:"mouseup",listener:t.pointerUp},{type:"touchstart",listener:a},{type:"touchstart",listener:t.pointerDown},{type:"touchmove",listener:t.pointerMove},{type:"touchend",listener:t.pointerUp},{type:"touchcancel",listener:t.pointerUp}]).push({type:"blur",listener:function(t){for(var e=0;e<o.interactions.list.length;e++){o.interactions.list[e].documentBlur(t)}}}),o.prevTouchTime=0,o.Interaction=function(){function t(){return function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,t),p(this,d(t).apply(this,arguments))}var e,n,r;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&v(t,e)}(t,s["default"]),e=t,(n=[{key:"_now",value:function(){return o.now()}},{key:"pointerMoveTolerance",get:function(){return o.interactions.pointerMoveTolerance},set:function(t){o.interactions.pointerMoveTolerance=t}}])&&f(e.prototype,n),r&&f(e,r),t}(),o.interactions={list:[],new:function(t){t.scopeFire=function(t,e){return o.fire(t,e)};var e=new o.Interaction(t);return o.interactions.list.push(e),e},listeners:t,docEvents:r,pointerMoveTolerance:1},o.usePlugin(l.default)},listeners:{"scope:add-document":function(t){return r(t,"add")},"scope:remove-document":function(t){return r(t,"remove")},"interactable:unset":function(t,e){for(var n=t.interactable,r=e.interactions.list.length-1;0<=r;r--){var o=e.interactions.list[r];o.interactable===n&&(o.stop(),e.fire("interactions:destroy",{interaction:o}),o.destroy(),2<e.interactions.list.length&&e.interactions.list.splice(r,1))}}},onDocSignal:r,doOnInteractions:h,methodNames:y};e.default=i}),T=t(function(t,e){"use strict";function a(t){return(a="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(e,"__esModule",{value:!0}),e.default=e.InteractStatic=void 0;var n,r=(n=C)&&n.__esModule?n:{default:n},u=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==a(t)&&"function"!=typeof t)return{default:t};var e=l();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),s=m({});function l(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return l=function(){return t},t}function o(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function c(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var i=function(){function a(r){var o=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,a),this.scope=r,c(this,"getPointerAverage",u.pointer.pointerAverage),c(this,"getTouchBBox",u.pointer.touchBBox),c(this,"getTouchDistance",u.pointer.touchDistance),c(this,"getTouchAngle",u.pointer.touchAngle),c(this,"getElementRect",u.dom.getElementRect),c(this,"getElementClientRect",u.dom.getElementClientRect),c(this,"matchesSelector",u.dom.matchesSelector),c(this,"closest",u.dom.closest),c(this,"globalEvents",{}),c(this,"dynamicDrop",void 0),c(this,"version","1.9.8"),c(this,"interact",void 0);for(var t=this.constructor.prototype,e=function(t,e){var n=r.interactables.get(t,e);return n||((n=r.interactables.new(t,e)).events.global=o.globalEvents),n},n=0;n<Object.getOwnPropertyNames(this.constructor.prototype).length;n++){var i;i=Object.getOwnPropertyNames(this.constructor.prototype)[n];e[i]=t[i]}return u.extend(e,this),e.constructor=this.constructor,this.interact=e}var t,e,n;return t=a,(e=[{key:"use",value:function(t,e){return this.scope.usePlugin(t,e),this}},{key:"isSet",value:function(t,e){return!!this.scope.interactables.get(t,e&&e.context)}},{key:"on",value:function(t,e,n){if(u.is.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),u.is.array(t)){for(var r=0;r<t.length;r++){var o=t[r];this.on(o,e,n)}return this}if(u.is.object(t)){for(var i in t)this.on(i,t[i],e);return this}return(0,s.isNonNativeEvent)(t,this.scope.actions)?this.globalEvents[t]?this.globalEvents[t].push(e):this.globalEvents[t]=[e]:this.scope.events.add(this.scope.document,t,e,{options:n}),this}},{key:"off",value:function(t,e,n){if(u.is.string(t)&&-1!==t.search(" ")&&(t=t.trim().split(/ +/)),u.is.array(t)){for(var r=0;r<t.length;r++){var o=t[r];this.off(o,e,n)}return this}if(u.is.object(t)){for(var i in t)this.off(i,t[i],e);return this}var a;(0,s.isNonNativeEvent)(t,this.scope.actions)?t in this.globalEvents&&-1!==(a=this.globalEvents[t].indexOf(e))&&this.globalEvents[t].splice(a,1):this.scope.events.remove(this.scope.document,t,e,n);return this}},{key:"debug",value:function(){return this.scope}},{key:"supportsTouch",value:function(){return r.default.supportsTouch}},{key:"supportsPointerEvent",value:function(){return r.default.supportsPointerEvent}},{key:"stop",value:function(){for(var t=0;t<this.scope.interactions.list.length;t++){this.scope.interactions.list[t].stop()}return this}},{key:"pointerMoveTolerance",value:function(t){return u.is.number(t)?(this.scope.interactions.pointerMoveTolerance=t,this):this.scope.interactions.pointerMoveTolerance}},{key:"addDocument",value:function(t,e){this.scope.addDocument(t,e)}},{key:"removeDocument",value:function(t){this.scope.removeDocument(t)}}])&&o(t.prototype,e),n&&o(t,n),a}(),f=e.InteractStatic=i;e.default=f}),e={};Object.defineProperty(e,"__esModule",{value:!0}),e.default=void 0;e.default=function(t){return!(!t||!t.Window)&&t instanceof t.Window};var O={};Object.defineProperty(O,"__esModule",{value:!0}),O.init=i,O.getWindow=a,O.default=void 0;var n,r=(n=e)&&n.__esModule?n:{default:n};var o={realWindow:void 0,window:void 0,getWindow:a,init:i};function i(t){var e=(o.realWindow=t).document.createTextNode("");e.ownerDocument!==t.document&&"function"==typeof t.wrap&&t.wrap(e)===e&&(t=t.wrap(t)),o.window=t}function a(t){return(0,r.default)(t)?t:(t.ownerDocument||t).defaultView||o.window}"undefined"==typeof window?(o.window=void 0,o.realWindow=void 0):i(window),o.init=i;var u=o;O.default=u;var w={};Object.defineProperty(w,"__esModule",{value:!0}),w.array=w.plainObject=w.element=w.string=w.bool=w.number=w.func=w.object=w.docFrag=w.window=void 0;var s=c(e),l=c(O);function c(t){return t&&t.__esModule?t:{default:t}}function f(t){return(f="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}w.window=function(t){return t===l.default.window||(0,s.default)(t)};w.docFrag=function(t){return p(t)&&11===t.nodeType};var p=function(t){return!!t&&"object"===f(t)};w.object=p;function d(t){return"function"==typeof t}w.func=d;w.number=function(t){return"number"==typeof t};w.bool=function(t){return"boolean"==typeof t};w.string=function(t){return"string"==typeof t};w.element=function(t){if(!t||"object"!==f(t))return!1;var e=l.default.getWindow(t)||l.default.window;return/object|function/.test(f(e.Element))?t instanceof e.Element:1===t.nodeType&&"string"==typeof t.nodeName};w.plainObject=function(t){return p(t)&&!!t.constructor&&/function Object\b/.test(t.constructor.toString())};w.array=function(t){return p(t)&&void 0!==t.length&&d(t.splice)};var v={};function y(t){return(y="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(v,"__esModule",{value:!0}),v.default=void 0;var h=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==y(t)&&"function"!=typeof t)return{default:t};var e=g();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function g(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return g=function(){return t},t}function b(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.prepared.axis;"x"===n?(e.coords.cur.page.y=e.coords.start.page.y,e.coords.cur.client.y=e.coords.start.client.y,e.coords.velocity.client.y=0,e.coords.velocity.page.y=0):"y"===n&&(e.coords.cur.page.x=e.coords.start.page.x,e.coords.cur.client.x=e.coords.start.client.x,e.coords.velocity.client.x=0,e.coords.velocity.page.x=0)}}function _(t){var e=t.iEvent,n=t.interaction;if("drag"===n.prepared.name){var r=n.prepared.axis;if("x"===r||"y"===r){var o="x"===r?"y":"x";e.page[o]=n.coords.start.page[o],e.client[o]=n.coords.start.client[o],e.delta[o]=0}}}var P={id:"actions/drag",install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.draggable=P.draggable,e.map.drag=P,e.methodDict.drag="draggable",r.actions.drag=P.defaults},listeners:{"interactions:before-action-move":b,"interactions:action-resume":b,"interactions:action-move":_,"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.buttons,o=n.options.drag;if(o&&o.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(r&n.options.drag.mouseButtons)))return!(t.action={name:"drag",axis:"start"===o.lockAxis?o.startAxis:o.lockAxis})}},draggable:function(t){return h.object(t)?(this.options.drag.enabled=!1!==t.enabled,this.setPerAction("drag",t),this.setOnEvents("drag",t),/^(xy|x|y|start)$/.test(t.lockAxis)&&(this.options.drag.lockAxis=t.lockAxis),/^(xy|x|y)$/.test(t.startAxis)&&(this.options.drag.startAxis=t.startAxis),this):h.bool(t)?(this.options.drag.enabled=t,this):this.options.drag},beforeMove:b,move:_,defaults:{startAxis:"xy",lockAxis:"xy"},getCursor:function(){return"move"}},x=P;v.default=x;var S={};Object.defineProperty(S,"__esModule",{value:!0}),S.find=S.findIndex=S.from=S.merge=S.remove=S.contains=void 0;S.contains=function(t,e){return-1!==t.indexOf(e)};S.remove=function(t,e){return t.splice(t.indexOf(e),1)};function j(t,e){for(var n=0;n<e.length;n++){var r=e[n];t.push(r)}return t}S.merge=j;S.from=function(t){return j([],t)};function M(t,e){for(var n=0;n<t.length;n++)if(e(t[n],n,t))return n;return-1}S.findIndex=M;S.find=function(t,e){return t[M(t,e)]};var D={};Object.defineProperty(D,"__esModule",{value:!0}),D.default=void 0;var I={init:function(t){var e=t;I.document=e.document,I.DocumentFragment=e.DocumentFragment||z,I.SVGElement=e.SVGElement||z,I.SVGSVGElement=e.SVGSVGElement||z,I.SVGElementInstance=e.SVGElementInstance||z,I.Element=e.Element||z,I.HTMLElement=e.HTMLElement||I.Element,I.Event=e.Event,I.Touch=e.Touch||z,I.PointerEvent=e.PointerEvent||e.MSPointerEvent},document:null,DocumentFragment:null,SVGElement:null,SVGSVGElement:null,SVGElementInstance:null,Element:null,HTMLElement:null,Event:null,Touch:null,PointerEvent:null};function z(){}var A=I;D.default=A;var C={};function W(t){return(W="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(C,"__esModule",{value:!0}),C.default=void 0;var R=N(D),F=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==W(t)&&"function"!=typeof t)return{default:t};var e=Y();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w),X=N(O);function Y(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Y=function(){return t},t}function N(t){return t&&t.__esModule?t:{default:t}}var L={init:function(t){var e=R.default.Element,n=X.default.window.navigator;L.supportsTouch="ontouchstart"in t||F.func(t.DocumentTouch)&&R.default.document instanceof t.DocumentTouch,L.supportsPointerEvent=!1!==n.pointerEnabled&&!!R.default.PointerEvent,L.isIOS=/iP(hone|od|ad)/.test(n.platform),L.isIOS7=/iP(hone|od|ad)/.test(n.platform)&&/OS 7[^\d]/.test(n.appVersion),L.isIe9=/MSIE 9/.test(n.userAgent),L.isOperaMobile="Opera"===n.appName&&L.supportsTouch&&/Presto/.test(n.userAgent),L.prefixedMatchesSelector="matches"in e.prototype?"matches":"webkitMatchesSelector"in e.prototype?"webkitMatchesSelector":"mozMatchesSelector"in e.prototype?"mozMatchesSelector":"oMatchesSelector"in e.prototype?"oMatchesSelector":"msMatchesSelector",L.pEventTypes=L.supportsPointerEvent?R.default.PointerEvent===t.MSPointerEvent?{up:"MSPointerUp",down:"MSPointerDown",over:"mouseover",out:"mouseout",move:"MSPointerMove",cancel:"MSPointerCancel"}:{up:"pointerup",down:"pointerdown",over:"pointerover",out:"pointerout",move:"pointermove",cancel:"pointercancel"}:null,L.wheelEvent="onmousewheel"in R.default.document?"mousewheel":"wheel"},supportsTouch:null,supportsPointerEvent:null,isIOS7:null,isIOS:null,isIe9:null,isOperaMobile:null,prefixedMatchesSelector:null,pEventTypes:null,wheelEvent:null};var B=L;C.default=B;var V={};function q(t){return(q="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(V,"__esModule",{value:!0}),V.default=function t(e){var n={};for(var r in e){var o=e[r];G.plainObject(o)?n[r]=t(o):G.array(o)?n[r]=U.from(o):n[r]=o}return n};var U=K(S),G=K(w);function H(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return H=function(){return t},t}function K(t){if(t&&t.__esModule)return t;if(null===t||"object"!==q(t)&&"function"!=typeof t)return{default:t};var e=H();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}var $={};function Z(t){return(Z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty($,"__esModule",{value:!0}),$.nodeContains=function(t,e){for(;e;){if(e===t)return!0;e=e.parentNode}return!1},$.closest=function(t,e){for(;tt.element(t);){if(at(t,e))return t;t=it(t)}return null},$.parentNode=it,$.matchesSelector=at,$.indexOfDeepestElement=function(t){var e,n,r=[],o=t[0],i=o?0:-1;for(e=1;e<t.length;e++){var a=t[e];if(a&&a!==o)if(o){if(a.parentNode!==a.ownerDocument)if(o.parentNode!==a.ownerDocument)if(a.parentNode!==o.parentNode){if(!r.length)for(var u=o,s=void 0;(s=ut(u))&&s!==u.ownerDocument;)r.unshift(u),u=s;var l=void 0;if(o instanceof Q.default.HTMLElement&&a instanceof Q.default.SVGElement&&!(a instanceof Q.default.SVGSVGElement)){if(a===o.parentNode)continue;l=a.ownerSVGElement}else l=a;for(var c=[];l.parentNode!==l.ownerDocument;)c.unshift(l),l=ut(l);for(n=0;c[n]&&c[n]===r[n];)n++;for(var f=[c[n-1],c[n],r[n]],p=f[0].lastChild;p;){if(p===f[1]){o=a,i=e,r=c;break}if(p===f[2])break;p=p.previousSibling}}else{var d=parseInt((0,et.getWindow)(o).getComputedStyle(o).zIndex,10)||0,v=parseInt((0,et.getWindow)(a).getComputedStyle(a).zIndex,10)||0;d<=v&&(o=a,i=e)}else o=a,i=e}else o=a,i=e}return i},$.matchesUpTo=function(t,e,n){for(;tt.element(t);){if(at(t,e))return!0;if((t=it(t))===n)return at(t,e)}return!1},$.getActualElement=function(t){return t instanceof Q.default.SVGElementInstance?t.correspondingUseElement:t},$.getScrollXY=st,$.getElementClientRect=lt,$.getElementRect=function(t){var e=lt(t);if(!J.default.isIOS7&&e){var n=st(et.default.getWindow(t));e.left+=n.x,e.right+=n.x,e.top+=n.y,e.bottom+=n.y}return e},$.getPath=function(t){var e=[];for(;t;)e.push(t),t=it(t);return e},$.trySelector=function(t){return!!tt.string(t)&&(Q.default.document.querySelector(t),!0)};var J=ot(C),Q=ot(D),tt=rt(w),et=rt(O);function nt(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return nt=function(){return t},t}function rt(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Z(t)&&"function"!=typeof t)return{default:t};var e=nt();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function ot(t){return t&&t.__esModule?t:{default:t}}function it(t){var e=t.parentNode;if(tt.docFrag(e)){for(;(e=e.host)&&tt.docFrag(e););return e}return e}function at(t,e){return et.default.window!==et.default.realWindow&&(e=e.replace(/\/deep\//g," ")),t[J.default.prefixedMatchesSelector](e)}var ut=function(t){return t.parentNode?t.parentNode:t.host};function st(t){return{x:(t=t||et.default.window).scrollX||t.document.documentElement.scrollLeft,y:t.scrollY||t.document.documentElement.scrollTop}}function lt(t){var e=t instanceof Q.default.SVGElement?t.getBoundingClientRect():t.getClientRects()[0];return e&&{left:e.left,right:e.right,top:e.top,bottom:e.bottom,width:e.width||e.right-e.left,height:e.height||e.bottom-e.top}}var ct={};Object.defineProperty(ct,"__esModule",{value:!0}),ct.default=function(t,e){for(var n in e)t[n]=e[n];return t};var ft={};function pt(t){return(pt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(ft,"__esModule",{value:!0}),ft.default=function n(e,r,o){o=o||{};yt.string(e)&&-1!==e.search(" ")&&(e=gt(e));if(yt.array(e))return e.reduce(function(t,e){return(0,vt.default)(t,n(e,r,o))},o);yt.object(e)&&(r=e,e="");if(yt.func(r))o[e]=o[e]||[],o[e].push(r);else if(yt.array(r))for(var t=0;t<r.length;t++){var i=r[t];n(e,i,o)}else if(yt.object(r))for(var a in r){var u=gt(a).map(function(t){return"".concat(e).concat(t)});n(u,r[a],o)}return o};var dt,vt=(dt=ct)&&dt.__esModule?dt:{default:dt},yt=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==pt(t)&&"function"!=typeof t)return{default:t};var e=ht();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function ht(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ht=function(){return t},t}function gt(t){return t.trim().split(/ +/)}var bt={};function mt(t){return(mt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(bt,"__esModule",{value:!0}),bt.default=void 0;var Ot=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==mt(t)&&"function"!=typeof t)return{default:t};var e=xt();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(S),wt=Pt(ct),_t=Pt(ft);function Pt(t){return t&&t.__esModule?t:{default:t}}function xt(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return xt=function(){return t},t}function St(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function jt(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function Mt(t,e){for(var n=0;n<e.length;n++){var r=e[n];if(t.immediatePropagationStopped)break;r(t)}}var kt=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),jt(this,"options",void 0),jt(this,"types",{}),jt(this,"propagationStopped",!1),jt(this,"immediatePropagationStopped",!1),jt(this,"global",void 0),this.options=(0,wt.default)({},t||{})}var t,n,r;return t=e,(n=[{key:"fire",value:function(t){var e,n=this.global;(e=this.types[t.type])&&Mt(t,e),!t.propagationStopped&&n&&(e=n[t.type])&&Mt(t,e)}},{key:"on",value:function(t,e){var n=(0,_t.default)(t,e);for(t in n)this.types[t]=Ot.merge(this.types[t]||[],n[t])}},{key:"off",value:function(t,e){var n=(0,_t.default)(t,e);for(t in n){var r=this.types[t];if(r&&r.length)for(var o=0;o<n[t].length;o++){var i=n[t][o],a=r.indexOf(i);-1!==a&&r.splice(a,1)}}}},{key:"getRect",value:function(){return null}}])&&St(t.prototype,n),r&&St(t,r),e}();bt.default=kt;var Et={};Object.defineProperty(Et,"__esModule",{value:!0}),Et.default=void 0;Et.default=function(t,e){return Math.sqrt(t*t+e*e)};var Tt={};function Dt(t,e){for(var n in e){var r=Dt.prefixedPropREs,o=!1;for(var i in r)if(0===n.indexOf(i)&&r[i].test(n)){o=!0;break}o||"function"==typeof e[n]||(t[n]=e[n])}return t}Object.defineProperty(Tt,"__esModule",{value:!0}),Tt.default=void 0,Dt.prefixedPropREs={webkit:/(Movement[XY]|Radius[XY]|RotationAngle|Force)$/,moz:/(Pressure)$/};var It=Dt;Tt.default=It;var zt={};function At(t){return(At="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(zt,"__esModule",{value:!0}),zt.copyCoords=function(t,e){t.page=t.page||{},t.page.x=e.page.x,t.page.y=e.page.y,t.client=t.client||{},t.client.x=e.client.x,t.client.y=e.client.y,t.timeStamp=e.timeStamp},zt.setCoordDeltas=function(t,e,n){t.page.x=n.page.x-e.page.x,t.page.y=n.page.y-e.page.y,t.client.x=n.client.x-e.client.x,t.client.y=n.client.y-e.client.y,t.timeStamp=n.timeStamp-e.timeStamp},zt.setCoordVelocity=function(t,e){var n=Math.max(e.timeStamp/1e3,.001);t.page.x=e.page.x/n,t.page.y=e.page.y/n,t.client.x=e.client.x/n,t.client.y=e.client.y/n,t.timeStamp=n},zt.setZeroCoords=function(t){t.page.x=0,t.page.y=0,t.client.x=0,t.client.y=0},zt.isNativePointer=Vt,zt.getXY=qt,zt.getPageXY=Ut,zt.getClientXY=Gt,zt.getPointerId=function(t){return Xt.number(t.pointerId)?t.pointerId:t.identifier},zt.setCoords=function(t,e,n){var r=1<e.length?Kt(e):e[0],o={};Ut(r,o),t.page.x=o.x,t.page.y=o.y,Gt(r,o),t.client.x=o.x,t.client.y=o.y,t.timeStamp=n},zt.getTouchPair=Ht,zt.pointerAverage=Kt,zt.touchBBox=function(t){if(!(t.length||t.touches&&1<t.touches.length))return null;var e=Ht(t),n=Math.min(e[0].pageX,e[1].pageX),r=Math.min(e[0].pageY,e[1].pageY),o=Math.max(e[0].pageX,e[1].pageX),i=Math.max(e[0].pageY,e[1].pageY);return{x:n,y:r,left:n,top:r,right:o,bottom:i,width:o-n,height:i-r}},zt.touchDistance=function(t,e){var n=e+"X",r=e+"Y",o=Ht(t),i=o[0][n]-o[1][n],a=o[0][r]-o[1][r];return(0,Ft.default)(i,a)},zt.touchAngle=function(t,e){var n=e+"X",r=e+"Y",o=Ht(t),i=o[1][n]-o[0][n],a=o[1][r]-o[0][r];return 180*Math.atan2(a,i)/Math.PI},zt.getPointerType=function(t){return Xt.string(t.pointerType)?t.pointerType:Xt.number(t.pointerType)?[void 0,void 0,"touch","pen","mouse"][t.pointerType]:/touch/.test(t.type)||t instanceof Wt.default.Touch?"touch":"mouse"},zt.getEventTargets=function(t){var e=Xt.func(t.composedPath)?t.composedPath():t.path;return[Rt.getActualElement(e?e[0]:t.target),Rt.getActualElement(t.currentTarget)]},zt.newCoords=function(){return{page:{x:0,y:0},client:{x:0,y:0},timeStamp:0}},zt.coordsToEvent=function(t){return{coords:t,get page(){return this.coords.page},get client(){return this.coords.client},get timeStamp(){return this.coords.timeStamp},get pageX(){return this.coords.page.x},get pageY(){return this.coords.page.y},get clientX(){return this.coords.client.x},get clientY(){return this.coords.client.y},get pointerId(){return this.coords.pointerId},get target(){return this.coords.target},get type(){return this.coords.type},get pointerType(){return this.coords.pointerType},get buttons(){return this.coords.buttons},preventDefault:function(){}}},Object.defineProperty(zt,"pointerExtend",{enumerable:!0,get:function(){return Yt.default}});var Ct=Bt(C),Wt=Bt(D),Rt=Lt($),Ft=Bt(Et),Xt=Lt(w),Yt=Bt(Tt);function Nt(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Nt=function(){return t},t}function Lt(t){if(t&&t.__esModule)return t;if(null===t||"object"!==At(t)&&"function"!=typeof t)return{default:t};var e=Nt();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function Bt(t){return t&&t.__esModule?t:{default:t}}function Vt(t){return t instanceof Wt.default.Event||t instanceof Wt.default.Touch}function qt(t,e,n){return(n=n||{}).x=e[(t=t||"page")+"X"],n.y=e[t+"Y"],n}function Ut(t,e){return e=e||{x:0,y:0},Ct.default.isOperaMobile&&Vt(t)?(qt("screen",t,e),e.x+=window.scrollX,e.y+=window.scrollY):qt("page",t,e),e}function Gt(t,e){return e=e||{},Ct.default.isOperaMobile&&Vt(t)?qt("screen",t,e):qt("client",t,e),e}function Ht(t){var e=[];return Xt.array(t)?(e[0]=t[0],e[1]=t[1]):"touchend"===t.type?1===t.touches.length?(e[0]=t.touches[0],e[1]=t.changedTouches[0]):0===t.touches.length&&(e[0]=t.changedTouches[0],e[1]=t.changedTouches[1]):(e[0]=t.touches[0],e[1]=t.touches[1]),e}function Kt(t){for(var e={pageX:0,pageY:0,clientX:0,clientY:0,screenX:0,screenY:0},n=0;n<t.length;n++){var r=t[n];for(var o in e)e[o]+=r[o]}for(var i in e)e[i]/=t.length;return e}var $t={};function Zt(t){return(Zt="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty($t,"__esModule",{value:!0}),$t.getStringOptionResult=ne,$t.resolveRectLike=function(t,e,n,r){var o=t;te.string(o)?o=ne(o,e,n):te.func(o)&&(o=o.apply(void 0,function(t){return function(t){if(Array.isArray(t)){for(var e=0,n=new Array(t.length);e<t.length;e++)n[e]=t[e];return n}}(t)||function(t){if(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t))return Array.from(t)}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance")}()}(r)));te.element(o)&&(o=(0,$.getElementRect)(o));return o},$t.rectToXY=function(t){return t&&{x:"x"in t?t.x:t.left,y:"y"in t?t.y:t.top}},$t.xywhToTlbr=function(t){!t||"left"in t&&"top"in t||((t=(0,Qt.default)({},t)).left=t.x||0,t.top=t.y||0,t.right=t.right||t.left+t.width,t.bottom=t.bottom||t.top+t.height);return t},$t.tlbrToXywh=function(t){!t||"x"in t&&"y"in t||((t=(0,Qt.default)({},t)).x=t.left||0,t.y=t.top||0,t.width=t.width||t.right||0-t.x,t.height=t.height||t.bottom||0-t.y);return t},$t.addEdges=function(t,e,n){t.left&&(e.left+=n.x);t.right&&(e.right+=n.x);t.top&&(e.top+=n.y);t.bottom&&(e.bottom+=n.y);e.width=e.right-e.left,e.height=e.bottom-e.top};var Jt,Qt=(Jt=ct)&&Jt.__esModule?Jt:{default:Jt},te=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Zt(t)&&"function"!=typeof t)return{default:t};var e=ee();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function ee(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ee=function(){return t},t}function ne(t,e,n){return"parent"===t?(0,$.parentNode)(n):"self"===t?e.getRect(n):(0,$.closest)(n,t)}var re={};Object.defineProperty(re,"__esModule",{value:!0}),re.default=function(t,e,n){var r=t.options[n],o=r&&r.origin||t.options.origin,i=(0,$t.resolveRectLike)(o,t,e,[t&&e]);return(0,$t.rectToXY)(i)||{x:0,y:0}};var oe={};Object.defineProperty(oe,"__esModule",{value:!0}),oe.default=void 0;var ie,ae,ue=0;var se={request:function(t){return ie(t)},cancel:function(t){return ae(t)},init:function(t){if(ie=t.requestAnimationFrame,ae=t.cancelAnimationFrame,!ie)for(var e=["ms","moz","webkit","o"],n=0;n<e.length;n++){var r=e[n];ie=t["".concat(r,"RequestAnimationFrame")],ae=t["".concat(r,"CancelAnimationFrame")]||t["".concat(r,"CancelRequestAnimationFrame")]}ie||(ie=function(t){var e=Date.now(),n=Math.max(0,16-(e-ue)),r=setTimeout(function(){t(e+n)},n);return ue=e+n,r},ae=function(t){return clearTimeout(t)})}};oe.default=se;var le={};function ce(t){return(ce="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(le,"__esModule",{value:!0}),le.warnOnce=function(t,e){var n=!1;return function(){return n||(he.default.window.console.warn(e),n=!0),t.apply(this,arguments)}},le.copyAction=function(t,e){return t.name=e.name,t.axis=e.axis,t.edges=e.edges,t},Object.defineProperty(le,"win",{enumerable:!0,get:function(){return he.default}}),Object.defineProperty(le,"browser",{enumerable:!0,get:function(){return ge.default}}),Object.defineProperty(le,"clone",{enumerable:!0,get:function(){return be.default}}),Object.defineProperty(le,"extend",{enumerable:!0,get:function(){return me.default}}),Object.defineProperty(le,"getOriginXY",{enumerable:!0,get:function(){return Oe.default}}),Object.defineProperty(le,"hypot",{enumerable:!0,get:function(){return we.default}}),Object.defineProperty(le,"normalizeListeners",{enumerable:!0,get:function(){return _e.default}}),Object.defineProperty(le,"raf",{enumerable:!0,get:function(){return Pe.default}}),le.rect=le.pointer=le.is=le.dom=le.arr=void 0;var fe=je(S);le.arr=fe;var pe=je($);le.dom=pe;var de=je(w);le.is=de;var ve=je(zt);le.pointer=ve;var ye=je($t);le.rect=ye;var he=xe(O),ge=xe(C),be=xe(V),me=xe(ct),Oe=xe(re),we=xe(Et),_e=xe(ft),Pe=xe(oe);function xe(t){return t&&t.__esModule?t:{default:t}}function Se(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Se=function(){return t},t}function je(t){if(t&&t.__esModule)return t;if(null===t||"object"!==ce(t)&&"function"!=typeof t)return{default:t};var e=Se();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}var Me={};function ke(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Ee(t,e,n){return e&&ke(t.prototype,e),n&&ke(t,n),t}function Te(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}Object.defineProperty(Me,"__esModule",{value:!0}),Me.default=Me.BaseEvent=void 0;var De=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),Te(this,"type",void 0),Te(this,"target",void 0),Te(this,"currentTarget",void 0),Te(this,"interactable",void 0),Te(this,"_interaction",void 0),Te(this,"timeStamp",void 0),Te(this,"immediatePropagationStopped",!1),Te(this,"propagationStopped",!1),this._interaction=t}return Ee(e,[{key:"interaction",get:function(){return this._interaction._proxy}}]),Ee(e,[{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}]),e}(),Ie=Me.BaseEvent=De;Me.default=Ie;var ze={};Object.defineProperty(ze,"__esModule",{value:!0}),ze.default=ze.defaults=void 0;var Ae={base:{preventDefault:"auto",deltaSource:"page"},perAction:{enabled:!1,origin:{x:0,y:0}},actions:{}},Ce=ze.defaults=Ae;ze.default=Ce;var We={};Object.defineProperty(We,"__esModule",{value:!0}),We.default=We.InteractEvent=void 0;var Re=Le(ct),Fe=Le(re),Xe=Le(Et),Ye=Le(Me),Ne=Le(ze);function Le(t){return t&&t.__esModule?t:{default:t}}function Be(t){return(Be="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Ve(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function qe(t){return(qe=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ue(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Ge(t,e){return(Ge=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function He(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Ke=function(){function g(t,e,n,r,o,i,a){var u,s,l;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,g),s=this,u=!(l=qe(g).call(this,t))||"object"!==Be(l)&&"function"!=typeof l?Ue(s):l,He(Ue(u),"target",void 0),He(Ue(u),"currentTarget",void 0),He(Ue(u),"relatedTarget",null),He(Ue(u),"screenX",void 0),He(Ue(u),"screenY",void 0),He(Ue(u),"button",void 0),He(Ue(u),"buttons",void 0),He(Ue(u),"ctrlKey",void 0),He(Ue(u),"shiftKey",void 0),He(Ue(u),"altKey",void 0),He(Ue(u),"metaKey",void 0),He(Ue(u),"page",void 0),He(Ue(u),"client",void 0),He(Ue(u),"delta",void 0),He(Ue(u),"rect",void 0),He(Ue(u),"x0",void 0),He(Ue(u),"y0",void 0),He(Ue(u),"t0",void 0),He(Ue(u),"dt",void 0),He(Ue(u),"duration",void 0),He(Ue(u),"clientX0",void 0),He(Ue(u),"clientY0",void 0),He(Ue(u),"velocity",void 0),He(Ue(u),"speed",void 0),He(Ue(u),"swipe",void 0),He(Ue(u),"timeStamp",void 0),He(Ue(u),"dragEnter",void 0),He(Ue(u),"dragLeave",void 0),He(Ue(u),"axes",void 0),He(Ue(u),"preEnd",void 0),o=o||t.element;var c=t.interactable,f=(c&&c.options||Ne.default).deltaSource,p=(0,Fe.default)(c,o,n),d="start"===r,v="end"===r,y=d?Ue(u):t.prevEvent,h=d?t.coords.start:v?{page:y.page,client:y.client,timeStamp:t.coords.cur.timeStamp}:t.coords.cur;return u.page=(0,Re.default)({},h.page),u.client=(0,Re.default)({},h.client),u.rect=(0,Re.default)({},t.rect),u.timeStamp=h.timeStamp,v||(u.page.x-=p.x,u.page.y-=p.y,u.client.x-=p.x,u.client.y-=p.y),u.ctrlKey=e.ctrlKey,u.altKey=e.altKey,u.shiftKey=e.shiftKey,u.metaKey=e.metaKey,u.button=e.button,u.buttons=e.buttons,u.target=o,u.currentTarget=o,u.preEnd=i,u.type=a||n+(r||""),u.interactable=c,u.t0=d?t.pointers[t.pointers.length-1].downTime:y.t0,u.x0=t.coords.start.page.x-p.x,u.y0=t.coords.start.page.y-p.y,u.clientX0=t.coords.start.client.x-p.x,u.clientY0=t.coords.start.client.y-p.y,u.delta=d||v?{x:0,y:0}:{x:u[f].x-y[f].x,y:u[f].y-y[f].y},u.dt=t.coords.delta.timeStamp,u.duration=u.timeStamp-u.t0,u.velocity=(0,Re.default)({},t.coords.velocity[f]),u.speed=(0,Xe.default)(u.velocity.x,u.velocity.y),u.swipe=v||"inertiastart"===r?u.getSwipe():null,u}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Ge(t,e)}(g,Ye["default"]),t=g,(e=[{key:"getSwipe",value:function(){var t=this._interaction;if(t.prevEvent.speed<600||150<this.timeStamp-t.prevEvent.timeStamp)return null;var e=180*Math.atan2(t.prevEvent.velocityY,t.prevEvent.velocityX)/Math.PI;e<0&&(e+=360);var n=112.5<=e&&e<247.5,r=202.5<=e&&e<337.5;return{up:r,down:!r&&22.5<=e&&e<157.5,left:n,right:!n&&(292.5<=e||e<67.5),angle:e,speed:t.prevEvent.speed,velocity:{x:t.prevEvent.velocityX,y:t.prevEvent.velocityY}}}},{key:"preventDefault",value:function(){}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"pageX",get:function(){return this.page.x},set:function(t){this.page.x=t}},{key:"pageY",get:function(){return this.page.y},set:function(t){this.page.y=t}},{key:"clientX",get:function(){return this.client.x},set:function(t){this.client.x=t}},{key:"clientY",get:function(){return this.client.y},set:function(t){this.client.y=t}},{key:"dx",get:function(){return this.delta.x},set:function(t){this.delta.x=t}},{key:"dy",get:function(){return this.delta.y},set:function(t){this.delta.y=t}},{key:"velocityX",get:function(){return this.velocity.x},set:function(t){this.velocity.x=t}},{key:"velocityY",get:function(){return this.velocity.y},set:function(t){this.velocity.y=t}}])&&Ve(t.prototype,e),n&&Ve(t,n),g}(),$e=We.InteractEvent=Ke;We.default=$e;var Ze={};function Je(t){return(Je="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ze,"__esModule",{value:!0}),Ze.default=void 0;var Qe,tn=an(S),en=an($),nn=(Qe=ct)&&Qe.__esModule?Qe:{default:Qe},rn=an(w);function on(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return on=function(){return t},t}function an(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Je(t)&&"function"!=typeof t)return{default:t};var e=on();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function un(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function sn(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var ln=function(){function e(t){var a=this;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.scope=t,sn(this,"list",[]),sn(this,"selectorMap",{}),t.addListeners({"interactable:unset":function(t){var e=t.interactable,n=e.target,r=e._context,o=rn.string(n)?a.selectorMap[n]:n[a.scope.id],i=o.findIndex(function(t){return t.context===r});o[i]&&(o[i].context=null,o[i].interactable=null),o.splice(i,1)}})}var t,n,r;return t=e,(n=[{key:"new",value:function(t,e){e=(0,nn.default)(e||{},{actions:this.scope.actions});var n=new this.scope.Interactable(t,e,this.scope.document,this.scope.events),r={context:n._context,interactable:n};return this.scope.addDocument(n._doc),this.list.push(n),rn.string(t)?(this.selectorMap[t]||(this.selectorMap[t]=[]),this.selectorMap[t].push(r)):(n.target[this.scope.id]||Object.defineProperty(t,this.scope.id,{value:[],configurable:!0}),t[this.scope.id].push(r)),this.scope.fire("interactable:new",{target:t,options:e,interactable:n,win:this.scope._win}),n}},{key:"get",value:function(e,t){var n=t&&t.context||this.scope.document,r=rn.string(e),o=r?this.selectorMap[e]:e[this.scope.id];if(!o)return null;var i=tn.find(o,function(t){return t.context===n&&(r||t.interactable.inContext(e))});return i&&i.interactable}},{key:"forEachMatch",value:function(t,e){for(var n=0;n<this.list.length;n++){var r=this.list[n],o=void 0;if((rn.string(r.target)?rn.element(t)&&en.matchesSelector(t,r.target):t===r.target)&&r.inContext(t)&&(o=e(r)),void 0!==o)return o}}}])&&un(t.prototype,n),r&&un(t,r),e}();Ze.default=ln;var cn={};function fn(t){return(fn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(cn,"__esModule",{value:!0}),cn.default=cn.FakeEvent=void 0;var pn=On(S),dn=On($),vn=bn(ct),yn=On(w),hn=bn(Tt),gn=On(zt);function bn(t){return t&&t.__esModule?t:{default:t}}function mn(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return mn=function(){return t},t}function On(t){if(t&&t.__esModule)return t;if(null===t||"object"!==fn(t)&&"function"!=typeof t)return{default:t};var e=mn();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function wn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function _n(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var Pn=function(){function o(t){var e,n,r;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,o),this.originalEvent=t,r=void 0,(n="currentTarget")in(e=this)?Object.defineProperty(e,n,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[n]=r,(0,hn.default)(this,t)}var t,e,n;return t=o,(e=[{key:"preventOriginalDefault",value:function(){this.originalEvent.preventDefault()}},{key:"stopPropagation",value:function(){this.originalEvent.stopPropagation()}},{key:"stopImmediatePropagation",value:function(){this.originalEvent.stopImmediatePropagation()}}])&&wn(t.prototype,e),n&&wn(t,n),o}();function xn(t){if(!yn.object(t))return{capture:!!t,passive:!1};var e=(0,vn.default)({},t);return e.capture=!!t.capture,e.passive=!!t.passive,e}cn.FakeEvent=Pn;var Sn={id:"events",install:function(t){var f=[],b={},c=[],p={add:d,remove:g,addDelegate:function(e,n,t,r,o){var i=xn(o);if(!b[t]){b[t]=[];for(var a=0;a<c.length;a++){var u=c[a];d(u,t,m),d(u,t,O,!0)}}var s=b[t],l=pn.find(s,function(t){return t.selector===e&&t.context===n});l||(l={selector:e,context:n,listeners:[]},s.push(l));l.listeners.push([r,i])},removeDelegate:function(t,e,n,r,o){var i,a=xn(o),u=b[n],s=!1;if(!u)return;for(i=u.length-1;0<=i;i--){var l=u[i];if(l.selector===t&&l.context===e){for(var c=l.listeners,f=c.length-1;0<=f;f--){var p=_n(c[f],2),d=p[0],v=p[1],y=v.capture,h=v.passive;if(d===r&&y===a.capture&&h===a.passive){c.splice(f,1),c.length||(u.splice(i,1),g(e,n,m),g(e,n,O,!0)),s=!0;break}}if(s)break}}},delegateListener:m,delegateUseCapture:O,delegatedEvents:b,documents:c,targets:f,supportsOptions:!1,supportsPassive:!1};function d(e,t,n,r){var o=xn(r),i=pn.find(f,function(t){return t.eventTarget===e});i||(i={eventTarget:e,events:{}},f.push(i)),i.events[t]||(i.events[t]=[]),e.addEventListener&&!pn.contains(i.events[t],n)&&(e.addEventListener(t,n,p.supportsOptions?o:o.capture),i.events[t].push(n))}function g(e,t,n,r){var o=xn(r),i=pn.findIndex(f,function(t){return t.eventTarget===e}),a=f[i];if(a&&a.events)if("all"!==t){var u=!1,s=a.events[t];if(s){if("all"===n){for(var l=s.length-1;0<=l;l--)g(e,t,s[l],o);return}for(var c=0;c<s.length;c++)if(s[c]===n){e.removeEventListener(t,n,p.supportsOptions?o:o.capture),s.splice(c,1),0===s.length&&(delete a.events[t],u=!0);break}}u&&!Object.keys(a.events).length&&f.splice(i,1)}else for(t in a.events)a.events.hasOwnProperty(t)&&g(e,t,"all")}function m(t,e){for(var n=xn(e),r=new Pn(t),o=b[t.type],i=_n(gn.getEventTargets(t),1)[0],a=i;yn.element(a);){for(var u=0;u<o.length;u++){var s=o[u],l=s.selector,c=s.context;if(dn.matchesSelector(a,l)&&dn.nodeContains(c,i)&&dn.nodeContains(c,a)){var f=s.listeners;r.currentTarget=a;for(var p=0;p<f.length;p++){var d=_n(f[p],2),v=d[0],y=d[1],h=y.capture,g=y.passive;h===n.capture&&g===n.passive&&v(r)}}}a=dn.parentNode(a)}}function O(t){return m.call(this,t,!0)}return t.document.createElement("div").addEventListener("test",null,{get capture(){return p.supportsOptions=!0},get passive(){return p.supportsPassive=!0}}),t.events=p}};cn.default=Sn;var jn={};Object.defineProperty(jn,"__esModule",{value:!0}),jn.default=jn.PointerInfo=void 0;function Mn(t,e,n,r,o){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,Mn),this.id=t,this.pointer=e,this.event=n,this.downTime=r,this.downTarget=o}var kn=jn.PointerInfo=Mn;jn.default=kn;var En={};function Tn(t){return(Tn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(En,"__esModule",{value:!0}),Object.defineProperty(En,"PointerInfo",{enumerable:!0,get:function(){return Rn.default}}),En.default=En.Interaction=En._ProxyMethods=En._ProxyValues=void 0;var Dn,In,zn,An,Cn=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Tn(t)&&"function"!=typeof t)return{default:t};var e=Xn();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),Wn=Fn(We),Rn=Fn(jn);function Fn(t){return t&&t.__esModule?t:{default:t}}function Xn(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Xn=function(){return t},t}function Yn(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Nn(t,e,n){return e&&Yn(t.prototype,e),n&&Yn(t,n),t}function Ln(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}En._ProxyValues=Dn,(In=Dn||(En._ProxyValues=Dn={})).interactable="",In.element="",In.prepared="",In.pointerIsDown="",In.pointerWasMoved="",In._proxy="",En._ProxyMethods=zn,(An=zn||(En._ProxyMethods=zn={})).start="",An.move="",An.end="",An.stop="",An.interacting="";var Bn=0,Vn=function(){function l(t){var e=this,n=t.pointerType,r=t.scopeFire;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),Ln(this,"interactable",null),Ln(this,"element",null),Ln(this,"rect",void 0),Ln(this,"_rects",void 0),Ln(this,"edges",void 0),Ln(this,"_scopeFire",void 0),Ln(this,"prepared",{name:null,axis:null,edges:null}),Ln(this,"pointerType",void 0),Ln(this,"pointers",[]),Ln(this,"downEvent",null),Ln(this,"downPointer",{}),Ln(this,"_latestPointer",{pointer:null,event:null,eventTarget:null}),Ln(this,"prevEvent",null),Ln(this,"pointerIsDown",!1),Ln(this,"pointerWasMoved",!1),Ln(this,"_interacting",!1),Ln(this,"_ending",!1),Ln(this,"_stopped",!0),Ln(this,"_proxy",null),Ln(this,"simulation",null),Ln(this,"doMove",Cn.warnOnce(function(t){this.move(t)},"The interaction.doMove() method has been renamed to interaction.move()")),Ln(this,"coords",{start:Cn.pointer.newCoords(),prev:Cn.pointer.newCoords(),cur:Cn.pointer.newCoords(),delta:Cn.pointer.newCoords(),velocity:Cn.pointer.newCoords()}),Ln(this,"_id",Bn++),this._scopeFire=r,this.pointerType=n;var o=this;this._proxy={};function i(t){Object.defineProperty(e._proxy,t,{get:function(){return o[t]}})}for(var a in Dn)i(a);function u(t){Object.defineProperty(e._proxy,t,{value:function(){return o[t].apply(o,arguments)}})}for(var s in zn)u(s);this._scopeFire("interactions:new",{interaction:this})}return Nn(l,[{key:"pointerMoveTolerance",get:function(){return 1}}]),Nn(l,[{key:"pointerDown",value:function(t,e,n){var r=this.updatePointer(t,e,n,!0),o=this.pointers[r];this._scopeFire("interactions:down",{pointer:t,event:e,eventTarget:n,pointerIndex:r,pointerInfo:o,type:"down",interaction:this})}},{key:"start",value:function(t,e,n){return!(this.interacting()||!this.pointerIsDown||this.pointers.length<("gesture"===t.name?2:1)||!e.options[t.name].enabled)&&(Cn.copyAction(this.prepared,t),this.interactable=e,this.element=n,this.rect=e.getRect(n),this.edges=this.prepared.edges?Cn.extend({},this.prepared.edges):{left:!0,right:!0,top:!0,bottom:!0},this._stopped=!1,this._interacting=this._doPhase({interaction:this,event:this.downEvent,phase:"start"})&&!this._stopped,this._interacting)}},{key:"pointerMove",value:function(t,e,n){this.simulation||this.modification&&this.modification.endResult||this.updatePointer(t,e,n,!1);var r,o,i=this.coords.cur.page.x===this.coords.prev.page.x&&this.coords.cur.page.y===this.coords.prev.page.y&&this.coords.cur.client.x===this.coords.prev.client.x&&this.coords.cur.client.y===this.coords.prev.client.y;this.pointerIsDown&&!this.pointerWasMoved&&(r=this.coords.cur.client.x-this.coords.start.client.x,o=this.coords.cur.client.y-this.coords.start.client.y,this.pointerWasMoved=Cn.hypot(r,o)>this.pointerMoveTolerance);var a=this.getPointerIndex(t),u={pointer:t,pointerIndex:a,pointerInfo:this.pointers[a],event:e,type:"move",eventTarget:n,dx:r,dy:o,duplicate:i,interaction:this};i||Cn.pointer.setCoordVelocity(this.coords.velocity,this.coords.delta),this._scopeFire("interactions:move",u),i||this.simulation||(this.interacting()&&(u.type=null,this.move(u)),this.pointerWasMoved&&Cn.pointer.copyCoords(this.coords.prev,this.coords.cur))}},{key:"move",value:function(t){t&&t.event||Cn.pointer.setZeroCoords(this.coords.delta),(t=Cn.extend({pointer:this._latestPointer.pointer,event:this._latestPointer.event,eventTarget:this._latestPointer.eventTarget,interaction:this},t||{})).phase="move",this._doPhase(t)}},{key:"pointerUp",value:function(t,e,n,r){var o=this.getPointerIndex(t);-1===o&&(o=this.updatePointer(t,e,n,!1));var i=/cancel$/i.test(e.type)?"cancel":"up";this._scopeFire("interactions:".concat(i),{pointer:t,pointerIndex:o,pointerInfo:this.pointers[o],event:e,eventTarget:n,type:i,curEventTarget:r,interaction:this}),this.simulation||this.end(e),this.pointerIsDown=!1,this.removePointer(t,e)}},{key:"documentBlur",value:function(t){this.end(t),this._scopeFire("interactions:blur",{event:t,type:"blur",interaction:this})}},{key:"end",value:function(t){var e;this._ending=!0,t=t||this._latestPointer.event,this.interacting()&&(e=this._doPhase({event:t,interaction:this,phase:"end"})),!(this._ending=!1)===e&&this.stop()}},{key:"currentAction",value:function(){return this._interacting?this.prepared.name:null}},{key:"interacting",value:function(){return this._interacting}},{key:"stop",value:function(){this._scopeFire("interactions:stop",{interaction:this}),this.interactable=this.element=null,this._interacting=!1,this._stopped=!0,this.prepared.name=this.prevEvent=null}},{key:"getPointerIndex",value:function(t){var e=Cn.pointer.getPointerId(t);return"mouse"===this.pointerType||"pen"===this.pointerType?this.pointers.length-1:Cn.arr.findIndex(this.pointers,function(t){return t.id===e})}},{key:"getPointerInfo",value:function(t){return this.pointers[this.getPointerIndex(t)]}},{key:"updatePointer",value:function(t,e,n,r){var o=Cn.pointer.getPointerId(t),i=this.getPointerIndex(t),a=this.pointers[i];return r=!1!==r&&(r||/(down|start)$/i.test(e.type)),a?a.pointer=t:(a=new Rn.default(o,t,e,null,null),i=this.pointers.length,this.pointers.push(a)),Cn.pointer.setCoords(this.coords.cur,this.pointers.map(function(t){return t.pointer}),this._now()),Cn.pointer.setCoordDeltas(this.coords.delta,this.coords.prev,this.coords.cur),r&&(this.pointerIsDown=!0,a.downTime=this.coords.cur.timeStamp,a.downTarget=n,Cn.pointer.pointerExtend(this.downPointer,t),this.interacting()||(Cn.pointer.copyCoords(this.coords.start,this.coords.cur),Cn.pointer.copyCoords(this.coords.prev,this.coords.cur),this.downEvent=e,this.pointerWasMoved=!1)),this._updateLatestPointer(t,e,n),this._scopeFire("interactions:update-pointer",{pointer:t,event:e,eventTarget:n,down:r,pointerInfo:a,pointerIndex:i,interaction:this}),i}},{key:"removePointer",value:function(t,e){var n=this.getPointerIndex(t);if(-1!==n){var r=this.pointers[n];this._scopeFire("interactions:remove-pointer",{pointer:t,event:e,eventTarget:null,pointerIndex:n,pointerInfo:r,interaction:this}),this.pointers.splice(n,1)}}},{key:"_updateLatestPointer",value:function(t,e,n){this._latestPointer.pointer=t,this._latestPointer.event=e,this._latestPointer.eventTarget=n}},{key:"destroy",value:function(){this._latestPointer.pointer=null,this._latestPointer.event=null,this._latestPointer.eventTarget=null}},{key:"_createPreparedEvent",value:function(t,e,n,r){return new Wn.default(this,t,this.prepared.name,e,this.element,n,r)}},{key:"_fireEvent",value:function(t){this.interactable.fire(t),(!this.prevEvent||t.timeStamp>=this.prevEvent.timeStamp)&&(this.prevEvent=t)}},{key:"_doPhase",value:function(t){var e=t.event,n=t.phase,r=t.preEnd,o=t.type,i=this.rect;if(i&&"move"===n&&(Cn.rect.addEdges(this.edges,i,this.coords.delta[this.interactable.options.deltaSource]),i.width=i.right-i.left,i.height=i.bottom-i.top),!1===this._scopeFire("interactions:before-action-".concat(n),t))return!1;var a=t.iEvent=this._createPreparedEvent(e,n,r,o);return this._scopeFire("interactions:action-".concat(n),t),"start"===n&&(this.prevEvent=a),this._fireEvent(a),this._scopeFire("interactions:after-action-".concat(n),t),!0}},{key:"_now",value:function(){return Date.now()}}]),l}(),qn=En.Interaction=Vn;En.default=qn;var Un={};function Gn(t){return(Gn="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Un,"__esModule",{value:!0}),Un.install=Jn,Un.default=void 0;var Hn=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Gn(t)&&"function"!=typeof t)return{default:t};var e=Kn();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function Kn(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Kn=function(){return t},t}function $n(t){return/^(always|never|auto)$/.test(t)?(this.options.preventDefault=t,this):Hn.bool(t)?(this.options.preventDefault=t?"always":"never",this):this.options.preventDefault}function Zn(t){var e=t.interaction,n=t.event;e.interactable&&e.interactable.checkAndPreventDefault(n)}function Jn(r){var t=r.Interactable;t.prototype.preventDefault=$n,t.prototype.checkAndPreventDefault=function(t){return function(t,e,n){var r=t.options.preventDefault;if("never"!==r)if("always"!==r){if(e.events.supportsPassive&&/^touch(start|move)$/.test(n.type)){var o=(0,O.getWindow)(n.target).document,i=e.getDocOptions(o);if(!i||!i.events||!1!==i.events.passive)return}/^(mouse|pointer|touch)*(down|start)/i.test(n.type)||Hn.element(n.target)&&(0,$.matchesSelector)(n.target,"input,select,textarea,[contenteditable=true],[contenteditable=true] *")||n.preventDefault()}else n.preventDefault()}(this,r,t)},r.interactions.docEvents.push({type:"dragstart",listener:function(t){for(var e=0;e<r.interactions.list.length;e++){var n=r.interactions.list[e];if(n.element&&(n.element===t.target||(0,$.nodeContains)(n.element,t.target)))return void n.interactable.checkAndPreventDefault(t)}}})}var Qn={id:"core/interactablePreventDefault",install:Jn,listeners:["down","move","up","cancel"].reduce(function(t,e){return t["interactions:".concat(e)]=Zn,t},{})};Un.default=Qn;var tr={};function er(t){return(er="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(tr,"__esModule",{value:!0}),tr.default=void 0;var nr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==er(t)&&"function"!=typeof t)return{default:t};var e=rr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($);function rr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return rr=function(){return t},t}var or={methodOrder:["simulationResume","mouseOrPen","hasPointer","idle"],search:function(t){for(var e=0;e<or.methodOrder.length;e++){var n;n=or.methodOrder[e];var r=or[n](t);if(r)return r}return null},simulationResume:function(t){var e=t.pointerType,n=t.eventType,r=t.eventTarget,o=t.scope;if(!/down|start/i.test(n))return null;for(var i=0;i<o.interactions.list.length;i++){var a=o.interactions.list[i],u=r;if(a.simulation&&a.simulation.allowResume&&a.pointerType===e)for(;u;){if(u===a.element)return a;u=nr.parentNode(u)}}return null},mouseOrPen:function(t){var e,n=t.pointerId,r=t.pointerType,o=t.eventType,i=t.scope;if("mouse"!==r&&"pen"!==r)return null;for(var a=0;a<i.interactions.list.length;a++){var u=i.interactions.list[a];if(u.pointerType===r){if(u.simulation&&!ir(u,n))continue;if(u.interacting())return u;e=e||u}}if(e)return e;for(var s=0;s<i.interactions.list.length;s++){var l=i.interactions.list[s];if(!(l.pointerType!==r||/down/i.test(o)&&l.simulation))return l}return null},hasPointer:function(t){for(var e=t.pointerId,n=t.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(ir(o,e))return o}return null},idle:function(t){for(var e=t.pointerType,n=t.scope,r=0;r<n.interactions.list.length;r++){var o=n.interactions.list[r];if(1===o.pointers.length){var i=o.interactable;if(i&&(!i.options.gesture||!i.options.gesture.enabled))continue}else if(2<=o.pointers.length)continue;if(!o.interacting()&&e===o.pointerType)return o}return null}};function ir(t,e){return t.pointers.some(function(t){return t.id===e})}var ar=or;tr.default=ar;var ur={};Object.defineProperty(ur,"__esModule",{value:!0}),ur.default=void 0;var sr,lr=(sr=Me)&&sr.__esModule?sr:{default:sr},cr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==pr(t)&&"function"!=typeof t)return{default:t};var e=fr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(S);function fr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return fr=function(){return t},t}function pr(t){return(pr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function dr(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function vr(t){return(vr=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function yr(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function hr(t,e){return(hr=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function gr(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var br=function(){function l(t,e,n){var r,o,i;!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,l),o=this,r=!(i=vr(l).call(this,e._interaction))||"object"!==pr(i)&&"function"!=typeof i?yr(o):i,gr(yr(r),"target",void 0),gr(yr(r),"dropzone",void 0),gr(yr(r),"dragEvent",void 0),gr(yr(r),"relatedTarget",void 0),gr(yr(r),"draggable",void 0),gr(yr(r),"timeStamp",void 0),gr(yr(r),"propagationStopped",!1),gr(yr(r),"immediatePropagationStopped",!1);var a="dragleave"===n?t.prev:t.cur,u=a.element,s=a.dropzone;return r.type=n,r.target=u,r.currentTarget=u,r.dropzone=s,r.dragEvent=e,r.relatedTarget=e.target,r.draggable=e.interactable,r.timeStamp=e.timeStamp,r}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&hr(t,e)}(l,lr["default"]),t=l,(e=[{key:"reject",value:function(){var r=this,t=this._interaction.dropState;if("dropactivate"===this.type||this.dropzone&&t.cur.dropzone===this.dropzone&&t.cur.element===this.target)if(t.prev.dropzone=this.dropzone,t.prev.element=this.target,t.rejected=!0,t.events.enter=null,this.stopImmediatePropagation(),"dropactivate"===this.type){var e=t.activeDrops,n=cr.findIndex(e,function(t){var e=t.dropzone,n=t.element;return e===r.dropzone&&n===r.target});t.activeDrops.splice(n,1);var o=new l(t,this.dragEvent,"dropdeactivate");o.dropzone=this.dropzone,o.target=this.target,this.dropzone.fire(o)}else this.dropzone.fire(new l(t,this.dragEvent,"dragleave"))}},{key:"preventDefault",value:function(){}},{key:"stopPropagation",value:function(){this.propagationStopped=!0}},{key:"stopImmediatePropagation",value:function(){this.immediatePropagationStopped=this.propagationStopped=!0}}])&&dr(t.prototype,e),n&&dr(t,n),l}();ur.default=br;var mr={};function Or(t){return(Or="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(mr,"__esModule",{value:!0}),mr.default=void 0;Sr(k({})),Sr(m({}));var wr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Or(t)&&"function"!=typeof t)return{default:t};var e=xr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),_r=Sr(v),Pr=Sr(ur);function xr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return xr=function(){return t},t}function Sr(t){return t&&t.__esModule?t:{default:t}}function jr(t,e){for(var n=0;n<t.slice().length;n++){r=t.slice()[n];var r,o=r.dropzone,i=r.element;e.dropzone=o,e.target=i,o.fire(e),e.propagationStopped=e.immediatePropagationStopped=!1}}function Mr(t,e){for(var n=function(t,e){for(var n=t.interactables,r=[],o=0;o<n.list.length;o++){var i=n.list[o];if(i.options.drop.enabled){var a=i.options.drop.accept;if(!(wr.is.element(a)&&a!==e||wr.is.string(a)&&!wr.dom.matchesSelector(e,a)||wr.is.func(a)&&!a({dropzone:i,draggableElement:e})))for(var u=wr.is.string(i.target)?i._context.querySelectorAll(i.target):wr.is.array(i.target)?i.target:[i.target],s=0;s<u.length;s++){var l;l=u[s];l!==e&&r.push({dropzone:i,element:l})}}}return r}(t,e),r=0;r<n.length;r++){var o;o=n[r];o.rect=o.dropzone.getRect(o.element)}return n}function kr(t,e,n){for(var r=t.dropState,o=t.interactable,i=t.element,a=[],u=0;u<r.activeDrops.length;u++){s=r.activeDrops[u];var s,l=s.dropzone,c=s.element,f=s.rect;a.push(l.dropCheck(e,n,o,i,c,f)?c:null)}var p=wr.dom.indexOfDeepestElement(a);return r.activeDrops[p]||null}function Er(t,e,n){var r=t.dropState,o={enter:null,leave:null,activate:null,deactivate:null,move:null,drop:null};return"dragstart"===n.type&&(o.activate=new Pr.default(r,n,"dropactivate"),o.activate.target=null,o.activate.dropzone=null),"dragend"===n.type&&(o.deactivate=new Pr.default(r,n,"dropdeactivate"),o.deactivate.target=null,o.deactivate.dropzone=null),r.rejected||(r.cur.element!==r.prev.element&&(r.prev.dropzone&&(o.leave=new Pr.default(r,n,"dragleave"),n.dragLeave=o.leave.target=r.prev.element,n.prevDropzone=o.leave.dropzone=r.prev.dropzone),r.cur.dropzone&&(o.enter=new Pr.default(r,n,"dragenter"),n.dragEnter=r.cur.element,n.dropzone=r.cur.dropzone)),"dragend"===n.type&&r.cur.dropzone&&(o.drop=new Pr.default(r,n,"drop"),n.dropzone=r.cur.dropzone,n.relatedTarget=r.cur.element),"dragmove"===n.type&&r.cur.dropzone&&(o.move=new Pr.default(r,n,"dropmove"),(o.move.dragmove=n).dropzone=r.cur.dropzone)),o}function Tr(t,e){var n=t.dropState,r=n.activeDrops,o=n.cur,i=n.prev;e.leave&&i.dropzone.fire(e.leave),e.move&&o.dropzone.fire(e.move),e.enter&&o.dropzone.fire(e.enter),e.drop&&o.dropzone.fire(e.drop),e.deactivate&&jr(r,e.deactivate),n.prev.dropzone=o.dropzone,n.prev.element=o.element}function Dr(t,e){var n=t.interaction,r=t.iEvent,o=t.event;if("dragmove"===r.type||"dragend"===r.type){var i=n.dropState;e.dynamicDrop&&(i.activeDrops=Mr(e,n.element));var a=r,u=kr(n,a,o);i.rejected=i.rejected&&!!u&&u.dropzone===i.cur.dropzone&&u.element===i.cur.element,i.cur.dropzone=u&&u.dropzone,i.cur.element=u&&u.element,i.events=Er(n,0,a)}}var Ir={id:"actions/drop",install:function(e){var t=e.actions,n=e.interactStatic,r=e.Interactable,o=e.defaults;e.usePlugin(_r.default),r.prototype.dropzone=function(t){return function(t,e){if(wr.is.object(e)){if(t.options.drop.enabled=!1!==e.enabled,e.listeners){var n=wr.normalizeListeners(e.listeners),r=Object.keys(n).reduce(function(t,e){return t[/^(enter|leave)/.test(e)?"drag".concat(e):/^(activate|deactivate|move)/.test(e)?"drop".concat(e):e]=n[e],t},{});t.off(t.options.drop.listeners),t.on(r),t.options.drop.listeners=r}return wr.is.func(e.ondrop)&&t.on("drop",e.ondrop),wr.is.func(e.ondropactivate)&&t.on("dropactivate",e.ondropactivate),wr.is.func(e.ondropdeactivate)&&t.on("dropdeactivate",e.ondropdeactivate),wr.is.func(e.ondragenter)&&t.on("dragenter",e.ondragenter),wr.is.func(e.ondragleave)&&t.on("dragleave",e.ondragleave),wr.is.func(e.ondropmove)&&t.on("dropmove",e.ondropmove),/^(pointer|center)$/.test(e.overlap)?t.options.drop.overlap=e.overlap:wr.is.number(e.overlap)&&(t.options.drop.overlap=Math.max(Math.min(1,e.overlap),0)),"accept"in e&&(t.options.drop.accept=e.accept),"checker"in e&&(t.options.drop.checker=e.checker),t}if(wr.is.bool(e))return t.options.drop.enabled=e,t;return t.options.drop}(this,t)},r.prototype.dropCheck=function(t,e,n,r,o,i){return function(t,e,n,r,o,i,a){var u=!1;if(!(a=a||t.getRect(i)))return!!t.options.drop.checker&&t.options.drop.checker(e,n,u,t,i,r,o);var s=t.options.drop.overlap;if("pointer"===s){var l=wr.getOriginXY(r,o,"drag"),c=wr.pointer.getPageXY(e);c.x+=l.x,c.y+=l.y;var f=c.x>a.left&&c.x<a.right,p=c.y>a.top&&c.y<a.bottom;u=f&&p}var d=r.getRect(o);if(d&&"center"===s){var v=d.left+d.width/2,y=d.top+d.height/2;u=v>=a.left&&v<=a.right&&y>=a.top&&y<=a.bottom}if(d&&wr.is.number(s)){var h=Math.max(0,Math.min(a.right,d.right)-Math.max(a.left,d.left))*Math.max(0,Math.min(a.bottom,d.bottom)-Math.max(a.top,d.top))/(d.width*d.height);u=s<=h}t.options.drop.checker&&(u=t.options.drop.checker(e,n,u,t,i,r,o));return u}(this,t,e,n,r,o,i)},n.dynamicDrop=function(t){return wr.is.bool(t)?(e.dynamicDrop=t,n):e.dynamicDrop},wr.extend(t.phaselessTypes,{dragenter:!0,dragleave:!0,dropactivate:!0,dropdeactivate:!0,dropmove:!0,drop:!0}),t.methodDict.drop="dropzone",e.dynamicDrop=!1,o.actions.drop=Ir.defaults},listeners:{"interactions:before-action-start":function(t){var e=t.interaction;"drag"===e.prepared.name&&(e.dropState={cur:{dropzone:null,element:null},prev:{dropzone:null,element:null},rejected:null,events:null,activeDrops:[]})},"interactions:after-action-start":function(t,e){var n=t.interaction,r=(t.event,t.iEvent);if("drag"===n.prepared.name){var o=n.dropState;o.activeDrops=null,o.events=null,o.activeDrops=Mr(e,n.element),o.events=Er(n,0,r),o.events.activate&&(jr(o.activeDrops,o.events.activate),e.fire("actions/drop:start",{interaction:n,dragEvent:r}))}},"interactions:action-move":Dr,"interactions:action-end":Dr,"interactions:after-action-move":function(t,e){var n=t.interaction,r=t.iEvent;"drag"===n.prepared.name&&(Tr(n,n.dropState.events),e.fire("actions/drop:move",{interaction:n,dragEvent:r}),n.dropState.events={})},"interactions:after-action-end":function(t,e){var n=t.interaction,r=t.iEvent;"drag"===n.prepared.name&&(Tr(n,n.dropState.events),e.fire("actions/drop:end",{interaction:n,dragEvent:r}))},"interactions:stop":function(t){var e=t.interaction;if("drag"===e.prepared.name){var n=e.dropState;n&&(n.activeDrops=null,n.events=null,n.cur.dropzone=null,n.cur.element=null,n.prev.dropzone=null,n.prev.element=null,n.rejected=!1)}}},getActiveDrops:Mr,getDrop:kr,getDropEvents:Er,fireDropEvents:Tr,defaults:{enabled:!1,accept:null,overlap:"pointer"}},zr=Ir;mr.default=zr;var Ar={};function Cr(t){return(Cr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ar,"__esModule",{value:!0}),Ar.default=void 0;var Wr=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Cr(t)&&"function"!=typeof t)return{default:t};var e=Rr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le);function Rr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Rr=function(){return t},t}function Fr(t){var e=t.interaction,n=t.iEvent,r=t.phase;if("gesture"===e.prepared.name){var o=e.pointers.map(function(t){return t.pointer}),i="start"===r,a="end"===r,u=e.interactable.options.deltaSource;if(n.touches=[o[0],o[1]],i)n.distance=Wr.pointer.touchDistance(o,u),n.box=Wr.pointer.touchBBox(o),n.scale=1,n.ds=0,n.angle=Wr.pointer.touchAngle(o,u),n.da=0,e.gesture.startDistance=n.distance,e.gesture.startAngle=n.angle;else if(a){var s=e.prevEvent;n.distance=s.distance,n.box=s.box,n.scale=s.scale,n.ds=0,n.angle=s.angle,n.da=0}else n.distance=Wr.pointer.touchDistance(o,u),n.box=Wr.pointer.touchBBox(o),n.scale=n.distance/e.gesture.startDistance,n.angle=Wr.pointer.touchAngle(o,u),n.ds=n.scale-e.gesture.scale,n.da=n.angle-e.gesture.angle;e.gesture.distance=n.distance,e.gesture.angle=n.angle,Wr.is.number(n.scale)&&n.scale!==1/0&&!isNaN(n.scale)&&(e.gesture.scale=n.scale)}}var Xr={id:"actions/gesture",before:["actions/drag","actions/resize"],install:function(t){var e=t.actions,n=t.Interactable,r=t.defaults;n.prototype.gesturable=function(t){return Wr.is.object(t)?(this.options.gesture.enabled=!1!==t.enabled,this.setPerAction("gesture",t),this.setOnEvents("gesture",t),this):Wr.is.bool(t)?(this.options.gesture.enabled=t,this):this.options.gesture},e.map.gesture=Xr,e.methodDict.gesture="gesturable",r.actions.gesture=Xr.defaults},listeners:{"interactions:action-start":Fr,"interactions:action-move":Fr,"interactions:action-end":Fr,"interactions:new":function(t){t.interaction.gesture={angle:0,distance:0,scale:1,startAngle:0,startDistance:0}},"auto-start:check":function(t){if(!(t.interaction.pointers.length<2)){var e=t.interactable.options.gesture;if(e&&e.enabled)return!(t.action={name:"gesture"})}}},defaults:{},getCursor:function(){return""}},Yr=Xr;Ar.default=Yr;var Nr={};function Lr(t){return(Lr="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Nr,"__esModule",{value:!0}),Nr.default=void 0;var Br,Vr=Hr($),qr=(Br=ct)&&Br.__esModule?Br:{default:Br},Ur=Hr(w);function Gr(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Gr=function(){return t},t}function Hr(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Lr(t)&&"function"!=typeof t)return{default:t};var e=Gr();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function Kr(t,e,n,r,o,i,a){if(!e)return!1;if(!0===e){var u=Ur.number(i.width)?i.width:i.right-i.left,s=Ur.number(i.height)?i.height:i.bottom-i.top;if(a=Math.min(a,("left"===t||"right"===t?u:s)/2),u<0&&("left"===t?t="right":"right"===t&&(t="left")),s<0&&("top"===t?t="bottom":"bottom"===t&&(t="top")),"left"===t)return n.x<(0<=u?i.left:i.right)+a;if("top"===t)return n.y<(0<=s?i.top:i.bottom)+a;if("right"===t)return n.x>(0<=u?i.right:i.left)-a;if("bottom"===t)return n.y>(0<=s?i.bottom:i.top)-a}return!!Ur.element(r)&&(Ur.element(e)?e===r:Vr.matchesUpTo(r,e,o))}function $r(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.resizeAxes){var r=e;n.interactable.options.resize.square?("y"===n.resizeAxes?r.delta.x=r.delta.y:r.delta.y=r.delta.x,r.axes="xy"):(r.axes=n.resizeAxes,"x"===n.resizeAxes?r.delta.y=0:"y"===n.resizeAxes&&(r.delta.x=0))}}var Zr={id:"actions/resize",before:["actions/drag"],install:function(e){var t=e.actions,n=e.browser,r=e.Interactable,o=e.defaults;Zr.cursors=n.isIe9?{x:"e-resize",y:"s-resize",xy:"se-resize",top:"n-resize",left:"w-resize",bottom:"s-resize",right:"e-resize",topleft:"se-resize",bottomright:"se-resize",topright:"ne-resize",bottomleft:"ne-resize"}:{x:"ew-resize",y:"ns-resize",xy:"nwse-resize",top:"ns-resize",left:"ew-resize",bottom:"ns-resize",right:"ew-resize",topleft:"nwse-resize",bottomright:"nwse-resize",topright:"nesw-resize",bottomleft:"nesw-resize"},Zr.defaultMargin=n.supportsTouch||n.supportsPointerEvent?20:10,r.prototype.resizable=function(t){return function(t,e,n){if(Ur.object(e))return t.options.resize.enabled=!1!==e.enabled,t.setPerAction("resize",e),t.setOnEvents("resize",e),Ur.string(e.axis)&&/^x$|^y$|^xy$/.test(e.axis)?t.options.resize.axis=e.axis:null===e.axis&&(t.options.resize.axis=n.defaults.actions.resize.axis),Ur.bool(e.preserveAspectRatio)?t.options.resize.preserveAspectRatio=e.preserveAspectRatio:Ur.bool(e.square)&&(t.options.resize.square=e.square),t;if(Ur.bool(e))return t.options.resize.enabled=e,t;return t.options.resize}(this,t,e)},t.map.resize=Zr,t.methodDict.resize="resizable",o.actions.resize=Zr.defaults},listeners:{"interactions:new":function(t){t.interaction.resizeAxes="xy"},"interactions:action-start":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,o=n.rect;n._rects={start:(0,qr.default)({},o),corrected:(0,qr.default)({},o),previous:(0,qr.default)({},o),delta:{left:0,right:0,width:0,top:0,bottom:0,height:0}},r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta}}(t),$r(t)},"interactions:action-move":function(t){!function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e,o=n.interactable.options.resize.invert,i="reposition"===o||"negate"===o,a=n.rect,u=n._rects,s=u.start,l=u.corrected,c=u.delta,f=u.previous;if((0,qr.default)(f,l),i){if((0,qr.default)(l,a),"reposition"===o){if(l.top>l.bottom){var p=l.top;l.top=l.bottom,l.bottom=p}if(l.left>l.right){var d=l.left;l.left=l.right,l.right=d}}}else l.top=Math.min(a.top,s.bottom),l.bottom=Math.max(a.bottom,s.top),l.left=Math.min(a.left,s.right),l.right=Math.max(a.right,s.left);for(var v in l.width=l.right-l.left,l.height=l.bottom-l.top,l)c[v]=l[v]-f[v];r.edges=n.prepared.edges,r.rect=l,r.deltaRect=c}}(t),$r(t)},"interactions:action-end":function(t){var e=t.iEvent,n=t.interaction;if("resize"===n.prepared.name&&n.prepared.edges){var r=e;r.edges=n.prepared.edges,r.rect=n._rects.corrected,r.deltaRect=n._rects.delta}},"auto-start:check":function(t){var e=t.interaction,n=t.interactable,r=t.element,o=t.rect,i=t.buttons;if(o){var a=(0,qr.default)({},e.coords.cur.page),u=n.options.resize;if(u&&u.enabled&&(!e.pointerIsDown||!/mouse|pointer/.test(e.pointerType)||0!=(i&u.mouseButtons))){if(Ur.object(u.edges)){var s={left:!1,right:!1,top:!1,bottom:!1};for(var l in s)s[l]=Kr(l,u.edges[l],a,e._latestPointer.eventTarget,r,o,u.margin||Zr.defaultMargin);s.left=s.left&&!s.right,s.top=s.top&&!s.bottom,(s.left||s.right||s.top||s.bottom)&&(t.action={name:"resize",edges:s})}else{var c="y"!==u.axis&&a.x>o.right-Zr.defaultMargin,f="x"!==u.axis&&a.y>o.bottom-Zr.defaultMargin;(c||f)&&(t.action={name:"resize",axes:(c?"x":"")+(f?"y":"")})}return!t.action&&void 0}}}},defaults:{square:!1,preserveAspectRatio:!1,axis:"xy",margin:NaN,edges:null,invert:"none"},cursors:null,getCursor:function(t){var e=t.edges,n=t.axis,r=t.name,o=Zr.cursors,i=null;if(n)i=o[r+n];else if(e){for(var a="",u=["top","bottom","left","right"],s=0;s<u.length;s++){var l=u[s];e[l]&&(a+=l)}i=o[a]}return i},defaultMargin:null},Jr=Zr;Nr.default=Jr;var Qr={};Object.defineProperty(Qr,"__esModule",{value:!0}),Object.defineProperty(Qr,"drag",{enumerable:!0,get:function(){return to.default}}),Object.defineProperty(Qr,"drop",{enumerable:!0,get:function(){return eo.default}}),Object.defineProperty(Qr,"gesture",{enumerable:!0,get:function(){return no.default}}),Object.defineProperty(Qr,"resize",{enumerable:!0,get:function(){return ro.default}}),Qr.default=void 0;var to=oo(v),eo=oo(mr),no=oo(Ar),ro=oo(Nr);function oo(t){return t&&t.__esModule?t:{default:t}}var io={id:"actions",install:function(t){t.usePlugin(no.default),t.usePlugin(ro.default),t.usePlugin(to.default),t.usePlugin(eo.default)}};Qr.default=io;var ao={};Object.defineProperty(ao,"__esModule",{value:!0}),ao.default=void 0;ao.default={};var uo={};function so(t){return(so="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(uo,"__esModule",{value:!0}),uo.getContainer=go,uo.getScroll=bo,uo.getScrollSize=function(t){fo.window(t)&&(t=window.document.body);return{x:t.scrollWidth,y:t.scrollHeight}},uo.getScrollSizeDelta=function(t,e){var n=t.interaction,r=t.element,o=n&&n.interactable.options[n.prepared.name].autoScroll;if(!o||!o.enabled)return e(),{x:0,y:0};var i=go(o.container,n.interactable,r),a=bo(i);e();var u=bo(i);return{x:u.x-a.x,y:u.y-a.y}},uo.default=void 0;var lo,co=yo($),fo=yo(w),po=(lo=oe)&&lo.__esModule?lo:{default:lo};function vo(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return vo=function(){return t},t}function yo(t){if(t&&t.__esModule)return t;if(null===t||"object"!==so(t)&&"function"!=typeof t)return{default:t};var e=vo();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}var ho={defaults:{enabled:!1,margin:60,container:null,speed:300},now:Date.now,interaction:null,i:0,x:0,y:0,isScrolling:!1,prevTime:0,margin:0,speed:0,start:function(t){ho.isScrolling=!0,po.default.cancel(ho.i),(t.autoScroll=ho).interaction=t,ho.prevTime=ho.now(),ho.i=po.default.request(ho.scroll)},stop:function(){ho.isScrolling=!1,ho.interaction&&(ho.interaction.autoScroll=null),po.default.cancel(ho.i)},scroll:function(){var t=ho.interaction,e=t.interactable,n=t.element,r=t.prepared.name,o=e.options[r].autoScroll,i=go(o.container,e,n),a=ho.now(),u=(a-ho.prevTime)/1e3,s=o.speed*u;if(1<=s){var l={x:ho.x*s,y:ho.y*s};if(l.x||l.y){var c=bo(i);fo.window(i)?i.scrollBy(l.x,l.y):i&&(i.scrollLeft+=l.x,i.scrollTop+=l.y);var f=bo(i),p={x:f.x-c.x,y:f.y-c.y};(p.x||p.y)&&e.fire({type:"autoscroll",target:n,interactable:e,delta:p,interaction:t,container:i})}ho.prevTime=a}ho.isScrolling&&(po.default.cancel(ho.i),ho.i=po.default.request(ho.scroll))},check:function(t,e){var n=t.options;return n[e].autoScroll&&n[e].autoScroll.enabled},onInteractionMove:function(t){var e=t.interaction,n=t.pointer;if(e.interacting()&&ho.check(e.interactable,e.prepared.name))if(e.simulation)ho.x=ho.y=0;else{var r,o,i,a,u=e.interactable,s=e.element,l=e.prepared.name,c=u.options[l].autoScroll,f=go(c.container,u,s);if(fo.window(f))a=n.clientX<ho.margin,r=n.clientY<ho.margin,o=n.clientX>f.innerWidth-ho.margin,i=n.clientY>f.innerHeight-ho.margin;else{var p=co.getElementClientRect(f);a=n.clientX<p.left+ho.margin,r=n.clientY<p.top+ho.margin,o=n.clientX>p.right-ho.margin,i=n.clientY>p.bottom-ho.margin}ho.x=o?1:a?-1:0,ho.y=i?1:r?-1:0,ho.isScrolling||(ho.margin=c.margin,ho.speed=c.speed,ho.start(e))}}};function go(t,e,n){return(fo.string(t)?(0,$t.getStringOptionResult)(t,e,n):t)||(0,O.getWindow)(n)}function bo(t){return fo.window(t)&&(t=window.document.body),{x:t.scrollLeft,y:t.scrollTop}}var mo={id:"auto-scroll",install:function(t){var e=t.defaults,n=t.actions;(t.autoScroll=ho).now=function(){return t.now()},n.phaselessTypes.autoscroll=!0,e.perAction.autoScroll=ho.defaults},listeners:{"interactions:new":function(t){t.interaction.autoScroll=null},"interactions:destroy":function(t){t.interaction.autoScroll=null,ho.stop(),ho.interaction&&(ho.interaction=null)},"interactions:stop":ho.stop,"interactions:action-move":function(t){return ho.onInteractionMove(t)}}};uo.default=mo;var Oo={};function wo(t){return(wo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Oo,"__esModule",{value:!0}),Oo.default=void 0;var _o=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==wo(t)&&"function"!=typeof t)return{default:t};var e=Po();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function Po(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Po=function(){return t},t}function xo(t){return _o.bool(t)?(this.options.styleCursor=t,this):null===t?(delete this.options.styleCursor,this):this.options.styleCursor}function So(t){return _o.func(t)?(this.options.actionChecker=t,this):null===t?(delete this.options.actionChecker,this):this.options.actionChecker}var jo={id:"auto-start/interactableMethods",install:function(d){var t=d.Interactable;t.prototype.getAction=function(t,e,n,r){var o,i,a,u,s,l,c,f,p=(i=e,a=n,u=r,s=d,l=(o=this).getRect(u),c=i.buttons||{0:1,1:4,3:8,4:16}[i.button],f={action:null,interactable:o,interaction:a,element:u,rect:l,buttons:c},s.fire("auto-start:check",f),f.action);return this.options.actionChecker?this.options.actionChecker(t,e,p,this,r,n):p},t.prototype.ignoreFrom=(0,le.warnOnce)(function(t){return this._backCompatOption("ignoreFrom",t)},"Interactable.ignoreFrom() has been deprecated. Use Interactble.draggable({ignoreFrom: newValue})."),t.prototype.allowFrom=(0,le.warnOnce)(function(t){return this._backCompatOption("allowFrom",t)},"Interactable.allowFrom() has been deprecated. Use Interactble.draggable({allowFrom: newValue})."),t.prototype.actionChecker=So,t.prototype.styleCursor=xo}};Oo.default=jo;var Mo={};function ko(t){return(ko="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Mo,"__esModule",{value:!0}),Mo.default=void 0;var Eo,To=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==ko(t)&&"function"!=typeof t)return{default:t};var e=Io();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),Do=(Eo=Oo)&&Eo.__esModule?Eo:{default:Eo};function Io(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Io=function(){return t},t}function zo(t,e,n,r,o){return e.testIgnoreAllow(e.options[t.name],n,r)&&e.options[t.name].enabled&&Ro(e,n,t,o)?t:null}function Ao(t,e,n,r,o,i,a){for(var u=0,s=r.length;u<s;u++){var l=r[u],c=o[u],f=l.getAction(e,n,t,c);if(f){var p=zo(f,l,c,i,a);if(p)return{action:p,interactable:l,element:c}}}return{action:null,interactable:null,element:null}}function Co(t,e,n,r,o){var i=[],a=[],u=r;function s(t){i.push(t),a.push(u)}for(;To.is.element(u);){i=[],a=[],o.interactables.forEachMatch(u,s);var l=Ao(t,e,n,i,a,r,o);if(l.action&&!l.interactable.options[l.action.name].manualStart)return l;u=To.dom.parentNode(u)}return{action:null,interactable:null,element:null}}function Wo(t,e,n){var r=e.action,o=e.interactable,i=e.element;r=r||{name:null},t.interactable=o,t.element=i,To.copyAction(t.prepared,r),t.rect=o&&r.name?o.getRect(i):null,Yo(t,n),n.fire("autoStart:prepared",{interaction:t})}function Ro(t,e,n,r){var o=t.options,i=o[n.name].max,a=o[n.name].maxPerElement,u=r.autoStart.maxInteractions,s=0,l=0,c=0;if(!(i&&a&&u))return!1;for(var f=0;f<r.interactions.list.length;f++){var p=r.interactions.list[f],d=p.prepared.name;if(p.interacting()){if(u<=++s)return!1;if(p.interactable===t){if(i<=(l+=d===n.name?1:0))return!1;if(p.element===e&&(c++,d===n.name&&a<=c))return!1}}}return 0<u}function Fo(t,e){return To.is.number(t)?(e.autoStart.maxInteractions=t,this):e.autoStart.maxInteractions}function Xo(t,e,n){var r=n.autoStart.cursorElement;r&&r!==t&&(r.style.cursor=""),t.ownerDocument.documentElement.style.cursor=e,t.style.cursor=e,n.autoStart.cursorElement=e?t:null}function Yo(t,e){var n=t.interactable,r=t.element,o=t.prepared;if("mouse"===t.pointerType&&n&&n.options.styleCursor){var i="";if(o.name){var a=n.options[o.name].cursorChecker;i=To.is.func(a)?a(o,n,r,t._interacting):e.actions.map[o.name].getCursor(o)}Xo(t.element,i||"",e)}else e.autoStart.cursorElement&&Xo(e.autoStart.cursorElement,"",e)}var No={id:"auto-start/base",before:["actions","actions/drag","actions/resize","actions/gesture"],install:function(e){var t=e.interactStatic,n=e.defaults;e.usePlugin(Do.default),n.base.actionChecker=null,n.base.styleCursor=!0,To.extend(n.perAction,{manualStart:!1,max:1/0,maxPerElement:1,allowFrom:null,ignoreFrom:null,mouseButtons:1}),t.maxInteractions=function(t){return Fo(t,e)},e.autoStart={maxInteractions:1/0,withinInteractionLimit:Ro,cursorElement:null}},listeners:{"interactions:down":function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget;n.interacting()||Wo(n,Co(n,r,o,i,e),e)},"interactions:move":function(t,e){var n,r,o,i,a,u;r=e,o=(n=t).interaction,i=n.pointer,a=n.event,u=n.eventTarget,"mouse"!==o.pointerType||o.pointerIsDown||o.interacting()||Wo(o,Co(o,i,a,u,r),r),function(t,e){var n=t.interaction;if(n.pointerIsDown&&!n.interacting()&&n.pointerWasMoved&&n.prepared.name){e.fire("autoStart:before-start",t);var r=n.interactable,o=n.prepared.name;o&&r&&(r.options[o].manualStart||!Ro(r,n.element,n.prepared,e)?n.stop():(n.start(n.prepared,r,n.element),Yo(n,e)))}}(t,e)},"interactions:stop":function(t,e){var n=t.interaction,r=n.interactable;r&&r.options.styleCursor&&Xo(n.element,"",e)}},maxInteractions:Fo,withinInteractionLimit:Ro,validateAction:zo};Mo.default=No;var Lo={};function Bo(t){return(Bo="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Lo,"__esModule",{value:!0}),Lo.default=void 0;var Vo,qo=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Bo(t)&&"function"!=typeof t)return{default:t};var e=Go();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w),Uo=(Vo=Mo)&&Vo.__esModule?Vo:{default:Vo};function Go(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Go=function(){return t},t}var Ho={id:"auto-start/dragAxis",listeners:{"autoStart:before-start":function(t,r){var o=t.interaction,i=t.eventTarget,e=t.dx,n=t.dy;if("drag"===o.prepared.name){var a=Math.abs(e),u=Math.abs(n),s=o.interactable.options.drag,l=s.startAxis,c=u<a?"x":a<u?"y":"xy";if(o.prepared.axis="start"===s.lockAxis?c[0]:s.lockAxis,"xy"!=c&&"xy"!==l&&l!==c){o.prepared.name=null;function f(t){if(t!==o.interactable){var e=o.interactable.options.drag;if(!e.manualStart&&t.testIgnoreAllow(e,p,i)){var n=t.getAction(o.downPointer,o.downEvent,o,p);if(n&&"drag"===n.name&&function(t,e){if(!e)return;var n=e.options.drag.startAxis;return"xy"===t||"xy"===n||n===t}(c,t)&&Uo.default.validateAction(n,t,p,i,r))return t}}}for(var p=i;qo.element(p);){var d=r.interactables.forEachMatch(p,f);if(d){o.prepared.name="drag",o.interactable=d,o.element=p;break}p=(0,$.parentNode)(p)}}}}}};Lo.default=Ho;var Ko={};Object.defineProperty(Ko,"__esModule",{value:!0}),Ko.default=void 0;var $o,Zo=($o=Mo)&&$o.__esModule?$o:{default:$o};function Jo(t){var e=t.prepared&&t.prepared.name;if(!e)return null;var n=t.interactable.options;return n[e].hold||n[e].delay}var Qo={id:"auto-start/hold",install:function(t){var e=t.defaults;t.usePlugin(Zo.default),e.perAction.hold=0,e.perAction.delay=0},listeners:{"interactions:new":function(t){t.interaction.autoStartHoldTimer=null},"autoStart:prepared":function(t){var e=t.interaction,n=Jo(e);0<n&&(e.autoStartHoldTimer=setTimeout(function(){e.start(e.prepared,e.interactable,e.element)},n))},"interactions:move":function(t){var e=t.interaction,n=t.duplicate;e.pointerWasMoved&&!n&&clearTimeout(e.autoStartHoldTimer)},"autoStart:before-start":function(t){var e=t.interaction;0<Jo(e)&&(e.prepared.name=null)}},getHoldDuration:Jo};Ko.default=Qo;var ti={};Object.defineProperty(ti,"__esModule",{value:!0}),Object.defineProperty(ti,"autoStart",{enumerable:!0,get:function(){return ei.default}}),Object.defineProperty(ti,"dragAxis",{enumerable:!0,get:function(){return ni.default}}),Object.defineProperty(ti,"hold",{enumerable:!0,get:function(){return ri.default}}),ti.default=void 0;var ei=oi(Mo),ni=oi(Lo),ri=oi(Ko);function oi(t){return t&&t.__esModule?t:{default:t}}var ii={id:"auto-start",install:function(t){t.usePlugin(ei.default),t.usePlugin(ri.default),t.usePlugin(ni.default)}};ti.default=ii;var ai={};Object.defineProperty(ai,"__esModule",{value:!0}),ai.default=void 0;ai.default={};var ui={};Object.defineProperty(ui,"__esModule",{value:!0}),ui.default=void 0;ui.default={};var si={};function li(t){return(li="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(si,"__esModule",{value:!0}),si.default=void 0;var ci,fi,pi=hi(D),di=(hi(ct),function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==li(t)&&"function"!=typeof t)return{default:t};var e=yi();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w)),vi=hi(O);function yi(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return yi=function(){return t},t}function hi(t){return t&&t.__esModule?t:{default:t}}(fi=ci=ci||{}).touchAction="touchAction",fi.boxSizing="boxSizing",fi.noListeners="noListeners";var gi={touchAction:"https://developer.mozilla.org/en-US/docs/Web/CSS/touch-action",boxSizing:"https://developer.mozilla.org/en-US/docs/Web/CSS/box-sizing"};ci.touchAction,ci.boxSizing,ci.noListeners;function bi(t,e,n){return n.test(t.style[e]||vi.default.window.getComputedStyle(t)[e])}var mi="dev-tools",Oi={id:mi,install:function(){}};si.default=Oi;var wi={};Object.defineProperty(wi,"__esModule",{value:!0}),wi.default=void 0;wi.default={};var _i={};function Pi(t){return(Pi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(_i,"__esModule",{value:!0}),_i.getRectOffset=Ai,_i.default=void 0;var xi=ki(V),Si=ki(ct),ji=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Pi(t)&&"function"!=typeof t)return{default:t};var e=Mi();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function Mi(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Mi=function(){return t},t}function ki(t){return t&&t.__esModule?t:{default:t}}function Ei(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}function Ti(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Di(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Ii=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.interaction=t,Di(this,"states",[]),Di(this,"startOffset",{left:0,right:0,top:0,bottom:0}),Di(this,"startDelta",null),Di(this,"result",null),Di(this,"endResult",null),Di(this,"edges",void 0),this.result=zi()}var t,n,r;return t=e,(n=[{key:"start",value:function(t,e){var n=t.phase,r=this.interaction,o=function(t){var n=t.interactable.options[t.prepared.name],e=n.modifiers;if(e&&e.length)return e.filter(function(t){return!t.options||!1!==t.options.enabled});return["snap","snapSize","snapEdges","restrict","restrictEdges","restrictSize"].map(function(t){var e=n[t];return e&&e.enabled&&{options:e,methods:e._methods}}).filter(function(t){return!!t})}(r);this.prepareStates(o),this.edges=(0,Si.default)({},r.edges),this.startOffset=Ai(r.rect,e);var i={phase:n,pageCoords:e,preEnd:!(this.startDelta={x:0,y:0})};return this.result=zi(),this.startAll(i),this.result=this.setAll(i)}},{key:"fillArg",value:function(t){var e=this.interaction;t.interaction=e,t.interactable=e.interactable,t.element=e.element,t.rect=t.rect||e.rect,t.edges=this.edges,t.startOffset=this.startOffset}},{key:"startAll",value:function(t){this.fillArg(t);for(var e=0;e<this.states.length;e++){var n=this.states[e];n.methods.start&&(t.state=n).methods.start(t)}}},{key:"setAll",value:function(t){this.fillArg(t);var e=t.phase,n=t.preEnd,r=t.skipModifiers,o=t.rect;t.coords=(0,Si.default)({},t.pageCoords),t.rect=(0,Si.default)({},o);for(var i=r?this.states.slice(r):this.states,a=zi(t.coords,t.rect),u=0;u<i.length;u++){var s=i[u],l=s.options,c=(0,Si.default)({},t.coords),f=null;s.methods.set&&this.shouldDo(l,n,e)&&(f=(t.state=s).methods.set(t),ji.addEdges(this.interaction.edges,t.rect,{x:t.coords.x-c.x,y:t.coords.y-c.y})),a.eventProps.push(f)}a.delta.x=t.coords.x-t.pageCoords.x,a.delta.y=t.coords.y-t.pageCoords.y,a.rectDelta.left=t.rect.left-o.left,a.rectDelta.right=t.rect.right-o.right,a.rectDelta.top=t.rect.top-o.top,a.rectDelta.bottom=t.rect.bottom-o.bottom;var p=this.result.coords,d=this.result.rect;if(p&&d){var v=a.rect.left!==d.left||a.rect.right!==d.right||a.rect.top!==d.top||a.rect.bottom!==d.bottom;a.changed=v||p.x!==a.coords.x||p.y!==a.coords.y}return a}},{key:"applyToInteraction",value:function(t){var e=this.interaction,n=t.phase,r=e.coords.cur,o=e.coords.start,i=this.result,a=this.startDelta,u=i.delta;"start"===n&&(0,Si.default)(this.startDelta,i.delta);for(var s=0;s<[[o,a],[r,u]].length;s++){var l=Ei([[o,a],[r,u]][s],2),c=l[0],f=l[1];c.page.x+=f.x,c.page.y+=f.y,c.client.x+=f.x,c.client.y+=f.y}var p=this.result.rectDelta,d=t.rect||e.rect;d.left+=p.left,d.right+=p.right,d.top+=p.top,d.bottom+=p.bottom,d.width=d.right-d.left,d.height=d.bottom-d.top}},{key:"setAndApply",value:function(t){var e=this.interaction,n=t.phase,r=t.preEnd,o=t.skipModifiers,i=this.setAll({preEnd:r,phase:n,pageCoords:t.modifiedCoords||e.coords.cur.page});if(!(this.result=i).changed&&(!o||o<this.states.length)&&e.interacting())return!1;if(t.modifiedCoords){var a=e.coords.cur.page,u=t.modifiedCoords.x-a.x,s=t.modifiedCoords.y-a.y;i.coords.x+=u,i.coords.y+=s,i.delta.x+=u,i.delta.y+=s}this.applyToInteraction(t)}},{key:"beforeEnd",value:function(t){var e=t.interaction,n=t.event,r=this.states;if(r&&r.length){for(var o=!1,i=0;i<r.length;i++){var a=r[i],u=(t.state=a).options,s=a.methods,l=s.beforeEnd&&s.beforeEnd(t);if(l)return this.endResult=l,!1;o=o||!o&&this.shouldDo(u,!0,t.phase,!0)}o&&e.move({event:n,preEnd:!0})}}},{key:"stop",value:function(t){var e=t.interaction;if(this.states&&this.states.length){var n=(0,Si.default)({states:this.states,interactable:e.interactable,element:e.element,rect:null},t);this.fillArg(n);for(var r=0;r<this.states.length;r++){var o=this.states[r];(n.state=o).methods.stop&&o.methods.stop(n)}this.states=null,this.endResult=null}}},{key:"prepareStates",value:function(t){this.states=[];for(var e=0;e<t.length;e++){var n=t[e],r=n.options,o=n.methods,i=n.name;r&&!1===r.enabled||this.states.push({options:r,methods:o,index:e,name:i})}return this.states}},{key:"restoreInteractionCoords",value:function(t){var e=t.interaction,n=e.coords,r=e.rect,o=e.modification;if(o.result){for(var i=o.startDelta,a=o.result,u=a.delta,s=a.rectDelta,l=[[n.start,i],[n.cur,u]],c=0;c<l.length;c++){var f=Ei(l[c],2),p=f[0],d=f[1];p.page.x-=d.x,p.page.y-=d.y,p.client.x-=d.x,p.client.y-=d.y}r.left-=s.left,r.right-=s.right,r.top-=s.top,r.bottom-=s.bottom}}},{key:"shouldDo",value:function(t,e,n,r){return!(!t||!1===t.enabled||r&&!t.endOnly||t.endOnly&&!e||"start"===n&&!t.setStart)}},{key:"copyFrom",value:function(t){this.startOffset=t.startOffset,this.startDelta=t.startDelta,this.edges=t.edges,this.states=t.states.map(function(t){return(0,xi.default)(t)}),this.result=zi((0,Si.default)({},t.result.coords),(0,Si.default)({},t.result.rect))}},{key:"destroy",value:function(){for(var t in this)this[t]=null}}])&&Ti(t.prototype,n),r&&Ti(t,r),e}();function zi(t,e){return{rect:e,coords:t,delta:{x:0,y:0},rectDelta:{left:0,right:0,top:0,bottom:0},eventProps:[],changed:!0}}function Ai(t,e){return t?{left:e.x-t.left,top:e.y-t.top,right:t.right-e.x,bottom:t.bottom-e.y}:{left:0,top:0,right:0,bottom:0}}_i.default=Ii;var Ci={};Object.defineProperty(Ci,"__esModule",{value:!0}),Ci.makeModifier=function(t,r){function e(t){var e=t||{};for(var n in e.enabled=!1!==e.enabled,o)n in e||(e[n]=o[n]);return{options:e,methods:i,name:r}}var o=t.defaults,i={start:t.start,set:t.set,beforeEnd:t.beforeEnd,stop:t.stop};r&&"string"==typeof r&&(e._defaults=o,e._methods=i);return e},Ci.addEventModifiers=Fi,Ci.default=void 0;var Wi,Ri=(Wi=_i)&&Wi.__esModule?Wi:{default:Wi};function Fi(t){var e=t.iEvent,n=t.interaction.modification.result;n&&(e.modifiers=n.eventProps)}var Xi={id:"modifiers/base",install:function(t){t.defaults.perAction.modifiers=[]},listeners:{"interactions:new":function(t){var e=t.interaction;e.modification=new Ri.default(e)},"interactions:before-action-start":function(t){var e=t.interaction.modification;e.start(t,t.interaction.coords.start.page),t.interaction.edges=e.edges,e.applyToInteraction(t)},"interactions:before-action-move":function(t){return t.interaction.modification.setAndApply(t)},"interactions:before-action-end":function(t){return t.interaction.modification.beforeEnd(t)},"interactions:action-start":Fi,"interactions:action-move":Fi,"interactions:action-end":Fi,"interactions:after-action-start":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-move":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:stop":function(t){return t.interaction.modification.stop(t)}},before:["actions","action/drag","actions/resize","actions/gesture"]};Ci.default=Xi;var Yi={};function Ni(t){return(Ni="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Yi,"__esModule",{value:!0}),Yi.addTotal=Vi,Yi.applyPending=Ui,Yi.default=void 0;var Li=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Ni(t)&&"function"!=typeof t)return{default:t};var e=Bi();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function Bi(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Bi=function(){return t},t}function Vi(t){t.pointerIsDown&&(Hi(t.coords.cur,t.offset.total),t.offset.pending.x=0,t.offset.pending.y=0)}function qi(t){Ui(t.interaction)}function Ui(t){if(!(e=t).offset.pending.x&&!e.offset.pending.y)return!1;var e,n=t.offset.pending;return Hi(t.coords.cur,n),Hi(t.coords.delta,n),Li.addEdges(t.edges,t.rect,n),n.x=0,!(n.y=0)}function Gi(t){var e=t.x,n=t.y;this.offset.pending.x+=e,this.offset.pending.y+=n,this.offset.total.x+=e,this.offset.total.y+=n}function Hi(t,e){var n=t.page,r=t.client,o=e.x,i=e.y;n.x+=o,n.y+=i,r.x+=o,r.y+=i}En._ProxyMethods.offsetBy="";var Ki={id:"offset",install:function(t){t.Interaction.prototype.offsetBy=Gi},listeners:{"interactions:new":function(t){t.interaction.offset={total:{x:0,y:0},pending:{x:0,y:0}}},"interactions:update-pointer":function(t){return Vi(t.interaction)},"interactions:before-action-start":qi,"interactions:before-action-move":qi,"interactions:before-action-end":function(t){var e=t.interaction;if(Ui(e))return e.move({offset:!0}),e.end(),!1},"interactions:stop":function(t){var e=t.interaction;e.offset.total.x=0,e.offset.total.y=0,e.offset.pending.x=0,e.offset.pending.y=0}}};Yi.default=Ki;var $i={};function Zi(t){return(Zi="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty($i,"__esModule",{value:!0}),$i.default=$i.InertiaState=void 0;var Ji=ua(_i),Qi=aa(Ci),ta=ua(Yi),ea=aa($),na=ua(Et),ra=aa(w),oa=ua(oe);function ia(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ia=function(){return t},t}function aa(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Zi(t)&&"function"!=typeof t)return{default:t};var e=ia();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function ua(t){return t&&t.__esModule?t:{default:t}}function sa(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function la(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var ca=function(){function e(t){!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,e),this.interaction=t,la(this,"active",!1),la(this,"isModified",!1),la(this,"smoothEnd",!1),la(this,"allowResume",!1),la(this,"modification",null),la(this,"modifierCount",0),la(this,"modifierArg",null),la(this,"startCoords",null),la(this,"t0",0),la(this,"v0",0),la(this,"te",0),la(this,"targetOffset",null),la(this,"modifiedOffset",null),la(this,"currentOffset",null),la(this,"lambda_v0",0),la(this,"one_ve_v0",0),la(this,"timeout",null)}var t,n,r;return t=e,(n=[{key:"start",value:function(t){var e=this.interaction,n=fa(e);if(!n||!n.enabled)return!1;var r=e.coords.velocity.client,o=(0,na.default)(r.x,r.y),i=this.modification||(this.modification=new Ji.default(e));if(i.copyFrom(e.modification),this.t0=e._now(),this.allowResume=n.allowResume,this.v0=o,this.currentOffset={x:0,y:0},this.startCoords=e.coords.cur.page,this.modifierArg={interaction:e,interactable:e.interactable,element:e.element,rect:e.rect,edges:e.edges,pageCoords:this.startCoords,preEnd:!0,phase:"inertiastart"},this.t0-e.coords.cur.timeStamp<50&&o>n.minSpeed&&o>n.endSpeed)this.startInertia();else{if(i.result=i.setAll(this.modifierArg),!i.result.changed)return!1;this.startSmoothEnd()}return e.modification.result.rect=null,e.offsetBy(this.targetOffset),e._doPhase({interaction:e,event:t,phase:"inertiastart"}),e.offsetBy({x:-this.targetOffset.x,y:-this.targetOffset.y}),e.modification.result.rect=null,this.active=!0,e.simulation=this,!0}},{key:"startInertia",value:function(){var t=this,e=this.interaction.coords.velocity.client,n=fa(this.interaction),r=n.resistance,o=-Math.log(n.endSpeed/this.v0)/r;this.targetOffset={x:(e.x-o)/r,y:(e.y-o)/r},this.te=o,this.lambda_v0=r/this.v0,this.one_ve_v0=1-n.endSpeed/this.v0;var i=this.modification,a=this.modifierArg;a.pageCoords={x:this.startCoords.x+this.targetOffset.x,y:this.startCoords.y+this.targetOffset.y},i.result=i.setAll(a),i.result.changed&&(this.isModified=!0,this.modifiedOffset={x:this.targetOffset.x+i.result.delta.x,y:this.targetOffset.y+i.result.delta.y}),this.timeout=oa.default.request(function(){return t.inertiaTick()})}},{key:"startSmoothEnd",value:function(){var t=this;this.smoothEnd=!0,this.isModified=!0,this.targetOffset={x:this.modification.result.delta.x,y:this.modification.result.delta.y},this.timeout=oa.default.request(function(){return t.smoothEndTick()})}},{key:"inertiaTick",value:function(){var t,e,n,r,o,i,a,u=this,s=this.interaction,l=fa(s).resistance,c=(s._now()-this.t0)/1e3;if(c<this.te){var f,p=1-(Math.exp(-l*c)-this.lambda_v0)/this.one_ve_v0,d={x:(f=this.isModified?(e=t=0,n=this.targetOffset.x,r=this.targetOffset.y,o=this.modifiedOffset.x,i=this.modifiedOffset.y,{x:pa(a=p,t,n,o),y:pa(a,e,r,i)}):{x:this.targetOffset.x*p,y:this.targetOffset.y*p}).x-this.currentOffset.x,y:f.y-this.currentOffset.y};this.currentOffset.x+=d.x,this.currentOffset.y+=d.y,s.offsetBy(d),s.move(),this.timeout=oa.default.request(function(){return u.inertiaTick()})}else s.offsetBy({x:this.modifiedOffset.x-this.currentOffset.x,y:this.modifiedOffset.y-this.currentOffset.y}),this.end()}},{key:"smoothEndTick",value:function(){var t=this,e=this.interaction,n=e._now()-this.t0,r=fa(e).smoothEndDuration;if(n<r){var o=da(n,0,this.targetOffset.x,r),i=da(n,0,this.targetOffset.y,r),a={x:o-this.currentOffset.x,y:i-this.currentOffset.y};this.currentOffset.x+=a.x,this.currentOffset.y+=a.y,e.offsetBy(a),e.move({skipModifiers:this.modifierCount}),this.timeout=oa.default.request(function(){return t.smoothEndTick()})}else e.offsetBy({x:this.targetOffset.x-this.currentOffset.x,y:this.targetOffset.y-this.currentOffset.y}),this.end()}},{key:"resume",value:function(t){var e=t.pointer,n=t.event,r=t.eventTarget,o=this.interaction;o.offsetBy({x:-this.currentOffset.x,y:-this.currentOffset.y}),o.updatePointer(e,n,r,!0),o._doPhase({interaction:o,event:n,phase:"resume"}),(0,zt.copyCoords)(o.coords.prev,o.coords.cur),this.stop()}},{key:"end",value:function(){this.interaction.move(),this.interaction.end(),this.stop()}},{key:"stop",value:function(){this.active=this.smoothEnd=!1,this.interaction.simulation=null,oa.default.cancel(this.timeout)}}])&&sa(t.prototype,n),r&&sa(t,r),e}();function fa(t){var e=t.interactable,n=t.prepared;return e&&e.options&&n.name&&e.options[n.name].inertia}function pa(t,e,n,r){var o=1-t;return o*o*e+2*o*t*n+t*t*r}function da(t,e,n,r){return-n*(t/=r)*(t-2)+e}$i.InertiaState=ca;var va={id:"inertia",before:["modifiers/base"],install:function(t){var e=t.defaults;t.usePlugin(ta.default),t.usePlugin(Qi.default),t.actions.phases.inertiastart=!0,t.actions.phases.resume=!0,e.perAction.inertia={enabled:!1,resistance:10,minSpeed:100,endSpeed:10,allowResume:!0,smoothEndDuration:300}},listeners:{"interactions:new":function(t){var e=t.interaction;e.inertia=new ca(e)},"interactions:before-action-end":function(t){var e=t.interaction,n=t.event;return(!e._interacting||e.simulation||!e.inertia.start(n))&&null},"interactions:down":function(t){var e=t.interaction,n=t.eventTarget,r=e.inertia;if(r.active)for(var o=n;ra.element(o);){if(o===e.element){r.resume(t);break}o=ea.parentNode(o)}},"interactions:stop":function(t){var e=t.interaction.inertia;e.active&&e.stop()},"interactions:before-action-resume":function(t){var e=t.interaction.modification;e.stop(t),e.start(t,t.interaction.coords.cur.page),e.applyToInteraction(t)},"interactions:before-action-inertiastart":function(t){return t.interaction.modification.setAndApply(t)},"interactions:action-resume":Qi.addEventModifiers,"interactions:action-inertiastart":Qi.addEventModifiers,"interactions:after-action-inertiastart":function(t){return t.interaction.modification.restoreInteractionCoords(t)},"interactions:after-action-resume":function(t){return t.interaction.modification.restoreInteractionCoords(t)}}};$i.default=va;var ya,ha={};function ga(t){return(ga="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(ha,"__esModule",{value:!0}),ha.init=ha.default=void 0;var ba=new(((ya=m({}))&&ya.__esModule?ya:{default:ya}).default),ma=ba.interactStatic;ha.default=ma;function Oa(t){return ba.init(t)}ha.init=Oa,"object"===("undefined"==typeof window?"undefined":ga(window))&&window&&Oa(window);var wa={};Object.defineProperty(wa,"__esModule",{value:!0}),wa.default=void 0;wa.default={};var _a={};Object.defineProperty(_a,"__esModule",{value:!0}),_a.default=void 0;_a.default={};var Pa={};function xa(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}Object.defineProperty(Pa,"__esModule",{value:!0}),Pa.default=void 0;Pa.default=function(v){function t(t,e){for(var n=v.range,r=v.limits,o=void 0===r?{left:-1/0,right:1/0,top:-1/0,bottom:1/0}:r,i=v.offset,a=void 0===i?{x:0,y:0}:i,u={range:n,grid:v,x:null,y:null},s=0;s<y.length;s++){var l=xa(y[s],2),c=l[0],f=l[1],p=Math.round((t-a.x)/v[c]),d=Math.round((e-a.y)/v[f]);u[c]=Math.max(o.left,Math.min(o.right,p*v[c]+a.x)),u[f]=Math.max(o.top,Math.min(o.bottom,d*v[f]+a.y))}return u}var y=[["x","y"],["left","top"],["right","bottom"],["width","height"]].filter(function(t){var e=xa(t,2),n=e[0],r=e[1];return n in v||r in v});return t.grid=v,t.coordFields=y,t};var Sa={};Object.defineProperty(Sa,"__esModule",{value:!0}),Object.defineProperty(Sa,"edgeTarget",{enumerable:!0,get:function(){return ja.default}}),Object.defineProperty(Sa,"elements",{enumerable:!0,get:function(){return Ma.default}}),Object.defineProperty(Sa,"grid",{enumerable:!0,get:function(){return ka.default}});var ja=Ea(wa),Ma=Ea(_a),ka=Ea(Pa);function Ea(t){return t&&t.__esModule?t:{default:t}}var Ta={};function Da(t){return(Da="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ta,"__esModule",{value:!0}),Ta.default=void 0;var Ia,za=(Ia=ct)&&Ia.__esModule?Ia:{default:Ia},Aa=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Da(t)&&"function"!=typeof t)return{default:t};var e=Ca();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(Sa);function Ca(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Ca=function(){return t},t}var Wa={id:"snappers",install:function(t){var e=t.interactStatic;e.snappers=(0,za.default)(e.snappers||{},Aa),e.createSnapGrid=e.snappers.grid}};Ta.default=Wa;var Ra={};Object.defineProperty(Ra,"__esModule",{value:!0}),Ra.aspectRatio=Ra.default=void 0;var Fa=Ya(ct),Xa=Ya(_i);function Ya(t){return t&&t.__esModule?t:{default:t}}function Na(e,t){var n=Object.keys(e);if(Object.getOwnPropertySymbols){var r=Object.getOwnPropertySymbols(e);t&&(r=r.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n.push.apply(n,r)}return n}function La(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?Na(Object(n),!0).forEach(function(t){Ba(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):Na(Object(n)).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}function Ba(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Va={start:function(t){var e=t.state,n=t.rect,r=t.edges,o=t.pageCoords,i=e.options.ratio,a=e.options,u=a.equalDelta,s=a.modifiers;"preserve"===i&&(i=n.width/n.height),e.startCoords=(0,Fa.default)({},o),e.startRect=(0,Fa.default)({},n),e.ratio=i,e.equalDelta=u;var l=e.linkedEdges={top:r.top||r.left&&!r.bottom,left:r.left||r.top&&!r.right,bottom:r.bottom||r.right&&!r.top,right:r.right||r.bottom&&!r.left};if(e.xIsPrimaryAxis=!(!r.left&&!r.right),e.equalDelta)e.edgeSign=(l.left?1:-1)*(l.top?1:-1);else{var c=e.xIsPrimaryAxis?l.top:l.left;e.edgeSign=c?-1:1}if((0,Fa.default)(t.edges,l),s&&s.length){var f=new Xa.default(t.interaction);f.copyFrom(t.interaction.modification),f.prepareStates(s),(e.subModification=f).startAll(La({},t))}},set:function(t){var e=t.state,n=t.rect,r=t.coords,o=(0,Fa.default)({},r),i=e.equalDelta?qa:Ua;if(i(e,e.xIsPrimaryAxis,r,n),!e.subModification)return null;var a=(0,Fa.default)({},n);(0,$t.addEdges)(e.linkedEdges,a,{x:r.x-o.x,y:r.y-o.y});var u=e.subModification.setAll(La({},t,{rect:a,edges:e.linkedEdges,pageCoords:r,prevCoords:r,prevRect:a})),s=u.delta;u.changed&&(i(e,Math.abs(s.x)>Math.abs(s.y),u.coords,u.rect),(0,Fa.default)(r,u.coords));return u.eventProps},defaults:{ratio:"preserve",equalDelta:!1,modifiers:[],enabled:!1}};function qa(t,e,n){var r=t.startCoords,o=t.edgeSign;e?n.y=r.y+(n.x-r.x)*o:n.x=r.x+(n.y-r.y)*o}function Ua(t,e,n,r){var o=t.startRect,i=t.startCoords,a=t.ratio,u=t.edgeSign;if(e){var s=r.width/a;n.y=i.y+(s-o.height)*u}else{var l=r.height*a;n.x=i.x+(l-o.width)*u}}Ra.aspectRatio=Va;var Ga=(0,Ci.makeModifier)(Va,"aspectRatio");Ra.default=Ga;var Ha={};Object.defineProperty(Ha,"__esModule",{value:!0}),Ha.default=void 0;function Ka(){}Ka._defaults={};var $a=Ka;Ha.default=$a;var Za={};function Ja(t){return(Ja="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Za,"__esModule",{value:!0}),Za.getRestrictionRect=iu,Za.restrict=Za.default=void 0;var Qa,tu=(Qa=ct)&&Qa.__esModule?Qa:{default:Qa},eu=ou(w),nu=ou($t);function ru(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return ru=function(){return t},t}function ou(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Ja(t)&&"function"!=typeof t)return{default:t};var e=ru();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function iu(t,e,n){return eu.func(t)?nu.resolveRectLike(t,e.interactable,e.element,[n.x,n.y,e]):nu.resolveRectLike(t,e.interactable,e.element)}var au={start:function(t){var e=t.rect,n=t.startOffset,r=t.state,o=t.interaction,i=t.pageCoords,a=r.options,u=a.elementRect,s=(0,tu.default)({left:0,top:0,right:0,bottom:0},a.offset||{});if(e&&u){var l=iu(a.restriction,o,i);if(l){var c=l.right-l.left-e.width,f=l.bottom-l.top-e.height;c<0&&(s.left+=c,s.right+=c),f<0&&(s.top+=f,s.bottom+=f)}s.left+=n.left-e.width*u.left,s.top+=n.top-e.height*u.top,s.right+=n.right-e.width*(1-u.right),s.bottom+=n.bottom-e.height*(1-u.bottom)}r.offset=s},set:function(t){var e=t.coords,n=t.interaction,r=t.state,o=r.options,i=r.offset,a=iu(o.restriction,n,e);if(a){var u=nu.xywhToTlbr(a);e.x=Math.max(Math.min(u.right-i.right,e.x),u.left+i.left),e.y=Math.max(Math.min(u.bottom-i.bottom,e.y),u.top+i.top)}},defaults:{restriction:null,elementRect:null,offset:null,endOnly:!1,enabled:!1}};Za.restrict=au;var uu=(0,Ci.makeModifier)(au,"restrict");Za.default=uu;var su={};function lu(t){return(lu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(su,"__esModule",{value:!0}),su.restrictEdges=su.default=void 0;var cu,fu=(cu=ct)&&cu.__esModule?cu:{default:cu},pu=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==lu(t)&&"function"!=typeof t)return{default:t};var e=du();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function du(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return du=function(){return t},t}var vu={top:1/0,left:1/0,bottom:-1/0,right:-1/0},yu={top:-1/0,left:-1/0,bottom:1/0,right:1/0};function hu(t,e){for(var n=["top","left","bottom","right"],r=0;r<n.length;r++){var o=n[r];o in t||(t[o]=e[o])}return t}var gu={noInner:vu,noOuter:yu,start:function(t){var e,n=t.interaction,r=t.startOffset,o=t.state,i=o.options;if(i){var a=(0,Za.getRestrictionRect)(i.offset,n,n.coords.start.page);e=pu.rectToXY(a)}e=e||{x:0,y:0},o.offset={top:e.y+r.top,left:e.x+r.left,bottom:e.y-r.bottom,right:e.x-r.right}},set:function(t){var e=t.coords,n=t.edges,r=t.interaction,o=t.state,i=o.offset,a=o.options;if(n){var u=(0,fu.default)({},e),s=(0,Za.getRestrictionRect)(a.inner,r,u)||{},l=(0,Za.getRestrictionRect)(a.outer,r,u)||{};hu(s,vu),hu(l,yu),n.top?e.y=Math.min(Math.max(l.top+i.top,u.y),s.top+i.top):n.bottom&&(e.y=Math.max(Math.min(l.bottom+i.bottom,u.y),s.bottom+i.bottom)),n.left?e.x=Math.min(Math.max(l.left+i.left,u.x),s.left+i.left):n.right&&(e.x=Math.max(Math.min(l.right+i.right,u.x),s.right+i.right))}},defaults:{inner:null,outer:null,offset:null,endOnly:!1,enabled:!1}};su.restrictEdges=gu;var bu=(0,Ci.makeModifier)(gu,"restrictEdges");su.default=bu;var mu,Ou={};Object.defineProperty(Ou,"__esModule",{value:!0}),Ou.restrictRect=Ou.default=void 0;var wu=(0,((mu=ct)&&mu.__esModule?mu:{default:mu}).default)({get elementRect(){return{top:0,left:0,bottom:1,right:1}},set elementRect(t){}},Za.restrict.defaults),_u={start:Za.restrict.start,set:Za.restrict.set,defaults:wu};Ou.restrictRect=_u;var Pu=(0,Ci.makeModifier)(_u,"restrictRect");Ou.default=Pu;var xu={};function Su(t){return(Su="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(xu,"__esModule",{value:!0}),xu.restrictSize=xu.default=void 0;var ju,Mu=(ju=ct)&&ju.__esModule?ju:{default:ju},ku=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Su(t)&&"function"!=typeof t)return{default:t};var e=Eu();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}($t);function Eu(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Eu=function(){return t},t}var Tu={width:-1/0,height:-1/0},Du={width:1/0,height:1/0};var Iu={start:function(t){return su.restrictEdges.start(t)},set:function(t){var e=t.interaction,n=t.state,r=t.rect,o=t.edges,i=n.options;if(o){var a=ku.tlbrToXywh((0,Za.getRestrictionRect)(i.min,e,t.coords))||Tu,u=ku.tlbrToXywh((0,Za.getRestrictionRect)(i.max,e,t.coords))||Du;n.options={endOnly:i.endOnly,inner:(0,Mu.default)({},su.restrictEdges.noInner),outer:(0,Mu.default)({},su.restrictEdges.noOuter)},o.top?(n.options.inner.top=r.bottom-a.height,n.options.outer.top=r.bottom-u.height):o.bottom&&(n.options.inner.bottom=r.top+a.height,n.options.outer.bottom=r.top+u.height),o.left?(n.options.inner.left=r.right-a.width,n.options.outer.left=r.right-u.width):o.right&&(n.options.inner.right=r.left+a.width,n.options.outer.right=r.left+u.width),su.restrictEdges.set(t),n.options=i}},defaults:{min:null,max:null,endOnly:!1,enabled:!1}};xu.restrictSize=Iu;var zu=(0,Ci.makeModifier)(Iu,"restrictSize");xu.default=zu;var Au={};Object.defineProperty(Au,"__esModule",{value:!0}),Au.default=void 0;function Cu(){}Cu._defaults={};var Wu=Cu;Au.default=Wu;var Ru={};function Fu(t){return(Fu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Ru,"__esModule",{value:!0}),Ru.snap=Ru.default=void 0;var Xu=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Fu(t)&&"function"!=typeof t)return{default:t};var e=Yu();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le);function Yu(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Yu=function(){return t},t}var Nu={start:function(t){var e,n,r,o=t.interaction,i=t.interactable,a=t.element,u=t.rect,s=t.state,l=t.startOffset,c=s.options,f=c.offsetWithOrigin?(n=(e=t).interaction.element,Xu.rect.rectToXY(Xu.rect.resolveRectLike(e.state.options.origin,null,null,[n]))||Xu.getOriginXY(e.interactable,n,e.interaction.prepared.name)):{x:0,y:0};if("startCoords"===c.offset)r={x:o.coords.start.page.x,y:o.coords.start.page.y};else{var p=Xu.rect.resolveRectLike(c.offset,i,a,[o]);(r=Xu.rect.rectToXY(p)||{x:0,y:0}).x+=f.x,r.y+=f.y}var d=c.relativePoints;s.offsets=u&&d&&d.length?d.map(function(t,e){return{index:e,relativePoint:t,x:l.left-u.width*t.x+r.x,y:l.top-u.height*t.y+r.y}}):[Xu.extend({index:0,relativePoint:null},r)]},set:function(t){var e=t.interaction,n=t.coords,r=t.state,o=r.options,i=r.offsets,a=Xu.getOriginXY(e.interactable,e.element,e.prepared.name),u=Xu.extend({},n),s=[];o.offsetWithOrigin||(u.x-=a.x,u.y-=a.y);for(var l=0;l<i.length;l++)for(var c=i[l],f=u.x-c.x,p=u.y-c.y,d=0,v=o.targets.length;d<v;d++){var y=o.targets[d],h=void 0;(h=Xu.is.func(y)?y(f,p,e,c,d):y)&&s.push({x:(Xu.is.number(h.x)?h.x:f)+c.x,y:(Xu.is.number(h.y)?h.y:p)+c.y,range:Xu.is.number(h.range)?h.range:o.range,source:y,index:d,offset:c})}for(var g={target:null,inRange:!1,distance:0,range:0,delta:{x:0,y:0}},b=0;b<s.length;b++){var m=s[b],O=m.range,w=m.x-u.x,_=m.y-u.y,P=Xu.hypot(w,_),x=P<=O;O===1/0&&g.inRange&&g.range!==1/0&&(x=!1),g.target&&!(x?g.inRange&&O!==1/0?P/O<g.distance/g.range:O===1/0&&g.range!==1/0||P<g.distance:!g.inRange&&P<g.distance)||(g.target=m,g.distance=P,g.range=O,g.inRange=x,g.delta.x=w,g.delta.y=_)}return g.inRange&&(n.x=g.target.x,n.y=g.target.y),r.closest=g},defaults:{range:1/0,targets:null,offset:null,offsetWithOrigin:!0,origin:null,relativePoints:null,endOnly:!1,enabled:!1}};Ru.snap=Nu;var Lu=(0,Ci.makeModifier)(Nu,"snap");Ru.default=Lu;var Bu={};function Vu(t){return(Vu="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Bu,"__esModule",{value:!0}),Bu.snapSize=Bu.default=void 0;var qu,Uu=(qu=ct)&&qu.__esModule?qu:{default:qu},Gu=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Vu(t)&&"function"!=typeof t)return{default:t};var e=Hu();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(w);function Hu(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Hu=function(){return t},t}function Ku(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){if(!(Symbol.iterator in Object(t)||"[object Arguments]"===Object.prototype.toString.call(t)))return;var n=[],r=!0,o=!1,i=void 0;try{for(var a,u=t[Symbol.iterator]();!(r=(a=u.next()).done)&&(n.push(a.value),!e||n.length!==e);r=!0);}catch(t){o=!0,i=t}finally{try{r||null==u.return||u.return()}finally{if(o)throw i}}return n}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}()}var $u={start:function(t){var e=t.state,n=t.edges,r=e.options;if(!n)return null;t.state={options:{targets:null,relativePoints:[{x:n.left?0:1,y:n.top?0:1}],offset:r.offset||"self",origin:{x:0,y:0},range:r.range}},e.targetFields=e.targetFields||[["width","height"],["x","y"]],Ru.snap.start(t),e.offsets=t.state.offsets,t.state=e},set:function(t){var e=t.interaction,n=t.state,r=t.coords,o=n.options,i=n.offsets,a={x:r.x-i[0].x,y:r.y-i[0].y};n.options=(0,Uu.default)({},o),n.options.targets=[];for(var u=0;u<(o.targets||[]).length;u++){var s=(o.targets||[])[u],l=void 0;if(l=Gu.func(s)?s(a.x,a.y,e):s){for(var c=0;c<n.targetFields.length;c++){var f=Ku(n.targetFields[c],2),p=f[0],d=f[1];if(p in l||d in l){l.x=l[p],l.y=l[d];break}}n.options.targets.push(l)}}var v=Ru.snap.set(t);return n.options=o,v},defaults:{range:1/0,targets:null,offset:null,endOnly:!1,enabled:!1}};Bu.snapSize=$u;var Zu=(0,Ci.makeModifier)($u,"snapSize");Bu.default=Zu;var Ju={};Object.defineProperty(Ju,"__esModule",{value:!0}),Ju.snapEdges=Ju.default=void 0;var Qu=es(V),ts=es(ct);function es(t){return t&&t.__esModule?t:{default:t}}var ns={start:function(t){var e=t.edges;return e?(t.state.targetFields=t.state.targetFields||[[e.left?"left":"right",e.top?"top":"bottom"]],Bu.snapSize.start(t)):null},set:Bu.snapSize.set,defaults:(0,ts.default)((0,Qu.default)(Bu.snapSize.defaults),{targets:null,range:null,offset:{x:0,y:0}})};Ju.snapEdges=ns;var rs=(0,Ci.makeModifier)(ns,"snapEdges");Ju.default=rs;var os={};Object.defineProperty(os,"__esModule",{value:!0}),os.default=void 0;function is(){}is._defaults={};var as=is;os.default=as;var us={};Object.defineProperty(us,"__esModule",{value:!0}),us.default=void 0;function ss(){}ss._defaults={};var ls=ss;us.default=ls;var cs={};Object.defineProperty(cs,"__esModule",{value:!0}),cs.default=void 0;var fs=Ps(Ra),ps=Ps(Ha),ds=Ps(su),vs=Ps(Za),ys=Ps(Ou),hs=Ps(xu),gs=Ps(Au),bs=Ps(Ju),ms=Ps(Ru),Os=Ps(Bu),ws=Ps(os),_s=Ps(us);function Ps(t){return t&&t.__esModule?t:{default:t}}var xs={aspectRatio:fs.default,restrictEdges:ds.default,restrict:vs.default,restrictRect:ys.default,restrictSize:hs.default,snapEdges:bs.default,snap:ms.default,snapSize:Os.default,spring:ws.default,avoid:ps.default,transform:_s.default,rubberband:gs.default};cs.default=xs;var Ss={};Object.defineProperty(Ss,"__esModule",{value:!0}),Ss.default=void 0;var js=Es(Ta),Ms=Es(cs),ks=Es(Ci);function Es(t){return t&&t.__esModule?t:{default:t}}var Ts={id:"modifiers",install:function(t){var e=t.interactStatic;for(var n in t.usePlugin(ks.default),t.usePlugin(js.default),e.modifiers=Ms.default,Ms.default){var r=Ms.default[n],o=r._defaults,i=r._methods;o._methods=i,t.defaults.perAction[n]=o}}};Ss.default=Ts;var Ds={};Object.defineProperty(Ds,"__esModule",{value:!0}),Ds.default=void 0;Ds.default={};var Is={};Object.defineProperty(Is,"__esModule",{value:!0}),Is.PointerEvent=Is.default=void 0;var zs,As=(zs=Me)&&zs.__esModule?zs:{default:zs},Cs=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Rs(t)&&"function"!=typeof t)return{default:t};var e=Ws();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(zt);function Ws(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Ws=function(){return t},t}function Rs(t){return(Rs="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}function Fs(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(t,r.key,r)}}function Xs(t){return(Xs=Object.setPrototypeOf?Object.getPrototypeOf:function(t){return t.__proto__||Object.getPrototypeOf(t)})(t)}function Ys(t){if(void 0===t)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return t}function Ns(t,e){return(Ns=Object.setPrototypeOf||function(t,e){return t.__proto__=e,t})(t,e)}function Ls(t,e,n){return e in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}var Bs=function(){function f(t,e,n,r,o,i){var a,u,s;if(!function(t,e){if(!(t instanceof e))throw new TypeError("Cannot call a class as a function")}(this,f),u=this,a=!(s=Xs(f).call(this,o))||"object"!==Rs(s)&&"function"!=typeof s?Ys(u):s,Ls(Ys(a),"type",void 0),Ls(Ys(a),"originalEvent",void 0),Ls(Ys(a),"pointerId",void 0),Ls(Ys(a),"pointerType",void 0),Ls(Ys(a),"double",void 0),Ls(Ys(a),"pageX",void 0),Ls(Ys(a),"pageY",void 0),Ls(Ys(a),"clientX",void 0),Ls(Ys(a),"clientY",void 0),Ls(Ys(a),"dt",void 0),Ls(Ys(a),"eventable",void 0),Cs.pointerExtend(Ys(a),n),n!==e&&Cs.pointerExtend(Ys(a),e),a.timeStamp=i,a.originalEvent=n,a.type=t,a.pointerId=Cs.getPointerId(e),a.pointerType=Cs.getPointerType(e),a.target=r,a.currentTarget=null,"tap"===t){var l=o.getPointerIndex(e);a.dt=a.timeStamp-o.pointers[l].downTime;var c=a.timeStamp-o.tapTime;a.double=!!(o.prevTap&&"doubletap"!==o.prevTap.type&&o.prevTap.target===a.target&&c<500)}else"doubletap"===t&&(a.dt=e.timeStamp-o.tapTime);return a}var t,e,n;return function(t,e){if("function"!=typeof e&&null!==e)throw new TypeError("Super expression must either be null or a function");t.prototype=Object.create(e&&e.prototype,{constructor:{value:t,writable:!0,configurable:!0}}),e&&Ns(t,e)}(f,As["default"]),t=f,(e=[{key:"_subtractOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX-=e,this.pageY-=n,this.clientX-=e,this.clientY-=n,this}},{key:"_addOrigin",value:function(t){var e=t.x,n=t.y;return this.pageX+=e,this.pageY+=n,this.clientX+=e,this.clientY+=n,this}},{key:"preventDefault",value:function(){this.originalEvent.preventDefault()}}])&&Fs(t.prototype,e),n&&Fs(t,n),f}();Is.PointerEvent=Is.default=Bs;var Vs={};function qs(t){return(qs="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(Vs,"__esModule",{value:!0}),Vs.default=void 0;Ks(En),Ks(m({}));var Us=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==qs(t)&&"function"!=typeof t)return{default:t};var e=Hs();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(le),Gs=Ks(Is);function Hs(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Hs=function(){return t},t}function Ks(t){return t&&t.__esModule?t:{default:t}}var $s={id:"pointer-events/base",install:function(t){t.pointerEvents=$s,t.defaults.actions.pointerEvents=$s.defaults,Us.extend(t.actions.phaselessTypes,$s.types)},listeners:{"interactions:new":function(t){var e=t.interaction;e.prevTap=null,e.tapTime=0},"interactions:update-pointer":function(t){var e=t.down,n=t.pointerInfo;if(!e&&n.hold)return;n.hold={duration:1/0,timeout:null}},"interactions:move":function(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.duplicate,u=n.getPointerIndex(r);a||n.pointerIsDown&&!n.pointerWasMoved||(n.pointerIsDown&&clearTimeout(n.pointers[u].hold.timeout),Zs({interaction:n,pointer:r,event:o,eventTarget:i,type:"move"},e))},"interactions:down":function(t,e){!function(t,e){for(var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.pointerIndex,u=n.pointers[a].hold,s=Us.dom.getPath(i),l={interaction:n,pointer:r,event:o,eventTarget:i,type:"hold",targets:[],path:s,node:null},c=0;c<s.length;c++){var f=s[c];l.node=f,e.fire("pointerEvents:collect-targets",l)}if(!l.targets.length)return;for(var p=1/0,d=0;d<l.targets.length;d++){var v=l.targets[d].eventable.options.holdDuration;v<p&&(p=v)}u.duration=p,u.timeout=setTimeout(function(){Zs({interaction:n,eventTarget:i,pointer:r,event:o,type:"hold"},e)},p)}(t,e),Zs(t,e)},"interactions:up":function(t,e){var n,r,o,i,a,u;Qs(t),Zs(t,e),r=e,o=(n=t).interaction,i=n.pointer,a=n.event,u=n.eventTarget,o.pointerWasMoved||Zs({interaction:o,eventTarget:u,pointer:i,event:a,type:"tap"},r)},"interactions:cancel":function(t,e){Qs(t),Zs(t,e)}},PointerEvent:Gs.default,fire:Zs,collectEventTargets:Js,defaults:{holdDuration:600,ignoreFrom:null,allowFrom:null,origin:{x:0,y:0}},types:{down:!0,move:!0,up:!0,cancel:!0,tap:!0,doubletap:!0,hold:!0}};function Zs(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.type,u=t.targets,s=void 0===u?Js(t,e):u,l=new Gs.default(a,r,o,i,n,e.now());e.fire("pointerEvents:new",{pointerEvent:l});for(var c={interaction:n,pointer:r,event:o,eventTarget:i,targets:s,type:a,pointerEvent:l},f=0;f<s.length;f++){var p=s[f];for(var d in p.props||{})l[d]=p.props[d];var v=Us.getOriginXY(p.eventable,p.node);if(l._subtractOrigin(v),l.eventable=p.eventable,l.currentTarget=p.node,p.eventable.fire(l),l._addOrigin(v),l.immediatePropagationStopped||l.propagationStopped&&f+1<s.length&&s[f+1].node!==l.currentTarget)break}if(e.fire("pointerEvents:fired",c),"tap"===a){var y=l.double?Zs({interaction:n,pointer:r,event:o,eventTarget:i,type:"doubletap"},e):l;n.prevTap=y,n.tapTime=y.timeStamp}return l}function Js(t,e){var n=t.interaction,r=t.pointer,o=t.event,i=t.eventTarget,a=t.type,u=n.getPointerIndex(r),s=n.pointers[u];if("tap"===a&&(n.pointerWasMoved||!s||s.downTarget!==i))return[];for(var l=Us.dom.getPath(i),c={interaction:n,pointer:r,event:o,eventTarget:i,type:a,path:l,targets:[],node:null},f=0;f<l.length;f++){var p=l[f];c.node=p,e.fire("pointerEvents:collect-targets",c)}return"hold"===a&&(c.targets=c.targets.filter(function(t){return t.eventable.options.holdDuration===n.pointers[u].hold.duration})),c.targets}function Qs(t){var e=t.interaction,n=t.pointerIndex;e.pointers[n].hold&&clearTimeout(e.pointers[n].hold.timeout)}var tl=$s;Vs.default=tl;var el={};Object.defineProperty(el,"__esModule",{value:!0}),el.default=void 0;rl(Is);var nl=rl(Vs);function rl(t){return t&&t.__esModule?t:{default:t}}function ol(t){var e=t.interaction;e.holdIntervalHandle&&(clearInterval(e.holdIntervalHandle),e.holdIntervalHandle=null)}var il={id:"pointer-events/holdRepeat",install:function(t){t.usePlugin(nl.default);var e=t.pointerEvents;e.defaults.holdRepeatInterval=0,e.types.holdrepeat=t.actions.phaselessTypes.holdrepeat=!0},listeners:["move","up","cancel","endall"].reduce(function(t,e){return t["pointerEvents:".concat(e)]=ol,t},{"pointerEvents:new":function(t){var e=t.pointerEvent;"hold"===e.type&&(e.count=(e.count||0)+1)},"pointerEvents:fired":function(t,e){var n=t.interaction,r=t.pointerEvent,o=t.eventTarget,i=t.targets;if("hold"===r.type&&i.length){var a=i[0].eventable.options.holdRepeatInterval;a<=0||(n.holdIntervalHandle=setTimeout(function(){e.pointerEvents.fire({interaction:n,eventTarget:o,type:"hold",pointer:r,event:r},e)},a))}}})};el.default=il;var al={};Object.defineProperty(al,"__esModule",{value:!0}),al.default=void 0;var ul,sl=(ul=ct)&&ul.__esModule?ul:{default:ul};function ll(t){return(0,sl.default)(this.events.options,t),this}var cl={id:"pointer-events/interactableTargets",install:function(t){var e=t.Interactable;e.prototype.pointerEvents=ll;var r=e.prototype._backCompatOption;e.prototype._backCompatOption=function(t,e){var n=r.call(this,t,e);return n===this&&(this.events.options[t]=e),n}},listeners:{"pointerEvents:collect-targets":function(t,e){var r=t.targets,o=t.node,i=t.type,a=t.eventTarget;e.interactables.forEachMatch(o,function(t){var e=t.events,n=e.options;e.types[i]&&e.types[i].length&&t.testIgnoreAllow(n,o,a)&&r.push({node:o,eventable:e,props:{interactable:t}})})},"interactable:new":function(t){var e=t.interactable;e.events.getRect=function(t){return e.getRect(t)}},"interactable:set":function(t,e){var n=t.interactable,r=t.options;(0,sl.default)(n.events.options,e.pointerEvents.defaults),(0,sl.default)(n.events.options,r.pointerEvents||{})}}};al.default=cl;var fl={};function pl(t){return(pl="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(fl,"__esModule",{value:!0}),Object.defineProperty(fl,"holdRepeat",{enumerable:!0,get:function(){return vl.default}}),Object.defineProperty(fl,"interactableTargets",{enumerable:!0,get:function(){return yl.default}}),fl.pointerEvents=fl.default=void 0;var dl=function(t){if(t&&t.__esModule)return t;if(null===t||"object"!==pl(t)&&"function"!=typeof t)return{default:t};var e=gl();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}n.default=t,e&&e.set(t,n);return n}(Vs);fl.pointerEvents=dl;var vl=hl(el),yl=hl(al);function hl(t){return t&&t.__esModule?t:{default:t}}function gl(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return gl=function(){return t},t}var bl={id:"pointer-events",install:function(t){t.usePlugin(dl),t.usePlugin(vl.default),t.usePlugin(yl.default)}};fl.default=bl;var ml={};Object.defineProperty(ml,"__esModule",{value:!0}),ml.install=wl,ml.default=void 0;var Ol;(Ol=k({}))&&Ol.__esModule;function wl(e){var t=e.Interactable;e.actions.phases.reflow=!0,t.prototype.reflow=function(t){return function(u,s,l){function t(){var e=c[d],t=u.getRect(e);if(!t)return"break";var n=le.arr.find(l.interactions.list,function(t){return t.interacting()&&t.interactable===u&&t.element===e&&t.prepared.name===s.name}),r=void 0;if(n)n.move(),p&&(r=n._reflowPromise||new f(function(t){n._reflowResolve=t}));else{var o=le.rect.tlbrToXywh(t),i={page:{x:o.x,y:o.y},client:{x:o.x,y:o.y},timeStamp:l.now()},a=le.pointer.coordsToEvent(i);r=function(t,e,n,r,o){var i=t.interactions.new({pointerType:"reflow"}),a={interaction:i,event:o,pointer:o,eventTarget:n,phase:"reflow"};i.interactable=e,i.element=n,i.prepared=(0,le.extend)({},r),i.prevEvent=o,i.updatePointer(o,o,n,!0),i._doPhase(a);var u=le.win.window.Promise?new le.win.window.Promise(function(t){i._reflowResolve=t}):null;i._reflowPromise=u,i.start(r,e,n),i._interacting?(i.move(a),i.end(o)):i.stop();return i.removePointer(o,o),i.pointerIsDown=!1,u}(l,u,e,s,a)}p&&p.push(r)}for(var c=le.is.string(u.target)?le.arr.from(u._context.querySelectorAll(u.target)):[u.target],f=le.win.window.Promise,p=f?[]:null,d=0;d<c.length;d++){if("break"===t())break}return p&&f.all(p).then(function(){return u})}(this,t,e)}}var _l={id:"reflow",install:wl,listeners:{"interactions:stop":function(t,e){var n=t.interaction;"reflow"===n.pointerType&&(n._reflowResolve&&n._reflowResolve(),le.arr.remove(e.interactions.list,n))}}};ml.default=_l;var Pl={};Object.defineProperty(Pl,"__esModule",{value:!0}),Pl.default=void 0;Pl.default={};var xl={};Object.defineProperty(xl,"__esModule",{value:!0}),xl.exchange=void 0;xl.exchange={};var Sl={};Object.defineProperty(Sl,"__esModule",{value:!0}),Sl.default=void 0;Sl.default={};var jl={};function Ml(t){return(Ml="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}Object.defineProperty(jl,"__esModule",{value:!0}),jl.default=void 0;var kl=Hl(Qr),El=Hl(ao),Tl=Hl(uo),Dl=Hl(ti),Il=Hl(ai),zl=Hl(ui),Al=Hl(Un),Cl=(Hl(si),Gl(wi)),Wl=Hl($i),Rl=Hl(ha),Fl=Hl(Ss),Xl=Hl(Ds),Yl=Hl(Yi),Nl=Hl(fl),Ll=Hl(ml),Bl=Gl(Pl),Vl=Gl(zt),ql=Gl(Sl);function Ul(){if("function"!=typeof WeakMap)return null;var t=new WeakMap;return Ul=function(){return t},t}function Gl(t){if(t&&t.__esModule)return t;if(null===t||"object"!==Ml(t)&&"function"!=typeof t)return{default:t};var e=Ul();if(e&&e.has(t))return e.get(t);var n={},r=Object.defineProperty&&Object.getOwnPropertyDescriptor;for(var o in t)if(Object.prototype.hasOwnProperty.call(t,o)){var i=r?Object.getOwnPropertyDescriptor(t,o):null;i&&(i.get||i.set)?Object.defineProperty(n,o,i):n[o]=t[o]}return n.default=t,e&&e.set(t,n),n}function Hl(t){return t&&t.__esModule?t:{default:t}}Rl.default.use(Xl.default),Rl.default.use(Al.default),Rl.default.use(Yl.default),Rl.default.use(Il.default),Rl.default.use(El.default),Rl.default.use(Nl.default),Rl.default.use(Wl.default),Rl.default.use(Fl.default),Rl.default.use(Dl.default),Rl.default.use(kl.default),Rl.default.use(Tl.default),Rl.default.use(Ll.default),Rl.default.feedback=Cl,Rl.default.use(zl.default),Rl.default.vue={components:ql},Rl.default.__utils={exchange:xl.exchange,displace:Bl,pointer:Vl};var Kl=Rl.default;jl.default=Kl;var $l={exports:{}};Object.defineProperty($l.exports,"__esModule",{value:!0}),$l.exports.default=void 0;var Zl,Jl=(Zl=jl)&&Zl.__esModule?Zl:{default:Zl};function Ql(t){return(Ql="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t})(t)}if("object"===Ql($l)&&$l)try{$l.exports=Jl.default}catch(t){}Jl.default.default=Jl.default;var tc=Jl.default;return $l.exports.default=tc,$l=$l.exports});



}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
/*
* loglevel - https://github.com/pimterry/loglevel
*
* Copyright (c) 2013 Tim Perry
* Licensed under the MIT license.
*/
(function (root, definition) {
    "use strict";
    if (typeof define === 'function' && define.amd) {
        define(definition);
    } else if (typeof module === 'object' && module.exports) {
        module.exports = definition();
    } else {
        root.log = definition();
    }
}(this, function () {
    "use strict";

    // Slightly dubious tricks to cut down minimized file size
    var noop = function() {};
    var undefinedType = "undefined";
    var isIE = (typeof window !== undefinedType) && (typeof window.navigator !== undefinedType) && (
        /Trident\/|MSIE /.test(window.navigator.userAgent)
    );

    var logMethods = [
        "trace",
        "debug",
        "info",
        "warn",
        "error"
    ];

    // Cross-browser bind equivalent that works at least back to IE6
    function bindMethod(obj, methodName) {
        var method = obj[methodName];
        if (typeof method.bind === 'function') {
            return method.bind(obj);
        } else {
            try {
                return Function.prototype.bind.call(method, obj);
            } catch (e) {
                // Missing bind shim or IE8 + Modernizr, fallback to wrapping
                return function() {
                    return Function.prototype.apply.apply(method, [obj, arguments]);
                };
            }
        }
    }

    // Trace() doesn't print the message in IE, so for that case we need to wrap it
    function traceForIE() {
        if (console.log) {
            if (console.log.apply) {
                console.log.apply(console, arguments);
            } else {
                // In old IE, native console methods themselves don't have apply().
                Function.prototype.apply.apply(console.log, [console, arguments]);
            }
        }
        if (console.trace) console.trace();
    }

    // Build the best logging method possible for this env
    // Wherever possible we want to bind, not wrap, to preserve stack traces
    function realMethod(methodName) {
        if (methodName === 'debug') {
            methodName = 'log';
        }

        if (typeof console === undefinedType) {
            return false; // No method possible, for now - fixed later by enableLoggingWhenConsoleArrives
        } else if (methodName === 'trace' && isIE) {
            return traceForIE;
        } else if (console[methodName] !== undefined) {
            return bindMethod(console, methodName);
        } else if (console.log !== undefined) {
            return bindMethod(console, 'log');
        } else {
            return noop;
        }
    }

    // These private functions always need `this` to be set properly

    function replaceLoggingMethods(level, loggerName) {
        /*jshint validthis:true */
        for (var i = 0; i < logMethods.length; i++) {
            var methodName = logMethods[i];
            this[methodName] = (i < level) ?
                noop :
                this.methodFactory(methodName, level, loggerName);
        }

        // Define log.log as an alias for log.debug
        this.log = this.debug;
    }

    // In old IE versions, the console isn't present until you first open it.
    // We build realMethod() replacements here that regenerate logging methods
    function enableLoggingWhenConsoleArrives(methodName, level, loggerName) {
        return function () {
            if (typeof console !== undefinedType) {
                replaceLoggingMethods.call(this, level, loggerName);
                this[methodName].apply(this, arguments);
            }
        };
    }

    // By default, we use closely bound real methods wherever possible, and
    // otherwise we wait for a console to appear, and then try again.
    function defaultMethodFactory(methodName, level, loggerName) {
        /*jshint validthis:true */
        return realMethod(methodName) ||
               enableLoggingWhenConsoleArrives.apply(this, arguments);
    }

    function Logger(name, defaultLevel, factory) {
      var self = this;
      var currentLevel;
      var storageKey = "loglevel";
      if (name) {
        storageKey += ":" + name;
      }

      function persistLevelIfPossible(levelNum) {
          var levelName = (logMethods[levelNum] || 'silent').toUpperCase();

          if (typeof window === undefinedType) return;

          // Use localStorage if available
          try {
              window.localStorage[storageKey] = levelName;
              return;
          } catch (ignore) {}

          // Use session cookie as fallback
          try {
              window.document.cookie =
                encodeURIComponent(storageKey) + "=" + levelName + ";";
          } catch (ignore) {}
      }

      function getPersistedLevel() {
          var storedLevel;

          if (typeof window === undefinedType) return;

          try {
              storedLevel = window.localStorage[storageKey];
          } catch (ignore) {}

          // Fallback to cookies if local storage gives us nothing
          if (typeof storedLevel === undefinedType) {
              try {
                  var cookie = window.document.cookie;
                  var location = cookie.indexOf(
                      encodeURIComponent(storageKey) + "=");
                  if (location !== -1) {
                      storedLevel = /^([^;]+)/.exec(cookie.slice(location))[1];
                  }
              } catch (ignore) {}
          }

          // If the stored level is not valid, treat it as if nothing was stored.
          if (self.levels[storedLevel] === undefined) {
              storedLevel = undefined;
          }

          return storedLevel;
      }

      /*
       *
       * Public logger API - see https://github.com/pimterry/loglevel for details
       *
       */

      self.name = name;

      self.levels = { "TRACE": 0, "DEBUG": 1, "INFO": 2, "WARN": 3,
          "ERROR": 4, "SILENT": 5};

      self.methodFactory = factory || defaultMethodFactory;

      self.getLevel = function () {
          return currentLevel;
      };

      self.setLevel = function (level, persist) {
          if (typeof level === "string" && self.levels[level.toUpperCase()] !== undefined) {
              level = self.levels[level.toUpperCase()];
          }
          if (typeof level === "number" && level >= 0 && level <= self.levels.SILENT) {
              currentLevel = level;
              if (persist !== false) {  // defaults to true
                  persistLevelIfPossible(level);
              }
              replaceLoggingMethods.call(self, level, name);
              if (typeof console === undefinedType && level < self.levels.SILENT) {
                  return "No console available for logging";
              }
          } else {
              throw "log.setLevel() called with invalid level: " + level;
          }
      };

      self.setDefaultLevel = function (level) {
          if (!getPersistedLevel()) {
              self.setLevel(level, false);
          }
      };

      self.enableAll = function(persist) {
          self.setLevel(self.levels.TRACE, persist);
      };

      self.disableAll = function(persist) {
          self.setLevel(self.levels.SILENT, persist);
      };

      // Initialize with the right level
      var initialLevel = getPersistedLevel();
      if (initialLevel == null) {
          initialLevel = defaultLevel == null ? "WARN" : defaultLevel;
      }
      self.setLevel(initialLevel, false);
    }

    /*
     *
     * Top-level API
     *
     */

    var defaultLogger = new Logger();

    var _loggersByName = {};
    defaultLogger.getLogger = function getLogger(name) {
        if (typeof name !== "string" || name === "") {
          throw new TypeError("You must supply a name when creating a logger.");
        }

        var logger = _loggersByName[name];
        if (!logger) {
          logger = _loggersByName[name] = new Logger(
            name, defaultLogger.getLevel(), defaultLogger.methodFactory);
        }
        return logger;
    };

    // Grab the current global log variable in case of overwrite
    var _log = (typeof window !== undefinedType) ? window.log : undefined;
    defaultLogger.noConflict = function() {
        if (typeof window !== undefinedType &&
               window.log === defaultLogger) {
            window.log = _log;
        }

        return defaultLogger;
    };

    defaultLogger.getLoggers = function getLoggers() {
        return _loggersByName;
    };

    return defaultLogger;
}));

},{}],4:[function(require,module,exports){
/*
 (c) 2017, Vladimir Agafonkin
 Simplify.js, a high-performance JS polyline simplification library
 mourner.github.io/simplify-js
*/

(function () { 'use strict';

// to suit your point format, run search/replace for '.x' and '.y';
// for 3D version, see 3d branch (configurability would draw significant performance overhead)

// square distance between 2 points
function getSqDist(p1, p2) {

    var dx = p1.x - p2.x,
        dy = p1.y - p2.y;

    return dx * dx + dy * dy;
}

// square distance from a point to a segment
function getSqSegDist(p, p1, p2) {

    var x = p1.x,
        y = p1.y,
        dx = p2.x - x,
        dy = p2.y - y;

    if (dx !== 0 || dy !== 0) {

        var t = ((p.x - x) * dx + (p.y - y) * dy) / (dx * dx + dy * dy);

        if (t > 1) {
            x = p2.x;
            y = p2.y;

        } else if (t > 0) {
            x += dx * t;
            y += dy * t;
        }
    }

    dx = p.x - x;
    dy = p.y - y;

    return dx * dx + dy * dy;
}
// rest of the code doesn't care about point format

// basic distance-based simplification
function simplifyRadialDist(points, sqTolerance) {

    var prevPoint = points[0],
        newPoints = [prevPoint],
        point;

    for (var i = 1, len = points.length; i < len; i++) {
        point = points[i];

        if (getSqDist(point, prevPoint) > sqTolerance) {
            newPoints.push(point);
            prevPoint = point;
        }
    }

    if (prevPoint !== point) newPoints.push(point);

    return newPoints;
}

function simplifyDPStep(points, first, last, sqTolerance, simplified) {
    var maxSqDist = sqTolerance,
        index;

    for (var i = first + 1; i < last; i++) {
        var sqDist = getSqSegDist(points[i], points[first], points[last]);

        if (sqDist > maxSqDist) {
            index = i;
            maxSqDist = sqDist;
        }
    }

    if (maxSqDist > sqTolerance) {
        if (index - first > 1) simplifyDPStep(points, first, index, sqTolerance, simplified);
        simplified.push(points[index]);
        if (last - index > 1) simplifyDPStep(points, index, last, sqTolerance, simplified);
    }
}

// simplification using Ramer-Douglas-Peucker algorithm
function simplifyDouglasPeucker(points, sqTolerance) {
    var last = points.length - 1;

    var simplified = [points[0]];
    simplifyDPStep(points, 0, last, sqTolerance, simplified);
    simplified.push(points[last]);

    return simplified;
}

// both algorithms combined for awesome performance
function simplify(points, tolerance, highestQuality) {

    if (points.length <= 2) return points;

    var sqTolerance = tolerance !== undefined ? tolerance * tolerance : 1;

    points = highestQuality ? points : simplifyRadialDist(points, sqTolerance);
    points = simplifyDouglasPeucker(points, sqTolerance);

    return points;
}

// export as AMD module / Node module / browser or worker variable
if (typeof define === 'function' && define.amd) define(function() { return simplify; });
else if (typeof module !== 'undefined') {
    module.exports = simplify;
    module.exports.default = simplify;
} else if (typeof self !== 'undefined') self.simplify = simplify;
else window.simplify = simplify;

})();

},{}],5:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dat = require("dat.gui");
var tensor_field_gui_1 = require("./ts/ui/tensor_field_gui");
var roads_gui_1 = require("./ts/ui/roads_gui");
var canvas_wrapper_1 = require("./ts/ui/canvas_wrapper");
var util_1 = require("./ts/util");
var drag_controller_1 = require("./ts/ui/drag_controller");
var domain_controller_1 = require("./ts/ui/domain_controller");
var Main = /** @class */ (function () {
    function Main() {
        var _this = this;
        this.domainController = domain_controller_1.default.getInstance();
        this.gui = new dat.GUI({ width: 300 });
        this.dragController = new drag_controller_1.default(this.gui);
        // Options
        this.imageScale = 3;
        var c = document.getElementById(util_1.default.CANVAS_ID);
        this.canvas = new canvas_wrapper_1.default(c);
        var zoomController = this.gui.add(this.domainController, 'zoom');
        this.domainController.setZoomUpdate(function () { return zoomController.updateDisplay(); });
        this.tensorFolder = this.gui.addFolder('Tensor Field');
        this.tensorField = new tensor_field_gui_1.default(this.tensorFolder, this.dragController, true);
        this.tensorFolder.open();
        this.roadsFolder = this.gui.addFolder('Roads');
        this.roadsFolder.open();
        this.roadsGUI = new roads_gui_1.default(this.roadsFolder, this.tensorField, function () { return _this.tensorFolder.close(); });
        var optionsFolder = this.gui.addFolder('Options');
        optionsFolder.add(this.tensorField, 'drawCentre');
        optionsFolder.add(this.canvas, 'canvasScale');
        optionsFolder.add(this, 'imageScale', 1, 5);
        optionsFolder.add(this, 'download');
        this.tensorField.setRecommended();
        requestAnimationFrame(this.update.bind(this));
    }
    /**
     * Downloads image of map
     * Draws onto hidden canvas at requested resolution
     */
    Main.prototype.download = function () {
        var c = document.getElementById(util_1.default.IMG_CANVAS_ID);
        var imgCanvas = new canvas_wrapper_1.default(c, this.imageScale, false);
        this.draw(imgCanvas);
        var link = document.createElement('a');
        link.download = 'map.png';
        link.href = document.getElementById(util_1.default.IMG_CANVAS_ID).toDataURL();
        link.click();
    };
    Main.prototype.drawTensorField = function () {
        return !this.tensorFolder.closed || this.roadsGUI.roadsEmpty();
    };
    Main.prototype.draw = function (canvas) {
        canvas.setFillStyle('black');
        canvas.clearCanvas();
        if (this.drawTensorField()) {
            this.dragController.setDragDisabled(false);
            this.tensorField.draw(canvas);
        }
        else {
            this.dragController.setDragDisabled(true);
            this.roadsGUI.draw(canvas);
        }
    };
    Main.prototype.update = function () {
        this.draw(this.canvas);
        requestAnimationFrame(this.update.bind(this));
    };
    return Main;
}());
window.addEventListener('load', function () {
    new Main();
});

},{"./ts/ui/canvas_wrapper":13,"./ts/ui/domain_controller":14,"./ts/ui/drag_controller":15,"./ts/ui/roads_gui":17,"./ts/ui/tensor_field_gui":18,"./ts/util":19,"dat.gui":1}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.zeroVector = function () {
        return new Vector(0, 0);
    };
    Vector.fromScalar = function (s) {
        return new Vector(s, s);
    };
    /**
     * -pi to pi
     */
    Vector.angleBetween = function (v1, v2) {
        // -2pi to 2pi
        var angleBetween = v1.angle() - v2.angle();
        if (angleBetween > Math.PI) {
            angleBetween -= 2 * Math.PI;
        }
        else if (angleBetween <= -Math.PI) {
            angleBetween += 2 * Math.PI;
        }
        return angleBetween;
    };
    /**
     * Tests whether a point lies to the left of a line
     * @param  {Vector} linePoint     Point on the line
     * @param  {Vector} lineDirection
     * @param  {Vector} point
     * @return {Vector}               true if left, false otherwise
     */
    Vector.isLeft = function (linePoint, lineDirection, point) {
        var perpendicularVector = new Vector(lineDirection.y, -lineDirection.x);
        return point.clone().sub(linePoint).dot(perpendicularVector) < 0;
    };
    Vector.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    /**
     * Angle in radians to positive x-axis between -pi and pi
     */
    Vector.prototype.angle = function () {
        return Math.atan2(this.y, this.x);
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    Vector.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    Vector.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    Vector.prototype.divide = function (v) {
        if (v.x === 0 || v.y === 0) {
            log.warn("Division by zero");
            return this;
        }
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    Vector.prototype.divideScalar = function (s) {
        if (s === 0) {
            log.warn("Division by zero");
            return this;
        }
        return this.multiplyScalar(1 / s);
    };
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.equals = function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    };
    Vector.prototype.length = function () {
        return Math.sqrt(this.lengthSq());
    };
    Vector.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    Vector.prototype.multiplyScalar = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    Vector.prototype.negate = function () {
        return this.multiplyScalar(-1);
    };
    Vector.prototype.normalize = function () {
        var l = this.length();
        if (l === 0) {
            log.warn("Zero Vector");
            return this;
        }
        return this.divideScalar(this.length());
    };
    /**
     * Angle in radians
     */
    Vector.prototype.rotateAround = function (center, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x = this.x - center.x;
        var y = this.y - center.y;
        this.x = x * cos - y * sin + center.x;
        this.y = x * sin + y * cos + center.y;
        return this;
    };
    Vector.prototype.set = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vector.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vector.prototype.setLength = function (length) {
        return this.normalize().multiplyScalar(length);
    };
    Vector.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    return Vector;
}());
exports.default = Vector;

},{"loglevel":3}],7:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("./tensor");
var BasisField = /** @class */ (function () {
    function BasisField(centre, _size, _decay) {
        this._size = _size;
        this._decay = _decay;
        this._centre = centre.clone();
    }
    Object.defineProperty(BasisField.prototype, "centre", {
        get: function () {
            return this._centre.clone();
        },
        set: function (centre) {
            this._centre.copy(centre);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasisField.prototype, "decay", {
        set: function (decay) {
            this._decay = decay;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BasisField.prototype, "size", {
        set: function (size) {
            this._size = size;
        },
        enumerable: true,
        configurable: true
    });
    BasisField.prototype.dragMoveListener = function (delta) {
        // Delta assumed to be in world space (only relevant when zoomed)
        this._centre.add(delta);
    };
    BasisField.prototype.getWeightedTensor = function (point) {
        return this.getTensor(point).scale(this.getTensorWeight(point));
    };
    /**
     * Creates a folder and adds it to the GUI to control params
     */
    BasisField.prototype.setGui = function (gui) {
        gui.add(this._centre, 'x');
        gui.add(this._centre, 'y');
        gui.add(this, '_size');
        gui.add(this, '_decay', 0, 50);
    };
    /**
     * Interpolates between (0 and 1)^decay
     */
    BasisField.prototype.getTensorWeight = function (point) {
        var normDistanceToCentre = point.clone().sub(this._centre).length() / this._size;
        // Stop (** 0) turning weight into 1, filling screen even when outside 'size'
        if (this._decay === 0 && normDistanceToCentre >= 1) {
            return 0;
        }
        return Math.pow(Math.max(0, (1 - normDistanceToCentre)), this._decay);
    };
    BasisField.folderNameIndex = 0;
    return BasisField;
}());
exports.BasisField = BasisField;
var Grid = /** @class */ (function (_super) {
    __extends(Grid, _super);
    function Grid(centre, size, decay, _theta) {
        var _this = _super.call(this, centre, size, decay) || this;
        _this._theta = _theta;
        _this.FOLDER_NAME = "Grid " + Grid.folderNameIndex++;
        return _this;
    }
    Object.defineProperty(Grid.prototype, "theta", {
        set: function (theta) {
            this._theta = theta;
        },
        enumerable: true,
        configurable: true
    });
    Grid.prototype.setGui = function (gui) {
        var _this = this;
        _super.prototype.setGui.call(this, gui);
        // GUI in degrees, convert to rads
        var thetaProp = { theta: this._theta * 180 / Math.PI };
        var thetaController = gui.add(thetaProp, 'theta', -90, 90);
        thetaController.onChange(function (theta) { return _this._theta = theta * (Math.PI / 180); });
    };
    Grid.prototype.getTensor = function (point) {
        var cos = Math.cos(2 * this._theta);
        var sin = Math.sin(2 * this._theta);
        return new tensor_1.default(1, [cos, sin]);
    };
    return Grid;
}(BasisField));
exports.Grid = Grid;
var Radial = /** @class */ (function (_super) {
    __extends(Radial, _super);
    function Radial(centre, size, decay) {
        var _this = _super.call(this, centre, size, decay) || this;
        _this.FOLDER_NAME = "Radial " + Radial.folderNameIndex++;
        return _this;
    }
    Radial.prototype.getTensor = function (point) {
        var t = point.clone().sub(this._centre);
        var t1 = Math.pow(t.y, 2) - Math.pow(t.x, 2);
        var t2 = -2 * t.x * t.y;
        return new tensor_1.default(1, [t1, t2]);
    };
    return Radial;
}(BasisField));
exports.Radial = Radial;

},{"./tensor":11}],8:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var vector_1 = require("../vector");
var GridStorage = /** @class */ (function () {
    /**
     * worldDimensions assumes origin of 0,0
     * @param {number} dsep Separation distance between samples
     */
    function GridStorage(worldDimensions, origin, dsep) {
        this.worldDimensions = worldDimensions;
        this.origin = origin;
        this.dsep = dsep;
        this.dsepSq = this.dsep * this.dsep;
        this.gridDimensions = worldDimensions.clone().divideScalar(this.dsep);
        this.grid = [];
        for (var x = 0; x < this.gridDimensions.x; x++) {
            this.grid.push([]);
            for (var y = 0; y < this.gridDimensions.y; y++) {
                this.grid[x].push([]);
            }
        }
    }
    /**
     * Add all samples from another grid to this one
     */
    GridStorage.prototype.addAll = function (gridStorage) {
        var _this = this;
        gridStorage.grid.forEach(function (row) { return row.forEach(function (cell) { return cell.forEach(function (sample) {
            _this.addSample(sample);
        }); }); });
    };
    GridStorage.prototype.addPolyline = function (line) {
        var _this = this;
        line.forEach(function (v) { return _this.addSample(v); });
    };
    /**
     * Does not enforce separation
     * Does not clone
     */
    GridStorage.prototype.addSample = function (v, coords) {
        if (!coords) {
            coords = this.getSampleCoords(v);
        }
        this.grid[coords.x][coords.y].push(v);
    };
    /**
     * Tests whether v is at least d away from samples
     * Performance very important - this is called at every integration step
     * @param dSq=this.dsepSq squared test distance
     * Could be dtest if we are integrating a streamline
     */
    GridStorage.prototype.isValidSample = function (v, dSq) {
        // Code duplication with this.getNearbyPoints but much slower when calling
        // this.getNearbyPoints due to array creation in that method
        if (dSq === void 0) { dSq = this.dsepSq; }
        var coords = this.getSampleCoords(v);
        // Check samples in 9 cells in 3x3 grid
        for (var x = -1; x <= 1; x++) {
            for (var y = -1; y <= 1; y++) {
                var cell = coords.clone().add(new vector_1.default(x, y));
                if (!this.vectorOutOfBounds(cell, this.gridDimensions)) {
                    if (!this.vectorFarFromVectors(v, this.grid[cell.x][cell.y], dSq)) {
                        return false;
                    }
                }
            }
        }
        return true;
    };
    /**
     * Test whether v is at least d away from vectors
     * Performance very important - this is called at every integration step
     * @param {number}   dSq     squared test distance
     */
    GridStorage.prototype.vectorFarFromVectors = function (v, vectors, dSq) {
        for (var _i = 0, vectors_1 = vectors; _i < vectors_1.length; _i++) {
            var sample = vectors_1[_i];
            if (sample !== v) {
                var distanceSq = sample.distanceToSquared(v);
                if (distanceSq < dSq) {
                    return false;
                }
            }
        }
        return true;
    };
    /**
     * Returns points in cells surrounding v
     * Results include v, if it exists in the grid
     * @param {number} returns samples (kind of) closer than distance - returns all samples in
     * cells so approximation (square to approximate circle)
     */
    GridStorage.prototype.getNearbyPoints = function (v, distance) {
        var radius = Math.ceil((distance / this.dsep) - 0.5);
        var coords = this.getSampleCoords(v);
        var out = [];
        for (var x = -1 * radius; x <= 1 * radius; x++) {
            for (var y = -1 * radius; y <= 1 * radius; y++) {
                var cell = coords.clone().add(new vector_1.default(x, y));
                if (!this.vectorOutOfBounds(cell, this.gridDimensions)) {
                    this.grid[cell.x][cell.y].forEach(function (v2) {
                        out.push(v2);
                    });
                }
            }
        }
        return out;
    };
    GridStorage.prototype.worldToGrid = function (v) {
        return v.clone().sub(this.origin);
    };
    GridStorage.prototype.gridToWorld = function (v) {
        return v.clone().add(this.origin);
    };
    GridStorage.prototype.vectorOutOfBounds = function (gridV, bounds) {
        return (gridV.x < 0 || gridV.y < 0 ||
            gridV.x >= bounds.x || gridV.y >= bounds.y);
    };
    /**
     * @return {Vector}   Cell coords corresponding to vector
     * Performance important - called at every integration step
     */
    GridStorage.prototype.getSampleCoords = function (worldV) {
        var v = this.worldToGrid(worldV);
        if (this.vectorOutOfBounds(v, this.worldDimensions)) {
            log.error("Tried to access out-of-bounds sample in grid");
            return vector_1.default.zeroVector();
        }
        return new vector_1.default(Math.floor(v.x / this.dsep), Math.floor(v.y / this.dsep));
    };
    return GridStorage;
}());
exports.default = GridStorage;

},{"../vector":20,"loglevel":3}],9:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
var FieldIntegrator = /** @class */ (function () {
    function FieldIntegrator(field) {
        this.field = field;
    }
    FieldIntegrator.prototype.sampleFieldVector = function (point, major) {
        var tensor = this.field.samplePoint(point);
        if (major)
            return tensor.getMajor();
        return tensor.getMinor();
    };
    return FieldIntegrator;
}());
exports.default = FieldIntegrator;
var EulerIntegrator = /** @class */ (function (_super) {
    __extends(EulerIntegrator, _super);
    function EulerIntegrator(field, params) {
        var _this = _super.call(this, field) || this;
        _this.params = params;
        return _this;
    }
    EulerIntegrator.prototype.integrate = function (point, major) {
        return this.sampleFieldVector(point, major).multiplyScalar(this.params.dstep);
    };
    return EulerIntegrator;
}(FieldIntegrator));
exports.EulerIntegrator = EulerIntegrator;
var RK4Integrator = /** @class */ (function (_super) {
    __extends(RK4Integrator, _super);
    function RK4Integrator(field, params) {
        var _this = _super.call(this, field) || this;
        _this.params = params;
        return _this;
    }
    RK4Integrator.prototype.integrate = function (point, major) {
        var k1 = this.sampleFieldVector(point, major);
        var k23 = this.sampleFieldVector(point.clone().add(vector_1.default.fromScalar(this.params.dstep / 2)), major);
        var k4 = this.sampleFieldVector(point.clone().add(vector_1.default.fromScalar(this.params.dstep)), major);
        return k1.add(k23.multiplyScalar(4)).add(k4).multiplyScalar(this.params.dstep / 6);
    };
    return RK4Integrator;
}(FieldIntegrator));
exports.RK4Integrator = RK4Integrator;

},{"../vector":20}],10:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var simplify = require("simplify-js");
var vector_1 = require("../vector");
var grid_storage_1 = require("./grid_storage");
var StreamlineGenerator = /** @class */ (function () {
    /**
     * Uses world-space coordinates
     */
    function StreamlineGenerator(integrator, origin, worldDimensions, params) {
        this.integrator = integrator;
        this.origin = origin;
        this.worldDimensions = worldDimensions;
        this.params = params;
        this.SEED_AT_ENDPOINTS = false;
        this.NEAR_EDGE = 3; // Sample near edge
        this.candidateSeedsMajor = [];
        this.candidateSeedsMinor = [];
        this.streamlinesDone = true;
        this.lastStreamlineMajor = true;
        this.streamlinesMajor = [];
        this.streamlinesMinor = [];
        this.allStreamlinesSimple = []; // Reduced vertex count
        if (params.dstep > params.dsep) {
            log.error("STREAMLINE SAMPLE DISTANCE BIGGER THAN DSEP");
        }
        // Enforce test < sep
        params.dtest = Math.min(params.dtest, params.dsep);
        // Needs to be less than circlejoin
        this.dcollideselfSq = Math.pow((params.dcirclejoin / 2), 2);
        this.nStreamlineStep = Math.floor(params.dcirclejoin / params.dstep);
        this.nStreamlineLookBack = 2 * this.nStreamlineStep;
        this.majorGrid = new grid_storage_1.default(this.worldDimensions, this.origin, params.dsep);
        this.minorGrid = new grid_storage_1.default(this.worldDimensions, this.origin, params.dsep);
        this.setParamsSq();
    }
    StreamlineGenerator.prototype.clearStreamlines = function () {
        this.allStreamlinesSimple = [];
        this.streamlinesMajor = [];
        this.streamlinesMinor = [];
    };
    /**
     * Edits streamlines
     */
    StreamlineGenerator.prototype.joinDanglingStreamlines = function () {
        var _this = this;
        var _loop_1 = function (major) {
            var _loop_2 = function (streamline) {
                // Ignore circles
                if (streamline[0].equals(streamline[streamline.length - 1])) {
                    return "continue";
                }
                var newStart = this_1.getBestNextPoint(streamline[0], streamline[4], streamline);
                if (newStart !== null) {
                    this_1.pointsBetween(streamline[0], newStart, this_1.params.dstep).forEach(function (p) {
                        streamline.unshift(p);
                        _this.grid(major).addSample(p);
                    });
                    streamline.unshift(newStart);
                }
                var newEnd = this_1.getBestNextPoint(streamline[streamline.length - 1], streamline[streamline.length - 4], streamline);
                if (newEnd !== null) {
                    this_1.pointsBetween(streamline[streamline.length - 1], newEnd, this_1.params.dstep).forEach(function (p) {
                        streamline.push(p);
                        _this.grid(major).addSample(p);
                    });
                    streamline.push(newEnd);
                }
            };
            for (var _i = 0, _a = this_1.streamlines(major); _i < _a.length; _i++) {
                var streamline = _a[_i];
                _loop_2(streamline);
            }
        };
        var this_1 = this;
        // TODO do in update method
        for (var _i = 0, _a = [true, false]; _i < _a.length; _i++) {
            var major = _a[_i];
            _loop_1(major);
        }
        // Reset simplified streamlines
        this.allStreamlinesSimple = this.allStreamlines.map(function (s) { return _this.simplifyStreamline(s); });
    };
    /**
     * Returns array of points from v1 to v2 such that they are separated by at most dsep
     * not including v1 or v2
     */
    StreamlineGenerator.prototype.pointsBetween = function (v1, v2, dstep) {
        var d = v1.distanceTo(v2);
        var nPoints = Math.floor(d / dstep);
        if (nPoints === 0)
            return [];
        var stepVector = v2.clone().sub(v1).setLength(dstep);
        var out = [v1.clone().add(stepVector)];
        for (var i = 0; i < nPoints; i++) {
            out.push(out[out.length - 1].clone().add(stepVector));
        }
        return out;
    };
    /**
     * Gets next best point to join streamline
     * returns null if there are no good candidates
     */
    StreamlineGenerator.prototype.getBestNextPoint = function (point, previousPoint, streamline) {
        // Only consider points not on the edge
        if (point.x < this.NEAR_EDGE || point.x > this.worldDimensions.x - this.NEAR_EDGE) {
            return null;
        }
        if (point.y < this.NEAR_EDGE || point.y > this.worldDimensions.y - this.NEAR_EDGE) {
            return null;
        }
        var nearbyPoints = this.majorGrid.getNearbyPoints(point, this.params.dlookahead)
            .concat(this.minorGrid.getNearbyPoints(point, this.params.dlookahead));
        var direction = point.clone().sub(previousPoint);
        var closestSample = null;
        var closestDistance = Infinity;
        for (var _i = 0, nearbyPoints_1 = nearbyPoints; _i < nearbyPoints_1.length; _i++) {
            var sample = nearbyPoints_1[_i];
            if (!sample.equals(point) && !sample.equals(previousPoint) && !streamline.includes(sample)) {
                var differenceVector = sample.clone().sub(point);
                // Acute angle between vectors (agnostic of CW, ACW)
                var angleBetween = Math.abs(vector_1.default.angleBetween(direction, differenceVector));
                var distanceToSample = point.distanceToSquared(sample);
                // Filter by angle
                if (angleBetween < this.params.joinangle && distanceToSample < closestDistance) {
                    closestDistance = distanceToSample;
                    closestSample = sample;
                }
            }
        }
        // TODO if trying to find intersections in the simplified graph
        // return closest.clone().add(direction length simplify tolerance));
        // to prevent ends getting pulled away from simplified lines
        return closestSample;
    };
    /**
     * Assumes s has already generated
     */
    StreamlineGenerator.prototype.addExistingStreamlines = function (s) {
        this.majorGrid.addAll(s.majorGrid);
        this.minorGrid.addAll(s.minorGrid);
    };
    Object.defineProperty(StreamlineGenerator.prototype, "allStreamlines", {
        get: function () {
            // Combine
            return this.streamlinesMajor.concat(this.streamlinesMinor);
        },
        enumerable: true,
        configurable: true
    });
    StreamlineGenerator.prototype.update = function () {
        if (!this.streamlinesDone) {
            this.lastStreamlineMajor = !this.lastStreamlineMajor;
            if (!this.createStreamline(this.lastStreamlineMajor)) {
                this.streamlinesDone = true;
            }
        }
    };
    /**
     * Streamlines created each frame (animated)
     */
    StreamlineGenerator.prototype.createAllStreamlinesDynamic = function () {
        this.streamlinesDone = false;
        // this.joinDanglingStreamlines();
    };
    /**
     * All at once - will freeze if dsep small
     */
    StreamlineGenerator.prototype.createAllStreamlines = function () {
        var major = true;
        while (this.createStreamline(major)) {
            major = !major;
        }
    };
    StreamlineGenerator.prototype.simplifyStreamline = function (streamline) {
        return simplify(streamline, this.params.simplifyTolerance).map(function (point) { return new vector_1.default(point.x, point.y); });
    };
    /**
     * Finds seed and creates a streamline from that point
     * Pushes new candidate seeds to queue
     * @return {Vector[]} returns false if seed isn't found within params.seedTries
     */
    StreamlineGenerator.prototype.createStreamline = function (major) {
        var seed = this.getSeed(major);
        if (seed === null) {
            return false;
        }
        var streamline = this.integrateStreamline(seed, major);
        if (this.validStreamline(streamline)) {
            this.grid(major).addPolyline(streamline);
            this.streamlines(major).push(streamline);
            this.allStreamlinesSimple.push(this.simplifyStreamline(streamline));
            // Add candidate seeds
            if (!streamline[0].equals(streamline[streamline.length - 1])) {
                this.candidateSeeds(!major).push(streamline[0]);
                this.candidateSeeds(!major).push(streamline[streamline.length - 1]);
            }
        }
        return true;
    };
    StreamlineGenerator.prototype.validStreamline = function (s) {
        return s.length > 5;
    };
    StreamlineGenerator.prototype.setParamsSq = function () {
        this.paramsSq = Object.assign({}, this.params);
        for (var p in this.paramsSq) {
            this.paramsSq[p] *= this.paramsSq[p];
        }
    };
    StreamlineGenerator.prototype.samplePoint = function () {
        // TODO better seeding scheme
        return new vector_1.default(Math.random() * this.worldDimensions.x, Math.random() * this.worldDimensions.y)
            .add(this.origin);
    };
    /**
     * Tries this.candidateSeeds first, then samples using this.samplePoint
     */
    StreamlineGenerator.prototype.getSeed = function (major) {
        // Candidate seeds first
        if (this.SEED_AT_ENDPOINTS && this.candidateSeeds(major).length > 0) {
            while (this.candidateSeeds(major).length > 0) {
                var seed_1 = this.candidateSeeds(major).pop();
                if (this.grid(major).isValidSample(seed_1, this.paramsSq.dsep)) {
                    return seed_1;
                }
            }
        }
        var seed = this.samplePoint();
        var i = 0;
        while (!this.grid(major).isValidSample(seed, this.paramsSq.dsep)) {
            if (i >= this.params.seedTries) {
                return null;
            }
            seed = this.samplePoint();
            i++;
        }
        return seed;
    };
    // TODO enum to remove these functions
    StreamlineGenerator.prototype.candidateSeeds = function (major) {
        return major ? this.candidateSeedsMajor : this.candidateSeedsMinor;
    };
    StreamlineGenerator.prototype.streamlines = function (major) {
        return major ? this.streamlinesMajor : this.streamlinesMinor;
    };
    StreamlineGenerator.prototype.grid = function (major) {
        return major ? this.majorGrid : this.minorGrid;
    };
    StreamlineGenerator.prototype.pointInBounds = function (v) {
        return (v.x >= this.origin.x
            && v.y >= this.origin.y
            && v.x < this.worldDimensions.x + this.origin.x
            && v.y < this.worldDimensions.y + this.origin.y);
    };
    /**
     * Didn't end up using - bit expensive, used streamlineTurned instead
     * Stops spirals from forming
     * uses 0.5 dcirclejoin so that circles are still joined up
     * testSample is candidate to pushed on end of streamlineForwards
     * returns true if streamline collides with itself
     */
    StreamlineGenerator.prototype.doesStreamlineCollideSelf = function (testSample, streamlineForwards, streamlineBackwards) {
        // Streamline long enough
        if (streamlineForwards.length > this.nStreamlineLookBack) {
            // Forwards check
            for (var i = 0; i < streamlineForwards.length - this.nStreamlineLookBack; i += this.nStreamlineStep) {
                if (testSample.distanceToSquared(streamlineForwards[i]) < this.dcollideselfSq) {
                    return true;
                }
            }
            // Backwards check
            for (var i = 0; i < streamlineBackwards.length; i += this.nStreamlineStep) {
                if (testSample.distanceToSquared(streamlineBackwards[i]) < this.dcollideselfSq) {
                    return true;
                }
            }
        }
        return false;
    };
    /**
     * Tests whether streamline has turned through greater than 180 degrees
     */
    StreamlineGenerator.prototype.streamlineTurned = function (seed, originalDir, point, direction) {
        if (originalDir.dot(direction) < 0) {
            // TODO optimise
            var perpendicularVector = new vector_1.default(originalDir.y, -originalDir.x);
            var isLeft = point.clone().sub(seed).dot(perpendicularVector) < 0;
            var directionUp = direction.dot(perpendicularVector) > 0;
            return isLeft === directionUp;
        }
        return false;
    };
    /**
     * // TODO this doesn't work well - consider something disallowing one direction (F/B) to turn more than 180 deg
     * One step of the streamline integration process
     */
    StreamlineGenerator.prototype.streamlineIntegrationStep = function (params, major) {
        if (params.valid) {
            params.streamline.push(params.previousPoint);
            var nextDirection = this.integrator.integrate(params.previousPoint, major);
            // Make sure we travel in the same direction
            if (nextDirection.dot(params.previousDirection) < 0) {
                nextDirection.negate();
            }
            var nextPoint = params.previousPoint.clone().add(nextDirection);
            // Visualise stopping points
            // if (this.streamlineTurned(params.seed, params.originalDir, nextPoint, nextDirection)) {
            //     params.valid = false;
            //     params.streamline.push(Vector.zeroVector());
            // }
            if (this.pointInBounds(nextPoint)
                && this.grid(major).isValidSample(nextPoint, this.paramsSq.dtest)
                && !this.streamlineTurned(params.seed, params.originalDir, nextPoint, nextDirection)) {
                params.previousPoint = nextPoint;
                params.previousDirection = nextDirection;
            }
            else {
                params.valid = false;
            }
        }
    };
    /**
     * By simultaneously integrating in both directions we reduce the impact of circles not joining
     * up as the error matches at the join
     */
    StreamlineGenerator.prototype.integrateStreamline = function (seed, major) {
        var count = 0;
        var pointsEscaped = false; // True once two integration fronts have moved dlookahead away
        var d = this.integrator.integrate(seed, major);
        var forwardParams = {
            seed: seed,
            originalDir: d,
            streamline: [seed],
            previousDirection: d,
            previousPoint: seed.clone().add(d),
            valid: true,
        };
        forwardParams.valid = this.pointInBounds(forwardParams.previousPoint);
        var negD = d.clone().negate();
        var backwardParams = {
            seed: seed,
            originalDir: negD,
            streamline: [],
            previousDirection: negD,
            previousPoint: seed.clone().add(negD),
            valid: true,
        };
        backwardParams.valid = this.pointInBounds(backwardParams.previousPoint);
        while (count < this.params.pathIterations && (forwardParams.valid || backwardParams.valid)) {
            this.streamlineIntegrationStep(forwardParams, major);
            this.streamlineIntegrationStep(backwardParams, major);
            // Join up circles
            var sqDistanceBetweenPoints = forwardParams.previousPoint.distanceToSquared(backwardParams.previousPoint);
            if (!pointsEscaped && sqDistanceBetweenPoints > this.paramsSq.dcirclejoin) {
                pointsEscaped = true;
            }
            if (pointsEscaped && sqDistanceBetweenPoints <= this.paramsSq.dcirclejoin) {
                forwardParams.streamline.push(forwardParams.previousPoint);
                forwardParams.streamline.push(backwardParams.previousPoint);
                backwardParams.streamline.push(backwardParams.previousPoint);
                break;
            }
            count++;
        }
        return backwardParams.streamline.reverse().concat(forwardParams.streamline);
    };
    return StreamlineGenerator;
}());
exports.default = StreamlineGenerator;

},{"../vector":20,"./grid_storage":8,"loglevel":3,"simplify-js":4}],11:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
var Tensor = /** @class */ (function () {
    function Tensor(r, matrix) {
        this.r = r;
        this.matrix = matrix;
        // Matrix is 2 element list
        // [ 0, 1
        //   1, -0 ]
        this.oldTheta = false;
        this._theta = this.calculateTheta();
    }
    Object.defineProperty(Tensor.prototype, "theta", {
        get: function () {
            if (this.oldTheta) {
                this._theta = this.calculateTheta();
                this.oldTheta = false;
            }
            return this._theta;
        },
        enumerable: true,
        configurable: true
    });
    Tensor.prototype.add = function (tensor) {
        var _this = this;
        this.matrix = this.matrix.map(function (v, i) { return v * _this.r + tensor.matrix[i] * tensor.r; });
        this.r = 2;
        this.oldTheta = true;
        return this;
    };
    Tensor.prototype.scale = function (s) {
        this.r *= s;
        this.oldTheta = true;
        return this;
    };
    Tensor.prototype.getMajor = function () {
        return new vector_1.default(Math.cos(this.theta), Math.sin(this.theta));
    };
    Tensor.prototype.getMinor = function () {
        var angle = this.theta + Math.PI / 2;
        return new vector_1.default(Math.cos(angle), Math.sin(angle));
    };
    Tensor.prototype.calculateTheta = function () {
        if (this.r === 0) {
            return 0;
        }
        return Math.atan2(this.matrix[1] / this.r, this.matrix[0] / this.r) / 2;
    };
    return Tensor;
}());
exports.default = Tensor;

},{"../vector":20}],12:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("./tensor");
var basis_field_1 = require("./basis_field");
var TensorField = /** @class */ (function () {
    function TensorField() {
        this.basisFields = [];
    }
    TensorField.prototype.addGrid = function (centre, size, decay, theta) {
        var grid = new basis_field_1.Grid(centre, size, decay, theta);
        this.addField(grid);
    };
    TensorField.prototype.addRadial = function (centre, size, decay) {
        var radial = new basis_field_1.Radial(centre, size, decay);
        this.addField(radial);
    };
    TensorField.prototype.addField = function (field) {
        this.basisFields.push(field);
    };
    TensorField.prototype.removeField = function (field) {
        var index = this.basisFields.indexOf(field);
        if (index > -1) {
            this.basisFields.splice(index, 1);
        }
    };
    TensorField.prototype.reset = function () {
        this.basisFields = [];
    };
    TensorField.prototype.getCentrePoints = function () {
        return this.basisFields.map(function (field) { return field.centre; });
    };
    TensorField.prototype.samplePoint = function (point) {
        // Default field is a grid
        if (this.basisFields.length === 0) {
            return new tensor_1.default(1, [0, 0]);
        }
        var tensorAcc = new tensor_1.default(0, [0, 0]);
        this.basisFields.forEach(function (field) { return tensorAcc.add(field.getWeightedTensor(point)); });
        return tensorAcc;
    };
    return TensorField;
}());
exports.default = TensorField;

},{"./basis_field":7,"./tensor":11}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var CanvasWrapper = /** @class */ (function () {
    function CanvasWrapper(canvas, _scale, resizeToWindow) {
        var _this = this;
        if (_scale === void 0) { _scale = 1; }
        if (resizeToWindow === void 0) { resizeToWindow = true; }
        this._scale = _scale;
        this.ctx = canvas.getContext("2d");
        this.setDimensions();
        this.resizeCanvas();
        if (resizeToWindow) {
            window.addEventListener('resize', function () {
                _this.setDimensions();
                _this.resizeCanvas();
            });
        }
        this.setFillStyle('black');
        this.clearCanvas();
    }
    CanvasWrapper.prototype.setDimensions = function () {
        this._width = window.innerWidth * this._scale;
        this._height = window.innerHeight * this._scale;
    };
    Object.defineProperty(CanvasWrapper.prototype, "width", {
        get: function () {
            return this._width;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasWrapper.prototype, "height", {
        get: function () {
            return this._height;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(CanvasWrapper.prototype, "canvasScale", {
        get: function () {
            return this._scale;
        },
        set: function (s) {
            this._scale = s;
            this.setDimensions();
            this.resizeCanvas();
        },
        enumerable: true,
        configurable: true
    });
    CanvasWrapper.prototype.setFillStyle = function (colour) {
        this.ctx.fillStyle = colour;
    };
    CanvasWrapper.prototype.clearCanvas = function () {
        this.drawRectangle(0, 0, window.innerWidth, window.innerHeight);
    };
    CanvasWrapper.prototype.drawRectangle = function (x, y, width, height) {
        if (this._scale !== 1) {
            x *= this._scale;
            y *= this._scale;
            width *= this._scale;
            height *= this._scale;
        }
        this.ctx.fillRect(x, y, width, height);
    };
    CanvasWrapper.prototype.drawSquare = function (centre, radius) {
        this.drawRectangle(centre.x - radius, centre.y - radius, 2 * radius, 2 * radius);
    };
    CanvasWrapper.prototype.setLineWidth = function (width) {
        if (this._scale !== 1) {
            width *= this._scale;
        }
        this.ctx.lineWidth = width;
    };
    CanvasWrapper.prototype.setStrokeStyle = function (colour) {
        this.ctx.strokeStyle = colour;
    };
    CanvasWrapper.prototype.drawPolyline = function (line) {
        var _this = this;
        if (line.length < 2) {
            log.warn("Tried to draw path of length < 2");
            return;
        }
        if (this._scale !== 1) {
            line = line.map(function (v) { return v.clone().multiplyScalar(_this._scale); });
        }
        this.ctx.beginPath();
        this.ctx.moveTo(line[0].x, line[0].y);
        for (var i = 1; i < line.length; i++) {
            this.ctx.lineTo(line[i].x, line[i].y);
        }
        this.ctx.stroke();
    };
    CanvasWrapper.prototype.resizeCanvas = function () {
        this.ctx.canvas.width = this._width;
        this.ctx.canvas.height = this._height;
    };
    return CanvasWrapper;
}());
exports.default = CanvasWrapper;

},{"loglevel":3}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
/**
 * Singleton
 * Controls panning and zooming
 */
var DomainController = /** @class */ (function () {
    function DomainController() {
        var _this = this;
        this.ZOOM_SPEED = 0.96;
        // Location of screen origin in world space
        this._origin = vector_1.default.zeroVector();
        // Screen-space width and height
        this._screenDimensions = vector_1.default.zeroVector();
        // Ratio of screen pixels to world pixels
        this._zoom = 1;
        this.zoomCallback = function () { };
        this.setScreenDimensions();
        window.addEventListener('resize', function () { return _this.setScreenDimensions(); });
        window.addEventListener('wheel', function (e) {
            var delta = e.deltaY;
            // TODO scale by value of delta
            if (delta > 0) {
                _this.zoom = _this._zoom * _this.ZOOM_SPEED;
            }
            else {
                _this.zoom = _this._zoom / _this.ZOOM_SPEED;
            }
        });
    }
    DomainController.prototype.setScreenDimensions = function () {
        this._screenDimensions.setX(window.innerWidth);
        this._screenDimensions.setY(window.innerHeight);
    };
    DomainController.getInstance = function () {
        if (!DomainController.instance) {
            DomainController.instance = new DomainController();
        }
        return DomainController.instance;
    };
    /**
     * @param {Vector} delta in world space
     */
    DomainController.prototype.pan = function (delta) {
        this._origin.sub(delta);
    };
    Object.defineProperty(DomainController.prototype, "origin", {
        get: function () {
            return this._origin.clone();
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainController.prototype, "zoom", {
        get: function () {
            return this._zoom;
        },
        set: function (z) {
            if (z > 0) {
                var oldWorldSpaceMidpoint = this.origin.add(this.worldDimensions.divideScalar(2));
                this._zoom = z;
                var newWorldSpaceMidpoint = this.origin.add(this.worldDimensions.divideScalar(2));
                this.pan(newWorldSpaceMidpoint.sub(oldWorldSpaceMidpoint));
                this.zoomCallback();
            }
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainController.prototype, "screenDimensions", {
        get: function () {
            return this._screenDimensions.clone();
        },
        set: function (v) {
            this._screenDimensions.copy(v);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DomainController.prototype, "worldDimensions", {
        /**
         * @return {Vector} world-space w/h visible on screen
         */
        get: function () {
            return this.screenDimensions.divideScalar(this._zoom);
        },
        enumerable: true,
        configurable: true
    });
    DomainController.prototype.setZoomUpdate = function (callback) {
        this.zoomCallback = callback;
    };
    /**
     * Edits vector
     */
    DomainController.prototype.zoomToWorld = function (v) {
        return v.divideScalar(this._zoom);
    };
    /**
     * Edits vector
     */
    DomainController.prototype.zoomToScreen = function (v) {
        return v.multiplyScalar(this._zoom);
    };
    /**
     * Edits vector
     */
    DomainController.prototype.screenToWorld = function (v) {
        return this.zoomToWorld(v).add(this._origin);
    };
    /**
     * Edits vector
     */
    DomainController.prototype.worldToScreen = function (v) {
        return this.zoomToScreen(v.sub(this._origin));
    };
    return DomainController;
}());
exports.default = DomainController;

},{"../vector":20}],15:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var interactjs_1 = require("interactjs");
var util_1 = require("../util");
var Vector_1 = require("../Vector");
var domain_controller_1 = require("./domain_controller");
/**
* Register multiple centre points
* Closest one to mouse click will be selected to drag
* Up to caller to actually move their centre point via callback
*/
var DragController = /** @class */ (function () {
    function DragController(gui) {
        this.gui = gui;
        // How close to drag handle pointer needs to be
        this.MIN_DRAG_DISTANCE = 50;
        this.draggables = [];
        this.currentlyDragging = null;
        this.disabled = false;
        this.domainController = domain_controller_1.default.getInstance();
        interactjs_1.default("#" + util_1.default.CANVAS_ID).draggable({
            onstart: this.dragStart.bind(this),
            onmove: this.dragMove.bind(this),
            onend: this.dragEnd.bind(this),
            cursorChecker: this.getCursor.bind(this),
        });
    }
    DragController.prototype.setDragDisabled = function (disable) {
        this.disabled = disable;
    };
    DragController.prototype.getCursor = function (action, interactable, element, interacting) {
        if (interacting)
            return 'grabbing';
        return 'grab';
    };
    DragController.prototype.dragStart = function (event) {
        var _this = this;
        // Transform screen space to world space
        var origin = this.domainController.screenToWorld(new Vector_1.default(event.x0, event.y0));
        var closestDistance = Infinity;
        this.draggables.forEach(function (draggable) {
            var d = draggable.getCentre().distanceTo(origin);
            if (d < closestDistance) {
                closestDistance = d;
                _this.currentlyDragging = draggable;
            }
        });
        // Zoom screen size to world size for consistent drag distance while zoomed in
        var scaledDragDistance = this.MIN_DRAG_DISTANCE / this.domainController.zoom;
        if (closestDistance > scaledDragDistance) {
            this.currentlyDragging = null;
        }
    };
    DragController.prototype.dragMove = function (event) {
        var delta = new Vector_1.default(event.delta.x, event.delta.y);
        this.domainController.zoomToWorld(delta);
        if (!this.disabled && this.currentlyDragging !== null) {
            // Drag field
            this.currentlyDragging.callbackFn(delta);
        }
        else {
            // Move map
            this.domainController.pan(delta);
        }
    };
    DragController.prototype.dragEnd = function () {
        this.currentlyDragging = null;
        util_1.default.updateGui(this.gui);
    };
    /**
     * @param {(() => Vector)} Gets centre point
     * @param {((v: Vector) => void)} Called on move with delta vector
     * @returns {(() => void)} Function to deregister callback
     */
    DragController.prototype.register = function (getCentre, onMove) {
        var _this = this;
        var draggable = {
            getCentre: getCentre,
            callbackFn: onMove,
        };
        this.draggables.push(draggable);
        return (function () {
            var index = _this.draggables.indexOf(draggable);
            if (index >= 0) {
                _this.draggables.splice(index, 1);
            }
        }).bind(this);
    };
    return DragController;
}());
exports.default = DragController;

},{"../Vector":6,"../util":19,"./domain_controller":14,"interactjs":2}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain_controller_1 = require("./domain_controller");
var util_1 = require("../util");
var streamlines_1 = require("../impl/streamlines");
var RoadGUI = /** @class */ (function () {
    function RoadGUI(params, integrator, guiFolder, closeTensorFolder, folderName) {
        var _this = this;
        this.params = params;
        this.integrator = integrator;
        this.guiFolder = guiFolder;
        this.closeTensorFolder = closeTensorFolder;
        this.folderName = folderName;
        this.existingStreamlines = [];
        this.domainController = domain_controller_1.default.getInstance();
        this.streamlines = new streamlines_1.default(this.integrator, this.domainController.origin, this.domainController.worldDimensions, this.params);
        var roadGUI = {
            Generate: this.generateRoads.bind(this),
            JoinDangling: function () { return _this.streamlines.joinDanglingStreamlines(); },
        };
        var folder = this.guiFolder.addFolder(this.folderName);
        folder.open();
        folder.add(roadGUI, 'Generate');
        folder.add(roadGUI, 'JoinDangling');
        var paramsFolder = folder.addFolder('Params');
        paramsFolder.add(this.params, 'dsep');
        paramsFolder.add(this.params, 'dtest');
        var devParamsFolder = paramsFolder.addFolder('Dev');
        this.addDevParamsToFolder(this.params, devParamsFolder);
        // Update path iterations based on window size
        this.setPathIterations();
        window.addEventListener('resize', function () { return _this.setPathIterations(); });
    }
    RoadGUI.prototype.draw = function (canvas) {
        var _this = this;
        this.streamlines.allStreamlinesSimple.forEach(function (s) {
            canvas.drawPolyline(s.map(function (v) { return _this.domainController.worldToScreen(v.clone()); }));
        });
    };
    RoadGUI.prototype.roadsEmpty = function () {
        return this.streamlines.allStreamlinesSimple.length === 0;
    };
    RoadGUI.prototype.setExistingStreamlines = function (existingStreamlines) {
        this.existingStreamlines = existingStreamlines;
    };
    RoadGUI.prototype.generateRoads = function () {
        var _this = this;
        this.streamlines = new streamlines_1.default(this.integrator, this.domainController.origin, this.domainController.worldDimensions, Object.assign({}, this.params));
        this.existingStreamlines.forEach(function (s) { return _this.streamlines.addExistingStreamlines(s.streamlines); });
        this.streamlines.createAllStreamlines();
        this.closeTensorFolder();
    };
    RoadGUI.prototype.addDevParamsToFolder = function (params, folder) {
        folder.add(params, 'pathIterations');
        folder.add(params, 'seedTries');
        folder.add(params, 'dstep');
        folder.add(params, 'dlookahead');
        folder.add(params, 'dcirclejoin');
        folder.add(params, 'joinangle');
        folder.add(params, 'simplifyTolerance');
    };
    /**
     * Sets path iterations so that a road can cover the screen
     */
    RoadGUI.prototype.setPathIterations = function () {
        var max = 1.5 * Math.max(window.innerWidth, window.innerHeight);
        this.params.pathIterations = max / this.params.dstep;
        util_1.default.updateGui(this.guiFolder);
    };
    return RoadGUI;
}());
exports.default = RoadGUI;

},{"../impl/streamlines":10,"../util":19,"./domain_controller":14}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var domain_controller_1 = require("./domain_controller");
var integrator_1 = require("../impl/integrator");
var road_gui_1 = require("./road_gui");
var RoadsGUI = /** @class */ (function () {
    function RoadsGUI(guiFolder, tensorField, closeTensorFolder) {
        this.guiFolder = guiFolder;
        this.domainController = domain_controller_1.default.getInstance();
        this.minorParams = {
            dsep: 20,
            dtest: 10,
            dstep: 1,
            dlookahead: 100,
            dcirclejoin: 5,
            joinangle: 0.1,
            pathIterations: 1000,
            seedTries: 300,
            simplifyTolerance: 0.5,
        };
        this.majorParams = Object.assign({}, this.minorParams);
        this.majorParams.dsep = 100;
        this.majorParams.dtest = 30;
        this.majorParams.dlookahead = 200;
        this.mainParams = Object.assign({}, this.minorParams);
        this.mainParams.dsep = 400;
        this.mainParams.dtest = 200;
        this.mainParams.dlookahead = 300;
        var integrator = new integrator_1.RK4Integrator(tensorField, this.minorParams);
        this.mainRoads = new road_gui_1.default(this.mainParams, integrator, this.guiFolder, closeTensorFolder, 'Main');
        this.majorRoads = new road_gui_1.default(this.majorParams, integrator, this.guiFolder, closeTensorFolder, 'Major');
        this.minorRoads = new road_gui_1.default(this.minorParams, integrator, this.guiFolder, closeTensorFolder, 'Minor');
        this.minorRoads.setExistingStreamlines([this.mainRoads, this.majorRoads]);
        this.majorRoads.setExistingStreamlines([this.mainRoads]);
    }
    RoadsGUI.prototype.draw = function (canvas) {
        // Draw Roads
        canvas.setFillStyle('#ECE5DB');
        canvas.clearCanvas();
        // Minor
        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(3);
        this.minorRoads.draw(canvas);
        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(5);
        this.majorRoads.draw(canvas);
        canvas.setStrokeStyle('#282828');
        canvas.setLineWidth(6);
        this.mainRoads.draw(canvas);
        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(2);
        this.minorRoads.draw(canvas);
        // Major
        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(4);
        this.majorRoads.draw(canvas);
        // Major Major
        canvas.setStrokeStyle('#FAFA7A');
        canvas.setLineWidth(5);
        this.mainRoads.draw(canvas);
    };
    RoadsGUI.prototype.roadsEmpty = function () {
        return this.majorRoads.roadsEmpty()
            && this.minorRoads.roadsEmpty()
            && this.mainRoads.roadsEmpty();
    };
    return RoadsGUI;
}());
exports.default = RoadsGUI;

},{"../impl/integrator":9,"./domain_controller":14,"./road_gui":16}],18:[function(require,module,exports){
"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var domain_controller_1 = require("./domain_controller");
var tensor_field_1 = require("../impl/tensor_field");
var util_1 = require("../util");
var vector_1 = require("../vector");
var TensorFieldGUI = /** @class */ (function (_super) {
    __extends(TensorFieldGUI, _super);
    function TensorFieldGUI(guiFolder, dragController, drawCentre) {
        var _this = _super.call(this) || this;
        _this.guiFolder = guiFolder;
        _this.dragController = dragController;
        _this.drawCentre = drawCentre;
        _this.TENSOR_LINE_DIAMETER = 20;
        _this.TENSOR_SPAWN_SCALE = 0.7; // How much to shrink worldDimensions to find spawn point
        _this.domainController = domain_controller_1.default.getInstance();
        // For custom naming of gui buttons
        var tensorFieldGuiObj = {
            reset: function () { return _this.reset(); },
            setRecommended: function () { return _this.setRecommended(); },
            addRadial: function () { return _this.addRadialRandom(); },
            addGrid: function () { return _this.addGridRandom(); },
        };
        _this.guiFolder.add(tensorFieldGuiObj, 'reset');
        _this.guiFolder.add(tensorFieldGuiObj, 'setRecommended');
        _this.guiFolder.add(tensorFieldGuiObj, 'addRadial');
        _this.guiFolder.add(tensorFieldGuiObj, 'addGrid');
        return _this;
    }
    /**
     * 4 Grids, one radial
     */
    TensorFieldGUI.prototype.setRecommended = function () {
        this.reset();
        var size = this.domainController.worldDimensions.multiplyScalar(this.TENSOR_SPAWN_SCALE);
        var newOrigin = this.domainController.worldDimensions
            .multiplyScalar((1 - this.TENSOR_SPAWN_SCALE) / 2)
            .add(this.domainController.origin);
        this.addGridAtLocation(newOrigin);
        this.addGridAtLocation(newOrigin.clone().add(size));
        this.addGridAtLocation(newOrigin.clone().add(new vector_1.default(size.x, 0)));
        this.addGridAtLocation(newOrigin.clone().add(new vector_1.default(0, size.y)));
        this.addRadialRandom();
    };
    TensorFieldGUI.prototype.addRadialRandom = function () {
        var width = this.domainController.worldDimensions.x;
        this.addRadial(this.randomLocation(), util_1.default.randomRange(width / 10, width / 5), // Size
        util_1.default.randomRange(50)); // Decay
    };
    TensorFieldGUI.prototype.addGridRandom = function () {
        this.addGridAtLocation(this.randomLocation());
    };
    TensorFieldGUI.prototype.addGridAtLocation = function (location) {
        var width = this.domainController.worldDimensions.x;
        this.addGrid(location, util_1.default.randomRange(width / 4, width), // Size
        util_1.default.randomRange(50), // Decay
        util_1.default.randomRange(Math.PI / 2));
    };
    /**
     * World-space random location for tensor field spawn
     * Sampled from middle of screen (shrunk rectangle)
     */
    TensorFieldGUI.prototype.randomLocation = function () {
        var size = this.domainController.worldDimensions.multiplyScalar(this.TENSOR_SPAWN_SCALE);
        var location = new vector_1.default(Math.random(), Math.random()).multiply(size);
        var newOrigin = this.domainController.worldDimensions.multiplyScalar((1 - this.TENSOR_SPAWN_SCALE) / 2);
        return location.add(this.domainController.origin).add(newOrigin);
    };
    TensorFieldGUI.prototype.getCrossLocations = function () {
        // Gets grid of points for vector field vis in world space
        var diameter = this.TENSOR_LINE_DIAMETER / this.domainController.zoom;
        var worldDimensions = this.domainController.worldDimensions;
        var nHor = Math.ceil(worldDimensions.x / diameter) + 1; // Prevent pop-in
        var nVer = Math.ceil(worldDimensions.y / diameter) + 1;
        var originX = diameter * Math.floor(this.domainController.origin.x / diameter);
        var originY = diameter * Math.floor(this.domainController.origin.y / diameter);
        var out = [];
        for (var x = 0; x <= nHor; x++) {
            for (var y = 0; y <= nVer; y++) {
                out.push(new vector_1.default(originX + (x * diameter), originY + (y * diameter)));
            }
        }
        return out;
    };
    TensorFieldGUI.prototype.getTensorLine = function (point, tensorV) {
        var transformedPoint = this.domainController.worldToScreen(point.clone());
        var diff = tensorV.multiplyScalar(this.TENSOR_LINE_DIAMETER / 2); // Assumes normalised
        var start = transformedPoint.clone().sub(diff);
        var end = transformedPoint.clone().add(diff);
        return [start, end];
    };
    TensorFieldGUI.prototype.draw = function (canvas) {
        var _this = this;
        // Draw tensor field
        canvas.setStrokeStyle('white');
        canvas.setLineWidth(1);
        var tensorPoints = this.getCrossLocations();
        tensorPoints.forEach(function (p) {
            var t = _this.samplePoint(p);
            canvas.drawPolyline(_this.getTensorLine(p, t.getMajor()));
            canvas.drawPolyline(_this.getTensorLine(p, t.getMinor()));
        });
        // Draw centre points of fields
        if (this.drawCentre) {
            canvas.setFillStyle('red');
            this.getCentrePoints().forEach(function (v) {
                return canvas.drawSquare(_this.domainController.worldToScreen(v), 7);
            });
        }
    };
    TensorFieldGUI.prototype.addField = function (field) {
        var _this = this;
        _super.prototype.addField.call(this, field);
        var folder = this.guiFolder.addFolder("" + field.FOLDER_NAME);
        // Function to deregister from drag controller
        var deregisterDrag = this.dragController.register(function () { return field.centre; }, field.dragMoveListener.bind(field));
        var removeFieldObj = { remove: function () { return _this.removeFieldGUI.bind(_this)(field, folder, deregisterDrag); } };
        // Give dat gui removeField button
        folder.add(removeFieldObj, 'remove');
        field.setGui(folder);
    };
    TensorFieldGUI.prototype.removeFieldGUI = function (field, folder, deregisterDrag) {
        _super.prototype.removeField.call(this, field);
        this.guiFolder.removeFolder(folder);
        // Deregister from drag controller
        deregisterDrag();
    };
    TensorFieldGUI.prototype.reset = function () {
        // TODO kind of hacky - calling remove callbacks from gui object, should store callbacks
        // in addfield and call them (requires making sure they're idempotent)
        for (var fieldFolderName in this.guiFolder.__folders) {
            var fieldFolder = this.guiFolder.__folders[fieldFolderName];
            fieldFolder.__controllers[0].initialValue();
        }
        _super.prototype.reset.call(this);
    };
    return TensorFieldGUI;
}(tensor_field_1.default));
exports.default = TensorFieldGUI;

},{"../impl/tensor_field":12,"../util":19,"../vector":20,"./domain_controller":14}],19:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Util = /** @class */ (function () {
    function Util() {
    }
    Util.updateGui = function (gui) {
        if (gui.__controllers) {
            gui.__controllers.forEach(function (c) { return c.updateDisplay(); });
        }
        if (gui.__folders) {
            for (var folderName in gui.__folders) {
                this.updateGui(gui.__folders[folderName]);
            }
        }
    };
    Util.removeAllFolders = function (gui) {
        if (gui.__folders) {
            for (var folderName in gui.__folders) {
                gui.removeFolder(gui.__folders[folderName]);
            }
        }
    };
    Util.randomRange = function (max, min) {
        if (min === void 0) { min = 0; }
        return (Math.random() * (max - min)) + min;
    };
    // Must match style.css
    Util.CANVAS_ID = 'map-canvas';
    Util.IMG_CANVAS_ID = 'img-canvas';
    return Util;
}());
exports.default = Util;

},{}],20:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var Vector = /** @class */ (function () {
    function Vector(x, y) {
        this.x = x;
        this.y = y;
    }
    Vector.zeroVector = function () {
        return new Vector(0, 0);
    };
    Vector.fromScalar = function (s) {
        return new Vector(s, s);
    };
    /**
     * -pi to pi
     */
    Vector.angleBetween = function (v1, v2) {
        // -2pi to 2pi
        var angleBetween = v1.angle() - v2.angle();
        if (angleBetween > Math.PI) {
            angleBetween -= 2 * Math.PI;
        }
        else if (angleBetween <= -Math.PI) {
            angleBetween += 2 * Math.PI;
        }
        return angleBetween;
    };
    /**
     * Tests whether a point lies to the left of a line
     * @param  {Vector} linePoint     Point on the line
     * @param  {Vector} lineDirection
     * @param  {Vector} point
     * @return {Vector}               true if left, false otherwise
     */
    Vector.isLeft = function (linePoint, lineDirection, point) {
        var perpendicularVector = new Vector(lineDirection.y, -lineDirection.x);
        return point.clone().sub(linePoint).dot(perpendicularVector) < 0;
    };
    Vector.prototype.add = function (v) {
        this.x += v.x;
        this.y += v.y;
        return this;
    };
    /**
     * Angle in radians to positive x-axis between -pi and pi
     */
    Vector.prototype.angle = function () {
        return Math.atan2(this.y, this.x);
    };
    Vector.prototype.clone = function () {
        return new Vector(this.x, this.y);
    };
    Vector.prototype.copy = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector.prototype.cross = function (v) {
        return this.x * v.y - this.y * v.x;
    };
    Vector.prototype.distanceTo = function (v) {
        return Math.sqrt(this.distanceToSquared(v));
    };
    Vector.prototype.distanceToSquared = function (v) {
        var dx = this.x - v.x;
        var dy = this.y - v.y;
        return dx * dx + dy * dy;
    };
    Vector.prototype.divide = function (v) {
        if (v.x === 0 || v.y === 0) {
            log.warn("Division by zero");
            return this;
        }
        this.x /= v.x;
        this.y /= v.y;
        return this;
    };
    Vector.prototype.divideScalar = function (s) {
        if (s === 0) {
            log.warn("Division by zero");
            return this;
        }
        return this.multiplyScalar(1 / s);
    };
    Vector.prototype.dot = function (v) {
        return this.x * v.x + this.y * v.y;
    };
    Vector.prototype.equals = function (v) {
        return ((v.x === this.x) && (v.y === this.y));
    };
    Vector.prototype.length = function () {
        return Math.sqrt(this.lengthSq());
    };
    Vector.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector.prototype.multiply = function (v) {
        this.x *= v.x;
        this.y *= v.y;
        return this;
    };
    Vector.prototype.multiplyScalar = function (s) {
        this.x *= s;
        this.y *= s;
        return this;
    };
    Vector.prototype.negate = function () {
        return this.multiplyScalar(-1);
    };
    Vector.prototype.normalize = function () {
        var l = this.length();
        if (l === 0) {
            log.warn("Zero Vector");
            return this;
        }
        return this.divideScalar(this.length());
    };
    /**
     * Angle in radians
     */
    Vector.prototype.rotateAround = function (center, angle) {
        var cos = Math.cos(angle);
        var sin = Math.sin(angle);
        var x = this.x - center.x;
        var y = this.y - center.y;
        this.x = x * cos - y * sin + center.x;
        this.y = x * sin + y * cos + center.y;
        return this;
    };
    Vector.prototype.set = function (v) {
        this.x = v.x;
        this.y = v.y;
        return this;
    };
    Vector.prototype.setX = function (x) {
        this.x = x;
        return this;
    };
    Vector.prototype.setY = function (y) {
        this.y = y;
        return this;
    };
    Vector.prototype.setLength = function (length) {
        return this.normalize().multiplyScalar(length);
    };
    Vector.prototype.sub = function (v) {
        this.x -= v.x;
        this.y -= v.y;
        return this;
    };
    return Vector;
}());
exports.default = Vector;

},{"loglevel":3}]},{},[5,7,8,9,10,12,11,13,14,15,16,17,18,19,20])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGF0Lmd1aS9idWlsZC9kYXQuZ3VpLmpzIiwibm9kZV9tb2R1bGVzL2ludGVyYWN0anMvZGlzdC9pbnRlcmFjdC5taW4uanMiLCJub2RlX21vZHVsZXMvbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsaWZ5LWpzL3NpbXBsaWZ5LmpzIiwic3JjL21haW4udHMiLCJzcmMvdHMvVmVjdG9yLnRzIiwic3JjL3RzL2ltcGwvYmFzaXNfZmllbGQudHMiLCJzcmMvdHMvaW1wbC9ncmlkX3N0b3JhZ2UudHMiLCJzcmMvdHMvaW1wbC9pbnRlZ3JhdG9yLnRzIiwic3JjL3RzL2ltcGwvc3RyZWFtbGluZXMudHMiLCJzcmMvdHMvaW1wbC90ZW5zb3IudHMiLCJzcmMvdHMvaW1wbC90ZW5zb3JfZmllbGQudHMiLCJzcmMvdHMvdWkvY2FudmFzX3dyYXBwZXIudHMiLCJzcmMvdHMvdWkvZG9tYWluX2NvbnRyb2xsZXIudHMiLCJzcmMvdHMvdWkvZHJhZ19jb250cm9sbGVyLnRzIiwic3JjL3RzL3VpL3JvYWRfZ3VpLnRzIiwic3JjL3RzL3VpL3JvYWRzX2d1aS50cyIsInNyYy90cy91aS90ZW5zb3JfZmllbGRfZ3VpLnRzIiwic3JjL3RzL3V0aWwudHMiLCJzcmMvdHMvdmVjdG9yLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN6K0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVRQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QUM7SUFFRCxxQkFBSSxHQUFKLFVBQUssQ0FBUztRQUNWLElBQUksQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ1gsT0FBTyxJQUFJLENBQUM7SUFDaEIsQ0FBQztJQUVELHFCQUFJLEdBQUosVUFBSyxDQUFTO1FBQ1YsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDWCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBRUQsMEJBQVMsR0FBVCxVQUFXLE1BQWM7UUFDckIsT0FBTyxJQUFJLENBQUMsU0FBUyxFQUFFLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25ELENBQUM7SUFFRCxvQkFBRyxHQUFILFVBQUksQ0FBUztRQUNULElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFDTCxhQUFDO0FBQUQsQ0EvS0EsQUErS0MsSUFBQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogZGF0LWd1aSBKYXZhU2NyaXB0IENvbnRyb2xsZXIgTGlicmFyeVxuICogaHR0cDovL2NvZGUuZ29vZ2xlLmNvbS9wL2RhdC1ndWlcbiAqXG4gKiBDb3B5cmlnaHQgMjAxMSBEYXRhIEFydHMgVGVhbSwgR29vZ2xlIENyZWF0aXZlIExhYlxuICpcbiAqIExpY2Vuc2VkIHVuZGVyIHRoZSBBcGFjaGUgTGljZW5zZSwgVmVyc2lvbiAyLjAgKHRoZSBcIkxpY2Vuc2VcIik7XG4gKiB5b3UgbWF5IG5vdCB1c2UgdGhpcyBmaWxlIGV4Y2VwdCBpbiBjb21wbGlhbmNlIHdpdGggdGhlIExpY2Vuc2UuXG4gKiBZb3UgbWF5IG9idGFpbiBhIGNvcHkgb2YgdGhlIExpY2Vuc2UgYXRcbiAqXG4gKiBodHRwOi8vd3d3LmFwYWNoZS5vcmcvbGljZW5zZXMvTElDRU5TRS0yLjBcbiAqL1xuXG4oZnVuY3Rpb24gKGdsb2JhbCwgZmFjdG9yeSkge1xuXHR0eXBlb2YgZXhwb3J0cyA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcgPyBmYWN0b3J5KGV4cG9ydHMpIDpcblx0dHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kID8gZGVmaW5lKFsnZXhwb3J0cyddLCBmYWN0b3J5KSA6XG5cdChmYWN0b3J5KChnbG9iYWwuZGF0ID0ge30pKSk7XG59KHRoaXMsIChmdW5jdGlvbiAoZXhwb3J0cykgeyAndXNlIHN0cmljdCc7XG5cbmZ1bmN0aW9uIF9fXyRpbnNlcnRTdHlsZShjc3MpIHtcbiAgaWYgKCFjc3MpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgaWYgKHR5cGVvZiB3aW5kb3cgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgdmFyIHN0eWxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3R5bGUnKTtcblxuICBzdHlsZS5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dC9jc3MnKTtcbiAgc3R5bGUuaW5uZXJIVE1MID0gY3NzO1xuICBkb2N1bWVudC5oZWFkLmFwcGVuZENoaWxkKHN0eWxlKTtcblxuICByZXR1cm4gY3NzO1xufVxuXG5mdW5jdGlvbiBjb2xvclRvU3RyaW5nIChjb2xvciwgZm9yY2VDU1NIZXgpIHtcbiAgdmFyIGNvbG9yRm9ybWF0ID0gY29sb3IuX19zdGF0ZS5jb252ZXJzaW9uTmFtZS50b1N0cmluZygpO1xuICB2YXIgciA9IE1hdGgucm91bmQoY29sb3Iucik7XG4gIHZhciBnID0gTWF0aC5yb3VuZChjb2xvci5nKTtcbiAgdmFyIGIgPSBNYXRoLnJvdW5kKGNvbG9yLmIpO1xuICB2YXIgYSA9IGNvbG9yLmE7XG4gIHZhciBoID0gTWF0aC5yb3VuZChjb2xvci5oKTtcbiAgdmFyIHMgPSBjb2xvci5zLnRvRml4ZWQoMSk7XG4gIHZhciB2ID0gY29sb3Iudi50b0ZpeGVkKDEpO1xuICBpZiAoZm9yY2VDU1NIZXggfHwgY29sb3JGb3JtYXQgPT09ICdUSFJFRV9DSEFSX0hFWCcgfHwgY29sb3JGb3JtYXQgPT09ICdTSVhfQ0hBUl9IRVgnKSB7XG4gICAgdmFyIHN0ciA9IGNvbG9yLmhleC50b1N0cmluZygxNik7XG4gICAgd2hpbGUgKHN0ci5sZW5ndGggPCA2KSB7XG4gICAgICBzdHIgPSAnMCcgKyBzdHI7XG4gICAgfVxuICAgIHJldHVybiAnIycgKyBzdHI7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdDU1NfUkdCJykge1xuICAgIHJldHVybiAncmdiKCcgKyByICsgJywnICsgZyArICcsJyArIGIgKyAnKSc7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdDU1NfUkdCQScpIHtcbiAgICByZXR1cm4gJ3JnYmEoJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcsJyArIGEgKyAnKSc7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdIRVgnKSB7XG4gICAgcmV0dXJuICcweCcgKyBjb2xvci5oZXgudG9TdHJpbmcoMTYpO1xuICB9IGVsc2UgaWYgKGNvbG9yRm9ybWF0ID09PSAnUkdCX0FSUkFZJykge1xuICAgIHJldHVybiAnWycgKyByICsgJywnICsgZyArICcsJyArIGIgKyAnXSc7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdSR0JBX0FSUkFZJykge1xuICAgIHJldHVybiAnWycgKyByICsgJywnICsgZyArICcsJyArIGIgKyAnLCcgKyBhICsgJ10nO1xuICB9IGVsc2UgaWYgKGNvbG9yRm9ybWF0ID09PSAnUkdCX09CSicpIHtcbiAgICByZXR1cm4gJ3tyOicgKyByICsgJyxnOicgKyBnICsgJyxiOicgKyBiICsgJ30nO1xuICB9IGVsc2UgaWYgKGNvbG9yRm9ybWF0ID09PSAnUkdCQV9PQkonKSB7XG4gICAgcmV0dXJuICd7cjonICsgciArICcsZzonICsgZyArICcsYjonICsgYiArICcsYTonICsgYSArICd9JztcbiAgfSBlbHNlIGlmIChjb2xvckZvcm1hdCA9PT0gJ0hTVl9PQkonKSB7XG4gICAgcmV0dXJuICd7aDonICsgaCArICcsczonICsgcyArICcsdjonICsgdiArICd9JztcbiAgfSBlbHNlIGlmIChjb2xvckZvcm1hdCA9PT0gJ0hTVkFfT0JKJykge1xuICAgIHJldHVybiAne2g6JyArIGggKyAnLHM6JyArIHMgKyAnLHY6JyArIHYgKyAnLGE6JyArIGEgKyAnfSc7XG4gIH1cbiAgcmV0dXJuICd1bmtub3duIGZvcm1hdCc7XG59XG5cbnZhciBBUlJfRUFDSCA9IEFycmF5LnByb3RvdHlwZS5mb3JFYWNoO1xudmFyIEFSUl9TTElDRSA9IEFycmF5LnByb3RvdHlwZS5zbGljZTtcbnZhciBDb21tb24gPSB7XG4gIEJSRUFLOiB7fSxcbiAgZXh0ZW5kOiBmdW5jdGlvbiBleHRlbmQodGFyZ2V0KSB7XG4gICAgdGhpcy5lYWNoKEFSUl9TTElDRS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBrZXlzID0gdGhpcy5pc09iamVjdChvYmopID8gT2JqZWN0LmtleXMob2JqKSA6IFtdO1xuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKCF0aGlzLmlzVW5kZWZpbmVkKG9ialtrZXldKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbiAgZGVmYXVsdHM6IGZ1bmN0aW9uIGRlZmF1bHRzKHRhcmdldCkge1xuICAgIHRoaXMuZWFjaChBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMsIDEpLCBmdW5jdGlvbiAob2JqKSB7XG4gICAgICB2YXIga2V5cyA9IHRoaXMuaXNPYmplY3Qob2JqKSA/IE9iamVjdC5rZXlzKG9iaikgOiBbXTtcbiAgICAgIGtleXMuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgIGlmICh0aGlzLmlzVW5kZWZpbmVkKHRhcmdldFtrZXldKSkge1xuICAgICAgICAgIHRhcmdldFtrZXldID0gb2JqW2tleV07XG4gICAgICAgIH1cbiAgICAgIH0uYmluZCh0aGlzKSk7XG4gICAgfSwgdGhpcyk7XG4gICAgcmV0dXJuIHRhcmdldDtcbiAgfSxcbiAgY29tcG9zZTogZnVuY3Rpb24gY29tcG9zZSgpIHtcbiAgICB2YXIgdG9DYWxsID0gQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzKTtcbiAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGFyZ3MgPSBBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgZm9yICh2YXIgaSA9IHRvQ2FsbC5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgICBhcmdzID0gW3RvQ2FsbFtpXS5hcHBseSh0aGlzLCBhcmdzKV07XG4gICAgICB9XG4gICAgICByZXR1cm4gYXJnc1swXTtcbiAgICB9O1xuICB9LFxuICBlYWNoOiBmdW5jdGlvbiBlYWNoKG9iaiwgaXRyLCBzY29wZSkge1xuICAgIGlmICghb2JqKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuICAgIGlmIChBUlJfRUFDSCAmJiBvYmouZm9yRWFjaCAmJiBvYmouZm9yRWFjaCA9PT0gQVJSX0VBQ0gpIHtcbiAgICAgIG9iai5mb3JFYWNoKGl0ciwgc2NvcGUpO1xuICAgIH0gZWxzZSBpZiAob2JqLmxlbmd0aCA9PT0gb2JqLmxlbmd0aCArIDApIHtcbiAgICAgIHZhciBrZXkgPSB2b2lkIDA7XG4gICAgICB2YXIgbCA9IHZvaWQgMDtcbiAgICAgIGZvciAoa2V5ID0gMCwgbCA9IG9iai5sZW5ndGg7IGtleSA8IGw7IGtleSsrKSB7XG4gICAgICAgIGlmIChrZXkgaW4gb2JqICYmIGl0ci5jYWxsKHNjb3BlLCBvYmpba2V5XSwga2V5KSA9PT0gdGhpcy5CUkVBSykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBmb3IgKHZhciBfa2V5IGluIG9iaikge1xuICAgICAgICBpZiAoaXRyLmNhbGwoc2NvcGUsIG9ialtfa2V5XSwgX2tleSkgPT09IHRoaXMuQlJFQUspIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGRlZmVyOiBmdW5jdGlvbiBkZWZlcihmbmMpIHtcbiAgICBzZXRUaW1lb3V0KGZuYywgMCk7XG4gIH0sXG4gIGRlYm91bmNlOiBmdW5jdGlvbiBkZWJvdW5jZShmdW5jLCB0aHJlc2hvbGQsIGNhbGxJbW1lZGlhdGVseSkge1xuICAgIHZhciB0aW1lb3V0ID0gdm9pZCAwO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgb2JqID0gdGhpcztcbiAgICAgIHZhciBhcmdzID0gYXJndW1lbnRzO1xuICAgICAgZnVuY3Rpb24gZGVsYXllZCgpIHtcbiAgICAgICAgdGltZW91dCA9IG51bGw7XG4gICAgICAgIGlmICghY2FsbEltbWVkaWF0ZWx5KSBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB9XG4gICAgICB2YXIgY2FsbE5vdyA9IGNhbGxJbW1lZGlhdGVseSB8fCAhdGltZW91dDtcbiAgICAgIGNsZWFyVGltZW91dCh0aW1lb3V0KTtcbiAgICAgIHRpbWVvdXQgPSBzZXRUaW1lb3V0KGRlbGF5ZWQsIHRocmVzaG9sZCk7XG4gICAgICBpZiAoY2FsbE5vdykge1xuICAgICAgICBmdW5jLmFwcGx5KG9iaiwgYXJncyk7XG4gICAgICB9XG4gICAgfTtcbiAgfSxcbiAgdG9BcnJheTogZnVuY3Rpb24gdG9BcnJheShvYmopIHtcbiAgICBpZiAob2JqLnRvQXJyYXkpIHJldHVybiBvYmoudG9BcnJheSgpO1xuICAgIHJldHVybiBBUlJfU0xJQ0UuY2FsbChvYmopO1xuICB9LFxuICBpc1VuZGVmaW5lZDogZnVuY3Rpb24gaXNVbmRlZmluZWQob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gdW5kZWZpbmVkO1xuICB9LFxuICBpc051bGw6IGZ1bmN0aW9uIGlzTnVsbChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBudWxsO1xuICB9LFxuICBpc05hTjogZnVuY3Rpb24gKF9pc05hTikge1xuICAgIGZ1bmN0aW9uIGlzTmFOKF94KSB7XG4gICAgICByZXR1cm4gX2lzTmFOLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgfVxuICAgIGlzTmFOLnRvU3RyaW5nID0gZnVuY3Rpb24gKCkge1xuICAgICAgcmV0dXJuIF9pc05hTi50b1N0cmluZygpO1xuICAgIH07XG4gICAgcmV0dXJuIGlzTmFOO1xuICB9KGZ1bmN0aW9uIChvYmopIHtcbiAgICByZXR1cm4gaXNOYU4ob2JqKTtcbiAgfSksXG4gIGlzQXJyYXk6IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBvYmouY29uc3RydWN0b3IgPT09IEFycmF5O1xuICB9LFxuICBpc09iamVjdDogZnVuY3Rpb24gaXNPYmplY3Qob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gT2JqZWN0KG9iaik7XG4gIH0sXG4gIGlzTnVtYmVyOiBmdW5jdGlvbiBpc051bWJlcihvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBvYmogKyAwO1xuICB9LFxuICBpc1N0cmluZzogZnVuY3Rpb24gaXNTdHJpbmcob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gb2JqICsgJyc7XG4gIH0sXG4gIGlzQm9vbGVhbjogZnVuY3Rpb24gaXNCb29sZWFuKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IGZhbHNlIHx8IG9iaiA9PT0gdHJ1ZTtcbiAgfSxcbiAgaXNGdW5jdGlvbjogZnVuY3Rpb24gaXNGdW5jdGlvbihvYmopIHtcbiAgICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG9iaikgPT09ICdbb2JqZWN0IEZ1bmN0aW9uXSc7XG4gIH1cbn07XG5cbnZhciBJTlRFUlBSRVRBVElPTlMgPSBbXG57XG4gIGxpdG11czogQ29tbW9uLmlzU3RyaW5nLFxuICBjb252ZXJzaW9uczoge1xuICAgIFRIUkVFX0NIQVJfSEVYOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL14jKFtBLUYwLTldKShbQS1GMC05XSkoW0EtRjAtOV0pJC9pKTtcbiAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogJ0hFWCcsXG4gICAgICAgICAgaGV4OiBwYXJzZUludCgnMHgnICsgdGVzdFsxXS50b1N0cmluZygpICsgdGVzdFsxXS50b1N0cmluZygpICsgdGVzdFsyXS50b1N0cmluZygpICsgdGVzdFsyXS50b1N0cmluZygpICsgdGVzdFszXS50b1N0cmluZygpICsgdGVzdFszXS50b1N0cmluZygpLCAwKVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBjb2xvclRvU3RyaW5nXG4gICAgfSxcbiAgICBTSVhfQ0hBUl9IRVg6IHtcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQob3JpZ2luYWwpIHtcbiAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXiMoW0EtRjAtOV17Nn0pJC9pKTtcbiAgICAgICAgaWYgKHRlc3QgPT09IG51bGwpIHtcbiAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogJ0hFWCcsXG4gICAgICAgICAgaGV4OiBwYXJzZUludCgnMHgnICsgdGVzdFsxXS50b1N0cmluZygpLCAwKVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBjb2xvclRvU3RyaW5nXG4gICAgfSxcbiAgICBDU1NfUkdCOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL15yZ2JcXChcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKlxcKS8pO1xuICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICByOiBwYXJzZUZsb2F0KHRlc3RbMV0pLFxuICAgICAgICAgIGc6IHBhcnNlRmxvYXQodGVzdFsyXSksXG4gICAgICAgICAgYjogcGFyc2VGbG9hdCh0ZXN0WzNdKVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBjb2xvclRvU3RyaW5nXG4gICAgfSxcbiAgICBDU1NfUkdCQToge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICB2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKC9ecmdiYVxcKFxccyooLispXFxzKixcXHMqKC4rKVxccyosXFxzKiguKylcXHMqLFxccyooLispXFxzKlxcKS8pO1xuICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICByOiBwYXJzZUZsb2F0KHRlc3RbMV0pLFxuICAgICAgICAgIGc6IHBhcnNlRmxvYXQodGVzdFsyXSksXG4gICAgICAgICAgYjogcGFyc2VGbG9hdCh0ZXN0WzNdKSxcbiAgICAgICAgICBhOiBwYXJzZUZsb2F0KHRlc3RbNF0pXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGNvbG9yVG9TdHJpbmdcbiAgICB9XG4gIH1cbn0sXG57XG4gIGxpdG11czogQ29tbW9uLmlzTnVtYmVyLFxuICBjb252ZXJzaW9uczoge1xuICAgIEhFWDoge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICBoZXg6IG9yaWdpbmFsLFxuICAgICAgICAgIGNvbnZlcnNpb25OYW1lOiAnSEVYJ1xuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShjb2xvcikge1xuICAgICAgICByZXR1cm4gY29sb3IuaGV4O1xuICAgICAgfVxuICAgIH1cbiAgfVxufSxcbntcbiAgbGl0bXVzOiBDb21tb24uaXNBcnJheSxcbiAgY29udmVyc2lvbnM6IHtcbiAgICBSR0JfQVJSQVk6IHtcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQob3JpZ2luYWwpIHtcbiAgICAgICAgaWYgKG9yaWdpbmFsLmxlbmd0aCAhPT0gMykge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICByOiBvcmlnaW5hbFswXSxcbiAgICAgICAgICBnOiBvcmlnaW5hbFsxXSxcbiAgICAgICAgICBiOiBvcmlnaW5hbFsyXVxuICAgICAgICB9O1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShjb2xvcikge1xuICAgICAgICByZXR1cm4gW2NvbG9yLnIsIGNvbG9yLmcsIGNvbG9yLmJdO1xuICAgICAgfVxuICAgIH0sXG4gICAgUkdCQV9BUlJBWToge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoICE9PSA0KSByZXR1cm4gZmFsc2U7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgIHI6IG9yaWdpbmFsWzBdLFxuICAgICAgICAgIGc6IG9yaWdpbmFsWzFdLFxuICAgICAgICAgIGI6IG9yaWdpbmFsWzJdLFxuICAgICAgICAgIGE6IG9yaWdpbmFsWzNdXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYiwgY29sb3IuYV07XG4gICAgICB9XG4gICAgfVxuICB9XG59LFxue1xuICBsaXRtdXM6IENvbW1vbi5pc09iamVjdCxcbiAgY29udmVyc2lvbnM6IHtcbiAgICBSR0JBX09CSjoge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICBpZiAoQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnIpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5nKSAmJiBDb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYikgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmEpKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgIHI6IG9yaWdpbmFsLnIsXG4gICAgICAgICAgICBnOiBvcmlnaW5hbC5nLFxuICAgICAgICAgICAgYjogb3JpZ2luYWwuYixcbiAgICAgICAgICAgIGE6IG9yaWdpbmFsLmFcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByOiBjb2xvci5yLFxuICAgICAgICAgIGc6IGNvbG9yLmcsXG4gICAgICAgICAgYjogY29sb3IuYixcbiAgICAgICAgICBhOiBjb2xvci5hXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBSR0JfT0JKOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIGlmIChDb21tb24uaXNOdW1iZXIob3JpZ2luYWwucikgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmcpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5iKSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgICByOiBvcmlnaW5hbC5yLFxuICAgICAgICAgICAgZzogb3JpZ2luYWwuZyxcbiAgICAgICAgICAgIGI6IG9yaWdpbmFsLmJcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICByOiBjb2xvci5yLFxuICAgICAgICAgIGc6IGNvbG9yLmcsXG4gICAgICAgICAgYjogY29sb3IuYlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgSFNWQV9PQko6IHtcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQob3JpZ2luYWwpIHtcbiAgICAgICAgaWYgKENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5oKSAmJiBDb21tb24uaXNOdW1iZXIob3JpZ2luYWwucykgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnYpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5hKSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzcGFjZTogJ0hTVicsXG4gICAgICAgICAgICBoOiBvcmlnaW5hbC5oLFxuICAgICAgICAgICAgczogb3JpZ2luYWwucyxcbiAgICAgICAgICAgIHY6IG9yaWdpbmFsLnYsXG4gICAgICAgICAgICBhOiBvcmlnaW5hbC5hXG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaDogY29sb3IuaCxcbiAgICAgICAgICBzOiBjb2xvci5zLFxuICAgICAgICAgIHY6IGNvbG9yLnYsXG4gICAgICAgICAgYTogY29sb3IuYVxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH0sXG4gICAgSFNWX09CSjoge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICBpZiAoQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmgpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5zKSAmJiBDb21tb24uaXNOdW1iZXIob3JpZ2luYWwudikpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3BhY2U6ICdIU1YnLFxuICAgICAgICAgICAgaDogb3JpZ2luYWwuaCxcbiAgICAgICAgICAgIHM6IG9yaWdpbmFsLnMsXG4gICAgICAgICAgICB2OiBvcmlnaW5hbC52XG4gICAgICAgICAgfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgaDogY29sb3IuaCxcbiAgICAgICAgICBzOiBjb2xvci5zLFxuICAgICAgICAgIHY6IGNvbG9yLnZcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1dO1xudmFyIHJlc3VsdCA9IHZvaWQgMDtcbnZhciB0b1JldHVybiA9IHZvaWQgMDtcbnZhciBpbnRlcnByZXQgPSBmdW5jdGlvbiBpbnRlcnByZXQoKSB7XG4gIHRvUmV0dXJuID0gZmFsc2U7XG4gIHZhciBvcmlnaW5hbCA9IGFyZ3VtZW50cy5sZW5ndGggPiAxID8gQ29tbW9uLnRvQXJyYXkoYXJndW1lbnRzKSA6IGFyZ3VtZW50c1swXTtcbiAgQ29tbW9uLmVhY2goSU5URVJQUkVUQVRJT05TLCBmdW5jdGlvbiAoZmFtaWx5KSB7XG4gICAgaWYgKGZhbWlseS5saXRtdXMob3JpZ2luYWwpKSB7XG4gICAgICBDb21tb24uZWFjaChmYW1pbHkuY29udmVyc2lvbnMsIGZ1bmN0aW9uIChjb252ZXJzaW9uLCBjb252ZXJzaW9uTmFtZSkge1xuICAgICAgICByZXN1bHQgPSBjb252ZXJzaW9uLnJlYWQob3JpZ2luYWwpO1xuICAgICAgICBpZiAodG9SZXR1cm4gPT09IGZhbHNlICYmIHJlc3VsdCAhPT0gZmFsc2UpIHtcbiAgICAgICAgICB0b1JldHVybiA9IHJlc3VsdDtcbiAgICAgICAgICByZXN1bHQuY29udmVyc2lvbk5hbWUgPSBjb252ZXJzaW9uTmFtZTtcbiAgICAgICAgICByZXN1bHQuY29udmVyc2lvbiA9IGNvbnZlcnNpb247XG4gICAgICAgICAgcmV0dXJuIENvbW1vbi5CUkVBSztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICByZXR1cm4gQ29tbW9uLkJSRUFLO1xuICAgIH1cbiAgfSk7XG4gIHJldHVybiB0b1JldHVybjtcbn07XG5cbnZhciB0bXBDb21wb25lbnQgPSB2b2lkIDA7XG52YXIgQ29sb3JNYXRoID0ge1xuICBoc3ZfdG9fcmdiOiBmdW5jdGlvbiBoc3ZfdG9fcmdiKGgsIHMsIHYpIHtcbiAgICB2YXIgaGkgPSBNYXRoLmZsb29yKGggLyA2MCkgJSA2O1xuICAgIHZhciBmID0gaCAvIDYwIC0gTWF0aC5mbG9vcihoIC8gNjApO1xuICAgIHZhciBwID0gdiAqICgxLjAgLSBzKTtcbiAgICB2YXIgcSA9IHYgKiAoMS4wIC0gZiAqIHMpO1xuICAgIHZhciB0ID0gdiAqICgxLjAgLSAoMS4wIC0gZikgKiBzKTtcbiAgICB2YXIgYyA9IFtbdiwgdCwgcF0sIFtxLCB2LCBwXSwgW3AsIHYsIHRdLCBbcCwgcSwgdl0sIFt0LCBwLCB2XSwgW3YsIHAsIHFdXVtoaV07XG4gICAgcmV0dXJuIHtcbiAgICAgIHI6IGNbMF0gKiAyNTUsXG4gICAgICBnOiBjWzFdICogMjU1LFxuICAgICAgYjogY1syXSAqIDI1NVxuICAgIH07XG4gIH0sXG4gIHJnYl90b19oc3Y6IGZ1bmN0aW9uIHJnYl90b19oc3YociwgZywgYikge1xuICAgIHZhciBtaW4gPSBNYXRoLm1pbihyLCBnLCBiKTtcbiAgICB2YXIgbWF4ID0gTWF0aC5tYXgociwgZywgYik7XG4gICAgdmFyIGRlbHRhID0gbWF4IC0gbWluO1xuICAgIHZhciBoID0gdm9pZCAwO1xuICAgIHZhciBzID0gdm9pZCAwO1xuICAgIGlmIChtYXggIT09IDApIHtcbiAgICAgIHMgPSBkZWx0YSAvIG1heDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgaDogTmFOLFxuICAgICAgICBzOiAwLFxuICAgICAgICB2OiAwXG4gICAgICB9O1xuICAgIH1cbiAgICBpZiAociA9PT0gbWF4KSB7XG4gICAgICBoID0gKGcgLSBiKSAvIGRlbHRhO1xuICAgIH0gZWxzZSBpZiAoZyA9PT0gbWF4KSB7XG4gICAgICBoID0gMiArIChiIC0gcikgLyBkZWx0YTtcbiAgICB9IGVsc2Uge1xuICAgICAgaCA9IDQgKyAociAtIGcpIC8gZGVsdGE7XG4gICAgfVxuICAgIGggLz0gNjtcbiAgICBpZiAoaCA8IDApIHtcbiAgICAgIGggKz0gMTtcbiAgICB9XG4gICAgcmV0dXJuIHtcbiAgICAgIGg6IGggKiAzNjAsXG4gICAgICBzOiBzLFxuICAgICAgdjogbWF4IC8gMjU1XG4gICAgfTtcbiAgfSxcbiAgcmdiX3RvX2hleDogZnVuY3Rpb24gcmdiX3RvX2hleChyLCBnLCBiKSB7XG4gICAgdmFyIGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KDAsIDIsIHIpO1xuICAgIGhleCA9IHRoaXMuaGV4X3dpdGhfY29tcG9uZW50KGhleCwgMSwgZyk7XG4gICAgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoaGV4LCAwLCBiKTtcbiAgICByZXR1cm4gaGV4O1xuICB9LFxuICBjb21wb25lbnRfZnJvbV9oZXg6IGZ1bmN0aW9uIGNvbXBvbmVudF9mcm9tX2hleChoZXgsIGNvbXBvbmVudEluZGV4KSB7XG4gICAgcmV0dXJuIGhleCA+PiBjb21wb25lbnRJbmRleCAqIDggJiAweEZGO1xuICB9LFxuICBoZXhfd2l0aF9jb21wb25lbnQ6IGZ1bmN0aW9uIGhleF93aXRoX2NvbXBvbmVudChoZXgsIGNvbXBvbmVudEluZGV4LCB2YWx1ZSkge1xuICAgIHJldHVybiB2YWx1ZSA8PCAodG1wQ29tcG9uZW50ID0gY29tcG9uZW50SW5kZXggKiA4KSB8IGhleCAmIH4oMHhGRiA8PCB0bXBDb21wb25lbnQpO1xuICB9XG59O1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBTeW1ib2wgPT09IFwiZnVuY3Rpb25cIiAmJiB0eXBlb2YgU3ltYm9sLml0ZXJhdG9yID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iajtcbn0gOiBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiBvYmogJiYgdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gU3ltYm9sICYmIG9iaiAhPT0gU3ltYm9sLnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgY2xhc3NDYWxsQ2hlY2sgPSBmdW5jdGlvbiAoaW5zdGFuY2UsIENvbnN0cnVjdG9yKSB7XG4gIGlmICghKGluc3RhbmNlIGluc3RhbmNlb2YgQ29uc3RydWN0b3IpKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKTtcbiAgfVxufTtcblxudmFyIGNyZWF0ZUNsYXNzID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpO1xuXG5cblxuXG5cblxuXG52YXIgZ2V0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGRlc2MgPSBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcGFyZW50ID0gT2JqZWN0LmdldFByb3RvdHlwZU9mKG9iamVjdCk7XG5cbiAgICBpZiAocGFyZW50ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZ2V0KHBhcmVudCwgcHJvcGVydHksIHJlY2VpdmVyKTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoXCJ2YWx1ZVwiIGluIGRlc2MpIHtcbiAgICByZXR1cm4gZGVzYy52YWx1ZTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZ2V0dGVyID0gZGVzYy5nZXQ7XG5cbiAgICBpZiAoZ2V0dGVyID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIGdldHRlci5jYWxsKHJlY2VpdmVyKTtcbiAgfVxufTtcblxudmFyIGluaGVyaXRzID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArIHR5cGVvZiBzdXBlckNsYXNzKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9IE9iamVjdC5jcmVhdGUoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIE9iamVjdC5zZXRQcm90b3R5cGVPZiA/IE9iamVjdC5zZXRQcm90b3R5cGVPZihzdWJDbGFzcywgc3VwZXJDbGFzcykgOiBzdWJDbGFzcy5fX3Byb3RvX18gPSBzdXBlckNsYXNzO1xufTtcblxuXG5cblxuXG5cblxuXG5cblxuXG52YXIgcG9zc2libGVDb25zdHJ1Y3RvclJldHVybiA9IGZ1bmN0aW9uIChzZWxmLCBjYWxsKSB7XG4gIGlmICghc2VsZikge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBjYWxsICYmICh0eXBlb2YgY2FsbCA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmO1xufTtcblxudmFyIENvbG9yID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb2xvcigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDb2xvcik7XG4gICAgdGhpcy5fX3N0YXRlID0gaW50ZXJwcmV0LmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKHRoaXMuX19zdGF0ZSA9PT0gZmFsc2UpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRmFpbGVkIHRvIGludGVycHJldCBjb2xvciBhcmd1bWVudHMnKTtcbiAgICB9XG4gICAgdGhpcy5fX3N0YXRlLmEgPSB0aGlzLl9fc3RhdGUuYSB8fCAxO1xuICB9XG4gIGNyZWF0ZUNsYXNzKENvbG9yLCBbe1xuICAgIGtleTogJ3RvU3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG4gICAgICByZXR1cm4gY29sb3JUb1N0cmluZyh0aGlzKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd0b0hleFN0cmluZycsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvSGV4U3RyaW5nKCkge1xuICAgICAgcmV0dXJuIGNvbG9yVG9TdHJpbmcodGhpcywgdHJ1ZSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndG9PcmlnaW5hbCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHRvT3JpZ2luYWwoKSB7XG4gICAgICByZXR1cm4gdGhpcy5fX3N0YXRlLmNvbnZlcnNpb24ud3JpdGUodGhpcyk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBDb2xvcjtcbn0oKTtcbmZ1bmN0aW9uIGRlZmluZVJHQkNvbXBvbmVudCh0YXJnZXQsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXgpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29tcG9uZW50LCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICBpZiAodGhpcy5fX3N0YXRlLnNwYWNlID09PSAnUkdCJykge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG4gICAgICB9XG4gICAgICBDb2xvci5yZWNhbGN1bGF0ZVJHQih0aGlzLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KTtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKHYpIHtcbiAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdSR0InKSB7XG4gICAgICAgIENvbG9yLnJlY2FsY3VsYXRlUkdCKHRoaXMsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXgpO1xuICAgICAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnUkdCJztcbiAgICAgIH1cbiAgICAgIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdID0gdjtcbiAgICB9XG4gIH0pO1xufVxuZnVuY3Rpb24gZGVmaW5lSFNWQ29tcG9uZW50KHRhcmdldCwgY29tcG9uZW50KSB7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0YXJnZXQsIGNvbXBvbmVudCwge1xuICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSA9PT0gJ0hTVicpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdO1xuICAgICAgfVxuICAgICAgQ29sb3IucmVjYWxjdWxhdGVIU1YodGhpcyk7XG4gICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG4gICAgfSxcbiAgICBzZXQ6IGZ1bmN0aW9uIHNldCQkMSh2KSB7XG4gICAgICBpZiAodGhpcy5fX3N0YXRlLnNwYWNlICE9PSAnSFNWJykge1xuICAgICAgICBDb2xvci5yZWNhbGN1bGF0ZUhTVih0aGlzKTtcbiAgICAgICAgdGhpcy5fX3N0YXRlLnNwYWNlID0gJ0hTVic7XG4gICAgICB9XG4gICAgICB0aGlzLl9fc3RhdGVbY29tcG9uZW50XSA9IHY7XG4gICAgfVxuICB9KTtcbn1cbkNvbG9yLnJlY2FsY3VsYXRlUkdCID0gZnVuY3Rpb24gKGNvbG9yLCBjb21wb25lbnQsIGNvbXBvbmVudEhleEluZGV4KSB7XG4gIGlmIChjb2xvci5fX3N0YXRlLnNwYWNlID09PSAnSEVYJykge1xuICAgIGNvbG9yLl9fc3RhdGVbY29tcG9uZW50XSA9IENvbG9yTWF0aC5jb21wb25lbnRfZnJvbV9oZXgoY29sb3IuX19zdGF0ZS5oZXgsIGNvbXBvbmVudEhleEluZGV4KTtcbiAgfSBlbHNlIGlmIChjb2xvci5fX3N0YXRlLnNwYWNlID09PSAnSFNWJykge1xuICAgIENvbW1vbi5leHRlbmQoY29sb3IuX19zdGF0ZSwgQ29sb3JNYXRoLmhzdl90b19yZ2IoY29sb3IuX19zdGF0ZS5oLCBjb2xvci5fX3N0YXRlLnMsIGNvbG9yLl9fc3RhdGUudikpO1xuICB9IGVsc2Uge1xuICAgIHRocm93IG5ldyBFcnJvcignQ29ycnVwdGVkIGNvbG9yIHN0YXRlJyk7XG4gIH1cbn07XG5Db2xvci5yZWNhbGN1bGF0ZUhTViA9IGZ1bmN0aW9uIChjb2xvcikge1xuICB2YXIgcmVzdWx0ID0gQ29sb3JNYXRoLnJnYl90b19oc3YoY29sb3IuciwgY29sb3IuZywgY29sb3IuYik7XG4gIENvbW1vbi5leHRlbmQoY29sb3IuX19zdGF0ZSwge1xuICAgIHM6IHJlc3VsdC5zLFxuICAgIHY6IHJlc3VsdC52XG4gIH0pO1xuICBpZiAoIUNvbW1vbi5pc05hTihyZXN1bHQuaCkpIHtcbiAgICBjb2xvci5fX3N0YXRlLmggPSByZXN1bHQuaDtcbiAgfSBlbHNlIGlmIChDb21tb24uaXNVbmRlZmluZWQoY29sb3IuX19zdGF0ZS5oKSkge1xuICAgIGNvbG9yLl9fc3RhdGUuaCA9IDA7XG4gIH1cbn07XG5Db2xvci5DT01QT05FTlRTID0gWydyJywgJ2cnLCAnYicsICdoJywgJ3MnLCAndicsICdoZXgnLCAnYSddO1xuZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ3InLCAyKTtcbmRlZmluZVJHQkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdnJywgMSk7XG5kZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnYicsIDApO1xuZGVmaW5lSFNWQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ2gnKTtcbmRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdzJyk7XG5kZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAndicpO1xuT2JqZWN0LmRlZmluZVByb3BlcnR5KENvbG9yLnByb3RvdHlwZSwgJ2EnLCB7XG4gIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgIHJldHVybiB0aGlzLl9fc3RhdGUuYTtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgIHRoaXMuX19zdGF0ZS5hID0gdjtcbiAgfVxufSk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQ29sb3IucHJvdG90eXBlLCAnaGV4Jywge1xuICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICBpZiAoIXRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ0hFWCcpIHtcbiAgICAgIHRoaXMuX19zdGF0ZS5oZXggPSBDb2xvck1hdGgucmdiX3RvX2hleCh0aGlzLnIsIHRoaXMuZywgdGhpcy5iKTtcbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5oZXg7XG4gIH0sXG4gIHNldDogZnVuY3Rpb24gc2V0JCQxKHYpIHtcbiAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnSEVYJztcbiAgICB0aGlzLl9fc3RhdGUuaGV4ID0gdjtcbiAgfVxufSk7XG5cbnZhciBDb250cm9sbGVyID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDb250cm9sbGVyKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDb250cm9sbGVyKTtcbiAgICB0aGlzLmluaXRpYWxWYWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5vYmplY3QgPSBvYmplY3Q7XG4gICAgdGhpcy5wcm9wZXJ0eSA9IHByb3BlcnR5O1xuICAgIHRoaXMuX19vbkNoYW5nZSA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9fb25GaW5pc2hDaGFuZ2UgPSB1bmRlZmluZWQ7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoQ29udHJvbGxlciwgW3tcbiAgICBrZXk6ICdvbkNoYW5nZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uQ2hhbmdlKGZuYykge1xuICAgICAgdGhpcy5fX29uQ2hhbmdlID0gZm5jO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnb25GaW5pc2hDaGFuZ2UnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBvbkZpbmlzaENoYW5nZShmbmMpIHtcbiAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZSA9IGZuYztcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3NldFZhbHVlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUobmV3VmFsdWUpIHtcbiAgICAgIHRoaXMub2JqZWN0W3RoaXMucHJvcGVydHldID0gbmV3VmFsdWU7XG4gICAgICBpZiAodGhpcy5fX29uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX19vbkNoYW5nZS5jYWxsKHRoaXMsIG5ld1ZhbHVlKTtcbiAgICAgIH1cbiAgICAgIHRoaXMudXBkYXRlRGlzcGxheSgpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnZ2V0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBnZXRWYWx1ZSgpIHtcbiAgICAgIHJldHVybiB0aGlzLm9iamVjdFt0aGlzLnByb3BlcnR5XTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGVEaXNwbGF5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2lzTW9kaWZpZWQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBpc01vZGlmaWVkKCkge1xuICAgICAgcmV0dXJuIHRoaXMuaW5pdGlhbFZhbHVlICE9PSB0aGlzLmdldFZhbHVlKCk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBDb250cm9sbGVyO1xufSgpO1xuXG52YXIgRVZFTlRfTUFQID0ge1xuICBIVE1MRXZlbnRzOiBbJ2NoYW5nZSddLFxuICBNb3VzZUV2ZW50czogWydjbGljaycsICdtb3VzZW1vdmUnLCAnbW91c2Vkb3duJywgJ21vdXNldXAnLCAnbW91c2VvdmVyJ10sXG4gIEtleWJvYXJkRXZlbnRzOiBbJ2tleWRvd24nXVxufTtcbnZhciBFVkVOVF9NQVBfSU5WID0ge307XG5Db21tb24uZWFjaChFVkVOVF9NQVAsIGZ1bmN0aW9uICh2LCBrKSB7XG4gIENvbW1vbi5lYWNoKHYsIGZ1bmN0aW9uIChlKSB7XG4gICAgRVZFTlRfTUFQX0lOVltlXSA9IGs7XG4gIH0pO1xufSk7XG52YXIgQ1NTX1ZBTFVFX1BJWEVMUyA9IC8oXFxkKyhcXC5cXGQrKT8pcHgvO1xuZnVuY3Rpb24gY3NzVmFsdWVUb1BpeGVscyh2YWwpIHtcbiAgaWYgKHZhbCA9PT0gJzAnIHx8IENvbW1vbi5pc1VuZGVmaW5lZCh2YWwpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cbiAgdmFyIG1hdGNoID0gdmFsLm1hdGNoKENTU19WQUxVRV9QSVhFTFMpO1xuICBpZiAoIUNvbW1vbi5pc051bGwobWF0Y2gpKSB7XG4gICAgcmV0dXJuIHBhcnNlRmxvYXQobWF0Y2hbMV0pO1xuICB9XG4gIHJldHVybiAwO1xufVxudmFyIGRvbSA9IHtcbiAgbWFrZVNlbGVjdGFibGU6IGZ1bmN0aW9uIG1ha2VTZWxlY3RhYmxlKGVsZW0sIHNlbGVjdGFibGUpIHtcbiAgICBpZiAoZWxlbSA9PT0gdW5kZWZpbmVkIHx8IGVsZW0uc3R5bGUgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuICAgIGVsZW0ub25zZWxlY3RzdGFydCA9IHNlbGVjdGFibGUgPyBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSA6IGZ1bmN0aW9uICgpIHt9O1xuICAgIGVsZW0uc3R5bGUuTW96VXNlclNlbGVjdCA9IHNlbGVjdGFibGUgPyAnYXV0bycgOiAnbm9uZSc7XG4gICAgZWxlbS5zdHlsZS5LaHRtbFVzZXJTZWxlY3QgPSBzZWxlY3RhYmxlID8gJ2F1dG8nIDogJ25vbmUnO1xuICAgIGVsZW0udW5zZWxlY3RhYmxlID0gc2VsZWN0YWJsZSA/ICdvbicgOiAnb2ZmJztcbiAgfSxcbiAgbWFrZUZ1bGxzY3JlZW46IGZ1bmN0aW9uIG1ha2VGdWxsc2NyZWVuKGVsZW0sIGhvciwgdmVydCkge1xuICAgIHZhciB2ZXJ0aWNhbCA9IHZlcnQ7XG4gICAgdmFyIGhvcml6b250YWwgPSBob3I7XG4gICAgaWYgKENvbW1vbi5pc1VuZGVmaW5lZChob3Jpem9udGFsKSkge1xuICAgICAgaG9yaXpvbnRhbCA9IHRydWU7XG4gICAgfVxuICAgIGlmIChDb21tb24uaXNVbmRlZmluZWQodmVydGljYWwpKSB7XG4gICAgICB2ZXJ0aWNhbCA9IHRydWU7XG4gICAgfVxuICAgIGVsZW0uc3R5bGUucG9zaXRpb24gPSAnYWJzb2x1dGUnO1xuICAgIGlmIChob3Jpem9udGFsKSB7XG4gICAgICBlbGVtLnN0eWxlLmxlZnQgPSAwO1xuICAgICAgZWxlbS5zdHlsZS5yaWdodCA9IDA7XG4gICAgfVxuICAgIGlmICh2ZXJ0aWNhbCkge1xuICAgICAgZWxlbS5zdHlsZS50b3AgPSAwO1xuICAgICAgZWxlbS5zdHlsZS5ib3R0b20gPSAwO1xuICAgIH1cbiAgfSxcbiAgZmFrZUV2ZW50OiBmdW5jdGlvbiBmYWtlRXZlbnQoZWxlbSwgZXZlbnRUeXBlLCBwYXJzLCBhdXgpIHtcbiAgICB2YXIgcGFyYW1zID0gcGFycyB8fCB7fTtcbiAgICB2YXIgY2xhc3NOYW1lID0gRVZFTlRfTUFQX0lOVltldmVudFR5cGVdO1xuICAgIGlmICghY2xhc3NOYW1lKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0V2ZW50IHR5cGUgJyArIGV2ZW50VHlwZSArICcgbm90IHN1cHBvcnRlZC4nKTtcbiAgICB9XG4gICAgdmFyIGV2dCA9IGRvY3VtZW50LmNyZWF0ZUV2ZW50KGNsYXNzTmFtZSk7XG4gICAgc3dpdGNoIChjbGFzc05hbWUpIHtcbiAgICAgIGNhc2UgJ01vdXNlRXZlbnRzJzpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBjbGllbnRYID0gcGFyYW1zLnggfHwgcGFyYW1zLmNsaWVudFggfHwgMDtcbiAgICAgICAgICB2YXIgY2xpZW50WSA9IHBhcmFtcy55IHx8IHBhcmFtcy5jbGllbnRZIHx8IDA7XG4gICAgICAgICAgZXZ0LmluaXRNb3VzZUV2ZW50KGV2ZW50VHlwZSwgcGFyYW1zLmJ1YmJsZXMgfHwgZmFsc2UsIHBhcmFtcy5jYW5jZWxhYmxlIHx8IHRydWUsIHdpbmRvdywgcGFyYW1zLmNsaWNrQ291bnQgfHwgMSwgMCxcbiAgICAgICAgICAwLFxuICAgICAgICAgIGNsaWVudFgsXG4gICAgICAgICAgY2xpZW50WSxcbiAgICAgICAgICBmYWxzZSwgZmFsc2UsIGZhbHNlLCBmYWxzZSwgMCwgbnVsbCk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGNhc2UgJ0tleWJvYXJkRXZlbnRzJzpcbiAgICAgICAge1xuICAgICAgICAgIHZhciBpbml0ID0gZXZ0LmluaXRLZXlib2FyZEV2ZW50IHx8IGV2dC5pbml0S2V5RXZlbnQ7XG4gICAgICAgICAgQ29tbW9uLmRlZmF1bHRzKHBhcmFtcywge1xuICAgICAgICAgICAgY2FuY2VsYWJsZTogdHJ1ZSxcbiAgICAgICAgICAgIGN0cmxLZXk6IGZhbHNlLFxuICAgICAgICAgICAgYWx0S2V5OiBmYWxzZSxcbiAgICAgICAgICAgIHNoaWZ0S2V5OiBmYWxzZSxcbiAgICAgICAgICAgIG1ldGFLZXk6IGZhbHNlLFxuICAgICAgICAgICAga2V5Q29kZTogdW5kZWZpbmVkLFxuICAgICAgICAgICAgY2hhckNvZGU6IHVuZGVmaW5lZFxuICAgICAgICAgIH0pO1xuICAgICAgICAgIGluaXQoZXZlbnRUeXBlLCBwYXJhbXMuYnViYmxlcyB8fCBmYWxzZSwgcGFyYW1zLmNhbmNlbGFibGUsIHdpbmRvdywgcGFyYW1zLmN0cmxLZXksIHBhcmFtcy5hbHRLZXksIHBhcmFtcy5zaGlmdEtleSwgcGFyYW1zLm1ldGFLZXksIHBhcmFtcy5rZXlDb2RlLCBwYXJhbXMuY2hhckNvZGUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICBkZWZhdWx0OlxuICAgICAgICB7XG4gICAgICAgICAgZXZ0LmluaXRFdmVudChldmVudFR5cGUsIHBhcmFtcy5idWJibGVzIHx8IGZhbHNlLCBwYXJhbXMuY2FuY2VsYWJsZSB8fCB0cnVlKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cbiAgICBDb21tb24uZGVmYXVsdHMoZXZ0LCBhdXgpO1xuICAgIGVsZW0uZGlzcGF0Y2hFdmVudChldnQpO1xuICB9LFxuICBiaW5kOiBmdW5jdGlvbiBiaW5kKGVsZW0sIGV2ZW50LCBmdW5jLCBuZXdCb29sKSB7XG4gICAgdmFyIGJvb2wgPSBuZXdCb29sIHx8IGZhbHNlO1xuICAgIGlmIChlbGVtLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuYywgYm9vbCk7XG4gICAgfSBlbHNlIGlmIChlbGVtLmF0dGFjaEV2ZW50KSB7XG4gICAgICBlbGVtLmF0dGFjaEV2ZW50KCdvbicgKyBldmVudCwgZnVuYyk7XG4gICAgfVxuICAgIHJldHVybiBkb207XG4gIH0sXG4gIHVuYmluZDogZnVuY3Rpb24gdW5iaW5kKGVsZW0sIGV2ZW50LCBmdW5jLCBuZXdCb29sKSB7XG4gICAgdmFyIGJvb2wgPSBuZXdCb29sIHx8IGZhbHNlO1xuICAgIGlmIChlbGVtLnJlbW92ZUV2ZW50TGlzdGVuZXIpIHtcbiAgICAgIGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcihldmVudCwgZnVuYywgYm9vbCk7XG4gICAgfSBlbHNlIGlmIChlbGVtLmRldGFjaEV2ZW50KSB7XG4gICAgICBlbGVtLmRldGFjaEV2ZW50KCdvbicgKyBldmVudCwgZnVuYyk7XG4gICAgfVxuICAgIHJldHVybiBkb207XG4gIH0sXG4gIGFkZENsYXNzOiBmdW5jdGlvbiBhZGRDbGFzcyhlbGVtLCBjbGFzc05hbWUpIHtcbiAgICBpZiAoZWxlbS5jbGFzc05hbWUgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZWxlbS5jbGFzc05hbWUgPSBjbGFzc05hbWU7XG4gICAgfSBlbHNlIGlmIChlbGVtLmNsYXNzTmFtZSAhPT0gY2xhc3NOYW1lKSB7XG4gICAgICB2YXIgY2xhc3NlcyA9IGVsZW0uY2xhc3NOYW1lLnNwbGl0KC8gKy8pO1xuICAgICAgaWYgKGNsYXNzZXMuaW5kZXhPZihjbGFzc05hbWUpID09PSAtMSkge1xuICAgICAgICBjbGFzc2VzLnB1c2goY2xhc3NOYW1lKTtcbiAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKS5yZXBsYWNlKC9eXFxzKy8sICcnKS5yZXBsYWNlKC9cXHMrJC8sICcnKTtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIGRvbTtcbiAgfSxcbiAgcmVtb3ZlQ2xhc3M6IGZ1bmN0aW9uIHJlbW92ZUNsYXNzKGVsZW0sIGNsYXNzTmFtZSkge1xuICAgIGlmIChjbGFzc05hbWUpIHtcbiAgICAgIGlmIChlbGVtLmNsYXNzTmFtZSA9PT0gY2xhc3NOYW1lKSB7XG4gICAgICAgIGVsZW0ucmVtb3ZlQXR0cmlidXRlKCdjbGFzcycpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIGNsYXNzZXMgPSBlbGVtLmNsYXNzTmFtZS5zcGxpdCgvICsvKTtcbiAgICAgICAgdmFyIGluZGV4ID0gY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSk7XG4gICAgICAgIGlmIChpbmRleCAhPT0gLTEpIHtcbiAgICAgICAgICBjbGFzc2VzLnNwbGljZShpbmRleCwgMSk7XG4gICAgICAgICAgZWxlbS5jbGFzc05hbWUgPSBjbGFzc2VzLmpvaW4oJyAnKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLmNsYXNzTmFtZSA9IHVuZGVmaW5lZDtcbiAgICB9XG4gICAgcmV0dXJuIGRvbTtcbiAgfSxcbiAgaGFzQ2xhc3M6IGZ1bmN0aW9uIGhhc0NsYXNzKGVsZW0sIGNsYXNzTmFtZSkge1xuICAgIHJldHVybiBuZXcgUmVnRXhwKCcoPzpefFxcXFxzKyknICsgY2xhc3NOYW1lICsgJyg/OlxcXFxzK3wkKScpLnRlc3QoZWxlbS5jbGFzc05hbWUpIHx8IGZhbHNlO1xuICB9LFxuICBnZXRXaWR0aDogZnVuY3Rpb24gZ2V0V2lkdGgoZWxlbSkge1xuICAgIHZhciBzdHlsZSA9IGdldENvbXB1dGVkU3R5bGUoZWxlbSk7XG4gICAgcmV0dXJuIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ2JvcmRlci1sZWZ0LXdpZHRoJ10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLXJpZ2h0LXdpZHRoJ10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsncGFkZGluZy1sZWZ0J10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsncGFkZGluZy1yaWdodCddKSArIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGUud2lkdGgpO1xuICB9LFxuICBnZXRIZWlnaHQ6IGZ1bmN0aW9uIGdldEhlaWdodChlbGVtKSB7XG4gICAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICByZXR1cm4gY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLXRvcC13aWR0aCddKSArIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ2JvcmRlci1ib3R0b20td2lkdGgnXSkgKyBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydwYWRkaW5nLXRvcCddKSArIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ3BhZGRpbmctYm90dG9tJ10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZS5oZWlnaHQpO1xuICB9LFxuICBnZXRPZmZzZXQ6IGZ1bmN0aW9uIGdldE9mZnNldChlbCkge1xuICAgIHZhciBlbGVtID0gZWw7XG4gICAgdmFyIG9mZnNldCA9IHsgbGVmdDogMCwgdG9wOiAwIH07XG4gICAgaWYgKGVsZW0ub2Zmc2V0UGFyZW50KSB7XG4gICAgICBkbyB7XG4gICAgICAgIG9mZnNldC5sZWZ0ICs9IGVsZW0ub2Zmc2V0TGVmdDtcbiAgICAgICAgb2Zmc2V0LnRvcCArPSBlbGVtLm9mZnNldFRvcDtcbiAgICAgICAgZWxlbSA9IGVsZW0ub2Zmc2V0UGFyZW50O1xuICAgICAgfSB3aGlsZSAoZWxlbSk7XG4gICAgfVxuICAgIHJldHVybiBvZmZzZXQ7XG4gIH0sXG4gIGlzQWN0aXZlOiBmdW5jdGlvbiBpc0FjdGl2ZShlbGVtKSB7XG4gICAgcmV0dXJuIGVsZW0gPT09IGRvY3VtZW50LmFjdGl2ZUVsZW1lbnQgJiYgKGVsZW0udHlwZSB8fCBlbGVtLmhyZWYpO1xuICB9XG59O1xuXG52YXIgQm9vbGVhbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoX0NvbnRyb2xsZXIpIHtcbiAgaW5oZXJpdHMoQm9vbGVhbkNvbnRyb2xsZXIsIF9Db250cm9sbGVyKTtcbiAgZnVuY3Rpb24gQm9vbGVhbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEJvb2xlYW5Db250cm9sbGVyKTtcbiAgICB2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoQm9vbGVhbkNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihCb29sZWFuQ29udHJvbGxlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSkpO1xuICAgIHZhciBfdGhpcyA9IF90aGlzMjtcbiAgICBfdGhpczIuX19wcmV2ID0gX3RoaXMyLmdldFZhbHVlKCk7XG4gICAgX3RoaXMyLl9fY2hlY2tib3ggPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIF90aGlzMi5fX2NoZWNrYm94LnNldEF0dHJpYnV0ZSgndHlwZScsICdjaGVja2JveCcpO1xuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuICAgICAgX3RoaXMuc2V0VmFsdWUoIV90aGlzLl9fcHJldik7XG4gICAgfVxuICAgIGRvbS5iaW5kKF90aGlzMi5fX2NoZWNrYm94LCAnY2hhbmdlJywgb25DaGFuZ2UsIGZhbHNlKTtcbiAgICBfdGhpczIuZG9tRWxlbWVudC5hcHBlbmRDaGlsZChfdGhpczIuX19jaGVja2JveCk7XG4gICAgX3RoaXMyLnVwZGF0ZURpc3BsYXkoKTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIGNyZWF0ZUNsYXNzKEJvb2xlYW5Db250cm9sbGVyLCBbe1xuICAgIGtleTogJ3NldFZhbHVlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2V0VmFsdWUodikge1xuICAgICAgdmFyIHRvUmV0dXJuID0gZ2V0KEJvb2xlYW5Db250cm9sbGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEJvb2xlYW5Db250cm9sbGVyLnByb3RvdHlwZSksICdzZXRWYWx1ZScsIHRoaXMpLmNhbGwodGhpcywgdik7XG4gICAgICBpZiAodGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKHRoaXMsIHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgICB0aGlzLl9fcHJldiA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGVEaXNwbGF5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgIGlmICh0aGlzLmdldFZhbHVlKCkgPT09IHRydWUpIHtcbiAgICAgICAgdGhpcy5fX2NoZWNrYm94LnNldEF0dHJpYnV0ZSgnY2hlY2tlZCcsICdjaGVja2VkJyk7XG4gICAgICAgIHRoaXMuX19jaGVja2JveC5jaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5fX3ByZXYgPSB0cnVlO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy5fX2NoZWNrYm94LmNoZWNrZWQgPSBmYWxzZTtcbiAgICAgICAgdGhpcy5fX3ByZXYgPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXQoQm9vbGVhbkNvbnRyb2xsZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQm9vbGVhbkNvbnRyb2xsZXIucHJvdG90eXBlKSwgJ3VwZGF0ZURpc3BsYXknLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gQm9vbGVhbkNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXIpO1xuXG52YXIgT3B0aW9uQ29udHJvbGxlciA9IGZ1bmN0aW9uIChfQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhPcHRpb25Db250cm9sbGVyLCBfQ29udHJvbGxlcik7XG4gIGZ1bmN0aW9uIE9wdGlvbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSwgb3B0cykge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE9wdGlvbkNvbnRyb2xsZXIpO1xuICAgIHZhciBfdGhpczIgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChPcHRpb25Db250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoT3B0aW9uQ29udHJvbGxlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSkpO1xuICAgIHZhciBvcHRpb25zID0gb3B0cztcbiAgICB2YXIgX3RoaXMgPSBfdGhpczI7XG4gICAgX3RoaXMyLl9fc2VsZWN0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc2VsZWN0Jyk7XG4gICAgaWYgKENvbW1vbi5pc0FycmF5KG9wdGlvbnMpKSB7XG4gICAgICB2YXIgbWFwID0ge307XG4gICAgICBDb21tb24uZWFjaChvcHRpb25zLCBmdW5jdGlvbiAoZWxlbWVudCkge1xuICAgICAgICBtYXBbZWxlbWVudF0gPSBlbGVtZW50O1xuICAgICAgfSk7XG4gICAgICBvcHRpb25zID0gbWFwO1xuICAgIH1cbiAgICBDb21tb24uZWFjaChvcHRpb25zLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICAgICAgb3B0LmlubmVySFRNTCA9IGtleTtcbiAgICAgIG9wdC5zZXRBdHRyaWJ1dGUoJ3ZhbHVlJywgdmFsdWUpO1xuICAgICAgX3RoaXMuX19zZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgICB9KTtcbiAgICBfdGhpczIudXBkYXRlRGlzcGxheSgpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX3NlbGVjdCwgJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBkZXNpcmVkVmFsdWUgPSB0aGlzLm9wdGlvbnNbdGhpcy5zZWxlY3RlZEluZGV4XS52YWx1ZTtcbiAgICAgIF90aGlzLnNldFZhbHVlKGRlc2lyZWRWYWx1ZSk7XG4gICAgfSk7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9fc2VsZWN0KTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIGNyZWF0ZUNsYXNzKE9wdGlvbkNvbnRyb2xsZXIsIFt7XG4gICAga2V5OiAnc2V0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2KSB7XG4gICAgICB2YXIgdG9SZXR1cm4gPSBnZXQoT3B0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihPcHRpb25Db250cm9sbGVyLnByb3RvdHlwZSksICdzZXRWYWx1ZScsIHRoaXMpLmNhbGwodGhpcywgdik7XG4gICAgICBpZiAodGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKHRoaXMsIHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgICByZXR1cm4gdG9SZXR1cm47XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAndXBkYXRlRGlzcGxheScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICBpZiAoZG9tLmlzQWN0aXZlKHRoaXMuX19zZWxlY3QpKSByZXR1cm4gdGhpcztcbiAgICAgIHRoaXMuX19zZWxlY3QudmFsdWUgPSB0aGlzLmdldFZhbHVlKCk7XG4gICAgICByZXR1cm4gZ2V0KE9wdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoT3B0aW9uQ29udHJvbGxlci5wcm90b3R5cGUpLCAndXBkYXRlRGlzcGxheScsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBPcHRpb25Db250cm9sbGVyO1xufShDb250cm9sbGVyKTtcblxudmFyIFN0cmluZ0NvbnRyb2xsZXIgPSBmdW5jdGlvbiAoX0NvbnRyb2xsZXIpIHtcbiAgaW5oZXJpdHMoU3RyaW5nQ29udHJvbGxlciwgX0NvbnRyb2xsZXIpO1xuICBmdW5jdGlvbiBTdHJpbmdDb250cm9sbGVyKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBTdHJpbmdDb250cm9sbGVyKTtcbiAgICB2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoU3RyaW5nQ29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFN0cmluZ0NvbnRyb2xsZXIpKS5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpKTtcbiAgICB2YXIgX3RoaXMgPSBfdGhpczI7XG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5fX2lucHV0LnZhbHVlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25CbHVyKCkge1xuICAgICAgaWYgKF90aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgX3RoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3RoaXMyLl9faW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIF90aGlzMi5fX2lucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdrZXl1cCcsIG9uQ2hhbmdlKTtcbiAgICBkb20uYmluZChfdGhpczIuX19pbnB1dCwgJ2NoYW5nZScsIG9uQ2hhbmdlKTtcbiAgICBkb20uYmluZChfdGhpczIuX19pbnB1dCwgJ2JsdXInLCBvbkJsdXIpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2lucHV0LCAna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBpZiAoZS5rZXlDb2RlID09PSAxMykge1xuICAgICAgICB0aGlzLmJsdXIoKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfdGhpczIudXBkYXRlRGlzcGxheSgpO1xuICAgIF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKF90aGlzMi5fX2lucHV0KTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIGNyZWF0ZUNsYXNzKFN0cmluZ0NvbnRyb2xsZXIsIFt7XG4gICAga2V5OiAndXBkYXRlRGlzcGxheScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICBpZiAoIWRvbS5pc0FjdGl2ZSh0aGlzLl9faW5wdXQpKSB7XG4gICAgICAgIHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXQoU3RyaW5nQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihTdHJpbmdDb250cm9sbGVyLnByb3RvdHlwZSksICd1cGRhdGVEaXNwbGF5JywgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIFN0cmluZ0NvbnRyb2xsZXI7XG59KENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBudW1EZWNpbWFscyh4KSB7XG4gIHZhciBfeCA9IHgudG9TdHJpbmcoKTtcbiAgaWYgKF94LmluZGV4T2YoJy4nKSA+IC0xKSB7XG4gICAgcmV0dXJuIF94Lmxlbmd0aCAtIF94LmluZGV4T2YoJy4nKSAtIDE7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG52YXIgTnVtYmVyQ29udHJvbGxlciA9IGZ1bmN0aW9uIChfQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhOdW1iZXJDb250cm9sbGVyLCBfQ29udHJvbGxlcik7XG4gIGZ1bmN0aW9uIE51bWJlckNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSwgcGFyYW1zKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgTnVtYmVyQ29udHJvbGxlcik7XG4gICAgdmFyIF90aGlzID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoTnVtYmVyQ29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKE51bWJlckNvbnRyb2xsZXIpKS5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpKTtcbiAgICB2YXIgX3BhcmFtcyA9IHBhcmFtcyB8fCB7fTtcbiAgICBfdGhpcy5fX21pbiA9IF9wYXJhbXMubWluO1xuICAgIF90aGlzLl9fbWF4ID0gX3BhcmFtcy5tYXg7XG4gICAgX3RoaXMuX19zdGVwID0gX3BhcmFtcy5zdGVwO1xuICAgIGlmIChDb21tb24uaXNVbmRlZmluZWQoX3RoaXMuX19zdGVwKSkge1xuICAgICAgaWYgKF90aGlzLmluaXRpYWxWYWx1ZSA9PT0gMCkge1xuICAgICAgICBfdGhpcy5fX2ltcGxpZWRTdGVwID0gMTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIF90aGlzLl9faW1wbGllZFN0ZXAgPSBNYXRoLnBvdygxMCwgTWF0aC5mbG9vcihNYXRoLmxvZyhNYXRoLmFicyhfdGhpcy5pbml0aWFsVmFsdWUpKSAvIE1hdGguTE4xMCkpIC8gMTA7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIF90aGlzLl9faW1wbGllZFN0ZXAgPSBfdGhpcy5fX3N0ZXA7XG4gICAgfVxuICAgIF90aGlzLl9fcHJlY2lzaW9uID0gbnVtRGVjaW1hbHMoX3RoaXMuX19pbXBsaWVkU3RlcCk7XG4gICAgcmV0dXJuIF90aGlzO1xuICB9XG4gIGNyZWF0ZUNsYXNzKE51bWJlckNvbnRyb2xsZXIsIFt7XG4gICAga2V5OiAnc2V0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2KSB7XG4gICAgICB2YXIgX3YgPSB2O1xuICAgICAgaWYgKHRoaXMuX19taW4gIT09IHVuZGVmaW5lZCAmJiBfdiA8IHRoaXMuX19taW4pIHtcbiAgICAgICAgX3YgPSB0aGlzLl9fbWluO1xuICAgICAgfSBlbHNlIGlmICh0aGlzLl9fbWF4ICE9PSB1bmRlZmluZWQgJiYgX3YgPiB0aGlzLl9fbWF4KSB7XG4gICAgICAgIF92ID0gdGhpcy5fX21heDtcbiAgICAgIH1cbiAgICAgIGlmICh0aGlzLl9fc3RlcCAhPT0gdW5kZWZpbmVkICYmIF92ICUgdGhpcy5fX3N0ZXAgIT09IDApIHtcbiAgICAgICAgX3YgPSBNYXRoLnJvdW5kKF92IC8gdGhpcy5fX3N0ZXApICogdGhpcy5fX3N0ZXA7XG4gICAgICB9XG4gICAgICByZXR1cm4gZ2V0KE51bWJlckNvbnRyb2xsZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTnVtYmVyQ29udHJvbGxlci5wcm90b3R5cGUpLCAnc2V0VmFsdWUnLCB0aGlzKS5jYWxsKHRoaXMsIF92KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdtaW4nLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBtaW4obWluVmFsdWUpIHtcbiAgICAgIHRoaXMuX19taW4gPSBtaW5WYWx1ZTtcbiAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ21heCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1heChtYXhWYWx1ZSkge1xuICAgICAgdGhpcy5fX21heCA9IG1heFZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc3RlcCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHN0ZXAoc3RlcFZhbHVlKSB7XG4gICAgICB0aGlzLl9fc3RlcCA9IHN0ZXBWYWx1ZTtcbiAgICAgIHRoaXMuX19pbXBsaWVkU3RlcCA9IHN0ZXBWYWx1ZTtcbiAgICAgIHRoaXMuX19wcmVjaXNpb24gPSBudW1EZWNpbWFscyhzdGVwVmFsdWUpO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBOdW1iZXJDb250cm9sbGVyO1xufShDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gcm91bmRUb0RlY2ltYWwodmFsdWUsIGRlY2ltYWxzKSB7XG4gIHZhciB0ZW5UbyA9IE1hdGgucG93KDEwLCBkZWNpbWFscyk7XG4gIHJldHVybiBNYXRoLnJvdW5kKHZhbHVlICogdGVuVG8pIC8gdGVuVG87XG59XG52YXIgTnVtYmVyQ29udHJvbGxlckJveCA9IGZ1bmN0aW9uIChfTnVtYmVyQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhOdW1iZXJDb250cm9sbGVyQm94LCBfTnVtYmVyQ29udHJvbGxlcik7XG4gIGZ1bmN0aW9uIE51bWJlckNvbnRyb2xsZXJCb3gob2JqZWN0LCBwcm9wZXJ0eSwgcGFyYW1zKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgTnVtYmVyQ29udHJvbGxlckJveCk7XG4gICAgdmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKE51bWJlckNvbnRyb2xsZXJCb3guX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihOdW1iZXJDb250cm9sbGVyQm94KSkuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpKTtcbiAgICBfdGhpczIuX190cnVuY2F0aW9uU3VzcGVuZGVkID0gZmFsc2U7XG4gICAgdmFyIF90aGlzID0gX3RoaXMyO1xuICAgIHZhciBwcmV2WSA9IHZvaWQgMDtcbiAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgIHZhciBhdHRlbXB0ZWQgPSBwYXJzZUZsb2F0KF90aGlzLl9faW5wdXQudmFsdWUpO1xuICAgICAgaWYgKCFDb21tb24uaXNOYU4oYXR0ZW1wdGVkKSkge1xuICAgICAgICBfdGhpcy5zZXRWYWx1ZShhdHRlbXB0ZWQpO1xuICAgICAgfVxuICAgIH1cbiAgICBmdW5jdGlvbiBvbkZpbmlzaCgpIHtcbiAgICAgIGlmIChfdGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIF90aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbChfdGhpcywgX3RoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uQmx1cigpIHtcbiAgICAgIG9uRmluaXNoKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VEcmFnKGUpIHtcbiAgICAgIHZhciBkaWZmID0gcHJldlkgLSBlLmNsaWVudFk7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5nZXRWYWx1ZSgpICsgZGlmZiAqIF90aGlzLl9faW1wbGllZFN0ZXApO1xuICAgICAgcHJldlkgPSBlLmNsaWVudFk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIG9uRmluaXNoKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VEb3duKGUpIHtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgcHJldlkgPSBlLmNsaWVudFk7XG4gICAgfVxuICAgIF90aGlzMi5fX2lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBfdGhpczIuX19pbnB1dC5zZXRBdHRyaWJ1dGUoJ3R5cGUnLCAndGV4dCcpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2lucHV0LCAnY2hhbmdlJywgb25DaGFuZ2UpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2lucHV0LCAnYmx1cicsIG9uQmx1cik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIF90aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA9IHRydWU7XG4gICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgICBfdGhpcy5fX3RydW5jYXRpb25TdXNwZW5kZWQgPSBmYWxzZTtcbiAgICAgICAgb25GaW5pc2goKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBfdGhpczIudXBkYXRlRGlzcGxheSgpO1xuICAgIF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKF90aGlzMi5fX2lucHV0KTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIGNyZWF0ZUNsYXNzKE51bWJlckNvbnRyb2xsZXJCb3gsIFt7XG4gICAga2V5OiAndXBkYXRlRGlzcGxheScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICB0aGlzLl9faW5wdXQudmFsdWUgPSB0aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA/IHRoaXMuZ2V0VmFsdWUoKSA6IHJvdW5kVG9EZWNpbWFsKHRoaXMuZ2V0VmFsdWUoKSwgdGhpcy5fX3ByZWNpc2lvbik7XG4gICAgICByZXR1cm4gZ2V0KE51bWJlckNvbnRyb2xsZXJCb3gucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTnVtYmVyQ29udHJvbGxlckJveC5wcm90b3R5cGUpLCAndXBkYXRlRGlzcGxheScsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBOdW1iZXJDb250cm9sbGVyQm94O1xufShOdW1iZXJDb250cm9sbGVyKTtcblxuZnVuY3Rpb24gbWFwKHYsIGkxLCBpMiwgbzEsIG8yKSB7XG4gIHJldHVybiBvMSArIChvMiAtIG8xKSAqICgodiAtIGkxKSAvIChpMiAtIGkxKSk7XG59XG52YXIgTnVtYmVyQ29udHJvbGxlclNsaWRlciA9IGZ1bmN0aW9uIChfTnVtYmVyQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhOdW1iZXJDb250cm9sbGVyU2xpZGVyLCBfTnVtYmVyQ29udHJvbGxlcik7XG4gIGZ1bmN0aW9uIE51bWJlckNvbnRyb2xsZXJTbGlkZXIob2JqZWN0LCBwcm9wZXJ0eSwgbWluLCBtYXgsIHN0ZXApIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBOdW1iZXJDb250cm9sbGVyU2xpZGVyKTtcbiAgICB2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoTnVtYmVyQ29udHJvbGxlclNsaWRlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKE51bWJlckNvbnRyb2xsZXJTbGlkZXIpKS5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHksIHsgbWluOiBtaW4sIG1heDogbWF4LCBzdGVwOiBzdGVwIH0pKTtcbiAgICB2YXIgX3RoaXMgPSBfdGhpczI7XG4gICAgX3RoaXMyLl9fYmFja2dyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF90aGlzMi5fX2ZvcmVncm91bmQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb20uYmluZChfdGhpczIuX19iYWNrZ3JvdW5kLCAnbW91c2Vkb3duJywgb25Nb3VzZURvd24pO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2JhY2tncm91bmQsICd0b3VjaHN0YXJ0Jywgb25Ub3VjaFN0YXJ0KTtcbiAgICBkb20uYWRkQ2xhc3MoX3RoaXMyLl9fYmFja2dyb3VuZCwgJ3NsaWRlcicpO1xuICAgIGRvbS5hZGRDbGFzcyhfdGhpczIuX19mb3JlZ3JvdW5kLCAnc2xpZGVyLWZnJyk7XG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuICAgICAgZG9jdW1lbnQuYWN0aXZlRWxlbWVudC5ibHVyKCk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBvbk1vdXNlRHJhZyk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIG9uTW91c2VEcmFnKGUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvbk1vdXNlRHJhZyhlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICB2YXIgYmdSZWN0ID0gX3RoaXMuX19iYWNrZ3JvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgX3RoaXMuc2V0VmFsdWUobWFwKGUuY2xpZW50WCwgYmdSZWN0LmxlZnQsIGJnUmVjdC5yaWdodCwgX3RoaXMuX19taW4sIF90aGlzLl9fbWF4KSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VVcCgpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgb25Nb3VzZVVwKTtcbiAgICAgIGlmIChfdGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIF90aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbChfdGhpcywgX3RoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uVG91Y2hTdGFydChlKSB7XG4gICAgICBpZiAoZS50b3VjaGVzLmxlbmd0aCAhPT0gMSkge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBkb20uYmluZCh3aW5kb3csICd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIG9uVG91Y2hFbmQpO1xuICAgICAgb25Ub3VjaE1vdmUoZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uVG91Y2hNb3ZlKGUpIHtcbiAgICAgIHZhciBjbGllbnRYID0gZS50b3VjaGVzWzBdLmNsaWVudFg7XG4gICAgICB2YXIgYmdSZWN0ID0gX3RoaXMuX19iYWNrZ3JvdW5kLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgX3RoaXMuc2V0VmFsdWUobWFwKGNsaWVudFgsIGJnUmVjdC5sZWZ0LCBiZ1JlY3QucmlnaHQsIF90aGlzLl9fbWluLCBfdGhpcy5fX21heCkpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvblRvdWNoRW5kKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICd0b3VjaG1vdmUnLCBvblRvdWNoTW92ZSk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgICBpZiAoX3RoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICBfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoX3RoaXMsIF90aGlzLmdldFZhbHVlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICBfdGhpczIudXBkYXRlRGlzcGxheSgpO1xuICAgIF90aGlzMi5fX2JhY2tncm91bmQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9fZm9yZWdyb3VuZCk7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9fYmFja2dyb3VuZCk7XG4gICAgcmV0dXJuIF90aGlzMjtcbiAgfVxuICBjcmVhdGVDbGFzcyhOdW1iZXJDb250cm9sbGVyU2xpZGVyLCBbe1xuICAgIGtleTogJ3VwZGF0ZURpc3BsYXknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgdmFyIHBjdCA9ICh0aGlzLmdldFZhbHVlKCkgLSB0aGlzLl9fbWluKSAvICh0aGlzLl9fbWF4IC0gdGhpcy5fX21pbik7XG4gICAgICB0aGlzLl9fZm9yZWdyb3VuZC5zdHlsZS53aWR0aCA9IHBjdCAqIDEwMCArICclJztcbiAgICAgIHJldHVybiBnZXQoTnVtYmVyQ29udHJvbGxlclNsaWRlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihOdW1iZXJDb250cm9sbGVyU2xpZGVyLnByb3RvdHlwZSksICd1cGRhdGVEaXNwbGF5JywgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXJTbGlkZXI7XG59KE51bWJlckNvbnRyb2xsZXIpO1xuXG52YXIgRnVuY3Rpb25Db250cm9sbGVyID0gZnVuY3Rpb24gKF9Db250cm9sbGVyKSB7XG4gIGluaGVyaXRzKEZ1bmN0aW9uQ29udHJvbGxlciwgX0NvbnRyb2xsZXIpO1xuICBmdW5jdGlvbiBGdW5jdGlvbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSwgdGV4dCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIEZ1bmN0aW9uQ29udHJvbGxlcik7XG4gICAgdmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKEZ1bmN0aW9uQ29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEZ1bmN0aW9uQ29udHJvbGxlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSkpO1xuICAgIHZhciBfdGhpcyA9IF90aGlzMjtcbiAgICBfdGhpczIuX19idXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfdGhpczIuX19idXR0b24uaW5uZXJIVE1MID0gdGV4dCA9PT0gdW5kZWZpbmVkID8gJ0ZpcmUnIDogdGV4dDtcbiAgICBkb20uYmluZChfdGhpczIuX19idXR0b24sICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBfdGhpcy5maXJlKCk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfSk7XG4gICAgZG9tLmFkZENsYXNzKF90aGlzMi5fX2J1dHRvbiwgJ2J1dHRvbicpO1xuICAgIF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKF90aGlzMi5fX2J1dHRvbik7XG4gICAgcmV0dXJuIF90aGlzMjtcbiAgfVxuICBjcmVhdGVDbGFzcyhGdW5jdGlvbkNvbnRyb2xsZXIsIFt7XG4gICAga2V5OiAnZmlyZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGZpcmUoKSB7XG4gICAgICBpZiAodGhpcy5fX29uQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX19vbkNoYW5nZS5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgICAgdGhpcy5nZXRWYWx1ZSgpLmNhbGwodGhpcy5vYmplY3QpO1xuICAgICAgaWYgKHRoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICB0aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbCh0aGlzLCB0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gRnVuY3Rpb25Db250cm9sbGVyO1xufShDb250cm9sbGVyKTtcblxudmFyIENvbG9yQ29udHJvbGxlciA9IGZ1bmN0aW9uIChfQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhDb2xvckNvbnRyb2xsZXIsIF9Db250cm9sbGVyKTtcbiAgZnVuY3Rpb24gQ29sb3JDb250cm9sbGVyKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDb2xvckNvbnRyb2xsZXIpO1xuICAgIHZhciBfdGhpczIgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChDb2xvckNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihDb2xvckNvbnRyb2xsZXIpKS5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHkpKTtcbiAgICBfdGhpczIuX19jb2xvciA9IG5ldyBDb2xvcihfdGhpczIuZ2V0VmFsdWUoKSk7XG4gICAgX3RoaXMyLl9fdGVtcCA9IG5ldyBDb2xvcigwKTtcbiAgICB2YXIgX3RoaXMgPSBfdGhpczI7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBkb20ubWFrZVNlbGVjdGFibGUoX3RoaXMyLmRvbUVsZW1lbnQsIGZhbHNlKTtcbiAgICBfdGhpczIuX19zZWxlY3RvciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF90aGlzMi5fX3NlbGVjdG9yLmNsYXNzTmFtZSA9ICdzZWxlY3Rvcic7XG4gICAgX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF90aGlzMi5fX3NhdHVyYXRpb25fZmllbGQuY2xhc3NOYW1lID0gJ3NhdHVyYXRpb24tZmllbGQnO1xuICAgIF90aGlzMi5fX2ZpZWxkX2tub2IgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfdGhpczIuX19maWVsZF9rbm9iLmNsYXNzTmFtZSA9ICdmaWVsZC1rbm9iJztcbiAgICBfdGhpczIuX19maWVsZF9rbm9iX2JvcmRlciA9ICcycHggc29saWQgJztcbiAgICBfdGhpczIuX19odWVfa25vYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF90aGlzMi5fX2h1ZV9rbm9iLmNsYXNzTmFtZSA9ICdodWUta25vYic7XG4gICAgX3RoaXMyLl9faHVlX2ZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX3RoaXMyLl9faHVlX2ZpZWxkLmNsYXNzTmFtZSA9ICdodWUtZmllbGQnO1xuICAgIF90aGlzMi5fX2lucHV0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnaW5wdXQnKTtcbiAgICBfdGhpczIuX19pbnB1dC50eXBlID0gJ3RleHQnO1xuICAgIF90aGlzMi5fX2lucHV0X3RleHRTaGFkb3cgPSAnMCAxcHggMXB4ICc7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIG9uQmx1ci5jYWxsKHRoaXMpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2lucHV0LCAnYmx1cicsIG9uQmx1cik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fc2VsZWN0b3IsICdtb3VzZWRvd24nLCBmdW5jdGlvbiAoKSAgICAgICAge1xuICAgICAgZG9tLmFkZENsYXNzKHRoaXMsICdkcmFnJykuYmluZCh3aW5kb3csICdtb3VzZXVwJywgZnVuY3Rpb24gKCkgICAgICAgIHtcbiAgICAgICAgZG9tLnJlbW92ZUNsYXNzKF90aGlzLl9fc2VsZWN0b3IsICdkcmFnJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICBkb20uYmluZChfdGhpczIuX19zZWxlY3RvciwgJ3RvdWNoc3RhcnQnLCBmdW5jdGlvbiAoKSAgICAgICAge1xuICAgICAgZG9tLmFkZENsYXNzKHRoaXMsICdkcmFnJykuYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIGZ1bmN0aW9uICgpICAgICAgICB7XG4gICAgICAgIGRvbS5yZW1vdmVDbGFzcyhfdGhpcy5fX3NlbGVjdG9yLCAnZHJhZycpO1xuICAgICAgfSk7XG4gICAgfSk7XG4gICAgdmFyIHZhbHVlRmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBDb21tb24uZXh0ZW5kKF90aGlzMi5fX3NlbGVjdG9yLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzEyMnB4JyxcbiAgICAgIGhlaWdodDogJzEwMnB4JyxcbiAgICAgIHBhZGRpbmc6ICczcHgnLFxuICAgICAgYmFja2dyb3VuZENvbG9yOiAnIzIyMicsXG4gICAgICBib3hTaGFkb3c6ICcwcHggMXB4IDNweCByZ2JhKDAsMCwwLDAuMyknXG4gICAgfSk7XG4gICAgQ29tbW9uLmV4dGVuZChfdGhpczIuX19maWVsZF9rbm9iLnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiAnMTJweCcsXG4gICAgICBoZWlnaHQ6ICcxMnB4JyxcbiAgICAgIGJvcmRlcjogX3RoaXMyLl9fZmllbGRfa25vYl9ib3JkZXIgKyAoX3RoaXMyLl9fY29sb3IudiA8IDAuNSA/ICcjZmZmJyA6ICcjMDAwJyksXG4gICAgICBib3hTaGFkb3c6ICcwcHggMXB4IDNweCByZ2JhKDAsMCwwLDAuNSknLFxuICAgICAgYm9yZGVyUmFkaXVzOiAnMTJweCcsXG4gICAgICB6SW5kZXg6IDFcbiAgICB9KTtcbiAgICBDb21tb24uZXh0ZW5kKF90aGlzMi5fX2h1ZV9rbm9iLnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHdpZHRoOiAnMTVweCcsXG4gICAgICBoZWlnaHQ6ICcycHgnLFxuICAgICAgYm9yZGVyUmlnaHQ6ICc0cHggc29saWQgI2ZmZicsXG4gICAgICB6SW5kZXg6IDFcbiAgICB9KTtcbiAgICBDb21tb24uZXh0ZW5kKF90aGlzMi5fX3NhdHVyYXRpb25fZmllbGQuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiAnMTAwcHgnLFxuICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICM1NTUnLFxuICAgICAgbWFyZ2luUmlnaHQ6ICczcHgnLFxuICAgICAgZGlzcGxheTogJ2lubGluZS1ibG9jaycsXG4gICAgICBjdXJzb3I6ICdwb2ludGVyJ1xuICAgIH0pO1xuICAgIENvbW1vbi5leHRlbmQodmFsdWVGaWVsZC5zdHlsZSwge1xuICAgICAgd2lkdGg6ICcxMDAlJyxcbiAgICAgIGhlaWdodDogJzEwMCUnLFxuICAgICAgYmFja2dyb3VuZDogJ25vbmUnXG4gICAgfSk7XG4gICAgbGluZWFyR3JhZGllbnQodmFsdWVGaWVsZCwgJ3RvcCcsICdyZ2JhKDAsMCwwLDApJywgJyMwMDAnKTtcbiAgICBDb21tb24uZXh0ZW5kKF90aGlzMi5fX2h1ZV9maWVsZC5zdHlsZSwge1xuICAgICAgd2lkdGg6ICcxNXB4JyxcbiAgICAgIGhlaWdodDogJzEwMHB4JyxcbiAgICAgIGJvcmRlcjogJzFweCBzb2xpZCAjNTU1JyxcbiAgICAgIGN1cnNvcjogJ25zLXJlc2l6ZScsXG4gICAgICBwb3NpdGlvbjogJ2Fic29sdXRlJyxcbiAgICAgIHRvcDogJzNweCcsXG4gICAgICByaWdodDogJzNweCdcbiAgICB9KTtcbiAgICBodWVHcmFkaWVudChfdGhpczIuX19odWVfZmllbGQpO1xuICAgIENvbW1vbi5leHRlbmQoX3RoaXMyLl9faW5wdXQuc3R5bGUsIHtcbiAgICAgIG91dGxpbmU6ICdub25lJyxcbiAgICAgIHRleHRBbGlnbjogJ2NlbnRlcicsXG4gICAgICBjb2xvcjogJyNmZmYnLFxuICAgICAgYm9yZGVyOiAwLFxuICAgICAgZm9udFdlaWdodDogJ2JvbGQnLFxuICAgICAgdGV4dFNoYWRvdzogX3RoaXMyLl9faW5wdXRfdGV4dFNoYWRvdyArICdyZ2JhKDAsMCwwLDAuNyknXG4gICAgfSk7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZCwgJ21vdXNlZG93bicsIGZpZWxkRG93bik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZCwgJ3RvdWNoc3RhcnQnLCBmaWVsZERvd24pO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2ZpZWxkX2tub2IsICdtb3VzZWRvd24nLCBmaWVsZERvd24pO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2ZpZWxkX2tub2IsICd0b3VjaHN0YXJ0JywgZmllbGREb3duKTtcbiAgICBkb20uYmluZChfdGhpczIuX19odWVfZmllbGQsICdtb3VzZWRvd24nLCBmaWVsZERvd25IKTtcbiAgICBkb20uYmluZChfdGhpczIuX19odWVfZmllbGQsICd0b3VjaHN0YXJ0JywgZmllbGREb3duSCk7XG4gICAgZnVuY3Rpb24gZmllbGREb3duKGUpIHtcbiAgICAgIHNldFNWKGUpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgc2V0U1YpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAndG91Y2htb3ZlJywgc2V0U1YpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2V1cCcsIGZpZWxkVXBTVik7XG4gICAgICBkb20uYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIGZpZWxkVXBTVik7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpZWxkRG93bkgoZSkge1xuICAgICAgc2V0SChlKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIHNldEgpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAndG91Y2htb3ZlJywgc2V0SCk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgZmllbGRVcEgpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAndG91Y2hlbmQnLCBmaWVsZFVwSCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpZWxkVXBTVigpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgc2V0U1YpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICd0b3VjaG1vdmUnLCBzZXRTVik7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBmaWVsZFVwU1YpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIGZpZWxkVXBTVik7XG4gICAgICBvbkZpbmlzaCgpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBmaWVsZFVwSCgpIHtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgc2V0SCk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3RvdWNobW92ZScsIHNldEgpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZXVwJywgZmllbGRVcEgpO1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIGZpZWxkVXBIKTtcbiAgICAgIG9uRmluaXNoKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uQmx1cigpIHtcbiAgICAgIHZhciBpID0gaW50ZXJwcmV0KHRoaXMudmFsdWUpO1xuICAgICAgaWYgKGkgIT09IGZhbHNlKSB7XG4gICAgICAgIF90aGlzLl9fY29sb3IuX19zdGF0ZSA9IGk7XG4gICAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMudmFsdWUgPSBfdGhpcy5fX2NvbG9yLnRvU3RyaW5nKCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uRmluaXNoKCkge1xuICAgICAgaWYgKF90aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgX3RoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKF90aGlzLCBfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIF90aGlzMi5fX3NhdHVyYXRpb25fZmllbGQuYXBwZW5kQ2hpbGQodmFsdWVGaWVsZCk7XG4gICAgX3RoaXMyLl9fc2VsZWN0b3IuYXBwZW5kQ2hpbGQoX3RoaXMyLl9fZmllbGRfa25vYik7XG4gICAgX3RoaXMyLl9fc2VsZWN0b3IuYXBwZW5kQ2hpbGQoX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZCk7XG4gICAgX3RoaXMyLl9fc2VsZWN0b3IuYXBwZW5kQ2hpbGQoX3RoaXMyLl9faHVlX2ZpZWxkKTtcbiAgICBfdGhpczIuX19odWVfZmllbGQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9faHVlX2tub2IpO1xuICAgIF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKF90aGlzMi5fX2lucHV0KTtcbiAgICBfdGhpczIuZG9tRWxlbWVudC5hcHBlbmRDaGlsZChfdGhpczIuX19zZWxlY3Rvcik7XG4gICAgX3RoaXMyLnVwZGF0ZURpc3BsYXkoKTtcbiAgICBmdW5jdGlvbiBzZXRTVihlKSB7XG4gICAgICBpZiAoZS50eXBlLmluZGV4T2YoJ3RvdWNoJykgPT09IC0xKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIHZhciBmaWVsZFJlY3QgPSBfdGhpcy5fX3NhdHVyYXRpb25fZmllbGQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICB2YXIgX3JlZiA9IGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0gfHwgZSxcbiAgICAgICAgICBjbGllbnRYID0gX3JlZi5jbGllbnRYLFxuICAgICAgICAgIGNsaWVudFkgPSBfcmVmLmNsaWVudFk7XG4gICAgICB2YXIgcyA9IChjbGllbnRYIC0gZmllbGRSZWN0LmxlZnQpIC8gKGZpZWxkUmVjdC5yaWdodCAtIGZpZWxkUmVjdC5sZWZ0KTtcbiAgICAgIHZhciB2ID0gMSAtIChjbGllbnRZIC0gZmllbGRSZWN0LnRvcCkgLyAoZmllbGRSZWN0LmJvdHRvbSAtIGZpZWxkUmVjdC50b3ApO1xuICAgICAgaWYgKHYgPiAxKSB7XG4gICAgICAgIHYgPSAxO1xuICAgICAgfSBlbHNlIGlmICh2IDwgMCkge1xuICAgICAgICB2ID0gMDtcbiAgICAgIH1cbiAgICAgIGlmIChzID4gMSkge1xuICAgICAgICBzID0gMTtcbiAgICAgIH0gZWxzZSBpZiAocyA8IDApIHtcbiAgICAgICAgcyA9IDA7XG4gICAgICB9XG4gICAgICBfdGhpcy5fX2NvbG9yLnYgPSB2O1xuICAgICAgX3RoaXMuX19jb2xvci5zID0gcztcbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gc2V0SChlKSB7XG4gICAgICBpZiAoZS50eXBlLmluZGV4T2YoJ3RvdWNoJykgPT09IC0xKSB7XG4gICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIH1cbiAgICAgIHZhciBmaWVsZFJlY3QgPSBfdGhpcy5fX2h1ZV9maWVsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBfcmVmMiA9IGUudG91Y2hlcyAmJiBlLnRvdWNoZXNbMF0gfHwgZSxcbiAgICAgICAgICBjbGllbnRZID0gX3JlZjIuY2xpZW50WTtcbiAgICAgIHZhciBoID0gMSAtIChjbGllbnRZIC0gZmllbGRSZWN0LnRvcCkgLyAoZmllbGRSZWN0LmJvdHRvbSAtIGZpZWxkUmVjdC50b3ApO1xuICAgICAgaWYgKGggPiAxKSB7XG4gICAgICAgIGggPSAxO1xuICAgICAgfSBlbHNlIGlmIChoIDwgMCkge1xuICAgICAgICBoID0gMDtcbiAgICAgIH1cbiAgICAgIF90aGlzLl9fY29sb3IuaCA9IGggKiAzNjA7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShfdGhpcy5fX2NvbG9yLnRvT3JpZ2luYWwoKSk7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuICAgIHJldHVybiBfdGhpczI7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoQ29sb3JDb250cm9sbGVyLCBbe1xuICAgIGtleTogJ3VwZGF0ZURpc3BsYXknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgdmFyIGkgPSBpbnRlcnByZXQodGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIGlmIChpICE9PSBmYWxzZSkge1xuICAgICAgICB2YXIgbWlzbWF0Y2ggPSBmYWxzZTtcbiAgICAgICAgQ29tbW9uLmVhY2goQ29sb3IuQ09NUE9ORU5UUywgZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICAgICAgICAgIGlmICghQ29tbW9uLmlzVW5kZWZpbmVkKGlbY29tcG9uZW50XSkgJiYgIUNvbW1vbi5pc1VuZGVmaW5lZCh0aGlzLl9fY29sb3IuX19zdGF0ZVtjb21wb25lbnRdKSAmJiBpW2NvbXBvbmVudF0gIT09IHRoaXMuX19jb2xvci5fX3N0YXRlW2NvbXBvbmVudF0pIHtcbiAgICAgICAgICAgIG1pc21hdGNoID0gdHJ1ZTtcbiAgICAgICAgICAgIHJldHVybiB7fTtcbiAgICAgICAgICB9XG4gICAgICAgIH0sIHRoaXMpO1xuICAgICAgICBpZiAobWlzbWF0Y2gpIHtcbiAgICAgICAgICBDb21tb24uZXh0ZW5kKHRoaXMuX19jb2xvci5fX3N0YXRlLCBpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgQ29tbW9uLmV4dGVuZCh0aGlzLl9fdGVtcC5fX3N0YXRlLCB0aGlzLl9fY29sb3IuX19zdGF0ZSk7XG4gICAgICB0aGlzLl9fdGVtcC5hID0gMTtcbiAgICAgIHZhciBmbGlwID0gdGhpcy5fX2NvbG9yLnYgPCAwLjUgfHwgdGhpcy5fX2NvbG9yLnMgPiAwLjUgPyAyNTUgOiAwO1xuICAgICAgdmFyIF9mbGlwID0gMjU1IC0gZmxpcDtcbiAgICAgIENvbW1vbi5leHRlbmQodGhpcy5fX2ZpZWxkX2tub2Iuc3R5bGUsIHtcbiAgICAgICAgbWFyZ2luTGVmdDogMTAwICogdGhpcy5fX2NvbG9yLnMgLSA3ICsgJ3B4JyxcbiAgICAgICAgbWFyZ2luVG9wOiAxMDAgKiAoMSAtIHRoaXMuX19jb2xvci52KSAtIDcgKyAncHgnLFxuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuX190ZW1wLnRvSGV4U3RyaW5nKCksXG4gICAgICAgIGJvcmRlcjogdGhpcy5fX2ZpZWxkX2tub2JfYm9yZGVyICsgJ3JnYignICsgZmxpcCArICcsJyArIGZsaXAgKyAnLCcgKyBmbGlwICsgJyknXG4gICAgICB9KTtcbiAgICAgIHRoaXMuX19odWVfa25vYi5zdHlsZS5tYXJnaW5Ub3AgPSAoMSAtIHRoaXMuX19jb2xvci5oIC8gMzYwKSAqIDEwMCArICdweCc7XG4gICAgICB0aGlzLl9fdGVtcC5zID0gMTtcbiAgICAgIHRoaXMuX190ZW1wLnYgPSAxO1xuICAgICAgbGluZWFyR3JhZGllbnQodGhpcy5fX3NhdHVyYXRpb25fZmllbGQsICdsZWZ0JywgJyNmZmYnLCB0aGlzLl9fdGVtcC50b0hleFN0cmluZygpKTtcbiAgICAgIHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuX19jb2xvci50b1N0cmluZygpO1xuICAgICAgQ29tbW9uLmV4dGVuZCh0aGlzLl9faW5wdXQuc3R5bGUsIHtcbiAgICAgICAgYmFja2dyb3VuZENvbG9yOiB0aGlzLl9fY29sb3IudG9IZXhTdHJpbmcoKSxcbiAgICAgICAgY29sb3I6ICdyZ2IoJyArIGZsaXAgKyAnLCcgKyBmbGlwICsgJywnICsgZmxpcCArICcpJyxcbiAgICAgICAgdGV4dFNoYWRvdzogdGhpcy5fX2lucHV0X3RleHRTaGFkb3cgKyAncmdiYSgnICsgX2ZsaXAgKyAnLCcgKyBfZmxpcCArICcsJyArIF9mbGlwICsgJywuNyknXG4gICAgICB9KTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIENvbG9yQ29udHJvbGxlcjtcbn0oQ29udHJvbGxlcik7XG52YXIgdmVuZG9ycyA9IFsnLW1vei0nLCAnLW8tJywgJy13ZWJraXQtJywgJy1tcy0nLCAnJ107XG5mdW5jdGlvbiBsaW5lYXJHcmFkaWVudChlbGVtLCB4LCBhLCBiKSB7XG4gIGVsZW0uc3R5bGUuYmFja2dyb3VuZCA9ICcnO1xuICBDb21tb24uZWFjaCh2ZW5kb3JzLCBmdW5jdGlvbiAodmVuZG9yKSB7XG4gICAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAnICsgdmVuZG9yICsgJ2xpbmVhci1ncmFkaWVudCgnICsgeCArICcsICcgKyBhICsgJyAwJSwgJyArIGIgKyAnIDEwMCUpOyAnO1xuICB9KTtcbn1cbmZ1bmN0aW9uIGh1ZUdyYWRpZW50KGVsZW0pIHtcbiAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW1vei1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwgI2ZmMDBmZiAxNyUsICMwMDAwZmYgMzQlLCAjMDBmZmZmIDUwJSwgIzAwZmYwMCA2NyUsICNmZmZmMDAgODQlLCAjZmYwMDAwIDEwMCUpOyc7XG4gIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLXdlYmtpdC1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOyc7XG4gIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW8tbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnO1xuICBlbGVtLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6IC1tcy1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOyc7XG4gIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogbGluZWFyLWdyYWRpZW50KHRvcCwgICNmZjAwMDAgMCUsI2ZmMDBmZiAxNyUsIzAwMDBmZiAzNCUsIzAwZmZmZiA1MCUsIzAwZmYwMCA2NyUsI2ZmZmYwMCA4NCUsI2ZmMDAwMCAxMDAlKTsnO1xufVxuXG52YXIgY3NzID0ge1xuICBsb2FkOiBmdW5jdGlvbiBsb2FkKHVybCwgaW5kb2MpIHtcbiAgICB2YXIgZG9jID0gaW5kb2MgfHwgZG9jdW1lbnQ7XG4gICAgdmFyIGxpbmsgPSBkb2MuY3JlYXRlRWxlbWVudCgnbGluaycpO1xuICAgIGxpbmsudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgbGluay5yZWwgPSAnc3R5bGVzaGVldCc7XG4gICAgbGluay5ocmVmID0gdXJsO1xuICAgIGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdLmFwcGVuZENoaWxkKGxpbmspO1xuICB9LFxuICBpbmplY3Q6IGZ1bmN0aW9uIGluamVjdChjc3NDb250ZW50LCBpbmRvYykge1xuICAgIHZhciBkb2MgPSBpbmRvYyB8fCBkb2N1bWVudDtcbiAgICB2YXIgaW5qZWN0ZWQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuICAgIGluamVjdGVkLnR5cGUgPSAndGV4dC9jc3MnO1xuICAgIGluamVjdGVkLmlubmVySFRNTCA9IGNzc0NvbnRlbnQ7XG4gICAgdmFyIGhlYWQgPSBkb2MuZ2V0RWxlbWVudHNCeVRhZ05hbWUoJ2hlYWQnKVswXTtcbiAgICB0cnkge1xuICAgICAgaGVhZC5hcHBlbmRDaGlsZChpbmplY3RlZCk7XG4gICAgfSBjYXRjaCAoZSkge1xuICAgIH1cbiAgfVxufTtcblxudmFyIHNhdmVEaWFsb2dDb250ZW50cyA9IFwiPGRpdiBpZD1cXFwiZGctc2F2ZVxcXCIgY2xhc3M9XFxcImRnIGRpYWxvZ3VlXFxcIj5cXG5cXG4gIEhlcmUncyB0aGUgbmV3IGxvYWQgcGFyYW1ldGVyIGZvciB5b3VyIDxjb2RlPkdVSTwvY29kZT4ncyBjb25zdHJ1Y3RvcjpcXG5cXG4gIDx0ZXh0YXJlYSBpZD1cXFwiZGctbmV3LWNvbnN0cnVjdG9yXFxcIj48L3RleHRhcmVhPlxcblxcbiAgPGRpdiBpZD1cXFwiZGctc2F2ZS1sb2NhbGx5XFxcIj5cXG5cXG4gICAgPGlucHV0IGlkPVxcXCJkZy1sb2NhbC1zdG9yYWdlXFxcIiB0eXBlPVxcXCJjaGVja2JveFxcXCIvPiBBdXRvbWF0aWNhbGx5IHNhdmVcXG4gICAgdmFsdWVzIHRvIDxjb2RlPmxvY2FsU3RvcmFnZTwvY29kZT4gb24gZXhpdC5cXG5cXG4gICAgPGRpdiBpZD1cXFwiZGctbG9jYWwtZXhwbGFpblxcXCI+VGhlIHZhbHVlcyBzYXZlZCB0byA8Y29kZT5sb2NhbFN0b3JhZ2U8L2NvZGU+IHdpbGxcXG4gICAgICBvdmVycmlkZSB0aG9zZSBwYXNzZWQgdG8gPGNvZGU+ZGF0LkdVSTwvY29kZT4ncyBjb25zdHJ1Y3Rvci4gVGhpcyBtYWtlcyBpdFxcbiAgICAgIGVhc2llciB0byB3b3JrIGluY3JlbWVudGFsbHksIGJ1dCA8Y29kZT5sb2NhbFN0b3JhZ2U8L2NvZGU+IGlzIGZyYWdpbGUsXFxuICAgICAgYW5kIHlvdXIgZnJpZW5kcyBtYXkgbm90IHNlZSB0aGUgc2FtZSB2YWx1ZXMgeW91IGRvLlxcblxcbiAgICA8L2Rpdj5cXG5cXG4gIDwvZGl2PlxcblxcbjwvZGl2PlwiO1xuXG52YXIgQ29udHJvbGxlckZhY3RvcnkgPSBmdW5jdGlvbiBDb250cm9sbGVyRmFjdG9yeShvYmplY3QsIHByb3BlcnR5KSB7XG4gIHZhciBpbml0aWFsVmFsdWUgPSBvYmplY3RbcHJvcGVydHldO1xuICBpZiAoQ29tbW9uLmlzQXJyYXkoYXJndW1lbnRzWzJdKSB8fCBDb21tb24uaXNPYmplY3QoYXJndW1lbnRzWzJdKSkge1xuICAgIHJldHVybiBuZXcgT3B0aW9uQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5LCBhcmd1bWVudHNbMl0pO1xuICB9XG4gIGlmIChDb21tb24uaXNOdW1iZXIoaW5pdGlhbFZhbHVlKSkge1xuICAgIGlmIChDb21tb24uaXNOdW1iZXIoYXJndW1lbnRzWzJdKSAmJiBDb21tb24uaXNOdW1iZXIoYXJndW1lbnRzWzNdKSkge1xuICAgICAgaWYgKENvbW1vbi5pc051bWJlcihhcmd1bWVudHNbNF0pKSB7XG4gICAgICAgIHJldHVybiBuZXcgTnVtYmVyQ29udHJvbGxlclNsaWRlcihvYmplY3QsIHByb3BlcnR5LCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSwgYXJndW1lbnRzWzRdKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBuZXcgTnVtYmVyQ29udHJvbGxlclNsaWRlcihvYmplY3QsIHByb3BlcnR5LCBhcmd1bWVudHNbMl0sIGFyZ3VtZW50c1szXSk7XG4gICAgfVxuICAgIGlmIChDb21tb24uaXNOdW1iZXIoYXJndW1lbnRzWzRdKSkge1xuICAgICAgcmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyQm94KG9iamVjdCwgcHJvcGVydHksIHsgbWluOiBhcmd1bWVudHNbMl0sIG1heDogYXJndW1lbnRzWzNdLCBzdGVwOiBhcmd1bWVudHNbNF0gfSk7XG4gICAgfVxuICAgIHJldHVybiBuZXcgTnVtYmVyQ29udHJvbGxlckJveChvYmplY3QsIHByb3BlcnR5LCB7IG1pbjogYXJndW1lbnRzWzJdLCBtYXg6IGFyZ3VtZW50c1szXSB9KTtcbiAgfVxuICBpZiAoQ29tbW9uLmlzU3RyaW5nKGluaXRpYWxWYWx1ZSkpIHtcbiAgICByZXR1cm4gbmV3IFN0cmluZ0NvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG4gIH1cbiAgaWYgKENvbW1vbi5pc0Z1bmN0aW9uKGluaXRpYWxWYWx1ZSkpIHtcbiAgICByZXR1cm4gbmV3IEZ1bmN0aW9uQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5LCAnJyk7XG4gIH1cbiAgaWYgKENvbW1vbi5pc0Jvb2xlYW4oaW5pdGlhbFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgQm9vbGVhbkNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSk7XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59O1xuXG5mdW5jdGlvbiByZXF1ZXN0QW5pbWF0aW9uRnJhbWUoY2FsbGJhY2spIHtcbiAgc2V0VGltZW91dChjYWxsYmFjaywgMTAwMCAvIDYwKTtcbn1cbnZhciByZXF1ZXN0QW5pbWF0aW9uRnJhbWUkMSA9IHdpbmRvdy5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93LndlYmtpdFJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cubW96UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5vUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tc1JlcXVlc3RBbmltYXRpb25GcmFtZSB8fCByZXF1ZXN0QW5pbWF0aW9uRnJhbWU7XG5cbnZhciBDZW50ZXJlZERpdiA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gQ2VudGVyZWREaXYoKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQ2VudGVyZWREaXYpO1xuICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBDb21tb24uZXh0ZW5kKHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUsIHtcbiAgICAgIGJhY2tncm91bmRDb2xvcjogJ3JnYmEoMCwwLDAsMC44KScsXG4gICAgICB0b3A6IDAsXG4gICAgICBsZWZ0OiAwLFxuICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgekluZGV4OiAnMTAwMCcsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgV2Via2l0VHJhbnNpdGlvbjogJ29wYWNpdHkgMC4ycyBsaW5lYXInLFxuICAgICAgdHJhbnNpdGlvbjogJ29wYWNpdHkgMC4ycyBsaW5lYXInXG4gICAgfSk7XG4gICAgZG9tLm1ha2VGdWxsc2NyZWVuKHRoaXMuYmFja2dyb3VuZEVsZW1lbnQpO1xuICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUucG9zaXRpb24gPSAnZml4ZWQnO1xuICAgIHRoaXMuZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIENvbW1vbi5leHRlbmQodGhpcy5kb21FbGVtZW50LnN0eWxlLCB7XG4gICAgICBwb3NpdGlvbjogJ2ZpeGVkJyxcbiAgICAgIGRpc3BsYXk6ICdub25lJyxcbiAgICAgIHpJbmRleDogJzEwMDEnLFxuICAgICAgb3BhY2l0eTogMCxcbiAgICAgIFdlYmtpdFRyYW5zaXRpb246ICctd2Via2l0LXRyYW5zZm9ybSAwLjJzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnMgbGluZWFyJyxcbiAgICAgIHRyYW5zaXRpb246ICd0cmFuc2Zvcm0gMC4ycyBlYXNlLW91dCwgb3BhY2l0eSAwLjJzIGxpbmVhcidcbiAgICB9KTtcbiAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKHRoaXMuYmFja2dyb3VuZEVsZW1lbnQpO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5kb21FbGVtZW50KTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIGRvbS5iaW5kKHRoaXMuYmFja2dyb3VuZEVsZW1lbnQsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLmhpZGUoKTtcbiAgICB9KTtcbiAgfVxuICBjcmVhdGVDbGFzcyhDZW50ZXJlZERpdiwgW3tcbiAgICBrZXk6ICdzaG93JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc2hvdygpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgxLjEpJztcbiAgICAgIHRoaXMubGF5b3V0KCk7XG4gICAgICBDb21tb24uZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICBfdGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgX3RoaXMuZG9tRWxlbWVudC5zdHlsZS5vcGFjaXR5ID0gMTtcbiAgICAgICAgX3RoaXMuZG9tRWxlbWVudC5zdHlsZS53ZWJraXRUcmFuc2Zvcm0gPSAnc2NhbGUoMSknO1xuICAgICAgfSk7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaGlkZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgdmFyIGhpZGUgPSBmdW5jdGlvbiBoaWRlKCkge1xuICAgICAgICBfdGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIF90aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICAgIGRvbS51bmJpbmQoX3RoaXMuZG9tRWxlbWVudCwgJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCBoaWRlKTtcbiAgICAgICAgZG9tLnVuYmluZChfdGhpcy5kb21FbGVtZW50LCAndHJhbnNpdGlvbmVuZCcsIGhpZGUpO1xuICAgICAgICBkb20udW5iaW5kKF90aGlzLmRvbUVsZW1lbnQsICdvVHJhbnNpdGlvbkVuZCcsIGhpZGUpO1xuICAgICAgfTtcbiAgICAgIGRvbS5iaW5kKHRoaXMuZG9tRWxlbWVudCwgJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCBoaWRlKTtcbiAgICAgIGRvbS5iaW5kKHRoaXMuZG9tRWxlbWVudCwgJ3RyYW5zaXRpb25lbmQnLCBoaWRlKTtcbiAgICAgIGRvbS5iaW5kKHRoaXMuZG9tRWxlbWVudCwgJ29UcmFuc2l0aW9uRW5kJywgaGlkZSk7XG4gICAgICB0aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAwO1xuICAgICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgxLjEpJztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdsYXlvdXQnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBsYXlvdXQoKSB7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUubGVmdCA9IHdpbmRvdy5pbm5lcldpZHRoIC8gMiAtIGRvbS5nZXRXaWR0aCh0aGlzLmRvbUVsZW1lbnQpIC8gMiArICdweCc7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUudG9wID0gd2luZG93LmlubmVySGVpZ2h0IC8gMiAtIGRvbS5nZXRIZWlnaHQodGhpcy5kb21FbGVtZW50KSAvIDIgKyAncHgnO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gQ2VudGVyZWREaXY7XG59KCk7XG5cbnZhciBzdHlsZVNoZWV0ID0gX19fJGluc2VydFN0eWxlKFwiLmRnIHVse2xpc3Qtc3R5bGU6bm9uZTttYXJnaW46MDtwYWRkaW5nOjA7d2lkdGg6MTAwJTtjbGVhcjpib3RofS5kZy5hY3twb3NpdGlvbjpmaXhlZDt0b3A6MDtsZWZ0OjA7cmlnaHQ6MDtoZWlnaHQ6MDt6LWluZGV4OjB9LmRnOm5vdCguYWMpIC5tYWlue292ZXJmbG93OmhpZGRlbn0uZGcubWFpbnstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyOy1vLXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyOy1tb3otdHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXJ9LmRnLm1haW4udGFsbGVyLXRoYW4td2luZG93e292ZXJmbG93LXk6YXV0b30uZGcubWFpbi50YWxsZXItdGhhbi13aW5kb3cgLmNsb3NlLWJ1dHRvbntvcGFjaXR5OjE7bWFyZ2luLXRvcDotMXB4O2JvcmRlci10b3A6MXB4IHNvbGlkICMyYzJjMmN9LmRnLm1haW4gdWwuY2xvc2VkIC5jbG9zZS1idXR0b257b3BhY2l0eToxICFpbXBvcnRhbnR9LmRnLm1haW46aG92ZXIgLmNsb3NlLWJ1dHRvbiwuZGcubWFpbiAuY2xvc2UtYnV0dG9uLmRyYWd7b3BhY2l0eToxfS5kZy5tYWluIC5jbG9zZS1idXR0b257LXdlYmtpdC10cmFuc2l0aW9uOm9wYWNpdHkgLjFzIGxpbmVhcjstby10cmFuc2l0aW9uOm9wYWNpdHkgLjFzIGxpbmVhcjstbW96LXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyO3RyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyO2JvcmRlcjowO2xpbmUtaGVpZ2h0OjE5cHg7aGVpZ2h0OjIwcHg7Y3Vyc29yOnBvaW50ZXI7dGV4dC1hbGlnbjpjZW50ZXI7YmFja2dyb3VuZC1jb2xvcjojMDAwfS5kZy5tYWluIC5jbG9zZS1idXR0b24uY2xvc2UtdG9we3Bvc2l0aW9uOnJlbGF0aXZlfS5kZy5tYWluIC5jbG9zZS1idXR0b24uY2xvc2UtYm90dG9te3Bvc2l0aW9uOmFic29sdXRlfS5kZy5tYWluIC5jbG9zZS1idXR0b246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojMTExfS5kZy5he2Zsb2F0OnJpZ2h0O21hcmdpbi1yaWdodDoxNXB4O292ZXJmbG93LXk6dmlzaWJsZX0uZGcuYS5oYXMtc2F2ZT51bC5jbG9zZS10b3B7bWFyZ2luLXRvcDowfS5kZy5hLmhhcy1zYXZlPnVsLmNsb3NlLWJvdHRvbXttYXJnaW4tdG9wOjI3cHh9LmRnLmEuaGFzLXNhdmU+dWwuY2xvc2Vke21hcmdpbi10b3A6MH0uZGcuYSAuc2F2ZS1yb3d7dG9wOjA7ei1pbmRleDoxMDAyfS5kZy5hIC5zYXZlLXJvdy5jbG9zZS10b3B7cG9zaXRpb246cmVsYXRpdmV9LmRnLmEgLnNhdmUtcm93LmNsb3NlLWJvdHRvbXtwb3NpdGlvbjpmaXhlZH0uZGcgbGl7LXdlYmtpdC10cmFuc2l0aW9uOmhlaWdodCAuMXMgZWFzZS1vdXQ7LW8tdHJhbnNpdGlvbjpoZWlnaHQgLjFzIGVhc2Utb3V0Oy1tb3otdHJhbnNpdGlvbjpoZWlnaHQgLjFzIGVhc2Utb3V0O3RyYW5zaXRpb246aGVpZ2h0IC4xcyBlYXNlLW91dDstd2Via2l0LXRyYW5zaXRpb246b3ZlcmZsb3cgLjFzIGxpbmVhcjstby10cmFuc2l0aW9uOm92ZXJmbG93IC4xcyBsaW5lYXI7LW1vei10cmFuc2l0aW9uOm92ZXJmbG93IC4xcyBsaW5lYXI7dHJhbnNpdGlvbjpvdmVyZmxvdyAuMXMgbGluZWFyfS5kZyBsaTpub3QoLmZvbGRlcil7Y3Vyc29yOmF1dG87aGVpZ2h0OjI3cHg7bGluZS1oZWlnaHQ6MjdweDtwYWRkaW5nOjAgNHB4IDAgNXB4fS5kZyBsaS5mb2xkZXJ7cGFkZGluZzowO2JvcmRlci1sZWZ0OjRweCBzb2xpZCByZ2JhKDAsMCwwLDApfS5kZyBsaS50aXRsZXtjdXJzb3I6cG9pbnRlcjttYXJnaW4tbGVmdDotNHB4fS5kZyAuY2xvc2VkIGxpOm5vdCgudGl0bGUpLC5kZyAuY2xvc2VkIHVsIGxpLC5kZyAuY2xvc2VkIHVsIGxpPip7aGVpZ2h0OjA7b3ZlcmZsb3c6aGlkZGVuO2JvcmRlcjowfS5kZyAuY3J7Y2xlYXI6Ym90aDtwYWRkaW5nLWxlZnQ6M3B4O2hlaWdodDoyN3B4O292ZXJmbG93OmhpZGRlbn0uZGcgLnByb3BlcnR5LW5hbWV7Y3Vyc29yOmRlZmF1bHQ7ZmxvYXQ6bGVmdDtjbGVhcjpsZWZ0O3dpZHRoOjQwJTtvdmVyZmxvdzpoaWRkZW47dGV4dC1vdmVyZmxvdzplbGxpcHNpc30uZGcgLmN7ZmxvYXQ6bGVmdDt3aWR0aDo2MCU7cG9zaXRpb246cmVsYXRpdmV9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF17Ym9yZGVyOjA7bWFyZ2luLXRvcDo0cHg7cGFkZGluZzozcHg7d2lkdGg6MTAwJTtmbG9hdDpyaWdodH0uZGcgLmhhcy1zbGlkZXIgaW5wdXRbdHlwZT10ZXh0XXt3aWR0aDozMCU7bWFyZ2luLWxlZnQ6MH0uZGcgLnNsaWRlcntmbG9hdDpsZWZ0O3dpZHRoOjY2JTttYXJnaW4tbGVmdDotNXB4O21hcmdpbi1yaWdodDowO2hlaWdodDoxOXB4O21hcmdpbi10b3A6NHB4fS5kZyAuc2xpZGVyLWZne2hlaWdodDoxMDAlfS5kZyAuYyBpbnB1dFt0eXBlPWNoZWNrYm94XXttYXJnaW4tdG9wOjdweH0uZGcgLmMgc2VsZWN0e21hcmdpbi10b3A6NXB4fS5kZyAuY3IuZnVuY3Rpb24sLmRnIC5jci5mdW5jdGlvbiAucHJvcGVydHktbmFtZSwuZGcgLmNyLmZ1bmN0aW9uICosLmRnIC5jci5ib29sZWFuLC5kZyAuY3IuYm9vbGVhbiAqe2N1cnNvcjpwb2ludGVyfS5kZyAuY3IuY29sb3J7b3ZlcmZsb3c6dmlzaWJsZX0uZGcgLnNlbGVjdG9ye2Rpc3BsYXk6bm9uZTtwb3NpdGlvbjphYnNvbHV0ZTttYXJnaW4tbGVmdDotOXB4O21hcmdpbi10b3A6MjNweDt6LWluZGV4OjEwfS5kZyAuYzpob3ZlciAuc2VsZWN0b3IsLmRnIC5zZWxlY3Rvci5kcmFne2Rpc3BsYXk6YmxvY2t9LmRnIGxpLnNhdmUtcm93e3BhZGRpbmc6MH0uZGcgbGkuc2F2ZS1yb3cgLmJ1dHRvbntkaXNwbGF5OmlubGluZS1ibG9jaztwYWRkaW5nOjBweCA2cHh9LmRnLmRpYWxvZ3Vle2JhY2tncm91bmQtY29sb3I6IzIyMjt3aWR0aDo0NjBweDtwYWRkaW5nOjE1cHg7Zm9udC1zaXplOjEzcHg7bGluZS1oZWlnaHQ6MTVweH0jZGctbmV3LWNvbnN0cnVjdG9ye3BhZGRpbmc6MTBweDtjb2xvcjojMjIyO2ZvbnQtZmFtaWx5Ok1vbmFjbywgbW9ub3NwYWNlO2ZvbnQtc2l6ZToxMHB4O2JvcmRlcjowO3Jlc2l6ZTpub25lO2JveC1zaGFkb3c6aW5zZXQgMXB4IDFweCAxcHggIzg4ODt3b3JkLXdyYXA6YnJlYWstd29yZDttYXJnaW46MTJweCAwO2Rpc3BsYXk6YmxvY2s7d2lkdGg6NDQwcHg7b3ZlcmZsb3cteTpzY3JvbGw7aGVpZ2h0OjEwMHB4O3Bvc2l0aW9uOnJlbGF0aXZlfSNkZy1sb2NhbC1leHBsYWlue2Rpc3BsYXk6bm9uZTtmb250LXNpemU6MTFweDtsaW5lLWhlaWdodDoxN3B4O2JvcmRlci1yYWRpdXM6M3B4O2JhY2tncm91bmQtY29sb3I6IzMzMztwYWRkaW5nOjhweDttYXJnaW4tdG9wOjEwcHh9I2RnLWxvY2FsLWV4cGxhaW4gY29kZXtmb250LXNpemU6MTBweH0jZGF0LWd1aS1zYXZlLWxvY2FsbHl7ZGlzcGxheTpub25lfS5kZ3tjb2xvcjojZWVlO2ZvbnQ6MTFweCAnTHVjaWRhIEdyYW5kZScsIHNhbnMtc2VyaWY7dGV4dC1zaGFkb3c6MCAtMXB4IDAgIzExMX0uZGcubWFpbjo6LXdlYmtpdC1zY3JvbGxiYXJ7d2lkdGg6NXB4O2JhY2tncm91bmQ6IzFhMWExYX0uZGcubWFpbjo6LXdlYmtpdC1zY3JvbGxiYXItY29ybmVye2hlaWdodDowO2Rpc3BsYXk6bm9uZX0uZGcubWFpbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWJ7Ym9yZGVyLXJhZGl1czo1cHg7YmFja2dyb3VuZDojNjc2NzY3fS5kZyBsaTpub3QoLmZvbGRlcil7YmFja2dyb3VuZDojMWExYTFhO2JvcmRlci1ib3R0b206MXB4IHNvbGlkICMyYzJjMmN9LmRnIGxpLnNhdmUtcm93e2xpbmUtaGVpZ2h0OjI1cHg7YmFja2dyb3VuZDojZGFkNWNiO2JvcmRlcjowfS5kZyBsaS5zYXZlLXJvdyBzZWxlY3R7bWFyZ2luLWxlZnQ6NXB4O3dpZHRoOjEwOHB4fS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9ue21hcmdpbi1sZWZ0OjVweDttYXJnaW4tdG9wOjFweDtib3JkZXItcmFkaXVzOjJweDtmb250LXNpemU6OXB4O2xpbmUtaGVpZ2h0OjdweDtwYWRkaW5nOjRweCA0cHggNXB4IDRweDtiYWNrZ3JvdW5kOiNjNWJkYWQ7Y29sb3I6I2ZmZjt0ZXh0LXNoYWRvdzowIDFweCAwICNiMGE1OGY7Ym94LXNoYWRvdzowIC0xcHggMCAjYjBhNThmO2N1cnNvcjpwb2ludGVyfS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9uLmdlYXJze2JhY2tncm91bmQ6I2M1YmRhZCB1cmwoZGF0YTppbWFnZS9wbmc7YmFzZTY0LGlWQk9SdzBLR2dvQUFBQU5TVWhFVWdBQUFBc0FBQUFOQ0FZQUFBQi85WlE3QUFBQUdYUkZXSFJUYjJaMGQyRnlaUUJCWkc5aVpTQkpiV0ZuWlZKbFlXUjVjY2xsUEFBQUFRSkpSRUZVZU5waVlLQVUvUC8vUHdHSUMvQXBDQUJpQlNBVytJOEFDbEFjZ0t4UTRUOWhvTUFFVXJ4eDJRU0dONitlZ0RYKy92V1Q0ZTdOODJBTVlvUEF4L2V2d1dvWW9TWWJBQ1gyczdLeEN4emNzZXpEaDNldkZvREVCWVRFRXF5Y2dnV0F6QTlBdVVTUVFnZVlQYTlmUHY2L1lXbS9BY3g1SVBiN3R5L2Z3K1FaYmx3Njd2RHM4UjBZSHlRaGdPYngreUFKa0JxbUc1ZFBQRGgxYVBPR1IvZXVnVzBHNHZsSW9USWZ5RmNBK1Fla2hoSEpoUGRReGJpQUlndU1CVFFaclBENzEwOE02cm9XWURGUWlJQUF2NkFvdy8xYkZ3WGdpcytmMkxVQXlud29JYU5jejhYTngzRGw3TUVKVURHUXB4OWd0UThZQ3VlQitEMjZPRUNBQVFEYWR0N2U0NkQ0MlFBQUFBQkpSVTVFcmtKZ2dnPT0pIDJweCAxcHggbm8tcmVwZWF0O2hlaWdodDo3cHg7d2lkdGg6OHB4fS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9uOmhvdmVye2JhY2tncm91bmQtY29sb3I6I2JhYjE5ZTtib3gtc2hhZG93OjAgLTFweCAwICNiMGE1OGZ9LmRnIGxpLmZvbGRlcntib3JkZXItYm90dG9tOjB9LmRnIGxpLnRpdGxle3BhZGRpbmctbGVmdDoxNnB4O2JhY2tncm91bmQ6IzAwMCB1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQlFBRkFKRUFBUC8vLy9QejgvLy8vLy8vL3lINUJBRUFBQUlBTEFBQUFBQUZBQVVBQUFJSWxJK2hLZ0Z4b0NnQU93PT0pIDZweCAxMHB4IG5vLXJlcGVhdDtjdXJzb3I6cG9pbnRlcjtib3JkZXItYm90dG9tOjFweCBzb2xpZCByZ2JhKDI1NSwyNTUsMjU1LDAuMil9LmRnIC5jbG9zZWQgbGkudGl0bGV7YmFja2dyb3VuZC1pbWFnZTp1cmwoZGF0YTppbWFnZS9naWY7YmFzZTY0LFIwbEdPRGxoQlFBRkFKRUFBUC8vLy9QejgvLy8vLy8vL3lINUJBRUFBQUlBTEFBQUFBQUZBQVVBQUFJSWxHSVdxTUNiV0FFQU93PT0pfS5kZyAuY3IuYm9vbGVhbntib3JkZXItbGVmdDozcHggc29saWQgIzgwNjc4N30uZGcgLmNyLmNvbG9ye2JvcmRlci1sZWZ0OjNweCBzb2xpZH0uZGcgLmNyLmZ1bmN0aW9ue2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjZTYxZDVmfS5kZyAuY3IubnVtYmVye2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjMkZBMUQ2fS5kZyAuY3IubnVtYmVyIGlucHV0W3R5cGU9dGV4dF17Y29sb3I6IzJGQTFENn0uZGcgLmNyLnN0cmluZ3tib3JkZXItbGVmdDozcHggc29saWQgIzFlZDM2Zn0uZGcgLmNyLnN0cmluZyBpbnB1dFt0eXBlPXRleHRde2NvbG9yOiMxZWQzNmZ9LmRnIC5jci5mdW5jdGlvbjpob3ZlciwuZGcgLmNyLmJvb2xlYW46aG92ZXJ7YmFja2dyb3VuZDojMTExfS5kZyAuYyBpbnB1dFt0eXBlPXRleHRde2JhY2tncm91bmQ6IzMwMzAzMDtvdXRsaW5lOm5vbmV9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF06aG92ZXJ7YmFja2dyb3VuZDojM2MzYzNjfS5kZyAuYyBpbnB1dFt0eXBlPXRleHRdOmZvY3Vze2JhY2tncm91bmQ6IzQ5NDk0OTtjb2xvcjojZmZmfS5kZyAuYyAuc2xpZGVye2JhY2tncm91bmQ6IzMwMzAzMDtjdXJzb3I6ZXctcmVzaXplfS5kZyAuYyAuc2xpZGVyLWZne2JhY2tncm91bmQ6IzJGQTFENjttYXgtd2lkdGg6MTAwJX0uZGcgLmMgLnNsaWRlcjpob3ZlcntiYWNrZ3JvdW5kOiMzYzNjM2N9LmRnIC5jIC5zbGlkZXI6aG92ZXIgLnNsaWRlci1mZ3tiYWNrZ3JvdW5kOiM0NGFiZGF9XFxuXCIpO1xuXG5jc3MuaW5qZWN0KHN0eWxlU2hlZXQpO1xudmFyIENTU19OQU1FU1BBQ0UgPSAnZGcnO1xudmFyIEhJREVfS0VZX0NPREUgPSA3MjtcbnZhciBDTE9TRV9CVVRUT05fSEVJR0hUID0gMjA7XG52YXIgREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FID0gJ0RlZmF1bHQnO1xudmFyIFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgPSBmdW5jdGlvbiAoKSB7XG4gIHRyeSB7XG4gICAgcmV0dXJuICEhd2luZG93LmxvY2FsU3RvcmFnZTtcbiAgfSBjYXRjaCAoZSkge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufSgpO1xudmFyIFNBVkVfRElBTE9HVUUgPSB2b2lkIDA7XG52YXIgYXV0b1BsYWNlVmlyZ2luID0gdHJ1ZTtcbnZhciBhdXRvUGxhY2VDb250YWluZXIgPSB2b2lkIDA7XG52YXIgaGlkZSA9IGZhbHNlO1xudmFyIGhpZGVhYmxlR3VpcyA9IFtdO1xudmFyIEdVSSA9IGZ1bmN0aW9uIEdVSShwYXJzKSB7XG4gIHZhciBfdGhpcyA9IHRoaXM7XG4gIHZhciBwYXJhbXMgPSBwYXJzIHx8IHt9O1xuICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgdGhpcy5fX3VsID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgndWwnKTtcbiAgdGhpcy5kb21FbGVtZW50LmFwcGVuZENoaWxkKHRoaXMuX191bCk7XG4gIGRvbS5hZGRDbGFzcyh0aGlzLmRvbUVsZW1lbnQsIENTU19OQU1FU1BBQ0UpO1xuICB0aGlzLl9fZm9sZGVycyA9IHt9O1xuICB0aGlzLl9fY29udHJvbGxlcnMgPSBbXTtcbiAgdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzID0gW107XG4gIHRoaXMuX19yZW1lbWJlcmVkT2JqZWN0SW5kZWNlc1RvQ29udHJvbGxlcnMgPSBbXTtcbiAgdGhpcy5fX2xpc3RlbmluZyA9IFtdO1xuICBwYXJhbXMgPSBDb21tb24uZGVmYXVsdHMocGFyYW1zLCB7XG4gICAgY2xvc2VPblRvcDogZmFsc2UsXG4gICAgYXV0b1BsYWNlOiB0cnVlLFxuICAgIHdpZHRoOiBHVUkuREVGQVVMVF9XSURUSFxuICB9KTtcbiAgcGFyYW1zID0gQ29tbW9uLmRlZmF1bHRzKHBhcmFtcywge1xuICAgIHJlc2l6YWJsZTogcGFyYW1zLmF1dG9QbGFjZSxcbiAgICBoaWRlYWJsZTogcGFyYW1zLmF1dG9QbGFjZVxuICB9KTtcbiAgaWYgKCFDb21tb24uaXNVbmRlZmluZWQocGFyYW1zLmxvYWQpKSB7XG4gICAgaWYgKHBhcmFtcy5wcmVzZXQpIHtcbiAgICAgIHBhcmFtcy5sb2FkLnByZXNldCA9IHBhcmFtcy5wcmVzZXQ7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHBhcmFtcy5sb2FkID0geyBwcmVzZXQ6IERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSB9O1xuICB9XG4gIGlmIChDb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnBhcmVudCkgJiYgcGFyYW1zLmhpZGVhYmxlKSB7XG4gICAgaGlkZWFibGVHdWlzLnB1c2godGhpcyk7XG4gIH1cbiAgcGFyYW1zLnJlc2l6YWJsZSA9IENvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMucGFyZW50KSAmJiBwYXJhbXMucmVzaXphYmxlO1xuICBpZiAocGFyYW1zLmF1dG9QbGFjZSAmJiBDb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnNjcm9sbGFibGUpKSB7XG4gICAgcGFyYW1zLnNjcm9sbGFibGUgPSB0cnVlO1xuICB9XG4gIHZhciB1c2VMb2NhbFN0b3JhZ2UgPSBTVVBQT1JUU19MT0NBTF9TVE9SQUdFICYmIGxvY2FsU3RvcmFnZS5nZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2godGhpcywgJ2lzTG9jYWwnKSkgPT09ICd0cnVlJztcbiAgdmFyIHNhdmVUb0xvY2FsU3RvcmFnZSA9IHZvaWQgMDtcbiAgdmFyIHRpdGxlUm93ID0gdm9pZCAwO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydGllcyh0aGlzLFxuICB7XG4gICAgcGFyZW50OiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5wYXJlbnQ7XG4gICAgICB9XG4gICAgfSxcbiAgICBzY3JvbGxhYmxlOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5zY3JvbGxhYmxlO1xuICAgICAgfVxuICAgIH0sXG4gICAgYXV0b1BsYWNlOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5hdXRvUGxhY2U7XG4gICAgICB9XG4gICAgfSxcbiAgICBjbG9zZU9uVG9wOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5jbG9zZU9uVG9wO1xuICAgICAgfVxuICAgIH0sXG4gICAgcHJlc2V0OiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgaWYgKF90aGlzLnBhcmVudCkge1xuICAgICAgICAgIHJldHVybiBfdGhpcy5nZXRSb290KCkucHJlc2V0O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBwYXJhbXMubG9hZC5wcmVzZXQ7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgICAgX3RoaXMuZ2V0Um9vdCgpLnByZXNldCA9IHY7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcGFyYW1zLmxvYWQucHJlc2V0ID0gdjtcbiAgICAgICAgfVxuICAgICAgICBzZXRQcmVzZXRTZWxlY3RJbmRleCh0aGlzKTtcbiAgICAgICAgX3RoaXMucmV2ZXJ0KCk7XG4gICAgICB9XG4gICAgfSxcbiAgICB3aWR0aDoge1xuICAgICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICAgIHJldHVybiBwYXJhbXMud2lkdGg7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgICAgICBwYXJhbXMud2lkdGggPSB2O1xuICAgICAgICBzZXRXaWR0aChfdGhpcywgdik7XG4gICAgICB9XG4gICAgfSxcbiAgICBuYW1lOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5uYW1lO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKHYpIHtcbiAgICAgICAgcGFyYW1zLm5hbWUgPSB2O1xuICAgICAgICBpZiAodGl0bGVSb3cpIHtcbiAgICAgICAgICB0aXRsZVJvdy5pbm5lckhUTUwgPSBwYXJhbXMubmFtZTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0sXG4gICAgY2xvc2VkOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5jbG9zZWQ7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgICAgICBwYXJhbXMuY2xvc2VkID0gdjtcbiAgICAgICAgaWYgKHBhcmFtcy5jbG9zZWQpIHtcbiAgICAgICAgICBkb20uYWRkQ2xhc3MoX3RoaXMuX191bCwgR1VJLkNMQVNTX0NMT1NFRCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZG9tLnJlbW92ZUNsYXNzKF90aGlzLl9fdWwsIEdVSS5DTEFTU19DTE9TRUQpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMub25SZXNpemUoKTtcbiAgICAgICAgaWYgKF90aGlzLl9fY2xvc2VCdXR0b24pIHtcbiAgICAgICAgICBfdGhpcy5fX2Nsb3NlQnV0dG9uLmlubmVySFRNTCA9IHYgPyBHVUkuVEVYVF9PUEVOIDogR1VJLlRFWFRfQ0xPU0VEO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBsb2FkOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy5sb2FkO1xuICAgICAgfVxuICAgIH0sXG4gICAgdXNlTG9jYWxTdG9yYWdlOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHVzZUxvY2FsU3RvcmFnZTtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCQkMShib29sKSB7XG4gICAgICAgIGlmIChTVVBQT1JUU19MT0NBTF9TVE9SQUdFKSB7XG4gICAgICAgICAgdXNlTG9jYWxTdG9yYWdlID0gYm9vbDtcbiAgICAgICAgICBpZiAoYm9vbCkge1xuICAgICAgICAgICAgZG9tLmJpbmQod2luZG93LCAndW5sb2FkJywgc2F2ZVRvTG9jYWxTdG9yYWdlKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgZG9tLnVuYmluZCh3aW5kb3csICd1bmxvYWQnLCBzYXZlVG9Mb2NhbFN0b3JhZ2UpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKF90aGlzLCAnaXNMb2NhbCcpLCBib29sKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSk7XG4gIGlmIChDb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnBhcmVudCkpIHtcbiAgICB0aGlzLmNsb3NlZCA9IHBhcmFtcy5jbG9zZWQgfHwgZmFsc2U7XG4gICAgZG9tLmFkZENsYXNzKHRoaXMuZG9tRWxlbWVudCwgR1VJLkNMQVNTX01BSU4pO1xuICAgIGRvbS5tYWtlU2VsZWN0YWJsZSh0aGlzLmRvbUVsZW1lbnQsIGZhbHNlKTtcbiAgICBpZiAoU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSkge1xuICAgICAgaWYgKHVzZUxvY2FsU3RvcmFnZSkge1xuICAgICAgICBfdGhpcy51c2VMb2NhbFN0b3JhZ2UgPSB0cnVlO1xuICAgICAgICB2YXIgc2F2ZWRHdWkgPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKHRoaXMsICdndWknKSk7XG4gICAgICAgIGlmIChzYXZlZEd1aSkge1xuICAgICAgICAgIHBhcmFtcy5sb2FkID0gSlNPTi5wYXJzZShzYXZlZEd1aSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy5fX2Nsb3NlQnV0dG9uID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgdGhpcy5fX2Nsb3NlQnV0dG9uLmlubmVySFRNTCA9IEdVSS5URVhUX0NMT1NFRDtcbiAgICBkb20uYWRkQ2xhc3ModGhpcy5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfQ0xPU0VfQlVUVE9OKTtcbiAgICBpZiAocGFyYW1zLmNsb3NlT25Ub3ApIHtcbiAgICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19DTE9TRV9UT1ApO1xuICAgICAgdGhpcy5kb21FbGVtZW50Lmluc2VydEJlZm9yZSh0aGlzLl9fY2xvc2VCdXR0b24sIHRoaXMuZG9tRWxlbWVudC5jaGlsZE5vZGVzWzBdKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZG9tLmFkZENsYXNzKHRoaXMuX19jbG9zZUJ1dHRvbiwgR1VJLkNMQVNTX0NMT1NFX0JPVFRPTSk7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fX2Nsb3NlQnV0dG9uKTtcbiAgICB9XG4gICAgZG9tLmJpbmQodGhpcy5fX2Nsb3NlQnV0dG9uLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5jbG9zZWQgPSAhX3RoaXMuY2xvc2VkO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGlmIChwYXJhbXMuY2xvc2VkID09PSB1bmRlZmluZWQpIHtcbiAgICAgIHBhcmFtcy5jbG9zZWQgPSB0cnVlO1xuICAgIH1cbiAgICB2YXIgdGl0bGVSb3dOYW1lID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUocGFyYW1zLm5hbWUpO1xuICAgIGRvbS5hZGRDbGFzcyh0aXRsZVJvd05hbWUsICdjb250cm9sbGVyLW5hbWUnKTtcbiAgICB0aXRsZVJvdyA9IGFkZFJvdyhfdGhpcywgdGl0bGVSb3dOYW1lKTtcbiAgICB2YXIgb25DbGlja1RpdGxlID0gZnVuY3Rpb24gb25DbGlja1RpdGxlKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF90aGlzLmNsb3NlZCA9ICFfdGhpcy5jbG9zZWQ7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfTtcbiAgICBkb20uYWRkQ2xhc3ModGhpcy5fX3VsLCBHVUkuQ0xBU1NfQ0xPU0VEKTtcbiAgICBkb20uYWRkQ2xhc3ModGl0bGVSb3csICd0aXRsZScpO1xuICAgIGRvbS5iaW5kKHRpdGxlUm93LCAnY2xpY2snLCBvbkNsaWNrVGl0bGUpO1xuICAgIGlmICghcGFyYW1zLmNsb3NlZCkge1xuICAgICAgdGhpcy5jbG9zZWQgPSBmYWxzZTtcbiAgICB9XG4gIH1cbiAgaWYgKHBhcmFtcy5hdXRvUGxhY2UpIHtcbiAgICBpZiAoQ29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5wYXJlbnQpKSB7XG4gICAgICBpZiAoYXV0b1BsYWNlVmlyZ2luKSB7XG4gICAgICAgIGF1dG9QbGFjZUNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgICAgICBkb20uYWRkQ2xhc3MoYXV0b1BsYWNlQ29udGFpbmVyLCBDU1NfTkFNRVNQQUNFKTtcbiAgICAgICAgZG9tLmFkZENsYXNzKGF1dG9QbGFjZUNvbnRhaW5lciwgR1VJLkNMQVNTX0FVVE9fUExBQ0VfQ09OVEFJTkVSKTtcbiAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZChhdXRvUGxhY2VDb250YWluZXIpO1xuICAgICAgICBhdXRvUGxhY2VWaXJnaW4gPSBmYWxzZTtcbiAgICAgIH1cbiAgICAgIGF1dG9QbGFjZUNvbnRhaW5lci5hcHBlbmRDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xuICAgICAgZG9tLmFkZENsYXNzKHRoaXMuZG9tRWxlbWVudCwgR1VJLkNMQVNTX0FVVE9fUExBQ0UpO1xuICAgIH1cbiAgICBpZiAoIXRoaXMucGFyZW50KSB7XG4gICAgICBzZXRXaWR0aChfdGhpcywgcGFyYW1zLndpZHRoKTtcbiAgICB9XG4gIH1cbiAgdGhpcy5fX3Jlc2l6ZUhhbmRsZXIgPSBmdW5jdGlvbiAoKSB7XG4gICAgX3RoaXMub25SZXNpemVEZWJvdW5jZWQoKTtcbiAgfTtcbiAgZG9tLmJpbmQod2luZG93LCAncmVzaXplJywgdGhpcy5fX3Jlc2l6ZUhhbmRsZXIpO1xuICBkb20uYmluZCh0aGlzLl9fdWwsICd3ZWJraXRUcmFuc2l0aW9uRW5kJywgdGhpcy5fX3Jlc2l6ZUhhbmRsZXIpO1xuICBkb20uYmluZCh0aGlzLl9fdWwsICd0cmFuc2l0aW9uZW5kJywgdGhpcy5fX3Jlc2l6ZUhhbmRsZXIpO1xuICBkb20uYmluZCh0aGlzLl9fdWwsICdvVHJhbnNpdGlvbkVuZCcsIHRoaXMuX19yZXNpemVIYW5kbGVyKTtcbiAgdGhpcy5vblJlc2l6ZSgpO1xuICBpZiAocGFyYW1zLnJlc2l6YWJsZSkge1xuICAgIGFkZFJlc2l6ZUhhbmRsZSh0aGlzKTtcbiAgfVxuICBzYXZlVG9Mb2NhbFN0b3JhZ2UgPSBmdW5jdGlvbiBzYXZlVG9Mb2NhbFN0b3JhZ2UoKSB7XG4gICAgaWYgKFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaChfdGhpcywgJ2lzTG9jYWwnKSkgPT09ICd0cnVlJykge1xuICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaChfdGhpcywgJ2d1aScpLCBKU09OLnN0cmluZ2lmeShfdGhpcy5nZXRTYXZlT2JqZWN0KCkpKTtcbiAgICB9XG4gIH07XG4gIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlSWZQb3NzaWJsZSA9IHNhdmVUb0xvY2FsU3RvcmFnZTtcbiAgZnVuY3Rpb24gcmVzZXRXaWR0aCgpIHtcbiAgICB2YXIgcm9vdCA9IF90aGlzLmdldFJvb3QoKTtcbiAgICByb290LndpZHRoICs9IDE7XG4gICAgQ29tbW9uLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgIHJvb3Qud2lkdGggLT0gMTtcbiAgICB9KTtcbiAgfVxuICBpZiAoIXBhcmFtcy5wYXJlbnQpIHtcbiAgICByZXNldFdpZHRoKCk7XG4gIH1cbn07XG5HVUkudG9nZ2xlSGlkZSA9IGZ1bmN0aW9uICgpIHtcbiAgaGlkZSA9ICFoaWRlO1xuICBDb21tb24uZWFjaChoaWRlYWJsZUd1aXMsIGZ1bmN0aW9uIChndWkpIHtcbiAgICBndWkuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gaGlkZSA/ICdub25lJyA6ICcnO1xuICB9KTtcbn07XG5HVUkuQ0xBU1NfQVVUT19QTEFDRSA9ICdhJztcbkdVSS5DTEFTU19BVVRPX1BMQUNFX0NPTlRBSU5FUiA9ICdhYyc7XG5HVUkuQ0xBU1NfTUFJTiA9ICdtYWluJztcbkdVSS5DTEFTU19DT05UUk9MTEVSX1JPVyA9ICdjcic7XG5HVUkuQ0xBU1NfVE9PX1RBTEwgPSAndGFsbGVyLXRoYW4td2luZG93JztcbkdVSS5DTEFTU19DTE9TRUQgPSAnY2xvc2VkJztcbkdVSS5DTEFTU19DTE9TRV9CVVRUT04gPSAnY2xvc2UtYnV0dG9uJztcbkdVSS5DTEFTU19DTE9TRV9UT1AgPSAnY2xvc2UtdG9wJztcbkdVSS5DTEFTU19DTE9TRV9CT1RUT00gPSAnY2xvc2UtYm90dG9tJztcbkdVSS5DTEFTU19EUkFHID0gJ2RyYWcnO1xuR1VJLkRFRkFVTFRfV0lEVEggPSAyNDU7XG5HVUkuVEVYVF9DTE9TRUQgPSAnQ2xvc2UgQ29udHJvbHMnO1xuR1VJLlRFWFRfT1BFTiA9ICdPcGVuIENvbnRyb2xzJztcbkdVSS5fa2V5ZG93bkhhbmRsZXIgPSBmdW5jdGlvbiAoZSkge1xuICBpZiAoZG9jdW1lbnQuYWN0aXZlRWxlbWVudC50eXBlICE9PSAndGV4dCcgJiYgKGUud2hpY2ggPT09IEhJREVfS0VZX0NPREUgfHwgZS5rZXlDb2RlID09PSBISURFX0tFWV9DT0RFKSkge1xuICAgIEdVSS50b2dnbGVIaWRlKCk7XG4gIH1cbn07XG5kb20uYmluZCh3aW5kb3csICdrZXlkb3duJywgR1VJLl9rZXlkb3duSGFuZGxlciwgZmFsc2UpO1xuQ29tbW9uLmV4dGVuZChHVUkucHJvdG90eXBlLFxue1xuICBhZGQ6IGZ1bmN0aW9uIGFkZChvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgcmV0dXJuIF9hZGQodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSwge1xuICAgICAgZmFjdG9yeUFyZ3M6IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKGFyZ3VtZW50cywgMilcbiAgICB9KTtcbiAgfSxcbiAgYWRkQ29sb3I6IGZ1bmN0aW9uIGFkZENvbG9yKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICByZXR1cm4gX2FkZCh0aGlzLCBvYmplY3QsIHByb3BlcnR5LCB7XG4gICAgICBjb2xvcjogdHJ1ZVxuICAgIH0pO1xuICB9LFxuICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZShjb250cm9sbGVyKSB7XG4gICAgdGhpcy5fX3VsLnJlbW92ZUNoaWxkKGNvbnRyb2xsZXIuX19saSk7XG4gICAgdGhpcy5fX2NvbnRyb2xsZXJzLnNwbGljZSh0aGlzLl9fY29udHJvbGxlcnMuaW5kZXhPZihjb250cm9sbGVyKSwgMSk7XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBDb21tb24uZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMub25SZXNpemUoKTtcbiAgICB9KTtcbiAgfSxcbiAgZGVzdHJveTogZnVuY3Rpb24gZGVzdHJveSgpIHtcbiAgICBpZiAodGhpcy5wYXJlbnQpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignT25seSB0aGUgcm9vdCBHVUkgc2hvdWxkIGJlIHJlbW92ZWQgd2l0aCAuZGVzdHJveSgpLiAnICsgJ0ZvciBzdWJmb2xkZXJzLCB1c2UgZ3VpLnJlbW92ZUZvbGRlcihmb2xkZXIpIGluc3RlYWQuJyk7XG4gICAgfVxuICAgIGlmICh0aGlzLmF1dG9QbGFjZSkge1xuICAgICAgYXV0b1BsYWNlQ29udGFpbmVyLnJlbW92ZUNoaWxkKHRoaXMuZG9tRWxlbWVudCk7XG4gICAgfVxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgQ29tbW9uLmVhY2godGhpcy5fX2ZvbGRlcnMsIGZ1bmN0aW9uIChzdWJmb2xkZXIpIHtcbiAgICAgIF90aGlzLnJlbW92ZUZvbGRlcihzdWJmb2xkZXIpO1xuICAgIH0pO1xuICAgIGRvbS51bmJpbmQod2luZG93LCAna2V5ZG93bicsIEdVSS5fa2V5ZG93bkhhbmRsZXIsIGZhbHNlKTtcbiAgICByZW1vdmVMaXN0ZW5lcnModGhpcyk7XG4gIH0sXG4gIGFkZEZvbGRlcjogZnVuY3Rpb24gYWRkRm9sZGVyKG5hbWUpIHtcbiAgICBpZiAodGhpcy5fX2ZvbGRlcnNbbmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgYWxyZWFkeSBoYXZlIGEgZm9sZGVyIGluIHRoaXMgR1VJIGJ5IHRoZScgKyAnIG5hbWUgXCInICsgbmFtZSArICdcIicpO1xuICAgIH1cbiAgICB2YXIgbmV3R3VpUGFyYW1zID0geyBuYW1lOiBuYW1lLCBwYXJlbnQ6IHRoaXMgfTtcbiAgICBuZXdHdWlQYXJhbXMuYXV0b1BsYWNlID0gdGhpcy5hdXRvUGxhY2U7XG4gICAgaWYgKHRoaXMubG9hZCAmJlxuICAgIHRoaXMubG9hZC5mb2xkZXJzICYmXG4gICAgdGhpcy5sb2FkLmZvbGRlcnNbbmFtZV0pIHtcbiAgICAgIG5ld0d1aVBhcmFtcy5jbG9zZWQgPSB0aGlzLmxvYWQuZm9sZGVyc1tuYW1lXS5jbG9zZWQ7XG4gICAgICBuZXdHdWlQYXJhbXMubG9hZCA9IHRoaXMubG9hZC5mb2xkZXJzW25hbWVdO1xuICAgIH1cbiAgICB2YXIgZ3VpID0gbmV3IEdVSShuZXdHdWlQYXJhbXMpO1xuICAgIHRoaXMuX19mb2xkZXJzW25hbWVdID0gZ3VpO1xuICAgIHZhciBsaSA9IGFkZFJvdyh0aGlzLCBndWkuZG9tRWxlbWVudCk7XG4gICAgZG9tLmFkZENsYXNzKGxpLCAnZm9sZGVyJyk7XG4gICAgcmV0dXJuIGd1aTtcbiAgfSxcbiAgcmVtb3ZlRm9sZGVyOiBmdW5jdGlvbiByZW1vdmVGb2xkZXIoZm9sZGVyKSB7XG4gICAgdGhpcy5fX3VsLnJlbW92ZUNoaWxkKGZvbGRlci5kb21FbGVtZW50LnBhcmVudEVsZW1lbnQpO1xuICAgIGRlbGV0ZSB0aGlzLl9fZm9sZGVyc1tmb2xkZXIubmFtZV07XG4gICAgaWYgKHRoaXMubG9hZCAmJlxuICAgIHRoaXMubG9hZC5mb2xkZXJzICYmXG4gICAgdGhpcy5sb2FkLmZvbGRlcnNbZm9sZGVyLm5hbWVdKSB7XG4gICAgICBkZWxldGUgdGhpcy5sb2FkLmZvbGRlcnNbZm9sZGVyLm5hbWVdO1xuICAgIH1cbiAgICByZW1vdmVMaXN0ZW5lcnMoZm9sZGVyKTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIENvbW1vbi5lYWNoKGZvbGRlci5fX2ZvbGRlcnMsIGZ1bmN0aW9uIChzdWJmb2xkZXIpIHtcbiAgICAgIGZvbGRlci5yZW1vdmVGb2xkZXIoc3ViZm9sZGVyKTtcbiAgICB9KTtcbiAgICBDb21tb24uZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMub25SZXNpemUoKTtcbiAgICB9KTtcbiAgfSxcbiAgb3BlbjogZnVuY3Rpb24gb3BlbigpIHtcbiAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICB9LFxuICBjbG9zZTogZnVuY3Rpb24gY2xvc2UoKSB7XG4gICAgdGhpcy5jbG9zZWQgPSB0cnVlO1xuICB9LFxuICBoaWRlOiBmdW5jdGlvbiBoaWRlKCkge1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJ25vbmUnO1xuICB9LFxuICBzaG93OiBmdW5jdGlvbiBzaG93KCkge1xuICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5kaXNwbGF5ID0gJyc7XG4gIH0sXG4gIG9uUmVzaXplOiBmdW5jdGlvbiBvblJlc2l6ZSgpIHtcbiAgICB2YXIgcm9vdCA9IHRoaXMuZ2V0Um9vdCgpO1xuICAgIGlmIChyb290LnNjcm9sbGFibGUpIHtcbiAgICAgIHZhciB0b3AgPSBkb20uZ2V0T2Zmc2V0KHJvb3QuX191bCkudG9wO1xuICAgICAgdmFyIGggPSAwO1xuICAgICAgQ29tbW9uLmVhY2gocm9vdC5fX3VsLmNoaWxkTm9kZXMsIGZ1bmN0aW9uIChub2RlKSB7XG4gICAgICAgIGlmICghKHJvb3QuYXV0b1BsYWNlICYmIG5vZGUgPT09IHJvb3QuX19zYXZlX3JvdykpIHtcbiAgICAgICAgICBoICs9IGRvbS5nZXRIZWlnaHQobm9kZSk7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgICAgaWYgKHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcCAtIENMT1NFX0JVVFRPTl9IRUlHSFQgPCBoKSB7XG4gICAgICAgIGRvbS5hZGRDbGFzcyhyb290LmRvbUVsZW1lbnQsIEdVSS5DTEFTU19UT09fVEFMTCk7XG4gICAgICAgIHJvb3QuX191bC5zdHlsZS5oZWlnaHQgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLSB0b3AgLSBDTE9TRV9CVVRUT05fSEVJR0hUICsgJ3B4JztcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGRvbS5yZW1vdmVDbGFzcyhyb290LmRvbUVsZW1lbnQsIEdVSS5DTEFTU19UT09fVEFMTCk7XG4gICAgICAgIHJvb3QuX191bC5zdHlsZS5oZWlnaHQgPSAnYXV0byc7XG4gICAgICB9XG4gICAgfVxuICAgIGlmIChyb290Ll9fcmVzaXplX2hhbmRsZSkge1xuICAgICAgQ29tbW9uLmRlZmVyKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcm9vdC5fX3Jlc2l6ZV9oYW5kbGUuc3R5bGUuaGVpZ2h0ID0gcm9vdC5fX3VsLm9mZnNldEhlaWdodCArICdweCc7XG4gICAgICB9KTtcbiAgICB9XG4gICAgaWYgKHJvb3QuX19jbG9zZUJ1dHRvbikge1xuICAgICAgcm9vdC5fX2Nsb3NlQnV0dG9uLnN0eWxlLndpZHRoID0gcm9vdC53aWR0aCArICdweCc7XG4gICAgfVxuICB9LFxuICBvblJlc2l6ZURlYm91bmNlZDogQ29tbW9uLmRlYm91bmNlKGZ1bmN0aW9uICgpIHtcbiAgICB0aGlzLm9uUmVzaXplKCk7XG4gIH0sIDUwKSxcbiAgcmVtZW1iZXI6IGZ1bmN0aW9uIHJlbWVtYmVyKCkge1xuICAgIGlmIChDb21tb24uaXNVbmRlZmluZWQoU0FWRV9ESUFMT0dVRSkpIHtcbiAgICAgIFNBVkVfRElBTE9HVUUgPSBuZXcgQ2VudGVyZWREaXYoKTtcbiAgICAgIFNBVkVfRElBTE9HVUUuZG9tRWxlbWVudC5pbm5lckhUTUwgPSBzYXZlRGlhbG9nQ29udGVudHM7XG4gICAgfVxuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdZb3UgY2FuIG9ubHkgY2FsbCByZW1lbWJlciBvbiBhIHRvcCBsZXZlbCBHVUkuJyk7XG4gICAgfVxuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgQ29tbW9uLmVhY2goQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKSwgZnVuY3Rpb24gKG9iamVjdCkge1xuICAgICAgaWYgKF90aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGFkZFNhdmVNZW51KF90aGlzKTtcbiAgICAgIH1cbiAgICAgIGlmIChfdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzLmluZGV4T2Yob2JqZWN0KSA9PT0gLTEpIHtcbiAgICAgICAgX3RoaXMuX19yZW1lbWJlcmVkT2JqZWN0cy5wdXNoKG9iamVjdCk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgaWYgKHRoaXMuYXV0b1BsYWNlKSB7XG4gICAgICBzZXRXaWR0aCh0aGlzLCB0aGlzLndpZHRoKTtcbiAgICB9XG4gIH0sXG4gIGdldFJvb3Q6IGZ1bmN0aW9uIGdldFJvb3QoKSB7XG4gICAgdmFyIGd1aSA9IHRoaXM7XG4gICAgd2hpbGUgKGd1aS5wYXJlbnQpIHtcbiAgICAgIGd1aSA9IGd1aS5wYXJlbnQ7XG4gICAgfVxuICAgIHJldHVybiBndWk7XG4gIH0sXG4gIGdldFNhdmVPYmplY3Q6IGZ1bmN0aW9uIGdldFNhdmVPYmplY3QoKSB7XG4gICAgdmFyIHRvUmV0dXJuID0gdGhpcy5sb2FkO1xuICAgIHRvUmV0dXJuLmNsb3NlZCA9IHRoaXMuY2xvc2VkO1xuICAgIGlmICh0aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMubGVuZ3RoID4gMCkge1xuICAgICAgdG9SZXR1cm4ucHJlc2V0ID0gdGhpcy5wcmVzZXQ7XG4gICAgICBpZiAoIXRvUmV0dXJuLnJlbWVtYmVyZWQpIHtcbiAgICAgICAgdG9SZXR1cm4ucmVtZW1iZXJlZCA9IHt9O1xuICAgICAgfVxuICAgICAgdG9SZXR1cm4ucmVtZW1iZXJlZFt0aGlzLnByZXNldF0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMpO1xuICAgIH1cbiAgICB0b1JldHVybi5mb2xkZXJzID0ge307XG4gICAgQ29tbW9uLmVhY2godGhpcy5fX2ZvbGRlcnMsIGZ1bmN0aW9uIChlbGVtZW50LCBrZXkpIHtcbiAgICAgIHRvUmV0dXJuLmZvbGRlcnNba2V5XSA9IGVsZW1lbnQuZ2V0U2F2ZU9iamVjdCgpO1xuICAgIH0pO1xuICAgIHJldHVybiB0b1JldHVybjtcbiAgfSxcbiAgc2F2ZTogZnVuY3Rpb24gc2F2ZSgpIHtcbiAgICBpZiAoIXRoaXMubG9hZC5yZW1lbWJlcmVkKSB7XG4gICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZCA9IHt9O1xuICAgIH1cbiAgICB0aGlzLmxvYWQucmVtZW1iZXJlZFt0aGlzLnByZXNldF0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMpO1xuICAgIG1hcmtQcmVzZXRNb2RpZmllZCh0aGlzLCBmYWxzZSk7XG4gICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2VJZlBvc3NpYmxlKCk7XG4gIH0sXG4gIHNhdmVBczogZnVuY3Rpb24gc2F2ZUFzKHByZXNldE5hbWUpIHtcbiAgICBpZiAoIXRoaXMubG9hZC5yZW1lbWJlcmVkKSB7XG4gICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZCA9IHt9O1xuICAgICAgdGhpcy5sb2FkLnJlbWVtYmVyZWRbREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FXSA9IGdldEN1cnJlbnRQcmVzZXQodGhpcywgdHJ1ZSk7XG4gICAgfVxuICAgIHRoaXMubG9hZC5yZW1lbWJlcmVkW3ByZXNldE5hbWVdID0gZ2V0Q3VycmVudFByZXNldCh0aGlzKTtcbiAgICB0aGlzLnByZXNldCA9IHByZXNldE5hbWU7XG4gICAgYWRkUHJlc2V0T3B0aW9uKHRoaXMsIHByZXNldE5hbWUsIHRydWUpO1xuICAgIHRoaXMuc2F2ZVRvTG9jYWxTdG9yYWdlSWZQb3NzaWJsZSgpO1xuICB9LFxuICByZXZlcnQ6IGZ1bmN0aW9uIHJldmVydChndWkpIHtcbiAgICBDb21tb24uZWFjaCh0aGlzLl9fY29udHJvbGxlcnMsIGZ1bmN0aW9uIChjb250cm9sbGVyKSB7XG4gICAgICBpZiAoIXRoaXMuZ2V0Um9vdCgpLmxvYWQucmVtZW1iZXJlZCkge1xuICAgICAgICBjb250cm9sbGVyLnNldFZhbHVlKGNvbnRyb2xsZXIuaW5pdGlhbFZhbHVlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlY2FsbFNhdmVkVmFsdWUoZ3VpIHx8IHRoaXMuZ2V0Um9vdCgpLCBjb250cm9sbGVyKTtcbiAgICAgIH1cbiAgICAgIGlmIChjb250cm9sbGVyLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgY29udHJvbGxlci5fX29uRmluaXNoQ2hhbmdlLmNhbGwoY29udHJvbGxlciwgY29udHJvbGxlci5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9LCB0aGlzKTtcbiAgICBDb21tb24uZWFjaCh0aGlzLl9fZm9sZGVycywgZnVuY3Rpb24gKGZvbGRlcikge1xuICAgICAgZm9sZGVyLnJldmVydChmb2xkZXIpO1xuICAgIH0pO1xuICAgIGlmICghZ3VpKSB7XG4gICAgICBtYXJrUHJlc2V0TW9kaWZpZWQodGhpcy5nZXRSb290KCksIGZhbHNlKTtcbiAgICB9XG4gIH0sXG4gIGxpc3RlbjogZnVuY3Rpb24gbGlzdGVuKGNvbnRyb2xsZXIpIHtcbiAgICB2YXIgaW5pdCA9IHRoaXMuX19saXN0ZW5pbmcubGVuZ3RoID09PSAwO1xuICAgIHRoaXMuX19saXN0ZW5pbmcucHVzaChjb250cm9sbGVyKTtcbiAgICBpZiAoaW5pdCkge1xuICAgICAgdXBkYXRlRGlzcGxheXModGhpcy5fX2xpc3RlbmluZyk7XG4gICAgfVxuICB9LFxuICB1cGRhdGVEaXNwbGF5OiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuICAgIENvbW1vbi5lYWNoKHRoaXMuX19jb250cm9sbGVycywgZnVuY3Rpb24gKGNvbnRyb2xsZXIpIHtcbiAgICAgIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSgpO1xuICAgIH0pO1xuICAgIENvbW1vbi5lYWNoKHRoaXMuX19mb2xkZXJzLCBmdW5jdGlvbiAoZm9sZGVyKSB7XG4gICAgICBmb2xkZXIudXBkYXRlRGlzcGxheSgpO1xuICAgIH0pO1xuICB9XG59KTtcbmZ1bmN0aW9uIGFkZFJvdyhndWksIG5ld0RvbSwgbGlCZWZvcmUpIHtcbiAgdmFyIGxpID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgaWYgKG5ld0RvbSkge1xuICAgIGxpLmFwcGVuZENoaWxkKG5ld0RvbSk7XG4gIH1cbiAgaWYgKGxpQmVmb3JlKSB7XG4gICAgZ3VpLl9fdWwuaW5zZXJ0QmVmb3JlKGxpLCBsaUJlZm9yZSk7XG4gIH0gZWxzZSB7XG4gICAgZ3VpLl9fdWwuYXBwZW5kQ2hpbGQobGkpO1xuICB9XG4gIGd1aS5vblJlc2l6ZSgpO1xuICByZXR1cm4gbGk7XG59XG5mdW5jdGlvbiByZW1vdmVMaXN0ZW5lcnMoZ3VpKSB7XG4gIGRvbS51bmJpbmQod2luZG93LCAncmVzaXplJywgZ3VpLl9fcmVzaXplSGFuZGxlcik7XG4gIGlmIChndWkuc2F2ZVRvTG9jYWxTdG9yYWdlSWZQb3NzaWJsZSkge1xuICAgIGRvbS51bmJpbmQod2luZG93LCAndW5sb2FkJywgZ3VpLnNhdmVUb0xvY2FsU3RvcmFnZUlmUG9zc2libGUpO1xuICB9XG59XG5mdW5jdGlvbiBtYXJrUHJlc2V0TW9kaWZpZWQoZ3VpLCBtb2RpZmllZCkge1xuICB2YXIgb3B0ID0gZ3VpLl9fcHJlc2V0X3NlbGVjdFtndWkuX19wcmVzZXRfc2VsZWN0LnNlbGVjdGVkSW5kZXhdO1xuICBpZiAobW9kaWZpZWQpIHtcbiAgICBvcHQuaW5uZXJIVE1MID0gb3B0LnZhbHVlICsgJyonO1xuICB9IGVsc2Uge1xuICAgIG9wdC5pbm5lckhUTUwgPSBvcHQudmFsdWU7XG4gIH1cbn1cbmZ1bmN0aW9uIGF1Z21lbnRDb250cm9sbGVyKGd1aSwgbGksIGNvbnRyb2xsZXIpIHtcbiAgY29udHJvbGxlci5fX2xpID0gbGk7XG4gIGNvbnRyb2xsZXIuX19ndWkgPSBndWk7XG4gIENvbW1vbi5leHRlbmQoY29udHJvbGxlciwgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtcbiAgICBvcHRpb25zOiBmdW5jdGlvbiBvcHRpb25zKF9vcHRpb25zKSB7XG4gICAgICBpZiAoYXJndW1lbnRzLmxlbmd0aCA+IDEpIHtcbiAgICAgICAgdmFyIG5leHRTaWJsaW5nID0gY29udHJvbGxlci5fX2xpLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgY29udHJvbGxlci5yZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIF9hZGQoZ3VpLCBjb250cm9sbGVyLm9iamVjdCwgY29udHJvbGxlci5wcm9wZXJ0eSwge1xuICAgICAgICAgIGJlZm9yZTogbmV4dFNpYmxpbmcsXG4gICAgICAgICAgZmFjdG9yeUFyZ3M6IFtDb21tb24udG9BcnJheShhcmd1bWVudHMpXVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICAgIGlmIChDb21tb24uaXNBcnJheShfb3B0aW9ucykgfHwgQ29tbW9uLmlzT2JqZWN0KF9vcHRpb25zKSkge1xuICAgICAgICB2YXIgX25leHRTaWJsaW5nID0gY29udHJvbGxlci5fX2xpLm5leHRFbGVtZW50U2libGluZztcbiAgICAgICAgY29udHJvbGxlci5yZW1vdmUoKTtcbiAgICAgICAgcmV0dXJuIF9hZGQoZ3VpLCBjb250cm9sbGVyLm9iamVjdCwgY29udHJvbGxlci5wcm9wZXJ0eSwge1xuICAgICAgICAgIGJlZm9yZTogX25leHRTaWJsaW5nLFxuICAgICAgICAgIGZhY3RvcnlBcmdzOiBbX29wdGlvbnNdXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0sXG4gICAgbmFtZTogZnVuY3Rpb24gbmFtZShfbmFtZSkge1xuICAgICAgY29udHJvbGxlci5fX2xpLmZpcnN0RWxlbWVudENoaWxkLmZpcnN0RWxlbWVudENoaWxkLmlubmVySFRNTCA9IF9uYW1lO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfSxcbiAgICBsaXN0ZW46IGZ1bmN0aW9uIGxpc3RlbigpIHtcbiAgICAgIGNvbnRyb2xsZXIuX19ndWkubGlzdGVuKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfSxcbiAgICByZW1vdmU6IGZ1bmN0aW9uIHJlbW92ZSgpIHtcbiAgICAgIGNvbnRyb2xsZXIuX19ndWkucmVtb3ZlKGNvbnRyb2xsZXIpO1xuICAgICAgcmV0dXJuIGNvbnRyb2xsZXI7XG4gICAgfVxuICB9KTtcbiAgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBOdW1iZXJDb250cm9sbGVyU2xpZGVyKSB7XG4gICAgdmFyIGJveCA9IG5ldyBOdW1iZXJDb250cm9sbGVyQm94KGNvbnRyb2xsZXIub2JqZWN0LCBjb250cm9sbGVyLnByb3BlcnR5LCB7IG1pbjogY29udHJvbGxlci5fX21pbiwgbWF4OiBjb250cm9sbGVyLl9fbWF4LCBzdGVwOiBjb250cm9sbGVyLl9fc3RlcCB9KTtcbiAgICBDb21tb24uZWFjaChbJ3VwZGF0ZURpc3BsYXknLCAnb25DaGFuZ2UnLCAnb25GaW5pc2hDaGFuZ2UnLCAnc3RlcCcsICdtaW4nLCAnbWF4J10sIGZ1bmN0aW9uIChtZXRob2QpIHtcbiAgICAgIHZhciBwYyA9IGNvbnRyb2xsZXJbbWV0aG9kXTtcbiAgICAgIHZhciBwYiA9IGJveFttZXRob2RdO1xuICAgICAgY29udHJvbGxlclttZXRob2RdID0gYm94W21ldGhvZF0gPSBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciBhcmdzID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzKTtcbiAgICAgICAgcGIuYXBwbHkoYm94LCBhcmdzKTtcbiAgICAgICAgcmV0dXJuIHBjLmFwcGx5KGNvbnRyb2xsZXIsIGFyZ3MpO1xuICAgICAgfTtcbiAgICB9KTtcbiAgICBkb20uYWRkQ2xhc3MobGksICdoYXMtc2xpZGVyJyk7XG4gICAgY29udHJvbGxlci5kb21FbGVtZW50Lmluc2VydEJlZm9yZShib3guZG9tRWxlbWVudCwgY29udHJvbGxlci5kb21FbGVtZW50LmZpcnN0RWxlbWVudENoaWxkKTtcbiAgfSBlbHNlIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgTnVtYmVyQ29udHJvbGxlckJveCkge1xuICAgIHZhciByID0gZnVuY3Rpb24gcihyZXR1cm5lZCkge1xuICAgICAgaWYgKENvbW1vbi5pc051bWJlcihjb250cm9sbGVyLl9fbWluKSAmJiBDb21tb24uaXNOdW1iZXIoY29udHJvbGxlci5fX21heCkpIHtcbiAgICAgICAgdmFyIG9sZE5hbWUgPSBjb250cm9sbGVyLl9fbGkuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MO1xuICAgICAgICB2YXIgd2FzTGlzdGVuaW5nID0gY29udHJvbGxlci5fX2d1aS5fX2xpc3RlbmluZy5pbmRleE9mKGNvbnRyb2xsZXIpID4gLTE7XG4gICAgICAgIGNvbnRyb2xsZXIucmVtb3ZlKCk7XG4gICAgICAgIHZhciBuZXdDb250cm9sbGVyID0gX2FkZChndWksIGNvbnRyb2xsZXIub2JqZWN0LCBjb250cm9sbGVyLnByb3BlcnR5LCB7XG4gICAgICAgICAgYmVmb3JlOiBjb250cm9sbGVyLl9fbGkubmV4dEVsZW1lbnRTaWJsaW5nLFxuICAgICAgICAgIGZhY3RvcnlBcmdzOiBbY29udHJvbGxlci5fX21pbiwgY29udHJvbGxlci5fX21heCwgY29udHJvbGxlci5fX3N0ZXBdXG4gICAgICAgIH0pO1xuICAgICAgICBuZXdDb250cm9sbGVyLm5hbWUob2xkTmFtZSk7XG4gICAgICAgIGlmICh3YXNMaXN0ZW5pbmcpIG5ld0NvbnRyb2xsZXIubGlzdGVuKCk7XG4gICAgICAgIHJldHVybiBuZXdDb250cm9sbGVyO1xuICAgICAgfVxuICAgICAgcmV0dXJuIHJldHVybmVkO1xuICAgIH07XG4gICAgY29udHJvbGxlci5taW4gPSBDb21tb24uY29tcG9zZShyLCBjb250cm9sbGVyLm1pbik7XG4gICAgY29udHJvbGxlci5tYXggPSBDb21tb24uY29tcG9zZShyLCBjb250cm9sbGVyLm1heCk7XG4gIH0gZWxzZSBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIEJvb2xlYW5Db250cm9sbGVyKSB7XG4gICAgZG9tLmJpbmQobGksICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvbS5mYWtlRXZlbnQoY29udHJvbGxlci5fX2NoZWNrYm94LCAnY2xpY2snKTtcbiAgICB9KTtcbiAgICBkb20uYmluZChjb250cm9sbGVyLl9fY2hlY2tib3gsICdjbGljaycsIGZ1bmN0aW9uIChlKSB7XG4gICAgICBlLnN0b3BQcm9wYWdhdGlvbigpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBGdW5jdGlvbkNvbnRyb2xsZXIpIHtcbiAgICBkb20uYmluZChsaSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgZG9tLmZha2VFdmVudChjb250cm9sbGVyLl9fYnV0dG9uLCAnY2xpY2snKTtcbiAgICB9KTtcbiAgICBkb20uYmluZChsaSwgJ21vdXNlb3ZlcicsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGRvbS5hZGRDbGFzcyhjb250cm9sbGVyLl9fYnV0dG9uLCAnaG92ZXInKTtcbiAgICB9KTtcbiAgICBkb20uYmluZChsaSwgJ21vdXNlb3V0JywgZnVuY3Rpb24gKCkge1xuICAgICAgZG9tLnJlbW92ZUNsYXNzKGNvbnRyb2xsZXIuX19idXR0b24sICdob3ZlcicpO1xuICAgIH0pO1xuICB9IGVsc2UgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBDb2xvckNvbnRyb2xsZXIpIHtcbiAgICBkb20uYWRkQ2xhc3MobGksICdjb2xvcicpO1xuICAgIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSA9IENvbW1vbi5jb21wb3NlKGZ1bmN0aW9uICh2YWwpIHtcbiAgICAgIGxpLnN0eWxlLmJvcmRlckxlZnRDb2xvciA9IGNvbnRyb2xsZXIuX19jb2xvci50b1N0cmluZygpO1xuICAgICAgcmV0dXJuIHZhbDtcbiAgICB9LCBjb250cm9sbGVyLnVwZGF0ZURpc3BsYXkpO1xuICAgIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSgpO1xuICB9XG4gIGNvbnRyb2xsZXIuc2V0VmFsdWUgPSBDb21tb24uY29tcG9zZShmdW5jdGlvbiAodmFsKSB7XG4gICAgaWYgKGd1aS5nZXRSb290KCkuX19wcmVzZXRfc2VsZWN0ICYmIGNvbnRyb2xsZXIuaXNNb2RpZmllZCgpKSB7XG4gICAgICBtYXJrUHJlc2V0TW9kaWZpZWQoZ3VpLmdldFJvb3QoKSwgdHJ1ZSk7XG4gICAgfVxuICAgIHJldHVybiB2YWw7XG4gIH0sIGNvbnRyb2xsZXIuc2V0VmFsdWUpO1xufVxuZnVuY3Rpb24gcmVjYWxsU2F2ZWRWYWx1ZShndWksIGNvbnRyb2xsZXIpIHtcbiAgdmFyIHJvb3QgPSBndWkuZ2V0Um9vdCgpO1xuICB2YXIgbWF0Y2hlZEluZGV4ID0gcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RzLmluZGV4T2YoY29udHJvbGxlci5vYmplY3QpO1xuICBpZiAobWF0Y2hlZEluZGV4ICE9PSAtMSkge1xuICAgIHZhciBjb250cm9sbGVyTWFwID0gcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1ttYXRjaGVkSW5kZXhdO1xuICAgIGlmIChjb250cm9sbGVyTWFwID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnRyb2xsZXJNYXAgPSB7fTtcbiAgICAgIHJvb3QuX19yZW1lbWJlcmVkT2JqZWN0SW5kZWNlc1RvQ29udHJvbGxlcnNbbWF0Y2hlZEluZGV4XSA9IGNvbnRyb2xsZXJNYXA7XG4gICAgfVxuICAgIGNvbnRyb2xsZXJNYXBbY29udHJvbGxlci5wcm9wZXJ0eV0gPSBjb250cm9sbGVyO1xuICAgIGlmIChyb290LmxvYWQgJiYgcm9vdC5sb2FkLnJlbWVtYmVyZWQpIHtcbiAgICAgIHZhciBwcmVzZXRNYXAgPSByb290LmxvYWQucmVtZW1iZXJlZDtcbiAgICAgIHZhciBwcmVzZXQgPSB2b2lkIDA7XG4gICAgICBpZiAocHJlc2V0TWFwW2d1aS5wcmVzZXRdKSB7XG4gICAgICAgIHByZXNldCA9IHByZXNldE1hcFtndWkucHJlc2V0XTtcbiAgICAgIH0gZWxzZSBpZiAocHJlc2V0TWFwW0RFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRV0pIHtcbiAgICAgICAgcHJlc2V0ID0gcHJlc2V0TWFwW0RFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm47XG4gICAgICB9XG4gICAgICBpZiAocHJlc2V0W21hdGNoZWRJbmRleF0gJiYgcHJlc2V0W21hdGNoZWRJbmRleF1bY29udHJvbGxlci5wcm9wZXJ0eV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICB2YXIgdmFsdWUgPSBwcmVzZXRbbWF0Y2hlZEluZGV4XVtjb250cm9sbGVyLnByb3BlcnR5XTtcbiAgICAgICAgY29udHJvbGxlci5pbml0aWFsVmFsdWUgPSB2YWx1ZTtcbiAgICAgICAgY29udHJvbGxlci5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiBfYWRkKGd1aSwgb2JqZWN0LCBwcm9wZXJ0eSwgcGFyYW1zKSB7XG4gIGlmIChvYmplY3RbcHJvcGVydHldID09PSB1bmRlZmluZWQpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09iamVjdCBcIicgKyBvYmplY3QgKyAnXCIgaGFzIG5vIHByb3BlcnR5IFwiJyArIHByb3BlcnR5ICsgJ1wiJyk7XG4gIH1cbiAgdmFyIGNvbnRyb2xsZXIgPSB2b2lkIDA7XG4gIGlmIChwYXJhbXMuY29sb3IpIHtcbiAgICBjb250cm9sbGVyID0gbmV3IENvbG9yQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgfSBlbHNlIHtcbiAgICB2YXIgZmFjdG9yeUFyZ3MgPSBbb2JqZWN0LCBwcm9wZXJ0eV0uY29uY2F0KHBhcmFtcy5mYWN0b3J5QXJncyk7XG4gICAgY29udHJvbGxlciA9IENvbnRyb2xsZXJGYWN0b3J5LmFwcGx5KGd1aSwgZmFjdG9yeUFyZ3MpO1xuICB9XG4gIGlmIChwYXJhbXMuYmVmb3JlIGluc3RhbmNlb2YgQ29udHJvbGxlcikge1xuICAgIHBhcmFtcy5iZWZvcmUgPSBwYXJhbXMuYmVmb3JlLl9fbGk7XG4gIH1cbiAgcmVjYWxsU2F2ZWRWYWx1ZShndWksIGNvbnRyb2xsZXIpO1xuICBkb20uYWRkQ2xhc3MoY29udHJvbGxlci5kb21FbGVtZW50LCAnYycpO1xuICB2YXIgbmFtZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgZG9tLmFkZENsYXNzKG5hbWUsICdwcm9wZXJ0eS1uYW1lJyk7XG4gIG5hbWUuaW5uZXJIVE1MID0gY29udHJvbGxlci5wcm9wZXJ0eTtcbiAgdmFyIGNvbnRhaW5lciA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBjb250YWluZXIuYXBwZW5kQ2hpbGQobmFtZSk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChjb250cm9sbGVyLmRvbUVsZW1lbnQpO1xuICB2YXIgbGkgPSBhZGRSb3coZ3VpLCBjb250YWluZXIsIHBhcmFtcy5iZWZvcmUpO1xuICBkb20uYWRkQ2xhc3MobGksIEdVSS5DTEFTU19DT05UUk9MTEVSX1JPVyk7XG4gIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgQ29sb3JDb250cm9sbGVyKSB7XG4gICAgZG9tLmFkZENsYXNzKGxpLCAnY29sb3InKTtcbiAgfSBlbHNlIHtcbiAgICBkb20uYWRkQ2xhc3MobGksIF90eXBlb2YoY29udHJvbGxlci5nZXRWYWx1ZSgpKSk7XG4gIH1cbiAgYXVnbWVudENvbnRyb2xsZXIoZ3VpLCBsaSwgY29udHJvbGxlcik7XG4gIGd1aS5fX2NvbnRyb2xsZXJzLnB1c2goY29udHJvbGxlcik7XG4gIHJldHVybiBjb250cm9sbGVyO1xufVxuZnVuY3Rpb24gZ2V0TG9jYWxTdG9yYWdlSGFzaChndWksIGtleSkge1xuICByZXR1cm4gZG9jdW1lbnQubG9jYXRpb24uaHJlZiArICcuJyArIGtleTtcbn1cbmZ1bmN0aW9uIGFkZFByZXNldE9wdGlvbihndWksIG5hbWUsIHNldFNlbGVjdGVkKSB7XG4gIHZhciBvcHQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdvcHRpb24nKTtcbiAgb3B0LmlubmVySFRNTCA9IG5hbWU7XG4gIG9wdC52YWx1ZSA9IG5hbWU7XG4gIGd1aS5fX3ByZXNldF9zZWxlY3QuYXBwZW5kQ2hpbGQob3B0KTtcbiAgaWYgKHNldFNlbGVjdGVkKSB7XG4gICAgZ3VpLl9fcHJlc2V0X3NlbGVjdC5zZWxlY3RlZEluZGV4ID0gZ3VpLl9fcHJlc2V0X3NlbGVjdC5sZW5ndGggLSAxO1xuICB9XG59XG5mdW5jdGlvbiBzaG93SGlkZUV4cGxhaW4oZ3VpLCBleHBsYWluKSB7XG4gIGV4cGxhaW4uc3R5bGUuZGlzcGxheSA9IGd1aS51c2VMb2NhbFN0b3JhZ2UgPyAnYmxvY2snIDogJ25vbmUnO1xufVxuZnVuY3Rpb24gYWRkU2F2ZU1lbnUoZ3VpKSB7XG4gIHZhciBkaXYgPSBndWkuX19zYXZlX3JvdyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2xpJyk7XG4gIGRvbS5hZGRDbGFzcyhndWkuZG9tRWxlbWVudCwgJ2hhcy1zYXZlJyk7XG4gIGd1aS5fX3VsLmluc2VydEJlZm9yZShkaXYsIGd1aS5fX3VsLmZpcnN0Q2hpbGQpO1xuICBkb20uYWRkQ2xhc3MoZGl2LCAnc2F2ZS1yb3cnKTtcbiAgdmFyIGdlYXJzID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBnZWFycy5pbm5lckhUTUwgPSAnJm5ic3A7JztcbiAgZG9tLmFkZENsYXNzKGdlYXJzLCAnYnV0dG9uIGdlYXJzJyk7XG4gIHZhciBidXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGJ1dHRvbi5pbm5lckhUTUwgPSAnU2F2ZSc7XG4gIGRvbS5hZGRDbGFzcyhidXR0b24sICdidXR0b24nKTtcbiAgZG9tLmFkZENsYXNzKGJ1dHRvbiwgJ3NhdmUnKTtcbiAgdmFyIGJ1dHRvbjIgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGJ1dHRvbjIuaW5uZXJIVE1MID0gJ05ldyc7XG4gIGRvbS5hZGRDbGFzcyhidXR0b24yLCAnYnV0dG9uJyk7XG4gIGRvbS5hZGRDbGFzcyhidXR0b24yLCAnc2F2ZS1hcycpO1xuICB2YXIgYnV0dG9uMyA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgYnV0dG9uMy5pbm5lckhUTUwgPSAnUmV2ZXJ0JztcbiAgZG9tLmFkZENsYXNzKGJ1dHRvbjMsICdidXR0b24nKTtcbiAgZG9tLmFkZENsYXNzKGJ1dHRvbjMsICdyZXZlcnQnKTtcbiAgdmFyIHNlbGVjdCA9IGd1aS5fX3ByZXNldF9zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgaWYgKGd1aS5sb2FkICYmIGd1aS5sb2FkLnJlbWVtYmVyZWQpIHtcbiAgICBDb21tb24uZWFjaChndWkubG9hZC5yZW1lbWJlcmVkLCBmdW5jdGlvbiAodmFsdWUsIGtleSkge1xuICAgICAgYWRkUHJlc2V0T3B0aW9uKGd1aSwga2V5LCBrZXkgPT09IGd1aS5wcmVzZXQpO1xuICAgIH0pO1xuICB9IGVsc2Uge1xuICAgIGFkZFByZXNldE9wdGlvbihndWksIERFRkFVTFRfREVGQVVMVF9QUkVTRVRfTkFNRSwgZmFsc2UpO1xuICB9XG4gIGRvbS5iaW5kKHNlbGVjdCwgJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICBmb3IgKHZhciBpbmRleCA9IDA7IGluZGV4IDwgZ3VpLl9fcHJlc2V0X3NlbGVjdC5sZW5ndGg7IGluZGV4KyspIHtcbiAgICAgIGd1aS5fX3ByZXNldF9zZWxlY3RbaW5kZXhdLmlubmVySFRNTCA9IGd1aS5fX3ByZXNldF9zZWxlY3RbaW5kZXhdLnZhbHVlO1xuICAgIH1cbiAgICBndWkucHJlc2V0ID0gdGhpcy52YWx1ZTtcbiAgfSk7XG4gIGRpdi5hcHBlbmRDaGlsZChzZWxlY3QpO1xuICBkaXYuYXBwZW5kQ2hpbGQoZ2VhcnMpO1xuICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uKTtcbiAgZGl2LmFwcGVuZENoaWxkKGJ1dHRvbjIpO1xuICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uMyk7XG4gIGlmIChTVVBQT1JUU19MT0NBTF9TVE9SQUdFKSB7XG4gICAgdmFyIGV4cGxhaW4gPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGctbG9jYWwtZXhwbGFpbicpO1xuICAgIHZhciBsb2NhbFN0b3JhZ2VDaGVja0JveCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZy1sb2NhbC1zdG9yYWdlJyk7XG4gICAgdmFyIHNhdmVMb2NhbGx5ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RnLXNhdmUtbG9jYWxseScpO1xuICAgIHNhdmVMb2NhbGx5LnN0eWxlLmRpc3BsYXkgPSAnYmxvY2snO1xuICAgIGlmIChsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKGd1aSwgJ2lzTG9jYWwnKSkgPT09ICd0cnVlJykge1xuICAgICAgbG9jYWxTdG9yYWdlQ2hlY2tCb3guc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICB9XG4gICAgc2hvd0hpZGVFeHBsYWluKGd1aSwgZXhwbGFpbik7XG4gICAgZG9tLmJpbmQobG9jYWxTdG9yYWdlQ2hlY2tCb3gsICdjaGFuZ2UnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBndWkudXNlTG9jYWxTdG9yYWdlID0gIWd1aS51c2VMb2NhbFN0b3JhZ2U7XG4gICAgICBzaG93SGlkZUV4cGxhaW4oZ3VpLCBleHBsYWluKTtcbiAgICB9KTtcbiAgfVxuICB2YXIgbmV3Q29uc3RydWN0b3JUZXh0QXJlYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZy1uZXctY29uc3RydWN0b3InKTtcbiAgZG9tLmJpbmQobmV3Q29uc3RydWN0b3JUZXh0QXJlYSwgJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgIGlmIChlLm1ldGFLZXkgJiYgKGUud2hpY2ggPT09IDY3IHx8IGUua2V5Q29kZSA9PT0gNjcpKSB7XG4gICAgICBTQVZFX0RJQUxPR1VFLmhpZGUoKTtcbiAgICB9XG4gIH0pO1xuICBkb20uYmluZChnZWFycywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIG5ld0NvbnN0cnVjdG9yVGV4dEFyZWEuaW5uZXJIVE1MID0gSlNPTi5zdHJpbmdpZnkoZ3VpLmdldFNhdmVPYmplY3QoKSwgdW5kZWZpbmVkLCAyKTtcbiAgICBTQVZFX0RJQUxPR1VFLnNob3coKTtcbiAgICBuZXdDb25zdHJ1Y3RvclRleHRBcmVhLmZvY3VzKCk7XG4gICAgbmV3Q29uc3RydWN0b3JUZXh0QXJlYS5zZWxlY3QoKTtcbiAgfSk7XG4gIGRvbS5iaW5kKGJ1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGd1aS5zYXZlKCk7XG4gIH0pO1xuICBkb20uYmluZChidXR0b24yLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByZXNldE5hbWUgPSBwcm9tcHQoJ0VudGVyIGEgbmV3IHByZXNldCBuYW1lLicpO1xuICAgIGlmIChwcmVzZXROYW1lKSB7XG4gICAgICBndWkuc2F2ZUFzKHByZXNldE5hbWUpO1xuICAgIH1cbiAgfSk7XG4gIGRvbS5iaW5kKGJ1dHRvbjMsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICBndWkucmV2ZXJ0KCk7XG4gIH0pO1xufVxuZnVuY3Rpb24gYWRkUmVzaXplSGFuZGxlKGd1aSkge1xuICB2YXIgcG1vdXNlWCA9IHZvaWQgMDtcbiAgZ3VpLl9fcmVzaXplX2hhbmRsZSA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICBDb21tb24uZXh0ZW5kKGd1aS5fX3Jlc2l6ZV9oYW5kbGUuc3R5bGUsIHtcbiAgICB3aWR0aDogJzZweCcsXG4gICAgbWFyZ2luTGVmdDogJy0zcHgnLFxuICAgIGhlaWdodDogJzIwMHB4JyxcbiAgICBjdXJzb3I6ICdldy1yZXNpemUnLFxuICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnXG4gIH0pO1xuICBmdW5jdGlvbiBkcmFnKGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgZ3VpLndpZHRoICs9IHBtb3VzZVggLSBlLmNsaWVudFg7XG4gICAgZ3VpLm9uUmVzaXplKCk7XG4gICAgcG1vdXNlWCA9IGUuY2xpZW50WDtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgZnVuY3Rpb24gZHJhZ1N0b3AoKSB7XG4gICAgZG9tLnJlbW92ZUNsYXNzKGd1aS5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfRFJBRyk7XG4gICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBkcmFnKTtcbiAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBkcmFnU3RvcCk7XG4gIH1cbiAgZnVuY3Rpb24gZHJhZ1N0YXJ0KGUpIHtcbiAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgcG1vdXNlWCA9IGUuY2xpZW50WDtcbiAgICBkb20uYWRkQ2xhc3MoZ3VpLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19EUkFHKTtcbiAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBkcmFnKTtcbiAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgZHJhZ1N0b3ApO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBkb20uYmluZChndWkuX19yZXNpemVfaGFuZGxlLCAnbW91c2Vkb3duJywgZHJhZ1N0YXJ0KTtcbiAgZG9tLmJpbmQoZ3VpLl9fY2xvc2VCdXR0b24sICdtb3VzZWRvd24nLCBkcmFnU3RhcnQpO1xuICBndWkuZG9tRWxlbWVudC5pbnNlcnRCZWZvcmUoZ3VpLl9fcmVzaXplX2hhbmRsZSwgZ3VpLmRvbUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpO1xufVxuZnVuY3Rpb24gc2V0V2lkdGgoZ3VpLCB3KSB7XG4gIGd1aS5kb21FbGVtZW50LnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gIGlmIChndWkuX19zYXZlX3JvdyAmJiBndWkuYXV0b1BsYWNlKSB7XG4gICAgZ3VpLl9fc2F2ZV9yb3cuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgfVxuICBpZiAoZ3VpLl9fY2xvc2VCdXR0b24pIHtcbiAgICBndWkuX19jbG9zZUJ1dHRvbi5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuICB9XG59XG5mdW5jdGlvbiBnZXRDdXJyZW50UHJlc2V0KGd1aSwgdXNlSW5pdGlhbFZhbHVlcykge1xuICB2YXIgdG9SZXR1cm4gPSB7fTtcbiAgQ29tbW9uLmVhY2goZ3VpLl9fcmVtZW1iZXJlZE9iamVjdHMsIGZ1bmN0aW9uICh2YWwsIGluZGV4KSB7XG4gICAgdmFyIHNhdmVkVmFsdWVzID0ge307XG4gICAgdmFyIGNvbnRyb2xsZXJNYXAgPSBndWkuX19yZW1lbWJlcmVkT2JqZWN0SW5kZWNlc1RvQ29udHJvbGxlcnNbaW5kZXhdO1xuICAgIENvbW1vbi5lYWNoKGNvbnRyb2xsZXJNYXAsIGZ1bmN0aW9uIChjb250cm9sbGVyLCBwcm9wZXJ0eSkge1xuICAgICAgc2F2ZWRWYWx1ZXNbcHJvcGVydHldID0gdXNlSW5pdGlhbFZhbHVlcyA/IGNvbnRyb2xsZXIuaW5pdGlhbFZhbHVlIDogY29udHJvbGxlci5nZXRWYWx1ZSgpO1xuICAgIH0pO1xuICAgIHRvUmV0dXJuW2luZGV4XSA9IHNhdmVkVmFsdWVzO1xuICB9KTtcbiAgcmV0dXJuIHRvUmV0dXJuO1xufVxuZnVuY3Rpb24gc2V0UHJlc2V0U2VsZWN0SW5kZXgoZ3VpKSB7XG4gIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBndWkuX19wcmVzZXRfc2VsZWN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgIGlmIChndWkuX19wcmVzZXRfc2VsZWN0W2luZGV4XS52YWx1ZSA9PT0gZ3VpLnByZXNldCkge1xuICAgICAgZ3VpLl9fcHJlc2V0X3NlbGVjdC5zZWxlY3RlZEluZGV4ID0gaW5kZXg7XG4gICAgfVxuICB9XG59XG5mdW5jdGlvbiB1cGRhdGVEaXNwbGF5cyhjb250cm9sbGVyQXJyYXkpIHtcbiAgaWYgKGNvbnRyb2xsZXJBcnJheS5sZW5ndGggIT09IDApIHtcbiAgICByZXF1ZXN0QW5pbWF0aW9uRnJhbWUkMS5jYWxsKHdpbmRvdywgZnVuY3Rpb24gKCkge1xuICAgICAgdXBkYXRlRGlzcGxheXMoY29udHJvbGxlckFycmF5KTtcbiAgICB9KTtcbiAgfVxuICBDb21tb24uZWFjaChjb250cm9sbGVyQXJyYXksIGZ1bmN0aW9uIChjKSB7XG4gICAgYy51cGRhdGVEaXNwbGF5KCk7XG4gIH0pO1xufVxuXG52YXIgY29sb3IgPSB7XG4gIENvbG9yOiBDb2xvcixcbiAgbWF0aDogQ29sb3JNYXRoLFxuICBpbnRlcnByZXQ6IGludGVycHJldFxufTtcbnZhciBjb250cm9sbGVycyA9IHtcbiAgQ29udHJvbGxlcjogQ29udHJvbGxlcixcbiAgQm9vbGVhbkNvbnRyb2xsZXI6IEJvb2xlYW5Db250cm9sbGVyLFxuICBPcHRpb25Db250cm9sbGVyOiBPcHRpb25Db250cm9sbGVyLFxuICBTdHJpbmdDb250cm9sbGVyOiBTdHJpbmdDb250cm9sbGVyLFxuICBOdW1iZXJDb250cm9sbGVyOiBOdW1iZXJDb250cm9sbGVyLFxuICBOdW1iZXJDb250cm9sbGVyQm94OiBOdW1iZXJDb250cm9sbGVyQm94LFxuICBOdW1iZXJDb250cm9sbGVyU2xpZGVyOiBOdW1iZXJDb250cm9sbGVyU2xpZGVyLFxuICBGdW5jdGlvbkNvbnRyb2xsZXI6IEZ1bmN0aW9uQ29udHJvbGxlcixcbiAgQ29sb3JDb250cm9sbGVyOiBDb2xvckNvbnRyb2xsZXJcbn07XG52YXIgZG9tJDEgPSB7IGRvbTogZG9tIH07XG52YXIgZ3VpID0geyBHVUk6IEdVSSB9O1xudmFyIEdVSSQxID0gR1VJO1xudmFyIGluZGV4ID0ge1xuICBjb2xvcjogY29sb3IsXG4gIGNvbnRyb2xsZXJzOiBjb250cm9sbGVycyxcbiAgZG9tOiBkb20kMSxcbiAgZ3VpOiBndWksXG4gIEdVSTogR1VJJDFcbn07XG5cbmV4cG9ydHMuY29sb3IgPSBjb2xvcjtcbmV4cG9ydHMuY29udHJvbGxlcnMgPSBjb250cm9sbGVycztcbmV4cG9ydHMuZG9tID0gZG9tJDE7XG5leHBvcnRzLmd1aSA9IGd1aTtcbmV4cG9ydHMuR1VJID0gR1VJJDE7XG5leHBvcnRzWydkZWZhdWx0J10gPSBpbmRleDtcblxuT2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcblxufSkpKTtcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdC5ndWkuanMubWFwXG4iLCIvKiBpbnRlcmFjdC5qcyAxLjkuOCB8IGh0dHBzOi8vcmF3LmdpdGh1Yi5jb20vdGF5ZS9pbnRlcmFjdC5qcy9tYXN0ZXIvTElDRU5TRSAqL1xuIWZ1bmN0aW9uKHQpe2lmKFwib2JqZWN0XCI9PXR5cGVvZiBleHBvcnRzJiZcInVuZGVmaW5lZFwiIT10eXBlb2YgbW9kdWxlKW1vZHVsZS5leHBvcnRzPXQoKTtlbHNlIGlmKFwiZnVuY3Rpb25cIj09dHlwZW9mIGRlZmluZSYmZGVmaW5lLmFtZClkZWZpbmUoW10sdCk7ZWxzZXsoXCJ1bmRlZmluZWRcIiE9dHlwZW9mIHdpbmRvdz93aW5kb3c6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIGdsb2JhbD9nbG9iYWw6XCJ1bmRlZmluZWRcIiE9dHlwZW9mIHNlbGY/c2VsZjp0aGlzKS5pbnRlcmFjdD10KCl9fShmdW5jdGlvbigpe2Z1bmN0aW9uIHQoZSl7dmFyIG47cmV0dXJuIGZ1bmN0aW9uKHQpe3JldHVybiBufHxlKG49e2V4cG9ydHM6e30scGFyZW50OnR9LG4uZXhwb3J0cyksbi5leHBvcnRzfX12YXIgaz10KGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYSh0KXtyZXR1cm4oYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5kZWZhdWx0PWUuSW50ZXJhY3RhYmxlPXZvaWQgMDt2YXIgdT1yKFMpLGw9bihDKSxzPW4oViksYz1uKGN0KSxmPXIodykscD1uKGZ0KSxpPW4oYnQpLGQ9bSh7fSk7ZnVuY3Rpb24gbih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gdigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIHY9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiByKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PWEodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9digpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIG8odCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIHkodCxlLG4pe3JldHVybiBlJiZvKHQucHJvdG90eXBlLGUpLG4mJm8odCxuKSx0fWZ1bmN0aW9uIGgodCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBnPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbyh0LGUsbixyKXshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLG8pLHRoaXMuX3Njb3BlRXZlbnRzPXIsaCh0aGlzLFwib3B0aW9uc1wiLHZvaWQgMCksaCh0aGlzLFwiX2FjdGlvbnNcIix2b2lkIDApLGgodGhpcyxcInRhcmdldFwiLHZvaWQgMCksaCh0aGlzLFwiZXZlbnRzXCIsbmV3IGkuZGVmYXVsdCksaCh0aGlzLFwiX2NvbnRleHRcIix2b2lkIDApLGgodGhpcyxcIl93aW5cIix2b2lkIDApLGgodGhpcyxcIl9kb2NcIix2b2lkIDApLHRoaXMuX2FjdGlvbnM9ZS5hY3Rpb25zLHRoaXMudGFyZ2V0PXQsdGhpcy5fY29udGV4dD1lLmNvbnRleHR8fG4sdGhpcy5fd2luPSgwLE8uZ2V0V2luZG93KSgoMCwkLnRyeVNlbGVjdG9yKSh0KT90aGlzLl9jb250ZXh0OnQpLHRoaXMuX2RvYz10aGlzLl93aW4uZG9jdW1lbnQsdGhpcy5zZXQoZSl9cmV0dXJuIHkobyxbe2tleTpcIl9kZWZhdWx0c1wiLGdldDpmdW5jdGlvbigpe3JldHVybntiYXNlOnt9LHBlckFjdGlvbjp7fSxhY3Rpb25zOnt9fX19XSkseShvLFt7a2V5Olwic2V0T25FdmVudHNcIix2YWx1ZTpmdW5jdGlvbih0LGUpe3JldHVybiBmLmZ1bmMoZS5vbnN0YXJ0KSYmdGhpcy5vbihcIlwiLmNvbmNhdCh0LFwic3RhcnRcIiksZS5vbnN0YXJ0KSxmLmZ1bmMoZS5vbm1vdmUpJiZ0aGlzLm9uKFwiXCIuY29uY2F0KHQsXCJtb3ZlXCIpLGUub25tb3ZlKSxmLmZ1bmMoZS5vbmVuZCkmJnRoaXMub24oXCJcIi5jb25jYXQodCxcImVuZFwiKSxlLm9uZW5kKSxmLmZ1bmMoZS5vbmluZXJ0aWFzdGFydCkmJnRoaXMub24oXCJcIi5jb25jYXQodCxcImluZXJ0aWFzdGFydFwiKSxlLm9uaW5lcnRpYXN0YXJ0KSx0aGlzfX0se2tleTpcInVwZGF0ZVBlckFjdGlvbkxpc3RlbmVyc1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXsoZi5hcnJheShlKXx8Zi5vYmplY3QoZSkpJiZ0aGlzLm9mZih0LGUpLChmLmFycmF5KG4pfHxmLm9iamVjdChuKSkmJnRoaXMub24odCxuKX19LHtrZXk6XCJzZXRQZXJBY3Rpb25cIix2YWx1ZTpmdW5jdGlvbih0LGUpe3ZhciBuPXRoaXMuX2RlZmF1bHRzO2Zvcih2YXIgciBpbiBlKXt2YXIgbz1yLGk9dGhpcy5vcHRpb25zW3RdLGE9ZVtvXTtcImxpc3RlbmVyc1wiPT09byYmdGhpcy51cGRhdGVQZXJBY3Rpb25MaXN0ZW5lcnModCxpLmxpc3RlbmVycyxhKSxmLmFycmF5KGEpP2lbb109dS5mcm9tKGEpOmYucGxhaW5PYmplY3QoYSk/KGlbb109KDAsYy5kZWZhdWx0KShpW29dfHx7fSwoMCxzLmRlZmF1bHQpKGEpKSxmLm9iamVjdChuLnBlckFjdGlvbltvXSkmJlwiZW5hYmxlZFwiaW4gbi5wZXJBY3Rpb25bb10mJihpW29dLmVuYWJsZWQ9ITEhPT1hLmVuYWJsZWQpKTpmLmJvb2woYSkmJmYub2JqZWN0KG4ucGVyQWN0aW9uW29dKT9pW29dLmVuYWJsZWQ9YTppW29dPWF9fX0se2tleTpcImdldFJlY3RcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdD10fHwoZi5lbGVtZW50KHRoaXMudGFyZ2V0KT90aGlzLnRhcmdldDpudWxsKSxmLnN0cmluZyh0aGlzLnRhcmdldCkmJih0PXR8fHRoaXMuX2NvbnRleHQucXVlcnlTZWxlY3Rvcih0aGlzLnRhcmdldCkpLCgwLCQuZ2V0RWxlbWVudFJlY3QpKHQpfX0se2tleTpcInJlY3RDaGVja2VyXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIGYuZnVuYyh0KT8odGhpcy5nZXRSZWN0PXQsdGhpcyk6bnVsbD09PXQ/KGRlbGV0ZSB0aGlzLmdldFJlY3QsdGhpcyk6dGhpcy5nZXRSZWN0fX0se2tleTpcIl9iYWNrQ29tcGF0T3B0aW9uXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtpZigoMCwkLnRyeVNlbGVjdG9yKShlKXx8Zi5vYmplY3QoZSkpe2Zvcih2YXIgbiBpbiB0aGlzLm9wdGlvbnNbdF09ZSx0aGlzLl9hY3Rpb25zLm1hcCl0aGlzLm9wdGlvbnNbbl1bdF09ZTtyZXR1cm4gdGhpc31yZXR1cm4gdGhpcy5vcHRpb25zW3RdfX0se2tleTpcIm9yaWdpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9iYWNrQ29tcGF0T3B0aW9uKFwib3JpZ2luXCIsdCl9fSx7a2V5OlwiZGVsdGFTb3VyY2VcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm5cInBhZ2VcIj09PXR8fFwiY2xpZW50XCI9PT10Pyh0aGlzLm9wdGlvbnMuZGVsdGFTb3VyY2U9dCx0aGlzKTp0aGlzLm9wdGlvbnMuZGVsdGFTb3VyY2V9fSx7a2V5OlwiY29udGV4dFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2NvbnRleHR9fSx7a2V5OlwiaW5Db250ZXh0XCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2NvbnRleHQ9PT10Lm93bmVyRG9jdW1lbnR8fCgwLCQubm9kZUNvbnRhaW5zKSh0aGlzLl9jb250ZXh0LHQpfX0se2tleTpcInRlc3RJZ25vcmVBbGxvd1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4hdGhpcy50ZXN0SWdub3JlKHQuaWdub3JlRnJvbSxlLG4pJiZ0aGlzLnRlc3RBbGxvdyh0LmFsbG93RnJvbSxlLG4pfX0se2tleTpcInRlc3RBbGxvd1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4hdHx8ISFmLmVsZW1lbnQobikmJihmLnN0cmluZyh0KT8oMCwkLm1hdGNoZXNVcFRvKShuLHQsZSk6ISFmLmVsZW1lbnQodCkmJigwLCQubm9kZUNvbnRhaW5zKSh0LG4pKX19LHtrZXk6XCJ0ZXN0SWdub3JlXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3JldHVybiEoIXR8fCFmLmVsZW1lbnQobikpJiYoZi5zdHJpbmcodCk/KDAsJC5tYXRjaGVzVXBUbykobix0LGUpOiEhZi5lbGVtZW50KHQpJiYoMCwkLm5vZGVDb250YWlucykodCxuKSl9fSx7a2V5OlwiZmlyZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmV2ZW50cy5maXJlKHQpLHRoaXN9fSx7a2V5OlwiX29uT2ZmXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4scil7Zi5vYmplY3QoZSkmJiFmLmFycmF5KGUpJiYocj1uLG49bnVsbCk7dmFyIG89XCJvblwiPT09dD9cImFkZFwiOlwicmVtb3ZlXCIsaT0oMCxwLmRlZmF1bHQpKGUsbik7Zm9yKHZhciBhIGluIGkpe1wid2hlZWxcIj09PWEmJihhPWwuZGVmYXVsdC53aGVlbEV2ZW50KTtmb3IodmFyIHU9MDt1PGlbYV0ubGVuZ3RoO3UrKyl7dmFyIHM9aVthXVt1XTsoMCxkLmlzTm9uTmF0aXZlRXZlbnQpKGEsdGhpcy5fYWN0aW9ucyk/dGhpcy5ldmVudHNbdF0oYSxzKTpmLnN0cmluZyh0aGlzLnRhcmdldCk/dGhpcy5fc2NvcGVFdmVudHNbXCJcIi5jb25jYXQobyxcIkRlbGVnYXRlXCIpXSh0aGlzLnRhcmdldCx0aGlzLl9jb250ZXh0LGEscyxyKTp0aGlzLl9zY29wZUV2ZW50c1tvXSh0aGlzLnRhcmdldCxhLHMscil9fXJldHVybiB0aGlzfX0se2tleTpcIm9uXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3JldHVybiB0aGlzLl9vbk9mZihcIm9uXCIsdCxlLG4pfX0se2tleTpcIm9mZlwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4gdGhpcy5fb25PZmYoXCJvZmZcIix0LGUsbil9fSx7a2V5Olwic2V0XCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5fZGVmYXVsdHM7Zm9yKHZhciBuIGluIGYub2JqZWN0KHQpfHwodD17fSksdGhpcy5vcHRpb25zPSgwLHMuZGVmYXVsdCkoZS5iYXNlKSx0aGlzLl9hY3Rpb25zLm1ldGhvZERpY3Qpe3ZhciByPW4sbz10aGlzLl9hY3Rpb25zLm1ldGhvZERpY3Rbcl07dGhpcy5vcHRpb25zW3JdPXt9LHRoaXMuc2V0UGVyQWN0aW9uKHIsKDAsYy5kZWZhdWx0KSgoMCxjLmRlZmF1bHQpKHt9LGUucGVyQWN0aW9uKSxlLmFjdGlvbnNbcl0pKSx0aGlzW29dKHRbcl0pfWZvcih2YXIgaSBpbiB0KWYuZnVuYyh0aGlzW2ldKSYmdGhpc1tpXSh0W2ldKTtyZXR1cm4gdGhpc319LHtrZXk6XCJ1bnNldFwiLHZhbHVlOmZ1bmN0aW9uKCl7aWYoZi5zdHJpbmcodGhpcy50YXJnZXQpKWZvcih2YXIgdCBpbiB0aGlzLl9zY29wZUV2ZW50cy5kZWxlZ2F0ZWRFdmVudHMpZm9yKHZhciBlPXRoaXMuX3Njb3BlRXZlbnRzLmRlbGVnYXRlZEV2ZW50c1t0XSxuPWUubGVuZ3RoLTE7MDw9bjtuLS0pe3ZhciByPWVbbl0sbz1yLnNlbGVjdG9yLGk9ci5jb250ZXh0LGE9ci5saXN0ZW5lcnM7bz09PXRoaXMudGFyZ2V0JiZpPT09dGhpcy5fY29udGV4dCYmZS5zcGxpY2UobiwxKTtmb3IodmFyIHU9YS5sZW5ndGgtMTswPD11O3UtLSl0aGlzLl9zY29wZUV2ZW50cy5yZW1vdmVEZWxlZ2F0ZSh0aGlzLnRhcmdldCx0aGlzLl9jb250ZXh0LHQsYVt1XVswXSxhW3VdWzFdKX1lbHNlIHRoaXMuX3Njb3BlRXZlbnRzLnJlbW92ZSh0aGlzLnRhcmdldCxcImFsbFwiKX19XSksb30oKSxiPWUuSW50ZXJhY3RhYmxlPWc7ZS5kZWZhdWx0PWJ9KSxtPXQoZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmlzTm9uTmF0aXZlRXZlbnQ9ZnVuY3Rpb24odCxlKXtpZihlLnBoYXNlbGVzc1R5cGVzW3RdKXJldHVybiEwO2Zvcih2YXIgbiBpbiBlLm1hcClpZigwPT09dC5pbmRleE9mKG4pJiZ0LnN1YnN0cihuLmxlbmd0aClpbiBlLnBoYXNlcylyZXR1cm4hMDtyZXR1cm4hMX0sZS5pbml0U2NvcGU9TSxlLlNjb3BlPWUuZGVmYXVsdD12b2lkIDA7dmFyIG49ZChEKSxyPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PXYodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9cCgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShsZSksbz1kKGJ0KSxpPWQoV2UpLGE9ZChUKHt9KSksdT1kKGsoe30pKSxzPWQoWmUpLGw9ZCh6ZSksYz1kKGNuKSxmPWQoRSh7fSkpO2Z1bmN0aW9uIHAoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBwPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gZCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gdih0KXtyZXR1cm4odj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9ZnVuY3Rpb24geSh0LGUpe3JldHVybiFlfHxcIm9iamVjdFwiIT09dihlKSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT9mdW5jdGlvbih0KXtpZih2b2lkIDAhPT10KXJldHVybiB0O3Rocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKX0odCk6ZX1mdW5jdGlvbiBoKHQsZSxuKXtyZXR1cm4oaD1cInVuZGVmaW5lZFwiIT10eXBlb2YgUmVmbGVjdCYmUmVmbGVjdC5nZXQ/UmVmbGVjdC5nZXQ6ZnVuY3Rpb24odCxlLG4pe3ZhciByPWZ1bmN0aW9uKHQsZSl7Zm9yKDshT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsZSkmJm51bGwhPT0odD1nKHQpKTspO3JldHVybiB0fSh0LGUpO2lmKHIpe3ZhciBvPU9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IocixlKTtyZXR1cm4gby5nZXQ/by5nZXQuY2FsbChuKTpvLnZhbHVlfX0pKHQsZSxufHx0KX1mdW5jdGlvbiBnKHQpe3JldHVybihnPU9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3QuZ2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24odCl7cmV0dXJuIHQuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YodCl9KSh0KX1mdW5jdGlvbiBiKHQsZSl7cmV0dXJuKGI9T2JqZWN0LnNldFByb3RvdHlwZU9mfHxmdW5jdGlvbih0LGUpe3JldHVybiB0Ll9fcHJvdG9fXz1lLHR9KSh0LGUpfWZ1bmN0aW9uIG0odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfWZ1bmN0aW9uIE8odCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIHcodCxlLG4pe3JldHVybiBlJiZPKHQucHJvdG90eXBlLGUpLG4mJk8odCxuKSx0fWZ1bmN0aW9uIF8odCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBQPXIud2luLHg9ci5icm93c2VyLFM9ci5yYWYsaj1mdW5jdGlvbigpe2Z1bmN0aW9uIHQoKXt2YXIgZT10aGlzO20odGhpcyx0KSxfKHRoaXMsXCJpZFwiLFwiX19pbnRlcmFjdF9zY29wZV9cIi5jb25jYXQoTWF0aC5mbG9vcigxMDAqTWF0aC5yYW5kb20oKSkpKSxfKHRoaXMsXCJpc0luaXRpYWxpemVkXCIsITEpLF8odGhpcyxcImxpc3RlbmVyTWFwc1wiLFtdKSxfKHRoaXMsXCJicm93c2VyXCIseCksXyh0aGlzLFwidXRpbHNcIixyKSxfKHRoaXMsXCJkZWZhdWx0c1wiLHIuY2xvbmUobC5kZWZhdWx0KSksXyh0aGlzLFwiRXZlbnRhYmxlXCIsby5kZWZhdWx0KSxfKHRoaXMsXCJhY3Rpb25zXCIse21hcDp7fSxwaGFzZXM6e3N0YXJ0OiEwLG1vdmU6ITAsZW5kOiEwfSxtZXRob2REaWN0Ont9LHBoYXNlbGVzc1R5cGVzOnt9fSksXyh0aGlzLFwiaW50ZXJhY3RTdGF0aWNcIixuZXcgYS5kZWZhdWx0KHRoaXMpKSxfKHRoaXMsXCJJbnRlcmFjdEV2ZW50XCIsaS5kZWZhdWx0KSxfKHRoaXMsXCJJbnRlcmFjdGFibGVcIix2b2lkIDApLF8odGhpcyxcImludGVyYWN0YWJsZXNcIixuZXcgcy5kZWZhdWx0KHRoaXMpKSxfKHRoaXMsXCJfd2luXCIsdm9pZCAwKSxfKHRoaXMsXCJkb2N1bWVudFwiLHZvaWQgMCksXyh0aGlzLFwid2luZG93XCIsdm9pZCAwKSxfKHRoaXMsXCJkb2N1bWVudHNcIixbXSksXyh0aGlzLFwiX3BsdWdpbnNcIix7bGlzdDpbXSxtYXA6e319KSxfKHRoaXMsXCJvbldpbmRvd1VubG9hZFwiLGZ1bmN0aW9uKHQpe3JldHVybiBlLnJlbW92ZURvY3VtZW50KHQudGFyZ2V0KX0pO3ZhciBuPXRoaXM7dGhpcy5JbnRlcmFjdGFibGU9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKCl7cmV0dXJuIG0odGhpcyxlKSx5KHRoaXMsZyhlKS5hcHBseSh0aGlzLGFyZ3VtZW50cykpfXJldHVybiBmdW5jdGlvbih0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmYih0LGUpfShlLHVbXCJkZWZhdWx0XCJdKSx3KGUsW3trZXk6XCJzZXRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gaChnKGUucHJvdG90eXBlKSxcInNldFwiLHRoaXMpLmNhbGwodGhpcyx0KSxuLmZpcmUoXCJpbnRlcmFjdGFibGU6c2V0XCIse29wdGlvbnM6dCxpbnRlcmFjdGFibGU6dGhpc30pLHRoaXN9fSx7a2V5OlwidW5zZXRcIix2YWx1ZTpmdW5jdGlvbigpe2goZyhlLnByb3RvdHlwZSksXCJ1bnNldFwiLHRoaXMpLmNhbGwodGhpcyksbi5pbnRlcmFjdGFibGVzLmxpc3Quc3BsaWNlKG4uaW50ZXJhY3RhYmxlcy5saXN0LmluZGV4T2YodGhpcyksMSksbi5maXJlKFwiaW50ZXJhY3RhYmxlOnVuc2V0XCIse2ludGVyYWN0YWJsZTp0aGlzfSl9fSx7a2V5OlwiX2RlZmF1bHRzXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG4uZGVmYXVsdHN9fV0pLGV9KCl9cmV0dXJuIHcodCxbe2tleTpcImFkZExpc3RlbmVyc1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dGhpcy5saXN0ZW5lck1hcHMucHVzaCh7aWQ6ZSxtYXA6dH0pfX0se2tleTpcImZpcmVcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj0wO248dGhpcy5saXN0ZW5lck1hcHMubGVuZ3RoO24rKyl7dmFyIHI9dGhpcy5saXN0ZW5lck1hcHNbbl0ubWFwW3RdO2lmKHImJiExPT09cihlLHRoaXMsdCkpcmV0dXJuITF9fX0se2tleTpcImluaXRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5pc0luaXRpYWxpemVkP3RoaXM6TSh0aGlzLHQpfX0se2tleTpcInBsdWdpbklzSW5zdGFsbGVkXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX3BsdWdpbnMubWFwW3QuaWRdfHwtMSE9PXRoaXMuX3BsdWdpbnMubGlzdC5pbmRleE9mKHQpfX0se2tleTpcInVzZVBsdWdpblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7aWYodGhpcy5wbHVnaW5Jc0luc3RhbGxlZCh0KSlyZXR1cm4gdGhpcztpZih0LmlkJiYodGhpcy5fcGx1Z2lucy5tYXBbdC5pZF09dCksdGhpcy5fcGx1Z2lucy5saXN0LnB1c2godCksdC5pbnN0YWxsJiZ0Lmluc3RhbGwodGhpcyxlKSx0Lmxpc3RlbmVycyYmdC5iZWZvcmUpe2Zvcih2YXIgbj0wLHI9dGhpcy5saXN0ZW5lck1hcHMubGVuZ3RoLG89dC5iZWZvcmUucmVkdWNlKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbZV09ITAsdH0se30pO248cjtuKyspe2lmKG9bdGhpcy5saXN0ZW5lck1hcHNbbl0uaWRdKWJyZWFrfXRoaXMubGlzdGVuZXJNYXBzLnNwbGljZShuLDAse2lkOnQuaWQsbWFwOnQubGlzdGVuZXJzfSl9ZWxzZSB0Lmxpc3RlbmVycyYmdGhpcy5saXN0ZW5lck1hcHMucHVzaCh7aWQ6dC5pZCxtYXA6dC5saXN0ZW5lcnN9KTtyZXR1cm4gdGhpc319LHtrZXk6XCJhZGREb2N1bWVudFwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7aWYoLTEhPT10aGlzLmdldERvY0luZGV4KHQpKXJldHVybiExO3ZhciBuPVAuZ2V0V2luZG93KHQpO2U9ZT9yLmV4dGVuZCh7fSxlKTp7fSx0aGlzLmRvY3VtZW50cy5wdXNoKHtkb2M6dCxvcHRpb25zOmV9KSx0aGlzLmV2ZW50cy5kb2N1bWVudHMucHVzaCh0KSx0IT09dGhpcy5kb2N1bWVudCYmdGhpcy5ldmVudHMuYWRkKG4sXCJ1bmxvYWRcIix0aGlzLm9uV2luZG93VW5sb2FkKSx0aGlzLmZpcmUoXCJzY29wZTphZGQtZG9jdW1lbnRcIix7ZG9jOnQsd2luZG93Om4sc2NvcGU6dGhpcyxvcHRpb25zOmV9KX19LHtrZXk6XCJyZW1vdmVEb2N1bWVudFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuZ2V0RG9jSW5kZXgodCksbj1QLmdldFdpbmRvdyh0KSxyPXRoaXMuZG9jdW1lbnRzW2VdLm9wdGlvbnM7dGhpcy5ldmVudHMucmVtb3ZlKG4sXCJ1bmxvYWRcIix0aGlzLm9uV2luZG93VW5sb2FkKSx0aGlzLmRvY3VtZW50cy5zcGxpY2UoZSwxKSx0aGlzLmV2ZW50cy5kb2N1bWVudHMuc3BsaWNlKGUsMSksdGhpcy5maXJlKFwic2NvcGU6cmVtb3ZlLWRvY3VtZW50XCIse2RvYzp0LHdpbmRvdzpuLHNjb3BlOnRoaXMsb3B0aW9uczpyfSl9fSx7a2V5OlwiZ2V0RG9jSW5kZXhcIix2YWx1ZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9MDtlPHRoaXMuZG9jdW1lbnRzLmxlbmd0aDtlKyspaWYodGhpcy5kb2N1bWVudHNbZV0uZG9jPT09dClyZXR1cm4gZTtyZXR1cm4tMX19LHtrZXk6XCJnZXREb2NPcHRpb25zXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5nZXREb2NJbmRleCh0KTtyZXR1cm4tMT09PWU/bnVsbDp0aGlzLmRvY3VtZW50c1tlXS5vcHRpb25zfX0se2tleTpcIm5vd1wiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuKHRoaXMud2luZG93LkRhdGV8fERhdGUpLm5vdygpfX1dKSx0fSgpO2Z1bmN0aW9uIE0odCxlKXtyZXR1cm4gdC5pc0luaXRpYWxpemVkPSEwLFAuaW5pdChlKSxuLmRlZmF1bHQuaW5pdChlKSx4LmluaXQoZSksUy5pbml0KGUpLHQud2luZG93PWUsdC5kb2N1bWVudD1lLmRvY3VtZW50LHQudXNlUGx1Z2luKGYuZGVmYXVsdCksdC51c2VQbHVnaW4oYy5kZWZhdWx0KSx0fWUuU2NvcGU9ZS5kZWZhdWx0PWp9KSxFPXQoZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmRlZmF1bHQ9dm9pZCAwO3ZhciBfPW4oQyksdT1uKEQpLFA9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09Yyh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1hKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHp0KSxzPW4oRW4pLGw9bihVbiksbz1uKHRyKTtuKG0oe30pKTtmdW5jdGlvbiBhKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gYT1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIG4odCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIGModCl7cmV0dXJuKGM9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfWZ1bmN0aW9uIHgodCxlKXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSlyZXR1cm4gdH0odCl8fGZ1bmN0aW9uKHQsZSl7aWYoIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHQpfHxcIltvYmplY3QgQXJndW1lbnRzXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpKSlyZXR1cm47dmFyIG49W10scj0hMCxvPSExLGk9dm9pZCAwO3RyeXtmb3IodmFyIGEsdT10W1N5bWJvbC5pdGVyYXRvcl0oKTshKHI9KGE9dS5uZXh0KCkpLmRvbmUpJiYobi5wdXNoKGEudmFsdWUpLCFlfHxuLmxlbmd0aCE9PWUpO3I9ITApO31jYXRjaCh0KXtvPSEwLGk9dH1maW5hbGx5e3RyeXtyfHxudWxsPT11LnJldHVybnx8dS5yZXR1cm4oKX1maW5hbGx5e2lmKG8pdGhyb3cgaX19cmV0dXJuIG59KHQsZSl8fGZ1bmN0aW9uKCl7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9KCl9ZnVuY3Rpb24gZih0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gcCh0LGUpe3JldHVybiFlfHxcIm9iamVjdFwiIT09YyhlKSYmXCJmdW5jdGlvblwiIT10eXBlb2YgZT9mdW5jdGlvbih0KXtpZih2b2lkIDAhPT10KXJldHVybiB0O3Rocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKX0odCk6ZX1mdW5jdGlvbiBkKHQpe3JldHVybihkPU9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3QuZ2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24odCl7cmV0dXJuIHQuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YodCl9KSh0KX1mdW5jdGlvbiB2KHQsZSl7cmV0dXJuKHY9T2JqZWN0LnNldFByb3RvdHlwZU9mfHxmdW5jdGlvbih0LGUpe3JldHVybiB0Ll9fcHJvdG9fXz1lLHR9KSh0LGUpfXZhciB5PVtcInBvaW50ZXJEb3duXCIsXCJwb2ludGVyTW92ZVwiLFwicG9pbnRlclVwXCIsXCJ1cGRhdGVQb2ludGVyXCIsXCJyZW1vdmVQb2ludGVyXCIsXCJ3aW5kb3dCbHVyXCJdO2Z1bmN0aW9uIGgoTyx3KXtyZXR1cm4gZnVuY3Rpb24odCl7dmFyIGU9dy5pbnRlcmFjdGlvbnMubGlzdCxuPVAuZ2V0UG9pbnRlclR5cGUodCkscj14KFAuZ2V0RXZlbnRUYXJnZXRzKHQpLDIpLG89clswXSxpPXJbMV0sYT1bXTtpZigvXnRvdWNoLy50ZXN0KHQudHlwZSkpe3cucHJldlRvdWNoVGltZT13Lm5vdygpO2Zvcih2YXIgdT0wO3U8dC5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7dSsrKXtzPXQuY2hhbmdlZFRvdWNoZXNbdV07dmFyIHMsbD17cG9pbnRlcjpzLHBvaW50ZXJJZDpQLmdldFBvaW50ZXJJZChzKSxwb2ludGVyVHlwZTpuLGV2ZW50VHlwZTp0LnR5cGUsZXZlbnRUYXJnZXQ6byxjdXJFdmVudFRhcmdldDppLHNjb3BlOnd9LGM9UyhsKTthLnB1c2goW2wucG9pbnRlcixsLmV2ZW50VGFyZ2V0LGwuY3VyRXZlbnRUYXJnZXQsY10pfX1lbHNle3ZhciBmPSExO2lmKCFfLmRlZmF1bHQuc3VwcG9ydHNQb2ludGVyRXZlbnQmJi9tb3VzZS8udGVzdCh0LnR5cGUpKXtmb3IodmFyIHA9MDtwPGUubGVuZ3RoJiYhZjtwKyspZj1cIm1vdXNlXCIhPT1lW3BdLnBvaW50ZXJUeXBlJiZlW3BdLnBvaW50ZXJJc0Rvd247Zj1mfHx3Lm5vdygpLXcucHJldlRvdWNoVGltZTw1MDB8fDA9PT10LnRpbWVTdGFtcH1pZighZil7dmFyIGQ9e3BvaW50ZXI6dCxwb2ludGVySWQ6UC5nZXRQb2ludGVySWQodCkscG9pbnRlclR5cGU6bixldmVudFR5cGU6dC50eXBlLGN1ckV2ZW50VGFyZ2V0OmksZXZlbnRUYXJnZXQ6byxzY29wZTp3fSx2PVMoZCk7YS5wdXNoKFtkLnBvaW50ZXIsZC5ldmVudFRhcmdldCxkLmN1ckV2ZW50VGFyZ2V0LHZdKX19Zm9yKHZhciB5PTA7eTxhLmxlbmd0aDt5Kyspe3ZhciBoPXgoYVt5XSw0KSxnPWhbMF0sYj1oWzFdLG09aFsyXTtoWzNdW09dKGcsdCxiLG0pfX19ZnVuY3Rpb24gUyh0KXt2YXIgZT10LnBvaW50ZXJUeXBlLG49dC5zY29wZSxyPXtpbnRlcmFjdGlvbjpvLmRlZmF1bHQuc2VhcmNoKHQpLHNlYXJjaERldGFpbHM6dH07cmV0dXJuIG4uZmlyZShcImludGVyYWN0aW9uczpmaW5kXCIsciksci5pbnRlcmFjdGlvbnx8bi5pbnRlcmFjdGlvbnMubmV3KHtwb2ludGVyVHlwZTplfSl9ZnVuY3Rpb24gcih0LGUpe3ZhciBuPXQuZG9jLHI9dC5zY29wZSxvPXQub3B0aW9ucyxpPXIuaW50ZXJhY3Rpb25zLmRvY0V2ZW50cyxhPXIuZXZlbnRzLHU9YVtlXTtmb3IodmFyIHMgaW4gci5icm93c2VyLmlzSU9TJiYhby5ldmVudHMmJihvLmV2ZW50cz17cGFzc2l2ZTohMX0pLGEuZGVsZWdhdGVkRXZlbnRzKXUobixzLGEuZGVsZWdhdGVMaXN0ZW5lciksdShuLHMsYS5kZWxlZ2F0ZVVzZUNhcHR1cmUsITApO2Zvcih2YXIgbD1vJiZvLmV2ZW50cyxjPTA7YzxpLmxlbmd0aDtjKyspe3ZhciBmO2Y9aVtjXTt1KG4sZi50eXBlLGYubGlzdGVuZXIsbCl9fXZhciBpPXtpZDpcImNvcmUvaW50ZXJhY3Rpb25zXCIsaW5zdGFsbDpmdW5jdGlvbihvKXtmb3IodmFyIHQ9e30sZT0wO2U8eS5sZW5ndGg7ZSsrKXt2YXIgbjtuPXlbZV07dFtuXT1oKG4sbyl9dmFyIHIsaT1fLmRlZmF1bHQucEV2ZW50VHlwZXM7ZnVuY3Rpb24gYSgpe2Zvcih2YXIgdD0wO3Q8by5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7dCsrKXt2YXIgZT1vLmludGVyYWN0aW9ucy5saXN0W3RdO2lmKGUucG9pbnRlcklzRG93biYmXCJ0b3VjaFwiPT09ZS5wb2ludGVyVHlwZSYmIWUuX2ludGVyYWN0aW5nKWZvcih2YXIgbj1mdW5jdGlvbigpe3ZhciBuPWUucG9pbnRlcnNbcl07by5kb2N1bWVudHMuc29tZShmdW5jdGlvbih0KXt2YXIgZT10LmRvYztyZXR1cm4oMCwkLm5vZGVDb250YWlucykoZSxuLmRvd25UYXJnZXQpfSl8fGUucmVtb3ZlUG9pbnRlcihuLnBvaW50ZXIsbi5ldmVudCl9LHI9MDtyPGUucG9pbnRlcnMubGVuZ3RoO3IrKyl7bigpfX19KHI9dS5kZWZhdWx0LlBvaW50ZXJFdmVudD9be3R5cGU6aS5kb3duLGxpc3RlbmVyOmF9LHt0eXBlOmkuZG93bixsaXN0ZW5lcjp0LnBvaW50ZXJEb3dufSx7dHlwZTppLm1vdmUsbGlzdGVuZXI6dC5wb2ludGVyTW92ZX0se3R5cGU6aS51cCxsaXN0ZW5lcjp0LnBvaW50ZXJVcH0se3R5cGU6aS5jYW5jZWwsbGlzdGVuZXI6dC5wb2ludGVyVXB9XTpbe3R5cGU6XCJtb3VzZWRvd25cIixsaXN0ZW5lcjp0LnBvaW50ZXJEb3dufSx7dHlwZTpcIm1vdXNlbW92ZVwiLGxpc3RlbmVyOnQucG9pbnRlck1vdmV9LHt0eXBlOlwibW91c2V1cFwiLGxpc3RlbmVyOnQucG9pbnRlclVwfSx7dHlwZTpcInRvdWNoc3RhcnRcIixsaXN0ZW5lcjphfSx7dHlwZTpcInRvdWNoc3RhcnRcIixsaXN0ZW5lcjp0LnBvaW50ZXJEb3dufSx7dHlwZTpcInRvdWNobW92ZVwiLGxpc3RlbmVyOnQucG9pbnRlck1vdmV9LHt0eXBlOlwidG91Y2hlbmRcIixsaXN0ZW5lcjp0LnBvaW50ZXJVcH0se3R5cGU6XCJ0b3VjaGNhbmNlbFwiLGxpc3RlbmVyOnQucG9pbnRlclVwfV0pLnB1c2goe3R5cGU6XCJibHVyXCIsbGlzdGVuZXI6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPTA7ZTxvLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDtlKyspe28uaW50ZXJhY3Rpb25zLmxpc3RbZV0uZG9jdW1lbnRCbHVyKHQpfX19KSxvLnByZXZUb3VjaFRpbWU9MCxvLkludGVyYWN0aW9uPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3JldHVybiBmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsdCkscCh0aGlzLGQodCkuYXBwbHkodGhpcyxhcmd1bWVudHMpKX12YXIgZSxuLHI7cmV0dXJuIGZ1bmN0aW9uKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiZ2KHQsZSl9KHQsc1tcImRlZmF1bHRcIl0pLGU9dCwobj1be2tleTpcIl9ub3dcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBvLm5vdygpfX0se2tleTpcInBvaW50ZXJNb3ZlVG9sZXJhbmNlXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG8uaW50ZXJhY3Rpb25zLnBvaW50ZXJNb3ZlVG9sZXJhbmNlfSxzZXQ6ZnVuY3Rpb24odCl7by5pbnRlcmFjdGlvbnMucG9pbnRlck1vdmVUb2xlcmFuY2U9dH19XSkmJmYoZS5wcm90b3R5cGUsbiksciYmZihlLHIpLHR9KCksby5pbnRlcmFjdGlvbnM9e2xpc3Q6W10sbmV3OmZ1bmN0aW9uKHQpe3Quc2NvcGVGaXJlPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIG8uZmlyZSh0LGUpfTt2YXIgZT1uZXcgby5JbnRlcmFjdGlvbih0KTtyZXR1cm4gby5pbnRlcmFjdGlvbnMubGlzdC5wdXNoKGUpLGV9LGxpc3RlbmVyczp0LGRvY0V2ZW50czpyLHBvaW50ZXJNb3ZlVG9sZXJhbmNlOjF9LG8udXNlUGx1Z2luKGwuZGVmYXVsdCl9LGxpc3RlbmVyczp7XCJzY29wZTphZGQtZG9jdW1lbnRcIjpmdW5jdGlvbih0KXtyZXR1cm4gcih0LFwiYWRkXCIpfSxcInNjb3BlOnJlbW92ZS1kb2N1bWVudFwiOmZ1bmN0aW9uKHQpe3JldHVybiByKHQsXCJyZW1vdmVcIil9LFwiaW50ZXJhY3RhYmxlOnVuc2V0XCI6ZnVuY3Rpb24odCxlKXtmb3IodmFyIG49dC5pbnRlcmFjdGFibGUscj1lLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aC0xOzA8PXI7ci0tKXt2YXIgbz1lLmludGVyYWN0aW9ucy5saXN0W3JdO28uaW50ZXJhY3RhYmxlPT09biYmKG8uc3RvcCgpLGUuZmlyZShcImludGVyYWN0aW9uczpkZXN0cm95XCIse2ludGVyYWN0aW9uOm99KSxvLmRlc3Ryb3koKSwyPGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoJiZlLmludGVyYWN0aW9ucy5saXN0LnNwbGljZShyLDEpKX19fSxvbkRvY1NpZ25hbDpyLGRvT25JbnRlcmFjdGlvbnM6aCxtZXRob2ROYW1lczp5fTtlLmRlZmF1bHQ9aX0pLFQ9dChmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO2Z1bmN0aW9uIGEodCl7cmV0dXJuKGE9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuZGVmYXVsdD1lLkludGVyYWN0U3RhdGljPXZvaWQgMDt2YXIgbixyPShuPUMpJiZuLl9fZXNNb2R1bGU/bjp7ZGVmYXVsdDpufSx1PWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PWEodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9bCgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShsZSkscz1tKHt9KTtmdW5jdGlvbiBsKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gbD1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIG8odCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIGModCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBpPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gYShyKXt2YXIgbz10aGlzOyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsYSksdGhpcy5zY29wZT1yLGModGhpcyxcImdldFBvaW50ZXJBdmVyYWdlXCIsdS5wb2ludGVyLnBvaW50ZXJBdmVyYWdlKSxjKHRoaXMsXCJnZXRUb3VjaEJCb3hcIix1LnBvaW50ZXIudG91Y2hCQm94KSxjKHRoaXMsXCJnZXRUb3VjaERpc3RhbmNlXCIsdS5wb2ludGVyLnRvdWNoRGlzdGFuY2UpLGModGhpcyxcImdldFRvdWNoQW5nbGVcIix1LnBvaW50ZXIudG91Y2hBbmdsZSksYyh0aGlzLFwiZ2V0RWxlbWVudFJlY3RcIix1LmRvbS5nZXRFbGVtZW50UmVjdCksYyh0aGlzLFwiZ2V0RWxlbWVudENsaWVudFJlY3RcIix1LmRvbS5nZXRFbGVtZW50Q2xpZW50UmVjdCksYyh0aGlzLFwibWF0Y2hlc1NlbGVjdG9yXCIsdS5kb20ubWF0Y2hlc1NlbGVjdG9yKSxjKHRoaXMsXCJjbG9zZXN0XCIsdS5kb20uY2xvc2VzdCksYyh0aGlzLFwiZ2xvYmFsRXZlbnRzXCIse30pLGModGhpcyxcImR5bmFtaWNEcm9wXCIsdm9pZCAwKSxjKHRoaXMsXCJ2ZXJzaW9uXCIsXCIxLjkuOFwiKSxjKHRoaXMsXCJpbnRlcmFjdFwiLHZvaWQgMCk7Zm9yKHZhciB0PXRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlLGU9ZnVuY3Rpb24odCxlKXt2YXIgbj1yLmludGVyYWN0YWJsZXMuZ2V0KHQsZSk7cmV0dXJuIG58fCgobj1yLmludGVyYWN0YWJsZXMubmV3KHQsZSkpLmV2ZW50cy5nbG9iYWw9by5nbG9iYWxFdmVudHMpLG59LG49MDtuPE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlKS5sZW5ndGg7bisrKXt2YXIgaTtpPU9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRoaXMuY29uc3RydWN0b3IucHJvdG90eXBlKVtuXTtlW2ldPXRbaV19cmV0dXJuIHUuZXh0ZW5kKGUsdGhpcyksZS5jb25zdHJ1Y3Rvcj10aGlzLmNvbnN0cnVjdG9yLHRoaXMuaW50ZXJhY3Q9ZX12YXIgdCxlLG47cmV0dXJuIHQ9YSwoZT1be2tleTpcInVzZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRoaXMuc2NvcGUudXNlUGx1Z2luKHQsZSksdGhpc319LHtrZXk6XCJpc1NldFwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuISF0aGlzLnNjb3BlLmludGVyYWN0YWJsZXMuZ2V0KHQsZSYmZS5jb250ZXh0KX19LHtrZXk6XCJvblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXtpZih1LmlzLnN0cmluZyh0KSYmLTEhPT10LnNlYXJjaChcIiBcIikmJih0PXQudHJpbSgpLnNwbGl0KC8gKy8pKSx1LmlzLmFycmF5KHQpKXtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl7dmFyIG89dFtyXTt0aGlzLm9uKG8sZSxuKX1yZXR1cm4gdGhpc31pZih1LmlzLm9iamVjdCh0KSl7Zm9yKHZhciBpIGluIHQpdGhpcy5vbihpLHRbaV0sZSk7cmV0dXJuIHRoaXN9cmV0dXJuKDAscy5pc05vbk5hdGl2ZUV2ZW50KSh0LHRoaXMuc2NvcGUuYWN0aW9ucyk/dGhpcy5nbG9iYWxFdmVudHNbdF0/dGhpcy5nbG9iYWxFdmVudHNbdF0ucHVzaChlKTp0aGlzLmdsb2JhbEV2ZW50c1t0XT1bZV06dGhpcy5zY29wZS5ldmVudHMuYWRkKHRoaXMuc2NvcGUuZG9jdW1lbnQsdCxlLHtvcHRpb25zOm59KSx0aGlzfX0se2tleTpcIm9mZlwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXtpZih1LmlzLnN0cmluZyh0KSYmLTEhPT10LnNlYXJjaChcIiBcIikmJih0PXQudHJpbSgpLnNwbGl0KC8gKy8pKSx1LmlzLmFycmF5KHQpKXtmb3IodmFyIHI9MDtyPHQubGVuZ3RoO3IrKyl7dmFyIG89dFtyXTt0aGlzLm9mZihvLGUsbil9cmV0dXJuIHRoaXN9aWYodS5pcy5vYmplY3QodCkpe2Zvcih2YXIgaSBpbiB0KXRoaXMub2ZmKGksdFtpXSxlKTtyZXR1cm4gdGhpc312YXIgYTsoMCxzLmlzTm9uTmF0aXZlRXZlbnQpKHQsdGhpcy5zY29wZS5hY3Rpb25zKT90IGluIHRoaXMuZ2xvYmFsRXZlbnRzJiYtMSE9PShhPXRoaXMuZ2xvYmFsRXZlbnRzW3RdLmluZGV4T2YoZSkpJiZ0aGlzLmdsb2JhbEV2ZW50c1t0XS5zcGxpY2UoYSwxKTp0aGlzLnNjb3BlLmV2ZW50cy5yZW1vdmUodGhpcy5zY29wZS5kb2N1bWVudCx0LGUsbik7cmV0dXJuIHRoaXN9fSx7a2V5OlwiZGVidWdcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLnNjb3BlfX0se2tleTpcInN1cHBvcnRzVG91Y2hcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiByLmRlZmF1bHQuc3VwcG9ydHNUb3VjaH19LHtrZXk6XCJzdXBwb3J0c1BvaW50ZXJFdmVudFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHIuZGVmYXVsdC5zdXBwb3J0c1BvaW50ZXJFdmVudH19LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXtmb3IodmFyIHQ9MDt0PHRoaXMuc2NvcGUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO3QrKyl7dGhpcy5zY29wZS5pbnRlcmFjdGlvbnMubGlzdFt0XS5zdG9wKCl9cmV0dXJuIHRoaXN9fSx7a2V5OlwicG9pbnRlck1vdmVUb2xlcmFuY2VcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdS5pcy5udW1iZXIodCk/KHRoaXMuc2NvcGUuaW50ZXJhY3Rpb25zLnBvaW50ZXJNb3ZlVG9sZXJhbmNlPXQsdGhpcyk6dGhpcy5zY29wZS5pbnRlcmFjdGlvbnMucG9pbnRlck1vdmVUb2xlcmFuY2V9fSx7a2V5OlwiYWRkRG9jdW1lbnRcIix2YWx1ZTpmdW5jdGlvbih0LGUpe3RoaXMuc2NvcGUuYWRkRG9jdW1lbnQodCxlKX19LHtrZXk6XCJyZW1vdmVEb2N1bWVudFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuc2NvcGUucmVtb3ZlRG9jdW1lbnQodCl9fV0pJiZvKHQucHJvdG90eXBlLGUpLG4mJm8odCxuKSxhfSgpLGY9ZS5JbnRlcmFjdFN0YXRpYz1pO2UuZGVmYXVsdD1mfSksZT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmRlZmF1bHQ9dm9pZCAwO2UuZGVmYXVsdD1mdW5jdGlvbih0KXtyZXR1cm4hKCF0fHwhdC5XaW5kb3cpJiZ0IGluc3RhbmNlb2YgdC5XaW5kb3d9O3ZhciBPPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShPLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE8uaW5pdD1pLE8uZ2V0V2luZG93PWEsTy5kZWZhdWx0PXZvaWQgMDt2YXIgbixyPShuPWUpJiZuLl9fZXNNb2R1bGU/bjp7ZGVmYXVsdDpufTt2YXIgbz17cmVhbFdpbmRvdzp2b2lkIDAsd2luZG93OnZvaWQgMCxnZXRXaW5kb3c6YSxpbml0Oml9O2Z1bmN0aW9uIGkodCl7dmFyIGU9KG8ucmVhbFdpbmRvdz10KS5kb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlwiKTtlLm93bmVyRG9jdW1lbnQhPT10LmRvY3VtZW50JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiB0LndyYXAmJnQud3JhcChlKT09PWUmJih0PXQud3JhcCh0KSksby53aW5kb3c9dH1mdW5jdGlvbiBhKHQpe3JldHVybigwLHIuZGVmYXVsdCkodCk/dDoodC5vd25lckRvY3VtZW50fHx0KS5kZWZhdWx0Vmlld3x8by53aW5kb3d9XCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdz8oby53aW5kb3c9dm9pZCAwLG8ucmVhbFdpbmRvdz12b2lkIDApOmkod2luZG93KSxvLmluaXQ9aTt2YXIgdT1vO08uZGVmYXVsdD11O3ZhciB3PXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHcuYXJyYXk9dy5wbGFpbk9iamVjdD13LmVsZW1lbnQ9dy5zdHJpbmc9dy5ib29sPXcubnVtYmVyPXcuZnVuYz13Lm9iamVjdD13LmRvY0ZyYWc9dy53aW5kb3c9dm9pZCAwO3ZhciBzPWMoZSksbD1jKE8pO2Z1bmN0aW9uIGModCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIGYodCl7cmV0dXJuKGY9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfXcud2luZG93PWZ1bmN0aW9uKHQpe3JldHVybiB0PT09bC5kZWZhdWx0LndpbmRvd3x8KDAscy5kZWZhdWx0KSh0KX07dy5kb2NGcmFnPWZ1bmN0aW9uKHQpe3JldHVybiBwKHQpJiYxMT09PXQubm9kZVR5cGV9O3ZhciBwPWZ1bmN0aW9uKHQpe3JldHVybiEhdCYmXCJvYmplY3RcIj09PWYodCl9O3cub2JqZWN0PXA7ZnVuY3Rpb24gZCh0KXtyZXR1cm5cImZ1bmN0aW9uXCI9PXR5cGVvZiB0fXcuZnVuYz1kO3cubnVtYmVyPWZ1bmN0aW9uKHQpe3JldHVyblwibnVtYmVyXCI9PXR5cGVvZiB0fTt3LmJvb2w9ZnVuY3Rpb24odCl7cmV0dXJuXCJib29sZWFuXCI9PXR5cGVvZiB0fTt3LnN0cmluZz1mdW5jdGlvbih0KXtyZXR1cm5cInN0cmluZ1wiPT10eXBlb2YgdH07dy5lbGVtZW50PWZ1bmN0aW9uKHQpe2lmKCF0fHxcIm9iamVjdFwiIT09Zih0KSlyZXR1cm4hMTt2YXIgZT1sLmRlZmF1bHQuZ2V0V2luZG93KHQpfHxsLmRlZmF1bHQud2luZG93O3JldHVybi9vYmplY3R8ZnVuY3Rpb24vLnRlc3QoZihlLkVsZW1lbnQpKT90IGluc3RhbmNlb2YgZS5FbGVtZW50OjE9PT10Lm5vZGVUeXBlJiZcInN0cmluZ1wiPT10eXBlb2YgdC5ub2RlTmFtZX07dy5wbGFpbk9iamVjdD1mdW5jdGlvbih0KXtyZXR1cm4gcCh0KSYmISF0LmNvbnN0cnVjdG9yJiYvZnVuY3Rpb24gT2JqZWN0XFxiLy50ZXN0KHQuY29uc3RydWN0b3IudG9TdHJpbmcoKSl9O3cuYXJyYXk9ZnVuY3Rpb24odCl7cmV0dXJuIHAodCkmJnZvaWQgMCE9PXQubGVuZ3RoJiZkKHQuc3BsaWNlKX07dmFyIHY9e307ZnVuY3Rpb24geSh0KXtyZXR1cm4oeT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHYsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdi5kZWZhdWx0PXZvaWQgMDt2YXIgaD1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT15KHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPWcoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0odyk7ZnVuY3Rpb24gZygpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIGc9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBiKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb247aWYoXCJkcmFnXCI9PT1lLnByZXBhcmVkLm5hbWUpe3ZhciBuPWUucHJlcGFyZWQuYXhpcztcInhcIj09PW4/KGUuY29vcmRzLmN1ci5wYWdlLnk9ZS5jb29yZHMuc3RhcnQucGFnZS55LGUuY29vcmRzLmN1ci5jbGllbnQueT1lLmNvb3Jkcy5zdGFydC5jbGllbnQueSxlLmNvb3Jkcy52ZWxvY2l0eS5jbGllbnQueT0wLGUuY29vcmRzLnZlbG9jaXR5LnBhZ2UueT0wKTpcInlcIj09PW4mJihlLmNvb3Jkcy5jdXIucGFnZS54PWUuY29vcmRzLnN0YXJ0LnBhZ2UueCxlLmNvb3Jkcy5jdXIuY2xpZW50Lng9ZS5jb29yZHMuc3RhcnQuY2xpZW50LngsZS5jb29yZHMudmVsb2NpdHkuY2xpZW50Lng9MCxlLmNvb3Jkcy52ZWxvY2l0eS5wYWdlLng9MCl9fWZ1bmN0aW9uIF8odCl7dmFyIGU9dC5pRXZlbnQsbj10LmludGVyYWN0aW9uO2lmKFwiZHJhZ1wiPT09bi5wcmVwYXJlZC5uYW1lKXt2YXIgcj1uLnByZXBhcmVkLmF4aXM7aWYoXCJ4XCI9PT1yfHxcInlcIj09PXIpe3ZhciBvPVwieFwiPT09cj9cInlcIjpcInhcIjtlLnBhZ2Vbb109bi5jb29yZHMuc3RhcnQucGFnZVtvXSxlLmNsaWVudFtvXT1uLmNvb3Jkcy5zdGFydC5jbGllbnRbb10sZS5kZWx0YVtvXT0wfX19dmFyIFA9e2lkOlwiYWN0aW9ucy9kcmFnXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt2YXIgZT10LmFjdGlvbnMsbj10LkludGVyYWN0YWJsZSxyPXQuZGVmYXVsdHM7bi5wcm90b3R5cGUuZHJhZ2dhYmxlPVAuZHJhZ2dhYmxlLGUubWFwLmRyYWc9UCxlLm1ldGhvZERpY3QuZHJhZz1cImRyYWdnYWJsZVwiLHIuYWN0aW9ucy5kcmFnPVAuZGVmYXVsdHN9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1tb3ZlXCI6YixcImludGVyYWN0aW9uczphY3Rpb24tcmVzdW1lXCI6YixcImludGVyYWN0aW9uczphY3Rpb24tbW92ZVwiOl8sXCJhdXRvLXN0YXJ0OmNoZWNrXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuaW50ZXJhY3RhYmxlLHI9dC5idXR0b25zLG89bi5vcHRpb25zLmRyYWc7aWYobyYmby5lbmFibGVkJiYoIWUucG9pbnRlcklzRG93bnx8IS9tb3VzZXxwb2ludGVyLy50ZXN0KGUucG9pbnRlclR5cGUpfHwwIT0ociZuLm9wdGlvbnMuZHJhZy5tb3VzZUJ1dHRvbnMpKSlyZXR1cm4hKHQuYWN0aW9uPXtuYW1lOlwiZHJhZ1wiLGF4aXM6XCJzdGFydFwiPT09by5sb2NrQXhpcz9vLnN0YXJ0QXhpczpvLmxvY2tBeGlzfSl9fSxkcmFnZ2FibGU6ZnVuY3Rpb24odCl7cmV0dXJuIGgub2JqZWN0KHQpPyh0aGlzLm9wdGlvbnMuZHJhZy5lbmFibGVkPSExIT09dC5lbmFibGVkLHRoaXMuc2V0UGVyQWN0aW9uKFwiZHJhZ1wiLHQpLHRoaXMuc2V0T25FdmVudHMoXCJkcmFnXCIsdCksL14oeHl8eHx5fHN0YXJ0KSQvLnRlc3QodC5sb2NrQXhpcykmJih0aGlzLm9wdGlvbnMuZHJhZy5sb2NrQXhpcz10LmxvY2tBeGlzKSwvXih4eXx4fHkpJC8udGVzdCh0LnN0YXJ0QXhpcykmJih0aGlzLm9wdGlvbnMuZHJhZy5zdGFydEF4aXM9dC5zdGFydEF4aXMpLHRoaXMpOmguYm9vbCh0KT8odGhpcy5vcHRpb25zLmRyYWcuZW5hYmxlZD10LHRoaXMpOnRoaXMub3B0aW9ucy5kcmFnfSxiZWZvcmVNb3ZlOmIsbW92ZTpfLGRlZmF1bHRzOntzdGFydEF4aXM6XCJ4eVwiLGxvY2tBeGlzOlwieHlcIn0sZ2V0Q3Vyc29yOmZ1bmN0aW9uKCl7cmV0dXJuXCJtb3ZlXCJ9fSx4PVA7di5kZWZhdWx0PXg7dmFyIFM9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksUy5maW5kPVMuZmluZEluZGV4PVMuZnJvbT1TLm1lcmdlPVMucmVtb3ZlPVMuY29udGFpbnM9dm9pZCAwO1MuY29udGFpbnM9ZnVuY3Rpb24odCxlKXtyZXR1cm4tMSE9PXQuaW5kZXhPZihlKX07Uy5yZW1vdmU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gdC5zcGxpY2UodC5pbmRleE9mKGUpLDEpfTtmdW5jdGlvbiBqKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07dC5wdXNoKHIpfXJldHVybiB0fVMubWVyZ2U9ajtTLmZyb209ZnVuY3Rpb24odCl7cmV0dXJuIGooW10sdCl9O2Z1bmN0aW9uIE0odCxlKXtmb3IodmFyIG49MDtuPHQubGVuZ3RoO24rKylpZihlKHRbbl0sbix0KSlyZXR1cm4gbjtyZXR1cm4tMX1TLmZpbmRJbmRleD1NO1MuZmluZD1mdW5jdGlvbih0LGUpe3JldHVybiB0W00odCxlKV19O3ZhciBEPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShELFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEQuZGVmYXVsdD12b2lkIDA7dmFyIEk9e2luaXQ6ZnVuY3Rpb24odCl7dmFyIGU9dDtJLmRvY3VtZW50PWUuZG9jdW1lbnQsSS5Eb2N1bWVudEZyYWdtZW50PWUuRG9jdW1lbnRGcmFnbWVudHx8eixJLlNWR0VsZW1lbnQ9ZS5TVkdFbGVtZW50fHx6LEkuU1ZHU1ZHRWxlbWVudD1lLlNWR1NWR0VsZW1lbnR8fHosSS5TVkdFbGVtZW50SW5zdGFuY2U9ZS5TVkdFbGVtZW50SW5zdGFuY2V8fHosSS5FbGVtZW50PWUuRWxlbWVudHx8eixJLkhUTUxFbGVtZW50PWUuSFRNTEVsZW1lbnR8fEkuRWxlbWVudCxJLkV2ZW50PWUuRXZlbnQsSS5Ub3VjaD1lLlRvdWNofHx6LEkuUG9pbnRlckV2ZW50PWUuUG9pbnRlckV2ZW50fHxlLk1TUG9pbnRlckV2ZW50fSxkb2N1bWVudDpudWxsLERvY3VtZW50RnJhZ21lbnQ6bnVsbCxTVkdFbGVtZW50Om51bGwsU1ZHU1ZHRWxlbWVudDpudWxsLFNWR0VsZW1lbnRJbnN0YW5jZTpudWxsLEVsZW1lbnQ6bnVsbCxIVE1MRWxlbWVudDpudWxsLEV2ZW50Om51bGwsVG91Y2g6bnVsbCxQb2ludGVyRXZlbnQ6bnVsbH07ZnVuY3Rpb24geigpe312YXIgQT1JO0QuZGVmYXVsdD1BO3ZhciBDPXt9O2Z1bmN0aW9uIFcodCl7cmV0dXJuKFc9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShDLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEMuZGVmYXVsdD12b2lkIDA7dmFyIFI9TihEKSxGPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVcodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9WSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSh3KSxYPU4oTyk7ZnVuY3Rpb24gWSgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIFk9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBOKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgTD17aW5pdDpmdW5jdGlvbih0KXt2YXIgZT1SLmRlZmF1bHQuRWxlbWVudCxuPVguZGVmYXVsdC53aW5kb3cubmF2aWdhdG9yO0wuc3VwcG9ydHNUb3VjaD1cIm9udG91Y2hzdGFydFwiaW4gdHx8Ri5mdW5jKHQuRG9jdW1lbnRUb3VjaCkmJlIuZGVmYXVsdC5kb2N1bWVudCBpbnN0YW5jZW9mIHQuRG9jdW1lbnRUb3VjaCxMLnN1cHBvcnRzUG9pbnRlckV2ZW50PSExIT09bi5wb2ludGVyRW5hYmxlZCYmISFSLmRlZmF1bHQuUG9pbnRlckV2ZW50LEwuaXNJT1M9L2lQKGhvbmV8b2R8YWQpLy50ZXN0KG4ucGxhdGZvcm0pLEwuaXNJT1M3PS9pUChob25lfG9kfGFkKS8udGVzdChuLnBsYXRmb3JtKSYmL09TIDdbXlxcZF0vLnRlc3Qobi5hcHBWZXJzaW9uKSxMLmlzSWU5PS9NU0lFIDkvLnRlc3Qobi51c2VyQWdlbnQpLEwuaXNPcGVyYU1vYmlsZT1cIk9wZXJhXCI9PT1uLmFwcE5hbWUmJkwuc3VwcG9ydHNUb3VjaCYmL1ByZXN0by8udGVzdChuLnVzZXJBZ2VudCksTC5wcmVmaXhlZE1hdGNoZXNTZWxlY3Rvcj1cIm1hdGNoZXNcImluIGUucHJvdG90eXBlP1wibWF0Y2hlc1wiOlwid2Via2l0TWF0Y2hlc1NlbGVjdG9yXCJpbiBlLnByb3RvdHlwZT9cIndlYmtpdE1hdGNoZXNTZWxlY3RvclwiOlwibW96TWF0Y2hlc1NlbGVjdG9yXCJpbiBlLnByb3RvdHlwZT9cIm1vek1hdGNoZXNTZWxlY3RvclwiOlwib01hdGNoZXNTZWxlY3RvclwiaW4gZS5wcm90b3R5cGU/XCJvTWF0Y2hlc1NlbGVjdG9yXCI6XCJtc01hdGNoZXNTZWxlY3RvclwiLEwucEV2ZW50VHlwZXM9TC5zdXBwb3J0c1BvaW50ZXJFdmVudD9SLmRlZmF1bHQuUG9pbnRlckV2ZW50PT09dC5NU1BvaW50ZXJFdmVudD97dXA6XCJNU1BvaW50ZXJVcFwiLGRvd246XCJNU1BvaW50ZXJEb3duXCIsb3ZlcjpcIm1vdXNlb3ZlclwiLG91dDpcIm1vdXNlb3V0XCIsbW92ZTpcIk1TUG9pbnRlck1vdmVcIixjYW5jZWw6XCJNU1BvaW50ZXJDYW5jZWxcIn06e3VwOlwicG9pbnRlcnVwXCIsZG93bjpcInBvaW50ZXJkb3duXCIsb3ZlcjpcInBvaW50ZXJvdmVyXCIsb3V0OlwicG9pbnRlcm91dFwiLG1vdmU6XCJwb2ludGVybW92ZVwiLGNhbmNlbDpcInBvaW50ZXJjYW5jZWxcIn06bnVsbCxMLndoZWVsRXZlbnQ9XCJvbm1vdXNld2hlZWxcImluIFIuZGVmYXVsdC5kb2N1bWVudD9cIm1vdXNld2hlZWxcIjpcIndoZWVsXCJ9LHN1cHBvcnRzVG91Y2g6bnVsbCxzdXBwb3J0c1BvaW50ZXJFdmVudDpudWxsLGlzSU9TNzpudWxsLGlzSU9TOm51bGwsaXNJZTk6bnVsbCxpc09wZXJhTW9iaWxlOm51bGwscHJlZml4ZWRNYXRjaGVzU2VsZWN0b3I6bnVsbCxwRXZlbnRUeXBlczpudWxsLHdoZWVsRXZlbnQ6bnVsbH07dmFyIEI9TDtDLmRlZmF1bHQ9Qjt2YXIgVj17fTtmdW5jdGlvbiBxKHQpe3JldHVybihxPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoVixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxWLmRlZmF1bHQ9ZnVuY3Rpb24gdChlKXt2YXIgbj17fTtmb3IodmFyIHIgaW4gZSl7dmFyIG89ZVtyXTtHLnBsYWluT2JqZWN0KG8pP25bcl09dChvKTpHLmFycmF5KG8pP25bcl09VS5mcm9tKG8pOm5bcl09b31yZXR1cm4gbn07dmFyIFU9SyhTKSxHPUsodyk7ZnVuY3Rpb24gSCgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIEg9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBLKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PXEodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9SCgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufXZhciAkPXt9O2Z1bmN0aW9uIFoodCl7cmV0dXJuKFo9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLCQubm9kZUNvbnRhaW5zPWZ1bmN0aW9uKHQsZSl7Zm9yKDtlOyl7aWYoZT09PXQpcmV0dXJuITA7ZT1lLnBhcmVudE5vZGV9cmV0dXJuITF9LCQuY2xvc2VzdD1mdW5jdGlvbih0LGUpe2Zvcig7dHQuZWxlbWVudCh0KTspe2lmKGF0KHQsZSkpcmV0dXJuIHQ7dD1pdCh0KX1yZXR1cm4gbnVsbH0sJC5wYXJlbnROb2RlPWl0LCQubWF0Y2hlc1NlbGVjdG9yPWF0LCQuaW5kZXhPZkRlZXBlc3RFbGVtZW50PWZ1bmN0aW9uKHQpe3ZhciBlLG4scj1bXSxvPXRbMF0saT1vPzA6LTE7Zm9yKGU9MTtlPHQubGVuZ3RoO2UrKyl7dmFyIGE9dFtlXTtpZihhJiZhIT09bylpZihvKXtpZihhLnBhcmVudE5vZGUhPT1hLm93bmVyRG9jdW1lbnQpaWYoby5wYXJlbnROb2RlIT09YS5vd25lckRvY3VtZW50KWlmKGEucGFyZW50Tm9kZSE9PW8ucGFyZW50Tm9kZSl7aWYoIXIubGVuZ3RoKWZvcih2YXIgdT1vLHM9dm9pZCAwOyhzPXV0KHUpKSYmcyE9PXUub3duZXJEb2N1bWVudDspci51bnNoaWZ0KHUpLHU9czt2YXIgbD12b2lkIDA7aWYobyBpbnN0YW5jZW9mIFEuZGVmYXVsdC5IVE1MRWxlbWVudCYmYSBpbnN0YW5jZW9mIFEuZGVmYXVsdC5TVkdFbGVtZW50JiYhKGEgaW5zdGFuY2VvZiBRLmRlZmF1bHQuU1ZHU1ZHRWxlbWVudCkpe2lmKGE9PT1vLnBhcmVudE5vZGUpY29udGludWU7bD1hLm93bmVyU1ZHRWxlbWVudH1lbHNlIGw9YTtmb3IodmFyIGM9W107bC5wYXJlbnROb2RlIT09bC5vd25lckRvY3VtZW50OyljLnVuc2hpZnQobCksbD11dChsKTtmb3Iobj0wO2Nbbl0mJmNbbl09PT1yW25dOyluKys7Zm9yKHZhciBmPVtjW24tMV0sY1tuXSxyW25dXSxwPWZbMF0ubGFzdENoaWxkO3A7KXtpZihwPT09ZlsxXSl7bz1hLGk9ZSxyPWM7YnJlYWt9aWYocD09PWZbMl0pYnJlYWs7cD1wLnByZXZpb3VzU2libGluZ319ZWxzZXt2YXIgZD1wYXJzZUludCgoMCxldC5nZXRXaW5kb3cpKG8pLmdldENvbXB1dGVkU3R5bGUobykuekluZGV4LDEwKXx8MCx2PXBhcnNlSW50KCgwLGV0LmdldFdpbmRvdykoYSkuZ2V0Q29tcHV0ZWRTdHlsZShhKS56SW5kZXgsMTApfHwwO2Q8PXYmJihvPWEsaT1lKX1lbHNlIG89YSxpPWV9ZWxzZSBvPWEsaT1lfXJldHVybiBpfSwkLm1hdGNoZXNVcFRvPWZ1bmN0aW9uKHQsZSxuKXtmb3IoO3R0LmVsZW1lbnQodCk7KXtpZihhdCh0LGUpKXJldHVybiEwO2lmKCh0PWl0KHQpKT09PW4pcmV0dXJuIGF0KHQsZSl9cmV0dXJuITF9LCQuZ2V0QWN0dWFsRWxlbWVudD1mdW5jdGlvbih0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIFEuZGVmYXVsdC5TVkdFbGVtZW50SW5zdGFuY2U/dC5jb3JyZXNwb25kaW5nVXNlRWxlbWVudDp0fSwkLmdldFNjcm9sbFhZPXN0LCQuZ2V0RWxlbWVudENsaWVudFJlY3Q9bHQsJC5nZXRFbGVtZW50UmVjdD1mdW5jdGlvbih0KXt2YXIgZT1sdCh0KTtpZighSi5kZWZhdWx0LmlzSU9TNyYmZSl7dmFyIG49c3QoZXQuZGVmYXVsdC5nZXRXaW5kb3codCkpO2UubGVmdCs9bi54LGUucmlnaHQrPW4ueCxlLnRvcCs9bi55LGUuYm90dG9tKz1uLnl9cmV0dXJuIGV9LCQuZ2V0UGF0aD1mdW5jdGlvbih0KXt2YXIgZT1bXTtmb3IoO3Q7KWUucHVzaCh0KSx0PWl0KHQpO3JldHVybiBlfSwkLnRyeVNlbGVjdG9yPWZ1bmN0aW9uKHQpe3JldHVybiEhdHQuc3RyaW5nKHQpJiYoUS5kZWZhdWx0LmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IodCksITApfTt2YXIgSj1vdChDKSxRPW90KEQpLHR0PXJ0KHcpLGV0PXJ0KE8pO2Z1bmN0aW9uIG50KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gbnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBydCh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1aKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPW50KCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfXJldHVybiBuLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pLG59ZnVuY3Rpb24gb3QodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIGl0KHQpe3ZhciBlPXQucGFyZW50Tm9kZTtpZih0dC5kb2NGcmFnKGUpKXtmb3IoOyhlPWUuaG9zdCkmJnR0LmRvY0ZyYWcoZSk7KTtyZXR1cm4gZX1yZXR1cm4gZX1mdW5jdGlvbiBhdCh0LGUpe3JldHVybiBldC5kZWZhdWx0LndpbmRvdyE9PWV0LmRlZmF1bHQucmVhbFdpbmRvdyYmKGU9ZS5yZXBsYWNlKC9cXC9kZWVwXFwvL2csXCIgXCIpKSx0W0ouZGVmYXVsdC5wcmVmaXhlZE1hdGNoZXNTZWxlY3Rvcl0oZSl9dmFyIHV0PWZ1bmN0aW9uKHQpe3JldHVybiB0LnBhcmVudE5vZGU/dC5wYXJlbnROb2RlOnQuaG9zdH07ZnVuY3Rpb24gc3QodCl7cmV0dXJue3g6KHQ9dHx8ZXQuZGVmYXVsdC53aW5kb3cpLnNjcm9sbFh8fHQuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbExlZnQseTp0LnNjcm9sbFl8fHQuZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnNjcm9sbFRvcH19ZnVuY3Rpb24gbHQodCl7dmFyIGU9dCBpbnN0YW5jZW9mIFEuZGVmYXVsdC5TVkdFbGVtZW50P3QuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk6dC5nZXRDbGllbnRSZWN0cygpWzBdO3JldHVybiBlJiZ7bGVmdDplLmxlZnQscmlnaHQ6ZS5yaWdodCx0b3A6ZS50b3AsYm90dG9tOmUuYm90dG9tLHdpZHRoOmUud2lkdGh8fGUucmlnaHQtZS5sZWZ0LGhlaWdodDplLmhlaWdodHx8ZS5ib3R0b20tZS50b3B9fXZhciBjdD17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoY3QsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksY3QuZGVmYXVsdD1mdW5jdGlvbih0LGUpe2Zvcih2YXIgbiBpbiBlKXRbbl09ZVtuXTtyZXR1cm4gdH07dmFyIGZ0PXt9O2Z1bmN0aW9uIHB0KHQpe3JldHVybihwdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGZ0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGZ0LmRlZmF1bHQ9ZnVuY3Rpb24gbihlLHIsbyl7bz1vfHx7fTt5dC5zdHJpbmcoZSkmJi0xIT09ZS5zZWFyY2goXCIgXCIpJiYoZT1ndChlKSk7aWYoeXQuYXJyYXkoZSkpcmV0dXJuIGUucmVkdWNlKGZ1bmN0aW9uKHQsZSl7cmV0dXJuKDAsdnQuZGVmYXVsdCkodCxuKGUscixvKSl9LG8pO3l0Lm9iamVjdChlKSYmKHI9ZSxlPVwiXCIpO2lmKHl0LmZ1bmMocikpb1tlXT1vW2VdfHxbXSxvW2VdLnB1c2gocik7ZWxzZSBpZih5dC5hcnJheShyKSlmb3IodmFyIHQ9MDt0PHIubGVuZ3RoO3QrKyl7dmFyIGk9clt0XTtuKGUsaSxvKX1lbHNlIGlmKHl0Lm9iamVjdChyKSlmb3IodmFyIGEgaW4gcil7dmFyIHU9Z3QoYSkubWFwKGZ1bmN0aW9uKHQpe3JldHVyblwiXCIuY29uY2F0KGUpLmNvbmNhdCh0KX0pO24odSxyW2FdLG8pfXJldHVybiBvfTt2YXIgZHQsdnQ9KGR0PWN0KSYmZHQuX19lc01vZHVsZT9kdDp7ZGVmYXVsdDpkdH0seXQ9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09cHQodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9aHQoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0odyk7ZnVuY3Rpb24gaHQoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBodD1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIGd0KHQpe3JldHVybiB0LnRyaW0oKS5zcGxpdCgvICsvKX12YXIgYnQ9e307ZnVuY3Rpb24gbXQodCl7cmV0dXJuKG10PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoYnQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksYnQuZGVmYXVsdD12b2lkIDA7dmFyIE90PWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PW10KHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPXh0KCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KFMpLHd0PVB0KGN0KSxfdD1QdChmdCk7ZnVuY3Rpb24gUHQodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIHh0KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4geHQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBTdCh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24ganQodCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fWZ1bmN0aW9uIE10KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07aWYodC5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQpYnJlYWs7cih0KX19dmFyIGt0PWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGUpLGp0KHRoaXMsXCJvcHRpb25zXCIsdm9pZCAwKSxqdCh0aGlzLFwidHlwZXNcIix7fSksanQodGhpcyxcInByb3BhZ2F0aW9uU3RvcHBlZFwiLCExKSxqdCh0aGlzLFwiaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkXCIsITEpLGp0KHRoaXMsXCJnbG9iYWxcIix2b2lkIDApLHRoaXMub3B0aW9ucz0oMCx3dC5kZWZhdWx0KSh7fSx0fHx7fSl9dmFyIHQsbixyO3JldHVybiB0PWUsKG49W3trZXk6XCJmaXJlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGUsbj10aGlzLmdsb2JhbDsoZT10aGlzLnR5cGVzW3QudHlwZV0pJiZNdCh0LGUpLCF0LnByb3BhZ2F0aW9uU3RvcHBlZCYmbiYmKGU9blt0LnR5cGVdKSYmTXQodCxlKX19LHtrZXk6XCJvblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dmFyIG49KDAsX3QuZGVmYXVsdCkodCxlKTtmb3IodCBpbiBuKXRoaXMudHlwZXNbdF09T3QubWVyZ2UodGhpcy50eXBlc1t0XXx8W10sblt0XSl9fSx7a2V5Olwib2ZmXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt2YXIgbj0oMCxfdC5kZWZhdWx0KSh0LGUpO2Zvcih0IGluIG4pe3ZhciByPXRoaXMudHlwZXNbdF07aWYociYmci5sZW5ndGgpZm9yKHZhciBvPTA7bzxuW3RdLmxlbmd0aDtvKyspe3ZhciBpPW5bdF1bb10sYT1yLmluZGV4T2YoaSk7LTEhPT1hJiZyLnNwbGljZShhLDEpfX19fSx7a2V5OlwiZ2V0UmVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIG51bGx9fV0pJiZTdCh0LnByb3RvdHlwZSxuKSxyJiZTdCh0LHIpLGV9KCk7YnQuZGVmYXVsdD1rdDt2YXIgRXQ9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KEV0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEV0LmRlZmF1bHQ9dm9pZCAwO0V0LmRlZmF1bHQ9ZnVuY3Rpb24odCxlKXtyZXR1cm4gTWF0aC5zcXJ0KHQqdCtlKmUpfTt2YXIgVHQ9e307ZnVuY3Rpb24gRHQodCxlKXtmb3IodmFyIG4gaW4gZSl7dmFyIHI9RHQucHJlZml4ZWRQcm9wUkVzLG89ITE7Zm9yKHZhciBpIGluIHIpaWYoMD09PW4uaW5kZXhPZihpKSYmcltpXS50ZXN0KG4pKXtvPSEwO2JyZWFrfW98fFwiZnVuY3Rpb25cIj09dHlwZW9mIGVbbl18fCh0W25dPWVbbl0pfXJldHVybiB0fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShUdCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxUdC5kZWZhdWx0PXZvaWQgMCxEdC5wcmVmaXhlZFByb3BSRXM9e3dlYmtpdDovKE1vdmVtZW50W1hZXXxSYWRpdXNbWFldfFJvdGF0aW9uQW5nbGV8Rm9yY2UpJC8sbW96Oi8oUHJlc3N1cmUpJC99O3ZhciBJdD1EdDtUdC5kZWZhdWx0PUl0O3ZhciB6dD17fTtmdW5jdGlvbiBBdCh0KXtyZXR1cm4oQXQ9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh6dCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx6dC5jb3B5Q29vcmRzPWZ1bmN0aW9uKHQsZSl7dC5wYWdlPXQucGFnZXx8e30sdC5wYWdlLng9ZS5wYWdlLngsdC5wYWdlLnk9ZS5wYWdlLnksdC5jbGllbnQ9dC5jbGllbnR8fHt9LHQuY2xpZW50Lng9ZS5jbGllbnQueCx0LmNsaWVudC55PWUuY2xpZW50LnksdC50aW1lU3RhbXA9ZS50aW1lU3RhbXB9LHp0LnNldENvb3JkRGVsdGFzPWZ1bmN0aW9uKHQsZSxuKXt0LnBhZ2UueD1uLnBhZ2UueC1lLnBhZ2UueCx0LnBhZ2UueT1uLnBhZ2UueS1lLnBhZ2UueSx0LmNsaWVudC54PW4uY2xpZW50LngtZS5jbGllbnQueCx0LmNsaWVudC55PW4uY2xpZW50LnktZS5jbGllbnQueSx0LnRpbWVTdGFtcD1uLnRpbWVTdGFtcC1lLnRpbWVTdGFtcH0senQuc2V0Q29vcmRWZWxvY2l0eT1mdW5jdGlvbih0LGUpe3ZhciBuPU1hdGgubWF4KGUudGltZVN0YW1wLzFlMywuMDAxKTt0LnBhZ2UueD1lLnBhZ2UueC9uLHQucGFnZS55PWUucGFnZS55L24sdC5jbGllbnQueD1lLmNsaWVudC54L24sdC5jbGllbnQueT1lLmNsaWVudC55L24sdC50aW1lU3RhbXA9bn0senQuc2V0WmVyb0Nvb3Jkcz1mdW5jdGlvbih0KXt0LnBhZ2UueD0wLHQucGFnZS55PTAsdC5jbGllbnQueD0wLHQuY2xpZW50Lnk9MH0senQuaXNOYXRpdmVQb2ludGVyPVZ0LHp0LmdldFhZPXF0LHp0LmdldFBhZ2VYWT1VdCx6dC5nZXRDbGllbnRYWT1HdCx6dC5nZXRQb2ludGVySWQ9ZnVuY3Rpb24odCl7cmV0dXJuIFh0Lm51bWJlcih0LnBvaW50ZXJJZCk/dC5wb2ludGVySWQ6dC5pZGVudGlmaWVyfSx6dC5zZXRDb29yZHM9ZnVuY3Rpb24odCxlLG4pe3ZhciByPTE8ZS5sZW5ndGg/S3QoZSk6ZVswXSxvPXt9O1V0KHIsbyksdC5wYWdlLng9by54LHQucGFnZS55PW8ueSxHdChyLG8pLHQuY2xpZW50Lng9by54LHQuY2xpZW50Lnk9by55LHQudGltZVN0YW1wPW59LHp0LmdldFRvdWNoUGFpcj1IdCx6dC5wb2ludGVyQXZlcmFnZT1LdCx6dC50b3VjaEJCb3g9ZnVuY3Rpb24odCl7aWYoISh0Lmxlbmd0aHx8dC50b3VjaGVzJiYxPHQudG91Y2hlcy5sZW5ndGgpKXJldHVybiBudWxsO3ZhciBlPUh0KHQpLG49TWF0aC5taW4oZVswXS5wYWdlWCxlWzFdLnBhZ2VYKSxyPU1hdGgubWluKGVbMF0ucGFnZVksZVsxXS5wYWdlWSksbz1NYXRoLm1heChlWzBdLnBhZ2VYLGVbMV0ucGFnZVgpLGk9TWF0aC5tYXgoZVswXS5wYWdlWSxlWzFdLnBhZ2VZKTtyZXR1cm57eDpuLHk6cixsZWZ0Om4sdG9wOnIscmlnaHQ6byxib3R0b206aSx3aWR0aDpvLW4saGVpZ2h0Omktcn19LHp0LnRvdWNoRGlzdGFuY2U9ZnVuY3Rpb24odCxlKXt2YXIgbj1lK1wiWFwiLHI9ZStcIllcIixvPUh0KHQpLGk9b1swXVtuXS1vWzFdW25dLGE9b1swXVtyXS1vWzFdW3JdO3JldHVybigwLEZ0LmRlZmF1bHQpKGksYSl9LHp0LnRvdWNoQW5nbGU9ZnVuY3Rpb24odCxlKXt2YXIgbj1lK1wiWFwiLHI9ZStcIllcIixvPUh0KHQpLGk9b1sxXVtuXS1vWzBdW25dLGE9b1sxXVtyXS1vWzBdW3JdO3JldHVybiAxODAqTWF0aC5hdGFuMihhLGkpL01hdGguUEl9LHp0LmdldFBvaW50ZXJUeXBlPWZ1bmN0aW9uKHQpe3JldHVybiBYdC5zdHJpbmcodC5wb2ludGVyVHlwZSk/dC5wb2ludGVyVHlwZTpYdC5udW1iZXIodC5wb2ludGVyVHlwZSk/W3ZvaWQgMCx2b2lkIDAsXCJ0b3VjaFwiLFwicGVuXCIsXCJtb3VzZVwiXVt0LnBvaW50ZXJUeXBlXTovdG91Y2gvLnRlc3QodC50eXBlKXx8dCBpbnN0YW5jZW9mIFd0LmRlZmF1bHQuVG91Y2g/XCJ0b3VjaFwiOlwibW91c2VcIn0senQuZ2V0RXZlbnRUYXJnZXRzPWZ1bmN0aW9uKHQpe3ZhciBlPVh0LmZ1bmModC5jb21wb3NlZFBhdGgpP3QuY29tcG9zZWRQYXRoKCk6dC5wYXRoO3JldHVybltSdC5nZXRBY3R1YWxFbGVtZW50KGU/ZVswXTp0LnRhcmdldCksUnQuZ2V0QWN0dWFsRWxlbWVudCh0LmN1cnJlbnRUYXJnZXQpXX0senQubmV3Q29vcmRzPWZ1bmN0aW9uKCl7cmV0dXJue3BhZ2U6e3g6MCx5OjB9LGNsaWVudDp7eDowLHk6MH0sdGltZVN0YW1wOjB9fSx6dC5jb29yZHNUb0V2ZW50PWZ1bmN0aW9uKHQpe3JldHVybntjb29yZHM6dCxnZXQgcGFnZSgpe3JldHVybiB0aGlzLmNvb3Jkcy5wYWdlfSxnZXQgY2xpZW50KCl7cmV0dXJuIHRoaXMuY29vcmRzLmNsaWVudH0sZ2V0IHRpbWVTdGFtcCgpe3JldHVybiB0aGlzLmNvb3Jkcy50aW1lU3RhbXB9LGdldCBwYWdlWCgpe3JldHVybiB0aGlzLmNvb3Jkcy5wYWdlLnh9LGdldCBwYWdlWSgpe3JldHVybiB0aGlzLmNvb3Jkcy5wYWdlLnl9LGdldCBjbGllbnRYKCl7cmV0dXJuIHRoaXMuY29vcmRzLmNsaWVudC54fSxnZXQgY2xpZW50WSgpe3JldHVybiB0aGlzLmNvb3Jkcy5jbGllbnQueX0sZ2V0IHBvaW50ZXJJZCgpe3JldHVybiB0aGlzLmNvb3Jkcy5wb2ludGVySWR9LGdldCB0YXJnZXQoKXtyZXR1cm4gdGhpcy5jb29yZHMudGFyZ2V0fSxnZXQgdHlwZSgpe3JldHVybiB0aGlzLmNvb3Jkcy50eXBlfSxnZXQgcG9pbnRlclR5cGUoKXtyZXR1cm4gdGhpcy5jb29yZHMucG9pbnRlclR5cGV9LGdldCBidXR0b25zKCl7cmV0dXJuIHRoaXMuY29vcmRzLmJ1dHRvbnN9LHByZXZlbnREZWZhdWx0OmZ1bmN0aW9uKCl7fX19LE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh6dCxcInBvaW50ZXJFeHRlbmRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gWXQuZGVmYXVsdH19KTt2YXIgQ3Q9QnQoQyksV3Q9QnQoRCksUnQ9THQoJCksRnQ9QnQoRXQpLFh0PUx0KHcpLFl0PUJ0KFR0KTtmdW5jdGlvbiBOdCgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIE50PWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gTHQodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09QXQodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9TnQoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiBCdCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gVnQodCl7cmV0dXJuIHQgaW5zdGFuY2VvZiBXdC5kZWZhdWx0LkV2ZW50fHx0IGluc3RhbmNlb2YgV3QuZGVmYXVsdC5Ub3VjaH1mdW5jdGlvbiBxdCh0LGUsbil7cmV0dXJuKG49bnx8e30pLng9ZVsodD10fHxcInBhZ2VcIikrXCJYXCJdLG4ueT1lW3QrXCJZXCJdLG59ZnVuY3Rpb24gVXQodCxlKXtyZXR1cm4gZT1lfHx7eDowLHk6MH0sQ3QuZGVmYXVsdC5pc09wZXJhTW9iaWxlJiZWdCh0KT8ocXQoXCJzY3JlZW5cIix0LGUpLGUueCs9d2luZG93LnNjcm9sbFgsZS55Kz13aW5kb3cuc2Nyb2xsWSk6cXQoXCJwYWdlXCIsdCxlKSxlfWZ1bmN0aW9uIEd0KHQsZSl7cmV0dXJuIGU9ZXx8e30sQ3QuZGVmYXVsdC5pc09wZXJhTW9iaWxlJiZWdCh0KT9xdChcInNjcmVlblwiLHQsZSk6cXQoXCJjbGllbnRcIix0LGUpLGV9ZnVuY3Rpb24gSHQodCl7dmFyIGU9W107cmV0dXJuIFh0LmFycmF5KHQpPyhlWzBdPXRbMF0sZVsxXT10WzFdKTpcInRvdWNoZW5kXCI9PT10LnR5cGU/MT09PXQudG91Y2hlcy5sZW5ndGg/KGVbMF09dC50b3VjaGVzWzBdLGVbMV09dC5jaGFuZ2VkVG91Y2hlc1swXSk6MD09PXQudG91Y2hlcy5sZW5ndGgmJihlWzBdPXQuY2hhbmdlZFRvdWNoZXNbMF0sZVsxXT10LmNoYW5nZWRUb3VjaGVzWzFdKTooZVswXT10LnRvdWNoZXNbMF0sZVsxXT10LnRvdWNoZXNbMV0pLGV9ZnVuY3Rpb24gS3QodCl7Zm9yKHZhciBlPXtwYWdlWDowLHBhZ2VZOjAsY2xpZW50WDowLGNsaWVudFk6MCxzY3JlZW5YOjAsc2NyZWVuWTowfSxuPTA7bjx0Lmxlbmd0aDtuKyspe3ZhciByPXRbbl07Zm9yKHZhciBvIGluIGUpZVtvXSs9cltvXX1mb3IodmFyIGkgaW4gZSllW2ldLz10Lmxlbmd0aDtyZXR1cm4gZX12YXIgJHQ9e307ZnVuY3Rpb24gWnQodCl7cmV0dXJuKFp0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoJHQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksJHQuZ2V0U3RyaW5nT3B0aW9uUmVzdWx0PW5lLCR0LnJlc29sdmVSZWN0TGlrZT1mdW5jdGlvbih0LGUsbixyKXt2YXIgbz10O3RlLnN0cmluZyhvKT9vPW5lKG8sZSxuKTp0ZS5mdW5jKG8pJiYobz1vLmFwcGx5KHZvaWQgMCxmdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSl7Zm9yKHZhciBlPTAsbj1uZXcgQXJyYXkodC5sZW5ndGgpO2U8dC5sZW5ndGg7ZSsrKW5bZV09dFtlXTtyZXR1cm4gbn19KHQpfHxmdW5jdGlvbih0KXtpZihTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHQpfHxcIltvYmplY3QgQXJndW1lbnRzXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpKXJldHVybiBBcnJheS5mcm9tKHQpfSh0KXx8ZnVuY3Rpb24oKXt0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIHNwcmVhZCBub24taXRlcmFibGUgaW5zdGFuY2VcIil9KCl9KHIpKSk7dGUuZWxlbWVudChvKSYmKG89KDAsJC5nZXRFbGVtZW50UmVjdCkobykpO3JldHVybiBvfSwkdC5yZWN0VG9YWT1mdW5jdGlvbih0KXtyZXR1cm4gdCYme3g6XCJ4XCJpbiB0P3QueDp0LmxlZnQseTpcInlcImluIHQ/dC55OnQudG9wfX0sJHQueHl3aFRvVGxicj1mdW5jdGlvbih0KXshdHx8XCJsZWZ0XCJpbiB0JiZcInRvcFwiaW4gdHx8KCh0PSgwLFF0LmRlZmF1bHQpKHt9LHQpKS5sZWZ0PXQueHx8MCx0LnRvcD10Lnl8fDAsdC5yaWdodD10LnJpZ2h0fHx0LmxlZnQrdC53aWR0aCx0LmJvdHRvbT10LmJvdHRvbXx8dC50b3ArdC5oZWlnaHQpO3JldHVybiB0fSwkdC50bGJyVG9YeXdoPWZ1bmN0aW9uKHQpeyF0fHxcInhcImluIHQmJlwieVwiaW4gdHx8KCh0PSgwLFF0LmRlZmF1bHQpKHt9LHQpKS54PXQubGVmdHx8MCx0Lnk9dC50b3B8fDAsdC53aWR0aD10LndpZHRofHx0LnJpZ2h0fHwwLXQueCx0LmhlaWdodD10LmhlaWdodHx8dC5ib3R0b218fDAtdC55KTtyZXR1cm4gdH0sJHQuYWRkRWRnZXM9ZnVuY3Rpb24odCxlLG4pe3QubGVmdCYmKGUubGVmdCs9bi54KTt0LnJpZ2h0JiYoZS5yaWdodCs9bi54KTt0LnRvcCYmKGUudG9wKz1uLnkpO3QuYm90dG9tJiYoZS5ib3R0b20rPW4ueSk7ZS53aWR0aD1lLnJpZ2h0LWUubGVmdCxlLmhlaWdodD1lLmJvdHRvbS1lLnRvcH07dmFyIEp0LFF0PShKdD1jdCkmJkp0Ll9fZXNNb2R1bGU/SnQ6e2RlZmF1bHQ6SnR9LHRlPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVp0KHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPWVlKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpO2Z1bmN0aW9uIGVlKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gZWU9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBuZSh0LGUsbil7cmV0dXJuXCJwYXJlbnRcIj09PXQ/KDAsJC5wYXJlbnROb2RlKShuKTpcInNlbGZcIj09PXQ/ZS5nZXRSZWN0KG4pOigwLCQuY2xvc2VzdCkobix0KX12YXIgcmU9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHJlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHJlLmRlZmF1bHQ9ZnVuY3Rpb24odCxlLG4pe3ZhciByPXQub3B0aW9uc1tuXSxvPXImJnIub3JpZ2lufHx0Lm9wdGlvbnMub3JpZ2luLGk9KDAsJHQucmVzb2x2ZVJlY3RMaWtlKShvLHQsZSxbdCYmZV0pO3JldHVybigwLCR0LnJlY3RUb1hZKShpKXx8e3g6MCx5OjB9fTt2YXIgb2U9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KG9lLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLG9lLmRlZmF1bHQ9dm9pZCAwO3ZhciBpZSxhZSx1ZT0wO3ZhciBzZT17cmVxdWVzdDpmdW5jdGlvbih0KXtyZXR1cm4gaWUodCl9LGNhbmNlbDpmdW5jdGlvbih0KXtyZXR1cm4gYWUodCl9LGluaXQ6ZnVuY3Rpb24odCl7aWYoaWU9dC5yZXF1ZXN0QW5pbWF0aW9uRnJhbWUsYWU9dC5jYW5jZWxBbmltYXRpb25GcmFtZSwhaWUpZm9yKHZhciBlPVtcIm1zXCIsXCJtb3pcIixcIndlYmtpdFwiLFwib1wiXSxuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07aWU9dFtcIlwiLmNvbmNhdChyLFwiUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpXSxhZT10W1wiXCIuY29uY2F0KHIsXCJDYW5jZWxBbmltYXRpb25GcmFtZVwiKV18fHRbXCJcIi5jb25jYXQocixcIkNhbmNlbFJlcXVlc3RBbmltYXRpb25GcmFtZVwiKV19aWV8fChpZT1mdW5jdGlvbih0KXt2YXIgZT1EYXRlLm5vdygpLG49TWF0aC5tYXgoMCwxNi0oZS11ZSkpLHI9c2V0VGltZW91dChmdW5jdGlvbigpe3QoZStuKX0sbik7cmV0dXJuIHVlPWUrbixyfSxhZT1mdW5jdGlvbih0KXtyZXR1cm4gY2xlYXJUaW1lb3V0KHQpfSl9fTtvZS5kZWZhdWx0PXNlO3ZhciBsZT17fTtmdW5jdGlvbiBjZSh0KXtyZXR1cm4oY2U9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxsZS53YXJuT25jZT1mdW5jdGlvbih0LGUpe3ZhciBuPSExO3JldHVybiBmdW5jdGlvbigpe3JldHVybiBufHwoaGUuZGVmYXVsdC53aW5kb3cuY29uc29sZS53YXJuKGUpLG49ITApLHQuYXBwbHkodGhpcyxhcmd1bWVudHMpfX0sbGUuY29weUFjdGlvbj1mdW5jdGlvbih0LGUpe3JldHVybiB0Lm5hbWU9ZS5uYW1lLHQuYXhpcz1lLmF4aXMsdC5lZGdlcz1lLmVkZ2VzLHR9LE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcIndpblwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBoZS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcImJyb3dzZXJcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZ2UuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobGUsXCJjbG9uZVwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBiZS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcImV4dGVuZFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBtZS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcImdldE9yaWdpblhZXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIE9lLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGxlLFwiaHlwb3RcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gd2UuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobGUsXCJub3JtYWxpemVMaXN0ZW5lcnNcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gX2UuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobGUsXCJyYWZcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gUGUuZGVmYXVsdH19KSxsZS5yZWN0PWxlLnBvaW50ZXI9bGUuaXM9bGUuZG9tPWxlLmFycj12b2lkIDA7dmFyIGZlPWplKFMpO2xlLmFycj1mZTt2YXIgcGU9amUoJCk7bGUuZG9tPXBlO3ZhciBkZT1qZSh3KTtsZS5pcz1kZTt2YXIgdmU9amUoenQpO2xlLnBvaW50ZXI9dmU7dmFyIHllPWplKCR0KTtsZS5yZWN0PXllO3ZhciBoZT14ZShPKSxnZT14ZShDKSxiZT14ZShWKSxtZT14ZShjdCksT2U9eGUocmUpLHdlPXhlKEV0KSxfZT14ZShmdCksUGU9eGUob2UpO2Z1bmN0aW9uIHhlKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBTZSgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIFNlPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gamUodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09Y2UodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9U2UoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn12YXIgTWU9e307ZnVuY3Rpb24ga2UodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIEVlKHQsZSxuKXtyZXR1cm4gZSYma2UodC5wcm90b3R5cGUsZSksbiYma2UodCxuKSx0fWZ1bmN0aW9uIFRlKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH1PYmplY3QuZGVmaW5lUHJvcGVydHkoTWUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksTWUuZGVmYXVsdD1NZS5CYXNlRXZlbnQ9dm9pZCAwO3ZhciBEZT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxlKSxUZSh0aGlzLFwidHlwZVwiLHZvaWQgMCksVGUodGhpcyxcInRhcmdldFwiLHZvaWQgMCksVGUodGhpcyxcImN1cnJlbnRUYXJnZXRcIix2b2lkIDApLFRlKHRoaXMsXCJpbnRlcmFjdGFibGVcIix2b2lkIDApLFRlKHRoaXMsXCJfaW50ZXJhY3Rpb25cIix2b2lkIDApLFRlKHRoaXMsXCJ0aW1lU3RhbXBcIix2b2lkIDApLFRlKHRoaXMsXCJpbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWRcIiwhMSksVGUodGhpcyxcInByb3BhZ2F0aW9uU3RvcHBlZFwiLCExKSx0aGlzLl9pbnRlcmFjdGlvbj10fXJldHVybiBFZShlLFt7a2V5OlwiaW50ZXJhY3Rpb25cIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW50ZXJhY3Rpb24uX3Byb3h5fX1dKSxFZShlLFt7a2V5OlwicHJldmVudERlZmF1bHRcIix2YWx1ZTpmdW5jdGlvbigpe319LHtrZXk6XCJzdG9wUHJvcGFnYXRpb25cIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMucHJvcGFnYXRpb25TdG9wcGVkPSEwfX0se2tleTpcInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ9dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQ9ITB9fV0pLGV9KCksSWU9TWUuQmFzZUV2ZW50PURlO01lLmRlZmF1bHQ9SWU7dmFyIHplPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh6ZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx6ZS5kZWZhdWx0PXplLmRlZmF1bHRzPXZvaWQgMDt2YXIgQWU9e2Jhc2U6e3ByZXZlbnREZWZhdWx0OlwiYXV0b1wiLGRlbHRhU291cmNlOlwicGFnZVwifSxwZXJBY3Rpb246e2VuYWJsZWQ6ITEsb3JpZ2luOnt4OjAseTowfX0sYWN0aW9uczp7fX0sQ2U9emUuZGVmYXVsdHM9QWU7emUuZGVmYXVsdD1DZTt2YXIgV2U9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFdlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFdlLmRlZmF1bHQ9V2UuSW50ZXJhY3RFdmVudD12b2lkIDA7dmFyIFJlPUxlKGN0KSxGZT1MZShyZSksWGU9TGUoRXQpLFllPUxlKE1lKSxOZT1MZSh6ZSk7ZnVuY3Rpb24gTGUodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIEJlKHQpe3JldHVybihCZT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9ZnVuY3Rpb24gVmUodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIHFlKHQpe3JldHVybihxZT1PYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LmdldFByb3RvdHlwZU9mOmZ1bmN0aW9uKHQpe3JldHVybiB0Ll9fcHJvdG9fX3x8T2JqZWN0LmdldFByb3RvdHlwZU9mKHQpfSkodCl9ZnVuY3Rpb24gVWUodCl7aWYodm9pZCAwPT09dCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIHR9ZnVuY3Rpb24gR2UodCxlKXtyZXR1cm4oR2U9T2JqZWN0LnNldFByb3RvdHlwZU9mfHxmdW5jdGlvbih0LGUpe3JldHVybiB0Ll9fcHJvdG9fXz1lLHR9KSh0LGUpfWZ1bmN0aW9uIEhlKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH12YXIgS2U9ZnVuY3Rpb24oKXtmdW5jdGlvbiBnKHQsZSxuLHIsbyxpLGEpe3ZhciB1LHMsbDshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGcpLHM9dGhpcyx1PSEobD1xZShnKS5jYWxsKHRoaXMsdCkpfHxcIm9iamVjdFwiIT09QmUobCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIGw/VWUocyk6bCxIZShVZSh1KSxcInRhcmdldFwiLHZvaWQgMCksSGUoVWUodSksXCJjdXJyZW50VGFyZ2V0XCIsdm9pZCAwKSxIZShVZSh1KSxcInJlbGF0ZWRUYXJnZXRcIixudWxsKSxIZShVZSh1KSxcInNjcmVlblhcIix2b2lkIDApLEhlKFVlKHUpLFwic2NyZWVuWVwiLHZvaWQgMCksSGUoVWUodSksXCJidXR0b25cIix2b2lkIDApLEhlKFVlKHUpLFwiYnV0dG9uc1wiLHZvaWQgMCksSGUoVWUodSksXCJjdHJsS2V5XCIsdm9pZCAwKSxIZShVZSh1KSxcInNoaWZ0S2V5XCIsdm9pZCAwKSxIZShVZSh1KSxcImFsdEtleVwiLHZvaWQgMCksSGUoVWUodSksXCJtZXRhS2V5XCIsdm9pZCAwKSxIZShVZSh1KSxcInBhZ2VcIix2b2lkIDApLEhlKFVlKHUpLFwiY2xpZW50XCIsdm9pZCAwKSxIZShVZSh1KSxcImRlbHRhXCIsdm9pZCAwKSxIZShVZSh1KSxcInJlY3RcIix2b2lkIDApLEhlKFVlKHUpLFwieDBcIix2b2lkIDApLEhlKFVlKHUpLFwieTBcIix2b2lkIDApLEhlKFVlKHUpLFwidDBcIix2b2lkIDApLEhlKFVlKHUpLFwiZHRcIix2b2lkIDApLEhlKFVlKHUpLFwiZHVyYXRpb25cIix2b2lkIDApLEhlKFVlKHUpLFwiY2xpZW50WDBcIix2b2lkIDApLEhlKFVlKHUpLFwiY2xpZW50WTBcIix2b2lkIDApLEhlKFVlKHUpLFwidmVsb2NpdHlcIix2b2lkIDApLEhlKFVlKHUpLFwic3BlZWRcIix2b2lkIDApLEhlKFVlKHUpLFwic3dpcGVcIix2b2lkIDApLEhlKFVlKHUpLFwidGltZVN0YW1wXCIsdm9pZCAwKSxIZShVZSh1KSxcImRyYWdFbnRlclwiLHZvaWQgMCksSGUoVWUodSksXCJkcmFnTGVhdmVcIix2b2lkIDApLEhlKFVlKHUpLFwiYXhlc1wiLHZvaWQgMCksSGUoVWUodSksXCJwcmVFbmRcIix2b2lkIDApLG89b3x8dC5lbGVtZW50O3ZhciBjPXQuaW50ZXJhY3RhYmxlLGY9KGMmJmMub3B0aW9uc3x8TmUuZGVmYXVsdCkuZGVsdGFTb3VyY2UscD0oMCxGZS5kZWZhdWx0KShjLG8sbiksZD1cInN0YXJ0XCI9PT1yLHY9XCJlbmRcIj09PXIseT1kP1VlKHUpOnQucHJldkV2ZW50LGg9ZD90LmNvb3Jkcy5zdGFydDp2P3twYWdlOnkucGFnZSxjbGllbnQ6eS5jbGllbnQsdGltZVN0YW1wOnQuY29vcmRzLmN1ci50aW1lU3RhbXB9OnQuY29vcmRzLmN1cjtyZXR1cm4gdS5wYWdlPSgwLFJlLmRlZmF1bHQpKHt9LGgucGFnZSksdS5jbGllbnQ9KDAsUmUuZGVmYXVsdCkoe30saC5jbGllbnQpLHUucmVjdD0oMCxSZS5kZWZhdWx0KSh7fSx0LnJlY3QpLHUudGltZVN0YW1wPWgudGltZVN0YW1wLHZ8fCh1LnBhZ2UueC09cC54LHUucGFnZS55LT1wLnksdS5jbGllbnQueC09cC54LHUuY2xpZW50LnktPXAueSksdS5jdHJsS2V5PWUuY3RybEtleSx1LmFsdEtleT1lLmFsdEtleSx1LnNoaWZ0S2V5PWUuc2hpZnRLZXksdS5tZXRhS2V5PWUubWV0YUtleSx1LmJ1dHRvbj1lLmJ1dHRvbix1LmJ1dHRvbnM9ZS5idXR0b25zLHUudGFyZ2V0PW8sdS5jdXJyZW50VGFyZ2V0PW8sdS5wcmVFbmQ9aSx1LnR5cGU9YXx8bisocnx8XCJcIiksdS5pbnRlcmFjdGFibGU9Yyx1LnQwPWQ/dC5wb2ludGVyc1t0LnBvaW50ZXJzLmxlbmd0aC0xXS5kb3duVGltZTp5LnQwLHUueDA9dC5jb29yZHMuc3RhcnQucGFnZS54LXAueCx1LnkwPXQuY29vcmRzLnN0YXJ0LnBhZ2UueS1wLnksdS5jbGllbnRYMD10LmNvb3Jkcy5zdGFydC5jbGllbnQueC1wLngsdS5jbGllbnRZMD10LmNvb3Jkcy5zdGFydC5jbGllbnQueS1wLnksdS5kZWx0YT1kfHx2P3t4OjAseTowfTp7eDp1W2ZdLngteVtmXS54LHk6dVtmXS55LXlbZl0ueX0sdS5kdD10LmNvb3Jkcy5kZWx0YS50aW1lU3RhbXAsdS5kdXJhdGlvbj11LnRpbWVTdGFtcC11LnQwLHUudmVsb2NpdHk9KDAsUmUuZGVmYXVsdCkoe30sdC5jb29yZHMudmVsb2NpdHlbZl0pLHUuc3BlZWQ9KDAsWGUuZGVmYXVsdCkodS52ZWxvY2l0eS54LHUudmVsb2NpdHkueSksdS5zd2lwZT12fHxcImluZXJ0aWFzdGFydFwiPT09cj91LmdldFN3aXBlKCk6bnVsbCx1fXZhciB0LGUsbjtyZXR1cm4gZnVuY3Rpb24odCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJkdlKHQsZSl9KGcsWWVbXCJkZWZhdWx0XCJdKSx0PWcsKGU9W3trZXk6XCJnZXRTd2lwZVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcy5faW50ZXJhY3Rpb247aWYodC5wcmV2RXZlbnQuc3BlZWQ8NjAwfHwxNTA8dGhpcy50aW1lU3RhbXAtdC5wcmV2RXZlbnQudGltZVN0YW1wKXJldHVybiBudWxsO3ZhciBlPTE4MCpNYXRoLmF0YW4yKHQucHJldkV2ZW50LnZlbG9jaXR5WSx0LnByZXZFdmVudC52ZWxvY2l0eVgpL01hdGguUEk7ZTwwJiYoZSs9MzYwKTt2YXIgbj0xMTIuNTw9ZSYmZTwyNDcuNSxyPTIwMi41PD1lJiZlPDMzNy41O3JldHVybnt1cDpyLGRvd246IXImJjIyLjU8PWUmJmU8MTU3LjUsbGVmdDpuLHJpZ2h0OiFuJiYoMjkyLjU8PWV8fGU8NjcuNSksYW5nbGU6ZSxzcGVlZDp0LnByZXZFdmVudC5zcGVlZCx2ZWxvY2l0eTp7eDp0LnByZXZFdmVudC52ZWxvY2l0eVgseTp0LnByZXZFdmVudC52ZWxvY2l0eVl9fX19LHtrZXk6XCJwcmV2ZW50RGVmYXVsdFwiLHZhbHVlOmZ1bmN0aW9uKCl7fX0se2tleTpcInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ9dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQ9ITB9fSx7a2V5Olwic3RvcFByb3BhZ2F0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLnByb3BhZ2F0aW9uU3RvcHBlZD0hMH19LHtrZXk6XCJwYWdlWFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhZ2UueH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMucGFnZS54PXR9fSx7a2V5OlwicGFnZVlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5wYWdlLnl9LHNldDpmdW5jdGlvbih0KXt0aGlzLnBhZ2UueT10fX0se2tleTpcImNsaWVudFhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGllbnQueH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuY2xpZW50Lng9dH19LHtrZXk6XCJjbGllbnRZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuY2xpZW50Lnl9LHNldDpmdW5jdGlvbih0KXt0aGlzLmNsaWVudC55PXR9fSx7a2V5OlwiZHhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kZWx0YS54fSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5kZWx0YS54PXR9fSx7a2V5OlwiZHlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5kZWx0YS55fSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5kZWx0YS55PXR9fSx7a2V5OlwidmVsb2NpdHlYXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmVsb2NpdHkueH0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMudmVsb2NpdHkueD10fX0se2tleTpcInZlbG9jaXR5WVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnZlbG9jaXR5Lnl9LHNldDpmdW5jdGlvbih0KXt0aGlzLnZlbG9jaXR5Lnk9dH19XSkmJlZlKHQucHJvdG90eXBlLGUpLG4mJlZlKHQsbiksZ30oKSwkZT1XZS5JbnRlcmFjdEV2ZW50PUtlO1dlLmRlZmF1bHQ9JGU7dmFyIFplPXt9O2Z1bmN0aW9uIEplKHQpe3JldHVybihKZT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFplLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFplLmRlZmF1bHQ9dm9pZCAwO3ZhciBRZSx0bj1hbihTKSxlbj1hbigkKSxubj0oUWU9Y3QpJiZRZS5fX2VzTW9kdWxlP1FlOntkZWZhdWx0OlFlfSxybj1hbih3KTtmdW5jdGlvbiBvbigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIG9uPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gYW4odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09SmUodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9b24oKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiB1bih0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gc24odCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBsbj1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7dmFyIGE9dGhpczshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGUpLHRoaXMuc2NvcGU9dCxzbih0aGlzLFwibGlzdFwiLFtdKSxzbih0aGlzLFwic2VsZWN0b3JNYXBcIix7fSksdC5hZGRMaXN0ZW5lcnMoe1wiaW50ZXJhY3RhYmxlOnVuc2V0XCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGFibGUsbj1lLnRhcmdldCxyPWUuX2NvbnRleHQsbz1ybi5zdHJpbmcobik/YS5zZWxlY3Rvck1hcFtuXTpuW2Euc2NvcGUuaWRdLGk9by5maW5kSW5kZXgoZnVuY3Rpb24odCl7cmV0dXJuIHQuY29udGV4dD09PXJ9KTtvW2ldJiYob1tpXS5jb250ZXh0PW51bGwsb1tpXS5pbnRlcmFjdGFibGU9bnVsbCksby5zcGxpY2UoaSwxKX19KX12YXIgdCxuLHI7cmV0dXJuIHQ9ZSwobj1be2tleTpcIm5ld1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7ZT0oMCxubi5kZWZhdWx0KShlfHx7fSx7YWN0aW9uczp0aGlzLnNjb3BlLmFjdGlvbnN9KTt2YXIgbj1uZXcgdGhpcy5zY29wZS5JbnRlcmFjdGFibGUodCxlLHRoaXMuc2NvcGUuZG9jdW1lbnQsdGhpcy5zY29wZS5ldmVudHMpLHI9e2NvbnRleHQ6bi5fY29udGV4dCxpbnRlcmFjdGFibGU6bn07cmV0dXJuIHRoaXMuc2NvcGUuYWRkRG9jdW1lbnQobi5fZG9jKSx0aGlzLmxpc3QucHVzaChuKSxybi5zdHJpbmcodCk/KHRoaXMuc2VsZWN0b3JNYXBbdF18fCh0aGlzLnNlbGVjdG9yTWFwW3RdPVtdKSx0aGlzLnNlbGVjdG9yTWFwW3RdLnB1c2gocikpOihuLnRhcmdldFt0aGlzLnNjb3BlLmlkXXx8T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsdGhpcy5zY29wZS5pZCx7dmFsdWU6W10sY29uZmlndXJhYmxlOiEwfSksdFt0aGlzLnNjb3BlLmlkXS5wdXNoKHIpKSx0aGlzLnNjb3BlLmZpcmUoXCJpbnRlcmFjdGFibGU6bmV3XCIse3RhcmdldDp0LG9wdGlvbnM6ZSxpbnRlcmFjdGFibGU6bix3aW46dGhpcy5zY29wZS5fd2lufSksbn19LHtrZXk6XCJnZXRcIix2YWx1ZTpmdW5jdGlvbihlLHQpe3ZhciBuPXQmJnQuY29udGV4dHx8dGhpcy5zY29wZS5kb2N1bWVudCxyPXJuLnN0cmluZyhlKSxvPXI/dGhpcy5zZWxlY3Rvck1hcFtlXTplW3RoaXMuc2NvcGUuaWRdO2lmKCFvKXJldHVybiBudWxsO3ZhciBpPXRuLmZpbmQobyxmdW5jdGlvbih0KXtyZXR1cm4gdC5jb250ZXh0PT09biYmKHJ8fHQuaW50ZXJhY3RhYmxlLmluQ29udGV4dChlKSl9KTtyZXR1cm4gaSYmaS5pbnRlcmFjdGFibGV9fSx7a2V5OlwiZm9yRWFjaE1hdGNoXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtmb3IodmFyIG49MDtuPHRoaXMubGlzdC5sZW5ndGg7bisrKXt2YXIgcj10aGlzLmxpc3Rbbl0sbz12b2lkIDA7aWYoKHJuLnN0cmluZyhyLnRhcmdldCk/cm4uZWxlbWVudCh0KSYmZW4ubWF0Y2hlc1NlbGVjdG9yKHQsci50YXJnZXQpOnQ9PT1yLnRhcmdldCkmJnIuaW5Db250ZXh0KHQpJiYobz1lKHIpKSx2b2lkIDAhPT1vKXJldHVybiBvfX19XSkmJnVuKHQucHJvdG90eXBlLG4pLHImJnVuKHQsciksZX0oKTtaZS5kZWZhdWx0PWxuO3ZhciBjbj17fTtmdW5jdGlvbiBmbih0KXtyZXR1cm4oZm49XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShjbixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxjbi5kZWZhdWx0PWNuLkZha2VFdmVudD12b2lkIDA7dmFyIHBuPU9uKFMpLGRuPU9uKCQpLHZuPWJuKGN0KSx5bj1Pbih3KSxobj1ibihUdCksZ249T24oenQpO2Z1bmN0aW9uIGJuKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBtbigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIG1uPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gT24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09Zm4odCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9bW4oKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiB3bih0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gX24odCxlKXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSlyZXR1cm4gdH0odCl8fGZ1bmN0aW9uKHQsZSl7aWYoIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHQpfHxcIltvYmplY3QgQXJndW1lbnRzXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpKSlyZXR1cm47dmFyIG49W10scj0hMCxvPSExLGk9dm9pZCAwO3RyeXtmb3IodmFyIGEsdT10W1N5bWJvbC5pdGVyYXRvcl0oKTshKHI9KGE9dS5uZXh0KCkpLmRvbmUpJiYobi5wdXNoKGEudmFsdWUpLCFlfHxuLmxlbmd0aCE9PWUpO3I9ITApO31jYXRjaCh0KXtvPSEwLGk9dH1maW5hbGx5e3RyeXtyfHxudWxsPT11LnJldHVybnx8dS5yZXR1cm4oKX1maW5hbGx5e2lmKG8pdGhyb3cgaX19cmV0dXJuIG59KHQsZSl8fGZ1bmN0aW9uKCl7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9KCl9dmFyIFBuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbyh0KXt2YXIgZSxuLHI7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxvKSx0aGlzLm9yaWdpbmFsRXZlbnQ9dCxyPXZvaWQgMCwobj1cImN1cnJlbnRUYXJnZXRcIilpbihlPXRoaXMpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLG4se3ZhbHVlOnIsZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTplW25dPXIsKDAsaG4uZGVmYXVsdCkodGhpcyx0KX12YXIgdCxlLG47cmV0dXJuIHQ9bywoZT1be2tleTpcInByZXZlbnRPcmlnaW5hbERlZmF1bHRcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMub3JpZ2luYWxFdmVudC5wcmV2ZW50RGVmYXVsdCgpfX0se2tleTpcInN0b3BQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BQcm9wYWdhdGlvbigpfX0se2tleTpcInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5vcmlnaW5hbEV2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpfX1dKSYmd24odC5wcm90b3R5cGUsZSksbiYmd24odCxuKSxvfSgpO2Z1bmN0aW9uIHhuKHQpe2lmKCF5bi5vYmplY3QodCkpcmV0dXJue2NhcHR1cmU6ISF0LHBhc3NpdmU6ITF9O3ZhciBlPSgwLHZuLmRlZmF1bHQpKHt9LHQpO3JldHVybiBlLmNhcHR1cmU9ISF0LmNhcHR1cmUsZS5wYXNzaXZlPSEhdC5wYXNzaXZlLGV9Y24uRmFrZUV2ZW50PVBuO3ZhciBTbj17aWQ6XCJldmVudHNcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBmPVtdLGI9e30sYz1bXSxwPXthZGQ6ZCxyZW1vdmU6ZyxhZGREZWxlZ2F0ZTpmdW5jdGlvbihlLG4sdCxyLG8pe3ZhciBpPXhuKG8pO2lmKCFiW3RdKXtiW3RdPVtdO2Zvcih2YXIgYT0wO2E8Yy5sZW5ndGg7YSsrKXt2YXIgdT1jW2FdO2QodSx0LG0pLGQodSx0LE8sITApfX12YXIgcz1iW3RdLGw9cG4uZmluZChzLGZ1bmN0aW9uKHQpe3JldHVybiB0LnNlbGVjdG9yPT09ZSYmdC5jb250ZXh0PT09bn0pO2x8fChsPXtzZWxlY3RvcjplLGNvbnRleHQ6bixsaXN0ZW5lcnM6W119LHMucHVzaChsKSk7bC5saXN0ZW5lcnMucHVzaChbcixpXSl9LHJlbW92ZURlbGVnYXRlOmZ1bmN0aW9uKHQsZSxuLHIsbyl7dmFyIGksYT14bihvKSx1PWJbbl0scz0hMTtpZighdSlyZXR1cm47Zm9yKGk9dS5sZW5ndGgtMTswPD1pO2ktLSl7dmFyIGw9dVtpXTtpZihsLnNlbGVjdG9yPT09dCYmbC5jb250ZXh0PT09ZSl7Zm9yKHZhciBjPWwubGlzdGVuZXJzLGY9Yy5sZW5ndGgtMTswPD1mO2YtLSl7dmFyIHA9X24oY1tmXSwyKSxkPXBbMF0sdj1wWzFdLHk9di5jYXB0dXJlLGg9di5wYXNzaXZlO2lmKGQ9PT1yJiZ5PT09YS5jYXB0dXJlJiZoPT09YS5wYXNzaXZlKXtjLnNwbGljZShmLDEpLGMubGVuZ3RofHwodS5zcGxpY2UoaSwxKSxnKGUsbixtKSxnKGUsbixPLCEwKSkscz0hMDticmVha319aWYocylicmVha319fSxkZWxlZ2F0ZUxpc3RlbmVyOm0sZGVsZWdhdGVVc2VDYXB0dXJlOk8sZGVsZWdhdGVkRXZlbnRzOmIsZG9jdW1lbnRzOmMsdGFyZ2V0czpmLHN1cHBvcnRzT3B0aW9uczohMSxzdXBwb3J0c1Bhc3NpdmU6ITF9O2Z1bmN0aW9uIGQoZSx0LG4scil7dmFyIG89eG4ociksaT1wbi5maW5kKGYsZnVuY3Rpb24odCl7cmV0dXJuIHQuZXZlbnRUYXJnZXQ9PT1lfSk7aXx8KGk9e2V2ZW50VGFyZ2V0OmUsZXZlbnRzOnt9fSxmLnB1c2goaSkpLGkuZXZlbnRzW3RdfHwoaS5ldmVudHNbdF09W10pLGUuYWRkRXZlbnRMaXN0ZW5lciYmIXBuLmNvbnRhaW5zKGkuZXZlbnRzW3RdLG4pJiYoZS5hZGRFdmVudExpc3RlbmVyKHQsbixwLnN1cHBvcnRzT3B0aW9ucz9vOm8uY2FwdHVyZSksaS5ldmVudHNbdF0ucHVzaChuKSl9ZnVuY3Rpb24gZyhlLHQsbixyKXt2YXIgbz14bihyKSxpPXBuLmZpbmRJbmRleChmLGZ1bmN0aW9uKHQpe3JldHVybiB0LmV2ZW50VGFyZ2V0PT09ZX0pLGE9ZltpXTtpZihhJiZhLmV2ZW50cylpZihcImFsbFwiIT09dCl7dmFyIHU9ITEscz1hLmV2ZW50c1t0XTtpZihzKXtpZihcImFsbFwiPT09bil7Zm9yKHZhciBsPXMubGVuZ3RoLTE7MDw9bDtsLS0pZyhlLHQsc1tsXSxvKTtyZXR1cm59Zm9yKHZhciBjPTA7YzxzLmxlbmd0aDtjKyspaWYoc1tjXT09PW4pe2UucmVtb3ZlRXZlbnRMaXN0ZW5lcih0LG4scC5zdXBwb3J0c09wdGlvbnM/bzpvLmNhcHR1cmUpLHMuc3BsaWNlKGMsMSksMD09PXMubGVuZ3RoJiYoZGVsZXRlIGEuZXZlbnRzW3RdLHU9ITApO2JyZWFrfX11JiYhT2JqZWN0LmtleXMoYS5ldmVudHMpLmxlbmd0aCYmZi5zcGxpY2UoaSwxKX1lbHNlIGZvcih0IGluIGEuZXZlbnRzKWEuZXZlbnRzLmhhc093blByb3BlcnR5KHQpJiZnKGUsdCxcImFsbFwiKX1mdW5jdGlvbiBtKHQsZSl7Zm9yKHZhciBuPXhuKGUpLHI9bmV3IFBuKHQpLG89Ylt0LnR5cGVdLGk9X24oZ24uZ2V0RXZlbnRUYXJnZXRzKHQpLDEpWzBdLGE9aTt5bi5lbGVtZW50KGEpOyl7Zm9yKHZhciB1PTA7dTxvLmxlbmd0aDt1Kyspe3ZhciBzPW9bdV0sbD1zLnNlbGVjdG9yLGM9cy5jb250ZXh0O2lmKGRuLm1hdGNoZXNTZWxlY3RvcihhLGwpJiZkbi5ub2RlQ29udGFpbnMoYyxpKSYmZG4ubm9kZUNvbnRhaW5zKGMsYSkpe3ZhciBmPXMubGlzdGVuZXJzO3IuY3VycmVudFRhcmdldD1hO2Zvcih2YXIgcD0wO3A8Zi5sZW5ndGg7cCsrKXt2YXIgZD1fbihmW3BdLDIpLHY9ZFswXSx5PWRbMV0saD15LmNhcHR1cmUsZz15LnBhc3NpdmU7aD09PW4uY2FwdHVyZSYmZz09PW4ucGFzc2l2ZSYmdihyKX19fWE9ZG4ucGFyZW50Tm9kZShhKX19ZnVuY3Rpb24gTyh0KXtyZXR1cm4gbS5jYWxsKHRoaXMsdCwhMCl9cmV0dXJuIHQuZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImRpdlwiKS5hZGRFdmVudExpc3RlbmVyKFwidGVzdFwiLG51bGwse2dldCBjYXB0dXJlKCl7cmV0dXJuIHAuc3VwcG9ydHNPcHRpb25zPSEwfSxnZXQgcGFzc2l2ZSgpe3JldHVybiBwLnN1cHBvcnRzUGFzc2l2ZT0hMH19KSx0LmV2ZW50cz1wfX07Y24uZGVmYXVsdD1Tbjt2YXIgam49e307T2JqZWN0LmRlZmluZVByb3BlcnR5KGpuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGpuLmRlZmF1bHQ9am4uUG9pbnRlckluZm89dm9pZCAwO2Z1bmN0aW9uIE1uKHQsZSxuLHIsbyl7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxNbiksdGhpcy5pZD10LHRoaXMucG9pbnRlcj1lLHRoaXMuZXZlbnQ9bix0aGlzLmRvd25UaW1lPXIsdGhpcy5kb3duVGFyZ2V0PW99dmFyIGtuPWpuLlBvaW50ZXJJbmZvPU1uO2puLmRlZmF1bHQ9a247dmFyIEVuPXt9O2Z1bmN0aW9uIFRuKHQpe3JldHVybihUbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KEVuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShFbixcIlBvaW50ZXJJbmZvXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIFJuLmRlZmF1bHR9fSksRW4uZGVmYXVsdD1Fbi5JbnRlcmFjdGlvbj1Fbi5fUHJveHlNZXRob2RzPUVuLl9Qcm94eVZhbHVlcz12b2lkIDA7dmFyIERuLEluLHpuLEFuLENuPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVRuKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPVhuKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KGxlKSxXbj1GbihXZSksUm49Rm4oam4pO2Z1bmN0aW9uIEZuKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBYbigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIFhuPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gWW4odCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIE5uKHQsZSxuKXtyZXR1cm4gZSYmWW4odC5wcm90b3R5cGUsZSksbiYmWW4odCxuKSx0fWZ1bmN0aW9uIExuKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH1Fbi5fUHJveHlWYWx1ZXM9RG4sKEluPURufHwoRW4uX1Byb3h5VmFsdWVzPURuPXt9KSkuaW50ZXJhY3RhYmxlPVwiXCIsSW4uZWxlbWVudD1cIlwiLEluLnByZXBhcmVkPVwiXCIsSW4ucG9pbnRlcklzRG93bj1cIlwiLEluLnBvaW50ZXJXYXNNb3ZlZD1cIlwiLEluLl9wcm94eT1cIlwiLEVuLl9Qcm94eU1ldGhvZHM9em4sKEFuPXpufHwoRW4uX1Byb3h5TWV0aG9kcz16bj17fSkpLnN0YXJ0PVwiXCIsQW4ubW92ZT1cIlwiLEFuLmVuZD1cIlwiLEFuLnN0b3A9XCJcIixBbi5pbnRlcmFjdGluZz1cIlwiO3ZhciBCbj0wLFZuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gbCh0KXt2YXIgZT10aGlzLG49dC5wb2ludGVyVHlwZSxyPXQuc2NvcGVGaXJlOyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsbCksTG4odGhpcyxcImludGVyYWN0YWJsZVwiLG51bGwpLExuKHRoaXMsXCJlbGVtZW50XCIsbnVsbCksTG4odGhpcyxcInJlY3RcIix2b2lkIDApLExuKHRoaXMsXCJfcmVjdHNcIix2b2lkIDApLExuKHRoaXMsXCJlZGdlc1wiLHZvaWQgMCksTG4odGhpcyxcIl9zY29wZUZpcmVcIix2b2lkIDApLExuKHRoaXMsXCJwcmVwYXJlZFwiLHtuYW1lOm51bGwsYXhpczpudWxsLGVkZ2VzOm51bGx9KSxMbih0aGlzLFwicG9pbnRlclR5cGVcIix2b2lkIDApLExuKHRoaXMsXCJwb2ludGVyc1wiLFtdKSxMbih0aGlzLFwiZG93bkV2ZW50XCIsbnVsbCksTG4odGhpcyxcImRvd25Qb2ludGVyXCIse30pLExuKHRoaXMsXCJfbGF0ZXN0UG9pbnRlclwiLHtwb2ludGVyOm51bGwsZXZlbnQ6bnVsbCxldmVudFRhcmdldDpudWxsfSksTG4odGhpcyxcInByZXZFdmVudFwiLG51bGwpLExuKHRoaXMsXCJwb2ludGVySXNEb3duXCIsITEpLExuKHRoaXMsXCJwb2ludGVyV2FzTW92ZWRcIiwhMSksTG4odGhpcyxcIl9pbnRlcmFjdGluZ1wiLCExKSxMbih0aGlzLFwiX2VuZGluZ1wiLCExKSxMbih0aGlzLFwiX3N0b3BwZWRcIiwhMCksTG4odGhpcyxcIl9wcm94eVwiLG51bGwpLExuKHRoaXMsXCJzaW11bGF0aW9uXCIsbnVsbCksTG4odGhpcyxcImRvTW92ZVwiLENuLndhcm5PbmNlKGZ1bmN0aW9uKHQpe3RoaXMubW92ZSh0KX0sXCJUaGUgaW50ZXJhY3Rpb24uZG9Nb3ZlKCkgbWV0aG9kIGhhcyBiZWVuIHJlbmFtZWQgdG8gaW50ZXJhY3Rpb24ubW92ZSgpXCIpKSxMbih0aGlzLFwiY29vcmRzXCIse3N0YXJ0OkNuLnBvaW50ZXIubmV3Q29vcmRzKCkscHJldjpDbi5wb2ludGVyLm5ld0Nvb3JkcygpLGN1cjpDbi5wb2ludGVyLm5ld0Nvb3JkcygpLGRlbHRhOkNuLnBvaW50ZXIubmV3Q29vcmRzKCksdmVsb2NpdHk6Q24ucG9pbnRlci5uZXdDb29yZHMoKX0pLExuKHRoaXMsXCJfaWRcIixCbisrKSx0aGlzLl9zY29wZUZpcmU9cix0aGlzLnBvaW50ZXJUeXBlPW47dmFyIG89dGhpczt0aGlzLl9wcm94eT17fTtmdW5jdGlvbiBpKHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLl9wcm94eSx0LHtnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gb1t0XX19KX1mb3IodmFyIGEgaW4gRG4paShhKTtmdW5jdGlvbiB1KHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLl9wcm94eSx0LHt2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBvW3RdLmFwcGx5KG8sYXJndW1lbnRzKX19KX1mb3IodmFyIHMgaW4gem4pdShzKTt0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6bmV3XCIse2ludGVyYWN0aW9uOnRoaXN9KX1yZXR1cm4gTm4obCxbe2tleTpcInBvaW50ZXJNb3ZlVG9sZXJhbmNlXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIDF9fV0pLE5uKGwsW3trZXk6XCJwb2ludGVyRG93blwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXt2YXIgcj10aGlzLnVwZGF0ZVBvaW50ZXIodCxlLG4sITApLG89dGhpcy5wb2ludGVyc1tyXTt0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6ZG93blwiLHtwb2ludGVyOnQsZXZlbnQ6ZSxldmVudFRhcmdldDpuLHBvaW50ZXJJbmRleDpyLHBvaW50ZXJJbmZvOm8sdHlwZTpcImRvd25cIixpbnRlcmFjdGlvbjp0aGlzfSl9fSx7a2V5Olwic3RhcnRcIix2YWx1ZTpmdW5jdGlvbih0LGUsbil7cmV0dXJuISh0aGlzLmludGVyYWN0aW5nKCl8fCF0aGlzLnBvaW50ZXJJc0Rvd258fHRoaXMucG9pbnRlcnMubGVuZ3RoPChcImdlc3R1cmVcIj09PXQubmFtZT8yOjEpfHwhZS5vcHRpb25zW3QubmFtZV0uZW5hYmxlZCkmJihDbi5jb3B5QWN0aW9uKHRoaXMucHJlcGFyZWQsdCksdGhpcy5pbnRlcmFjdGFibGU9ZSx0aGlzLmVsZW1lbnQ9bix0aGlzLnJlY3Q9ZS5nZXRSZWN0KG4pLHRoaXMuZWRnZXM9dGhpcy5wcmVwYXJlZC5lZGdlcz9Dbi5leHRlbmQoe30sdGhpcy5wcmVwYXJlZC5lZGdlcyk6e2xlZnQ6ITAscmlnaHQ6ITAsdG9wOiEwLGJvdHRvbTohMH0sdGhpcy5fc3RvcHBlZD0hMSx0aGlzLl9pbnRlcmFjdGluZz10aGlzLl9kb1BoYXNlKHtpbnRlcmFjdGlvbjp0aGlzLGV2ZW50OnRoaXMuZG93bkV2ZW50LHBoYXNlOlwic3RhcnRcIn0pJiYhdGhpcy5fc3RvcHBlZCx0aGlzLl9pbnRlcmFjdGluZyl9fSx7a2V5OlwicG9pbnRlck1vdmVcIix2YWx1ZTpmdW5jdGlvbih0LGUsbil7dGhpcy5zaW11bGF0aW9ufHx0aGlzLm1vZGlmaWNhdGlvbiYmdGhpcy5tb2RpZmljYXRpb24uZW5kUmVzdWx0fHx0aGlzLnVwZGF0ZVBvaW50ZXIodCxlLG4sITEpO3ZhciByLG8saT10aGlzLmNvb3Jkcy5jdXIucGFnZS54PT09dGhpcy5jb29yZHMucHJldi5wYWdlLngmJnRoaXMuY29vcmRzLmN1ci5wYWdlLnk9PT10aGlzLmNvb3Jkcy5wcmV2LnBhZ2UueSYmdGhpcy5jb29yZHMuY3VyLmNsaWVudC54PT09dGhpcy5jb29yZHMucHJldi5jbGllbnQueCYmdGhpcy5jb29yZHMuY3VyLmNsaWVudC55PT09dGhpcy5jb29yZHMucHJldi5jbGllbnQueTt0aGlzLnBvaW50ZXJJc0Rvd24mJiF0aGlzLnBvaW50ZXJXYXNNb3ZlZCYmKHI9dGhpcy5jb29yZHMuY3VyLmNsaWVudC54LXRoaXMuY29vcmRzLnN0YXJ0LmNsaWVudC54LG89dGhpcy5jb29yZHMuY3VyLmNsaWVudC55LXRoaXMuY29vcmRzLnN0YXJ0LmNsaWVudC55LHRoaXMucG9pbnRlcldhc01vdmVkPUNuLmh5cG90KHIsbyk+dGhpcy5wb2ludGVyTW92ZVRvbGVyYW5jZSk7dmFyIGE9dGhpcy5nZXRQb2ludGVySW5kZXgodCksdT17cG9pbnRlcjp0LHBvaW50ZXJJbmRleDphLHBvaW50ZXJJbmZvOnRoaXMucG9pbnRlcnNbYV0sZXZlbnQ6ZSx0eXBlOlwibW92ZVwiLGV2ZW50VGFyZ2V0Om4sZHg6cixkeTpvLGR1cGxpY2F0ZTppLGludGVyYWN0aW9uOnRoaXN9O2l8fENuLnBvaW50ZXIuc2V0Q29vcmRWZWxvY2l0eSh0aGlzLmNvb3Jkcy52ZWxvY2l0eSx0aGlzLmNvb3Jkcy5kZWx0YSksdGhpcy5fc2NvcGVGaXJlKFwiaW50ZXJhY3Rpb25zOm1vdmVcIix1KSxpfHx0aGlzLnNpbXVsYXRpb258fCh0aGlzLmludGVyYWN0aW5nKCkmJih1LnR5cGU9bnVsbCx0aGlzLm1vdmUodSkpLHRoaXMucG9pbnRlcldhc01vdmVkJiZDbi5wb2ludGVyLmNvcHlDb29yZHModGhpcy5jb29yZHMucHJldix0aGlzLmNvb3Jkcy5jdXIpKX19LHtrZXk6XCJtb3ZlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dCYmdC5ldmVudHx8Q24ucG9pbnRlci5zZXRaZXJvQ29vcmRzKHRoaXMuY29vcmRzLmRlbHRhKSwodD1Dbi5leHRlbmQoe3BvaW50ZXI6dGhpcy5fbGF0ZXN0UG9pbnRlci5wb2ludGVyLGV2ZW50OnRoaXMuX2xhdGVzdFBvaW50ZXIuZXZlbnQsZXZlbnRUYXJnZXQ6dGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudFRhcmdldCxpbnRlcmFjdGlvbjp0aGlzfSx0fHx7fSkpLnBoYXNlPVwibW92ZVwiLHRoaXMuX2RvUGhhc2UodCl9fSx7a2V5OlwicG9pbnRlclVwXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4scil7dmFyIG89dGhpcy5nZXRQb2ludGVySW5kZXgodCk7LTE9PT1vJiYobz10aGlzLnVwZGF0ZVBvaW50ZXIodCxlLG4sITEpKTt2YXIgaT0vY2FuY2VsJC9pLnRlc3QoZS50eXBlKT9cImNhbmNlbFwiOlwidXBcIjt0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6XCIuY29uY2F0KGkpLHtwb2ludGVyOnQscG9pbnRlckluZGV4Om8scG9pbnRlckluZm86dGhpcy5wb2ludGVyc1tvXSxldmVudDplLGV2ZW50VGFyZ2V0Om4sdHlwZTppLGN1ckV2ZW50VGFyZ2V0OnIsaW50ZXJhY3Rpb246dGhpc30pLHRoaXMuc2ltdWxhdGlvbnx8dGhpcy5lbmQoZSksdGhpcy5wb2ludGVySXNEb3duPSExLHRoaXMucmVtb3ZlUG9pbnRlcih0LGUpfX0se2tleTpcImRvY3VtZW50Qmx1clwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuZW5kKHQpLHRoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczpibHVyXCIse2V2ZW50OnQsdHlwZTpcImJsdXJcIixpbnRlcmFjdGlvbjp0aGlzfSl9fSx7a2V5OlwiZW5kXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU7dGhpcy5fZW5kaW5nPSEwLHQ9dHx8dGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudCx0aGlzLmludGVyYWN0aW5nKCkmJihlPXRoaXMuX2RvUGhhc2Uoe2V2ZW50OnQsaW50ZXJhY3Rpb246dGhpcyxwaGFzZTpcImVuZFwifSkpLCEodGhpcy5fZW5kaW5nPSExKT09PWUmJnRoaXMuc3RvcCgpfX0se2tleTpcImN1cnJlbnRBY3Rpb25cIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnRlcmFjdGluZz90aGlzLnByZXBhcmVkLm5hbWU6bnVsbH19LHtrZXk6XCJpbnRlcmFjdGluZ1wiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ludGVyYWN0aW5nfX0se2tleTpcInN0b3BcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczpzdG9wXCIse2ludGVyYWN0aW9uOnRoaXN9KSx0aGlzLmludGVyYWN0YWJsZT10aGlzLmVsZW1lbnQ9bnVsbCx0aGlzLl9pbnRlcmFjdGluZz0hMSx0aGlzLl9zdG9wcGVkPSEwLHRoaXMucHJlcGFyZWQubmFtZT10aGlzLnByZXZFdmVudD1udWxsfX0se2tleTpcImdldFBvaW50ZXJJbmRleFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPUNuLnBvaW50ZXIuZ2V0UG9pbnRlcklkKHQpO3JldHVyblwibW91c2VcIj09PXRoaXMucG9pbnRlclR5cGV8fFwicGVuXCI9PT10aGlzLnBvaW50ZXJUeXBlP3RoaXMucG9pbnRlcnMubGVuZ3RoLTE6Q24uYXJyLmZpbmRJbmRleCh0aGlzLnBvaW50ZXJzLGZ1bmN0aW9uKHQpe3JldHVybiB0LmlkPT09ZX0pfX0se2tleTpcImdldFBvaW50ZXJJbmZvXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMucG9pbnRlcnNbdGhpcy5nZXRQb2ludGVySW5kZXgodCldfX0se2tleTpcInVwZGF0ZVBvaW50ZXJcIix2YWx1ZTpmdW5jdGlvbih0LGUsbixyKXt2YXIgbz1Dbi5wb2ludGVyLmdldFBvaW50ZXJJZCh0KSxpPXRoaXMuZ2V0UG9pbnRlckluZGV4KHQpLGE9dGhpcy5wb2ludGVyc1tpXTtyZXR1cm4gcj0hMSE9PXImJihyfHwvKGRvd258c3RhcnQpJC9pLnRlc3QoZS50eXBlKSksYT9hLnBvaW50ZXI9dDooYT1uZXcgUm4uZGVmYXVsdChvLHQsZSxudWxsLG51bGwpLGk9dGhpcy5wb2ludGVycy5sZW5ndGgsdGhpcy5wb2ludGVycy5wdXNoKGEpKSxDbi5wb2ludGVyLnNldENvb3Jkcyh0aGlzLmNvb3Jkcy5jdXIsdGhpcy5wb2ludGVycy5tYXAoZnVuY3Rpb24odCl7cmV0dXJuIHQucG9pbnRlcn0pLHRoaXMuX25vdygpKSxDbi5wb2ludGVyLnNldENvb3JkRGVsdGFzKHRoaXMuY29vcmRzLmRlbHRhLHRoaXMuY29vcmRzLnByZXYsdGhpcy5jb29yZHMuY3VyKSxyJiYodGhpcy5wb2ludGVySXNEb3duPSEwLGEuZG93blRpbWU9dGhpcy5jb29yZHMuY3VyLnRpbWVTdGFtcCxhLmRvd25UYXJnZXQ9bixDbi5wb2ludGVyLnBvaW50ZXJFeHRlbmQodGhpcy5kb3duUG9pbnRlcix0KSx0aGlzLmludGVyYWN0aW5nKCl8fChDbi5wb2ludGVyLmNvcHlDb29yZHModGhpcy5jb29yZHMuc3RhcnQsdGhpcy5jb29yZHMuY3VyKSxDbi5wb2ludGVyLmNvcHlDb29yZHModGhpcy5jb29yZHMucHJldix0aGlzLmNvb3Jkcy5jdXIpLHRoaXMuZG93bkV2ZW50PWUsdGhpcy5wb2ludGVyV2FzTW92ZWQ9ITEpKSx0aGlzLl91cGRhdGVMYXRlc3RQb2ludGVyKHQsZSxuKSx0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6dXBkYXRlLXBvaW50ZXJcIix7cG9pbnRlcjp0LGV2ZW50OmUsZXZlbnRUYXJnZXQ6bixkb3duOnIscG9pbnRlckluZm86YSxwb2ludGVySW5kZXg6aSxpbnRlcmFjdGlvbjp0aGlzfSksaX19LHtrZXk6XCJyZW1vdmVQb2ludGVyXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt2YXIgbj10aGlzLmdldFBvaW50ZXJJbmRleCh0KTtpZigtMSE9PW4pe3ZhciByPXRoaXMucG9pbnRlcnNbbl07dGhpcy5fc2NvcGVGaXJlKFwiaW50ZXJhY3Rpb25zOnJlbW92ZS1wb2ludGVyXCIse3BvaW50ZXI6dCxldmVudDplLGV2ZW50VGFyZ2V0Om51bGwscG9pbnRlckluZGV4Om4scG9pbnRlckluZm86cixpbnRlcmFjdGlvbjp0aGlzfSksdGhpcy5wb2ludGVycy5zcGxpY2UobiwxKX19fSx7a2V5OlwiX3VwZGF0ZUxhdGVzdFBvaW50ZXJcIix2YWx1ZTpmdW5jdGlvbih0LGUsbil7dGhpcy5fbGF0ZXN0UG9pbnRlci5wb2ludGVyPXQsdGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudD1lLHRoaXMuX2xhdGVzdFBvaW50ZXIuZXZlbnRUYXJnZXQ9bn19LHtrZXk6XCJkZXN0cm95XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLl9sYXRlc3RQb2ludGVyLnBvaW50ZXI9bnVsbCx0aGlzLl9sYXRlc3RQb2ludGVyLmV2ZW50PW51bGwsdGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudFRhcmdldD1udWxsfX0se2tleTpcIl9jcmVhdGVQcmVwYXJlZEV2ZW50XCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4scil7cmV0dXJuIG5ldyBXbi5kZWZhdWx0KHRoaXMsdCx0aGlzLnByZXBhcmVkLm5hbWUsZSx0aGlzLmVsZW1lbnQsbixyKX19LHtrZXk6XCJfZmlyZUV2ZW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5pbnRlcmFjdGFibGUuZmlyZSh0KSwoIXRoaXMucHJldkV2ZW50fHx0LnRpbWVTdGFtcD49dGhpcy5wcmV2RXZlbnQudGltZVN0YW1wKSYmKHRoaXMucHJldkV2ZW50PXQpfX0se2tleTpcIl9kb1BoYXNlXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dC5ldmVudCxuPXQucGhhc2Uscj10LnByZUVuZCxvPXQudHlwZSxpPXRoaXMucmVjdDtpZihpJiZcIm1vdmVcIj09PW4mJihDbi5yZWN0LmFkZEVkZ2VzKHRoaXMuZWRnZXMsaSx0aGlzLmNvb3Jkcy5kZWx0YVt0aGlzLmludGVyYWN0YWJsZS5vcHRpb25zLmRlbHRhU291cmNlXSksaS53aWR0aD1pLnJpZ2h0LWkubGVmdCxpLmhlaWdodD1pLmJvdHRvbS1pLnRvcCksITE9PT10aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1cIi5jb25jYXQobiksdCkpcmV0dXJuITE7dmFyIGE9dC5pRXZlbnQ9dGhpcy5fY3JlYXRlUHJlcGFyZWRFdmVudChlLG4scixvKTtyZXR1cm4gdGhpcy5fc2NvcGVGaXJlKFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1cIi5jb25jYXQobiksdCksXCJzdGFydFwiPT09biYmKHRoaXMucHJldkV2ZW50PWEpLHRoaXMuX2ZpcmVFdmVudChhKSx0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6YWZ0ZXItYWN0aW9uLVwiLmNvbmNhdChuKSx0KSwhMH19LHtrZXk6XCJfbm93XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gRGF0ZS5ub3coKX19XSksbH0oKSxxbj1Fbi5JbnRlcmFjdGlvbj1WbjtFbi5kZWZhdWx0PXFuO3ZhciBVbj17fTtmdW5jdGlvbiBHbih0KXtyZXR1cm4oR249XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShVbixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxVbi5pbnN0YWxsPUpuLFVuLmRlZmF1bHQ9dm9pZCAwO3ZhciBIbj1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1Hbih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1LbigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSh3KTtmdW5jdGlvbiBLbigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIEtuPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gJG4odCl7cmV0dXJuL14oYWx3YXlzfG5ldmVyfGF1dG8pJC8udGVzdCh0KT8odGhpcy5vcHRpb25zLnByZXZlbnREZWZhdWx0PXQsdGhpcyk6SG4uYm9vbCh0KT8odGhpcy5vcHRpb25zLnByZXZlbnREZWZhdWx0PXQ/XCJhbHdheXNcIjpcIm5ldmVyXCIsdGhpcyk6dGhpcy5vcHRpb25zLnByZXZlbnREZWZhdWx0fWZ1bmN0aW9uIFpuKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24sbj10LmV2ZW50O2UuaW50ZXJhY3RhYmxlJiZlLmludGVyYWN0YWJsZS5jaGVja0FuZFByZXZlbnREZWZhdWx0KG4pfWZ1bmN0aW9uIEpuKHIpe3ZhciB0PXIuSW50ZXJhY3RhYmxlO3QucHJvdG90eXBlLnByZXZlbnREZWZhdWx0PSRuLHQucHJvdG90eXBlLmNoZWNrQW5kUHJldmVudERlZmF1bHQ9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKHQsZSxuKXt2YXIgcj10Lm9wdGlvbnMucHJldmVudERlZmF1bHQ7aWYoXCJuZXZlclwiIT09cilpZihcImFsd2F5c1wiIT09cil7aWYoZS5ldmVudHMuc3VwcG9ydHNQYXNzaXZlJiYvXnRvdWNoKHN0YXJ0fG1vdmUpJC8udGVzdChuLnR5cGUpKXt2YXIgbz0oMCxPLmdldFdpbmRvdykobi50YXJnZXQpLmRvY3VtZW50LGk9ZS5nZXREb2NPcHRpb25zKG8pO2lmKCFpfHwhaS5ldmVudHN8fCExIT09aS5ldmVudHMucGFzc2l2ZSlyZXR1cm59L14obW91c2V8cG9pbnRlcnx0b3VjaCkqKGRvd258c3RhcnQpL2kudGVzdChuLnR5cGUpfHxIbi5lbGVtZW50KG4udGFyZ2V0KSYmKDAsJC5tYXRjaGVzU2VsZWN0b3IpKG4udGFyZ2V0LFwiaW5wdXQsc2VsZWN0LHRleHRhcmVhLFtjb250ZW50ZWRpdGFibGU9dHJ1ZV0sW2NvbnRlbnRlZGl0YWJsZT10cnVlXSAqXCIpfHxuLnByZXZlbnREZWZhdWx0KCl9ZWxzZSBuLnByZXZlbnREZWZhdWx0KCl9KHRoaXMscix0KX0sci5pbnRlcmFjdGlvbnMuZG9jRXZlbnRzLnB1c2goe3R5cGU6XCJkcmFnc3RhcnRcIixsaXN0ZW5lcjpmdW5jdGlvbih0KXtmb3IodmFyIGU9MDtlPHIuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO2UrKyl7dmFyIG49ci5pbnRlcmFjdGlvbnMubGlzdFtlXTtpZihuLmVsZW1lbnQmJihuLmVsZW1lbnQ9PT10LnRhcmdldHx8KDAsJC5ub2RlQ29udGFpbnMpKG4uZWxlbWVudCx0LnRhcmdldCkpKXJldHVybiB2b2lkIG4uaW50ZXJhY3RhYmxlLmNoZWNrQW5kUHJldmVudERlZmF1bHQodCl9fX0pfXZhciBRbj17aWQ6XCJjb3JlL2ludGVyYWN0YWJsZVByZXZlbnREZWZhdWx0XCIsaW5zdGFsbDpKbixsaXN0ZW5lcnM6W1wiZG93blwiLFwibW92ZVwiLFwidXBcIixcImNhbmNlbFwiXS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFtcImludGVyYWN0aW9uczpcIi5jb25jYXQoZSldPVpuLHR9LHt9KX07VW4uZGVmYXVsdD1Rbjt2YXIgdHI9e307ZnVuY3Rpb24gZXIodCl7cmV0dXJuKGVyPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodHIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdHIuZGVmYXVsdD12b2lkIDA7dmFyIG5yPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PWVyKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPXJyKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KCQpO2Z1bmN0aW9uIHJyKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gcnI9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH12YXIgb3I9e21ldGhvZE9yZGVyOltcInNpbXVsYXRpb25SZXN1bWVcIixcIm1vdXNlT3JQZW5cIixcImhhc1BvaW50ZXJcIixcImlkbGVcIl0sc2VhcmNoOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0wO2U8b3IubWV0aG9kT3JkZXIubGVuZ3RoO2UrKyl7dmFyIG47bj1vci5tZXRob2RPcmRlcltlXTt2YXIgcj1vcltuXSh0KTtpZihyKXJldHVybiByfXJldHVybiBudWxsfSxzaW11bGF0aW9uUmVzdW1lOmZ1bmN0aW9uKHQpe3ZhciBlPXQucG9pbnRlclR5cGUsbj10LmV2ZW50VHlwZSxyPXQuZXZlbnRUYXJnZXQsbz10LnNjb3BlO2lmKCEvZG93bnxzdGFydC9pLnRlc3QobikpcmV0dXJuIG51bGw7Zm9yKHZhciBpPTA7aTxvLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDtpKyspe3ZhciBhPW8uaW50ZXJhY3Rpb25zLmxpc3RbaV0sdT1yO2lmKGEuc2ltdWxhdGlvbiYmYS5zaW11bGF0aW9uLmFsbG93UmVzdW1lJiZhLnBvaW50ZXJUeXBlPT09ZSlmb3IoO3U7KXtpZih1PT09YS5lbGVtZW50KXJldHVybiBhO3U9bnIucGFyZW50Tm9kZSh1KX19cmV0dXJuIG51bGx9LG1vdXNlT3JQZW46ZnVuY3Rpb24odCl7dmFyIGUsbj10LnBvaW50ZXJJZCxyPXQucG9pbnRlclR5cGUsbz10LmV2ZW50VHlwZSxpPXQuc2NvcGU7aWYoXCJtb3VzZVwiIT09ciYmXCJwZW5cIiE9PXIpcmV0dXJuIG51bGw7Zm9yKHZhciBhPTA7YTxpLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDthKyspe3ZhciB1PWkuaW50ZXJhY3Rpb25zLmxpc3RbYV07aWYodS5wb2ludGVyVHlwZT09PXIpe2lmKHUuc2ltdWxhdGlvbiYmIWlyKHUsbikpY29udGludWU7aWYodS5pbnRlcmFjdGluZygpKXJldHVybiB1O2U9ZXx8dX19aWYoZSlyZXR1cm4gZTtmb3IodmFyIHM9MDtzPGkuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO3MrKyl7dmFyIGw9aS5pbnRlcmFjdGlvbnMubGlzdFtzXTtpZighKGwucG9pbnRlclR5cGUhPT1yfHwvZG93bi9pLnRlc3QobykmJmwuc2ltdWxhdGlvbikpcmV0dXJuIGx9cmV0dXJuIG51bGx9LGhhc1BvaW50ZXI6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPXQucG9pbnRlcklkLG49dC5zY29wZSxyPTA7cjxuLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDtyKyspe3ZhciBvPW4uaW50ZXJhY3Rpb25zLmxpc3Rbcl07aWYoaXIobyxlKSlyZXR1cm4gb31yZXR1cm4gbnVsbH0saWRsZTpmdW5jdGlvbih0KXtmb3IodmFyIGU9dC5wb2ludGVyVHlwZSxuPXQuc2NvcGUscj0wO3I8bi5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7cisrKXt2YXIgbz1uLmludGVyYWN0aW9ucy5saXN0W3JdO2lmKDE9PT1vLnBvaW50ZXJzLmxlbmd0aCl7dmFyIGk9by5pbnRlcmFjdGFibGU7aWYoaSYmKCFpLm9wdGlvbnMuZ2VzdHVyZXx8IWkub3B0aW9ucy5nZXN0dXJlLmVuYWJsZWQpKWNvbnRpbnVlfWVsc2UgaWYoMjw9by5wb2ludGVycy5sZW5ndGgpY29udGludWU7aWYoIW8uaW50ZXJhY3RpbmcoKSYmZT09PW8ucG9pbnRlclR5cGUpcmV0dXJuIG99cmV0dXJuIG51bGx9fTtmdW5jdGlvbiBpcih0LGUpe3JldHVybiB0LnBvaW50ZXJzLnNvbWUoZnVuY3Rpb24odCl7cmV0dXJuIHQuaWQ9PT1lfSl9dmFyIGFyPW9yO3RyLmRlZmF1bHQ9YXI7dmFyIHVyPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh1cixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx1ci5kZWZhdWx0PXZvaWQgMDt2YXIgc3IsbHI9KHNyPU1lKSYmc3IuX19lc01vZHVsZT9zcjp7ZGVmYXVsdDpzcn0sY3I9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09cHIodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9ZnIoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oUyk7ZnVuY3Rpb24gZnIoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBmcj1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIHByKHQpe3JldHVybihwcj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9ZnVuY3Rpb24gZHIodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIHZyKHQpe3JldHVybih2cj1PYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LmdldFByb3RvdHlwZU9mOmZ1bmN0aW9uKHQpe3JldHVybiB0Ll9fcHJvdG9fX3x8T2JqZWN0LmdldFByb3RvdHlwZU9mKHQpfSkodCl9ZnVuY3Rpb24geXIodCl7aWYodm9pZCAwPT09dCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIHR9ZnVuY3Rpb24gaHIodCxlKXtyZXR1cm4oaHI9T2JqZWN0LnNldFByb3RvdHlwZU9mfHxmdW5jdGlvbih0LGUpe3JldHVybiB0Ll9fcHJvdG9fXz1lLHR9KSh0LGUpfWZ1bmN0aW9uIGdyKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH12YXIgYnI9ZnVuY3Rpb24oKXtmdW5jdGlvbiBsKHQsZSxuKXt2YXIgcixvLGk7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxsKSxvPXRoaXMscj0hKGk9dnIobCkuY2FsbCh0aGlzLGUuX2ludGVyYWN0aW9uKSl8fFwib2JqZWN0XCIhPT1wcihpKSYmXCJmdW5jdGlvblwiIT10eXBlb2YgaT95cihvKTppLGdyKHlyKHIpLFwidGFyZ2V0XCIsdm9pZCAwKSxncih5cihyKSxcImRyb3B6b25lXCIsdm9pZCAwKSxncih5cihyKSxcImRyYWdFdmVudFwiLHZvaWQgMCksZ3IoeXIociksXCJyZWxhdGVkVGFyZ2V0XCIsdm9pZCAwKSxncih5cihyKSxcImRyYWdnYWJsZVwiLHZvaWQgMCksZ3IoeXIociksXCJ0aW1lU3RhbXBcIix2b2lkIDApLGdyKHlyKHIpLFwicHJvcGFnYXRpb25TdG9wcGVkXCIsITEpLGdyKHlyKHIpLFwiaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkXCIsITEpO3ZhciBhPVwiZHJhZ2xlYXZlXCI9PT1uP3QucHJldjp0LmN1cix1PWEuZWxlbWVudCxzPWEuZHJvcHpvbmU7cmV0dXJuIHIudHlwZT1uLHIudGFyZ2V0PXUsci5jdXJyZW50VGFyZ2V0PXUsci5kcm9wem9uZT1zLHIuZHJhZ0V2ZW50PWUsci5yZWxhdGVkVGFyZ2V0PWUudGFyZ2V0LHIuZHJhZ2dhYmxlPWUuaW50ZXJhY3RhYmxlLHIudGltZVN0YW1wPWUudGltZVN0YW1wLHJ9dmFyIHQsZSxuO3JldHVybiBmdW5jdGlvbih0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmaHIodCxlKX0obCxscltcImRlZmF1bHRcIl0pLHQ9bCwoZT1be2tleTpcInJlamVjdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHI9dGhpcyx0PXRoaXMuX2ludGVyYWN0aW9uLmRyb3BTdGF0ZTtpZihcImRyb3BhY3RpdmF0ZVwiPT09dGhpcy50eXBlfHx0aGlzLmRyb3B6b25lJiZ0LmN1ci5kcm9wem9uZT09PXRoaXMuZHJvcHpvbmUmJnQuY3VyLmVsZW1lbnQ9PT10aGlzLnRhcmdldClpZih0LnByZXYuZHJvcHpvbmU9dGhpcy5kcm9wem9uZSx0LnByZXYuZWxlbWVudD10aGlzLnRhcmdldCx0LnJlamVjdGVkPSEwLHQuZXZlbnRzLmVudGVyPW51bGwsdGhpcy5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKSxcImRyb3BhY3RpdmF0ZVwiPT09dGhpcy50eXBlKXt2YXIgZT10LmFjdGl2ZURyb3BzLG49Y3IuZmluZEluZGV4KGUsZnVuY3Rpb24odCl7dmFyIGU9dC5kcm9wem9uZSxuPXQuZWxlbWVudDtyZXR1cm4gZT09PXIuZHJvcHpvbmUmJm49PT1yLnRhcmdldH0pO3QuYWN0aXZlRHJvcHMuc3BsaWNlKG4sMSk7dmFyIG89bmV3IGwodCx0aGlzLmRyYWdFdmVudCxcImRyb3BkZWFjdGl2YXRlXCIpO28uZHJvcHpvbmU9dGhpcy5kcm9wem9uZSxvLnRhcmdldD10aGlzLnRhcmdldCx0aGlzLmRyb3B6b25lLmZpcmUobyl9ZWxzZSB0aGlzLmRyb3B6b25lLmZpcmUobmV3IGwodCx0aGlzLmRyYWdFdmVudCxcImRyYWdsZWF2ZVwiKSl9fSx7a2V5OlwicHJldmVudERlZmF1bHRcIix2YWx1ZTpmdW5jdGlvbigpe319LHtrZXk6XCJzdG9wUHJvcGFnYXRpb25cIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMucHJvcGFnYXRpb25TdG9wcGVkPSEwfX0se2tleTpcInN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWQ9dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQ9ITB9fV0pJiZkcih0LnByb3RvdHlwZSxlKSxuJiZkcih0LG4pLGx9KCk7dXIuZGVmYXVsdD1icjt2YXIgbXI9e307ZnVuY3Rpb24gT3IodCl7cmV0dXJuKE9yPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkobXIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksbXIuZGVmYXVsdD12b2lkIDA7U3Ioayh7fSkpLFNyKG0oe30pKTt2YXIgd3I9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09T3IodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9eHIoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0obGUpLF9yPVNyKHYpLFByPVNyKHVyKTtmdW5jdGlvbiB4cigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIHhyPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gU3IodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIGpyKHQsZSl7Zm9yKHZhciBuPTA7bjx0LnNsaWNlKCkubGVuZ3RoO24rKyl7cj10LnNsaWNlKClbbl07dmFyIHIsbz1yLmRyb3B6b25lLGk9ci5lbGVtZW50O2UuZHJvcHpvbmU9byxlLnRhcmdldD1pLG8uZmlyZShlKSxlLnByb3BhZ2F0aW9uU3RvcHBlZD1lLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZD0hMX19ZnVuY3Rpb24gTXIodCxlKXtmb3IodmFyIG49ZnVuY3Rpb24odCxlKXtmb3IodmFyIG49dC5pbnRlcmFjdGFibGVzLHI9W10sbz0wO288bi5saXN0Lmxlbmd0aDtvKyspe3ZhciBpPW4ubGlzdFtvXTtpZihpLm9wdGlvbnMuZHJvcC5lbmFibGVkKXt2YXIgYT1pLm9wdGlvbnMuZHJvcC5hY2NlcHQ7aWYoISh3ci5pcy5lbGVtZW50KGEpJiZhIT09ZXx8d3IuaXMuc3RyaW5nKGEpJiYhd3IuZG9tLm1hdGNoZXNTZWxlY3RvcihlLGEpfHx3ci5pcy5mdW5jKGEpJiYhYSh7ZHJvcHpvbmU6aSxkcmFnZ2FibGVFbGVtZW50OmV9KSkpZm9yKHZhciB1PXdyLmlzLnN0cmluZyhpLnRhcmdldCk/aS5fY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKGkudGFyZ2V0KTp3ci5pcy5hcnJheShpLnRhcmdldCk/aS50YXJnZXQ6W2kudGFyZ2V0XSxzPTA7czx1Lmxlbmd0aDtzKyspe3ZhciBsO2w9dVtzXTtsIT09ZSYmci5wdXNoKHtkcm9wem9uZTppLGVsZW1lbnQ6bH0pfX19cmV0dXJuIHJ9KHQsZSkscj0wO3I8bi5sZW5ndGg7cisrKXt2YXIgbztvPW5bcl07by5yZWN0PW8uZHJvcHpvbmUuZ2V0UmVjdChvLmVsZW1lbnQpfXJldHVybiBufWZ1bmN0aW9uIGtyKHQsZSxuKXtmb3IodmFyIHI9dC5kcm9wU3RhdGUsbz10LmludGVyYWN0YWJsZSxpPXQuZWxlbWVudCxhPVtdLHU9MDt1PHIuYWN0aXZlRHJvcHMubGVuZ3RoO3UrKyl7cz1yLmFjdGl2ZURyb3BzW3VdO3ZhciBzLGw9cy5kcm9wem9uZSxjPXMuZWxlbWVudCxmPXMucmVjdDthLnB1c2gobC5kcm9wQ2hlY2soZSxuLG8saSxjLGYpP2M6bnVsbCl9dmFyIHA9d3IuZG9tLmluZGV4T2ZEZWVwZXN0RWxlbWVudChhKTtyZXR1cm4gci5hY3RpdmVEcm9wc1twXXx8bnVsbH1mdW5jdGlvbiBFcih0LGUsbil7dmFyIHI9dC5kcm9wU3RhdGUsbz17ZW50ZXI6bnVsbCxsZWF2ZTpudWxsLGFjdGl2YXRlOm51bGwsZGVhY3RpdmF0ZTpudWxsLG1vdmU6bnVsbCxkcm9wOm51bGx9O3JldHVyblwiZHJhZ3N0YXJ0XCI9PT1uLnR5cGUmJihvLmFjdGl2YXRlPW5ldyBQci5kZWZhdWx0KHIsbixcImRyb3BhY3RpdmF0ZVwiKSxvLmFjdGl2YXRlLnRhcmdldD1udWxsLG8uYWN0aXZhdGUuZHJvcHpvbmU9bnVsbCksXCJkcmFnZW5kXCI9PT1uLnR5cGUmJihvLmRlYWN0aXZhdGU9bmV3IFByLmRlZmF1bHQocixuLFwiZHJvcGRlYWN0aXZhdGVcIiksby5kZWFjdGl2YXRlLnRhcmdldD1udWxsLG8uZGVhY3RpdmF0ZS5kcm9wem9uZT1udWxsKSxyLnJlamVjdGVkfHwoci5jdXIuZWxlbWVudCE9PXIucHJldi5lbGVtZW50JiYoci5wcmV2LmRyb3B6b25lJiYoby5sZWF2ZT1uZXcgUHIuZGVmYXVsdChyLG4sXCJkcmFnbGVhdmVcIiksbi5kcmFnTGVhdmU9by5sZWF2ZS50YXJnZXQ9ci5wcmV2LmVsZW1lbnQsbi5wcmV2RHJvcHpvbmU9by5sZWF2ZS5kcm9wem9uZT1yLnByZXYuZHJvcHpvbmUpLHIuY3VyLmRyb3B6b25lJiYoby5lbnRlcj1uZXcgUHIuZGVmYXVsdChyLG4sXCJkcmFnZW50ZXJcIiksbi5kcmFnRW50ZXI9ci5jdXIuZWxlbWVudCxuLmRyb3B6b25lPXIuY3VyLmRyb3B6b25lKSksXCJkcmFnZW5kXCI9PT1uLnR5cGUmJnIuY3VyLmRyb3B6b25lJiYoby5kcm9wPW5ldyBQci5kZWZhdWx0KHIsbixcImRyb3BcIiksbi5kcm9wem9uZT1yLmN1ci5kcm9wem9uZSxuLnJlbGF0ZWRUYXJnZXQ9ci5jdXIuZWxlbWVudCksXCJkcmFnbW92ZVwiPT09bi50eXBlJiZyLmN1ci5kcm9wem9uZSYmKG8ubW92ZT1uZXcgUHIuZGVmYXVsdChyLG4sXCJkcm9wbW92ZVwiKSwoby5tb3ZlLmRyYWdtb3ZlPW4pLmRyb3B6b25lPXIuY3VyLmRyb3B6b25lKSksb31mdW5jdGlvbiBUcih0LGUpe3ZhciBuPXQuZHJvcFN0YXRlLHI9bi5hY3RpdmVEcm9wcyxvPW4uY3VyLGk9bi5wcmV2O2UubGVhdmUmJmkuZHJvcHpvbmUuZmlyZShlLmxlYXZlKSxlLm1vdmUmJm8uZHJvcHpvbmUuZmlyZShlLm1vdmUpLGUuZW50ZXImJm8uZHJvcHpvbmUuZmlyZShlLmVudGVyKSxlLmRyb3AmJm8uZHJvcHpvbmUuZmlyZShlLmRyb3ApLGUuZGVhY3RpdmF0ZSYmanIocixlLmRlYWN0aXZhdGUpLG4ucHJldi5kcm9wem9uZT1vLmRyb3B6b25lLG4ucHJldi5lbGVtZW50PW8uZWxlbWVudH1mdW5jdGlvbiBEcih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LmlFdmVudCxvPXQuZXZlbnQ7aWYoXCJkcmFnbW92ZVwiPT09ci50eXBlfHxcImRyYWdlbmRcIj09PXIudHlwZSl7dmFyIGk9bi5kcm9wU3RhdGU7ZS5keW5hbWljRHJvcCYmKGkuYWN0aXZlRHJvcHM9TXIoZSxuLmVsZW1lbnQpKTt2YXIgYT1yLHU9a3IobixhLG8pO2kucmVqZWN0ZWQ9aS5yZWplY3RlZCYmISF1JiZ1LmRyb3B6b25lPT09aS5jdXIuZHJvcHpvbmUmJnUuZWxlbWVudD09PWkuY3VyLmVsZW1lbnQsaS5jdXIuZHJvcHpvbmU9dSYmdS5kcm9wem9uZSxpLmN1ci5lbGVtZW50PXUmJnUuZWxlbWVudCxpLmV2ZW50cz1FcihuLDAsYSl9fXZhciBJcj17aWQ6XCJhY3Rpb25zL2Ryb3BcIixpbnN0YWxsOmZ1bmN0aW9uKGUpe3ZhciB0PWUuYWN0aW9ucyxuPWUuaW50ZXJhY3RTdGF0aWMscj1lLkludGVyYWN0YWJsZSxvPWUuZGVmYXVsdHM7ZS51c2VQbHVnaW4oX3IuZGVmYXVsdCksci5wcm90b3R5cGUuZHJvcHpvbmU9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKHQsZSl7aWYod3IuaXMub2JqZWN0KGUpKXtpZih0Lm9wdGlvbnMuZHJvcC5lbmFibGVkPSExIT09ZS5lbmFibGVkLGUubGlzdGVuZXJzKXt2YXIgbj13ci5ub3JtYWxpemVMaXN0ZW5lcnMoZS5saXN0ZW5lcnMpLHI9T2JqZWN0LmtleXMobikucmVkdWNlKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbL14oZW50ZXJ8bGVhdmUpLy50ZXN0KGUpP1wiZHJhZ1wiLmNvbmNhdChlKTovXihhY3RpdmF0ZXxkZWFjdGl2YXRlfG1vdmUpLy50ZXN0KGUpP1wiZHJvcFwiLmNvbmNhdChlKTplXT1uW2VdLHR9LHt9KTt0Lm9mZih0Lm9wdGlvbnMuZHJvcC5saXN0ZW5lcnMpLHQub24ociksdC5vcHRpb25zLmRyb3AubGlzdGVuZXJzPXJ9cmV0dXJuIHdyLmlzLmZ1bmMoZS5vbmRyb3ApJiZ0Lm9uKFwiZHJvcFwiLGUub25kcm9wKSx3ci5pcy5mdW5jKGUub25kcm9wYWN0aXZhdGUpJiZ0Lm9uKFwiZHJvcGFjdGl2YXRlXCIsZS5vbmRyb3BhY3RpdmF0ZSksd3IuaXMuZnVuYyhlLm9uZHJvcGRlYWN0aXZhdGUpJiZ0Lm9uKFwiZHJvcGRlYWN0aXZhdGVcIixlLm9uZHJvcGRlYWN0aXZhdGUpLHdyLmlzLmZ1bmMoZS5vbmRyYWdlbnRlcikmJnQub24oXCJkcmFnZW50ZXJcIixlLm9uZHJhZ2VudGVyKSx3ci5pcy5mdW5jKGUub25kcmFnbGVhdmUpJiZ0Lm9uKFwiZHJhZ2xlYXZlXCIsZS5vbmRyYWdsZWF2ZSksd3IuaXMuZnVuYyhlLm9uZHJvcG1vdmUpJiZ0Lm9uKFwiZHJvcG1vdmVcIixlLm9uZHJvcG1vdmUpLC9eKHBvaW50ZXJ8Y2VudGVyKSQvLnRlc3QoZS5vdmVybGFwKT90Lm9wdGlvbnMuZHJvcC5vdmVybGFwPWUub3ZlcmxhcDp3ci5pcy5udW1iZXIoZS5vdmVybGFwKSYmKHQub3B0aW9ucy5kcm9wLm92ZXJsYXA9TWF0aC5tYXgoTWF0aC5taW4oMSxlLm92ZXJsYXApLDApKSxcImFjY2VwdFwiaW4gZSYmKHQub3B0aW9ucy5kcm9wLmFjY2VwdD1lLmFjY2VwdCksXCJjaGVja2VyXCJpbiBlJiYodC5vcHRpb25zLmRyb3AuY2hlY2tlcj1lLmNoZWNrZXIpLHR9aWYod3IuaXMuYm9vbChlKSlyZXR1cm4gdC5vcHRpb25zLmRyb3AuZW5hYmxlZD1lLHQ7cmV0dXJuIHQub3B0aW9ucy5kcm9wfSh0aGlzLHQpfSxyLnByb3RvdHlwZS5kcm9wQ2hlY2s9ZnVuY3Rpb24odCxlLG4scixvLGkpe3JldHVybiBmdW5jdGlvbih0LGUsbixyLG8saSxhKXt2YXIgdT0hMTtpZighKGE9YXx8dC5nZXRSZWN0KGkpKSlyZXR1cm4hIXQub3B0aW9ucy5kcm9wLmNoZWNrZXImJnQub3B0aW9ucy5kcm9wLmNoZWNrZXIoZSxuLHUsdCxpLHIsbyk7dmFyIHM9dC5vcHRpb25zLmRyb3Aub3ZlcmxhcDtpZihcInBvaW50ZXJcIj09PXMpe3ZhciBsPXdyLmdldE9yaWdpblhZKHIsbyxcImRyYWdcIiksYz13ci5wb2ludGVyLmdldFBhZ2VYWShlKTtjLngrPWwueCxjLnkrPWwueTt2YXIgZj1jLng+YS5sZWZ0JiZjLng8YS5yaWdodCxwPWMueT5hLnRvcCYmYy55PGEuYm90dG9tO3U9ZiYmcH12YXIgZD1yLmdldFJlY3Qobyk7aWYoZCYmXCJjZW50ZXJcIj09PXMpe3ZhciB2PWQubGVmdCtkLndpZHRoLzIseT1kLnRvcCtkLmhlaWdodC8yO3U9dj49YS5sZWZ0JiZ2PD1hLnJpZ2h0JiZ5Pj1hLnRvcCYmeTw9YS5ib3R0b219aWYoZCYmd3IuaXMubnVtYmVyKHMpKXt2YXIgaD1NYXRoLm1heCgwLE1hdGgubWluKGEucmlnaHQsZC5yaWdodCktTWF0aC5tYXgoYS5sZWZ0LGQubGVmdCkpKk1hdGgubWF4KDAsTWF0aC5taW4oYS5ib3R0b20sZC5ib3R0b20pLU1hdGgubWF4KGEudG9wLGQudG9wKSkvKGQud2lkdGgqZC5oZWlnaHQpO3U9czw9aH10Lm9wdGlvbnMuZHJvcC5jaGVja2VyJiYodT10Lm9wdGlvbnMuZHJvcC5jaGVja2VyKGUsbix1LHQsaSxyLG8pKTtyZXR1cm4gdX0odGhpcyx0LGUsbixyLG8saSl9LG4uZHluYW1pY0Ryb3A9ZnVuY3Rpb24odCl7cmV0dXJuIHdyLmlzLmJvb2wodCk/KGUuZHluYW1pY0Ryb3A9dCxuKTplLmR5bmFtaWNEcm9wfSx3ci5leHRlbmQodC5waGFzZWxlc3NUeXBlcyx7ZHJhZ2VudGVyOiEwLGRyYWdsZWF2ZTohMCxkcm9wYWN0aXZhdGU6ITAsZHJvcGRlYWN0aXZhdGU6ITAsZHJvcG1vdmU6ITAsZHJvcDohMH0pLHQubWV0aG9kRGljdC5kcm9wPVwiZHJvcHpvbmVcIixlLmR5bmFtaWNEcm9wPSExLG8uYWN0aW9ucy5kcm9wPUlyLmRlZmF1bHRzfSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tc3RhcnRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uO1wiZHJhZ1wiPT09ZS5wcmVwYXJlZC5uYW1lJiYoZS5kcm9wU3RhdGU9e2N1cjp7ZHJvcHpvbmU6bnVsbCxlbGVtZW50Om51bGx9LHByZXY6e2Ryb3B6b25lOm51bGwsZWxlbWVudDpudWxsfSxyZWplY3RlZDpudWxsLGV2ZW50czpudWxsLGFjdGl2ZURyb3BzOltdfSl9LFwiaW50ZXJhY3Rpb25zOmFmdGVyLWFjdGlvbi1zdGFydFwiOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPSh0LmV2ZW50LHQuaUV2ZW50KTtpZihcImRyYWdcIj09PW4ucHJlcGFyZWQubmFtZSl7dmFyIG89bi5kcm9wU3RhdGU7by5hY3RpdmVEcm9wcz1udWxsLG8uZXZlbnRzPW51bGwsby5hY3RpdmVEcm9wcz1NcihlLG4uZWxlbWVudCksby5ldmVudHM9RXIobiwwLHIpLG8uZXZlbnRzLmFjdGl2YXRlJiYoanIoby5hY3RpdmVEcm9wcyxvLmV2ZW50cy5hY3RpdmF0ZSksZS5maXJlKFwiYWN0aW9ucy9kcm9wOnN0YXJ0XCIse2ludGVyYWN0aW9uOm4sZHJhZ0V2ZW50OnJ9KSl9fSxcImludGVyYWN0aW9uczphY3Rpb24tbW92ZVwiOkRyLFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1lbmRcIjpEcixcImludGVyYWN0aW9uczphZnRlci1hY3Rpb24tbW92ZVwiOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPXQuaUV2ZW50O1wiZHJhZ1wiPT09bi5wcmVwYXJlZC5uYW1lJiYoVHIobixuLmRyb3BTdGF0ZS5ldmVudHMpLGUuZmlyZShcImFjdGlvbnMvZHJvcDptb3ZlXCIse2ludGVyYWN0aW9uOm4sZHJhZ0V2ZW50OnJ9KSxuLmRyb3BTdGF0ZS5ldmVudHM9e30pfSxcImludGVyYWN0aW9uczphZnRlci1hY3Rpb24tZW5kXCI6ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uLHI9dC5pRXZlbnQ7XCJkcmFnXCI9PT1uLnByZXBhcmVkLm5hbWUmJihUcihuLG4uZHJvcFN0YXRlLmV2ZW50cyksZS5maXJlKFwiYWN0aW9ucy9kcm9wOmVuZFwiLHtpbnRlcmFjdGlvbjpuLGRyYWdFdmVudDpyfSkpfSxcImludGVyYWN0aW9uczpzdG9wXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtpZihcImRyYWdcIj09PWUucHJlcGFyZWQubmFtZSl7dmFyIG49ZS5kcm9wU3RhdGU7biYmKG4uYWN0aXZlRHJvcHM9bnVsbCxuLmV2ZW50cz1udWxsLG4uY3VyLmRyb3B6b25lPW51bGwsbi5jdXIuZWxlbWVudD1udWxsLG4ucHJldi5kcm9wem9uZT1udWxsLG4ucHJldi5lbGVtZW50PW51bGwsbi5yZWplY3RlZD0hMSl9fX0sZ2V0QWN0aXZlRHJvcHM6TXIsZ2V0RHJvcDprcixnZXREcm9wRXZlbnRzOkVyLGZpcmVEcm9wRXZlbnRzOlRyLGRlZmF1bHRzOntlbmFibGVkOiExLGFjY2VwdDpudWxsLG92ZXJsYXA6XCJwb2ludGVyXCJ9fSx6cj1Jcjttci5kZWZhdWx0PXpyO3ZhciBBcj17fTtmdW5jdGlvbiBDcih0KXtyZXR1cm4oQ3I9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShBcixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxBci5kZWZhdWx0PXZvaWQgMDt2YXIgV3I9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09Q3IodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9UnIoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0obGUpO2Z1bmN0aW9uIFJyKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gUnI9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBGcih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5pRXZlbnQscj10LnBoYXNlO2lmKFwiZ2VzdHVyZVwiPT09ZS5wcmVwYXJlZC5uYW1lKXt2YXIgbz1lLnBvaW50ZXJzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5wb2ludGVyfSksaT1cInN0YXJ0XCI9PT1yLGE9XCJlbmRcIj09PXIsdT1lLmludGVyYWN0YWJsZS5vcHRpb25zLmRlbHRhU291cmNlO2lmKG4udG91Y2hlcz1bb1swXSxvWzFdXSxpKW4uZGlzdGFuY2U9V3IucG9pbnRlci50b3VjaERpc3RhbmNlKG8sdSksbi5ib3g9V3IucG9pbnRlci50b3VjaEJCb3gobyksbi5zY2FsZT0xLG4uZHM9MCxuLmFuZ2xlPVdyLnBvaW50ZXIudG91Y2hBbmdsZShvLHUpLG4uZGE9MCxlLmdlc3R1cmUuc3RhcnREaXN0YW5jZT1uLmRpc3RhbmNlLGUuZ2VzdHVyZS5zdGFydEFuZ2xlPW4uYW5nbGU7ZWxzZSBpZihhKXt2YXIgcz1lLnByZXZFdmVudDtuLmRpc3RhbmNlPXMuZGlzdGFuY2Usbi5ib3g9cy5ib3gsbi5zY2FsZT1zLnNjYWxlLG4uZHM9MCxuLmFuZ2xlPXMuYW5nbGUsbi5kYT0wfWVsc2Ugbi5kaXN0YW5jZT1Xci5wb2ludGVyLnRvdWNoRGlzdGFuY2Uobyx1KSxuLmJveD1Xci5wb2ludGVyLnRvdWNoQkJveChvKSxuLnNjYWxlPW4uZGlzdGFuY2UvZS5nZXN0dXJlLnN0YXJ0RGlzdGFuY2Usbi5hbmdsZT1Xci5wb2ludGVyLnRvdWNoQW5nbGUobyx1KSxuLmRzPW4uc2NhbGUtZS5nZXN0dXJlLnNjYWxlLG4uZGE9bi5hbmdsZS1lLmdlc3R1cmUuYW5nbGU7ZS5nZXN0dXJlLmRpc3RhbmNlPW4uZGlzdGFuY2UsZS5nZXN0dXJlLmFuZ2xlPW4uYW5nbGUsV3IuaXMubnVtYmVyKG4uc2NhbGUpJiZuLnNjYWxlIT09MS8wJiYhaXNOYU4obi5zY2FsZSkmJihlLmdlc3R1cmUuc2NhbGU9bi5zY2FsZSl9fXZhciBYcj17aWQ6XCJhY3Rpb25zL2dlc3R1cmVcIixiZWZvcmU6W1wiYWN0aW9ucy9kcmFnXCIsXCJhY3Rpb25zL3Jlc2l6ZVwiXSxpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPXQuYWN0aW9ucyxuPXQuSW50ZXJhY3RhYmxlLHI9dC5kZWZhdWx0cztuLnByb3RvdHlwZS5nZXN0dXJhYmxlPWZ1bmN0aW9uKHQpe3JldHVybiBXci5pcy5vYmplY3QodCk/KHRoaXMub3B0aW9ucy5nZXN0dXJlLmVuYWJsZWQ9ITEhPT10LmVuYWJsZWQsdGhpcy5zZXRQZXJBY3Rpb24oXCJnZXN0dXJlXCIsdCksdGhpcy5zZXRPbkV2ZW50cyhcImdlc3R1cmVcIix0KSx0aGlzKTpXci5pcy5ib29sKHQpPyh0aGlzLm9wdGlvbnMuZ2VzdHVyZS5lbmFibGVkPXQsdGhpcyk6dGhpcy5vcHRpb25zLmdlc3R1cmV9LGUubWFwLmdlc3R1cmU9WHIsZS5tZXRob2REaWN0Lmdlc3R1cmU9XCJnZXN0dXJhYmxlXCIsci5hY3Rpb25zLmdlc3R1cmU9WHIuZGVmYXVsdHN9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6YWN0aW9uLXN0YXJ0XCI6RnIsXCJpbnRlcmFjdGlvbnM6YWN0aW9uLW1vdmVcIjpGcixcImludGVyYWN0aW9uczphY3Rpb24tZW5kXCI6RnIsXCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dC5pbnRlcmFjdGlvbi5nZXN0dXJlPXthbmdsZTowLGRpc3RhbmNlOjAsc2NhbGU6MSxzdGFydEFuZ2xlOjAsc3RhcnREaXN0YW5jZTowfX0sXCJhdXRvLXN0YXJ0OmNoZWNrXCI6ZnVuY3Rpb24odCl7aWYoISh0LmludGVyYWN0aW9uLnBvaW50ZXJzLmxlbmd0aDwyKSl7dmFyIGU9dC5pbnRlcmFjdGFibGUub3B0aW9ucy5nZXN0dXJlO2lmKGUmJmUuZW5hYmxlZClyZXR1cm4hKHQuYWN0aW9uPXtuYW1lOlwiZ2VzdHVyZVwifSl9fX0sZGVmYXVsdHM6e30sZ2V0Q3Vyc29yOmZ1bmN0aW9uKCl7cmV0dXJuXCJcIn19LFlyPVhyO0FyLmRlZmF1bHQ9WXI7dmFyIE5yPXt9O2Z1bmN0aW9uIExyKHQpe3JldHVybihMcj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KE5yLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE5yLmRlZmF1bHQ9dm9pZCAwO3ZhciBCcixWcj1IcigkKSxxcj0oQnI9Y3QpJiZCci5fX2VzTW9kdWxlP0JyOntkZWZhdWx0OkJyfSxVcj1Icih3KTtmdW5jdGlvbiBHcigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIEdyPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gSHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09THIodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9R3IoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiBLcih0LGUsbixyLG8saSxhKXtpZighZSlyZXR1cm4hMTtpZighMD09PWUpe3ZhciB1PVVyLm51bWJlcihpLndpZHRoKT9pLndpZHRoOmkucmlnaHQtaS5sZWZ0LHM9VXIubnVtYmVyKGkuaGVpZ2h0KT9pLmhlaWdodDppLmJvdHRvbS1pLnRvcDtpZihhPU1hdGgubWluKGEsKFwibGVmdFwiPT09dHx8XCJyaWdodFwiPT09dD91OnMpLzIpLHU8MCYmKFwibGVmdFwiPT09dD90PVwicmlnaHRcIjpcInJpZ2h0XCI9PT10JiYodD1cImxlZnRcIikpLHM8MCYmKFwidG9wXCI9PT10P3Q9XCJib3R0b21cIjpcImJvdHRvbVwiPT09dCYmKHQ9XCJ0b3BcIikpLFwibGVmdFwiPT09dClyZXR1cm4gbi54PCgwPD11P2kubGVmdDppLnJpZ2h0KSthO2lmKFwidG9wXCI9PT10KXJldHVybiBuLnk8KDA8PXM/aS50b3A6aS5ib3R0b20pK2E7aWYoXCJyaWdodFwiPT09dClyZXR1cm4gbi54PigwPD11P2kucmlnaHQ6aS5sZWZ0KS1hO2lmKFwiYm90dG9tXCI9PT10KXJldHVybiBuLnk+KDA8PXM/aS5ib3R0b206aS50b3ApLWF9cmV0dXJuISFVci5lbGVtZW50KHIpJiYoVXIuZWxlbWVudChlKT9lPT09cjpWci5tYXRjaGVzVXBUbyhyLGUsbykpfWZ1bmN0aW9uICRyKHQpe3ZhciBlPXQuaUV2ZW50LG49dC5pbnRlcmFjdGlvbjtpZihcInJlc2l6ZVwiPT09bi5wcmVwYXJlZC5uYW1lJiZuLnJlc2l6ZUF4ZXMpe3ZhciByPWU7bi5pbnRlcmFjdGFibGUub3B0aW9ucy5yZXNpemUuc3F1YXJlPyhcInlcIj09PW4ucmVzaXplQXhlcz9yLmRlbHRhLng9ci5kZWx0YS55OnIuZGVsdGEueT1yLmRlbHRhLngsci5heGVzPVwieHlcIik6KHIuYXhlcz1uLnJlc2l6ZUF4ZXMsXCJ4XCI9PT1uLnJlc2l6ZUF4ZXM/ci5kZWx0YS55PTA6XCJ5XCI9PT1uLnJlc2l6ZUF4ZXMmJihyLmRlbHRhLng9MCkpfX12YXIgWnI9e2lkOlwiYWN0aW9ucy9yZXNpemVcIixiZWZvcmU6W1wiYWN0aW9ucy9kcmFnXCJdLGluc3RhbGw6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5hY3Rpb25zLG49ZS5icm93c2VyLHI9ZS5JbnRlcmFjdGFibGUsbz1lLmRlZmF1bHRzO1pyLmN1cnNvcnM9bi5pc0llOT97eDpcImUtcmVzaXplXCIseTpcInMtcmVzaXplXCIseHk6XCJzZS1yZXNpemVcIix0b3A6XCJuLXJlc2l6ZVwiLGxlZnQ6XCJ3LXJlc2l6ZVwiLGJvdHRvbTpcInMtcmVzaXplXCIscmlnaHQ6XCJlLXJlc2l6ZVwiLHRvcGxlZnQ6XCJzZS1yZXNpemVcIixib3R0b21yaWdodDpcInNlLXJlc2l6ZVwiLHRvcHJpZ2h0OlwibmUtcmVzaXplXCIsYm90dG9tbGVmdDpcIm5lLXJlc2l6ZVwifTp7eDpcImV3LXJlc2l6ZVwiLHk6XCJucy1yZXNpemVcIix4eTpcIm53c2UtcmVzaXplXCIsdG9wOlwibnMtcmVzaXplXCIsbGVmdDpcImV3LXJlc2l6ZVwiLGJvdHRvbTpcIm5zLXJlc2l6ZVwiLHJpZ2h0OlwiZXctcmVzaXplXCIsdG9wbGVmdDpcIm53c2UtcmVzaXplXCIsYm90dG9tcmlnaHQ6XCJud3NlLXJlc2l6ZVwiLHRvcHJpZ2h0OlwibmVzdy1yZXNpemVcIixib3R0b21sZWZ0OlwibmVzdy1yZXNpemVcIn0sWnIuZGVmYXVsdE1hcmdpbj1uLnN1cHBvcnRzVG91Y2h8fG4uc3VwcG9ydHNQb2ludGVyRXZlbnQ/MjA6MTAsci5wcm90b3R5cGUucmVzaXphYmxlPWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbih0LGUsbil7aWYoVXIub2JqZWN0KGUpKXJldHVybiB0Lm9wdGlvbnMucmVzaXplLmVuYWJsZWQ9ITEhPT1lLmVuYWJsZWQsdC5zZXRQZXJBY3Rpb24oXCJyZXNpemVcIixlKSx0LnNldE9uRXZlbnRzKFwicmVzaXplXCIsZSksVXIuc3RyaW5nKGUuYXhpcykmJi9eeCR8XnkkfF54eSQvLnRlc3QoZS5heGlzKT90Lm9wdGlvbnMucmVzaXplLmF4aXM9ZS5heGlzOm51bGw9PT1lLmF4aXMmJih0Lm9wdGlvbnMucmVzaXplLmF4aXM9bi5kZWZhdWx0cy5hY3Rpb25zLnJlc2l6ZS5heGlzKSxVci5ib29sKGUucHJlc2VydmVBc3BlY3RSYXRpbyk/dC5vcHRpb25zLnJlc2l6ZS5wcmVzZXJ2ZUFzcGVjdFJhdGlvPWUucHJlc2VydmVBc3BlY3RSYXRpbzpVci5ib29sKGUuc3F1YXJlKSYmKHQub3B0aW9ucy5yZXNpemUuc3F1YXJlPWUuc3F1YXJlKSx0O2lmKFVyLmJvb2woZSkpcmV0dXJuIHQub3B0aW9ucy5yZXNpemUuZW5hYmxlZD1lLHQ7cmV0dXJuIHQub3B0aW9ucy5yZXNpemV9KHRoaXMsdCxlKX0sdC5tYXAucmVzaXplPVpyLHQubWV0aG9kRGljdC5yZXNpemU9XCJyZXNpemFibGVcIixvLmFjdGlvbnMucmVzaXplPVpyLmRlZmF1bHRzfSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOm5ld1wiOmZ1bmN0aW9uKHQpe3QuaW50ZXJhY3Rpb24ucmVzaXplQXhlcz1cInh5XCJ9LFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1zdGFydFwiOmZ1bmN0aW9uKHQpeyFmdW5jdGlvbih0KXt2YXIgZT10LmlFdmVudCxuPXQuaW50ZXJhY3Rpb247aWYoXCJyZXNpemVcIj09PW4ucHJlcGFyZWQubmFtZSYmbi5wcmVwYXJlZC5lZGdlcyl7dmFyIHI9ZSxvPW4ucmVjdDtuLl9yZWN0cz17c3RhcnQ6KDAscXIuZGVmYXVsdCkoe30sbyksY29ycmVjdGVkOigwLHFyLmRlZmF1bHQpKHt9LG8pLHByZXZpb3VzOigwLHFyLmRlZmF1bHQpKHt9LG8pLGRlbHRhOntsZWZ0OjAscmlnaHQ6MCx3aWR0aDowLHRvcDowLGJvdHRvbTowLGhlaWdodDowfX0sci5lZGdlcz1uLnByZXBhcmVkLmVkZ2VzLHIucmVjdD1uLl9yZWN0cy5jb3JyZWN0ZWQsci5kZWx0YVJlY3Q9bi5fcmVjdHMuZGVsdGF9fSh0KSwkcih0KX0sXCJpbnRlcmFjdGlvbnM6YWN0aW9uLW1vdmVcIjpmdW5jdGlvbih0KXshZnVuY3Rpb24odCl7dmFyIGU9dC5pRXZlbnQsbj10LmludGVyYWN0aW9uO2lmKFwicmVzaXplXCI9PT1uLnByZXBhcmVkLm5hbWUmJm4ucHJlcGFyZWQuZWRnZXMpe3ZhciByPWUsbz1uLmludGVyYWN0YWJsZS5vcHRpb25zLnJlc2l6ZS5pbnZlcnQsaT1cInJlcG9zaXRpb25cIj09PW98fFwibmVnYXRlXCI9PT1vLGE9bi5yZWN0LHU9bi5fcmVjdHMscz11LnN0YXJ0LGw9dS5jb3JyZWN0ZWQsYz11LmRlbHRhLGY9dS5wcmV2aW91cztpZigoMCxxci5kZWZhdWx0KShmLGwpLGkpe2lmKCgwLHFyLmRlZmF1bHQpKGwsYSksXCJyZXBvc2l0aW9uXCI9PT1vKXtpZihsLnRvcD5sLmJvdHRvbSl7dmFyIHA9bC50b3A7bC50b3A9bC5ib3R0b20sbC5ib3R0b209cH1pZihsLmxlZnQ+bC5yaWdodCl7dmFyIGQ9bC5sZWZ0O2wubGVmdD1sLnJpZ2h0LGwucmlnaHQ9ZH19fWVsc2UgbC50b3A9TWF0aC5taW4oYS50b3Ascy5ib3R0b20pLGwuYm90dG9tPU1hdGgubWF4KGEuYm90dG9tLHMudG9wKSxsLmxlZnQ9TWF0aC5taW4oYS5sZWZ0LHMucmlnaHQpLGwucmlnaHQ9TWF0aC5tYXgoYS5yaWdodCxzLmxlZnQpO2Zvcih2YXIgdiBpbiBsLndpZHRoPWwucmlnaHQtbC5sZWZ0LGwuaGVpZ2h0PWwuYm90dG9tLWwudG9wLGwpY1t2XT1sW3ZdLWZbdl07ci5lZGdlcz1uLnByZXBhcmVkLmVkZ2VzLHIucmVjdD1sLHIuZGVsdGFSZWN0PWN9fSh0KSwkcih0KX0sXCJpbnRlcmFjdGlvbnM6YWN0aW9uLWVuZFwiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaUV2ZW50LG49dC5pbnRlcmFjdGlvbjtpZihcInJlc2l6ZVwiPT09bi5wcmVwYXJlZC5uYW1lJiZuLnByZXBhcmVkLmVkZ2VzKXt2YXIgcj1lO3IuZWRnZXM9bi5wcmVwYXJlZC5lZGdlcyxyLnJlY3Q9bi5fcmVjdHMuY29ycmVjdGVkLHIuZGVsdGFSZWN0PW4uX3JlY3RzLmRlbHRhfX0sXCJhdXRvLXN0YXJ0OmNoZWNrXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuaW50ZXJhY3RhYmxlLHI9dC5lbGVtZW50LG89dC5yZWN0LGk9dC5idXR0b25zO2lmKG8pe3ZhciBhPSgwLHFyLmRlZmF1bHQpKHt9LGUuY29vcmRzLmN1ci5wYWdlKSx1PW4ub3B0aW9ucy5yZXNpemU7aWYodSYmdS5lbmFibGVkJiYoIWUucG9pbnRlcklzRG93bnx8IS9tb3VzZXxwb2ludGVyLy50ZXN0KGUucG9pbnRlclR5cGUpfHwwIT0oaSZ1Lm1vdXNlQnV0dG9ucykpKXtpZihVci5vYmplY3QodS5lZGdlcykpe3ZhciBzPXtsZWZ0OiExLHJpZ2h0OiExLHRvcDohMSxib3R0b206ITF9O2Zvcih2YXIgbCBpbiBzKXNbbF09S3IobCx1LmVkZ2VzW2xdLGEsZS5fbGF0ZXN0UG9pbnRlci5ldmVudFRhcmdldCxyLG8sdS5tYXJnaW58fFpyLmRlZmF1bHRNYXJnaW4pO3MubGVmdD1zLmxlZnQmJiFzLnJpZ2h0LHMudG9wPXMudG9wJiYhcy5ib3R0b20sKHMubGVmdHx8cy5yaWdodHx8cy50b3B8fHMuYm90dG9tKSYmKHQuYWN0aW9uPXtuYW1lOlwicmVzaXplXCIsZWRnZXM6c30pfWVsc2V7dmFyIGM9XCJ5XCIhPT11LmF4aXMmJmEueD5vLnJpZ2h0LVpyLmRlZmF1bHRNYXJnaW4sZj1cInhcIiE9PXUuYXhpcyYmYS55Pm8uYm90dG9tLVpyLmRlZmF1bHRNYXJnaW47KGN8fGYpJiYodC5hY3Rpb249e25hbWU6XCJyZXNpemVcIixheGVzOihjP1wieFwiOlwiXCIpKyhmP1wieVwiOlwiXCIpfSl9cmV0dXJuIXQuYWN0aW9uJiZ2b2lkIDB9fX19LGRlZmF1bHRzOntzcXVhcmU6ITEscHJlc2VydmVBc3BlY3RSYXRpbzohMSxheGlzOlwieHlcIixtYXJnaW46TmFOLGVkZ2VzOm51bGwsaW52ZXJ0Olwibm9uZVwifSxjdXJzb3JzOm51bGwsZ2V0Q3Vyc29yOmZ1bmN0aW9uKHQpe3ZhciBlPXQuZWRnZXMsbj10LmF4aXMscj10Lm5hbWUsbz1aci5jdXJzb3JzLGk9bnVsbDtpZihuKWk9b1tyK25dO2Vsc2UgaWYoZSl7Zm9yKHZhciBhPVwiXCIsdT1bXCJ0b3BcIixcImJvdHRvbVwiLFwibGVmdFwiLFwicmlnaHRcIl0scz0wO3M8dS5sZW5ndGg7cysrKXt2YXIgbD11W3NdO2VbbF0mJihhKz1sKX1pPW9bYV19cmV0dXJuIGl9LGRlZmF1bHRNYXJnaW46bnVsbH0sSnI9WnI7TnIuZGVmYXVsdD1Kcjt2YXIgUXI9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFFyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRcixcImRyYWdcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdG8uZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoUXIsXCJkcm9wXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGVvLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFFyLFwiZ2VzdHVyZVwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuby5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRcixcInJlc2l6ZVwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiByby5kZWZhdWx0fX0pLFFyLmRlZmF1bHQ9dm9pZCAwO3ZhciB0bz1vbyh2KSxlbz1vbyhtciksbm89b28oQXIpLHJvPW9vKE5yKTtmdW5jdGlvbiBvbyh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIGlvPXtpZDpcImFjdGlvbnNcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3QudXNlUGx1Z2luKG5vLmRlZmF1bHQpLHQudXNlUGx1Z2luKHJvLmRlZmF1bHQpLHQudXNlUGx1Z2luKHRvLmRlZmF1bHQpLHQudXNlUGx1Z2luKGVvLmRlZmF1bHQpfX07UXIuZGVmYXVsdD1pbzt2YXIgYW89e307T2JqZWN0LmRlZmluZVByb3BlcnR5KGFvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGFvLmRlZmF1bHQ9dm9pZCAwO2FvLmRlZmF1bHQ9e307dmFyIHVvPXt9O2Z1bmN0aW9uIHNvKHQpe3JldHVybihzbz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHVvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHVvLmdldENvbnRhaW5lcj1nbyx1by5nZXRTY3JvbGw9Ym8sdW8uZ2V0U2Nyb2xsU2l6ZT1mdW5jdGlvbih0KXtmby53aW5kb3codCkmJih0PXdpbmRvdy5kb2N1bWVudC5ib2R5KTtyZXR1cm57eDp0LnNjcm9sbFdpZHRoLHk6dC5zY3JvbGxIZWlnaHR9fSx1by5nZXRTY3JvbGxTaXplRGVsdGE9ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uLHI9dC5lbGVtZW50LG89biYmbi5pbnRlcmFjdGFibGUub3B0aW9uc1tuLnByZXBhcmVkLm5hbWVdLmF1dG9TY3JvbGw7aWYoIW98fCFvLmVuYWJsZWQpcmV0dXJuIGUoKSx7eDowLHk6MH07dmFyIGk9Z28oby5jb250YWluZXIsbi5pbnRlcmFjdGFibGUsciksYT1ibyhpKTtlKCk7dmFyIHU9Ym8oaSk7cmV0dXJue3g6dS54LWEueCx5OnUueS1hLnl9fSx1by5kZWZhdWx0PXZvaWQgMDt2YXIgbG8sY289eW8oJCksZm89eW8odykscG89KGxvPW9lKSYmbG8uX19lc01vZHVsZT9sbzp7ZGVmYXVsdDpsb307ZnVuY3Rpb24gdm8oKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiB2bz1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIHlvKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PXNvKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPXZvKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfXJldHVybiBuLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pLG59dmFyIGhvPXtkZWZhdWx0czp7ZW5hYmxlZDohMSxtYXJnaW46NjAsY29udGFpbmVyOm51bGwsc3BlZWQ6MzAwfSxub3c6RGF0ZS5ub3csaW50ZXJhY3Rpb246bnVsbCxpOjAseDowLHk6MCxpc1Njcm9sbGluZzohMSxwcmV2VGltZTowLG1hcmdpbjowLHNwZWVkOjAsc3RhcnQ6ZnVuY3Rpb24odCl7aG8uaXNTY3JvbGxpbmc9ITAscG8uZGVmYXVsdC5jYW5jZWwoaG8uaSksKHQuYXV0b1Njcm9sbD1obykuaW50ZXJhY3Rpb249dCxoby5wcmV2VGltZT1oby5ub3coKSxoby5pPXBvLmRlZmF1bHQucmVxdWVzdChoby5zY3JvbGwpfSxzdG9wOmZ1bmN0aW9uKCl7aG8uaXNTY3JvbGxpbmc9ITEsaG8uaW50ZXJhY3Rpb24mJihoby5pbnRlcmFjdGlvbi5hdXRvU2Nyb2xsPW51bGwpLHBvLmRlZmF1bHQuY2FuY2VsKGhvLmkpfSxzY3JvbGw6ZnVuY3Rpb24oKXt2YXIgdD1oby5pbnRlcmFjdGlvbixlPXQuaW50ZXJhY3RhYmxlLG49dC5lbGVtZW50LHI9dC5wcmVwYXJlZC5uYW1lLG89ZS5vcHRpb25zW3JdLmF1dG9TY3JvbGwsaT1nbyhvLmNvbnRhaW5lcixlLG4pLGE9aG8ubm93KCksdT0oYS1oby5wcmV2VGltZSkvMWUzLHM9by5zcGVlZCp1O2lmKDE8PXMpe3ZhciBsPXt4OmhvLngqcyx5OmhvLnkqc307aWYobC54fHxsLnkpe3ZhciBjPWJvKGkpO2ZvLndpbmRvdyhpKT9pLnNjcm9sbEJ5KGwueCxsLnkpOmkmJihpLnNjcm9sbExlZnQrPWwueCxpLnNjcm9sbFRvcCs9bC55KTt2YXIgZj1ibyhpKSxwPXt4OmYueC1jLngseTpmLnktYy55fTsocC54fHxwLnkpJiZlLmZpcmUoe3R5cGU6XCJhdXRvc2Nyb2xsXCIsdGFyZ2V0Om4saW50ZXJhY3RhYmxlOmUsZGVsdGE6cCxpbnRlcmFjdGlvbjp0LGNvbnRhaW5lcjppfSl9aG8ucHJldlRpbWU9YX1oby5pc1Njcm9sbGluZyYmKHBvLmRlZmF1bHQuY2FuY2VsKGhvLmkpLGhvLmk9cG8uZGVmYXVsdC5yZXF1ZXN0KGhvLnNjcm9sbCkpfSxjaGVjazpmdW5jdGlvbih0LGUpe3ZhciBuPXQub3B0aW9ucztyZXR1cm4gbltlXS5hdXRvU2Nyb2xsJiZuW2VdLmF1dG9TY3JvbGwuZW5hYmxlZH0sb25JbnRlcmFjdGlvbk1vdmU6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQucG9pbnRlcjtpZihlLmludGVyYWN0aW5nKCkmJmhvLmNoZWNrKGUuaW50ZXJhY3RhYmxlLGUucHJlcGFyZWQubmFtZSkpaWYoZS5zaW11bGF0aW9uKWhvLng9aG8ueT0wO2Vsc2V7dmFyIHIsbyxpLGEsdT1lLmludGVyYWN0YWJsZSxzPWUuZWxlbWVudCxsPWUucHJlcGFyZWQubmFtZSxjPXUub3B0aW9uc1tsXS5hdXRvU2Nyb2xsLGY9Z28oYy5jb250YWluZXIsdSxzKTtpZihmby53aW5kb3coZikpYT1uLmNsaWVudFg8aG8ubWFyZ2luLHI9bi5jbGllbnRZPGhvLm1hcmdpbixvPW4uY2xpZW50WD5mLmlubmVyV2lkdGgtaG8ubWFyZ2luLGk9bi5jbGllbnRZPmYuaW5uZXJIZWlnaHQtaG8ubWFyZ2luO2Vsc2V7dmFyIHA9Y28uZ2V0RWxlbWVudENsaWVudFJlY3QoZik7YT1uLmNsaWVudFg8cC5sZWZ0K2hvLm1hcmdpbixyPW4uY2xpZW50WTxwLnRvcCtoby5tYXJnaW4sbz1uLmNsaWVudFg+cC5yaWdodC1oby5tYXJnaW4saT1uLmNsaWVudFk+cC5ib3R0b20taG8ubWFyZ2lufWhvLng9bz8xOmE/LTE6MCxoby55PWk/MTpyPy0xOjAsaG8uaXNTY3JvbGxpbmd8fChoby5tYXJnaW49Yy5tYXJnaW4saG8uc3BlZWQ9Yy5zcGVlZCxoby5zdGFydChlKSl9fX07ZnVuY3Rpb24gZ28odCxlLG4pe3JldHVybihmby5zdHJpbmcodCk/KDAsJHQuZ2V0U3RyaW5nT3B0aW9uUmVzdWx0KSh0LGUsbik6dCl8fCgwLE8uZ2V0V2luZG93KShuKX1mdW5jdGlvbiBibyh0KXtyZXR1cm4gZm8ud2luZG93KHQpJiYodD13aW5kb3cuZG9jdW1lbnQuYm9keSkse3g6dC5zY3JvbGxMZWZ0LHk6dC5zY3JvbGxUb3B9fXZhciBtbz17aWQ6XCJhdXRvLXNjcm9sbFwiLGluc3RhbGw6ZnVuY3Rpb24odCl7dmFyIGU9dC5kZWZhdWx0cyxuPXQuYWN0aW9uczsodC5hdXRvU2Nyb2xsPWhvKS5ub3c9ZnVuY3Rpb24oKXtyZXR1cm4gdC5ub3coKX0sbi5waGFzZWxlc3NUeXBlcy5hdXRvc2Nyb2xsPSEwLGUucGVyQWN0aW9uLmF1dG9TY3JvbGw9aG8uZGVmYXVsdHN9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dC5pbnRlcmFjdGlvbi5hdXRvU2Nyb2xsPW51bGx9LFwiaW50ZXJhY3Rpb25zOmRlc3Ryb3lcIjpmdW5jdGlvbih0KXt0LmludGVyYWN0aW9uLmF1dG9TY3JvbGw9bnVsbCxoby5zdG9wKCksaG8uaW50ZXJhY3Rpb24mJihoby5pbnRlcmFjdGlvbj1udWxsKX0sXCJpbnRlcmFjdGlvbnM6c3RvcFwiOmhvLnN0b3AsXCJpbnRlcmFjdGlvbnM6YWN0aW9uLW1vdmVcIjpmdW5jdGlvbih0KXtyZXR1cm4gaG8ub25JbnRlcmFjdGlvbk1vdmUodCl9fX07dW8uZGVmYXVsdD1tbzt2YXIgT289e307ZnVuY3Rpb24gd28odCl7cmV0dXJuKHdvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoT28sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT28uZGVmYXVsdD12b2lkIDA7dmFyIF9vPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PXdvKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPVBvKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpO2Z1bmN0aW9uIFBvKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gUG89ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiB4byh0KXtyZXR1cm4gX28uYm9vbCh0KT8odGhpcy5vcHRpb25zLnN0eWxlQ3Vyc29yPXQsdGhpcyk6bnVsbD09PXQ/KGRlbGV0ZSB0aGlzLm9wdGlvbnMuc3R5bGVDdXJzb3IsdGhpcyk6dGhpcy5vcHRpb25zLnN0eWxlQ3Vyc29yfWZ1bmN0aW9uIFNvKHQpe3JldHVybiBfby5mdW5jKHQpPyh0aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcj10LHRoaXMpOm51bGw9PT10PyhkZWxldGUgdGhpcy5vcHRpb25zLmFjdGlvbkNoZWNrZXIsdGhpcyk6dGhpcy5vcHRpb25zLmFjdGlvbkNoZWNrZXJ9dmFyIGpvPXtpZDpcImF1dG8tc3RhcnQvaW50ZXJhY3RhYmxlTWV0aG9kc1wiLGluc3RhbGw6ZnVuY3Rpb24oZCl7dmFyIHQ9ZC5JbnRlcmFjdGFibGU7dC5wcm90b3R5cGUuZ2V0QWN0aW9uPWZ1bmN0aW9uKHQsZSxuLHIpe3ZhciBvLGksYSx1LHMsbCxjLGYscD0oaT1lLGE9bix1PXIscz1kLGw9KG89dGhpcykuZ2V0UmVjdCh1KSxjPWkuYnV0dG9uc3x8ezA6MSwxOjQsMzo4LDQ6MTZ9W2kuYnV0dG9uXSxmPXthY3Rpb246bnVsbCxpbnRlcmFjdGFibGU6byxpbnRlcmFjdGlvbjphLGVsZW1lbnQ6dSxyZWN0OmwsYnV0dG9uczpjfSxzLmZpcmUoXCJhdXRvLXN0YXJ0OmNoZWNrXCIsZiksZi5hY3Rpb24pO3JldHVybiB0aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcj90aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcih0LGUscCx0aGlzLHIsbik6cH0sdC5wcm90b3R5cGUuaWdub3JlRnJvbT0oMCxsZS53YXJuT25jZSkoZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2JhY2tDb21wYXRPcHRpb24oXCJpZ25vcmVGcm9tXCIsdCl9LFwiSW50ZXJhY3RhYmxlLmlnbm9yZUZyb20oKSBoYXMgYmVlbiBkZXByZWNhdGVkLiBVc2UgSW50ZXJhY3RibGUuZHJhZ2dhYmxlKHtpZ25vcmVGcm9tOiBuZXdWYWx1ZX0pLlwiKSx0LnByb3RvdHlwZS5hbGxvd0Zyb209KDAsbGUud2Fybk9uY2UpKGZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLl9iYWNrQ29tcGF0T3B0aW9uKFwiYWxsb3dGcm9tXCIsdCl9LFwiSW50ZXJhY3RhYmxlLmFsbG93RnJvbSgpIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFVzZSBJbnRlcmFjdGJsZS5kcmFnZ2FibGUoe2FsbG93RnJvbTogbmV3VmFsdWV9KS5cIiksdC5wcm90b3R5cGUuYWN0aW9uQ2hlY2tlcj1Tbyx0LnByb3RvdHlwZS5zdHlsZUN1cnNvcj14b319O09vLmRlZmF1bHQ9am87dmFyIE1vPXt9O2Z1bmN0aW9uIGtvKHQpe3JldHVybihrbz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KE1vLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE1vLmRlZmF1bHQ9dm9pZCAwO3ZhciBFbyxUbz1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1rbyh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1JbygpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShsZSksRG89KEVvPU9vKSYmRW8uX19lc01vZHVsZT9Fbzp7ZGVmYXVsdDpFb307ZnVuY3Rpb24gSW8oKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBJbz1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIHpvKHQsZSxuLHIsbyl7cmV0dXJuIGUudGVzdElnbm9yZUFsbG93KGUub3B0aW9uc1t0Lm5hbWVdLG4scikmJmUub3B0aW9uc1t0Lm5hbWVdLmVuYWJsZWQmJlJvKGUsbix0LG8pP3Q6bnVsbH1mdW5jdGlvbiBBbyh0LGUsbixyLG8saSxhKXtmb3IodmFyIHU9MCxzPXIubGVuZ3RoO3U8czt1Kyspe3ZhciBsPXJbdV0sYz1vW3VdLGY9bC5nZXRBY3Rpb24oZSxuLHQsYyk7aWYoZil7dmFyIHA9em8oZixsLGMsaSxhKTtpZihwKXJldHVybnthY3Rpb246cCxpbnRlcmFjdGFibGU6bCxlbGVtZW50OmN9fX1yZXR1cm57YWN0aW9uOm51bGwsaW50ZXJhY3RhYmxlOm51bGwsZWxlbWVudDpudWxsfX1mdW5jdGlvbiBDbyh0LGUsbixyLG8pe3ZhciBpPVtdLGE9W10sdT1yO2Z1bmN0aW9uIHModCl7aS5wdXNoKHQpLGEucHVzaCh1KX1mb3IoO1RvLmlzLmVsZW1lbnQodSk7KXtpPVtdLGE9W10sby5pbnRlcmFjdGFibGVzLmZvckVhY2hNYXRjaCh1LHMpO3ZhciBsPUFvKHQsZSxuLGksYSxyLG8pO2lmKGwuYWN0aW9uJiYhbC5pbnRlcmFjdGFibGUub3B0aW9uc1tsLmFjdGlvbi5uYW1lXS5tYW51YWxTdGFydClyZXR1cm4gbDt1PVRvLmRvbS5wYXJlbnROb2RlKHUpfXJldHVybnthY3Rpb246bnVsbCxpbnRlcmFjdGFibGU6bnVsbCxlbGVtZW50Om51bGx9fWZ1bmN0aW9uIFdvKHQsZSxuKXt2YXIgcj1lLmFjdGlvbixvPWUuaW50ZXJhY3RhYmxlLGk9ZS5lbGVtZW50O3I9cnx8e25hbWU6bnVsbH0sdC5pbnRlcmFjdGFibGU9byx0LmVsZW1lbnQ9aSxUby5jb3B5QWN0aW9uKHQucHJlcGFyZWQsciksdC5yZWN0PW8mJnIubmFtZT9vLmdldFJlY3QoaSk6bnVsbCxZbyh0LG4pLG4uZmlyZShcImF1dG9TdGFydDpwcmVwYXJlZFwiLHtpbnRlcmFjdGlvbjp0fSl9ZnVuY3Rpb24gUm8odCxlLG4scil7dmFyIG89dC5vcHRpb25zLGk9b1tuLm5hbWVdLm1heCxhPW9bbi5uYW1lXS5tYXhQZXJFbGVtZW50LHU9ci5hdXRvU3RhcnQubWF4SW50ZXJhY3Rpb25zLHM9MCxsPTAsYz0wO2lmKCEoaSYmYSYmdSkpcmV0dXJuITE7Zm9yKHZhciBmPTA7ZjxyLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDtmKyspe3ZhciBwPXIuaW50ZXJhY3Rpb25zLmxpc3RbZl0sZD1wLnByZXBhcmVkLm5hbWU7aWYocC5pbnRlcmFjdGluZygpKXtpZih1PD0rK3MpcmV0dXJuITE7aWYocC5pbnRlcmFjdGFibGU9PT10KXtpZihpPD0obCs9ZD09PW4ubmFtZT8xOjApKXJldHVybiExO2lmKHAuZWxlbWVudD09PWUmJihjKyssZD09PW4ubmFtZSYmYTw9YykpcmV0dXJuITF9fX1yZXR1cm4gMDx1fWZ1bmN0aW9uIEZvKHQsZSl7cmV0dXJuIFRvLmlzLm51bWJlcih0KT8oZS5hdXRvU3RhcnQubWF4SW50ZXJhY3Rpb25zPXQsdGhpcyk6ZS5hdXRvU3RhcnQubWF4SW50ZXJhY3Rpb25zfWZ1bmN0aW9uIFhvKHQsZSxuKXt2YXIgcj1uLmF1dG9TdGFydC5jdXJzb3JFbGVtZW50O3ImJnIhPT10JiYoci5zdHlsZS5jdXJzb3I9XCJcIiksdC5vd25lckRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5zdHlsZS5jdXJzb3I9ZSx0LnN0eWxlLmN1cnNvcj1lLG4uYXV0b1N0YXJ0LmN1cnNvckVsZW1lbnQ9ZT90Om51bGx9ZnVuY3Rpb24gWW8odCxlKXt2YXIgbj10LmludGVyYWN0YWJsZSxyPXQuZWxlbWVudCxvPXQucHJlcGFyZWQ7aWYoXCJtb3VzZVwiPT09dC5wb2ludGVyVHlwZSYmbiYmbi5vcHRpb25zLnN0eWxlQ3Vyc29yKXt2YXIgaT1cIlwiO2lmKG8ubmFtZSl7dmFyIGE9bi5vcHRpb25zW28ubmFtZV0uY3Vyc29yQ2hlY2tlcjtpPVRvLmlzLmZ1bmMoYSk/YShvLG4scix0Ll9pbnRlcmFjdGluZyk6ZS5hY3Rpb25zLm1hcFtvLm5hbWVdLmdldEN1cnNvcihvKX1Ybyh0LmVsZW1lbnQsaXx8XCJcIixlKX1lbHNlIGUuYXV0b1N0YXJ0LmN1cnNvckVsZW1lbnQmJlhvKGUuYXV0b1N0YXJ0LmN1cnNvckVsZW1lbnQsXCJcIixlKX12YXIgTm89e2lkOlwiYXV0by1zdGFydC9iYXNlXCIsYmVmb3JlOltcImFjdGlvbnNcIixcImFjdGlvbnMvZHJhZ1wiLFwiYWN0aW9ucy9yZXNpemVcIixcImFjdGlvbnMvZ2VzdHVyZVwiXSxpbnN0YWxsOmZ1bmN0aW9uKGUpe3ZhciB0PWUuaW50ZXJhY3RTdGF0aWMsbj1lLmRlZmF1bHRzO2UudXNlUGx1Z2luKERvLmRlZmF1bHQpLG4uYmFzZS5hY3Rpb25DaGVja2VyPW51bGwsbi5iYXNlLnN0eWxlQ3Vyc29yPSEwLFRvLmV4dGVuZChuLnBlckFjdGlvbix7bWFudWFsU3RhcnQ6ITEsbWF4OjEvMCxtYXhQZXJFbGVtZW50OjEsYWxsb3dGcm9tOm51bGwsaWdub3JlRnJvbTpudWxsLG1vdXNlQnV0dG9uczoxfSksdC5tYXhJbnRlcmFjdGlvbnM9ZnVuY3Rpb24odCl7cmV0dXJuIEZvKHQsZSl9LGUuYXV0b1N0YXJ0PXttYXhJbnRlcmFjdGlvbnM6MS8wLHdpdGhpbkludGVyYWN0aW9uTGltaXQ6Um8sY3Vyc29yRWxlbWVudDpudWxsfX0sbGlzdGVuZXJzOntcImludGVyYWN0aW9uczpkb3duXCI6ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uLHI9dC5wb2ludGVyLG89dC5ldmVudCxpPXQuZXZlbnRUYXJnZXQ7bi5pbnRlcmFjdGluZygpfHxXbyhuLENvKG4scixvLGksZSksZSl9LFwiaW50ZXJhY3Rpb25zOm1vdmVcIjpmdW5jdGlvbih0LGUpe3ZhciBuLHIsbyxpLGEsdTtyPWUsbz0obj10KS5pbnRlcmFjdGlvbixpPW4ucG9pbnRlcixhPW4uZXZlbnQsdT1uLmV2ZW50VGFyZ2V0LFwibW91c2VcIiE9PW8ucG9pbnRlclR5cGV8fG8ucG9pbnRlcklzRG93bnx8by5pbnRlcmFjdGluZygpfHxXbyhvLENvKG8saSxhLHUsciksciksZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uO2lmKG4ucG9pbnRlcklzRG93biYmIW4uaW50ZXJhY3RpbmcoKSYmbi5wb2ludGVyV2FzTW92ZWQmJm4ucHJlcGFyZWQubmFtZSl7ZS5maXJlKFwiYXV0b1N0YXJ0OmJlZm9yZS1zdGFydFwiLHQpO3ZhciByPW4uaW50ZXJhY3RhYmxlLG89bi5wcmVwYXJlZC5uYW1lO28mJnImJihyLm9wdGlvbnNbb10ubWFudWFsU3RhcnR8fCFSbyhyLG4uZWxlbWVudCxuLnByZXBhcmVkLGUpP24uc3RvcCgpOihuLnN0YXJ0KG4ucHJlcGFyZWQscixuLmVsZW1lbnQpLFlvKG4sZSkpKX19KHQsZSl9LFwiaW50ZXJhY3Rpb25zOnN0b3BcIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj1uLmludGVyYWN0YWJsZTtyJiZyLm9wdGlvbnMuc3R5bGVDdXJzb3ImJlhvKG4uZWxlbWVudCxcIlwiLGUpfX0sbWF4SW50ZXJhY3Rpb25zOkZvLHdpdGhpbkludGVyYWN0aW9uTGltaXQ6Um8sdmFsaWRhdGVBY3Rpb246em99O01vLmRlZmF1bHQ9Tm87dmFyIExvPXt9O2Z1bmN0aW9uIEJvKHQpe3JldHVybihCbz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KExvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLExvLmRlZmF1bHQ9dm9pZCAwO3ZhciBWbyxxbz1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1Cbyh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1HbygpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSh3KSxVbz0oVm89TW8pJiZWby5fX2VzTW9kdWxlP1ZvOntkZWZhdWx0OlZvfTtmdW5jdGlvbiBHbygpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIEdvPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9dmFyIEhvPXtpZDpcImF1dG8tc3RhcnQvZHJhZ0F4aXNcIixsaXN0ZW5lcnM6e1wiYXV0b1N0YXJ0OmJlZm9yZS1zdGFydFwiOmZ1bmN0aW9uKHQscil7dmFyIG89dC5pbnRlcmFjdGlvbixpPXQuZXZlbnRUYXJnZXQsZT10LmR4LG49dC5keTtpZihcImRyYWdcIj09PW8ucHJlcGFyZWQubmFtZSl7dmFyIGE9TWF0aC5hYnMoZSksdT1NYXRoLmFicyhuKSxzPW8uaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJhZyxsPXMuc3RhcnRBeGlzLGM9dTxhP1wieFwiOmE8dT9cInlcIjpcInh5XCI7aWYoby5wcmVwYXJlZC5heGlzPVwic3RhcnRcIj09PXMubG9ja0F4aXM/Y1swXTpzLmxvY2tBeGlzLFwieHlcIiE9YyYmXCJ4eVwiIT09bCYmbCE9PWMpe28ucHJlcGFyZWQubmFtZT1udWxsO2Z1bmN0aW9uIGYodCl7aWYodCE9PW8uaW50ZXJhY3RhYmxlKXt2YXIgZT1vLmludGVyYWN0YWJsZS5vcHRpb25zLmRyYWc7aWYoIWUubWFudWFsU3RhcnQmJnQudGVzdElnbm9yZUFsbG93KGUscCxpKSl7dmFyIG49dC5nZXRBY3Rpb24oby5kb3duUG9pbnRlcixvLmRvd25FdmVudCxvLHApO2lmKG4mJlwiZHJhZ1wiPT09bi5uYW1lJiZmdW5jdGlvbih0LGUpe2lmKCFlKXJldHVybjt2YXIgbj1lLm9wdGlvbnMuZHJhZy5zdGFydEF4aXM7cmV0dXJuXCJ4eVwiPT09dHx8XCJ4eVwiPT09bnx8bj09PXR9KGMsdCkmJlVvLmRlZmF1bHQudmFsaWRhdGVBY3Rpb24obix0LHAsaSxyKSlyZXR1cm4gdH19fWZvcih2YXIgcD1pO3FvLmVsZW1lbnQocCk7KXt2YXIgZD1yLmludGVyYWN0YWJsZXMuZm9yRWFjaE1hdGNoKHAsZik7aWYoZCl7by5wcmVwYXJlZC5uYW1lPVwiZHJhZ1wiLG8uaW50ZXJhY3RhYmxlPWQsby5lbGVtZW50PXA7YnJlYWt9cD0oMCwkLnBhcmVudE5vZGUpKHApfX19fX19O0xvLmRlZmF1bHQ9SG87dmFyIEtvPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShLbyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxLby5kZWZhdWx0PXZvaWQgMDt2YXIgJG8sWm89KCRvPU1vKSYmJG8uX19lc01vZHVsZT8kbzp7ZGVmYXVsdDokb307ZnVuY3Rpb24gSm8odCl7dmFyIGU9dC5wcmVwYXJlZCYmdC5wcmVwYXJlZC5uYW1lO2lmKCFlKXJldHVybiBudWxsO3ZhciBuPXQuaW50ZXJhY3RhYmxlLm9wdGlvbnM7cmV0dXJuIG5bZV0uaG9sZHx8bltlXS5kZWxheX12YXIgUW89e2lkOlwiYXV0by1zdGFydC9ob2xkXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt2YXIgZT10LmRlZmF1bHRzO3QudXNlUGx1Z2luKFpvLmRlZmF1bHQpLGUucGVyQWN0aW9uLmhvbGQ9MCxlLnBlckFjdGlvbi5kZWxheT0wfSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOm5ld1wiOmZ1bmN0aW9uKHQpe3QuaW50ZXJhY3Rpb24uYXV0b1N0YXJ0SG9sZFRpbWVyPW51bGx9LFwiYXV0b1N0YXJ0OnByZXBhcmVkXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPUpvKGUpOzA8biYmKGUuYXV0b1N0YXJ0SG9sZFRpbWVyPXNldFRpbWVvdXQoZnVuY3Rpb24oKXtlLnN0YXJ0KGUucHJlcGFyZWQsZS5pbnRlcmFjdGFibGUsZS5lbGVtZW50KX0sbikpfSxcImludGVyYWN0aW9uczptb3ZlXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuZHVwbGljYXRlO2UucG9pbnRlcldhc01vdmVkJiYhbiYmY2xlYXJUaW1lb3V0KGUuYXV0b1N0YXJ0SG9sZFRpbWVyKX0sXCJhdXRvU3RhcnQ6YmVmb3JlLXN0YXJ0XCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjswPEpvKGUpJiYoZS5wcmVwYXJlZC5uYW1lPW51bGwpfX0sZ2V0SG9sZER1cmF0aW9uOkpvfTtLby5kZWZhdWx0PVFvO3ZhciB0aT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkodGksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRpLFwiYXV0b1N0YXJ0XCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGVpLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KHRpLFwiZHJhZ0F4aXNcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbmkuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGksXCJob2xkXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHJpLmRlZmF1bHR9fSksdGkuZGVmYXVsdD12b2lkIDA7dmFyIGVpPW9pKE1vKSxuaT1vaShMbykscmk9b2koS28pO2Z1bmN0aW9uIG9pKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgaWk9e2lkOlwiYXV0by1zdGFydFwiLGluc3RhbGw6ZnVuY3Rpb24odCl7dC51c2VQbHVnaW4oZWkuZGVmYXVsdCksdC51c2VQbHVnaW4ocmkuZGVmYXVsdCksdC51c2VQbHVnaW4obmkuZGVmYXVsdCl9fTt0aS5kZWZhdWx0PWlpO3ZhciBhaT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoYWksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksYWkuZGVmYXVsdD12b2lkIDA7YWkuZGVmYXVsdD17fTt2YXIgdWk9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHVpLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHVpLmRlZmF1bHQ9dm9pZCAwO3VpLmRlZmF1bHQ9e307dmFyIHNpPXt9O2Z1bmN0aW9uIGxpKHQpe3JldHVybihsaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHNpLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHNpLmRlZmF1bHQ9dm9pZCAwO3ZhciBjaSxmaSxwaT1oaShEKSxkaT0oaGkoY3QpLGZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PWxpKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPXlpKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpKSx2aT1oaShPKTtmdW5jdGlvbiB5aSgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIHlpPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gaGkodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fShmaT1jaT1jaXx8e30pLnRvdWNoQWN0aW9uPVwidG91Y2hBY3Rpb25cIixmaS5ib3hTaXppbmc9XCJib3hTaXppbmdcIixmaS5ub0xpc3RlbmVycz1cIm5vTGlzdGVuZXJzXCI7dmFyIGdpPXt0b3VjaEFjdGlvbjpcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy90b3VjaC1hY3Rpb25cIixib3hTaXppbmc6XCJodHRwczovL2RldmVsb3Blci5tb3ppbGxhLm9yZy9lbi1VUy9kb2NzL1dlYi9DU1MvYm94LXNpemluZ1wifTtjaS50b3VjaEFjdGlvbixjaS5ib3hTaXppbmcsY2kubm9MaXN0ZW5lcnM7ZnVuY3Rpb24gYmkodCxlLG4pe3JldHVybiBuLnRlc3QodC5zdHlsZVtlXXx8dmkuZGVmYXVsdC53aW5kb3cuZ2V0Q29tcHV0ZWRTdHlsZSh0KVtlXSl9dmFyIG1pPVwiZGV2LXRvb2xzXCIsT2k9e2lkOm1pLGluc3RhbGw6ZnVuY3Rpb24oKXt9fTtzaS5kZWZhdWx0PU9pO3ZhciB3aT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkod2ksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksd2kuZGVmYXVsdD12b2lkIDA7d2kuZGVmYXVsdD17fTt2YXIgX2k9e307ZnVuY3Rpb24gUGkodCl7cmV0dXJuKFBpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoX2ksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksX2kuZ2V0UmVjdE9mZnNldD1BaSxfaS5kZWZhdWx0PXZvaWQgMDt2YXIgeGk9a2koViksU2k9a2koY3QpLGppPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVBpKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPU1pKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KCR0KTtmdW5jdGlvbiBNaSgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIE1pPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24ga2kodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIEVpKHQsZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIHR9KHQpfHxmdW5jdGlvbih0LGUpe2lmKCEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh0KXx8XCJbb2JqZWN0IEFyZ3VtZW50c11cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KSkpcmV0dXJuO3ZhciBuPVtdLHI9ITAsbz0hMSxpPXZvaWQgMDt0cnl7Zm9yKHZhciBhLHU9dFtTeW1ib2wuaXRlcmF0b3JdKCk7IShyPShhPXUubmV4dCgpKS5kb25lKSYmKG4ucHVzaChhLnZhbHVlKSwhZXx8bi5sZW5ndGghPT1lKTtyPSEwKTt9Y2F0Y2godCl7bz0hMCxpPXR9ZmluYWxseXt0cnl7cnx8bnVsbD09dS5yZXR1cm58fHUucmV0dXJuKCl9ZmluYWxseXtpZihvKXRocm93IGl9fXJldHVybiBufSh0LGUpfHxmdW5jdGlvbigpe3Rocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpfSgpfWZ1bmN0aW9uIFRpKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBEaSh0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9dmFyIElpPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGUpLHRoaXMuaW50ZXJhY3Rpb249dCxEaSh0aGlzLFwic3RhdGVzXCIsW10pLERpKHRoaXMsXCJzdGFydE9mZnNldFwiLHtsZWZ0OjAscmlnaHQ6MCx0b3A6MCxib3R0b206MH0pLERpKHRoaXMsXCJzdGFydERlbHRhXCIsbnVsbCksRGkodGhpcyxcInJlc3VsdFwiLG51bGwpLERpKHRoaXMsXCJlbmRSZXN1bHRcIixudWxsKSxEaSh0aGlzLFwiZWRnZXNcIix2b2lkIDApLHRoaXMucmVzdWx0PXppKCl9dmFyIHQsbixyO3JldHVybiB0PWUsKG49W3trZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5waGFzZSxyPXRoaXMuaW50ZXJhY3Rpb24sbz1mdW5jdGlvbih0KXt2YXIgbj10LmludGVyYWN0YWJsZS5vcHRpb25zW3QucHJlcGFyZWQubmFtZV0sZT1uLm1vZGlmaWVycztpZihlJiZlLmxlbmd0aClyZXR1cm4gZS5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuIXQub3B0aW9uc3x8ITEhPT10Lm9wdGlvbnMuZW5hYmxlZH0pO3JldHVybltcInNuYXBcIixcInNuYXBTaXplXCIsXCJzbmFwRWRnZXNcIixcInJlc3RyaWN0XCIsXCJyZXN0cmljdEVkZ2VzXCIsXCJyZXN0cmljdFNpemVcIl0ubWFwKGZ1bmN0aW9uKHQpe3ZhciBlPW5bdF07cmV0dXJuIGUmJmUuZW5hYmxlZCYme29wdGlvbnM6ZSxtZXRob2RzOmUuX21ldGhvZHN9fSkuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiEhdH0pfShyKTt0aGlzLnByZXBhcmVTdGF0ZXMobyksdGhpcy5lZGdlcz0oMCxTaS5kZWZhdWx0KSh7fSxyLmVkZ2VzKSx0aGlzLnN0YXJ0T2Zmc2V0PUFpKHIucmVjdCxlKTt2YXIgaT17cGhhc2U6bixwYWdlQ29vcmRzOmUscHJlRW5kOiEodGhpcy5zdGFydERlbHRhPXt4OjAseTowfSl9O3JldHVybiB0aGlzLnJlc3VsdD16aSgpLHRoaXMuc3RhcnRBbGwoaSksdGhpcy5yZXN1bHQ9dGhpcy5zZXRBbGwoaSl9fSx7a2V5OlwiZmlsbEFyZ1wiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuaW50ZXJhY3Rpb247dC5pbnRlcmFjdGlvbj1lLHQuaW50ZXJhY3RhYmxlPWUuaW50ZXJhY3RhYmxlLHQuZWxlbWVudD1lLmVsZW1lbnQsdC5yZWN0PXQucmVjdHx8ZS5yZWN0LHQuZWRnZXM9dGhpcy5lZGdlcyx0LnN0YXJ0T2Zmc2V0PXRoaXMuc3RhcnRPZmZzZXR9fSx7a2V5Olwic3RhcnRBbGxcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLmZpbGxBcmcodCk7Zm9yKHZhciBlPTA7ZTx0aGlzLnN0YXRlcy5sZW5ndGg7ZSsrKXt2YXIgbj10aGlzLnN0YXRlc1tlXTtuLm1ldGhvZHMuc3RhcnQmJih0LnN0YXRlPW4pLm1ldGhvZHMuc3RhcnQodCl9fX0se2tleTpcInNldEFsbFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuZmlsbEFyZyh0KTt2YXIgZT10LnBoYXNlLG49dC5wcmVFbmQscj10LnNraXBNb2RpZmllcnMsbz10LnJlY3Q7dC5jb29yZHM9KDAsU2kuZGVmYXVsdCkoe30sdC5wYWdlQ29vcmRzKSx0LnJlY3Q9KDAsU2kuZGVmYXVsdCkoe30sbyk7Zm9yKHZhciBpPXI/dGhpcy5zdGF0ZXMuc2xpY2Uocik6dGhpcy5zdGF0ZXMsYT16aSh0LmNvb3Jkcyx0LnJlY3QpLHU9MDt1PGkubGVuZ3RoO3UrKyl7dmFyIHM9aVt1XSxsPXMub3B0aW9ucyxjPSgwLFNpLmRlZmF1bHQpKHt9LHQuY29vcmRzKSxmPW51bGw7cy5tZXRob2RzLnNldCYmdGhpcy5zaG91bGREbyhsLG4sZSkmJihmPSh0LnN0YXRlPXMpLm1ldGhvZHMuc2V0KHQpLGppLmFkZEVkZ2VzKHRoaXMuaW50ZXJhY3Rpb24uZWRnZXMsdC5yZWN0LHt4OnQuY29vcmRzLngtYy54LHk6dC5jb29yZHMueS1jLnl9KSksYS5ldmVudFByb3BzLnB1c2goZil9YS5kZWx0YS54PXQuY29vcmRzLngtdC5wYWdlQ29vcmRzLngsYS5kZWx0YS55PXQuY29vcmRzLnktdC5wYWdlQ29vcmRzLnksYS5yZWN0RGVsdGEubGVmdD10LnJlY3QubGVmdC1vLmxlZnQsYS5yZWN0RGVsdGEucmlnaHQ9dC5yZWN0LnJpZ2h0LW8ucmlnaHQsYS5yZWN0RGVsdGEudG9wPXQucmVjdC50b3Atby50b3AsYS5yZWN0RGVsdGEuYm90dG9tPXQucmVjdC5ib3R0b20tby5ib3R0b207dmFyIHA9dGhpcy5yZXN1bHQuY29vcmRzLGQ9dGhpcy5yZXN1bHQucmVjdDtpZihwJiZkKXt2YXIgdj1hLnJlY3QubGVmdCE9PWQubGVmdHx8YS5yZWN0LnJpZ2h0IT09ZC5yaWdodHx8YS5yZWN0LnRvcCE9PWQudG9wfHxhLnJlY3QuYm90dG9tIT09ZC5ib3R0b207YS5jaGFuZ2VkPXZ8fHAueCE9PWEuY29vcmRzLnh8fHAueSE9PWEuY29vcmRzLnl9cmV0dXJuIGF9fSx7a2V5OlwiYXBwbHlUb0ludGVyYWN0aW9uXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5pbnRlcmFjdGlvbixuPXQucGhhc2Uscj1lLmNvb3Jkcy5jdXIsbz1lLmNvb3Jkcy5zdGFydCxpPXRoaXMucmVzdWx0LGE9dGhpcy5zdGFydERlbHRhLHU9aS5kZWx0YTtcInN0YXJ0XCI9PT1uJiYoMCxTaS5kZWZhdWx0KSh0aGlzLnN0YXJ0RGVsdGEsaS5kZWx0YSk7Zm9yKHZhciBzPTA7czxbW28sYV0sW3IsdV1dLmxlbmd0aDtzKyspe3ZhciBsPUVpKFtbbyxhXSxbcix1XV1bc10sMiksYz1sWzBdLGY9bFsxXTtjLnBhZ2UueCs9Zi54LGMucGFnZS55Kz1mLnksYy5jbGllbnQueCs9Zi54LGMuY2xpZW50LnkrPWYueX12YXIgcD10aGlzLnJlc3VsdC5yZWN0RGVsdGEsZD10LnJlY3R8fGUucmVjdDtkLmxlZnQrPXAubGVmdCxkLnJpZ2h0Kz1wLnJpZ2h0LGQudG9wKz1wLnRvcCxkLmJvdHRvbSs9cC5ib3R0b20sZC53aWR0aD1kLnJpZ2h0LWQubGVmdCxkLmhlaWdodD1kLmJvdHRvbS1kLnRvcH19LHtrZXk6XCJzZXRBbmRBcHBseVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuaW50ZXJhY3Rpb24sbj10LnBoYXNlLHI9dC5wcmVFbmQsbz10LnNraXBNb2RpZmllcnMsaT10aGlzLnNldEFsbCh7cHJlRW5kOnIscGhhc2U6bixwYWdlQ29vcmRzOnQubW9kaWZpZWRDb29yZHN8fGUuY29vcmRzLmN1ci5wYWdlfSk7aWYoISh0aGlzLnJlc3VsdD1pKS5jaGFuZ2VkJiYoIW98fG88dGhpcy5zdGF0ZXMubGVuZ3RoKSYmZS5pbnRlcmFjdGluZygpKXJldHVybiExO2lmKHQubW9kaWZpZWRDb29yZHMpe3ZhciBhPWUuY29vcmRzLmN1ci5wYWdlLHU9dC5tb2RpZmllZENvb3Jkcy54LWEueCxzPXQubW9kaWZpZWRDb29yZHMueS1hLnk7aS5jb29yZHMueCs9dSxpLmNvb3Jkcy55Kz1zLGkuZGVsdGEueCs9dSxpLmRlbHRhLnkrPXN9dGhpcy5hcHBseVRvSW50ZXJhY3Rpb24odCl9fSx7a2V5OlwiYmVmb3JlRW5kXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuZXZlbnQscj10aGlzLnN0YXRlcztpZihyJiZyLmxlbmd0aCl7Zm9yKHZhciBvPSExLGk9MDtpPHIubGVuZ3RoO2krKyl7dmFyIGE9cltpXSx1PSh0LnN0YXRlPWEpLm9wdGlvbnMscz1hLm1ldGhvZHMsbD1zLmJlZm9yZUVuZCYmcy5iZWZvcmVFbmQodCk7aWYobClyZXR1cm4gdGhpcy5lbmRSZXN1bHQ9bCwhMTtvPW98fCFvJiZ0aGlzLnNob3VsZERvKHUsITAsdC5waGFzZSwhMCl9byYmZS5tb3ZlKHtldmVudDpuLHByZUVuZDohMH0pfX19LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtpZih0aGlzLnN0YXRlcyYmdGhpcy5zdGF0ZXMubGVuZ3RoKXt2YXIgbj0oMCxTaS5kZWZhdWx0KSh7c3RhdGVzOnRoaXMuc3RhdGVzLGludGVyYWN0YWJsZTplLmludGVyYWN0YWJsZSxlbGVtZW50OmUuZWxlbWVudCxyZWN0Om51bGx9LHQpO3RoaXMuZmlsbEFyZyhuKTtmb3IodmFyIHI9MDtyPHRoaXMuc3RhdGVzLmxlbmd0aDtyKyspe3ZhciBvPXRoaXMuc3RhdGVzW3JdOyhuLnN0YXRlPW8pLm1ldGhvZHMuc3RvcCYmby5tZXRob2RzLnN0b3Aobil9dGhpcy5zdGF0ZXM9bnVsbCx0aGlzLmVuZFJlc3VsdD1udWxsfX19LHtrZXk6XCJwcmVwYXJlU3RhdGVzXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5zdGF0ZXM9W107Zm9yKHZhciBlPTA7ZTx0Lmxlbmd0aDtlKyspe3ZhciBuPXRbZV0scj1uLm9wdGlvbnMsbz1uLm1ldGhvZHMsaT1uLm5hbWU7ciYmITE9PT1yLmVuYWJsZWR8fHRoaXMuc3RhdGVzLnB1c2goe29wdGlvbnM6cixtZXRob2RzOm8saW5kZXg6ZSxuYW1lOml9KX1yZXR1cm4gdGhpcy5zdGF0ZXN9fSx7a2V5OlwicmVzdG9yZUludGVyYWN0aW9uQ29vcmRzXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPWUuY29vcmRzLHI9ZS5yZWN0LG89ZS5tb2RpZmljYXRpb247aWYoby5yZXN1bHQpe2Zvcih2YXIgaT1vLnN0YXJ0RGVsdGEsYT1vLnJlc3VsdCx1PWEuZGVsdGEscz1hLnJlY3REZWx0YSxsPVtbbi5zdGFydCxpXSxbbi5jdXIsdV1dLGM9MDtjPGwubGVuZ3RoO2MrKyl7dmFyIGY9RWkobFtjXSwyKSxwPWZbMF0sZD1mWzFdO3AucGFnZS54LT1kLngscC5wYWdlLnktPWQueSxwLmNsaWVudC54LT1kLngscC5jbGllbnQueS09ZC55fXIubGVmdC09cy5sZWZ0LHIucmlnaHQtPXMucmlnaHQsci50b3AtPXMudG9wLHIuYm90dG9tLT1zLmJvdHRvbX19fSx7a2V5Olwic2hvdWxkRG9cIix2YWx1ZTpmdW5jdGlvbih0LGUsbixyKXtyZXR1cm4hKCF0fHwhMT09PXQuZW5hYmxlZHx8ciYmIXQuZW5kT25seXx8dC5lbmRPbmx5JiYhZXx8XCJzdGFydFwiPT09biYmIXQuc2V0U3RhcnQpfX0se2tleTpcImNvcHlGcm9tXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5zdGFydE9mZnNldD10LnN0YXJ0T2Zmc2V0LHRoaXMuc3RhcnREZWx0YT10LnN0YXJ0RGVsdGEsdGhpcy5lZGdlcz10LmVkZ2VzLHRoaXMuc3RhdGVzPXQuc3RhdGVzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4oMCx4aS5kZWZhdWx0KSh0KX0pLHRoaXMucmVzdWx0PXppKCgwLFNpLmRlZmF1bHQpKHt9LHQucmVzdWx0LmNvb3JkcyksKDAsU2kuZGVmYXVsdCkoe30sdC5yZXN1bHQucmVjdCkpfX0se2tleTpcImRlc3Ryb3lcIix2YWx1ZTpmdW5jdGlvbigpe2Zvcih2YXIgdCBpbiB0aGlzKXRoaXNbdF09bnVsbH19XSkmJlRpKHQucHJvdG90eXBlLG4pLHImJlRpKHQsciksZX0oKTtmdW5jdGlvbiB6aSh0LGUpe3JldHVybntyZWN0OmUsY29vcmRzOnQsZGVsdGE6e3g6MCx5OjB9LHJlY3REZWx0YTp7bGVmdDowLHJpZ2h0OjAsdG9wOjAsYm90dG9tOjB9LGV2ZW50UHJvcHM6W10sY2hhbmdlZDohMH19ZnVuY3Rpb24gQWkodCxlKXtyZXR1cm4gdD97bGVmdDplLngtdC5sZWZ0LHRvcDplLnktdC50b3AscmlnaHQ6dC5yaWdodC1lLngsYm90dG9tOnQuYm90dG9tLWUueX06e2xlZnQ6MCx0b3A6MCxyaWdodDowLGJvdHRvbTowfX1faS5kZWZhdWx0PUlpO3ZhciBDaT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoQ2ksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksQ2kubWFrZU1vZGlmaWVyPWZ1bmN0aW9uKHQscil7ZnVuY3Rpb24gZSh0KXt2YXIgZT10fHx7fTtmb3IodmFyIG4gaW4gZS5lbmFibGVkPSExIT09ZS5lbmFibGVkLG8pbiBpbiBlfHwoZVtuXT1vW25dKTtyZXR1cm57b3B0aW9uczplLG1ldGhvZHM6aSxuYW1lOnJ9fXZhciBvPXQuZGVmYXVsdHMsaT17c3RhcnQ6dC5zdGFydCxzZXQ6dC5zZXQsYmVmb3JlRW5kOnQuYmVmb3JlRW5kLHN0b3A6dC5zdG9wfTtyJiZcInN0cmluZ1wiPT10eXBlb2YgciYmKGUuX2RlZmF1bHRzPW8sZS5fbWV0aG9kcz1pKTtyZXR1cm4gZX0sQ2kuYWRkRXZlbnRNb2RpZmllcnM9RmksQ2kuZGVmYXVsdD12b2lkIDA7dmFyIFdpLFJpPShXaT1faSkmJldpLl9fZXNNb2R1bGU/V2k6e2RlZmF1bHQ6V2l9O2Z1bmN0aW9uIEZpKHQpe3ZhciBlPXQuaUV2ZW50LG49dC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24ucmVzdWx0O24mJihlLm1vZGlmaWVycz1uLmV2ZW50UHJvcHMpfXZhciBYaT17aWQ6XCJtb2RpZmllcnMvYmFzZVwiLGluc3RhbGw6ZnVuY3Rpb24odCl7dC5kZWZhdWx0cy5wZXJBY3Rpb24ubW9kaWZpZXJzPVtdfSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOm5ld1wiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb247ZS5tb2RpZmljYXRpb249bmV3IFJpLmRlZmF1bHQoZSl9LFwiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tc3RhcnRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbjtlLnN0YXJ0KHQsdC5pbnRlcmFjdGlvbi5jb29yZHMuc3RhcnQucGFnZSksdC5pbnRlcmFjdGlvbi5lZGdlcz1lLmVkZ2VzLGUuYXBwbHlUb0ludGVyYWN0aW9uKHQpfSxcImludGVyYWN0aW9uczpiZWZvcmUtYWN0aW9uLW1vdmVcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24uc2V0QW5kQXBwbHkodCl9LFwiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tZW5kXCI6ZnVuY3Rpb24odCl7cmV0dXJuIHQuaW50ZXJhY3Rpb24ubW9kaWZpY2F0aW9uLmJlZm9yZUVuZCh0KX0sXCJpbnRlcmFjdGlvbnM6YWN0aW9uLXN0YXJ0XCI6RmksXCJpbnRlcmFjdGlvbnM6YWN0aW9uLW1vdmVcIjpGaSxcImludGVyYWN0aW9uczphY3Rpb24tZW5kXCI6RmksXCJpbnRlcmFjdGlvbnM6YWZ0ZXItYWN0aW9uLXN0YXJ0XCI6ZnVuY3Rpb24odCl7cmV0dXJuIHQuaW50ZXJhY3Rpb24ubW9kaWZpY2F0aW9uLnJlc3RvcmVJbnRlcmFjdGlvbkNvb3Jkcyh0KX0sXCJpbnRlcmFjdGlvbnM6YWZ0ZXItYWN0aW9uLW1vdmVcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24ucmVzdG9yZUludGVyYWN0aW9uQ29vcmRzKHQpfSxcImludGVyYWN0aW9uczpzdG9wXCI6ZnVuY3Rpb24odCl7cmV0dXJuIHQuaW50ZXJhY3Rpb24ubW9kaWZpY2F0aW9uLnN0b3AodCl9fSxiZWZvcmU6W1wiYWN0aW9uc1wiLFwiYWN0aW9uL2RyYWdcIixcImFjdGlvbnMvcmVzaXplXCIsXCJhY3Rpb25zL2dlc3R1cmVcIl19O0NpLmRlZmF1bHQ9WGk7dmFyIFlpPXt9O2Z1bmN0aW9uIE5pKHQpe3JldHVybihOaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFlpLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFlpLmFkZFRvdGFsPVZpLFlpLmFwcGx5UGVuZGluZz1VaSxZaS5kZWZhdWx0PXZvaWQgMDt2YXIgTGk9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09TmkodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9QmkoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oJHQpO2Z1bmN0aW9uIEJpKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gQmk9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBWaSh0KXt0LnBvaW50ZXJJc0Rvd24mJihIaSh0LmNvb3Jkcy5jdXIsdC5vZmZzZXQudG90YWwpLHQub2Zmc2V0LnBlbmRpbmcueD0wLHQub2Zmc2V0LnBlbmRpbmcueT0wKX1mdW5jdGlvbiBxaSh0KXtVaSh0LmludGVyYWN0aW9uKX1mdW5jdGlvbiBVaSh0KXtpZighKGU9dCkub2Zmc2V0LnBlbmRpbmcueCYmIWUub2Zmc2V0LnBlbmRpbmcueSlyZXR1cm4hMTt2YXIgZSxuPXQub2Zmc2V0LnBlbmRpbmc7cmV0dXJuIEhpKHQuY29vcmRzLmN1cixuKSxIaSh0LmNvb3Jkcy5kZWx0YSxuKSxMaS5hZGRFZGdlcyh0LmVkZ2VzLHQucmVjdCxuKSxuLng9MCwhKG4ueT0wKX1mdW5jdGlvbiBHaSh0KXt2YXIgZT10Lngsbj10Lnk7dGhpcy5vZmZzZXQucGVuZGluZy54Kz1lLHRoaXMub2Zmc2V0LnBlbmRpbmcueSs9bix0aGlzLm9mZnNldC50b3RhbC54Kz1lLHRoaXMub2Zmc2V0LnRvdGFsLnkrPW59ZnVuY3Rpb24gSGkodCxlKXt2YXIgbj10LnBhZ2Uscj10LmNsaWVudCxvPWUueCxpPWUueTtuLngrPW8sbi55Kz1pLHIueCs9byxyLnkrPWl9RW4uX1Byb3h5TWV0aG9kcy5vZmZzZXRCeT1cIlwiO3ZhciBLaT17aWQ6XCJvZmZzZXRcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3QuSW50ZXJhY3Rpb24ucHJvdG90eXBlLm9mZnNldEJ5PUdpfSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOm5ld1wiOmZ1bmN0aW9uKHQpe3QuaW50ZXJhY3Rpb24ub2Zmc2V0PXt0b3RhbDp7eDowLHk6MH0scGVuZGluZzp7eDowLHk6MH19fSxcImludGVyYWN0aW9uczp1cGRhdGUtcG9pbnRlclwiOmZ1bmN0aW9uKHQpe3JldHVybiBWaSh0LmludGVyYWN0aW9uKX0sXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1zdGFydFwiOnFpLFwiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tbW92ZVwiOnFpLFwiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tZW5kXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtpZihVaShlKSlyZXR1cm4gZS5tb3ZlKHtvZmZzZXQ6ITB9KSxlLmVuZCgpLCExfSxcImludGVyYWN0aW9uczpzdG9wXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtlLm9mZnNldC50b3RhbC54PTAsZS5vZmZzZXQudG90YWwueT0wLGUub2Zmc2V0LnBlbmRpbmcueD0wLGUub2Zmc2V0LnBlbmRpbmcueT0wfX19O1lpLmRlZmF1bHQ9S2k7dmFyICRpPXt9O2Z1bmN0aW9uIFppKHQpe3JldHVybihaaT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KCRpLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLCRpLmRlZmF1bHQ9JGkuSW5lcnRpYVN0YXRlPXZvaWQgMDt2YXIgSmk9dWEoX2kpLFFpPWFhKENpKSx0YT11YShZaSksZWE9YWEoJCksbmE9dWEoRXQpLHJhPWFhKHcpLG9hPXVhKG9lKTtmdW5jdGlvbiBpYSgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIGlhPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gYWEodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09WmkodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9aWEoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiB1YSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gc2EodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIGxhKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH12YXIgY2E9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpeyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsZSksdGhpcy5pbnRlcmFjdGlvbj10LGxhKHRoaXMsXCJhY3RpdmVcIiwhMSksbGEodGhpcyxcImlzTW9kaWZpZWRcIiwhMSksbGEodGhpcyxcInNtb290aEVuZFwiLCExKSxsYSh0aGlzLFwiYWxsb3dSZXN1bWVcIiwhMSksbGEodGhpcyxcIm1vZGlmaWNhdGlvblwiLG51bGwpLGxhKHRoaXMsXCJtb2RpZmllckNvdW50XCIsMCksbGEodGhpcyxcIm1vZGlmaWVyQXJnXCIsbnVsbCksbGEodGhpcyxcInN0YXJ0Q29vcmRzXCIsbnVsbCksbGEodGhpcyxcInQwXCIsMCksbGEodGhpcyxcInYwXCIsMCksbGEodGhpcyxcInRlXCIsMCksbGEodGhpcyxcInRhcmdldE9mZnNldFwiLG51bGwpLGxhKHRoaXMsXCJtb2RpZmllZE9mZnNldFwiLG51bGwpLGxhKHRoaXMsXCJjdXJyZW50T2Zmc2V0XCIsbnVsbCksbGEodGhpcyxcImxhbWJkYV92MFwiLDApLGxhKHRoaXMsXCJvbmVfdmVfdjBcIiwwKSxsYSh0aGlzLFwidGltZW91dFwiLG51bGwpfXZhciB0LG4scjtyZXR1cm4gdD1lLChuPVt7a2V5Olwic3RhcnRcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLmludGVyYWN0aW9uLG49ZmEoZSk7aWYoIW58fCFuLmVuYWJsZWQpcmV0dXJuITE7dmFyIHI9ZS5jb29yZHMudmVsb2NpdHkuY2xpZW50LG89KDAsbmEuZGVmYXVsdCkoci54LHIueSksaT10aGlzLm1vZGlmaWNhdGlvbnx8KHRoaXMubW9kaWZpY2F0aW9uPW5ldyBKaS5kZWZhdWx0KGUpKTtpZihpLmNvcHlGcm9tKGUubW9kaWZpY2F0aW9uKSx0aGlzLnQwPWUuX25vdygpLHRoaXMuYWxsb3dSZXN1bWU9bi5hbGxvd1Jlc3VtZSx0aGlzLnYwPW8sdGhpcy5jdXJyZW50T2Zmc2V0PXt4OjAseTowfSx0aGlzLnN0YXJ0Q29vcmRzPWUuY29vcmRzLmN1ci5wYWdlLHRoaXMubW9kaWZpZXJBcmc9e2ludGVyYWN0aW9uOmUsaW50ZXJhY3RhYmxlOmUuaW50ZXJhY3RhYmxlLGVsZW1lbnQ6ZS5lbGVtZW50LHJlY3Q6ZS5yZWN0LGVkZ2VzOmUuZWRnZXMscGFnZUNvb3Jkczp0aGlzLnN0YXJ0Q29vcmRzLHByZUVuZDohMCxwaGFzZTpcImluZXJ0aWFzdGFydFwifSx0aGlzLnQwLWUuY29vcmRzLmN1ci50aW1lU3RhbXA8NTAmJm8+bi5taW5TcGVlZCYmbz5uLmVuZFNwZWVkKXRoaXMuc3RhcnRJbmVydGlhKCk7ZWxzZXtpZihpLnJlc3VsdD1pLnNldEFsbCh0aGlzLm1vZGlmaWVyQXJnKSwhaS5yZXN1bHQuY2hhbmdlZClyZXR1cm4hMTt0aGlzLnN0YXJ0U21vb3RoRW5kKCl9cmV0dXJuIGUubW9kaWZpY2F0aW9uLnJlc3VsdC5yZWN0PW51bGwsZS5vZmZzZXRCeSh0aGlzLnRhcmdldE9mZnNldCksZS5fZG9QaGFzZSh7aW50ZXJhY3Rpb246ZSxldmVudDp0LHBoYXNlOlwiaW5lcnRpYXN0YXJ0XCJ9KSxlLm9mZnNldEJ5KHt4Oi10aGlzLnRhcmdldE9mZnNldC54LHk6LXRoaXMudGFyZ2V0T2Zmc2V0Lnl9KSxlLm1vZGlmaWNhdGlvbi5yZXN1bHQucmVjdD1udWxsLHRoaXMuYWN0aXZlPSEwLGUuc2ltdWxhdGlvbj10aGlzLCEwfX0se2tleTpcInN0YXJ0SW5lcnRpYVwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxlPXRoaXMuaW50ZXJhY3Rpb24uY29vcmRzLnZlbG9jaXR5LmNsaWVudCxuPWZhKHRoaXMuaW50ZXJhY3Rpb24pLHI9bi5yZXNpc3RhbmNlLG89LU1hdGgubG9nKG4uZW5kU3BlZWQvdGhpcy52MCkvcjt0aGlzLnRhcmdldE9mZnNldD17eDooZS54LW8pL3IseTooZS55LW8pL3J9LHRoaXMudGU9byx0aGlzLmxhbWJkYV92MD1yL3RoaXMudjAsdGhpcy5vbmVfdmVfdjA9MS1uLmVuZFNwZWVkL3RoaXMudjA7dmFyIGk9dGhpcy5tb2RpZmljYXRpb24sYT10aGlzLm1vZGlmaWVyQXJnO2EucGFnZUNvb3Jkcz17eDp0aGlzLnN0YXJ0Q29vcmRzLngrdGhpcy50YXJnZXRPZmZzZXQueCx5OnRoaXMuc3RhcnRDb29yZHMueSt0aGlzLnRhcmdldE9mZnNldC55fSxpLnJlc3VsdD1pLnNldEFsbChhKSxpLnJlc3VsdC5jaGFuZ2VkJiYodGhpcy5pc01vZGlmaWVkPSEwLHRoaXMubW9kaWZpZWRPZmZzZXQ9e3g6dGhpcy50YXJnZXRPZmZzZXQueCtpLnJlc3VsdC5kZWx0YS54LHk6dGhpcy50YXJnZXRPZmZzZXQueStpLnJlc3VsdC5kZWx0YS55fSksdGhpcy50aW1lb3V0PW9hLmRlZmF1bHQucmVxdWVzdChmdW5jdGlvbigpe3JldHVybiB0LmluZXJ0aWFUaWNrKCl9KX19LHtrZXk6XCJzdGFydFNtb290aEVuZFwiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpczt0aGlzLnNtb290aEVuZD0hMCx0aGlzLmlzTW9kaWZpZWQ9ITAsdGhpcy50YXJnZXRPZmZzZXQ9e3g6dGhpcy5tb2RpZmljYXRpb24ucmVzdWx0LmRlbHRhLngseTp0aGlzLm1vZGlmaWNhdGlvbi5yZXN1bHQuZGVsdGEueX0sdGhpcy50aW1lb3V0PW9hLmRlZmF1bHQucmVxdWVzdChmdW5jdGlvbigpe3JldHVybiB0LnNtb290aEVuZFRpY2soKX0pfX0se2tleTpcImluZXJ0aWFUaWNrXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdCxlLG4scixvLGksYSx1PXRoaXMscz10aGlzLmludGVyYWN0aW9uLGw9ZmEocykucmVzaXN0YW5jZSxjPShzLl9ub3coKS10aGlzLnQwKS8xZTM7aWYoYzx0aGlzLnRlKXt2YXIgZixwPTEtKE1hdGguZXhwKC1sKmMpLXRoaXMubGFtYmRhX3YwKS90aGlzLm9uZV92ZV92MCxkPXt4OihmPXRoaXMuaXNNb2RpZmllZD8oZT10PTAsbj10aGlzLnRhcmdldE9mZnNldC54LHI9dGhpcy50YXJnZXRPZmZzZXQueSxvPXRoaXMubW9kaWZpZWRPZmZzZXQueCxpPXRoaXMubW9kaWZpZWRPZmZzZXQueSx7eDpwYShhPXAsdCxuLG8pLHk6cGEoYSxlLHIsaSl9KTp7eDp0aGlzLnRhcmdldE9mZnNldC54KnAseTp0aGlzLnRhcmdldE9mZnNldC55KnB9KS54LXRoaXMuY3VycmVudE9mZnNldC54LHk6Zi55LXRoaXMuY3VycmVudE9mZnNldC55fTt0aGlzLmN1cnJlbnRPZmZzZXQueCs9ZC54LHRoaXMuY3VycmVudE9mZnNldC55Kz1kLnkscy5vZmZzZXRCeShkKSxzLm1vdmUoKSx0aGlzLnRpbWVvdXQ9b2EuZGVmYXVsdC5yZXF1ZXN0KGZ1bmN0aW9uKCl7cmV0dXJuIHUuaW5lcnRpYVRpY2soKX0pfWVsc2Ugcy5vZmZzZXRCeSh7eDp0aGlzLm1vZGlmaWVkT2Zmc2V0LngtdGhpcy5jdXJyZW50T2Zmc2V0LngseTp0aGlzLm1vZGlmaWVkT2Zmc2V0LnktdGhpcy5jdXJyZW50T2Zmc2V0Lnl9KSx0aGlzLmVuZCgpfX0se2tleTpcInNtb290aEVuZFRpY2tcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciB0PXRoaXMsZT10aGlzLmludGVyYWN0aW9uLG49ZS5fbm93KCktdGhpcy50MCxyPWZhKGUpLnNtb290aEVuZER1cmF0aW9uO2lmKG48cil7dmFyIG89ZGEobiwwLHRoaXMudGFyZ2V0T2Zmc2V0LngsciksaT1kYShuLDAsdGhpcy50YXJnZXRPZmZzZXQueSxyKSxhPXt4Om8tdGhpcy5jdXJyZW50T2Zmc2V0LngseTppLXRoaXMuY3VycmVudE9mZnNldC55fTt0aGlzLmN1cnJlbnRPZmZzZXQueCs9YS54LHRoaXMuY3VycmVudE9mZnNldC55Kz1hLnksZS5vZmZzZXRCeShhKSxlLm1vdmUoe3NraXBNb2RpZmllcnM6dGhpcy5tb2RpZmllckNvdW50fSksdGhpcy50aW1lb3V0PW9hLmRlZmF1bHQucmVxdWVzdChmdW5jdGlvbigpe3JldHVybiB0LnNtb290aEVuZFRpY2soKX0pfWVsc2UgZS5vZmZzZXRCeSh7eDp0aGlzLnRhcmdldE9mZnNldC54LXRoaXMuY3VycmVudE9mZnNldC54LHk6dGhpcy50YXJnZXRPZmZzZXQueS10aGlzLmN1cnJlbnRPZmZzZXQueX0pLHRoaXMuZW5kKCl9fSx7a2V5OlwicmVzdW1lXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dC5wb2ludGVyLG49dC5ldmVudCxyPXQuZXZlbnRUYXJnZXQsbz10aGlzLmludGVyYWN0aW9uO28ub2Zmc2V0Qnkoe3g6LXRoaXMuY3VycmVudE9mZnNldC54LHk6LXRoaXMuY3VycmVudE9mZnNldC55fSksby51cGRhdGVQb2ludGVyKGUsbixyLCEwKSxvLl9kb1BoYXNlKHtpbnRlcmFjdGlvbjpvLGV2ZW50Om4scGhhc2U6XCJyZXN1bWVcIn0pLCgwLHp0LmNvcHlDb29yZHMpKG8uY29vcmRzLnByZXYsby5jb29yZHMuY3VyKSx0aGlzLnN0b3AoKX19LHtrZXk6XCJlbmRcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuaW50ZXJhY3Rpb24ubW92ZSgpLHRoaXMuaW50ZXJhY3Rpb24uZW5kKCksdGhpcy5zdG9wKCl9fSx7a2V5Olwic3RvcFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5hY3RpdmU9dGhpcy5zbW9vdGhFbmQ9ITEsdGhpcy5pbnRlcmFjdGlvbi5zaW11bGF0aW9uPW51bGwsb2EuZGVmYXVsdC5jYW5jZWwodGhpcy50aW1lb3V0KX19XSkmJnNhKHQucHJvdG90eXBlLG4pLHImJnNhKHQsciksZX0oKTtmdW5jdGlvbiBmYSh0KXt2YXIgZT10LmludGVyYWN0YWJsZSxuPXQucHJlcGFyZWQ7cmV0dXJuIGUmJmUub3B0aW9ucyYmbi5uYW1lJiZlLm9wdGlvbnNbbi5uYW1lXS5pbmVydGlhfWZ1bmN0aW9uIHBhKHQsZSxuLHIpe3ZhciBvPTEtdDtyZXR1cm4gbypvKmUrMipvKnQqbit0KnQqcn1mdW5jdGlvbiBkYSh0LGUsbixyKXtyZXR1cm4tbioodC89cikqKHQtMikrZX0kaS5JbmVydGlhU3RhdGU9Y2E7dmFyIHZhPXtpZDpcImluZXJ0aWFcIixiZWZvcmU6W1wibW9kaWZpZXJzL2Jhc2VcIl0saW5zdGFsbDpmdW5jdGlvbih0KXt2YXIgZT10LmRlZmF1bHRzO3QudXNlUGx1Z2luKHRhLmRlZmF1bHQpLHQudXNlUGx1Z2luKFFpLmRlZmF1bHQpLHQuYWN0aW9ucy5waGFzZXMuaW5lcnRpYXN0YXJ0PSEwLHQuYWN0aW9ucy5waGFzZXMucmVzdW1lPSEwLGUucGVyQWN0aW9uLmluZXJ0aWE9e2VuYWJsZWQ6ITEscmVzaXN0YW5jZToxMCxtaW5TcGVlZDoxMDAsZW5kU3BlZWQ6MTAsYWxsb3dSZXN1bWU6ITAsc21vb3RoRW5kRHVyYXRpb246MzAwfX0sbGlzdGVuZXJzOntcImludGVyYWN0aW9uczpuZXdcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uO2UuaW5lcnRpYT1uZXcgY2EoZSl9LFwiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tZW5kXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuZXZlbnQ7cmV0dXJuKCFlLl9pbnRlcmFjdGluZ3x8ZS5zaW11bGF0aW9ufHwhZS5pbmVydGlhLnN0YXJ0KG4pKSYmbnVsbH0sXCJpbnRlcmFjdGlvbnM6ZG93blwiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24sbj10LmV2ZW50VGFyZ2V0LHI9ZS5pbmVydGlhO2lmKHIuYWN0aXZlKWZvcih2YXIgbz1uO3JhLmVsZW1lbnQobyk7KXtpZihvPT09ZS5lbGVtZW50KXtyLnJlc3VtZSh0KTticmVha31vPWVhLnBhcmVudE5vZGUobyl9fSxcImludGVyYWN0aW9uczpzdG9wXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbi5pbmVydGlhO2UuYWN0aXZlJiZlLnN0b3AoKX0sXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1yZXN1bWVcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbjtlLnN0b3AodCksZS5zdGFydCh0LHQuaW50ZXJhY3Rpb24uY29vcmRzLmN1ci5wYWdlKSxlLmFwcGx5VG9JbnRlcmFjdGlvbih0KX0sXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1pbmVydGlhc3RhcnRcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24uc2V0QW5kQXBwbHkodCl9LFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1yZXN1bWVcIjpRaS5hZGRFdmVudE1vZGlmaWVycyxcImludGVyYWN0aW9uczphY3Rpb24taW5lcnRpYXN0YXJ0XCI6UWkuYWRkRXZlbnRNb2RpZmllcnMsXCJpbnRlcmFjdGlvbnM6YWZ0ZXItYWN0aW9uLWluZXJ0aWFzdGFydFwiOmZ1bmN0aW9uKHQpe3JldHVybiB0LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbi5yZXN0b3JlSW50ZXJhY3Rpb25Db29yZHModCl9LFwiaW50ZXJhY3Rpb25zOmFmdGVyLWFjdGlvbi1yZXN1bWVcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24ucmVzdG9yZUludGVyYWN0aW9uQ29vcmRzKHQpfX19OyRpLmRlZmF1bHQ9dmE7dmFyIHlhLGhhPXt9O2Z1bmN0aW9uIGdhKHQpe3JldHVybihnYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGhhLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGhhLmluaXQ9aGEuZGVmYXVsdD12b2lkIDA7dmFyIGJhPW5ldygoKHlhPW0oe30pKSYmeWEuX19lc01vZHVsZT95YTp7ZGVmYXVsdDp5YX0pLmRlZmF1bHQpLG1hPWJhLmludGVyYWN0U3RhdGljO2hhLmRlZmF1bHQ9bWE7ZnVuY3Rpb24gT2EodCl7cmV0dXJuIGJhLmluaXQodCl9aGEuaW5pdD1PYSxcIm9iamVjdFwiPT09KFwidW5kZWZpbmVkXCI9PXR5cGVvZiB3aW5kb3c/XCJ1bmRlZmluZWRcIjpnYSh3aW5kb3cpKSYmd2luZG93JiZPYSh3aW5kb3cpO3ZhciB3YT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkod2EsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksd2EuZGVmYXVsdD12b2lkIDA7d2EuZGVmYXVsdD17fTt2YXIgX2E9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KF9hLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLF9hLmRlZmF1bHQ9dm9pZCAwO19hLmRlZmF1bHQ9e307dmFyIFBhPXt9O2Z1bmN0aW9uIHhhKHQsZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIHR9KHQpfHxmdW5jdGlvbih0LGUpe2lmKCEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh0KXx8XCJbb2JqZWN0IEFyZ3VtZW50c11cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KSkpcmV0dXJuO3ZhciBuPVtdLHI9ITAsbz0hMSxpPXZvaWQgMDt0cnl7Zm9yKHZhciBhLHU9dFtTeW1ib2wuaXRlcmF0b3JdKCk7IShyPShhPXUubmV4dCgpKS5kb25lKSYmKG4ucHVzaChhLnZhbHVlKSwhZXx8bi5sZW5ndGghPT1lKTtyPSEwKTt9Y2F0Y2godCl7bz0hMCxpPXR9ZmluYWxseXt0cnl7cnx8bnVsbD09dS5yZXR1cm58fHUucmV0dXJuKCl9ZmluYWxseXtpZihvKXRocm93IGl9fXJldHVybiBufSh0LGUpfHxmdW5jdGlvbigpe3Rocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpfSgpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShQYSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxQYS5kZWZhdWx0PXZvaWQgMDtQYS5kZWZhdWx0PWZ1bmN0aW9uKHYpe2Z1bmN0aW9uIHQodCxlKXtmb3IodmFyIG49di5yYW5nZSxyPXYubGltaXRzLG89dm9pZCAwPT09cj97bGVmdDotMS8wLHJpZ2h0OjEvMCx0b3A6LTEvMCxib3R0b206MS8wfTpyLGk9di5vZmZzZXQsYT12b2lkIDA9PT1pP3t4OjAseTowfTppLHU9e3JhbmdlOm4sZ3JpZDp2LHg6bnVsbCx5Om51bGx9LHM9MDtzPHkubGVuZ3RoO3MrKyl7dmFyIGw9eGEoeVtzXSwyKSxjPWxbMF0sZj1sWzFdLHA9TWF0aC5yb3VuZCgodC1hLngpL3ZbY10pLGQ9TWF0aC5yb3VuZCgoZS1hLnkpL3ZbZl0pO3VbY109TWF0aC5tYXgoby5sZWZ0LE1hdGgubWluKG8ucmlnaHQscCp2W2NdK2EueCkpLHVbZl09TWF0aC5tYXgoby50b3AsTWF0aC5taW4oby5ib3R0b20sZCp2W2ZdK2EueSkpfXJldHVybiB1fXZhciB5PVtbXCJ4XCIsXCJ5XCJdLFtcImxlZnRcIixcInRvcFwiXSxbXCJyaWdodFwiLFwiYm90dG9tXCJdLFtcIndpZHRoXCIsXCJoZWlnaHRcIl1dLmZpbHRlcihmdW5jdGlvbih0KXt2YXIgZT14YSh0LDIpLG49ZVswXSxyPWVbMV07cmV0dXJuIG4gaW4gdnx8ciBpbiB2fSk7cmV0dXJuIHQuZ3JpZD12LHQuY29vcmRGaWVsZHM9eSx0fTt2YXIgU2E9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFNhLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTYSxcImVkZ2VUYXJnZXRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gamEuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoU2EsXCJlbGVtZW50c1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBNYS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTYSxcImdyaWRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4ga2EuZGVmYXVsdH19KTt2YXIgamE9RWEod2EpLE1hPUVhKF9hKSxrYT1FYShQYSk7ZnVuY3Rpb24gRWEodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBUYT17fTtmdW5jdGlvbiBEYSh0KXtyZXR1cm4oRGE9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShUYSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxUYS5kZWZhdWx0PXZvaWQgMDt2YXIgSWEsemE9KElhPWN0KSYmSWEuX19lc01vZHVsZT9JYTp7ZGVmYXVsdDpJYX0sQWE9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09RGEodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9Q2EoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oU2EpO2Z1bmN0aW9uIENhKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gQ2E9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH12YXIgV2E9e2lkOlwic25hcHBlcnNcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3RTdGF0aWM7ZS5zbmFwcGVycz0oMCx6YS5kZWZhdWx0KShlLnNuYXBwZXJzfHx7fSxBYSksZS5jcmVhdGVTbmFwR3JpZD1lLnNuYXBwZXJzLmdyaWR9fTtUYS5kZWZhdWx0PVdhO3ZhciBSYT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUmEsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksUmEuYXNwZWN0UmF0aW89UmEuZGVmYXVsdD12b2lkIDA7dmFyIEZhPVlhKGN0KSxYYT1ZYShfaSk7ZnVuY3Rpb24gWWEodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIE5hKGUsdCl7dmFyIG49T2JqZWN0LmtleXMoZSk7aWYoT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyl7dmFyIHI9T2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhlKTt0JiYocj1yLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihlLHQpLmVudW1lcmFibGV9KSksbi5wdXNoLmFwcGx5KG4scil9cmV0dXJuIG59ZnVuY3Rpb24gTGEoZSl7Zm9yKHZhciB0PTE7dDxhcmd1bWVudHMubGVuZ3RoO3QrKyl7dmFyIG49bnVsbCE9YXJndW1lbnRzW3RdP2FyZ3VtZW50c1t0XTp7fTt0JTI/TmEoT2JqZWN0KG4pLCEwKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe0JhKGUsdCxuW3RdKX0pOk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3JzP09iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKGUsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnMobikpOk5hKE9iamVjdChuKSkuZm9yRWFjaChmdW5jdGlvbih0KXtPYmplY3QuZGVmaW5lUHJvcGVydHkoZSx0LE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iobix0KSl9KX1yZXR1cm4gZX1mdW5jdGlvbiBCYSh0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9dmFyIFZhPXtzdGFydDpmdW5jdGlvbih0KXt2YXIgZT10LnN0YXRlLG49dC5yZWN0LHI9dC5lZGdlcyxvPXQucGFnZUNvb3JkcyxpPWUub3B0aW9ucy5yYXRpbyxhPWUub3B0aW9ucyx1PWEuZXF1YWxEZWx0YSxzPWEubW9kaWZpZXJzO1wicHJlc2VydmVcIj09PWkmJihpPW4ud2lkdGgvbi5oZWlnaHQpLGUuc3RhcnRDb29yZHM9KDAsRmEuZGVmYXVsdCkoe30sbyksZS5zdGFydFJlY3Q9KDAsRmEuZGVmYXVsdCkoe30sbiksZS5yYXRpbz1pLGUuZXF1YWxEZWx0YT11O3ZhciBsPWUubGlua2VkRWRnZXM9e3RvcDpyLnRvcHx8ci5sZWZ0JiYhci5ib3R0b20sbGVmdDpyLmxlZnR8fHIudG9wJiYhci5yaWdodCxib3R0b206ci5ib3R0b218fHIucmlnaHQmJiFyLnRvcCxyaWdodDpyLnJpZ2h0fHxyLmJvdHRvbSYmIXIubGVmdH07aWYoZS54SXNQcmltYXJ5QXhpcz0hKCFyLmxlZnQmJiFyLnJpZ2h0KSxlLmVxdWFsRGVsdGEpZS5lZGdlU2lnbj0obC5sZWZ0PzE6LTEpKihsLnRvcD8xOi0xKTtlbHNle3ZhciBjPWUueElzUHJpbWFyeUF4aXM/bC50b3A6bC5sZWZ0O2UuZWRnZVNpZ249Yz8tMToxfWlmKCgwLEZhLmRlZmF1bHQpKHQuZWRnZXMsbCkscyYmcy5sZW5ndGgpe3ZhciBmPW5ldyBYYS5kZWZhdWx0KHQuaW50ZXJhY3Rpb24pO2YuY29weUZyb20odC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24pLGYucHJlcGFyZVN0YXRlcyhzKSwoZS5zdWJNb2RpZmljYXRpb249Zikuc3RhcnRBbGwoTGEoe30sdCkpfX0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPXQuc3RhdGUsbj10LnJlY3Qscj10LmNvb3JkcyxvPSgwLEZhLmRlZmF1bHQpKHt9LHIpLGk9ZS5lcXVhbERlbHRhP3FhOlVhO2lmKGkoZSxlLnhJc1ByaW1hcnlBeGlzLHIsbiksIWUuc3ViTW9kaWZpY2F0aW9uKXJldHVybiBudWxsO3ZhciBhPSgwLEZhLmRlZmF1bHQpKHt9LG4pOygwLCR0LmFkZEVkZ2VzKShlLmxpbmtlZEVkZ2VzLGEse3g6ci54LW8ueCx5OnIueS1vLnl9KTt2YXIgdT1lLnN1Yk1vZGlmaWNhdGlvbi5zZXRBbGwoTGEoe30sdCx7cmVjdDphLGVkZ2VzOmUubGlua2VkRWRnZXMscGFnZUNvb3JkczpyLHByZXZDb29yZHM6cixwcmV2UmVjdDphfSkpLHM9dS5kZWx0YTt1LmNoYW5nZWQmJihpKGUsTWF0aC5hYnMocy54KT5NYXRoLmFicyhzLnkpLHUuY29vcmRzLHUucmVjdCksKDAsRmEuZGVmYXVsdCkocix1LmNvb3JkcykpO3JldHVybiB1LmV2ZW50UHJvcHN9LGRlZmF1bHRzOntyYXRpbzpcInByZXNlcnZlXCIsZXF1YWxEZWx0YTohMSxtb2RpZmllcnM6W10sZW5hYmxlZDohMX19O2Z1bmN0aW9uIHFhKHQsZSxuKXt2YXIgcj10LnN0YXJ0Q29vcmRzLG89dC5lZGdlU2lnbjtlP24ueT1yLnkrKG4ueC1yLngpKm86bi54PXIueCsobi55LXIueSkqb31mdW5jdGlvbiBVYSh0LGUsbixyKXt2YXIgbz10LnN0YXJ0UmVjdCxpPXQuc3RhcnRDb29yZHMsYT10LnJhdGlvLHU9dC5lZGdlU2lnbjtpZihlKXt2YXIgcz1yLndpZHRoL2E7bi55PWkueSsocy1vLmhlaWdodCkqdX1lbHNle3ZhciBsPXIuaGVpZ2h0KmE7bi54PWkueCsobC1vLndpZHRoKSp1fX1SYS5hc3BlY3RSYXRpbz1WYTt2YXIgR2E9KDAsQ2kubWFrZU1vZGlmaWVyKShWYSxcImFzcGVjdFJhdGlvXCIpO1JhLmRlZmF1bHQ9R2E7dmFyIEhhPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShIYSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxIYS5kZWZhdWx0PXZvaWQgMDtmdW5jdGlvbiBLYSgpe31LYS5fZGVmYXVsdHM9e307dmFyICRhPUthO0hhLmRlZmF1bHQ9JGE7dmFyIFphPXt9O2Z1bmN0aW9uIEphKHQpe3JldHVybihKYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFphLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFphLmdldFJlc3RyaWN0aW9uUmVjdD1pdSxaYS5yZXN0cmljdD1aYS5kZWZhdWx0PXZvaWQgMDt2YXIgUWEsdHU9KFFhPWN0KSYmUWEuX19lc01vZHVsZT9RYTp7ZGVmYXVsdDpRYX0sZXU9b3UodyksbnU9b3UoJHQpO2Z1bmN0aW9uIHJ1KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gcnU9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBvdSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1KYSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1ydSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIGl1KHQsZSxuKXtyZXR1cm4gZXUuZnVuYyh0KT9udS5yZXNvbHZlUmVjdExpa2UodCxlLmludGVyYWN0YWJsZSxlLmVsZW1lbnQsW24ueCxuLnksZV0pOm51LnJlc29sdmVSZWN0TGlrZSh0LGUuaW50ZXJhY3RhYmxlLGUuZWxlbWVudCl9dmFyIGF1PXtzdGFydDpmdW5jdGlvbih0KXt2YXIgZT10LnJlY3Qsbj10LnN0YXJ0T2Zmc2V0LHI9dC5zdGF0ZSxvPXQuaW50ZXJhY3Rpb24saT10LnBhZ2VDb29yZHMsYT1yLm9wdGlvbnMsdT1hLmVsZW1lbnRSZWN0LHM9KDAsdHUuZGVmYXVsdCkoe2xlZnQ6MCx0b3A6MCxyaWdodDowLGJvdHRvbTowfSxhLm9mZnNldHx8e30pO2lmKGUmJnUpe3ZhciBsPWl1KGEucmVzdHJpY3Rpb24sbyxpKTtpZihsKXt2YXIgYz1sLnJpZ2h0LWwubGVmdC1lLndpZHRoLGY9bC5ib3R0b20tbC50b3AtZS5oZWlnaHQ7YzwwJiYocy5sZWZ0Kz1jLHMucmlnaHQrPWMpLGY8MCYmKHMudG9wKz1mLHMuYm90dG9tKz1mKX1zLmxlZnQrPW4ubGVmdC1lLndpZHRoKnUubGVmdCxzLnRvcCs9bi50b3AtZS5oZWlnaHQqdS50b3Ascy5yaWdodCs9bi5yaWdodC1lLndpZHRoKigxLXUucmlnaHQpLHMuYm90dG9tKz1uLmJvdHRvbS1lLmhlaWdodCooMS11LmJvdHRvbSl9ci5vZmZzZXQ9c30sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPXQuY29vcmRzLG49dC5pbnRlcmFjdGlvbixyPXQuc3RhdGUsbz1yLm9wdGlvbnMsaT1yLm9mZnNldCxhPWl1KG8ucmVzdHJpY3Rpb24sbixlKTtpZihhKXt2YXIgdT1udS54eXdoVG9UbGJyKGEpO2UueD1NYXRoLm1heChNYXRoLm1pbih1LnJpZ2h0LWkucmlnaHQsZS54KSx1LmxlZnQraS5sZWZ0KSxlLnk9TWF0aC5tYXgoTWF0aC5taW4odS5ib3R0b20taS5ib3R0b20sZS55KSx1LnRvcCtpLnRvcCl9fSxkZWZhdWx0czp7cmVzdHJpY3Rpb246bnVsbCxlbGVtZW50UmVjdDpudWxsLG9mZnNldDpudWxsLGVuZE9ubHk6ITEsZW5hYmxlZDohMX19O1phLnJlc3RyaWN0PWF1O3ZhciB1dT0oMCxDaS5tYWtlTW9kaWZpZXIpKGF1LFwicmVzdHJpY3RcIik7WmEuZGVmYXVsdD11dTt2YXIgc3U9e307ZnVuY3Rpb24gbHUodCl7cmV0dXJuKGx1PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoc3UsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksc3UucmVzdHJpY3RFZGdlcz1zdS5kZWZhdWx0PXZvaWQgMDt2YXIgY3UsZnU9KGN1PWN0KSYmY3UuX19lc01vZHVsZT9jdTp7ZGVmYXVsdDpjdX0scHU9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09bHUodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9ZHUoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oJHQpO2Z1bmN0aW9uIGR1KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gZHU9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH12YXIgdnU9e3RvcDoxLzAsbGVmdDoxLzAsYm90dG9tOi0xLzAscmlnaHQ6LTEvMH0seXU9e3RvcDotMS8wLGxlZnQ6LTEvMCxib3R0b206MS8wLHJpZ2h0OjEvMH07ZnVuY3Rpb24gaHUodCxlKXtmb3IodmFyIG49W1widG9wXCIsXCJsZWZ0XCIsXCJib3R0b21cIixcInJpZ2h0XCJdLHI9MDtyPG4ubGVuZ3RoO3IrKyl7dmFyIG89bltyXTtvIGluIHR8fCh0W29dPWVbb10pfXJldHVybiB0fXZhciBndT17bm9Jbm5lcjp2dSxub091dGVyOnl1LHN0YXJ0OmZ1bmN0aW9uKHQpe3ZhciBlLG49dC5pbnRlcmFjdGlvbixyPXQuc3RhcnRPZmZzZXQsbz10LnN0YXRlLGk9by5vcHRpb25zO2lmKGkpe3ZhciBhPSgwLFphLmdldFJlc3RyaWN0aW9uUmVjdCkoaS5vZmZzZXQsbixuLmNvb3Jkcy5zdGFydC5wYWdlKTtlPXB1LnJlY3RUb1hZKGEpfWU9ZXx8e3g6MCx5OjB9LG8ub2Zmc2V0PXt0b3A6ZS55K3IudG9wLGxlZnQ6ZS54K3IubGVmdCxib3R0b206ZS55LXIuYm90dG9tLHJpZ2h0OmUueC1yLnJpZ2h0fX0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPXQuY29vcmRzLG49dC5lZGdlcyxyPXQuaW50ZXJhY3Rpb24sbz10LnN0YXRlLGk9by5vZmZzZXQsYT1vLm9wdGlvbnM7aWYobil7dmFyIHU9KDAsZnUuZGVmYXVsdCkoe30sZSkscz0oMCxaYS5nZXRSZXN0cmljdGlvblJlY3QpKGEuaW5uZXIscix1KXx8e30sbD0oMCxaYS5nZXRSZXN0cmljdGlvblJlY3QpKGEub3V0ZXIscix1KXx8e307aHUocyx2dSksaHUobCx5dSksbi50b3A/ZS55PU1hdGgubWluKE1hdGgubWF4KGwudG9wK2kudG9wLHUueSkscy50b3AraS50b3ApOm4uYm90dG9tJiYoZS55PU1hdGgubWF4KE1hdGgubWluKGwuYm90dG9tK2kuYm90dG9tLHUueSkscy5ib3R0b20raS5ib3R0b20pKSxuLmxlZnQ/ZS54PU1hdGgubWluKE1hdGgubWF4KGwubGVmdCtpLmxlZnQsdS54KSxzLmxlZnQraS5sZWZ0KTpuLnJpZ2h0JiYoZS54PU1hdGgubWF4KE1hdGgubWluKGwucmlnaHQraS5yaWdodCx1LngpLHMucmlnaHQraS5yaWdodCkpfX0sZGVmYXVsdHM6e2lubmVyOm51bGwsb3V0ZXI6bnVsbCxvZmZzZXQ6bnVsbCxlbmRPbmx5OiExLGVuYWJsZWQ6ITF9fTtzdS5yZXN0cmljdEVkZ2VzPWd1O3ZhciBidT0oMCxDaS5tYWtlTW9kaWZpZXIpKGd1LFwicmVzdHJpY3RFZGdlc1wiKTtzdS5kZWZhdWx0PWJ1O3ZhciBtdSxPdT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoT3UsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT3UucmVzdHJpY3RSZWN0PU91LmRlZmF1bHQ9dm9pZCAwO3ZhciB3dT0oMCwoKG11PWN0KSYmbXUuX19lc01vZHVsZT9tdTp7ZGVmYXVsdDptdX0pLmRlZmF1bHQpKHtnZXQgZWxlbWVudFJlY3QoKXtyZXR1cm57dG9wOjAsbGVmdDowLGJvdHRvbToxLHJpZ2h0OjF9fSxzZXQgZWxlbWVudFJlY3QodCl7fX0sWmEucmVzdHJpY3QuZGVmYXVsdHMpLF91PXtzdGFydDpaYS5yZXN0cmljdC5zdGFydCxzZXQ6WmEucmVzdHJpY3Quc2V0LGRlZmF1bHRzOnd1fTtPdS5yZXN0cmljdFJlY3Q9X3U7dmFyIFB1PSgwLENpLm1ha2VNb2RpZmllcikoX3UsXCJyZXN0cmljdFJlY3RcIik7T3UuZGVmYXVsdD1QdTt2YXIgeHU9e307ZnVuY3Rpb24gU3UodCl7cmV0dXJuKFN1PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoeHUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSkseHUucmVzdHJpY3RTaXplPXh1LmRlZmF1bHQ9dm9pZCAwO3ZhciBqdSxNdT0oanU9Y3QpJiZqdS5fX2VzTW9kdWxlP2p1OntkZWZhdWx0Omp1fSxrdT1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1TdSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1FdSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSgkdCk7ZnVuY3Rpb24gRXUoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBFdT1mdW5jdGlvbigpe3JldHVybiB0fSx0fXZhciBUdT17d2lkdGg6LTEvMCxoZWlnaHQ6LTEvMH0sRHU9e3dpZHRoOjEvMCxoZWlnaHQ6MS8wfTt2YXIgSXU9e3N0YXJ0OmZ1bmN0aW9uKHQpe3JldHVybiBzdS5yZXN0cmljdEVkZ2VzLnN0YXJ0KHQpfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuc3RhdGUscj10LnJlY3Qsbz10LmVkZ2VzLGk9bi5vcHRpb25zO2lmKG8pe3ZhciBhPWt1LnRsYnJUb1h5d2goKDAsWmEuZ2V0UmVzdHJpY3Rpb25SZWN0KShpLm1pbixlLHQuY29vcmRzKSl8fFR1LHU9a3UudGxiclRvWHl3aCgoMCxaYS5nZXRSZXN0cmljdGlvblJlY3QpKGkubWF4LGUsdC5jb29yZHMpKXx8RHU7bi5vcHRpb25zPXtlbmRPbmx5OmkuZW5kT25seSxpbm5lcjooMCxNdS5kZWZhdWx0KSh7fSxzdS5yZXN0cmljdEVkZ2VzLm5vSW5uZXIpLG91dGVyOigwLE11LmRlZmF1bHQpKHt9LHN1LnJlc3RyaWN0RWRnZXMubm9PdXRlcil9LG8udG9wPyhuLm9wdGlvbnMuaW5uZXIudG9wPXIuYm90dG9tLWEuaGVpZ2h0LG4ub3B0aW9ucy5vdXRlci50b3A9ci5ib3R0b20tdS5oZWlnaHQpOm8uYm90dG9tJiYobi5vcHRpb25zLmlubmVyLmJvdHRvbT1yLnRvcCthLmhlaWdodCxuLm9wdGlvbnMub3V0ZXIuYm90dG9tPXIudG9wK3UuaGVpZ2h0KSxvLmxlZnQ/KG4ub3B0aW9ucy5pbm5lci5sZWZ0PXIucmlnaHQtYS53aWR0aCxuLm9wdGlvbnMub3V0ZXIubGVmdD1yLnJpZ2h0LXUud2lkdGgpOm8ucmlnaHQmJihuLm9wdGlvbnMuaW5uZXIucmlnaHQ9ci5sZWZ0K2Eud2lkdGgsbi5vcHRpb25zLm91dGVyLnJpZ2h0PXIubGVmdCt1LndpZHRoKSxzdS5yZXN0cmljdEVkZ2VzLnNldCh0KSxuLm9wdGlvbnM9aX19LGRlZmF1bHRzOnttaW46bnVsbCxtYXg6bnVsbCxlbmRPbmx5OiExLGVuYWJsZWQ6ITF9fTt4dS5yZXN0cmljdFNpemU9SXU7dmFyIHp1PSgwLENpLm1ha2VNb2RpZmllcikoSXUsXCJyZXN0cmljdFNpemVcIik7eHUuZGVmYXVsdD16dTt2YXIgQXU9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KEF1LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEF1LmRlZmF1bHQ9dm9pZCAwO2Z1bmN0aW9uIEN1KCl7fUN1Ll9kZWZhdWx0cz17fTt2YXIgV3U9Q3U7QXUuZGVmYXVsdD1XdTt2YXIgUnU9e307ZnVuY3Rpb24gRnUodCl7cmV0dXJuKEZ1PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoUnUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksUnUuc25hcD1SdS5kZWZhdWx0PXZvaWQgMDt2YXIgWHU9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09RnUodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9WXUoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0obGUpO2Z1bmN0aW9uIFl1KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gWXU9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH12YXIgTnU9e3N0YXJ0OmZ1bmN0aW9uKHQpe3ZhciBlLG4scixvPXQuaW50ZXJhY3Rpb24saT10LmludGVyYWN0YWJsZSxhPXQuZWxlbWVudCx1PXQucmVjdCxzPXQuc3RhdGUsbD10LnN0YXJ0T2Zmc2V0LGM9cy5vcHRpb25zLGY9Yy5vZmZzZXRXaXRoT3JpZ2luPyhuPShlPXQpLmludGVyYWN0aW9uLmVsZW1lbnQsWHUucmVjdC5yZWN0VG9YWShYdS5yZWN0LnJlc29sdmVSZWN0TGlrZShlLnN0YXRlLm9wdGlvbnMub3JpZ2luLG51bGwsbnVsbCxbbl0pKXx8WHUuZ2V0T3JpZ2luWFkoZS5pbnRlcmFjdGFibGUsbixlLmludGVyYWN0aW9uLnByZXBhcmVkLm5hbWUpKTp7eDowLHk6MH07aWYoXCJzdGFydENvb3Jkc1wiPT09Yy5vZmZzZXQpcj17eDpvLmNvb3Jkcy5zdGFydC5wYWdlLngseTpvLmNvb3Jkcy5zdGFydC5wYWdlLnl9O2Vsc2V7dmFyIHA9WHUucmVjdC5yZXNvbHZlUmVjdExpa2UoYy5vZmZzZXQsaSxhLFtvXSk7KHI9WHUucmVjdC5yZWN0VG9YWShwKXx8e3g6MCx5OjB9KS54Kz1mLngsci55Kz1mLnl9dmFyIGQ9Yy5yZWxhdGl2ZVBvaW50cztzLm9mZnNldHM9dSYmZCYmZC5sZW5ndGg/ZC5tYXAoZnVuY3Rpb24odCxlKXtyZXR1cm57aW5kZXg6ZSxyZWxhdGl2ZVBvaW50OnQseDpsLmxlZnQtdS53aWR0aCp0Lngrci54LHk6bC50b3AtdS5oZWlnaHQqdC55K3IueX19KTpbWHUuZXh0ZW5kKHtpbmRleDowLHJlbGF0aXZlUG9pbnQ6bnVsbH0scildfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuY29vcmRzLHI9dC5zdGF0ZSxvPXIub3B0aW9ucyxpPXIub2Zmc2V0cyxhPVh1LmdldE9yaWdpblhZKGUuaW50ZXJhY3RhYmxlLGUuZWxlbWVudCxlLnByZXBhcmVkLm5hbWUpLHU9WHUuZXh0ZW5kKHt9LG4pLHM9W107by5vZmZzZXRXaXRoT3JpZ2lufHwodS54LT1hLngsdS55LT1hLnkpO2Zvcih2YXIgbD0wO2w8aS5sZW5ndGg7bCsrKWZvcih2YXIgYz1pW2xdLGY9dS54LWMueCxwPXUueS1jLnksZD0wLHY9by50YXJnZXRzLmxlbmd0aDtkPHY7ZCsrKXt2YXIgeT1vLnRhcmdldHNbZF0saD12b2lkIDA7KGg9WHUuaXMuZnVuYyh5KT95KGYscCxlLGMsZCk6eSkmJnMucHVzaCh7eDooWHUuaXMubnVtYmVyKGgueCk/aC54OmYpK2MueCx5OihYdS5pcy5udW1iZXIoaC55KT9oLnk6cCkrYy55LHJhbmdlOlh1LmlzLm51bWJlcihoLnJhbmdlKT9oLnJhbmdlOm8ucmFuZ2Usc291cmNlOnksaW5kZXg6ZCxvZmZzZXQ6Y30pfWZvcih2YXIgZz17dGFyZ2V0Om51bGwsaW5SYW5nZTohMSxkaXN0YW5jZTowLHJhbmdlOjAsZGVsdGE6e3g6MCx5OjB9fSxiPTA7YjxzLmxlbmd0aDtiKyspe3ZhciBtPXNbYl0sTz1tLnJhbmdlLHc9bS54LXUueCxfPW0ueS11LnksUD1YdS5oeXBvdCh3LF8pLHg9UDw9TztPPT09MS8wJiZnLmluUmFuZ2UmJmcucmFuZ2UhPT0xLzAmJih4PSExKSxnLnRhcmdldCYmISh4P2cuaW5SYW5nZSYmTyE9PTEvMD9QL088Zy5kaXN0YW5jZS9nLnJhbmdlOk89PT0xLzAmJmcucmFuZ2UhPT0xLzB8fFA8Zy5kaXN0YW5jZTohZy5pblJhbmdlJiZQPGcuZGlzdGFuY2UpfHwoZy50YXJnZXQ9bSxnLmRpc3RhbmNlPVAsZy5yYW5nZT1PLGcuaW5SYW5nZT14LGcuZGVsdGEueD13LGcuZGVsdGEueT1fKX1yZXR1cm4gZy5pblJhbmdlJiYobi54PWcudGFyZ2V0Lngsbi55PWcudGFyZ2V0LnkpLHIuY2xvc2VzdD1nfSxkZWZhdWx0czp7cmFuZ2U6MS8wLHRhcmdldHM6bnVsbCxvZmZzZXQ6bnVsbCxvZmZzZXRXaXRoT3JpZ2luOiEwLG9yaWdpbjpudWxsLHJlbGF0aXZlUG9pbnRzOm51bGwsZW5kT25seTohMSxlbmFibGVkOiExfX07UnUuc25hcD1OdTt2YXIgTHU9KDAsQ2kubWFrZU1vZGlmaWVyKShOdSxcInNuYXBcIik7UnUuZGVmYXVsdD1MdTt2YXIgQnU9e307ZnVuY3Rpb24gVnUodCl7cmV0dXJuKFZ1PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoQnUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksQnUuc25hcFNpemU9QnUuZGVmYXVsdD12b2lkIDA7dmFyIHF1LFV1PShxdT1jdCkmJnF1Ll9fZXNNb2R1bGU/cXU6e2RlZmF1bHQ6cXV9LEd1PWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVZ1KHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPUh1KCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpO2Z1bmN0aW9uIEh1KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gSHU9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBLdSh0LGUpe3JldHVybiBmdW5jdGlvbih0KXtpZihBcnJheS5pc0FycmF5KHQpKXJldHVybiB0fSh0KXx8ZnVuY3Rpb24odCxlKXtpZighKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodCl8fFwiW29iamVjdCBBcmd1bWVudHNdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkpKXJldHVybjt2YXIgbj1bXSxyPSEwLG89ITEsaT12b2lkIDA7dHJ5e2Zvcih2YXIgYSx1PXRbU3ltYm9sLml0ZXJhdG9yXSgpOyEocj0oYT11Lm5leHQoKSkuZG9uZSkmJihuLnB1c2goYS52YWx1ZSksIWV8fG4ubGVuZ3RoIT09ZSk7cj0hMCk7fWNhdGNoKHQpe289ITAsaT10fWZpbmFsbHl7dHJ5e3J8fG51bGw9PXUucmV0dXJufHx1LnJldHVybigpfWZpbmFsbHl7aWYobyl0aHJvdyBpfX1yZXR1cm4gbn0odCxlKXx8ZnVuY3Rpb24oKXt0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKX0oKX12YXIgJHU9e3N0YXJ0OmZ1bmN0aW9uKHQpe3ZhciBlPXQuc3RhdGUsbj10LmVkZ2VzLHI9ZS5vcHRpb25zO2lmKCFuKXJldHVybiBudWxsO3Quc3RhdGU9e29wdGlvbnM6e3RhcmdldHM6bnVsbCxyZWxhdGl2ZVBvaW50czpbe3g6bi5sZWZ0PzA6MSx5Om4udG9wPzA6MX1dLG9mZnNldDpyLm9mZnNldHx8XCJzZWxmXCIsb3JpZ2luOnt4OjAseTowfSxyYW5nZTpyLnJhbmdlfX0sZS50YXJnZXRGaWVsZHM9ZS50YXJnZXRGaWVsZHN8fFtbXCJ3aWR0aFwiLFwiaGVpZ2h0XCJdLFtcInhcIixcInlcIl1dLFJ1LnNuYXAuc3RhcnQodCksZS5vZmZzZXRzPXQuc3RhdGUub2Zmc2V0cyx0LnN0YXRlPWV9LHNldDpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5zdGF0ZSxyPXQuY29vcmRzLG89bi5vcHRpb25zLGk9bi5vZmZzZXRzLGE9e3g6ci54LWlbMF0ueCx5OnIueS1pWzBdLnl9O24ub3B0aW9ucz0oMCxVdS5kZWZhdWx0KSh7fSxvKSxuLm9wdGlvbnMudGFyZ2V0cz1bXTtmb3IodmFyIHU9MDt1PChvLnRhcmdldHN8fFtdKS5sZW5ndGg7dSsrKXt2YXIgcz0oby50YXJnZXRzfHxbXSlbdV0sbD12b2lkIDA7aWYobD1HdS5mdW5jKHMpP3MoYS54LGEueSxlKTpzKXtmb3IodmFyIGM9MDtjPG4udGFyZ2V0RmllbGRzLmxlbmd0aDtjKyspe3ZhciBmPUt1KG4udGFyZ2V0RmllbGRzW2NdLDIpLHA9ZlswXSxkPWZbMV07aWYocCBpbiBsfHxkIGluIGwpe2wueD1sW3BdLGwueT1sW2RdO2JyZWFrfX1uLm9wdGlvbnMudGFyZ2V0cy5wdXNoKGwpfX12YXIgdj1SdS5zbmFwLnNldCh0KTtyZXR1cm4gbi5vcHRpb25zPW8sdn0sZGVmYXVsdHM6e3JhbmdlOjEvMCx0YXJnZXRzOm51bGwsb2Zmc2V0Om51bGwsZW5kT25seTohMSxlbmFibGVkOiExfX07QnUuc25hcFNpemU9JHU7dmFyIFp1PSgwLENpLm1ha2VNb2RpZmllcikoJHUsXCJzbmFwU2l6ZVwiKTtCdS5kZWZhdWx0PVp1O3ZhciBKdT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoSnUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksSnUuc25hcEVkZ2VzPUp1LmRlZmF1bHQ9dm9pZCAwO3ZhciBRdT1lcyhWKSx0cz1lcyhjdCk7ZnVuY3Rpb24gZXModCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBucz17c3RhcnQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5lZGdlcztyZXR1cm4gZT8odC5zdGF0ZS50YXJnZXRGaWVsZHM9dC5zdGF0ZS50YXJnZXRGaWVsZHN8fFtbZS5sZWZ0P1wibGVmdFwiOlwicmlnaHRcIixlLnRvcD9cInRvcFwiOlwiYm90dG9tXCJdXSxCdS5zbmFwU2l6ZS5zdGFydCh0KSk6bnVsbH0sc2V0OkJ1LnNuYXBTaXplLnNldCxkZWZhdWx0czooMCx0cy5kZWZhdWx0KSgoMCxRdS5kZWZhdWx0KShCdS5zbmFwU2l6ZS5kZWZhdWx0cykse3RhcmdldHM6bnVsbCxyYW5nZTpudWxsLG9mZnNldDp7eDowLHk6MH19KX07SnUuc25hcEVkZ2VzPW5zO3ZhciBycz0oMCxDaS5tYWtlTW9kaWZpZXIpKG5zLFwic25hcEVkZ2VzXCIpO0p1LmRlZmF1bHQ9cnM7dmFyIG9zPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShvcyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxvcy5kZWZhdWx0PXZvaWQgMDtmdW5jdGlvbiBpcygpe31pcy5fZGVmYXVsdHM9e307dmFyIGFzPWlzO29zLmRlZmF1bHQ9YXM7dmFyIHVzPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh1cyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx1cy5kZWZhdWx0PXZvaWQgMDtmdW5jdGlvbiBzcygpe31zcy5fZGVmYXVsdHM9e307dmFyIGxzPXNzO3VzLmRlZmF1bHQ9bHM7dmFyIGNzPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShjcyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxjcy5kZWZhdWx0PXZvaWQgMDt2YXIgZnM9UHMoUmEpLHBzPVBzKEhhKSxkcz1QcyhzdSksdnM9UHMoWmEpLHlzPVBzKE91KSxocz1Qcyh4dSksZ3M9UHMoQXUpLGJzPVBzKEp1KSxtcz1QcyhSdSksT3M9UHMoQnUpLHdzPVBzKG9zKSxfcz1Qcyh1cyk7ZnVuY3Rpb24gUHModCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciB4cz17YXNwZWN0UmF0aW86ZnMuZGVmYXVsdCxyZXN0cmljdEVkZ2VzOmRzLmRlZmF1bHQscmVzdHJpY3Q6dnMuZGVmYXVsdCxyZXN0cmljdFJlY3Q6eXMuZGVmYXVsdCxyZXN0cmljdFNpemU6aHMuZGVmYXVsdCxzbmFwRWRnZXM6YnMuZGVmYXVsdCxzbmFwOm1zLmRlZmF1bHQsc25hcFNpemU6T3MuZGVmYXVsdCxzcHJpbmc6d3MuZGVmYXVsdCxhdm9pZDpwcy5kZWZhdWx0LHRyYW5zZm9ybTpfcy5kZWZhdWx0LHJ1YmJlcmJhbmQ6Z3MuZGVmYXVsdH07Y3MuZGVmYXVsdD14czt2YXIgU3M9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFNzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFNzLmRlZmF1bHQ9dm9pZCAwO3ZhciBqcz1FcyhUYSksTXM9RXMoY3MpLGtzPUVzKENpKTtmdW5jdGlvbiBFcyh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIFRzPXtpZDpcIm1vZGlmaWVyc1wiLGluc3RhbGw6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdFN0YXRpYztmb3IodmFyIG4gaW4gdC51c2VQbHVnaW4oa3MuZGVmYXVsdCksdC51c2VQbHVnaW4oanMuZGVmYXVsdCksZS5tb2RpZmllcnM9TXMuZGVmYXVsdCxNcy5kZWZhdWx0KXt2YXIgcj1Ncy5kZWZhdWx0W25dLG89ci5fZGVmYXVsdHMsaT1yLl9tZXRob2RzO28uX21ldGhvZHM9aSx0LmRlZmF1bHRzLnBlckFjdGlvbltuXT1vfX19O1NzLmRlZmF1bHQ9VHM7dmFyIERzPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShEcyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxEcy5kZWZhdWx0PXZvaWQgMDtEcy5kZWZhdWx0PXt9O3ZhciBJcz17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoSXMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksSXMuUG9pbnRlckV2ZW50PUlzLmRlZmF1bHQ9dm9pZCAwO3ZhciB6cyxBcz0oenM9TWUpJiZ6cy5fX2VzTW9kdWxlP3pzOntkZWZhdWx0OnpzfSxDcz1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1Scyh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1XcygpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSh6dCk7ZnVuY3Rpb24gV3MoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBXcz1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIFJzKHQpe3JldHVybihScz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9ZnVuY3Rpb24gRnModCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIFhzKHQpe3JldHVybihYcz1PYmplY3Quc2V0UHJvdG90eXBlT2Y/T2JqZWN0LmdldFByb3RvdHlwZU9mOmZ1bmN0aW9uKHQpe3JldHVybiB0Ll9fcHJvdG9fX3x8T2JqZWN0LmdldFByb3RvdHlwZU9mKHQpfSkodCl9ZnVuY3Rpb24gWXModCl7aWYodm9pZCAwPT09dCl0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7cmV0dXJuIHR9ZnVuY3Rpb24gTnModCxlKXtyZXR1cm4oTnM9T2JqZWN0LnNldFByb3RvdHlwZU9mfHxmdW5jdGlvbih0LGUpe3JldHVybiB0Ll9fcHJvdG9fXz1lLHR9KSh0LGUpfWZ1bmN0aW9uIExzKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH12YXIgQnM9ZnVuY3Rpb24oKXtmdW5jdGlvbiBmKHQsZSxuLHIsbyxpKXt2YXIgYSx1LHM7aWYoIWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxmKSx1PXRoaXMsYT0hKHM9WHMoZikuY2FsbCh0aGlzLG8pKXx8XCJvYmplY3RcIiE9PVJzKHMpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBzP1lzKHUpOnMsTHMoWXMoYSksXCJ0eXBlXCIsdm9pZCAwKSxMcyhZcyhhKSxcIm9yaWdpbmFsRXZlbnRcIix2b2lkIDApLExzKFlzKGEpLFwicG9pbnRlcklkXCIsdm9pZCAwKSxMcyhZcyhhKSxcInBvaW50ZXJUeXBlXCIsdm9pZCAwKSxMcyhZcyhhKSxcImRvdWJsZVwiLHZvaWQgMCksTHMoWXMoYSksXCJwYWdlWFwiLHZvaWQgMCksTHMoWXMoYSksXCJwYWdlWVwiLHZvaWQgMCksTHMoWXMoYSksXCJjbGllbnRYXCIsdm9pZCAwKSxMcyhZcyhhKSxcImNsaWVudFlcIix2b2lkIDApLExzKFlzKGEpLFwiZHRcIix2b2lkIDApLExzKFlzKGEpLFwiZXZlbnRhYmxlXCIsdm9pZCAwKSxDcy5wb2ludGVyRXh0ZW5kKFlzKGEpLG4pLG4hPT1lJiZDcy5wb2ludGVyRXh0ZW5kKFlzKGEpLGUpLGEudGltZVN0YW1wPWksYS5vcmlnaW5hbEV2ZW50PW4sYS50eXBlPXQsYS5wb2ludGVySWQ9Q3MuZ2V0UG9pbnRlcklkKGUpLGEucG9pbnRlclR5cGU9Q3MuZ2V0UG9pbnRlclR5cGUoZSksYS50YXJnZXQ9cixhLmN1cnJlbnRUYXJnZXQ9bnVsbCxcInRhcFwiPT09dCl7dmFyIGw9by5nZXRQb2ludGVySW5kZXgoZSk7YS5kdD1hLnRpbWVTdGFtcC1vLnBvaW50ZXJzW2xdLmRvd25UaW1lO3ZhciBjPWEudGltZVN0YW1wLW8udGFwVGltZTthLmRvdWJsZT0hIShvLnByZXZUYXAmJlwiZG91YmxldGFwXCIhPT1vLnByZXZUYXAudHlwZSYmby5wcmV2VGFwLnRhcmdldD09PWEudGFyZ2V0JiZjPDUwMCl9ZWxzZVwiZG91YmxldGFwXCI9PT10JiYoYS5kdD1lLnRpbWVTdGFtcC1vLnRhcFRpbWUpO3JldHVybiBhfXZhciB0LGUsbjtyZXR1cm4gZnVuY3Rpb24odCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJk5zKHQsZSl9KGYsQXNbXCJkZWZhdWx0XCJdKSx0PWYsKGU9W3trZXk6XCJfc3VidHJhY3RPcmlnaW5cIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10Lngsbj10Lnk7cmV0dXJuIHRoaXMucGFnZVgtPWUsdGhpcy5wYWdlWS09bix0aGlzLmNsaWVudFgtPWUsdGhpcy5jbGllbnRZLT1uLHRoaXN9fSx7a2V5OlwiX2FkZE9yaWdpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXQueCxuPXQueTtyZXR1cm4gdGhpcy5wYWdlWCs9ZSx0aGlzLnBhZ2VZKz1uLHRoaXMuY2xpZW50WCs9ZSx0aGlzLmNsaWVudFkrPW4sdGhpc319LHtrZXk6XCJwcmV2ZW50RGVmYXVsdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCl9fV0pJiZGcyh0LnByb3RvdHlwZSxlKSxuJiZGcyh0LG4pLGZ9KCk7SXMuUG9pbnRlckV2ZW50PUlzLmRlZmF1bHQ9QnM7dmFyIFZzPXt9O2Z1bmN0aW9uIHFzKHQpe3JldHVybihxcz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFZzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFZzLmRlZmF1bHQ9dm9pZCAwO0tzKEVuKSxLcyhtKHt9KSk7dmFyIFVzPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PXFzKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPUhzKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KGxlKSxHcz1LcyhJcyk7ZnVuY3Rpb24gSHMoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBIcz1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIEtzKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgJHM9e2lkOlwicG9pbnRlci1ldmVudHMvYmFzZVwiLGluc3RhbGw6ZnVuY3Rpb24odCl7dC5wb2ludGVyRXZlbnRzPSRzLHQuZGVmYXVsdHMuYWN0aW9ucy5wb2ludGVyRXZlbnRzPSRzLmRlZmF1bHRzLFVzLmV4dGVuZCh0LmFjdGlvbnMucGhhc2VsZXNzVHlwZXMsJHMudHlwZXMpfSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOm5ld1wiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb247ZS5wcmV2VGFwPW51bGwsZS50YXBUaW1lPTB9LFwiaW50ZXJhY3Rpb25zOnVwZGF0ZS1wb2ludGVyXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5kb3duLG49dC5wb2ludGVySW5mbztpZighZSYmbi5ob2xkKXJldHVybjtuLmhvbGQ9e2R1cmF0aW9uOjEvMCx0aW1lb3V0Om51bGx9fSxcImludGVyYWN0aW9uczptb3ZlXCI6ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uLHI9dC5wb2ludGVyLG89dC5ldmVudCxpPXQuZXZlbnRUYXJnZXQsYT10LmR1cGxpY2F0ZSx1PW4uZ2V0UG9pbnRlckluZGV4KHIpO2F8fG4ucG9pbnRlcklzRG93biYmIW4ucG9pbnRlcldhc01vdmVkfHwobi5wb2ludGVySXNEb3duJiZjbGVhclRpbWVvdXQobi5wb2ludGVyc1t1XS5ob2xkLnRpbWVvdXQpLFpzKHtpbnRlcmFjdGlvbjpuLHBvaW50ZXI6cixldmVudDpvLGV2ZW50VGFyZ2V0OmksdHlwZTpcIm1vdmVcIn0sZSkpfSxcImludGVyYWN0aW9uczpkb3duXCI6ZnVuY3Rpb24odCxlKXshZnVuY3Rpb24odCxlKXtmb3IodmFyIG49dC5pbnRlcmFjdGlvbixyPXQucG9pbnRlcixvPXQuZXZlbnQsaT10LmV2ZW50VGFyZ2V0LGE9dC5wb2ludGVySW5kZXgsdT1uLnBvaW50ZXJzW2FdLmhvbGQscz1Vcy5kb20uZ2V0UGF0aChpKSxsPXtpbnRlcmFjdGlvbjpuLHBvaW50ZXI6cixldmVudDpvLGV2ZW50VGFyZ2V0OmksdHlwZTpcImhvbGRcIix0YXJnZXRzOltdLHBhdGg6cyxub2RlOm51bGx9LGM9MDtjPHMubGVuZ3RoO2MrKyl7dmFyIGY9c1tjXTtsLm5vZGU9ZixlLmZpcmUoXCJwb2ludGVyRXZlbnRzOmNvbGxlY3QtdGFyZ2V0c1wiLGwpfWlmKCFsLnRhcmdldHMubGVuZ3RoKXJldHVybjtmb3IodmFyIHA9MS8wLGQ9MDtkPGwudGFyZ2V0cy5sZW5ndGg7ZCsrKXt2YXIgdj1sLnRhcmdldHNbZF0uZXZlbnRhYmxlLm9wdGlvbnMuaG9sZER1cmF0aW9uO3Y8cCYmKHA9dil9dS5kdXJhdGlvbj1wLHUudGltZW91dD1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7WnMoe2ludGVyYWN0aW9uOm4sZXZlbnRUYXJnZXQ6aSxwb2ludGVyOnIsZXZlbnQ6byx0eXBlOlwiaG9sZFwifSxlKX0scCl9KHQsZSksWnModCxlKX0sXCJpbnRlcmFjdGlvbnM6dXBcIjpmdW5jdGlvbih0LGUpe3ZhciBuLHIsbyxpLGEsdTtRcyh0KSxacyh0LGUpLHI9ZSxvPShuPXQpLmludGVyYWN0aW9uLGk9bi5wb2ludGVyLGE9bi5ldmVudCx1PW4uZXZlbnRUYXJnZXQsby5wb2ludGVyV2FzTW92ZWR8fFpzKHtpbnRlcmFjdGlvbjpvLGV2ZW50VGFyZ2V0OnUscG9pbnRlcjppLGV2ZW50OmEsdHlwZTpcInRhcFwifSxyKX0sXCJpbnRlcmFjdGlvbnM6Y2FuY2VsXCI6ZnVuY3Rpb24odCxlKXtRcyh0KSxacyh0LGUpfX0sUG9pbnRlckV2ZW50OkdzLmRlZmF1bHQsZmlyZTpacyxjb2xsZWN0RXZlbnRUYXJnZXRzOkpzLGRlZmF1bHRzOntob2xkRHVyYXRpb246NjAwLGlnbm9yZUZyb206bnVsbCxhbGxvd0Zyb206bnVsbCxvcmlnaW46e3g6MCx5OjB9fSx0eXBlczp7ZG93bjohMCxtb3ZlOiEwLHVwOiEwLGNhbmNlbDohMCx0YXA6ITAsZG91YmxldGFwOiEwLGhvbGQ6ITB9fTtmdW5jdGlvbiBacyh0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LnBvaW50ZXIsbz10LmV2ZW50LGk9dC5ldmVudFRhcmdldCxhPXQudHlwZSx1PXQudGFyZ2V0cyxzPXZvaWQgMD09PXU/SnModCxlKTp1LGw9bmV3IEdzLmRlZmF1bHQoYSxyLG8saSxuLGUubm93KCkpO2UuZmlyZShcInBvaW50ZXJFdmVudHM6bmV3XCIse3BvaW50ZXJFdmVudDpsfSk7Zm9yKHZhciBjPXtpbnRlcmFjdGlvbjpuLHBvaW50ZXI6cixldmVudDpvLGV2ZW50VGFyZ2V0OmksdGFyZ2V0czpzLHR5cGU6YSxwb2ludGVyRXZlbnQ6bH0sZj0wO2Y8cy5sZW5ndGg7ZisrKXt2YXIgcD1zW2ZdO2Zvcih2YXIgZCBpbiBwLnByb3BzfHx7fSlsW2RdPXAucHJvcHNbZF07dmFyIHY9VXMuZ2V0T3JpZ2luWFkocC5ldmVudGFibGUscC5ub2RlKTtpZihsLl9zdWJ0cmFjdE9yaWdpbih2KSxsLmV2ZW50YWJsZT1wLmV2ZW50YWJsZSxsLmN1cnJlbnRUYXJnZXQ9cC5ub2RlLHAuZXZlbnRhYmxlLmZpcmUobCksbC5fYWRkT3JpZ2luKHYpLGwuaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkfHxsLnByb3BhZ2F0aW9uU3RvcHBlZCYmZisxPHMubGVuZ3RoJiZzW2YrMV0ubm9kZSE9PWwuY3VycmVudFRhcmdldClicmVha31pZihlLmZpcmUoXCJwb2ludGVyRXZlbnRzOmZpcmVkXCIsYyksXCJ0YXBcIj09PWEpe3ZhciB5PWwuZG91YmxlP1pzKHtpbnRlcmFjdGlvbjpuLHBvaW50ZXI6cixldmVudDpvLGV2ZW50VGFyZ2V0OmksdHlwZTpcImRvdWJsZXRhcFwifSxlKTpsO24ucHJldlRhcD15LG4udGFwVGltZT15LnRpbWVTdGFtcH1yZXR1cm4gbH1mdW5jdGlvbiBKcyh0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LnBvaW50ZXIsbz10LmV2ZW50LGk9dC5ldmVudFRhcmdldCxhPXQudHlwZSx1PW4uZ2V0UG9pbnRlckluZGV4KHIpLHM9bi5wb2ludGVyc1t1XTtpZihcInRhcFwiPT09YSYmKG4ucG9pbnRlcldhc01vdmVkfHwhc3x8cy5kb3duVGFyZ2V0IT09aSkpcmV0dXJuW107Zm9yKHZhciBsPVVzLmRvbS5nZXRQYXRoKGkpLGM9e2ludGVyYWN0aW9uOm4scG9pbnRlcjpyLGV2ZW50Om8sZXZlbnRUYXJnZXQ6aSx0eXBlOmEscGF0aDpsLHRhcmdldHM6W10sbm9kZTpudWxsfSxmPTA7ZjxsLmxlbmd0aDtmKyspe3ZhciBwPWxbZl07Yy5ub2RlPXAsZS5maXJlKFwicG9pbnRlckV2ZW50czpjb2xsZWN0LXRhcmdldHNcIixjKX1yZXR1cm5cImhvbGRcIj09PWEmJihjLnRhcmdldHM9Yy50YXJnZXRzLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4gdC5ldmVudGFibGUub3B0aW9ucy5ob2xkRHVyYXRpb249PT1uLnBvaW50ZXJzW3VdLmhvbGQuZHVyYXRpb259KSksYy50YXJnZXRzfWZ1bmN0aW9uIFFzKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24sbj10LnBvaW50ZXJJbmRleDtlLnBvaW50ZXJzW25dLmhvbGQmJmNsZWFyVGltZW91dChlLnBvaW50ZXJzW25dLmhvbGQudGltZW91dCl9dmFyIHRsPSRzO1ZzLmRlZmF1bHQ9dGw7dmFyIGVsPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShlbCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlbC5kZWZhdWx0PXZvaWQgMDtybChJcyk7dmFyIG5sPXJsKFZzKTtmdW5jdGlvbiBybCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gb2wodCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtlLmhvbGRJbnRlcnZhbEhhbmRsZSYmKGNsZWFySW50ZXJ2YWwoZS5ob2xkSW50ZXJ2YWxIYW5kbGUpLGUuaG9sZEludGVydmFsSGFuZGxlPW51bGwpfXZhciBpbD17aWQ6XCJwb2ludGVyLWV2ZW50cy9ob2xkUmVwZWF0XCIsaW5zdGFsbDpmdW5jdGlvbih0KXt0LnVzZVBsdWdpbihubC5kZWZhdWx0KTt2YXIgZT10LnBvaW50ZXJFdmVudHM7ZS5kZWZhdWx0cy5ob2xkUmVwZWF0SW50ZXJ2YWw9MCxlLnR5cGVzLmhvbGRyZXBlYXQ9dC5hY3Rpb25zLnBoYXNlbGVzc1R5cGVzLmhvbGRyZXBlYXQ9ITB9LGxpc3RlbmVyczpbXCJtb3ZlXCIsXCJ1cFwiLFwiY2FuY2VsXCIsXCJlbmRhbGxcIl0ucmVkdWNlKGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbXCJwb2ludGVyRXZlbnRzOlwiLmNvbmNhdChlKV09b2wsdH0se1wicG9pbnRlckV2ZW50czpuZXdcIjpmdW5jdGlvbih0KXt2YXIgZT10LnBvaW50ZXJFdmVudDtcImhvbGRcIj09PWUudHlwZSYmKGUuY291bnQ9KGUuY291bnR8fDApKzEpfSxcInBvaW50ZXJFdmVudHM6ZmlyZWRcIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LnBvaW50ZXJFdmVudCxvPXQuZXZlbnRUYXJnZXQsaT10LnRhcmdldHM7aWYoXCJob2xkXCI9PT1yLnR5cGUmJmkubGVuZ3RoKXt2YXIgYT1pWzBdLmV2ZW50YWJsZS5vcHRpb25zLmhvbGRSZXBlYXRJbnRlcnZhbDthPD0wfHwobi5ob2xkSW50ZXJ2YWxIYW5kbGU9c2V0VGltZW91dChmdW5jdGlvbigpe2UucG9pbnRlckV2ZW50cy5maXJlKHtpbnRlcmFjdGlvbjpuLGV2ZW50VGFyZ2V0Om8sdHlwZTpcImhvbGRcIixwb2ludGVyOnIsZXZlbnQ6cn0sZSl9LGEpKX19fSl9O2VsLmRlZmF1bHQ9aWw7dmFyIGFsPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShhbCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxhbC5kZWZhdWx0PXZvaWQgMDt2YXIgdWwsc2w9KHVsPWN0KSYmdWwuX19lc01vZHVsZT91bDp7ZGVmYXVsdDp1bH07ZnVuY3Rpb24gbGwodCl7cmV0dXJuKDAsc2wuZGVmYXVsdCkodGhpcy5ldmVudHMub3B0aW9ucyx0KSx0aGlzfXZhciBjbD17aWQ6XCJwb2ludGVyLWV2ZW50cy9pbnRlcmFjdGFibGVUYXJnZXRzXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt2YXIgZT10LkludGVyYWN0YWJsZTtlLnByb3RvdHlwZS5wb2ludGVyRXZlbnRzPWxsO3ZhciByPWUucHJvdG90eXBlLl9iYWNrQ29tcGF0T3B0aW9uO2UucHJvdG90eXBlLl9iYWNrQ29tcGF0T3B0aW9uPWZ1bmN0aW9uKHQsZSl7dmFyIG49ci5jYWxsKHRoaXMsdCxlKTtyZXR1cm4gbj09PXRoaXMmJih0aGlzLmV2ZW50cy5vcHRpb25zW3RdPWUpLG59fSxsaXN0ZW5lcnM6e1wicG9pbnRlckV2ZW50czpjb2xsZWN0LXRhcmdldHNcIjpmdW5jdGlvbih0LGUpe3ZhciByPXQudGFyZ2V0cyxvPXQubm9kZSxpPXQudHlwZSxhPXQuZXZlbnRUYXJnZXQ7ZS5pbnRlcmFjdGFibGVzLmZvckVhY2hNYXRjaChvLGZ1bmN0aW9uKHQpe3ZhciBlPXQuZXZlbnRzLG49ZS5vcHRpb25zO2UudHlwZXNbaV0mJmUudHlwZXNbaV0ubGVuZ3RoJiZ0LnRlc3RJZ25vcmVBbGxvdyhuLG8sYSkmJnIucHVzaCh7bm9kZTpvLGV2ZW50YWJsZTplLHByb3BzOntpbnRlcmFjdGFibGU6dH19KX0pfSxcImludGVyYWN0YWJsZTpuZXdcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0YWJsZTtlLmV2ZW50cy5nZXRSZWN0PWZ1bmN0aW9uKHQpe3JldHVybiBlLmdldFJlY3QodCl9fSxcImludGVyYWN0YWJsZTpzZXRcIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3RhYmxlLHI9dC5vcHRpb25zOygwLHNsLmRlZmF1bHQpKG4uZXZlbnRzLm9wdGlvbnMsZS5wb2ludGVyRXZlbnRzLmRlZmF1bHRzKSwoMCxzbC5kZWZhdWx0KShuLmV2ZW50cy5vcHRpb25zLHIucG9pbnRlckV2ZW50c3x8e30pfX19O2FsLmRlZmF1bHQ9Y2w7dmFyIGZsPXt9O2Z1bmN0aW9uIHBsKHQpe3JldHVybihwbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGZsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbCxcImhvbGRSZXBlYXRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdmwuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoZmwsXCJpbnRlcmFjdGFibGVUYXJnZXRzXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHlsLmRlZmF1bHR9fSksZmwucG9pbnRlckV2ZW50cz1mbC5kZWZhdWx0PXZvaWQgMDt2YXIgZGw9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09cGwodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9Z2woKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oVnMpO2ZsLnBvaW50ZXJFdmVudHM9ZGw7dmFyIHZsPWhsKGVsKSx5bD1obChhbCk7ZnVuY3Rpb24gaGwodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIGdsKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gZ2w9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH12YXIgYmw9e2lkOlwicG9pbnRlci1ldmVudHNcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3QudXNlUGx1Z2luKGRsKSx0LnVzZVBsdWdpbih2bC5kZWZhdWx0KSx0LnVzZVBsdWdpbih5bC5kZWZhdWx0KX19O2ZsLmRlZmF1bHQ9Ymw7dmFyIG1sPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShtbCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxtbC5pbnN0YWxsPXdsLG1sLmRlZmF1bHQ9dm9pZCAwO3ZhciBPbDsoT2w9ayh7fSkpJiZPbC5fX2VzTW9kdWxlO2Z1bmN0aW9uIHdsKGUpe3ZhciB0PWUuSW50ZXJhY3RhYmxlO2UuYWN0aW9ucy5waGFzZXMucmVmbG93PSEwLHQucHJvdG90eXBlLnJlZmxvdz1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24odSxzLGwpe2Z1bmN0aW9uIHQoKXt2YXIgZT1jW2RdLHQ9dS5nZXRSZWN0KGUpO2lmKCF0KXJldHVyblwiYnJlYWtcIjt2YXIgbj1sZS5hcnIuZmluZChsLmludGVyYWN0aW9ucy5saXN0LGZ1bmN0aW9uKHQpe3JldHVybiB0LmludGVyYWN0aW5nKCkmJnQuaW50ZXJhY3RhYmxlPT09dSYmdC5lbGVtZW50PT09ZSYmdC5wcmVwYXJlZC5uYW1lPT09cy5uYW1lfSkscj12b2lkIDA7aWYobiluLm1vdmUoKSxwJiYocj1uLl9yZWZsb3dQcm9taXNlfHxuZXcgZihmdW5jdGlvbih0KXtuLl9yZWZsb3dSZXNvbHZlPXR9KSk7ZWxzZXt2YXIgbz1sZS5yZWN0LnRsYnJUb1h5d2godCksaT17cGFnZTp7eDpvLngseTpvLnl9LGNsaWVudDp7eDpvLngseTpvLnl9LHRpbWVTdGFtcDpsLm5vdygpfSxhPWxlLnBvaW50ZXIuY29vcmRzVG9FdmVudChpKTtyPWZ1bmN0aW9uKHQsZSxuLHIsbyl7dmFyIGk9dC5pbnRlcmFjdGlvbnMubmV3KHtwb2ludGVyVHlwZTpcInJlZmxvd1wifSksYT17aW50ZXJhY3Rpb246aSxldmVudDpvLHBvaW50ZXI6byxldmVudFRhcmdldDpuLHBoYXNlOlwicmVmbG93XCJ9O2kuaW50ZXJhY3RhYmxlPWUsaS5lbGVtZW50PW4saS5wcmVwYXJlZD0oMCxsZS5leHRlbmQpKHt9LHIpLGkucHJldkV2ZW50PW8saS51cGRhdGVQb2ludGVyKG8sbyxuLCEwKSxpLl9kb1BoYXNlKGEpO3ZhciB1PWxlLndpbi53aW5kb3cuUHJvbWlzZT9uZXcgbGUud2luLndpbmRvdy5Qcm9taXNlKGZ1bmN0aW9uKHQpe2kuX3JlZmxvd1Jlc29sdmU9dH0pOm51bGw7aS5fcmVmbG93UHJvbWlzZT11LGkuc3RhcnQocixlLG4pLGkuX2ludGVyYWN0aW5nPyhpLm1vdmUoYSksaS5lbmQobykpOmkuc3RvcCgpO3JldHVybiBpLnJlbW92ZVBvaW50ZXIobyxvKSxpLnBvaW50ZXJJc0Rvd249ITEsdX0obCx1LGUscyxhKX1wJiZwLnB1c2gocil9Zm9yKHZhciBjPWxlLmlzLnN0cmluZyh1LnRhcmdldCk/bGUuYXJyLmZyb20odS5fY29udGV4dC5xdWVyeVNlbGVjdG9yQWxsKHUudGFyZ2V0KSk6W3UudGFyZ2V0XSxmPWxlLndpbi53aW5kb3cuUHJvbWlzZSxwPWY/W106bnVsbCxkPTA7ZDxjLmxlbmd0aDtkKyspe2lmKFwiYnJlYWtcIj09PXQoKSlicmVha31yZXR1cm4gcCYmZi5hbGwocCkudGhlbihmdW5jdGlvbigpe3JldHVybiB1fSl9KHRoaXMsdCxlKX19dmFyIF9sPXtpZDpcInJlZmxvd1wiLGluc3RhbGw6d2wsbGlzdGVuZXJzOntcImludGVyYWN0aW9uczpzdG9wXCI6ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uO1wicmVmbG93XCI9PT1uLnBvaW50ZXJUeXBlJiYobi5fcmVmbG93UmVzb2x2ZSYmbi5fcmVmbG93UmVzb2x2ZSgpLGxlLmFyci5yZW1vdmUoZS5pbnRlcmFjdGlvbnMubGlzdCxuKSl9fX07bWwuZGVmYXVsdD1fbDt2YXIgUGw9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFBsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFBsLmRlZmF1bHQ9dm9pZCAwO1BsLmRlZmF1bHQ9e307dmFyIHhsPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh4bCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx4bC5leGNoYW5nZT12b2lkIDA7eGwuZXhjaGFuZ2U9e307dmFyIFNsPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShTbCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxTbC5kZWZhdWx0PXZvaWQgMDtTbC5kZWZhdWx0PXt9O3ZhciBqbD17fTtmdW5jdGlvbiBNbCh0KXtyZXR1cm4oTWw9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShqbCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxqbC5kZWZhdWx0PXZvaWQgMDt2YXIga2w9SGwoUXIpLEVsPUhsKGFvKSxUbD1IbCh1byksRGw9SGwodGkpLElsPUhsKGFpKSx6bD1IbCh1aSksQWw9SGwoVW4pLENsPShIbChzaSksR2wod2kpKSxXbD1IbCgkaSksUmw9SGwoaGEpLEZsPUhsKFNzKSxYbD1IbChEcyksWWw9SGwoWWkpLE5sPUhsKGZsKSxMbD1IbChtbCksQmw9R2woUGwpLFZsPUdsKHp0KSxxbD1HbChTbCk7ZnVuY3Rpb24gVWwoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBVbD1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIEdsKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PU1sKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPVVsKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfXJldHVybiBuLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pLG59ZnVuY3Rpb24gSGwodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fVJsLmRlZmF1bHQudXNlKFhsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKEFsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKFlsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKElsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKEVsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKE5sLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKFdsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKEZsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKERsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKGtsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKFRsLmRlZmF1bHQpLFJsLmRlZmF1bHQudXNlKExsLmRlZmF1bHQpLFJsLmRlZmF1bHQuZmVlZGJhY2s9Q2wsUmwuZGVmYXVsdC51c2UoemwuZGVmYXVsdCksUmwuZGVmYXVsdC52dWU9e2NvbXBvbmVudHM6cWx9LFJsLmRlZmF1bHQuX191dGlscz17ZXhjaGFuZ2U6eGwuZXhjaGFuZ2UsZGlzcGxhY2U6QmwscG9pbnRlcjpWbH07dmFyIEtsPVJsLmRlZmF1bHQ7amwuZGVmYXVsdD1LbDt2YXIgJGw9e2V4cG9ydHM6e319O09iamVjdC5kZWZpbmVQcm9wZXJ0eSgkbC5leHBvcnRzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLCRsLmV4cG9ydHMuZGVmYXVsdD12b2lkIDA7dmFyIFpsLEpsPShabD1qbCkmJlpsLl9fZXNNb2R1bGU/Wmw6e2RlZmF1bHQ6Wmx9O2Z1bmN0aW9uIFFsKHQpe3JldHVybihRbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9aWYoXCJvYmplY3RcIj09PVFsKCRsKSYmJGwpdHJ5eyRsLmV4cG9ydHM9SmwuZGVmYXVsdH1jYXRjaCh0KXt9SmwuZGVmYXVsdC5kZWZhdWx0PUpsLmRlZmF1bHQ7dmFyIHRjPUpsLmRlZmF1bHQ7cmV0dXJuICRsLmV4cG9ydHMuZGVmYXVsdD10YywkbD0kbC5leHBvcnRzfSk7XG5cbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWludGVyYWN0Lm1pbi5qcy5tYXBcbiIsIi8qXG4qIGxvZ2xldmVsIC0gaHR0cHM6Ly9naXRodWIuY29tL3BpbXRlcnJ5L2xvZ2xldmVsXG4qXG4qIENvcHlyaWdodCAoYykgMjAxMyBUaW0gUGVycnlcbiogTGljZW5zZWQgdW5kZXIgdGhlIE1JVCBsaWNlbnNlLlxuKi9cbihmdW5jdGlvbiAocm9vdCwgZGVmaW5pdGlvbikge1xuICAgIFwidXNlIHN0cmljdFwiO1xuICAgIGlmICh0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQpIHtcbiAgICAgICAgZGVmaW5lKGRlZmluaXRpb24pO1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIG1vZHVsZSA9PT0gJ29iamVjdCcgJiYgbW9kdWxlLmV4cG9ydHMpIHtcbiAgICAgICAgbW9kdWxlLmV4cG9ydHMgPSBkZWZpbml0aW9uKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgcm9vdC5sb2cgPSBkZWZpbml0aW9uKCk7XG4gICAgfVxufSh0aGlzLCBmdW5jdGlvbiAoKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG5cbiAgICAvLyBTbGlnaHRseSBkdWJpb3VzIHRyaWNrcyB0byBjdXQgZG93biBtaW5pbWl6ZWQgZmlsZSBzaXplXG4gICAgdmFyIG5vb3AgPSBmdW5jdGlvbigpIHt9O1xuICAgIHZhciB1bmRlZmluZWRUeXBlID0gXCJ1bmRlZmluZWRcIjtcbiAgICB2YXIgaXNJRSA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSAmJiAodHlwZW9mIHdpbmRvdy5uYXZpZ2F0b3IgIT09IHVuZGVmaW5lZFR5cGUpICYmIChcbiAgICAgICAgL1RyaWRlbnRcXC98TVNJRSAvLnRlc3Qod2luZG93Lm5hdmlnYXRvci51c2VyQWdlbnQpXG4gICAgKTtcblxuICAgIHZhciBsb2dNZXRob2RzID0gW1xuICAgICAgICBcInRyYWNlXCIsXG4gICAgICAgIFwiZGVidWdcIixcbiAgICAgICAgXCJpbmZvXCIsXG4gICAgICAgIFwid2FyblwiLFxuICAgICAgICBcImVycm9yXCJcbiAgICBdO1xuXG4gICAgLy8gQ3Jvc3MtYnJvd3NlciBiaW5kIGVxdWl2YWxlbnQgdGhhdCB3b3JrcyBhdCBsZWFzdCBiYWNrIHRvIElFNlxuICAgIGZ1bmN0aW9uIGJpbmRNZXRob2Qob2JqLCBtZXRob2ROYW1lKSB7XG4gICAgICAgIHZhciBtZXRob2QgPSBvYmpbbWV0aG9kTmFtZV07XG4gICAgICAgIGlmICh0eXBlb2YgbWV0aG9kLmJpbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHJldHVybiBtZXRob2QuYmluZChvYmopO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmJpbmQuY2FsbChtZXRob2QsIG9iaik7XG4gICAgICAgICAgICB9IGNhdGNoIChlKSB7XG4gICAgICAgICAgICAgICAgLy8gTWlzc2luZyBiaW5kIHNoaW0gb3IgSUU4ICsgTW9kZXJuaXpyLCBmYWxsYmFjayB0byB3cmFwcGluZ1xuICAgICAgICAgICAgICAgIHJldHVybiBmdW5jdGlvbigpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEZ1bmN0aW9uLnByb3RvdHlwZS5hcHBseS5hcHBseShtZXRob2QsIFtvYmosIGFyZ3VtZW50c10pO1xuICAgICAgICAgICAgICAgIH07XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUcmFjZSgpIGRvZXNuJ3QgcHJpbnQgdGhlIG1lc3NhZ2UgaW4gSUUsIHNvIGZvciB0aGF0IGNhc2Ugd2UgbmVlZCB0byB3cmFwIGl0XG4gICAgZnVuY3Rpb24gdHJhY2VGb3JJRSgpIHtcbiAgICAgICAgaWYgKGNvbnNvbGUubG9nKSB7XG4gICAgICAgICAgICBpZiAoY29uc29sZS5sb2cuYXBwbHkpIHtcbiAgICAgICAgICAgICAgICBjb25zb2xlLmxvZy5hcHBseShjb25zb2xlLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAvLyBJbiBvbGQgSUUsIG5hdGl2ZSBjb25zb2xlIG1ldGhvZHMgdGhlbXNlbHZlcyBkb24ndCBoYXZlIGFwcGx5KCkuXG4gICAgICAgICAgICAgICAgRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KGNvbnNvbGUubG9nLCBbY29uc29sZSwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGNvbnNvbGUudHJhY2UpIGNvbnNvbGUudHJhY2UoKTtcbiAgICB9XG5cbiAgICAvLyBCdWlsZCB0aGUgYmVzdCBsb2dnaW5nIG1ldGhvZCBwb3NzaWJsZSBmb3IgdGhpcyBlbnZcbiAgICAvLyBXaGVyZXZlciBwb3NzaWJsZSB3ZSB3YW50IHRvIGJpbmQsIG5vdCB3cmFwLCB0byBwcmVzZXJ2ZSBzdGFjayB0cmFjZXNcbiAgICBmdW5jdGlvbiByZWFsTWV0aG9kKG1ldGhvZE5hbWUpIHtcbiAgICAgICAgaWYgKG1ldGhvZE5hbWUgPT09ICdkZWJ1ZycpIHtcbiAgICAgICAgICAgIG1ldGhvZE5hbWUgPSAnbG9nJztcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0eXBlb2YgY29uc29sZSA9PT0gdW5kZWZpbmVkVHlwZSkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlOyAvLyBObyBtZXRob2QgcG9zc2libGUsIGZvciBub3cgLSBmaXhlZCBsYXRlciBieSBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzXG4gICAgICAgIH0gZWxzZSBpZiAobWV0aG9kTmFtZSA9PT0gJ3RyYWNlJyAmJiBpc0lFKSB7XG4gICAgICAgICAgICByZXR1cm4gdHJhY2VGb3JJRTtcbiAgICAgICAgfSBlbHNlIGlmIChjb25zb2xlW21ldGhvZE5hbWVdICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsIG1ldGhvZE5hbWUpO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGUubG9nICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgIHJldHVybiBiaW5kTWV0aG9kKGNvbnNvbGUsICdsb2cnKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBub29wO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gVGhlc2UgcHJpdmF0ZSBmdW5jdGlvbnMgYWx3YXlzIG5lZWQgYHRoaXNgIHRvIGJlIHNldCBwcm9wZXJseVxuXG4gICAgZnVuY3Rpb24gcmVwbGFjZUxvZ2dpbmdNZXRob2RzKGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIC8qanNoaW50IHZhbGlkdGhpczp0cnVlICovXG4gICAgICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbG9nTWV0aG9kcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgdmFyIG1ldGhvZE5hbWUgPSBsb2dNZXRob2RzW2ldO1xuICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXSA9IChpIDwgbGV2ZWwpID9cbiAgICAgICAgICAgICAgICBub29wIDpcbiAgICAgICAgICAgICAgICB0aGlzLm1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gRGVmaW5lIGxvZy5sb2cgYXMgYW4gYWxpYXMgZm9yIGxvZy5kZWJ1Z1xuICAgICAgICB0aGlzLmxvZyA9IHRoaXMuZGVidWc7XG4gICAgfVxuXG4gICAgLy8gSW4gb2xkIElFIHZlcnNpb25zLCB0aGUgY29uc29sZSBpc24ndCBwcmVzZW50IHVudGlsIHlvdSBmaXJzdCBvcGVuIGl0LlxuICAgIC8vIFdlIGJ1aWxkIHJlYWxNZXRob2QoKSByZXBsYWNlbWVudHMgaGVyZSB0aGF0IHJlZ2VuZXJhdGUgbG9nZ2luZyBtZXRob2RzXG4gICAgZnVuY3Rpb24gZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcyhtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwodGhpcywgbGV2ZWwsIGxvZ2dlck5hbWUpO1xuICAgICAgICAgICAgICAgIHRoaXNbbWV0aG9kTmFtZV0uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfTtcbiAgICB9XG5cbiAgICAvLyBCeSBkZWZhdWx0LCB3ZSB1c2UgY2xvc2VseSBib3VuZCByZWFsIG1ldGhvZHMgd2hlcmV2ZXIgcG9zc2libGUsIGFuZFxuICAgIC8vIG90aGVyd2lzZSB3ZSB3YWl0IGZvciBhIGNvbnNvbGUgdG8gYXBwZWFyLCBhbmQgdGhlbiB0cnkgYWdhaW4uXG4gICAgZnVuY3Rpb24gZGVmYXVsdE1ldGhvZEZhY3RvcnkobWV0aG9kTmFtZSwgbGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgcmV0dXJuIHJlYWxNZXRob2QobWV0aG9kTmFtZSkgfHxcbiAgICAgICAgICAgICAgIGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXMuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG5cbiAgICBmdW5jdGlvbiBMb2dnZXIobmFtZSwgZGVmYXVsdExldmVsLCBmYWN0b3J5KSB7XG4gICAgICB2YXIgc2VsZiA9IHRoaXM7XG4gICAgICB2YXIgY3VycmVudExldmVsO1xuICAgICAgdmFyIHN0b3JhZ2VLZXkgPSBcImxvZ2xldmVsXCI7XG4gICAgICBpZiAobmFtZSkge1xuICAgICAgICBzdG9yYWdlS2V5ICs9IFwiOlwiICsgbmFtZTtcbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbE51bSkge1xuICAgICAgICAgIHZhciBsZXZlbE5hbWUgPSAobG9nTWV0aG9kc1tsZXZlbE51bV0gfHwgJ3NpbGVudCcpLnRvVXBwZXJDYXNlKCk7XG5cbiAgICAgICAgICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gdW5kZWZpbmVkVHlwZSkgcmV0dXJuO1xuXG4gICAgICAgICAgLy8gVXNlIGxvY2FsU3RvcmFnZSBpZiBhdmFpbGFibGVcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cubG9jYWxTdG9yYWdlW3N0b3JhZ2VLZXldID0gbGV2ZWxOYW1lO1xuICAgICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgLy8gVXNlIHNlc3Npb24gY29va2llIGFzIGZhbGxiYWNrXG4gICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgd2luZG93LmRvY3VtZW50LmNvb2tpZSA9XG4gICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIgKyBsZXZlbE5hbWUgKyBcIjtcIjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICB9XG5cbiAgICAgIGZ1bmN0aW9uIGdldFBlcnNpc3RlZExldmVsKCkge1xuICAgICAgICAgIHZhciBzdG9yZWRMZXZlbDtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSB1bmRlZmluZWRUeXBlKSByZXR1cm47XG5cbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV07XG4gICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuXG4gICAgICAgICAgLy8gRmFsbGJhY2sgdG8gY29va2llcyBpZiBsb2NhbCBzdG9yYWdlIGdpdmVzIHVzIG5vdGhpbmdcbiAgICAgICAgICBpZiAodHlwZW9mIHN0b3JlZExldmVsID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgICAgICB2YXIgY29va2llID0gd2luZG93LmRvY3VtZW50LmNvb2tpZTtcbiAgICAgICAgICAgICAgICAgIHZhciBsb2NhdGlvbiA9IGNvb2tpZS5pbmRleE9mKFxuICAgICAgICAgICAgICAgICAgICAgIGVuY29kZVVSSUNvbXBvbmVudChzdG9yYWdlS2V5KSArIFwiPVwiKTtcbiAgICAgICAgICAgICAgICAgIGlmIChsb2NhdGlvbiAhPT0gLTEpIHtcbiAgICAgICAgICAgICAgICAgICAgICBzdG9yZWRMZXZlbCA9IC9eKFteO10rKS8uZXhlYyhjb29raWUuc2xpY2UobG9jYXRpb24pKVsxXTtcbiAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgfSBjYXRjaCAoaWdub3JlKSB7fVxuICAgICAgICAgIH1cblxuICAgICAgICAgIC8vIElmIHRoZSBzdG9yZWQgbGV2ZWwgaXMgbm90IHZhbGlkLCB0cmVhdCBpdCBhcyBpZiBub3RoaW5nIHdhcyBzdG9yZWQuXG4gICAgICAgICAgaWYgKHNlbGYubGV2ZWxzW3N0b3JlZExldmVsXSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gdW5kZWZpbmVkO1xuICAgICAgICAgIH1cblxuICAgICAgICAgIHJldHVybiBzdG9yZWRMZXZlbDtcbiAgICAgIH1cblxuICAgICAgLypcbiAgICAgICAqXG4gICAgICAgKiBQdWJsaWMgbG9nZ2VyIEFQSSAtIHNlZSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWwgZm9yIGRldGFpbHNcbiAgICAgICAqXG4gICAgICAgKi9cblxuICAgICAgc2VsZi5uYW1lID0gbmFtZTtcblxuICAgICAgc2VsZi5sZXZlbHMgPSB7IFwiVFJBQ0VcIjogMCwgXCJERUJVR1wiOiAxLCBcIklORk9cIjogMiwgXCJXQVJOXCI6IDMsXG4gICAgICAgICAgXCJFUlJPUlwiOiA0LCBcIlNJTEVOVFwiOiA1fTtcblxuICAgICAgc2VsZi5tZXRob2RGYWN0b3J5ID0gZmFjdG9yeSB8fCBkZWZhdWx0TWV0aG9kRmFjdG9yeTtcblxuICAgICAgc2VsZi5nZXRMZXZlbCA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICByZXR1cm4gY3VycmVudExldmVsO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXRMZXZlbCA9IGZ1bmN0aW9uIChsZXZlbCwgcGVyc2lzdCkge1xuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwic3RyaW5nXCIgJiYgc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgICBsZXZlbCA9IHNlbGYubGV2ZWxzW2xldmVsLnRvVXBwZXJDYXNlKCldO1xuICAgICAgICAgIH1cbiAgICAgICAgICBpZiAodHlwZW9mIGxldmVsID09PSBcIm51bWJlclwiICYmIGxldmVsID49IDAgJiYgbGV2ZWwgPD0gc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgIGN1cnJlbnRMZXZlbCA9IGxldmVsO1xuICAgICAgICAgICAgICBpZiAocGVyc2lzdCAhPT0gZmFsc2UpIHsgIC8vIGRlZmF1bHRzIHRvIHRydWVcbiAgICAgICAgICAgICAgICAgIHBlcnNpc3RMZXZlbElmUG9zc2libGUobGV2ZWwpO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgIHJlcGxhY2VMb2dnaW5nTWV0aG9kcy5jYWxsKHNlbGYsIGxldmVsLCBuYW1lKTtcbiAgICAgICAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlICYmIGxldmVsIDwgc2VsZi5sZXZlbHMuU0lMRU5UKSB7XG4gICAgICAgICAgICAgICAgICByZXR1cm4gXCJObyBjb25zb2xlIGF2YWlsYWJsZSBmb3IgbG9nZ2luZ1wiO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgdGhyb3cgXCJsb2cuc2V0TGV2ZWwoKSBjYWxsZWQgd2l0aCBpbnZhbGlkIGxldmVsOiBcIiArIGxldmVsO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuc2V0RGVmYXVsdExldmVsID0gZnVuY3Rpb24gKGxldmVsKSB7XG4gICAgICAgICAgaWYgKCFnZXRQZXJzaXN0ZWRMZXZlbCgpKSB7XG4gICAgICAgICAgICAgIHNlbGYuc2V0TGV2ZWwobGV2ZWwsIGZhbHNlKTtcbiAgICAgICAgICB9XG4gICAgICB9O1xuXG4gICAgICBzZWxmLmVuYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlRSQUNFLCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZGlzYWJsZUFsbCA9IGZ1bmN0aW9uKHBlcnNpc3QpIHtcbiAgICAgICAgICBzZWxmLnNldExldmVsKHNlbGYubGV2ZWxzLlNJTEVOVCwgcGVyc2lzdCk7XG4gICAgICB9O1xuXG4gICAgICAvLyBJbml0aWFsaXplIHdpdGggdGhlIHJpZ2h0IGxldmVsXG4gICAgICB2YXIgaW5pdGlhbExldmVsID0gZ2V0UGVyc2lzdGVkTGV2ZWwoKTtcbiAgICAgIGlmIChpbml0aWFsTGV2ZWwgPT0gbnVsbCkge1xuICAgICAgICAgIGluaXRpYWxMZXZlbCA9IGRlZmF1bHRMZXZlbCA9PSBudWxsID8gXCJXQVJOXCIgOiBkZWZhdWx0TGV2ZWw7XG4gICAgICB9XG4gICAgICBzZWxmLnNldExldmVsKGluaXRpYWxMZXZlbCwgZmFsc2UpO1xuICAgIH1cblxuICAgIC8qXG4gICAgICpcbiAgICAgKiBUb3AtbGV2ZWwgQVBJXG4gICAgICpcbiAgICAgKi9cblxuICAgIHZhciBkZWZhdWx0TG9nZ2VyID0gbmV3IExvZ2dlcigpO1xuXG4gICAgdmFyIF9sb2dnZXJzQnlOYW1lID0ge307XG4gICAgZGVmYXVsdExvZ2dlci5nZXRMb2dnZXIgPSBmdW5jdGlvbiBnZXRMb2dnZXIobmFtZSkge1xuICAgICAgICBpZiAodHlwZW9mIG5hbWUgIT09IFwic3RyaW5nXCIgfHwgbmFtZSA9PT0gXCJcIikge1xuICAgICAgICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJZb3UgbXVzdCBzdXBwbHkgYSBuYW1lIHdoZW4gY3JlYXRpbmcgYSBsb2dnZXIuXCIpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdO1xuICAgICAgICBpZiAoIWxvZ2dlcikge1xuICAgICAgICAgIGxvZ2dlciA9IF9sb2dnZXJzQnlOYW1lW25hbWVdID0gbmV3IExvZ2dlcihcbiAgICAgICAgICAgIG5hbWUsIGRlZmF1bHRMb2dnZXIuZ2V0TGV2ZWwoKSwgZGVmYXVsdExvZ2dlci5tZXRob2RGYWN0b3J5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbG9nZ2VyO1xuICAgIH07XG5cbiAgICAvLyBHcmFiIHRoZSBjdXJyZW50IGdsb2JhbCBsb2cgdmFyaWFibGUgaW4gY2FzZSBvZiBvdmVyd3JpdGVcbiAgICB2YXIgX2xvZyA9ICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlKSA/IHdpbmRvdy5sb2cgOiB1bmRlZmluZWQ7XG4gICAgZGVmYXVsdExvZ2dlci5ub0NvbmZsaWN0ID0gZnVuY3Rpb24oKSB7XG4gICAgICAgIGlmICh0eXBlb2Ygd2luZG93ICE9PSB1bmRlZmluZWRUeXBlICYmXG4gICAgICAgICAgICAgICB3aW5kb3cubG9nID09PSBkZWZhdWx0TG9nZ2VyKSB7XG4gICAgICAgICAgICB3aW5kb3cubG9nID0gX2xvZztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xuICAgIH07XG5cbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlcnMgPSBmdW5jdGlvbiBnZXRMb2dnZXJzKCkge1xuICAgICAgICByZXR1cm4gX2xvZ2dlcnNCeU5hbWU7XG4gICAgfTtcblxuICAgIHJldHVybiBkZWZhdWx0TG9nZ2VyO1xufSkpO1xuIiwiLypcbiAoYykgMjAxNywgVmxhZGltaXIgQWdhZm9ua2luXG4gU2ltcGxpZnkuanMsIGEgaGlnaC1wZXJmb3JtYW5jZSBKUyBwb2x5bGluZSBzaW1wbGlmaWNhdGlvbiBsaWJyYXJ5XG4gbW91cm5lci5naXRodWIuaW8vc2ltcGxpZnktanNcbiovXG5cbihmdW5jdGlvbiAoKSB7ICd1c2Ugc3RyaWN0JztcblxuLy8gdG8gc3VpdCB5b3VyIHBvaW50IGZvcm1hdCwgcnVuIHNlYXJjaC9yZXBsYWNlIGZvciAnLngnIGFuZCAnLnknO1xuLy8gZm9yIDNEIHZlcnNpb24sIHNlZSAzZCBicmFuY2ggKGNvbmZpZ3VyYWJpbGl0eSB3b3VsZCBkcmF3IHNpZ25pZmljYW50IHBlcmZvcm1hbmNlIG92ZXJoZWFkKVxuXG4vLyBzcXVhcmUgZGlzdGFuY2UgYmV0d2VlbiAyIHBvaW50c1xuZnVuY3Rpb24gZ2V0U3FEaXN0KHAxLCBwMikge1xuXG4gICAgdmFyIGR4ID0gcDEueCAtIHAyLngsXG4gICAgICAgIGR5ID0gcDEueSAtIHAyLnk7XG5cbiAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG59XG5cbi8vIHNxdWFyZSBkaXN0YW5jZSBmcm9tIGEgcG9pbnQgdG8gYSBzZWdtZW50XG5mdW5jdGlvbiBnZXRTcVNlZ0Rpc3QocCwgcDEsIHAyKSB7XG5cbiAgICB2YXIgeCA9IHAxLngsXG4gICAgICAgIHkgPSBwMS55LFxuICAgICAgICBkeCA9IHAyLnggLSB4LFxuICAgICAgICBkeSA9IHAyLnkgLSB5O1xuXG4gICAgaWYgKGR4ICE9PSAwIHx8IGR5ICE9PSAwKSB7XG5cbiAgICAgICAgdmFyIHQgPSAoKHAueCAtIHgpICogZHggKyAocC55IC0geSkgKiBkeSkgLyAoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gICAgICAgIGlmICh0ID4gMSkge1xuICAgICAgICAgICAgeCA9IHAyLng7XG4gICAgICAgICAgICB5ID0gcDIueTtcblxuICAgICAgICB9IGVsc2UgaWYgKHQgPiAwKSB7XG4gICAgICAgICAgICB4ICs9IGR4ICogdDtcbiAgICAgICAgICAgIHkgKz0gZHkgKiB0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHggPSBwLnggLSB4O1xuICAgIGR5ID0gcC55IC0geTtcblxuICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcbn1cbi8vIHJlc3Qgb2YgdGhlIGNvZGUgZG9lc24ndCBjYXJlIGFib3V0IHBvaW50IGZvcm1hdFxuXG4vLyBiYXNpYyBkaXN0YW5jZS1iYXNlZCBzaW1wbGlmaWNhdGlvblxuZnVuY3Rpb24gc2ltcGxpZnlSYWRpYWxEaXN0KHBvaW50cywgc3FUb2xlcmFuY2UpIHtcblxuICAgIHZhciBwcmV2UG9pbnQgPSBwb2ludHNbMF0sXG4gICAgICAgIG5ld1BvaW50cyA9IFtwcmV2UG9pbnRdLFxuICAgICAgICBwb2ludDtcblxuICAgIGZvciAodmFyIGkgPSAxLCBsZW4gPSBwb2ludHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgcG9pbnQgPSBwb2ludHNbaV07XG5cbiAgICAgICAgaWYgKGdldFNxRGlzdChwb2ludCwgcHJldlBvaW50KSA+IHNxVG9sZXJhbmNlKSB7XG4gICAgICAgICAgICBuZXdQb2ludHMucHVzaChwb2ludCk7XG4gICAgICAgICAgICBwcmV2UG9pbnQgPSBwb2ludDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChwcmV2UG9pbnQgIT09IHBvaW50KSBuZXdQb2ludHMucHVzaChwb2ludCk7XG5cbiAgICByZXR1cm4gbmV3UG9pbnRzO1xufVxuXG5mdW5jdGlvbiBzaW1wbGlmeURQU3RlcChwb2ludHMsIGZpcnN0LCBsYXN0LCBzcVRvbGVyYW5jZSwgc2ltcGxpZmllZCkge1xuICAgIHZhciBtYXhTcURpc3QgPSBzcVRvbGVyYW5jZSxcbiAgICAgICAgaW5kZXg7XG5cbiAgICBmb3IgKHZhciBpID0gZmlyc3QgKyAxOyBpIDwgbGFzdDsgaSsrKSB7XG4gICAgICAgIHZhciBzcURpc3QgPSBnZXRTcVNlZ0Rpc3QocG9pbnRzW2ldLCBwb2ludHNbZmlyc3RdLCBwb2ludHNbbGFzdF0pO1xuXG4gICAgICAgIGlmIChzcURpc3QgPiBtYXhTcURpc3QpIHtcbiAgICAgICAgICAgIGluZGV4ID0gaTtcbiAgICAgICAgICAgIG1heFNxRGlzdCA9IHNxRGlzdDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmIChtYXhTcURpc3QgPiBzcVRvbGVyYW5jZSkge1xuICAgICAgICBpZiAoaW5kZXggLSBmaXJzdCA+IDEpIHNpbXBsaWZ5RFBTdGVwKHBvaW50cywgZmlyc3QsIGluZGV4LCBzcVRvbGVyYW5jZSwgc2ltcGxpZmllZCk7XG4gICAgICAgIHNpbXBsaWZpZWQucHVzaChwb2ludHNbaW5kZXhdKTtcbiAgICAgICAgaWYgKGxhc3QgLSBpbmRleCA+IDEpIHNpbXBsaWZ5RFBTdGVwKHBvaW50cywgaW5kZXgsIGxhc3QsIHNxVG9sZXJhbmNlLCBzaW1wbGlmaWVkKTtcbiAgICB9XG59XG5cbi8vIHNpbXBsaWZpY2F0aW9uIHVzaW5nIFJhbWVyLURvdWdsYXMtUGV1Y2tlciBhbGdvcml0aG1cbmZ1bmN0aW9uIHNpbXBsaWZ5RG91Z2xhc1BldWNrZXIocG9pbnRzLCBzcVRvbGVyYW5jZSkge1xuICAgIHZhciBsYXN0ID0gcG9pbnRzLmxlbmd0aCAtIDE7XG5cbiAgICB2YXIgc2ltcGxpZmllZCA9IFtwb2ludHNbMF1dO1xuICAgIHNpbXBsaWZ5RFBTdGVwKHBvaW50cywgMCwgbGFzdCwgc3FUb2xlcmFuY2UsIHNpbXBsaWZpZWQpO1xuICAgIHNpbXBsaWZpZWQucHVzaChwb2ludHNbbGFzdF0pO1xuXG4gICAgcmV0dXJuIHNpbXBsaWZpZWQ7XG59XG5cbi8vIGJvdGggYWxnb3JpdGhtcyBjb21iaW5lZCBmb3IgYXdlc29tZSBwZXJmb3JtYW5jZVxuZnVuY3Rpb24gc2ltcGxpZnkocG9pbnRzLCB0b2xlcmFuY2UsIGhpZ2hlc3RRdWFsaXR5KSB7XG5cbiAgICBpZiAocG9pbnRzLmxlbmd0aCA8PSAyKSByZXR1cm4gcG9pbnRzO1xuXG4gICAgdmFyIHNxVG9sZXJhbmNlID0gdG9sZXJhbmNlICE9PSB1bmRlZmluZWQgPyB0b2xlcmFuY2UgKiB0b2xlcmFuY2UgOiAxO1xuXG4gICAgcG9pbnRzID0gaGlnaGVzdFF1YWxpdHkgPyBwb2ludHMgOiBzaW1wbGlmeVJhZGlhbERpc3QocG9pbnRzLCBzcVRvbGVyYW5jZSk7XG4gICAgcG9pbnRzID0gc2ltcGxpZnlEb3VnbGFzUGV1Y2tlcihwb2ludHMsIHNxVG9sZXJhbmNlKTtcblxuICAgIHJldHVybiBwb2ludHM7XG59XG5cbi8vIGV4cG9ydCBhcyBBTUQgbW9kdWxlIC8gTm9kZSBtb2R1bGUgLyBicm93c2VyIG9yIHdvcmtlciB2YXJpYWJsZVxuaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkgZGVmaW5lKGZ1bmN0aW9uKCkgeyByZXR1cm4gc2ltcGxpZnk7IH0pO1xuZWxzZSBpZiAodHlwZW9mIG1vZHVsZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBtb2R1bGUuZXhwb3J0cyA9IHNpbXBsaWZ5O1xuICAgIG1vZHVsZS5leHBvcnRzLmRlZmF1bHQgPSBzaW1wbGlmeTtcbn0gZWxzZSBpZiAodHlwZW9mIHNlbGYgIT09ICd1bmRlZmluZWQnKSBzZWxmLnNpbXBsaWZ5ID0gc2ltcGxpZnk7XG5lbHNlIHdpbmRvdy5zaW1wbGlmeSA9IHNpbXBsaWZ5O1xuXG59KSgpO1xuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCAqIGFzIGRhdCBmcm9tICdkYXQuZ3VpJztcbmltcG9ydCBUZW5zb3JGaWVsZEdVSSBmcm9tICcuL3RzL3VpL3RlbnNvcl9maWVsZF9ndWknO1xuaW1wb3J0IFJvYWRzR1VJIGZyb20gJy4vdHMvdWkvcm9hZHNfZ3VpJztcbmltcG9ydCBDYW52YXNXcmFwcGVyIGZyb20gJy4vdHMvdWkvY2FudmFzX3dyYXBwZXInO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi90cy91dGlsJztcbmltcG9ydCBEcmFnQ29udHJvbGxlciBmcm9tICcuL3RzL3VpL2RyYWdfY29udHJvbGxlcic7XG5pbXBvcnQgRG9tYWluQ29udHJvbGxlciBmcm9tICcuL3RzL3VpL2RvbWFpbl9jb250cm9sbGVyJztcblxuZXhwb3J0IGludGVyZmFjZSBEcmF3YWJsZSB7XG4gICAgZHJhdygpOiB2b2lkO1xufVxuXG5jbGFzcyBNYWluIHtcbiAgICBwcml2YXRlIGRvbWFpbkNvbnRyb2xsZXIgPSBEb21haW5Db250cm9sbGVyLmdldEluc3RhbmNlKCk7XG4gICAgcHJpdmF0ZSBjYW52YXM6IENhbnZhc1dyYXBwZXI7XG4gICAgcHJpdmF0ZSBndWk6IGRhdC5HVUkgPSBuZXcgZGF0LkdVSSh7d2lkdGg6IDMwMH0pO1xuICAgIHByaXZhdGUgdGVuc29yRmllbGQ6IFRlbnNvckZpZWxkR1VJO1xuICAgIHByaXZhdGUgcm9hZHNHVUk6IFJvYWRzR1VJO1xuICAgIHByaXZhdGUgZHJhZ0NvbnRyb2xsZXIgPSBuZXcgRHJhZ0NvbnRyb2xsZXIodGhpcy5ndWkpO1xuXG4gICAgLy8gT3B0aW9uc1xuICAgIHByaXZhdGUgaW1hZ2VTY2FsZSA9IDM7XG5cbiAgICAvLyBGb2xkZXJzXG4gICAgcHJpdmF0ZSB0ZW5zb3JGb2xkZXI6IGRhdC5HVUk7XG4gICAgcHJpdmF0ZSByb2Fkc0ZvbGRlcjogZGF0LkdVSTtcblxuICAgIGNvbnN0cnVjdG9yKCkge1xuICAgICAgICBjb25zdCBjID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoVXRpbC5DQU5WQVNfSUQpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICB0aGlzLmNhbnZhcyA9IG5ldyBDYW52YXNXcmFwcGVyKGMpO1xuICAgICAgICBjb25zdCB6b29tQ29udHJvbGxlciA9IHRoaXMuZ3VpLmFkZCh0aGlzLmRvbWFpbkNvbnRyb2xsZXIsICd6b29tJyk7XG4gICAgICAgIHRoaXMuZG9tYWluQ29udHJvbGxlci5zZXRab29tVXBkYXRlKCgpID0+IHpvb21Db250cm9sbGVyLnVwZGF0ZURpc3BsYXkoKSk7XG4gICAgICAgIFxuICAgICAgICB0aGlzLnRlbnNvckZvbGRlciA9IHRoaXMuZ3VpLmFkZEZvbGRlcignVGVuc29yIEZpZWxkJyk7XG4gICAgICAgIHRoaXMudGVuc29yRmllbGQgPSBuZXcgVGVuc29yRmllbGRHVUkodGhpcy50ZW5zb3JGb2xkZXIsIHRoaXMuZHJhZ0NvbnRyb2xsZXIsIHRydWUpO1xuICAgICAgICB0aGlzLnRlbnNvckZvbGRlci5vcGVuKCk7XG5cbiAgICAgICAgdGhpcy5yb2Fkc0ZvbGRlciA9IHRoaXMuZ3VpLmFkZEZvbGRlcignUm9hZHMnKTtcbiAgICAgICAgdGhpcy5yb2Fkc0ZvbGRlci5vcGVuKCk7XG5cbiAgICAgICAgdGhpcy5yb2Fkc0dVSSA9IG5ldyBSb2Fkc0dVSSh0aGlzLnJvYWRzRm9sZGVyLCB0aGlzLnRlbnNvckZpZWxkLCAoKSA9PiB0aGlzLnRlbnNvckZvbGRlci5jbG9zZSgpKTtcblxuICAgICAgICBjb25zdCBvcHRpb25zRm9sZGVyID0gdGhpcy5ndWkuYWRkRm9sZGVyKCdPcHRpb25zJyk7XG4gICAgICAgIG9wdGlvbnNGb2xkZXIuYWRkKHRoaXMudGVuc29yRmllbGQsICdkcmF3Q2VudHJlJyk7XG4gICAgICAgIG9wdGlvbnNGb2xkZXIuYWRkKHRoaXMuY2FudmFzLCAnY2FudmFzU2NhbGUnKTtcbiAgICAgICAgb3B0aW9uc0ZvbGRlci5hZGQodGhpcywgJ2ltYWdlU2NhbGUnLCAxLCA1KTtcbiAgICAgICAgb3B0aW9uc0ZvbGRlci5hZGQodGhpcywgJ2Rvd25sb2FkJyk7XG5cbiAgICAgICAgdGhpcy50ZW5zb3JGaWVsZC5zZXRSZWNvbW1lbmRlZCgpO1xuXG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBEb3dubG9hZHMgaW1hZ2Ugb2YgbWFwXG4gICAgICogRHJhd3Mgb250byBoaWRkZW4gY2FudmFzIGF0IHJlcXVlc3RlZCByZXNvbHV0aW9uXG4gICAgICovXG4gICAgZG93bmxvYWQoKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGMgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChVdGlsLklNR19DQU5WQVNfSUQpIGFzIEhUTUxDYW52YXNFbGVtZW50O1xuICAgICAgICBjb25zdCBpbWdDYW52YXMgPSBuZXcgQ2FudmFzV3JhcHBlcihjLCB0aGlzLmltYWdlU2NhbGUsIGZhbHNlKTtcbiAgICAgICAgdGhpcy5kcmF3KGltZ0NhbnZhcyk7XG4gICAgICAgIGNvbnN0IGxpbmsgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdhJyk7XG4gICAgICAgIGxpbmsuZG93bmxvYWQgPSAnbWFwLnBuZyc7XG4gICAgICAgIGxpbmsuaHJlZiA9IChkb2N1bWVudC5nZXRFbGVtZW50QnlJZChVdGlsLklNR19DQU5WQVNfSUQpIGFzIGFueSkudG9EYXRhVVJMKCk7XG4gICAgICAgIGxpbmsuY2xpY2soKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGRyYXdUZW5zb3JGaWVsZCgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICF0aGlzLnRlbnNvckZvbGRlci5jbG9zZWQgfHwgdGhpcy5yb2Fkc0dVSS5yb2Fkc0VtcHR5KCk7XG4gICAgfVxuXG4gICAgZHJhdyhjYW52YXM6IENhbnZhc1dyYXBwZXIpOiB2b2lkIHtcbiAgICAgICAgY2FudmFzLnNldEZpbGxTdHlsZSgnYmxhY2snKTtcbiAgICAgICAgY2FudmFzLmNsZWFyQ2FudmFzKCk7XG4gICAgICAgIGlmICh0aGlzLmRyYXdUZW5zb3JGaWVsZCgpKSB7XG4gICAgICAgICAgICB0aGlzLmRyYWdDb250cm9sbGVyLnNldERyYWdEaXNhYmxlZChmYWxzZSk7XG4gICAgICAgICAgICB0aGlzLnRlbnNvckZpZWxkLmRyYXcoY2FudmFzKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuZHJhZ0NvbnRyb2xsZXIuc2V0RHJhZ0Rpc2FibGVkKHRydWUpO1xuICAgICAgICAgICAgdGhpcy5yb2Fkc0dVSS5kcmF3KGNhbnZhcyk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB1cGRhdGUoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhdyh0aGlzLmNhbnZhcyk7XG4gICAgICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSh0aGlzLnVwZGF0ZS5iaW5kKHRoaXMpKTtcbiAgICB9XG59XG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKCdsb2FkJywgKCk6IHZvaWQgPT4ge1xuICAgIG5ldyBNYWluKCk7XG59KTtcbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlY3RvciB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cblxuICAgIHN0YXRpYyB6ZXJvVmVjdG9yKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKDAsIDApO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tU2NhbGFyKHM6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHMsIHMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIC1waSB0byBwaVxuICAgICAqL1xuICAgIHN0YXRpYyBhbmdsZUJldHdlZW4odjE6IFZlY3RvciwgdjI6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIC8vIC0ycGkgdG8gMnBpXG4gICAgICAgIGxldCBhbmdsZUJldHdlZW4gPSB2MS5hbmdsZSgpIC0gdjIuYW5nbGUoKTtcbiAgICAgICAgaWYgKGFuZ2xlQmV0d2VlbiA+IE1hdGguUEkpIHtcbiAgICAgICAgICAgIGFuZ2xlQmV0d2VlbiAtPSAyICogTWF0aC5QSTtcbiAgICAgICAgfSBlbHNlIGlmIChhbmdsZUJldHdlZW4gPD0gLU1hdGguUEkpIHtcbiAgICAgICAgICAgIGFuZ2xlQmV0d2VlbiArPSAyICogTWF0aC5QSTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gYW5nbGVCZXR3ZWVuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgYSBwb2ludCBsaWVzIHRvIHRoZSBsZWZ0IG9mIGEgbGluZVxuICAgICAqIEBwYXJhbSAge1ZlY3Rvcn0gbGluZVBvaW50ICAgICBQb2ludCBvbiB0aGUgbGluZVxuICAgICAqIEBwYXJhbSAge1ZlY3Rvcn0gbGluZURpcmVjdGlvbiBcbiAgICAgKiBAcGFyYW0gIHtWZWN0b3J9IHBvaW50XG4gICAgICogQHJldHVybiB7VmVjdG9yfSAgICAgICAgICAgICAgIHRydWUgaWYgbGVmdCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgc3RhdGljIGlzTGVmdChsaW5lUG9pbnQ6IFZlY3RvciwgbGluZURpcmVjdGlvbjogVmVjdG9yLCBwb2ludDogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIGNvbnN0IHBlcnBlbmRpY3VsYXJWZWN0b3IgPSBuZXcgVmVjdG9yKGxpbmVEaXJlY3Rpb24ueSwgLWxpbmVEaXJlY3Rpb24ueCk7XG4gICAgICAgIHJldHVybiBwb2ludC5jbG9uZSgpLnN1YihsaW5lUG9pbnQpLmRvdChwZXJwZW5kaWN1bGFyVmVjdG9yKSA8IDA7XG4gICAgfVxuXG4gICAgYWRkKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCArPSB2Lng7XG4gICAgICAgIHRoaXMueSArPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuZ2xlIGluIHJhZGlhbnMgdG8gcG9zaXRpdmUgeC1heGlzIGJldHdlZW4gLXBpIGFuZCBwaVxuICAgICAqL1xuICAgIGFuZ2xlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLmF0YW4yKHRoaXMueSwgdGhpcy54KTtcbiAgICB9XG5cbiAgICBjbG9uZSgpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3Rvcih0aGlzLngsIHRoaXMueSk7XG4gICAgfVxuXG4gICAgY29weSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggPSB2Lng7XG4gICAgICAgIHRoaXMueSA9IHYueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgY3Jvc3ModjogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueSAtIHRoaXMueSAqIHYueDtcbiAgICB9XG5cbiAgICBkaXN0YW5jZVRvKHY6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5kaXN0YW5jZVRvU3F1YXJlZCh2KSk7XG4gICAgfVxuXG4gICAgZGlzdGFuY2VUb1NxdWFyZWQgKHY6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIGNvbnN0IGR4ID0gdGhpcy54IC0gdi54XG4gICAgICAgIGNvbnN0IGR5ID0gdGhpcy55IC0gdi55O1xuICAgICAgICByZXR1cm4gZHggKiBkeCArIGR5ICogZHk7XG4gICAgfVxuXG4gICAgZGl2aWRlKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIGlmICh2LnggPT09IDAgfHwgdi55ID09PSAwKSB7XG4gICAgICAgICAgICBsb2cud2FybihcIkRpdmlzaW9uIGJ5IHplcm9cIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMueCAvPSB2Lng7XG4gICAgICAgIHRoaXMueSAvPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGRpdmlkZVNjYWxhcihzOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICBpZiAocyA9PT0gMCkge1xuICAgICAgICAgICAgbG9nLndhcm4oXCJEaXZpc2lvbiBieSB6ZXJvXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHlTY2FsYXIoMSAvIHMpO1xuICAgIH1cblxuICAgIGRvdCh2OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdi54ICsgdGhpcy55ICogdi55O1xuICAgIH1cblxuICAgIGVxdWFscyh2OiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuICgodi54ID09PSB0aGlzLngpICYmICh2LnkgPT09IHRoaXMueSkpO1xuICAgIH1cblxuICAgIGxlbmd0aCgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMubGVuZ3RoU3EoKSk7XG4gICAgfVxuXG4gICAgbGVuZ3RoU3EoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHRoaXMueCArIHRoaXMueSAqIHRoaXMueTtcbiAgICB9XG5cbiAgICBtdWx0aXBseSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggKj0gdi54O1xuICAgICAgICB0aGlzLnkgKj0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBtdWx0aXBseVNjYWxhcihzOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggKj0gcztcbiAgICAgICAgdGhpcy55ICo9IHM7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG5lZ2F0ZSgpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseVNjYWxhcigtMSk7XG4gICAgfVxuXG4gICAgbm9ybWFsaXplKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGwgPSB0aGlzLmxlbmd0aCgpO1xuICAgICAgICBpZiAobCA9PT0gMCkge1xuICAgICAgICAgICAgbG9nLndhcm4oXCJaZXJvIFZlY3RvclwiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXR1cm4gdGhpcy5kaXZpZGVTY2FsYXIodGhpcy5sZW5ndGgoKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5nbGUgaW4gcmFkaWFuc1xuICAgICAqL1xuICAgIHJvdGF0ZUFyb3VuZChjZW50ZXI6IFZlY3RvciwgYW5nbGU6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKGFuZ2xlKVxuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbihhbmdsZSk7XG5cbiAgICAgICAgY29uc3QgeCA9IHRoaXMueCAtIGNlbnRlci54O1xuICAgICAgICBjb25zdCB5ID0gdGhpcy55IC0gY2VudGVyLnk7XG5cbiAgICAgICAgdGhpcy54ID0geCAqIGNvcyAtIHkgKiBzaW4gKyBjZW50ZXIueDtcbiAgICAgICAgdGhpcy55ID0geCAqIHNpbiArIHkgKiBjb3MgKyBjZW50ZXIueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0KHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCA9IHYueDtcbiAgICAgICAgdGhpcy55ID0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRYKHg6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCA9IHg7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldFkoeTogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy55ID0geTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0TGVuZ3RoIChsZW5ndGg6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLm5vcm1hbGl6ZSgpLm11bHRpcGx5U2NhbGFyKGxlbmd0aCk7XG4gICAgfVxuXG4gICAgc3ViKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCAtPSB2Lng7XG4gICAgICAgIHRoaXMueSAtPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbn1cbiIsImltcG9ydCBUZW5zb3IgZnJvbSAnLi90ZW5zb3InO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi92ZWN0b3InO1xuXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQmFzaXNGaWVsZCB7XG4gICAgYWJzdHJhY3QgcmVhZG9ubHkgRk9MREVSX05BTUU6IHN0cmluZztcbiAgICBwcm90ZWN0ZWQgc3RhdGljIGZvbGRlck5hbWVJbmRleDogbnVtYmVyID0gMDtcbiAgICBwcm90ZWN0ZWQgX2NlbnRyZTogVmVjdG9yO1xuXG4gICAgY29uc3RydWN0b3IoY2VudHJlOiBWZWN0b3IsIHByb3RlY3RlZCBfc2l6ZTogbnVtYmVyLCBwcm90ZWN0ZWQgX2RlY2F5OiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fY2VudHJlID0gY2VudHJlLmNsb25lKCk7XG4gICAgfVxuXG4gICAgc2V0IGNlbnRyZShjZW50cmU6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLl9jZW50cmUuY29weShjZW50cmUpO1xuICAgIH1cblxuICAgIGdldCBjZW50cmUoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2NlbnRyZS5jbG9uZSgpO1xuICAgIH1cblxuICAgIHNldCBkZWNheShkZWNheTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2RlY2F5ID0gZGVjYXk7XG4gICAgfVxuXG4gICAgc2V0IHNpemUoc2l6ZTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3NpemUgPSBzaXplO1xuICAgIH1cblxuICAgIGRyYWdNb3ZlTGlzdGVuZXIoZGVsdGE6IFZlY3Rvcik6IHZvaWQge1xuICAgICAgICAvLyBEZWx0YSBhc3N1bWVkIHRvIGJlIGluIHdvcmxkIHNwYWNlIChvbmx5IHJlbGV2YW50IHdoZW4gem9vbWVkKVxuICAgICAgICB0aGlzLl9jZW50cmUuYWRkKGRlbHRhKTtcbiAgICB9XG5cbiAgICBhYnN0cmFjdCBnZXRUZW5zb3IocG9pbnQ6IFZlY3Rvcik6IFRlbnNvcjtcblxuICAgIGdldFdlaWdodGVkVGVuc29yKHBvaW50OiBWZWN0b3IpOiBUZW5zb3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRUZW5zb3IocG9pbnQpLnNjYWxlKHRoaXMuZ2V0VGVuc29yV2VpZ2h0KHBvaW50KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZvbGRlciBhbmQgYWRkcyBpdCB0byB0aGUgR1VJIHRvIGNvbnRyb2wgcGFyYW1zXG4gICAgICovXG4gICAgc2V0R3VpKGd1aTogZGF0LkdVSSk6IHZvaWQge1xuICAgICAgICBndWkuYWRkKHRoaXMuX2NlbnRyZSwgJ3gnKTtcbiAgICAgICAgZ3VpLmFkZCh0aGlzLl9jZW50cmUsICd5Jyk7XG4gICAgICAgIGd1aS5hZGQodGhpcywgJ19zaXplJyk7XG4gICAgICAgIGd1aS5hZGQodGhpcywgJ19kZWNheScsIDAsIDUwKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBJbnRlcnBvbGF0ZXMgYmV0d2VlbiAoMCBhbmQgMSleZGVjYXlcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0VGVuc29yV2VpZ2h0KHBvaW50OiBWZWN0b3IpOiBudW1iZXIgeyAgICAgICAgXG4gICAgICAgIGNvbnN0IG5vcm1EaXN0YW5jZVRvQ2VudHJlID0gcG9pbnQuY2xvbmUoKS5zdWIodGhpcy5fY2VudHJlKS5sZW5ndGgoKSAvIHRoaXMuX3NpemU7XG4gICAgICAgIFxuICAgICAgICAvLyBTdG9wICgqKiAwKSB0dXJuaW5nIHdlaWdodCBpbnRvIDEsIGZpbGxpbmcgc2NyZWVuIGV2ZW4gd2hlbiBvdXRzaWRlICdzaXplJ1xuICAgICAgICBpZiAodGhpcy5fZGVjYXkgPT09IDAgJiYgbm9ybURpc3RhbmNlVG9DZW50cmUgPj0gMSkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGgubWF4KDAsICgxIC0gbm9ybURpc3RhbmNlVG9DZW50cmUpKSAqKiB0aGlzLl9kZWNheTtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBHcmlkIGV4dGVuZHMgQmFzaXNGaWVsZCB7XG4gICAgcmVhZG9ubHkgRk9MREVSX05BTUUgPSBgR3JpZCAke0dyaWQuZm9sZGVyTmFtZUluZGV4Kyt9YDtcblxuICAgIGNvbnN0cnVjdG9yKGNlbnRyZTogVmVjdG9yLCBzaXplOiBudW1iZXIsIGRlY2F5OiBudW1iZXIsIHByaXZhdGUgX3RoZXRhOiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoY2VudHJlLCBzaXplLCBkZWNheSk7XG4gICAgfVxuXG4gICAgc2V0IHRoZXRhKHRoZXRhOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5fdGhldGEgPSB0aGV0YTtcbiAgICB9XG5cbiAgICBzZXRHdWkoZ3VpOiBkYXQuR1VJKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnNldEd1aShndWkpO1xuXG4gICAgICAgIC8vIEdVSSBpbiBkZWdyZWVzLCBjb252ZXJ0IHRvIHJhZHNcbiAgICAgICAgY29uc3QgdGhldGFQcm9wID0ge3RoZXRhOiB0aGlzLl90aGV0YSAqIDE4MCAvIE1hdGguUEl9O1xuICAgICAgICBjb25zdCB0aGV0YUNvbnRyb2xsZXIgPSBndWkuYWRkKHRoZXRhUHJvcCwgJ3RoZXRhJywgLTkwLCA5MCk7XG4gICAgICAgIHRoZXRhQ29udHJvbGxlci5vbkNoYW5nZSh0aGV0YSA9PiB0aGlzLl90aGV0YSA9IHRoZXRhICogKE1hdGguUEkgLyAxODApKTtcbiAgICB9XG5cbiAgICBnZXRUZW5zb3IocG9pbnQ6IFZlY3Rvcik6IFRlbnNvciB7XG4gICAgICAgIGNvbnN0IGNvcyA9IE1hdGguY29zKDIgKiB0aGlzLl90aGV0YSk7XG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKDIgKiB0aGlzLl90aGV0YSk7XG4gICAgICAgIHJldHVybiBuZXcgVGVuc29yKDEsIFtjb3MsIHNpbl0pO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIFJhZGlhbCBleHRlbmRzIEJhc2lzRmllbGQge1xuICAgIHJlYWRvbmx5IEZPTERFUl9OQU1FID0gYFJhZGlhbCAke1JhZGlhbC5mb2xkZXJOYW1lSW5kZXgrK31gO1xuICAgIGNvbnN0cnVjdG9yKGNlbnRyZTogVmVjdG9yLCBzaXplOiBudW1iZXIsIGRlY2F5OiBudW1iZXIpIHtcbiAgICAgICAgc3VwZXIoY2VudHJlLCBzaXplLCBkZWNheSk7XG4gICAgfVxuXG4gICAgZ2V0VGVuc29yKHBvaW50OiBWZWN0b3IpOiBUZW5zb3Ige1xuICAgICAgICBjb25zdCB0ID0gcG9pbnQuY2xvbmUoKS5zdWIodGhpcy5fY2VudHJlKTtcbiAgICAgICAgY29uc3QgdDEgPSB0LnkqKjIgLSB0LngqKjI7XG4gICAgICAgIGNvbnN0IHQyID0gLTIgKiB0LnggKiB0Lnk7XG4gICAgICAgIHJldHVybiBuZXcgVGVuc29yKDEsIFt0MSwgdDJdKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi92ZWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHcmlkU3RvcmFnZSB7XG5cbiAgICBwcml2YXRlIGdyaWREaW1lbnNpb25zOiBWZWN0b3I7XG4gICAgcHJpdmF0ZSBncmlkOiBWZWN0b3JbXVtdW107XG4gICAgcHJpdmF0ZSBkc2VwU3E6IG51bWJlcjtcblxuICAgIC8qKlxuICAgICAqIHdvcmxkRGltZW5zaW9ucyBhc3N1bWVzIG9yaWdpbiBvZiAwLDBcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gZHNlcCBTZXBhcmF0aW9uIGRpc3RhbmNlIGJldHdlZW4gc2FtcGxlc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yIChwcml2YXRlIHdvcmxkRGltZW5zaW9uczogVmVjdG9yLCBwcml2YXRlIG9yaWdpbjogVmVjdG9yLCBwcml2YXRlIGRzZXA6IG51bWJlcikge1xuICAgICAgICB0aGlzLmRzZXBTcSA9IHRoaXMuZHNlcCAqIHRoaXMuZHNlcDtcbiAgICAgICAgdGhpcy5ncmlkRGltZW5zaW9ucyA9IHdvcmxkRGltZW5zaW9ucy5jbG9uZSgpLmRpdmlkZVNjYWxhcih0aGlzLmRzZXApO1xuICAgICAgICB0aGlzLmdyaWQgPSBbXTtcbiAgICAgICAgZm9yIChsZXQgeCA9IDA7IHggPCB0aGlzLmdyaWREaW1lbnNpb25zLng7IHgrKykge1xuICAgICAgICAgICAgdGhpcy5ncmlkLnB1c2goW10pO1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IDA7IHkgPCB0aGlzLmdyaWREaW1lbnNpb25zLnk7IHkrKykge1xuICAgICAgICAgICAgICAgIHRoaXMuZ3JpZFt4XS5wdXNoKFtdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFkZCBhbGwgc2FtcGxlcyBmcm9tIGFub3RoZXIgZ3JpZCB0byB0aGlzIG9uZVxuICAgICAqL1xuICAgIGFkZEFsbChncmlkU3RvcmFnZTogR3JpZFN0b3JhZ2UpOiB2b2lkIHtcbiAgICAgICAgZ3JpZFN0b3JhZ2UuZ3JpZC5mb3JFYWNoKHJvdyA9PiByb3cuZm9yRWFjaChjZWxsID0+IGNlbGwuZm9yRWFjaChzYW1wbGUgPT4ge1xuICAgICAgICAgICAgdGhpcy5hZGRTYW1wbGUoc2FtcGxlKTtcbiAgICAgICAgfSkpKTtcbiAgICB9XG5cbiAgICBhZGRQb2x5bGluZShsaW5lOiBWZWN0b3JbXSk6IHZvaWQge1xuICAgICAgICBsaW5lLmZvckVhY2godiA9PiB0aGlzLmFkZFNhbXBsZSh2KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyBub3QgZW5mb3JjZSBzZXBhcmF0aW9uXG4gICAgICogRG9lcyBub3QgY2xvbmVcbiAgICAgKi9cbiAgICBhZGRTYW1wbGUodjogVmVjdG9yLCBjb29yZHM/OiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgaWYgKCFjb29yZHMpIHtcbiAgICAgICAgICAgIGNvb3JkcyA9IHRoaXMuZ2V0U2FtcGxlQ29vcmRzKHYpO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuZ3JpZFtjb29yZHMueF1bY29vcmRzLnldLnB1c2godik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogVGVzdHMgd2hldGhlciB2IGlzIGF0IGxlYXN0IGQgYXdheSBmcm9tIHNhbXBsZXNcbiAgICAgKiBQZXJmb3JtYW5jZSB2ZXJ5IGltcG9ydGFudCAtIHRoaXMgaXMgY2FsbGVkIGF0IGV2ZXJ5IGludGVncmF0aW9uIHN0ZXBcbiAgICAgKiBAcGFyYW0gZFNxPXRoaXMuZHNlcFNxIHNxdWFyZWQgdGVzdCBkaXN0YW5jZVxuICAgICAqIENvdWxkIGJlIGR0ZXN0IGlmIHdlIGFyZSBpbnRlZ3JhdGluZyBhIHN0cmVhbWxpbmVcbiAgICAgKi9cbiAgICBpc1ZhbGlkU2FtcGxlKHY6IFZlY3RvciwgZFNxPXRoaXMuZHNlcFNxKTogYm9vbGVhbiB7XG4gICAgICAgIC8vIENvZGUgZHVwbGljYXRpb24gd2l0aCB0aGlzLmdldE5lYXJieVBvaW50cyBidXQgbXVjaCBzbG93ZXIgd2hlbiBjYWxsaW5nXG4gICAgICAgIC8vIHRoaXMuZ2V0TmVhcmJ5UG9pbnRzIGR1ZSB0byBhcnJheSBjcmVhdGlvbiBpbiB0aGF0IG1ldGhvZFxuXG4gICAgICAgIGNvbnN0IGNvb3JkcyA9IHRoaXMuZ2V0U2FtcGxlQ29vcmRzKHYpO1xuXG4gICAgICAgIC8vIENoZWNrIHNhbXBsZXMgaW4gOSBjZWxscyBpbiAzeDMgZ3JpZFxuICAgICAgICBmb3IgKGxldCB4ID0gLTE7IHggPD0gMTsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gLTE7IHkgPD0gMTsgeSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGNvb3Jkcy5jbG9uZSgpLmFkZChuZXcgVmVjdG9yKHgsIHkpKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudmVjdG9yT3V0T2ZCb3VuZHMoY2VsbCwgdGhpcy5ncmlkRGltZW5zaW9ucykpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZlY3RvckZhckZyb21WZWN0b3JzKHYsIHRoaXMuZ3JpZFtjZWxsLnhdW2NlbGwueV0sIGRTcSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBcbiAgICAvKipcbiAgICAgKiBUZXN0IHdoZXRoZXIgdiBpcyBhdCBsZWFzdCBkIGF3YXkgZnJvbSB2ZWN0b3JzXG4gICAgICogUGVyZm9ybWFuY2UgdmVyeSBpbXBvcnRhbnQgLSB0aGlzIGlzIGNhbGxlZCBhdCBldmVyeSBpbnRlZ3JhdGlvbiBzdGVwXG4gICAgICogQHBhcmFtIHtudW1iZXJ9ICAgZFNxICAgICBzcXVhcmVkIHRlc3QgZGlzdGFuY2VcbiAgICAgKi9cbiAgICB2ZWN0b3JGYXJGcm9tVmVjdG9ycyh2OiBWZWN0b3IsIHZlY3RvcnM6IFZlY3RvcltdLCBkU3E6IG51bWJlcik6IGJvb2xlYW4ge1xuICAgICAgICBmb3IgKGNvbnN0IHNhbXBsZSBvZiB2ZWN0b3JzKSB7XG4gICAgICAgICAgICBpZiAoc2FtcGxlICE9PSB2KSB7XG4gICAgICAgICAgICAgICAgY29uc3QgZGlzdGFuY2VTcSA9IHNhbXBsZS5kaXN0YW5jZVRvU3F1YXJlZCh2KTtcbiAgICAgICAgICAgICAgICBpZiAoZGlzdGFuY2VTcSA8IGRTcSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBwb2ludHMgaW4gY2VsbHMgc3Vycm91bmRpbmcgdlxuICAgICAqIFJlc3VsdHMgaW5jbHVkZSB2LCBpZiBpdCBleGlzdHMgaW4gdGhlIGdyaWRcbiAgICAgKiBAcGFyYW0ge251bWJlcn0gcmV0dXJucyBzYW1wbGVzIChraW5kIG9mKSBjbG9zZXIgdGhhbiBkaXN0YW5jZSAtIHJldHVybnMgYWxsIHNhbXBsZXMgaW4gXG4gICAgICogY2VsbHMgc28gYXBwcm94aW1hdGlvbiAoc3F1YXJlIHRvIGFwcHJveGltYXRlIGNpcmNsZSlcbiAgICAgKi9cbiAgICBnZXROZWFyYnlQb2ludHModjogVmVjdG9yLCBkaXN0YW5jZTogbnVtYmVyKTogVmVjdG9yW10ge1xuICAgICAgICBjb25zdCByYWRpdXMgPSBNYXRoLmNlaWwoKGRpc3RhbmNlL3RoaXMuZHNlcCkgLSAwLjUpO1xuICAgICAgICBjb25zdCBjb29yZHMgPSB0aGlzLmdldFNhbXBsZUNvb3Jkcyh2KTtcbiAgICAgICAgY29uc3Qgb3V0OiBWZWN0b3JbXSA9IFtdO1xuICAgICAgICBmb3IgKGxldCB4ID0gLTEgKiByYWRpdXM7IHggPD0gMSAqIHJhZGl1czsgeCsrKSB7XG4gICAgICAgICAgICBmb3IgKGxldCB5ID0gLTEgKiByYWRpdXM7IHkgPD0gMSAqIHJhZGl1czsgeSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgY2VsbCA9IGNvb3Jkcy5jbG9uZSgpLmFkZChuZXcgVmVjdG9yKHgsIHkpKTtcbiAgICAgICAgICAgICAgICBpZiAoIXRoaXMudmVjdG9yT3V0T2ZCb3VuZHMoY2VsbCwgdGhpcy5ncmlkRGltZW5zaW9ucykpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5ncmlkW2NlbGwueF1bY2VsbC55XS5mb3JFYWNoKHYyID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIG91dC5wdXNoKHYyKTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG91dDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHdvcmxkVG9HcmlkKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB2LmNsb25lKCkuc3ViKHRoaXMub3JpZ2luKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyaWRUb1dvcmxkKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB2LmNsb25lKCkuYWRkKHRoaXMub3JpZ2luKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZlY3Rvck91dE9mQm91bmRzKGdyaWRWOiBWZWN0b3IsIGJvdW5kczogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoZ3JpZFYueCA8IDAgfHwgZ3JpZFYueSA8IDAgfHxcbiAgICAgICAgICAgIGdyaWRWLnggPj0gYm91bmRzLnggfHwgZ3JpZFYueSA+PSBib3VuZHMueSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB7VmVjdG9yfSAgIENlbGwgY29vcmRzIGNvcnJlc3BvbmRpbmcgdG8gdmVjdG9yXG4gICAgICogUGVyZm9ybWFuY2UgaW1wb3J0YW50IC0gY2FsbGVkIGF0IGV2ZXJ5IGludGVncmF0aW9uIHN0ZXBcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFNhbXBsZUNvb3Jkcyh3b3JsZFY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLndvcmxkVG9HcmlkKHdvcmxkVik7XG4gICAgICAgIGlmICh0aGlzLnZlY3Rvck91dE9mQm91bmRzKHYsIHRoaXMud29ybGREaW1lbnNpb25zKSkge1xuICAgICAgICAgICAgbG9nLmVycm9yKFwiVHJpZWQgdG8gYWNjZXNzIG91dC1vZi1ib3VuZHMgc2FtcGxlIGluIGdyaWRcIik7XG4gICAgICAgICAgICByZXR1cm4gVmVjdG9yLnplcm9WZWN0b3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgTWF0aC5mbG9vcih2LnggLyB0aGlzLmRzZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcih2LnkgLyB0aGlzLmRzZXApXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFRlbnNvckZpZWxkIGZyb20gJy4vdGVuc29yX2ZpZWxkJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi4vdmVjdG9yJztcbmltcG9ydCB7U3RyZWFtbGluZVBhcmFtc30gZnJvbSAnLi9zdHJlYW1saW5lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEZpZWxkSW50ZWdyYXRvciB7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpZWxkOiBUZW5zb3JGaWVsZCkge31cblxuICAgIGFic3RyYWN0IGludGVncmF0ZShwb2ludDogVmVjdG9yLCBtYWpvcjogYm9vbGVhbik6IFZlY3RvcjtcblxuICAgIHByb3RlY3RlZCBzYW1wbGVGaWVsZFZlY3Rvcihwb2ludDogVmVjdG9yLCBtYWpvcjogYm9vbGVhbik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHRlbnNvciA9IHRoaXMuZmllbGQuc2FtcGxlUG9pbnQocG9pbnQpO1xuICAgICAgICBpZiAobWFqb3IpIHJldHVybiB0ZW5zb3IuZ2V0TWFqb3IoKTtcbiAgICAgICAgcmV0dXJuIHRlbnNvci5nZXRNaW5vcigpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV1bGVySW50ZWdyYXRvciBleHRlbmRzIEZpZWxkSW50ZWdyYXRvciB7XG4gICAgY29uc3RydWN0b3IoZmllbGQ6IFRlbnNvckZpZWxkLCBwcml2YXRlIHBhcmFtczogU3RyZWFtbGluZVBhcmFtcykge1xuICAgICAgICBzdXBlcihmaWVsZCk7XG4gICAgfVxuXG4gICAgaW50ZWdyYXRlKHBvaW50OiBWZWN0b3IsIG1ham9yOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FtcGxlRmllbGRWZWN0b3IocG9pbnQsIG1ham9yKS5tdWx0aXBseVNjYWxhcih0aGlzLnBhcmFtcy5kc3RlcCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUks0SW50ZWdyYXRvciBleHRlbmRzIEZpZWxkSW50ZWdyYXRvciB7XG4gICAgY29uc3RydWN0b3IoZmllbGQ6IFRlbnNvckZpZWxkLCBwcml2YXRlIHBhcmFtczogU3RyZWFtbGluZVBhcmFtcykge1xuICAgICAgICBzdXBlcihmaWVsZCk7XG4gICAgfVxuXG4gICAgaW50ZWdyYXRlKHBvaW50OiBWZWN0b3IsIG1ham9yOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgazEgPSB0aGlzLnNhbXBsZUZpZWxkVmVjdG9yKHBvaW50LCBtYWpvcik7XG4gICAgICAgIGNvbnN0IGsyMyA9IHRoaXMuc2FtcGxlRmllbGRWZWN0b3IocG9pbnQuY2xvbmUoKS5hZGQoVmVjdG9yLmZyb21TY2FsYXIodGhpcy5wYXJhbXMuZHN0ZXAgLyAyKSksIG1ham9yKTtcbiAgICAgICAgY29uc3QgazQgPSB0aGlzLnNhbXBsZUZpZWxkVmVjdG9yKHBvaW50LmNsb25lKCkuYWRkKFZlY3Rvci5mcm9tU2NhbGFyKHRoaXMucGFyYW1zLmRzdGVwKSksIG1ham9yKTtcblxuICAgICAgICByZXR1cm4gazEuYWRkKGsyMy5tdWx0aXBseVNjYWxhcig0KSkuYWRkKGs0KS5tdWx0aXBseVNjYWxhcih0aGlzLnBhcmFtcy5kc3RlcCAvIDYpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgKiBhcyBzaW1wbGlmeSBmcm9tICdzaW1wbGlmeS1qcyc7XG5pbXBvcnQgVmVjdG9yIGZyb20gJy4uL3ZlY3Rvcic7XG5pbXBvcnQgR3JpZFN0b3JhZ2UgZnJvbSAnLi9ncmlkX3N0b3JhZ2UnO1xuaW1wb3J0IEZpZWxkSW50ZWdyYXRvciBmcm9tICcuL2ludGVncmF0b3InO1xuXG5pbnRlcmZhY2UgU3RyZWFtbGluZUludGVncmF0aW9uIHtcbiAgICBzZWVkOiBWZWN0b3IsXG4gICAgb3JpZ2luYWxEaXI6IFZlY3RvcixcbiAgICBzdHJlYW1saW5lOiBWZWN0b3JbXTtcbiAgICBwcmV2aW91c0RpcmVjdGlvbjogVmVjdG9yO1xuICAgIHByZXZpb3VzUG9pbnQ6IFZlY3RvcjtcbiAgICB2YWxpZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1saW5lUGFyYW1zIHtcbiAgICBbcHJvcDogc3RyaW5nXTogbnVtYmVyLFxuICAgIGRzZXA6IG51bWJlcjsgIC8vIFN0cmVhbWxpbmUgc2VlZCBzZXBhcmF0aW5nIGRpc3RhbmNlXG4gICAgZHRlc3Q6IG51bWJlcjsgIC8vIFN0cmVhbWxpbmUgaW50ZWdyYXRpb24gc2VwYXJhdGluZyBkaXN0YW5jZVxuICAgIGRzdGVwOiBudW1iZXI7ICAvLyBTdGVwIHNpemVcbiAgICBkY2lyY2xlam9pbjogbnVtYmVyOyAgLy8gSG93IGZhciB0byBsb29rIHRvIGpvaW4gY2lyY2xlcyAtIChlLmcuIDIgeCBkc3RlcClcbiAgICBkbG9va2FoZWFkOiBudW1iZXI7ICAvLyBIb3cgZmFyIHRvIGxvb2sgYWhlYWQgdG8gam9pbiB1cCBkYW5nbGluZ1xuICAgIGpvaW5hbmdsZTogbnVtYmVyOyAgLy8gQW5nbGUgdG8gam9pbiByb2FkcyBpbiByYWRpYW5zXG4gICAgcGF0aEl0ZXJhdGlvbnM6IG51bWJlcjsgIC8vIFBhdGggaW50ZWdyYXRpb24gaXRlcmF0aW9uIGxpbWl0XG4gICAgc2VlZFRyaWVzOiBudW1iZXI7ICAvLyBNYXggZmFpbGVkIHNlZWRzXG4gICAgc2ltcGxpZnlUb2xlcmFuY2U6IG51bWJlcjtcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgU3RyZWFtbGluZUdlbmVyYXRvciB7XG4gICAgcHJpdmF0ZSByZWFkb25seSBTRUVEX0FUX0VORFBPSU5UUyA9IGZhbHNlO1xuICAgIHByaXZhdGUgcmVhZG9ubHkgTkVBUl9FREdFID0gMzsgIC8vIFNhbXBsZSBuZWFyIGVkZ2VcblxuICAgIHByaXZhdGUgbWFqb3JHcmlkOiBHcmlkU3RvcmFnZTtcbiAgICBwcml2YXRlIG1pbm9yR3JpZDogR3JpZFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBwYXJhbXNTcTogU3RyZWFtbGluZVBhcmFtcztcblxuICAgIC8vIEhvdyBtYW55IHNhbXBsZXMgdG8gc2tpcCB3aGVuIGNoZWNraW5nIHN0cmVhbWxpbmUgY29sbGlzaW9uIHdpdGggaXRzZWxmXG4gICAgcHJpdmF0ZSBuU3RyZWFtbGluZVN0ZXA6IG51bWJlcjtcbiAgICAvLyBIb3cgbWFueSBzYW1wbGVzIHRvIGlnbm9yZSBiYWNrd2FyZHMgd2hlbiBjaGVja2luZyBzdHJlYW1saW5lIGNvbGxpc2lvbiB3aXRoIGl0c2VsZlxuICAgIHByaXZhdGUgblN0cmVhbWxpbmVMb29rQmFjazogbnVtYmVyO1xuICAgIHByaXZhdGUgZGNvbGxpZGVzZWxmU3E6IG51bWJlcjtcblxuICAgIHByaXZhdGUgY2FuZGlkYXRlU2VlZHNNYWpvcjogVmVjdG9yW10gPSBbXTtcbiAgICBwcml2YXRlIGNhbmRpZGF0ZVNlZWRzTWlub3I6IFZlY3RvcltdID0gW107XG5cbiAgICBwcml2YXRlIHN0cmVhbWxpbmVzRG9uZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSBsYXN0U3RyZWFtbGluZU1ham9yOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIHB1YmxpYyBzdHJlYW1saW5lc01ham9yOiBWZWN0b3JbXVtdID0gW107XG4gICAgcHVibGljIHN0cmVhbWxpbmVzTWlub3I6IFZlY3RvcltdW10gPSBbXTtcbiAgICBwdWJsaWMgYWxsU3RyZWFtbGluZXNTaW1wbGU6IFZlY3RvcltdW10gPSBbXTsgIC8vIFJlZHVjZWQgdmVydGV4IGNvdW50XG5cbiAgICAvKipcbiAgICAgKiBVc2VzIHdvcmxkLXNwYWNlIGNvb3JkaW5hdGVzXG4gICAgICovXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBpbnRlZ3JhdG9yOiBGaWVsZEludGVncmF0b3IsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBvcmlnaW46IFZlY3RvcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHdvcmxkRGltZW5zaW9uczogVmVjdG9yLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgcGFyYW1zOiBTdHJlYW1saW5lUGFyYW1zKSB7XG4gICAgICAgIGlmIChwYXJhbXMuZHN0ZXAgPiBwYXJhbXMuZHNlcCkge1xuICAgICAgICAgICAgbG9nLmVycm9yKFwiU1RSRUFNTElORSBTQU1QTEUgRElTVEFOQ0UgQklHR0VSIFRIQU4gRFNFUFwiKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIEVuZm9yY2UgdGVzdCA8IHNlcFxuICAgICAgICBwYXJhbXMuZHRlc3QgPSBNYXRoLm1pbihwYXJhbXMuZHRlc3QsIHBhcmFtcy5kc2VwKTtcblxuICAgICAgICAvLyBOZWVkcyB0byBiZSBsZXNzIHRoYW4gY2lyY2xlam9pblxuICAgICAgICB0aGlzLmRjb2xsaWRlc2VsZlNxID0gKHBhcmFtcy5kY2lyY2xlam9pbiAvIDIpICoqIDI7XG4gICAgICAgIHRoaXMublN0cmVhbWxpbmVTdGVwID0gTWF0aC5mbG9vcihwYXJhbXMuZGNpcmNsZWpvaW4gLyBwYXJhbXMuZHN0ZXApO1xuICAgICAgICB0aGlzLm5TdHJlYW1saW5lTG9va0JhY2sgPSAyICogdGhpcy5uU3RyZWFtbGluZVN0ZXA7XG5cbiAgICAgICAgdGhpcy5tYWpvckdyaWQgPSBuZXcgR3JpZFN0b3JhZ2UodGhpcy53b3JsZERpbWVuc2lvbnMsIHRoaXMub3JpZ2luLCBwYXJhbXMuZHNlcCk7XG4gICAgICAgIHRoaXMubWlub3JHcmlkID0gbmV3IEdyaWRTdG9yYWdlKHRoaXMud29ybGREaW1lbnNpb25zLCB0aGlzLm9yaWdpbiwgcGFyYW1zLmRzZXApO1xuXG4gICAgICAgIHRoaXMuc2V0UGFyYW1zU3EoKTtcbiAgICB9XG5cbiAgICBjbGVhclN0cmVhbWxpbmVzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFsbFN0cmVhbWxpbmVzU2ltcGxlID0gW107XG4gICAgICAgIHRoaXMuc3RyZWFtbGluZXNNYWpvciA9IFtdO1xuICAgICAgICB0aGlzLnN0cmVhbWxpbmVzTWlub3IgPSBbXTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyBzdHJlYW1saW5lc1xuICAgICAqL1xuICAgIGpvaW5EYW5nbGluZ1N0cmVhbWxpbmVzKCk6IHZvaWQge1xuICAgICAgICAvLyBUT0RPIGRvIGluIHVwZGF0ZSBtZXRob2RcbiAgICAgICAgZm9yIChsZXQgbWFqb3Igb2YgW3RydWUsIGZhbHNlXSkge1xuICAgICAgICAgICAgZm9yIChsZXQgc3RyZWFtbGluZSBvZiB0aGlzLnN0cmVhbWxpbmVzKG1ham9yKSkge1xuICAgICAgICAgICAgICAgIC8vIElnbm9yZSBjaXJjbGVzXG4gICAgICAgICAgICAgICAgaWYgKHN0cmVhbWxpbmVbMF0uZXF1YWxzKHN0cmVhbWxpbmVbc3RyZWFtbGluZS5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgY29uc3QgbmV3U3RhcnQgPSB0aGlzLmdldEJlc3ROZXh0UG9pbnQoc3RyZWFtbGluZVswXSwgc3RyZWFtbGluZVs0XSwgc3RyZWFtbGluZSlcbiAgICAgICAgICAgICAgICBpZiAobmV3U3RhcnQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludHNCZXR3ZWVuKHN0cmVhbWxpbmVbMF0sIG5ld1N0YXJ0LCB0aGlzLnBhcmFtcy5kc3RlcCkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbWxpbmUudW5zaGlmdChwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZChtYWpvcikuYWRkU2FtcGxlKHApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtbGluZS51bnNoaWZ0KG5ld1N0YXJ0KTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICBjb25zdCBuZXdFbmQgPSB0aGlzLmdldEJlc3ROZXh0UG9pbnQoc3RyZWFtbGluZVtzdHJlYW1saW5lLmxlbmd0aCAtIDFdLCBzdHJlYW1saW5lW3N0cmVhbWxpbmUubGVuZ3RoIC0gNF0sIHN0cmVhbWxpbmUpO1xuICAgICAgICAgICAgICAgIGlmIChuZXdFbmQgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wb2ludHNCZXR3ZWVuKHN0cmVhbWxpbmVbc3RyZWFtbGluZS5sZW5ndGggLSAxXSwgbmV3RW5kLCB0aGlzLnBhcmFtcy5kc3RlcCkuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHN0cmVhbWxpbmUucHVzaChwKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuZ3JpZChtYWpvcikuYWRkU2FtcGxlKHApO1xuICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgc3RyZWFtbGluZS5wdXNoKG5ld0VuZCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgLy8gUmVzZXQgc2ltcGxpZmllZCBzdHJlYW1saW5lc1xuICAgICAgICB0aGlzLmFsbFN0cmVhbWxpbmVzU2ltcGxlID0gdGhpcy5hbGxTdHJlYW1saW5lcy5tYXAocyA9PiB0aGlzLnNpbXBsaWZ5U3RyZWFtbGluZShzKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogUmV0dXJucyBhcnJheSBvZiBwb2ludHMgZnJvbSB2MSB0byB2MiBzdWNoIHRoYXQgdGhleSBhcmUgc2VwYXJhdGVkIGJ5IGF0IG1vc3QgZHNlcFxuICAgICAqIG5vdCBpbmNsdWRpbmcgdjEgb3IgdjJcbiAgICAgKi9cbiAgICBwb2ludHNCZXR3ZWVuKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IsIGRzdGVwOiBudW1iZXIpOiBWZWN0b3JbXSB7XG4gICAgICAgIGNvbnN0IGQgPSB2MS5kaXN0YW5jZVRvKHYyKTtcbiAgICAgICAgY29uc3QgblBvaW50cyA9IE1hdGguZmxvb3IoZCAvIGRzdGVwKTtcbiAgICAgICAgaWYgKG5Qb2ludHMgPT09IDApIHJldHVybiBbXTtcblxuICAgICAgICBjb25zdCBzdGVwVmVjdG9yID0gdjIuY2xvbmUoKS5zdWIodjEpLnNldExlbmd0aChkc3RlcCk7XG4gICAgICAgIGNvbnN0IG91dCA9IFt2MS5jbG9uZSgpLmFkZChzdGVwVmVjdG9yKV07XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgblBvaW50czsgaSsrKSB7XG4gICAgICAgICAgICBvdXQucHVzaChvdXRbb3V0Lmxlbmd0aCAtIDFdLmNsb25lKCkuYWRkKHN0ZXBWZWN0b3IpKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gb3V0O1xuICAgIH1cblxuXG4gICAgLyoqXG4gICAgICogR2V0cyBuZXh0IGJlc3QgcG9pbnQgdG8gam9pbiBzdHJlYW1saW5lXG4gICAgICogcmV0dXJucyBudWxsIGlmIHRoZXJlIGFyZSBubyBnb29kIGNhbmRpZGF0ZXNcbiAgICAgKi9cbiAgICBnZXRCZXN0TmV4dFBvaW50KHBvaW50OiBWZWN0b3IsIHByZXZpb3VzUG9pbnQ6IFZlY3Rvciwgc3RyZWFtbGluZTogVmVjdG9yW10pOiBWZWN0b3Ige1xuICAgICAgICAvLyBPbmx5IGNvbnNpZGVyIHBvaW50cyBub3Qgb24gdGhlIGVkZ2VcbiAgICAgICAgaWYgKHBvaW50LnggPCB0aGlzLk5FQVJfRURHRSB8fCBwb2ludC54ID4gdGhpcy53b3JsZERpbWVuc2lvbnMueCAtIHRoaXMuTkVBUl9FREdFKSB7XG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmIChwb2ludC55IDwgdGhpcy5ORUFSX0VER0UgfHwgcG9pbnQueSA+IHRoaXMud29ybGREaW1lbnNpb25zLnkgLSB0aGlzLk5FQVJfRURHRSkge1xuICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBuZWFyYnlQb2ludHMgPSB0aGlzLm1ham9yR3JpZC5nZXROZWFyYnlQb2ludHMocG9pbnQsIHRoaXMucGFyYW1zLmRsb29rYWhlYWQpXG4gICAgICAgICAgICAuY29uY2F0KHRoaXMubWlub3JHcmlkLmdldE5lYXJieVBvaW50cyhwb2ludCwgdGhpcy5wYXJhbXMuZGxvb2thaGVhZCkpO1xuICAgICAgICBjb25zdCBkaXJlY3Rpb24gPSBwb2ludC5jbG9uZSgpLnN1YihwcmV2aW91c1BvaW50KTtcblxuICAgICAgICBsZXQgY2xvc2VzdFNhbXBsZSA9IG51bGw7XG4gICAgICAgIGxldCBjbG9zZXN0RGlzdGFuY2UgPSBJbmZpbml0eTtcblxuICAgICAgICBmb3IgKGxldCBzYW1wbGUgb2YgbmVhcmJ5UG9pbnRzKSB7XG4gICAgICAgICAgICBpZiAoIXNhbXBsZS5lcXVhbHMocG9pbnQpICYmICFzYW1wbGUuZXF1YWxzKHByZXZpb3VzUG9pbnQpICYmICFzdHJlYW1saW5lLmluY2x1ZGVzKHNhbXBsZSkpIHtcbiAgICAgICAgICAgICAgICBjb25zdCBkaWZmZXJlbmNlVmVjdG9yID0gc2FtcGxlLmNsb25lKCkuc3ViKHBvaW50KTtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBBY3V0ZSBhbmdsZSBiZXR3ZWVuIHZlY3RvcnMgKGFnbm9zdGljIG9mIENXLCBBQ1cpXG4gICAgICAgICAgICAgICAgY29uc3QgYW5nbGVCZXR3ZWVuID0gTWF0aC5hYnMoVmVjdG9yLmFuZ2xlQmV0d2VlbihkaXJlY3Rpb24sIGRpZmZlcmVuY2VWZWN0b3IpKTtcbiAgICAgICAgICAgICAgICBjb25zdCBkaXN0YW5jZVRvU2FtcGxlID0gcG9pbnQuZGlzdGFuY2VUb1NxdWFyZWQoc2FtcGxlKTtcblxuICAgICAgICAgICAgICAgIC8vIEZpbHRlciBieSBhbmdsZVxuICAgICAgICAgICAgICAgIGlmIChhbmdsZUJldHdlZW4gPCB0aGlzLnBhcmFtcy5qb2luYW5nbGUgJiYgZGlzdGFuY2VUb1NhbXBsZSA8IGNsb3Nlc3REaXN0YW5jZSkge1xuICAgICAgICAgICAgICAgICAgICBjbG9zZXN0RGlzdGFuY2UgPSBkaXN0YW5jZVRvU2FtcGxlO1xuICAgICAgICAgICAgICAgICAgICBjbG9zZXN0U2FtcGxlID0gc2FtcGxlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIFRPRE8gaWYgdHJ5aW5nIHRvIGZpbmQgaW50ZXJzZWN0aW9ucyBpbiB0aGUgc2ltcGxpZmllZCBncmFwaFxuICAgICAgICAvLyByZXR1cm4gY2xvc2VzdC5jbG9uZSgpLmFkZChkaXJlY3Rpb24gbGVuZ3RoIHNpbXBsaWZ5IHRvbGVyYW5jZSkpO1xuICAgICAgICAvLyB0byBwcmV2ZW50IGVuZHMgZ2V0dGluZyBwdWxsZWQgYXdheSBmcm9tIHNpbXBsaWZpZWQgbGluZXNcbiAgICAgICAgcmV0dXJuIGNsb3Nlc3RTYW1wbGU7XG4gICAgfVxuXG5cbiAgICAvKipcbiAgICAgKiBBc3N1bWVzIHMgaGFzIGFscmVhZHkgZ2VuZXJhdGVkXG4gICAgICovXG4gICAgYWRkRXhpc3RpbmdTdHJlYW1saW5lcyhzOiBTdHJlYW1saW5lR2VuZXJhdG9yKTogdm9pZCB7XG4gICAgICAgIHRoaXMubWFqb3JHcmlkLmFkZEFsbChzLm1ham9yR3JpZCk7XG4gICAgICAgIHRoaXMubWlub3JHcmlkLmFkZEFsbChzLm1pbm9yR3JpZCk7XG4gICAgfVxuXG4gICAgZ2V0IGFsbFN0cmVhbWxpbmVzKCk6IFZlY3RvcltdW10ge1xuICAgICAgICAvLyBDb21iaW5lXG4gICAgICAgIHJldHVybiB0aGlzLnN0cmVhbWxpbmVzTWFqb3IuY29uY2F0KHRoaXMuc3RyZWFtbGluZXNNaW5vcik7XG4gICAgfVxuXG4gICAgdXBkYXRlKCk6IHZvaWQge1xuICAgICAgICBpZiAoIXRoaXMuc3RyZWFtbGluZXNEb25lKSB7XG4gICAgICAgICAgICB0aGlzLmxhc3RTdHJlYW1saW5lTWFqb3IgPSAhdGhpcy5sYXN0U3RyZWFtbGluZU1ham9yO1xuICAgICAgICAgICAgaWYgKCF0aGlzLmNyZWF0ZVN0cmVhbWxpbmUodGhpcy5sYXN0U3RyZWFtbGluZU1ham9yKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3RyZWFtbGluZXNEb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFN0cmVhbWxpbmVzIGNyZWF0ZWQgZWFjaCBmcmFtZSAoYW5pbWF0ZWQpXG4gICAgICovXG4gICAgY3JlYXRlQWxsU3RyZWFtbGluZXNEeW5hbWljKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0cmVhbWxpbmVzRG9uZSA9IGZhbHNlO1xuICAgICAgICAvLyB0aGlzLmpvaW5EYW5nbGluZ1N0cmVhbWxpbmVzKCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxsIGF0IG9uY2UgLSB3aWxsIGZyZWV6ZSBpZiBkc2VwIHNtYWxsXG4gICAgICovXG4gICAgY3JlYXRlQWxsU3RyZWFtbGluZXMoKTogdm9pZCB7XG4gICAgICAgIGxldCBtYWpvciA9IHRydWU7XG4gICAgICAgIHdoaWxlICh0aGlzLmNyZWF0ZVN0cmVhbWxpbmUobWFqb3IpKSB7XG4gICAgICAgICAgICBtYWpvciA9ICFtYWpvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2ltcGxpZnlTdHJlYW1saW5lKHN0cmVhbWxpbmU6IFZlY3RvcltdKTogVmVjdG9yW10ge1xuICAgICAgICByZXR1cm4gc2ltcGxpZnkoc3RyZWFtbGluZSwgdGhpcy5wYXJhbXMuc2ltcGxpZnlUb2xlcmFuY2UpLm1hcChwb2ludCA9PiBuZXcgVmVjdG9yKHBvaW50LngsIHBvaW50LnkpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBGaW5kcyBzZWVkIGFuZCBjcmVhdGVzIGEgc3RyZWFtbGluZSBmcm9tIHRoYXQgcG9pbnRcbiAgICAgKiBQdXNoZXMgbmV3IGNhbmRpZGF0ZSBzZWVkcyB0byBxdWV1ZVxuICAgICAqIEByZXR1cm4ge1ZlY3RvcltdfSByZXR1cm5zIGZhbHNlIGlmIHNlZWQgaXNuJ3QgZm91bmQgd2l0aGluIHBhcmFtcy5zZWVkVHJpZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIGNyZWF0ZVN0cmVhbWxpbmUobWFqb3I6IGJvb2xlYW4pOiBib29sZWFuIHtcbiAgICAgICAgY29uc3Qgc2VlZCA9IHRoaXMuZ2V0U2VlZChtYWpvcik7XG4gICAgICAgIGlmIChzZWVkID09PSBudWxsKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RyZWFtbGluZSA9IHRoaXMuaW50ZWdyYXRlU3RyZWFtbGluZShzZWVkLCBtYWpvcik7XG4gICAgICAgIGlmICh0aGlzLnZhbGlkU3RyZWFtbGluZShzdHJlYW1saW5lKSkge1xuICAgICAgICAgICAgdGhpcy5ncmlkKG1ham9yKS5hZGRQb2x5bGluZShzdHJlYW1saW5lKTtcbiAgICAgICAgICAgIHRoaXMuc3RyZWFtbGluZXMobWFqb3IpLnB1c2goc3RyZWFtbGluZSk7XG5cbiAgICAgICAgICAgIHRoaXMuYWxsU3RyZWFtbGluZXNTaW1wbGUucHVzaCh0aGlzLnNpbXBsaWZ5U3RyZWFtbGluZShzdHJlYW1saW5lKSk7XG5cbiAgICAgICAgICAgIC8vIEFkZCBjYW5kaWRhdGUgc2VlZHNcbiAgICAgICAgICAgIGlmICghc3RyZWFtbGluZVswXS5lcXVhbHMoc3RyZWFtbGluZVtzdHJlYW1saW5lLmxlbmd0aCAtIDFdKSkge1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuZGlkYXRlU2VlZHMoIW1ham9yKS5wdXNoKHN0cmVhbWxpbmVbMF0pO1xuICAgICAgICAgICAgICAgIHRoaXMuY2FuZGlkYXRlU2VlZHMoIW1ham9yKS5wdXNoKHN0cmVhbWxpbmVbc3RyZWFtbGluZS5sZW5ndGggLSAxXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHZhbGlkU3RyZWFtbGluZShzOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gcy5sZW5ndGggPiA1O1xuICAgIH0gXG5cbiAgICBwcml2YXRlIHNldFBhcmFtc1NxKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnBhcmFtc1NxID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5wYXJhbXMpO1xuICAgICAgICBmb3IgKGxldCBwIGluIHRoaXMucGFyYW1zU3EpIHtcbiAgICAgICAgICAgIHRoaXMucGFyYW1zU3FbcF0gKj0gdGhpcy5wYXJhbXNTcVtwXTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHByaXZhdGUgc2FtcGxlUG9pbnQoKTogVmVjdG9yIHtcbiAgICAgICAgLy8gVE9ETyBiZXR0ZXIgc2VlZGluZyBzY2hlbWVcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogdGhpcy53b3JsZERpbWVuc2lvbnMueCxcbiAgICAgICAgICAgIE1hdGgucmFuZG9tKCkgKiB0aGlzLndvcmxkRGltZW5zaW9ucy55KVxuICAgICAgICAgICAgLmFkZCh0aGlzLm9yaWdpbik7XG4gICAgfVxuIFxuICAgIC8qKlxuICAgICAqIFRyaWVzIHRoaXMuY2FuZGlkYXRlU2VlZHMgZmlyc3QsIHRoZW4gc2FtcGxlcyB1c2luZyB0aGlzLnNhbXBsZVBvaW50XG4gICAgICovXG4gICAgcHJpdmF0ZSBnZXRTZWVkKG1ham9yOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgLy8gQ2FuZGlkYXRlIHNlZWRzIGZpcnN0XG4gICAgICAgIGlmICh0aGlzLlNFRURfQVRfRU5EUE9JTlRTICYmIHRoaXMuY2FuZGlkYXRlU2VlZHMobWFqb3IpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIHdoaWxlICh0aGlzLmNhbmRpZGF0ZVNlZWRzKG1ham9yKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgc2VlZCA9IHRoaXMuY2FuZGlkYXRlU2VlZHMobWFqb3IpLnBvcCgpO1xuICAgICAgICAgICAgICAgIGlmICh0aGlzLmdyaWQobWFqb3IpLmlzVmFsaWRTYW1wbGUoc2VlZCwgdGhpcy5wYXJhbXNTcS5kc2VwKSkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gc2VlZDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgc2VlZCA9IHRoaXMuc2FtcGxlUG9pbnQoKTtcbiAgICAgICAgbGV0IGkgPSAwO1xuICAgICAgICB3aGlsZSAoIXRoaXMuZ3JpZChtYWpvcikuaXNWYWxpZFNhbXBsZShzZWVkLCB0aGlzLnBhcmFtc1NxLmRzZXApKSB7XG4gICAgICAgICAgICBpZiAoaSA+PSB0aGlzLnBhcmFtcy5zZWVkVHJpZXMpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHNlZWQgPSB0aGlzLnNhbXBsZVBvaW50KCk7XG4gICAgICAgICAgICBpKys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gc2VlZDtcbiAgICB9XG5cbiAgICAvLyBUT0RPIGVudW0gdG8gcmVtb3ZlIHRoZXNlIGZ1bmN0aW9uc1xuICAgIHByaXZhdGUgY2FuZGlkYXRlU2VlZHMobWFqb3I6IGJvb2xlYW4pOiBWZWN0b3JbXSB7XG4gICAgICAgIHJldHVybiBtYWpvciA/IHRoaXMuY2FuZGlkYXRlU2VlZHNNYWpvciA6IHRoaXMuY2FuZGlkYXRlU2VlZHNNaW5vcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIHN0cmVhbWxpbmVzKG1ham9yOiBib29sZWFuKTogVmVjdG9yW11bXSB7XG4gICAgICAgIHJldHVybiBtYWpvciA/IHRoaXMuc3RyZWFtbGluZXNNYWpvciA6IHRoaXMuc3RyZWFtbGluZXNNaW5vcjtcbiAgICB9XG5cbiAgICBwcml2YXRlIGdyaWQobWFqb3I6IGJvb2xlYW4pOiBHcmlkU3RvcmFnZSB7XG4gICAgICAgIHJldHVybiBtYWpvciA/IHRoaXMubWFqb3JHcmlkIDogdGhpcy5taW5vckdyaWQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBwb2ludEluQm91bmRzKHY6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKHYueCA+PSB0aGlzLm9yaWdpbi54XG4gICAgICAgICAgICAmJiB2LnkgPj0gdGhpcy5vcmlnaW4ueVxuICAgICAgICAgICAgJiYgdi54IDwgdGhpcy53b3JsZERpbWVuc2lvbnMueCArIHRoaXMub3JpZ2luLnhcbiAgICAgICAgICAgICYmIHYueSA8IHRoaXMud29ybGREaW1lbnNpb25zLnkgKyB0aGlzLm9yaWdpbi55XG4gICAgICAgICk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRGlkbid0IGVuZCB1cCB1c2luZyAtIGJpdCBleHBlbnNpdmUsIHVzZWQgc3RyZWFtbGluZVR1cm5lZCBpbnN0ZWFkXG4gICAgICogU3RvcHMgc3BpcmFscyBmcm9tIGZvcm1pbmdcbiAgICAgKiB1c2VzIDAuNSBkY2lyY2xlam9pbiBzbyB0aGF0IGNpcmNsZXMgYXJlIHN0aWxsIGpvaW5lZCB1cFxuICAgICAqIHRlc3RTYW1wbGUgaXMgY2FuZGlkYXRlIHRvIHB1c2hlZCBvbiBlbmQgb2Ygc3RyZWFtbGluZUZvcndhcmRzXG4gICAgICogcmV0dXJucyB0cnVlIGlmIHN0cmVhbWxpbmUgY29sbGlkZXMgd2l0aCBpdHNlbGZcbiAgICAgKi9cbiAgICBwcml2YXRlIGRvZXNTdHJlYW1saW5lQ29sbGlkZVNlbGYodGVzdFNhbXBsZTogVmVjdG9yLCBzdHJlYW1saW5lRm9yd2FyZHM6IFZlY3RvcltdLCBzdHJlYW1saW5lQmFja3dhcmRzOiBWZWN0b3JbXSk6IGJvb2xlYW4ge1xuICAgICAgICAvLyBTdHJlYW1saW5lIGxvbmcgZW5vdWdoXG4gICAgICAgIGlmIChzdHJlYW1saW5lRm9yd2FyZHMubGVuZ3RoID4gdGhpcy5uU3RyZWFtbGluZUxvb2tCYWNrKSB7XG4gICAgICAgICAgICAvLyBGb3J3YXJkcyBjaGVja1xuICAgICAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBzdHJlYW1saW5lRm9yd2FyZHMubGVuZ3RoIC0gdGhpcy5uU3RyZWFtbGluZUxvb2tCYWNrOyBpICs9IHRoaXMublN0cmVhbWxpbmVTdGVwKSB7XG4gICAgICAgICAgICAgICAgaWYgKHRlc3RTYW1wbGUuZGlzdGFuY2VUb1NxdWFyZWQoc3RyZWFtbGluZUZvcndhcmRzW2ldKSA8IHRoaXMuZGNvbGxpZGVzZWxmU3EpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBCYWNrd2FyZHMgY2hlY2tcbiAgICAgICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3RyZWFtbGluZUJhY2t3YXJkcy5sZW5ndGg7IGkgKz0gdGhpcy5uU3RyZWFtbGluZVN0ZXApIHtcbiAgICAgICAgICAgICAgICBpZiAodGVzdFNhbXBsZS5kaXN0YW5jZVRvU3F1YXJlZChzdHJlYW1saW5lQmFja3dhcmRzW2ldKSA8IHRoaXMuZGNvbGxpZGVzZWxmU3EpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgc3RyZWFtbGluZSBoYXMgdHVybmVkIHRocm91Z2ggZ3JlYXRlciB0aGFuIDE4MCBkZWdyZWVzXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdHJlYW1saW5lVHVybmVkKHNlZWQ6IFZlY3Rvciwgb3JpZ2luYWxEaXI6IFZlY3RvciwgcG9pbnQ6IFZlY3RvciwgZGlyZWN0aW9uOiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgaWYgKG9yaWdpbmFsRGlyLmRvdChkaXJlY3Rpb24pIDwgMCkge1xuICAgICAgICAgICAgLy8gVE9ETyBvcHRpbWlzZVxuICAgICAgICAgICAgY29uc3QgcGVycGVuZGljdWxhclZlY3RvciA9IG5ldyBWZWN0b3Iob3JpZ2luYWxEaXIueSwgLW9yaWdpbmFsRGlyLngpO1xuICAgICAgICAgICAgY29uc3QgaXNMZWZ0ID0gcG9pbnQuY2xvbmUoKS5zdWIoc2VlZCkuZG90KHBlcnBlbmRpY3VsYXJWZWN0b3IpIDwgMDtcbiAgICAgICAgICAgIGNvbnN0IGRpcmVjdGlvblVwID0gZGlyZWN0aW9uLmRvdChwZXJwZW5kaWN1bGFyVmVjdG9yKSA+IDA7XG4gICAgICAgICAgICByZXR1cm4gaXNMZWZ0ID09PSBkaXJlY3Rpb25VcDtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAvLyBUT0RPIHRoaXMgZG9lc24ndCB3b3JrIHdlbGwgLSBjb25zaWRlciBzb21ldGhpbmcgZGlzYWxsb3dpbmcgb25lIGRpcmVjdGlvbiAoRi9CKSB0byB0dXJuIG1vcmUgdGhhbiAxODAgZGVnXG4gICAgICogT25lIHN0ZXAgb2YgdGhlIHN0cmVhbWxpbmUgaW50ZWdyYXRpb24gcHJvY2Vzc1xuICAgICAqL1xuICAgIHByaXZhdGUgc3RyZWFtbGluZUludGVncmF0aW9uU3RlcChwYXJhbXM6IFN0cmVhbWxpbmVJbnRlZ3JhdGlvbiwgbWFqb3I6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgaWYgKHBhcmFtcy52YWxpZCkge1xuICAgICAgICAgICAgcGFyYW1zLnN0cmVhbWxpbmUucHVzaChwYXJhbXMucHJldmlvdXNQb2ludCk7XG4gICAgICAgICAgICBjb25zdCBuZXh0RGlyZWN0aW9uID0gdGhpcy5pbnRlZ3JhdG9yLmludGVncmF0ZShwYXJhbXMucHJldmlvdXNQb2ludCwgbWFqb3IpO1xuXG4gICAgICAgICAgICAvLyBNYWtlIHN1cmUgd2UgdHJhdmVsIGluIHRoZSBzYW1lIGRpcmVjdGlvblxuICAgICAgICAgICAgaWYgKG5leHREaXJlY3Rpb24uZG90KHBhcmFtcy5wcmV2aW91c0RpcmVjdGlvbikgPCAwKSB7XG4gICAgICAgICAgICAgICAgbmV4dERpcmVjdGlvbi5uZWdhdGUoKTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY29uc3QgbmV4dFBvaW50ID0gcGFyYW1zLnByZXZpb3VzUG9pbnQuY2xvbmUoKS5hZGQobmV4dERpcmVjdGlvbik7XG5cbiAgICAgICAgICAgIC8vIFZpc3VhbGlzZSBzdG9wcGluZyBwb2ludHNcbiAgICAgICAgICAgIC8vIGlmICh0aGlzLnN0cmVhbWxpbmVUdXJuZWQocGFyYW1zLnNlZWQsIHBhcmFtcy5vcmlnaW5hbERpciwgbmV4dFBvaW50LCBuZXh0RGlyZWN0aW9uKSkge1xuICAgICAgICAgICAgLy8gICAgIHBhcmFtcy52YWxpZCA9IGZhbHNlO1xuICAgICAgICAgICAgLy8gICAgIHBhcmFtcy5zdHJlYW1saW5lLnB1c2goVmVjdG9yLnplcm9WZWN0b3IoKSk7XG4gICAgICAgICAgICAvLyB9XG5cbiAgICAgICAgICAgIGlmICh0aGlzLnBvaW50SW5Cb3VuZHMobmV4dFBvaW50KVxuICAgICAgICAgICAgICAgICYmIHRoaXMuZ3JpZChtYWpvcikuaXNWYWxpZFNhbXBsZShuZXh0UG9pbnQsIHRoaXMucGFyYW1zU3EuZHRlc3QpXG4gICAgICAgICAgICAgICAgJiYgIXRoaXMuc3RyZWFtbGluZVR1cm5lZChwYXJhbXMuc2VlZCwgcGFyYW1zLm9yaWdpbmFsRGlyLCBuZXh0UG9pbnQsIG5leHREaXJlY3Rpb24pKSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnByZXZpb3VzUG9pbnQgPSBuZXh0UG9pbnQ7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnByZXZpb3VzRGlyZWN0aW9uID0gbmV4dERpcmVjdGlvbjtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgcGFyYW1zLnZhbGlkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBCeSBzaW11bHRhbmVvdXNseSBpbnRlZ3JhdGluZyBpbiBib3RoIGRpcmVjdGlvbnMgd2UgcmVkdWNlIHRoZSBpbXBhY3Qgb2YgY2lyY2xlcyBub3Qgam9pbmluZ1xuICAgICAqIHVwIGFzIHRoZSBlcnJvciBtYXRjaGVzIGF0IHRoZSBqb2luXG4gICAgICovXG4gICAgcHJpdmF0ZSBpbnRlZ3JhdGVTdHJlYW1saW5lKHNlZWQ6IFZlY3RvciwgbWFqb3I6IGJvb2xlYW4pOiBWZWN0b3JbXSB7XG4gICAgICAgIGxldCBjb3VudCA9IDA7XG4gICAgICAgIGxldCBwb2ludHNFc2NhcGVkID0gZmFsc2U7ICAvLyBUcnVlIG9uY2UgdHdvIGludGVncmF0aW9uIGZyb250cyBoYXZlIG1vdmVkIGRsb29rYWhlYWQgYXdheVxuXG4gICAgICAgIGNvbnN0IGQgPSB0aGlzLmludGVncmF0b3IuaW50ZWdyYXRlKHNlZWQsIG1ham9yKTtcblxuICAgICAgICBjb25zdCBmb3J3YXJkUGFyYW1zOiBTdHJlYW1saW5lSW50ZWdyYXRpb24gPSB7XG4gICAgICAgICAgICBzZWVkOiBzZWVkLFxuICAgICAgICAgICAgb3JpZ2luYWxEaXI6IGQsXG4gICAgICAgICAgICBzdHJlYW1saW5lOiBbc2VlZF0sXG4gICAgICAgICAgICBwcmV2aW91c0RpcmVjdGlvbjogZCxcbiAgICAgICAgICAgIHByZXZpb3VzUG9pbnQ6IHNlZWQuY2xvbmUoKS5hZGQoZCksXG4gICAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgfVxuXG4gICAgICAgIGZvcndhcmRQYXJhbXMudmFsaWQgPSB0aGlzLnBvaW50SW5Cb3VuZHMoZm9yd2FyZFBhcmFtcy5wcmV2aW91c1BvaW50KTtcblxuICAgICAgICBjb25zdCBuZWdEID0gZC5jbG9uZSgpLm5lZ2F0ZSgpO1xuICAgICAgICBjb25zdCBiYWNrd2FyZFBhcmFtczogU3RyZWFtbGluZUludGVncmF0aW9uID0ge1xuICAgICAgICAgICAgc2VlZDogc2VlZCxcbiAgICAgICAgICAgIG9yaWdpbmFsRGlyOiBuZWdELFxuICAgICAgICAgICAgc3RyZWFtbGluZTogW10sXG4gICAgICAgICAgICBwcmV2aW91c0RpcmVjdGlvbjogbmVnRCxcbiAgICAgICAgICAgIHByZXZpb3VzUG9pbnQ6IHNlZWQuY2xvbmUoKS5hZGQobmVnRCksXG4gICAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgfVxuXG4gICAgICAgIGJhY2t3YXJkUGFyYW1zLnZhbGlkID0gdGhpcy5wb2ludEluQm91bmRzKGJhY2t3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuXG4gICAgICAgIHdoaWxlIChjb3VudCA8IHRoaXMucGFyYW1zLnBhdGhJdGVyYXRpb25zICYmIChmb3J3YXJkUGFyYW1zLnZhbGlkIHx8IGJhY2t3YXJkUGFyYW1zLnZhbGlkKSkge1xuICAgICAgICAgICAgdGhpcy5zdHJlYW1saW5lSW50ZWdyYXRpb25TdGVwKGZvcndhcmRQYXJhbXMsIG1ham9yKTtcbiAgICAgICAgICAgIHRoaXMuc3RyZWFtbGluZUludGVncmF0aW9uU3RlcChiYWNrd2FyZFBhcmFtcywgbWFqb3IpO1xuXG4gICAgICAgICAgICAvLyBKb2luIHVwIGNpcmNsZXNcbiAgICAgICAgICAgIGNvbnN0IHNxRGlzdGFuY2VCZXR3ZWVuUG9pbnRzID0gZm9yd2FyZFBhcmFtcy5wcmV2aW91c1BvaW50LmRpc3RhbmNlVG9TcXVhcmVkKGJhY2t3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuXG4gICAgICAgICAgICBpZiAoIXBvaW50c0VzY2FwZWQgJiYgc3FEaXN0YW5jZUJldHdlZW5Qb2ludHMgPiB0aGlzLnBhcmFtc1NxLmRjaXJjbGVqb2luKSB7XG4gICAgICAgICAgICAgICAgcG9pbnRzRXNjYXBlZCA9IHRydWU7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmIChwb2ludHNFc2NhcGVkICYmIHNxRGlzdGFuY2VCZXR3ZWVuUG9pbnRzIDw9IHRoaXMucGFyYW1zU3EuZGNpcmNsZWpvaW4pIHtcbiAgICAgICAgICAgICAgICBmb3J3YXJkUGFyYW1zLnN0cmVhbWxpbmUucHVzaChmb3J3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuICAgICAgICAgICAgICAgIGZvcndhcmRQYXJhbXMuc3RyZWFtbGluZS5wdXNoKGJhY2t3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuICAgICAgICAgICAgICAgIGJhY2t3YXJkUGFyYW1zLnN0cmVhbWxpbmUucHVzaChiYWNrd2FyZFBhcmFtcy5wcmV2aW91c1BvaW50KTtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgY291bnQrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBiYWNrd2FyZFBhcmFtcy5zdHJlYW1saW5lLnJldmVyc2UoKS5jb25jYXQoZm9yd2FyZFBhcmFtcy5zdHJlYW1saW5lKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgVmVjdG9yIGZyb20gJy4uL3ZlY3Rvcic7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbnNvciB7XG4gICAgcHJpdmF0ZSBvbGRUaGV0YTogYm9vbGVhbjtcbiAgICBwcml2YXRlIF90aGV0YTogbnVtYmVyO1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSByOiBudW1iZXIsIHByaXZhdGUgbWF0cml4OiBudW1iZXJbXSkge1xuICAgICAgICAvLyBNYXRyaXggaXMgMiBlbGVtZW50IGxpc3RcbiAgICAgICAgLy8gWyAwLCAxXG4gICAgICAgIC8vICAgMSwgLTAgXVxuICAgICAgICB0aGlzLm9sZFRoZXRhID0gZmFsc2U7XG4gICAgICAgIHRoaXMuX3RoZXRhID0gdGhpcy5jYWxjdWxhdGVUaGV0YSgpO1xuICAgIH1cblxuICAgIGdldCB0aGV0YSgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5vbGRUaGV0YSkge1xuICAgICAgICAgICAgdGhpcy5fdGhldGEgPSB0aGlzLmNhbGN1bGF0ZVRoZXRhKCk7XG4gICAgICAgICAgICB0aGlzLm9sZFRoZXRhID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdGhpcy5fdGhldGE7XG4gICAgfVxuXG4gICAgYWRkKHRlbnNvcjogVGVuc29yKTogVGVuc29yIHtcbiAgICAgICAgdGhpcy5tYXRyaXggPSB0aGlzLm1hdHJpeC5tYXAoKHYsIGkpID0+IHYgKiB0aGlzLnIgKyB0ZW5zb3IubWF0cml4W2ldICogdGVuc29yLnIpO1xuICAgICAgICB0aGlzLnIgPSAyO1xuICAgICAgICB0aGlzLm9sZFRoZXRhID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2NhbGUoczogbnVtYmVyKTogVGVuc29yIHtcbiAgICAgICAgdGhpcy5yICo9IHM7XG4gICAgICAgIHRoaXMub2xkVGhldGEgPSB0cnVlO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBnZXRNYWpvcigpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihNYXRoLmNvcyh0aGlzLnRoZXRhKSwgTWF0aC5zaW4odGhpcy50aGV0YSkpO1xuICAgIH1cblxuICAgIGdldE1pbm9yKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IGFuZ2xlID0gdGhpcy50aGV0YSArIE1hdGguUEkgLyAyO1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihNYXRoLmNvcyhhbmdsZSksIE1hdGguc2luKGFuZ2xlKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBjYWxjdWxhdGVUaGV0YSgpOiBudW1iZXIge1xuICAgICAgICBpZiAodGhpcy5yID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gMDtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLm1hdHJpeFsxXSAvIHRoaXMuciwgdGhpcy5tYXRyaXhbMF0gLyB0aGlzLnIpIC8gMjtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IFRlbnNvciBmcm9tICcuL3RlbnNvcic7XG5pbXBvcnQgVmVjdG9yIGZyb20gJy4uL3ZlY3Rvcic7XG5pbXBvcnQge0dyaWQsIFJhZGlhbCwgQmFzaXNGaWVsZH0gZnJvbSAnLi9iYXNpc19maWVsZCc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFRlbnNvckZpZWxkIHtcbiAgICBwcml2YXRlIGJhc2lzRmllbGRzOiBCYXNpc0ZpZWxkW10gPSBbXTtcblxuICAgIGFkZEdyaWQoY2VudHJlOiBWZWN0b3IsIHNpemU6IG51bWJlciwgZGVjYXk6IG51bWJlciwgdGhldGE6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCBncmlkID0gbmV3IEdyaWQoY2VudHJlLCBzaXplLCBkZWNheSwgdGhldGEpO1xuICAgICAgICB0aGlzLmFkZEZpZWxkKGdyaWQpO1xuICAgIH1cblxuICAgIGFkZFJhZGlhbChjZW50cmU6IFZlY3Rvciwgc2l6ZTogbnVtYmVyLCBkZWNheTogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHJhZGlhbCA9IG5ldyBSYWRpYWwoY2VudHJlLCBzaXplLCBkZWNheSk7XG4gICAgICAgIHRoaXMuYWRkRmllbGQocmFkaWFsKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkRmllbGQoZmllbGQ6IEJhc2lzRmllbGQpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5iYXNpc0ZpZWxkcy5wdXNoKGZpZWxkKTtcbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgcmVtb3ZlRmllbGQoZmllbGQ6IEJhc2lzRmllbGQpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmJhc2lzRmllbGRzLmluZGV4T2YoZmllbGQpO1xuICAgICAgICBpZiAoaW5kZXggPiAtMSkge1xuICAgICAgICAgICAgdGhpcy5iYXNpc0ZpZWxkcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmVzZXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYmFzaXNGaWVsZHMgPSBbXTtcbiAgICB9XG5cbiAgICBnZXRDZW50cmVQb2ludHMoKTogVmVjdG9yW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpc0ZpZWxkcy5tYXAoZmllbGQgPT4gZmllbGQuY2VudHJlKTtcbiAgICB9XG5cbiAgICBzYW1wbGVQb2ludChwb2ludDogVmVjdG9yKTogVGVuc29yIHtcbiAgICAgICAgLy8gRGVmYXVsdCBmaWVsZCBpcyBhIGdyaWRcbiAgICAgICAgaWYgKHRoaXMuYmFzaXNGaWVsZHMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gbmV3IFRlbnNvcigxLCBbMCwgMF0pO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgdGVuc29yQWNjID0gbmV3IFRlbnNvcigwLCBbMCwgMF0pO1xuICAgICAgICB0aGlzLmJhc2lzRmllbGRzLmZvckVhY2goZmllbGQgPT4gdGVuc29yQWNjLmFkZChmaWVsZC5nZXRXZWlnaHRlZFRlbnNvcihwb2ludCkpKTtcbiAgICAgICAgcmV0dXJuIHRlbnNvckFjYztcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi92ZWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDYW52YXNXcmFwcGVyIHtcbiAgICBwcml2YXRlIGN0eDogQ2FudmFzUmVuZGVyaW5nQ29udGV4dDJEO1xuICAgIHByaXZhdGUgX3dpZHRoOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBfaGVpZ2h0OiBudW1iZXI7XG4gICAgXG4gICAgY29uc3RydWN0b3IoY2FudmFzOiBIVE1MQ2FudmFzRWxlbWVudCwgcHJpdmF0ZSBfc2NhbGU9MSwgcmVzaXplVG9XaW5kb3c9dHJ1ZSkge1xuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMuc2V0RGltZW5zaW9ucygpO1xuICAgICAgICB0aGlzLnJlc2l6ZUNhbnZhcygpO1xuXG4gICAgICAgIGlmIChyZXNpemVUb1dpbmRvdykge1xuICAgICAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpOiB2b2lkID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldERpbWVuc2lvbnMoKTtcbiAgICAgICAgICAgICAgICB0aGlzLnJlc2l6ZUNhbnZhcygpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnNldEZpbGxTdHlsZSgnYmxhY2snKTtcbiAgICAgICAgdGhpcy5jbGVhckNhbnZhcygpO1xuICAgIH1cblxuICAgIHNldERpbWVuc2lvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3dpZHRoID0gd2luZG93LmlubmVyV2lkdGggKiB0aGlzLl9zY2FsZTtcbiAgICAgICAgdGhpcy5faGVpZ2h0ID0gd2luZG93LmlubmVySGVpZ2h0ICogdGhpcy5fc2NhbGU7XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgZ2V0IGNhbnZhc1NjYWxlKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9zY2FsZTtcbiAgICB9XG5cbiAgICBzZXQgY2FudmFzU2NhbGUoczogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3NjYWxlID0gcztcbiAgICAgICAgdGhpcy5zZXREaW1lbnNpb25zKCk7XG4gICAgICAgIHRoaXMucmVzaXplQ2FudmFzKCk7XG4gICAgfSBcblxuICAgIHNldEZpbGxTdHlsZShjb2xvdXI6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5maWxsU3R5bGUgPSBjb2xvdXI7XG4gICAgfVxuXG4gICAgY2xlYXJDYW52YXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZHJhd1JlY3RhbmdsZSgwLCAwLCB3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICB9XG5cbiAgICBkcmF3UmVjdGFuZ2xlKHg6IG51bWJlciwgeTogbnVtYmVyLCB3aWR0aDogbnVtYmVyLCBoZWlnaHQ6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5fc2NhbGUgIT09IDEpIHtcbiAgICAgICAgICAgIHggKj0gdGhpcy5fc2NhbGU7XG4gICAgICAgICAgICB5ICo9IHRoaXMuX3NjYWxlO1xuICAgICAgICAgICAgd2lkdGggKj0gdGhpcy5fc2NhbGU7XG4gICAgICAgICAgICBoZWlnaHQgKj0gdGhpcy5fc2NhbGU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jdHguZmlsbFJlY3QoeCwgeSwgd2lkdGgsIGhlaWdodCk7XG4gICAgfVxuXG4gICAgZHJhd1NxdWFyZShjZW50cmU6IFZlY3RvciwgcmFkaXVzOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5kcmF3UmVjdGFuZ2xlKGNlbnRyZS54IC0gcmFkaXVzLCBjZW50cmUueSAtIHJhZGl1cywgMiAqIHJhZGl1cywgMiAqIHJhZGl1cyk7XG4gICAgfVxuXG4gICAgc2V0TGluZVdpZHRoKHdpZHRoOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuX3NjYWxlICE9PSAxKSB7XG4gICAgICAgICAgICB3aWR0aCAqPSB0aGlzLl9zY2FsZTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN0eC5saW5lV2lkdGggPSB3aWR0aDtcbiAgICB9XG5cbiAgICBzZXRTdHJva2VTdHlsZShjb2xvdXI6IHN0cmluZyk6IHZvaWQge1xuICAgICAgICB0aGlzLmN0eC5zdHJva2VTdHlsZSA9IGNvbG91cjtcbiAgICB9XG5cbiAgICBkcmF3UG9seWxpbmUobGluZTogVmVjdG9yW10pOiB2b2lkIHtcbiAgICAgICAgaWYgKGxpbmUubGVuZ3RoIDwgMikge1xuICAgICAgICAgICAgbG9nLndhcm4oXCJUcmllZCB0byBkcmF3IHBhdGggb2YgbGVuZ3RoIDwgMlwiKTtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmICh0aGlzLl9zY2FsZSAhPT0gMSkge1xuICAgICAgICAgICAgbGluZSA9IGxpbmUubWFwKHYgPT4gdi5jbG9uZSgpLm11bHRpcGx5U2NhbGFyKHRoaXMuX3NjYWxlKSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN0eC5iZWdpblBhdGgoKTtcbiAgICAgICAgdGhpcy5jdHgubW92ZVRvKGxpbmVbMF0ueCwgbGluZVswXS55KTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMTsgaSA8IGxpbmUubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIHRoaXMuY3R4LmxpbmVUbyhsaW5lW2ldLngsIGxpbmVbaV0ueSk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmN0eC5zdHJva2UoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIHJlc2l6ZUNhbnZhcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5jdHguY2FudmFzLndpZHRoID0gdGhpcy5fd2lkdGg7XG4gICAgICAgIHRoaXMuY3R4LmNhbnZhcy5oZWlnaHQgPSB0aGlzLl9oZWlnaHQ7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi4vdmVjdG9yJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwuanMnO1xuXG4vKipcbiAqIFNpbmdsZXRvblxuICogQ29udHJvbHMgcGFubmluZyBhbmQgem9vbWluZ1xuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBEb21haW5Db250cm9sbGVyIHtcbiAgICBwcml2YXRlIHN0YXRpYyBpbnN0YW5jZTogRG9tYWluQ29udHJvbGxlcjtcblxuICAgIHByaXZhdGUgcmVhZG9ubHkgWk9PTV9TUEVFRCA9IDAuOTY7XG5cbiAgICAvLyBMb2NhdGlvbiBvZiBzY3JlZW4gb3JpZ2luIGluIHdvcmxkIHNwYWNlXG4gICAgcHJpdmF0ZSBfb3JpZ2luOiBWZWN0b3IgPSBWZWN0b3IuemVyb1ZlY3RvcigpO1xuICAgIFxuICAgIC8vIFNjcmVlbi1zcGFjZSB3aWR0aCBhbmQgaGVpZ2h0XG4gICAgcHJpdmF0ZSBfc2NyZWVuRGltZW5zaW9ucyA9IFZlY3Rvci56ZXJvVmVjdG9yKCk7XG5cbiAgICAvLyBSYXRpbyBvZiBzY3JlZW4gcGl4ZWxzIHRvIHdvcmxkIHBpeGVsc1xuICAgIHByaXZhdGUgX3pvb206IG51bWJlciA9IDE7XG4gICAgcHJpdmF0ZSB6b29tQ2FsbGJhY2s6ICgpID0+IGFueSA9ICgpID0+IHt9O1xuXG4gICAgcHJpdmF0ZSBjb25zdHJ1Y3RvcigpIHtcbiAgICAgICAgdGhpcy5zZXRTY3JlZW5EaW1lbnNpb25zKCk7XG5cbiAgICAgICAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ3Jlc2l6ZScsICgpOiB2b2lkID0+IHRoaXMuc2V0U2NyZWVuRGltZW5zaW9ucygpKTtcblxuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignd2hlZWwnLCAoZTogYW55KTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBkZWx0YTogbnVtYmVyID0gZS5kZWx0YVk7XG4gICAgICAgICAgICAvLyBUT0RPIHNjYWxlIGJ5IHZhbHVlIG9mIGRlbHRhXG4gICAgICAgICAgICBpZiAoZGVsdGEgPiAwKSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b29tID0gdGhpcy5fem9vbSAqIHRoaXMuWk9PTV9TUEVFRDtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgdGhpcy56b29tID0gdGhpcy5fem9vbSAvIHRoaXMuWk9PTV9TUEVFRDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICB9XG5cbiAgICBwcml2YXRlIHNldFNjcmVlbkRpbWVuc2lvbnMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX3NjcmVlbkRpbWVuc2lvbnMuc2V0WCh3aW5kb3cuaW5uZXJXaWR0aCk7XG4gICAgICAgIHRoaXMuX3NjcmVlbkRpbWVuc2lvbnMuc2V0WSh3aW5kb3cuaW5uZXJIZWlnaHQpO1xuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2UoKTogRG9tYWluQ29udHJvbGxlciB7XG4gICAgICAgIGlmICghRG9tYWluQ29udHJvbGxlci5pbnN0YW5jZSkge1xuICAgICAgICAgICAgRG9tYWluQ29udHJvbGxlci5pbnN0YW5jZSA9IG5ldyBEb21haW5Db250cm9sbGVyKCk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIERvbWFpbkNvbnRyb2xsZXIuaW5zdGFuY2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHtWZWN0b3J9IGRlbHRhIGluIHdvcmxkIHNwYWNlXG4gICAgICovXG4gICAgcGFuKGRlbHRhOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5fb3JpZ2luLnN1YihkZWx0YSk7XG4gICAgfVxuXG4gICAgZ2V0IG9yaWdpbigpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5fb3JpZ2luLmNsb25lKCk7XG4gICAgfVxuXG4gICAgZ2V0IHpvb20oKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3pvb207XG4gICAgfVxuXG4gICAgZ2V0IHNjcmVlbkRpbWVuc2lvbnMoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX3NjcmVlbkRpbWVuc2lvbnMuY2xvbmUoKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtWZWN0b3J9IHdvcmxkLXNwYWNlIHcvaCB2aXNpYmxlIG9uIHNjcmVlblxuICAgICAqL1xuICAgIGdldCB3b3JsZERpbWVuc2lvbnMoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2NyZWVuRGltZW5zaW9ucy5kaXZpZGVTY2FsYXIodGhpcy5fem9vbSk7XG4gICAgfVxuXG4gICAgc2V0IHNjcmVlbkRpbWVuc2lvbnModjogVmVjdG9yKSB7XG4gICAgICAgIHRoaXMuX3NjcmVlbkRpbWVuc2lvbnMuY29weSh2KTtcbiAgICB9XG5cbiAgICBzZXQgem9vbSh6OiBudW1iZXIpIHtcbiAgICAgICAgaWYgKHogPiAwKSB7XG4gICAgICAgICAgICBjb25zdCBvbGRXb3JsZFNwYWNlTWlkcG9pbnQgPSB0aGlzLm9yaWdpbi5hZGQodGhpcy53b3JsZERpbWVuc2lvbnMuZGl2aWRlU2NhbGFyKDIpKTtcbiAgICAgICAgICAgIHRoaXMuX3pvb20gPSB6O1xuICAgICAgICAgICAgY29uc3QgbmV3V29ybGRTcGFjZU1pZHBvaW50ID0gdGhpcy5vcmlnaW4uYWRkKHRoaXMud29ybGREaW1lbnNpb25zLmRpdmlkZVNjYWxhcigyKSk7XG4gICAgICAgICAgICB0aGlzLnBhbihuZXdXb3JsZFNwYWNlTWlkcG9pbnQuc3ViKG9sZFdvcmxkU3BhY2VNaWRwb2ludCkpO1xuICAgICAgICAgICAgdGhpcy56b29tQ2FsbGJhY2soKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHNldFpvb21VcGRhdGUoY2FsbGJhY2s6ICgpID0+IGFueSk6IHZvaWQge1xuICAgICAgICB0aGlzLnpvb21DYWxsYmFjayA9IGNhbGxiYWNrO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVkaXRzIHZlY3RvclxuICAgICAqL1xuICAgIHpvb21Ub1dvcmxkKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB2LmRpdmlkZVNjYWxhcih0aGlzLl96b29tKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyB2ZWN0b3JcbiAgICAgKi9cbiAgICB6b29tVG9TY3JlZW4odjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHYubXVsdGlwbHlTY2FsYXIodGhpcy5fem9vbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRWRpdHMgdmVjdG9yXG4gICAgICovXG4gICAgc2NyZWVuVG9Xb3JsZCh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy56b29tVG9Xb3JsZCh2KS5hZGQodGhpcy5fb3JpZ2luKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyB2ZWN0b3JcbiAgICAgKi9cbiAgICB3b3JsZFRvU2NyZWVuKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLnpvb21Ub1NjcmVlbih2LnN1Yih0aGlzLl9vcmlnaW4pKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IGludGVyYWN0IGZyb20gJ2ludGVyYWN0anMnO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgVmVjdG9yIGZyb20gJy4uL1ZlY3Rvcic7XG5pbXBvcnQgRG9tYWluQ29udHJvbGxlciBmcm9tICcuL2RvbWFpbl9jb250cm9sbGVyJztcblxuaW50ZXJmYWNlIERyYWdnYWJsZSB7XG4gICAgZ2V0Q2VudHJlOiAoKCkgPT4gVmVjdG9yKTtcbiAgICBjYWxsYmFja0ZuOiAoKHY6IFZlY3RvcikgPT4gdm9pZCk7XG59XG5cbi8qKlxuKiBSZWdpc3RlciBtdWx0aXBsZSBjZW50cmUgcG9pbnRzXG4qIENsb3Nlc3Qgb25lIHRvIG1vdXNlIGNsaWNrIHdpbGwgYmUgc2VsZWN0ZWQgdG8gZHJhZ1xuKiBVcCB0byBjYWxsZXIgdG8gYWN0dWFsbHkgbW92ZSB0aGVpciBjZW50cmUgcG9pbnQgdmlhIGNhbGxiYWNrXG4qL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgRHJhZ0NvbnRyb2xsZXIge1xuICAgIC8vIEhvdyBjbG9zZSB0byBkcmFnIGhhbmRsZSBwb2ludGVyIG5lZWRzIHRvIGJlXG4gICAgcHJpdmF0ZSByZWFkb25seSBNSU5fRFJBR19ESVNUQU5DRSA9IDUwO1xuXG4gICAgcHJpdmF0ZSBkcmFnZ2FibGVzOiBEcmFnZ2FibGVbXSA9IFtdO1xuICAgIHByaXZhdGUgY3VycmVudGx5RHJhZ2dpbmc6IERyYWdnYWJsZSA9IG51bGw7XG4gICAgcHJpdmF0ZSBkaXNhYmxlZDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIHByaXZhdGUgZG9tYWluQ29udHJvbGxlciA9IERvbWFpbkNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoKTtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZ3VpOiBkYXQuR1VJKSB7XG4gICAgICAgIGludGVyYWN0KGAjJHtVdGlsLkNBTlZBU19JRH1gKS5kcmFnZ2FibGUoe1xuICAgICAgICAgICAgb25zdGFydDogdGhpcy5kcmFnU3RhcnQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIG9ubW92ZTogdGhpcy5kcmFnTW92ZS5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgb25lbmQ6IHRoaXMuZHJhZ0VuZC5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgY3Vyc29yQ2hlY2tlcjogdGhpcy5nZXRDdXJzb3IuYmluZCh0aGlzKSxcbiAgICAgICAgfSk7XG4gICAgfVxuXG4gICAgc2V0RHJhZ0Rpc2FibGVkKGRpc2FibGU6IGJvb2xlYW4pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kaXNhYmxlZCA9IGRpc2FibGU7XG4gICAgfVxuXG4gICAgZ2V0Q3Vyc29yKGFjdGlvbjogYW55LCBpbnRlcmFjdGFibGU6IGFueSwgZWxlbWVudDogYW55LCBpbnRlcmFjdGluZzogYm9vbGVhbikge1xuICAgICAgICBpZiAoaW50ZXJhY3RpbmcpIHJldHVybiAnZ3JhYmJpbmcnO1xuICAgICAgICByZXR1cm4gJ2dyYWInO1xuICAgIH1cblxuICAgIGRyYWdTdGFydChldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIC8vIFRyYW5zZm9ybSBzY3JlZW4gc3BhY2UgdG8gd29ybGQgc3BhY2VcbiAgICAgICAgY29uc3Qgb3JpZ2luID0gdGhpcy5kb21haW5Db250cm9sbGVyLnNjcmVlblRvV29ybGQobmV3IFZlY3RvcihldmVudC54MCwgZXZlbnQueTApKTtcbiAgICAgICAgXG4gICAgICAgIGxldCBjbG9zZXN0RGlzdGFuY2UgPSBJbmZpbml0eTtcbiAgICAgICAgdGhpcy5kcmFnZ2FibGVzLmZvckVhY2goZHJhZ2dhYmxlID0+IHtcbiAgICAgICAgICAgIGNvbnN0IGQgPSBkcmFnZ2FibGUuZ2V0Q2VudHJlKCkuZGlzdGFuY2VUbyhvcmlnaW4pO1xuICAgICAgICAgICAgaWYgKGQgPCBjbG9zZXN0RGlzdGFuY2UpIHtcbiAgICAgICAgICAgICAgICBjbG9zZXN0RGlzdGFuY2UgPSBkO1xuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudGx5RHJhZ2dpbmcgPSBkcmFnZ2FibGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIC8vIFpvb20gc2NyZWVuIHNpemUgdG8gd29ybGQgc2l6ZSBmb3IgY29uc2lzdGVudCBkcmFnIGRpc3RhbmNlIHdoaWxlIHpvb21lZCBpblxuICAgICAgICBjb25zdCBzY2FsZWREcmFnRGlzdGFuY2UgPSB0aGlzLk1JTl9EUkFHX0RJU1RBTkNFIC8gdGhpcy5kb21haW5Db250cm9sbGVyLnpvb207XG5cbiAgICAgICAgaWYgKGNsb3Nlc3REaXN0YW5jZSA+IHNjYWxlZERyYWdEaXN0YW5jZSkge1xuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlEcmFnZ2luZyA9IG51bGw7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkcmFnTW92ZShldmVudDogYW55KTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGRlbHRhID0gbmV3IFZlY3RvcihldmVudC5kZWx0YS54LCBldmVudC5kZWx0YS55KTtcbiAgICAgICAgdGhpcy5kb21haW5Db250cm9sbGVyLnpvb21Ub1dvcmxkKGRlbHRhKTtcblxuICAgICAgICBpZiAoIXRoaXMuZGlzYWJsZWQgJiYgdGhpcy5jdXJyZW50bHlEcmFnZ2luZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRHJhZyBmaWVsZFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlEcmFnZ2luZy5jYWxsYmFja0ZuKGRlbHRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE1vdmUgbWFwXG4gICAgICAgICAgICB0aGlzLmRvbWFpbkNvbnRyb2xsZXIucGFuKGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYWdFbmQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3VycmVudGx5RHJhZ2dpbmcgPSBudWxsO1xuICAgICAgICBVdGlsLnVwZGF0ZUd1aSh0aGlzLmd1aSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsoKCkgPT4gVmVjdG9yKX0gR2V0cyBjZW50cmUgcG9pbnRcbiAgICAgKiBAcGFyYW0geygodjogVmVjdG9yKSA9PiB2b2lkKX0gQ2FsbGVkIG9uIG1vdmUgd2l0aCBkZWx0YSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyB7KCgpID0+IHZvaWQpfSBGdW5jdGlvbiB0byBkZXJlZ2lzdGVyIGNhbGxiYWNrXG4gICAgICovXG4gICAgcmVnaXN0ZXIoZ2V0Q2VudHJlOiAoKCkgPT4gVmVjdG9yKSxcbiAgICAgICAgICAgICBvbk1vdmU6ICgodjogVmVjdG9yKSA9PiB2b2lkKSk6ICgoKSA9PiB2b2lkKSB7XG4gICAgICAgIGNvbnN0IGRyYWdnYWJsZTogRHJhZ2dhYmxlID0ge1xuICAgICAgICAgICAgZ2V0Q2VudHJlOiBnZXRDZW50cmUsXG4gICAgICAgICAgICBjYWxsYmFja0ZuOiBvbk1vdmUsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVzLnB1c2goZHJhZ2dhYmxlKTtcbiAgICAgICAgcmV0dXJuICgoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZHJhZ2dhYmxlcy5pbmRleE9mKGRyYWdnYWJsZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgQ2FudmFzV3JhcHBlciBmcm9tICcuL2NhbnZhc193cmFwcGVyJztcbmltcG9ydCBEb21haW5Db250cm9sbGVyIGZyb20gJy4vZG9tYWluX2NvbnRyb2xsZXInO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi4vdXRpbCc7XG5pbXBvcnQgRmllbGRJbnRlZ3JhdG9yIGZyb20gJy4uL2ltcGwvaW50ZWdyYXRvcic7XG5pbXBvcnQge1N0cmVhbWxpbmVQYXJhbXN9IGZyb20gJy4uL2ltcGwvc3RyZWFtbGluZXMnO1xuaW1wb3J0IFN0cmVhbWxpbmVHZW5lcmF0b3IgZnJvbSAnLi4vaW1wbC9zdHJlYW1saW5lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYWRHVUkge1xuICAgIHByaXZhdGUgc3RyZWFtbGluZXM6IFN0cmVhbWxpbmVHZW5lcmF0b3I7XG4gICAgcHJpdmF0ZSBleGlzdGluZ1N0cmVhbWxpbmVzOiBSb2FkR1VJW10gPSBbXTtcbiAgICBwcml2YXRlIGRvbWFpbkNvbnRyb2xsZXIgPSBEb21haW5Db250cm9sbGVyLmdldEluc3RhbmNlKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHBhcmFtczogU3RyZWFtbGluZVBhcmFtcyxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGludGVncmF0b3I6IEZpZWxkSW50ZWdyYXRvcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIGd1aUZvbGRlcjogZGF0LkdVSSxcbiAgICAgICAgICAgICAgICBwcml2YXRlIGNsb3NlVGVuc29yRm9sZGVyOiAoKSA9PiB2b2lkLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgZm9sZGVyTmFtZTogc3RyaW5nKSB7XG4gICAgICAgIHRoaXMuc3RyZWFtbGluZXMgPSBuZXcgU3RyZWFtbGluZUdlbmVyYXRvcihcbiAgICAgICAgICAgIHRoaXMuaW50ZWdyYXRvciwgdGhpcy5kb21haW5Db250cm9sbGVyLm9yaWdpbixcbiAgICAgICAgICAgIHRoaXMuZG9tYWluQ29udHJvbGxlci53b3JsZERpbWVuc2lvbnMsIHRoaXMucGFyYW1zKTtcblxuICAgICAgICBjb25zdCByb2FkR1VJID0ge1xuICAgICAgICAgICAgR2VuZXJhdGU6IHRoaXMuZ2VuZXJhdGVSb2Fkcy5iaW5kKHRoaXMpLFxuICAgICAgICAgICAgSm9pbkRhbmdsaW5nOiAoKTogdm9pZCA9PiB0aGlzLnN0cmVhbWxpbmVzLmpvaW5EYW5nbGluZ1N0cmVhbWxpbmVzKCksXG4gICAgICAgIH07XG5cbiAgICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5ndWlGb2xkZXIuYWRkRm9sZGVyKHRoaXMuZm9sZGVyTmFtZSk7XG4gICAgICAgIGZvbGRlci5vcGVuKCk7XG4gICAgICAgIGZvbGRlci5hZGQocm9hZEdVSSwgJ0dlbmVyYXRlJyk7XG4gICAgICAgIGZvbGRlci5hZGQocm9hZEdVSSwgJ0pvaW5EYW5nbGluZycpO1xuICAgICAgICBcbiAgICAgICAgY29uc3QgcGFyYW1zRm9sZGVyID0gZm9sZGVyLmFkZEZvbGRlcignUGFyYW1zJyk7XG4gICAgICAgIHBhcmFtc0ZvbGRlci5hZGQodGhpcy5wYXJhbXMsICdkc2VwJyk7XG4gICAgICAgIHBhcmFtc0ZvbGRlci5hZGQodGhpcy5wYXJhbXMsICdkdGVzdCcpO1xuXG4gICAgICAgIGNvbnN0IGRldlBhcmFtc0ZvbGRlciA9IHBhcmFtc0ZvbGRlci5hZGRGb2xkZXIoJ0RldicpO1xuICAgICAgICB0aGlzLmFkZERldlBhcmFtc1RvRm9sZGVyKHRoaXMucGFyYW1zLCBkZXZQYXJhbXNGb2xkZXIpO1xuXG4gICAgICAgIC8vIFVwZGF0ZSBwYXRoIGl0ZXJhdGlvbnMgYmFzZWQgb24gd2luZG93IHNpemVcbiAgICAgICAgdGhpcy5zZXRQYXRoSXRlcmF0aW9ucygpO1xuICAgICAgICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcigncmVzaXplJywgKCk6IHZvaWQgPT4gdGhpcy5zZXRQYXRoSXRlcmF0aW9ucygpKTtcbiAgICB9XG5cbiAgICBkcmF3KGNhbnZhczogQ2FudmFzV3JhcHBlcik6IHZvaWQge1xuICAgICAgICB0aGlzLnN0cmVhbWxpbmVzLmFsbFN0cmVhbWxpbmVzU2ltcGxlLmZvckVhY2gocyA9PiB7XG4gICAgICAgICAgICBjYW52YXMuZHJhd1BvbHlsaW5lKHMubWFwKHYgPT4gdGhpcy5kb21haW5Db250cm9sbGVyLndvcmxkVG9TY3JlZW4odi5jbG9uZSgpKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICByb2Fkc0VtcHR5KCk6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5zdHJlYW1saW5lcy5hbGxTdHJlYW1saW5lc1NpbXBsZS5sZW5ndGggPT09IDA7XG4gICAgfVxuXG4gICAgc2V0RXhpc3RpbmdTdHJlYW1saW5lcyhleGlzdGluZ1N0cmVhbWxpbmVzOiBSb2FkR1VJW10pOiB2b2lkIHtcbiAgICAgICAgdGhpcy5leGlzdGluZ1N0cmVhbWxpbmVzID0gZXhpc3RpbmdTdHJlYW1saW5lcztcbiAgICB9XG5cbiAgICBnZW5lcmF0ZVJvYWRzKCk6IHZvaWQge1xuICAgICAgICB0aGlzLnN0cmVhbWxpbmVzID0gbmV3IFN0cmVhbWxpbmVHZW5lcmF0b3IoXG4gICAgICAgICAgICB0aGlzLmludGVncmF0b3IsIHRoaXMuZG9tYWluQ29udHJvbGxlci5vcmlnaW4sXG4gICAgICAgICAgICB0aGlzLmRvbWFpbkNvbnRyb2xsZXIud29ybGREaW1lbnNpb25zLCBPYmplY3QuYXNzaWduKHt9LHRoaXMucGFyYW1zKSk7XG4gICAgICAgIHRoaXMuZXhpc3RpbmdTdHJlYW1saW5lcy5mb3JFYWNoKHMgPT4gdGhpcy5zdHJlYW1saW5lcy5hZGRFeGlzdGluZ1N0cmVhbWxpbmVzKHMuc3RyZWFtbGluZXMpKTsgICAgICAgIFxuICAgICAgICB0aGlzLnN0cmVhbWxpbmVzLmNyZWF0ZUFsbFN0cmVhbWxpbmVzKCk7XG4gICAgICAgIHRoaXMuY2xvc2VUZW5zb3JGb2xkZXIoKTtcbiAgICB9XG5cbiAgICBwcml2YXRlIGFkZERldlBhcmFtc1RvRm9sZGVyKHBhcmFtczogU3RyZWFtbGluZVBhcmFtcywgZm9sZGVyOiBkYXQuR1VJKTogdm9pZCB7XG4gICAgICAgIGZvbGRlci5hZGQocGFyYW1zLCAncGF0aEl0ZXJhdGlvbnMnKTtcbiAgICAgICAgZm9sZGVyLmFkZChwYXJhbXMsICdzZWVkVHJpZXMnKTtcbiAgICAgICAgZm9sZGVyLmFkZChwYXJhbXMsICdkc3RlcCcpO1xuICAgICAgICBmb2xkZXIuYWRkKHBhcmFtcywgJ2Rsb29rYWhlYWQnKTtcbiAgICAgICAgZm9sZGVyLmFkZChwYXJhbXMsICdkY2lyY2xlam9pbicpO1xuICAgICAgICBmb2xkZXIuYWRkKHBhcmFtcywgJ2pvaW5hbmdsZScpO1xuICAgICAgICBmb2xkZXIuYWRkKHBhcmFtcywgJ3NpbXBsaWZ5VG9sZXJhbmNlJyk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU2V0cyBwYXRoIGl0ZXJhdGlvbnMgc28gdGhhdCBhIHJvYWQgY2FuIGNvdmVyIHRoZSBzY3JlZW5cbiAgICAgKi9cbiAgICBwcml2YXRlIHNldFBhdGhJdGVyYXRpb25zKCk6IHZvaWQge1xuICAgICAgICBjb25zdCBtYXggPSAxLjUgKiBNYXRoLm1heCh3aW5kb3cuaW5uZXJXaWR0aCwgd2luZG93LmlubmVySGVpZ2h0KTtcbiAgICAgICAgdGhpcy5wYXJhbXMucGF0aEl0ZXJhdGlvbnMgPSBtYXgvdGhpcy5wYXJhbXMuZHN0ZXA7XG4gICAgICAgIFV0aWwudXBkYXRlR3VpKHRoaXMuZ3VpRm9sZGVyKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IENhbnZhc1dyYXBwZXIgZnJvbSAnLi9jYW52YXNfd3JhcHBlcic7XG5pbXBvcnQgRG9tYWluQ29udHJvbGxlciBmcm9tICcuL2RvbWFpbl9jb250cm9sbGVyJztcbmltcG9ydCBUZW5zb3JGaWVsZCBmcm9tICcuLi9pbXBsL3RlbnNvcl9maWVsZCc7XG5pbXBvcnQge1JLNEludGVncmF0b3J9IGZyb20gJy4uL2ltcGwvaW50ZWdyYXRvcic7XG5pbXBvcnQge1N0cmVhbWxpbmVQYXJhbXN9IGZyb20gJy4uL2ltcGwvc3RyZWFtbGluZXMnO1xuaW1wb3J0IFJvYWRHVUkgZnJvbSAnLi9yb2FkX2d1aSc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFJvYWRzR1VJIHtcbiAgICBwcml2YXRlIGRvbWFpbkNvbnRyb2xsZXIgPSBEb21haW5Db250cm9sbGVyLmdldEluc3RhbmNlKCk7XG5cbiAgICBwcml2YXRlIG1haW5Sb2FkczogUm9hZEdVSTtcbiAgICBwcml2YXRlIG1ham9yUm9hZHM6IFJvYWRHVUk7XG4gICAgcHJpdmF0ZSBtaW5vclJvYWRzOiBSb2FkR1VJO1xuXG4gICAgLy8gUGFyYW1zXG4gICAgcHJpdmF0ZSBtYWluUGFyYW1zOiBTdHJlYW1saW5lUGFyYW1zO1xuICAgIHByaXZhdGUgbWFqb3JQYXJhbXM6IFN0cmVhbWxpbmVQYXJhbXM7XG4gICAgcHJpdmF0ZSBtaW5vclBhcmFtczogU3RyZWFtbGluZVBhcmFtcyA9IHtcbiAgICAgICAgZHNlcDogMjAsXG4gICAgICAgIGR0ZXN0OiAxMCxcbiAgICAgICAgZHN0ZXA6IDEsXG4gICAgICAgIGRsb29rYWhlYWQ6IDEwMCxcbiAgICAgICAgZGNpcmNsZWpvaW46IDUsXG4gICAgICAgIGpvaW5hbmdsZTogMC4xLCAgLy8gYXBwcm94IDMwZGVnXG4gICAgICAgIHBhdGhJdGVyYXRpb25zOiAxMDAwLFxuICAgICAgICBzZWVkVHJpZXM6IDMwMCxcbiAgICAgICAgc2ltcGxpZnlUb2xlcmFuY2U6IDAuNSxcbiAgICB9O1xuXG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBndWlGb2xkZXI6IGRhdC5HVUksIHRlbnNvckZpZWxkOiBUZW5zb3JGaWVsZCwgY2xvc2VUZW5zb3JGb2xkZXI6ICgpID0+IHZvaWQpIHtcbiAgICAgICAgdGhpcy5tYWpvclBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubWlub3JQYXJhbXMpO1xuICAgICAgICB0aGlzLm1ham9yUGFyYW1zLmRzZXAgPSAxMDA7XG4gICAgICAgIHRoaXMubWFqb3JQYXJhbXMuZHRlc3QgPSAzMDtcbiAgICAgICAgdGhpcy5tYWpvclBhcmFtcy5kbG9va2FoZWFkID0gMjAwO1xuXG4gICAgICAgIHRoaXMubWFpblBhcmFtcyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMubWlub3JQYXJhbXMpO1xuICAgICAgICB0aGlzLm1haW5QYXJhbXMuZHNlcCA9IDQwMDtcbiAgICAgICAgdGhpcy5tYWluUGFyYW1zLmR0ZXN0ID0gMjAwO1xuICAgICAgICB0aGlzLm1haW5QYXJhbXMuZGxvb2thaGVhZCA9IDMwMDtcblxuICAgICAgICBjb25zdCBpbnRlZ3JhdG9yID0gbmV3IFJLNEludGVncmF0b3IodGVuc29yRmllbGQsIHRoaXMubWlub3JQYXJhbXMpO1xuICAgICAgICB0aGlzLm1haW5Sb2FkcyA9IG5ldyBSb2FkR1VJKHRoaXMubWFpblBhcmFtcywgaW50ZWdyYXRvciwgdGhpcy5ndWlGb2xkZXIsIGNsb3NlVGVuc29yRm9sZGVyLCAnTWFpbicpO1xuICAgICAgICB0aGlzLm1ham9yUm9hZHMgPSBuZXcgUm9hZEdVSSh0aGlzLm1ham9yUGFyYW1zLCBpbnRlZ3JhdG9yLCB0aGlzLmd1aUZvbGRlciwgY2xvc2VUZW5zb3JGb2xkZXIsICdNYWpvcicpO1xuICAgICAgICB0aGlzLm1pbm9yUm9hZHMgPSBuZXcgUm9hZEdVSSh0aGlzLm1pbm9yUGFyYW1zLCBpbnRlZ3JhdG9yLCB0aGlzLmd1aUZvbGRlciwgY2xvc2VUZW5zb3JGb2xkZXIsICdNaW5vcicpO1xuXG4gICAgICAgIHRoaXMubWlub3JSb2Fkcy5zZXRFeGlzdGluZ1N0cmVhbWxpbmVzKFt0aGlzLm1haW5Sb2FkcywgdGhpcy5tYWpvclJvYWRzXSk7XG4gICAgICAgIHRoaXMubWFqb3JSb2Fkcy5zZXRFeGlzdGluZ1N0cmVhbWxpbmVzKFt0aGlzLm1haW5Sb2Fkc10pO1xuICAgIH1cblxuICAgIGRyYXcoY2FudmFzOiBDYW52YXNXcmFwcGVyKTogdm9pZCB7XG4gICAgICAgIC8vIERyYXcgUm9hZHNcbiAgICAgICAgY2FudmFzLnNldEZpbGxTdHlsZSgnI0VDRTVEQicpO1xuICAgICAgICBjYW52YXMuY2xlYXJDYW52YXMoKTtcblxuICAgICAgICAvLyBNaW5vclxuICAgICAgICBjYW52YXMuc2V0U3Ryb2tlU3R5bGUoJyMwMjAyMDInKTtcbiAgICAgICAgY2FudmFzLnNldExpbmVXaWR0aCgzKTtcbiAgICAgICAgdGhpcy5taW5vclJvYWRzLmRyYXcoY2FudmFzKTtcblxuICAgICAgICBjYW52YXMuc2V0U3Ryb2tlU3R5bGUoJyMwMjAyMDInKTtcbiAgICAgICAgY2FudmFzLnNldExpbmVXaWR0aCg1KTtcbiAgICAgICAgdGhpcy5tYWpvclJvYWRzLmRyYXcoY2FudmFzKTtcblxuICAgICAgICBjYW52YXMuc2V0U3Ryb2tlU3R5bGUoJyMyODI4MjgnKTtcbiAgICAgICAgY2FudmFzLnNldExpbmVXaWR0aCg2KTtcbiAgICAgICAgdGhpcy5tYWluUm9hZHMuZHJhdyhjYW52YXMpO1xuXG4gICAgICAgIGNhbnZhcy5zZXRTdHJva2VTdHlsZSgnI0Y4RjhGOCcpO1xuICAgICAgICBjYW52YXMuc2V0TGluZVdpZHRoKDIpO1xuICAgICAgICB0aGlzLm1pbm9yUm9hZHMuZHJhdyhjYW52YXMpO1xuXG4gICAgICAgIC8vIE1ham9yXG4gICAgICAgIGNhbnZhcy5zZXRTdHJva2VTdHlsZSgnI0Y4RjhGOCcpO1xuICAgICAgICBjYW52YXMuc2V0TGluZVdpZHRoKDQpO1xuICAgICAgICB0aGlzLm1ham9yUm9hZHMuZHJhdyhjYW52YXMpO1xuXG4gICAgICAgIC8vIE1ham9yIE1ham9yXG4gICAgICAgIGNhbnZhcy5zZXRTdHJva2VTdHlsZSgnI0ZBRkE3QScpO1xuICAgICAgICBjYW52YXMuc2V0TGluZVdpZHRoKDUpO1xuICAgICAgICB0aGlzLm1haW5Sb2Fkcy5kcmF3KGNhbnZhcyk7XG4gICAgfVxuXG4gICAgcm9hZHNFbXB0eSgpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubWFqb3JSb2Fkcy5yb2Fkc0VtcHR5KClcbiAgICAgICAgICAgICYmIHRoaXMubWlub3JSb2Fkcy5yb2Fkc0VtcHR5KClcbiAgICAgICAgICAgICYmIHRoaXMubWFpblJvYWRzLnJvYWRzRW1wdHkoKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IENhbnZhc1dyYXBwZXIgZnJvbSAnLi9jYW52YXNfd3JhcHBlcic7XG5pbXBvcnQgRG9tYWluQ29udHJvbGxlciBmcm9tICcuL2RvbWFpbl9jb250cm9sbGVyJztcbmltcG9ydCBEcmFnQ29udHJvbGxlciBmcm9tICcuL2RyYWdfY29udHJvbGxlcic7XG5pbXBvcnQgVGVuc29yRmllbGQgZnJvbSAnLi4vaW1wbC90ZW5zb3JfZmllbGQnO1xuaW1wb3J0IHtCYXNpc0ZpZWxkfSBmcm9tICcuLi9pbXBsL2Jhc2lzX2ZpZWxkJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi92ZWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW5zb3JGaWVsZEdVSSBleHRlbmRzIFRlbnNvckZpZWxkIHtcbiAgICBwcml2YXRlIFRFTlNPUl9MSU5FX0RJQU1FVEVSID0gMjA7XG4gICAgcHJpdmF0ZSBURU5TT1JfU1BBV05fU0NBTEUgPSAwLjc7ICAvLyBIb3cgbXVjaCB0byBzaHJpbmsgd29ybGREaW1lbnNpb25zIHRvIGZpbmQgc3Bhd24gcG9pbnRcbiAgICBwcml2YXRlIGRvbWFpbkNvbnRyb2xsZXIgPSBEb21haW5Db250cm9sbGVyLmdldEluc3RhbmNlKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGd1aUZvbGRlcjogZGF0LkdVSSwgcHJpdmF0ZSBkcmFnQ29udHJvbGxlcjogRHJhZ0NvbnRyb2xsZXIsIHB1YmxpYyBkcmF3Q2VudHJlOiBib29sZWFuKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIC8vIEZvciBjdXN0b20gbmFtaW5nIG9mIGd1aSBidXR0b25zXG4gICAgICAgIGNvbnN0IHRlbnNvckZpZWxkR3VpT2JqID0ge1xuICAgICAgICAgICAgcmVzZXQ6ICgpOiB2b2lkID0+IHRoaXMucmVzZXQoKSxcbiAgICAgICAgICAgIHNldFJlY29tbWVuZGVkOiAoKTogdm9pZCA9PiB0aGlzLnNldFJlY29tbWVuZGVkKCksXG4gICAgICAgICAgICBhZGRSYWRpYWw6ICgpOiB2b2lkID0+IHRoaXMuYWRkUmFkaWFsUmFuZG9tKCksXG4gICAgICAgICAgICBhZGRHcmlkOiAoKTogdm9pZCA9PiB0aGlzLmFkZEdyaWRSYW5kb20oKSxcbiAgICAgICAgfTtcblxuICAgICAgICB0aGlzLmd1aUZvbGRlci5hZGQodGVuc29yRmllbGRHdWlPYmosICdyZXNldCcpO1xuICAgICAgICB0aGlzLmd1aUZvbGRlci5hZGQodGVuc29yRmllbGRHdWlPYmosICdzZXRSZWNvbW1lbmRlZCcpO1xuICAgICAgICB0aGlzLmd1aUZvbGRlci5hZGQodGVuc29yRmllbGRHdWlPYmosICdhZGRSYWRpYWwnKTtcbiAgICAgICAgdGhpcy5ndWlGb2xkZXIuYWRkKHRlbnNvckZpZWxkR3VpT2JqLCAnYWRkR3JpZCcpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIDQgR3JpZHMsIG9uZSByYWRpYWxcbiAgICAgKi9cbiAgICBzZXRSZWNvbW1lbmRlZCgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5yZXNldCgpO1xuICAgICAgICBjb25zdCBzaXplID0gdGhpcy5kb21haW5Db250cm9sbGVyLndvcmxkRGltZW5zaW9ucy5tdWx0aXBseVNjYWxhcih0aGlzLlRFTlNPUl9TUEFXTl9TQ0FMRSk7XG4gICAgICAgIGNvbnN0IG5ld09yaWdpbiA9IHRoaXMuZG9tYWluQ29udHJvbGxlci53b3JsZERpbWVuc2lvbnNcbiAgICAgICAgICAgIC5tdWx0aXBseVNjYWxhcigoMSAtIHRoaXMuVEVOU09SX1NQQVdOX1NDQUxFKSAvIDIpXG4gICAgICAgICAgICAuYWRkKHRoaXMuZG9tYWluQ29udHJvbGxlci5vcmlnaW4pO1xuICAgICAgICB0aGlzLmFkZEdyaWRBdExvY2F0aW9uKG5ld09yaWdpbik7XG4gICAgICAgIHRoaXMuYWRkR3JpZEF0TG9jYXRpb24obmV3T3JpZ2luLmNsb25lKCkuYWRkKHNpemUpKTtcbiAgICAgICAgdGhpcy5hZGRHcmlkQXRMb2NhdGlvbihuZXdPcmlnaW4uY2xvbmUoKS5hZGQobmV3IFZlY3RvcihzaXplLngsIDApKSk7XG4gICAgICAgIHRoaXMuYWRkR3JpZEF0TG9jYXRpb24obmV3T3JpZ2luLmNsb25lKCkuYWRkKG5ldyBWZWN0b3IoMCwgc2l6ZS55KSkpO1xuICAgICAgICB0aGlzLmFkZFJhZGlhbFJhbmRvbSgpO1xuICAgIH1cblxuICAgIGFkZFJhZGlhbFJhbmRvbSgpOiB2b2lkIHtcbiAgICAgICAgY29uc3Qgd2lkdGggPSB0aGlzLmRvbWFpbkNvbnRyb2xsZXIud29ybGREaW1lbnNpb25zLng7XG4gICAgICAgIHRoaXMuYWRkUmFkaWFsKHRoaXMucmFuZG9tTG9jYXRpb24oKSxcbiAgICAgICAgICAgIFV0aWwucmFuZG9tUmFuZ2Uod2lkdGgvMTAsIHdpZHRoLzUpLCAgLy8gU2l6ZVxuICAgICAgICAgICAgVXRpbC5yYW5kb21SYW5nZSg1MCkpOyAgLy8gRGVjYXlcbiAgICB9XG5cbiAgICBhZGRHcmlkUmFuZG9tKCk6IHZvaWQge1xuICAgICAgICB0aGlzLmFkZEdyaWRBdExvY2F0aW9uKHRoaXMucmFuZG9tTG9jYXRpb24oKSk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBhZGRHcmlkQXRMb2NhdGlvbihsb2NhdGlvbjogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IHdpZHRoID0gdGhpcy5kb21haW5Db250cm9sbGVyLndvcmxkRGltZW5zaW9ucy54O1xuICAgICAgICB0aGlzLmFkZEdyaWQobG9jYXRpb24sXG4gICAgICAgICAgICBVdGlsLnJhbmRvbVJhbmdlKHdpZHRoLzQsIHdpZHRoKSwgIC8vIFNpemVcbiAgICAgICAgICAgIFV0aWwucmFuZG9tUmFuZ2UoNTApLCAgLy8gRGVjYXlcbiAgICAgICAgICAgIFV0aWwucmFuZG9tUmFuZ2UoTWF0aC5QSS8yKSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogV29ybGQtc3BhY2UgcmFuZG9tIGxvY2F0aW9uIGZvciB0ZW5zb3IgZmllbGQgc3Bhd25cbiAgICAgKiBTYW1wbGVkIGZyb20gbWlkZGxlIG9mIHNjcmVlbiAoc2hydW5rIHJlY3RhbmdsZSlcbiAgICAgKi9cbiAgICBwcml2YXRlIHJhbmRvbUxvY2F0aW9uKCk6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHNpemUgPSB0aGlzLmRvbWFpbkNvbnRyb2xsZXIud29ybGREaW1lbnNpb25zLm11bHRpcGx5U2NhbGFyKHRoaXMuVEVOU09SX1NQQVdOX1NDQUxFKTtcbiAgICAgICAgY29uc3QgbG9jYXRpb24gPSBuZXcgVmVjdG9yKE1hdGgucmFuZG9tKCksIE1hdGgucmFuZG9tKCkpLm11bHRpcGx5KHNpemUpO1xuICAgICAgICBjb25zdCBuZXdPcmlnaW4gPSB0aGlzLmRvbWFpbkNvbnRyb2xsZXIud29ybGREaW1lbnNpb25zLm11bHRpcGx5U2NhbGFyKCgxIC0gdGhpcy5URU5TT1JfU1BBV05fU0NBTEUpIC8gMik7XG4gICAgICAgIHJldHVybiBsb2NhdGlvbi5hZGQodGhpcy5kb21haW5Db250cm9sbGVyLm9yaWdpbikuYWRkKG5ld09yaWdpbik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRDcm9zc0xvY2F0aW9ucygpOiBWZWN0b3JbXSB7XG4gICAgICAgIC8vIEdldHMgZ3JpZCBvZiBwb2ludHMgZm9yIHZlY3RvciBmaWVsZCB2aXMgaW4gd29ybGQgc3BhY2VcbiAgICAgICAgY29uc3QgZGlhbWV0ZXIgPSB0aGlzLlRFTlNPUl9MSU5FX0RJQU1FVEVSIC8gdGhpcy5kb21haW5Db250cm9sbGVyLnpvb207XG4gICAgICAgIGNvbnN0IHdvcmxkRGltZW5zaW9ucyA9IHRoaXMuZG9tYWluQ29udHJvbGxlci53b3JsZERpbWVuc2lvbnM7XG4gICAgICAgIGNvbnN0IG5Ib3IgPSBNYXRoLmNlaWwod29ybGREaW1lbnNpb25zLnggLyBkaWFtZXRlcikgKyAxOyAvLyBQcmV2ZW50IHBvcC1pblxuICAgICAgICBjb25zdCBuVmVyID0gTWF0aC5jZWlsKHdvcmxkRGltZW5zaW9ucy55IC8gZGlhbWV0ZXIpICsgMTtcbiAgICAgICAgY29uc3Qgb3JpZ2luWCA9IGRpYW1ldGVyICogTWF0aC5mbG9vcih0aGlzLmRvbWFpbkNvbnRyb2xsZXIub3JpZ2luLnggLyBkaWFtZXRlcik7XG4gICAgICAgIGNvbnN0IG9yaWdpblkgPSBkaWFtZXRlciAqIE1hdGguZmxvb3IodGhpcy5kb21haW5Db250cm9sbGVyLm9yaWdpbi55IC8gZGlhbWV0ZXIpO1xuXG4gICAgICAgIGNvbnN0IG91dCA9IFtdO1xuICAgICAgICBmb3IgKGxldCB4ID0gMDsgeCA8PSBuSG9yOyB4KyspIHtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDw9IG5WZXI7IHkrKykge1xuICAgICAgICAgICAgICAgIG91dC5wdXNoKG5ldyBWZWN0b3Iob3JpZ2luWCArICh4ICogZGlhbWV0ZXIpLCBvcmlnaW5ZICsgKHkgKiBkaWFtZXRlcikpKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvdXQ7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSBnZXRUZW5zb3JMaW5lKHBvaW50OiBWZWN0b3IsIHRlbnNvclY6IFZlY3Rvcik6IFZlY3RvcltdIHtcbiAgICAgICAgY29uc3QgdHJhbnNmb3JtZWRQb2ludCA9IHRoaXMuZG9tYWluQ29udHJvbGxlci53b3JsZFRvU2NyZWVuKHBvaW50LmNsb25lKCkpO1xuXG4gICAgICAgIGNvbnN0IGRpZmYgPSB0ZW5zb3JWLm11bHRpcGx5U2NhbGFyKHRoaXMuVEVOU09SX0xJTkVfRElBTUVURVIgLyAyKTsgIC8vIEFzc3VtZXMgbm9ybWFsaXNlZFxuICAgICAgICBjb25zdCBzdGFydCA9IHRyYW5zZm9ybWVkUG9pbnQuY2xvbmUoKS5zdWIoZGlmZik7XG4gICAgICAgIGNvbnN0IGVuZCA9IHRyYW5zZm9ybWVkUG9pbnQuY2xvbmUoKS5hZGQoZGlmZik7XG4gICAgICAgIHJldHVybiBbc3RhcnQsIGVuZF07XG4gICAgfVxuXG4gICAgZHJhdyhjYW52YXM6IENhbnZhc1dyYXBwZXIpOiB2b2lkIHtcbiAgICAgICAgLy8gRHJhdyB0ZW5zb3IgZmllbGRcbiAgICAgICAgICAgIGNhbnZhcy5zZXRTdHJva2VTdHlsZSgnd2hpdGUnKTtcbiAgICAgICAgICAgIGNhbnZhcy5zZXRMaW5lV2lkdGgoMSk7XG4gICAgICAgICAgICBjb25zdCB0ZW5zb3JQb2ludHMgPSB0aGlzLmdldENyb3NzTG9jYXRpb25zKCk7XG4gICAgICAgICAgICB0ZW5zb3JQb2ludHMuZm9yRWFjaChwID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCB0ID0gdGhpcy5zYW1wbGVQb2ludChwKTtcbiAgICAgICAgICAgICAgICBjYW52YXMuZHJhd1BvbHlsaW5lKHRoaXMuZ2V0VGVuc29yTGluZShwLCB0LmdldE1ham9yKCkpKTtcbiAgICAgICAgICAgICAgICBjYW52YXMuZHJhd1BvbHlsaW5lKHRoaXMuZ2V0VGVuc29yTGluZShwLCB0LmdldE1pbm9yKCkpKTtcbiAgICAgICAgICAgIH0pO1xuXG4gICAgICAgICAgICAvLyBEcmF3IGNlbnRyZSBwb2ludHMgb2YgZmllbGRzXG4gICAgICAgICAgICBpZiAodGhpcy5kcmF3Q2VudHJlKSB7XG4gICAgICAgICAgICAgICAgY2FudmFzLnNldEZpbGxTdHlsZSgncmVkJyk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRDZW50cmVQb2ludHMoKS5mb3JFYWNoKHYgPT5cbiAgICAgICAgICAgICAgICAgICAgY2FudmFzLmRyYXdTcXVhcmUodGhpcy5kb21haW5Db250cm9sbGVyLndvcmxkVG9TY3JlZW4odiksIDcpKTtcbiAgICAgICAgICAgIH1cbiAgICB9XG5cbiAgICBwcm90ZWN0ZWQgYWRkRmllbGQoZmllbGQ6IEJhc2lzRmllbGQpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIuYWRkRmllbGQoZmllbGQpO1xuICAgICAgICBjb25zdCBmb2xkZXIgPSB0aGlzLmd1aUZvbGRlci5hZGRGb2xkZXIoYCR7ZmllbGQuRk9MREVSX05BTUV9YCk7XG4gICAgICAgIFxuICAgICAgICAvLyBGdW5jdGlvbiB0byBkZXJlZ2lzdGVyIGZyb20gZHJhZyBjb250cm9sbGVyXG4gICAgICAgIGNvbnN0IGRlcmVnaXN0ZXJEcmFnID0gdGhpcy5kcmFnQ29udHJvbGxlci5yZWdpc3RlcihcbiAgICAgICAgICAgICgpID0+IGZpZWxkLmNlbnRyZSwgZmllbGQuZHJhZ01vdmVMaXN0ZW5lci5iaW5kKGZpZWxkKSk7XG4gICAgICAgIGNvbnN0IHJlbW92ZUZpZWxkT2JqID0ge3JlbW92ZTogKCk6IHZvaWQgPT4gdGhpcy5yZW1vdmVGaWVsZEdVSS5iaW5kKHRoaXMpKGZpZWxkLCBmb2xkZXIsIGRlcmVnaXN0ZXJEcmFnKX07XG4gICAgICAgIFxuICAgICAgICAvLyBHaXZlIGRhdCBndWkgcmVtb3ZlRmllbGQgYnV0dG9uXG4gICAgICAgIGZvbGRlci5hZGQocmVtb3ZlRmllbGRPYmosICdyZW1vdmUnKTtcbiAgICAgICAgZmllbGQuc2V0R3VpKGZvbGRlcik7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZW1vdmVGaWVsZEdVSShmaWVsZDogQmFzaXNGaWVsZCwgZm9sZGVyOiBkYXQuR1VJLCBkZXJlZ2lzdGVyRHJhZzogKCgpID0+IHZvaWQpKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLnJlbW92ZUZpZWxkKGZpZWxkKTtcbiAgICAgICAgdGhpcy5ndWlGb2xkZXIucmVtb3ZlRm9sZGVyKGZvbGRlcik7XG4gICAgICAgIC8vIERlcmVnaXN0ZXIgZnJvbSBkcmFnIGNvbnRyb2xsZXJcbiAgICAgICAgZGVyZWdpc3RlckRyYWcoKTtcbiAgICB9XG5cbiAgICByZXNldCgpOiB2b2lkIHtcbiAgICAgICAgLy8gVE9ETyBraW5kIG9mIGhhY2t5IC0gY2FsbGluZyByZW1vdmUgY2FsbGJhY2tzIGZyb20gZ3VpIG9iamVjdCwgc2hvdWxkIHN0b3JlIGNhbGxiYWNrc1xuICAgICAgICAvLyBpbiBhZGRmaWVsZCBhbmQgY2FsbCB0aGVtIChyZXF1aXJlcyBtYWtpbmcgc3VyZSB0aGV5J3JlIGlkZW1wb3RlbnQpXG4gICAgICAgIGZvciAoY29uc3QgZmllbGRGb2xkZXJOYW1lIGluIHRoaXMuZ3VpRm9sZGVyLl9fZm9sZGVycykge1xuICAgICAgICAgICAgY29uc3QgZmllbGRGb2xkZXIgPSB0aGlzLmd1aUZvbGRlci5fX2ZvbGRlcnNbZmllbGRGb2xkZXJOYW1lXTtcbiAgICAgICAgICAgIChmaWVsZEZvbGRlci5fX2NvbnRyb2xsZXJzWzBdIGFzIGFueSkuaW5pdGlhbFZhbHVlKCk7XG4gICAgICAgIH1cblxuICAgICAgICBzdXBlci5yZXNldCgpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBpbnRlcmZhY2UgUmFuZG9tUmFuZ2Uge1xuICAgIG1pbj86IG51bWJlcixcbiAgICBtYXg6IG51bWJlcixcbn1cblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVXRpbCB7XG4gICAgLy8gTXVzdCBtYXRjaCBzdHlsZS5jc3NcbiAgICBzdGF0aWMgcmVhZG9ubHkgQ0FOVkFTX0lEID0gJ21hcC1jYW52YXMnO1xuICAgIHN0YXRpYyByZWFkb25seSBJTUdfQ0FOVkFTX0lEID0gJ2ltZy1jYW52YXMnO1xuXG4gICAgc3RhdGljIHVwZGF0ZUd1aShndWk6IGRhdC5HVUkpOiB2b2lkIHtcbiAgICAgICAgaWYgKGd1aS5fX2NvbnRyb2xsZXJzKSB7XG4gICAgICAgICAgICBndWkuX19jb250cm9sbGVycy5mb3JFYWNoKGMgPT4gYy51cGRhdGVEaXNwbGF5KCkpOyAgICBcbiAgICAgICAgfVxuICAgICAgICBpZiAoZ3VpLl9fZm9sZGVycykge1xuICAgICAgICAgICAgZm9yIChsZXQgZm9sZGVyTmFtZSBpbiBndWkuX19mb2xkZXJzKSB7XG4gICAgICAgICAgICAgICAgdGhpcy51cGRhdGVHdWkoZ3VpLl9fZm9sZGVyc1tmb2xkZXJOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmVtb3ZlQWxsRm9sZGVycyhndWk6IGRhdC5HVUkpIHtcbiAgICAgICAgaWYgKGd1aS5fX2ZvbGRlcnMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGZvbGRlck5hbWUgaW4gZ3VpLl9fZm9sZGVycykge1xuICAgICAgICAgICAgICAgIGd1aS5yZW1vdmVGb2xkZXIoZ3VpLl9fZm9sZGVyc1tmb2xkZXJOYW1lXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBzdGF0aWMgcmFuZG9tUmFuZ2UobWF4OiBudW1iZXIsIG1pbj0wKSB7XG4gICAgICAgIHJldHVybiAoTWF0aC5yYW5kb20oKSAqIChtYXggLSBtaW4pKSArIG1pbjtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHt9XG5cbiAgICBzdGF0aWMgemVyb1ZlY3RvcigpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcigwLCAwKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbVNjYWxhcihzOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihzLCBzKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiAtcGkgdG8gcGlcbiAgICAgKi9cbiAgICBzdGF0aWMgYW5nbGVCZXR3ZWVuKHYxOiBWZWN0b3IsIHYyOiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICAvLyAtMnBpIHRvIDJwaVxuICAgICAgICBsZXQgYW5nbGVCZXR3ZWVuID0gdjEuYW5nbGUoKSAtIHYyLmFuZ2xlKCk7XG4gICAgICAgIGlmIChhbmdsZUJldHdlZW4gPiBNYXRoLlBJKSB7XG4gICAgICAgICAgICBhbmdsZUJldHdlZW4gLT0gMiAqIE1hdGguUEk7XG4gICAgICAgIH0gZWxzZSBpZiAoYW5nbGVCZXR3ZWVuIDw9IC1NYXRoLlBJKSB7XG4gICAgICAgICAgICBhbmdsZUJldHdlZW4gKz0gMiAqIE1hdGguUEk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGFuZ2xlQmV0d2VlbjtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBUZXN0cyB3aGV0aGVyIGEgcG9pbnQgbGllcyB0byB0aGUgbGVmdCBvZiBhIGxpbmVcbiAgICAgKiBAcGFyYW0gIHtWZWN0b3J9IGxpbmVQb2ludCAgICAgUG9pbnQgb24gdGhlIGxpbmVcbiAgICAgKiBAcGFyYW0gIHtWZWN0b3J9IGxpbmVEaXJlY3Rpb24gXG4gICAgICogQHBhcmFtICB7VmVjdG9yfSBwb2ludFxuICAgICAqIEByZXR1cm4ge1ZlY3Rvcn0gICAgICAgICAgICAgICB0cnVlIGlmIGxlZnQsIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHN0YXRpYyBpc0xlZnQobGluZVBvaW50OiBWZWN0b3IsIGxpbmVEaXJlY3Rpb246IFZlY3RvciwgcG9pbnQ6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBwZXJwZW5kaWN1bGFyVmVjdG9yID0gbmV3IFZlY3RvcihsaW5lRGlyZWN0aW9uLnksIC1saW5lRGlyZWN0aW9uLngpO1xuICAgICAgICByZXR1cm4gcG9pbnQuY2xvbmUoKS5zdWIobGluZVBvaW50KS5kb3QocGVycGVuZGljdWxhclZlY3RvcikgPCAwO1xuICAgIH1cblxuICAgIGFkZCh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggKz0gdi54O1xuICAgICAgICB0aGlzLnkgKz0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmdsZSBpbiByYWRpYW5zIHRvIHBvc2l0aXZlIHgtYXhpcyBiZXR3ZWVuIC1waSBhbmQgcGlcbiAgICAgKi9cbiAgICBhbmdsZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LCB0aGlzLnkpO1xuICAgIH1cblxuICAgIGNvcHkodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNyb3NzKHY6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2Lng7XG4gICAgfVxuXG4gICAgZGlzdGFuY2VUbyh2OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdGFuY2VUb1NxdWFyZWQodikpO1xuICAgIH1cblxuICAgIGRpc3RhbmNlVG9TcXVhcmVkICh2OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBkeCA9IHRoaXMueCAtIHYueFxuICAgICAgICBjb25zdCBkeSA9IHRoaXMueSAtIHYueTtcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xuICAgIH1cblxuICAgIGRpdmlkZSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICBpZiAodi54ID09PSAwIHx8IHYueSA9PT0gMCkge1xuICAgICAgICAgICAgbG9nLndhcm4oXCJEaXZpc2lvbiBieSB6ZXJvXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnggLz0gdi54O1xuICAgICAgICB0aGlzLnkgLz0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkaXZpZGVTY2FsYXIoczogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFwiRGl2aXNpb24gYnkgemVyb1wiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKDEgLyBzKTtcbiAgICB9XG5cbiAgICBkb3QodjogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcbiAgICB9XG5cbiAgICBlcXVhbHModjogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoKHYueCA9PT0gdGhpcy54KSAmJiAodi55ID09PSB0aGlzLnkpKTtcbiAgICB9XG5cbiAgICBsZW5ndGgoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmxlbmd0aFNxKCkpO1xuICAgIH1cblxuICAgIGxlbmd0aFNxKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB0aGlzLnggKyB0aGlzLnkgKiB0aGlzLnk7XG4gICAgfVxuXG4gICAgbXVsdGlwbHkodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ICo9IHYueDtcbiAgICAgICAgdGhpcy55ICo9IHYueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbXVsdGlwbHlTY2FsYXIoczogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ICo9IHM7XG4gICAgICAgIHRoaXMueSAqPSBzO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBuZWdhdGUoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMubXVsdGlwbHlTY2FsYXIoLTEpO1xuICAgIH1cblxuICAgIG5vcm1hbGl6ZSgpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBsID0gdGhpcy5sZW5ndGgoKTtcbiAgICAgICAgaWYgKGwgPT09IDApIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFwiWmVybyBWZWN0b3JcIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmV0dXJuIHRoaXMuZGl2aWRlU2NhbGFyKHRoaXMubGVuZ3RoKCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEFuZ2xlIGluIHJhZGlhbnNcbiAgICAgKi9cbiAgICByb3RhdGVBcm91bmQoY2VudGVyOiBWZWN0b3IsIGFuZ2xlOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcyhhbmdsZSlcbiAgICAgICAgY29uc3Qgc2luID0gTWF0aC5zaW4oYW5nbGUpO1xuXG4gICAgICAgIGNvbnN0IHggPSB0aGlzLnggLSBjZW50ZXIueDtcbiAgICAgICAgY29uc3QgeSA9IHRoaXMueSAtIGNlbnRlci55O1xuXG4gICAgICAgIHRoaXMueCA9IHggKiBjb3MgLSB5ICogc2luICsgY2VudGVyLng7XG4gICAgICAgIHRoaXMueSA9IHggKiBzaW4gKyB5ICogY29zICsgY2VudGVyLnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldCh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggPSB2Lng7XG4gICAgICAgIHRoaXMueSA9IHYueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgc2V0WCh4OiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggPSB4O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXRZKHk6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueSA9IHk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldExlbmd0aCAobGVuZ3RoOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcihsZW5ndGgpO1xuICAgIH1cblxuICAgIHN1Yih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggLT0gdi54O1xuICAgICAgICB0aGlzLnkgLT0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iXX0=
