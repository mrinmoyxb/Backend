import chalk from "chalk";
import { getDiskInfo } from "../services/diskServices.js";
import { setRow } from "../utils/displayUtil.js";

export async function diskCommand(){
    const disks = await getDiskInfo();

    console.log(chalk.bold.bgBlue.white("\n Disk Information "));
    console.log(chalk.dim("-").repeat(40));

    disks.map(disk=>{
        console.log(chalk.bgYellow.bold(`\n${disk.device}`));
        console.log(chalk.dim('-').repeat(40));
        console.log(setRow("Device", disk.device));
        console.log(setRow("Mount", disk.mount));
        console.log(setRow("File System", disk.filesystem));
        console.log(setRow("Total", disk.total ? `${disk.total} GB` : null));
        console.log(setRow("Used", disk.used ? `${disk.used} GB` : null));
        console.log(setRow("Free", disk.free ? `${disk.free} GB` : null));
        console.log(setRow("Usage", disk.usage ? `${disk.usage} GB` : null));
        console.log();
    })
}

diskCommand();