const TelegramAPI = require('node-telegram-bot-api');
const { gameOptions, againOptions } = require('./options');
const token = '5637470336:AAG9sUFN2Rd0Ecmj-IcFs85F2vqPeFqqYO4';

const bot = new TelegramAPI(token, { polling: true });

const chats = [];

const startGame = async (id) => {
    await bot.sendMessage(id, `Let's have fun. Now, I'm going to imagine number from 0 to 9 =)`);
    const randomNum = Math.floor(Math.random() * 10);
    chats[id] = randomNum;
    await bot.sendMessage(id, `What do you think?`, gameOptions);
};
const start = () => {
    bot.setMyCommands([
        { command: '/start', description: 'Onboarding' },
        { command: '/info', description: 'Get information about user' },
        { command: '/game', description: 'Game where you can to guess number, which I imagined.' },
    ]);

    bot.on('message', async (msg) => {
        const text = msg.text;
        const chatId = msg.chat.id;
        if (text === '/start') {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/b0d/85f/b0d85fbf-de1b-4aaf-836c-1cddaa16e002/6.webp');
            return bot.sendMessage(chatId, `Hello, welcome to my app. Are you ready to have a bit of fun?`);
        }
        if (text === '/info') {
            return bot.sendMessage(chatId, `Your name is ${msg.from.first_name} ${msg.from.last_name}`);
        }
        if (text === '/game') {
            console.log(msg.chat, 'chat');
            return startGame(chatId);
        }
        return bot.sendMessage(chatId, "Sorry, it's not clear for me. Let's try again :)");
    });
    bot.on('callback_query', async (response) => {
        const data = response.data;
        const chatId = response.message.chat.id;
        if (data === '/again') {
            return startGame(chatId);
        }
        if (data == chats[chatId]) {
            await bot.sendSticker(
                chatId,
                'https://selcdn.tlgrm.app/stickers/a44/f43/a44f4309-2064-3cae-a69c-9cfbc5a0a210/192/1.webp'
            );
            return await bot.sendMessage(chatId, `Congratulatians!!!\u{1F389} \u{1F389} \u{1F389} You are right.`, againOptions);
        } else {
            await bot.sendSticker(chatId, 'https://tlgrm.ru/_/stickers/a44/f43/a44f4309-2064-3cae-a69c-9cfbc5a0a210/192/14.webp');
            return await bot.sendMessage(
                chatId,
                `Sorry, but it's incorrect. My number is ${chats[chatId]}. Let's try again. \u{1F64C}`,
                againOptions
            );
        }
    });
};

start();
