import si from "systeminformation";

export async function getCPUInfo(){
    const cpu = await si.cpu();
    const load = await si.currentLoad();
    
    return {
        vendor: cpu.vendor,
        brand: cpu.brand,
        model: cpu.model,
        manufacturer: cpu.manufacturer,
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

getCPUInfo();