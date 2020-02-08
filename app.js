const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table");

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1722",
    database: "employee_cms"
});
  
connection.connect(err => {
    if (err) throw err;
    initialPrompt()
});

function initialPrompt() {
    inquirer.prompt([
        {
           type: "list",
           name: "initQuestion",
           message: "What would you like to do?",
           choices: ["Add Employee", "Add Role", "Add Department",
                "View Departments", "View Roles", "View Employees", "Update Employee Role", 
                "Delete Department", "Delete Role", "Delete Employee", "Update Employee Manager"]
        }
    ]).then(answer => {
        
        switch(answer.initQuestion) {
            case "Add Employee":
                addEmployee();
            break;

            case "Add Role":
                addRole();
            break;

            case "Add Department":
                addDepartment();
            break;

            case "View Departments":
                viewDepartments();
            break;

            case "View Roles":
                viewRoles();
            break;

            case "View Employees":
                viewEmployees();
            break;

            case "Update Employee Role":
                updateEmployee();
            break;

            case "Delete Department":
                deleteDepartment();
            break;

            case "Delete Role":
                deleteRole();
            break;

            case "Delete Employee":
                deleteEmployee();
            break;

            case "Update Employee Manager":
                updateEmployeeManager();
            break;
        }
    })
}

// -------------------- Function for Adding Employee ---------------------
function addEmployee() {
    console.log("Adding Employee");
    inquirer.prompt([
        {
            type: "input",
            name: "firstName",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "lastName",
            message: "What is the employee's last name?"
        }
    ]).then(answers => {
        
        connection.query("SELECT * FROM role", (err, res) => {
            if (err) throw err;
            let roles = [];
            for (let i = 0; i < res.length; i++) {
                roles.push(res[i].id + " " + res[i].title);
            }
            connection.query("SELECT * FROM employee", (err, result2) => {
                let managers = [];
                for (let i = 0; i < result2.length; i++) {
                    managers.push(result2[i].id + " " + result2[i].first_name + " " + result2[i].last_name);
                }
                managers.push("None");
                inquirer.prompt([
                    {
                        type: "list",
                        name: "empRole",
                        message: "What is this employee's role?",
                        choices: [...roles]
                    },
                    {
                        type: "list",
                        name: "empMan",
                        message: "Who is the employee's manager?",
                        choices: [...managers]
                    }
                ]).then(answer => {

                    let roleData = answer.empRole.split("");
                    let roleID = Number(roleData[0]);
                    if (answer.empMan === "None") {
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id) VALUES ("${answers.firstName}", "${answers.lastName}", "${roleID}")`, (err, result) => {
                            if (err) throw err;
                            console.log("A new employee has been successfully added.");
                            initialPrompt();
                        });
                    }
                    else {
                        let managData = answer.empMan.split("");
                        let managerID = Number(managData[0]);
                        connection.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("${answers.firstName}", "${answers.lastName}", "${roleID}", "${managerID}")`, (err, result) => {
                            if (err) throw err;
                            console.log("A new employee has been successfully added.");
                            initialPrompt();
                        });
                    }
                });
            });
        });
    });
}

// ------------------------- Function for Adding Role -----------------------
function addRole() {
    console.log("Adding Role");

    inquirer.prompt([
        {
            type: "input",
            name: "roleTitle",
            message: "What is the role's title?"
        },
        {
            type: "input",
            name: "roleSalary",
            message: "What is the role's base salary?"
        }
    ]).then(answers => {

        connection.query("SELECT * FROM department", (err, res) => {
            if (err) throw err;
            const departmentNames = [];
            for (let i = 0; i < res.length; i++) {
                departmentNames.push(res[i].id + " " + res[i].name);
            }
            inquirer.prompt([
                {
                    type: "list",
                    name: "roleDepartment",
                    message: "What department is this role in?",
                    choices: [...departmentNames]
                }
            ]).then(answer => {

                const roleData = answer.roleDepartment.split("");
                const departmentID = Number(roleData[0]);

                connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${answers.roleTitle}", "${answers.roleSalary}", "${departmentID}")`, (err, result) => {
                    console.log("Successfully added new role.");
                    initialPrompt();
                });
            });
        });
    });
}

// ------------------------ Function for adding Department ------------------
function addDepartment() {
    console.log("Adding Department");

    inquirer.prompt([
        {
            type: "input",
            name: "departmentName",
            message: "What is the department's name?"
        }
    ]).then(answer => {

        connection.query(`INSERT INTO department (name) VALUES ("${answer.departmentName}");`, (err, res) => {
            if (err) throw err;
            console.log(`Successfully added the ${answer.departmentName} department!`);
            initialPrompt();
        });
    });
}

// -------------------- FUNCTION FOR VIEWING DEPARTMENTS IN CONSOLE TABLE --------------------
function viewDepartments() {
    console.log("Viewing Departments");
    
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res); 
        initialPrompt();
    });
}

// ----------------------------- FUNCTION FOR VIEWING ROLES IN CONSOLE TABLE -------------------
function viewRoles() {
    console.log("Viewing Roles");
    
    connection.query("SELECT title, salary, department.name FROM role LEFT JOIN department ON department_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    });
}

// -------------------------- FUNCTION FOR VIEWING EMPLOYEES IN CONSOLE TABLE ----------------
function viewEmployees() {
    console.log("Viewing Employees");
    
    connection.query("SELECT employee.id, first_name AS 'First Name', last_name AS 'Last Name', role.title AS 'Title', department.name AS 'Dept', manager_id AS 'Manager' FROM employee LEFT JOIN role ON role_id = role.id LEFT JOIN department ON department_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    });
    
}


// --------------------------- Function for updating employee ------------
function updateEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        const employeeNames = [];
        for (let i = 0; i < res.length; i++) {
            employeeNames.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "chooseEmployee",
                message: "Which employee would you like to update?",
                choices: [...employeeNames]
            }
        ]).then(answers => {
            const empData = answers.chooseEmployee.split("");
            const empID = Number(empData[0]);

            connection.query("SELECT title FROM role", (err, result) => {
                if (err) throw err;
                const roleTitles = [];
                for (let i = 0; i < result.length; i++) {
                    roleTitles.push(result[i].title);
                }
                inquirer.prompt([
                    {
                        type: "list",
                        name: "newRole",
                        message: `Select the employee's new role.`,
                        choices: [...roleTitles]
                    }
                ]).then(answer => {
                    connection.query(`SELECT id FROM role WHERE title = ("${answer.newRole}")`, (err, result2) => {
                        if (err) throw err;
                        connection.query("UPDATE employee SET ? WHERE ?", [
                            {
                                role_id: result2[0].id
                            },
                            {
                                id: empID 
                            }
                        ], (err, data) => {
                            if (err) throw err;
                            console.log(`You have successfully updated the employee's role.`);
                            initialPrompt();
                        });
                    });
                });
            });
        });
    });    
}

// ------------------------ FUNCTION FOR DELETING DEPARTMENTS ----------------------
function deleteDepartment() {
    connection.query("SELECT * FROM department", (err, res) => {
        let departments = [];
        for (let i = 0; i < res.length; i++) {
            departments.push(res[i].id + " " + res[i].name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "departmentName",
                message: "Which department would you like to delete?",
                choices: [...departments]
            }
        ]).then(answer => {
            const depData = answer.departmentName.split("");
            const depID = Number(depData[0]);

            connection.query(`DELETE FROM department WHERE id = ${depID}`, (err, data) => {
                if (err) throw err;
                console.log("Department deleted!");
                initialPrompt();
            });
        });
    });
}

// ------------------------------ FUNCTION FOR DELETING ROLES -----------------------
function deleteRole() {
    connection.query("SELECT * FROM role", (err, res) => {
        if (err) throw err;
        let roles = [];
        for (let i = 0; i < res.length; i++) {
            roles.push(res[i].id + " " + res[i].title);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "roleName",
                message: "Which role would you like to delete?",
                choices: [...roles]
            }
        ]).then(answer => {
            const rolData = answer.roleName.split("");
            const rolID = Number(rolData[0]);

            connection.query(`DELETE FROM role WHERE id = ${rolID}`, (err, data) => {
                if (err) throw err;
                console.log("Role deleted!");
                initialPrompt();
            });
        });
    });
}

// ------------------------------------ FUNCTION FOR DELETING EMPLOYEES -----------------
function deleteEmployee() {
    connection.query("SELECT * FROM employee", (err, res) => {
        if (err) throw err;
        let employees = [];
        for (let i = 0; i < res.length; i++) {
            employees.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "employeeName",
                message: "Which employee would you like to delete?",
                choices: [...employees]
            }
        ]).then(answer => {
            const employeeData = answer.employeeName.split("");
            const employeeID = Number(employeeData[0]);

            connection.query(`DELETE FROM employee WHERE id = ${employeeID}`, (err, data) => {
                if (err) throw err;
                console.log("Employee deleted!");
                initialPrompt();
            });
        });
    });
}

function updateEmployeeManager() {
    connection.query("SELECT * FROM employee", (err, res) => {
        let employees = [];
        for (let i = 0; i < res.length; i++) {
            employees.push(res[i].id + " " + res[i].first_name + " " + res[i].last_name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "employeeName",
                message: "Which employee would you like to update the manager for?",
                choices: [...employees]
            },
            {
               type: "list",
               name: "managerName",
               message: "Who is the employee's new manager?",
               choices: [...employees]
            }
        ]).then(answers => {
            const employeeData = answers.employeeName.split("");
            const employeeID = Number(employeeData[0]);
            const managerData = answers.managerName.split("");
            const managerID = Number(managerData[0]);

            connection.query("UPDATE employee SET ? WHERE ?", [
                {
                    manager_id: managerID
                },
                {
                    id: employeeID
                }
            ], (err, data) => {
                if (err) throw err;
                console.log("Employee's manager has been updated!");
                initialPrompt();
            });
        });
    });
}
