const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'ticketpanel',
        description: 'Ticket yardım panelini oluşturur'
    },
    async execute(message, args, client) {
        
        const authorizedUserId = '504355598427488260';
        if (message.author.id !== authorizedUserId) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Yetki Hatası')
                .setDescription('Bu komutu kullanma yetkiniz yok!')
                .setTimestamp();
                
            return message.reply({ embeds: [errorEmbed] });
        }

        
        const settings = await getSettings(message.guild.id);
        if (!settings) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Hata')
                .setDescription('Sunucu ayarları yüklenemedi!')
                .setTimestamp();
                
            return message.reply({ embeds: [errorEmbed] });
        }

      
        const panelEmbed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle(message.guild.name.toUpperCase())
            .setDescription('Başvuru için aşağıdaki butona tıklayın')
            .setTimestamp();

        
        if (settings.guildIconUrl) {
            panelEmbed.setThumbnail(settings.guildIconUrl);
        }

       
        const createTicketButton = new ButtonBuilder()
            .setCustomId('create_ticket')
            .setLabel('🎫 Ticket Oluştur')
            .setStyle(ButtonStyle.Primary)
            .setEmoji('🎫');

        const row = new ActionRowBuilder().addComponents(createTicketButton);

       
        
        const panelChannelId = settings.panelChannelId;
        
        if (!panelChannelId) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Hata')
                .setDescription('Panel kanalı ayarlanmamış! Önce `.kur` komutu ile panel kanalını ayarlayın.')
                .setTimestamp();
                
            return message.reply({ embeds: [errorEmbed] });
        }
        
        const panelChannel = message.guild.channels.cache.get(panelChannelId);
        
        if (!panelChannel) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Hata')
                .setDescription('Panel kanalı bulunamadı! Kanal silinmiş olabilir.')
                .setTimestamp();
                
            return message.reply({ embeds: [errorEmbed] });
        }

        try {
            await panelChannel.send({
                embeds: [panelEmbed],
                components: [row]
            });

            const successEmbed = new EmbedBuilder()
                .setColor(config.colors.success)
                .setTitle('✅ Başarılı')
                .setDescription(`Ticket paneli başarıyla ${panelChannel} kanalına gönderildi!`)
                .setTimestamp();

            await message.reply({ embeds: [successEmbed] });

        } catch (error) {
            console.error('Panel gönderilirken hata:', error);
            
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Hata')
                .setDescription('Panel gönderilirken bir hata oluştu!')
                .setTimestamp();
                
            await message.reply({ embeds: [errorEmbed] });
        }
    }
};
