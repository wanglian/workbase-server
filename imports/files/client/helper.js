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

const FILE_ICONS = {
  image:   "<i class='fa fa-file-image-o text-info'></i>",
  pdf:     "<i class='fa fa-file-pdf-o text-danger'></i>",
  odf:     "<i class='fa fa-file-o text-blue'></i>",
  audio:   "<i class='fa fa-file-audio-o text-info'></i>",
  video:   "<i class='fa fa-file-video-o text-info'></i>",
  word:    "<i class='fa fa-file-word-o text-blue'></i>",
  excel:   "<i class='fa fa-file-excel-o text-success'></i>",
  ppt:     "<i class='fa fa-file-powerpoint-o text-info'></i>",
  archive: "<i class='fa fa-file-archive-o text-info'></i>",
  text:    "<i class='fa fa-file-text-o text-info'></i>"
};
Template.registerHelper('fileicon', function(type) {
  return FILE_ICONS[filetype(type)] || "<i class='fa fa-file-o'></i>";
});
