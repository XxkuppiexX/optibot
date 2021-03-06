// Load up the discord.js library
const Discord = require("discord.js");

// This is your client. Some people call it `bot`, some people call it `self`, 
// some might call it `cootchie`. Either way, when you see `client.something`, or `bot.something`,
// this is what we're refering to. Your client.
const client = new Discord.Client();

// Here we load the config.json file that contains our token and our prefix values. 
const config = require("./config.json");
// config.token contains the bot's token
// config.prefix contains the message prefix.

client.on("ready", () => {
  client.user.setActivity(`OptiDesigns BOT`);
});



function clean(text) {
    if (typeof(text) === "string")
      return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
    else
        return text;
}

var prefix = "-opti";

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

if (message.content.toLowerCase().startsWith(prefix + `nieuw`)) {
    const reason = message.content.split(" ").slice(1).join(" ");
    if (message.guild.channels.exists("name", "ticket-" + message.author.username)) return message.channel.send(`Jij hebt op dit moment al een ticket open.`);
    message.guild.createChannel(`ticket-${message.author.username}`, "text").then(c => {
        let role = message.guild.roles.find("name", "🎓 | Owner", "Co-Owner");
        let role2 = message.guild.roles.find("name", "@everyone");
        c.overwritePermissions(role, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        c.overwritePermissions(role2, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        c.overwritePermissions(message.author, {
            SEND_MESSAGES: true,
            READ_MESSAGES: true
        });
        message.channel.send(`:white_check_mark: Je ticket is gemaakt, #${c.name}.`);
        c.setParent('452378264002887691')
        c.send("**========================================\n   :exclamation: Welkom bij onze Ticket!! :exclamation: \n=========================================\n\nWelkom bij onze ticket systeem!! Wij hebben een eigen bot om nog zekerder te zijn dat wij alles groot aanpakken en proberen zo professioneel mogelijk te zin!! :tada:\n\n:waring: Hier volgt wat uitleg! :waring:\n\n1. U heeft een ticket aangemaakt voor wat u wilt.. :tada: <3\n\n2. Beschrijf uw Design aub zo goed mogelijk om de Designer te laten weten wat je percies wilt!! :art:\n\n3. Als u uw Designs heeft uitgelegd gaan onze Designers ermee aan de slag!! :wink: :tada:\n\n4. Dat was alles wat we wouden weten en dat waren zo een beetje de stappen!! Bedankt voor uw begrip en hoop dat we het beste ervan maken!! :tada: :100:\n\nMet vriendelijke groet:\n\nHet Optimus DesignerTeam**")
    }).catch(console.error);
}
if (message.content.toLowerCase().startsWith(prefix + `done`)) {
    if (!message.channel.name.startsWith(`ticket-`)) return message.channel.send(`je kan het ticket niet sluiten als je niet in de channel van de ticket zit.`);

    message.channel.send(`Weet je het zeker? Deze actie kan niet ongedaan worden gemaakt\nAls je het zeker weet typ \`!ja\`. Na 10 seconde word dit geanuleerd en zal dit ticket niet verwijderd worden.`)
    .then((m) => {
      message.channel.awaitMessages(response => response.content === '!ja', {
        max: 1,
        time: 10000,
        errors: ['time'],
      })
      .then((collected) => {
          message.channel.setParent("452383683119284224")
          c.overwritePermissions(message.author, {
            SEND_MESSAGES: false,
            READ_MESSAGES: false
        });
        })
        .catch(() => {
          m.edit('Je hebt geen !ja getypt, het ticket word niet gesloten').then(m2 => {
              m2.delete();
          }, 3000);
        });
    });
}

});
  
client.on("message", async message => {
  // This event will run on every single message received, from any channel or DM.
  
  // It's good practice to ignore other bots. This also makes your bot ignore itself
  // and not get into a spam loop (we call that "botception").
  if(message.author.bot) return;
  
  // Also good practice to ignore any message that does not start with our prefix, 
  // which is set in the configuration file.
  if(message.content.indexOf(config.prefix) !== 0) return;
  
  // Here we separate our "command" name, and our "arguments" for the command. 
  // e.g. if we have the message "+say Is this the real life?" , we'll get the following:
  // command = say
  // args = ["Is", "this", "the", "real", "life?"]
  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();
  
  // Let's go with a few common example commands! Feel free to delete or change those.
   if(command === "mute") {
    let reason = args.slice(1).join(' ');
    let member = message.mentions.members.first();
    let muteRole = message.guild.roles.find('name', 'Mute');
    if (!muteRole) return message.reply('Er is geen mute rol').catch(console.error);
    if (message.mentions.users.size < 1) return message.reply('Je moet iemand taggen die je wilt muten').catch(console.error);
    const embed = new Discord.RichEmbed()
      .setColor(0x00AE86)
      .setTimestamp()
      .setDescription(`Un/mute\n: ${member.user.tag}\n**Door:** ${message.author.tag}\n**Reden:** ${reason}`);
  
    if (!message.guild.me.hasPermission('MANAGE_ROLES')) return message.reply('Je heb hier geen perms voor').catch(console.error);
  
    if (member.roles.has(muteRole.id)) {
      member.removeRole(muteRole).then(() => {
        client.channels.get(modlog.id).send({embed}).catch(console.error);
      })
      .catch(e=>console.error("Ik kan hem niet unmute omday: " + e));
    } else {
      member.addRole(muteRole).then(() => {
        client.channels.get(modlog.id).send({embed}).catch(console.error);
      })
      .catch(e=>console.error("Ik kan hem geen mute geven omdat: " + e));
    }
  
  };


  if(command === "say") {
    if(!message.member.roles.some(r=>["🎓 | Owner", "Co-Owner"].includes(r.name)) )
    return message.reply("Sorry je hebt hier geen perms voor :(");
    // makes the bot say something and delete the message. As an example, it's open to anyone to use. 
    // To get the "message" itself we join the `args` back into a string with spaces: 
    const sayMessage = args.join(" ");
    // Then we delete the command message (sneaky, right?). The catch just ignores the error with a cute smiley thing.
    message.delete().catch(O_o=>{}); 
    // And we get the bot to say the thing: 
    message.channel.send({embed: {
      color: RED,
      description: (sayMessage)
    }});
  }
  
  if(command === "kick") {
    // This command must be limited to mods and admins. In this example we just hardcode the role names.
    // Please read on Array.some() to understand this bit: 
    // https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Array/some?
    if(!message.member.roles.some(r=>["🎓 | Owner", "Co-Owner"].includes(r.name)) )
      return message.reply("dacht je nu echt dat jij iemand kon kicken XD");
    
    // Let's first check if we have a member and if we can kick them!
    // message.mentions.members is a collection of people that have been mentioned, as GuildMembers.
    // We can also support getting the member by ID, which would be args[0]
    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("je moet @ gebruiken");
    if(!member.kickable) 
      return message.reply("hu, ik kan hem niet kicken heb ik eigenlijk wel kick perms??");
    
    // slice(1) removes the first part, which here should be the user mention or ID
    // join(' ') takes all the various parts to make it a single string.
    let reason = args.slice(1).join(' ');
    if(!reason) reason = "hij heeft geen reden ingevult";
    
    // Now, time for a swift kick in the nuts!
    await member.kick(reason)
      .catch(error => message.reply(`Sorry ${message.author} kan ik niet kicken om: ${error}`));
    message.reply(`${member.user.tag} is gekickt door ${message.author.tag} omdat: ${reason}`);

  }
  
  if(command === "ban") {
    // Most of this command is identical to kick, except that here we'll only let admins do it.
    // In the real world mods could ban too, but this is just an example, right? ;)
    if(!message.member.roles.some(r=>["🎓 | Owner", "Co-Owner"].includes(r.name)) )
      return message.reply("srs !ban dacht je nou echt.......");
    
    let member = message.mentions.members.first();
    if(!member)
      return message.reply("je moet @ gebruiken");
    if(!member.bannable) 
      return message.reply("hu, ik kan hem niet bannen heb ik eigenlijk wel kick perms??");

    let reason = args.slice(1).join(' ');
    if(!reason) reason = "geen reden ingevult";
    
    await member.ban(reason)
      .catch(error => message.reply(`Sorry ${message.author} kan ik niet bannen om: ${error}`));
    message.reply(`${member.user.tag} is geband door ${message.author.tag} omdat: ${reason}`);
  }
  
  if(command === "clear") {
    if(!message.member.roles.some(r=>["🎓 | Owner", "Co-Owner"].includes(r.name)) )
    return message.reply("je kan geen !clear vraag aan een CEO of head-support om hulp");
    // This command removes all messages from all users in the channel, up to 100.
    
    // get the delete count, as an actual number.
    const deleteCount = parseInt(args[0], 10);
    
    // Ooooh nice, combined conditions. <3
    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("voer een nummer tussen de 2 en 100 in");
    
    // So we get our messages, and delete them. Simple enough, right?
    const fetched = await message.channel.fetchMessages({count: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`ik kan de message's niet delete omdat: ${error}`));
  }
});

client.login("NDQ1OTg2ODY5NzMwMzQ0OTgw.DfMrOw.lAGLKwBKdQNlyQR08Qx96zElIVY");
