
const { Schema, model } = require('mongoose');

const roleSchema = Schema({
    rol:{
        type: String,
        required: [true,'Rol obligatorio']
    }
});

module.exports = model('Role', roleSchema)