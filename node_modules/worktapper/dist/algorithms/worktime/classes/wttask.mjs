import Task from '../../../classes/thing/task.mjs';
export default class WTTask extends Task {
    attachToThings(things) {
        if (!Array.isArray(things)) {
            things = [things];
        }
        things.forEach((thing) => {
            thing.tasks.push(this.id);
            this.things.push(thing.id);
        });
    }
    attachToDoers(doers) {
        if (!Array.isArray(doers)) {
            doers = [doers];
        }
        doers.forEach((doer) => {
            doer.tasks.push(this.id);
            this.doers.push(doer.id);
        });
    }
    addSkillRequirement(skill) {
        this.needsSkills.push(skill.id);
    }
    addCapabilityRequirement(capability) {
        this.needsCapabilities.push(capability.id);
    }
    constructor(config) {
        super(config.name, config.description);
        this.needsSkills = [];
        this.needsCapabilities = [];
        this.things = [];
        this.doers = [];
        this.isDone = false;
    }
}
//# sourceMappingURL=wttask.mjs.map