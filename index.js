const puppeteer = require("puppeteer");

(async () => {
  const user = 'YOUR LOGIN GOES HERE'
  const password = 'YOUR PASSWORD GOES HERE'
  await renewBooks(user,password);
})();

async function renewBooks(rm,password) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.goto("https://www2.fiap.com.br/", { waitUntil: "networkidle2" });

  await page.focus("input[type=text]#usuario");
  await page.keyboard.type(rm);

  await page.focus("input[type=password]#senha");
  await page.keyboard.type(password);

  await page.click(".a-login-btn");
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  await page.goto(
    "https://www2.fiap.com.br/programas/login/alunos_2004/biblioteca",
    { waitUntil: "networkidle2" }
  );

  await clickByText(page,'Meus Empréstimos');
  await page.waitForNavigation({ waitUntil: "networkidle0" });

  await page.click('input.i-content-btn');
  await page.pdf({ path: "my_books.pdf", format: "A4" });

  await browser.close();
}

const escapeXpathString = str => {
    const splitedQuotes = str.replace(/'/g, `', "'", '`);
    return `concat('${splitedQuotes}', '')`;
  };

const clickByText = async (page, text) => {
    const escapedText = escapeXpathString(text);
    const linkHandlers = await page.$x(`//a[contains(text(), ${escapedText})]`);
    
    if (linkHandlers.length > 0) {
      await linkHandlers[0].click();
    } else {
      throw new Error(`Link not found: ${text}`);
    }
};