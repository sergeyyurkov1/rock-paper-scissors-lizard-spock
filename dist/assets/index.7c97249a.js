var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => {
  __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
  return value;
};
(function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script) {
    const fetchOpts = {};
    if (script.integrity)
      fetchOpts.integrity = script.integrity;
    if (script.referrerpolicy)
      fetchOpts.referrerPolicy = script.referrerpolicy;
    if (script.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link) {
    if (link.ep)
      return;
    link.ep = true;
    const fetchOpts = getFetchOpts(link);
    fetch(link.href, fetchOpts);
  }
})();
function makeMap(str, expectsLowerCase) {
  const map = /* @__PURE__ */ Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map[val.toLowerCase()] : (val) => !!map[val];
}
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray$1(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString$2(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString$2(value)) {
    return value;
  } else if (isObject$1(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString$2(value)) {
    res = value;
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject$1(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
const toDisplayString = (val) => {
  return isString$2(val) ? val : val == null ? "" : isArray$1(val) || isObject$1(val) && (val.toString === objectToString || !isFunction(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject$1(val) && !isArray$1(val) && !isPlainObject$1(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el) => {
  const i = arr.indexOf(el);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray$1 = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isFunction = (val) => typeof val === "function";
const isString$2 = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject$1 = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject$1(val) && isFunction(val.then) && isFunction(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject$1 = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString$2(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(
  ",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted"
);
const cacheStringFunction = (fn) => {
  const cache = /* @__PURE__ */ Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c2) => c2 ? c2.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn) {
    if (this.active) {
      const currentEffectScope = activeEffectScope;
      try {
        activeEffectScope = this;
        return fn();
      } finally {
        activeEffectScope = currentEffectScope;
      }
    }
  }
  on() {
    activeEffectScope = this;
  }
  off() {
    activeEffectScope = this.parent;
  }
  stop(fromParent) {
    if (this.active) {
      let i, l;
      for (i = 0, l = this.effects.length; i < l; i++) {
        this.effects[i].stop();
      }
      for (i = 0, l = this.cleanups.length; i < l; i++) {
        this.cleanups[i]();
      }
      if (this.scopes) {
        for (i = 0, l = this.scopes.length; i < l; i++) {
          this.scopes[i].stop(true);
        }
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect, scope = activeEffectScope) {
  if (scope && scope.active) {
    scope.effects.push(effect);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect) => {
  const { deps } = effect;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = /* @__PURE__ */ new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn, scheduler = null, scope) {
    this.fn = fn;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    this.parent = void 0;
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    let parent = activeEffect;
    let lastShouldTrack = shouldTrack;
    while (parent) {
      if (parent === this) {
        return;
      }
      parent = parent.parent;
    }
    try {
      this.parent = activeEffect;
      activeEffect = this;
      shouldTrack = true;
      trackOpBit = 1 << ++effectTrackDepth;
      if (effectTrackDepth <= maxMarkerBits) {
        initDepMarkers(this);
      } else {
        cleanupEffect(this);
      }
      return this.fn();
    } finally {
      if (effectTrackDepth <= maxMarkerBits) {
        finalizeDepMarkers(this);
      }
      trackOpBit = 1 << --effectTrackDepth;
      activeEffect = this.parent;
      shouldTrack = lastShouldTrack;
      this.parent = void 0;
      if (this.deferStop) {
        this.stop();
      }
    }
  }
  stop() {
    if (activeEffect === this) {
      this.deferStop = true;
    } else if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect) {
  const { deps } = effect;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect);
    }
    deps.length = 0;
  }
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target, type, key) {
  if (shouldTrack && activeEffect) {
    let depsMap = targetMap.get(target);
    if (!depsMap) {
      targetMap.set(target, depsMap = /* @__PURE__ */ new Map());
    }
    let dep = depsMap.get(key);
    if (!dep) {
      depsMap.set(key, dep = createDep());
    }
    trackEffects(dep);
  }
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger(target, type, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray$1(target)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type) {
      case "add":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray$1(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  const effects = isArray$1(dep) ? dep : [...dep];
  for (const effect of effects) {
    if (effect.computed) {
      triggerEffect(effect);
    }
  }
  for (const effect of effects) {
    if (!effect.computed) {
      triggerEffect(effect);
    }
  }
}
function triggerEffect(effect, debuggerEventExtraInfo) {
  if (effect !== activeEffect || effect.allowRecurse) {
    if (effect.scheduler) {
      effect.scheduler();
    } else {
      effect.run();
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(
  /* @__PURE__ */ Object.getOwnPropertyNames(Symbol).filter((key) => key !== "arguments" && key !== "caller").map((key) => Symbol[key]).filter(isSymbol)
);
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target)) {
      return target;
    }
    const targetIsArray = isArray$1(target);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      return targetIsArray && isIntegerKey(key) ? res : res.value;
    }
    if (isObject$1(res)) {
      return isReadonly2 ? readonly(res) : reactive(res);
    }
    return res;
  };
}
const set$1 = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target, key, value, receiver) {
    let oldValue = target[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow) {
      if (!isShallow(value) && !isReadonly(value)) {
        oldValue = toRaw(oldValue);
        value = toRaw(value);
      }
      if (!isArray$1(target) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray$1(target) && isIntegerKey(key) ? Number(key) < target.length : hasOwn(target, key);
    const result = Reflect.set(target, key, value, receiver);
    if (target === toRaw(receiver)) {
      if (!hadKey) {
        trigger(target, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger(target, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target, key) {
  const hadKey = hasOwn(target, key);
  target[key];
  const result = Reflect.deleteProperty(target, key);
  if (result && hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function has(target, key) {
  const result = Reflect.has(target, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target, "has", key);
  }
  return result;
}
function ownKeys(target) {
  track(target, "iterate", isArray$1(target) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target);
}
const mutableHandlers = {
  get,
  set: set$1,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target, key) {
    return true;
  },
  deleteProperty(target, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target, key, isReadonly2 = false, isShallow2 = false) {
  target = target["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "get", key);
    }
    track(rawTarget, "get", rawKey);
  }
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target.get(rawKey));
  } else if (target !== rawTarget) {
    target.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target = this["__v_raw"];
  const rawTarget = toRaw(target);
  const rawKey = toRaw(key);
  if (!isReadonly2) {
    if (key !== rawKey) {
      track(rawTarget, "has", key);
    }
    track(rawTarget, "has", rawKey);
  }
  return key === rawKey ? target.has(key) : target.has(key) || target.has(rawKey);
}
function size(target, isReadonly2 = false) {
  target = target["__v_raw"];
  !isReadonly2 && track(toRaw(target), "iterate", ITERATE_KEY);
  return Reflect.get(target, "size", target);
}
function add(value) {
  value = toRaw(value);
  const target = toRaw(this);
  const proto = getProto(target);
  const hadKey = proto.has.call(target, value);
  if (!hadKey) {
    target.add(value);
    trigger(target, "add", value, value);
  }
  return this;
}
function set$1$1(key, value) {
  value = toRaw(value);
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  const oldValue = get2.call(target, key);
  target.set(key, value);
  if (!hadKey) {
    trigger(target, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger(target, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target = toRaw(this);
  const { has: has2, get: get2 } = getProto(target);
  let hadKey = has2.call(target, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target, key);
  }
  get2 ? get2.call(target, key) : void 0;
  const result = target.delete(key);
  if (hadKey) {
    trigger(target, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target = toRaw(this);
  const hadItems = target.size !== 0;
  const result = target.clear();
  if (hadItems) {
    trigger(target, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target = observed["__v_raw"];
    const rawTarget = toRaw(target);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target = this["__v_raw"];
    const rawTarget = toRaw(target);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type) {
  return function(...args) {
    return type === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target ? instrumentations : target, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const reactiveMap = /* @__PURE__ */ new WeakMap();
const shallowReactiveMap = /* @__PURE__ */ new WeakMap();
const readonlyMap = /* @__PURE__ */ new WeakMap();
const shallowReadonlyMap = /* @__PURE__ */ new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive(target) {
  if (isReadonly(target)) {
    return target;
  }
  return createReactiveObject(target, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target) {
  return createReactiveObject(target, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target) {
  return createReactiveObject(target, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function createReactiveObject(target, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject$1(target)) {
    return target;
  }
  if (target["__v_raw"] && !(isReadonly2 && target["__v_isReactive"])) {
    return target;
  }
  const existingProxy = proxyMap.get(target);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target);
  if (targetType === 0) {
    return target;
  }
  const proxy = new Proxy(target, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject$1(value) ? reactive(value) : value;
const toReadonly = (value) => isObject$1(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (shouldTrack && activeEffect) {
    ref2 = toRaw(ref2);
    {
      trackEffects(ref2.dep || (ref2.dep = createDep()));
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return !!(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    const useDirectValue = this.__v_isShallow || isShallow(newVal) || isReadonly(newVal);
    newVal = useDirectValue ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = useDirectValue ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target, key, receiver) => unref(Reflect.get(target, key, receiver)),
  set: (target, key, value, receiver) => {
    const oldValue = target[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
function toRefs(object) {
  const ret = isArray$1(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}
var _a$1;
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this[_a$1] = false;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
_a$1 = "__v_isReadonly";
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
function callWithErrorHandling(fn, instance, type, args) {
  let res;
  try {
    res = args ? fn(...args) : fn();
  } catch (err) {
    handleError(err, instance, type);
  }
  return res;
}
function callWithAsyncErrorHandling(fn, instance, type, args) {
  if (isFunction(fn)) {
    const res = callWithErrorHandling(fn, instance, type, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn.length; i++) {
    values.push(callWithAsyncErrorHandling(fn[i], instance, type, args));
  }
  return values;
}
function handleError(err, instance, type, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type, contextVNode, throwInDev);
}
function logError(err, type, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = /* @__PURE__ */ Promise.resolve();
let currentFlushPromise = null;
function nextTick(fn) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn ? p2.then(this ? fn.bind(this) : fn) : p2;
}
function findInsertionIndex(id) {
  let start = flushIndex + 1;
  let end = queue.length;
  while (start < end) {
    const middle = start + end >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start = middle + 1 : end = middle;
  }
  return start;
}
function queueJob(job) {
  if (!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queuePostFlushCb(cb2) {
  if (!isArray$1(cb2)) {
    if (!activePostFlushCbs || !activePostFlushCbs.includes(cb2, cb2.allowRecurse ? postFlushIndex + 1 : postFlushIndex)) {
      pendingPostFlushCbs.push(cb2);
    }
  } else {
    pendingPostFlushCbs.push(...cb2);
  }
  queueFlush();
}
function flushPreFlushCbs(seen, i = flushIndex) {
  for (; i < queue.length; i++) {
    const cb2 = queue[i];
    if (cb2 && cb2.pre) {
      queue.splice(i, 1);
      i--;
      cb2();
    }
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a2, b2) => getId(a2) - getId(b2));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
const comparator = (a2, b2) => {
  const diff = getId(a2) - getId(b2);
  if (diff === 0) {
    if (a2.pre && !b2.pre)
      return -1;
    if (b2.pre && !a2.pre)
      return 1;
  }
  return diff;
};
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  queue.sort(comparator);
  const check = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPostFlushCbs.length) {
      flushJobs();
    }
  }
}
function emit$1(instance, event, ...rawArgs) {
  if (instance.isUnmounted)
    return;
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number: number2, trim } = props[modifiersKey] || EMPTY_OBJ;
    if (trim) {
      args = rawArgs.map((a2) => a2.trim());
    }
    if (number2) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp.extends) {
      extendEmits(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, null);
    }
    return null;
  }
  if (isArray$1(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  if (isObject$1(comp)) {
    cache.set(comp, normalized);
  }
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function withCtx(fn, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn;
  if (fn._n) {
    return fn;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render2 = Component;
      if (false)
        ;
      result = normalizeVNode(render2.length > 1 ? render2(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render2(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root = cloneVNode(root);
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el;
    parent = parent.parent;
  }
}
const isSuspense = (type) => type.__isSuspense;
function queueEffectWithSuspense(fn, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray$1(fn)) {
      suspense.effects.push(...fn);
    } else {
      suspense.effects.push(fn);
    }
  } else {
    queuePostFlushCb(fn);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb2, options) {
  return doWatch(source, cb2, options);
}
function doWatch(source, cb2, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray$1(source)) {
    isMultiSource = true;
    forceTrigger = source.some((s) => isReactive(s) || isShallow(s));
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction(source)) {
    if (cb2) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb2 && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn) => {
    cleanup = effect.onStop = () => {
      callWithErrorHandling(fn, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb2) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb2, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect.active) {
      return;
    }
    if (cb2) {
      const newValue = effect.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb2, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect.run();
    }
  };
  job.allowRecurse = !!cb2;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    job.pre = true;
    if (instance)
      job.id = instance.uid;
    scheduler = () => queueJob(job);
  }
  const effect = new ReactiveEffect(getter, scheduler);
  if (cb2) {
    if (immediate) {
      job();
    } else {
      oldValue = effect.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect.run.bind(effect), instance && instance.suspense);
  } else {
    effect.run();
  }
  return () => {
    effect.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString$2(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb2;
  if (isFunction(value)) {
    cb2 = value;
  } else {
    cb2 = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb2.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject$1(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || /* @__PURE__ */ new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray$1(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject$1(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: /* @__PURE__ */ new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      let child = children[0];
      if (children.length > 1) {
        for (const c2 of children) {
          if (c2.type !== Comment) {
            child = c2;
            break;
          }
        }
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment) {
          leavingHooks.delayLeave = (el, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el._leaveCb = () => {
              earlyRemove();
              el._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = /* @__PURE__ */ Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const callAsyncHook = (hook, args) => {
    const done = args[1];
    callHook2(hook, args);
    if (isArray$1(hook)) {
      if (hook.every((hook2) => hook2.length <= 1))
        done();
    } else if (hook.length <= 1) {
      done();
    }
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el._leaveCb) {
        el._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el]);
    },
    enter(el) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el]);
        } else {
          callHook2(afterHook, [el]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el._enterCb = void 0;
      };
      if (hook) {
        callAsyncHook(hook, [el, done]);
      } else {
        done();
      }
    },
    leave(el, remove2) {
      const key2 = String(vnode.key);
      if (el._enterCb) {
        el._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el]);
      let called = false;
      const done = el._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el]);
        } else {
          callHook2(onAfterLeave, [el]);
        }
        el._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        callAsyncHook(onLeave, [el, done]);
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false, parentKey) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    let child = children[i];
    const key = parentKey == null ? child.key : String(parentKey) + String(child.key != null ? child.key : i);
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment, key));
    } else if (keepComment || child.type !== Comment) {
      ret.push(key != null ? cloneVNode(child, { key }) : child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
function onActivated(hook, target) {
  registerKeepAliveHook(hook, "a", target);
}
function onDeactivated(hook, target) {
  registerKeepAliveHook(hook, "da", target);
}
function registerKeepAliveHook(hook, type, target = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type, wrappedHook, target);
  if (target) {
    let current = target.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type, target, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type, target, keepAliveRoot) {
  const injected = injectHook(type, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type], injected);
  }, target);
}
function injectHook(type, hook, target = currentInstance, prepend = false) {
  if (target) {
    const hooks = target[type] || (target[type] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target);
      const res = callWithAsyncErrorHandling(hook, target, type, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target = currentInstance) {
  injectHook("ec", hook, target);
}
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = getExposeProxy(internalInstance) || internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString$2(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type === COMPONENTS) {
      const selfName = getComponentName(Component, false);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type] || Component[type], name) || resolve(instance.appContext[type], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = /* @__PURE__ */ extend(/* @__PURE__ */ Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => i.f || (i.f = () => queueJob(i.update)),
  $nextTick: (i) => i.n || (i.n = nextTick.bind(i.proxy)),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
      return true;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
      return true;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  },
  defineProperty(target, key, descriptor) {
    if (descriptor.get != null) {
      target._.accessCache[key] = 0;
    } else if (hasOwn(descriptor, "value")) {
      this.set(target, key, descriptor.value, null);
    }
    return Reflect.defineProperty(target, key, descriptor);
  }
};
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components,
    directives,
    filters
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject$1(data))
      ;
    else {
      instance.data = reactive(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction(opt) ? opt.bind(publicThis, publicThis) : isFunction(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction(opt) && isFunction(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c2 = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c2.value,
        set: (v) => c2.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray$1(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray$1(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render && instance.render === NOOP) {
    instance.render = render;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components)
    instance.components = components;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray$1(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject$1(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type) {
  callWithAsyncErrorHandling(isArray$1(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString$2(raw)) {
    const handler = ctx[raw];
    if (isFunction(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject$1(raw)) {
    if (isArray$1(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions(resolved, base, optionMergeStrategies);
  }
  if (isObject$1(base)) {
    cache.set(base, resolved);
  }
  return resolved;
}
function mergeOptions(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction(to) ? to.call(this, this) : to, isFunction(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray$1(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(/* @__PURE__ */ Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(/* @__PURE__ */ Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = /* @__PURE__ */ Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        if (isEmitListener(instance.emitsOptions, key)) {
          continue;
        }
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp);
  if (cached) {
    return cached;
  }
  const raw = comp.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction(comp)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp.extends) {
      extendProps(comp.extends);
    }
    if (comp.mixins) {
      comp.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    if (isObject$1(comp)) {
      cache.set(comp, EMPTY_ARR);
    }
    return EMPTY_ARR;
  }
  if (isArray$1(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop = normalized[normalizedKey] = isArray$1(opt) || isFunction(opt) ? { type: opt } : opt;
        if (prop) {
          const booleanIndex = getTypeIndex(Boolean, prop.type);
          const stringIndex = getTypeIndex(String, prop.type);
          prop[0] = booleanIndex > -1;
          prop[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  if (isObject$1(comp)) {
    cache.set(comp, res);
  }
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match ? match[1] : ctor === null ? "null" : "";
}
function isSameType(a2, b2) {
  return getType(a2) === getType(b2);
}
function getTypeIndex(type, expectedTypes) {
  if (isArray$1(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type));
  } else if (isFunction(expectedTypes)) {
    return isSameType(expectedTypes, type) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray$1(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot = (key, rawSlot, ctx) => {
  if (rawSlot._n) {
    return rawSlot;
  }
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction(value)) {
      slots[key] = normalizeSlot(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      instance.slots = toRaw(children);
      def(children, "_", type);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type = children._;
    if (type) {
      if (optimized && type === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: /* @__PURE__ */ Object.create(null),
    optionsCache: /* @__PURE__ */ new WeakMap(),
    propsCache: /* @__PURE__ */ new WeakMap(),
    emitsCache: /* @__PURE__ */ new WeakMap()
  };
}
let uid = 0;
function createAppAPI(render, hydrate) {
  return function createApp2(rootComponent, rootProps = null) {
    if (!isFunction(rootComponent)) {
      rootComponent = Object.assign({}, rootComponent);
    }
    if (rootProps != null && !isObject$1(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = /* @__PURE__ */ new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive2) {
        if (!directive2) {
          return context.directives[name];
        }
        context.directives[name] = directive2;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate) {
            hydrate(vnode, rootContainer);
          } else {
            render(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      }
    };
    return app2;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray$1(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray$1(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString$2(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString$2(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray$1(existing) && remove(existing, refValue);
          } else {
            if (!isArray$1(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
                if (hasOwn(setupState, ref2)) {
                  setupState[ref2] = refs[ref2];
                }
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (_isRef) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target = getGlobalThis();
  target.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type, ref: ref2, shapeFlag } = n2;
    switch (type) {
      case Text:
        processText(n1, n2, container, anchor);
        break;
      case Comment:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el, anchor }, container, nextSibling) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostInsert(el, container, nextSibling);
      el = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el, anchor }) => {
    let next;
    while (el && el !== anchor) {
      next = hostNextSibling(el);
      hostRemove(el);
      el = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el;
    let vnodeHook;
    const { type, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el = vnode.el = hostCloneNode(vnode.el);
    } else {
      el = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el, null, parentComponent, parentSuspense, isSVG && type !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el);
    }
    hostInsert(el, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start = 0) => {
    for (let i = start; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(
              () => !instance.isUnmounted && hydrateSubTree()
            );
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256 || parent && isAsyncWrapper(parent.vnode) && parent.vnode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(
          prevTree,
          nextTree,
          hostParentNode(prevTree.el),
          getNextHostNode(prevTree),
          instance,
          parentSuspense,
          isSVG
        );
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect = instance.effect = new ReactiveEffect(
      componentUpdateFn,
      () => queueJob(update),
      instance.scope
    );
    const update = instance.update = () => effect.run();
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs();
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = /* @__PURE__ */ new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el, type, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type.move(vnode, container, anchor, internals);
      return;
    }
    if (type === Fragment) {
      hostInsert(el, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el);
        hostInsert(el, container, anchor);
        queuePostRenderEffect(() => transition.enter(el), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el, container, anchor);
        const performLeave = () => {
          leave(el, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type, el, anchor, transition } = vnode;
    if (type === Fragment) {
      {
        removeFragment(el, anchor);
      }
      return;
    }
    if (type === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end) => {
    let next;
    while (cur !== end) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start = 0) => {
    for (let i = start; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPreFlushCbs();
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render,
    hydrate,
    createApp: createAppAPI(render, hydrate)
  };
}
function toggleRecurse({ effect, update }, allowed) {
  effect.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray$1(ch1) && isArray$1(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c2;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c2 = u + v >> 1;
        if (arr[result[c2]] < arrI) {
          u = c2 + 1;
        } else {
          v = c2;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type) => type.__isTeleport;
const Fragment = Symbol(void 0);
const Text = Symbol(void 0);
const Comment = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString$2(ref2) || isRef(ref2) || isFunction(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString$2(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type || type === NULL_DYNAMIC_COMPONENT) {
    type = Comment;
  }
  if (isVNode(type)) {
    const cloned = cloneVNode(type, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock) {
      if (cloned.shapeFlag & 6) {
        currentBlock[currentBlock.indexOf(type)] = cloned;
      } else {
        currentBlock.push(cloned);
      }
    }
    cloned.patchFlag |= -2;
    return cloned;
  }
  if (isClassComponent(type)) {
    type = type.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString$2(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject$1(style)) {
      if (isProxy(style) && !isArray$1(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString$2(type) ? 1 : isSuspense(type) ? 128 : isTeleport(type) ? 64 : isObject$1(type) ? 4 : isFunction(type) ? 2 : 0;
  return createBaseVNode(type, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray$1(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text = " ", flag = 0) {
  return createVNode(Text, null, text, flag);
}
function createCommentVNode(text = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment, null, text)) : createVNode(Comment, null, text);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment);
  } else if (isArray$1(child)) {
    return createVNode(
      Fragment,
      null,
      child.slice()
    );
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray$1(children)) {
    type = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type = 16;
      children = [createTextVNode(children)];
    } else {
      type = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray$1(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
const emptyAppContext = createAppContext();
let uid$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1++,
    vnode,
    type,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type, appContext),
    emitsOptions: normalizeEmitsOptions(type, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = /* @__PURE__ */ Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject$1(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target, key) {
      track(instance, "get", "$attrs");
      return target[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target, key) {
        if (key in target) {
          return target[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
function getComponentName(Component, includeInferred = true) {
  return isFunction(Component) ? Component.displayName || Component.name : Component.name || includeInferred && Component.__name;
}
function isClassComponent(value) {
  return isFunction(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function h(type, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject$1(propsOrChildren) && !isArray$1(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, null, [propsOrChildren]);
      }
      return createVNode(type, propsOrChildren);
    } else {
      return createVNode(type, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
}
const version = "3.2.38";
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && /* @__PURE__ */ doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el.setAttribute("multiple", props.multiple);
    }
    return el;
  },
  createText: (text) => doc.createTextNode(text),
  createComment: (text) => doc.createComment(text),
  setText: (node, text) => {
    node.nodeValue = text;
  },
  setElementText: (el, text) => {
    el.textContent = text;
  },
  parentNode: (node) => node.parentNode,
  nextSibling: (node) => node.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el, id) {
    el.setAttribute(id, "");
  },
  cloneNode(el) {
    const cloned = el.cloneNode(true);
    if (`_value` in el) {
      cloned._value = el._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start, end) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start && (start === end || start.nextSibling)) {
      while (true) {
        parent.insertBefore(start.cloneNode(true), anchor);
        if (start === end || !(start = start.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el, value, isSVG) {
  const transitionClasses = el._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el.removeAttribute("class");
  } else if (isSVG) {
    el.setAttribute("class", value);
  } else {
    el.className = value;
  }
}
function patchStyle(el, prev, next) {
  const style = el.style;
  const isCssString = isString$2(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString$2(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el.removeAttribute("style");
    }
    if ("_vod" in el) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray$1(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (val == null)
      val = "";
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el.removeAttribute(key);
    } else {
      el.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el.tagName !== "PROGRESS" && !el.tagName.includes("-")) {
    el._value = value;
    const newValue = value == null ? "" : value;
    if (el.value !== newValue || el.tagName === "OPTION") {
      el.value = newValue;
    }
    if (value == null) {
      el.removeAttribute(key);
    }
    return;
  }
  let needRemove = false;
  if (value === "" || value == null) {
    const type = typeof el[key];
    if (type === "boolean") {
      value = includeBooleanAttr(value);
    } else if (value == null && type === "string") {
      value = "";
      needRemove = true;
    } else if (type === "number") {
      value = 0;
      needRemove = true;
    }
  }
  try {
    el[key] = value;
  } catch (e) {
  }
  needRemove && el.removeAttribute(key);
}
const [_getNow, skipTimestampCheck] = /* @__PURE__ */ (() => {
  let _getNow2 = Date.now;
  let skipTimestampCheck2 = false;
  if (typeof window !== "undefined") {
    if (Date.now() > document.createEvent("Event").timeStamp) {
      _getNow2 = performance.now.bind(performance);
    }
    const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
    skipTimestampCheck2 = !!(ffMatch && Number(ffMatch[1]) <= 53);
  }
  return [_getNow2, skipTimestampCheck2];
})();
let cachedNow = 0;
const p = /* @__PURE__ */ Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el, event, handler, options) {
  el.addEventListener(event, handler, options);
}
function removeEventListener(el, event, handler, options) {
  el.removeEventListener(event, handler, options);
}
function patchEvent(el, rawName, prevValue, nextValue, instance = null) {
  const invokers = el._vei || (el._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  const event = name[2] === ":" ? name.slice(3) : hyphenate(name.slice(2));
  return [event, options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray$1(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn) => (e2) => !e2._stopped && fn && fn(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el, key, nextValue, isSVG)) {
    patchDOMProp(el, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el._trueValue = nextValue;
    } else if (key === "false-value") {
      el._falseValue = nextValue;
    }
    patchAttr(el, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el && nativeOnRE.test(key) && isFunction(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable" || key === "translate") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString$2(value)) {
    return false;
  }
  return key in el;
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray$1(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray$1(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el, isAppear, done) => {
    removeTransitionClass(el, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el, done) => {
    el._isLeaving = false;
    removeTransitionClass(el, leaveFromClass);
    removeTransitionClass(el, leaveToClass);
    removeTransitionClass(el, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el, isAppear, done);
      callHook(hook, [el, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el, type, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el) {
      callHook(onBeforeEnter, [el]);
      addTransitionClass(el, enterFromClass);
      addTransitionClass(el, enterActiveClass);
    },
    onBeforeAppear(el) {
      callHook(onBeforeAppear, [el]);
      addTransitionClass(el, appearFromClass);
      addTransitionClass(el, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el, done) {
      el._isLeaving = true;
      const resolve2 = () => finishLeave(el, done);
      addTransitionClass(el, leaveFromClass);
      forceReflow();
      addTransitionClass(el, leaveActiveClass);
      nextFrame(() => {
        if (!el._isLeaving) {
          return;
        }
        removeTransitionClass(el, leaveFromClass);
        addTransitionClass(el, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el, type, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el, resolve2]);
    },
    onEnterCancelled(el) {
      finishEnter(el, false);
      callHook(onEnterCancelled, [el]);
    },
    onAppearCancelled(el) {
      finishEnter(el, true);
      callHook(onAppearCancelled, [el]);
    },
    onLeaveCancelled(el) {
      finishLeave(el);
      callHook(onLeaveCancelled, [el]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject$1(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c2) => c2 && el.classList.add(c2));
  (el._vtc || (el._vtc = /* @__PURE__ */ new Set())).add(cls);
}
function removeTransitionClass(el, cls) {
  cls.split(/\s+/).forEach((c2) => c2 && el.classList.remove(c2));
  const { _vtc } = el;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el._vtc = void 0;
    }
  }
}
function nextFrame(cb2) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb2);
  });
}
let endId = 0;
function whenTransitionEnds(el, expectedType, explicitTimeout, resolve2) {
  const id = el._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type, timeout, propCount } = getTransitionInfo(el, expectedType);
  if (!type) {
    return resolve2();
  }
  const endEvent = type + "end";
  let ended = 0;
  const end = () => {
    el.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el && ++ended >= propCount) {
      end();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end();
    }
  }, timeout + 1);
  el.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el, expectedType) {
  const styles = window.getComputedStyle(el);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type ? type === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const rendererOptions = /* @__PURE__ */ extend({ patchProp }, nodeOps);
let renderer;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString$2(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
var isVue2 = false;
/*!
  * pinia v2.0.21
  * (c) 2022 Eduardo San Martin Morote
  * @license MIT
  */
let activePinia;
const setActivePinia = (pinia) => activePinia = pinia;
const piniaSymbol = Symbol();
function isPlainObject(o) {
  return o && typeof o === "object" && Object.prototype.toString.call(o) === "[object Object]" && typeof o.toJSON !== "function";
}
var MutationType;
(function(MutationType2) {
  MutationType2["direct"] = "direct";
  MutationType2["patchObject"] = "patch object";
  MutationType2["patchFunction"] = "patch function";
})(MutationType || (MutationType = {}));
function createPinia() {
  const scope = effectScope(true);
  const state = scope.run(() => ref({}));
  let _p = [];
  let toBeInstalled = [];
  const pinia = markRaw({
    install(app2) {
      setActivePinia(pinia);
      {
        pinia._a = app2;
        app2.provide(piniaSymbol, pinia);
        app2.config.globalProperties.$pinia = pinia;
        toBeInstalled.forEach((plugin) => _p.push(plugin));
        toBeInstalled = [];
      }
    },
    use(plugin) {
      if (!this._a && !isVue2) {
        toBeInstalled.push(plugin);
      } else {
        _p.push(plugin);
      }
      return this;
    },
    _p,
    _a: null,
    _e: scope,
    _s: /* @__PURE__ */ new Map(),
    state
  });
  return pinia;
}
const noop$1 = () => {
};
function addSubscription(subscriptions, callback, detached, onCleanup = noop$1) {
  subscriptions.push(callback);
  const removeSubscription = () => {
    const idx = subscriptions.indexOf(callback);
    if (idx > -1) {
      subscriptions.splice(idx, 1);
      onCleanup();
    }
  };
  if (!detached && getCurrentInstance()) {
    onUnmounted(removeSubscription);
  }
  return removeSubscription;
}
function triggerSubscriptions(subscriptions, ...args) {
  subscriptions.slice().forEach((callback) => {
    callback(...args);
  });
}
function mergeReactiveObjects(target, patchToApply) {
  for (const key in patchToApply) {
    if (!patchToApply.hasOwnProperty(key))
      continue;
    const subPatch = patchToApply[key];
    const targetValue = target[key];
    if (isPlainObject(targetValue) && isPlainObject(subPatch) && target.hasOwnProperty(key) && !isRef(subPatch) && !isReactive(subPatch)) {
      target[key] = mergeReactiveObjects(targetValue, subPatch);
    } else {
      target[key] = subPatch;
    }
  }
  return target;
}
const skipHydrateSymbol = Symbol();
function shouldHydrate(obj) {
  return !isPlainObject(obj) || !obj.hasOwnProperty(skipHydrateSymbol);
}
const { assign } = Object;
function isComputed(o) {
  return !!(isRef(o) && o.effect);
}
function createOptionsStore(id, options, pinia, hot) {
  const { state, actions, getters } = options;
  const initialState = pinia.state.value[id];
  let store;
  function setup() {
    if (!initialState && true) {
      {
        pinia.state.value[id] = state ? state() : {};
      }
    }
    const localState = toRefs(pinia.state.value[id]);
    return assign(localState, actions, Object.keys(getters || {}).reduce((computedGetters, name) => {
      computedGetters[name] = markRaw(computed(() => {
        setActivePinia(pinia);
        const store2 = pinia._s.get(id);
        return getters[name].call(store2, store2);
      }));
      return computedGetters;
    }, {}));
  }
  store = createSetupStore(id, setup, options, pinia, hot, true);
  store.$reset = function $reset() {
    const newState = state ? state() : {};
    this.$patch(($state) => {
      assign($state, newState);
    });
  };
  return store;
}
function createSetupStore($id, setup, options = {}, pinia, hot, isOptionsStore) {
  let scope;
  const optionsForPlugin = assign({ actions: {} }, options);
  const $subscribeOptions = {
    deep: true
  };
  let isListening;
  let isSyncListening;
  let subscriptions = markRaw([]);
  let actionSubscriptions = markRaw([]);
  let debuggerEvents;
  const initialState = pinia.state.value[$id];
  if (!isOptionsStore && !initialState && true) {
    {
      pinia.state.value[$id] = {};
    }
  }
  ref({});
  let activeListener;
  function $patch(partialStateOrMutator) {
    let subscriptionMutation;
    isListening = isSyncListening = false;
    if (typeof partialStateOrMutator === "function") {
      partialStateOrMutator(pinia.state.value[$id]);
      subscriptionMutation = {
        type: MutationType.patchFunction,
        storeId: $id,
        events: debuggerEvents
      };
    } else {
      mergeReactiveObjects(pinia.state.value[$id], partialStateOrMutator);
      subscriptionMutation = {
        type: MutationType.patchObject,
        payload: partialStateOrMutator,
        storeId: $id,
        events: debuggerEvents
      };
    }
    const myListenerId = activeListener = Symbol();
    nextTick().then(() => {
      if (activeListener === myListenerId) {
        isListening = true;
      }
    });
    isSyncListening = true;
    triggerSubscriptions(subscriptions, subscriptionMutation, pinia.state.value[$id]);
  }
  const $reset = noop$1;
  function $dispose() {
    scope.stop();
    subscriptions = [];
    actionSubscriptions = [];
    pinia._s.delete($id);
  }
  function wrapAction(name, action) {
    return function() {
      setActivePinia(pinia);
      const args = Array.from(arguments);
      const afterCallbackList = [];
      const onErrorCallbackList = [];
      function after(callback) {
        afterCallbackList.push(callback);
      }
      function onError(callback) {
        onErrorCallbackList.push(callback);
      }
      triggerSubscriptions(actionSubscriptions, {
        args,
        name,
        store,
        after,
        onError
      });
      let ret;
      try {
        ret = action.apply(this && this.$id === $id ? this : store, args);
      } catch (error) {
        triggerSubscriptions(onErrorCallbackList, error);
        throw error;
      }
      if (ret instanceof Promise) {
        return ret.then((value) => {
          triggerSubscriptions(afterCallbackList, value);
          return value;
        }).catch((error) => {
          triggerSubscriptions(onErrorCallbackList, error);
          return Promise.reject(error);
        });
      }
      triggerSubscriptions(afterCallbackList, ret);
      return ret;
    };
  }
  const partialStore = {
    _p: pinia,
    $id,
    $onAction: addSubscription.bind(null, actionSubscriptions),
    $patch,
    $reset,
    $subscribe(callback, options2 = {}) {
      const removeSubscription = addSubscription(subscriptions, callback, options2.detached, () => stopWatcher());
      const stopWatcher = scope.run(() => watch(() => pinia.state.value[$id], (state) => {
        if (options2.flush === "sync" ? isSyncListening : isListening) {
          callback({
            storeId: $id,
            type: MutationType.direct,
            events: debuggerEvents
          }, state);
        }
      }, assign({}, $subscribeOptions, options2)));
      return removeSubscription;
    },
    $dispose
  };
  const store = reactive(assign(
    {},
    partialStore
  ));
  pinia._s.set($id, store);
  const setupStore = pinia._e.run(() => {
    scope = effectScope();
    return scope.run(() => setup());
  });
  for (const key in setupStore) {
    const prop = setupStore[key];
    if (isRef(prop) && !isComputed(prop) || isReactive(prop)) {
      if (!isOptionsStore) {
        if (initialState && shouldHydrate(prop)) {
          if (isRef(prop)) {
            prop.value = initialState[key];
          } else {
            mergeReactiveObjects(prop, initialState[key]);
          }
        }
        {
          pinia.state.value[$id][key] = prop;
        }
      }
    } else if (typeof prop === "function") {
      const actionValue = wrapAction(key, prop);
      {
        setupStore[key] = actionValue;
      }
      optionsForPlugin.actions[key] = prop;
    } else
      ;
  }
  {
    assign(store, setupStore);
    assign(toRaw(store), setupStore);
  }
  Object.defineProperty(store, "$state", {
    get: () => pinia.state.value[$id],
    set: (state) => {
      $patch(($state) => {
        assign($state, state);
      });
    }
  });
  pinia._p.forEach((extender) => {
    {
      assign(store, scope.run(() => extender({
        store,
        app: pinia._a,
        pinia,
        options: optionsForPlugin
      })));
    }
  });
  if (initialState && isOptionsStore && options.hydrate) {
    options.hydrate(store.$state, initialState);
  }
  isListening = true;
  isSyncListening = true;
  return store;
}
function defineStore(idOrOptions, setup, setupOptions) {
  let id;
  let options;
  const isSetupStore = typeof setup === "function";
  if (typeof idOrOptions === "string") {
    id = idOrOptions;
    options = isSetupStore ? setupOptions : setup;
  } else {
    options = idOrOptions;
    id = idOrOptions.id;
  }
  function useStore(pinia, hot) {
    const currentInstance2 = getCurrentInstance();
    pinia = pinia || currentInstance2 && inject(piniaSymbol);
    if (pinia)
      setActivePinia(pinia);
    pinia = activePinia;
    if (!pinia._s.has(id)) {
      if (isSetupStore) {
        createSetupStore(id, setup, options, pinia);
      } else {
        createOptionsStore(id, options, pinia);
      }
    }
    const store = pinia._s.get(id);
    return store;
  }
  useStore.$id = id;
  return useStore;
}
function storeToRefs(store) {
  {
    store = toRaw(store);
    const refs = {};
    for (const key in store) {
      const value = store[key];
      if (isRef(value) || isReactive(value)) {
        refs[key] = toRef(store, key);
      }
    }
    return refs;
  }
}
function set(target, key, val) {
  if (Array.isArray(target)) {
    target.length = Math.max(target.length, key);
    target.splice(key, 1, val);
    return val;
  }
  target[key] = val;
  return val;
}
function del(target, key) {
  if (Array.isArray(target)) {
    target.splice(key, 1);
    return;
  }
  delete target[key];
}
var _a;
const isClient = typeof window !== "undefined";
const toString = Object.prototype.toString;
const isNumber = (val) => typeof val === "number";
const isString$1 = (val) => typeof val === "string";
const isObject = (val) => toString.call(val) === "[object Object]";
const noop = () => {
};
isClient && ((_a = window == null ? void 0 : window.navigator) == null ? void 0 : _a.userAgent) && /iP(ad|hone|od)/.test(window.navigator.userAgent);
function tryOnScopeDispose(fn) {
  if (getCurrentScope()) {
    onScopeDispose(fn);
    return true;
  }
  return false;
}
function tryOnUnmounted(fn) {
  if (getCurrentInstance())
    onUnmounted(fn);
}
function unrefElement(elRef) {
  var _a2;
  const plain = unref(elRef);
  return (_a2 = plain == null ? void 0 : plain.$el) != null ? _a2 : plain;
}
const defaultWindow = isClient ? window : void 0;
function useEventListener(...args) {
  let target;
  let event;
  let listener;
  let options;
  if (isString$1(args[0])) {
    [event, listener, options] = args;
    target = defaultWindow;
  } else {
    [target, event, listener, options] = args;
  }
  if (!target)
    return noop;
  let cleanup = noop;
  const stopWatch = watch(() => unrefElement(target), (el) => {
    cleanup();
    if (!el)
      return;
    el.addEventListener(event, listener, options);
    cleanup = () => {
      el.removeEventListener(event, listener, options);
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" });
  const stop = () => {
    stopWatch();
    cleanup();
  };
  tryOnScopeDispose(stop);
  return stop;
}
const _global = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
const globalKey = "__vueuse_ssr_handlers__";
_global[globalKey] = _global[globalKey] || {};
_global[globalKey];
function useIntersectionObserver(target, callback, options = {}) {
  const {
    root,
    rootMargin = "0px",
    threshold = 0.1,
    window: window2 = defaultWindow
  } = options;
  const isSupported = window2 && "IntersectionObserver" in window2;
  let cleanup = noop;
  const stopWatch = isSupported ? watch(() => ({
    el: unrefElement(target),
    root: unrefElement(root)
  }), ({ el, root: root2 }) => {
    cleanup();
    if (!el)
      return;
    const observer = new IntersectionObserver(callback, {
      root: root2,
      rootMargin,
      threshold
    });
    observer.observe(el);
    cleanup = () => {
      observer.disconnect();
      cleanup = noop;
    };
  }, { immediate: true, flush: "post" }) : noop;
  const stop = () => {
    cleanup();
    stopWatch();
  };
  tryOnScopeDispose(stop);
  return {
    isSupported,
    stop
  };
}
var SwipeDirection;
(function(SwipeDirection2) {
  SwipeDirection2["UP"] = "UP";
  SwipeDirection2["RIGHT"] = "RIGHT";
  SwipeDirection2["DOWN"] = "DOWN";
  SwipeDirection2["LEFT"] = "LEFT";
  SwipeDirection2["NONE"] = "NONE";
})(SwipeDirection || (SwipeDirection = {}));
const defaultTimestep = 1 / 60 * 1e3;
const getCurrentTime = typeof performance !== "undefined" ? () => performance.now() : () => Date.now();
const onNextFrame = typeof window !== "undefined" ? (callback) => window.requestAnimationFrame(callback) : (callback) => setTimeout(() => callback(getCurrentTime()), defaultTimestep);
function createRenderStep(runNextFrame2) {
  let toRun = [];
  let toRunNextFrame = [];
  let numToRun = 0;
  let isProcessing2 = false;
  let flushNextFrame = false;
  const toKeepAlive = /* @__PURE__ */ new WeakSet();
  const step = {
    schedule: (callback, keepAlive = false, immediate = false) => {
      const addToCurrentFrame = immediate && isProcessing2;
      const buffer = addToCurrentFrame ? toRun : toRunNextFrame;
      if (keepAlive)
        toKeepAlive.add(callback);
      if (buffer.indexOf(callback) === -1) {
        buffer.push(callback);
        if (addToCurrentFrame && isProcessing2)
          numToRun = toRun.length;
      }
      return callback;
    },
    cancel: (callback) => {
      const index2 = toRunNextFrame.indexOf(callback);
      if (index2 !== -1)
        toRunNextFrame.splice(index2, 1);
      toKeepAlive.delete(callback);
    },
    process: (frameData) => {
      if (isProcessing2) {
        flushNextFrame = true;
        return;
      }
      isProcessing2 = true;
      [toRun, toRunNextFrame] = [toRunNextFrame, toRun];
      toRunNextFrame.length = 0;
      numToRun = toRun.length;
      if (numToRun) {
        for (let i = 0; i < numToRun; i++) {
          const callback = toRun[i];
          callback(frameData);
          if (toKeepAlive.has(callback)) {
            step.schedule(callback);
            runNextFrame2();
          }
        }
      }
      isProcessing2 = false;
      if (flushNextFrame) {
        flushNextFrame = false;
        step.process(frameData);
      }
    }
  };
  return step;
}
const maxElapsed = 40;
let useDefaultElapsed = true;
let runNextFrame = false;
let isProcessing = false;
const frame = {
  delta: 0,
  timestamp: 0
};
const stepsOrder = [
  "read",
  "update",
  "preRender",
  "render",
  "postRender"
];
const steps = stepsOrder.reduce((acc, key) => {
  acc[key] = createRenderStep(() => runNextFrame = true);
  return acc;
}, {});
const sync = stepsOrder.reduce((acc, key) => {
  const step = steps[key];
  acc[key] = (process, keepAlive = false, immediate = false) => {
    if (!runNextFrame)
      startLoop();
    return step.schedule(process, keepAlive, immediate);
  };
  return acc;
}, {});
const cancelSync = stepsOrder.reduce((acc, key) => {
  acc[key] = steps[key].cancel;
  return acc;
}, {});
stepsOrder.reduce((acc, key) => {
  acc[key] = () => steps[key].process(frame);
  return acc;
}, {});
const processStep = (stepId) => steps[stepId].process(frame);
const processFrame = (timestamp) => {
  runNextFrame = false;
  frame.delta = useDefaultElapsed ? defaultTimestep : Math.max(Math.min(timestamp - frame.timestamp, maxElapsed), 1);
  frame.timestamp = timestamp;
  isProcessing = true;
  stepsOrder.forEach(processStep);
  isProcessing = false;
  if (runNextFrame) {
    useDefaultElapsed = false;
    onNextFrame(processFrame);
  }
};
const startLoop = () => {
  runNextFrame = true;
  useDefaultElapsed = true;
  if (!isProcessing)
    onNextFrame(processFrame);
};
const getFrameData = () => frame;
function __rest(s, e) {
  var t = {};
  for (var p2 in s)
    if (Object.prototype.hasOwnProperty.call(s, p2) && e.indexOf(p2) < 0)
      t[p2] = s[p2];
  if (s != null && typeof Object.getOwnPropertySymbols === "function")
    for (var i = 0, p2 = Object.getOwnPropertySymbols(s); i < p2.length; i++) {
      if (e.indexOf(p2[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p2[i]))
        t[p2[i]] = s[p2[i]];
    }
  return t;
}
var warning = function() {
};
var invariant = function() {
};
const clamp$1 = (min, max, v) => Math.min(Math.max(v, min), max);
const safeMin = 1e-3;
const minDuration = 0.01;
const maxDuration = 10;
const minDamping = 0.05;
const maxDamping = 1;
function findSpring({ duration = 800, bounce = 0.25, velocity = 0, mass = 1 }) {
  let envelope;
  let derivative;
  warning(duration <= maxDuration * 1e3);
  let dampingRatio = 1 - bounce;
  dampingRatio = clamp$1(minDamping, maxDamping, dampingRatio);
  duration = clamp$1(minDuration, maxDuration, duration / 1e3);
  if (dampingRatio < 1) {
    envelope = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const a2 = exponentialDecay - velocity;
      const b2 = calcAngularFreq(undampedFreq2, dampingRatio);
      const c2 = Math.exp(-delta);
      return safeMin - a2 / b2 * c2;
    };
    derivative = (undampedFreq2) => {
      const exponentialDecay = undampedFreq2 * dampingRatio;
      const delta = exponentialDecay * duration;
      const d = delta * velocity + velocity;
      const e = Math.pow(dampingRatio, 2) * Math.pow(undampedFreq2, 2) * duration;
      const f = Math.exp(-delta);
      const g = calcAngularFreq(Math.pow(undampedFreq2, 2), dampingRatio);
      const factor = -envelope(undampedFreq2) + safeMin > 0 ? -1 : 1;
      return factor * ((d - e) * f) / g;
    };
  } else {
    envelope = (undampedFreq2) => {
      const a2 = Math.exp(-undampedFreq2 * duration);
      const b2 = (undampedFreq2 - velocity) * duration + 1;
      return -safeMin + a2 * b2;
    };
    derivative = (undampedFreq2) => {
      const a2 = Math.exp(-undampedFreq2 * duration);
      const b2 = (velocity - undampedFreq2) * (duration * duration);
      return a2 * b2;
    };
  }
  const initialGuess = 5 / duration;
  const undampedFreq = approximateRoot(envelope, derivative, initialGuess);
  duration = duration * 1e3;
  if (isNaN(undampedFreq)) {
    return {
      stiffness: 100,
      damping: 10,
      duration
    };
  } else {
    const stiffness = Math.pow(undampedFreq, 2) * mass;
    return {
      stiffness,
      damping: dampingRatio * 2 * Math.sqrt(mass * stiffness),
      duration
    };
  }
}
const rootIterations = 12;
function approximateRoot(envelope, derivative, initialGuess) {
  let result = initialGuess;
  for (let i = 1; i < rootIterations; i++) {
    result = result - envelope(result) / derivative(result);
  }
  return result;
}
function calcAngularFreq(undampedFreq, dampingRatio) {
  return undampedFreq * Math.sqrt(1 - dampingRatio * dampingRatio);
}
const durationKeys = ["duration", "bounce"];
const physicsKeys = ["stiffness", "damping", "mass"];
function isSpringType(options, keys) {
  return keys.some((key) => options[key] !== void 0);
}
function getSpringOptions(options) {
  let springOptions = Object.assign({ velocity: 0, stiffness: 100, damping: 10, mass: 1, isResolvedFromDuration: false }, options);
  if (!isSpringType(options, physicsKeys) && isSpringType(options, durationKeys)) {
    const derived = findSpring(options);
    springOptions = Object.assign(Object.assign(Object.assign({}, springOptions), derived), { velocity: 0, mass: 1 });
    springOptions.isResolvedFromDuration = true;
  }
  return springOptions;
}
function spring(_a2) {
  var { from = 0, to = 1, restSpeed = 2, restDelta } = _a2, options = __rest(_a2, ["from", "to", "restSpeed", "restDelta"]);
  const state = { done: false, value: from };
  let { stiffness, damping, mass, velocity, duration, isResolvedFromDuration } = getSpringOptions(options);
  let resolveSpring = zero;
  let resolveVelocity = zero;
  function createSpring() {
    const initialVelocity = velocity ? -(velocity / 1e3) : 0;
    const initialDelta = to - from;
    const dampingRatio = damping / (2 * Math.sqrt(stiffness * mass));
    const undampedAngularFreq = Math.sqrt(stiffness / mass) / 1e3;
    if (restDelta === void 0) {
      restDelta = Math.min(Math.abs(to - from) / 100, 0.4);
    }
    if (dampingRatio < 1) {
      const angularFreq = calcAngularFreq(undampedAngularFreq, dampingRatio);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return to - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq * Math.sin(angularFreq * t) + initialDelta * Math.cos(angularFreq * t));
      };
      resolveVelocity = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        return dampingRatio * undampedAngularFreq * envelope * (Math.sin(angularFreq * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) / angularFreq + initialDelta * Math.cos(angularFreq * t)) - envelope * (Math.cos(angularFreq * t) * (initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) - angularFreq * initialDelta * Math.sin(angularFreq * t));
      };
    } else if (dampingRatio === 1) {
      resolveSpring = (t) => to - Math.exp(-undampedAngularFreq * t) * (initialDelta + (initialVelocity + undampedAngularFreq * initialDelta) * t);
    } else {
      const dampedAngularFreq = undampedAngularFreq * Math.sqrt(dampingRatio * dampingRatio - 1);
      resolveSpring = (t) => {
        const envelope = Math.exp(-dampingRatio * undampedAngularFreq * t);
        const freqForT = Math.min(dampedAngularFreq * t, 300);
        return to - envelope * ((initialVelocity + dampingRatio * undampedAngularFreq * initialDelta) * Math.sinh(freqForT) + dampedAngularFreq * initialDelta * Math.cosh(freqForT)) / dampedAngularFreq;
      };
    }
  }
  createSpring();
  return {
    next: (t) => {
      const current = resolveSpring(t);
      if (!isResolvedFromDuration) {
        const currentVelocity = resolveVelocity(t) * 1e3;
        const isBelowVelocityThreshold = Math.abs(currentVelocity) <= restSpeed;
        const isBelowDisplacementThreshold = Math.abs(to - current) <= restDelta;
        state.done = isBelowVelocityThreshold && isBelowDisplacementThreshold;
      } else {
        state.done = t >= duration;
      }
      state.value = state.done ? to : current;
      return state;
    },
    flipTarget: () => {
      velocity = -velocity;
      [from, to] = [to, from];
      createSpring();
    }
  };
}
spring.needsInterpolation = (a2, b2) => typeof a2 === "string" || typeof b2 === "string";
const zero = (_t) => 0;
const progress = (from, to, value) => {
  const toFromDifference = to - from;
  return toFromDifference === 0 ? 1 : (value - from) / toFromDifference;
};
const mix = (from, to, progress2) => -progress2 * from + progress2 * to + from;
const clamp = (min, max) => (v) => Math.max(Math.min(v, max), min);
const sanitize = (v) => v % 1 ? Number(v.toFixed(5)) : v;
const floatRegex = /(-)?([\d]*\.?[\d])+/g;
const colorRegex = /(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))/gi;
const singleColorRegex = /^(#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?[\d\.]+%?[,\s]+){2}(-?[\d\.]+%?)\s*[\,\/]?\s*[\d\.]*%?\))$/i;
function isString(v) {
  return typeof v === "string";
}
const number = {
  test: (v) => typeof v === "number",
  parse: parseFloat,
  transform: (v) => v
};
const alpha = Object.assign(Object.assign({}, number), { transform: clamp(0, 1) });
const scale = Object.assign(Object.assign({}, number), { default: 1 });
const createUnitType = (unit) => ({
  test: (v) => isString(v) && v.endsWith(unit) && v.split(" ").length === 1,
  parse: parseFloat,
  transform: (v) => `${v}${unit}`
});
const degrees = createUnitType("deg");
const percent = createUnitType("%");
const px = createUnitType("px");
const progressPercentage = Object.assign(Object.assign({}, percent), { parse: (v) => percent.parse(v) / 100, transform: (v) => percent.transform(v * 100) });
const isColorString = (type, testProp) => (v) => {
  return Boolean(isString(v) && singleColorRegex.test(v) && v.startsWith(type) || testProp && Object.prototype.hasOwnProperty.call(v, testProp));
};
const splitColor = (aName, bName, cName) => (v) => {
  if (!isString(v))
    return v;
  const [a2, b2, c2, alpha2] = v.match(floatRegex);
  return {
    [aName]: parseFloat(a2),
    [bName]: parseFloat(b2),
    [cName]: parseFloat(c2),
    alpha: alpha2 !== void 0 ? parseFloat(alpha2) : 1
  };
};
const hsla = {
  test: isColorString("hsl", "hue"),
  parse: splitColor("hue", "saturation", "lightness"),
  transform: ({ hue, saturation, lightness, alpha: alpha$1 = 1 }) => {
    return "hsla(" + Math.round(hue) + ", " + percent.transform(sanitize(saturation)) + ", " + percent.transform(sanitize(lightness)) + ", " + sanitize(alpha.transform(alpha$1)) + ")";
  }
};
const clampRgbUnit = clamp(0, 255);
const rgbUnit = Object.assign(Object.assign({}, number), { transform: (v) => Math.round(clampRgbUnit(v)) });
const rgba = {
  test: isColorString("rgb", "red"),
  parse: splitColor("red", "green", "blue"),
  transform: ({ red, green, blue, alpha: alpha$1 = 1 }) => "rgba(" + rgbUnit.transform(red) + ", " + rgbUnit.transform(green) + ", " + rgbUnit.transform(blue) + ", " + sanitize(alpha.transform(alpha$1)) + ")"
};
function parseHex(v) {
  let r = "";
  let g = "";
  let b2 = "";
  let a2 = "";
  if (v.length > 5) {
    r = v.substr(1, 2);
    g = v.substr(3, 2);
    b2 = v.substr(5, 2);
    a2 = v.substr(7, 2);
  } else {
    r = v.substr(1, 1);
    g = v.substr(2, 1);
    b2 = v.substr(3, 1);
    a2 = v.substr(4, 1);
    r += r;
    g += g;
    b2 += b2;
    a2 += a2;
  }
  return {
    red: parseInt(r, 16),
    green: parseInt(g, 16),
    blue: parseInt(b2, 16),
    alpha: a2 ? parseInt(a2, 16) / 255 : 1
  };
}
const hex = {
  test: isColorString("#"),
  parse: parseHex,
  transform: rgba.transform
};
const color = {
  test: (v) => rgba.test(v) || hex.test(v) || hsla.test(v),
  parse: (v) => {
    if (rgba.test(v)) {
      return rgba.parse(v);
    } else if (hsla.test(v)) {
      return hsla.parse(v);
    } else {
      return hex.parse(v);
    }
  },
  transform: (v) => {
    return isString(v) ? v : v.hasOwnProperty("red") ? rgba.transform(v) : hsla.transform(v);
  }
};
const colorToken = "${c}";
const numberToken = "${n}";
function test(v) {
  var _a2, _b, _c, _d;
  return isNaN(v) && isString(v) && ((_b = (_a2 = v.match(floatRegex)) === null || _a2 === void 0 ? void 0 : _a2.length) !== null && _b !== void 0 ? _b : 0) + ((_d = (_c = v.match(colorRegex)) === null || _c === void 0 ? void 0 : _c.length) !== null && _d !== void 0 ? _d : 0) > 0;
}
function analyse$1(v) {
  if (typeof v === "number")
    v = `${v}`;
  const values = [];
  let numColors = 0;
  const colors = v.match(colorRegex);
  if (colors) {
    numColors = colors.length;
    v = v.replace(colorRegex, colorToken);
    values.push(...colors.map(color.parse));
  }
  const numbers = v.match(floatRegex);
  if (numbers) {
    v = v.replace(floatRegex, numberToken);
    values.push(...numbers.map(number.parse));
  }
  return { values, numColors, tokenised: v };
}
function parse(v) {
  return analyse$1(v).values;
}
function createTransformer(v) {
  const { values, numColors, tokenised } = analyse$1(v);
  const numValues = values.length;
  return (v2) => {
    let output = tokenised;
    for (let i = 0; i < numValues; i++) {
      output = output.replace(i < numColors ? colorToken : numberToken, i < numColors ? color.transform(v2[i]) : sanitize(v2[i]));
    }
    return output;
  };
}
const convertNumbersToZero = (v) => typeof v === "number" ? 0 : v;
function getAnimatableNone$1(v) {
  const parsed = parse(v);
  const transformer = createTransformer(v);
  return transformer(parsed.map(convertNumbersToZero));
}
const complex = { test, parse, createTransformer, getAnimatableNone: getAnimatableNone$1 };
const maxDefaults = /* @__PURE__ */ new Set(["brightness", "contrast", "saturate", "opacity"]);
function applyDefaultFilter(v) {
  let [name, value] = v.slice(0, -1).split("(");
  if (name === "drop-shadow")
    return v;
  const [number2] = value.match(floatRegex) || [];
  if (!number2)
    return v;
  const unit = value.replace(number2, "");
  let defaultValue = maxDefaults.has(name) ? 1 : 0;
  if (number2 !== value)
    defaultValue *= 100;
  return name + "(" + defaultValue + unit + ")";
}
const functionRegex = /([a-z-]*)\(.*?\)/g;
const filter = Object.assign(Object.assign({}, complex), { getAnimatableNone: (v) => {
  const functions = v.match(functionRegex);
  return functions ? functions.map(applyDefaultFilter).join(" ") : v;
} });
function hueToRgb(p2, q, t) {
  if (t < 0)
    t += 1;
  if (t > 1)
    t -= 1;
  if (t < 1 / 6)
    return p2 + (q - p2) * 6 * t;
  if (t < 1 / 2)
    return q;
  if (t < 2 / 3)
    return p2 + (q - p2) * (2 / 3 - t) * 6;
  return p2;
}
function hslaToRgba({ hue, saturation, lightness, alpha: alpha2 }) {
  hue /= 360;
  saturation /= 100;
  lightness /= 100;
  let red = 0;
  let green = 0;
  let blue = 0;
  if (!saturation) {
    red = green = blue = lightness;
  } else {
    const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - lightness * saturation;
    const p2 = 2 * lightness - q;
    red = hueToRgb(p2, q, hue + 1 / 3);
    green = hueToRgb(p2, q, hue);
    blue = hueToRgb(p2, q, hue - 1 / 3);
  }
  return {
    red: Math.round(red * 255),
    green: Math.round(green * 255),
    blue: Math.round(blue * 255),
    alpha: alpha2
  };
}
const mixLinearColor = (from, to, v) => {
  const fromExpo = from * from;
  const toExpo = to * to;
  return Math.sqrt(Math.max(0, v * (toExpo - fromExpo) + fromExpo));
};
const colorTypes = [hex, rgba, hsla];
const getColorType = (v) => colorTypes.find((type) => type.test(v));
const mixColor = (from, to) => {
  let fromColorType = getColorType(from);
  let toColorType = getColorType(to);
  let fromColor = fromColorType.parse(from);
  let toColor = toColorType.parse(to);
  if (fromColorType === hsla) {
    fromColor = hslaToRgba(fromColor);
    fromColorType = rgba;
  }
  if (toColorType === hsla) {
    toColor = hslaToRgba(toColor);
    toColorType = rgba;
  }
  const blended = Object.assign({}, fromColor);
  return (v) => {
    for (const key in blended) {
      if (key !== "alpha") {
        blended[key] = mixLinearColor(fromColor[key], toColor[key], v);
      }
    }
    blended.alpha = mix(fromColor.alpha, toColor.alpha, v);
    return fromColorType.transform(blended);
  };
};
const isNum = (v) => typeof v === "number";
const combineFunctions = (a2, b2) => (v) => b2(a2(v));
const pipe = (...transformers) => transformers.reduce(combineFunctions);
function getMixer(origin, target) {
  if (isNum(origin)) {
    return (v) => mix(origin, target, v);
  } else if (color.test(origin)) {
    return mixColor(origin, target);
  } else {
    return mixComplex(origin, target);
  }
}
const mixArray = (from, to) => {
  const output = [...from];
  const numValues = output.length;
  const blendValue = from.map((fromThis, i) => getMixer(fromThis, to[i]));
  return (v) => {
    for (let i = 0; i < numValues; i++) {
      output[i] = blendValue[i](v);
    }
    return output;
  };
};
const mixObject = (origin, target) => {
  const output = Object.assign(Object.assign({}, origin), target);
  const blendValue = {};
  for (const key in output) {
    if (origin[key] !== void 0 && target[key] !== void 0) {
      blendValue[key] = getMixer(origin[key], target[key]);
    }
  }
  return (v) => {
    for (const key in blendValue) {
      output[key] = blendValue[key](v);
    }
    return output;
  };
};
function analyse(value) {
  const parsed = complex.parse(value);
  const numValues = parsed.length;
  let numNumbers = 0;
  let numRGB = 0;
  let numHSL = 0;
  for (let i = 0; i < numValues; i++) {
    if (numNumbers || typeof parsed[i] === "number") {
      numNumbers++;
    } else {
      if (parsed[i].hue !== void 0) {
        numHSL++;
      } else {
        numRGB++;
      }
    }
  }
  return { parsed, numNumbers, numRGB, numHSL };
}
const mixComplex = (origin, target) => {
  const template = complex.createTransformer(target);
  const originStats = analyse(origin);
  const targetStats = analyse(target);
  const canInterpolate = originStats.numHSL === targetStats.numHSL && originStats.numRGB === targetStats.numRGB && originStats.numNumbers >= targetStats.numNumbers;
  if (canInterpolate) {
    return pipe(mixArray(originStats.parsed, targetStats.parsed), template);
  } else {
    return (p2) => `${p2 > 0 ? target : origin}`;
  }
};
const mixNumber = (from, to) => (p2) => mix(from, to, p2);
function detectMixerFactory(v) {
  if (typeof v === "number") {
    return mixNumber;
  } else if (typeof v === "string") {
    if (color.test(v)) {
      return mixColor;
    } else {
      return mixComplex;
    }
  } else if (Array.isArray(v)) {
    return mixArray;
  } else if (typeof v === "object") {
    return mixObject;
  }
}
function createMixers(output, ease, customMixer) {
  const mixers = [];
  const mixerFactory = customMixer || detectMixerFactory(output[0]);
  const numMixers = output.length - 1;
  for (let i = 0; i < numMixers; i++) {
    let mixer = mixerFactory(output[i], output[i + 1]);
    if (ease) {
      const easingFunction = Array.isArray(ease) ? ease[i] : ease;
      mixer = pipe(easingFunction, mixer);
    }
    mixers.push(mixer);
  }
  return mixers;
}
function fastInterpolate([from, to], [mixer]) {
  return (v) => mixer(progress(from, to, v));
}
function slowInterpolate(input, mixers) {
  const inputLength = input.length;
  const lastInputIndex = inputLength - 1;
  return (v) => {
    let mixerIndex = 0;
    let foundMixerIndex = false;
    if (v <= input[0]) {
      foundMixerIndex = true;
    } else if (v >= input[lastInputIndex]) {
      mixerIndex = lastInputIndex - 1;
      foundMixerIndex = true;
    }
    if (!foundMixerIndex) {
      let i = 1;
      for (; i < inputLength; i++) {
        if (input[i] > v || i === lastInputIndex) {
          break;
        }
      }
      mixerIndex = i - 1;
    }
    const progressInRange = progress(input[mixerIndex], input[mixerIndex + 1], v);
    return mixers[mixerIndex](progressInRange);
  };
}
function interpolate(input, output, { clamp: isClamp = true, ease, mixer } = {}) {
  const inputLength = input.length;
  invariant(inputLength === output.length);
  invariant(!ease || !Array.isArray(ease) || ease.length === inputLength - 1);
  if (input[0] > input[inputLength - 1]) {
    input = [].concat(input);
    output = [].concat(output);
    input.reverse();
    output.reverse();
  }
  const mixers = createMixers(output, ease, mixer);
  const interpolator = inputLength === 2 ? fastInterpolate(input, mixers) : slowInterpolate(input, mixers);
  return isClamp ? (v) => interpolator(clamp$1(input[0], input[inputLength - 1], v)) : interpolator;
}
const reverseEasing = (easing) => (p2) => 1 - easing(1 - p2);
const mirrorEasing = (easing) => (p2) => p2 <= 0.5 ? easing(2 * p2) / 2 : (2 - easing(2 * (1 - p2))) / 2;
const createExpoIn = (power) => (p2) => Math.pow(p2, power);
const createBackIn = (power) => (p2) => p2 * p2 * ((power + 1) * p2 - power);
const createAnticipate = (power) => {
  const backEasing = createBackIn(power);
  return (p2) => (p2 *= 2) < 1 ? 0.5 * backEasing(p2) : 0.5 * (2 - Math.pow(2, -10 * (p2 - 1)));
};
const DEFAULT_OVERSHOOT_STRENGTH = 1.525;
const BOUNCE_FIRST_THRESHOLD = 4 / 11;
const BOUNCE_SECOND_THRESHOLD = 8 / 11;
const BOUNCE_THIRD_THRESHOLD = 9 / 10;
const linear = (p2) => p2;
const easeIn = createExpoIn(2);
const easeOut = reverseEasing(easeIn);
const easeInOut = mirrorEasing(easeIn);
const circIn = (p2) => 1 - Math.sin(Math.acos(p2));
const circOut = reverseEasing(circIn);
const circInOut = mirrorEasing(circOut);
const backIn = createBackIn(DEFAULT_OVERSHOOT_STRENGTH);
const backOut = reverseEasing(backIn);
const backInOut = mirrorEasing(backIn);
const anticipate = createAnticipate(DEFAULT_OVERSHOOT_STRENGTH);
const ca = 4356 / 361;
const cb = 35442 / 1805;
const cc = 16061 / 1805;
const bounceOut = (p2) => {
  if (p2 === 1 || p2 === 0)
    return p2;
  const p22 = p2 * p2;
  return p2 < BOUNCE_FIRST_THRESHOLD ? 7.5625 * p22 : p2 < BOUNCE_SECOND_THRESHOLD ? 9.075 * p22 - 9.9 * p2 + 3.4 : p2 < BOUNCE_THIRD_THRESHOLD ? ca * p22 - cb * p2 + cc : 10.8 * p2 * p2 - 20.52 * p2 + 10.72;
};
const bounceIn = reverseEasing(bounceOut);
const bounceInOut = (p2) => p2 < 0.5 ? 0.5 * (1 - bounceOut(1 - p2 * 2)) : 0.5 * bounceOut(p2 * 2 - 1) + 0.5;
function defaultEasing(values, easing) {
  return values.map(() => easing || easeInOut).splice(0, values.length - 1);
}
function defaultOffset(values) {
  const numValues = values.length;
  return values.map((_value, i) => i !== 0 ? i / (numValues - 1) : 0);
}
function convertOffsetToTimes(offset, duration) {
  return offset.map((o) => o * duration);
}
function keyframes$1({ from = 0, to = 1, ease, offset, duration = 300 }) {
  const state = { done: false, value: from };
  const values = Array.isArray(to) ? to : [from, to];
  const times = convertOffsetToTimes(offset && offset.length === values.length ? offset : defaultOffset(values), duration);
  function createInterpolator() {
    return interpolate(times, values, {
      ease: Array.isArray(ease) ? ease : defaultEasing(values, ease)
    });
  }
  let interpolator = createInterpolator();
  return {
    next: (t) => {
      state.value = interpolator(t);
      state.done = t >= duration;
      return state;
    },
    flipTarget: () => {
      values.reverse();
      interpolator = createInterpolator();
    }
  };
}
function decay({ velocity = 0, from = 0, power = 0.8, timeConstant = 350, restDelta = 0.5, modifyTarget }) {
  const state = { done: false, value: from };
  let amplitude = power * velocity;
  const ideal = from + amplitude;
  const target = modifyTarget === void 0 ? ideal : modifyTarget(ideal);
  if (target !== ideal)
    amplitude = target - from;
  return {
    next: (t) => {
      const delta = -amplitude * Math.exp(-t / timeConstant);
      state.done = !(delta > restDelta || delta < -restDelta);
      state.value = state.done ? target : target + delta;
      return state;
    },
    flipTarget: () => {
    }
  };
}
const types = { keyframes: keyframes$1, spring, decay };
function detectAnimationFromOptions(config) {
  if (Array.isArray(config.to)) {
    return keyframes$1;
  } else if (types[config.type]) {
    return types[config.type];
  }
  const keys = new Set(Object.keys(config));
  if (keys.has("ease") || keys.has("duration") && !keys.has("dampingRatio")) {
    return keyframes$1;
  } else if (keys.has("dampingRatio") || keys.has("stiffness") || keys.has("mass") || keys.has("damping") || keys.has("restSpeed") || keys.has("restDelta")) {
    return spring;
  }
  return keyframes$1;
}
function loopElapsed(elapsed, duration, delay = 0) {
  return elapsed - duration - delay;
}
function reverseElapsed(elapsed, duration, delay = 0, isForwardPlayback = true) {
  return isForwardPlayback ? loopElapsed(duration + -elapsed, duration, delay) : duration - (elapsed - duration) + delay;
}
function hasRepeatDelayElapsed(elapsed, duration, delay, isForwardPlayback) {
  return isForwardPlayback ? elapsed >= duration + delay : elapsed <= -delay;
}
const framesync = (update) => {
  const passTimestamp = ({ delta }) => update(delta);
  return {
    start: () => sync.update(passTimestamp, true),
    stop: () => cancelSync.update(passTimestamp)
  };
};
function animate$1(_a2) {
  var _b, _c;
  var { from, autoplay = true, driver = framesync, elapsed = 0, repeat: repeatMax = 0, repeatType = "loop", repeatDelay = 0, onPlay, onStop, onComplete, onRepeat, onUpdate } = _a2, options = __rest(_a2, ["from", "autoplay", "driver", "elapsed", "repeat", "repeatType", "repeatDelay", "onPlay", "onStop", "onComplete", "onRepeat", "onUpdate"]);
  let { to } = options;
  let driverControls;
  let repeatCount = 0;
  let computedDuration = options.duration;
  let latest;
  let isComplete = false;
  let isForwardPlayback = true;
  let interpolateFromNumber;
  const animator = detectAnimationFromOptions(options);
  if ((_c = (_b = animator).needsInterpolation) === null || _c === void 0 ? void 0 : _c.call(_b, from, to)) {
    interpolateFromNumber = interpolate([0, 100], [from, to], {
      clamp: false
    });
    from = 0;
    to = 100;
  }
  const animation = animator(Object.assign(Object.assign({}, options), { from, to }));
  function repeat() {
    repeatCount++;
    if (repeatType === "reverse") {
      isForwardPlayback = repeatCount % 2 === 0;
      elapsed = reverseElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback);
    } else {
      elapsed = loopElapsed(elapsed, computedDuration, repeatDelay);
      if (repeatType === "mirror")
        animation.flipTarget();
    }
    isComplete = false;
    onRepeat && onRepeat();
  }
  function complete() {
    driverControls.stop();
    onComplete && onComplete();
  }
  function update(delta) {
    if (!isForwardPlayback)
      delta = -delta;
    elapsed += delta;
    if (!isComplete) {
      const state = animation.next(Math.max(0, elapsed));
      latest = state.value;
      if (interpolateFromNumber)
        latest = interpolateFromNumber(latest);
      isComplete = isForwardPlayback ? state.done : elapsed <= 0;
    }
    onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(latest);
    if (isComplete) {
      if (repeatCount === 0)
        computedDuration !== null && computedDuration !== void 0 ? computedDuration : computedDuration = elapsed;
      if (repeatCount < repeatMax) {
        hasRepeatDelayElapsed(elapsed, computedDuration, repeatDelay, isForwardPlayback) && repeat();
      } else {
        complete();
      }
    }
  }
  function play() {
    onPlay === null || onPlay === void 0 ? void 0 : onPlay();
    driverControls = driver(update);
    driverControls.start();
  }
  autoplay && play();
  return {
    stop: () => {
      onStop === null || onStop === void 0 ? void 0 : onStop();
      driverControls.stop();
    }
  };
}
function velocityPerSecond(velocity, frameDuration) {
  return frameDuration ? velocity * (1e3 / frameDuration) : 0;
}
function inertia({ from = 0, velocity = 0, min, max, power = 0.8, timeConstant = 750, bounceStiffness = 500, bounceDamping = 10, restDelta = 1, modifyTarget, driver, onUpdate, onComplete, onStop }) {
  let currentAnimation;
  function isOutOfBounds(v) {
    return min !== void 0 && v < min || max !== void 0 && v > max;
  }
  function boundaryNearest(v) {
    if (min === void 0)
      return max;
    if (max === void 0)
      return min;
    return Math.abs(min - v) < Math.abs(max - v) ? min : max;
  }
  function startAnimation(options) {
    currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop();
    currentAnimation = animate$1(Object.assign(Object.assign({}, options), {
      driver,
      onUpdate: (v) => {
        var _a2;
        onUpdate === null || onUpdate === void 0 ? void 0 : onUpdate(v);
        (_a2 = options.onUpdate) === null || _a2 === void 0 ? void 0 : _a2.call(options, v);
      },
      onComplete,
      onStop
    }));
  }
  function startSpring(options) {
    startAnimation(Object.assign({ type: "spring", stiffness: bounceStiffness, damping: bounceDamping, restDelta }, options));
  }
  if (isOutOfBounds(from)) {
    startSpring({ from, velocity, to: boundaryNearest(from) });
  } else {
    let target = power * velocity + from;
    if (typeof modifyTarget !== "undefined")
      target = modifyTarget(target);
    const boundary = boundaryNearest(target);
    const heading = boundary === min ? -1 : 1;
    let prev;
    let current;
    const checkBoundary = (v) => {
      prev = current;
      current = v;
      velocity = velocityPerSecond(v - prev, getFrameData().delta);
      if (heading === 1 && v > boundary || heading === -1 && v < boundary) {
        startSpring({ from: v, to: boundary, velocity });
      }
    };
    startAnimation({
      type: "decay",
      from,
      velocity,
      timeConstant,
      power,
      restDelta,
      modifyTarget,
      onUpdate: isOutOfBounds(target) ? checkBoundary : void 0
    });
  }
  return {
    stop: () => currentAnimation === null || currentAnimation === void 0 ? void 0 : currentAnimation.stop()
  };
}
const a = (a1, a2) => 1 - 3 * a2 + 3 * a1;
const b = (a1, a2) => 3 * a2 - 6 * a1;
const c = (a1) => 3 * a1;
const calcBezier = (t, a1, a2) => ((a(a1, a2) * t + b(a1, a2)) * t + c(a1)) * t;
const getSlope = (t, a1, a2) => 3 * a(a1, a2) * t * t + 2 * b(a1, a2) * t + c(a1);
const subdivisionPrecision = 1e-7;
const subdivisionMaxIterations = 10;
function binarySubdivide(aX, aA, aB, mX1, mX2) {
  let currentX;
  let currentT;
  let i = 0;
  do {
    currentT = aA + (aB - aA) / 2;
    currentX = calcBezier(currentT, mX1, mX2) - aX;
    if (currentX > 0) {
      aB = currentT;
    } else {
      aA = currentT;
    }
  } while (Math.abs(currentX) > subdivisionPrecision && ++i < subdivisionMaxIterations);
  return currentT;
}
const newtonIterations = 8;
const newtonMinSlope = 1e-3;
function newtonRaphsonIterate(aX, aGuessT, mX1, mX2) {
  for (let i = 0; i < newtonIterations; ++i) {
    const currentSlope = getSlope(aGuessT, mX1, mX2);
    if (currentSlope === 0) {
      return aGuessT;
    }
    const currentX = calcBezier(aGuessT, mX1, mX2) - aX;
    aGuessT -= currentX / currentSlope;
  }
  return aGuessT;
}
const kSplineTableSize = 11;
const kSampleStepSize = 1 / (kSplineTableSize - 1);
function cubicBezier(mX1, mY1, mX2, mY2) {
  if (mX1 === mY1 && mX2 === mY2)
    return linear;
  const sampleValues = new Float32Array(kSplineTableSize);
  for (let i = 0; i < kSplineTableSize; ++i) {
    sampleValues[i] = calcBezier(i * kSampleStepSize, mX1, mX2);
  }
  function getTForX(aX) {
    let intervalStart = 0;
    let currentSample = 1;
    const lastSample = kSplineTableSize - 1;
    for (; currentSample !== lastSample && sampleValues[currentSample] <= aX; ++currentSample) {
      intervalStart += kSampleStepSize;
    }
    --currentSample;
    const dist = (aX - sampleValues[currentSample]) / (sampleValues[currentSample + 1] - sampleValues[currentSample]);
    const guessForT = intervalStart + dist * kSampleStepSize;
    const initialSlope = getSlope(guessForT, mX1, mX2);
    if (initialSlope >= newtonMinSlope) {
      return newtonRaphsonIterate(aX, guessForT, mX1, mX2);
    } else if (initialSlope === 0) {
      return guessForT;
    } else {
      return binarySubdivide(aX, intervalStart, intervalStart + kSampleStepSize, mX1, mX2);
    }
  }
  return (t) => t === 0 || t === 1 ? t : calcBezier(getTForX(t), mY1, mY2);
}
const motionState = {};
class SubscriptionManager {
  constructor() {
    this.subscriptions = /* @__PURE__ */ new Set();
  }
  add(handler) {
    this.subscriptions.add(handler);
    return () => this.subscriptions.delete(handler);
  }
  notify(a2, b2, c2) {
    if (!this.subscriptions.size)
      return;
    for (const handler of this.subscriptions)
      handler(a2, b2, c2);
  }
  clear() {
    this.subscriptions.clear();
  }
}
const isFloat = (value) => {
  return !isNaN(parseFloat(value));
};
class MotionValue {
  constructor(init) {
    this.timeDelta = 0;
    this.lastUpdated = 0;
    this.updateSubscribers = new SubscriptionManager();
    this.canTrackVelocity = false;
    this.updateAndNotify = (v) => {
      this.prev = this.current;
      this.current = v;
      const { delta, timestamp } = getFrameData();
      if (this.lastUpdated !== timestamp) {
        this.timeDelta = delta;
        this.lastUpdated = timestamp;
      }
      sync.postRender(this.scheduleVelocityCheck);
      this.updateSubscribers.notify(this.current);
    };
    this.scheduleVelocityCheck = () => sync.postRender(this.velocityCheck);
    this.velocityCheck = ({ timestamp }) => {
      if (!this.canTrackVelocity)
        this.canTrackVelocity = isFloat(this.current);
      if (timestamp !== this.lastUpdated)
        this.prev = this.current;
    };
    this.prev = this.current = init;
    this.canTrackVelocity = isFloat(this.current);
  }
  onChange(subscription) {
    return this.updateSubscribers.add(subscription);
  }
  clearListeners() {
    this.updateSubscribers.clear();
  }
  set(v) {
    this.updateAndNotify(v);
  }
  get() {
    return this.current;
  }
  getPrevious() {
    return this.prev;
  }
  getVelocity() {
    return this.canTrackVelocity ? velocityPerSecond(parseFloat(this.current) - parseFloat(this.prev), this.timeDelta) : 0;
  }
  start(animation) {
    this.stop();
    return new Promise((resolve2) => {
      const { stop } = animation(resolve2);
      this.stopAnimation = stop;
    }).then(() => this.clearAnimation());
  }
  stop() {
    if (this.stopAnimation)
      this.stopAnimation();
    this.clearAnimation();
  }
  isAnimating() {
    return !!this.stopAnimation;
  }
  clearAnimation() {
    this.stopAnimation = null;
  }
  destroy() {
    this.updateSubscribers.clear();
    this.stop();
  }
}
function getMotionValue(init) {
  return new MotionValue(init);
}
const { isArray } = Array;
function useMotionValues() {
  const motionValues = ref({});
  const stop = (keys) => {
    const destroyKey = (key) => {
      if (!motionValues.value[key])
        return;
      motionValues.value[key].stop();
      motionValues.value[key].destroy();
      del(motionValues.value, key);
    };
    if (keys) {
      if (isArray(keys)) {
        keys.forEach(destroyKey);
      } else {
        destroyKey(keys);
      }
    } else {
      Object.keys(motionValues.value).forEach(destroyKey);
    }
  };
  const get2 = (key, from, target) => {
    if (motionValues.value[key])
      return motionValues.value[key];
    const motionValue = getMotionValue(from);
    motionValue.onChange((v) => {
      set(target, key, v);
    });
    set(motionValues.value, key, motionValue);
    return motionValue;
  };
  tryOnUnmounted(stop);
  return {
    motionValues,
    get: get2,
    stop
  };
}
const isKeyframesTarget = (v) => {
  return Array.isArray(v);
};
const underDampedSpring = () => ({
  type: "spring",
  stiffness: 500,
  damping: 25,
  restDelta: 0.5,
  restSpeed: 10
});
const criticallyDampedSpring = (to) => ({
  type: "spring",
  stiffness: 550,
  damping: to === 0 ? 2 * Math.sqrt(550) : 30,
  restDelta: 0.01,
  restSpeed: 10
});
const overDampedSpring = (to) => ({
  type: "spring",
  stiffness: 550,
  damping: to === 0 ? 100 : 30,
  restDelta: 0.01,
  restSpeed: 10
});
const linearTween = () => ({
  type: "keyframes",
  ease: "linear",
  duration: 300
});
const keyframes = (values) => ({
  type: "keyframes",
  duration: 800,
  values
});
const defaultTransitions = {
  default: overDampedSpring,
  x: underDampedSpring,
  y: underDampedSpring,
  z: underDampedSpring,
  rotate: underDampedSpring,
  rotateX: underDampedSpring,
  rotateY: underDampedSpring,
  rotateZ: underDampedSpring,
  scaleX: criticallyDampedSpring,
  scaleY: criticallyDampedSpring,
  scale: criticallyDampedSpring,
  backgroundColor: linearTween,
  color: linearTween,
  opacity: linearTween
};
const getDefaultTransition = (valueKey, to) => {
  let transitionFactory;
  if (isKeyframesTarget(to)) {
    transitionFactory = keyframes;
  } else {
    transitionFactory = defaultTransitions[valueKey] || defaultTransitions.default;
  }
  return { to, ...transitionFactory(to) };
};
const int = {
  ...number,
  transform: Math.round
};
const valueTypes = {
  color,
  backgroundColor: color,
  outlineColor: color,
  fill: color,
  stroke: color,
  borderColor: color,
  borderTopColor: color,
  borderRightColor: color,
  borderBottomColor: color,
  borderLeftColor: color,
  borderWidth: px,
  borderTopWidth: px,
  borderRightWidth: px,
  borderBottomWidth: px,
  borderLeftWidth: px,
  borderRadius: px,
  radius: px,
  borderTopLeftRadius: px,
  borderTopRightRadius: px,
  borderBottomRightRadius: px,
  borderBottomLeftRadius: px,
  width: px,
  maxWidth: px,
  height: px,
  maxHeight: px,
  size: px,
  top: px,
  right: px,
  bottom: px,
  left: px,
  padding: px,
  paddingTop: px,
  paddingRight: px,
  paddingBottom: px,
  paddingLeft: px,
  margin: px,
  marginTop: px,
  marginRight: px,
  marginBottom: px,
  marginLeft: px,
  rotate: degrees,
  rotateX: degrees,
  rotateY: degrees,
  rotateZ: degrees,
  scale,
  scaleX: scale,
  scaleY: scale,
  scaleZ: scale,
  skew: degrees,
  skewX: degrees,
  skewY: degrees,
  distance: px,
  translateX: px,
  translateY: px,
  translateZ: px,
  x: px,
  y: px,
  z: px,
  perspective: px,
  transformPerspective: px,
  opacity: alpha,
  originX: progressPercentage,
  originY: progressPercentage,
  originZ: px,
  zIndex: int,
  filter,
  WebkitFilter: filter,
  fillOpacity: alpha,
  strokeOpacity: alpha,
  numOctaves: int
};
const getValueType = (key) => valueTypes[key];
const getValueAsType = (value, type) => {
  return type && typeof value === "number" && type.transform ? type.transform(value) : value;
};
function getAnimatableNone(key, value) {
  let defaultValueType = getValueType(key);
  if (defaultValueType !== filter)
    defaultValueType = complex;
  return defaultValueType.getAnimatableNone ? defaultValueType.getAnimatableNone(value) : void 0;
}
const easingLookup = {
  linear,
  easeIn,
  easeInOut,
  easeOut,
  circIn,
  circInOut,
  circOut,
  backIn,
  backInOut,
  backOut,
  anticipate,
  bounceIn,
  bounceInOut,
  bounceOut
};
const easingDefinitionToFunction = (definition) => {
  if (Array.isArray(definition)) {
    const [x1, y1, x2, y2] = definition;
    return cubicBezier(x1, y1, x2, y2);
  } else if (typeof definition === "string") {
    return easingLookup[definition];
  }
  return definition;
};
const isEasingArray = (ease) => {
  return Array.isArray(ease) && typeof ease[0] !== "number";
};
const isAnimatable = (key, value) => {
  if (key === "zIndex")
    return false;
  if (typeof value === "number" || Array.isArray(value))
    return true;
  if (typeof value === "string" && complex.test(value) && !value.startsWith("url("))
    return true;
  return false;
};
function hydrateKeyframes(options) {
  if (Array.isArray(options.to) && options.to[0] === null) {
    options.to = [...options.to];
    options.to[0] = options.from;
  }
  return options;
}
function convertTransitionToAnimationOptions({
  ease,
  times,
  delay,
  ...transition
}) {
  const options = { ...transition };
  if (times)
    options.offset = times;
  if (ease) {
    options.ease = isEasingArray(ease) ? ease.map(easingDefinitionToFunction) : easingDefinitionToFunction(ease);
  }
  if (delay)
    options.elapsed = -delay;
  return options;
}
function getPopmotionAnimationOptions(transition, options, key) {
  if (Array.isArray(options.to)) {
    if (!transition.duration)
      transition.duration = 800;
  }
  hydrateKeyframes(options);
  if (!isTransitionDefined(transition)) {
    transition = {
      ...transition,
      ...getDefaultTransition(key, options.to)
    };
  }
  return {
    ...options,
    ...convertTransitionToAnimationOptions(transition)
  };
}
function isTransitionDefined({
  delay,
  repeat,
  repeatType,
  repeatDelay,
  from,
  ...transition
}) {
  return !!Object.keys(transition).length;
}
function getValueTransition(transition, key) {
  return transition[key] || transition.default || transition;
}
function getAnimation(key, value, target, transition, onComplete) {
  const valueTransition = getValueTransition(transition, key);
  let origin = valueTransition.from === null || valueTransition.from === void 0 ? value.get() : valueTransition.from;
  const isTargetAnimatable = isAnimatable(key, target);
  if (origin === "none" && isTargetAnimatable && typeof target === "string")
    origin = getAnimatableNone(key, target);
  const isOriginAnimatable = isAnimatable(key, origin);
  function start(complete) {
    const options = {
      from: origin,
      to: target,
      velocity: transition.velocity ? transition.velocity : value.getVelocity(),
      onUpdate: (v) => value.set(v)
    };
    return valueTransition.type === "inertia" || valueTransition.type === "decay" ? inertia({ ...options, ...valueTransition }) : animate$1({
      ...getPopmotionAnimationOptions(valueTransition, options, key),
      onUpdate: (v) => {
        options.onUpdate(v);
        if (valueTransition.onUpdate)
          valueTransition.onUpdate(v);
      },
      onComplete: () => {
        if (transition.onComplete)
          transition.onComplete();
        if (onComplete)
          onComplete();
        if (complete)
          complete();
      }
    });
  }
  function set2(complete) {
    value.set(target);
    if (transition.onComplete)
      transition.onComplete();
    if (onComplete)
      onComplete();
    if (complete)
      complete();
    return { stop: () => {
    } };
  }
  return !isOriginAnimatable || !isTargetAnimatable || valueTransition.type === false ? set2 : start;
}
function useMotionTransitions() {
  const { motionValues, stop, get: get2 } = useMotionValues();
  const push = (key, value, target, transition = {}, onComplete) => {
    const from = target[key];
    const motionValue = get2(key, from, target);
    if (transition && transition.immediate) {
      motionValue.set(value);
      return;
    }
    const animation = getAnimation(key, motionValue, value, transition, onComplete);
    motionValue.start(animation);
  };
  return { motionValues, stop, push };
}
function useMotionControls(motionProperties, variants = {}, { motionValues, push, stop } = useMotionTransitions()) {
  const _variants = unref(variants);
  const isAnimating = ref(false);
  const _stopWatchAnimating = watch(motionValues, (newVal) => {
    isAnimating.value = Object.values(newVal).filter((value) => value.isAnimating()).length > 0;
  }, {
    immediate: true,
    deep: true
  });
  const getVariantFromKey = (variant) => {
    if (!_variants || !_variants[variant])
      throw new Error(`The variant ${variant} does not exist.`);
    return _variants[variant];
  };
  const apply = (variant) => {
    if (typeof variant === "string")
      variant = getVariantFromKey(variant);
    return Promise.all(Object.entries(variant).map(([key, value]) => {
      if (key === "transition")
        return void 0;
      return new Promise((resolve2) => {
        push(key, value, motionProperties, variant.transition || getDefaultTransition(key, variant[key]), resolve2);
      });
    }).filter(Boolean));
  };
  const set2 = (variant) => {
    const variantData = isObject(variant) ? variant : getVariantFromKey(variant);
    Object.entries(variantData).forEach(([key, value]) => {
      if (key === "transition")
        return;
      push(key, value, motionProperties, {
        immediate: true
      });
    });
  };
  const leave = async (done) => {
    let leaveVariant;
    if (_variants) {
      if (_variants.leave)
        leaveVariant = _variants.leave;
      if (!_variants.leave && _variants.initial)
        leaveVariant = _variants.initial;
    }
    if (!leaveVariant) {
      done();
      return;
    }
    await apply(leaveVariant);
    done();
  };
  return {
    isAnimating,
    apply,
    set: set2,
    stopTransitions: () => {
      _stopWatchAnimating();
      stop();
    },
    leave
  };
}
const isBrowser = typeof window !== "undefined";
const supportsPointerEvents = () => isBrowser && window.onpointerdown === null;
const supportsTouchEvents = () => isBrowser && window.ontouchstart === null;
const supportsMouseEvents = () => isBrowser && window.onmousedown === null;
function registerEventListeners({
  target,
  state,
  variants,
  apply
}) {
  const _variants = unref(variants);
  const _eventListeners = [];
  const _useEventListener = (...args) => {
    const _stop = useEventListener.apply(null, args);
    _eventListeners.push(_stop);
    return _stop;
  };
  const hovered = ref(false);
  const tapped = ref(false);
  const focused = ref(false);
  const mutableKeys = computed(() => {
    let result = [];
    if (!_variants)
      return result;
    if (_variants.hovered)
      result = [...result, ...Object.keys(_variants.hovered)];
    if (_variants.tapped)
      result = [...result, ...Object.keys(_variants.tapped)];
    if (_variants.focused)
      result = [...result, ...Object.keys(_variants.focused)];
    return result;
  });
  const computedProperties = computed(() => {
    const result = {};
    Object.assign(result, state.value);
    if (hovered.value && _variants.hovered)
      Object.assign(result, _variants.hovered);
    if (tapped.value && _variants.tapped)
      Object.assign(result, _variants.tapped);
    if (focused.value && _variants.focused)
      Object.assign(result, _variants.focused);
    for (const key in result)
      if (!mutableKeys.value.includes(key))
        delete result[key];
    return result;
  });
  if (_variants.hovered) {
    _useEventListener(target, "mouseenter", () => {
      hovered.value = true;
    });
    _useEventListener(target, "mouseleave", () => {
      hovered.value = false;
      tapped.value = false;
    });
    _useEventListener(target, "mouseout", () => {
      hovered.value = false;
      tapped.value = false;
    });
  }
  if (_variants.tapped) {
    if (supportsMouseEvents()) {
      _useEventListener(target, "mousedown", () => {
        tapped.value = true;
      });
      _useEventListener(target, "mouseup", () => {
        tapped.value = false;
      });
    }
    if (supportsPointerEvents()) {
      _useEventListener(target, "pointerdown", () => {
        tapped.value = true;
      });
      _useEventListener(target, "pointerup", () => {
        tapped.value = false;
      });
    }
    if (supportsTouchEvents()) {
      _useEventListener(target, "touchstart", () => {
        tapped.value = true;
      });
      _useEventListener(target, "touchend", () => {
        tapped.value = false;
      });
    }
  }
  if (_variants.focused) {
    _useEventListener(target, "focus", () => {
      focused.value = true;
    });
    _useEventListener(target, "blur", () => {
      focused.value = false;
    });
  }
  const _stopSync = watch(computedProperties, apply);
  const stop = () => {
    _eventListeners.forEach((stopFn) => stopFn());
    _stopSync();
  };
  return { stop };
}
function registerLifeCycleHooks({
  set: set2,
  target,
  variants,
  variant
}) {
  const _variants = unref(variants);
  const stop = watch(() => target, () => {
    if (!_variants)
      return;
    if (_variants.initial)
      set2("initial");
    if (_variants.enter)
      variant.value = "enter";
  }, {
    immediate: true,
    flush: "pre"
  });
  return { stop };
}
function registerVariantsSync({
  state,
  apply
}) {
  const stop = watch(state, (newVal) => {
    if (newVal)
      apply(newVal);
  }, {
    immediate: true
  });
  return { stop };
}
function registerVisibilityHooks({
  target,
  variants,
  variant
}) {
  const _variants = unref(variants);
  let stop = noop;
  if (_variants && (_variants.visible || _variants.visibleOnce)) {
    const { stop: stopObserver } = useIntersectionObserver(target, ([{ isIntersecting }]) => {
      if (_variants.visible) {
        if (isIntersecting)
          variant.value = "visible";
        else
          variant.value = "initial";
      } else if (_variants.visibleOnce) {
        if (isIntersecting) {
          if (variant.value !== "visibleOnce")
            variant.value = "visibleOnce";
        } else {
          if (!variant.value)
            variant.value = "initial";
        }
      }
    });
    stop = stopObserver;
  }
  return {
    stop
  };
}
function useMotionFeatures(instance, options = {
  syncVariants: true,
  lifeCycleHooks: true,
  visibilityHooks: true,
  eventListeners: true
}) {
  const toStop = ref([]);
  if (options.lifeCycleHooks) {
    const { stop: stopLifeCycleHooks } = registerLifeCycleHooks(instance);
    toStop.value.push(stopLifeCycleHooks);
  }
  if (options.syncVariants) {
    const { stop: stopVariantSync } = registerVariantsSync(instance);
    toStop.value.push(stopVariantSync);
  }
  if (options.visibilityHooks) {
    const { stop: stopVisibilityHooks } = registerVisibilityHooks(instance);
    toStop.value.push(stopVisibilityHooks);
  }
  if (options.eventListeners) {
    const { stop: stopEventListeners } = registerEventListeners(instance);
    toStop.value.push(stopEventListeners);
  }
  const stop = () => toStop.value.forEach((_stop) => _stop());
  tryOnUnmounted(stop);
  return { stop };
}
function reactiveStyle(props = {}) {
  const state = reactive({
    ...props
  });
  const style = ref({});
  watch(state, () => {
    const result = {};
    for (const [key, value] of Object.entries(state)) {
      const valueType = getValueType(key);
      const valueAsType = getValueAsType(value, valueType);
      result[key] = valueAsType;
    }
    style.value = result;
  }, {
    immediate: true,
    deep: true
  });
  return {
    state,
    style
  };
}
const transformAxes = ["", "X", "Y", "Z"];
const order = ["perspective", "translate", "scale", "rotate", "skew"];
const transformProps = ["transformPerspective", "x", "y", "z"];
order.forEach((operationKey) => {
  transformAxes.forEach((axesKey) => {
    const key = operationKey + axesKey;
    transformProps.push(key);
  });
});
const transformPropSet = new Set(transformProps);
function isTransformProp(key) {
  return transformPropSet.has(key);
}
const transformOriginProps = /* @__PURE__ */ new Set(["originX", "originY", "originZ"]);
function isTransformOriginProp(key) {
  return transformOriginProps.has(key);
}
function splitValues(variant) {
  const transform = {};
  const style = {};
  Object.entries(variant).forEach(([key, value]) => {
    if (isTransformProp(key) || isTransformOriginProp(key))
      transform[key] = value;
    else
      style[key] = value;
  });
  return { transform, style };
}
function useElementStyle(target, onInit) {
  let _cache;
  let _target;
  const { state, style } = reactiveStyle();
  const stopInitWatch = watch(() => unrefElement(target), (el) => {
    if (!el)
      return;
    _target = el;
    for (const key of Object.keys(valueTypes)) {
      if (el.style[key] === null || el.style[key] === "" || isTransformProp(key) || isTransformOriginProp(key))
        continue;
      set(state, key, el.style[key]);
    }
    if (_cache) {
      Object.entries(_cache).forEach(([key, value]) => set(el.style, key, value));
    }
    if (onInit)
      onInit(state);
  }, {
    immediate: true
  });
  const stopSyncWatch = watch(style, (newVal) => {
    if (!_target) {
      _cache = newVal;
      return;
    }
    for (const key in newVal)
      set(_target.style, key, newVal[key]);
  }, {
    immediate: true
  });
  const stop = () => {
    _target = void 0;
    _cache = void 0;
    stopInitWatch();
    stopSyncWatch();
  };
  return {
    style: state,
    stop
  };
}
const translateAlias = {
  x: "translateX",
  y: "translateY",
  z: "translateZ"
};
function reactiveTransform(props = {}, enableHardwareAcceleration = true) {
  const state = reactive({ ...props });
  const transform = ref("");
  watch(state, (newVal) => {
    let result = "";
    let hasHardwareAcceleration = false;
    if (enableHardwareAcceleration && (newVal.x || newVal.y || newVal.z)) {
      const str = [newVal.x || 0, newVal.y || 0, newVal.z || 0].map(px.transform).join(",");
      result += `translate3d(${str}) `;
      hasHardwareAcceleration = true;
    }
    for (const [key, value] of Object.entries(newVal)) {
      if (enableHardwareAcceleration && (key === "x" || key === "y" || key === "z"))
        continue;
      const valueType = getValueType(key);
      const valueAsType = getValueAsType(value, valueType);
      result += `${translateAlias[key] || key}(${valueAsType}) `;
    }
    if (enableHardwareAcceleration && !hasHardwareAcceleration)
      result += "translateZ(0px) ";
    transform.value = result.trim();
  }, {
    immediate: true,
    deep: true
  });
  return {
    state,
    transform
  };
}
function parseTransform(transform) {
  const transforms = transform.trim().split(/\) |\)/);
  if (transforms.length === 1)
    return {};
  const parseValues = (value) => {
    if (value.endsWith("px") || value.endsWith("deg"))
      return parseFloat(value);
    if (isNaN(Number(value)))
      return Number(value);
    return value;
  };
  return transforms.reduce((acc, transform2) => {
    if (!transform2)
      return acc;
    const [name, transformValue] = transform2.split("(");
    const valueArray = transformValue.split(",");
    const values = valueArray.map((val) => {
      return parseValues(val.endsWith(")") ? val.replace(")", "") : val.trim());
    });
    const value = values.length === 1 ? values[0] : values;
    return {
      ...acc,
      [name]: value
    };
  }, {});
}
function stateFromTransform(state, transform) {
  Object.entries(parseTransform(transform)).forEach(([key, value]) => {
    value = parseFloat(value);
    const axes = ["x", "y", "z"];
    if (key === "translate3d") {
      if (value === 0) {
        axes.forEach((axis) => {
          set(state, axis, 0);
        });
        return;
      }
      value.forEach((axisValue, index2) => {
        set(state, axes[index2], axisValue);
      });
      return;
    }
    if (key === "translateX") {
      set(state, "x", value);
      return;
    }
    if (key === "translateY") {
      set(state, "y", value);
      return;
    }
    if (key === "translateZ") {
      set(state, "z", value);
      return;
    }
    set(state, key, value);
  });
}
function useElementTransform(target, onInit) {
  let _cache;
  let _target;
  const { state, transform } = reactiveTransform();
  const stopInitWatch = watch(() => unrefElement(target), (el) => {
    if (!el)
      return;
    _target = el;
    if (el.style.transform)
      stateFromTransform(state, el.style.transform);
    if (_cache)
      el.style.transform = _cache;
    if (onInit)
      onInit(state);
  }, {
    immediate: true
  });
  const stopSyncWatch = watch(transform, (newValue) => {
    if (!_target) {
      _cache = newValue;
      return;
    }
    _target.style.transform = newValue;
  }, {
    immediate: true
  });
  const stop = () => {
    _cache = void 0;
    _target = void 0;
    stopInitWatch();
    stopSyncWatch();
  };
  return {
    transform: state,
    stop
  };
}
function useMotionProperties(target, defaultValues) {
  const motionProperties = reactive({});
  const apply = (values) => {
    Object.entries(values).forEach(([key, value]) => {
      set(motionProperties, key, value);
    });
  };
  const { style, stop: stopStyleWatchers } = useElementStyle(target, apply);
  const { transform, stop: stopTransformWatchers } = useElementTransform(target, apply);
  const stopPropertiesWatch = watch(motionProperties, (newVal) => {
    Object.entries(newVal).forEach(([key, value]) => {
      const target2 = isTransformProp(key) ? transform : style;
      if (target2[key] && target2[key] === value)
        return;
      set(target2, key, value);
    });
  }, {
    immediate: true,
    deep: true
  });
  const stopInitWatch = watch(() => unrefElement(target), (el) => {
    if (!el)
      return;
    if (defaultValues)
      apply(defaultValues);
  }, {
    immediate: true
  });
  const stop = () => {
    stopStyleWatchers();
    stopTransformWatchers();
    stopPropertiesWatch();
    stopInitWatch();
  };
  return {
    motionProperties,
    style,
    transform,
    stop
  };
}
function useMotionVariants(variants = {}) {
  const _variants = unref(variants);
  const variant = ref();
  const state = computed(() => {
    if (!variant.value)
      return;
    return _variants[variant.value];
  });
  return {
    state,
    variant
  };
}
function useMotion(target, variants = {}, options) {
  const { motionProperties, stop: stopMotionProperties } = useMotionProperties(target);
  const { variant, state } = useMotionVariants(variants);
  const controls = useMotionControls(motionProperties, variants);
  const instance = {
    target,
    variant,
    variants,
    state,
    motionProperties,
    ...controls,
    stop: (force = false) => {
    }
  };
  const { stop: stopMotionFeatures } = useMotionFeatures(instance, options);
  instance.stop = (force = false) => {
    const _stop = () => {
      instance.stopTransitions();
      stopMotionProperties();
      stopMotionFeatures();
    };
    if (!force && variants.value && variants.value.leave) {
      const _stopWatch = watch(instance.isAnimating, (newVal) => {
        if (!newVal) {
          _stopWatch();
          _stop();
        }
      });
    } else {
      _stop();
    }
  };
  tryOnUnmounted(() => instance.stop());
  return instance;
}
const directivePropsKeys = [
  "initial",
  "enter",
  "leave",
  "visible",
  "visible-once",
  "hovered",
  "tapped",
  "focused",
  "delay"
];
const resolveVariants = (node, variantsRef) => {
  const target = node.props ? node.props : node.data && node.data.attrs ? node.data.attrs : {};
  if (target) {
    if (target.variants && isObject(target.variants)) {
      variantsRef.value = {
        ...variantsRef.value,
        ...target.variants
      };
    }
    directivePropsKeys.forEach((key) => {
      if (key === "delay") {
        if (target && target[key] && isNumber(target[key])) {
          const delay = target[key];
          if (variantsRef && variantsRef.value) {
            if (variantsRef.value.enter) {
              if (!variantsRef.value.enter.transition)
                variantsRef.value.enter.transition = {};
              variantsRef.value.enter.transition = {
                ...variantsRef.value.enter.transition,
                delay
              };
            }
            if (variantsRef.value.visible) {
              if (!variantsRef.value.visible.transition)
                variantsRef.value.visible.transition = {};
              variantsRef.value.visible.transition = {
                ...variantsRef.value.visible.transition,
                delay
              };
            }
            if (variantsRef.value.visibleOnce) {
              if (!variantsRef.value.visibleOnce.transition)
                variantsRef.value.visibleOnce.transition = {};
              variantsRef.value.visibleOnce.transition = {
                ...variantsRef.value.visibleOnce.transition,
                delay
              };
            }
          }
        }
        return;
      }
      if (key === "visible-once")
        key = "visibleOnce";
      if (target && target[key] && isObject(target[key]))
        variantsRef.value[key] = target[key];
    });
  }
};
const directive = (variants) => {
  const register = (el, binding, node) => {
    const key = binding.value && typeof binding.value === "string" ? binding.value : node.key;
    if (key && motionState[key])
      motionState[key].stop();
    const variantsRef = ref(variants || {});
    if (typeof binding.value === "object")
      variantsRef.value = binding.value;
    resolveVariants(node, variantsRef);
    const motionInstance = useMotion(el, variantsRef);
    el.motionInstance = motionInstance;
    if (key)
      set(motionState, key, motionInstance);
  };
  const unregister = (el) => {
    if (el.motionInstance)
      el.motionInstance.stop();
  };
  return {
    created: register,
    unmounted: unregister,
    bind: register,
    unbind: unregister,
    getSSRProps(binding, el) {
      const { initial } = binding.value || el.props || {};
      if (!initial || Object.keys(initial).length === 0)
        return;
      const { transform: _transform, style: _style } = splitValues(initial);
      const { transform } = reactiveTransform(_transform);
      const { style } = reactiveStyle(_style);
      if (transform.value)
        style.value.transform = transform.value;
      return {
        style: style.value
      };
    }
  };
};
const fade = {
  initial: {
    opacity: 0
  },
  enter: {
    opacity: 1
  }
};
const fadeVisible = {
  initial: {
    opacity: 0
  },
  visible: {
    opacity: 1
  }
};
const fadeVisibleOnce = {
  initial: {
    opacity: 0
  },
  visibleOnce: {
    opacity: 1
  }
};
const pop = {
  initial: {
    scale: 0,
    opacity: 0
  },
  enter: {
    scale: 1,
    opacity: 1
  }
};
const popVisible = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visible: {
    scale: 1,
    opacity: 1
  }
};
const popVisibleOnce = {
  initial: {
    scale: 0,
    opacity: 0
  },
  visibleOnce: {
    scale: 1,
    opacity: 1
  }
};
const rollLeft = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  enter: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleLeft = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  visible: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceLeft = {
  initial: {
    x: -100,
    rotate: 90,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollRight = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  enter: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleRight = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  visible: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceRight = {
  initial: {
    x: 100,
    rotate: -90,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollTop = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  enter: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleTop = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceTop = {
  initial: {
    y: -100,
    rotate: -90,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollBottom = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  enter: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleBottom = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  visible: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const rollVisibleOnceBottom = {
  initial: {
    y: 100,
    rotate: 90,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    rotate: 0,
    opacity: 1
  }
};
const slideLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  enter: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleOnceLeft = {
  initial: {
    x: -100,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    opacity: 1
  }
};
const slideRight = {
  initial: {
    x: 100,
    opacity: 0
  },
  enter: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleRight = {
  initial: {
    x: 100,
    opacity: 0
  },
  visible: {
    x: 0,
    opacity: 1
  }
};
const slideVisibleOnceRight = {
  initial: {
    x: 100,
    opacity: 0
  },
  visibleOnce: {
    x: 0,
    opacity: 1
  }
};
const slideTop = {
  initial: {
    y: -100,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleTop = {
  initial: {
    y: -100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleOnceTop = {
  initial: {
    y: -100,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1
  }
};
const slideBottom = {
  initial: {
    y: 100,
    opacity: 0
  },
  enter: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleBottom = {
  initial: {
    y: 100,
    opacity: 0
  },
  visible: {
    y: 0,
    opacity: 1
  }
};
const slideVisibleOnceBottom = {
  initial: {
    y: 100,
    opacity: 0
  },
  visibleOnce: {
    y: 0,
    opacity: 1
  }
};
const presets = {
  __proto__: null,
  fade,
  fadeVisible,
  fadeVisibleOnce,
  pop,
  popVisible,
  popVisibleOnce,
  rollBottom,
  rollLeft,
  rollRight,
  rollTop,
  rollVisibleBottom,
  rollVisibleLeft,
  rollVisibleRight,
  rollVisibleTop,
  rollVisibleOnceBottom,
  rollVisibleOnceLeft,
  rollVisibleOnceRight,
  rollVisibleOnceTop,
  slideBottom,
  slideLeft,
  slideRight,
  slideTop,
  slideVisibleBottom,
  slideVisibleLeft,
  slideVisibleRight,
  slideVisibleTop,
  slideVisibleOnceBottom,
  slideVisibleOnceLeft,
  slideVisibleOnceRight,
  slideVisibleOnceTop
};
function slugify(string) {
  const a2 = "\xE0\xE1\xE2\xE4\xE6\xE3\xE5\u0101\u0103\u0105\xE7\u0107\u010D\u0111\u010F\xE8\xE9\xEA\xEB\u0113\u0117\u0119\u011B\u011F\u01F5\u1E27\xEE\xEF\xED\u012B\u012F\xEC\u0142\u1E3F\xF1\u0144\u01F9\u0148\xF4\xF6\xF2\xF3\u0153\xF8\u014D\xF5\u0151\u1E55\u0155\u0159\xDF\u015B\u0161\u015F\u0219\u0165\u021B\xFB\xFC\xF9\xFA\u016B\u01D8\u016F\u0171\u0173\u1E83\u1E8D\xFF\xFD\u017E\u017A\u017C\xB7/_,:;";
  const b2 = "aaaaaaaaaacccddeeeeeeeegghiiiiiilmnnnnoooooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p2 = new RegExp(a2.split("").join("|"), "g");
  return string.toString().replace(/[A-Z]/g, (s) => `-${s}`).toLowerCase().replace(/\s+/g, "-").replace(p2, (c2) => b2.charAt(a2.indexOf(c2))).replace(/&/g, "-and-").replace(/[^\w\-]+/g, "").replace(/\-\-+/g, "-").replace(/^-+/, "").replace(/-+$/, "");
}
const MotionPlugin = {
  install(app2, options) {
    app2.directive("motion", directive());
    if (!options || options && !options.excludePresets) {
      for (const key in presets) {
        const preset = presets[key];
        app2.directive(`motion-${slugify(key)}`, directive(preset));
      }
    }
    if (options && options.directives) {
      for (const key in options.directives) {
        const variants = options.directives[key];
        if (!variants.initial && __DEV__) {
          console.warn(`Your directive v-motion-${key} is missing initial variant!`);
        }
        app2.directive(`motion-${key}`, directive(variants));
      }
    }
  }
};
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$5 = {
  data() {
    return {
      idClassMap: {
        colors: {
          scissors: "bg-gradient-to-b from-scissors-2 to-scissors-1",
          paper: "bg-gradient-to-b from-paper-2 to-paper-1",
          rock: "bg-gradient-to-b from-rock-2 to-rock-1",
          lizard: "bg-gradient-to-b from-lizard-2 to-lizard-1",
          spock: "bg-gradient-to-b from-spock-2 to-spock-1"
        }
      },
      viewClassMap: {
        GameOpen: {
          size: {
            parent: "h-24 w-24 md:h-32 md:w-32",
            child: "h-16 w-16 md:h-20 md:w-20",
            icon: "h-10 w-10 md:h-12 md:w-12"
          },
          shadow: {
            parent: "shadow-inset-b-sm md:shadow-inset-b",
            child: "shadow-inset-sm md:shadow-inset"
          }
        },
        Game: {
          size: {
            parent: "h-28 w-28 md:h-56 md:w-56",
            child: "h-20 w-20 md:h-40 md:w-40",
            icon: "h-12 w-12 md:h-24 md:w-24"
          },
          shadow: {
            parent: "shadow-inset-b-sm md:shadow-inset-b",
            child: "shadow-inset-sm md:shadow-inset"
          }
        }
      }
    };
  },
  props: ["id", "view", "animation"],
  name: "Hand"
};
const _hoisted_1$5 = ["id"];
const _hoisted_2$5 = ["src"];
function _sfc_render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    id: $props.id,
    class: normalizeClass(`${$props.animation} z-10 cursor-pointer rounded-full shadow-xl`)
  }, [
    createBaseVNode("div", {
      id: "parent",
      class: normalizeClass(`pointer-events-none ${$data.idClassMap.colors[$props.id]} ${$data.viewClassMap[$props.view].size.parent} ${$data.viewClassMap[$props.view].shadow.parent} flex items-center justify-center rounded-full`)
    }, [
      createBaseVNode("div", {
        id: "child",
        class: normalizeClass(`pointer-events-none ${$data.viewClassMap[$props.view].size.child} ${$data.viewClassMap[$props.view].shadow.child} flex items-center justify-center rounded-full bg-white opacity-90`)
      }, [
        createBaseVNode("img", {
          class: normalizeClass(`${$data.viewClassMap[$props.view].size.icon} pointer-events-none`),
          src: `./src/assets/images/icon-${$props.id}.svg`
        }, null, 10, _hoisted_2$5)
      ], 2)
    ], 2)
  ], 10, _hoisted_1$5);
}
const Hand$1 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", _sfc_render$5]]);
const useGameStore = defineStore({
  id: "game",
  state: () => ({
    selfPick: "",
    housePick: "",
    view: "GameOpen",
    winners: [],
    score: 0
  }),
  getters: {
    getSelfPick: (state) => state.selfPick,
    getHousePick: (state) => state.housePick,
    getWinners: (state) => state.winners,
    getScore: (state) => state.score,
    houseWins: function() {
      return this.winners.includes("housePick") && this.winners.length === 1;
    },
    selfWins: function() {
      return this.winners.includes("selfPick") && this.winners.length === 1;
    },
    draw: function() {
      return this.winners.length > 1;
    }
  },
  actions: {
    setScore() {
      this.score += 1;
    },
    setView(view) {
      this.view = view;
    },
    async setSelfPick(pick) {
      await new Promise((resolve2) => {
        setTimeout(() => {
          resolve2(
            this.$patch({
              selfPick: pick
            })
          );
        }, 500);
      });
    },
    async setHousePick(pick) {
      await new Promise((resolve2) => {
        setTimeout(() => {
          resolve2(
            this.$patch({
              housePick: pick
            })
          );
        }, 2e3);
      });
    },
    setWinners(winners) {
      this.winners = winners;
    }
  }
});
const _sfc_main$4 = {
  setup() {
    const store = useGameStore();
    return { store };
  },
  methods: {
    playAgain() {
      this.store.$patch({
        selfPick: "",
        housePick: "",
        view: "GameOpen",
        winners: []
      });
    }
  },
  name: "Message",
  props: ["message"]
};
const _hoisted_1$4 = { class: "mt-12 flex h-auto w-[300px] flex-shrink flex-grow flex-col items-center justify-around md:order-2 md:mt-0" };
const _hoisted_2$4 = { class: "mb-5 text-6xl font-bold uppercase text-white md:mt-16 md:-mb-8" };
function _sfc_render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("section", _hoisted_1$4, [
    createBaseVNode("h2", _hoisted_2$4, toDisplayString($props.message), 1),
    createBaseVNode("button", {
      onClick: _cache[0] || (_cache[0] = (...args) => $options.playAgain && $options.playAgain(...args)),
      class: "w-3/5 rounded-md border-2 border-white bg-white py-2 px-4 uppercase transition duration-200 ease-in-out hover:bg-opacity-0 hover:text-white md:mb-16"
    }, " Play Again ")
  ]);
}
const Message = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", _sfc_render$4]]);
const checks = Object.freeze({
  BEATS: 1,
  NOT_BEATS: 0
});
class Hand {
  static checkBeats(choice) {
    if (this.beats.includes(choice.toString()))
      return checks.BEATS;
    return checks.NOT_BEATS;
  }
}
class Rock extends Hand {
  static toString() {
    return "rock";
  }
}
__publicField(Rock, "beats", ["scissors", "lizard"]);
class Paper extends Hand {
  static toString() {
    return "paper";
  }
}
__publicField(Paper, "beats", ["rock", "spock"]);
class Scissors extends Hand {
  static toString() {
    return "scissors";
  }
}
__publicField(Scissors, "beats", ["lizard", "paper"]);
class Lizard extends Hand {
  static toString() {
    return "lizard";
  }
}
__publicField(Lizard, "beats", ["paper", "spock"]);
class Spock extends Hand {
  static toString() {
    return "spock";
  }
}
__publicField(Spock, "beats", ["scissors", "rock"]);
const stringClassMap = {
  [Rock.toString()]: Rock,
  [Paper.toString()]: Paper,
  [Scissors.toString()]: Scissors,
  [Lizard.toString()]: Lizard,
  [Spock.toString()]: Spock
};
function chooseRandomHand() {
  let handList = Object.keys(stringClassMap);
  return handList[Math.floor(Math.random() * handList.length)];
}
class RPSLS {
  constructor(choices) {
    this.choices = choices;
    this.scores = {};
  }
  get winners() {
    return this.getWinners();
  }
  play() {
    let scores = {};
    for (let [thisPlayer, choice] of Object.entries(this.choices)) {
      scores[thisPlayer] = checks.NOT_BEATS;
      const players = Object.keys(this.choices).filter(
        (player) => player !== thisPlayer
      );
      for (let player of players) {
        scores[thisPlayer] += choice.checkBeats(this.choices[player]);
      }
    }
    this.scores = scores;
  }
  getWinners() {
    try {
      if (Object.keys(this.scores).length === 0) {
        throw new Error("No game played!");
      }
    } catch (error) {
      console.error(error);
    } finally {
      return Object.keys(this.scores).filter(
        (player) => this.scores[player] === Math.max(...Object.values(this.scores))
      );
    }
  }
}
const Game_vue_vue_type_style_index_0_lang = "";
const _sfc_main$3 = {
  setup() {
    const store = useGameStore();
    const { selfWins } = storeToRefs(store);
    return { store, selfWins };
  },
  name: "Game",
  components: {
    Hand: Hand$1,
    Message
  },
  data() {
    return {};
  },
  mounted() {
    this.store.setHousePick(chooseRandomHand());
  },
  watch: {
    selfWins(value) {
      if (value === true)
        this.store.setScore();
    }
  }
};
const _hoisted_1$3 = { class: "flex h-[300px] w-[300px] flex-col justify-between md:h-[300px] md:w-[800px]" };
const _hoisted_2$3 = { class: "flex h-full flex-wrap" };
const _hoisted_3$3 = {
  id: "selfPick",
  class: "flex flex-shrink flex-grow flex-col-reverse items-center justify-around md:order-1 md:flex-col"
};
const _hoisted_4$3 = /* @__PURE__ */ createBaseVNode("h2", { class: "mt-4 uppercase text-white md:mt-0 md:text-2xl" }, " You Picked ", -1);
const _hoisted_5$2 = {
  id: "housePick",
  class: "flex max-w-[150px] flex-shrink flex-grow flex-col-reverse items-center justify-around md:order-3 md:max-w-none md:flex-col"
};
const _hoisted_6$2 = /* @__PURE__ */ createBaseVNode("h2", { class: "mt-4 uppercase text-white md:mt-0 md:text-2xl" }, " The House Picked ", -1);
const _hoisted_7$1 = {
  key: 0,
  class: "animate__animated animate__pulse animate__infinite h-28 w-28 rounded-full bg-background-2 md:h-56 md:w-56"
};
function _sfc_render$3(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Hand = resolveComponent("Hand");
  const _component_Message = resolveComponent("Message");
  return openBlock(), createElementBlock("section", _hoisted_1$3, [
    createBaseVNode("div", _hoisted_2$3, [
      createBaseVNode("div", _hoisted_3$3, [
        _hoisted_4$3,
        createBaseVNode("span", {
          class: normalizeClass(this.store.selfWins ? "animation-ping" : "")
        }, [
          createVNode(_component_Hand, {
            id: this.store.getSelfPick,
            view: "Game"
          }, null, 8, ["id"])
        ], 2)
      ]),
      createBaseVNode("div", _hoisted_5$2, [
        _hoisted_6$2,
        this.store.housePick === "" ? (openBlock(), createElementBlock("div", _hoisted_7$1)) : (openBlock(), createElementBlock("span", {
          key: 1,
          class: normalizeClass(this.store.houseWins ? "animation-ping" : "")
        }, [
          createVNode(_component_Hand, {
            id: this.store.housePick,
            view: "Game"
          }, null, 8, ["id"])
        ], 2))
      ]),
      createVNode(Transition, null, {
        default: withCtx(() => [
          this.store.selfWins ? (openBlock(), createBlock(_component_Message, {
            key: 0,
            message: "You Win"
          })) : this.store.houseWins ? (openBlock(), createBlock(_component_Message, {
            key: 1,
            message: "You Lose"
          })) : this.store.draw ? (openBlock(), createBlock(_component_Message, {
            key: 2,
            message: "A Draw"
          })) : createCommentVNode("", true)
        ]),
        _: 1
      })
    ])
  ]);
}
const Game = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", _sfc_render$3]]);
const _sfc_main$2 = {
  setup() {
    const store = useGameStore();
    return { store };
  },
  name: "GameOpen",
  components: {
    Hand: Hand$1
  },
  methods: {
    onHandClick(event) {
      let pick = event.target.id;
      this.store.setSelfPick(pick);
    }
  }
};
const _hoisted_1$2 = {
  class: "relative h-[300px] w-[200px] md:h-[300px] md:w-[300px]",
  style: { "background-repeat": "no-repeat", "background-size": "contain", "background-position": "center", "background-image": "url('./src/assets/images/bg-pentagon.svg')" }
};
const _hoisted_2$2 = {
  id: "scissors-container",
  class: "absolute top-[60px] left-1/2 h-fit w-fit -translate-x-1/2 -translate-y-1/2 transform md:top-[30px]"
};
const _hoisted_3$2 = {
  id: "rock-container",
  class: "absolute bottom-[60px] right-[40px] h-fit w-fit translate-x-1/2 translate-y-1/2 transform md:right-[50px] md:bottom-[20px]"
};
const _hoisted_4$2 = {
  id: "paper-container",
  class: "absolute top-[30px] right-[0px] h-fit w-fit translate-x-1/2 translate-y-1/2 transform md:top-[-5px] md:right-[0px]"
};
const _hoisted_5$1 = {
  id: "lizard-container",
  class: "absolute bottom-[60px] left-[40px] h-fit w-fit -translate-x-1/2 translate-y-1/2 transform md:left-[50px] md:bottom-[20px]"
};
const _hoisted_6$1 = {
  id: "spock-container",
  class: "absolute top-[30px] left-[0px] h-fit w-fit -translate-x-1/2 translate-y-1/2 transform md:top-[-5px] md:right-[0px]"
};
function _sfc_render$2(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Hand = resolveComponent("Hand");
  const _directive_motion_pop_1 = resolveDirective("motion-pop-1");
  return openBlock(), createElementBlock("section", _hoisted_1$2, [
    createBaseVNode("div", _hoisted_2$2, [
      withDirectives(createVNode(_component_Hand, {
        onClick: $options.onHandClick,
        id: "scissors",
        view: "GameOpen"
      }, null, 8, ["onClick"]), [
        [_directive_motion_pop_1]
      ])
    ]),
    createBaseVNode("div", _hoisted_3$2, [
      withDirectives(createVNode(_component_Hand, {
        onClick: $options.onHandClick,
        id: "rock",
        view: "GameOpen"
      }, null, 8, ["onClick"]), [
        [_directive_motion_pop_1]
      ])
    ]),
    createBaseVNode("div", _hoisted_4$2, [
      withDirectives(createVNode(_component_Hand, {
        onClick: $options.onHandClick,
        id: "paper",
        view: "GameOpen"
      }, null, 8, ["onClick"]), [
        [_directive_motion_pop_1]
      ])
    ]),
    createBaseVNode("div", _hoisted_5$1, [
      withDirectives(createVNode(_component_Hand, {
        onClick: $options.onHandClick,
        id: "lizard",
        view: "GameOpen"
      }, null, 8, ["onClick"]), [
        [_directive_motion_pop_1]
      ])
    ]),
    createBaseVNode("div", _hoisted_6$1, [
      withDirectives(createVNode(_component_Hand, {
        onClick: $options.onHandClick,
        id: "spock",
        view: "GameOpen"
      }, null, 8, ["onClick"]), [
        [_directive_motion_pop_1]
      ])
    ])
  ]);
}
const GameOpen = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", _sfc_render$2]]);
const _sfc_main$1 = {
  name: "Rules",
  emits: ["closeRules"]
};
const _hoisted_1$1 = { class: "absolute inset-0 left-1/2 top-1/2 z-20 flex h-screen w-screen -translate-x-1/2 -translate-y-1/2 flex-col place-content-around items-center bg-white md:h-[400px] md:w-[400px] md:rounded-3xl" };
const _hoisted_2$1 = /* @__PURE__ */ createBaseVNode("div", {
  class: "flex h-24 w-full flex-col justify-end md:pl-9 md:pb-1",
  id: "title"
}, [
  /* @__PURE__ */ createBaseVNode("p", { class: "text-center text-3xl font-bold uppercase text-dark-text md:text-left" }, " Rules ")
], -1);
const _hoisted_3$1 = /* @__PURE__ */ createBaseVNode("div", {
  class: "flex aspect-square w-[300px]",
  style: { "background-repeat": "no-repeat", "background-size": "contain", "background-position": "center", "background-image": "url('./src/assets/images/image-rules-bonus.svg')" },
  id: "rules"
}, null, -1);
const _hoisted_4$1 = {
  id: "close",
  class: "flex h-24 flex-col justify-center"
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$1, [
    _hoisted_2$1,
    _hoisted_3$1,
    createBaseVNode("div", _hoisted_4$1, [
      createBaseVNode("span", {
        onClick: _cache[0] || (_cache[0] = ($event) => _ctx.$emit("closeRules")),
        class: "h-5 w-5 border-header-outline uppercase text-header-outline hover:cursor-pointer md:absolute md:top-12 md:right-9",
        style: { "background-repeat": "no-repeat", "background-size": "contain", "background-position": "center", "background-image": "url('./src/assets/images/icon-close.svg')" }
      })
    ])
  ]);
}
const Rules = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const _imports_0 = "/assets/logo-bonus.97065621.svg";
const App_vue_vue_type_style_index_0_lang = "";
const _sfc_main = {
  setup() {
    const store = useGameStore();
    const { getSelfPick, getHousePick } = storeToRefs(store);
    return { store, getSelfPick, getHousePick };
  },
  components: {
    Game,
    GameOpen,
    Rules
  },
  data() {
    return {
      showRules: false
    };
  },
  mounted() {
    this.store.$subscribe((mutation) => {
      let payload = mutation.payload;
      if ("selfPick" in payload && Object.keys(payload).length === 1)
        this.store.setView("Game");
      if ("housePick" in payload && Object.keys(payload).length === 1)
        this.playGame();
    });
  },
  methods: {
    playGame() {
      let choices = {
        selfPick: stringClassMap[this.store.getSelfPick],
        housePick: stringClassMap[this.store.getHousePick]
      };
      let game = new RPSLS(choices);
      game.play();
      this.store.setWinners(game.winners);
    },
    toggleRules() {
      this.showRules = !this.showRules;
    }
  }
};
const _hoisted_1 = {
  id: "container",
  class: "relative flex h-full flex-col place-content-around items-center"
};
const _hoisted_2 = { class: "flex max-h-24 w-4/5 justify-between rounded-xl border-2 border-header-outline p-2 text-4xl text-header-outline md:min-h-[150px] md:w-3/5 md:p-4" };
const _hoisted_3 = /* @__PURE__ */ createBaseVNode("div", { class: "m-2" }, [
  /* @__PURE__ */ createBaseVNode("img", {
    class: "h-full",
    src: _imports_0,
    alt: ""
  })
], -1);
const _hoisted_4 = {
  id: "score",
  class: "flex flex-col items-center justify-center rounded-md bg-white px-4 py-2 shadow-sm md:w-32"
};
const _hoisted_5 = /* @__PURE__ */ createBaseVNode("h2", { class: "text-sm uppercase text-score-text md:text-base" }, "Score", -1);
const _hoisted_6 = { class: "text-4xl font-bold text-dark-text md:text-6xl" };
const _hoisted_7 = {
  id: "component-container",
  class: ""
};
const _hoisted_8 = {
  id: "button-container",
  class: "flex h-24 flex-col justify-center md:mr-8 md:h-0 md:justify-end md:self-end"
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Rules = resolveComponent("Rules");
  return openBlock(), createElementBlock("main", _hoisted_1, [
    createBaseVNode("section", _hoisted_2, [
      _hoisted_3,
      createBaseVNode("div", _hoisted_4, [
        _hoisted_5,
        createBaseVNode("span", _hoisted_6, toDisplayString(this.store.getScore), 1)
      ])
    ]),
    createBaseVNode("div", _hoisted_7, [
      createVNode(Transition, {
        "enter-active-class": "animate__animated animate__fadeIn",
        "leave-active-class": "animate__animated animate__fadeOut",
        mode: "out-in"
      }, {
        default: withCtx(() => [
          (openBlock(), createBlock(resolveDynamicComponent(this.store.view)))
        ]),
        _: 1
      })
    ]),
    createVNode(Transition, null, {
      default: withCtx(() => [
        $data.showRules ? (openBlock(), createBlock(_component_Rules, {
          key: 0,
          onCloseRules: $options.toggleRules
        }, null, 8, ["onCloseRules"])) : createCommentVNode("", true)
      ]),
      _: 1
    }),
    createBaseVNode("div", _hoisted_8, [
      createBaseVNode("button", {
        onClick: _cache[0] || (_cache[0] = (...args) => $options.toggleRules && $options.toggleRules(...args)),
        class: "rounded-md border-2 border-header-outline px-10 py-2 uppercase text-white transition duration-200 ease-in-out hover:bg-header-outline"
      }, " Rules ")
    ])
  ]);
}
const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const index = "";
const animate = "";
const app = createApp(App);
app.use(createPinia());
app.use(MotionPlugin, {
  directives: {
    "pop-1": {
      initial: { scale: 0, opacity: 0 },
      enter: {
        scale: 1,
        opacity: 1,
        transition: {
          delay: 0,
          duration: 200
        }
      },
      hovered: {
        scale: 1.1,
        transition: {
          delay: 0,
          duration: 200,
          ease: "easeInOut"
        }
      }
    }
  }
});
app.mount("#app");
