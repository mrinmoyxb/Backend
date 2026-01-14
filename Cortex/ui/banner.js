import figlet from "figlet";
import chalk from "chalk";
import {atlas} from "gradient-string"

export default async function cliBanner(){
    await figlet.text("CORTEX", {font: "3-D"}, (err, data)=>{
            if(err){
                console.log("Error");
            }else{
                console.log(atlas.multiline(data));
                console.log(chalk.green("\nKnow your system better"));
            }
        }
    )
}

cliBanner();