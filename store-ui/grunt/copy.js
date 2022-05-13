module.exports = {
	production: {
		files: [
			{
				expand: true,
				cwd: "<%= app.source %>/images/",
				src: "*",
				dest: "<%= app.target %>/img/",
				filter: 'isFile'
			},
            {
				expand: true,
				cwd: "<%= app.source %>/images/how-it-works/",
				src: ["*.*", "**/*.*"],
				dest: "<%= app.target %>/img/how-it-works/"
			},
			{
			    expand: true,
			    cwd: "<%= app.source %>/images/home-slide/",
			    src: ["*.*", "**/*.*"],
			    dest: "<%= app.target %>/img/home-slide/"
			},
            {
                expand: true,
                cwd: "<%= app.source %>/images/users/",
                src: ["*.*", "**/*.*"],
                dest: "<%= app.target %>/img/users/"
            },
            {
                expand: true,
                cwd: "<%= app.source %>/images/icons/",
                src: ["*.*", "**/*.*"],
                dest: "<%= app.target %>/img/icons/"
			},
			{
                expand: true,
                cwd: "<%= app.source %>/images/flag/",
                src: ["*.*", "**/*.*"],
                dest: "<%= app.target %>/img/flag/"
            },
			{
				expand: true,
				cwd: '<%= app.source %>/json/',
				src: ["**/*.*"],
				dest: '<%= app.target %>/json/'
			},
			{
				expand: true,
				cwd: '<%= app.source %>/locales/',
				src: ["**/*.*"],
				dest: '<%= app.target %>/locales/'
			},
            {
                expand: true,
                cwd: "<%= app.source %>/fonts/",
                src: ["*"],
                dest: "<%= app.target %>/fonts/"
            },
			{
				flatten: true,
				expand: true,
				src: './bower_components/font-awesome/fonts/*',
				dest: '<%= app.target %>/fonts/'
			},
			{
				flatten: true,
				expand: true,
				src: './bower_components/bootstrap/fonts/*',
				dest: '<%= app.target %>/fonts/'
			},
			{
				flatten: true,
				expand: true,
				src: './bower_components/respond/dest/respond.min.js',
				dest: '<%= app.target %>/js/'
			},
			{
				flatten: true,
				expand: true,
				src: './bower_components/html5shiv/dist/html5shiv.min.js',
				dest: '<%= app.target %>/js/'
			},
			{
				flatten: true,
				expand: true,
				src: './bower_components/jquery/dist/jquery.min.map',
				dest: '<%= app.target %>/js/'
			},
			{
				flatten: true,
				expand: true,
				src: ['./bower_components/select2/select2.png',
				      './bower_components/select2/select2x2.png'],
				dest: '<%= app.target %>/css/'
			},
			{
				flatten: true,
				expand: true,
				src: './bower_components/select2/select2-spinner.gif',
				dest: '<%= app.target %>/css/'
			},
			{
				flatten: true,
				expand: true,
				src: './bower_components/pace/pace.min.js',
				dest: '<%= app.target %>/js/'
			},
            {
				flatten: true,
				expand: true,
				src: './bower_components/pace/themes/blue/pace-theme-minimal.css',
				dest: '<%= app.target %>/css/'
			},
            {
                expand: true,
                cwd: "./bower_components/jquery-ui/themes/base/images/",
                src: ["*.*", "**/*.*"],
                dest: "<%= app.target %>/css/images/"
            },
            {
                expand: true,
                cwd: "./bower_components/",
                src: ["jssor-slider/img/*.*"],
                dest: "<%= app.target %>/css/"
            },
            {
                expand: true,
                cwd: "<%= app.source %>/components/commons/draggable-slider",
                src: ["draggable-slider-sprite.png"],
                dest: "<%= app.target %>/css/"
            }
		]
	}
}
