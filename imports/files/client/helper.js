const filetype = (type) => {
  if (type.match(/image/)) {
    return "image";
  } else if (type.match(/pdf/)) {
    return "pdf";
  } else if (type.match(/opendocument/)) {
    return "odf";
  } else if (type.match(/audio/)) {
    return "audio";
  } else if (type.match(/video/)) {
    return "video";
  } else if (type.match(/word/)) {
    return "word";
  } else if (type.match(/spreadsheet/)) {
    return "excel";
  } else if (type.match(/powerpoint/)) {
    return "ppt";
  } else if (type.match(/zip/)) {
    return "archive";
  } else if (type.match(/text|json/)) {
    return "text";
  } else {
    return 'file';
  }
};
Template.registerHelper('filetype', filetype);

Template.registerHelper('fileicon', function(type) {
  switch (filetype(type)) {
  case 'image':
    return "<i class='fa fa-file-image-o text-info'></i>";
  case 'pdf':
    return "<i class='fa fa-file-video-o text-info'></i>";
  case 'odf':
    return "<i class='fa fa-file-o text-blue'></i>"; // no af icon yet
  case 'audio':
    return "<i class='fa fa-file-audio-o text-info'></i>";
  case 'video':
    return "<i class='fa fa-file-video-o text-info'></i>";
  case 'word':
    return "<i class='fa fa-file-word-o text-blue'></i>";
  case 'excel':
    return "<i class='fa fa-file-excel-o text-success'></i>";
  case 'ppt':
    return "<i class='fa fa-file-powerpoint-o text-info'></i>";
  case 'archive':
    return "<i class='fa fa-file-archive-o text-info'></i>";
  case 'text':
    return "<i class='fa fa-file-text-o text-info'></i>";
  default:
    return "<i class='fa fa-file-o'></i>";
  }
});
