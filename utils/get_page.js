const pollDB = require('../api/poll_db');

// Rewrite this with reducers //

module.exports = async function getPage(page, maxItems, guildId, filter) {
    let openArray = [];
    let closedArray = [];
    let openPageArrays = [];
    let closedPageArrays = [];

    let polls           = await pollDB.getAllPolls(guildId);
    if (filter) polls   = polls.filter(poll => poll.title.includes(filter));
    let totalPolls      = polls.length;

    /** Separates polls based on open and closed status */
    polls.forEach(poll => {
        if (poll.status === "open") {
            openArray.push(`**Title: **${poll.title}\n**PollID: **${poll.id}\n`);
        }

        if (poll.status === "closed") {
            closedArray.push(`**Title: **${poll.title}\n**PollID: **${poll.id}\n`);
        }
    })

    while(openArray.length) openPageArrays.push(openArray.splice(0, maxItems));
    while(closedArray.length) closedPageArrays.push(closedArray.splice(0, maxItems));

    let totalPages = openPageArrays.length > closedPageArrays.length 
                   ? openPageArrays.length 
                   : closedPageArrays.length;
    totalPages     = totalPages === 0 ? 1 : totalPages;

    return {
        totalPolls: totalPolls,
        totalPages: totalPages,
        open: openPageArrays[page-1] ? openPageArrays[page-1] : [], 
        closed: closedPageArrays[page-1] ? closedPageArrays[page-1] : [],
    };
};