import { mkdir } from "fs/promises";
import { existsSync } from "fs";
import { XMLParser } from "fast-xml-parser";

const MAGNUS_TOOLSERVER = "https://magnus-toolserver.toolforge.org/commonsapi.php";

const filename = process.argv[2];
if (!filename) {
  console.error("Usage: wmc-downloader <filename>");
  process.exit(1);
}

console.log(`Processing file: ${filename}`);

// Create images directory if it doesn't exist
const imagesDir = "./images";
if (!existsSync(imagesDir)) {
  await mkdir(imagesDir, { recursive: true });
  console.log(`Created directory: ${imagesDir}`);
}

const url = `${MAGNUS_TOOLSERVER}?image=${encodeURIComponent(filename)}&versions&meta`;
console.log(`Fetching: ${url}`);

try {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  const data = await response.text();

  // Save to file
  const outputPath = `${imagesDir}/${filename}.xml`;
  await Bun.write(outputPath, data);
  
  console.log(`Data saved to: ${outputPath}`);
  
  const parser = new XMLParser();
  const result = parser.parse(data);
  
  // Extract file URL from parsed XML
  const fileUrl = result?.response?.file?.urls?.file;
  
  if (fileUrl) {
    console.log(`\nImage URL: ${fileUrl}`);
    
    // Download the image
    console.log("Downloading image...");
    const imageResponse = await fetch(fileUrl);
    
    if (!imageResponse.ok) {
      throw new Error(`Failed to download image: ${imageResponse.status}`);
    }
    
    const imageBuffer = await imageResponse.arrayBuffer();
    const imagePath = `${imagesDir}/${filename}`;
    await Bun.write(imagePath, imageBuffer);
    
    console.log(`Image downloaded to: ${imagePath}`);
  } else {
    console.log("No file URL found in XML response");
  }


} catch (error) {
  console.error("Error fetching data:", error);
  process.exit(1);
}
