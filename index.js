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

console.log(regions[0].branches[0].generators[0]);

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
  const minStatusLogs = 1
  const maxStatusLogs = 6
  const generatorAmount = getRandomInt(minStatusLogs, maxStatusLogs)

  let date = new Date('2024-01-01')
  let type = 'running'
  let status = 'healthy'

  for(let i = 0; i < generatorAmount; i++){
    statusLogId++
    date = new Date(date.getTime() + (1000 * 60 * 60 * getRandomInt(1, 5)))

    statusLogs.push({
      id: statusLogId,
      generatorId,
      date,
      type,
      status,
    })

    if(type == 'running') {
      type = 'stopped'
      status = 'generator malfunction'
    }
    else if(type == 'stopped' && status != 'stopped for maintenance') {
      type = 'running with issues'
      status = 'cracked parts'
    }
    else if(type == 'running with issues') {
      type = 'stopped'
      status = 'stopped for maintenance'
    }
    else if(type == 'stopped') {
      type = 'running'
      status = 'healthy'
    }
  }

  return statusLogs
}