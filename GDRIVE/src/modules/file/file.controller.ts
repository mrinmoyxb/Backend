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