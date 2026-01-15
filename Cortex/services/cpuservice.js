import si from "systeminformation";

export async function getCPUInfo(){
    const cpu = await si.cpu();
    const load = await si.currentLoad();

    return {
        brand: cpu.brand,
        cores: cpu.cores,
        speed: cpu.speed,
        load: load.currentLoad.toFixed(2)
    };
}