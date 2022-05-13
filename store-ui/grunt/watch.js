module.exports = {
	options: {
		//livereload: true
	},
	less: {
		files: ["<%= app.source %>/**/*.less"],
		tasks: ["styles", "copy"]
	},
	images: {
		files: ["<%= app.source %>/images/**"],
		tasks: ["sprite", "copy"]
	},
	concat: {
		files: ["<%= app.source %>/components/**/*.js", "<%= app.source %>/utils/**/*.js"],
		tasks: ["jsvalidate", "concat", "copy"]
	},
	handlebars: {
		files: ["<%= app.source %>/components/**/*.hbs"],
		tasks: ["handlebars", "concat", "copy"]
	},
	dependencies: {
		files: ["./bower_components/*"],
		tasks: "all"
	},
	configFiles: {
		files: ["Gruntfile.js", "grunt/*.js", "grunt/aliases.yaml"],
		options: {
			reload: true
		},
		tasks: "all"
	},
	locales : {
		files: ["<%= app.source %>/locales/**/*.json"],
		tasks: ["copy"]
	}
};