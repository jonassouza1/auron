exports.shorthands = undefined;

exports.up = async (pgm) => {
  await pgm.sql(`
    INSERT INTO products (name, image_url, description, quantity, price, discount_price, is_active, category_id, size_id) VALUES 
    ('Camisa Polo', '/camisa_polo.jpg', 'Camisa Polo de Algodão', 1, 79.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Camisa'), 
      (SELECT id FROM sizes WHERE name = 'M')),

    ('Calça Jeans', '/calca_jeans.jpg', 'Calça Jeans Azul', 4, 129.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Calça'), 
      (SELECT id FROM sizes WHERE name = 'G')),

    ('Casaco de Lã', '/casaco_la.jpg', 'Casaco de Lã Quente', 20, 199.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Casaco'), 
      (SELECT id FROM sizes WHERE name = 'GG')),

    ('Bermuda Jeans', '/bermuda_jeans.jpg', 'Bermuda Curta de Jeans', 2, 169.90, 149.90, true, 
      (SELECT id FROM categories WHERE name = 'Bermuda'), 
      (SELECT id FROM sizes WHERE name = 'P')),

    ('Camisa Fit', '/camisa_fit.jpg', 'Camisa Fit de Poliester', 4, 59.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Camisa'), 
      (SELECT id FROM sizes WHERE name = 'G')),

    ('Calça Moletom', '/calca_moletom.jpg', 'Calça Moletom Verde', 3, 140.99, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Calça'), 
      (SELECT id FROM sizes WHERE name = 'GG')),

    ('Casaco de Couro', '/casaco_couro.jpg', 'Casaco de Couro Preto', 2, 399.99, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Casaco'), 
      (SELECT id FROM sizes WHERE name = 'G')),

    ('Bermuda Fit', '/bermuda_fit.jpg', 'Bermuda de Correr', 5, 69.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Bermuda'), 
      (SELECT id FROM sizes WHERE name = 'P')),

    ('Camisa Social', '/camisa_social.jpg', 'Camisa Social de Algodão', 1, 109.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Camisa'), 
      (SELECT id FROM sizes WHERE name = 'G')),

    ('Calça Legging', '/calca_legging.jpg', 'Calça legging Rosa', 8, 179.90, 159.90, true, 
      (SELECT id FROM categories WHERE name = 'Calça'), 
      (SELECT id FROM sizes WHERE name = 'M')),

    ('Casaco Fit', '/casaco_fit.jpg', 'Casaco Fit Leve', 20, 139.95, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Casaco'), 
      (SELECT id FROM sizes WHERE name = 'M')),

    ('Calção Surf', '/calcao_surf.jpg', 'Calção Curto de Surf', 2, 89.40, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Bermuda'), 
      (SELECT id FROM sizes WHERE name = 'M')),

    ('Camisa Surf', '/camisa_surf.jpg', 'Camisa Surf de Algodão', 6, 99.80, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Camisa'), 
      (SELECT id FROM sizes WHERE name = 'GG')),

    ('Calça Fit', '/calca_fit.jpg', 'Calça Fit Cinza', 1, 150.00, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Calça'), 
      (SELECT id FROM sizes WHERE name = 'XGG')),

    ('Casaco Peludo', '/casaco_peludo.jpg', 'Casaco de Pelo Quente', 3, 599.99, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Casaco'), 
      (SELECT id FROM sizes WHERE name = 'P')),

    ('Bermuda Moletom', '/bermuda_moletom.jpg', 'Bermuda de Moletom Preta', 2, 38.90, NULL, true, 
      (SELECT id FROM categories WHERE name = 'Bermuda'), 
      (SELECT id FROM sizes WHERE name = 'XGG'));
  `);
};

exports.down = false;
