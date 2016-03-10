var mongoose = require('mongoose'),
    passportLocalMongoose = require('passport-local-mongoose'),
    Schema = mongoose.Schema,
    mongoosePaginate = require('mongoose-paginate'),
    bcrypt = require('bcrypt-nodejs')

var AccountSchema = new Schema({
    username: {
        type: String,
        maxlength: 35,
        required: true,
        index: {
            unique: true
        }
    },
    password: { type: String, maxlength: 35 },
    roles: [{
        type: String,
        maxlength: 35,
        enum: ['CONTACT', 'USER', 'ADMIN', 'MANAGER'],
        default: 'CONTACT'
    }],
    email: { type: String, maxlength: 254 },

    _person: { type: Schema.Types.ObjectId, ref: 'Person' }

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

AccountSchema.plugin(passportLocalMongoose)

AccountSchema.plugin(mongoosePaginate);

// Save timestamp
AccountSchema.pre('save', function(next) {
    this.starttime = new Date()
    next()
})

// methods ======================
// generating a hash
AccountSchema.methods.generateHash = function(password) {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
}

// checking if password is valid
AccountSchema.methods.validPassword = function(password) {
    return bcrypt.compareSync(password, this.local.password);
}

module.exports = mongoose.model('Account', AccountSchema)