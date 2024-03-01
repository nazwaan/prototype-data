class GeneratorExtractor {
  constructor() {
    this.generator = null
  }

  getGeneratorLoad(generator, gte, lt) {
    const dailyLogs = generator.dailyLogs.filter(log => new Date(log.date) >= gte && new Date(log.date) <= lt);

    dailyLogs.sort((a, b) => a.load - b.load)

    const minLoad = dailyLogs[0]
    const maxLoad = dailyLogs[dailyLogs.length - 1]

    return { minLoad, maxLoad }
  }
}

module.exports = GeneratorExtractor