---
title: "Why Use Axios Over Fetch in JavaScript?"
categories:
  - Blog
tags:
  - Javascript
  - Node.js
author_profile: false
toc: true
toc_sticky: true
header:
  overlay_image: assets/images/headers/img.jpeg
  teaser: assets/images/headers/img.jpeg
  caption: https://axios-http.com/
  cta_url: https://axios-http.com/
---

When working with HTTP requests in JavaScript, you might wonder why many developers prefer `axios` over the built-in `fetch` API. While `fetch` is natively available and works well for basic requests, `axios` offers several advantages that make it a more convenient choice in real-world applications.


In this article, we'll compare `fetch` and `axios` with practical examples to illustrate why many developers still prefer `axios` despite `fetch` being a built-in function.


## 1. Cleaner and More Readable Code


With `fetch`, you need to manually check the response status and convert it to JSON:



{% raw %}
```javascript
fetch("https://api.example.com/data")
  .then(response => {
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error("Fetch error:", error));
```
{% endraw %}



In contrast, `axios` automatically parses JSON and handles HTTP errors more cleanly:



{% raw %}
```javascript
axios.get("https://api.example.com/data")
  .then(response => console.log(response.data))
  .catch(error => console.error("Axios error:", error));
```
{% endraw %}



## 2. Automatic JSON Conversion


With `fetch`, you need to call `response.json()` manually:



{% raw %}
```javascript
fetch("https://api.example.com/data")
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Error:", error));
```
{% endraw %}



With `axios`, the response is already parsed:



{% raw %}
```javascript
axios.get("https://api.example.com/data")
  .then(response => console.log(response.data))
  .catch(error => console.error("Error:", error));
```
{% endraw %}



## 3. Better Error Handling


`fetch` does **not** reject the promise on HTTP errors (e.g., 404 or 500). Instead, you must manually check `response.ok`:



{% raw %}
```javascript
fetch("https://api.example.com/data")
  .then(response => {
    if (!response.ok) {
      throw new Error("HTTP error! Status: " + response.status);
    }
    return response.json();
  })
  .then(data => console.log(data))
  .catch(error => console.error("Fetch error:", error));
```
{% endraw %}



`axios` automatically throws an error for non-2xx responses, which simplifies error handling:



{% raw %}
```javascript
axios.get("https://api.example.com/data")
  .then(response => console.log(response.data))
  .catch(error => console.error("Axios error:", error));
```
{% endraw %}



## 4. Timeout Support


`fetch` does not support request timeouts natively. You have to use `AbortController`:



{% raw %}
```javascript
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 5000);

fetch("https://api.example.com/data", { signal: controller.signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Timeout or fetch error:", error));
```
{% endraw %}



With `axios`, you can set a timeout with a simple option:



{% raw %}
```javascript
axios.get("https://api.example.com/data", { timeout: 5000 })
  .then(response => console.log(response.data))
  .catch(error => console.error("Timeout or other error:", error));
```
{% endraw %}



## 5. Request and Response Interceptors


`fetch` does not provide built-in support for request and response interception. You need to wrap it in a function manually.


In contrast, `axios` allows you to modify requests and responses easily with interceptors:



{% raw %}
```javascript
axios.interceptors.request.use(config => {
  config.headers.Authorization = "Bearer my-token";
  return config;
});
```
{% endraw %}



This is particularly useful for adding authentication tokens or modifying requests dynamically.


## 6. Request Cancellation


`fetch` requires `AbortController` for canceling requests, which can be cumbersome.



{% raw %}
```javascript
const controller = new AbortController();
fetch("https://api.example.com/data", { signal: controller.signal })
  .then(response => response.json())
  .then(data => console.log(data))
  .catch(error => console.error("Fetch error:", error));

// Cancel the request
controller.abort();
```
{% endraw %}



`axios` provides a simpler `CancelToken` API for request cancellation:



{% raw %}
```javascript
const source = axios.CancelToken.source();
axios.get("https://api.example.com/data", { cancelToken: source.token })
  .catch(thrown => {
    if (axios.isCancel(thrown)) {
      console.log("Request canceled", thrown.message);
    }
  });

// Cancel the request
source.cancel("Operation canceled by the user.");
```
{% endraw %}



## 7. Better Browser Compatibility


`fetch` is **not** supported in older browsers like Internet Explorer without a polyfill.


`axios` works in older browsers out of the box and provides a more consistent experience across different environments.


## Conclusion: When to Use Fetch and When to Use Axios?

- If you're making a simple request and don't need advanced features, `fetch` is fine.
- If you need **better error handling, request/response interception, timeouts, request cancellation, or browser compatibility**, `axios` is a better choice.

While `fetch` is a powerful native API, `axios` simplifies many common HTTP request scenarios, making it the preferred choice for many developers. If your project involves multiple API calls, error handling, and authentication, `axios` will save you time and make your code more maintainable.


Do you use `fetch` or `axios` in your projects? Let us know in the comments!


## References

- [Axios GitHub Repository](https://github.com/axios/axios){:target="_blank"}
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API){:target="_blank"}
- [Axios Documentation](https://axios-http.com/){:target="_blank"}
