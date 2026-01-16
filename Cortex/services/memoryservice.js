import si from "systeminformation";

export async function getMemoryInfo(){
    const mem = await si.mem();

    const total = mem.total;
    const used = mem.used;
    const free = mem.free;
    const swapTotal = mem.swaptotal;
    const swapUsed = mem.swapused;
    const swapFree = mem.swapfree;

    return{
        total: (total/1e9).toFixed(2),
        used: (used/1e9).toFixed(2),
        free: (free/1e9).toFixed(2),
        available: (mem.available/1e9).toFixed(2),
        usagePercentage: total ? ((used/total)*100).toFixed(2) : null,
        swapTotal: (swapTotal/1e9).toFixed(2),
        swapUsed: (swapUsed/1e9).toFixed(2),
        swapFree: (swapFree/1e9).toFixed(2),
        swapUsagePercentage: swapTotal ? ((swapUsed/swapTotal)*100).toFixed(2) : null
    };
}

