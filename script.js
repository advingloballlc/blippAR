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

  if (i) {
    return;
  }

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
        href = `intent://arvr.google.com/scene-viewer/1.0?file=${src}&mode=ar_only&resizable=false&disable_occlusion=true&enable_vertical_placement=true`;

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

// const _0x5653b3 = _0x4beb;
// (function (_0x554ff6, _0x2baf65) {
//   const _0x4d4fd7 = _0x4beb,
//     _0x5a6e81 = _0x554ff6();
//   while (!![]) {
//     try {
//       const _0x464ef8 =
//         parseInt(_0x4d4fd7(0x126)) / 0x1 +
//         parseInt(_0x4d4fd7(0x13d)) / 0x2 +
//         -parseInt(_0x4d4fd7(0x115)) / 0x3 +
//         (-parseInt(_0x4d4fd7(0x10b)) / 0x4) *
//           (parseInt(_0x4d4fd7(0x129)) / 0x5) +
//         parseInt(_0x4d4fd7(0x12e)) / 0x6 +
//         (parseInt(_0x4d4fd7(0x113)) / 0x7) *
//           (parseInt(_0x4d4fd7(0x103)) / 0x8) +
//         -parseInt(_0x4d4fd7(0x134)) / 0x9;
//       if (_0x464ef8 === _0x2baf65) break;
//       else _0x5a6e81["push"](_0x5a6e81["shift"]());
//     } catch (_0x14e590) {
//       _0x5a6e81["push"](_0x5a6e81["shift"]());
//     }
//   }
// })(_0x346a, 0xcae9d);
// const IS_ANDROID = /android/i["test"](navigator[_0x5653b3(0x127)]),
//   IS_IOS =
//     (/iPad|iPhone|iPod/[_0x5653b3(0x119)](navigator[_0x5653b3(0x127)]) &&
//       !window[_0x5653b3(0x11b)]) ||
//     (navigator["platform"] === _0x5653b3(0x105) &&
//       navigator[_0x5653b3(0x10a)] > 0x1),
//   IS_SAFARI = /Safari\//[_0x5653b3(0x119)](navigator[_0x5653b3(0x127)]),
//   IS_FIREFOX = /firefox/i[_0x5653b3(0x119)](navigator[_0x5653b3(0x127)]),
//   IS_OCULUS = /OculusBrowser/[_0x5653b3(0x119)](navigator["userAgent"]),
//   IS_IOS_CHROME =
//     IS_IOS && /CriOS\//[_0x5653b3(0x119)](navigator[_0x5653b3(0x127)]),
//   IS_IOS_SAFARI = IS_IOS && IS_SAFARI,
//   SUPPORTS_SCENEVIEWER = IS_ANDROID && !IS_FIREFOX && !IS_OCULUS,
//   SUPPORTS_QUICKLOOK = (() => {
//     const _0x3d1078 = _0x5653b3,
//       _0x5873ac = document[_0x3d1078(0x123)]("a");
//     return (
//       _0x5873ac[_0x3d1078(0x12a)] &&
//       _0x5873ac[_0x3d1078(0x12a)]["supports"] &&
//       _0x5873ac["relList"][_0x3d1078(0x109)]("ar")
//     );
//   })(),
//   i = navigator[_0x5653b3(0x10a)] === 0x1,
//   activateAR = (_0x3d6810, _0x20a998, _0x2c04d3) => {
//     const _0x27825f = _0x5653b3,
//       _0x599069 = document[_0x27825f(0x123)]("a");
//     _0x20a998 &&
//       ((_0x20a998 = !![]),
//       _0x599069[_0x27825f(0x121)](document[_0x27825f(0x123)](_0x27825f(0x133))),
//       (_0x599069[_0x27825f(0x118)] = "ar")),
//       _0x599069[_0x27825f(0x128)](_0x27825f(0x143), _0x3d6810),
//       _0x599069[_0x27825f(0x135)](),
//       _0x599069[_0x27825f(0x12d)]("message", (_0x21625d) => {
//         const _0x37abf3 = _0x27825f;
//         _0x2c04d3[_0x37abf3(0x11e)](new CustomEvent(_0x37abf3(0x13c)));
//       });
//   },
//   handleClickAR = (_0x44e5ed, _0x12eb38, _0x2ef0c3) => {
//     const _0x196cb4 = _0x5653b3;
//     console[_0x196cb4(0x13f)](_0x12eb38);
//     if (i) return;
//     if (IS_IOS_CHROME || IS_IOS_SAFARI) {
//       _0x12eb38[_0x196cb4(0x128)]("ar", _0x196cb4(0x138)),
//         _0x12eb38[_0x196cb4(0x11e)](
//           new CustomEvent(_0x196cb4(0x141), { detail: _0x196cb4(0x138) })
//         );
//       const _0x5eac3b = _0x196cb4(0x116),
//         _0x3ea4fb = _0x196cb4(0x10d);
//       fetch(_0x196cb4(0x137) + _0x5eac3b + "/" + _0x3ea4fb + "/" + _0x2ef0c3, {
//         cache: "no-store",
//       })
//         [_0x196cb4(0x104)]((_0x47533d) => _0x47533d["json"]())
//         ["then"](({ data: _0x2d9476 }) => {
//           const _0x56984e = _0x196cb4,
//             _0x5ca4f3 = _0x2d9476[_0x56984e(0x112)]["ios"];
//           let _0x34848a = _0x5ca4f3 + "#";
//           activateAR(_0x34848a, _0x12eb38, !![]);
//           if (!_0x5ca4f3) {
//             console[_0x56984e(0x102)](
//               "Invalid\x20ios-src\x20in\x20<ar-button>:\x20" + _0x12eb38
//             );
//             return;
//           }
//         });
//     } else {
//       if (SUPPORTS_SCENEVIEWER) {
//         _0x12eb38[_0x196cb4(0x128)]("ar", "scene-viewer"),
//           _0x12eb38[_0x196cb4(0x11e)](
//             new CustomEvent(_0x196cb4(0x141), { detail: _0x196cb4(0x11f) })
//           );
//         const _0x77302c = _0x196cb4(0x107),
//           _0x4a8148 = _0x196cb4(0x132),
//           _0xb89d5e = _0x196cb4(0x10d);
//         fetch(
//           _0x196cb4(0x10c) +
//             _0x77302c +
//             "gu" +
//             _0x4a8148 +
//             _0xb89d5e +
//             "/" +
//             _0x2ef0c3,
//           { cache: _0x196cb4(0x131) }
//         )
//           [_0x196cb4(0x104)]((_0x9b9b6f) => _0x9b9b6f[_0x196cb4(0x125)]())
//           [_0x196cb4(0x104)](({ data: _0x27156d }) => {
//             const _0x22abcf = _0x196cb4,
//               _0x33688b = _0x27156d["model"][_0x22abcf(0x139)];
//             let _0x2aa97d = null;
//             _0x2aa97d =
//               _0x22abcf(0x13b) +
//               _0x33688b +
//               "&mode=ar_only&resizable=false&disable_occlusion=true&";
//             if (!_0x33688b) {
//               console["error"](_0x22abcf(0x114) + _0x12eb38);
//               return;
//             }
//             (_0x2aa97d +=
//               _0x22abcf(0x12f) + _0x22abcf(0x101) + _0x22abcf(0x122)),
//               (_0x2aa97d += "end;"),
//               activateAR(_0x2aa97d);
//           });
//       } else {
//         if (IS_IOS && !IS_IOS_SAFARI && !IS_IOS_CHROME) {
//           console[_0x196cb4(0x13f)](_0x196cb4(0x106)),
//             _0x12eb38["setAttribute"]("ar", _0x196cb4(0x11d)),
//             _0x12eb38["dispatchEvent"](
//               new CustomEvent(_0x196cb4(0x141), { detail: _0x196cb4(0x11d) })
//             );
//           if (_0x12eb38[_0x196cb4(0x108)](_0x196cb4(0x130)) != null)
//             _0x12eb38[_0x196cb4(0x12d)](_0x196cb4(0x135), () => {
//               const _0x3fe255 = _0x196cb4,
//                 _0x3ba083 = _0x12eb38[_0x3fe255(0x108)]("fallback-url");
//               _0x3ba083 && activateAR(encodeURIComponent(_0x3ba083));
//             });
//           else {
//             if (IS_IOS && !IS_IOS_SAFARI && !IS_IOS_CHROME)
//               _0x12eb38[_0x196cb4(0x128)]("ar", _0x196cb4(0x11d)),
//                 _0x12eb38[_0x196cb4(0x11e)](
//                   new CustomEvent("initialized", { detail: _0x196cb4(0x11d) })
//                 ),
//                 _0x12eb38[_0x196cb4(0x108)]("show-if-unsupported") != null
//                   ? _0x12eb38["addEventListener"](_0x196cb4(0x135), () => {
//                       const _0x4428f1 = _0x196cb4,
//                         _0x334dad = _0x12eb38[_0x4428f1(0x108)](
//                           _0x4428f1(0x140)
//                         );
//                       _0x334dad && activateAR(encodeURIComponent(_0x334dad));
//                     })
//                   : (_0x12eb38["style"]["display"] = _0x196cb4(0x136));
//             else
//               IS_IOS && !IS_IOS_SAFARI && !IS_IOS_CHROME
//                 ? (_0x12eb38["setAttribute"]("ar", "unsupported_ios"),
//                   _0x12eb38[_0x196cb4(0x11e)](
//                     new CustomEvent(_0x196cb4(0x141), {
//                       detail: "unsupported_ios",
//                     })
//                   ),
//                   _0x12eb38[_0x196cb4(0x108)](_0x196cb4(0x130)) != null
//                     ? _0x12eb38[_0x196cb4(0x12d)]("click", () => {
//                         const _0x40af2b = _0x196cb4,
//                           _0x228cba = _0x12eb38[_0x40af2b(0x108)](
//                             _0x40af2b(0x140)
//                           );
//                         _0x228cba && activateAR(encodeURIComponent(_0x228cba));
//                       })
//                     : (_0x12eb38[_0x196cb4(0x13a)][_0x196cb4(0x11c)] =
//                         _0x196cb4(0x136)))
//                 : (_0x12eb38[_0x196cb4(0x128)]("ar", "unsupported"),
//                   _0x12eb38[_0x196cb4(0x11e)](
//                     new CustomEvent(_0x196cb4(0x141), { detail: "unsupported" })
//                   ),
//                   _0x12eb38[_0x196cb4(0x108)]("show-if-unsupported") != null
//                     ? _0x12eb38[_0x196cb4(0x12d)]("click", () => {
//                         const _0x5d1565 = _0x196cb4,
//                           _0x212a7d = _0x12eb38[_0x5d1565(0x108)](
//                             _0x5d1565(0x140)
//                           );
//                         _0x212a7d && activateAR(encodeURIComponent(_0x212a7d));
//                       })
//                     : (_0x12eb38[_0x196cb4(0x13a)]["display"] =
//                         _0x196cb4(0x136)));
//           }
//         }
//       }
//     }
//   },
//   buttons = document[_0x5653b3(0x10f)](_0x5653b3(0x12b));
// for (let i = 0x0; i < buttons["length"]; i++) {
//   const button = buttons[_0x5653b3(0x120)](i),
//     id = String(button[_0x5653b3(0x108)](_0x5653b3(0x124)));
//   console["log"](id),
//     button["addEventListener"](_0x5653b3(0x135), (_0x4b73e9) =>
//       handleClickAR(_0x4b73e9, button, id)
//     );
// }
// function _0x346a() {
//   const _0x5e29f4 = [
//     "1239336RReeam",
//     "userAgent",
//     "setAttribute",
//     "3387380erqxMM",
//     "relList",
//     "ar-button",
//     "attachEvent",
//     "addEventListener",
//     "4889922ZVbeVv",
//     "#Intent;scheme=https;",
//     "show-if-unsupported",
//     "no-store",
//     "ess/",
//     "img",
//     "8550207oDGxPx",
//     "click",
//     "none",
//     "https://shishka-back.onrender.com/api/gu",
//     "quick-look",
//     "android",
//     "style",
//     "intent://arvr.google.com/scene-viewer/1.0?file=",
//     "quick-look-button-tapped",
//     "383330LVxogt",
//     "keydown",
//     "log",
//     "fallback-url",
//     "initialized",
//     "ctrlKey",
//     "href",
//     "package=com.google.ar.core;",
//     "error",
//     "3390424gAaJiL",
//     "then",
//     "MacIntel",
//     "it`s\x20a\x20desktop",
//     "api/",
//     "getAttribute",
//     "supports",
//     "maxTouchPoints",
//     "4yFWSBh",
//     "https://shishka-back.onrender.com/",
//     "armodels",
//     "event",
//     "querySelectorAll",
//     "shiftKey",
//     "oncontextmenu",
//     "model",
//     "21YyACJi",
//     "Invalid\x20src\x20in\x20<ar-button>:\x20",
//     "3176295qQyIVf",
//     "ess",
//     "keyCode",
//     "rel",
//     "test",
//     "contextmenu",
//     "MSStream",
//     "display",
//     "unsupported_ios",
//     "dispatchEvent",
//     "scene-viewer",
//     "item",
//     "appendChild",
//     "action=android.intent.action.VIEW;",
//     "createElement",
//     "data-id",
//     "json",
//   ];
//   _0x346a = function () {
//     return _0x5e29f4;
//   };
//   return _0x346a();
// }
// document[_0x5653b3(0x12d)](
//   _0x5653b3(0x13e),
//   function () {
//     const _0x43cb1e = _0x5653b3;
//     if (event[_0x43cb1e(0x117)] === 0x7b) return ![];
//     else {
//       if (
//         event[_0x43cb1e(0x142)] &&
//         event[_0x43cb1e(0x110)] &&
//         event["keyCode"] === 0x49
//       )
//         return ![];
//       else {
//         if (event[_0x43cb1e(0x142)] && event["keyCode"] === 0x55) return ![];
//       }
//     }
//   },
//   ![]
// );
// function _0x4beb(_0x2b9675, _0x375261) {
//   const _0x346a38 = _0x346a();
//   return (
//     (_0x4beb = function (_0x4bebda, _0x93cbaa) {
//       _0x4bebda = _0x4bebda - 0x101;
//       let _0x4b418b = _0x346a38[_0x4bebda];
//       return _0x4b418b;
//     }),
//     _0x4beb(_0x2b9675, _0x375261)
//   );
// }
// document[_0x5653b3(0x12d)]
//   ? document[_0x5653b3(0x12d)](
//       _0x5653b3(0x11a),
//       function (_0x1b6954) {
//         _0x1b6954["preventDefault"]();
//       },
//       ![]
//     )
//   : document[_0x5653b3(0x12c)](_0x5653b3(0x111), function () {
//       const _0x5f1aa1 = _0x5653b3;
//       window[_0x5f1aa1(0x10e)]["returnValue"] = ![];
//     });
