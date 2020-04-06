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
var bundleFn = arguments[3];
var sources = arguments[4];
var cache = arguments[5];

var stringify = JSON.stringify;

module.exports = function (fn, options) {
    var wkey;
    var cacheKeys = Object.keys(cache);

    for (var i = 0, l = cacheKeys.length; i < l; i++) {
        var key = cacheKeys[i];
        var exp = cache[key].exports;
        // Using babel as a transpiler to use esmodule, the export will always
        // be an object with the default export as a property of it. To ensure
        // the existing api and babel esmodule exports are both supported we
        // check for both
        if (exp === fn || exp && exp.default === fn) {
            wkey = key;
            break;
        }
    }

    if (!wkey) {
        wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
        var wcache = {};
        for (var i = 0, l = cacheKeys.length; i < l; i++) {
            var key = cacheKeys[i];
            wcache[key] = key;
        }
        sources[wkey] = [
            'function(require,module,exports){' + fn + '(self); }',
            wcache
        ];
    }
    var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);

    var scache = {}; scache[wkey] = wkey;
    sources[skey] = [
        'function(require,module,exports){' +
            // try to call default if defined to also support babel esmodule exports
            'var f = require(' + stringify(wkey) + ');' +
            '(f.default ? f.default : f)(self);' +
        '}',
        scache
    ];

    var workerSources = {};
    resolveSources(skey);

    function resolveSources(key) {
        workerSources[key] = true;

        for (var depPath in sources[key][1]) {
            var depKey = sources[key][1][depPath];
            if (!workerSources[depKey]) {
                resolveSources(depKey);
            }
        }
    }

    var src = '(' + bundleFn + ')({'
        + Object.keys(workerSources).map(function (key) {
            return stringify(key) + ':['
                + sources[key][0]
                + ',' + stringify(sources[key][1]) + ']'
            ;
        }).join(',')
        + '},{},[' + stringify(skey) + '])'
    ;

    var URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

    var blob = new Blob([src], { type: 'text/javascript' });
    if (options && options.bare) { return blob; }
    var workerUrl = URL.createObjectURL(blob);
    var worker = new Worker(workerUrl);
    worker.objectURL = workerUrl;
    return worker;
};

},{}],6:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dat = require("dat.gui");
var work = require("webworkify");
var tensor_field_interface_1 = require("./ts/interface/tensor_field_interface");
var vector_1 = require("./ts/vector");
var canvas_wrapper_1 = require("./ts/interface/canvas_wrapper");
var util_1 = require("./ts/util");
var drag_controller_1 = require("./ts/interface/drag_controller");
var domain_controller_1 = require("./ts/interface/domain_controller");
var worker_params_1 = require("./ts/impl/worker/worker_params");
var size = 800;
var dc = domain_controller_1.default.getInstance(vector_1.default.fromScalar(size));
var c = document.getElementById(util_1.default.CANVAS_ID);
var canvas = new canvas_wrapper_1.default(c, size, size);
var gui = new dat.GUI();
var tensorFolder = gui.addFolder('Tensor Field');
var field = new tensor_field_interface_1.default(tensorFolder, new drag_controller_1.default(gui));
field.addGrid(new vector_1.default(0, 0), size, 20, Math.PI / 4);
field.addGrid(new vector_1.default(size, size), size, 20, 0);
field.addRadial(new vector_1.default(size / 2, size / 2), 300, 20);
var params = {
    dsep: 30,
    dtest: 15,
    dstep: 1,
    dlookahead: 5,
    pathIterations: 1000,
    seedTries: 300,
    simplifyTolerance: 0.5,
};
gui.add(params, 'dstep');
gui.add(params, 'dsep');
gui.add(params, 'dtest');
gui.add(params, 'dlookahead');
gui.add(params, 'pathIterations');
gui.add(params, 'simplifyTolerance');
gui.add(dc, 'zoom', 0, 5);
// const integrator = new RK4Integrator(field, params);
// let s = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, params);
// function setStreamline() {
//     s = new StreamlineGenerator(integrator, dc.origin, dc.worldDimensions, params);
//     s.createAllStreamlines();
// }
// function getStreamlines(): Vector[][] {
//     return s.allStreamlinesSimple;
// }
var streamlines = [];
function getStreamlines() {
    return streamlines;
}
var streamlineWorker = work(require('./ts/impl/worker/streamline_worker.ts'));
streamlineWorker.addEventListener('message', function (ev) {
    var streamlineParams = ev.data;
    streamlines = streamlineParams.map(function (streamline) { return streamline.map(function (p) { return new vector_1.default(p.x, p.y); }); });
});
function setStreamline() {
    var data = {
        fieldParams: field.getWorkerParams(),
        streamlinesParams: {
            origin: dc.origin.getWorkerParams(),
            worldDimensions: dc.worldDimensions.getWorkerParams(),
            params: params,
        },
    };
    streamlineWorker.postMessage([worker_params_1.MessageType.CreateMajorRoads, data]);
}
var tmpObj = {
    setStreamline: setStreamline
};
gui.add(tmpObj, 'setStreamline');
function getTensorLine(point, v, length) {
    var transformed = dc.worldToScreen(point.clone());
    var diff = v.multiplyScalar(length / 2);
    var start = transformed.clone().sub(diff);
    var end = transformed.clone().add(diff);
    return [start, end];
}
function draw() {
    var startTime = performance.now();
    var samples = 60;
    var length = 12;
    canvas.setStrokeStyle('white');
    canvas.setFillStyle('black');
    canvas.setLineWidth(1);
    canvas.clearCanvas();
    var step = size / samples;
    var xStart = step - (dc.origin.x % step);
    var yStart = step - (dc.origin.y % step);
    for (var x = xStart - step; x <= size + step; x += size / samples) {
        for (var y = yStart - step; y <= size + step; y += size / samples) {
            var point = dc.screenToWorld(new vector_1.default(x, y));
            var t = field.samplePoint(point);
            canvas.drawPolyline(getTensorLine(point, t.getMajor(), length));
            canvas.drawPolyline(getTensorLine(point, t.getMinor(), length));
        }
    }
    canvas.setFillStyle('red');
    field.getCentrePoints().forEach(function (v) { return canvas.drawSquare(dc.worldToScreen(v), 7); });
    if (getStreamlines().length > 0) {
        canvas.setFillStyle('#ECE5DB');
        canvas.clearCanvas();
        canvas.setStrokeStyle('#020202');
        canvas.setLineWidth(3);
        getStreamlines().forEach(function (s) {
            canvas.drawPolyline(s.map(function (v) { return dc.worldToScreen(v.clone()); }));
        });
        canvas.setStrokeStyle('#F8F8F8');
        canvas.setLineWidth(2);
        getStreamlines().forEach(function (s) {
            canvas.drawPolyline(s.map(function (v) { return dc.worldToScreen(v.clone()); }));
        });
    }
    streamlineWorker.postMessage([worker_params_1.MessageType.GetMajorRoads]);
    // Updates at 60fps
    // while (performance.now() - startTime < 5000/60) {
    //     s.update();
    // }
    requestAnimationFrame(draw);
}
requestAnimationFrame(draw);

},{"./ts/impl/worker/streamline_worker.ts":14,"./ts/impl/worker/worker_params":16,"./ts/interface/canvas_wrapper":17,"./ts/interface/domain_controller":18,"./ts/interface/drag_controller":19,"./ts/interface/tensor_field_interface":20,"./ts/util":21,"./ts/vector":22,"dat.gui":1,"webworkify":5}],7:[function(require,module,exports){
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
    Vector.prototype.mulitply = function (v) {
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

},{"loglevel":3}],8:[function(require,module,exports){
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
    BasisField.prototype.getWorkerParams = function () {
        var p = {
            centre: this.centre,
            size: this._size,
            decay: this._decay,
        };
        return p;
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
    Grid.prototype.getWorkerParams = function () {
        var p = {
            centre: this.centre,
            size: this._size,
            decay: this._decay,
            theta: this._theta,
        };
        return p;
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

},{"./tensor":12}],9:[function(require,module,exports){
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
    GridStorage.prototype.addPolyline = function (line) {
        var _this = this;
        line.forEach(function (v) { return _this.addSample(v); });
    };
    /**
     * Does not enforce separation
     */
    GridStorage.prototype.addSample = function (v, coords) {
        if (!coords) {
            coords = this.getSampleCoords(v);
        }
        this.grid[coords.x][coords.y].push(v);
    };
    /**
     * Tests whether v is at least d away from samples
     * @param dSq=this.dsepSq squared test distance
     * Could be dtest if we are integrating a streamline
     */
    GridStorage.prototype.isValidSample = function (v, dSq) {
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
     */
    GridStorage.prototype.getSampleCoords = function (worldV) {
        var v = this.worldToGrid(worldV);
        if (this.vectorOutOfBounds(v, this.worldDimensions)) {
            console.log(v);
            console.log(worldV);
            console.log(this.origin);
            log.error("Tried to access out-of-bounds sample in grid");
            return vector_1.default.zeroVector();
        }
        return new vector_1.default(Math.floor(v.x / this.dsep), Math.floor(v.y / this.dsep));
    };
    return GridStorage;
}());
exports.default = GridStorage;

},{"../vector":22,"loglevel":3}],10:[function(require,module,exports){
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

},{"../vector":22}],11:[function(require,module,exports){
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
        this.candidateSeedsMajor = [];
        this.candidateSeedsMinor = [];
        this.streamlinesDone = true;
        this.lastStreamlineMajor = true;
        this.streamlinesMajor = [];
        this.streamlinesMinor = [];
        this.allStreamlinesSimple = []; // Reduced vertex count
        this.allStreamlinesSimpleParams = [];
        if (params.dstep > params.dsep) {
            log.error("STREAMLINE SAMPLE DISTANCE BIGGER THAN DSEP");
        }
        // Enforce test < sep
        params.dtest = Math.min(params.dtest, params.dsep);
        this.majorGrid = new grid_storage_1.default(this.worldDimensions, this.origin, params.dsep);
        this.minorGrid = new grid_storage_1.default(this.worldDimensions, this.origin, params.dsep);
        this.setParamsSq();
    }
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
            var simpleStreamline = simplify(streamline, this.params.simplifyTolerance).map(function (point) { return new vector_1.default(point.x, point.y); });
            this.allStreamlinesSimple.push(simpleStreamline);
            this.allStreamlinesSimpleParams.push(simpleStreamline.map(function (v) {
                var p = {
                    x: v.x,
                    y: v.y
                };
                return p;
            }));
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
        if (this.candidateSeeds(major).length > 0) {
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
            if (this.pointInBounds(nextPoint)
                && this.grid(major).isValidSample(nextPoint, this.paramsSq.dtest)) {
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
            streamline: [seed],
            previousDirection: d,
            previousPoint: seed.clone().add(d),
            valid: true,
        };
        forwardParams.valid = this.pointInBounds(forwardParams.previousPoint);
        var backwardParams = {
            streamline: [],
            previousDirection: d.clone().negate(),
            previousPoint: seed.clone().add(d.clone().negate()),
            valid: true,
        };
        backwardParams.valid = this.pointInBounds(backwardParams.previousPoint);
        while (count < this.params.pathIterations && (forwardParams.valid || backwardParams.valid)) {
            this.streamlineIntegrationStep(forwardParams, major);
            this.streamlineIntegrationStep(backwardParams, major);
            // Join up circles
            var sqDistanceBetweenPoints = forwardParams.previousPoint.distanceToSquared(backwardParams.previousPoint);
            if (!pointsEscaped && sqDistanceBetweenPoints > this.paramsSq.dlookahead) {
                pointsEscaped = true;
            }
            if (pointsEscaped && sqDistanceBetweenPoints <= this.paramsSq.dlookahead) {
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

},{"../vector":22,"./grid_storage":9,"loglevel":3,"simplify-js":4}],12:[function(require,module,exports){
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

},{"../vector":22}],13:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var tensor_1 = require("./tensor");
var basis_field_1 = require("./basis_field");
var TensorField = /** @class */ (function () {
    function TensorField() {
        this.basisFields = [];
        this.gridNameIndex = 0;
        this.radialNameIndex = 0;
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
    TensorField.prototype.getWorkerParams = function () {
        return this.basisFields.map(function (f) { return f.getWorkerParams(); });
    };
    return TensorField;
}());
exports.default = TensorField;

},{"./basis_field":8,"./tensor":12}],14:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../../vector");
var tensor_field_1 = require("../tensor_field");
var streamlines_1 = require("../streamlines");
var integrator_1 = require("../integrator");
var worker_params_1 = require("./worker_params");
function streamlinesFromParams(params) {
    var field = new tensor_field_1.default;
    params.fieldParams.forEach(function (fieldParams) {
        if (worker_params_1.isGrid(fieldParams)) {
            field.addGrid(new vector_1.default(fieldParams.centre.x, fieldParams.centre.y), fieldParams.size, fieldParams.decay, fieldParams.theta);
        }
        else { // Radial
            field.addRadial(new vector_1.default(fieldParams.centre.x, fieldParams.centre.y), fieldParams.size, fieldParams.decay);
        }
    });
    var integrator = new integrator_1.RK4Integrator(field, params.streamlinesParams.params);
    var origin = new vector_1.default(params.streamlinesParams.origin.x, params.streamlinesParams.origin.y);
    var worldDimensions = new vector_1.default(params.streamlinesParams.worldDimensions.x, params.streamlinesParams.worldDimensions.y);
    return new streamlines_1.default(integrator, origin, worldDimensions, params.streamlinesParams.params);
}
module.exports = function (self) {
    self.addEventListener('message', function (ev) {
        switch (ev.data[0]) {
            case worker_params_1.MessageType.CreateMajorRoads: {
                var params = ev.data[1];
                self.s = streamlinesFromParams(params);
                self.s.createAllStreamlines();
                break;
            }
            case worker_params_1.MessageType.GetMajorRoads: {
                if (self.s) {
                    self.postMessage(self.s.allStreamlinesSimpleParams);
                }
                break;
            }
        }
        // self.postMessage(s.allStreamlinesSimple);
        // setInterval(() => {
        //     self.postMessage(Vector.fromScalar(startNum));
        // }, 500);
    });
};

},{"../../vector":22,"../integrator":10,"../streamlines":11,"../tensor_field":13,"./worker_params":16}],15:[function(require,module,exports){
// import Vector from './vector';
// module.exports = (self: any) => {
//     self.addEventListener('message', (ev: any) => {
//         const s = ev.data;
//         console.log(s);
//         // s.createAllStreamlines();
//         // self.postMessage(s.allStreamlinesSimple);
//         // setInterval(() => {
//         //     self.postMessage(Vector.fromScalar(startNum));
//         // }, 500);
//     });
// }

},{}],16:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var MessageType;
(function (MessageType) {
    MessageType[MessageType["GetMajorRoads"] = 0] = "GetMajorRoads";
    MessageType[MessageType["CreateMajorRoads"] = 1] = "CreateMajorRoads";
})(MessageType = exports.MessageType || (exports.MessageType = {}));
function isGrid(fieldParams) {
    return fieldParams.theta !== undefined;
}
exports.isGrid = isGrid;

},{}],17:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var log = require("loglevel");
var CanvasWrapper = /** @class */ (function () {
    function CanvasWrapper(canvas, _width, _height) {
        this._width = _width;
        this._height = _height;
        this.ctx = canvas.getContext("2d");
        this.resizeCanvas();
        this.setFillStyle('black');
        this.clearCanvas();
    }
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
    CanvasWrapper.prototype.setFillStyle = function (colour) {
        this.ctx.fillStyle = colour;
    };
    CanvasWrapper.prototype.clearCanvas = function () {
        this.drawRectangle(0, 0, this._width, this._height);
    };
    CanvasWrapper.prototype.drawRectangle = function (x, y, width, height) {
        this.ctx.fillRect(x, y, width, height);
    };
    CanvasWrapper.prototype.drawSquare = function (centre, radius) {
        this.drawRectangle(centre.x - radius, centre.y - radius, 2 * radius, 2 * radius);
    };
    CanvasWrapper.prototype.setLineWidth = function (width) {
        this.ctx.lineWidth = width;
    };
    CanvasWrapper.prototype.setStrokeStyle = function (colour) {
        this.ctx.strokeStyle = colour;
    };
    CanvasWrapper.prototype.drawPolyline = function (line) {
        if (line.length < 2) {
            log.warn("Tried to draw path of length < 2");
            return;
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

},{"loglevel":3}],18:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var vector_1 = require("../vector");
/**
 * Singleton
 * Controls panning and zooming
 */
var DomainController = /** @class */ (function () {
    function DomainController(screenDimensions) {
        // Location of screen origin in world space
        this._origin = vector_1.default.zeroVector();
        // Ratio of screen pixels to world pixels
        this._zoom = 1;
        if (screenDimensions) {
            this._screenDimensions = screenDimensions.clone();
        }
    }
    DomainController.getInstance = function (screenDimensions) {
        if (!DomainController.instance) {
            DomainController.instance = new DomainController(screenDimensions);
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

},{"../vector":22}],19:[function(require,module,exports){
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
        if (this.disabled)
            return 'default';
        if (interacting)
            return 'grabbing';
        return 'grab';
    };
    DragController.prototype.dragStart = function (event) {
        var _this = this;
        if (this.disabled)
            return;
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
        if (this.disabled)
            return;
        var delta = new Vector_1.default(event.delta.x, event.delta.y);
        this.domainController.zoomToWorld(delta);
        if (this.currentlyDragging !== null) {
            // Drag field
            this.currentlyDragging.callbackFn(delta);
        }
        else {
            // Move map
            this.domainController.pan(delta);
        }
    };
    DragController.prototype.dragEnd = function () {
        if (this.disabled)
            return;
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

},{"../Vector":7,"../util":21,"./domain_controller":18,"interactjs":2}],20:[function(require,module,exports){
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
var tensor_field_1 = require("../impl/tensor_field");
var TensorFieldInterface = /** @class */ (function (_super) {
    __extends(TensorFieldInterface, _super);
    function TensorFieldInterface(guiFolder, dragController) {
        var _this = _super.call(this) || this;
        _this.guiFolder = guiFolder;
        _this.dragController = dragController;
        return _this;
    }
    TensorFieldInterface.prototype.addField = function (field) {
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
    TensorFieldInterface.prototype.removeFieldGUI = function (field, folder, deregisterDrag) {
        _super.prototype.removeField.call(this, field);
        this.guiFolder.removeFolder(folder);
        // Deregister from drag controller
        deregisterDrag();
    };
    return TensorFieldInterface;
}(tensor_field_1.default));
exports.default = TensorFieldInterface;

},{"../impl/tensor_field":13}],21:[function(require,module,exports){
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
    Util.CANVAS_ID = 'map-canvas';
    return Util;
}());
exports.default = Util;

},{}],22:[function(require,module,exports){
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
    Vector.prototype.getWorkerParams = function () {
        return { x: this.x, y: this.y };
    };
    Vector.prototype.length = function () {
        return Math.sqrt(this.lengthSq());
    };
    Vector.prototype.lengthSq = function () {
        return this.x * this.x + this.y * this.y;
    };
    Vector.prototype.mulitply = function (v) {
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

},{"loglevel":3}],23:[function(require,module,exports){

},{}]},{},[6,8,9,10,11,13,12,14,15,17,18,19,20,21,22,23])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvZGF0Lmd1aS9idWlsZC9kYXQuZ3VpLmpzIiwibm9kZV9tb2R1bGVzL2ludGVyYWN0anMvZGlzdC9pbnRlcmFjdC5taW4uanMiLCJub2RlX21vZHVsZXMvbG9nbGV2ZWwvbGliL2xvZ2xldmVsLmpzIiwibm9kZV9tb2R1bGVzL3NpbXBsaWZ5LWpzL3NpbXBsaWZ5LmpzIiwibm9kZV9tb2R1bGVzL3dlYndvcmtpZnkvaW5kZXguanMiLCJzcmMvbWFpbi50cyIsInNyYy90cy9WZWN0b3IudHMiLCJzcmMvdHMvaW1wbC9iYXNpc19maWVsZC50cyIsInNyYy90cy9pbXBsL2dyaWRfc3RvcmFnZS50cyIsInNyYy90cy9pbXBsL2ludGVncmF0b3IudHMiLCJzcmMvdHMvaW1wbC9zdHJlYW1saW5lcy50cyIsInNyYy90cy9pbXBsL3RlbnNvci50cyIsInNyYy90cy9pbXBsL3RlbnNvcl9maWVsZC50cyIsInNyYy90cy9pbXBsL3dvcmtlci9zdHJlYW1saW5lX3dvcmtlci50cyIsInNyYy90cy9pbXBsL3dvcmtlci90ZXN0X3dvcmtlci50cyIsInNyYy90cy9pbXBsL3dvcmtlci93b3JrZXJfcGFyYW1zLnRzIiwic3JjL3RzL2ludGVyZmFjZS9jYW52YXNfd3JhcHBlci50cyIsInNyYy90cy9pbnRlcmZhY2UvZG9tYWluX2NvbnRyb2xsZXIudHMiLCJzcmMvdHMvaW50ZXJmYWNlL2RyYWdfY29udHJvbGxlci50cyIsInNyYy90cy9pbnRlcmZhY2UvdGVuc29yX2ZpZWxkX2ludGVyZmFjZS50cyIsInNyYy90cy91dGlsLnRzIiwic3JjL3RzL3ZlY3Rvci50cyIsInNyYy90cy93ZWJ3b3JraWZ5LmQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3orRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNVFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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ZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24oKXtmdW5jdGlvbiByKGUsbix0KXtmdW5jdGlvbiBvKGksZil7aWYoIW5baV0pe2lmKCFlW2ldKXt2YXIgYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlO2lmKCFmJiZjKXJldHVybiBjKGksITApO2lmKHUpcmV0dXJuIHUoaSwhMCk7dmFyIGE9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitpK1wiJ1wiKTt0aHJvdyBhLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsYX12YXIgcD1uW2ldPXtleHBvcnRzOnt9fTtlW2ldWzBdLmNhbGwocC5leHBvcnRzLGZ1bmN0aW9uKHIpe3ZhciBuPWVbaV1bMV1bcl07cmV0dXJuIG8obnx8cil9LHAscC5leHBvcnRzLHIsZSxuLHQpfXJldHVybiBuW2ldLmV4cG9ydHN9Zm9yKHZhciB1PVwiZnVuY3Rpb25cIj09dHlwZW9mIHJlcXVpcmUmJnJlcXVpcmUsaT0wO2k8dC5sZW5ndGg7aSsrKW8odFtpXSk7cmV0dXJuIG99cmV0dXJuIHJ9KSgpIiwiLyoqXG4gKiBkYXQtZ3VpIEphdmFTY3JpcHQgQ29udHJvbGxlciBMaWJyYXJ5XG4gKiBodHRwOi8vY29kZS5nb29nbGUuY29tL3AvZGF0LWd1aVxuICpcbiAqIENvcHlyaWdodCAyMDExIERhdGEgQXJ0cyBUZWFtLCBHb29nbGUgQ3JlYXRpdmUgTGFiXG4gKlxuICogTGljZW5zZWQgdW5kZXIgdGhlIEFwYWNoZSBMaWNlbnNlLCBWZXJzaW9uIDIuMCAodGhlIFwiTGljZW5zZVwiKTtcbiAqIHlvdSBtYXkgbm90IHVzZSB0aGlzIGZpbGUgZXhjZXB0IGluIGNvbXBsaWFuY2Ugd2l0aCB0aGUgTGljZW5zZS5cbiAqIFlvdSBtYXkgb2J0YWluIGEgY29weSBvZiB0aGUgTGljZW5zZSBhdFxuICpcbiAqIGh0dHA6Ly93d3cuYXBhY2hlLm9yZy9saWNlbnNlcy9MSUNFTlNFLTIuMFxuICovXG5cbihmdW5jdGlvbiAoZ2xvYmFsLCBmYWN0b3J5KSB7XG5cdHR5cGVvZiBleHBvcnRzID09PSAnb2JqZWN0JyAmJiB0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJyA/IGZhY3RvcnkoZXhwb3J0cykgOlxuXHR0eXBlb2YgZGVmaW5lID09PSAnZnVuY3Rpb24nICYmIGRlZmluZS5hbWQgPyBkZWZpbmUoWydleHBvcnRzJ10sIGZhY3RvcnkpIDpcblx0KGZhY3RvcnkoKGdsb2JhbC5kYXQgPSB7fSkpKTtcbn0odGhpcywgKGZ1bmN0aW9uIChleHBvcnRzKSB7ICd1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gX19fJGluc2VydFN0eWxlKGNzcykge1xuICBpZiAoIWNzcykge1xuICAgIHJldHVybjtcbiAgfVxuICBpZiAodHlwZW9mIHdpbmRvdyA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICByZXR1cm47XG4gIH1cblxuICB2YXIgc3R5bGUgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzdHlsZScpO1xuXG4gIHN0eWxlLnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0L2NzcycpO1xuICBzdHlsZS5pbm5lckhUTUwgPSBjc3M7XG4gIGRvY3VtZW50LmhlYWQuYXBwZW5kQ2hpbGQoc3R5bGUpO1xuXG4gIHJldHVybiBjc3M7XG59XG5cbmZ1bmN0aW9uIGNvbG9yVG9TdHJpbmcgKGNvbG9yLCBmb3JjZUNTU0hleCkge1xuICB2YXIgY29sb3JGb3JtYXQgPSBjb2xvci5fX3N0YXRlLmNvbnZlcnNpb25OYW1lLnRvU3RyaW5nKCk7XG4gIHZhciByID0gTWF0aC5yb3VuZChjb2xvci5yKTtcbiAgdmFyIGcgPSBNYXRoLnJvdW5kKGNvbG9yLmcpO1xuICB2YXIgYiA9IE1hdGgucm91bmQoY29sb3IuYik7XG4gIHZhciBhID0gY29sb3IuYTtcbiAgdmFyIGggPSBNYXRoLnJvdW5kKGNvbG9yLmgpO1xuICB2YXIgcyA9IGNvbG9yLnMudG9GaXhlZCgxKTtcbiAgdmFyIHYgPSBjb2xvci52LnRvRml4ZWQoMSk7XG4gIGlmIChmb3JjZUNTU0hleCB8fCBjb2xvckZvcm1hdCA9PT0gJ1RIUkVFX0NIQVJfSEVYJyB8fCBjb2xvckZvcm1hdCA9PT0gJ1NJWF9DSEFSX0hFWCcpIHtcbiAgICB2YXIgc3RyID0gY29sb3IuaGV4LnRvU3RyaW5nKDE2KTtcbiAgICB3aGlsZSAoc3RyLmxlbmd0aCA8IDYpIHtcbiAgICAgIHN0ciA9ICcwJyArIHN0cjtcbiAgICB9XG4gICAgcmV0dXJuICcjJyArIHN0cjtcbiAgfSBlbHNlIGlmIChjb2xvckZvcm1hdCA9PT0gJ0NTU19SR0InKSB7XG4gICAgcmV0dXJuICdyZ2IoJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcpJztcbiAgfSBlbHNlIGlmIChjb2xvckZvcm1hdCA9PT0gJ0NTU19SR0JBJykge1xuICAgIHJldHVybiAncmdiYSgnICsgciArICcsJyArIGcgKyAnLCcgKyBiICsgJywnICsgYSArICcpJztcbiAgfSBlbHNlIGlmIChjb2xvckZvcm1hdCA9PT0gJ0hFWCcpIHtcbiAgICByZXR1cm4gJzB4JyArIGNvbG9yLmhleC50b1N0cmluZygxNik7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdSR0JfQVJSQVknKSB7XG4gICAgcmV0dXJuICdbJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICddJztcbiAgfSBlbHNlIGlmIChjb2xvckZvcm1hdCA9PT0gJ1JHQkFfQVJSQVknKSB7XG4gICAgcmV0dXJuICdbJyArIHIgKyAnLCcgKyBnICsgJywnICsgYiArICcsJyArIGEgKyAnXSc7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdSR0JfT0JKJykge1xuICAgIHJldHVybiAne3I6JyArIHIgKyAnLGc6JyArIGcgKyAnLGI6JyArIGIgKyAnfSc7XG4gIH0gZWxzZSBpZiAoY29sb3JGb3JtYXQgPT09ICdSR0JBX09CSicpIHtcbiAgICByZXR1cm4gJ3tyOicgKyByICsgJyxnOicgKyBnICsgJyxiOicgKyBiICsgJyxhOicgKyBhICsgJ30nO1xuICB9IGVsc2UgaWYgKGNvbG9yRm9ybWF0ID09PSAnSFNWX09CSicpIHtcbiAgICByZXR1cm4gJ3toOicgKyBoICsgJyxzOicgKyBzICsgJyx2OicgKyB2ICsgJ30nO1xuICB9IGVsc2UgaWYgKGNvbG9yRm9ybWF0ID09PSAnSFNWQV9PQkonKSB7XG4gICAgcmV0dXJuICd7aDonICsgaCArICcsczonICsgcyArICcsdjonICsgdiArICcsYTonICsgYSArICd9JztcbiAgfVxuICByZXR1cm4gJ3Vua25vd24gZm9ybWF0Jztcbn1cblxudmFyIEFSUl9FQUNIID0gQXJyYXkucHJvdG90eXBlLmZvckVhY2g7XG52YXIgQVJSX1NMSUNFID0gQXJyYXkucHJvdG90eXBlLnNsaWNlO1xudmFyIENvbW1vbiA9IHtcbiAgQlJFQUs6IHt9LFxuICBleHRlbmQ6IGZ1bmN0aW9uIGV4dGVuZCh0YXJnZXQpIHtcbiAgICB0aGlzLmVhY2goQVJSX1NMSUNFLmNhbGwoYXJndW1lbnRzLCAxKSwgZnVuY3Rpb24gKG9iaikge1xuICAgICAgdmFyIGtleXMgPSB0aGlzLmlzT2JqZWN0KG9iaikgPyBPYmplY3Qua2V5cyhvYmopIDogW107XG4gICAgICBrZXlzLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuICAgICAgICBpZiAoIXRoaXMuaXNVbmRlZmluZWQob2JqW2tleV0pKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9LFxuICBkZWZhdWx0czogZnVuY3Rpb24gZGVmYXVsdHModGFyZ2V0KSB7XG4gICAgdGhpcy5lYWNoKEFSUl9TTElDRS5jYWxsKGFyZ3VtZW50cywgMSksIGZ1bmN0aW9uIChvYmopIHtcbiAgICAgIHZhciBrZXlzID0gdGhpcy5pc09iamVjdChvYmopID8gT2JqZWN0LmtleXMob2JqKSA6IFtdO1xuICAgICAga2V5cy5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcbiAgICAgICAgaWYgKHRoaXMuaXNVbmRlZmluZWQodGFyZ2V0W2tleV0pKSB7XG4gICAgICAgICAgdGFyZ2V0W2tleV0gPSBvYmpba2V5XTtcbiAgICAgICAgfVxuICAgICAgfS5iaW5kKHRoaXMpKTtcbiAgICB9LCB0aGlzKTtcbiAgICByZXR1cm4gdGFyZ2V0O1xuICB9LFxuICBjb21wb3NlOiBmdW5jdGlvbiBjb21wb3NlKCkge1xuICAgIHZhciB0b0NhbGwgPSBBUlJfU0xJQ0UuY2FsbChhcmd1bWVudHMpO1xuICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICB2YXIgYXJncyA9IEFSUl9TTElDRS5jYWxsKGFyZ3VtZW50cyk7XG4gICAgICBmb3IgKHZhciBpID0gdG9DYWxsLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICAgIGFyZ3MgPSBbdG9DYWxsW2ldLmFwcGx5KHRoaXMsIGFyZ3MpXTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBhcmdzWzBdO1xuICAgIH07XG4gIH0sXG4gIGVhY2g6IGZ1bmN0aW9uIGVhY2gob2JqLCBpdHIsIHNjb3BlKSB7XG4gICAgaWYgKCFvYmopIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaWYgKEFSUl9FQUNIICYmIG9iai5mb3JFYWNoICYmIG9iai5mb3JFYWNoID09PSBBUlJfRUFDSCkge1xuICAgICAgb2JqLmZvckVhY2goaXRyLCBzY29wZSk7XG4gICAgfSBlbHNlIGlmIChvYmoubGVuZ3RoID09PSBvYmoubGVuZ3RoICsgMCkge1xuICAgICAgdmFyIGtleSA9IHZvaWQgMDtcbiAgICAgIHZhciBsID0gdm9pZCAwO1xuICAgICAgZm9yIChrZXkgPSAwLCBsID0gb2JqLmxlbmd0aDsga2V5IDwgbDsga2V5KyspIHtcbiAgICAgICAgaWYgKGtleSBpbiBvYmogJiYgaXRyLmNhbGwoc2NvcGUsIG9ialtrZXldLCBrZXkpID09PSB0aGlzLkJSRUFLKSB7XG4gICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAodmFyIF9rZXkgaW4gb2JqKSB7XG4gICAgICAgIGlmIChpdHIuY2FsbChzY29wZSwgb2JqW19rZXldLCBfa2V5KSA9PT0gdGhpcy5CUkVBSykge1xuICAgICAgICAgIHJldHVybjtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSxcbiAgZGVmZXI6IGZ1bmN0aW9uIGRlZmVyKGZuYykge1xuICAgIHNldFRpbWVvdXQoZm5jLCAwKTtcbiAgfSxcbiAgZGVib3VuY2U6IGZ1bmN0aW9uIGRlYm91bmNlKGZ1bmMsIHRocmVzaG9sZCwgY2FsbEltbWVkaWF0ZWx5KSB7XG4gICAgdmFyIHRpbWVvdXQgPSB2b2lkIDA7XG4gICAgcmV0dXJuIGZ1bmN0aW9uICgpIHtcbiAgICAgIHZhciBvYmogPSB0aGlzO1xuICAgICAgdmFyIGFyZ3MgPSBhcmd1bWVudHM7XG4gICAgICBmdW5jdGlvbiBkZWxheWVkKCkge1xuICAgICAgICB0aW1lb3V0ID0gbnVsbDtcbiAgICAgICAgaWYgKCFjYWxsSW1tZWRpYXRlbHkpIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICAgIHZhciBjYWxsTm93ID0gY2FsbEltbWVkaWF0ZWx5IHx8ICF0aW1lb3V0O1xuICAgICAgY2xlYXJUaW1lb3V0KHRpbWVvdXQpO1xuICAgICAgdGltZW91dCA9IHNldFRpbWVvdXQoZGVsYXllZCwgdGhyZXNob2xkKTtcbiAgICAgIGlmIChjYWxsTm93KSB7XG4gICAgICAgIGZ1bmMuYXBwbHkob2JqLCBhcmdzKTtcbiAgICAgIH1cbiAgICB9O1xuICB9LFxuICB0b0FycmF5OiBmdW5jdGlvbiB0b0FycmF5KG9iaikge1xuICAgIGlmIChvYmoudG9BcnJheSkgcmV0dXJuIG9iai50b0FycmF5KCk7XG4gICAgcmV0dXJuIEFSUl9TTElDRS5jYWxsKG9iaik7XG4gIH0sXG4gIGlzVW5kZWZpbmVkOiBmdW5jdGlvbiBpc1VuZGVmaW5lZChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSB1bmRlZmluZWQ7XG4gIH0sXG4gIGlzTnVsbDogZnVuY3Rpb24gaXNOdWxsKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG51bGw7XG4gIH0sXG4gIGlzTmFOOiBmdW5jdGlvbiAoX2lzTmFOKSB7XG4gICAgZnVuY3Rpb24gaXNOYU4oX3gpIHtcbiAgICAgIHJldHVybiBfaXNOYU4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB9XG4gICAgaXNOYU4udG9TdHJpbmcgPSBmdW5jdGlvbiAoKSB7XG4gICAgICByZXR1cm4gX2lzTmFOLnRvU3RyaW5nKCk7XG4gICAgfTtcbiAgICByZXR1cm4gaXNOYU47XG4gIH0oZnVuY3Rpb24gKG9iaikge1xuICAgIHJldHVybiBpc05hTihvYmopO1xuICB9KSxcbiAgaXNBcnJheTogQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAob2JqKSB7XG4gICAgcmV0dXJuIG9iai5jb25zdHJ1Y3RvciA9PT0gQXJyYXk7XG4gIH0sXG4gIGlzT2JqZWN0OiBmdW5jdGlvbiBpc09iamVjdChvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBPYmplY3Qob2JqKTtcbiAgfSxcbiAgaXNOdW1iZXI6IGZ1bmN0aW9uIGlzTnVtYmVyKG9iaikge1xuICAgIHJldHVybiBvYmogPT09IG9iaiArIDA7XG4gIH0sXG4gIGlzU3RyaW5nOiBmdW5jdGlvbiBpc1N0cmluZyhvYmopIHtcbiAgICByZXR1cm4gb2JqID09PSBvYmogKyAnJztcbiAgfSxcbiAgaXNCb29sZWFuOiBmdW5jdGlvbiBpc0Jvb2xlYW4ob2JqKSB7XG4gICAgcmV0dXJuIG9iaiA9PT0gZmFsc2UgfHwgb2JqID09PSB0cnVlO1xuICB9LFxuICBpc0Z1bmN0aW9uOiBmdW5jdGlvbiBpc0Z1bmN0aW9uKG9iaikge1xuICAgIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwob2JqKSA9PT0gJ1tvYmplY3QgRnVuY3Rpb25dJztcbiAgfVxufTtcblxudmFyIElOVEVSUFJFVEFUSU9OUyA9IFtcbntcbiAgbGl0bXVzOiBDb21tb24uaXNTdHJpbmcsXG4gIGNvbnZlcnNpb25zOiB7XG4gICAgVEhSRUVfQ0hBUl9IRVg6IHtcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQob3JpZ2luYWwpIHtcbiAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXiMoW0EtRjAtOV0pKFtBLUYwLTldKShbQS1GMC05XSkkL2kpO1xuICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICBoZXg6IHBhcnNlSW50KCcweCcgKyB0ZXN0WzFdLnRvU3RyaW5nKCkgKyB0ZXN0WzFdLnRvU3RyaW5nKCkgKyB0ZXN0WzJdLnRvU3RyaW5nKCkgKyB0ZXN0WzJdLnRvU3RyaW5nKCkgKyB0ZXN0WzNdLnRvU3RyaW5nKCkgKyB0ZXN0WzNdLnRvU3RyaW5nKCksIDApXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGNvbG9yVG9TdHJpbmdcbiAgICB9LFxuICAgIFNJWF9DSEFSX0hFWDoge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICB2YXIgdGVzdCA9IG9yaWdpbmFsLm1hdGNoKC9eIyhbQS1GMC05XXs2fSkkL2kpO1xuICAgICAgICBpZiAodGVzdCA9PT0gbnVsbCkge1xuICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHNwYWNlOiAnSEVYJyxcbiAgICAgICAgICBoZXg6IHBhcnNlSW50KCcweCcgKyB0ZXN0WzFdLnRvU3RyaW5nKCksIDApXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGNvbG9yVG9TdHJpbmdcbiAgICB9LFxuICAgIENTU19SR0I6IHtcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQob3JpZ2luYWwpIHtcbiAgICAgICAgdmFyIHRlc3QgPSBvcmlnaW5hbC5tYXRjaCgvXnJnYlxcKFxccyooLispXFxzKixcXHMqKC4rKVxccyosXFxzKiguKylcXHMqXFwpLyk7XG4gICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgIHI6IHBhcnNlRmxvYXQodGVzdFsxXSksXG4gICAgICAgICAgZzogcGFyc2VGbG9hdCh0ZXN0WzJdKSxcbiAgICAgICAgICBiOiBwYXJzZUZsb2F0KHRlc3RbM10pXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGNvbG9yVG9TdHJpbmdcbiAgICB9LFxuICAgIENTU19SR0JBOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIHZhciB0ZXN0ID0gb3JpZ2luYWwubWF0Y2goL15yZ2JhXFwoXFxzKiguKylcXHMqLFxccyooLispXFxzKixcXHMqKC4rKVxccyosXFxzKiguKylcXHMqXFwpLyk7XG4gICAgICAgIGlmICh0ZXN0ID09PSBudWxsKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgIHI6IHBhcnNlRmxvYXQodGVzdFsxXSksXG4gICAgICAgICAgZzogcGFyc2VGbG9hdCh0ZXN0WzJdKSxcbiAgICAgICAgICBiOiBwYXJzZUZsb2F0KHRlc3RbM10pLFxuICAgICAgICAgIGE6IHBhcnNlRmxvYXQodGVzdFs0XSlcbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICB3cml0ZTogY29sb3JUb1N0cmluZ1xuICAgIH1cbiAgfVxufSxcbntcbiAgbGl0bXVzOiBDb21tb24uaXNOdW1iZXIsXG4gIGNvbnZlcnNpb25zOiB7XG4gICAgSEVYOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6ICdIRVgnLFxuICAgICAgICAgIGhleDogb3JpZ2luYWwsXG4gICAgICAgICAgY29udmVyc2lvbk5hbWU6ICdIRVgnXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiBjb2xvci5oZXg7XG4gICAgICB9XG4gICAgfVxuICB9XG59LFxue1xuICBsaXRtdXM6IENvbW1vbi5pc0FycmF5LFxuICBjb252ZXJzaW9uczoge1xuICAgIFJHQl9BUlJBWToge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICBpZiAob3JpZ2luYWwubGVuZ3RoICE9PSAzKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgIHI6IG9yaWdpbmFsWzBdLFxuICAgICAgICAgIGc6IG9yaWdpbmFsWzFdLFxuICAgICAgICAgIGI6IG9yaWdpbmFsWzJdXG4gICAgICAgIH07XG4gICAgICB9LFxuICAgICAgd3JpdGU6IGZ1bmN0aW9uIHdyaXRlKGNvbG9yKSB7XG4gICAgICAgIHJldHVybiBbY29sb3IuciwgY29sb3IuZywgY29sb3IuYl07XG4gICAgICB9XG4gICAgfSxcbiAgICBSR0JBX0FSUkFZOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIGlmIChvcmlnaW5hbC5sZW5ndGggIT09IDQpIHJldHVybiBmYWxzZTtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBzcGFjZTogJ1JHQicsXG4gICAgICAgICAgcjogb3JpZ2luYWxbMF0sXG4gICAgICAgICAgZzogb3JpZ2luYWxbMV0sXG4gICAgICAgICAgYjogb3JpZ2luYWxbMl0sXG4gICAgICAgICAgYTogb3JpZ2luYWxbM11cbiAgICAgICAgfTtcbiAgICAgIH0sXG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuIFtjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iLCBjb2xvci5hXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn0sXG57XG4gIGxpdG11czogQ29tbW9uLmlzT2JqZWN0LFxuICBjb252ZXJzaW9uczoge1xuICAgIFJHQkFfT0JKOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIGlmIChDb21tb24uaXNOdW1iZXIob3JpZ2luYWwucikgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmcpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5iKSAmJiBDb21tb24uaXNOdW1iZXIob3JpZ2luYWwuYSkpIHtcbiAgICAgICAgICByZXR1cm4ge1xuICAgICAgICAgICAgc3BhY2U6ICdSR0InLFxuICAgICAgICAgICAgcjogb3JpZ2luYWwucixcbiAgICAgICAgICAgIGc6IG9yaWdpbmFsLmcsXG4gICAgICAgICAgICBiOiBvcmlnaW5hbC5iLFxuICAgICAgICAgICAgYTogb3JpZ2luYWwuYVxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShjb2xvcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHI6IGNvbG9yLnIsXG4gICAgICAgICAgZzogY29sb3IuZyxcbiAgICAgICAgICBiOiBjb2xvci5iLFxuICAgICAgICAgIGE6IGNvbG9yLmFcbiAgICAgICAgfTtcbiAgICAgIH1cbiAgICB9LFxuICAgIFJHQl9PQko6IHtcbiAgICAgIHJlYWQ6IGZ1bmN0aW9uIHJlYWQob3JpZ2luYWwpIHtcbiAgICAgICAgaWYgKENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5yKSAmJiBDb21tb24uaXNOdW1iZXIob3JpZ2luYWwuZykgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmIpKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNwYWNlOiAnUkdCJyxcbiAgICAgICAgICAgIHI6IG9yaWdpbmFsLnIsXG4gICAgICAgICAgICBnOiBvcmlnaW5hbC5nLFxuICAgICAgICAgICAgYjogb3JpZ2luYWwuYlxuICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgfSxcbiAgICAgIHdyaXRlOiBmdW5jdGlvbiB3cml0ZShjb2xvcikge1xuICAgICAgICByZXR1cm4ge1xuICAgICAgICAgIHI6IGNvbG9yLnIsXG4gICAgICAgICAgZzogY29sb3IuZyxcbiAgICAgICAgICBiOiBjb2xvci5iXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBIU1ZBX09CSjoge1xuICAgICAgcmVhZDogZnVuY3Rpb24gcmVhZChvcmlnaW5hbCkge1xuICAgICAgICBpZiAoQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmgpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC5zKSAmJiBDb21tb24uaXNOdW1iZXIob3JpZ2luYWwudikgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLmEpKSB7XG4gICAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHNwYWNlOiAnSFNWJyxcbiAgICAgICAgICAgIGg6IG9yaWdpbmFsLmgsXG4gICAgICAgICAgICBzOiBvcmlnaW5hbC5zLFxuICAgICAgICAgICAgdjogb3JpZ2luYWwudixcbiAgICAgICAgICAgIGE6IG9yaWdpbmFsLmFcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoOiBjb2xvci5oLFxuICAgICAgICAgIHM6IGNvbG9yLnMsXG4gICAgICAgICAgdjogY29sb3IudixcbiAgICAgICAgICBhOiBjb2xvci5hXG4gICAgICAgIH07XG4gICAgICB9XG4gICAgfSxcbiAgICBIU1ZfT0JKOiB7XG4gICAgICByZWFkOiBmdW5jdGlvbiByZWFkKG9yaWdpbmFsKSB7XG4gICAgICAgIGlmIChDb21tb24uaXNOdW1iZXIob3JpZ2luYWwuaCkgJiYgQ29tbW9uLmlzTnVtYmVyKG9yaWdpbmFsLnMpICYmIENvbW1vbi5pc051bWJlcihvcmlnaW5hbC52KSkge1xuICAgICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBzcGFjZTogJ0hTVicsXG4gICAgICAgICAgICBoOiBvcmlnaW5hbC5oLFxuICAgICAgICAgICAgczogb3JpZ2luYWwucyxcbiAgICAgICAgICAgIHY6IG9yaWdpbmFsLnZcbiAgICAgICAgICB9O1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgIH0sXG4gICAgICB3cml0ZTogZnVuY3Rpb24gd3JpdGUoY29sb3IpIHtcbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICBoOiBjb2xvci5oLFxuICAgICAgICAgIHM6IGNvbG9yLnMsXG4gICAgICAgICAgdjogY29sb3IudlxuICAgICAgICB9O1xuICAgICAgfVxuICAgIH1cbiAgfVxufV07XG52YXIgcmVzdWx0ID0gdm9pZCAwO1xudmFyIHRvUmV0dXJuID0gdm9pZCAwO1xudmFyIGludGVycHJldCA9IGZ1bmN0aW9uIGludGVycHJldCgpIHtcbiAgdG9SZXR1cm4gPSBmYWxzZTtcbiAgdmFyIG9yaWdpbmFsID0gYXJndW1lbnRzLmxlbmd0aCA+IDEgPyBDb21tb24udG9BcnJheShhcmd1bWVudHMpIDogYXJndW1lbnRzWzBdO1xuICBDb21tb24uZWFjaChJTlRFUlBSRVRBVElPTlMsIGZ1bmN0aW9uIChmYW1pbHkpIHtcbiAgICBpZiAoZmFtaWx5LmxpdG11cyhvcmlnaW5hbCkpIHtcbiAgICAgIENvbW1vbi5lYWNoKGZhbWlseS5jb252ZXJzaW9ucywgZnVuY3Rpb24gKGNvbnZlcnNpb24sIGNvbnZlcnNpb25OYW1lKSB7XG4gICAgICAgIHJlc3VsdCA9IGNvbnZlcnNpb24ucmVhZChvcmlnaW5hbCk7XG4gICAgICAgIGlmICh0b1JldHVybiA9PT0gZmFsc2UgJiYgcmVzdWx0ICE9PSBmYWxzZSkge1xuICAgICAgICAgIHRvUmV0dXJuID0gcmVzdWx0O1xuICAgICAgICAgIHJlc3VsdC5jb252ZXJzaW9uTmFtZSA9IGNvbnZlcnNpb25OYW1lO1xuICAgICAgICAgIHJlc3VsdC5jb252ZXJzaW9uID0gY29udmVyc2lvbjtcbiAgICAgICAgICByZXR1cm4gQ29tbW9uLkJSRUFLO1xuICAgICAgICB9XG4gICAgICB9KTtcbiAgICAgIHJldHVybiBDb21tb24uQlJFQUs7XG4gICAgfVxuICB9KTtcbiAgcmV0dXJuIHRvUmV0dXJuO1xufTtcblxudmFyIHRtcENvbXBvbmVudCA9IHZvaWQgMDtcbnZhciBDb2xvck1hdGggPSB7XG4gIGhzdl90b19yZ2I6IGZ1bmN0aW9uIGhzdl90b19yZ2IoaCwgcywgdikge1xuICAgIHZhciBoaSA9IE1hdGguZmxvb3IoaCAvIDYwKSAlIDY7XG4gICAgdmFyIGYgPSBoIC8gNjAgLSBNYXRoLmZsb29yKGggLyA2MCk7XG4gICAgdmFyIHAgPSB2ICogKDEuMCAtIHMpO1xuICAgIHZhciBxID0gdiAqICgxLjAgLSBmICogcyk7XG4gICAgdmFyIHQgPSB2ICogKDEuMCAtICgxLjAgLSBmKSAqIHMpO1xuICAgIHZhciBjID0gW1t2LCB0LCBwXSwgW3EsIHYsIHBdLCBbcCwgdiwgdF0sIFtwLCBxLCB2XSwgW3QsIHAsIHZdLCBbdiwgcCwgcV1dW2hpXTtcbiAgICByZXR1cm4ge1xuICAgICAgcjogY1swXSAqIDI1NSxcbiAgICAgIGc6IGNbMV0gKiAyNTUsXG4gICAgICBiOiBjWzJdICogMjU1XG4gICAgfTtcbiAgfSxcbiAgcmdiX3RvX2hzdjogZnVuY3Rpb24gcmdiX3RvX2hzdihyLCBnLCBiKSB7XG4gICAgdmFyIG1pbiA9IE1hdGgubWluKHIsIGcsIGIpO1xuICAgIHZhciBtYXggPSBNYXRoLm1heChyLCBnLCBiKTtcbiAgICB2YXIgZGVsdGEgPSBtYXggLSBtaW47XG4gICAgdmFyIGggPSB2b2lkIDA7XG4gICAgdmFyIHMgPSB2b2lkIDA7XG4gICAgaWYgKG1heCAhPT0gMCkge1xuICAgICAgcyA9IGRlbHRhIC8gbWF4O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge1xuICAgICAgICBoOiBOYU4sXG4gICAgICAgIHM6IDAsXG4gICAgICAgIHY6IDBcbiAgICAgIH07XG4gICAgfVxuICAgIGlmIChyID09PSBtYXgpIHtcbiAgICAgIGggPSAoZyAtIGIpIC8gZGVsdGE7XG4gICAgfSBlbHNlIGlmIChnID09PSBtYXgpIHtcbiAgICAgIGggPSAyICsgKGIgLSByKSAvIGRlbHRhO1xuICAgIH0gZWxzZSB7XG4gICAgICBoID0gNCArIChyIC0gZykgLyBkZWx0YTtcbiAgICB9XG4gICAgaCAvPSA2O1xuICAgIGlmIChoIDwgMCkge1xuICAgICAgaCArPSAxO1xuICAgIH1cbiAgICByZXR1cm4ge1xuICAgICAgaDogaCAqIDM2MCxcbiAgICAgIHM6IHMsXG4gICAgICB2OiBtYXggLyAyNTVcbiAgICB9O1xuICB9LFxuICByZ2JfdG9faGV4OiBmdW5jdGlvbiByZ2JfdG9faGV4KHIsIGcsIGIpIHtcbiAgICB2YXIgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoMCwgMiwgcik7XG4gICAgaGV4ID0gdGhpcy5oZXhfd2l0aF9jb21wb25lbnQoaGV4LCAxLCBnKTtcbiAgICBoZXggPSB0aGlzLmhleF93aXRoX2NvbXBvbmVudChoZXgsIDAsIGIpO1xuICAgIHJldHVybiBoZXg7XG4gIH0sXG4gIGNvbXBvbmVudF9mcm9tX2hleDogZnVuY3Rpb24gY29tcG9uZW50X2Zyb21faGV4KGhleCwgY29tcG9uZW50SW5kZXgpIHtcbiAgICByZXR1cm4gaGV4ID4+IGNvbXBvbmVudEluZGV4ICogOCAmIDB4RkY7XG4gIH0sXG4gIGhleF93aXRoX2NvbXBvbmVudDogZnVuY3Rpb24gaGV4X3dpdGhfY29tcG9uZW50KGhleCwgY29tcG9uZW50SW5kZXgsIHZhbHVlKSB7XG4gICAgcmV0dXJuIHZhbHVlIDw8ICh0bXBDb21wb25lbnQgPSBjb21wb25lbnRJbmRleCAqIDgpIHwgaGV4ICYgfigweEZGIDw8IHRtcENvbXBvbmVudCk7XG4gIH1cbn07XG5cbnZhciBfdHlwZW9mID0gdHlwZW9mIFN5bWJvbCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBTeW1ib2wuaXRlcmF0b3IgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7XG4gIHJldHVybiB0eXBlb2Ygb2JqO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgU3ltYm9sID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBTeW1ib2wgJiYgb2JqICE9PSBTeW1ib2wucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBjbGFzc0NhbGxDaGVjayA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59O1xuXG52YXIgY3JlYXRlQ2xhc3MgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXModGFyZ2V0LCBwcm9wcykge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgcHJvcHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHZhciBkZXNjcmlwdG9yID0gcHJvcHNbaV07XG4gICAgICBkZXNjcmlwdG9yLmVudW1lcmFibGUgPSBkZXNjcmlwdG9yLmVudW1lcmFibGUgfHwgZmFsc2U7XG4gICAgICBkZXNjcmlwdG9yLmNvbmZpZ3VyYWJsZSA9IHRydWU7XG4gICAgICBpZiAoXCJ2YWx1ZVwiIGluIGRlc2NyaXB0b3IpIGRlc2NyaXB0b3Iud3JpdGFibGUgPSB0cnVlO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7XG5cblxuXG5cblxuXG5cbnZhciBnZXQgPSBmdW5jdGlvbiBnZXQob2JqZWN0LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpIHtcbiAgaWYgKG9iamVjdCA9PT0gbnVsbCkgb2JqZWN0ID0gRnVuY3Rpb24ucHJvdG90eXBlO1xuICB2YXIgZGVzYyA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3Iob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBwYXJlbnQgPSBPYmplY3QuZ2V0UHJvdG90eXBlT2Yob2JqZWN0KTtcblxuICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICB9XG59O1xuXG52YXIgaW5oZXJpdHMgPSBmdW5jdGlvbiAoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIHtcbiAgaWYgKHR5cGVvZiBzdXBlckNsYXNzICE9PSBcImZ1bmN0aW9uXCIgJiYgc3VwZXJDbGFzcyAhPT0gbnVsbCkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvbiwgbm90IFwiICsgdHlwZW9mIHN1cGVyQ2xhc3MpO1xuICB9XG5cbiAgc3ViQ2xhc3MucHJvdG90eXBlID0gT2JqZWN0LmNyZWF0ZShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgT2JqZWN0LnNldFByb3RvdHlwZU9mID8gT2JqZWN0LnNldFByb3RvdHlwZU9mKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59O1xuXG5cblxuXG5cblxuXG5cblxuXG5cbnZhciBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuID0gZnVuY3Rpb24gKHNlbGYsIGNhbGwpIHtcbiAgaWYgKCFzZWxmKSB7XG4gICAgdGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpO1xuICB9XG5cbiAgcmV0dXJuIGNhbGwgJiYgKHR5cGVvZiBjYWxsID09PSBcIm9iamVjdFwiIHx8IHR5cGVvZiBjYWxsID09PSBcImZ1bmN0aW9uXCIpID8gY2FsbCA6IHNlbGY7XG59O1xuXG52YXIgQ29sb3IgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbG9yKCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENvbG9yKTtcbiAgICB0aGlzLl9fc3RhdGUgPSBpbnRlcnByZXQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBpZiAodGhpcy5fX3N0YXRlID09PSBmYWxzZSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdGYWlsZWQgdG8gaW50ZXJwcmV0IGNvbG9yIGFyZ3VtZW50cycpO1xuICAgIH1cbiAgICB0aGlzLl9fc3RhdGUuYSA9IHRoaXMuX19zdGF0ZS5hIHx8IDE7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoQ29sb3IsIFt7XG4gICAga2V5OiAndG9TdHJpbmcnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB0b1N0cmluZygpIHtcbiAgICAgIHJldHVybiBjb2xvclRvU3RyaW5nKHRoaXMpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3RvSGV4U3RyaW5nJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9IZXhTdHJpbmcoKSB7XG4gICAgICByZXR1cm4gY29sb3JUb1N0cmluZyh0aGlzLCB0cnVlKTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd0b09yaWdpbmFsJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdG9PcmlnaW5hbCgpIHtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGUuY29udmVyc2lvbi53cml0ZSh0aGlzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIENvbG9yO1xufSgpO1xuZnVuY3Rpb24gZGVmaW5lUkdCQ29tcG9uZW50KHRhcmdldCwgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCkge1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkodGFyZ2V0LCBjb21wb25lbnQsIHtcbiAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgPT09ICdSR0InKSB7XG4gICAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcbiAgICAgIH1cbiAgICAgIENvbG9yLnJlY2FsY3VsYXRlUkdCKHRoaXMsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXgpO1xuICAgICAgcmV0dXJuIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdO1xuICAgIH0sXG4gICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgICAgaWYgKHRoaXMuX19zdGF0ZS5zcGFjZSAhPT0gJ1JHQicpIHtcbiAgICAgICAgQ29sb3IucmVjYWxjdWxhdGVSR0IodGhpcywgY29tcG9uZW50LCBjb21wb25lbnRIZXhJbmRleCk7XG4gICAgICAgIHRoaXMuX19zdGF0ZS5zcGFjZSA9ICdSR0InO1xuICAgICAgfVxuICAgICAgdGhpcy5fX3N0YXRlW2NvbXBvbmVudF0gPSB2O1xuICAgIH1cbiAgfSk7XG59XG5mdW5jdGlvbiBkZWZpbmVIU1ZDb21wb25lbnQodGFyZ2V0LCBjb21wb25lbnQpIHtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHRhcmdldCwgY29tcG9uZW50LCB7XG4gICAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgICBpZiAodGhpcy5fX3N0YXRlLnNwYWNlID09PSAnSFNWJykge1xuICAgICAgICByZXR1cm4gdGhpcy5fX3N0YXRlW2NvbXBvbmVudF07XG4gICAgICB9XG4gICAgICBDb2xvci5yZWNhbGN1bGF0ZUhTVih0aGlzKTtcbiAgICAgIHJldHVybiB0aGlzLl9fc3RhdGVbY29tcG9uZW50XTtcbiAgICB9LFxuICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKHYpIHtcbiAgICAgIGlmICh0aGlzLl9fc3RhdGUuc3BhY2UgIT09ICdIU1YnKSB7XG4gICAgICAgIENvbG9yLnJlY2FsY3VsYXRlSFNWKHRoaXMpO1xuICAgICAgICB0aGlzLl9fc3RhdGUuc3BhY2UgPSAnSFNWJztcbiAgICAgIH1cbiAgICAgIHRoaXMuX19zdGF0ZVtjb21wb25lbnRdID0gdjtcbiAgICB9XG4gIH0pO1xufVxuQ29sb3IucmVjYWxjdWxhdGVSR0IgPSBmdW5jdGlvbiAoY29sb3IsIGNvbXBvbmVudCwgY29tcG9uZW50SGV4SW5kZXgpIHtcbiAgaWYgKGNvbG9yLl9fc3RhdGUuc3BhY2UgPT09ICdIRVgnKSB7XG4gICAgY29sb3IuX19zdGF0ZVtjb21wb25lbnRdID0gQ29sb3JNYXRoLmNvbXBvbmVudF9mcm9tX2hleChjb2xvci5fX3N0YXRlLmhleCwgY29tcG9uZW50SGV4SW5kZXgpO1xuICB9IGVsc2UgaWYgKGNvbG9yLl9fc3RhdGUuc3BhY2UgPT09ICdIU1YnKSB7XG4gICAgQ29tbW9uLmV4dGVuZChjb2xvci5fX3N0YXRlLCBDb2xvck1hdGguaHN2X3RvX3JnYihjb2xvci5fX3N0YXRlLmgsIGNvbG9yLl9fc3RhdGUucywgY29sb3IuX19zdGF0ZS52KSk7XG4gIH0gZWxzZSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdDb3JydXB0ZWQgY29sb3Igc3RhdGUnKTtcbiAgfVxufTtcbkNvbG9yLnJlY2FsY3VsYXRlSFNWID0gZnVuY3Rpb24gKGNvbG9yKSB7XG4gIHZhciByZXN1bHQgPSBDb2xvck1hdGgucmdiX3RvX2hzdihjb2xvci5yLCBjb2xvci5nLCBjb2xvci5iKTtcbiAgQ29tbW9uLmV4dGVuZChjb2xvci5fX3N0YXRlLCB7XG4gICAgczogcmVzdWx0LnMsXG4gICAgdjogcmVzdWx0LnZcbiAgfSk7XG4gIGlmICghQ29tbW9uLmlzTmFOKHJlc3VsdC5oKSkge1xuICAgIGNvbG9yLl9fc3RhdGUuaCA9IHJlc3VsdC5oO1xuICB9IGVsc2UgaWYgKENvbW1vbi5pc1VuZGVmaW5lZChjb2xvci5fX3N0YXRlLmgpKSB7XG4gICAgY29sb3IuX19zdGF0ZS5oID0gMDtcbiAgfVxufTtcbkNvbG9yLkNPTVBPTkVOVFMgPSBbJ3InLCAnZycsICdiJywgJ2gnLCAncycsICd2JywgJ2hleCcsICdhJ107XG5kZWZpbmVSR0JDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAncicsIDIpO1xuZGVmaW5lUkdCQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ2cnLCAxKTtcbmRlZmluZVJHQkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICdiJywgMCk7XG5kZWZpbmVIU1ZDb21wb25lbnQoQ29sb3IucHJvdG90eXBlLCAnaCcpO1xuZGVmaW5lSFNWQ29tcG9uZW50KENvbG9yLnByb3RvdHlwZSwgJ3MnKTtcbmRlZmluZUhTVkNvbXBvbmVudChDb2xvci5wcm90b3R5cGUsICd2Jyk7XG5PYmplY3QuZGVmaW5lUHJvcGVydHkoQ29sb3IucHJvdG90eXBlLCAnYScsIHtcbiAgZ2V0OiBmdW5jdGlvbiBnZXQkJDEoKSB7XG4gICAgcmV0dXJuIHRoaXMuX19zdGF0ZS5hO1xuICB9LFxuICBzZXQ6IGZ1bmN0aW9uIHNldCQkMSh2KSB7XG4gICAgdGhpcy5fX3N0YXRlLmEgPSB2O1xuICB9XG59KTtcbk9iamVjdC5kZWZpbmVQcm9wZXJ0eShDb2xvci5wcm90b3R5cGUsICdoZXgnLCB7XG4gIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgIGlmICghdGhpcy5fX3N0YXRlLnNwYWNlICE9PSAnSEVYJykge1xuICAgICAgdGhpcy5fX3N0YXRlLmhleCA9IENvbG9yTWF0aC5yZ2JfdG9faGV4KHRoaXMuciwgdGhpcy5nLCB0aGlzLmIpO1xuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fX3N0YXRlLmhleDtcbiAgfSxcbiAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgIHRoaXMuX19zdGF0ZS5zcGFjZSA9ICdIRVgnO1xuICAgIHRoaXMuX19zdGF0ZS5oZXggPSB2O1xuICB9XG59KTtcblxudmFyIENvbnRyb2xsZXIgPSBmdW5jdGlvbiAoKSB7XG4gIGZ1bmN0aW9uIENvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENvbnRyb2xsZXIpO1xuICAgIHRoaXMuaW5pdGlhbFZhbHVlID0gb2JqZWN0W3Byb3BlcnR5XTtcbiAgICB0aGlzLmRvbUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLm9iamVjdCA9IG9iamVjdDtcbiAgICB0aGlzLnByb3BlcnR5ID0gcHJvcGVydHk7XG4gICAgdGhpcy5fX29uQ2hhbmdlID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZSA9IHVuZGVmaW5lZDtcbiAgfVxuICBjcmVhdGVDbGFzcyhDb250cm9sbGVyLCBbe1xuICAgIGtleTogJ29uQ2hhbmdlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gb25DaGFuZ2UoZm5jKSB7XG4gICAgICB0aGlzLl9fb25DaGFuZ2UgPSBmbmM7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdvbkZpbmlzaENoYW5nZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG9uRmluaXNoQ2hhbmdlKGZuYykge1xuICAgICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlID0gZm5jO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnc2V0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZShuZXdWYWx1ZSkge1xuICAgICAgdGhpcy5vYmplY3RbdGhpcy5wcm9wZXJ0eV0gPSBuZXdWYWx1ZTtcbiAgICAgIGlmICh0aGlzLl9fb25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fX29uQ2hhbmdlLmNhbGwodGhpcywgbmV3VmFsdWUpO1xuICAgICAgfVxuICAgICAgdGhpcy51cGRhdGVEaXNwbGF5KCk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdnZXRWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGdldFZhbHVlKCkge1xuICAgICAgcmV0dXJuIHRoaXMub2JqZWN0W3RoaXMucHJvcGVydHldO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VwZGF0ZURpc3BsYXknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnaXNNb2RpZmllZCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGlzTW9kaWZpZWQoKSB7XG4gICAgICByZXR1cm4gdGhpcy5pbml0aWFsVmFsdWUgIT09IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIENvbnRyb2xsZXI7XG59KCk7XG5cbnZhciBFVkVOVF9NQVAgPSB7XG4gIEhUTUxFdmVudHM6IFsnY2hhbmdlJ10sXG4gIE1vdXNlRXZlbnRzOiBbJ2NsaWNrJywgJ21vdXNlbW92ZScsICdtb3VzZWRvd24nLCAnbW91c2V1cCcsICdtb3VzZW92ZXInXSxcbiAgS2V5Ym9hcmRFdmVudHM6IFsna2V5ZG93biddXG59O1xudmFyIEVWRU5UX01BUF9JTlYgPSB7fTtcbkNvbW1vbi5lYWNoKEVWRU5UX01BUCwgZnVuY3Rpb24gKHYsIGspIHtcbiAgQ29tbW9uLmVhY2godiwgZnVuY3Rpb24gKGUpIHtcbiAgICBFVkVOVF9NQVBfSU5WW2VdID0gaztcbiAgfSk7XG59KTtcbnZhciBDU1NfVkFMVUVfUElYRUxTID0gLyhcXGQrKFxcLlxcZCspPylweC87XG5mdW5jdGlvbiBjc3NWYWx1ZVRvUGl4ZWxzKHZhbCkge1xuICBpZiAodmFsID09PSAnMCcgfHwgQ29tbW9uLmlzVW5kZWZpbmVkKHZhbCkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuICB2YXIgbWF0Y2ggPSB2YWwubWF0Y2goQ1NTX1ZBTFVFX1BJWEVMUyk7XG4gIGlmICghQ29tbW9uLmlzTnVsbChtYXRjaCkpIHtcbiAgICByZXR1cm4gcGFyc2VGbG9hdChtYXRjaFsxXSk7XG4gIH1cbiAgcmV0dXJuIDA7XG59XG52YXIgZG9tID0ge1xuICBtYWtlU2VsZWN0YWJsZTogZnVuY3Rpb24gbWFrZVNlbGVjdGFibGUoZWxlbSwgc2VsZWN0YWJsZSkge1xuICAgIGlmIChlbGVtID09PSB1bmRlZmluZWQgfHwgZWxlbS5zdHlsZSA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG4gICAgZWxlbS5vbnNlbGVjdHN0YXJ0ID0gc2VsZWN0YWJsZSA/IGZ1bmN0aW9uICgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IDogZnVuY3Rpb24gKCkge307XG4gICAgZWxlbS5zdHlsZS5Nb3pVc2VyU2VsZWN0ID0gc2VsZWN0YWJsZSA/ICdhdXRvJyA6ICdub25lJztcbiAgICBlbGVtLnN0eWxlLktodG1sVXNlclNlbGVjdCA9IHNlbGVjdGFibGUgPyAnYXV0bycgOiAnbm9uZSc7XG4gICAgZWxlbS51bnNlbGVjdGFibGUgPSBzZWxlY3RhYmxlID8gJ29uJyA6ICdvZmYnO1xuICB9LFxuICBtYWtlRnVsbHNjcmVlbjogZnVuY3Rpb24gbWFrZUZ1bGxzY3JlZW4oZWxlbSwgaG9yLCB2ZXJ0KSB7XG4gICAgdmFyIHZlcnRpY2FsID0gdmVydDtcbiAgICB2YXIgaG9yaXpvbnRhbCA9IGhvcjtcbiAgICBpZiAoQ29tbW9uLmlzVW5kZWZpbmVkKGhvcml6b250YWwpKSB7XG4gICAgICBob3Jpem9udGFsID0gdHJ1ZTtcbiAgICB9XG4gICAgaWYgKENvbW1vbi5pc1VuZGVmaW5lZCh2ZXJ0aWNhbCkpIHtcbiAgICAgIHZlcnRpY2FsID0gdHJ1ZTtcbiAgICB9XG4gICAgZWxlbS5zdHlsZS5wb3NpdGlvbiA9ICdhYnNvbHV0ZSc7XG4gICAgaWYgKGhvcml6b250YWwpIHtcbiAgICAgIGVsZW0uc3R5bGUubGVmdCA9IDA7XG4gICAgICBlbGVtLnN0eWxlLnJpZ2h0ID0gMDtcbiAgICB9XG4gICAgaWYgKHZlcnRpY2FsKSB7XG4gICAgICBlbGVtLnN0eWxlLnRvcCA9IDA7XG4gICAgICBlbGVtLnN0eWxlLmJvdHRvbSA9IDA7XG4gICAgfVxuICB9LFxuICBmYWtlRXZlbnQ6IGZ1bmN0aW9uIGZha2VFdmVudChlbGVtLCBldmVudFR5cGUsIHBhcnMsIGF1eCkge1xuICAgIHZhciBwYXJhbXMgPSBwYXJzIHx8IHt9O1xuICAgIHZhciBjbGFzc05hbWUgPSBFVkVOVF9NQVBfSU5WW2V2ZW50VHlwZV07XG4gICAgaWYgKCFjbGFzc05hbWUpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignRXZlbnQgdHlwZSAnICsgZXZlbnRUeXBlICsgJyBub3Qgc3VwcG9ydGVkLicpO1xuICAgIH1cbiAgICB2YXIgZXZ0ID0gZG9jdW1lbnQuY3JlYXRlRXZlbnQoY2xhc3NOYW1lKTtcbiAgICBzd2l0Y2ggKGNsYXNzTmFtZSkge1xuICAgICAgY2FzZSAnTW91c2VFdmVudHMnOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGNsaWVudFggPSBwYXJhbXMueCB8fCBwYXJhbXMuY2xpZW50WCB8fCAwO1xuICAgICAgICAgIHZhciBjbGllbnRZID0gcGFyYW1zLnkgfHwgcGFyYW1zLmNsaWVudFkgfHwgMDtcbiAgICAgICAgICBldnQuaW5pdE1vdXNlRXZlbnQoZXZlbnRUeXBlLCBwYXJhbXMuYnViYmxlcyB8fCBmYWxzZSwgcGFyYW1zLmNhbmNlbGFibGUgfHwgdHJ1ZSwgd2luZG93LCBwYXJhbXMuY2xpY2tDb3VudCB8fCAxLCAwLFxuICAgICAgICAgIDAsXG4gICAgICAgICAgY2xpZW50WCxcbiAgICAgICAgICBjbGllbnRZLFxuICAgICAgICAgIGZhbHNlLCBmYWxzZSwgZmFsc2UsIGZhbHNlLCAwLCBudWxsKTtcbiAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgICAgY2FzZSAnS2V5Ym9hcmRFdmVudHMnOlxuICAgICAgICB7XG4gICAgICAgICAgdmFyIGluaXQgPSBldnQuaW5pdEtleWJvYXJkRXZlbnQgfHwgZXZ0LmluaXRLZXlFdmVudDtcbiAgICAgICAgICBDb21tb24uZGVmYXVsdHMocGFyYW1zLCB7XG4gICAgICAgICAgICBjYW5jZWxhYmxlOiB0cnVlLFxuICAgICAgICAgICAgY3RybEtleTogZmFsc2UsXG4gICAgICAgICAgICBhbHRLZXk6IGZhbHNlLFxuICAgICAgICAgICAgc2hpZnRLZXk6IGZhbHNlLFxuICAgICAgICAgICAgbWV0YUtleTogZmFsc2UsXG4gICAgICAgICAgICBrZXlDb2RlOiB1bmRlZmluZWQsXG4gICAgICAgICAgICBjaGFyQ29kZTogdW5kZWZpbmVkXG4gICAgICAgICAgfSk7XG4gICAgICAgICAgaW5pdChldmVudFR5cGUsIHBhcmFtcy5idWJibGVzIHx8IGZhbHNlLCBwYXJhbXMuY2FuY2VsYWJsZSwgd2luZG93LCBwYXJhbXMuY3RybEtleSwgcGFyYW1zLmFsdEtleSwgcGFyYW1zLnNoaWZ0S2V5LCBwYXJhbXMubWV0YUtleSwgcGFyYW1zLmtleUNvZGUsIHBhcmFtcy5jaGFyQ29kZSk7XG4gICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHtcbiAgICAgICAgICBldnQuaW5pdEV2ZW50KGV2ZW50VHlwZSwgcGFyYW1zLmJ1YmJsZXMgfHwgZmFsc2UsIHBhcmFtcy5jYW5jZWxhYmxlIHx8IHRydWUpO1xuICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgfVxuICAgIENvbW1vbi5kZWZhdWx0cyhldnQsIGF1eCk7XG4gICAgZWxlbS5kaXNwYXRjaEV2ZW50KGV2dCk7XG4gIH0sXG4gIGJpbmQ6IGZ1bmN0aW9uIGJpbmQoZWxlbSwgZXZlbnQsIGZ1bmMsIG5ld0Jvb2wpIHtcbiAgICB2YXIgYm9vbCA9IG5ld0Jvb2wgfHwgZmFsc2U7XG4gICAgaWYgKGVsZW0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgZWxlbS5hZGRFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jLCBib29sKTtcbiAgICB9IGVsc2UgaWYgKGVsZW0uYXR0YWNoRXZlbnQpIHtcbiAgICAgIGVsZW0uYXR0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBmdW5jKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbTtcbiAgfSxcbiAgdW5iaW5kOiBmdW5jdGlvbiB1bmJpbmQoZWxlbSwgZXZlbnQsIGZ1bmMsIG5ld0Jvb2wpIHtcbiAgICB2YXIgYm9vbCA9IG5ld0Jvb2wgfHwgZmFsc2U7XG4gICAgaWYgKGVsZW0ucmVtb3ZlRXZlbnRMaXN0ZW5lcikge1xuICAgICAgZWxlbS5yZW1vdmVFdmVudExpc3RlbmVyKGV2ZW50LCBmdW5jLCBib29sKTtcbiAgICB9IGVsc2UgaWYgKGVsZW0uZGV0YWNoRXZlbnQpIHtcbiAgICAgIGVsZW0uZGV0YWNoRXZlbnQoJ29uJyArIGV2ZW50LCBmdW5jKTtcbiAgICB9XG4gICAgcmV0dXJuIGRvbTtcbiAgfSxcbiAgYWRkQ2xhc3M6IGZ1bmN0aW9uIGFkZENsYXNzKGVsZW0sIGNsYXNzTmFtZSkge1xuICAgIGlmIChlbGVtLmNsYXNzTmFtZSA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICBlbGVtLmNsYXNzTmFtZSA9IGNsYXNzTmFtZTtcbiAgICB9IGVsc2UgaWYgKGVsZW0uY2xhc3NOYW1lICE9PSBjbGFzc05hbWUpIHtcbiAgICAgIHZhciBjbGFzc2VzID0gZWxlbS5jbGFzc05hbWUuc3BsaXQoLyArLyk7XG4gICAgICBpZiAoY2xhc3Nlcy5pbmRleE9mKGNsYXNzTmFtZSkgPT09IC0xKSB7XG4gICAgICAgIGNsYXNzZXMucHVzaChjbGFzc05hbWUpO1xuICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpLnJlcGxhY2UoL15cXHMrLywgJycpLnJlcGxhY2UoL1xccyskLywgJycpO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gZG9tO1xuICB9LFxuICByZW1vdmVDbGFzczogZnVuY3Rpb24gcmVtb3ZlQ2xhc3MoZWxlbSwgY2xhc3NOYW1lKSB7XG4gICAgaWYgKGNsYXNzTmFtZSkge1xuICAgICAgaWYgKGVsZW0uY2xhc3NOYW1lID09PSBjbGFzc05hbWUpIHtcbiAgICAgICAgZWxlbS5yZW1vdmVBdHRyaWJ1dGUoJ2NsYXNzJyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgY2xhc3NlcyA9IGVsZW0uY2xhc3NOYW1lLnNwbGl0KC8gKy8pO1xuICAgICAgICB2YXIgaW5kZXggPSBjbGFzc2VzLmluZGV4T2YoY2xhc3NOYW1lKTtcbiAgICAgICAgaWYgKGluZGV4ICE9PSAtMSkge1xuICAgICAgICAgIGNsYXNzZXMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgICBlbGVtLmNsYXNzTmFtZSA9IGNsYXNzZXMuam9pbignICcpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uY2xhc3NOYW1lID0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICByZXR1cm4gZG9tO1xuICB9LFxuICBoYXNDbGFzczogZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbSwgY2xhc3NOYW1lKSB7XG4gICAgcmV0dXJuIG5ldyBSZWdFeHAoJyg/Ol58XFxcXHMrKScgKyBjbGFzc05hbWUgKyAnKD86XFxcXHMrfCQpJykudGVzdChlbGVtLmNsYXNzTmFtZSkgfHwgZmFsc2U7XG4gIH0sXG4gIGdldFdpZHRoOiBmdW5jdGlvbiBnZXRXaWR0aChlbGVtKSB7XG4gICAgdmFyIHN0eWxlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtKTtcbiAgICByZXR1cm4gY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLWxlZnQtd2lkdGgnXSkgKyBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydib3JkZXItcmlnaHQtd2lkdGgnXSkgKyBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydwYWRkaW5nLWxlZnQnXSkgKyBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydwYWRkaW5nLXJpZ2h0J10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZS53aWR0aCk7XG4gIH0sXG4gIGdldEhlaWdodDogZnVuY3Rpb24gZ2V0SGVpZ2h0KGVsZW0pIHtcbiAgICB2YXIgc3R5bGUgPSBnZXRDb21wdXRlZFN0eWxlKGVsZW0pO1xuICAgIHJldHVybiBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlWydib3JkZXItdG9wLXdpZHRoJ10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsnYm9yZGVyLWJvdHRvbS13aWR0aCddKSArIGNzc1ZhbHVlVG9QaXhlbHMoc3R5bGVbJ3BhZGRpbmctdG9wJ10pICsgY3NzVmFsdWVUb1BpeGVscyhzdHlsZVsncGFkZGluZy1ib3R0b20nXSkgKyBjc3NWYWx1ZVRvUGl4ZWxzKHN0eWxlLmhlaWdodCk7XG4gIH0sXG4gIGdldE9mZnNldDogZnVuY3Rpb24gZ2V0T2Zmc2V0KGVsKSB7XG4gICAgdmFyIGVsZW0gPSBlbDtcbiAgICB2YXIgb2Zmc2V0ID0geyBsZWZ0OiAwLCB0b3A6IDAgfTtcbiAgICBpZiAoZWxlbS5vZmZzZXRQYXJlbnQpIHtcbiAgICAgIGRvIHtcbiAgICAgICAgb2Zmc2V0LmxlZnQgKz0gZWxlbS5vZmZzZXRMZWZ0O1xuICAgICAgICBvZmZzZXQudG9wICs9IGVsZW0ub2Zmc2V0VG9wO1xuICAgICAgICBlbGVtID0gZWxlbS5vZmZzZXRQYXJlbnQ7XG4gICAgICB9IHdoaWxlIChlbGVtKTtcbiAgICB9XG4gICAgcmV0dXJuIG9mZnNldDtcbiAgfSxcbiAgaXNBY3RpdmU6IGZ1bmN0aW9uIGlzQWN0aXZlKGVsZW0pIHtcbiAgICByZXR1cm4gZWxlbSA9PT0gZG9jdW1lbnQuYWN0aXZlRWxlbWVudCAmJiAoZWxlbS50eXBlIHx8IGVsZW0uaHJlZik7XG4gIH1cbn07XG5cbnZhciBCb29sZWFuQ29udHJvbGxlciA9IGZ1bmN0aW9uIChfQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhCb29sZWFuQ29udHJvbGxlciwgX0NvbnRyb2xsZXIpO1xuICBmdW5jdGlvbiBCb29sZWFuQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5KSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgQm9vbGVhbkNvbnRyb2xsZXIpO1xuICAgIHZhciBfdGhpczIgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChCb29sZWFuQ29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKEJvb2xlYW5Db250cm9sbGVyKSkuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KSk7XG4gICAgdmFyIF90aGlzID0gX3RoaXMyO1xuICAgIF90aGlzMi5fX3ByZXYgPSBfdGhpczIuZ2V0VmFsdWUoKTtcbiAgICBfdGhpczIuX19jaGVja2JveCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgX3RoaXMyLl9fY2hlY2tib3guc2V0QXR0cmlidXRlKCd0eXBlJywgJ2NoZWNrYm94Jyk7XG4gICAgZnVuY3Rpb24gb25DaGFuZ2UoKSB7XG4gICAgICBfdGhpcy5zZXRWYWx1ZSghX3RoaXMuX19wcmV2KTtcbiAgICB9XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fY2hlY2tib3gsICdjaGFuZ2UnLCBvbkNoYW5nZSwgZmFsc2UpO1xuICAgIF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKF90aGlzMi5fX2NoZWNrYm94KTtcbiAgICBfdGhpczIudXBkYXRlRGlzcGxheSgpO1xuICAgIHJldHVybiBfdGhpczI7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoQm9vbGVhbkNvbnRyb2xsZXIsIFt7XG4gICAga2V5OiAnc2V0VmFsdWUnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzZXRWYWx1ZSh2KSB7XG4gICAgICB2YXIgdG9SZXR1cm4gPSBnZXQoQm9vbGVhbkNvbnRyb2xsZXIucHJvdG90eXBlLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoQm9vbGVhbkNvbnRyb2xsZXIucHJvdG90eXBlKSwgJ3NldFZhbHVlJywgdGhpcykuY2FsbCh0aGlzLCB2KTtcbiAgICAgIGlmICh0aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICAgIHRoaXMuX19wcmV2ID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgcmV0dXJuIHRvUmV0dXJuO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ3VwZGF0ZURpc3BsYXknLFxuICAgIHZhbHVlOiBmdW5jdGlvbiB1cGRhdGVEaXNwbGF5KCkge1xuICAgICAgaWYgKHRoaXMuZ2V0VmFsdWUoKSA9PT0gdHJ1ZSkge1xuICAgICAgICB0aGlzLl9fY2hlY2tib3guc2V0QXR0cmlidXRlKCdjaGVja2VkJywgJ2NoZWNrZWQnKTtcbiAgICAgICAgdGhpcy5fX2NoZWNrYm94LmNoZWNrZWQgPSB0cnVlO1xuICAgICAgICB0aGlzLl9fcHJldiA9IHRydWU7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9fY2hlY2tib3guY2hlY2tlZCA9IGZhbHNlO1xuICAgICAgICB0aGlzLl9fcHJldiA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdldChCb29sZWFuQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihCb29sZWFuQ29udHJvbGxlci5wcm90b3R5cGUpLCAndXBkYXRlRGlzcGxheScsIHRoaXMpLmNhbGwodGhpcyk7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBCb29sZWFuQ29udHJvbGxlcjtcbn0oQ29udHJvbGxlcik7XG5cbnZhciBPcHRpb25Db250cm9sbGVyID0gZnVuY3Rpb24gKF9Db250cm9sbGVyKSB7XG4gIGluaGVyaXRzKE9wdGlvbkNvbnRyb2xsZXIsIF9Db250cm9sbGVyKTtcbiAgZnVuY3Rpb24gT3B0aW9uQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5LCBvcHRzKSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgT3B0aW9uQ29udHJvbGxlcik7XG4gICAgdmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKE9wdGlvbkNvbnRyb2xsZXIuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihPcHRpb25Db250cm9sbGVyKSkuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KSk7XG4gICAgdmFyIG9wdGlvbnMgPSBvcHRzO1xuICAgIHZhciBfdGhpcyA9IF90aGlzMjtcbiAgICBfdGhpczIuX19zZWxlY3QgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzZWxlY3QnKTtcbiAgICBpZiAoQ29tbW9uLmlzQXJyYXkob3B0aW9ucykpIHtcbiAgICAgIHZhciBtYXAgPSB7fTtcbiAgICAgIENvbW1vbi5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uIChlbGVtZW50KSB7XG4gICAgICAgIG1hcFtlbGVtZW50XSA9IGVsZW1lbnQ7XG4gICAgICB9KTtcbiAgICAgIG9wdGlvbnMgPSBtYXA7XG4gICAgfVxuICAgIENvbW1vbi5lYWNoKG9wdGlvbnMsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICB2YXIgb3B0ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnb3B0aW9uJyk7XG4gICAgICBvcHQuaW5uZXJIVE1MID0ga2V5O1xuICAgICAgb3B0LnNldEF0dHJpYnV0ZSgndmFsdWUnLCB2YWx1ZSk7XG4gICAgICBfdGhpcy5fX3NlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICAgIH0pO1xuICAgIF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fc2VsZWN0LCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgICAgdmFyIGRlc2lyZWRWYWx1ZSA9IHRoaXMub3B0aW9uc1t0aGlzLnNlbGVjdGVkSW5kZXhdLnZhbHVlO1xuICAgICAgX3RoaXMuc2V0VmFsdWUoZGVzaXJlZFZhbHVlKTtcbiAgICB9KTtcbiAgICBfdGhpczIuZG9tRWxlbWVudC5hcHBlbmRDaGlsZChfdGhpczIuX19zZWxlY3QpO1xuICAgIHJldHVybiBfdGhpczI7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoT3B0aW9uQ29udHJvbGxlciwgW3tcbiAgICBrZXk6ICdzZXRWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHYpIHtcbiAgICAgIHZhciB0b1JldHVybiA9IGdldChPcHRpb25Db250cm9sbGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKE9wdGlvbkNvbnRyb2xsZXIucHJvdG90eXBlKSwgJ3NldFZhbHVlJywgdGhpcykuY2FsbCh0aGlzLCB2KTtcbiAgICAgIGlmICh0aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwodGhpcywgdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiB0b1JldHVybjtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICd1cGRhdGVEaXNwbGF5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgIGlmIChkb20uaXNBY3RpdmUodGhpcy5fX3NlbGVjdCkpIHJldHVybiB0aGlzO1xuICAgICAgdGhpcy5fX3NlbGVjdC52YWx1ZSA9IHRoaXMuZ2V0VmFsdWUoKTtcbiAgICAgIHJldHVybiBnZXQoT3B0aW9uQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihPcHRpb25Db250cm9sbGVyLnByb3RvdHlwZSksICd1cGRhdGVEaXNwbGF5JywgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIE9wdGlvbkNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXIpO1xuXG52YXIgU3RyaW5nQ29udHJvbGxlciA9IGZ1bmN0aW9uIChfQ29udHJvbGxlcikge1xuICBpbmhlcml0cyhTdHJpbmdDb250cm9sbGVyLCBfQ29udHJvbGxlcik7XG4gIGZ1bmN0aW9uIFN0cmluZ0NvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIFN0cmluZ0NvbnRyb2xsZXIpO1xuICAgIHZhciBfdGhpczIgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChTdHJpbmdDb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoU3RyaW5nQ29udHJvbGxlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSkpO1xuICAgIHZhciBfdGhpcyA9IF90aGlzMjtcbiAgICBmdW5jdGlvbiBvbkNoYW5nZSgpIHtcbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9faW5wdXQudmFsdWUpO1xuICAgIH1cbiAgICBmdW5jdGlvbiBvbkJsdXIoKSB7XG4gICAgICBpZiAoX3RoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICBfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoX3RoaXMsIF90aGlzLmdldFZhbHVlKCkpO1xuICAgICAgfVxuICAgIH1cbiAgICBfdGhpczIuX19pbnB1dCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2lucHV0Jyk7XG4gICAgX3RoaXMyLl9faW5wdXQuc2V0QXR0cmlidXRlKCd0eXBlJywgJ3RleHQnKTtcbiAgICBkb20uYmluZChfdGhpczIuX19pbnB1dCwgJ2tleXVwJywgb25DaGFuZ2UpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2lucHV0LCAnY2hhbmdlJywgb25DaGFuZ2UpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2lucHV0LCAnYmx1cicsIG9uQmx1cik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdrZXlkb3duJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGlmIChlLmtleUNvZGUgPT09IDEzKSB7XG4gICAgICAgIHRoaXMuYmx1cigpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9faW5wdXQpO1xuICAgIHJldHVybiBfdGhpczI7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoU3RyaW5nQ29udHJvbGxlciwgW3tcbiAgICBrZXk6ICd1cGRhdGVEaXNwbGF5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgIGlmICghZG9tLmlzQWN0aXZlKHRoaXMuX19pbnB1dCkpIHtcbiAgICAgICAgdGhpcy5fX2lucHV0LnZhbHVlID0gdGhpcy5nZXRWYWx1ZSgpO1xuICAgICAgfVxuICAgICAgcmV0dXJuIGdldChTdHJpbmdDb250cm9sbGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKFN0cmluZ0NvbnRyb2xsZXIucHJvdG90eXBlKSwgJ3VwZGF0ZURpc3BsYXknLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gU3RyaW5nQ29udHJvbGxlcjtcbn0oQ29udHJvbGxlcik7XG5cbmZ1bmN0aW9uIG51bURlY2ltYWxzKHgpIHtcbiAgdmFyIF94ID0geC50b1N0cmluZygpO1xuICBpZiAoX3guaW5kZXhPZignLicpID4gLTEpIHtcbiAgICByZXR1cm4gX3gubGVuZ3RoIC0gX3guaW5kZXhPZignLicpIC0gMTtcbiAgfVxuICByZXR1cm4gMDtcbn1cbnZhciBOdW1iZXJDb250cm9sbGVyID0gZnVuY3Rpb24gKF9Db250cm9sbGVyKSB7XG4gIGluaGVyaXRzKE51bWJlckNvbnRyb2xsZXIsIF9Db250cm9sbGVyKTtcbiAgZnVuY3Rpb24gTnVtYmVyQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBOdW1iZXJDb250cm9sbGVyKTtcbiAgICB2YXIgX3RoaXMgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChOdW1iZXJDb250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTnVtYmVyQ29udHJvbGxlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSkpO1xuICAgIHZhciBfcGFyYW1zID0gcGFyYW1zIHx8IHt9O1xuICAgIF90aGlzLl9fbWluID0gX3BhcmFtcy5taW47XG4gICAgX3RoaXMuX19tYXggPSBfcGFyYW1zLm1heDtcbiAgICBfdGhpcy5fX3N0ZXAgPSBfcGFyYW1zLnN0ZXA7XG4gICAgaWYgKENvbW1vbi5pc1VuZGVmaW5lZChfdGhpcy5fX3N0ZXApKSB7XG4gICAgICBpZiAoX3RoaXMuaW5pdGlhbFZhbHVlID09PSAwKSB7XG4gICAgICAgIF90aGlzLl9faW1wbGllZFN0ZXAgPSAxO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgX3RoaXMuX19pbXBsaWVkU3RlcCA9IE1hdGgucG93KDEwLCBNYXRoLmZsb29yKE1hdGgubG9nKE1hdGguYWJzKF90aGlzLmluaXRpYWxWYWx1ZSkpIC8gTWF0aC5MTjEwKSkgLyAxMDtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgX3RoaXMuX19pbXBsaWVkU3RlcCA9IF90aGlzLl9fc3RlcDtcbiAgICB9XG4gICAgX3RoaXMuX19wcmVjaXNpb24gPSBudW1EZWNpbWFscyhfdGhpcy5fX2ltcGxpZWRTdGVwKTtcbiAgICByZXR1cm4gX3RoaXM7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoTnVtYmVyQ29udHJvbGxlciwgW3tcbiAgICBrZXk6ICdzZXRWYWx1ZScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHNldFZhbHVlKHYpIHtcbiAgICAgIHZhciBfdiA9IHY7XG4gICAgICBpZiAodGhpcy5fX21pbiAhPT0gdW5kZWZpbmVkICYmIF92IDwgdGhpcy5fX21pbikge1xuICAgICAgICBfdiA9IHRoaXMuX19taW47XG4gICAgICB9IGVsc2UgaWYgKHRoaXMuX19tYXggIT09IHVuZGVmaW5lZCAmJiBfdiA+IHRoaXMuX19tYXgpIHtcbiAgICAgICAgX3YgPSB0aGlzLl9fbWF4O1xuICAgICAgfVxuICAgICAgaWYgKHRoaXMuX19zdGVwICE9PSB1bmRlZmluZWQgJiYgX3YgJSB0aGlzLl9fc3RlcCAhPT0gMCkge1xuICAgICAgICBfdiA9IE1hdGgucm91bmQoX3YgLyB0aGlzLl9fc3RlcCkgKiB0aGlzLl9fc3RlcDtcbiAgICAgIH1cbiAgICAgIHJldHVybiBnZXQoTnVtYmVyQ29udHJvbGxlci5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihOdW1iZXJDb250cm9sbGVyLnByb3RvdHlwZSksICdzZXRWYWx1ZScsIHRoaXMpLmNhbGwodGhpcywgX3YpO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ21pbicsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIG1pbihtaW5WYWx1ZSkge1xuICAgICAgdGhpcy5fX21pbiA9IG1pblZhbHVlO1xuICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuICB9LCB7XG4gICAga2V5OiAnbWF4JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gbWF4KG1heFZhbHVlKSB7XG4gICAgICB0aGlzLl9fbWF4ID0gbWF4VmFsdWU7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdzdGVwJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gc3RlcChzdGVwVmFsdWUpIHtcbiAgICAgIHRoaXMuX19zdGVwID0gc3RlcFZhbHVlO1xuICAgICAgdGhpcy5fX2ltcGxpZWRTdGVwID0gc3RlcFZhbHVlO1xuICAgICAgdGhpcy5fX3ByZWNpc2lvbiA9IG51bURlY2ltYWxzKHN0ZXBWYWx1ZSk7XG4gICAgICByZXR1cm4gdGhpcztcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiByb3VuZFRvRGVjaW1hbCh2YWx1ZSwgZGVjaW1hbHMpIHtcbiAgdmFyIHRlblRvID0gTWF0aC5wb3coMTAsIGRlY2ltYWxzKTtcbiAgcmV0dXJuIE1hdGgucm91bmQodmFsdWUgKiB0ZW5UbykgLyB0ZW5Ubztcbn1cbnZhciBOdW1iZXJDb250cm9sbGVyQm94ID0gZnVuY3Rpb24gKF9OdW1iZXJDb250cm9sbGVyKSB7XG4gIGluaGVyaXRzKE51bWJlckNvbnRyb2xsZXJCb3gsIF9OdW1iZXJDb250cm9sbGVyKTtcbiAgZnVuY3Rpb24gTnVtYmVyQ29udHJvbGxlckJveChvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBOdW1iZXJDb250cm9sbGVyQm94KTtcbiAgICB2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoTnVtYmVyQ29udHJvbGxlckJveC5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKE51bWJlckNvbnRyb2xsZXJCb3gpKS5jYWxsKHRoaXMsIG9iamVjdCwgcHJvcGVydHksIHBhcmFtcykpO1xuICAgIF90aGlzMi5fX3RydW5jYXRpb25TdXNwZW5kZWQgPSBmYWxzZTtcbiAgICB2YXIgX3RoaXMgPSBfdGhpczI7XG4gICAgdmFyIHByZXZZID0gdm9pZCAwO1xuICAgIGZ1bmN0aW9uIG9uQ2hhbmdlKCkge1xuICAgICAgdmFyIGF0dGVtcHRlZCA9IHBhcnNlRmxvYXQoX3RoaXMuX19pbnB1dC52YWx1ZSk7XG4gICAgICBpZiAoIUNvbW1vbi5pc05hTihhdHRlbXB0ZWQpKSB7XG4gICAgICAgIF90aGlzLnNldFZhbHVlKGF0dGVtcHRlZCk7XG4gICAgICB9XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uRmluaXNoKCkge1xuICAgICAgaWYgKF90aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgX3RoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25CbHVyKCkge1xuICAgICAgb25GaW5pc2goKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3VzZURyYWcoZSkge1xuICAgICAgdmFyIGRpZmYgPSBwcmV2WSAtIGUuY2xpZW50WTtcbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLmdldFZhbHVlKCkgKyBkaWZmICogX3RoaXMuX19pbXBsaWVkU3RlcCk7XG4gICAgICBwcmV2WSA9IGUuY2xpZW50WTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBvbk1vdXNlRHJhZyk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgb25GaW5pc2goKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3VzZURvd24oZSkge1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgb25Nb3VzZURyYWcpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2V1cCcsIG9uTW91c2VVcCk7XG4gICAgICBwcmV2WSA9IGUuY2xpZW50WTtcbiAgICB9XG4gICAgX3RoaXMyLl9faW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIF90aGlzMi5fX2lucHV0LnNldEF0dHJpYnV0ZSgndHlwZScsICd0ZXh0Jyk7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdjaGFuZ2UnLCBvbkNoYW5nZSk7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdibHVyJywgb25CbHVyKTtcbiAgICBkb20uYmluZChfdGhpczIuX19pbnB1dCwgJ21vdXNlZG93bicsIG9uTW91c2VEb3duKTtcbiAgICBkb20uYmluZChfdGhpczIuX19pbnB1dCwgJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgX3RoaXMuX190cnVuY2F0aW9uU3VzcGVuZGVkID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5ibHVyKCk7XG4gICAgICAgIF90aGlzLl9fdHJ1bmNhdGlvblN1c3BlbmRlZCA9IGZhbHNlO1xuICAgICAgICBvbkZpbmlzaCgpO1xuICAgICAgfVxuICAgIH0pO1xuICAgIF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9faW5wdXQpO1xuICAgIHJldHVybiBfdGhpczI7XG4gIH1cbiAgY3JlYXRlQ2xhc3MoTnVtYmVyQ29udHJvbGxlckJveCwgW3tcbiAgICBrZXk6ICd1cGRhdGVEaXNwbGF5JyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gdXBkYXRlRGlzcGxheSgpIHtcbiAgICAgIHRoaXMuX19pbnB1dC52YWx1ZSA9IHRoaXMuX190cnVuY2F0aW9uU3VzcGVuZGVkID8gdGhpcy5nZXRWYWx1ZSgpIDogcm91bmRUb0RlY2ltYWwodGhpcy5nZXRWYWx1ZSgpLCB0aGlzLl9fcHJlY2lzaW9uKTtcbiAgICAgIHJldHVybiBnZXQoTnVtYmVyQ29udHJvbGxlckJveC5wcm90b3R5cGUuX19wcm90b19fIHx8IE9iamVjdC5nZXRQcm90b3R5cGVPZihOdW1iZXJDb250cm9sbGVyQm94LnByb3RvdHlwZSksICd1cGRhdGVEaXNwbGF5JywgdGhpcykuY2FsbCh0aGlzKTtcbiAgICB9XG4gIH1dKTtcbiAgcmV0dXJuIE51bWJlckNvbnRyb2xsZXJCb3g7XG59KE51bWJlckNvbnRyb2xsZXIpO1xuXG5mdW5jdGlvbiBtYXAodiwgaTEsIGkyLCBvMSwgbzIpIHtcbiAgcmV0dXJuIG8xICsgKG8yIC0gbzEpICogKCh2IC0gaTEpIC8gKGkyIC0gaTEpKTtcbn1cbnZhciBOdW1iZXJDb250cm9sbGVyU2xpZGVyID0gZnVuY3Rpb24gKF9OdW1iZXJDb250cm9sbGVyKSB7XG4gIGluaGVyaXRzKE51bWJlckNvbnRyb2xsZXJTbGlkZXIsIF9OdW1iZXJDb250cm9sbGVyKTtcbiAgZnVuY3Rpb24gTnVtYmVyQ29udHJvbGxlclNsaWRlcihvYmplY3QsIHByb3BlcnR5LCBtaW4sIG1heCwgc3RlcCkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIE51bWJlckNvbnRyb2xsZXJTbGlkZXIpO1xuICAgIHZhciBfdGhpczIgPSBwb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuKHRoaXMsIChOdW1iZXJDb250cm9sbGVyU2xpZGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTnVtYmVyQ29udHJvbGxlclNsaWRlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSwgeyBtaW46IG1pbiwgbWF4OiBtYXgsIHN0ZXA6IHN0ZXAgfSkpO1xuICAgIHZhciBfdGhpcyA9IF90aGlzMjtcbiAgICBfdGhpczIuX19iYWNrZ3JvdW5kID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX3RoaXMyLl9fZm9yZWdyb3VuZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2JhY2tncm91bmQsICdtb3VzZWRvd24nLCBvbk1vdXNlRG93bik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fYmFja2dyb3VuZCwgJ3RvdWNoc3RhcnQnLCBvblRvdWNoU3RhcnQpO1xuICAgIGRvbS5hZGRDbGFzcyhfdGhpczIuX19iYWNrZ3JvdW5kLCAnc2xpZGVyJyk7XG4gICAgZG9tLmFkZENsYXNzKF90aGlzMi5fX2ZvcmVncm91bmQsICdzbGlkZXItZmcnKTtcbiAgICBmdW5jdGlvbiBvbk1vdXNlRG93bihlKSB7XG4gICAgICBkb2N1bWVudC5hY3RpdmVFbGVtZW50LmJsdXIoKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIG9uTW91c2VEcmFnKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgb25Nb3VzZURyYWcoZSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uTW91c2VEcmFnKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIHZhciBiZ1JlY3QgPSBfdGhpcy5fX2JhY2tncm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShtYXAoZS5jbGllbnRYLCBiZ1JlY3QubGVmdCwgYmdSZWN0LnJpZ2h0LCBfdGhpcy5fX21pbiwgX3RoaXMuX19tYXgpKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Nb3VzZVVwKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBvbk1vdXNlRHJhZyk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBvbk1vdXNlVXApO1xuICAgICAgaWYgKF90aGlzLl9fb25GaW5pc2hDaGFuZ2UpIHtcbiAgICAgICAgX3RoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKF90aGlzLCBfdGhpcy5nZXRWYWx1ZSgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25Ub3VjaFN0YXJ0KGUpIHtcbiAgICAgIGlmIChlLnRvdWNoZXMubGVuZ3RoICE9PSAxKSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ3RvdWNoZW5kJywgb25Ub3VjaEVuZCk7XG4gICAgICBvblRvdWNoTW92ZShlKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25Ub3VjaE1vdmUoZSkge1xuICAgICAgdmFyIGNsaWVudFggPSBlLnRvdWNoZXNbMF0uY2xpZW50WDtcbiAgICAgIHZhciBiZ1JlY3QgPSBfdGhpcy5fX2JhY2tncm91bmQuZ2V0Qm91bmRpbmdDbGllbnRSZWN0KCk7XG4gICAgICBfdGhpcy5zZXRWYWx1ZShtYXAoY2xpZW50WCwgYmdSZWN0LmxlZnQsIGJnUmVjdC5yaWdodCwgX3RoaXMuX19taW4sIF90aGlzLl9fbWF4KSk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIG9uVG91Y2hFbmQoKSB7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3RvdWNobW92ZScsIG9uVG91Y2hNb3ZlKTtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAndG91Y2hlbmQnLCBvblRvdWNoRW5kKTtcbiAgICAgIGlmIChfdGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIF90aGlzLl9fb25GaW5pc2hDaGFuZ2UuY2FsbChfdGhpcywgX3RoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuICAgIF90aGlzMi51cGRhdGVEaXNwbGF5KCk7XG4gICAgX3RoaXMyLl9fYmFja2dyb3VuZC5hcHBlbmRDaGlsZChfdGhpczIuX19mb3JlZ3JvdW5kKTtcbiAgICBfdGhpczIuZG9tRWxlbWVudC5hcHBlbmRDaGlsZChfdGhpczIuX19iYWNrZ3JvdW5kKTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIGNyZWF0ZUNsYXNzKE51bWJlckNvbnRyb2xsZXJTbGlkZXIsIFt7XG4gICAga2V5OiAndXBkYXRlRGlzcGxheScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICB2YXIgcGN0ID0gKHRoaXMuZ2V0VmFsdWUoKSAtIHRoaXMuX19taW4pIC8gKHRoaXMuX19tYXggLSB0aGlzLl9fbWluKTtcbiAgICAgIHRoaXMuX19mb3JlZ3JvdW5kLnN0eWxlLndpZHRoID0gcGN0ICogMTAwICsgJyUnO1xuICAgICAgcmV0dXJuIGdldChOdW1iZXJDb250cm9sbGVyU2xpZGVyLnByb3RvdHlwZS5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKE51bWJlckNvbnRyb2xsZXJTbGlkZXIucHJvdG90eXBlKSwgJ3VwZGF0ZURpc3BsYXknLCB0aGlzKS5jYWxsKHRoaXMpO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gTnVtYmVyQ29udHJvbGxlclNsaWRlcjtcbn0oTnVtYmVyQ29udHJvbGxlcik7XG5cbnZhciBGdW5jdGlvbkNvbnRyb2xsZXIgPSBmdW5jdGlvbiAoX0NvbnRyb2xsZXIpIHtcbiAgaW5oZXJpdHMoRnVuY3Rpb25Db250cm9sbGVyLCBfQ29udHJvbGxlcik7XG4gIGZ1bmN0aW9uIEZ1bmN0aW9uQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5LCB0ZXh0KSB7XG4gICAgY2xhc3NDYWxsQ2hlY2sodGhpcywgRnVuY3Rpb25Db250cm9sbGVyKTtcbiAgICB2YXIgX3RoaXMyID0gcG9zc2libGVDb25zdHJ1Y3RvclJldHVybih0aGlzLCAoRnVuY3Rpb25Db250cm9sbGVyLl9fcHJvdG9fXyB8fCBPYmplY3QuZ2V0UHJvdG90eXBlT2YoRnVuY3Rpb25Db250cm9sbGVyKSkuY2FsbCh0aGlzLCBvYmplY3QsIHByb3BlcnR5KSk7XG4gICAgdmFyIF90aGlzID0gX3RoaXMyO1xuICAgIF90aGlzMi5fX2J1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF90aGlzMi5fX2J1dHRvbi5pbm5lckhUTUwgPSB0ZXh0ID09PSB1bmRlZmluZWQgPyAnRmlyZScgOiB0ZXh0O1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2J1dHRvbiwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgIF90aGlzLmZpcmUoKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9KTtcbiAgICBkb20uYWRkQ2xhc3MoX3RoaXMyLl9fYnV0dG9uLCAnYnV0dG9uJyk7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9fYnV0dG9uKTtcbiAgICByZXR1cm4gX3RoaXMyO1xuICB9XG4gIGNyZWF0ZUNsYXNzKEZ1bmN0aW9uQ29udHJvbGxlciwgW3tcbiAgICBrZXk6ICdmaXJlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gZmlyZSgpIHtcbiAgICAgIGlmICh0aGlzLl9fb25DaGFuZ2UpIHtcbiAgICAgICAgdGhpcy5fX29uQ2hhbmdlLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgICB0aGlzLmdldFZhbHVlKCkuY2FsbCh0aGlzLm9iamVjdCk7XG4gICAgICBpZiAodGhpcy5fX29uRmluaXNoQ2hhbmdlKSB7XG4gICAgICAgIHRoaXMuX19vbkZpbmlzaENoYW5nZS5jYWxsKHRoaXMsIHRoaXMuZ2V0VmFsdWUoKSk7XG4gICAgICB9XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBGdW5jdGlvbkNvbnRyb2xsZXI7XG59KENvbnRyb2xsZXIpO1xuXG52YXIgQ29sb3JDb250cm9sbGVyID0gZnVuY3Rpb24gKF9Db250cm9sbGVyKSB7XG4gIGluaGVyaXRzKENvbG9yQ29udHJvbGxlciwgX0NvbnRyb2xsZXIpO1xuICBmdW5jdGlvbiBDb2xvckNvbnRyb2xsZXIob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIGNsYXNzQ2FsbENoZWNrKHRoaXMsIENvbG9yQ29udHJvbGxlcik7XG4gICAgdmFyIF90aGlzMiA9IHBvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4odGhpcywgKENvbG9yQ29udHJvbGxlci5fX3Byb3RvX18gfHwgT2JqZWN0LmdldFByb3RvdHlwZU9mKENvbG9yQ29udHJvbGxlcikpLmNhbGwodGhpcywgb2JqZWN0LCBwcm9wZXJ0eSkpO1xuICAgIF90aGlzMi5fX2NvbG9yID0gbmV3IENvbG9yKF90aGlzMi5nZXRWYWx1ZSgpKTtcbiAgICBfdGhpczIuX190ZW1wID0gbmV3IENvbG9yKDApO1xuICAgIHZhciBfdGhpcyA9IF90aGlzMjtcbiAgICBfdGhpczIuZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIGRvbS5tYWtlU2VsZWN0YWJsZShfdGhpczIuZG9tRWxlbWVudCwgZmFsc2UpO1xuICAgIF90aGlzMi5fX3NlbGVjdG9yID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX3RoaXMyLl9fc2VsZWN0b3IuY2xhc3NOYW1lID0gJ3NlbGVjdG9yJztcbiAgICBfdGhpczIuX19zYXR1cmF0aW9uX2ZpZWxkID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZC5jbGFzc05hbWUgPSAnc2F0dXJhdGlvbi1maWVsZCc7XG4gICAgX3RoaXMyLl9fZmllbGRfa25vYiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIF90aGlzMi5fX2ZpZWxkX2tub2IuY2xhc3NOYW1lID0gJ2ZpZWxkLWtub2InO1xuICAgIF90aGlzMi5fX2ZpZWxkX2tub2JfYm9yZGVyID0gJzJweCBzb2xpZCAnO1xuICAgIF90aGlzMi5fX2h1ZV9rbm9iID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgX3RoaXMyLl9faHVlX2tub2IuY2xhc3NOYW1lID0gJ2h1ZS1rbm9iJztcbiAgICBfdGhpczIuX19odWVfZmllbGQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICBfdGhpczIuX19odWVfZmllbGQuY2xhc3NOYW1lID0gJ2h1ZS1maWVsZCc7XG4gICAgX3RoaXMyLl9faW5wdXQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdpbnB1dCcpO1xuICAgIF90aGlzMi5fX2lucHV0LnR5cGUgPSAndGV4dCc7XG4gICAgX3RoaXMyLl9faW5wdXRfdGV4dFNoYWRvdyA9ICcwIDFweCAxcHggJztcbiAgICBkb20uYmluZChfdGhpczIuX19pbnB1dCwgJ2tleWRvd24nLCBmdW5jdGlvbiAoZSkge1xuICAgICAgaWYgKGUua2V5Q29kZSA9PT0gMTMpIHtcbiAgICAgICAgb25CbHVyLmNhbGwodGhpcyk7XG4gICAgICB9XG4gICAgfSk7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9faW5wdXQsICdibHVyJywgb25CbHVyKTtcbiAgICBkb20uYmluZChfdGhpczIuX19zZWxlY3RvciwgJ21vdXNlZG93bicsIGZ1bmN0aW9uICgpICAgICAgICB7XG4gICAgICBkb20uYWRkQ2xhc3ModGhpcywgJ2RyYWcnKS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBmdW5jdGlvbiAoKSAgICAgICAge1xuICAgICAgICBkb20ucmVtb3ZlQ2xhc3MoX3RoaXMuX19zZWxlY3RvciwgJ2RyYWcnKTtcbiAgICAgIH0pO1xuICAgIH0pO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX3NlbGVjdG9yLCAndG91Y2hzdGFydCcsIGZ1bmN0aW9uICgpICAgICAgICB7XG4gICAgICBkb20uYWRkQ2xhc3ModGhpcywgJ2RyYWcnKS5iaW5kKHdpbmRvdywgJ3RvdWNoZW5kJywgZnVuY3Rpb24gKCkgICAgICAgIHtcbiAgICAgICAgZG9tLnJlbW92ZUNsYXNzKF90aGlzLl9fc2VsZWN0b3IsICdkcmFnJyk7XG4gICAgICB9KTtcbiAgICB9KTtcbiAgICB2YXIgdmFsdWVGaWVsZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIENvbW1vbi5leHRlbmQoX3RoaXMyLl9fc2VsZWN0b3Iuc3R5bGUsIHtcbiAgICAgIHdpZHRoOiAnMTIycHgnLFxuICAgICAgaGVpZ2h0OiAnMTAycHgnLFxuICAgICAgcGFkZGluZzogJzNweCcsXG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6ICcjMjIyJyxcbiAgICAgIGJveFNoYWRvdzogJzBweCAxcHggM3B4IHJnYmEoMCwwLDAsMC4zKSdcbiAgICB9KTtcbiAgICBDb21tb24uZXh0ZW5kKF90aGlzMi5fX2ZpZWxkX2tub2Iuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxMnB4JyxcbiAgICAgIGhlaWdodDogJzEycHgnLFxuICAgICAgYm9yZGVyOiBfdGhpczIuX19maWVsZF9rbm9iX2JvcmRlciArIChfdGhpczIuX19jb2xvci52IDwgMC41ID8gJyNmZmYnIDogJyMwMDAnKSxcbiAgICAgIGJveFNoYWRvdzogJzBweCAxcHggM3B4IHJnYmEoMCwwLDAsMC41KScsXG4gICAgICBib3JkZXJSYWRpdXM6ICcxMnB4JyxcbiAgICAgIHpJbmRleDogMVxuICAgIH0pO1xuICAgIENvbW1vbi5leHRlbmQoX3RoaXMyLl9faHVlX2tub2Iuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgd2lkdGg6ICcxNXB4JyxcbiAgICAgIGhlaWdodDogJzJweCcsXG4gICAgICBib3JkZXJSaWdodDogJzRweCBzb2xpZCAjZmZmJyxcbiAgICAgIHpJbmRleDogMVxuICAgIH0pO1xuICAgIENvbW1vbi5leHRlbmQoX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZC5zdHlsZSwge1xuICAgICAgd2lkdGg6ICcxMDBweCcsXG4gICAgICBoZWlnaHQ6ICcxMDBweCcsXG4gICAgICBib3JkZXI6ICcxcHggc29saWQgIzU1NScsXG4gICAgICBtYXJnaW5SaWdodDogJzNweCcsXG4gICAgICBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJyxcbiAgICAgIGN1cnNvcjogJ3BvaW50ZXInXG4gICAgfSk7XG4gICAgQ29tbW9uLmV4dGVuZCh2YWx1ZUZpZWxkLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzEwMCUnLFxuICAgICAgaGVpZ2h0OiAnMTAwJScsXG4gICAgICBiYWNrZ3JvdW5kOiAnbm9uZSdcbiAgICB9KTtcbiAgICBsaW5lYXJHcmFkaWVudCh2YWx1ZUZpZWxkLCAndG9wJywgJ3JnYmEoMCwwLDAsMCknLCAnIzAwMCcpO1xuICAgIENvbW1vbi5leHRlbmQoX3RoaXMyLl9faHVlX2ZpZWxkLnN0eWxlLCB7XG4gICAgICB3aWR0aDogJzE1cHgnLFxuICAgICAgaGVpZ2h0OiAnMTAwcHgnLFxuICAgICAgYm9yZGVyOiAnMXB4IHNvbGlkICM1NTUnLFxuICAgICAgY3Vyc29yOiAnbnMtcmVzaXplJyxcbiAgICAgIHBvc2l0aW9uOiAnYWJzb2x1dGUnLFxuICAgICAgdG9wOiAnM3B4JyxcbiAgICAgIHJpZ2h0OiAnM3B4J1xuICAgIH0pO1xuICAgIGh1ZUdyYWRpZW50KF90aGlzMi5fX2h1ZV9maWVsZCk7XG4gICAgQ29tbW9uLmV4dGVuZChfdGhpczIuX19pbnB1dC5zdHlsZSwge1xuICAgICAgb3V0bGluZTogJ25vbmUnLFxuICAgICAgdGV4dEFsaWduOiAnY2VudGVyJyxcbiAgICAgIGNvbG9yOiAnI2ZmZicsXG4gICAgICBib3JkZXI6IDAsXG4gICAgICBmb250V2VpZ2h0OiAnYm9sZCcsXG4gICAgICB0ZXh0U2hhZG93OiBfdGhpczIuX19pbnB1dF90ZXh0U2hhZG93ICsgJ3JnYmEoMCwwLDAsMC43KSdcbiAgICB9KTtcbiAgICBkb20uYmluZChfdGhpczIuX19zYXR1cmF0aW9uX2ZpZWxkLCAnbW91c2Vkb3duJywgZmllbGREb3duKTtcbiAgICBkb20uYmluZChfdGhpczIuX19zYXR1cmF0aW9uX2ZpZWxkLCAndG91Y2hzdGFydCcsIGZpZWxkRG93bik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fZmllbGRfa25vYiwgJ21vdXNlZG93bicsIGZpZWxkRG93bik7XG4gICAgZG9tLmJpbmQoX3RoaXMyLl9fZmllbGRfa25vYiwgJ3RvdWNoc3RhcnQnLCBmaWVsZERvd24pO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2h1ZV9maWVsZCwgJ21vdXNlZG93bicsIGZpZWxkRG93bkgpO1xuICAgIGRvbS5iaW5kKF90aGlzMi5fX2h1ZV9maWVsZCwgJ3RvdWNoc3RhcnQnLCBmaWVsZERvd25IKTtcbiAgICBmdW5jdGlvbiBmaWVsZERvd24oZSkge1xuICAgICAgc2V0U1YoZSk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRTVik7XG4gICAgICBkb20uYmluZCh3aW5kb3csICd0b3VjaG1vdmUnLCBzZXRTVik7XG4gICAgICBkb20uYmluZCh3aW5kb3csICdtb3VzZXVwJywgZmllbGRVcFNWKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ3RvdWNoZW5kJywgZmllbGRVcFNWKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmllbGREb3duSChlKSB7XG4gICAgICBzZXRIKGUpO1xuICAgICAgZG9tLmJpbmQod2luZG93LCAnbW91c2Vtb3ZlJywgc2V0SCk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICd0b3VjaG1vdmUnLCBzZXRIKTtcbiAgICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBmaWVsZFVwSCk7XG4gICAgICBkb20uYmluZCh3aW5kb3csICd0b3VjaGVuZCcsIGZpZWxkVXBIKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gZmllbGRVcFNWKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRTVik7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3RvdWNobW92ZScsIHNldFNWKTtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2V1cCcsIGZpZWxkVXBTVik7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3RvdWNoZW5kJywgZmllbGRVcFNWKTtcbiAgICAgIG9uRmluaXNoKCk7XG4gICAgfVxuICAgIGZ1bmN0aW9uIGZpZWxkVXBIKCkge1xuICAgICAgZG9tLnVuYmluZCh3aW5kb3csICdtb3VzZW1vdmUnLCBzZXRIKTtcbiAgICAgIGRvbS51bmJpbmQod2luZG93LCAndG91Y2htb3ZlJywgc2V0SCk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBmaWVsZFVwSCk7XG4gICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3RvdWNoZW5kJywgZmllbGRVcEgpO1xuICAgICAgb25GaW5pc2goKTtcbiAgICB9XG4gICAgZnVuY3Rpb24gb25CbHVyKCkge1xuICAgICAgdmFyIGkgPSBpbnRlcnByZXQodGhpcy52YWx1ZSk7XG4gICAgICBpZiAoaSAhPT0gZmFsc2UpIHtcbiAgICAgICAgX3RoaXMuX19jb2xvci5fX3N0YXRlID0gaTtcbiAgICAgICAgX3RoaXMuc2V0VmFsdWUoX3RoaXMuX19jb2xvci50b09yaWdpbmFsKCkpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdGhpcy52YWx1ZSA9IF90aGlzLl9fY29sb3IudG9TdHJpbmcoKTtcbiAgICAgIH1cbiAgICB9XG4gICAgZnVuY3Rpb24gb25GaW5pc2goKSB7XG4gICAgICBpZiAoX3RoaXMuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICBfdGhpcy5fX29uRmluaXNoQ2hhbmdlLmNhbGwoX3RoaXMsIF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcbiAgICAgIH1cbiAgICB9XG4gICAgX3RoaXMyLl9fc2F0dXJhdGlvbl9maWVsZC5hcHBlbmRDaGlsZCh2YWx1ZUZpZWxkKTtcbiAgICBfdGhpczIuX19zZWxlY3Rvci5hcHBlbmRDaGlsZChfdGhpczIuX19maWVsZF9rbm9iKTtcbiAgICBfdGhpczIuX19zZWxlY3Rvci5hcHBlbmRDaGlsZChfdGhpczIuX19zYXR1cmF0aW9uX2ZpZWxkKTtcbiAgICBfdGhpczIuX19zZWxlY3Rvci5hcHBlbmRDaGlsZChfdGhpczIuX19odWVfZmllbGQpO1xuICAgIF90aGlzMi5fX2h1ZV9maWVsZC5hcHBlbmRDaGlsZChfdGhpczIuX19odWVfa25vYik7XG4gICAgX3RoaXMyLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQoX3RoaXMyLl9faW5wdXQpO1xuICAgIF90aGlzMi5kb21FbGVtZW50LmFwcGVuZENoaWxkKF90aGlzMi5fX3NlbGVjdG9yKTtcbiAgICBfdGhpczIudXBkYXRlRGlzcGxheSgpO1xuICAgIGZ1bmN0aW9uIHNldFNWKGUpIHtcbiAgICAgIGlmIChlLnR5cGUuaW5kZXhPZigndG91Y2gnKSA9PT0gLTEpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgdmFyIGZpZWxkUmVjdCA9IF90aGlzLl9fc2F0dXJhdGlvbl9maWVsZC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgIHZhciBfcmVmID0gZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSB8fCBlLFxuICAgICAgICAgIGNsaWVudFggPSBfcmVmLmNsaWVudFgsXG4gICAgICAgICAgY2xpZW50WSA9IF9yZWYuY2xpZW50WTtcbiAgICAgIHZhciBzID0gKGNsaWVudFggLSBmaWVsZFJlY3QubGVmdCkgLyAoZmllbGRSZWN0LnJpZ2h0IC0gZmllbGRSZWN0LmxlZnQpO1xuICAgICAgdmFyIHYgPSAxIC0gKGNsaWVudFkgLSBmaWVsZFJlY3QudG9wKSAvIChmaWVsZFJlY3QuYm90dG9tIC0gZmllbGRSZWN0LnRvcCk7XG4gICAgICBpZiAodiA+IDEpIHtcbiAgICAgICAgdiA9IDE7XG4gICAgICB9IGVsc2UgaWYgKHYgPCAwKSB7XG4gICAgICAgIHYgPSAwO1xuICAgICAgfVxuICAgICAgaWYgKHMgPiAxKSB7XG4gICAgICAgIHMgPSAxO1xuICAgICAgfSBlbHNlIGlmIChzIDwgMCkge1xuICAgICAgICBzID0gMDtcbiAgICAgIH1cbiAgICAgIF90aGlzLl9fY29sb3IudiA9IHY7XG4gICAgICBfdGhpcy5fX2NvbG9yLnMgPSBzO1xuICAgICAgX3RoaXMuc2V0VmFsdWUoX3RoaXMuX19jb2xvci50b09yaWdpbmFsKCkpO1xuICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbiAgICBmdW5jdGlvbiBzZXRIKGUpIHtcbiAgICAgIGlmIChlLnR5cGUuaW5kZXhPZigndG91Y2gnKSA9PT0gLTEpIHtcbiAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgfVxuICAgICAgdmFyIGZpZWxkUmVjdCA9IF90aGlzLl9faHVlX2ZpZWxkLmdldEJvdW5kaW5nQ2xpZW50UmVjdCgpO1xuICAgICAgdmFyIF9yZWYyID0gZS50b3VjaGVzICYmIGUudG91Y2hlc1swXSB8fCBlLFxuICAgICAgICAgIGNsaWVudFkgPSBfcmVmMi5jbGllbnRZO1xuICAgICAgdmFyIGggPSAxIC0gKGNsaWVudFkgLSBmaWVsZFJlY3QudG9wKSAvIChmaWVsZFJlY3QuYm90dG9tIC0gZmllbGRSZWN0LnRvcCk7XG4gICAgICBpZiAoaCA+IDEpIHtcbiAgICAgICAgaCA9IDE7XG4gICAgICB9IGVsc2UgaWYgKGggPCAwKSB7XG4gICAgICAgIGggPSAwO1xuICAgICAgfVxuICAgICAgX3RoaXMuX19jb2xvci5oID0gaCAqIDM2MDtcbiAgICAgIF90aGlzLnNldFZhbHVlKF90aGlzLl9fY29sb3IudG9PcmlnaW5hbCgpKTtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuIF90aGlzMjtcbiAgfVxuICBjcmVhdGVDbGFzcyhDb2xvckNvbnRyb2xsZXIsIFt7XG4gICAga2V5OiAndXBkYXRlRGlzcGxheScsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgICB2YXIgaSA9IGludGVycHJldCh0aGlzLmdldFZhbHVlKCkpO1xuICAgICAgaWYgKGkgIT09IGZhbHNlKSB7XG4gICAgICAgIHZhciBtaXNtYXRjaCA9IGZhbHNlO1xuICAgICAgICBDb21tb24uZWFjaChDb2xvci5DT01QT05FTlRTLCBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gICAgICAgICAgaWYgKCFDb21tb24uaXNVbmRlZmluZWQoaVtjb21wb25lbnRdKSAmJiAhQ29tbW9uLmlzVW5kZWZpbmVkKHRoaXMuX19jb2xvci5fX3N0YXRlW2NvbXBvbmVudF0pICYmIGlbY29tcG9uZW50XSAhPT0gdGhpcy5fX2NvbG9yLl9fc3RhdGVbY29tcG9uZW50XSkge1xuICAgICAgICAgICAgbWlzbWF0Y2ggPSB0cnVlO1xuICAgICAgICAgICAgcmV0dXJuIHt9O1xuICAgICAgICAgIH1cbiAgICAgICAgfSwgdGhpcyk7XG4gICAgICAgIGlmIChtaXNtYXRjaCkge1xuICAgICAgICAgIENvbW1vbi5leHRlbmQodGhpcy5fX2NvbG9yLl9fc3RhdGUsIGkpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgICBDb21tb24uZXh0ZW5kKHRoaXMuX190ZW1wLl9fc3RhdGUsIHRoaXMuX19jb2xvci5fX3N0YXRlKTtcbiAgICAgIHRoaXMuX190ZW1wLmEgPSAxO1xuICAgICAgdmFyIGZsaXAgPSB0aGlzLl9fY29sb3IudiA8IDAuNSB8fCB0aGlzLl9fY29sb3IucyA+IDAuNSA/IDI1NSA6IDA7XG4gICAgICB2YXIgX2ZsaXAgPSAyNTUgLSBmbGlwO1xuICAgICAgQ29tbW9uLmV4dGVuZCh0aGlzLl9fZmllbGRfa25vYi5zdHlsZSwge1xuICAgICAgICBtYXJnaW5MZWZ0OiAxMDAgKiB0aGlzLl9fY29sb3IucyAtIDcgKyAncHgnLFxuICAgICAgICBtYXJnaW5Ub3A6IDEwMCAqICgxIC0gdGhpcy5fX2NvbG9yLnYpIC0gNyArICdweCcsXG4gICAgICAgIGJhY2tncm91bmRDb2xvcjogdGhpcy5fX3RlbXAudG9IZXhTdHJpbmcoKSxcbiAgICAgICAgYm9yZGVyOiB0aGlzLl9fZmllbGRfa25vYl9ib3JkZXIgKyAncmdiKCcgKyBmbGlwICsgJywnICsgZmxpcCArICcsJyArIGZsaXAgKyAnKSdcbiAgICAgIH0pO1xuICAgICAgdGhpcy5fX2h1ZV9rbm9iLnN0eWxlLm1hcmdpblRvcCA9ICgxIC0gdGhpcy5fX2NvbG9yLmggLyAzNjApICogMTAwICsgJ3B4JztcbiAgICAgIHRoaXMuX190ZW1wLnMgPSAxO1xuICAgICAgdGhpcy5fX3RlbXAudiA9IDE7XG4gICAgICBsaW5lYXJHcmFkaWVudCh0aGlzLl9fc2F0dXJhdGlvbl9maWVsZCwgJ2xlZnQnLCAnI2ZmZicsIHRoaXMuX190ZW1wLnRvSGV4U3RyaW5nKCkpO1xuICAgICAgdGhpcy5fX2lucHV0LnZhbHVlID0gdGhpcy5fX2NvbG9yLnRvU3RyaW5nKCk7XG4gICAgICBDb21tb24uZXh0ZW5kKHRoaXMuX19pbnB1dC5zdHlsZSwge1xuICAgICAgICBiYWNrZ3JvdW5kQ29sb3I6IHRoaXMuX19jb2xvci50b0hleFN0cmluZygpLFxuICAgICAgICBjb2xvcjogJ3JnYignICsgZmxpcCArICcsJyArIGZsaXAgKyAnLCcgKyBmbGlwICsgJyknLFxuICAgICAgICB0ZXh0U2hhZG93OiB0aGlzLl9faW5wdXRfdGV4dFNoYWRvdyArICdyZ2JhKCcgKyBfZmxpcCArICcsJyArIF9mbGlwICsgJywnICsgX2ZsaXAgKyAnLC43KSdcbiAgICAgIH0pO1xuICAgIH1cbiAgfV0pO1xuICByZXR1cm4gQ29sb3JDb250cm9sbGVyO1xufShDb250cm9sbGVyKTtcbnZhciB2ZW5kb3JzID0gWyctbW96LScsICctby0nLCAnLXdlYmtpdC0nLCAnLW1zLScsICcnXTtcbmZ1bmN0aW9uIGxpbmVhckdyYWRpZW50KGVsZW0sIHgsIGEsIGIpIHtcbiAgZWxlbS5zdHlsZS5iYWNrZ3JvdW5kID0gJyc7XG4gIENvbW1vbi5lYWNoKHZlbmRvcnMsIGZ1bmN0aW9uICh2ZW5kb3IpIHtcbiAgICBlbGVtLnN0eWxlLmNzc1RleHQgKz0gJ2JhY2tncm91bmQ6ICcgKyB2ZW5kb3IgKyAnbGluZWFyLWdyYWRpZW50KCcgKyB4ICsgJywgJyArIGEgKyAnIDAlLCAnICsgYiArICcgMTAwJSk7ICc7XG4gIH0pO1xufVxuZnVuY3Rpb24gaHVlR3JhZGllbnQoZWxlbSkge1xuICBlbGVtLnN0eWxlLmJhY2tncm91bmQgPSAnJztcbiAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAtbW96LWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCAjZmYwMGZmIDE3JSwgIzAwMDBmZiAzNCUsICMwMGZmZmYgNTAlLCAjMDBmZjAwIDY3JSwgI2ZmZmYwMCA4NCUsICNmZjAwMDAgMTAwJSk7JztcbiAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAtd2Via2l0LWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCNmZjAwZmYgMTclLCMwMDAwZmYgMzQlLCMwMGZmZmYgNTAlLCMwMGZmMDAgNjclLCNmZmZmMDAgODQlLCNmZjAwMDAgMTAwJSk7JztcbiAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiAtby1saW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOyc7XG4gIGVsZW0uc3R5bGUuY3NzVGV4dCArPSAnYmFja2dyb3VuZDogLW1zLWxpbmVhci1ncmFkaWVudCh0b3AsICAjZmYwMDAwIDAlLCNmZjAwZmYgMTclLCMwMDAwZmYgMzQlLCMwMGZmZmYgNTAlLCMwMGZmMDAgNjclLCNmZmZmMDAgODQlLCNmZjAwMDAgMTAwJSk7JztcbiAgZWxlbS5zdHlsZS5jc3NUZXh0ICs9ICdiYWNrZ3JvdW5kOiBsaW5lYXItZ3JhZGllbnQodG9wLCAgI2ZmMDAwMCAwJSwjZmYwMGZmIDE3JSwjMDAwMGZmIDM0JSwjMDBmZmZmIDUwJSwjMDBmZjAwIDY3JSwjZmZmZjAwIDg0JSwjZmYwMDAwIDEwMCUpOyc7XG59XG5cbnZhciBjc3MgPSB7XG4gIGxvYWQ6IGZ1bmN0aW9uIGxvYWQodXJsLCBpbmRvYykge1xuICAgIHZhciBkb2MgPSBpbmRvYyB8fCBkb2N1bWVudDtcbiAgICB2YXIgbGluayA9IGRvYy5jcmVhdGVFbGVtZW50KCdsaW5rJyk7XG4gICAgbGluay50eXBlID0gJ3RleHQvY3NzJztcbiAgICBsaW5rLnJlbCA9ICdzdHlsZXNoZWV0JztcbiAgICBsaW5rLmhyZWYgPSB1cmw7XG4gICAgZG9jLmdldEVsZW1lbnRzQnlUYWdOYW1lKCdoZWFkJylbMF0uYXBwZW5kQ2hpbGQobGluayk7XG4gIH0sXG4gIGluamVjdDogZnVuY3Rpb24gaW5qZWN0KGNzc0NvbnRlbnQsIGluZG9jKSB7XG4gICAgdmFyIGRvYyA9IGluZG9jIHx8IGRvY3VtZW50O1xuICAgIHZhciBpbmplY3RlZCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3N0eWxlJyk7XG4gICAgaW5qZWN0ZWQudHlwZSA9ICd0ZXh0L2Nzcyc7XG4gICAgaW5qZWN0ZWQuaW5uZXJIVE1MID0gY3NzQ29udGVudDtcbiAgICB2YXIgaGVhZCA9IGRvYy5nZXRFbGVtZW50c0J5VGFnTmFtZSgnaGVhZCcpWzBdO1xuICAgIHRyeSB7XG4gICAgICBoZWFkLmFwcGVuZENoaWxkKGluamVjdGVkKTtcbiAgICB9IGNhdGNoIChlKSB7XG4gICAgfVxuICB9XG59O1xuXG52YXIgc2F2ZURpYWxvZ0NvbnRlbnRzID0gXCI8ZGl2IGlkPVxcXCJkZy1zYXZlXFxcIiBjbGFzcz1cXFwiZGcgZGlhbG9ndWVcXFwiPlxcblxcbiAgSGVyZSdzIHRoZSBuZXcgbG9hZCBwYXJhbWV0ZXIgZm9yIHlvdXIgPGNvZGU+R1VJPC9jb2RlPidzIGNvbnN0cnVjdG9yOlxcblxcbiAgPHRleHRhcmVhIGlkPVxcXCJkZy1uZXctY29uc3RydWN0b3JcXFwiPjwvdGV4dGFyZWE+XFxuXFxuICA8ZGl2IGlkPVxcXCJkZy1zYXZlLWxvY2FsbHlcXFwiPlxcblxcbiAgICA8aW5wdXQgaWQ9XFxcImRnLWxvY2FsLXN0b3JhZ2VcXFwiIHR5cGU9XFxcImNoZWNrYm94XFxcIi8+IEF1dG9tYXRpY2FsbHkgc2F2ZVxcbiAgICB2YWx1ZXMgdG8gPGNvZGU+bG9jYWxTdG9yYWdlPC9jb2RlPiBvbiBleGl0LlxcblxcbiAgICA8ZGl2IGlkPVxcXCJkZy1sb2NhbC1leHBsYWluXFxcIj5UaGUgdmFsdWVzIHNhdmVkIHRvIDxjb2RlPmxvY2FsU3RvcmFnZTwvY29kZT4gd2lsbFxcbiAgICAgIG92ZXJyaWRlIHRob3NlIHBhc3NlZCB0byA8Y29kZT5kYXQuR1VJPC9jb2RlPidzIGNvbnN0cnVjdG9yLiBUaGlzIG1ha2VzIGl0XFxuICAgICAgZWFzaWVyIHRvIHdvcmsgaW5jcmVtZW50YWxseSwgYnV0IDxjb2RlPmxvY2FsU3RvcmFnZTwvY29kZT4gaXMgZnJhZ2lsZSxcXG4gICAgICBhbmQgeW91ciBmcmllbmRzIG1heSBub3Qgc2VlIHRoZSBzYW1lIHZhbHVlcyB5b3UgZG8uXFxuXFxuICAgIDwvZGl2PlxcblxcbiAgPC9kaXY+XFxuXFxuPC9kaXY+XCI7XG5cbnZhciBDb250cm9sbGVyRmFjdG9yeSA9IGZ1bmN0aW9uIENvbnRyb2xsZXJGYWN0b3J5KG9iamVjdCwgcHJvcGVydHkpIHtcbiAgdmFyIGluaXRpYWxWYWx1ZSA9IG9iamVjdFtwcm9wZXJ0eV07XG4gIGlmIChDb21tb24uaXNBcnJheShhcmd1bWVudHNbMl0pIHx8IENvbW1vbi5pc09iamVjdChhcmd1bWVudHNbMl0pKSB7XG4gICAgcmV0dXJuIG5ldyBPcHRpb25Db250cm9sbGVyKG9iamVjdCwgcHJvcGVydHksIGFyZ3VtZW50c1syXSk7XG4gIH1cbiAgaWYgKENvbW1vbi5pc051bWJlcihpbml0aWFsVmFsdWUpKSB7XG4gICAgaWYgKENvbW1vbi5pc051bWJlcihhcmd1bWVudHNbMl0pICYmIENvbW1vbi5pc051bWJlcihhcmd1bWVudHNbM10pKSB7XG4gICAgICBpZiAoQ29tbW9uLmlzTnVtYmVyKGFyZ3VtZW50c1s0XSkpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyU2xpZGVyKG9iamVjdCwgcHJvcGVydHksIGFyZ3VtZW50c1syXSwgYXJndW1lbnRzWzNdLCBhcmd1bWVudHNbNF0pO1xuICAgICAgfVxuICAgICAgcmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyU2xpZGVyKG9iamVjdCwgcHJvcGVydHksIGFyZ3VtZW50c1syXSwgYXJndW1lbnRzWzNdKTtcbiAgICB9XG4gICAgaWYgKENvbW1vbi5pc051bWJlcihhcmd1bWVudHNbNF0pKSB7XG4gICAgICByZXR1cm4gbmV3IE51bWJlckNvbnRyb2xsZXJCb3gob2JqZWN0LCBwcm9wZXJ0eSwgeyBtaW46IGFyZ3VtZW50c1syXSwgbWF4OiBhcmd1bWVudHNbM10sIHN0ZXA6IGFyZ3VtZW50c1s0XSB9KTtcbiAgICB9XG4gICAgcmV0dXJuIG5ldyBOdW1iZXJDb250cm9sbGVyQm94KG9iamVjdCwgcHJvcGVydHksIHsgbWluOiBhcmd1bWVudHNbMl0sIG1heDogYXJndW1lbnRzWzNdIH0pO1xuICB9XG4gIGlmIChDb21tb24uaXNTdHJpbmcoaW5pdGlhbFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgU3RyaW5nQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgfVxuICBpZiAoQ29tbW9uLmlzRnVuY3Rpb24oaW5pdGlhbFZhbHVlKSkge1xuICAgIHJldHVybiBuZXcgRnVuY3Rpb25Db250cm9sbGVyKG9iamVjdCwgcHJvcGVydHksICcnKTtcbiAgfVxuICBpZiAoQ29tbW9uLmlzQm9vbGVhbihpbml0aWFsVmFsdWUpKSB7XG4gICAgcmV0dXJuIG5ldyBCb29sZWFuQ29udHJvbGxlcihvYmplY3QsIHByb3BlcnR5KTtcbiAgfVxuICByZXR1cm4gbnVsbDtcbn07XG5cbmZ1bmN0aW9uIHJlcXVlc3RBbmltYXRpb25GcmFtZShjYWxsYmFjaykge1xuICBzZXRUaW1lb3V0KGNhbGxiYWNrLCAxMDAwIC8gNjApO1xufVxudmFyIHJlcXVlc3RBbmltYXRpb25GcmFtZSQxID0gd2luZG93LnJlcXVlc3RBbmltYXRpb25GcmFtZSB8fCB3aW5kb3cud2Via2l0UmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHdpbmRvdy5tb3pSZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm9SZXF1ZXN0QW5pbWF0aW9uRnJhbWUgfHwgd2luZG93Lm1zUmVxdWVzdEFuaW1hdGlvbkZyYW1lIHx8IHJlcXVlc3RBbmltYXRpb25GcmFtZTtcblxudmFyIENlbnRlcmVkRGl2ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBDZW50ZXJlZERpdigpIHtcbiAgICBjbGFzc0NhbGxDaGVjayh0aGlzLCBDZW50ZXJlZERpdik7XG4gICAgdGhpcy5iYWNrZ3JvdW5kRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICAgIENvbW1vbi5leHRlbmQodGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZSwge1xuICAgICAgYmFja2dyb3VuZENvbG9yOiAncmdiYSgwLDAsMCwwLjgpJyxcbiAgICAgIHRvcDogMCxcbiAgICAgIGxlZnQ6IDAsXG4gICAgICBkaXNwbGF5OiAnbm9uZScsXG4gICAgICB6SW5kZXg6ICcxMDAwJyxcbiAgICAgIG9wYWNpdHk6IDAsXG4gICAgICBXZWJraXRUcmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzIGxpbmVhcicsXG4gICAgICB0cmFuc2l0aW9uOiAnb3BhY2l0eSAwLjJzIGxpbmVhcidcbiAgICB9KTtcbiAgICBkb20ubWFrZUZ1bGxzY3JlZW4odGhpcy5iYWNrZ3JvdW5kRWxlbWVudCk7XG4gICAgdGhpcy5iYWNrZ3JvdW5kRWxlbWVudC5zdHlsZS5wb3NpdGlvbiA9ICdmaXhlZCc7XG4gICAgdGhpcy5kb21FbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgQ29tbW9uLmV4dGVuZCh0aGlzLmRvbUVsZW1lbnQuc3R5bGUsIHtcbiAgICAgIHBvc2l0aW9uOiAnZml4ZWQnLFxuICAgICAgZGlzcGxheTogJ25vbmUnLFxuICAgICAgekluZGV4OiAnMTAwMScsXG4gICAgICBvcGFjaXR5OiAwLFxuICAgICAgV2Via2l0VHJhbnNpdGlvbjogJy13ZWJraXQtdHJhbnNmb3JtIDAuMnMgZWFzZS1vdXQsIG9wYWNpdHkgMC4ycyBsaW5lYXInLFxuICAgICAgdHJhbnNpdGlvbjogJ3RyYW5zZm9ybSAwLjJzIGVhc2Utb3V0LCBvcGFjaXR5IDAuMnMgbGluZWFyJ1xuICAgIH0pO1xuICAgIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQodGhpcy5iYWNrZ3JvdW5kRWxlbWVudCk7XG4gICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCh0aGlzLmRvbUVsZW1lbnQpO1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgZG9tLmJpbmQodGhpcy5iYWNrZ3JvdW5kRWxlbWVudCwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgX3RoaXMuaGlkZSgpO1xuICAgIH0pO1xuICB9XG4gIGNyZWF0ZUNsYXNzKENlbnRlcmVkRGl2LCBbe1xuICAgIGtleTogJ3Nob3cnLFxuICAgIHZhbHVlOiBmdW5jdGlvbiBzaG93KCkge1xuICAgICAgdmFyIF90aGlzID0gdGhpcztcbiAgICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEuMSknO1xuICAgICAgdGhpcy5sYXlvdXQoKTtcbiAgICAgIENvbW1vbi5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICAgIF90aGlzLmJhY2tncm91bmRFbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBfdGhpcy5kb21FbGVtZW50LnN0eWxlLm9wYWNpdHkgPSAxO1xuICAgICAgICBfdGhpcy5kb21FbGVtZW50LnN0eWxlLndlYmtpdFRyYW5zZm9ybSA9ICdzY2FsZSgxKSc7XG4gICAgICB9KTtcbiAgICB9XG4gIH0sIHtcbiAgICBrZXk6ICdoaWRlJyxcbiAgICB2YWx1ZTogZnVuY3Rpb24gaGlkZSgpIHtcbiAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICB2YXIgaGlkZSA9IGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgICAgIF90aGlzLmRvbUVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgX3RoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUuZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgZG9tLnVuYmluZChfdGhpcy5kb21FbGVtZW50LCAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGhpZGUpO1xuICAgICAgICBkb20udW5iaW5kKF90aGlzLmRvbUVsZW1lbnQsICd0cmFuc2l0aW9uZW5kJywgaGlkZSk7XG4gICAgICAgIGRvbS51bmJpbmQoX3RoaXMuZG9tRWxlbWVudCwgJ29UcmFuc2l0aW9uRW5kJywgaGlkZSk7XG4gICAgICB9O1xuICAgICAgZG9tLmJpbmQodGhpcy5kb21FbGVtZW50LCAnd2Via2l0VHJhbnNpdGlvbkVuZCcsIGhpZGUpO1xuICAgICAgZG9tLmJpbmQodGhpcy5kb21FbGVtZW50LCAndHJhbnNpdGlvbmVuZCcsIGhpZGUpO1xuICAgICAgZG9tLmJpbmQodGhpcy5kb21FbGVtZW50LCAnb1RyYW5zaXRpb25FbmQnLCBoaWRlKTtcbiAgICAgIHRoaXMuYmFja2dyb3VuZEVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUub3BhY2l0eSA9IDA7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuc3R5bGUud2Via2l0VHJhbnNmb3JtID0gJ3NjYWxlKDEuMSknO1xuICAgIH1cbiAgfSwge1xuICAgIGtleTogJ2xheW91dCcsXG4gICAgdmFsdWU6IGZ1bmN0aW9uIGxheW91dCgpIHtcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS5sZWZ0ID0gd2luZG93LmlubmVyV2lkdGggLyAyIC0gZG9tLmdldFdpZHRoKHRoaXMuZG9tRWxlbWVudCkgLyAyICsgJ3B4JztcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5zdHlsZS50b3AgPSB3aW5kb3cuaW5uZXJIZWlnaHQgLyAyIC0gZG9tLmdldEhlaWdodCh0aGlzLmRvbUVsZW1lbnQpIC8gMiArICdweCc7XG4gICAgfVxuICB9XSk7XG4gIHJldHVybiBDZW50ZXJlZERpdjtcbn0oKTtcblxudmFyIHN0eWxlU2hlZXQgPSBfX18kaW5zZXJ0U3R5bGUoXCIuZGcgdWx7bGlzdC1zdHlsZTpub25lO21hcmdpbjowO3BhZGRpbmc6MDt3aWR0aDoxMDAlO2NsZWFyOmJvdGh9LmRnLmFje3Bvc2l0aW9uOmZpeGVkO3RvcDowO2xlZnQ6MDtyaWdodDowO2hlaWdodDowO3otaW5kZXg6MH0uZGc6bm90KC5hYykgLm1haW57b3ZlcmZsb3c6aGlkZGVufS5kZy5tYWluey13ZWJraXQtdHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXI7LW8tdHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXI7LW1vei10cmFuc2l0aW9uOm9wYWNpdHkgLjFzIGxpbmVhcjt0cmFuc2l0aW9uOm9wYWNpdHkgLjFzIGxpbmVhcn0uZGcubWFpbi50YWxsZXItdGhhbi13aW5kb3d7b3ZlcmZsb3cteTphdXRvfS5kZy5tYWluLnRhbGxlci10aGFuLXdpbmRvdyAuY2xvc2UtYnV0dG9ue29wYWNpdHk6MTttYXJnaW4tdG9wOi0xcHg7Ym9yZGVyLXRvcDoxcHggc29saWQgIzJjMmMyY30uZGcubWFpbiB1bC5jbG9zZWQgLmNsb3NlLWJ1dHRvbntvcGFjaXR5OjEgIWltcG9ydGFudH0uZGcubWFpbjpob3ZlciAuY2xvc2UtYnV0dG9uLC5kZy5tYWluIC5jbG9zZS1idXR0b24uZHJhZ3tvcGFjaXR5OjF9LmRnLm1haW4gLmNsb3NlLWJ1dHRvbnstd2Via2l0LXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyOy1vLXRyYW5zaXRpb246b3BhY2l0eSAuMXMgbGluZWFyOy1tb3otdHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXI7dHJhbnNpdGlvbjpvcGFjaXR5IC4xcyBsaW5lYXI7Ym9yZGVyOjA7bGluZS1oZWlnaHQ6MTlweDtoZWlnaHQ6MjBweDtjdXJzb3I6cG9pbnRlcjt0ZXh0LWFsaWduOmNlbnRlcjtiYWNrZ3JvdW5kLWNvbG9yOiMwMDB9LmRnLm1haW4gLmNsb3NlLWJ1dHRvbi5jbG9zZS10b3B7cG9zaXRpb246cmVsYXRpdmV9LmRnLm1haW4gLmNsb3NlLWJ1dHRvbi5jbG9zZS1ib3R0b217cG9zaXRpb246YWJzb2x1dGV9LmRnLm1haW4gLmNsb3NlLWJ1dHRvbjpob3ZlcntiYWNrZ3JvdW5kLWNvbG9yOiMxMTF9LmRnLmF7ZmxvYXQ6cmlnaHQ7bWFyZ2luLXJpZ2h0OjE1cHg7b3ZlcmZsb3cteTp2aXNpYmxlfS5kZy5hLmhhcy1zYXZlPnVsLmNsb3NlLXRvcHttYXJnaW4tdG9wOjB9LmRnLmEuaGFzLXNhdmU+dWwuY2xvc2UtYm90dG9te21hcmdpbi10b3A6MjdweH0uZGcuYS5oYXMtc2F2ZT51bC5jbG9zZWR7bWFyZ2luLXRvcDowfS5kZy5hIC5zYXZlLXJvd3t0b3A6MDt6LWluZGV4OjEwMDJ9LmRnLmEgLnNhdmUtcm93LmNsb3NlLXRvcHtwb3NpdGlvbjpyZWxhdGl2ZX0uZGcuYSAuc2F2ZS1yb3cuY2xvc2UtYm90dG9te3Bvc2l0aW9uOmZpeGVkfS5kZyBsaXstd2Via2l0LXRyYW5zaXRpb246aGVpZ2h0IC4xcyBlYXNlLW91dDstby10cmFuc2l0aW9uOmhlaWdodCAuMXMgZWFzZS1vdXQ7LW1vei10cmFuc2l0aW9uOmhlaWdodCAuMXMgZWFzZS1vdXQ7dHJhbnNpdGlvbjpoZWlnaHQgLjFzIGVhc2Utb3V0Oy13ZWJraXQtdHJhbnNpdGlvbjpvdmVyZmxvdyAuMXMgbGluZWFyOy1vLXRyYW5zaXRpb246b3ZlcmZsb3cgLjFzIGxpbmVhcjstbW96LXRyYW5zaXRpb246b3ZlcmZsb3cgLjFzIGxpbmVhcjt0cmFuc2l0aW9uOm92ZXJmbG93IC4xcyBsaW5lYXJ9LmRnIGxpOm5vdCguZm9sZGVyKXtjdXJzb3I6YXV0bztoZWlnaHQ6MjdweDtsaW5lLWhlaWdodDoyN3B4O3BhZGRpbmc6MCA0cHggMCA1cHh9LmRnIGxpLmZvbGRlcntwYWRkaW5nOjA7Ym9yZGVyLWxlZnQ6NHB4IHNvbGlkIHJnYmEoMCwwLDAsMCl9LmRnIGxpLnRpdGxle2N1cnNvcjpwb2ludGVyO21hcmdpbi1sZWZ0Oi00cHh9LmRnIC5jbG9zZWQgbGk6bm90KC50aXRsZSksLmRnIC5jbG9zZWQgdWwgbGksLmRnIC5jbG9zZWQgdWwgbGk+KntoZWlnaHQ6MDtvdmVyZmxvdzpoaWRkZW47Ym9yZGVyOjB9LmRnIC5jcntjbGVhcjpib3RoO3BhZGRpbmctbGVmdDozcHg7aGVpZ2h0OjI3cHg7b3ZlcmZsb3c6aGlkZGVufS5kZyAucHJvcGVydHktbmFtZXtjdXJzb3I6ZGVmYXVsdDtmbG9hdDpsZWZ0O2NsZWFyOmxlZnQ7d2lkdGg6NDAlO292ZXJmbG93OmhpZGRlbjt0ZXh0LW92ZXJmbG93OmVsbGlwc2lzfS5kZyAuY3tmbG9hdDpsZWZ0O3dpZHRoOjYwJTtwb3NpdGlvbjpyZWxhdGl2ZX0uZGcgLmMgaW5wdXRbdHlwZT10ZXh0XXtib3JkZXI6MDttYXJnaW4tdG9wOjRweDtwYWRkaW5nOjNweDt3aWR0aDoxMDAlO2Zsb2F0OnJpZ2h0fS5kZyAuaGFzLXNsaWRlciBpbnB1dFt0eXBlPXRleHRde3dpZHRoOjMwJTttYXJnaW4tbGVmdDowfS5kZyAuc2xpZGVye2Zsb2F0OmxlZnQ7d2lkdGg6NjYlO21hcmdpbi1sZWZ0Oi01cHg7bWFyZ2luLXJpZ2h0OjA7aGVpZ2h0OjE5cHg7bWFyZ2luLXRvcDo0cHh9LmRnIC5zbGlkZXItZmd7aGVpZ2h0OjEwMCV9LmRnIC5jIGlucHV0W3R5cGU9Y2hlY2tib3hde21hcmdpbi10b3A6N3B4fS5kZyAuYyBzZWxlY3R7bWFyZ2luLXRvcDo1cHh9LmRnIC5jci5mdW5jdGlvbiwuZGcgLmNyLmZ1bmN0aW9uIC5wcm9wZXJ0eS1uYW1lLC5kZyAuY3IuZnVuY3Rpb24gKiwuZGcgLmNyLmJvb2xlYW4sLmRnIC5jci5ib29sZWFuICp7Y3Vyc29yOnBvaW50ZXJ9LmRnIC5jci5jb2xvcntvdmVyZmxvdzp2aXNpYmxlfS5kZyAuc2VsZWN0b3J7ZGlzcGxheTpub25lO3Bvc2l0aW9uOmFic29sdXRlO21hcmdpbi1sZWZ0Oi05cHg7bWFyZ2luLXRvcDoyM3B4O3otaW5kZXg6MTB9LmRnIC5jOmhvdmVyIC5zZWxlY3RvciwuZGcgLnNlbGVjdG9yLmRyYWd7ZGlzcGxheTpibG9ja30uZGcgbGkuc2F2ZS1yb3d7cGFkZGluZzowfS5kZyBsaS5zYXZlLXJvdyAuYnV0dG9ue2Rpc3BsYXk6aW5saW5lLWJsb2NrO3BhZGRpbmc6MHB4IDZweH0uZGcuZGlhbG9ndWV7YmFja2dyb3VuZC1jb2xvcjojMjIyO3dpZHRoOjQ2MHB4O3BhZGRpbmc6MTVweDtmb250LXNpemU6MTNweDtsaW5lLWhlaWdodDoxNXB4fSNkZy1uZXctY29uc3RydWN0b3J7cGFkZGluZzoxMHB4O2NvbG9yOiMyMjI7Zm9udC1mYW1pbHk6TW9uYWNvLCBtb25vc3BhY2U7Zm9udC1zaXplOjEwcHg7Ym9yZGVyOjA7cmVzaXplOm5vbmU7Ym94LXNoYWRvdzppbnNldCAxcHggMXB4IDFweCAjODg4O3dvcmQtd3JhcDpicmVhay13b3JkO21hcmdpbjoxMnB4IDA7ZGlzcGxheTpibG9jazt3aWR0aDo0NDBweDtvdmVyZmxvdy15OnNjcm9sbDtoZWlnaHQ6MTAwcHg7cG9zaXRpb246cmVsYXRpdmV9I2RnLWxvY2FsLWV4cGxhaW57ZGlzcGxheTpub25lO2ZvbnQtc2l6ZToxMXB4O2xpbmUtaGVpZ2h0OjE3cHg7Ym9yZGVyLXJhZGl1czozcHg7YmFja2dyb3VuZC1jb2xvcjojMzMzO3BhZGRpbmc6OHB4O21hcmdpbi10b3A6MTBweH0jZGctbG9jYWwtZXhwbGFpbiBjb2Rle2ZvbnQtc2l6ZToxMHB4fSNkYXQtZ3VpLXNhdmUtbG9jYWxseXtkaXNwbGF5Om5vbmV9LmRne2NvbG9yOiNlZWU7Zm9udDoxMXB4ICdMdWNpZGEgR3JhbmRlJywgc2Fucy1zZXJpZjt0ZXh0LXNoYWRvdzowIC0xcHggMCAjMTExfS5kZy5tYWluOjotd2Via2l0LXNjcm9sbGJhcnt3aWR0aDo1cHg7YmFja2dyb3VuZDojMWExYTFhfS5kZy5tYWluOjotd2Via2l0LXNjcm9sbGJhci1jb3JuZXJ7aGVpZ2h0OjA7ZGlzcGxheTpub25lfS5kZy5tYWluOjotd2Via2l0LXNjcm9sbGJhci10aHVtYntib3JkZXItcmFkaXVzOjVweDtiYWNrZ3JvdW5kOiM2NzY3Njd9LmRnIGxpOm5vdCguZm9sZGVyKXtiYWNrZ3JvdW5kOiMxYTFhMWE7Ym9yZGVyLWJvdHRvbToxcHggc29saWQgIzJjMmMyY30uZGcgbGkuc2F2ZS1yb3d7bGluZS1oZWlnaHQ6MjVweDtiYWNrZ3JvdW5kOiNkYWQ1Y2I7Ym9yZGVyOjB9LmRnIGxpLnNhdmUtcm93IHNlbGVjdHttYXJnaW4tbGVmdDo1cHg7d2lkdGg6MTA4cHh9LmRnIGxpLnNhdmUtcm93IC5idXR0b257bWFyZ2luLWxlZnQ6NXB4O21hcmdpbi10b3A6MXB4O2JvcmRlci1yYWRpdXM6MnB4O2ZvbnQtc2l6ZTo5cHg7bGluZS1oZWlnaHQ6N3B4O3BhZGRpbmc6NHB4IDRweCA1cHggNHB4O2JhY2tncm91bmQ6I2M1YmRhZDtjb2xvcjojZmZmO3RleHQtc2hhZG93OjAgMXB4IDAgI2IwYTU4Zjtib3gtc2hhZG93OjAgLTFweCAwICNiMGE1OGY7Y3Vyc29yOnBvaW50ZXJ9LmRnIGxpLnNhdmUtcm93IC5idXR0b24uZ2VhcnN7YmFja2dyb3VuZDojYzViZGFkIHVybChkYXRhOmltYWdlL3BuZztiYXNlNjQsaVZCT1J3MEtHZ29BQUFBTlNVaEVVZ0FBQUFzQUFBQU5DQVlBQUFCLzlaUTdBQUFBR1hSRldIUlRiMlowZDJGeVpRQkJaRzlpWlNCSmJXRm5aVkpsWVdSNWNjbGxQQUFBQVFKSlJFRlVlTnBpWUtBVS9QLy9Qd0dJQy9BcENBQmlCU0FXK0k4QUNsQWNnS3hRNFQ5aG9NQUVVcnh4MlFTR042K2VnRFgrL3ZXVDRlN044MkFNWW9QQXgvZXZ3V29Zb1NZYkFDWDJzN0t4Q3h6Y3NlekRoM2V2Rm9ERUJZVEVFcXljZ2dXQXpBOUF1VVNRUWdlWVBhOWZQdjYvWVdtL0FjeDVJUGI3dHkvZncrUVpibHc2N3ZEczhSMFlIeVFoZ09ieCt5QUprQnFtRzVkUFBEaDFhUE9HUi9ldWdXMEc0dmxJb1RJZnlGY0ErUWVraGhISmhQZFF4YmlBSWd1TUJUUVpyUEQ3MTA4TTZyb1dZREZRaUlBQXY2QW93LzFiRndYZ2lzK2YyTFVBeW53b0lhTmN6OFhOeDNEbDdNRUpVREdRcHg5Z3RROFlDdWVCK0QyNk9FQ0FBUURhZHQ3ZTQ2RDQyUUFBQUFCSlJVNUVya0pnZ2c9PSkgMnB4IDFweCBuby1yZXBlYXQ7aGVpZ2h0OjdweDt3aWR0aDo4cHh9LmRnIGxpLnNhdmUtcm93IC5idXR0b246aG92ZXJ7YmFja2dyb3VuZC1jb2xvcjojYmFiMTllO2JveC1zaGFkb3c6MCAtMXB4IDAgI2IwYTU4Zn0uZGcgbGkuZm9sZGVye2JvcmRlci1ib3R0b206MH0uZGcgbGkudGl0bGV7cGFkZGluZy1sZWZ0OjE2cHg7YmFja2dyb3VuZDojMDAwIHVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCUUFGQUpFQUFQLy8vL1B6OC8vLy8vLy8veUg1QkFFQUFBSUFMQUFBQUFBRkFBVUFBQUlJbEkraEtnRnhvQ2dBT3c9PSkgNnB4IDEwcHggbm8tcmVwZWF0O2N1cnNvcjpwb2ludGVyO2JvcmRlci1ib3R0b206MXB4IHNvbGlkIHJnYmEoMjU1LDI1NSwyNTUsMC4yKX0uZGcgLmNsb3NlZCBsaS50aXRsZXtiYWNrZ3JvdW5kLWltYWdlOnVybChkYXRhOmltYWdlL2dpZjtiYXNlNjQsUjBsR09EbGhCUUFGQUpFQUFQLy8vL1B6OC8vLy8vLy8veUg1QkFFQUFBSUFMQUFBQUFBRkFBVUFBQUlJbEdJV3FNQ2JXQUVBT3c9PSl9LmRnIC5jci5ib29sZWFue2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjODA2Nzg3fS5kZyAuY3IuY29sb3J7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkfS5kZyAuY3IuZnVuY3Rpb257Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICNlNjFkNWZ9LmRnIC5jci5udW1iZXJ7Ym9yZGVyLWxlZnQ6M3B4IHNvbGlkICMyRkExRDZ9LmRnIC5jci5udW1iZXIgaW5wdXRbdHlwZT10ZXh0XXtjb2xvcjojMkZBMUQ2fS5kZyAuY3Iuc3RyaW5ne2JvcmRlci1sZWZ0OjNweCBzb2xpZCAjMWVkMzZmfS5kZyAuY3Iuc3RyaW5nIGlucHV0W3R5cGU9dGV4dF17Y29sb3I6IzFlZDM2Zn0uZGcgLmNyLmZ1bmN0aW9uOmhvdmVyLC5kZyAuY3IuYm9vbGVhbjpob3ZlcntiYWNrZ3JvdW5kOiMxMTF9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF17YmFja2dyb3VuZDojMzAzMDMwO291dGxpbmU6bm9uZX0uZGcgLmMgaW5wdXRbdHlwZT10ZXh0XTpob3ZlcntiYWNrZ3JvdW5kOiMzYzNjM2N9LmRnIC5jIGlucHV0W3R5cGU9dGV4dF06Zm9jdXN7YmFja2dyb3VuZDojNDk0OTQ5O2NvbG9yOiNmZmZ9LmRnIC5jIC5zbGlkZXJ7YmFja2dyb3VuZDojMzAzMDMwO2N1cnNvcjpldy1yZXNpemV9LmRnIC5jIC5zbGlkZXItZmd7YmFja2dyb3VuZDojMkZBMUQ2O21heC13aWR0aDoxMDAlfS5kZyAuYyAuc2xpZGVyOmhvdmVye2JhY2tncm91bmQ6IzNjM2MzY30uZGcgLmMgLnNsaWRlcjpob3ZlciAuc2xpZGVyLWZne2JhY2tncm91bmQ6IzQ0YWJkYX1cXG5cIik7XG5cbmNzcy5pbmplY3Qoc3R5bGVTaGVldCk7XG52YXIgQ1NTX05BTUVTUEFDRSA9ICdkZyc7XG52YXIgSElERV9LRVlfQ09ERSA9IDcyO1xudmFyIENMT1NFX0JVVFRPTl9IRUlHSFQgPSAyMDtcbnZhciBERUZBVUxUX0RFRkFVTFRfUFJFU0VUX05BTUUgPSAnRGVmYXVsdCc7XG52YXIgU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSA9IGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICByZXR1cm4gISF3aW5kb3cubG9jYWxTdG9yYWdlO1xuICB9IGNhdGNoIChlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG59KCk7XG52YXIgU0FWRV9ESUFMT0dVRSA9IHZvaWQgMDtcbnZhciBhdXRvUGxhY2VWaXJnaW4gPSB0cnVlO1xudmFyIGF1dG9QbGFjZUNvbnRhaW5lciA9IHZvaWQgMDtcbnZhciBoaWRlID0gZmFsc2U7XG52YXIgaGlkZWFibGVHdWlzID0gW107XG52YXIgR1VJID0gZnVuY3Rpb24gR1VJKHBhcnMpIHtcbiAgdmFyIF90aGlzID0gdGhpcztcbiAgdmFyIHBhcmFtcyA9IHBhcnMgfHwge307XG4gIHRoaXMuZG9tRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ2RpdicpO1xuICB0aGlzLl9fdWwgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCd1bCcpO1xuICB0aGlzLmRvbUVsZW1lbnQuYXBwZW5kQ2hpbGQodGhpcy5fX3VsKTtcbiAgZG9tLmFkZENsYXNzKHRoaXMuZG9tRWxlbWVudCwgQ1NTX05BTUVTUEFDRSk7XG4gIHRoaXMuX19mb2xkZXJzID0ge307XG4gIHRoaXMuX19jb250cm9sbGVycyA9IFtdO1xuICB0aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMgPSBbXTtcbiAgdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVycyA9IFtdO1xuICB0aGlzLl9fbGlzdGVuaW5nID0gW107XG4gIHBhcmFtcyA9IENvbW1vbi5kZWZhdWx0cyhwYXJhbXMsIHtcbiAgICBjbG9zZU9uVG9wOiBmYWxzZSxcbiAgICBhdXRvUGxhY2U6IHRydWUsXG4gICAgd2lkdGg6IEdVSS5ERUZBVUxUX1dJRFRIXG4gIH0pO1xuICBwYXJhbXMgPSBDb21tb24uZGVmYXVsdHMocGFyYW1zLCB7XG4gICAgcmVzaXphYmxlOiBwYXJhbXMuYXV0b1BsYWNlLFxuICAgIGhpZGVhYmxlOiBwYXJhbXMuYXV0b1BsYWNlXG4gIH0pO1xuICBpZiAoIUNvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMubG9hZCkpIHtcbiAgICBpZiAocGFyYW1zLnByZXNldCkge1xuICAgICAgcGFyYW1zLmxvYWQucHJlc2V0ID0gcGFyYW1zLnByZXNldDtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcGFyYW1zLmxvYWQgPSB7IHByZXNldDogREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FIH07XG4gIH1cbiAgaWYgKENvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMucGFyZW50KSAmJiBwYXJhbXMuaGlkZWFibGUpIHtcbiAgICBoaWRlYWJsZUd1aXMucHVzaCh0aGlzKTtcbiAgfVxuICBwYXJhbXMucmVzaXphYmxlID0gQ29tbW9uLmlzVW5kZWZpbmVkKHBhcmFtcy5wYXJlbnQpICYmIHBhcmFtcy5yZXNpemFibGU7XG4gIGlmIChwYXJhbXMuYXV0b1BsYWNlICYmIENvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMuc2Nyb2xsYWJsZSkpIHtcbiAgICBwYXJhbXMuc2Nyb2xsYWJsZSA9IHRydWU7XG4gIH1cbiAgdmFyIHVzZUxvY2FsU3RvcmFnZSA9IFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UgJiYgbG9jYWxTdG9yYWdlLmdldEl0ZW0oZ2V0TG9jYWxTdG9yYWdlSGFzaCh0aGlzLCAnaXNMb2NhbCcpKSA9PT0gJ3RydWUnO1xuICB2YXIgc2F2ZVRvTG9jYWxTdG9yYWdlID0gdm9pZCAwO1xuICB2YXIgdGl0bGVSb3cgPSB2b2lkIDA7XG4gIE9iamVjdC5kZWZpbmVQcm9wZXJ0aWVzKHRoaXMsXG4gIHtcbiAgICBwYXJlbnQ6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLnBhcmVudDtcbiAgICAgIH1cbiAgICB9LFxuICAgIHNjcm9sbGFibGU6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLnNjcm9sbGFibGU7XG4gICAgICB9XG4gICAgfSxcbiAgICBhdXRvUGxhY2U6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLmF1dG9QbGFjZTtcbiAgICAgIH1cbiAgICB9LFxuICAgIGNsb3NlT25Ub3A6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLmNsb3NlT25Ub3A7XG4gICAgICB9XG4gICAgfSxcbiAgICBwcmVzZXQ6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICBpZiAoX3RoaXMucGFyZW50KSB7XG4gICAgICAgICAgcmV0dXJuIF90aGlzLmdldFJvb3QoKS5wcmVzZXQ7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHBhcmFtcy5sb2FkLnByZXNldDtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCQkMSh2KSB7XG4gICAgICAgIGlmIChfdGhpcy5wYXJlbnQpIHtcbiAgICAgICAgICBfdGhpcy5nZXRSb290KCkucHJlc2V0ID0gdjtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBwYXJhbXMubG9hZC5wcmVzZXQgPSB2O1xuICAgICAgICB9XG4gICAgICAgIHNldFByZXNldFNlbGVjdEluZGV4KHRoaXMpO1xuICAgICAgICBfdGhpcy5yZXZlcnQoKTtcbiAgICAgIH1cbiAgICB9LFxuICAgIHdpZHRoOiB7XG4gICAgICBnZXQ6IGZ1bmN0aW9uIGdldCQkMSgpIHtcbiAgICAgICAgcmV0dXJuIHBhcmFtcy53aWR0aDtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCQkMSh2KSB7XG4gICAgICAgIHBhcmFtcy53aWR0aCA9IHY7XG4gICAgICAgIHNldFdpZHRoKF90aGlzLCB2KTtcbiAgICAgIH1cbiAgICB9LFxuICAgIG5hbWU6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLm5hbWU7XG4gICAgICB9LFxuICAgICAgc2V0OiBmdW5jdGlvbiBzZXQkJDEodikge1xuICAgICAgICBwYXJhbXMubmFtZSA9IHY7XG4gICAgICAgIGlmICh0aXRsZVJvdykge1xuICAgICAgICAgIHRpdGxlUm93LmlubmVySFRNTCA9IHBhcmFtcy5uYW1lO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSxcbiAgICBjbG9zZWQ6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLmNsb3NlZDtcbiAgICAgIH0sXG4gICAgICBzZXQ6IGZ1bmN0aW9uIHNldCQkMSh2KSB7XG4gICAgICAgIHBhcmFtcy5jbG9zZWQgPSB2O1xuICAgICAgICBpZiAocGFyYW1zLmNsb3NlZCkge1xuICAgICAgICAgIGRvbS5hZGRDbGFzcyhfdGhpcy5fX3VsLCBHVUkuQ0xBU1NfQ0xPU0VEKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBkb20ucmVtb3ZlQ2xhc3MoX3RoaXMuX191bCwgR1VJLkNMQVNTX0NMT1NFRCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vblJlc2l6ZSgpO1xuICAgICAgICBpZiAoX3RoaXMuX19jbG9zZUJ1dHRvbikge1xuICAgICAgICAgIF90aGlzLl9fY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gdiA/IEdVSS5URVhUX09QRU4gOiBHVUkuVEVYVF9DTE9TRUQ7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9LFxuICAgIGxvYWQ6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gcGFyYW1zLmxvYWQ7XG4gICAgICB9XG4gICAgfSxcbiAgICB1c2VMb2NhbFN0b3JhZ2U6IHtcbiAgICAgIGdldDogZnVuY3Rpb24gZ2V0JCQxKCkge1xuICAgICAgICByZXR1cm4gdXNlTG9jYWxTdG9yYWdlO1xuICAgICAgfSxcbiAgICAgIHNldDogZnVuY3Rpb24gc2V0JCQxKGJvb2wpIHtcbiAgICAgICAgaWYgKFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UpIHtcbiAgICAgICAgICB1c2VMb2NhbFN0b3JhZ2UgPSBib29sO1xuICAgICAgICAgIGlmIChib29sKSB7XG4gICAgICAgICAgICBkb20uYmluZCh3aW5kb3csICd1bmxvYWQnLCBzYXZlVG9Mb2NhbFN0b3JhZ2UpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBkb20udW5iaW5kKHdpbmRvdywgJ3VubG9hZCcsIHNhdmVUb0xvY2FsU3RvcmFnZSk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGxvY2FsU3RvcmFnZS5zZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2goX3RoaXMsICdpc0xvY2FsJyksIGJvb2wpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9KTtcbiAgaWYgKENvbW1vbi5pc1VuZGVmaW5lZChwYXJhbXMucGFyZW50KSkge1xuICAgIHRoaXMuY2xvc2VkID0gcGFyYW1zLmNsb3NlZCB8fCBmYWxzZTtcbiAgICBkb20uYWRkQ2xhc3ModGhpcy5kb21FbGVtZW50LCBHVUkuQ0xBU1NfTUFJTik7XG4gICAgZG9tLm1ha2VTZWxlY3RhYmxlKHRoaXMuZG9tRWxlbWVudCwgZmFsc2UpO1xuICAgIGlmIChTVVBQT1JUU19MT0NBTF9TVE9SQUdFKSB7XG4gICAgICBpZiAodXNlTG9jYWxTdG9yYWdlKSB7XG4gICAgICAgIF90aGlzLnVzZUxvY2FsU3RvcmFnZSA9IHRydWU7XG4gICAgICAgIHZhciBzYXZlZEd1aSA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2godGhpcywgJ2d1aScpKTtcbiAgICAgICAgaWYgKHNhdmVkR3VpKSB7XG4gICAgICAgICAgcGFyYW1zLmxvYWQgPSBKU09OLnBhcnNlKHNhdmVkR3VpKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICB0aGlzLl9fY2xvc2VCdXR0b24gPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdkaXYnKTtcbiAgICB0aGlzLl9fY2xvc2VCdXR0b24uaW5uZXJIVE1MID0gR1VJLlRFWFRfQ0xPU0VEO1xuICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19DTE9TRV9CVVRUT04pO1xuICAgIGlmIChwYXJhbXMuY2xvc2VPblRvcCkge1xuICAgICAgZG9tLmFkZENsYXNzKHRoaXMuX19jbG9zZUJ1dHRvbiwgR1VJLkNMQVNTX0NMT1NFX1RPUCk7XG4gICAgICB0aGlzLmRvbUVsZW1lbnQuaW5zZXJ0QmVmb3JlKHRoaXMuX19jbG9zZUJ1dHRvbiwgdGhpcy5kb21FbGVtZW50LmNoaWxkTm9kZXNbMF0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBkb20uYWRkQ2xhc3ModGhpcy5fX2Nsb3NlQnV0dG9uLCBHVUkuQ0xBU1NfQ0xPU0VfQk9UVE9NKTtcbiAgICAgIHRoaXMuZG9tRWxlbWVudC5hcHBlbmRDaGlsZCh0aGlzLl9fY2xvc2VCdXR0b24pO1xuICAgIH1cbiAgICBkb20uYmluZCh0aGlzLl9fY2xvc2VCdXR0b24sICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgIF90aGlzLmNsb3NlZCA9ICFfdGhpcy5jbG9zZWQ7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgaWYgKHBhcmFtcy5jbG9zZWQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcGFyYW1zLmNsb3NlZCA9IHRydWU7XG4gICAgfVxuICAgIHZhciB0aXRsZVJvd05hbWUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShwYXJhbXMubmFtZSk7XG4gICAgZG9tLmFkZENsYXNzKHRpdGxlUm93TmFtZSwgJ2NvbnRyb2xsZXItbmFtZScpO1xuICAgIHRpdGxlUm93ID0gYWRkUm93KF90aGlzLCB0aXRsZVJvd05hbWUpO1xuICAgIHZhciBvbkNsaWNrVGl0bGUgPSBmdW5jdGlvbiBvbkNsaWNrVGl0bGUoZSkge1xuICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgX3RoaXMuY2xvc2VkID0gIV90aGlzLmNsb3NlZDtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIGRvbS5hZGRDbGFzcyh0aGlzLl9fdWwsIEdVSS5DTEFTU19DTE9TRUQpO1xuICAgIGRvbS5hZGRDbGFzcyh0aXRsZVJvdywgJ3RpdGxlJyk7XG4gICAgZG9tLmJpbmQodGl0bGVSb3csICdjbGljaycsIG9uQ2xpY2tUaXRsZSk7XG4gICAgaWYgKCFwYXJhbXMuY2xvc2VkKSB7XG4gICAgICB0aGlzLmNsb3NlZCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuICBpZiAocGFyYW1zLmF1dG9QbGFjZSkge1xuICAgIGlmIChDb21tb24uaXNVbmRlZmluZWQocGFyYW1zLnBhcmVudCkpIHtcbiAgICAgIGlmIChhdXRvUGxhY2VWaXJnaW4pIHtcbiAgICAgICAgYXV0b1BsYWNlQ29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gICAgICAgIGRvbS5hZGRDbGFzcyhhdXRvUGxhY2VDb250YWluZXIsIENTU19OQU1FU1BBQ0UpO1xuICAgICAgICBkb20uYWRkQ2xhc3MoYXV0b1BsYWNlQ29udGFpbmVyLCBHVUkuQ0xBU1NfQVVUT19QTEFDRV9DT05UQUlORVIpO1xuICAgICAgICBkb2N1bWVudC5ib2R5LmFwcGVuZENoaWxkKGF1dG9QbGFjZUNvbnRhaW5lcik7XG4gICAgICAgIGF1dG9QbGFjZVZpcmdpbiA9IGZhbHNlO1xuICAgICAgfVxuICAgICAgYXV0b1BsYWNlQ29udGFpbmVyLmFwcGVuZENoaWxkKHRoaXMuZG9tRWxlbWVudCk7XG4gICAgICBkb20uYWRkQ2xhc3ModGhpcy5kb21FbGVtZW50LCBHVUkuQ0xBU1NfQVVUT19QTEFDRSk7XG4gICAgfVxuICAgIGlmICghdGhpcy5wYXJlbnQpIHtcbiAgICAgIHNldFdpZHRoKF90aGlzLCBwYXJhbXMud2lkdGgpO1xuICAgIH1cbiAgfVxuICB0aGlzLl9fcmVzaXplSGFuZGxlciA9IGZ1bmN0aW9uICgpIHtcbiAgICBfdGhpcy5vblJlc2l6ZURlYm91bmNlZCgpO1xuICB9O1xuICBkb20uYmluZCh3aW5kb3csICdyZXNpemUnLCB0aGlzLl9fcmVzaXplSGFuZGxlcik7XG4gIGRvbS5iaW5kKHRoaXMuX191bCwgJ3dlYmtpdFRyYW5zaXRpb25FbmQnLCB0aGlzLl9fcmVzaXplSGFuZGxlcik7XG4gIGRvbS5iaW5kKHRoaXMuX191bCwgJ3RyYW5zaXRpb25lbmQnLCB0aGlzLl9fcmVzaXplSGFuZGxlcik7XG4gIGRvbS5iaW5kKHRoaXMuX191bCwgJ29UcmFuc2l0aW9uRW5kJywgdGhpcy5fX3Jlc2l6ZUhhbmRsZXIpO1xuICB0aGlzLm9uUmVzaXplKCk7XG4gIGlmIChwYXJhbXMucmVzaXphYmxlKSB7XG4gICAgYWRkUmVzaXplSGFuZGxlKHRoaXMpO1xuICB9XG4gIHNhdmVUb0xvY2FsU3RvcmFnZSA9IGZ1bmN0aW9uIHNhdmVUb0xvY2FsU3RvcmFnZSgpIHtcbiAgICBpZiAoU1VQUE9SVFNfTE9DQUxfU1RPUkFHRSAmJiBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKF90aGlzLCAnaXNMb2NhbCcpKSA9PT0gJ3RydWUnKSB7XG4gICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShnZXRMb2NhbFN0b3JhZ2VIYXNoKF90aGlzLCAnZ3VpJyksIEpTT04uc3RyaW5naWZ5KF90aGlzLmdldFNhdmVPYmplY3QoKSkpO1xuICAgIH1cbiAgfTtcbiAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2VJZlBvc3NpYmxlID0gc2F2ZVRvTG9jYWxTdG9yYWdlO1xuICBmdW5jdGlvbiByZXNldFdpZHRoKCkge1xuICAgIHZhciByb290ID0gX3RoaXMuZ2V0Um9vdCgpO1xuICAgIHJvb3Qud2lkdGggKz0gMTtcbiAgICBDb21tb24uZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgcm9vdC53aWR0aCAtPSAxO1xuICAgIH0pO1xuICB9XG4gIGlmICghcGFyYW1zLnBhcmVudCkge1xuICAgIHJlc2V0V2lkdGgoKTtcbiAgfVxufTtcbkdVSS50b2dnbGVIaWRlID0gZnVuY3Rpb24gKCkge1xuICBoaWRlID0gIWhpZGU7XG4gIENvbW1vbi5lYWNoKGhpZGVhYmxlR3VpcywgZnVuY3Rpb24gKGd1aSkge1xuICAgIGd1aS5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSBoaWRlID8gJ25vbmUnIDogJyc7XG4gIH0pO1xufTtcbkdVSS5DTEFTU19BVVRPX1BMQUNFID0gJ2EnO1xuR1VJLkNMQVNTX0FVVE9fUExBQ0VfQ09OVEFJTkVSID0gJ2FjJztcbkdVSS5DTEFTU19NQUlOID0gJ21haW4nO1xuR1VJLkNMQVNTX0NPTlRST0xMRVJfUk9XID0gJ2NyJztcbkdVSS5DTEFTU19UT09fVEFMTCA9ICd0YWxsZXItdGhhbi13aW5kb3cnO1xuR1VJLkNMQVNTX0NMT1NFRCA9ICdjbG9zZWQnO1xuR1VJLkNMQVNTX0NMT1NFX0JVVFRPTiA9ICdjbG9zZS1idXR0b24nO1xuR1VJLkNMQVNTX0NMT1NFX1RPUCA9ICdjbG9zZS10b3AnO1xuR1VJLkNMQVNTX0NMT1NFX0JPVFRPTSA9ICdjbG9zZS1ib3R0b20nO1xuR1VJLkNMQVNTX0RSQUcgPSAnZHJhZyc7XG5HVUkuREVGQVVMVF9XSURUSCA9IDI0NTtcbkdVSS5URVhUX0NMT1NFRCA9ICdDbG9zZSBDb250cm9scyc7XG5HVUkuVEVYVF9PUEVOID0gJ09wZW4gQ29udHJvbHMnO1xuR1VJLl9rZXlkb3duSGFuZGxlciA9IGZ1bmN0aW9uIChlKSB7XG4gIGlmIChkb2N1bWVudC5hY3RpdmVFbGVtZW50LnR5cGUgIT09ICd0ZXh0JyAmJiAoZS53aGljaCA9PT0gSElERV9LRVlfQ09ERSB8fCBlLmtleUNvZGUgPT09IEhJREVfS0VZX0NPREUpKSB7XG4gICAgR1VJLnRvZ2dsZUhpZGUoKTtcbiAgfVxufTtcbmRvbS5iaW5kKHdpbmRvdywgJ2tleWRvd24nLCBHVUkuX2tleWRvd25IYW5kbGVyLCBmYWxzZSk7XG5Db21tb24uZXh0ZW5kKEdVSS5wcm90b3R5cGUsXG57XG4gIGFkZDogZnVuY3Rpb24gYWRkKG9iamVjdCwgcHJvcGVydHkpIHtcbiAgICByZXR1cm4gX2FkZCh0aGlzLCBvYmplY3QsIHByb3BlcnR5LCB7XG4gICAgICBmYWN0b3J5QXJnczogQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoYXJndW1lbnRzLCAyKVxuICAgIH0pO1xuICB9LFxuICBhZGRDb2xvcjogZnVuY3Rpb24gYWRkQ29sb3Iob2JqZWN0LCBwcm9wZXJ0eSkge1xuICAgIHJldHVybiBfYWRkKHRoaXMsIG9iamVjdCwgcHJvcGVydHksIHtcbiAgICAgIGNvbG9yOiB0cnVlXG4gICAgfSk7XG4gIH0sXG4gIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKGNvbnRyb2xsZXIpIHtcbiAgICB0aGlzLl9fdWwucmVtb3ZlQ2hpbGQoY29udHJvbGxlci5fX2xpKTtcbiAgICB0aGlzLl9fY29udHJvbGxlcnMuc3BsaWNlKHRoaXMuX19jb250cm9sbGVycy5pbmRleE9mKGNvbnRyb2xsZXIpLCAxKTtcbiAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgIENvbW1vbi5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5vblJlc2l6ZSgpO1xuICAgIH0pO1xuICB9LFxuICBkZXN0cm95OiBmdW5jdGlvbiBkZXN0cm95KCkge1xuICAgIGlmICh0aGlzLnBhcmVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdPbmx5IHRoZSByb290IEdVSSBzaG91bGQgYmUgcmVtb3ZlZCB3aXRoIC5kZXN0cm95KCkuICcgKyAnRm9yIHN1YmZvbGRlcnMsIHVzZSBndWkucmVtb3ZlRm9sZGVyKGZvbGRlcikgaW5zdGVhZC4nKTtcbiAgICB9XG4gICAgaWYgKHRoaXMuYXV0b1BsYWNlKSB7XG4gICAgICBhdXRvUGxhY2VDb250YWluZXIucmVtb3ZlQ2hpbGQodGhpcy5kb21FbGVtZW50KTtcbiAgICB9XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBDb21tb24uZWFjaCh0aGlzLl9fZm9sZGVycywgZnVuY3Rpb24gKHN1YmZvbGRlcikge1xuICAgICAgX3RoaXMucmVtb3ZlRm9sZGVyKHN1YmZvbGRlcik7XG4gICAgfSk7XG4gICAgZG9tLnVuYmluZCh3aW5kb3csICdrZXlkb3duJywgR1VJLl9rZXlkb3duSGFuZGxlciwgZmFsc2UpO1xuICAgIHJlbW92ZUxpc3RlbmVycyh0aGlzKTtcbiAgfSxcbiAgYWRkRm9sZGVyOiBmdW5jdGlvbiBhZGRGb2xkZXIobmFtZSkge1xuICAgIGlmICh0aGlzLl9fZm9sZGVyc1tuYW1lXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBhbHJlYWR5IGhhdmUgYSBmb2xkZXIgaW4gdGhpcyBHVUkgYnkgdGhlJyArICcgbmFtZSBcIicgKyBuYW1lICsgJ1wiJyk7XG4gICAgfVxuICAgIHZhciBuZXdHdWlQYXJhbXMgPSB7IG5hbWU6IG5hbWUsIHBhcmVudDogdGhpcyB9O1xuICAgIG5ld0d1aVBhcmFtcy5hdXRvUGxhY2UgPSB0aGlzLmF1dG9QbGFjZTtcbiAgICBpZiAodGhpcy5sb2FkICYmXG4gICAgdGhpcy5sb2FkLmZvbGRlcnMgJiZcbiAgICB0aGlzLmxvYWQuZm9sZGVyc1tuYW1lXSkge1xuICAgICAgbmV3R3VpUGFyYW1zLmNsb3NlZCA9IHRoaXMubG9hZC5mb2xkZXJzW25hbWVdLmNsb3NlZDtcbiAgICAgIG5ld0d1aVBhcmFtcy5sb2FkID0gdGhpcy5sb2FkLmZvbGRlcnNbbmFtZV07XG4gICAgfVxuICAgIHZhciBndWkgPSBuZXcgR1VJKG5ld0d1aVBhcmFtcyk7XG4gICAgdGhpcy5fX2ZvbGRlcnNbbmFtZV0gPSBndWk7XG4gICAgdmFyIGxpID0gYWRkUm93KHRoaXMsIGd1aS5kb21FbGVtZW50KTtcbiAgICBkb20uYWRkQ2xhc3MobGksICdmb2xkZXInKTtcbiAgICByZXR1cm4gZ3VpO1xuICB9LFxuICByZW1vdmVGb2xkZXI6IGZ1bmN0aW9uIHJlbW92ZUZvbGRlcihmb2xkZXIpIHtcbiAgICB0aGlzLl9fdWwucmVtb3ZlQ2hpbGQoZm9sZGVyLmRvbUVsZW1lbnQucGFyZW50RWxlbWVudCk7XG4gICAgZGVsZXRlIHRoaXMuX19mb2xkZXJzW2ZvbGRlci5uYW1lXTtcbiAgICBpZiAodGhpcy5sb2FkICYmXG4gICAgdGhpcy5sb2FkLmZvbGRlcnMgJiZcbiAgICB0aGlzLmxvYWQuZm9sZGVyc1tmb2xkZXIubmFtZV0pIHtcbiAgICAgIGRlbGV0ZSB0aGlzLmxvYWQuZm9sZGVyc1tmb2xkZXIubmFtZV07XG4gICAgfVxuICAgIHJlbW92ZUxpc3RlbmVycyhmb2xkZXIpO1xuICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgQ29tbW9uLmVhY2goZm9sZGVyLl9fZm9sZGVycywgZnVuY3Rpb24gKHN1YmZvbGRlcikge1xuICAgICAgZm9sZGVyLnJlbW92ZUZvbGRlcihzdWJmb2xkZXIpO1xuICAgIH0pO1xuICAgIENvbW1vbi5kZWZlcihmdW5jdGlvbiAoKSB7XG4gICAgICBfdGhpcy5vblJlc2l6ZSgpO1xuICAgIH0pO1xuICB9LFxuICBvcGVuOiBmdW5jdGlvbiBvcGVuKCkge1xuICAgIHRoaXMuY2xvc2VkID0gZmFsc2U7XG4gIH0sXG4gIGNsb3NlOiBmdW5jdGlvbiBjbG9zZSgpIHtcbiAgICB0aGlzLmNsb3NlZCA9IHRydWU7XG4gIH0sXG4gIGhpZGU6IGZ1bmN0aW9uIGhpZGUoKSB7XG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIH0sXG4gIHNob3c6IGZ1bmN0aW9uIHNob3coKSB7XG4gICAgdGhpcy5kb21FbGVtZW50LnN0eWxlLmRpc3BsYXkgPSAnJztcbiAgfSxcbiAgb25SZXNpemU6IGZ1bmN0aW9uIG9uUmVzaXplKCkge1xuICAgIHZhciByb290ID0gdGhpcy5nZXRSb290KCk7XG4gICAgaWYgKHJvb3Quc2Nyb2xsYWJsZSkge1xuICAgICAgdmFyIHRvcCA9IGRvbS5nZXRPZmZzZXQocm9vdC5fX3VsKS50b3A7XG4gICAgICB2YXIgaCA9IDA7XG4gICAgICBDb21tb24uZWFjaChyb290Ll9fdWwuY2hpbGROb2RlcywgZnVuY3Rpb24gKG5vZGUpIHtcbiAgICAgICAgaWYgKCEocm9vdC5hdXRvUGxhY2UgJiYgbm9kZSA9PT0gcm9vdC5fX3NhdmVfcm93KSkge1xuICAgICAgICAgIGggKz0gZG9tLmdldEhlaWdodChub2RlKTtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgICBpZiAod2luZG93LmlubmVySGVpZ2h0IC0gdG9wIC0gQ0xPU0VfQlVUVE9OX0hFSUdIVCA8IGgpIHtcbiAgICAgICAgZG9tLmFkZENsYXNzKHJvb3QuZG9tRWxlbWVudCwgR1VJLkNMQVNTX1RPT19UQUxMKTtcbiAgICAgICAgcm9vdC5fX3VsLnN0eWxlLmhlaWdodCA9IHdpbmRvdy5pbm5lckhlaWdodCAtIHRvcCAtIENMT1NFX0JVVFRPTl9IRUlHSFQgKyAncHgnO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZG9tLnJlbW92ZUNsYXNzKHJvb3QuZG9tRWxlbWVudCwgR1VJLkNMQVNTX1RPT19UQUxMKTtcbiAgICAgICAgcm9vdC5fX3VsLnN0eWxlLmhlaWdodCA9ICdhdXRvJztcbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHJvb3QuX19yZXNpemVfaGFuZGxlKSB7XG4gICAgICBDb21tb24uZGVmZXIoZnVuY3Rpb24gKCkge1xuICAgICAgICByb290Ll9fcmVzaXplX2hhbmRsZS5zdHlsZS5oZWlnaHQgPSByb290Ll9fdWwub2Zmc2V0SGVpZ2h0ICsgJ3B4JztcbiAgICAgIH0pO1xuICAgIH1cbiAgICBpZiAocm9vdC5fX2Nsb3NlQnV0dG9uKSB7XG4gICAgICByb290Ll9fY2xvc2VCdXR0b24uc3R5bGUud2lkdGggPSByb290LndpZHRoICsgJ3B4JztcbiAgICB9XG4gIH0sXG4gIG9uUmVzaXplRGVib3VuY2VkOiBDb21tb24uZGVib3VuY2UoZnVuY3Rpb24gKCkge1xuICAgIHRoaXMub25SZXNpemUoKTtcbiAgfSwgNTApLFxuICByZW1lbWJlcjogZnVuY3Rpb24gcmVtZW1iZXIoKSB7XG4gICAgaWYgKENvbW1vbi5pc1VuZGVmaW5lZChTQVZFX0RJQUxPR1VFKSkge1xuICAgICAgU0FWRV9ESUFMT0dVRSA9IG5ldyBDZW50ZXJlZERpdigpO1xuICAgICAgU0FWRV9ESUFMT0dVRS5kb21FbGVtZW50LmlubmVySFRNTCA9IHNhdmVEaWFsb2dDb250ZW50cztcbiAgICB9XG4gICAgaWYgKHRoaXMucGFyZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ1lvdSBjYW4gb25seSBjYWxsIHJlbWVtYmVyIG9uIGEgdG9wIGxldmVsIEdVSS4nKTtcbiAgICB9XG4gICAgdmFyIF90aGlzID0gdGhpcztcbiAgICBDb21tb24uZWFjaChBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpLCBmdW5jdGlvbiAob2JqZWN0KSB7XG4gICAgICBpZiAoX3RoaXMuX19yZW1lbWJlcmVkT2JqZWN0cy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgYWRkU2F2ZU1lbnUoX3RoaXMpO1xuICAgICAgfVxuICAgICAgaWYgKF90aGlzLl9fcmVtZW1iZXJlZE9iamVjdHMuaW5kZXhPZihvYmplY3QpID09PSAtMSkge1xuICAgICAgICBfdGhpcy5fX3JlbWVtYmVyZWRPYmplY3RzLnB1c2gob2JqZWN0KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAodGhpcy5hdXRvUGxhY2UpIHtcbiAgICAgIHNldFdpZHRoKHRoaXMsIHRoaXMud2lkdGgpO1xuICAgIH1cbiAgfSxcbiAgZ2V0Um9vdDogZnVuY3Rpb24gZ2V0Um9vdCgpIHtcbiAgICB2YXIgZ3VpID0gdGhpcztcbiAgICB3aGlsZSAoZ3VpLnBhcmVudCkge1xuICAgICAgZ3VpID0gZ3VpLnBhcmVudDtcbiAgICB9XG4gICAgcmV0dXJuIGd1aTtcbiAgfSxcbiAgZ2V0U2F2ZU9iamVjdDogZnVuY3Rpb24gZ2V0U2F2ZU9iamVjdCgpIHtcbiAgICB2YXIgdG9SZXR1cm4gPSB0aGlzLmxvYWQ7XG4gICAgdG9SZXR1cm4uY2xvc2VkID0gdGhpcy5jbG9zZWQ7XG4gICAgaWYgKHRoaXMuX19yZW1lbWJlcmVkT2JqZWN0cy5sZW5ndGggPiAwKSB7XG4gICAgICB0b1JldHVybi5wcmVzZXQgPSB0aGlzLnByZXNldDtcbiAgICAgIGlmICghdG9SZXR1cm4ucmVtZW1iZXJlZCkge1xuICAgICAgICB0b1JldHVybi5yZW1lbWJlcmVkID0ge307XG4gICAgICB9XG4gICAgICB0b1JldHVybi5yZW1lbWJlcmVkW3RoaXMucHJlc2V0XSA9IGdldEN1cnJlbnRQcmVzZXQodGhpcyk7XG4gICAgfVxuICAgIHRvUmV0dXJuLmZvbGRlcnMgPSB7fTtcbiAgICBDb21tb24uZWFjaCh0aGlzLl9fZm9sZGVycywgZnVuY3Rpb24gKGVsZW1lbnQsIGtleSkge1xuICAgICAgdG9SZXR1cm4uZm9sZGVyc1trZXldID0gZWxlbWVudC5nZXRTYXZlT2JqZWN0KCk7XG4gICAgfSk7XG4gICAgcmV0dXJuIHRvUmV0dXJuO1xuICB9LFxuICBzYXZlOiBmdW5jdGlvbiBzYXZlKCkge1xuICAgIGlmICghdGhpcy5sb2FkLnJlbWVtYmVyZWQpIHtcbiAgICAgIHRoaXMubG9hZC5yZW1lbWJlcmVkID0ge307XG4gICAgfVxuICAgIHRoaXMubG9hZC5yZW1lbWJlcmVkW3RoaXMucHJlc2V0XSA9IGdldEN1cnJlbnRQcmVzZXQodGhpcyk7XG4gICAgbWFya1ByZXNldE1vZGlmaWVkKHRoaXMsIGZhbHNlKTtcbiAgICB0aGlzLnNhdmVUb0xvY2FsU3RvcmFnZUlmUG9zc2libGUoKTtcbiAgfSxcbiAgc2F2ZUFzOiBmdW5jdGlvbiBzYXZlQXMocHJlc2V0TmFtZSkge1xuICAgIGlmICghdGhpcy5sb2FkLnJlbWVtYmVyZWQpIHtcbiAgICAgIHRoaXMubG9hZC5yZW1lbWJlcmVkID0ge307XG4gICAgICB0aGlzLmxvYWQucmVtZW1iZXJlZFtERUZBVUxUX0RFRkFVTFRfUFJFU0VUX05BTUVdID0gZ2V0Q3VycmVudFByZXNldCh0aGlzLCB0cnVlKTtcbiAgICB9XG4gICAgdGhpcy5sb2FkLnJlbWVtYmVyZWRbcHJlc2V0TmFtZV0gPSBnZXRDdXJyZW50UHJlc2V0KHRoaXMpO1xuICAgIHRoaXMucHJlc2V0ID0gcHJlc2V0TmFtZTtcbiAgICBhZGRQcmVzZXRPcHRpb24odGhpcywgcHJlc2V0TmFtZSwgdHJ1ZSk7XG4gICAgdGhpcy5zYXZlVG9Mb2NhbFN0b3JhZ2VJZlBvc3NpYmxlKCk7XG4gIH0sXG4gIHJldmVydDogZnVuY3Rpb24gcmV2ZXJ0KGd1aSkge1xuICAgIENvbW1vbi5lYWNoKHRoaXMuX19jb250cm9sbGVycywgZnVuY3Rpb24gKGNvbnRyb2xsZXIpIHtcbiAgICAgIGlmICghdGhpcy5nZXRSb290KCkubG9hZC5yZW1lbWJlcmVkKSB7XG4gICAgICAgIGNvbnRyb2xsZXIuc2V0VmFsdWUoY29udHJvbGxlci5pbml0aWFsVmFsdWUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVjYWxsU2F2ZWRWYWx1ZShndWkgfHwgdGhpcy5nZXRSb290KCksIGNvbnRyb2xsZXIpO1xuICAgICAgfVxuICAgICAgaWYgKGNvbnRyb2xsZXIuX19vbkZpbmlzaENoYW5nZSkge1xuICAgICAgICBjb250cm9sbGVyLl9fb25GaW5pc2hDaGFuZ2UuY2FsbChjb250cm9sbGVyLCBjb250cm9sbGVyLmdldFZhbHVlKCkpO1xuICAgICAgfVxuICAgIH0sIHRoaXMpO1xuICAgIENvbW1vbi5lYWNoKHRoaXMuX19mb2xkZXJzLCBmdW5jdGlvbiAoZm9sZGVyKSB7XG4gICAgICBmb2xkZXIucmV2ZXJ0KGZvbGRlcik7XG4gICAgfSk7XG4gICAgaWYgKCFndWkpIHtcbiAgICAgIG1hcmtQcmVzZXRNb2RpZmllZCh0aGlzLmdldFJvb3QoKSwgZmFsc2UpO1xuICAgIH1cbiAgfSxcbiAgbGlzdGVuOiBmdW5jdGlvbiBsaXN0ZW4oY29udHJvbGxlcikge1xuICAgIHZhciBpbml0ID0gdGhpcy5fX2xpc3RlbmluZy5sZW5ndGggPT09IDA7XG4gICAgdGhpcy5fX2xpc3RlbmluZy5wdXNoKGNvbnRyb2xsZXIpO1xuICAgIGlmIChpbml0KSB7XG4gICAgICB1cGRhdGVEaXNwbGF5cyh0aGlzLl9fbGlzdGVuaW5nKTtcbiAgICB9XG4gIH0sXG4gIHVwZGF0ZURpc3BsYXk6IGZ1bmN0aW9uIHVwZGF0ZURpc3BsYXkoKSB7XG4gICAgQ29tbW9uLmVhY2godGhpcy5fX2NvbnRyb2xsZXJzLCBmdW5jdGlvbiAoY29udHJvbGxlcikge1xuICAgICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5KCk7XG4gICAgfSk7XG4gICAgQ29tbW9uLmVhY2godGhpcy5fX2ZvbGRlcnMsIGZ1bmN0aW9uIChmb2xkZXIpIHtcbiAgICAgIGZvbGRlci51cGRhdGVEaXNwbGF5KCk7XG4gICAgfSk7XG4gIH1cbn0pO1xuZnVuY3Rpb24gYWRkUm93KGd1aSwgbmV3RG9tLCBsaUJlZm9yZSkge1xuICB2YXIgbGkgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdsaScpO1xuICBpZiAobmV3RG9tKSB7XG4gICAgbGkuYXBwZW5kQ2hpbGQobmV3RG9tKTtcbiAgfVxuICBpZiAobGlCZWZvcmUpIHtcbiAgICBndWkuX191bC5pbnNlcnRCZWZvcmUobGksIGxpQmVmb3JlKTtcbiAgfSBlbHNlIHtcbiAgICBndWkuX191bC5hcHBlbmRDaGlsZChsaSk7XG4gIH1cbiAgZ3VpLm9uUmVzaXplKCk7XG4gIHJldHVybiBsaTtcbn1cbmZ1bmN0aW9uIHJlbW92ZUxpc3RlbmVycyhndWkpIHtcbiAgZG9tLnVuYmluZCh3aW5kb3csICdyZXNpemUnLCBndWkuX19yZXNpemVIYW5kbGVyKTtcbiAgaWYgKGd1aS5zYXZlVG9Mb2NhbFN0b3JhZ2VJZlBvc3NpYmxlKSB7XG4gICAgZG9tLnVuYmluZCh3aW5kb3csICd1bmxvYWQnLCBndWkuc2F2ZVRvTG9jYWxTdG9yYWdlSWZQb3NzaWJsZSk7XG4gIH1cbn1cbmZ1bmN0aW9uIG1hcmtQcmVzZXRNb2RpZmllZChndWksIG1vZGlmaWVkKSB7XG4gIHZhciBvcHQgPSBndWkuX19wcmVzZXRfc2VsZWN0W2d1aS5fX3ByZXNldF9zZWxlY3Quc2VsZWN0ZWRJbmRleF07XG4gIGlmIChtb2RpZmllZCkge1xuICAgIG9wdC5pbm5lckhUTUwgPSBvcHQudmFsdWUgKyAnKic7XG4gIH0gZWxzZSB7XG4gICAgb3B0LmlubmVySFRNTCA9IG9wdC52YWx1ZTtcbiAgfVxufVxuZnVuY3Rpb24gYXVnbWVudENvbnRyb2xsZXIoZ3VpLCBsaSwgY29udHJvbGxlcikge1xuICBjb250cm9sbGVyLl9fbGkgPSBsaTtcbiAgY29udHJvbGxlci5fX2d1aSA9IGd1aTtcbiAgQ29tbW9uLmV4dGVuZChjb250cm9sbGVyLCAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge1xuICAgIG9wdGlvbnM6IGZ1bmN0aW9uIG9wdGlvbnMoX29wdGlvbnMpIHtcbiAgICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID4gMSkge1xuICAgICAgICB2YXIgbmV4dFNpYmxpbmcgPSBjb250cm9sbGVyLl9fbGkubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBjb250cm9sbGVyLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gX2FkZChndWksIGNvbnRyb2xsZXIub2JqZWN0LCBjb250cm9sbGVyLnByb3BlcnR5LCB7XG4gICAgICAgICAgYmVmb3JlOiBuZXh0U2libGluZyxcbiAgICAgICAgICBmYWN0b3J5QXJnczogW0NvbW1vbi50b0FycmF5KGFyZ3VtZW50cyldXG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgICAgaWYgKENvbW1vbi5pc0FycmF5KF9vcHRpb25zKSB8fCBDb21tb24uaXNPYmplY3QoX29wdGlvbnMpKSB7XG4gICAgICAgIHZhciBfbmV4dFNpYmxpbmcgPSBjb250cm9sbGVyLl9fbGkubmV4dEVsZW1lbnRTaWJsaW5nO1xuICAgICAgICBjb250cm9sbGVyLnJlbW92ZSgpO1xuICAgICAgICByZXR1cm4gX2FkZChndWksIGNvbnRyb2xsZXIub2JqZWN0LCBjb250cm9sbGVyLnByb3BlcnR5LCB7XG4gICAgICAgICAgYmVmb3JlOiBfbmV4dFNpYmxpbmcsXG4gICAgICAgICAgZmFjdG9yeUFyZ3M6IFtfb3B0aW9uc11cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSxcbiAgICBuYW1lOiBmdW5jdGlvbiBuYW1lKF9uYW1lKSB7XG4gICAgICBjb250cm9sbGVyLl9fbGkuZmlyc3RFbGVtZW50Q2hpbGQuZmlyc3RFbGVtZW50Q2hpbGQuaW5uZXJIVE1MID0gX25hbWU7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9LFxuICAgIGxpc3RlbjogZnVuY3Rpb24gbGlzdGVuKCkge1xuICAgICAgY29udHJvbGxlci5fX2d1aS5saXN0ZW4oY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9LFxuICAgIHJlbW92ZTogZnVuY3Rpb24gcmVtb3ZlKCkge1xuICAgICAgY29udHJvbGxlci5fX2d1aS5yZW1vdmUoY29udHJvbGxlcik7XG4gICAgICByZXR1cm4gY29udHJvbGxlcjtcbiAgICB9XG4gIH0pO1xuICBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIE51bWJlckNvbnRyb2xsZXJTbGlkZXIpIHtcbiAgICB2YXIgYm94ID0gbmV3IE51bWJlckNvbnRyb2xsZXJCb3goY29udHJvbGxlci5vYmplY3QsIGNvbnRyb2xsZXIucHJvcGVydHksIHsgbWluOiBjb250cm9sbGVyLl9fbWluLCBtYXg6IGNvbnRyb2xsZXIuX19tYXgsIHN0ZXA6IGNvbnRyb2xsZXIuX19zdGVwIH0pO1xuICAgIENvbW1vbi5lYWNoKFsndXBkYXRlRGlzcGxheScsICdvbkNoYW5nZScsICdvbkZpbmlzaENoYW5nZScsICdzdGVwJywgJ21pbicsICdtYXgnXSwgZnVuY3Rpb24gKG1ldGhvZCkge1xuICAgICAgdmFyIHBjID0gY29udHJvbGxlclttZXRob2RdO1xuICAgICAgdmFyIHBiID0gYm94W21ldGhvZF07XG4gICAgICBjb250cm9sbGVyW21ldGhvZF0gPSBib3hbbWV0aG9kXSA9IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMpO1xuICAgICAgICBwYi5hcHBseShib3gsIGFyZ3MpO1xuICAgICAgICByZXR1cm4gcGMuYXBwbHkoY29udHJvbGxlciwgYXJncyk7XG4gICAgICB9O1xuICAgIH0pO1xuICAgIGRvbS5hZGRDbGFzcyhsaSwgJ2hhcy1zbGlkZXInKTtcbiAgICBjb250cm9sbGVyLmRvbUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGJveC5kb21FbGVtZW50LCBjb250cm9sbGVyLmRvbUVsZW1lbnQuZmlyc3RFbGVtZW50Q2hpbGQpO1xuICB9IGVsc2UgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBOdW1iZXJDb250cm9sbGVyQm94KSB7XG4gICAgdmFyIHIgPSBmdW5jdGlvbiByKHJldHVybmVkKSB7XG4gICAgICBpZiAoQ29tbW9uLmlzTnVtYmVyKGNvbnRyb2xsZXIuX19taW4pICYmIENvbW1vbi5pc051bWJlcihjb250cm9sbGVyLl9fbWF4KSkge1xuICAgICAgICB2YXIgb2xkTmFtZSA9IGNvbnRyb2xsZXIuX19saS5maXJzdEVsZW1lbnRDaGlsZC5maXJzdEVsZW1lbnRDaGlsZC5pbm5lckhUTUw7XG4gICAgICAgIHZhciB3YXNMaXN0ZW5pbmcgPSBjb250cm9sbGVyLl9fZ3VpLl9fbGlzdGVuaW5nLmluZGV4T2YoY29udHJvbGxlcikgPiAtMTtcbiAgICAgICAgY29udHJvbGxlci5yZW1vdmUoKTtcbiAgICAgICAgdmFyIG5ld0NvbnRyb2xsZXIgPSBfYWRkKGd1aSwgY29udHJvbGxlci5vYmplY3QsIGNvbnRyb2xsZXIucHJvcGVydHksIHtcbiAgICAgICAgICBiZWZvcmU6IGNvbnRyb2xsZXIuX19saS5uZXh0RWxlbWVudFNpYmxpbmcsXG4gICAgICAgICAgZmFjdG9yeUFyZ3M6IFtjb250cm9sbGVyLl9fbWluLCBjb250cm9sbGVyLl9fbWF4LCBjb250cm9sbGVyLl9fc3RlcF1cbiAgICAgICAgfSk7XG4gICAgICAgIG5ld0NvbnRyb2xsZXIubmFtZShvbGROYW1lKTtcbiAgICAgICAgaWYgKHdhc0xpc3RlbmluZykgbmV3Q29udHJvbGxlci5saXN0ZW4oKTtcbiAgICAgICAgcmV0dXJuIG5ld0NvbnRyb2xsZXI7XG4gICAgICB9XG4gICAgICByZXR1cm4gcmV0dXJuZWQ7XG4gICAgfTtcbiAgICBjb250cm9sbGVyLm1pbiA9IENvbW1vbi5jb21wb3NlKHIsIGNvbnRyb2xsZXIubWluKTtcbiAgICBjb250cm9sbGVyLm1heCA9IENvbW1vbi5jb21wb3NlKHIsIGNvbnRyb2xsZXIubWF4KTtcbiAgfSBlbHNlIGlmIChjb250cm9sbGVyIGluc3RhbmNlb2YgQm9vbGVhbkNvbnRyb2xsZXIpIHtcbiAgICBkb20uYmluZChsaSwgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgZG9tLmZha2VFdmVudChjb250cm9sbGVyLl9fY2hlY2tib3gsICdjbGljaycpO1xuICAgIH0pO1xuICAgIGRvbS5iaW5kKGNvbnRyb2xsZXIuX19jaGVja2JveCwgJ2NsaWNrJywgZnVuY3Rpb24gKGUpIHtcbiAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIEZ1bmN0aW9uQ29udHJvbGxlcikge1xuICAgIGRvbS5iaW5kKGxpLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkb20uZmFrZUV2ZW50KGNvbnRyb2xsZXIuX19idXR0b24sICdjbGljaycpO1xuICAgIH0pO1xuICAgIGRvbS5iaW5kKGxpLCAnbW91c2VvdmVyJywgZnVuY3Rpb24gKCkge1xuICAgICAgZG9tLmFkZENsYXNzKGNvbnRyb2xsZXIuX19idXR0b24sICdob3ZlcicpO1xuICAgIH0pO1xuICAgIGRvbS5iaW5kKGxpLCAnbW91c2VvdXQnLCBmdW5jdGlvbiAoKSB7XG4gICAgICBkb20ucmVtb3ZlQ2xhc3MoY29udHJvbGxlci5fX2J1dHRvbiwgJ2hvdmVyJyk7XG4gICAgfSk7XG4gIH0gZWxzZSBpZiAoY29udHJvbGxlciBpbnN0YW5jZW9mIENvbG9yQ29udHJvbGxlcikge1xuICAgIGRvbS5hZGRDbGFzcyhsaSwgJ2NvbG9yJyk7XG4gICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5ID0gQ29tbW9uLmNvbXBvc2UoZnVuY3Rpb24gKHZhbCkge1xuICAgICAgbGkuc3R5bGUuYm9yZGVyTGVmdENvbG9yID0gY29udHJvbGxlci5fX2NvbG9yLnRvU3RyaW5nKCk7XG4gICAgICByZXR1cm4gdmFsO1xuICAgIH0sIGNvbnRyb2xsZXIudXBkYXRlRGlzcGxheSk7XG4gICAgY29udHJvbGxlci51cGRhdGVEaXNwbGF5KCk7XG4gIH1cbiAgY29udHJvbGxlci5zZXRWYWx1ZSA9IENvbW1vbi5jb21wb3NlKGZ1bmN0aW9uICh2YWwpIHtcbiAgICBpZiAoZ3VpLmdldFJvb3QoKS5fX3ByZXNldF9zZWxlY3QgJiYgY29udHJvbGxlci5pc01vZGlmaWVkKCkpIHtcbiAgICAgIG1hcmtQcmVzZXRNb2RpZmllZChndWkuZ2V0Um9vdCgpLCB0cnVlKTtcbiAgICB9XG4gICAgcmV0dXJuIHZhbDtcbiAgfSwgY29udHJvbGxlci5zZXRWYWx1ZSk7XG59XG5mdW5jdGlvbiByZWNhbGxTYXZlZFZhbHVlKGd1aSwgY29udHJvbGxlcikge1xuICB2YXIgcm9vdCA9IGd1aS5nZXRSb290KCk7XG4gIHZhciBtYXRjaGVkSW5kZXggPSByb290Ll9fcmVtZW1iZXJlZE9iamVjdHMuaW5kZXhPZihjb250cm9sbGVyLm9iamVjdCk7XG4gIGlmIChtYXRjaGVkSW5kZXggIT09IC0xKSB7XG4gICAgdmFyIGNvbnRyb2xsZXJNYXAgPSByb290Ll9fcmVtZW1iZXJlZE9iamVjdEluZGVjZXNUb0NvbnRyb2xsZXJzW21hdGNoZWRJbmRleF07XG4gICAgaWYgKGNvbnRyb2xsZXJNYXAgPT09IHVuZGVmaW5lZCkge1xuICAgICAgY29udHJvbGxlck1hcCA9IHt9O1xuICAgICAgcm9vdC5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1ttYXRjaGVkSW5kZXhdID0gY29udHJvbGxlck1hcDtcbiAgICB9XG4gICAgY29udHJvbGxlck1hcFtjb250cm9sbGVyLnByb3BlcnR5XSA9IGNvbnRyb2xsZXI7XG4gICAgaWYgKHJvb3QubG9hZCAmJiByb290LmxvYWQucmVtZW1iZXJlZCkge1xuICAgICAgdmFyIHByZXNldE1hcCA9IHJvb3QubG9hZC5yZW1lbWJlcmVkO1xuICAgICAgdmFyIHByZXNldCA9IHZvaWQgMDtcbiAgICAgIGlmIChwcmVzZXRNYXBbZ3VpLnByZXNldF0pIHtcbiAgICAgICAgcHJlc2V0ID0gcHJlc2V0TWFwW2d1aS5wcmVzZXRdO1xuICAgICAgfSBlbHNlIGlmIChwcmVzZXRNYXBbREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FXSkge1xuICAgICAgICBwcmVzZXQgPSBwcmVzZXRNYXBbREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIGlmIChwcmVzZXRbbWF0Y2hlZEluZGV4XSAmJiBwcmVzZXRbbWF0Y2hlZEluZGV4XVtjb250cm9sbGVyLnByb3BlcnR5XSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgIHZhciB2YWx1ZSA9IHByZXNldFttYXRjaGVkSW5kZXhdW2NvbnRyb2xsZXIucHJvcGVydHldO1xuICAgICAgICBjb250cm9sbGVyLmluaXRpYWxWYWx1ZSA9IHZhbHVlO1xuICAgICAgICBjb250cm9sbGVyLnNldFZhbHVlKHZhbHVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIF9hZGQoZ3VpLCBvYmplY3QsIHByb3BlcnR5LCBwYXJhbXMpIHtcbiAgaWYgKG9iamVjdFtwcm9wZXJ0eV0gPT09IHVuZGVmaW5lZCkge1xuICAgIHRocm93IG5ldyBFcnJvcignT2JqZWN0IFwiJyArIG9iamVjdCArICdcIiBoYXMgbm8gcHJvcGVydHkgXCInICsgcHJvcGVydHkgKyAnXCInKTtcbiAgfVxuICB2YXIgY29udHJvbGxlciA9IHZvaWQgMDtcbiAgaWYgKHBhcmFtcy5jb2xvcikge1xuICAgIGNvbnRyb2xsZXIgPSBuZXcgQ29sb3JDb250cm9sbGVyKG9iamVjdCwgcHJvcGVydHkpO1xuICB9IGVsc2Uge1xuICAgIHZhciBmYWN0b3J5QXJncyA9IFtvYmplY3QsIHByb3BlcnR5XS5jb25jYXQocGFyYW1zLmZhY3RvcnlBcmdzKTtcbiAgICBjb250cm9sbGVyID0gQ29udHJvbGxlckZhY3RvcnkuYXBwbHkoZ3VpLCBmYWN0b3J5QXJncyk7XG4gIH1cbiAgaWYgKHBhcmFtcy5iZWZvcmUgaW5zdGFuY2VvZiBDb250cm9sbGVyKSB7XG4gICAgcGFyYW1zLmJlZm9yZSA9IHBhcmFtcy5iZWZvcmUuX19saTtcbiAgfVxuICByZWNhbGxTYXZlZFZhbHVlKGd1aSwgY29udHJvbGxlcik7XG4gIGRvbS5hZGRDbGFzcyhjb250cm9sbGVyLmRvbUVsZW1lbnQsICdjJyk7XG4gIHZhciBuYW1lID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBkb20uYWRkQ2xhc3MobmFtZSwgJ3Byb3BlcnR5LW5hbWUnKTtcbiAgbmFtZS5pbm5lckhUTUwgPSBjb250cm9sbGVyLnByb3BlcnR5O1xuICB2YXIgY29udGFpbmVyID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnRhaW5lci5hcHBlbmRDaGlsZChuYW1lKTtcbiAgY29udGFpbmVyLmFwcGVuZENoaWxkKGNvbnRyb2xsZXIuZG9tRWxlbWVudCk7XG4gIHZhciBsaSA9IGFkZFJvdyhndWksIGNvbnRhaW5lciwgcGFyYW1zLmJlZm9yZSk7XG4gIGRvbS5hZGRDbGFzcyhsaSwgR1VJLkNMQVNTX0NPTlRST0xMRVJfUk9XKTtcbiAgaWYgKGNvbnRyb2xsZXIgaW5zdGFuY2VvZiBDb2xvckNvbnRyb2xsZXIpIHtcbiAgICBkb20uYWRkQ2xhc3MobGksICdjb2xvcicpO1xuICB9IGVsc2Uge1xuICAgIGRvbS5hZGRDbGFzcyhsaSwgX3R5cGVvZihjb250cm9sbGVyLmdldFZhbHVlKCkpKTtcbiAgfVxuICBhdWdtZW50Q29udHJvbGxlcihndWksIGxpLCBjb250cm9sbGVyKTtcbiAgZ3VpLl9fY29udHJvbGxlcnMucHVzaChjb250cm9sbGVyKTtcbiAgcmV0dXJuIGNvbnRyb2xsZXI7XG59XG5mdW5jdGlvbiBnZXRMb2NhbFN0b3JhZ2VIYXNoKGd1aSwga2V5KSB7XG4gIHJldHVybiBkb2N1bWVudC5sb2NhdGlvbi5ocmVmICsgJy4nICsga2V5O1xufVxuZnVuY3Rpb24gYWRkUHJlc2V0T3B0aW9uKGd1aSwgbmFtZSwgc2V0U2VsZWN0ZWQpIHtcbiAgdmFyIG9wdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ29wdGlvbicpO1xuICBvcHQuaW5uZXJIVE1MID0gbmFtZTtcbiAgb3B0LnZhbHVlID0gbmFtZTtcbiAgZ3VpLl9fcHJlc2V0X3NlbGVjdC5hcHBlbmRDaGlsZChvcHQpO1xuICBpZiAoc2V0U2VsZWN0ZWQpIHtcbiAgICBndWkuX19wcmVzZXRfc2VsZWN0LnNlbGVjdGVkSW5kZXggPSBndWkuX19wcmVzZXRfc2VsZWN0Lmxlbmd0aCAtIDE7XG4gIH1cbn1cbmZ1bmN0aW9uIHNob3dIaWRlRXhwbGFpbihndWksIGV4cGxhaW4pIHtcbiAgZXhwbGFpbi5zdHlsZS5kaXNwbGF5ID0gZ3VpLnVzZUxvY2FsU3RvcmFnZSA/ICdibG9jaycgOiAnbm9uZSc7XG59XG5mdW5jdGlvbiBhZGRTYXZlTWVudShndWkpIHtcbiAgdmFyIGRpdiA9IGd1aS5fX3NhdmVfcm93ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnbGknKTtcbiAgZG9tLmFkZENsYXNzKGd1aS5kb21FbGVtZW50LCAnaGFzLXNhdmUnKTtcbiAgZ3VpLl9fdWwuaW5zZXJ0QmVmb3JlKGRpdiwgZ3VpLl9fdWwuZmlyc3RDaGlsZCk7XG4gIGRvbS5hZGRDbGFzcyhkaXYsICdzYXZlLXJvdycpO1xuICB2YXIgZ2VhcnMgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KCdzcGFuJyk7XG4gIGdlYXJzLmlubmVySFRNTCA9ICcmbmJzcDsnO1xuICBkb20uYWRkQ2xhc3MoZ2VhcnMsICdidXR0b24gZ2VhcnMnKTtcbiAgdmFyIGJ1dHRvbiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgYnV0dG9uLmlubmVySFRNTCA9ICdTYXZlJztcbiAgZG9tLmFkZENsYXNzKGJ1dHRvbiwgJ2J1dHRvbicpO1xuICBkb20uYWRkQ2xhc3MoYnV0dG9uLCAnc2F2ZScpO1xuICB2YXIgYnV0dG9uMiA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NwYW4nKTtcbiAgYnV0dG9uMi5pbm5lckhUTUwgPSAnTmV3JztcbiAgZG9tLmFkZENsYXNzKGJ1dHRvbjIsICdidXR0b24nKTtcbiAgZG9tLmFkZENsYXNzKGJ1dHRvbjIsICdzYXZlLWFzJyk7XG4gIHZhciBidXR0b24zID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnc3BhbicpO1xuICBidXR0b24zLmlubmVySFRNTCA9ICdSZXZlcnQnO1xuICBkb20uYWRkQ2xhc3MoYnV0dG9uMywgJ2J1dHRvbicpO1xuICBkb20uYWRkQ2xhc3MoYnV0dG9uMywgJ3JldmVydCcpO1xuICB2YXIgc2VsZWN0ID0gZ3VpLl9fcHJlc2V0X3NlbGVjdCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoJ3NlbGVjdCcpO1xuICBpZiAoZ3VpLmxvYWQgJiYgZ3VpLmxvYWQucmVtZW1iZXJlZCkge1xuICAgIENvbW1vbi5lYWNoKGd1aS5sb2FkLnJlbWVtYmVyZWQsIGZ1bmN0aW9uICh2YWx1ZSwga2V5KSB7XG4gICAgICBhZGRQcmVzZXRPcHRpb24oZ3VpLCBrZXksIGtleSA9PT0gZ3VpLnByZXNldCk7XG4gICAgfSk7XG4gIH0gZWxzZSB7XG4gICAgYWRkUHJlc2V0T3B0aW9uKGd1aSwgREVGQVVMVF9ERUZBVUxUX1BSRVNFVF9OQU1FLCBmYWxzZSk7XG4gIH1cbiAgZG9tLmJpbmQoc2VsZWN0LCAnY2hhbmdlJywgZnVuY3Rpb24gKCkge1xuICAgIGZvciAodmFyIGluZGV4ID0gMDsgaW5kZXggPCBndWkuX19wcmVzZXRfc2VsZWN0Lmxlbmd0aDsgaW5kZXgrKykge1xuICAgICAgZ3VpLl9fcHJlc2V0X3NlbGVjdFtpbmRleF0uaW5uZXJIVE1MID0gZ3VpLl9fcHJlc2V0X3NlbGVjdFtpbmRleF0udmFsdWU7XG4gICAgfVxuICAgIGd1aS5wcmVzZXQgPSB0aGlzLnZhbHVlO1xuICB9KTtcbiAgZGl2LmFwcGVuZENoaWxkKHNlbGVjdCk7XG4gIGRpdi5hcHBlbmRDaGlsZChnZWFycyk7XG4gIGRpdi5hcHBlbmRDaGlsZChidXR0b24pO1xuICBkaXYuYXBwZW5kQ2hpbGQoYnV0dG9uMik7XG4gIGRpdi5hcHBlbmRDaGlsZChidXR0b24zKTtcbiAgaWYgKFNVUFBPUlRTX0xPQ0FMX1NUT1JBR0UpIHtcbiAgICB2YXIgZXhwbGFpbiA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdkZy1sb2NhbC1leHBsYWluJyk7XG4gICAgdmFyIGxvY2FsU3RvcmFnZUNoZWNrQm94ID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RnLWxvY2FsLXN0b3JhZ2UnKTtcbiAgICB2YXIgc2F2ZUxvY2FsbHkgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnZGctc2F2ZS1sb2NhbGx5Jyk7XG4gICAgc2F2ZUxvY2FsbHkuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgaWYgKGxvY2FsU3RvcmFnZS5nZXRJdGVtKGdldExvY2FsU3RvcmFnZUhhc2goZ3VpLCAnaXNMb2NhbCcpKSA9PT0gJ3RydWUnKSB7XG4gICAgICBsb2NhbFN0b3JhZ2VDaGVja0JveC5zZXRBdHRyaWJ1dGUoJ2NoZWNrZWQnLCAnY2hlY2tlZCcpO1xuICAgIH1cbiAgICBzaG93SGlkZUV4cGxhaW4oZ3VpLCBleHBsYWluKTtcbiAgICBkb20uYmluZChsb2NhbFN0b3JhZ2VDaGVja0JveCwgJ2NoYW5nZScsIGZ1bmN0aW9uICgpIHtcbiAgICAgIGd1aS51c2VMb2NhbFN0b3JhZ2UgPSAhZ3VpLnVzZUxvY2FsU3RvcmFnZTtcbiAgICAgIHNob3dIaWRlRXhwbGFpbihndWksIGV4cGxhaW4pO1xuICAgIH0pO1xuICB9XG4gIHZhciBuZXdDb25zdHJ1Y3RvclRleHRBcmVhID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoJ2RnLW5ldy1jb25zdHJ1Y3RvcicpO1xuICBkb20uYmluZChuZXdDb25zdHJ1Y3RvclRleHRBcmVhLCAna2V5ZG93bicsIGZ1bmN0aW9uIChlKSB7XG4gICAgaWYgKGUubWV0YUtleSAmJiAoZS53aGljaCA9PT0gNjcgfHwgZS5rZXlDb2RlID09PSA2NykpIHtcbiAgICAgIFNBVkVfRElBTE9HVUUuaGlkZSgpO1xuICAgIH1cbiAgfSk7XG4gIGRvbS5iaW5kKGdlYXJzLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgbmV3Q29uc3RydWN0b3JUZXh0QXJlYS5pbm5lckhUTUwgPSBKU09OLnN0cmluZ2lmeShndWkuZ2V0U2F2ZU9iamVjdCgpLCB1bmRlZmluZWQsIDIpO1xuICAgIFNBVkVfRElBTE9HVUUuc2hvdygpO1xuICAgIG5ld0NvbnN0cnVjdG9yVGV4dEFyZWEuZm9jdXMoKTtcbiAgICBuZXdDb25zdHJ1Y3RvclRleHRBcmVhLnNlbGVjdCgpO1xuICB9KTtcbiAgZG9tLmJpbmQoYnV0dG9uLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgZ3VpLnNhdmUoKTtcbiAgfSk7XG4gIGRvbS5iaW5kKGJ1dHRvbjIsICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICB2YXIgcHJlc2V0TmFtZSA9IHByb21wdCgnRW50ZXIgYSBuZXcgcHJlc2V0IG5hbWUuJyk7XG4gICAgaWYgKHByZXNldE5hbWUpIHtcbiAgICAgIGd1aS5zYXZlQXMocHJlc2V0TmFtZSk7XG4gICAgfVxuICB9KTtcbiAgZG9tLmJpbmQoYnV0dG9uMywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgIGd1aS5yZXZlcnQoKTtcbiAgfSk7XG59XG5mdW5jdGlvbiBhZGRSZXNpemVIYW5kbGUoZ3VpKSB7XG4gIHZhciBwbW91c2VYID0gdm9pZCAwO1xuICBndWkuX19yZXNpemVfaGFuZGxlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIENvbW1vbi5leHRlbmQoZ3VpLl9fcmVzaXplX2hhbmRsZS5zdHlsZSwge1xuICAgIHdpZHRoOiAnNnB4JyxcbiAgICBtYXJnaW5MZWZ0OiAnLTNweCcsXG4gICAgaGVpZ2h0OiAnMjAwcHgnLFxuICAgIGN1cnNvcjogJ2V3LXJlc2l6ZScsXG4gICAgcG9zaXRpb246ICdhYnNvbHV0ZSdcbiAgfSk7XG4gIGZ1bmN0aW9uIGRyYWcoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBndWkud2lkdGggKz0gcG1vdXNlWCAtIGUuY2xpZW50WDtcbiAgICBndWkub25SZXNpemUoKTtcbiAgICBwbW91c2VYID0gZS5jbGllbnRYO1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICBmdW5jdGlvbiBkcmFnU3RvcCgpIHtcbiAgICBkb20ucmVtb3ZlQ2xhc3MoZ3VpLl9fY2xvc2VCdXR0b24sIEdVSS5DTEFTU19EUkFHKTtcbiAgICBkb20udW5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIGRvbS51bmJpbmQod2luZG93LCAnbW91c2V1cCcsIGRyYWdTdG9wKTtcbiAgfVxuICBmdW5jdGlvbiBkcmFnU3RhcnQoZSkge1xuICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICBwbW91c2VYID0gZS5jbGllbnRYO1xuICAgIGRvbS5hZGRDbGFzcyhndWkuX19jbG9zZUJ1dHRvbiwgR1VJLkNMQVNTX0RSQUcpO1xuICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNlbW92ZScsIGRyYWcpO1xuICAgIGRvbS5iaW5kKHdpbmRvdywgJ21vdXNldXAnLCBkcmFnU3RvcCk7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIGRvbS5iaW5kKGd1aS5fX3Jlc2l6ZV9oYW5kbGUsICdtb3VzZWRvd24nLCBkcmFnU3RhcnQpO1xuICBkb20uYmluZChndWkuX19jbG9zZUJ1dHRvbiwgJ21vdXNlZG93bicsIGRyYWdTdGFydCk7XG4gIGd1aS5kb21FbGVtZW50Lmluc2VydEJlZm9yZShndWkuX19yZXNpemVfaGFuZGxlLCBndWkuZG9tRWxlbWVudC5maXJzdEVsZW1lbnRDaGlsZCk7XG59XG5mdW5jdGlvbiBzZXRXaWR0aChndWksIHcpIHtcbiAgZ3VpLmRvbUVsZW1lbnQuc3R5bGUud2lkdGggPSB3ICsgJ3B4JztcbiAgaWYgKGd1aS5fX3NhdmVfcm93ICYmIGd1aS5hdXRvUGxhY2UpIHtcbiAgICBndWkuX19zYXZlX3Jvdy5zdHlsZS53aWR0aCA9IHcgKyAncHgnO1xuICB9XG4gIGlmIChndWkuX19jbG9zZUJ1dHRvbikge1xuICAgIGd1aS5fX2Nsb3NlQnV0dG9uLnN0eWxlLndpZHRoID0gdyArICdweCc7XG4gIH1cbn1cbmZ1bmN0aW9uIGdldEN1cnJlbnRQcmVzZXQoZ3VpLCB1c2VJbml0aWFsVmFsdWVzKSB7XG4gIHZhciB0b1JldHVybiA9IHt9O1xuICBDb21tb24uZWFjaChndWkuX19yZW1lbWJlcmVkT2JqZWN0cywgZnVuY3Rpb24gKHZhbCwgaW5kZXgpIHtcbiAgICB2YXIgc2F2ZWRWYWx1ZXMgPSB7fTtcbiAgICB2YXIgY29udHJvbGxlck1hcCA9IGd1aS5fX3JlbWVtYmVyZWRPYmplY3RJbmRlY2VzVG9Db250cm9sbGVyc1tpbmRleF07XG4gICAgQ29tbW9uLmVhY2goY29udHJvbGxlck1hcCwgZnVuY3Rpb24gKGNvbnRyb2xsZXIsIHByb3BlcnR5KSB7XG4gICAgICBzYXZlZFZhbHVlc1twcm9wZXJ0eV0gPSB1c2VJbml0aWFsVmFsdWVzID8gY29udHJvbGxlci5pbml0aWFsVmFsdWUgOiBjb250cm9sbGVyLmdldFZhbHVlKCk7XG4gICAgfSk7XG4gICAgdG9SZXR1cm5baW5kZXhdID0gc2F2ZWRWYWx1ZXM7XG4gIH0pO1xuICByZXR1cm4gdG9SZXR1cm47XG59XG5mdW5jdGlvbiBzZXRQcmVzZXRTZWxlY3RJbmRleChndWkpIHtcbiAgZm9yICh2YXIgaW5kZXggPSAwOyBpbmRleCA8IGd1aS5fX3ByZXNldF9zZWxlY3QubGVuZ3RoOyBpbmRleCsrKSB7XG4gICAgaWYgKGd1aS5fX3ByZXNldF9zZWxlY3RbaW5kZXhdLnZhbHVlID09PSBndWkucHJlc2V0KSB7XG4gICAgICBndWkuX19wcmVzZXRfc2VsZWN0LnNlbGVjdGVkSW5kZXggPSBpbmRleDtcbiAgICB9XG4gIH1cbn1cbmZ1bmN0aW9uIHVwZGF0ZURpc3BsYXlzKGNvbnRyb2xsZXJBcnJheSkge1xuICBpZiAoY29udHJvbGxlckFycmF5Lmxlbmd0aCAhPT0gMCkge1xuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZSQxLmNhbGwod2luZG93LCBmdW5jdGlvbiAoKSB7XG4gICAgICB1cGRhdGVEaXNwbGF5cyhjb250cm9sbGVyQXJyYXkpO1xuICAgIH0pO1xuICB9XG4gIENvbW1vbi5lYWNoKGNvbnRyb2xsZXJBcnJheSwgZnVuY3Rpb24gKGMpIHtcbiAgICBjLnVwZGF0ZURpc3BsYXkoKTtcbiAgfSk7XG59XG5cbnZhciBjb2xvciA9IHtcbiAgQ29sb3I6IENvbG9yLFxuICBtYXRoOiBDb2xvck1hdGgsXG4gIGludGVycHJldDogaW50ZXJwcmV0XG59O1xudmFyIGNvbnRyb2xsZXJzID0ge1xuICBDb250cm9sbGVyOiBDb250cm9sbGVyLFxuICBCb29sZWFuQ29udHJvbGxlcjogQm9vbGVhbkNvbnRyb2xsZXIsXG4gIE9wdGlvbkNvbnRyb2xsZXI6IE9wdGlvbkNvbnRyb2xsZXIsXG4gIFN0cmluZ0NvbnRyb2xsZXI6IFN0cmluZ0NvbnRyb2xsZXIsXG4gIE51bWJlckNvbnRyb2xsZXI6IE51bWJlckNvbnRyb2xsZXIsXG4gIE51bWJlckNvbnRyb2xsZXJCb3g6IE51bWJlckNvbnRyb2xsZXJCb3gsXG4gIE51bWJlckNvbnRyb2xsZXJTbGlkZXI6IE51bWJlckNvbnRyb2xsZXJTbGlkZXIsXG4gIEZ1bmN0aW9uQ29udHJvbGxlcjogRnVuY3Rpb25Db250cm9sbGVyLFxuICBDb2xvckNvbnRyb2xsZXI6IENvbG9yQ29udHJvbGxlclxufTtcbnZhciBkb20kMSA9IHsgZG9tOiBkb20gfTtcbnZhciBndWkgPSB7IEdVSTogR1VJIH07XG52YXIgR1VJJDEgPSBHVUk7XG52YXIgaW5kZXggPSB7XG4gIGNvbG9yOiBjb2xvcixcbiAgY29udHJvbGxlcnM6IGNvbnRyb2xsZXJzLFxuICBkb206IGRvbSQxLFxuICBndWk6IGd1aSxcbiAgR1VJOiBHVUkkMVxufTtcblxuZXhwb3J0cy5jb2xvciA9IGNvbG9yO1xuZXhwb3J0cy5jb250cm9sbGVycyA9IGNvbnRyb2xsZXJzO1xuZXhwb3J0cy5kb20gPSBkb20kMTtcbmV4cG9ydHMuZ3VpID0gZ3VpO1xuZXhwb3J0cy5HVUkgPSBHVUkkMTtcbmV4cG9ydHNbJ2RlZmF1bHQnXSA9IGluZGV4O1xuXG5PYmplY3QuZGVmaW5lUHJvcGVydHkoZXhwb3J0cywgJ19fZXNNb2R1bGUnLCB7IHZhbHVlOiB0cnVlIH0pO1xuXG59KSkpO1xuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0Lmd1aS5qcy5tYXBcbiIsIi8qIGludGVyYWN0LmpzIDEuOS44IHwgaHR0cHM6Ly9yYXcuZ2l0aHViLmNvbS90YXllL2ludGVyYWN0LmpzL21hc3Rlci9MSUNFTlNFICovXG4hZnVuY3Rpb24odCl7aWYoXCJvYmplY3RcIj09dHlwZW9mIGV4cG9ydHMmJlwidW5kZWZpbmVkXCIhPXR5cGVvZiBtb2R1bGUpbW9kdWxlLmV4cG9ydHM9dCgpO2Vsc2UgaWYoXCJmdW5jdGlvblwiPT10eXBlb2YgZGVmaW5lJiZkZWZpbmUuYW1kKWRlZmluZShbXSx0KTtlbHNleyhcInVuZGVmaW5lZFwiIT10eXBlb2Ygd2luZG93P3dpbmRvdzpcInVuZGVmaW5lZFwiIT10eXBlb2YgZ2xvYmFsP2dsb2JhbDpcInVuZGVmaW5lZFwiIT10eXBlb2Ygc2VsZj9zZWxmOnRoaXMpLmludGVyYWN0PXQoKX19KGZ1bmN0aW9uKCl7ZnVuY3Rpb24gdChlKXt2YXIgbjtyZXR1cm4gZnVuY3Rpb24odCl7cmV0dXJuIG58fGUobj17ZXhwb3J0czp7fSxwYXJlbnQ6dH0sbi5leHBvcnRzKSxuLmV4cG9ydHN9fXZhciBrPXQoZnVuY3Rpb24odCxlKXtcInVzZSBzdHJpY3RcIjtmdW5jdGlvbiBhKHQpe3JldHVybihhPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxlLmRlZmF1bHQ9ZS5JbnRlcmFjdGFibGU9dm9pZCAwO3ZhciB1PXIoUyksbD1uKEMpLHM9bihWKSxjPW4oY3QpLGY9cih3KSxwPW4oZnQpLGk9bihidCksZD1tKHt9KTtmdW5jdGlvbiBuKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiB2KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gdj1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIHIodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09YSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT12KCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfXJldHVybiBuLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pLG59ZnVuY3Rpb24gbyh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24geSh0LGUsbil7cmV0dXJuIGUmJm8odC5wcm90b3R5cGUsZSksbiYmbyh0LG4pLHR9ZnVuY3Rpb24gaCh0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9dmFyIGc9ZnVuY3Rpb24oKXtmdW5jdGlvbiBvKHQsZSxuLHIpeyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsbyksdGhpcy5fc2NvcGVFdmVudHM9cixoKHRoaXMsXCJvcHRpb25zXCIsdm9pZCAwKSxoKHRoaXMsXCJfYWN0aW9uc1wiLHZvaWQgMCksaCh0aGlzLFwidGFyZ2V0XCIsdm9pZCAwKSxoKHRoaXMsXCJldmVudHNcIixuZXcgaS5kZWZhdWx0KSxoKHRoaXMsXCJfY29udGV4dFwiLHZvaWQgMCksaCh0aGlzLFwiX3dpblwiLHZvaWQgMCksaCh0aGlzLFwiX2RvY1wiLHZvaWQgMCksdGhpcy5fYWN0aW9ucz1lLmFjdGlvbnMsdGhpcy50YXJnZXQ9dCx0aGlzLl9jb250ZXh0PWUuY29udGV4dHx8bix0aGlzLl93aW49KDAsTy5nZXRXaW5kb3cpKCgwLCQudHJ5U2VsZWN0b3IpKHQpP3RoaXMuX2NvbnRleHQ6dCksdGhpcy5fZG9jPXRoaXMuX3dpbi5kb2N1bWVudCx0aGlzLnNldChlKX1yZXR1cm4geShvLFt7a2V5OlwiX2RlZmF1bHRzXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJue2Jhc2U6e30scGVyQWN0aW9uOnt9LGFjdGlvbnM6e319fX1dKSx5KG8sW3trZXk6XCJzZXRPbkV2ZW50c1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7cmV0dXJuIGYuZnVuYyhlLm9uc3RhcnQpJiZ0aGlzLm9uKFwiXCIuY29uY2F0KHQsXCJzdGFydFwiKSxlLm9uc3RhcnQpLGYuZnVuYyhlLm9ubW92ZSkmJnRoaXMub24oXCJcIi5jb25jYXQodCxcIm1vdmVcIiksZS5vbm1vdmUpLGYuZnVuYyhlLm9uZW5kKSYmdGhpcy5vbihcIlwiLmNvbmNhdCh0LFwiZW5kXCIpLGUub25lbmQpLGYuZnVuYyhlLm9uaW5lcnRpYXN0YXJ0KSYmdGhpcy5vbihcIlwiLmNvbmNhdCh0LFwiaW5lcnRpYXN0YXJ0XCIpLGUub25pbmVydGlhc3RhcnQpLHRoaXN9fSx7a2V5OlwidXBkYXRlUGVyQWN0aW9uTGlzdGVuZXJzXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4peyhmLmFycmF5KGUpfHxmLm9iamVjdChlKSkmJnRoaXMub2ZmKHQsZSksKGYuYXJyYXkobil8fGYub2JqZWN0KG4pKSYmdGhpcy5vbih0LG4pfX0se2tleTpcInNldFBlckFjdGlvblwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dmFyIG49dGhpcy5fZGVmYXVsdHM7Zm9yKHZhciByIGluIGUpe3ZhciBvPXIsaT10aGlzLm9wdGlvbnNbdF0sYT1lW29dO1wibGlzdGVuZXJzXCI9PT1vJiZ0aGlzLnVwZGF0ZVBlckFjdGlvbkxpc3RlbmVycyh0LGkubGlzdGVuZXJzLGEpLGYuYXJyYXkoYSk/aVtvXT11LmZyb20oYSk6Zi5wbGFpbk9iamVjdChhKT8oaVtvXT0oMCxjLmRlZmF1bHQpKGlbb118fHt9LCgwLHMuZGVmYXVsdCkoYSkpLGYub2JqZWN0KG4ucGVyQWN0aW9uW29dKSYmXCJlbmFibGVkXCJpbiBuLnBlckFjdGlvbltvXSYmKGlbb10uZW5hYmxlZD0hMSE9PWEuZW5hYmxlZCkpOmYuYm9vbChhKSYmZi5vYmplY3Qobi5wZXJBY3Rpb25bb10pP2lbb10uZW5hYmxlZD1hOmlbb109YX19fSx7a2V5OlwiZ2V0UmVjdFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0PXR8fChmLmVsZW1lbnQodGhpcy50YXJnZXQpP3RoaXMudGFyZ2V0Om51bGwpLGYuc3RyaW5nKHRoaXMudGFyZ2V0KSYmKHQ9dHx8dGhpcy5fY29udGV4dC5xdWVyeVNlbGVjdG9yKHRoaXMudGFyZ2V0KSksKDAsJC5nZXRFbGVtZW50UmVjdCkodCl9fSx7a2V5OlwicmVjdENoZWNrZXJcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gZi5mdW5jKHQpPyh0aGlzLmdldFJlY3Q9dCx0aGlzKTpudWxsPT09dD8oZGVsZXRlIHRoaXMuZ2V0UmVjdCx0aGlzKTp0aGlzLmdldFJlY3R9fSx7a2V5OlwiX2JhY2tDb21wYXRPcHRpb25cIix2YWx1ZTpmdW5jdGlvbih0LGUpe2lmKCgwLCQudHJ5U2VsZWN0b3IpKGUpfHxmLm9iamVjdChlKSl7Zm9yKHZhciBuIGluIHRoaXMub3B0aW9uc1t0XT1lLHRoaXMuX2FjdGlvbnMubWFwKXRoaXMub3B0aW9uc1tuXVt0XT1lO3JldHVybiB0aGlzfXJldHVybiB0aGlzLm9wdGlvbnNbdF19fSx7a2V5Olwib3JpZ2luXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2JhY2tDb21wYXRPcHRpb24oXCJvcmlnaW5cIix0KX19LHtrZXk6XCJkZWx0YVNvdXJjZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVyblwicGFnZVwiPT09dHx8XCJjbGllbnRcIj09PXQ/KHRoaXMub3B0aW9ucy5kZWx0YVNvdXJjZT10LHRoaXMpOnRoaXMub3B0aW9ucy5kZWx0YVNvdXJjZX19LHtrZXk6XCJjb250ZXh0XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5fY29udGV4dH19LHtrZXk6XCJpbkNvbnRleHRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fY29udGV4dD09PXQub3duZXJEb2N1bWVudHx8KDAsJC5ub2RlQ29udGFpbnMpKHRoaXMuX2NvbnRleHQsdCl9fSx7a2V5OlwidGVzdElnbm9yZUFsbG93XCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3JldHVybiF0aGlzLnRlc3RJZ25vcmUodC5pZ25vcmVGcm9tLGUsbikmJnRoaXMudGVzdEFsbG93KHQuYWxsb3dGcm9tLGUsbil9fSx7a2V5OlwidGVzdEFsbG93XCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3JldHVybiF0fHwhIWYuZWxlbWVudChuKSYmKGYuc3RyaW5nKHQpPygwLCQubWF0Y2hlc1VwVG8pKG4sdCxlKTohIWYuZWxlbWVudCh0KSYmKDAsJC5ub2RlQ29udGFpbnMpKHQsbikpfX0se2tleTpcInRlc3RJZ25vcmVcIix2YWx1ZTpmdW5jdGlvbih0LGUsbil7cmV0dXJuISghdHx8IWYuZWxlbWVudChuKSkmJihmLnN0cmluZyh0KT8oMCwkLm1hdGNoZXNVcFRvKShuLHQsZSk6ISFmLmVsZW1lbnQodCkmJigwLCQubm9kZUNvbnRhaW5zKSh0LG4pKX19LHtrZXk6XCJmaXJlXCIsdmFsdWU6ZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuZXZlbnRzLmZpcmUodCksdGhpc319LHtrZXk6XCJfb25PZmZcIix2YWx1ZTpmdW5jdGlvbih0LGUsbixyKXtmLm9iamVjdChlKSYmIWYuYXJyYXkoZSkmJihyPW4sbj1udWxsKTt2YXIgbz1cIm9uXCI9PT10P1wiYWRkXCI6XCJyZW1vdmVcIixpPSgwLHAuZGVmYXVsdCkoZSxuKTtmb3IodmFyIGEgaW4gaSl7XCJ3aGVlbFwiPT09YSYmKGE9bC5kZWZhdWx0LndoZWVsRXZlbnQpO2Zvcih2YXIgdT0wO3U8aVthXS5sZW5ndGg7dSsrKXt2YXIgcz1pW2FdW3VdOygwLGQuaXNOb25OYXRpdmVFdmVudCkoYSx0aGlzLl9hY3Rpb25zKT90aGlzLmV2ZW50c1t0XShhLHMpOmYuc3RyaW5nKHRoaXMudGFyZ2V0KT90aGlzLl9zY29wZUV2ZW50c1tcIlwiLmNvbmNhdChvLFwiRGVsZWdhdGVcIildKHRoaXMudGFyZ2V0LHRoaXMuX2NvbnRleHQsYSxzLHIpOnRoaXMuX3Njb3BlRXZlbnRzW29dKHRoaXMudGFyZ2V0LGEscyxyKX19cmV0dXJuIHRoaXN9fSx7a2V5Olwib25cIix2YWx1ZTpmdW5jdGlvbih0LGUsbil7cmV0dXJuIHRoaXMuX29uT2ZmKFwib25cIix0LGUsbil9fSx7a2V5Olwib2ZmXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3JldHVybiB0aGlzLl9vbk9mZihcIm9mZlwiLHQsZSxuKX19LHtrZXk6XCJzZXRcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLl9kZWZhdWx0cztmb3IodmFyIG4gaW4gZi5vYmplY3QodCl8fCh0PXt9KSx0aGlzLm9wdGlvbnM9KDAscy5kZWZhdWx0KShlLmJhc2UpLHRoaXMuX2FjdGlvbnMubWV0aG9kRGljdCl7dmFyIHI9bixvPXRoaXMuX2FjdGlvbnMubWV0aG9kRGljdFtyXTt0aGlzLm9wdGlvbnNbcl09e30sdGhpcy5zZXRQZXJBY3Rpb24ociwoMCxjLmRlZmF1bHQpKCgwLGMuZGVmYXVsdCkoe30sZS5wZXJBY3Rpb24pLGUuYWN0aW9uc1tyXSkpLHRoaXNbb10odFtyXSl9Zm9yKHZhciBpIGluIHQpZi5mdW5jKHRoaXNbaV0pJiZ0aGlzW2ldKHRbaV0pO3JldHVybiB0aGlzfX0se2tleTpcInVuc2V0XCIsdmFsdWU6ZnVuY3Rpb24oKXtpZihmLnN0cmluZyh0aGlzLnRhcmdldCkpZm9yKHZhciB0IGluIHRoaXMuX3Njb3BlRXZlbnRzLmRlbGVnYXRlZEV2ZW50cylmb3IodmFyIGU9dGhpcy5fc2NvcGVFdmVudHMuZGVsZWdhdGVkRXZlbnRzW3RdLG49ZS5sZW5ndGgtMTswPD1uO24tLSl7dmFyIHI9ZVtuXSxvPXIuc2VsZWN0b3IsaT1yLmNvbnRleHQsYT1yLmxpc3RlbmVycztvPT09dGhpcy50YXJnZXQmJmk9PT10aGlzLl9jb250ZXh0JiZlLnNwbGljZShuLDEpO2Zvcih2YXIgdT1hLmxlbmd0aC0xOzA8PXU7dS0tKXRoaXMuX3Njb3BlRXZlbnRzLnJlbW92ZURlbGVnYXRlKHRoaXMudGFyZ2V0LHRoaXMuX2NvbnRleHQsdCxhW3VdWzBdLGFbdV1bMV0pfWVsc2UgdGhpcy5fc2NvcGVFdmVudHMucmVtb3ZlKHRoaXMudGFyZ2V0LFwiYWxsXCIpfX1dKSxvfSgpLGI9ZS5JbnRlcmFjdGFibGU9ZztlLmRlZmF1bHQ9Yn0pLG09dChmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuaXNOb25OYXRpdmVFdmVudD1mdW5jdGlvbih0LGUpe2lmKGUucGhhc2VsZXNzVHlwZXNbdF0pcmV0dXJuITA7Zm9yKHZhciBuIGluIGUubWFwKWlmKDA9PT10LmluZGV4T2YobikmJnQuc3Vic3RyKG4ubGVuZ3RoKWluIGUucGhhc2VzKXJldHVybiEwO3JldHVybiExfSxlLmluaXRTY29wZT1NLGUuU2NvcGU9ZS5kZWZhdWx0PXZvaWQgMDt2YXIgbj1kKEQpLHI9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09dih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1wKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KGxlKSxvPWQoYnQpLGk9ZChXZSksYT1kKFQoe30pKSx1PWQoayh7fSkpLHM9ZChaZSksbD1kKHplKSxjPWQoY24pLGY9ZChFKHt9KSk7ZnVuY3Rpb24gcCgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIHA9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBkKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiB2KHQpe3JldHVybih2PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1mdW5jdGlvbiB5KHQsZSl7cmV0dXJuIWV8fFwib2JqZWN0XCIhPT12KGUpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP2Z1bmN0aW9uKHQpe2lmKHZvaWQgMCE9PXQpcmV0dXJuIHQ7dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpfSh0KTplfWZ1bmN0aW9uIGgodCxlLG4pe3JldHVybihoPVwidW5kZWZpbmVkXCIhPXR5cGVvZiBSZWZsZWN0JiZSZWZsZWN0LmdldD9SZWZsZWN0LmdldDpmdW5jdGlvbih0LGUsbil7dmFyIHI9ZnVuY3Rpb24odCxlKXtmb3IoOyFPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxlKSYmbnVsbCE9PSh0PWcodCkpOyk7cmV0dXJuIHR9KHQsZSk7aWYocil7dmFyIG89T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihyLGUpO3JldHVybiBvLmdldD9vLmdldC5jYWxsKG4pOm8udmFsdWV9fSkodCxlLG58fHQpfWZ1bmN0aW9uIGcodCl7cmV0dXJuKGc9T2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5nZXRQcm90b3R5cGVPZjpmdW5jdGlvbih0KXtyZXR1cm4gdC5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZih0KX0pKHQpfWZ1bmN0aW9uIGIodCxlKXtyZXR1cm4oYj1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuX19wcm90b19fPWUsdH0pKHQsZSl9ZnVuY3Rpb24gbSh0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9ZnVuY3Rpb24gTyh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gdyh0LGUsbil7cmV0dXJuIGUmJk8odC5wcm90b3R5cGUsZSksbiYmTyh0LG4pLHR9ZnVuY3Rpb24gXyh0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9dmFyIFA9ci53aW4seD1yLmJyb3dzZXIsUz1yLnJhZixqPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gdCgpe3ZhciBlPXRoaXM7bSh0aGlzLHQpLF8odGhpcyxcImlkXCIsXCJfX2ludGVyYWN0X3Njb3BlX1wiLmNvbmNhdChNYXRoLmZsb29yKDEwMCpNYXRoLnJhbmRvbSgpKSkpLF8odGhpcyxcImlzSW5pdGlhbGl6ZWRcIiwhMSksXyh0aGlzLFwibGlzdGVuZXJNYXBzXCIsW10pLF8odGhpcyxcImJyb3dzZXJcIix4KSxfKHRoaXMsXCJ1dGlsc1wiLHIpLF8odGhpcyxcImRlZmF1bHRzXCIsci5jbG9uZShsLmRlZmF1bHQpKSxfKHRoaXMsXCJFdmVudGFibGVcIixvLmRlZmF1bHQpLF8odGhpcyxcImFjdGlvbnNcIix7bWFwOnt9LHBoYXNlczp7c3RhcnQ6ITAsbW92ZTohMCxlbmQ6ITB9LG1ldGhvZERpY3Q6e30scGhhc2VsZXNzVHlwZXM6e319KSxfKHRoaXMsXCJpbnRlcmFjdFN0YXRpY1wiLG5ldyBhLmRlZmF1bHQodGhpcykpLF8odGhpcyxcIkludGVyYWN0RXZlbnRcIixpLmRlZmF1bHQpLF8odGhpcyxcIkludGVyYWN0YWJsZVwiLHZvaWQgMCksXyh0aGlzLFwiaW50ZXJhY3RhYmxlc1wiLG5ldyBzLmRlZmF1bHQodGhpcykpLF8odGhpcyxcIl93aW5cIix2b2lkIDApLF8odGhpcyxcImRvY3VtZW50XCIsdm9pZCAwKSxfKHRoaXMsXCJ3aW5kb3dcIix2b2lkIDApLF8odGhpcyxcImRvY3VtZW50c1wiLFtdKSxfKHRoaXMsXCJfcGx1Z2luc1wiLHtsaXN0OltdLG1hcDp7fX0pLF8odGhpcyxcIm9uV2luZG93VW5sb2FkXCIsZnVuY3Rpb24odCl7cmV0dXJuIGUucmVtb3ZlRG9jdW1lbnQodC50YXJnZXQpfSk7dmFyIG49dGhpczt0aGlzLkludGVyYWN0YWJsZT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUoKXtyZXR1cm4gbSh0aGlzLGUpLHkodGhpcyxnKGUpLmFwcGx5KHRoaXMsYXJndW1lbnRzKSl9cmV0dXJuIGZ1bmN0aW9uKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiZiKHQsZSl9KGUsdVtcImRlZmF1bHRcIl0pLHcoZSxbe2tleTpcInNldFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiBoKGcoZS5wcm90b3R5cGUpLFwic2V0XCIsdGhpcykuY2FsbCh0aGlzLHQpLG4uZmlyZShcImludGVyYWN0YWJsZTpzZXRcIix7b3B0aW9uczp0LGludGVyYWN0YWJsZTp0aGlzfSksdGhpc319LHtrZXk6XCJ1bnNldFwiLHZhbHVlOmZ1bmN0aW9uKCl7aChnKGUucHJvdG90eXBlKSxcInVuc2V0XCIsdGhpcykuY2FsbCh0aGlzKSxuLmludGVyYWN0YWJsZXMubGlzdC5zcGxpY2Uobi5pbnRlcmFjdGFibGVzLmxpc3QuaW5kZXhPZih0aGlzKSwxKSxuLmZpcmUoXCJpbnRlcmFjdGFibGU6dW5zZXRcIix7aW50ZXJhY3RhYmxlOnRoaXN9KX19LHtrZXk6XCJfZGVmYXVsdHNcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gbi5kZWZhdWx0c319XSksZX0oKX1yZXR1cm4gdyh0LFt7a2V5OlwiYWRkTGlzdGVuZXJzXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt0aGlzLmxpc3RlbmVyTWFwcy5wdXNoKHtpZDplLG1hcDp0fSl9fSx7a2V5OlwiZmlyZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBuPTA7bjx0aGlzLmxpc3RlbmVyTWFwcy5sZW5ndGg7bisrKXt2YXIgcj10aGlzLmxpc3RlbmVyTWFwc1tuXS5tYXBbdF07aWYociYmITE9PT1yKGUsdGhpcyx0KSlyZXR1cm4hMX19fSx7a2V5OlwiaW5pdFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB0aGlzLmlzSW5pdGlhbGl6ZWQ/dGhpczpNKHRoaXMsdCl9fSx7a2V5OlwicGx1Z2luSXNJbnN0YWxsZWRcIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fcGx1Z2lucy5tYXBbdC5pZF18fC0xIT09dGhpcy5fcGx1Z2lucy5saXN0LmluZGV4T2YodCl9fSx7a2V5OlwidXNlUGx1Z2luXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtpZih0aGlzLnBsdWdpbklzSW5zdGFsbGVkKHQpKXJldHVybiB0aGlzO2lmKHQuaWQmJih0aGlzLl9wbHVnaW5zLm1hcFt0LmlkXT10KSx0aGlzLl9wbHVnaW5zLmxpc3QucHVzaCh0KSx0Lmluc3RhbGwmJnQuaW5zdGFsbCh0aGlzLGUpLHQubGlzdGVuZXJzJiZ0LmJlZm9yZSl7Zm9yKHZhciBuPTAscj10aGlzLmxpc3RlbmVyTWFwcy5sZW5ndGgsbz10LmJlZm9yZS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFtlXT0hMCx0fSx7fSk7bjxyO24rKyl7aWYob1t0aGlzLmxpc3RlbmVyTWFwc1tuXS5pZF0pYnJlYWt9dGhpcy5saXN0ZW5lck1hcHMuc3BsaWNlKG4sMCx7aWQ6dC5pZCxtYXA6dC5saXN0ZW5lcnN9KX1lbHNlIHQubGlzdGVuZXJzJiZ0aGlzLmxpc3RlbmVyTWFwcy5wdXNoKHtpZDp0LmlkLG1hcDp0Lmxpc3RlbmVyc30pO3JldHVybiB0aGlzfX0se2tleTpcImFkZERvY3VtZW50XCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtpZigtMSE9PXRoaXMuZ2V0RG9jSW5kZXgodCkpcmV0dXJuITE7dmFyIG49UC5nZXRXaW5kb3codCk7ZT1lP3IuZXh0ZW5kKHt9LGUpOnt9LHRoaXMuZG9jdW1lbnRzLnB1c2goe2RvYzp0LG9wdGlvbnM6ZX0pLHRoaXMuZXZlbnRzLmRvY3VtZW50cy5wdXNoKHQpLHQhPT10aGlzLmRvY3VtZW50JiZ0aGlzLmV2ZW50cy5hZGQobixcInVubG9hZFwiLHRoaXMub25XaW5kb3dVbmxvYWQpLHRoaXMuZmlyZShcInNjb3BlOmFkZC1kb2N1bWVudFwiLHtkb2M6dCx3aW5kb3c6bixzY29wZTp0aGlzLG9wdGlvbnM6ZX0pfX0se2tleTpcInJlbW92ZURvY3VtZW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5nZXREb2NJbmRleCh0KSxuPVAuZ2V0V2luZG93KHQpLHI9dGhpcy5kb2N1bWVudHNbZV0ub3B0aW9uczt0aGlzLmV2ZW50cy5yZW1vdmUobixcInVubG9hZFwiLHRoaXMub25XaW5kb3dVbmxvYWQpLHRoaXMuZG9jdW1lbnRzLnNwbGljZShlLDEpLHRoaXMuZXZlbnRzLmRvY3VtZW50cy5zcGxpY2UoZSwxKSx0aGlzLmZpcmUoXCJzY29wZTpyZW1vdmUtZG9jdW1lbnRcIix7ZG9jOnQsd2luZG93Om4sc2NvcGU6dGhpcyxvcHRpb25zOnJ9KX19LHtrZXk6XCJnZXREb2NJbmRleFwiLHZhbHVlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0wO2U8dGhpcy5kb2N1bWVudHMubGVuZ3RoO2UrKylpZih0aGlzLmRvY3VtZW50c1tlXS5kb2M9PT10KXJldHVybiBlO3JldHVybi0xfX0se2tleTpcImdldERvY09wdGlvbnNcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLmdldERvY0luZGV4KHQpO3JldHVybi0xPT09ZT9udWxsOnRoaXMuZG9jdW1lbnRzW2VdLm9wdGlvbnN9fSx7a2V5Olwibm93XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4odGhpcy53aW5kb3cuRGF0ZXx8RGF0ZSkubm93KCl9fV0pLHR9KCk7ZnVuY3Rpb24gTSh0LGUpe3JldHVybiB0LmlzSW5pdGlhbGl6ZWQ9ITAsUC5pbml0KGUpLG4uZGVmYXVsdC5pbml0KGUpLHguaW5pdChlKSxTLmluaXQoZSksdC53aW5kb3c9ZSx0LmRvY3VtZW50PWUuZG9jdW1lbnQsdC51c2VQbHVnaW4oZi5kZWZhdWx0KSx0LnVzZVBsdWdpbihjLmRlZmF1bHQpLHR9ZS5TY29wZT1lLmRlZmF1bHQ9an0pLEU9dChmdW5jdGlvbih0LGUpe1widXNlIHN0cmljdFwiO09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuZGVmYXVsdD12b2lkIDA7dmFyIF89bihDKSx1PW4oRCksUD1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1jKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPWEoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oenQpLHM9bihFbiksbD1uKFVuKSxvPW4odHIpO24obSh7fSkpO2Z1bmN0aW9uIGEoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBhPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gbih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gYyh0KXtyZXR1cm4oYz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9ZnVuY3Rpb24geCh0LGUpe3JldHVybiBmdW5jdGlvbih0KXtpZihBcnJheS5pc0FycmF5KHQpKXJldHVybiB0fSh0KXx8ZnVuY3Rpb24odCxlKXtpZighKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodCl8fFwiW29iamVjdCBBcmd1bWVudHNdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkpKXJldHVybjt2YXIgbj1bXSxyPSEwLG89ITEsaT12b2lkIDA7dHJ5e2Zvcih2YXIgYSx1PXRbU3ltYm9sLml0ZXJhdG9yXSgpOyEocj0oYT11Lm5leHQoKSkuZG9uZSkmJihuLnB1c2goYS52YWx1ZSksIWV8fG4ubGVuZ3RoIT09ZSk7cj0hMCk7fWNhdGNoKHQpe289ITAsaT10fWZpbmFsbHl7dHJ5e3J8fG51bGw9PXUucmV0dXJufHx1LnJldHVybigpfWZpbmFsbHl7aWYobyl0aHJvdyBpfX1yZXR1cm4gbn0odCxlKXx8ZnVuY3Rpb24oKXt0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKX0oKX1mdW5jdGlvbiBmKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBwKHQsZSl7cmV0dXJuIWV8fFwib2JqZWN0XCIhPT1jKGUpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBlP2Z1bmN0aW9uKHQpe2lmKHZvaWQgMCE9PXQpcmV0dXJuIHQ7dGhyb3cgbmV3IFJlZmVyZW5jZUVycm9yKFwidGhpcyBoYXNuJ3QgYmVlbiBpbml0aWFsaXNlZCAtIHN1cGVyKCkgaGFzbid0IGJlZW4gY2FsbGVkXCIpfSh0KTplfWZ1bmN0aW9uIGQodCl7cmV0dXJuKGQ9T2JqZWN0LnNldFByb3RvdHlwZU9mP09iamVjdC5nZXRQcm90b3R5cGVPZjpmdW5jdGlvbih0KXtyZXR1cm4gdC5fX3Byb3RvX198fE9iamVjdC5nZXRQcm90b3R5cGVPZih0KX0pKHQpfWZ1bmN0aW9uIHYodCxlKXtyZXR1cm4odj1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuX19wcm90b19fPWUsdH0pKHQsZSl9dmFyIHk9W1wicG9pbnRlckRvd25cIixcInBvaW50ZXJNb3ZlXCIsXCJwb2ludGVyVXBcIixcInVwZGF0ZVBvaW50ZXJcIixcInJlbW92ZVBvaW50ZXJcIixcIndpbmRvd0JsdXJcIl07ZnVuY3Rpb24gaChPLHcpe3JldHVybiBmdW5jdGlvbih0KXt2YXIgZT13LmludGVyYWN0aW9ucy5saXN0LG49UC5nZXRQb2ludGVyVHlwZSh0KSxyPXgoUC5nZXRFdmVudFRhcmdldHModCksMiksbz1yWzBdLGk9clsxXSxhPVtdO2lmKC9edG91Y2gvLnRlc3QodC50eXBlKSl7dy5wcmV2VG91Y2hUaW1lPXcubm93KCk7Zm9yKHZhciB1PTA7dTx0LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDt1Kyspe3M9dC5jaGFuZ2VkVG91Y2hlc1t1XTt2YXIgcyxsPXtwb2ludGVyOnMscG9pbnRlcklkOlAuZ2V0UG9pbnRlcklkKHMpLHBvaW50ZXJUeXBlOm4sZXZlbnRUeXBlOnQudHlwZSxldmVudFRhcmdldDpvLGN1ckV2ZW50VGFyZ2V0Omksc2NvcGU6d30sYz1TKGwpO2EucHVzaChbbC5wb2ludGVyLGwuZXZlbnRUYXJnZXQsbC5jdXJFdmVudFRhcmdldCxjXSl9fWVsc2V7dmFyIGY9ITE7aWYoIV8uZGVmYXVsdC5zdXBwb3J0c1BvaW50ZXJFdmVudCYmL21vdXNlLy50ZXN0KHQudHlwZSkpe2Zvcih2YXIgcD0wO3A8ZS5sZW5ndGgmJiFmO3ArKylmPVwibW91c2VcIiE9PWVbcF0ucG9pbnRlclR5cGUmJmVbcF0ucG9pbnRlcklzRG93bjtmPWZ8fHcubm93KCktdy5wcmV2VG91Y2hUaW1lPDUwMHx8MD09PXQudGltZVN0YW1wfWlmKCFmKXt2YXIgZD17cG9pbnRlcjp0LHBvaW50ZXJJZDpQLmdldFBvaW50ZXJJZCh0KSxwb2ludGVyVHlwZTpuLGV2ZW50VHlwZTp0LnR5cGUsY3VyRXZlbnRUYXJnZXQ6aSxldmVudFRhcmdldDpvLHNjb3BlOnd9LHY9UyhkKTthLnB1c2goW2QucG9pbnRlcixkLmV2ZW50VGFyZ2V0LGQuY3VyRXZlbnRUYXJnZXQsdl0pfX1mb3IodmFyIHk9MDt5PGEubGVuZ3RoO3krKyl7dmFyIGg9eChhW3ldLDQpLGc9aFswXSxiPWhbMV0sbT1oWzJdO2hbM11bT10oZyx0LGIsbSl9fX1mdW5jdGlvbiBTKHQpe3ZhciBlPXQucG9pbnRlclR5cGUsbj10LnNjb3BlLHI9e2ludGVyYWN0aW9uOm8uZGVmYXVsdC5zZWFyY2godCksc2VhcmNoRGV0YWlsczp0fTtyZXR1cm4gbi5maXJlKFwiaW50ZXJhY3Rpb25zOmZpbmRcIixyKSxyLmludGVyYWN0aW9ufHxuLmludGVyYWN0aW9ucy5uZXcoe3BvaW50ZXJUeXBlOmV9KX1mdW5jdGlvbiByKHQsZSl7dmFyIG49dC5kb2Mscj10LnNjb3BlLG89dC5vcHRpb25zLGk9ci5pbnRlcmFjdGlvbnMuZG9jRXZlbnRzLGE9ci5ldmVudHMsdT1hW2VdO2Zvcih2YXIgcyBpbiByLmJyb3dzZXIuaXNJT1MmJiFvLmV2ZW50cyYmKG8uZXZlbnRzPXtwYXNzaXZlOiExfSksYS5kZWxlZ2F0ZWRFdmVudHMpdShuLHMsYS5kZWxlZ2F0ZUxpc3RlbmVyKSx1KG4scyxhLmRlbGVnYXRlVXNlQ2FwdHVyZSwhMCk7Zm9yKHZhciBsPW8mJm8uZXZlbnRzLGM9MDtjPGkubGVuZ3RoO2MrKyl7dmFyIGY7Zj1pW2NdO3UobixmLnR5cGUsZi5saXN0ZW5lcixsKX19dmFyIGk9e2lkOlwiY29yZS9pbnRlcmFjdGlvbnNcIixpbnN0YWxsOmZ1bmN0aW9uKG8pe2Zvcih2YXIgdD17fSxlPTA7ZTx5Lmxlbmd0aDtlKyspe3ZhciBuO249eVtlXTt0W25dPWgobixvKX12YXIgcixpPV8uZGVmYXVsdC5wRXZlbnRUeXBlcztmdW5jdGlvbiBhKCl7Zm9yKHZhciB0PTA7dDxvLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDt0Kyspe3ZhciBlPW8uaW50ZXJhY3Rpb25zLmxpc3RbdF07aWYoZS5wb2ludGVySXNEb3duJiZcInRvdWNoXCI9PT1lLnBvaW50ZXJUeXBlJiYhZS5faW50ZXJhY3RpbmcpZm9yKHZhciBuPWZ1bmN0aW9uKCl7dmFyIG49ZS5wb2ludGVyc1tyXTtvLmRvY3VtZW50cy5zb21lKGZ1bmN0aW9uKHQpe3ZhciBlPXQuZG9jO3JldHVybigwLCQubm9kZUNvbnRhaW5zKShlLG4uZG93blRhcmdldCl9KXx8ZS5yZW1vdmVQb2ludGVyKG4ucG9pbnRlcixuLmV2ZW50KX0scj0wO3I8ZS5wb2ludGVycy5sZW5ndGg7cisrKXtuKCl9fX0ocj11LmRlZmF1bHQuUG9pbnRlckV2ZW50P1t7dHlwZTppLmRvd24sbGlzdGVuZXI6YX0se3R5cGU6aS5kb3duLGxpc3RlbmVyOnQucG9pbnRlckRvd259LHt0eXBlOmkubW92ZSxsaXN0ZW5lcjp0LnBvaW50ZXJNb3ZlfSx7dHlwZTppLnVwLGxpc3RlbmVyOnQucG9pbnRlclVwfSx7dHlwZTppLmNhbmNlbCxsaXN0ZW5lcjp0LnBvaW50ZXJVcH1dOlt7dHlwZTpcIm1vdXNlZG93blwiLGxpc3RlbmVyOnQucG9pbnRlckRvd259LHt0eXBlOlwibW91c2Vtb3ZlXCIsbGlzdGVuZXI6dC5wb2ludGVyTW92ZX0se3R5cGU6XCJtb3VzZXVwXCIsbGlzdGVuZXI6dC5wb2ludGVyVXB9LHt0eXBlOlwidG91Y2hzdGFydFwiLGxpc3RlbmVyOmF9LHt0eXBlOlwidG91Y2hzdGFydFwiLGxpc3RlbmVyOnQucG9pbnRlckRvd259LHt0eXBlOlwidG91Y2htb3ZlXCIsbGlzdGVuZXI6dC5wb2ludGVyTW92ZX0se3R5cGU6XCJ0b3VjaGVuZFwiLGxpc3RlbmVyOnQucG9pbnRlclVwfSx7dHlwZTpcInRvdWNoY2FuY2VsXCIsbGlzdGVuZXI6dC5wb2ludGVyVXB9XSkucHVzaCh7dHlwZTpcImJsdXJcIixsaXN0ZW5lcjpmdW5jdGlvbih0KXtmb3IodmFyIGU9MDtlPG8uaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO2UrKyl7by5pbnRlcmFjdGlvbnMubGlzdFtlXS5kb2N1bWVudEJsdXIodCl9fX0pLG8ucHJldlRvdWNoVGltZT0wLG8uSW50ZXJhY3Rpb249ZnVuY3Rpb24oKXtmdW5jdGlvbiB0KCl7cmV0dXJuIGZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyx0KSxwKHRoaXMsZCh0KS5hcHBseSh0aGlzLGFyZ3VtZW50cykpfXZhciBlLG4scjtyZXR1cm4gZnVuY3Rpb24odCxlKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBlJiZudWxsIT09ZSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb25cIik7dC5wcm90b3R5cGU9T2JqZWN0LmNyZWF0ZShlJiZlLnByb3RvdHlwZSx7Y29uc3RydWN0b3I6e3ZhbHVlOnQsd3JpdGFibGU6ITAsY29uZmlndXJhYmxlOiEwfX0pLGUmJnYodCxlKX0odCxzW1wiZGVmYXVsdFwiXSksZT10LChuPVt7a2V5OlwiX25vd1wiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIG8ubm93KCl9fSx7a2V5OlwicG9pbnRlck1vdmVUb2xlcmFuY2VcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gby5pbnRlcmFjdGlvbnMucG9pbnRlck1vdmVUb2xlcmFuY2V9LHNldDpmdW5jdGlvbih0KXtvLmludGVyYWN0aW9ucy5wb2ludGVyTW92ZVRvbGVyYW5jZT10fX1dKSYmZihlLnByb3RvdHlwZSxuKSxyJiZmKGUsciksdH0oKSxvLmludGVyYWN0aW9ucz17bGlzdDpbXSxuZXc6ZnVuY3Rpb24odCl7dC5zY29wZUZpcmU9ZnVuY3Rpb24odCxlKXtyZXR1cm4gby5maXJlKHQsZSl9O3ZhciBlPW5ldyBvLkludGVyYWN0aW9uKHQpO3JldHVybiBvLmludGVyYWN0aW9ucy5saXN0LnB1c2goZSksZX0sbGlzdGVuZXJzOnQsZG9jRXZlbnRzOnIscG9pbnRlck1vdmVUb2xlcmFuY2U6MX0sby51c2VQbHVnaW4obC5kZWZhdWx0KX0sbGlzdGVuZXJzOntcInNjb3BlOmFkZC1kb2N1bWVudFwiOmZ1bmN0aW9uKHQpe3JldHVybiByKHQsXCJhZGRcIil9LFwic2NvcGU6cmVtb3ZlLWRvY3VtZW50XCI6ZnVuY3Rpb24odCl7cmV0dXJuIHIodCxcInJlbW92ZVwiKX0sXCJpbnRlcmFjdGFibGU6dW5zZXRcIjpmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj10LmludGVyYWN0YWJsZSxyPWUuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoLTE7MDw9cjtyLS0pe3ZhciBvPWUuaW50ZXJhY3Rpb25zLmxpc3Rbcl07by5pbnRlcmFjdGFibGU9PT1uJiYoby5zdG9wKCksZS5maXJlKFwiaW50ZXJhY3Rpb25zOmRlc3Ryb3lcIix7aW50ZXJhY3Rpb246b30pLG8uZGVzdHJveSgpLDI8ZS5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGgmJmUuaW50ZXJhY3Rpb25zLmxpc3Quc3BsaWNlKHIsMSkpfX19LG9uRG9jU2lnbmFsOnIsZG9PbkludGVyYWN0aW9uczpoLG1ldGhvZE5hbWVzOnl9O2UuZGVmYXVsdD1pfSksVD10KGZ1bmN0aW9uKHQsZSl7XCJ1c2Ugc3RyaWN0XCI7ZnVuY3Rpb24gYSh0KXtyZXR1cm4oYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZS5kZWZhdWx0PWUuSW50ZXJhY3RTdGF0aWM9dm9pZCAwO3ZhciBuLHI9KG49QykmJm4uX19lc01vZHVsZT9uOntkZWZhdWx0Om59LHU9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09YSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1sKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KGxlKSxzPW0oe30pO2Z1bmN0aW9uIGwoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBsPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gbyh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gYyh0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9dmFyIGk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBhKHIpe3ZhciBvPXRoaXM7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxhKSx0aGlzLnNjb3BlPXIsYyh0aGlzLFwiZ2V0UG9pbnRlckF2ZXJhZ2VcIix1LnBvaW50ZXIucG9pbnRlckF2ZXJhZ2UpLGModGhpcyxcImdldFRvdWNoQkJveFwiLHUucG9pbnRlci50b3VjaEJCb3gpLGModGhpcyxcImdldFRvdWNoRGlzdGFuY2VcIix1LnBvaW50ZXIudG91Y2hEaXN0YW5jZSksYyh0aGlzLFwiZ2V0VG91Y2hBbmdsZVwiLHUucG9pbnRlci50b3VjaEFuZ2xlKSxjKHRoaXMsXCJnZXRFbGVtZW50UmVjdFwiLHUuZG9tLmdldEVsZW1lbnRSZWN0KSxjKHRoaXMsXCJnZXRFbGVtZW50Q2xpZW50UmVjdFwiLHUuZG9tLmdldEVsZW1lbnRDbGllbnRSZWN0KSxjKHRoaXMsXCJtYXRjaGVzU2VsZWN0b3JcIix1LmRvbS5tYXRjaGVzU2VsZWN0b3IpLGModGhpcyxcImNsb3Nlc3RcIix1LmRvbS5jbG9zZXN0KSxjKHRoaXMsXCJnbG9iYWxFdmVudHNcIix7fSksYyh0aGlzLFwiZHluYW1pY0Ryb3BcIix2b2lkIDApLGModGhpcyxcInZlcnNpb25cIixcIjEuOS44XCIpLGModGhpcyxcImludGVyYWN0XCIsdm9pZCAwKTtmb3IodmFyIHQ9dGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUsZT1mdW5jdGlvbih0LGUpe3ZhciBuPXIuaW50ZXJhY3RhYmxlcy5nZXQodCxlKTtyZXR1cm4gbnx8KChuPXIuaW50ZXJhY3RhYmxlcy5uZXcodCxlKSkuZXZlbnRzLmdsb2JhbD1vLmdsb2JhbEV2ZW50cyksbn0sbj0wO248T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpLmxlbmd0aDtuKyspe3ZhciBpO2k9T2JqZWN0LmdldE93blByb3BlcnR5TmFtZXModGhpcy5jb25zdHJ1Y3Rvci5wcm90b3R5cGUpW25dO2VbaV09dFtpXX1yZXR1cm4gdS5leHRlbmQoZSx0aGlzKSxlLmNvbnN0cnVjdG9yPXRoaXMuY29uc3RydWN0b3IsdGhpcy5pbnRlcmFjdD1lfXZhciB0LGUsbjtyZXR1cm4gdD1hLChlPVt7a2V5OlwidXNlXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4gdGhpcy5zY29wZS51c2VQbHVnaW4odCxlKSx0aGlzfX0se2tleTpcImlzU2V0XCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtyZXR1cm4hIXRoaXMuc2NvcGUuaW50ZXJhY3RhYmxlcy5nZXQodCxlJiZlLmNvbnRleHQpfX0se2tleTpcIm9uXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe2lmKHUuaXMuc3RyaW5nKHQpJiYtMSE9PXQuc2VhcmNoKFwiIFwiKSYmKHQ9dC50cmltKCkuc3BsaXQoLyArLykpLHUuaXMuYXJyYXkodCkpe2Zvcih2YXIgcj0wO3I8dC5sZW5ndGg7cisrKXt2YXIgbz10W3JdO3RoaXMub24obyxlLG4pfXJldHVybiB0aGlzfWlmKHUuaXMub2JqZWN0KHQpKXtmb3IodmFyIGkgaW4gdCl0aGlzLm9uKGksdFtpXSxlKTtyZXR1cm4gdGhpc31yZXR1cm4oMCxzLmlzTm9uTmF0aXZlRXZlbnQpKHQsdGhpcy5zY29wZS5hY3Rpb25zKT90aGlzLmdsb2JhbEV2ZW50c1t0XT90aGlzLmdsb2JhbEV2ZW50c1t0XS5wdXNoKGUpOnRoaXMuZ2xvYmFsRXZlbnRzW3RdPVtlXTp0aGlzLnNjb3BlLmV2ZW50cy5hZGQodGhpcy5zY29wZS5kb2N1bWVudCx0LGUse29wdGlvbnM6bn0pLHRoaXN9fSx7a2V5Olwib2ZmXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe2lmKHUuaXMuc3RyaW5nKHQpJiYtMSE9PXQuc2VhcmNoKFwiIFwiKSYmKHQ9dC50cmltKCkuc3BsaXQoLyArLykpLHUuaXMuYXJyYXkodCkpe2Zvcih2YXIgcj0wO3I8dC5sZW5ndGg7cisrKXt2YXIgbz10W3JdO3RoaXMub2ZmKG8sZSxuKX1yZXR1cm4gdGhpc31pZih1LmlzLm9iamVjdCh0KSl7Zm9yKHZhciBpIGluIHQpdGhpcy5vZmYoaSx0W2ldLGUpO3JldHVybiB0aGlzfXZhciBhOygwLHMuaXNOb25OYXRpdmVFdmVudCkodCx0aGlzLnNjb3BlLmFjdGlvbnMpP3QgaW4gdGhpcy5nbG9iYWxFdmVudHMmJi0xIT09KGE9dGhpcy5nbG9iYWxFdmVudHNbdF0uaW5kZXhPZihlKSkmJnRoaXMuZ2xvYmFsRXZlbnRzW3RdLnNwbGljZShhLDEpOnRoaXMuc2NvcGUuZXZlbnRzLnJlbW92ZSh0aGlzLnNjb3BlLmRvY3VtZW50LHQsZSxuKTtyZXR1cm4gdGhpc319LHtrZXk6XCJkZWJ1Z1wiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuc2NvcGV9fSx7a2V5Olwic3VwcG9ydHNUb3VjaFwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHIuZGVmYXVsdC5zdXBwb3J0c1RvdWNofX0se2tleTpcInN1cHBvcnRzUG9pbnRlckV2ZW50XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gci5kZWZhdWx0LnN1cHBvcnRzUG9pbnRlckV2ZW50fX0se2tleTpcInN0b3BcIix2YWx1ZTpmdW5jdGlvbigpe2Zvcih2YXIgdD0wO3Q8dGhpcy5zY29wZS5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7dCsrKXt0aGlzLnNjb3BlLmludGVyYWN0aW9ucy5saXN0W3RdLnN0b3AoKX1yZXR1cm4gdGhpc319LHtrZXk6XCJwb2ludGVyTW92ZVRvbGVyYW5jZVwiLHZhbHVlOmZ1bmN0aW9uKHQpe3JldHVybiB1LmlzLm51bWJlcih0KT8odGhpcy5zY29wZS5pbnRlcmFjdGlvbnMucG9pbnRlck1vdmVUb2xlcmFuY2U9dCx0aGlzKTp0aGlzLnNjb3BlLmludGVyYWN0aW9ucy5wb2ludGVyTW92ZVRvbGVyYW5jZX19LHtrZXk6XCJhZGREb2N1bWVudFwiLHZhbHVlOmZ1bmN0aW9uKHQsZSl7dGhpcy5zY29wZS5hZGREb2N1bWVudCh0LGUpfX0se2tleTpcInJlbW92ZURvY3VtZW50XCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5zY29wZS5yZW1vdmVEb2N1bWVudCh0KX19XSkmJm8odC5wcm90b3R5cGUsZSksbiYmbyh0LG4pLGF9KCksZj1lLkludGVyYWN0U3RhdGljPWk7ZS5kZWZhdWx0PWZ9KSxlPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGUuZGVmYXVsdD12b2lkIDA7ZS5kZWZhdWx0PWZ1bmN0aW9uKHQpe3JldHVybiEoIXR8fCF0LldpbmRvdykmJnQgaW5zdGFuY2VvZiB0LldpbmRvd307dmFyIE89e307T2JqZWN0LmRlZmluZVByb3BlcnR5KE8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksTy5pbml0PWksTy5nZXRXaW5kb3c9YSxPLmRlZmF1bHQ9dm9pZCAwO3ZhciBuLHI9KG49ZSkmJm4uX19lc01vZHVsZT9uOntkZWZhdWx0Om59O3ZhciBvPXtyZWFsV2luZG93OnZvaWQgMCx3aW5kb3c6dm9pZCAwLGdldFdpbmRvdzphLGluaXQ6aX07ZnVuY3Rpb24gaSh0KXt2YXIgZT0oby5yZWFsV2luZG93PXQpLmRvY3VtZW50LmNyZWF0ZVRleHROb2RlKFwiXCIpO2Uub3duZXJEb2N1bWVudCE9PXQuZG9jdW1lbnQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIHQud3JhcCYmdC53cmFwKGUpPT09ZSYmKHQ9dC53cmFwKHQpKSxvLndpbmRvdz10fWZ1bmN0aW9uIGEodCl7cmV0dXJuKDAsci5kZWZhdWx0KSh0KT90Oih0Lm93bmVyRG9jdW1lbnR8fHQpLmRlZmF1bHRWaWV3fHxvLndpbmRvd31cInVuZGVmaW5lZFwiPT10eXBlb2Ygd2luZG93PyhvLndpbmRvdz12b2lkIDAsby5yZWFsV2luZG93PXZvaWQgMCk6aSh3aW5kb3cpLG8uaW5pdD1pO3ZhciB1PW87Ty5kZWZhdWx0PXU7dmFyIHc9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHcsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdy5hcnJheT13LnBsYWluT2JqZWN0PXcuZWxlbWVudD13LnN0cmluZz13LmJvb2w9dy5udW1iZXI9dy5mdW5jPXcub2JqZWN0PXcuZG9jRnJhZz13LndpbmRvdz12b2lkIDA7dmFyIHM9YyhlKSxsPWMoTyk7ZnVuY3Rpb24gYyh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gZih0KXtyZXR1cm4oZj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9dy53aW5kb3c9ZnVuY3Rpb24odCl7cmV0dXJuIHQ9PT1sLmRlZmF1bHQud2luZG93fHwoMCxzLmRlZmF1bHQpKHQpfTt3LmRvY0ZyYWc9ZnVuY3Rpb24odCl7cmV0dXJuIHAodCkmJjExPT09dC5ub2RlVHlwZX07dmFyIHA9ZnVuY3Rpb24odCl7cmV0dXJuISF0JiZcIm9iamVjdFwiPT09Zih0KX07dy5vYmplY3Q9cDtmdW5jdGlvbiBkKHQpe3JldHVyblwiZnVuY3Rpb25cIj09dHlwZW9mIHR9dy5mdW5jPWQ7dy5udW1iZXI9ZnVuY3Rpb24odCl7cmV0dXJuXCJudW1iZXJcIj09dHlwZW9mIHR9O3cuYm9vbD1mdW5jdGlvbih0KXtyZXR1cm5cImJvb2xlYW5cIj09dHlwZW9mIHR9O3cuc3RyaW5nPWZ1bmN0aW9uKHQpe3JldHVyblwic3RyaW5nXCI9PXR5cGVvZiB0fTt3LmVsZW1lbnQ9ZnVuY3Rpb24odCl7aWYoIXR8fFwib2JqZWN0XCIhPT1mKHQpKXJldHVybiExO3ZhciBlPWwuZGVmYXVsdC5nZXRXaW5kb3codCl8fGwuZGVmYXVsdC53aW5kb3c7cmV0dXJuL29iamVjdHxmdW5jdGlvbi8udGVzdChmKGUuRWxlbWVudCkpP3QgaW5zdGFuY2VvZiBlLkVsZW1lbnQ6MT09PXQubm9kZVR5cGUmJlwic3RyaW5nXCI9PXR5cGVvZiB0Lm5vZGVOYW1lfTt3LnBsYWluT2JqZWN0PWZ1bmN0aW9uKHQpe3JldHVybiBwKHQpJiYhIXQuY29uc3RydWN0b3ImJi9mdW5jdGlvbiBPYmplY3RcXGIvLnRlc3QodC5jb25zdHJ1Y3Rvci50b1N0cmluZygpKX07dy5hcnJheT1mdW5jdGlvbih0KXtyZXR1cm4gcCh0KSYmdm9pZCAwIT09dC5sZW5ndGgmJmQodC5zcGxpY2UpfTt2YXIgdj17fTtmdW5jdGlvbiB5KHQpe3JldHVybih5PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx2LmRlZmF1bHQ9dm9pZCAwO3ZhciBoPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PXkodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9ZygpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSh3KTtmdW5jdGlvbiBnKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gZz1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIGIodCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtpZihcImRyYWdcIj09PWUucHJlcGFyZWQubmFtZSl7dmFyIG49ZS5wcmVwYXJlZC5heGlzO1wieFwiPT09bj8oZS5jb29yZHMuY3VyLnBhZ2UueT1lLmNvb3Jkcy5zdGFydC5wYWdlLnksZS5jb29yZHMuY3VyLmNsaWVudC55PWUuY29vcmRzLnN0YXJ0LmNsaWVudC55LGUuY29vcmRzLnZlbG9jaXR5LmNsaWVudC55PTAsZS5jb29yZHMudmVsb2NpdHkucGFnZS55PTApOlwieVwiPT09biYmKGUuY29vcmRzLmN1ci5wYWdlLng9ZS5jb29yZHMuc3RhcnQucGFnZS54LGUuY29vcmRzLmN1ci5jbGllbnQueD1lLmNvb3Jkcy5zdGFydC5jbGllbnQueCxlLmNvb3Jkcy52ZWxvY2l0eS5jbGllbnQueD0wLGUuY29vcmRzLnZlbG9jaXR5LnBhZ2UueD0wKX19ZnVuY3Rpb24gXyh0KXt2YXIgZT10LmlFdmVudCxuPXQuaW50ZXJhY3Rpb247aWYoXCJkcmFnXCI9PT1uLnByZXBhcmVkLm5hbWUpe3ZhciByPW4ucHJlcGFyZWQuYXhpcztpZihcInhcIj09PXJ8fFwieVwiPT09cil7dmFyIG89XCJ4XCI9PT1yP1wieVwiOlwieFwiO2UucGFnZVtvXT1uLmNvb3Jkcy5zdGFydC5wYWdlW29dLGUuY2xpZW50W29dPW4uY29vcmRzLnN0YXJ0LmNsaWVudFtvXSxlLmRlbHRhW29dPTB9fX12YXIgUD17aWQ6XCJhY3Rpb25zL2RyYWdcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPXQuYWN0aW9ucyxuPXQuSW50ZXJhY3RhYmxlLHI9dC5kZWZhdWx0cztuLnByb3RvdHlwZS5kcmFnZ2FibGU9UC5kcmFnZ2FibGUsZS5tYXAuZHJhZz1QLGUubWV0aG9kRGljdC5kcmFnPVwiZHJhZ2dhYmxlXCIsci5hY3Rpb25zLmRyYWc9UC5kZWZhdWx0c30sbGlzdGVuZXJzOntcImludGVyYWN0aW9uczpiZWZvcmUtYWN0aW9uLW1vdmVcIjpiLFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1yZXN1bWVcIjpiLFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1tb3ZlXCI6XyxcImF1dG8tc3RhcnQ6Y2hlY2tcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5pbnRlcmFjdGFibGUscj10LmJ1dHRvbnMsbz1uLm9wdGlvbnMuZHJhZztpZihvJiZvLmVuYWJsZWQmJighZS5wb2ludGVySXNEb3dufHwhL21vdXNlfHBvaW50ZXIvLnRlc3QoZS5wb2ludGVyVHlwZSl8fDAhPShyJm4ub3B0aW9ucy5kcmFnLm1vdXNlQnV0dG9ucykpKXJldHVybiEodC5hY3Rpb249e25hbWU6XCJkcmFnXCIsYXhpczpcInN0YXJ0XCI9PT1vLmxvY2tBeGlzP28uc3RhcnRBeGlzOm8ubG9ja0F4aXN9KX19LGRyYWdnYWJsZTpmdW5jdGlvbih0KXtyZXR1cm4gaC5vYmplY3QodCk/KHRoaXMub3B0aW9ucy5kcmFnLmVuYWJsZWQ9ITEhPT10LmVuYWJsZWQsdGhpcy5zZXRQZXJBY3Rpb24oXCJkcmFnXCIsdCksdGhpcy5zZXRPbkV2ZW50cyhcImRyYWdcIix0KSwvXih4eXx4fHl8c3RhcnQpJC8udGVzdCh0LmxvY2tBeGlzKSYmKHRoaXMub3B0aW9ucy5kcmFnLmxvY2tBeGlzPXQubG9ja0F4aXMpLC9eKHh5fHh8eSkkLy50ZXN0KHQuc3RhcnRBeGlzKSYmKHRoaXMub3B0aW9ucy5kcmFnLnN0YXJ0QXhpcz10LnN0YXJ0QXhpcyksdGhpcyk6aC5ib29sKHQpPyh0aGlzLm9wdGlvbnMuZHJhZy5lbmFibGVkPXQsdGhpcyk6dGhpcy5vcHRpb25zLmRyYWd9LGJlZm9yZU1vdmU6Yixtb3ZlOl8sZGVmYXVsdHM6e3N0YXJ0QXhpczpcInh5XCIsbG9ja0F4aXM6XCJ4eVwifSxnZXRDdXJzb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIm1vdmVcIn19LHg9UDt2LmRlZmF1bHQ9eDt2YXIgUz17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxTLmZpbmQ9Uy5maW5kSW5kZXg9Uy5mcm9tPVMubWVyZ2U9Uy5yZW1vdmU9Uy5jb250YWlucz12b2lkIDA7Uy5jb250YWlucz1mdW5jdGlvbih0LGUpe3JldHVybi0xIT09dC5pbmRleE9mKGUpfTtTLnJlbW92ZT1mdW5jdGlvbih0LGUpe3JldHVybiB0LnNwbGljZSh0LmluZGV4T2YoZSksMSl9O2Z1bmN0aW9uIGoodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTt0LnB1c2gocil9cmV0dXJuIHR9Uy5tZXJnZT1qO1MuZnJvbT1mdW5jdGlvbih0KXtyZXR1cm4gaihbXSx0KX07ZnVuY3Rpb24gTSh0LGUpe2Zvcih2YXIgbj0wO248dC5sZW5ndGg7bisrKWlmKGUodFtuXSxuLHQpKXJldHVybiBuO3JldHVybi0xfVMuZmluZEluZGV4PU07Uy5maW5kPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHRbTSh0LGUpXX07dmFyIEQ9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KEQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksRC5kZWZhdWx0PXZvaWQgMDt2YXIgST17aW5pdDpmdW5jdGlvbih0KXt2YXIgZT10O0kuZG9jdW1lbnQ9ZS5kb2N1bWVudCxJLkRvY3VtZW50RnJhZ21lbnQ9ZS5Eb2N1bWVudEZyYWdtZW50fHx6LEkuU1ZHRWxlbWVudD1lLlNWR0VsZW1lbnR8fHosSS5TVkdTVkdFbGVtZW50PWUuU1ZHU1ZHRWxlbWVudHx8eixJLlNWR0VsZW1lbnRJbnN0YW5jZT1lLlNWR0VsZW1lbnRJbnN0YW5jZXx8eixJLkVsZW1lbnQ9ZS5FbGVtZW50fHx6LEkuSFRNTEVsZW1lbnQ9ZS5IVE1MRWxlbWVudHx8SS5FbGVtZW50LEkuRXZlbnQ9ZS5FdmVudCxJLlRvdWNoPWUuVG91Y2h8fHosSS5Qb2ludGVyRXZlbnQ9ZS5Qb2ludGVyRXZlbnR8fGUuTVNQb2ludGVyRXZlbnR9LGRvY3VtZW50Om51bGwsRG9jdW1lbnRGcmFnbWVudDpudWxsLFNWR0VsZW1lbnQ6bnVsbCxTVkdTVkdFbGVtZW50Om51bGwsU1ZHRWxlbWVudEluc3RhbmNlOm51bGwsRWxlbWVudDpudWxsLEhUTUxFbGVtZW50Om51bGwsRXZlbnQ6bnVsbCxUb3VjaDpudWxsLFBvaW50ZXJFdmVudDpudWxsfTtmdW5jdGlvbiB6KCl7fXZhciBBPUk7RC5kZWZhdWx0PUE7dmFyIEM9e307ZnVuY3Rpb24gVyh0KXtyZXR1cm4oVz1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KEMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksQy5kZWZhdWx0PXZvaWQgMDt2YXIgUj1OKEQpLEY9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09Vyh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1ZKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpLFg9TihPKTtmdW5jdGlvbiBZKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gWT1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIE4odCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBMPXtpbml0OmZ1bmN0aW9uKHQpe3ZhciBlPVIuZGVmYXVsdC5FbGVtZW50LG49WC5kZWZhdWx0LndpbmRvdy5uYXZpZ2F0b3I7TC5zdXBwb3J0c1RvdWNoPVwib250b3VjaHN0YXJ0XCJpbiB0fHxGLmZ1bmModC5Eb2N1bWVudFRvdWNoKSYmUi5kZWZhdWx0LmRvY3VtZW50IGluc3RhbmNlb2YgdC5Eb2N1bWVudFRvdWNoLEwuc3VwcG9ydHNQb2ludGVyRXZlbnQ9ITEhPT1uLnBvaW50ZXJFbmFibGVkJiYhIVIuZGVmYXVsdC5Qb2ludGVyRXZlbnQsTC5pc0lPUz0vaVAoaG9uZXxvZHxhZCkvLnRlc3Qobi5wbGF0Zm9ybSksTC5pc0lPUzc9L2lQKGhvbmV8b2R8YWQpLy50ZXN0KG4ucGxhdGZvcm0pJiYvT1MgN1teXFxkXS8udGVzdChuLmFwcFZlcnNpb24pLEwuaXNJZTk9L01TSUUgOS8udGVzdChuLnVzZXJBZ2VudCksTC5pc09wZXJhTW9iaWxlPVwiT3BlcmFcIj09PW4uYXBwTmFtZSYmTC5zdXBwb3J0c1RvdWNoJiYvUHJlc3RvLy50ZXN0KG4udXNlckFnZW50KSxMLnByZWZpeGVkTWF0Y2hlc1NlbGVjdG9yPVwibWF0Y2hlc1wiaW4gZS5wcm90b3R5cGU/XCJtYXRjaGVzXCI6XCJ3ZWJraXRNYXRjaGVzU2VsZWN0b3JcImluIGUucHJvdG90eXBlP1wid2Via2l0TWF0Y2hlc1NlbGVjdG9yXCI6XCJtb3pNYXRjaGVzU2VsZWN0b3JcImluIGUucHJvdG90eXBlP1wibW96TWF0Y2hlc1NlbGVjdG9yXCI6XCJvTWF0Y2hlc1NlbGVjdG9yXCJpbiBlLnByb3RvdHlwZT9cIm9NYXRjaGVzU2VsZWN0b3JcIjpcIm1zTWF0Y2hlc1NlbGVjdG9yXCIsTC5wRXZlbnRUeXBlcz1MLnN1cHBvcnRzUG9pbnRlckV2ZW50P1IuZGVmYXVsdC5Qb2ludGVyRXZlbnQ9PT10Lk1TUG9pbnRlckV2ZW50P3t1cDpcIk1TUG9pbnRlclVwXCIsZG93bjpcIk1TUG9pbnRlckRvd25cIixvdmVyOlwibW91c2VvdmVyXCIsb3V0OlwibW91c2VvdXRcIixtb3ZlOlwiTVNQb2ludGVyTW92ZVwiLGNhbmNlbDpcIk1TUG9pbnRlckNhbmNlbFwifTp7dXA6XCJwb2ludGVydXBcIixkb3duOlwicG9pbnRlcmRvd25cIixvdmVyOlwicG9pbnRlcm92ZXJcIixvdXQ6XCJwb2ludGVyb3V0XCIsbW92ZTpcInBvaW50ZXJtb3ZlXCIsY2FuY2VsOlwicG9pbnRlcmNhbmNlbFwifTpudWxsLEwud2hlZWxFdmVudD1cIm9ubW91c2V3aGVlbFwiaW4gUi5kZWZhdWx0LmRvY3VtZW50P1wibW91c2V3aGVlbFwiOlwid2hlZWxcIn0sc3VwcG9ydHNUb3VjaDpudWxsLHN1cHBvcnRzUG9pbnRlckV2ZW50Om51bGwsaXNJT1M3Om51bGwsaXNJT1M6bnVsbCxpc0llOTpudWxsLGlzT3BlcmFNb2JpbGU6bnVsbCxwcmVmaXhlZE1hdGNoZXNTZWxlY3RvcjpudWxsLHBFdmVudFR5cGVzOm51bGwsd2hlZWxFdmVudDpudWxsfTt2YXIgQj1MO0MuZGVmYXVsdD1CO3ZhciBWPXt9O2Z1bmN0aW9uIHEodCl7cmV0dXJuKHE9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShWLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFYuZGVmYXVsdD1mdW5jdGlvbiB0KGUpe3ZhciBuPXt9O2Zvcih2YXIgciBpbiBlKXt2YXIgbz1lW3JdO0cucGxhaW5PYmplY3Qobyk/bltyXT10KG8pOkcuYXJyYXkobyk/bltyXT1VLmZyb20obyk6bltyXT1vfXJldHVybiBufTt2YXIgVT1LKFMpLEc9Syh3KTtmdW5jdGlvbiBIKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gSD1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIEsodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09cSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1IKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfXJldHVybiBuLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pLG59dmFyICQ9e307ZnVuY3Rpb24gWih0KXtyZXR1cm4oWj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KCQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksJC5ub2RlQ29udGFpbnM9ZnVuY3Rpb24odCxlKXtmb3IoO2U7KXtpZihlPT09dClyZXR1cm4hMDtlPWUucGFyZW50Tm9kZX1yZXR1cm4hMX0sJC5jbG9zZXN0PWZ1bmN0aW9uKHQsZSl7Zm9yKDt0dC5lbGVtZW50KHQpOyl7aWYoYXQodCxlKSlyZXR1cm4gdDt0PWl0KHQpfXJldHVybiBudWxsfSwkLnBhcmVudE5vZGU9aXQsJC5tYXRjaGVzU2VsZWN0b3I9YXQsJC5pbmRleE9mRGVlcGVzdEVsZW1lbnQ9ZnVuY3Rpb24odCl7dmFyIGUsbixyPVtdLG89dFswXSxpPW8/MDotMTtmb3IoZT0xO2U8dC5sZW5ndGg7ZSsrKXt2YXIgYT10W2VdO2lmKGEmJmEhPT1vKWlmKG8pe2lmKGEucGFyZW50Tm9kZSE9PWEub3duZXJEb2N1bWVudClpZihvLnBhcmVudE5vZGUhPT1hLm93bmVyRG9jdW1lbnQpaWYoYS5wYXJlbnROb2RlIT09by5wYXJlbnROb2RlKXtpZighci5sZW5ndGgpZm9yKHZhciB1PW8scz12b2lkIDA7KHM9dXQodSkpJiZzIT09dS5vd25lckRvY3VtZW50OylyLnVuc2hpZnQodSksdT1zO3ZhciBsPXZvaWQgMDtpZihvIGluc3RhbmNlb2YgUS5kZWZhdWx0LkhUTUxFbGVtZW50JiZhIGluc3RhbmNlb2YgUS5kZWZhdWx0LlNWR0VsZW1lbnQmJiEoYSBpbnN0YW5jZW9mIFEuZGVmYXVsdC5TVkdTVkdFbGVtZW50KSl7aWYoYT09PW8ucGFyZW50Tm9kZSljb250aW51ZTtsPWEub3duZXJTVkdFbGVtZW50fWVsc2UgbD1hO2Zvcih2YXIgYz1bXTtsLnBhcmVudE5vZGUhPT1sLm93bmVyRG9jdW1lbnQ7KWMudW5zaGlmdChsKSxsPXV0KGwpO2ZvcihuPTA7Y1tuXSYmY1tuXT09PXJbbl07KW4rKztmb3IodmFyIGY9W2Nbbi0xXSxjW25dLHJbbl1dLHA9ZlswXS5sYXN0Q2hpbGQ7cDspe2lmKHA9PT1mWzFdKXtvPWEsaT1lLHI9YzticmVha31pZihwPT09ZlsyXSlicmVhaztwPXAucHJldmlvdXNTaWJsaW5nfX1lbHNle3ZhciBkPXBhcnNlSW50KCgwLGV0LmdldFdpbmRvdykobykuZ2V0Q29tcHV0ZWRTdHlsZShvKS56SW5kZXgsMTApfHwwLHY9cGFyc2VJbnQoKDAsZXQuZ2V0V2luZG93KShhKS5nZXRDb21wdXRlZFN0eWxlKGEpLnpJbmRleCwxMCl8fDA7ZDw9diYmKG89YSxpPWUpfWVsc2Ugbz1hLGk9ZX1lbHNlIG89YSxpPWV9cmV0dXJuIGl9LCQubWF0Y2hlc1VwVG89ZnVuY3Rpb24odCxlLG4pe2Zvcig7dHQuZWxlbWVudCh0KTspe2lmKGF0KHQsZSkpcmV0dXJuITA7aWYoKHQ9aXQodCkpPT09bilyZXR1cm4gYXQodCxlKX1yZXR1cm4hMX0sJC5nZXRBY3R1YWxFbGVtZW50PWZ1bmN0aW9uKHQpe3JldHVybiB0IGluc3RhbmNlb2YgUS5kZWZhdWx0LlNWR0VsZW1lbnRJbnN0YW5jZT90LmNvcnJlc3BvbmRpbmdVc2VFbGVtZW50OnR9LCQuZ2V0U2Nyb2xsWFk9c3QsJC5nZXRFbGVtZW50Q2xpZW50UmVjdD1sdCwkLmdldEVsZW1lbnRSZWN0PWZ1bmN0aW9uKHQpe3ZhciBlPWx0KHQpO2lmKCFKLmRlZmF1bHQuaXNJT1M3JiZlKXt2YXIgbj1zdChldC5kZWZhdWx0LmdldFdpbmRvdyh0KSk7ZS5sZWZ0Kz1uLngsZS5yaWdodCs9bi54LGUudG9wKz1uLnksZS5ib3R0b20rPW4ueX1yZXR1cm4gZX0sJC5nZXRQYXRoPWZ1bmN0aW9uKHQpe3ZhciBlPVtdO2Zvcig7dDspZS5wdXNoKHQpLHQ9aXQodCk7cmV0dXJuIGV9LCQudHJ5U2VsZWN0b3I9ZnVuY3Rpb24odCl7cmV0dXJuISF0dC5zdHJpbmcodCkmJihRLmRlZmF1bHQuZG9jdW1lbnQucXVlcnlTZWxlY3Rvcih0KSwhMCl9O3ZhciBKPW90KEMpLFE9b3QoRCksdHQ9cnQodyksZXQ9cnQoTyk7ZnVuY3Rpb24gbnQoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBudD1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIHJ0KHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVoodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9bnQoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiBvdCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gaXQodCl7dmFyIGU9dC5wYXJlbnROb2RlO2lmKHR0LmRvY0ZyYWcoZSkpe2Zvcig7KGU9ZS5ob3N0KSYmdHQuZG9jRnJhZyhlKTspO3JldHVybiBlfXJldHVybiBlfWZ1bmN0aW9uIGF0KHQsZSl7cmV0dXJuIGV0LmRlZmF1bHQud2luZG93IT09ZXQuZGVmYXVsdC5yZWFsV2luZG93JiYoZT1lLnJlcGxhY2UoL1xcL2RlZXBcXC8vZyxcIiBcIikpLHRbSi5kZWZhdWx0LnByZWZpeGVkTWF0Y2hlc1NlbGVjdG9yXShlKX12YXIgdXQ9ZnVuY3Rpb24odCl7cmV0dXJuIHQucGFyZW50Tm9kZT90LnBhcmVudE5vZGU6dC5ob3N0fTtmdW5jdGlvbiBzdCh0KXtyZXR1cm57eDoodD10fHxldC5kZWZhdWx0LndpbmRvdykuc2Nyb2xsWHx8dC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsTGVmdCx5OnQuc2Nyb2xsWXx8dC5kb2N1bWVudC5kb2N1bWVudEVsZW1lbnQuc2Nyb2xsVG9wfX1mdW5jdGlvbiBsdCh0KXt2YXIgZT10IGluc3RhbmNlb2YgUS5kZWZhdWx0LlNWR0VsZW1lbnQ/dC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTp0LmdldENsaWVudFJlY3RzKClbMF07cmV0dXJuIGUmJntsZWZ0OmUubGVmdCxyaWdodDplLnJpZ2h0LHRvcDplLnRvcCxib3R0b206ZS5ib3R0b20sd2lkdGg6ZS53aWR0aHx8ZS5yaWdodC1lLmxlZnQsaGVpZ2h0OmUuaGVpZ2h0fHxlLmJvdHRvbS1lLnRvcH19dmFyIGN0PXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShjdCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxjdC5kZWZhdWx0PWZ1bmN0aW9uKHQsZSl7Zm9yKHZhciBuIGluIGUpdFtuXT1lW25dO3JldHVybiB0fTt2YXIgZnQ9e307ZnVuY3Rpb24gcHQodCl7cmV0dXJuKHB0PVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZnQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksZnQuZGVmYXVsdD1mdW5jdGlvbiBuKGUscixvKXtvPW98fHt9O3l0LnN0cmluZyhlKSYmLTEhPT1lLnNlYXJjaChcIiBcIikmJihlPWd0KGUpKTtpZih5dC5hcnJheShlKSlyZXR1cm4gZS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4oMCx2dC5kZWZhdWx0KSh0LG4oZSxyLG8pKX0sbyk7eXQub2JqZWN0KGUpJiYocj1lLGU9XCJcIik7aWYoeXQuZnVuYyhyKSlvW2VdPW9bZV18fFtdLG9bZV0ucHVzaChyKTtlbHNlIGlmKHl0LmFycmF5KHIpKWZvcih2YXIgdD0wO3Q8ci5sZW5ndGg7dCsrKXt2YXIgaT1yW3RdO24oZSxpLG8pfWVsc2UgaWYoeXQub2JqZWN0KHIpKWZvcih2YXIgYSBpbiByKXt2YXIgdT1ndChhKS5tYXAoZnVuY3Rpb24odCl7cmV0dXJuXCJcIi5jb25jYXQoZSkuY29uY2F0KHQpfSk7bih1LHJbYV0sbyl9cmV0dXJuIG99O3ZhciBkdCx2dD0oZHQ9Y3QpJiZkdC5fX2VzTW9kdWxlP2R0OntkZWZhdWx0OmR0fSx5dD1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1wdCh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1odCgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSh3KTtmdW5jdGlvbiBodCgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIGh0PWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gZ3QodCl7cmV0dXJuIHQudHJpbSgpLnNwbGl0KC8gKy8pfXZhciBidD17fTtmdW5jdGlvbiBtdCh0KXtyZXR1cm4obXQ9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShidCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxidC5kZWZhdWx0PXZvaWQgMDt2YXIgT3Q9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09bXQodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9eHQoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oUyksd3Q9UHQoY3QpLF90PVB0KGZ0KTtmdW5jdGlvbiBQdCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24geHQoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiB4dD1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIFN0KHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBqdCh0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9ZnVuY3Rpb24gTXQodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtpZih0LmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZClicmVhaztyKHQpfX12YXIga3Q9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpeyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsZSksanQodGhpcyxcIm9wdGlvbnNcIix2b2lkIDApLGp0KHRoaXMsXCJ0eXBlc1wiLHt9KSxqdCh0aGlzLFwicHJvcGFnYXRpb25TdG9wcGVkXCIsITEpLGp0KHRoaXMsXCJpbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWRcIiwhMSksanQodGhpcyxcImdsb2JhbFwiLHZvaWQgMCksdGhpcy5vcHRpb25zPSgwLHd0LmRlZmF1bHQpKHt9LHR8fHt9KX12YXIgdCxuLHI7cmV0dXJuIHQ9ZSwobj1be2tleTpcImZpcmVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZSxuPXRoaXMuZ2xvYmFsOyhlPXRoaXMudHlwZXNbdC50eXBlXSkmJk10KHQsZSksIXQucHJvcGFnYXRpb25TdG9wcGVkJiZuJiYoZT1uW3QudHlwZV0pJiZNdCh0LGUpfX0se2tleTpcIm9uXCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt2YXIgbj0oMCxfdC5kZWZhdWx0KSh0LGUpO2Zvcih0IGluIG4pdGhpcy50eXBlc1t0XT1PdC5tZXJnZSh0aGlzLnR5cGVzW3RdfHxbXSxuW3RdKX19LHtrZXk6XCJvZmZcIix2YWx1ZTpmdW5jdGlvbih0LGUpe3ZhciBuPSgwLF90LmRlZmF1bHQpKHQsZSk7Zm9yKHQgaW4gbil7dmFyIHI9dGhpcy50eXBlc1t0XTtpZihyJiZyLmxlbmd0aClmb3IodmFyIG89MDtvPG5bdF0ubGVuZ3RoO28rKyl7dmFyIGk9blt0XVtvXSxhPXIuaW5kZXhPZihpKTstMSE9PWEmJnIuc3BsaWNlKGEsMSl9fX19LHtrZXk6XCJnZXRSZWN0XCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gbnVsbH19XSkmJlN0KHQucHJvdG90eXBlLG4pLHImJlN0KHQsciksZX0oKTtidC5kZWZhdWx0PWt0O3ZhciBFdD17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoRXQsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksRXQuZGVmYXVsdD12b2lkIDA7RXQuZGVmYXVsdD1mdW5jdGlvbih0LGUpe3JldHVybiBNYXRoLnNxcnQodCp0K2UqZSl9O3ZhciBUdD17fTtmdW5jdGlvbiBEdCh0LGUpe2Zvcih2YXIgbiBpbiBlKXt2YXIgcj1EdC5wcmVmaXhlZFByb3BSRXMsbz0hMTtmb3IodmFyIGkgaW4gcilpZigwPT09bi5pbmRleE9mKGkpJiZyW2ldLnRlc3Qobikpe289ITA7YnJlYWt9b3x8XCJmdW5jdGlvblwiPT10eXBlb2YgZVtuXXx8KHRbbl09ZVtuXSl9cmV0dXJuIHR9T2JqZWN0LmRlZmluZVByb3BlcnR5KFR0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFR0LmRlZmF1bHQ9dm9pZCAwLER0LnByZWZpeGVkUHJvcFJFcz17d2Via2l0Oi8oTW92ZW1lbnRbWFldfFJhZGl1c1tYWV18Um90YXRpb25BbmdsZXxGb3JjZSkkLyxtb3o6LyhQcmVzc3VyZSkkL307dmFyIEl0PUR0O1R0LmRlZmF1bHQ9SXQ7dmFyIHp0PXt9O2Z1bmN0aW9uIEF0KHQpe3JldHVybihBdD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KHp0LFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHp0LmNvcHlDb29yZHM9ZnVuY3Rpb24odCxlKXt0LnBhZ2U9dC5wYWdlfHx7fSx0LnBhZ2UueD1lLnBhZ2UueCx0LnBhZ2UueT1lLnBhZ2UueSx0LmNsaWVudD10LmNsaWVudHx8e30sdC5jbGllbnQueD1lLmNsaWVudC54LHQuY2xpZW50Lnk9ZS5jbGllbnQueSx0LnRpbWVTdGFtcD1lLnRpbWVTdGFtcH0senQuc2V0Q29vcmREZWx0YXM9ZnVuY3Rpb24odCxlLG4pe3QucGFnZS54PW4ucGFnZS54LWUucGFnZS54LHQucGFnZS55PW4ucGFnZS55LWUucGFnZS55LHQuY2xpZW50Lng9bi5jbGllbnQueC1lLmNsaWVudC54LHQuY2xpZW50Lnk9bi5jbGllbnQueS1lLmNsaWVudC55LHQudGltZVN0YW1wPW4udGltZVN0YW1wLWUudGltZVN0YW1wfSx6dC5zZXRDb29yZFZlbG9jaXR5PWZ1bmN0aW9uKHQsZSl7dmFyIG49TWF0aC5tYXgoZS50aW1lU3RhbXAvMWUzLC4wMDEpO3QucGFnZS54PWUucGFnZS54L24sdC5wYWdlLnk9ZS5wYWdlLnkvbix0LmNsaWVudC54PWUuY2xpZW50Lngvbix0LmNsaWVudC55PWUuY2xpZW50Lnkvbix0LnRpbWVTdGFtcD1ufSx6dC5zZXRaZXJvQ29vcmRzPWZ1bmN0aW9uKHQpe3QucGFnZS54PTAsdC5wYWdlLnk9MCx0LmNsaWVudC54PTAsdC5jbGllbnQueT0wfSx6dC5pc05hdGl2ZVBvaW50ZXI9VnQsenQuZ2V0WFk9cXQsenQuZ2V0UGFnZVhZPVV0LHp0LmdldENsaWVudFhZPUd0LHp0LmdldFBvaW50ZXJJZD1mdW5jdGlvbih0KXtyZXR1cm4gWHQubnVtYmVyKHQucG9pbnRlcklkKT90LnBvaW50ZXJJZDp0LmlkZW50aWZpZXJ9LHp0LnNldENvb3Jkcz1mdW5jdGlvbih0LGUsbil7dmFyIHI9MTxlLmxlbmd0aD9LdChlKTplWzBdLG89e307VXQocixvKSx0LnBhZ2UueD1vLngsdC5wYWdlLnk9by55LEd0KHIsbyksdC5jbGllbnQueD1vLngsdC5jbGllbnQueT1vLnksdC50aW1lU3RhbXA9bn0senQuZ2V0VG91Y2hQYWlyPUh0LHp0LnBvaW50ZXJBdmVyYWdlPUt0LHp0LnRvdWNoQkJveD1mdW5jdGlvbih0KXtpZighKHQubGVuZ3RofHx0LnRvdWNoZXMmJjE8dC50b3VjaGVzLmxlbmd0aCkpcmV0dXJuIG51bGw7dmFyIGU9SHQodCksbj1NYXRoLm1pbihlWzBdLnBhZ2VYLGVbMV0ucGFnZVgpLHI9TWF0aC5taW4oZVswXS5wYWdlWSxlWzFdLnBhZ2VZKSxvPU1hdGgubWF4KGVbMF0ucGFnZVgsZVsxXS5wYWdlWCksaT1NYXRoLm1heChlWzBdLnBhZ2VZLGVbMV0ucGFnZVkpO3JldHVybnt4Om4seTpyLGxlZnQ6bix0b3A6cixyaWdodDpvLGJvdHRvbTppLHdpZHRoOm8tbixoZWlnaHQ6aS1yfX0senQudG91Y2hEaXN0YW5jZT1mdW5jdGlvbih0LGUpe3ZhciBuPWUrXCJYXCIscj1lK1wiWVwiLG89SHQodCksaT1vWzBdW25dLW9bMV1bbl0sYT1vWzBdW3JdLW9bMV1bcl07cmV0dXJuKDAsRnQuZGVmYXVsdCkoaSxhKX0senQudG91Y2hBbmdsZT1mdW5jdGlvbih0LGUpe3ZhciBuPWUrXCJYXCIscj1lK1wiWVwiLG89SHQodCksaT1vWzFdW25dLW9bMF1bbl0sYT1vWzFdW3JdLW9bMF1bcl07cmV0dXJuIDE4MCpNYXRoLmF0YW4yKGEsaSkvTWF0aC5QSX0senQuZ2V0UG9pbnRlclR5cGU9ZnVuY3Rpb24odCl7cmV0dXJuIFh0LnN0cmluZyh0LnBvaW50ZXJUeXBlKT90LnBvaW50ZXJUeXBlOlh0Lm51bWJlcih0LnBvaW50ZXJUeXBlKT9bdm9pZCAwLHZvaWQgMCxcInRvdWNoXCIsXCJwZW5cIixcIm1vdXNlXCJdW3QucG9pbnRlclR5cGVdOi90b3VjaC8udGVzdCh0LnR5cGUpfHx0IGluc3RhbmNlb2YgV3QuZGVmYXVsdC5Ub3VjaD9cInRvdWNoXCI6XCJtb3VzZVwifSx6dC5nZXRFdmVudFRhcmdldHM9ZnVuY3Rpb24odCl7dmFyIGU9WHQuZnVuYyh0LmNvbXBvc2VkUGF0aCk/dC5jb21wb3NlZFBhdGgoKTp0LnBhdGg7cmV0dXJuW1J0LmdldEFjdHVhbEVsZW1lbnQoZT9lWzBdOnQudGFyZ2V0KSxSdC5nZXRBY3R1YWxFbGVtZW50KHQuY3VycmVudFRhcmdldCldfSx6dC5uZXdDb29yZHM9ZnVuY3Rpb24oKXtyZXR1cm57cGFnZTp7eDowLHk6MH0sY2xpZW50Ont4OjAseTowfSx0aW1lU3RhbXA6MH19LHp0LmNvb3Jkc1RvRXZlbnQ9ZnVuY3Rpb24odCl7cmV0dXJue2Nvb3Jkczp0LGdldCBwYWdlKCl7cmV0dXJuIHRoaXMuY29vcmRzLnBhZ2V9LGdldCBjbGllbnQoKXtyZXR1cm4gdGhpcy5jb29yZHMuY2xpZW50fSxnZXQgdGltZVN0YW1wKCl7cmV0dXJuIHRoaXMuY29vcmRzLnRpbWVTdGFtcH0sZ2V0IHBhZ2VYKCl7cmV0dXJuIHRoaXMuY29vcmRzLnBhZ2UueH0sZ2V0IHBhZ2VZKCl7cmV0dXJuIHRoaXMuY29vcmRzLnBhZ2UueX0sZ2V0IGNsaWVudFgoKXtyZXR1cm4gdGhpcy5jb29yZHMuY2xpZW50Lnh9LGdldCBjbGllbnRZKCl7cmV0dXJuIHRoaXMuY29vcmRzLmNsaWVudC55fSxnZXQgcG9pbnRlcklkKCl7cmV0dXJuIHRoaXMuY29vcmRzLnBvaW50ZXJJZH0sZ2V0IHRhcmdldCgpe3JldHVybiB0aGlzLmNvb3Jkcy50YXJnZXR9LGdldCB0eXBlKCl7cmV0dXJuIHRoaXMuY29vcmRzLnR5cGV9LGdldCBwb2ludGVyVHlwZSgpe3JldHVybiB0aGlzLmNvb3Jkcy5wb2ludGVyVHlwZX0sZ2V0IGJ1dHRvbnMoKXtyZXR1cm4gdGhpcy5jb29yZHMuYnV0dG9uc30scHJldmVudERlZmF1bHQ6ZnVuY3Rpb24oKXt9fX0sT2JqZWN0LmRlZmluZVByb3BlcnR5KHp0LFwicG9pbnRlckV4dGVuZFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBZdC5kZWZhdWx0fX0pO3ZhciBDdD1CdChDKSxXdD1CdChEKSxSdD1MdCgkKSxGdD1CdChFdCksWHQ9THQodyksWXQ9QnQoVHQpO2Z1bmN0aW9uIE50KCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gTnQ9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBMdCh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1BdCh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1OdCgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIEJ0KHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBWdCh0KXtyZXR1cm4gdCBpbnN0YW5jZW9mIFd0LmRlZmF1bHQuRXZlbnR8fHQgaW5zdGFuY2VvZiBXdC5kZWZhdWx0LlRvdWNofWZ1bmN0aW9uIHF0KHQsZSxuKXtyZXR1cm4obj1ufHx7fSkueD1lWyh0PXR8fFwicGFnZVwiKStcIlhcIl0sbi55PWVbdCtcIllcIl0sbn1mdW5jdGlvbiBVdCh0LGUpe3JldHVybiBlPWV8fHt4OjAseTowfSxDdC5kZWZhdWx0LmlzT3BlcmFNb2JpbGUmJlZ0KHQpPyhxdChcInNjcmVlblwiLHQsZSksZS54Kz13aW5kb3cuc2Nyb2xsWCxlLnkrPXdpbmRvdy5zY3JvbGxZKTpxdChcInBhZ2VcIix0LGUpLGV9ZnVuY3Rpb24gR3QodCxlKXtyZXR1cm4gZT1lfHx7fSxDdC5kZWZhdWx0LmlzT3BlcmFNb2JpbGUmJlZ0KHQpP3F0KFwic2NyZWVuXCIsdCxlKTpxdChcImNsaWVudFwiLHQsZSksZX1mdW5jdGlvbiBIdCh0KXt2YXIgZT1bXTtyZXR1cm4gWHQuYXJyYXkodCk/KGVbMF09dFswXSxlWzFdPXRbMV0pOlwidG91Y2hlbmRcIj09PXQudHlwZT8xPT09dC50b3VjaGVzLmxlbmd0aD8oZVswXT10LnRvdWNoZXNbMF0sZVsxXT10LmNoYW5nZWRUb3VjaGVzWzBdKTowPT09dC50b3VjaGVzLmxlbmd0aCYmKGVbMF09dC5jaGFuZ2VkVG91Y2hlc1swXSxlWzFdPXQuY2hhbmdlZFRvdWNoZXNbMV0pOihlWzBdPXQudG91Y2hlc1swXSxlWzFdPXQudG91Y2hlc1sxXSksZX1mdW5jdGlvbiBLdCh0KXtmb3IodmFyIGU9e3BhZ2VYOjAscGFnZVk6MCxjbGllbnRYOjAsY2xpZW50WTowLHNjcmVlblg6MCxzY3JlZW5ZOjB9LG49MDtuPHQubGVuZ3RoO24rKyl7dmFyIHI9dFtuXTtmb3IodmFyIG8gaW4gZSllW29dKz1yW29dfWZvcih2YXIgaSBpbiBlKWVbaV0vPXQubGVuZ3RoO3JldHVybiBlfXZhciAkdD17fTtmdW5jdGlvbiBadCh0KXtyZXR1cm4oWnQ9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSgkdCxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSwkdC5nZXRTdHJpbmdPcHRpb25SZXN1bHQ9bmUsJHQucmVzb2x2ZVJlY3RMaWtlPWZ1bmN0aW9uKHQsZSxuLHIpe3ZhciBvPXQ7dGUuc3RyaW5nKG8pP289bmUobyxlLG4pOnRlLmZ1bmMobykmJihvPW8uYXBwbHkodm9pZCAwLGZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbih0KXtpZihBcnJheS5pc0FycmF5KHQpKXtmb3IodmFyIGU9MCxuPW5ldyBBcnJheSh0Lmxlbmd0aCk7ZTx0Lmxlbmd0aDtlKyspbltlXT10W2VdO3JldHVybiBufX0odCl8fGZ1bmN0aW9uKHQpe2lmKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodCl8fFwiW29iamVjdCBBcmd1bWVudHNdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkpcmV0dXJuIEFycmF5LmZyb20odCl9KHQpfHxmdW5jdGlvbigpe3Rocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gc3ByZWFkIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKX0oKX0ocikpKTt0ZS5lbGVtZW50KG8pJiYobz0oMCwkLmdldEVsZW1lbnRSZWN0KShvKSk7cmV0dXJuIG99LCR0LnJlY3RUb1hZPWZ1bmN0aW9uKHQpe3JldHVybiB0JiZ7eDpcInhcImluIHQ/dC54OnQubGVmdCx5OlwieVwiaW4gdD90Lnk6dC50b3B9fSwkdC54eXdoVG9UbGJyPWZ1bmN0aW9uKHQpeyF0fHxcImxlZnRcImluIHQmJlwidG9wXCJpbiB0fHwoKHQ9KDAsUXQuZGVmYXVsdCkoe30sdCkpLmxlZnQ9dC54fHwwLHQudG9wPXQueXx8MCx0LnJpZ2h0PXQucmlnaHR8fHQubGVmdCt0LndpZHRoLHQuYm90dG9tPXQuYm90dG9tfHx0LnRvcCt0LmhlaWdodCk7cmV0dXJuIHR9LCR0LnRsYnJUb1h5d2g9ZnVuY3Rpb24odCl7IXR8fFwieFwiaW4gdCYmXCJ5XCJpbiB0fHwoKHQ9KDAsUXQuZGVmYXVsdCkoe30sdCkpLng9dC5sZWZ0fHwwLHQueT10LnRvcHx8MCx0LndpZHRoPXQud2lkdGh8fHQucmlnaHR8fDAtdC54LHQuaGVpZ2h0PXQuaGVpZ2h0fHx0LmJvdHRvbXx8MC10LnkpO3JldHVybiB0fSwkdC5hZGRFZGdlcz1mdW5jdGlvbih0LGUsbil7dC5sZWZ0JiYoZS5sZWZ0Kz1uLngpO3QucmlnaHQmJihlLnJpZ2h0Kz1uLngpO3QudG9wJiYoZS50b3ArPW4ueSk7dC5ib3R0b20mJihlLmJvdHRvbSs9bi55KTtlLndpZHRoPWUucmlnaHQtZS5sZWZ0LGUuaGVpZ2h0PWUuYm90dG9tLWUudG9wfTt2YXIgSnQsUXQ9KEp0PWN0KSYmSnQuX19lc01vZHVsZT9KdDp7ZGVmYXVsdDpKdH0sdGU9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09WnQodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9ZWUoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0odyk7ZnVuY3Rpb24gZWUoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBlZT1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIG5lKHQsZSxuKXtyZXR1cm5cInBhcmVudFwiPT09dD8oMCwkLnBhcmVudE5vZGUpKG4pOlwic2VsZlwiPT09dD9lLmdldFJlY3Qobik6KDAsJC5jbG9zZXN0KShuLHQpfXZhciByZT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkocmUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSkscmUuZGVmYXVsdD1mdW5jdGlvbih0LGUsbil7dmFyIHI9dC5vcHRpb25zW25dLG89ciYmci5vcmlnaW58fHQub3B0aW9ucy5vcmlnaW4saT0oMCwkdC5yZXNvbHZlUmVjdExpa2UpKG8sdCxlLFt0JiZlXSk7cmV0dXJuKDAsJHQucmVjdFRvWFkpKGkpfHx7eDowLHk6MH19O3ZhciBvZT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkob2UsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksb2UuZGVmYXVsdD12b2lkIDA7dmFyIGllLGFlLHVlPTA7dmFyIHNlPXtyZXF1ZXN0OmZ1bmN0aW9uKHQpe3JldHVybiBpZSh0KX0sY2FuY2VsOmZ1bmN0aW9uKHQpe3JldHVybiBhZSh0KX0saW5pdDpmdW5jdGlvbih0KXtpZihpZT10LnJlcXVlc3RBbmltYXRpb25GcmFtZSxhZT10LmNhbmNlbEFuaW1hdGlvbkZyYW1lLCFpZSlmb3IodmFyIGU9W1wibXNcIixcIm1velwiLFwid2Via2l0XCIsXCJvXCJdLG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtpZT10W1wiXCIuY29uY2F0KHIsXCJSZXF1ZXN0QW5pbWF0aW9uRnJhbWVcIildLGFlPXRbXCJcIi5jb25jYXQocixcIkNhbmNlbEFuaW1hdGlvbkZyYW1lXCIpXXx8dFtcIlwiLmNvbmNhdChyLFwiQ2FuY2VsUmVxdWVzdEFuaW1hdGlvbkZyYW1lXCIpXX1pZXx8KGllPWZ1bmN0aW9uKHQpe3ZhciBlPURhdGUubm93KCksbj1NYXRoLm1heCgwLDE2LShlLXVlKSkscj1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7dChlK24pfSxuKTtyZXR1cm4gdWU9ZStuLHJ9LGFlPWZ1bmN0aW9uKHQpe3JldHVybiBjbGVhclRpbWVvdXQodCl9KX19O29lLmRlZmF1bHQ9c2U7dmFyIGxlPXt9O2Z1bmN0aW9uIGNlKHQpe3JldHVybihjZT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGxlLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGxlLndhcm5PbmNlPWZ1bmN0aW9uKHQsZSl7dmFyIG49ITE7cmV0dXJuIGZ1bmN0aW9uKCl7cmV0dXJuIG58fChoZS5kZWZhdWx0LndpbmRvdy5jb25zb2xlLndhcm4oZSksbj0hMCksdC5hcHBseSh0aGlzLGFyZ3VtZW50cyl9fSxsZS5jb3B5QWN0aW9uPWZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQubmFtZT1lLm5hbWUsdC5heGlzPWUuYXhpcyx0LmVkZ2VzPWUuZWRnZXMsdH0sT2JqZWN0LmRlZmluZVByb3BlcnR5KGxlLFwid2luXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGhlLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGxlLFwiYnJvd3NlclwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBnZS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcImNsb25lXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIGJlLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGxlLFwiZXh0ZW5kXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG1lLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGxlLFwiZ2V0T3JpZ2luWFlcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gT2UuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkobGUsXCJoeXBvdFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB3ZS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcIm5vcm1hbGl6ZUxpc3RlbmVyc1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBfZS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShsZSxcInJhZlwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBQZS5kZWZhdWx0fX0pLGxlLnJlY3Q9bGUucG9pbnRlcj1sZS5pcz1sZS5kb209bGUuYXJyPXZvaWQgMDt2YXIgZmU9amUoUyk7bGUuYXJyPWZlO3ZhciBwZT1qZSgkKTtsZS5kb209cGU7dmFyIGRlPWplKHcpO2xlLmlzPWRlO3ZhciB2ZT1qZSh6dCk7bGUucG9pbnRlcj12ZTt2YXIgeWU9amUoJHQpO2xlLnJlY3Q9eWU7dmFyIGhlPXhlKE8pLGdlPXhlKEMpLGJlPXhlKFYpLG1lPXhlKGN0KSxPZT14ZShyZSksd2U9eGUoRXQpLF9lPXhlKGZ0KSxQZT14ZShvZSk7ZnVuY3Rpb24geGUodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIFNlKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gU2U9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBqZSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1jZSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1TZSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufXZhciBNZT17fTtmdW5jdGlvbiBrZSh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gRWUodCxlLG4pe3JldHVybiBlJiZrZSh0LnByb3RvdHlwZSxlKSxuJiZrZSh0LG4pLHR9ZnVuY3Rpb24gVGUodCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fU9iamVjdC5kZWZpbmVQcm9wZXJ0eShNZSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxNZS5kZWZhdWx0PU1lLkJhc2VFdmVudD12b2lkIDA7dmFyIERlPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGUpLFRlKHRoaXMsXCJ0eXBlXCIsdm9pZCAwKSxUZSh0aGlzLFwidGFyZ2V0XCIsdm9pZCAwKSxUZSh0aGlzLFwiY3VycmVudFRhcmdldFwiLHZvaWQgMCksVGUodGhpcyxcImludGVyYWN0YWJsZVwiLHZvaWQgMCksVGUodGhpcyxcIl9pbnRlcmFjdGlvblwiLHZvaWQgMCksVGUodGhpcyxcInRpbWVTdGFtcFwiLHZvaWQgMCksVGUodGhpcyxcImltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZFwiLCExKSxUZSh0aGlzLFwicHJvcGFnYXRpb25TdG9wcGVkXCIsITEpLHRoaXMuX2ludGVyYWN0aW9uPXR9cmV0dXJuIEVlKGUsW3trZXk6XCJpbnRlcmFjdGlvblwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLl9pbnRlcmFjdGlvbi5fcHJveHl9fV0pLEVlKGUsW3trZXk6XCJwcmV2ZW50RGVmYXVsdFwiLHZhbHVlOmZ1bmN0aW9uKCl7fX0se2tleTpcInN0b3BQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQ9ITB9fSx7a2V5Olwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZD10aGlzLnByb3BhZ2F0aW9uU3RvcHBlZD0hMH19XSksZX0oKSxJZT1NZS5CYXNlRXZlbnQ9RGU7TWUuZGVmYXVsdD1JZTt2YXIgemU9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHplLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHplLmRlZmF1bHQ9emUuZGVmYXVsdHM9dm9pZCAwO3ZhciBBZT17YmFzZTp7cHJldmVudERlZmF1bHQ6XCJhdXRvXCIsZGVsdGFTb3VyY2U6XCJwYWdlXCJ9LHBlckFjdGlvbjp7ZW5hYmxlZDohMSxvcmlnaW46e3g6MCx5OjB9fSxhY3Rpb25zOnt9fSxDZT16ZS5kZWZhdWx0cz1BZTt6ZS5kZWZhdWx0PUNlO3ZhciBXZT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoV2UsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksV2UuZGVmYXVsdD1XZS5JbnRlcmFjdEV2ZW50PXZvaWQgMDt2YXIgUmU9TGUoY3QpLEZlPUxlKHJlKSxYZT1MZShFdCksWWU9TGUoTWUpLE5lPUxlKHplKTtmdW5jdGlvbiBMZSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gQmUodCl7cmV0dXJuKEJlPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1mdW5jdGlvbiBWZSh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gcWUodCl7cmV0dXJuKHFlPU9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3QuZ2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24odCl7cmV0dXJuIHQuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YodCl9KSh0KX1mdW5jdGlvbiBVZSh0KXtpZih2b2lkIDA9PT10KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4gdH1mdW5jdGlvbiBHZSh0LGUpe3JldHVybihHZT1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuX19wcm90b19fPWUsdH0pKHQsZSl9ZnVuY3Rpb24gSGUodCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBLZT1mdW5jdGlvbigpe2Z1bmN0aW9uIGcodCxlLG4scixvLGksYSl7dmFyIHUscyxsOyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsZykscz10aGlzLHU9IShsPXFlKGcpLmNhbGwodGhpcyx0KSl8fFwib2JqZWN0XCIhPT1CZShsKSYmXCJmdW5jdGlvblwiIT10eXBlb2YgbD9VZShzKTpsLEhlKFVlKHUpLFwidGFyZ2V0XCIsdm9pZCAwKSxIZShVZSh1KSxcImN1cnJlbnRUYXJnZXRcIix2b2lkIDApLEhlKFVlKHUpLFwicmVsYXRlZFRhcmdldFwiLG51bGwpLEhlKFVlKHUpLFwic2NyZWVuWFwiLHZvaWQgMCksSGUoVWUodSksXCJzY3JlZW5ZXCIsdm9pZCAwKSxIZShVZSh1KSxcImJ1dHRvblwiLHZvaWQgMCksSGUoVWUodSksXCJidXR0b25zXCIsdm9pZCAwKSxIZShVZSh1KSxcImN0cmxLZXlcIix2b2lkIDApLEhlKFVlKHUpLFwic2hpZnRLZXlcIix2b2lkIDApLEhlKFVlKHUpLFwiYWx0S2V5XCIsdm9pZCAwKSxIZShVZSh1KSxcIm1ldGFLZXlcIix2b2lkIDApLEhlKFVlKHUpLFwicGFnZVwiLHZvaWQgMCksSGUoVWUodSksXCJjbGllbnRcIix2b2lkIDApLEhlKFVlKHUpLFwiZGVsdGFcIix2b2lkIDApLEhlKFVlKHUpLFwicmVjdFwiLHZvaWQgMCksSGUoVWUodSksXCJ4MFwiLHZvaWQgMCksSGUoVWUodSksXCJ5MFwiLHZvaWQgMCksSGUoVWUodSksXCJ0MFwiLHZvaWQgMCksSGUoVWUodSksXCJkdFwiLHZvaWQgMCksSGUoVWUodSksXCJkdXJhdGlvblwiLHZvaWQgMCksSGUoVWUodSksXCJjbGllbnRYMFwiLHZvaWQgMCksSGUoVWUodSksXCJjbGllbnRZMFwiLHZvaWQgMCksSGUoVWUodSksXCJ2ZWxvY2l0eVwiLHZvaWQgMCksSGUoVWUodSksXCJzcGVlZFwiLHZvaWQgMCksSGUoVWUodSksXCJzd2lwZVwiLHZvaWQgMCksSGUoVWUodSksXCJ0aW1lU3RhbXBcIix2b2lkIDApLEhlKFVlKHUpLFwiZHJhZ0VudGVyXCIsdm9pZCAwKSxIZShVZSh1KSxcImRyYWdMZWF2ZVwiLHZvaWQgMCksSGUoVWUodSksXCJheGVzXCIsdm9pZCAwKSxIZShVZSh1KSxcInByZUVuZFwiLHZvaWQgMCksbz1vfHx0LmVsZW1lbnQ7dmFyIGM9dC5pbnRlcmFjdGFibGUsZj0oYyYmYy5vcHRpb25zfHxOZS5kZWZhdWx0KS5kZWx0YVNvdXJjZSxwPSgwLEZlLmRlZmF1bHQpKGMsbyxuKSxkPVwic3RhcnRcIj09PXIsdj1cImVuZFwiPT09cix5PWQ/VWUodSk6dC5wcmV2RXZlbnQsaD1kP3QuY29vcmRzLnN0YXJ0OnY/e3BhZ2U6eS5wYWdlLGNsaWVudDp5LmNsaWVudCx0aW1lU3RhbXA6dC5jb29yZHMuY3VyLnRpbWVTdGFtcH06dC5jb29yZHMuY3VyO3JldHVybiB1LnBhZ2U9KDAsUmUuZGVmYXVsdCkoe30saC5wYWdlKSx1LmNsaWVudD0oMCxSZS5kZWZhdWx0KSh7fSxoLmNsaWVudCksdS5yZWN0PSgwLFJlLmRlZmF1bHQpKHt9LHQucmVjdCksdS50aW1lU3RhbXA9aC50aW1lU3RhbXAsdnx8KHUucGFnZS54LT1wLngsdS5wYWdlLnktPXAueSx1LmNsaWVudC54LT1wLngsdS5jbGllbnQueS09cC55KSx1LmN0cmxLZXk9ZS5jdHJsS2V5LHUuYWx0S2V5PWUuYWx0S2V5LHUuc2hpZnRLZXk9ZS5zaGlmdEtleSx1Lm1ldGFLZXk9ZS5tZXRhS2V5LHUuYnV0dG9uPWUuYnV0dG9uLHUuYnV0dG9ucz1lLmJ1dHRvbnMsdS50YXJnZXQ9byx1LmN1cnJlbnRUYXJnZXQ9byx1LnByZUVuZD1pLHUudHlwZT1hfHxuKyhyfHxcIlwiKSx1LmludGVyYWN0YWJsZT1jLHUudDA9ZD90LnBvaW50ZXJzW3QucG9pbnRlcnMubGVuZ3RoLTFdLmRvd25UaW1lOnkudDAsdS54MD10LmNvb3Jkcy5zdGFydC5wYWdlLngtcC54LHUueTA9dC5jb29yZHMuc3RhcnQucGFnZS55LXAueSx1LmNsaWVudFgwPXQuY29vcmRzLnN0YXJ0LmNsaWVudC54LXAueCx1LmNsaWVudFkwPXQuY29vcmRzLnN0YXJ0LmNsaWVudC55LXAueSx1LmRlbHRhPWR8fHY/e3g6MCx5OjB9Ont4OnVbZl0ueC15W2ZdLngseTp1W2ZdLnkteVtmXS55fSx1LmR0PXQuY29vcmRzLmRlbHRhLnRpbWVTdGFtcCx1LmR1cmF0aW9uPXUudGltZVN0YW1wLXUudDAsdS52ZWxvY2l0eT0oMCxSZS5kZWZhdWx0KSh7fSx0LmNvb3Jkcy52ZWxvY2l0eVtmXSksdS5zcGVlZD0oMCxYZS5kZWZhdWx0KSh1LnZlbG9jaXR5LngsdS52ZWxvY2l0eS55KSx1LnN3aXBlPXZ8fFwiaW5lcnRpYXN0YXJ0XCI9PT1yP3UuZ2V0U3dpcGUoKTpudWxsLHV9dmFyIHQsZSxuO3JldHVybiBmdW5jdGlvbih0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmR2UodCxlKX0oZyxZZVtcImRlZmF1bHRcIl0pLHQ9ZywoZT1be2tleTpcImdldFN3aXBlXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLl9pbnRlcmFjdGlvbjtpZih0LnByZXZFdmVudC5zcGVlZDw2MDB8fDE1MDx0aGlzLnRpbWVTdGFtcC10LnByZXZFdmVudC50aW1lU3RhbXApcmV0dXJuIG51bGw7dmFyIGU9MTgwKk1hdGguYXRhbjIodC5wcmV2RXZlbnQudmVsb2NpdHlZLHQucHJldkV2ZW50LnZlbG9jaXR5WCkvTWF0aC5QSTtlPDAmJihlKz0zNjApO3ZhciBuPTExMi41PD1lJiZlPDI0Ny41LHI9MjAyLjU8PWUmJmU8MzM3LjU7cmV0dXJue3VwOnIsZG93bjohciYmMjIuNTw9ZSYmZTwxNTcuNSxsZWZ0Om4scmlnaHQ6IW4mJigyOTIuNTw9ZXx8ZTw2Ny41KSxhbmdsZTplLHNwZWVkOnQucHJldkV2ZW50LnNwZWVkLHZlbG9jaXR5Ont4OnQucHJldkV2ZW50LnZlbG9jaXR5WCx5OnQucHJldkV2ZW50LnZlbG9jaXR5WX19fX0se2tleTpcInByZXZlbnREZWZhdWx0XCIsdmFsdWU6ZnVuY3Rpb24oKXt9fSx7a2V5Olwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZD10aGlzLnByb3BhZ2F0aW9uU3RvcHBlZD0hMH19LHtrZXk6XCJzdG9wUHJvcGFnYXRpb25cIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMucHJvcGFnYXRpb25TdG9wcGVkPSEwfX0se2tleTpcInBhZ2VYXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMucGFnZS54fSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5wYWdlLng9dH19LHtrZXk6XCJwYWdlWVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLnBhZ2UueX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMucGFnZS55PXR9fSx7a2V5OlwiY2xpZW50WFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmNsaWVudC54fSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy5jbGllbnQueD10fX0se2tleTpcImNsaWVudFlcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5jbGllbnQueX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMuY2xpZW50Lnk9dH19LHtrZXk6XCJkeFwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRlbHRhLnh9LHNldDpmdW5jdGlvbih0KXt0aGlzLmRlbHRhLng9dH19LHtrZXk6XCJkeVwiLGdldDpmdW5jdGlvbigpe3JldHVybiB0aGlzLmRlbHRhLnl9LHNldDpmdW5jdGlvbih0KXt0aGlzLmRlbHRhLnk9dH19LHtrZXk6XCJ2ZWxvY2l0eVhcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy52ZWxvY2l0eS54fSxzZXQ6ZnVuY3Rpb24odCl7dGhpcy52ZWxvY2l0eS54PXR9fSx7a2V5OlwidmVsb2NpdHlZXCIsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMudmVsb2NpdHkueX0sc2V0OmZ1bmN0aW9uKHQpe3RoaXMudmVsb2NpdHkueT10fX1dKSYmVmUodC5wcm90b3R5cGUsZSksbiYmVmUodCxuKSxnfSgpLCRlPVdlLkludGVyYWN0RXZlbnQ9S2U7V2UuZGVmYXVsdD0kZTt2YXIgWmU9e307ZnVuY3Rpb24gSmUodCl7cmV0dXJuKEplPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoWmUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksWmUuZGVmYXVsdD12b2lkIDA7dmFyIFFlLHRuPWFuKFMpLGVuPWFuKCQpLG5uPShRZT1jdCkmJlFlLl9fZXNNb2R1bGU/UWU6e2RlZmF1bHQ6UWV9LHJuPWFuKHcpO2Z1bmN0aW9uIG9uKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gb249ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBhbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1KZSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1vbigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIHVuKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBzbih0LGUsbil7cmV0dXJuIGUgaW4gdD9PYmplY3QuZGVmaW5lUHJvcGVydHkodCxlLHt2YWx1ZTpuLGVudW1lcmFibGU6ITAsY29uZmlndXJhYmxlOiEwLHdyaXRhYmxlOiEwfSk6dFtlXT1uLHR9dmFyIGxuPWZ1bmN0aW9uKCl7ZnVuY3Rpb24gZSh0KXt2YXIgYT10aGlzOyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsZSksdGhpcy5zY29wZT10LHNuKHRoaXMsXCJsaXN0XCIsW10pLHNuKHRoaXMsXCJzZWxlY3Rvck1hcFwiLHt9KSx0LmFkZExpc3RlbmVycyh7XCJpbnRlcmFjdGFibGU6dW5zZXRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0YWJsZSxuPWUudGFyZ2V0LHI9ZS5fY29udGV4dCxvPXJuLnN0cmluZyhuKT9hLnNlbGVjdG9yTWFwW25dOm5bYS5zY29wZS5pZF0saT1vLmZpbmRJbmRleChmdW5jdGlvbih0KXtyZXR1cm4gdC5jb250ZXh0PT09cn0pO29baV0mJihvW2ldLmNvbnRleHQ9bnVsbCxvW2ldLmludGVyYWN0YWJsZT1udWxsKSxvLnNwbGljZShpLDEpfX0pfXZhciB0LG4scjtyZXR1cm4gdD1lLChuPVt7a2V5OlwibmV3XCIsdmFsdWU6ZnVuY3Rpb24odCxlKXtlPSgwLG5uLmRlZmF1bHQpKGV8fHt9LHthY3Rpb25zOnRoaXMuc2NvcGUuYWN0aW9uc30pO3ZhciBuPW5ldyB0aGlzLnNjb3BlLkludGVyYWN0YWJsZSh0LGUsdGhpcy5zY29wZS5kb2N1bWVudCx0aGlzLnNjb3BlLmV2ZW50cykscj17Y29udGV4dDpuLl9jb250ZXh0LGludGVyYWN0YWJsZTpufTtyZXR1cm4gdGhpcy5zY29wZS5hZGREb2N1bWVudChuLl9kb2MpLHRoaXMubGlzdC5wdXNoKG4pLHJuLnN0cmluZyh0KT8odGhpcy5zZWxlY3Rvck1hcFt0XXx8KHRoaXMuc2VsZWN0b3JNYXBbdF09W10pLHRoaXMuc2VsZWN0b3JNYXBbdF0ucHVzaChyKSk6KG4udGFyZ2V0W3RoaXMuc2NvcGUuaWRdfHxPYmplY3QuZGVmaW5lUHJvcGVydHkodCx0aGlzLnNjb3BlLmlkLHt2YWx1ZTpbXSxjb25maWd1cmFibGU6ITB9KSx0W3RoaXMuc2NvcGUuaWRdLnB1c2gocikpLHRoaXMuc2NvcGUuZmlyZShcImludGVyYWN0YWJsZTpuZXdcIix7dGFyZ2V0OnQsb3B0aW9uczplLGludGVyYWN0YWJsZTpuLHdpbjp0aGlzLnNjb3BlLl93aW59KSxufX0se2tleTpcImdldFwiLHZhbHVlOmZ1bmN0aW9uKGUsdCl7dmFyIG49dCYmdC5jb250ZXh0fHx0aGlzLnNjb3BlLmRvY3VtZW50LHI9cm4uc3RyaW5nKGUpLG89cj90aGlzLnNlbGVjdG9yTWFwW2VdOmVbdGhpcy5zY29wZS5pZF07aWYoIW8pcmV0dXJuIG51bGw7dmFyIGk9dG4uZmluZChvLGZ1bmN0aW9uKHQpe3JldHVybiB0LmNvbnRleHQ9PT1uJiYocnx8dC5pbnRlcmFjdGFibGUuaW5Db250ZXh0KGUpKX0pO3JldHVybiBpJiZpLmludGVyYWN0YWJsZX19LHtrZXk6XCJmb3JFYWNoTWF0Y2hcIix2YWx1ZTpmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj0wO248dGhpcy5saXN0Lmxlbmd0aDtuKyspe3ZhciByPXRoaXMubGlzdFtuXSxvPXZvaWQgMDtpZigocm4uc3RyaW5nKHIudGFyZ2V0KT9ybi5lbGVtZW50KHQpJiZlbi5tYXRjaGVzU2VsZWN0b3IodCxyLnRhcmdldCk6dD09PXIudGFyZ2V0KSYmci5pbkNvbnRleHQodCkmJihvPWUocikpLHZvaWQgMCE9PW8pcmV0dXJuIG99fX1dKSYmdW4odC5wcm90b3R5cGUsbiksciYmdW4odCxyKSxlfSgpO1plLmRlZmF1bHQ9bG47dmFyIGNuPXt9O2Z1bmN0aW9uIGZuKHQpe3JldHVybihmbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGNuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGNuLmRlZmF1bHQ9Y24uRmFrZUV2ZW50PXZvaWQgMDt2YXIgcG49T24oUyksZG49T24oJCksdm49Ym4oY3QpLHluPU9uKHcpLGhuPWJuKFR0KSxnbj1Pbih6dCk7ZnVuY3Rpb24gYm4odCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIG1uKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gbW49ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBPbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1mbih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1tbigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIHduKHQsZSl7Zm9yKHZhciBuPTA7bjxlLmxlbmd0aDtuKyspe3ZhciByPWVbbl07ci5lbnVtZXJhYmxlPXIuZW51bWVyYWJsZXx8ITEsci5jb25maWd1cmFibGU9ITAsXCJ2YWx1ZVwiaW4gciYmKHIud3JpdGFibGU9ITApLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LHIua2V5LHIpfX1mdW5jdGlvbiBfbih0LGUpe3JldHVybiBmdW5jdGlvbih0KXtpZihBcnJheS5pc0FycmF5KHQpKXJldHVybiB0fSh0KXx8ZnVuY3Rpb24odCxlKXtpZighKFN5bWJvbC5pdGVyYXRvciBpbiBPYmplY3QodCl8fFwiW29iamVjdCBBcmd1bWVudHNdXCI9PT1PYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwodCkpKXJldHVybjt2YXIgbj1bXSxyPSEwLG89ITEsaT12b2lkIDA7dHJ5e2Zvcih2YXIgYSx1PXRbU3ltYm9sLml0ZXJhdG9yXSgpOyEocj0oYT11Lm5leHQoKSkuZG9uZSkmJihuLnB1c2goYS52YWx1ZSksIWV8fG4ubGVuZ3RoIT09ZSk7cj0hMCk7fWNhdGNoKHQpe289ITAsaT10fWZpbmFsbHl7dHJ5e3J8fG51bGw9PXUucmV0dXJufHx1LnJldHVybigpfWZpbmFsbHl7aWYobyl0aHJvdyBpfX1yZXR1cm4gbn0odCxlKXx8ZnVuY3Rpb24oKXt0aHJvdyBuZXcgVHlwZUVycm9yKFwiSW52YWxpZCBhdHRlbXB0IHRvIGRlc3RydWN0dXJlIG5vbi1pdGVyYWJsZSBpbnN0YW5jZVwiKX0oKX12YXIgUG49ZnVuY3Rpb24oKXtmdW5jdGlvbiBvKHQpe3ZhciBlLG4scjshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLG8pLHRoaXMub3JpZ2luYWxFdmVudD10LHI9dm9pZCAwLChuPVwiY3VycmVudFRhcmdldFwiKWluKGU9dGhpcyk/T2JqZWN0LmRlZmluZVByb3BlcnR5KGUsbix7dmFsdWU6cixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOmVbbl09ciwoMCxobi5kZWZhdWx0KSh0aGlzLHQpfXZhciB0LGUsbjtyZXR1cm4gdD1vLChlPVt7a2V5OlwicHJldmVudE9yaWdpbmFsRGVmYXVsdFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5vcmlnaW5hbEV2ZW50LnByZXZlbnREZWZhdWx0KCl9fSx7a2V5Olwic3RvcFByb3BhZ2F0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcFByb3BhZ2F0aW9uKCl9fSx7a2V5Olwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9yaWdpbmFsRXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCl9fV0pJiZ3bih0LnByb3RvdHlwZSxlKSxuJiZ3bih0LG4pLG99KCk7ZnVuY3Rpb24geG4odCl7aWYoIXluLm9iamVjdCh0KSlyZXR1cm57Y2FwdHVyZTohIXQscGFzc2l2ZTohMX07dmFyIGU9KDAsdm4uZGVmYXVsdCkoe30sdCk7cmV0dXJuIGUuY2FwdHVyZT0hIXQuY2FwdHVyZSxlLnBhc3NpdmU9ISF0LnBhc3NpdmUsZX1jbi5GYWtlRXZlbnQ9UG47dmFyIFNuPXtpZDpcImV2ZW50c1wiLGluc3RhbGw6ZnVuY3Rpb24odCl7dmFyIGY9W10sYj17fSxjPVtdLHA9e2FkZDpkLHJlbW92ZTpnLGFkZERlbGVnYXRlOmZ1bmN0aW9uKGUsbix0LHIsbyl7dmFyIGk9eG4obyk7aWYoIWJbdF0pe2JbdF09W107Zm9yKHZhciBhPTA7YTxjLmxlbmd0aDthKyspe3ZhciB1PWNbYV07ZCh1LHQsbSksZCh1LHQsTywhMCl9fXZhciBzPWJbdF0sbD1wbi5maW5kKHMsZnVuY3Rpb24odCl7cmV0dXJuIHQuc2VsZWN0b3I9PT1lJiZ0LmNvbnRleHQ9PT1ufSk7bHx8KGw9e3NlbGVjdG9yOmUsY29udGV4dDpuLGxpc3RlbmVyczpbXX0scy5wdXNoKGwpKTtsLmxpc3RlbmVycy5wdXNoKFtyLGldKX0scmVtb3ZlRGVsZWdhdGU6ZnVuY3Rpb24odCxlLG4scixvKXt2YXIgaSxhPXhuKG8pLHU9YltuXSxzPSExO2lmKCF1KXJldHVybjtmb3IoaT11Lmxlbmd0aC0xOzA8PWk7aS0tKXt2YXIgbD11W2ldO2lmKGwuc2VsZWN0b3I9PT10JiZsLmNvbnRleHQ9PT1lKXtmb3IodmFyIGM9bC5saXN0ZW5lcnMsZj1jLmxlbmd0aC0xOzA8PWY7Zi0tKXt2YXIgcD1fbihjW2ZdLDIpLGQ9cFswXSx2PXBbMV0seT12LmNhcHR1cmUsaD12LnBhc3NpdmU7aWYoZD09PXImJnk9PT1hLmNhcHR1cmUmJmg9PT1hLnBhc3NpdmUpe2Muc3BsaWNlKGYsMSksYy5sZW5ndGh8fCh1LnNwbGljZShpLDEpLGcoZSxuLG0pLGcoZSxuLE8sITApKSxzPSEwO2JyZWFrfX1pZihzKWJyZWFrfX19LGRlbGVnYXRlTGlzdGVuZXI6bSxkZWxlZ2F0ZVVzZUNhcHR1cmU6TyxkZWxlZ2F0ZWRFdmVudHM6Yixkb2N1bWVudHM6Yyx0YXJnZXRzOmYsc3VwcG9ydHNPcHRpb25zOiExLHN1cHBvcnRzUGFzc2l2ZTohMX07ZnVuY3Rpb24gZChlLHQsbixyKXt2YXIgbz14bihyKSxpPXBuLmZpbmQoZixmdW5jdGlvbih0KXtyZXR1cm4gdC5ldmVudFRhcmdldD09PWV9KTtpfHwoaT17ZXZlbnRUYXJnZXQ6ZSxldmVudHM6e319LGYucHVzaChpKSksaS5ldmVudHNbdF18fChpLmV2ZW50c1t0XT1bXSksZS5hZGRFdmVudExpc3RlbmVyJiYhcG4uY29udGFpbnMoaS5ldmVudHNbdF0sbikmJihlLmFkZEV2ZW50TGlzdGVuZXIodCxuLHAuc3VwcG9ydHNPcHRpb25zP286by5jYXB0dXJlKSxpLmV2ZW50c1t0XS5wdXNoKG4pKX1mdW5jdGlvbiBnKGUsdCxuLHIpe3ZhciBvPXhuKHIpLGk9cG4uZmluZEluZGV4KGYsZnVuY3Rpb24odCl7cmV0dXJuIHQuZXZlbnRUYXJnZXQ9PT1lfSksYT1mW2ldO2lmKGEmJmEuZXZlbnRzKWlmKFwiYWxsXCIhPT10KXt2YXIgdT0hMSxzPWEuZXZlbnRzW3RdO2lmKHMpe2lmKFwiYWxsXCI9PT1uKXtmb3IodmFyIGw9cy5sZW5ndGgtMTswPD1sO2wtLSlnKGUsdCxzW2xdLG8pO3JldHVybn1mb3IodmFyIGM9MDtjPHMubGVuZ3RoO2MrKylpZihzW2NdPT09bil7ZS5yZW1vdmVFdmVudExpc3RlbmVyKHQsbixwLnN1cHBvcnRzT3B0aW9ucz9vOm8uY2FwdHVyZSkscy5zcGxpY2UoYywxKSwwPT09cy5sZW5ndGgmJihkZWxldGUgYS5ldmVudHNbdF0sdT0hMCk7YnJlYWt9fXUmJiFPYmplY3Qua2V5cyhhLmV2ZW50cykubGVuZ3RoJiZmLnNwbGljZShpLDEpfWVsc2UgZm9yKHQgaW4gYS5ldmVudHMpYS5ldmVudHMuaGFzT3duUHJvcGVydHkodCkmJmcoZSx0LFwiYWxsXCIpfWZ1bmN0aW9uIG0odCxlKXtmb3IodmFyIG49eG4oZSkscj1uZXcgUG4odCksbz1iW3QudHlwZV0saT1fbihnbi5nZXRFdmVudFRhcmdldHModCksMSlbMF0sYT1pO3luLmVsZW1lbnQoYSk7KXtmb3IodmFyIHU9MDt1PG8ubGVuZ3RoO3UrKyl7dmFyIHM9b1t1XSxsPXMuc2VsZWN0b3IsYz1zLmNvbnRleHQ7aWYoZG4ubWF0Y2hlc1NlbGVjdG9yKGEsbCkmJmRuLm5vZGVDb250YWlucyhjLGkpJiZkbi5ub2RlQ29udGFpbnMoYyxhKSl7dmFyIGY9cy5saXN0ZW5lcnM7ci5jdXJyZW50VGFyZ2V0PWE7Zm9yKHZhciBwPTA7cDxmLmxlbmd0aDtwKyspe3ZhciBkPV9uKGZbcF0sMiksdj1kWzBdLHk9ZFsxXSxoPXkuY2FwdHVyZSxnPXkucGFzc2l2ZTtoPT09bi5jYXB0dXJlJiZnPT09bi5wYXNzaXZlJiZ2KHIpfX19YT1kbi5wYXJlbnROb2RlKGEpfX1mdW5jdGlvbiBPKHQpe3JldHVybiBtLmNhbGwodGhpcyx0LCEwKX1yZXR1cm4gdC5kb2N1bWVudC5jcmVhdGVFbGVtZW50KFwiZGl2XCIpLmFkZEV2ZW50TGlzdGVuZXIoXCJ0ZXN0XCIsbnVsbCx7Z2V0IGNhcHR1cmUoKXtyZXR1cm4gcC5zdXBwb3J0c09wdGlvbnM9ITB9LGdldCBwYXNzaXZlKCl7cmV0dXJuIHAuc3VwcG9ydHNQYXNzaXZlPSEwfX0pLHQuZXZlbnRzPXB9fTtjbi5kZWZhdWx0PVNuO3ZhciBqbj17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoam4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksam4uZGVmYXVsdD1qbi5Qb2ludGVySW5mbz12b2lkIDA7ZnVuY3Rpb24gTW4odCxlLG4scixvKXshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLE1uKSx0aGlzLmlkPXQsdGhpcy5wb2ludGVyPWUsdGhpcy5ldmVudD1uLHRoaXMuZG93blRpbWU9cix0aGlzLmRvd25UYXJnZXQ9b312YXIga249am4uUG9pbnRlckluZm89TW47am4uZGVmYXVsdD1rbjt2YXIgRW49e307ZnVuY3Rpb24gVG4odCl7cmV0dXJuKFRuPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoRW4sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KEVuLFwiUG9pbnRlckluZm9cIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gUm4uZGVmYXVsdH19KSxFbi5kZWZhdWx0PUVuLkludGVyYWN0aW9uPUVuLl9Qcm94eU1ldGhvZHM9RW4uX1Byb3h5VmFsdWVzPXZvaWQgMDt2YXIgRG4sSW4sem4sQW4sQ249ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09VG4odCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9WG4oKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0obGUpLFduPUZuKFdlKSxSbj1Gbihqbik7ZnVuY3Rpb24gRm4odCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fWZ1bmN0aW9uIFhuKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gWG49ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBZbih0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gTm4odCxlLG4pe3JldHVybiBlJiZZbih0LnByb3RvdHlwZSxlKSxuJiZZbih0LG4pLHR9ZnVuY3Rpb24gTG4odCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fUVuLl9Qcm94eVZhbHVlcz1EbiwoSW49RG58fChFbi5fUHJveHlWYWx1ZXM9RG49e30pKS5pbnRlcmFjdGFibGU9XCJcIixJbi5lbGVtZW50PVwiXCIsSW4ucHJlcGFyZWQ9XCJcIixJbi5wb2ludGVySXNEb3duPVwiXCIsSW4ucG9pbnRlcldhc01vdmVkPVwiXCIsSW4uX3Byb3h5PVwiXCIsRW4uX1Byb3h5TWV0aG9kcz16biwoQW49em58fChFbi5fUHJveHlNZXRob2RzPXpuPXt9KSkuc3RhcnQ9XCJcIixBbi5tb3ZlPVwiXCIsQW4uZW5kPVwiXCIsQW4uc3RvcD1cIlwiLEFuLmludGVyYWN0aW5nPVwiXCI7dmFyIEJuPTAsVm49ZnVuY3Rpb24oKXtmdW5jdGlvbiBsKHQpe3ZhciBlPXRoaXMsbj10LnBvaW50ZXJUeXBlLHI9dC5zY29wZUZpcmU7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxsKSxMbih0aGlzLFwiaW50ZXJhY3RhYmxlXCIsbnVsbCksTG4odGhpcyxcImVsZW1lbnRcIixudWxsKSxMbih0aGlzLFwicmVjdFwiLHZvaWQgMCksTG4odGhpcyxcIl9yZWN0c1wiLHZvaWQgMCksTG4odGhpcyxcImVkZ2VzXCIsdm9pZCAwKSxMbih0aGlzLFwiX3Njb3BlRmlyZVwiLHZvaWQgMCksTG4odGhpcyxcInByZXBhcmVkXCIse25hbWU6bnVsbCxheGlzOm51bGwsZWRnZXM6bnVsbH0pLExuKHRoaXMsXCJwb2ludGVyVHlwZVwiLHZvaWQgMCksTG4odGhpcyxcInBvaW50ZXJzXCIsW10pLExuKHRoaXMsXCJkb3duRXZlbnRcIixudWxsKSxMbih0aGlzLFwiZG93blBvaW50ZXJcIix7fSksTG4odGhpcyxcIl9sYXRlc3RQb2ludGVyXCIse3BvaW50ZXI6bnVsbCxldmVudDpudWxsLGV2ZW50VGFyZ2V0Om51bGx9KSxMbih0aGlzLFwicHJldkV2ZW50XCIsbnVsbCksTG4odGhpcyxcInBvaW50ZXJJc0Rvd25cIiwhMSksTG4odGhpcyxcInBvaW50ZXJXYXNNb3ZlZFwiLCExKSxMbih0aGlzLFwiX2ludGVyYWN0aW5nXCIsITEpLExuKHRoaXMsXCJfZW5kaW5nXCIsITEpLExuKHRoaXMsXCJfc3RvcHBlZFwiLCEwKSxMbih0aGlzLFwiX3Byb3h5XCIsbnVsbCksTG4odGhpcyxcInNpbXVsYXRpb25cIixudWxsKSxMbih0aGlzLFwiZG9Nb3ZlXCIsQ24ud2Fybk9uY2UoZnVuY3Rpb24odCl7dGhpcy5tb3ZlKHQpfSxcIlRoZSBpbnRlcmFjdGlvbi5kb01vdmUoKSBtZXRob2QgaGFzIGJlZW4gcmVuYW1lZCB0byBpbnRlcmFjdGlvbi5tb3ZlKClcIikpLExuKHRoaXMsXCJjb29yZHNcIix7c3RhcnQ6Q24ucG9pbnRlci5uZXdDb29yZHMoKSxwcmV2OkNuLnBvaW50ZXIubmV3Q29vcmRzKCksY3VyOkNuLnBvaW50ZXIubmV3Q29vcmRzKCksZGVsdGE6Q24ucG9pbnRlci5uZXdDb29yZHMoKSx2ZWxvY2l0eTpDbi5wb2ludGVyLm5ld0Nvb3JkcygpfSksTG4odGhpcyxcIl9pZFwiLEJuKyspLHRoaXMuX3Njb3BlRmlyZT1yLHRoaXMucG9pbnRlclR5cGU9bjt2YXIgbz10aGlzO3RoaXMuX3Byb3h5PXt9O2Z1bmN0aW9uIGkodCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUuX3Byb3h5LHQse2dldDpmdW5jdGlvbigpe3JldHVybiBvW3RdfX0pfWZvcih2YXIgYSBpbiBEbilpKGEpO2Z1bmN0aW9uIHUodCl7T2JqZWN0LmRlZmluZVByb3BlcnR5KGUuX3Byb3h5LHQse3ZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIG9bdF0uYXBwbHkobyxhcmd1bWVudHMpfX0pfWZvcih2YXIgcyBpbiB6bil1KHMpO3RoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczpuZXdcIix7aW50ZXJhY3Rpb246dGhpc30pfXJldHVybiBObihsLFt7a2V5OlwicG9pbnRlck1vdmVUb2xlcmFuY2VcIixnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gMX19XSksTm4obCxbe2tleTpcInBvaW50ZXJEb3duXCIsdmFsdWU6ZnVuY3Rpb24odCxlLG4pe3ZhciByPXRoaXMudXBkYXRlUG9pbnRlcih0LGUsbiwhMCksbz10aGlzLnBvaW50ZXJzW3JdO3RoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczpkb3duXCIse3BvaW50ZXI6dCxldmVudDplLGV2ZW50VGFyZ2V0Om4scG9pbnRlckluZGV4OnIscG9pbnRlckluZm86byx0eXBlOlwiZG93blwiLGludGVyYWN0aW9uOnRoaXN9KX19LHtrZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXtyZXR1cm4hKHRoaXMuaW50ZXJhY3RpbmcoKXx8IXRoaXMucG9pbnRlcklzRG93bnx8dGhpcy5wb2ludGVycy5sZW5ndGg8KFwiZ2VzdHVyZVwiPT09dC5uYW1lPzI6MSl8fCFlLm9wdGlvbnNbdC5uYW1lXS5lbmFibGVkKSYmKENuLmNvcHlBY3Rpb24odGhpcy5wcmVwYXJlZCx0KSx0aGlzLmludGVyYWN0YWJsZT1lLHRoaXMuZWxlbWVudD1uLHRoaXMucmVjdD1lLmdldFJlY3QobiksdGhpcy5lZGdlcz10aGlzLnByZXBhcmVkLmVkZ2VzP0NuLmV4dGVuZCh7fSx0aGlzLnByZXBhcmVkLmVkZ2VzKTp7bGVmdDohMCxyaWdodDohMCx0b3A6ITAsYm90dG9tOiEwfSx0aGlzLl9zdG9wcGVkPSExLHRoaXMuX2ludGVyYWN0aW5nPXRoaXMuX2RvUGhhc2Uoe2ludGVyYWN0aW9uOnRoaXMsZXZlbnQ6dGhpcy5kb3duRXZlbnQscGhhc2U6XCJzdGFydFwifSkmJiF0aGlzLl9zdG9wcGVkLHRoaXMuX2ludGVyYWN0aW5nKX19LHtrZXk6XCJwb2ludGVyTW92ZVwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXt0aGlzLnNpbXVsYXRpb258fHRoaXMubW9kaWZpY2F0aW9uJiZ0aGlzLm1vZGlmaWNhdGlvbi5lbmRSZXN1bHR8fHRoaXMudXBkYXRlUG9pbnRlcih0LGUsbiwhMSk7dmFyIHIsbyxpPXRoaXMuY29vcmRzLmN1ci5wYWdlLng9PT10aGlzLmNvb3Jkcy5wcmV2LnBhZ2UueCYmdGhpcy5jb29yZHMuY3VyLnBhZ2UueT09PXRoaXMuY29vcmRzLnByZXYucGFnZS55JiZ0aGlzLmNvb3Jkcy5jdXIuY2xpZW50Lng9PT10aGlzLmNvb3Jkcy5wcmV2LmNsaWVudC54JiZ0aGlzLmNvb3Jkcy5jdXIuY2xpZW50Lnk9PT10aGlzLmNvb3Jkcy5wcmV2LmNsaWVudC55O3RoaXMucG9pbnRlcklzRG93biYmIXRoaXMucG9pbnRlcldhc01vdmVkJiYocj10aGlzLmNvb3Jkcy5jdXIuY2xpZW50LngtdGhpcy5jb29yZHMuc3RhcnQuY2xpZW50Lngsbz10aGlzLmNvb3Jkcy5jdXIuY2xpZW50LnktdGhpcy5jb29yZHMuc3RhcnQuY2xpZW50LnksdGhpcy5wb2ludGVyV2FzTW92ZWQ9Q24uaHlwb3QocixvKT50aGlzLnBvaW50ZXJNb3ZlVG9sZXJhbmNlKTt2YXIgYT10aGlzLmdldFBvaW50ZXJJbmRleCh0KSx1PXtwb2ludGVyOnQscG9pbnRlckluZGV4OmEscG9pbnRlckluZm86dGhpcy5wb2ludGVyc1thXSxldmVudDplLHR5cGU6XCJtb3ZlXCIsZXZlbnRUYXJnZXQ6bixkeDpyLGR5Om8sZHVwbGljYXRlOmksaW50ZXJhY3Rpb246dGhpc307aXx8Q24ucG9pbnRlci5zZXRDb29yZFZlbG9jaXR5KHRoaXMuY29vcmRzLnZlbG9jaXR5LHRoaXMuY29vcmRzLmRlbHRhKSx0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6bW92ZVwiLHUpLGl8fHRoaXMuc2ltdWxhdGlvbnx8KHRoaXMuaW50ZXJhY3RpbmcoKSYmKHUudHlwZT1udWxsLHRoaXMubW92ZSh1KSksdGhpcy5wb2ludGVyV2FzTW92ZWQmJkNuLnBvaW50ZXIuY29weUNvb3Jkcyh0aGlzLmNvb3Jkcy5wcmV2LHRoaXMuY29vcmRzLmN1cikpfX0se2tleTpcIm1vdmVcIix2YWx1ZTpmdW5jdGlvbih0KXt0JiZ0LmV2ZW50fHxDbi5wb2ludGVyLnNldFplcm9Db29yZHModGhpcy5jb29yZHMuZGVsdGEpLCh0PUNuLmV4dGVuZCh7cG9pbnRlcjp0aGlzLl9sYXRlc3RQb2ludGVyLnBvaW50ZXIsZXZlbnQ6dGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudCxldmVudFRhcmdldDp0aGlzLl9sYXRlc3RQb2ludGVyLmV2ZW50VGFyZ2V0LGludGVyYWN0aW9uOnRoaXN9LHR8fHt9KSkucGhhc2U9XCJtb3ZlXCIsdGhpcy5fZG9QaGFzZSh0KX19LHtrZXk6XCJwb2ludGVyVXBcIix2YWx1ZTpmdW5jdGlvbih0LGUsbixyKXt2YXIgbz10aGlzLmdldFBvaW50ZXJJbmRleCh0KTstMT09PW8mJihvPXRoaXMudXBkYXRlUG9pbnRlcih0LGUsbiwhMSkpO3ZhciBpPS9jYW5jZWwkL2kudGVzdChlLnR5cGUpP1wiY2FuY2VsXCI6XCJ1cFwiO3RoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczpcIi5jb25jYXQoaSkse3BvaW50ZXI6dCxwb2ludGVySW5kZXg6byxwb2ludGVySW5mbzp0aGlzLnBvaW50ZXJzW29dLGV2ZW50OmUsZXZlbnRUYXJnZXQ6bix0eXBlOmksY3VyRXZlbnRUYXJnZXQ6cixpbnRlcmFjdGlvbjp0aGlzfSksdGhpcy5zaW11bGF0aW9ufHx0aGlzLmVuZChlKSx0aGlzLnBvaW50ZXJJc0Rvd249ITEsdGhpcy5yZW1vdmVQb2ludGVyKHQsZSl9fSx7a2V5OlwiZG9jdW1lbnRCbHVyXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5lbmQodCksdGhpcy5fc2NvcGVGaXJlKFwiaW50ZXJhY3Rpb25zOmJsdXJcIix7ZXZlbnQ6dCx0eXBlOlwiYmx1clwiLGludGVyYWN0aW9uOnRoaXN9KX19LHtrZXk6XCJlbmRcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZTt0aGlzLl9lbmRpbmc9ITAsdD10fHx0aGlzLl9sYXRlc3RQb2ludGVyLmV2ZW50LHRoaXMuaW50ZXJhY3RpbmcoKSYmKGU9dGhpcy5fZG9QaGFzZSh7ZXZlbnQ6dCxpbnRlcmFjdGlvbjp0aGlzLHBoYXNlOlwiZW5kXCJ9KSksISh0aGlzLl9lbmRpbmc9ITEpPT09ZSYmdGhpcy5zdG9wKCl9fSx7a2V5OlwiY3VycmVudEFjdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7cmV0dXJuIHRoaXMuX2ludGVyYWN0aW5nP3RoaXMucHJlcGFyZWQubmFtZTpudWxsfX0se2tleTpcImludGVyYWN0aW5nXCIsdmFsdWU6ZnVuY3Rpb24oKXtyZXR1cm4gdGhpcy5faW50ZXJhY3Rpbmd9fSx7a2V5Olwic3RvcFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5fc2NvcGVGaXJlKFwiaW50ZXJhY3Rpb25zOnN0b3BcIix7aW50ZXJhY3Rpb246dGhpc30pLHRoaXMuaW50ZXJhY3RhYmxlPXRoaXMuZWxlbWVudD1udWxsLHRoaXMuX2ludGVyYWN0aW5nPSExLHRoaXMuX3N0b3BwZWQ9ITAsdGhpcy5wcmVwYXJlZC5uYW1lPXRoaXMucHJldkV2ZW50PW51bGx9fSx7a2V5OlwiZ2V0UG9pbnRlckluZGV4XCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9Q24ucG9pbnRlci5nZXRQb2ludGVySWQodCk7cmV0dXJuXCJtb3VzZVwiPT09dGhpcy5wb2ludGVyVHlwZXx8XCJwZW5cIj09PXRoaXMucG9pbnRlclR5cGU/dGhpcy5wb2ludGVycy5sZW5ndGgtMTpDbi5hcnIuZmluZEluZGV4KHRoaXMucG9pbnRlcnMsZnVuY3Rpb24odCl7cmV0dXJuIHQuaWQ9PT1lfSl9fSx7a2V5OlwiZ2V0UG9pbnRlckluZm9cIix2YWx1ZTpmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5wb2ludGVyc1t0aGlzLmdldFBvaW50ZXJJbmRleCh0KV19fSx7a2V5OlwidXBkYXRlUG9pbnRlclwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLHIpe3ZhciBvPUNuLnBvaW50ZXIuZ2V0UG9pbnRlcklkKHQpLGk9dGhpcy5nZXRQb2ludGVySW5kZXgodCksYT10aGlzLnBvaW50ZXJzW2ldO3JldHVybiByPSExIT09ciYmKHJ8fC8oZG93bnxzdGFydCkkL2kudGVzdChlLnR5cGUpKSxhP2EucG9pbnRlcj10OihhPW5ldyBSbi5kZWZhdWx0KG8sdCxlLG51bGwsbnVsbCksaT10aGlzLnBvaW50ZXJzLmxlbmd0aCx0aGlzLnBvaW50ZXJzLnB1c2goYSkpLENuLnBvaW50ZXIuc2V0Q29vcmRzKHRoaXMuY29vcmRzLmN1cix0aGlzLnBvaW50ZXJzLm1hcChmdW5jdGlvbih0KXtyZXR1cm4gdC5wb2ludGVyfSksdGhpcy5fbm93KCkpLENuLnBvaW50ZXIuc2V0Q29vcmREZWx0YXModGhpcy5jb29yZHMuZGVsdGEsdGhpcy5jb29yZHMucHJldix0aGlzLmNvb3Jkcy5jdXIpLHImJih0aGlzLnBvaW50ZXJJc0Rvd249ITAsYS5kb3duVGltZT10aGlzLmNvb3Jkcy5jdXIudGltZVN0YW1wLGEuZG93blRhcmdldD1uLENuLnBvaW50ZXIucG9pbnRlckV4dGVuZCh0aGlzLmRvd25Qb2ludGVyLHQpLHRoaXMuaW50ZXJhY3RpbmcoKXx8KENuLnBvaW50ZXIuY29weUNvb3Jkcyh0aGlzLmNvb3Jkcy5zdGFydCx0aGlzLmNvb3Jkcy5jdXIpLENuLnBvaW50ZXIuY29weUNvb3Jkcyh0aGlzLmNvb3Jkcy5wcmV2LHRoaXMuY29vcmRzLmN1ciksdGhpcy5kb3duRXZlbnQ9ZSx0aGlzLnBvaW50ZXJXYXNNb3ZlZD0hMSkpLHRoaXMuX3VwZGF0ZUxhdGVzdFBvaW50ZXIodCxlLG4pLHRoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczp1cGRhdGUtcG9pbnRlclwiLHtwb2ludGVyOnQsZXZlbnQ6ZSxldmVudFRhcmdldDpuLGRvd246cixwb2ludGVySW5mbzphLHBvaW50ZXJJbmRleDppLGludGVyYWN0aW9uOnRoaXN9KSxpfX0se2tleTpcInJlbW92ZVBvaW50ZXJcIix2YWx1ZTpmdW5jdGlvbih0LGUpe3ZhciBuPXRoaXMuZ2V0UG9pbnRlckluZGV4KHQpO2lmKC0xIT09bil7dmFyIHI9dGhpcy5wb2ludGVyc1tuXTt0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6cmVtb3ZlLXBvaW50ZXJcIix7cG9pbnRlcjp0LGV2ZW50OmUsZXZlbnRUYXJnZXQ6bnVsbCxwb2ludGVySW5kZXg6bixwb2ludGVySW5mbzpyLGludGVyYWN0aW9uOnRoaXN9KSx0aGlzLnBvaW50ZXJzLnNwbGljZShuLDEpfX19LHtrZXk6XCJfdXBkYXRlTGF0ZXN0UG9pbnRlclwiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuKXt0aGlzLl9sYXRlc3RQb2ludGVyLnBvaW50ZXI9dCx0aGlzLl9sYXRlc3RQb2ludGVyLmV2ZW50PWUsdGhpcy5fbGF0ZXN0UG9pbnRlci5ldmVudFRhcmdldD1ufX0se2tleTpcImRlc3Ryb3lcIix2YWx1ZTpmdW5jdGlvbigpe3RoaXMuX2xhdGVzdFBvaW50ZXIucG9pbnRlcj1udWxsLHRoaXMuX2xhdGVzdFBvaW50ZXIuZXZlbnQ9bnVsbCx0aGlzLl9sYXRlc3RQb2ludGVyLmV2ZW50VGFyZ2V0PW51bGx9fSx7a2V5OlwiX2NyZWF0ZVByZXBhcmVkRXZlbnRcIix2YWx1ZTpmdW5jdGlvbih0LGUsbixyKXtyZXR1cm4gbmV3IFduLmRlZmF1bHQodGhpcyx0LHRoaXMucHJlcGFyZWQubmFtZSxlLHRoaXMuZWxlbWVudCxuLHIpfX0se2tleTpcIl9maXJlRXZlbnRcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLmludGVyYWN0YWJsZS5maXJlKHQpLCghdGhpcy5wcmV2RXZlbnR8fHQudGltZVN0YW1wPj10aGlzLnByZXZFdmVudC50aW1lU3RhbXApJiYodGhpcy5wcmV2RXZlbnQ9dCl9fSx7a2V5OlwiX2RvUGhhc2VcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10LmV2ZW50LG49dC5waGFzZSxyPXQucHJlRW5kLG89dC50eXBlLGk9dGhpcy5yZWN0O2lmKGkmJlwibW92ZVwiPT09biYmKENuLnJlY3QuYWRkRWRnZXModGhpcy5lZGdlcyxpLHRoaXMuY29vcmRzLmRlbHRhW3RoaXMuaW50ZXJhY3RhYmxlLm9wdGlvbnMuZGVsdGFTb3VyY2VdKSxpLndpZHRoPWkucmlnaHQtaS5sZWZ0LGkuaGVpZ2h0PWkuYm90dG9tLWkudG9wKSwhMT09PXRoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczpiZWZvcmUtYWN0aW9uLVwiLmNvbmNhdChuKSx0KSlyZXR1cm4hMTt2YXIgYT10LmlFdmVudD10aGlzLl9jcmVhdGVQcmVwYXJlZEV2ZW50KGUsbixyLG8pO3JldHVybiB0aGlzLl9zY29wZUZpcmUoXCJpbnRlcmFjdGlvbnM6YWN0aW9uLVwiLmNvbmNhdChuKSx0KSxcInN0YXJ0XCI9PT1uJiYodGhpcy5wcmV2RXZlbnQ9YSksdGhpcy5fZmlyZUV2ZW50KGEpLHRoaXMuX3Njb3BlRmlyZShcImludGVyYWN0aW9uczphZnRlci1hY3Rpb24tXCIuY29uY2F0KG4pLHQpLCEwfX0se2tleTpcIl9ub3dcIix2YWx1ZTpmdW5jdGlvbigpe3JldHVybiBEYXRlLm5vdygpfX1dKSxsfSgpLHFuPUVuLkludGVyYWN0aW9uPVZuO0VuLmRlZmF1bHQ9cW47dmFyIFVuPXt9O2Z1bmN0aW9uIEduKHQpe3JldHVybihHbj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFVuLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFVuLmluc3RhbGw9Sm4sVW4uZGVmYXVsdD12b2lkIDA7dmFyIEhuPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PUduKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPUtuKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpO2Z1bmN0aW9uIEtuKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gS249ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiAkbih0KXtyZXR1cm4vXihhbHdheXN8bmV2ZXJ8YXV0bykkLy50ZXN0KHQpPyh0aGlzLm9wdGlvbnMucHJldmVudERlZmF1bHQ9dCx0aGlzKTpIbi5ib29sKHQpPyh0aGlzLm9wdGlvbnMucHJldmVudERlZmF1bHQ9dD9cImFsd2F5c1wiOlwibmV2ZXJcIix0aGlzKTp0aGlzLm9wdGlvbnMucHJldmVudERlZmF1bHR9ZnVuY3Rpb24gWm4odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuZXZlbnQ7ZS5pbnRlcmFjdGFibGUmJmUuaW50ZXJhY3RhYmxlLmNoZWNrQW5kUHJldmVudERlZmF1bHQobil9ZnVuY3Rpb24gSm4ocil7dmFyIHQ9ci5JbnRlcmFjdGFibGU7dC5wcm90b3R5cGUucHJldmVudERlZmF1bHQ9JG4sdC5wcm90b3R5cGUuY2hlY2tBbmRQcmV2ZW50RGVmYXVsdD1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24odCxlLG4pe3ZhciByPXQub3B0aW9ucy5wcmV2ZW50RGVmYXVsdDtpZihcIm5ldmVyXCIhPT1yKWlmKFwiYWx3YXlzXCIhPT1yKXtpZihlLmV2ZW50cy5zdXBwb3J0c1Bhc3NpdmUmJi9edG91Y2goc3RhcnR8bW92ZSkkLy50ZXN0KG4udHlwZSkpe3ZhciBvPSgwLE8uZ2V0V2luZG93KShuLnRhcmdldCkuZG9jdW1lbnQsaT1lLmdldERvY09wdGlvbnMobyk7aWYoIWl8fCFpLmV2ZW50c3x8ITEhPT1pLmV2ZW50cy5wYXNzaXZlKXJldHVybn0vXihtb3VzZXxwb2ludGVyfHRvdWNoKSooZG93bnxzdGFydCkvaS50ZXN0KG4udHlwZSl8fEhuLmVsZW1lbnQobi50YXJnZXQpJiYoMCwkLm1hdGNoZXNTZWxlY3Rvcikobi50YXJnZXQsXCJpbnB1dCxzZWxlY3QsdGV4dGFyZWEsW2NvbnRlbnRlZGl0YWJsZT10cnVlXSxbY29udGVudGVkaXRhYmxlPXRydWVdICpcIil8fG4ucHJldmVudERlZmF1bHQoKX1lbHNlIG4ucHJldmVudERlZmF1bHQoKX0odGhpcyxyLHQpfSxyLmludGVyYWN0aW9ucy5kb2NFdmVudHMucHVzaCh7dHlwZTpcImRyYWdzdGFydFwiLGxpc3RlbmVyOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT0wO2U8ci5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7ZSsrKXt2YXIgbj1yLmludGVyYWN0aW9ucy5saXN0W2VdO2lmKG4uZWxlbWVudCYmKG4uZWxlbWVudD09PXQudGFyZ2V0fHwoMCwkLm5vZGVDb250YWlucykobi5lbGVtZW50LHQudGFyZ2V0KSkpcmV0dXJuIHZvaWQgbi5pbnRlcmFjdGFibGUuY2hlY2tBbmRQcmV2ZW50RGVmYXVsdCh0KX19fSl9dmFyIFFuPXtpZDpcImNvcmUvaW50ZXJhY3RhYmxlUHJldmVudERlZmF1bHRcIixpbnN0YWxsOkpuLGxpc3RlbmVyczpbXCJkb3duXCIsXCJtb3ZlXCIsXCJ1cFwiLFwiY2FuY2VsXCJdLnJlZHVjZShmdW5jdGlvbih0LGUpe3JldHVybiB0W1wiaW50ZXJhY3Rpb25zOlwiLmNvbmNhdChlKV09Wm4sdH0se30pfTtVbi5kZWZhdWx0PVFuO3ZhciB0cj17fTtmdW5jdGlvbiBlcih0KXtyZXR1cm4oZXI9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0cixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx0ci5kZWZhdWx0PXZvaWQgMDt2YXIgbnI9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09ZXIodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9cnIoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oJCk7ZnVuY3Rpb24gcnIoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBycj1mdW5jdGlvbigpe3JldHVybiB0fSx0fXZhciBvcj17bWV0aG9kT3JkZXI6W1wic2ltdWxhdGlvblJlc3VtZVwiLFwibW91c2VPclBlblwiLFwiaGFzUG9pbnRlclwiLFwiaWRsZVwiXSxzZWFyY2g6ZnVuY3Rpb24odCl7Zm9yKHZhciBlPTA7ZTxvci5tZXRob2RPcmRlci5sZW5ndGg7ZSsrKXt2YXIgbjtuPW9yLm1ldGhvZE9yZGVyW2VdO3ZhciByPW9yW25dKHQpO2lmKHIpcmV0dXJuIHJ9cmV0dXJuIG51bGx9LHNpbXVsYXRpb25SZXN1bWU6ZnVuY3Rpb24odCl7dmFyIGU9dC5wb2ludGVyVHlwZSxuPXQuZXZlbnRUeXBlLHI9dC5ldmVudFRhcmdldCxvPXQuc2NvcGU7aWYoIS9kb3dufHN0YXJ0L2kudGVzdChuKSlyZXR1cm4gbnVsbDtmb3IodmFyIGk9MDtpPG8uaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO2krKyl7dmFyIGE9by5pbnRlcmFjdGlvbnMubGlzdFtpXSx1PXI7aWYoYS5zaW11bGF0aW9uJiZhLnNpbXVsYXRpb24uYWxsb3dSZXN1bWUmJmEucG9pbnRlclR5cGU9PT1lKWZvcig7dTspe2lmKHU9PT1hLmVsZW1lbnQpcmV0dXJuIGE7dT1uci5wYXJlbnROb2RlKHUpfX1yZXR1cm4gbnVsbH0sbW91c2VPclBlbjpmdW5jdGlvbih0KXt2YXIgZSxuPXQucG9pbnRlcklkLHI9dC5wb2ludGVyVHlwZSxvPXQuZXZlbnRUeXBlLGk9dC5zY29wZTtpZihcIm1vdXNlXCIhPT1yJiZcInBlblwiIT09cilyZXR1cm4gbnVsbDtmb3IodmFyIGE9MDthPGkuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO2ErKyl7dmFyIHU9aS5pbnRlcmFjdGlvbnMubGlzdFthXTtpZih1LnBvaW50ZXJUeXBlPT09cil7aWYodS5zaW11bGF0aW9uJiYhaXIodSxuKSljb250aW51ZTtpZih1LmludGVyYWN0aW5nKCkpcmV0dXJuIHU7ZT1lfHx1fX1pZihlKXJldHVybiBlO2Zvcih2YXIgcz0wO3M8aS5pbnRlcmFjdGlvbnMubGlzdC5sZW5ndGg7cysrKXt2YXIgbD1pLmludGVyYWN0aW9ucy5saXN0W3NdO2lmKCEobC5wb2ludGVyVHlwZSE9PXJ8fC9kb3duL2kudGVzdChvKSYmbC5zaW11bGF0aW9uKSlyZXR1cm4gbH1yZXR1cm4gbnVsbH0saGFzUG9pbnRlcjpmdW5jdGlvbih0KXtmb3IodmFyIGU9dC5wb2ludGVySWQsbj10LnNjb3BlLHI9MDtyPG4uaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO3IrKyl7dmFyIG89bi5pbnRlcmFjdGlvbnMubGlzdFtyXTtpZihpcihvLGUpKXJldHVybiBvfXJldHVybiBudWxsfSxpZGxlOmZ1bmN0aW9uKHQpe2Zvcih2YXIgZT10LnBvaW50ZXJUeXBlLG49dC5zY29wZSxyPTA7cjxuLmludGVyYWN0aW9ucy5saXN0Lmxlbmd0aDtyKyspe3ZhciBvPW4uaW50ZXJhY3Rpb25zLmxpc3Rbcl07aWYoMT09PW8ucG9pbnRlcnMubGVuZ3RoKXt2YXIgaT1vLmludGVyYWN0YWJsZTtpZihpJiYoIWkub3B0aW9ucy5nZXN0dXJlfHwhaS5vcHRpb25zLmdlc3R1cmUuZW5hYmxlZCkpY29udGludWV9ZWxzZSBpZigyPD1vLnBvaW50ZXJzLmxlbmd0aCljb250aW51ZTtpZighby5pbnRlcmFjdGluZygpJiZlPT09by5wb2ludGVyVHlwZSlyZXR1cm4gb31yZXR1cm4gbnVsbH19O2Z1bmN0aW9uIGlyKHQsZSl7cmV0dXJuIHQucG9pbnRlcnMuc29tZShmdW5jdGlvbih0KXtyZXR1cm4gdC5pZD09PWV9KX12YXIgYXI9b3I7dHIuZGVmYXVsdD1hcjt2YXIgdXI9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHVyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHVyLmRlZmF1bHQ9dm9pZCAwO3ZhciBzcixscj0oc3I9TWUpJiZzci5fX2VzTW9kdWxlP3NyOntkZWZhdWx0OnNyfSxjcj1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1wcih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1mcigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShTKTtmdW5jdGlvbiBmcigpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIGZyPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gcHIodCl7cmV0dXJuKHByPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1mdW5jdGlvbiBkcih0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gdnIodCl7cmV0dXJuKHZyPU9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3QuZ2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24odCl7cmV0dXJuIHQuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YodCl9KSh0KX1mdW5jdGlvbiB5cih0KXtpZih2b2lkIDA9PT10KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4gdH1mdW5jdGlvbiBocih0LGUpe3JldHVybihocj1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuX19wcm90b19fPWUsdH0pKHQsZSl9ZnVuY3Rpb24gZ3IodCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBicj1mdW5jdGlvbigpe2Z1bmN0aW9uIGwodCxlLG4pe3ZhciByLG8saTshZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGwpLG89dGhpcyxyPSEoaT12cihsKS5jYWxsKHRoaXMsZS5faW50ZXJhY3Rpb24pKXx8XCJvYmplY3RcIiE9PXByKGkpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiBpP3lyKG8pOmksZ3IoeXIociksXCJ0YXJnZXRcIix2b2lkIDApLGdyKHlyKHIpLFwiZHJvcHpvbmVcIix2b2lkIDApLGdyKHlyKHIpLFwiZHJhZ0V2ZW50XCIsdm9pZCAwKSxncih5cihyKSxcInJlbGF0ZWRUYXJnZXRcIix2b2lkIDApLGdyKHlyKHIpLFwiZHJhZ2dhYmxlXCIsdm9pZCAwKSxncih5cihyKSxcInRpbWVTdGFtcFwiLHZvaWQgMCksZ3IoeXIociksXCJwcm9wYWdhdGlvblN0b3BwZWRcIiwhMSksZ3IoeXIociksXCJpbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWRcIiwhMSk7dmFyIGE9XCJkcmFnbGVhdmVcIj09PW4/dC5wcmV2OnQuY3VyLHU9YS5lbGVtZW50LHM9YS5kcm9wem9uZTtyZXR1cm4gci50eXBlPW4sci50YXJnZXQ9dSxyLmN1cnJlbnRUYXJnZXQ9dSxyLmRyb3B6b25lPXMsci5kcmFnRXZlbnQ9ZSxyLnJlbGF0ZWRUYXJnZXQ9ZS50YXJnZXQsci5kcmFnZ2FibGU9ZS5pbnRlcmFjdGFibGUsci50aW1lU3RhbXA9ZS50aW1lU3RhbXAscn12YXIgdCxlLG47cmV0dXJuIGZ1bmN0aW9uKHQsZSl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgZSYmbnVsbCE9PWUpdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uXCIpO3QucHJvdG90eXBlPU9iamVjdC5jcmVhdGUoZSYmZS5wcm90b3R5cGUse2NvbnN0cnVjdG9yOnt2YWx1ZTp0LHdyaXRhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMH19KSxlJiZocih0LGUpfShsLGxyW1wiZGVmYXVsdFwiXSksdD1sLChlPVt7a2V5OlwicmVqZWN0XCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgcj10aGlzLHQ9dGhpcy5faW50ZXJhY3Rpb24uZHJvcFN0YXRlO2lmKFwiZHJvcGFjdGl2YXRlXCI9PT10aGlzLnR5cGV8fHRoaXMuZHJvcHpvbmUmJnQuY3VyLmRyb3B6b25lPT09dGhpcy5kcm9wem9uZSYmdC5jdXIuZWxlbWVudD09PXRoaXMudGFyZ2V0KWlmKHQucHJldi5kcm9wem9uZT10aGlzLmRyb3B6b25lLHQucHJldi5lbGVtZW50PXRoaXMudGFyZ2V0LHQucmVqZWN0ZWQ9ITAsdC5ldmVudHMuZW50ZXI9bnVsbCx0aGlzLnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpLFwiZHJvcGFjdGl2YXRlXCI9PT10aGlzLnR5cGUpe3ZhciBlPXQuYWN0aXZlRHJvcHMsbj1jci5maW5kSW5kZXgoZSxmdW5jdGlvbih0KXt2YXIgZT10LmRyb3B6b25lLG49dC5lbGVtZW50O3JldHVybiBlPT09ci5kcm9wem9uZSYmbj09PXIudGFyZ2V0fSk7dC5hY3RpdmVEcm9wcy5zcGxpY2UobiwxKTt2YXIgbz1uZXcgbCh0LHRoaXMuZHJhZ0V2ZW50LFwiZHJvcGRlYWN0aXZhdGVcIik7by5kcm9wem9uZT10aGlzLmRyb3B6b25lLG8udGFyZ2V0PXRoaXMudGFyZ2V0LHRoaXMuZHJvcHpvbmUuZmlyZShvKX1lbHNlIHRoaXMuZHJvcHpvbmUuZmlyZShuZXcgbCh0LHRoaXMuZHJhZ0V2ZW50LFwiZHJhZ2xlYXZlXCIpKX19LHtrZXk6XCJwcmV2ZW50RGVmYXVsdFwiLHZhbHVlOmZ1bmN0aW9uKCl7fX0se2tleTpcInN0b3BQcm9wYWdhdGlvblwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5wcm9wYWdhdGlvblN0b3BwZWQ9ITB9fSx7a2V5Olwic3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmltbWVkaWF0ZVByb3BhZ2F0aW9uU3RvcHBlZD10aGlzLnByb3BhZ2F0aW9uU3RvcHBlZD0hMH19XSkmJmRyKHQucHJvdG90eXBlLGUpLG4mJmRyKHQsbiksbH0oKTt1ci5kZWZhdWx0PWJyO3ZhciBtcj17fTtmdW5jdGlvbiBPcih0KXtyZXR1cm4oT3I9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShtcixcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxtci5kZWZhdWx0PXZvaWQgMDtTcihrKHt9KSksU3IobSh7fSkpO3ZhciB3cj1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1Pcih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT14cigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShsZSksX3I9U3IodiksUHI9U3IodXIpO2Z1bmN0aW9uIHhyKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4geHI9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBTcih0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24ganIodCxlKXtmb3IodmFyIG49MDtuPHQuc2xpY2UoKS5sZW5ndGg7bisrKXtyPXQuc2xpY2UoKVtuXTt2YXIgcixvPXIuZHJvcHpvbmUsaT1yLmVsZW1lbnQ7ZS5kcm9wem9uZT1vLGUudGFyZ2V0PWksby5maXJlKGUpLGUucHJvcGFnYXRpb25TdG9wcGVkPWUuaW1tZWRpYXRlUHJvcGFnYXRpb25TdG9wcGVkPSExfX1mdW5jdGlvbiBNcih0LGUpe2Zvcih2YXIgbj1mdW5jdGlvbih0LGUpe2Zvcih2YXIgbj10LmludGVyYWN0YWJsZXMscj1bXSxvPTA7bzxuLmxpc3QubGVuZ3RoO28rKyl7dmFyIGk9bi5saXN0W29dO2lmKGkub3B0aW9ucy5kcm9wLmVuYWJsZWQpe3ZhciBhPWkub3B0aW9ucy5kcm9wLmFjY2VwdDtpZighKHdyLmlzLmVsZW1lbnQoYSkmJmEhPT1lfHx3ci5pcy5zdHJpbmcoYSkmJiF3ci5kb20ubWF0Y2hlc1NlbGVjdG9yKGUsYSl8fHdyLmlzLmZ1bmMoYSkmJiFhKHtkcm9wem9uZTppLGRyYWdnYWJsZUVsZW1lbnQ6ZX0pKSlmb3IodmFyIHU9d3IuaXMuc3RyaW5nKGkudGFyZ2V0KT9pLl9jb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwoaS50YXJnZXQpOndyLmlzLmFycmF5KGkudGFyZ2V0KT9pLnRhcmdldDpbaS50YXJnZXRdLHM9MDtzPHUubGVuZ3RoO3MrKyl7dmFyIGw7bD11W3NdO2whPT1lJiZyLnB1c2goe2Ryb3B6b25lOmksZWxlbWVudDpsfSl9fX1yZXR1cm4gcn0odCxlKSxyPTA7cjxuLmxlbmd0aDtyKyspe3ZhciBvO289bltyXTtvLnJlY3Q9by5kcm9wem9uZS5nZXRSZWN0KG8uZWxlbWVudCl9cmV0dXJuIG59ZnVuY3Rpb24ga3IodCxlLG4pe2Zvcih2YXIgcj10LmRyb3BTdGF0ZSxvPXQuaW50ZXJhY3RhYmxlLGk9dC5lbGVtZW50LGE9W10sdT0wO3U8ci5hY3RpdmVEcm9wcy5sZW5ndGg7dSsrKXtzPXIuYWN0aXZlRHJvcHNbdV07dmFyIHMsbD1zLmRyb3B6b25lLGM9cy5lbGVtZW50LGY9cy5yZWN0O2EucHVzaChsLmRyb3BDaGVjayhlLG4sbyxpLGMsZik/YzpudWxsKX12YXIgcD13ci5kb20uaW5kZXhPZkRlZXBlc3RFbGVtZW50KGEpO3JldHVybiByLmFjdGl2ZURyb3BzW3BdfHxudWxsfWZ1bmN0aW9uIEVyKHQsZSxuKXt2YXIgcj10LmRyb3BTdGF0ZSxvPXtlbnRlcjpudWxsLGxlYXZlOm51bGwsYWN0aXZhdGU6bnVsbCxkZWFjdGl2YXRlOm51bGwsbW92ZTpudWxsLGRyb3A6bnVsbH07cmV0dXJuXCJkcmFnc3RhcnRcIj09PW4udHlwZSYmKG8uYWN0aXZhdGU9bmV3IFByLmRlZmF1bHQocixuLFwiZHJvcGFjdGl2YXRlXCIpLG8uYWN0aXZhdGUudGFyZ2V0PW51bGwsby5hY3RpdmF0ZS5kcm9wem9uZT1udWxsKSxcImRyYWdlbmRcIj09PW4udHlwZSYmKG8uZGVhY3RpdmF0ZT1uZXcgUHIuZGVmYXVsdChyLG4sXCJkcm9wZGVhY3RpdmF0ZVwiKSxvLmRlYWN0aXZhdGUudGFyZ2V0PW51bGwsby5kZWFjdGl2YXRlLmRyb3B6b25lPW51bGwpLHIucmVqZWN0ZWR8fChyLmN1ci5lbGVtZW50IT09ci5wcmV2LmVsZW1lbnQmJihyLnByZXYuZHJvcHpvbmUmJihvLmxlYXZlPW5ldyBQci5kZWZhdWx0KHIsbixcImRyYWdsZWF2ZVwiKSxuLmRyYWdMZWF2ZT1vLmxlYXZlLnRhcmdldD1yLnByZXYuZWxlbWVudCxuLnByZXZEcm9wem9uZT1vLmxlYXZlLmRyb3B6b25lPXIucHJldi5kcm9wem9uZSksci5jdXIuZHJvcHpvbmUmJihvLmVudGVyPW5ldyBQci5kZWZhdWx0KHIsbixcImRyYWdlbnRlclwiKSxuLmRyYWdFbnRlcj1yLmN1ci5lbGVtZW50LG4uZHJvcHpvbmU9ci5jdXIuZHJvcHpvbmUpKSxcImRyYWdlbmRcIj09PW4udHlwZSYmci5jdXIuZHJvcHpvbmUmJihvLmRyb3A9bmV3IFByLmRlZmF1bHQocixuLFwiZHJvcFwiKSxuLmRyb3B6b25lPXIuY3VyLmRyb3B6b25lLG4ucmVsYXRlZFRhcmdldD1yLmN1ci5lbGVtZW50KSxcImRyYWdtb3ZlXCI9PT1uLnR5cGUmJnIuY3VyLmRyb3B6b25lJiYoby5tb3ZlPW5ldyBQci5kZWZhdWx0KHIsbixcImRyb3Btb3ZlXCIpLChvLm1vdmUuZHJhZ21vdmU9bikuZHJvcHpvbmU9ci5jdXIuZHJvcHpvbmUpKSxvfWZ1bmN0aW9uIFRyKHQsZSl7dmFyIG49dC5kcm9wU3RhdGUscj1uLmFjdGl2ZURyb3BzLG89bi5jdXIsaT1uLnByZXY7ZS5sZWF2ZSYmaS5kcm9wem9uZS5maXJlKGUubGVhdmUpLGUubW92ZSYmby5kcm9wem9uZS5maXJlKGUubW92ZSksZS5lbnRlciYmby5kcm9wem9uZS5maXJlKGUuZW50ZXIpLGUuZHJvcCYmby5kcm9wem9uZS5maXJlKGUuZHJvcCksZS5kZWFjdGl2YXRlJiZqcihyLGUuZGVhY3RpdmF0ZSksbi5wcmV2LmRyb3B6b25lPW8uZHJvcHpvbmUsbi5wcmV2LmVsZW1lbnQ9by5lbGVtZW50fWZ1bmN0aW9uIERyKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPXQuaUV2ZW50LG89dC5ldmVudDtpZihcImRyYWdtb3ZlXCI9PT1yLnR5cGV8fFwiZHJhZ2VuZFwiPT09ci50eXBlKXt2YXIgaT1uLmRyb3BTdGF0ZTtlLmR5bmFtaWNEcm9wJiYoaS5hY3RpdmVEcm9wcz1NcihlLG4uZWxlbWVudCkpO3ZhciBhPXIsdT1rcihuLGEsbyk7aS5yZWplY3RlZD1pLnJlamVjdGVkJiYhIXUmJnUuZHJvcHpvbmU9PT1pLmN1ci5kcm9wem9uZSYmdS5lbGVtZW50PT09aS5jdXIuZWxlbWVudCxpLmN1ci5kcm9wem9uZT11JiZ1LmRyb3B6b25lLGkuY3VyLmVsZW1lbnQ9dSYmdS5lbGVtZW50LGkuZXZlbnRzPUVyKG4sMCxhKX19dmFyIElyPXtpZDpcImFjdGlvbnMvZHJvcFwiLGluc3RhbGw6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5hY3Rpb25zLG49ZS5pbnRlcmFjdFN0YXRpYyxyPWUuSW50ZXJhY3RhYmxlLG89ZS5kZWZhdWx0cztlLnVzZVBsdWdpbihfci5kZWZhdWx0KSxyLnByb3RvdHlwZS5kcm9wem9uZT1mdW5jdGlvbih0KXtyZXR1cm4gZnVuY3Rpb24odCxlKXtpZih3ci5pcy5vYmplY3QoZSkpe2lmKHQub3B0aW9ucy5kcm9wLmVuYWJsZWQ9ITEhPT1lLmVuYWJsZWQsZS5saXN0ZW5lcnMpe3ZhciBuPXdyLm5vcm1hbGl6ZUxpc3RlbmVycyhlLmxpc3RlbmVycykscj1PYmplY3Qua2V5cyhuKS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFsvXihlbnRlcnxsZWF2ZSkvLnRlc3QoZSk/XCJkcmFnXCIuY29uY2F0KGUpOi9eKGFjdGl2YXRlfGRlYWN0aXZhdGV8bW92ZSkvLnRlc3QoZSk/XCJkcm9wXCIuY29uY2F0KGUpOmVdPW5bZV0sdH0se30pO3Qub2ZmKHQub3B0aW9ucy5kcm9wLmxpc3RlbmVycyksdC5vbihyKSx0Lm9wdGlvbnMuZHJvcC5saXN0ZW5lcnM9cn1yZXR1cm4gd3IuaXMuZnVuYyhlLm9uZHJvcCkmJnQub24oXCJkcm9wXCIsZS5vbmRyb3ApLHdyLmlzLmZ1bmMoZS5vbmRyb3BhY3RpdmF0ZSkmJnQub24oXCJkcm9wYWN0aXZhdGVcIixlLm9uZHJvcGFjdGl2YXRlKSx3ci5pcy5mdW5jKGUub25kcm9wZGVhY3RpdmF0ZSkmJnQub24oXCJkcm9wZGVhY3RpdmF0ZVwiLGUub25kcm9wZGVhY3RpdmF0ZSksd3IuaXMuZnVuYyhlLm9uZHJhZ2VudGVyKSYmdC5vbihcImRyYWdlbnRlclwiLGUub25kcmFnZW50ZXIpLHdyLmlzLmZ1bmMoZS5vbmRyYWdsZWF2ZSkmJnQub24oXCJkcmFnbGVhdmVcIixlLm9uZHJhZ2xlYXZlKSx3ci5pcy5mdW5jKGUub25kcm9wbW92ZSkmJnQub24oXCJkcm9wbW92ZVwiLGUub25kcm9wbW92ZSksL14ocG9pbnRlcnxjZW50ZXIpJC8udGVzdChlLm92ZXJsYXApP3Qub3B0aW9ucy5kcm9wLm92ZXJsYXA9ZS5vdmVybGFwOndyLmlzLm51bWJlcihlLm92ZXJsYXApJiYodC5vcHRpb25zLmRyb3Aub3ZlcmxhcD1NYXRoLm1heChNYXRoLm1pbigxLGUub3ZlcmxhcCksMCkpLFwiYWNjZXB0XCJpbiBlJiYodC5vcHRpb25zLmRyb3AuYWNjZXB0PWUuYWNjZXB0KSxcImNoZWNrZXJcImluIGUmJih0Lm9wdGlvbnMuZHJvcC5jaGVja2VyPWUuY2hlY2tlciksdH1pZih3ci5pcy5ib29sKGUpKXJldHVybiB0Lm9wdGlvbnMuZHJvcC5lbmFibGVkPWUsdDtyZXR1cm4gdC5vcHRpb25zLmRyb3B9KHRoaXMsdCl9LHIucHJvdG90eXBlLmRyb3BDaGVjaz1mdW5jdGlvbih0LGUsbixyLG8saSl7cmV0dXJuIGZ1bmN0aW9uKHQsZSxuLHIsbyxpLGEpe3ZhciB1PSExO2lmKCEoYT1hfHx0LmdldFJlY3QoaSkpKXJldHVybiEhdC5vcHRpb25zLmRyb3AuY2hlY2tlciYmdC5vcHRpb25zLmRyb3AuY2hlY2tlcihlLG4sdSx0LGkscixvKTt2YXIgcz10Lm9wdGlvbnMuZHJvcC5vdmVybGFwO2lmKFwicG9pbnRlclwiPT09cyl7dmFyIGw9d3IuZ2V0T3JpZ2luWFkocixvLFwiZHJhZ1wiKSxjPXdyLnBvaW50ZXIuZ2V0UGFnZVhZKGUpO2MueCs9bC54LGMueSs9bC55O3ZhciBmPWMueD5hLmxlZnQmJmMueDxhLnJpZ2h0LHA9Yy55PmEudG9wJiZjLnk8YS5ib3R0b207dT1mJiZwfXZhciBkPXIuZ2V0UmVjdChvKTtpZihkJiZcImNlbnRlclwiPT09cyl7dmFyIHY9ZC5sZWZ0K2Qud2lkdGgvMix5PWQudG9wK2QuaGVpZ2h0LzI7dT12Pj1hLmxlZnQmJnY8PWEucmlnaHQmJnk+PWEudG9wJiZ5PD1hLmJvdHRvbX1pZihkJiZ3ci5pcy5udW1iZXIocykpe3ZhciBoPU1hdGgubWF4KDAsTWF0aC5taW4oYS5yaWdodCxkLnJpZ2h0KS1NYXRoLm1heChhLmxlZnQsZC5sZWZ0KSkqTWF0aC5tYXgoMCxNYXRoLm1pbihhLmJvdHRvbSxkLmJvdHRvbSktTWF0aC5tYXgoYS50b3AsZC50b3ApKS8oZC53aWR0aCpkLmhlaWdodCk7dT1zPD1ofXQub3B0aW9ucy5kcm9wLmNoZWNrZXImJih1PXQub3B0aW9ucy5kcm9wLmNoZWNrZXIoZSxuLHUsdCxpLHIsbykpO3JldHVybiB1fSh0aGlzLHQsZSxuLHIsbyxpKX0sbi5keW5hbWljRHJvcD1mdW5jdGlvbih0KXtyZXR1cm4gd3IuaXMuYm9vbCh0KT8oZS5keW5hbWljRHJvcD10LG4pOmUuZHluYW1pY0Ryb3B9LHdyLmV4dGVuZCh0LnBoYXNlbGVzc1R5cGVzLHtkcmFnZW50ZXI6ITAsZHJhZ2xlYXZlOiEwLGRyb3BhY3RpdmF0ZTohMCxkcm9wZGVhY3RpdmF0ZTohMCxkcm9wbW92ZTohMCxkcm9wOiEwfSksdC5tZXRob2REaWN0LmRyb3A9XCJkcm9wem9uZVwiLGUuZHluYW1pY0Ryb3A9ITEsby5hY3Rpb25zLmRyb3A9SXIuZGVmYXVsdHN9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1zdGFydFwiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb247XCJkcmFnXCI9PT1lLnByZXBhcmVkLm5hbWUmJihlLmRyb3BTdGF0ZT17Y3VyOntkcm9wem9uZTpudWxsLGVsZW1lbnQ6bnVsbH0scHJldjp7ZHJvcHpvbmU6bnVsbCxlbGVtZW50Om51bGx9LHJlamVjdGVkOm51bGwsZXZlbnRzOm51bGwsYWN0aXZlRHJvcHM6W119KX0sXCJpbnRlcmFjdGlvbnM6YWZ0ZXItYWN0aW9uLXN0YXJ0XCI6ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uLHI9KHQuZXZlbnQsdC5pRXZlbnQpO2lmKFwiZHJhZ1wiPT09bi5wcmVwYXJlZC5uYW1lKXt2YXIgbz1uLmRyb3BTdGF0ZTtvLmFjdGl2ZURyb3BzPW51bGwsby5ldmVudHM9bnVsbCxvLmFjdGl2ZURyb3BzPU1yKGUsbi5lbGVtZW50KSxvLmV2ZW50cz1FcihuLDAsciksby5ldmVudHMuYWN0aXZhdGUmJihqcihvLmFjdGl2ZURyb3BzLG8uZXZlbnRzLmFjdGl2YXRlKSxlLmZpcmUoXCJhY3Rpb25zL2Ryb3A6c3RhcnRcIix7aW50ZXJhY3Rpb246bixkcmFnRXZlbnQ6cn0pKX19LFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1tb3ZlXCI6RHIsXCJpbnRlcmFjdGlvbnM6YWN0aW9uLWVuZFwiOkRyLFwiaW50ZXJhY3Rpb25zOmFmdGVyLWFjdGlvbi1tb3ZlXCI6ZnVuY3Rpb24odCxlKXt2YXIgbj10LmludGVyYWN0aW9uLHI9dC5pRXZlbnQ7XCJkcmFnXCI9PT1uLnByZXBhcmVkLm5hbWUmJihUcihuLG4uZHJvcFN0YXRlLmV2ZW50cyksZS5maXJlKFwiYWN0aW9ucy9kcm9wOm1vdmVcIix7aW50ZXJhY3Rpb246bixkcmFnRXZlbnQ6cn0pLG4uZHJvcFN0YXRlLmV2ZW50cz17fSl9LFwiaW50ZXJhY3Rpb25zOmFmdGVyLWFjdGlvbi1lbmRcIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LmlFdmVudDtcImRyYWdcIj09PW4ucHJlcGFyZWQubmFtZSYmKFRyKG4sbi5kcm9wU3RhdGUuZXZlbnRzKSxlLmZpcmUoXCJhY3Rpb25zL2Ryb3A6ZW5kXCIse2ludGVyYWN0aW9uOm4sZHJhZ0V2ZW50OnJ9KSl9LFwiaW50ZXJhY3Rpb25zOnN0b3BcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uO2lmKFwiZHJhZ1wiPT09ZS5wcmVwYXJlZC5uYW1lKXt2YXIgbj1lLmRyb3BTdGF0ZTtuJiYobi5hY3RpdmVEcm9wcz1udWxsLG4uZXZlbnRzPW51bGwsbi5jdXIuZHJvcHpvbmU9bnVsbCxuLmN1ci5lbGVtZW50PW51bGwsbi5wcmV2LmRyb3B6b25lPW51bGwsbi5wcmV2LmVsZW1lbnQ9bnVsbCxuLnJlamVjdGVkPSExKX19fSxnZXRBY3RpdmVEcm9wczpNcixnZXREcm9wOmtyLGdldERyb3BFdmVudHM6RXIsZmlyZURyb3BFdmVudHM6VHIsZGVmYXVsdHM6e2VuYWJsZWQ6ITEsYWNjZXB0Om51bGwsb3ZlcmxhcDpcInBvaW50ZXJcIn19LHpyPUlyO21yLmRlZmF1bHQ9enI7dmFyIEFyPXt9O2Z1bmN0aW9uIENyKHQpe3JldHVybihDcj1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KEFyLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEFyLmRlZmF1bHQ9dm9pZCAwO3ZhciBXcj1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1Dcih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1ScigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShsZSk7ZnVuY3Rpb24gUnIoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBScj1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIEZyKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24sbj10LmlFdmVudCxyPXQucGhhc2U7aWYoXCJnZXN0dXJlXCI9PT1lLnByZXBhcmVkLm5hbWUpe3ZhciBvPWUucG9pbnRlcnMubWFwKGZ1bmN0aW9uKHQpe3JldHVybiB0LnBvaW50ZXJ9KSxpPVwic3RhcnRcIj09PXIsYT1cImVuZFwiPT09cix1PWUuaW50ZXJhY3RhYmxlLm9wdGlvbnMuZGVsdGFTb3VyY2U7aWYobi50b3VjaGVzPVtvWzBdLG9bMV1dLGkpbi5kaXN0YW5jZT1Xci5wb2ludGVyLnRvdWNoRGlzdGFuY2Uobyx1KSxuLmJveD1Xci5wb2ludGVyLnRvdWNoQkJveChvKSxuLnNjYWxlPTEsbi5kcz0wLG4uYW5nbGU9V3IucG9pbnRlci50b3VjaEFuZ2xlKG8sdSksbi5kYT0wLGUuZ2VzdHVyZS5zdGFydERpc3RhbmNlPW4uZGlzdGFuY2UsZS5nZXN0dXJlLnN0YXJ0QW5nbGU9bi5hbmdsZTtlbHNlIGlmKGEpe3ZhciBzPWUucHJldkV2ZW50O24uZGlzdGFuY2U9cy5kaXN0YW5jZSxuLmJveD1zLmJveCxuLnNjYWxlPXMuc2NhbGUsbi5kcz0wLG4uYW5nbGU9cy5hbmdsZSxuLmRhPTB9ZWxzZSBuLmRpc3RhbmNlPVdyLnBvaW50ZXIudG91Y2hEaXN0YW5jZShvLHUpLG4uYm94PVdyLnBvaW50ZXIudG91Y2hCQm94KG8pLG4uc2NhbGU9bi5kaXN0YW5jZS9lLmdlc3R1cmUuc3RhcnREaXN0YW5jZSxuLmFuZ2xlPVdyLnBvaW50ZXIudG91Y2hBbmdsZShvLHUpLG4uZHM9bi5zY2FsZS1lLmdlc3R1cmUuc2NhbGUsbi5kYT1uLmFuZ2xlLWUuZ2VzdHVyZS5hbmdsZTtlLmdlc3R1cmUuZGlzdGFuY2U9bi5kaXN0YW5jZSxlLmdlc3R1cmUuYW5nbGU9bi5hbmdsZSxXci5pcy5udW1iZXIobi5zY2FsZSkmJm4uc2NhbGUhPT0xLzAmJiFpc05hTihuLnNjYWxlKSYmKGUuZ2VzdHVyZS5zY2FsZT1uLnNjYWxlKX19dmFyIFhyPXtpZDpcImFjdGlvbnMvZ2VzdHVyZVwiLGJlZm9yZTpbXCJhY3Rpb25zL2RyYWdcIixcImFjdGlvbnMvcmVzaXplXCJdLGluc3RhbGw6ZnVuY3Rpb24odCl7dmFyIGU9dC5hY3Rpb25zLG49dC5JbnRlcmFjdGFibGUscj10LmRlZmF1bHRzO24ucHJvdG90eXBlLmdlc3R1cmFibGU9ZnVuY3Rpb24odCl7cmV0dXJuIFdyLmlzLm9iamVjdCh0KT8odGhpcy5vcHRpb25zLmdlc3R1cmUuZW5hYmxlZD0hMSE9PXQuZW5hYmxlZCx0aGlzLnNldFBlckFjdGlvbihcImdlc3R1cmVcIix0KSx0aGlzLnNldE9uRXZlbnRzKFwiZ2VzdHVyZVwiLHQpLHRoaXMpOldyLmlzLmJvb2wodCk/KHRoaXMub3B0aW9ucy5nZXN0dXJlLmVuYWJsZWQ9dCx0aGlzKTp0aGlzLm9wdGlvbnMuZ2VzdHVyZX0sZS5tYXAuZ2VzdHVyZT1YcixlLm1ldGhvZERpY3QuZ2VzdHVyZT1cImdlc3R1cmFibGVcIixyLmFjdGlvbnMuZ2VzdHVyZT1Yci5kZWZhdWx0c30sbGlzdGVuZXJzOntcImludGVyYWN0aW9uczphY3Rpb24tc3RhcnRcIjpGcixcImludGVyYWN0aW9uczphY3Rpb24tbW92ZVwiOkZyLFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1lbmRcIjpGcixcImludGVyYWN0aW9uczpuZXdcIjpmdW5jdGlvbih0KXt0LmludGVyYWN0aW9uLmdlc3R1cmU9e2FuZ2xlOjAsZGlzdGFuY2U6MCxzY2FsZToxLHN0YXJ0QW5nbGU6MCxzdGFydERpc3RhbmNlOjB9fSxcImF1dG8tc3RhcnQ6Y2hlY2tcIjpmdW5jdGlvbih0KXtpZighKHQuaW50ZXJhY3Rpb24ucG9pbnRlcnMubGVuZ3RoPDIpKXt2YXIgZT10LmludGVyYWN0YWJsZS5vcHRpb25zLmdlc3R1cmU7aWYoZSYmZS5lbmFibGVkKXJldHVybiEodC5hY3Rpb249e25hbWU6XCJnZXN0dXJlXCJ9KX19fSxkZWZhdWx0czp7fSxnZXRDdXJzb3I6ZnVuY3Rpb24oKXtyZXR1cm5cIlwifX0sWXI9WHI7QXIuZGVmYXVsdD1Zcjt2YXIgTnI9e307ZnVuY3Rpb24gTHIodCl7cmV0dXJuKExyPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoTnIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksTnIuZGVmYXVsdD12b2lkIDA7dmFyIEJyLFZyPUhyKCQpLHFyPShCcj1jdCkmJkJyLl9fZXNNb2R1bGU/QnI6e2RlZmF1bHQ6QnJ9LFVyPUhyKHcpO2Z1bmN0aW9uIEdyKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gR3I9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBIcih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1Mcih0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1HcigpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIEtyKHQsZSxuLHIsbyxpLGEpe2lmKCFlKXJldHVybiExO2lmKCEwPT09ZSl7dmFyIHU9VXIubnVtYmVyKGkud2lkdGgpP2kud2lkdGg6aS5yaWdodC1pLmxlZnQscz1Vci5udW1iZXIoaS5oZWlnaHQpP2kuaGVpZ2h0OmkuYm90dG9tLWkudG9wO2lmKGE9TWF0aC5taW4oYSwoXCJsZWZ0XCI9PT10fHxcInJpZ2h0XCI9PT10P3U6cykvMiksdTwwJiYoXCJsZWZ0XCI9PT10P3Q9XCJyaWdodFwiOlwicmlnaHRcIj09PXQmJih0PVwibGVmdFwiKSksczwwJiYoXCJ0b3BcIj09PXQ/dD1cImJvdHRvbVwiOlwiYm90dG9tXCI9PT10JiYodD1cInRvcFwiKSksXCJsZWZ0XCI9PT10KXJldHVybiBuLng8KDA8PXU/aS5sZWZ0OmkucmlnaHQpK2E7aWYoXCJ0b3BcIj09PXQpcmV0dXJuIG4ueTwoMDw9cz9pLnRvcDppLmJvdHRvbSkrYTtpZihcInJpZ2h0XCI9PT10KXJldHVybiBuLng+KDA8PXU/aS5yaWdodDppLmxlZnQpLWE7aWYoXCJib3R0b21cIj09PXQpcmV0dXJuIG4ueT4oMDw9cz9pLmJvdHRvbTppLnRvcCktYX1yZXR1cm4hIVVyLmVsZW1lbnQocikmJihVci5lbGVtZW50KGUpP2U9PT1yOlZyLm1hdGNoZXNVcFRvKHIsZSxvKSl9ZnVuY3Rpb24gJHIodCl7dmFyIGU9dC5pRXZlbnQsbj10LmludGVyYWN0aW9uO2lmKFwicmVzaXplXCI9PT1uLnByZXBhcmVkLm5hbWUmJm4ucmVzaXplQXhlcyl7dmFyIHI9ZTtuLmludGVyYWN0YWJsZS5vcHRpb25zLnJlc2l6ZS5zcXVhcmU/KFwieVwiPT09bi5yZXNpemVBeGVzP3IuZGVsdGEueD1yLmRlbHRhLnk6ci5kZWx0YS55PXIuZGVsdGEueCxyLmF4ZXM9XCJ4eVwiKTooci5heGVzPW4ucmVzaXplQXhlcyxcInhcIj09PW4ucmVzaXplQXhlcz9yLmRlbHRhLnk9MDpcInlcIj09PW4ucmVzaXplQXhlcyYmKHIuZGVsdGEueD0wKSl9fXZhciBacj17aWQ6XCJhY3Rpb25zL3Jlc2l6ZVwiLGJlZm9yZTpbXCJhY3Rpb25zL2RyYWdcIl0saW5zdGFsbDpmdW5jdGlvbihlKXt2YXIgdD1lLmFjdGlvbnMsbj1lLmJyb3dzZXIscj1lLkludGVyYWN0YWJsZSxvPWUuZGVmYXVsdHM7WnIuY3Vyc29ycz1uLmlzSWU5P3t4OlwiZS1yZXNpemVcIix5Olwicy1yZXNpemVcIix4eTpcInNlLXJlc2l6ZVwiLHRvcDpcIm4tcmVzaXplXCIsbGVmdDpcInctcmVzaXplXCIsYm90dG9tOlwicy1yZXNpemVcIixyaWdodDpcImUtcmVzaXplXCIsdG9wbGVmdDpcInNlLXJlc2l6ZVwiLGJvdHRvbXJpZ2h0Olwic2UtcmVzaXplXCIsdG9wcmlnaHQ6XCJuZS1yZXNpemVcIixib3R0b21sZWZ0OlwibmUtcmVzaXplXCJ9Ont4OlwiZXctcmVzaXplXCIseTpcIm5zLXJlc2l6ZVwiLHh5OlwibndzZS1yZXNpemVcIix0b3A6XCJucy1yZXNpemVcIixsZWZ0OlwiZXctcmVzaXplXCIsYm90dG9tOlwibnMtcmVzaXplXCIscmlnaHQ6XCJldy1yZXNpemVcIix0b3BsZWZ0OlwibndzZS1yZXNpemVcIixib3R0b21yaWdodDpcIm53c2UtcmVzaXplXCIsdG9wcmlnaHQ6XCJuZXN3LXJlc2l6ZVwiLGJvdHRvbWxlZnQ6XCJuZXN3LXJlc2l6ZVwifSxaci5kZWZhdWx0TWFyZ2luPW4uc3VwcG9ydHNUb3VjaHx8bi5zdXBwb3J0c1BvaW50ZXJFdmVudD8yMDoxMCxyLnByb3RvdHlwZS5yZXNpemFibGU9ZnVuY3Rpb24odCl7cmV0dXJuIGZ1bmN0aW9uKHQsZSxuKXtpZihVci5vYmplY3QoZSkpcmV0dXJuIHQub3B0aW9ucy5yZXNpemUuZW5hYmxlZD0hMSE9PWUuZW5hYmxlZCx0LnNldFBlckFjdGlvbihcInJlc2l6ZVwiLGUpLHQuc2V0T25FdmVudHMoXCJyZXNpemVcIixlKSxVci5zdHJpbmcoZS5heGlzKSYmL154JHxeeSR8Xnh5JC8udGVzdChlLmF4aXMpP3Qub3B0aW9ucy5yZXNpemUuYXhpcz1lLmF4aXM6bnVsbD09PWUuYXhpcyYmKHQub3B0aW9ucy5yZXNpemUuYXhpcz1uLmRlZmF1bHRzLmFjdGlvbnMucmVzaXplLmF4aXMpLFVyLmJvb2woZS5wcmVzZXJ2ZUFzcGVjdFJhdGlvKT90Lm9wdGlvbnMucmVzaXplLnByZXNlcnZlQXNwZWN0UmF0aW89ZS5wcmVzZXJ2ZUFzcGVjdFJhdGlvOlVyLmJvb2woZS5zcXVhcmUpJiYodC5vcHRpb25zLnJlc2l6ZS5zcXVhcmU9ZS5zcXVhcmUpLHQ7aWYoVXIuYm9vbChlKSlyZXR1cm4gdC5vcHRpb25zLnJlc2l6ZS5lbmFibGVkPWUsdDtyZXR1cm4gdC5vcHRpb25zLnJlc2l6ZX0odGhpcyx0LGUpfSx0Lm1hcC5yZXNpemU9WnIsdC5tZXRob2REaWN0LnJlc2l6ZT1cInJlc2l6YWJsZVwiLG8uYWN0aW9ucy5yZXNpemU9WnIuZGVmYXVsdHN9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dC5pbnRlcmFjdGlvbi5yZXNpemVBeGVzPVwieHlcIn0sXCJpbnRlcmFjdGlvbnM6YWN0aW9uLXN0YXJ0XCI6ZnVuY3Rpb24odCl7IWZ1bmN0aW9uKHQpe3ZhciBlPXQuaUV2ZW50LG49dC5pbnRlcmFjdGlvbjtpZihcInJlc2l6ZVwiPT09bi5wcmVwYXJlZC5uYW1lJiZuLnByZXBhcmVkLmVkZ2VzKXt2YXIgcj1lLG89bi5yZWN0O24uX3JlY3RzPXtzdGFydDooMCxxci5kZWZhdWx0KSh7fSxvKSxjb3JyZWN0ZWQ6KDAscXIuZGVmYXVsdCkoe30sbykscHJldmlvdXM6KDAscXIuZGVmYXVsdCkoe30sbyksZGVsdGE6e2xlZnQ6MCxyaWdodDowLHdpZHRoOjAsdG9wOjAsYm90dG9tOjAsaGVpZ2h0OjB9fSxyLmVkZ2VzPW4ucHJlcGFyZWQuZWRnZXMsci5yZWN0PW4uX3JlY3RzLmNvcnJlY3RlZCxyLmRlbHRhUmVjdD1uLl9yZWN0cy5kZWx0YX19KHQpLCRyKHQpfSxcImludGVyYWN0aW9uczphY3Rpb24tbW92ZVwiOmZ1bmN0aW9uKHQpeyFmdW5jdGlvbih0KXt2YXIgZT10LmlFdmVudCxuPXQuaW50ZXJhY3Rpb247aWYoXCJyZXNpemVcIj09PW4ucHJlcGFyZWQubmFtZSYmbi5wcmVwYXJlZC5lZGdlcyl7dmFyIHI9ZSxvPW4uaW50ZXJhY3RhYmxlLm9wdGlvbnMucmVzaXplLmludmVydCxpPVwicmVwb3NpdGlvblwiPT09b3x8XCJuZWdhdGVcIj09PW8sYT1uLnJlY3QsdT1uLl9yZWN0cyxzPXUuc3RhcnQsbD11LmNvcnJlY3RlZCxjPXUuZGVsdGEsZj11LnByZXZpb3VzO2lmKCgwLHFyLmRlZmF1bHQpKGYsbCksaSl7aWYoKDAscXIuZGVmYXVsdCkobCxhKSxcInJlcG9zaXRpb25cIj09PW8pe2lmKGwudG9wPmwuYm90dG9tKXt2YXIgcD1sLnRvcDtsLnRvcD1sLmJvdHRvbSxsLmJvdHRvbT1wfWlmKGwubGVmdD5sLnJpZ2h0KXt2YXIgZD1sLmxlZnQ7bC5sZWZ0PWwucmlnaHQsbC5yaWdodD1kfX19ZWxzZSBsLnRvcD1NYXRoLm1pbihhLnRvcCxzLmJvdHRvbSksbC5ib3R0b209TWF0aC5tYXgoYS5ib3R0b20scy50b3ApLGwubGVmdD1NYXRoLm1pbihhLmxlZnQscy5yaWdodCksbC5yaWdodD1NYXRoLm1heChhLnJpZ2h0LHMubGVmdCk7Zm9yKHZhciB2IGluIGwud2lkdGg9bC5yaWdodC1sLmxlZnQsbC5oZWlnaHQ9bC5ib3R0b20tbC50b3AsbCljW3ZdPWxbdl0tZlt2XTtyLmVkZ2VzPW4ucHJlcGFyZWQuZWRnZXMsci5yZWN0PWwsci5kZWx0YVJlY3Q9Y319KHQpLCRyKHQpfSxcImludGVyYWN0aW9uczphY3Rpb24tZW5kXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pRXZlbnQsbj10LmludGVyYWN0aW9uO2lmKFwicmVzaXplXCI9PT1uLnByZXBhcmVkLm5hbWUmJm4ucHJlcGFyZWQuZWRnZXMpe3ZhciByPWU7ci5lZGdlcz1uLnByZXBhcmVkLmVkZ2VzLHIucmVjdD1uLl9yZWN0cy5jb3JyZWN0ZWQsci5kZWx0YVJlY3Q9bi5fcmVjdHMuZGVsdGF9fSxcImF1dG8tc3RhcnQ6Y2hlY2tcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5pbnRlcmFjdGFibGUscj10LmVsZW1lbnQsbz10LnJlY3QsaT10LmJ1dHRvbnM7aWYobyl7dmFyIGE9KDAscXIuZGVmYXVsdCkoe30sZS5jb29yZHMuY3VyLnBhZ2UpLHU9bi5vcHRpb25zLnJlc2l6ZTtpZih1JiZ1LmVuYWJsZWQmJighZS5wb2ludGVySXNEb3dufHwhL21vdXNlfHBvaW50ZXIvLnRlc3QoZS5wb2ludGVyVHlwZSl8fDAhPShpJnUubW91c2VCdXR0b25zKSkpe2lmKFVyLm9iamVjdCh1LmVkZ2VzKSl7dmFyIHM9e2xlZnQ6ITEscmlnaHQ6ITEsdG9wOiExLGJvdHRvbTohMX07Zm9yKHZhciBsIGluIHMpc1tsXT1LcihsLHUuZWRnZXNbbF0sYSxlLl9sYXRlc3RQb2ludGVyLmV2ZW50VGFyZ2V0LHIsbyx1Lm1hcmdpbnx8WnIuZGVmYXVsdE1hcmdpbik7cy5sZWZ0PXMubGVmdCYmIXMucmlnaHQscy50b3A9cy50b3AmJiFzLmJvdHRvbSwocy5sZWZ0fHxzLnJpZ2h0fHxzLnRvcHx8cy5ib3R0b20pJiYodC5hY3Rpb249e25hbWU6XCJyZXNpemVcIixlZGdlczpzfSl9ZWxzZXt2YXIgYz1cInlcIiE9PXUuYXhpcyYmYS54Pm8ucmlnaHQtWnIuZGVmYXVsdE1hcmdpbixmPVwieFwiIT09dS5heGlzJiZhLnk+by5ib3R0b20tWnIuZGVmYXVsdE1hcmdpbjsoY3x8ZikmJih0LmFjdGlvbj17bmFtZTpcInJlc2l6ZVwiLGF4ZXM6KGM/XCJ4XCI6XCJcIikrKGY/XCJ5XCI6XCJcIil9KX1yZXR1cm4hdC5hY3Rpb24mJnZvaWQgMH19fX0sZGVmYXVsdHM6e3NxdWFyZTohMSxwcmVzZXJ2ZUFzcGVjdFJhdGlvOiExLGF4aXM6XCJ4eVwiLG1hcmdpbjpOYU4sZWRnZXM6bnVsbCxpbnZlcnQ6XCJub25lXCJ9LGN1cnNvcnM6bnVsbCxnZXRDdXJzb3I6ZnVuY3Rpb24odCl7dmFyIGU9dC5lZGdlcyxuPXQuYXhpcyxyPXQubmFtZSxvPVpyLmN1cnNvcnMsaT1udWxsO2lmKG4paT1vW3Irbl07ZWxzZSBpZihlKXtmb3IodmFyIGE9XCJcIix1PVtcInRvcFwiLFwiYm90dG9tXCIsXCJsZWZ0XCIsXCJyaWdodFwiXSxzPTA7czx1Lmxlbmd0aDtzKyspe3ZhciBsPXVbc107ZVtsXSYmKGErPWwpfWk9b1thXX1yZXR1cm4gaX0sZGVmYXVsdE1hcmdpbjpudWxsfSxKcj1acjtOci5kZWZhdWx0PUpyO3ZhciBRcj17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUXIsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFFyLFwiZHJhZ1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB0by5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShRcixcImRyb3BcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZW8uZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkoUXIsXCJnZXN0dXJlXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIG5vLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFFyLFwicmVzaXplXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIHJvLmRlZmF1bHR9fSksUXIuZGVmYXVsdD12b2lkIDA7dmFyIHRvPW9vKHYpLGVvPW9vKG1yKSxubz1vbyhBcikscm89b28oTnIpO2Z1bmN0aW9uIG9vKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgaW89e2lkOlwiYWN0aW9uc1wiLGluc3RhbGw6ZnVuY3Rpb24odCl7dC51c2VQbHVnaW4obm8uZGVmYXVsdCksdC51c2VQbHVnaW4ocm8uZGVmYXVsdCksdC51c2VQbHVnaW4odG8uZGVmYXVsdCksdC51c2VQbHVnaW4oZW8uZGVmYXVsdCl9fTtRci5kZWZhdWx0PWlvO3ZhciBhbz17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoYW8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksYW8uZGVmYXVsdD12b2lkIDA7YW8uZGVmYXVsdD17fTt2YXIgdW89e307ZnVuY3Rpb24gc28odCl7cmV0dXJuKHNvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkodW8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdW8uZ2V0Q29udGFpbmVyPWdvLHVvLmdldFNjcm9sbD1ibyx1by5nZXRTY3JvbGxTaXplPWZ1bmN0aW9uKHQpe2ZvLndpbmRvdyh0KSYmKHQ9d2luZG93LmRvY3VtZW50LmJvZHkpO3JldHVybnt4OnQuc2Nyb2xsV2lkdGgseTp0LnNjcm9sbEhlaWdodH19LHVvLmdldFNjcm9sbFNpemVEZWx0YT1mdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LmVsZW1lbnQsbz1uJiZuLmludGVyYWN0YWJsZS5vcHRpb25zW24ucHJlcGFyZWQubmFtZV0uYXV0b1Njcm9sbDtpZighb3x8IW8uZW5hYmxlZClyZXR1cm4gZSgpLHt4OjAseTowfTt2YXIgaT1nbyhvLmNvbnRhaW5lcixuLmludGVyYWN0YWJsZSxyKSxhPWJvKGkpO2UoKTt2YXIgdT1ibyhpKTtyZXR1cm57eDp1LngtYS54LHk6dS55LWEueX19LHVvLmRlZmF1bHQ9dm9pZCAwO3ZhciBsbyxjbz15bygkKSxmbz15byh3KSxwbz0obG89b2UpJiZsby5fX2VzTW9kdWxlP2xvOntkZWZhdWx0OmxvfTtmdW5jdGlvbiB2bygpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIHZvPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24geW8odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09c28odCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9dm8oKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn12YXIgaG89e2RlZmF1bHRzOntlbmFibGVkOiExLG1hcmdpbjo2MCxjb250YWluZXI6bnVsbCxzcGVlZDozMDB9LG5vdzpEYXRlLm5vdyxpbnRlcmFjdGlvbjpudWxsLGk6MCx4OjAseTowLGlzU2Nyb2xsaW5nOiExLHByZXZUaW1lOjAsbWFyZ2luOjAsc3BlZWQ6MCxzdGFydDpmdW5jdGlvbih0KXtoby5pc1Njcm9sbGluZz0hMCxwby5kZWZhdWx0LmNhbmNlbChoby5pKSwodC5hdXRvU2Nyb2xsPWhvKS5pbnRlcmFjdGlvbj10LGhvLnByZXZUaW1lPWhvLm5vdygpLGhvLmk9cG8uZGVmYXVsdC5yZXF1ZXN0KGhvLnNjcm9sbCl9LHN0b3A6ZnVuY3Rpb24oKXtoby5pc1Njcm9sbGluZz0hMSxoby5pbnRlcmFjdGlvbiYmKGhvLmludGVyYWN0aW9uLmF1dG9TY3JvbGw9bnVsbCkscG8uZGVmYXVsdC5jYW5jZWwoaG8uaSl9LHNjcm9sbDpmdW5jdGlvbigpe3ZhciB0PWhvLmludGVyYWN0aW9uLGU9dC5pbnRlcmFjdGFibGUsbj10LmVsZW1lbnQscj10LnByZXBhcmVkLm5hbWUsbz1lLm9wdGlvbnNbcl0uYXV0b1Njcm9sbCxpPWdvKG8uY29udGFpbmVyLGUsbiksYT1oby5ub3coKSx1PShhLWhvLnByZXZUaW1lKS8xZTMscz1vLnNwZWVkKnU7aWYoMTw9cyl7dmFyIGw9e3g6aG8ueCpzLHk6aG8ueSpzfTtpZihsLnh8fGwueSl7dmFyIGM9Ym8oaSk7Zm8ud2luZG93KGkpP2kuc2Nyb2xsQnkobC54LGwueSk6aSYmKGkuc2Nyb2xsTGVmdCs9bC54LGkuc2Nyb2xsVG9wKz1sLnkpO3ZhciBmPWJvKGkpLHA9e3g6Zi54LWMueCx5OmYueS1jLnl9OyhwLnh8fHAueSkmJmUuZmlyZSh7dHlwZTpcImF1dG9zY3JvbGxcIix0YXJnZXQ6bixpbnRlcmFjdGFibGU6ZSxkZWx0YTpwLGludGVyYWN0aW9uOnQsY29udGFpbmVyOml9KX1oby5wcmV2VGltZT1hfWhvLmlzU2Nyb2xsaW5nJiYocG8uZGVmYXVsdC5jYW5jZWwoaG8uaSksaG8uaT1wby5kZWZhdWx0LnJlcXVlc3QoaG8uc2Nyb2xsKSl9LGNoZWNrOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5vcHRpb25zO3JldHVybiBuW2VdLmF1dG9TY3JvbGwmJm5bZV0uYXV0b1Njcm9sbC5lbmFibGVkfSxvbkludGVyYWN0aW9uTW92ZTpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5wb2ludGVyO2lmKGUuaW50ZXJhY3RpbmcoKSYmaG8uY2hlY2soZS5pbnRlcmFjdGFibGUsZS5wcmVwYXJlZC5uYW1lKSlpZihlLnNpbXVsYXRpb24paG8ueD1oby55PTA7ZWxzZXt2YXIgcixvLGksYSx1PWUuaW50ZXJhY3RhYmxlLHM9ZS5lbGVtZW50LGw9ZS5wcmVwYXJlZC5uYW1lLGM9dS5vcHRpb25zW2xdLmF1dG9TY3JvbGwsZj1nbyhjLmNvbnRhaW5lcix1LHMpO2lmKGZvLndpbmRvdyhmKSlhPW4uY2xpZW50WDxoby5tYXJnaW4scj1uLmNsaWVudFk8aG8ubWFyZ2luLG89bi5jbGllbnRYPmYuaW5uZXJXaWR0aC1oby5tYXJnaW4saT1uLmNsaWVudFk+Zi5pbm5lckhlaWdodC1oby5tYXJnaW47ZWxzZXt2YXIgcD1jby5nZXRFbGVtZW50Q2xpZW50UmVjdChmKTthPW4uY2xpZW50WDxwLmxlZnQraG8ubWFyZ2luLHI9bi5jbGllbnRZPHAudG9wK2hvLm1hcmdpbixvPW4uY2xpZW50WD5wLnJpZ2h0LWhvLm1hcmdpbixpPW4uY2xpZW50WT5wLmJvdHRvbS1oby5tYXJnaW59aG8ueD1vPzE6YT8tMTowLGhvLnk9aT8xOnI/LTE6MCxoby5pc1Njcm9sbGluZ3x8KGhvLm1hcmdpbj1jLm1hcmdpbixoby5zcGVlZD1jLnNwZWVkLGhvLnN0YXJ0KGUpKX19fTtmdW5jdGlvbiBnbyh0LGUsbil7cmV0dXJuKGZvLnN0cmluZyh0KT8oMCwkdC5nZXRTdHJpbmdPcHRpb25SZXN1bHQpKHQsZSxuKTp0KXx8KDAsTy5nZXRXaW5kb3cpKG4pfWZ1bmN0aW9uIGJvKHQpe3JldHVybiBmby53aW5kb3codCkmJih0PXdpbmRvdy5kb2N1bWVudC5ib2R5KSx7eDp0LnNjcm9sbExlZnQseTp0LnNjcm9sbFRvcH19dmFyIG1vPXtpZDpcImF1dG8tc2Nyb2xsXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt2YXIgZT10LmRlZmF1bHRzLG49dC5hY3Rpb25zOyh0LmF1dG9TY3JvbGw9aG8pLm5vdz1mdW5jdGlvbigpe3JldHVybiB0Lm5vdygpfSxuLnBoYXNlbGVzc1R5cGVzLmF1dG9zY3JvbGw9ITAsZS5wZXJBY3Rpb24uYXV0b1Njcm9sbD1oby5kZWZhdWx0c30sbGlzdGVuZXJzOntcImludGVyYWN0aW9uczpuZXdcIjpmdW5jdGlvbih0KXt0LmludGVyYWN0aW9uLmF1dG9TY3JvbGw9bnVsbH0sXCJpbnRlcmFjdGlvbnM6ZGVzdHJveVwiOmZ1bmN0aW9uKHQpe3QuaW50ZXJhY3Rpb24uYXV0b1Njcm9sbD1udWxsLGhvLnN0b3AoKSxoby5pbnRlcmFjdGlvbiYmKGhvLmludGVyYWN0aW9uPW51bGwpfSxcImludGVyYWN0aW9uczpzdG9wXCI6aG8uc3RvcCxcImludGVyYWN0aW9uczphY3Rpb24tbW92ZVwiOmZ1bmN0aW9uKHQpe3JldHVybiBoby5vbkludGVyYWN0aW9uTW92ZSh0KX19fTt1by5kZWZhdWx0PW1vO3ZhciBPbz17fTtmdW5jdGlvbiB3byh0KXtyZXR1cm4od289XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShPbyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxPby5kZWZhdWx0PXZvaWQgMDt2YXIgX289ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09d28odCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9UG8oKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0odyk7ZnVuY3Rpb24gUG8oKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBQbz1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIHhvKHQpe3JldHVybiBfby5ib29sKHQpPyh0aGlzLm9wdGlvbnMuc3R5bGVDdXJzb3I9dCx0aGlzKTpudWxsPT09dD8oZGVsZXRlIHRoaXMub3B0aW9ucy5zdHlsZUN1cnNvcix0aGlzKTp0aGlzLm9wdGlvbnMuc3R5bGVDdXJzb3J9ZnVuY3Rpb24gU28odCl7cmV0dXJuIF9vLmZ1bmModCk/KHRoaXMub3B0aW9ucy5hY3Rpb25DaGVja2VyPXQsdGhpcyk6bnVsbD09PXQ/KGRlbGV0ZSB0aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcix0aGlzKTp0aGlzLm9wdGlvbnMuYWN0aW9uQ2hlY2tlcn12YXIgam89e2lkOlwiYXV0by1zdGFydC9pbnRlcmFjdGFibGVNZXRob2RzXCIsaW5zdGFsbDpmdW5jdGlvbihkKXt2YXIgdD1kLkludGVyYWN0YWJsZTt0LnByb3RvdHlwZS5nZXRBY3Rpb249ZnVuY3Rpb24odCxlLG4scil7dmFyIG8saSxhLHUscyxsLGMsZixwPShpPWUsYT1uLHU9cixzPWQsbD0obz10aGlzKS5nZXRSZWN0KHUpLGM9aS5idXR0b25zfHx7MDoxLDE6NCwzOjgsNDoxNn1baS5idXR0b25dLGY9e2FjdGlvbjpudWxsLGludGVyYWN0YWJsZTpvLGludGVyYWN0aW9uOmEsZWxlbWVudDp1LHJlY3Q6bCxidXR0b25zOmN9LHMuZmlyZShcImF1dG8tc3RhcnQ6Y2hlY2tcIixmKSxmLmFjdGlvbik7cmV0dXJuIHRoaXMub3B0aW9ucy5hY3Rpb25DaGVja2VyP3RoaXMub3B0aW9ucy5hY3Rpb25DaGVja2VyKHQsZSxwLHRoaXMscixuKTpwfSx0LnByb3RvdHlwZS5pZ25vcmVGcm9tPSgwLGxlLndhcm5PbmNlKShmdW5jdGlvbih0KXtyZXR1cm4gdGhpcy5fYmFja0NvbXBhdE9wdGlvbihcImlnbm9yZUZyb21cIix0KX0sXCJJbnRlcmFjdGFibGUuaWdub3JlRnJvbSgpIGhhcyBiZWVuIGRlcHJlY2F0ZWQuIFVzZSBJbnRlcmFjdGJsZS5kcmFnZ2FibGUoe2lnbm9yZUZyb206IG5ld1ZhbHVlfSkuXCIpLHQucHJvdG90eXBlLmFsbG93RnJvbT0oMCxsZS53YXJuT25jZSkoZnVuY3Rpb24odCl7cmV0dXJuIHRoaXMuX2JhY2tDb21wYXRPcHRpb24oXCJhbGxvd0Zyb21cIix0KX0sXCJJbnRlcmFjdGFibGUuYWxsb3dGcm9tKCkgaGFzIGJlZW4gZGVwcmVjYXRlZC4gVXNlIEludGVyYWN0YmxlLmRyYWdnYWJsZSh7YWxsb3dGcm9tOiBuZXdWYWx1ZX0pLlwiKSx0LnByb3RvdHlwZS5hY3Rpb25DaGVja2VyPVNvLHQucHJvdG90eXBlLnN0eWxlQ3Vyc29yPXhvfX07T28uZGVmYXVsdD1qbzt2YXIgTW89e307ZnVuY3Rpb24ga28odCl7cmV0dXJuKGtvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoTW8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksTW8uZGVmYXVsdD12b2lkIDA7dmFyIEVvLFRvPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PWtvKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPUlvKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KGxlKSxEbz0oRW89T28pJiZFby5fX2VzTW9kdWxlP0VvOntkZWZhdWx0OkVvfTtmdW5jdGlvbiBJbygpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIElvPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gem8odCxlLG4scixvKXtyZXR1cm4gZS50ZXN0SWdub3JlQWxsb3coZS5vcHRpb25zW3QubmFtZV0sbixyKSYmZS5vcHRpb25zW3QubmFtZV0uZW5hYmxlZCYmUm8oZSxuLHQsbyk/dDpudWxsfWZ1bmN0aW9uIEFvKHQsZSxuLHIsbyxpLGEpe2Zvcih2YXIgdT0wLHM9ci5sZW5ndGg7dTxzO3UrKyl7dmFyIGw9clt1XSxjPW9bdV0sZj1sLmdldEFjdGlvbihlLG4sdCxjKTtpZihmKXt2YXIgcD16byhmLGwsYyxpLGEpO2lmKHApcmV0dXJue2FjdGlvbjpwLGludGVyYWN0YWJsZTpsLGVsZW1lbnQ6Y319fXJldHVybnthY3Rpb246bnVsbCxpbnRlcmFjdGFibGU6bnVsbCxlbGVtZW50Om51bGx9fWZ1bmN0aW9uIENvKHQsZSxuLHIsbyl7dmFyIGk9W10sYT1bXSx1PXI7ZnVuY3Rpb24gcyh0KXtpLnB1c2godCksYS5wdXNoKHUpfWZvcig7VG8uaXMuZWxlbWVudCh1KTspe2k9W10sYT1bXSxvLmludGVyYWN0YWJsZXMuZm9yRWFjaE1hdGNoKHUscyk7dmFyIGw9QW8odCxlLG4saSxhLHIsbyk7aWYobC5hY3Rpb24mJiFsLmludGVyYWN0YWJsZS5vcHRpb25zW2wuYWN0aW9uLm5hbWVdLm1hbnVhbFN0YXJ0KXJldHVybiBsO3U9VG8uZG9tLnBhcmVudE5vZGUodSl9cmV0dXJue2FjdGlvbjpudWxsLGludGVyYWN0YWJsZTpudWxsLGVsZW1lbnQ6bnVsbH19ZnVuY3Rpb24gV28odCxlLG4pe3ZhciByPWUuYWN0aW9uLG89ZS5pbnRlcmFjdGFibGUsaT1lLmVsZW1lbnQ7cj1yfHx7bmFtZTpudWxsfSx0LmludGVyYWN0YWJsZT1vLHQuZWxlbWVudD1pLFRvLmNvcHlBY3Rpb24odC5wcmVwYXJlZCxyKSx0LnJlY3Q9byYmci5uYW1lP28uZ2V0UmVjdChpKTpudWxsLFlvKHQsbiksbi5maXJlKFwiYXV0b1N0YXJ0OnByZXBhcmVkXCIse2ludGVyYWN0aW9uOnR9KX1mdW5jdGlvbiBSbyh0LGUsbixyKXt2YXIgbz10Lm9wdGlvbnMsaT1vW24ubmFtZV0ubWF4LGE9b1tuLm5hbWVdLm1heFBlckVsZW1lbnQsdT1yLmF1dG9TdGFydC5tYXhJbnRlcmFjdGlvbnMscz0wLGw9MCxjPTA7aWYoIShpJiZhJiZ1KSlyZXR1cm4hMTtmb3IodmFyIGY9MDtmPHIuaW50ZXJhY3Rpb25zLmxpc3QubGVuZ3RoO2YrKyl7dmFyIHA9ci5pbnRlcmFjdGlvbnMubGlzdFtmXSxkPXAucHJlcGFyZWQubmFtZTtpZihwLmludGVyYWN0aW5nKCkpe2lmKHU8PSsrcylyZXR1cm4hMTtpZihwLmludGVyYWN0YWJsZT09PXQpe2lmKGk8PShsKz1kPT09bi5uYW1lPzE6MCkpcmV0dXJuITE7aWYocC5lbGVtZW50PT09ZSYmKGMrKyxkPT09bi5uYW1lJiZhPD1jKSlyZXR1cm4hMX19fXJldHVybiAwPHV9ZnVuY3Rpb24gRm8odCxlKXtyZXR1cm4gVG8uaXMubnVtYmVyKHQpPyhlLmF1dG9TdGFydC5tYXhJbnRlcmFjdGlvbnM9dCx0aGlzKTplLmF1dG9TdGFydC5tYXhJbnRlcmFjdGlvbnN9ZnVuY3Rpb24gWG8odCxlLG4pe3ZhciByPW4uYXV0b1N0YXJ0LmN1cnNvckVsZW1lbnQ7ciYmciE9PXQmJihyLnN0eWxlLmN1cnNvcj1cIlwiKSx0Lm93bmVyRG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LnN0eWxlLmN1cnNvcj1lLHQuc3R5bGUuY3Vyc29yPWUsbi5hdXRvU3RhcnQuY3Vyc29yRWxlbWVudD1lP3Q6bnVsbH1mdW5jdGlvbiBZbyh0LGUpe3ZhciBuPXQuaW50ZXJhY3RhYmxlLHI9dC5lbGVtZW50LG89dC5wcmVwYXJlZDtpZihcIm1vdXNlXCI9PT10LnBvaW50ZXJUeXBlJiZuJiZuLm9wdGlvbnMuc3R5bGVDdXJzb3Ipe3ZhciBpPVwiXCI7aWYoby5uYW1lKXt2YXIgYT1uLm9wdGlvbnNbby5uYW1lXS5jdXJzb3JDaGVja2VyO2k9VG8uaXMuZnVuYyhhKT9hKG8sbixyLHQuX2ludGVyYWN0aW5nKTplLmFjdGlvbnMubWFwW28ubmFtZV0uZ2V0Q3Vyc29yKG8pfVhvKHQuZWxlbWVudCxpfHxcIlwiLGUpfWVsc2UgZS5hdXRvU3RhcnQuY3Vyc29yRWxlbWVudCYmWG8oZS5hdXRvU3RhcnQuY3Vyc29yRWxlbWVudCxcIlwiLGUpfXZhciBObz17aWQ6XCJhdXRvLXN0YXJ0L2Jhc2VcIixiZWZvcmU6W1wiYWN0aW9uc1wiLFwiYWN0aW9ucy9kcmFnXCIsXCJhY3Rpb25zL3Jlc2l6ZVwiLFwiYWN0aW9ucy9nZXN0dXJlXCJdLGluc3RhbGw6ZnVuY3Rpb24oZSl7dmFyIHQ9ZS5pbnRlcmFjdFN0YXRpYyxuPWUuZGVmYXVsdHM7ZS51c2VQbHVnaW4oRG8uZGVmYXVsdCksbi5iYXNlLmFjdGlvbkNoZWNrZXI9bnVsbCxuLmJhc2Uuc3R5bGVDdXJzb3I9ITAsVG8uZXh0ZW5kKG4ucGVyQWN0aW9uLHttYW51YWxTdGFydDohMSxtYXg6MS8wLG1heFBlckVsZW1lbnQ6MSxhbGxvd0Zyb206bnVsbCxpZ25vcmVGcm9tOm51bGwsbW91c2VCdXR0b25zOjF9KSx0Lm1heEludGVyYWN0aW9ucz1mdW5jdGlvbih0KXtyZXR1cm4gRm8odCxlKX0sZS5hdXRvU3RhcnQ9e21heEludGVyYWN0aW9uczoxLzAsd2l0aGluSW50ZXJhY3Rpb25MaW1pdDpSbyxjdXJzb3JFbGVtZW50Om51bGx9fSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOmRvd25cIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LnBvaW50ZXIsbz10LmV2ZW50LGk9dC5ldmVudFRhcmdldDtuLmludGVyYWN0aW5nKCl8fFdvKG4sQ28obixyLG8saSxlKSxlKX0sXCJpbnRlcmFjdGlvbnM6bW92ZVwiOmZ1bmN0aW9uKHQsZSl7dmFyIG4scixvLGksYSx1O3I9ZSxvPShuPXQpLmludGVyYWN0aW9uLGk9bi5wb2ludGVyLGE9bi5ldmVudCx1PW4uZXZlbnRUYXJnZXQsXCJtb3VzZVwiIT09by5wb2ludGVyVHlwZXx8by5wb2ludGVySXNEb3dufHxvLmludGVyYWN0aW5nKCl8fFdvKG8sQ28obyxpLGEsdSxyKSxyKSxmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb247aWYobi5wb2ludGVySXNEb3duJiYhbi5pbnRlcmFjdGluZygpJiZuLnBvaW50ZXJXYXNNb3ZlZCYmbi5wcmVwYXJlZC5uYW1lKXtlLmZpcmUoXCJhdXRvU3RhcnQ6YmVmb3JlLXN0YXJ0XCIsdCk7dmFyIHI9bi5pbnRlcmFjdGFibGUsbz1uLnByZXBhcmVkLm5hbWU7byYmciYmKHIub3B0aW9uc1tvXS5tYW51YWxTdGFydHx8IVJvKHIsbi5lbGVtZW50LG4ucHJlcGFyZWQsZSk/bi5zdG9wKCk6KG4uc3RhcnQobi5wcmVwYXJlZCxyLG4uZWxlbWVudCksWW8obixlKSkpfX0odCxlKX0sXCJpbnRlcmFjdGlvbnM6c3RvcFwiOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPW4uaW50ZXJhY3RhYmxlO3ImJnIub3B0aW9ucy5zdHlsZUN1cnNvciYmWG8obi5lbGVtZW50LFwiXCIsZSl9fSxtYXhJbnRlcmFjdGlvbnM6Rm8sd2l0aGluSW50ZXJhY3Rpb25MaW1pdDpSbyx2YWxpZGF0ZUFjdGlvbjp6b307TW8uZGVmYXVsdD1Obzt2YXIgTG89e307ZnVuY3Rpb24gQm8odCl7cmV0dXJuKEJvPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoTG8sXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksTG8uZGVmYXVsdD12b2lkIDA7dmFyIFZvLHFvPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PUJvKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPUdvKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHcpLFVvPShWbz1NbykmJlZvLl9fZXNNb2R1bGU/Vm86e2RlZmF1bHQ6Vm99O2Z1bmN0aW9uIEdvKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gR289ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH12YXIgSG89e2lkOlwiYXV0by1zdGFydC9kcmFnQXhpc1wiLGxpc3RlbmVyczp7XCJhdXRvU3RhcnQ6YmVmb3JlLXN0YXJ0XCI6ZnVuY3Rpb24odCxyKXt2YXIgbz10LmludGVyYWN0aW9uLGk9dC5ldmVudFRhcmdldCxlPXQuZHgsbj10LmR5O2lmKFwiZHJhZ1wiPT09by5wcmVwYXJlZC5uYW1lKXt2YXIgYT1NYXRoLmFicyhlKSx1PU1hdGguYWJzKG4pLHM9by5pbnRlcmFjdGFibGUub3B0aW9ucy5kcmFnLGw9cy5zdGFydEF4aXMsYz11PGE/XCJ4XCI6YTx1P1wieVwiOlwieHlcIjtpZihvLnByZXBhcmVkLmF4aXM9XCJzdGFydFwiPT09cy5sb2NrQXhpcz9jWzBdOnMubG9ja0F4aXMsXCJ4eVwiIT1jJiZcInh5XCIhPT1sJiZsIT09Yyl7by5wcmVwYXJlZC5uYW1lPW51bGw7ZnVuY3Rpb24gZih0KXtpZih0IT09by5pbnRlcmFjdGFibGUpe3ZhciBlPW8uaW50ZXJhY3RhYmxlLm9wdGlvbnMuZHJhZztpZighZS5tYW51YWxTdGFydCYmdC50ZXN0SWdub3JlQWxsb3coZSxwLGkpKXt2YXIgbj10LmdldEFjdGlvbihvLmRvd25Qb2ludGVyLG8uZG93bkV2ZW50LG8scCk7aWYobiYmXCJkcmFnXCI9PT1uLm5hbWUmJmZ1bmN0aW9uKHQsZSl7aWYoIWUpcmV0dXJuO3ZhciBuPWUub3B0aW9ucy5kcmFnLnN0YXJ0QXhpcztyZXR1cm5cInh5XCI9PT10fHxcInh5XCI9PT1ufHxuPT09dH0oYyx0KSYmVW8uZGVmYXVsdC52YWxpZGF0ZUFjdGlvbihuLHQscCxpLHIpKXJldHVybiB0fX19Zm9yKHZhciBwPWk7cW8uZWxlbWVudChwKTspe3ZhciBkPXIuaW50ZXJhY3RhYmxlcy5mb3JFYWNoTWF0Y2gocCxmKTtpZihkKXtvLnByZXBhcmVkLm5hbWU9XCJkcmFnXCIsby5pbnRlcmFjdGFibGU9ZCxvLmVsZW1lbnQ9cDticmVha31wPSgwLCQucGFyZW50Tm9kZSkocCl9fX19fX07TG8uZGVmYXVsdD1Ibzt2YXIgS289e307T2JqZWN0LmRlZmluZVByb3BlcnR5KEtvLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEtvLmRlZmF1bHQ9dm9pZCAwO3ZhciAkbyxabz0oJG89TW8pJiYkby5fX2VzTW9kdWxlPyRvOntkZWZhdWx0OiRvfTtmdW5jdGlvbiBKbyh0KXt2YXIgZT10LnByZXBhcmVkJiZ0LnByZXBhcmVkLm5hbWU7aWYoIWUpcmV0dXJuIG51bGw7dmFyIG49dC5pbnRlcmFjdGFibGUub3B0aW9ucztyZXR1cm4gbltlXS5ob2xkfHxuW2VdLmRlbGF5fXZhciBRbz17aWQ6XCJhdXRvLXN0YXJ0L2hvbGRcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPXQuZGVmYXVsdHM7dC51c2VQbHVnaW4oWm8uZGVmYXVsdCksZS5wZXJBY3Rpb24uaG9sZD0wLGUucGVyQWN0aW9uLmRlbGF5PTB9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dC5pbnRlcmFjdGlvbi5hdXRvU3RhcnRIb2xkVGltZXI9bnVsbH0sXCJhdXRvU3RhcnQ6cHJlcGFyZWRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49Sm8oZSk7MDxuJiYoZS5hdXRvU3RhcnRIb2xkVGltZXI9c2V0VGltZW91dChmdW5jdGlvbigpe2Uuc3RhcnQoZS5wcmVwYXJlZCxlLmludGVyYWN0YWJsZSxlLmVsZW1lbnQpfSxuKSl9LFwiaW50ZXJhY3Rpb25zOm1vdmVcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5kdXBsaWNhdGU7ZS5wb2ludGVyV2FzTW92ZWQmJiFuJiZjbGVhclRpbWVvdXQoZS5hdXRvU3RhcnRIb2xkVGltZXIpfSxcImF1dG9TdGFydDpiZWZvcmUtc3RhcnRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uOzA8Sm8oZSkmJihlLnByZXBhcmVkLm5hbWU9bnVsbCl9fSxnZXRIb2xkRHVyYXRpb246Sm99O0tvLmRlZmF1bHQ9UW87dmFyIHRpPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGksXCJhdXRvU3RhcnRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gZWkuZGVmYXVsdH19KSxPYmplY3QuZGVmaW5lUHJvcGVydHkodGksXCJkcmFnQXhpc1wiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBuaS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aSxcImhvbGRcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4gcmkuZGVmYXVsdH19KSx0aS5kZWZhdWx0PXZvaWQgMDt2YXIgZWk9b2koTW8pLG5pPW9pKExvKSxyaT1vaShLbyk7ZnVuY3Rpb24gb2kodCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciBpaT17aWQ6XCJhdXRvLXN0YXJ0XCIsaW5zdGFsbDpmdW5jdGlvbih0KXt0LnVzZVBsdWdpbihlaS5kZWZhdWx0KSx0LnVzZVBsdWdpbihyaS5kZWZhdWx0KSx0LnVzZVBsdWdpbihuaS5kZWZhdWx0KX19O3RpLmRlZmF1bHQ9aWk7dmFyIGFpPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShhaSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxhaS5kZWZhdWx0PXZvaWQgMDthaS5kZWZhdWx0PXt9O3ZhciB1aT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkodWksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksdWkuZGVmYXVsdD12b2lkIDA7dWkuZGVmYXVsdD17fTt2YXIgc2k9e307ZnVuY3Rpb24gbGkodCl7cmV0dXJuKGxpPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoc2ksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksc2kuZGVmYXVsdD12b2lkIDA7dmFyIGNpLGZpLHBpPWhpKEQpLGRpPShoaShjdCksZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09bGkodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9eWkoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0odykpLHZpPWhpKE8pO2Z1bmN0aW9uIHlpKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4geWk9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBoaSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19KGZpPWNpPWNpfHx7fSkudG91Y2hBY3Rpb249XCJ0b3VjaEFjdGlvblwiLGZpLmJveFNpemluZz1cImJveFNpemluZ1wiLGZpLm5vTGlzdGVuZXJzPVwibm9MaXN0ZW5lcnNcIjt2YXIgZ2k9e3RvdWNoQWN0aW9uOlwiaHR0cHM6Ly9kZXZlbG9wZXIubW96aWxsYS5vcmcvZW4tVVMvZG9jcy9XZWIvQ1NTL3RvdWNoLWFjdGlvblwiLGJveFNpemluZzpcImh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0NTUy9ib3gtc2l6aW5nXCJ9O2NpLnRvdWNoQWN0aW9uLGNpLmJveFNpemluZyxjaS5ub0xpc3RlbmVycztmdW5jdGlvbiBiaSh0LGUsbil7cmV0dXJuIG4udGVzdCh0LnN0eWxlW2VdfHx2aS5kZWZhdWx0LndpbmRvdy5nZXRDb21wdXRlZFN0eWxlKHQpW2VdKX12YXIgbWk9XCJkZXYtdG9vbHNcIixPaT17aWQ6bWksaW5zdGFsbDpmdW5jdGlvbigpe319O3NpLmRlZmF1bHQ9T2k7dmFyIHdpPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3aSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx3aS5kZWZhdWx0PXZvaWQgMDt3aS5kZWZhdWx0PXt9O3ZhciBfaT17fTtmdW5jdGlvbiBQaSh0KXtyZXR1cm4oUGk9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShfaSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxfaS5nZXRSZWN0T2Zmc2V0PUFpLF9pLmRlZmF1bHQ9dm9pZCAwO3ZhciB4aT1raShWKSxTaT1raShjdCksamk9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09UGkodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9TWkoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0oJHQpO2Z1bmN0aW9uIE1pKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gTWk9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBraSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gRWkodCxlKXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSlyZXR1cm4gdH0odCl8fGZ1bmN0aW9uKHQsZSl7aWYoIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHQpfHxcIltvYmplY3QgQXJndW1lbnRzXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpKSlyZXR1cm47dmFyIG49W10scj0hMCxvPSExLGk9dm9pZCAwO3RyeXtmb3IodmFyIGEsdT10W1N5bWJvbC5pdGVyYXRvcl0oKTshKHI9KGE9dS5uZXh0KCkpLmRvbmUpJiYobi5wdXNoKGEudmFsdWUpLCFlfHxuLmxlbmd0aCE9PWUpO3I9ITApO31jYXRjaCh0KXtvPSEwLGk9dH1maW5hbGx5e3RyeXtyfHxudWxsPT11LnJldHVybnx8dS5yZXR1cm4oKX1maW5hbGx5e2lmKG8pdGhyb3cgaX19cmV0dXJuIG59KHQsZSl8fGZ1bmN0aW9uKCl7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9KCl9ZnVuY3Rpb24gVGkodCxlKXtmb3IodmFyIG49MDtuPGUubGVuZ3RoO24rKyl7dmFyIHI9ZVtuXTtyLmVudW1lcmFibGU9ci5lbnVtZXJhYmxlfHwhMSxyLmNvbmZpZ3VyYWJsZT0hMCxcInZhbHVlXCJpbiByJiYoci53cml0YWJsZT0hMCksT2JqZWN0LmRlZmluZVByb3BlcnR5KHQsci5rZXkscil9fWZ1bmN0aW9uIERpKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH12YXIgSWk9ZnVuY3Rpb24oKXtmdW5jdGlvbiBlKHQpeyFmdW5jdGlvbih0LGUpe2lmKCEodCBpbnN0YW5jZW9mIGUpKXRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIil9KHRoaXMsZSksdGhpcy5pbnRlcmFjdGlvbj10LERpKHRoaXMsXCJzdGF0ZXNcIixbXSksRGkodGhpcyxcInN0YXJ0T2Zmc2V0XCIse2xlZnQ6MCxyaWdodDowLHRvcDowLGJvdHRvbTowfSksRGkodGhpcyxcInN0YXJ0RGVsdGFcIixudWxsKSxEaSh0aGlzLFwicmVzdWx0XCIsbnVsbCksRGkodGhpcyxcImVuZFJlc3VsdFwiLG51bGwpLERpKHRoaXMsXCJlZGdlc1wiLHZvaWQgMCksdGhpcy5yZXN1bHQ9emkoKX12YXIgdCxuLHI7cmV0dXJuIHQ9ZSwobj1be2tleTpcInN0YXJ0XCIsdmFsdWU6ZnVuY3Rpb24odCxlKXt2YXIgbj10LnBoYXNlLHI9dGhpcy5pbnRlcmFjdGlvbixvPWZ1bmN0aW9uKHQpe3ZhciBuPXQuaW50ZXJhY3RhYmxlLm9wdGlvbnNbdC5wcmVwYXJlZC5uYW1lXSxlPW4ubW9kaWZpZXJzO2lmKGUmJmUubGVuZ3RoKXJldHVybiBlLmZpbHRlcihmdW5jdGlvbih0KXtyZXR1cm4hdC5vcHRpb25zfHwhMSE9PXQub3B0aW9ucy5lbmFibGVkfSk7cmV0dXJuW1wic25hcFwiLFwic25hcFNpemVcIixcInNuYXBFZGdlc1wiLFwicmVzdHJpY3RcIixcInJlc3RyaWN0RWRnZXNcIixcInJlc3RyaWN0U2l6ZVwiXS5tYXAoZnVuY3Rpb24odCl7dmFyIGU9blt0XTtyZXR1cm4gZSYmZS5lbmFibGVkJiZ7b3B0aW9uczplLG1ldGhvZHM6ZS5fbWV0aG9kc319KS5maWx0ZXIoZnVuY3Rpb24odCl7cmV0dXJuISF0fSl9KHIpO3RoaXMucHJlcGFyZVN0YXRlcyhvKSx0aGlzLmVkZ2VzPSgwLFNpLmRlZmF1bHQpKHt9LHIuZWRnZXMpLHRoaXMuc3RhcnRPZmZzZXQ9QWkoci5yZWN0LGUpO3ZhciBpPXtwaGFzZTpuLHBhZ2VDb29yZHM6ZSxwcmVFbmQ6ISh0aGlzLnN0YXJ0RGVsdGE9e3g6MCx5OjB9KX07cmV0dXJuIHRoaXMucmVzdWx0PXppKCksdGhpcy5zdGFydEFsbChpKSx0aGlzLnJlc3VsdD10aGlzLnNldEFsbChpKX19LHtrZXk6XCJmaWxsQXJnXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5pbnRlcmFjdGlvbjt0LmludGVyYWN0aW9uPWUsdC5pbnRlcmFjdGFibGU9ZS5pbnRlcmFjdGFibGUsdC5lbGVtZW50PWUuZWxlbWVudCx0LnJlY3Q9dC5yZWN0fHxlLnJlY3QsdC5lZGdlcz10aGlzLmVkZ2VzLHQuc3RhcnRPZmZzZXQ9dGhpcy5zdGFydE9mZnNldH19LHtrZXk6XCJzdGFydEFsbFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3RoaXMuZmlsbEFyZyh0KTtmb3IodmFyIGU9MDtlPHRoaXMuc3RhdGVzLmxlbmd0aDtlKyspe3ZhciBuPXRoaXMuc3RhdGVzW2VdO24ubWV0aG9kcy5zdGFydCYmKHQuc3RhdGU9bikubWV0aG9kcy5zdGFydCh0KX19fSx7a2V5Olwic2V0QWxsXCIsdmFsdWU6ZnVuY3Rpb24odCl7dGhpcy5maWxsQXJnKHQpO3ZhciBlPXQucGhhc2Usbj10LnByZUVuZCxyPXQuc2tpcE1vZGlmaWVycyxvPXQucmVjdDt0LmNvb3Jkcz0oMCxTaS5kZWZhdWx0KSh7fSx0LnBhZ2VDb29yZHMpLHQucmVjdD0oMCxTaS5kZWZhdWx0KSh7fSxvKTtmb3IodmFyIGk9cj90aGlzLnN0YXRlcy5zbGljZShyKTp0aGlzLnN0YXRlcyxhPXppKHQuY29vcmRzLHQucmVjdCksdT0wO3U8aS5sZW5ndGg7dSsrKXt2YXIgcz1pW3VdLGw9cy5vcHRpb25zLGM9KDAsU2kuZGVmYXVsdCkoe30sdC5jb29yZHMpLGY9bnVsbDtzLm1ldGhvZHMuc2V0JiZ0aGlzLnNob3VsZERvKGwsbixlKSYmKGY9KHQuc3RhdGU9cykubWV0aG9kcy5zZXQodCksamkuYWRkRWRnZXModGhpcy5pbnRlcmFjdGlvbi5lZGdlcyx0LnJlY3Qse3g6dC5jb29yZHMueC1jLngseTp0LmNvb3Jkcy55LWMueX0pKSxhLmV2ZW50UHJvcHMucHVzaChmKX1hLmRlbHRhLng9dC5jb29yZHMueC10LnBhZ2VDb29yZHMueCxhLmRlbHRhLnk9dC5jb29yZHMueS10LnBhZ2VDb29yZHMueSxhLnJlY3REZWx0YS5sZWZ0PXQucmVjdC5sZWZ0LW8ubGVmdCxhLnJlY3REZWx0YS5yaWdodD10LnJlY3QucmlnaHQtby5yaWdodCxhLnJlY3REZWx0YS50b3A9dC5yZWN0LnRvcC1vLnRvcCxhLnJlY3REZWx0YS5ib3R0b209dC5yZWN0LmJvdHRvbS1vLmJvdHRvbTt2YXIgcD10aGlzLnJlc3VsdC5jb29yZHMsZD10aGlzLnJlc3VsdC5yZWN0O2lmKHAmJmQpe3ZhciB2PWEucmVjdC5sZWZ0IT09ZC5sZWZ0fHxhLnJlY3QucmlnaHQhPT1kLnJpZ2h0fHxhLnJlY3QudG9wIT09ZC50b3B8fGEucmVjdC5ib3R0b20hPT1kLmJvdHRvbTthLmNoYW5nZWQ9dnx8cC54IT09YS5jb29yZHMueHx8cC55IT09YS5jb29yZHMueX1yZXR1cm4gYX19LHtrZXk6XCJhcHBseVRvSW50ZXJhY3Rpb25cIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10aGlzLmludGVyYWN0aW9uLG49dC5waGFzZSxyPWUuY29vcmRzLmN1cixvPWUuY29vcmRzLnN0YXJ0LGk9dGhpcy5yZXN1bHQsYT10aGlzLnN0YXJ0RGVsdGEsdT1pLmRlbHRhO1wic3RhcnRcIj09PW4mJigwLFNpLmRlZmF1bHQpKHRoaXMuc3RhcnREZWx0YSxpLmRlbHRhKTtmb3IodmFyIHM9MDtzPFtbbyxhXSxbcix1XV0ubGVuZ3RoO3MrKyl7dmFyIGw9RWkoW1tvLGFdLFtyLHVdXVtzXSwyKSxjPWxbMF0sZj1sWzFdO2MucGFnZS54Kz1mLngsYy5wYWdlLnkrPWYueSxjLmNsaWVudC54Kz1mLngsYy5jbGllbnQueSs9Zi55fXZhciBwPXRoaXMucmVzdWx0LnJlY3REZWx0YSxkPXQucmVjdHx8ZS5yZWN0O2QubGVmdCs9cC5sZWZ0LGQucmlnaHQrPXAucmlnaHQsZC50b3ArPXAudG9wLGQuYm90dG9tKz1wLmJvdHRvbSxkLndpZHRoPWQucmlnaHQtZC5sZWZ0LGQuaGVpZ2h0PWQuYm90dG9tLWQudG9wfX0se2tleTpcInNldEFuZEFwcGx5XCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dGhpcy5pbnRlcmFjdGlvbixuPXQucGhhc2Uscj10LnByZUVuZCxvPXQuc2tpcE1vZGlmaWVycyxpPXRoaXMuc2V0QWxsKHtwcmVFbmQ6cixwaGFzZTpuLHBhZ2VDb29yZHM6dC5tb2RpZmllZENvb3Jkc3x8ZS5jb29yZHMuY3VyLnBhZ2V9KTtpZighKHRoaXMucmVzdWx0PWkpLmNoYW5nZWQmJighb3x8bzx0aGlzLnN0YXRlcy5sZW5ndGgpJiZlLmludGVyYWN0aW5nKCkpcmV0dXJuITE7aWYodC5tb2RpZmllZENvb3Jkcyl7dmFyIGE9ZS5jb29yZHMuY3VyLnBhZ2UsdT10Lm1vZGlmaWVkQ29vcmRzLngtYS54LHM9dC5tb2RpZmllZENvb3Jkcy55LWEueTtpLmNvb3Jkcy54Kz11LGkuY29vcmRzLnkrPXMsaS5kZWx0YS54Kz11LGkuZGVsdGEueSs9c310aGlzLmFwcGx5VG9JbnRlcmFjdGlvbih0KX19LHtrZXk6XCJiZWZvcmVFbmRcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5ldmVudCxyPXRoaXMuc3RhdGVzO2lmKHImJnIubGVuZ3RoKXtmb3IodmFyIG89ITEsaT0wO2k8ci5sZW5ndGg7aSsrKXt2YXIgYT1yW2ldLHU9KHQuc3RhdGU9YSkub3B0aW9ucyxzPWEubWV0aG9kcyxsPXMuYmVmb3JlRW5kJiZzLmJlZm9yZUVuZCh0KTtpZihsKXJldHVybiB0aGlzLmVuZFJlc3VsdD1sLCExO289b3x8IW8mJnRoaXMuc2hvdWxkRG8odSwhMCx0LnBoYXNlLCEwKX1vJiZlLm1vdmUoe2V2ZW50Om4scHJlRW5kOiEwfSl9fX0se2tleTpcInN0b3BcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uO2lmKHRoaXMuc3RhdGVzJiZ0aGlzLnN0YXRlcy5sZW5ndGgpe3ZhciBuPSgwLFNpLmRlZmF1bHQpKHtzdGF0ZXM6dGhpcy5zdGF0ZXMsaW50ZXJhY3RhYmxlOmUuaW50ZXJhY3RhYmxlLGVsZW1lbnQ6ZS5lbGVtZW50LHJlY3Q6bnVsbH0sdCk7dGhpcy5maWxsQXJnKG4pO2Zvcih2YXIgcj0wO3I8dGhpcy5zdGF0ZXMubGVuZ3RoO3IrKyl7dmFyIG89dGhpcy5zdGF0ZXNbcl07KG4uc3RhdGU9bykubWV0aG9kcy5zdG9wJiZvLm1ldGhvZHMuc3RvcChuKX10aGlzLnN0YXRlcz1udWxsLHRoaXMuZW5kUmVzdWx0PW51bGx9fX0se2tleTpcInByZXBhcmVTdGF0ZXNcIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnN0YXRlcz1bXTtmb3IodmFyIGU9MDtlPHQubGVuZ3RoO2UrKyl7dmFyIG49dFtlXSxyPW4ub3B0aW9ucyxvPW4ubWV0aG9kcyxpPW4ubmFtZTtyJiYhMT09PXIuZW5hYmxlZHx8dGhpcy5zdGF0ZXMucHVzaCh7b3B0aW9uczpyLG1ldGhvZHM6byxpbmRleDplLG5hbWU6aX0pfXJldHVybiB0aGlzLnN0YXRlc319LHtrZXk6XCJyZXN0b3JlSW50ZXJhY3Rpb25Db29yZHNcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49ZS5jb29yZHMscj1lLnJlY3Qsbz1lLm1vZGlmaWNhdGlvbjtpZihvLnJlc3VsdCl7Zm9yKHZhciBpPW8uc3RhcnREZWx0YSxhPW8ucmVzdWx0LHU9YS5kZWx0YSxzPWEucmVjdERlbHRhLGw9W1tuLnN0YXJ0LGldLFtuLmN1cix1XV0sYz0wO2M8bC5sZW5ndGg7YysrKXt2YXIgZj1FaShsW2NdLDIpLHA9ZlswXSxkPWZbMV07cC5wYWdlLngtPWQueCxwLnBhZ2UueS09ZC55LHAuY2xpZW50LngtPWQueCxwLmNsaWVudC55LT1kLnl9ci5sZWZ0LT1zLmxlZnQsci5yaWdodC09cy5yaWdodCxyLnRvcC09cy50b3Asci5ib3R0b20tPXMuYm90dG9tfX19LHtrZXk6XCJzaG91bGREb1wiLHZhbHVlOmZ1bmN0aW9uKHQsZSxuLHIpe3JldHVybiEoIXR8fCExPT09dC5lbmFibGVkfHxyJiYhdC5lbmRPbmx5fHx0LmVuZE9ubHkmJiFlfHxcInN0YXJ0XCI9PT1uJiYhdC5zZXRTdGFydCl9fSx7a2V5OlwiY29weUZyb21cIix2YWx1ZTpmdW5jdGlvbih0KXt0aGlzLnN0YXJ0T2Zmc2V0PXQuc3RhcnRPZmZzZXQsdGhpcy5zdGFydERlbHRhPXQuc3RhcnREZWx0YSx0aGlzLmVkZ2VzPXQuZWRnZXMsdGhpcy5zdGF0ZXM9dC5zdGF0ZXMubWFwKGZ1bmN0aW9uKHQpe3JldHVybigwLHhpLmRlZmF1bHQpKHQpfSksdGhpcy5yZXN1bHQ9emkoKDAsU2kuZGVmYXVsdCkoe30sdC5yZXN1bHQuY29vcmRzKSwoMCxTaS5kZWZhdWx0KSh7fSx0LnJlc3VsdC5yZWN0KSl9fSx7a2V5OlwiZGVzdHJveVwiLHZhbHVlOmZ1bmN0aW9uKCl7Zm9yKHZhciB0IGluIHRoaXMpdGhpc1t0XT1udWxsfX1dKSYmVGkodC5wcm90b3R5cGUsbiksciYmVGkodCxyKSxlfSgpO2Z1bmN0aW9uIHppKHQsZSl7cmV0dXJue3JlY3Q6ZSxjb29yZHM6dCxkZWx0YTp7eDowLHk6MH0scmVjdERlbHRhOntsZWZ0OjAscmlnaHQ6MCx0b3A6MCxib3R0b206MH0sZXZlbnRQcm9wczpbXSxjaGFuZ2VkOiEwfX1mdW5jdGlvbiBBaSh0LGUpe3JldHVybiB0P3tsZWZ0OmUueC10LmxlZnQsdG9wOmUueS10LnRvcCxyaWdodDp0LnJpZ2h0LWUueCxib3R0b206dC5ib3R0b20tZS55fTp7bGVmdDowLHRvcDowLHJpZ2h0OjAsYm90dG9tOjB9fV9pLmRlZmF1bHQ9SWk7dmFyIENpPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShDaSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxDaS5tYWtlTW9kaWZpZXI9ZnVuY3Rpb24odCxyKXtmdW5jdGlvbiBlKHQpe3ZhciBlPXR8fHt9O2Zvcih2YXIgbiBpbiBlLmVuYWJsZWQ9ITEhPT1lLmVuYWJsZWQsbyluIGluIGV8fChlW25dPW9bbl0pO3JldHVybntvcHRpb25zOmUsbWV0aG9kczppLG5hbWU6cn19dmFyIG89dC5kZWZhdWx0cyxpPXtzdGFydDp0LnN0YXJ0LHNldDp0LnNldCxiZWZvcmVFbmQ6dC5iZWZvcmVFbmQsc3RvcDp0LnN0b3B9O3ImJlwic3RyaW5nXCI9PXR5cGVvZiByJiYoZS5fZGVmYXVsdHM9byxlLl9tZXRob2RzPWkpO3JldHVybiBlfSxDaS5hZGRFdmVudE1vZGlmaWVycz1GaSxDaS5kZWZhdWx0PXZvaWQgMDt2YXIgV2ksUmk9KFdpPV9pKSYmV2kuX19lc01vZHVsZT9XaTp7ZGVmYXVsdDpXaX07ZnVuY3Rpb24gRmkodCl7dmFyIGU9dC5pRXZlbnQsbj10LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbi5yZXN1bHQ7biYmKGUubW9kaWZpZXJzPW4uZXZlbnRQcm9wcyl9dmFyIFhpPXtpZDpcIm1vZGlmaWVycy9iYXNlXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt0LmRlZmF1bHRzLnBlckFjdGlvbi5tb2RpZmllcnM9W119LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtlLm1vZGlmaWNhdGlvbj1uZXcgUmkuZGVmYXVsdChlKX0sXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1zdGFydFwiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24ubW9kaWZpY2F0aW9uO2Uuc3RhcnQodCx0LmludGVyYWN0aW9uLmNvb3Jkcy5zdGFydC5wYWdlKSx0LmludGVyYWN0aW9uLmVkZ2VzPWUuZWRnZXMsZS5hcHBseVRvSW50ZXJhY3Rpb24odCl9LFwiaW50ZXJhY3Rpb25zOmJlZm9yZS1hY3Rpb24tbW92ZVwiOmZ1bmN0aW9uKHQpe3JldHVybiB0LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbi5zZXRBbmRBcHBseSh0KX0sXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1lbmRcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24uYmVmb3JlRW5kKHQpfSxcImludGVyYWN0aW9uczphY3Rpb24tc3RhcnRcIjpGaSxcImludGVyYWN0aW9uczphY3Rpb24tbW92ZVwiOkZpLFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1lbmRcIjpGaSxcImludGVyYWN0aW9uczphZnRlci1hY3Rpb24tc3RhcnRcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24ucmVzdG9yZUludGVyYWN0aW9uQ29vcmRzKHQpfSxcImludGVyYWN0aW9uczphZnRlci1hY3Rpb24tbW92ZVwiOmZ1bmN0aW9uKHQpe3JldHVybiB0LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbi5yZXN0b3JlSW50ZXJhY3Rpb25Db29yZHModCl9LFwiaW50ZXJhY3Rpb25zOnN0b3BcIjpmdW5jdGlvbih0KXtyZXR1cm4gdC5pbnRlcmFjdGlvbi5tb2RpZmljYXRpb24uc3RvcCh0KX19LGJlZm9yZTpbXCJhY3Rpb25zXCIsXCJhY3Rpb24vZHJhZ1wiLFwiYWN0aW9ucy9yZXNpemVcIixcImFjdGlvbnMvZ2VzdHVyZVwiXX07Q2kuZGVmYXVsdD1YaTt2YXIgWWk9e307ZnVuY3Rpb24gTmkodCl7cmV0dXJuKE5pPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoWWksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksWWkuYWRkVG90YWw9VmksWWkuYXBwbHlQZW5kaW5nPVVpLFlpLmRlZmF1bHQ9dm9pZCAwO3ZhciBMaT1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1OaSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1CaSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSgkdCk7ZnVuY3Rpb24gQmkoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBCaT1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIFZpKHQpe3QucG9pbnRlcklzRG93biYmKEhpKHQuY29vcmRzLmN1cix0Lm9mZnNldC50b3RhbCksdC5vZmZzZXQucGVuZGluZy54PTAsdC5vZmZzZXQucGVuZGluZy55PTApfWZ1bmN0aW9uIHFpKHQpe1VpKHQuaW50ZXJhY3Rpb24pfWZ1bmN0aW9uIFVpKHQpe2lmKCEoZT10KS5vZmZzZXQucGVuZGluZy54JiYhZS5vZmZzZXQucGVuZGluZy55KXJldHVybiExO3ZhciBlLG49dC5vZmZzZXQucGVuZGluZztyZXR1cm4gSGkodC5jb29yZHMuY3VyLG4pLEhpKHQuY29vcmRzLmRlbHRhLG4pLExpLmFkZEVkZ2VzKHQuZWRnZXMsdC5yZWN0LG4pLG4ueD0wLCEobi55PTApfWZ1bmN0aW9uIEdpKHQpe3ZhciBlPXQueCxuPXQueTt0aGlzLm9mZnNldC5wZW5kaW5nLngrPWUsdGhpcy5vZmZzZXQucGVuZGluZy55Kz1uLHRoaXMub2Zmc2V0LnRvdGFsLngrPWUsdGhpcy5vZmZzZXQudG90YWwueSs9bn1mdW5jdGlvbiBIaSh0LGUpe3ZhciBuPXQucGFnZSxyPXQuY2xpZW50LG89ZS54LGk9ZS55O24ueCs9byxuLnkrPWksci54Kz1vLHIueSs9aX1Fbi5fUHJveHlNZXRob2RzLm9mZnNldEJ5PVwiXCI7dmFyIEtpPXtpZDpcIm9mZnNldFwiLGluc3RhbGw6ZnVuY3Rpb24odCl7dC5JbnRlcmFjdGlvbi5wcm90b3R5cGUub2Zmc2V0Qnk9R2l9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dC5pbnRlcmFjdGlvbi5vZmZzZXQ9e3RvdGFsOnt4OjAseTowfSxwZW5kaW5nOnt4OjAseTowfX19LFwiaW50ZXJhY3Rpb25zOnVwZGF0ZS1wb2ludGVyXCI6ZnVuY3Rpb24odCl7cmV0dXJuIFZpKHQuaW50ZXJhY3Rpb24pfSxcImludGVyYWN0aW9uczpiZWZvcmUtYWN0aW9uLXN0YXJ0XCI6cWksXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1tb3ZlXCI6cWksXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1lbmRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uO2lmKFVpKGUpKXJldHVybiBlLm1vdmUoe29mZnNldDohMH0pLGUuZW5kKCksITF9LFwiaW50ZXJhY3Rpb25zOnN0b3BcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uO2Uub2Zmc2V0LnRvdGFsLng9MCxlLm9mZnNldC50b3RhbC55PTAsZS5vZmZzZXQucGVuZGluZy54PTAsZS5vZmZzZXQucGVuZGluZy55PTB9fX07WWkuZGVmYXVsdD1LaTt2YXIgJGk9e307ZnVuY3Rpb24gWmkodCl7cmV0dXJuKFppPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoJGksXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksJGkuZGVmYXVsdD0kaS5JbmVydGlhU3RhdGU9dm9pZCAwO3ZhciBKaT11YShfaSksUWk9YWEoQ2kpLHRhPXVhKFlpKSxlYT1hYSgkKSxuYT11YShFdCkscmE9YWEodyksb2E9dWEob2UpO2Z1bmN0aW9uIGlhKCl7aWYoXCJmdW5jdGlvblwiIT10eXBlb2YgV2Vha01hcClyZXR1cm4gbnVsbDt2YXIgdD1uZXcgV2Vha01hcDtyZXR1cm4gaWE9ZnVuY3Rpb24oKXtyZXR1cm4gdH0sdH1mdW5jdGlvbiBhYSh0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1aaSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1pYSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1yZXR1cm4gbi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKSxufWZ1bmN0aW9uIHVhKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBzYSh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gbGEodCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBjYT1mdW5jdGlvbigpe2Z1bmN0aW9uIGUodCl7IWZ1bmN0aW9uKHQsZSl7aWYoISh0IGluc3RhbmNlb2YgZSkpdGhyb3cgbmV3IFR5cGVFcnJvcihcIkNhbm5vdCBjYWxsIGEgY2xhc3MgYXMgYSBmdW5jdGlvblwiKX0odGhpcyxlKSx0aGlzLmludGVyYWN0aW9uPXQsbGEodGhpcyxcImFjdGl2ZVwiLCExKSxsYSh0aGlzLFwiaXNNb2RpZmllZFwiLCExKSxsYSh0aGlzLFwic21vb3RoRW5kXCIsITEpLGxhKHRoaXMsXCJhbGxvd1Jlc3VtZVwiLCExKSxsYSh0aGlzLFwibW9kaWZpY2F0aW9uXCIsbnVsbCksbGEodGhpcyxcIm1vZGlmaWVyQ291bnRcIiwwKSxsYSh0aGlzLFwibW9kaWZpZXJBcmdcIixudWxsKSxsYSh0aGlzLFwic3RhcnRDb29yZHNcIixudWxsKSxsYSh0aGlzLFwidDBcIiwwKSxsYSh0aGlzLFwidjBcIiwwKSxsYSh0aGlzLFwidGVcIiwwKSxsYSh0aGlzLFwidGFyZ2V0T2Zmc2V0XCIsbnVsbCksbGEodGhpcyxcIm1vZGlmaWVkT2Zmc2V0XCIsbnVsbCksbGEodGhpcyxcImN1cnJlbnRPZmZzZXRcIixudWxsKSxsYSh0aGlzLFwibGFtYmRhX3YwXCIsMCksbGEodGhpcyxcIm9uZV92ZV92MFwiLDApLGxhKHRoaXMsXCJ0aW1lb3V0XCIsbnVsbCl9dmFyIHQsbixyO3JldHVybiB0PWUsKG49W3trZXk6XCJzdGFydFwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXRoaXMuaW50ZXJhY3Rpb24sbj1mYShlKTtpZighbnx8IW4uZW5hYmxlZClyZXR1cm4hMTt2YXIgcj1lLmNvb3Jkcy52ZWxvY2l0eS5jbGllbnQsbz0oMCxuYS5kZWZhdWx0KShyLngsci55KSxpPXRoaXMubW9kaWZpY2F0aW9ufHwodGhpcy5tb2RpZmljYXRpb249bmV3IEppLmRlZmF1bHQoZSkpO2lmKGkuY29weUZyb20oZS5tb2RpZmljYXRpb24pLHRoaXMudDA9ZS5fbm93KCksdGhpcy5hbGxvd1Jlc3VtZT1uLmFsbG93UmVzdW1lLHRoaXMudjA9byx0aGlzLmN1cnJlbnRPZmZzZXQ9e3g6MCx5OjB9LHRoaXMuc3RhcnRDb29yZHM9ZS5jb29yZHMuY3VyLnBhZ2UsdGhpcy5tb2RpZmllckFyZz17aW50ZXJhY3Rpb246ZSxpbnRlcmFjdGFibGU6ZS5pbnRlcmFjdGFibGUsZWxlbWVudDplLmVsZW1lbnQscmVjdDplLnJlY3QsZWRnZXM6ZS5lZGdlcyxwYWdlQ29vcmRzOnRoaXMuc3RhcnRDb29yZHMscHJlRW5kOiEwLHBoYXNlOlwiaW5lcnRpYXN0YXJ0XCJ9LHRoaXMudDAtZS5jb29yZHMuY3VyLnRpbWVTdGFtcDw1MCYmbz5uLm1pblNwZWVkJiZvPm4uZW5kU3BlZWQpdGhpcy5zdGFydEluZXJ0aWEoKTtlbHNle2lmKGkucmVzdWx0PWkuc2V0QWxsKHRoaXMubW9kaWZpZXJBcmcpLCFpLnJlc3VsdC5jaGFuZ2VkKXJldHVybiExO3RoaXMuc3RhcnRTbW9vdGhFbmQoKX1yZXR1cm4gZS5tb2RpZmljYXRpb24ucmVzdWx0LnJlY3Q9bnVsbCxlLm9mZnNldEJ5KHRoaXMudGFyZ2V0T2Zmc2V0KSxlLl9kb1BoYXNlKHtpbnRlcmFjdGlvbjplLGV2ZW50OnQscGhhc2U6XCJpbmVydGlhc3RhcnRcIn0pLGUub2Zmc2V0Qnkoe3g6LXRoaXMudGFyZ2V0T2Zmc2V0LngseTotdGhpcy50YXJnZXRPZmZzZXQueX0pLGUubW9kaWZpY2F0aW9uLnJlc3VsdC5yZWN0PW51bGwsdGhpcy5hY3RpdmU9ITAsZS5zaW11bGF0aW9uPXRoaXMsITB9fSx7a2V5Olwic3RhcnRJbmVydGlhXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzLGU9dGhpcy5pbnRlcmFjdGlvbi5jb29yZHMudmVsb2NpdHkuY2xpZW50LG49ZmEodGhpcy5pbnRlcmFjdGlvbikscj1uLnJlc2lzdGFuY2Usbz0tTWF0aC5sb2cobi5lbmRTcGVlZC90aGlzLnYwKS9yO3RoaXMudGFyZ2V0T2Zmc2V0PXt4OihlLngtbykvcix5OihlLnktbykvcn0sdGhpcy50ZT1vLHRoaXMubGFtYmRhX3YwPXIvdGhpcy52MCx0aGlzLm9uZV92ZV92MD0xLW4uZW5kU3BlZWQvdGhpcy52MDt2YXIgaT10aGlzLm1vZGlmaWNhdGlvbixhPXRoaXMubW9kaWZpZXJBcmc7YS5wYWdlQ29vcmRzPXt4OnRoaXMuc3RhcnRDb29yZHMueCt0aGlzLnRhcmdldE9mZnNldC54LHk6dGhpcy5zdGFydENvb3Jkcy55K3RoaXMudGFyZ2V0T2Zmc2V0Lnl9LGkucmVzdWx0PWkuc2V0QWxsKGEpLGkucmVzdWx0LmNoYW5nZWQmJih0aGlzLmlzTW9kaWZpZWQ9ITAsdGhpcy5tb2RpZmllZE9mZnNldD17eDp0aGlzLnRhcmdldE9mZnNldC54K2kucmVzdWx0LmRlbHRhLngseTp0aGlzLnRhcmdldE9mZnNldC55K2kucmVzdWx0LmRlbHRhLnl9KSx0aGlzLnRpbWVvdXQ9b2EuZGVmYXVsdC5yZXF1ZXN0KGZ1bmN0aW9uKCl7cmV0dXJuIHQuaW5lcnRpYVRpY2soKX0pfX0se2tleTpcInN0YXJ0U21vb3RoRW5kXCIsdmFsdWU6ZnVuY3Rpb24oKXt2YXIgdD10aGlzO3RoaXMuc21vb3RoRW5kPSEwLHRoaXMuaXNNb2RpZmllZD0hMCx0aGlzLnRhcmdldE9mZnNldD17eDp0aGlzLm1vZGlmaWNhdGlvbi5yZXN1bHQuZGVsdGEueCx5OnRoaXMubW9kaWZpY2F0aW9uLnJlc3VsdC5kZWx0YS55fSx0aGlzLnRpbWVvdXQ9b2EuZGVmYXVsdC5yZXF1ZXN0KGZ1bmN0aW9uKCl7cmV0dXJuIHQuc21vb3RoRW5kVGljaygpfSl9fSx7a2V5OlwiaW5lcnRpYVRpY2tcIix2YWx1ZTpmdW5jdGlvbigpe3ZhciB0LGUsbixyLG8saSxhLHU9dGhpcyxzPXRoaXMuaW50ZXJhY3Rpb24sbD1mYShzKS5yZXNpc3RhbmNlLGM9KHMuX25vdygpLXRoaXMudDApLzFlMztpZihjPHRoaXMudGUpe3ZhciBmLHA9MS0oTWF0aC5leHAoLWwqYyktdGhpcy5sYW1iZGFfdjApL3RoaXMub25lX3ZlX3YwLGQ9e3g6KGY9dGhpcy5pc01vZGlmaWVkPyhlPXQ9MCxuPXRoaXMudGFyZ2V0T2Zmc2V0Lngscj10aGlzLnRhcmdldE9mZnNldC55LG89dGhpcy5tb2RpZmllZE9mZnNldC54LGk9dGhpcy5tb2RpZmllZE9mZnNldC55LHt4OnBhKGE9cCx0LG4sbykseTpwYShhLGUscixpKX0pOnt4OnRoaXMudGFyZ2V0T2Zmc2V0LngqcCx5OnRoaXMudGFyZ2V0T2Zmc2V0LnkqcH0pLngtdGhpcy5jdXJyZW50T2Zmc2V0LngseTpmLnktdGhpcy5jdXJyZW50T2Zmc2V0Lnl9O3RoaXMuY3VycmVudE9mZnNldC54Kz1kLngsdGhpcy5jdXJyZW50T2Zmc2V0LnkrPWQueSxzLm9mZnNldEJ5KGQpLHMubW92ZSgpLHRoaXMudGltZW91dD1vYS5kZWZhdWx0LnJlcXVlc3QoZnVuY3Rpb24oKXtyZXR1cm4gdS5pbmVydGlhVGljaygpfSl9ZWxzZSBzLm9mZnNldEJ5KHt4OnRoaXMubW9kaWZpZWRPZmZzZXQueC10aGlzLmN1cnJlbnRPZmZzZXQueCx5OnRoaXMubW9kaWZpZWRPZmZzZXQueS10aGlzLmN1cnJlbnRPZmZzZXQueX0pLHRoaXMuZW5kKCl9fSx7a2V5Olwic21vb3RoRW5kVGlja1wiLHZhbHVlOmZ1bmN0aW9uKCl7dmFyIHQ9dGhpcyxlPXRoaXMuaW50ZXJhY3Rpb24sbj1lLl9ub3coKS10aGlzLnQwLHI9ZmEoZSkuc21vb3RoRW5kRHVyYXRpb247aWYobjxyKXt2YXIgbz1kYShuLDAsdGhpcy50YXJnZXRPZmZzZXQueCxyKSxpPWRhKG4sMCx0aGlzLnRhcmdldE9mZnNldC55LHIpLGE9e3g6by10aGlzLmN1cnJlbnRPZmZzZXQueCx5OmktdGhpcy5jdXJyZW50T2Zmc2V0Lnl9O3RoaXMuY3VycmVudE9mZnNldC54Kz1hLngsdGhpcy5jdXJyZW50T2Zmc2V0LnkrPWEueSxlLm9mZnNldEJ5KGEpLGUubW92ZSh7c2tpcE1vZGlmaWVyczp0aGlzLm1vZGlmaWVyQ291bnR9KSx0aGlzLnRpbWVvdXQ9b2EuZGVmYXVsdC5yZXF1ZXN0KGZ1bmN0aW9uKCl7cmV0dXJuIHQuc21vb3RoRW5kVGljaygpfSl9ZWxzZSBlLm9mZnNldEJ5KHt4OnRoaXMudGFyZ2V0T2Zmc2V0LngtdGhpcy5jdXJyZW50T2Zmc2V0LngseTp0aGlzLnRhcmdldE9mZnNldC55LXRoaXMuY3VycmVudE9mZnNldC55fSksdGhpcy5lbmQoKX19LHtrZXk6XCJyZXN1bWVcIix2YWx1ZTpmdW5jdGlvbih0KXt2YXIgZT10LnBvaW50ZXIsbj10LmV2ZW50LHI9dC5ldmVudFRhcmdldCxvPXRoaXMuaW50ZXJhY3Rpb247by5vZmZzZXRCeSh7eDotdGhpcy5jdXJyZW50T2Zmc2V0LngseTotdGhpcy5jdXJyZW50T2Zmc2V0Lnl9KSxvLnVwZGF0ZVBvaW50ZXIoZSxuLHIsITApLG8uX2RvUGhhc2Uoe2ludGVyYWN0aW9uOm8sZXZlbnQ6bixwaGFzZTpcInJlc3VtZVwifSksKDAsenQuY29weUNvb3Jkcykoby5jb29yZHMucHJldixvLmNvb3Jkcy5jdXIpLHRoaXMuc3RvcCgpfX0se2tleTpcImVuZFwiLHZhbHVlOmZ1bmN0aW9uKCl7dGhpcy5pbnRlcmFjdGlvbi5tb3ZlKCksdGhpcy5pbnRlcmFjdGlvbi5lbmQoKSx0aGlzLnN0b3AoKX19LHtrZXk6XCJzdG9wXCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLmFjdGl2ZT10aGlzLnNtb290aEVuZD0hMSx0aGlzLmludGVyYWN0aW9uLnNpbXVsYXRpb249bnVsbCxvYS5kZWZhdWx0LmNhbmNlbCh0aGlzLnRpbWVvdXQpfX1dKSYmc2EodC5wcm90b3R5cGUsbiksciYmc2EodCxyKSxlfSgpO2Z1bmN0aW9uIGZhKHQpe3ZhciBlPXQuaW50ZXJhY3RhYmxlLG49dC5wcmVwYXJlZDtyZXR1cm4gZSYmZS5vcHRpb25zJiZuLm5hbWUmJmUub3B0aW9uc1tuLm5hbWVdLmluZXJ0aWF9ZnVuY3Rpb24gcGEodCxlLG4scil7dmFyIG89MS10O3JldHVybiBvKm8qZSsyKm8qdCpuK3QqdCpyfWZ1bmN0aW9uIGRhKHQsZSxuLHIpe3JldHVybi1uKih0Lz1yKSoodC0yKStlfSRpLkluZXJ0aWFTdGF0ZT1jYTt2YXIgdmE9e2lkOlwiaW5lcnRpYVwiLGJlZm9yZTpbXCJtb2RpZmllcnMvYmFzZVwiXSxpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPXQuZGVmYXVsdHM7dC51c2VQbHVnaW4odGEuZGVmYXVsdCksdC51c2VQbHVnaW4oUWkuZGVmYXVsdCksdC5hY3Rpb25zLnBoYXNlcy5pbmVydGlhc3RhcnQ9ITAsdC5hY3Rpb25zLnBoYXNlcy5yZXN1bWU9ITAsZS5wZXJBY3Rpb24uaW5lcnRpYT17ZW5hYmxlZDohMSxyZXNpc3RhbmNlOjEwLG1pblNwZWVkOjEwMCxlbmRTcGVlZDoxMCxhbGxvd1Jlc3VtZTohMCxzbW9vdGhFbmREdXJhdGlvbjozMDB9fSxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOm5ld1wiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb247ZS5pbmVydGlhPW5ldyBjYShlKX0sXCJpbnRlcmFjdGlvbnM6YmVmb3JlLWFjdGlvbi1lbmRcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5ldmVudDtyZXR1cm4oIWUuX2ludGVyYWN0aW5nfHxlLnNpbXVsYXRpb258fCFlLmluZXJ0aWEuc3RhcnQobikpJiZudWxsfSxcImludGVyYWN0aW9uczpkb3duXCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQuZXZlbnRUYXJnZXQscj1lLmluZXJ0aWE7aWYoci5hY3RpdmUpZm9yKHZhciBvPW47cmEuZWxlbWVudChvKTspe2lmKG89PT1lLmVsZW1lbnQpe3IucmVzdW1lKHQpO2JyZWFrfW89ZWEucGFyZW50Tm9kZShvKX19LFwiaW50ZXJhY3Rpb25zOnN0b3BcIjpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLmluZXJ0aWE7ZS5hY3RpdmUmJmUuc3RvcCgpfSxcImludGVyYWN0aW9uczpiZWZvcmUtYWN0aW9uLXJlc3VtZVwiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24ubW9kaWZpY2F0aW9uO2Uuc3RvcCh0KSxlLnN0YXJ0KHQsdC5pbnRlcmFjdGlvbi5jb29yZHMuY3VyLnBhZ2UpLGUuYXBwbHlUb0ludGVyYWN0aW9uKHQpfSxcImludGVyYWN0aW9uczpiZWZvcmUtYWN0aW9uLWluZXJ0aWFzdGFydFwiOmZ1bmN0aW9uKHQpe3JldHVybiB0LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbi5zZXRBbmRBcHBseSh0KX0sXCJpbnRlcmFjdGlvbnM6YWN0aW9uLXJlc3VtZVwiOlFpLmFkZEV2ZW50TW9kaWZpZXJzLFwiaW50ZXJhY3Rpb25zOmFjdGlvbi1pbmVydGlhc3RhcnRcIjpRaS5hZGRFdmVudE1vZGlmaWVycyxcImludGVyYWN0aW9uczphZnRlci1hY3Rpb24taW5lcnRpYXN0YXJ0XCI6ZnVuY3Rpb24odCl7cmV0dXJuIHQuaW50ZXJhY3Rpb24ubW9kaWZpY2F0aW9uLnJlc3RvcmVJbnRlcmFjdGlvbkNvb3Jkcyh0KX0sXCJpbnRlcmFjdGlvbnM6YWZ0ZXItYWN0aW9uLXJlc3VtZVwiOmZ1bmN0aW9uKHQpe3JldHVybiB0LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbi5yZXN0b3JlSW50ZXJhY3Rpb25Db29yZHModCl9fX07JGkuZGVmYXVsdD12YTt2YXIgeWEsaGE9e307ZnVuY3Rpb24gZ2EodCl7cmV0dXJuKGdhPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoaGEsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksaGEuaW5pdD1oYS5kZWZhdWx0PXZvaWQgMDt2YXIgYmE9bmV3KCgoeWE9bSh7fSkpJiZ5YS5fX2VzTW9kdWxlP3lhOntkZWZhdWx0OnlhfSkuZGVmYXVsdCksbWE9YmEuaW50ZXJhY3RTdGF0aWM7aGEuZGVmYXVsdD1tYTtmdW5jdGlvbiBPYSh0KXtyZXR1cm4gYmEuaW5pdCh0KX1oYS5pbml0PU9hLFwib2JqZWN0XCI9PT0oXCJ1bmRlZmluZWRcIj09dHlwZW9mIHdpbmRvdz9cInVuZGVmaW5lZFwiOmdhKHdpbmRvdykpJiZ3aW5kb3cmJk9hKHdpbmRvdyk7dmFyIHdhPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eSh3YSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx3YS5kZWZhdWx0PXZvaWQgMDt3YS5kZWZhdWx0PXt9O3ZhciBfYT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoX2EsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksX2EuZGVmYXVsdD12b2lkIDA7X2EuZGVmYXVsdD17fTt2YXIgUGE9e307ZnVuY3Rpb24geGEodCxlKXtyZXR1cm4gZnVuY3Rpb24odCl7aWYoQXJyYXkuaXNBcnJheSh0KSlyZXR1cm4gdH0odCl8fGZ1bmN0aW9uKHQsZSl7aWYoIShTeW1ib2wuaXRlcmF0b3IgaW4gT2JqZWN0KHQpfHxcIltvYmplY3QgQXJndW1lbnRzXVwiPT09T2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKHQpKSlyZXR1cm47dmFyIG49W10scj0hMCxvPSExLGk9dm9pZCAwO3RyeXtmb3IodmFyIGEsdT10W1N5bWJvbC5pdGVyYXRvcl0oKTshKHI9KGE9dS5uZXh0KCkpLmRvbmUpJiYobi5wdXNoKGEudmFsdWUpLCFlfHxuLmxlbmd0aCE9PWUpO3I9ITApO31jYXRjaCh0KXtvPSEwLGk9dH1maW5hbGx5e3RyeXtyfHxudWxsPT11LnJldHVybnx8dS5yZXR1cm4oKX1maW5hbGx5e2lmKG8pdGhyb3cgaX19cmV0dXJuIG59KHQsZSl8fGZ1bmN0aW9uKCl7dGhyb3cgbmV3IFR5cGVFcnJvcihcIkludmFsaWQgYXR0ZW1wdCB0byBkZXN0cnVjdHVyZSBub24taXRlcmFibGUgaW5zdGFuY2VcIil9KCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFBhLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFBhLmRlZmF1bHQ9dm9pZCAwO1BhLmRlZmF1bHQ9ZnVuY3Rpb24odil7ZnVuY3Rpb24gdCh0LGUpe2Zvcih2YXIgbj12LnJhbmdlLHI9di5saW1pdHMsbz12b2lkIDA9PT1yP3tsZWZ0Oi0xLzAscmlnaHQ6MS8wLHRvcDotMS8wLGJvdHRvbToxLzB9OnIsaT12Lm9mZnNldCxhPXZvaWQgMD09PWk/e3g6MCx5OjB9OmksdT17cmFuZ2U6bixncmlkOnYseDpudWxsLHk6bnVsbH0scz0wO3M8eS5sZW5ndGg7cysrKXt2YXIgbD14YSh5W3NdLDIpLGM9bFswXSxmPWxbMV0scD1NYXRoLnJvdW5kKCh0LWEueCkvdltjXSksZD1NYXRoLnJvdW5kKChlLWEueSkvdltmXSk7dVtjXT1NYXRoLm1heChvLmxlZnQsTWF0aC5taW4oby5yaWdodCxwKnZbY10rYS54KSksdVtmXT1NYXRoLm1heChvLnRvcCxNYXRoLm1pbihvLmJvdHRvbSxkKnZbZl0rYS55KSl9cmV0dXJuIHV9dmFyIHk9W1tcInhcIixcInlcIl0sW1wibGVmdFwiLFwidG9wXCJdLFtcInJpZ2h0XCIsXCJib3R0b21cIl0sW1wid2lkdGhcIixcImhlaWdodFwiXV0uZmlsdGVyKGZ1bmN0aW9uKHQpe3ZhciBlPXhhKHQsMiksbj1lWzBdLHI9ZVsxXTtyZXR1cm4gbiBpbiB2fHxyIGluIHZ9KTtyZXR1cm4gdC5ncmlkPXYsdC5jb29yZEZpZWxkcz15LHR9O3ZhciBTYT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoU2EsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFNhLFwiZWRnZVRhcmdldFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBqYS5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShTYSxcImVsZW1lbnRzXCIse2VudW1lcmFibGU6ITAsZ2V0OmZ1bmN0aW9uKCl7cmV0dXJuIE1hLmRlZmF1bHR9fSksT2JqZWN0LmRlZmluZVByb3BlcnR5KFNhLFwiZ3JpZFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiBrYS5kZWZhdWx0fX0pO3ZhciBqYT1FYSh3YSksTWE9RWEoX2EpLGthPUVhKFBhKTtmdW5jdGlvbiBFYSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIFRhPXt9O2Z1bmN0aW9uIERhKHQpe3JldHVybihEYT1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KFRhLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFRhLmRlZmF1bHQ9dm9pZCAwO3ZhciBJYSx6YT0oSWE9Y3QpJiZJYS5fX2VzTW9kdWxlP0lhOntkZWZhdWx0OklhfSxBYT1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1EYSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1DYSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShTYSk7ZnVuY3Rpb24gQ2EoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBDYT1mdW5jdGlvbigpe3JldHVybiB0fSx0fXZhciBXYT17aWQ6XCJzbmFwcGVyc1wiLGluc3RhbGw6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdFN0YXRpYztlLnNuYXBwZXJzPSgwLHphLmRlZmF1bHQpKGUuc25hcHBlcnN8fHt9LEFhKSxlLmNyZWF0ZVNuYXBHcmlkPWUuc25hcHBlcnMuZ3JpZH19O1RhLmRlZmF1bHQ9V2E7dmFyIFJhPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShSYSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxSYS5hc3BlY3RSYXRpbz1SYS5kZWZhdWx0PXZvaWQgMDt2YXIgRmE9WWEoY3QpLFhhPVlhKF9pKTtmdW5jdGlvbiBZYSh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gTmEoZSx0KXt2YXIgbj1PYmplY3Qua2V5cyhlKTtpZihPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKXt2YXIgcj1PYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKGUpO3QmJihyPXIuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGUsdCkuZW51bWVyYWJsZX0pKSxuLnB1c2guYXBwbHkobixyKX1yZXR1cm4gbn1mdW5jdGlvbiBMYShlKXtmb3IodmFyIHQ9MTt0PGFyZ3VtZW50cy5sZW5ndGg7dCsrKXt2YXIgbj1udWxsIT1hcmd1bWVudHNbdF0/YXJndW1lbnRzW3RdOnt9O3QlMj9OYShPYmplY3QobiksITApLmZvckVhY2goZnVuY3Rpb24odCl7QmEoZSx0LG5bdF0pfSk6T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcnM/T2JqZWN0LmRlZmluZVByb3BlcnRpZXMoZSxPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9ycyhuKSk6TmEoT2JqZWN0KG4pKS5mb3JFYWNoKGZ1bmN0aW9uKHQpe09iamVjdC5kZWZpbmVQcm9wZXJ0eShlLHQsT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihuLHQpKX0pfXJldHVybiBlfWZ1bmN0aW9uIEJhKHQsZSxuKXtyZXR1cm4gZSBpbiB0P09iamVjdC5kZWZpbmVQcm9wZXJ0eSh0LGUse3ZhbHVlOm4sZW51bWVyYWJsZTohMCxjb25maWd1cmFibGU6ITAsd3JpdGFibGU6ITB9KTp0W2VdPW4sdH12YXIgVmE9e3N0YXJ0OmZ1bmN0aW9uKHQpe3ZhciBlPXQuc3RhdGUsbj10LnJlY3Qscj10LmVkZ2VzLG89dC5wYWdlQ29vcmRzLGk9ZS5vcHRpb25zLnJhdGlvLGE9ZS5vcHRpb25zLHU9YS5lcXVhbERlbHRhLHM9YS5tb2RpZmllcnM7XCJwcmVzZXJ2ZVwiPT09aSYmKGk9bi53aWR0aC9uLmhlaWdodCksZS5zdGFydENvb3Jkcz0oMCxGYS5kZWZhdWx0KSh7fSxvKSxlLnN0YXJ0UmVjdD0oMCxGYS5kZWZhdWx0KSh7fSxuKSxlLnJhdGlvPWksZS5lcXVhbERlbHRhPXU7dmFyIGw9ZS5saW5rZWRFZGdlcz17dG9wOnIudG9wfHxyLmxlZnQmJiFyLmJvdHRvbSxsZWZ0OnIubGVmdHx8ci50b3AmJiFyLnJpZ2h0LGJvdHRvbTpyLmJvdHRvbXx8ci5yaWdodCYmIXIudG9wLHJpZ2h0OnIucmlnaHR8fHIuYm90dG9tJiYhci5sZWZ0fTtpZihlLnhJc1ByaW1hcnlBeGlzPSEoIXIubGVmdCYmIXIucmlnaHQpLGUuZXF1YWxEZWx0YSllLmVkZ2VTaWduPShsLmxlZnQ/MTotMSkqKGwudG9wPzE6LTEpO2Vsc2V7dmFyIGM9ZS54SXNQcmltYXJ5QXhpcz9sLnRvcDpsLmxlZnQ7ZS5lZGdlU2lnbj1jPy0xOjF9aWYoKDAsRmEuZGVmYXVsdCkodC5lZGdlcyxsKSxzJiZzLmxlbmd0aCl7dmFyIGY9bmV3IFhhLmRlZmF1bHQodC5pbnRlcmFjdGlvbik7Zi5jb3B5RnJvbSh0LmludGVyYWN0aW9uLm1vZGlmaWNhdGlvbiksZi5wcmVwYXJlU3RhdGVzKHMpLChlLnN1Yk1vZGlmaWNhdGlvbj1mKS5zdGFydEFsbChMYSh7fSx0KSl9fSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5zdGF0ZSxuPXQucmVjdCxyPXQuY29vcmRzLG89KDAsRmEuZGVmYXVsdCkoe30sciksaT1lLmVxdWFsRGVsdGE/cWE6VWE7aWYoaShlLGUueElzUHJpbWFyeUF4aXMscixuKSwhZS5zdWJNb2RpZmljYXRpb24pcmV0dXJuIG51bGw7dmFyIGE9KDAsRmEuZGVmYXVsdCkoe30sbik7KDAsJHQuYWRkRWRnZXMpKGUubGlua2VkRWRnZXMsYSx7eDpyLngtby54LHk6ci55LW8ueX0pO3ZhciB1PWUuc3ViTW9kaWZpY2F0aW9uLnNldEFsbChMYSh7fSx0LHtyZWN0OmEsZWRnZXM6ZS5saW5rZWRFZGdlcyxwYWdlQ29vcmRzOnIscHJldkNvb3JkczpyLHByZXZSZWN0OmF9KSkscz11LmRlbHRhO3UuY2hhbmdlZCYmKGkoZSxNYXRoLmFicyhzLngpPk1hdGguYWJzKHMueSksdS5jb29yZHMsdS5yZWN0KSwoMCxGYS5kZWZhdWx0KShyLHUuY29vcmRzKSk7cmV0dXJuIHUuZXZlbnRQcm9wc30sZGVmYXVsdHM6e3JhdGlvOlwicHJlc2VydmVcIixlcXVhbERlbHRhOiExLG1vZGlmaWVyczpbXSxlbmFibGVkOiExfX07ZnVuY3Rpb24gcWEodCxlLG4pe3ZhciByPXQuc3RhcnRDb29yZHMsbz10LmVkZ2VTaWduO2U/bi55PXIueSsobi54LXIueCkqbzpuLng9ci54KyhuLnktci55KSpvfWZ1bmN0aW9uIFVhKHQsZSxuLHIpe3ZhciBvPXQuc3RhcnRSZWN0LGk9dC5zdGFydENvb3JkcyxhPXQucmF0aW8sdT10LmVkZ2VTaWduO2lmKGUpe3ZhciBzPXIud2lkdGgvYTtuLnk9aS55KyhzLW8uaGVpZ2h0KSp1fWVsc2V7dmFyIGw9ci5oZWlnaHQqYTtuLng9aS54KyhsLW8ud2lkdGgpKnV9fVJhLmFzcGVjdFJhdGlvPVZhO3ZhciBHYT0oMCxDaS5tYWtlTW9kaWZpZXIpKFZhLFwiYXNwZWN0UmF0aW9cIik7UmEuZGVmYXVsdD1HYTt2YXIgSGE9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KEhhLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLEhhLmRlZmF1bHQ9dm9pZCAwO2Z1bmN0aW9uIEthKCl7fUthLl9kZWZhdWx0cz17fTt2YXIgJGE9S2E7SGEuZGVmYXVsdD0kYTt2YXIgWmE9e307ZnVuY3Rpb24gSmEodCl7cmV0dXJuKEphPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoWmEsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksWmEuZ2V0UmVzdHJpY3Rpb25SZWN0PWl1LFphLnJlc3RyaWN0PVphLmRlZmF1bHQ9dm9pZCAwO3ZhciBRYSx0dT0oUWE9Y3QpJiZRYS5fX2VzTW9kdWxlP1FhOntkZWZhdWx0OlFhfSxldT1vdSh3KSxudT1vdSgkdCk7ZnVuY3Rpb24gcnUoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBydT1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIG91KHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PUphKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPXJ1KCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfXJldHVybiBuLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pLG59ZnVuY3Rpb24gaXUodCxlLG4pe3JldHVybiBldS5mdW5jKHQpP251LnJlc29sdmVSZWN0TGlrZSh0LGUuaW50ZXJhY3RhYmxlLGUuZWxlbWVudCxbbi54LG4ueSxlXSk6bnUucmVzb2x2ZVJlY3RMaWtlKHQsZS5pbnRlcmFjdGFibGUsZS5lbGVtZW50KX12YXIgYXU9e3N0YXJ0OmZ1bmN0aW9uKHQpe3ZhciBlPXQucmVjdCxuPXQuc3RhcnRPZmZzZXQscj10LnN0YXRlLG89dC5pbnRlcmFjdGlvbixpPXQucGFnZUNvb3JkcyxhPXIub3B0aW9ucyx1PWEuZWxlbWVudFJlY3Qscz0oMCx0dS5kZWZhdWx0KSh7bGVmdDowLHRvcDowLHJpZ2h0OjAsYm90dG9tOjB9LGEub2Zmc2V0fHx7fSk7aWYoZSYmdSl7dmFyIGw9aXUoYS5yZXN0cmljdGlvbixvLGkpO2lmKGwpe3ZhciBjPWwucmlnaHQtbC5sZWZ0LWUud2lkdGgsZj1sLmJvdHRvbS1sLnRvcC1lLmhlaWdodDtjPDAmJihzLmxlZnQrPWMscy5yaWdodCs9YyksZjwwJiYocy50b3ArPWYscy5ib3R0b20rPWYpfXMubGVmdCs9bi5sZWZ0LWUud2lkdGgqdS5sZWZ0LHMudG9wKz1uLnRvcC1lLmhlaWdodCp1LnRvcCxzLnJpZ2h0Kz1uLnJpZ2h0LWUud2lkdGgqKDEtdS5yaWdodCkscy5ib3R0b20rPW4uYm90dG9tLWUuaGVpZ2h0KigxLXUuYm90dG9tKX1yLm9mZnNldD1zfSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5jb29yZHMsbj10LmludGVyYWN0aW9uLHI9dC5zdGF0ZSxvPXIub3B0aW9ucyxpPXIub2Zmc2V0LGE9aXUoby5yZXN0cmljdGlvbixuLGUpO2lmKGEpe3ZhciB1PW51Lnh5d2hUb1RsYnIoYSk7ZS54PU1hdGgubWF4KE1hdGgubWluKHUucmlnaHQtaS5yaWdodCxlLngpLHUubGVmdCtpLmxlZnQpLGUueT1NYXRoLm1heChNYXRoLm1pbih1LmJvdHRvbS1pLmJvdHRvbSxlLnkpLHUudG9wK2kudG9wKX19LGRlZmF1bHRzOntyZXN0cmljdGlvbjpudWxsLGVsZW1lbnRSZWN0Om51bGwsb2Zmc2V0Om51bGwsZW5kT25seTohMSxlbmFibGVkOiExfX07WmEucmVzdHJpY3Q9YXU7dmFyIHV1PSgwLENpLm1ha2VNb2RpZmllcikoYXUsXCJyZXN0cmljdFwiKTtaYS5kZWZhdWx0PXV1O3ZhciBzdT17fTtmdW5jdGlvbiBsdSh0KXtyZXR1cm4obHU9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShzdSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxzdS5yZXN0cmljdEVkZ2VzPXN1LmRlZmF1bHQ9dm9pZCAwO3ZhciBjdSxmdT0oY3U9Y3QpJiZjdS5fX2VzTW9kdWxlP2N1OntkZWZhdWx0OmN1fSxwdT1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1sdSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1kdSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufSgkdCk7ZnVuY3Rpb24gZHUoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBkdT1mdW5jdGlvbigpe3JldHVybiB0fSx0fXZhciB2dT17dG9wOjEvMCxsZWZ0OjEvMCxib3R0b206LTEvMCxyaWdodDotMS8wfSx5dT17dG9wOi0xLzAsbGVmdDotMS8wLGJvdHRvbToxLzAscmlnaHQ6MS8wfTtmdW5jdGlvbiBodSh0LGUpe2Zvcih2YXIgbj1bXCJ0b3BcIixcImxlZnRcIixcImJvdHRvbVwiLFwicmlnaHRcIl0scj0wO3I8bi5sZW5ndGg7cisrKXt2YXIgbz1uW3JdO28gaW4gdHx8KHRbb109ZVtvXSl9cmV0dXJuIHR9dmFyIGd1PXtub0lubmVyOnZ1LG5vT3V0ZXI6eXUsc3RhcnQ6ZnVuY3Rpb24odCl7dmFyIGUsbj10LmludGVyYWN0aW9uLHI9dC5zdGFydE9mZnNldCxvPXQuc3RhdGUsaT1vLm9wdGlvbnM7aWYoaSl7dmFyIGE9KDAsWmEuZ2V0UmVzdHJpY3Rpb25SZWN0KShpLm9mZnNldCxuLG4uY29vcmRzLnN0YXJ0LnBhZ2UpO2U9cHUucmVjdFRvWFkoYSl9ZT1lfHx7eDowLHk6MH0sby5vZmZzZXQ9e3RvcDplLnkrci50b3AsbGVmdDplLngrci5sZWZ0LGJvdHRvbTplLnktci5ib3R0b20scmlnaHQ6ZS54LXIucmlnaHR9fSxzZXQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5jb29yZHMsbj10LmVkZ2VzLHI9dC5pbnRlcmFjdGlvbixvPXQuc3RhdGUsaT1vLm9mZnNldCxhPW8ub3B0aW9ucztpZihuKXt2YXIgdT0oMCxmdS5kZWZhdWx0KSh7fSxlKSxzPSgwLFphLmdldFJlc3RyaWN0aW9uUmVjdCkoYS5pbm5lcixyLHUpfHx7fSxsPSgwLFphLmdldFJlc3RyaWN0aW9uUmVjdCkoYS5vdXRlcixyLHUpfHx7fTtodShzLHZ1KSxodShsLHl1KSxuLnRvcD9lLnk9TWF0aC5taW4oTWF0aC5tYXgobC50b3AraS50b3AsdS55KSxzLnRvcCtpLnRvcCk6bi5ib3R0b20mJihlLnk9TWF0aC5tYXgoTWF0aC5taW4obC5ib3R0b20raS5ib3R0b20sdS55KSxzLmJvdHRvbStpLmJvdHRvbSkpLG4ubGVmdD9lLng9TWF0aC5taW4oTWF0aC5tYXgobC5sZWZ0K2kubGVmdCx1LngpLHMubGVmdCtpLmxlZnQpOm4ucmlnaHQmJihlLng9TWF0aC5tYXgoTWF0aC5taW4obC5yaWdodCtpLnJpZ2h0LHUueCkscy5yaWdodCtpLnJpZ2h0KSl9fSxkZWZhdWx0czp7aW5uZXI6bnVsbCxvdXRlcjpudWxsLG9mZnNldDpudWxsLGVuZE9ubHk6ITEsZW5hYmxlZDohMX19O3N1LnJlc3RyaWN0RWRnZXM9Z3U7dmFyIGJ1PSgwLENpLm1ha2VNb2RpZmllcikoZ3UsXCJyZXN0cmljdEVkZ2VzXCIpO3N1LmRlZmF1bHQ9YnU7dmFyIG11LE91PXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShPdSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxPdS5yZXN0cmljdFJlY3Q9T3UuZGVmYXVsdD12b2lkIDA7dmFyIHd1PSgwLCgobXU9Y3QpJiZtdS5fX2VzTW9kdWxlP211OntkZWZhdWx0Om11fSkuZGVmYXVsdCkoe2dldCBlbGVtZW50UmVjdCgpe3JldHVybnt0b3A6MCxsZWZ0OjAsYm90dG9tOjEscmlnaHQ6MX19LHNldCBlbGVtZW50UmVjdCh0KXt9fSxaYS5yZXN0cmljdC5kZWZhdWx0cyksX3U9e3N0YXJ0OlphLnJlc3RyaWN0LnN0YXJ0LHNldDpaYS5yZXN0cmljdC5zZXQsZGVmYXVsdHM6d3V9O091LnJlc3RyaWN0UmVjdD1fdTt2YXIgUHU9KDAsQ2kubWFrZU1vZGlmaWVyKShfdSxcInJlc3RyaWN0UmVjdFwiKTtPdS5kZWZhdWx0PVB1O3ZhciB4dT17fTtmdW5jdGlvbiBTdSh0KXtyZXR1cm4oU3U9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eSh4dSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSx4dS5yZXN0cmljdFNpemU9eHUuZGVmYXVsdD12b2lkIDA7dmFyIGp1LE11PShqdT1jdCkmJmp1Ll9fZXNNb2R1bGU/anU6e2RlZmF1bHQ6anV9LGt1PWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVN1KHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPUV1KCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KCR0KTtmdW5jdGlvbiBFdSgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIEV1PWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9dmFyIFR1PXt3aWR0aDotMS8wLGhlaWdodDotMS8wfSxEdT17d2lkdGg6MS8wLGhlaWdodDoxLzB9O3ZhciBJdT17c3RhcnQ6ZnVuY3Rpb24odCl7cmV0dXJuIHN1LnJlc3RyaWN0RWRnZXMuc3RhcnQodCl9LHNldDpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5zdGF0ZSxyPXQucmVjdCxvPXQuZWRnZXMsaT1uLm9wdGlvbnM7aWYobyl7dmFyIGE9a3UudGxiclRvWHl3aCgoMCxaYS5nZXRSZXN0cmljdGlvblJlY3QpKGkubWluLGUsdC5jb29yZHMpKXx8VHUsdT1rdS50bGJyVG9YeXdoKCgwLFphLmdldFJlc3RyaWN0aW9uUmVjdCkoaS5tYXgsZSx0LmNvb3JkcykpfHxEdTtuLm9wdGlvbnM9e2VuZE9ubHk6aS5lbmRPbmx5LGlubmVyOigwLE11LmRlZmF1bHQpKHt9LHN1LnJlc3RyaWN0RWRnZXMubm9Jbm5lciksb3V0ZXI6KDAsTXUuZGVmYXVsdCkoe30sc3UucmVzdHJpY3RFZGdlcy5ub091dGVyKX0sby50b3A/KG4ub3B0aW9ucy5pbm5lci50b3A9ci5ib3R0b20tYS5oZWlnaHQsbi5vcHRpb25zLm91dGVyLnRvcD1yLmJvdHRvbS11LmhlaWdodCk6by5ib3R0b20mJihuLm9wdGlvbnMuaW5uZXIuYm90dG9tPXIudG9wK2EuaGVpZ2h0LG4ub3B0aW9ucy5vdXRlci5ib3R0b209ci50b3ArdS5oZWlnaHQpLG8ubGVmdD8obi5vcHRpb25zLmlubmVyLmxlZnQ9ci5yaWdodC1hLndpZHRoLG4ub3B0aW9ucy5vdXRlci5sZWZ0PXIucmlnaHQtdS53aWR0aCk6by5yaWdodCYmKG4ub3B0aW9ucy5pbm5lci5yaWdodD1yLmxlZnQrYS53aWR0aCxuLm9wdGlvbnMub3V0ZXIucmlnaHQ9ci5sZWZ0K3Uud2lkdGgpLHN1LnJlc3RyaWN0RWRnZXMuc2V0KHQpLG4ub3B0aW9ucz1pfX0sZGVmYXVsdHM6e21pbjpudWxsLG1heDpudWxsLGVuZE9ubHk6ITEsZW5hYmxlZDohMX19O3h1LnJlc3RyaWN0U2l6ZT1JdTt2YXIgenU9KDAsQ2kubWFrZU1vZGlmaWVyKShJdSxcInJlc3RyaWN0U2l6ZVwiKTt4dS5kZWZhdWx0PXp1O3ZhciBBdT17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoQXUsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksQXUuZGVmYXVsdD12b2lkIDA7ZnVuY3Rpb24gQ3UoKXt9Q3UuX2RlZmF1bHRzPXt9O3ZhciBXdT1DdTtBdS5kZWZhdWx0PVd1O3ZhciBSdT17fTtmdW5jdGlvbiBGdSh0KXtyZXR1cm4oRnU9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShSdSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxSdS5zbmFwPVJ1LmRlZmF1bHQ9dm9pZCAwO3ZhciBYdT1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1GdSh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1ZdSgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShsZSk7ZnVuY3Rpb24gWXUoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBZdT1mdW5jdGlvbigpe3JldHVybiB0fSx0fXZhciBOdT17c3RhcnQ6ZnVuY3Rpb24odCl7dmFyIGUsbixyLG89dC5pbnRlcmFjdGlvbixpPXQuaW50ZXJhY3RhYmxlLGE9dC5lbGVtZW50LHU9dC5yZWN0LHM9dC5zdGF0ZSxsPXQuc3RhcnRPZmZzZXQsYz1zLm9wdGlvbnMsZj1jLm9mZnNldFdpdGhPcmlnaW4/KG49KGU9dCkuaW50ZXJhY3Rpb24uZWxlbWVudCxYdS5yZWN0LnJlY3RUb1hZKFh1LnJlY3QucmVzb2x2ZVJlY3RMaWtlKGUuc3RhdGUub3B0aW9ucy5vcmlnaW4sbnVsbCxudWxsLFtuXSkpfHxYdS5nZXRPcmlnaW5YWShlLmludGVyYWN0YWJsZSxuLGUuaW50ZXJhY3Rpb24ucHJlcGFyZWQubmFtZSkpOnt4OjAseTowfTtpZihcInN0YXJ0Q29vcmRzXCI9PT1jLm9mZnNldClyPXt4Om8uY29vcmRzLnN0YXJ0LnBhZ2UueCx5Om8uY29vcmRzLnN0YXJ0LnBhZ2UueX07ZWxzZXt2YXIgcD1YdS5yZWN0LnJlc29sdmVSZWN0TGlrZShjLm9mZnNldCxpLGEsW29dKTsocj1YdS5yZWN0LnJlY3RUb1hZKHApfHx7eDowLHk6MH0pLngrPWYueCxyLnkrPWYueX12YXIgZD1jLnJlbGF0aXZlUG9pbnRzO3Mub2Zmc2V0cz11JiZkJiZkLmxlbmd0aD9kLm1hcChmdW5jdGlvbih0LGUpe3JldHVybntpbmRleDplLHJlbGF0aXZlUG9pbnQ6dCx4OmwubGVmdC11LndpZHRoKnQueCtyLngseTpsLnRvcC11LmhlaWdodCp0Lnkrci55fX0pOltYdS5leHRlbmQoe2luZGV4OjAscmVsYXRpdmVQb2ludDpudWxsfSxyKV19LHNldDpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0aW9uLG49dC5jb29yZHMscj10LnN0YXRlLG89ci5vcHRpb25zLGk9ci5vZmZzZXRzLGE9WHUuZ2V0T3JpZ2luWFkoZS5pbnRlcmFjdGFibGUsZS5lbGVtZW50LGUucHJlcGFyZWQubmFtZSksdT1YdS5leHRlbmQoe30sbikscz1bXTtvLm9mZnNldFdpdGhPcmlnaW58fCh1LngtPWEueCx1LnktPWEueSk7Zm9yKHZhciBsPTA7bDxpLmxlbmd0aDtsKyspZm9yKHZhciBjPWlbbF0sZj11LngtYy54LHA9dS55LWMueSxkPTAsdj1vLnRhcmdldHMubGVuZ3RoO2Q8djtkKyspe3ZhciB5PW8udGFyZ2V0c1tkXSxoPXZvaWQgMDsoaD1YdS5pcy5mdW5jKHkpP3koZixwLGUsYyxkKTp5KSYmcy5wdXNoKHt4OihYdS5pcy5udW1iZXIoaC54KT9oLng6ZikrYy54LHk6KFh1LmlzLm51bWJlcihoLnkpP2gueTpwKStjLnkscmFuZ2U6WHUuaXMubnVtYmVyKGgucmFuZ2UpP2gucmFuZ2U6by5yYW5nZSxzb3VyY2U6eSxpbmRleDpkLG9mZnNldDpjfSl9Zm9yKHZhciBnPXt0YXJnZXQ6bnVsbCxpblJhbmdlOiExLGRpc3RhbmNlOjAscmFuZ2U6MCxkZWx0YTp7eDowLHk6MH19LGI9MDtiPHMubGVuZ3RoO2IrKyl7dmFyIG09c1tiXSxPPW0ucmFuZ2Usdz1tLngtdS54LF89bS55LXUueSxQPVh1Lmh5cG90KHcsXykseD1QPD1PO089PT0xLzAmJmcuaW5SYW5nZSYmZy5yYW5nZSE9PTEvMCYmKHg9ITEpLGcudGFyZ2V0JiYhKHg/Zy5pblJhbmdlJiZPIT09MS8wP1AvTzxnLmRpc3RhbmNlL2cucmFuZ2U6Tz09PTEvMCYmZy5yYW5nZSE9PTEvMHx8UDxnLmRpc3RhbmNlOiFnLmluUmFuZ2UmJlA8Zy5kaXN0YW5jZSl8fChnLnRhcmdldD1tLGcuZGlzdGFuY2U9UCxnLnJhbmdlPU8sZy5pblJhbmdlPXgsZy5kZWx0YS54PXcsZy5kZWx0YS55PV8pfXJldHVybiBnLmluUmFuZ2UmJihuLng9Zy50YXJnZXQueCxuLnk9Zy50YXJnZXQueSksci5jbG9zZXN0PWd9LGRlZmF1bHRzOntyYW5nZToxLzAsdGFyZ2V0czpudWxsLG9mZnNldDpudWxsLG9mZnNldFdpdGhPcmlnaW46ITAsb3JpZ2luOm51bGwscmVsYXRpdmVQb2ludHM6bnVsbCxlbmRPbmx5OiExLGVuYWJsZWQ6ITF9fTtSdS5zbmFwPU51O3ZhciBMdT0oMCxDaS5tYWtlTW9kaWZpZXIpKE51LFwic25hcFwiKTtSdS5kZWZhdWx0PUx1O3ZhciBCdT17fTtmdW5jdGlvbiBWdSh0KXtyZXR1cm4oVnU9XCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZcInN5bWJvbFwiPT10eXBlb2YgU3ltYm9sLml0ZXJhdG9yP2Z1bmN0aW9uKHQpe3JldHVybiB0eXBlb2YgdH06ZnVuY3Rpb24odCl7cmV0dXJuIHQmJlwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmdC5jb25zdHJ1Y3Rvcj09PVN5bWJvbCYmdCE9PVN5bWJvbC5wcm90b3R5cGU/XCJzeW1ib2xcIjp0eXBlb2YgdH0pKHQpfU9iamVjdC5kZWZpbmVQcm9wZXJ0eShCdSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxCdS5zbmFwU2l6ZT1CdS5kZWZhdWx0PXZvaWQgMDt2YXIgcXUsVXU9KHF1PWN0KSYmcXUuX19lc01vZHVsZT9xdTp7ZGVmYXVsdDpxdX0sR3U9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09VnUodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9SHUoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0odyk7ZnVuY3Rpb24gSHUoKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBIdT1mdW5jdGlvbigpe3JldHVybiB0fSx0fWZ1bmN0aW9uIEt1KHQsZSl7cmV0dXJuIGZ1bmN0aW9uKHQpe2lmKEFycmF5LmlzQXJyYXkodCkpcmV0dXJuIHR9KHQpfHxmdW5jdGlvbih0LGUpe2lmKCEoU3ltYm9sLml0ZXJhdG9yIGluIE9iamVjdCh0KXx8XCJbb2JqZWN0IEFyZ3VtZW50c11cIj09PU9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbCh0KSkpcmV0dXJuO3ZhciBuPVtdLHI9ITAsbz0hMSxpPXZvaWQgMDt0cnl7Zm9yKHZhciBhLHU9dFtTeW1ib2wuaXRlcmF0b3JdKCk7IShyPShhPXUubmV4dCgpKS5kb25lKSYmKG4ucHVzaChhLnZhbHVlKSwhZXx8bi5sZW5ndGghPT1lKTtyPSEwKTt9Y2F0Y2godCl7bz0hMCxpPXR9ZmluYWxseXt0cnl7cnx8bnVsbD09dS5yZXR1cm58fHUucmV0dXJuKCl9ZmluYWxseXtpZihvKXRocm93IGl9fXJldHVybiBufSh0LGUpfHxmdW5jdGlvbigpe3Rocm93IG5ldyBUeXBlRXJyb3IoXCJJbnZhbGlkIGF0dGVtcHQgdG8gZGVzdHJ1Y3R1cmUgbm9uLWl0ZXJhYmxlIGluc3RhbmNlXCIpfSgpfXZhciAkdT17c3RhcnQ6ZnVuY3Rpb24odCl7dmFyIGU9dC5zdGF0ZSxuPXQuZWRnZXMscj1lLm9wdGlvbnM7aWYoIW4pcmV0dXJuIG51bGw7dC5zdGF0ZT17b3B0aW9uczp7dGFyZ2V0czpudWxsLHJlbGF0aXZlUG9pbnRzOlt7eDpuLmxlZnQ/MDoxLHk6bi50b3A/MDoxfV0sb2Zmc2V0OnIub2Zmc2V0fHxcInNlbGZcIixvcmlnaW46e3g6MCx5OjB9LHJhbmdlOnIucmFuZ2V9fSxlLnRhcmdldEZpZWxkcz1lLnRhcmdldEZpZWxkc3x8W1tcIndpZHRoXCIsXCJoZWlnaHRcIl0sW1wieFwiLFwieVwiXV0sUnUuc25hcC5zdGFydCh0KSxlLm9mZnNldHM9dC5zdGF0ZS5vZmZzZXRzLHQuc3RhdGU9ZX0sc2V0OmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3Rpb24sbj10LnN0YXRlLHI9dC5jb29yZHMsbz1uLm9wdGlvbnMsaT1uLm9mZnNldHMsYT17eDpyLngtaVswXS54LHk6ci55LWlbMF0ueX07bi5vcHRpb25zPSgwLFV1LmRlZmF1bHQpKHt9LG8pLG4ub3B0aW9ucy50YXJnZXRzPVtdO2Zvcih2YXIgdT0wO3U8KG8udGFyZ2V0c3x8W10pLmxlbmd0aDt1Kyspe3ZhciBzPShvLnRhcmdldHN8fFtdKVt1XSxsPXZvaWQgMDtpZihsPUd1LmZ1bmMocyk/cyhhLngsYS55LGUpOnMpe2Zvcih2YXIgYz0wO2M8bi50YXJnZXRGaWVsZHMubGVuZ3RoO2MrKyl7dmFyIGY9S3Uobi50YXJnZXRGaWVsZHNbY10sMikscD1mWzBdLGQ9ZlsxXTtpZihwIGluIGx8fGQgaW4gbCl7bC54PWxbcF0sbC55PWxbZF07YnJlYWt9fW4ub3B0aW9ucy50YXJnZXRzLnB1c2gobCl9fXZhciB2PVJ1LnNuYXAuc2V0KHQpO3JldHVybiBuLm9wdGlvbnM9byx2fSxkZWZhdWx0czp7cmFuZ2U6MS8wLHRhcmdldHM6bnVsbCxvZmZzZXQ6bnVsbCxlbmRPbmx5OiExLGVuYWJsZWQ6ITF9fTtCdS5zbmFwU2l6ZT0kdTt2YXIgWnU9KDAsQ2kubWFrZU1vZGlmaWVyKSgkdSxcInNuYXBTaXplXCIpO0J1LmRlZmF1bHQ9WnU7dmFyIEp1PXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShKdSxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxKdS5zbmFwRWRnZXM9SnUuZGVmYXVsdD12b2lkIDA7dmFyIFF1PWVzKFYpLHRzPWVzKGN0KTtmdW5jdGlvbiBlcyh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIG5zPXtzdGFydDpmdW5jdGlvbih0KXt2YXIgZT10LmVkZ2VzO3JldHVybiBlPyh0LnN0YXRlLnRhcmdldEZpZWxkcz10LnN0YXRlLnRhcmdldEZpZWxkc3x8W1tlLmxlZnQ/XCJsZWZ0XCI6XCJyaWdodFwiLGUudG9wP1widG9wXCI6XCJib3R0b21cIl1dLEJ1LnNuYXBTaXplLnN0YXJ0KHQpKTpudWxsfSxzZXQ6QnUuc25hcFNpemUuc2V0LGRlZmF1bHRzOigwLHRzLmRlZmF1bHQpKCgwLFF1LmRlZmF1bHQpKEJ1LnNuYXBTaXplLmRlZmF1bHRzKSx7dGFyZ2V0czpudWxsLHJhbmdlOm51bGwsb2Zmc2V0Ont4OjAseTowfX0pfTtKdS5zbmFwRWRnZXM9bnM7dmFyIHJzPSgwLENpLm1ha2VNb2RpZmllcikobnMsXCJzbmFwRWRnZXNcIik7SnUuZGVmYXVsdD1yczt2YXIgb3M9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KG9zLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLG9zLmRlZmF1bHQ9dm9pZCAwO2Z1bmN0aW9uIGlzKCl7fWlzLl9kZWZhdWx0cz17fTt2YXIgYXM9aXM7b3MuZGVmYXVsdD1hczt2YXIgdXM9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHVzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHVzLmRlZmF1bHQ9dm9pZCAwO2Z1bmN0aW9uIHNzKCl7fXNzLl9kZWZhdWx0cz17fTt2YXIgbHM9c3M7dXMuZGVmYXVsdD1sczt2YXIgY3M9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KGNzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGNzLmRlZmF1bHQ9dm9pZCAwO3ZhciBmcz1QcyhSYSkscHM9UHMoSGEpLGRzPVBzKHN1KSx2cz1QcyhaYSkseXM9UHMoT3UpLGhzPVBzKHh1KSxncz1QcyhBdSksYnM9UHMoSnUpLG1zPVBzKFJ1KSxPcz1QcyhCdSksd3M9UHMob3MpLF9zPVBzKHVzKTtmdW5jdGlvbiBQcyh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19dmFyIHhzPXthc3BlY3RSYXRpbzpmcy5kZWZhdWx0LHJlc3RyaWN0RWRnZXM6ZHMuZGVmYXVsdCxyZXN0cmljdDp2cy5kZWZhdWx0LHJlc3RyaWN0UmVjdDp5cy5kZWZhdWx0LHJlc3RyaWN0U2l6ZTpocy5kZWZhdWx0LHNuYXBFZGdlczpicy5kZWZhdWx0LHNuYXA6bXMuZGVmYXVsdCxzbmFwU2l6ZTpPcy5kZWZhdWx0LHNwcmluZzp3cy5kZWZhdWx0LGF2b2lkOnBzLmRlZmF1bHQsdHJhbnNmb3JtOl9zLmRlZmF1bHQscnViYmVyYmFuZDpncy5kZWZhdWx0fTtjcy5kZWZhdWx0PXhzO3ZhciBTcz17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoU3MsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksU3MuZGVmYXVsdD12b2lkIDA7dmFyIGpzPUVzKFRhKSxNcz1Fcyhjcyksa3M9RXMoQ2kpO2Z1bmN0aW9uIEVzKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX12YXIgVHM9e2lkOlwibW9kaWZpZXJzXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt2YXIgZT10LmludGVyYWN0U3RhdGljO2Zvcih2YXIgbiBpbiB0LnVzZVBsdWdpbihrcy5kZWZhdWx0KSx0LnVzZVBsdWdpbihqcy5kZWZhdWx0KSxlLm1vZGlmaWVycz1Ncy5kZWZhdWx0LE1zLmRlZmF1bHQpe3ZhciByPU1zLmRlZmF1bHRbbl0sbz1yLl9kZWZhdWx0cyxpPXIuX21ldGhvZHM7by5fbWV0aG9kcz1pLHQuZGVmYXVsdHMucGVyQWN0aW9uW25dPW99fX07U3MuZGVmYXVsdD1Uczt2YXIgRHM9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KERzLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLERzLmRlZmF1bHQ9dm9pZCAwO0RzLmRlZmF1bHQ9e307dmFyIElzPXt9O09iamVjdC5kZWZpbmVQcm9wZXJ0eShJcyxcIl9fZXNNb2R1bGVcIix7dmFsdWU6ITB9KSxJcy5Qb2ludGVyRXZlbnQ9SXMuZGVmYXVsdD12b2lkIDA7dmFyIHpzLEFzPSh6cz1NZSkmJnpzLl9fZXNNb2R1bGU/enM6e2RlZmF1bHQ6enN9LENzPWZ1bmN0aW9uKHQpe2lmKHQmJnQuX19lc01vZHVsZSlyZXR1cm4gdDtpZihudWxsPT09dHx8XCJvYmplY3RcIiE9PVJzKHQpJiZcImZ1bmN0aW9uXCIhPXR5cGVvZiB0KXJldHVybntkZWZhdWx0OnR9O3ZhciBlPVdzKCk7aWYoZSYmZS5oYXModCkpcmV0dXJuIGUuZ2V0KHQpO3ZhciBuPXt9LHI9T2JqZWN0LmRlZmluZVByb3BlcnR5JiZPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO2Zvcih2YXIgbyBpbiB0KWlmKE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHkuY2FsbCh0LG8pKXt2YXIgaT1yP09iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IodCxvKTpudWxsO2kmJihpLmdldHx8aS5zZXQpP09iamVjdC5kZWZpbmVQcm9wZXJ0eShuLG8saSk6bltvXT10W29dfW4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbik7cmV0dXJuIG59KHp0KTtmdW5jdGlvbiBXcygpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIFdzPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gUnModCl7cmV0dXJuKFJzPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1mdW5jdGlvbiBGcyh0LGUpe2Zvcih2YXIgbj0wO248ZS5sZW5ndGg7bisrKXt2YXIgcj1lW25dO3IuZW51bWVyYWJsZT1yLmVudW1lcmFibGV8fCExLHIuY29uZmlndXJhYmxlPSEwLFwidmFsdWVcImluIHImJihyLndyaXRhYmxlPSEwKSxPYmplY3QuZGVmaW5lUHJvcGVydHkodCxyLmtleSxyKX19ZnVuY3Rpb24gWHModCl7cmV0dXJuKFhzPU9iamVjdC5zZXRQcm90b3R5cGVPZj9PYmplY3QuZ2V0UHJvdG90eXBlT2Y6ZnVuY3Rpb24odCl7cmV0dXJuIHQuX19wcm90b19ffHxPYmplY3QuZ2V0UHJvdG90eXBlT2YodCl9KSh0KX1mdW5jdGlvbiBZcyh0KXtpZih2b2lkIDA9PT10KXRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtyZXR1cm4gdH1mdW5jdGlvbiBOcyh0LGUpe3JldHVybihOcz1PYmplY3Quc2V0UHJvdG90eXBlT2Z8fGZ1bmN0aW9uKHQsZSl7cmV0dXJuIHQuX19wcm90b19fPWUsdH0pKHQsZSl9ZnVuY3Rpb24gTHModCxlLG4pe3JldHVybiBlIGluIHQ/T2JqZWN0LmRlZmluZVByb3BlcnR5KHQsZSx7dmFsdWU6bixlbnVtZXJhYmxlOiEwLGNvbmZpZ3VyYWJsZTohMCx3cml0YWJsZTohMH0pOnRbZV09bix0fXZhciBCcz1mdW5jdGlvbigpe2Z1bmN0aW9uIGYodCxlLG4scixvLGkpe3ZhciBhLHUscztpZighZnVuY3Rpb24odCxlKXtpZighKHQgaW5zdGFuY2VvZiBlKSl0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpfSh0aGlzLGYpLHU9dGhpcyxhPSEocz1YcyhmKS5jYWxsKHRoaXMsbykpfHxcIm9iamVjdFwiIT09UnMocykmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHM/WXModSk6cyxMcyhZcyhhKSxcInR5cGVcIix2b2lkIDApLExzKFlzKGEpLFwib3JpZ2luYWxFdmVudFwiLHZvaWQgMCksTHMoWXMoYSksXCJwb2ludGVySWRcIix2b2lkIDApLExzKFlzKGEpLFwicG9pbnRlclR5cGVcIix2b2lkIDApLExzKFlzKGEpLFwiZG91YmxlXCIsdm9pZCAwKSxMcyhZcyhhKSxcInBhZ2VYXCIsdm9pZCAwKSxMcyhZcyhhKSxcInBhZ2VZXCIsdm9pZCAwKSxMcyhZcyhhKSxcImNsaWVudFhcIix2b2lkIDApLExzKFlzKGEpLFwiY2xpZW50WVwiLHZvaWQgMCksTHMoWXMoYSksXCJkdFwiLHZvaWQgMCksTHMoWXMoYSksXCJldmVudGFibGVcIix2b2lkIDApLENzLnBvaW50ZXJFeHRlbmQoWXMoYSksbiksbiE9PWUmJkNzLnBvaW50ZXJFeHRlbmQoWXMoYSksZSksYS50aW1lU3RhbXA9aSxhLm9yaWdpbmFsRXZlbnQ9bixhLnR5cGU9dCxhLnBvaW50ZXJJZD1Dcy5nZXRQb2ludGVySWQoZSksYS5wb2ludGVyVHlwZT1Dcy5nZXRQb2ludGVyVHlwZShlKSxhLnRhcmdldD1yLGEuY3VycmVudFRhcmdldD1udWxsLFwidGFwXCI9PT10KXt2YXIgbD1vLmdldFBvaW50ZXJJbmRleChlKTthLmR0PWEudGltZVN0YW1wLW8ucG9pbnRlcnNbbF0uZG93blRpbWU7dmFyIGM9YS50aW1lU3RhbXAtby50YXBUaW1lO2EuZG91YmxlPSEhKG8ucHJldlRhcCYmXCJkb3VibGV0YXBcIiE9PW8ucHJldlRhcC50eXBlJiZvLnByZXZUYXAudGFyZ2V0PT09YS50YXJnZXQmJmM8NTAwKX1lbHNlXCJkb3VibGV0YXBcIj09PXQmJihhLmR0PWUudGltZVN0YW1wLW8udGFwVGltZSk7cmV0dXJuIGF9dmFyIHQsZSxuO3JldHVybiBmdW5jdGlvbih0LGUpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIGUmJm51bGwhPT1lKXRocm93IG5ldyBUeXBlRXJyb3IoXCJTdXBlciBleHByZXNzaW9uIG11c3QgZWl0aGVyIGJlIG51bGwgb3IgYSBmdW5jdGlvblwiKTt0LnByb3RvdHlwZT1PYmplY3QuY3JlYXRlKGUmJmUucHJvdG90eXBlLHtjb25zdHJ1Y3Rvcjp7dmFsdWU6dCx3cml0YWJsZTohMCxjb25maWd1cmFibGU6ITB9fSksZSYmTnModCxlKX0oZixBc1tcImRlZmF1bHRcIl0pLHQ9ZiwoZT1be2tleTpcIl9zdWJ0cmFjdE9yaWdpblwiLHZhbHVlOmZ1bmN0aW9uKHQpe3ZhciBlPXQueCxuPXQueTtyZXR1cm4gdGhpcy5wYWdlWC09ZSx0aGlzLnBhZ2VZLT1uLHRoaXMuY2xpZW50WC09ZSx0aGlzLmNsaWVudFktPW4sdGhpc319LHtrZXk6XCJfYWRkT3JpZ2luXCIsdmFsdWU6ZnVuY3Rpb24odCl7dmFyIGU9dC54LG49dC55O3JldHVybiB0aGlzLnBhZ2VYKz1lLHRoaXMucGFnZVkrPW4sdGhpcy5jbGllbnRYKz1lLHRoaXMuY2xpZW50WSs9bix0aGlzfX0se2tleTpcInByZXZlbnREZWZhdWx0XCIsdmFsdWU6ZnVuY3Rpb24oKXt0aGlzLm9yaWdpbmFsRXZlbnQucHJldmVudERlZmF1bHQoKX19XSkmJkZzKHQucHJvdG90eXBlLGUpLG4mJkZzKHQsbiksZn0oKTtJcy5Qb2ludGVyRXZlbnQ9SXMuZGVmYXVsdD1Cczt2YXIgVnM9e307ZnVuY3Rpb24gcXModCl7cmV0dXJuKHFzPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoVnMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksVnMuZGVmYXVsdD12b2lkIDA7S3MoRW4pLEtzKG0oe30pKTt2YXIgVXM9ZnVuY3Rpb24odCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09cXModCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9SHMoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119bi5kZWZhdWx0PXQsZSYmZS5zZXQodCxuKTtyZXR1cm4gbn0obGUpLEdzPUtzKElzKTtmdW5jdGlvbiBIcygpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIEhzPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gS3ModCl7cmV0dXJuIHQmJnQuX19lc01vZHVsZT90OntkZWZhdWx0OnR9fXZhciAkcz17aWQ6XCJwb2ludGVyLWV2ZW50cy9iYXNlXCIsaW5zdGFsbDpmdW5jdGlvbih0KXt0LnBvaW50ZXJFdmVudHM9JHMsdC5kZWZhdWx0cy5hY3Rpb25zLnBvaW50ZXJFdmVudHM9JHMuZGVmYXVsdHMsVXMuZXh0ZW5kKHQuYWN0aW9ucy5waGFzZWxlc3NUeXBlcywkcy50eXBlcyl9LGxpc3RlbmVyczp7XCJpbnRlcmFjdGlvbnM6bmV3XCI6ZnVuY3Rpb24odCl7dmFyIGU9dC5pbnRlcmFjdGlvbjtlLnByZXZUYXA9bnVsbCxlLnRhcFRpbWU9MH0sXCJpbnRlcmFjdGlvbnM6dXBkYXRlLXBvaW50ZXJcIjpmdW5jdGlvbih0KXt2YXIgZT10LmRvd24sbj10LnBvaW50ZXJJbmZvO2lmKCFlJiZuLmhvbGQpcmV0dXJuO24uaG9sZD17ZHVyYXRpb246MS8wLHRpbWVvdXQ6bnVsbH19LFwiaW50ZXJhY3Rpb25zOm1vdmVcIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb24scj10LnBvaW50ZXIsbz10LmV2ZW50LGk9dC5ldmVudFRhcmdldCxhPXQuZHVwbGljYXRlLHU9bi5nZXRQb2ludGVySW5kZXgocik7YXx8bi5wb2ludGVySXNEb3duJiYhbi5wb2ludGVyV2FzTW92ZWR8fChuLnBvaW50ZXJJc0Rvd24mJmNsZWFyVGltZW91dChuLnBvaW50ZXJzW3VdLmhvbGQudGltZW91dCksWnMoe2ludGVyYWN0aW9uOm4scG9pbnRlcjpyLGV2ZW50Om8sZXZlbnRUYXJnZXQ6aSx0eXBlOlwibW92ZVwifSxlKSl9LFwiaW50ZXJhY3Rpb25zOmRvd25cIjpmdW5jdGlvbih0LGUpeyFmdW5jdGlvbih0LGUpe2Zvcih2YXIgbj10LmludGVyYWN0aW9uLHI9dC5wb2ludGVyLG89dC5ldmVudCxpPXQuZXZlbnRUYXJnZXQsYT10LnBvaW50ZXJJbmRleCx1PW4ucG9pbnRlcnNbYV0uaG9sZCxzPVVzLmRvbS5nZXRQYXRoKGkpLGw9e2ludGVyYWN0aW9uOm4scG9pbnRlcjpyLGV2ZW50Om8sZXZlbnRUYXJnZXQ6aSx0eXBlOlwiaG9sZFwiLHRhcmdldHM6W10scGF0aDpzLG5vZGU6bnVsbH0sYz0wO2M8cy5sZW5ndGg7YysrKXt2YXIgZj1zW2NdO2wubm9kZT1mLGUuZmlyZShcInBvaW50ZXJFdmVudHM6Y29sbGVjdC10YXJnZXRzXCIsbCl9aWYoIWwudGFyZ2V0cy5sZW5ndGgpcmV0dXJuO2Zvcih2YXIgcD0xLzAsZD0wO2Q8bC50YXJnZXRzLmxlbmd0aDtkKyspe3ZhciB2PWwudGFyZ2V0c1tkXS5ldmVudGFibGUub3B0aW9ucy5ob2xkRHVyYXRpb247djxwJiYocD12KX11LmR1cmF0aW9uPXAsdS50aW1lb3V0PXNldFRpbWVvdXQoZnVuY3Rpb24oKXtacyh7aW50ZXJhY3Rpb246bixldmVudFRhcmdldDppLHBvaW50ZXI6cixldmVudDpvLHR5cGU6XCJob2xkXCJ9LGUpfSxwKX0odCxlKSxacyh0LGUpfSxcImludGVyYWN0aW9uczp1cFwiOmZ1bmN0aW9uKHQsZSl7dmFyIG4scixvLGksYSx1O1FzKHQpLFpzKHQsZSkscj1lLG89KG49dCkuaW50ZXJhY3Rpb24saT1uLnBvaW50ZXIsYT1uLmV2ZW50LHU9bi5ldmVudFRhcmdldCxvLnBvaW50ZXJXYXNNb3ZlZHx8WnMoe2ludGVyYWN0aW9uOm8sZXZlbnRUYXJnZXQ6dSxwb2ludGVyOmksZXZlbnQ6YSx0eXBlOlwidGFwXCJ9LHIpfSxcImludGVyYWN0aW9uczpjYW5jZWxcIjpmdW5jdGlvbih0LGUpe1FzKHQpLFpzKHQsZSl9fSxQb2ludGVyRXZlbnQ6R3MuZGVmYXVsdCxmaXJlOlpzLGNvbGxlY3RFdmVudFRhcmdldHM6SnMsZGVmYXVsdHM6e2hvbGREdXJhdGlvbjo2MDAsaWdub3JlRnJvbTpudWxsLGFsbG93RnJvbTpudWxsLG9yaWdpbjp7eDowLHk6MH19LHR5cGVzOntkb3duOiEwLG1vdmU6ITAsdXA6ITAsY2FuY2VsOiEwLHRhcDohMCxkb3VibGV0YXA6ITAsaG9sZDohMH19O2Z1bmN0aW9uIFpzKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPXQucG9pbnRlcixvPXQuZXZlbnQsaT10LmV2ZW50VGFyZ2V0LGE9dC50eXBlLHU9dC50YXJnZXRzLHM9dm9pZCAwPT09dT9Kcyh0LGUpOnUsbD1uZXcgR3MuZGVmYXVsdChhLHIsbyxpLG4sZS5ub3coKSk7ZS5maXJlKFwicG9pbnRlckV2ZW50czpuZXdcIix7cG9pbnRlckV2ZW50Omx9KTtmb3IodmFyIGM9e2ludGVyYWN0aW9uOm4scG9pbnRlcjpyLGV2ZW50Om8sZXZlbnRUYXJnZXQ6aSx0YXJnZXRzOnMsdHlwZTphLHBvaW50ZXJFdmVudDpsfSxmPTA7ZjxzLmxlbmd0aDtmKyspe3ZhciBwPXNbZl07Zm9yKHZhciBkIGluIHAucHJvcHN8fHt9KWxbZF09cC5wcm9wc1tkXTt2YXIgdj1Vcy5nZXRPcmlnaW5YWShwLmV2ZW50YWJsZSxwLm5vZGUpO2lmKGwuX3N1YnRyYWN0T3JpZ2luKHYpLGwuZXZlbnRhYmxlPXAuZXZlbnRhYmxlLGwuY3VycmVudFRhcmdldD1wLm5vZGUscC5ldmVudGFibGUuZmlyZShsKSxsLl9hZGRPcmlnaW4odiksbC5pbW1lZGlhdGVQcm9wYWdhdGlvblN0b3BwZWR8fGwucHJvcGFnYXRpb25TdG9wcGVkJiZmKzE8cy5sZW5ndGgmJnNbZisxXS5ub2RlIT09bC5jdXJyZW50VGFyZ2V0KWJyZWFrfWlmKGUuZmlyZShcInBvaW50ZXJFdmVudHM6ZmlyZWRcIixjKSxcInRhcFwiPT09YSl7dmFyIHk9bC5kb3VibGU/WnMoe2ludGVyYWN0aW9uOm4scG9pbnRlcjpyLGV2ZW50Om8sZXZlbnRUYXJnZXQ6aSx0eXBlOlwiZG91YmxldGFwXCJ9LGUpOmw7bi5wcmV2VGFwPXksbi50YXBUaW1lPXkudGltZVN0YW1wfXJldHVybiBsfWZ1bmN0aW9uIEpzKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPXQucG9pbnRlcixvPXQuZXZlbnQsaT10LmV2ZW50VGFyZ2V0LGE9dC50eXBlLHU9bi5nZXRQb2ludGVySW5kZXgocikscz1uLnBvaW50ZXJzW3VdO2lmKFwidGFwXCI9PT1hJiYobi5wb2ludGVyV2FzTW92ZWR8fCFzfHxzLmRvd25UYXJnZXQhPT1pKSlyZXR1cm5bXTtmb3IodmFyIGw9VXMuZG9tLmdldFBhdGgoaSksYz17aW50ZXJhY3Rpb246bixwb2ludGVyOnIsZXZlbnQ6byxldmVudFRhcmdldDppLHR5cGU6YSxwYXRoOmwsdGFyZ2V0czpbXSxub2RlOm51bGx9LGY9MDtmPGwubGVuZ3RoO2YrKyl7dmFyIHA9bFtmXTtjLm5vZGU9cCxlLmZpcmUoXCJwb2ludGVyRXZlbnRzOmNvbGxlY3QtdGFyZ2V0c1wiLGMpfXJldHVyblwiaG9sZFwiPT09YSYmKGMudGFyZ2V0cz1jLnRhcmdldHMuZmlsdGVyKGZ1bmN0aW9uKHQpe3JldHVybiB0LmV2ZW50YWJsZS5vcHRpb25zLmhvbGREdXJhdGlvbj09PW4ucG9pbnRlcnNbdV0uaG9sZC5kdXJhdGlvbn0pKSxjLnRhcmdldHN9ZnVuY3Rpb24gUXModCl7dmFyIGU9dC5pbnRlcmFjdGlvbixuPXQucG9pbnRlckluZGV4O2UucG9pbnRlcnNbbl0uaG9sZCYmY2xlYXJUaW1lb3V0KGUucG9pbnRlcnNbbl0uaG9sZC50aW1lb3V0KX12YXIgdGw9JHM7VnMuZGVmYXVsdD10bDt2YXIgZWw9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KGVsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGVsLmRlZmF1bHQ9dm9pZCAwO3JsKElzKTt2YXIgbmw9cmwoVnMpO2Z1bmN0aW9uIHJsKHQpe3JldHVybiB0JiZ0Ll9fZXNNb2R1bGU/dDp7ZGVmYXVsdDp0fX1mdW5jdGlvbiBvbCh0KXt2YXIgZT10LmludGVyYWN0aW9uO2UuaG9sZEludGVydmFsSGFuZGxlJiYoY2xlYXJJbnRlcnZhbChlLmhvbGRJbnRlcnZhbEhhbmRsZSksZS5ob2xkSW50ZXJ2YWxIYW5kbGU9bnVsbCl9dmFyIGlsPXtpZDpcInBvaW50ZXItZXZlbnRzL2hvbGRSZXBlYXRcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3QudXNlUGx1Z2luKG5sLmRlZmF1bHQpO3ZhciBlPXQucG9pbnRlckV2ZW50cztlLmRlZmF1bHRzLmhvbGRSZXBlYXRJbnRlcnZhbD0wLGUudHlwZXMuaG9sZHJlcGVhdD10LmFjdGlvbnMucGhhc2VsZXNzVHlwZXMuaG9sZHJlcGVhdD0hMH0sbGlzdGVuZXJzOltcIm1vdmVcIixcInVwXCIsXCJjYW5jZWxcIixcImVuZGFsbFwiXS5yZWR1Y2UoZnVuY3Rpb24odCxlKXtyZXR1cm4gdFtcInBvaW50ZXJFdmVudHM6XCIuY29uY2F0KGUpXT1vbCx0fSx7XCJwb2ludGVyRXZlbnRzOm5ld1wiOmZ1bmN0aW9uKHQpe3ZhciBlPXQucG9pbnRlckV2ZW50O1wiaG9sZFwiPT09ZS50eXBlJiYoZS5jb3VudD0oZS5jb3VudHx8MCkrMSl9LFwicG9pbnRlckV2ZW50czpmaXJlZFwiOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5pbnRlcmFjdGlvbixyPXQucG9pbnRlckV2ZW50LG89dC5ldmVudFRhcmdldCxpPXQudGFyZ2V0cztpZihcImhvbGRcIj09PXIudHlwZSYmaS5sZW5ndGgpe3ZhciBhPWlbMF0uZXZlbnRhYmxlLm9wdGlvbnMuaG9sZFJlcGVhdEludGVydmFsO2E8PTB8fChuLmhvbGRJbnRlcnZhbEhhbmRsZT1zZXRUaW1lb3V0KGZ1bmN0aW9uKCl7ZS5wb2ludGVyRXZlbnRzLmZpcmUoe2ludGVyYWN0aW9uOm4sZXZlbnRUYXJnZXQ6byx0eXBlOlwiaG9sZFwiLHBvaW50ZXI6cixldmVudDpyfSxlKX0sYSkpfX19KX07ZWwuZGVmYXVsdD1pbDt2YXIgYWw9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KGFsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGFsLmRlZmF1bHQ9dm9pZCAwO3ZhciB1bCxzbD0odWw9Y3QpJiZ1bC5fX2VzTW9kdWxlP3VsOntkZWZhdWx0OnVsfTtmdW5jdGlvbiBsbCh0KXtyZXR1cm4oMCxzbC5kZWZhdWx0KSh0aGlzLmV2ZW50cy5vcHRpb25zLHQpLHRoaXN9dmFyIGNsPXtpZDpcInBvaW50ZXItZXZlbnRzL2ludGVyYWN0YWJsZVRhcmdldHNcIixpbnN0YWxsOmZ1bmN0aW9uKHQpe3ZhciBlPXQuSW50ZXJhY3RhYmxlO2UucHJvdG90eXBlLnBvaW50ZXJFdmVudHM9bGw7dmFyIHI9ZS5wcm90b3R5cGUuX2JhY2tDb21wYXRPcHRpb247ZS5wcm90b3R5cGUuX2JhY2tDb21wYXRPcHRpb249ZnVuY3Rpb24odCxlKXt2YXIgbj1yLmNhbGwodGhpcyx0LGUpO3JldHVybiBuPT09dGhpcyYmKHRoaXMuZXZlbnRzLm9wdGlvbnNbdF09ZSksbn19LGxpc3RlbmVyczp7XCJwb2ludGVyRXZlbnRzOmNvbGxlY3QtdGFyZ2V0c1wiOmZ1bmN0aW9uKHQsZSl7dmFyIHI9dC50YXJnZXRzLG89dC5ub2RlLGk9dC50eXBlLGE9dC5ldmVudFRhcmdldDtlLmludGVyYWN0YWJsZXMuZm9yRWFjaE1hdGNoKG8sZnVuY3Rpb24odCl7dmFyIGU9dC5ldmVudHMsbj1lLm9wdGlvbnM7ZS50eXBlc1tpXSYmZS50eXBlc1tpXS5sZW5ndGgmJnQudGVzdElnbm9yZUFsbG93KG4sbyxhKSYmci5wdXNoKHtub2RlOm8sZXZlbnRhYmxlOmUscHJvcHM6e2ludGVyYWN0YWJsZTp0fX0pfSl9LFwiaW50ZXJhY3RhYmxlOm5ld1wiOmZ1bmN0aW9uKHQpe3ZhciBlPXQuaW50ZXJhY3RhYmxlO2UuZXZlbnRzLmdldFJlY3Q9ZnVuY3Rpb24odCl7cmV0dXJuIGUuZ2V0UmVjdCh0KX19LFwiaW50ZXJhY3RhYmxlOnNldFwiOmZ1bmN0aW9uKHQsZSl7dmFyIG49dC5pbnRlcmFjdGFibGUscj10Lm9wdGlvbnM7KDAsc2wuZGVmYXVsdCkobi5ldmVudHMub3B0aW9ucyxlLnBvaW50ZXJFdmVudHMuZGVmYXVsdHMpLCgwLHNsLmRlZmF1bHQpKG4uZXZlbnRzLm9wdGlvbnMsci5wb2ludGVyRXZlbnRzfHx7fSl9fX07YWwuZGVmYXVsdD1jbDt2YXIgZmw9e307ZnVuY3Rpb24gcGwodCl7cmV0dXJuKHBsPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1PYmplY3QuZGVmaW5lUHJvcGVydHkoZmwsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksT2JqZWN0LmRlZmluZVByb3BlcnR5KGZsLFwiaG9sZFJlcGVhdFwiLHtlbnVtZXJhYmxlOiEwLGdldDpmdW5jdGlvbigpe3JldHVybiB2bC5kZWZhdWx0fX0pLE9iamVjdC5kZWZpbmVQcm9wZXJ0eShmbCxcImludGVyYWN0YWJsZVRhcmdldHNcIix7ZW51bWVyYWJsZTohMCxnZXQ6ZnVuY3Rpb24oKXtyZXR1cm4geWwuZGVmYXVsdH19KSxmbC5wb2ludGVyRXZlbnRzPWZsLmRlZmF1bHQ9dm9pZCAwO3ZhciBkbD1mdW5jdGlvbih0KXtpZih0JiZ0Ll9fZXNNb2R1bGUpcmV0dXJuIHQ7aWYobnVsbD09PXR8fFwib2JqZWN0XCIhPT1wbCh0KSYmXCJmdW5jdGlvblwiIT10eXBlb2YgdClyZXR1cm57ZGVmYXVsdDp0fTt2YXIgZT1nbCgpO2lmKGUmJmUuaGFzKHQpKXJldHVybiBlLmdldCh0KTt2YXIgbj17fSxyPU9iamVjdC5kZWZpbmVQcm9wZXJ0eSYmT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcjtmb3IodmFyIG8gaW4gdClpZihPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwodCxvKSl7dmFyIGk9cj9PYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHQsbyk6bnVsbDtpJiYoaS5nZXR8fGkuc2V0KT9PYmplY3QuZGVmaW5lUHJvcGVydHkobixvLGkpOm5bb109dFtvXX1uLmRlZmF1bHQ9dCxlJiZlLnNldCh0LG4pO3JldHVybiBufShWcyk7ZmwucG9pbnRlckV2ZW50cz1kbDt2YXIgdmw9aGwoZWwpLHlsPWhsKGFsKTtmdW5jdGlvbiBobCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19ZnVuY3Rpb24gZ2woKXtpZihcImZ1bmN0aW9uXCIhPXR5cGVvZiBXZWFrTWFwKXJldHVybiBudWxsO3ZhciB0PW5ldyBXZWFrTWFwO3JldHVybiBnbD1mdW5jdGlvbigpe3JldHVybiB0fSx0fXZhciBibD17aWQ6XCJwb2ludGVyLWV2ZW50c1wiLGluc3RhbGw6ZnVuY3Rpb24odCl7dC51c2VQbHVnaW4oZGwpLHQudXNlUGx1Z2luKHZsLmRlZmF1bHQpLHQudXNlUGx1Z2luKHlsLmRlZmF1bHQpfX07ZmwuZGVmYXVsdD1ibDt2YXIgbWw9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KG1sLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLG1sLmluc3RhbGw9d2wsbWwuZGVmYXVsdD12b2lkIDA7dmFyIE9sOyhPbD1rKHt9KSkmJk9sLl9fZXNNb2R1bGU7ZnVuY3Rpb24gd2woZSl7dmFyIHQ9ZS5JbnRlcmFjdGFibGU7ZS5hY3Rpb25zLnBoYXNlcy5yZWZsb3c9ITAsdC5wcm90b3R5cGUucmVmbG93PWZ1bmN0aW9uKHQpe3JldHVybiBmdW5jdGlvbih1LHMsbCl7ZnVuY3Rpb24gdCgpe3ZhciBlPWNbZF0sdD11LmdldFJlY3QoZSk7aWYoIXQpcmV0dXJuXCJicmVha1wiO3ZhciBuPWxlLmFyci5maW5kKGwuaW50ZXJhY3Rpb25zLmxpc3QsZnVuY3Rpb24odCl7cmV0dXJuIHQuaW50ZXJhY3RpbmcoKSYmdC5pbnRlcmFjdGFibGU9PT11JiZ0LmVsZW1lbnQ9PT1lJiZ0LnByZXBhcmVkLm5hbWU9PT1zLm5hbWV9KSxyPXZvaWQgMDtpZihuKW4ubW92ZSgpLHAmJihyPW4uX3JlZmxvd1Byb21pc2V8fG5ldyBmKGZ1bmN0aW9uKHQpe24uX3JlZmxvd1Jlc29sdmU9dH0pKTtlbHNle3ZhciBvPWxlLnJlY3QudGxiclRvWHl3aCh0KSxpPXtwYWdlOnt4Om8ueCx5Om8ueX0sY2xpZW50Ont4Om8ueCx5Om8ueX0sdGltZVN0YW1wOmwubm93KCl9LGE9bGUucG9pbnRlci5jb29yZHNUb0V2ZW50KGkpO3I9ZnVuY3Rpb24odCxlLG4scixvKXt2YXIgaT10LmludGVyYWN0aW9ucy5uZXcoe3BvaW50ZXJUeXBlOlwicmVmbG93XCJ9KSxhPXtpbnRlcmFjdGlvbjppLGV2ZW50Om8scG9pbnRlcjpvLGV2ZW50VGFyZ2V0Om4scGhhc2U6XCJyZWZsb3dcIn07aS5pbnRlcmFjdGFibGU9ZSxpLmVsZW1lbnQ9bixpLnByZXBhcmVkPSgwLGxlLmV4dGVuZCkoe30sciksaS5wcmV2RXZlbnQ9byxpLnVwZGF0ZVBvaW50ZXIobyxvLG4sITApLGkuX2RvUGhhc2UoYSk7dmFyIHU9bGUud2luLndpbmRvdy5Qcm9taXNlP25ldyBsZS53aW4ud2luZG93LlByb21pc2UoZnVuY3Rpb24odCl7aS5fcmVmbG93UmVzb2x2ZT10fSk6bnVsbDtpLl9yZWZsb3dQcm9taXNlPXUsaS5zdGFydChyLGUsbiksaS5faW50ZXJhY3Rpbmc/KGkubW92ZShhKSxpLmVuZChvKSk6aS5zdG9wKCk7cmV0dXJuIGkucmVtb3ZlUG9pbnRlcihvLG8pLGkucG9pbnRlcklzRG93bj0hMSx1fShsLHUsZSxzLGEpfXAmJnAucHVzaChyKX1mb3IodmFyIGM9bGUuaXMuc3RyaW5nKHUudGFyZ2V0KT9sZS5hcnIuZnJvbSh1Ll9jb250ZXh0LnF1ZXJ5U2VsZWN0b3JBbGwodS50YXJnZXQpKTpbdS50YXJnZXRdLGY9bGUud2luLndpbmRvdy5Qcm9taXNlLHA9Zj9bXTpudWxsLGQ9MDtkPGMubGVuZ3RoO2QrKyl7aWYoXCJicmVha1wiPT09dCgpKWJyZWFrfXJldHVybiBwJiZmLmFsbChwKS50aGVuKGZ1bmN0aW9uKCl7cmV0dXJuIHV9KX0odGhpcyx0LGUpfX12YXIgX2w9e2lkOlwicmVmbG93XCIsaW5zdGFsbDp3bCxsaXN0ZW5lcnM6e1wiaW50ZXJhY3Rpb25zOnN0b3BcIjpmdW5jdGlvbih0LGUpe3ZhciBuPXQuaW50ZXJhY3Rpb247XCJyZWZsb3dcIj09PW4ucG9pbnRlclR5cGUmJihuLl9yZWZsb3dSZXNvbHZlJiZuLl9yZWZsb3dSZXNvbHZlKCksbGUuYXJyLnJlbW92ZShlLmludGVyYWN0aW9ucy5saXN0LG4pKX19fTttbC5kZWZhdWx0PV9sO3ZhciBQbD17fTtPYmplY3QuZGVmaW5lUHJvcGVydHkoUGwsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksUGwuZGVmYXVsdD12b2lkIDA7UGwuZGVmYXVsdD17fTt2YXIgeGw9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KHhsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLHhsLmV4Y2hhbmdlPXZvaWQgMDt4bC5leGNoYW5nZT17fTt2YXIgU2w9e307T2JqZWN0LmRlZmluZVByb3BlcnR5KFNsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLFNsLmRlZmF1bHQ9dm9pZCAwO1NsLmRlZmF1bHQ9e307dmFyIGpsPXt9O2Z1bmN0aW9uIE1sKHQpe3JldHVybihNbD1cImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJlwic3ltYm9sXCI9PXR5cGVvZiBTeW1ib2wuaXRlcmF0b3I/ZnVuY3Rpb24odCl7cmV0dXJuIHR5cGVvZiB0fTpmdW5jdGlvbih0KXtyZXR1cm4gdCYmXCJmdW5jdGlvblwiPT10eXBlb2YgU3ltYm9sJiZ0LmNvbnN0cnVjdG9yPT09U3ltYm9sJiZ0IT09U3ltYm9sLnByb3RvdHlwZT9cInN5bWJvbFwiOnR5cGVvZiB0fSkodCl9T2JqZWN0LmRlZmluZVByb3BlcnR5KGpsLFwiX19lc01vZHVsZVwiLHt2YWx1ZTohMH0pLGpsLmRlZmF1bHQ9dm9pZCAwO3ZhciBrbD1IbChRciksRWw9SGwoYW8pLFRsPUhsKHVvKSxEbD1IbCh0aSksSWw9SGwoYWkpLHpsPUhsKHVpKSxBbD1IbChVbiksQ2w9KEhsKHNpKSxHbCh3aSkpLFdsPUhsKCRpKSxSbD1IbChoYSksRmw9SGwoU3MpLFhsPUhsKERzKSxZbD1IbChZaSksTmw9SGwoZmwpLExsPUhsKG1sKSxCbD1HbChQbCksVmw9R2woenQpLHFsPUdsKFNsKTtmdW5jdGlvbiBVbCgpe2lmKFwiZnVuY3Rpb25cIiE9dHlwZW9mIFdlYWtNYXApcmV0dXJuIG51bGw7dmFyIHQ9bmV3IFdlYWtNYXA7cmV0dXJuIFVsPWZ1bmN0aW9uKCl7cmV0dXJuIHR9LHR9ZnVuY3Rpb24gR2wodCl7aWYodCYmdC5fX2VzTW9kdWxlKXJldHVybiB0O2lmKG51bGw9PT10fHxcIm9iamVjdFwiIT09TWwodCkmJlwiZnVuY3Rpb25cIiE9dHlwZW9mIHQpcmV0dXJue2RlZmF1bHQ6dH07dmFyIGU9VWwoKTtpZihlJiZlLmhhcyh0KSlyZXR1cm4gZS5nZXQodCk7dmFyIG49e30scj1PYmplY3QuZGVmaW5lUHJvcGVydHkmJk9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7Zm9yKHZhciBvIGluIHQpaWYoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKHQsbykpe3ZhciBpPXI/T2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcih0LG8pOm51bGw7aSYmKGkuZ2V0fHxpLnNldCk/T2JqZWN0LmRlZmluZVByb3BlcnR5KG4sbyxpKTpuW29dPXRbb119cmV0dXJuIG4uZGVmYXVsdD10LGUmJmUuc2V0KHQsbiksbn1mdW5jdGlvbiBIbCh0KXtyZXR1cm4gdCYmdC5fX2VzTW9kdWxlP3Q6e2RlZmF1bHQ6dH19UmwuZGVmYXVsdC51c2UoWGwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoQWwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoWWwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoSWwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoRWwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoTmwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoV2wuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoRmwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoRGwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2Uoa2wuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoVGwuZGVmYXVsdCksUmwuZGVmYXVsdC51c2UoTGwuZGVmYXVsdCksUmwuZGVmYXVsdC5mZWVkYmFjaz1DbCxSbC5kZWZhdWx0LnVzZSh6bC5kZWZhdWx0KSxSbC5kZWZhdWx0LnZ1ZT17Y29tcG9uZW50czpxbH0sUmwuZGVmYXVsdC5fX3V0aWxzPXtleGNoYW5nZTp4bC5leGNoYW5nZSxkaXNwbGFjZTpCbCxwb2ludGVyOlZsfTt2YXIgS2w9UmwuZGVmYXVsdDtqbC5kZWZhdWx0PUtsO3ZhciAkbD17ZXhwb3J0czp7fX07T2JqZWN0LmRlZmluZVByb3BlcnR5KCRsLmV4cG9ydHMsXCJfX2VzTW9kdWxlXCIse3ZhbHVlOiEwfSksJGwuZXhwb3J0cy5kZWZhdWx0PXZvaWQgMDt2YXIgWmwsSmw9KFpsPWpsKSYmWmwuX19lc01vZHVsZT9abDp7ZGVmYXVsdDpabH07ZnVuY3Rpb24gUWwodCl7cmV0dXJuKFFsPVwiZnVuY3Rpb25cIj09dHlwZW9mIFN5bWJvbCYmXCJzeW1ib2xcIj09dHlwZW9mIFN5bWJvbC5pdGVyYXRvcj9mdW5jdGlvbih0KXtyZXR1cm4gdHlwZW9mIHR9OmZ1bmN0aW9uKHQpe3JldHVybiB0JiZcImZ1bmN0aW9uXCI9PXR5cGVvZiBTeW1ib2wmJnQuY29uc3RydWN0b3I9PT1TeW1ib2wmJnQhPT1TeW1ib2wucHJvdG90eXBlP1wic3ltYm9sXCI6dHlwZW9mIHR9KSh0KX1pZihcIm9iamVjdFwiPT09UWwoJGwpJiYkbCl0cnl7JGwuZXhwb3J0cz1KbC5kZWZhdWx0fWNhdGNoKHQpe31KbC5kZWZhdWx0LmRlZmF1bHQ9SmwuZGVmYXVsdDt2YXIgdGM9SmwuZGVmYXVsdDtyZXR1cm4gJGwuZXhwb3J0cy5kZWZhdWx0PXRjLCRsPSRsLmV4cG9ydHN9KTtcblxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9aW50ZXJhY3QubWluLmpzLm1hcFxuIiwiLypcbiogbG9nbGV2ZWwgLSBodHRwczovL2dpdGh1Yi5jb20vcGltdGVycnkvbG9nbGV2ZWxcbipcbiogQ29weXJpZ2h0IChjKSAyMDEzIFRpbSBQZXJyeVxuKiBMaWNlbnNlZCB1bmRlciB0aGUgTUlUIGxpY2Vuc2UuXG4qL1xuKGZ1bmN0aW9uIChyb290LCBkZWZpbml0aW9uKSB7XG4gICAgXCJ1c2Ugc3RyaWN0XCI7XG4gICAgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgZGVmaW5lLmFtZCkge1xuICAgICAgICBkZWZpbmUoZGVmaW5pdGlvbik7XG4gICAgfSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlID09PSAnb2JqZWN0JyAmJiBtb2R1bGUuZXhwb3J0cykge1xuICAgICAgICBtb2R1bGUuZXhwb3J0cyA9IGRlZmluaXRpb24oKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICByb290LmxvZyA9IGRlZmluaXRpb24oKTtcbiAgICB9XG59KHRoaXMsIGZ1bmN0aW9uICgpIHtcbiAgICBcInVzZSBzdHJpY3RcIjtcblxuICAgIC8vIFNsaWdodGx5IGR1YmlvdXMgdHJpY2tzIHRvIGN1dCBkb3duIG1pbmltaXplZCBmaWxlIHNpemVcbiAgICB2YXIgbm9vcCA9IGZ1bmN0aW9uKCkge307XG4gICAgdmFyIHVuZGVmaW5lZFR5cGUgPSBcInVuZGVmaW5lZFwiO1xuICAgIHZhciBpc0lFID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpICYmICh0eXBlb2Ygd2luZG93Lm5hdmlnYXRvciAhPT0gdW5kZWZpbmVkVHlwZSkgJiYgKFxuICAgICAgICAvVHJpZGVudFxcL3xNU0lFIC8udGVzdCh3aW5kb3cubmF2aWdhdG9yLnVzZXJBZ2VudClcbiAgICApO1xuXG4gICAgdmFyIGxvZ01ldGhvZHMgPSBbXG4gICAgICAgIFwidHJhY2VcIixcbiAgICAgICAgXCJkZWJ1Z1wiLFxuICAgICAgICBcImluZm9cIixcbiAgICAgICAgXCJ3YXJuXCIsXG4gICAgICAgIFwiZXJyb3JcIlxuICAgIF07XG5cbiAgICAvLyBDcm9zcy1icm93c2VyIGJpbmQgZXF1aXZhbGVudCB0aGF0IHdvcmtzIGF0IGxlYXN0IGJhY2sgdG8gSUU2XG4gICAgZnVuY3Rpb24gYmluZE1ldGhvZChvYmosIG1ldGhvZE5hbWUpIHtcbiAgICAgICAgdmFyIG1ldGhvZCA9IG9ialttZXRob2ROYW1lXTtcbiAgICAgICAgaWYgKHR5cGVvZiBtZXRob2QuYmluZCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgcmV0dXJuIG1ldGhvZC5iaW5kKG9iaik7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICAgIHJldHVybiBGdW5jdGlvbi5wcm90b3R5cGUuYmluZC5jYWxsKG1ldGhvZCwgb2JqKTtcbiAgICAgICAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgICAgICAgICAvLyBNaXNzaW5nIGJpbmQgc2hpbSBvciBJRTggKyBNb2Rlcm5penIsIGZhbGxiYWNrIHRvIHdyYXBwaW5nXG4gICAgICAgICAgICAgICAgcmV0dXJuIGZ1bmN0aW9uKCkge1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gRnVuY3Rpb24ucHJvdG90eXBlLmFwcGx5LmFwcGx5KG1ldGhvZCwgW29iaiwgYXJndW1lbnRzXSk7XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIFRyYWNlKCkgZG9lc24ndCBwcmludCB0aGUgbWVzc2FnZSBpbiBJRSwgc28gZm9yIHRoYXQgY2FzZSB3ZSBuZWVkIHRvIHdyYXAgaXRcbiAgICBmdW5jdGlvbiB0cmFjZUZvcklFKCkge1xuICAgICAgICBpZiAoY29uc29sZS5sb2cpIHtcbiAgICAgICAgICAgIGlmIChjb25zb2xlLmxvZy5hcHBseSkge1xuICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nLmFwcGx5KGNvbnNvbGUsIGFyZ3VtZW50cyk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIEluIG9sZCBJRSwgbmF0aXZlIGNvbnNvbGUgbWV0aG9kcyB0aGVtc2VsdmVzIGRvbid0IGhhdmUgYXBwbHkoKS5cbiAgICAgICAgICAgICAgICBGdW5jdGlvbi5wcm90b3R5cGUuYXBwbHkuYXBwbHkoY29uc29sZS5sb2csIFtjb25zb2xlLCBhcmd1bWVudHNdKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBpZiAoY29uc29sZS50cmFjZSkgY29uc29sZS50cmFjZSgpO1xuICAgIH1cblxuICAgIC8vIEJ1aWxkIHRoZSBiZXN0IGxvZ2dpbmcgbWV0aG9kIHBvc3NpYmxlIGZvciB0aGlzIGVudlxuICAgIC8vIFdoZXJldmVyIHBvc3NpYmxlIHdlIHdhbnQgdG8gYmluZCwgbm90IHdyYXAsIHRvIHByZXNlcnZlIHN0YWNrIHRyYWNlc1xuICAgIGZ1bmN0aW9uIHJlYWxNZXRob2QobWV0aG9kTmFtZSkge1xuICAgICAgICBpZiAobWV0aG9kTmFtZSA9PT0gJ2RlYnVnJykge1xuICAgICAgICAgICAgbWV0aG9kTmFtZSA9ICdsb2cnO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHR5cGVvZiBjb25zb2xlID09PSB1bmRlZmluZWRUeXBlKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7IC8vIE5vIG1ldGhvZCBwb3NzaWJsZSwgZm9yIG5vdyAtIGZpeGVkIGxhdGVyIGJ5IGVuYWJsZUxvZ2dpbmdXaGVuQ29uc29sZUFycml2ZXNcbiAgICAgICAgfSBlbHNlIGlmIChtZXRob2ROYW1lID09PSAndHJhY2UnICYmIGlzSUUpIHtcbiAgICAgICAgICAgIHJldHVybiB0cmFjZUZvcklFO1xuICAgICAgICB9IGVsc2UgaWYgKGNvbnNvbGVbbWV0aG9kTmFtZV0gIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgbWV0aG9kTmFtZSk7XG4gICAgICAgIH0gZWxzZSBpZiAoY29uc29sZS5sb2cgIT09IHVuZGVmaW5lZCkge1xuICAgICAgICAgICAgcmV0dXJuIGJpbmRNZXRob2QoY29uc29sZSwgJ2xvZycpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmV0dXJuIG5vb3A7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBUaGVzZSBwcml2YXRlIGZ1bmN0aW9ucyBhbHdheXMgbmVlZCBgdGhpc2AgdG8gYmUgc2V0IHByb3Blcmx5XG5cbiAgICBmdW5jdGlvbiByZXBsYWNlTG9nZ2luZ01ldGhvZHMobGV2ZWwsIGxvZ2dlck5hbWUpIHtcbiAgICAgICAgLypqc2hpbnQgdmFsaWR0aGlzOnRydWUgKi9cbiAgICAgICAgZm9yICh2YXIgaSA9IDA7IGkgPCBsb2dNZXRob2RzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIgbWV0aG9kTmFtZSA9IGxvZ01ldGhvZHNbaV07XG4gICAgICAgICAgICB0aGlzW21ldGhvZE5hbWVdID0gKGkgPCBsZXZlbCkgP1xuICAgICAgICAgICAgICAgIG5vb3AgOlxuICAgICAgICAgICAgICAgIHRoaXMubWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBEZWZpbmUgbG9nLmxvZyBhcyBhbiBhbGlhcyBmb3IgbG9nLmRlYnVnXG4gICAgICAgIHRoaXMubG9nID0gdGhpcy5kZWJ1ZztcbiAgICB9XG5cbiAgICAvLyBJbiBvbGQgSUUgdmVyc2lvbnMsIHRoZSBjb25zb2xlIGlzbid0IHByZXNlbnQgdW50aWwgeW91IGZpcnN0IG9wZW4gaXQuXG4gICAgLy8gV2UgYnVpbGQgcmVhbE1ldGhvZCgpIHJlcGxhY2VtZW50cyBoZXJlIHRoYXQgcmVnZW5lcmF0ZSBsb2dnaW5nIG1ldGhvZHNcbiAgICBmdW5jdGlvbiBlbmFibGVMb2dnaW5nV2hlbkNvbnNvbGVBcnJpdmVzKG1ldGhvZE5hbWUsIGxldmVsLCBsb2dnZXJOYW1lKSB7XG4gICAgICAgIHJldHVybiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgIT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgICByZXBsYWNlTG9nZ2luZ01ldGhvZHMuY2FsbCh0aGlzLCBsZXZlbCwgbG9nZ2VyTmFtZSk7XG4gICAgICAgICAgICAgICAgdGhpc1ttZXRob2ROYW1lXS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgIH1cblxuICAgIC8vIEJ5IGRlZmF1bHQsIHdlIHVzZSBjbG9zZWx5IGJvdW5kIHJlYWwgbWV0aG9kcyB3aGVyZXZlciBwb3NzaWJsZSwgYW5kXG4gICAgLy8gb3RoZXJ3aXNlIHdlIHdhaXQgZm9yIGEgY29uc29sZSB0byBhcHBlYXIsIGFuZCB0aGVuIHRyeSBhZ2Fpbi5cbiAgICBmdW5jdGlvbiBkZWZhdWx0TWV0aG9kRmFjdG9yeShtZXRob2ROYW1lLCBsZXZlbCwgbG9nZ2VyTmFtZSkge1xuICAgICAgICAvKmpzaGludCB2YWxpZHRoaXM6dHJ1ZSAqL1xuICAgICAgICByZXR1cm4gcmVhbE1ldGhvZChtZXRob2ROYW1lKSB8fFxuICAgICAgICAgICAgICAgZW5hYmxlTG9nZ2luZ1doZW5Db25zb2xlQXJyaXZlcy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cblxuICAgIGZ1bmN0aW9uIExvZ2dlcihuYW1lLCBkZWZhdWx0TGV2ZWwsIGZhY3RvcnkpIHtcbiAgICAgIHZhciBzZWxmID0gdGhpcztcbiAgICAgIHZhciBjdXJyZW50TGV2ZWw7XG4gICAgICB2YXIgc3RvcmFnZUtleSA9IFwibG9nbGV2ZWxcIjtcbiAgICAgIGlmIChuYW1lKSB7XG4gICAgICAgIHN0b3JhZ2VLZXkgKz0gXCI6XCIgKyBuYW1lO1xuICAgICAgfVxuXG4gICAgICBmdW5jdGlvbiBwZXJzaXN0TGV2ZWxJZlBvc3NpYmxlKGxldmVsTnVtKSB7XG4gICAgICAgICAgdmFyIGxldmVsTmFtZSA9IChsb2dNZXRob2RzW2xldmVsTnVtXSB8fCAnc2lsZW50JykudG9VcHBlckNhc2UoKTtcblxuICAgICAgICAgIGlmICh0eXBlb2Ygd2luZG93ID09PSB1bmRlZmluZWRUeXBlKSByZXR1cm47XG5cbiAgICAgICAgICAvLyBVc2UgbG9jYWxTdG9yYWdlIGlmIGF2YWlsYWJsZVxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHdpbmRvdy5sb2NhbFN0b3JhZ2Vbc3RvcmFnZUtleV0gPSBsZXZlbE5hbWU7XG4gICAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBVc2Ugc2Vzc2lvbiBjb29raWUgYXMgZmFsbGJhY2tcbiAgICAgICAgICB0cnkge1xuICAgICAgICAgICAgICB3aW5kb3cuZG9jdW1lbnQuY29va2llID1cbiAgICAgICAgICAgICAgICBlbmNvZGVVUklDb21wb25lbnQoc3RvcmFnZUtleSkgKyBcIj1cIiArIGxldmVsTmFtZSArIFwiO1wiO1xuICAgICAgICAgIH0gY2F0Y2ggKGlnbm9yZSkge31cbiAgICAgIH1cblxuICAgICAgZnVuY3Rpb24gZ2V0UGVyc2lzdGVkTGV2ZWwoKSB7XG4gICAgICAgICAgdmFyIHN0b3JlZExldmVsO1xuXG4gICAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgPT09IHVuZGVmaW5lZFR5cGUpIHJldHVybjtcblxuICAgICAgICAgIHRyeSB7XG4gICAgICAgICAgICAgIHN0b3JlZExldmVsID0gd2luZG93LmxvY2FsU3RvcmFnZVtzdG9yYWdlS2V5XTtcbiAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG5cbiAgICAgICAgICAvLyBGYWxsYmFjayB0byBjb29raWVzIGlmIGxvY2FsIHN0b3JhZ2UgZ2l2ZXMgdXMgbm90aGluZ1xuICAgICAgICAgIGlmICh0eXBlb2Ygc3RvcmVkTGV2ZWwgPT09IHVuZGVmaW5lZFR5cGUpIHtcbiAgICAgICAgICAgICAgdHJ5IHtcbiAgICAgICAgICAgICAgICAgIHZhciBjb29raWUgPSB3aW5kb3cuZG9jdW1lbnQuY29va2llO1xuICAgICAgICAgICAgICAgICAgdmFyIGxvY2F0aW9uID0gY29va2llLmluZGV4T2YoXG4gICAgICAgICAgICAgICAgICAgICAgZW5jb2RlVVJJQ29tcG9uZW50KHN0b3JhZ2VLZXkpICsgXCI9XCIpO1xuICAgICAgICAgICAgICAgICAgaWYgKGxvY2F0aW9uICE9PSAtMSkge1xuICAgICAgICAgICAgICAgICAgICAgIHN0b3JlZExldmVsID0gL14oW147XSspLy5leGVjKGNvb2tpZS5zbGljZShsb2NhdGlvbikpWzFdO1xuICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICB9IGNhdGNoIChpZ25vcmUpIHt9XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gSWYgdGhlIHN0b3JlZCBsZXZlbCBpcyBub3QgdmFsaWQsIHRyZWF0IGl0IGFzIGlmIG5vdGhpbmcgd2FzIHN0b3JlZC5cbiAgICAgICAgICBpZiAoc2VsZi5sZXZlbHNbc3RvcmVkTGV2ZWxdID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAgICAgc3RvcmVkTGV2ZWwgPSB1bmRlZmluZWQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgcmV0dXJuIHN0b3JlZExldmVsO1xuICAgICAgfVxuXG4gICAgICAvKlxuICAgICAgICpcbiAgICAgICAqIFB1YmxpYyBsb2dnZXIgQVBJIC0gc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS9waW10ZXJyeS9sb2dsZXZlbCBmb3IgZGV0YWlsc1xuICAgICAgICpcbiAgICAgICAqL1xuXG4gICAgICBzZWxmLm5hbWUgPSBuYW1lO1xuXG4gICAgICBzZWxmLmxldmVscyA9IHsgXCJUUkFDRVwiOiAwLCBcIkRFQlVHXCI6IDEsIFwiSU5GT1wiOiAyLCBcIldBUk5cIjogMyxcbiAgICAgICAgICBcIkVSUk9SXCI6IDQsIFwiU0lMRU5UXCI6IDV9O1xuXG4gICAgICBzZWxmLm1ldGhvZEZhY3RvcnkgPSBmYWN0b3J5IHx8IGRlZmF1bHRNZXRob2RGYWN0b3J5O1xuXG4gICAgICBzZWxmLmdldExldmVsID0gZnVuY3Rpb24gKCkge1xuICAgICAgICAgIHJldHVybiBjdXJyZW50TGV2ZWw7XG4gICAgICB9O1xuXG4gICAgICBzZWxmLnNldExldmVsID0gZnVuY3Rpb24gKGxldmVsLCBwZXJzaXN0KSB7XG4gICAgICAgICAgaWYgKHR5cGVvZiBsZXZlbCA9PT0gXCJzdHJpbmdcIiAmJiBzZWxmLmxldmVsc1tsZXZlbC50b1VwcGVyQ2FzZSgpXSAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICAgICAgICAgIGxldmVsID0gc2VsZi5sZXZlbHNbbGV2ZWwudG9VcHBlckNhc2UoKV07XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmICh0eXBlb2YgbGV2ZWwgPT09IFwibnVtYmVyXCIgJiYgbGV2ZWwgPj0gMCAmJiBsZXZlbCA8PSBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgY3VycmVudExldmVsID0gbGV2ZWw7XG4gICAgICAgICAgICAgIGlmIChwZXJzaXN0ICE9PSBmYWxzZSkgeyAgLy8gZGVmYXVsdHMgdG8gdHJ1ZVxuICAgICAgICAgICAgICAgICAgcGVyc2lzdExldmVsSWZQb3NzaWJsZShsZXZlbCk7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgcmVwbGFjZUxvZ2dpbmdNZXRob2RzLmNhbGwoc2VsZiwgbGV2ZWwsIG5hbWUpO1xuICAgICAgICAgICAgICBpZiAodHlwZW9mIGNvbnNvbGUgPT09IHVuZGVmaW5lZFR5cGUgJiYgbGV2ZWwgPCBzZWxmLmxldmVscy5TSUxFTlQpIHtcbiAgICAgICAgICAgICAgICAgIHJldHVybiBcIk5vIGNvbnNvbGUgYXZhaWxhYmxlIGZvciBsb2dnaW5nXCI7XG4gICAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICB0aHJvdyBcImxvZy5zZXRMZXZlbCgpIGNhbGxlZCB3aXRoIGludmFsaWQgbGV2ZWw6IFwiICsgbGV2ZWw7XG4gICAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgc2VsZi5zZXREZWZhdWx0TGV2ZWwgPSBmdW5jdGlvbiAobGV2ZWwpIHtcbiAgICAgICAgICBpZiAoIWdldFBlcnNpc3RlZExldmVsKCkpIHtcbiAgICAgICAgICAgICAgc2VsZi5zZXRMZXZlbChsZXZlbCwgZmFsc2UpO1xuICAgICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIHNlbGYuZW5hYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuVFJBQ0UsIHBlcnNpc3QpO1xuICAgICAgfTtcblxuICAgICAgc2VsZi5kaXNhYmxlQWxsID0gZnVuY3Rpb24ocGVyc2lzdCkge1xuICAgICAgICAgIHNlbGYuc2V0TGV2ZWwoc2VsZi5sZXZlbHMuU0lMRU5ULCBwZXJzaXN0KTtcbiAgICAgIH07XG5cbiAgICAgIC8vIEluaXRpYWxpemUgd2l0aCB0aGUgcmlnaHQgbGV2ZWxcbiAgICAgIHZhciBpbml0aWFsTGV2ZWwgPSBnZXRQZXJzaXN0ZWRMZXZlbCgpO1xuICAgICAgaWYgKGluaXRpYWxMZXZlbCA9PSBudWxsKSB7XG4gICAgICAgICAgaW5pdGlhbExldmVsID0gZGVmYXVsdExldmVsID09IG51bGwgPyBcIldBUk5cIiA6IGRlZmF1bHRMZXZlbDtcbiAgICAgIH1cbiAgICAgIHNlbGYuc2V0TGV2ZWwoaW5pdGlhbExldmVsLCBmYWxzZSk7XG4gICAgfVxuXG4gICAgLypcbiAgICAgKlxuICAgICAqIFRvcC1sZXZlbCBBUElcbiAgICAgKlxuICAgICAqL1xuXG4gICAgdmFyIGRlZmF1bHRMb2dnZXIgPSBuZXcgTG9nZ2VyKCk7XG5cbiAgICB2YXIgX2xvZ2dlcnNCeU5hbWUgPSB7fTtcbiAgICBkZWZhdWx0TG9nZ2VyLmdldExvZ2dlciA9IGZ1bmN0aW9uIGdldExvZ2dlcihuYW1lKSB7XG4gICAgICAgIGlmICh0eXBlb2YgbmFtZSAhPT0gXCJzdHJpbmdcIiB8fCBuYW1lID09PSBcIlwiKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIllvdSBtdXN0IHN1cHBseSBhIG5hbWUgd2hlbiBjcmVhdGluZyBhIGxvZ2dlci5cIik7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV07XG4gICAgICAgIGlmICghbG9nZ2VyKSB7XG4gICAgICAgICAgbG9nZ2VyID0gX2xvZ2dlcnNCeU5hbWVbbmFtZV0gPSBuZXcgTG9nZ2VyKFxuICAgICAgICAgICAgbmFtZSwgZGVmYXVsdExvZ2dlci5nZXRMZXZlbCgpLCBkZWZhdWx0TG9nZ2VyLm1ldGhvZEZhY3RvcnkpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBsb2dnZXI7XG4gICAgfTtcblxuICAgIC8vIEdyYWIgdGhlIGN1cnJlbnQgZ2xvYmFsIGxvZyB2YXJpYWJsZSBpbiBjYXNlIG9mIG92ZXJ3cml0ZVxuICAgIHZhciBfbG9nID0gKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUpID8gd2luZG93LmxvZyA6IHVuZGVmaW5lZDtcbiAgICBkZWZhdWx0TG9nZ2VyLm5vQ29uZmxpY3QgPSBmdW5jdGlvbigpIHtcbiAgICAgICAgaWYgKHR5cGVvZiB3aW5kb3cgIT09IHVuZGVmaW5lZFR5cGUgJiZcbiAgICAgICAgICAgICAgIHdpbmRvdy5sb2cgPT09IGRlZmF1bHRMb2dnZXIpIHtcbiAgICAgICAgICAgIHdpbmRvdy5sb2cgPSBfbG9nO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG4gICAgfTtcblxuICAgIGRlZmF1bHRMb2dnZXIuZ2V0TG9nZ2VycyA9IGZ1bmN0aW9uIGdldExvZ2dlcnMoKSB7XG4gICAgICAgIHJldHVybiBfbG9nZ2Vyc0J5TmFtZTtcbiAgICB9O1xuXG4gICAgcmV0dXJuIGRlZmF1bHRMb2dnZXI7XG59KSk7XG4iLCIvKlxuIChjKSAyMDE3LCBWbGFkaW1pciBBZ2Fmb25raW5cbiBTaW1wbGlmeS5qcywgYSBoaWdoLXBlcmZvcm1hbmNlIEpTIHBvbHlsaW5lIHNpbXBsaWZpY2F0aW9uIGxpYnJhcnlcbiBtb3VybmVyLmdpdGh1Yi5pby9zaW1wbGlmeS1qc1xuKi9cblxuKGZ1bmN0aW9uICgpIHsgJ3VzZSBzdHJpY3QnO1xuXG4vLyB0byBzdWl0IHlvdXIgcG9pbnQgZm9ybWF0LCBydW4gc2VhcmNoL3JlcGxhY2UgZm9yICcueCcgYW5kICcueSc7XG4vLyBmb3IgM0QgdmVyc2lvbiwgc2VlIDNkIGJyYW5jaCAoY29uZmlndXJhYmlsaXR5IHdvdWxkIGRyYXcgc2lnbmlmaWNhbnQgcGVyZm9ybWFuY2Ugb3ZlcmhlYWQpXG5cbi8vIHNxdWFyZSBkaXN0YW5jZSBiZXR3ZWVuIDIgcG9pbnRzXG5mdW5jdGlvbiBnZXRTcURpc3QocDEsIHAyKSB7XG5cbiAgICB2YXIgZHggPSBwMS54IC0gcDIueCxcbiAgICAgICAgZHkgPSBwMS55IC0gcDIueTtcblxuICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcbn1cblxuLy8gc3F1YXJlIGRpc3RhbmNlIGZyb20gYSBwb2ludCB0byBhIHNlZ21lbnRcbmZ1bmN0aW9uIGdldFNxU2VnRGlzdChwLCBwMSwgcDIpIHtcblxuICAgIHZhciB4ID0gcDEueCxcbiAgICAgICAgeSA9IHAxLnksXG4gICAgICAgIGR4ID0gcDIueCAtIHgsXG4gICAgICAgIGR5ID0gcDIueSAtIHk7XG5cbiAgICBpZiAoZHggIT09IDAgfHwgZHkgIT09IDApIHtcblxuICAgICAgICB2YXIgdCA9ICgocC54IC0geCkgKiBkeCArIChwLnkgLSB5KSAqIGR5KSAvIChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgICAgICAgaWYgKHQgPiAxKSB7XG4gICAgICAgICAgICB4ID0gcDIueDtcbiAgICAgICAgICAgIHkgPSBwMi55O1xuXG4gICAgICAgIH0gZWxzZSBpZiAodCA+IDApIHtcbiAgICAgICAgICAgIHggKz0gZHggKiB0O1xuICAgICAgICAgICAgeSArPSBkeSAqIHQ7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBkeCA9IHAueCAtIHg7XG4gICAgZHkgPSBwLnkgLSB5O1xuXG4gICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xufVxuLy8gcmVzdCBvZiB0aGUgY29kZSBkb2Vzbid0IGNhcmUgYWJvdXQgcG9pbnQgZm9ybWF0XG5cbi8vIGJhc2ljIGRpc3RhbmNlLWJhc2VkIHNpbXBsaWZpY2F0aW9uXG5mdW5jdGlvbiBzaW1wbGlmeVJhZGlhbERpc3QocG9pbnRzLCBzcVRvbGVyYW5jZSkge1xuXG4gICAgdmFyIHByZXZQb2ludCA9IHBvaW50c1swXSxcbiAgICAgICAgbmV3UG9pbnRzID0gW3ByZXZQb2ludF0sXG4gICAgICAgIHBvaW50O1xuXG4gICAgZm9yICh2YXIgaSA9IDEsIGxlbiA9IHBvaW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBwb2ludCA9IHBvaW50c1tpXTtcblxuICAgICAgICBpZiAoZ2V0U3FEaXN0KHBvaW50LCBwcmV2UG9pbnQpID4gc3FUb2xlcmFuY2UpIHtcbiAgICAgICAgICAgIG5ld1BvaW50cy5wdXNoKHBvaW50KTtcbiAgICAgICAgICAgIHByZXZQb2ludCA9IHBvaW50O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHByZXZQb2ludCAhPT0gcG9pbnQpIG5ld1BvaW50cy5wdXNoKHBvaW50KTtcblxuICAgIHJldHVybiBuZXdQb2ludHM7XG59XG5cbmZ1bmN0aW9uIHNpbXBsaWZ5RFBTdGVwKHBvaW50cywgZmlyc3QsIGxhc3QsIHNxVG9sZXJhbmNlLCBzaW1wbGlmaWVkKSB7XG4gICAgdmFyIG1heFNxRGlzdCA9IHNxVG9sZXJhbmNlLFxuICAgICAgICBpbmRleDtcblxuICAgIGZvciAodmFyIGkgPSBmaXJzdCArIDE7IGkgPCBsYXN0OyBpKyspIHtcbiAgICAgICAgdmFyIHNxRGlzdCA9IGdldFNxU2VnRGlzdChwb2ludHNbaV0sIHBvaW50c1tmaXJzdF0sIHBvaW50c1tsYXN0XSk7XG5cbiAgICAgICAgaWYgKHNxRGlzdCA+IG1heFNxRGlzdCkge1xuICAgICAgICAgICAgaW5kZXggPSBpO1xuICAgICAgICAgICAgbWF4U3FEaXN0ID0gc3FEaXN0O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYgKG1heFNxRGlzdCA+IHNxVG9sZXJhbmNlKSB7XG4gICAgICAgIGlmIChpbmRleCAtIGZpcnN0ID4gMSkgc2ltcGxpZnlEUFN0ZXAocG9pbnRzLCBmaXJzdCwgaW5kZXgsIHNxVG9sZXJhbmNlLCBzaW1wbGlmaWVkKTtcbiAgICAgICAgc2ltcGxpZmllZC5wdXNoKHBvaW50c1tpbmRleF0pO1xuICAgICAgICBpZiAobGFzdCAtIGluZGV4ID4gMSkgc2ltcGxpZnlEUFN0ZXAocG9pbnRzLCBpbmRleCwgbGFzdCwgc3FUb2xlcmFuY2UsIHNpbXBsaWZpZWQpO1xuICAgIH1cbn1cblxuLy8gc2ltcGxpZmljYXRpb24gdXNpbmcgUmFtZXItRG91Z2xhcy1QZXVja2VyIGFsZ29yaXRobVxuZnVuY3Rpb24gc2ltcGxpZnlEb3VnbGFzUGV1Y2tlcihwb2ludHMsIHNxVG9sZXJhbmNlKSB7XG4gICAgdmFyIGxhc3QgPSBwb2ludHMubGVuZ3RoIC0gMTtcblxuICAgIHZhciBzaW1wbGlmaWVkID0gW3BvaW50c1swXV07XG4gICAgc2ltcGxpZnlEUFN0ZXAocG9pbnRzLCAwLCBsYXN0LCBzcVRvbGVyYW5jZSwgc2ltcGxpZmllZCk7XG4gICAgc2ltcGxpZmllZC5wdXNoKHBvaW50c1tsYXN0XSk7XG5cbiAgICByZXR1cm4gc2ltcGxpZmllZDtcbn1cblxuLy8gYm90aCBhbGdvcml0aG1zIGNvbWJpbmVkIGZvciBhd2Vzb21lIHBlcmZvcm1hbmNlXG5mdW5jdGlvbiBzaW1wbGlmeShwb2ludHMsIHRvbGVyYW5jZSwgaGlnaGVzdFF1YWxpdHkpIHtcblxuICAgIGlmIChwb2ludHMubGVuZ3RoIDw9IDIpIHJldHVybiBwb2ludHM7XG5cbiAgICB2YXIgc3FUb2xlcmFuY2UgPSB0b2xlcmFuY2UgIT09IHVuZGVmaW5lZCA/IHRvbGVyYW5jZSAqIHRvbGVyYW5jZSA6IDE7XG5cbiAgICBwb2ludHMgPSBoaWdoZXN0UXVhbGl0eSA/IHBvaW50cyA6IHNpbXBsaWZ5UmFkaWFsRGlzdChwb2ludHMsIHNxVG9sZXJhbmNlKTtcbiAgICBwb2ludHMgPSBzaW1wbGlmeURvdWdsYXNQZXVja2VyKHBvaW50cywgc3FUb2xlcmFuY2UpO1xuXG4gICAgcmV0dXJuIHBvaW50cztcbn1cblxuLy8gZXhwb3J0IGFzIEFNRCBtb2R1bGUgLyBOb2RlIG1vZHVsZSAvIGJyb3dzZXIgb3Igd29ya2VyIHZhcmlhYmxlXG5pZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSBkZWZpbmUoZnVuY3Rpb24oKSB7IHJldHVybiBzaW1wbGlmeTsgfSk7XG5lbHNlIGlmICh0eXBlb2YgbW9kdWxlICE9PSAndW5kZWZpbmVkJykge1xuICAgIG1vZHVsZS5leHBvcnRzID0gc2ltcGxpZnk7XG4gICAgbW9kdWxlLmV4cG9ydHMuZGVmYXVsdCA9IHNpbXBsaWZ5O1xufSBlbHNlIGlmICh0eXBlb2Ygc2VsZiAhPT0gJ3VuZGVmaW5lZCcpIHNlbGYuc2ltcGxpZnkgPSBzaW1wbGlmeTtcbmVsc2Ugd2luZG93LnNpbXBsaWZ5ID0gc2ltcGxpZnk7XG5cbn0pKCk7XG4iLCJ2YXIgYnVuZGxlRm4gPSBhcmd1bWVudHNbM107XG52YXIgc291cmNlcyA9IGFyZ3VtZW50c1s0XTtcbnZhciBjYWNoZSA9IGFyZ3VtZW50c1s1XTtcblxudmFyIHN0cmluZ2lmeSA9IEpTT04uc3RyaW5naWZ5O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChmbiwgb3B0aW9ucykge1xuICAgIHZhciB3a2V5O1xuICAgIHZhciBjYWNoZUtleXMgPSBPYmplY3Qua2V5cyhjYWNoZSk7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbCA9IGNhY2hlS2V5cy5sZW5ndGg7IGkgPCBsOyBpKyspIHtcbiAgICAgICAgdmFyIGtleSA9IGNhY2hlS2V5c1tpXTtcbiAgICAgICAgdmFyIGV4cCA9IGNhY2hlW2tleV0uZXhwb3J0cztcbiAgICAgICAgLy8gVXNpbmcgYmFiZWwgYXMgYSB0cmFuc3BpbGVyIHRvIHVzZSBlc21vZHVsZSwgdGhlIGV4cG9ydCB3aWxsIGFsd2F5c1xuICAgICAgICAvLyBiZSBhbiBvYmplY3Qgd2l0aCB0aGUgZGVmYXVsdCBleHBvcnQgYXMgYSBwcm9wZXJ0eSBvZiBpdC4gVG8gZW5zdXJlXG4gICAgICAgIC8vIHRoZSBleGlzdGluZyBhcGkgYW5kIGJhYmVsIGVzbW9kdWxlIGV4cG9ydHMgYXJlIGJvdGggc3VwcG9ydGVkIHdlXG4gICAgICAgIC8vIGNoZWNrIGZvciBib3RoXG4gICAgICAgIGlmIChleHAgPT09IGZuIHx8IGV4cCAmJiBleHAuZGVmYXVsdCA9PT0gZm4pIHtcbiAgICAgICAgICAgIHdrZXkgPSBrZXk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmICghd2tleSkge1xuICAgICAgICB3a2V5ID0gTWF0aC5mbG9vcihNYXRoLnBvdygxNiwgOCkgKiBNYXRoLnJhbmRvbSgpKS50b1N0cmluZygxNik7XG4gICAgICAgIHZhciB3Y2FjaGUgPSB7fTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGwgPSBjYWNoZUtleXMubGVuZ3RoOyBpIDwgbDsgaSsrKSB7XG4gICAgICAgICAgICB2YXIga2V5ID0gY2FjaGVLZXlzW2ldO1xuICAgICAgICAgICAgd2NhY2hlW2tleV0gPSBrZXk7XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlc1t3a2V5XSA9IFtcbiAgICAgICAgICAgICdmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsnICsgZm4gKyAnKHNlbGYpOyB9JyxcbiAgICAgICAgICAgIHdjYWNoZVxuICAgICAgICBdO1xuICAgIH1cbiAgICB2YXIgc2tleSA9IE1hdGguZmxvb3IoTWF0aC5wb3coMTYsIDgpICogTWF0aC5yYW5kb20oKSkudG9TdHJpbmcoMTYpO1xuXG4gICAgdmFyIHNjYWNoZSA9IHt9OyBzY2FjaGVbd2tleV0gPSB3a2V5O1xuICAgIHNvdXJjZXNbc2tleV0gPSBbXG4gICAgICAgICdmdW5jdGlvbihyZXF1aXJlLG1vZHVsZSxleHBvcnRzKXsnICtcbiAgICAgICAgICAgIC8vIHRyeSB0byBjYWxsIGRlZmF1bHQgaWYgZGVmaW5lZCB0byBhbHNvIHN1cHBvcnQgYmFiZWwgZXNtb2R1bGUgZXhwb3J0c1xuICAgICAgICAgICAgJ3ZhciBmID0gcmVxdWlyZSgnICsgc3RyaW5naWZ5KHdrZXkpICsgJyk7JyArXG4gICAgICAgICAgICAnKGYuZGVmYXVsdCA/IGYuZGVmYXVsdCA6IGYpKHNlbGYpOycgK1xuICAgICAgICAnfScsXG4gICAgICAgIHNjYWNoZVxuICAgIF07XG5cbiAgICB2YXIgd29ya2VyU291cmNlcyA9IHt9O1xuICAgIHJlc29sdmVTb3VyY2VzKHNrZXkpO1xuXG4gICAgZnVuY3Rpb24gcmVzb2x2ZVNvdXJjZXMoa2V5KSB7XG4gICAgICAgIHdvcmtlclNvdXJjZXNba2V5XSA9IHRydWU7XG5cbiAgICAgICAgZm9yICh2YXIgZGVwUGF0aCBpbiBzb3VyY2VzW2tleV1bMV0pIHtcbiAgICAgICAgICAgIHZhciBkZXBLZXkgPSBzb3VyY2VzW2tleV1bMV1bZGVwUGF0aF07XG4gICAgICAgICAgICBpZiAoIXdvcmtlclNvdXJjZXNbZGVwS2V5XSkge1xuICAgICAgICAgICAgICAgIHJlc29sdmVTb3VyY2VzKGRlcEtleSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgc3JjID0gJygnICsgYnVuZGxlRm4gKyAnKSh7J1xuICAgICAgICArIE9iamVjdC5rZXlzKHdvcmtlclNvdXJjZXMpLm1hcChmdW5jdGlvbiAoa2V5KSB7XG4gICAgICAgICAgICByZXR1cm4gc3RyaW5naWZ5KGtleSkgKyAnOlsnXG4gICAgICAgICAgICAgICAgKyBzb3VyY2VzW2tleV1bMF1cbiAgICAgICAgICAgICAgICArICcsJyArIHN0cmluZ2lmeShzb3VyY2VzW2tleV1bMV0pICsgJ10nXG4gICAgICAgICAgICA7XG4gICAgICAgIH0pLmpvaW4oJywnKVxuICAgICAgICArICd9LHt9LFsnICsgc3RyaW5naWZ5KHNrZXkpICsgJ10pJ1xuICAgIDtcblxuICAgIHZhciBVUkwgPSB3aW5kb3cuVVJMIHx8IHdpbmRvdy53ZWJraXRVUkwgfHwgd2luZG93Lm1velVSTCB8fCB3aW5kb3cubXNVUkw7XG5cbiAgICB2YXIgYmxvYiA9IG5ldyBCbG9iKFtzcmNdLCB7IHR5cGU6ICd0ZXh0L2phdmFzY3JpcHQnIH0pO1xuICAgIGlmIChvcHRpb25zICYmIG9wdGlvbnMuYmFyZSkgeyByZXR1cm4gYmxvYjsgfVxuICAgIHZhciB3b3JrZXJVcmwgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuICAgIHZhciB3b3JrZXIgPSBuZXcgV29ya2VyKHdvcmtlclVybCk7XG4gICAgd29ya2VyLm9iamVjdFVSTCA9IHdvcmtlclVybDtcbiAgICByZXR1cm4gd29ya2VyO1xufTtcbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgKiBhcyBkYXQgZnJvbSAnZGF0Lmd1aSc7XG5pbXBvcnQgKiBhcyB3b3JrIGZyb20gJ3dlYndvcmtpZnknO1xuXG5pbXBvcnQgVGVuc29yRmllbGRJbnRlcmZhY2UgZnJvbSAnLi90cy9pbnRlcmZhY2UvdGVuc29yX2ZpZWxkX2ludGVyZmFjZSc7XG5pbXBvcnQge0dyaWQsIFJhZGlhbH0gZnJvbSAnLi90cy9pbXBsL2Jhc2lzX2ZpZWxkJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi90cy92ZWN0b3InO1xuaW1wb3J0IENhbnZhc1dyYXBwZXIgZnJvbSAnLi90cy9pbnRlcmZhY2UvY2FudmFzX3dyYXBwZXInO1xuaW1wb3J0IFV0aWwgZnJvbSAnLi90cy91dGlsJztcbmltcG9ydCBEcmFnQ29udHJvbGxlciBmcm9tICcuL3RzL2ludGVyZmFjZS9kcmFnX2NvbnRyb2xsZXInO1xuaW1wb3J0IERvbWFpbkNvbnRyb2xsZXIgZnJvbSAnLi90cy9pbnRlcmZhY2UvZG9tYWluX2NvbnRyb2xsZXInO1xuaW1wb3J0IHtFdWxlckludGVncmF0b3IsIFJLNEludGVncmF0b3J9IGZyb20gJy4vdHMvaW1wbC9pbnRlZ3JhdG9yJztcbmltcG9ydCB7U3RyZWFtbGluZVBhcmFtc30gZnJvbSAnLi90cy9pbXBsL3N0cmVhbWxpbmVzJztcbmltcG9ydCBTdHJlYW1saW5lR2VuZXJhdG9yIGZyb20gJy4vdHMvaW1wbC9zdHJlYW1saW5lcyc7XG5pbXBvcnQge1ZlY3RvclBhcmFtcywgU3RyZWFtbGluZVdvcmtlclBhcmFtc30gZnJvbSAnLi90cy9pbXBsL3dvcmtlci93b3JrZXJfcGFyYW1zJztcbmltcG9ydCB7TWVzc2FnZVR5cGV9IGZyb20gJy4vdHMvaW1wbC93b3JrZXIvd29ya2VyX3BhcmFtcyc7XG5cbmNvbnN0IHNpemUgPSA4MDA7XG5jb25zdCBkYyA9IERvbWFpbkNvbnRyb2xsZXIuZ2V0SW5zdGFuY2UoVmVjdG9yLmZyb21TY2FsYXIoc2l6ZSkpO1xuY29uc3QgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFV0aWwuQ0FOVkFTX0lEKSBhcyBIVE1MQ2FudmFzRWxlbWVudDtcbmNvbnN0IGNhbnZhcyA9IG5ldyBDYW52YXNXcmFwcGVyKGMsIHNpemUsIHNpemUpO1xuY29uc3QgZ3VpOiBkYXQuR1VJID0gbmV3IGRhdC5HVUkoKTtcbmNvbnN0IHRlbnNvckZvbGRlciA9IGd1aS5hZGRGb2xkZXIoJ1RlbnNvciBGaWVsZCcpO1xuXG5jb25zdCBmaWVsZCA9IG5ldyBUZW5zb3JGaWVsZEludGVyZmFjZSh0ZW5zb3JGb2xkZXIsIG5ldyBEcmFnQ29udHJvbGxlcihndWkpKTtcbmZpZWxkLmFkZEdyaWQobmV3IFZlY3RvcigwLCAwKSwgc2l6ZSwgMjAsIE1hdGguUEkgLyA0KTtcbmZpZWxkLmFkZEdyaWQobmV3IFZlY3RvcihzaXplLCBzaXplKSwgc2l6ZSwgMjAsIDApO1xuZmllbGQuYWRkUmFkaWFsKG5ldyBWZWN0b3Ioc2l6ZS8yLCBzaXplLzIpLCAzMDAsIDIwKTtcblxuY29uc3QgcGFyYW1zOiBTdHJlYW1saW5lUGFyYW1zID0ge1xuICAgIGRzZXA6IDMwLFxuICAgIGR0ZXN0OiAxNSxcbiAgICBkc3RlcDogMSxcbiAgICBkbG9va2FoZWFkOiA1LFxuICAgIHBhdGhJdGVyYXRpb25zOiAxMDAwLFxuICAgIHNlZWRUcmllczogMzAwLFxuICAgIHNpbXBsaWZ5VG9sZXJhbmNlOiAwLjUsXG59O1xuXG5ndWkuYWRkKHBhcmFtcywgJ2RzdGVwJyk7XG5ndWkuYWRkKHBhcmFtcywgJ2RzZXAnKTtcbmd1aS5hZGQocGFyYW1zLCAnZHRlc3QnKTtcbmd1aS5hZGQocGFyYW1zLCAnZGxvb2thaGVhZCcpO1xuZ3VpLmFkZChwYXJhbXMsICdwYXRoSXRlcmF0aW9ucycpO1xuZ3VpLmFkZChwYXJhbXMsICdzaW1wbGlmeVRvbGVyYW5jZScpO1xuZ3VpLmFkZChkYywgJ3pvb20nLCAwLCA1KTtcblxuLy8gY29uc3QgaW50ZWdyYXRvciA9IG5ldyBSSzRJbnRlZ3JhdG9yKGZpZWxkLCBwYXJhbXMpO1xuLy8gbGV0IHMgPSBuZXcgU3RyZWFtbGluZUdlbmVyYXRvcihpbnRlZ3JhdG9yLCBkYy5vcmlnaW4sIGRjLndvcmxkRGltZW5zaW9ucywgcGFyYW1zKTtcblxuLy8gZnVuY3Rpb24gc2V0U3RyZWFtbGluZSgpIHtcbi8vICAgICBzID0gbmV3IFN0cmVhbWxpbmVHZW5lcmF0b3IoaW50ZWdyYXRvciwgZGMub3JpZ2luLCBkYy53b3JsZERpbWVuc2lvbnMsIHBhcmFtcyk7XG4vLyAgICAgcy5jcmVhdGVBbGxTdHJlYW1saW5lcygpO1xuLy8gfVxuXG4vLyBmdW5jdGlvbiBnZXRTdHJlYW1saW5lcygpOiBWZWN0b3JbXVtdIHtcbi8vICAgICByZXR1cm4gcy5hbGxTdHJlYW1saW5lc1NpbXBsZTtcbi8vIH1cblxubGV0IHN0cmVhbWxpbmVzOiBWZWN0b3JbXVtdID0gW107XG5mdW5jdGlvbiBnZXRTdHJlYW1saW5lcygpOiBWZWN0b3JbXVtdIHtcbiAgICByZXR1cm4gc3RyZWFtbGluZXM7XG59XG5cbmNvbnN0IHN0cmVhbWxpbmVXb3JrZXIgPSB3b3JrKHJlcXVpcmUoJy4vdHMvaW1wbC93b3JrZXIvc3RyZWFtbGluZV93b3JrZXIudHMnKSk7XG5zdHJlYW1saW5lV29ya2VyLmFkZEV2ZW50TGlzdGVuZXIoJ21lc3NhZ2UnLCAoZXY6IGFueSkgPT4ge1xuICAgIGNvbnN0IHN0cmVhbWxpbmVQYXJhbXMgPSBldi5kYXRhIGFzIFZlY3RvclBhcmFtc1tdW107XG4gICAgc3RyZWFtbGluZXMgPSBzdHJlYW1saW5lUGFyYW1zLm1hcChzdHJlYW1saW5lID0+IHN0cmVhbWxpbmUubWFwKHAgPT4gbmV3IFZlY3RvcihwLngsIHAueSkpKTtcbn0pO1xuXG5mdW5jdGlvbiBzZXRTdHJlYW1saW5lKCkge1xuICAgIGNvbnN0IGRhdGE6IFN0cmVhbWxpbmVXb3JrZXJQYXJhbXMgPSB7XG4gICAgICAgIGZpZWxkUGFyYW1zOiBmaWVsZC5nZXRXb3JrZXJQYXJhbXMoKSxcbiAgICAgICAgc3RyZWFtbGluZXNQYXJhbXM6IHtcbiAgICAgICAgICAgIG9yaWdpbjogZGMub3JpZ2luLmdldFdvcmtlclBhcmFtcygpLFxuICAgICAgICAgICAgd29ybGREaW1lbnNpb25zOiBkYy53b3JsZERpbWVuc2lvbnMuZ2V0V29ya2VyUGFyYW1zKCksXG4gICAgICAgICAgICBwYXJhbXM6IHBhcmFtcyxcbiAgICAgICAgfSxcbiAgICB9XG4gICAgc3RyZWFtbGluZVdvcmtlci5wb3N0TWVzc2FnZShbTWVzc2FnZVR5cGUuQ3JlYXRlTWFqb3JSb2FkcywgZGF0YV0pO1xufVxuXG5jb25zdCB0bXBPYmogPSB7XG4gICAgc2V0U3RyZWFtbGluZTogc2V0U3RyZWFtbGluZVxufTtcblxuZ3VpLmFkZCh0bXBPYmosICdzZXRTdHJlYW1saW5lJyk7XG5cbmZ1bmN0aW9uIGdldFRlbnNvckxpbmUocG9pbnQ6IFZlY3RvciwgdjogVmVjdG9yLCBsZW5ndGg6IG51bWJlcik6IFZlY3RvcltdIHtcbiAgICBjb25zdCB0cmFuc2Zvcm1lZCA9IGRjLndvcmxkVG9TY3JlZW4ocG9pbnQuY2xvbmUoKSk7XG4gICAgY29uc3QgZGlmZiA9IHYubXVsdGlwbHlTY2FsYXIobGVuZ3RoIC8gMik7XG4gICAgY29uc3Qgc3RhcnQgPSB0cmFuc2Zvcm1lZC5jbG9uZSgpLnN1YihkaWZmKTtcbiAgICBjb25zdCBlbmQgPSB0cmFuc2Zvcm1lZC5jbG9uZSgpLmFkZChkaWZmKTtcbiAgICByZXR1cm4gW3N0YXJ0LCBlbmRdO1xufVxuXG5mdW5jdGlvbiBkcmF3KCk6IHZvaWQge1xuICAgIGNvbnN0IHN0YXJ0VGltZSA9IHBlcmZvcm1hbmNlLm5vdygpO1xuXG4gICAgY29uc3Qgc2FtcGxlcyA9IDYwO1xuICAgIGNvbnN0IGxlbmd0aCA9IDEyO1xuICAgIGNhbnZhcy5zZXRTdHJva2VTdHlsZSgnd2hpdGUnKTtcbiAgICBjYW52YXMuc2V0RmlsbFN0eWxlKCdibGFjaycpO1xuICAgIGNhbnZhcy5zZXRMaW5lV2lkdGgoMSk7XG4gICAgY2FudmFzLmNsZWFyQ2FudmFzKCk7XG5cbiAgICBjb25zdCBzdGVwID0gc2l6ZS9zYW1wbGVzO1xuICAgIGNvbnN0IHhTdGFydCA9IHN0ZXAgLSAoZGMub3JpZ2luLnggJSBzdGVwKTtcbiAgICBjb25zdCB5U3RhcnQgPSBzdGVwIC0gKGRjLm9yaWdpbi55ICUgc3RlcCk7XG5cbiAgICBmb3IgKGxldCB4ID0geFN0YXJ0IC0gc3RlcDsgeCA8PSBzaXplICsgc3RlcDsgeCArPSBzaXplL3NhbXBsZXMpIHtcbiAgICAgICAgZm9yIChsZXQgeSA9IHlTdGFydCAtIHN0ZXA7IHkgPD0gc2l6ZSArIHN0ZXA7IHkgKz0gc2l6ZS9zYW1wbGVzKSB7XG4gICAgICAgICAgICBjb25zdCBwb2ludCA9IGRjLnNjcmVlblRvV29ybGQobmV3IFZlY3Rvcih4LCB5KSk7XG4gICAgICAgICAgICBjb25zdCB0ID0gZmllbGQuc2FtcGxlUG9pbnQocG9pbnQpO1xuICAgICAgICAgICAgY2FudmFzLmRyYXdQb2x5bGluZShnZXRUZW5zb3JMaW5lKHBvaW50LCB0LmdldE1ham9yKCksIGxlbmd0aCkpO1xuICAgICAgICAgICAgY2FudmFzLmRyYXdQb2x5bGluZShnZXRUZW5zb3JMaW5lKHBvaW50LCB0LmdldE1pbm9yKCksIGxlbmd0aCkpO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgY2FudmFzLnNldEZpbGxTdHlsZSgncmVkJyk7XG4gICAgZmllbGQuZ2V0Q2VudHJlUG9pbnRzKCkuZm9yRWFjaCh2ID0+IGNhbnZhcy5kcmF3U3F1YXJlKGRjLndvcmxkVG9TY3JlZW4odiksIDcpKTtcblxuICAgIGlmIChnZXRTdHJlYW1saW5lcygpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgY2FudmFzLnNldEZpbGxTdHlsZSgnI0VDRTVEQicpO1xuICAgICAgICBjYW52YXMuY2xlYXJDYW52YXMoKTtcblxuICAgICAgICBjYW52YXMuc2V0U3Ryb2tlU3R5bGUoJyMwMjAyMDInKTtcbiAgICAgICAgY2FudmFzLnNldExpbmVXaWR0aCgzKTtcbiAgICAgICAgZ2V0U3RyZWFtbGluZXMoKS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICAgICAgY2FudmFzLmRyYXdQb2x5bGluZShzLm1hcCh2ID0+IGRjLndvcmxkVG9TY3JlZW4odi5jbG9uZSgpKSkpO1xuICAgICAgICB9KTtcblxuICAgICAgICBjYW52YXMuc2V0U3Ryb2tlU3R5bGUoJyNGOEY4RjgnKTtcbiAgICAgICAgY2FudmFzLnNldExpbmVXaWR0aCgyKTtcbiAgICAgICAgZ2V0U3RyZWFtbGluZXMoKS5mb3JFYWNoKHMgPT4ge1xuICAgICAgICAgICAgY2FudmFzLmRyYXdQb2x5bGluZShzLm1hcCh2ID0+IGRjLndvcmxkVG9TY3JlZW4odi5jbG9uZSgpKSkpO1xuICAgICAgICB9KTtcbiAgICB9XG5cbiAgICBzdHJlYW1saW5lV29ya2VyLnBvc3RNZXNzYWdlKFtNZXNzYWdlVHlwZS5HZXRNYWpvclJvYWRzXSk7XG5cbiAgICAvLyBVcGRhdGVzIGF0IDYwZnBzXG4gICAgLy8gd2hpbGUgKHBlcmZvcm1hbmNlLm5vdygpIC0gc3RhcnRUaW1lIDwgNTAwMC82MCkge1xuICAgIC8vICAgICBzLnVwZGF0ZSgpO1xuICAgIC8vIH1cblxuICAgIHJlcXVlc3RBbmltYXRpb25GcmFtZShkcmF3KTtcbn1cblxucmVxdWVzdEFuaW1hdGlvbkZyYW1lKGRyYXcpO1xuXG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBWZWN0b3Ige1xuICAgIGNvbnN0cnVjdG9yKHB1YmxpYyB4OiBudW1iZXIsIHB1YmxpYyB5OiBudW1iZXIpIHt9XG5cbiAgICBzdGF0aWMgemVyb1ZlY3RvcigpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcigwLCAwKTtcbiAgICB9XG5cbiAgICBzdGF0aWMgZnJvbVNjYWxhcihzOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gbmV3IFZlY3RvcihzLCBzKTtcbiAgICB9XG5cbiAgICBhZGQodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ICs9IHYueDtcbiAgICAgICAgdGhpcy55ICs9IHYueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQW5nbGUgaW4gcmFkaWFucyB0byBwb3NpdGl2ZSB4LWF4aXMgYmV0d2VlbiAtcGkgYW5kIHBpXG4gICAgICovXG4gICAgYW5nbGUoKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy55LCB0aGlzLngpO1xuICAgIH1cblxuICAgIGNsb25lKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHRoaXMueCwgdGhpcy55KTtcbiAgICB9XG5cbiAgICBjb3B5KHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCA9IHYueDtcbiAgICAgICAgdGhpcy55ID0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBjcm9zcyh2OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdi55IC0gdGhpcy55ICogdi54O1xuICAgIH1cblxuICAgIGRpc3RhbmNlVG8odjogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIE1hdGguc3FydCh0aGlzLmRpc3RhbmNlVG9TcXVhcmVkKHYpKTtcbiAgICB9XG5cbiAgICBkaXN0YW5jZVRvU3F1YXJlZCAodjogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgY29uc3QgZHggPSB0aGlzLnggLSB2LnhcbiAgICAgICAgY29uc3QgZHkgPSB0aGlzLnkgLSB2Lnk7XG4gICAgICAgIHJldHVybiBkeCAqIGR4ICsgZHkgKiBkeTtcbiAgICB9XG5cbiAgICBkaXZpZGUodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgaWYgKHYueCA9PT0gMCB8fCB2LnkgPT09IDApIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFwiRGl2aXNpb24gYnkgemVyb1wiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy54IC89IHYueDtcbiAgICAgICAgdGhpcy55IC89IHYueTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZGl2aWRlU2NhbGFyKHM6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIGlmIChzID09PSAwKSB7XG4gICAgICAgICAgICBsb2cud2FybihcIkRpdmlzaW9uIGJ5IHplcm9cIik7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcy5tdWx0aXBseVNjYWxhcigxIC8gcyk7XG4gICAgfVxuXG4gICAgZG90KHY6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnggKyB0aGlzLnkgKiB2Lnk7XG4gICAgfVxuXG4gICAgZXF1YWxzKHY6IFZlY3Rvcik6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gKCh2LnggPT09IHRoaXMueCkgJiYgKHYueSA9PT0gdGhpcy55KSk7XG4gICAgfVxuXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW5ndGhTcSgpKTtcbiAgICB9XG5cbiAgICBsZW5ndGhTcSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xuICAgIH1cblxuICAgIG11bGl0cGx5KHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCAqPSB2Lng7XG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG11bHRpcGx5U2NhbGFyKHM6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCAqPSBzO1xuICAgICAgICB0aGlzLnkgKj0gcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbmVnYXRlKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKC0xKTtcbiAgICB9XG5cbiAgICBub3JtYWxpemUoKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgbCA9IHRoaXMubGVuZ3RoKCk7XG4gICAgICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgICAgICBsb2cud2FybihcIlplcm8gVmVjdG9yXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZVNjYWxhcih0aGlzLmxlbmd0aCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmdsZSBpbiByYWRpYW5zXG4gICAgICovXG4gICAgcm90YXRlQXJvdW5kKGNlbnRlcjogVmVjdG9yLCBhbmdsZTogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5nbGUpXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICBjb25zdCB4ID0gdGhpcy54IC0gY2VudGVyLng7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnkgLSBjZW50ZXIueTtcblxuICAgICAgICB0aGlzLnggPSB4ICogY29zIC0geSAqIHNpbiArIGNlbnRlci54O1xuICAgICAgICB0aGlzLnkgPSB4ICogc2luICsgeSAqIGNvcyArIGNlbnRlci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXQodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldExlbmd0aCAobGVuZ3RoOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcihsZW5ndGgpO1xuICAgIH1cblxuICAgIHN1Yih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggLT0gdi54O1xuICAgICAgICB0aGlzLnkgLT0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCJpbXBvcnQgVGVuc29yIGZyb20gJy4vdGVuc29yJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi4vdmVjdG9yJztcbmltcG9ydCB7V29ya2VyT2JqZWN0LCBCYXNpc0ZpZWxkUGFyYW1zLCBHcmlkUGFyYW1zfSBmcm9tICcuL3dvcmtlci93b3JrZXJfcGFyYW1zJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIEJhc2lzRmllbGQgaW1wbGVtZW50cyBXb3JrZXJPYmplY3Qge1xuICAgIGFic3RyYWN0IHJlYWRvbmx5IEZPTERFUl9OQU1FOiBzdHJpbmc7XG4gICAgcHJvdGVjdGVkIHN0YXRpYyBmb2xkZXJOYW1lSW5kZXg6IG51bWJlciA9IDA7XG4gICAgcHJvdGVjdGVkIF9jZW50cmU6IFZlY3RvcjtcblxuICAgIGNvbnN0cnVjdG9yKGNlbnRyZTogVmVjdG9yLCBwcm90ZWN0ZWQgX3NpemU6IG51bWJlciwgcHJvdGVjdGVkIF9kZWNheTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX2NlbnRyZSA9IGNlbnRyZS5jbG9uZSgpO1xuICAgIH1cblxuICAgIHNldCBjZW50cmUoY2VudHJlOiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5fY2VudHJlLmNvcHkoY2VudHJlKTtcbiAgICB9XG5cbiAgICBnZXQgY2VudHJlKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9jZW50cmUuY2xvbmUoKTtcbiAgICB9XG5cbiAgICBzZXQgZGVjYXkoZGVjYXk6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9kZWNheSA9IGRlY2F5O1xuICAgIH1cblxuICAgIHNldCBzaXplKHNpemU6IG51bWJlcikge1xuICAgICAgICB0aGlzLl9zaXplID0gc2l6ZTtcbiAgICB9XG5cbiAgICBkcmFnTW92ZUxpc3RlbmVyKGRlbHRhOiBWZWN0b3IpOiB2b2lkIHtcbiAgICAgICAgLy8gRGVsdGEgYXNzdW1lZCB0byBiZSBpbiB3b3JsZCBzcGFjZSAob25seSByZWxldmFudCB3aGVuIHpvb21lZClcbiAgICAgICAgdGhpcy5fY2VudHJlLmFkZChkZWx0YSk7XG4gICAgfVxuXG4gICAgYWJzdHJhY3QgZ2V0VGVuc29yKHBvaW50OiBWZWN0b3IpOiBUZW5zb3I7XG5cbiAgICBnZXRXb3JrZXJQYXJhbXMoKTogQmFzaXNGaWVsZFBhcmFtcyB7XG4gICAgICAgIGNvbnN0IHA6IEJhc2lzRmllbGRQYXJhbXMgPSB7XG4gICAgICAgICAgICBjZW50cmU6IHRoaXMuY2VudHJlLFxuICAgICAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZSxcbiAgICAgICAgICAgIGRlY2F5OiB0aGlzLl9kZWNheSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG5cbiAgICBnZXRXZWlnaHRlZFRlbnNvcihwb2ludDogVmVjdG9yKTogVGVuc29yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0VGVuc29yKHBvaW50KS5zY2FsZSh0aGlzLmdldFRlbnNvcldlaWdodChwb2ludCkpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIENyZWF0ZXMgYSBmb2xkZXIgYW5kIGFkZHMgaXQgdG8gdGhlIEdVSSB0byBjb250cm9sIHBhcmFtc1xuICAgICAqL1xuICAgIHNldEd1aShndWk6IGRhdC5HVUkpOiB2b2lkIHtcbiAgICAgICAgZ3VpLmFkZCh0aGlzLl9jZW50cmUsICd4Jyk7XG4gICAgICAgIGd1aS5hZGQodGhpcy5fY2VudHJlLCAneScpO1xuICAgICAgICBndWkuYWRkKHRoaXMsICdfc2l6ZScpO1xuICAgICAgICBndWkuYWRkKHRoaXMsICdfZGVjYXknLCAwLCA1MCk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogSW50ZXJwb2xhdGVzIGJldHdlZW4gKDAgYW5kIDEpXmRlY2F5XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFRlbnNvcldlaWdodChwb2ludDogVmVjdG9yKTogbnVtYmVyIHsgICAgICAgIFxuICAgICAgICBjb25zdCBub3JtRGlzdGFuY2VUb0NlbnRyZSA9IHBvaW50LmNsb25lKCkuc3ViKHRoaXMuX2NlbnRyZSkubGVuZ3RoKCkgLyB0aGlzLl9zaXplO1xuICAgICAgICBcbiAgICAgICAgLy8gU3RvcCAoKiogMCkgdHVybmluZyB3ZWlnaHQgaW50byAxLCBmaWxsaW5nIHNjcmVlbiBldmVuIHdoZW4gb3V0c2lkZSAnc2l6ZSdcbiAgICAgICAgaWYgKHRoaXMuX2RlY2F5ID09PSAwICYmIG5vcm1EaXN0YW5jZVRvQ2VudHJlID49IDEpIHtcbiAgICAgICAgICAgIHJldHVybiAwO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBNYXRoLm1heCgwLCAoMSAtIG5vcm1EaXN0YW5jZVRvQ2VudHJlKSkgKiogdGhpcy5fZGVjYXk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgR3JpZCBleHRlbmRzIEJhc2lzRmllbGQge1xuICAgIHJlYWRvbmx5IEZPTERFUl9OQU1FID0gYEdyaWQgJHtHcmlkLmZvbGRlck5hbWVJbmRleCsrfWA7XG5cbiAgICBjb25zdHJ1Y3RvcihjZW50cmU6IFZlY3Rvciwgc2l6ZTogbnVtYmVyLCBkZWNheTogbnVtYmVyLCBwcml2YXRlIF90aGV0YTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGNlbnRyZSwgc2l6ZSwgZGVjYXkpO1xuICAgIH1cblxuICAgIHNldCB0aGV0YSh0aGV0YTogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuX3RoZXRhID0gdGhldGE7XG4gICAgfVxuXG4gICAgc2V0R3VpKGd1aTogZGF0LkdVSSk6IHZvaWQge1xuICAgICAgICBzdXBlci5zZXRHdWkoZ3VpKTtcblxuICAgICAgICAvLyBHVUkgaW4gZGVncmVlcywgY29udmVydCB0byByYWRzXG4gICAgICAgIGNvbnN0IHRoZXRhUHJvcCA9IHt0aGV0YTogdGhpcy5fdGhldGEgKiAxODAgLyBNYXRoLlBJfTtcbiAgICAgICAgY29uc3QgdGhldGFDb250cm9sbGVyID0gZ3VpLmFkZCh0aGV0YVByb3AsICd0aGV0YScsIC05MCwgOTApO1xuICAgICAgICB0aGV0YUNvbnRyb2xsZXIub25DaGFuZ2UodGhldGEgPT4gdGhpcy5fdGhldGEgPSB0aGV0YSAqIChNYXRoLlBJIC8gMTgwKSk7XG4gICAgfVxuXG4gICAgZ2V0VGVuc29yKHBvaW50OiBWZWN0b3IpOiBUZW5zb3Ige1xuICAgICAgICBjb25zdCBjb3MgPSBNYXRoLmNvcygyICogdGhpcy5fdGhldGEpO1xuICAgICAgICBjb25zdCBzaW4gPSBNYXRoLnNpbigyICogdGhpcy5fdGhldGEpO1xuICAgICAgICByZXR1cm4gbmV3IFRlbnNvcigxLCBbY29zLCBzaW5dKTtcbiAgICB9XG5cbiAgICBnZXRXb3JrZXJQYXJhbXMoKTogQmFzaXNGaWVsZFBhcmFtcyB7XG4gICAgICAgIGNvbnN0IHA6IEdyaWRQYXJhbXMgPSB7XG4gICAgICAgICAgICBjZW50cmU6IHRoaXMuY2VudHJlLFxuICAgICAgICAgICAgc2l6ZTogdGhpcy5fc2l6ZSxcbiAgICAgICAgICAgIGRlY2F5OiB0aGlzLl9kZWNheSxcbiAgICAgICAgICAgIHRoZXRhOiB0aGlzLl90aGV0YSxcbiAgICAgICAgfTtcblxuICAgICAgICByZXR1cm4gcDtcbiAgICB9XG59XG5cbmV4cG9ydCBjbGFzcyBSYWRpYWwgZXh0ZW5kcyBCYXNpc0ZpZWxkIHtcbiAgICByZWFkb25seSBGT0xERVJfTkFNRSA9IGBSYWRpYWwgJHtSYWRpYWwuZm9sZGVyTmFtZUluZGV4Kyt9YDtcbiAgICBjb25zdHJ1Y3RvcihjZW50cmU6IFZlY3Rvciwgc2l6ZTogbnVtYmVyLCBkZWNheTogbnVtYmVyKSB7XG4gICAgICAgIHN1cGVyKGNlbnRyZSwgc2l6ZSwgZGVjYXkpO1xuICAgIH1cblxuICAgIGdldFRlbnNvcihwb2ludDogVmVjdG9yKTogVGVuc29yIHtcbiAgICAgICAgY29uc3QgdCA9IHBvaW50LmNsb25lKCkuc3ViKHRoaXMuX2NlbnRyZSk7XG4gICAgICAgIGNvbnN0IHQxID0gdC55KioyIC0gdC54KioyO1xuICAgICAgICBjb25zdCB0MiA9IC0yICogdC54ICogdC55O1xuICAgICAgICByZXR1cm4gbmV3IFRlbnNvcigxLCBbdDEsIHQyXSk7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi4vdmVjdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgR3JpZFN0b3JhZ2Uge1xuXG4gICAgcHJpdmF0ZSBncmlkRGltZW5zaW9uczogVmVjdG9yO1xuICAgIHByaXZhdGUgZ3JpZDogVmVjdG9yW11bXVtdO1xuICAgIHByaXZhdGUgZHNlcFNxOiBudW1iZXI7XG5cbiAgICAvKipcbiAgICAgKiB3b3JsZERpbWVuc2lvbnMgYXNzdW1lcyBvcmlnaW4gb2YgMCwwXG4gICAgICogQHBhcmFtIHtudW1iZXJ9IGRzZXAgU2VwYXJhdGlvbiBkaXN0YW5jZSBiZXR3ZWVuIHNhbXBsZXNcbiAgICAgKi9cbiAgICBjb25zdHJ1Y3RvciAocHJpdmF0ZSB3b3JsZERpbWVuc2lvbnM6IFZlY3RvciwgcHJpdmF0ZSBvcmlnaW46IFZlY3RvciwgcHJpdmF0ZSBkc2VwOiBudW1iZXIpIHtcbiAgICAgICAgdGhpcy5kc2VwU3EgPSB0aGlzLmRzZXAgKiB0aGlzLmRzZXA7XG4gICAgICAgIHRoaXMuZ3JpZERpbWVuc2lvbnMgPSB3b3JsZERpbWVuc2lvbnMuY2xvbmUoKS5kaXZpZGVTY2FsYXIodGhpcy5kc2VwKTtcbiAgICAgICAgdGhpcy5ncmlkID0gW107XG4gICAgICAgIGZvciAobGV0IHggPSAwOyB4IDwgdGhpcy5ncmlkRGltZW5zaW9ucy54OyB4KyspIHtcbiAgICAgICAgICAgIHRoaXMuZ3JpZC5wdXNoKFtdKTtcbiAgICAgICAgICAgIGZvciAobGV0IHkgPSAwOyB5IDwgdGhpcy5ncmlkRGltZW5zaW9ucy55OyB5KyspIHtcbiAgICAgICAgICAgICAgICB0aGlzLmdyaWRbeF0ucHVzaChbXSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBhZGRQb2x5bGluZShsaW5lOiBWZWN0b3JbXSk6IHZvaWQge1xuICAgICAgICBsaW5lLmZvckVhY2godiA9PiB0aGlzLmFkZFNhbXBsZSh2KSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRG9lcyBub3QgZW5mb3JjZSBzZXBhcmF0aW9uXG4gICAgICovXG4gICAgYWRkU2FtcGxlKHY6IFZlY3RvciwgY29vcmRzPzogVmVjdG9yKTogdm9pZCB7XG4gICAgICAgIGlmICghY29vcmRzKSB7XG4gICAgICAgICAgICBjb29yZHMgPSB0aGlzLmdldFNhbXBsZUNvb3Jkcyh2KTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmdyaWRbY29vcmRzLnhdW2Nvb3Jkcy55XS5wdXNoKHYpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFRlc3RzIHdoZXRoZXIgdiBpcyBhdCBsZWFzdCBkIGF3YXkgZnJvbSBzYW1wbGVzXG4gICAgICogQHBhcmFtIGRTcT10aGlzLmRzZXBTcSBzcXVhcmVkIHRlc3QgZGlzdGFuY2VcbiAgICAgKiBDb3VsZCBiZSBkdGVzdCBpZiB3ZSBhcmUgaW50ZWdyYXRpbmcgYSBzdHJlYW1saW5lXG4gICAgICovXG4gICAgaXNWYWxpZFNhbXBsZSh2OiBWZWN0b3IsIGRTcT10aGlzLmRzZXBTcSk6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBjb29yZHMgPSB0aGlzLmdldFNhbXBsZUNvb3Jkcyh2KTtcblxuICAgICAgICAvLyBDaGVjayBzYW1wbGVzIGluIDkgY2VsbHMgaW4gM3gzIGdyaWRcbiAgICAgICAgZm9yIChsZXQgeCA9IC0xOyB4IDw9IDE7IHgrKykge1xuICAgICAgICAgICAgZm9yIChsZXQgeSA9IC0xOyB5IDw9IDE7IHkrKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IGNlbGwgPSBjb29yZHMuY2xvbmUoKS5hZGQobmV3IFZlY3Rvcih4LCB5KSk7XG4gICAgICAgICAgICAgICAgaWYgKCF0aGlzLnZlY3Rvck91dE9mQm91bmRzKGNlbGwsIHRoaXMuZ3JpZERpbWVuc2lvbnMpKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmICghdGhpcy52ZWN0b3JGYXJGcm9tVmVjdG9ycyh2LCB0aGlzLmdyaWRbY2VsbC54XVtjZWxsLnldLCBkU3EpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgXG4gICAgLyoqXG4gICAgICogVGVzdCB3aGV0aGVyIHYgaXMgYXQgbGVhc3QgZCBhd2F5IGZyb20gdmVjdG9yc1xuICAgICAqIEBwYXJhbSB7bnVtYmVyfSAgIGRTcSAgICAgc3F1YXJlZCB0ZXN0IGRpc3RhbmNlXG4gICAgICovXG4gICAgdmVjdG9yRmFyRnJvbVZlY3RvcnModjogVmVjdG9yLCB2ZWN0b3JzOiBWZWN0b3JbXSwgZFNxOiBudW1iZXIpOiBib29sZWFuIHtcbiAgICAgICAgZm9yIChjb25zdCBzYW1wbGUgb2YgdmVjdG9ycykge1xuICAgICAgICAgICAgaWYgKHNhbXBsZSAhPT0gdikge1xuICAgICAgICAgICAgICAgIGNvbnN0IGRpc3RhbmNlU3EgPSBzYW1wbGUuZGlzdGFuY2VUb1NxdWFyZWQodik7XG4gICAgICAgICAgICAgICAgaWYgKGRpc3RhbmNlU3EgPCBkU3EpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHByaXZhdGUgd29ybGRUb0dyaWQodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHYuY2xvbmUoKS5zdWIodGhpcy5vcmlnaW4pO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ3JpZFRvV29ybGQodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHYuY2xvbmUoKS5hZGQodGhpcy5vcmlnaW4pO1xuICAgIH1cblxuICAgIHByaXZhdGUgdmVjdG9yT3V0T2ZCb3VuZHMoZ3JpZFY6IFZlY3RvciwgYm91bmRzOiBWZWN0b3IpOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIChncmlkVi54IDwgMCB8fCBncmlkVi55IDwgMCB8fFxuICAgICAgICAgICAgZ3JpZFYueCA+PSBib3VuZHMueCB8fCBncmlkVi55ID49IGJvdW5kcy55KTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJuIHtWZWN0b3J9ICAgQ2VsbCBjb29yZHMgY29ycmVzcG9uZGluZyB0byB2ZWN0b3JcbiAgICAgKi9cbiAgICBwcml2YXRlIGdldFNhbXBsZUNvb3Jkcyh3b3JsZFY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHYgPSB0aGlzLndvcmxkVG9HcmlkKHdvcmxkVik7XG4gICAgICAgIGlmICh0aGlzLnZlY3Rvck91dE9mQm91bmRzKHYsIHRoaXMud29ybGREaW1lbnNpb25zKSkge1xuICAgICAgICAgICAgY29uc29sZS5sb2codik7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyh3b3JsZFYpO1xuICAgICAgICAgICAgY29uc29sZS5sb2codGhpcy5vcmlnaW4pO1xuICAgICAgICAgICAgbG9nLmVycm9yKFwiVHJpZWQgdG8gYWNjZXNzIG91dC1vZi1ib3VuZHMgc2FtcGxlIGluIGdyaWRcIik7XG4gICAgICAgICAgICByZXR1cm4gVmVjdG9yLnplcm9WZWN0b3IoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgTWF0aC5mbG9vcih2LnggLyB0aGlzLmRzZXApLFxuICAgICAgICAgICAgTWF0aC5mbG9vcih2LnkgLyB0aGlzLmRzZXApXG4gICAgICAgICk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFRlbnNvckZpZWxkIGZyb20gJy4vdGVuc29yX2ZpZWxkJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi4vdmVjdG9yJztcbmltcG9ydCB7U3RyZWFtbGluZVBhcmFtc30gZnJvbSAnLi9zdHJlYW1saW5lcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGFic3RyYWN0IGNsYXNzIEZpZWxkSW50ZWdyYXRvciB7XG4gICAgY29uc3RydWN0b3IocHJvdGVjdGVkIGZpZWxkOiBUZW5zb3JGaWVsZCkge31cblxuICAgIGFic3RyYWN0IGludGVncmF0ZShwb2ludDogVmVjdG9yLCBtYWpvcjogYm9vbGVhbik6IFZlY3RvcjtcblxuICAgIHByb3RlY3RlZCBzYW1wbGVGaWVsZFZlY3Rvcihwb2ludDogVmVjdG9yLCBtYWpvcjogYm9vbGVhbik6IFZlY3RvciB7XG4gICAgICAgIGNvbnN0IHRlbnNvciA9IHRoaXMuZmllbGQuc2FtcGxlUG9pbnQocG9pbnQpO1xuICAgICAgICBpZiAobWFqb3IpIHJldHVybiB0ZW5zb3IuZ2V0TWFqb3IoKTtcbiAgICAgICAgcmV0dXJuIHRlbnNvci5nZXRNaW5vcigpO1xuICAgIH1cbn1cblxuZXhwb3J0IGNsYXNzIEV1bGVySW50ZWdyYXRvciBleHRlbmRzIEZpZWxkSW50ZWdyYXRvciB7XG4gICAgY29uc3RydWN0b3IoZmllbGQ6IFRlbnNvckZpZWxkLCBwcml2YXRlIHBhcmFtczogU3RyZWFtbGluZVBhcmFtcykge1xuICAgICAgICBzdXBlcihmaWVsZCk7XG4gICAgfVxuXG4gICAgaW50ZWdyYXRlKHBvaW50OiBWZWN0b3IsIG1ham9yOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2FtcGxlRmllbGRWZWN0b3IocG9pbnQsIG1ham9yKS5tdWx0aXBseVNjYWxhcih0aGlzLnBhcmFtcy5kc3RlcCk7XG4gICAgfVxufVxuXG5leHBvcnQgY2xhc3MgUks0SW50ZWdyYXRvciBleHRlbmRzIEZpZWxkSW50ZWdyYXRvciB7XG4gICAgY29uc3RydWN0b3IoZmllbGQ6IFRlbnNvckZpZWxkLCBwcml2YXRlIHBhcmFtczogU3RyZWFtbGluZVBhcmFtcykge1xuICAgICAgICBzdXBlcihmaWVsZCk7XG4gICAgfVxuXG4gICAgaW50ZWdyYXRlKHBvaW50OiBWZWN0b3IsIG1ham9yOiBib29sZWFuKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgazEgPSB0aGlzLnNhbXBsZUZpZWxkVmVjdG9yKHBvaW50LCBtYWpvcik7XG4gICAgICAgIGNvbnN0IGsyMyA9IHRoaXMuc2FtcGxlRmllbGRWZWN0b3IocG9pbnQuY2xvbmUoKS5hZGQoVmVjdG9yLmZyb21TY2FsYXIodGhpcy5wYXJhbXMuZHN0ZXAgLyAyKSksIG1ham9yKTtcbiAgICAgICAgY29uc3QgazQgPSB0aGlzLnNhbXBsZUZpZWxkVmVjdG9yKHBvaW50LmNsb25lKCkuYWRkKFZlY3Rvci5mcm9tU2NhbGFyKHRoaXMucGFyYW1zLmRzdGVwKSksIG1ham9yKTtcblxuICAgICAgICByZXR1cm4gazEuYWRkKGsyMy5tdWx0aXBseVNjYWxhcig0KSkuYWRkKGs0KS5tdWx0aXBseVNjYWxhcih0aGlzLnBhcmFtcy5kc3RlcCAvIDYpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgKiBhcyBzaW1wbGlmeSBmcm9tICdzaW1wbGlmeS1qcyc7XG5pbXBvcnQgVmVjdG9yIGZyb20gJy4uL3ZlY3Rvcic7XG5pbXBvcnQgR3JpZFN0b3JhZ2UgZnJvbSAnLi9ncmlkX3N0b3JhZ2UnO1xuaW1wb3J0IEZpZWxkSW50ZWdyYXRvciBmcm9tICcuL2ludGVncmF0b3InO1xuaW1wb3J0IHtWZWN0b3JQYXJhbXN9IGZyb20gJy4vd29ya2VyL3dvcmtlcl9wYXJhbXMnO1xuXG5pbnRlcmZhY2UgU3RyZWFtbGluZUludGVncmF0aW9uIHtcbiAgICBzdHJlYW1saW5lOiBWZWN0b3JbXTtcbiAgICBwcmV2aW91c0RpcmVjdGlvbjogVmVjdG9yO1xuICAgIHByZXZpb3VzUG9pbnQ6IFZlY3RvcjtcbiAgICB2YWxpZDogYm9vbGVhbjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1saW5lUGFyYW1zIHtcbiAgICBbcHJvcDogc3RyaW5nXTogbnVtYmVyLFxuICAgIGRzZXA6IG51bWJlcjsgIC8vIFN0cmVhbWxpbmUgc2VlZCBzZXBhcmF0aW5nIGRpc3RhbmNlXG4gICAgZHRlc3Q6IG51bWJlcjsgIC8vIFN0cmVhbWxpbmUgaW50ZWdyYXRpb24gc2VwYXJhdGluZyBkaXN0YW5jZVxuICAgIGRzdGVwOiBudW1iZXI7ICAvLyBTdGVwIHNpemVcbiAgICBkbG9va2FoZWFkOiBudW1iZXI7ICAvLyBIb3cgZmFyIHRvIGxvb2sgYWhlYWQgdG8gam9pbiB1cFxuICAgIHBhdGhJdGVyYXRpb25zOiBudW1iZXI7ICAvLyBQYXRoIGludGVncmF0aW9uIGl0ZXJhdGlvbiBsaW1pdFxuICAgIHNlZWRUcmllczogbnVtYmVyOyAgLy8gTWF4IGZhaWxlZCBzZWVkc1xuICAgIHNpbXBsaWZ5VG9sZXJhbmNlOiBudW1iZXI7XG59XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFN0cmVhbWxpbmVHZW5lcmF0b3Ige1xuICAgIHByaXZhdGUgbWFqb3JHcmlkOiBHcmlkU3RvcmFnZTtcbiAgICBwcml2YXRlIG1pbm9yR3JpZDogR3JpZFN0b3JhZ2U7XG4gICAgcHJpdmF0ZSBwYXJhbXNTcTogU3RyZWFtbGluZVBhcmFtcztcblxuICAgIHByaXZhdGUgY2FuZGlkYXRlU2VlZHNNYWpvcjogVmVjdG9yW10gPSBbXTtcbiAgICBwcml2YXRlIGNhbmRpZGF0ZVNlZWRzTWlub3I6IFZlY3RvcltdID0gW107XG5cbiAgICBwcml2YXRlIHN0cmVhbWxpbmVzRG9uZTogYm9vbGVhbiA9IHRydWU7XG4gICAgcHJpdmF0ZSBsYXN0U3RyZWFtbGluZU1ham9yOiBib29sZWFuID0gdHJ1ZTtcblxuICAgIHB1YmxpYyBzdHJlYW1saW5lc01ham9yOiBWZWN0b3JbXVtdID0gW107XG4gICAgcHVibGljIHN0cmVhbWxpbmVzTWlub3I6IFZlY3RvcltdW10gPSBbXTtcbiAgICBwdWJsaWMgYWxsU3RyZWFtbGluZXNTaW1wbGU6IFZlY3RvcltdW10gPSBbXTsgIC8vIFJlZHVjZWQgdmVydGV4IGNvdW50XG4gICAgcHVibGljIGFsbFN0cmVhbWxpbmVzU2ltcGxlUGFyYW1zOiBWZWN0b3JQYXJhbXNbXVtdID1bXTtcblxuXG4gICAgLyoqXG4gICAgICogVXNlcyB3b3JsZC1zcGFjZSBjb29yZGluYXRlc1xuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgaW50ZWdyYXRvcjogRmllbGRJbnRlZ3JhdG9yLFxuICAgICAgICAgICAgICAgIHByaXZhdGUgb3JpZ2luOiBWZWN0b3IsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSB3b3JsZERpbWVuc2lvbnM6IFZlY3RvcixcbiAgICAgICAgICAgICAgICBwcml2YXRlIHBhcmFtczogU3RyZWFtbGluZVBhcmFtcykge1xuICAgICAgICBpZiAocGFyYW1zLmRzdGVwID4gcGFyYW1zLmRzZXApIHtcbiAgICAgICAgICAgIGxvZy5lcnJvcihcIlNUUkVBTUxJTkUgU0FNUExFIERJU1RBTkNFIEJJR0dFUiBUSEFOIERTRVBcIik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBFbmZvcmNlIHRlc3QgPCBzZXBcbiAgICAgICAgcGFyYW1zLmR0ZXN0ID0gTWF0aC5taW4ocGFyYW1zLmR0ZXN0LCBwYXJhbXMuZHNlcCk7XG5cbiAgICAgICAgdGhpcy5tYWpvckdyaWQgPSBuZXcgR3JpZFN0b3JhZ2UodGhpcy53b3JsZERpbWVuc2lvbnMsIHRoaXMub3JpZ2luLCBwYXJhbXMuZHNlcCk7XG4gICAgICAgIHRoaXMubWlub3JHcmlkID0gbmV3IEdyaWRTdG9yYWdlKHRoaXMud29ybGREaW1lbnNpb25zLCB0aGlzLm9yaWdpbiwgcGFyYW1zLmRzZXApO1xuXG4gICAgICAgIHRoaXMuc2V0UGFyYW1zU3EoKTtcbiAgICB9XG5cbiAgICBnZXQgYWxsU3RyZWFtbGluZXMoKTogVmVjdG9yW11bXSB7XG4gICAgICAgIC8vIENvbWJpbmVcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RyZWFtbGluZXNNYWpvci5jb25jYXQodGhpcy5zdHJlYW1saW5lc01pbm9yKTtcbiAgICB9XG5cbiAgICB1cGRhdGUoKSB7XG4gICAgICAgIGlmICghdGhpcy5zdHJlYW1saW5lc0RvbmUpIHtcbiAgICAgICAgICAgIHRoaXMubGFzdFN0cmVhbWxpbmVNYWpvciA9ICF0aGlzLmxhc3RTdHJlYW1saW5lTWFqb3I7XG4gICAgICAgICAgICBpZiAoIXRoaXMuY3JlYXRlU3RyZWFtbGluZSh0aGlzLmxhc3RTdHJlYW1saW5lTWFqb3IpKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zdHJlYW1saW5lc0RvbmUgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU3RyZWFtbGluZXMgY3JlYXRlZCBlYWNoIGZyYW1lIChhbmltYXRlZClcbiAgICAgKi9cbiAgICBjcmVhdGVBbGxTdHJlYW1saW5lc0R5bmFtaWMoKSB7XG4gICAgICAgIHRoaXMuc3RyZWFtbGluZXNEb25lID0gZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQWxsIGF0IG9uY2UgLSB3aWxsIGZyZWV6ZSBpZiBkc2VwIHNtYWxsXG4gICAgICovXG4gICAgY3JlYXRlQWxsU3RyZWFtbGluZXMoKSB7XG4gICAgICAgIGxldCBtYWpvciA9IHRydWU7XG4gICAgICAgIHdoaWxlICh0aGlzLmNyZWF0ZVN0cmVhbWxpbmUobWFqb3IpKSB7XG4gICAgICAgICAgICBtYWpvciA9ICFtYWpvcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEZpbmRzIHNlZWQgYW5kIGNyZWF0ZXMgYSBzdHJlYW1saW5lIGZyb20gdGhhdCBwb2ludFxuICAgICAqIFB1c2hlcyBuZXcgY2FuZGlkYXRlIHNlZWRzIHRvIHF1ZXVlXG4gICAgICogQHJldHVybiB7VmVjdG9yW119IHJldHVybnMgZmFsc2UgaWYgc2VlZCBpc24ndCBmb3VuZCB3aXRoaW4gcGFyYW1zLnNlZWRUcmllc1xuICAgICAqL1xuICAgIHByaXZhdGUgY3JlYXRlU3RyZWFtbGluZShtYWpvcjogYm9vbGVhbik6IGJvb2xlYW4ge1xuICAgICAgICBjb25zdCBzZWVkID0gdGhpcy5nZXRTZWVkKG1ham9yKTtcbiAgICAgICAgaWYgKHNlZWQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgICAgICBjb25zdCBzdHJlYW1saW5lID0gdGhpcy5pbnRlZ3JhdGVTdHJlYW1saW5lKHNlZWQsIG1ham9yKTtcbiAgICAgICAgaWYgKHRoaXMudmFsaWRTdHJlYW1saW5lKHN0cmVhbWxpbmUpKSB7XG4gICAgICAgICAgICB0aGlzLmdyaWQobWFqb3IpLmFkZFBvbHlsaW5lKHN0cmVhbWxpbmUpO1xuICAgICAgICAgICAgdGhpcy5zdHJlYW1saW5lcyhtYWpvcikucHVzaChzdHJlYW1saW5lKTtcblxuICAgICAgICAgICAgY29uc3Qgc2ltcGxlU3RyZWFtbGluZSA9IHNpbXBsaWZ5KHN0cmVhbWxpbmUsIHRoaXMucGFyYW1zLnNpbXBsaWZ5VG9sZXJhbmNlKS5tYXAocG9pbnQgPT4gbmV3IFZlY3Rvcihwb2ludC54LCBwb2ludC55KSk7XG4gICAgICAgICAgICB0aGlzLmFsbFN0cmVhbWxpbmVzU2ltcGxlLnB1c2goc2ltcGxlU3RyZWFtbGluZSk7XG4gICAgICAgICAgICB0aGlzLmFsbFN0cmVhbWxpbmVzU2ltcGxlUGFyYW1zLnB1c2goc2ltcGxlU3RyZWFtbGluZS5tYXAodiA9PiB7XG4gICAgICAgICAgICAgICAgY29uc3QgcCA9IHtcbiAgICAgICAgICAgICAgICAgICAgeDogdi54LFxuICAgICAgICAgICAgICAgICAgICB5OiB2LnlcbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHJldHVybiBwO1xuICAgICAgICAgICAgfSkpO1xuXG4gICAgICAgICAgICAvLyBBZGQgY2FuZGlkYXRlIHNlZWRzXG4gICAgICAgICAgICBpZiAoIXN0cmVhbWxpbmVbMF0uZXF1YWxzKHN0cmVhbWxpbmVbc3RyZWFtbGluZS5sZW5ndGggLSAxXSkpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVNlZWRzKCFtYWpvcikucHVzaChzdHJlYW1saW5lWzBdKTtcbiAgICAgICAgICAgICAgICB0aGlzLmNhbmRpZGF0ZVNlZWRzKCFtYWpvcikucHVzaChzdHJlYW1saW5lW3N0cmVhbWxpbmUubGVuZ3RoIC0gMV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSB2YWxpZFN0cmVhbWxpbmUoczogVmVjdG9yW10pOiBib29sZWFuIHtcbiAgICAgICAgcmV0dXJuIHMubGVuZ3RoID4gNTtcbiAgICB9IFxuXG4gICAgcHJpdmF0ZSBzZXRQYXJhbXNTcSgpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5wYXJhbXNTcSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMucGFyYW1zKTtcbiAgICAgICAgZm9yIChsZXQgcCBpbiB0aGlzLnBhcmFtc1NxKSB7XG4gICAgICAgICAgICB0aGlzLnBhcmFtc1NxW3BdICo9IHRoaXMucGFyYW1zU3FbcF07XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBwcml2YXRlIHNhbXBsZVBvaW50KCk6IFZlY3RvciB7XG4gICAgICAgIC8vIFRPRE8gYmV0dGVyIHNlZWRpbmcgc2NoZW1lXG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKFxuICAgICAgICAgICAgTWF0aC5yYW5kb20oKSAqIHRoaXMud29ybGREaW1lbnNpb25zLngsXG4gICAgICAgICAgICBNYXRoLnJhbmRvbSgpICogdGhpcy53b3JsZERpbWVuc2lvbnMueSlcbiAgICAgICAgICAgIC5hZGQodGhpcy5vcmlnaW4pO1xuICAgIH1cbiBcbiAgICAvKipcbiAgICAgKiBUcmllcyB0aGlzLmNhbmRpZGF0ZVNlZWRzIGZpcnN0LCB0aGVuIHNhbXBsZXMgdXNpbmcgdGhpcy5zYW1wbGVQb2ludFxuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0U2VlZChtYWpvcjogYm9vbGVhbik6IFZlY3RvciB7XG4gICAgICAgIC8vIENhbmRpZGF0ZSBzZWVkcyBmaXJzdFxuICAgICAgICBpZiAodGhpcy5jYW5kaWRhdGVTZWVkcyhtYWpvcikubGVuZ3RoID4gMCkge1xuICAgICAgICAgICAgd2hpbGUgKHRoaXMuY2FuZGlkYXRlU2VlZHMobWFqb3IpLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgICAgICBjb25zdCBzZWVkID0gdGhpcy5jYW5kaWRhdGVTZWVkcyhtYWpvcikucG9wKCk7XG4gICAgICAgICAgICAgICAgaWYgKHRoaXMuZ3JpZChtYWpvcikuaXNWYWxpZFNhbXBsZShzZWVkLCB0aGlzLnBhcmFtc1NxLmRzZXApKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBzZWVkO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIGxldCBzZWVkID0gdGhpcy5zYW1wbGVQb2ludCgpO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlICghdGhpcy5ncmlkKG1ham9yKS5pc1ZhbGlkU2FtcGxlKHNlZWQsIHRoaXMucGFyYW1zU3EuZHNlcCkpIHtcbiAgICAgICAgICAgIGlmIChpID49IHRoaXMucGFyYW1zLnNlZWRUcmllcykge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgc2VlZCA9IHRoaXMuc2FtcGxlUG9pbnQoKTtcbiAgICAgICAgICAgIGkrKztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBzZWVkO1xuICAgIH1cblxuICAgIC8vIFRPRE8gZW51bSB0byByZW1vdmUgdGhlc2UgZnVuY3Rpb25zXG4gICAgcHJpdmF0ZSBjYW5kaWRhdGVTZWVkcyhtYWpvcjogYm9vbGVhbik6IFZlY3RvcltdIHtcbiAgICAgICAgcmV0dXJuIG1ham9yID8gdGhpcy5jYW5kaWRhdGVTZWVkc01ham9yIDogdGhpcy5jYW5kaWRhdGVTZWVkc01pbm9yO1xuICAgIH1cblxuICAgIHByaXZhdGUgc3RyZWFtbGluZXMobWFqb3I6IGJvb2xlYW4pOiBWZWN0b3JbXVtdIHtcbiAgICAgICAgcmV0dXJuIG1ham9yID8gdGhpcy5zdHJlYW1saW5lc01ham9yIDogdGhpcy5zdHJlYW1saW5lc01pbm9yO1xuICAgIH1cblxuICAgIHByaXZhdGUgZ3JpZChtYWpvcjogYm9vbGVhbik6IEdyaWRTdG9yYWdlIHtcbiAgICAgICAgcmV0dXJuIG1ham9yID8gdGhpcy5tYWpvckdyaWQgOiB0aGlzLm1pbm9yR3JpZDtcbiAgICB9XG5cbiAgICBwcml2YXRlIHBvaW50SW5Cb3VuZHModjogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAodi54ID49IHRoaXMub3JpZ2luLnhcbiAgICAgICAgICAgICYmIHYueSA+PSB0aGlzLm9yaWdpbi55XG4gICAgICAgICAgICAmJiB2LnggPCB0aGlzLndvcmxkRGltZW5zaW9ucy54ICsgdGhpcy5vcmlnaW4ueFxuICAgICAgICAgICAgJiYgdi55IDwgdGhpcy53b3JsZERpbWVuc2lvbnMueSArIHRoaXMub3JpZ2luLnlcbiAgICAgICAgKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBPbmUgc3RlcCBvZiB0aGUgc3RyZWFtbGluZSBpbnRlZ3JhdGlvbiBwcm9jZXNzXG4gICAgICovXG4gICAgcHJpdmF0ZSBzdHJlYW1saW5lSW50ZWdyYXRpb25TdGVwKHBhcmFtczogU3RyZWFtbGluZUludGVncmF0aW9uLCBtYWpvcjogYm9vbGVhbik6IHZvaWQge1xuICAgICAgICBpZiAocGFyYW1zLnZhbGlkKSB7XG4gICAgICAgICAgICBwYXJhbXMuc3RyZWFtbGluZS5wdXNoKHBhcmFtcy5wcmV2aW91c1BvaW50KTtcbiAgICAgICAgICAgIGNvbnN0IG5leHREaXJlY3Rpb24gPSB0aGlzLmludGVncmF0b3IuaW50ZWdyYXRlKHBhcmFtcy5wcmV2aW91c1BvaW50LCBtYWpvcik7XG5cbiAgICAgICAgICAgIC8vIE1ha2Ugc3VyZSB3ZSB0cmF2ZWwgaW4gdGhlIHNhbWUgZGlyZWN0aW9uXG4gICAgICAgICAgICBpZiAobmV4dERpcmVjdGlvbi5kb3QocGFyYW1zLnByZXZpb3VzRGlyZWN0aW9uKSA8IDApIHtcbiAgICAgICAgICAgICAgICBuZXh0RGlyZWN0aW9uLm5lZ2F0ZSgpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBjb25zdCBuZXh0UG9pbnQgPSBwYXJhbXMucHJldmlvdXNQb2ludC5jbG9uZSgpLmFkZChuZXh0RGlyZWN0aW9uKTtcblxuICAgICAgICAgICAgaWYgKHRoaXMucG9pbnRJbkJvdW5kcyhuZXh0UG9pbnQpXG4gICAgICAgICAgICAgICAgJiYgdGhpcy5ncmlkKG1ham9yKS5pc1ZhbGlkU2FtcGxlKG5leHRQb2ludCwgdGhpcy5wYXJhbXNTcS5kdGVzdCkpIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHJldmlvdXNQb2ludCA9IG5leHRQb2ludDtcbiAgICAgICAgICAgICAgICBwYXJhbXMucHJldmlvdXNEaXJlY3Rpb24gPSBuZXh0RGlyZWN0aW9uO1xuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBwYXJhbXMudmFsaWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEJ5IHNpbXVsdGFuZW91c2x5IGludGVncmF0aW5nIGluIGJvdGggZGlyZWN0aW9ucyB3ZSByZWR1Y2UgdGhlIGltcGFjdCBvZiBjaXJjbGVzIG5vdCBqb2luaW5nXG4gICAgICogdXAgYXMgdGhlIGVycm9yIG1hdGNoZXMgYXQgdGhlIGpvaW5cbiAgICAgKi9cbiAgICBwcml2YXRlIGludGVncmF0ZVN0cmVhbWxpbmUoc2VlZDogVmVjdG9yLCBtYWpvcjogYm9vbGVhbik6IFZlY3RvcltdIHtcbiAgICAgICAgbGV0IGNvdW50ID0gMDtcbiAgICAgICAgbGV0IHBvaW50c0VzY2FwZWQgPSBmYWxzZTsgIC8vIFRydWUgb25jZSB0d28gaW50ZWdyYXRpb24gZnJvbnRzIGhhdmUgbW92ZWQgZGxvb2thaGVhZCBhd2F5XG5cbiAgICAgICAgY29uc3QgZCA9IHRoaXMuaW50ZWdyYXRvci5pbnRlZ3JhdGUoc2VlZCwgbWFqb3IpO1xuXG4gICAgICAgIGNvbnN0IGZvcndhcmRQYXJhbXM6IFN0cmVhbWxpbmVJbnRlZ3JhdGlvbiA9IHtcbiAgICAgICAgICAgIHN0cmVhbWxpbmU6IFtzZWVkXSxcbiAgICAgICAgICAgIHByZXZpb3VzRGlyZWN0aW9uOiBkLFxuICAgICAgICAgICAgcHJldmlvdXNQb2ludDogc2VlZC5jbG9uZSgpLmFkZChkKSxcbiAgICAgICAgICAgIHZhbGlkOiB0cnVlLFxuICAgICAgICB9XG5cbiAgICAgICAgZm9yd2FyZFBhcmFtcy52YWxpZCA9IHRoaXMucG9pbnRJbkJvdW5kcyhmb3J3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuXG4gICAgICAgIGNvbnN0IGJhY2t3YXJkUGFyYW1zOiBTdHJlYW1saW5lSW50ZWdyYXRpb24gPSB7XG4gICAgICAgICAgICBzdHJlYW1saW5lOiBbXSxcbiAgICAgICAgICAgIHByZXZpb3VzRGlyZWN0aW9uOiBkLmNsb25lKCkubmVnYXRlKCksXG4gICAgICAgICAgICBwcmV2aW91c1BvaW50OiBzZWVkLmNsb25lKCkuYWRkKGQuY2xvbmUoKS5uZWdhdGUoKSksXG4gICAgICAgICAgICB2YWxpZDogdHJ1ZSxcbiAgICAgICAgfVxuXG4gICAgICAgIGJhY2t3YXJkUGFyYW1zLnZhbGlkID0gdGhpcy5wb2ludEluQm91bmRzKGJhY2t3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuXG4gICAgICAgIHdoaWxlIChjb3VudCA8IHRoaXMucGFyYW1zLnBhdGhJdGVyYXRpb25zICYmIChmb3J3YXJkUGFyYW1zLnZhbGlkIHx8IGJhY2t3YXJkUGFyYW1zLnZhbGlkKSkge1xuICAgICAgICAgICAgdGhpcy5zdHJlYW1saW5lSW50ZWdyYXRpb25TdGVwKGZvcndhcmRQYXJhbXMsIG1ham9yKTtcbiAgICAgICAgICAgIHRoaXMuc3RyZWFtbGluZUludGVncmF0aW9uU3RlcChiYWNrd2FyZFBhcmFtcywgbWFqb3IpO1xuXG4gICAgICAgICAgICAvLyBKb2luIHVwIGNpcmNsZXNcbiAgICAgICAgICAgIGNvbnN0IHNxRGlzdGFuY2VCZXR3ZWVuUG9pbnRzID0gZm9yd2FyZFBhcmFtcy5wcmV2aW91c1BvaW50LmRpc3RhbmNlVG9TcXVhcmVkKGJhY2t3YXJkUGFyYW1zLnByZXZpb3VzUG9pbnQpO1xuXG4gICAgICAgICAgICBpZiAoIXBvaW50c0VzY2FwZWQgJiYgc3FEaXN0YW5jZUJldHdlZW5Qb2ludHMgPiB0aGlzLnBhcmFtc1NxLmRsb29rYWhlYWQpIHtcbiAgICAgICAgICAgICAgICBwb2ludHNFc2NhcGVkID0gdHJ1ZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYgKHBvaW50c0VzY2FwZWQgJiYgc3FEaXN0YW5jZUJldHdlZW5Qb2ludHMgPD0gdGhpcy5wYXJhbXNTcS5kbG9va2FoZWFkKSB7XG4gICAgICAgICAgICAgICAgZm9yd2FyZFBhcmFtcy5zdHJlYW1saW5lLnB1c2goZm9yd2FyZFBhcmFtcy5wcmV2aW91c1BvaW50KTtcbiAgICAgICAgICAgICAgICBmb3J3YXJkUGFyYW1zLnN0cmVhbWxpbmUucHVzaChiYWNrd2FyZFBhcmFtcy5wcmV2aW91c1BvaW50KTtcbiAgICAgICAgICAgICAgICBiYWNrd2FyZFBhcmFtcy5zdHJlYW1saW5lLnB1c2goYmFja3dhcmRQYXJhbXMucHJldmlvdXNQb2ludCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGNvdW50Kys7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gYmFja3dhcmRQYXJhbXMuc3RyZWFtbGluZS5yZXZlcnNlKCkuY29uY2F0KGZvcndhcmRQYXJhbXMuc3RyZWFtbGluZSk7XG4gICAgfVxufVxuIiwiaW1wb3J0IFZlY3RvciBmcm9tICcuLi92ZWN0b3InO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW5zb3Ige1xuICAgIHByaXZhdGUgb2xkVGhldGE6IGJvb2xlYW47XG4gICAgcHJpdmF0ZSBfdGhldGE6IG51bWJlcjtcblxuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcjogbnVtYmVyLCBwcml2YXRlIG1hdHJpeDogbnVtYmVyW10pIHtcbiAgICAgICAgLy8gTWF0cml4IGlzIDIgZWxlbWVudCBsaXN0XG4gICAgICAgIC8vIFsgMCwgMVxuICAgICAgICAvLyAgIDEsIC0wIF1cbiAgICAgICAgdGhpcy5vbGRUaGV0YSA9IGZhbHNlO1xuICAgICAgICB0aGlzLl90aGV0YSA9IHRoaXMuY2FsY3VsYXRlVGhldGEoKTtcbiAgICB9XG5cbiAgICBnZXQgdGhldGEoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMub2xkVGhldGEpIHtcbiAgICAgICAgICAgIHRoaXMuX3RoZXRhID0gdGhpcy5jYWxjdWxhdGVUaGV0YSgpO1xuICAgICAgICAgICAgdGhpcy5vbGRUaGV0YSA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHRoaXMuX3RoZXRhO1xuICAgIH1cblxuICAgIGFkZCh0ZW5zb3I6IFRlbnNvcik6IFRlbnNvciB7XG4gICAgICAgIHRoaXMubWF0cml4ID0gdGhpcy5tYXRyaXgubWFwKCh2LCBpKSA9PiB2ICogdGhpcy5yICsgdGVuc29yLm1hdHJpeFtpXSAqIHRlbnNvci5yKTtcbiAgICAgICAgdGhpcy5yID0gMjtcbiAgICAgICAgdGhpcy5vbGRUaGV0YSA9IHRydWU7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNjYWxlKHM6IG51bWJlcik6IFRlbnNvciB7XG4gICAgICAgIHRoaXMuciAqPSBzO1xuICAgICAgICB0aGlzLm9sZFRoZXRhID0gdHJ1ZTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgZ2V0TWFqb3IoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoTWF0aC5jb3ModGhpcy50aGV0YSksIE1hdGguc2luKHRoaXMudGhldGEpKTtcbiAgICB9XG5cbiAgICBnZXRNaW5vcigpOiBWZWN0b3Ige1xuICAgICAgICBjb25zdCBhbmdsZSA9IHRoaXMudGhldGEgKyBNYXRoLlBJIC8gMjtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IoTWF0aC5jb3MoYW5nbGUpLCBNYXRoLnNpbihhbmdsZSkpO1xuICAgIH1cblxuICAgIHByaXZhdGUgY2FsY3VsYXRlVGhldGEoKTogbnVtYmVyIHtcbiAgICAgICAgaWYgKHRoaXMuciA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIDA7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIE1hdGguYXRhbjIodGhpcy5tYXRyaXhbMV0gLyB0aGlzLnIsIHRoaXMubWF0cml4WzBdIC8gdGhpcy5yKSAvIDI7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBUZW5zb3IgZnJvbSAnLi90ZW5zb3InO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi92ZWN0b3InO1xuaW1wb3J0IHtHcmlkLCBSYWRpYWwsIEJhc2lzRmllbGR9IGZyb20gJy4vYmFzaXNfZmllbGQnO1xuaW1wb3J0IHtXb3JrZXJPYmplY3QsIEJhc2lzRmllbGRQYXJhbXN9IGZyb20gJy4vd29ya2VyL3dvcmtlcl9wYXJhbXMnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBUZW5zb3JGaWVsZCBpbXBsZW1lbnRzIFdvcmtlck9iamVjdCB7XG4gICAgcHJpdmF0ZSBiYXNpc0ZpZWxkczogQmFzaXNGaWVsZFtdID0gW107XG4gICAgcHJpdmF0ZSBncmlkTmFtZUluZGV4ID0gMDtcbiAgICBwcml2YXRlIHJhZGlhbE5hbWVJbmRleCA9IDA7XG5cbiAgICBhZGRHcmlkKGNlbnRyZTogVmVjdG9yLCBzaXplOiBudW1iZXIsIGRlY2F5OiBudW1iZXIsIHRoZXRhOiBudW1iZXIpOiB2b2lkIHtcbiAgICAgICAgY29uc3QgZ3JpZCA9IG5ldyBHcmlkKGNlbnRyZSwgc2l6ZSwgZGVjYXksIHRoZXRhKTtcbiAgICAgICAgdGhpcy5hZGRGaWVsZChncmlkKTtcbiAgICB9XG5cbiAgICBhZGRSYWRpYWwoY2VudHJlOiBWZWN0b3IsIHNpemU6IG51bWJlciwgZGVjYXk6IG51bWJlcik6IHZvaWQge1xuICAgICAgICBjb25zdCByYWRpYWwgPSBuZXcgUmFkaWFsKGNlbnRyZSwgc2l6ZSwgZGVjYXkpO1xuICAgICAgICB0aGlzLmFkZEZpZWxkKHJhZGlhbCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFkZEZpZWxkKGZpZWxkOiBCYXNpc0ZpZWxkKTogdm9pZCB7XG4gICAgICAgIHRoaXMuYmFzaXNGaWVsZHMucHVzaChmaWVsZCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIHJlbW92ZUZpZWxkKGZpZWxkOiBCYXNpc0ZpZWxkKTogdm9pZCB7XG4gICAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5iYXNpc0ZpZWxkcy5pbmRleE9mKGZpZWxkKTtcbiAgICAgICAgaWYgKGluZGV4ID4gLTEpIHtcbiAgICAgICAgICAgIHRoaXMuYmFzaXNGaWVsZHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGdldENlbnRyZVBvaW50cygpOiBWZWN0b3JbXSB7XG4gICAgICAgIHJldHVybiB0aGlzLmJhc2lzRmllbGRzLm1hcChmaWVsZCA9PiBmaWVsZC5jZW50cmUpO1xuICAgIH1cblxuICAgIHNhbXBsZVBvaW50KHBvaW50OiBWZWN0b3IpOiBUZW5zb3Ige1xuICAgICAgICAvLyBEZWZhdWx0IGZpZWxkIGlzIGEgZ3JpZFxuICAgICAgICBpZiAodGhpcy5iYXNpc0ZpZWxkcy5sZW5ndGggPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBuZXcgVGVuc29yKDEsIFswLCAwXSk7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCB0ZW5zb3JBY2MgPSBuZXcgVGVuc29yKDAsIFswLCAwXSk7XG4gICAgICAgIHRoaXMuYmFzaXNGaWVsZHMuZm9yRWFjaChmaWVsZCA9PiB0ZW5zb3JBY2MuYWRkKGZpZWxkLmdldFdlaWdodGVkVGVuc29yKHBvaW50KSkpO1xuICAgICAgICByZXR1cm4gdGVuc29yQWNjO1xuICAgIH1cblxuICAgIGdldFdvcmtlclBhcmFtcygpOiBCYXNpc0ZpZWxkUGFyYW1zW10ge1xuICAgICAgICByZXR1cm4gdGhpcy5iYXNpc0ZpZWxkcy5tYXAoZiA9PiBmLmdldFdvcmtlclBhcmFtcygpKTtcbiAgICB9XG59XG4iLCJpbXBvcnQgKiBhcyBsb2cgZnJvbSAnbG9nbGV2ZWwnO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi8uLi92ZWN0b3InO1xuaW1wb3J0IFRlbnNvckZpZWxkIGZyb20gJy4uL3RlbnNvcl9maWVsZCc7XG5pbXBvcnQge1N0cmVhbWxpbmVQYXJhbXN9IGZyb20gJy4uL3N0cmVhbWxpbmVzJztcbmltcG9ydCBTdHJlYW1saW5lR2VuZXJhdG9yIGZyb20gJy4uL3N0cmVhbWxpbmVzJztcbmltcG9ydCB7Uks0SW50ZWdyYXRvcn0gZnJvbSAnLi4vaW50ZWdyYXRvcic7XG5pbXBvcnQge1N0cmVhbWxpbmVXb3JrZXJQYXJhbXMsIGlzR3JpZCwgTWVzc2FnZVR5cGV9IGZyb20gJy4vd29ya2VyX3BhcmFtcyc7XG5cbmZ1bmN0aW9uIHN0cmVhbWxpbmVzRnJvbVBhcmFtcyhwYXJhbXM6IFN0cmVhbWxpbmVXb3JrZXJQYXJhbXMpOiBTdHJlYW1saW5lR2VuZXJhdG9yIHtcbiAgICBjb25zdCBmaWVsZCA9IG5ldyBUZW5zb3JGaWVsZDtcbiAgICBwYXJhbXMuZmllbGRQYXJhbXMuZm9yRWFjaChmaWVsZFBhcmFtcyA9PiB7XG4gICAgICAgIGlmIChpc0dyaWQoZmllbGRQYXJhbXMpKSB7XG4gICAgICAgICAgICBmaWVsZC5hZGRHcmlkKG5ldyBWZWN0b3IoZmllbGRQYXJhbXMuY2VudHJlLngsIGZpZWxkUGFyYW1zLmNlbnRyZS55KSxcbiAgICAgICAgICAgICAgICBmaWVsZFBhcmFtcy5zaXplLCBmaWVsZFBhcmFtcy5kZWNheSwgZmllbGRQYXJhbXMudGhldGEpO1xuICAgICAgICB9IGVsc2UgeyAgLy8gUmFkaWFsXG4gICAgICAgICAgICBmaWVsZC5hZGRSYWRpYWwobmV3IFZlY3RvcihmaWVsZFBhcmFtcy5jZW50cmUueCwgZmllbGRQYXJhbXMuY2VudHJlLnkpLFxuICAgICAgICAgICAgICAgIGZpZWxkUGFyYW1zLnNpemUsIGZpZWxkUGFyYW1zLmRlY2F5KTtcbiAgICAgICAgfVxuICAgIH0pO1xuICAgIGNvbnN0IGludGVncmF0b3IgPSBuZXcgUks0SW50ZWdyYXRvcihmaWVsZCwgcGFyYW1zLnN0cmVhbWxpbmVzUGFyYW1zLnBhcmFtcyk7XG4gICAgY29uc3Qgb3JpZ2luID0gbmV3IFZlY3RvcihwYXJhbXMuc3RyZWFtbGluZXNQYXJhbXMub3JpZ2luLngsIHBhcmFtcy5zdHJlYW1saW5lc1BhcmFtcy5vcmlnaW4ueSk7XG4gICAgY29uc3Qgd29ybGREaW1lbnNpb25zID0gbmV3IFZlY3RvcihwYXJhbXMuc3RyZWFtbGluZXNQYXJhbXMud29ybGREaW1lbnNpb25zLngsIHBhcmFtcy5zdHJlYW1saW5lc1BhcmFtcy53b3JsZERpbWVuc2lvbnMueSk7XG4gICAgcmV0dXJuIG5ldyBTdHJlYW1saW5lR2VuZXJhdG9yKGludGVncmF0b3IsIG9yaWdpbiwgd29ybGREaW1lbnNpb25zLCBwYXJhbXMuc3RyZWFtbGluZXNQYXJhbXMucGFyYW1zKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSAoc2VsZjogYW55KSA9PiB7XG4gICAgc2VsZi5hZGRFdmVudExpc3RlbmVyKCdtZXNzYWdlJywgKGV2OiBhbnkpID0+IHtcbiAgICAgICAgc3dpdGNoKGV2LmRhdGFbMF0gYXMgTWVzc2FnZVR5cGUpIHtcbiAgICAgICAgICAgIGNhc2UgTWVzc2FnZVR5cGUuQ3JlYXRlTWFqb3JSb2Fkczoge1xuICAgICAgICAgICAgICAgIGNvbnN0IHBhcmFtczogU3RyZWFtbGluZVdvcmtlclBhcmFtcyA9IGV2LmRhdGFbMV07XG4gICAgICAgICAgICAgICAgc2VsZi5zID0gc3RyZWFtbGluZXNGcm9tUGFyYW1zKHBhcmFtcyk7XG4gICAgICAgICAgICAgICAgc2VsZi5zLmNyZWF0ZUFsbFN0cmVhbWxpbmVzKCk7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBjYXNlIE1lc3NhZ2VUeXBlLkdldE1ham9yUm9hZHM6IHtcbiAgICAgICAgICAgICAgICBpZiAoc2VsZi5zKSB7XG4gICAgICAgICAgICAgICAgICAgIHNlbGYucG9zdE1lc3NhZ2Uoc2VsZi5zLmFsbFN0cmVhbWxpbmVzU2ltcGxlUGFyYW1zKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgLy8gc2VsZi5wb3N0TWVzc2FnZShzLmFsbFN0cmVhbWxpbmVzU2ltcGxlKTtcbiAgICAgICAgLy8gc2V0SW50ZXJ2YWwoKCkgPT4ge1xuICAgICAgICAvLyAgICAgc2VsZi5wb3N0TWVzc2FnZShWZWN0b3IuZnJvbVNjYWxhcihzdGFydE51bSkpO1xuICAgICAgICAvLyB9LCA1MDApO1xuICAgIH0pO1xufVxuIiwiLy8gaW1wb3J0IFZlY3RvciBmcm9tICcuL3ZlY3Rvcic7XG5cbi8vIG1vZHVsZS5leHBvcnRzID0gKHNlbGY6IGFueSkgPT4ge1xuLy8gICAgIHNlbGYuYWRkRXZlbnRMaXN0ZW5lcignbWVzc2FnZScsIChldjogYW55KSA9PiB7XG4vLyAgICAgICAgIGNvbnN0IHMgPSBldi5kYXRhO1xuLy8gICAgICAgICBjb25zb2xlLmxvZyhzKTtcbi8vICAgICAgICAgLy8gcy5jcmVhdGVBbGxTdHJlYW1saW5lcygpO1xuLy8gICAgICAgICAvLyBzZWxmLnBvc3RNZXNzYWdlKHMuYWxsU3RyZWFtbGluZXNTaW1wbGUpO1xuLy8gICAgICAgICAvLyBzZXRJbnRlcnZhbCgoKSA9PiB7XG4vLyAgICAgICAgIC8vICAgICBzZWxmLnBvc3RNZXNzYWdlKFZlY3Rvci5mcm9tU2NhbGFyKHN0YXJ0TnVtKSk7XG4vLyAgICAgICAgIC8vIH0sIDUwMCk7XG4vLyAgICAgfSk7XG4vLyB9XG4iLCJpbXBvcnQgVmVjdG9yIGZyb20gJy4uLy4uL3ZlY3Rvcic7XG5pbXBvcnQge1N0cmVhbWxpbmVQYXJhbXN9IGZyb20gJy4uL3N0cmVhbWxpbmVzJztcblxuZXhwb3J0IGVudW0gTWVzc2FnZVR5cGUge1xuICAgIEdldE1ham9yUm9hZHMsXG4gICAgQ3JlYXRlTWFqb3JSb2Fkcyxcbn1cblxuLy8gT25seSBjbG9uZWFibGUgb2JqZWN0cyBjYW4gYmUgcGFzc2VkIHRvL2Zyb20gd29ya2VyXG5leHBvcnQgaW50ZXJmYWNlIFdvcmtlck9iamVjdCB7XG4gICAgZ2V0V29ya2VyUGFyYW1zOiAoKSA9PiBhbnk7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgQmFzaXNGaWVsZFBhcmFtcyB7XG4gICAgY2VudHJlOiBWZWN0b3I7XG4gICAgc2l6ZTogbnVtYmVyO1xuICAgIGRlY2F5OiBudW1iZXI7XG59XG5cbmV4cG9ydCBpbnRlcmZhY2UgR3JpZFBhcmFtcyBleHRlbmRzIEJhc2lzRmllbGRQYXJhbXMge1xuICAgIHRoZXRhOiBudW1iZXI7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBpc0dyaWQoZmllbGRQYXJhbXM6IEdyaWRQYXJhbXMgfCBCYXNpc0ZpZWxkUGFyYW1zKTogZmllbGRQYXJhbXMgaXMgR3JpZFBhcmFtcyB7XG4gICAgcmV0dXJuIChmaWVsZFBhcmFtcyBhcyBHcmlkUGFyYW1zKS50aGV0YSAhPT0gdW5kZWZpbmVkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFZlY3RvclBhcmFtcyB7XG4gICAgeDogbnVtYmVyO1xuICAgIHk6IG51bWJlcjtcbn1cblxuZXhwb3J0IGludGVyZmFjZSBTdHJlYW1saW5lc1BhcmFtcyB7XG4gICAgb3JpZ2luOiBWZWN0b3JQYXJhbXM7XG4gICAgd29ybGREaW1lbnNpb25zOiBWZWN0b3JQYXJhbXM7XG4gICAgcGFyYW1zOiBTdHJlYW1saW5lUGFyYW1zO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFN0cmVhbWxpbmVXb3JrZXJQYXJhbXMge1xuICAgIGZpZWxkUGFyYW1zOiBCYXNpc0ZpZWxkUGFyYW1zW107XG4gICAgc3RyZWFtbGluZXNQYXJhbXM6IFN0cmVhbWxpbmVzUGFyYW1zO1xufVxuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBWZWN0b3IgZnJvbSAnLi4vdmVjdG9yJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ2FudmFzV3JhcHBlciB7XG4gICAgcHJpdmF0ZSBjdHg6IENhbnZhc1JlbmRlcmluZ0NvbnRleHQyRDtcbiAgICBcbiAgICBjb25zdHJ1Y3RvcihjYW52YXM6IEhUTUxDYW52YXNFbGVtZW50LCBwcml2YXRlIF93aWR0aDogbnVtYmVyLCBwcml2YXRlIF9oZWlnaHQ6IG51bWJlcikge1xuICAgICAgICB0aGlzLmN0eCA9IGNhbnZhcy5nZXRDb250ZXh0KFwiMmRcIik7XG4gICAgICAgIHRoaXMucmVzaXplQ2FudmFzKCk7XG4gICAgICAgIHRoaXMuc2V0RmlsbFN0eWxlKCdibGFjaycpO1xuICAgICAgICB0aGlzLmNsZWFyQ2FudmFzKCk7XG4gICAgfVxuXG4gICAgZ2V0IHdpZHRoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl93aWR0aDtcbiAgICB9XG5cbiAgICBnZXQgaGVpZ2h0KCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9oZWlnaHQ7XG4gICAgfVxuXG4gICAgc2V0RmlsbFN0eWxlKGNvbG91cjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxTdHlsZSA9IGNvbG91cjtcbiAgICB9XG5cbiAgICBjbGVhckNhbnZhcygpOiB2b2lkIHtcbiAgICAgICAgdGhpcy5kcmF3UmVjdGFuZ2xlKDAsIDAsIHRoaXMuX3dpZHRoLCB0aGlzLl9oZWlnaHQpO1xuICAgIH1cblxuICAgIGRyYXdSZWN0YW5nbGUoeDogbnVtYmVyLCB5OiBudW1iZXIsIHdpZHRoOiBudW1iZXIsIGhlaWdodDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmZpbGxSZWN0KHgsIHksIHdpZHRoLCBoZWlnaHQpO1xuICAgIH1cblxuICAgIGRyYXdTcXVhcmUoY2VudHJlOiBWZWN0b3IsIHJhZGl1czogbnVtYmVyKSB7XG4gICAgICAgIHRoaXMuZHJhd1JlY3RhbmdsZShjZW50cmUueCAtIHJhZGl1cywgY2VudHJlLnkgLSByYWRpdXMsIDIgKiByYWRpdXMsIDIgKiByYWRpdXMpO1xuICAgIH1cblxuICAgIHNldExpbmVXaWR0aCh3aWR0aDogbnVtYmVyKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmxpbmVXaWR0aCA9IHdpZHRoO1xuICAgIH1cblxuICAgIHNldFN0cm9rZVN0eWxlKGNvbG91cjogc3RyaW5nKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LnN0cm9rZVN0eWxlID0gY29sb3VyO1xuICAgIH1cblxuICAgIGRyYXdQb2x5bGluZShsaW5lOiBWZWN0b3JbXSk6IHZvaWQge1xuICAgICAgICBpZiAobGluZS5sZW5ndGggPCAyKSB7XG4gICAgICAgICAgICBsb2cud2FybihcIlRyaWVkIHRvIGRyYXcgcGF0aCBvZiBsZW5ndGggPCAyXCIpO1xuICAgICAgICAgICAgcmV0dXJuO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIHRoaXMuY3R4Lm1vdmVUbyhsaW5lWzBdLngsIGxpbmVbMF0ueSk7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDE7IGkgPCBsaW5lLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICB0aGlzLmN0eC5saW5lVG8obGluZVtpXS54LCBsaW5lW2ldLnkpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5jdHguc3Ryb2tlKCk7XG4gICAgfVxuXG4gICAgcHJpdmF0ZSByZXNpemVDYW52YXMoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuY3R4LmNhbnZhcy53aWR0aCA9IHRoaXMuX3dpZHRoO1xuICAgICAgICB0aGlzLmN0eC5jYW52YXMuaGVpZ2h0ID0gdGhpcy5faGVpZ2h0O1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgVmVjdG9yIGZyb20gJy4uL3ZlY3Rvcic7XG5cbi8qKlxuICogU2luZ2xldG9uXG4gKiBDb250cm9scyBwYW5uaW5nIGFuZCB6b29taW5nXG4gKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERvbWFpbkNvbnRyb2xsZXIge1xuICAgIHByaXZhdGUgc3RhdGljIGluc3RhbmNlOiBEb21haW5Db250cm9sbGVyO1xuXG4gICAgLy8gTG9jYXRpb24gb2Ygc2NyZWVuIG9yaWdpbiBpbiB3b3JsZCBzcGFjZVxuICAgIHByaXZhdGUgX29yaWdpbjogVmVjdG9yID0gVmVjdG9yLnplcm9WZWN0b3IoKTtcbiAgICBcbiAgICAvLyBTY3JlZW4tc3BhY2Ugd2lkdGggYW5kIGhlaWdodFxuICAgIHByaXZhdGUgX3NjcmVlbkRpbWVuc2lvbnM6IFZlY3RvcjtcblxuICAgIC8vIFJhdGlvIG9mIHNjcmVlbiBwaXhlbHMgdG8gd29ybGQgcGl4ZWxzXG4gICAgcHJpdmF0ZSBfem9vbTogbnVtYmVyID0gMTtcblxuICAgIHByaXZhdGUgY29uc3RydWN0b3Ioc2NyZWVuRGltZW5zaW9ucz86IFZlY3Rvcikge1xuICAgICAgICBpZiAoc2NyZWVuRGltZW5zaW9ucykge1xuICAgICAgICAgICAgdGhpcy5fc2NyZWVuRGltZW5zaW9ucyA9IHNjcmVlbkRpbWVuc2lvbnMuY2xvbmUoKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHB1YmxpYyBzdGF0aWMgZ2V0SW5zdGFuY2Uoc2NyZWVuRGltZW5zaW9ucz86IFZlY3Rvcik6IERvbWFpbkNvbnRyb2xsZXIge1xuICAgICAgICBpZiAoIURvbWFpbkNvbnRyb2xsZXIuaW5zdGFuY2UpIHtcbiAgICAgICAgICAgIERvbWFpbkNvbnRyb2xsZXIuaW5zdGFuY2UgPSBuZXcgRG9tYWluQ29udHJvbGxlcihzY3JlZW5EaW1lbnNpb25zKTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gRG9tYWluQ29udHJvbGxlci5pbnN0YW5jZTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBAcGFyYW0ge1ZlY3Rvcn0gZGVsdGEgaW4gd29ybGQgc3BhY2VcbiAgICAgKi9cbiAgICBwYW4oZGVsdGE6IFZlY3Rvcikge1xuICAgICAgICB0aGlzLl9vcmlnaW4uc3ViKGRlbHRhKTtcbiAgICB9XG5cbiAgICBnZXQgb3JpZ2luKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLl9vcmlnaW4uY2xvbmUoKTtcbiAgICB9XG5cbiAgICBnZXQgem9vbSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy5fem9vbTtcbiAgICB9XG5cbiAgICBnZXQgc2NyZWVuRGltZW5zaW9ucygpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5fc2NyZWVuRGltZW5zaW9ucy5jbG9uZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEByZXR1cm4ge1ZlY3Rvcn0gd29ybGQtc3BhY2Ugdy9oIHZpc2libGUgb24gc2NyZWVuXG4gICAgICovXG4gICAgZ2V0IHdvcmxkRGltZW5zaW9ucygpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5zY3JlZW5EaW1lbnNpb25zLmRpdmlkZVNjYWxhcih0aGlzLl96b29tKTtcbiAgICB9XG5cbiAgICBzZXQgc2NyZWVuRGltZW5zaW9ucyh2OiBWZWN0b3IpIHtcbiAgICAgICAgdGhpcy5fc2NyZWVuRGltZW5zaW9ucy5jb3B5KHYpO1xuICAgIH1cblxuICAgIHNldCB6b29tKHo6IG51bWJlcikge1xuICAgICAgICBpZiAoeiA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IG9sZFdvcmxkU3BhY2VNaWRwb2ludCA9IHRoaXMub3JpZ2luLmFkZCh0aGlzLndvcmxkRGltZW5zaW9ucy5kaXZpZGVTY2FsYXIoMikpO1xuICAgICAgICAgICAgdGhpcy5fem9vbSA9IHo7XG4gICAgICAgICAgICBjb25zdCBuZXdXb3JsZFNwYWNlTWlkcG9pbnQgPSB0aGlzLm9yaWdpbi5hZGQodGhpcy53b3JsZERpbWVuc2lvbnMuZGl2aWRlU2NhbGFyKDIpKTtcbiAgICAgICAgICAgIHRoaXMucGFuKG5ld1dvcmxkU3BhY2VNaWRwb2ludC5zdWIob2xkV29ybGRTcGFjZU1pZHBvaW50KSk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBFZGl0cyB2ZWN0b3JcbiAgICAgKi9cbiAgICB6b29tVG9Xb3JsZCh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdi5kaXZpZGVTY2FsYXIodGhpcy5fem9vbSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRWRpdHMgdmVjdG9yXG4gICAgICovXG4gICAgem9vbVRvU2NyZWVuKHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB2Lm11bHRpcGx5U2NhbGFyKHRoaXMuX3pvb20pO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEVkaXRzIHZlY3RvclxuICAgICAqL1xuICAgIHNjcmVlblRvV29ybGQodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuem9vbVRvV29ybGQodikuYWRkKHRoaXMuX29yaWdpbik7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogRWRpdHMgdmVjdG9yXG4gICAgICovXG4gICAgd29ybGRUb1NjcmVlbih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy56b29tVG9TY3JlZW4odi5zdWIodGhpcy5fb3JpZ2luKSk7XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCBpbnRlcmFjdCBmcm9tICdpbnRlcmFjdGpzJztcbmltcG9ydCBVdGlsIGZyb20gJy4uL3V0aWwnO1xuaW1wb3J0IFZlY3RvciBmcm9tICcuLi9WZWN0b3InO1xuaW1wb3J0IERvbWFpbkNvbnRyb2xsZXIgZnJvbSAnLi9kb21haW5fY29udHJvbGxlcic7XG5cbmludGVyZmFjZSBEcmFnZ2FibGUge1xuICAgIGdldENlbnRyZTogKCgpID0+IFZlY3Rvcik7XG4gICAgY2FsbGJhY2tGbjogKCh2OiBWZWN0b3IpID0+IHZvaWQpO1xufVxuXG4vKipcbiogUmVnaXN0ZXIgbXVsdGlwbGUgY2VudHJlIHBvaW50c1xuKiBDbG9zZXN0IG9uZSB0byBtb3VzZSBjbGljayB3aWxsIGJlIHNlbGVjdGVkIHRvIGRyYWdcbiogVXAgdG8gY2FsbGVyIHRvIGFjdHVhbGx5IG1vdmUgdGhlaXIgY2VudHJlIHBvaW50IHZpYSBjYWxsYmFja1xuKi9cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIERyYWdDb250cm9sbGVyIHtcbiAgICAvLyBIb3cgY2xvc2UgdG8gZHJhZyBoYW5kbGUgcG9pbnRlciBuZWVkcyB0byBiZVxuICAgIHByaXZhdGUgcmVhZG9ubHkgTUlOX0RSQUdfRElTVEFOQ0UgPSA1MDtcblxuICAgIHByaXZhdGUgZHJhZ2dhYmxlczogRHJhZ2dhYmxlW10gPSBbXTtcbiAgICBwcml2YXRlIGN1cnJlbnRseURyYWdnaW5nOiBEcmFnZ2FibGUgPSBudWxsO1xuICAgIHByaXZhdGUgZGlzYWJsZWQ6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGRvbWFpbkNvbnRyb2xsZXIgPSBEb21haW5Db250cm9sbGVyLmdldEluc3RhbmNlKCk7XG5cbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIGd1aTogZGF0LkdVSSkge1xuICAgICAgICBpbnRlcmFjdChgIyR7VXRpbC5DQU5WQVNfSUR9YCkuZHJhZ2dhYmxlKHtcbiAgICAgICAgICAgIG9uc3RhcnQ6IHRoaXMuZHJhZ1N0YXJ0LmJpbmQodGhpcyksXG4gICAgICAgICAgICBvbm1vdmU6IHRoaXMuZHJhZ01vdmUuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIG9uZW5kOiB0aGlzLmRyYWdFbmQuYmluZCh0aGlzKSxcbiAgICAgICAgICAgIGN1cnNvckNoZWNrZXI6IHRoaXMuZ2V0Q3Vyc29yLmJpbmQodGhpcyksXG4gICAgICAgIH0pO1xuICAgIH1cblxuICAgIHNldERyYWdEaXNhYmxlZChkaXNhYmxlOiBib29sZWFuKTogdm9pZCB7XG4gICAgICAgIHRoaXMuZGlzYWJsZWQgPSBkaXNhYmxlO1xuICAgIH1cblxuICAgIGdldEN1cnNvcihhY3Rpb246IGFueSwgaW50ZXJhY3RhYmxlOiBhbnksIGVsZW1lbnQ6IGFueSwgaW50ZXJhY3Rpbmc6IGJvb2xlYW4pIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybiAnZGVmYXVsdCc7XG4gICAgICAgIGlmIChpbnRlcmFjdGluZykgcmV0dXJuICdncmFiYmluZyc7XG4gICAgICAgIHJldHVybiAnZ3JhYic7XG4gICAgfVxuXG4gICAgZHJhZ1N0YXJ0KGV2ZW50OiBhbnkpOiB2b2lkIHtcbiAgICAgICAgaWYgKHRoaXMuZGlzYWJsZWQpIHJldHVybjtcblxuICAgICAgICAvLyBUcmFuc2Zvcm0gc2NyZWVuIHNwYWNlIHRvIHdvcmxkIHNwYWNlXG4gICAgICAgIGNvbnN0IG9yaWdpbiA9IHRoaXMuZG9tYWluQ29udHJvbGxlci5zY3JlZW5Ub1dvcmxkKG5ldyBWZWN0b3IoZXZlbnQueDAsIGV2ZW50LnkwKSk7XG4gICAgICAgIFxuICAgICAgICBsZXQgY2xvc2VzdERpc3RhbmNlID0gSW5maW5pdHk7XG4gICAgICAgIHRoaXMuZHJhZ2dhYmxlcy5mb3JFYWNoKGRyYWdnYWJsZSA9PiB7XG4gICAgICAgICAgICBjb25zdCBkID0gZHJhZ2dhYmxlLmdldENlbnRyZSgpLmRpc3RhbmNlVG8ob3JpZ2luKTtcbiAgICAgICAgICAgIGlmIChkIDwgY2xvc2VzdERpc3RhbmNlKSB7XG4gICAgICAgICAgICAgICAgY2xvc2VzdERpc3RhbmNlID0gZDtcbiAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnRseURyYWdnaW5nID0gZHJhZ2dhYmxlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcblxuICAgICAgICAvLyBab29tIHNjcmVlbiBzaXplIHRvIHdvcmxkIHNpemUgZm9yIGNvbnNpc3RlbnQgZHJhZyBkaXN0YW5jZSB3aGlsZSB6b29tZWQgaW5cbiAgICAgICAgY29uc3Qgc2NhbGVkRHJhZ0Rpc3RhbmNlID0gdGhpcy5NSU5fRFJBR19ESVNUQU5DRSAvIHRoaXMuZG9tYWluQ29udHJvbGxlci56b29tO1xuXG4gICAgICAgIGlmIChjbG9zZXN0RGlzdGFuY2UgPiBzY2FsZWREcmFnRGlzdGFuY2UpIHtcbiAgICAgICAgICAgIHRoaXMuY3VycmVudGx5RHJhZ2dpbmcgPSBudWxsO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgZHJhZ01vdmUoZXZlbnQ6IGFueSk6IHZvaWQge1xuICAgICAgICBpZiAodGhpcy5kaXNhYmxlZCkgcmV0dXJuO1xuXG4gICAgICAgIGNvbnN0IGRlbHRhID0gbmV3IFZlY3RvcihldmVudC5kZWx0YS54LCBldmVudC5kZWx0YS55KTtcbiAgICAgICAgdGhpcy5kb21haW5Db250cm9sbGVyLnpvb21Ub1dvcmxkKGRlbHRhKTtcblxuICAgICAgICBpZiAodGhpcy5jdXJyZW50bHlEcmFnZ2luZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gRHJhZyBmaWVsZFxuICAgICAgICAgICAgdGhpcy5jdXJyZW50bHlEcmFnZ2luZy5jYWxsYmFja0ZuKGRlbHRhKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIC8vIE1vdmUgbWFwXG4gICAgICAgICAgICB0aGlzLmRvbWFpbkNvbnRyb2xsZXIucGFuKGRlbHRhKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGRyYWdFbmQoKTogdm9pZCB7XG4gICAgICAgIGlmICh0aGlzLmRpc2FibGVkKSByZXR1cm47XG4gICAgICAgIHRoaXMuY3VycmVudGx5RHJhZ2dpbmcgPSBudWxsO1xuICAgICAgICBVdGlsLnVwZGF0ZUd1aSh0aGlzLmd1aSk7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogQHBhcmFtIHsoKCkgPT4gVmVjdG9yKX0gR2V0cyBjZW50cmUgcG9pbnRcbiAgICAgKiBAcGFyYW0geygodjogVmVjdG9yKSA9PiB2b2lkKX0gQ2FsbGVkIG9uIG1vdmUgd2l0aCBkZWx0YSB2ZWN0b3JcbiAgICAgKiBAcmV0dXJucyB7KCgpID0+IHZvaWQpfSBGdW5jdGlvbiB0byBkZXJlZ2lzdGVyIGNhbGxiYWNrXG4gICAgICovXG4gICAgcmVnaXN0ZXIoZ2V0Q2VudHJlOiAoKCkgPT4gVmVjdG9yKSxcbiAgICAgICAgICAgICBvbk1vdmU6ICgodjogVmVjdG9yKSA9PiB2b2lkKSk6ICgoKSA9PiB2b2lkKSB7XG4gICAgICAgIGNvbnN0IGRyYWdnYWJsZTogRHJhZ2dhYmxlID0ge1xuICAgICAgICAgICAgZ2V0Q2VudHJlOiBnZXRDZW50cmUsXG4gICAgICAgICAgICBjYWxsYmFja0ZuOiBvbk1vdmUsXG4gICAgICAgIH07XG5cbiAgICAgICAgdGhpcy5kcmFnZ2FibGVzLnB1c2goZHJhZ2dhYmxlKTtcbiAgICAgICAgcmV0dXJuICgoKTogdm9pZCA9PiB7XG4gICAgICAgICAgICBjb25zdCBpbmRleCA9IHRoaXMuZHJhZ2dhYmxlcy5pbmRleE9mKGRyYWdnYWJsZSk7XG4gICAgICAgICAgICBpZiAoaW5kZXggPj0gMCkge1xuICAgICAgICAgICAgICAgIHRoaXMuZHJhZ2dhYmxlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KS5iaW5kKHRoaXMpO1xuICAgIH1cbn1cbiIsImltcG9ydCAqIGFzIGxvZyBmcm9tICdsb2dsZXZlbCc7XG5pbXBvcnQgRHJhZ0NvbnRyb2xsZXIgZnJvbSAnLi9kcmFnX2NvbnRyb2xsZXInO1xuaW1wb3J0IFRlbnNvckZpZWxkIGZyb20gJy4uL2ltcGwvdGVuc29yX2ZpZWxkJztcbmltcG9ydCB7R3JpZCwgUmFkaWFsLCBCYXNpc0ZpZWxkfSBmcm9tICcuLi9pbXBsL2Jhc2lzX2ZpZWxkJztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgVGVuc29yRmllbGRJbnRlcmZhY2UgZXh0ZW5kcyBUZW5zb3JGaWVsZCB7XG4gICAgY29uc3RydWN0b3IocHJpdmF0ZSBndWlGb2xkZXI6IGRhdC5HVUksIHByaXZhdGUgZHJhZ0NvbnRyb2xsZXI6IERyYWdDb250cm9sbGVyKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgfVxuXG4gICAgcHJvdGVjdGVkIGFkZEZpZWxkKGZpZWxkOiBCYXNpc0ZpZWxkKTogdm9pZCB7XG4gICAgICAgIHN1cGVyLmFkZEZpZWxkKGZpZWxkKTtcbiAgICAgICAgY29uc3QgZm9sZGVyID0gdGhpcy5ndWlGb2xkZXIuYWRkRm9sZGVyKGAke2ZpZWxkLkZPTERFUl9OQU1FfWApO1xuICAgICAgICBcbiAgICAgICAgLy8gRnVuY3Rpb24gdG8gZGVyZWdpc3RlciBmcm9tIGRyYWcgY29udHJvbGxlclxuICAgICAgICBjb25zdCBkZXJlZ2lzdGVyRHJhZyA9IHRoaXMuZHJhZ0NvbnRyb2xsZXIucmVnaXN0ZXIoXG4gICAgICAgICAgICAoKSA9PiBmaWVsZC5jZW50cmUsIGZpZWxkLmRyYWdNb3ZlTGlzdGVuZXIuYmluZChmaWVsZCkpO1xuICAgICAgICBjb25zdCByZW1vdmVGaWVsZE9iaiA9IHtyZW1vdmU6ICgpOiB2b2lkID0+IHRoaXMucmVtb3ZlRmllbGRHVUkuYmluZCh0aGlzKShmaWVsZCwgZm9sZGVyLCBkZXJlZ2lzdGVyRHJhZyl9O1xuICAgICAgICBcbiAgICAgICAgLy8gR2l2ZSBkYXQgZ3VpIHJlbW92ZUZpZWxkIGJ1dHRvblxuICAgICAgICBmb2xkZXIuYWRkKHJlbW92ZUZpZWxkT2JqLCAncmVtb3ZlJyk7XG4gICAgICAgIGZpZWxkLnNldEd1aShmb2xkZXIpO1xuICAgIH1cblxuICAgIHJlbW92ZUZpZWxkR1VJKGZpZWxkOiBCYXNpc0ZpZWxkLCBmb2xkZXI6IGRhdC5HVUksIGRlcmVnaXN0ZXJEcmFnOiAoKCkgPT4gdm9pZCkpOiB2b2lkIHtcbiAgICAgICAgc3VwZXIucmVtb3ZlRmllbGQoZmllbGQpO1xuICAgICAgICB0aGlzLmd1aUZvbGRlci5yZW1vdmVGb2xkZXIoZm9sZGVyKTtcbiAgICAgICAgLy8gRGVyZWdpc3RlciBmcm9tIGRyYWcgY29udHJvbGxlclxuICAgICAgICBkZXJlZ2lzdGVyRHJhZygpO1xuICAgIH1cbn1cbiIsImV4cG9ydCBkZWZhdWx0IGNsYXNzIFV0aWwge1xuICAgIHN0YXRpYyByZWFkb25seSBDQU5WQVNfSUQ6IHN0cmluZyA9ICdtYXAtY2FudmFzJztcblxuICAgIHN0YXRpYyB1cGRhdGVHdWkoZ3VpOiBkYXQuR1VJKTogdm9pZCB7XG4gICAgICAgIGlmIChndWkuX19jb250cm9sbGVycykge1xuICAgICAgICAgICAgZ3VpLl9fY29udHJvbGxlcnMuZm9yRWFjaChjID0+IGMudXBkYXRlRGlzcGxheSgpKTsgICAgXG4gICAgICAgIH1cbiAgICAgICAgaWYgKGd1aS5fX2ZvbGRlcnMpIHtcbiAgICAgICAgICAgIGZvciAobGV0IGZvbGRlck5hbWUgaW4gZ3VpLl9fZm9sZGVycykge1xuICAgICAgICAgICAgICAgIHRoaXMudXBkYXRlR3VpKGd1aS5fX2ZvbGRlcnNbZm9sZGVyTmFtZV0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxufVxuIiwiaW1wb3J0ICogYXMgbG9nIGZyb20gJ2xvZ2xldmVsJztcbmltcG9ydCB7VmVjdG9yUGFyYW1zLCBXb3JrZXJPYmplY3R9IGZyb20gJy4vaW1wbC93b3JrZXIvd29ya2VyX3BhcmFtcyc7XG5cbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFZlY3RvciBpbXBsZW1lbnRzIFdvcmtlck9iamVjdCB7XG4gICAgY29uc3RydWN0b3IocHVibGljIHg6IG51bWJlciwgcHVibGljIHk6IG51bWJlcikge31cblxuICAgIHN0YXRpYyB6ZXJvVmVjdG9yKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKDAsIDApO1xuICAgIH1cblxuICAgIHN0YXRpYyBmcm9tU2NhbGFyKHM6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiBuZXcgVmVjdG9yKHMsIHMpO1xuICAgIH1cblxuICAgIGFkZCh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggKz0gdi54O1xuICAgICAgICB0aGlzLnkgKz0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmdsZSBpbiByYWRpYW5zIHRvIHBvc2l0aXZlIHgtYXhpcyBiZXR3ZWVuIC1waSBhbmQgcGlcbiAgICAgKi9cbiAgICBhbmdsZSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5hdGFuMih0aGlzLnksIHRoaXMueCk7XG4gICAgfVxuXG4gICAgY2xvbmUoKTogVmVjdG9yIHtcbiAgICAgICAgcmV0dXJuIG5ldyBWZWN0b3IodGhpcy54LCB0aGlzLnkpO1xuICAgIH1cblxuICAgIGNvcHkodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIGNyb3NzKHY6IFZlY3Rvcik6IG51bWJlciB7XG4gICAgICAgIHJldHVybiB0aGlzLnggKiB2LnkgLSB0aGlzLnkgKiB2Lng7XG4gICAgfVxuXG4gICAgZGlzdGFuY2VUbyh2OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gTWF0aC5zcXJ0KHRoaXMuZGlzdGFuY2VUb1NxdWFyZWQodikpO1xuICAgIH1cblxuICAgIGRpc3RhbmNlVG9TcXVhcmVkICh2OiBWZWN0b3IpOiBudW1iZXIge1xuICAgICAgICBjb25zdCBkeCA9IHRoaXMueCAtIHYueFxuICAgICAgICBjb25zdCBkeSA9IHRoaXMueSAtIHYueTtcbiAgICAgICAgcmV0dXJuIGR4ICogZHggKyBkeSAqIGR5O1xuICAgIH1cblxuICAgIGRpdmlkZSh2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICBpZiAodi54ID09PSAwIHx8IHYueSA9PT0gMCkge1xuICAgICAgICAgICAgbG9nLndhcm4oXCJEaXZpc2lvbiBieSB6ZXJvXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLnggLz0gdi54O1xuICAgICAgICB0aGlzLnkgLz0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBkaXZpZGVTY2FsYXIoczogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgaWYgKHMgPT09IDApIHtcbiAgICAgICAgICAgIGxvZy53YXJuKFwiRGl2aXNpb24gYnkgemVyb1wiKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKDEgLyBzKTtcbiAgICB9XG5cbiAgICBkb3QodjogVmVjdG9yKTogbnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMueCAqIHYueCArIHRoaXMueSAqIHYueTtcbiAgICB9XG5cbiAgICBlcXVhbHModjogVmVjdG9yKTogYm9vbGVhbiB7XG4gICAgICAgIHJldHVybiAoKHYueCA9PT0gdGhpcy54KSAmJiAodi55ID09PSB0aGlzLnkpKTtcbiAgICB9XG5cbiAgICBnZXRXb3JrZXJQYXJhbXMoKTogVmVjdG9yUGFyYW1zIHtcbiAgICAgICAgcmV0dXJuIHt4OiB0aGlzLngsIHk6IHRoaXMueX07XG4gICAgfVxuXG4gICAgbGVuZ3RoKCk6IG51bWJlciB7XG4gICAgICAgIHJldHVybiBNYXRoLnNxcnQodGhpcy5sZW5ndGhTcSgpKTtcbiAgICB9XG5cbiAgICBsZW5ndGhTcSgpOiBudW1iZXIge1xuICAgICAgICByZXR1cm4gdGhpcy54ICogdGhpcy54ICsgdGhpcy55ICogdGhpcy55O1xuICAgIH1cblxuICAgIG11bGl0cGx5KHY6IFZlY3Rvcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCAqPSB2Lng7XG4gICAgICAgIHRoaXMueSAqPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIG11bHRpcGx5U2NhbGFyKHM6IG51bWJlcik6IFZlY3RvciB7XG4gICAgICAgIHRoaXMueCAqPSBzO1xuICAgICAgICB0aGlzLnkgKj0gcztcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfVxuXG4gICAgbmVnYXRlKCk6IFZlY3RvciB7XG4gICAgICAgIHJldHVybiB0aGlzLm11bHRpcGx5U2NhbGFyKC0xKTtcbiAgICB9XG5cbiAgICBub3JtYWxpemUoKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgbCA9IHRoaXMubGVuZ3RoKCk7XG4gICAgICAgIGlmIChsID09PSAwKSB7XG4gICAgICAgICAgICBsb2cud2FybihcIlplcm8gVmVjdG9yXCIpO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIHJldHVybiB0aGlzLmRpdmlkZVNjYWxhcih0aGlzLmxlbmd0aCgpKTtcbiAgICB9XG5cbiAgICAvKipcbiAgICAgKiBBbmdsZSBpbiByYWRpYW5zXG4gICAgICovXG4gICAgcm90YXRlQXJvdW5kKGNlbnRlcjogVmVjdG9yLCBhbmdsZTogbnVtYmVyKTogVmVjdG9yIHtcbiAgICAgICAgY29uc3QgY29zID0gTWF0aC5jb3MoYW5nbGUpXG4gICAgICAgIGNvbnN0IHNpbiA9IE1hdGguc2luKGFuZ2xlKTtcblxuICAgICAgICBjb25zdCB4ID0gdGhpcy54IC0gY2VudGVyLng7XG4gICAgICAgIGNvbnN0IHkgPSB0aGlzLnkgLSBjZW50ZXIueTtcblxuICAgICAgICB0aGlzLnggPSB4ICogY29zIC0geSAqIHNpbiArIGNlbnRlci54O1xuICAgICAgICB0aGlzLnkgPSB4ICogc2luICsgeSAqIGNvcyArIGNlbnRlci55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG5cbiAgICBzZXQodjogVmVjdG9yKTogVmVjdG9yIHtcbiAgICAgICAgdGhpcy54ID0gdi54O1xuICAgICAgICB0aGlzLnkgPSB2Lnk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cblxuICAgIHNldExlbmd0aCAobGVuZ3RoOiBudW1iZXIpOiBWZWN0b3Ige1xuICAgICAgICByZXR1cm4gdGhpcy5ub3JtYWxpemUoKS5tdWx0aXBseVNjYWxhcihsZW5ndGgpO1xuICAgIH1cblxuICAgIHN1Yih2OiBWZWN0b3IpOiBWZWN0b3Ige1xuICAgICAgICB0aGlzLnggLT0gdi54O1xuICAgICAgICB0aGlzLnkgLT0gdi55O1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9XG59XG4iLCIiXX0=
