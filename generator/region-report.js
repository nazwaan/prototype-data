const { getRandomInt, writeFile } = require('../helpers')
const regions = require('../seeds/regions.seeder')
const branches = require('../seeds/branch.seeder')

const startDate = new Date('2024-01-01')
const stopDate = new Date('2024-04-01')

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
      const branchGenerators = genGenerator(branch.id)

      branch.generators = branchGenerators

      regionBranches.push(branch);
    }
  });

  region.branches = regionBranches;
})

writeFile(regions, './reports/report.json');

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
    let model = `${models[getRandomInt(1, models.length) - 1]}`

    if(getRandomInt(1, 10) <= 2) { model += `-G${i + 1}` }

    branchGenerators.push({
      id: generatorId,
      branchId,
      name: `G${i + 1}`,
      brand: brands[getRandomInt(1, brands.length) - 1],
      model,
      serialNumber: new Date().valueOf() + (generatorId * 834784) + '',
      installCapacity,
      availableCapacity,
    })
  }

  branchGenerators.forEach(branchGenerator => {
    const { availableCapacity } =  branchGenerator
    const dailyLogs = dailyLogGenerator(availableCapacity)
    const statusLogs = statusLogGenerator()

    branchGenerator.dailyLogs = dailyLogs
    branchGenerator.statusLogs = statusLogs
  });

  return branchGenerators;
}

function statusLogGenerator() {
  const statusLogs = []

  statusLogId++;

  let statusData = {
    id: statusLogId,
    generatorId,
    date: startDate,
    state: 'running',
    status: 'healthy',
    title: 'routine check and found healthy',
    description: 'routine check and found healthy',
  }

  statusLogs.push(statusData);

  for(
    let date = new Date(startDate.getTime() + (1000 * 60 * 30));
    date < stopDate;
    date = new Date(date.getTime() + (1000 * 60 * 30))
  ) {
    let makeLogChance

    if(statusData.state == 'running' && statusData.status == 'healthy') {
      makeLogChance = getRandomInt(1, 2000);
    } else {
      makeLogChance = getRandomInt(1, 50);
    }

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
  let { state, status, title, description } = statusData

  if(state == 'running' && status == 'healthy') {
    state = 'stopped'
    status = 'issues'
    title = 'generator malfunction'
    description = 'generator malfunction'
  }
  else if(state == 'stopped' && title != 'stopped for maintenance') {
    state = 'running'
    status = 'issues'
    title = 'cracked parts'
    description = 'cracked parts'
  }
  else if(state == 'running' && status == 'issues') {
    state = 'stopped'
    status = 'issues'
    title = 'stopped for maintenance'
    description = 'stopped for maintenance'
  }
  else if(state == 'stopped') {
    state = 'running'
    status = 'healthy'
    title = 'maintenance service done and healthy'
    description = 'maintenance service done and healthy'
  }

  const newStatusData = {
    id: statusLogId,
    generatorId,
    date: statusData.date,
    state,
    status,
    title,
    description,
  }

  return newStatusData
}

function dailyLogGenerator(availableCapacity) {
  const dailyLogs = []
  const minLoad = availableCapacity - Math.floor(availableCapacity * 0.8)
  const maxLoad = availableCapacity - Math.floor(availableCapacity * 0.2)

  for(
    let date = startDate;
    date < stopDate;
    date = new Date(date.getTime() + (1000 * 60 * 60 * 24))
  ) {
    dailyLogId++;

    dailyLogs.push({
      id: dailyLogId,
      date,
      load: getRandomInt(minLoad, maxLoad),
    })
  }

  return dailyLogs
}