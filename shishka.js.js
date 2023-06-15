const IS_ANDROID = /android/i.test(navigator.userAgent);
const IS_IOS =
  (/iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream) ||
  (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);

const IS_SAFARI = /Safari\//.test(navigator.userAgent);
const IS_FIREFOX = /firefox/i.test(navigator.userAgent);
const IS_OCULUS = /OculusBrowser/.test(navigator.userAgent);
const IS_IOS_CHROME = IS_IOS && /CriOS\//.test(navigator.userAgent);
const IS_IOS_SAFARI = IS_IOS && IS_SAFARI;

const SUPPORTS_SCENEVIEWER = IS_ANDROID && !IS_FIREFOX && !IS_OCULUS;
const SUPPORTS_QUICKLOOK = (() => {
  const anchor = document.createElement("a");
  return (
    anchor.relList && anchor.relList.supports && anchor.relList.supports("ar")
  );
})();
const i = navigator.maxTouchPoints === 1;

const activateAR = (href, isQuickLook, button) => {
  const anchor = document.createElement("a");
  if (isQuickLook) {
    isQuickLook = true;

    anchor.appendChild(document.createElement("img"));
    anchor.rel = "ar";
  }
  anchor.setAttribute("href", href);
  anchor.click();

  anchor.addEventListener("message", (event) => {
    button.dispatchEvent(new CustomEvent("quick-look-button-tapped"));
  });
};

const handleClickAR = (event, button, id) => {
  console.log(button);

  // if (i) {
  //   return;
  // }

  if (IS_IOS_CHROME || IS_IOS_SAFARI) {
    button.setAttribute("ar", "quick-look");
    button.dispatchEvent(
      new CustomEvent("initialized", { detail: "quick-look" })
    );

    const secret = "ess";
    const ar = "armodels";

    fetch(`https://shishka-back.onrender.com/api/gu${secret}/${ar}/${id}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then(({ data }) => {
        const iosSrc = data.model.ios;

        let href = `${iosSrc}#`;

        activateAR(href, button, true);

        if (!iosSrc) {
          console.error("Invalid ios-src in <ar-button>: " + button);
          return;
        }
      });
  } else if (SUPPORTS_SCENEVIEWER) {
    // system supports AR via scene viewer
    button.setAttribute("ar", "scene-viewer");
    button.dispatchEvent(
      new CustomEvent("initialized", { detail: "scene-viewer" })
    );

    const secret = `api/`;

    const guess = `ess/`;
    const ar = "armodels";
    fetch(`https://shishka-back.onrender.com/${secret}gu${guess}${ar}/${id}`, {
      cache: "no-store",
    })
      .then((response) => response.json())
      .then(({ data }) => {
        const src = data.model.android;

        let href = null;
        href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only&resizable=false&disable_occlusion=true&`;

        if (!src) {
          console.error("Invalid src in <ar-button>: " + button);
          return;
        }

        href +=
          `#Intent;scheme=https;` +
          `package=com.google.ar.core;` +
          `action=android.intent.action.VIEW;`;

        href += `end;`;
        activateAR(href);
      });
  } else if (IS_IOS && !IS_IOS_SAFARI && !IS_IOS_CHROME) {
    console.log("it`s a desktop");

    button.setAttribute("ar", "unsupported_ios");
    button.dispatchEvent(
      new CustomEvent("initialized", { detail: "unsupported_ios" })
    );
    if (button.getAttribute("show-if-unsupported") != null) {
      button.addEventListener("click", () => {
        const fallbackUrl = button.getAttribute("fallback-url");
        if (fallbackUrl) {
          activateAR(encodeURIComponent(fallbackUrl));
        }
      });
    } else if (IS_IOS && !IS_IOS_SAFARI && !IS_IOS_CHROME) {
      button.setAttribute("ar", "unsupported_ios");
      button.dispatchEvent(
        new CustomEvent("initialized", { detail: "unsupported_ios" })
      );
      if (button.getAttribute("show-if-unsupported") != null) {
        button.addEventListener("click", () => {
          const fallbackUrl = button.getAttribute("fallback-url");
          if (fallbackUrl) {
            activateAR(encodeURIComponent(fallbackUrl));
          }
        });
      } else {
        button.style.display = "none";
      }
    } else if (IS_IOS && !IS_IOS_SAFARI && !IS_IOS_CHROME) {
      button.setAttribute("ar", "unsupported_ios");
      button.dispatchEvent(
        new CustomEvent("initialized", { detail: "unsupported_ios" })
      );
      if (button.getAttribute("show-if-unsupported") != null) {
        button.addEventListener("click", () => {
          const fallbackUrl = button.getAttribute("fallback-url");
          if (fallbackUrl) {
            activateAR(encodeURIComponent(fallbackUrl));
          }
        });
      } else {
        button.style.display = "none";
      }
    } else {
      button.setAttribute("ar", "unsupported");
      button.dispatchEvent(
        new CustomEvent("initialized", { detail: "unsupported" })
      );
      if (button.getAttribute("show-if-unsupported") != null) {
        button.addEventListener("click", () => {
          const fallbackUrl = button.getAttribute("fallback-url");
          if (fallbackUrl) {
            activateAR(encodeURIComponent(fallbackUrl));
          }
        });
      } else {
        button.style.display = "none";
      }
    }
  }
};

const buttons = document.querySelectorAll("ar-button");
for (let i = 0; i < buttons.length; i++) {
  const button = buttons.item(i);
  const id = String(button.getAttribute("data-id"));
  console.log(id);
  button.addEventListener("click", (event) => handleClickAR(event, button, id));
}
document.addEventListener(
  "keydown",
  function () {
    if (event.keyCode === 123) {
      return false;
    } else if (event.ctrlKey && event.shiftKey && event.keyCode === 73) {
      return false;
    } else if (event.ctrlKey && event.keyCode === 85) {
      return false;
    }
  },
  false
);

if (document.addEventListener) {
  document.addEventListener(
    "contextmenu",
    function (e) {
      e.preventDefault();
    },
    false
  );
} else {
  document.attachEvent("oncontextmenu", function () {
    window.event.returnValue = false;
  });
}
