const config = require("../dbConfig/dbConfig.js");

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    operatorsAliases: false,

    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.user = require("./user.model.js")(sequelize, Sequelize);
db.questions = require("./questions.model.js")(sequelize, Sequelize);
db.answers = require("./answer.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.question_categories = require("./question_categories.model.js")(sequelize, Sequelize);




db.questions.belongsTo(db.user, {
  as: 'userId',
  foreignKey: 'user_id'
})


db.questions.belongsToMany(db.categories, {
  through: "question_categories",
  foreignKey: "question_id",
  onDelete: "cascade",
  onUpdate: "cascade"
})
/* db.categories.belongsToMany(db.questions, {
  through: "category_questions",
  foreignKey: "category_id",
  onDelete: "cascade"
}) */


db.questions.hasMany(db.answers, {
  onDelete: "cascade"
})
/* db.questions.belongsTo(db.answers,{as:'ansId',foreignKey:'answer_id'}) */


db.answers.belongsTo(db.user, {
  as: 'userId',
  foreignKey: 'user_id'
})
db.answers.belongsTo(db.questions, {
 /*  as: "questId", */
  foreignKey: 'question_id'
})



/* db.questions.hasMany(db.answers, {as:"ansId",foreignKey:"answers"});
db.user.hasMany(db.questions,{as:"questId", foreignKey:"questions"})
db.user.hasMany(db.answers,{as:"answers"}) */
/* db.questions.hasMany(db.category, { as: "catId" ,foreignKey:"categories"}); */
/* db.questions.hasMany(db.answers, {as:"ansId",foreignKey:"answers"}) */



/* db.answers.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "userId",
  
}); */
/* db.answers.belongsTo(db.questions,{
  foreignKey: "quest_id",
  as: "questId",

}) */


module.exports = db;