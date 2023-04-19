import idGen from '../../../classes/identifier.mjs';
/**
 * A skill
 * @description This is a skill. It is used to determine the skill score of a doer.
 * @see {@link WTAttachedSkill}
 * @see {@link WTSkillRequirement}
 */
class WTSkill {
    constructor({ name, friendlyName }) {
        this.name = name;
        this.friendlyName = friendlyName;
        this.id = idGen('skill');
    }
}
/**
 * An attached skill
 * @description This is an attached skill. It is used to determine the skill score of a doer.
 * @see {@link WTSkill}
 * @see {@link WTSkillRequirement}
 * @see {@link WTDoer}
 */
class WTAttachedSkill {
    constructor(config) {
        this.bias = config.bias;
        this.level = config.level;
        this.parentID = config.parentID;
        this.doerID = config.doerID;
        this.id = idGen('attachedskill');
    }
}
class WTCapability {
    constructor({ name, friendlyName }) {
        this.name = name;
        this.friendlyName = friendlyName;
        this.id = idGen('capability');
    }
}
class WTAttachedCapability {
    constructor({ parent, bias, doer }) {
        this.bias = bias;
        this.parentID = parent;
        this.doerID = doer;
        this.id = idGen('attachedcapability');
    }
}
class WTSkillRequirement {
    /**
     * @param name - the name of the skill requirement
     * @param skillID - the ID of the skill
     * @param bias - the weight of the skill requirement
     * @param floor - the floor of the skill requirement, the lowest amount it will tolerate
     */
    constructor(name, skillID, bias = 0.1, floor = 0) {
        this.floor = 0;
        this.id = idGen('skillrequirement');
        this.biasMultiplier = bias;
        this.floor = floor;
        this.targetID = skillID;
        this.name = name;
    }
}
class WTCapabilityRequirement {
    /**
     * @param name - the name of the capability requirement
     * @param capabilityid - the ID of the capability's target
     */
    constructor(name, capabilityid) {
        this.id = idGen('capabilityrequirement');
        this.targetID = capabilityid;
        this.name = name;
    }
}
export { WTSkill, WTAttachedSkill, WTCapability, WTAttachedCapability, WTSkillRequirement, WTCapabilityRequirement };
//# sourceMappingURL=wtqualifiers.mjs.map