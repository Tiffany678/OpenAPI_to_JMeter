function addTestPlan(parent) {
  // Add <TestPlan> under the parent <hashTree>
  const testPlan = parent.ele("TestPlan", {
    guiclass: "TestPlanGui",
    testclass: "TestPlan",
    testname: "swagger_test_plan",
    enabled: "true",
  });

  // Standard required properties
  testPlan.ele("stringProp", { name: "TestPlan.comments" }).txt("").up();
  testPlan
    .ele("boolProp", { name: "TestPlan.functional_mode" })
    .txt("false")
    .up();
  testPlan
    .ele("boolProp", { name: "TestPlan.tearDown_on_shutdown" })
    .txt("true")
    .up();
  testPlan
    .ele("boolProp", { name: "TestPlan.serialize_threadgroups" })
    .txt("true")
    .up();

  // Define user Variable block
  const userVars = testPlan.ele("elementProp", {
    name: "TestPlan.user_defined_variables",
    elementType: "Arguments",
    guiclass: "ArgumentsPanel",
    testclass: "Arguments",
    testname: "User Defined Variables",
    enabled: "true",
  });

  const collection = userVars.ele("collectionProp", {
    name: "Arguments.arguments",
  });

  testPlan
    .ele("stringProp", { name: "TestPlan.user_define_classpath" })
    .txt("")
    .up();

  // Define key-value argument entries
  const variables = [
    { name: "url_server_perf", value: "${__P(url,petstore.swagger.io)}" },
    { name: "url_server_perf_port", value: "${__P(url_port,)}" },

    { name: "threads", value: "${__P(threads,1)}" },

    { name: "scheme", value: "https" },
  ];

  //Loop and add arguments
  for (const v of variables) {
    const el = collection.ele("elementProp", {
      name: v.name,
      elementType: "Argument",
    });
    el.ele("stringProp", { name: "Argument.name" }).txt(v.name).up();
    el.ele("stringProp", { name: "Argument.value" }).txt(v.value).up();
    el.ele("stringProp", { name: "Argument.metadata" }).txt("=");
  }

  // Add a sibling <hashTree> for TestPlan children
  const testPlanTree = parent.ele("hashTree");

  // Return both nodes so they can be used by caller
  return [testPlan, testPlanTree];
}

module.exports = { addTestPlan };
