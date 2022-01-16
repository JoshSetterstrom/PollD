const embedTemplates = require('../templates/embed_templates');

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
				const collector = interaction.client.collectors.get('buttons');
				if (!collector) return;
	
				await collector.execute(interaction);
			}
		} catch (err) {
			if (err.code === 50001) {
				interaction.reply({
					embeds: embedTemplates.err50001(),
					ephemeral: true
				});
			};
		};
	}
};