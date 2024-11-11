import { debug } from "../../common/index.js";
const SERVER_URL = "http://localhost:8080";
const REQUEST_TIMEOUT = 15000; // 15 seconds

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
        ? /* forms are of type: multipart/form-data. But all forms are translated to json. */
          "application/json"
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
  const type = res.headers.get("content-type").split(";")[0].split("/")[1];
  const body = await (type === "json" ? res.json() : res.text());
  if (res.status >= 200 && res.status < 300) return body;
  throw new Error(res.statusText, { cause: { res, type, body } });
}

async function handleError(err) {
  const type = err.cause?.type;
  switch (type) {
    case "html":
      document.write(err.cause.body);
      break;
    default:
      console.error(err);
  }
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
    })
      .then(parseResponse)
      .catch(handleError);
  },
  post(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "post",
      headers: {
        "Content-Type": makeContentType(query, json, form),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
      body: makeBody(json, form),
    })
      .then(parseResponse)
      .catch(handleError);
  },
  put(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "put",
      headers: {
        "Content-Type": makeContentType(query, json, form),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
      body: makeBody(json, form),
    })
      .then(parseResponse)
      .catch(handleError);
  },
  delete(url, { params, query, json, form } = {}) {
    return fetch(makeUrl(url, params, query), {
      method: "delete",
      headers: {
        "Content-Type": makeContentType(query, json, form),
        Accept: "*/*",
      },
      signal: startAbortCountdown(),
      body: makeBody(json, form),
    })
      .then(parseResponse)
      .catch(handleError);
  },
};

export { http };
