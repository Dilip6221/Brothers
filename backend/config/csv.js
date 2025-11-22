const { Parser } = require("json2csv");

const exportToCSV = (res, fileName, fields, data) => {
    try {
        const json2csv = new Parser({ fields });
        const csv = json2csv.parse(data);
        res.setHeader("Content-Type", "text/csv");
        res.setHeader("Content-Disposition", `attachment; filename=${fileName}.csv`);
        return res.status(200).end(csv);
    } catch (err) {
        return res.status(500).json({
            success: false,
            message: "CSV Export Failed",
            error: err.message
        });
    }
};

module.exports = exportToCSV;
