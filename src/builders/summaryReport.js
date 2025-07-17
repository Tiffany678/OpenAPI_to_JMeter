function addSummaryReport(parent) {
  const resultCollector = parent.ele("ResultCollector", {
    guiclass: "SummaryReport",
    testclass: "ResultCollector",
    testname: "Summary Report",
    enabled: "true",
  });

  resultCollector
    .ele("boolProp", { name: "ResultCollector.error_logging" })
    .txt("false")
    .up();

  const objProp = resultCollector.ele("objProp");
  objProp.ele("name").txt("saveConfig").up();

  const saveConfig = objProp.ele("value", {
    class: "SampleSaveConfiguration",
  });

  const props = [
    "time",
    "latency",
    "timestamp",
    "success",
    "label",
    "code",
    "message",
    "threadName",
    "dataType",
    "encoding:false",
    "assertions",
    "subresults",
    "responseData:false",
    "samplerData:false",
    "xml:false",
    "fieldNames",
    "responseHeaders:false",
    "requestHeaders:false",
    "responseDataOnError:false",
    "saveAssertionResultsFailureMessage",
    "assertionsResultsToSave:0",
    "bytes",
    "sentBytes",
    "url",
    "threadCounts",
    "idleTime",
    "connectTime",
  ];

  for (const p of props) {
    const [tag, val = "true"] = p.split(":");
    saveConfig.ele(tag).txt(val).up();
  }

  resultCollector.ele("stringProp", { name: "filename" }).txt("").up();

  resultCollector.ele("boolProp", { name: "useGroupName" }).txt("true").up();

  // Always include a following <hashTree/>
  parent.ele("hashTree");
}

module.exports = { addSummaryReport };
