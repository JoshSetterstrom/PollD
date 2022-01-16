module.exports = {
    help() {
        return [{
            color: "GREEN",
            title: "__PollD Commands__",
            description: 
                "**/poll** - Creates a new poll\n" +
                "`title`: Title up to 128 characters.\n" +
                "`options`: 2 required and 4 optional up to 50 characters.\n" +
                "`image`: Image URL in jpg or png format. " +
                "Local images can be added by sending them to a discord channel, " +
                "and copying the link.\n" +
                "`maxvote`: Set number of times a user can vote.\n\n" +

                "**/getpoll** - Return an open or closed poll by its ID.\n" +
                "`pollid`: PollID assigned when a poll is created.\n\n" +

                "**/closepoll**: Closes an opened poll.\n" +
                "`pollid`: PollID assigned when a poll is created.\n\n" +

                "**/removepoll**: Removes specified poll completely.\n" +
                "`pollid`: PollID assigned when a poll is created.\n\n" +

                "**/getlist**: Returns a list of all polls.\n" +
                "`title`: filter search by title name\n\n"  
        }];
    },

    err50001() {
        return [{
            color: "GREEN",
            title: "PollD does not have acces to post in this channel."
        }]
    },

    invalidPollTitle(length) {
        return [{
            color: "GREEN",
            title: "Titles are limited to 128 characters.",
            description: 
                `**This title is **${length}** characters long.\n\n` +
                "Limits are in place for consistency and readbility. " +
                "If you need a longer title, set the `limit` option to false."
        }];
    },

    invalidPollOption(length, num) {
        return [{
            color: "GREEN",
            title: "Options are limited to 48 characters.",
            description: 
                `**Option ${parseInt(num)+1}** is **${length}** characters long.`
        }];
    },

    invalidPollId(pollId) {
        return [{
            color: "GREEN",
            title: `Unable to find Poll ${pollId}`,
        }]
    },

    invalidPollStatus(id) {
        return [{
            color: "GREEN",
            title: `Poll ${id} has already been closed.`,
        }]
    },

    invalidImageUrl() {
        return [{
            color: "GREEN",
            title: "The image provided is not a supported format.",
            description: 
                "Local images can be added by sending them to a discord channel, " +
                "copying the link, and using the link in the `image` parameter."
        }];
    },

    invalidMaxVote(maxVote) {
        return [{
            color: "GREEN",
            title: 
                'You have voted too many times. You may only vote ' +
                `${maxVote} time${maxVote === 1 ? "" : "s"} for this poll.`
        }]
    },

    poll(url) {
        return [{
            color: "GREEN",
            image: {url: url}
        }];
    },

    pollValidation(id) {
        return [{
            color: "GREEN",
            title: `Poll ${id} has been created.`,
            description: "You can close this poll by using **/closepoll** `pollid` " + id
        }];
    },

    closeValidation(id) {
        return [{
            color: "GREEN",
            title: `Poll ${id} has been closed.`
        }]
    },

    removeValidation(id) {
        return [{
            color: "GREEN",
            title: `Poll ${id} has been removed.`
        }]
    },

    refreshValidation(id) {
        return [{
            color: "GREEN",
            title: `Poll ${id} refreshed.`
        }]
    },

    getPolls(pageNumber, page, guild, filter) {
        return [{
            color: "GREEN",
            title: `${page.totalPolls} Poll${page.totalPolls===1?"":"s"} in ${guild}.`,
            description: `${filter ? `\n**Filter**: ${filter}` : ""}`,
            fields: [
                {
                    name: "**__Open Polls__**",
                    value: page.open.length !== 0
                         ? page.open.join('\n')
                         : "\u200B",
                    inline: true
                },
                {
                    name: "\u200B",
                    value: "\u200B",
                    inline: true
                },
                {
                    name: "**__Closed Polls__**",
                    value: page.closed.length !== 0
                         ? page.closed.join('\n')
                         : "\u200B",
                    inline: true
                }
            ],
            footer: {text: `Page ${pageNumber} of ${page.totalPages}`}
        }]
    }
};