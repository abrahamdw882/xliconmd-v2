let selfMode = true;

module.exports = {
    name: 'self',
    aliases: ['selfmode'],
    
    async execute(sock, m, args) {
        if (!global.owners.includes(m.sender)) {
            return m.reply('❌ Only bot owners can use this command');
        }
        
        if (args[0] === 'on') {
            selfMode = true;
            m.reply('✅ Self mode ON - Only bot & owners can use bot');
        } 
        else if (args[0] === 'off') {
            selfMode = false;
            m.reply('✅ Self mode OFF - Everyone can use bot');
        }
        else {
            m.reply(`⚙️ Self mode: ${selfMode ? 'ON (bot & owners only)' : 'OFF (everyone)'}\n\nUse: .self on/off`);
        }
    },
    
    async onMessage(sock, m) {
        if (!selfMode) return;
        
        let botNumber = sock.user.id.split(':')[0] + '@s.whatsapp.net';
        
        if (global.owners.includes(m.sender) || m.sender === botNumber) return;
        
        if (m.body && m.body.startsWith(global.BOT_PREFIX)) {
            await m.reply('🔒 *Bot is in self mode*\nOnly bot & owners can use commands.');
            return true;
        }
    }
};
