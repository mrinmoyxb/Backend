import { Command } from "commander";
import getCommand from "./commands/get.js";
import showBanner from "./ui/banner.js";

const program = new Command();

showBanner();

program.name("REST CLI").version("1.0.0");

getCommand(program);
program.parse();