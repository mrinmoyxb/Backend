import systemInformation from "systeminformation";



export default async function getSpecs(){
    const cpu = await systemInformation.cpu();
    const memory = await systemInformation.mem();
    const battery = await systemInformation.battery();
    const cpuObject = {
        manufacturer: cpu.manufacturer,
        processor: cpu.brand,
        vendor: cpu.vendor,
        cores: cpu.cores,
        physicalCores: cpu.physicalCores,
        performanceCores: cpu.performanceCores,
        efficiencyCores: cpu.efficiencyCores,
        cache: cpu.cache
    }
    console.log(cpuObject);
    console.log("memory: ", memory);
    console.log("battery: ", battery);
    
}

await getSpecs();