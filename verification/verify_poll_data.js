const embedTemplates = require('../templates/embed_templates');

module.exports = function verifyPollData(pollData) {
    if (pollData.title.length > 128) {
        interaction.reply({
            embeds: embedTemplates.failPollTitle(pollData.title.length),
            ephemeral: true
        });

        return false;
    };

    pollData.options.forEach((option, i) => {
        if (option.value.length > 48) {
            interaction.reply({
                embeds: embedTemplates.invalidPollOption(option.value.length, i),
                ephemeral: true
            }); 
            
            return false;
        };
    });

    return true;
};