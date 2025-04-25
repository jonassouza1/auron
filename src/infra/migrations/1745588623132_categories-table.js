exports.up = (pgm) => {
  pgm.createTable("categories", {
    id: "id",
    name: { type: "varchar(255)", notNull: true, unique: true },
  });
};

exports.down = false;
