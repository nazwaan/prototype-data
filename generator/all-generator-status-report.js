const report = require('../reports/report.json')
const { writeFile } = require('../helpers')

const branchReport = {
  branchCount: 0,
  generatorCount: 0,
  issueCount: 0,
  stoppedWithIssueCount: 0,
  runningWithIssueCount: 0,
  stoppedWithIssue: [],
  runningWithIssue: [],
  branches: [],
};

report.forEach(region => {
  region.branches.forEach(branch => {
    branchReport.branchCount++

    const branchMod = {
      id: branch.id,
      name: branch.name,
      generators: [],
    }

    const stoppedIssueBranchMod = {
      id: branch.id,
      name: branch.name,
      generators: [],
    }

    const runningIssueBranchMod = {
      id: branch.id,
      name: branch.name,
      generators: [],
    }

    branch.generators.forEach(generator => {
      branchReport.generatorCount++
      const statusLog = generator.statusLogs[generator.statusLogs.length - 1]

      const generatorReport = {
        id: generator.id,
        branchId: generator.branchId,
        name: generator.name,
        brand: generator.brand,
        model: generator.model,
        serialNumber: generator.serialNumber,
        statusLog,
      }

      if(statusLog.state == 'stopped' && statusLog.status == "issues") {
        stoppedIssueBranchMod.generators.push(generatorReport)
        branchReport.issueCount++
        branchReport.stoppedWithIssueCount++
      }

      if(statusLog.state == 'running' && statusLog.status == "issues") {
        runningIssueBranchMod.generators.push(generatorReport)
        branchReport.issueCount++
        branchReport.runningWithIssueCount++
      }
      branchMod.generators.push(generatorReport)
    })

    if(stoppedIssueBranchMod.generators.length) {
      branchReport.stoppedWithIssue.push(stoppedIssueBranchMod);
    }

    if(runningIssueBranchMod.generators.length) {
      branchReport.runningWithIssue.push(runningIssueBranchMod);
    }

    branchReport.branches.push(branchMod);
  })
})

writeFile(branchReport, './reports/all-generator-status-report.json');