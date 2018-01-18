var mongoose = require('mongoose')
var MovieSchema = new mongoose.Schema({
    doctor:String,
    title:String,
    language:String,
    country:String,
    summary:String,
    flash:String,
    poster:String,
    year:Number,
    meta:{
        createAt:{
            type:Date,
            default:Date.now()
        },
        updateAt:{
            type:Date,
            defaule:Date.now()
        }
    }
})
MovieSchema.pre('save',function (next) {
    if(this.isNew){
        this.meta.createAt = this.meta.updateAt = Date.now()
    }else {
        this.meta.updateAt = Date.now()
    }
    next()
})
MovieSchema.statics = {
    fetch:function (pagestart,pagesize,cb) {
        return this.find({}).skip((pagestart-1)*pagesize).limit(pagesize).sort('meta.updateAt').exec(cb)
    },
    findById:function (id,cb) {
        return this.findOne({_id:id}).exec(cb)
    }
}
module.exports = MovieSchema