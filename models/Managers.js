var  connection = require('../db/sequelize')
const Sequelize = require('../db/sequelize')
var db=connection.conn();
var Seq = Sequelize.seq();

const User = db.define('User', {
    name: Seq.STRING,
    email:  Seq.STRING,
    password:  Seq.STRING,
    roll_id: Seq.INTEGER,
    created_by:Seq.INTEGER
},{
    timestamps:false
})


User.sync({
    logging: false,
    force: false



})
    .then(() => {
        console.log("Connected to DB");
    })
    .catch(err => {
        console.error("unable to connect " + err);
    })

    exports.user = ()=> {
        return User;
    }