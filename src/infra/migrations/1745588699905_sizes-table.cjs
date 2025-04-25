exports.up = (pgm) => {
  pgm.createTable("sizes", {
    id: "id",
    name: { type: "varchar(10)", notNull: true, unique: true },
  });
};

exports.down = false;
