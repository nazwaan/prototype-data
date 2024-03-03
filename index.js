const BranchExtractor = require('./extractors/branch')
const branchExtractor = new BranchExtractor()

const gte = new Date('2024-02-01')
const lt = new Date('2024-02-29')

// get branch maximum and minimum load with in a time range
// const branchLoads = branchExtractor.getBranchLoad(6, gte, lt)
// console.dir(branchLoads)

// get branch generators status logs with in a time range and according to filters
// const timeRange = { gte, lt }
// const filter = { status: 'issues' }
// const branchStatus = branchExtractor.getBranchStatus(6, timeRange, filter)
// console.dir(branchStatus)