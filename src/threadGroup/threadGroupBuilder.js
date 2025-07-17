function addThreadGroup(parentTree, name = "API") {
  const threadGroup = parentTree.ele("ThreadGroup", {
    guiclass: "ThreadGroupGui",
    testclass: "ThreadGroup",
    testname: name,
    enabled: "true",
  });

  threadGroup
    .ele("stringProp", { name: "ThreadGroup.on_sample_error" })
    .txt("continue");

  const loopController = threadGroup.ele("elementProp", {
    name: "ThreadGroup.main_controller",
    elementType: "LoopController",
    guiclass: "LoopControlPanel",
    testclass: "LoopController",
    testname: "Loop Controller",
    enabled: "true",
  });
  loopController
    .ele("boolProp", { name: "LoopController.continue_forever" })
    .txt("false");
  loopController.ele("stringProp", { name: "LoopController.loops" }).txt("1");

  threadGroup
    .ele("stringProp", { name: "ThreadGroup.num_threads" })
    .txt("${threads}");
  threadGroup.ele("stringProp", { name: "ThreadGroup.ramp_time" }).txt("1");
  threadGroup
    .ele("longProp", { name: "ThreadGroup.start_time" })
    .txt("1370726934000");
  threadGroup
    .ele("longProp", { name: "ThreadGroup.end_time" })
    .txt("1370726934000");
  threadGroup.ele("boolProp", { name: "ThreadGroup.scheduler" }).txt("false");
  threadGroup.ele("stringProp", { name: "ThreadGroup.duration" });
  threadGroup.ele("stringProp", { name: "ThreadGroup.delay" });
  threadGroup
    .ele("boolProp", { name: "ThreadGroup.same_user_on_next_iteration" })
    .txt("false");
  threadGroup
    .ele("stringProp", { name: "TestPlan.comments" })
    .txt("${threads} T-2 rpup-180 lpc-1");

  const tgHashTree = parentTree.ele("hashTree");
  return [threadGroup, tgHashTree];
}

function addHttpRequestDefaults(parentTree) {
  const configElement = parentTree.ele("ConfigTestElement", {
    guiclass: "HttpDefaultsGui",
    testclass: "ConfigTestElement",
    testname: "HTTP Request Defaults",
    enabled: "true",
  });

  const elementProp = configElement.ele("elementProp", {
    name: "HTTPsampler.Arguments",
    elementType: "Arguments",
    guiclass: "HTTPArgumentsPanel",
    testclass: "Arguments",
    testname: "User Defined Variables",
    enabled: "true",
  });

  elementProp.ele("collectionProp", {
    name: "Arguments.arguments",
  });

  configElement
    .ele("stringProp", { name: "HTTPSampler.domain" })
    .txt("${url_server_perf}");
  configElement
    .ele("stringProp", { name: "HTTPSampler.port" })
    .txt("${url_server_perf_port}");
  configElement
    .ele("stringProp", { name: "HTTPSampler.protocol" })
    .txt("${scheme}");
  configElement
    .ele("stringProp", { name: "HTTPSampler.contentEncoding" })
    .txt("");
  configElement.ele("stringProp", { name: "HTTPSampler.path" }).txt("");
  configElement
    .ele("stringProp", { name: "HTTPSampler.concurrentPool" })
    .txt("6");
  configElement
    .ele("stringProp", { name: "HTTPSampler.connect_timeout" })
    .txt("");
  configElement
    .ele("stringProp", { name: "HTTPSampler.response_timeout" })
    .txt("");

  parentTree.ele("hashTree");
}

function addHeaderManager(parentTree) {
  const headerManager = parentTree.ele("HeaderManager", {
    guiclass: "HeaderPanel",
    testclass: "HeaderManager",
    testname: "HTTP Header Manager",
    enabled: "true",
  });

  const headers = headerManager.ele("collectionProp", {
    name: "HeaderManager.headers",
  });
  const acceptHeader = headers.ele("elementProp", {
    name: "accept",
    elementType: "Header",
  });
  acceptHeader.ele("stringProp", { name: "Header.name" }).txt("accept");
  acceptHeader
    .ele("stringProp", { name: "Header.value" })
    .txt("application/json");

  parentTree.ele("hashTree");
}
function addHttpCookieManager(parentTree) {
  const cookieManager = parentTree.ele("CookieManager", {
    guiclass: "CookiePanel",
    testclass: "CookieManager",
    testname: "HTTP Cookie Manager",
    enabled: "true",
  });

  cookieManager.ele("collectionProp", { name: "CookieManager.cookies" });
  cookieManager
    .ele("boolProp", { name: "CookieManager.clearEachIteration" })
    .txt("true");
  cookieManager
    .ele("boolProp", { name: "CookieManager.controlledByThreadGroup" })
    .txt("false");

  parentTree.ele("hashTree");
}

module.exports = {
  addThreadGroup,
  addHttpRequestDefaults,
  addHeaderManager,
  addHttpCookieManager,
};
