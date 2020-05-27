module.exports = {
    credentials:"s3_uploader_creds.json",
    bucketName:"runeterra.history.tracker",
    patterns:[
        "server/Electron Builds/*.exe",
        "server/Electron Builds/*.exe.blockmap",
        "server/Electron Builds/latest.yml",
        "client/assets/champ_pfps/*"
    ]
}