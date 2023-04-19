import Thing from '../../../classes/thing/thing.mjs';
import WTTask from './wttask.mjs';
export default class WTThing extends Thing {
    /**
     * Create a new task and attach it to this thing
     * @param name The name of the task
     * @param description The description of the task
     * @returns The new task
     */
    newTask(name, description = '') {
        const task = new WTTask({ name: name, description: description });
        this.tasks.push(task.id);
        task.things.push(this.id);
        return task;
    }
    /**
     * Attach a task to this thing
     * @param tasks The task or tasks to attach
     */
    attachTasks(tasks) {
        if (!Array.isArray(tasks)) {
            tasks = [tasks];
        }
        tasks.forEach((task) => {
            this.tasks.push(task.id);
            task.things.push(this.id);
        });
    }
    /**
     * Make a new Thing
     * @param name The name of the thing
     * @param description The description of the thing
     * @param tasks The task IDs that the thing has
     */
    constructor(name, description = '', tasks = []) {
        super(name, description);
        this.tasks = [];
        this.name = name;
        tasks.forEach((task) => {
            this.tasks.push(task.id);
            task.things.push(this.id);
        });
    }
}
//# sourceMappingURL=wtthing.mjs.map