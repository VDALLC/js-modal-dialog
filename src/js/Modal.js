import $ from 'jquery';

class Modal {
    constructor() {
        this.globalId = 1;
        this.queue = [];
        this.animationEndEvent = 'animationend webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend';
        this.zIndex = 1000;
        this.baseClassNames = {
            modal: '__modal',
            opening: '__opening',
            opened: '__opened',
            closing: '__closing',
            closed: '__closed',
            activating: '__activating',
            active: '__active',
            bodyModalIsOpened: '__modal-opened'
        };
        this.defaultOptions = {
            closeByEscapePress: true,
            closeByOverlayClick: true,
            removeAfterClose: true,
            appendLocation: 'body',
            beforeOpen: ($modal, options) => true,
            afterOpen: ($modal, options) => true,
            beforeClose: ($modal, options) => true,
            afterClose: ($modal, options) => true
        };

        (() => {
            $(window).bind('keyup.modal', (event) => {
                if (event.keyCode === 27) {
                    return this.closeByEscape();
                }
            });

            $(window)
                .bind('modalOpen.modal', () => {
                    $('body').addClass(this.baseClassNames.bodyModalIsOpened)
                })
                .bind('modalAfterClose.modal', () => {
                    if (this.getAllModals().length == 0) {
                        $('body').removeClass(this.baseClassNames.bodyModalIsOpened);
                    }
                });
        })();
    }
    
    init(dom, options) {
        options = Object.assign({}, this.defaultOptions, options);
        options.id = this.globalId++;

        options.$modal = $(dom).data({modal: options}).addClass(this.baseClassNames.modal);
        options.$modalOverlay = options.$modal;
        options.$modalContent = options.$modal.find(':first-child').data({modal: options});

        if (options.closeByOverlayClick) {
            options.$modalOverlay.bind('click.modal', (e) => {
                if (e.target !== e.currentTarget) {
                    return;
                }
                return this.closeById($(e.currentTarget).data().modal.id);
            });
        }

        options.$modal
            .css({display: 'none'})
            .removeClass(this.getModifiersCssClasses())
            .addClass(this.baseClassNames.closed);

        return options.$modal;
    }
    
    open($modal) {
        let options = $($modal).data().modal;

        options.beforeOpen(options.$modal, options);

        options.$modal
            .unbind(this.animationEndEvent)
            .removeClass(this.getModifiersCssClasses())
            .addClass(this.baseClassNames.opened)
            .addClass(this.baseClassNames.active)
            .css({display: 'block'});

        this.pushToQueue(options.$modal);

        options.afterOpen(options.$modal, options);

        setTimeout(() => options.$modal.trigger('modalOpen', options), 0);

        return options.$modal;
    }
    
    /**
     * @returns Array
     */
    getAllModals() {
        return $(`.${this.baseClassNames.modal}:not(".${this.baseClassNames.closing}"):not(".${this.baseClassNames.closed}")`)
            .toArray()
            .map((modal) => $(modal));
    }
    
    /**
     * @param id
     * @returns Array
     */
    getModalById(id) {
        return this.getAllModals().filter(($modal) => $modal.data().modal.id === id);
    }
    
    close($modal, immediately = false) {
        if ($modal) {
            this.closeById($($modal).data().modal.id, immediately);
        } else {
            let $lastModal = this.getAllModals().pop();
            if ($lastModal) {
                this.closeById($lastModal.data().modal.id, immediately);
            }
        }
    }
    
    closeAll(immediately = false) {
        this.getAllModals()
            .map(($modal) => $modal.data().modal.id)
            .reverse()
            .forEach((id) => this.closeById(id, immediately));
    }
    
    closeById(id, immediately = false) {
        this.getModalById(id)
            .filter(($modal) => {
                return !$modal.hasClass(this.baseClassNames.closed) && !$modal.hasClass(this.baseClassNames.closing);
            })
            .forEach(($modal) => {
                let options = $modal.data().modal;
                let close = () => {
                    $modal.trigger('modalClose', options);

                    $modal.css({display: 'none'})
                        .unbind(this.animationEndEvent)
                        .removeClass(this.getModifiersCssClasses())
                        .removeClass(this.baseClassNames.active)
                        .addClass(this.baseClassNames.closed);


                    this.removeFromQueue($modal);

                    if (options.removeAfterClose) {
                        $modal.remove();
                    }
                    
                    $('body').trigger('modalAfterClose', options);

                    options.afterClose($modal, options);
                };

                let $modalContent = $modal.data().modal.$modalContent;
                let hasAnimation = ($modalContent.css('animationName') !== 'none' && $modalContent.css('animationDuration') !== '0s')
                        || ($modal.css('animationName') !== 'none' && $modal.css('animationDuration') !== '0s');

                if (!immediately && hasAnimation) {
                    if (options.beforeClose($modal, options) !== false) {
                        $modal.unbind(this.animationEndEvent)
                            .bind(this.animationEndEvent, () => close())
                            .removeClass(this.getModifiersCssClasses())
                            .addClass(this.baseClassNames.closing);

                        this.queue
                            .filter((value, index, ar) => index == ar.length - 2)
                            .forEach((value) => $(value).addClass(this.baseClassNames.activating));
                    }
                } else {
                    if (options.beforeClose($modal, options) !== false) {
                        close();
                    }
                }
            });
    }
    
    closeByEscape() {
        this.queue
            .filter((value, index, ar) => {
                return index == ar.length - 1 && $(value).data().modal.closeByEscapePress === true
            })
            .forEach((value) => this.closeById($(value).data().modal.id));
    }
    
    getModifiersCssClasses() {
        return `${this.baseClassNames.opening} ${this.baseClassNames.opened} ${this.baseClassNames.closing} ${this.baseClassNames.closed} ${this.baseClassNames.activating} `;
    }
    
    pushToQueue($modal) {
        this.queue
            .filter((value, index, ar) => index == ar.length - 1)
            .forEach((value) => $(value).removeClass(this.baseClassNames.active));

        $modal
            .addClass(this.baseClassNames.active)
            .css({zIndex: this.zIndex + this.queue.length});
        this.queue.push($modal[0]);
    }
    
    removeFromQueue($modal) {
        $modal.removeClass(this.baseClassNames.active);

        let index = this.queue.indexOf($modal[0]);

        if (index != -1) {
            this.queue.splice(index, 1);
        }

        this.queue
            .filter((value, index, ar) => index == ar.length - 1)
            .forEach((value) => $(value)
            .addClass(this.baseClassNames.active)
            .removeClass(this.baseClassNames.activating));
    }
}

export default Modal;