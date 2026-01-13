export default function validateURL(url){
    try{
        new URL(url);
        return true;
    }catch{
        return false;
    }
}