module.exports = {
    pollButtons(options) {
        if (options.length > 5) {
            return [
                options.slice(0, 5).map(item => ({
                    style: 1,
                    label: item.value.charAt(0).toUpperCase() + item.value.slice(1),
                    customId: item.id
                })),
    
                options.slice(5).map(item => ({
                    style: 1,
                    label: item.value.charAt(0).toUpperCase() + item.value.slice(1),
                    customId: item.id
                }))
            ];
        } else {
            return [
                options.map(item => ({
                    style: 1,
                    label: item.value.charAt(0).toUpperCase() + item.value.slice(1),
                    customId: item.id
                }))
            ];
        };
    },

    getPollButtons(currentPage, totalPages) {
        return [[
            {
                style: 1,
                label: '',
                emoji: '926318159496118322',
                customId: `get_polls_${currentPage-1}`,
                disabled: currentPage === 1
            },
            {
                style: 1,
                label: '',
                emoji: "926319433192976414",
                customId: `get_polls_${currentPage+1}`,
                disabled: currentPage === totalPages
            }
        ]]
    }
}