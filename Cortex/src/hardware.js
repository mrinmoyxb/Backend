import systemInformation from "systeminformation";

function convertToGB(sizeInBytes){
    const totalGB = (sizeInBytes / (1024**3)).toFixed(2);
    return totalGB;
}

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

    const memoryObject = {
        totalMemory: `${convertToGB(memory.total)} GB`,
        freeMemory: `${convertToGB(memory.free)} GB`,
        usedMemory: `${convertToGB(memory.used)} GB`,
        active: `${convertToGB(memory.active)} GB`,
        available: `${convertToGB(memory.available)} GB`
    }

    const batteryObject = {
        hasBattery: battery.hasBattery,
        cycleCount: battery.cycleCount,
        isCharging: battery.isCharging
    }

    // console.log("CPU: ", cpuObject);
    // console.log("Memory: ", memoryObject);
    // console.log("Battery: ", batteryObject);
    return {
        cpuObject,
        memoryObject,
        batteryObject
    }
}
