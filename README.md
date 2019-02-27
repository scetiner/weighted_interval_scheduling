# Product Line Optimization #

### Problem ###

Factory Management question is in the __Question.md__

### Solution ###

This application is solution that uses Weighted Interval Scheduling Algorithm with dynamic programming 
to optimize maximum production cyle in a single Product Line.
1. Sort Schedule Items by their ending time.
2. Create an array(weight array) with length of your Schedule Items.
3. Fill this table with corresponding Schedule Items weight as total weight up to this index(you can use duration if weight is not given)
4. Loop over your weight array starting with index 1.
   * Compare (current weight + previous steps total weight) vs current total weight
   * In case of higher weight is found, store it on the weight arrays current index and move forward

__Notice__: In step 4, inner loop moves backward to find most efficient and close Schedule Item

### SETUP  ###

* NodeJS v11.6.0
* NPM 6.6.0

### Dependencies ###

* Jest 24.1.0

### RUN ###

* npm install
* npm test
* npm start "path_to_json_file" => npm start "./jobs.json"
