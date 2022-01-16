const {SlashCommandBuilder} = require('@discordjs/builders');
const embedTemplates = require('../templates/embed_templates');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('help')
        .setDescription('Returns a list of commands and tips.'),

    async execute(interaction) {
        return interaction.reply({
            embeds: embedTemplates.help(),
            ephemeral: true
        });
    }
};