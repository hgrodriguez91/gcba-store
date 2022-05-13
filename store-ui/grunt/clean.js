module.exports = {
	options: { 
		force: true 
	},		
	target : [
	          'bin', 
	          '<%= app.target %>/img', 
	          '<%= app.target %>/css', 
	          '<%= app.target %>/js', 
	          '<%= app.target %>/fonts', 
	          '<%= app.target %>/locales'
	          ]
};
