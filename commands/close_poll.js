const {SlashCommandBuilder} = require('@discordjs/builders');
const PollCanvas = require('../constructors/pollCanvas');
const pollDB = require('../api/poll_db');
const embedTemplates = require('../templates/embed_templates');
const verifyPollId = require('../verification/verify_poll_id');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('closepoll')
        .setDescription('Closes specified poll.')
        .addStringOption(option => option
            .setName('pollid')
            .setDescription('PollID.')
            .setRequired(true)),



    async execute(interaction) {
        let pollId = interaction.options.data[0].value;
        let pollData = await pollDB.getPoll(interaction.guild.id, pollId);

        if (!verifyPollId(pollData)) return;

        /** Verifies poll has not been closed already */
        if (pollData.status === "closed") {
            return interaction.reply({
                embeds: embedTemplates.invalidPollStatus(pollId),
                ephemeral: true
            });
        };

        try {interaction.channel.messages.fetch(pollData.messageId).then(m => m.delete())}
        catch {console.log("Unable to retrieve original message.")};

        pollData.status = "closed";
        pollDB.updatePoll(interaction.guild.id, pollData);

        await interaction.channel.send({
            files: [await new PollCanvas(pollData).renderPollCanvas()]
        });

        await interaction.reply({
            embeds: embedTemplates.closeValidation(pollData.id),
            ephemeral: true
        });
    }
};