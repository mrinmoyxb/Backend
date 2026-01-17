import si from "systeminformation";

export async function getDiskInfo(){
    const disks = await si.fsSize();

    return disks.map(disk=>{
        const total = (disk.size/1e9).toFixed(2);
        const used = (disk.used/1e9).toFixed(2);
        const free = ((disk.size - disk.used)/1e9).toFixed(2);
        
        return {
            device: disk.fs,
            mount: disk.mount,
            filesystem: disk.type,
            total: total,
            used: used,
            free: free,
            freePercentage: total ? ((free/total)*100).toFixed(2) : null,
            usedPercentage: total ? ((used/total)*100).toFixed(2) : null,
            usage: disk.use.toFixed(2)
        }
    })
}

export async function getDiskLayout(){
    const dls = await si.diskLayout();
    
    return dls.map(dl=>({
            vendor: dl.vendor,
            name: dl.name,
            device: dl.device,
            type: dl.type,
            size: (dl.size/1e9).toFixed(2),
            interface: dl.interfaceType
    }))
}


