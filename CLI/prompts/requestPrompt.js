import inquirer from "inquirer";

export default async function requestPrompt(){
    return inquirer.prompt([
        {
            type: "list",
            name: "method",
            message: "SELECT HTTP method",
            choices: ["GET", "POST", "PUT", "DELETE"]
        },
        {
            type: "input",
            name: "url",
            message: "Enter request URL"
        }
    ]);
}