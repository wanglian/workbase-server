let renderer = new Markdown.Renderer();
renderer.link = function(href, title, text) {
  href = `javascript: window.open('${href}', '_blank', 'location=no')`;
  return Markdown.Renderer.prototype.link.call(this, href, title, text);
  // let link = Markdown.Renderer.prototype.link.call(this, href, title, text);
  // return link.replace("<a", "<a target='_blank' "); // open in new window
};

Markdown.setOptions({
  renderer: renderer
});
