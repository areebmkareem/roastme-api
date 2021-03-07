const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');
const handlebars = require('handlebars');

async function createPDF(data) {
  var templateHtml = fs.readFileSync(path.join(process.cwd(), 'billing.html'), 'utf8');
  var template = handlebars.compile(templateHtml);
  var html = template(data);

  var milis = new Date();
  milis = milis.getTime();

  var pdfPath = path.join('pdf', `${data.name}-${milis}.pdf`);

  var options = {
    width: '1230px',
    headerTemplate: '<p></p>',
    footerTemplate: '<p></p>',
    displayHeaderFooter: false,
    margin: {
      top: '10px',
      bottom: '30px',
    },
    printBackground: true,
    path: pdfPath,
  };

  const browser = await puppeteer.launch({
    args: ['--no-sandbox'],
    headless: true,
  });

  var page = await browser.newPage();

  await page.goto(`data:text/html;charset=UTF-8,${html}`, {
    waitUntil: 'networkidle0',
  });

  await page.pdf(options);
  await browser.close();
}
