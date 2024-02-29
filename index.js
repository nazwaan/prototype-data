const { getRandomInt, writeFile } = require('./helpers')
const regions = require('./seeds/regions.seeder')
const branches = require('./seeds/branch.seeder')

let generatorId = 0;
let statusLogId = 0;

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
      const branchGenerators = genGenerator(branch.id);

      branch.generators = branchGenerators;
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

  for(let i = 0; i < generatorAmount; i++){
    generatorId++;
    const models = generateModels()
    const installCapacity = getRandomInt(2, 9) * 100
    const availableCapacity = installCapacity - (getRandomInt(2, 9) * 10)
    const statusLogs = statusLogGenerator();

    branchGenerators.push({
      id: generatorId,
      branchId,
      name: `G${i + 1}`,
      brand: brands[getRandomInt(1, brands.length) - 1],
      models: `${models[getRandomInt(1, models.length) - 1]}-G${i + 1}`,
      serialNumber: new Date().valueOf() + (generatorId * 834784) + '',
      installCapacity,
      availableCapacity,
      statusLogs,
    })
  }

  return branchGenerators;
}

function statusLogGenerator() {
  const statusLogs = []
  const startDate = new Date('2024-01-01')
  const stopDate = new Date('2024-03-01')

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