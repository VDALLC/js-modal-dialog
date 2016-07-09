import $ from 'jquery';
import Modal from 'modal';
import BootstrapModalDom from 'BootstrapModalDom';

class BootstrapDialog extends Modal {
    constructor() {
        super();
        
        this.modalDom = new BootstrapModalDom(this);
        let options = {
            focusFirstInput: true,
            buildDom: true
        };
        this.defaultOptions = Object.assign({}, this.defaultOptions, options); 
    }
    
    init(content, options) {
        options = Object.assign({}, this.defaultOptions, options);

        let dom = options.buildDom ? dialog.buildDom(content, options) : $(content);
        let $modal = super.init(dom, options);
        if (options.appendLocation) {
            $modal.appendTo($(options.appendLocation));
        }

        return $modal;
    }
    
    open($modal) {
        $modal = $($modal);

        super.open($modal);

        if ($modal.data().modal.focusFirstInput) {
            $modal.find('button[type="submit"], button[type="button"], input[type="submit"], ' +
            'input[type="button"], textarea, input[type="date"], input[type="datetime"], ' +
            'input[type="datetime-local"], input[type="email"], input[type="month"], input[type="number"], ' +
            'input[type="password"], input[type="search"], input[type="tel"], input[type="text"], input[type="time"], ' +
            'input[type="url"], input[type="week"]').first().focus();
        }

        return $modal;
    }

    buildDom(content, options) {
        return this.modalDom.convert(content, options);
    }
}

export default BootstrapDialog;