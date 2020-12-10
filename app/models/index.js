const config = require("../appConfig/dbConfig.js");
const {
  QueryTypes
} = require("sequelize");
const log = require("../../logs")
const logger = log.getLogger('logs');

const Sequelize = require("sequelize");
const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD, {
    host: config.HOST,
    dialect: config.dialect,
    dialectOptions: {
      ssl: 'Amazon RDS',
      rejectUnauthorized: true,
    },
    operatorsAliases: false,


    pool: {
      max: config.pool.max,
      min: config.pool.min,
      acquire: config.pool.acquire,
      idle: config.pool.idle
    }
  }
);



/* const sequelize = new Sequelize(
  config.DB,
  config.USER,
  config.PASSWORD, {
     host: config.HOST,
    port: config.PORT,
    logging: console.log,
    maxConcurrentQueries: 100,
    dialect: 'mysql',
    dialectOptions: {
        ssl:'Amazon RDS'
    },
    pool: { maxConnections: 5, maxIdleTime: 30},
    language: 'en'
    }
  
); */

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// check and log the validation result for RDS SSL connection type
db.sequelize.query("SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id", {
  type: QueryTypes.SELECT
}).then((query_res) => {

  logger.info(JSON.stringify(query_res) + "------------");


});

db.sequelize.query("SHOW STATUS LIKE 'Ssl_%'", {
  type: QueryTypes.SELECT
}).then((query_res) => {

  if (query_res == undefined || query_res == null || query_res.length == 0) {
    logger.info(`RDS DB SSL Cipher check info: SSL data not available`, {
      tags: 'http',
      additionalInfo: JSON.stringify(query_res)
    });
  } else {
    logger.info(`RDS DB SSL Cipher check info query: SHOW STATUS LIKE 'Ssl_%'; Result: `)
    logger.info(JSON.stringify(query_res));

  }
}).catch(err => {
  logger.error(`Error in RDS DB SSL Cipher check: `, {
    tags: 'http',
    additionalInfo: {
      error: err
    }
  });
});

db.user = require("./user.model.js")(sequelize, Sequelize);
db.questions = require("./questions.model.js")(sequelize, Sequelize);
db.answers = require("./answer.model.js")(sequelize, Sequelize);
db.categories = require("./category.model.js")(sequelize, Sequelize);
db.question_categories = require("./question_categories.model.js")(sequelize, Sequelize);
db.images = require("./image.file.model.js")(sequelize, Sequelize);




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


db.questions.hasMany(db.images, {
  onDelete: "cascade"
});

db.answers.hasMany(db.images, {
  onDelete: "cascade"
});

db.images.belongsTo(db.user, {
  foreignKey: "user_id",
  as: "userId"
})

db.images.belongsTo(db.questions, {
  foreignKey: "question_id",
  as: "questId"
})

db.images.belongsTo(db.answers, {
  foreignKey: "answer_id",
  as: "ansId"
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

/* const query = "SELECT id, user, host, connection_type FROM performance_schema.threads pst INNER JOIN information_schema.processlist isp ON pst.processlist_id = isp.id" */




module.exports = db;