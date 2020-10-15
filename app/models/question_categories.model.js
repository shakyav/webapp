module.exports = (sequelize, Sequelize) => {
    const question_categories = sequelize.define("question_categories", {
  
      categoryCatId: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        /* validate:{
          noUpdate: true
        } */
  
      },
      question_id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV1,
        primaryKey: true,
        
        /* validate:{
          noUpdate: true
        } */
  
      }

      

      
      

    });

    /* categories.associate = function(models){
      categories.belongsToMany(models.questions,{as:'question_id',foreignKey:'questId'})
    } */
  
    return question_categories;
  };