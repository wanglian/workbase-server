if (Package.ui) {
	let Template = Package.templating.Template;
	let UI = Package.ui.UI;
	let HTML = Package.htmljs.HTML;
	let Blaze = Package.blaze.Blaze; // implied by `ui`

	UI.registerHelper('markdown', new Template('markdown', function () {
		let self = this;
		let text = "";
		if(self.templateContentBlock) {
			text = Blaze._toText(self.templateContentBlock, HTML.TEXTMODE.STRING);
		}

		return HTML.Raw(Markdown(text));
	}));
}
