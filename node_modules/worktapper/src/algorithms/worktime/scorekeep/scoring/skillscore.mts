import * as Qualifiers from '../../classes/wtqualifiers.mjs';
import { Stator } from '../../classes/globalstate.mjs';

// based on a doer's skill level and the difficulty of any task, this function will return an object with the doer's id and their skill score. this score is made up of the difficulty of the task subtracted from the skill level in such a way that the end result is between 0 and 1.

/**
 *
 * @param doerID - the doer's id
 * @param taskID - the task's id
 * @param stateObj - the global state object
 * @returns the doer's skill score
 */
export default async function skillScore(doerID: string, taskID: string, stateObj: Stator){
  const doer = stateObj.doers[doerID];
  const task = stateObj.tasks[taskID];

  const skillScores: number[] = [];

  task.needsSkills.forEach((skillID: string) => {
    const skillRequirement = stateObj.qualifiers.skillRequirements[skillID]; // this is the skill requirement object
    const originalSkill = stateObj.qualifiers.skills[skillRequirement.targetID]; // this is the skill object

    const doerSkills: Qualifiers.WTAttachedSkill[] = [];
    doer.skills.forEach((currentSkillID: string) => {
      doerSkills.push(stateObj.qualifiers.attachedSkills[currentSkillID]);
    });

    const attachedSkill = doerSkills.find((currentAttachedSkill: Qualifiers.WTAttachedSkill) => currentAttachedSkill.parentID === originalSkill.id);

    if (!attachedSkill) {
      return;
    }

    skillScores.push((skillRequirement.difficulty * (attachedSkill.level / 100)));
  });
  const skillScoreAverage = (skillScores.reduce((a, b) => a + b, 0) / skillScores.length) / 100;
  return skillScoreAverage;
}
