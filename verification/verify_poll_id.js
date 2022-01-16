const embedTemplates = require('../templates/embed_templates');

module.exports = function verifyCanvas(pollData) {
    if (!pollData) {
        interaction.reply({
            embeds: embedTemplates.invalidPollId(pollData.id),
            ephemeral: true
        });

        return false;
    };

    return true;
};