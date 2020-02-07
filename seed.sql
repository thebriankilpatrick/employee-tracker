

INSERT INTO department (name)
VALUES ("IT");

INSERT INTO role (title, salary, department_id)
VALUES ("Software Engineer", "60000", 1);

INSERT INTO employee (first_name, last_name, role_id)
VALUES ("Brian", "Kilpatrick", 1);

-- Don't want to select * from other tables.  This is to avoid repeating id's
SELECT * FROM role INNER JOIN department ON role.department_id = department.id; 

-- How to select department name, based on role table's INNER JOIN
SELECT * FROM employee INNER JOIN role ON employee.role_id = role.id; 