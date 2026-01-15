import si from "systeminformation";

export async function getMemoryInfo(){
    const mem = await si.mem();

    return{
        total: (mem.total/1e9).toFixed(2),
        used: (mem.used/1e9).toFixed(2),
        free: (mem.used/1e9).toFixed(2)
    };
}