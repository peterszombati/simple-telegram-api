# simple-telegram-api
Telegram Bot API for NodeJS

## Getting started

### 1. Install via [npm](https://www.npmjs.com/package/simple-telegram-api)

```
npm i simple-telegram-api
```

### 2. Example usage
```ts
// TypeScript
import TelegramBot from 'simple-telegram-api';

const token = '<YOUR_TOKEN>';
const t = new TelegramBot(token);
t.getUpdates().then(resp => console.log(JSON.stringify(resp,null,'\t')))

const chat_id = 0;
const message = 'test message';
t.sendMessage(chat_id, message);
```
