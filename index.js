process.env.NTBA_FIX_319 = 1

var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот.
var token = '842396489:AAFpo0eafA4SEtJ7hv4ECqwzCY0eH2N4FRM';

// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

var countRightAnswer = 0;
var numberAnswer = 0;

var questions = [
  {
    title: 'Первый вопрос. Сколько параметров можно передать функции ?',
    buttons: [
      [{ text: 'Ровно столько, сколько указано в определении функции.', callback_data: '0_1' }],
      [{ text: 'Сколько указано в определении функции или меньше.', callback_data: '0_2' }],
      [{ text: 'Сколько указано в определении функции или больше.', callback_data: '0_3' }],
      [{ text: 'Любое количество.', callback_data: '0_4' }]
    ],
    right_answer: 4
  },
  {
    title: 'Второй вопрос. Чему равна переменная name?\nvar name = "пупкин".replace("п", "д")',
    buttons: [
      [{ text: 'дудкин', callback_data: '1_1' }],
      [{ text: 'дупкин', callback_data: '1_2' }],
      [{ text: 'пупкин', callback_data: '1_3' }],
      [{ text: 'ляпкин-тяпкин', callback_data: '1_4' }]
    ],
    right_answer: 2
  },
  {
    title: 'Третий вопрос. Чему равно 0 || "" || 2 || true ?',
    buttons: [
      [{ text: '0', callback_data: '2_1' }],
      [{ text: '""', callback_data: '2_2' }],
      [{ text: '2', callback_data: '2_3' }],
      [{ text: 'true', callback_data: '2_4' }]
    ],
    right_answer: 3
  },
];

function newQuestion(msg) {
  var arr = questions[numberAnswer];
  var text = arr.title;
  var options = {
    reply_markup: JSON.stringify({
      inline_keyboard: arr.buttons,
      parse_mode: 'Markdown'
    })
  };
  chat = msg.hasOwnProperty('chat') ? msg.chat.id : msg.from.id;
  bot.sendMessage(chat, text, options);
  if (numberAnswer < questions.length) {
    numberAnswer++;
  }
}

bot.onText(/\/start/, function (msg, match) {
  numberAnswer = 0;
  countRightAnswer = 0;
  newQuestion(msg);
});

bot.on('callback_query', function (msg) {
  var answer = msg.data.split('_');
  var index = answer[0];
  var button = answer[1];

  if (questions[index].right_answer == button) {
    countRightAnswer++;
  }

  if (numberAnswer === questions.length) {
    endPoll(msg);
  }
  newQuestion(msg);
});

function endPoll(msg) {
  if (countRightAnswer >= 2) {
    bot.sendMessage(msg.from.id, "Отлично, вы прошли тест! Перейдите по ссылке123:  vk.com");
  } else {
    bot.sendMessage(msg.from.id, "К сожалению вы нам не подходите, попробуйте в другой раз.")
  }
}