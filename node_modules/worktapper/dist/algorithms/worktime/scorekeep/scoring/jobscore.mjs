// get a score from 0 to 1 for how many jobs a doer has at this moment, accounting for difficulty of the jobs they have.
/**
 *
 * @param doerID - the doer's id
 * @param stateObj - the global state object
 * @returns - the doer's job score
 */
export default async function jobScore(doerID, stateObj) {
    const doer = stateObj.doers[doerID];
    const taskDiffs = [];
    doer.tasks.forEach((taskID) => {
        const testTask = stateObj.tasks[taskID];
        const taskDifficulty = testTask.needsSkills.length;
        let taskScore = 1 - (10 * taskDifficulty);
        if (testTask.isDone) {
            taskScore = taskScore * 0.6;
        }
        else if (!testTask.isReady) {
            taskScore = taskScore * 0.3;
        }
        taskDiffs.push(taskScore);
    });
    // add all items in the array together
    return Math.max(1 - (taskDiffs.reduce((a, b) => a + b, 0)), 0);
}
//# sourceMappingURL=jobscore.mjs.map