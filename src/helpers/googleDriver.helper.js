const { google } = require('googleapis');
const { isEmpty } = require('./common.helper');
const fs = require('fs');
const config = require('../config/env');

const oauth2Client = new google.auth.OAuth2(
    config.GOOGLE_DRIVER.CLIENT_ID,
    config.GOOGLE_DRIVER.CLIENT_SECRET,
    config.GOOGLE_DRIVER.REDIRECT_URI
);

oauth2Client.setCredentials({ refresh_token: config.GOOGLE_DRIVER.REFRESH_TOKEN });

const googleDrive = google.drive({
    version: 'v3',
    auth: oauth2Client,
});

const findFolderByName = async (name, parantId) => {
    let query = `mimeType = 'application/vnd.google-apps.folder' and name = '${name}'`;
    if (parantId) {
        query += ` and '${parantId}' in parents`;
    }
    const folderById = await googleDrive.files.list({
        q: query,
        spaces: 'drive',
    });
    const { data } = folderById || {};
    const { files } = data || {};
    return !isEmpty(files) ? files[0] : {}
}

const createFolder = async (folderName, parantId) => {
    var fileMetadata = {
        'name': folderName,
        'mimeType': 'application/vnd.google-apps.folder'
    };
    if (parantId) {
        fileMetadata.parents = [parantId];
    }
    const crateFolder = await googleDrive.files.create({
        resource: fileMetadata,
        fields: 'id'
    });
    const { data } = crateFolder || {}
    return data || {};
}

const createFile = async (fileName, path, parantId) => {
    var fileMetadata = {
        'name': fileName,
    };
    var media = {
        mimeType: 'image/jpeg',
        body: fs.createReadStream(path)
    };
    if (parantId) {
        fileMetadata.parents = [parantId];
    }
    const response = await googleDrive.files.create({
        resource: fileMetadata,
        media
    });
    const { data } = response || {}
    return data || {};
}


module.exports = {
    googleDrive,
    findFolderByName,
    createFolder,
    createFile
};
