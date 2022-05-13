module.exports = {
    compile: {
        options: {
            namespace: "app.templates",
            processName: function (filepath) {
                return filepath.slice(filepath.indexOf('components/') + 11, filepath.length);
            },
            processContent: function (content, filepath) {
                content = content.replace(/^[\x20\t]+/mg, '').replace(/[\x20\t]+$/mg, '');
                content = content.replace(/^[\r\n]+/, '').replace(/[\r\n]*$/, '\n');
                return content;
            }
        },
        files: {
            "<%= app.bin %>/js/templates.js": ["<%= app.source %>/components/**/*.hbs"]
        }
    }
};