import parseArgs from "./utils/parseArgs.js";
import resolveCommand from "./core/commandResolver.js";

async function main(){
    const input = parseArgs(process.argv);
    const result = await resolveCommand(input);
    console.log(result);
}

main();