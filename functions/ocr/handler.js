const { createWorker } = require("tesseract.js");
const path = require("path");

module.exports.ocr = async (event) => {
  try {
    const imageURL = event.queryStringParameters.url;

    const worker = createWorker({
      logger: (m) => console.log(m),
      langPath: path.join(__dirname, "tesseract/"),
      cachePath: "/tmp",
    });

    await worker.load();
    await worker.loadLanguage("eng");
    await worker.initialize("eng");

    const {
      data: { text },
    } = await worker.recognize(imageURL, "eng");

    console.log(text);

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          result: text,
        },
        null,
        2
      ),
    };
  } catch (e) {
    console.error(e);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: e }),
    };
  }
};
