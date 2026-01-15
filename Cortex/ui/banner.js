import figlet from "figlet";
import chalk from "chalk";
import {atlas} from "gradient-string"

function centerText(text){
    const terminalWidth = process.stdout.columns || 80;
    const textLength = text.replace(/\x1B\[[0-9;]*m/g, "").length;
    const leftPadding = Math.max(0, Math.floor((terminalWidth-textLength)/2));
    return " ".repeat(leftPadding) + text;
}

function centerMultiline(text){
    return text
        .split("\n")
        .map(line => centerText(line))
        .join("\n");
}

export default async function cliBanner(){
    console.log("\n");
    await figlet.text("CORTEX", {font: "3-D"}, (err, data)=>{
            if(err){
                console.log("Error");
                return;
            }else{
                const banner = centerMultiline(data);
                console.log(atlas.multiline(banner));
                console.log(chalk.green((centerMultiline("\nKnow your system better\n"))));
            }
        }
    )
}
