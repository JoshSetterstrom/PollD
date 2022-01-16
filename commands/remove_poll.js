const {SlashCommandBuilder} = require('@discordjs/builders');
const pollDB = require('../api/poll_db');
const embedTemplates = require('../templates/embed_templates')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('removepoll')
        .setDescription('Removes a specified poll completely. Removed polls cannot be searched for or refreshed.')
        .addStringOption(option => option
            .setName('pollid')
            .setDescription('PollID.')
            .setRequired(true)),



    async execute(interaction) {
        let pollId = interaction.options.data[0].value
        
        if (!await pollDB.getPoll(interaction.guild.id, pollId)) {
            return interaction.reply({
                embeds: embedTemplates.invalidPollId(pollId),
                ephemeral: true
            })
        }

        await pollDB.removePoll(interaction.guild.id, pollId)

        return interaction.reply({
            embeds: embedTemplates.removeValidation(pollId),
            ephemeral: true
        })
    }
}