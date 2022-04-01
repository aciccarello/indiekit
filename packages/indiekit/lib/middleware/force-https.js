/**
 * Redirect HTTP requests to HTTPS
 *
 * @param {object} request HTTP request
 * @param {object} response HTTP response
 * @param {Function} next Callback
 * @returns {object} HTTP response
 */
export function forceHttps(request, response, next) {
  const protocol = request.headers["x-forwarded-proto"];

  if (protocol !== "https") {
    console.info("Redirecting request to https");
    // 302 temporary. This is a feature that can be disabled
    return response.redirect(
      302,
      "https://" + request.get("Host") + request.originalUrl
    );
  }

  // Mark proxy as secure (allows secure cookies)
  request.connection.proxySecure = true;
  next();
}