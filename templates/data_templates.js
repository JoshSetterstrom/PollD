module.exports = {
    pollTemplate(interaction) {
        let title, maxVote, image
        let options = []
        let id = require("crypto").randomBytes(5).toString('hex')

        interaction.options.data.forEach(option => {
            if (option.name === "title") title = option.value
            if (option.name === "maxvote") maxVote = option.value
            if (option.name === "image") image = option.value
            if (option.name.includes('option')) options.push(option)
        })

        maxVote = maxVote ? parseInt(maxVote) : 1
        image = image ? image : false

        return {
            id: id,
            createdAt: 
                new Intl.DateTimeFormat(
                    'en', 
                    { dateStyle: "medium", timeStyle: "short" })
                    .format(new Date()),
            createdBy: interaction.user.id,
            image: image,
            maxvote: maxVote,
            options: (() => {
                return options.map((option, i) => ({
                    id: `votes_${id}_${i}`,
                    value: option.value,
                    votes: 0
                }))
            })(),
            status: "open",
            title: title,
            users: {},
            votes: 0
        }
    }
}