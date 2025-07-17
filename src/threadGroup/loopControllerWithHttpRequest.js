const { create } = require("xmlbuilder2");

/**
 * Helper to convert OpenAPI path to JMeter-compatible path with ${}
 */
function parameterizePath(apiPath) {
  const cleanPath = apiPath.replace(/{([^}]+)}/g, (_, p1) => `\${${p1}}`);
  return `/v2/${cleanPath.replace(/^\/+/, "")}`;
}
// function parameterizePath(apiPath) {
//   const cleanPath = apiPath.replace(/{([^}]+)}/g, () => {
//     const randomValue = Math.floor(Math.random() * 5) + 1; // Random number 1-5
//     return randomValue.toString();
//   });

//   return `/v2/${cleanPath.replace(/^\/+/, "")}`;
// }
/**
 * Adds a LoopController with a HeaderManager and HTTPSamplerProxy to the parent
 */
function addLoopControllerHttpRequest(
  parent,
  path,
  method,
  operation,
  components
) {
  const parameterizedPath = parameterizePath(path);
  const methodUpper = method.toUpperCase();
  const loopName = `${path} ${methodUpper}`;
  const samplerName = operation.operationId;
  const comment = operation.summary;

  // // Extract body schema if exists
  let bodyJson = "{}";
  const reqBody = operation.requestBody?.content?.["application/json"]?.schema;
  if (reqBody && reqBody.$ref) {
    const refName = reqBody.$ref.split("/").pop(); // e.g. CustomViewNodeIDGetResource
    const schema = components?.schemas?.[refName];
    if (schema) {
      bodyJson = generateRequestBodyFromSchema(schema);
    }
  }

  function generateRequestBodyFromSchema(schema, indent = 2) {
    const result = {};

    for (const [key, prop] of Object.entries(schema.properties || {})) {
      if (prop.type === "array") {
        result[key] = [`\${${key}_value}`];
      } else if (prop.type === "string") {
        result[key] = `\${${key}_value}`;
      } else if (prop.type === "integer" || prop.type === "number") {
        result[key] = `\${${key}_int}`;
      } else if (prop.type === "boolean") {
        result[key] = `\${${key}_bool}`;
      } else if (prop.type === "object") {
        result[key] = {};
      } else {
        result[key] = `\${${key}_raw}`;
      }
    }

    return JSON.stringify(result, null, indent);
  }

  // 1. Loop Controller
  const loop = parent.ele("LoopController", {
    guiclass: "LoopControlPanel",
    testclass: "LoopController",
    testname: loopName,
    enabled: "true",
  });
  loop
    .ele("boolProp", { name: "LoopController.continue_forever" })
    .txt("false")
    .up();
  loop.ele("stringProp", { name: "LoopController.loops" }).txt("1").up();
  const loopTree = parent.ele("hashTree");

  // 2. Header Manager
  const header = loopTree.ele("HeaderManager", {
    guiclass: "HeaderPanel",
    testclass: "HeaderManager",
    testname: "HTTP Header Manager",
    enabled: "true",
  });
  const headers = header.ele("collectionProp", {
    name: "HeaderManager.headers",
  });
  const headerProp = headers.ele("elementProp", {
    name: "",
    elementType: "Header",
  });
  headerProp
    .ele("stringProp", { name: "Header.name" })
    .txt("Content-Type")
    .up();
  headerProp
    .ele("stringProp", { name: "Header.value" })
    .txt("application/json")
    .up();
  loopTree.ele("hashTree");

  // 3. HTTP Sampler
  const sampler = loopTree.ele("HTTPSamplerProxy", {
    guiclass: "HttpTestSampleGui",
    testclass: "HTTPSamplerProxy",
    testname: samplerName,
    enabled: "true",
  });
  sampler.ele("boolProp", { name: "HTTPSampler.postBodyRaw" }).txt("true").up();

  const argumentsProp = sampler.ele("elementProp", {
    name: "HTTPsampler.Arguments",
    elementType: "Arguments",
  });
  const argumentCollection = argumentsProp.ele("collectionProp", {
    name: "Arguments.arguments",
  });
  const arg = argumentCollection.ele("elementProp", {
    name: "",
    elementType: "HTTPArgument",
  });
  arg.ele("boolProp", { name: "HTTPArgument.always_encode" }).txt("false").up();
  arg
    .ele("stringProp", { name: "Argument.value" })
    .txt(bodyJson || "{}")
    .up();
  arg.ele("stringProp", { name: "Argument.metadata" }).txt("=").up();

  sampler
    .ele("stringProp", { name: "HTTPSampler.domain" })
    .txt("${url_server_perf}")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.port" })
    .txt("${url_server_perf_port}")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.protocol" })
    .txt("${scheme}")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.contentEncoding" })
    .txt("UTF-8")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.path" })
    .txt(parameterizedPath)
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.method" })
    .txt(methodUpper)
    .up();
  sampler
    .ele("boolProp", { name: "HTTPSampler.follow_redirects" })
    .txt("true")
    .up();
  sampler
    .ele("boolProp", { name: "HTTPSampler.auto_redirects" })
    .txt("false")
    .up();
  sampler
    .ele("boolProp", { name: "HTTPSampler.use_keepalive" })
    .txt("true")
    .up();
  sampler
    .ele("boolProp", { name: "HTTPSampler.DO_MULTIPART_POST" })
    .txt("false")
    .up();
  sampler
    .ele("boolProp", { name: "HTTPSampler.BROWSER_COMPATIBLE_MULTIPART" })
    .txt("true")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.embedded_url_re" })
    .txt("")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.connect_timeout" })
    .txt("")
    .up();
  sampler
    .ele("stringProp", { name: "HTTPSampler.response_timeout" })
    .txt("")
    .up();
  sampler.ele("stringProp", { name: "TestPlan.comments" }).txt(comment).up();

  // 4. HTTP Sampler hashTree
  const samplerTree = loopTree.ele("hashTree");

  // 5. Response Assertion
  const assertion = samplerTree.ele("ResponseAssertion", {
    guiclass: "AssertionGui",
    testclass: "ResponseAssertion",
    testname: "Response 200",
    enabled: "true",
  });
  const testStrings = assertion.ele("collectionProp", {
    name: "Asserion.test_strings",
  });
  testStrings.ele("stringProp", { name: "49586" }).txt("200").up();
  assertion
    .ele("stringProp", { name: "Assertion.custom_message" })
    .txt("")
    .up();
  assertion
    .ele("stringProp", { name: "Assertion.test_field" })
    .txt("Assertion.response_code")
    .up();
  assertion
    .ele("boolProp", { name: "Assertion.assume_success" })
    .txt("false")
    .up();
  assertion.ele("intProp", { name: "Assertion.test_type" }).txt("16").up();
  samplerTree.ele("hashTree");

  // 6. Constant Timer
  const timer = samplerTree.ele("ConstantTimer", {
    guiclass: "ConstantTimerGui",
    testclass: "ConstantTimer",
    testname: "Constant Timer",
    enabled: "true",
  });
  timer.ele("stringProp", { name: "ConstantTimer.delay" }).txt("500").up();
  samplerTree.ele("hashTree");
}

module.exports = { addLoopControllerHttpRequest };
