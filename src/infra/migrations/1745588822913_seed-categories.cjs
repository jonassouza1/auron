exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
    INSERT INTO categories (name) VALUES 
    ('Camisa'),
    ('Calça'),
    ('Casaco'),
    ('Bermuda'),
    ('Roupa Íntima'),
    ('Calçado');
  `);
};

exports.down = false;
