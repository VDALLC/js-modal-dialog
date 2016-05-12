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
        global.modal = mod.exports;
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

    var modalFactory = function modalFactory($) {
        var modal = void 0,
            animationEndSupport = false;

        $(function () {
            var s = (document.body || document.documentElement).style;
            animationEndSupport = s.animation !== void 0 || s.WebkitAnimation !== void 0 || s.MozAnimation !== void 0 || s.MsAnimation !== void 0 || s.OAnimation !== void 0;

            $(window).bind('keyup.modal', function (event) {
                if (event.keyCode === 27) {
                    return modal.closeByEscape();
                }
            });

            $('body').bind('modalOpen.modal', function () {
                $('body').addClass(modal.baseClassNames.bodyModalIsOpened);
            }).bind('modalAfterClose.modal', function () {
                if (modal.getAllModals().length == 0) {
                    $('body').removeClass(modal.baseClassNames.bodyModalIsOpened);
                }
            });
        });

        return modal = {
            globalId: 1,
            queue: [],
            animationEndEvent: 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend',
            zIndex: 1000,
            baseClassNames: {
                modal: 'modal',
                opening: '__opening',
                opened: '__opened',
                closing: '__closing',
                closed: '__closed',
                active: '__active',
                bodyModalIsOpened: '__modal-opened'
            },
            defaultOptions: {
                closeByEscapePress: true,
                closeByOverlayClick: true,
                appendLocation: 'body',
                beforeOpen: function beforeOpen($modal, options) {
                    return true;
                },
                afterOpen: function afterOpen($modal, options) {
                    return true;
                },
                beforeClose: function beforeClose($modal, options) {
                    return true;
                },
                afterClose: function afterClose($modal, options) {
                    return true;
                }
            },
            init: function init(dom, options) {
                options = _extends({}, modal.defaultOptions, options);
                options.id = modal.globalId++;

                options.$modal = $(dom).data({ modal: options });
                options.$modalOverlay = options.$modal;
                options.$modalContent = options.$modal.find('.modal-dialog').data({ modal: options });

                if (options.closeByOverlayClick) {
                    options.$modalOverlay.bind('click.modal', function (e) {
                        if (e.target !== this) {
                            return;
                        }
                        return modal.closeById($(this).data().modal.id);
                    });
                }

                options.$modal.css({ display: 'none' }).removeClass(modal.getModificatorsCssClasses()).addClass(modal.baseClassNames.closed);

                return options.$modal;
            },
            open: function open($modal) {
                var options = $($modal).data().modal;

                options.beforeOpen(options.$modal, options);

                options.$modal.unbind(modal.animationEndEvent).removeClass(modal.getModificatorsCssClasses()).addClass(modal.baseClassNames.opened).addClass(modal.baseClassNames.active).css({ display: 'block' });

                modal.pushToQueue(options.$modal);

                options.afterOpen(options.$modal, options);

                setTimeout(function () {
                    return options.$modal.trigger('modalOpen', options);
                }, 0);

                return options.$modal;
            },
            /**
             * @returns Array
             */
            getAllModals: function getAllModals() {
                return $('.' + modal.baseClassNames.modal + ':not(".' + modal.baseClassNames.closing + '")').toArray().map(function (modal) {
                    return $(modal);
                });
            },
            /**
             * @param id
             * @returns Array
             */
            getModalById: function getModalById(id) {
                return modal.getAllModals().filter(function ($modal) {
                    return $modal.data().modal.id === id;
                });
            },
            close: function close($modal) {
                if ($modal) {
                    modal.closeById($($modal).data().modal.id);
                } else {
                    var $lastModal = modal.getAllModals().pop();
                    if ($lastModal) {
                        modal.closeById($lastModal.data().modal.id);
                    }
                }
            },
            closeAll: function closeAll() {
                modal.getAllModals().map(function ($modal) {
                    return $modal.data().modal.id;
                }).reverse().forEach(function (id) {
                    return modal.closeById(id);
                });
            },
            closeById: function closeById(id) {
                modal.getModalById(id).filter(function ($modal) {
                    return !$modal.hasClass(modal.baseClassNames.closed) && !$modal.hasClass(modal.baseClassNames.closing);
                }).forEach(function ($modal) {
                    var options = $modal.data().modal;
                    var close = function close() {
                        $modal.trigger('modalClose', options);

                        $modal.css({ display: 'none' }).unbind(modal.animationEndEvent).removeClass(modal.getModificatorsCssClasses()).removeClass(modal.baseClassNames.active).addClass(modal.baseClassNames.closed);

                        modal.removeFromQueue($modal);

                        $('body').trigger('modalAfterClose', options);

                        options.afterClose($modal, options);
                    };

                    var $modalContent = $modal.data().modal.$modalContent;
                    var hasAnimation = $modalContent.css('animationName') !== 'none' && $modalContent.css('animationDuration') !== '0s';

                    if (animationEndSupport && hasAnimation) {
                        if (options.beforeClose($modal, options) !== false) {
                            $modal.unbind(modal.animationEndEvent).bind(modal.animationEndEvent, function () {
                                close();
                            }).removeClass(modal.getModificatorsCssClasses()).addClass(modal.baseClassNames.closing);
                        }
                    } else {
                        if (options.beforeClose($modal, options) !== false) {
                            close();
                        }
                    }
                });
            },
            closeByEscape: function closeByEscape() {
                modal.queue.filter(function (value, index, ar) {
                    return index == ar.length - 1 && $(value).data().modal.closeByEscapePress === true;
                }).forEach(function (value) {
                    return modal.closeById($(value).data().modal.id);
                });
            },
            getModificatorsCssClasses: function getModificatorsCssClasses() {
                return modal.baseClassNames.opening + ' ' + modal.baseClassNames.opened + ' ' + modal.baseClassNames.closing + ' ' + modal.baseClassNames.closed;
            },
            pushToQueue: function pushToQueue($modal) {
                modal.queue.filter(function (value, index, ar) {
                    return index == ar.length - 1;
                }).forEach(function (value) {
                    return $(value).removeClass(modal.baseClassNames.active);
                });

                $modal.addClass(modal.baseClassNames.active).css({ zIndex: modal.zIndex + modal.queue.length });
                modal.queue.push($modal[0]);
            },
            removeFromQueue: function removeFromQueue($modal) {
                $modal.removeClass(modal.baseClassNames.active);

                var index = modal.queue.indexOf($modal[0]);

                if (index != -1) {
                    modal.queue.splice(index, 1);
                }

                modal.queue.filter(function (value, index, ar) {
                    return index == ar.length - 1;
                }).forEach(function (value) {
                    return $(value).addClass(modal.baseClassNames.active);
                });
            }
        };
    };

    exports.default = modalFactory(_jQuery2.default);
    module.exports = exports['default'];
});