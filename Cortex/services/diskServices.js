import si from "systeminformation";

export async function getDiskInfo(){
    const disks = await si.fsSize();

    const label = await si.diskLayout();
    console.log(label);
    
    return disks.map(disk=>({
        device: disk.fs,
        mount: disk.mount,
        filesystem: disk.type,
        total: (disk.size/1e9).toFixed(2),
        used: (disk.used/1e9).toFixed(2),
        free: ((disk.size - disk.used)/1e9).toFixed(2),
        usage: disk.use.toFixed(2)
    }))

}

