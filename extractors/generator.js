class GeneratorExtractor {
  constructor() {
    this.generator = null
  }

  getGeneratorLoad(generator, gte, lt) {
    const dailyLogs = generator.dailyLogs.filter(log => new Date(log.date) >= gte && new Date(log.date) <= lt)

    dailyLogs.sort((a, b) => a.load - b.load)

    const minLoad = dailyLogs[0]
    const maxLoad = dailyLogs[dailyLogs.length - 1]

    const generatorLoads = {
      id: generator.id,
      branchId: generator.branchId,
      name: generator.name,
      brand: generator.brand,
      model: generator.model,
      serialNumber: generator.serialNumber,
      installCapacity: generator.installCapacity,
      availableCapacity: generator.availableCapacity,
      minLoad,
      maxLoad,
    }

    return generatorLoads;
  }

  getGeneratorStatus(generator, dateRange, filter) {
    const { gte, lt } = dateRange
    const { state, status } = filter

    let statusLogs = generator.statusLogs.filter(log => 
      new Date(log.date) >= gte && new Date(log.date) <= lt
    )

    if(state) { statusLogs = statusLogs.filter(log => log.state == state) }
    if(status) { statusLogs = statusLogs.filter(log => log.status == status) }

    const generatorStatusLogs = {
      id: generator.id,
      branchId: generator.branchId,
      name: generator.name,
      brand: generator.brand,
      model: generator.model,
      serialNumber: generator.serialNumber,
      statusLogs,
    }

    return generatorStatusLogs
  }
}

module.exports = GeneratorExtractor