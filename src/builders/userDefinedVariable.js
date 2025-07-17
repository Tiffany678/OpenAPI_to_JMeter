function addUserDefinedVariables(parent) {
  const args = parent.ele("Arguments", {
    guiclass: "ArgumentsPanel",
    testclass: "Arguments",
    testname: "User Defined Variables",
    enabled: "true",
  });

  const collection = args.ele("collectionProp", {
    name: "Arguments.arguments",
  });

  const variables = [
    {
      name: "host",
      value: "${url_server_perf}:${url_server_perf_port}",
    },
    {
      name: "password",
      value: "password",
    },
    {
      name: "username",
      value: "username",
    },
  ];

  for (const variable of variables) {
    const el = collection.ele("elementProp", {
      name: variable.name,
      elementType: "Argument",
    });

    el.ele("stringProp", { name: "Argument.name" }).txt(variable.name).up();
    el.ele("stringProp", { name: "Argument.value" }).txt(variable.value).up();
    el.ele("stringProp", { name: "Argument.metadata" }).txt("=").up();
  }

  // Add the corresponding <hashTree/> (empty for now)
  parent.ele("hashTree");
}

module.exports = { addUserDefinedVariables };
