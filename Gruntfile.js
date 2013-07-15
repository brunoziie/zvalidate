grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    uglify: {
        options: {},
        build: {
            src: 'src/zvalidate.js',
            dest: 'dist/zvalidate.min.js'
        }
    },
    cssmin: {
        minify: {
            expand: true,
            cwd: 'src/css/',
            src: ['*.css', '!*.min.css'],
            dest: 'dist/',
            ext: '.min.css'
        }
    }
});