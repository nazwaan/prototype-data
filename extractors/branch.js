const GeneratorExtractor = require('./generator')

class BranchExtractor {
  constructor() {
    this.branch = null
  }

  getBranchLoad(branch, gte, lt) {
    const generatorExtractor = new GeneratorExtractor();
    const loads = []

    branch.generators.forEach(generator => {
      const { minLoad, maxLoad } = generatorExtractor.getGeneratorLoad(generator, gte, lt)
      loads.push(minLoad, maxLoad)
    })

    loads.sort((a, b) => a.load - b.load)

    const minLoad = loads[0]
    const maxLoad = loads[loads.length - 1]

    return { minLoad, maxLoad }
  }
}

module.exports = BranchExtractor