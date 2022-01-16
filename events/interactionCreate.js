const { MessageEmbed } = require('discord.js');
const PollCanvas = require('../constructors/pollCanvas');
const pollDB = require('../api/poll_db')
const buttonTemplates = require('../templates/button_templates')
const embedTemplates = require('../templates/embed_templates');
const createButtons = require('../utils/createButtons')
const getPage = require('../utils/get_page')


module.exports = {
	name: 'interactionCreate',
	once: false,
	async execute(interaction) {
		try {
			if (interaction.isCommand()) {
				const command = interaction.client.commands.get(interaction.commandName);
				if (!command) return;
				
				await command.execute(interaction);
			}
			
			if (interaction.isButton()) {
				const collector = interaction.client.collectors.get('buttons')
				if (!collector) return;
	
				await collector.execute(interaction)
			}
		} catch (err) {
			if (err.code === 50001) {
				interaction.reply({
					embeds: embedTemplates.err50001(),
					ephemeral: true
				})
			}
		}
	}
};