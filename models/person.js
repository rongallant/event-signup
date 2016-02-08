var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    textSearch = require('mongoose-text-search')

var PersonSchema = new Schema({
    nickName: {
        type: String,
        maxlength: 70,
        index: { unique: true },
        required: true
    },
    lastName: {
        type: String,
        maxlength: 35,
        required: true
    },
    firstName: {
        type: String,
        maxlength: 35,
        required: true
    },
    email: {
        type: String,
        maxlength: 254,
        index: { unique: true },
        required: true
    },
    phone: { type: String, maxlength: 18 },
    isChild: { type: Boolean },
    childAge: { type: Number, min: 0, max: 17 },
    gearList: { type: String, maxlength: 2000 },
    _address: { type: Schema.Types.ObjectId, ref: 'Address'  },
    _emergencyContact: { type: Schema.Types.ObjectId, ref: 'Person'  },
    cr_id: {},
    lu_id: {}
}, {
    strict: true,
    timestamps: true,
    toObject: {
        virtuals: true
    },
    toJSON: {
        virtuals: true
    }

})

// give our schema text search capabilities
PersonSchema.plugin(textSearch);

// add a text index to the tags array
PersonSchema.index({
    nickName: 'text',
    lastName: 'text',
    firstName: 'text',
    email: 'text',
    phone: 'text'

});

// Virtual Attibute 'fullName'
PersonSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName
})

// Save timestamp
PersonSchema.pre('save', function(next) {
  this.starttime = new Date()
  next()
})

module.exports = mongoose.model('Person', PersonSchema)
