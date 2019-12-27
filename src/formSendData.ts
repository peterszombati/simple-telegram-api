import * as path from "path";
import * as fs from "fs";
const mime = require("mime");
import * as fileType from 'file-type';

export function formatSendData(type: string, data: Buffer | string, fileOptions: { filename?: string, contentType?: string} = {}) {
    let filedata: fs.ReadStream | string | Buffer = data;
    let filename = fileOptions.filename;
    let contentType = fileOptions.contentType;

    if (Buffer.isBuffer(data)) {
        if (!filename && !process.env.NTBA_FIX_350) {
            filename = 'data';
        }
        if (!contentType) {
            const filetype = fileType(data);
            if (filetype) {
                contentType = filetype.mime;
                const { ext } = filetype;
                if (ext && !process.env.NTBA_FIX_350) {
                    filename = `${filename}.${ext}`;
                }
            } else if (!process.env.NTBA_FIX_350) {
                throw new Error('Unsupported Buffer file-type');
            }
        }
    } else if (typeof(data) === 'string') {
        if (fs.existsSync(data)) {
            filedata = fs.createReadStream(data);
            if (!filename) {
                filename = path.basename(data);
            }
        } else {
            throw new Error('File is not exists')
        }
    } else {
        throw new Error('data type is not valid')
    }

    filename = filename || 'filename';

    contentType = contentType || mime.getExtension(filename);
    if (process.env.NTBA_FIX_350) {
        contentType = contentType || 'application/octet-stream';
    }

    return {
        [type]: {
            value: filedata,
            options: {
                filename,
                contentType,
            },
        },
    };
}