const inquirer = require("inquirer");
const mysql = require("mysql");
const cTable = require("console.table"); // Do I need this?

const connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "1722",
    database: "employee_cms"
});
  
connection.connect(err => {
    if (err) throw err;
    // initialPrompt()
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
    console.log("Viewing Departments");
}

function viewRoles() {
    console.log("Viewing Roles");
}

function viewEmployees() {
    console.log("Viewing Employees");
}

// --------------------------- Function for updating employee ------------
function updateEmployee() {
    console.log("Updating Employee Roles");

    inquirer.prompt([
        {
            type: "list",
            name: "chooseEmployee",
            message: "Which employee would you like to update?",
            choices: []
        }
    ]).then(answers => {
        console.log(answers.chooseEmployee);
    })
}

// initialPrompt();