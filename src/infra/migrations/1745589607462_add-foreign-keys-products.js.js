exports.up = (pgm) => {
  pgm.addConstraint("products", "fk_products_category", {
    foreignKeys: {
      columns: "category_id",
      references: "categories(id)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  });

  pgm.addConstraint("products", "fk_products_size", {
    foreignKeys: {
      columns: "size_id",
      references: "sizes(id)",
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  });
};

exports.down = (pgm) => {
  pgm.dropConstraint("products", "fk_products_category");
  pgm.dropConstraint("products", "fk_products_size");
};
