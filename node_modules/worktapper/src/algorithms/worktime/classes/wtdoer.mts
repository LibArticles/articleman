import Doer from '../../../classes/doer/doer.mjs';
import WTTask from './wttask.mjs';
import { WTAttachedCapability, WTAttachedSkill, WTCapability, WTSkill } from './wtqualifiers.mjs';

/**
 * A config object for WTDoer.
 */
interface ConfigObject {

  /**
   * The name of the doer
   */
  name: string;

  /**
   * The skill level of the doer
   * @default 0
   * @description This is the skill level of the doer. It is used to determine the doer's skill score.
   */
  skillLevel: number;

  /**
   * The doer's dogpile bias level
   * @default 0
   * @description This is the dogpile bias level of the doer. It is used to reduce the amount of work on a doer's plate, therefore avoiding a dogpile.
   */
  dogpileBias: object;

  /**
   * The doer's skills
   * @default []
   * @description This is an array of the doer's WTAttachedSkill IDs. It is used to determine the doer's skill score.
   * @see {@link WTSkill}
   * @see {@link WTAttachedSkill}
   * @see {@link WTSkillRequirement}
   */
  skills: string[];

  /**
   * The doer's capabilities
   * @default []
   * @description This is an array of the doer's WTAttachedCapability IDs. It is used to determine what tasks a doer can work on.
   * @see {@link WTCapability}
   * @see {@link WTAttachedCapability}
   * @see {@link WTCapabilityRequirement}
   * @see {@link WTTask}
   */
  capabilities: string[];
}

export default class WTDoer extends Doer {
  skillLevel = 0;
  skills: string[] = [];
  capabilities: string[] = [];
  tasks: string[] = [];
  name: string;

  /**
   * Create a new task and attach it to this doer
   * @param name - The name of the task
   * @param description - The description of the task
   * @description This method creates a new task and attaches it to this doer. It also adds this doer to the task's doers array.
   * @see {@link WTTask}
   */
  newTask(name: string, description = '') {
    const task = new WTTask({name: name, description: description});
    this.tasks.push(task.id);
    task.doers.push(this.id);
    return task;
  }

  /**
   * Attach a task to this doer
   * @param tasks - The task(s) to attach
   * @description This method attaches a task to this doer. It also adds this doer to the task's doers array.
   * @see {@link WTTask}
   */
  attachTasks(tasks: WTTask[] | WTTask) {
    if (!Array.isArray(tasks)) {
      tasks = [tasks];
    }
    tasks.forEach((task: WTTask) => {
      this.tasks.push(task.id);
      task.doers.push(this.id);
    });
  }

  /**
   * Create a new skill and attach it to this doer
   * @param parent - The parent skill
   * @param level - The level of the skill
   * @param bias - The bias of the skill
   * @description This method creates a new skill and attaches it to this doer. It also adds this doer to the skill's doers array.
   * @returns The new skill
   * @see {@link WTSkill}
   * @see {@link WTAttachedSkill}
   * @see {@link WTSkillRequirement}
   */
  newSkillFromParent(parent: WTSkill, level: number, bias = 0) {
    const skill = new WTAttachedSkill({parentID: parent.id, level: level, bias: bias, doerID: this.id});
    this.skills.push(skill.id);
    return skill;
  }

  /**
   * Create a new capability and attach it to this doer
   * @param parent - The parent capability
   * @param bias - The bias of the capability
   * @description This method creates a new capability and attaches it to this doer.
   * @returns The new capability
   * @see {@link WTCapability}
   * @see {@link WTAttachedCapability}
   * @see {@link WTCapabilityRequirement}
   */
  newCapabilityFromParent(parent: WTCapability, bias = 0) {
    const capability = new WTAttachedCapability({parent: parent.id, bias: bias, doer: this.id});
    this.capabilities.push(capability.id);
    return capability;
  }

  /**
   * WTDoer constructor
   * @param config - WTDoer config object
   * @param tasks - Array of task IDs
   */
  constructor(config: ConfigObject, tasks: string[] = []) {
    super();
    if (!config.name) {
      throw new Error('WTDoer requires a name');
    }
    this.name = config.name;
    this.skillLevel = config.skillLevel;
    this.skills = config.skills;
    this.capabilities = config.capabilities;
    this.tasks = tasks;
  }
}

export {ConfigObject};
