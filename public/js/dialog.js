(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'jQuery', 'modal', 'BootstrapModalDom'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('jQuery'), require('modal'), require('BootstrapModalDom'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.jQuery, global.modal, global.BootstrapModalDom);
        global.dialog = mod.exports;
    }
})(this, function (module, exports, _jQuery, _modal, _BootstrapModalDom) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

    var _modal2 = _interopRequireDefault(_modal);

    var _BootstrapModalDom2 = _interopRequireDefault(_BootstrapModalDom);

    function _interopRequireDefault(obj) {
        return obj && obj.__esModule ? obj : {
            default: obj
        };
    }

    var _extends = Object.assign || function (target) {
        for (var i = 1; i < arguments.length; i++) {
            var source = arguments[i];

            for (var key in source) {
                if (Object.prototype.hasOwnProperty.call(source, key)) {
                    target[key] = source[key];
                }
            }
        }

        return target;
    };

    var modalDialogFactory = function modalDialogFactory($, modal, ModalDom) {
        var dialog = {};
        dialog.modalDom = new ModalDom(dialog);
        dialog.defaultOptions = {
            focusFirstInput: true
        };
        dialog.init = function (content, options) {
            options = _extends({}, modal.defaultOptions, dialog.defaultOptions, options);
            var dom = dialog.buildDom(content, options);
            var $modal = modal.init(dom, options);
            $modal.appendTo($(options.appendLocation));

            return $modal;
        };
        dialog.open = function ($modal) {
            $modal = $($modal);

            modal.open($modal);

            if ($modal.data().modal.focusFirstInput) {
                $modal.find('button[type="submit"], button[type="button"], input[type="submit"], ' + 'input[type="button"], textarea, input[type="date"], input[type="datetime"], ' + 'input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], ' + 'input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], ' + 'input[type="url"], input[type="week"]').first().focus();
            }

            return $modal;
        };
        dialog.close = function ($modal) {
            modal.close($modal);
        };
        dialog.buildDom = function (content, options) {
            return dialog.modalDom.convert(content, options);
        };

        return dialog;
    };

    exports.default = modalDialogFactory(_jQuery2.default, _modal2.default, _BootstrapModalDom2.default);
    module.exports = exports['default'];
});