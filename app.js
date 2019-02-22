const ProductLineOptimizer = require('./ProductLineOptimizer');

const optimizer = new ProductLineOptimizer();

const jobs = require(process.argv[2]);
console.log(optimizer.getOptimizedCycleCount(jobs));