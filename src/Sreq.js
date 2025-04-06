// Module dependencies:
// 1. Fetch (native in nodejs && browser)
// Globally available in both platforms

// 2. URL (native in nodejs && browser)
// Globally available in both platforms

// 3. AbortController (native in nodejs && browser)
// Globally available in both platforms

// 4. Request, Response (native in nodejs && browser)
// Globally available in both platforms

// 5. structuredClone (native in nodejs && browser)
// Globally available in both platforms

var isNode = typeof globalThis.window === "undefined";
const REQUEST_TIMEOUT = 5000;

class Sreq {
  constructor(url, options) {
    options ||= {};
    this.baseUrl = makeUrl(url);
    this.timeout = options.timeout || REQUEST_TIMEOUT;
    this.get = Sreq.get.bind(this);
    this.post = Sreq.post.bind(this);
    this.put = Sreq.put.bind(this);
    this.patch = Sreq.patch.bind(this);
    this.delete = Sreq.delete.bind(this);
    return this;
  }

  static get(url, { params, query, headers, json, form, timeout } = {}) {
    const _url = makeUrl.call(this, url, params);
    makeBody.call(this, "get", _url, { json, form });
    return fetch(_url, {
      method: "get",
      headers: {
        Accept: "*/*",
        ...headers,
      },
      signal: startAbortCountdown(timeout || this?.timeout),
    });
  }

  static post(url, { params, query, headers, json, form, timeout } = {}) {
    const _url = makeUrl.call(this, url, params);
    const [body, contentType] = makeBody.call(this, "post", _url, {
      json,
      form,
    });
    return fetch(_url, {
      method: "post",
      headers: {
        Accept: "*/*",
        ...headers,
        "Content-Type": contentType,
      },
      signal: startAbortCountdown(timeout || this?.timeout),
      body,
    });
  }

  static put(url, { params, query, headers, json, form, timeout } = {}) {
    const _url = makeUrl.call(this, url, params);
    const [body, contentType] = makeBody.call(this, "put", _url, {
      json,
      form,
    });
    return fetch(_url, {
      method: "put",
      headers: {
        Accept: "*/*",
        ...headers,
        "Content-Type": contentType,
      },
      signal: startAbortCountdown(timeout || this?.timeout),
      body,
    });
  }

  static patch(url, { params, query, headers, json, form, timeout } = {}) {
    const _url = makeUrl.call(this, url, params);
    const [body, contentType] = makeBody.call(this, "patch", _url, {
      json,
      form,
    });
    return fetch(_url, {
      method: "put",
      headers: {
        Accept: "*/*",
        ...headers,
        "Content-Type": contentType,
      },
      signal: startAbortCountdown(timeout || this?.timeout),
      body,
    });
  }

  static delete(url, { params, query, headers, json, form, timeout } = {}) {
    const _url = makeUrl.call(this, url, params);
    makeBody.call(this, "delete", _url, { json, form });
    return fetch(_url, {
      method: "delete",
      headers: {
        Accept: "*/*",
        ...headers,
      },
      signal: startAbortCountdown(timeout || this?.timeout),
    });
  }
}

function startAbortCountdown(timeout) {
  const controller = new AbortController();
  setTimeout(() => controller.abort(), timeout || REQUEST_TIMEOUT);
  return controller.signal;
}

function makeUrl(url, params) {
  /*
    This function may run within a Sreq instance or through
    one of the static methods.
  */

  let _url = url || "/";
  if (this?.baseUrl) {
    _url = new URL(_url, this.baseUrl);
    _url.pathname = makePath.call(
      this,
      [this.baseUrl.pathname, _url.pathname],
      params,
    );
    _url.search = makeQuery.call(
      this,
      this.baseUrl.searchParams,
      _url.searchParams,
    );
    if (_url.origin !== this.baseUrl.origin)
      throw new Error(`Trying to overwrite the baseUrl`);
    return _url;
  }

  _url = new URL(_url);
  _url.pathname = makePath(_url.pathname, params);
  _url.search = makeQuery(_url.searchParams);
  return _url;
}

function makeBody(method, url, { query, form, json, xml, csv, plain }) {
  /*
    Most used content-types:
    text/plain
    text/csv
    text/html
    application/x-www-form-urlencoded
    application/json
    application/octet-stream, Transfer-encoding: chunked
    application/xml
    application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
    multipart/form-data
  */

  var body = null;
  var contentType = null;

  switch (method) {
    case "get":
    // fall through
    case "head":
    // fall through
    case "delete":
      url.search = makeQuery.call(this, url.searchParams, query, json, form);
      break;
    case "post":
    // fall through
    case "put":
    // fall through
    case "patch":
      url.search = makeQuery.call(this, url.searchParams, query);
      if (json) {
        body = JSON.stringify(structuredClone(json));
        contentType = "application/json";
      } else if (form) {
        for (const [k, v] of form.entries()) {
          body[k] = JSON.stringify(structuredClone(v));
        }
        contentType = "application/json";
      } else {
        body = xml || csv || plain;
        contentType = "text/plain";
      }
      break;
    default:
      throw new Error(`Unrecognized http method: ${method}`);
  }

  return [body, contentType];
}

function makeQuery(...queries) {
  const join = new URLSearchParams();
  for (let i = 0; i < queries.length; i++) {
    for (const [k, v] of new URLSearchParams(queries[i]).entries())
      join.append(k, v);
  }
  return join;
}

function makePath(paths, params) {
  const components = [paths]
    .flat()
    .join("/")
    .split("/")
    .filter((path) => path);
  for (let i = 0; i < components.length; i++) {
    if (components[i][0] !== ":") continue;
    components[i] = params[components[i].slice(1)];
    if (!components[i])
      throw new Error(`Missing path parameter: ${components[i]}`);
  }
  return components.join("/");
}

export { Sreq };
