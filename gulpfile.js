var gulp=require('gulp'),
    sass=require('gulp-ruby-sass'),
    rename=require('gulp-rename'),
    livereload = require('gulp-livereload'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    autoprefixer=require('gulp-autoprefixer'),
    imagemin=require('gulp-imagemin'),
    cache=require('gulp-cache'),
    webpack=require('gulp-webpack');

gulp.task('styles', function() {
    return sass('sass/*.scss', {
            style: 'expanded'
        })
        .pipe(autoprefixer({
            browsers: ['Firefox>=4', 'Opera>=10', 'Android>=4.0'],
            cascade: true, //是否美化属性值 默认：true
            remove: true //去掉不必要的前缀
        }))
        .pipe(cssnano())
        .pipe(gulp.dest('dist/'));

});

gulp.task('scripts',function(cb){
    return gulp.src('src/entry.js')
            .pipe(webpack(require('./webpack.config.js')))
            .pipe(gulp.dest('dist'));
});

//image
gulp.task('images',function(){
    return gulp.src('img/**/*.{png,jpg,gif,ico}')
        .pipe(cache(imagemin({optimizationLevel:5,progressive:true,interlaced:true})))
        .pipe(gulp.dest('dist/public'))
        
});

gulp.task('watch',function(){
    //watch scss
    gulp.watch('sass/*.scss',['styles']);
});
