const fetch = require('node-fetch');
/*
loads dictionary from lapa  to lipu_nimi
*/
var lipu_nimi;

fetch('https://raw.githubusercontent.com/lipu-linku/jasima/main/data.json')
  .then(response => response.json())
  .then(data => {
    lipu_nimi = data['data'];
  })
  .then(console.log('lipu_nimi loaded successfully'));

/*connects to Twitch IRC*/
const tmi = require('tmi.js'),
  { channel, username, password } = require('./settings.json')
/*for replit  password = process.env['oAuth'];*/

const options = {
  options: { debug: true },
  connection: {
    reconnect: true,
    secure: true
  },
  identity: {
    username,
    password
  },
  channels: [channel]
}

const client = new tmi.Client(options);
client.connect().catch(console.error);

client.on('connected', () => {
  client.say(channel, 'goopbot has connected to the chat');
});

/*chat commands*/
client.on('message', (channel, user, message, self) => {
  /*ignores self messages*/
  if(self) return;
  /*test chat command*/
  if(message == '!hello') {
    client.say(channel, `@${user.username}, hello!`);
  };
  /*defines given toki pona word*/
  if(message.startsWith('!nimi ')) {
    var message_split = message.split(' ');
    var nimi = message_split[1].toLowerCase();
    
    if(!lipu_nimi[nimi]) {
      client.say(channel, `'${nimi}' is not in this toki pona dictionary, sorry!`);
      return;
    };

    var lang;
    if(message_split[2]) {
      lang = message_split[2].toLowerCase();
      if(!lipu_nimi[nimi]['def'][lang]) {lang = 'en'}
    } else { lang = 'en'; }

    client.say(channel, `${nimi}: ${lipu_nimi[nimi]['def'][lang]}`)
  };
  if(message == '!nimi') {
    client.say(channel, 'Use !nimi <word> to get the definition of any Toki Pona word. Here, try "!nimi nimi"')
  }
  /*tki pona info*/
  if(message.startsWith('!tokipona') || message == '!tp') {
    client.say(channel, 'Toki Pona is a constructed language invented by Sonja Lang. Its name translates literally to "the language of good", and it only has ~137 words! "!tplearn" for more info.');
  };
  if(message.startsWith('!tplearn')) {
    client.say(channel, 'Toki Pona is really fun to learn! A popular video course is available here: https://youtu.be/J93GWOMbgdg, or you can check out the lessons I\'ve been learning with: https://lipu-sona.pona.la/.');
  };
  /*commands function*/
  if(message.startsWith('!commands')) {
    client.say(channel, 'I recently began learning Toki Pona - "!tokipona" for more info! "!nimi [word]" defines any Toki Pona word, with an optional two-letter language code, e.g. "!nimi pona fr". Try "!tpfact"!');
  }
  /*random facts*/
  if(message.startsWith('!tpfact')) {
    facts = require('./facts.json')["facts"]
    var fact = facts[Math.floor(Math.random() * facts.length)];
    client.say(channel, fact);
  }
})
