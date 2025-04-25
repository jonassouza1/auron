exports.up = (pgm) => {
  pgm.createTable("products", {
    id: "id",
    name: { type: "varchar(255)", notNull: true },
    image_url: { type: "varchar(555)" },
    description: { type: "text" },
    quantity: { type: "integer", notNull: true },
    price: { type: "decimal(10, 2)", notNull: true },
    discount_price: { type: "decimal(10, 2)" },
    is_active: { type: "boolean", default: true },
    created_at: { type: "timestamp", default: pgm.func("current_timestamp") },
    category_id: { type: "integer" },
    size_id: { type: "integer" },
  });
};

exports.down = false;
