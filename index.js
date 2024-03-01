const report = require('./report.json')
const BranchExtractor = require('./extractors/branch')
const GeneratorExtractor = require('./extractors/generator')

const branchExtractor = new BranchExtractor()
const generatorExtractor = new GeneratorExtractor()

const branch = report[0].branches[0]
const generator = branch.generators[0]

const gte = new Date('2024-02-01')
const lt = new Date('2024-02-29')

// get branch maximum and minimum load with in a time range
// const branchLoads = branchExtractor.getBranchLoad(branch, gte, lt)

// get generator maximum and minimum load with in a time range
// const generatorLoads = generatorExtractor.getGeneratorLoad(generator, gte, lt)

// console.log({ branchLoads })
// console.log({ generatorLoads })