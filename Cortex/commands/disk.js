import chalk from "chalk";
import { getDiskInfo, getDiskLayout } from "../services/diskServices.js";
import { setRow, setWarning } from "../utils/displayUtil.js";

export async function diskCommand(){
    const disks = await getDiskInfo();
    const diskLayouts = await getDiskLayout();

    console.log(chalk.bold.bgBlue.white("\n Disk Information "));
    console.log(chalk.dim("-").repeat(40));

    diskLayouts.map(diskLayout=>{
        console.log(setRow("Vendor", diskLayout.vendor));
        console.log(setRow("Name", diskLayout.name));
        console.log(setRow("Device", diskLayout.device));
        console.log(setRow("Type", diskLayout.type));
        console.log(setRow("Size", diskLayout.size + " GB"));
        console.log(setRow("Interface", diskLayout.interface));
    })

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
        console.log(disk.freePercentage <= 20 ? `${setWarning("Disk Free(%)", disk.freePercentage, true)}` : `${setRow("Disk Free(%)", disk.freePercentage + " %")}`);
        console.log(disk.usedPercentage >= 80 ? `${setWarning("Used (%)", disk.usedPercentage, true)}` : `${setRow("Used (%)", disk.usedPercentage + " %")}`);
        console.log();
    })
}

diskCommand();