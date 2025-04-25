exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
    INSERT INTO sizes (name) VALUES 
    ('P'),
    ('M'),
    ('G'),
    ('GG'),
    ('XGG');
      `);
};
exports.down = false;
