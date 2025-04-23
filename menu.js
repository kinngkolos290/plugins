const { bot, getBuffer, jidToNum, genThumbnail } = require('../lib/');
const { VERSION } = require('../config');
const {
  textToStylist,
  getUptime,
  PLUGINS,
  getRam,
  addSpace,
} = require('../lib/');
const url1 = 'https://files.catbox.moe/e1jw31.jpeg';
const url2 = 'https://files.catbox.moe/e1jw31.jpeg';

bot(
  {
    pattern: 'menu2 ?(.*)',
    desc: 'custom Menu',
    type: 'SUPREME DESTRUCTOR PLUGIN',
  },
  async (message, match, ctx) => {
    const jid = message.jid;
    const number = message.client.user.jid;
    const thumb = await getBuffer(url1);
    const thumbnail = await getBuffer(url2);
    const date = new Date();

    const sorted = ctx.commands.sort((a, b) => {
      if (a.name && b.name) {
        return a.name.localeCompare(b.name);
      }
      return 0;
    });

    const commands = {};
    ctx.commands.map(async (command, index) => {
      if (command.dontAddCommandList === false && command.pattern !== undefined) {
        let cmdType = command.type.toLowerCase();
        if (!commands[cmdType]) commands[cmdType] = [];
        let isDisabled = command.active === false;
        let cmd = command.name.trim();
        commands[cmdType].push(isDisabled ? cmd + ' [disabled]' : cmd);
      }
    });

    let CMD_HELP = `╭─══════❃══════─╮
            *SUPREME DESTRUCTOR 👑*
╰─══════❃══════─╯
╭══════❃═══════─╮
┃❃╭──────────────
┃❃│ 📅 *Date:* ${date.toLocaleDateString('en')}
┃❃│ ⏰ *Time:* ${date.toLocaleTimeString()}
┃❃│ ❄️ *Day:* ${date.toLocaleString('en', { weekday: 'long' })}
┃❃│ ✨ *Version:* ${VERSION}
┃❃│ 🪻 *RAM:* ${getRam()}
┃❃│ ⏳ *Uptime:* ${getUptime('t')} :
┃❃╰──────────────
╰═══════❃═══════╯
`;

    for (let cmdType in commands) {
      CMD_HELP += `╭───❃ │   *${cmdType.toUpperCase()} ❃* ╰━──────\n`;
      commands[cmdType].forEach((cmd) => {
        CMD_HELP += `│ ❃  ${textToStylist(cmd, 'mono')}\n`;
      });
    }

    const Data = {};
    Data.linkPreview = {
      renderLargerThumbnail: true,
      showAdAttribution: true,
      head: '🤍 MENU STYLE BY SUPREME DESTRUCTOR 🇭🇹•',
      body: '〆 Thanks for use Levanter bot𓆩愛𓆪',
      mediaType: 1,
      thumbnail: thumb.buffer,
      sourceUrl: 'https://whatsapp.com/channel/0029VaiOvsV1iUxQRXWnv40R',
    };

    Data.quoted = {
      key: {
        fromMe: false,
        participant: '0@s.whatsapp.net',
        remoteJid: 'status@broadcast',
      },
      message: {
        contactMessage: {
          displayName: `${message.pushName}`,
          vcard: `BEGIN:VCARD\nVERSION:3.0\nN:XL;${message.client.user.name},;;;\nFN:${message.client.user.name},\nitem1.TEL;waid=${jidToNum(number)}\nitem1.X-ABLabel:WhatsApp\nEND:VCARD`,
          jpegThumbnail: await genThumbnail(thumbnail.buffer),
        },
      },
    };

    return await message.send(`${CMD_HELP}`, Data);
  }
);
