const jshint    = require('gulp-jshint');
const gulp      = require('gulp-help')(require('gulp'));
const minify    = require('gulp-minify');
const plumber   = require('gulp-plumber'); // Prevents watch from failing on error
const notify    = require('gulp-notify');  // Emits desktop notifications
const runSeq    = require('run-sequence'); // Runs tasks in sequence
const fs        = require('fs-extra');
const klawSync  = require('klaw-sync');    // Recursively walks through directories to find file paths
const path      = require('path');
var piwik       = require ('piwik').setup ('http://ai.dotomi.com/ct-analytics/piwik.php', 'a4cc737ce8303c75776b1f4acae00241');

piwik.track ({
    idsite: 12,
    url: '',
    uid: process.env.USER,
    action_name: 'Usher completed',
    e_c: 'Usher Run',
    e_a: 'Directory: ' + process.cwd(),
    h: new Date().getHours(),
    m: new Date().getMinutes(),
    s: new Date().getSeconds()
});

var exp_path  = process.cwd();
var src_path;

if(exp_path.slice(-3).toLowerCase() !== 'dev'){
    console.log("This isn't a dev directory. Quitting Usher.")
    process.exit()
} else {
    exp_path = exp_path + '/bin';
    src_path = path.join(process.cwd(), '/bin_CT');
    console.log(`Watching files in ${src_path} and exporting to ${exp_path}... press ctrl+c to quit`)
}

if(fs.existsSync(exp_path)){
    if(!fs.existsSync(src_path)){
            fs.copySync(exp_path, src_path);
            fs.copySync(exp_path, src_path + '/original_gh_exports');
    }
} else {
    console.log('There is no bin directory. Quitting Usher.')
    process.exit();
}

gulp.task('junkVars', 'Inserts Junk vars into lead file', function(){
    junkVars(src_path);
});
 
gulp.task('lint', 'Lints all JS files', function() {
  return gulp.src([src_path + '/*.js', '!' + src_path + '/message_vars.js'])
    .pipe(plumber({
        errorHandler: notify.onError('Linting failed! Check your gulp process.')
    }))
    .pipe(jshint(__dirname + '/.jshintrc'))
    .pipe(jshint.reporter('jshint-stylish'))
});

gulp.task('compress', function() {
  return gulp.src([src_path + '/*.js', '!' + src_path + '/message_vars.js'])
    .pipe(plumber({
        errorHandler: notify.onError('Build failed! Check your gulp process.')
    }))
    .pipe(minify({
        ext:{
            min:'.js'
        },
        noSource: true,
        ignoreFiles: ['.combo.js', '-min.js', 'message_vars.js']
    }))
    .pipe(gulp.dest(exp_path))
});

gulp.task('watch', false, function(){
    gulp.watch(src_path + '/*.js', function(){
        runSeq('lint', 'compress');
    });
});

gulp.task('default', function() {
    runSeq('junkVars', 'lint', 'compress', 'watch');
});

function junkVars(_path){
          var files = getFiles(_path);
          var msgVars = getMsgVars(_path);
          var files_with_vars = addMsgVars(files, msgVars);    

    function getFiles(_path){
        var fileNames = klawSync(_path,{ignore: "original_gh_exports"}).filter(function(obj){
            return obj.path.substr(obj.path.length-2, obj.path.length) =='js';
        });
        return fileNames;
    }
    
    function getMsgVars(_path){
        var msgVarsTemp;
        try { 
            var msgVarsTemp = fs.readFileSync(_path + '/message_vars.js', 'utf8');
        } 
        catch (err) {
            console.log("Message_var.js not found in 'target' directory");
            msgVarsTemp = '';
        }
        return '//ADDING CTT JUNK VARS' + '\n' + msgVarsTemp;
    }

    function addMsgVars(_files, vars){
        var files = _files;
        var cntr = 0;
        function loopThroughFile(){
            if(cntr > files.length){
                return false;
            } else {
                fs.readFile(files[cntr].path, 'utf8', function(err, data){
                    if(data.indexOf(vars) == -1 && data.indexOf('//ADDING CTT JUNK VARS') > -1){
                        data = data.replace('//ADDING CTT JUNK VARS', vars);
                    }
                    fs.writeFile(src_path + '/' + files[cntr].path.split('/')[files[cntr].path.split('/').length-1], data, 'utf8', function(){
                        cntr++;
                        loopThroughFile();
                    });
                });
            }
            
        }
    }
}