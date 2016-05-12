(function (global, factory) {
    if (typeof define === "function" && define.amd) {
        define(['module', 'exports', 'jQuery'], factory);
    } else if (typeof exports !== "undefined") {
        factory(module, exports, require('jQuery'));
    } else {
        var mod = {
            exports: {}
        };
        factory(mod, mod.exports, global.jQuery);
        global.BootstrapModalDom = mod.exports;
    }
})(this, function (module, exports, _jQuery) {
    'use strict';

    Object.defineProperty(exports, "__esModule", {
        value: true
    });

    var _jQuery2 = _interopRequireDefault(_jQuery);

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

    function _classCallCheck(instance, Constructor) {
        if (!(instance instanceof Constructor)) {
            throw new TypeError("Cannot call a class as a function");
        }
    }

    var _createClass = function () {
        function defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor);
            }
        }

        return function (Constructor, protoProps, staticProps) {
            if (protoProps) defineProperties(Constructor.prototype, protoProps);
            if (staticProps) defineProperties(Constructor, staticProps);
            return Constructor;
        };
    }();

    var BootstrapModalDom = function () {
        function BootstrapModalDom(dialog) {
            _classCallCheck(this, BootstrapModalDom);

            this.dialog = dialog;

            this.defaultConfig = {
                modalId: '',
                dialogClass: '',
                header: '',
                buttons: []
            };

            this.defaultButtonConfig = {
                title: '',
                primary: false,
                closeModal: true,
                classes: [],
                action: function action($modal, e) {
                    return true;
                }
            };
        }

        _createClass(BootstrapModalDom, [{
            key: 'convert',
            value: function convert(content, options) {
                options = _extends({}, this.defaultConfig, options);

                var $modal = this.tag('div').addClass('modal').attr({
                    'tabindex': '-1',
                    'role': 'dialog',
                    'aria-hidden': 'true'
                }),
                    $dialog = this.tag('div').addClass('modal-dialog').addClass(options.dialogClass),
                    $content = this.tag('section').addClass('modal-content');

                if (!!options.modalId) {
                    $modal.attr('id', options.modalId);
                }

                $modal.append($dialog.append($content.append(this.assemblyHeader(options), this.assemblyBody(content), this.assemblyFooter(options))));

                return $modal;
            }
        }, {
            key: 'assemblyHeader',
            value: function assemblyHeader(options) {
                var $header = this.tag('header').addClass('modal-header');

                $header.append(this.tag('h4').addClass('modal-title').append(this.tag('span').text(options.header)));

                return $header;
            }
        }, {
            key: 'assemblyBody',
            value: function assemblyBody(content) {
                return this.tag('div').addClass('modal-body').append(content);
            }
        }, {
            key: 'assemblyFooter',
            value: function assemblyFooter(options) {
                var _this = this;

                var $footer = null;

                if (options.buttons.length > 0) {
                    $footer = this.tag('div').addClass('modal-footer');

                    var _loop = function _loop(i) {
                        var buttonConfig = _extends({}, _this.defaultButtonConfig, options.buttons[i]);
                        var $button = _this.tag('button').addClass('btn btn-dialog').attr('type', 'button').text(buttonConfig.title);

                        if (buttonConfig.primary || i === 0) {
                            $button.addClass('btn-primary');
                        }

                        if (buttonConfig.classes) {
                            $button.addClass(buttonConfig.classes.join(' '));
                        }

                        $button.click(function (e) {
                            var $modal = _this.getModal(e.target);
                            var res = buttonConfig.action($modal, e);

                            if (res !== false && buttonConfig.closeModal) {
                                _this.dialog.close($modal);
                            }
                        });

                        $footer.append($button);
                    };

                    for (var i = 0; i < options.buttons.length; i++) {
                        _loop(i);
                    }
                }

                return $footer;
            }
        }, {
            key: 'tag',
            value: function tag(_tag) {
                return (0, _jQuery2.default)(document.createElement(_tag));
            }
        }, {
            key: 'getModal',
            value: function getModal(childNode) {
                return (0, _jQuery2.default)(childNode).parents('.modal');
            }
        }]);

        return BootstrapModalDom;
    }();

    exports.default = BootstrapModalDom;
    module.exports = exports['default'];
});