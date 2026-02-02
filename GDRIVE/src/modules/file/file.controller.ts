import { type Request, type Response } from "express";
import { fileModel } from "../../models/file.model.ts";
import { utilGeneratePresignedURL } from "../../utils/awsS3Presigned.util.ts";
import { v4 as uuidv4 } from 'uuid';

export async function setFileUploadToS3(req: Request, res: Response){
    const userId = req.userId;
    const {fileName, fileSize, fileType, parentId} = req.body;

    const normalizedParentId = parentId && parentId !== "null" ? parentId : null;

    if (normalizedParentId) {
        const folder = await fileModel.findOne({ _id: parentId, owner: userId }) as any;
        if (!folder || !folder.isFolder) {
            return res.status(400).json({ msg: "invalid folder" });
        }
    }

    const uid = uuidv4();
    const s3Key = `users/${userId}/${uid}-${fileName}`;
    const uploadURL = await utilGeneratePresignedURL(s3Key, fileType) as any;

    const fileDoc = await fileModel.create({
        owner: userId,
        name: fileName,
        originalName: fileName,
        mimeType: fileType,
        size: fileSize,
        s3Key: s3Key,
        parent: normalizedParentId,
        isFolder: false,
        status: "PENDING"
    });

    return res.status(201).json({
        fileId: fileDoc._id,
        uploadURL
    });
}

export async function setFileUploadConfirmation(req: Request, res: Response){
    const userId = req.userId;
    const { fileId, status } = req.body;

    const fileDoc = await fileModel.findOne({_id: fileId, owner: userId});
    if(!fileDoc){
        return res.status(404).json({msg: "file not found"});
    }

    if(fileDoc.status !== "PENDING"){
        return res.status(400).json({ msg: "invalid state transition" });
    }

    fileDoc.status = status;
    await fileDoc.save();

    return res.status(200).json({ msg: "upload confirmed" });
}

export async function setFileStarred(req: Request, res: Response){
    try {
        const userId = req.userId;
        const fileId = req.params.id;

        const isFile = await fileModel.findOne({ owner: userId, _id: fileId });
        if (!isFile) {
            return res.status(404).json({ msg: "file/folder not found" });
        }

        if(isFile.trashed){
            return res.status(400).json({msg: "cannot star/unstar a trashed file"});
        }

        isFile.starred = !isFile.starred;
        await isFile.save();

        return res.status(200).json({msg: "success", starred: isFile.starred});
    } catch (error) {
        return res.status(500).json({ msg: "internal server error" });
    }
}

export async function setFileTrashed(req: Request, res: Response){
    try{
        const userId = req.userId;
        const fileId = req.params.id;

        const isFile = await fileModel.findOne({owner: userId, _id: fileId});
        if(!isFile){
            return res.status(404).json({ msg: "file/folder not found" });
        }

        if(isFile.trashed){
            return res.status(200).json({msg: "file already in trash"});
        }

        isFile.trashed = true;
        isFile.trashedAt = new Date();
        await isFile.save();

        return res.status(200).json({msg: "file moved to bin successfully"});

    }catch(error){
        return res.status(500).json({ msg: "internal server error" });
    }
}

export async function setCreateNewFolder(req: Request, res: Response){
    try{
        const userId = req.userId;
        const { folderName, parentId } = req.body;

        const normalizedParentId = parentId && parentId !== "null" ? parentId : null;

        if (normalizedParentId) {
            const parentFolder = await fileModel.findOne({
                _id: normalizedParentId,
                owner: userId,
                isFolder: true,
                trashed: false
            });

            if (!parentFolder) {
                return res.status(400).json({ msg: "invalid parent folder" });
            }
        }

        const existingFolder = await fileModel.findOne({
            owner: userId,
            isFolder: true,
            name: folderName,
            parent: normalizedParentId,
            trashed: false
        });

        if(existingFolder){
            return res.status(400).json({msg: "folder already exists"});
        }
        
        await fileModel.create({
            owner: userId,
            name: folderName,
            isFolder: true,
            parent: normalizedParentId
        });
        return res.status(200).json({msg: "new folder created"});

    }catch(error){
        return res.status(500).json({ msg: "internal server error" });
    }
}