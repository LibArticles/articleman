/**
 * A global state object
 */
class Stator {
    constructor() {
        this.doers = {};
        this.tasks = {};
        this.things = {};
        this.qualifiers = {
            capabilityRequirements: {},
            skillRequirements: {},
            capabilities: {},
            skills: {},
            attachedCapabilities: {},
            attachedSkills: {},
        };
        this.scores = {};
    }
}
const state = new Stator();
export { state, Stator };
//# sourceMappingURL=globalstate.mjs.map