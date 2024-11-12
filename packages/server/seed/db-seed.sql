INSERT INTO shape (name, state)
VALUES ('Circle', 0),   -- state -> active
       ('Square', 0),   -- state -> active
       ('Triangle', 0), -- state -> active
       ('Diamond', 1);  -- state -> deleted

INSERT INTO blueprint (name, state)
VALUES ('Blueprint A', 0), -- state -> valid
       ('Blueprint B', 0), -- state -> valid
       ('Blueprint C', 0), -- state -> valid
       ('Blueprint D', 1), -- state -> deleted
       ('Blueprint E', 2); -- state -> invalid (contains deleted blueprint)

INSERT INTO blueprint_shape (blueprint_id, shape_id, shape_count)
VALUES (1, 1, 1), -- Blueprint A, 1 Circle
       (1, 2, 1), -- Blueprint A, 1 Square
       (1, 3, 1), -- Blueprint A, 1 Triangle
       (2, 1, 2), -- Blueprint B, 2 Circles
       (2, 2, 2), -- Blueprint B, 2 Squares
       (2, 3, 2), -- Blueprint B, 2 Triangles
       (3, 1, 3), -- Blueprint C, 3 Circles
       (3, 2, 3), -- Blueprint C, 3 Squares
       (3, 3, 3), -- Blueprint C, 3 Triangles
       (4, 1, 5), -- Deleted Blueprint D, 5 Triangles
       (5, 4, 1); -- Blueprint E, 1 Deleted Diamond

