import chalk from "chalk";

const LABEL_WIDTH = 22;

export function setValueOrNA(value){
    if(value === null || value === undefined || value === "" || value === false){
        return chalk.yellow("N/A");
    }else{
        return chalk.green(value);
    }
}

export function setRow(label, value){
    return(
        chalk.white.dim(label.padEnd(LABEL_WIDTH)) + 
        chalk.white(": ") + 
        setValueOrNA(value)
    );
}

