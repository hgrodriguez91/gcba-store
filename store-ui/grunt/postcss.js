module.exports = {
	options : {
		map : true,
		processors : [ require('autoprefixer')({
			browsers : [ 'last 2 versions' ]
		}) ]
	},
	dist : {
		src : '<%= app.target %>/css/*.css'
	}
};
