process.env.NTBA_FIX_319 = 1

var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот.
var token = '842396489:AAFpo0eafA4SEtJ7hv4ECqwzCY0eH2N4FRM';

// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

var questions = [
  {
    title: 'Сколько параметров можно передать функции ?',
    buttons: [
      [{ text: 'Ровно столько, сколько указано в определении функции.', callback_data: '0_1' }],
      [{ text: 'Сколько указано в определении функции или меньше.', callback_data: '0_2' }],
      [{ text: 'Сколько указано в определении функции или больше.', callback_data: '0_3' }],
      [{ text: 'Любое количество.', callback_data: '0_4' }]
    ],
    right_answer: 4
  },
  {
    title: 'Чему равна переменная name?\nvar name = "пупкин".replace("п", "д")',
    buttons: [
      [{ text: 'дудкин', callback_data: '1_1' }],
      [{ text: 'дупкин', callback_data: '1_2' }],
      [{ text: 'пупкин', callback_data: '1_3' }],
      [{ text: 'ляпкин-тяпкин', callback_data: '1_4' }]
    ],
    right_answer: 2
  },
  {
    title: 'Чему равно 0 || "" || 2 || true ?',
    buttons: [
      [{ text: '0', callback_data: '2_1' }],
      [{ text: '""', callback_data: '2_2' }],
      [{ text: '2', callback_data: '2_3' }],
      [{ text: 'true', callback_data: '2_4' }]
    ],
    right_answer: 3
  },
];

function getRandomQuestion() {
  return questions[Math.floor(Math.random() * questions.length)];
}

function newQuestion(msg) {
  var arr = getRandomQuestion();
  var text = arr.title;
  var options = {
    reply_markup: JSON.stringify({
      inline_keyboard: arr.buttons,
      parse_mode: 'Markdown'
    })
  };
  chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
  bot.sendMessage(chat, text, options);
}

bot.onText(/\/start_test/, function (msg, match) {
  newQuestion(msg);
});

bot.on('callback_query', function (msg) {
  var answer = msg.data.split('_');
  var index = answer[0];
  var button = answer[1];

  if (questions[index].right_answer == button) {
    bot.sendMessage(msg.from.id, 'Ответ верный ✅');
  } else {
    bot.sendMessage(msg.from.id, 'Ответ неверный ❌');
  }

  bot.answerCallbackQuery(msg.id, 'Вы выбрали: ' + msg.data, true);
  newQuestion(msg);
});



/* const Telegraf = require('telegraf')
const { Composer } = Telegraf
const bot = new Telegraf('842396489:AAFpo0eafA4SEtJ7hv4ECqwzCY0eH2N4FRM')
var chatId;

bot.start((ctx) => {
  chatId = ctx.chat.id;
  ctx.reply('Привет, давай я задам тебе пару вопросов:)');
  bot.telegram.sendMessage(chatId, 'Сообщение номер два', options);
  bot.telegram.sendMessage(chatId, 'Сделайте свой выбор: ', {
    reply_markup: JSON.stringify({
      inline_keyboard: [
        [{ text: 'Кнопка 1', callback_data: '1' }],
        [{ text: 'Кнопка 2', callback_data: '2' }],
        [{ text: 'Кнопка 3', callback_data: '3' }]
      ]
    })
  });
  bot.on('callback_query', function (ctx) {
    bot.telegram.sendMessage(ctx.from.id, ctx.data);
  });
})

bot.on('text', (ctx) => {
  if (ctx.message.text == 'да') {
    ctx.reply('Окей, продолжим.');
  }
});

bot.launch() */
