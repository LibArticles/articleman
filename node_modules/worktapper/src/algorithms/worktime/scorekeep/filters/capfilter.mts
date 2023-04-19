import * as Qualifiers from '../../classes/wtqualifiers.mjs';
import { Stator } from '../../classes/globalstate.mjs';


// the way this system works is simple:
// 1. a capability is created
// 2. a matching capability requirement is created, with the target capability ID attached, matching the ID of the capability
// 3. an attached capability is created, with the parent capability id attached. This is the capability that the doer has.
// 4. the way to find the doers who have a capability is to find
/**
 *
 * @param taskID - the ID of the task
 * @param stateObj - the global state object
 * @returns an array of doer IDs
 */
export default async function doersWhoHaveCapabilities(taskID: string, stateObj: Stator){
  const task = stateObj.tasks[taskID];
  const theDoersWhoHaveCapabilities: string[] = [];

  task.needsCapabilities.forEach((capabilityID: string) => {
    const capabilityRequirement = stateObj.qualifiers.capabilityRequirements[capabilityID];
    const originalCapability = stateObj.qualifiers.capabilities[capabilityRequirement.targetID];
    const attachedCapabilities = Object.values(stateObj.qualifiers.attachedCapabilities).filter((attachedCapability: Qualifiers.WTAttachedCapability) => attachedCapability.parentID === originalCapability.id);

    attachedCapabilities.forEach((attachedCapability: Qualifiers.WTAttachedCapability) => {
      const doer = stateObj.doers[attachedCapability.doerID];
      theDoersWhoHaveCapabilities.push(doer.id);
    });
  });
  return theDoersWhoHaveCapabilities;
}
