const { EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'botyardimpaneli',
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
            .setTitle('🎫 Ticket Sistemi')
            .setDescription('Yardıma mı ihtiyacınız var? Aşağıdaki butona tıklayarak ticket oluşturun!')
            .addFields(
                { name: '📋 Nasıl Çalışır?', value: '• Ticket oluşturmak için aşağıdaki butona tıklayın\n• Ticket\'ınız özel bir kanalda açılacak\n• Yetkili ekip size yardımcı olacak\n• İşiniz bittiğinde ticket\'ı kapatabilirsiniz', inline: false },
                { name: '⚠️ Önemli Notlar', value: `• Kullanıcı başına maksimum **${settings.maxTicketsPerUser}** ticket açabilirsiniz\n• Ticket\'lar sadece sizin ve yetkili ekibin görebileceği özel kanallardır\n• Gereksiz ticket açmayın`, inline: false }
            )
            .setFooter({ text: 'Ticket sistemi otomatik olarak yönetilir' })
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
