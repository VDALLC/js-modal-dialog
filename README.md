# vda-modal
thing for modal opening

# example
let options = {
  modalId: 'modalId1',
  dialogClass: 'dialogClass1',
  header: 'modal header',
  buttons: [
    {
      title: 'button1',
      primary: false,
      closeModal: true,
      classes: ['btn-class1', 'btn-class2'],
      action: ($modal, e) => true
    },
    {
      title: 'button2',
      primary: true,
      closeModal: true,
      classes: ['btn-class1', 'btn-class2'],
      action: ($modal, e) => true
    }
  ],
  
  focusFirstInput: true,
  
  closeByEscapePress: true,
  closeByOverlayClick: true,
  appendLocation: 'body',
  beforeOpen: ($modal, options) => true,
  afterOpen: ($modal, options) => true,
  beforeClose: ($modal, options) => true,
  afterClose: ($modal, options) => true
}

let $modal = dialog.init('<div>modal content</div>', options)
dialog.open($modal);
dialog.close($modal);
