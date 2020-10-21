
module.exports = (sequelize, Sequelize) => {
    const images = sequelize.define("images", {
      image_id: {
        type: Sequelize.UUID,
        /* defaultValue: Sequelize.UUIDV1, */
        primaryKey: true
      },
      image_name: {
        type: Sequelize.STRING,
        allowNull:false,
        validate: {
          notEmpty: true,
          
        }
      },
      aws_s3_object_name: {
        type: Sequelize.STRING,
        // allowNull:false,
        validate: {
          notEmpty: true
        }
      },
   
    });
    return images;
  };