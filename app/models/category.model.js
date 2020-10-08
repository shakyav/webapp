module.exports = (sequelize, Sequelize) => {
    const categories = sequelize.define("categories", {
  
      catId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        /* validate:{
          noUpdate: true
        } */
  
      },

      category: {
        type: Sequelize.STRING,
        validate : {
          notEmpty: true
        }

      }

      
      

    });

    /* categories.associate = function(models){
      categories.belongsToMany(models.questions,{as:'question_id',foreignKey:'questId'})
    } */
  
    return categories;
  };