var mongoose = require('mongoose');

var recordSchema = Schema({
    id: { type: String },
    FeildsValue: { type: String }
})

// Use UserSchema.statics to define static functions
recordSchema.statics.recordlist = function(cb) {
    this.find().limit( 20 ).exec( function( err, records ) 
    {
        if( err ) return cb( err );

        cb(null, records);
    });
};

var recordModel = mongoose.model( 'record', recordSchema);
module.exports = {RecordModel:recordModel};