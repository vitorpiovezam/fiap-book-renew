const puppeteer = require('puppeteer');

(async () => {
  const user = '78227'
  const password = '160499'
  
  await renewBooks(user,password);
})();

async function renewBooks(user,password) {
  const browser = await puppeteer.launch();
  
  const page = await browser.newPage();

  await page.goto('https://www2.fiap.com.br/', { waitUntil: 'networkidle2' });

  await page.focus('input[type=text]#usuario');
  await page.keyboard.type(user);

  await page.focus('input[type=password]#senha');
  await page.keyboard.type(password);

  await page.click('.a-login-btn');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.goto(
    "https://www2.fiap.com.br/programas/login/alunos_2004/biblioteca",
    { waitUntil: "networkidle2" }
  );

  await clickByText(page,'Meus Empréstimos');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.click('input.i-content-btn');

  await page.goto(
    "https://www2.fiap.com.br/programas/login/alunos_2004/biblioteca",
    { waitUntil: "networkidle2" }
  );

  await clickByText(page,'Meus Empréstimos');
  await page.waitForNavigation({ waitUntil: 'networkidle0' });

  await page.pdf({ path: 'my_books_' + getDate().toString() + '.pdf', format: 'A4' });
  await browser.close();
}

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = '0' + dd;
  } 
  if (mm < 10) {
    mm = '0' + mm;
  } 
  
  return dd + '_' + mm + '_' + yyyy;
}

const escapeXpathString = str => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
}

const clickByText = async (page, text) => {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
    
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error(`Link not found: ${text}`);
    }
}
