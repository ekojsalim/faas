const Jimp = require("jimp");

module.exports.watermarker = async (event) => {
  try {
    const { queryStringParameters } = event;
    if (!queryStringParameters || !queryStringParameters.url) {
      return { statusCode: 403 };
    }
    const imageURL = queryStringParameters.url;
    const watermarkText = queryStringParameters.text || "Watermark";
    console.log(imageURL);

    const img = await Jimp.read(imageURL);

    console.log(img);

    const font = await Jimp.loadFont(
      "https://raw.githubusercontent.com/Chman/Typogenic/master/Typogenic/Demos/00.%20Fonts/Arial/Arial.fnt"
    );
    img.print(font, 0, 0, watermarkText);

    console.log("After font", img);

    const b64 = await img.getBufferAsync(Jimp.AUTO);

    console.log(b64);

    return {
      statusCode: 200,
      body: b64,
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
