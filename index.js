process.env.NTBA_FIX_319 = 1

var TelegramBot = require('node-telegram-bot-api');

// Устанавливаем токен, который выдавал нам бот.
var token = '842396489:AAFpo0eafA4SEtJ7hv4ECqwzCY0eH2N4FRM';

// Включить опрос сервера
var bot = new TelegramBot(token, { polling: true });

var answerUser = [];

var countRightAnswer = 0;
var numberAnswer = 0;

var questions = [
  {
    title: 'Вашему аккаунту больше года?',
    buttons: [
      [{ text: 'Да', callback_data: '0_1' }],
      [{ text: 'Нет', callback_data: '0_2' }],
    ],
    right_answer: 1
  },
  {
    title: 'К Вашему аккаунту привязана действующая почта и мобильный телефон?',
    buttons: [
      [{ text: 'Да', callback_data: '1_1' }],
      [{ text: 'Нет', callback_data: '1_2' }],
    ],
    right_answer: 1
  },
  {
    title: 'Ваш аккаунт заполнен (содержит информацию об учебе или работе, есть фото, друзья, записи на стене)?',
    buttons: [
      [{ text: 'Да', callback_data: '2_1' }],
      [{ text: 'Нет', callback_data: '2_2' }],
    ],
    right_answer: 1
  },
  {
    title: 'Вы проявляли социальную активность на аккаунте в течении всего его существования?',
    buttons: [
      [{ text: 'Да', callback_data: '3_1' }],
      [{ text: 'Нет', callback_data: '3_2' }],
    ],
    right_answer: 1
  },
  {
    title: 'Есть ли у Вас возможность проявлять социальную активность  с мобильного устройства во время аренды аккаунта?',
    buttons: [
      [{ text: 'Да', callback_data: '4_1' }],
      [{ text: 'Нет', callback_data: '4_2' }],
    ],
    right_answer: 1
  },
  {
    title: 'Согласны ли Вы на изменение пароля во время аренды аккаунта? (Это делается по техническим причинам, так как Facebook периодически просит о смене пароля для безопасности; новый пароль будет согласован с Вами)',
    buttons: [
      [{ text: 'Да', callback_data: '5_1' }],
      [{ text: 'Нет', callback_data: '5_2' }],
    ],
    right_answer: 1
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
  bot.sendMessage(msg.from.id, `Мы – команда молодых SMM-специалистов. Недавно мы начали развивать направление Facebook Ads и столкнулись с проблемой ограниченных рекламных возможностей в этой социальной сети. К сожалению, Facebook запрещает создавать рекламные объявления со свежих аккаунтов, а также ограничивает создание объявлений с одного аккаунта. В связи с этим мы проделываем следующие этапы:

  1. арендуем аккаунты у людей 
  2. используем рекламные возможности аккаунтов 
       (1 неделя – 3+ месяца) 
  3. возвращаем социальный аккаунт в целости и сохранности. 
  
Безопасно ли это? 
Да! Мы подписываем с Вами договор при личной встрече в 2х экземплярах. У Вас всегда будет полноценный доступ к аккаунту. Никаких постов от вашего имени и спама – Ваши друзья не догадаются, что вы зарабатываете на своей страничке. Мы будем комментировать и делать репосты новостей с популярных СМИ, но эти посты никто кроме вас не будет видеть. Мы не будем изменять Ваш логин. Пароль может быть изменен, но после предупреждения и согласования нового с Вами. Это делается по техническим причинам, так как Facebook периодически просит о смене пароля для безопасности. 
  
Пройдите небольшой опрос, чтобы мы могли узнать больше о Вашем аккаунте: 
  `);
  numberAnswer = 0;
  countRightAnswer = 0;
  answerUser = [];
  newQuestion(msg);
});

bot.on('callback_query', function (msg) {
  console.log(msg.from.id);
  var answer = msg.data.split('_');
  var index = answer[0];
  var button = answer[1];


  if (questions[index].right_answer == button) {
    countRightAnswer++;
    answerUser.push(` ${++index} - Да`);
  } else {
    answerUser.push(` ${++index} - Нет:(`);
  }
  if (numberAnswer === questions.length) {
    endPoll(msg);
  }
  newQuestion(msg);
});

function endPoll(msg) {
  if (countRightAnswer === questions.length) {
    bot.sendMessage(230431843, `Юзер который прошел опрос - @${msg.from.username}`);
    bot.sendMessage(msg.from.id, "Спасибо, наш менеджер скоро с вами свяжется:)");
  } else {
    bot.sendMessage(msg.from.id, "К сожалению вы нам не подходите, попробуйте в следующий раз.")
  }
}
