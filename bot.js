require('dotenv').config();
const { Telegraf } = require('telegraf');
const api = require('covid19-api');
const Markup = require('telegraf/Markup');
const COUNTRIES_LIST = require('./constants');

const bot = new Telegraf(process.env.BOT_TOKEN);
bot.start((ctx) => ctx.reply(`Привет ${ctx.message.from.first_name}!
Узнай статистику по коронавирусу.
Введи название страны на английском и получи данные.
Посмотреть весь список стран можно командой /help.`,
    Markup.keyboard([
      ['US', 'RUSSIA'],
      ['Ukraine', 'Italy'],
    ]).extra()
 ));
bot.help((ctx) => ctx.reply(COUNTRIES_LIST));

bot.on('text', async (ctx) => {
  let data = {};
  try{
  data = await api.getReportsByCountries(ctx.message.text);
  const formatData = `
Страна: ${data[0][0].country}
Случаи: ${data[0][0].cases}
Смертей: ${data[0][0].deaths}
Выздоровело: ${data[0][0].recovered}`;
  ctx.reply(formatData);
} catch {
  ctx.reply('Ошибка, такой страны не существует');
}
});

bot.launch();
