module.exports = {
	all: {
		// Sprite files to read in
		src: ['<%= app.source %>/images/sprites/*.png'],

		// Location to output spritesheet
		destImg: '<%= app.source %>/images/sprite.png',

		// Stylus with variables under sprite names
		destCSS: '<%= app.source %>/stylesheets/elements/sprite.less',

		// OPTIONAL: Manual override for imgPath specified in CSS
		imgPath: '../img/sprite.png',

		// OPTIONAL: Specify algorithm (top-down, left-right, diagonal [\ format],
		// alt-diagonal [/ format], binary-tree [best packing])
		algorithm: 'binary-tree',

		// OPTIONAL: Specify padding between images
		padding: 2,

		// OPTIONAL: Specify engine (auto, phantomjs, canvas, gm, pngsmith)
		engine: 'pngsmith',

		// OPTIONAL: Specify CSS format (inferred from destCSS' extension by default)
		// (stylus, scss, scss_maps, sass, less, json, json_array, css)
		cssFormat: 'css',

		// OPTIONAL: Specify css options
		cssOpts: {
			// Some templates allow for skipping of function declarations
			functions: false,

			// CSS template allows for overriding of CSS selectors
			cssClass: function (item) {
				return '.ico-' + item.name + '()';
			}
		}
	}
}