const embedTemplates = require('../templates/embed_templates')

module.exports = function verifyCanvas(pollCanvas, interaction) {
    // try catch for lazy workaround for mulptiple links sent in image parameter //
    try {
        if (!pollCanvas) {
            interaction.reply({
                embeds: embedTemplates.invalidImageUrl(),
                ephemeral: true
            });
    
            return false;
        };
    
        return true;
        
    } catch {
        interaction.reply({
            embeds: embedTemplates.invalidImageUrl(),
            ephemeral: true
        });

        return false;
    }
};