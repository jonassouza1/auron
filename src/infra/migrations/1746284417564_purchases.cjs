exports.up = (pgm) => {
  pgm.createTable("purchases", {
    id: "id",
    usuario_id: {
      type: "uuid",
      notNull: true,
      references: '"users"',
      onDelete: "cascade",
    },
    payment_id: { type: "varchar(255)", notNull: true, unique: true },
    status: { type: "varchar(50)", notNull: true },
    total: { type: "numeric", notNull: true },
    data: { type: "timestamp", default: pgm.func("current_timestamp") },
  });
};

exports.down = false;
