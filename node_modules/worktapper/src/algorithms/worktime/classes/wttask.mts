import Task from '../../../classes/thing/task.mjs';
import WTDoer from './wtdoer.mjs';
import WTThing from './wtthing.mjs';
import {WTCapabilityRequirement, WTSkillRequirement} from './wtqualifiers.mjs';

export default class WTTask extends Task {
  name: string;
  needsSkills: string[] = [];
  needsCapabilities: string[] = [];
  things: string[] = [];
  doers: string[] = [];
  isDone = false;
  isReady: boolean;

  attachToThings(things: WTThing[] | WTThing) {
    if (!Array.isArray(things)) {
      things = [things];
    }
    things.forEach((thing: WTThing) => {
      thing.tasks.push(this.id);
      this.things.push(thing.id);
    });
  }

  attachToDoers(doers: WTDoer[] | WTDoer) {
    if (!Array.isArray(doers)) {
      doers = [doers];
    }
    doers.forEach((doer: WTDoer) => {
      doer.tasks.push(this.id);
      this.doers.push(doer.id);
    });
  }

  addSkillRequirement(skill: WTSkillRequirement) {
    this.needsSkills.push(skill.id);
  }

  addCapabilityRequirement(capability: WTCapabilityRequirement) {
    this.needsCapabilities.push(capability.id);
  }

  constructor(config: {name: string, description: string}) {
    super(config.name, config.description);
  }
}
