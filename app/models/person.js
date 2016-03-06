var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    bcrypt = require('bcrypt-nodejs'),
    uuid = require('node-uuid'),
    mongoosePaginate = require('mongoose-paginate'),
    Schema = mongoose.Schema,
    Vendor = require("./vendor"),
    Pet = require("./pet")

var PersonSchema = new Schema({
    token: {
        type: String
    },
    username: {
        type: String,
        required: false,
        index: {
            unique: true
        },
        default: uuid.v1()
    },
    password: String,
    facebook: {
        id: String,
        token: String,
        email: String,
        name: String
    },
    twitter: {
        id: String,
        token: String,
        displayName: String,
        username: String
    },
    google: {
        id: String,
        token: String,
        email: String,
        name: String
    },

    roles: [{
        type: String,
        enum: ['user', 'admin', 'manager']
    }],

    email: {
        type: String,
        maxlength: 254,
        required: false
    },
    firstName: {
        type: String,
        maxlength: 35,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 35,
        required: true
    },
    phone: { type: String, maxlength: 18 },
    gender: { type: String },
    isChild: { type: Boolean },
    childAge: { type: Number, min: 0, max: 17 },
    gearList: { type: String, maxlength: 2000 },
    cr_id: {},
    lu_id: {},
    _address: { type: Schema.Types.ObjectId, ref: 'Address'  },
    _emergencyContact: { type: Schema.Types.ObjectId, ref: 'Person'  },
    _vendor: { type: Vendor.schema  },
    _pet: { type: Pet.schema  }
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

PersonSchema.plugin(passportLocalMongoose)

PersonSchema.plugin(mongoosePaginate);

PersonSchema.index({username: 1, field2: 1, lastName: 1, firstName: 1, email: 1}, {unique: true});

// Virtual Attibute 'fullName'
PersonSchema.virtual('fullName').get(function () {
    return this.firstName + ' ' + this.lastName
})

// Save timestamp
PersonSchema.pre('save', function(next) {
    this.starttime = new Date()
    next()
})

// methods ======================
// generating a hash
PersonSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
PersonSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('Person', PersonSchema)
