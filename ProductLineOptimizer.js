module.exports = class ProductLineOptimizer {
  constructor() {    
  }

  /**
   * Returns a new Array which is sorted by ending time of jobs and
   * enriched with cycle, production and totalProduction to use in Weighted Interval Scheduling Algorithm
   * @param {Array of ScheduleItem} scheduleList List to be sorted
   * @throws Invalid Schedule Item
   */
  _getSortedJobs(scheduleList) {
    const DAY_MILLIS = 1000 * 60 * 60 * 24;
    return scheduleList.sort((a, b) => {
      if (
        !a.hasOwnProperty("duration") ||
        !a.hasOwnProperty("startingDay") ||
        !b.hasOwnProperty("duration") ||
        !b.hasOwnProperty("startingDay")
      ) {
        throw new Error("Invalid Schedule Item");
      }
      //start
      // WIS Algorithm related values to change if there will be a weight in the future
      // production => current items production weight
      // totalProduction => to calculate if the item efficiency on product line
      // cycle => assignment specific count to see how many jobs can be scheduled at that time
      a.cycle = 1;
      b.cycle = 1;
      a.production = a.duration;
      a.totalProduction = a.duration;
      b.production = b.duration;
      b.totalProduction = b.duration;
      //end

      // using numeric time to fix timezone issues.
      a.startingTime = new Date(a.startingDay).getTime();
      a.endingTime = a.startingTime + a.duration * DAY_MILLIS;
      b.startingTime = new Date(b.startingDay).getTime();
      b.endingTime = b.startingTime + b.duration * DAY_MILLIS;
      return a.endingTime - b.endingTime;
    });
  }

  /**
   * Compares two ScheduledItems assuming Items are sorted by endingTime
   * @param {ScheduleItem} s1 Schedule Item 1 to compare
   * @param {ScheduleItem} s2 Schedule Item 2 to compare
   */
  _hasIntersection(s1, s2) {
    return s1.endingTime > s2.startingTime;
  }

  /**
   * Returns Schedule item which has the MAX totalProduction value
   * @param {ScheduleItem} accumulator ScheduleItem which has max totalProduction value
   * @param {ScheduleItem} cursor ScheduleItem of the reducer index
   */
  _maxProcutionReducer(accumulator, cursor) {
    return accumulator.totalProduction > cursor.totalProduction
      ? accumulator
      : cursor;
  }
  /**
   * This method calculates the optimum schedule item count to utilize the product line.
   * NOTICE: Weighted Interval Scheduling Algorithm is used for solution.
   * @param {[ScheduleItem]} scheduleList ScheduleItem list
   * @throws {Error} Invalid Schedule Item or Generic Error
   */
  getOptimizedCycleCount(scheduleList) {
    // WIS is dynamic programming solution for this scheduling with following steps
    // 1- sort the list according to job finish time
    // 2- create a list considering sorted list index and store inital  weights(production in this case)
    // 3- loop over sorted list and compare,
    //      (current production value + previous steps total production value) vs current total production value
    // 4- in case of higher production value is found, store it an move forward.
    // notice: in step 3, second loop moves backward to find most efficient and close production item

    try {
      let maxProfitTable = this._getSortedJobs(scheduleList);
      for (let i = 1; i < maxProfitTable.length; i++) {
        const index = maxProfitTable[i];
        for (let j = i - 1; j >= 0; j--) {
          const cursor = maxProfitTable[j];
          if (!this._hasIntersection(cursor, index)) {
            let currentProfit = index.production + cursor.totalProduction;
            if (currentProfit > index.totalProduction) {
              maxProfitTable[i].totalProduction = currentProfit;
              maxProfitTable[i].cycle += maxProfitTable[j].cycle;
              break;
            }
          }
        }
      }
      return {
        productionCycle: maxProfitTable.reduce(this._maxProcutionReducer, {
          totalProduction: 0,
          cycle: 0
        }).cycle
      };
    } catch (error) {
      console.error("getOptimizedCycleCount got error", error);
      throw error;
    }
  }
};
