const fs = require("fs");
const path = require("path");
const { create } = require("xmlbuilder2");
const { addTestPlan } = require("./builders/testPlanBuilder");
const { addJSR223PreProcessor } = require("./builders/jsr223Builder");
const { addThroughputShapingTimer } = require("./builders/timerBuilder");
const { addUserDefinedVariables } = require("./builders/userDefinedVariable");
const { addViewResultsTree } = require("./builders/viewResultTree");
const { addSummaryReport } = require("./builders/summaryReport");
const {
  addThreadGroup,
  addHttpRequestDefaults,
  addHeaderManager,
  addHttpCookieManager,
  //addLoginRequest,
} = require("./threadGroup/threadGroupBuilder");
const { generateApisByTags } = require("./jsonParser/openapiParser");
const {
  addLoopControllerHttpRequest,
} = require("./threadGroup/loopControllerWithHttpRequest");

async function generateJMX(openapiFile, outputFile) {
  // create XML base
  const doc = create({ version: "1.0", encoding: "UTF-8" });

  // Add the root element <jmeterTestPlan> to the document
  const root = doc.ele("jmeterTestPlan", {
    version: "1.2",
    properties: "5.0",
    jmeter: "5.4.1",
  });

  // Add <hashTree> element user <jmeterTestPlan>
  const mainTree = root.ele("hashTree");

  // Add xml elements to the Test Plan
  const [testPlan, testPlanHashTree] = addTestPlan(mainTree);
  addJSR223PreProcessor(testPlanHashTree);
  //addThroughputShapingTimer(testPlanHashTree);
  addUserDefinedVariables(testPlanHashTree);
  addViewResultsTree(testPlanHashTree);
  addSummaryReport(testPlanHashTree);

  generateApisByTags();

  const dirPath = path.resolve(__dirname, "../openapi/thread-groups");
  const files = fs
    .readdirSync(dirPath)
    .filter((file) => file.endsWith(".json"));

  // Loop over all filtered Swagger JSONs
  for (const file of files) {
    const filePath = path.join(dirPath, file);
    const filteredData = JSON.parse(fs.readFileSync(filePath, "utf-8"));

    const tagName = file.replace("filteredApi_", "").replace(".json", "");

    // Add a new Thread Group for this API/tag
    const [threadGroup, threadGroupTree] = addThreadGroup(
      testPlanHashTree,
      tagName
    );

    // Add configs
    addHttpRequestDefaults(threadGroupTree);
    addHeaderManager(threadGroupTree);
    addHttpCookieManager(threadGroupTree);

    // Add Loop Controllers for each method/path
    for (const [pathKey, methods] of Object.entries(filteredData.paths)) {
      for (const [method, operation] of Object.entries(methods)) {
        addLoopControllerHttpRequest(
          threadGroupTree,
          pathKey,
          method,
          operation,
          filteredData.components || {}
        );
      }
    }
  }

  console.log("✅ JMX generation complete.");

  // Save to file
  const xml = doc.end({ prettyPrint: true });
  fs.writeFileSync(outputFile, xml, "utf-8");
  console.log(`✅ Generated JMeter test plan ${outputFile}`);
}

generateJMX("openapi/swagger.json", "output/swagger_test_plan.jmx").catch(
  console.error
);
