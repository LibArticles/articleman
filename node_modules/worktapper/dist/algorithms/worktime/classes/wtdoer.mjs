import Doer from '../../../classes/doer/doer.mjs';
import WTTask from './wttask.mjs';
import { WTAttachedCapability, WTAttachedSkill } from './wtqualifiers.mjs';
export default class WTDoer extends Doer {
    /**
     * Create a new task and attach it to this doer
     * @param name - The name of the task
     * @param description - The description of the task
     * @description This method creates a new task and attaches it to this doer. It also adds this doer to the task's doers array.
     * @see {@link WTTask}
     */
    newTask(name, description = '') {
        const task = new WTTask({ name: name, description: description });
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
    attachTasks(tasks) {
        if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }
        tasks.forEach((task) => {
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
    newSkillFromParent(parent, level, bias = 0) {
        const skill = new WTAttachedSkill({ parentID: parent.id, level: level, bias: bias, doerID: this.id });
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
    newCapabilityFromParent(parent, bias = 0) {
        const capability = new WTAttachedCapability({ parent: parent.id, bias: bias, doer: this.id });
        this.capabilities.push(capability.id);
        return capability;
    }
    /**
     * WTDoer constructor
     * @param config - WTDoer config object
     * @param tasks - Array of task IDs
     */
    constructor(config, tasks = []) {
        super();
        this.skillLevel = 0;
        this.skills = [];
        this.capabilities = [];
        this.tasks = [];
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
//# sourceMappingURL=wtdoer.mjs.map