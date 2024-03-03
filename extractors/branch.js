const GeneratorExtractor = require('./generator')
const report = require('../reports/report.json')

class BranchExtractor {
  constructor() {
    this.branch = null
  }

  getBranch(branchId) {
    let branch = null

    report.forEach(region => {
      const searchBranch = region.branches.find(branch => branch.id == branchId)
      if(searchBranch){ branch = searchBranch }
    })

    return branch;
  }

  getBranchLoad(branchId, gte, lt) {
    const branch = this.getBranch(branchId)
    const generatorExtractor = new GeneratorExtractor();
    const branchGenerators = []
    const loads = []

    branch.generators.forEach(generator => {
      const generatorLoads = generatorExtractor.getGeneratorLoad(generator, gte, lt)
      const { minLoad, maxLoad } = generatorLoads
      branchGenerators.push(generatorLoads)
      loads.push(minLoad, maxLoad)
    })

    loads.sort((a, b) => a.load - b.load)

    const minLoad = loads[0]
    const maxLoad = loads[loads.length - 1]

    const branchLoads = {
      id: branch.id,
      name: branch.name,
      minLoad,
      maxLoad,
      generators: branchGenerators,
    }

    return branchLoads
  }

  getBranchStatus(branchId, dateRange, filter) {
    const branch = this.getBranch(branchId)
    const generatorExtractor = new GeneratorExtractor();
    const branchStatusLogs = []

    branch.generators.forEach(generator => {
      const generatorStatusLogs = generatorExtractor.getGeneratorStatus(generator, dateRange, filter)
      branchStatusLogs.push(generatorStatusLogs)
    })

    return branchStatusLogs
  }
}

module.exports = BranchExtractor