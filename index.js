/**
 * Discord.js v14 Ticket Bot
 * Geliştirici: Sercawa
 * GitHub: https://github.com/sercawa/discord-ticket-bot
 * Lisans: MIT
 */

const { Client, GatewayIntentBits, Collection, ActivityType, EmbedBuilder } = require('discord.js');
const fs = require('fs');
const path = require('path');
const database = require('./database');
const Ticket = require('./models/Ticket');
const Settings = require('./models/Settings');


const config = require('./config.json');


const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});


client.commands = new Collection();


const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
        console.log(`✅ Komut yüklendi: ${command.data.name}`);
    } else {
        console.log(`⚠️ Komut yüklenemedi: ${file} - data veya execute eksik`);
    }
}


async function getSettings(guildId) {
    try {
        let settings = await Settings.findOne({ guildId });
        if (!settings) {
            settings = new Settings({ guildId });
            await settings.save();
        }
        return settings;
    } catch (error) {
        console.error('Settings yüklenirken hata:', error);
        return null;
    }
}

async function updateSettings(guildId, updateData) {
    try {
        const settings = await Settings.findOneAndUpdate(
            { guildId },
            updateData,
            { upsert: true, new: true }
        );
        return settings;
    } catch (error) {
        console.error('Settings güncellenirken hata:', error);
        return null;
    }
}

async function createTicket(ticketData) {
    try {
        const ticket = new Ticket(ticketData);
        await ticket.save();
        return ticket;
    } catch (error) {
        console.error('Ticket oluşturulurken hata:', error);
        return null;
    }
}

async function getTicket(ticketId) {
    try {
        return await Ticket.findOne({ ticketId });
    } catch (error) {
        console.error('Ticket yüklenirken hata:', error);
        return null;
    }
}

async function updateTicket(ticketId, updateData) {
    try {
        return await Ticket.findOneAndUpdate({ ticketId }, updateData, { new: true });
    } catch (error) {
        console.error('Ticket güncellenirken hata:', error);
        return null;
    }
}

async function getUserTickets(userId, guildId) {
    try {
        return await Ticket.find({ userId, guildId, closed: false });
    } catch (error) {
        console.error('Kullanıcı ticketları yüklenirken hata:', error);
        return [];
    }
}


global.getSettings = getSettings;
global.updateSettings = updateSettings;
global.createTicket = createTicket;
global.getTicket = getTicket;
global.updateTicket = updateTicket;
global.getUserTickets = getUserTickets;


client.once('ready', async () => {
    console.log(`🤖 ${client.user.tag} olarak giriş yapıldı!`);
    

    await database.connect();
    

    const activityType = ActivityType[config.botSettings.activity.type];
    client.user.setActivity(config.botSettings.activity.name, { type: activityType });
    client.user.setStatus(config.botSettings.status);
    
    console.log(`📊 Activity: ${config.botSettings.activity.name} (${config.botSettings.activity.type})`);
    console.log(`🟢 Status: ${config.botSettings.status}`);
});


client.on('messageCreate', async (message) => {
    if (message.author.bot) return;
    if (!message.content.startsWith(config.prefix)) return;
    
    const args = message.content.slice(config.prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    
    const command = client.commands.get(commandName);
    
    if (!command) return;
    
    try {
        await command.execute(message, args, client);
    } catch (error) {
        console.error(`Komut çalıştırılırken hata: ${error}`);
        
        const errorEmbed = new EmbedBuilder()
            .setColor(config.colors.error)
            .setTitle('❌ Hata')
            .setDescription('Komut çalıştırılırken bir hata oluştu.')
            .setTimestamp();
            
        message.reply({ embeds: [errorEmbed] });
    }
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isStringSelectMenu()) return;
    
    if (interaction.customId === 'setup_select') {
        const selectedValue = interaction.values[0];
        
        if (selectedValue === 'category') {
           
            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
            
            const modal = new ModalBuilder()
                .setCustomId('category_modal')
                .setTitle('Ticket Kategorisi Ayarla');
                
            const categoryInput = new TextInputBuilder()
                .setCustomId('category_id')
                .setLabel('Kategori ID')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Kategori ID\'sini girin')
                .setRequired(true);
                
            const categoryRow = new ActionRowBuilder().addComponents(categoryInput);
            modal.addComponents(categoryRow);
            
            await interaction.showModal(modal);
        }
        else if (selectedValue === 'staff_roles') {
          
            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
            
            const modal = new ModalBuilder()
                .setCustomId('staff_roles_modal')
                .setTitle('Yetkili Rolleri Ayarla');
                
            const rolesInput = new TextInputBuilder()
                .setCustomId('staff_roles')
                .setLabel('Rol ID\'leri (virgülle ayırın)')
                .setStyle(TextInputStyle.Paragraph)
                .setPlaceholder('123456789, 987654321, 456789123')
                .setRequired(true);
                
            const rolesRow = new ActionRowBuilder().addComponents(rolesInput);
            modal.addComponents(rolesRow);
            
            await interaction.showModal(modal);
        }
        else if (selectedValue === 'panel_channel') {
         
            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
            
            const modal = new ModalBuilder()
                .setCustomId('panel_channel_modal')
                .setTitle('Panel Kanalı Ayarla');
                
            const channelInput = new TextInputBuilder()
                .setCustomId('panel_channel_id')
                .setLabel('Kanal ID')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('Kanal ID\'sini girin')
                .setRequired(true);
                
            const channelRow = new ActionRowBuilder().addComponents(channelInput);
            modal.addComponents(channelRow);
            
            await interaction.showModal(modal);
        }
        else if (selectedValue === 'guild_icon') {
            
            const { ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } = require('discord.js');
            
            const modal = new ModalBuilder()
                .setCustomId('guild_icon_modal')
                .setTitle('Sunucu İkonu URL\'si Ayarla');
                
            const iconInput = new TextInputBuilder()
                .setCustomId('guild_icon_url')
                .setLabel('İkon URL\'si')
                .setStyle(TextInputStyle.Short)
                .setPlaceholder('https://example.com/icon.png')
                .setRequired(true);
                
            const iconRow = new ActionRowBuilder().addComponents(iconInput);
            modal.addComponents(iconRow);
            
            await interaction.showModal(modal);
        }
    }
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    
    if (interaction.customId === 'category_modal') {
        const categoryId = interaction.fields.getTextInputValue('category_id');
        
       
        const category = interaction.guild.channels.cache.get(categoryId);
        if (!category || category.type !== 4) {
            return interaction.reply({
                content: '❌ Geçersiz kategori ID\'si!',
                ephemeral: true
            });
        }
        
        await updateSettings(interaction.guild.id, { categoryId });
        
        await interaction.reply({
            content: `✅ Ticket kategorisi ayarlandı: ${category.name}`,
            ephemeral: true
        });
    }
    else if (interaction.customId === 'staff_roles_modal') {
        const rolesInput = interaction.fields.getTextInputValue('staff_roles');
        const roleIds = rolesInput.split(',').map(id => id.trim());
        
       
        const validRoles = [];
        for (const roleId of roleIds) {
            const role = interaction.guild.roles.cache.get(roleId);
            if (role) {
                validRoles.push(roleId);
            }
        }
        
        if (validRoles.length === 0) {
            return interaction.reply({
                content: '❌ Geçerli rol bulunamadı!',
                ephemeral: true
            });
        }
        
        await updateSettings(interaction.guild.id, { staffRoles: validRoles });
        
        await interaction.reply({
            content: `✅ ${validRoles.length} yetkili rolü ayarlandı!`,
            ephemeral: true
        });
    }
    else if (interaction.customId === 'panel_channel_modal') {
        const channelId = interaction.fields.getTextInputValue('panel_channel_id');
        
        
        const channel = interaction.guild.channels.cache.get(channelId);
        if (!channel) {
            return interaction.reply({
                content: '❌ Geçersiz kanal ID\'si!',
                ephemeral: true
            });
        }
        
        await updateSettings(interaction.guild.id, { panelChannelId: channelId });
        
        await interaction.reply({
            content: `✅ Panel kanalı ayarlandı: ${channel.name}`,
            ephemeral: true
        });
    }
    else if (interaction.customId === 'guild_icon_modal') {
        const iconUrl = interaction.fields.getTextInputValue('guild_icon_url');
        
       
        try {
            new URL(iconUrl);
        } catch {
            return interaction.reply({
                content: '❌ Geçersiz URL formatı!',
                ephemeral: true
            });
        }
        
        await updateSettings(interaction.guild.id, { guildIconUrl: iconUrl });
        
        await interaction.reply({
            content: '✅ Sunucu ikonu URL\'si ayarlandı!',
            ephemeral: true
        });
    }
});


client.on('interactionCreate', async (interaction) => {
    if (!interaction.isButton()) return;
    
    if (interaction.customId === 'create_ticket') {
        const userId = interaction.user.id;
        const guildId = interaction.guild.id;
        
       
        const settings = await getSettings(guildId);
        if (!settings) {
            return interaction.reply({
                content: '❌ Sunucu ayarları yüklenemedi!',
                ephemeral: true
            });
        }
        
        
        const userTickets = await getUserTickets(userId, guildId);
        
        if (userTickets.length >= settings.maxTicketsPerUser) {
            return interaction.reply({
                content: '❌ Maksimum ticket sayısına ulaştınız!',
                ephemeral: true
            });
        }
        
        
        const username = interaction.user.username.replace(/[^a-zA-Z0-9]/g, ''); 
        const ticketId = `ticket-${username}-${Date.now()}`;
        const category = interaction.guild.channels.cache.get(settings.categoryId);
        
        if (!category) {
            return interaction.reply({
                content: '❌ Ticket kategorisi ayarlanmamış!',
                ephemeral: true
            });
        }
        
        try {
            const ticketChannel = await interaction.guild.channels.create({
                name: ticketId,
                type: 0, 
                parent: category.id,
                permissionOverwrites: [
                    {
                        id: interaction.guild.roles.everyone.id,
                        deny: ['ViewChannel']
                    },
                    {
                        id: userId,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory']
                    },
                    ...settings.staffRoles.map(roleId => ({
                        id: roleId,
                        allow: ['ViewChannel', 'SendMessages', 'ReadMessageHistory', 'ManageMessages']
                    }))
                ]
            });
            
           
            await createTicket({
                ticketId,
                userId,
                guildId,
                channelId: ticketChannel.id
            });
            
            
            const welcomeEmbed = new EmbedBuilder()
                .setColor(config.colors.primary)
                .setTitle('🎫 Ticket Açıldı')
                .setDescription(`Merhaba ${interaction.user}! Ticket'ınız başarıyla oluşturuldu.`)
                .addFields(
                    { name: '👤 Kullanıcı', value: `<@${userId}>`, inline: true },
                    { name: '🆔 Ticket ID', value: ticketId, inline: true },
                    { name: '📅 Oluşturulma', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
                )
                .setTimestamp();
                
            if (settings.guildIconUrl) {
                welcomeEmbed.setThumbnail(settings.guildIconUrl);
            }
            
            const { ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js');
            const closeButton = new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setCustomId('close_ticket')
                        .setLabel('Ticket\'ı Kapat')
                        .setStyle(ButtonStyle.Danger)
                        .setEmoji('🔒')
                );
                
            await ticketChannel.send({
                embeds: [welcomeEmbed],
                components: [closeButton]
            });
            
            await interaction.reply({
                content: `✅ Ticket'ınız oluşturuldu: ${ticketChannel}`,
                ephemeral: true
            });
            
        } catch (error) {
            console.error('Ticket oluşturulurken hata:', error);
            await interaction.reply({
                content: '❌ Ticket oluşturulurken bir hata oluştu!',
                ephemeral: true
            });
        }
    }
    else if (interaction.customId === 'close_ticket') {
        const ticketId = interaction.channel.name;
        const ticket = await getTicket(ticketId);
        
        if (!ticket) {
            return interaction.reply({
                content: '❌ Bu kanal bir ticket değil!',
                ephemeral: true
            });
        }
        
       
        const settings = await getSettings(interaction.guild.id);
        if (!settings) {
            return interaction.reply({
                content: '❌ Sunucu ayarları yüklenemedi!',
                ephemeral: true
            });
        }
        
       
        const hasPermission = ticket.userId === interaction.user.id || 
            settings.staffRoles.some(roleId => interaction.member.roles.cache.has(roleId));
            
        if (!hasPermission) {
            return interaction.reply({
                content: '❌ Bu ticket\'ı kapatma yetkiniz yok!',
                ephemeral: true
            });
        }
        
       
        await updateTicket(ticketId, {
            closed: true,
            closedAt: new Date(),
            closedBy: interaction.user.id
        });
        
        const closeEmbed = new EmbedBuilder()
            .setColor(config.colors.warning)
            .setTitle('🔒 Ticket Kapatıldı')
            .setDescription('Bu ticket kapatıldı ve 10 saniye sonra silinecek.')
            .addFields(
                { name: '👤 Kapatan', value: `<@${interaction.user.id}>`, inline: true },
                { name: '📅 Kapatılma', value: `<t:${Math.floor(Date.now() / 1000)}:F>`, inline: true }
            )
            .setTimestamp();
            
        await interaction.reply({ embeds: [closeEmbed] });
        
      
        setTimeout(async () => {
            try {
                await interaction.channel.delete();
            } catch (error) {
                console.error('Kanal silinirken hata:', error);
            }
        }, 10000);
    }
});


client.on('error', console.error);
process.on('unhandledRejection', console.error);


client.login(config.token);
