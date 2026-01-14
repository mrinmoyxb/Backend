import {parseArgs} from "node:util";
import getSpecs from "./hardware.js";
import theme from "./ui.js";
import cliBanner from "../ui/banner.js";

const config = {
    options: {
        cpu: {type: 'boolean', short: 'c'},
        mem: {type: 'boolean', short: 'm'},
        all: {type: 'boolean', short: 'a'}
    }
}

async function main(){
    try{
        const { values } = parseArgs(config);
        console.log(theme.header("\n---- SYSTEM INFORMATION ----\n"));

        const data = await getSpecs();
        const {cpuObject, memoryObject, batteryObject} = data;

        const cpuKeys = Object.keys(cpuObject);
        const memoryKeys = Object.keys(memoryObject);
        const batteryKeys = Object.keys(batteryObject);

        if(values.cpu){
            console.log(`${theme.header("---- CPU Model ----")}`);
            for(let key of cpuKeys){
                console.log(`${theme.label(key)}: ${theme.value(cpuObject[key])}`);
            }
            console.log("\n");
        }

        if (values.mem) {
            console.log(`${theme.header("---- Memory ----")}`);
            for(let key of memoryKeys){
                console.log(`${theme.label(key)}: ${theme.value(memoryObject[key])}`);
            }
            console.log("\n");
        }

        if(values.all){
            console.log(`${theme.header("---- CPU Model ----")}`);
            for(let key of cpuKeys){
                console.log(`${theme.label(key)}: ${theme.value(cpuObject[key])}`);
            }
            console.log("\n");
            console.log(`${theme.header("---- Memory ----")}`);
            for(let key of memoryKeys){
                console.log(`${theme.label(key)}: ${theme.value(memoryObject[key])}`);
            }
            console.log("\n");
            console.log(`${theme.header("---- Battery ----")}`);
            for(let key of batteryKeys){
                console.log(`${theme.label(key)}: ${theme.value(batteryObject[key])}`);
            }
            console.log("\n");
        }

        console.log('\n');

    }catch(error){
        console.error(theme.error(`Error: ${error.message}`));
        process.exit(1);
    }
}

cliBanner();
main();