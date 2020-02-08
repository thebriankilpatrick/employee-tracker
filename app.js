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
                "View Departments", "View Roles", "View Employees", "Update Employee Role"]
        }
    ]).then(answer => {
        console.log(answer.initQuestion);
        
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
        console.log(answers.firstName);
        console.log(answers.lastName);
        
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
                    console.log(answer.empRole);
                    console.log(answer.empMan);
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
                    console.log(answer.empMan);
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
        // console.log(answers.roleTitle);
        // console.log(answers.roleSalary);

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
                console.log(answers.roleTitle);
                console.log(answers.roleSalary);
                console.log(answer.roleDepartment);

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
        console.log(answer.departmentName);

        connection.query(`INSERT INTO department (name) VALUES ("${answer.departmentName}");`, (err, res) => {
            if (err) throw err;
            console.log(`Successfully added the ${answer.departmentName} department!`);
            initialPrompt();
        });
    });
}


function viewDepartments() {
    // console.log("Viewing Departments");
    
    connection.query("SELECT * FROM department", (err, res) => {
        if (err) throw err;
        console.table(res); 
        initialPrompt();
    });
}

function viewRoles() {
    console.log("Viewing Roles");
    
    connection.query("SELECT * FROM role INNER JOIN department ON department_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    })
}

function viewEmployees() {
    console.log("Viewing Employees");
    
    connection.query("SELECT * FROM employee INNER JOIN role ON role_id = role.id INNER JOIN department ON department_id = department.id", (err, res) => {
        if (err) throw err;
        console.table(res);
        initialPrompt();
    })
    
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
            console.log(empID);

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
                    console.log(answer.newRole);
                    console.log(answers.chooseEmployee);
                    connection.query(`SELECT id FROM role WHERE title = ("${answer.newRole}")`, (err, result2) => {
                        if (err) throw err;
                        console.log(result2[0].id);
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
