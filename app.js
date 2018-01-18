var express = require('express')
var mongoose = require('mongoose')
var _ = require('underscore')
var bodyParser = require('body-parser')
var Movie = require('./models/movie')
var path = require('path')
var port = process.env.PORT || 3000
var app = express()
mongoose.connect('mongodb://localhost/imooc',{useMongoClient:true})
app.set('views','./views/pages')
app.set('view engine','ejs')
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname,'public')))
app.listen(port)
console.log('imooc started on port'+ port )

//index page
app.get('/',function (req,res) {
    var pagesize = parseInt(req.query.pagesize,10) || 10;
    var pagestart = parseInt(req.query.pagestart,10) || 1;
    Movie.fetch(pagestart,pagesize,function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('index',{
            title:'大秦首页',
            movies:movies
        })
    })

})
//detail page
app.get('/movie/:id',function (req,res) {
    var id = req.params.id
    Movie.findById(id,function (err,movie) {
        if(err) return console.log(err);

        res.render('detail',{
            title:'详情页'+movie.title,
            movie:movie
        })
    })
})
//admin page后台录入
app.get('/admin/movie',function (req,res) {
    res.render('admin',{
        title:'后台录入',
        movie:{
            title:'',
            doctor:'',
            country:'',
            year:'',
            poster:'',
            flash:'',
            summary:'',
            language:''
        }
    })
})


//admin update

app.get('/admin/update/:id',function(req,res){
    var id = req.params.id
    if(id){
        Movie.findById(id,function(err,movie){
              res.render('admin',{
                title:'imooc 更新电影',
                movie:movie
              })  
        })
    }

})



//admin post movie
//保存
app.post('/admin/movie/new',function (req,res) {
    var id = req.body.id
    var movieObj = req.body
    var _movie
    if(id !== ''){

        Movie.findById(id,function (err,movie) {
            if(err){
                console.log(err)
            }

            _movie = _.extend(movie,movieObj)

            _movie.save(function (err,move) {
                if(err){
                    console.log(err)
                }

                res.redirect('/movie/'+movie._id)
            })
        })
    }
    else {
        _movie = new Movie({
            title:movieObj.title,
            doctor:movieObj.doctor,
            country:movieObj.country,
            year:movieObj.year,
            poster:movieObj.poster,
            flash:movieObj.flash,
            summary:movieObj.summary,
            language:movieObj.language
        })
        _movie.save(function(err,movie){
             if(err){
                    console.log(err)
                }
                res.redirect('/movie/'+movie._id)
            })
        }
    }
)




//list page
app.get('/admin/list',function (req,res) {

      var pagesize = parseInt(req.query.pagesize,10) || 10;
    var pagestart = parseInt(req.query.pagestart,10) || 1;
    Movie.fetch(pagestart,pagesize,function (err,movies) {
        if(err){
            console.log(err)
        }
        res.render('list',{
        title:'列表页',
        movies:movies
    })
    })
})

//list delete movie

app.delete('/admin/list',function (req,res) {
    var id = req.query.id
    if(id){
        Movie.remove({_id:id},function (err,movie) {
            if(err) return console.log(err)
            res.json({success:1})
        })
    }
})
