/**
 * @jest-environment node
 */

global.console = {
    log: jest.fn(),
    error: jest.fn()
}

const ProductLineOptimizer = require("./../ProductLineOptimizer");

describe("Product Line Optimizer", () => {
  const optimizer = new ProductLineOptimizer();

  afterAll(async done => {
    done();
  });

  it("can optimize ScheduleList with ending time", async done => {
    const jobs = [
      {
        startingDay: "2018-01-02T00:00:00.000Z",
        duration: 5
      },
      {
        startingDay: "2018-01-09T00:00:00.000Z",
        duration: 7
      },
      {
        startingDay: "2018-01-15T00:00:00.000Z",
        duration: 6
      },
      {
        startingDay: "2018-01-09T00:00:00.000Z",
        duration: 3
      }
    ];
    let result = optimizer.getOptimizedCycleCount(jobs);
    expect(result).not.toBeNull();
    expect(result.productionCycle).toBe(3);
    done();
  });

  it("can optimize empty ScheduleList", async done => {
    let result = optimizer.getOptimizedCycleCount([]);
    expect(result).not.toBeNull();
    expect(result.productionCycle).toBe(0);
    done();
  });

  it("cannot optimize list with invalid ScheduleItems", async done => {
    const jobs = [
      {
        serif: "2018-01-02T00:00:00.000Z",
        duration: 5
      },
      {
        startingDay: "2018-01-09T00:00:00.000Z",
        duration: 7
      }
    ];
    expect(() => {
      optimizer.getOptimizedCycleCount(jobs);
    }).toThrow("Invalid Schedule Item");
    done();
  });

  it("can calculate Max Valued ScheduleItem in an Array", async done => {
    const jobs = [
      {
        totalDuration: 5
      },
      {
        flag: false,
        totalDuration: 7
      },
      {
        totalDuration: 6
      },
      {
        flag: true,
        totalDuration: 7
      }
    ];
    let max = jobs.reduce(optimizer._maxProcutionReducer);
    expect(max).not.toBeNull();
    expect(max.totalDuration).toBe(7);
    expect(max.flag).toBeTruthy();
    done();
  });

  it("can compare overlapping items if sorted by ending time", async done => {
    let jobs = [
        {startingTime: 3,endingTime:4},
        {startingTime: 1,endingTime:5},
        {startingTime: 6,endingTime:10}
    ];
    let isOverlapping = optimizer._hasIntersection(jobs[0],jobs[1]);    
    expect(isOverlapping).toBeTruthy();
    
    isOverlapping = optimizer._hasIntersection(jobs[0],jobs[2]);    
    expect(isOverlapping).toBeFalsy();
    done();
  });


  it("can sort and enrich ScheduleList with related fields", async done => {
    const jobs = [
        {
          startingDay: "2018-01-02T00:00:00.000Z",
          duration: 5
        },
        {
          startingDay: "2018-01-09T00:00:00.000Z",
          duration: 7
        },
        {
          startingDay: "2018-01-15T00:00:00.000Z",
          duration: 6
        },
        {
          startingDay: "2018-01-09T00:00:00.000Z",
          duration: 3
        }
      ];
      let result = optimizer._getSortedJobs(jobs);
      expect(result).not.toBeNull();
      let lastItem = result[result.length-1];
      expect(lastItem.startingDay).toBe("2018-01-15T00:00:00.000Z");
      expect(lastItem).toHaveProperty("startingTime");
      expect(lastItem).toHaveProperty("endingTime");
      expect(lastItem).toHaveProperty("cycle");
      expect(lastItem).toHaveProperty("production");
      expect(lastItem).toHaveProperty("totalProduction");
      done();
  });

  it("cannot calculate optimized cycle count if there is invalid items in the list", async done => {
    const jobs = [
        {
          startingDay: "2018-01-02T00:00:00.000Z",
          duration: 5
        },
        {
          startingDay: "2018-01-09T00:00:00.000Z",
          duration: 7
        },
        {
          startingDay: "2018-01-15T00:00:00.000Z",
          duration: 6
        },
        {
          endingDay: "2018-01-09T00:00:00.000Z",
          duration: 3,
          invalidItem: true
        }
      ];
      expect(() => {
        optimizer._getSortedJobs(jobs);
      }).toThrow("Invalid Schedule Item");
     
      done();
  });
});
