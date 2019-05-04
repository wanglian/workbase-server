const filetype = (type) => {
  let _t = "file";
  if (type.match(/image/)) {
    _t = "image";
  } else if (type.match(/pdf/)) {
    _t = "pdf";
  } else if (type.match(/opendocument/)) {
    _t = "odf";
  } else if (type.match(/audio/)) {
    _t = "audio";
  } else if (type.match(/video/)) {
    _t = "video";
  } else if (type.match(/word/)) {
    _t = "word";
  } else if (type.match(/spreadsheet/)) {
    _t = "excel";
  } else if (type.match(/powerpoint/)) {
    _t = "ppt";
  } else if (type.match(/zip/)) {
    _t = "archive";
  } else if (type.match(/text|json/)) {
    _t = "text";
  }
  return _t;
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
