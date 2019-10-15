const Sequelize = require('sequelize');

let connection = new Sequelize('db', 'postgres', '12345', {
    dialect: 'postgres'
})


exports.conn = ()=> {
    return connection;
}
exports.seq = ()=> {
    return Sequelize
}