INSERT INTO shape (name)
VALUES ('Circle'),
       ('Square'),
       ('Triangle'),
       ('Diamond');

INSERT INTO blueprint (name)
VALUES ('Blueprint A'),
       ('Blueprint B'),
       ('Blueprint C'),
       ('Blueprint D'),
       ('Blueprint E');

INSERT INTO blueprint_shape (blueprint_id, shape_id, count)
VALUES (1, 1, 1), -- Blueprint A, 1 Circle
       (1, 2, 1), -- Blueprint A, 1 Square
       (1, 3, 1), -- Blueprint A, 1 Triangle
       (2, 1, 2), -- Blueprint B, 2 Circles
       (2, 2, 2), -- Blueprint B, 2 Squares
       (2, 3, 2), -- Blueprint B, 2 Triangles
       (3, 1, 3), -- Blueprint C, 3 Circles
       (3, 2, 3), -- Blueprint C, 3 Squares
       (3, 3, 3), -- Blueprint C, 3 Triangles
       (4, 1, 5), -- Blueprint D, 5 Triangles
       (5, 4, 1); -- Blueprint E, 1 Diamond
