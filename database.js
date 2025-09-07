const mongoose = require('mongoose');
const config = require('./config.json');

class Database {
    constructor() {
        this.connected = false;
    }

    async connect() {
        try {
            await mongoose.connect(config.mongodb.uri, {
                useNewUrlParser: true,
                useUnifiedTopology: true
            });
            
            this.connected = true;
            console.log('✅ MongoDB bağlantısı başarılı!');
            
            
            mongoose.connection.on('error', (err) => {
                console.error('❌ MongoDB bağlantı hatası:', err);
                this.connected = false;
            });
            
            mongoose.connection.on('disconnected', () => {
                console.log('⚠️ MongoDB bağlantısı kesildi');
                this.connected = false;
            });
            
            mongoose.connection.on('reconnected', () => {
                console.log('✅ MongoDB yeniden bağlandı');
                this.connected = true;
            });
            
        } catch (error) {
            console.error('❌ MongoDB bağlantı hatası:', error);
            this.connected = false;
        }
    }

    async disconnect() {
        try {
            await mongoose.disconnect();
            this.connected = false;
            console.log('📤 MongoDB bağlantısı kapatıldı');
        } catch (error) {
            console.error('❌ MongoDB bağlantı kapatma hatası:', error);
        }
    }

    isConnected() {
        return this.connected && mongoose.connection.readyState === 1;
    }
}

module.exports = new Database();
