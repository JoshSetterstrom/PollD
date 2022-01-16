const {SlashCommandBuilder} = require('@discordjs/builders');
const PollCanvas = require('../constructors/pollCanvas');
const pollDB = require('../api/poll_db')
const buttonTemplates = require('../templates/button_templates')
const createButtons = require('../utils/createButtons')
const dataTemplates = require('../templates/data_templates')
const embedTemplates = require('../templates/embed_templates')
const verifyPollData = require('../verification/verify_poll_data')
const verifyCanvas = require('../verification/vierfy_canvas')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Creates a new poll.')
        .addStringOption(option => option
            .setName('title')
            .setDescription('Poll title')
            .setRequired(true))
        .addStringOption(option => option
            .setName('option1')
            .setDescription('Option 1')
            .setRequired(true))
        .addStringOption(option => option
            .setName('option2')
            .setDescription('Option 2')
            .setRequired(true))
        .addStringOption(option => option
            .setName('option3')
            .setDescription('Option 3')
            .setRequired(false))
        .addStringOption(option => option
            .setName('option4')
            .setDescription('Option 4')
            .setRequired(false))
        .addStringOption(option => option
            .setName('option5')
            .setDescription('Option 5')
            .setRequired(false))
        .addStringOption(option => option
            .setName('option6')
            .setDescription('Option 6')
            .setRequired(false))
        .addStringOption(option => option
            .setName('maxvote')
            .setDescription('Set how many times a user can vote.')
            .setRequired(false))
        .addStringOption(option => option
            .setName('image')
            .setDescription('Add an image URL to include in the poll.')
            .setRequired(false)),


    async execute(interaction) {
        /** Discord channel for storing images */
        let imageRepository = await interaction.client.channels.fetch("884189747906506825")
        let pollData = dataTemplates.pollTemplate(interaction)

        if (!verifyPollData(pollData)) return
        
        let pollCanvas = await new PollCanvas(pollData).renderPollCanvas()

        if (!verifyCanvas(pollCanvas, interaction)) return

        /**
         * Sends image to imageRepository to get an image URL.
         * 
         * Poll canvas images are created, stored, then edited when updated.
         * 
         * Images must be in an embeded message or the file attachments will not update.
         * 
         * This creates a more seamless transition to the new image as opposed to
         * deleting the old message and creating a new one.
         */
        const msg = await imageRepository.send({files: [pollCanvas]})
        const url = msg.attachments.first()?.url ?? '';

        let message = await interaction.channel.send({
            embeds: embedTemplates.poll(url),
            components: createButtons(buttonTemplates.pollButtons(pollData.options))
        });

        // Saves messageId for future editing //
        pollData['messageId'] = message.id
        
        await interaction.reply({
            embeds: embedTemplates.pollValidation(pollData.id),
            ephemeral: true
        })

        pollDB.updatePoll(interaction.guild.id, pollData)
    }
}