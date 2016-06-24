import $ from 'jquery';

let modalFactory = function($) {
    let modal,
        animationEndSupport = false;

    $(function() {
        let s = (document.body || document.documentElement).style;
        animationEndSupport = s.animation !== void 0 || s.WebkitAnimation !== void 0 || s.MozAnimation !== void 0 || s.MsAnimation !== void 0 || s.OAnimation !== void 0;

        $(window).bind('keyup.modal', function(event) {
            if (event.keyCode === 27) {
                return modal.closeByEscape();
            }
        });

        $('body')
            .bind('modalOpen.modal', function() {
                $('body').addClass(modal.baseClassNames.bodyModalIsOpened)
            })
            .bind('modalAfterClose.modal', function() {
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
            modal: '__modal',
            opening: '__opening',
            opened: '__opened',
            closing: '__closing',
            closed: '__closed',
            activating: '__activating',
            active: '__active',
            bodyModalIsOpened: '__modal-opened'
        },
        defaultOptions: {
            closeByEscapePress: true,
            closeByOverlayClick: true,
            removeAfterClose: true,
            appendLocation: 'body',
            beforeOpen: ($modal, options) => true,
            afterOpen: ($modal, options) => true,
            beforeClose: ($modal, options) => true,
            afterClose: ($modal, options) => true
        },
        init: function(dom, options) {
            options = Object.assign({}, modal.defaultOptions, options);
            options.id = modal.globalId++;

            options.$modal = $(dom).data({modal: options}).addClass(modal.baseClassNames.modal);
            options.$modalOverlay = options.$modal;
            options.$modalContent = options.$modal.find('.modal-dialog').data({modal: options});

            if (options.closeByOverlayClick) {
                options.$modalOverlay.bind('click.modal', function(e) {
                    if (e.target !== this) {
                        return;
                    }
                    return modal.closeById($(this).data().modal.id);
                });
            }

            options.$modal
                .css({display: 'none'})
                .removeClass(modal.getModificatorsCssClasses())
                .addClass(modal.baseClassNames.closed);

            return options.$modal;
        },
        open: function($modal) {
            let options = $($modal).data().modal;

            options.beforeOpen(options.$modal, options);

            options.$modal
                .unbind(modal.animationEndEvent)
                .removeClass(modal.getModificatorsCssClasses())
                .addClass(modal.baseClassNames.opened)
                .addClass(modal.baseClassNames.active)
                .css({display: 'block'});

            modal.pushToQueue(options.$modal);

            options.afterOpen(options.$modal, options);

            setTimeout(() => options.$modal.trigger('modalOpen', options), 0);

            return options.$modal;
        },
        /**
         * @returns Array
         */
        getAllModals: function() {
            return $(`.${modal.baseClassNames.modal}:not(".${modal.baseClassNames.closing}")`)
                .toArray()
                .map((modal) => $(modal));
        },
        /**
         * @param id
         * @returns Array
         */
        getModalById: function(id) {
            return modal.getAllModals().filter(($modal) => $modal.data().modal.id === id);
        },
        close: function($modal) {
            if ($modal) {
                modal.closeById($($modal).data().modal.id);
            } else {
                let $lastModal = modal.getAllModals().pop();
                if ($lastModal) {
                    modal.closeById($lastModal.data().modal.id);
                }
            }
        },
        closeAll: function() {
            modal.getAllModals()
                .map(($modal) => $modal.data().modal.id)
                .reverse()
                .forEach((id) => modal.closeById(id));
        },
        closeById: function(id) {
            modal.getModalById(id)
                .filter(function($modal) {
                    return !$modal.hasClass(modal.baseClassNames.closed) && !$modal.hasClass(modal.baseClassNames.closing);
                })
                .forEach(function($modal) {
                    let options = $modal.data().modal;
                    let close = function() {
                        $modal.trigger('modalClose', options);

                        $modal.css({display: 'none'})
                            .unbind(modal.animationEndEvent)
                            .removeClass(modal.getModificatorsCssClasses())
                            .removeClass(modal.baseClassNames.active)
                            .addClass(modal.baseClassNames.closed);


                        modal.removeFromQueue($modal);

                        $('body').trigger('modalAfterClose', options);

                        options.afterClose($modal, options);

                        if (options.removeAfterClose) {
                            $modal.remove();
                        }
                    };

                    let $modalContent = $modal.data().modal.$modalContent;
                    let hasAnimation = ($modalContent.css('animationName') !== 'none' && $modalContent.css('animationDuration') !== '0s')
                            || ($modal.css('animationName') !== 'none' && $modal.css('animationDuration') !== '0s');

                    if (animationEndSupport && hasAnimation) {
                        if (options.beforeClose($modal, options) !== false) {
                            $modal.unbind(modal.animationEndEvent)
                                .bind(modal.animationEndEvent, function() {
                                    close();
                                })
                                .removeClass(modal.getModificatorsCssClasses())
                                .addClass(modal.baseClassNames.closing);

                            modal.queue
                                .filter((value, index, ar) => index == ar.length - 2)
                                .forEach((value) => $(value).addClass(modal.baseClassNames.activating));
                        }
                    } else {
                        if (options.beforeClose($modal, options) !== false) {
                            close();
                        }
                    }
                });
        },
        closeByEscape: function() {
            modal.queue
                .filter(function(value, index, ar) {
                    return index == ar.length - 1 && $(value).data().modal.closeByEscapePress === true
                })
                .forEach((value) => modal.closeById($(value).data().modal.id));
        },
        getModificatorsCssClasses: function() {
            return `${modal.baseClassNames.opening} ${modal.baseClassNames.opened} ${modal.baseClassNames.closing} ${modal.baseClassNames.closed} ${modal.baseClassNames.activating} `;
        },
        pushToQueue: function($modal) {
            modal.queue
                .filter((value, index, ar) => index == ar.length - 1)
                .forEach((value) => $(value).removeClass(modal.baseClassNames.active));

            $modal
                .addClass(modal.baseClassNames.active)
                .css({zIndex: modal.zIndex + modal.queue.length});
            modal.queue.push($modal[0]);
        },
        removeFromQueue: function($modal) {
            $modal.removeClass(modal.baseClassNames.active);

            let index = modal.queue.indexOf($modal[0]);

            if (index != -1) {
                modal.queue.splice(index, 1);
            }

            modal.queue
                .filter((value, index, ar) => index == ar.length - 1)
                .forEach((value) => $(value)
                .addClass(modal.baseClassNames.active)
                .removeClass(modal.baseClassNames.activating));
        }
    };
};

export default modalFactory($);