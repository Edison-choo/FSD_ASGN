var sortBy = ["res_name", "ASC"];

function sortByAZ() {
    sortBy = ["res_name", "DESC"];
    window.location.reload;
}
function sortByZA() {
    window.location.reload;
}

module.exports.sortBy = sortBy;
