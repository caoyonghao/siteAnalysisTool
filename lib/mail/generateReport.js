const generateReport = (raw) => {
    let str = '';
    Object.keys(raw).forEach((el) => {
        console.log(el);
        str += `<tr>
            <td>${el}</td>
            <td>${raw[el].parent}</td>
            </tr>`;
    });
    return `<table>
        <tr>
        <th>broken link</th>
        <th>page</th>
        </tr>
        ${str}
    </table>`
}
// console.log(generateReport('./../../result/1520759784186-fail.json'))
module.exports = generateReport;