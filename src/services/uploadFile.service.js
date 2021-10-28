const HttpStatus = require("http-status-codes");
const Message = require('../constants/message.constant');
const { buildErrorItem } = require('../helpers/error.helper');
const { RESOURCES } = require("../constants/baseApiResource.constant");
const { findFolderByName, createFolder, createFile } = require('../helpers/googleDriver.helper');
const { isEmpty } = require("../helpers/common.helper");
const { FOLDER_DRIVER_NAME } = require("../constants/common.constant");

const uploadFilesService = async (req) => {
    try {
        const { files, query } = req;
        const { folderStorage, targetId } = query;
        let targetParent = '';
        let createFilesResult = [];
        const rootFolder = await findFolderByName(FOLDER_DRIVER_NAME.VIVU_SHIP);
        if (isEmpty(rootFolder)) {
            return buildErrorItem(RESOURCES.UPLOAD_FILE, null, HttpStatus.NOT_FOUND, Message.ROOT_FOLDER_NOT_EXIST, {});
        }
        const folderStorageData = await findFolderByName(folderStorage, rootFolder.id);
        if (isEmpty(folderStorageData)) {
            return buildErrorItem(RESOURCES.UPLOAD_FILE, null, HttpStatus.NOT_FOUND, Message.FOLDER_STORAGE_NOT_EXIST, {});
        }
        const folderTargetData = await findFolderByName(targetId, folderStorageData.id);
        if (!isEmpty(folderTargetData)) {
            targetParent = folderTargetData.id;
        } else {
            const createFolderTarget = await createFolder(targetId, folderStorageData.id);
            targetParent = createFolderTarget.id;
        }
        for (let i = 0; i < files.length; i++) {
            const file = files[i] || {};
            const { path, originalname } = file;
            const nameFormat = `${folderStorage}_${targetId}_${originalname}`;
            const createFileResult = await createFile(nameFormat, path, targetParent);
            createFilesResult.push(createFileResult);
        }
        return createFilesResult;
    } catch (error) {
        return buildErrorItem(RESOURCES.UPLOAD_FILE, null, HttpStatus.INTERNAL_SERVER_ERROR, Message.INTERNAL_SERVER_ERROR, {});
    }
}

module.exports = {
    uploadFilesService,
};
