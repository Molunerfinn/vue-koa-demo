import $ from "jquery"

const m_debug = true

const Log = {
  tlog: function(logFlag, logStr) {
    // if (/log/.test(g_config.testCMD)) {
    //   HdGame.logStd(logFlag, logStr)
    // }
    this._log(logFlag, logStr)
  },
  tlogErr: function(logFlag, logStr) {
    this._log(logFlag, logStr, true)
  },
  _log: function(logFlag, logStr, isErr) {
    if (!m_debug) {
       return
    }

    let s = logFlag+':'+logStr
    $('#debugMsg').html( s )
  }
}

export default Log
