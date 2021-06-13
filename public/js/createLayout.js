function tableGrid(col, row)
{
    var content = "";
    for (x = 0; x < row; x++)
    {
        content += "<tr>";
        for (y = 0; y < col; y++)
        {
            content += "<td>Hello</td>";
        }
        content += "</tr>";
    }
    $("#table-layout").html(content);
}

$(function()
{
    tableGrid(20, 20);
});
