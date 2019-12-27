import * as request from 'request-promise';
import {formatSendData} from "./formSendData";

export class TelegramBot {
    private token: string;

    constructor(token: string) {
        this.token = token;
    }

    private fixReplyMarkup(obj: any): any {
        if (obj.reply_markup && typeof obj.reply_markup !== 'string') {
            return {
                ...obj,
                reply_markup: JSON.stringify(obj.reply_markup)
            };
        }
        return obj;
    }

    private request(path: string, options: any = {}) {
        return request({
            ...options,
            qs: options.qs ? this.fixReplyMarkup(options.qs) : undefined,
            form: options.form ? this.fixReplyMarkup(options.form) : undefined,
            method: 'POST',
            url: `https://api.telegram.org/bot${this.token}/${path}`,
            simple: false,
            resolveWithFullResponse: true,
            forever: true
        })
            .then(resp => {
                let data;
                try {
                    data = resp.body = JSON.parse(resp.body);
                } catch (err) {
                    throw new Error(`Error parsing response: ${resp.body}`);
                }

                if (data.ok) {
                    return data.result;
                }

                throw new Error(`${data.error_code} ${data.description}`);
            })
    }

    public sendPhoto(
        chat_id: number,
        photo: string | Buffer,
        caption: string | undefined = undefined,
        parse_mode: string | undefined = undefined,
        disable_notification: boolean | undefined = undefined,
        reply_to_message_id: number | undefined = undefined,
        options: any = {},
        fileOptions: { filename?: string, contentType?: string} = {}
    ) {
        try {
            return this.request('sendPhoto', {
                qs: {
                    ...options,
                    chat_id,
                    photo: null,
                    caption,
                    parse_mode,
                    disable_notification,
                    reply_to_message_id
                },
                formData: formatSendData('photo', photo, fileOptions)
            });
        } catch (ex) {
            return Promise.reject(ex);
        }
    }

    public sendMessage(
        chat_id: number,
        text: string,
        parse_mode: string | undefined = undefined,
        disable_web_page_preview: boolean | undefined = undefined,
        disable_notification: boolean | undefined = undefined,
        reply_to_message_id: number | undefined = undefined,
        form: any = {}
    ) {
        return this.request('sendMessage', {
            form: {
                ...form,
                chat_id,
                text,
                parse_mode,
                disable_web_page_preview,
                disable_notification,
                reply_to_message_id
            }
        });
    }

    public sendPoll(
        chat_id: number,
        question: string,
        options: string[],
        disable_notification: boolean | undefined = undefined,
        reply_to_message_id: number | undefined | null = undefined,
        form: any = {}
    ) {
        return this.request('sendPoll', {
            form: {
                ...form,
                chat_id,
                question,
                options: JSON.stringify(options),
                disable_notification,
                reply_to_message_id
            }
        });
    }

    public getUpdates(offset: number | undefined = undefined, timeout: number = 0, limit: number = 100) {
        return this.request('getUpdates', {
            form: {
                timeout,
                limit,
                offset,
            }
        });
    }

}
