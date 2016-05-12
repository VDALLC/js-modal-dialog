import $ from 'jQuery';

class BootstrapModalDom {
    constructor(dialog) {
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
            action: ($modal, e) => true
        };
    }

    convert(content, options) {
        options = Object.assign({}, this.defaultConfig, options);

        var $modal = this.tag('div')
                .addClass('modal')
                .attr({
                    'tabindex': '-1',
                    'role': 'dialog',
                    'aria-hidden': 'true'
                }),
            $dialog = this.tag('div')
                .addClass('modal-dialog')
                .addClass(options.dialogClass),
            $content = this.tag('section')
                .addClass('modal-content');

        if (!!options.modalId) {
            $modal.attr('id', options.modalId);
        }

        $modal.append(
            $dialog.append(
                $content.append(
                    this.assemblyHeader(options),
                    this.assemblyBody(content),
                    this.assemblyFooter(options))));

        return $modal;
    }

    assemblyHeader(options) {
        let $header = this.tag('header').addClass('modal-header');

        $header.append(
            this.tag('h4')
                .addClass('modal-title')
                .append(this.tag('span').text(options.header)));

        return $header;
    }

    assemblyBody(content) {
        return this.tag('div')
            .addClass('modal-body')
            .append(content);
    }

    assemblyFooter(options) {
        let $footer = null;

        if (options.buttons.length > 0) {
            $footer = this.tag('div')
                .addClass('modal-footer');

            for (let i = 0; i < options.buttons.length; i++) {
                let buttonConfig = Object.assign({}, this.defaultButtonConfig, options.buttons[i]);
                let $button = this.tag('button')
                    .addClass('btn btn-dialog')
                    .attr('type', 'button')
                    .text(buttonConfig.title);

                if (buttonConfig.primary || i === 0) {
                    $button.addClass('btn-primary');
                }

                if (buttonConfig.classes) {
                    $button.addClass(buttonConfig.classes.join(' '));
                }

                $button.click((e) => {
                    let $modal = this.getModal(e.target);
                    let res = buttonConfig.action($modal, e);

                    if (res !== false && buttonConfig.closeModal) {
                        this.dialog.close($modal);
                    }
                });

                $footer.append($button);
            }
        }

        return $footer;
    }

    tag(tag) {
        return $(document.createElement(tag));
    }

    getModal(childNode) {
        return $(childNode).parents('.modal');
    }
}

export default BootstrapModalDom;