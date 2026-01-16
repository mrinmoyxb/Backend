import si from "systeminformation";
import os from "node:os";

export async function getCPUInfo(){
    const cpu = await si.cpu();
    const load = await si.currentLoad();
    
    return {
        vendor: cpu.vendor,
        brand: cpu.brand,
        model: os.cpus()[0].model,
        manufacturer: cpu.manufacturer,
        architecture: os.arch(),
        os: os.platform(),
        governor: cpu.governor,
        processors: cpu.processors,
        cores: cpu.cores,
        efficiencyCores: cpu.efficiencyCores,
        performanceCores: cpu.performanceCores,
        speed: cpu.speed,
        virtualization: cpu.virtualization,
        cache: cpu.cache,
        family: cpu.family,
        speedMax: cpu.speedMax,
        speedMin: cpu.speedMin,
        load: load.currentLoad.toFixed(2)
    };
}

console.log(os.release());