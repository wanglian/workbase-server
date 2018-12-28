let renderer = new Markdown.Renderer();
renderer.link = function(href, title, text) {
  let link = Markdown.Renderer.prototype.link.call(this, href, title, text);
  return link.replace("<a", "<a target='_blank' ");
};

Markdown.setOptions({
  renderer: renderer
});
