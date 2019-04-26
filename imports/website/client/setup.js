import './setup.html';
import './setup.css';

import SimpleSchema from 'simpl-schema';
import Swal from 'sweetalert2';

Template.Setup.events({
  "click .setup-panel a"(e, t) {
    e.preventDefault();

    let item = $(e.target);
    let target = $(item.attr('href'));

    if (!item.attr('disabled')) {
      $('.setup-panel a').removeClass('btn-primary').addClass('btn-default');
      item.addClass('btn-primary');
      $('.setup-content').addClass('hide');
      target.removeClass('hide');
      target.find('input:eq(0)').focus();
    }
  },
  "click .btn-prev"(e, t) {
    e.preventDefault();

    let curStep = $(e.target).closest(".setup-content");
    let curStepBtn = curStep.attr("id");
    let prevStepWizard = $('.setup-panel a[href="#' + curStepBtn + '"]').parent().prev().children("a");

    prevStepWizard.removeAttr('disabled').trigger('click');
  },
  "click .btn-next"(e, t) {
    e.preventDefault();

    let curStep = $(e.target).closest(".setup-content");
    let curStepBtn = curStep.attr("id");
    let nextStepWizard = $('.setup-panel a[href="#' + curStepBtn + '"]').parent().next().children("a");
    let curInputs = curStep.find("input[type='text'],input[type='url']");
    let isValid = true;

    $(".form-group").removeClass("has-error");
    for (let i = 0; i < curInputs.length; i++) {
      if (!curInputs[i].validity.valid){
        isValid = false;
        $(curInputs[i]).closest(".form-group").addClass("has-error");
      }
    }

    if (isValid) {
      switch ($(e.target).data("panel")) {
      case "company":
        Meteor.call("setupCompany", $('input[name=company]').val(), $('input[name=domain]').val(), (err, res) => {
          nextStepWizard.removeAttr('disabled').trigger('click');
        });
        break;
      case "email":
        Meteor.call("setupEmail", $('select[name=emailType]').val(), {key: $('input[name=mailgun]').val()}, (err, res) => {
          nextStepWizard.removeAttr('disabled').trigger('click');
        });
        break;
      case "S3":
        Meteor.call("setupStorage", $('select[name=storageType]').val(), {
          key: $('input[name=s3Key]').val(),
          secret: $('input[name=s3Secret]').val(),
          bucket: $('input[name=s3Bucket]').val(),
          region: $('input[name=s3Region]').val(),
        }, (err, res) => {
          nextStepWizard.removeAttr('disabled').trigger('click');
        });
        break;
      default:
        nextStepWizard.removeAttr('disabled').trigger('click');
        Meteor.setTimeout(() => {
          $('#step-5 div.doing').addClass('hide');
          $('#step-5 div.done').removeClass('hide');
          $('#step-5 button[type=submit]').removeClass('hide');
        }, 2000);
      }
    }
  },
  "change select[name=emailType]"(e, t) {
    e.preventDefault();

    if ($(e.target).val() === 'mailgun') {
      $('#mailgun-key').removeClass('hide');
    } else {
      $('#mailgun-key').addClass('hide');
    }
  },
  "change select[name=storageType]"(e, t) {
    e.preventDefault();

    if ($(e.target).val() === 'S3') {
      $('#s3-config').removeClass('hide');
    } else {
      $('#s3-config').addClass('hide');
    }
  }
});

Template.Setup.helpers({
  instance() {
    return Instance.findOne();
  },
  mailgunSelected() {
    let instance = Instance.findOne();
    return instance && instance.modules && instance.modules.email && instance.modules.email.type === 'mailgun';
  },
  s3Selected() {
    let instance = Instance.findOne();
    return instance && instance.modules && instance.modules.storage && instance.modules.storage.type === 'S3';
  },
  formCollection() {
    return Instance;
  },
  formSchema() {
    return new SimpleSchema({
      company: {
        type: String,
        max: 50,
        autoform: {
          type: 'text',
          label: I18n.t('setup_company_name')
        }
      },
      domain: {
        type: String,
        max: 50,
        autoform: {
          type: 'text',
          label: I18n.t('setup_domain')
        }
      },
      emailType: {
        type: String,
        optional: true,
        autoform: {
          type: 'select',
          label: false,
          firstOption: I18n.t("setup_email_disabled"),
          options: [{
            label: "Mailgun",
            value: 'mailgun'
          }]
        }
      },
      mailgun: {
        type: String,
        optional: true,
        max: 40,
        autoform: {
          type: 'text',
          label: 'Mailgun Key'
        }
      },
      storageType: {
        type: String,
        optional: true,
        autoform: {
          type: 'select',
          label: false,
          firstOption: I18n.t("setup_storage_local"),
          options: [{
            label: "Amazon S3",
            value: 'S3'
          }]
        }
      },
      s3Key: {
        type: String,
        max: 20,
        optional: true,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Key'),
        }
      },
      s3Secret: {
        type: String,
        max: 40,
        optional: true,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Secret'),
        }
      },
      s3Bucket: {
        type: String,
        max: 50,
        optional: true,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Bucket'),
        }
      },
      s3Region: {
        type: String,
        max: 30,
        optional: true,
        autoform: {
          type: 'text',
          label: I18n.t('S3 Region'),
        }
      },
      name: {
        type: String,
        max: 50,
        autoform: {
          type: 'text',
          label: I18n.t('users_name'),
        }
      },
      email: {
        type: String,
        max: 50,
        regEx: SimpleSchema.RegEx.Email,
        autoform: {
          type: 'emailInput',
          label: 'Email'
        }
      },
      password: {
        type: String,
        max: 50,
        autoform: {
          type: 'password',
          label: I18n.t("users_password")
        }
      }
    });
  }
});

AutoForm.hooks({
  "setup-form": {
    onSubmit(insertDoc, updateDoc, currentDoc) {
      this.event.preventDefault();

      Meteor.call('setupAdmin', insertDoc.name, insertDoc.email, insertDoc.password, (err, res) => {
        if (err) {
          console.log(err);
        } else {
          console.log(res);
        }
        this.done();
      });
    }
  }
});
