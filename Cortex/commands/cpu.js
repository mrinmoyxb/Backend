import chalk from "chalk";
import { getCPUInfo } from "../services/cpuservice.js";
import { setRow, setValueOrNA } from "../utils/displayUtil.js";

const LABEL_WIDTH = 22

export default async function cpuCommand(){
    const cpu = await getCPUInfo();

    console.log(chalk.bold.cyan("CPU Information"));
    console.log(chalk.dim("-".repeat(40)));

    console.log(setRow("Vendor", cpu.vendor));
    console.log(setRow("Brand", cpu.vendor));
    console.log(setRow("Model", cpu.model));
    console.log(setRow("Manufacturer", cpu.manufacturer));
    console.log(setRow("Governor", cpu.governor));
    console.log(setRow("Processors", cpu.processors));
    console.log(setRow("Cores", cpu.cores));
    console.log(setRow("Efficiency Cores", cpu.efficiencyCores));
    console.log(setRow("Performance Cores", cpu.performanceCores));
    console.log(setRow("Speed", cpu.speed ? `${cpu.speed} GHz`: null));
    console.log(setRow("Speed (Min)", cpu.speedMin ? `${cpu.speedMin} GHz` : null));
    console.log(setRow("Speed (Max)", cpu.speedMax ? `${cpu.speedMax} GHz` : null));
    console.log(setRow("Virtualization", cpu.virtualization));
    console.log(setRow("Load", cpu.load ? `${cpu.load} %` : null));

    console.log();
    console.log(chalk.bold.cyan("Cache"));
    console.log(chalk.dim("-".repeat(40)));

    if(cpu.cache && Object.keys(cpu.cache).length > 0){
        for(const[key, value] of Object.entries(cpu.cache)){
            console.log(
                chalk.white.dim(` ${key.padEnd(LABEL_WIDTH - 2)}`) + 
                chalk.white(": ") +
                setValueOrNA(value)
            );
        }
    }else{
        console.log(chalk.yellow(" N/A"));
    }
    
    console.log();
}

cpuCommand()