const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const PollCanvas = require('../constructors/pollCanvas');
const { img_channel } = require('../config.json');
const pollDB = require('../api/poll_db');
const buttonTemplates = require('../templates/button_templates');
const createButtons = require('../utils/createButtons');
const verifyPollId = require('../verification/verify_poll_id');
const embedTemplates = require('../templates/embed_templates');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('getpoll')
        .setDescription('Retrieves specified poll.')
        .addStringOption(option => option
            .setName('pollid')
            .setDescription('PollID')
            .setRequired(true)),


    async execute(interaction) {
        let pollId = interaction.options.data[0].value;
        let pollData = await pollDB.getPoll(interaction.guild.id, pollId);

        if (!verifyPollId(pollData)) return;

        interaction.channel.messages.fetch(pollData.messageId)
            .then(m => m.delete())
            .catch(() => console.log("Unable to retrieve old message."));

        let imageRepository = await interaction.client.channels.fetch(img_channel);

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
        const msg = await imageRepository.send({
            files: [await new PollCanvas(pollData).renderPollCanvas()]
        });
        const url = msg.attachments.first()?.url ?? '';


        if (pollData.status === "open") {
            var newMessage = await interaction.channel.send({ 
                embeds: [new MessageEmbed().setImage(url)],
                components: createButtons(buttonTemplates.pollButtons(pollData.options))
            });
        } else {
            var newMessage = await interaction.channel.send({ 
                files: [url]
            });
        };

        pollData.messageId = newMessage.id;

        pollDB.updatePoll(interaction.guild.id, pollData);
                    

        await interaction.reply({
            embeds: embedTemplates.refreshValidation(pollId),
            ephemeral: true
        });
    }
};