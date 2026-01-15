import chalk from "chalk";
import { getCPUInfo } from "../services/cpuservice";

export default async function cpuCommand(){
    const cpu = await getCPUInfo();

    console.log(chalk.white.bgBlue.bold("CPU Information"));
    console.log(chalk.blue(`Brand: ${cpu.brand}`));
    console.log(chalk.blue(`Cores: ${cpu.cores}`));
    console.log(chalk.blue(`Speed: ${cpu.speed} GHz`));
    console.log(chalk.blue(`Usage: ${cpu.load} %`));
}