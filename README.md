### grunt


```
yarn add grunt
```

根目录创建`gruntfile.js`文件

```
module.exports = grunt => {
    grunt.registerTask('hello', () => {
        console.log('hello world');
    })
}
```
命令行执行 `yarn grunt hello`  
可以看到命令行打印hello world

可以通过注册函数 第二个参数为字符串，来为任务添加描述，这个描述会通过`yarn grun --help`时显示

```
grunt.registerTask('des', '任务描述', () => {
    console.log('des task')
})
```

<pre style="background: #000; color: #ccc;">
PS C:\Users\admin\Desktop\grunt-test> yarn grunt --help 

...

Available tasks
         hello  Custom task.
           des  任务描述
</pre>


异步任务,异步任务需要借助 grunt 的 async 函数

```
 grunt.registerTask('async-task', function() {
    // 异步任务必须在执行之前调用this.async 并拿到返回结果
    const done = this.async();
    setTimeout(function () {
        console.log('异步任务执行了')
        done()
    }, 1000)
})
```

默认任务，在命令行直接执行 `yarn grunt`时，会查看是否注册名为`default`的任务，有的话会执行`default`任务

```
grunt.registerTask('default', '默认任务', () => {
    console.log('模拟默认任务');
})
```

串行任务，可以为注册任务指定一个任务数组，再执行该任务时会一次执行任务数组中的任务

```
grunt.registerTask('default', '默认任务', ['hello', 'des', 'async-task'])
```

任务标记失败

```
// 任务中返回false 代表任务失败，在串行任务中，失败的任务之后的任务不再执行
// 如果想要穿行任务失败之后的任务强制执行，可以指定 --force 的参数 
grunt.registerTask('error-task', '模拟执行失败的任务', () => {
    console.log('模拟执行失败的任务');
    return false;
})
```

异步任务标记失败

```
 // 异步任务标记失败
    grunt.registerTask('async-error-task', '模拟执行失败的异步任务', function() {
        const done = this.async();
        setTimeout(() => {
            console.log('模拟执行失败的异步任务');
            done(false);
        }, 1000)
    })
```

配置方法initConfig

```javascript
grunt.initConfig({
    name: 'along'
})

grunt.registerTask('getName', () => {
    console.log(grunt.config('name'));
})
```

### 多目标任务

```
// 多目标任务
grunt.initConfig({
    // 任务名与注册的任务名相同
    build: {
        // options 会作为任务选项出现
        options: {
            global: 'dev',
            path: '/src'
        },
        // 除了options 其他的属性都会称为任务的一个目标任务
        css: 'css任务',
        js: 'js任务',

        // 为某个目标任务指定 options时，会替换掉全局的options中相同的属性
        static: {
            options: {
                path: '/public',
            }
        },
    }
})
grunt.registerMultiTask('build', '多目标任务', function() {
    console.log(this.options())
    console.log(`build task - target: ${this.target} data: ${this.data}`)
})
```

执行这个任务

<pre style="background: #000; color: #fff;">
PS C:\Users\admin\Desktop\grunt-test> yarn grunt build
yarn run v1.22.4
$ C:\Users\admin\Desktop\grunt-test\node_modules\.bin\grunt build
Running "build:css" (build) task
{ global: 'dev', path: '/src' }
build task - target: css data: css任务

Running "build:js" (build) task
{ global: 'dev', path: '/src' }
build task - target: js data: js任务

Running "build:static" (build) task
{ global: 'dev', path: '/public' }
build task - target: static data: [object Object]
</pre>


### 插件使用

安装清除文件插件
`yarn add grunt-contrib-clean`

```
grunt.initConfig({
    // 需要对应的配置
    clean: {
        // dist: 'dist/index.html',
        // dist: 'dist/*.txt',
        dist: 'dist/**',
    }
})

// 加载插件
grunt.loadNpmTasks('grunt-contrib-clean');
```

sass插件

`yarn add grunt-sass sass`

```
const sass = require('sass');

module.exports = grunt => {
    grunt.initConfig({
        sass: {
            options: {
                implementation: sass,
            },
            main: {
                files: {
                    'dist/css/main.css': 'src/scss/main.scss'
                }
            }
        }
    })

    grunt.loadNpmTasks('grunt-sass');
}
```

babel

`yarn add grunt-babel @babel/core @babel/preset-env`

```
grunt.initConfig({
    babel: {
        options: {
            presets: ['@babel/preset-env']
        },
        main: {
            files: {
                'dist/js/app.js': 'src/js/app.js'
            }
        }
    },
    grunt.loadNpmTasks('grunt-babel');
    
})
```

自动加载模块

`yarn add load-grunt-tasks --dev`

```
const loadGruntTasks = require('load-grunt-tasks');

module.exports = grunt => {
    grunt.initConfig({
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
    })

    loadGruntTasks(grunt); // 自动加载插件
}
```

监听文件自动编译

```
yarn add grunt-contrib-watch --dev
```

```
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
}
```
之后被监听文件修改会自动编译