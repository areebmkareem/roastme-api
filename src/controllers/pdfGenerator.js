const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

async function generatePdf(data) {
  try {
    // path.join(__dirname + '../HtmlTemplates', 'billing.html'
    var templateHtml = fs.readFileSync(path.join(process.cwd() + '/src/HtmlTemplates', 'billing.html'), 'utf8');
    var template = handlebars.compile(templateHtml);
    var html = template(data);
    const browser = await puppeteer.launch({
      ignoreDefaultArgs: ['--disable-extensions'],
      args: ['--no-sandbox', '--disable-setuid-sandbox'],
      headless: true,
    });
    const page = await browser.newPage();

    await page.setContent(html, {waitUntil: 'networkidle0'});
    let fileName = new Date() + '.pdf';
    const response = await page.pdf({path: fileName, format: 'a4'});
    await browser.close();
    return fileName;
  } catch (err) {
    throw err;
  }
}

module.exports = generatePdf;
