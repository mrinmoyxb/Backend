import chalk from "chalk";

export default function getCommand(program){
    program
        .command("get <url>")
        .description("Send GET request")
        .action((url)=>{
            console.log(chalk.green(`GET -> ${url}`));
        });
}