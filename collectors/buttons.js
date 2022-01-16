const { MessageEmbed } = require('discord.js');
const PollCanvas = require('../constructors/pollCanvas');
const pollDB = require('../api/poll_db');
const buttonTemplates = require('../templates/button_templates');
const embedTemplates = require('../templates/embed_templates');
const createButtons = require('../utils/createButtons');
const getPage = require('../utils/get_page');

module.exports = {
    data: {name: 'buttons'},

    async execute(interaction) {
        if (interaction.customId.includes('votes')) {
            let message 	= await interaction.channel.messages.fetch(interaction.message.id)
            let pollId 		= interaction.customId.split('_')[1]
            let pollButton 	= interaction.customId.split('_')[2]
            let pollData 	= await pollDB.getPoll(interaction.guild.id, pollId)
            let userVotes 	= pollData.users[interaction.user.id]
                              ? pollData.users[interaction.user.id].votes
                              : []

            /** Verifies user has not exceeded maxvote count */
            if (userVotes.length >= pollData.maxvote) {
                return await interaction.reply({
                    embeds: embedTemplates.invalidMaxVote(pollData.maxvote),
                    ephemeral: true
                })
            }

            pollData.votes++;
            pollData.options[pollButton].votes++
            pollData.users[interaction.user.id] = {
                votes: [
                    ...userVotes, 
                    pollData.options[pollButton].value]
            }
            
            pollDB.updatePoll(interaction.guild.id, pollData)
            
            /** Fetches new Canvas image */
            let channel = await interaction.client.channels.fetch("884189747906506825")
            const msg 	= await channel.send({files: [await new PollCanvas(pollData).renderPollCanvas()]})
            const url 	= msg.attachments.first()?.url ?? '';
                        
            await message.edit({ 
                embeds: [new MessageEmbed().setImage(url)],
                components: createButtons(buttonTemplates.pollButtons(pollData.options))
            });

            await interaction.update("\u200B")

            return
        }

        if (interaction.customId.includes('get_polls')) {
            /** Filters results based on user input */
            let filter = interaction.message.embeds[0].description
                       ? interaction.message.embeds[0].description.split(': ')[1]
                       : null

            let pageNumber 	= parseInt(interaction.customId.split('_')[2])
            let page 		= await getPage(pageNumber, 5, interaction.guild.id, filter)

            return interaction.update({
                embeds: embedTemplates.getPolls(pageNumber, page, interaction.guild, filter),
                components: createButtons(buttonTemplates.getPollButtons(pageNumber, page.totalPages)),
                ephemeral: true
            })
        }
    }
}