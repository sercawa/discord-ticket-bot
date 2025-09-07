const { EmbedBuilder, StringSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const config = require('../config.json');

module.exports = {
    data: {
        name: 'kur',
        description: 'Ticket sistemi kurulum menüsü'
    },
    async execute(message, args, client) {
        
        if (!message.member.permissions.has('Administrator')) {
            const errorEmbed = new EmbedBuilder()
                .setColor(config.colors.error)
                .setTitle('❌ Yetki Hatası')
                .setDescription('Bu komutu kullanmak için **Yönetici** yetkisine sahip olmalısınız!')
                .setTimestamp();
                
            return message.reply({ embeds: [errorEmbed] });
        }

        const setupEmbed = new EmbedBuilder()
            .setColor(config.colors.primary)
            .setTitle('🔧 Ticket Sistemi Kurulumu')
            .setDescription('Aşağıdaki menüden ticket sisteminizi yapılandırmak istediğiniz ayarı seçin:')
            .addFields(
                { name: '📁 Kategori', value: 'Ticket\'ların oluşturulacağı kategori', inline: true },
                { name: '👥 Yetkili Rolleri', value: 'Ticket\'larla ilgilenebilecek roller', inline: true },
                { name: '📋 Panel Kanalı', value: 'Ticket panelinin gönderileceği kanal', inline: true },
                { name: '🖼️ Sunucu İkonu', value: 'Panel ve ticket\'larda görünecek ikon', inline: true }
            )
            .setFooter({ text: 'Her ayar için ayrı ayrı modal açılacaktır.' })
            .setTimestamp();

        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('setup_select')
            .setPlaceholder('Kurulum ayarını seçin...')
            .addOptions([
                {
                    label: '📁 Ticket Kategorisi',
                    description: 'Ticket\'ların oluşturulacağı kategoriyi ayarla',
                    value: 'category',
                    emoji: '📁'
                },
                {
                    label: '👥 Yetkili Rolleri',
                    description: 'Ticket\'larla ilgilenebilecek rolleri ayarla',
                    value: 'staff_roles',
                    emoji: '👥'
                },
                {
                    label: '📋 Panel Kanalı',
                    description: 'Ticket panelinin gönderileceği kanalı ayarla',
                    value: 'panel_channel',
                    emoji: '📋'
                },
                {
                    label: '🖼️ Sunucu İkonu',
                    description: 'Panel ve ticket\'larda görünecek ikonu ayarla',
                    value: 'guild_icon',
                    emoji: '🖼️'
                }
            ]);

        const row = new ActionRowBuilder().addComponents(selectMenu);

        await message.reply({
            embeds: [setupEmbed],
            components: [row]
        });
    }
};
