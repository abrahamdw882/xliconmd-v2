module.exports = {
    name: "add",
    aliases: ["invite"],
    description: "Add a member to the group",

    async execute(sock, m, args) {
        try {
            if (!m.isGroup) return m.reply("❌ This command works only in groups.");

            if (!args[0]) {
                return m.reply("⚠️ Example:\n.add 2348123456789");
            }

            let number = args[0].replace(/\D/g, "") + "@s.whatsapp.net";

            await sock.groupParticipantsUpdate(
                m.chat,
                [number],
                "add"
            );

            m.reply(`✅ User added: ${args[0]}`);

        } catch (err) {
            console.log(err);
            m.reply("❌ Failed to add user.");
        }
    }
};
