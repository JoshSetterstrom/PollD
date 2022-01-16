const deployCommandsSingle = require('../deploy-commands-single')

module.exports = {
	name: 'guildCreate',
	once: true,
	execute(guild) {
		deployCommandsSingle(guild.id)
	}
};