function addJSR223PreProcessor(parent) {
  const jsr223 = parent.ele("JSR223PreProcessor", {
    guiclass: "TestBeanGUI",
    testclass: "JSR223PreProcessor",
    testname: "JSR223 PreProcessor Load Config",
    enabled: "true",
  });

  jsr223.ele("stringProp", { name: "scriptLanguage" }).txt("groovy").up();
  jsr223.ele("stringProp", { name: "parameters" }).txt("").up();
  jsr223.ele("stringProp", { name: "filename" }).txt("").up();
  jsr223.ele("stringProp", { name: "cacheKey" }).txt("true").up();

  // Add <hashTree/> as sibling (JSR223PreProcessor requires it)
  parent.ele("hashTree");
}

module.exports = { addJSR223PreProcessor };
