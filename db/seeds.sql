INSERT INTO department (name)
VALUES  ('Art'),
        ('Design'),
        ('Tech'),
        ('Production');

INSERT INTO role (title, salary, department_id)
VALUES  ('Art Director', 100000, 1),
        ('3D Artist', 50000, 1),
        ('2D Artist', 50000, 1),
        ('Lead Designer', 78000, 2),
        ('Level Designer', 65000, 2),
        ('Gameplay Designer', 60000, 2),
        ('Lead Programmer', 85000, 3),
        ('Gameplay Programmer', 70000, 3),
        ('Technical Artist', 60000, 3),
        ('Producer', 120000, 4),
        ('Scrum Master', 50000, 4);

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES  ('Mae', 'Satterfield', 10, NULL),
        ('Sammi', 'Teel', 9, 1),
        ('Nina', 'Vidal', 1, 1),
        ('Sierra', 'Jacobs', 7, 2),
        ('Jackson', 'McLellan', 4, 1),
        ('Marlena', 'Star', 2, 3),
        ('Haoran', 'Zhang', 3, 3);
       
