# Discord.js v14 Ticket Bot

<div align="center">

![Discord.js](https://img.shields.io/badge/Discord.js-v14-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![PM2](https://img.shields.io/badge/PM2-2B037A?style=for-the-badge&logo=pm2&logoColor=white)

**Modern ve kapsamlı bir Discord ticket botu**

*MongoDB veritabanı kullanır ve PM2 ile yönetilir*

[![GitHub stars](https://img.shields.io/github/stars/sercawa/discord-ticket-bot?style=social)](https://github.com/sercawa/discord-ticket-bot/stargazers)
[![GitHub forks](https://img.shields.io/github/forks/sercawa/discord-ticket-bot?style=social)](https://github.com/sercawa/discord-ticket-bot/network)
[![GitHub issues](https://img.shields.io/github/issues/sercawa/discord-ticket-bot)](https://github.com/sercawa/discord-ticket-bot/issues)
[![GitHub license](https://img.shields.io/github/license/sercawa/discord-ticket-bot)](https://github.com/sercawa/discord-ticket-bot/blob/main/LICENSE)
[![GitHub release](https://img.shields.io/github/v/release/sercawa/discord-ticket-bot)](https://github.com/sercawa/discord-ticket-bot/releases)

**Geliştirici:** [Sercawa](https://github.com/sercawa)

</div>

## 🚀 Özellikler
r
- **MongoDB Veritabanı**: Güvenilir ve ölçeklenebilir veri saklama
- **PM2 Desteği**: Otomatik yeniden başlatma ve log yönetimi
- **Kurulum Sistemi**: Kolay kurulum için select menü ve modal sistemi
- **Yetkili Yönetimi**: Birden fazla yetkili rolü desteği
- **Ticket Paneli**: Güzel ve kullanıcı dostu ticket paneli
- **Otomatik Kapatma**: Ticket'lar otomatik olarak kapatılır ve silinir
- **Özelleştirilebilir**: Config.json ile kolay yapılandırma

## 📋 Gereksinimler

- Node.js v16.9.0 veya üzeri
- MongoDB (yerel veya cloud)
- Discord Bot Token

## 🛠️ Kurulum

1. **Bağımlılıkları yükleyin:**
```bash
npm install
```

2. **MongoDB'yi başlatın:**
```bash
# Yerel MongoDB için
mongod

# Veya MongoDB Atlas kullanın
```

3. **Config.json dosyasını düzenleyin:**
```json
{
  "token": "BOT_TOKENINIZ",
  "guildId": "SUNUCU_ID",
  "mongodb": {
    "uri": "mongodb://localhost:27017/ticketbot"
  }
}
```

4. **Botu başlatın:**
```bash
# Normal başlatma
npm start

# PM2 ile başlatma
npm run pm2

# Geliştirme modu
npm run dev
```

## 🎮 Komutlar

### `.kur`
Ticket sistemi kurulum menüsü. Sadece yöneticiler kullanabilir.

**Özellikler:**
- Ticket kategorisi ayarlama
- Yetkili rolleri belirleme
- Panel kanalı ayarlama
- Sunucu ikonu URL'si ayarlama

### `.ticketpanel`
Ticket yardım panelini oluşturur. Sadece yetkili kullanıcı (ID: 504355598427488260) kullanabilir.

**Özellikler:**
- Güzel embed tasarımı
- Ticket oluştur butonu
- Belirtilen kanala otomatik gönderim

## 🔧 Yapılandırma

### Config.json Ayarları

```json
{
  "token": "Bot token'ınız",
  "guildId": "Sunucu ID'niz",
  "prefix": ".",
  "mongodb": {
    "uri": "MongoDB bağlantı string'i"
  },
  "botSettings": {
    "activity": {
      "type": "PLAYING",
      "name": "Ticket Sistemi"
    },
    "status": "online"
  },
  "colors": {
    "primary": "#5865F2",
    "success": "#57F287",
    "error": "#ED4245",
    "warning": "#FEE75C"
  }
}
```

### Activity Türleri
- `PLAYING` - Oynuyor
- `WATCHING` - İzliyor
- `LISTENING` - Dinliyor
- `STREAMING` - Yayında

### Status Türleri
- `online` - Çevrimiçi
- `idle` - Boşta
- `dnd` - Rahatsız Etmeyin
- `invisible` - Görünmez

## 📊 PM2 Komutları

```bash
# Botu başlat
pm2 start ecosystem.config.js

# Botu durdur
pm2 stop ticket-bot

# Botu yeniden başlat
pm2 restart ticket-bot

# Logları görüntüle
pm2 logs ticket-bot

# Bot durumunu kontrol et
pm2 status
```

## 🗄️ Veritabanı Yapısı

### Tickets Koleksiyonu
```javascript
{
  ticketId: String,
  userId: String,
  guildId: String,
  channelId: String,
  createdAt: Date,
  closed: Boolean,
  closedAt: Date,
  closedBy: String
}
```

### Settings Koleksiyonu
```javascript
{
  guildId: String,
  categoryId: String,
  staffRoles: [String],
  panelChannelId: String,
  guildIconUrl: String,
  maxTicketsPerUser: Number
}
```

## 🎯 Kullanım

1. **Kurulum:**
   - `.kur` komutunu çalıştırın
   - Select menüden ayarları yapılandırın

2. **Panel Oluşturma:**
   - `.ticketpanel` komutunu çalıştırın
   - Panel belirtilen kanala gönderilir

3. **Ticket Açma:**
   - Kullanıcılar paneldeki butona tıklar
   - Otomatik olarak özel kanal oluşturulur

4. **Ticket Kapatma:**
   - Ticket sahibi veya yetkili roller kapatabilir
   - 10 saniye sonra kanal otomatik silinir

## 🔒 Güvenlik

- Sadece yetkili kullanıcılar komutları kullanabilir
- Ticket'lar özel kanallarda oluşturulur
- Yetki kontrolü her işlemde yapılır
- MongoDB bağlantısı güvenli şekilde yönetilir

## 📝 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🤝 Katkıda Bulunma

1. Bu projeyi fork yapın
2. Feature branch oluşturun (`git checkout -b feature/AmazingFeature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add some AmazingFeature'`)
4. Branch'inizi push edin (`git push origin feature/AmazingFeature`)
5. Pull Request oluşturun

## 📞 Destek & İletişim

Herhangi bir sorun yaşarsanız veya öneriniz varsa:

- 🐛 **Bug Report:** [GitHub Issues](https://github.com/sercawa/discord-ticket-bot/issues)
- 💡 **Feature Request:** [GitHub Discussions](https://github.com/sercawa/discord-ticket-bot/discussions)
- 📧 **İletişim:** [GitHub Profile](https://github.com/sercawa)

## ⭐ Projeyi Beğendiyseniz

Bu projeyi beğendiyseniz lütfen ⭐ yıldız vererek destek olun!

## 🎯 Geliştirici

**Sercawa** - Discord Bot Geliştiricisi

- GitHub: [@sercawa](https://github.com/sercawa)
- Projeler: [GitHub Profilim](https://github.com/sercawa)

---

<div align="center">

**⭐ Bu projeyi beğendiyseniz yıldız vermeyi unutmayın! ⭐**

*Bu bot Discord.js v14 kullanır ve modern Discord API özelliklerini destekler.*

**Geliştirici:** [Sercawa](https://github.com/sercawa) | **Lisans:** MIT

</div>
