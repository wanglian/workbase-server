import './view.html';

Template.UploadFile.events({
  "click .btn-file"(e, t) {
    e.preventDefault();
    t.$('.file').click();
  },
  "change .file"(e, t) {
    Modal.show('FileUploadModal', {
      thread: this.thread,
      file:   e.target.files[0]
    }, {
      backdrop: 'static'
    });
    $(e.target).val(""); // reset file input
  },
});