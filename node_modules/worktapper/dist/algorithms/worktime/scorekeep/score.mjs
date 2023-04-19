import capFilter from './filters/capfilter.mjs';
import skillFilter from './filters/skillfilter.mjs';
import jobScore from './scoring/jobscore.mjs';
import skillScore from './scoring/skillscore.mjs';
/**
 *
 * @param taskID - the task's id
 * @param stateObj - the global state object
 * @returns an array of objects with the doer's id and their job score and skill score
 */
export default async function getScores(taskID, stateObj) {
    const eligibleDoers = await Promise.all([
        capFilter(taskID, stateObj),
        skillFilter(taskID, stateObj),
    ]);
    // array intersection between the two arrays
    const doersWhoCanDoTask = eligibleDoers[0].filter((doerID) => eligibleDoers[1].includes(doerID));
    /**
     *
     * @param doerID - the doer's id
     * @returns an array of the doer's job score and skill score
     */
    async function scoreDoer(doerID) {
        return Promise.all([
            jobScore(doerID, stateObj),
            skillScore(doerID, taskID, stateObj),
        ]);
    }
    const scores = {};
    const scorePromises = [];
    /**
     *
     * @param doerArray - an array of doer ids
     */
    async function getDoerScores(doerArray) {
        for (let i = 0; i < doerArray.length; i++) {
            const doerID = doerArray[i];
            // add the promise to an array of promises
            scorePromises.push(scoreDoer(doerID).then((score) => {
                scores[doerID] = {
                    job: score[0],
                    skill: score[1],
                };
            }));
        }
    }
    // get the scores for all the doers who can do the task
    await getDoerScores(doersWhoCanDoTask);
    // wait for all the promises to resolve
    await Promise.all(scorePromises);
    stateObj.scores = scores;
    return scores;
}
//# sourceMappingURL=score.mjs.map