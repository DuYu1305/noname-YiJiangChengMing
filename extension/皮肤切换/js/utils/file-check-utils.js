export function createFileCheckUtils(game, skinSwitch) {
    return {
        qhly_checkFileExist: function (path, callback) {
            game.checkFile(path, (result) => callback(result === 0 || result === 1));
        },
        checkFilesExistAndReturnOne: function (paths, callback) {
            let tryCheck = (index) => {
                if (index >= paths.length) return callback(null)
                skinSwitch.qhly_checkFileExist(paths[index], (exists) => {
                    if (exists) return callback(paths[index])
                    tryCheck(index + 1)
                })
            }
            tryCheck(0)
        },
        isMobile: function () {
            return (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|OperaMini/i.test(navigator.userAgent));
        },
    }
}

