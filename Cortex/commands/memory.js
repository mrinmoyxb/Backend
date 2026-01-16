import chalk from "chalk";
import { getMemoryInfo } from "../services/memoryservice.js";
import { setRow, setValueOrNA, setWarning } from "../utils/displayUtil.js";

const LABEL_WIDTH = 22;

export default async function memoryCommand(){
    const memory = await getMemoryInfo();

    console.log(chalk.bold.bgBlue.white("\n Memory Information "));
    console.log(chalk.dim("-").repeat(40));

    console.log(setRow("Total", `${memory.total} GHz`));
    console.log(setRow("Used", `${memory.used} GHz`));
    console.log(setRow("Free", `${memory.free} GHz`));
    console.log(setRow("Available", `${memory.available} GHz`));
    console.log(memory.usagePercentage >= 80 ? `${setWarning("Usage", memory.usagePercentage, true)}` : `${setRow("Usage", memory.usagePercentage)} %`);
}

memoryCommand();