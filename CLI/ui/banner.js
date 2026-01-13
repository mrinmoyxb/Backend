#!/usr/bin/env node

import chalk from "chalk";
import boxen from "boxen";
import gradient from "gradient-string";

export default function showBanner(){
    const title = gradient(['#ADD8E6', '#FFB6C1', '#FFFFE0'])("REST CLI");

    const box = boxen(title, {
        padding: 1,
        margin: 1,
        borderStyle: "round",
        borderColor: "cyan"
    });

    console.log(box);
    console.log(chalk.gray("A beautiful REST API CLIENT\n"));
}