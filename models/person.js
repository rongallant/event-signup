var mongoose = require('mongoose'),
    Schema = mongoose.Schema

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

PersonSchema.index({nickName: 1, field2: 1, lastName: 1, firstName: 1, email: 1}, {unique: true});

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
