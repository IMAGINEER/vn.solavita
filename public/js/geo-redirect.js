/**
 * geo-redirect.js
 *
 * Global geo-based country redirect
 *
 * Usage:
 * <script>
 *   window._geoConfig = {
 *     site: "DE"
 *   };
 * </script>
 * <script src="/geo-redirect.js"></script>
 */

(function () {
  "use strict";

  // =========================================================
  // Configuration
  // =========================================================

  var config = window._geoConfig || {};
  var currentSite = String(config.site || "GLOBAL").toUpperCase();

  var STORAGE_KEY = "solavita_geo_redirect";
  var COOKIE_KEY = "solavita_geo_redirect";

  // GeoJS endpoint
  var GEO_API = "https://get.geojs.io/v1/ip/geo.json";

  // =========================================================
  // Site configuration
  // =========================================================

  var SITE_MAP = {
    GLOBAL: {
      country: null,
      url: "https://www.solavita.com"
    },

    DE: {
      country: "DE",
      url: "https://de.solavita.com"
    },

    IT: {
      country: "IT",
      url: "https://it.solavita.com"
    },

    GB: {
      country: "GB",
      url: "https://uk.solavita.com"
    },

    UK: {
      country: "GB",
      url: "https://uk.solavita.com"
    },

    VN: {
      country: "VN",
      url: "https://vn.solavita.com"
    },

    TH: {
      country: "TH",
      url: "https://th.solavita.com"
    },

    MY: {
      country: "MY",
      url: "https://my.solavita.com"
    },

    ID: {
      country: "ID",
      url: "https://id.solavita.com"
    },

    ZA: {
      country: "ZA",
      url: "https://za.solavita.com"
    },

    NG: {
      country: "NG",
      url: "https://ng.solavita.com"
    },

    BR: {
      country: "BR",
      url: "https://br.solavita.com"
    },

    US: {
      country: "US",
      url: "https://www.skyworth-pv.com"
    }
  };

  // =========================================================
  // Country -> recommended site
  // =========================================================

  var COUNTRY_SITE_MAP = {
    DE: "DE",
    IT: "IT",
    GB: "GB",
    UK: "GB",
    VN: "VN",
    TH: "TH",
    MY: "MY",
    ID: "ID",
    ZA: "ZA",
    NG: "NG",
    BR: "BR",

    // North America
    US: "US",

    // Canada intentionally uses Global
    CA: "GLOBAL"
  };

  // =========================================================
  // Helpers
  // =========================================================

  function getCookie(name) {
    var match = document.cookie.match(
      new RegExp(
        "(?:^|; )" +
          name.replace(/([.$?*|{}()[\]\\/+^])/g, "\\$1") +
          "=([^;]*)"
      )
    );

    return match ? decodeURIComponent(match[1]) : null;
  }

  function setCookie(name, value, days) {
    var expires = "";

    if (days) {
      var date = new Date();
      date.setTime(date.getTime() + days * 24 * 60 * 60 * 1000);
      expires = "; expires=" + date.toUTCString();
    }

    document.cookie =
      name +
      "=" +
      encodeURIComponent(value) +
      expires +
      "; path=/; SameSite=Lax";
  }

  function getStoredDecision() {
    try {
      var value = window.localStorage.getItem(STORAGE_KEY);

      if (value) {
        return JSON.parse(value);
      }
    } catch (e) {
      // Ignore localStorage errors
    }

    var cookie = getCookie(COOKIE_KEY);

    if (cookie) {
      try {
        return JSON.parse(cookie);
      } catch (e) {
        return null;
      }
    }

    return null;
  }

  function storeDecision(data) {
    try {
      window.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(data)
      );
    } catch (e) {
      // Ignore localStorage errors
    }

    setCookie(
      COOKIE_KEY,
      JSON.stringify(data),
      30
    );
  }

  function getCurrentHost() {
    return window.location.hostname.toLowerCase();
  }

  function normalizeCountry(country) {
    if (!country) {
      return "";
    }

    return String(country).trim().toUpperCase();
  }

  function getTargetSite(country) {
    var site = COUNTRY_SITE_MAP[country];

    if (!site) {
      return null;
    }

    return SITE_MAP[site] || null;
  }

  function isSameSite(target) {
    if (!target || !target.url) {
      return true;
    }

    try {
      var targetHost = new URL(target.url).hostname.toLowerCase();
      var currentHost = getCurrentHost();

      return (
        currentHost === targetHost ||
        currentHost.endsWith("." + targetHost)
      );
    } catch (e) {
      return true;
    }
  }

  function isRedirectAllowed() {
    // Don't redirect special environments
    var host = getCurrentHost();

    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "[::1]"
    ) {
      return false;
    }

    // Don't redirect if explicitly disabled
    if (config.disable === true) {
      return false;
    }

    return true;
  }

  // =========================================================
  // Redirect
  // =========================================================

  function redirectTo(target) {
    if (!target || !target.url) {
      return;
    }

    if (isSameSite(target)) {
      return;
    }

    var currentPath =
      window.location.pathname +
      window.location.search +
      window.location.hash;

    var targetUrl =
      target.url.replace(/\/$/, "") +
      currentPath;

    window.location.replace(targetUrl);
  }

  // =========================================================
  // Decision UI
  // =========================================================

  function createStyle() {
    if (document.getElementById("geo-redirect-style")) {
      return;
    }

    var style = document.createElement("style");

    style.id = "geo-redirect-style";

    style.textContent = `
      #geo-redirect-modal {
        position: fixed;
        inset: 0;
        z-index: 2147483647;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 20px;
        background: rgba(0,0,0,.45);
        font-family:
          Arial,
          Helvetica,
          sans-serif;
      }

      #geo-redirect-modal * {
        box-sizing: border-box;
      }

      .geo-redirect-box {
        width: min(460px, 100%);
        background: #fff;
        border-radius: 16px;
        padding: 30px;
        box-shadow: 0 20px 60px rgba(0,0,0,.2);
      }

      .geo-redirect-title {
        margin: 0 0 12px;
        font-size: 24px;
        line-height: 1.3;
        font-weight: 700;
        color: #18382c;
      }

      .geo-redirect-text {
        margin: 0 0 24px;
        font-size: 15px;
        line-height: 1.6;
        color: #555;
      }

      .geo-redirect-actions {
        display: flex;
        gap: 10px;
      }

      .geo-redirect-btn {
        flex: 1;
        min-height: 46px;
        border-radius: 8px;
        border: 1px solid #d7ddd9;
        background: #fff;
        cursor: pointer;
        font-size: 14px;
        font-weight: 600;
      }

      .geo-redirect-btn-primary {
        border-color: #1f7a55;
        background: #1f7a55;
        color: #fff;
      }

      .geo-redirect-btn:hover {
        opacity: .9;
      }

      @media (max-width: 480px) {
        .geo-redirect-box {
          padding: 24px;
        }

        .geo-redirect-actions {
          flex-direction: column;
        }
      }
    `;

    document.head.appendChild(style);
  }

  function removeModal() {
    var modal = document.getElementById("geo-redirect-modal");

    if (modal) {
      modal.remove();
    }
  }

  function showRedirectModal(country, target) {
    if (!target || !target.url) {
      return;
    }

    if (document.getElementById("geo-redirect-modal")) {
      return;
    }

    createStyle();

    var modal = document.createElement("div");

    modal.id = "geo-redirect-modal";

    modal.innerHTML = `
      <div class="geo-redirect-box">
        <h2 class="geo-redirect-title">
          Visit your local Solavita website
        </h2>

        <p class="geo-redirect-text">
          We detected that you are visiting from
          <strong>${country}</strong>.
          Would you like to visit the website for your region?
        </p>

        <div class="geo-redirect-actions">
          <button
            type="button"
            class="geo-redirect-btn geo-redirect-btn-primary"
            id="geo-redirect-go"
          >
            Go to local website
          </button>

          <button
            type="button"
            class="geo-redirect-btn"
            id="geo-redirect-stay"
          >
            Stay here
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    document
      .getElementById("geo-redirect-go")
      .addEventListener("click", function () {
        storeDecision({
          action: "redirect",
          country: country,
          site: currentSite,
          timestamp: Date.now()
        });

        redirectTo(target);
      });

    document
      .getElementById("geo-redirect-stay")
      .addEventListener("click", function () {
        storeDecision({
          action: "stay",
          country: country,
          site: currentSite,
          timestamp: Date.now()
        });

        removeModal();
      });
  }

  // =========================================================
  // GeoJS
  // =========================================================

  function detectCountry() {
    return fetch(GEO_API, {
      method: "GET",
      headers: {
        Accept: "application/json"
      },
      cache: "no-store"
    })
      .then(function (response) {
        if (!response.ok) {
          throw new Error(
            "Geo API HTTP " + response.status
          );
        }

        return response.json();
      })
      .then(function (data) {
        return normalizeCountry(data.country_code);
      });
  }

  // =========================================================
  // Main
  // =========================================================

  function init() {
    if (!isRedirectAllowed()) {
      return;
    }

    // Unknown site configuration
    if (!SITE_MAP[currentSite]) {
      return;
    }

    // Existing user decision
    var stored = getStoredDecision();

    if (
      stored &&
      stored.action === "stay" &&
      stored.site === currentSite
    ) {
      return;
    }

    // Don't ask again immediately after redirect
    if (
      stored &&
      stored.action === "redirect" &&
      stored.site === currentSite
    ) {
      return;
    }

    detectCountry()
      .then(function (country) {
        if (!country) {
          return;
        }

        var target = getTargetSite(country);

        if (!target) {
          return;
        }

        // Already on the correct country website
        if (isSameSite(target)) {
          return;
        }

        showRedirectModal(country, target);
      })
      .catch(function (error) {
        // Geo detection must NEVER break the website
        if (window.console && console.warn) {
          console.warn(
            "[geo-redirect] Geo detection failed:",
            error
          );
        }
      });
  }

  // =========================================================
  // Start after DOM ready
  // =========================================================

  if (document.readyState === "loading") {
    document.addEventListener(
      "DOMContentLoaded",
      init
    );
  } else {
    init();
  }

  // Optional public API
  window.SolavitaGeoRedirect = {
    init: init,
    detectCountry: detectCountry,
    redirectTo: redirectTo,
    getTargetSite: getTargetSite
  };
})();