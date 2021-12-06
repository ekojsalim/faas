const puppeteer = require("puppeteer-core");
const chrome = require("chrome-aws-lambda");

module.exports.screenshotter = async (event) => {
  try {
    const { queryStringParameters } = event;
    if (
      !queryStringParameters ||
      !queryStringParameters.url
    ) {
      return { statusCode: 403 };
    }

    const { url } = queryStringParameters;
    const [width, height] = queryStringParameters.screen
      ? queryStringParameters.screen.split(",")
      : "1280,720";

    const browser = await puppeteer.launch({
      executablePath: await chrome.executablePath,
      args: chrome.args,
    });

    const page = await browser.newPage();
    await page.setViewport({
      width: Number(width),
      height: Number(height),
    });

    await page.goto(url);
    const screenshot = await page.screenshot({ encoding: "base64" });

    return {
      statusCode: 200,
      body: screenshot,
      isBase64Encoded: true,
      headers: {
        "Content-Type": "image/png",
      },
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e }),
    };
  }
};
