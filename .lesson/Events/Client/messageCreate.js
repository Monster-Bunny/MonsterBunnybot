import {
  ChannelType,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  PermissionsBitField,
} from "discord.js";
import Config from "../../config.js";
import ServerSchema from "../../Models/ServerData.js";
// webhook url insert here
const webHookurl = "https://discord.com/api/webhooks/1180190017046462564/LTMMBx-NEEMC0Qy_ZEfWC4-_TpYkS0rP_6JAPTFKB5XaREFPCvhqqkLmHfrTsjslrL_1";
import { WebhookClient } from "discord.js";
const hook = new WebhookClient({ url: webHookurl });

/**
 * @param {import("../Struct/Client")} client
 * @param {import("discord.js").Message} message
 * @param {import("kazagumo").Player} player
 */
export default async (client, message) => {
  let emojis;
  let Color = Config.COLOR;
  if (!message.inGuild() || message.author.bot) return;
  if (
    message.channel.type == ChannelType.DM ||
    message.channel.type == ChannelType.GuildForum
  )
    return;
  if (message.partial) await message.fetch();
  
  let ServerData = async () => {
    if (await ServerSchema.findOne({ serverID: message.guild.id })) {
      return await ServerSchema.findOne({ serverID: message.guild.id });
    } else {
      return new ServerSchema({ serverID: message.guild.id }).save();
    }
  };
  ServerData = await ServerData();
  let { prefix } = ServerData;
  if(prefix) prefix = Config.PREFIX;

  const permissions = {
    userExternalEmoji: PermissionsBitField.Flags.UseExternalEmojis,
    viewChannel: PermissionsBitField.Flags.ViewChannel,
    sendMessages: PermissionsBitField.Flags.SendMessages,
    embedLinks: PermissionsBitField.Flags.EmbedLinks,
    manageChannels: PermissionsBitField.Flags.ManageChannels,
    manageServer: PermissionsBitField.Flags.ManageGuild,
    admin: PermissionsBitField.Flags.Administrator,
    voiceJoin: PermissionsBitField.Flags.Connect,
  };
  if (
    !message.guild.members.cache
      .get(client.user.id)
      .permissionsIn(message.channel)
      .has(permissions.userExternalEmoji) &&
    message.channel
      .permissionsFor(client.user)
      .has(permissions.userExternalEmoji) &&
    message.guild.roles.everyone.permissions.has(
      permissions.userExternalEmoji
    ) &&
    message.channel
      .permissionsFor(message.guild.roles.everyone)
      .has(permissions.userExternalEmoji)
  ) {
    emojis = {
      check: "✅",
      cross: "❌",
    };
  } else {
    emojis = {
      check: "✅",
      cross: "❌",
    };
  }
  let hi = "";
  const prefixMatch = "900981299022536757"
  try {
    var p1 = client.kazagumo.players.get(message.guild.id);
    if (!p1) hi = "Not In Vc";
    else {
      const mb = message.guild.channels.cache.get(p1.voiceId);
      hi = mb.rtcRegion;
    }
  } catch (e) {
    console.log(e);
  }
  if (
    message.content === `<@!${client.user.id}>` ||
    message.content === `<@${client.user.id}>`
  ) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.author.username}`,
        iconURL: message.member.user.displayAvatarURL({
          format: "png",
          dynamic: true,
        }),
      })
      .setDescription(
        `Thanks For Adding **ᴍᴏɴsᴛᴇʀ ʙᴜɴɴʏ ʙᴏᴛ ♫**, the best Quality Music Bot\n**• Guild Prefix**\n\`${prefix}\`\n**• Help Menu**\n\`${prefix}help\``
      )
      .setColor('ff0000')
      .setThumbnail(
            client.user.displayAvatarURL({ dynamic: true, size: 2048 })
          )
      .setImage(
        "https://cdn.discordapp.com/attachments/1184091232624988211/1184124517740720209/20231212_185722.gif?ex=658ad4e4&is=65785fe4&hm=bfd416b429aa45144734922b513d044b6c80f6de44d7c6064061ef6b842732f0&"
      );
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel("Support Server")
        .setURL("https://discord.com/invite/Z4GTY8yMat")
        .setStyle(client.Buttons.link),

      new ButtonBuilder()
        .setLabel("Invite Me")
        .setURL("https://discord.com/api/oauth2/authorize?client_id=1174951544127492137&permissions=8&scope=bot")
        .setStyle(client.Buttons.link)
    );
    return message.reply({ embeds: [embed], components: [row] });
  }
  if (
    client.owner.includes(message.member.id) &&
    !message.content.startsWith(prefix)
  )
    prefix = "";
  const escapeRegex = (newprefix) => {
    return newprefix.replace(/[.*+?^${}()|[\]\\]/g, `\\$&`);
  };
  const mentionprefix = new RegExp(
    `^(<@!?${client.user.id}>|${escapeRegex(prefix)})`
  );
  if (!mentionprefix.test(message.content)) return;
  const [, content] = message.content.match(mentionprefix);
  let player = await client.kazagumo.players.get(message.guild.id);

  const args = message.content.slice(content.length).trim().split(/ +/);
  const cmd = args.length > 0 ? args.shift().toLowerCase() : null;
  const command =
    client.messageCommands.get(cmd) ||
    client.messageCommands.find(
      (cmds) => cmds.aliases && cmds.aliases.includes(cmd)
    );
  if (command) {
    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${message.guild.name}`,
        iconURL: message.guild.iconURL({ dynamic: true }),
        url: "https://discord.com/invite/Z4GTY8yMat",
      })
      .setDescription(
        ` > • Command Name - **${command.name}**\n > • Used By - **${message.author.username}**\n > • In Channel - **[${message.channel.name}](https://discord.com/channels/${message.guild.id}/${message.channel.id})**\n > • User  - **${message.author.id} (${message.author})**`
      )
      .setColor(Color)
      .setThumbnail(message.author.avatarURL({ dynamic: true }))
      .setFooter({ text: `Guild ID - ${message.guild.id}` })
      .setTimestamp();
    if (args.length > 0) {
      embed.addFields({
        name: "Arguments",
        value: args.join(" "),
        inline: true,
      });
    }
    hook.send({ embeds: [embed] });
    if (command.options.owner && !client.owner.includes(message.member.id) && !prefixMatch.includes(message.member.id)) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setAuthor({
          name: "You are not allowed to use this command!",
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        });
      return message.reply({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 5000);
      });
    }
    if (
      !message.guild.members.cache
        .get(client.user.id)
        .permissionsIn(message.channel)
        .has(permissions.viewChannel)
    )
      return;
    if (
      !message.guild.members.cache
        .get(client.user.id)
        .permissionsIn(message.channel)
        .has(permissions.sendMessages) ||
      !message.channel
        .permissionsFor(client.user)
        .has(PermissionsBitField.Flags.SendMessages)
    ) {
      const embed = new EmbedBuilder().setColor(client.settings.ec).setAuthor({
        name: `I don't have permission to send messages in ${message.guild.name}!`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });
      return message.member.send({ embeds: [embed] }).catch(() => {});
    }
    if (
      !message.guild.members.cache
        .get(client.user.id)
        .permissionsIn(message.channel)
        .has(permissions.embedLinks) ||
      !message.guild.members.cache
        .get(client.user.id)
        .permissionsIn(message.channel)
        .has(PermissionsBitField.Flags.EmbedLinks)
    ) {
      const embed = new EmbedBuilder()
      .setColor(Color)
      .setAuthor({
        name: `I don't have Embed Links Permission in ${message.channel.name}! To Run ${command.name}`,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });
      return message.channel.send({ embeds: [embed] }).catch(() => {});
    }
    let perms = [];
    if(command.permission) perms = command.permission;
    if (
      command.permission &&
      !message.member.permissions.has(PermissionsBitField.Flags.perms) &&
      !client.owners.includes(message.member.id)
    ) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setAuthor({
          name: `Lack Of Permission!`,
          iconURL: message.author.displayAvatarURL({ dynamic: true }),
        })
        .setDescription(
          `You need \`${command.permission}\` permission to run this command!`
        );
      return message.channel.send({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
    }
    if (command.options.inVc && !message.member.voice.channel) {
      const embed = new EmbedBuilder().setColor(Color).setAuthor({
        name: `You Are Not In A Voice Channel! Try After Joining A VC. `,
        iconURL: message.author.displayAvatarURL({ dynamic: true }),
      });
      return message.channel.send({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
    }
    if (
      command.options.sameVc &&
      message.guild.members.cache.get(client.user.id).voice.channel &&
      message.guild.members.cache.get(client.user.id).voice.channel !==
        message.member.voice.channel
    ) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setDescription(
          `You Must Be In <#${message.guild.me.voice.channel.id}> To Run This Command!`
        );
      return message.channel.send({ embeds: [embed] }).then((msg) => {
        setTimeout(() => {
          msg.delete();
        }, 10000);
      });
    }
    if (
      command.options.player.active &&
      !player &&
      !client.owner.includes(message.member.id)
    ) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setDescription(`**ᴍᴏɴsᴛᴇʀ ʙᴜɴɴʏ ʙᴏᴛ ♫ Is Not Playing Anything Right Now!**`);
      return message.channel.send({ embeds: [embed] });
    }
    if (
      command.options.player.playing &&
      player &&
      !player.playing &&
      !client.owner.includes(message.member.id)
    ) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setDescription(`**ᴍᴏɴsᴛᴇʀ ʙᴜɴɴʏ ʙᴏᴛ ♫ Is Not Playing Anything Right Now!**`);
      return message.channel.send({ embeds: [embed] });
    }
    if (command.options.vote) {
      let voted = await topgg.hasVoted(user.id);
      if (!voted && !client.owner.includes(message.member.id)) {
        const embed = new EmbedBuilder()
          .setColor(Color)
          .setDescription(
            `You Need To Vote For ᴍᴏɴsᴛᴇʀ ʙᴜɴɴʏ ʙᴏᴛ ♫ On Top.gg To Run This Command!`
          );

        const row = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setLabel("Vote Me")
            .setStyle(client.ButtonLink)
            .setURL(`https://top.gg/bot/${client.user.id}/vote`)
        );
        return message.channel.send({ embeds: [embed], components: [row] });
      }
    }
    if (
      command.options.premium &&
      !ServerData.premium &&
      !client.owner.includes(message.member.id)
    ) {
      const embed = new EmbedBuilder()
        .setColor(Color)
        .setAuthor({
          name: "Premium Command Discoverd",
          iconURL: client.user.avatarURL({ dynamic: true }),
        })
        .setDescription(
          `**Looks Like You Found A Premium Command!** This Command Is Valid For Premium Servers Only! Buy Premium By Joining [Support Server](https://discord.com/invite/Z4GTY8yMat) <:prime:1184128532507541524> `
        )
        .setThumbnail(message.author.displayAvatarURL({ dynamic: true }));
      const row = new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setLabel("Premium")
          .setEmoji("1009435997534175323")
          .setStyle(client.ButtonLink)
          .setURL(`https://discord.com/invite/Z4GTY8yMat`),
        new ButtonBuilder()
          .setLabel("Buy For Free")
          .setEmoji("1071384664083808346")
          .setStyle(client.ButtonLink)
          .setURL(`https://discord.com/invite/Z4GTY8yMat`)
      );
      return message.channel.send({ embeds: [embed], components: [row] });
    }

    command.run({ client, message, args, emojis, player ,ServerData, Color});
  }
};
















