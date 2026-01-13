export default function parseArgs(argv){
    const args = argv.slice(2);
    return {
        method: args[0]?.toUpperCase(),
        url: args[1]
    }
}