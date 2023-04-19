import WTDoer from './wtdoer.mjs';
import WTTask from './wttask.mjs';
import WTThing from './wtthing.mjs';
import * as Qualifiers from './wtqualifiers.mjs';

/**
 * Qualifier records
 */
interface QualifierObj {
  capabilityRequirements: Record<string, Qualifiers.WTCapabilityRequirement>;
  skillRequirements: Record<string, Qualifiers.WTSkillRequirement>;
  capabilities: Record<string, Qualifiers.WTCapability>;
  skills: Record<string, Qualifiers.WTSkill>;
  attachedCapabilities: Record<string, Qualifiers.WTAttachedCapability>;
  attachedSkills: Record<string, Qualifiers.WTAttachedSkill>;
}

export interface ScoreObj {
  job: number;
  skill: number;
}

/**
 * A global state object
 */
class Stator {
  doers: Record<string, WTDoer> = {};
  tasks: Record<string, WTTask> = {};
  things: Record<string, WTThing> = {};
  qualifiers: QualifierObj = {
    capabilityRequirements: {},
    skillRequirements: {},
    capabilities: {},
    skills: {},
    attachedCapabilities: {},
    attachedSkills: {},
  };
  scores: Record<string, ScoreObj> = {};
}

const state = new Stator();
export { state, Stator };
