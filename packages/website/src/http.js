import { debug } from "../../common/index.js";
const SERVER_URL = "http://localhost:8080";
const REQUEST_TIMEOUT = 3000; // 15 seconds

/**
 * If you want to allow multipart/form-data bodies
 * simply invoke the makeContentType() function
 * with all its arguments.
 * Such as: makeContentType(query, json, form)
 * instead of: makeContentType(query, json)
 */

function makeUrl(basename, params, queries) {
  const url = new window.URL(`${SERVER_URL}/${basename}`);
  if (params) {
    for (const param of Object.values(params)) {
      url.pathname += param;
    }
  }
  if (queries) {
    for (const query of Object.entries(queries)) {
      url.searchParams.append(query[0], query[1]);
    }
  }
  return url.toString();
}

function makeContentType(query, json, form) {
  return query
    ? "application/x-www-form-urlencoded"
    : json
      ? "application/json"
      : form
        ? "multipart/form-data"
        : "text/plain";
}

function makeBody(json, form) {
  return json
    ? JSON.stringify(json)
    : form
      ? JSON.stringify(Object.fromEntries(form.entries()))
      : {};
}

function startAbortCountdown() {
  const controller = new window.AbortController();
  window.setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  return controller.signal;
}

async function parseResponse(res) {
  const contentType = res.headers
    .get("content-type")
    .split(";")[0]
    .split("/")[1];
  const status = res.status;
  const statusText = res.statusText;
  const url = res.url;

  const body = await (contentType === "json" ? res.json() : res.text());

  debug("contentType")(contentType);
  debug("httpStatusCode")(status);
  debug("httpStatusText")(statusText);
  debug("url")(url);

  if (status >= 200 && status < 300) return body;
  document.write(body);
  return res;
}

const http = {
  get(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "get",
      headers: {
        "Content-Type": makeContentType(query),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
    }).then(parseResponse);
  },
  post(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "post",
      headers: {
        "Content-Type": makeContentType(query, json),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
      body: makeBody(json, form),
    }).then(parseResponse);
  },
  put(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "put",
      headers: {
        "Content-Type": makeContentType(query, json),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
      body: makeBody(json, form),
    }).then(parseResponse);
  },
  delete(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "delete",
      headers: {
        "Content-Type": makeContentType(query, json),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
      body: makeBody(json, form),
    }).then(parseResponse);
  },
};

export { http };
