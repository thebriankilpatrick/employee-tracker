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
        // Probably need to add info about role and manager
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
        // connection.query(`INSERT INTO employee (first_name, last_name) VALUES (${answers.firstName}, ${answers.lastName})`, function(err, res) {
        //     if (err) throw err;
        //     console.log("Employee successfully added.");
        // });
    })
}

// ------------------------- Function for Adding Role -----------------------
function addRole() {
    console.log("Adding Role");

    inquirer.prompt([
        // Probably need to add info about department
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
        console.log(answers.roleTitle);
        console.log(answers.roleSalary);
    })
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
    })
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
    
    connection.query("SELECT * FROM role", (err, res) => {
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
            employeeNames.push(res[i].first_name + " " + res[i].last_name);
        }
        inquirer.prompt([
            {
                type: "list",
                name: "chooseEmployee",
                message: "Which employee would you like to update?",
                choices: [...employeeNames]
            }
        ]).then(answers => {
            console.log(answers.chooseEmployee);

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
                        message: `Select ${answers.chooseEmployee}'s new role.`,
                        choices: [...roleTitles]
                    }
                ]).then(answer => {
                    console.log(answer.newRole);
                    console.log(answers.chooseEmployee);
                    connection.query("UPDATE employee SET ? WHERE ? AND ?", [
                        {
                            role: answer.newRole
                        },
                        {
                            id: ________ 
                        }
                    ], (err, data) => {

                    })
                });
            });
        });
    });
    
}
