"use strict";

let jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

let mongoDB = 'mongodb+srv://admin:i1s97oeXkWt6AtzL@cluster0.bzzfvvd.mongodb.net/usersDB';
//mongoose.connect(mongoDB, { useNewUrlParser: true });
mongoose.connect(mongoDB);

let db = mongoose.connection;

let userSchema = mongoose.Schema({
    _uid: {
        type: String,
        required: true
    },
    _name: {
        type: String,
        required: true
    },
    _email: {
        type: String,
        required: true
    },
    _password: {
        type: String,
        required: true
    },
    _sex: {
        type: String,
        enum: ['M', 'H'],
        required: true
    },
    _image: String,
    _role: {
        type: String,
        enum: ['estudiante', 'docente'],
        required: true
    }
});

// Generamos el JWT
// Generar el JWT antes de guardar el usuario en la base de datos
userSchema.methods.generateAuthToken = async function () {
    return new Promise((resolve, reject) => {
        jwt.sign(
            {
                uid: this._id,
                email: this._email,
                role: this._role
                // Puedes incluir más información si lo necesitas
            },
            'tu_secreto_secreto',
            { expiresIn: '1h' },
            (err, token) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(token);
                }
            }
        );
    });
};
    

let User = mongoose.model('user', userSchema);

module.exports = User;
