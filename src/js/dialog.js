import $ from 'jquery';
import modal from 'modal';
import BootstrapModalDom from 'BootstrapModalDom';

let modalDialogFactory = function($, modal, ModalDom) {
    let dialog = {};

    for (let key in modal) {
        dialog[key] = modal[key];
    }

    dialog.modalDom = new ModalDom(dialog);
    dialog.defaultOptions = {
        focusFirstInput: true,
        buildDom: true
    };
    dialog.init = function(content, options) {
        options = Object.assign({}, modal.defaultOptions, dialog.defaultOptions, options);

        let dom = options.buildDom ? dialog.buildDom(content, options) : $(content);
        let $modal = modal.init(dom, options);
        if (options.appendLocation) {
            $modal.appendTo($(options.appendLocation));
        }

        return $modal;
    };
    dialog.open = function($modal) {
        $modal = $($modal);

        modal.open($modal);

        if ($modal.data().modal.focusFirstInput) {
            $modal.find('button[type="submit"], button[type="button"], input[type="submit"], ' +
            'input[type="button"], textarea, input[type="date"], input[type="datetime"], ' +
            'input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], ' +
            'input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], ' +
            'input[type="url"], input[type="week"]').first().focus();
        }

        return $modal;
    };

    dialog.buildDom = function(content, options) {
        return dialog.modalDom.convert(content, options);
    };

    return dialog;
};

export default modalDialogFactory($, modal, BootstrapModalDom);