// grunt入口文件

const sass = require('sass');

const loadGruntTasks = require('load-grunt-tasks');

module.exports = grunt => {
    grunt.initConfig({
        watch: {
            js: {
                files: ['src/js/*.js'], // 坚挺的文件数组
                tasks: ['babel'], // 当文件变化时要执行的任务
            },
            css: {
                files: ['src/scss/*.scss'],
                tasks: ['sass'],
            }
        },

        babel: {
            options: {
                sourceMap: true,
                presets: ['@babel/preset-env']
            },
            main: {
                files: {
                    'dist/js/app.js': 'src/js/app.js'
                }
            }
        },

        sass: {
            options: {
                sourceMap: true,
                implementation: sass,
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        }
    })

    loadGruntTasks(grunt); // 自动加载插件

    grunt.registerTask('default', ['sass', 'babel', 'watch']);
    
    // grunt.loadNpmTasks('grunt-sass');

    // grunt.initConfig({
    //     clean: {
    //         // dist: 'dist/index.html',
    //         // dist: 'dist/*.txt',
    //         dist: 'dist/**',
    //     }
    // })

    // 加载插件
    // grunt.loadNpmTasks('grunt-contrib-clean');

    // 多目标任务
    // grunt.initConfig({
    //     // 任务名与注册的任务名相同
    //     build: {
    //         // options 会作为任务选项出现
    //         options: {
    //             global: 'dev',
    //             path: '/src'
    //         },
    //         // 除了options 其他的属性都会称为任务的一个目标任务
    //         css: 'css任务',
    //         js: 'js任务',

    //         // 为某个目标任务指定 options时，会替换掉全局的options中相同的属性
    //         static: {
    //             options: {
    //                 path: '/public',
    //             }
    //         },
    //     }
    // })
    grunt.registerMultiTask('build', '多目标任务', function() {
        console.log(this.options())
        console.log(`build task - target: ${this.target} data: ${this.data}`)
    })


    // grunt.initConfig({
    //     name: 'along'
    // })

    grunt.registerTask('getName', () => {
        console.log(grunt.config('name'));
    })

    grunt.registerTask('hello', () => {
        console.log('hello world');
    })

    grunt.registerTask('des', '任务描述', () => {
        console.log('des task')
    })

    grunt.registerTask('async-task', function() {
        // 异步任务必须在执行之前调用this.async 并拿到返回结果
        const done = this.async();
        setTimeout(function () {
            console.log('异步任务执行了')
            done()
        }, 1000)
    })

    // 任务中返回false 代表任务失败，在串行任务中，失败的任务之后的任务不再执行
    // 如果想要穿行任务失败之后的任务强制执行，可以指定 --force 的参数 
    grunt.registerTask('error-task', '模拟执行失败的任务', () => {
        console.log('模拟执行失败的任务');
        return false;
    })

    // 异步任务标记失败
    grunt.registerTask('async-error-task', '模拟执行失败的异步任务', function() {
        const done = this.async();
        setTimeout(() => {
            console.log('模拟执行失败的异步任务');
            done(false);
        }, 1000)
    })

    // grunt.registerTask('default', '默认任务', ['hello', 'des', 'async-task'])

}