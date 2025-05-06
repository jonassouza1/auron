exports.up = (pgm) => {
  pgm.createTable("purchase_items", {
    id: "id",
    shopping_id: {
      type: "integer",
      notNull: true,
      references: '"purchases"',
      onDelete: "cascade",
    },
    product_name: { type: "varchar(255)", notNull: true },
    quantity: { type: "integer", notNull: true },
    unit_price: { type: "numeric", notNull: true },
  });
};

exports.down = false;
