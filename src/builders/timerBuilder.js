// src/builders/timerBuilder.js

function addThroughputShapingTimer(parent) {
  const timer = parent.ele("kg.apc.jmeter.timers.VariableThroughputTimer", {
    guiclass: "kg.apc.jmeter.timers.VariableThroughputTimerGui",
    testclass: "kg.apc.jmeter.timers.VariableThroughputTimer",
    testname: "Throughput Shaping Timer",
    enabled: "true",
  });

  const loadProfile = timer.ele("collectionProp", { name: "load_profile" });

  // Array of 12 profiles
  const profiles = Array.from({ length: 12 }, (_, i) => {
    const idx = i + 1;
    return {
      s_rps: `\${${idx}_s_rps}`,
      e_rps: `\${${idx}_e_rps}`,
      duration: `\${${idx}_duration}`,
    };
  });

  // Add each profile
  profiles.forEach((profile, i) => {
    const innerCollection = loadProfile.ele("collectionProp", {
      name: `${Math.floor(Math.random() * 2_000_000_000) - 1_000_000_000}`, // pseudo-unique name
    });

    innerCollection
      .ele("stringProp", { name: `${(Math.random() * 1e9) | 0}` })
      .txt(profile.s_rps)
      .up();
    innerCollection
      .ele("stringProp", { name: `${(Math.random() * 1e9) | 0}` })
      .txt(profile.e_rps)
      .up();
    innerCollection
      .ele("stringProp", { name: `${(Math.random() * 1e9) | 0}` })
      .txt(profile.duration);
  });

  // Add empty <hashTree/> after timer
  parent.ele("hashTree");
}

module.exports = { addThroughputShapingTimer };
