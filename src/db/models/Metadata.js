module.exports = (sequelize, DataTypes) => {
  const Metadata = sequelize.define(
    "metadata",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      declaration1: { type: DataTypes.STRING },
      declaration2: { type: DataTypes.STRING },
      declaration3: { type: DataTypes.STRING }
    },
    {
      timestamps: false
    }
  );
  Metadata.associate = function(models) {
    Metadata.belongsTo(models.registration);
  };
  return Metadata;
};
