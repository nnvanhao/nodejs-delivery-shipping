const { findFolderByName, createFolder } = require('../src/helpers/googleDriver.helper');
const { FOLDER_DRIVER_NAME } = require('../src/constants/common.constant');
const { isEmpty } = require('../src/helpers/common.helper');


exports.createRootFolder = async function () {
    try {
        let rootFolderId = '';
        const rootFolder = await findFolderByName(FOLDER_DRIVER_NAME.VIVU_SHIP);
        if (isEmpty(rootFolder)) {
            const createData = await createFolder(FOLDER_DRIVER_NAME.VIVU_SHIP);
            rootFolderId = createData.id;
        } else {
            rootFolderId = rootFolder.id;
        }
        if (!rootFolderId) return;
        const childrenFolders = [FOLDER_DRIVER_NAME.USERS, FOLDER_DRIVER_NAME.ORDERS];
        for (let i = 0; i < childrenFolders.length; i++) {
            const folderElement = childrenFolders[i];
            const chilrenFolder = await findFolderByName(folderElement, rootFolderId);
            if (isEmpty(chilrenFolder)) {
                const createChilrenData = await createFolder(folderElement, rootFolderId);
            }
        }
    } catch (error) {
        console.log({ error });
    }
};