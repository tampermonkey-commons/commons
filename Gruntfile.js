function generateUglifyOptions(components) {
    let options = {}
    let srcs = []

    for (let component of components) {
        let src = `src/${component}.js`
        let dest = `dist/${component}.min.js`
        let option = {
            src: src,
            dest: dest
        }
        options[component] = option
        srcs.push(src)
    }

    let component = "commons"
    let option = {
        src: srcs,
        dest: `dist/${component}.min.js`
    }
    options[component] = option

    return options
}

module.exports = function(grunt) {
    let components = [ 
        'logger',
        'user-script-config',
        'dynamic-injector',
        'skeleton'
    ]

    let usConfig = grunt.file.readJSON('userscript.json')

    // 配置信息
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: generateUglifyOptions(components)
    })

    // 加载uglify
    grunt.loadNpmTasks('grunt-contrib-uglify')

    // 默认执行任务
    grunt.registerTask('default', ['uglify'])
}