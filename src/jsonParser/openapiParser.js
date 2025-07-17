const fs = require("fs");
const path = require("path");

function generateApisByTags() {
  const swaggerJson = parseAPI("../../openapi/swagger.json");

  // Create a map of tag -> { path -> methods }
  const tagGroups = {};

  for (const [pathStr, methods] of Object.entries(swaggerJson.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      if (operation.tags && Array.isArray(operation.tags)) {
        for (const tag of operation.tags) {
          if (!tagGroups[tag]) {
            tagGroups[tag] = {};
          }

          if (!tagGroups[tag][pathStr]) {
            tagGroups[tag][pathStr] = {};
          }

          tagGroups[tag][pathStr][method] = operation;
        }
      }
    }
  }

  const outputDir = path.resolve(__dirname, "../../openapi/thread-groups");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  for (const [tag, paths] of Object.entries(tagGroups)) {
    const filteredSwagger = {
      ...swaggerJson,
      paths,
    };

    const safeTagName = tag.replace(/[^\w\-]/g, "_"); // make filename-safe
    const outputPath = path.join(outputDir, `filteredApi_${safeTagName}.json`);

    try {
      fs.writeFileSync(
        outputPath,
        JSON.stringify(filteredSwagger, null, 2),
        "utf-8"
      );
      console.log(`✅ API file for tag "${tag}" saved to: ${outputPath}`);
    } catch (err) {
      console.error(
        `❌ Failed to write API file for tag "${tag}":`,
        err.message
      );
    }
  }
}

function parseAPI(swaggerFile) {
  const fullPath = path.resolve(__dirname, swaggerFile);
  const rawData = fs.readFileSync(fullPath, "utf-8");
  return JSON.parse(rawData);
}

module.exports = { generateApisByTags };
