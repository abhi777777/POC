const PDFDocument = require("pdfkit");

function generatePDFReceipt(user, purchase) {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const buffers = [];

      // Collect the data chunks as they are generated
      doc.on("data", (data) => buffers.push(data));
      doc.on("end", () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });

      // Build the PDF content
      doc.fontSize(25).text("Policy Receipt", { align: "center" });
      doc.moveDown();
      doc.fontSize(12).text(`Date: ${new Date().toLocaleDateString()}`);
      doc.moveDown();
      doc.text(`Consumer ID: ${user.id}`);
      doc.text(`Name: ${user.name}`);
      doc.text(`Phone: ${user.phone}`);
      doc.text(`Email: ${user.email}`);
      doc.moveDown();
      doc.text(
        "You have successfully purchased the policy. Thank you for your purchase."
      );

      // End the PDF document generation
      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePDFReceipt };
