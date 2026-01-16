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

export function setHeader(title){
    const width = process.stdout.columns || 80;
    const text = `${title}`;
    const padding = Math.max(0, width-text.length);
    return chalk.bgBlue.white.bold(text + " ".repeat(padding));
}

export function setWarning(title, value, percentTrue){
    if(percentTrue){
        return(
            chalk.bgRed.white(title.padEnd(LABEL_WIDTH)) + 
            chalk.white(": ") +
            chalk.bgRed.white(value) + 
            chalk.bgRed.white(" % ")
        )
    }else{
        return(
        chalk.bgRed.white(title.padEnd(LABEL_WIDTH)) + 
        chalk.white(": ") +
        chalk.bgRed.white(value)
        )
    }
}
