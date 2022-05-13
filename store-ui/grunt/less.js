module.exports = {
	production: {
		options: {
			compress: true,
			sourceMap: true,
			cleancss: false
		},
		expand: true,
		cwd: "<%= app.source %>/stylesheets/",
		src: "site.less",
		dest: "<%= app.target %>/css/",
		ext: ".css"
	}
}