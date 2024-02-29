const { getRandomInt, writeFile } = require('./helpers')
const regions = require('./seeds/regions.seeder')
const branches = require('./seeds/branch.seeder')

const startDate = new Date('2024-01-01')
const stopDate = new Date('2024-03-01')

let generatorId = 0;
let statusLogId = 0;
let dailyLogId = 0;

const brands = [
  "VOLVO",
  "CUMMINS",
];

const generateModels = () => { return [
  `KTA${getRandomInt(5, 40)}`,
  `6CTA${getRandomInt(3, 9)}`,
  `6CTAA${getRandomInt(3, 9)}`,
  `6CTAB.${getRandomInt(3, 9)}`,
  `NT-${getRandomInt(800, 900)}`,
  `NTA${getRandomInt(10, 20)}`,
  `QSL${getRandomInt(1, 9)}`,
]}

regions.forEach(region => {
  const regionBranches = [];

  branches.forEach(branch => {
    if(branch.regionId == region.id){
      const { branchGenerators, branchAvailableCapacity } = genGenerator(branch.id)
      const branchDailyLogs = dailyLogGenerator(branchAvailableCapacity)

      branch.dailyLogs = branchDailyLogs
      branch.generators = branchGenerators

      regionBranches.push(branch);
    }
  });

  region.branches = regionBranches;
})

writeFile(regions);

// functions

function genGenerator(branchId) {
  const branchGenerators = []
  const minGenerators = 3
  const maxGenerators = 8
  const generatorAmount = getRandomInt(minGenerators, maxGenerators)

  let branchAvailableCapacity = 0;

  for(let i = 0; i < generatorAmount; i++){
    generatorId++;
    const models = generateModels()
    const installCapacity = getRandomInt(2, 9) * 100
    const availableCapacity = installCapacity - (getRandomInt(2, 9) * 10)
    branchAvailableCapacity += availableCapacity;

    branchGenerators.push({
      id: generatorId,
      branchId,
      name: `G${i + 1}`,
      brand: brands[getRandomInt(1, brands.length) - 1],
      models: `${models[getRandomInt(1, models.length) - 1]}-G${i + 1}`,
      serialNumber: new Date().valueOf() + (generatorId * 834784) + '',
      installCapacity,
      availableCapacity,
    })
  }

  branchGenerators.forEach(branchGenerator => {
    const statusLogs = statusLogGenerator();
    branchGenerator.statusLogs = statusLogs;
  });

  return { branchGenerators, branchAvailableCapacity };
}

function statusLogGenerator() {
  const statusLogs = []

  statusLogId++;

  let statusData = {
    id: statusLogId,
    generatorId,
    date: startDate,
    status: 'running',
    description: 'healthy',
  }

  statusLogs.push(statusData);

  for(
    let date = new Date(startDate.getTime() + (1000 * 60 * 30));
    date < stopDate;
    date = new Date(date.getTime() + (1000 * 60 * 30))
  ) {
    const makeLogChance = getRandomInt(1, 500);
    if(makeLogChance <= 1) {
      statusLogId++
      statusData.date = date
      statusData = statusDataGenerator(statusData)

      statusLogs.push(statusData)
    }
  }

  return statusLogs
}

function statusDataGenerator(statusData) {
  let { status, description } = statusData

  if(status == 'running') {
    status = 'stopped'
    description = 'generator malfunction'
  }
  else if(status == 'stopped' && description != 'stopped for maintenance') {
    status = 'running with issues'
    description = 'cracked parts'
  }
  else if(status == 'running with issues') {
    status = 'stopped'
    description = 'stopped for maintenance'
  }
  else if(status == 'stopped') {
    status = 'running'
    description = 'healthy'
  }

  const newStatusData = {
    id: statusLogId,
    generatorId,
    date: statusData.date,
    status,
    description,
  }

  return newStatusData
}

function dailyLogGenerator(branchAvailableCapacity) {
  const dailyLogs = []

  for(
    let date = startDate;
    date < stopDate;
    date = new Date(date.getTime() + (1000 * 60 * 60 * 24))
  ) {
    dailyLogId++;

    dailyLogs.push({
      id: dailyLogId,
      date,
      load: getRandomInt(1, branchAvailableCapacity),
    })
  }

  // dailyLogId++;

  // dailyLogs.push({
  //   id: dailyLogId,
  //   date: startDate,
  //   load: 500,
  // })

  return dailyLogs
}