"use strict";
(wx["webpackJsonp"] = wx["webpackJsonp"] || []).push([["common"],{

/***/ "./src/store/userStore.ts":
/*!********************************!*\
  !*** ./src/store/userStore.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   useUserStore: function() { return /* binding */ useUserStore; }
/* harmony export */ });
/* harmony import */ var D_project_dcq_wanqing_1v_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/regenerator.js */ "./node_modules/@babel/runtime/helpers/esm/regenerator.js");
/* harmony import */ var D_project_dcq_wanqing_1v_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js */ "./node_modules/@babel/runtime/helpers/esm/asyncToGenerator.js");
/* harmony import */ var zustand__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! zustand */ "./node_modules/zustand/esm/index.mjs");



var useUserStore = (0,zustand__WEBPACK_IMPORTED_MODULE_0__.create)(function (set, get) {
  return {
    isLoggedIn: false,
    token: '',
    userInfo: null,
    setToken: function setToken(token) {
      return set({
        token: token
      });
    },
    setUserInfo: function setUserInfo(info) {
      return set({
        userInfo: info,
        isLoggedIn: true
      });
    },
    login: function () {
      var _login = (0,D_project_dcq_wanqing_1v_node_modules_babel_runtime_helpers_esm_asyncToGenerator_js__WEBPACK_IMPORTED_MODULE_1__["default"])(/*#__PURE__*/(0,D_project_dcq_wanqing_1v_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])().m(function _callee(username, password) {
        return (0,D_project_dcq_wanqing_1v_node_modules_babel_runtime_helpers_esm_regenerator_js__WEBPACK_IMPORTED_MODULE_2__["default"])().w(function (_context) {
          while (1) switch (_context.n) {
            case 0:
              return _context.a(2, new Promise(function (resolve) {
                setTimeout(function () {
                  // 简单的模拟验证
                  if (username && password) {
                    var userInfo = {
                      id: '1',
                      username: username,
                      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop'
                    };
                    set({
                      userInfo: userInfo,
                      isLoggedIn: true,
                      token: 'mock_token_' + Date.now()
                    });
                    resolve(true);
                  } else {
                    resolve(false);
                  }
                }, 500);
              }));
          }
        }, _callee);
      }));
      function login(_x, _x2) {
        return _login.apply(this, arguments);
      }
      return login;
    }(),
    logout: function logout() {
      set({
        isLoggedIn: false,
        token: '',
        userInfo: null
      });
    }
  };
});

/***/ })

}]);
//# sourceMappingURL=common.js.map