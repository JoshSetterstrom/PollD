const {MessageActionRow, MessageButton} = require('discord.js');

/** Converts button object to MessageButton Class */
module.exports = function createButtons(componentObjects) {
    let components = [];

    componentObjects.forEach(object => {
        if (object.length === 0) return;

        let actionRow = new MessageActionRow();

        for (let component in object) {
            let destruct = object[component];
            let params = [];

            ['style', 'label', 'emoji', 'customId', 'url', 'disabled'].forEach(item => {
                if (item === "disabled") params[item] = destruct[item] ? destruct[item] : false
                else params[item] = destruct[item] ? destruct[item] : ""
            });

            actionRow.addComponents(
                new MessageButton()
                .setStyle(params['style'])
                .setLabel(params['label'])
                .setEmoji(params['emoji'])
                .setCustomId(params['customId'])
                .setURL(params['url'])
                .setDisabled(params['disabled'])
            );
        };

        components.push(actionRow);
    });

    return components;
};