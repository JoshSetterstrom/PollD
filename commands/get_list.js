const {SlashCommandBuilder} = require('@discordjs/builders');
const buttonTemplates = require('../templates/button_templates');
const embedTemplates = require('../templates/embed_templates');
const createButtons = require('../utils/createButtons');
const getPage = require('../utils/get_page');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getlist')
        .setDescription('Returns a list of polls in your guild.')
        .addStringOption(option => option
            .setName('title')
            .setDescription('.')
            .setRequired(false)),


    async execute(interaction) {
        let filter = interaction.options.data[0]
                   ? interaction.options.data[0].value
                   : null;
        let page   = await getPage(1, 5, interaction.guild.id, filter);

        return interaction.reply({
            embeds: embedTemplates.getPolls(1, page, interaction.guild, filter),
            components: createButtons(buttonTemplates.getPollButtons(1, page.totalPages)),
            ephemeral: true
        });
    }
};