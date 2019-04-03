const Log = {
  tlog: function(logFlag, logStr) {
    // if (/log/.test(g_config.testCMD)) {
    //   HdGame.logStd(logFlag, logStr)
    // }
    this.log(logFlag, logStr)
  },
  tlogErr: function(logFlag, logStr) {
    this.log(logFlag, logStr, true)
  },
  log: function(logFlag, logStr, isErr) {
    // if (!m_debug) {
    //   return
    // }

    console.log(logStr)


  }
}

export default Log
